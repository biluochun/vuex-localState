
const listenList = [];
const storage = window.localStorage;

const ROOT_NAME = '__state';

function clear (listen) {
    db.remove(`${db.namespace}-${listen.moduleName}-${listen.key}`);
}

function watchModule (store, listen) {
    store.watch(function (state) {
        if (listen.moduleName === ROOT_NAME) return state[listen.key];
        return state[listen.moduleName][listen.key];
    }, function (val) {
        db.set(`${db.namespace}-${listen.moduleName}-${listen.key}`, val);
    }, {
        deep: true,
    });
}

// 对 store 进行初始过滤，赋值过滤。
function filter (name, module) {
    // 对，具有 localState 的值 进行处理
    if (!module.localState) return;
    const localState = module.localState;
    module.state = module.state || {};
    for (const key in localState) {
        dealModule(name, module.state, localState[key], key);
    }
}
function dealModule (moduleName, state, initValue, key) {
    const localValue = db.get(`${db.namespace}-${moduleName}-${key}`);
    if (typeof initValue === 'function') {
        state[key] = initValue(localValue);
        db.set(`${db.namespace}-${moduleName}-${key}`, state[key]); // 复存回去，避免不更新的数据。没存住
    } else {
        if (localValue === undefined) {
            state[key] = initValue;
        } else {
            state[key] = localValue;
        }
    }
    // 监听变值
    listenList.push({ moduleName, key, initValue });
}

function plugin (store) {
    listenList.forEach(listen => watchModule(store, listen));
}

const db = {
    injection (storeOptions, conf) {
        db.namespace = conf.namespace || '_vued';

        filter(ROOT_NAME, storeOptions);
        for (const i in storeOptions.modules) {
            filter(i, storeOptions.modules[i]);
        }
        storeOptions.plugins = storeOptions.plugins || [];
        storeOptions.plugins.push(plugin);
    },

    // 清空
    clear () {
        listenList.forEach(clear);
        return listenList;
    },

    remove (key) {
        storage.removeItem(key);
    },
    set (key, val) {
        if (val === undefined) { return db.remove(key); }
        storage.setItem(key, db.serialize(val));
        return val;
    },
    get (key) {
        return db.deserialize(storage.getItem(key));
    },
    serialize (value) {
        return JSON.stringify(value);
    },
    deserialize (value) {
        if (typeof value !== 'string') { return undefined; }
        try {
            return JSON.parse(value);
        } catch (e) {
            return value || undefined;
        }
    },
};

export default db;
