import {Mower} from "./mower";
import {Lawn} from "./lawn";
import {OrientationEnum} from "./orientation-enum";

const lawn: Lawn = {
    width: 5,
    height: 5
}

const mower: Mower = new Mower(0, 0, OrientationEnum.NORTH, lawn);
console.log(`${mower.x}${mower.y}${mower.orientation}`);