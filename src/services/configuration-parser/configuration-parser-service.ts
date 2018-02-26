import {createInterface, ReadLine} from "readline";
import {Readable} from "stream";
import {InstructionEnum} from "../../entites/instruction-enum";
import {ILawn} from "../../entites/lawn";
import {Mower} from "../../entites/mower/mower";
import {OrientationEnum} from "../../entites/orientation-enum";

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

enum ParserStatusEnum {
    LAWN,
    MOWER_INITIAL,
    MOWER_INSTRUCTIONS,
    ERROR,
}

export enum ParserErrorTypeEnum {
    LAWN,
    MOWER,
    INSTRUCTION,
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
            const orientation = orientationMapper.get(line.charAt(2));
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

    private status = ParserStatusEnum.LAWN;
    private lawn: ILawn;
    private mower: Mower;
    private lineNumber = 0;

    constructor(private readSteam: Readable) {
    }

    public parse(onMowerInstructions: (mower: Mower, mowerInstructions: InstructionEnum[]) => void,
                 onError?: (errorType: ParserErrorTypeEnum, lineNumber: number) => void,
                 onDone?: () => void) {

        const rl: ReadLine = createInterface({
            input: this.readSteam,
        });

        let error: ParserErrorTypeEnum | null = null;
        rl.on("line", (line) => {
            this.lineNumber++;
            switch (this.status) {
                case ParserStatusEnum.LAWN:
                    if (!this.handleLawn(line)) {
                        error = ParserErrorTypeEnum.LAWN;
                    }
                    break;
                case ParserStatusEnum.MOWER_INITIAL:
                    if (!this.handleMower(line)) {
                        error = ParserErrorTypeEnum.MOWER;
                    }
                    break;
                case ParserStatusEnum.MOWER_INSTRUCTIONS:
                    if (!this.handleInstructions(line, onMowerInstructions)) {
                        error = ParserErrorTypeEnum.INSTRUCTION;
                    }
                    break;
            }
            if (error !== null) {
                this.status = ParserStatusEnum.ERROR;
                if (onError) {
                    this.status = ParserStatusEnum.ERROR;
                    onError(error, this.lineNumber);
                }
                rl.close();
            }
        });
        rl.on("close", () => {
            if (onDone) {
                onDone();
            }
        });
    }

    private handleInstructions(line: string,
                               onMowerInstructions: (mower: Mower,
                                                     mowerInstructions: InstructionEnum[]) => void): boolean {
        let result = false;
        const parseMowerInstructions = ConfigurationParser.parseMowerInstructions(line);
        if (parseMowerInstructions) {
            result = true;
            onMowerInstructions(this.mower, parseMowerInstructions);
            this.status = ParserStatusEnum.MOWER_INITIAL;
        }

        return result;
    }

    private handleMower(line: string): boolean {
        let result: boolean = false;
        const mower = ConfigurationParser.parseMower(line, this.lawn);
        if (mower) {
            result = true;
            this.mower = mower;
            this.status = ParserStatusEnum.MOWER_INSTRUCTIONS;
        }
        return result;

    }

    private handleLawn(line: string): boolean {
        let result: boolean = false;
        const lawn = ConfigurationParser.parseLawn(line);
        if (lawn) {
            result = true;
            this.lawn = lawn;
            this.status = ParserStatusEnum.MOWER_INITIAL;
        }
        return result;
    }
}
