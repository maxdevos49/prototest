# ProtoTest

//TODO
- Add node version instructions for flag
- Add specification instructions
- Add ts-prototest instructions
- Add prototest instructions
- Add log instructions
- Add github Repository link

Testing framework with esm support by default without transpilation.

Install with NPM
```sh
npm install prototest
```

## Setup
Test must be in a "test" folder at the root of the project and test files be named like "\<filename\>.test.ts". 
```
Project Root
    |-src
    |   |-...
    |
    |-test
        |-test.test.ts
        |-...
```

Test should be compiled with typescript if being used. Add a test script like below:

```json
//package.json

{
    ...
    "scripts": {
        ...
        "pretest": "npm run build",//if you are using typescript
        "test": "prototest",
    }
}
```

Run test with the command:
```sh
npm run test
```

## Example Test File
```js
//test.test.ts

import { describe, expect, it } from "prototest";

describe("This is a test", () => {

    it("Should do some comparing", () => {

        expect(10).toEqual("10");

    });

});
```
Output:
```
Test Suites

This is a test
   Should do some comparing 
      √ expect 10 toEqual 10 

Passed Test: 1
Failed Test: 0
Total Test: 1

All Test Passed
```