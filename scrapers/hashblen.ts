import { Code, saveToFile } from "./code.ts";

const GI_OUTPUT_FILE = Deno.args[0];
const HSR_OUTPUT_FILE = Deno.args[1];
const ZZZ_OUTPUT_FILE = Deno.args[2];

function jsonToCode(json: string) : Code {
    return {
        code: json.code,
        foundOn: json.added_at
    };
}

async function main()
{
    const url: URL = new URL("https://db.hashblen.com/codes");
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    const gi_codes = json.genshin.map(jsonToCode);
    const hsr_codes = json.hsr.map(jsonToCode);
    const zzz_codes = json.zzz.map(jsonToCode);

    await Promise.all([
        saveToFile(GI_OUTPUT_FILE, gi_codes),
        saveToFile(HSR_OUTPUT_FILE, hsr_codes),
        saveToFile(ZZZ_OUTPUT_FILE, zzz_codes)
    ]);
}

await main();
