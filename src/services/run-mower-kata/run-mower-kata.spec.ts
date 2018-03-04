import {assert, expect} from "chai";
import sinon, {SinonStub} from "sinon";
import {Readable} from "stream";
import {FileUtil} from "../../util/file-utils";
import * as Processor from "../configuration-processor/configuration-processor-service";
import {runMowerKata, RunMowerKataStatusEnum} from "./run-mower-kata";

describe("runMowerKata", () => {

    const errNoSuchFile = {code: "ENOENT"};

    let stubOpen: SinonStub;
    let stubStream: SinonStub;
    let stubProcessFile: SinonStub;

    afterEach(() => {
        // runs after each test in this block
        if (stubOpen) {
            stubOpen.restore();
        }
        if (stubStream) {
            stubStream.restore();
        }
        if (stubProcessFile) {
            stubProcessFile.restore();
        }
    });

    it(`should finish successfully (return ${RunMowerKataStatusEnum.SUCCESS}) when everything is ok.`,
        (done) => {

            // GIVEN
            stubOpen = sinon.stub(FileUtil, "openForReading");
            stubOpen.returns(Promise.resolve(1));

            stubStream = sinon.stub(FileUtil, "createReadStreamFromFileDescriptor");
            stubStream.returns(new Readable());

            stubProcessFile = sinon.stub(Processor, "processFile");
            stubProcessFile.returns(Promise.resolve());

            // WHEN
            const runMowerKataPromise = runMowerKata("whateverpath");

            // THEN
            runMowerKataPromise.then((status) => {
                expect(status).to.be.equal(RunMowerKataStatusEnum.SUCCESS,
                    `Status shall be equal to ${RunMowerKataStatusEnum.SUCCESS}.`);
                done();
            });
            runMowerKataPromise.catch((err) => done("Unexpected error received " + err));
        });

    it(`should return a resolved promise with value ${RunMowerKataStatusEnum.FILE_OPEN_ERROR} if file isnot readable.`,
        (done) => {

            // GIVEN
            stubOpen = sinon.stub(FileUtil, "openForReading");
            stubOpen.returns(Promise.reject(errNoSuchFile));

            // WHEN
            const runMowerKataPromise = runMowerKata("whateverpath");

            // THEN
            runMowerKataPromise.then((status) => {
                try {
                    expect(status).to.be.equal(RunMowerKataStatusEnum.FILE_OPEN_ERROR,
                        `Status shall be equal to ${RunMowerKataStatusEnum.FILE_OPEN_ERROR}.`);
                    done();
                } catch (e) {
                    done(e);
                }
            });
            runMowerKataPromise.catch((err) => done("Unexpected error received " + err));

        });
    it(`should return a resolved promise with value ${RunMowerKataStatusEnum.PROCESS_FILE_ERROR} if file processing returns a rejected promise.`,
        (done) => {

            // GIVEN
            stubOpen = sinon.stub(FileUtil, "openForReading");
            stubOpen.returns(Promise.resolve(1));
            stubStream = sinon.stub(FileUtil, "createReadStreamFromFileDescriptor");
            stubStream.returns(new Readable());
            stubProcessFile = sinon.stub(Processor, "processFile");
            stubProcessFile.returns(Promise.reject(null));

            // WHEN
            const runMowerKataPromise = runMowerKata("whateverpath");

            // THEN
            runMowerKataPromise.then((status) => {
                expect(status).to.be.equal(RunMowerKataStatusEnum.PROCESS_FILE_ERROR,
                    `Status shall be equal to ${RunMowerKataStatusEnum.PROCESS_FILE_ERROR}.`);
                done();
            });
            runMowerKataPromise.catch((err) => done("Unexpected error received " + err));

        });
});
