import {ReadStream} from "fs";
import {Readable} from "stream";
import * as fs from "../file-system-service";

export enum InputErrorEnum {
    MISSING_FILE_ARG,
    FILE_DOES_NOT_EXIST,
    FILE_NOT_READABLE,
}

function checkAccess(filePath: string) {
    let result = true;
    try {
        fs.accessSync(filePath, fs.constants.R_OK);
    } catch (err) {
        result = false;
    }
    return result;

}

export function checkInput(filePath: string): Readable | InputErrorEnum {

    let result: ReadStream | InputErrorEnum;

    if (!filePath) {
        result = InputErrorEnum.MISSING_FILE_ARG;
    } else if (!fs.existsSync(filePath)) {
        result = InputErrorEnum.FILE_DOES_NOT_EXIST;
    } else if (!checkAccess(filePath)) {
        result = InputErrorEnum.FILE_NOT_READABLE;
    } else {
        result = fs.createReadStream(filePath);
    }

    return result;
}
