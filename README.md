# Mower kata
[![Build Status](https://travis-ci.org/jhagai/mower-kata.svg?branch=master)](https://travis-ci.org/jhagai/mower-kata)
[![codecov](https://codecov.io/gh/jhagai/mower-kata/branch/master/graph/badge.svg)](https://codecov.io/gh/jhagai/mower-kata)

## How to run it
```
npm install
npm start -- <whatever file>
```
A sample test file is available (./test/sample.txt).

## Presentation
The application's entry point is ``` main.ts ```.
It works a follow:
1. Validate read access to the input file.
2. In case of error, log and exit
3. In case of success parse the file line by line (streaming) and output mower's final position when instruction line is done processing.

## Process return value
* 0: Success
* 1: Missing input file
* 2: Provided file does not exist
* 3: File is not readable for current process
* 4: Lawn line format is not compliant
* 5: Mower initialization format is not compliant
* 6: Instruction format is not compliant
