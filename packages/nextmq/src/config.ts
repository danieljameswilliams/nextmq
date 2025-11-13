// src/config.ts
// This file is server-safe - no 'use client' directive
// Functions here can be used in both server and client components

// Only import types, not implementations, to keep this file server-safe
import type { Processor } from './JobQueue';

/**
 * Configuration object that maps job types to their handler module paths.
 * Paths should be relative to where the config is defined (typically your app directory).
 */
export interface NextMQConfig {
  [jobType: string]: string;
}

/**
 * Creates a NextMQ configuration object that maps job types to handler paths.
 * 
 * @example
 * ```ts
 * // app/processors.ts
 * import { defineNextMQConfig } from 'nextmq';
 * 
 * export const processorConfig = defineNextMQConfig({
 *   'cart.add': './handlers/cartAdd',
 *   'cart.remove': './handlers/cartRemove',
 * });
 * ```
 * 
 * @param handlers - Object mapping job types to handler module paths (relative to config file)
 * @returns Configuration object for use with NextMQClientProvider
 */
export function defineNextMQConfig(handlers: Record<string, string>): NextMQConfig {
  return handlers;
}

/**
 * Generates processor code as a string from a config object.
 * This allows you to create a processor with static imports that Next.js can analyze.
 * 
 * @example
 * ```ts
 * import { generateProcessorCode } from 'nextmq';
 * 
 * const code = generateProcessorCode({
 *   'cart.add': './handlers/cartAdd',
 *   'cart.remove': './handlers/cartRemove',
 * });
 * // Copy the generated code into your processor file
 * ```
 * 
 * @param config - NextMQ configuration object
 * @returns Processor code as a string with static imports
 */
export function generateProcessorCode(config: NextMQConfig): string {
  const cases = Object.entries(config)
    .map(([jobType, handlerPath]) => {
      return `    case '${jobType}': {
      const handler = await import('${handlerPath}');
      return handler.default(job);
    }`;
    })
    .join('\n');

  return `import type { Processor } from 'nextmq';

const processor: Processor = async (job) => {
  switch (job.type) {
${cases}
    default:
      console.warn('[nextmq] Unknown job type:', job.type);
  }
};

export default processor;
export { processor };`;
}


