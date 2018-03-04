import {runMowerKata, RunMowerKataStatusEnum} from "./services/run-mower-kata/run-mower-kata";
import {writeError} from "./util/writer-util";

// Processing input to extract the file path.
const args = process.argv.slice(2);
const filePath = args[0];

const errorStatusMap = new Map<RunMowerKataStatusEnum, number>();
errorStatusMap.set(RunMowerKataStatusEnum.SUCCESS, 0);
errorStatusMap.set(RunMowerKataStatusEnum.FILE_OPEN_ERROR, 1);
errorStatusMap.set(RunMowerKataStatusEnum.PROCESS_FILE_ERROR, 2);
errorStatusMap.set(RunMowerKataStatusEnum.TECHNICAL_ERROR, 3);

// Process the input file.
runMowerKata(filePath)
    .catch((e) => {
        writeError(`An un expected error occurred while parsing the input file ${filePath}.`);
        writeError(e);
        return Promise.resolve(RunMowerKataStatusEnum.TECHNICAL_ERROR);
    })
    .then((status) => process.exit(status));
