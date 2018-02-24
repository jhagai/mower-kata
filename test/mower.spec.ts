import {assert} from "chai";
import {InstructionEnum} from "../src/instruction-enum";
import {ILawn} from "../src/lawn";
import {Mower} from "../src/mower";
import {OrientationEnum} from "../src/orientation-enum";

const lawn: ILawn = {
    height: 2,
    width: 2,
};

describe("Mower", () => {
        describe("facing North", () => {
            const initialOrientation = OrientationEnum.NORTH;
            describe("receiving a forward instruction", () => {
                    const instruction = InstructionEnum.FORWARD;
                    it("should move up when NOT facing a wall", () => {
                        const initialX = 1;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower shall not move horizontally");
                        assert.strictEqual(mower.y, initialY + 1, "mower shall move up");
                        assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });

                    it("should NOT move when facing a wall", () => {
                        const initialX = 1;
                        const initialY = 2;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower shall not move horizontally");
                        assert.strictEqual(mower.y, initialY, "mower shall move vertically from one step");
                        assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });
                }
            )
            describe("receiving a turn left instruction", () => {
                    const instruction = InstructionEnum.LEFT;
                    it("should turn West", () => {
                        const initialX = 1;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower shall not move horizontally");
                        assert.strictEqual(mower.y, initialY, "mower shall not move vertically");
                        assert.strictEqual(mower.orientation, OrientationEnum.WEST, "mower shall face West");
                    });
                }
            )
            describe("receiving a turn right instruction", () => {
                    const instruction = InstructionEnum.RIGHT;
                    it("should turn East", () => {
                        const initialX = 1;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower shall not move horizontally");
                        assert.strictEqual(mower.y, initialY, "mower shall not move vertically");
                        assert.strictEqual(mower.orientation, OrientationEnum.EAST, "mower shall face East");
                    });
                }
            )
        });

        describe("facing West", () => {
            const initialOrientation = OrientationEnum.WEST;
            describe("receiving a forward instruction", () => {
                    const instruction = InstructionEnum.FORWARD;
                    it("should move left when NOT facing a wall", () => {
                        const initialX = 1;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX - 1, "mower shall move left");
                        assert.equal(mower.y, initialY, "mower shall NOT move vertically");
                        assert.equal(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });

                    it("should NOT move when facing a wall", () => {
                        const initialX = 0;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower shall NOT move horizontally");
                        assert.equal(mower.y, initialY, "mower shall NOT move vertically");
                        assert.equal(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });
                }
            )
        });

        describe("facing East", () => {
            const initialOrientation = OrientationEnum.EAST;
            describe("receiving a forward instruction", () => {
                    const instruction = InstructionEnum.FORWARD;
                    it("should move right when NOT facing a wall", () => {
                        const initialX = 1;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX + 1, "mower shall move right");
                        assert.strictEqual(mower.y, initialY, "mower shall NOT move vertically");
                        assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });

                    it("should NOT move when facing a wall", () => {
                        const initialX = 2;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower shall NOT move horizontally");
                        assert.strictEqual(mower.y, initialY, "mower shall NOT move vertically");
                        assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });
                }
            )
        });

        describe("facing South", () => {
            const initialOrientation = OrientationEnum.SOUTH;
            describe("receiving a forward instruction", () => {
                    const instruction = InstructionEnum.FORWARD;
                    it("should move down when NOT facing a wall", () => {
                        const initialX = 1;
                        const initialY = 1;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower NOT shall move horizontally");
                        assert.strictEqual(mower.y, initialY - 1, "mower shall move down");
                        assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });

                    it("should NOT move when facing a wall", () => {
                        const initialX = 1;
                        const initialY = 0;

                        const mower: Mower = new Mower(1, 1, initialOrientation, lawn);
                        mower.step(instruction);
                        assert.strictEqual(mower.x, initialX, "mower shall NOT move horizontally");
                        assert.strictEqual(mower.y, initialY, "mower shall NOT move vertically");
                        assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
                    });
                }
            )
        });
    }
);