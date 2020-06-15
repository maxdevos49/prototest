import { describe, it, expect } from "../src/index.js";
import { helloworld } from "./helloworld.js";

// beforeEachDescribe(() => {
//     console.log("before each");
// });

// afterEachDescribe(() => {
//     console.log("after each");
// });


describe('First test group', () => {


    // beforeAllIt(() => {
    //     console.log("before all");
    // });

    // afterAll(() => {
    //     console.log("after all");
    // });


    it('does a few things', () => {

        expect(helloworld()).toEqual('Hello World!');//True

        expect(10).toBeDefined();//True

        expect("wazzzzup").toStrictEqual("wazzzzup");//True

        expect(null).toBeNull();//True
    });


    it('does a another few things', () => {

        expect("10").toEqual(11);//True

        expect("").toBeFalsy();//true

        expect("Hey").toBeTruthy();//true
    });

});