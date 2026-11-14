const checkArray = (arr) => Array.isArray(arr) && arr.length != 0;

const valueIsInteger = (val) => !isNaN(val) && Number.isInteger(Number(val));

const objectsOfSameSize = (obj1, obj2) =>
    Object.keys(obj1).length === Object.keys(obj2).length;

const allKeysIncluded = (obj1, obj2) =>
    Object.keys(obj1).every((key) => Object.keys(obj2).includes(key));

const sameKeysTypes = (obj1, obj2) =>
    Object.keys(obj1).every((key) => typeof obj1[key] === typeof obj2[key]);

const allNumDataPositive = (obj) => {
    const numericKeys = Object.keys(obj).filter(
        (key) => typeof obj[key] === "number",
    );

    return !numericKeys.length || numericKeys.every((key) => obj[key] >= 0);
};

export {
    checkArray,
    valueIsInteger,
    objectsOfSameSize,
    allKeysIncluded,
    sameKeysTypes,
    allNumDataPositive,
};
