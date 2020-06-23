import { specification, expect, it } from "../../src/index.js";

specification({
    title: "Doing testing stuff",
    authors: [
        "Maxwell DeVos",
    ],
    date: "January 20, 2020",
    description: "Test",
    specs: [
        ["Test Suite 1", () => {
            it("Does stuff", () => {
                expect(10).toThrow(TypeError);
            });
        }]
    ]
});

