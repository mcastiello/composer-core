/*
 * Copyright (c) 2020
 * Author: Marco Castiello
 * E-mail: marco.castiello@gmail.com
 * Project: composer-core
 */

import Memory from 'memory-manager-service';

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

            Memory.create(this, data, keepAlive);
            Memory.onDispose(this, () => {
                if (Memory.has(this) && !Memory.get(this, "disposing")) {
                    this.dispose();
                }
            });
        }

        /**
         * Get the composed instance UUID.
         * @returns {String}
         */
        get id() {
            return Memory.get(this, "id");
        }

        /**
         * Get the composed instance name.
         * @returns {String}
         */
        get name() {
            return Memory.get(this, "name");
        }

        /**
         * Set the name of the object.
         * @param {String} value
         */
        set name(value) {
            return Memory.set(this, "name", value);
        }

        /**
         * Check if the object is an instance of the class or composer whose name has been passed as parameter.
         * @param {Function} reference
         * @returns {Boolean}
         */
        instanceOf(reference) {
            return Memory.get(this, "composers").indexOf(reference) >= 0 || this instanceof reference;
        }

        /**
         * Dispose the object.
         */
        dispose() {
            if (Memory.has(this) && !Memory.get(this, "disposing")) {
                for (let composer of composers) {
                    if (composer.destroy) {
                        composer.destroy(this);
                    }
                }

                Memory.set(this, "disposing", true);

                Memory.dispose(this);
            }
        }
    }
};