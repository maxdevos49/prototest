# ProtoTest

Testing framework with esm support by default without transpilation.

Install with NPM
```sh
npm install prototest
```

## Setup
Test can be named anything you want. By default prototest will look for test using the glob "**/*.test.js". To use a different pattern use the cli flags -t="your-glob" or --target="your-glob".


Test should be compiled with typescript if being used. Add a test script like below:

```json
//package.json

{
    ...
    "scripts": {
        ...
        //if you are using typescript
        "pretest": "npm run build",
        //Optional glob pattern supplied here to instead target files ending in .spec.js as an example
        "test": "prototest -t="**/*.spec.js",
    }
}
```

Run test with the command:
```sh
npm run test
```

Note: Prototest should work without anything extra after node versions 13. It may also be necessary to include the field: `"type": "module"` in your package.json

## Example Test Files and Output
```js
//test.test.js

import { describe, expect, it, log } from "prototest";

describe("This is a test", () => {

    it("Should do some comparing", () => {

        log("My First Log")

        expect(10).toEqual("10");

    });
    log("My Second Log")
});
```

```js
//otherTest.test.js
import { specification, expect, it } from "prototest";

/**
 * Use specification to help describe what you are testing 
 */
specification({
    title: "Test Specification",
    author: [
        "Your Name"
    ],
    date: "October 31, 2020",
    description: "This is the description of this specification",
    notes: [
        "This is a note"
    ],
    specs: [
        ["Suite 1", () => {
            it("Should Run a comparison", () => {
                expect("Hello").toStrictEqual("Hello");
            });
        }],
        ["Suite 2", () => {
            it("Should Run another comparison", () => {
                expect("world!").toStrictEqual("world!");
            });     
        }]
    ]
    
});

```
Output:
```
--- Test File: /Your/Path/To/test.test.js

This is a test
   Should do some comparing 
My First Log
      √ expect 10 toEqual 10 
My Second Log

--- Test File: /Your/Path/To/otherTest.test.js

Specification: Test Specification

Date: October 31, 2020
Author(s): Your Name
Description:
    This is the description of this specification

Notes:
    1. This is a note

Suite 1
   Should Run a comparison
      √ expect Hello toEqual Hello

Suite 2
   Should Run another comparison
      √ expect world! toEqual world!

=========================================

Passed Test: 1
Failed Test: 0
Total Test: 1

All Test Passed
```

## Contributions
---
All help is welcomed. This is my first npm package so please give me any feedback both critical and helpful you see fit on github issues.