"use strict";!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):e.vuexLocalState=t()}(this,function(){function e(e){c.remove(c.namespace+"-"+e.moduleName+"-"+e.key)}function t(e,t){e.watch(function(e){return t.moduleName===r?e[t.key]:e[t.moduleName][t.key]},function(e){c.set(c.namespace+"-"+t.moduleName+"-"+t.key,e)},{deep:!0})}function n(e,t){if(t.localState){var n=t.localState;t.state=t.state||{};for(var i in n)o(e,t.state,n[i],i)}}function o(e,t,n,o){var i=c.get(c.namespace+"-"+e+"-"+o);"function"==typeof n?(t[o]=n(i),c.set(c.namespace+"-"+e+"-"+o,t[o])):t[o]=void 0===i?n:i,u.push({moduleName:e,key:o,initValue:n})}function i(e){u.forEach(function(n){return t(e,n)})}var u=[],a=window.localStorage,r="__state",c={injection:function(e,t){c.namespace=t.namespace||"_vued",n(r,e);for(var o in e.modules)n(o,e.modules[o]);e.plugins=e.plugins||[],e.plugins.push(i)},clear:function(){return u.forEach(e),u},remove:function(e){a.removeItem(e)},set:function(e,t){return void 0===t?c.remove(e):(a.setItem(e,c.serialize(t)),t)},get:function(e){return c.deserialize(a.getItem(e))},serialize:function(e){return JSON.stringify(e)},deserialize:function(e){if("string"!=typeof e)return void 0;try{return JSON.parse(e)}catch(t){return e||void 0}}};return c});