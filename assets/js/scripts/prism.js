/* http://prismjs.com/download.html?themes=prism-coy&languages=markup+css+clike+javascript+scss&plugins=line-highlight+line-numbers+file-highlight+highlight-keywords+previewer-base+previewer-color+previewer-gradient+previewer-easing+previewer-time+previewer-angle+unescaped-markup+normalize-whitespace */
var _self = (typeof window !== 'undefined')
    ? window   // if in browser
    : (
        (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
        ? self // if in worker
        : {}   // if in node js
    );

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
    util: {
        encode: function (tokens) {
            if (tokens instanceof Token) {
                return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
            } else if (_.util.type(tokens) === 'Array') {
                return tokens.map(_.util.encode);
            } else {
                return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
            }
        },

        type: function (o) {
            return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
        },

        objId: function (obj) {
            if (!obj['__id']) {
                Object.defineProperty(obj, '__id', { value: ++uniqueId });
            }
            return obj['__id'];
        },

        // Deep clone a language definition (e.g. to extend it)
        clone: function (o) {
            var type = _.util.type(o);

            switch (type) {
                case 'Object':
                    var clone = {};

                    for (var key in o) {
                        if (o.hasOwnProperty(key)) {
                            clone[key] = _.util.clone(o[key]);
                        }
                    }

                    return clone;

                case 'Array':
                    // Check for existence for IE8
                    return o.map && o.map(function(v) { return _.util.clone(v); });
            }

            return o;
        }
    },

    languages: {
        extend: function (id, redef) {
            var lang = _.util.clone(_.languages[id]);

            for (var key in redef) {
                lang[key] = redef[key];
            }

            return lang;
        },

        /**
         * Insert a token before another token in a language literal
         * As this needs to recreate the object (we cannot actually insert before keys in object literals),
         * we cannot just provide an object, we need anobject and a key.
         * @param inside The key (or language id) of the parent
         * @param before The key to insert before. If not provided, the function appends instead.
         * @param insert Object with the key/value pairs to insert
         * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
         */
        insertBefore: function (inside, before, insert, root) {
            root = root || _.languages;
            var grammar = root[inside];

            if (arguments.length == 2) {
                insert = arguments[1];

                for (var newToken in insert) {
                    if (insert.hasOwnProperty(newToken)) {
                        grammar[newToken] = insert[newToken];
                    }
                }

                return grammar;
            }

            var ret = {};

            for (var token in grammar) {

                if (grammar.hasOwnProperty(token)) {

                    if (token == before) {

                        for (var newToken in insert) {

                            if (insert.hasOwnProperty(newToken)) {
                                ret[newToken] = insert[newToken];
                            }
                        }
                    }

                    ret[token] = grammar[token];
                }
            }

            // Update references in other language definitions
            _.languages.DFS(_.languages, function(key, value) {
                if (value === root[inside] && key != inside) {
                    this[key] = ret;
                }
            });

            return root[inside] = ret;
        },

        // Traverse a language definition with Depth First Search
        DFS: function(o, callback, type, visited) {
            visited = visited || {};
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    callback.call(o, i, o[i], type || i);

                    if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
                        visited[_.util.objId(o[i])] = true;
                        _.languages.DFS(o[i], callback, null, visited);
                    }
                    else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
                        visited[_.util.objId(o[i])] = true;
                        _.languages.DFS(o[i], callback, i, visited);
                    }
                }
            }
        }
    },
    plugins: {},

    highlightAll: function(async, callback) {
        var env = {
            callback: callback,
            selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };

        _.hooks.run("before-highlightall", env);

        var elements = env.elements || document.querySelectorAll(env.selector);

        for (var i=0, element; element = elements[i++];) {
            _.highlightElement(element, async === true, env.callback);
        }
    },

    highlightElement: function(element, async, callback) {
        // Find language
        var language, grammar, parent = element;

        while (parent && !lang.test(parent.className)) {
            parent = parent.parentNode;
        }

        if (parent) {
            language = (parent.className.match(lang) || [,''])[1];
            grammar = _.languages[language];
        }

        // Set language on the element, if not present
        element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

        // Set language on the parent, for styling
        parent = element.parentNode;

        if (/pre/i.test(parent.nodeName)) {
            parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
        }

        var code = element.textContent;

        var env = {
            element: element,
            language: language,
            grammar: grammar,
            code: code
        };

        if (!code || !grammar) {
            _.hooks.run('complete', env);
            return;
        }

        _.hooks.run('before-highlight', env);

        if (async && _self.Worker) {
            var worker = new Worker(_.filename);

            worker.onmessage = function(evt) {
                env.highlightedCode = evt.data;

                _.hooks.run('before-insert', env);

                env.element.innerHTML = env.highlightedCode;

                callback && callback.call(env.element);
                _.hooks.run('after-highlight', env);
                _.hooks.run('complete', env);
            };

            worker.postMessage(JSON.stringify({
                language: env.language,
                code: env.code,
                immediateClose: true
            }));
        }
        else {
            env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

            _.hooks.run('before-insert', env);

            env.element.innerHTML = env.highlightedCode;

            callback && callback.call(element);

            _.hooks.run('after-highlight', env);
            _.hooks.run('complete', env);
        }
    },

    highlight: function (text, grammar, language) {
        var tokens = _.tokenize(text, grammar);
        return Token.stringify(_.util.encode(tokens), language);
    },

    tokenize: function(text, grammar, language) {
        var Token = _.Token;

        var strarr = [text];

        var rest = grammar.rest;

        if (rest) {
            for (var token in rest) {
                grammar[token] = rest[token];
            }

            delete grammar.rest;
        }

        tokenloop: for (var token in grammar) {
            if(!grammar.hasOwnProperty(token) || !grammar[token]) {
                continue;
            }

            var patterns = grammar[token];
            patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

            for (var j = 0; j < patterns.length; ++j) {
                var pattern = patterns[j],
                    inside = pattern.inside,
                    lookbehind = !!pattern.lookbehind,
                    greedy = !!pattern.greedy,
                    lookbehindLength = 0,
                    alias = pattern.alias;

                pattern = pattern.pattern || pattern;

                for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

                    var str = strarr[i];

                    if (strarr.length > text.length) {
                        // Something went terribly wrong, ABORT, ABORT!
                        break tokenloop;
                    }

                    if (str instanceof Token) {
                        continue;
                    }

                    pattern.lastIndex = 0;

                    var match = pattern.exec(str),
                        delNum = 1;

                    // Greedy patterns can override/remove up to two previously matched tokens
                    if (!match && greedy && i != strarr.length - 1) {
                        // Reconstruct the original text using the next two tokens
                        var nextToken = strarr[i + 1].matchedStr || strarr[i + 1],
                            combStr = str + nextToken;

                        if (i < strarr.length - 2) {
                            combStr += strarr[i + 2].matchedStr || strarr[i + 2];
                        }

                        // Try the pattern again on the reconstructed text
                        pattern.lastIndex = 0;
                        match = pattern.exec(combStr);
                        if (!match) {
                            continue;
                        }

                        var from = match.index + (lookbehind ? match[1].length : 0);
                        // To be a valid candidate, the new match has to start inside of str
                        if (from >= str.length) {
                            continue;
                        }
                        var to = match.index + match[0].length,
                            len = str.length + nextToken.length;

                        // Number of tokens to delete and replace with the new match
                        delNum = 3;

                        if (to <= len) {
                            if (strarr[i + 1].greedy) {
                                continue;
                            }
                            delNum = 2;
                            combStr = combStr.slice(0, len);
                        }
                        str = combStr;
                    }

                    if (!match) {
                        continue;
                    }

                    if(lookbehind) {
                        lookbehindLength = match[1].length;
                    }

                    var from = match.index + lookbehindLength,
                        match = match[0].slice(lookbehindLength),
                        to = from + match.length,
                        before = str.slice(0, from),
                        after = str.slice(to);

                    var args = [i, delNum];

                    if (before) {
                        args.push(before);
                    }

                    var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

                    args.push(wrapped);

                    if (after) {
                        args.push(after);
                    }

                    Array.prototype.splice.apply(strarr, args);
                }
            }
        }

        return strarr;
    },

    hooks: {
        all: {},

        add: function (name, callback) {
            var hooks = _.hooks.all;

            hooks[name] = hooks[name] || [];

            hooks[name].push(callback);
        },

        run: function (name, env) {
            var callbacks = _.hooks.all[name];

            if (!callbacks || !callbacks.length) {
                return;
            }

            for (var i=0, callback; callback = callbacks[i++];) {
                callback(env);
            }
        }
    }
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
    this.type = type;
    this.content = content;
    this.alias = alias;
    // Copy of the full string this token was created from
    this.matchedStr = matchedStr || null;
    this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
    if (typeof o == 'string') {
        return o;
    }

    if (_.util.type(o) === 'Array') {
        return o.map(function(element) {
            return Token.stringify(element, language, o);
        }).join('');
    }

    var env = {
        type: o.type,
        content: Token.stringify(o.content, language, parent),
        tag: 'span',
        classes: ['token', o.type],
        attributes: {},
        language: language,
        parent: parent
    };

    if (env.type == 'comment') {
        env.attributes['spellcheck'] = 'true';
    }

    if (o.alias) {
        var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
        Array.prototype.push.apply(env.classes, aliases);
    }

    _.hooks.run('wrap', env);

    var attributes = '';

    for (var name in env.attributes) {
        attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
    }

    return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
    if (!_self.addEventListener) {
        // in Node.js
        return _self.Prism;
    }
    // In worker
    _self.addEventListener('message', function(evt) {
        var message = JSON.parse(evt.data),
            lang = message.language,
            code = message.code,
            immediateClose = message.immediateClose;

        _self.postMessage(_.highlight(code, _.languages[lang], lang));
        if (immediateClose) {
            _self.close();
        }
    }, false);

    return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
    _.filename = script.src;

    if (document.addEventListener && !script.hasAttribute('data-manual')) {
        document.addEventListener('DOMContentLoaded', _.highlightAll);
    }
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
    global.Prism = Prism;
}
;
Prism.languages.markup = {
    'comment': /<!--[\w\W]*?-->/,
    'prolog': /<\?[\w\W]+?\?>/,
    'doctype': /<!DOCTYPE[\w\W]+?>/,
    'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
    'tag': {
        pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
        inside: {
            'tag': {
                pattern: /^<\/?[^\s>\/]+/i,
                inside: {
                    'punctuation': /^<\/?/,
                    'namespace': /^[^\s>\/:]+:/
                }
            },
            'attr-value': {
                pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
                inside: {
                    'punctuation': /[=>"']/
                }
            },
            'punctuation': /\/?>/,
            'attr-name': {
                pattern: /[^\s>\/]+/,
                inside: {
                    'namespace': /^[^\s>\/:]+:/
                }
            }

        }
    },
    'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

    if (env.type === 'entity') {
        env.attributes['title'] = env.content.replace(/&amp;/, '&');
    }
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

Prism.languages.css = {
    'comment': /\/\*[\w\W]*?\*\//,
    'atrule': {
        pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
        inside: {
            'rule': /@[\w-]+/
            // See rest below
        }
    },
    'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
    'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
    'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
    'property': /(\b|\B)[\w-]+(?=\s*:)/i,
    'important': /\B!important\b/i,
    'function': /[-a-z0-9]+(?=\()/i,
    'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
    Prism.languages.insertBefore('markup', 'tag', {
        'style': {
            pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
            lookbehind: true,
            inside: Prism.languages.css,
            alias: 'language-css'
        }
    });

    Prism.languages.insertBefore('inside', 'attr-value', {
        'style-attr': {
            pattern: /\s*style=("|').*?\1/i,
            inside: {
                'attr-name': {
                    pattern: /^\s*style/i,
                    inside: Prism.languages.markup.tag.inside
                },
                'punctuation': /^\s*=\s*['"]|['"]\s*$/,
                'attr-value': {
                    pattern: /.+/i,
                    inside: Prism.languages.css
                }
            },
            alias: 'language-css'
        }
    }, Prism.languages.markup.tag);
};
Prism.languages.clike = {
    'comment': [
        {
            pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
            lookbehind: true
        },
        {
            pattern: /(^|[^\\:])\/\/.*/,
            lookbehind: true
        }
    ],
    'string': {
        pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: true
    },
    'class-name': {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
        lookbehind: true,
        inside: {
            punctuation: /(\.|\\)/
        }
    },
    'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    'boolean': /\b(true|false)\b/,
    'function': /[a-z0-9_]+(?=\()/i,
    'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
    'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    'punctuation': /[{}[\];(),.:]/
};

Prism.languages.javascript = Prism.languages.extend('clike', {
    'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
    // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
});

Prism.languages.insertBefore('javascript', 'keyword', {
    'regex': {
        pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: true,
        greedy: true
    }
});

Prism.languages.insertBefore('javascript', 'class-name', {
    'template-string': {
        pattern: /`(?:\\\\|\\?[^\\])*?`/,
        greedy: true,
        inside: {
            'interpolation': {
                pattern: /\$\{[^}]+\}/,
                inside: {
                    'interpolation-punctuation': {
                        pattern: /^\$\{|\}$/,
                        alias: 'punctuation'
                    },
                    rest: Prism.languages.javascript
                }
            },
            'string': /[\s\S]+/
        }
    }
});

if (Prism.languages.markup) {
    Prism.languages.insertBefore('markup', 'tag', {
        'script': {
            pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
            lookbehind: true,
            inside: Prism.languages.javascript,
            alias: 'language-javascript'
        }
    });
}

Prism.languages.js = Prism.languages.javascript;
Prism.languages.scss = Prism.languages.extend('css', {
    'comment': {
        pattern: /(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,
        lookbehind: true
    },
    'atrule': {
        pattern: /@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,
        inside: {
            'rule': /@[\w-]+/
            // See rest below
        }
    },
    // url, compassified
    'url': /(?:[-a-z]+-)*url(?=\()/i,
    // CSS selector regex is not appropriate for Sass
    // since there can be lot more things (var, @ directive, nesting..)
    // a selector must start at the end of a property or after a brace (end of other rules or nesting)
    // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
    // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
    // can "pass" as a selector- e.g: proper#{$erty})
    // this one was hard to do, so please be careful if you edit this one :)
    'selector': {
        // Initial look-ahead is used to prevent matching of blank selectors
        pattern: /(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,
        inside: {
            'placeholder': /%[-_\w]+/
        }
    }
});

Prism.languages.insertBefore('scss', 'atrule', {
    'keyword': [
        /@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,
        {
            pattern: /( +)(?:from|through)(?= )/,
            lookbehind: true
        }
    ]
});

Prism.languages.insertBefore('scss', 'property', {
    // var and interpolated vars
    'variable': /\$[-_\w]+|#\{\$[-_\w]+\}/
});

Prism.languages.insertBefore('scss', 'function', {
    'placeholder': {
        pattern: /%[-_\w]+/,
        alias: 'selector'
    },
    'statement': /\B!(?:default|optional)\b/i,
    'boolean': /\b(?:true|false)\b/,
    'null': /\bnull\b/,
    'operator': {
        pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,
        lookbehind: true
    }
});

Prism.languages.scss['atrule'].inside.rest = Prism.util.clone(Prism.languages.scss);
(function(){

if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
    return;
}

function $$(expr, con) {
    return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

function hasClass(element, className) {
  className = " " + className + " ";
  return (" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(className) > -1
}

// Some browsers round the line-height, others don't.
// We need to test for it to position the elements properly.
var isLineHeightRounded = (function() {
    var res;
    return function() {
        if(typeof res === 'undefined') {
            var d = document.createElement('div');
            d.style.fontSize = '13px';
            d.style.lineHeight = '1.5';
            d.style.padding = 0;
            d.style.border = 0;
            d.innerHTML = '&nbsp;<br />&nbsp;';
            document.body.appendChild(d);
            // Browsers that round the line-height should have offsetHeight === 38
            // The others should have 39.
            res = d.offsetHeight === 38;
            document.body.removeChild(d);
        }
        return res;
    }
}());

function highlightLines(pre, lines, classes) {
    var ranges = lines.replace(/\s+/g, '').split(','),
        offset = +pre.getAttribute('data-line-offset') || 0;

    var parseMethod = isLineHeightRounded() ? parseInt : parseFloat;
    var lineHeight = parseMethod(getComputedStyle(pre).lineHeight);

    for (var i=0, range; range = ranges[i++];) {
        range = range.split('-');

        var start = +range[0],
            end = +range[1] || start;

        var line = document.createElement('div');

        line.textContent = Array(end - start + 2).join(' \n');
        line.className = (classes || '') + ' line-highlight';

    //if the line-numbers plugin is enabled, then there is no reason for this plugin to display the line numbers
    if(!hasClass(pre, 'line-numbers')) {
      line.setAttribute('data-start', start);

      if(end > start) {
        line.setAttribute('data-end', end);
      }
    }

        line.style.top = (start - offset - 1) * lineHeight + 'px';

    //allow this to play nicely with the line-numbers plugin
    if(hasClass(pre, 'line-numbers')) {
      //need to attack to pre as when line-numbers is enabled, the code tag is relatively which screws up the positioning
      pre.appendChild(line);
    } else {
      (pre.querySelector('code') || pre).appendChild(line);
    }
    }
}

function applyHash() {
    var hash = location.hash.slice(1);

    // Remove pre-existing temporary lines
    $$('.temporary.line-highlight').forEach(function (line) {
        line.parentNode.removeChild(line);
    });

    var range = (hash.match(/\.([\d,-]+)$/) || [,''])[1];

    if (!range || document.getElementById(hash)) {
        return;
    }

    var id = hash.slice(0, hash.lastIndexOf('.')),
        pre = document.getElementById(id);

    if (!pre) {
        return;
    }

    if (!pre.hasAttribute('data-line')) {
        pre.setAttribute('data-line', '');
    }

    highlightLines(pre, range, 'temporary ');

    document.querySelector('.temporary.line-highlight').scrollIntoView();
}

var fakeTimer = 0; // Hack to limit the number of times applyHash() runs

Prism.hooks.add('complete', function(env) {
    var pre = env.element.parentNode;
    var lines = pre && pre.getAttribute('data-line');

    if (!pre || !lines || !/pre/i.test(pre.nodeName)) {
        return;
    }

    clearTimeout(fakeTimer);

    $$('.line-highlight', pre).forEach(function (line) {
        line.parentNode.removeChild(line);
    });

    highlightLines(pre, lines);

    fakeTimer = setTimeout(applyHash, 1);
});

if(window.addEventListener) {
    window.addEventListener('hashchange', applyHash);
}

})();

(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
}

Prism.hooks.add('complete', function (env) {
    if (!env.code) {
        return;
    }

    // works only for <code> wrapped inside <pre> (not inline)
    var pre = env.element.parentNode;
    var clsReg = /\s*\bline-numbers\b\s*/;
    if (
        !pre || !/pre/i.test(pre.nodeName) ||
            // Abort only if nor the <pre> nor the <code> have the class
        (!clsReg.test(pre.className) && !clsReg.test(env.element.className))
    ) {
        return;
    }

    if (env.element.querySelector(".line-numbers-rows")) {
        // Abort if line numbers already exists
        return;
    }

    if (clsReg.test(env.element.className)) {
        // Remove the class "line-numbers" from the <code>
        env.element.className = env.element.className.replace(clsReg, '');
    }
    if (!clsReg.test(pre.className)) {
        // Add the class "line-numbers" to the <pre>
        pre.className += ' line-numbers';
    }

    var match = env.code.match(/\n(?!$)/g);
    var linesNum = match ? match.length + 1 : 1;
    var lineNumbersWrapper;

    var lines = new Array(linesNum + 1);
    lines = lines.join('<span></span>');

    lineNumbersWrapper = document.createElement('span');
    lineNumbersWrapper.className = 'line-numbers-rows';
    lineNumbersWrapper.innerHTML = lines;

    if (pre.hasAttribute('data-start')) {
        pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
    }

    env.element.appendChild(lineNumbersWrapper);

});

}());
(function () {
    if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
        return;
    }

    self.Prism.fileHighlight = function() {

        var Extensions = {
            'js': 'javascript',
            'py': 'python',
            'rb': 'ruby',
            'ps1': 'powershell',
            'psm1': 'powershell',
            'sh': 'bash',
            'bat': 'batch',
            'h': 'c',
            'tex': 'latex'
        };

        if(Array.prototype.forEach) { // Check to prevent error in IE8
            Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
                var src = pre.getAttribute('data-src');

                var language, parent = pre;
                var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
                while (parent && !lang.test(parent.className)) {
                    parent = parent.parentNode;
                }

                if (parent) {
                    language = (pre.className.match(lang) || [, ''])[1];
                }

                if (!language) {
                    var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
                    language = Extensions[extension] || extension;
                }

                var code = document.createElement('code');
                code.className = 'language-' + language;

                pre.textContent = '';

                code.textContent = 'Loading…';

                pre.appendChild(code);

                var xhr = new XMLHttpRequest();

                xhr.open('GET', src, true);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {

                        if (xhr.status < 400 && xhr.responseText) {
                            code.textContent = xhr.responseText;

                            Prism.highlightElement(code);
                        }
                        else if (xhr.status >= 400) {
                            code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
                        }
                        else {
                            code.textContent = '✖ Error: File does not exist or is empty';
                        }
                    }
                };

                xhr.send(null);
            });
        }

    };

    document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

(function(){

if (
    typeof self !== 'undefined' && !self.Prism ||
    typeof global !== 'undefined' && !global.Prism
) {
    return;
}

Prism.hooks.add('wrap', function(env) {
    if (env.type !== "keyword") {
        return;
    }
    env.classes.push('keyword-' + env.content);
});

})();

(function() {

    if (typeof self === 'undefined' || !self.Prism || !self.document || !Function.prototype.bind) {
        return;
    }

    /**
     * Returns the absolute X, Y offsets for an element
     * @param {HTMLElement} element
     * @returns {{top: number, right: number, bottom: number, left: number}}
     */
    var getOffset = function (element) {
        var left = 0, top = 0, el = element;

        if (el.parentNode) {
            do {
                left += el.offsetLeft;
                top += el.offsetTop;
            } while ((el = el.offsetParent) && el.nodeType < 9);

            el = element;

            do {
                left -= el.scrollLeft;
                top -= el.scrollTop;
            } while ((el = el.parentNode) && !/body/i.test(el.nodeName));
        }

        return {
            top: top,
            right: innerWidth - left - element.offsetWidth,
            bottom: innerHeight - top - element.offsetHeight,
            left: left
        };
    };

    var tokenRegexp = /(?:^|\s)token(?=$|\s)/;
    var activeRegexp = /(?:^|\s)active(?=$|\s)/g;
    var flippedRegexp = /(?:^|\s)flipped(?=$|\s)/g;

    /**
     * Previewer constructor
     * @param {string} type Unique previewer type
     * @param {function} updater Function that will be called on mouseover.
     * @param {string[]|string=} supportedLanguages Aliases of the languages this previewer must be enabled for. Defaults to "*", all languages.
     * @constructor
     */
    var Previewer = function (type, updater, supportedLanguages, initializer) {
        this._elt = null;
        this._type = type;
        this._clsRegexp = RegExp('(?:^|\\s)' + type + '(?=$|\\s)');
        this._token = null;
        this.updater = updater;
        this._mouseout = this.mouseout.bind(this);
        this.initializer = initializer;

        var self = this;

        if (!supportedLanguages) {
            supportedLanguages = ['*'];
        }
        if (Prism.util.type(supportedLanguages) !== 'Array') {
            supportedLanguages = [supportedLanguages];
        }
        supportedLanguages.forEach(function (lang) {
            if (typeof lang !== 'string') {
                lang = lang.lang;
            }
            if (!Previewer.byLanguages[lang]) {
                Previewer.byLanguages[lang] = [];
            }
            if (Previewer.byLanguages[lang].indexOf(self) < 0) {
                Previewer.byLanguages[lang].push(self);
            }
        });
        Previewer.byType[type] = this;
    };

    /**
     * Creates the HTML element for the previewer.
     */
    Previewer.prototype.init = function () {
        if (this._elt) {
            return;
        }
        this._elt = document.createElement('div');
        this._elt.className = 'prism-previewer prism-previewer-' + this._type;
        document.body.appendChild(this._elt);
        if(this.initializer) {
            this.initializer();
        }
    };

    /**
     * Checks the class name of each hovered element
     * @param token
     */
    Previewer.prototype.check = function (token) {
        do {
            if (tokenRegexp.test(token.className) && this._clsRegexp.test(token.className)) {
                break;
            }
        } while(token = token.parentNode);

        if (token && token !== this._token) {
            this._token = token;
            this.show();
        }
    };

    /**
     * Called on mouseout
     */
    Previewer.prototype.mouseout = function() {
        this._token.removeEventListener('mouseout', this._mouseout, false);
        this._token = null;
        this.hide();
    };

    /**
     * Shows the previewer positioned properly for the current token.
     */
    Previewer.prototype.show = function () {
        if (!this._elt) {
            this.init();
        }
        if (!this._token) {
            return;
        }

        if (this.updater.call(this._elt, this._token.textContent)) {
            this._token.addEventListener('mouseout', this._mouseout, false);

            var offset = getOffset(this._token);
            this._elt.className += ' active';

            if (offset.top - this._elt.offsetHeight > 0) {
                this._elt.className = this._elt.className.replace(flippedRegexp, '');
                this._elt.style.top = offset.top + 'px';
                this._elt.style.bottom = '';
            } else {
                this._elt.className +=  ' flipped';
                this._elt.style.bottom = offset.bottom + 'px';
                this._elt.style.top = '';
            }

            this._elt.style.left = offset.left + Math.min(200, this._token.offsetWidth / 2) + 'px';
        } else {
            this.hide();
        }
    };

    /**
     * Hides the previewer.
     */
    Previewer.prototype.hide = function () {
        this._elt.className = this._elt.className.replace(activeRegexp, '');
    };

    /**
     * Map of all registered previewers by language
     * @type {{}}
     */
    Previewer.byLanguages = {};

    /**
     * Map of all registered previewers by type
     * @type {{}}
     */
    Previewer.byType = {};

    /**
     * Initializes the mouseover event on the code block.
     * @param {HTMLElement} elt The code block (env.element)
     * @param {string} lang The language (env.language)
     */
    Previewer.initEvents = function (elt, lang) {
        var previewers = [];
        if (Previewer.byLanguages[lang]) {
            previewers = previewers.concat(Previewer.byLanguages[lang]);
        }
        if (Previewer.byLanguages['*']) {
            previewers = previewers.concat(Previewer.byLanguages['*']);
        }
        elt.addEventListener('mouseover', function (e) {
            var target = e.target;
            previewers.forEach(function (previewer) {
                previewer.check(target);
            });
        }, false);
    };
    Prism.plugins.Previewer = Previewer;

    // Initialize the previewers only when needed
    Prism.hooks.add('after-highlight', function (env) {
        if(Previewer.byLanguages['*'] || Previewer.byLanguages[env.language]) {
            Previewer.initEvents(env.element, env.language);
        }
    });

}());
(function() {

    if (
        typeof self !== 'undefined' && !self.Prism ||
        typeof global !== 'undefined' && !global.Prism
    ) {
        return;
    }

    var languages = {
        'css': true,
        'less': true,
        'markup': {
            lang: 'markup',
            before: 'punctuation',
            inside: 'inside',
            root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value']
        },
        'sass': [
            {
                lang: 'sass',
                before: 'punctuation',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['variable-line']
            },
            {
                lang: 'sass',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['property-line']
            }
        ],
        'scss': true,
        'stylus': [
            {
                lang: 'stylus',
                before: 'hexcode',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
            },
            {
                lang: 'stylus',
                before: 'hexcode',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
            }
        ]
    };

    Prism.hooks.add('before-highlight', function (env) {
        if (env.language && languages[env.language] && !languages[env.language].initialized) {
            var lang = languages[env.language];
            if (Prism.util.type(lang) !== 'Array') {
                lang = [lang];
            }
            lang.forEach(function(lang) {
                var before, inside, root, skip;
                if (lang === true) {
                    before = 'important';
                    inside = env.language;
                    lang = env.language;
                } else {
                    before = lang.before || 'important';
                    inside = lang.inside || lang.lang;
                    root = lang.root || Prism.languages;
                    skip = lang.skip;
                    lang = env.language;
                }

                if (!skip && Prism.languages[lang]) {
                    Prism.languages.insertBefore(inside, before, {
                        'color': /\B#(?:[0-9a-f]{3}){1,2}\b|\b(?:rgb|hsl)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:rgb|hsl)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B|\b(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGray|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGray|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGray|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gray|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGray|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGray|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGray|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)\b/i
                    }, root);
                    env.grammar = Prism.languages[lang];

                    languages[env.language] = {initialized: true};
                }
            });
        }
    });

    if (Prism.plugins.Previewer) {
        new Prism.plugins.Previewer('color', function(value) {
            this.style.backgroundColor = '';
            this.style.backgroundColor = value;
            return !!this.style.backgroundColor;
        });
    }

}());
(function() {

    if (
        typeof self !== 'undefined' && !self.Prism ||
        typeof global !== 'undefined' && !global.Prism
    ) {
        return;
    }

    var languages = {
        'css': true,
        'less': true,
        'sass': [
            {
                lang: 'sass',
                before: 'punctuation',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['variable-line']
            },
            {
                lang: 'sass',
                before: 'punctuation',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['property-line']
            }
        ],
        'scss': true,
        'stylus': [
            {
                lang: 'stylus',
                before: 'func',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
            },
            {
                lang: 'stylus',
                before: 'func',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
            }
        ]
    };

    Prism.hooks.add('before-highlight', function (env) {
        if (env.language && languages[env.language] && !languages[env.language].initialized) {
            var lang = languages[env.language];
            if (Prism.util.type(lang) !== 'Array') {
                lang = [lang];
            }
            lang.forEach(function(lang) {
                var before, inside, root, skip;
                if (lang === true) {
                    // Insert before color previewer if it exists
                    before = Prism.plugins.Previewer && Prism.plugins.Previewer.byType['color'] ? 'color' : 'important';
                    inside = env.language;
                    lang = env.language;
                } else {
                    before = lang.before || 'important';
                    inside = lang.inside || lang.lang;
                    root = lang.root || Prism.languages;
                    skip = lang.skip;
                    lang = env.language;
                }

                if (!skip && Prism.languages[lang]) {
                    Prism.languages.insertBefore(inside, before, {
                        'gradient': {
                            pattern: /(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\((?:(?:rgb|hsl)a?\(.+?\)|[^\)])+\)/gi,
                            inside: {
                                'function': /[\w-]+(?=\()/,
                                'punctuation': /[(),]/
                            }
                        }
                    }, root);
                    env.grammar = Prism.languages[lang];

                    languages[env.language] = {initialized: true};
                }
            });
        }
    });

    // Stores already processed gradients so that we don't
    // make the conversion every time the previewer is shown
    var cache = {};

    /**
     * Returns a W3C-valid linear gradient
     * @param {string} prefix Vendor prefix if any ("-moz-", "-webkit-", etc.)
     * @param {string} func Gradient function name ("linear-gradient")
     * @param {string[]} values Array of the gradient function parameters (["0deg", "red 0%", "blue 100%"])
     */
    var convertToW3CLinearGradient = function(prefix, func, values) {
        // Default value for angle
        var angle = '180deg';

        if (/^(?:-?\d*\.?\d+(?:deg|rad)|to\b|top|right|bottom|left)/.test(values[0])) {
            angle = values.shift();
            if (angle.indexOf('to ') < 0) {
                // Angle uses old keywords
                // W3C syntax uses "to" + opposite keywords
                if (angle.indexOf('top') >= 0) {
                    if (angle.indexOf('left') >= 0) {
                        angle = 'to bottom right';
                    } else if (angle.indexOf('right') >= 0) {
                        angle = 'to bottom left';
                    } else {
                        angle = 'to bottom';
                    }
                } else if (angle.indexOf('bottom') >= 0) {
                    if (angle.indexOf('left') >= 0) {
                        angle = 'to top right';
                    } else if (angle.indexOf('right') >= 0) {
                        angle = 'to top left';
                    } else {
                        angle = 'to top';
                    }
                } else if (angle.indexOf('left') >= 0) {
                    angle = 'to right';
                } else if (angle.indexOf('right') >= 0) {
                    angle = 'to left';
                } else if (prefix) {
                    // Angle is shifted by 90deg in prefixed gradients
                    if (angle.indexOf('deg') >= 0) {
                        angle = (90 - parseFloat(angle)) + 'deg';
                    } else if (angle.indexOf('rad') >= 0) {
                        angle = (Math.PI / 2 - parseFloat(angle)) + 'rad';
                    }
                }
            }
        }

        return func + '(' + angle + ',' + values.join(',') + ')';
    };

    /**
     * Returns a W3C-valid radial gradient
     * @param {string} prefix Vendor prefix if any ("-moz-", "-webkit-", etc.)
     * @param {string} func Gradient function name ("linear-gradient")
     * @param {string[]} values Array of the gradient function parameters (["0deg", "red 0%", "blue 100%"])
     */
    var convertToW3CRadialGradient = function(prefix, func, values) {
        if (values[0].indexOf('at') < 0) {
            // Looks like old syntax

            // Default values
            var position = 'center';
            var shape = 'ellipse';
            var size = 'farthest-corner';

            if (/\bcenter|top|right|bottom|left\b|^\d+/.test(values[0])) {
                // Found a position
                // Remove angle value, if any
                position = values.shift().replace(/\s*-?\d+(?:rad|deg)\s*/, '');
            }
            if (/\bcircle|ellipse|closest|farthest|contain|cover\b/.test(values[0])) {
                // Found a shape and/or size
                var shapeSizeParts = values.shift().split(/\s+/);
                if (shapeSizeParts[0] && (shapeSizeParts[0] === 'circle' || shapeSizeParts[0] === 'ellipse')) {
                    shape = shapeSizeParts.shift();
                }
                if (shapeSizeParts[0]) {
                    size = shapeSizeParts.shift();
                }

                // Old keywords are converted to their synonyms
                if (size === 'cover') {
                    size = 'farthest-corner';
                } else if (size === 'contain') {
                    size = 'clothest-side';
                }
            }

            return func + '(' + shape + ' ' + size + ' at ' + position + ',' + values.join(',') + ')';
        }
        return func + '(' + values.join(',') + ')';
    };

    /**
     * Converts a gradient to a W3C-valid one
     * Does not support old webkit syntax (-webkit-gradient(linear...) and -webkit-gradient(radial...))
     * @param {string} gradient The CSS gradient
     */
    var convertToW3CGradient = function(gradient) {
        if (cache[gradient]) {
            return cache[gradient];
        }
        var parts = gradient.match(/^(\b|\B-[a-z]{1,10}-)((?:repeating-)?(?:linear|radial)-gradient)/);
        // "", "-moz-", etc.
        var prefix = parts && parts[1];
        // "linear-gradient", "radial-gradient", etc.
        var func = parts && parts[2];

        var values = gradient.replace(/^(?:\b|\B-[a-z]{1,10}-)(?:repeating-)?(?:linear|radial)-gradient\(|\)$/g, '').split(/\s*,\s*/);

        if (func.indexOf('linear') >= 0) {
            return cache[gradient] = convertToW3CLinearGradient(prefix, func, values);
        } else if (func.indexOf('radial') >= 0) {
            return cache[gradient] = convertToW3CRadialGradient(prefix, func, values);
        }
        return cache[gradient] = func + '(' + values.join(',') + ')';
    };



    if (Prism.plugins.Previewer) {
        new Prism.plugins.Previewer('gradient', function(value) {
            this.firstChild.style.backgroundImage = '';
            this.firstChild.style.backgroundImage = convertToW3CGradient(value);
            return !!this.firstChild.style.backgroundImage;
        }, '*', function () {
            this._elt.innerHTML = '<div></div>';
        });
    }

}());
(function() {

    if (
        typeof self !== 'undefined' && !self.Prism ||
        typeof global !== 'undefined' && !global.Prism
    ) {
        return;
    }

    var languages = {
        'css': true,
        'less': true,
        'sass': [
            {
                lang: 'sass',
                inside: 'inside',
                before: 'punctuation',
                root: Prism.languages.sass && Prism.languages.sass['variable-line']
            },
            {
                lang: 'sass',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['property-line']
            }
        ],
        'scss': true,
        'stylus': [
            {
                lang: 'stylus',
                before: 'hexcode',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
            },
            {
                lang: 'stylus',
                before: 'hexcode',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
            }
        ]
    };

    Prism.hooks.add('before-highlight', function (env) {
        if (env.language && languages[env.language] && !languages[env.language].initialized) {
            var lang = languages[env.language];
            if (Prism.util.type(lang) !== 'Array') {
                lang = [lang];
            }
            lang.forEach(function(lang) {
                var before, inside, root, skip;
                if (lang === true) {
                    before = 'important';
                    inside = env.language;
                    lang = env.language;
                } else {
                    before = lang.before || 'important';
                    inside = lang.inside || lang.lang;
                    root = lang.root || Prism.languages;
                    skip = lang.skip;
                    lang = env.language;
                }

                if (!skip && Prism.languages[lang]) {
                    Prism.languages.insertBefore(inside, before, {
                        'easing': /\bcubic-bezier\((?:-?\d*\.?\d+,\s*){3}-?\d*\.?\d+\)\B|\b(?:linear|ease(?:-in)?(?:-out)?)(?=\s|[;}]|$)/i
                    }, root);
                    env.grammar = Prism.languages[lang];

                    languages[env.language] = {initialized: true};
                }
            });
        }
    });

    if (Prism.plugins.Previewer) {
        new Prism.plugins.Previewer('easing', function (value) {

            value = {
                'linear': '0,0,1,1',
                'ease': '.25,.1,.25,1',
                'ease-in': '.42,0,1,1',
                'ease-out': '0,0,.58,1',
                'ease-in-out':'.42,0,.58,1'
            }[value] || value;

            var p = value.match(/-?\d*\.?\d+/g);

            if(p.length === 4) {
                p = p.map(function(p, i) { return (i % 2? 1 - p : p) * 100; });

                this.querySelector('path').setAttribute('d', 'M0,100 C' + p[0] + ',' + p[1] + ', ' + p[2] + ',' + p[3] + ', 100,0');

                var lines = this.querySelectorAll('line');
                lines[0].setAttribute('x2', p[0]);
                lines[0].setAttribute('y2', p[1]);
                lines[1].setAttribute('x2', p[2]);
                lines[1].setAttribute('y2', p[3]);

                return true;
            }

            return false;
        }, '*', function () {
            this._elt.innerHTML = '<svg viewBox="-20 -20 140 140" width="100" height="100">' +
                '<defs>' +
                    '<marker id="prism-previewer-easing-marker" viewBox="0 0 4 4" refX="2" refY="2" markerUnits="strokeWidth">' +
                        '<circle cx="2" cy="2" r="1.5" />' +
                    '</marker>' +
                '</defs>' +
                '<path d="M0,100 C20,50, 40,30, 100,0" />' +
                '<line x1="0" y1="100" x2="20" y2="50" marker-start="url(' + location.href + '#prism-previewer-easing-marker)" marker-end="url(' + location.href + '#prism-previewer-easing-marker)" />' +
                '<line x1="100" y1="0" x2="40" y2="30" marker-start="url(' + location.href + '#prism-previewer-easing-marker)" marker-end="url(' + location.href + '#prism-previewer-easing-marker)" />' +
            '</svg>';
        });
    }

}());
(function() {

    if (
        typeof self !== 'undefined' && !self.Prism ||
        typeof global !== 'undefined' && !global.Prism
    ) {
        return;
    }

    var languages = {
        'css': true,
        'less': true,
        'markup': {
            lang: 'markup',
            before: 'punctuation',
            inside: 'inside',
            root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value']
        },
        'sass': [
            {
                lang: 'sass',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['property-line']
            },
            {
                lang: 'sass',
                before: 'operator',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['variable-line']
            }
        ],
        'scss': true,
        'stylus': [
            {
                lang: 'stylus',
                before: 'hexcode',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
            },
            {
                lang: 'stylus',
                before: 'hexcode',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
            }
        ]
    };

    Prism.hooks.add('before-highlight', function (env) {
        if (env.language && languages[env.language] && !languages[env.language].initialized) {
            var lang = languages[env.language];
            if (Prism.util.type(lang) !== 'Array') {
                lang = [lang];
            }
            lang.forEach(function(lang) {
                var before, inside, root, skip;
                if (lang === true) {
                    before = 'important';
                    inside = env.language;
                    lang = env.language;
                } else {
                    before = lang.before || 'important';
                    inside = lang.inside || lang.lang;
                    root = lang.root || Prism.languages;
                    skip = lang.skip;
                    lang = env.language;
                }

                if (!skip && Prism.languages[lang]) {
                    Prism.languages.insertBefore(inside, before, {
                        'time': /(?:\b|\B-|(?=\B\.))\d*\.?\d+m?s\b/i
                    }, root);
                    env.grammar = Prism.languages[lang];

                    languages[env.language] = {initialized: true};
                }
            });
        }
    });

    if (Prism.plugins.Previewer) {
        new Prism.plugins.Previewer('time', function(value) {
            var num = parseFloat(value);
            var unit = value.match(/[a-z]+$/i);
            if (!num || !unit) {
                return false;
            }
            unit = unit[0];
            this.querySelector('circle').style.animationDuration = 2 * num + unit;
            return true;
        }, '*', function () {
            this._elt.innerHTML = '<svg viewBox="0 0 64 64">' +
                '<circle r="16" cy="32" cx="32"></circle>' +
            '</svg>';
        });
    }

}());
(function() {

    if (
        typeof self !== 'undefined' && !self.Prism ||
        typeof global !== 'undefined' && !global.Prism
    ) {
        return;
    }

    var languages = {
        'css': true,
        'less': true,
        'markup': {
            lang: 'markup',
            before: 'punctuation',
            inside: 'inside',
            root: Prism.languages.markup && Prism.languages.markup['tag'].inside['attr-value']
        },
        'sass': [
            {
                lang: 'sass',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['property-line']
            },
            {
                lang: 'sass',
                before: 'operator',
                inside: 'inside',
                root: Prism.languages.sass && Prism.languages.sass['variable-line']
            }
        ],
        'scss': true,
        'stylus': [
            {
                lang: 'stylus',
                before: 'func',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['property-declaration'].inside
            },
            {
                lang: 'stylus',
                before: 'func',
                inside: 'rest',
                root: Prism.languages.stylus && Prism.languages.stylus['variable-declaration'].inside
            }
        ]
    };

    Prism.hooks.add('before-highlight', function (env) {
        if (env.language && languages[env.language] && !languages[env.language].initialized) {
            var lang = languages[env.language];
            if (Prism.util.type(lang) !== 'Array') {
                lang = [lang];
            }
            lang.forEach(function(lang) {
                var before, inside, root, skip;
                if (lang === true) {
                    before = 'important';
                    inside = env.language;
                    lang = env.language;
                } else {
                    before = lang.before || 'important';
                    inside = lang.inside || lang.lang;
                    root = lang.root || Prism.languages;
                    skip = lang.skip;
                    lang = env.language;
                }

                if (!skip && Prism.languages[lang]) {
                    Prism.languages.insertBefore(inside, before, {
                        'angle': /(?:\b|\B-|(?=\B\.))\d*\.?\d+(?:deg|g?rad|turn)\b/i
                    }, root);
                    env.grammar = Prism.languages[lang];

                    languages[env.language] = {initialized: true};
                }
            });
        }
    });

    if (Prism.plugins.Previewer) {
        new Prism.plugins.Previewer('angle', function(value) {
            var num = parseFloat(value);
            var unit = value.match(/[a-z]+$/i);
            var max, percentage;
            if (!num || !unit) {
                return false;
            }
            unit = unit[0];

            switch(unit) {
                case 'deg':
                    max = 360;
                    break;
                case 'grad':
                    max = 400;
                    break;
                case 'rad':
                    max = 2 * Math.PI;
                    break;
                case 'turn':
                    max = 1;
            }

            percentage = 100 * num/max;
            percentage %= 100;

            this[(num < 0? 'set' : 'remove') + 'Attribute']('data-negative', '');
            this.querySelector('circle').style.strokeDasharray = Math.abs(percentage) + ',500';
            return true;
        }, '*', function () {
            this._elt.innerHTML = '<svg viewBox="0 0 64 64">' +
                '<circle r="16" cy="32" cx="32"></circle>' +
            '</svg>';
        });
    }

}());
(function () {

    if (typeof self === 'undefined' || !self.Prism || !self.document || !Prism.languages.markup) {
        return;
    }

    Prism.plugins.UnescapedMarkup = true;

    Prism.hooks.add('before-highlightall', function (env) {
        env.selector += ", .lang-markup script[type='text/plain'], .language-markup script[type='text/plain']" +
                        ", script[type='text/plain'].lang-markup, script[type='text/plain'].language-markup";
    });

    Prism.hooks.add('before-highlight', function (env) {
        if (env.language != "markup") {
            return;
        }

        if (env.element.matches("script[type='text/plain']")) {
            var code = document.createElement("code");
            var pre = document.createElement("pre");

            pre.className = code.className = env.element.className;

            env.code = env.code.replace(/&lt;\/script(>|&gt;)/gi, "</scri" + "pt>");
            code.textContent = env.code;

            pre.appendChild(code);
            env.element.parentNode.replaceChild(pre, env.element);
            env.element = code;
            return;
        }
    });
}());

(function() {

if (typeof self === 'undefined' || !self.Prism || !self.document) {
    return;
}

var assign = Object.assign || function (obj1, obj2) {
    for (var name in obj2) {
        if (obj2.hasOwnProperty(name))
            obj1[name] = obj2[name];
    }
    return obj1;
}

function NormalizeWhitespace(defaults) {
    this.defaults = assign({}, defaults);
}

function toCamelCase(value) {
    return value.replace(/-(\w)/g, function(match, firstChar) {
        return firstChar.toUpperCase();
    });
}

function tabLen(str) {
    var res = 0;
    for (var i = 0; i < str.length; ++i) {
        if (str.charCodeAt(i) == '\t'.charCodeAt(0))
            res += 3;
    }
    return str.length + res;
}

NormalizeWhitespace.prototype = {
    setDefaults: function (defaults) {
        this.defaults = assign(this.defaults, defaults);
    },
    normalize: function (input, settings) {
        settings = assign(this.defaults, settings);

        for (var name in settings) {
            var methodName = toCamelCase(name);
            if (name !== "normalize" && methodName !== 'setDefaults' &&
                    settings[name] && this[methodName]) {
                input = this[methodName].call(this, input, settings[name]);
            }
        }

        return input;
    },

    /*
     * Normalization methods
     */
    leftTrim: function (input) {
        return input.replace(/^\s+/, '');
    },
    rightTrim: function (input) {
        return input.replace(/\s+$/, '');
    },
    tabsToSpaces: function (input, spaces) {
        spaces = spaces|0 || 4;
        return input.replace(/\t/g, new Array(++spaces).join(' '));
    },
    spacesToTabs: function (input, spaces) {
        spaces = spaces|0 || 4;
        return input.replace(new RegExp(' {' + spaces + '}', 'g'), '\t');
    },
    removeTrailing: function (input) {
        return input.replace(/\s*?$/gm, '');
    },
    // Support for deprecated plugin remove-initial-line-feed
    removeInitialLineFeed: function (input) {
        return input.replace(/^(?:\r?\n|\r)/, '');
    },
    removeIndent: function (input) {
        var indents = input.match(/^[^\S\n\r]*(?=\S)/gm);

        if (!indents || !indents[0].length)
            return input;

        indents.sort(function(a, b){return a.length - b.length; });

        if (!indents[0].length)
            return input;

        return input.replace(new RegExp('^' + indents[0], 'gm'), '');
    },
    indent: function (input, tabs) {
        return input.replace(/^[^\S\n\r]*(?=\S)/gm, new Array(++tabs).join('\t') + '$&');
    },
    breakLines: function (input, characters) {
        characters = (characters === true) ? 80 : characters|0 || 80;

        var lines = input.split('\n');
        for (var i = 0; i < lines.length; ++i) {
            if (tabLen(lines[i]) <= characters)
                continue;

            var line = lines[i].split(/(\s+)/g),
                len = 0;

            for (var j = 0; j < line.length; ++j) {
                var tl = tabLen(line[j]);
                len += tl;
                if (len > characters) {
                    line[j] = '\n' + line[j];
                    len = tl;
                }
            }
            lines[i] = line.join('');
        }
        return lines.join('\n');
    }
};

Prism.plugins.NormalizeWhitespace = new NormalizeWhitespace({
    'remove-trailing': true,
    'remove-indent': true,
    'left-trim': true,
    'right-trim': true,
    /*'break-lines': 80,
    'indent': 2,
    'remove-initial-line-feed': false,
    'tabs-to-spaces': 4,
    'spaces-to-tabs': 4*/
});

Prism.hooks.add('before-highlight', function (env) {
    var pre = env.element.parentNode;
    if (!env.code || !pre || pre.nodeName.toLowerCase() !== 'pre' ||
            (env.settings && env.settings['whitespace-normalization'] === false))
        return;

    var children = pre.childNodes,
        before = '',
        after = '',
        codeFound = false,
        Normalizer = Prism.plugins.NormalizeWhitespace;

    // Move surrounding whitespace from the <pre> tag into the <code> tag
    for (var i = 0; i < children.length; ++i) {
        var node = children[i];

        if (node == env.element) {
            codeFound = true;
        } else if (node.nodeName === "#text") {
            if (codeFound) {
                after += node.nodeValue;
            } else {
                before += node.nodeValue;
            }

            pre.removeChild(node);
            --i;
        }
    }

    if (!env.element.children.length || !Prism.plugins.KeepMarkup) {
        env.code = before + env.code + after;
        env.code = Normalizer.normalize(env.code, env.settings);
    } else {
        // Preserve markup for keep-markup plugin
        var html = before + env.element.innerHTML + after;
        env.element.innerHTML = Normalizer.normalize(html, env.settings);
        env.code = env.element.textContent;
    }
});

}());
