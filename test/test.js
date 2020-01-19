/*
 * Copyright (c) 2020
 * Author: Marco Castiello
 * E-mail: marco.castiello@gmail.com
 * Project: composer-core
 */

// Mocking the Blob class to make sure that the text method exists.
class MockBlob extends Blob {
    constructor(parts) {
        super(parts);
        this.parts = parts.slice();
    }

    async text() {
        return this.parts.join(";");
    }
}
self.Blob = MockBlob;
self.EventTarget = null;
self.URL = {
    createObjectURL: blob => blob
};
require('memory-manager-service');
const Composer = require('../src/composer-manager.js').default;

describe("Composer manager", () => {

    class TestComposer {
        static create(data) {
            data["test"] = "testString";
        }

        get test() {
            return Composer.memory.get(this, "test");
        }
    }

    it("should create a composed class", () => {
        const ComposedClass = Composer.compose([TestComposer]);
        expect(typeof ComposedClass === "function").toBeTruthy();
        expect(ComposedClass.prototype.hasOwnProperty("test")).toBeTruthy();
        expect(typeof ComposedClass.prototype.hasOwnProperty("id")).toBeTruthy();
        expect(typeof ComposedClass.prototype.hasOwnProperty("name")).toBeTruthy();
        expect(typeof ComposedClass.prototype.dispose === "function").toBeTruthy();
        expect(typeof ComposedClass.prototype.instanceOf === "function").toBeTruthy();

    });

    it("should be able to create instance", () => {
        const ComposedClass = Composer.compose([TestComposer]);
        const obj = new ComposedClass();

        expect(obj.test === "testString").toBeTruthy();
        expect(typeof obj.id === "string").toBeTruthy();
        expect(obj instanceof ComposedClass).toBeTruthy();
        expect(obj instanceof TestComposer).toBeFalsy();
        expect(obj.instanceOf(ComposedClass)).toBeTruthy();
        expect(obj.instanceOf(TestComposer)).toBeTruthy();

    });
});