import {assert, expect} from "chai";
import {InstructionEnum} from "../instruction-enum";
import {ILawn} from "../lawn";
import {OrientationEnum} from "../orientation-enum";
import {Mower} from "./mower";

const lawn: ILawn = {
    height: 2,
    width: 2,
};

const orientationLabelMapper = new Map<OrientationEnum, string>();
orientationLabelMapper.set(OrientationEnum.NORTH, "North");
orientationLabelMapper.set(OrientationEnum.SOUTH, "South");
orientationLabelMapper.set(OrientationEnum.EAST, "East");
orientationLabelMapper.set(OrientationEnum.WEST, "West");

/*
 * Util to check mower change orientation
 * @param {InstructionEnum.LEFT | InstructionEnum.RIGHT} instruction
 * @param {OrientationEnum} initialOrientation
 * @param {"North" | "South" | "East" | "West"} orientationLabel
 */
function orientationTest(instruction: InstructionEnum.LEFT | InstructionEnum.RIGHT,
                         initialOrientation: OrientationEnum,
                         expectedOrientation: OrientationEnum) {
    const initialX = 1;
    const initialY = 1;

    const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
    mower.step(instruction);
    assert.strictEqual(mower.x, initialX, "mower shall not move horizontally");
    assert.strictEqual(mower.y, initialY, "mower shall not move vertically");
    assert.strictEqual(mower.orientation, expectedOrientation,
        "mower shall face " + orientationLabelMapper.get(expectedOrientation));
}

