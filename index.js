const pos = require('pos');
const lexicon = require('pos/lexicon');
const utility = require('./utility');
const patterns = require('./structures/patterns');
const knownWords = require('./structures/knownWords');
const blacklisted = require('./structures/blacklisted');
const genericTagMappings = require('./structures/genericTagMappings');

// word classification

function shouldIgnore(word){
  return blacklisted[word.normal] ||
         isEmptyOrWhitespace(word.normal) ||
         word.text.indexOf('\'') !== -1 ||
         word.text.indexOf('’') !== -1 ||
         word.text.indexOf('—') !== -1;
}
function classify(word){
  word.tag = {};
  if (shouldIgnore(word)){
    // never use explicitly blacklisted words
  }
  else if (knownWords[word.normal]){
    word = Object.assign(word, clone(knownWords[word.normal]));
  }
  else if (contains(['CC','DT','PDT','PP$','PRP'], word.initTag)){
    // If the word's initTag is "fully enumerated", all legal words for that tag should be known.
    // Thus, if we get here, it might be worth logging the word to see if we've missed any legal words.
  }
  else {
    if (word.lexTags && !contains(word.lexTags, word.initTag)){
      word.initTag = word.lexTags[0];
    }
    var info = genericTagMappings[word.initTag];
    if (info){
      word = Object.assign(word, clone(info));
    }
  }
  // specially label infinitive verb forms (so we can use them with modals)
  if (word.tag.Verb && word.count === COUNT_PLURAL){
    word.tag.Infinitive = true;
  }
  return word;
}

function taggedTokenToWord(taggedToken, index){
  var text = taggedToken[0];
  var normal = normalize(text);
  return {
    text: text,
    initTag: taggedToken[1],
    normal: normal,
    lexTags: lexicon[normal],
    index: index
  };
}

function wordify(text){
  var tokens = text.split(/\s+/g).filter(s => s && !isEmptyOrWhitespace(s));
  var tagger = new pos.Tagger();
  var taggedTokens = tagger.tag(tokens);
  var words = taggedTokens.map(taggedTokenToWord);
  words = words.map(classify);
  return words;
}

// pattern matching

function createMatcher(pattern){
  return {
    pattern: [pattern.subject, pattern.verb, pattern.object],
    state: STATE_SUBJ,
    patternIdx: 0,
    requiredCount: COUNT_ANY,
    requiredInitial: INITIAL_ANY,
    words: []
  };
}

function hasRequiredCount(word, requiredCount){
  if (requiredCount === COUNT_ANY || !word.count){
    return true;
  } else if (requiredCount === COUNT_I) {
    // 'I' takes 'am'/'was' for copula, plural forms otherwise
    return word.tag.Copula ? word.compatibleWithI : requiredCount === COUNT_PLURAL;
  } else {
    return requiredCount === word.count;
  }
}

function hasRequiredInitial(word, requiredInitial){
  if (requiredInitial === INITIAL_ANY || !requiredInitial){
    return true;
  } else {
    var initial = word.normal.substring(0,1);
    var actual = contains(['a','e','i','o','u'], initial) ? INITIAL_VOWEL : INITIAL_CONSONANT;
    return requiredInitial === actual;
  }
}

function shouldAccept(matcher, word){
  var targetTag = matcher.pattern[matcher.state][matcher.patternIdx];
  return word.tag[targetTag] &&
         hasRequiredCount(word, matcher.requiredCount) &&
         hasRequiredInitial(word, matcher.requiredInitial) &&
         Math.random() < 0.8;
}

function pushWord(matcher, word){
  if (matcher.state === STATE_DONE) return matcher; // don't push more words onto a finished match

  matcher.words.push(word);
  matcher.patternIdx += 1;
  matcher.requiredInitial = word.initial || INITIAL_ANY;
  if (word.count){
    matcher.requiredCount = word.count;
  }

  // maybe advance state
  if (matcher.patternIdx >= matcher.pattern[matcher.state].length){
    matcher.state += 1;
    matcher.patternIdx = 0;
    if (matcher.state === STATE_OBJ){
      matcher.requiredCount = COUNT_ANY;
    }
  }

  return matcher;
}

// tie it all together

function markSentence(words){
  var finishedMatchers = [];
  var openMatchers = patterns.map(createMatcher);
  for (var i = 0; i < words.length; i++){
    var word = words[i];
    var remaining = openMatchers;
    openMatchers = [];
    for (var j = 0; j < remaining.length; j++){
      var matcher = remaining[j];
      var pile = openMatchers;
      if (shouldAccept(matcher, word)){
        matcher = pushWord(matcher, word);
        if (matcher.state === STATE_DONE){
          pile = finishedMatchers;
        }
      }
      pile.push(matcher);
    }
    if (openMatchers.length === 0) break; // all matchers finished successfully!
  }
  var matches = finishedMatchers.map(m => m.words);
  var matchedWords = matches.length > 0 ? randNth(matches) : [];
  for (i = 0; i < matchedWords.length; i++){
    matchedWords[i].marked = true;
  }
  return words;
}

function logWord(word){
  var columns = [word.text,
                 word.initTag,
                 Object.keys(word.tag).join(','),
                 (word.lexTags || []).join(','),
                 word.count];
  console.log(columns.join(' | '));
}

function writePoemifiedText(node, words){
  var innerHTML = '';
  var prevWasBlackedOut = false;
  var blackoutColor = getComputedStyle(node).getPropertyValue('color');
  var blackoutPrefix = ' <span style="background:' + blackoutColor + '">';
  for (var j = 0; j < words.length; j++){
    var word = words[j];
    if (word.marked){
      if (prevWasBlackedOut){
        innerHTML = innerHTML + '</span> ' + word.text;
      } else {
        innerHTML = innerHTML + ' ' + word.text;
      }
      prevWasBlackedOut = false;
    } else {
      if (prevWasBlackedOut){
        innerHTML = innerHTML + ' ' + word.text;
      } else {
        innerHTML = innerHTML + blackoutPrefix + word.text;
      }
      prevWasBlackedOut = true;
    }
  }
  node.innerHTML = innerHTML;
}

function poemify(selector){
  var nodes = document.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++){
    // parse the node's text into a series of words
    var node = nodes[i];
    if (isEmptyOrWhitespace(node.innerText)) continue; // bail out early if there isn't any text
    console.log(node.innerText);
    var words = wordify(node.innerText);

    // mark words to keep (i.e. not black out)
    var attempts = 0;
    while (attempts < 5){
      words = markSentence(words);
      var marked = words.filter(w => w.marked);
      if (marked.length > 0){
        console.log(marked.map(w => w.text).join(' '));
        marked.map(logWord);
        break;
      }
      attempts += 1;
    }

    // write text back into the node with most words blacked out
    writePoemifiedText(node, words);
  }
}