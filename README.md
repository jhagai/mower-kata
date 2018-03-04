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
3. In case of success parse the file line by line (streaming) and output each mower's final position when instruction line is done processing.

## Process return value
* 0: Success
* 1: An error occured while trying to open input file
* 2: An error occurred while parsing the input file (data is not properly formatted).
* 3: An unknown technical error was raised during the process.
