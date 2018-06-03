var blacklisted = {
    also: true,
    always: true,
    anyone: true,
    be: true, // we basically never want this as our sentence's main verb
    been: true, // ditto
    else: true,
    here: true,
    maybe: true,
    more: true,
    much: true,
    never: true, // TODO use this for something (similar to 'not')
    over: true,
    really: true,
    same: true,
    so: true,
    then: true,
    there: true,
    very: true,
    which: true
};
module.exports = blacklisted;