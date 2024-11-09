#!/usr/bin/env node
import { DOMParser } from "./deps.ts";

// const OUTPUT_FILE = "./GI-Fandom-results.txt";
const OUTPUT_FILE = Deno.args[0];

function skipFirst<T>(iterable: Iterable<T>): Iterable<T> {
    const iterator = iterable[Symbol.iterator]();
    iterator.next(); // Skip the first element

    return {
        [Symbol.iterator]() {
            return iterator;
        }
    };
}

async function saveToFile(path: string, content: string) {
    await Deno.writeTextFile(path, content);
    console.log(`Data saved successfully to ${path}`);
}

async function main() {
    const url: URL = new URL("https://genshin-impact.fandom.com/wiki/Promotional_Code");
    const headers: Headers = new Headers();
    headers.set("accept", "text/html");
    headers.set("accept-encoding", "gzip, deflate, br, zstd")
    headers.set("accept-language", "en-US,en");
    headers.set("connection", "close");
    headers.set("content-type", "text/html; charset=UTF-8");
    headers.set("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36")
    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const codes: string[] = [];
    const codes_table: Element = doc.body.querySelector("#mw-content-text > div > table > tbody");
    for (const row of skipFirst(codes_table.children)) {
        const code: string = row.firstElementChild!.firstElementChild!.firstElementChild!.firstElementChild!.textContent!;
        codes.push(code);
    }
    await saveToFile(OUTPUT_FILE, codes.join("\n"));
}

await main();
