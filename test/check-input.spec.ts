import {expect} from "chai";
import sinon, {SinonStub} from "sinon";
import {Readable} from "stream";
import {checkInput, InputErrorEnum} from "../src/check-input";
import * as fs from "../src/file-system-service";

describe("checkInput", () => {

    function stubFs(exists: boolean, access: boolean): SinonStub[] {
        const existsSyncStub = sinon.stub(fs, "existsSync");
        existsSyncStub.returns(exists);
        const accessSyncStub = sinon.stub(fs, "accessSync");
        if (!access) {
            accessSyncStub.throws(Error);
        }
        const createReadStreamStub = sinon.stub(fs, "createReadStream").returns(new Readable());
        return [existsSyncStub, accessSyncStub, createReadStreamStub];
    }

    function restoreStubs(sinonStubs: SinonStub[]): void {
        sinonStubs.forEach((sinonStub) => sinonStub.restore());
    }

    it("should return a Readable stream when file is available.", () => {
        const stubF = stubFs(true, true);
        expect(checkInput("toto")).to.instanceOf(Readable);
        restoreStubs(stubF);
    });
    it("should return an error when file name is not provided.", () => {
        const stubF = stubFs(true, true);
        expect(checkInput("")).to.to.be.equal(InputErrorEnum.MISSING_FILE_ARG);
        restoreStubs(stubF);
    });
    it("should return an error when file does not exist.", () => {
        const stubF = stubFs(false, false);
        expect(checkInput("toto")).to.be.equal(InputErrorEnum.FILE_DOES_NOT_EXIST);
        restoreStubs(stubF);
    });
    it("should return an error when file is not readable.", () => {
        const stubF = stubFs(true, false);
        expect(checkInput("toto")).to.be.equal(InputErrorEnum.FILE_NOT_READABLE);
        restoreStubs(stubF);
    });
});
