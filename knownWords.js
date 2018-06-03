const knownWords = {
    // special "glue" words that constitute their own parts of speech for our purposes
    and: {tag: {And: true}},
    but: {tag: {But: true}},
    not: {tag: {Not: true}},
    yet: {tag: {But: true}},
  
    // determiners (more added below)
    the: {tag: {Det: true, Article: true}},
    a:   {tag: {Det: true, Article: true}, count: COUNT_SINGULAR, initial: INITIAL_CONSONANT},
    an:  {tag: {Det: true, Article: true}, count: COUNT_SINGULAR, initial: INITIAL_VOWEL},
  
    // copulas
    is:   {tag: {Copula: true}, count: COUNT_SINGULAR},
    was:  {tag: {Copula: true}, count: COUNT_SINGULAR, compatibleWithI: true},
    are:  {tag: {Copula: true}, count: COUNT_PLURAL},
    were: {tag: {Copula: true}, count: COUNT_PLURAL},
    am:   {tag: {Copula: true}, count: COUNT_I, compatibleWithI: true},
  
    // pronouns
    i:    {tag: {SubjPrn: true}, count: COUNT_I},
    he:   {tag: {SubjPrn: true}, count: COUNT_SINGULAR},
    she:  {tag: {SubjPrn: true}, count: COUNT_SINGULAR},
    we:   {tag: {SubjPrn: true}, count: COUNT_PLURAL},
    they: {tag: {SubjPrn: true}, count: COUNT_PLURAL},
    me:   {tag: {ObjPrn: true}, count: COUNT_SINGULAR},
    him:  {tag: {ObjPrn: true}, count: COUNT_SINGULAR},
    her:  {tag: {ObjPrn: true}, count: COUNT_SINGULAR},
    us:   {tag: {ObjPrn: true}, count: COUNT_PLURAL},
    them: {tag: {ObjPrn: true}, count: COUNT_PLURAL},
    it:   {tag: {SubjPrn: true, ObjPrn: true}, count: COUNT_SINGULAR},
    you:  {tag: {SubjPrn: true, ObjPrn: true}, count: COUNT_PLURAL},
  
    // others
    just:  {tag: {Adj: true}},
    kind:  {tag: {Adj: true}},
    like:  {tag: {Verb: true}, count: COUNT_PLURAL},
    made:  {tag: {Verb: true, PastTense: true}},
    own:   {tag: {Verb: true}, count: COUNT_PLURAL},
    thing: {tag: {Noun: true}, count: COUNT_SINGULAR}, // 'thing' is not a gerund for the love of god
    way:   {tag: {Noun: true}, count: COUNT_SINGULAR}
  };
  
  // more determiners
  ['this','that','another','each','every','no'].forEach(function(word){
    knownWords[word] = {tag: {Det: true}, count: COUNT_SINGULAR};
  });
  ['these','those','all','both','few','many','most','other','several','some','such'].forEach(function(word){
    knownWords[word] = {tag: {Det: true}, count: COUNT_PLURAL};
  });

  module.exports = knownWords;