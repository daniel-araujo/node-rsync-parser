// Exports a function that does the minimum to replace Deno.test

export function test(description: string, fn: any) {
  it(description, fn);
}