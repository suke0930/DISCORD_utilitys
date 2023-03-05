function cloneObject(obj) {//最強。オブジェクトをコピーできる。
    let clone = {};
    Object.keys(obj).forEach((key) => {
        obj[key] != null && typeof obj[key] === 'object'
            ? (clone[key] = cloneObject(obj[key]))
            : (clone[key] = obj[key]);
    });
    return clone;
}
// 現在時間をyyyymmdd形式で返す関数
function Nowdate() {
    const date = new Date(); // 現在の日付と時刻を表すDateオブジェクトを作成
    const year = date.getFullYear(); // 年を取得
    const month = ("00" + (date.getMonth() + 1)).slice(-2); // 月を取得し、2桁になるように0埋めする
    const day = ("00" + date.getDate()).slice(-2); // 日を取得し、2桁になるように0埋めする
    return year + month + day; // 文字列として結合して返す
}

module.exports = { cloneObject };
module.exports = { Nowdate };