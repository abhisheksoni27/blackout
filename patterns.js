const subjectPatterns = [
    // the subject...
    ['Det', 'Noun'],
    // the adjective subject...
    ['Det', 'Adj', 'Noun'],
    // subjects...
    ['Plural'],
    // adjective subjects...
    ['Adj', 'Plural'],
    // subjects and subjects...
    ['Plural', 'And', 'Plural'],
    // the subjects and subjects...
    ['Det', 'Plural', 'And', 'Plural'],
    // Max...
    ['Person'],
    // I...
    ['SubjPrn']
  ];

const verbObjectPatterns = [
    // ...is adjective
    {verb: ['Copula'], object: ['Adj']},
    // ...is adjective and adjective
    {verb: ['Copula'], object: ['Adj', 'And', 'Adj']},
    // ...is not adjective
    {verb: ['Copula'], object: ['Not', 'Adj']},
    // ...is adjective but adjective
    {verb: ['Copula'], object: ['Adj', 'But', 'Adj']},
    // ...is adjective but not adjective
    {verb: ['Copula'], object: ['Adj', 'But', 'Not', 'Adj']},
    // ...is verbing
    {verb: ['Copula'], object: ['Gerund']},
    // ...is the object
    {verb: ['Copula'], object: ['Article', 'Noun']},
    // ...is in the object (DISABLED)
    //{verb: ['Copula'], object: ['Prep', 'Article', 'Noun']},
    // ...is in the adjective object (DISABLED)
    //{verb: ['Copula'], object: ['Prep', 'Article', 'Adjective', 'Noun']},
    // ...is in my object (DISABLED)
    //{verb: ['Copula'], object: ['Prep', 'Possessive', 'Noun']},
    // ...is in my adjective object (DISABLED)
    //{verb: ['Copula'], object: ['Prep', 'Possessive', 'Adj', 'Noun']},
    // ...can verb
    {verb: ['Modal', 'Infinitive'], object: []},
    // ...can verb the object
    {verb: ['Modal', 'Infinitive'], object: ['Article', 'Noun']},
    // ...verbs adverbially (DISABLED)
    //{verb: ['Verb', 'Adverb'], object: []},
    // ...verbs the object
    {verb: ['Verb'], object: ['Article', 'Noun']},
    // ...verbs to the object
    //{verb: ['Verb'], object: ['Prep', 'Article', 'Noun']},
    // ...verbs the adjective object
    {verb: ['Verb'], object: ['Article', 'Adj', 'Noun']},
    // ...verbs objects
    {verb: ['Verb'], object: ['Plural']},
    // ...verbs adjective objects
    {verb: ['Verb'], object: ['Adj', 'Plural']},
    // ...verbs objects and objects
    {verb: ['Verb'], object: ['Plural', 'And', 'Plural']},
    // ...verbs the objects and objects
    {verb: ['Verb'], object: ['Det', 'Plural', 'And', 'Plural']},
    // ...verbs to objects and objects
    //{verb: ['Verb'], object: ['Prep', 'Plural', 'And', 'Plural']},
    // ...verbs Max
    {verb: ['Verb'], object: ['Person']},
    // ...verbs me
    {verb: ['Verb'], object: ['ObjPrn']}
    // ...verbs to me
    //{verb: ['Verb'], object: ['Prep', 'ObjPrn']}
  ];
  
const patterns = [];
for (let i = 0; i < subjectPatterns.length; i++){
    for (let j = 0; j < verbObjectPatterns.length; j++){
      const pattern = Object.assign({}, verbObjectPatterns[j]);
      pattern.subject = subjectPatterns[i];
      patterns.push(pattern);
    }
}

module.exports = patterns;