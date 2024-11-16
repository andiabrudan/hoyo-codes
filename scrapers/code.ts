export interface Code {
    code: string;
    foundOn?: string;
    expires?: string;
}

export async function saveToFile(path: string, data: Code[]) {
    const dataStr = JSON.stringify(data, null, 2);
    await Deno.writeTextFile(path, dataStr);
    console.log(`Data saved successfully to ${path}`);
}

export async function loadFromFile(path: string) : Code[] {
    const fileContents = await Deno.readTextFile(path);
    if (!fileContents.trim()) return []
    const json = JSON.parse(fileContents);
    console.log("Data loaded successfully");
    return json;
}

export function diffCodeLists(list1: Code[], list2: Code[]) : Code[] {
    const list2Codes = new Set(list2.map(item => item.code));
    return list1.filter(item => !list2Codes.has(item.code));
}