describe("Mower", () => {
    describe("facing North", () => {
        const initialOrientation = OrientationEnum.NORTH;
        describe("receiving a forward instruction", () => {
            const instruction = InstructionEnum.FORWARD;
            it("should move up when NOT facing a wall", () => {
                const initialX = 1;
                const initialY = 1;

                const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX, "mower shall not move horizontally");
                assert.strictEqual(mower.y, initialY + 1, "mower shall move up");
                assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
            });

            it("should NOT move when facing a wall", () => {
                const initialX = 1;
                const initialY = 2;

                const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX, "mower shall not move horizontally");
                assert.strictEqual(mower.y, initialY, "mower shall move vertically from one step");
                assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
            });
        });
        describe("receiving a turn left instruction", () => {
            const instruction = InstructionEnum.LEFT;
            it("should turn west", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.WEST);
            });
        });
        describe("receiving a turn right instruction", () => {
            const instruction = InstructionEnum.RIGHT;
            it("should turn east", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.EAST);
            });
        });
    });

    describe("facing West", () => {
        const initialOrientation = OrientationEnum.WEST;
        describe("receiving a forward instruction", () => {
            const instruction = InstructionEnum.FORWARD;
            it("should move left when NOT facing a wall", () => {
                const initialX = 1;
                const initialY = 1;

                const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX - 1, "mower shall move left");
                assert.equal(mower.y, initialY, "mower shall NOT move vertically");
                assert.equal(mower.orientation, initialOrientation, "mower orientation shall not change");
            });

            it("should NOT move when facing a wall", () => {
                const initialX = 0;
                const initialY = 1;

                const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX, "mower shall NOT move horizontally");
                assert.equal(mower.y, initialY, "mower shall NOT move vertically");
                assert.equal(mower.orientation, initialOrientation, "mower orientation shall not change");
            });
        });
        describe("receiving a turn left instruction", () => {
            const instruction = InstructionEnum.LEFT;
            it("should turn south", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.SOUTH);
            });
        });
        describe("receiving a turn right instruction", () => {
            const instruction = InstructionEnum.RIGHT;
            it("should turn north", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.NORTH);
            });
        });
    });

    describe("facing East", () => {
        const initialOrientation = OrientationEnum.EAST;
        describe("receiving a forward instruction", () => {
            const instruction = InstructionEnum.FORWARD;
            it("should move right when NOT facing a wall", () => {
                const initialX = 1;
                const initialY = 1;

                const mower: Mower = new Mower(
                    initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX + 1, "mower shall move right");
                assert.strictEqual(mower.y, initialY, "mower shall NOT move vertically");
                assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
            });

            it("should NOT move when facing a wall", () => {
                const initialX = 2;
                const initialY = 1;

                const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX, "mower shall NOT move horizontally");
                assert.strictEqual(mower.y, initialY, "mower shall NOT move vertically");
                assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
            });
        });
        describe("receiving a turn left instruction", () => {
            const instruction = InstructionEnum.LEFT;
            it("should turn north", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.NORTH);
            });
        });
        describe("receiving a turn right instruction", () => {
            const instruction = InstructionEnum.RIGHT;
            it("should turn south", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.SOUTH);
            });
        });
    });

    describe("facing South", () => {
        const initialOrientation = OrientationEnum.SOUTH;
        describe("receiving a forward instruction", () => {
            const instruction = InstructionEnum.FORWARD;
            it("should move down when NOT facing a wall", () => {
                const initialX = 1;
                const initialY = 1;

                const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX, "mower NOT shall move horizontally");
                assert.strictEqual(mower.y, initialY - 1, "mower shall move down");
                assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
            });

            it("should NOT move when facing a wall", () => {
                const initialX = 1;
                const initialY = 0;

                const mower: Mower = new Mower(initialX, initialY, initialOrientation, lawn);
                mower.step(instruction);
                assert.strictEqual(mower.x, initialX, "mower shall NOT move horizontally");
                assert.strictEqual(mower.y, initialY, "mower shall NOT move vertically");
                assert.strictEqual(mower.orientation, initialOrientation, "mower orientation shall not change");
            });
        });
        describe("receiving a turn left instruction", () => {
            const instruction = InstructionEnum.LEFT;
            it("should turn east", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.EAST);
            });
        });
        describe("receiving a turn right instruction", () => {
            const instruction = InstructionEnum.RIGHT;
            it("should turn west", () => {
                orientationTest(instruction, initialOrientation, OrientationEnum.WEST);
            });
        });
    });
    describe("newMower", () => {

        const passingX = 1;
        const passingY = 1;
        const passingOrientiation = OrientationEnum.WEST;

        it("should return a new mower instance inside lawn bounds.", () => {
            // GIVEN
            const initalX = 1;
            const initalY = 1;

            // WHEN
            const newMower = Mower.newMower(initalX, initalY, passingOrientiation, lawn);

            // THEN
            assert.isNotNull(newMower);
            if (newMower) {
                assert.strictEqual(newMower.x, initalX);
                assert.strictEqual(newMower.y, initalY);
                assert.strictEqual(newMower.orientation, passingOrientiation);
            }
        });

        it("should return null when x < 0", () => {
            // GIVEN
            const initalX = -1;
            const initalY = passingY;

            // WHEN
            const newMower = Mower.newMower(initalX, initalY, passingOrientiation, lawn);

            // THEN
            assert.isNull(newMower);
        });

        it("should return null when x > lawn.width", () => {
            // GIVEN
            const initalX = lawn.width + 1;
            const initalY = passingY;

            // WHEN
            const newMower = Mower.newMower(initalX, initalY, passingOrientiation, lawn);

            // THEN
            expect(initalX).to.be.above(lawn.width);
            assert.isNull(newMower);
        });
        it("should return null when y < 0", () => {
            // GIVEN
            const initalX = passingX;
            const initalY = -1;

            // WHEN
            const newMower = Mower.newMower(initalX, initalY, passingOrientiation, lawn);

            // THEN
            assert.isNull(newMower);
        });
        it("should return null when y > lawn.height", () => {
            // GIVEN
            const initalX = passingX;
            const initalY = lawn.height + 1;

            // WHEN
            const newMower = Mower.newMower(initalX, initalY, passingOrientiation, lawn);

            // THEN
            expect(initalY).to.be.above(lawn.height);
            assert.isNull(newMower);
        });
    });
});
