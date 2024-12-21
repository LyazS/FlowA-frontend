import { ref, computed, h, inject, watch } from 'vue';
import {
    NFlex,
    NIcon,
    NSelect,
    NButton,
    NText,
    NSwitch,
    NCard,
    NForm,
    NFormItem,
    NGrid,
    NGridItem,
    NInput,
    NSpace,
    NTag
} from 'naive-ui';

const getFullUuid = () => {
    if (typeof crypto === 'object') {
        if (typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        if (typeof crypto.getRandomValues === 'function' && typeof Uint8Array === 'function') {
            const callback = (c) => {
                const num = Number(c);
                return (num ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (num / 4)))).toString(16);
            };
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, callback);
        }
    }
    let timestamp = new Date().getTime();
    let perforNow = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let random = Math.random() * 16;
        if (timestamp > 0) {
            random = (timestamp + random) % 16 | 0;
            timestamp = Math.floor(timestamp / 16);
        } else {
            random = (perforNow + random) % 16 | 0;
            perforNow = Math.floor(perforNow / 16);
        }
        return (c === 'x' ? random : (random & 0x3) | 0x8).toString(16);
    });
};

export const getUuid = () => {
    // 替换掉-
    return getFullUuid().replace(/-/g, '');
};

export const sortKeys = (obj) => Object.keys(obj).sort((a, b) => a.localeCompare(b));

export const getValueByPath = (obj, path) => {
    try {
        return path.reduce(
            (acc, key) => (acc && acc[key] !== undefined) ? acc[key] : undefined,
            obj,
        );
    } catch (error) {
        console.error('Invalid path:', path, error);
        return undefined;
    }
};

export const setValueByPath = (obj, path, value) => {
    try {
        const [head, ...tail] = path;
        if (tail.length === 0) {
            obj[head] = value;
        } else {
            if (obj[head] === undefined) {
                obj[head] = {};
            }
            setValueByPath(obj[head], tail, value);
        }
    } catch (error) {
        console.error('Invalid path:', path, error);
    }
};

export const isPathConnected = (obj, path) => {
    try {
        const value = getValueByPath(obj, path);
        return value !== undefined;
    } catch (error) {
        return false;
    }
};

export function SubscribeSSE(
    url,
    method,
    headers,
    body,
    onOpen,
    onMessage,
    onClose,
    onError,
) {
    const controller = new AbortController();
    const signal = controller.signal;
    async function subscribe() {
        try {
            let sseconfig = {
                method: method,
                signal: controller.signal,
                ...(headers !== null && { headers }),
                ...(body !== null && { body }),
                async onopen(event) {
                    if (signal.aborted) {
                        return;
                    };
                    await onOpen(event);
                },
                async onmessage(event) {
                    if (signal.aborted) {
                        return;
                    };
                    await onMessage(event);
                },
                async onclose() { await onClose(); controller.abort(); },
                async onerror(err) { await onError(err); controller.abort(); throw err; },
            }
            console.log('Subscribing to SSE:', url);
            await fetchEventSource(url, sseconfig);
        } catch (err) {
            console.error('fetchEventSource error:', err);
            await onError(err);
            controller.abort();
        }
    }

    function unsubscribe() {
        controller.abort();
        console.log('SSE subscription unsubscribed.');
    }
    return {
        subscribe,
        unsubscribe,
    }
}

export const mapVarItemToSelect = (item) => {
    return {
        label: `${item.nlabel}/${item.dlabel}/${item.dkey}/${item.dtype}`,
        value: `${item.nodeId}/${item.dpath[0]}/${item.dpath[1]}`,
    }
}


export function deepFreeze(obj) {
    // 获取对象的属性名称
    const propNames = Object.getOwnPropertyNames(obj);

    // 递归地冻结每一个属性
    for (const name of propNames) {
        const value = obj[name];
        if (typeof value === 'object' && value !== null) {
            deepFreeze(value);
        }
    }

    // 冻结对象本身（浅冻结加递归冻结属性）
    return Object.freeze(obj);
}
export function isPlainObject(value) {
    // 首先判断是否是对象类型
    if (typeof value !== 'object' || value === null) {
        return false;
    }

    // 判断对象的原型是否是 Object.prototype
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
}
export function isString(value) {
    return typeof value === 'string';
}
export function isJsonString(value) {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
}