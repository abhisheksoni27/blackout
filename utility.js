function clone(val) {
    return JSON.parse(JSON.stringify(val));
}

function contains(list, item) {
    return list.indexOf(item) !== -1;
}

function hasPrefix(str, prefix) {
    return str.substring(0, prefix.length) === prefix;
}

function hasSuffix(str, suffix) {
    var suffixIdx = str.length - suffix.length;
    return str.indexOf(suffix, suffixIdx) === suffixIdx;
}

function isEmptyOrWhitespace(str) {
    return str.replace(/\s+/g, '').length === 0;
}

function normalize(str) {
    return str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');
}

function randNth(list) {
    return list[Math.floor(Math.random() * list.length)];
}

module.exports = {
    clone,
    contains,
    hasPrefix,
    hasSuffix,
    isEmptyOrWhitespacenormalize,
    randNth
}