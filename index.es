/* global define */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory()
	: typeof define === 'function' && define.amd ? define(factory) : (global.vuexLocalState = factory());
}(this, function () {
    'use strict';

    class NewState {
        constructor (storeOptions, conf = {}) {
            this.__listenList = [];
            this.ROOT_NAME = '__state';
            this.namespace = conf.namespace || '_vued';
            this.storage = conf.storage || window.localStorage;
            this.key = conf.key || 'localState';

            this.__filter(this.ROOT_NAME, storeOptions);
            for (const i in storeOptions.modules) {
                this.__filter(i, storeOptions.modules[i]);
            }
            storeOptions.plugins = storeOptions.plugins || [];
            storeOptions.plugins.push((store) => {
                this.__listenList.forEach(listen => this.__watchModule(store, listen));
            });
        }

        __watchModule (store, listen) {
            const ROOT_NAME = this.ROOT_NAME;
            store.watch(function (state) {
                if (listen.moduleName === ROOT_NAME) return state[listen.key];
                return state[listen.moduleName][listen.key];
            }, (val) => {
                this.set(`${this.namespace}-${listen.moduleName}-${listen.key}`, val);
            }, {
                deep: true,
            });
        }

        // 对 store 进行初始过滤，赋值过滤。
        __filter (name, module) {
            // 对，具有 localState 的值 进行处理
            const localState = module[this.key];
            if (!localState) return;
            module.state = module.state || {};
            for (const key in localState) {
                this.__dealModule(name, module.state, localState[key], key);
            }
        }
        __dealModule (moduleName, state, initValue, key) {
            const localValue = this.get(`${this.namespace}-${moduleName}-${key}`);
            if (typeof initValue === 'function') {
                state[key] = initValue(localValue);
                this.set(`${this.namespace}-${moduleName}-${key}`, state[key]); // 复存回去，避免不更新的数据。没存住
            } else {
                if (localValue === undefined) {
                    state[key] = initValue;
                } else {
                    state[key] = localValue;
                }
            }
            // 监听变值
            this.__listenList.push({ moduleName, key, initValue });
        }

        // 清空
        clear () {
            this.__listenList.forEach((listen) => {
                this.remove(`${this.namespace}-${listen.moduleName}-${listen.key}`);
            });
            return this.__listenList;
        }
        remove (key) {
            this.storage.removeItem(key);
        }
        set (key, val) {
            if (val === undefined) { return this.remove(key); }
            this.storage.setItem(key, this.serialize(val));
            return val;
        }
        get (key) {
            return this.deserialize(this.storage.getItem(key));
        }
        serialize (value) {
            return JSON.stringify(value);
        }
        deserialize (value) {
            if (typeof value !== 'string') { return undefined; }
            try {
                return JSON.parse(value);
            } catch (e) {
                return value || undefined;
            }
        }
    };

    return NewState;
}));
