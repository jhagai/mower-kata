import {expect} from "chai";
import sinon from "sinon";
import {Readable} from "stream";
import {InstructionEnum} from "../../entites/instruction-enum";
import {Mower} from "../../entites/mower/mower";
import {OrientationEnum} from "../../entites/orientation-enum";
import * as WriterUtil from "../../util/writer-util";
import {ConfigurationParser, ParserErrorTypeEnum} from "./configuration-parser/configuration-parser-service";
import {processFile} from "./configuration-processor-service";

describe("processFile", () => {

    afterEach(() => {
        if (createConfigStub) {
            createConfigStub.restore();
        }
        if (writeLineSpy) {
            writeLineSpy.restore();
        }
        if (writeErrorSpy) {
            writeErrorSpy.restore();
        }
    });

    let createConfigStub: sinon.SinonStub;
    let writeLineSpy: sinon.SinonSpy;
    let writeErrorSpy: sinon.SinonSpy;

    it("should return a resolved promise when no error has been raised.", (done) => {

        createConfigStub = sinon.stub(ConfigurationParser, "create");
        const mower: Mower = new Mower(1, 2, OrientationEnum.NORTH, {height: 4, width: 4})

        writeLineSpy = sinon.spy(WriterUtil, "writeLine");

        createConfigStub.returns({
            parse: (onMowerInstruction: any, onError: any, onDone: any) => {
                onMowerInstruction(mower, [InstructionEnum.LEFT, InstructionEnum.FORWARD, InstructionEnum.RIGHT
                    , InstructionEnum.FORWARD, InstructionEnum.RIGHT]);
                onDone(true);
                expect(writeLineSpy.getCall(0).args[0]).to.be.equal("03E");
            },
        });

        const promise = processFile(new Readable());
        promise.then(() => {
            done();
        }).catch((err) => done(err));
    });

    it("should return a rejected promise when a lawn error is detected.", (done) => {

        createConfigStub = sinon.stub(ConfigurationParser, "create");
        writeErrorSpy = sinon.spy(WriterUtil, "writeError");
        createConfigStub.returns({
            parse: (onMowerInstruction: any, onError: any, onDone: any) => {
                onError(ParserErrorTypeEnum.LAWN);
                expect(writeErrorSpy.callCount).to.be.equal(1);
                onDone(false);
            },
        });

        const promise = processFile(new Readable());
        promise.then(() => {
            done("Should have failed");
        }).catch(() => {
            done();
        });
    });

    it("should return a rejected promise when a mower error is detected.", (done) => {

        createConfigStub = sinon.stub(ConfigurationParser, "create");
        writeErrorSpy = sinon.spy(WriterUtil, "writeError");
        createConfigStub.returns({
            parse: (onMowerInstruction: any, onError: any, onDone: any) => {
                onError(ParserErrorTypeEnum.MOWER);
                expect(writeErrorSpy.callCount).to.be.equal(1);
                onDone(false);
            },
        });

        const promise = processFile(new Readable());
        promise.then(() => {
            done("Should have failed");
        }).catch(() => {
            done();
        });
    });

    it("should return a rejected promise when a mower instruction error is detected.", (done) => {

        createConfigStub = sinon.stub(ConfigurationParser, "create");
        writeErrorSpy = sinon.spy(WriterUtil, "writeError");
        createConfigStub.returns({
            parse: (onMowerInstruction: any, onError: any, onDone: any) => {
                onError(ParserErrorTypeEnum.INSTRUCTION);
                expect(writeErrorSpy.callCount).to.be.equal(1);
                onDone(false);
            },
        });

        const promise = processFile(new Readable());
        promise.then(() => {
            done("Should have failed");
        }).catch(() => {
            done();
        });
    });
});
