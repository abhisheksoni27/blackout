const pos = require('pos');
const lexicon = require('pos/lexicon');
const utility = require('./utility');
const patterns = require('./structures/patterns');
const knownWords = require('./structures/knownWords');
const blacklisted = require('./structures/blacklisted');
const genericTagMappings = require('./structures/genericTagMappings');
const constants = require('./structures/constants');

// word classification

function shouldIgnore(word) {
  return blacklisted[word.normal] ||
    utility.isEmptyOrWhitespace(word.normal) ||
    word.text.indexOf('\'') !== -1 ||
    word.text.indexOf('’') !== -1 ||
    word.text.indexOf('—') !== -1;
}

function classify(word) {
  word.tag = {};
  if (shouldIgnore(word)) {
    // never use explicitly blacklisted words
  } else if (knownWords[word.normal]) {
    word = Object.assign(word, utility.clone(knownWords[word.normal]));
  } else if (utility.contains(['CC', 'DT', 'PDT', 'PP$', 'PRP'], word.initTag)) {
    // If the word's initTag is "fully enumerated", all legal words for that tag should be known.
    // Thus, if we get here, it might be worth logging the word to see if we've missed any legal words.
  } else {
    if (word.lexTags && !utility.contains(word.lexTags, word.initTag)) {
      word.initTag = word.lexTags[0];
    }
    var info = genericTagMappings[word.initTag];
    if (info) {
      word = Object.assign(word, utility.clone(info));
    }
  }
  // specially label infinitive verb forms (so we can use them with modals)
  if (word.tag.Verb && word.count === constants.COUNT_PLURAL) {
    word.tag.Infinitive = true;
  }
  return word;
}


function taggedTokenToWord(taggedToken, index) {
  var text = taggedToken[0];
  var normal = utility.normalize(text);
  return {
    text: text,
    initTag: taggedToken[1],
    normal: normal,
    lexTags: lexicon[normal],
    index: index
  };
}

function wordify(text) {
  var tokens = text.split(/\s+/g).filter(s => s && !utility.isEmptyOrWhitespace(s));
  var tagger = new pos.Tagger();
  var taggedTokens = tagger.tag(tokens);
  var words = taggedTokens.map(taggedTokenToWord);
  words = words.map(classify);
  return words;
}

// pattern matching

function createMatcher(pattern) {
  return {
    pattern: [pattern.subject, pattern.verb, pattern.object],
    state: constants.STATE_SUBJ,
    patternIdx: 0,
    requiredCount: constants.COUNT_ANY,
    requiredInitial: constants.INITIAL_ANY,
    words: []
  };
}

function hasRequiredCount(word, requiredCount) {
  if (requiredCount === constants.COUNT_ANY || !word.count) {
    return true;
  } else if (requiredCount === constants.COUNT_I) {
    // 'I' takes 'am'/'was' for copula, plural forms otherwise
    return word.tag.Copula ? word.compatibleWithI : requiredCount === constants.COUNT_PLURAL;
  } else {
    return requiredCount === word.count;
  }
}

function hasRequiredInitial(word, requiredInitial) {
  if (requiredInitial === constants.INITIAL_ANY || !requiredInitial) {
    return true;
  } else {
    var initial = word.normal.substring(0, 1);
    var actual = utility.contains(['a', 'e', 'i', 'o', 'u'], initial) ? constants.INITIAL_VOWEL : constants.INITIAL_CONSONANT;
    return requiredInitial === actual;
  }
}

function shouldAccept(matcher, word) {
  var targetTag = matcher.pattern[matcher.state][matcher.patternIdx];
  return word.tag[targetTag] &&
    hasRequiredCount(word, matcher.requiredCount) &&
    hasRequiredInitial(word, matcher.requiredInitial) &&
    Math.random() < 0.8;
}

function pushWord(matcher, word) {
  if (matcher.state === constants.STATE_DONE) return matcher; // don't push more words onto a finished match

  matcher.words.push(word);
  matcher.patternIdx += 1;
  matcher.requiredInitial = word.initial || constants.INITIAL_ANY;
  if (word.count) {
    matcher.requiredCount = word.count;
  }

  // maybe advance state
  if (matcher.patternIdx >= matcher.pattern[matcher.state].length) {
    matcher.state += 1;
    matcher.patternIdx = 0;
    if (matcher.state === constants.STATE_OBJ) {
      matcher.requiredCount = constants.COUNT_ANY;
    }
  }

  return matcher;
}

// tie it all together

function markSentence(words) {
  var finishedMatchers = [];
  var openMatchers = patterns.map(createMatcher);
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var remaining = openMatchers;
    openMatchers = [];
    for (var j = 0; j < remaining.length; j++) {
      var matcher = remaining[j];
      var pile = openMatchers;
      if (shouldAccept(matcher, word)) {
        matcher = pushWord(matcher, word);
        if (matcher.state === constants.STATE_DONE) {
          pile = finishedMatchers;
        }
      }
      pile.push(matcher);
    }
    if (openMatchers.length === 0) break; // all matchers finished successfully!
  }
  var matches = finishedMatchers.map(m => m.words);
  var matchedWords = matches.length > 0 ? utility.randNth(matches) : [];
  for (i = 0; i < matchedWords.length; i++) {
    matchedWords[i].marked = true;
  }
  return words;
}

function poemify(text) {
  let words = wordify(text);
  let marked;
  // mark words to keep (i.e. not black out)
  let attempts = 0;
  while (attempts < 5) {
    words = markSentence(words);
    marked = words.filter(w => w.marked);
    attempts += 1;
  }
  return marked;
}