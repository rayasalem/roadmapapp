'use strict';
/**
 * Node-only: starts the static server for Render. Not bundled for web (see metro.config.js).
 */
var path = require('path');
require(path.resolve(__dirname, '..', 'server.js'));
