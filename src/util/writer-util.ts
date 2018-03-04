import * as os from "os";

export function writeLine(value: any) {
    process.stdout.write(`${value}${os.EOL}`);
}

export function writeError(value: any) {
    process.stderr.write(`${value}${os.EOL}`);
}
