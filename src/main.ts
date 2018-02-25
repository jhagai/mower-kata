import {Readable} from "stream";
import {checkInput, InputErrorEnum} from "./check-input";
import {ConfigurationParser, orientationMapper} from "./configuration-parser-service";
import {InstructionEnum} from "./instruction-enum";
import {OrientationEnum} from "./orientation-enum";
import {writeLine} from "./util/stdout-writer-util";

// Processing input to extract the file path.
const args = process.argv.slice(2);
const filePath = args[0];

// Check input values.
const checkInputResult = checkInput(filePath);

// Process checkInput result (either an error or a readable stream).
switch (checkInputResult) {
    case InputErrorEnum.MISSING_FILE_ARG:
        writeLine("One single argument representing a path to file is required.");
        process.exit(1);
        break;
    case InputErrorEnum.FILE_DOES_NOT_EXIST:
        writeLine(`Provided file ${filePath} could not be found.`);
        process.exit(2);
        break;
    case InputErrorEnum.FILE_NOT_READABLE:
        writeLine(`Current user does not seem to have read access to provided file ${filePath}.`);
        process.exit(3);
        break;
    default:
        processFile(checkInputResult);
}

function processFile(readableStream: Readable) {
    // Create a map that associates an OrientationEnum to the letter that shall be output.
    const orientationEnumToLabel = new Map<OrientationEnum, string>();
    orientationMapper.forEach(
        function fillOrientationEnumToLabel(value, key) {
            this.set(value, key);
        }, orientationEnumToLabel);
    const configurationParser = new ConfigurationParser(readableStream);
    // Process the file line by line
    configurationParser.parse(
        (mower, mowerInstructions) => {
            mowerInstructions.forEach(
                (instruction: InstructionEnum) => {
                    if (mower) {
                        mower.step(instruction);
                    }
                },
            );
            writeLine(`${mower.x}${mower.y}${orientationEnumToLabel.get(mower.orientation)}`);
        });
}
