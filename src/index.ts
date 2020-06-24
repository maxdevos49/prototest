
import colors from "colors";

interface IExpect {
    name: string,
    status: boolean,
}

interface IResult {
    message: any;
    type: ResultType;
    status: Status;
}

enum ResultType {
    Log,
    Describe,
    It,
    Expect,
    None
}

enum Status {
    Success,
    Failed,
    None

}

interface IProtoTestStats {

    totalTest: number;
    passedTest: number;
    failedTest: number;

    beforeEach: Array<() => void>;
    afterEach: Array<() => void>;

    beforeAll: Array<() => void>;
    afterAll: Array<() => void>;

    testResults: Array<IResult>;
}

const testStats: IProtoTestStats = {
    totalTest: 0,
    passedTest: 0,
    failedTest: 0,

    beforeAll: [],
    afterAll: [],

    beforeEach: [],
    afterEach: [],

    testResults: []
}


export function beforeEach(fn: () => void) {
    testStats.beforeEach.push(fn);
}


export function afterEach(fn: () => void) {
    testStats.afterEach.push(fn);
}


export function beforeAll(fn: () => void) {
    testStats.beforeAll.push(fn);
}


export function afterAll(fn: () => void) {
    testStats.afterAll.push(fn);
}

export function reset(): void {
    testStats.afterAll = [];
    testStats.beforeAll = [];
    testStats.afterEach = [];
    testStats.beforeEach = [];
}

export function describe<T>(this: T, description: string, describeCallback: () => void): void {

    testStats.beforeAll.forEach((fn) => {
        fn.apply(this);
    })

    internalLog([description], ResultType.Describe, Status.None);

    describeCallback.apply(this);

    testStats.afterAll.forEach((fn) => {
        fn.apply(this);
    });
    log();
}


export function it<T>(this: T, shouldDescription: string, itCallback: () => void) {

    testStats.beforeEach.forEach(fn => {
        fn.apply(this);
    });

    internalLog([shouldDescription], ResultType.It, Status.None);

    itCallback.apply(this)

    testStats.afterEach.forEach(fn => {
        fn.apply(this);
    });
}

export function expect<T>(value: T) {

    const addExpect = (expect: IExpect) => {
        testStats.totalTest++;
        expect.status ? testStats.passedTest++ : testStats.failedTest++;

        internalLog([expect.name], ResultType.Expect, expect.status ? Status.Success : Status.Failed);
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

        toThrow<R extends ErrorConstructor>(type: R) {

            try {
                if (typeof value === "function")
                    value();

            } catch (err) {

                if (err instanceof type)
                    return addExpect({
                        name: `expect ${value} toThrow ${type.name}`,
                        status: true
                    });

            }

            addExpect({
                name: `expect ${value} toThrow ${type.name}`,
                status: false
            });
        },

        toHaveMethod(methodName: string) {
            if (typeof value === "object") {
                let prop = (value as any)[methodName];

                if (typeof prop === "function")
                    return addExpect({
                        name: `expect object toHaveMethod: ${methodName}`,
                        status: true
                    });
            }

            //Failed
            addExpect({
                name: `expect object toHaveMethod: ${methodName}`,
                status: false
            });
        },

        toHaveProperty(propertyName: string) {
            if (typeof value === "object") {
                let prop = (value as any)[propertyName];

                if (prop)
                    return addExpect({
                        name: `expect object toHaveProperty: ${propertyName}`,
                        status: true
                    });
            }

            //Failed
            addExpect({
                name: `expect object toHaveProperty: ${propertyName}`,
                status: false
            });
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


export interface ISpecification {
    title: string;
    authors?: Array<string>;
    date?: string;
    description: string;
    notes?: Array<string>;
    specs: Array<[string, () => void]>;
}
export function specification(specification: ISpecification): void {

    if (specification === null || specification === undefined)
        throw new TypeError("The specification cannot be null or undefined");

    log(`${"Specification:".bgBlue.underline}  ${specification.title}`.bold);
    log();
    log("Date: " + specification.date ?? "Na");
    log("Author(s): " + specification?.authors?.join(", ") ?? "Na");
    log("Description:\n    " + specification.description);
    log();

    if (specification.notes) {
        log("Notes: ");
        specification.notes.forEach((note, index) => {
            log(`    ${index + 1}. ${note}`);
        });
    }

    specification.specs.forEach(spec => describe(spec[0], spec[1]));

    reset();
}

export function log(...logs: any[]): void {
    if (logs.length === 0)
        logs.push("");

    internalLog(logs, ResultType.Log, Status.None)
}

function internalLog(logs: any[], type: ResultType, status: Status) {
    logs.forEach((log) => {
        testStats.testResults.push({
            message: log,
            type: type,
            status: status,
        });
    });
}

export function status(): void {

    log();
    log("================================================");
    log();
    log("Test Results".underline.bold);
    log(`Total Test: ${testStats.totalTest}`);
    log(`Failed Test: ${testStats.failedTest.toString().red}`);
    log(`Passed Test: ${testStats.passedTest.toString().green}`);
    log();
    log((testStats.failedTest ? `${testStats.failedTest} test Failed`.bgRed : "All Test Passed".bgGreen).bold);
    log();

    testStats.testResults.forEach((result) => {

        let message: string = result.message;

        //assign color if needed
        if (result.status === Status.Failed)
            message = colors.red(result.message);
        else if (result.status === Status.Success)
            message = colors.green(result.message);

        if (result.type === ResultType.Describe)
            message = message.toString().underline;
        if (result.type === ResultType.It)
            message = "    " + message;
        else if (result.type === ResultType.Expect) {
            let icon = "";

            if (result.status === Status.Success)
                icon = colors.green("√");
            else if (result.status === Status.Failed)
                icon = colors.red("X");

            message = `        ${icon} ${message}`;
        }

        console.log(message);
    });

}