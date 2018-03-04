import {expect} from "chai";
import sinon, {SinonSpy} from "sinon";
import {runMowerKata, RunMowerKataStatusEnum} from "./services/run-mower-kata/run-mower-kata";
import * as WriterUtil from "./util/writer-util";

describe("The mower kata", () => {
    let writeLineSpy: SinonSpy;
    let writeErrorSpy: SinonSpy;

    afterEach(() => {
        if (writeLineSpy) {
            writeLineSpy.restore();
        }
        if (writeErrorSpy) {
            writeErrorSpy.restore();
        }
    })

    it("should write 2 lines: 13N and 51E, when executed on the test/sample.txt.", (done) => {
        writeLineSpy = sinon.spy(WriterUtil, "writeLine");
        runMowerKata("test/sample.txt")
            .then((status) => {
                expect(status).to.be.equal(RunMowerKataStatusEnum.SUCCESS);
                expect(writeLineSpy.callCount).to.be.equal(2);
                writeLineSpy.getCall(0).calledWith("13N");
                writeLineSpy.getCall(1).calledWith("51E");
                done();
            })
            .catch((err) => done(err));
    });

    it("should write an error when input file does not exist.", (done) => {
        writeErrorSpy = sinon.spy(WriterUtil, "writeError");
        runMowerKata("test/file-does-not-exist.txt")
            .then((status) => {
                expect(status).to.be.equal(RunMowerKataStatusEnum.FILE_OPEN_ERROR);
                done();
            })
            .catch((err) => done(err));
    });

    it("should write an error when input file has errors.", (done) => {
        writeErrorSpy = sinon.spy(WriterUtil, "writeError");
        runMowerKata("test/sample-error.txt")
            .then((status) => {
                expect(status).to.be.equal(RunMowerKataStatusEnum.PROCESS_FILE_ERROR);
                done();
            })
            .catch((err) => done(err));
    });
});
