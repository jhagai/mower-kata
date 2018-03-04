import {Readable} from "stream";
import {InstructionEnum} from "../../entites/instruction-enum";
import {Mower} from "../../entites/mower/mower";
import {OrientationEnum} from "../../entites/orientation-enum";
import {writeError, writeLine} from "../../util/writer-util";
import {
    ConfigurationParser,
    orientationMapper,
    ParserErrorTypeEnum,
} from "./configuration-parser/configuration-parser-service";

// Create a map that associates an OrientationEnum to the letter that shall be output.
const orientationEnumToLabel = new Map<OrientationEnum, string>();
orientationMapper.forEach(
    function fillOrientationEnumToLabel(value, key) {
        this.set(value, key);
    }, orientationEnumToLabel);

/**
 * Executes a sequence of mower instructions on a mower
 *
 * @param {Mower} mower the mower, the instructions will be executed on.
 * @param {InstructionEnum[]} mowerInstructions the set of instructions to execute.
 */
function onMowerInstruction(mower: Mower, mowerInstructions: InstructionEnum[]) {
    mowerInstructions.forEach(
        (instruction: InstructionEnum) => {
            if (mower) {
                mower.step(instruction);
            }
        },
    );
    writeLine(`${mower.x}${mower.y}${orientationEnumToLabel.get(mower.orientation)}`);
}

/**
 * Writes the appropriate error message on stderr depending on the error type.
 *
 * @param {ParserErrorTypeEnum} errorType
 * @param {number} lineNumber the line number where the error was spotted.
 */
function onError(errorType: ParserErrorTypeEnum, lineNumber: number) {
    switch (errorType) {
        case ParserErrorTypeEnum.LAWN:
            writeError(`Line ${lineNumber} - An error occurred while parsing lawn data.`);
            break;
        case ParserErrorTypeEnum.MOWER:
            writeError(`Line ${lineNumber} - An error occurred while parsing mower initial data.`);
            break;
        case ParserErrorTypeEnum.INSTRUCTION:
            writeError(`Line ${lineNumber} - An error occurred while parsing mower instructions.`);
            break;
    }
}

/**
 * Read the readable stream passed in parameter and interprets it.
 *
 * @param {"stream".internal.Readable} readableStream
 */
function processFile(readableStream: Readable): Promise<void> {
    const configurationParser = ConfigurationParser.create(readableStream);

    return new Promise<void>(
        (resolve, reject) => {
            const onDone = (success: boolean) => success ? resolve() : reject();
            // Process the file line by line
            configurationParser.parse(onMowerInstruction,
                onError,
                onDone);
        },
    );
}

export {processFile};
