import {assert, expect} from "chai";
import sinon from "sinon";
import {Readable, ReadableOptions} from "stream";
import {ConfigurationParser, orientationMapper} from "../src/configuration-parser-service";
import {InstructionEnum} from "../src/instruction-enum";
import {Mower} from "../src/mower";
import {ILawn} from "../src/lawn";
import {OrientationEnum} from "../src/orientation-enum";
import * as fs from "../src/file-system-service";

describe("ConfigurationParser", () => {
    describe("parse", () => {
        it("should execute callback function whenever mower instruction list is available.", (done) => {
            class SourceWrapper extends Readable {
                constructor(opt?: ReadableOptions) {
                    super(opt);
                }

                public _read(size: number): void {
                    this.push("55\n");
                    this.push("12N\n");
                    this.push("LRF\n");
                    this.push("33E\n");
                    this.push("FRL\n");
                    this.push(null);
                }
            }

            const readable = new SourceWrapper();

            const configurationParser = new ConfigurationParser(readable);

            const sinonSpy = sinon.spy();

            let callNumber = 0;

            const mowerInstructionsCallback = (mower: Mower, mowerInstructions: InstructionEnum[]) => {

                sinonSpy();
                callNumber++;
                switch (callNumber) {
                    case 1:
                        expect(mower.x).to.equal(1);
                        expect(mower.y).to.equal(2);
                        expect(mower.orientation).to.equal(orientationMapper.get("N"));
                        expect(mowerInstructions).to.eql(
                            [InstructionEnum.LEFT, InstructionEnum.RIGHT, InstructionEnum.FORWARD]);
                        break;
                    case 2:
                        expect(mower.x).to.equal(3);
                        expect(mower.y).to.equal(3);
                        expect(mower.orientation).to.equal(orientationMapper.get("E"));
                        expect(mowerInstructions).to.eql(
                            [InstructionEnum.FORWARD, InstructionEnum.RIGHT, InstructionEnum.LEFT]);
                        break;
                }
            };
            configurationParser.parse(mowerInstructionsCallback).on("close", () => {
                assert.isTrue(sinonSpy.calledTwice);
                done();
            });
        });
    });

    describe("parseLawn", () => {
        it("should return null when called with wrong paramters", () => {
            const parsedLawn = ConfigurationParser.parseLawn("AB");
            assert.isNull(parsedLawn);
        });
        it("should return a new lawn when called with correct paramters", () => {
            const parsedLawn = ConfigurationParser.parseLawn("56");
            assert.isNotNull(parsedLawn);
            if (parsedLawn) {
                expect(parsedLawn.width).to.equal(5);
                expect(parsedLawn.height).to.equal(6);
            }
        });
    });

    describe("parseMower", () => {
        it("should return null when called with wrong parameters", () => {
            const lawn: ILawn = {
                height: 5,
                width: 6,
            }
            const parsedMower = ConfigurationParser.parseMower("124", lawn);
            assert.isNull(parsedMower);
        });
        it("should return null when called mower is outside of bounds", () => {
            const lawn: ILawn = {
                height: 5,
                width: 6,
            }
            const parsedMower = ConfigurationParser.parseMower("73N", lawn);
            assert.isNull(parsedMower);
        });
        it("should return a new mower when called with correct paramters", () => {
            const lawn: ILawn = {
                height: 5,
                width: 6,
            }
            const parsedMower = ConfigurationParser.parseMower("34N", lawn);
            assert.isNotNull(parsedMower);
            if (parsedMower) {
                expect(parsedMower.x).to.equal(3);
                expect(parsedMower.y).to.equal(4);
                expect(parsedMower.orientation).to.equal(OrientationEnum.NORTH);
            }
        });
    });

    describe("parseMowerInstructions", () => {
        it("should return null when called with wrong parameters", () => {
            const parsedMowerInstructions = ConfigurationParser.parseMowerInstructions("123");
            assert.isNull(parsedMowerInstructions);
        });
        it("should return a list of instructions when called with correct paramters", () => {
            const parsedMowerInstructions = ConfigurationParser.parseMowerInstructions("LRF");
            assert.isNotNull(parsedMowerInstructions);
            if (parsedMowerInstructions) {
                expect(parsedMowerInstructions).to.eql(
                    [InstructionEnum.LEFT, InstructionEnum.RIGHT, InstructionEnum.FORWARD]);
            }
        });
    });
});
