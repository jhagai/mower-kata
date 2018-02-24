import {InstructionEnum} from "./instruction-enum";
import {ILawn} from "./lawn";
import {OrientationEnum} from "./orientation-enum";

class Mower {
    constructor(private _x: number, private _y: number, private _orientation: OrientationEnum, private _lawn: ILawn) {
    }

    public step(instruction: InstructionEnum) {
        switch (instruction) {
            case InstructionEnum.LEFT:
                this.left();
                break;
            case InstructionEnum.RIGHT:
                this.right();
                break;
            case InstructionEnum.FORWARD:
                this.forward();
                break;
        }
    }

    private forward() {
        let nextX = this._x;
        let nextY = this._y;
        switch (this._orientation) {
            case OrientationEnum.EAST:
                nextX += 1;
                break;
            case OrientationEnum.WEST:
                nextX -= 1;
                break;
            case OrientationEnum.NORTH:
                nextY += 1;
                break;
            case OrientationEnum.SOUTH:
                nextY -= 1;
                break;
        }
        this._x = nextX;
        this._y = nextY;
    }

    private left() {
        switch (this._orientation) {
            case OrientationEnum.EAST:
                this._orientation = OrientationEnum.NORTH;
                break;
            case OrientationEnum.WEST:
                this._orientation = OrientationEnum.SOUTH;
                break;
            case OrientationEnum.NORTH:
                this._orientation = OrientationEnum.WEST;
                break;
            case OrientationEnum.SOUTH:
                this._orientation = OrientationEnum.EAST;
                break;
        }
    }

    private right() {
        switch (this._orientation) {
            case OrientationEnum.EAST:
                this._orientation = OrientationEnum.SOUTH;
                break;
            case OrientationEnum.WEST:
                this._orientation = OrientationEnum.NORTH;
                break;
            case OrientationEnum.NORTH:
                this._orientation = OrientationEnum.EAST;
                break;
            case OrientationEnum.SOUTH:
                this._orientation = OrientationEnum.WEST;
                break;
        }
    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get orientation() {
        return this._orientation;
    }
}

export {Mower};
