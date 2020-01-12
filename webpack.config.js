/*
 * Copyright (c) 2020
 * Author: Marco Castiello
 * E-mail: marco.castiello@gmail.com
 * Project: composer-core
 */

const path = require('path');

module.exports = {
    entry: './src/composer-manager.js',
    output: {
        filename: 'composer-core.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
