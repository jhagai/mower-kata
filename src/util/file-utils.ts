import {createReadStream, open, ReadStream} from "fs";
import {promisify} from "util";

const promisifiedOpen = promisify(open);

function openForReading(path: string): Promise<number> {
    return promisifiedOpen(path, "r");
}

function createReadStreamFromFileDescriptor(fd: number): ReadStream {
    return createReadStream("", {fd});
}

const FileUtil = {openForReading, createReadStreamFromFileDescriptor};

export {FileUtil};
