/*
 * Copyright (c) 2020
 * Author: Marco Castiello
 * E-mail: marco.castiello@gmail.com
 * Project: composer-core
 */

import generateBaseClass from './base-class';

// Keep a reference to the memory manager.
const memory = self.Memory;

/**
 * Manager that can creates composed classes and access shared memory.
 * @type {ComposerManager}
 * @class
 */
class ComposerManager {
    /**
     * Get access to the memory manager.
     * @returns {MemoryManager}
     */
    get memory() {
        return memory;
    }

    /**
     * Build a composed class.
     * @param {Array} composers
     * @returns {Function}
     */
    compose(composers) {
        const baseClass = generateBaseClass(composers);

        for (let composer of composers) {
            const descriptors = Object.getOwnPropertyDescriptors(composer.prototype);

            Object.defineProperties(baseClass.prototype, descriptors);
        }

        return baseClass;
    }
}

export default new ComposerManager();