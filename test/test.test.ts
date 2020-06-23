import { specification, it, expect } from "../src/index.js";


specification({
    title: "Doing testing stuff",
    authors: [
        "Maxwell DeVos",
    ],
    date: "January 20, 2020",
    description: "This is a test specification description. It is here to assist the programmer while writing test suites for the given target.\n It is here to assist the programmer while writing test suites for the given target. It is here to assist the programmer while writing test suites for the given target. It is here to assist the programmer while writing test suites for the given target. \n\nIt is here to assist the programmer while writing test suites for the given target.",
    specs: [
        ["Test Suite 1", () => {
            it("Should Does stuff", () => {
                expect(10).toBe(10);
            });
        }]
    ]
});

