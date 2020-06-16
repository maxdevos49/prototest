#!/usr/bin/env node

process.title = 'ProtoTest';

import fs from "fs";
import glob from "glob";
import { status } from "./index.js";


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

    let f = glob.sync("**/*.test.js", {
        absolute: true
    });

    return f.length == 0 ? null : f;
}

/**
 * run the test files
 */
function runTestFiles(f: string[] = []) {

    f.forEach(async (p, index, array) => {

        console.log(p)

        await import(p);

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