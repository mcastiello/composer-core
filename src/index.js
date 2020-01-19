/*
 * Copyright (c) 2020
 * Author: Marco Castiello
 * E-mail: marco.castiello@gmail.com
 * Project: composer-core
 */

import 'memory-manager-service';
import manager from './composer-manager.js';

self.Composer = manager;

// Let's keep the memory to ourselves.
delete self.Memory;

export default manager;