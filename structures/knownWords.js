const constants = require('./constants');

const knownWords = {
    // special "glue" words that constitute their own parts of speech for our purposes
    and: {tag: {And: true}},
    but: {tag: {But: true}},
    not: {tag: {Not: true}},
    yet: {tag: {But: true}},
  
    // determiners (more added below)
    the: {tag: {Det: true, Article: true}},
    a:   {tag: {Det: true, Article: true}, count: constants.COUNT_SINGULAR, initial: constants.INITIAL_CONSONANT},
    an:  {tag: {Det: true, Article: true}, count: constants.COUNT_SINGULAR, initial: constants.INITIAL_VOWEL},
  
    // copulas
    is:   {tag: {Copula: true}, count: constants.COUNT_SINGULAR},
    was:  {tag: {Copula: true}, count: constants.COUNT_SINGULAR, compatibleWithI: true},
    are:  {tag: {Copula: true}, count: constants.COUNT_PLURAL},
    were: {tag: {Copula: true}, count: constants.COUNT_PLURAL},
    am:   {tag: {Copula: true}, count: constants.COUNT_I, compatibleWithI: true},
  
    // pronouns
    i:    {tag: {SubjPrn: true}, count: constants.COUNT_I},
    he:   {tag: {SubjPrn: true}, count: constants.COUNT_SINGULAR},
    she:  {tag: {SubjPrn: true}, count: constants.COUNT_SINGULAR},
    we:   {tag: {SubjPrn: true}, count: constants.COUNT_PLURAL},
    they: {tag: {SubjPrn: true}, count: constants.COUNT_PLURAL},
    me:   {tag: {ObjPrn: true}, count: constants.COUNT_SINGULAR},
    him:  {tag: {ObjPrn: true}, count: constants.COUNT_SINGULAR},
    her:  {tag: {ObjPrn: true}, count: constants.COUNT_SINGULAR},
    us:   {tag: {ObjPrn: true}, count: constants.COUNT_PLURAL},
    them: {tag: {ObjPrn: true}, count: constants.COUNT_PLURAL},
    it:   {tag: {SubjPrn: true, ObjPrn: true}, count: constants.COUNT_SINGULAR},
    you:  {tag: {SubjPrn: true, ObjPrn: true}, count: constants.COUNT_PLURAL},
  
    // others
    just:  {tag: {Adj: true}},
    kind:  {tag: {Adj: true}},
    like:  {tag: {Verb: true}, count: constants.COUNT_PLURAL},
    made:  {tag: {Verb: true, PastTense: true}},
    own:   {tag: {Verb: true}, count: constants.COUNT_PLURAL},
    thing: {tag: {Noun: true}, count: constants.COUNT_SINGULAR}, // 'thing' is not a gerund for the love of god
    way:   {tag: {Noun: true}, count: constants.COUNT_SINGULAR}
  };
  
  // more determiners
  ['this','that','another','each','every','no'].forEach(function(word){
    knownWords[word] = {tag: {Det: true}, count: constants.COUNT_SINGULAR};
  });
  ['these','those','all','both','few','many','most','other','several','some','such'].forEach(function(word){
    knownWords[word] = {tag: {Det: true}, count: constants.COUNT_PLURAL};
  });

  module.exports = knownWords;