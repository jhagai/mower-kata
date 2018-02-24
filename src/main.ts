import {ILawn} from "./lawn";
import {Mower} from "./mower";
import {OrientationEnum} from "./orientation-enum";

/*
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream('sample.txt'),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    console.log(`Line from file: ${line}`);
});*/

// print process.argv
// process.argv.forEach(() => (val: string, index: number, array: string[]){});

const lawn: ILawn = {
    height: 5,
    width: 5,
};

const mower: Mower = new Mower(0, 0, OrientationEnum.NORTH, lawn);
// console.log(`${mower.x}${mower.y}${mower.orientation}`);
