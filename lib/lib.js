function cloneObject(obj) {//最強。オブジェクトをコピーできる。
    let clone = {};
    Object.keys(obj).forEach((key) => {
        obj[key] != null && typeof obj[key] === 'object'
            ? (clone[key] = cloneObject(obj[key]))
            : (clone[key] = obj[key]);
    });
    return clone;
}
module.exports = [cloneObject];