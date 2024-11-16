import { Code, saveToFile, loadFromFile } from "./code.ts";
import { skipFirst, mapIterable } from "./utils.ts";

if (Deno.args.length < 2) {
    console.error("Usage: deno run --allow-read --allow-write merge.ts <input-file1> <input-file2> ... <output-file>");
    Deno.exit(1);
}

// Extract arguments
const inputFiles = Deno.args.slice(0, -1); // All but the last argument
const outputFile = Deno.args[Deno.args.length - 1]; // The last argument

async function* fileContentGenerator(fileNames: Iterable<string>): AsyncGenerator<Code[]> {
    const results = await Promise.all(mapIterable(fileNames, loadFromFile));

    for (const result of results) {
        yield result;
    }
}

function unionTwoArrays(array1: Code[], array2: Code[]): Code[] {
    const codeMap = new Map<string, Code>();

    // Process the first array
    for (const obj of array1) {
        codeMap.set(obj.code, obj);
    }

    // Process the second array
    for (const obj of array2) {
        if (codeMap.has(obj.code)) {
            const existing = codeMap.get(obj.code)!;

            // Determine which object to keep
            const existingPropCount = Object.keys(existing).length;
            const newPropCount = Object.keys(obj).length;

            if (newPropCount > existingPropCount) {
                codeMap.set(obj.code, obj); // Replace with the new object
            }
        } else {
            codeMap.set(obj.code, obj); // Add the new object
        }
    }

    return Array.from(codeMap.values());
}

async function main() {
    let json = await loadFromFile(outputFile);
    for await (const content of fileContentGenerator(inputFiles)) {
        json = unionTwoArrays(json, content);
    }

    await saveToFile(outputFile, json);
}

await main();