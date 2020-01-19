/*
 * Copyright (c) 2020
 * Author: Marco Castiello
 * E-mail: marco.castiello@gmail.com
 * Project: composer-core
 */

// Keep a reference to the memory manager.
const memory = self.Memory;

export default composers => {
    /**
     * Generate the basic class for every composer.
     * @type {BasicComposer}
     * @class
     */
    return class BasicComposer {
        /**
         * Initialise the class and execute all the statit initialise methods from each composer.
         * @param {Object} [data]
         * @param {Boolean} [keepAlive]
         */
        constructor(data, keepAlive) {
            data = data || {};

            data.composers = composers.slice();
            data.name = data.name || "";

            for (let composer of composers) {
                if (composer.create) {
                    composer.create(data);
                }
            }

            memory.create(this, data, keepAlive);
            memory.onDispose(this, () => {
                if (memory.has(this) && !memory.get(this, "disposing")) {
                    this.dispose();
                }
            });
        }

        /**
         * Get the composed instance UUID.
         * @returns {String}
         */
        get id() {
            return memory.get(this, "id");
        }

        /**
         * Get the composed instance name.
         * @returns {String}
         */
        get name() {
            return memory.get(this, "name");
        }

        /**
         * Set the name of the object.
         * @param {String} value
         */
        set name(value) {
            return memory.set(this, "name", value);
        }

        /**
         * Check if the object is an instance of the class or composer whose name has been passed as parameter.
         * @param {Function} reference
         * @returns {Boolean}
         */
        instanceOf(reference) {
            return memory.get(this, "composers").indexOf(reference) >= 0 || this instanceof reference;
        }

        /**
         * Dispose the object.
         */
        dispose() {
            if (memory.has(this) && !memory.get(this, "disposing")) {
                for (let composer of composers) {
                    if (composer.destroy) {
                        composer.destroy(this);
                    }
                }

                memory.set(this, "disposing", true);

                memory.dispose(this);
            }
        }
    }
};