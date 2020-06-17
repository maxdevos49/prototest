import { describe, it, expect } from "../src/index.js";

describe("Stuff here", () => {
    it("Does stuff", () => {
        expect(10).toThrow(TypeError);
    });
})