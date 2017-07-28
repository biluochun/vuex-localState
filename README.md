# vuex-local-state
inject localStorage to vuex

## Installation
```bash
$ npm install vuex-local-state --save
```

## API
    new VuexLocalState(storeOptions, [conf]);
    conf default: {
        namespace: '_vued',
        storage: window.localStorage,
        key: 'localState',
    }


## [Examples](https://biluochun.github.io/vuex-localState/test/index.html)

## Usage
```js

import * as Vue from 'vue';
import * as Vuex from 'vuex';
import * as VuexLocalState from 'vuex-local-state';
import subModule from './subModule.js';

const storeOptions = {
    // https://vuex.vuejs.org/zh-cn/state.html
    state: {},

    // vuex-local-state inject
    // 1、 data in vuex and localStorage,
    // 2、 can be a Function: function (count) { return (count || 0) + 1; }
    // 3、 use: store.state.xxx
    // 4、 [Not] use: store.localState.xxx
    localState: {
        count: oldValue => (oldValue || 0) + 1,
    },

    actions: {},
    getters: {},
    mutations: {},
    modules: { subModule },
};

new VuexLocalState(storeOptions);

Vue.use(Vuex);
export new Vuex.Store(storeOptions);
```

```js
// subModule.js
// vuex module
export default {
    // https://vuex.vuejs.org/zh-cn/state.html
    state: {},

    // vuex-local-state inject
    // 1、 data in vuex and localStorage,
    // 2、 can be a Function: function (count) { return (count || 0) + 1; }
    // 3、 use: store.state.xxx
    // 4、 [Not] use: store.localState.xxx
    localState: {
        aaaaa: 1,
        bbbbb: null,
        ccccc: oldValue => (oldValue || 0) + 1,
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
