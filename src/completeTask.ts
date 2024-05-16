import OpenAI from "openai";
import { type Page, TaskMessage, TaskResult } from "./types";
import { prompt } from "./prompt";
import { createActions } from "./createActions";

import Keyv, { KeyvHooks } from '@keyvhq/core'
import KeyvFile from "keyv-file";
import memoize from "@keyvhq/memoize"
import { AUTO_PLAYWRIGHT_DEBUG, OPEN_AI_MODEL } from "./config";

const storage = new KeyvFile({
  filename: 'local.json'
})

// not sure how to fix this
const cacheOptions: Keyv.Options<any> = {
  store: storage as unknown as Keyv.Store<any>,
}

const cache = new Keyv(cacheOptions)


const defaultDebug = AUTO_PLAYWRIGHT_DEBUG === "true";

console.log(`defaultDebug: ${defaultDebug}`)

export const baseCompleteTask = async (
  page: Page,
  task: TaskMessage
): Promise<TaskResult> => {
  console.log(task.options)
  const openai = new OpenAI({ apiKey: task.options?.openaiApiKey });

  let lastFunctionResult: null | { errorMessage: string } | { query: string } =
    null;

  const actions = createActions(page);

  const debug = task.options?.debug ?? defaultDebug;
  console.log(`debug: ${debug}`)

  const runner = openai.beta.chat.completions
    .runFunctions({
      model: task.options?.model ?? OPEN_AI_MODEL,
      messages: [{ role: "user", content: prompt(task) }],
      functions: Object.values(actions),
    })
    .on("message", (message) => {
      if (debug) {
        console.log("> message", message);
      }

      if (
        message.role === "assistant" &&
        message.function_call?.name.startsWith("result")
      ) {
        lastFunctionResult = JSON.parse(message.function_call.arguments);
      }
    });

  const finalContent = await runner.finalContent();

  if (debug) {
    console.log("> finalContent", finalContent);
  }

  if (!lastFunctionResult) {
    throw new Error("Expected to have result");
  }

  if (debug) {
    console.log("> lastFunctionResult", lastFunctionResult);
  }

  return lastFunctionResult;
};

export const completeTask = memoize(baseCompleteTask, cache, {
  key: (page: Page, task: TaskMessage) => `${task.snapshot.dom}-${task.task}`,
})