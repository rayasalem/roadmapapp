'use strict';
/**
 * Web bundle entry only. Metro resolves expo/AppEntry.js to this when building for web.
 * Node (Render) runs expo/AppEntry.js (no .web) which loads serverBootstrap.
 */
var registerRootComponent = require('expo/src/launch/registerRootComponent').default;
var App = require('../App').default;
registerRootComponent(App);
