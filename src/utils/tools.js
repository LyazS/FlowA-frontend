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