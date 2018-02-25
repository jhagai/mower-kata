import {createInterface, ReadLine} from "readline";
import {Readable} from "stream";
import {InstructionEnum} from "./instruction-enum";
import {ILawn} from "./lawn";
import {Mower} from "./mower";
import {OrientationEnum} from "./orientation-enum";
import {writeLine} from "./util/stdout-writer-util";

const LAWN_REGEX = /^[1-9]{2}$/
const INITIAL_MOWER_REGEX = /^[1-9]{2}[NSEW]$/
const MOWER_INSTRUCTIONS_REGEX = /^[LRF]+$/

export const orientationMapper = new Map<string, OrientationEnum>();
orientationMapper.set("E", OrientationEnum.EAST);
orientationMapper.set("W", OrientationEnum.WEST);
orientationMapper.set("N", OrientationEnum.NORTH);
orientationMapper.set("S", OrientationEnum.SOUTH);

export const instructionMapper = new Map<string, InstructionEnum>();
instructionMapper.set("L", InstructionEnum.LEFT);
instructionMapper.set("R", InstructionEnum.RIGHT);
instructionMapper.set("F", InstructionEnum.FORWARD);

enum ParserStatus {
    LAWN,
    MOWER_INITIAL,
    MOWER_INSTRUCTIONS,
    ERROR,
}

export class ConfigurationParser {

    public static parseLawn(line: string): ILawn | null {
        let result = null;
        if (LAWN_REGEX.test(line)) {
            const width = parseInt(line.charAt(0), 10);
            const height = parseInt(line.charAt(1), 10);
            result = {
                height,
                width,
            };
        }
        return result;
    }

    public static parseMower(line: string, lawn: ILawn): Mower | null {
        let result = null;
        if (INITIAL_MOWER_REGEX.test(line)) {
            const x = parseInt(line.charAt(0), 10);
            const y = parseInt(line.charAt(1), 10);
            const orientation = orientationMapper.get(line.charAt(2))
            if (orientation != null) {
                result = Mower.newMower(x, y, orientation, lawn);
            }
        }
        return result;
    }

    public static parseMowerInstructions(line: string): InstructionEnum[] | null {
        let result = null;
        if (MOWER_INSTRUCTIONS_REGEX.test(line)) {
            result = new Array<InstructionEnum>();
            for (const char of line) {
                const item = instructionMapper.get(char);
                if (item != null) {
                    result.push(item);
                }
            }
        }
        return result;
    }

    private status = ParserStatus.LAWN;
    private lawn: ILawn;
    private mower: Mower;
    private lineNumber = 0;

    constructor(private readSteam: Readable) {
    }

    public parse(onMowerInstructions: (mower: Mower, mowerInstructions: InstructionEnum[]) => void): ReadLine {

        const rl: ReadLine = createInterface({
            input: this.readSteam,
        });

        rl.on("line", (line) => {
            this.lineNumber++;
            switch (this.status) {
                case ParserStatus.LAWN:
                    this.handleLawn(line);
                    break;
                case ParserStatus.MOWER_INITIAL:
                    this.handleMower(line);
                    break;
                case ParserStatus.MOWER_INSTRUCTIONS:
                    this.handleInstructions(line, onMowerInstructions);
                    break;
            }
        });
        return rl;
    }

    private handleInstructions(line: string,
                               onMowerInstructions: (mower: Mower, mowerInstructions: InstructionEnum[]) => void) {
        const parseMowerInstructions = ConfigurationParser.parseMowerInstructions(line);
        if (parseMowerInstructions) {
            onMowerInstructions(this.mower, parseMowerInstructions);
            this.status = ParserStatus.MOWER_INITIAL;
        } else {
            writeLine(`Line ${line} - An error occurred while parsing mower instructions.`);
            this.status = ParserStatus.ERROR;
        }
    }

    private handleMower(line: string) {
        const mower = ConfigurationParser.parseMower(line, this.lawn);
        if (mower) {
            this.mower = mower;
            this.status = ParserStatus.MOWER_INSTRUCTIONS;
        } else {
            writeLine(`Line ${this.lineNumber} - An error occurred while parsing mower initial data.`);
            this.status = ParserStatus.ERROR;
        }

    }

    private handleLawn(line: string) {
        const lawn = ConfigurationParser.parseLawn(line);
        if (lawn) {
            this.lawn = lawn;
            this.status = ParserStatus.MOWER_INITIAL;
        } else {
            writeLine(`Line ${this.lineNumber} - An error occurred while parsing lawn data.`);
            this.status = ParserStatus.ERROR;
        }
    }
}
