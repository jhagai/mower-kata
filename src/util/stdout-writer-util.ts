import * as os from "os";

export function writeLine(value: any) {
    process.stdout.write(`${value}${os.EOL}`);
}
