import {assert, expect} from "chai";
import sinon from "sinon";
import {Readable, ReadableOptions} from "stream";
import {InstructionEnum} from "../../../entites/instruction-enum";
import {ILawn} from "../../../entites/lawn";
import {Mower} from "../../../entites/mower/mower";
import {OrientationEnum} from "../../../entites/orientation-enum";
import {ConfigurationParser, orientationMapper} from "./configuration-parser-service";

class SourceWrapper extends Readable {
    constructor(private data: string[]) {
        super({});
    }

    public _read(size: number): void {
        this.data.forEach((d: string) => this.push(d));
        this.push(null);
    }
}

describe("ConfigurationParser", () => {
    describe("parse", () => {
        it("should execute callback function whenever mower instruction list is available.", (done) => {

            const data = [
                "55\n",
                "12N\n",
                "LRF\n",
                "33E\n",
                "FRL\n",
            ];

            const readable = new SourceWrapper(data);
            const configurationParser = new ConfigurationParser(readable);
            const sinonSpy = sinon.spy();
            const sinonErrorSpy = sinon.spy();
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
            configurationParser.parse(
                mowerInstructionsCallback,
                sinonErrorSpy,
                () => {
                    assert.isTrue(sinonSpy.calledTwice);
                    assert.isTrue(sinonErrorSpy.notCalled);
                    done();
                });
        });

        it("should stop parsing on lawn error.", (done) => {

            const data = [
                "55A\n",
                "12N\n",
                "LRF\n",
                "33E\n",
                "FRL\n",
            ];

            const readable = new SourceWrapper(data);
            const configurationParser = new ConfigurationParser(readable);
            const sinonSpy = sinon.spy();
            const sinonErrorSpy = sinon.spy();
            configurationParser.parse(
                sinonSpy,
                sinonErrorSpy,
                () => {
                    assert.isTrue(sinonSpy.notCalled);
                    assert.isTrue(sinonErrorSpy.calledOnce);
                    done();
                });
        });

        it("should stop parsing on mower error.", (done) => {

            const data = [
                "55\n",
                "12NA\n",
                "LRF\n",
                "33E\n",
                "FRL\n",
            ];

            const readable = new SourceWrapper(data);
            const configurationParser = new ConfigurationParser(readable);
            const sinonSpy = sinon.spy();
            const sinonErrorSpy = sinon.spy();
            configurationParser.parse(
                sinonSpy,
                sinonErrorSpy,
                () => {
                    assert.isTrue(sinonSpy.notCalled);
                    assert.isTrue(sinonErrorSpy.calledOnce);
                    done();
                });
        });

        it("should stop parsing on mower instruction error.", (done) => {

            const data = [
                "55\n",
                "12N\n",
                "LR1\n",
                "33E\n",
                "FRL\n",
            ];

            const readable = new SourceWrapper(data);
            const configurationParser = new ConfigurationParser(readable);
            const sinonSpy = sinon.spy();
            const sinonErrorSpy = sinon.spy();
            configurationParser.parse(
                sinonSpy,
                sinonErrorSpy,
                () => {
                    assert.isTrue(sinonSpy.notCalled);
                    assert.isTrue(sinonErrorSpy.calledOnce);
                    done();
                });
        });
    });
    describe("parseLawn", () => {
        it("should return null when called with wrong paramters", () => {
            const parsedLawn = ConfigurationParser.parseLawn("AB");
            assert.isNull(parsedLawn);
        });
        it("should return a new lawn when called with correct parameters", () => {
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
