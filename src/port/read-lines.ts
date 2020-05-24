// This exports a function that emulates the readLines function from
// https://deno.land/std@v0.51.0/io/bufio.ts
import stream from "stream";
import readline from "readline";

export async function *readLines(s: string | stream.Readable): AsyncIterableIterator<string> {
  let input = typeof s !== "string" ? s : stream.Readable.from(s);

  const rl = readline.createInterface({ input });

  for await (const line of rl) {
    yield line;
  }
}