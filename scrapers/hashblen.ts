const GI_OUTPUT_FILE = Deno.args[0];
const HSR_OUTPUT_FILE = Deno.args[1];
const ZZZ_OUTPUT_FILE = Deno.args[2];

async function saveToFile(path: string, content: string) {
    await Deno.writeTextFile(path, content);
    console.log(`Data saved successfully to ${path}`);
}

async function main()
{
    const url: URL = new URL("https://db.hashblen.com/codes");
    const response = await fetch(url, { method: "GET" });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    const gi_codes = json.genshin.map(entry => entry.code);
    const hsr_codes = json.hsr.map(entry => entry.code);
    const zzz_codes = json.zzz.map(entry => entry.code);

    await Promise.all([
        saveToFile(GI_OUTPUT_FILE, gi_codes.join('\n')),
        saveToFile(HSR_OUTPUT_FILE, hsr_codes.join('\n')),
        saveToFile(ZZZ_OUTPUT_FILE, zzz_codes.join('\n'))
    ]);
}

await main();
