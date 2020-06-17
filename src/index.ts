
import colors from "colors";

interface IDescribe {
    name: string;
    it: Array<IIt>;

    currentIt?: IIt;
}

interface IIt {
    name: string,
    expects: Array<IExpect>;
}

interface IExpect {
    name: string,
    status: boolean
}

interface IProtoTestStats {

    totalTest: number;
    passedTest: number;
    failedTest: number;

    beforeEach: Array<() => void>;
    afterEach: Array<() => void>;

    beforeAll: Array<() => void>;
    afterAll: Array<() => void>;

    stats: Array<IDescribe>;

    currentDescribe?: IDescribe;
}

const testStats: IProtoTestStats = {
    totalTest: 0,
    passedTest: 0,
    failedTest: 0,

    beforeAll: [],
    afterAll: [],

    beforeEach: [],
    afterEach: [],

    stats: []
}

//#region Before/Afters

// /**
//  * Perform a action before each test group.
//  * @param fn The callback of the action to perform.
//  */
// export function beforeEachDescribe(fn: () => void) {
//     testStats.beforeEach.push(fn);
// }

// /**
//  * Perform a action after each test group.
//  * @param fn The callback of the action to perform
//  */
// export function afterEachDescribe(fn: () => void) {
//     testStats.afterEach.push(fn);
// }

// /**
//  * Perform a action before each individual test.
//  * @param fn The callback of the action to perform
//  */
// export function beforeAllIt(fn: () => void) {
//     testStats.beforeAll.push(fn);
// }

// /**
//  * Perform a action after each individual test
//  * @param fn The callback of the action to perform
//  */
// export function afterAll(fn: () => void) {
//     testStats.afterAll.push(fn);
// }

//#endregion


export function describe<T>(this: T, description: string, describeCallback: () => void): void {
    testStats.currentDescribe = {
        name: description,
        it: [],
    }

    testStats.beforeAll.forEach((fn) => {
        fn.apply(this);
    })

    describeCallback.apply(this);

    testStats.afterAll.forEach((fn) => {
        fn.apply(this);
    });

    testStats.stats.push(testStats.currentDescribe);
}



export function it<T>(this: T, shouldDescription: string, itCallback: () => void) {

    if (!testStats.currentDescribe)
        throw new Error(`Unexpected "it" call. Make sure it occurs only inside of "describe" function callbacks.`);

    testStats.currentDescribe.currentIt = {
        name: shouldDescription,
        expects: []
    }

    testStats.beforeEach.forEach(fn => {
        fn.apply(this);
    });

    itCallback.apply(this)

    testStats.afterEach.forEach(fn => {
        fn.apply(this);
    });

    testStats.currentDescribe?.it.push(testStats.currentDescribe.currentIt);
}


export function expect<T>(value: T) {

    const addExpect = (expect: IExpect) => {
        testStats.totalTest++;
        expect.status ? testStats.passedTest++ : testStats.failedTest++;
        testStats.currentDescribe?.currentIt?.expects.push(expect);
    }

    return {

        // Match or Asserts that expected and actual objects are same.
        toBe(expected: T) {
            addExpect({
                name: `expect ${value} toBe ${expected}`,
                status: (value === expected)
            });
        },

        // Match the expected and actual result of the test.
        toEqual<R>(expected: T | R) {
            addExpect({
                name: `expect ${value} toEqual ${expected}`,
                status: (value == expected)
            })
        },

        toStrictEqual(expected: T) {
            addExpect({
                name: `expect ${value} toStrictEqual ${expected}`,
                status: (value === expected)
            });
        },

        toBeDefined() {
            addExpect({
                name: `expect ${value} toBeDefined`,
                status: (value !== undefined)
            });
        },

        toBeUndefined() {
            addExpect({
                name: `expect ${value} toBeUndefined`,
                status: (value === undefined)
            });
        },

        //Method is used to check expected result is undefined or not.
        toBeNull() {
            addExpect({
                name: `expect ${value} toBeNull`,
                status: (value === null)
            });
        },

        //Method is used to check expected result is null or not.
        toBeTruthy() {
            addExpect({
                name: `expect ${(typeof value === "string") ? ('"' + value + '"') : value} toBeTruthy`,
                status: Boolean(value) === true
            });
        },

        //Method is used to match the expected result is true or not i.e. means expected result is a Boolean value.
        toBeFalsy() {
            addExpect({
                name: `expect ${(typeof value === "string") ? ('"' + value + '"') : value} toBeFalsy`,
                status: Boolean(value) === false
            });
        },

        toThrow<R extends Error>(type: R) {

            try {
                if (typeof value === "function") {
                    value();
                }

                addExpect({
                    name: `expect ${value} toThrow ${typeof type}`,
                    status: false
                });

            } catch (err) {
                addExpect({
                    name: `expect ${value} toThrow ${typeof type}`,
                    status: true
                });
            }
        }

        // not: {
        //     toBe: function (expected: T) {
        //         if (value !== expected) {
        //             testStats.currentDescribe?.currentIt?.expects.push({ name: `expect ${ value } toEqual ${ expected } `, status: true })
        //             testStats.passedTest++
        //         } else {
        //             testStats.currentDescribe?.currentIt?.expects.push({ name: `expect ${ value } toEqual ${ expected } `, status: false })
        //             testStats.failedTest++
        //         }
        //     }
        // },
    }
}

export function status(): void {

    console.log();
    console.log(colors.bold(testStats.failedTest > 0 ? colors.bgRed("Test Suites") : colors.bgGreen("Test Suites")));
    console.log();

    testStats.stats.forEach(describe => {
        console.log(describe.name);

        describe.it.forEach(it => {
            console.log(`   ${it.name} `);

            it.expects.forEach(expect => {
                console.log(`      ${expect.status === true ? colors.green('√') : colors.red('X')} ${expect.name} `)
            });
        });

        console.log();
    });


    // console.log("Test Suites: " + testStats.stats.length);
    // console.log();
    console.log("Passed Test: " + colors.green(testStats.passedTest + ""));
    console.log("Failed Test: " + colors.red(testStats.failedTest + ""));
    console.log("Total Test: " + testStats.totalTest);
    console.log();

    if (testStats.failedTest) {
        console.log(colors.red(testStats.failedTest + " Test Failed\n"));
        process.exit(1);
    } else {
        console.log(colors.green("All Test Passed\n"));
        process.exit(0);
    }

}