"use strict";
/* global define */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
        : typeof define === 'function' && define.amd ? define(factory) : (global.vuexLocalState = factory());
}(this, function () {
    'use strict';
    var NewState = (function () {
        function NewState(storeOptions, conf) {
            if (conf === void 0) { conf = {}; }
            var _this = this;
            this.__listenList = [];
            this.ROOT_NAME = '__state';
            this.namespace = conf.namespace || '_vued';
            this.storage = conf.storage || window.localStorage;
            this.key = conf.key || 'localState';
            this.__filter(this.ROOT_NAME, storeOptions);
            for (var i in storeOptions.modules) {
                this.__filter(i, storeOptions.modules[i]);
            }
            storeOptions.plugins = storeOptions.plugins || [];
            storeOptions.plugins.push(function (store) {
                _this.__listenList.forEach(function (listen) { return _this.__watchModule(store, listen); });
            });
        }
        NewState.prototype.__watchModule = function (store, listen) {
            var _this = this;
            var ROOT_NAME = this.ROOT_NAME;
            store.watch(function (state) {
                if (listen.moduleName === ROOT_NAME)
                    return state[listen.key];
                return state[listen.moduleName][listen.key];
            }, function (val) {
                _this.set(_this.namespace + "-" + listen.moduleName + "-" + listen.key, val);
            }, {
                deep: true,
            });
        };
        // 对 store 进行初始过滤，赋值过滤。
        NewState.prototype.__filter = function (name, module) {
            // 对，具有 localState 的值 进行处理
            var localState = module[this.key];
            if (!localState)
                return;
            module.state = module.state || {};
            for (var key in localState) {
                this.__dealModule(name, module.state, localState[key], key);
            }
        };
        NewState.prototype.__dealModule = function (moduleName, state, initValue, key) {
            var localValue = this.get(this.namespace + "-" + moduleName + "-" + key);
            if (typeof initValue === 'function') {
                state[key] = initValue(localValue);
                this.set(this.namespace + "-" + moduleName + "-" + key, state[key]); // 复存回去，避免不更新的数据。没存住
            }
            else {
                if (localValue === undefined) {
                    state[key] = initValue;
                }
                else {
                    state[key] = localValue;
                }
            }
            // 监听变值
            this.__listenList.push({ moduleName: moduleName, key: key, initValue: initValue });
        };
        // 清空
        NewState.prototype.clear = function () {
            var _this = this;
            this.__listenList.forEach(function (listen) {
                _this.remove(_this.namespace + "-" + listen.moduleName + "-" + listen.key);
            });
            return this.__listenList;
        };
        NewState.prototype.remove = function (key) {
            this.storage.removeItem(key);
        };
        NewState.prototype.set = function (key, val) {
            if (val === undefined) {
                return this.remove(key);
            }
            this.storage.setItem(key, this.serialize(val));
            return val;
        };
        NewState.prototype.get = function (key) {
            return this.deserialize(this.storage.getItem(key));
        };
        NewState.prototype.serialize = function (value) {
            return JSON.stringify(value);
        };
        NewState.prototype.deserialize = function (value) {
            if (typeof value !== 'string') {
                return undefined;
            }
            try {
                return JSON.parse(value);
            }
            catch (e) {
                return value || undefined;
            }
        };
        return NewState;
    }());
    ;
    return NewState;
}));
