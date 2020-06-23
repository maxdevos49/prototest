import fs from "fs";
import glob from "glob";
import { status, log } from "./index.js";

let globPattern: string = "**/*.test.js";

//Process cli flags
if (process.argv.length > 2) {
    let args = process.argv.slice(2, process.argv.length);

    args.forEach((flag) => {
        let [key, value] = flag.split("=");

        if (key === "-t" || key === "--target")
            globPattern = value;
    })
}

/** 
 * search for test folder 
 */
function searchTestFolder() {
    if (!fs.existsSync('test/')) {
        return false
    }
    return true
}

/**
 * get all test files in the test/ folder
 */
function getTestFiles(): string[] | null {

    let f = glob.sync(globPattern, {
        absolute: true
    });

    return f.length == 0 ? null : f;
}

/**
 * run the test files
 */
function runTestFiles(f: string[] = []) {

    log();
    log();
    log(("--- Test File: " + f[0] + " ---").bold);
    log();
    f.forEach(async (p, index, array) => {

        await import(p);

        if (index + 1 < array.length) {
            log();
            log();
            log(("--- Test File: " + array[index + 1] + " ---").bold);
            log();
        }

        if (array.length - 1 == index) {
            status();
        }

        if (f.length === 0)
            status();
    });
}

function run() {

    if (searchTestFolder()) {
        let files;
        if (files = getTestFiles()) {
            runTestFiles(files)
        } else {
            console.error('No test files found.')
        }
    } else {
        console.error(`'test/' folder doesn't exist`)
    }
}

run();