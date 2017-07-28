# vuex-localState
inject localStorage to vuex

## 使用方法
```javascript

import * as Vue from 'vue';
import * as Vuex from 'vuex';
import vuexLocalState from 'vuex-localState';
import subModule from './subModule.js';

const store = {
    state: {},
    localState: {
        count: oldValue => (oldValue || 0) + 1,
    },
    actions: {},
    getters: {},
    mutations: {},
    modules: { subModule },
};
// 本地存储 对 store 进行处理，注入
vuexLocalState.injection(store);

Vue.use(Vuex);
export new Vuex.Store(store);
```


```javascript
// subModule.js
// vuex module 示例
export default {
    // https://vuex.vuejs.org/zh-cn/state.html
    state: {},

    // vuex-localState 注入 vuex 后新增功能。与 https://vuex.vuejs.org/zh-cn/state.html 相比，只是新增部分功能：
    // 1、存储于 localStorage 内，刷新后不会丢失
    // 2、初始值为函数时: 函数参数为本地数据，返回值将被存储。比如每次刷新计数器: function (count) { return (count || 0) + 1; }
    // 3、注意事项！！使用方法上与state【相同】： store.state.xxx (注意是state,不是store.localState)
    localState: {
        aaaaa: 1, // 若 localStorage.aaaaa 内值为 undefined， 则 state.aaaaa === 1
        bbbbb: null, // 若 localStorage.bbbbb 内值为 undefined， 则 state.bbbbb === null
        ccccc: oldValue => (oldValue || 0) + 1, // 每次刷新 ccccc 的值递增
        // 超时重置
        ddddd: (oldValue = {}) => {
            if (Date.now() - (oldValue.saveTime || 0) < 60 * 1000) return oldValue;
            return {};
        },
    },

    getters: {},

    actions: {},

    mutations: {},
};


```