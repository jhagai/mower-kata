import {FileUtil} from "../../util/file-utils";
import {writeError} from "../../util/writer-util";
import {processFile} from "../configuration-processor/configuration-processor-service";

function logFileAccessError(err: NodeJS.ErrnoException, filePath: string) {
    writeError(`An error occurred while trying to open the file ${filePath}. Error code: ${err.code}`);
}

export enum RunMowerKataStatusEnum {
    SUCCESS,
    FILE_OPEN_ERROR,
    PROCESS_FILE_ERROR,
    TECHNICAL_ERROR,
}

/**
 * Run the mower kata for a specific file.
 */
export async function runMowerKata(filePath: string): Promise<number> {

    let fd: number;
    try {
        fd = await FileUtil.openForReading(filePath);
    } catch (e) {
        logFileAccessError(e, filePath);
        return RunMowerKataStatusEnum.FILE_OPEN_ERROR;
    }

    const readStream = FileUtil.createReadStreamFromFileDescriptor(fd);
    try {
        await processFile(readStream);
    } catch (e) {
        return RunMowerKataStatusEnum.PROCESS_FILE_ERROR;
    }

    return RunMowerKataStatusEnum.SUCCESS;
}
