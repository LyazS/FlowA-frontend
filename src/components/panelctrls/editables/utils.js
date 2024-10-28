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
        const [head,...tail] = path;
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