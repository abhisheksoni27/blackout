const constants = require('./constants');

const genericTagMappings = {
    JJ: {
        tag: {
            Adj: true
        }
    },
    JJR: {
        tag: {
            Adj: true,
            Comparative: true
        }
    },
    JJS: {
        tag: {
            Adj: true,
            Superlative: true
        }
    },
    MD: {
        tag: {
            Modal: true
        }
    },
    NN: {
        tag: {
            Noun: true
        },
        count: constants.COUNT_SINGULAR
    },
    NNS: {
        tag: {
            Noun: true,
            Plural: true
        },
        count: constants.COUNT_PLURAL
    },
    VB: {
        tag: {
            Verb: true
        },
        count: constants.COUNT_PLURAL
    },
    VBD: {
        tag: {
            Verb: true,
            PastTense: true
        }
    },
    VBG: {
        tag: {
            Gerund: true
        }
    },
    VBN: {
        tag: {
            PastParticiple: true
        }
    },
    VBP: {
        tag: {
            Verb: true
        },
        count: constants.COUNT_PLURAL
    },
    VBZ: {
        tag: {
            Verb: true
        },
        count: constants.COUNT_SINGULAR
    }
};
module.exports = genericTagMappings;