/*! VelocityJS.org (1.2.3). (C) 2014 Julian Shapiro. MIT @license: en.wikipedia.org/wiki/MIT_License */

/*************************
   Velocity jQuery Shim
*************************/

/*! VelocityJS.org jQuery Shim (1.0.1). (C) 2014 The jQuery Foundation. MIT @license: en.wikipedia.org/wiki/MIT_License. */

/* This file contains the jQuery functions that Velocity relies on, thereby removing Velocity's dependency on a full copy of jQuery, and allowing it to work in any environment. */
/* These shimmed functions are only used if jQuery isn't present. If both this shim and jQuery are loaded, Velocity defaults to jQuery proper. */
/* Browser support: Using this shim instead of jQuery proper removes support for IE8. */

;(function (window) {
    /***************
         Setup
    ***************/

    /* If jQuery is already loaded, there's no point in loading this shim. */
    if (window.jQuery) {
        return;
    }

    /* jQuery base. */
    var $ = function (selector, context) {
        return new $.fn.init(selector, context);
    };

    /********************
       Private Methods
    ********************/

    /* jQuery */
    $.isWindow = function (obj) {
        /* jshint eqeqeq: false */
        return obj != null && obj == obj.window;
    };

    /* jQuery */
    $.type = function (obj) {
        if (obj == null) {
            return obj + "";
        }

        return typeof obj === "object" || typeof obj === "function" ?
            class2type[toString.call(obj)] || "object" :
            typeof obj;
    };

    /* jQuery */
    $.isArray = Array.isArray || function (obj) {
        return $.type(obj) === "array";
    };

    /* jQuery */
    function isArraylike (obj) {
        var length = obj.length,
            type = $.type(obj);

        if (type === "function" || $.isWindow(obj)) {
            return false;
        }

        if (obj.nodeType === 1 && length) {
            return true;
        }

        return type === "array" || length === 0 || typeof length === "number" && length > 0 && (length - 1) in obj;
    }

    /***************
       $ Methods
    ***************/

    /* jQuery: Support removed for IE<9. */
    $.isPlainObject = function (obj) {
        var key;

        if (!obj || $.type(obj) !== "object" || obj.nodeType || $.isWindow(obj)) {
            return false;
        }

        try {
            if (obj.constructor &&
                !hasOwn.call(obj, "constructor") &&
                !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        for (key in obj) {}

        return key === undefined || hasOwn.call(obj, key);
    };

    /* jQuery */
    $.each = function(obj, callback, args) {
        var value,
            i = 0,
            length = obj.length,
            isArray = isArraylike(obj);

        if (args) {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.apply(obj[i], args);

                    if (value === false) {
                        break;
                    }
                }
            }

        } else {
            if (isArray) {
                for (; i < length; i++) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            } else {
                for (i in obj) {
                    value = callback.call(obj[i], i, obj[i]);

                    if (value === false) {
                        break;
                    }
                }
            }
        }

        return obj;
    };

    /* Custom */
    $.data = function (node, key, value) {
        /* $.getData() */
        if (value === undefined) {
            var id = node[$.expando],
                store = id && cache[id];

            if (key === undefined) {
                return store;
            } else if (store) {
                if (key in store) {
                    return store[key];
                }
            }
        /* $.setData() */
        } else if (key !== undefined) {
            var id = node[$.expando] || (node[$.expando] = ++$.uuid);

            cache[id] = cache[id] || {};
            cache[id][key] = value;

            return value;
        }
    };

    /* Custom */
    $.removeData = function (node, keys) {
        var id = node[$.expando],
            store = id && cache[id];

        if (store) {
            $.each(keys, function(_, key) {
                delete store[key];
            });
        }
    };

    /* jQuery */
    $.extend = function () {
        var src, copyIsArray, copy, name, options, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === "boolean") {
            deep = target;

            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== "object" && $.type(target) !== "function") {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];

                    if (target === copy) {
                        continue;
                    }

                    if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && $.isArray(src) ? src : [];

                        } else {
                            clone = src && $.isPlainObject(src) ? src : {};
                        }

                        target[name] = $.extend(deep, clone, copy);

                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    };

    /* jQuery 1.4.3 */
    $.queue = function (elem, type, data) {
        function $makeArray (arr, results) {
            var ret = results || [];

            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    /* $.merge */
                    (function(first, second) {
                        var len = +second.length,
                            j = 0,
                            i = first.length;

                        while (j < len) {
                            first[i++] = second[j++];
                        }

                        if (len !== len) {
                            while (second[j] !== undefined) {
                                first[i++] = second[j++];
                            }
                        }

                        first.length = i;

                        return first;
                    })(ret, typeof arr === "string" ? [arr] : arr);
                } else {
                    [].push.call(ret, arr);
                }
            }

            return ret;
        }

        if (!elem) {
            return;
        }

        type = (type || "fx") + "queue";

        var q = $.data(elem, type);

        if (!data) {
            return q || [];
        }

        if (!q || $.isArray(data)) {
            q = $.data(elem, type, $makeArray(data));
        } else {
            q.push(data);
        }

        return q;
    };

    /* jQuery 1.4.3 */
    $.dequeue = function (elems, type) {
        /* Custom: Embed element iteration. */
        $.each(elems.nodeType ? [ elems ] : elems, function(i, elem) {
            type = type || "fx";

            var queue = $.queue(elem, type),
                fn = queue.shift();

            if (fn === "inprogress") {
                fn = queue.shift();
            }

            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }

                fn.call(elem, function() {
                    $.dequeue(elem, type);
                });
            }
        });
    };

    /******************
       $.fn Methods
    ******************/

    /* jQuery */
    $.fn = $.prototype = {
        init: function (selector) {
            /* Just return the element wrapped inside an array; don't proceed with the actual jQuery node wrapping process. */
            if (selector.nodeType) {
                this[0] = selector;

                return this;
            } else {
                throw new Error("Not a DOM node.");
            }
        },

        offset: function () {
            /* jQuery altered code: Dropped disconnected DOM node checking. */
            var box = this[0].getBoundingClientRect ? this[0].getBoundingClientRect() : { top: 0, left: 0 };

            return {
                top: box.top + (window.pageYOffset || document.scrollTop  || 0)  - (document.clientTop  || 0),
                left: box.left + (window.pageXOffset || document.scrollLeft  || 0) - (document.clientLeft || 0)
            };
        },

        position: function () {
            /* jQuery */
            function offsetParent() {
                var offsetParent = this.offsetParent || document;

                while (offsetParent && (!offsetParent.nodeType.toLowerCase === "html" && offsetParent.style.position === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }

                return offsetParent || document;
            }

            /* Zepto */
            var elem = this[0],
                offsetParent = offsetParent.apply(elem),
                offset = this.offset(),
                parentOffset = /^(?:body|html)$/i.test(offsetParent.nodeName) ? { top: 0, left: 0 } : $(offsetParent).offset()

            offset.top -= parseFloat(elem.style.marginTop) || 0;
            offset.left -= parseFloat(elem.style.marginLeft) || 0;

            if (offsetParent.style) {
                parentOffset.top += parseFloat(offsetParent.style.borderTopWidth) || 0
                parentOffset.left += parseFloat(offsetParent.style.borderLeftWidth) || 0
            }

            return {
                top: offset.top - parentOffset.top,
                left: offset.left - parentOffset.left
            };
        }
    };

    /**********************
       Private Variables
    **********************/

    /* For $.data() */
    var cache = {};
    $.expando = "velocity" + (new Date().getTime());
    $.uuid = 0;

    /* For $.queue() */
    var class2type = {},
        hasOwn = class2type.hasOwnProperty,
        toString = class2type.toString;

    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var i = 0; i < types.length; i++) {
        class2type["[object " + types[i] + "]"] = types[i].toLowerCase();
    }

    /* Makes $(node) possible, without having to call init. */
    $.fn.init.prototype = $.fn;

    /* Globalize Velocity onto the window, and assign its Utilities property. */
    window.Velocity = { Utilities: $ };
})(window);

/******************
    Velocity.js
******************/

;(function (factory) {
    /* CommonJS module. */
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = factory();
    /* AMD module. */
    } else if (typeof define === "function" && define.amd) {
        define(factory);
    /* Browser globals. */
    } else {
        factory();
    }
}(function() {
return function (global, window, document, undefined) {

    /***************
        Summary
    ***************/

    /*
    - CSS: CSS stack that works independently from the rest of Velocity.
    - animate(): Core animation method that iterates over the targeted elements and queues the incoming call onto each element individually.
      - Pre-Queueing: Prepare the element for animation by instantiating its data cache and processing the call's options.
      - Queueing: The logic that runs once the call has reached its point of execution in the element's $.queue() stack.
                  Most logic is placed here to avoid risking it becoming stale (if the element's properties have changed).
      - Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
    - tick(): The single requestAnimationFrame loop responsible for tweening all in-progress calls.
    - completeCall(): Handles the cleanup process for each Velocity call.
    */

    /*********************
       Helper Functions
    *********************/

    /* IE detection. Gist: https://gist.github.com/julianshapiro/9098609 */
    var IE = (function() {
        if (document.documentMode) {
            return document.documentMode;
        } else {
            for (var i = 7; i > 4; i--) {
                var div = document.createElement("div");

                div.innerHTML = "<!--[if IE " + i + "]><span></span><![endif]-->";

                if (div.getElementsByTagName("span").length) {
                    div = null;

                    return i;
                }
            }
        }

        return undefined;
    })();

    /* rAF shim. Gist: https://gist.github.com/julianshapiro/9497513 */
    var rAFShim = (function() {
        var timeLast = 0;

        return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
            var timeCurrent = (new Date()).getTime(),
                timeDelta;

            /* Dynamically set delay on a per-tick basis to match 60fps. */
            /* Technique by Erik Moller. MIT license: https://gist.github.com/paulirish/1579671 */
            timeDelta = Math.max(0, 16 - (timeCurrent - timeLast));
            timeLast = timeCurrent + timeDelta;

            return setTimeout(function() { callback(timeCurrent + timeDelta); }, timeDelta);
        };
    })();

    /* Array compacting. Copyright Lo-Dash. MIT License: https://github.com/lodash/lodash/blob/master/LICENSE.txt */
    function compactSparseArray (array) {
        var index = -1,
            length = array ? array.length : 0,
            result = [];

        while (++index < length) {
            var value = array[index];

            if (value) {
                result.push(value);
            }
        }

        return result;
    }

    function sanitizeElements (elements) {
        /* Unwrap jQuery/Zepto objects. */
        if (Type.isWrapped(elements)) {
            elements = [].slice.call(elements);
        /* Wrap a single element in an array so that $.each() can iterate with the element instead of its node's children. */
        } else if (Type.isNode(elements)) {
            elements = [ elements ];
        }

        return elements;
    }

    var Type = {
        isString: function (variable) {
            return (typeof variable === "string");
        },
        isArray: Array.isArray || function (variable) {
            return Object.prototype.toString.call(variable) === "[object Array]";
        },
        isFunction: function (variable) {
            return Object.prototype.toString.call(variable) === "[object Function]";
        },
        isNode: function (variable) {
            return variable && variable.nodeType;
        },
        /* Copyright Martin Bohm. MIT License: https://gist.github.com/Tomalak/818a78a226a0738eaade */
        isNodeList: function (variable) {
            return typeof variable === "object" &&
                /^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(variable)) &&
                variable.length !== undefined &&
                (variable.length === 0 || (typeof variable[0] === "object" && variable[0].nodeType > 0));
        },
        /* Determine if variable is a wrapped jQuery or Zepto element. */
        isWrapped: function (variable) {
            return variable && (variable.jquery || (window.Zepto && window.Zepto.zepto.isZ(variable)));
        },
        isSVG: function (variable) {
            return window.SVGElement && (variable instanceof window.SVGElement);
        },
        isEmptyObject: function (variable) {
            for (var name in variable) {
                return false;
            }

            return true;
        }
    };

    /*****************
       Dependencies
    *****************/

    var $,
        isJQuery = false;

    if (global.fn && global.fn.jquery) {
        $ = global;
        isJQuery = true;
    } else {
        $ = window.Velocity.Utilities;
    }

    if (IE <= 8 && !isJQuery) {
        throw new Error("Velocity: IE8 and below require jQuery to be loaded before Velocity.");
    } else if (IE <= 7) {
        /* Revert to jQuery's $.animate(), and lose Velocity's extra features. */
        jQuery.fn.velocity = jQuery.fn.animate;

        /* Now that $.fn.velocity is aliased, abort this Velocity declaration. */
        return;
    }

    /*****************
        Constants
    *****************/

    var DURATION_DEFAULT = 400,
        EASING_DEFAULT = "swing";

    /*************
        State
    *************/

    var Velocity = {
        /* Container for page-wide Velocity state data. */
        State: {
            /* Detect mobile devices to determine if mobileHA should be turned on. */
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            /* The mobileHA option's behavior changes on older Android devices (Gingerbread, versions 2.3.3-2.3.7). */
            isAndroid: /Android/i.test(navigator.userAgent),
            isGingerbread: /Android 2\.3\.[3-7]/i.test(navigator.userAgent),
            isChrome: window.chrome,
            isFirefox: /Firefox/i.test(navigator.userAgent),
            /* Create a cached element for re-use when checking for CSS property prefixes. */
            prefixElement: document.createElement("div"),
            /* Cache every prefix match to avoid repeating lookups. */
            prefixMatches: {},
            /* Cache the anchor used for animating window scrolling. */
            scrollAnchor: null,
            /* Cache the browser-specific property names associated with the scroll anchor. */
            scrollPropertyLeft: null,
            scrollPropertyTop: null,
            /* Keep track of whether our RAF tick is running. */
            isTicking: false,
            /* Container for every in-progress call to Velocity. */
            calls: []
        },
        /* Velocity's custom CSS stack. Made global for unit testing. */
        CSS: { /* Defined below. */ },
        /* A shim of the jQuery utility functions used by Velocity -- provided by Velocity's optional jQuery shim. */
        Utilities: $,
        /* Container for the user's custom animation redirects that are referenced by name in place of the properties map argument. */
        Redirects: { /* Manually registered by the user. */ },
        Easings: { /* Defined below. */ },
        /* Attempt to use ES6 Promises by default. Users can override this with a third-party promises library. */
        Promise: window.Promise,
        /* Velocity option defaults, which can be overriden by the user. */
        defaults: {
            queue: "",
            duration: DURATION_DEFAULT,
            easing: EASING_DEFAULT,
            begin: undefined,
            complete: undefined,
            progress: undefined,
            display: undefined,
            visibility: undefined,
            loop: false,
            delay: false,
            mobileHA: true,
            /* Advanced: Set to false to prevent property values from being cached between consecutive Velocity-initiated chain calls. */
            _cacheValues: true
        },
        /* A design goal of Velocity is to cache data wherever possible in order to avoid DOM requerying. Accordingly, each element has a data cache. */
        init: function (element) {
            $.data(element, "velocity", {
                /* Store whether this is an SVG element, since its properties are retrieved and updated differently than standard HTML elements. */
                isSVG: Type.isSVG(element),
                /* Keep track of whether the element is currently being animated by Velocity.
                   This is used to ensure that property values are not transferred between non-consecutive (stale) calls. */
                isAnimating: false,
                /* A reference to the element's live computedStyle object. Learn more here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
                computedStyle: null,
                /* Tween data is cached for each animation on the element so that data can be passed across calls --
                   in particular, end values are used as subsequent start values in consecutive Velocity calls. */
                tweensContainer: null,
                /* The full root property values of each CSS hook being animated on this element are cached so that:
                   1) Concurrently-animating hooks sharing the same root can have their root values' merged into one while tweening.
                   2) Post-hook-injection root values can be transferred over to consecutively chained Velocity calls as starting root values. */
                rootPropertyValueCache: {},
                /* A cache for transform updates, which must be manually flushed via CSS.flushTransformCache(). */
                transformCache: {}
            });
        },
        /* A parallel to jQuery's $.css(), used for getting/setting Velocity's hooked CSS properties. */
        hook: null, /* Defined below. */
        /* Velocity-wide animation time remapping for testing purposes. */
        mock: false,
        version: { major: 1, minor: 2, patch: 2 },
        /* Set to 1 or 2 (most verbose) to output debug info to console. */
        debug: false
    };

    /* Retrieve the appropriate scroll anchor and property name for the browser: https://developer.mozilla.org/en-US/docs/Web/API/Window.scrollY */
    if (window.pageYOffset !== undefined) {
        Velocity.State.scrollAnchor = window;
        Velocity.State.scrollPropertyLeft = "pageXOffset";
        Velocity.State.scrollPropertyTop = "pageYOffset";
    } else {
        Velocity.State.scrollAnchor = document.documentElement || document.body.parentNode || document.body;
        Velocity.State.scrollPropertyLeft = "scrollLeft";
        Velocity.State.scrollPropertyTop = "scrollTop";
    }

    /* Shorthand alias for jQuery's $.data() utility. */
    function Data (element) {
        /* Hardcode a reference to the plugin name. */
        var response = $.data(element, "velocity");

        /* jQuery <=1.4.2 returns null instead of undefined when no match is found. We normalize this behavior. */
        return response === null ? undefined : response;
    };

    /**************
        Easing
    **************/

    /* Step easing generator. */
    function generateStep (steps) {
        return function (p) {
            return Math.round(p * steps) * (1 / steps);
        };
    }

    /* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    function generateBezier (mX1, mY1, mX2, mY2) {
        var NEWTON_ITERATIONS = 4,
            NEWTON_MIN_SLOPE = 0.001,
            SUBDIVISION_PRECISION = 0.0000001,
            SUBDIVISION_MAX_ITERATIONS = 10,
            kSplineTableSize = 11,
            kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
            float32ArraySupported = "Float32Array" in window;

        /* Must contain four arguments. */
        if (arguments.length !== 4) {
            return false;
        }

        /* Arguments must be numbers. */
        for (var i = 0; i < 4; ++i) {
            if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
                return false;
            }
        }

        /* X values must be in the [0, 1] range. */
        mX1 = Math.min(mX1, 1);
        mX2 = Math.min(mX2, 1);
        mX1 = Math.max(mX1, 0);
        mX2 = Math.max(mX2, 0);

        var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

        function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
        function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
        function C (aA1)      { return 3.0 * aA1; }

        function calcBezier (aT, aA1, aA2) {
            return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
        }

        function getSlope (aT, aA1, aA2) {
            return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
        }

        function newtonRaphsonIterate (aX, aGuessT) {
            for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
                var currentSlope = getSlope(aGuessT, mX1, mX2);

                if (currentSlope === 0.0) return aGuessT;

                var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
                aGuessT -= currentX / currentSlope;
            }

            return aGuessT;
        }

        function calcSampleValues () {
            for (var i = 0; i < kSplineTableSize; ++i) {
                mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function binarySubdivide (aX, aA, aB) {
            var currentX, currentT, i = 0;

            do {
                currentT = aA + (aB - aA) / 2.0;
                currentX = calcBezier(currentT, mX1, mX2) - aX;
                if (currentX > 0.0) {
                  aB = currentT;
                } else {
                  aA = currentT;
                }
            } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

            return currentT;
        }

        function getTForX (aX) {
            var intervalStart = 0.0,
                currentSample = 1,
                lastSample = kSplineTableSize - 1;

            for (; currentSample != lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }

            --currentSample;

            var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]),
                guessForT = intervalStart + dist * kSampleStepSize,
                initialSlope = getSlope(guessForT, mX1, mX2);

            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT);
            } else if (initialSlope == 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
            }
        }

        var _precomputed = false;

        function precompute() {
            _precomputed = true;
            if (mX1 != mY1 || mX2 != mY2) calcSampleValues();
        }

        var f = function (aX) {
            if (!_precomputed) precompute();
            if (mX1 === mY1 && mX2 === mY2) return aX;
            if (aX === 0) return 0;
            if (aX === 1) return 1;

            return calcBezier(getTForX(aX), mY1, mY2);
        };

        f.getControlPoints = function() { return [{ x: mX1, y: mY1 }, { x: mX2, y: mY2 }]; };

        var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
        f.toString = function () { return str; };

        return f;
    }

    /* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
    /* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
       then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */
    var generateSpringRK4 = (function () {
        function springAccelerationForState (state) {
            return (-state.tension * state.x) - (state.friction * state.v);
        }

        function springEvaluateStateWithDerivative (initialState, dt, derivative) {
            var state = {
                x: initialState.x + derivative.dx * dt,
                v: initialState.v + derivative.dv * dt,
                tension: initialState.tension,
                friction: initialState.friction
            };

            return { dx: state.v, dv: springAccelerationForState(state) };
        }

        function springIntegrateState (state, dt) {
            var a = {
                    dx: state.v,
                    dv: springAccelerationForState(state)
                },
                b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
                c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
                d = springEvaluateStateWithDerivative(state, dt, c),
                dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
                dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

            state.x = state.x + dxdt * dt;
            state.v = state.v + dvdt * dt;

            return state;
        }

        return function springRK4Factory (tension, friction, duration) {

            var initState = {
                    x: -1,
                    v: 0,
                    tension: null,
                    friction: null
                },
                path = [0],
                time_lapsed = 0,
                tolerance = 1 / 10000,
                DT = 16 / 1000,
                have_duration, dt, last_state;

            tension = parseFloat(tension) || 500;
            friction = parseFloat(friction) || 20;
            duration = duration || null;

            initState.tension = tension;
            initState.friction = friction;

            have_duration = duration !== null;

            /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
            if (have_duration) {
                /* Run the simulation without a duration. */
                time_lapsed = springRK4Factory(tension, friction);
                /* Compute the adjusted time delta. */
                dt = time_lapsed / duration * DT;
            } else {
                dt = DT;
            }

            while (true) {
                /* Next/step function .*/
                last_state = springIntegrateState(last_state || initState, dt);
                /* Store the position. */
                path.push(1 + last_state.x);
                time_lapsed += 16;
                /* If the change threshold is reached, break. */
                if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                    break;
                }
            }

            /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
               computed path and returns a snapshot of the position according to a given percentComplete. */
            return !have_duration ? time_lapsed : function(percentComplete) { return path[ (percentComplete * (path.length - 1)) | 0 ]; };
        };
    }());

    /* jQuery easings. */
    Velocity.Easings = {
        linear: function(p) { return p; },
        swing: function(p) { return 0.5 - Math.cos( p * Math.PI ) / 2 },
        /* Bonus "spring" easing, which is a less exaggerated version of easeInOutElastic. */
        spring: function(p) { return 1 - (Math.cos(p * 4.5 * Math.PI) * Math.exp(-p * 6)); }
    };

    /* CSS3 and Robert Penner easings. */
    $.each(
        [
            [ "ease", [ 0.25, 0.1, 0.25, 1.0 ] ],
            [ "ease-in", [ 0.42, 0.0, 1.00, 1.0 ] ],
            [ "ease-out", [ 0.00, 0.0, 0.58, 1.0 ] ],
            [ "ease-in-out", [ 0.42, 0.0, 0.58, 1.0 ] ],
            [ "easeInSine", [ 0.47, 0, 0.745, 0.715 ] ],
            [ "easeOutSine", [ 0.39, 0.575, 0.565, 1 ] ],
            [ "easeInOutSine", [ 0.445, 0.05, 0.55, 0.95 ] ],
            [ "easeInQuad", [ 0.55, 0.085, 0.68, 0.53 ] ],
            [ "easeOutQuad", [ 0.25, 0.46, 0.45, 0.94 ] ],
            [ "easeInOutQuad", [ 0.455, 0.03, 0.515, 0.955 ] ],
            [ "easeInCubic", [ 0.55, 0.055, 0.675, 0.19 ] ],
            [ "easeOutCubic", [ 0.215, 0.61, 0.355, 1 ] ],
            [ "easeInOutCubic", [ 0.645, 0.045, 0.355, 1 ] ],
            [ "easeInQuart", [ 0.895, 0.03, 0.685, 0.22 ] ],
            [ "easeOutQuart", [ 0.165, 0.84, 0.44, 1 ] ],
            [ "easeInOutQuart", [ 0.77, 0, 0.175, 1 ] ],
            [ "easeInQuint", [ 0.755, 0.05, 0.855, 0.06 ] ],
            [ "easeOutQuint", [ 0.23, 1, 0.32, 1 ] ],
            [ "easeInOutQuint", [ 0.86, 0, 0.07, 1 ] ],
            [ "easeInExpo", [ 0.95, 0.05, 0.795, 0.035 ] ],
            [ "easeOutExpo", [ 0.19, 1, 0.22, 1 ] ],
            [ "easeInOutExpo", [ 1, 0, 0, 1 ] ],
            [ "easeInCirc", [ 0.6, 0.04, 0.98, 0.335 ] ],
            [ "easeOutCirc", [ 0.075, 0.82, 0.165, 1 ] ],
            [ "easeInOutCirc", [ 0.785, 0.135, 0.15, 0.86 ] ]
        ], function(i, easingArray) {
            Velocity.Easings[easingArray[0]] = generateBezier.apply(null, easingArray[1]);
        });

    /* Determine the appropriate easing type given an easing input. */
    function getEasing(value, duration) {
        var easing = value;

        /* The easing option can either be a string that references a pre-registered easing,
           or it can be a two-/four-item array of integers to be converted into a bezier/spring function. */
        if (Type.isString(value)) {
            /* Ensure that the easing has been assigned to jQuery's Velocity.Easings object. */
            if (!Velocity.Easings[value]) {
                easing = false;
            }
        } else if (Type.isArray(value) && value.length === 1) {
            easing = generateStep.apply(null, value);
        } else if (Type.isArray(value) && value.length === 2) {
            /* springRK4 must be passed the animation's duration. */
            /* Note: If the springRK4 array contains non-numbers, generateSpringRK4() returns an easing
               function generated with default tension and friction values. */
            easing = generateSpringRK4.apply(null, value.concat([ duration ]));
        } else if (Type.isArray(value) && value.length === 4) {
            /* Note: If the bezier array contains non-numbers, generateBezier() returns false. */
            easing = generateBezier.apply(null, value);
        } else {
            easing = false;
        }

        /* Revert to the Velocity-wide default easing type, or fall back to "swing" (which is also jQuery's default)
           if the Velocity-wide default has been incorrectly modified. */
        if (easing === false) {
            if (Velocity.Easings[Velocity.defaults.easing]) {
                easing = Velocity.defaults.easing;
            } else {
                easing = EASING_DEFAULT;
            }
        }

        return easing;
    }

    /*****************
        CSS Stack
    *****************/

    /* The CSS object is a highly condensed and performant CSS stack that fully replaces jQuery's.
       It handles the validation, getting, and setting of both standard CSS properties and CSS property hooks. */
    /* Note: A "CSS" shorthand is aliased so that our code is easier to read. */
    var CSS = Velocity.CSS = {

        /*************
            RegEx
        *************/

        RegEx: {
            isHex: /^#([A-f\d]{3}){1,2}$/i,
            /* Unwrap a property value's surrounding text, e.g. "rgba(4, 3, 2, 1)" ==> "4, 3, 2, 1" and "rect(4px 3px 2px 1px)" ==> "4px 3px 2px 1px". */
            valueUnwrap: /^[A-z]+\((.*)\)$/i,
            wrappedValueAlreadyExtracted: /[0-9.]+ [0-9.]+ [0-9.]+( [0-9.]+)?/,
            /* Split a multi-value property into an array of subvalues, e.g. "rgba(4, 3, 2, 1) 4px 3px 2px 1px" ==> [ "rgba(4, 3, 2, 1)", "4px", "3px", "2px", "1px" ]. */
            valueSplit: /([A-z]+\(.+\))|(([A-z0-9#-.]+?)(?=\s|$))/ig
        },

        /************
            Lists
        ************/

        Lists: {
            colors: [ "fill", "stroke", "stopColor", "color", "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor" ],
            transformsBase: [ "translateX", "translateY", "scale", "scaleX", "scaleY", "skewX", "skewY", "rotateZ" ],
            transforms3D: [ "transformPerspective", "translateZ", "scaleZ", "rotateX", "rotateY" ]
        },

        /************
            Hooks
        ************/

        /* Hooks allow a subproperty (e.g. "boxShadowBlur") of a compound-value CSS property
           (e.g. "boxShadow: X Y Blur Spread Color") to be animated as if it were a discrete property. */
        /* Note: Beyond enabling fine-grained property animation, hooking is necessary since Velocity only
           tweens properties with single numeric values; unlike CSS transitions, Velocity does not interpolate compound-values. */
        Hooks: {
            /********************
                Registration
            ********************/

            /* Templates are a concise way of indicating which subproperties must be individually registered for each compound-value CSS property. */
            /* Each template consists of the compound-value's base name, its constituent subproperty names, and those subproperties' default values. */
            templates: {
                "textShadow": [ "Color X Y Blur", "black 0px 0px 0px" ],
                "boxShadow": [ "Color X Y Blur Spread", "black 0px 0px 0px 0px" ],
                "clip": [ "Top Right Bottom Left", "0px 0px 0px 0px" ],
                "backgroundPosition": [ "X Y", "0% 0%" ],
                "transformOrigin": [ "X Y Z", "50% 50% 0px" ],
                "perspectiveOrigin": [ "X Y", "50% 50%" ]
            },

            /* A "registered" hook is one that has been converted from its template form into a live,
               tweenable property. It contains data to associate it with its root property. */
            registered: {
                /* Note: A registered hook looks like this ==> textShadowBlur: [ "textShadow", 3 ],
                   which consists of the subproperty's name, the associated root property's name,
                   and the subproperty's position in the root's value. */
            },
            /* Convert the templates into individual hooks then append them to the registered object above. */
            register: function () {
                /* Color hooks registration: Colors are defaulted to white -- as opposed to black -- since colors that are
                   currently set to "transparent" default to their respective template below when color-animated,
                   and white is typically a closer match to transparent than black is. An exception is made for text ("color"),
                   which is almost always set closer to black than white. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    var rgbComponents = (CSS.Lists.colors[i] === "color") ? "0 0 0 1" : "255 255 255 1";
                    CSS.Hooks.templates[CSS.Lists.colors[i]] = [ "Red Green Blue Alpha", rgbComponents ];
                }

                var rootProperty,
                    hookTemplate,
                    hookNames;

                /* In IE, color values inside compound-value properties are positioned at the end the value instead of at the beginning.
                   Thus, we re-arrange the templates accordingly. */
                if (IE) {
                    for (rootProperty in CSS.Hooks.templates) {
                        hookTemplate = CSS.Hooks.templates[rootProperty];
                        hookNames = hookTemplate[0].split(" ");

                        var defaultValues = hookTemplate[1].match(CSS.RegEx.valueSplit);

                        if (hookNames[0] === "Color") {
                            /* Reposition both the hook's name and its default value to the end of their respective strings. */
                            hookNames.push(hookNames.shift());
                            defaultValues.push(defaultValues.shift());

                            /* Replace the existing template for the hook's root property. */
                            CSS.Hooks.templates[rootProperty] = [ hookNames.join(" "), defaultValues.join(" ") ];
                        }
                    }
                }

                /* Hook registration. */
                for (rootProperty in CSS.Hooks.templates) {
                    hookTemplate = CSS.Hooks.templates[rootProperty];
                    hookNames = hookTemplate[0].split(" ");

                    for (var i in hookNames) {
                        var fullHookName = rootProperty + hookNames[i],
                            hookPosition = i;

                        /* For each hook, register its full name (e.g. textShadowBlur) with its root property (e.g. textShadow)
                           and the hook's position in its template's default value string. */
                        CSS.Hooks.registered[fullHookName] = [ rootProperty, hookPosition ];
                    }
                }
            },

            /*****************************
               Injection and Extraction
            *****************************/

            /* Look up the root property associated with the hook (e.g. return "textShadow" for "textShadowBlur"). */
            /* Since a hook cannot be set directly (the browser won't recognize it), style updating for hooks is routed through the hook's root property. */
            getRoot: function (property) {
                var hookData = CSS.Hooks.registered[property];

                if (hookData) {
                    return hookData[0];
                } else {
                    /* If there was no hook match, return the property name untouched. */
                    return property;
                }
            },
            /* Convert any rootPropertyValue, null or otherwise, into a space-delimited list of hook values so that
               the targeted hook can be injected or extracted at its standard position. */
            cleanRootPropertyValue: function(rootProperty, rootPropertyValue) {
                /* If the rootPropertyValue is wrapped with "rgb()", "clip()", etc., remove the wrapping to normalize the value before manipulation. */
                if (CSS.RegEx.valueUnwrap.test(rootPropertyValue)) {
                    rootPropertyValue = rootPropertyValue.match(CSS.RegEx.valueUnwrap)[1];
                }

                /* If rootPropertyValue is a CSS null-value (from which there's inherently no hook value to extract),
                   default to the root's default value as defined in CSS.Hooks.templates. */
                /* Note: CSS null-values include "none", "auto", and "transparent". They must be converted into their
                   zero-values (e.g. textShadow: "none" ==> textShadow: "0px 0px 0px black") for hook manipulation to proceed. */
                if (CSS.Values.isCSSNullValue(rootPropertyValue)) {
                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                }

                return rootPropertyValue;
            },
            /* Extracted the hook's value from its root property's value. This is used to get the starting value of an animating hook. */
            extractValue: function (fullHookName, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1];

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its constituent hook values then grab the desired hook at its standard position. */
                    return rootPropertyValue.toString().match(CSS.RegEx.valueSplit)[hookPosition];
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            },
            /* Inject the hook's value into its root property's value. This is used to piece back together the root property
               once Velocity has updated one of its individually hooked values through tweening. */
            injectValue: function (fullHookName, hookValue, rootPropertyValue) {
                var hookData = CSS.Hooks.registered[fullHookName];

                if (hookData) {
                    var hookRoot = hookData[0],
                        hookPosition = hookData[1],
                        rootPropertyValueParts,
                        rootPropertyValueUpdated;

                    rootPropertyValue = CSS.Hooks.cleanRootPropertyValue(hookRoot, rootPropertyValue);

                    /* Split rootPropertyValue into its individual hook values, replace the targeted value with hookValue,
                       then reconstruct the rootPropertyValue string. */
                    rootPropertyValueParts = rootPropertyValue.toString().match(CSS.RegEx.valueSplit);
                    rootPropertyValueParts[hookPosition] = hookValue;
                    rootPropertyValueUpdated = rootPropertyValueParts.join(" ");

                    return rootPropertyValueUpdated;
                } else {
                    /* If the provided fullHookName isn't a registered hook, return the rootPropertyValue that was passed in. */
                    return rootPropertyValue;
                }
            }
        },

        /*******************
           Normalizations
        *******************/

        /* Normalizations standardize CSS property manipulation by pollyfilling browser-specific implementations (e.g. opacity)
           and reformatting special properties (e.g. clip, rgba) to look like standard ones. */
        Normalizations: {
            /* Normalizations are passed a normalization target (either the property's name, its extracted value, or its injected value),
               the targeted element (which may need to be queried), and the targeted property value. */
            registered: {
                clip: function (type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return "clip";
                        /* Clip needs to be unwrapped and stripped of its commas during extraction. */
                        case "extract":
                            var extracted;

                            /* If Velocity also extracted this value, skip extraction. */
                            if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                extracted = propertyValue;
                            } else {
                                /* Remove the "rect()" wrapper. */
                                extracted = propertyValue.toString().match(CSS.RegEx.valueUnwrap);

                                /* Strip off commas. */
                                extracted = extracted ? extracted[1].replace(/,(\s+)?/g, " ") : propertyValue;
                            }

                            return extracted;
                        /* Clip needs to be re-wrapped during injection. */
                        case "inject":
                            return "rect(" + propertyValue + ")";
                    }
                },

                blur: function(type, element, propertyValue) {
                    switch (type) {
                        case "name":
                            return Velocity.State.isFirefox ? "filter" : "-webkit-filter";
                        case "extract":
                            var extracted = parseFloat(propertyValue);

                            /* If extracted is NaN, meaning the value isn't already extracted. */
                            if (!(extracted || extracted === 0)) {
                                var blurComponent = propertyValue.toString().match(/blur\(([0-9]+[A-z]+)\)/i);

                                /* If the filter string had a blur component, return just the blur value and unit type. */
                                if (blurComponent) {
                                    extracted = blurComponent[1];
                                /* If the component doesn't exist, default blur to 0. */
                                } else {
                                    extracted = 0;
                                }
                            }

                            return extracted;
                        /* Blur needs to be re-wrapped during injection. */
                        case "inject":
                            /* For the blur effect to be fully de-applied, it needs to be set to "none" instead of 0. */
                            if (!parseFloat(propertyValue)) {
                                return "none";
                            } else {
                                return "blur(" + propertyValue + ")";
                            }
                    }
                },

                /* <=IE8 do not support the standard opacity property. They use filter:alpha(opacity=INT) instead. */
                opacity: function (type, element, propertyValue) {
                    if (IE <= 8) {
                        switch (type) {
                            case "name":
                                return "filter";
                            case "extract":
                                /* <=IE8 return a "filter" value of "alpha(opacity=\d{1,3})".
                                   Extract the value and convert it to a decimal value to match the standard CSS opacity property's formatting. */
                                var extracted = propertyValue.toString().match(/alpha\(opacity=(.*)\)/i);

                                if (extracted) {
                                    /* Convert to decimal value. */
                                    propertyValue = extracted[1] / 100;
                                } else {
                                    /* When extracting opacity, default to 1 since a null value means opacity hasn't been set. */
                                    propertyValue = 1;
                                }

                                return propertyValue;
                            case "inject":
                                /* Opacified elements are required to have their zoom property set to a non-zero value. */
                                element.style.zoom = 1;

                                /* Setting the filter property on elements with certain font property combinations can result in a
                                   highly unappealing ultra-bolding effect. There's no way to remedy this throughout a tween, but dropping the
                                   value altogether (when opacity hits 1) at leasts ensures that the glitch is gone post-tweening. */
                                if (parseFloat(propertyValue) >= 1) {
                                    return "";
                                } else {
                                  /* As per the filter property's spec, convert the decimal value to a whole number and wrap the value. */
                                  return "alpha(opacity=" + parseInt(parseFloat(propertyValue) * 100, 10) + ")";
                                }
                        }
                    /* With all other browsers, normalization is not required; return the same values that were passed in. */
                    } else {
                        switch (type) {
                            case "name":
                                return "opacity";
                            case "extract":
                                return propertyValue;
                            case "inject":
                                return propertyValue;
                        }
                    }
                }
            },

            /*****************************
                Batched Registrations
            *****************************/

            /* Note: Batched normalizations extend the CSS.Normalizations.registered object. */
            register: function () {

                /*****************
                    Transforms
                *****************/

                /* Transforms are the subproperties contained by the CSS "transform" property. Transforms must undergo normalization
                   so that they can be referenced in a properties map by their individual names. */
                /* Note: When transforms are "set", they are actually assigned to a per-element transformCache. When all transform
                   setting is complete complete, CSS.flushTransformCache() must be manually called to flush the values to the DOM.
                   Transform setting is batched in this way to improve performance: the transform style only needs to be updated
                   once when multiple transform subproperties are being animated simultaneously. */
                /* Note: IE9 and Android Gingerbread have support for 2D -- but not 3D -- transforms. Since animating unsupported
                   transform properties results in the browser ignoring the *entire* transform string, we prevent these 3D values
                   from being normalized for these browsers so that tweening skips these properties altogether
                   (since it will ignore them as being unsupported by the browser.) */
                if (!(IE <= 9) && !Velocity.State.isGingerbread) {
                    /* Note: Since the standalone CSS "perspective" property and the CSS transform "perspective" subproperty
                    share the same name, the latter is given a unique token within Velocity: "transformPerspective". */
                    CSS.Lists.transformsBase = CSS.Lists.transformsBase.concat(CSS.Lists.transforms3D);
                }

                for (var i = 0; i < CSS.Lists.transformsBase.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that transformName's value is
                    paired with its respective function. (Otherwise, all functions would take the final for loop's transformName.) */
                    (function() {
                        var transformName = CSS.Lists.transformsBase[i];

                        CSS.Normalizations.registered[transformName] = function (type, element, propertyValue) {
                            switch (type) {
                                /* The normalized property name is the parent "transform" property -- the property that is actually set in CSS. */
                                case "name":
                                    return "transform";
                                /* Transform values are cached onto a per-element transformCache object. */
                                case "extract":
                                    /* If this transform has yet to be assigned a value, return its null value. */
                                    if (Data(element) === undefined || Data(element).transformCache[transformName] === undefined) {
                                        /* Scale CSS.Lists.transformsBase default to 1 whereas all other transform properties default to 0. */
                                        return /^scale/i.test(transformName) ? 1 : 0;
                                    /* When transform values are set, they are wrapped in parentheses as per the CSS spec.
                                       Thus, when extracting their values (for tween calculations), we strip off the parentheses. */
                                    } else {
                                        return Data(element).transformCache[transformName].replace(/[()]/g, "");
                                    }
                                case "inject":
                                    var invalid = false;

                                    /* If an individual transform property contains an unsupported unit type, the browser ignores the *entire* transform property.
                                       Thus, protect users from themselves by skipping setting for transform values supplied with invalid unit types. */
                                    /* Switch on the base transform type; ignore the axis by removing the last letter from the transform's name. */
                                    switch (transformName.substr(0, transformName.length - 1)) {
                                        /* Whitelist unit types for each transform. */
                                        case "translate":
                                            invalid = !/(%|px|em|rem|vw|vh|\d)$/i.test(propertyValue);
                                            break;
                                        /* Since an axis-free "scale" property is supported as well, a little hack is used here to detect it by chopping off its last letter. */
                                        case "scal":
                                        case "scale":
                                            /* Chrome on Android has a bug in which scaled elements blur if their initial scale
                                               value is below 1 (which can happen with forcefeeding). Thus, we detect a yet-unset scale property
                                               and ensure that its first value is always 1. More info: http://stackoverflow.com/questions/10417890/css3-animations-with-transform-causes-blurred-elements-on-webkit/10417962#10417962 */
                                            if (Velocity.State.isAndroid && Data(element).transformCache[transformName] === undefined && propertyValue < 1) {
                                                propertyValue = 1;
                                            }

                                            invalid = !/(\d)$/i.test(propertyValue);
                                            break;
                                        case "skew":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                        case "rotate":
                                            invalid = !/(deg|\d)$/i.test(propertyValue);
                                            break;
                                    }

                                    if (!invalid) {
                                        /* As per the CSS spec, wrap the value in parentheses. */
                                        Data(element).transformCache[transformName] = "(" + propertyValue + ")";
                                    }

                                    /* Although the value is set on the transformCache object, return the newly-updated value for the calling code to process as normal. */
                                    return Data(element).transformCache[transformName];
                            }
                        };
                    })();
                }

                /*************
                    Colors
                *************/

                /* Since Velocity only animates a single numeric value per property, color animation is achieved by hooking the individual RGBA components of CSS color properties.
                   Accordingly, color values must be normalized (e.g. "#ff0000", "red", and "rgb(255, 0, 0)" ==> "255 0 0 1") so that their components can be injected/extracted by CSS.Hooks logic. */
                for (var i = 0; i < CSS.Lists.colors.length; i++) {
                    /* Wrap the dynamically generated normalization function in a new scope so that colorName's value is paired with its respective function.
                       (Otherwise, all functions would take the final for loop's colorName.) */
                    (function () {
                        var colorName = CSS.Lists.colors[i];

                        /* Note: In IE<=8, which support rgb but not rgba, color properties are reverted to rgb by stripping off the alpha component. */
                        CSS.Normalizations.registered[colorName] = function(type, element, propertyValue) {
                            switch (type) {
                                case "name":
                                    return colorName;
                                /* Convert all color values into the rgb format. (Old IE can return hex values and color names instead of rgb/rgba.) */
                                case "extract":
                                    var extracted;

                                    /* If the color is already in its hookable form (e.g. "255 255 255 1") due to having been previously extracted, skip extraction. */
                                    if (CSS.RegEx.wrappedValueAlreadyExtracted.test(propertyValue)) {
                                        extracted = propertyValue;
                                    } else {
                                        var converted,
                                            colorNames = {
                                                black: "rgb(0, 0, 0)",
                                                blue: "rgb(0, 0, 255)",
                                                gray: "rgb(128, 128, 128)",
                                                green: "rgb(0, 128, 0)",
                                                red: "rgb(255, 0, 0)",
                                                white: "rgb(255, 255, 255)"
                                            };

                                        /* Convert color names to rgb. */
                                        if (/^[A-z]+$/i.test(propertyValue)) {
                                            if (colorNames[propertyValue] !== undefined) {
                                                converted = colorNames[propertyValue]
                                            } else {
                                                /* If an unmatched color name is provided, default to black. */
                                                converted = colorNames.black;
                                            }
                                        /* Convert hex values to rgb. */
                                        } else if (CSS.RegEx.isHex.test(propertyValue)) {
                                            converted = "rgb(" + CSS.Values.hexToRgb(propertyValue).join(" ") + ")";
                                        /* If the provided color doesn't match any of the accepted color formats, default to black. */
                                        } else if (!(/^rgba?\(/i.test(propertyValue))) {
                                            converted = colorNames.black;
                                        }

                                        /* Remove the surrounding "rgb/rgba()" string then replace commas with spaces and strip
                                           repeated spaces (in case the value included spaces to begin with). */
                                        extracted = (converted || propertyValue).toString().match(CSS.RegEx.valueUnwrap)[1].replace(/,(\s+)?/g, " ");
                                    }

                                    /* So long as this isn't <=IE8, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    if (!(IE <= 8) && extracted.split(" ").length === 3) {
                                        extracted += " 1";
                                    }

                                    return extracted;
                                case "inject":
                                    /* If this is IE<=8 and an alpha component exists, strip it off. */
                                    if (IE <= 8) {
                                        if (propertyValue.split(" ").length === 4) {
                                            propertyValue = propertyValue.split(/\s+/).slice(0, 3).join(" ");
                                        }
                                    /* Otherwise, add a fourth (alpha) component if it's missing and default it to 1 (visible). */
                                    } else if (propertyValue.split(" ").length === 3) {
                                        propertyValue += " 1";
                                    }

                                    /* Re-insert the browser-appropriate wrapper("rgb/rgba()"), insert commas, and strip off decimal units
                                       on all values but the fourth (R, G, and B only accept whole numbers). */
                                    return (IE <= 8 ? "rgb" : "rgba") + "(" + propertyValue.replace(/\s+/g, ",").replace(/\.(\d)+(?=,)/g, "") + ")";
                            }
                        };
                    })();
                }
            }
        },

        /************************
           CSS Property Names
        ************************/

        Names: {
            /* Camelcase a property name into its JavaScript notation (e.g. "background-color" ==> "backgroundColor").
               Camelcasing is used to normalize property names between and across calls. */
            camelCase: function (property) {
                return property.replace(/-(\w)/g, function (match, subMatch) {
                    return subMatch.toUpperCase();
                });
            },

            /* For SVG elements, some properties (namely, dimensional ones) are GET/SET via the element's HTML attributes (instead of via CSS styles). */
            SVGAttribute: function (property) {
                var SVGAttributes = "width|height|x|y|cx|cy|r|rx|ry|x1|x2|y1|y2";

                /* Certain browsers require an SVG transform to be applied as an attribute. (Otherwise, application via CSS is preferable due to 3D support.) */
                if (IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) {
                    SVGAttributes += "|transform";
                }

                return new RegExp("^(" + SVGAttributes + ")$", "i").test(property);
            },

            /* Determine whether a property should be set with a vendor prefix. */
            /* If a prefixed version of the property exists, return it. Otherwise, return the original property name.
               If the property is not at all supported by the browser, return a false flag. */
            prefixCheck: function (property) {
                /* If this property has already been checked, return the cached value. */
                if (Velocity.State.prefixMatches[property]) {
                    return [ Velocity.State.prefixMatches[property], true ];
                } else {
                    var vendors = [ "", "Webkit", "Moz", "ms", "O" ];

                    for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
                        var propertyPrefixed;

                        if (i === 0) {
                            propertyPrefixed = property;
                        } else {
                            /* Capitalize the first letter of the property to conform to JavaScript vendor prefix notation (e.g. webkitFilter). */
                            propertyPrefixed = vendors[i] + property.replace(/^\w/, function(match) { return match.toUpperCase(); });
                        }

                        /* Check if the browser supports this property as prefixed. */
                        if (Type.isString(Velocity.State.prefixElement.style[propertyPrefixed])) {
                            /* Cache the match. */
                            Velocity.State.prefixMatches[property] = propertyPrefixed;

                            return [ propertyPrefixed, true ];
                        }
                    }

                    /* If the browser doesn't support this property in any form, include a false flag so that the caller can decide how to proceed. */
                    return [ property, false ];
                }
            }
        },

        /************************
           CSS Property Values
        ************************/

        Values: {
            /* Hex to RGB conversion. Copyright Tim Down: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb */
            hexToRgb: function (hex) {
                var shortformRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
                    longformRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i,
                    rgbParts;

                hex = hex.replace(shortformRegex, function (m, r, g, b) {
                    return r + r + g + g + b + b;
                });

                rgbParts = longformRegex.exec(hex);

                return rgbParts ? [ parseInt(rgbParts[1], 16), parseInt(rgbParts[2], 16), parseInt(rgbParts[3], 16) ] : [ 0, 0, 0 ];
            },

            isCSSNullValue: function (value) {
                /* The browser defaults CSS values that have not been set to either 0 or one of several possible null-value strings.
                   Thus, we check for both falsiness and these special strings. */
                /* Null-value checking is performed to default the special strings to 0 (for the sake of tweening) or their hook
                   templates as defined as CSS.Hooks (for the sake of hook injection/extraction). */
                /* Note: Chrome returns "rgba(0, 0, 0, 0)" for an undefined color whereas IE returns "transparent". */
                return (value == 0 || /^(none|auto|transparent|(rgba\(0, ?0, ?0, ?0\)))$/i.test(value));
            },

            /* Retrieve a property's default unit type. Used for assigning a unit type when one is not supplied by the user. */
            getUnitType: function (property) {
                if (/^(rotate|skew)/i.test(property)) {
                    return "deg";
                } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
                    /* The above properties are unitless. */
                    return "";
                } else {
                    /* Default to px for all other properties. */
                    return "px";
                }
            },

            /* HTML elements default to an associated display type when they're not set to display:none. */
            /* Note: This function is used for correctly setting the non-"none" display value in certain Velocity redirects, such as fadeIn/Out. */
            getDisplayType: function (element) {
                var tagName = element && element.tagName.toString().toLowerCase();

                if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
                    return "inline";
                } else if (/^(li)$/i.test(tagName)) {
                    return "list-item";
                } else if (/^(tr)$/i.test(tagName)) {
                    return "table-row";
                } else if (/^(table)$/i.test(tagName)) {
                    return "table";
                } else if (/^(tbody)$/i.test(tagName)) {
                    return "table-row-group";
                /* Default to "block" when no match is found. */
                } else {
                    return "block";
                }
            },

            /* The class add/remove functions are used to temporarily apply a "velocity-animating" class to elements while they're animating. */
            addClass: function (element, className) {
                if (element.classList) {
                    element.classList.add(className);
                } else {
                    element.className += (element.className.length ? " " : "") + className;
                }
            },

            removeClass: function (element, className) {
                if (element.classList) {
                    element.classList.remove(className);
                } else {
                    element.className = element.className.toString().replace(new RegExp("(^|\\s)" + className.split(" ").join("|") + "(\\s|$)", "gi"), " ");
                }
            }
        },

        /****************************
           Style Getting & Setting
        ****************************/

        /* The singular getPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        getPropertyValue: function (element, property, rootPropertyValue, forceStyleLookup) {
            /* Get an element's computed property value. */
            /* Note: Retrieving the value of a CSS property cannot simply be performed by checking an element's
               style attribute (which only reflects user-defined values). Instead, the browser must be queried for a property's
               *computed* value. You can read more about getComputedStyle here: https://developer.mozilla.org/en/docs/Web/API/window.getComputedStyle */
            function computePropertyValue (element, property) {
                /* When box-sizing isn't set to border-box, height and width style values are incorrectly computed when an
                   element's scrollbars are visible (which expands the element's dimensions). Thus, we defer to the more accurate
                   offsetHeight/Width property, which includes the total dimensions for interior, border, padding, and scrollbar.
                   We subtract border and padding to get the sum of interior + scrollbar. */
                var computedValue = 0;

                /* IE<=8 doesn't support window.getComputedStyle, thus we defer to jQuery, which has an extensive array
                   of hacks to accurately retrieve IE8 property values. Re-implementing that logic here is not worth bloating the
                   codebase for a dying browser. The performance repercussions of using jQuery here are minimal since
                   Velocity is optimized to rarely (and sometimes never) query the DOM. Further, the $.css() codepath isn't that slow. */
                if (IE <= 8) {
                    computedValue = $.css(element, property); /* GET */
                /* All other browsers support getComputedStyle. The returned live object reference is cached onto its
                   associated element so that it does not need to be refetched upon every GET. */
                } else {
                    /* Browsers do not return height and width values for elements that are set to display:"none". Thus, we temporarily
                       toggle display to the element type's default value. */
                    var toggleDisplay = false;

                    if (/^(width|height)$/.test(property) && CSS.getPropertyValue(element, "display") === 0) {
                        toggleDisplay = true;
                        CSS.setPropertyValue(element, "display", CSS.Values.getDisplayType(element));
                    }

                    function revertDisplay () {
                        if (toggleDisplay) {
                            CSS.setPropertyValue(element, "display", "none");
                        }
                    }

                    if (!forceStyleLookup) {
                        if (property === "height" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxHeight = element.offsetHeight - (parseFloat(CSS.getPropertyValue(element, "borderTopWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderBottomWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingTop")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingBottom")) || 0);
                            revertDisplay();

                            return contentBoxHeight;
                        } else if (property === "width" && CSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() !== "border-box") {
                            var contentBoxWidth = element.offsetWidth - (parseFloat(CSS.getPropertyValue(element, "borderLeftWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "borderRightWidth")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingLeft")) || 0) - (parseFloat(CSS.getPropertyValue(element, "paddingRight")) || 0);
                            revertDisplay();

                            return contentBoxWidth;
                        }
                    }

                    var computedStyle;

                    /* For elements that Velocity hasn't been called on directly (e.g. when Velocity queries the DOM on behalf
                       of a parent of an element its animating), perform a direct getComputedStyle lookup since the object isn't cached. */
                    if (Data(element) === undefined) {
                        computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If the computedStyle object has yet to be cached, do so now. */
                    } else if (!Data(element).computedStyle) {
                        computedStyle = Data(element).computedStyle = window.getComputedStyle(element, null); /* GET */
                    /* If computedStyle is cached, use it. */
                    } else {
                        computedStyle = Data(element).computedStyle;
                    }

                    /* IE and Firefox do not return a value for the generic borderColor -- they only return individual values for each border side's color.
                       Also, in all browsers, when border colors aren't all the same, a compound value is returned that Velocity isn't setup to parse.
                       So, as a polyfill for querying individual border side colors, we just return the top border's color and animate all borders from that value. */
                    if (property === "borderColor") {
                        property = "borderTopColor";
                    }

                    /* IE9 has a bug in which the "filter" property must be accessed from computedStyle using the getPropertyValue method
                       instead of a direct property lookup. The getPropertyValue method is slower than a direct lookup, which is why we avoid it by default. */
                    if (IE === 9 && property === "filter") {
                        computedValue = computedStyle.getPropertyValue(property); /* GET */
                    } else {
                        computedValue = computedStyle[property];
                    }

                    /* Fall back to the property's style value (if defined) when computedValue returns nothing,
                       which can happen when the element hasn't been painted. */
                    if (computedValue === "" || computedValue === null) {
                        computedValue = element.style[property];
                    }

                    revertDisplay();
                }

                /* For top, right, bottom, and left (TRBL) values that are set to "auto" on elements of "fixed" or "absolute" position,
                   defer to jQuery for converting "auto" to a numeric value. (For elements with a "static" or "relative" position, "auto" has the same
                   effect as being set to 0, so no conversion is necessary.) */
                /* An example of why numeric conversion is necessary: When an element with "position:absolute" has an untouched "left"
                   property, which reverts to "auto", left's value is 0 relative to its parent element, but is often non-zero relative
                   to its *containing* (not parent) element, which is the nearest "position:relative" ancestor or the viewport (and always the viewport in the case of "position:fixed"). */
                if (computedValue === "auto" && /^(top|right|bottom|left)$/i.test(property)) {
                    var position = computePropertyValue(element, "position"); /* GET */

                    /* For absolute positioning, jQuery's $.position() only returns values for top and left;
                       right and bottom will have their "auto" value reverted to 0. */
                    /* Note: A jQuery object must be created here since jQuery doesn't have a low-level alias for $.position().
                       Not a big deal since we're currently in a GET batch anyway. */
                    if (position === "fixed" || (position === "absolute" && /top|left/i.test(property))) {
                        /* Note: jQuery strips the pixel unit from its returned values; we re-add it here to conform with computePropertyValue's behavior. */
                        computedValue = $(element).position()[property] + "px"; /* GET */
                    }
                }

                return computedValue;
            }

            var propertyValue;

            /* If this is a hooked property (e.g. "clipLeft" instead of the root property of "clip"),
               extract the hook's value from a normalized rootPropertyValue using CSS.Hooks.extractValue(). */
            if (CSS.Hooks.registered[property]) {
                var hook = property,
                    hookRoot = CSS.Hooks.getRoot(hook);

                /* If a cached rootPropertyValue wasn't passed in (which Velocity always attempts to do in order to avoid requerying the DOM),
                   query the DOM for the root property's value. */
                if (rootPropertyValue === undefined) {
                    /* Since the browser is now being directly queried, use the official post-prefixing property name for this lookup. */
                    rootPropertyValue = CSS.getPropertyValue(element, CSS.Names.prefixCheck(hookRoot)[0]); /* GET */
                }

                /* If this root has a normalization registered, peform the associated normalization extraction. */
                if (CSS.Normalizations.registered[hookRoot]) {
                    rootPropertyValue = CSS.Normalizations.registered[hookRoot]("extract", element, rootPropertyValue);
                }

                /* Extract the hook's value. */
                propertyValue = CSS.Hooks.extractValue(hook, rootPropertyValue);

            /* If this is a normalized property (e.g. "opacity" becomes "filter" in <=IE8) or "translateX" becomes "transform"),
               normalize the property's name and value, and handle the special case of transforms. */
            /* Note: Normalizing a property is mutually exclusive from hooking a property since hook-extracted values are strictly
               numerical and therefore do not require normalization extraction. */
            } else if (CSS.Normalizations.registered[property]) {
                var normalizedPropertyName,
                    normalizedPropertyValue;

                normalizedPropertyName = CSS.Normalizations.registered[property]("name", element);

                /* Transform values are calculated via normalization extraction (see below), which checks against the element's transformCache.
                   At no point do transform GETs ever actually query the DOM; initial stylesheet values are never processed.
                   This is because parsing 3D transform matrices is not always accurate and would bloat our codebase;
                   thus, normalization extraction defaults initial transform values to their zero-values (e.g. 1 for scaleX and 0 for translateX). */
                if (normalizedPropertyName !== "transform") {
                    normalizedPropertyValue = computePropertyValue(element, CSS.Names.prefixCheck(normalizedPropertyName)[0]); /* GET */

                    /* If the value is a CSS null-value and this property has a hook template, use that zero-value template so that hooks can be extracted from it. */
                    if (CSS.Values.isCSSNullValue(normalizedPropertyValue) && CSS.Hooks.templates[property]) {
                        normalizedPropertyValue = CSS.Hooks.templates[property][1];
                    }
                }

                propertyValue = CSS.Normalizations.registered[property]("extract", element, normalizedPropertyValue);
            }

            /* If a (numeric) value wasn't produced via hook extraction or normalization, query the DOM. */
            if (!/^[\d-]/.test(propertyValue)) {
                /* For SVG elements, dimensional properties (which SVGAttribute() detects) are tweened via
                   their HTML attribute values instead of their CSS style values. */
                if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                    /* Since the height/width attribute values must be set manually, they don't reflect computed values.
                       Thus, we use use getBBox() to ensure we always get values for elements with undefined height/width attributes. */
                    if (/^(height|width)$/i.test(property)) {
                        /* Firefox throws an error if .getBBox() is called on an SVG that isn't attached to the DOM. */
                        try {
                            propertyValue = element.getBBox()[property];
                        } catch (error) {
                            propertyValue = 0;
                        }
                    /* Otherwise, access the attribute value directly. */
                    } else {
                        propertyValue = element.getAttribute(property);
                    }
                } else {
                    propertyValue = computePropertyValue(element, CSS.Names.prefixCheck(property)[0]); /* GET */
                }
            }

            /* Since property lookups are for animation purposes (which entails computing the numeric delta between start and end values),
               convert CSS null-values to an integer of value 0. */
            if (CSS.Values.isCSSNullValue(propertyValue)) {
                propertyValue = 0;
            }

            if (Velocity.debug >= 2) console.log("Get " + property + ": " + propertyValue);

            return propertyValue;
        },

        /* The singular setPropertyValue, which routes the logic for all normalizations, hooks, and standard CSS properties. */
        setPropertyValue: function(element, property, propertyValue, rootPropertyValue, scrollData) {
            var propertyName = property;

            /* In order to be subjected to call options and element queueing, scroll animation is routed through Velocity as if it were a standard CSS property. */
            if (property === "scroll") {
                /* If a container option is present, scroll the container instead of the browser window. */
                if (scrollData.container) {
                    scrollData.container["scroll" + scrollData.direction] = propertyValue;
                /* Otherwise, Velocity defaults to scrolling the browser window. */
                } else {
                    if (scrollData.direction === "Left") {
                        window.scrollTo(propertyValue, scrollData.alternateValue);
                    } else {
                        window.scrollTo(scrollData.alternateValue, propertyValue);
                    }
                }
            } else {
                /* Transforms (translateX, rotateZ, etc.) are applied to a per-element transformCache object, which is manually flushed via flushTransformCache().
                   Thus, for now, we merely cache transforms being SET. */
                if (CSS.Normalizations.registered[property] && CSS.Normalizations.registered[property]("name", element) === "transform") {
                    /* Perform a normalization injection. */
                    /* Note: The normalization logic handles the transformCache updating. */
                    CSS.Normalizations.registered[property]("inject", element, propertyValue);

                    propertyName = "transform";
                    propertyValue = Data(element).transformCache[property];
                } else {
                    /* Inject hooks. */
                    if (CSS.Hooks.registered[property]) {
                        var hookName = property,
                            hookRoot = CSS.Hooks.getRoot(property);

                        /* If a cached rootPropertyValue was not provided, query the DOM for the hookRoot's current value. */
                        rootPropertyValue = rootPropertyValue || CSS.getPropertyValue(element, hookRoot); /* GET */

                        propertyValue = CSS.Hooks.injectValue(hookName, propertyValue, rootPropertyValue);
                        property = hookRoot;
                    }

                    /* Normalize names and values. */
                    if (CSS.Normalizations.registered[property]) {
                        propertyValue = CSS.Normalizations.registered[property]("inject", element, propertyValue);
                        property = CSS.Normalizations.registered[property]("name", element);
                    }

                    /* Assign the appropriate vendor prefix before performing an official style update. */
                    propertyName = CSS.Names.prefixCheck(property)[0];

                    /* A try/catch is used for IE<=8, which throws an error when "invalid" CSS values are set, e.g. a negative width.
                       Try/catch is avoided for other browsers since it incurs a performance overhead. */
                    if (IE <= 8) {
                        try {
                            element.style[propertyName] = propertyValue;
                        } catch (error) { if (Velocity.debug) console.log("Browser does not support [" + propertyValue + "] for [" + propertyName + "]"); }
                    /* SVG elements have their dimensional properties (width, height, x, y, cx, etc.) applied directly as attributes instead of as styles. */
                    /* Note: IE8 does not support SVG elements, so it's okay that we skip it for SVG animation. */
                    } else if (Data(element) && Data(element).isSVG && CSS.Names.SVGAttribute(property)) {
                        /* Note: For SVG attributes, vendor-prefixed property names are never used. */
                        /* Note: Not all CSS properties can be animated via attributes, but the browser won't throw an error for unsupported properties. */
                        element.setAttribute(property, propertyValue);
                    } else {
                        element.style[propertyName] = propertyValue;
                    }

                    if (Velocity.debug >= 2) console.log("Set " + property + " (" + propertyName + "): " + propertyValue);
                }
            }

            /* Return the normalized property name and value in case the caller wants to know how these values were modified before being applied to the DOM. */
            return [ propertyName, propertyValue ];
        },

        /* To increase performance by batching transform updates into a single SET, transforms are not directly applied to an element until flushTransformCache() is called. */
        /* Note: Velocity applies transform properties in the same order that they are chronogically introduced to the element's CSS styles. */
        flushTransformCache: function(element) {
            var transformString = "";

            /* Certain browsers require that SVG transforms be applied as an attribute. However, the SVG transform attribute takes a modified version of CSS's transform string
               (units are dropped and, except for skewX/Y, subproperties are merged into their master property -- e.g. scaleX and scaleY are merged into scale(X Y). */
            if ((IE || (Velocity.State.isAndroid && !Velocity.State.isChrome)) && Data(element).isSVG) {
                /* Since transform values are stored in their parentheses-wrapped form, we use a helper function to strip out their numeric values.
                   Further, SVG transform properties only take unitless (representing pixels) values, so it's okay that parseFloat() strips the unit suffixed to the float value. */
                function getTransformFloat (transformProperty) {
                    return parseFloat(CSS.getPropertyValue(element, transformProperty));
                }

                /* Create an object to organize all the transforms that we'll apply to the SVG element. To keep the logic simple,
                   we process *all* transform properties -- even those that may not be explicitly applied (since they default to their zero-values anyway). */
                var SVGTransforms = {
                    translate: [ getTransformFloat("translateX"), getTransformFloat("translateY") ],
                    skewX: [ getTransformFloat("skewX") ], skewY: [ getTransformFloat("skewY") ],
                    /* If the scale property is set (non-1), use that value for the scaleX and scaleY values
                       (this behavior mimics the result of animating all these properties at once on HTML elements). */
                    scale: getTransformFloat("scale") !== 1 ? [ getTransformFloat("scale"), getTransformFloat("scale") ] : [ getTransformFloat("scaleX"), getTransformFloat("scaleY") ],
                    /* Note: SVG's rotate transform takes three values: rotation degrees followed by the X and Y values
                       defining the rotation's origin point. We ignore the origin values (default them to 0). */
                    rotate: [ getTransformFloat("rotateZ"), 0, 0 ]
                };

                /* Iterate through the transform properties in the user-defined property map order.
                   (This mimics the behavior of non-SVG transform animation.) */
                $.each(Data(element).transformCache, function(transformName) {
                    /* Except for with skewX/Y, revert the axis-specific transform subproperties to their axis-free master
                       properties so that they match up with SVG's accepted transform properties. */
                    if (/^translate/i.test(transformName)) {
                        transformName = "translate";
                    } else if (/^scale/i.test(transformName)) {
                        transformName = "scale";
                    } else if (/^rotate/i.test(transformName)) {
                        transformName = "rotate";
                    }

                    /* Check that we haven't yet deleted the property from the SVGTransforms container. */
                    if (SVGTransforms[transformName]) {
                        /* Append the transform property in the SVG-supported transform format. As per the spec, surround the space-delimited values in parentheses. */
                        transformString += transformName + "(" + SVGTransforms[transformName].join(" ") + ")" + " ";

                        /* After processing an SVG transform property, delete it from the SVGTransforms container so we don't
                           re-insert the same master property if we encounter another one of its axis-specific properties. */
                        delete SVGTransforms[transformName];
                    }
                });
            } else {
                var transformValue,
                    perspective;

                /* Transform properties are stored as members of the transformCache object. Concatenate all the members into a string. */
                $.each(Data(element).transformCache, function(transformName) {
                    transformValue = Data(element).transformCache[transformName];

                    /* Transform's perspective subproperty must be set first in order to take effect. Store it temporarily. */
                    if (transformName === "transformPerspective") {
                        perspective = transformValue;
                        return true;
                    }

                    /* IE9 only supports one rotation type, rotateZ, which it refers to as "rotate". */
                    if (IE === 9 && transformName === "rotateZ") {
                        transformName = "rotate";
                    }

                    transformString += transformName + transformValue + " ";
                });

                /* If present, set the perspective subproperty first. */
                if (perspective) {
                    transformString = "perspective" + perspective + " " + transformString;
                }
            }

            CSS.setPropertyValue(element, "transform", transformString);
        }
    };

    /* Register hooks and normalizations. */
    CSS.Hooks.register();
    CSS.Normalizations.register();

    /* Allow hook setting in the same fashion as jQuery's $.css(). */
    Velocity.hook = function (elements, arg2, arg3) {
        var value = undefined;

        elements = sanitizeElements(elements);

        $.each(elements, function(i, element) {
            /* Initialize Velocity's per-element data cache if this element hasn't previously been animated. */
            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /* Get property value. If an element set was passed in, only return the value for the first element. */
            if (arg3 === undefined) {
                if (value === undefined) {
                    value = Velocity.CSS.getPropertyValue(element, arg2);
                }
            /* Set property value. */
            } else {
                /* sPV returns an array of the normalized propertyName/propertyValue pair used to update the DOM. */
                var adjustedSet = Velocity.CSS.setPropertyValue(element, arg2, arg3);

                /* Transform properties don't automatically set. They have to be flushed to the DOM. */
                if (adjustedSet[0] === "transform") {
                    Velocity.CSS.flushTransformCache(element);
                }

                value = adjustedSet;
            }
        });

        return value;
    };

    /*****************
        Animation
    *****************/

    var animate = function() {

        /******************
            Call Chain
        ******************/

        /* Logic for determining what to return to the call stack when exiting out of Velocity. */
        function getChain () {
            /* If we are using the utility function, attempt to return this call's promise. If no promise library was detected,
               default to null instead of returning the targeted elements so that utility function's return value is standardized. */
            if (isUtility) {
                return promiseData.promise || null;
            /* Otherwise, if we're using $.fn, return the jQuery-/Zepto-wrapped element set. */
            } else {
                return elementsWrapped;
            }
        }

        /*************************
           Arguments Assignment
        *************************/

        /* To allow for expressive CoffeeScript code, Velocity supports an alternative syntax in which "elements" (or "e"), "properties" (or "p"), and "options" (or "o")
           objects are defined on a container object that's passed in as Velocity's sole argument. */
        /* Note: Some browsers automatically populate arguments with a "properties" object. We detect it by checking for its default "names" property. */
        var syntacticSugar = (arguments[0] && (arguments[0].p || (($.isPlainObject(arguments[0].properties) && !arguments[0].properties.names) || Type.isString(arguments[0].properties)))),
            /* Whether Velocity was called via the utility function (as opposed to on a jQuery/Zepto object). */
            isUtility,
            /* When Velocity is called via the utility function ($.Velocity()/Velocity()), elements are explicitly
               passed in as the first parameter. Thus, argument positioning varies. We normalize them here. */
            elementsWrapped,
            argumentIndex;

        var elements,
            propertiesMap,
            options;

        /* Detect jQuery/Zepto elements being animated via the $.fn method. */
        if (Type.isWrapped(this)) {
            isUtility = false;

            argumentIndex = 0;
            elements = this;
            elementsWrapped = this;
        /* Otherwise, raw elements are being animated via the utility function. */
        } else {
            isUtility = true;

            argumentIndex = 1;
            elements = syntacticSugar ? (arguments[0].elements || arguments[0].e) : arguments[0];
        }

        elements = sanitizeElements(elements);

        if (!elements) {
            return;
        }

        if (syntacticSugar) {
            propertiesMap = arguments[0].properties || arguments[0].p;
            options = arguments[0].options || arguments[0].o;
        } else {
            propertiesMap = arguments[argumentIndex];
            options = arguments[argumentIndex + 1];
        }

        /* The length of the element set (in the form of a nodeList or an array of elements) is defaulted to 1 in case a
           single raw DOM element is passed in (which doesn't contain a length property). */
        var elementsLength = elements.length,
            elementsIndex = 0;

        /***************************
            Argument Overloading
        ***************************/

        /* Support is included for jQuery's argument overloading: $.animate(propertyMap [, duration] [, easing] [, complete]).
           Overloading is detected by checking for the absence of an object being passed into options. */
        /* Note: The stop and finish actions do not accept animation options, and are therefore excluded from this check. */
        if (!/^(stop|finish|finishAll)$/i.test(propertiesMap) && !$.isPlainObject(options)) {
            /* The utility function shifts all arguments one position to the right, so we adjust for that offset. */
            var startingArgumentPosition = argumentIndex + 1;

            options = {};

            /* Iterate through all options arguments */
            for (var i = startingArgumentPosition; i < arguments.length; i++) {
                /* Treat a number as a duration. Parse it out. */
                /* Note: The following RegEx will return true if passed an array with a number as its first item.
                   Thus, arrays are skipped from this check. */
                if (!Type.isArray(arguments[i]) && (/^(fast|normal|slow)$/i.test(arguments[i]) || /^\d/.test(arguments[i]))) {
                    options.duration = arguments[i];
                /* Treat strings and arrays as easings. */
                } else if (Type.isString(arguments[i]) || Type.isArray(arguments[i])) {
                    options.easing = arguments[i];
                /* Treat a function as a complete callback. */
                } else if (Type.isFunction(arguments[i])) {
                    options.complete = arguments[i];
                }
            }
        }

        /***************
            Promises
        ***************/

        var promiseData = {
                promise: null,
                resolver: null,
                rejecter: null
            };

        /* If this call was made via the utility function (which is the default method of invocation when jQuery/Zepto are not being used), and if
           promise support was detected, create a promise object for this call and store references to its resolver and rejecter methods. The resolve
           method is used when a call completes naturally or is prematurely stopped by the user. In both cases, completeCall() handles the associated
           call cleanup and promise resolving logic. The reject method is used when an invalid set of arguments is passed into a Velocity call. */
        /* Note: Velocity employs a call-based queueing architecture, which means that stopping an animating element actually stops the full call that
           triggered it -- not that one element exclusively. Similarly, there is one promise per call, and all elements targeted by a Velocity call are
           grouped together for the purposes of resolving and rejecting a promise. */
        if (isUtility && Velocity.Promise) {
            promiseData.promise = new Velocity.Promise(function (resolve, reject) {
                promiseData.resolver = resolve;
                promiseData.rejecter = reject;
            });
        }

        /*********************
           Action Detection
        *********************/

        /* Velocity's behavior is categorized into "actions": Elements can either be specially scrolled into view,
           or they can be started, stopped, or reversed. If a literal or referenced properties map is passed in as Velocity's
           first argument, the associated action is "start". Alternatively, "scroll", "reverse", or "stop" can be passed in instead of a properties map. */
        var action;

        switch (propertiesMap) {
            case "scroll":
                action = "scroll";
                break;

            case "reverse":
                action = "reverse";
                break;

            case "finish":
            case "finishAll":
            case "stop":
                /*******************
                    Action: Stop
                *******************/

                /* Clear the currently-active delay on each targeted element. */
                $.each(elements, function(i, element) {
                    if (Data(element) && Data(element).delayTimer) {
                        /* Stop the timer from triggering its cached next() function. */
                        clearTimeout(Data(element).delayTimer.setTimeout);

                        /* Manually call the next() function so that the subsequent queue items can progress. */
                        if (Data(element).delayTimer.next) {
                            Data(element).delayTimer.next();
                        }

                        delete Data(element).delayTimer;
                    }

                    /* If we want to finish everything in the queue, we have to iterate through it
                       and call each function. This will make them active calls below, which will
                       cause them to be applied via the duration setting. */
                    if (propertiesMap === "finishAll" && (options === true || Type.isString(options))) {
                        /* Iterate through the items in the element's queue. */
                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                            /* The queue array can contain an "inprogress" string, which we skip. */
                            if (Type.isFunction(item)) {
                                item();
                            }
                        });

                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                        $.queue(element, Type.isString(options) ? options : "", []);
                    }
                });

                var callsToStop = [];

                /* When the stop action is triggered, the elements' currently active call is immediately stopped. The active call might have
                   been applied to multiple elements, in which case all of the call's elements will be stopped. When an element
                   is stopped, the next item in its animation queue is immediately triggered. */
                /* An additional argument may be passed in to clear an element's remaining queued calls. Either true (which defaults to the "fx" queue)
                   or a custom queue string can be passed in. */
                /* Note: The stop command runs prior to Velocity's Queueing phase since its behavior is intended to take effect *immediately*,
                   regardless of the element's current queue state. */

                /* Iterate through every active call. */
                $.each(Velocity.State.calls, function(i, activeCall) {
                    /* Inactive calls are set to false by the logic inside completeCall(). Skip them. */
                    if (activeCall) {
                        /* Iterate through the active call's targeted elements. */
                        $.each(activeCall[1], function(k, activeElement) {
                            /* If true was passed in as a secondary argument, clear absolutely all calls on this element. Otherwise, only
                               clear calls associated with the relevant queue. */
                            /* Call stopping logic works as follows:
                               - options === true --> stop current default queue calls (and queue:false calls), including remaining queued ones.
                               - options === undefined --> stop current queue:"" call and all queue:false calls.
                               - options === false --> stop only queue:false calls.
                               - options === "custom" --> stop current queue:"custom" call, including remaining queued ones (there is no functionality to only clear the currently-running queue:"custom" call). */
                            var queueName = (options === undefined) ? "" : options;

                            if (queueName !== true && (activeCall[2].queue !== queueName) && !(options === undefined && activeCall[2].queue === false)) {
                                return true;
                            }

                            /* Iterate through the calls targeted by the stop command. */
                            $.each(elements, function(l, element) {
                                /* Check that this call was applied to the target element. */
                                if (element === activeElement) {
                                    /* Optionally clear the remaining queued calls. If we're doing "finishAll" this won't find anything,
                                       due to the queue-clearing above. */
                                    if (options === true || Type.isString(options)) {
                                        /* Iterate through the items in the element's queue. */
                                        $.each($.queue(element, Type.isString(options) ? options : ""), function(_, item) {
                                            /* The queue array can contain an "inprogress" string, which we skip. */
                                            if (Type.isFunction(item)) {
                                                /* Pass the item's callback a flag indicating that we want to abort from the queue call.
                                                   (Specifically, the queue will resolve the call's associated promise then abort.)  */
                                                item(null, true);
                                            }
                                        });

                                        /* Clearing the $.queue() array is achieved by resetting it to []. */
                                        $.queue(element, Type.isString(options) ? options : "", []);
                                    }

                                    if (propertiesMap === "stop") {
                                        /* Since "reverse" uses cached start values (the previous call's endValues), these values must be
                                           changed to reflect the final value that the elements were actually tweened to. */
                                        /* Note: If only queue:false animations are currently running on an element, it won't have a tweensContainer
                                           object. Also, queue:false animations can't be reversed. */
                                        if (Data(element) && Data(element).tweensContainer && queueName !== false) {
                                            $.each(Data(element).tweensContainer, function(m, activeTween) {
                                                activeTween.endValue = activeTween.currentValue;
                                            });
                                        }

                                        callsToStop.push(i);
                                    } else if (propertiesMap === "finish" || propertiesMap === "finishAll") {
                                        /* To get active tweens to finish immediately, we forcefully shorten their durations to 1ms so that
                                        they finish upon the next rAf tick then proceed with normal call completion logic. */
                                        activeCall[2].duration = 1;
                                    }
                                }
                            });
                        });
                    }
                });

                /* Prematurely call completeCall() on each matched active call. Pass an additional flag for "stop" to indicate
                   that the complete callback and display:none setting should be skipped since we're completing prematurely. */
                if (propertiesMap === "stop") {
                    $.each(callsToStop, function(i, j) {
                        completeCall(j, true);
                    });

                    if (promiseData.promise) {
                        /* Immediately resolve the promise associated with this stop call since stop runs synchronously. */
                        promiseData.resolver(elements);
                    }
                }

                /* Since we're stopping, and not proceeding with queueing, exit out of Velocity. */
                return getChain();

            default:
                /* Treat a non-empty plain object as a literal properties map. */
                if ($.isPlainObject(propertiesMap) && !Type.isEmptyObject(propertiesMap)) {
                    action = "start";

                /****************
                    Redirects
                ****************/

                /* Check if a string matches a registered redirect (see Redirects above). */
                } else if (Type.isString(propertiesMap) && Velocity.Redirects[propertiesMap]) {
                    var opts = $.extend({}, options),
                        durationOriginal = opts.duration,
                        delayOriginal = opts.delay || 0;

                    /* If the backwards option was passed in, reverse the element set so that elements animate from the last to the first. */
                    if (opts.backwards === true) {
                        elements = $.extend(true, [], elements).reverse();
                    }

                    /* Individually trigger the redirect for each element in the set to prevent users from having to handle iteration logic in their redirect. */
                    $.each(elements, function(elementIndex, element) {
                        /* If the stagger option was passed in, successively delay each element by the stagger value (in ms). Retain the original delay value. */
                        if (parseFloat(opts.stagger)) {
                            opts.delay = delayOriginal + (parseFloat(opts.stagger) * elementIndex);
                        } else if (Type.isFunction(opts.stagger)) {
                            opts.delay = delayOriginal + opts.stagger.call(element, elementIndex, elementsLength);
                        }

                        /* If the drag option was passed in, successively increase/decrease (depending on the presense of opts.backwards)
                           the duration of each element's animation, using floors to prevent producing very short durations. */
                        if (opts.drag) {
                            /* Default the duration of UI pack effects (callouts and transitions) to 1000ms instead of the usual default duration of 400ms. */
                            opts.duration = parseFloat(durationOriginal) || (/^(callout|transition)/.test(propertiesMap) ? 1000 : DURATION_DEFAULT);

                            /* For each element, take the greater duration of: A) animation completion percentage relative to the original duration,
                               B) 75% of the original duration, or C) a 200ms fallback (in case duration is already set to a low value).
                               The end result is a baseline of 75% of the redirect's duration that increases/decreases as the end of the element set is approached. */
                            opts.duration = Math.max(opts.duration * (opts.backwards ? 1 - elementIndex/elementsLength : (elementIndex + 1) / elementsLength), opts.duration * 0.75, 200);
                        }

                        /* Pass in the call's opts object so that the redirect can optionally extend it. It defaults to an empty object instead of null to
                           reduce the opts checking logic required inside the redirect. */
                        Velocity.Redirects[propertiesMap].call(element, element, opts || {}, elementIndex, elementsLength, elements, promiseData.promise ? promiseData : undefined);
                    });

                    /* Since the animation logic resides within the redirect's own code, abort the remainder of this call.
                       (The performance overhead up to this point is virtually non-existant.) */
                    /* Note: The jQuery call chain is kept intact by returning the complete element set. */
                    return getChain();
                } else {
                    var abortError = "Velocity: First argument (" + propertiesMap + ") was not a property map, a known action, or a registered redirect. Aborting.";

                    if (promiseData.promise) {
                        promiseData.rejecter(new Error(abortError));
                    } else {
                        console.log(abortError);
                    }

                    return getChain();
                }
        }

        /**************************
            Call-Wide Variables
        **************************/

        /* A container for CSS unit conversion ratios (e.g. %, rem, and em ==> px) that is used to cache ratios across all elements
           being animated in a single Velocity call. Calculating unit ratios necessitates DOM querying and updating, and is therefore
           avoided (via caching) wherever possible. This container is call-wide instead of page-wide to avoid the risk of using stale
           conversion metrics across Velocity animations that are not immediately consecutively chained. */
        var callUnitConversionData = {
                lastParent: null,
                lastPosition: null,
                lastFontSize: null,
                lastPercentToPxWidth: null,
                lastPercentToPxHeight: null,
                lastEmToPx: null,
                remToPx: null,
                vwToPx: null,
                vhToPx: null
            };

        /* A container for all the ensuing tween data and metadata associated with this call. This container gets pushed to the page-wide
           Velocity.State.calls array that is processed during animation ticking. */
        var call = [];

        /************************
           Element Processing
        ************************/

        /* Element processing consists of three parts -- data processing that cannot go stale and data processing that *can* go stale (i.e. third-party style modifications):
           1) Pre-Queueing: Element-wide variables, including the element's data storage, are instantiated. Call options are prepared. If triggered, the Stop action is executed.
           2) Queueing: The logic that runs once this call has reached its point of execution in the element's $.queue() stack. Most logic is placed here to avoid risking it becoming stale.
           3) Pushing: Consolidation of the tween data followed by its push onto the global in-progress calls container.
        */

        function processElement () {

            /*************************
               Part I: Pre-Queueing
            *************************/

            /***************************
               Element-Wide Variables
            ***************************/

            var element = this,
                /* The runtime opts object is the extension of the current call's options and Velocity's page-wide option defaults. */
                opts = $.extend({}, Velocity.defaults, options),
                /* A container for the processed data associated with each property in the propertyMap.
                   (Each property in the map produces its own "tween".) */
                tweensContainer = {},
                elementUnitConversionData;

            /******************
               Element Init
            ******************/

            if (Data(element) === undefined) {
                Velocity.init(element);
            }

            /******************
               Option: Delay
            ******************/

            /* Since queue:false doesn't respect the item's existing queue, we avoid injecting its delay here (it's set later on). */
            /* Note: Velocity rolls its own delay function since jQuery doesn't have a utility alias for $.fn.delay()
               (and thus requires jQuery element creation, which we avoid since its overhead includes DOM querying). */
            if (parseFloat(opts.delay) && opts.queue !== false) {
                $.queue(element, opts.queue, function(next) {
                    /* This is a flag used to indicate to the upcoming completeCall() function that this queue entry was initiated by Velocity. See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    /* The ensuing queue item (which is assigned to the "next" argument that $.queue() automatically passes in) will be triggered after a setTimeout delay.
                       The setTimeout is stored so that it can be subjected to clearTimeout() if this animation is prematurely stopped via Velocity's "stop" command. */
                    Data(element).delayTimer = {
                        setTimeout: setTimeout(next, parseFloat(opts.delay)),
                        next: next
                    };
                });
            }

            /*********************
               Option: Duration
            *********************/

            /* Support for jQuery's named durations. */
            switch (opts.duration.toString().toLowerCase()) {
                case "fast":
                    opts.duration = 200;
                    break;

                case "normal":
                    opts.duration = DURATION_DEFAULT;
                    break;

                case "slow":
                    opts.duration = 600;
                    break;

                default:
                    /* Remove the potential "ms" suffix and default to 1 if the user is attempting to set a duration of 0 (in order to produce an immediate style change). */
                    opts.duration = parseFloat(opts.duration) || 1;
            }

            /************************
               Global Option: Mock
            ************************/

            if (Velocity.mock !== false) {
                /* In mock mode, all animations are forced to 1ms so that they occur immediately upon the next rAF tick.
                   Alternatively, a multiplier can be passed in to time remap all delays and durations. */
                if (Velocity.mock === true) {
                    opts.duration = opts.delay = 1;
                } else {
                    opts.duration *= parseFloat(Velocity.mock) || 1;
                    opts.delay *= parseFloat(Velocity.mock) || 1;
                }
            }

            /*******************
               Option: Easing
            *******************/

            opts.easing = getEasing(opts.easing, opts.duration);

            /**********************
               Option: Callbacks
            **********************/

            /* Callbacks must functions. Otherwise, default to null. */
            if (opts.begin && !Type.isFunction(opts.begin)) {
                opts.begin = null;
            }

            if (opts.progress && !Type.isFunction(opts.progress)) {
                opts.progress = null;
            }

            if (opts.complete && !Type.isFunction(opts.complete)) {
                opts.complete = null;
            }

            /*********************************
               Option: Display & Visibility
            *********************************/

            /* Refer to Velocity's documentation (VelocityJS.org/#displayAndVisibility) for a description of the display and visibility options' behavior. */
            /* Note: We strictly check for undefined instead of falsiness because display accepts an empty string value. */
            if (opts.display !== undefined && opts.display !== null) {
                opts.display = opts.display.toString().toLowerCase();

                /* Users can pass in a special "auto" value to instruct Velocity to set the element to its default display value. */
                if (opts.display === "auto") {
                    opts.display = Velocity.CSS.Values.getDisplayType(element);
                }
            }

            if (opts.visibility !== undefined && opts.visibility !== null) {
                opts.visibility = opts.visibility.toString().toLowerCase();
            }

            /**********************
               Option: mobileHA
            **********************/

            /* When set to true, and if this is a mobile device, mobileHA automatically enables hardware acceleration (via a null transform hack)
               on animating elements. HA is removed from the element at the completion of its animation. */
            /* Note: Android Gingerbread doesn't support HA. If a null transform hack (mobileHA) is in fact set, it will prevent other tranform subproperties from taking effect. */
            /* Note: You can read more about the use of mobileHA in Velocity's documentation: VelocityJS.org/#mobileHA. */
            opts.mobileHA = (opts.mobileHA && Velocity.State.isMobile && !Velocity.State.isGingerbread);

            /***********************
               Part II: Queueing
            ***********************/

            /* When a set of elements is targeted by a Velocity call, the set is broken up and each element has the current Velocity call individually queued onto it.
               In this way, each element's existing queue is respected; some elements may already be animating and accordingly should not have this current Velocity call triggered immediately. */
            /* In each queue, tween data is processed for each animating property then pushed onto the call-wide calls array. When the last element in the set has had its tweens processed,
               the call array is pushed to Velocity.State.calls for live processing by the requestAnimationFrame tick. */
            function buildQueue (next) {

                /*******************
                   Option: Begin
                *******************/

                /* The begin callback is fired once per call -- not once per elemenet -- and is passed the full raw DOM element set as both its context and its first argument. */
                if (opts.begin && elementsIndex === 0) {
                    /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                    try {
                        opts.begin.call(elements, elements);
                    } catch (error) {
                        setTimeout(function() { throw error; }, 1);
                    }
                }

                /*****************************************
                   Tween Data Construction (for Scroll)
                *****************************************/

                /* Note: In order to be subjected to chaining and animation options, scroll's tweening is routed through Velocity as if it were a standard CSS property animation. */
                if (action === "scroll") {
                    /* The scroll action uniquely takes an optional "offset" option -- specified in pixels -- that offsets the targeted scroll position. */
                    var scrollDirection = (/^x$/i.test(opts.axis) ? "Left" : "Top"),
                        scrollOffset = parseFloat(opts.offset) || 0,
                        scrollPositionCurrent,
                        scrollPositionCurrentAlternate,
                        scrollPositionEnd;

                    /* Scroll also uniquely takes an optional "container" option, which indicates the parent element that should be scrolled --
                       as opposed to the browser window itself. This is useful for scrolling toward an element that's inside an overflowing parent element. */
                    if (opts.container) {
                        /* Ensure that either a jQuery object or a raw DOM element was passed in. */
                        if (Type.isWrapped(opts.container) || Type.isNode(opts.container)) {
                            /* Extract the raw DOM element from the jQuery wrapper. */
                            opts.container = opts.container[0] || opts.container;
                            /* Note: Unlike other properties in Velocity, the browser's scroll position is never cached since it so frequently changes
                               (due to the user's natural interaction with the page). */
                            scrollPositionCurrent = opts.container["scroll" + scrollDirection]; /* GET */

                            /* $.position() values are relative to the container's currently viewable area (without taking into account the container's true dimensions
                               -- say, for example, if the container was not overflowing). Thus, the scroll end value is the sum of the child element's position *and*
                               the scroll container's current scroll position. */
                            scrollPositionEnd = (scrollPositionCurrent + $(element).position()[scrollDirection.toLowerCase()]) + scrollOffset; /* GET */
                        /* If a value other than a jQuery object or a raw DOM element was passed in, default to null so that this option is ignored. */
                        } else {
                            opts.container = null;
                        }
                    } else {
                        /* If the window itself is being scrolled -- not a containing element -- perform a live scroll position lookup using
                           the appropriate cached property names (which differ based on browser type). */
                        scrollPositionCurrent = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + scrollDirection]]; /* GET */
                        /* When scrolling the browser window, cache the alternate axis's current value since window.scrollTo() doesn't let us change only one value at a time. */
                        scrollPositionCurrentAlternate = Velocity.State.scrollAnchor[Velocity.State["scrollProperty" + (scrollDirection === "Left" ? "Top" : "Left")]]; /* GET */

                        /* Unlike $.position(), $.offset() values are relative to the browser window's true dimensions -- not merely its currently viewable area --
                           and therefore end values do not need to be compounded onto current values. */
                        scrollPositionEnd = $(element).offset()[scrollDirection.toLowerCase()] + scrollOffset; /* GET */
                    }

                    /* Since there's only one format that scroll's associated tweensContainer can take, we create it manually. */
                    tweensContainer = {
                        scroll: {
                            rootPropertyValue: false,
                            startValue: scrollPositionCurrent,
                            currentValue: scrollPositionCurrent,
                            endValue: scrollPositionEnd,
                            unitType: "",
                            easing: opts.easing,
                            scrollData: {
                                container: opts.container,
                                direction: scrollDirection,
                                alternateValue: scrollPositionCurrentAlternate
                            }
                        },
                        element: element
                    };

                    if (Velocity.debug) console.log("tweensContainer (scroll): ", tweensContainer.scroll, element);

                /******************************************
                   Tween Data Construction (for Reverse)
                ******************************************/

                /* Reverse acts like a "start" action in that a property map is animated toward. The only difference is
                   that the property map used for reverse is the inverse of the map used in the previous call. Thus, we manipulate
                   the previous call to construct our new map: use the previous map's end values as our new map's start values. Copy over all other data. */
                /* Note: Reverse can be directly called via the "reverse" parameter, or it can be indirectly triggered via the loop option. (Loops are composed of multiple reverses.) */
                /* Note: Reverse calls do not need to be consecutively chained onto a currently-animating element in order to operate on cached values;
                   there is no harm to reverse being called on a potentially stale data cache since reverse's behavior is simply defined
                   as reverting to the element's values as they were prior to the previous *Velocity* call. */
                } else if (action === "reverse") {
                    /* Abort if there is no prior animation data to reverse to. */
                    if (!Data(element).tweensContainer) {
                        /* Dequeue the element so that this queue entry releases itself immediately, allowing subsequent queue entries to run. */
                        $.dequeue(element, opts.queue);

                        return;
                    } else {
                        /*********************
                           Options Parsing
                        *********************/

                        /* If the element was hidden via the display option in the previous call,
                           revert display to "auto" prior to reversal so that the element is visible again. */
                        if (Data(element).opts.display === "none") {
                            Data(element).opts.display = "auto";
                        }

                        if (Data(element).opts.visibility === "hidden") {
                            Data(element).opts.visibility = "visible";
                        }

                        /* If the loop option was set in the previous call, disable it so that "reverse" calls aren't recursively generated.
                           Further, remove the previous call's callback options; typically, users do not want these to be refired. */
                        Data(element).opts.loop = false;
                        Data(element).opts.begin = null;
                        Data(element).opts.complete = null;

                        /* Since we're extending an opts object that has already been extended with the defaults options object,
                           we remove non-explicitly-defined properties that are auto-assigned values. */
                        if (!options.easing) {
                            delete opts.easing;
                        }

                        if (!options.duration) {
                            delete opts.duration;
                        }

                        /* The opts object used for reversal is an extension of the options object optionally passed into this
                           reverse call plus the options used in the previous Velocity call. */
                        opts = $.extend({}, Data(element).opts, opts);

                        /*************************************
                           Tweens Container Reconstruction
                        *************************************/

                        /* Create a deepy copy (indicated via the true flag) of the previous call's tweensContainer. */
                        var lastTweensContainer = $.extend(true, {}, Data(element).tweensContainer);

                        /* Manipulate the previous tweensContainer by replacing its end values and currentValues with its start values. */
                        for (var lastTween in lastTweensContainer) {
                            /* In addition to tween data, tweensContainers contain an element property that we ignore here. */
                            if (lastTween !== "element") {
                                var lastStartValue = lastTweensContainer[lastTween].startValue;

                                lastTweensContainer[lastTween].startValue = lastTweensContainer[lastTween].currentValue = lastTweensContainer[lastTween].endValue;
                                lastTweensContainer[lastTween].endValue = lastStartValue;

                                /* Easing is the only option that embeds into the individual tween data (since it can be defined on a per-property basis).
                                   Accordingly, every property's easing value must be updated when an options object is passed in with a reverse call.
                                   The side effect of this extensibility is that all per-property easing values are forcefully reset to the new value. */
                                if (!Type.isEmptyObject(options)) {
                                    lastTweensContainer[lastTween].easing = opts.easing;
                                }

                                if (Velocity.debug) console.log("reverse tweensContainer (" + lastTween + "): " + JSON.stringify(lastTweensContainer[lastTween]), element);
                            }
                        }

                        tweensContainer = lastTweensContainer;
                    }

                /*****************************************
                   Tween Data Construction (for Start)
                *****************************************/

                } else if (action === "start") {

                    /*************************
                        Value Transferring
                    *************************/

                    /* If this queue entry follows a previous Velocity-initiated queue entry *and* if this entry was created
                       while the element was in the process of being animated by Velocity, then this current call is safe to use
                       the end values from the prior call as its start values. Velocity attempts to perform this value transfer
                       process whenever possible in order to avoid requerying the DOM. */
                    /* If values aren't transferred from a prior call and start values were not forcefed by the user (more on this below),
                       then the DOM is queried for the element's current values as a last resort. */
                    /* Note: Conversely, animation reversal (and looping) *always* perform inter-call value transfers; they never requery the DOM. */
                    var lastTweensContainer;

                    /* The per-element isAnimating flag is used to indicate whether it's safe (i.e. the data isn't stale)
                       to transfer over end values to use as start values. If it's set to true and there is a previous
                       Velocity call to pull values from, do so. */
                    if (Data(element).tweensContainer && Data(element).isAnimating === true) {
                        lastTweensContainer = Data(element).tweensContainer;
                    }

                    /***************************
                       Tween Data Calculation
                    ***************************/

                    /* This function parses property data and defaults endValue, easing, and startValue as appropriate. */
                    /* Property map values can either take the form of 1) a single value representing the end value,
                       or 2) an array in the form of [ endValue, [, easing] [, startValue] ].
                       The optional third parameter is a forcefed startValue to be used instead of querying the DOM for
                       the element's current value. Read Velocity's docmentation to learn more about forcefeeding: VelocityJS.org/#forcefeeding */
                    function parsePropertyValue (valueData, skipResolvingEasing) {
                        var endValue = undefined,
                            easing = undefined,
                            startValue = undefined;

                        /* Handle the array format, which can be structured as one of three potential overloads:
                           A) [ endValue, easing, startValue ], B) [ endValue, easing ], or C) [ endValue, startValue ] */
                        if (Type.isArray(valueData)) {
                            /* endValue is always the first item in the array. Don't bother validating endValue's value now
                               since the ensuing property cycling logic does that. */
                            endValue = valueData[0];

                            /* Two-item array format: If the second item is a number, function, or hex string, treat it as a
                               start value since easings can only be non-hex strings or arrays. */
                            if ((!Type.isArray(valueData[1]) && /^[\d-]/.test(valueData[1])) || Type.isFunction(valueData[1]) || CSS.RegEx.isHex.test(valueData[1])) {
                                startValue = valueData[1];
                            /* Two or three-item array: If the second item is a non-hex string or an array, treat it as an easing. */
                            } else if ((Type.isString(valueData[1]) && !CSS.RegEx.isHex.test(valueData[1])) || Type.isArray(valueData[1])) {
                                easing = skipResolvingEasing ? valueData[1] : getEasing(valueData[1], opts.duration);

                                /* Don't bother validating startValue's value now since the ensuing property cycling logic inherently does that. */
                                if (valueData[2] !== undefined) {
                                    startValue = valueData[2];
                                }
                            }
                        /* Handle the single-value format. */
                        } else {
                            endValue = valueData;
                        }

                        /* Default to the call's easing if a per-property easing type was not defined. */
                        if (!skipResolvingEasing) {
                            easing = easing || opts.easing;
                        }

                        /* If functions were passed in as values, pass the function the current element as its context,
                           plus the element's index and the element set's size as arguments. Then, assign the returned value. */
                        if (Type.isFunction(endValue)) {
                            endValue = endValue.call(element, elementsIndex, elementsLength);
                        }

                        if (Type.isFunction(startValue)) {
                            startValue = startValue.call(element, elementsIndex, elementsLength);
                        }

                        /* Allow startValue to be left as undefined to indicate to the ensuing code that its value was not forcefed. */
                        return [ endValue || 0, easing, startValue ];
                    }

                    /* Cycle through each property in the map, looking for shorthand color properties (e.g. "color" as opposed to "colorRed"). Inject the corresponding
                       colorRed, colorGreen, and colorBlue RGB component tweens into the propertiesMap (which Velocity understands) and remove the shorthand property. */
                    $.each(propertiesMap, function(property, value) {
                        /* Find shorthand color properties that have been passed a hex string. */
                        if (RegExp("^" + CSS.Lists.colors.join("$|^") + "$").test(property)) {
                            /* Parse the value data for each shorthand. */
                            var valueData = parsePropertyValue(value, true),
                                endValue = valueData[0],
                                easing = valueData[1],
                                startValue = valueData[2];

                            if (CSS.RegEx.isHex.test(endValue)) {
                                /* Convert the hex strings into their RGB component arrays. */
                                var colorComponents = [ "Red", "Green", "Blue" ],
                                    endValueRGB = CSS.Values.hexToRgb(endValue),
                                    startValueRGB = startValue ? CSS.Values.hexToRgb(startValue) : undefined;

                                /* Inject the RGB component tweens into propertiesMap. */
                                for (var i = 0; i < colorComponents.length; i++) {
                                    var dataArray = [ endValueRGB[i] ];

                                    if (easing) {
                                        dataArray.push(easing);
                                    }

                                    if (startValueRGB !== undefined) {
                                        dataArray.push(startValueRGB[i]);
                                    }

                                    propertiesMap[property + colorComponents[i]] = dataArray;
                                }

                                /* Remove the intermediary shorthand property entry now that we've processed it. */
                                delete propertiesMap[property];
                            }
                        }
                    });

                    /* Create a tween out of each property, and append its associated data to tweensContainer. */
                    for (var property in propertiesMap) {

                        /**************************
                           Start Value Sourcing
                        **************************/

                        /* Parse out endValue, easing, and startValue from the property's data. */
                        var valueData = parsePropertyValue(propertiesMap[property]),
                            endValue = valueData[0],
                            easing = valueData[1],
                            startValue = valueData[2];

                        /* Now that the original property name's format has been used for the parsePropertyValue() lookup above,
                           we force the property to its camelCase styling to normalize it for manipulation. */
                        property = CSS.Names.camelCase(property);

                        /* In case this property is a hook, there are circumstances where we will intend to work on the hook's root property and not the hooked subproperty. */
                        var rootProperty = CSS.Hooks.getRoot(property),
                            rootPropertyValue = false;

                        /* Other than for the dummy tween property, properties that are not supported by the browser (and do not have an associated normalization) will
                           inherently produce no style changes when set, so they are skipped in order to decrease animation tick overhead.
                           Property support is determined via prefixCheck(), which returns a false flag when no supported is detected. */
                        /* Note: Since SVG elements have some of their properties directly applied as HTML attributes,
                           there is no way to check for their explicit browser support, and so we skip skip this check for them. */
                        if (!Data(element).isSVG && rootProperty !== "tween" && CSS.Names.prefixCheck(rootProperty)[1] === false && CSS.Normalizations.registered[rootProperty] === undefined) {
                            if (Velocity.debug) console.log("Skipping [" + rootProperty + "] due to a lack of browser support.");

                            continue;
                        }

                        /* If the display option is being set to a non-"none" (e.g. "block") and opacity (filter on IE<=8) is being
                           animated to an endValue of non-zero, the user's intention is to fade in from invisible, thus we forcefeed opacity
                           a startValue of 0 if its startValue hasn't already been sourced by value transferring or prior forcefeeding. */
                        if (((opts.display !== undefined && opts.display !== null && opts.display !== "none") || (opts.visibility !== undefined && opts.visibility !== "hidden")) && /opacity|filter/.test(property) && !startValue && endValue !== 0) {
                            startValue = 0;
                        }

                        /* If values have been transferred from the previous Velocity call, extract the endValue and rootPropertyValue
                           for all of the current call's properties that were *also* animated in the previous call. */
                        /* Note: Value transferring can optionally be disabled by the user via the _cacheValues option. */
                        if (opts._cacheValues && lastTweensContainer && lastTweensContainer[property]) {
                            if (startValue === undefined) {
                                startValue = lastTweensContainer[property].endValue + lastTweensContainer[property].unitType;
                            }

                            /* The previous call's rootPropertyValue is extracted from the element's data cache since that's the
                               instance of rootPropertyValue that gets freshly updated by the tweening process, whereas the rootPropertyValue
                               attached to the incoming lastTweensContainer is equal to the root property's value prior to any tweening. */
                            rootPropertyValue = Data(element).rootPropertyValueCache[rootProperty];
                        /* If values were not transferred from a previous Velocity call, query the DOM as needed. */
                        } else {
                            /* Handle hooked properties. */
                            if (CSS.Hooks.registered[property]) {
                               if (startValue === undefined) {
                                    rootPropertyValue = CSS.getPropertyValue(element, rootProperty); /* GET */
                                    /* Note: The following getPropertyValue() call does not actually trigger a DOM query;
                                       getPropertyValue() will extract the hook from rootPropertyValue. */
                                    startValue = CSS.getPropertyValue(element, property, rootPropertyValue);
                                /* If startValue is already defined via forcefeeding, do not query the DOM for the root property's value;
                                   just grab rootProperty's zero-value template from CSS.Hooks. This overwrites the element's actual
                                   root property value (if one is set), but this is acceptable since the primary reason users forcefeed is
                                   to avoid DOM queries, and thus we likewise avoid querying the DOM for the root property's value. */
                                } else {
                                    /* Grab this hook's zero-value template, e.g. "0px 0px 0px black". */
                                    rootPropertyValue = CSS.Hooks.templates[rootProperty][1];
                                }
                            /* Handle non-hooked properties that haven't already been defined via forcefeeding. */
                            } else if (startValue === undefined) {
                                startValue = CSS.getPropertyValue(element, property); /* GET */
                            }
                        }

                        /**************************
                           Value Data Extraction
                        **************************/

                        var separatedValue,
                            endValueUnitType,
                            startValueUnitType,
                            operator = false;

                        /* Separates a property value into its numeric value and its unit type. */
                        function separateValue (property, value) {
                            var unitType,
                                numericValue;

                            numericValue = (value || "0")
                                .toString()
                                .toLowerCase()
                                /* Match the unit type at the end of the value. */
                                .replace(/[%A-z]+$/, function(match) {
                                    /* Grab the unit type. */
                                    unitType = match;

                                    /* Strip the unit type off of value. */
                                    return "";
                                });

                            /* If no unit type was supplied, assign one that is appropriate for this property (e.g. "deg" for rotateZ or "px" for width). */
                            if (!unitType) {
                                unitType = CSS.Values.getUnitType(property);
                            }

                            return [ numericValue, unitType ];
                        }

                        /* Separate startValue. */
                        separatedValue = separateValue(property, startValue);
                        startValue = separatedValue[0];
                        startValueUnitType = separatedValue[1];

                        /* Separate endValue, and extract a value operator (e.g. "+=", "-=") if one exists. */
                        separatedValue = separateValue(property, endValue);
                        endValue = separatedValue[0].replace(/^([+-\/*])=/, function(match, subMatch) {
                            operator = subMatch;

                            /* Strip the operator off of the value. */
                            return "";
                        });
                        endValueUnitType = separatedValue[1];

                        /* Parse float values from endValue and startValue. Default to 0 if NaN is returned. */
                        startValue = parseFloat(startValue) || 0;
                        endValue = parseFloat(endValue) || 0;

                        /***************************************
                           Property-Specific Value Conversion
                        ***************************************/

                        /* Custom support for properties that don't actually accept the % unit type, but where pollyfilling is trivial and relatively foolproof. */
                        if (endValueUnitType === "%") {
                            /* A %-value fontSize/lineHeight is relative to the parent's fontSize (as opposed to the parent's dimensions),
                               which is identical to the em unit's behavior, so we piggyback off of that. */
                            if (/^(fontSize|lineHeight)$/.test(property)) {
                                /* Convert % into an em decimal value. */
                                endValue = endValue / 100;
                                endValueUnitType = "em";
                            /* For scaleX and scaleY, convert the value into its decimal format and strip off the unit type. */
                            } else if (/^scale/.test(property)) {
                                endValue = endValue / 100;
                                endValueUnitType = "";
                            /* For RGB components, take the defined percentage of 255 and strip off the unit type. */
                            } else if (/(Red|Green|Blue)$/i.test(property)) {
                                endValue = (endValue / 100) * 255;
                                endValueUnitType = "";
                            }
                        }

                        /***************************
                           Unit Ratio Calculation
                        ***************************/

                        /* When queried, the browser returns (most) CSS property values in pixels. Therefore, if an endValue with a unit type of
                           %, em, or rem is animated toward, startValue must be converted from pixels into the same unit type as endValue in order
                           for value manipulation logic (increment/decrement) to proceed. Further, if the startValue was forcefed or transferred
                           from a previous call, startValue may also not be in pixels. Unit conversion logic therefore consists of two steps:
                           1) Calculating the ratio of %/em/rem/vh/vw relative to pixels
                           2) Converting startValue into the same unit of measurement as endValue based on these ratios. */
                        /* Unit conversion ratios are calculated by inserting a sibling node next to the target node, copying over its position property,
                           setting values with the target unit type then comparing the returned pixel value. */
                        /* Note: Even if only one of these unit types is being animated, all unit ratios are calculated at once since the overhead
                           of batching the SETs and GETs together upfront outweights the potential overhead
                           of layout thrashing caused by re-querying for uncalculated ratios for subsequently-processed properties. */
                        /* Todo: Shift this logic into the calls' first tick instance so that it's synced with RAF. */
                        function calculateUnitRatios () {

                            /************************
                                Same Ratio Checks
                            ************************/

                            /* The properties below are used to determine whether the element differs sufficiently from this call's
                               previously iterated element to also differ in its unit conversion ratios. If the properties match up with those
                               of the prior element, the prior element's conversion ratios are used. Like most optimizations in Velocity,
                               this is done to minimize DOM querying. */
                            var sameRatioIndicators = {
                                    myParent: element.parentNode || document.body, /* GET */
                                    position: CSS.getPropertyValue(element, "position"), /* GET */
                                    fontSize: CSS.getPropertyValue(element, "fontSize") /* GET */
                                },
                                /* Determine if the same % ratio can be used. % is based on the element's position value and its parent's width and height dimensions. */
                                samePercentRatio = ((sameRatioIndicators.position === callUnitConversionData.lastPosition) && (sameRatioIndicators.myParent === callUnitConversionData.lastParent)),
                                /* Determine if the same em ratio can be used. em is relative to the element's fontSize. */
                                sameEmRatio = (sameRatioIndicators.fontSize === callUnitConversionData.lastFontSize);

                            /* Store these ratio indicators call-wide for the next element to compare against. */
                            callUnitConversionData.lastParent = sameRatioIndicators.myParent;
                            callUnitConversionData.lastPosition = sameRatioIndicators.position;
                            callUnitConversionData.lastFontSize = sameRatioIndicators.fontSize;

                            /***************************
                               Element-Specific Units
                            ***************************/

                            /* Note: IE8 rounds to the nearest pixel when returning CSS values, thus we perform conversions using a measurement
                               of 100 (instead of 1) to give our ratios a precision of at least 2 decimal values. */
                            var measurement = 100,
                                unitRatios = {};

                            if (!sameEmRatio || !samePercentRatio) {
                                var dummy = Data(element).isSVG ? document.createElementNS("http://www.w3.org/2000/svg", "rect") : document.createElement("div");

                                Velocity.init(dummy);
                                sameRatioIndicators.myParent.appendChild(dummy);

                                /* To accurately and consistently calculate conversion ratios, the element's cascaded overflow and box-sizing are stripped.
                                   Similarly, since width/height can be artificially constrained by their min-/max- equivalents, these are controlled for as well. */
                                /* Note: Overflow must be also be controlled for per-axis since the overflow property overwrites its per-axis values. */
                                $.each([ "overflow", "overflowX", "overflowY" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, "hidden");
                                });
                                Velocity.CSS.setPropertyValue(dummy, "position", sameRatioIndicators.position);
                                Velocity.CSS.setPropertyValue(dummy, "fontSize", sameRatioIndicators.fontSize);
                                Velocity.CSS.setPropertyValue(dummy, "boxSizing", "content-box");

                                /* width and height act as our proxy properties for measuring the horizontal and vertical % ratios. */
                                $.each([ "minWidth", "maxWidth", "width", "minHeight", "maxHeight", "height" ], function(i, property) {
                                    Velocity.CSS.setPropertyValue(dummy, property, measurement + "%");
                                });
                                /* paddingLeft arbitrarily acts as our proxy property for the em ratio. */
                                Velocity.CSS.setPropertyValue(dummy, "paddingLeft", measurement + "em");

                                /* Divide the returned value by the measurement to get the ratio between 1% and 1px. Default to 1 since working with 0 can produce Infinite. */
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth = (parseFloat(CSS.getPropertyValue(dummy, "width", null, true)) || 1) / measurement; /* GET */
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight = (parseFloat(CSS.getPropertyValue(dummy, "height", null, true)) || 1) / measurement; /* GET */
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx = (parseFloat(CSS.getPropertyValue(dummy, "paddingLeft")) || 1) / measurement; /* GET */

                                sameRatioIndicators.myParent.removeChild(dummy);
                            } else {
                                unitRatios.emToPx = callUnitConversionData.lastEmToPx;
                                unitRatios.percentToPxWidth = callUnitConversionData.lastPercentToPxWidth;
                                unitRatios.percentToPxHeight = callUnitConversionData.lastPercentToPxHeight;
                            }

                            /***************************
                               Element-Agnostic Units
                            ***************************/

                            /* Whereas % and em ratios are determined on a per-element basis, the rem unit only needs to be checked
                               once per call since it's exclusively dependant upon document.body's fontSize. If this is the first time
                               that calculateUnitRatios() is being run during this call, remToPx will still be set to its default value of null,
                               so we calculate it now. */
                            if (callUnitConversionData.remToPx === null) {
                                /* Default to browsers' default fontSize of 16px in the case of 0. */
                                callUnitConversionData.remToPx = parseFloat(CSS.getPropertyValue(document.body, "fontSize")) || 16; /* GET */
                            }

                            /* Similarly, viewport units are %-relative to the window's inner dimensions. */
                            if (callUnitConversionData.vwToPx === null) {
                                callUnitConversionData.vwToPx = parseFloat(window.innerWidth) / 100; /* GET */
                                callUnitConversionData.vhToPx = parseFloat(window.innerHeight) / 100; /* GET */
                            }

                            unitRatios.remToPx = callUnitConversionData.remToPx;
                            unitRatios.vwToPx = callUnitConversionData.vwToPx;
                            unitRatios.vhToPx = callUnitConversionData.vhToPx;

                            if (Velocity.debug >= 1) console.log("Unit ratios: " + JSON.stringify(unitRatios), element);

                            return unitRatios;
                        }

                        /********************
                           Unit Conversion
                        ********************/

                        /* The * and / operators, which are not passed in with an associated unit, inherently use startValue's unit. Skip value and unit conversion. */
                        if (/[\/*]/.test(operator)) {
                            endValueUnitType = startValueUnitType;
                        /* If startValue and endValue differ in unit type, convert startValue into the same unit type as endValue so that if endValueUnitType
                           is a relative unit (%, em, rem), the values set during tweening will continue to be accurately relative even if the metrics they depend
                           on are dynamically changing during the course of the animation. Conversely, if we always normalized into px and used px for setting values, the px ratio
                           would become stale if the original unit being animated toward was relative and the underlying metrics change during the animation. */
                        /* Since 0 is 0 in any unit type, no conversion is necessary when startValue is 0 -- we just start at 0 with endValueUnitType. */
                        } else if ((startValueUnitType !== endValueUnitType) && startValue !== 0) {
                            /* Unit conversion is also skipped when endValue is 0, but *startValueUnitType* must be used for tween values to remain accurate. */
                            /* Note: Skipping unit conversion here means that if endValueUnitType was originally a relative unit, the animation won't relatively
                               match the underlying metrics if they change, but this is acceptable since we're animating toward invisibility instead of toward visibility,
                               which remains past the point of the animation's completion. */
                            if (endValue === 0) {
                                endValueUnitType = startValueUnitType;
                            } else {
                                /* By this point, we cannot avoid unit conversion (it's undesirable since it causes layout thrashing).
                                   If we haven't already, we trigger calculateUnitRatios(), which runs once per element per call. */
                                elementUnitConversionData = elementUnitConversionData || calculateUnitRatios();

                                /* The following RegEx matches CSS properties that have their % values measured relative to the x-axis. */
                                /* Note: W3C spec mandates that all of margin and padding's properties (even top and bottom) are %-relative to the *width* of the parent element. */
                                var axis = (/margin|padding|left|right|width|text|word|letter/i.test(property) || /X$/.test(property) || property === "x") ? "x" : "y";

                                /* In order to avoid generating n^2 bespoke conversion functions, unit conversion is a two-step process:
                                   1) Convert startValue into pixels. 2) Convert this new pixel value into endValue's unit type. */
                                switch (startValueUnitType) {
                                    case "%":
                                        /* Note: translateX and translateY are the only properties that are %-relative to an element's own dimensions -- not its parent's dimensions.
                                           Velocity does not include a special conversion process to account for this behavior. Therefore, animating translateX/Y from a % value
                                           to a non-% value will produce an incorrect start value. Fortunately, this sort of cross-unit conversion is rarely done by users in practice. */
                                        startValue *= (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* px acts as our midpoint in the unit conversion process; do nothing. */
                                        break;

                                    default:
                                        startValue *= elementUnitConversionData[startValueUnitType + "ToPx"];
                                }

                                /* Invert the px ratios to convert into to the target unit. */
                                switch (endValueUnitType) {
                                    case "%":
                                        startValue *= 1 / (axis === "x" ? elementUnitConversionData.percentToPxWidth : elementUnitConversionData.percentToPxHeight);
                                        break;

                                    case "px":
                                        /* startValue is already in px, do nothing; we're done. */
                                        break;

                                    default:
                                        startValue *= 1 / elementUnitConversionData[endValueUnitType + "ToPx"];
                                }
                            }
                        }

                        /*********************
                           Relative Values
                        *********************/

                        /* Operator logic must be performed last since it requires unit-normalized start and end values. */
                        /* Note: Relative *percent values* do not behave how most people think; while one would expect "+=50%"
                           to increase the property 1.5x its current value, it in fact increases the percent units in absolute terms:
                           50 points is added on top of the current % value. */
                        switch (operator) {
                            case "+":
                                endValue = startValue + endValue;
                                break;

                            case "-":
                                endValue = startValue - endValue;
                                break;

                            case "*":
                                endValue = startValue * endValue;
                                break;

                            case "/":
                                endValue = startValue / endValue;
                                break;
                        }

                        /**************************
                           tweensContainer Push
                        **************************/

                        /* Construct the per-property tween object, and push it to the element's tweensContainer. */
                        tweensContainer[property] = {
                            rootPropertyValue: rootPropertyValue,
                            startValue: startValue,
                            currentValue: startValue,
                            endValue: endValue,
                            unitType: endValueUnitType,
                            easing: easing
                        };

                        if (Velocity.debug) console.log("tweensContainer (" + property + "): " + JSON.stringify(tweensContainer[property]), element);
                    }

                    /* Along with its property data, store a reference to the element itself onto tweensContainer. */
                    tweensContainer.element = element;
                }

                /*****************
                    Call Push
                *****************/

                /* Note: tweensContainer can be empty if all of the properties in this call's property map were skipped due to not
                   being supported by the browser. The element property is used for checking that the tweensContainer has been appended to. */
                if (tweensContainer.element) {
                    /* Apply the "velocity-animating" indicator class. */
                    CSS.Values.addClass(element, "velocity-animating");

                    /* The call array houses the tweensContainers for each element being animated in the current call. */
                    call.push(tweensContainer);

                    /* Store the tweensContainer and options if we're working on the default effects queue, so that they can be used by the reverse command. */
                    if (opts.queue === "") {
                        Data(element).tweensContainer = tweensContainer;
                        Data(element).opts = opts;
                    }

                    /* Switch on the element's animating flag. */
                    Data(element).isAnimating = true;

                    /* Once the final element in this call's element set has been processed, push the call array onto
                       Velocity.State.calls for the animation tick to immediately begin processing. */
                    if (elementsIndex === elementsLength - 1) {
                        /* Add the current call plus its associated metadata (the element set and the call's options) onto the global call container.
                           Anything on this call container is subjected to tick() processing. */
                        Velocity.State.calls.push([ call, elements, opts, null, promiseData.resolver ]);

                        /* If the animation tick isn't running, start it. (Velocity shuts it off when there are no active calls to process.) */
                        if (Velocity.State.isTicking === false) {
                            Velocity.State.isTicking = true;

                            /* Start the tick loop. */
                            tick();
                        }
                    } else {
                        elementsIndex++;
                    }
                }
            }

            /* When the queue option is set to false, the call skips the element's queue and fires immediately. */
            if (opts.queue === false) {
                /* Since this buildQueue call doesn't respect the element's existing queue (which is where a delay option would have been appended),
                   we manually inject the delay property here with an explicit setTimeout. */
                if (opts.delay) {
                    setTimeout(buildQueue, opts.delay);
                } else {
                    buildQueue();
                }
            /* Otherwise, the call undergoes element queueing as normal. */
            /* Note: To interoperate with jQuery, Velocity uses jQuery's own $.queue() stack for queuing logic. */
            } else {
                $.queue(element, opts.queue, function(next, clearQueue) {
                    /* If the clearQueue flag was passed in by the stop command, resolve this call's promise. (Promises can only be resolved once,
                       so it's fine if this is repeatedly triggered for each element in the associated call.) */
                    if (clearQueue === true) {
                        if (promiseData.promise) {
                            promiseData.resolver(elements);
                        }

                        /* Do not continue with animation queueing. */
                        return true;
                    }

                    /* This flag indicates to the upcoming completeCall() function that this queue entry was initiated by Velocity.
                       See completeCall() for further details. */
                    Velocity.velocityQueueEntryFlag = true;

                    buildQueue(next);
                });
            }

            /*********************
                Auto-Dequeuing
            *********************/

            /* As per jQuery's $.queue() behavior, to fire the first non-custom-queue entry on an element, the element
               must be dequeued if its queue stack consists *solely* of the current call. (This can be determined by checking
               for the "inprogress" item that jQuery prepends to active queue stack arrays.) Regardless, whenever the element's
               queue is further appended with additional items -- including $.delay()'s or even $.animate() calls, the queue's
               first entry is automatically fired. This behavior contrasts that of custom queues, which never auto-fire. */
            /* Note: When an element set is being subjected to a non-parallel Velocity call, the animation will not begin until
               each one of the elements in the set has reached the end of its individually pre-existing queue chain. */
            /* Note: Unfortunately, most people don't fully grasp jQuery's powerful, yet quirky, $.queue() function.
               Lean more here: http://stackoverflow.com/questions/1058158/can-somebody-explain-jquery-queue-to-me */
            if ((opts.queue === "" || opts.queue === "fx") && $.queue(element)[0] !== "inprogress") {
                $.dequeue(element);
            }
        }

        /**************************
           Element Set Iteration
        **************************/

        /* If the "nodeType" property exists on the elements variable, we're animating a single element.
           Place it in an array so that $.each() can iterate over it. */
        $.each(elements, function(i, element) {
            /* Ensure each element in a set has a nodeType (is a real element) to avoid throwing errors. */
            if (Type.isNode(element)) {
                processElement.call(element);
            }
        });

        /******************
           Option: Loop
        ******************/

        /* The loop option accepts an integer indicating how many times the element should loop between the values in the
           current call's properties map and the element's property values prior to this call. */
        /* Note: The loop option's logic is performed here -- after element processing -- because the current call needs
           to undergo its queue insertion prior to the loop option generating its series of constituent "reverse" calls,
           which chain after the current call. Two reverse calls (two "alternations") constitute one loop. */
        var opts = $.extend({}, Velocity.defaults, options),
            reverseCallsCount;

        opts.loop = parseInt(opts.loop);
        reverseCallsCount = (opts.loop * 2) - 1;

        if (opts.loop) {
            /* Double the loop count to convert it into its appropriate number of "reverse" calls.
               Subtract 1 from the resulting value since the current call is included in the total alternation count. */
            for (var x = 0; x < reverseCallsCount; x++) {
                /* Since the logic for the reverse action occurs inside Queueing and therefore this call's options object
                   isn't parsed until then as well, the current call's delay option must be explicitly passed into the reverse
                   call so that the delay logic that occurs inside *Pre-Queueing* can process it. */
                var reverseOptions = {
                    delay: opts.delay,
                    progress: opts.progress
                };

                /* If a complete callback was passed into this call, transfer it to the loop redirect's final "reverse" call
                   so that it's triggered when the entire redirect is complete (and not when the very first animation is complete). */
                if (x === reverseCallsCount - 1) {
                    reverseOptions.display = opts.display;
                    reverseOptions.visibility = opts.visibility;
                    reverseOptions.complete = opts.complete;
                }

                animate(elements, "reverse", reverseOptions);
            }
        }

        /***************
            Chaining
        ***************/

        /* Return the elements back to the call chain, with wrapped elements taking precedence in case Velocity was called via the $.fn. extension. */
        return getChain();
    };

    /* Turn Velocity into the animation function, extended with the pre-existing Velocity object. */
    Velocity = $.extend(animate, Velocity);
    /* For legacy support, also expose the literal animate method. */
    Velocity.animate = animate;

    /**************
        Timing
    **************/

    /* Ticker function. */
    var ticker = window.requestAnimationFrame || rAFShim;

    /* Inactive browser tabs pause rAF, which results in all active animations immediately sprinting to their completion states when the tab refocuses.
       To get around this, we dynamically switch rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus. We skip this for mobile
       devices to avoid wasting battery power on inactive tabs. */
    /* Note: Tab focus detection doesn't work on older versions of IE, but that's okay since they don't support rAF to begin with. */
    if (!Velocity.State.isMobile && document.hidden !== undefined) {
        document.addEventListener("visibilitychange", function() {
            /* Reassign the rAF function (which the global tick() function uses) based on the tab's focus state. */
            if (document.hidden) {
                ticker = function(callback) {
                    /* The tick function needs a truthy first argument in order to pass its internal timestamp check. */
                    return setTimeout(function() { callback(true) }, 16);
                };

                /* The rAF loop has been paused by the browser, so we manually restart the tick. */
                tick();
            } else {
                ticker = window.requestAnimationFrame || rAFShim;
            }
        });
    }

    /************
        Tick
    ************/

    /* Note: All calls to Velocity are pushed to the Velocity.State.calls array, which is fully iterated through upon each tick. */
    function tick (timestamp) {
        /* An empty timestamp argument indicates that this is the first tick occurence since ticking was turned on.
           We leverage this metadata to fully ignore the first tick pass since RAF's initial pass is fired whenever
           the browser's next tick sync time occurs, which results in the first elements subjected to Velocity
           calls being animated out of sync with any elements animated immediately thereafter. In short, we ignore
           the first RAF tick pass so that elements being immediately consecutively animated -- instead of simultaneously animated
           by the same Velocity call -- are properly batched into the same initial RAF tick and consequently remain in sync thereafter. */
        if (timestamp) {
            /* We ignore RAF's high resolution timestamp since it can be significantly offset when the browser is
               under high stress; we opt for choppiness over allowing the browser to drop huge chunks of frames. */
            var timeCurrent = (new Date).getTime();

            /********************
               Call Iteration
            ********************/

            var callsLength = Velocity.State.calls.length;

            /* To speed up iterating over this array, it is compacted (falsey items -- calls that have completed -- are removed)
               when its length has ballooned to a point that can impact tick performance. This only becomes necessary when animation
               has been continuous with many elements over a long period of time; whenever all active calls are completed, completeCall() clears Velocity.State.calls. */
            if (callsLength > 10000) {
                Velocity.State.calls = compactSparseArray(Velocity.State.calls);
            }

            /* Iterate through each active call. */
            for (var i = 0; i < callsLength; i++) {
                /* When a Velocity call is completed, its Velocity.State.calls entry is set to false. Continue on to the next call. */
                if (!Velocity.State.calls[i]) {
                    continue;
                }

                /************************
                   Call-Wide Variables
                ************************/

                var callContainer = Velocity.State.calls[i],
                    call = callContainer[0],
                    opts = callContainer[2],
                    timeStart = callContainer[3],
                    firstTick = !!timeStart,
                    tweenDummyValue = null;

                /* If timeStart is undefined, then this is the first time that this call has been processed by tick().
                   We assign timeStart now so that its value is as close to the real animation start time as possible.
                   (Conversely, had timeStart been defined when this call was added to Velocity.State.calls, the delay
                   between that time and now would cause the first few frames of the tween to be skipped since
                   percentComplete is calculated relative to timeStart.) */
                /* Further, subtract 16ms (the approximate resolution of RAF) from the current time value so that the
                   first tick iteration isn't wasted by animating at 0% tween completion, which would produce the
                   same style value as the element's current value. */
                if (!timeStart) {
                    timeStart = Velocity.State.calls[i][3] = timeCurrent - 16;
                }

                /* The tween's completion percentage is relative to the tween's start time, not the tween's start value
                   (which would result in unpredictable tween durations since JavaScript's timers are not particularly accurate).
                   Accordingly, we ensure that percentComplete does not exceed 1. */
                var percentComplete = Math.min((timeCurrent - timeStart) / opts.duration, 1);

                /**********************
                   Element Iteration
                **********************/

                /* For every call, iterate through each of the elements in its set. */
                for (var j = 0, callLength = call.length; j < callLength; j++) {
                    var tweensContainer = call[j],
                        element = tweensContainer.element;

                    /* Check to see if this element has been deleted midway through the animation by checking for the
                       continued existence of its data cache. If it's gone, skip animating this element. */
                    if (!Data(element)) {
                        continue;
                    }

                    var transformPropertyExists = false;

                    /**********************************
                       Display & Visibility Toggling
                    **********************************/

                    /* If the display option is set to non-"none", set it upfront so that the element can become visible before tweening begins.
                       (Otherwise, display's "none" value is set in completeCall() once the animation has completed.) */
                    if (opts.display !== undefined && opts.display !== null && opts.display !== "none") {
                        if (opts.display === "flex") {
                            var flexValues = [ "-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex" ];

                            $.each(flexValues, function(i, flexValue) {
                                CSS.setPropertyValue(element, "display", flexValue);
                            });
                        }

                        CSS.setPropertyValue(element, "display", opts.display);
                    }

                    /* Same goes with the visibility option, but its "none" equivalent is "hidden". */
                    if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                        CSS.setPropertyValue(element, "visibility", opts.visibility);
                    }

                    /************************
                       Property Iteration
                    ************************/

                    /* For every element, iterate through each property. */
                    for (var property in tweensContainer) {
                        /* Note: In addition to property tween data, tweensContainer contains a reference to its associated element. */
                        if (property !== "element") {
                            var tween = tweensContainer[property],
                                currentValue,
                                /* Easing can either be a pre-genereated function or a string that references a pre-registered easing
                                   on the Velocity.Easings object. In either case, return the appropriate easing *function*. */
                                easing = Type.isString(tween.easing) ? Velocity.Easings[tween.easing] : tween.easing;

                            /******************************
                               Current Value Calculation
                            ******************************/

                            /* If this is the last tick pass (if we've reached 100% completion for this tween),
                               ensure that currentValue is explicitly set to its target endValue so that it's not subjected to any rounding. */
                            if (percentComplete === 1) {
                                currentValue = tween.endValue;
                            /* Otherwise, calculate currentValue based on the current delta from startValue. */
                            } else {
                                var tweenDelta = tween.endValue - tween.startValue;
                                currentValue = tween.startValue + (tweenDelta * easing(percentComplete, opts, tweenDelta));

                                /* If no value change is occurring, don't proceed with DOM updating. */
                                if (!firstTick && (currentValue === tween.currentValue)) {
                                    continue;
                                }
                            }

                            tween.currentValue = currentValue;

                            /* If we're tweening a fake 'tween' property in order to log transition values, update the one-per-call variable so that
                               it can be passed into the progress callback. */
                            if (property === "tween") {
                                tweenDummyValue = currentValue;
                            } else {
                                /******************
                                   Hooks: Part I
                                ******************/

                                /* For hooked properties, the newly-updated rootPropertyValueCache is cached onto the element so that it can be used
                                   for subsequent hooks in this call that are associated with the same root property. If we didn't cache the updated
                                   rootPropertyValue, each subsequent update to the root property in this tick pass would reset the previous hook's
                                   updates to rootPropertyValue prior to injection. A nice performance byproduct of rootPropertyValue caching is that
                                   subsequently chained animations using the same hookRoot but a different hook can use this cached rootPropertyValue. */
                                if (CSS.Hooks.registered[property]) {
                                    var hookRoot = CSS.Hooks.getRoot(property),
                                        rootPropertyValueCache = Data(element).rootPropertyValueCache[hookRoot];

                                    if (rootPropertyValueCache) {
                                        tween.rootPropertyValue = rootPropertyValueCache;
                                    }
                                }

                                /*****************
                                    DOM Update
                                *****************/

                                /* setPropertyValue() returns an array of the property name and property value post any normalization that may have been performed. */
                                /* Note: To solve an IE<=8 positioning bug, the unit type is dropped when setting a property value of 0. */
                                var adjustedSetData = CSS.setPropertyValue(element, /* SET */
                                                                           property,
                                                                           tween.currentValue + (parseFloat(currentValue) === 0 ? "" : tween.unitType),
                                                                           tween.rootPropertyValue,
                                                                           tween.scrollData);

                                /*******************
                                   Hooks: Part II
                                *******************/

                                /* Now that we have the hook's updated rootPropertyValue (the post-processed value provided by adjustedSetData), cache it onto the element. */
                                if (CSS.Hooks.registered[property]) {
                                    /* Since adjustedSetData contains normalized data ready for DOM updating, the rootPropertyValue needs to be re-extracted from its normalized form. ?? */
                                    if (CSS.Normalizations.registered[hookRoot]) {
                                        Data(element).rootPropertyValueCache[hookRoot] = CSS.Normalizations.registered[hookRoot]("extract", null, adjustedSetData[1]);
                                    } else {
                                        Data(element).rootPropertyValueCache[hookRoot] = adjustedSetData[1];
                                    }
                                }

                                /***************
                                   Transforms
                                ***************/

                                /* Flag whether a transform property is being animated so that flushTransformCache() can be triggered once this tick pass is complete. */
                                if (adjustedSetData[0] === "transform") {
                                    transformPropertyExists = true;
                                }

                            }
                        }
                    }

                    /****************
                        mobileHA
                    ****************/

                    /* If mobileHA is enabled, set the translate3d transform to null to force hardware acceleration.
                       It's safe to override this property since Velocity doesn't actually support its animation (hooks are used in its place). */
                    if (opts.mobileHA) {
                        /* Don't set the null transform hack if we've already done so. */
                        if (Data(element).transformCache.translate3d === undefined) {
                            /* All entries on the transformCache object are later concatenated into a single transform string via flushTransformCache(). */
                            Data(element).transformCache.translate3d = "(0px, 0px, 0px)";

                            transformPropertyExists = true;
                        }
                    }

                    if (transformPropertyExists) {
                        CSS.flushTransformCache(element);
                    }
                }

                /* The non-"none" display value is only applied to an element once -- when its associated call is first ticked through.
                   Accordingly, it's set to false so that it isn't re-processed by this call in the next tick. */
                if (opts.display !== undefined && opts.display !== "none") {
                    Velocity.State.calls[i][2].display = false;
                }
                if (opts.visibility !== undefined && opts.visibility !== "hidden") {
                    Velocity.State.calls[i][2].visibility = false;
                }

                /* Pass the elements and the timing data (percentComplete, msRemaining, timeStart, tweenDummyValue) into the progress callback. */
                if (opts.progress) {
                    opts.progress.call(callContainer[1],
                                       callContainer[1],
                                       percentComplete,
                                       Math.max(0, (timeStart + opts.duration) - timeCurrent),
                                       timeStart,
                                       tweenDummyValue);
                }

                /* If this call has finished tweening, pass its index to completeCall() to handle call cleanup. */
                if (percentComplete === 1) {
                    completeCall(i);
                }
            }
        }

        /* Note: completeCall() sets the isTicking flag to false when the last call on Velocity.State.calls has completed. */
        if (Velocity.State.isTicking) {
            ticker(tick);
        }
    }

    /**********************
        Call Completion
    **********************/

    /* Note: Unlike tick(), which processes all active calls at once, call completion is handled on a per-call basis. */
    function completeCall (callIndex, isStopped) {
        /* Ensure the call exists. */
        if (!Velocity.State.calls[callIndex]) {
            return false;
        }

        /* Pull the metadata from the call. */
        var call = Velocity.State.calls[callIndex][0],
            elements = Velocity.State.calls[callIndex][1],
            opts = Velocity.State.calls[callIndex][2],
            resolver = Velocity.State.calls[callIndex][4];

        var remainingCallsExist = false;

        /*************************
           Element Finalization
        *************************/

        for (var i = 0, callLength = call.length; i < callLength; i++) {
            var element = call[i].element;

            /* If the user set display to "none" (intending to hide the element), set it now that the animation has completed. */
            /* Note: display:none isn't set when calls are manually stopped (via Velocity("stop"). */
            /* Note: Display gets ignored with "reverse" calls and infinite loops, since this behavior would be undesirable. */
            if (!isStopped && !opts.loop) {
                if (opts.display === "none") {
                    CSS.setPropertyValue(element, "display", opts.display);
                }

                if (opts.visibility === "hidden") {
                    CSS.setPropertyValue(element, "visibility", opts.visibility);
                }
            }

            /* If the element's queue is empty (if only the "inprogress" item is left at position 0) or if its queue is about to run
               a non-Velocity-initiated entry, turn off the isAnimating flag. A non-Velocity-initiatied queue entry's logic might alter
               an element's CSS values and thereby cause Velocity's cached value data to go stale. To detect if a queue entry was initiated by Velocity,
               we check for the existence of our special Velocity.queueEntryFlag declaration, which minifiers won't rename since the flag
               is assigned to jQuery's global $ object and thus exists out of Velocity's own scope. */
            if (opts.loop !== true && ($.queue(element)[1] === undefined || !/\.velocityQueueEntryFlag/i.test($.queue(element)[1]))) {
                /* The element may have been deleted. Ensure that its data cache still exists before acting on it. */
                if (Data(element)) {
                    Data(element).isAnimating = false;
                    /* Clear the element's rootPropertyValueCache, which will become stale. */
                    Data(element).rootPropertyValueCache = {};

                    var transformHAPropertyExists = false;
                    /* If any 3D transform subproperty is at its default value (regardless of unit type), remove it. */
                    $.each(CSS.Lists.transforms3D, function(i, transformName) {
                        var defaultValue = /^scale/.test(transformName) ? 1 : 0,
                            currentValue = Data(element).transformCache[transformName];

                        if (Data(element).transformCache[transformName] !== undefined && new RegExp("^\\(" + defaultValue + "[^.]").test(currentValue)) {
                            transformHAPropertyExists = true;

                            delete Data(element).transformCache[transformName];
                        }
                    });

                    /* Mobile devices have hardware acceleration removed at the end of the animation in order to avoid hogging the GPU's memory. */
                    if (opts.mobileHA) {
                        transformHAPropertyExists = true;
                        delete Data(element).transformCache.translate3d;
                    }

                    /* Flush the subproperty removals to the DOM. */
                    if (transformHAPropertyExists) {
                        CSS.flushTransformCache(element);
                    }

                    /* Remove the "velocity-animating" indicator class. */
                    CSS.Values.removeClass(element, "velocity-animating");
                }
            }

            /*********************
               Option: Complete
            *********************/

            /* Complete is fired once per call (not once per element) and is passed the full raw DOM element set as both its context and its first argument. */
            /* Note: Callbacks aren't fired when calls are manually stopped (via Velocity("stop"). */
            if (!isStopped && opts.complete && !opts.loop && (i === callLength - 1)) {
                /* We throw callbacks in a setTimeout so that thrown errors don't halt the execution of Velocity itself. */
                try {
                    opts.complete.call(elements, elements);
                } catch (error) {
                    setTimeout(function() { throw error; }, 1);
                }
            }

            /**********************
               Promise Resolving
            **********************/

            /* Note: Infinite loops don't return promises. */
            if (resolver && opts.loop !== true) {
                resolver(elements);
            }

            /****************************
               Option: Loop (Infinite)
            ****************************/

            if (Data(element) && opts.loop === true && !isStopped) {
                /* If a rotateX/Y/Z property is being animated to 360 deg with loop:true, swap tween start/end values to enable
                   continuous iterative rotation looping. (Otherise, the element would just rotate back and forth.) */
                $.each(Data(element).tweensContainer, function(propertyName, tweenContainer) {
                    if (/^rotate/.test(propertyName) && parseFloat(tweenContainer.endValue) === 360) {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 360;
                    }

                    if (/^backgroundPosition/.test(propertyName) && parseFloat(tweenContainer.endValue) === 100 && tweenContainer.unitType === "%") {
                        tweenContainer.endValue = 0;
                        tweenContainer.startValue = 100;
                    }
                });

                Velocity(element, "reverse", { loop: true, delay: opts.delay });
            }

            /***************
               Dequeueing
            ***************/

            /* Fire the next call in the queue so long as this call's queue wasn't set to false (to trigger a parallel animation),
               which would have already caused the next call to fire. Note: Even if the end of the animation queue has been reached,
               $.dequeue() must still be called in order to completely clear jQuery's animation queue. */
            if (opts.queue !== false) {
                $.dequeue(element, opts.queue);
            }
        }

        /************************
           Calls Array Cleanup
        ************************/

        /* Since this call is complete, set it to false so that the rAF tick skips it. This array is later compacted via compactSparseArray().
          (For performance reasons, the call is set to false instead of being deleted from the array: http://www.html5rocks.com/en/tutorials/speed/v8/) */
        Velocity.State.calls[callIndex] = false;

        /* Iterate through the calls array to determine if this was the final in-progress animation.
           If so, set a flag to end ticking and clear the calls array. */
        for (var j = 0, callsLength = Velocity.State.calls.length; j < callsLength; j++) {
            if (Velocity.State.calls[j] !== false) {
                remainingCallsExist = true;

                break;
            }
        }

        if (remainingCallsExist === false) {
            /* tick() will detect this flag upon its next iteration and subsequently turn itself off. */
            Velocity.State.isTicking = false;

            /* Clear the calls array so that its length is reset. */
            delete Velocity.State.calls;
            Velocity.State.calls = [];
        }
    }

    /******************
        Frameworks
    ******************/

    /* Both jQuery and Zepto allow their $.fn object to be extended to allow wrapped elements to be subjected to plugin calls.
       If either framework is loaded, register a "velocity" extension pointing to Velocity's core animate() method.  Velocity
       also registers itself onto a global container (window.jQuery || window.Zepto || window) so that certain features are
       accessible beyond just a per-element scope. This master object contains an .animate() method, which is later assigned to $.fn
       (if jQuery or Zepto are present). Accordingly, Velocity can both act on wrapped DOM elements and stand alone for targeting raw DOM elements. */
    global.Velocity = Velocity;

    if (global !== window) {
        /* Assign the element function to Velocity's core animate() method. */
        global.fn.velocity = animate;
        /* Assign the object function's defaults to Velocity's global defaults object. */
        global.fn.velocity.defaults = Velocity.defaults;
    }

    /***********************
       Packaged Redirects
    ***********************/

    /* slideUp, slideDown */
    $.each([ "Down", "Up" ], function(i, direction) {
        Velocity.Redirects["slide" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                begin = opts.begin,
                complete = opts.complete,
                computedValues = { height: "", marginTop: "", marginBottom: "", paddingTop: "", paddingBottom: "" },
                inlineValues = {};

            if (opts.display === undefined) {
                /* Show the element before slideDown begins and hide the element after slideUp completes. */
                /* Note: Inline elements cannot have dimensions animated, so they're reverted to inline-block. */
                opts.display = (direction === "Down" ? (Velocity.CSS.Values.getDisplayType(element) === "inline" ? "inline-block" : "block") : "none");
            }

            opts.begin = function() {
                /* If the user passed in a begin callback, fire it now. */
                begin && begin.call(elements, elements);

                /* Cache the elements' original vertical dimensional property values so that we can animate back to them. */
                for (var property in computedValues) {
                    inlineValues[property] = element.style[property];

                    /* For slideDown, use forcefeeding to animate all vertical properties from 0. For slideUp,
                       use forcefeeding to start from computed values and animate down to 0. */
                    var propertyValue = Velocity.CSS.getPropertyValue(element, property);
                    computedValues[property] = (direction === "Down") ? [ propertyValue, 0 ] : [ 0, propertyValue ];
                }

                /* Force vertical overflow content to clip so that sliding works as expected. */
                inlineValues.overflow = element.style.overflow;
                element.style.overflow = "hidden";
            }

            opts.complete = function() {
                /* Reset element to its pre-slide inline values once its slide animation is complete. */
                for (var property in inlineValues) {
                    element.style[property] = inlineValues[property];
                }

                /* If the user passed in a complete callback, fire it now. */
                complete && complete.call(elements, elements);
                promiseData && promiseData.resolver(elements);
            };

            Velocity(element, computedValues, opts);
        };
    });

    /* fadeIn, fadeOut */
    $.each([ "In", "Out" ], function(i, direction) {
        Velocity.Redirects["fade" + direction] = function (element, options, elementsIndex, elementsSize, elements, promiseData) {
            var opts = $.extend({}, options),
                propertiesMap = { opacity: (direction === "In") ? 1 : 0 },
                originalComplete = opts.complete;

            /* Since redirects are triggered individually for each element in the animated set, avoid repeatedly triggering
               callbacks by firing them only when the final element has been reached. */
            if (elementsIndex !== elementsSize - 1) {
                opts.complete = opts.begin = null;
            } else {
                opts.complete = function() {
                    if (originalComplete) {
                        originalComplete.call(elements, elements);
                    }

                    promiseData && promiseData.resolver(elements);
                }
            }

            /* If a display was passed in, use it. Otherwise, default to "none" for fadeOut or the element-specific default for fadeIn. */
            /* Note: We allow users to pass in "null" to skip display setting altogether. */
            if (opts.display === undefined) {
                opts.display = (direction === "In" ? "auto" : "none");
            }

            Velocity(this, propertiesMap, opts);
        };
    });

    return Velocity;
}((window.jQuery || window.Zepto || window), window, document);
}));

/******************
   Known Issues
******************/

/* The CSS spec mandates that the translateX/Y/Z transforms are %-relative to the element itself -- not its parent.
Velocity, however, doesn't make this distinction. Thus, converting to or from the % unit with these subproperties
will produce an inaccurate conversion value. The same issue exists with the cx/cy attributes of SVG circles and ellipses. */
/*
== malihu jquery custom scrollbar plugin ==
Version: 3.1.3
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development.
For production, use either the minified jquery.mCustomScrollbar.min.js script or
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin
and dependencies (minified).
*/

(function(factory){
    if(typeof module!=="undefined" && module.exports){
        module.exports=factory;
    }else{
        factory(jQuery,window,document);
    }
}(function($){
(function(init){
    var _rjs=typeof define==="function" && define.amd, /* RequireJS */
        _njs=typeof module !== "undefined" && module.exports, /* NodeJS */
        _dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
        _url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js";
    if(!_rjs){
        if(_njs){
            require("jquery-mousewheel")($);
        }else{
            /* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS
            (works when mCustomScrollbar fn is called on window load) */
            $.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
        }
    }
    init();
}(function(){

    /*
    ----------------------------------------
    PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S)
    ----------------------------------------
    */

    var pluginNS="mCustomScrollbar",
        pluginPfx="mCS",
        defaultSelector=".mCustomScrollbar",





    /*
    ----------------------------------------
    DEFAULT OPTIONS
    ----------------------------------------
    */

        defaults={
            /*
            set element/content width/height programmatically
            values: boolean, pixels, percentage
                option                      default
                -------------------------------------
                setWidth                    false
                setHeight                   false
            */
            /*
            set the initial css top property of content
            values: string (e.g. "-100px", "10%" etc.)
            */
            setTop:0,
            /*
            set the initial css left property of content
            values: string (e.g. "-100px", "10%" etc.)
            */
            setLeft:0,
            /*
            scrollbar axis (vertical and/or horizontal scrollbars)
            values (string): "y", "x", "yx"
            */
            axis:"y",
            /*
            position of scrollbar relative to content
            values (string): "inside", "outside" ("outside" requires elements with position:relative)
            */
            scrollbarPosition:"inside",
            /*
            scrolling inertia
            values: integer (milliseconds)
            */
            scrollInertia:950,
            /*
            auto-adjust scrollbar dragger length
            values: boolean
            */
            autoDraggerLength:true,
            /*
            auto-hide scrollbar when idle
            values: boolean
                option                      default
                -------------------------------------
                autoHideScrollbar           false
            */
            /*
            auto-expands scrollbar on mouse-over and dragging
            values: boolean
                option                      default
                -------------------------------------
                autoExpandScrollbar         false
            */
            /*
            always show scrollbar, even when there's nothing to scroll
            values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
            */
            alwaysShowScrollbar:0,
            /*
            scrolling always snaps to a multiple of this number in pixels
            values: integer, array ([y,x])
                option                      default
                -------------------------------------
                snapAmount                  null
            */
            /*
            when snapping, snap with this number in pixels as an offset
            values: integer
            */
            snapOffset:0,
            /*
            mouse-wheel scrolling
            */
            mouseWheel:{
                /*
                enable mouse-wheel scrolling
                values: boolean
                */
                enable:true,
                /*
                scrolling amount in pixels
                values: "auto", integer
                */
                scrollAmount:"auto",
                /*
                mouse-wheel scrolling axis
                the default scrolling direction when both vertical and horizontal scrollbars are present
                values (string): "y", "x"
                */
                axis:"y",
                /*
                prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached
                values: boolean
                    option                      default
                    -------------------------------------
                    preventDefault              null
                */
                /*
                the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.
                values: "auto", integer
                "auto" uses the default OS/browser value
                */
                deltaFactor:"auto",
                /*
                normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration)
                values: boolean
                    option                      default
                    -------------------------------------
                    normalizeDelta              null
                */
                /*
                invert mouse-wheel scrolling direction
                values: boolean
                    option                      default
                    -------------------------------------
                    invert                      null
                */
                /*
                the tags that disable mouse-wheel when cursor is over them
                */
                disableOver:["select","option","keygen","datalist","textarea"]
            },
            /*
            scrollbar buttons
            */
            scrollButtons:{
                /*
                enable scrollbar buttons
                values: boolean
                    option                      default
                    -------------------------------------
                    enable                      null
                */
                /*
                scrollbar buttons scrolling type
                values (string): "stepless", "stepped"
                */
                scrollType:"stepless",
                /*
                scrolling amount in pixels
                values: "auto", integer
                */
                scrollAmount:"auto"
                /*
                tabindex of the scrollbar buttons
                values: false, integer
                    option                      default
                    -------------------------------------
                    tabindex                    null
                */
            },
            /*
            keyboard scrolling
            */
            keyboard:{
                /*
                enable scrolling via keyboard
                values: boolean
                */
                enable:true,
                /*
                keyboard scrolling type
                values (string): "stepless", "stepped"
                */
                scrollType:"stepless",
                /*
                scrolling amount in pixels
                values: "auto", integer
                */
                scrollAmount:"auto"
            },
            /*
            enable content touch-swipe scrolling
            values: boolean, integer, string (number)
            integer values define the axis-specific minimum amount required for scrolling momentum
            */
            contentTouchScroll:25,
            /*
            enable/disable document (default) touch-swipe scrolling
            */
            documentTouchScroll:true,
            /*
            advanced option parameters
            */
            advanced:{
                /*
                auto-expand content horizontally (for "x" or "yx" axis)
                values: boolean, integer (the value 2 forces the non scrollHeight/scrollWidth method, the value 3 forces the scrollHeight/scrollWidth method)
                    option                      default
                    -------------------------------------
                    autoExpandHorizontalScroll  null
                */
                /*
                auto-scroll to elements with focus
                */
                autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
                /*
                auto-update scrollbars on content, element or viewport resize
                should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc.
                values: boolean
                */
                updateOnContentResize:true,
                /*
                auto-update scrollbars each time each image inside the element is fully loaded
                values: "auto", boolean
                */
                updateOnImageLoad:"auto",
                /*
                auto-update scrollbars based on the amount and size changes of specific selectors
                useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size
                values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed)
                a value of true (boolean) will auto-update scrollbars each time any element is changed
                    option                      default
                    -------------------------------------
                    updateOnSelectorChange      null
                */
                /*
                extra selectors that'll allow scrollbar dragging upon mousemove/up, pointermove/up, touchend etc. (e.g. "selector-1, selector-2")
                    option                      default
                    -------------------------------------
                    extraDraggableSelectors     null
                */
                /*
                extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
                    option                      default
                    -------------------------------------
                    releaseDraggableSelectors   null
                */
                /*
                auto-update timeout
                values: integer (milliseconds)
                */
                autoUpdateTimeout:60
            },
            /*
            scrollbar theme
            values: string (see CSS/plugin URI for a list of ready-to-use themes)
            */
            theme:"light",
            /*
            user defined callback functions
            */
            callbacks:{
                /*
                Available callbacks:
                    callback                    default
                    -------------------------------------
                    onCreate                    null
                    onInit                      null
                    onScrollStart               null
                    onScroll                    null
                    onTotalScroll               null
                    onTotalScrollBack           null
                    whileScrolling              null
                    onOverflowY                 null
                    onOverflowX                 null
                    onOverflowYNone             null
                    onOverflowXNone             null
                    onImageLoad                 null
                    onSelectorChange            null
                    onBeforeUpdate              null
                    onUpdate                    null
                */
                onTotalScrollOffset:0,
                onTotalScrollBackOffset:0,
                alwaysTriggerOffsets:true
            }
            /*
            add scrollbar(s) on all elements matching the current selector, now and in the future
            values: boolean, string
            string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
            liveSelector values: string (selector)
                option                      default
                -------------------------------------
                live                        false
                liveSelector                null
            */
        },





    /*
    ----------------------------------------
    VARS, CONSTANTS
    ----------------------------------------
    */

        totalInstances=0, /* plugin instances amount */
        liveTimers={}, /* live option timers */
        oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
        touchActive=false,touchable, /* global touch vars (for touch and pointer events) */
        /* general plugin classes */
        classes=[
            "mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar",
            "mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer",
            "mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"
        ],





    /*
    ----------------------------------------
    METHODS
    ----------------------------------------
    */

        methods={

            /*
            plugin initialization method
            creates the scrollbar(s), plugin data object and options
            ----------------------------------------
            */

            init:function(options){

                var options=$.extend(true,{},defaults,options),
                    selector=_selector.call(this); /* validate selector */

                /*
                if live option is enabled, monitor for elements matching the current selector and
                apply scrollbar(s) when found (now and in the future)
                */
                if(options.live){
                    var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
                        $liveSelector=$(liveSelector); /* live selector(s) as jquery object */
                    if(options.live==="off"){
                        /*
                        disable live if requested
                        usage: $(selector).mCustomScrollbar({live:"off"});
                        */
                        removeLiveTimers(liveSelector);
                        return;
                    }
                    liveTimers[liveSelector]=setTimeout(function(){
                        /* call mCustomScrollbar fn on live selector(s) every half-second */
                        $liveSelector.mCustomScrollbar(options);
                        if(options.live==="once" && $liveSelector.length){
                            /* disable live after first invocation */
                            removeLiveTimers(liveSelector);
                        }
                    },500);
                }else{
                    removeLiveTimers(liveSelector);
                }

                /* options backward compatibility (for versions < 3.0.0) and normalization */
                options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
                options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
                options.axis=(options.horizontalScroll) ? "x" : _findAxis(options.axis);
                options.scrollInertia=options.scrollInertia>0 && options.scrollInertia<17 ? 17 : options.scrollInertia;
                if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
                    options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
                }
                options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
                options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
                options.scrollButtons.scrollType=_findScrollButtonsType(options.scrollButtons.scrollType);

                _theme(options); /* theme-specific options */

                /* plugin constructor */
                return $(selector).each(function(){

                    var $this=$(this);

                    if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */

                        /* store options and create objects in jquery data */
                        $this.data(pluginPfx,{
                            idx:++totalInstances, /* instance index */
                            opt:options, /* options */
                            scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
                            overflowed:null, /* overflowed axis */
                            contentReset:{y:null,x:null}, /* object to check when content resets */
                            bindEvents:false, /* object to check if events are bound */
                            tweenRunning:false, /* object to check if tween is running */
                            sequential:{}, /* sequential scrolling object */
                            langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
                            cbOffsets:null, /* object to check whether callback offsets always trigger */
                            /*
                            object to check how scrolling events where last triggered
                            "internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method)
                            usage: object.data("mCS").trigger
                            */
                            trigger:null,
                            /*
                            object to check for changes in elements in order to call the update method automatically
                            */
                            poll:{size:{o:0,n:0},img:{o:0,n:0},change:{o:0,n:0}}
                        });

                        var d=$this.data(pluginPfx),o=d.opt,
                            /* HTML data attributes */
                            htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");

                        if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
                        if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
                        if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
                            o.theme=htmlDataTheme;
                            _theme(o); /* theme-specific options */
                        }

                        _pluginMarkup.call(this); /* add plugin markup */

                        if(d && o.callbacks.onCreate && typeof o.callbacks.onCreate==="function"){o.callbacks.onCreate.call(this);} /* callbacks: onCreate */

                        $("#mCSB_"+d.idx+"_container img:not(."+classes[2]+")").addClass(classes[2]); /* flag loaded images */

                        methods.update.call(null,$this); /* call the update method */

                    }

                });

            },
            /* ---------------------------------------- */



            /*
            plugin update method
            updates content and scrollbar(s) values, events and status
            ----------------------------------------
            usage: $(selector).mCustomScrollbar("update");
            */

            update:function(el,cb){

                var selector=el || _selector.call(this); /* validate selector */

                return $(selector).each(function(){

                    var $this=$(this);

                    if($this.data(pluginPfx)){ /* check if plugin has initialized */

                        var d=$this.data(pluginPfx),o=d.opt,
                            mCSB_container=$("#mCSB_"+d.idx+"_container"),
                            mCustomScrollBox=$("#mCSB_"+d.idx),
                            mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];

                        if(!mCSB_container.length){return;}

                        if(d.tweenRunning){_stop($this);} /* stop any running tweens while updating */

                        if(cb && d && o.callbacks.onBeforeUpdate && typeof o.callbacks.onBeforeUpdate==="function"){o.callbacks.onBeforeUpdate.call(this);} /* callbacks: onBeforeUpdate */

                        /* if element was disabled or destroyed, remove class(es) */
                        if($this.hasClass(classes[3])){$this.removeClass(classes[3]);}
                        if($this.hasClass(classes[4])){$this.removeClass(classes[4]);}

                        /* css flexbox fix, detect/set max-height */
                        mCustomScrollBox.css("max-height","none");
                        if(mCustomScrollBox.height()!==$this.height()){mCustomScrollBox.css("max-height",$this.height());}

                        _expandContentHorizontally.call(this); /* expand content horizontally */

                        if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
                            mCSB_container.css("width",_contentWidth(mCSB_container));
                        }

                        d.overflowed=_overflowed.call(this); /* determine if scrolling is required */

                        _scrollbarVisibility.call(this); /* show/hide scrollbar(s) */

                        /* auto-adjust scrollbar dragger length analogous to content */
                        if(o.autoDraggerLength){_setDraggerLength.call(this);}

                        _scrollRatio.call(this); /* calculate and store scrollbar to content ratio */

                        _bindEvents.call(this); /* bind scrollbar events */

                        /* reset scrolling position and/or events */
                        var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
                        if(o.axis!=="x"){ /* y/yx axis */
                            if(!d.overflowed[0]){ /* y scrolling is not required */
                                _resetContentPosition.call(this); /* reset content position */
                                if(o.axis==="y"){
                                    _unbindEvents.call(this);
                                }else if(o.axis==="yx" && d.overflowed[1]){
                                    _scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
                                }
                            }else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
                                _resetContentPosition.call(this); /* reset content position */
                            }else{ /* y scrolling is required */
                                _scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
                                d.contentReset.y=null;
                            }
                        }
                        if(o.axis!=="y"){ /* x/yx axis */
                            if(!d.overflowed[1]){ /* x scrolling is not required */
                                _resetContentPosition.call(this); /* reset content position */
                                if(o.axis==="x"){
                                    _unbindEvents.call(this);
                                }else if(o.axis==="yx" && d.overflowed[0]){
                                    _scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
                                }
                            }else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
                                _resetContentPosition.call(this); /* reset content position */
                            }else{ /* x scrolling is required */
                                _scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
                                d.contentReset.x=null;
                            }
                        }

                        /* callbacks: onImageLoad, onSelectorChange, onUpdate */
                        if(cb && d){
                            if(cb===2 && o.callbacks.onImageLoad && typeof o.callbacks.onImageLoad==="function"){
                                o.callbacks.onImageLoad.call(this);
                            }else if(cb===3 && o.callbacks.onSelectorChange && typeof o.callbacks.onSelectorChange==="function"){
                                o.callbacks.onSelectorChange.call(this);
                            }else if(o.callbacks.onUpdate && typeof o.callbacks.onUpdate==="function"){
                                o.callbacks.onUpdate.call(this);
                            }
                        }

                        _autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */

                    }

                });

            },
            /* ---------------------------------------- */



            /*
            plugin scrollTo method
            triggers a scrolling event to a specific value
            ----------------------------------------
            usage: $(selector).mCustomScrollbar("scrollTo",value,options);
            */

            scrollTo:function(val,options){

                /* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
                if(typeof val=="undefined" || val==null){return;}

                var selector=_selector.call(this); /* validate selector */

                return $(selector).each(function(){

                    var $this=$(this);

                    if($this.data(pluginPfx)){ /* check if plugin has initialized */

                        var d=$this.data(pluginPfx),o=d.opt,
                            /* method default options */
                            methodDefaults={
                                trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
                                scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
                                scrollEasing:"mcsEaseInOut", /* animation easing */
                                moveDragger:false, /* move dragger instead of content */
                                timeout:60, /* scroll-to delay */
                                callbacks:true, /* enable/disable callbacks */
                                onStart:true,
                                onUpdate:true,
                                onComplete:true
                            },
                            methodOptions=$.extend(true,{},methodDefaults,options),
                            to=_arr.call(this,val),dur=methodOptions.scrollInertia>0 && methodOptions.scrollInertia<17 ? 17 : methodOptions.scrollInertia;

                        /* translate yx values to actual scroll-to positions */
                        to[0]=_to.call(this,to[0],"y");
                        to[1]=_to.call(this,to[1],"x");

                        /*
                        check if scroll-to value moves the dragger instead of content.
                        Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.)
                        */
                        if(methodOptions.moveDragger){
                            to[0]*=d.scrollRatio.y;
                            to[1]*=d.scrollRatio.x;
                        }

                        methodOptions.dur=_isTabHidden() ? 0 : dur; //skip animations if browser tab is hidden

                        setTimeout(function(){
                            /* do the scrolling */
                            if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
                                methodOptions.dir="y";
                                methodOptions.overwrite="all";
                                _scrollTo($this,to[0].toString(),methodOptions);
                            }
                            if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
                                methodOptions.dir="x";
                                methodOptions.overwrite="none";
                                _scrollTo($this,to[1].toString(),methodOptions);
                            }
                        },methodOptions.timeout);

                    }

                });

            },
            /* ---------------------------------------- */



            /*
            plugin stop method
            stops scrolling animation
            ----------------------------------------
            usage: $(selector).mCustomScrollbar("stop");
            */
            stop:function(){

                var selector=_selector.call(this); /* validate selector */

                return $(selector).each(function(){

                    var $this=$(this);

                    if($this.data(pluginPfx)){ /* check if plugin has initialized */

                        _stop($this);

                    }

                });

            },
            /* ---------------------------------------- */



            /*
            plugin disable method
            temporarily disables the scrollbar(s)
            ----------------------------------------
            usage: $(selector).mCustomScrollbar("disable",reset);
            reset (boolean): resets content position to 0
            */
            disable:function(r){

                var selector=_selector.call(this); /* validate selector */

                return $(selector).each(function(){

                    var $this=$(this);

                    if($this.data(pluginPfx)){ /* check if plugin has initialized */

                        var d=$this.data(pluginPfx);

                        _autoUpdate.call(this,"remove"); /* remove automatic updating */

                        _unbindEvents.call(this); /* unbind events */

                        if(r){_resetContentPosition.call(this);} /* reset content position */

                        _scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */

                        $this.addClass(classes[3]); /* add disable class */

                    }

                });

            },
            /* ---------------------------------------- */



            /*
            plugin destroy method
            completely removes the scrollbar(s) and returns the element to its original state
            ----------------------------------------
            usage: $(selector).mCustomScrollbar("destroy");
            */
            destroy:function(){

                var selector=_selector.call(this); /* validate selector */

                return $(selector).each(function(){

                    var $this=$(this);

                    if($this.data(pluginPfx)){ /* check if plugin has initialized */

                        var d=$this.data(pluginPfx),o=d.opt,
                            mCustomScrollBox=$("#mCSB_"+d.idx),
                            mCSB_container=$("#mCSB_"+d.idx+"_container"),
                            scrollbar=$(".mCSB_"+d.idx+"_scrollbar");

                        if(o.live){removeLiveTimers(o.liveSelector || $(selector).selector);} /* remove live timers */

                        _autoUpdate.call(this,"remove"); /* remove automatic updating */

                        _unbindEvents.call(this); /* unbind events */

                        _resetContentPosition.call(this); /* reset content position */

                        $this.removeData(pluginPfx); /* remove plugin data object */

                        _delete(this,"mcs"); /* delete callbacks object */

                        /* remove plugin markup */
                        scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
                        mCSB_container.find("img."+classes[2]).removeClass(classes[2]); /* remove loaded images flag */
                        mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
                        /* remove plugin classes from the element and add destroy class */
                        $this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" "+classes[6]+" "+classes[7]+" "+classes[5]+" "+classes[3]).addClass(classes[4]);

                    }

                });

            }
            /* ---------------------------------------- */

        },





    /*
    ----------------------------------------
    FUNCTIONS
    ----------------------------------------
    */

        /* validates selector (if selector is invalid or undefined uses the default one) */
        _selector=function(){
            return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
        },
        /* -------------------- */


        /* changes options according to theme */
        _theme=function(obj){
            var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
                nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
                disabledScrollButtonsThemes=["minimal","minimal-dark"],
                enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
                scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
            obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
            obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
            obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
            obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
            obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
        },
        /* -------------------- */


        /* live option timers removal */
        removeLiveTimers=function(selector){
            if(liveTimers[selector]){
                clearTimeout(liveTimers[selector]);
                _delete(liveTimers,selector);
            }
        },
        /* -------------------- */


        /* normalizes axis option to valid values: "y", "x", "yx" */
        _findAxis=function(val){
            return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
        },
        /* -------------------- */


        /* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
        _findScrollButtonsType=function(val){
            return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
        },
        /* -------------------- */


        /* generates plugin markup */
        _pluginMarkup=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                expandClass=o.autoExpandScrollbar ? " "+classes[1]+"_expand" : "",
                scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
                wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
                scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
                contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
                autoHideClass=o.autoHideScrollbar ? " "+classes[6] : "",
                scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " "+classes[7] : "";
            if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
            if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
            o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
            $this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir="+d.langDir+" /></div>");
            var mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container");
            if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
                mCSB_container.css("width",_contentWidth(mCSB_container));
            }
            if(o.scrollbarPosition==="outside"){
                if($this.css("position")==="static"){ /* requires elements with non-static position */
                    $this.css("position","relative");
                }
                $this.css("overflow","visible");
                mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
            }else{
                mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
                mCSB_container.wrap(contentWrapper);
            }
            _scrollButtons.call(this); /* add scrollbar buttons */
            /* minimum dragger length */
            var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
            mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
            mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
        },
        /* -------------------- */


        /* calculates content width */
        _contentWidth=function(el){
            var val=[el[0].scrollWidth,Math.max.apply(Math,el.children().map(function(){return $(this).outerWidth(true);}).get())],w=el.parent().width();
            return val[0]>w ? val[0] : val[1]>w ? val[1] : "100%";
        },
        /* -------------------- */


        /* expands content horizontally */
        _expandContentHorizontally=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                mCSB_container=$("#mCSB_"+d.idx+"_container");
            if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
                /* calculate scrollWidth */
                mCSB_container.css({"width":"auto","min-width":0,"overflow-x":"scroll"});
                var w=Math.ceil(mCSB_container[0].scrollWidth);
                if(o.advanced.autoExpandHorizontalScroll===3 || (o.advanced.autoExpandHorizontalScroll!==2 && w>mCSB_container.parent().width())){
                    mCSB_container.css({"width":w,"min-width":"100%","overflow-x":"inherit"});
                }else{
                    /*
                    wrap content with an infinite width div and set its position to absolute and width to auto.
                    Setting width to auto before calculating the actual width is important!
                    We must let the browser set the width as browser zoom values are impossible to calculate.
                    */
                    mCSB_container.css({"overflow-x":"inherit","position":"absolute"})
                        .wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
                        .css({ /* set actual width, original position and un-wrap */
                            /*
                            get the exact width (with decimals) and then round-up.
                            Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
                            */
                            "width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
                            "min-width":"100%",
                            "position":"relative"
                        }).unwrap();
                }
            }
        },
        /* -------------------- */


        /* adds scrollbar buttons */
        _scrollButtons=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
                tabindex=!_isNumeric(o.scrollButtons.tabindex) ? "" : "tabindex='"+o.scrollButtons.tabindex+"'",
                btnHTML=[
                    "<a href='#' class='"+classes[13]+"' oncontextmenu='return false;' "+tabindex+" />",
                    "<a href='#' class='"+classes[14]+"' oncontextmenu='return false;' "+tabindex+" />",
                    "<a href='#' class='"+classes[15]+"' oncontextmenu='return false;' "+tabindex+" />",
                    "<a href='#' class='"+classes[16]+"' oncontextmenu='return false;' "+tabindex+" />"
                ],
                btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
            if(o.scrollButtons.enable){
                mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
            }
        },
        /* -------------------- */


        /* auto-adjusts scrollbar dragger length */
        _setDraggerLength=function(){
            var $this=$(this),d=$this.data(pluginPfx),
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
                l=[
                    parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
                    parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
                ],
                h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
            mCSB_dragger[0].css({
                "height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
            }).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
            mCSB_dragger[1].css({
                "width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
            });
        },
        /* -------------------- */


        /* calculates scrollbar to content ratio */
        _scrollRatio=function(){
            var $this=$(this),d=$this.data(pluginPfx),
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
                ratio=[
                    scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
                    scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
                ];
            d.scrollRatio={y:ratio[0],x:ratio[1]};
        },
        /* -------------------- */


        /* toggles scrolling classes */
        _onDragClasses=function(el,action,xpnd){
            var expandClass=xpnd ? classes[0]+"_expanded" : "",
                scrollbar=el.closest(".mCSB_scrollTools");
            if(action==="active"){
                el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]);
                el[0]._draggable=el[0]._draggable ? 0 : 1;
            }else{
                if(!el[0]._draggable){
                    if(action==="hide"){
                        el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
                    }else{
                        el.addClass(classes[0]); scrollbar.addClass(classes[1]);
                    }
                }
            }
        },
        /* -------------------- */


        /* checks if content overflows its container to determine if scrolling is required */
        _overflowed=function(){
            var $this=$(this),d=$this.data(pluginPfx),
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
                contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false),
                h=mCSB_container[0].scrollHeight,w=mCSB_container[0].scrollWidth;
            if(h>contentHeight){contentHeight=h;}
            if(w>contentWidth){contentWidth=w;}
            return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
        },
        /* -------------------- */


        /* resets content position to 0 */
        _resetContentPosition=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
            _stop($this); /* stop any current scrolling before resetting */
            if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){ /* reset y */
                mCSB_dragger[0].add(mCSB_container).css("top",0);
                _scrollTo($this,"_resetY");
            }
            if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
                var cx=dx=0;
                if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
                    cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
                    dx=Math.abs(cx/d.scrollRatio.x);
                }
                mCSB_container.css("left",cx);
                mCSB_dragger[1].css("left",dx);
                _scrollTo($this,"_resetX");
            }
        },
        /* -------------------- */


        /* binds scrollbar events */
        _bindEvents=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
            if(!d.bindEvents){ /* check if events are already bound */
                _draggable.call(this);
                if(o.contentTouchScroll){_contentDraggable.call(this);}
                _selectable.call(this);
                if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
                    function _mwt(){
                        mousewheelTimeout=setTimeout(function(){
                            if(!$.event.special.mousewheel){
                                _mwt();
                            }else{
                                clearTimeout(mousewheelTimeout);
                                _mousewheel.call($this[0]);
                            }
                        },100);
                    }
                    var mousewheelTimeout;
                    _mwt();
                }
                _draggerRail.call(this);
                _wrapperScroll.call(this);
                if(o.advanced.autoScrollOnFocus){_focus.call(this);}
                if(o.scrollButtons.enable){_buttons.call(this);}
                if(o.keyboard.enable){_keyboard.call(this);}
                d.bindEvents=true;
            }
        },
        /* -------------------- */


        /* unbinds scrollbar events */
        _unbindEvents=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                namespace=pluginPfx+"_"+d.idx,
                sb=".mCSB_"+d.idx+"_scrollbar",
                sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" ."+classes[12]+",#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
                mCSB_container=$("#mCSB_"+d.idx+"_container");
            if(o.advanced.releaseDraggableSelectors){sel.add($(o.advanced.releaseDraggableSelectors));}
            if(o.advanced.extraDraggableSelectors){sel.add($(o.advanced.extraDraggableSelectors));}
            if(d.bindEvents){ /* check if events are bound */
                /* unbind namespaced events from document/selectors */
                $(document).add($(!_canAccessIFrame() || top.document)).unbind("."+namespace);
                sel.each(function(){
                    $(this).unbind("."+namespace);
                });
                /* clear and delete timeouts/objects */
                clearTimeout($this[0]._focusTimeout); _delete($this[0],"_focusTimeout");
                clearTimeout(d.sequential.step); _delete(d.sequential,"step");
                clearTimeout(mCSB_container[0].onCompleteTimeout); _delete(mCSB_container[0],"onCompleteTimeout");
                d.bindEvents=false;
            }
        },
        /* -------------------- */


        /* toggles scrollbar visibility */
        _scrollbarVisibility=function(disabled){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
                content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
                scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
                mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
            if(o.axis!=="x"){
                if(d.overflowed[0] && !disabled){
                    scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
                    content.removeClass(classes[8]+" "+classes[10]);
                }else{
                    if(o.alwaysShowScrollbar){
                        if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].css("display","none");}
                        content.removeClass(classes[10]);
                    }else{
                        scrollbar[0].css("display","none");
                        content.addClass(classes[10]);
                    }
                    content.addClass(classes[8]);
                }
            }
            if(o.axis!=="y"){
                if(d.overflowed[1] && !disabled){
                    scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
                    content.removeClass(classes[9]+" "+classes[11]);
                }else{
                    if(o.alwaysShowScrollbar){
                        if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].css("display","none");}
                        content.removeClass(classes[11]);
                    }else{
                        scrollbar[1].css("display","none");
                        content.addClass(classes[11]);
                    }
                    content.addClass(classes[9]);
                }
            }
            if(!d.overflowed[0] && !d.overflowed[1]){
                $this.addClass(classes[5]);
            }else{
                $this.removeClass(classes[5]);
            }
        },
        /* -------------------- */


        /* returns input coordinates of pointer, touch and mouse events (relative to document) */
        _coordinates=function(e){
            var t=e.type,o=e.target.ownerDocument!==document ? [$(frameElement).offset().top,$(frameElement).offset().left] : null,
                io=_canAccessIFrame() && e.target.ownerDocument!==top.document ? [$(e.view.frameElement).offset().top,$(e.view.frameElement).offset().left] : [0,0];
            switch(t){
                case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
                    return o ? [e.originalEvent.pageY-o[0]+io[0],e.originalEvent.pageX-o[1]+io[1],false] : [e.originalEvent.pageY,e.originalEvent.pageX,false];
                    break;
                case "touchstart": case "touchmove": case "touchend":
                    var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
                        touches=e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
                    return e.target.ownerDocument!==document ? [touch.screenY,touch.screenX,touches>1] : [touch.pageY,touch.pageX,touches>1];
                    break;
                default:
                    return o ? [e.pageY-o[0]+io[0],e.pageX-o[1]+io[1],false] : [e.pageY,e.pageX,false];
            }
        },
        /* -------------------- */


        /*
        SCROLLBAR DRAG EVENTS
        scrolls content via scrollbar dragging
        */
        _draggable=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                namespace=pluginPfx+"_"+d.idx,
                draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
                draggable,dragY,dragX,
                rds=o.advanced.releaseDraggableSelectors ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors)) : mCSB_dragger,
                eds=o.advanced.extraDraggableSelectors ? $(!_canAccessIFrame() || top.document).add($(o.advanced.extraDraggableSelectors)) : $(!_canAccessIFrame() || top.document);
            mCSB_dragger.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
                e.stopImmediatePropagation();
                e.preventDefault();
                if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
                touchActive=true;
                if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
                _iframe(false); /* enable scrollbar dragging over iframes by disabling their events */
                _stop($this);
                draggable=$(this);
                var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
                    h=draggable.height()+offset.top,w=draggable.width()+offset.left;
                if(y<h && y>0 && x<w && x>0){
                    dragY=y;
                    dragX=x;
                }
                _onDragClasses(draggable,"active",o.autoExpandScrollbar);
            }).bind("touchmove."+namespace,function(e){
                e.stopImmediatePropagation();
                e.preventDefault();
                var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
                _drag(dragY,dragX,y,x);
            });
            $(document).add(eds).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
                if(draggable){
                    var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
                    if(dragY===y && dragX===x){return;} /* has it really moved? */
                    _drag(dragY,dragX,y,x);
                }
            }).add(rds).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
                if(draggable){
                    _onDragClasses(draggable,"active",o.autoExpandScrollbar);
                    draggable=null;
                }
                touchActive=false;
                if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
                _iframe(true); /* enable iframes events */
            });
            function _iframe(evt){
                var el=mCSB_container.find("iframe");
                if(!el.length){return;} /* check if content contains iframes */
                var val=!evt ? "none" : "auto";
                el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
            }
            function _drag(dragY,dragX,y,x){
                mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
                if(draggable.attr("id")===draggerId[1]){
                    var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
                }else{
                    var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
                }
                _scrollTo($this,to.toString(),{dir:dir,drag:true});
            }
        },
        /* -------------------- */


        /*
        TOUCH SWIPE EVENTS
        scrolls content via touch swipe
        Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices
        */
        _contentDraggable=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                namespace=pluginPfx+"_"+d.idx,
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                draggable,dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
                durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all",touchIntent=[],touchDrag,docDrag,
                iframe=mCSB_container.find("iframe"),
                events=[
                    "touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace, //start
                    "touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace, //move
                    "touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace //end
                ],
                touchAction=document.body.style.touchAction!==undefined;
            mCSB_container.bind(events[0],function(e){
                _onTouchstart(e);
            }).bind(events[1],function(e){
                _onTouchmove(e);
            });
            mCustomScrollBox.bind(events[0],function(e){
                _onTouchstart2(e);
            }).bind(events[2],function(e){
                _onTouchend(e);
            });
            if(iframe.length){
                iframe.each(function(){
                    $(this).load(function(){
                        /* bind events on accessible iframes */
                        if(_canAccessIFrame(this)){
                            $(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
                                _onTouchstart(e);
                                _onTouchstart2(e);
                            }).bind(events[1],function(e){
                                _onTouchmove(e);
                            }).bind(events[2],function(e){
                                _onTouchend(e);
                            });
                        }
                    });
                });
            }
            function _onTouchstart(e){
                if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
                touchable=1; touchDrag=0; docDrag=0; draggable=1;
                $this.removeClass("mCS_touch_action");
                var offset=mCSB_container.offset();
                dragY=_coordinates(e)[0]-offset.top;
                dragX=_coordinates(e)[1]-offset.left;
                touchIntent=[_coordinates(e)[0],_coordinates(e)[1]];
            }
            function _onTouchmove(e){
                if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
                if(!o.documentTouchScroll){e.preventDefault();}
                e.stopImmediatePropagation();
                if(docDrag && !touchDrag){return;}
                if(draggable){
                    runningTime=_getTime();
                    var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
                        easing="mcsLinearOut";
                    touchMoveY.push(y);
                    touchMoveX.push(x);
                    touchIntent[2]=Math.abs(_coordinates(e)[0]-touchIntent[0]); touchIntent[3]=Math.abs(_coordinates(e)[1]-touchIntent[1]);
                    if(d.overflowed[0]){
                        var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
                            prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y) && (touchIntent[3]*2<touchIntent[2] || o.axis==="yx"));
                    }
                    if(d.overflowed[1]){
                        var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
                            preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x) && (touchIntent[2]*2<touchIntent[3] || o.axis==="yx"));
                    }
                    if(prevent || preventX){ /* prevent native document scrolling */
                        if(!touchAction){e.preventDefault();}
                        touchDrag=1;
                    }else{
                        docDrag=1;
                        $this.addClass("mCS_touch_action");
                    }
                    if(touchAction){e.preventDefault();}
                    amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
                    mCSB_container[0].idleTimer=250;
                    if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
                    if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
                }
            }
            function _onTouchstart2(e){
                if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
                touchable=1;
                e.stopImmediatePropagation();
                _stop($this);
                startTime=_getTime();
                var offset=mCustomScrollBox.offset();
                touchStartY=_coordinates(e)[0]-offset.top;
                touchStartX=_coordinates(e)[1]-offset.left;
                touchMoveY=[]; touchMoveX=[];
            }
            function _onTouchend(e){
                if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
                draggable=0;
                e.stopImmediatePropagation();
                touchDrag=0; docDrag=0;
                endTime=_getTime();
                var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
                if((endTime-runningTime)>30){return;}
                speed=1000/(endTime-startTime);
                var easing="mcsEaseOut",slow=speed<2.5,
                    diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
                distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
                var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
                speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
                var a=[
                    Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
                    Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
                ];
                amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
                durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
                var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
                amount[0]=absDistance[0]>md ? amount[0] : 0;
                amount[1]=absDistance[1]>md ? amount[1] : 0;
                if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
                if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
            }
            function _m(ds,s){
                var r=[s*1.5,s*2,s/1.5,s/2];
                if(ds>90){
                    return s>4 ? r[0] : r[3];
                }else if(ds>60){
                    return s>3 ? r[3] : r[2];
                }else if(ds>30){
                    return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
                }else{
                    return s>8 ? s : r[3];
                }
            }
            function _drag(amount,dur,easing,dir,overwrite,drag){
                if(!amount){return;}
                _scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
            }
        },
        /* -------------------- */


        /*
        SELECT TEXT EVENTS
        scrolls content when text is selected
        */
        _selectable=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
                namespace=pluginPfx+"_"+d.idx,
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                wrapper=mCSB_container.parent(),
                action;
            mCSB_container.bind("mousedown."+namespace,function(e){
                if(touchable){return;}
                if(!action){action=1; touchActive=true;}
            }).add(document).bind("mousemove."+namespace,function(e){
                if(!touchable && action && _sel()){
                    var offset=mCSB_container.offset(),
                        y=_coordinates(e)[0]-offset.top+mCSB_container[0].offsetTop,x=_coordinates(e)[1]-offset.left+mCSB_container[0].offsetLeft;
                    if(y>0 && y<wrapper.height() && x>0 && x<wrapper.width()){
                        if(seq.step){_seq("off",null,"stepped");}
                    }else{
                        if(o.axis!=="x" && d.overflowed[0]){
                            if(y<0){
                                _seq("on",38);
                            }else if(y>wrapper.height()){
                                _seq("on",40);
                            }
                        }
                        if(o.axis!=="y" && d.overflowed[1]){
                            if(x<0){
                                _seq("on",37);
                            }else if(x>wrapper.width()){
                                _seq("on",39);
                            }
                        }
                    }
                }
            }).bind("mouseup."+namespace+" dragend."+namespace,function(e){
                if(touchable){return;}
                if(action){action=0; _seq("off",null);}
                touchActive=false;
            });
            function _sel(){
                return  window.getSelection ? window.getSelection().toString() :
                        document.selection && document.selection.type!="Control" ? document.selection.createRange().text : 0;
            }
            function _seq(a,c,s){
                seq.type=s && action ? "stepped" : "stepless";
                seq.scrollAmount=10;
                _sequentialScroll($this,a,c,"mcsLinearOut",s ? 60 : null);
            }
        },
        /* -------------------- */


        /*
        MOUSE WHEEL EVENT
        scrolls content via mouse-wheel
        via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
        */
        _mousewheel=function(){
            if(!$(this).data(pluginPfx)){return;} /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                namespace=pluginPfx+"_"+d.idx,
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
                iframe=$("#mCSB_"+d.idx+"_container").find("iframe");
            if(iframe.length){
                iframe.each(function(){
                    $(this).load(function(){
                        /* bind events on accessible iframes */
                        if(_canAccessIFrame(this)){
                            $(this.contentDocument || this.contentWindow.document).bind("mousewheel."+namespace,function(e,delta){
                                _onMousewheel(e,delta);
                            });
                        }
                    });
                });
            }
            mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
                _onMousewheel(e,delta);
            });
            function _onMousewheel(e,delta){
                _stop($this);
                if(_disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
                var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor || 100,
                    dur=o.scrollInertia;
                if(o.axis==="x" || o.mouseWheel.axis==="x"){
                    var dir="x",
                        px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
                        amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
                        contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
                        draggerPos=mCSB_dragger[1][0].offsetLeft,
                        limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
                        dlt=e.deltaX || e.deltaY || delta;
                }else{
                    var dir="y",
                        px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
                        amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
                        contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
                        draggerPos=mCSB_dragger[0][0].offsetTop,
                        limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
                        dlt=e.deltaY || delta;
                }
                if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
                if(o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice){dlt=-dlt;}
                if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
                if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
                if(e.deltaFactor<2 && !o.mouseWheel.normalizeDelta){
                    //very low deltaFactor values mean some kind of delta acceleration (e.g. osx trackpad), so adjusting scrolling accordingly
                    amount=e.deltaFactor; dur=17;
                }
                _scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir,dur:dur});
            }
        },
        /* -------------------- */


        /* checks if iframe can be accessed */
        _canAccessIFrame=function(iframe){
            var html=null;
            if(!iframe){
                try{
                    var doc=top.document;
                    html=doc.body.innerHTML;
                }catch(err){/* do nothing */}
                return(html!==null);
            }else{
                try{
                    var doc=iframe.contentDocument || iframe.contentWindow.document;
                    html=doc.body.innerHTML;
                }catch(err){/* do nothing */}
                return(html!==null);
            }
        },
        /* -------------------- */


        /* disables mouse-wheel when hovering specific elements like select, datalist etc. */
        _disableMousewheel=function(el,target){
            var tag=target.nodeName.toLowerCase(),
                tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
                /* elements that require focus */
                focusTags=["select","textarea"];
            return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
        },
        /* -------------------- */


        /*
        DRAGGER RAIL CLICK EVENT
        scrolls content via dragger rail
        */
        _draggerRail=function(){
            var $this=$(this),d=$this.data(pluginPfx),
                namespace=pluginPfx+"_"+d.idx,
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                wrapper=mCSB_container.parent(),
                mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar ."+classes[12]),
                clickable;
            mCSB_draggerContainer.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
                touchActive=true;
                if(!$(e.target).hasClass("mCSB_dragger")){clickable=1;}
            }).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
                touchActive=false;
            }).bind("click."+namespace,function(e){
                if(!clickable){return;}
                clickable=0;
                if($(e.target).hasClass(classes[12]) || $(e.target).hasClass("mCSB_draggerRail")){
                    _stop($this);
                    var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
                    if(el.parent(".mCSB_scrollTools_horizontal").length>0){
                        if(!d.overflowed[1]){return;}
                        var dir="x",
                            clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
                            to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9));
                    }else{
                        if(!d.overflowed[0]){return;}
                        var dir="y",
                            clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
                            to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
                    }
                    _scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
                }
            });
        },
        /* -------------------- */


        /*
        FOCUS EVENT
        scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
        */
        _focus=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                namespace=pluginPfx+"_"+d.idx,
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                wrapper=mCSB_container.parent();
            mCSB_container.bind("focusin."+namespace,function(e){
                var el=$(document.activeElement),
                    nested=mCSB_container.find(".mCustomScrollBox").length,
                    dur=0;
                if(!el.is(o.advanced.autoScrollOnFocus)){return;}
                _stop($this);
                clearTimeout($this[0]._focusTimeout);
                $this[0]._focusTimer=nested ? (dur+17)*nested : 0;
                $this[0]._focusTimeout=setTimeout(function(){
                    var to=[_childPos(el)[0],_childPos(el)[1]],
                        contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
                        isVisible=[
                            (contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
                            (contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
                        ],
                        overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
                    if(o.axis!=="x" && !isVisible[0]){
                        _scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
                    }
                    if(o.axis!=="y" && !isVisible[1]){
                        _scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
                    }
                },$this[0]._focusTimer);
            });
        },
        /* -------------------- */


        /* sets content wrapper scrollTop/scrollLeft always to 0 */
        _wrapperScroll=function(){
            var $this=$(this),d=$this.data(pluginPfx),
                namespace=pluginPfx+"_"+d.idx,
                wrapper=$("#mCSB_"+d.idx+"_container").parent();
            wrapper.bind("scroll."+namespace,function(e){
                if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){
                    $(".mCSB_"+d.idx+"_scrollbar").css("visibility","hidden"); /* hide scrollbar(s) */
                }
            });
        },
        /* -------------------- */


        /*
        BUTTONS EVENTS
        scrolls content via up, down, left and right buttons
        */
        _buttons=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
                namespace=pluginPfx+"_"+d.idx,
                sel=".mCSB_"+d.idx+"_scrollbar",
                btn=$(sel+">a");
            btn.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+" pointerout."+namespace+" MSPointerOut."+namespace+" click."+namespace,function(e){
                e.preventDefault();
                if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
                var btnClass=$(this).attr("class");
                seq.type=o.scrollButtons.scrollType;
                switch(e.type){
                    case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
                        if(seq.type==="stepped"){return;}
                        touchActive=true;
                        d.tweenRunning=false;
                        _seq("on",btnClass);
                        break;
                    case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
                    case "mouseout": case "pointerout": case "MSPointerOut":
                        if(seq.type==="stepped"){return;}
                        touchActive=false;
                        if(seq.dir){_seq("off",btnClass);}
                        break;
                    case "click":
                        if(seq.type!=="stepped" || d.tweenRunning){return;}
                        _seq("on",btnClass);
                        break;
                }
                function _seq(a,c){
                    seq.scrollAmount=o.scrollButtons.scrollAmount;
                    _sequentialScroll($this,a,c);
                }
            });
        },
        /* -------------------- */


        /*
        KEYBOARD EVENTS
        scrolls content via keyboard
        Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
        */
        _keyboard=function(){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
                namespace=pluginPfx+"_"+d.idx,
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                wrapper=mCSB_container.parent(),
                editables="input,textarea,select,datalist,keygen,[contenteditable='true']",
                iframe=mCSB_container.find("iframe"),
                events=["blur."+namespace+" keydown."+namespace+" keyup."+namespace];
            if(iframe.length){
                iframe.each(function(){
                    $(this).load(function(){
                        /* bind events on accessible iframes */
                        if(_canAccessIFrame(this)){
                            $(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
                                _onKeyboard(e);
                            });
                        }
                    });
                });
            }
            mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
                _onKeyboard(e);
            });
            function _onKeyboard(e){
                switch(e.type){
                    case "blur":
                        if(d.tweenRunning && seq.dir){_seq("off",null);}
                        break;
                    case "keydown": case "keyup":
                        var code=e.keyCode ? e.keyCode : e.which,action="on";
                        if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
                            /* up (38), down (40), left (37), right (39) arrows */
                            if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
                            if(e.type==="keyup"){action="off";}
                            if(!$(document.activeElement).is(editables)){
                                e.preventDefault();
                                e.stopImmediatePropagation();
                                _seq(action,code);
                            }
                        }else if(code===33 || code===34){
                            /* PgUp (33), PgDn (34) */
                            if(d.overflowed[0] || d.overflowed[1]){
                                e.preventDefault();
                                e.stopImmediatePropagation();
                            }
                            if(e.type==="keyup"){
                                _stop($this);
                                var keyboardDir=code===34 ? -1 : 1;
                                if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
                                    var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
                                }else{
                                    var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
                                }
                                _scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
                            }
                        }else if(code===35 || code===36){
                            /* End (35), Home (36) */
                            if(!$(document.activeElement).is(editables)){
                                if(d.overflowed[0] || d.overflowed[1]){
                                    e.preventDefault();
                                    e.stopImmediatePropagation();
                                }
                                if(e.type==="keyup"){
                                    if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
                                        var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
                                    }else{
                                        var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
                                    }
                                    _scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
                                }
                            }
                        }
                        break;
                }
                function _seq(a,c){
                    seq.type=o.keyboard.scrollType;
                    seq.scrollAmount=o.keyboard.scrollAmount;
                    if(seq.type==="stepped" && d.tweenRunning){return;}
                    _sequentialScroll($this,a,c);
                }
            }
        },
        /* -------------------- */


        /* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
        _sequentialScroll=function(el,action,trigger,e,s){
            var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                once=seq.type==="stepped" ? true : false,
                steplessSpeed=o.scrollInertia < 26 ? 26 : o.scrollInertia, /* 26/1.5=17 */
                steppedSpeed=o.scrollInertia < 1 ? 17 : o.scrollInertia;
            switch(action){
                case "on":
                    seq.dir=[
                        (trigger===classes[16] || trigger===classes[15] || trigger===39 || trigger===37 ? "x" : "y"),
                        (trigger===classes[13] || trigger===classes[15] || trigger===38 || trigger===37 ? -1 : 1)
                    ];
                    _stop(el);
                    if(_isNumeric(trigger) && seq.type==="stepped"){return;}
                    _on(once);
                    break;
                case "off":
                    _off();
                    if(once || (d.tweenRunning && seq.dir)){
                        _on(true);
                    }
                    break;
            }

            /* starts sequence */
            function _on(once){
                if(o.snapAmount){seq.scrollAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : seq.dir[0]==="x" ? o.snapAmount[1] : o.snapAmount[0];} /* scrolling snapping */
                var c=seq.type!=="stepped", /* continuous scrolling */
                    t=s ? s : !once ? 1000/60 : c ? steplessSpeed/1.5 : steppedSpeed, /* timer */
                    m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
                    contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
                    ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
                    amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
                    px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
                    to=seq.scrollAmount!=="auto" ? px : amount,
                    easing=e ? e : !once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
                    onComplete=!once ? false : true;
                if(once && t<17){
                    to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
                }
                _scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});
                if(once){
                    seq.dir=false;
                    return;
                }
                clearTimeout(seq.step);
                seq.step=setTimeout(function(){
                    _on();
                },t);
            }
            /* stops sequence */
            function _off(){
                clearTimeout(seq.step);
                _delete(seq,"step");
                _stop(el);
            }
        },
        /* -------------------- */


        /* returns a yx array from value */
        _arr=function(val){
            var o=$(this).data(pluginPfx).opt,vals=[];
            if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
            /* check if value is object or array, its length and create an array with yx values */
            if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
                vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
                vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
            }else{ /* array value (e.g. [100,100]) */
                vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
            }
            /* check if array values are anonymous functions */
            if(typeof vals[0]==="function"){vals[0]=vals[0]();}
            if(typeof vals[1]==="function"){vals[1]=vals[1]();}
            return vals;
        },
        /* -------------------- */


        /* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
        _to=function(val,dir){
            if(val==null || typeof val=="undefined"){return;}
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                wrapper=mCSB_container.parent(),
                t=typeof val;
            if(!dir){dir=o.axis==="x" ? "x" : "y";}
            var contentLength=dir==="x" ? mCSB_container.outerWidth(false) : mCSB_container.outerHeight(false),
                contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
                cssProp=dir==="x" ? "left" : "top";
            switch(t){
                case "function": /* this currently is not used. Consider removing it */
                    return val();
                    break;
                case "object": /* js/jquery object */
                    var obj=val.jquery ? val : $(val);
                    if(!obj.length){return;}
                    return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
                    break;
                case "string": case "number":
                    if(_isNumeric(val)){ /* numeric value */
                        return Math.abs(val);
                    }else if(val.indexOf("%")!==-1){ /* percentage value */
                        return Math.abs(contentLength*parseInt(val)/100);
                    }else if(val.indexOf("-=")!==-1){ /* decrease value */
                        return Math.abs(contentPos-parseInt(val.split("-=")[1]));
                    }else if(val.indexOf("+=")!==-1){ /* inrease value */
                        var p=(contentPos+parseInt(val.split("+=")[1]));
                        return p>=0 ? 0 : Math.abs(p);
                    }else if(val.indexOf("px")!==-1 && _isNumeric(val.split("px")[0])){ /* pixels string value (e.g. "100px") */
                        return Math.abs(val.split("px")[0]);
                    }else{
                        if(val==="top" || val==="left"){ /* special strings */
                            return 0;
                        }else if(val==="bottom"){
                            return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
                        }else if(val==="right"){
                            return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
                        }else if(val==="first" || val==="last"){
                            var obj=mCSB_container.find(":"+val);
                            return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
                        }else{
                            if($(val).length){ /* jquery selector */
                                return dir==="x" ? _childPos($(val))[1] : _childPos($(val))[0];
                            }else{ /* other values (e.g. "100em") */
                                mCSB_container.css(cssProp,val);
                                methods.update.call(null,$this[0]);
                                return;
                            }
                        }
                    }
                    break;
            }
        },
        /* -------------------- */


        /* calls the update method automatically */
        _autoUpdate=function(rem){
            var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
                mCSB_container=$("#mCSB_"+d.idx+"_container");
            if(rem){
                /*
                removes autoUpdate timer
                usage: _autoUpdate.call(this,"remove");
                */
                clearTimeout(mCSB_container[0].autoUpdate);
                _delete(mCSB_container[0],"autoUpdate");
                return;
            }
            upd();
            function upd(){
                clearTimeout(mCSB_container[0].autoUpdate);
                if($this.parents("html").length===0){
                    /* check element in dom tree */
                    $this=null;
                    return;
                }
                mCSB_container[0].autoUpdate=setTimeout(function(){
                    /* update on specific selector(s) length and size change */
                    if(o.advanced.updateOnSelectorChange){
                        d.poll.change.n=sizesSum();
                        if(d.poll.change.n!==d.poll.change.o){
                            d.poll.change.o=d.poll.change.n;
                            doUpd(3);
                            return;
                        }
                    }
                    /* update on main element and scrollbar size changes */
                    if(o.advanced.updateOnContentResize){
                        d.poll.size.n=$this[0].scrollHeight+$this[0].scrollWidth+mCSB_container[0].offsetHeight+$this[0].offsetHeight+$this[0].offsetWidth;
                        if(d.poll.size.n!==d.poll.size.o){
                            d.poll.size.o=d.poll.size.n;
                            doUpd(1);
                            return;
                        }
                    }
                    /* update on image load */
                    if(o.advanced.updateOnImageLoad){
                        if(!(o.advanced.updateOnImageLoad==="auto" && o.axis==="y")){ //by default, it doesn't run on vertical content
                            d.poll.img.n=mCSB_container.find("img").length;
                            if(d.poll.img.n!==d.poll.img.o){
                                d.poll.img.o=d.poll.img.n;
                                mCSB_container.find("img").each(function(){
                                    imgLoader(this);
                                });
                                return;
                            }
                        }
                    }
                    if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
                },o.advanced.autoUpdateTimeout);
            }
            /* a tiny image loader */
            function imgLoader(el){
                if($(el).hasClass(classes[2])){doUpd(); return;}
                var img=new Image();
                function createDelegate(contextObject,delegateMethod){
                    return function(){return delegateMethod.apply(contextObject,arguments);}
                }
                function imgOnLoad(){
                    this.onload=null;
                    $(el).addClass(classes[2]);
                    doUpd(2);
                }
                img.onload=createDelegate(img,imgOnLoad);
                img.src=el.src;
            }
            /* returns the total height and width sum of all elements matching the selector */
            function sizesSum(){
                if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
                var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
                if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=this.offsetHeight+this.offsetWidth;});}
                return total;
            }
            /* calls the update method */
            function doUpd(cb){
                clearTimeout(mCSB_container[0].autoUpdate);
                methods.update.call(null,$this[0],cb);
            }
        },
        /* -------------------- */


        /* snaps scrolling to a multiple of a pixels number */
        _snapAmount=function(to,amount,offset){
            return (Math.round(to/amount)*amount-offset);
        },
        /* -------------------- */


        /* stops content and scrollbar animations */
        _stop=function(el){
            var d=el.data(pluginPfx),
                sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
            sel.each(function(){
                _stopTween.call(this);
            });
        },
        /* -------------------- */


        /*
        ANIMATES CONTENT
        This is where the actual scrolling happens
        */
        _scrollTo=function(el,to,options){
            var d=el.data(pluginPfx),o=d.opt,
                defaults={
                    trigger:"internal",
                    dir:"y",
                    scrollEasing:"mcsEaseOut",
                    drag:false,
                    dur:o.scrollInertia,
                    overwrite:"all",
                    callbacks:true,
                    onStart:true,
                    onUpdate:true,
                    onComplete:true
                },
                options=$.extend(defaults,options),
                dur=[options.dur,(options.drag ? 0 : options.dur)],
                mCustomScrollBox=$("#mCSB_"+d.idx),
                mCSB_container=$("#mCSB_"+d.idx+"_container"),
                wrapper=mCSB_container.parent(),
                totalScrollOffsets=o.callbacks.onTotalScrollOffset ? _arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
                totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? _arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
            d.trigger=options.trigger;
            if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){ /* always reset scrollTop/Left */
                $(".mCSB_"+d.idx+"_scrollbar").css("visibility","visible");
                wrapper.scrollTop(0).scrollLeft(0);
            }
            if(to==="_resetY" && !d.contentReset.y){
                /* callbacks: onOverflowYNone */
                if(_cb("onOverflowYNone")){o.callbacks.onOverflowYNone.call(el[0]);}
                d.contentReset.y=1;
            }
            if(to==="_resetX" && !d.contentReset.x){
                /* callbacks: onOverflowXNone */
                if(_cb("onOverflowXNone")){o.callbacks.onOverflowXNone.call(el[0]);}
                d.contentReset.x=1;
            }
            if(to==="_resetY" || to==="_resetX"){return;}
            if((d.contentReset.y || !el[0].mcs) && d.overflowed[0]){
                /* callbacks: onOverflowY */
                if(_cb("onOverflowY")){o.callbacks.onOverflowY.call(el[0]);}
                d.contentReset.x=null;
            }
            if((d.contentReset.x || !el[0].mcs) && d.overflowed[1]){
                /* callbacks: onOverflowX */
                if(_cb("onOverflowX")){o.callbacks.onOverflowX.call(el[0]);}
                d.contentReset.x=null;
            }
            if(o.snapAmount){ /* scrolling snapping */
                var snapAmount=!(o.snapAmount instanceof Array) ? o.snapAmount : options.dir==="x" ? o.snapAmount[1] : o.snapAmount[0];
                to=_snapAmount(to,snapAmount,o.snapOffset);
            }
            switch(options.dir){
                case "x":
                    var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
                        property="left",
                        contentPos=mCSB_container[0].offsetLeft,
                        limit=[
                            mCustomScrollBox.width()-mCSB_container.outerWidth(false),
                            mCSB_dragger.parent().width()-mCSB_dragger.width()
                        ],
                        scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.x)],
                        tso=totalScrollOffsets[1],
                        tsbo=totalScrollBackOffsets[1],
                        totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
                        totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
                    break;
                case "y":
                    var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
                        property="top",
                        contentPos=mCSB_container[0].offsetTop,
                        limit=[
                            mCustomScrollBox.height()-mCSB_container.outerHeight(false),
                            mCSB_dragger.parent().height()-mCSB_dragger.height()
                        ],
                        scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.y)],
                        tso=totalScrollOffsets[0],
                        tsbo=totalScrollBackOffsets[0],
                        totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
                        totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
                    break;
            }
            if(scrollTo[1]<0 || (scrollTo[0]===0 && scrollTo[1]===0)){
                scrollTo=[0,0];
            }else if(scrollTo[1]>=limit[1]){
                scrollTo=[limit[0],limit[1]];
            }else{
                scrollTo[0]=-scrollTo[0];
            }
            if(!el[0].mcs){
                _mcs();  /* init mcs object (once) to make it available before callbacks */
                if(_cb("onInit")){o.callbacks.onInit.call(el[0]);} /* callbacks: onInit */
            }
            clearTimeout(mCSB_container[0].onCompleteTimeout);
            _tweenTo(mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
            if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
            _tweenTo(mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
                onStart:function(){
                    if(options.callbacks && options.onStart && !d.tweenRunning){
                        /* callbacks: onScrollStart */
                        if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
                        d.tweenRunning=true;
                        _onDragClasses(mCSB_dragger);
                        d.cbOffsets=_cbOffsets();
                    }
                },onUpdate:function(){
                    if(options.callbacks && options.onUpdate){
                        /* callbacks: whileScrolling */
                        if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
                    }
                },onComplete:function(){
                    if(options.callbacks && options.onComplete){
                        if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
                        var t=mCSB_container[0].idleTimer || 0;
                        mCSB_container[0].onCompleteTimeout=setTimeout(function(){
                            /* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
                            if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
                            if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
                            if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
                            d.tweenRunning=false;
                            mCSB_container[0].idleTimer=0;
                            _onDragClasses(mCSB_dragger,"hide");
                        },t);
                    }
                }
            });
            /* checks if callback function exists */
            function _cb(cb){
                return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
            }
            /* checks whether callback offsets always trigger */
            function _cbOffsets(){
                return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
            }
            /*
            populates object with useful values for the user
            values:
                content: this.mcs.content
                content top position: this.mcs.top
                content left position: this.mcs.left
                dragger top position: this.mcs.draggerTop
                dragger left position: this.mcs.draggerLeft
                scrolling y percentage: this.mcs.topPct
                scrolling x percentage: this.mcs.leftPct
                scrolling direction: this.mcs.direction
            */
            function _mcs(){
                var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
                    dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
                    cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
                    pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
                el[0].mcs={
                    content:mCSB_container, /* original content wrapper as jquery object */
                    top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
                    topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
                    direction:options.dir
                };
                /*
                this refers to the original element containing the scrollbar(s)
                usage: this.mcs.top, this.mcs.leftPct etc.
                */
            }
        },
        /* -------------------- */


        /*
        CUSTOM JAVASCRIPT ANIMATION TWEEN
        Lighter and faster than jquery animate() and css transitions
        Animates top/left properties and includes easings
        */
        _tweenTo=function(el,prop,to,duration,easing,overwrite,callbacks){
            if(!el._mTween){el._mTween={top:{},left:{}};}
            var callbacks=callbacks || {},
                onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
                startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
            if(prop==="left"){from=el.offsetLeft;}
            var diff=to-from;
            tobj.stop=0;
            if(overwrite!=="none"){_cancelTween();}
            _startTween();
            function _step(){
                if(tobj.stop){return;}
                if(!progress){onStart.call();}
                progress=_getTime()-startTime;
                _tween();
                if(progress>=tobj.time){
                    tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
                    if(tobj.time<progress+1){tobj.time=progress+1;}
                }
                if(tobj.time<duration){tobj.id=_request(_step);}else{onComplete.call();}
            }
            function _tween(){
                if(duration>0){
                    tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
                    elStyle[prop]=Math.round(tobj.currVal)+"px";
                }else{
                    elStyle[prop]=to+"px";
                }
                onUpdate.call();
            }
            function _startTween(){
                _delay=1000/60;
                tobj.time=progress+_delay;
                _request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
                tobj.id=_request(_step);
            }
            function _cancelTween(){
                if(tobj.id==null){return;}
                if(!window.requestAnimationFrame){clearTimeout(tobj.id);
                }else{window.cancelAnimationFrame(tobj.id);}
                tobj.id=null;
            }
            function _ease(t,b,c,d,type){
                switch(type){
                    case "linear": case "mcsLinear":
                        return c*t/d + b;
                        break;
                    case "mcsLinearOut":
                        t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
                        break;
                    case "easeInOutSmooth":
                        t/=d/2;
                        if(t<1) return c/2*t*t + b;
                        t--;
                        return -c/2 * (t*(t-2) - 1) + b;
                        break;
                    case "easeInOutStrong":
                        t/=d/2;
                        if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
                        t--;
                        return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
                        break;
                    case "easeInOut": case "mcsEaseInOut":
                        t/=d/2;
                        if(t<1) return c/2*t*t*t + b;
                        t-=2;
                        return c/2*(t*t*t + 2) + b;
                        break;
                    case "easeOutSmooth":
                        t/=d; t--;
                        return -c * (t*t*t*t - 1) + b;
                        break;
                    case "easeOutStrong":
                        return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
                        break;
                    case "easeOut": case "mcsEaseOut": default:
                        var ts=(t/=d)*t,tc=ts*t;
                        return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
                }
            }
        },
        /* -------------------- */


        /* returns current time */
        _getTime=function(){
            if(window.performance && window.performance.now){
                return window.performance.now();
            }else{
                if(window.performance && window.performance.webkitNow){
                    return window.performance.webkitNow();
                }else{
                    if(Date.now){return Date.now();}else{return new Date().getTime();}
                }
            }
        },
        /* -------------------- */


        /* stops a tween */
        _stopTween=function(){
            var el=this;
            if(!el._mTween){el._mTween={top:{},left:{}};}
            var props=["top","left"];
            for(var i=0; i<props.length; i++){
                var prop=props[i];
                if(el._mTween[prop].id){
                    if(!window.requestAnimationFrame){clearTimeout(el._mTween[prop].id);
                    }else{window.cancelAnimationFrame(el._mTween[prop].id);}
                    el._mTween[prop].id=null;
                    el._mTween[prop].stop=1;
                }
            }
        },
        /* -------------------- */


        /* deletes a property (avoiding the exception thrown by IE) */
        _delete=function(c,m){
            try{delete c[m];}catch(e){c[m]=null;}
        },
        /* -------------------- */


        /* detects left mouse button */
        _mouseBtnLeft=function(e){
            return !(e.which && e.which!==1);
        },
        /* -------------------- */


        /* detects if pointer type event is touch */
        _pointerTouch=function(e){
            var t=e.originalEvent.pointerType;
            return !(t && t!=="touch" && t!==2);
        },
        /* -------------------- */


        /* checks if value is numeric */
        _isNumeric=function(val){
            return !isNaN(parseFloat(val)) && isFinite(val);
        },
        /* -------------------- */


        /* returns element position according to content */
        _childPos=function(el){
            var p=el.parents(".mCSB_container");
            return [el.offset().top-p.offset().top,el.offset().left-p.offset().left];
        },
        /* -------------------- */


        /* checks if browser tab is hidden/inactive via Page Visibility API */
        _isTabHidden=function(){
            var prop=_getHiddenProp();
            if(!prop) return false;
            return document[prop];
            function _getHiddenProp(){
                var pfx=["webkit","moz","ms","o"];
                if("hidden" in document) return "hidden"; //natively supported
                for(var i=0; i<pfx.length; i++){ //prefixed
                    if((pfx[i]+"Hidden") in document)
                        return pfx[i]+"Hidden";
                }
                return null; //not supported
            }
        };
        /* -------------------- */





    /*
    ----------------------------------------
    PLUGIN SETUP
    ----------------------------------------
    */

    /* plugin constructor functions */
    $.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
        if(methods[method]){
            return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof method==="object" || !method){
            return methods.init.apply(this,arguments);
        }else{
            $.error("Method "+method+" does not exist");
        }
    };
    $[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
        if(methods[method]){
            return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
        }else if(typeof method==="object" || !method){
            return methods.init.apply(this,arguments);
        }else{
            $.error("Method "+method+" does not exist");
        }
    };

    /*
    allow setting plugin default options.
    usage: $.mCustomScrollbar.defaults.scrollInertia=500;
    to apply any changed default options on default selectors (below), use inside document ready fn
    e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
    */
    $[pluginNS].defaults=defaults;

    /*
    add window object (window.mCustomScrollbar)
    usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
    */
    window[pluginNS]=true;

    $(window).load(function(){

        $(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */

        /* extend jQuery expressions */
        $.extend($.expr[":"],{
            /* checks if element is within scrollable viewport */
            mcsInView:$.expr[":"].mcsInView || function(el){
                var $el=$(el),content=$el.parents(".mCSB_container"),wrapper,cPos;
                if(!content.length){return;}
                wrapper=content.parent();
                cPos=[content[0].offsetTop,content[0].offsetLeft];
                return  cPos[0]+_childPos($el)[0]>=0 && cPos[0]+_childPos($el)[0]<wrapper.height()-$el.outerHeight(false) &&
                        cPos[1]+_childPos($el)[1]>=0 && cPos[1]+_childPos($el)[1]<wrapper.width()-$el.outerWidth(false);
            },
            /* checks if element is overflowed having visible scrollbar(s) */
            mcsOverflow:$.expr[":"].mcsOverflow || function(el){
                var d=$(el).data(pluginPfx);
                if(!d){return;}
                return d.overflowed[0] || d.overflowed[1];
            }
        });

    });

}))}));
(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

/*!
 * clipboard.js v1.5.8
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Clipboard = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var matches = require('matches-selector')

module.exports = function (element, selector, checkYoSelf) {
  var parent = checkYoSelf ? element : element.parentNode

  while (parent && parent !== document) {
    if (matches(parent, selector)) return parent;
    parent = parent.parentNode
  }
}

},{"matches-selector":5}],2:[function(require,module,exports){
var closest = require('closest');

/**
 * Delegates event to a selector.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @param {Boolean} useCapture
 * @return {Object}
 */
function delegate(element, selector, type, callback, useCapture) {
    var listenerFn = listener.apply(this, arguments);

    element.addEventListener(type, listenerFn, useCapture);

    return {
        destroy: function() {
            element.removeEventListener(type, listenerFn, useCapture);
        }
    }
}

/**
 * Finds closest match and invokes callback.
 *
 * @param {Element} element
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Function}
 */
function listener(element, selector, type, callback) {
    return function(e) {
        e.delegateTarget = closest(e.target, selector, true);

        if (e.delegateTarget) {
            callback.call(element, e);
        }
    }
}

module.exports = delegate;

},{"closest":1}],3:[function(require,module,exports){
/**
 * Check if argument is a HTML element.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.node = function(value) {
    return value !== undefined
        && value instanceof HTMLElement
        && value.nodeType === 1;
};

/**
 * Check if argument is a list of HTML elements.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.nodeList = function(value) {
    var type = Object.prototype.toString.call(value);

    return value !== undefined
        && (type === '[object NodeList]' || type === '[object HTMLCollection]')
        && ('length' in value)
        && (value.length === 0 || exports.node(value[0]));
};

/**
 * Check if argument is a string.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.string = function(value) {
    return typeof value === 'string'
        || value instanceof String;
};

/**
 * Check if argument is a function.
 *
 * @param {Object} value
 * @return {Boolean}
 */
exports.fn = function(value) {
    var type = Object.prototype.toString.call(value);

    return type === '[object Function]';
};

},{}],4:[function(require,module,exports){
var is = require('./is');
var delegate = require('delegate');

/**
 * Validates all params and calls the right
 * listener function based on its target type.
 *
 * @param {String|HTMLElement|HTMLCollection|NodeList} target
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listen(target, type, callback) {
    if (!target && !type && !callback) {
        throw new Error('Missing required arguments');
    }

    if (!is.string(type)) {
        throw new TypeError('Second argument must be a String');
    }

    if (!is.fn(callback)) {
        throw new TypeError('Third argument must be a Function');
    }

    if (is.node(target)) {
        return listenNode(target, type, callback);
    }
    else if (is.nodeList(target)) {
        return listenNodeList(target, type, callback);
    }
    else if (is.string(target)) {
        return listenSelector(target, type, callback);
    }
    else {
        throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
    }
}

/**
 * Adds an event listener to a HTML element
 * and returns a remove listener function.
 *
 * @param {HTMLElement} node
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNode(node, type, callback) {
    node.addEventListener(type, callback);

    return {
        destroy: function() {
            node.removeEventListener(type, callback);
        }
    }
}

/**
 * Add an event listener to a list of HTML elements
 * and returns a remove listener function.
 *
 * @param {NodeList|HTMLCollection} nodeList
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenNodeList(nodeList, type, callback) {
    Array.prototype.forEach.call(nodeList, function(node) {
        node.addEventListener(type, callback);
    });

    return {
        destroy: function() {
            Array.prototype.forEach.call(nodeList, function(node) {
                node.removeEventListener(type, callback);
            });
        }
    }
}

/**
 * Add an event listener to a selector
 * and returns a remove listener function.
 *
 * @param {String} selector
 * @param {String} type
 * @param {Function} callback
 * @return {Object}
 */
function listenSelector(selector, type, callback) {
    return delegate(document.body, selector, type, callback);
}

module.exports = listen;

},{"./is":3,"delegate":2}],5:[function(require,module,exports){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],6:[function(require,module,exports){
function select(element) {
    var selectedText;

    if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        element.focus();
        element.setSelectionRange(0, element.value.length);

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection = window.getSelection();
        var range = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
}

module.exports = select;

},{}],7:[function(require,module,exports){
function E () {
	// Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
	on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],8:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _select = require('select');

var _select2 = _interopRequireDefault(_select);

/**
 * Inner class which performs selection from either `text` or `target`
 * properties and then executes copy or cut operations.
 */

var ClipboardAction = (function () {
    /**
     * @param {Object} options
     */

    function ClipboardAction(options) {
        _classCallCheck(this, ClipboardAction);

        this.resolveOptions(options);
        this.initSelection();
    }

    /**
     * Defines base properties passed from constructor.
     * @param {Object} options
     */

    ClipboardAction.prototype.resolveOptions = function resolveOptions() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.action = options.action;
        this.emitter = options.emitter;
        this.target = options.target;
        this.text = options.text;
        this.trigger = options.trigger;

        this.selectedText = '';
    };

    /**
     * Decides which selection strategy is going to be applied based
     * on the existence of `text` and `target` properties.
     */

    ClipboardAction.prototype.initSelection = function initSelection() {
        if (this.text && this.target) {
            throw new Error('Multiple attributes declared, use either "target" or "text"');
        } else if (this.text) {
            this.selectFake();
        } else if (this.target) {
            this.selectTarget();
        } else {
            throw new Error('Missing required attributes, use either "target" or "text"');
        }
    };

    /**
     * Creates a fake textarea element, sets its value from `text` property,
     * and makes a selection on it.
     */

    ClipboardAction.prototype.selectFake = function selectFake() {
        var _this = this;

        var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

        this.removeFake();

        this.fakeHandler = document.body.addEventListener('click', function () {
            return _this.removeFake();
        });

        this.fakeElem = document.createElement('textarea');
        // Prevent zooming on iOS
        this.fakeElem.style.fontSize = '12pt';
        // Reset box model
        this.fakeElem.style.border = '0';
        this.fakeElem.style.padding = '0';
        this.fakeElem.style.margin = '0';
        // Move element out of screen horizontally
        this.fakeElem.style.position = 'absolute';
        this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
        // Move element to the same position vertically
        this.fakeElem.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px';
        this.fakeElem.setAttribute('readonly', '');
        this.fakeElem.value = this.text;

        document.body.appendChild(this.fakeElem);

        this.selectedText = _select2['default'](this.fakeElem);
        this.copyText();
    };

    /**
     * Only removes the fake element after another click event, that way
     * a user can hit `Ctrl+C` to copy because selection still exists.
     */

    ClipboardAction.prototype.removeFake = function removeFake() {
        if (this.fakeHandler) {
            document.body.removeEventListener('click');
            this.fakeHandler = null;
        }

        if (this.fakeElem) {
            document.body.removeChild(this.fakeElem);
            this.fakeElem = null;
        }
    };

    /**
     * Selects the content from element passed on `target` property.
     */

    ClipboardAction.prototype.selectTarget = function selectTarget() {
        this.selectedText = _select2['default'](this.target);
        this.copyText();
    };

    /**
     * Executes the copy operation based on the current selection.
     */

    ClipboardAction.prototype.copyText = function copyText() {
        var succeeded = undefined;

        try {
            succeeded = document.execCommand(this.action);
        } catch (err) {
            succeeded = false;
        }

        this.handleResult(succeeded);
    };

    /**
     * Fires an event based on the copy operation result.
     * @param {Boolean} succeeded
     */

    ClipboardAction.prototype.handleResult = function handleResult(succeeded) {
        if (succeeded) {
            this.emitter.emit('success', {
                action: this.action,
                text: this.selectedText,
                trigger: this.trigger,
                clearSelection: this.clearSelection.bind(this)
            });
        } else {
            this.emitter.emit('error', {
                action: this.action,
                trigger: this.trigger,
                clearSelection: this.clearSelection.bind(this)
            });
        }
    };

    /**
     * Removes current selection and focus from `target` element.
     */

    ClipboardAction.prototype.clearSelection = function clearSelection() {
        if (this.target) {
            this.target.blur();
        }

        window.getSelection().removeAllRanges();
    };

    /**
     * Sets the `action` to be performed which can be either 'copy' or 'cut'.
     * @param {String} action
     */

    /**
     * Destroy lifecycle.
     */

    ClipboardAction.prototype.destroy = function destroy() {
        this.removeFake();
    };

    _createClass(ClipboardAction, [{
        key: 'action',
        set: function set() {
            var action = arguments.length <= 0 || arguments[0] === undefined ? 'copy' : arguments[0];

            this._action = action;

            if (this._action !== 'copy' && this._action !== 'cut') {
                throw new Error('Invalid "action" value, use either "copy" or "cut"');
            }
        },

        /**
         * Gets the `action` property.
         * @return {String}
         */
        get: function get() {
            return this._action;
        }

        /**
         * Sets the `target` property using an element
         * that will be have its content copied.
         * @param {Element} target
         */
    }, {
        key: 'target',
        set: function set(target) {
            if (target !== undefined) {
                if (target && typeof target === 'object' && target.nodeType === 1) {
                    this._target = target;
                } else {
                    throw new Error('Invalid "target" value, use a valid Element');
                }
            }
        },

        /**
         * Gets the `target` property.
         * @return {String|HTMLElement}
         */
        get: function get() {
            return this._target;
        }
    }]);

    return ClipboardAction;
})();

exports['default'] = ClipboardAction;
module.exports = exports['default'];

},{"select":6}],9:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _clipboardAction = require('./clipboard-action');

var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

var _tinyEmitter = require('tiny-emitter');

var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

var _goodListener = require('good-listener');

var _goodListener2 = _interopRequireDefault(_goodListener);

/**
 * Base class which takes one or more elements, adds event listeners to them,
 * and instantiates a new `ClipboardAction` on each click.
 */

var Clipboard = (function (_Emitter) {
    _inherits(Clipboard, _Emitter);

    /**
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     * @param {Object} options
     */

    function Clipboard(trigger, options) {
        _classCallCheck(this, Clipboard);

        _Emitter.call(this);

        this.resolveOptions(options);
        this.listenClick(trigger);
    }

    /**
     * Helper function to retrieve attribute value.
     * @param {String} suffix
     * @param {Element} element
     */

    /**
     * Defines if attributes would be resolved using internal setter functions
     * or custom functions that were passed in the constructor.
     * @param {Object} options
     */

    Clipboard.prototype.resolveOptions = function resolveOptions() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
        this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
        this.text = typeof options.text === 'function' ? options.text : this.defaultText;
    };

    /**
     * Adds a click event listener to the passed trigger.
     * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
     */

    Clipboard.prototype.listenClick = function listenClick(trigger) {
        var _this = this;

        this.listener = _goodListener2['default'](trigger, 'click', function (e) {
            return _this.onClick(e);
        });
    };

    /**
     * Defines a new `ClipboardAction` on each click event.
     * @param {Event} e
     */

    Clipboard.prototype.onClick = function onClick(e) {
        var trigger = e.delegateTarget || e.currentTarget;

        if (this.clipboardAction) {
            this.clipboardAction = null;
        }

        this.clipboardAction = new _clipboardAction2['default']({
            action: this.action(trigger),
            target: this.target(trigger),
            text: this.text(trigger),
            trigger: trigger,
            emitter: this
        });
    };

    /**
     * Default `action` lookup function.
     * @param {Element} trigger
     */

    Clipboard.prototype.defaultAction = function defaultAction(trigger) {
        return getAttributeValue('action', trigger);
    };

    /**
     * Default `target` lookup function.
     * @param {Element} trigger
     */

    Clipboard.prototype.defaultTarget = function defaultTarget(trigger) {
        var selector = getAttributeValue('target', trigger);

        if (selector) {
            return document.querySelector(selector);
        }
    };

    /**
     * Default `text` lookup function.
     * @param {Element} trigger
     */

    Clipboard.prototype.defaultText = function defaultText(trigger) {
        return getAttributeValue('text', trigger);
    };

    /**
     * Destroy lifecycle.
     */

    Clipboard.prototype.destroy = function destroy() {
        this.listener.destroy();

        if (this.clipboardAction) {
            this.clipboardAction.destroy();
            this.clipboardAction = null;
        }
    };

    return Clipboard;
})(_tinyEmitter2['default']);

exports['default'] = Clipboard;
function getAttributeValue(suffix, element) {
    var attribute = 'data-clipboard-' + suffix;

    if (!element.hasAttribute(attribute)) {
        return;
    }

    return element.getAttribute(attribute);
}
module.exports = exports['default'];

},{"./clipboard-action":8,"good-listener":4,"tiny-emitter":7}]},{},[9])(9)
});
var mainNav = (function ($) {

    var $nav = $('.main-nav');

    var mobileMaxWidth = 739;


    // OPEN ON PAGE LOAD
    var page = $('body').data('page');
    var $selectedNav = $nav.find('li[data-nav="'+ page +'"]');

    if($selectedNav.closest('.main-nav__dropdown').length){
        var $dropdown = $selectedNav.closest('.main-nav__dropdown')
        $dropdown.css('display', 'block').closest('.main-nav__primary').addClass('is-active');
    }

    $('.main-nav__primary').on('click', '> a', function(e){
        if ($(this).next('.main-nav__dropdown').length){
            e.preventDefault();
            toggleNav($(this).next('.main-nav__dropdown'));
        }
    });


    function toggleNav($dropdown){
        $dropdown.closest('.main-nav__primary').toggleClass('is-active');

        if ($dropdown.is(':hidden')){
            $dropdown.velocity('slideDown', { duration: 250 });
        }
        else {
            $dropdown.velocity('slideUp', { duration: 250 });
        }
    }


    // CUSTOM SCROLLBAR

    // Plugin acts funny with flexbox controlled height.
    // Need to set max-height and trigger update for it to behave

    function setNavMaxHeight(){
        var viewportHeight = $(window).height();
        var sideColRowHeight = $('.side-col__row').height();
        var navHeight = viewportHeight - sideColRowHeight;
        $nav.css('max-height', navHeight).mCustomScrollbar('update');
    }
    setNavMaxHeight();

    $(window).smartresize(function(){
        setNavMaxHeight();
    });


    $nav.mCustomScrollbar({
        theme: "minimal",
        scrollbarPosition: "outside",
        scrollIntertia: 1000,
        mouseWheel:{ preventDefault: true }
    });




    // === MOBILE
    $('.nav-toggle').on('click', function(){
        var $nav = $('.main-nav__wrap');
        if ($nav.is(':visible')){
            $nav.velocity('slideUp', {
                duration: 300,
                easing: [ 0.215, 0.61, 0.355, 1 ]
            });
        }
        else {
            $nav.velocity('slideDown', {
                duration: 300,
                easing: [ 0.215, 0.61, 0.355, 1 ]
            });
        }

        $('.hamburger').toggleClass('is-active');







    });




})(jQuery);


var pattern = (function ($) {


    var patternClipboard = new Clipboard('[data-markup-copy]', {
        text: function(trigger) {
            var $code = $(trigger).siblings('[data-markup]').find('code');
            return $code.text();
        }
    });

    patternClipboard.on('success', function(e) {
        $(e.trigger).addClass('is-success').find('use').attr('xlink:href', '#copy-success');

        resetIcon(e.trigger);
    });

    patternClipboard.on('error', function(e) {
        console.error('Action:', e.action);
        console.error('Trigger:', e.trigger);
    });

    function resetIcon(trigger) {
        setTimeout(function () {
            $(trigger).removeClass('is-success').find('use').attr('xlink:href', '#copy');
        }, 3000);
    }


})(jQuery);


var tabs = (function ($) {

    var activeClass = 'is-active';

    // SET INITIAL STATE
    $('[data-tabs]').each(function(){
        var $this = $(this);
        var activeTabIndex = $this.data('tabs-active') || 0;
        togglePanes($this, activeTabIndex);
    });


    // TAB CLICK
    $('[data-tabs]').on('click', '[data-tab]:not(.is-active)', function(){
       var $this = $(this);
       var $tabs = $this.closest('[data-tabs]');
       var tabIndex = $this.index();
       togglePanes($tabs, tabIndex);
    });


    function togglePanes($tabs, paneIndex){
        var $nav = $tabs.find('[data-tab-nav]');
        var $panes = $tabs.find('[data-tab-panes]');

        // Active classes
        $nav
            .find('[data-tab]:eq('+ paneIndex +')').addClass(activeClass)
            .siblings().removeClass(activeClass);

        // Toggle Panes
        $panes
            .find('[data-tab-pane]:eq('+ paneIndex +')').show()
            .siblings().hide();
    }



})(jQuery);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl8wMC12ZWxvY2l0eS5qcyIsIl8wMS1qcXVlcnkubUN1c3RvbVNjcm9sbGJhci5qcyIsIl8wMi1zbWFydC1yZXNpemUuanMiLCJfMDUtY2xpcGJvYXJkLmpzIiwiX21haW4tbmF2LmpzIiwiX3BhdHRlcm4uanMiLCJfdGFicy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzd5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4M0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJzdHlsZWd1aWRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFZlbG9jaXR5SlMub3JnICgxLjIuMykuIChDKSAyMDE0IEp1bGlhbiBTaGFwaXJvLiBNSVQgQGxpY2Vuc2U6IGVuLndpa2lwZWRpYS5vcmcvd2lraS9NSVRfTGljZW5zZSAqL1xyXG5cclxuLyoqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgVmVsb2NpdHkgalF1ZXJ5IFNoaW1cclxuKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbi8qISBWZWxvY2l0eUpTLm9yZyBqUXVlcnkgU2hpbSAoMS4wLjEpLiAoQykgMjAxNCBUaGUgalF1ZXJ5IEZvdW5kYXRpb24uIE1JVCBAbGljZW5zZTogZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlLiAqL1xyXG5cclxuLyogVGhpcyBmaWxlIGNvbnRhaW5zIHRoZSBqUXVlcnkgZnVuY3Rpb25zIHRoYXQgVmVsb2NpdHkgcmVsaWVzIG9uLCB0aGVyZWJ5IHJlbW92aW5nIFZlbG9jaXR5J3MgZGVwZW5kZW5jeSBvbiBhIGZ1bGwgY29weSBvZiBqUXVlcnksIGFuZCBhbGxvd2luZyBpdCB0byB3b3JrIGluIGFueSBlbnZpcm9ubWVudC4gKi9cclxuLyogVGhlc2Ugc2hpbW1lZCBmdW5jdGlvbnMgYXJlIG9ubHkgdXNlZCBpZiBqUXVlcnkgaXNuJ3QgcHJlc2VudC4gSWYgYm90aCB0aGlzIHNoaW0gYW5kIGpRdWVyeSBhcmUgbG9hZGVkLCBWZWxvY2l0eSBkZWZhdWx0cyB0byBqUXVlcnkgcHJvcGVyLiAqL1xyXG4vKiBCcm93c2VyIHN1cHBvcnQ6IFVzaW5nIHRoaXMgc2hpbSBpbnN0ZWFkIG9mIGpRdWVyeSBwcm9wZXIgcmVtb3ZlcyBzdXBwb3J0IGZvciBJRTguICovXHJcblxyXG47KGZ1bmN0aW9uICh3aW5kb3cpIHtcclxuICAgIC8qKioqKioqKioqKioqKipcclxuICAgICAgICAgU2V0dXBcclxuICAgICoqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAvKiBJZiBqUXVlcnkgaXMgYWxyZWFkeSBsb2FkZWQsIHRoZXJlJ3Mgbm8gcG9pbnQgaW4gbG9hZGluZyB0aGlzIHNoaW0uICovXHJcbiAgICBpZiAod2luZG93LmpRdWVyeSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvKiBqUXVlcnkgYmFzZS4gKi9cclxuICAgIHZhciAkID0gZnVuY3Rpb24gKHNlbGVjdG9yLCBjb250ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyAkLmZuLmluaXQoc2VsZWN0b3IsIGNvbnRleHQpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgIFByaXZhdGUgTWV0aG9kc1xyXG4gICAgKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLyogalF1ZXJ5ICovXHJcbiAgICAkLmlzV2luZG93ID0gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIC8qIGpzaGludCBlcWVxZXE6IGZhbHNlICovXHJcbiAgICAgICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIG9iaiA9PSBvYmoud2luZG93O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiBqUXVlcnkgKi9cclxuICAgICQudHlwZSA9IGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICBpZiAob2JqID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG9iaiArIFwiXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2Ygb2JqID09PSBcImZ1bmN0aW9uXCIgP1xyXG4gICAgICAgICAgICBjbGFzczJ0eXBlW3RvU3RyaW5nLmNhbGwob2JqKV0gfHwgXCJvYmplY3RcIiA6XHJcbiAgICAgICAgICAgIHR5cGVvZiBvYmo7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIGpRdWVyeSAqL1xyXG4gICAgJC5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgcmV0dXJuICQudHlwZShvYmopID09PSBcImFycmF5XCI7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIGpRdWVyeSAqL1xyXG4gICAgZnVuY3Rpb24gaXNBcnJheWxpa2UgKG9iaikge1xyXG4gICAgICAgIHZhciBsZW5ndGggPSBvYmoubGVuZ3RoLFxyXG4gICAgICAgICAgICB0eXBlID0gJC50eXBlKG9iaik7XHJcblxyXG4gICAgICAgIGlmICh0eXBlID09PSBcImZ1bmN0aW9uXCIgfHwgJC5pc1dpbmRvdyhvYmopKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvYmoubm9kZVR5cGUgPT09IDEgJiYgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHR5cGUgPT09IFwiYXJyYXlcIiB8fCBsZW5ndGggPT09IDAgfHwgdHlwZW9mIGxlbmd0aCA9PT0gXCJudW1iZXJcIiAmJiBsZW5ndGggPiAwICYmIChsZW5ndGggLSAxKSBpbiBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKlxyXG4gICAgICAgJCBNZXRob2RzXHJcbiAgICAqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLyogalF1ZXJ5OiBTdXBwb3J0IHJlbW92ZWQgZm9yIElFPDkuICovXHJcbiAgICAkLmlzUGxhaW5PYmplY3QgPSBmdW5jdGlvbiAob2JqKSB7XHJcbiAgICAgICAgdmFyIGtleTtcclxuXHJcbiAgICAgICAgaWYgKCFvYmogfHwgJC50eXBlKG9iaikgIT09IFwib2JqZWN0XCIgfHwgb2JqLm5vZGVUeXBlIHx8ICQuaXNXaW5kb3cob2JqKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAob2JqLmNvbnN0cnVjdG9yICYmXHJcbiAgICAgICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLCBcImNvbnN0cnVjdG9yXCIpICYmXHJcbiAgICAgICAgICAgICAgICAhaGFzT3duLmNhbGwob2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgXCJpc1Byb3RvdHlwZU9mXCIpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoa2V5IGluIG9iaikge31cclxuXHJcbiAgICAgICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkIHx8IGhhc093bi5jYWxsKG9iaiwga2V5KTtcclxuICAgIH07XHJcblxyXG4gICAgLyogalF1ZXJ5ICovXHJcbiAgICAkLmVhY2ggPSBmdW5jdGlvbihvYmosIGNhbGxiYWNrLCBhcmdzKSB7XHJcbiAgICAgICAgdmFyIHZhbHVlLFxyXG4gICAgICAgICAgICBpID0gMCxcclxuICAgICAgICAgICAgbGVuZ3RoID0gb2JqLmxlbmd0aCxcclxuICAgICAgICAgICAgaXNBcnJheSA9IGlzQXJyYXlsaWtlKG9iaik7XHJcblxyXG4gICAgICAgIGlmIChhcmdzKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5hcHBseShvYmpbaV0sIGFyZ3MpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSBpbiBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGNhbGxiYWNrLmFwcGx5KG9ialtpXSwgYXJncyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChpc0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5jYWxsKG9ialtpXSwgaSwgb2JqW2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5jYWxsKG9ialtpXSwgaSwgb2JqW2ldKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIEN1c3RvbSAqL1xyXG4gICAgJC5kYXRhID0gZnVuY3Rpb24gKG5vZGUsIGtleSwgdmFsdWUpIHtcclxuICAgICAgICAvKiAkLmdldERhdGEoKSAqL1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBpZCA9IG5vZGVbJC5leHBhbmRvXSxcclxuICAgICAgICAgICAgICAgIHN0b3JlID0gaWQgJiYgY2FjaGVbaWRdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RvcmUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgaW4gc3RvcmUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RvcmVba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIC8qICQuc2V0RGF0YSgpICovXHJcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgaWQgPSBub2RlWyQuZXhwYW5kb10gfHwgKG5vZGVbJC5leHBhbmRvXSA9ICsrJC51dWlkKTtcclxuXHJcbiAgICAgICAgICAgIGNhY2hlW2lkXSA9IGNhY2hlW2lkXSB8fCB7fTtcclxuICAgICAgICAgICAgY2FjaGVbaWRdW2tleV0gPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIEN1c3RvbSAqL1xyXG4gICAgJC5yZW1vdmVEYXRhID0gZnVuY3Rpb24gKG5vZGUsIGtleXMpIHtcclxuICAgICAgICB2YXIgaWQgPSBub2RlWyQuZXhwYW5kb10sXHJcbiAgICAgICAgICAgIHN0b3JlID0gaWQgJiYgY2FjaGVbaWRdO1xyXG5cclxuICAgICAgICBpZiAoc3RvcmUpIHtcclxuICAgICAgICAgICAgJC5lYWNoKGtleXMsIGZ1bmN0aW9uKF8sIGtleSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHN0b3JlW2tleV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyogalF1ZXJ5ICovXHJcbiAgICAkLmV4dGVuZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc3JjLCBjb3B5SXNBcnJheSwgY29weSwgbmFtZSwgb3B0aW9ucywgY2xvbmUsXHJcbiAgICAgICAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1swXSB8fCB7fSxcclxuICAgICAgICAgICAgaSA9IDEsXHJcbiAgICAgICAgICAgIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGRlZXAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwiYm9vbGVhblwiKSB7XHJcbiAgICAgICAgICAgIGRlZXAgPSB0YXJnZXQ7XHJcblxyXG4gICAgICAgICAgICB0YXJnZXQgPSBhcmd1bWVudHNbaV0gfHwge307XHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSBcIm9iamVjdFwiICYmICQudHlwZSh0YXJnZXQpICE9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgdGFyZ2V0ID0ge307XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaSA9PT0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGktLTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKChvcHRpb25zID0gYXJndW1lbnRzW2ldKSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKG5hbWUgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyYyA9IHRhcmdldFtuYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICBjb3B5ID0gb3B0aW9uc1tuYW1lXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gY29weSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkZWVwICYmIGNvcHkgJiYgKCQuaXNQbGFpbk9iamVjdChjb3B5KSB8fCAoY29weUlzQXJyYXkgPSAkLmlzQXJyYXkoY29weSkpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29weUlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvcHlJc0FycmF5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9uZSA9IHNyYyAmJiAkLmlzQXJyYXkoc3JjKSA/IHNyYyA6IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsb25lID0gc3JjICYmICQuaXNQbGFpbk9iamVjdChzcmMpID8gc3JjIDoge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFtuYW1lXSA9ICQuZXh0ZW5kKGRlZXAsIGNsb25lLCBjb3B5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb3B5ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0W25hbWVdID0gY29weTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIGpRdWVyeSAxLjQuMyAqL1xyXG4gICAgJC5xdWV1ZSA9IGZ1bmN0aW9uIChlbGVtLCB0eXBlLCBkYXRhKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gJG1ha2VBcnJheSAoYXJyLCByZXN1bHRzKSB7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSByZXN1bHRzIHx8IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFyciAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNBcnJheWxpa2UoT2JqZWN0KGFycikpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogJC5tZXJnZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbihmaXJzdCwgc2Vjb25kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsZW4gPSArc2Vjb25kLmxlbmd0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGogPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaSA9IGZpcnN0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlIChqIDwgbGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaXJzdFtpKytdID0gc2Vjb25kW2orK107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW4gIT09IGxlbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHNlY29uZFtqXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlyc3RbaSsrXSA9IHNlY29uZFtqKytdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaXJzdC5sZW5ndGggPSBpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZpcnN0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pKHJldCwgdHlwZW9mIGFyciA9PT0gXCJzdHJpbmdcIiA/IFthcnJdIDogYXJyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgW10ucHVzaC5jYWxsKHJldCwgYXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghZWxlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0eXBlID0gKHR5cGUgfHwgXCJmeFwiKSArIFwicXVldWVcIjtcclxuXHJcbiAgICAgICAgdmFyIHEgPSAkLmRhdGEoZWxlbSwgdHlwZSk7XHJcblxyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcSB8fCBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghcSB8fCAkLmlzQXJyYXkoZGF0YSkpIHtcclxuICAgICAgICAgICAgcSA9ICQuZGF0YShlbGVtLCB0eXBlLCAkbWFrZUFycmF5KGRhdGEpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBxLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcTtcclxuICAgIH07XHJcblxyXG4gICAgLyogalF1ZXJ5IDEuNC4zICovXHJcbiAgICAkLmRlcXVldWUgPSBmdW5jdGlvbiAoZWxlbXMsIHR5cGUpIHtcclxuICAgICAgICAvKiBDdXN0b206IEVtYmVkIGVsZW1lbnQgaXRlcmF0aW9uLiAqL1xyXG4gICAgICAgICQuZWFjaChlbGVtcy5ub2RlVHlwZSA/IFsgZWxlbXMgXSA6IGVsZW1zLCBmdW5jdGlvbihpLCBlbGVtKSB7XHJcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlIHx8IFwiZnhcIjtcclxuXHJcbiAgICAgICAgICAgIHZhciBxdWV1ZSA9ICQucXVldWUoZWxlbSwgdHlwZSksXHJcbiAgICAgICAgICAgICAgICBmbiA9IHF1ZXVlLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZm4gPT09IFwiaW5wcm9ncmVzc1wiKSB7XHJcbiAgICAgICAgICAgICAgICBmbiA9IHF1ZXVlLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmbikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGUgPT09IFwiZnhcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLnVuc2hpZnQoXCJpbnByb2dyZXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGZuLmNhbGwoZWxlbSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5kZXF1ZXVlKGVsZW0sIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgJC5mbiBNZXRob2RzXHJcbiAgICAqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLyogalF1ZXJ5ICovXHJcbiAgICAkLmZuID0gJC5wcm90b3R5cGUgPSB7XHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIC8qIEp1c3QgcmV0dXJuIHRoZSBlbGVtZW50IHdyYXBwZWQgaW5zaWRlIGFuIGFycmF5OyBkb24ndCBwcm9jZWVkIHdpdGggdGhlIGFjdHVhbCBqUXVlcnkgbm9kZSB3cmFwcGluZyBwcm9jZXNzLiAqL1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0b3Iubm9kZVR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbMF0gPSBzZWxlY3RvcjtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vdCBhIERPTSBub2RlLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG9mZnNldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvKiBqUXVlcnkgYWx0ZXJlZCBjb2RlOiBEcm9wcGVkIGRpc2Nvbm5lY3RlZCBET00gbm9kZSBjaGVja2luZy4gKi9cclxuICAgICAgICAgICAgdmFyIGJveCA9IHRoaXNbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0ID8gdGhpc1swXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSA6IHsgdG9wOiAwLCBsZWZ0OiAwIH07XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdG9wOiBib3gudG9wICsgKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5zY3JvbGxUb3AgIHx8IDApICAtIChkb2N1bWVudC5jbGllbnRUb3AgIHx8IDApLFxyXG4gICAgICAgICAgICAgICAgbGVmdDogYm94LmxlZnQgKyAod2luZG93LnBhZ2VYT2Zmc2V0IHx8IGRvY3VtZW50LnNjcm9sbExlZnQgIHx8IDApIC0gKGRvY3VtZW50LmNsaWVudExlZnQgfHwgMClcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBwb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvKiBqUXVlcnkgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gb2Zmc2V0UGFyZW50KCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldFBhcmVudCA9IHRoaXMub2Zmc2V0UGFyZW50IHx8IGRvY3VtZW50O1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChvZmZzZXRQYXJlbnQgJiYgKCFvZmZzZXRQYXJlbnQubm9kZVR5cGUudG9Mb3dlckNhc2UgPT09IFwiaHRtbFwiICYmIG9mZnNldFBhcmVudC5zdHlsZS5wb3NpdGlvbiA9PT0gXCJzdGF0aWNcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXRQYXJlbnQgPSBvZmZzZXRQYXJlbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBvZmZzZXRQYXJlbnQgfHwgZG9jdW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFplcHRvICovXHJcbiAgICAgICAgICAgIHZhciBlbGVtID0gdGhpc1swXSxcclxuICAgICAgICAgICAgICAgIG9mZnNldFBhcmVudCA9IG9mZnNldFBhcmVudC5hcHBseShlbGVtKSxcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IHRoaXMub2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICBwYXJlbnRPZmZzZXQgPSAvXig/OmJvZHl8aHRtbCkkL2kudGVzdChvZmZzZXRQYXJlbnQubm9kZU5hbWUpID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6ICQob2Zmc2V0UGFyZW50KS5vZmZzZXQoKVxyXG5cclxuICAgICAgICAgICAgb2Zmc2V0LnRvcCAtPSBwYXJzZUZsb2F0KGVsZW0uc3R5bGUubWFyZ2luVG9wKSB8fCAwO1xyXG4gICAgICAgICAgICBvZmZzZXQubGVmdCAtPSBwYXJzZUZsb2F0KGVsZW0uc3R5bGUubWFyZ2luTGVmdCkgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChvZmZzZXRQYXJlbnQuc3R5bGUpIHtcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldC50b3AgKz0gcGFyc2VGbG9hdChvZmZzZXRQYXJlbnQuc3R5bGUuYm9yZGVyVG9wV2lkdGgpIHx8IDBcclxuICAgICAgICAgICAgICAgIHBhcmVudE9mZnNldC5sZWZ0ICs9IHBhcnNlRmxvYXQob2Zmc2V0UGFyZW50LnN0eWxlLmJvcmRlckxlZnRXaWR0aCkgfHwgMFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdG9wOiBvZmZzZXQudG9wIC0gcGFyZW50T2Zmc2V0LnRvcCxcclxuICAgICAgICAgICAgICAgIGxlZnQ6IG9mZnNldC5sZWZ0IC0gcGFyZW50T2Zmc2V0LmxlZnRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICBQcml2YXRlIFZhcmlhYmxlc1xyXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAvKiBGb3IgJC5kYXRhKCkgKi9cclxuICAgIHZhciBjYWNoZSA9IHt9O1xyXG4gICAgJC5leHBhbmRvID0gXCJ2ZWxvY2l0eVwiICsgKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcclxuICAgICQudXVpZCA9IDA7XHJcblxyXG4gICAgLyogRm9yICQucXVldWUoKSAqL1xyXG4gICAgdmFyIGNsYXNzMnR5cGUgPSB7fSxcclxuICAgICAgICBoYXNPd24gPSBjbGFzczJ0eXBlLmhhc093blByb3BlcnR5LFxyXG4gICAgICAgIHRvU3RyaW5nID0gY2xhc3MydHlwZS50b1N0cmluZztcclxuXHJcbiAgICB2YXIgdHlwZXMgPSBcIkJvb2xlYW4gTnVtYmVyIFN0cmluZyBGdW5jdGlvbiBBcnJheSBEYXRlIFJlZ0V4cCBPYmplY3QgRXJyb3JcIi5zcGxpdChcIiBcIik7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY2xhc3MydHlwZVtcIltvYmplY3QgXCIgKyB0eXBlc1tpXSArIFwiXVwiXSA9IHR5cGVzW2ldLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyogTWFrZXMgJChub2RlKSBwb3NzaWJsZSwgd2l0aG91dCBoYXZpbmcgdG8gY2FsbCBpbml0LiAqL1xyXG4gICAgJC5mbi5pbml0LnByb3RvdHlwZSA9ICQuZm47XHJcblxyXG4gICAgLyogR2xvYmFsaXplIFZlbG9jaXR5IG9udG8gdGhlIHdpbmRvdywgYW5kIGFzc2lnbiBpdHMgVXRpbGl0aWVzIHByb3BlcnR5LiAqL1xyXG4gICAgd2luZG93LlZlbG9jaXR5ID0geyBVdGlsaXRpZXM6ICQgfTtcclxufSkod2luZG93KTtcclxuXHJcbi8qKioqKioqKioqKioqKioqKipcclxuICAgIFZlbG9jaXR5LmpzXHJcbioqKioqKioqKioqKioqKioqKi9cclxuXHJcbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHtcclxuICAgIC8qIENvbW1vbkpTIG1vZHVsZS4gKi9cclxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xyXG4gICAgLyogQU1EIG1vZHVsZS4gKi9cclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcclxuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XHJcbiAgICAvKiBCcm93c2VyIGdsb2JhbHMuICovXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZhY3RvcnkoKTtcclxuICAgIH1cclxufShmdW5jdGlvbigpIHtcclxucmV0dXJuIGZ1bmN0aW9uIChnbG9iYWwsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xyXG5cclxuICAgIC8qKioqKioqKioqKioqKipcclxuICAgICAgICBTdW1tYXJ5XHJcbiAgICAqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLypcclxuICAgIC0gQ1NTOiBDU1Mgc3RhY2sgdGhhdCB3b3JrcyBpbmRlcGVuZGVudGx5IGZyb20gdGhlIHJlc3Qgb2YgVmVsb2NpdHkuXHJcbiAgICAtIGFuaW1hdGUoKTogQ29yZSBhbmltYXRpb24gbWV0aG9kIHRoYXQgaXRlcmF0ZXMgb3ZlciB0aGUgdGFyZ2V0ZWQgZWxlbWVudHMgYW5kIHF1ZXVlcyB0aGUgaW5jb21pbmcgY2FsbCBvbnRvIGVhY2ggZWxlbWVudCBpbmRpdmlkdWFsbHkuXHJcbiAgICAgIC0gUHJlLVF1ZXVlaW5nOiBQcmVwYXJlIHRoZSBlbGVtZW50IGZvciBhbmltYXRpb24gYnkgaW5zdGFudGlhdGluZyBpdHMgZGF0YSBjYWNoZSBhbmQgcHJvY2Vzc2luZyB0aGUgY2FsbCdzIG9wdGlvbnMuXHJcbiAgICAgIC0gUXVldWVpbmc6IFRoZSBsb2dpYyB0aGF0IHJ1bnMgb25jZSB0aGUgY2FsbCBoYXMgcmVhY2hlZCBpdHMgcG9pbnQgb2YgZXhlY3V0aW9uIGluIHRoZSBlbGVtZW50J3MgJC5xdWV1ZSgpIHN0YWNrLlxyXG4gICAgICAgICAgICAgICAgICBNb3N0IGxvZ2ljIGlzIHBsYWNlZCBoZXJlIHRvIGF2b2lkIHJpc2tpbmcgaXQgYmVjb21pbmcgc3RhbGUgKGlmIHRoZSBlbGVtZW50J3MgcHJvcGVydGllcyBoYXZlIGNoYW5nZWQpLlxyXG4gICAgICAtIFB1c2hpbmc6IENvbnNvbGlkYXRpb24gb2YgdGhlIHR3ZWVuIGRhdGEgZm9sbG93ZWQgYnkgaXRzIHB1c2ggb250byB0aGUgZ2xvYmFsIGluLXByb2dyZXNzIGNhbGxzIGNvbnRhaW5lci5cclxuICAgIC0gdGljaygpOiBUaGUgc2luZ2xlIHJlcXVlc3RBbmltYXRpb25GcmFtZSBsb29wIHJlc3BvbnNpYmxlIGZvciB0d2VlbmluZyBhbGwgaW4tcHJvZ3Jlc3MgY2FsbHMuXHJcbiAgICAtIGNvbXBsZXRlQ2FsbCgpOiBIYW5kbGVzIHRoZSBjbGVhbnVwIHByb2Nlc3MgZm9yIGVhY2ggVmVsb2NpdHkgY2FsbC5cclxuICAgICovXHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgSGVscGVyIEZ1bmN0aW9uc1xyXG4gICAgKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgIC8qIElFIGRldGVjdGlvbi4gR2lzdDogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vanVsaWFuc2hhcGlyby85MDk4NjA5ICovXHJcbiAgICB2YXIgSUUgPSAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmRvY3VtZW50TW9kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSA3OyBpID4gNDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkaXYuaW5uZXJIVE1MID0gXCI8IS0tW2lmIElFIFwiICsgaSArIFwiXT48c3Bhbj48L3NwYW4+PCFbZW5kaWZdLS0+XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGRpdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNwYW5cIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGl2ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8qIHJBRiBzaGltLiBHaXN0OiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9qdWxpYW5zaGFwaXJvLzk0OTc1MTMgKi9cclxuICAgIHZhciByQUZTaGltID0gKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0aW1lTGFzdCA9IDA7XHJcblxyXG4gICAgICAgIHJldHVybiB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgZnVuY3Rpb24oY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdmFyIHRpbWVDdXJyZW50ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKSxcclxuICAgICAgICAgICAgICAgIHRpbWVEZWx0YTtcclxuXHJcbiAgICAgICAgICAgIC8qIER5bmFtaWNhbGx5IHNldCBkZWxheSBvbiBhIHBlci10aWNrIGJhc2lzIHRvIG1hdGNoIDYwZnBzLiAqL1xyXG4gICAgICAgICAgICAvKiBUZWNobmlxdWUgYnkgRXJpayBNb2xsZXIuIE1JVCBsaWNlbnNlOiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MSAqL1xyXG4gICAgICAgICAgICB0aW1lRGVsdGEgPSBNYXRoLm1heCgwLCAxNiAtICh0aW1lQ3VycmVudCAtIHRpbWVMYXN0KSk7XHJcbiAgICAgICAgICAgIHRpbWVMYXN0ID0gdGltZUN1cnJlbnQgKyB0aW1lRGVsdGE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2sodGltZUN1cnJlbnQgKyB0aW1lRGVsdGEpOyB9LCB0aW1lRGVsdGEpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8qIEFycmF5IGNvbXBhY3RpbmcuIENvcHlyaWdodCBMby1EYXNoLiBNSVQgTGljZW5zZTogaHR0cHM6Ly9naXRodWIuY29tL2xvZGFzaC9sb2Rhc2gvYmxvYi9tYXN0ZXIvTElDRU5TRS50eHQgKi9cclxuICAgIGZ1bmN0aW9uIGNvbXBhY3RTcGFyc2VBcnJheSAoYXJyYXkpIHtcclxuICAgICAgICB2YXIgaW5kZXggPSAtMSxcclxuICAgICAgICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxyXG4gICAgICAgICAgICByZXN1bHQgPSBbXTtcclxuXHJcbiAgICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gYXJyYXlbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2FuaXRpemVFbGVtZW50cyAoZWxlbWVudHMpIHtcclxuICAgICAgICAvKiBVbndyYXAgalF1ZXJ5L1plcHRvIG9iamVjdHMuICovXHJcbiAgICAgICAgaWYgKFR5cGUuaXNXcmFwcGVkKGVsZW1lbnRzKSkge1xyXG4gICAgICAgICAgICBlbGVtZW50cyA9IFtdLnNsaWNlLmNhbGwoZWxlbWVudHMpO1xyXG4gICAgICAgIC8qIFdyYXAgYSBzaW5nbGUgZWxlbWVudCBpbiBhbiBhcnJheSBzbyB0aGF0ICQuZWFjaCgpIGNhbiBpdGVyYXRlIHdpdGggdGhlIGVsZW1lbnQgaW5zdGVhZCBvZiBpdHMgbm9kZSdzIGNoaWxkcmVuLiAqL1xyXG4gICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc05vZGUoZWxlbWVudHMpKSB7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzID0gWyBlbGVtZW50cyBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBUeXBlID0ge1xyXG4gICAgICAgIGlzU3RyaW5nOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFyaWFibGUgPT09IFwic3RyaW5nXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAodmFyaWFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YXJpYWJsZSkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzRnVuY3Rpb246IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKSA9PT0gXCJbb2JqZWN0IEZ1bmN0aW9uXVwiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgaXNOb2RlOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhcmlhYmxlICYmIHZhcmlhYmxlLm5vZGVUeXBlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogQ29weXJpZ2h0IE1hcnRpbiBCb2htLiBNSVQgTGljZW5zZTogaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vVG9tYWxhay84MThhNzhhMjI2YTA3MzhlYWFkZSAqL1xyXG4gICAgICAgIGlzTm9kZUxpc3Q6IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhcmlhYmxlID09PSBcIm9iamVjdFwiICYmXHJcbiAgICAgICAgICAgICAgICAvXlxcW29iamVjdCAoSFRNTENvbGxlY3Rpb258Tm9kZUxpc3R8T2JqZWN0KVxcXSQvLnRlc3QoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKSkgJiZcclxuICAgICAgICAgICAgICAgIHZhcmlhYmxlLmxlbmd0aCAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgICAgICAodmFyaWFibGUubGVuZ3RoID09PSAwIHx8ICh0eXBlb2YgdmFyaWFibGVbMF0gPT09IFwib2JqZWN0XCIgJiYgdmFyaWFibGVbMF0ubm9kZVR5cGUgPiAwKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiBEZXRlcm1pbmUgaWYgdmFyaWFibGUgaXMgYSB3cmFwcGVkIGpRdWVyeSBvciBaZXB0byBlbGVtZW50LiAqL1xyXG4gICAgICAgIGlzV3JhcHBlZDogZnVuY3Rpb24gKHZhcmlhYmxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2YXJpYWJsZSAmJiAodmFyaWFibGUuanF1ZXJ5IHx8ICh3aW5kb3cuWmVwdG8gJiYgd2luZG93LlplcHRvLnplcHRvLmlzWih2YXJpYWJsZSkpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzU1ZHOiBmdW5jdGlvbiAodmFyaWFibGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5TVkdFbGVtZW50ICYmICh2YXJpYWJsZSBpbnN0YW5jZW9mIHdpbmRvdy5TVkdFbGVtZW50KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGlzRW1wdHlPYmplY3Q6IGZ1bmN0aW9uICh2YXJpYWJsZSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIHZhcmlhYmxlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqXHJcbiAgICAgICBEZXBlbmRlbmNpZXNcclxuICAgICoqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgIHZhciAkLFxyXG4gICAgICAgIGlzSlF1ZXJ5ID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKGdsb2JhbC5mbiAmJiBnbG9iYWwuZm4uanF1ZXJ5KSB7XHJcbiAgICAgICAgJCA9IGdsb2JhbDtcclxuICAgICAgICBpc0pRdWVyeSA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICQgPSB3aW5kb3cuVmVsb2NpdHkuVXRpbGl0aWVzO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChJRSA8PSA4ICYmICFpc0pRdWVyeSkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlZlbG9jaXR5OiBJRTggYW5kIGJlbG93IHJlcXVpcmUgalF1ZXJ5IHRvIGJlIGxvYWRlZCBiZWZvcmUgVmVsb2NpdHkuXCIpO1xyXG4gICAgfSBlbHNlIGlmIChJRSA8PSA3KSB7XHJcbiAgICAgICAgLyogUmV2ZXJ0IHRvIGpRdWVyeSdzICQuYW5pbWF0ZSgpLCBhbmQgbG9zZSBWZWxvY2l0eSdzIGV4dHJhIGZlYXR1cmVzLiAqL1xyXG4gICAgICAgIGpRdWVyeS5mbi52ZWxvY2l0eSA9IGpRdWVyeS5mbi5hbmltYXRlO1xyXG5cclxuICAgICAgICAvKiBOb3cgdGhhdCAkLmZuLnZlbG9jaXR5IGlzIGFsaWFzZWQsIGFib3J0IHRoaXMgVmVsb2NpdHkgZGVjbGFyYXRpb24uICovXHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKlxyXG4gICAgICAgIENvbnN0YW50c1xyXG4gICAgKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgdmFyIERVUkFUSU9OX0RFRkFVTFQgPSA0MDAsXHJcbiAgICAgICAgRUFTSU5HX0RFRkFVTFQgPSBcInN3aW5nXCI7XHJcblxyXG4gICAgLyoqKioqKioqKioqKipcclxuICAgICAgICBTdGF0ZVxyXG4gICAgKioqKioqKioqKioqKi9cclxuXHJcbiAgICB2YXIgVmVsb2NpdHkgPSB7XHJcbiAgICAgICAgLyogQ29udGFpbmVyIGZvciBwYWdlLXdpZGUgVmVsb2NpdHkgc3RhdGUgZGF0YS4gKi9cclxuICAgICAgICBTdGF0ZToge1xyXG4gICAgICAgICAgICAvKiBEZXRlY3QgbW9iaWxlIGRldmljZXMgdG8gZGV0ZXJtaW5lIGlmIG1vYmlsZUhBIHNob3VsZCBiZSB0dXJuZWQgb24uICovXHJcbiAgICAgICAgICAgIGlzTW9iaWxlOiAvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXHJcbiAgICAgICAgICAgIC8qIFRoZSBtb2JpbGVIQSBvcHRpb24ncyBiZWhhdmlvciBjaGFuZ2VzIG9uIG9sZGVyIEFuZHJvaWQgZGV2aWNlcyAoR2luZ2VyYnJlYWQsIHZlcnNpb25zIDIuMy4zLTIuMy43KS4gKi9cclxuICAgICAgICAgICAgaXNBbmRyb2lkOiAvQW5kcm9pZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXHJcbiAgICAgICAgICAgIGlzR2luZ2VyYnJlYWQ6IC9BbmRyb2lkIDJcXC4zXFwuWzMtN10vaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpLFxyXG4gICAgICAgICAgICBpc0Nocm9tZTogd2luZG93LmNocm9tZSxcclxuICAgICAgICAgICAgaXNGaXJlZm94OiAvRmlyZWZveC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCksXHJcbiAgICAgICAgICAgIC8qIENyZWF0ZSBhIGNhY2hlZCBlbGVtZW50IGZvciByZS11c2Ugd2hlbiBjaGVja2luZyBmb3IgQ1NTIHByb3BlcnR5IHByZWZpeGVzLiAqL1xyXG4gICAgICAgICAgICBwcmVmaXhFbGVtZW50OiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLFxyXG4gICAgICAgICAgICAvKiBDYWNoZSBldmVyeSBwcmVmaXggbWF0Y2ggdG8gYXZvaWQgcmVwZWF0aW5nIGxvb2t1cHMuICovXHJcbiAgICAgICAgICAgIHByZWZpeE1hdGNoZXM6IHt9LFxyXG4gICAgICAgICAgICAvKiBDYWNoZSB0aGUgYW5jaG9yIHVzZWQgZm9yIGFuaW1hdGluZyB3aW5kb3cgc2Nyb2xsaW5nLiAqL1xyXG4gICAgICAgICAgICBzY3JvbGxBbmNob3I6IG51bGwsXHJcbiAgICAgICAgICAgIC8qIENhY2hlIHRoZSBicm93c2VyLXNwZWNpZmljIHByb3BlcnR5IG5hbWVzIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2Nyb2xsIGFuY2hvci4gKi9cclxuICAgICAgICAgICAgc2Nyb2xsUHJvcGVydHlMZWZ0OiBudWxsLFxyXG4gICAgICAgICAgICBzY3JvbGxQcm9wZXJ0eVRvcDogbnVsbCxcclxuICAgICAgICAgICAgLyogS2VlcCB0cmFjayBvZiB3aGV0aGVyIG91ciBSQUYgdGljayBpcyBydW5uaW5nLiAqL1xyXG4gICAgICAgICAgICBpc1RpY2tpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAvKiBDb250YWluZXIgZm9yIGV2ZXJ5IGluLXByb2dyZXNzIGNhbGwgdG8gVmVsb2NpdHkuICovXHJcbiAgICAgICAgICAgIGNhbGxzOiBbXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogVmVsb2NpdHkncyBjdXN0b20gQ1NTIHN0YWNrLiBNYWRlIGdsb2JhbCBmb3IgdW5pdCB0ZXN0aW5nLiAqL1xyXG4gICAgICAgIENTUzogeyAvKiBEZWZpbmVkIGJlbG93LiAqLyB9LFxyXG4gICAgICAgIC8qIEEgc2hpbSBvZiB0aGUgalF1ZXJ5IHV0aWxpdHkgZnVuY3Rpb25zIHVzZWQgYnkgVmVsb2NpdHkgLS0gcHJvdmlkZWQgYnkgVmVsb2NpdHkncyBvcHRpb25hbCBqUXVlcnkgc2hpbS4gKi9cclxuICAgICAgICBVdGlsaXRpZXM6ICQsXHJcbiAgICAgICAgLyogQ29udGFpbmVyIGZvciB0aGUgdXNlcidzIGN1c3RvbSBhbmltYXRpb24gcmVkaXJlY3RzIHRoYXQgYXJlIHJlZmVyZW5jZWQgYnkgbmFtZSBpbiBwbGFjZSBvZiB0aGUgcHJvcGVydGllcyBtYXAgYXJndW1lbnQuICovXHJcbiAgICAgICAgUmVkaXJlY3RzOiB7IC8qIE1hbnVhbGx5IHJlZ2lzdGVyZWQgYnkgdGhlIHVzZXIuICovIH0sXHJcbiAgICAgICAgRWFzaW5nczogeyAvKiBEZWZpbmVkIGJlbG93LiAqLyB9LFxyXG4gICAgICAgIC8qIEF0dGVtcHQgdG8gdXNlIEVTNiBQcm9taXNlcyBieSBkZWZhdWx0LiBVc2VycyBjYW4gb3ZlcnJpZGUgdGhpcyB3aXRoIGEgdGhpcmQtcGFydHkgcHJvbWlzZXMgbGlicmFyeS4gKi9cclxuICAgICAgICBQcm9taXNlOiB3aW5kb3cuUHJvbWlzZSxcclxuICAgICAgICAvKiBWZWxvY2l0eSBvcHRpb24gZGVmYXVsdHMsIHdoaWNoIGNhbiBiZSBvdmVycmlkZW4gYnkgdGhlIHVzZXIuICovXHJcbiAgICAgICAgZGVmYXVsdHM6IHtcclxuICAgICAgICAgICAgcXVldWU6IFwiXCIsXHJcbiAgICAgICAgICAgIGR1cmF0aW9uOiBEVVJBVElPTl9ERUZBVUxULFxyXG4gICAgICAgICAgICBlYXNpbmc6IEVBU0lOR19ERUZBVUxULFxyXG4gICAgICAgICAgICBiZWdpbjogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBjb21wbGV0ZTogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBwcm9ncmVzczogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBkaXNwbGF5OiB1bmRlZmluZWQsXHJcbiAgICAgICAgICAgIHZpc2liaWxpdHk6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbG9vcDogZmFsc2UsXHJcbiAgICAgICAgICAgIGRlbGF5OiBmYWxzZSxcclxuICAgICAgICAgICAgbW9iaWxlSEE6IHRydWUsXHJcbiAgICAgICAgICAgIC8qIEFkdmFuY2VkOiBTZXQgdG8gZmFsc2UgdG8gcHJldmVudCBwcm9wZXJ0eSB2YWx1ZXMgZnJvbSBiZWluZyBjYWNoZWQgYmV0d2VlbiBjb25zZWN1dGl2ZSBWZWxvY2l0eS1pbml0aWF0ZWQgY2hhaW4gY2FsbHMuICovXHJcbiAgICAgICAgICAgIF9jYWNoZVZhbHVlczogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogQSBkZXNpZ24gZ29hbCBvZiBWZWxvY2l0eSBpcyB0byBjYWNoZSBkYXRhIHdoZXJldmVyIHBvc3NpYmxlIGluIG9yZGVyIHRvIGF2b2lkIERPTSByZXF1ZXJ5aW5nLiBBY2NvcmRpbmdseSwgZWFjaCBlbGVtZW50IGhhcyBhIGRhdGEgY2FjaGUuICovXHJcbiAgICAgICAgaW5pdDogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgJC5kYXRhKGVsZW1lbnQsIFwidmVsb2NpdHlcIiwge1xyXG4gICAgICAgICAgICAgICAgLyogU3RvcmUgd2hldGhlciB0aGlzIGlzIGFuIFNWRyBlbGVtZW50LCBzaW5jZSBpdHMgcHJvcGVydGllcyBhcmUgcmV0cmlldmVkIGFuZCB1cGRhdGVkIGRpZmZlcmVudGx5IHRoYW4gc3RhbmRhcmQgSFRNTCBlbGVtZW50cy4gKi9cclxuICAgICAgICAgICAgICAgIGlzU1ZHOiBUeXBlLmlzU1ZHKGVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgLyogS2VlcCB0cmFjayBvZiB3aGV0aGVyIHRoZSBlbGVtZW50IGlzIGN1cnJlbnRseSBiZWluZyBhbmltYXRlZCBieSBWZWxvY2l0eS5cclxuICAgICAgICAgICAgICAgICAgIFRoaXMgaXMgdXNlZCB0byBlbnN1cmUgdGhhdCBwcm9wZXJ0eSB2YWx1ZXMgYXJlIG5vdCB0cmFuc2ZlcnJlZCBiZXR3ZWVuIG5vbi1jb25zZWN1dGl2ZSAoc3RhbGUpIGNhbGxzLiAqL1xyXG4gICAgICAgICAgICAgICAgaXNBbmltYXRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgLyogQSByZWZlcmVuY2UgdG8gdGhlIGVsZW1lbnQncyBsaXZlIGNvbXB1dGVkU3R5bGUgb2JqZWN0LiBMZWFybiBtb3JlIGhlcmU6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL2RvY3MvV2ViL0FQSS93aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSAqL1xyXG4gICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIC8qIFR3ZWVuIGRhdGEgaXMgY2FjaGVkIGZvciBlYWNoIGFuaW1hdGlvbiBvbiB0aGUgZWxlbWVudCBzbyB0aGF0IGRhdGEgY2FuIGJlIHBhc3NlZCBhY3Jvc3MgY2FsbHMgLS1cclxuICAgICAgICAgICAgICAgICAgIGluIHBhcnRpY3VsYXIsIGVuZCB2YWx1ZXMgYXJlIHVzZWQgYXMgc3Vic2VxdWVudCBzdGFydCB2YWx1ZXMgaW4gY29uc2VjdXRpdmUgVmVsb2NpdHkgY2FsbHMuICovXHJcbiAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAvKiBUaGUgZnVsbCByb290IHByb3BlcnR5IHZhbHVlcyBvZiBlYWNoIENTUyBob29rIGJlaW5nIGFuaW1hdGVkIG9uIHRoaXMgZWxlbWVudCBhcmUgY2FjaGVkIHNvIHRoYXQ6XHJcbiAgICAgICAgICAgICAgICAgICAxKSBDb25jdXJyZW50bHktYW5pbWF0aW5nIGhvb2tzIHNoYXJpbmcgdGhlIHNhbWUgcm9vdCBjYW4gaGF2ZSB0aGVpciByb290IHZhbHVlcycgbWVyZ2VkIGludG8gb25lIHdoaWxlIHR3ZWVuaW5nLlxyXG4gICAgICAgICAgICAgICAgICAgMikgUG9zdC1ob29rLWluamVjdGlvbiByb290IHZhbHVlcyBjYW4gYmUgdHJhbnNmZXJyZWQgb3ZlciB0byBjb25zZWN1dGl2ZWx5IGNoYWluZWQgVmVsb2NpdHkgY2FsbHMgYXMgc3RhcnRpbmcgcm9vdCB2YWx1ZXMuICovXHJcbiAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZUNhY2hlOiB7fSxcclxuICAgICAgICAgICAgICAgIC8qIEEgY2FjaGUgZm9yIHRyYW5zZm9ybSB1cGRhdGVzLCB3aGljaCBtdXN0IGJlIG1hbnVhbGx5IGZsdXNoZWQgdmlhIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKCkuICovXHJcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm1DYWNoZToge31cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiBBIHBhcmFsbGVsIHRvIGpRdWVyeSdzICQuY3NzKCksIHVzZWQgZm9yIGdldHRpbmcvc2V0dGluZyBWZWxvY2l0eSdzIGhvb2tlZCBDU1MgcHJvcGVydGllcy4gKi9cclxuICAgICAgICBob29rOiBudWxsLCAvKiBEZWZpbmVkIGJlbG93LiAqL1xyXG4gICAgICAgIC8qIFZlbG9jaXR5LXdpZGUgYW5pbWF0aW9uIHRpbWUgcmVtYXBwaW5nIGZvciB0ZXN0aW5nIHB1cnBvc2VzLiAqL1xyXG4gICAgICAgIG1vY2s6IGZhbHNlLFxyXG4gICAgICAgIHZlcnNpb246IHsgbWFqb3I6IDEsIG1pbm9yOiAyLCBwYXRjaDogMiB9LFxyXG4gICAgICAgIC8qIFNldCB0byAxIG9yIDIgKG1vc3QgdmVyYm9zZSkgdG8gb3V0cHV0IGRlYnVnIGluZm8gdG8gY29uc29sZS4gKi9cclxuICAgICAgICBkZWJ1ZzogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgLyogUmV0cmlldmUgdGhlIGFwcHJvcHJpYXRlIHNjcm9sbCBhbmNob3IgYW5kIHByb3BlcnR5IG5hbWUgZm9yIHRoZSBicm93c2VyOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2luZG93LnNjcm9sbFkgKi9cclxuICAgIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbEFuY2hvciA9IHdpbmRvdztcclxuICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQgPSBcInBhZ2VYT2Zmc2V0XCI7XHJcbiAgICAgICAgVmVsb2NpdHkuU3RhdGUuc2Nyb2xsUHJvcGVydHlUb3AgPSBcInBhZ2VZT2Zmc2V0XCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIFZlbG9jaXR5LlN0YXRlLnNjcm9sbEFuY2hvciA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCB8fCBkb2N1bWVudC5ib2R5LnBhcmVudE5vZGUgfHwgZG9jdW1lbnQuYm9keTtcclxuICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eUxlZnQgPSBcInNjcm9sbExlZnRcIjtcclxuICAgICAgICBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxQcm9wZXJ0eVRvcCA9IFwic2Nyb2xsVG9wXCI7XHJcbiAgICB9XHJcblxyXG4gICAgLyogU2hvcnRoYW5kIGFsaWFzIGZvciBqUXVlcnkncyAkLmRhdGEoKSB1dGlsaXR5LiAqL1xyXG4gICAgZnVuY3Rpb24gRGF0YSAoZWxlbWVudCkge1xyXG4gICAgICAgIC8qIEhhcmRjb2RlIGEgcmVmZXJlbmNlIHRvIHRoZSBwbHVnaW4gbmFtZS4gKi9cclxuICAgICAgICB2YXIgcmVzcG9uc2UgPSAkLmRhdGEoZWxlbWVudCwgXCJ2ZWxvY2l0eVwiKTtcclxuXHJcbiAgICAgICAgLyogalF1ZXJ5IDw9MS40LjIgcmV0dXJucyBudWxsIGluc3RlYWQgb2YgdW5kZWZpbmVkIHdoZW4gbm8gbWF0Y2ggaXMgZm91bmQuIFdlIG5vcm1hbGl6ZSB0aGlzIGJlaGF2aW9yLiAqL1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZSA9PT0gbnVsbCA/IHVuZGVmaW5lZCA6IHJlc3BvbnNlO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKioqKioqKioqKioqKipcclxuICAgICAgICBFYXNpbmdcclxuICAgICoqKioqKioqKioqKioqL1xyXG5cclxuICAgIC8qIFN0ZXAgZWFzaW5nIGdlbmVyYXRvci4gKi9cclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU3RlcCAoc3RlcHMpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHApIHtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQocCAqIHN0ZXBzKSAqICgxIC8gc3RlcHMpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyogQmV6aWVyIGN1cnZlIGZ1bmN0aW9uIGdlbmVyYXRvci4gQ29weXJpZ2h0IEdhZXRhbiBSZW5hdWRlYXUuIE1JVCBMaWNlbnNlOiBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlICovXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUJlemllciAobVgxLCBtWTEsIG1YMiwgbVkyKSB7XHJcbiAgICAgICAgdmFyIE5FV1RPTl9JVEVSQVRJT05TID0gNCxcclxuICAgICAgICAgICAgTkVXVE9OX01JTl9TTE9QRSA9IDAuMDAxLFxyXG4gICAgICAgICAgICBTVUJESVZJU0lPTl9QUkVDSVNJT04gPSAwLjAwMDAwMDEsXHJcbiAgICAgICAgICAgIFNVQkRJVklTSU9OX01BWF9JVEVSQVRJT05TID0gMTAsXHJcbiAgICAgICAgICAgIGtTcGxpbmVUYWJsZVNpemUgPSAxMSxcclxuICAgICAgICAgICAga1NhbXBsZVN0ZXBTaXplID0gMS4wIC8gKGtTcGxpbmVUYWJsZVNpemUgLSAxLjApLFxyXG4gICAgICAgICAgICBmbG9hdDMyQXJyYXlTdXBwb3J0ZWQgPSBcIkZsb2F0MzJBcnJheVwiIGluIHdpbmRvdztcclxuXHJcbiAgICAgICAgLyogTXVzdCBjb250YWluIGZvdXIgYXJndW1lbnRzLiAqL1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSA0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIEFyZ3VtZW50cyBtdXN0IGJlIG51bWJlcnMuICovXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhcmd1bWVudHNbaV0gIT09IFwibnVtYmVyXCIgfHwgaXNOYU4oYXJndW1lbnRzW2ldKSB8fCAhaXNGaW5pdGUoYXJndW1lbnRzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBYIHZhbHVlcyBtdXN0IGJlIGluIHRoZSBbMCwgMV0gcmFuZ2UuICovXHJcbiAgICAgICAgbVgxID0gTWF0aC5taW4obVgxLCAxKTtcclxuICAgICAgICBtWDIgPSBNYXRoLm1pbihtWDIsIDEpO1xyXG4gICAgICAgIG1YMSA9IE1hdGgubWF4KG1YMSwgMCk7XHJcbiAgICAgICAgbVgyID0gTWF0aC5tYXgobVgyLCAwKTtcclxuXHJcbiAgICAgICAgdmFyIG1TYW1wbGVWYWx1ZXMgPSBmbG9hdDMyQXJyYXlTdXBwb3J0ZWQgPyBuZXcgRmxvYXQzMkFycmF5KGtTcGxpbmVUYWJsZVNpemUpIDogbmV3IEFycmF5KGtTcGxpbmVUYWJsZVNpemUpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBBIChhQTEsIGFBMikgeyByZXR1cm4gMS4wIC0gMy4wICogYUEyICsgMy4wICogYUExOyB9XHJcbiAgICAgICAgZnVuY3Rpb24gQiAoYUExLCBhQTIpIHsgcmV0dXJuIDMuMCAqIGFBMiAtIDYuMCAqIGFBMTsgfVxyXG4gICAgICAgIGZ1bmN0aW9uIEMgKGFBMSkgICAgICB7IHJldHVybiAzLjAgKiBhQTE7IH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2FsY0JlemllciAoYVQsIGFBMSwgYUEyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoKEEoYUExLCBhQTIpKmFUICsgQihhQTEsIGFBMikpKmFUICsgQyhhQTEpKSphVDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFNsb3BlIChhVCwgYUExLCBhQTIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDMuMCAqIEEoYUExLCBhQTIpKmFUKmFUICsgMi4wICogQihhQTEsIGFBMikgKiBhVCArIEMoYUExKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5ld3RvblJhcGhzb25JdGVyYXRlIChhWCwgYUd1ZXNzVCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IE5FV1RPTl9JVEVSQVRJT05TOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50U2xvcGUgPSBnZXRTbG9wZShhR3Vlc3NULCBtWDEsIG1YMik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTbG9wZSA9PT0gMC4wKSByZXR1cm4gYUd1ZXNzVDtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudFggPSBjYWxjQmV6aWVyKGFHdWVzc1QsIG1YMSwgbVgyKSAtIGFYO1xyXG4gICAgICAgICAgICAgICAgYUd1ZXNzVCAtPSBjdXJyZW50WCAvIGN1cnJlbnRTbG9wZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGFHdWVzc1Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjYWxjU2FtcGxlVmFsdWVzICgpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrU3BsaW5lVGFibGVTaXplOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIG1TYW1wbGVWYWx1ZXNbaV0gPSBjYWxjQmV6aWVyKGkgKiBrU2FtcGxlU3RlcFNpemUsIG1YMSwgbVgyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYmluYXJ5U3ViZGl2aWRlIChhWCwgYUEsIGFCKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50WCwgY3VycmVudFQsIGkgPSAwO1xyXG5cclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFQgPSBhQSArIChhQiAtIGFBKSAvIDIuMDtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRYID0gY2FsY0JlemllcihjdXJyZW50VCwgbVgxLCBtWDIpIC0gYVg7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFggPiAwLjApIHtcclxuICAgICAgICAgICAgICAgICAgYUIgPSBjdXJyZW50VDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIGFBID0gY3VycmVudFQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKE1hdGguYWJzKGN1cnJlbnRYKSA+IFNVQkRJVklTSU9OX1BSRUNJU0lPTiAmJiArK2kgPCBTVUJESVZJU0lPTl9NQVhfSVRFUkFUSU9OUyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRURm9yWCAoYVgpIHtcclxuICAgICAgICAgICAgdmFyIGludGVydmFsU3RhcnQgPSAwLjAsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50U2FtcGxlID0gMSxcclxuICAgICAgICAgICAgICAgIGxhc3RTYW1wbGUgPSBrU3BsaW5lVGFibGVTaXplIC0gMTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoOyBjdXJyZW50U2FtcGxlICE9IGxhc3RTYW1wbGUgJiYgbVNhbXBsZVZhbHVlc1tjdXJyZW50U2FtcGxlXSA8PSBhWDsgKytjdXJyZW50U2FtcGxlKSB7XHJcbiAgICAgICAgICAgICAgICBpbnRlcnZhbFN0YXJ0ICs9IGtTYW1wbGVTdGVwU2l6ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLS1jdXJyZW50U2FtcGxlO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRpc3QgPSAoYVggLSBtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKSAvIChtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGUrMV0gLSBtU2FtcGxlVmFsdWVzW2N1cnJlbnRTYW1wbGVdKSxcclxuICAgICAgICAgICAgICAgIGd1ZXNzRm9yVCA9IGludGVydmFsU3RhcnQgKyBkaXN0ICoga1NhbXBsZVN0ZXBTaXplLFxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbFNsb3BlID0gZ2V0U2xvcGUoZ3Vlc3NGb3JULCBtWDEsIG1YMik7XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5pdGlhbFNsb3BlID49IE5FV1RPTl9NSU5fU0xPUEUpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXd0b25SYXBoc29uSXRlcmF0ZShhWCwgZ3Vlc3NGb3JUKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbml0aWFsU2xvcGUgPT0gMC4wKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZ3Vlc3NGb3JUO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJpbmFyeVN1YmRpdmlkZShhWCwgaW50ZXJ2YWxTdGFydCwgaW50ZXJ2YWxTdGFydCArIGtTYW1wbGVTdGVwU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBfcHJlY29tcHV0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHJlY29tcHV0ZSgpIHtcclxuICAgICAgICAgICAgX3ByZWNvbXB1dGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKG1YMSAhPSBtWTEgfHwgbVgyICE9IG1ZMikgY2FsY1NhbXBsZVZhbHVlcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGYgPSBmdW5jdGlvbiAoYVgpIHtcclxuICAgICAgICAgICAgaWYgKCFfcHJlY29tcHV0ZWQpIHByZWNvbXB1dGUoKTtcclxuICAgICAgICAgICAgaWYgKG1YMSA9PT0gbVkxICYmIG1YMiA9PT0gbVkyKSByZXR1cm4gYVg7XHJcbiAgICAgICAgICAgIGlmIChhWCA9PT0gMCkgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIGlmIChhWCA9PT0gMSkgcmV0dXJuIDE7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY2FsY0JlemllcihnZXRURm9yWChhWCksIG1ZMSwgbVkyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmLmdldENvbnRyb2xQb2ludHMgPSBmdW5jdGlvbigpIHsgcmV0dXJuIFt7IHg6IG1YMSwgeTogbVkxIH0sIHsgeDogbVgyLCB5OiBtWTIgfV07IH07XHJcblxyXG4gICAgICAgIHZhciBzdHIgPSBcImdlbmVyYXRlQmV6aWVyKFwiICsgW21YMSwgbVkxLCBtWDIsIG1ZMl0gKyBcIilcIjtcclxuICAgICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gc3RyOyB9O1xyXG5cclxuICAgICAgICByZXR1cm4gZjtcclxuICAgIH1cclxuXHJcbiAgICAvKiBSdW5nZS1LdXR0YSBzcHJpbmcgcGh5c2ljcyBmdW5jdGlvbiBnZW5lcmF0b3IuIEFkYXB0ZWQgZnJvbSBGcmFtZXIuanMsIGNvcHlyaWdodCBLb2VuIEJvay4gTUlUIExpY2Vuc2U6IGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTUlUX0xpY2Vuc2UgKi9cclxuICAgIC8qIEdpdmVuIGEgdGVuc2lvbiwgZnJpY3Rpb24sIGFuZCBkdXJhdGlvbiwgYSBzaW11bGF0aW9uIGF0IDYwRlBTIHdpbGwgZmlyc3QgcnVuIHdpdGhvdXQgYSBkZWZpbmVkIGR1cmF0aW9uIGluIG9yZGVyIHRvIGNhbGN1bGF0ZSB0aGUgZnVsbCBwYXRoLiBBIHNlY29uZCBwYXNzXHJcbiAgICAgICB0aGVuIGFkanVzdHMgdGhlIHRpbWUgZGVsdGEgLS0gdXNpbmcgdGhlIHJlbGF0aW9uIGJldHdlZW4gYWN0dWFsIHRpbWUgYW5kIGR1cmF0aW9uIC0tIHRvIGNhbGN1bGF0ZSB0aGUgcGF0aCBmb3IgdGhlIGR1cmF0aW9uLWNvbnN0cmFpbmVkIGFuaW1hdGlvbi4gKi9cclxuICAgIHZhciBnZW5lcmF0ZVNwcmluZ1JLNCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZnVuY3Rpb24gc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUgKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoLXN0YXRlLnRlbnNpb24gKiBzdGF0ZS54KSAtIChzdGF0ZS5mcmljdGlvbiAqIHN0YXRlLnYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlIChpbml0aWFsU3RhdGUsIGR0LCBkZXJpdmF0aXZlKSB7XHJcbiAgICAgICAgICAgIHZhciBzdGF0ZSA9IHtcclxuICAgICAgICAgICAgICAgIHg6IGluaXRpYWxTdGF0ZS54ICsgZGVyaXZhdGl2ZS5keCAqIGR0LFxyXG4gICAgICAgICAgICAgICAgdjogaW5pdGlhbFN0YXRlLnYgKyBkZXJpdmF0aXZlLmR2ICogZHQsXHJcbiAgICAgICAgICAgICAgICB0ZW5zaW9uOiBpbml0aWFsU3RhdGUudGVuc2lvbixcclxuICAgICAgICAgICAgICAgIGZyaWN0aW9uOiBpbml0aWFsU3RhdGUuZnJpY3Rpb25cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7IGR4OiBzdGF0ZS52LCBkdjogc3ByaW5nQWNjZWxlcmF0aW9uRm9yU3RhdGUoc3RhdGUpIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzcHJpbmdJbnRlZ3JhdGVTdGF0ZSAoc3RhdGUsIGR0KSB7XHJcbiAgICAgICAgICAgIHZhciBhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGR4OiBzdGF0ZS52LFxyXG4gICAgICAgICAgICAgICAgICAgIGR2OiBzcHJpbmdBY2NlbGVyYXRpb25Gb3JTdGF0ZShzdGF0ZSlcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBiID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKHN0YXRlLCBkdCAqIDAuNSwgYSksXHJcbiAgICAgICAgICAgICAgICBjID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKHN0YXRlLCBkdCAqIDAuNSwgYiksXHJcbiAgICAgICAgICAgICAgICBkID0gc3ByaW5nRXZhbHVhdGVTdGF0ZVdpdGhEZXJpdmF0aXZlKHN0YXRlLCBkdCwgYyksXHJcbiAgICAgICAgICAgICAgICBkeGR0ID0gMS4wIC8gNi4wICogKGEuZHggKyAyLjAgKiAoYi5keCArIGMuZHgpICsgZC5keCksXHJcbiAgICAgICAgICAgICAgICBkdmR0ID0gMS4wIC8gNi4wICogKGEuZHYgKyAyLjAgKiAoYi5kdiArIGMuZHYpICsgZC5kdik7XHJcblxyXG4gICAgICAgICAgICBzdGF0ZS54ID0gc3RhdGUueCArIGR4ZHQgKiBkdDtcclxuICAgICAgICAgICAgc3RhdGUudiA9IHN0YXRlLnYgKyBkdmR0ICogZHQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gc3ByaW5nUks0RmFjdG9yeSAodGVuc2lvbiwgZnJpY3Rpb24sIGR1cmF0aW9uKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW5pdFN0YXRlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IC0xLFxyXG4gICAgICAgICAgICAgICAgICAgIHY6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVuc2lvbjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBmcmljdGlvbjogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBhdGggPSBbMF0sXHJcbiAgICAgICAgICAgICAgICB0aW1lX2xhcHNlZCA9IDAsXHJcbiAgICAgICAgICAgICAgICB0b2xlcmFuY2UgPSAxIC8gMTAwMDAsXHJcbiAgICAgICAgICAgICAgICBEVCA9IDE2IC8gMTAwMCxcclxuICAgICAgICAgICAgICAgIGhhdmVfZHVyYXRpb24sIGR0LCBsYXN0X3N0YXRlO1xyXG5cclxuICAgICAgICAgICAgdGVuc2lvbiA9IHBhcnNlRmxvYXQodGVuc2lvbikgfHwgNTAwO1xyXG4gICAgICAgICAgICBmcmljdGlvbiA9IHBhcnNlRmxvYXQoZnJpY3Rpb24pIHx8IDIwO1xyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IGR1cmF0aW9uIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpbml0U3RhdGUudGVuc2lvbiA9IHRlbnNpb247XHJcbiAgICAgICAgICAgIGluaXRTdGF0ZS5mcmljdGlvbiA9IGZyaWN0aW9uO1xyXG5cclxuICAgICAgICAgICAgaGF2ZV9kdXJhdGlvbiA9IGR1cmF0aW9uICE9PSBudWxsO1xyXG5cclxuICAgICAgICAgICAgLyogQ2FsY3VsYXRlIHRoZSBhY3R1YWwgdGltZSBpdCB0YWtlcyBmb3IgdGhpcyBhbmltYXRpb24gdG8gY29tcGxldGUgd2l0aCB0aGUgcHJvdmlkZWQgY29uZGl0aW9ucy4gKi9cclxuICAgICAgICAgICAgaWYgKGhhdmVfZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIC8qIFJ1biB0aGUgc2ltdWxhdGlvbiB3aXRob3V0IGEgZHVyYXRpb24uICovXHJcbiAgICAgICAgICAgICAgICB0aW1lX2xhcHNlZCA9IHNwcmluZ1JLNEZhY3RvcnkodGVuc2lvbiwgZnJpY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgLyogQ29tcHV0ZSB0aGUgYWRqdXN0ZWQgdGltZSBkZWx0YS4gKi9cclxuICAgICAgICAgICAgICAgIGR0ID0gdGltZV9sYXBzZWQgLyBkdXJhdGlvbiAqIERUO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZHQgPSBEVDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgIC8qIE5leHQvc3RlcCBmdW5jdGlvbiAuKi9cclxuICAgICAgICAgICAgICAgIGxhc3Rfc3RhdGUgPSBzcHJpbmdJbnRlZ3JhdGVTdGF0ZShsYXN0X3N0YXRlIHx8IGluaXRTdGF0ZSwgZHQpO1xyXG4gICAgICAgICAgICAgICAgLyogU3RvcmUgdGhlIHBvc2l0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgcGF0aC5wdXNoKDEgKyBsYXN0X3N0YXRlLngpO1xyXG4gICAgICAgICAgICAgICAgdGltZV9sYXBzZWQgKz0gMTY7XHJcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY2hhbmdlIHRocmVzaG9sZCBpcyByZWFjaGVkLCBicmVhay4gKi9cclxuICAgICAgICAgICAgICAgIGlmICghKE1hdGguYWJzKGxhc3Rfc3RhdGUueCkgPiB0b2xlcmFuY2UgJiYgTWF0aC5hYnMobGFzdF9zdGF0ZS52KSA+IHRvbGVyYW5jZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogSWYgZHVyYXRpb24gaXMgbm90IGRlZmluZWQsIHJldHVybiB0aGUgYWN0dWFsIHRpbWUgcmVxdWlyZWQgZm9yIGNvbXBsZXRpbmcgdGhpcyBhbmltYXRpb24uIE90aGVyd2lzZSwgcmV0dXJuIGEgY2xvc3VyZSB0aGF0IGhvbGRzIHRoZVxyXG4gICAgICAgICAgICAgICBjb21wdXRlZCBwYXRoIGFuZCByZXR1cm5zIGEgc25hcHNob3Qgb2YgdGhlIHBvc2l0aW9uIGFjY29yZGluZyB0byBhIGdpdmVuIHBlcmNlbnRDb21wbGV0ZS4gKi9cclxuICAgICAgICAgICAgcmV0dXJuICFoYXZlX2R1cmF0aW9uID8gdGltZV9sYXBzZWQgOiBmdW5jdGlvbihwZXJjZW50Q29tcGxldGUpIHsgcmV0dXJuIHBhdGhbIChwZXJjZW50Q29tcGxldGUgKiAocGF0aC5sZW5ndGggLSAxKSkgfCAwIF07IH07XHJcbiAgICAgICAgfTtcclxuICAgIH0oKSk7XHJcblxyXG4gICAgLyogalF1ZXJ5IGVhc2luZ3MuICovXHJcbiAgICBWZWxvY2l0eS5FYXNpbmdzID0ge1xyXG4gICAgICAgIGxpbmVhcjogZnVuY3Rpb24ocCkgeyByZXR1cm4gcDsgfSxcclxuICAgICAgICBzd2luZzogZnVuY3Rpb24ocCkgeyByZXR1cm4gMC41IC0gTWF0aC5jb3MoIHAgKiBNYXRoLlBJICkgLyAyIH0sXHJcbiAgICAgICAgLyogQm9udXMgXCJzcHJpbmdcIiBlYXNpbmcsIHdoaWNoIGlzIGEgbGVzcyBleGFnZ2VyYXRlZCB2ZXJzaW9uIG9mIGVhc2VJbk91dEVsYXN0aWMuICovXHJcbiAgICAgICAgc3ByaW5nOiBmdW5jdGlvbihwKSB7IHJldHVybiAxIC0gKE1hdGguY29zKHAgKiA0LjUgKiBNYXRoLlBJKSAqIE1hdGguZXhwKC1wICogNikpOyB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIENTUzMgYW5kIFJvYmVydCBQZW5uZXIgZWFzaW5ncy4gKi9cclxuICAgICQuZWFjaChcclxuICAgICAgICBbXHJcbiAgICAgICAgICAgIFsgXCJlYXNlXCIsIFsgMC4yNSwgMC4xLCAwLjI1LCAxLjAgXSBdLFxyXG4gICAgICAgICAgICBbIFwiZWFzZS1pblwiLCBbIDAuNDIsIDAuMCwgMS4wMCwgMS4wIF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2Utb3V0XCIsIFsgMC4wMCwgMC4wLCAwLjU4LCAxLjAgXSBdLFxyXG4gICAgICAgICAgICBbIFwiZWFzZS1pbi1vdXRcIiwgWyAwLjQyLCAwLjAsIDAuNTgsIDEuMCBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5TaW5lXCIsIFsgMC40NywgMCwgMC43NDUsIDAuNzE1IF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2VPdXRTaW5lXCIsIFsgMC4zOSwgMC41NzUsIDAuNTY1LCAxIF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2VJbk91dFNpbmVcIiwgWyAwLjQ0NSwgMC4wNSwgMC41NSwgMC45NSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5RdWFkXCIsIFsgMC41NSwgMC4wODUsIDAuNjgsIDAuNTMgXSBdLFxyXG4gICAgICAgICAgICBbIFwiZWFzZU91dFF1YWRcIiwgWyAwLjI1LCAwLjQ2LCAwLjQ1LCAwLjk0IF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2VJbk91dFF1YWRcIiwgWyAwLjQ1NSwgMC4wMywgMC41MTUsIDAuOTU1IF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2VJbkN1YmljXCIsIFsgMC41NSwgMC4wNTUsIDAuNjc1LCAwLjE5IF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2VPdXRDdWJpY1wiLCBbIDAuMjE1LCAwLjYxLCAwLjM1NSwgMSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5PdXRDdWJpY1wiLCBbIDAuNjQ1LCAwLjA0NSwgMC4zNTUsIDEgXSBdLFxyXG4gICAgICAgICAgICBbIFwiZWFzZUluUXVhcnRcIiwgWyAwLjg5NSwgMC4wMywgMC42ODUsIDAuMjIgXSBdLFxyXG4gICAgICAgICAgICBbIFwiZWFzZU91dFF1YXJ0XCIsIFsgMC4xNjUsIDAuODQsIDAuNDQsIDEgXSBdLFxyXG4gICAgICAgICAgICBbIFwiZWFzZUluT3V0UXVhcnRcIiwgWyAwLjc3LCAwLCAwLjE3NSwgMSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5RdWludFwiLCBbIDAuNzU1LCAwLjA1LCAwLjg1NSwgMC4wNiBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlT3V0UXVpbnRcIiwgWyAwLjIzLCAxLCAwLjMyLCAxIF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2VJbk91dFF1aW50XCIsIFsgMC44NiwgMCwgMC4wNywgMSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5FeHBvXCIsIFsgMC45NSwgMC4wNSwgMC43OTUsIDAuMDM1IF0gXSxcclxuICAgICAgICAgICAgWyBcImVhc2VPdXRFeHBvXCIsIFsgMC4xOSwgMSwgMC4yMiwgMSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5PdXRFeHBvXCIsIFsgMSwgMCwgMCwgMSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5DaXJjXCIsIFsgMC42LCAwLjA0LCAwLjk4LCAwLjMzNSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlT3V0Q2lyY1wiLCBbIDAuMDc1LCAwLjgyLCAwLjE2NSwgMSBdIF0sXHJcbiAgICAgICAgICAgIFsgXCJlYXNlSW5PdXRDaXJjXCIsIFsgMC43ODUsIDAuMTM1LCAwLjE1LCAwLjg2IF0gXVxyXG4gICAgICAgIF0sIGZ1bmN0aW9uKGksIGVhc2luZ0FycmF5KSB7XHJcbiAgICAgICAgICAgIFZlbG9jaXR5LkVhc2luZ3NbZWFzaW5nQXJyYXlbMF1dID0gZ2VuZXJhdGVCZXppZXIuYXBwbHkobnVsbCwgZWFzaW5nQXJyYXlbMV0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIC8qIERldGVybWluZSB0aGUgYXBwcm9wcmlhdGUgZWFzaW5nIHR5cGUgZ2l2ZW4gYW4gZWFzaW5nIGlucHV0LiAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0RWFzaW5nKHZhbHVlLCBkdXJhdGlvbikge1xyXG4gICAgICAgIHZhciBlYXNpbmcgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgLyogVGhlIGVhc2luZyBvcHRpb24gY2FuIGVpdGhlciBiZSBhIHN0cmluZyB0aGF0IHJlZmVyZW5jZXMgYSBwcmUtcmVnaXN0ZXJlZCBlYXNpbmcsXHJcbiAgICAgICAgICAgb3IgaXQgY2FuIGJlIGEgdHdvLS9mb3VyLWl0ZW0gYXJyYXkgb2YgaW50ZWdlcnMgdG8gYmUgY29udmVydGVkIGludG8gYSBiZXppZXIvc3ByaW5nIGZ1bmN0aW9uLiAqL1xyXG4gICAgICAgIGlmIChUeXBlLmlzU3RyaW5nKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAvKiBFbnN1cmUgdGhhdCB0aGUgZWFzaW5nIGhhcyBiZWVuIGFzc2lnbmVkIHRvIGpRdWVyeSdzIFZlbG9jaXR5LkVhc2luZ3Mgb2JqZWN0LiAqL1xyXG4gICAgICAgICAgICBpZiAoIVZlbG9jaXR5LkVhc2luZ3NbdmFsdWVdKSB7XHJcbiAgICAgICAgICAgICAgICBlYXNpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVTdGVwLmFwcGx5KG51bGwsIHZhbHVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIC8qIHNwcmluZ1JLNCBtdXN0IGJlIHBhc3NlZCB0aGUgYW5pbWF0aW9uJ3MgZHVyYXRpb24uICovXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IElmIHRoZSBzcHJpbmdSSzQgYXJyYXkgY29udGFpbnMgbm9uLW51bWJlcnMsIGdlbmVyYXRlU3ByaW5nUks0KCkgcmV0dXJucyBhbiBlYXNpbmdcclxuICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2VuZXJhdGVkIHdpdGggZGVmYXVsdCB0ZW5zaW9uIGFuZCBmcmljdGlvbiB2YWx1ZXMuICovXHJcbiAgICAgICAgICAgIGVhc2luZyA9IGdlbmVyYXRlU3ByaW5nUks0LmFwcGx5KG51bGwsIHZhbHVlLmNvbmNhdChbIGR1cmF0aW9uIF0pKTtcclxuICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNBcnJheSh2YWx1ZSkgJiYgdmFsdWUubGVuZ3RoID09PSA0KSB7XHJcbiAgICAgICAgICAgIC8qIE5vdGU6IElmIHRoZSBiZXppZXIgYXJyYXkgY29udGFpbnMgbm9uLW51bWJlcnMsIGdlbmVyYXRlQmV6aWVyKCkgcmV0dXJucyBmYWxzZS4gKi9cclxuICAgICAgICAgICAgZWFzaW5nID0gZ2VuZXJhdGVCZXppZXIuYXBwbHkobnVsbCwgdmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVhc2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUmV2ZXJ0IHRvIHRoZSBWZWxvY2l0eS13aWRlIGRlZmF1bHQgZWFzaW5nIHR5cGUsIG9yIGZhbGwgYmFjayB0byBcInN3aW5nXCIgKHdoaWNoIGlzIGFsc28galF1ZXJ5J3MgZGVmYXVsdClcclxuICAgICAgICAgICBpZiB0aGUgVmVsb2NpdHktd2lkZSBkZWZhdWx0IGhhcyBiZWVuIGluY29ycmVjdGx5IG1vZGlmaWVkLiAqL1xyXG4gICAgICAgIGlmIChlYXNpbmcgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmIChWZWxvY2l0eS5FYXNpbmdzW1ZlbG9jaXR5LmRlZmF1bHRzLmVhc2luZ10pIHtcclxuICAgICAgICAgICAgICAgIGVhc2luZyA9IFZlbG9jaXR5LmRlZmF1bHRzLmVhc2luZztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGVhc2luZyA9IEVBU0lOR19ERUZBVUxUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gZWFzaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKlxyXG4gICAgICAgIENTUyBTdGFja1xyXG4gICAgKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLyogVGhlIENTUyBvYmplY3QgaXMgYSBoaWdobHkgY29uZGVuc2VkIGFuZCBwZXJmb3JtYW50IENTUyBzdGFjayB0aGF0IGZ1bGx5IHJlcGxhY2VzIGpRdWVyeSdzLlxyXG4gICAgICAgSXQgaGFuZGxlcyB0aGUgdmFsaWRhdGlvbiwgZ2V0dGluZywgYW5kIHNldHRpbmcgb2YgYm90aCBzdGFuZGFyZCBDU1MgcHJvcGVydGllcyBhbmQgQ1NTIHByb3BlcnR5IGhvb2tzLiAqL1xyXG4gICAgLyogTm90ZTogQSBcIkNTU1wiIHNob3J0aGFuZCBpcyBhbGlhc2VkIHNvIHRoYXQgb3VyIGNvZGUgaXMgZWFzaWVyIHRvIHJlYWQuICovXHJcbiAgICB2YXIgQ1NTID0gVmVsb2NpdHkuQ1NTID0ge1xyXG5cclxuICAgICAgICAvKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICBSZWdFeFxyXG4gICAgICAgICoqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIFJlZ0V4OiB7XHJcbiAgICAgICAgICAgIGlzSGV4OiAvXiMoW0EtZlxcZF17M30pezEsMn0kL2ksXHJcbiAgICAgICAgICAgIC8qIFVud3JhcCBhIHByb3BlcnR5IHZhbHVlJ3Mgc3Vycm91bmRpbmcgdGV4dCwgZS5nLiBcInJnYmEoNCwgMywgMiwgMSlcIiA9PT4gXCI0LCAzLCAyLCAxXCIgYW5kIFwicmVjdCg0cHggM3B4IDJweCAxcHgpXCIgPT0+IFwiNHB4IDNweCAycHggMXB4XCIuICovXHJcbiAgICAgICAgICAgIHZhbHVlVW53cmFwOiAvXltBLXpdK1xcKCguKilcXCkkL2ksXHJcbiAgICAgICAgICAgIHdyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQ6IC9bMC05Ll0rIFswLTkuXSsgWzAtOS5dKyggWzAtOS5dKyk/LyxcclxuICAgICAgICAgICAgLyogU3BsaXQgYSBtdWx0aS12YWx1ZSBwcm9wZXJ0eSBpbnRvIGFuIGFycmF5IG9mIHN1YnZhbHVlcywgZS5nLiBcInJnYmEoNCwgMywgMiwgMSkgNHB4IDNweCAycHggMXB4XCIgPT0+IFsgXCJyZ2JhKDQsIDMsIDIsIDEpXCIsIFwiNHB4XCIsIFwiM3B4XCIsIFwiMnB4XCIsIFwiMXB4XCIgXS4gKi9cclxuICAgICAgICAgICAgdmFsdWVTcGxpdDogLyhbQS16XStcXCguK1xcKSl8KChbQS16MC05Iy0uXSs/KSg/PVxcc3wkKSkvaWdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKioqKioqKioqKioqXHJcbiAgICAgICAgICAgIExpc3RzXHJcbiAgICAgICAgKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICBMaXN0czoge1xyXG4gICAgICAgICAgICBjb2xvcnM6IFsgXCJmaWxsXCIsIFwic3Ryb2tlXCIsIFwic3RvcENvbG9yXCIsIFwiY29sb3JcIiwgXCJiYWNrZ3JvdW5kQ29sb3JcIiwgXCJib3JkZXJDb2xvclwiLCBcImJvcmRlclRvcENvbG9yXCIsIFwiYm9yZGVyUmlnaHRDb2xvclwiLCBcImJvcmRlckJvdHRvbUNvbG9yXCIsIFwiYm9yZGVyTGVmdENvbG9yXCIsIFwib3V0bGluZUNvbG9yXCIgXSxcclxuICAgICAgICAgICAgdHJhbnNmb3Jtc0Jhc2U6IFsgXCJ0cmFuc2xhdGVYXCIsIFwidHJhbnNsYXRlWVwiLCBcInNjYWxlXCIsIFwic2NhbGVYXCIsIFwic2NhbGVZXCIsIFwic2tld1hcIiwgXCJza2V3WVwiLCBcInJvdGF0ZVpcIiBdLFxyXG4gICAgICAgICAgICB0cmFuc2Zvcm1zM0Q6IFsgXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiLCBcInRyYW5zbGF0ZVpcIiwgXCJzY2FsZVpcIiwgXCJyb3RhdGVYXCIsIFwicm90YXRlWVwiIF1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKioqKioqKioqKioqXHJcbiAgICAgICAgICAgIEhvb2tzXHJcbiAgICAgICAgKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAvKiBIb29rcyBhbGxvdyBhIHN1YnByb3BlcnR5IChlLmcuIFwiYm94U2hhZG93Qmx1clwiKSBvZiBhIGNvbXBvdW5kLXZhbHVlIENTUyBwcm9wZXJ0eVxyXG4gICAgICAgICAgIChlLmcuIFwiYm94U2hhZG93OiBYIFkgQmx1ciBTcHJlYWQgQ29sb3JcIikgdG8gYmUgYW5pbWF0ZWQgYXMgaWYgaXQgd2VyZSBhIGRpc2NyZXRlIHByb3BlcnR5LiAqL1xyXG4gICAgICAgIC8qIE5vdGU6IEJleW9uZCBlbmFibGluZyBmaW5lLWdyYWluZWQgcHJvcGVydHkgYW5pbWF0aW9uLCBob29raW5nIGlzIG5lY2Vzc2FyeSBzaW5jZSBWZWxvY2l0eSBvbmx5XHJcbiAgICAgICAgICAgdHdlZW5zIHByb3BlcnRpZXMgd2l0aCBzaW5nbGUgbnVtZXJpYyB2YWx1ZXM7IHVubGlrZSBDU1MgdHJhbnNpdGlvbnMsIFZlbG9jaXR5IGRvZXMgbm90IGludGVycG9sYXRlIGNvbXBvdW5kLXZhbHVlcy4gKi9cclxuICAgICAgICBIb29rczoge1xyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgIFJlZ2lzdHJhdGlvblxyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgIC8qIFRlbXBsYXRlcyBhcmUgYSBjb25jaXNlIHdheSBvZiBpbmRpY2F0aW5nIHdoaWNoIHN1YnByb3BlcnRpZXMgbXVzdCBiZSBpbmRpdmlkdWFsbHkgcmVnaXN0ZXJlZCBmb3IgZWFjaCBjb21wb3VuZC12YWx1ZSBDU1MgcHJvcGVydHkuICovXHJcbiAgICAgICAgICAgIC8qIEVhY2ggdGVtcGxhdGUgY29uc2lzdHMgb2YgdGhlIGNvbXBvdW5kLXZhbHVlJ3MgYmFzZSBuYW1lLCBpdHMgY29uc3RpdHVlbnQgc3VicHJvcGVydHkgbmFtZXMsIGFuZCB0aG9zZSBzdWJwcm9wZXJ0aWVzJyBkZWZhdWx0IHZhbHVlcy4gKi9cclxuICAgICAgICAgICAgdGVtcGxhdGVzOiB7XHJcbiAgICAgICAgICAgICAgICBcInRleHRTaGFkb3dcIjogWyBcIkNvbG9yIFggWSBCbHVyXCIsIFwiYmxhY2sgMHB4IDBweCAwcHhcIiBdLFxyXG4gICAgICAgICAgICAgICAgXCJib3hTaGFkb3dcIjogWyBcIkNvbG9yIFggWSBCbHVyIFNwcmVhZFwiLCBcImJsYWNrIDBweCAwcHggMHB4IDBweFwiIF0sXHJcbiAgICAgICAgICAgICAgICBcImNsaXBcIjogWyBcIlRvcCBSaWdodCBCb3R0b20gTGVmdFwiLCBcIjBweCAwcHggMHB4IDBweFwiIF0sXHJcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmRQb3NpdGlvblwiOiBbIFwiWCBZXCIsIFwiMCUgMCVcIiBdLFxyXG4gICAgICAgICAgICAgICAgXCJ0cmFuc2Zvcm1PcmlnaW5cIjogWyBcIlggWSBaXCIsIFwiNTAlIDUwJSAwcHhcIiBdLFxyXG4gICAgICAgICAgICAgICAgXCJwZXJzcGVjdGl2ZU9yaWdpblwiOiBbIFwiWCBZXCIsIFwiNTAlIDUwJVwiIF1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qIEEgXCJyZWdpc3RlcmVkXCIgaG9vayBpcyBvbmUgdGhhdCBoYXMgYmVlbiBjb252ZXJ0ZWQgZnJvbSBpdHMgdGVtcGxhdGUgZm9ybSBpbnRvIGEgbGl2ZSxcclxuICAgICAgICAgICAgICAgdHdlZW5hYmxlIHByb3BlcnR5LiBJdCBjb250YWlucyBkYXRhIHRvIGFzc29jaWF0ZSBpdCB3aXRoIGl0cyByb290IHByb3BlcnR5LiAqL1xyXG4gICAgICAgICAgICByZWdpc3RlcmVkOiB7XHJcbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBBIHJlZ2lzdGVyZWQgaG9vayBsb29rcyBsaWtlIHRoaXMgPT0+IHRleHRTaGFkb3dCbHVyOiBbIFwidGV4dFNoYWRvd1wiLCAzIF0sXHJcbiAgICAgICAgICAgICAgICAgICB3aGljaCBjb25zaXN0cyBvZiB0aGUgc3VicHJvcGVydHkncyBuYW1lLCB0aGUgYXNzb2NpYXRlZCByb290IHByb3BlcnR5J3MgbmFtZSxcclxuICAgICAgICAgICAgICAgICAgIGFuZCB0aGUgc3VicHJvcGVydHkncyBwb3NpdGlvbiBpbiB0aGUgcm9vdCdzIHZhbHVlLiAqL1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKiBDb252ZXJ0IHRoZSB0ZW1wbGF0ZXMgaW50byBpbmRpdmlkdWFsIGhvb2tzIHRoZW4gYXBwZW5kIHRoZW0gdG8gdGhlIHJlZ2lzdGVyZWQgb2JqZWN0IGFib3ZlLiAqL1xyXG4gICAgICAgICAgICByZWdpc3RlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLyogQ29sb3IgaG9va3MgcmVnaXN0cmF0aW9uOiBDb2xvcnMgYXJlIGRlZmF1bHRlZCB0byB3aGl0ZSAtLSBhcyBvcHBvc2VkIHRvIGJsYWNrIC0tIHNpbmNlIGNvbG9ycyB0aGF0IGFyZVxyXG4gICAgICAgICAgICAgICAgICAgY3VycmVudGx5IHNldCB0byBcInRyYW5zcGFyZW50XCIgZGVmYXVsdCB0byB0aGVpciByZXNwZWN0aXZlIHRlbXBsYXRlIGJlbG93IHdoZW4gY29sb3ItYW5pbWF0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICBhbmQgd2hpdGUgaXMgdHlwaWNhbGx5IGEgY2xvc2VyIG1hdGNoIHRvIHRyYW5zcGFyZW50IHRoYW4gYmxhY2sgaXMuIEFuIGV4Y2VwdGlvbiBpcyBtYWRlIGZvciB0ZXh0IChcImNvbG9yXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgYWxtb3N0IGFsd2F5cyBzZXQgY2xvc2VyIHRvIGJsYWNrIHRoYW4gd2hpdGUuICovXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENTUy5MaXN0cy5jb2xvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcmdiQ29tcG9uZW50cyA9IChDU1MuTGlzdHMuY29sb3JzW2ldID09PSBcImNvbG9yXCIpID8gXCIwIDAgMCAxXCIgOiBcIjI1NSAyNTUgMjU1IDFcIjtcclxuICAgICAgICAgICAgICAgICAgICBDU1MuSG9va3MudGVtcGxhdGVzW0NTUy5MaXN0cy5jb2xvcnNbaV1dID0gWyBcIlJlZCBHcmVlbiBCbHVlIEFscGhhXCIsIHJnYkNvbXBvbmVudHMgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgcm9vdFByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIGhvb2tUZW1wbGF0ZSxcclxuICAgICAgICAgICAgICAgICAgICBob29rTmFtZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogSW4gSUUsIGNvbG9yIHZhbHVlcyBpbnNpZGUgY29tcG91bmQtdmFsdWUgcHJvcGVydGllcyBhcmUgcG9zaXRpb25lZCBhdCB0aGUgZW5kIHRoZSB2YWx1ZSBpbnN0ZWFkIG9mIGF0IHRoZSBiZWdpbm5pbmcuXHJcbiAgICAgICAgICAgICAgICAgICBUaHVzLCB3ZSByZS1hcnJhbmdlIHRoZSB0ZW1wbGF0ZXMgYWNjb3JkaW5nbHkuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoSUUpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHJvb3RQcm9wZXJ0eSBpbiBDU1MuSG9va3MudGVtcGxhdGVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tUZW1wbGF0ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaG9va05hbWVzID0gaG9va1RlbXBsYXRlWzBdLnNwbGl0KFwiIFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0VmFsdWVzID0gaG9va1RlbXBsYXRlWzFdLm1hdGNoKENTUy5SZWdFeC52YWx1ZVNwbGl0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChob29rTmFtZXNbMF0gPT09IFwiQ29sb3JcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVwb3NpdGlvbiBib3RoIHRoZSBob29rJ3MgbmFtZSBhbmQgaXRzIGRlZmF1bHQgdmFsdWUgdG8gdGhlIGVuZCBvZiB0aGVpciByZXNwZWN0aXZlIHN0cmluZ3MuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rTmFtZXMucHVzaChob29rTmFtZXMuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0VmFsdWVzLnB1c2goZGVmYXVsdFZhbHVlcy5zaGlmdCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZXBsYWNlIHRoZSBleGlzdGluZyB0ZW1wbGF0ZSBmb3IgdGhlIGhvb2sncyByb290IHByb3BlcnR5LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLkhvb2tzLnRlbXBsYXRlc1tyb290UHJvcGVydHldID0gWyBob29rTmFtZXMuam9pbihcIiBcIiksIGRlZmF1bHRWYWx1ZXMuam9pbihcIiBcIikgXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBIb29rIHJlZ2lzdHJhdGlvbi4gKi9cclxuICAgICAgICAgICAgICAgIGZvciAocm9vdFByb3BlcnR5IGluIENTUy5Ib29rcy50ZW1wbGF0ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBob29rVGVtcGxhdGUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgaG9va05hbWVzID0gaG9va1RlbXBsYXRlWzBdLnNwbGl0KFwiIFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBob29rTmFtZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ1bGxIb29rTmFtZSA9IHJvb3RQcm9wZXJ0eSArIGhvb2tOYW1lc1tpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tQb3NpdGlvbiA9IGk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZWFjaCBob29rLCByZWdpc3RlciBpdHMgZnVsbCBuYW1lIChlLmcuIHRleHRTaGFkb3dCbHVyKSB3aXRoIGl0cyByb290IHByb3BlcnR5IChlLmcuIHRleHRTaGFkb3cpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGFuZCB0aGUgaG9vaydzIHBvc2l0aW9uIGluIGl0cyB0ZW1wbGF0ZSdzIGRlZmF1bHQgdmFsdWUgc3RyaW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDU1MuSG9va3MucmVnaXN0ZXJlZFtmdWxsSG9va05hbWVdID0gWyByb290UHJvcGVydHksIGhvb2tQb3NpdGlvbiBdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBJbmplY3Rpb24gYW5kIEV4dHJhY3Rpb25cclxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAvKiBMb29rIHVwIHRoZSByb290IHByb3BlcnR5IGFzc29jaWF0ZWQgd2l0aCB0aGUgaG9vayAoZS5nLiByZXR1cm4gXCJ0ZXh0U2hhZG93XCIgZm9yIFwidGV4dFNoYWRvd0JsdXJcIikuICovXHJcbiAgICAgICAgICAgIC8qIFNpbmNlIGEgaG9vayBjYW5ub3QgYmUgc2V0IGRpcmVjdGx5ICh0aGUgYnJvd3NlciB3b24ndCByZWNvZ25pemUgaXQpLCBzdHlsZSB1cGRhdGluZyBmb3IgaG9va3MgaXMgcm91dGVkIHRocm91Z2ggdGhlIGhvb2sncyByb290IHByb3BlcnR5LiAqL1xyXG4gICAgICAgICAgICBnZXRSb290OiBmdW5jdGlvbiAocHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBob29rRGF0YSA9IENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaG9va0RhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaG9va0RhdGFbMF07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZXJlIHdhcyBubyBob29rIG1hdGNoLCByZXR1cm4gdGhlIHByb3BlcnR5IG5hbWUgdW50b3VjaGVkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLyogQ29udmVydCBhbnkgcm9vdFByb3BlcnR5VmFsdWUsIG51bGwgb3Igb3RoZXJ3aXNlLCBpbnRvIGEgc3BhY2UtZGVsaW1pdGVkIGxpc3Qgb2YgaG9vayB2YWx1ZXMgc28gdGhhdFxyXG4gICAgICAgICAgICAgICB0aGUgdGFyZ2V0ZWQgaG9vayBjYW4gYmUgaW5qZWN0ZWQgb3IgZXh0cmFjdGVkIGF0IGl0cyBzdGFuZGFyZCBwb3NpdGlvbi4gKi9cclxuICAgICAgICAgICAgY2xlYW5Sb290UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24ocm9vdFByb3BlcnR5LCByb290UHJvcGVydHlWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgLyogSWYgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIHdyYXBwZWQgd2l0aCBcInJnYigpXCIsIFwiY2xpcCgpXCIsIGV0Yy4sIHJlbW92ZSB0aGUgd3JhcHBpbmcgdG8gbm9ybWFsaXplIHRoZSB2YWx1ZSBiZWZvcmUgbWFuaXB1bGF0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC52YWx1ZVVud3JhcC50ZXN0KHJvb3RQcm9wZXJ0eVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gcm9vdFByb3BlcnR5VmFsdWUubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlVW53cmFwKVsxXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBJZiByb290UHJvcGVydHlWYWx1ZSBpcyBhIENTUyBudWxsLXZhbHVlIChmcm9tIHdoaWNoIHRoZXJlJ3MgaW5oZXJlbnRseSBubyBob29rIHZhbHVlIHRvIGV4dHJhY3QpLFxyXG4gICAgICAgICAgICAgICAgICAgZGVmYXVsdCB0byB0aGUgcm9vdCdzIGRlZmF1bHQgdmFsdWUgYXMgZGVmaW5lZCBpbiBDU1MuSG9va3MudGVtcGxhdGVzLiAqL1xyXG4gICAgICAgICAgICAgICAgLyogTm90ZTogQ1NTIG51bGwtdmFsdWVzIGluY2x1ZGUgXCJub25lXCIsIFwiYXV0b1wiLCBhbmQgXCJ0cmFuc3BhcmVudFwiLiBUaGV5IG11c3QgYmUgY29udmVydGVkIGludG8gdGhlaXJcclxuICAgICAgICAgICAgICAgICAgIHplcm8tdmFsdWVzIChlLmcuIHRleHRTaGFkb3c6IFwibm9uZVwiID09PiB0ZXh0U2hhZG93OiBcIjBweCAwcHggMHB4IGJsYWNrXCIpIGZvciBob29rIG1hbmlwdWxhdGlvbiB0byBwcm9jZWVkLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKENTUy5WYWx1ZXMuaXNDU1NOdWxsVmFsdWUocm9vdFByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Jvb3RQcm9wZXJ0eV1bMV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKiBFeHRyYWN0ZWQgdGhlIGhvb2sncyB2YWx1ZSBmcm9tIGl0cyByb290IHByb3BlcnR5J3MgdmFsdWUuIFRoaXMgaXMgdXNlZCB0byBnZXQgdGhlIHN0YXJ0aW5nIHZhbHVlIG9mIGFuIGFuaW1hdGluZyBob29rLiAqL1xyXG4gICAgICAgICAgICBleHRyYWN0VmFsdWU6IGZ1bmN0aW9uIChmdWxsSG9va05hbWUsIHJvb3RQcm9wZXJ0eVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaG9va0RhdGEgPSBDU1MuSG9va3MucmVnaXN0ZXJlZFtmdWxsSG9va05hbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChob29rRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBob29rUm9vdCA9IGhvb2tEYXRhWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob29rUG9zaXRpb24gPSBob29rRGF0YVsxXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuY2xlYW5Sb290UHJvcGVydHlWYWx1ZShob29rUm9vdCwgcm9vdFByb3BlcnR5VmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBTcGxpdCByb290UHJvcGVydHlWYWx1ZSBpbnRvIGl0cyBjb25zdGl0dWVudCBob29rIHZhbHVlcyB0aGVuIGdyYWIgdGhlIGRlc2lyZWQgaG9vayBhdCBpdHMgc3RhbmRhcmQgcG9zaXRpb24uICovXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlLnRvU3RyaW5nKCkubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlU3BsaXQpW2hvb2tQb3NpdGlvbl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBwcm92aWRlZCBmdWxsSG9va05hbWUgaXNuJ3QgYSByZWdpc3RlcmVkIGhvb2ssIHJldHVybiB0aGUgcm9vdFByb3BlcnR5VmFsdWUgdGhhdCB3YXMgcGFzc2VkIGluLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb290UHJvcGVydHlWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLyogSW5qZWN0IHRoZSBob29rJ3MgdmFsdWUgaW50byBpdHMgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiBUaGlzIGlzIHVzZWQgdG8gcGllY2UgYmFjayB0b2dldGhlciB0aGUgcm9vdCBwcm9wZXJ0eVxyXG4gICAgICAgICAgICAgICBvbmNlIFZlbG9jaXR5IGhhcyB1cGRhdGVkIG9uZSBvZiBpdHMgaW5kaXZpZHVhbGx5IGhvb2tlZCB2YWx1ZXMgdGhyb3VnaCB0d2VlbmluZy4gKi9cclxuICAgICAgICAgICAgaW5qZWN0VmFsdWU6IGZ1bmN0aW9uIChmdWxsSG9va05hbWUsIGhvb2tWYWx1ZSwgcm9vdFByb3BlcnR5VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBob29rRGF0YSA9IENTUy5Ib29rcy5yZWdpc3RlcmVkW2Z1bGxIb29rTmFtZV07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGhvb2tEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tSb290ID0gaG9va0RhdGFbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvb2tQb3NpdGlvbiA9IGhvb2tEYXRhWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVBhcnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVVwZGF0ZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLkhvb2tzLmNsZWFuUm9vdFByb3BlcnR5VmFsdWUoaG9va1Jvb3QsIHJvb3RQcm9wZXJ0eVZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogU3BsaXQgcm9vdFByb3BlcnR5VmFsdWUgaW50byBpdHMgaW5kaXZpZHVhbCBob29rIHZhbHVlcywgcmVwbGFjZSB0aGUgdGFyZ2V0ZWQgdmFsdWUgd2l0aCBob29rVmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGhlbiByZWNvbnN0cnVjdCB0aGUgcm9vdFByb3BlcnR5VmFsdWUgc3RyaW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlUGFydHMgPSByb290UHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKENTUy5SZWdFeC52YWx1ZVNwbGl0KTtcclxuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZVBhcnRzW2hvb2tQb3NpdGlvbl0gPSBob29rVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWVVcGRhdGVkID0gcm9vdFByb3BlcnR5VmFsdWVQYXJ0cy5qb2luKFwiIFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlVXBkYXRlZDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHByb3ZpZGVkIGZ1bGxIb29rTmFtZSBpc24ndCBhIHJlZ2lzdGVyZWQgaG9vaywgcmV0dXJuIHRoZSByb290UHJvcGVydHlWYWx1ZSB0aGF0IHdhcyBwYXNzZWQgaW4uICovXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvb3RQcm9wZXJ0eVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICBOb3JtYWxpemF0aW9uc1xyXG4gICAgICAgICoqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIC8qIE5vcm1hbGl6YXRpb25zIHN0YW5kYXJkaXplIENTUyBwcm9wZXJ0eSBtYW5pcHVsYXRpb24gYnkgcG9sbHlmaWxsaW5nIGJyb3dzZXItc3BlY2lmaWMgaW1wbGVtZW50YXRpb25zIChlLmcuIG9wYWNpdHkpXHJcbiAgICAgICAgICAgYW5kIHJlZm9ybWF0dGluZyBzcGVjaWFsIHByb3BlcnRpZXMgKGUuZy4gY2xpcCwgcmdiYSkgdG8gbG9vayBsaWtlIHN0YW5kYXJkIG9uZXMuICovXHJcbiAgICAgICAgTm9ybWFsaXphdGlvbnM6IHtcclxuICAgICAgICAgICAgLyogTm9ybWFsaXphdGlvbnMgYXJlIHBhc3NlZCBhIG5vcm1hbGl6YXRpb24gdGFyZ2V0IChlaXRoZXIgdGhlIHByb3BlcnR5J3MgbmFtZSwgaXRzIGV4dHJhY3RlZCB2YWx1ZSwgb3IgaXRzIGluamVjdGVkIHZhbHVlKSxcclxuICAgICAgICAgICAgICAgdGhlIHRhcmdldGVkIGVsZW1lbnQgKHdoaWNoIG1heSBuZWVkIHRvIGJlIHF1ZXJpZWQpLCBhbmQgdGhlIHRhcmdldGVkIHByb3BlcnR5IHZhbHVlLiAqL1xyXG4gICAgICAgICAgICByZWdpc3RlcmVkOiB7XHJcbiAgICAgICAgICAgICAgICBjbGlwOiBmdW5jdGlvbiAodHlwZSwgZWxlbWVudCwgcHJvcGVydHlWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiY2xpcFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGlwIG5lZWRzIHRvIGJlIHVud3JhcHBlZCBhbmQgc3RyaXBwZWQgb2YgaXRzIGNvbW1hcyBkdXJpbmcgZXh0cmFjdGlvbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBleHRyYWN0ZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgVmVsb2NpdHkgYWxzbyBleHRyYWN0ZWQgdGhpcyB2YWx1ZSwgc2tpcCBleHRyYWN0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC53cmFwcGVkVmFsdWVBbHJlYWR5RXh0cmFjdGVkLnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSBwcm9wZXJ0eVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIFwicmVjdCgpXCIgd3JhcHBlci4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSBwcm9wZXJ0eVZhbHVlLnRvU3RyaW5nKCkubWF0Y2goQ1NTLlJlZ0V4LnZhbHVlVW53cmFwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RyaXAgb2ZmIGNvbW1hcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSBleHRyYWN0ZWQgPyBleHRyYWN0ZWRbMV0ucmVwbGFjZSgvLChcXHMrKT8vZywgXCIgXCIpIDogcHJvcGVydHlWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0cmFjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBDbGlwIG5lZWRzIHRvIGJlIHJlLXdyYXBwZWQgZHVyaW5nIGluamVjdGlvbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicmVjdChcIiArIHByb3BlcnR5VmFsdWUgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgICAgIGJsdXI6IGZ1bmN0aW9uKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBWZWxvY2l0eS5TdGF0ZS5pc0ZpcmVmb3ggPyBcImZpbHRlclwiIDogXCItd2Via2l0LWZpbHRlclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGV4dHJhY3RlZCA9IHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgZXh0cmFjdGVkIGlzIE5hTiwgbWVhbmluZyB0aGUgdmFsdWUgaXNuJ3QgYWxyZWFkeSBleHRyYWN0ZWQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShleHRyYWN0ZWQgfHwgZXh0cmFjdGVkID09PSAwKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBibHVyQ29tcG9uZW50ID0gcHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKC9ibHVyXFwoKFswLTldK1tBLXpdKylcXCkvaSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBmaWx0ZXIgc3RyaW5nIGhhZCBhIGJsdXIgY29tcG9uZW50LCByZXR1cm4ganVzdCB0aGUgYmx1ciB2YWx1ZSBhbmQgdW5pdCB0eXBlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChibHVyQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IGJsdXJDb21wb25lbnRbMV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNvbXBvbmVudCBkb2Vzbid0IGV4aXN0LCBkZWZhdWx0IGJsdXIgdG8gMC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHRyYWN0ZWQgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZXh0cmFjdGVkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBCbHVyIG5lZWRzIHRvIGJlIHJlLXdyYXBwZWQgZHVyaW5nIGluamVjdGlvbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluamVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIHRoZSBibHVyIGVmZmVjdCB0byBiZSBmdWxseSBkZS1hcHBsaWVkLCBpdCBuZWVkcyB0byBiZSBzZXQgdG8gXCJub25lXCIgaW5zdGVhZCBvZiAwLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibm9uZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJibHVyKFwiICsgcHJvcGVydHlWYWx1ZSArIFwiKVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAgLyogPD1JRTggZG8gbm90IHN1cHBvcnQgdGhlIHN0YW5kYXJkIG9wYWNpdHkgcHJvcGVydHkuIFRoZXkgdXNlIGZpbHRlcjphbHBoYShvcGFjaXR5PUlOVCkgaW5zdGVhZC4gKi9cclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGZ1bmN0aW9uICh0eXBlLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwibmFtZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImZpbHRlclwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiA8PUlFOCByZXR1cm4gYSBcImZpbHRlclwiIHZhbHVlIG9mIFwiYWxwaGEob3BhY2l0eT1cXGR7MSwzfSlcIi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFeHRyYWN0IHRoZSB2YWx1ZSBhbmQgY29udmVydCBpdCB0byBhIGRlY2ltYWwgdmFsdWUgdG8gbWF0Y2ggdGhlIHN0YW5kYXJkIENTUyBvcGFjaXR5IHByb3BlcnR5J3MgZm9ybWF0dGluZy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZS50b1N0cmluZygpLm1hdGNoKC9hbHBoYVxcKG9wYWNpdHk9KC4qKVxcKS9pKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4dHJhY3RlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IHRvIGRlY2ltYWwgdmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBleHRyYWN0ZWRbMV0gLyAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hlbiBleHRyYWN0aW5nIG9wYWNpdHksIGRlZmF1bHQgdG8gMSBzaW5jZSBhIG51bGwgdmFsdWUgbWVhbnMgb3BhY2l0eSBoYXNuJ3QgYmVlbiBzZXQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3BhY2lmaWVkIGVsZW1lbnRzIGFyZSByZXF1aXJlZCB0byBoYXZlIHRoZWlyIHpvb20gcHJvcGVydHkgc2V0IHRvIGEgbm9uLXplcm8gdmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS56b29tID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU2V0dGluZyB0aGUgZmlsdGVyIHByb3BlcnR5IG9uIGVsZW1lbnRzIHdpdGggY2VydGFpbiBmb250IHByb3BlcnR5IGNvbWJpbmF0aW9ucyBjYW4gcmVzdWx0IGluIGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobHkgdW5hcHBlYWxpbmcgdWx0cmEtYm9sZGluZyBlZmZlY3QuIFRoZXJlJ3Mgbm8gd2F5IHRvIHJlbWVkeSB0aGlzIHRocm91Z2hvdXQgYSB0d2VlbiwgYnV0IGRyb3BwaW5nIHRoZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlIGFsdG9nZXRoZXIgKHdoZW4gb3BhY2l0eSBoaXRzIDEpIGF0IGxlYXN0cyBlbnN1cmVzIHRoYXQgdGhlIGdsaXRjaCBpcyBnb25lIHBvc3QtdHdlZW5pbmcuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQocHJvcGVydHlWYWx1ZSkgPj0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQXMgcGVyIHRoZSBmaWx0ZXIgcHJvcGVydHkncyBzcGVjLCBjb252ZXJ0IHRoZSBkZWNpbWFsIHZhbHVlIHRvIGEgd2hvbGUgbnVtYmVyIGFuZCB3cmFwIHRoZSB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcImFscGhhKG9wYWNpdHk9XCIgKyBwYXJzZUludChwYXJzZUZsb2F0KHByb3BlcnR5VmFsdWUpICogMTAwLCAxMCkgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvKiBXaXRoIGFsbCBvdGhlciBicm93c2Vycywgbm9ybWFsaXphdGlvbiBpcyBub3QgcmVxdWlyZWQ7IHJldHVybiB0aGUgc2FtZSB2YWx1ZXMgdGhhdCB3ZXJlIHBhc3NlZCBpbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwib3BhY2l0eVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmplY3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHlWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgQmF0Y2hlZCBSZWdpc3RyYXRpb25zXHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgLyogTm90ZTogQmF0Y2hlZCBub3JtYWxpemF0aW9ucyBleHRlbmQgdGhlIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkIG9iamVjdC4gKi9cclxuICAgICAgICAgICAgcmVnaXN0ZXI6IGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICBUcmFuc2Zvcm1zXHJcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm1zIGFyZSB0aGUgc3VicHJvcGVydGllcyBjb250YWluZWQgYnkgdGhlIENTUyBcInRyYW5zZm9ybVwiIHByb3BlcnR5LiBUcmFuc2Zvcm1zIG11c3QgdW5kZXJnbyBub3JtYWxpemF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICBzbyB0aGF0IHRoZXkgY2FuIGJlIHJlZmVyZW5jZWQgaW4gYSBwcm9wZXJ0aWVzIG1hcCBieSB0aGVpciBpbmRpdmlkdWFsIG5hbWVzLiAqL1xyXG4gICAgICAgICAgICAgICAgLyogTm90ZTogV2hlbiB0cmFuc2Zvcm1zIGFyZSBcInNldFwiLCB0aGV5IGFyZSBhY3R1YWxseSBhc3NpZ25lZCB0byBhIHBlci1lbGVtZW50IHRyYW5zZm9ybUNhY2hlLiBXaGVuIGFsbCB0cmFuc2Zvcm1cclxuICAgICAgICAgICAgICAgICAgIHNldHRpbmcgaXMgY29tcGxldGUgY29tcGxldGUsIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKCkgbXVzdCBiZSBtYW51YWxseSBjYWxsZWQgdG8gZmx1c2ggdGhlIHZhbHVlcyB0byB0aGUgRE9NLlxyXG4gICAgICAgICAgICAgICAgICAgVHJhbnNmb3JtIHNldHRpbmcgaXMgYmF0Y2hlZCBpbiB0aGlzIHdheSB0byBpbXByb3ZlIHBlcmZvcm1hbmNlOiB0aGUgdHJhbnNmb3JtIHN0eWxlIG9ubHkgbmVlZHMgdG8gYmUgdXBkYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgb25jZSB3aGVuIG11bHRpcGxlIHRyYW5zZm9ybSBzdWJwcm9wZXJ0aWVzIGFyZSBiZWluZyBhbmltYXRlZCBzaW11bHRhbmVvdXNseS4gKi9cclxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IElFOSBhbmQgQW5kcm9pZCBHaW5nZXJicmVhZCBoYXZlIHN1cHBvcnQgZm9yIDJEIC0tIGJ1dCBub3QgM0QgLS0gdHJhbnNmb3Jtcy4gU2luY2UgYW5pbWF0aW5nIHVuc3VwcG9ydGVkXHJcbiAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm0gcHJvcGVydGllcyByZXN1bHRzIGluIHRoZSBicm93c2VyIGlnbm9yaW5nIHRoZSAqZW50aXJlKiB0cmFuc2Zvcm0gc3RyaW5nLCB3ZSBwcmV2ZW50IHRoZXNlIDNEIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgZnJvbSBiZWluZyBub3JtYWxpemVkIGZvciB0aGVzZSBicm93c2VycyBzbyB0aGF0IHR3ZWVuaW5nIHNraXBzIHRoZXNlIHByb3BlcnRpZXMgYWx0b2dldGhlclxyXG4gICAgICAgICAgICAgICAgICAgKHNpbmNlIGl0IHdpbGwgaWdub3JlIHRoZW0gYXMgYmVpbmcgdW5zdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuKSAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKCEoSUUgPD0gOSkgJiYgIVZlbG9jaXR5LlN0YXRlLmlzR2luZ2VyYnJlYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBTaW5jZSB0aGUgc3RhbmRhbG9uZSBDU1MgXCJwZXJzcGVjdGl2ZVwiIHByb3BlcnR5IGFuZCB0aGUgQ1NTIHRyYW5zZm9ybSBcInBlcnNwZWN0aXZlXCIgc3VicHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICBzaGFyZSB0aGUgc2FtZSBuYW1lLCB0aGUgbGF0dGVyIGlzIGdpdmVuIGEgdW5pcXVlIHRva2VuIHdpdGhpbiBWZWxvY2l0eTogXCJ0cmFuc2Zvcm1QZXJzcGVjdGl2ZVwiLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZSA9IENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZS5jb25jYXQoQ1NTLkxpc3RzLnRyYW5zZm9ybXMzRCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDU1MuTGlzdHMudHJhbnNmb3Jtc0Jhc2UubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBXcmFwIHRoZSBkeW5hbWljYWxseSBnZW5lcmF0ZWQgbm9ybWFsaXphdGlvbiBmdW5jdGlvbiBpbiBhIG5ldyBzY29wZSBzbyB0aGF0IHRyYW5zZm9ybU5hbWUncyB2YWx1ZSBpc1xyXG4gICAgICAgICAgICAgICAgICAgIHBhaXJlZCB3aXRoIGl0cyByZXNwZWN0aXZlIGZ1bmN0aW9uLiAoT3RoZXJ3aXNlLCBhbGwgZnVuY3Rpb25zIHdvdWxkIHRha2UgdGhlIGZpbmFsIGZvciBsb29wJ3MgdHJhbnNmb3JtTmFtZS4pICovXHJcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtTmFtZSA9IENTUy5MaXN0cy50cmFuc2Zvcm1zQmFzZVtpXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3RyYW5zZm9ybU5hbWVdID0gZnVuY3Rpb24gKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBub3JtYWxpemVkIHByb3BlcnR5IG5hbWUgaXMgdGhlIHBhcmVudCBcInRyYW5zZm9ybVwiIHByb3BlcnR5IC0tIHRoZSBwcm9wZXJ0eSB0aGF0IGlzIGFjdHVhbGx5IHNldCBpbiBDU1MuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm5hbWVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwidHJhbnNmb3JtXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHJhbnNmb3JtIHZhbHVlcyBhcmUgY2FjaGVkIG9udG8gYSBwZXItZWxlbWVudCB0cmFuc2Zvcm1DYWNoZSBvYmplY3QuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImV4dHJhY3RcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyB0cmFuc2Zvcm0gaGFzIHlldCB0byBiZSBhc3NpZ25lZCBhIHZhbHVlLCByZXR1cm4gaXRzIG51bGwgdmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQgfHwgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTY2FsZSBDU1MuTGlzdHMudHJhbnNmb3Jtc0Jhc2UgZGVmYXVsdCB0byAxIHdoZXJlYXMgYWxsIG90aGVyIHRyYW5zZm9ybSBwcm9wZXJ0aWVzIGRlZmF1bHQgdG8gMC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAvXnNjYWxlL2kudGVzdCh0cmFuc2Zvcm1OYW1lKSA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHRyYW5zZm9ybSB2YWx1ZXMgYXJlIHNldCwgdGhleSBhcmUgd3JhcHBlZCBpbiBwYXJlbnRoZXNlcyBhcyBwZXIgdGhlIENTUyBzcGVjLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaHVzLCB3aGVuIGV4dHJhY3RpbmcgdGhlaXIgdmFsdWVzIChmb3IgdHdlZW4gY2FsY3VsYXRpb25zKSwgd2Ugc3RyaXAgb2ZmIHRoZSBwYXJlbnRoZXNlcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdLnJlcGxhY2UoL1soKV0vZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbnZhbGlkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBhbiBpbmRpdmlkdWFsIHRyYW5zZm9ybSBwcm9wZXJ0eSBjb250YWlucyBhbiB1bnN1cHBvcnRlZCB1bml0IHR5cGUsIHRoZSBicm93c2VyIGlnbm9yZXMgdGhlICplbnRpcmUqIHRyYW5zZm9ybSBwcm9wZXJ0eS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGh1cywgcHJvdGVjdCB1c2VycyBmcm9tIHRoZW1zZWx2ZXMgYnkgc2tpcHBpbmcgc2V0dGluZyBmb3IgdHJhbnNmb3JtIHZhbHVlcyBzdXBwbGllZCB3aXRoIGludmFsaWQgdW5pdCB0eXBlcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3dpdGNoIG9uIHRoZSBiYXNlIHRyYW5zZm9ybSB0eXBlOyBpZ25vcmUgdGhlIGF4aXMgYnkgcmVtb3ZpbmcgdGhlIGxhc3QgbGV0dGVyIGZyb20gdGhlIHRyYW5zZm9ybSdzIG5hbWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHJhbnNmb3JtTmFtZS5zdWJzdHIoMCwgdHJhbnNmb3JtTmFtZS5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogV2hpdGVsaXN0IHVuaXQgdHlwZXMgZm9yIGVhY2ggdHJhbnNmb3JtLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRyYW5zbGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludmFsaWQgPSAhLyglfHB4fGVtfHJlbXx2d3x2aHxcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSBhbiBheGlzLWZyZWUgXCJzY2FsZVwiIHByb3BlcnR5IGlzIHN1cHBvcnRlZCBhcyB3ZWxsLCBhIGxpdHRsZSBoYWNrIGlzIHVzZWQgaGVyZSB0byBkZXRlY3QgaXQgYnkgY2hvcHBpbmcgb2ZmIGl0cyBsYXN0IGxldHRlci4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzY2FsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwic2NhbGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDaHJvbWUgb24gQW5kcm9pZCBoYXMgYSBidWcgaW4gd2hpY2ggc2NhbGVkIGVsZW1lbnRzIGJsdXIgaWYgdGhlaXIgaW5pdGlhbCBzY2FsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlIGlzIGJlbG93IDEgKHdoaWNoIGNhbiBoYXBwZW4gd2l0aCBmb3JjZWZlZWRpbmcpLiBUaHVzLCB3ZSBkZXRlY3QgYSB5ZXQtdW5zZXQgc2NhbGUgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbmQgZW5zdXJlIHRoYXQgaXRzIGZpcnN0IHZhbHVlIGlzIGFsd2F5cyAxLiBNb3JlIGluZm86IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA0MTc4OTAvY3NzMy1hbmltYXRpb25zLXdpdGgtdHJhbnNmb3JtLWNhdXNlcy1ibHVycmVkLWVsZW1lbnRzLW9uLXdlYmtpdC8xMDQxNzk2MiMxMDQxNzk2MiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5pc0FuZHJvaWQgJiYgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXSA9PT0gdW5kZWZpbmVkICYmIHByb3BlcnR5VmFsdWUgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZCA9ICEvKFxcZCkkL2kudGVzdChwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJza2V3XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZCA9ICEvKGRlZ3xcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicm90YXRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW52YWxpZCA9ICEvKGRlZ3xcXGQpJC9pLnRlc3QocHJvcGVydHlWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaW52YWxpZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQXMgcGVyIHRoZSBDU1Mgc3BlYywgd3JhcCB0aGUgdmFsdWUgaW4gcGFyZW50aGVzZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdID0gXCIoXCIgKyBwcm9wZXJ0eVZhbHVlICsgXCIpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsdGhvdWdoIHRoZSB2YWx1ZSBpcyBzZXQgb24gdGhlIHRyYW5zZm9ybUNhY2hlIG9iamVjdCwgcmV0dXJuIHRoZSBuZXdseS11cGRhdGVkIHZhbHVlIGZvciB0aGUgY2FsbGluZyBjb2RlIHRvIHByb2Nlc3MgYXMgbm9ybWFsLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgQ29sb3JzXHJcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIFNpbmNlIFZlbG9jaXR5IG9ubHkgYW5pbWF0ZXMgYSBzaW5nbGUgbnVtZXJpYyB2YWx1ZSBwZXIgcHJvcGVydHksIGNvbG9yIGFuaW1hdGlvbiBpcyBhY2hpZXZlZCBieSBob29raW5nIHRoZSBpbmRpdmlkdWFsIFJHQkEgY29tcG9uZW50cyBvZiBDU1MgY29sb3IgcHJvcGVydGllcy5cclxuICAgICAgICAgICAgICAgICAgIEFjY29yZGluZ2x5LCBjb2xvciB2YWx1ZXMgbXVzdCBiZSBub3JtYWxpemVkIChlLmcuIFwiI2ZmMDAwMFwiLCBcInJlZFwiLCBhbmQgXCJyZ2IoMjU1LCAwLCAwKVwiID09PiBcIjI1NSAwIDAgMVwiKSBzbyB0aGF0IHRoZWlyIGNvbXBvbmVudHMgY2FuIGJlIGluamVjdGVkL2V4dHJhY3RlZCBieSBDU1MuSG9va3MgbG9naWMuICovXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENTUy5MaXN0cy5jb2xvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBXcmFwIHRoZSBkeW5hbWljYWxseSBnZW5lcmF0ZWQgbm9ybWFsaXphdGlvbiBmdW5jdGlvbiBpbiBhIG5ldyBzY29wZSBzbyB0aGF0IGNvbG9yTmFtZSdzIHZhbHVlIGlzIHBhaXJlZCB3aXRoIGl0cyByZXNwZWN0aXZlIGZ1bmN0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgIChPdGhlcndpc2UsIGFsbCBmdW5jdGlvbnMgd291bGQgdGFrZSB0aGUgZmluYWwgZm9yIGxvb3AncyBjb2xvck5hbWUuKSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb2xvck5hbWUgPSBDU1MuTGlzdHMuY29sb3JzW2ldO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSW4gSUU8PTgsIHdoaWNoIHN1cHBvcnQgcmdiIGJ1dCBub3QgcmdiYSwgY29sb3IgcHJvcGVydGllcyBhcmUgcmV2ZXJ0ZWQgdG8gcmdiIGJ5IHN0cmlwcGluZyBvZmYgdGhlIGFscGhhIGNvbXBvbmVudC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbY29sb3JOYW1lXSA9IGZ1bmN0aW9uKHR5cGUsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJuYW1lXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvck5hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCBhbGwgY29sb3IgdmFsdWVzIGludG8gdGhlIHJnYiBmb3JtYXQuIChPbGQgSUUgY2FuIHJldHVybiBoZXggdmFsdWVzIGFuZCBjb2xvciBuYW1lcyBpbnN0ZWFkIG9mIHJnYi9yZ2JhLikgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZXh0cmFjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXh0cmFjdGVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGNvbG9yIGlzIGFscmVhZHkgaW4gaXRzIGhvb2thYmxlIGZvcm0gKGUuZy4gXCIyNTUgMjU1IDI1NSAxXCIpIGR1ZSB0byBoYXZpbmcgYmVlbiBwcmV2aW91c2x5IGV4dHJhY3RlZCwgc2tpcCBleHRyYWN0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLlJlZ0V4LndyYXBwZWRWYWx1ZUFscmVhZHlFeHRyYWN0ZWQudGVzdChwcm9wZXJ0eVZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkID0gcHJvcGVydHlWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb252ZXJ0ZWQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3JOYW1lcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxhY2s6IFwicmdiKDAsIDAsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsdWU6IFwicmdiKDAsIDAsIDI1NSlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JheTogXCJyZ2IoMTI4LCAxMjgsIDEyOClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JlZW46IFwicmdiKDAsIDEyOCwgMClcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVkOiBcInJnYigyNTUsIDAsIDApXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdoaXRlOiBcInJnYigyNTUsIDI1NSwgMjU1KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBDb252ZXJ0IGNvbG9yIG5hbWVzIHRvIHJnYi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXltBLXpdKyQvaS50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbG9yTmFtZXNbcHJvcGVydHlWYWx1ZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBjb2xvck5hbWVzW3Byb3BlcnR5VmFsdWVdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgYW4gdW5tYXRjaGVkIGNvbG9yIG5hbWUgaXMgcHJvdmlkZWQsIGRlZmF1bHQgdG8gYmxhY2suICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlZCA9IGNvbG9yTmFtZXMuYmxhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCBoZXggdmFsdWVzIHRvIHJnYi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoQ1NTLlJlZ0V4LmlzSGV4LnRlc3QocHJvcGVydHlWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBcInJnYihcIiArIENTUy5WYWx1ZXMuaGV4VG9SZ2IocHJvcGVydHlWYWx1ZSkuam9pbihcIiBcIikgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBwcm92aWRlZCBjb2xvciBkb2Vzbid0IG1hdGNoIGFueSBvZiB0aGUgYWNjZXB0ZWQgY29sb3IgZm9ybWF0cywgZGVmYXVsdCB0byBibGFjay4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoISgvXnJnYmE/XFwoL2kudGVzdChwcm9wZXJ0eVZhbHVlKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZWQgPSBjb2xvck5hbWVzLmJsYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFJlbW92ZSB0aGUgc3Vycm91bmRpbmcgXCJyZ2IvcmdiYSgpXCIgc3RyaW5nIHRoZW4gcmVwbGFjZSBjb21tYXMgd2l0aCBzcGFjZXMgYW5kIHN0cmlwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXBlYXRlZCBzcGFjZXMgKGluIGNhc2UgdGhlIHZhbHVlIGluY2x1ZGVkIHNwYWNlcyB0byBiZWdpbiB3aXRoKS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4dHJhY3RlZCA9IChjb252ZXJ0ZWQgfHwgcHJvcGVydHlWYWx1ZSkudG9TdHJpbmcoKS5tYXRjaChDU1MuUmVnRXgudmFsdWVVbndyYXApWzFdLnJlcGxhY2UoLywoXFxzKyk/L2csIFwiIFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU28gbG9uZyBhcyB0aGlzIGlzbid0IDw9SUU4LCBhZGQgYSBmb3VydGggKGFscGhhKSBjb21wb25lbnQgaWYgaXQncyBtaXNzaW5nIGFuZCBkZWZhdWx0IGl0IHRvIDEgKHZpc2libGUpLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIShJRSA8PSA4KSAmJiBleHRyYWN0ZWQuc3BsaXQoXCIgXCIpLmxlbmd0aCA9PT0gMykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXh0cmFjdGVkICs9IFwiIDFcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4dHJhY3RlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5qZWN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgSUU8PTggYW5kIGFuIGFscGhhIGNvbXBvbmVudCBleGlzdHMsIHN0cmlwIGl0IG9mZi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKElFIDw9IDgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVZhbHVlLnNwbGl0KFwiIFwiKS5sZW5ndGggPT09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gcHJvcGVydHlWYWx1ZS5zcGxpdCgvXFxzKy8pLnNsaWNlKDAsIDMpLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBPdGhlcndpc2UsIGFkZCBhIGZvdXJ0aCAoYWxwaGEpIGNvbXBvbmVudCBpZiBpdCdzIG1pc3NpbmcgYW5kIGRlZmF1bHQgaXQgdG8gMSAodmlzaWJsZSkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHlWYWx1ZS5zcGxpdChcIiBcIikubGVuZ3RoID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlICs9IFwiIDFcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmUtaW5zZXJ0IHRoZSBicm93c2VyLWFwcHJvcHJpYXRlIHdyYXBwZXIoXCJyZ2IvcmdiYSgpXCIpLCBpbnNlcnQgY29tbWFzLCBhbmQgc3RyaXAgb2ZmIGRlY2ltYWwgdW5pdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gYWxsIHZhbHVlcyBidXQgdGhlIGZvdXJ0aCAoUiwgRywgYW5kIEIgb25seSBhY2NlcHQgd2hvbGUgbnVtYmVycykuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoSUUgPD0gOCA/IFwicmdiXCIgOiBcInJnYmFcIikgKyBcIihcIiArIHByb3BlcnR5VmFsdWUucmVwbGFjZSgvXFxzKy9nLCBcIixcIikucmVwbGFjZSgvXFwuKFxcZCkrKD89LCkvZywgXCJcIikgKyBcIilcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgIENTUyBQcm9wZXJ0eSBOYW1lc1xyXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgTmFtZXM6IHtcclxuICAgICAgICAgICAgLyogQ2FtZWxjYXNlIGEgcHJvcGVydHkgbmFtZSBpbnRvIGl0cyBKYXZhU2NyaXB0IG5vdGF0aW9uIChlLmcuIFwiYmFja2dyb3VuZC1jb2xvclwiID09PiBcImJhY2tncm91bmRDb2xvclwiKS5cclxuICAgICAgICAgICAgICAgQ2FtZWxjYXNpbmcgaXMgdXNlZCB0byBub3JtYWxpemUgcHJvcGVydHkgbmFtZXMgYmV0d2VlbiBhbmQgYWNyb3NzIGNhbGxzLiAqL1xyXG4gICAgICAgICAgICBjYW1lbENhc2U6IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5LnJlcGxhY2UoLy0oXFx3KS9nLCBmdW5jdGlvbiAobWF0Y2gsIHN1Yk1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1Yk1hdGNoLnRvVXBwZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qIEZvciBTVkcgZWxlbWVudHMsIHNvbWUgcHJvcGVydGllcyAobmFtZWx5LCBkaW1lbnNpb25hbCBvbmVzKSBhcmUgR0VUL1NFVCB2aWEgdGhlIGVsZW1lbnQncyBIVE1MIGF0dHJpYnV0ZXMgKGluc3RlYWQgb2YgdmlhIENTUyBzdHlsZXMpLiAqL1xyXG4gICAgICAgICAgICBTVkdBdHRyaWJ1dGU6IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIFNWR0F0dHJpYnV0ZXMgPSBcIndpZHRofGhlaWdodHx4fHl8Y3h8Y3l8cnxyeHxyeXx4MXx4Mnx5MXx5MlwiO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIENlcnRhaW4gYnJvd3NlcnMgcmVxdWlyZSBhbiBTVkcgdHJhbnNmb3JtIHRvIGJlIGFwcGxpZWQgYXMgYW4gYXR0cmlidXRlLiAoT3RoZXJ3aXNlLCBhcHBsaWNhdGlvbiB2aWEgQ1NTIGlzIHByZWZlcmFibGUgZHVlIHRvIDNEIHN1cHBvcnQuKSAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKElFIHx8IChWZWxvY2l0eS5TdGF0ZS5pc0FuZHJvaWQgJiYgIVZlbG9jaXR5LlN0YXRlLmlzQ2hyb21lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIFNWR0F0dHJpYnV0ZXMgKz0gXCJ8dHJhbnNmb3JtXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoXCJeKFwiICsgU1ZHQXR0cmlidXRlcyArIFwiKSRcIiwgXCJpXCIpLnRlc3QocHJvcGVydHkpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLyogRGV0ZXJtaW5lIHdoZXRoZXIgYSBwcm9wZXJ0eSBzaG91bGQgYmUgc2V0IHdpdGggYSB2ZW5kb3IgcHJlZml4LiAqL1xyXG4gICAgICAgICAgICAvKiBJZiBhIHByZWZpeGVkIHZlcnNpb24gb2YgdGhlIHByb3BlcnR5IGV4aXN0cywgcmV0dXJuIGl0LiBPdGhlcndpc2UsIHJldHVybiB0aGUgb3JpZ2luYWwgcHJvcGVydHkgbmFtZS5cclxuICAgICAgICAgICAgICAgSWYgdGhlIHByb3BlcnR5IGlzIG5vdCBhdCBhbGwgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCByZXR1cm4gYSBmYWxzZSBmbGFnLiAqL1xyXG4gICAgICAgICAgICBwcmVmaXhDaGVjazogZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIHByb3BlcnR5IGhhcyBhbHJlYWR5IGJlZW4gY2hlY2tlZCwgcmV0dXJuIHRoZSBjYWNoZWQgdmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkuU3RhdGUucHJlZml4TWF0Y2hlc1twcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBWZWxvY2l0eS5TdGF0ZS5wcmVmaXhNYXRjaGVzW3Byb3BlcnR5XSwgdHJ1ZSBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmVuZG9ycyA9IFsgXCJcIiwgXCJXZWJraXRcIiwgXCJNb3pcIiwgXCJtc1wiLCBcIk9cIiBdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgdmVuZG9yc0xlbmd0aCA9IHZlbmRvcnMubGVuZ3RoOyBpIDwgdmVuZG9yc0xlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVByZWZpeGVkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5UHJlZml4ZWQgPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhcGl0YWxpemUgdGhlIGZpcnN0IGxldHRlciBvZiB0aGUgcHJvcGVydHkgdG8gY29uZm9ybSB0byBKYXZhU2NyaXB0IHZlbmRvciBwcmVmaXggbm90YXRpb24gKGUuZy4gd2Via2l0RmlsdGVyKS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5UHJlZml4ZWQgPSB2ZW5kb3JzW2ldICsgcHJvcGVydHkucmVwbGFjZSgvXlxcdy8sIGZ1bmN0aW9uKG1hdGNoKSB7IHJldHVybiBtYXRjaC50b1VwcGVyQ2FzZSgpOyB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgdGhpcyBwcm9wZXJ0eSBhcyBwcmVmaXhlZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNTdHJpbmcoVmVsb2NpdHkuU3RhdGUucHJlZml4RWxlbWVudC5zdHlsZVtwcm9wZXJ0eVByZWZpeGVkXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENhY2hlIHRoZSBtYXRjaC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLnByZWZpeE1hdGNoZXNbcHJvcGVydHldID0gcHJvcGVydHlQcmVmaXhlZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBwcm9wZXJ0eVByZWZpeGVkLCB0cnVlIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBicm93c2VyIGRvZXNuJ3Qgc3VwcG9ydCB0aGlzIHByb3BlcnR5IGluIGFueSBmb3JtLCBpbmNsdWRlIGEgZmFsc2UgZmxhZyBzbyB0aGF0IHRoZSBjYWxsZXIgY2FuIGRlY2lkZSBob3cgdG8gcHJvY2VlZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBwcm9wZXJ0eSwgZmFsc2UgXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICBDU1MgUHJvcGVydHkgVmFsdWVzXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICBWYWx1ZXM6IHtcclxuICAgICAgICAgICAgLyogSGV4IHRvIFJHQiBjb252ZXJzaW9uLiBDb3B5cmlnaHQgVGltIERvd246IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNTYyMzgzOC9yZ2ItdG8taGV4LWFuZC1oZXgtdG8tcmdiICovXHJcbiAgICAgICAgICAgIGhleFRvUmdiOiBmdW5jdGlvbiAoaGV4KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2hvcnRmb3JtUmVnZXggPSAvXiM/KFthLWZcXGRdKShbYS1mXFxkXSkoW2EtZlxcZF0pJC9pLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdmb3JtUmVnZXggPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLFxyXG4gICAgICAgICAgICAgICAgICAgIHJnYlBhcnRzO1xyXG5cclxuICAgICAgICAgICAgICAgIGhleCA9IGhleC5yZXBsYWNlKHNob3J0Zm9ybVJlZ2V4LCBmdW5jdGlvbiAobSwgciwgZywgYikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByICsgciArIGcgKyBnICsgYiArIGI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZ2JQYXJ0cyA9IGxvbmdmb3JtUmVnZXguZXhlYyhoZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZ2JQYXJ0cyA/IFsgcGFyc2VJbnQocmdiUGFydHNbMV0sIDE2KSwgcGFyc2VJbnQocmdiUGFydHNbMl0sIDE2KSwgcGFyc2VJbnQocmdiUGFydHNbM10sIDE2KSBdIDogWyAwLCAwLCAwIF07XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBpc0NTU051bGxWYWx1ZTogZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBUaGUgYnJvd3NlciBkZWZhdWx0cyBDU1MgdmFsdWVzIHRoYXQgaGF2ZSBub3QgYmVlbiBzZXQgdG8gZWl0aGVyIDAgb3Igb25lIG9mIHNldmVyYWwgcG9zc2libGUgbnVsbC12YWx1ZSBzdHJpbmdzLlxyXG4gICAgICAgICAgICAgICAgICAgVGh1cywgd2UgY2hlY2sgZm9yIGJvdGggZmFsc2luZXNzIGFuZCB0aGVzZSBzcGVjaWFsIHN0cmluZ3MuICovXHJcbiAgICAgICAgICAgICAgICAvKiBOdWxsLXZhbHVlIGNoZWNraW5nIGlzIHBlcmZvcm1lZCB0byBkZWZhdWx0IHRoZSBzcGVjaWFsIHN0cmluZ3MgdG8gMCAoZm9yIHRoZSBzYWtlIG9mIHR3ZWVuaW5nKSBvciB0aGVpciBob29rXHJcbiAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZXMgYXMgZGVmaW5lZCBhcyBDU1MuSG9va3MgKGZvciB0aGUgc2FrZSBvZiBob29rIGluamVjdGlvbi9leHRyYWN0aW9uKS4gKi9cclxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IENocm9tZSByZXR1cm5zIFwicmdiYSgwLCAwLCAwLCAwKVwiIGZvciBhbiB1bmRlZmluZWQgY29sb3Igd2hlcmVhcyBJRSByZXR1cm5zIFwidHJhbnNwYXJlbnRcIi4gKi9cclxuICAgICAgICAgICAgICAgIHJldHVybiAodmFsdWUgPT0gMCB8fCAvXihub25lfGF1dG98dHJhbnNwYXJlbnR8KHJnYmFcXCgwLCA/MCwgPzAsID8wXFwpKSkkL2kudGVzdCh2YWx1ZSkpO1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgLyogUmV0cmlldmUgYSBwcm9wZXJ0eSdzIGRlZmF1bHQgdW5pdCB0eXBlLiBVc2VkIGZvciBhc3NpZ25pbmcgYSB1bml0IHR5cGUgd2hlbiBvbmUgaXMgbm90IHN1cHBsaWVkIGJ5IHRoZSB1c2VyLiAqL1xyXG4gICAgICAgICAgICBnZXRVbml0VHlwZTogZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoL14ocm90YXRlfHNrZXcpL2kudGVzdChwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJkZWdcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoLyheKHNjYWxlfHNjYWxlWHxzY2FsZVl8c2NhbGVafGFscGhhfGZsZXhHcm93fGZsZXhIZWlnaHR8ekluZGV4fGZvbnRXZWlnaHQpJCl8KChvcGFjaXR5fHJlZHxncmVlbnxibHVlfGFscGhhKSQpL2kudGVzdChwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgYWJvdmUgcHJvcGVydGllcyBhcmUgdW5pdGxlc3MuICovXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gcHggZm9yIGFsbCBvdGhlciBwcm9wZXJ0aWVzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInB4XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAvKiBIVE1MIGVsZW1lbnRzIGRlZmF1bHQgdG8gYW4gYXNzb2NpYXRlZCBkaXNwbGF5IHR5cGUgd2hlbiB0aGV5J3JlIG5vdCBzZXQgdG8gZGlzcGxheTpub25lLiAqL1xyXG4gICAgICAgICAgICAvKiBOb3RlOiBUaGlzIGZ1bmN0aW9uIGlzIHVzZWQgZm9yIGNvcnJlY3RseSBzZXR0aW5nIHRoZSBub24tXCJub25lXCIgZGlzcGxheSB2YWx1ZSBpbiBjZXJ0YWluIFZlbG9jaXR5IHJlZGlyZWN0cywgc3VjaCBhcyBmYWRlSW4vT3V0LiAqL1xyXG4gICAgICAgICAgICBnZXREaXNwbGF5VHlwZTogZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHZhciB0YWdOYW1lID0gZWxlbWVudCAmJiBlbGVtZW50LnRhZ05hbWUudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgvXihifGJpZ3xpfHNtYWxsfHR0fGFiYnJ8YWNyb255bXxjaXRlfGNvZGV8ZGZufGVtfGtiZHxzdHJvbmd8c2FtcHx2YXJ8YXxiZG98YnJ8aW1nfG1hcHxvYmplY3R8cXxzY3JpcHR8c3BhbnxzdWJ8c3VwfGJ1dHRvbnxpbnB1dHxsYWJlbHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QodGFnTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJpbmxpbmVcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14obGkpJC9pLnRlc3QodGFnTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJsaXN0LWl0ZW1cIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14odHIpJC9pLnRlc3QodGFnTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0YWJsZS1yb3dcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL14odGFibGUpJC9pLnRlc3QodGFnTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJ0YWJsZVwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXih0Ym9keSkkL2kudGVzdCh0YWdOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBcInRhYmxlLXJvdy1ncm91cFwiO1xyXG4gICAgICAgICAgICAgICAgLyogRGVmYXVsdCB0byBcImJsb2NrXCIgd2hlbiBubyBtYXRjaCBpcyBmb3VuZC4gKi9cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiYmxvY2tcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIC8qIFRoZSBjbGFzcyBhZGQvcmVtb3ZlIGZ1bmN0aW9ucyBhcmUgdXNlZCB0byB0ZW1wb3JhcmlseSBhcHBseSBhIFwidmVsb2NpdHktYW5pbWF0aW5nXCIgY2xhc3MgdG8gZWxlbWVudHMgd2hpbGUgdGhleSdyZSBhbmltYXRpbmcuICovXHJcbiAgICAgICAgICAgIGFkZENsYXNzOiBmdW5jdGlvbiAoZWxlbWVudCwgY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgKz0gKGVsZW1lbnQuY2xhc3NOYW1lLmxlbmd0aCA/IFwiIFwiIDogXCJcIikgKyBjbGFzc05hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICByZW1vdmVDbGFzczogZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuY2xhc3NMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuY2xhc3NOYW1lID0gZWxlbWVudC5jbGFzc05hbWUudG9TdHJpbmcoKS5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoXnxcXFxccylcIiArIGNsYXNzTmFtZS5zcGxpdChcIiBcIikuam9pbihcInxcIikgKyBcIihcXFxcc3wkKVwiLCBcImdpXCIpLCBcIiBcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgIFN0eWxlIEdldHRpbmcgJiBTZXR0aW5nXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgLyogVGhlIHNpbmd1bGFyIGdldFByb3BlcnR5VmFsdWUsIHdoaWNoIHJvdXRlcyB0aGUgbG9naWMgZm9yIGFsbCBub3JtYWxpemF0aW9ucywgaG9va3MsIGFuZCBzdGFuZGFyZCBDU1MgcHJvcGVydGllcy4gKi9cclxuICAgICAgICBnZXRQcm9wZXJ0eVZhbHVlOiBmdW5jdGlvbiAoZWxlbWVudCwgcHJvcGVydHksIHJvb3RQcm9wZXJ0eVZhbHVlLCBmb3JjZVN0eWxlTG9va3VwKSB7XHJcbiAgICAgICAgICAgIC8qIEdldCBhbiBlbGVtZW50J3MgY29tcHV0ZWQgcHJvcGVydHkgdmFsdWUuICovXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IFJldHJpZXZpbmcgdGhlIHZhbHVlIG9mIGEgQ1NTIHByb3BlcnR5IGNhbm5vdCBzaW1wbHkgYmUgcGVyZm9ybWVkIGJ5IGNoZWNraW5nIGFuIGVsZW1lbnQnc1xyXG4gICAgICAgICAgICAgICBzdHlsZSBhdHRyaWJ1dGUgKHdoaWNoIG9ubHkgcmVmbGVjdHMgdXNlci1kZWZpbmVkIHZhbHVlcykuIEluc3RlYWQsIHRoZSBicm93c2VyIG11c3QgYmUgcXVlcmllZCBmb3IgYSBwcm9wZXJ0eSdzXHJcbiAgICAgICAgICAgICAgICpjb21wdXRlZCogdmFsdWUuIFlvdSBjYW4gcmVhZCBtb3JlIGFib3V0IGdldENvbXB1dGVkU3R5bGUgaGVyZTogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vZG9jcy9XZWIvQVBJL3dpbmRvdy5nZXRDb21wdXRlZFN0eWxlICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNvbXB1dGVQcm9wZXJ0eVZhbHVlIChlbGVtZW50LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgLyogV2hlbiBib3gtc2l6aW5nIGlzbid0IHNldCB0byBib3JkZXItYm94LCBoZWlnaHQgYW5kIHdpZHRoIHN0eWxlIHZhbHVlcyBhcmUgaW5jb3JyZWN0bHkgY29tcHV0ZWQgd2hlbiBhblxyXG4gICAgICAgICAgICAgICAgICAgZWxlbWVudCdzIHNjcm9sbGJhcnMgYXJlIHZpc2libGUgKHdoaWNoIGV4cGFuZHMgdGhlIGVsZW1lbnQncyBkaW1lbnNpb25zKS4gVGh1cywgd2UgZGVmZXIgdG8gdGhlIG1vcmUgYWNjdXJhdGVcclxuICAgICAgICAgICAgICAgICAgIG9mZnNldEhlaWdodC9XaWR0aCBwcm9wZXJ0eSwgd2hpY2ggaW5jbHVkZXMgdGhlIHRvdGFsIGRpbWVuc2lvbnMgZm9yIGludGVyaW9yLCBib3JkZXIsIHBhZGRpbmcsIGFuZCBzY3JvbGxiYXIuXHJcbiAgICAgICAgICAgICAgICAgICBXZSBzdWJ0cmFjdCBib3JkZXIgYW5kIHBhZGRpbmcgdG8gZ2V0IHRoZSBzdW0gb2YgaW50ZXJpb3IgKyBzY3JvbGxiYXIuICovXHJcbiAgICAgICAgICAgICAgICB2YXIgY29tcHV0ZWRWYWx1ZSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogSUU8PTggZG9lc24ndCBzdXBwb3J0IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlLCB0aHVzIHdlIGRlZmVyIHRvIGpRdWVyeSwgd2hpY2ggaGFzIGFuIGV4dGVuc2l2ZSBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgb2YgaGFja3MgdG8gYWNjdXJhdGVseSByZXRyaWV2ZSBJRTggcHJvcGVydHkgdmFsdWVzLiBSZS1pbXBsZW1lbnRpbmcgdGhhdCBsb2dpYyBoZXJlIGlzIG5vdCB3b3J0aCBibG9hdGluZyB0aGVcclxuICAgICAgICAgICAgICAgICAgIGNvZGViYXNlIGZvciBhIGR5aW5nIGJyb3dzZXIuIFRoZSBwZXJmb3JtYW5jZSByZXBlcmN1c3Npb25zIG9mIHVzaW5nIGpRdWVyeSBoZXJlIGFyZSBtaW5pbWFsIHNpbmNlXHJcbiAgICAgICAgICAgICAgICAgICBWZWxvY2l0eSBpcyBvcHRpbWl6ZWQgdG8gcmFyZWx5IChhbmQgc29tZXRpbWVzIG5ldmVyKSBxdWVyeSB0aGUgRE9NLiBGdXJ0aGVyLCB0aGUgJC5jc3MoKSBjb2RlcGF0aCBpc24ndCB0aGF0IHNsb3cuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoSUUgPD0gOCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSAkLmNzcyhlbGVtZW50LCBwcm9wZXJ0eSk7IC8qIEdFVCAqL1xyXG4gICAgICAgICAgICAgICAgLyogQWxsIG90aGVyIGJyb3dzZXJzIHN1cHBvcnQgZ2V0Q29tcHV0ZWRTdHlsZS4gVGhlIHJldHVybmVkIGxpdmUgb2JqZWN0IHJlZmVyZW5jZSBpcyBjYWNoZWQgb250byBpdHNcclxuICAgICAgICAgICAgICAgICAgIGFzc29jaWF0ZWQgZWxlbWVudCBzbyB0aGF0IGl0IGRvZXMgbm90IG5lZWQgdG8gYmUgcmVmZXRjaGVkIHVwb24gZXZlcnkgR0VULiAqL1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBCcm93c2VycyBkbyBub3QgcmV0dXJuIGhlaWdodCBhbmQgd2lkdGggdmFsdWVzIGZvciBlbGVtZW50cyB0aGF0IGFyZSBzZXQgdG8gZGlzcGxheTpcIm5vbmVcIi4gVGh1cywgd2UgdGVtcG9yYXJpbHlcclxuICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGUgZGlzcGxheSB0byB0aGUgZWxlbWVudCB0eXBlJ3MgZGVmYXVsdCB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdG9nZ2xlRGlzcGxheSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoL14od2lkdGh8aGVpZ2h0KSQvLnRlc3QocHJvcGVydHkpICYmIENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiKSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b2dnbGVEaXNwbGF5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIENTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZWxlbWVudCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gcmV2ZXJ0RGlzcGxheSAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0b2dnbGVEaXNwbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWZvcmNlU3R5bGVMb29rdXApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcImhlaWdodFwiICYmIENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm94U2l6aW5nXCIpLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKSAhPT0gXCJib3JkZXItYm94XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjb250ZW50Qm94SGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJvcmRlclRvcFdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm9yZGVyQm90dG9tV2lkdGhcIikpIHx8IDApIC0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwYWRkaW5nVG9wXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ0JvdHRvbVwiKSkgfHwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXZlcnREaXNwbGF5KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbnRlbnRCb3hIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydHkgPT09IFwid2lkdGhcIiAmJiBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcImJveFNpemluZ1wiKS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkgIT09IFwiYm9yZGVyLWJveFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29udGVudEJveFdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aCAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm9yZGVyTGVmdFdpZHRoXCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiYm9yZGVyUmlnaHRXaWR0aFwiKSkgfHwgMCkgLSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBhZGRpbmdMZWZ0XCIpKSB8fCAwKSAtIChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwicGFkZGluZ1JpZ2h0XCIpKSB8fCAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydERpc3BsYXkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29udGVudEJveFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tcHV0ZWRTdHlsZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogRm9yIGVsZW1lbnRzIHRoYXQgVmVsb2NpdHkgaGFzbid0IGJlZW4gY2FsbGVkIG9uIGRpcmVjdGx5IChlLmcuIHdoZW4gVmVsb2NpdHkgcXVlcmllcyB0aGUgRE9NIG9uIGJlaGFsZlxyXG4gICAgICAgICAgICAgICAgICAgICAgIG9mIGEgcGFyZW50IG9mIGFuIGVsZW1lbnQgaXRzIGFuaW1hdGluZyksIHBlcmZvcm0gYSBkaXJlY3QgZ2V0Q29tcHV0ZWRTdHlsZSBsb29rdXAgc2luY2UgdGhlIG9iamVjdCBpc24ndCBjYWNoZWQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7IC8qIEdFVCAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBjb21wdXRlZFN0eWxlIG9iamVjdCBoYXMgeWV0IHRvIGJlIGNhY2hlZCwgZG8gc28gbm93LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIURhdGEoZWxlbWVudCkuY29tcHV0ZWRTdHlsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFN0eWxlID0gRGF0YShlbGVtZW50KS5jb21wdXRlZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCwgbnVsbCk7IC8qIEdFVCAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIGNvbXB1dGVkU3R5bGUgaXMgY2FjaGVkLCB1c2UgaXQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHV0ZWRTdHlsZSA9IERhdGEoZWxlbWVudCkuY29tcHV0ZWRTdHlsZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIElFIGFuZCBGaXJlZm94IGRvIG5vdCByZXR1cm4gYSB2YWx1ZSBmb3IgdGhlIGdlbmVyaWMgYm9yZGVyQ29sb3IgLS0gdGhleSBvbmx5IHJldHVybiBpbmRpdmlkdWFsIHZhbHVlcyBmb3IgZWFjaCBib3JkZXIgc2lkZSdzIGNvbG9yLlxyXG4gICAgICAgICAgICAgICAgICAgICAgIEFsc28sIGluIGFsbCBicm93c2Vycywgd2hlbiBib3JkZXIgY29sb3JzIGFyZW4ndCBhbGwgdGhlIHNhbWUsIGEgY29tcG91bmQgdmFsdWUgaXMgcmV0dXJuZWQgdGhhdCBWZWxvY2l0eSBpc24ndCBzZXR1cCB0byBwYXJzZS5cclxuICAgICAgICAgICAgICAgICAgICAgICBTbywgYXMgYSBwb2x5ZmlsbCBmb3IgcXVlcnlpbmcgaW5kaXZpZHVhbCBib3JkZXIgc2lkZSBjb2xvcnMsIHdlIGp1c3QgcmV0dXJuIHRoZSB0b3AgYm9yZGVyJ3MgY29sb3IgYW5kIGFuaW1hdGUgYWxsIGJvcmRlcnMgZnJvbSB0aGF0IHZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gXCJib3JkZXJDb2xvclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gXCJib3JkZXJUb3BDb2xvclwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogSUU5IGhhcyBhIGJ1ZyBpbiB3aGljaCB0aGUgXCJmaWx0ZXJcIiBwcm9wZXJ0eSBtdXN0IGJlIGFjY2Vzc2VkIGZyb20gY29tcHV0ZWRTdHlsZSB1c2luZyB0aGUgZ2V0UHJvcGVydHlWYWx1ZSBtZXRob2RcclxuICAgICAgICAgICAgICAgICAgICAgICBpbnN0ZWFkIG9mIGEgZGlyZWN0IHByb3BlcnR5IGxvb2t1cC4gVGhlIGdldFByb3BlcnR5VmFsdWUgbWV0aG9kIGlzIHNsb3dlciB0aGFuIGEgZGlyZWN0IGxvb2t1cCwgd2hpY2ggaXMgd2h5IHdlIGF2b2lkIGl0IGJ5IGRlZmF1bHQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKElFID09PSA5ICYmIHByb3BlcnR5ID09PSBcImZpbHRlclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWUgPSBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpOyAvKiBHRVQgKi9cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gY29tcHV0ZWRTdHlsZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBGYWxsIGJhY2sgdG8gdGhlIHByb3BlcnR5J3Mgc3R5bGUgdmFsdWUgKGlmIGRlZmluZWQpIHdoZW4gY29tcHV0ZWRWYWx1ZSByZXR1cm5zIG5vdGhpbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggY2FuIGhhcHBlbiB3aGVuIHRoZSBlbGVtZW50IGhhc24ndCBiZWVuIHBhaW50ZWQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXB1dGVkVmFsdWUgPT09IFwiXCIgfHwgY29tcHV0ZWRWYWx1ZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXZlcnREaXNwbGF5KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogRm9yIHRvcCwgcmlnaHQsIGJvdHRvbSwgYW5kIGxlZnQgKFRSQkwpIHZhbHVlcyB0aGF0IGFyZSBzZXQgdG8gXCJhdXRvXCIgb24gZWxlbWVudHMgb2YgXCJmaXhlZFwiIG9yIFwiYWJzb2x1dGVcIiBwb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgIGRlZmVyIHRvIGpRdWVyeSBmb3IgY29udmVydGluZyBcImF1dG9cIiB0byBhIG51bWVyaWMgdmFsdWUuIChGb3IgZWxlbWVudHMgd2l0aCBhIFwic3RhdGljXCIgb3IgXCJyZWxhdGl2ZVwiIHBvc2l0aW9uLCBcImF1dG9cIiBoYXMgdGhlIHNhbWVcclxuICAgICAgICAgICAgICAgICAgIGVmZmVjdCBhcyBiZWluZyBzZXQgdG8gMCwgc28gbm8gY29udmVyc2lvbiBpcyBuZWNlc3NhcnkuKSAqL1xyXG4gICAgICAgICAgICAgICAgLyogQW4gZXhhbXBsZSBvZiB3aHkgbnVtZXJpYyBjb252ZXJzaW9uIGlzIG5lY2Vzc2FyeTogV2hlbiBhbiBlbGVtZW50IHdpdGggXCJwb3NpdGlvbjphYnNvbHV0ZVwiIGhhcyBhbiB1bnRvdWNoZWQgXCJsZWZ0XCJcclxuICAgICAgICAgICAgICAgICAgIHByb3BlcnR5LCB3aGljaCByZXZlcnRzIHRvIFwiYXV0b1wiLCBsZWZ0J3MgdmFsdWUgaXMgMCByZWxhdGl2ZSB0byBpdHMgcGFyZW50IGVsZW1lbnQsIGJ1dCBpcyBvZnRlbiBub24temVybyByZWxhdGl2ZVxyXG4gICAgICAgICAgICAgICAgICAgdG8gaXRzICpjb250YWluaW5nKiAobm90IHBhcmVudCkgZWxlbWVudCwgd2hpY2ggaXMgdGhlIG5lYXJlc3QgXCJwb3NpdGlvbjpyZWxhdGl2ZVwiIGFuY2VzdG9yIG9yIHRoZSB2aWV3cG9ydCAoYW5kIGFsd2F5cyB0aGUgdmlld3BvcnQgaW4gdGhlIGNhc2Ugb2YgXCJwb3NpdGlvbjpmaXhlZFwiKS4gKi9cclxuICAgICAgICAgICAgICAgIGlmIChjb21wdXRlZFZhbHVlID09PSBcImF1dG9cIiAmJiAvXih0b3B8cmlnaHR8Ym90dG9tfGxlZnQpJC9pLnRlc3QocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0gY29tcHV0ZVByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJwb3NpdGlvblwiKTsgLyogR0VUICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBhYnNvbHV0ZSBwb3NpdGlvbmluZywgalF1ZXJ5J3MgJC5wb3NpdGlvbigpIG9ubHkgcmV0dXJucyB2YWx1ZXMgZm9yIHRvcCBhbmQgbGVmdDtcclxuICAgICAgICAgICAgICAgICAgICAgICByaWdodCBhbmQgYm90dG9tIHdpbGwgaGF2ZSB0aGVpciBcImF1dG9cIiB2YWx1ZSByZXZlcnRlZCB0byAwLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEEgalF1ZXJ5IG9iamVjdCBtdXN0IGJlIGNyZWF0ZWQgaGVyZSBzaW5jZSBqUXVlcnkgZG9lc24ndCBoYXZlIGEgbG93LWxldmVsIGFsaWFzIGZvciAkLnBvc2l0aW9uKCkuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgTm90IGEgYmlnIGRlYWwgc2luY2Ugd2UncmUgY3VycmVudGx5IGluIGEgR0VUIGJhdGNoIGFueXdheS4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAocG9zaXRpb24gPT09IFwiZml4ZWRcIiB8fCAocG9zaXRpb24gPT09IFwiYWJzb2x1dGVcIiAmJiAvdG9wfGxlZnQvaS50ZXN0KHByb3BlcnR5KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogalF1ZXJ5IHN0cmlwcyB0aGUgcGl4ZWwgdW5pdCBmcm9tIGl0cyByZXR1cm5lZCB2YWx1ZXM7IHdlIHJlLWFkZCBpdCBoZXJlIHRvIGNvbmZvcm0gd2l0aCBjb21wdXRlUHJvcGVydHlWYWx1ZSdzIGJlaGF2aW9yLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wdXRlZFZhbHVlID0gJChlbGVtZW50KS5wb3NpdGlvbigpW3Byb3BlcnR5XSArIFwicHhcIjsgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHlWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgIC8qIElmIHRoaXMgaXMgYSBob29rZWQgcHJvcGVydHkgKGUuZy4gXCJjbGlwTGVmdFwiIGluc3RlYWQgb2YgdGhlIHJvb3QgcHJvcGVydHkgb2YgXCJjbGlwXCIpLFxyXG4gICAgICAgICAgICAgICBleHRyYWN0IHRoZSBob29rJ3MgdmFsdWUgZnJvbSBhIG5vcm1hbGl6ZWQgcm9vdFByb3BlcnR5VmFsdWUgdXNpbmcgQ1NTLkhvb2tzLmV4dHJhY3RWYWx1ZSgpLiAqL1xyXG4gICAgICAgICAgICBpZiAoQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaG9vayA9IHByb3BlcnR5LFxyXG4gICAgICAgICAgICAgICAgICAgIGhvb2tSb290ID0gQ1NTLkhvb2tzLmdldFJvb3QoaG9vayk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogSWYgYSBjYWNoZWQgcm9vdFByb3BlcnR5VmFsdWUgd2Fzbid0IHBhc3NlZCBpbiAod2hpY2ggVmVsb2NpdHkgYWx3YXlzIGF0dGVtcHRzIHRvIGRvIGluIG9yZGVyIHRvIGF2b2lkIHJlcXVlcnlpbmcgdGhlIERPTSksXHJcbiAgICAgICAgICAgICAgICAgICBxdWVyeSB0aGUgRE9NIGZvciB0aGUgcm9vdCBwcm9wZXJ0eSdzIHZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHJvb3RQcm9wZXJ0eVZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGUgYnJvd3NlciBpcyBub3cgYmVpbmcgZGlyZWN0bHkgcXVlcmllZCwgdXNlIHRoZSBvZmZpY2lhbCBwb3N0LXByZWZpeGluZyBwcm9wZXJ0eSBuYW1lIGZvciB0aGlzIGxvb2t1cC4gKi9cclxuICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIENTUy5OYW1lcy5wcmVmaXhDaGVjayhob29rUm9vdClbMF0pOyAvKiBHRVQgKi9cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIHJvb3QgaGFzIGEgbm9ybWFsaXphdGlvbiByZWdpc3RlcmVkLCBwZWZvcm0gdGhlIGFzc29jaWF0ZWQgbm9ybWFsaXphdGlvbiBleHRyYWN0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW2hvb2tSb290XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbaG9va1Jvb3RdKFwiZXh0cmFjdFwiLCBlbGVtZW50LCByb290UHJvcGVydHlWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogRXh0cmFjdCB0aGUgaG9vaydzIHZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy5leHRyYWN0VmFsdWUoaG9vaywgcm9vdFByb3BlcnR5VmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgLyogSWYgdGhpcyBpcyBhIG5vcm1hbGl6ZWQgcHJvcGVydHkgKGUuZy4gXCJvcGFjaXR5XCIgYmVjb21lcyBcImZpbHRlclwiIGluIDw9SUU4KSBvciBcInRyYW5zbGF0ZVhcIiBiZWNvbWVzIFwidHJhbnNmb3JtXCIpLFxyXG4gICAgICAgICAgICAgICBub3JtYWxpemUgdGhlIHByb3BlcnR5J3MgbmFtZSBhbmQgdmFsdWUsIGFuZCBoYW5kbGUgdGhlIHNwZWNpYWwgY2FzZSBvZiB0cmFuc2Zvcm1zLiAqL1xyXG4gICAgICAgICAgICAvKiBOb3RlOiBOb3JtYWxpemluZyBhIHByb3BlcnR5IGlzIG11dHVhbGx5IGV4Y2x1c2l2ZSBmcm9tIGhvb2tpbmcgYSBwcm9wZXJ0eSBzaW5jZSBob29rLWV4dHJhY3RlZCB2YWx1ZXMgYXJlIHN0cmljdGx5XHJcbiAgICAgICAgICAgICAgIG51bWVyaWNhbCBhbmQgdGhlcmVmb3JlIGRvIG5vdCByZXF1aXJlIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbi4gKi9cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBub3JtYWxpemVkUHJvcGVydHlOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wZXJ0eVZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZWRQcm9wZXJ0eU5hbWUgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJuYW1lXCIsIGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgdmlhIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbiAoc2VlIGJlbG93KSwgd2hpY2ggY2hlY2tzIGFnYWluc3QgdGhlIGVsZW1lbnQncyB0cmFuc2Zvcm1DYWNoZS5cclxuICAgICAgICAgICAgICAgICAgIEF0IG5vIHBvaW50IGRvIHRyYW5zZm9ybSBHRVRzIGV2ZXIgYWN0dWFsbHkgcXVlcnkgdGhlIERPTTsgaW5pdGlhbCBzdHlsZXNoZWV0IHZhbHVlcyBhcmUgbmV2ZXIgcHJvY2Vzc2VkLlxyXG4gICAgICAgICAgICAgICAgICAgVGhpcyBpcyBiZWNhdXNlIHBhcnNpbmcgM0QgdHJhbnNmb3JtIG1hdHJpY2VzIGlzIG5vdCBhbHdheXMgYWNjdXJhdGUgYW5kIHdvdWxkIGJsb2F0IG91ciBjb2RlYmFzZTtcclxuICAgICAgICAgICAgICAgICAgIHRodXMsIG5vcm1hbGl6YXRpb24gZXh0cmFjdGlvbiBkZWZhdWx0cyBpbml0aWFsIHRyYW5zZm9ybSB2YWx1ZXMgdG8gdGhlaXIgemVyby12YWx1ZXMgKGUuZy4gMSBmb3Igc2NhbGVYIGFuZCAwIGZvciB0cmFuc2xhdGVYKS4gKi9cclxuICAgICAgICAgICAgICAgIGlmIChub3JtYWxpemVkUHJvcGVydHlOYW1lICE9PSBcInRyYW5zZm9ybVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3BlcnR5VmFsdWUgPSBjb21wdXRlUHJvcGVydHlWYWx1ZShlbGVtZW50LCBDU1MuTmFtZXMucHJlZml4Q2hlY2sobm9ybWFsaXplZFByb3BlcnR5TmFtZSlbMF0pOyAvKiBHRVQgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHZhbHVlIGlzIGEgQ1NTIG51bGwtdmFsdWUgYW5kIHRoaXMgcHJvcGVydHkgaGFzIGEgaG9vayB0ZW1wbGF0ZSwgdXNlIHRoYXQgemVyby12YWx1ZSB0ZW1wbGF0ZSBzbyB0aGF0IGhvb2tzIGNhbiBiZSBleHRyYWN0ZWQgZnJvbSBpdC4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLlZhbHVlcy5pc0NTU051bGxWYWx1ZShub3JtYWxpemVkUHJvcGVydHlWYWx1ZSkgJiYgQ1NTLkhvb2tzLnRlbXBsYXRlc1twcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsaXplZFByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MudGVtcGxhdGVzW3Byb3BlcnR5XVsxXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcImV4dHJhY3RcIiwgZWxlbWVudCwgbm9ybWFsaXplZFByb3BlcnR5VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBJZiBhIChudW1lcmljKSB2YWx1ZSB3YXNuJ3QgcHJvZHVjZWQgdmlhIGhvb2sgZXh0cmFjdGlvbiBvciBub3JtYWxpemF0aW9uLCBxdWVyeSB0aGUgRE9NLiAqL1xyXG4gICAgICAgICAgICBpZiAoIS9eW1xcZC1dLy50ZXN0KHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBGb3IgU1ZHIGVsZW1lbnRzLCBkaW1lbnNpb25hbCBwcm9wZXJ0aWVzICh3aGljaCBTVkdBdHRyaWJ1dGUoKSBkZXRlY3RzKSBhcmUgdHdlZW5lZCB2aWFcclxuICAgICAgICAgICAgICAgICAgIHRoZWlyIEhUTUwgYXR0cmlidXRlIHZhbHVlcyBpbnN0ZWFkIG9mIHRoZWlyIENTUyBzdHlsZSB2YWx1ZXMuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSAmJiBEYXRhKGVsZW1lbnQpLmlzU1ZHICYmIENTUy5OYW1lcy5TVkdBdHRyaWJ1dGUocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGhlaWdodC93aWR0aCBhdHRyaWJ1dGUgdmFsdWVzIG11c3QgYmUgc2V0IG1hbnVhbGx5LCB0aGV5IGRvbid0IHJlZmxlY3QgY29tcHV0ZWQgdmFsdWVzLlxyXG4gICAgICAgICAgICAgICAgICAgICAgIFRodXMsIHdlIHVzZSB1c2UgZ2V0QkJveCgpIHRvIGVuc3VyZSB3ZSBhbHdheXMgZ2V0IHZhbHVlcyBmb3IgZWxlbWVudHMgd2l0aCB1bmRlZmluZWQgaGVpZ2h0L3dpZHRoIGF0dHJpYnV0ZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9eKGhlaWdodHx3aWR0aCkkL2kudGVzdChwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRmlyZWZveCB0aHJvd3MgYW4gZXJyb3IgaWYgLmdldEJCb3goKSBpcyBjYWxsZWQgb24gYW4gU1ZHIHRoYXQgaXNuJ3QgYXR0YWNoZWQgdG8gdGhlIERPTS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBlbGVtZW50LmdldEJCb3goKVtwcm9wZXJ0eV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgYWNjZXNzIHRoZSBhdHRyaWJ1dGUgdmFsdWUgZGlyZWN0bHkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBjb21wdXRlUHJvcGVydHlWYWx1ZShlbGVtZW50LCBDU1MuTmFtZXMucHJlZml4Q2hlY2socHJvcGVydHkpWzBdKTsgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFNpbmNlIHByb3BlcnR5IGxvb2t1cHMgYXJlIGZvciBhbmltYXRpb24gcHVycG9zZXMgKHdoaWNoIGVudGFpbHMgY29tcHV0aW5nIHRoZSBudW1lcmljIGRlbHRhIGJldHdlZW4gc3RhcnQgYW5kIGVuZCB2YWx1ZXMpLFxyXG4gICAgICAgICAgICAgICBjb252ZXJ0IENTUyBudWxsLXZhbHVlcyB0byBhbiBpbnRlZ2VyIG9mIHZhbHVlIDAuICovXHJcbiAgICAgICAgICAgIGlmIChDU1MuVmFsdWVzLmlzQ1NTTnVsbFZhbHVlKHByb3BlcnR5VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eVZhbHVlID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnID49IDIpIGNvbnNvbGUubG9nKFwiR2V0IFwiICsgcHJvcGVydHkgKyBcIjogXCIgKyBwcm9wZXJ0eVZhbHVlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eVZhbHVlO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qIFRoZSBzaW5ndWxhciBzZXRQcm9wZXJ0eVZhbHVlLCB3aGljaCByb3V0ZXMgdGhlIGxvZ2ljIGZvciBhbGwgbm9ybWFsaXphdGlvbnMsIGhvb2tzLCBhbmQgc3RhbmRhcmQgQ1NTIHByb3BlcnRpZXMuICovXHJcbiAgICAgICAgc2V0UHJvcGVydHlWYWx1ZTogZnVuY3Rpb24oZWxlbWVudCwgcHJvcGVydHksIHByb3BlcnR5VmFsdWUsIHJvb3RQcm9wZXJ0eVZhbHVlLCBzY3JvbGxEYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eTtcclxuXHJcbiAgICAgICAgICAgIC8qIEluIG9yZGVyIHRvIGJlIHN1YmplY3RlZCB0byBjYWxsIG9wdGlvbnMgYW5kIGVsZW1lbnQgcXVldWVpbmcsIHNjcm9sbCBhbmltYXRpb24gaXMgcm91dGVkIHRocm91Z2ggVmVsb2NpdHkgYXMgaWYgaXQgd2VyZSBhIHN0YW5kYXJkIENTUyBwcm9wZXJ0eS4gKi9cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBcInNjcm9sbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBJZiBhIGNvbnRhaW5lciBvcHRpb24gaXMgcHJlc2VudCwgc2Nyb2xsIHRoZSBjb250YWluZXIgaW5zdGVhZCBvZiB0aGUgYnJvd3NlciB3aW5kb3cuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoc2Nyb2xsRGF0YS5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxEYXRhLmNvbnRhaW5lcltcInNjcm9sbFwiICsgc2Nyb2xsRGF0YS5kaXJlY3Rpb25dID0gcHJvcGVydHlWYWx1ZTtcclxuICAgICAgICAgICAgICAgIC8qIE90aGVyd2lzZSwgVmVsb2NpdHkgZGVmYXVsdHMgdG8gc2Nyb2xsaW5nIHRoZSBicm93c2VyIHdpbmRvdy4gKi9cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjcm9sbERhdGEuZGlyZWN0aW9uID09PSBcIkxlZnRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuc2Nyb2xsVG8ocHJvcGVydHlWYWx1ZSwgc2Nyb2xsRGF0YS5hbHRlcm5hdGVWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKHNjcm9sbERhdGEuYWx0ZXJuYXRlVmFsdWUsIHByb3BlcnR5VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybXMgKHRyYW5zbGF0ZVgsIHJvdGF0ZVosIGV0Yy4pIGFyZSBhcHBsaWVkIHRvIGEgcGVyLWVsZW1lbnQgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LCB3aGljaCBpcyBtYW51YWxseSBmbHVzaGVkIHZpYSBmbHVzaFRyYW5zZm9ybUNhY2hlKCkuXHJcbiAgICAgICAgICAgICAgICAgICBUaHVzLCBmb3Igbm93LCB3ZSBtZXJlbHkgY2FjaGUgdHJhbnNmb3JtcyBiZWluZyBTRVQuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldICYmIENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcIm5hbWVcIiwgZWxlbWVudCkgPT09IFwidHJhbnNmb3JtXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBQZXJmb3JtIGEgbm9ybWFsaXphdGlvbiBpbmplY3Rpb24uICovXHJcbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIG5vcm1hbGl6YXRpb24gbG9naWMgaGFuZGxlcyB0aGUgdHJhbnNmb3JtQ2FjaGUgdXBkYXRpbmcuICovXHJcbiAgICAgICAgICAgICAgICAgICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyZWRbcHJvcGVydHldKFwiaW5qZWN0XCIsIGVsZW1lbnQsIHByb3BlcnR5VmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBcInRyYW5zZm9ybVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogSW5qZWN0IGhvb2tzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tOYW1lID0gcHJvcGVydHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBob29rUm9vdCA9IENTUy5Ib29rcy5nZXRSb290KHByb3BlcnR5KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGEgY2FjaGVkIHJvb3RQcm9wZXJ0eVZhbHVlIHdhcyBub3QgcHJvdmlkZWQsIHF1ZXJ5IHRoZSBET00gZm9yIHRoZSBob29rUm9vdCdzIGN1cnJlbnQgdmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlID0gcm9vdFByb3BlcnR5VmFsdWUgfHwgQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgaG9va1Jvb3QpOyAvKiBHRVQgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VmFsdWUgPSBDU1MuSG9va3MuaW5qZWN0VmFsdWUoaG9va05hbWUsIHByb3BlcnR5VmFsdWUsIHJvb3RQcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBob29rUm9vdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vcm1hbGl6ZSBuYW1lcyBhbmQgdmFsdWVzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlWYWx1ZSA9IENTUy5Ob3JtYWxpemF0aW9ucy5yZWdpc3RlcmVkW3Byb3BlcnR5XShcImluamVjdFwiLCBlbGVtZW50LCBwcm9wZXJ0eVZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHkgPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtwcm9wZXJ0eV0oXCJuYW1lXCIsIGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogQXNzaWduIHRoZSBhcHByb3ByaWF0ZSB2ZW5kb3IgcHJlZml4IGJlZm9yZSBwZXJmb3JtaW5nIGFuIG9mZmljaWFsIHN0eWxlIHVwZGF0ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBDU1MuTmFtZXMucHJlZml4Q2hlY2socHJvcGVydHkpWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBBIHRyeS9jYXRjaCBpcyB1c2VkIGZvciBJRTw9OCwgd2hpY2ggdGhyb3dzIGFuIGVycm9yIHdoZW4gXCJpbnZhbGlkXCIgQ1NTIHZhbHVlcyBhcmUgc2V0LCBlLmcuIGEgbmVnYXRpdmUgd2lkdGguXHJcbiAgICAgICAgICAgICAgICAgICAgICAgVHJ5L2NhdGNoIGlzIGF2b2lkZWQgZm9yIG90aGVyIGJyb3dzZXJzIHNpbmNlIGl0IGluY3VycyBhIHBlcmZvcm1hbmNlIG92ZXJoZWFkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChJRSA8PSA4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikgeyBpZiAoVmVsb2NpdHkuZGVidWcpIGNvbnNvbGUubG9nKFwiQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFtcIiArIHByb3BlcnR5VmFsdWUgKyBcIl0gZm9yIFtcIiArIHByb3BlcnR5TmFtZSArIFwiXVwiKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qIFNWRyBlbGVtZW50cyBoYXZlIHRoZWlyIGRpbWVuc2lvbmFsIHByb3BlcnRpZXMgKHdpZHRoLCBoZWlnaHQsIHgsIHksIGN4LCBldGMuKSBhcHBsaWVkIGRpcmVjdGx5IGFzIGF0dHJpYnV0ZXMgaW5zdGVhZCBvZiBhcyBzdHlsZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogSUU4IGRvZXMgbm90IHN1cHBvcnQgU1ZHIGVsZW1lbnRzLCBzbyBpdCdzIG9rYXkgdGhhdCB3ZSBza2lwIGl0IGZvciBTVkcgYW5pbWF0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoRGF0YShlbGVtZW50KSAmJiBEYXRhKGVsZW1lbnQpLmlzU1ZHICYmIENTUy5OYW1lcy5TVkdBdHRyaWJ1dGUocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEZvciBTVkcgYXR0cmlidXRlcywgdmVuZG9yLXByZWZpeGVkIHByb3BlcnR5IG5hbWVzIGFyZSBuZXZlciB1c2VkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBOb3QgYWxsIENTUyBwcm9wZXJ0aWVzIGNhbiBiZSBhbmltYXRlZCB2aWEgYXR0cmlidXRlcywgYnV0IHRoZSBicm93c2VyIHdvbid0IHRocm93IGFuIGVycm9yIGZvciB1bnN1cHBvcnRlZCBwcm9wZXJ0aWVzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShwcm9wZXJ0eSwgcHJvcGVydHlWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wZXJ0eU5hbWVdID0gcHJvcGVydHlWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZyA+PSAyKSBjb25zb2xlLmxvZyhcIlNldCBcIiArIHByb3BlcnR5ICsgXCIgKFwiICsgcHJvcGVydHlOYW1lICsgXCIpOiBcIiArIHByb3BlcnR5VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBSZXR1cm4gdGhlIG5vcm1hbGl6ZWQgcHJvcGVydHkgbmFtZSBhbmQgdmFsdWUgaW4gY2FzZSB0aGUgY2FsbGVyIHdhbnRzIHRvIGtub3cgaG93IHRoZXNlIHZhbHVlcyB3ZXJlIG1vZGlmaWVkIGJlZm9yZSBiZWluZyBhcHBsaWVkIHRvIHRoZSBET00uICovXHJcbiAgICAgICAgICAgIHJldHVybiBbIHByb3BlcnR5TmFtZSwgcHJvcGVydHlWYWx1ZSBdO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qIFRvIGluY3JlYXNlIHBlcmZvcm1hbmNlIGJ5IGJhdGNoaW5nIHRyYW5zZm9ybSB1cGRhdGVzIGludG8gYSBzaW5nbGUgU0VULCB0cmFuc2Zvcm1zIGFyZSBub3QgZGlyZWN0bHkgYXBwbGllZCB0byBhbiBlbGVtZW50IHVudGlsIGZsdXNoVHJhbnNmb3JtQ2FjaGUoKSBpcyBjYWxsZWQuICovXHJcbiAgICAgICAgLyogTm90ZTogVmVsb2NpdHkgYXBwbGllcyB0cmFuc2Zvcm0gcHJvcGVydGllcyBpbiB0aGUgc2FtZSBvcmRlciB0aGF0IHRoZXkgYXJlIGNocm9ub2dpY2FsbHkgaW50cm9kdWNlZCB0byB0aGUgZWxlbWVudCdzIENTUyBzdHlsZXMuICovXHJcbiAgICAgICAgZmx1c2hUcmFuc2Zvcm1DYWNoZTogZnVuY3Rpb24oZWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgdHJhbnNmb3JtU3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8qIENlcnRhaW4gYnJvd3NlcnMgcmVxdWlyZSB0aGF0IFNWRyB0cmFuc2Zvcm1zIGJlIGFwcGxpZWQgYXMgYW4gYXR0cmlidXRlLiBIb3dldmVyLCB0aGUgU1ZHIHRyYW5zZm9ybSBhdHRyaWJ1dGUgdGFrZXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIENTUydzIHRyYW5zZm9ybSBzdHJpbmdcclxuICAgICAgICAgICAgICAgKHVuaXRzIGFyZSBkcm9wcGVkIGFuZCwgZXhjZXB0IGZvciBza2V3WC9ZLCBzdWJwcm9wZXJ0aWVzIGFyZSBtZXJnZWQgaW50byB0aGVpciBtYXN0ZXIgcHJvcGVydHkgLS0gZS5nLiBzY2FsZVggYW5kIHNjYWxlWSBhcmUgbWVyZ2VkIGludG8gc2NhbGUoWCBZKS4gKi9cclxuICAgICAgICAgICAgaWYgKChJRSB8fCAoVmVsb2NpdHkuU3RhdGUuaXNBbmRyb2lkICYmICFWZWxvY2l0eS5TdGF0ZS5pc0Nocm9tZSkpICYmIERhdGEoZWxlbWVudCkuaXNTVkcpIHtcclxuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRyYW5zZm9ybSB2YWx1ZXMgYXJlIHN0b3JlZCBpbiB0aGVpciBwYXJlbnRoZXNlcy13cmFwcGVkIGZvcm0sIHdlIHVzZSBhIGhlbHBlciBmdW5jdGlvbiB0byBzdHJpcCBvdXQgdGhlaXIgbnVtZXJpYyB2YWx1ZXMuXHJcbiAgICAgICAgICAgICAgICAgICBGdXJ0aGVyLCBTVkcgdHJhbnNmb3JtIHByb3BlcnRpZXMgb25seSB0YWtlIHVuaXRsZXNzIChyZXByZXNlbnRpbmcgcGl4ZWxzKSB2YWx1ZXMsIHNvIGl0J3Mgb2theSB0aGF0IHBhcnNlRmxvYXQoKSBzdHJpcHMgdGhlIHVuaXQgc3VmZml4ZWQgdG8gdGhlIGZsb2F0IHZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZ2V0VHJhbnNmb3JtRmxvYXQgKHRyYW5zZm9ybVByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgdHJhbnNmb3JtUHJvcGVydHkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYW4gb2JqZWN0IHRvIG9yZ2FuaXplIGFsbCB0aGUgdHJhbnNmb3JtcyB0aGF0IHdlJ2xsIGFwcGx5IHRvIHRoZSBTVkcgZWxlbWVudC4gVG8ga2VlcCB0aGUgbG9naWMgc2ltcGxlLFxyXG4gICAgICAgICAgICAgICAgICAgd2UgcHJvY2VzcyAqYWxsKiB0cmFuc2Zvcm0gcHJvcGVydGllcyAtLSBldmVuIHRob3NlIHRoYXQgbWF5IG5vdCBiZSBleHBsaWNpdGx5IGFwcGxpZWQgKHNpbmNlIHRoZXkgZGVmYXVsdCB0byB0aGVpciB6ZXJvLXZhbHVlcyBhbnl3YXkpLiAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIFNWR1RyYW5zZm9ybXMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNsYXRlOiBbIGdldFRyYW5zZm9ybUZsb2F0KFwidHJhbnNsYXRlWFwiKSwgZ2V0VHJhbnNmb3JtRmxvYXQoXCJ0cmFuc2xhdGVZXCIpIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2tld1g6IFsgZ2V0VHJhbnNmb3JtRmxvYXQoXCJza2V3WFwiKSBdLCBza2V3WTogWyBnZXRUcmFuc2Zvcm1GbG9hdChcInNrZXdZXCIpIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHNjYWxlIHByb3BlcnR5IGlzIHNldCAobm9uLTEpLCB1c2UgdGhhdCB2YWx1ZSBmb3IgdGhlIHNjYWxlWCBhbmQgc2NhbGVZIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICh0aGlzIGJlaGF2aW9yIG1pbWljcyB0aGUgcmVzdWx0IG9mIGFuaW1hdGluZyBhbGwgdGhlc2UgcHJvcGVydGllcyBhdCBvbmNlIG9uIEhUTUwgZWxlbWVudHMpLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlOiBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpICE9PSAxID8gWyBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpLCBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlXCIpIF0gOiBbIGdldFRyYW5zZm9ybUZsb2F0KFwic2NhbGVYXCIpLCBnZXRUcmFuc2Zvcm1GbG9hdChcInNjYWxlWVwiKSBdLFxyXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNWRydzIHJvdGF0ZSB0cmFuc2Zvcm0gdGFrZXMgdGhyZWUgdmFsdWVzOiByb3RhdGlvbiBkZWdyZWVzIGZvbGxvd2VkIGJ5IHRoZSBYIGFuZCBZIHZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgIGRlZmluaW5nIHRoZSByb3RhdGlvbidzIG9yaWdpbiBwb2ludC4gV2UgaWdub3JlIHRoZSBvcmlnaW4gdmFsdWVzIChkZWZhdWx0IHRoZW0gdG8gMCkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRlOiBbIGdldFRyYW5zZm9ybUZsb2F0KFwicm90YXRlWlwiKSwgMCwgMCBdXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgdHJhbnNmb3JtIHByb3BlcnRpZXMgaW4gdGhlIHVzZXItZGVmaW5lZCBwcm9wZXJ0eSBtYXAgb3JkZXIuXHJcbiAgICAgICAgICAgICAgICAgICAoVGhpcyBtaW1pY3MgdGhlIGJlaGF2aW9yIG9mIG5vbi1TVkcgdHJhbnNmb3JtIGFuaW1hdGlvbi4pICovXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZSwgZnVuY3Rpb24odHJhbnNmb3JtTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIEV4Y2VwdCBmb3Igd2l0aCBza2V3WC9ZLCByZXZlcnQgdGhlIGF4aXMtc3BlY2lmaWMgdHJhbnNmb3JtIHN1YnByb3BlcnRpZXMgdG8gdGhlaXIgYXhpcy1mcmVlIG1hc3RlclxyXG4gICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgc28gdGhhdCB0aGV5IG1hdGNoIHVwIHdpdGggU1ZHJ3MgYWNjZXB0ZWQgdHJhbnNmb3JtIHByb3BlcnRpZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKC9edHJhbnNsYXRlL2kudGVzdCh0cmFuc2Zvcm1OYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1OYW1lID0gXCJ0cmFuc2xhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKC9ec2NhbGUvaS50ZXN0KHRyYW5zZm9ybU5hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybU5hbWUgPSBcInNjYWxlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgvXnJvdGF0ZS9pLnRlc3QodHJhbnNmb3JtTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwicm90YXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBDaGVjayB0aGF0IHdlIGhhdmVuJ3QgeWV0IGRlbGV0ZWQgdGhlIHByb3BlcnR5IGZyb20gdGhlIFNWR1RyYW5zZm9ybXMgY29udGFpbmVyLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChTVkdUcmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFwcGVuZCB0aGUgdHJhbnNmb3JtIHByb3BlcnR5IGluIHRoZSBTVkctc3VwcG9ydGVkIHRyYW5zZm9ybSBmb3JtYXQuIEFzIHBlciB0aGUgc3BlYywgc3Vycm91bmQgdGhlIHNwYWNlLWRlbGltaXRlZCB2YWx1ZXMgaW4gcGFyZW50aGVzZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVN0cmluZyArPSB0cmFuc2Zvcm1OYW1lICsgXCIoXCIgKyBTVkdUcmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdLmpvaW4oXCIgXCIpICsgXCIpXCIgKyBcIiBcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFmdGVyIHByb2Nlc3NpbmcgYW4gU1ZHIHRyYW5zZm9ybSBwcm9wZXJ0eSwgZGVsZXRlIGl0IGZyb20gdGhlIFNWR1RyYW5zZm9ybXMgY29udGFpbmVyIHNvIHdlIGRvbid0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlLWluc2VydCB0aGUgc2FtZSBtYXN0ZXIgcHJvcGVydHkgaWYgd2UgZW5jb3VudGVyIGFub3RoZXIgb25lIG9mIGl0cyBheGlzLXNwZWNpZmljIHByb3BlcnRpZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBTVkdUcmFuc2Zvcm1zW3RyYW5zZm9ybU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zZm9ybVZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHBlcnNwZWN0aXZlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSBwcm9wZXJ0aWVzIGFyZSBzdG9yZWQgYXMgbWVtYmVycyBvZiB0aGUgdHJhbnNmb3JtQ2FjaGUgb2JqZWN0LiBDb25jYXRlbmF0ZSBhbGwgdGhlIG1lbWJlcnMgaW50byBhIHN0cmluZy4gKi9cclxuICAgICAgICAgICAgICAgICQuZWFjaChEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlLCBmdW5jdGlvbih0cmFuc2Zvcm1OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtVmFsdWUgPSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBUcmFuc2Zvcm0ncyBwZXJzcGVjdGl2ZSBzdWJwcm9wZXJ0eSBtdXN0IGJlIHNldCBmaXJzdCBpbiBvcmRlciB0byB0YWtlIGVmZmVjdC4gU3RvcmUgaXQgdGVtcG9yYXJpbHkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybU5hbWUgPT09IFwidHJhbnNmb3JtUGVyc3BlY3RpdmVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJzcGVjdGl2ZSA9IHRyYW5zZm9ybVZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIElFOSBvbmx5IHN1cHBvcnRzIG9uZSByb3RhdGlvbiB0eXBlLCByb3RhdGVaLCB3aGljaCBpdCByZWZlcnMgdG8gYXMgXCJyb3RhdGVcIi4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoSUUgPT09IDkgJiYgdHJhbnNmb3JtTmFtZSA9PT0gXCJyb3RhdGVaXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtTmFtZSA9IFwicm90YXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1TdHJpbmcgKz0gdHJhbnNmb3JtTmFtZSArIHRyYW5zZm9ybVZhbHVlICsgXCIgXCI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBJZiBwcmVzZW50LCBzZXQgdGhlIHBlcnNwZWN0aXZlIHN1YnByb3BlcnR5IGZpcnN0LiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHBlcnNwZWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtU3RyaW5nID0gXCJwZXJzcGVjdGl2ZVwiICsgcGVyc3BlY3RpdmUgKyBcIiBcIiArIHRyYW5zZm9ybVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJ0cmFuc2Zvcm1cIiwgdHJhbnNmb3JtU3RyaW5nKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qIFJlZ2lzdGVyIGhvb2tzIGFuZCBub3JtYWxpemF0aW9ucy4gKi9cclxuICAgIENTUy5Ib29rcy5yZWdpc3RlcigpO1xyXG4gICAgQ1NTLk5vcm1hbGl6YXRpb25zLnJlZ2lzdGVyKCk7XHJcblxyXG4gICAgLyogQWxsb3cgaG9vayBzZXR0aW5nIGluIHRoZSBzYW1lIGZhc2hpb24gYXMgalF1ZXJ5J3MgJC5jc3MoKS4gKi9cclxuICAgIFZlbG9jaXR5Lmhvb2sgPSBmdW5jdGlvbiAoZWxlbWVudHMsIGFyZzIsIGFyZzMpIHtcclxuICAgICAgICB2YXIgdmFsdWUgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGVsZW1lbnRzID0gc2FuaXRpemVFbGVtZW50cyhlbGVtZW50cyk7XHJcblxyXG4gICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvKiBJbml0aWFsaXplIFZlbG9jaXR5J3MgcGVyLWVsZW1lbnQgZGF0YSBjYWNoZSBpZiB0aGlzIGVsZW1lbnQgaGFzbid0IHByZXZpb3VzbHkgYmVlbiBhbmltYXRlZC4gKi9cclxuICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgVmVsb2NpdHkuaW5pdChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogR2V0IHByb3BlcnR5IHZhbHVlLiBJZiBhbiBlbGVtZW50IHNldCB3YXMgcGFzc2VkIGluLCBvbmx5IHJldHVybiB0aGUgdmFsdWUgZm9yIHRoZSBmaXJzdCBlbGVtZW50LiAqL1xyXG4gICAgICAgICAgICBpZiAoYXJnMyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gVmVsb2NpdHkuQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgYXJnMik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIFNldCBwcm9wZXJ0eSB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8qIHNQViByZXR1cm5zIGFuIGFycmF5IG9mIHRoZSBub3JtYWxpemVkIHByb3BlcnR5TmFtZS9wcm9wZXJ0eVZhbHVlIHBhaXIgdXNlZCB0byB1cGRhdGUgdGhlIERPTS4gKi9cclxuICAgICAgICAgICAgICAgIHZhciBhZGp1c3RlZFNldCA9IFZlbG9jaXR5LkNTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIGFyZzIsIGFyZzMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIFRyYW5zZm9ybSBwcm9wZXJ0aWVzIGRvbid0IGF1dG9tYXRpY2FsbHkgc2V0LiBUaGV5IGhhdmUgdG8gYmUgZmx1c2hlZCB0byB0aGUgRE9NLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKGFkanVzdGVkU2V0WzBdID09PSBcInRyYW5zZm9ybVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBhZGp1c3RlZFNldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKlxyXG4gICAgICAgIEFuaW1hdGlvblxyXG4gICAgKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgdmFyIGFuaW1hdGUgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICBDYWxsIENoYWluXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAvKiBMb2dpYyBmb3IgZGV0ZXJtaW5pbmcgd2hhdCB0byByZXR1cm4gdG8gdGhlIGNhbGwgc3RhY2sgd2hlbiBleGl0aW5nIG91dCBvZiBWZWxvY2l0eS4gKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRDaGFpbiAoKSB7XHJcbiAgICAgICAgICAgIC8qIElmIHdlIGFyZSB1c2luZyB0aGUgdXRpbGl0eSBmdW5jdGlvbiwgYXR0ZW1wdCB0byByZXR1cm4gdGhpcyBjYWxsJ3MgcHJvbWlzZS4gSWYgbm8gcHJvbWlzZSBsaWJyYXJ5IHdhcyBkZXRlY3RlZCxcclxuICAgICAgICAgICAgICAgZGVmYXVsdCB0byBudWxsIGluc3RlYWQgb2YgcmV0dXJuaW5nIHRoZSB0YXJnZXRlZCBlbGVtZW50cyBzbyB0aGF0IHV0aWxpdHkgZnVuY3Rpb24ncyByZXR1cm4gdmFsdWUgaXMgc3RhbmRhcmRpemVkLiAqL1xyXG4gICAgICAgICAgICBpZiAoaXNVdGlsaXR5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZURhdGEucHJvbWlzZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAvKiBPdGhlcndpc2UsIGlmIHdlJ3JlIHVzaW5nICQuZm4sIHJldHVybiB0aGUgalF1ZXJ5LS9aZXB0by13cmFwcGVkIGVsZW1lbnQgc2V0LiAqL1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsZW1lbnRzV3JhcHBlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICBBcmd1bWVudHMgQXNzaWdubWVudFxyXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIC8qIFRvIGFsbG93IGZvciBleHByZXNzaXZlIENvZmZlZVNjcmlwdCBjb2RlLCBWZWxvY2l0eSBzdXBwb3J0cyBhbiBhbHRlcm5hdGl2ZSBzeW50YXggaW4gd2hpY2ggXCJlbGVtZW50c1wiIChvciBcImVcIiksIFwicHJvcGVydGllc1wiIChvciBcInBcIiksIGFuZCBcIm9wdGlvbnNcIiAob3IgXCJvXCIpXHJcbiAgICAgICAgICAgb2JqZWN0cyBhcmUgZGVmaW5lZCBvbiBhIGNvbnRhaW5lciBvYmplY3QgdGhhdCdzIHBhc3NlZCBpbiBhcyBWZWxvY2l0eSdzIHNvbGUgYXJndW1lbnQuICovXHJcbiAgICAgICAgLyogTm90ZTogU29tZSBicm93c2VycyBhdXRvbWF0aWNhbGx5IHBvcHVsYXRlIGFyZ3VtZW50cyB3aXRoIGEgXCJwcm9wZXJ0aWVzXCIgb2JqZWN0LiBXZSBkZXRlY3QgaXQgYnkgY2hlY2tpbmcgZm9yIGl0cyBkZWZhdWx0IFwibmFtZXNcIiBwcm9wZXJ0eS4gKi9cclxuICAgICAgICB2YXIgc3ludGFjdGljU3VnYXIgPSAoYXJndW1lbnRzWzBdICYmIChhcmd1bWVudHNbMF0ucCB8fCAoKCQuaXNQbGFpbk9iamVjdChhcmd1bWVudHNbMF0ucHJvcGVydGllcykgJiYgIWFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzLm5hbWVzKSB8fCBUeXBlLmlzU3RyaW5nKGFyZ3VtZW50c1swXS5wcm9wZXJ0aWVzKSkpKSxcclxuICAgICAgICAgICAgLyogV2hldGhlciBWZWxvY2l0eSB3YXMgY2FsbGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbiAoYXMgb3Bwb3NlZCB0byBvbiBhIGpRdWVyeS9aZXB0byBvYmplY3QpLiAqL1xyXG4gICAgICAgICAgICBpc1V0aWxpdHksXHJcbiAgICAgICAgICAgIC8qIFdoZW4gVmVsb2NpdHkgaXMgY2FsbGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbiAoJC5WZWxvY2l0eSgpL1ZlbG9jaXR5KCkpLCBlbGVtZW50cyBhcmUgZXhwbGljaXRseVxyXG4gICAgICAgICAgICAgICBwYXNzZWQgaW4gYXMgdGhlIGZpcnN0IHBhcmFtZXRlci4gVGh1cywgYXJndW1lbnQgcG9zaXRpb25pbmcgdmFyaWVzLiBXZSBub3JtYWxpemUgdGhlbSBoZXJlLiAqL1xyXG4gICAgICAgICAgICBlbGVtZW50c1dyYXBwZWQsXHJcbiAgICAgICAgICAgIGFyZ3VtZW50SW5kZXg7XHJcblxyXG4gICAgICAgIHZhciBlbGVtZW50cyxcclxuICAgICAgICAgICAgcHJvcGVydGllc01hcCxcclxuICAgICAgICAgICAgb3B0aW9ucztcclxuXHJcbiAgICAgICAgLyogRGV0ZWN0IGpRdWVyeS9aZXB0byBlbGVtZW50cyBiZWluZyBhbmltYXRlZCB2aWEgdGhlICQuZm4gbWV0aG9kLiAqL1xyXG4gICAgICAgIGlmIChUeXBlLmlzV3JhcHBlZCh0aGlzKSkge1xyXG4gICAgICAgICAgICBpc1V0aWxpdHkgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGFyZ3VtZW50SW5kZXggPSAwO1xyXG4gICAgICAgICAgICBlbGVtZW50cyA9IHRoaXM7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzV3JhcHBlZCA9IHRoaXM7XHJcbiAgICAgICAgLyogT3RoZXJ3aXNlLCByYXcgZWxlbWVudHMgYXJlIGJlaW5nIGFuaW1hdGVkIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbi4gKi9cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpc1V0aWxpdHkgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgYXJndW1lbnRJbmRleCA9IDE7XHJcbiAgICAgICAgICAgIGVsZW1lbnRzID0gc3ludGFjdGljU3VnYXIgPyAoYXJndW1lbnRzWzBdLmVsZW1lbnRzIHx8IGFyZ3VtZW50c1swXS5lKSA6IGFyZ3VtZW50c1swXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsZW1lbnRzID0gc2FuaXRpemVFbGVtZW50cyhlbGVtZW50cyk7XHJcblxyXG4gICAgICAgIGlmICghZWxlbWVudHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHN5bnRhY3RpY1N1Z2FyKSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSBhcmd1bWVudHNbMF0ucHJvcGVydGllcyB8fCBhcmd1bWVudHNbMF0ucDtcclxuICAgICAgICAgICAgb3B0aW9ucyA9IGFyZ3VtZW50c1swXS5vcHRpb25zIHx8IGFyZ3VtZW50c1swXS5vO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSBhcmd1bWVudHNbYXJndW1lbnRJbmRleF07XHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhcmd1bWVudHNbYXJndW1lbnRJbmRleCArIDFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogVGhlIGxlbmd0aCBvZiB0aGUgZWxlbWVudCBzZXQgKGluIHRoZSBmb3JtIG9mIGEgbm9kZUxpc3Qgb3IgYW4gYXJyYXkgb2YgZWxlbWVudHMpIGlzIGRlZmF1bHRlZCB0byAxIGluIGNhc2UgYVxyXG4gICAgICAgICAgIHNpbmdsZSByYXcgRE9NIGVsZW1lbnQgaXMgcGFzc2VkIGluICh3aGljaCBkb2Vzbid0IGNvbnRhaW4gYSBsZW5ndGggcHJvcGVydHkpLiAqL1xyXG4gICAgICAgIHZhciBlbGVtZW50c0xlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aCxcclxuICAgICAgICAgICAgZWxlbWVudHNJbmRleCA9IDA7XHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgQXJndW1lbnQgT3ZlcmxvYWRpbmdcclxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIC8qIFN1cHBvcnQgaXMgaW5jbHVkZWQgZm9yIGpRdWVyeSdzIGFyZ3VtZW50IG92ZXJsb2FkaW5nOiAkLmFuaW1hdGUocHJvcGVydHlNYXAgWywgZHVyYXRpb25dIFssIGVhc2luZ10gWywgY29tcGxldGVdKS5cclxuICAgICAgICAgICBPdmVybG9hZGluZyBpcyBkZXRlY3RlZCBieSBjaGVja2luZyBmb3IgdGhlIGFic2VuY2Ugb2YgYW4gb2JqZWN0IGJlaW5nIHBhc3NlZCBpbnRvIG9wdGlvbnMuICovXHJcbiAgICAgICAgLyogTm90ZTogVGhlIHN0b3AgYW5kIGZpbmlzaCBhY3Rpb25zIGRvIG5vdCBhY2NlcHQgYW5pbWF0aW9uIG9wdGlvbnMsIGFuZCBhcmUgdGhlcmVmb3JlIGV4Y2x1ZGVkIGZyb20gdGhpcyBjaGVjay4gKi9cclxuICAgICAgICBpZiAoIS9eKHN0b3B8ZmluaXNofGZpbmlzaEFsbCkkL2kudGVzdChwcm9wZXJ0aWVzTWFwKSAmJiAhJC5pc1BsYWluT2JqZWN0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgIC8qIFRoZSB1dGlsaXR5IGZ1bmN0aW9uIHNoaWZ0cyBhbGwgYXJndW1lbnRzIG9uZSBwb3NpdGlvbiB0byB0aGUgcmlnaHQsIHNvIHdlIGFkanVzdCBmb3IgdGhhdCBvZmZzZXQuICovXHJcbiAgICAgICAgICAgIHZhciBzdGFydGluZ0FyZ3VtZW50UG9zaXRpb24gPSBhcmd1bWVudEluZGV4ICsgMTtcclxuXHJcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBhbGwgb3B0aW9ucyBhcmd1bWVudHMgKi9cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0aW5nQXJndW1lbnRQb3NpdGlvbjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgLyogVHJlYXQgYSBudW1iZXIgYXMgYSBkdXJhdGlvbi4gUGFyc2UgaXQgb3V0LiAqL1xyXG4gICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIGZvbGxvd2luZyBSZWdFeCB3aWxsIHJldHVybiB0cnVlIGlmIHBhc3NlZCBhbiBhcnJheSB3aXRoIGEgbnVtYmVyIGFzIGl0cyBmaXJzdCBpdGVtLlxyXG4gICAgICAgICAgICAgICAgICAgVGh1cywgYXJyYXlzIGFyZSBza2lwcGVkIGZyb20gdGhpcyBjaGVjay4gKi9cclxuICAgICAgICAgICAgICAgIGlmICghVHlwZS5pc0FycmF5KGFyZ3VtZW50c1tpXSkgJiYgKC9eKGZhc3R8bm9ybWFsfHNsb3cpJC9pLnRlc3QoYXJndW1lbnRzW2ldKSB8fCAvXlxcZC8udGVzdChhcmd1bWVudHNbaV0pKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZHVyYXRpb24gPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgICAgICAvKiBUcmVhdCBzdHJpbmdzIGFuZCBhcnJheXMgYXMgZWFzaW5ncy4gKi9cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoVHlwZS5pc1N0cmluZyhhcmd1bWVudHNbaV0pIHx8IFR5cGUuaXNBcnJheShhcmd1bWVudHNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5lYXNpbmcgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgICAgICAvKiBUcmVhdCBhIGZ1bmN0aW9uIGFzIGEgY29tcGxldGUgY2FsbGJhY2suICovXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFR5cGUuaXNGdW5jdGlvbihhcmd1bWVudHNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wbGV0ZSA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICBQcm9taXNlc1xyXG4gICAgICAgICoqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgdmFyIHByb21pc2VEYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIHJlc29sdmVyOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgcmVqZWN0ZXI6IG51bGxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyogSWYgdGhpcyBjYWxsIHdhcyBtYWRlIHZpYSB0aGUgdXRpbGl0eSBmdW5jdGlvbiAod2hpY2ggaXMgdGhlIGRlZmF1bHQgbWV0aG9kIG9mIGludm9jYXRpb24gd2hlbiBqUXVlcnkvWmVwdG8gYXJlIG5vdCBiZWluZyB1c2VkKSwgYW5kIGlmXHJcbiAgICAgICAgICAgcHJvbWlzZSBzdXBwb3J0IHdhcyBkZXRlY3RlZCwgY3JlYXRlIGEgcHJvbWlzZSBvYmplY3QgZm9yIHRoaXMgY2FsbCBhbmQgc3RvcmUgcmVmZXJlbmNlcyB0byBpdHMgcmVzb2x2ZXIgYW5kIHJlamVjdGVyIG1ldGhvZHMuIFRoZSByZXNvbHZlXHJcbiAgICAgICAgICAgbWV0aG9kIGlzIHVzZWQgd2hlbiBhIGNhbGwgY29tcGxldGVzIG5hdHVyYWxseSBvciBpcyBwcmVtYXR1cmVseSBzdG9wcGVkIGJ5IHRoZSB1c2VyLiBJbiBib3RoIGNhc2VzLCBjb21wbGV0ZUNhbGwoKSBoYW5kbGVzIHRoZSBhc3NvY2lhdGVkXHJcbiAgICAgICAgICAgY2FsbCBjbGVhbnVwIGFuZCBwcm9taXNlIHJlc29sdmluZyBsb2dpYy4gVGhlIHJlamVjdCBtZXRob2QgaXMgdXNlZCB3aGVuIGFuIGludmFsaWQgc2V0IG9mIGFyZ3VtZW50cyBpcyBwYXNzZWQgaW50byBhIFZlbG9jaXR5IGNhbGwuICovXHJcbiAgICAgICAgLyogTm90ZTogVmVsb2NpdHkgZW1wbG95cyBhIGNhbGwtYmFzZWQgcXVldWVpbmcgYXJjaGl0ZWN0dXJlLCB3aGljaCBtZWFucyB0aGF0IHN0b3BwaW5nIGFuIGFuaW1hdGluZyBlbGVtZW50IGFjdHVhbGx5IHN0b3BzIHRoZSBmdWxsIGNhbGwgdGhhdFxyXG4gICAgICAgICAgIHRyaWdnZXJlZCBpdCAtLSBub3QgdGhhdCBvbmUgZWxlbWVudCBleGNsdXNpdmVseS4gU2ltaWxhcmx5LCB0aGVyZSBpcyBvbmUgcHJvbWlzZSBwZXIgY2FsbCwgYW5kIGFsbCBlbGVtZW50cyB0YXJnZXRlZCBieSBhIFZlbG9jaXR5IGNhbGwgYXJlXHJcbiAgICAgICAgICAgZ3JvdXBlZCB0b2dldGhlciBmb3IgdGhlIHB1cnBvc2VzIG9mIHJlc29sdmluZyBhbmQgcmVqZWN0aW5nIGEgcHJvbWlzZS4gKi9cclxuICAgICAgICBpZiAoaXNVdGlsaXR5ICYmIFZlbG9jaXR5LlByb21pc2UpIHtcclxuICAgICAgICAgICAgcHJvbWlzZURhdGEucHJvbWlzZSA9IG5ldyBWZWxvY2l0eS5Qcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlamVjdGVyID0gcmVqZWN0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICBBY3Rpb24gRGV0ZWN0aW9uXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAvKiBWZWxvY2l0eSdzIGJlaGF2aW9yIGlzIGNhdGVnb3JpemVkIGludG8gXCJhY3Rpb25zXCI6IEVsZW1lbnRzIGNhbiBlaXRoZXIgYmUgc3BlY2lhbGx5IHNjcm9sbGVkIGludG8gdmlldyxcclxuICAgICAgICAgICBvciB0aGV5IGNhbiBiZSBzdGFydGVkLCBzdG9wcGVkLCBvciByZXZlcnNlZC4gSWYgYSBsaXRlcmFsIG9yIHJlZmVyZW5jZWQgcHJvcGVydGllcyBtYXAgaXMgcGFzc2VkIGluIGFzIFZlbG9jaXR5J3NcclxuICAgICAgICAgICBmaXJzdCBhcmd1bWVudCwgdGhlIGFzc29jaWF0ZWQgYWN0aW9uIGlzIFwic3RhcnRcIi4gQWx0ZXJuYXRpdmVseSwgXCJzY3JvbGxcIiwgXCJyZXZlcnNlXCIsIG9yIFwic3RvcFwiIGNhbiBiZSBwYXNzZWQgaW4gaW5zdGVhZCBvZiBhIHByb3BlcnRpZXMgbWFwLiAqL1xyXG4gICAgICAgIHZhciBhY3Rpb247XHJcblxyXG4gICAgICAgIHN3aXRjaCAocHJvcGVydGllc01hcCkge1xyXG4gICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XHJcbiAgICAgICAgICAgICAgICBhY3Rpb24gPSBcInNjcm9sbFwiO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFwicmV2ZXJzZVwiOlxyXG4gICAgICAgICAgICAgICAgYWN0aW9uID0gXCJyZXZlcnNlXCI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgXCJmaW5pc2hcIjpcclxuICAgICAgICAgICAgY2FzZSBcImZpbmlzaEFsbFwiOlxyXG4gICAgICAgICAgICBjYXNlIFwic3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICBBY3Rpb246IFN0b3BcclxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ2xlYXIgdGhlIGN1cnJlbnRseS1hY3RpdmUgZGVsYXkgb24gZWFjaCB0YXJnZXRlZCBlbGVtZW50LiAqL1xyXG4gICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgJiYgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0b3AgdGhlIHRpbWVyIGZyb20gdHJpZ2dlcmluZyBpdHMgY2FjaGVkIG5leHQoKSBmdW5jdGlvbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KERhdGEoZWxlbWVudCkuZGVsYXlUaW1lci5zZXRUaW1lb3V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE1hbnVhbGx5IGNhbGwgdGhlIG5leHQoKSBmdW5jdGlvbiBzbyB0aGF0IHRoZSBzdWJzZXF1ZW50IHF1ZXVlIGl0ZW1zIGNhbiBwcm9ncmVzcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkuZGVsYXlUaW1lci5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgRGF0YShlbGVtZW50KS5kZWxheVRpbWVyO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgd2Ugd2FudCB0byBmaW5pc2ggZXZlcnl0aGluZyBpbiB0aGUgcXVldWUsIHdlIGhhdmUgdG8gaXRlcmF0ZSB0aHJvdWdoIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgYW5kIGNhbGwgZWFjaCBmdW5jdGlvbi4gVGhpcyB3aWxsIG1ha2UgdGhlbSBhY3RpdmUgY2FsbHMgYmVsb3csIHdoaWNoIHdpbGxcclxuICAgICAgICAgICAgICAgICAgICAgICBjYXVzZSB0aGVtIHRvIGJlIGFwcGxpZWQgdmlhIHRoZSBkdXJhdGlvbiBzZXR0aW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzTWFwID09PSBcImZpbmlzaEFsbFwiICYmIChvcHRpb25zID09PSB0cnVlIHx8IFR5cGUuaXNTdHJpbmcob3B0aW9ucykpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgaXRlbXMgaW4gdGhlIGVsZW1lbnQncyBxdWV1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKCQucXVldWUoZWxlbWVudCwgVHlwZS5pc1N0cmluZyhvcHRpb25zKSA/IG9wdGlvbnMgOiBcIlwiKSwgZnVuY3Rpb24oXywgaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHF1ZXVlIGFycmF5IGNhbiBjb250YWluIGFuIFwiaW5wcm9ncmVzc1wiIHN0cmluZywgd2hpY2ggd2Ugc2tpcC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oaXRlbSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXJpbmcgdGhlICQucXVldWUoKSBhcnJheSBpcyBhY2hpZXZlZCBieSByZXNldHRpbmcgaXQgdG8gW10uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQucXVldWUoZWxlbWVudCwgVHlwZS5pc1N0cmluZyhvcHRpb25zKSA/IG9wdGlvbnMgOiBcIlwiLCBbXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxzVG9TdG9wID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgLyogV2hlbiB0aGUgc3RvcCBhY3Rpb24gaXMgdHJpZ2dlcmVkLCB0aGUgZWxlbWVudHMnIGN1cnJlbnRseSBhY3RpdmUgY2FsbCBpcyBpbW1lZGlhdGVseSBzdG9wcGVkLiBUaGUgYWN0aXZlIGNhbGwgbWlnaHQgaGF2ZVxyXG4gICAgICAgICAgICAgICAgICAgYmVlbiBhcHBsaWVkIHRvIG11bHRpcGxlIGVsZW1lbnRzLCBpbiB3aGljaCBjYXNlIGFsbCBvZiB0aGUgY2FsbCdzIGVsZW1lbnRzIHdpbGwgYmUgc3RvcHBlZC4gV2hlbiBhbiBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICBpcyBzdG9wcGVkLCB0aGUgbmV4dCBpdGVtIGluIGl0cyBhbmltYXRpb24gcXVldWUgaXMgaW1tZWRpYXRlbHkgdHJpZ2dlcmVkLiAqL1xyXG4gICAgICAgICAgICAgICAgLyogQW4gYWRkaXRpb25hbCBhcmd1bWVudCBtYXkgYmUgcGFzc2VkIGluIHRvIGNsZWFyIGFuIGVsZW1lbnQncyByZW1haW5pbmcgcXVldWVkIGNhbGxzLiBFaXRoZXIgdHJ1ZSAod2hpY2ggZGVmYXVsdHMgdG8gdGhlIFwiZnhcIiBxdWV1ZSlcclxuICAgICAgICAgICAgICAgICAgIG9yIGEgY3VzdG9tIHF1ZXVlIHN0cmluZyBjYW4gYmUgcGFzc2VkIGluLiAqL1xyXG4gICAgICAgICAgICAgICAgLyogTm90ZTogVGhlIHN0b3AgY29tbWFuZCBydW5zIHByaW9yIHRvIFZlbG9jaXR5J3MgUXVldWVpbmcgcGhhc2Ugc2luY2UgaXRzIGJlaGF2aW9yIGlzIGludGVuZGVkIHRvIHRha2UgZWZmZWN0ICppbW1lZGlhdGVseSosXHJcbiAgICAgICAgICAgICAgICAgICByZWdhcmRsZXNzIG9mIHRoZSBlbGVtZW50J3MgY3VycmVudCBxdWV1ZSBzdGF0ZS4gKi9cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggZXZlcnkgYWN0aXZlIGNhbGwuICovXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goVmVsb2NpdHkuU3RhdGUuY2FsbHMsIGZ1bmN0aW9uKGksIGFjdGl2ZUNhbGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBJbmFjdGl2ZSBjYWxscyBhcmUgc2V0IHRvIGZhbHNlIGJ5IHRoZSBsb2dpYyBpbnNpZGUgY29tcGxldGVDYWxsKCkuIFNraXAgdGhlbS4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlQ2FsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGFjdGl2ZSBjYWxsJ3MgdGFyZ2V0ZWQgZWxlbWVudHMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZWFjaChhY3RpdmVDYWxsWzFdLCBmdW5jdGlvbihrLCBhY3RpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0cnVlIHdhcyBwYXNzZWQgaW4gYXMgYSBzZWNvbmRhcnkgYXJndW1lbnQsIGNsZWFyIGFic29sdXRlbHkgYWxsIGNhbGxzIG9uIHRoaXMgZWxlbWVudC4gT3RoZXJ3aXNlLCBvbmx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGVhciBjYWxscyBhc3NvY2lhdGVkIHdpdGggdGhlIHJlbGV2YW50IHF1ZXVlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2FsbCBzdG9wcGluZyBsb2dpYyB3b3JrcyBhcyBmb2xsb3dzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLSBvcHRpb25zID09PSB0cnVlIC0tPiBzdG9wIGN1cnJlbnQgZGVmYXVsdCBxdWV1ZSBjYWxscyAoYW5kIHF1ZXVlOmZhbHNlIGNhbGxzKSwgaW5jbHVkaW5nIHJlbWFpbmluZyBxdWV1ZWQgb25lcy5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gb3B0aW9ucyA9PT0gdW5kZWZpbmVkIC0tPiBzdG9wIGN1cnJlbnQgcXVldWU6XCJcIiBjYWxsIGFuZCBhbGwgcXVldWU6ZmFsc2UgY2FsbHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IGZhbHNlIC0tPiBzdG9wIG9ubHkgcXVldWU6ZmFsc2UgY2FsbHMuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIG9wdGlvbnMgPT09IFwiY3VzdG9tXCIgLS0+IHN0b3AgY3VycmVudCBxdWV1ZTpcImN1c3RvbVwiIGNhbGwsIGluY2x1ZGluZyByZW1haW5pbmcgcXVldWVkIG9uZXMgKHRoZXJlIGlzIG5vIGZ1bmN0aW9uYWxpdHkgdG8gb25seSBjbGVhciB0aGUgY3VycmVudGx5LXJ1bm5pbmcgcXVldWU6XCJjdXN0b21cIiBjYWxsKS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBxdWV1ZU5hbWUgPSAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSA/IFwiXCIgOiBvcHRpb25zO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChxdWV1ZU5hbWUgIT09IHRydWUgJiYgKGFjdGl2ZUNhbGxbMl0ucXVldWUgIT09IHF1ZXVlTmFtZSkgJiYgIShvcHRpb25zID09PSB1bmRlZmluZWQgJiYgYWN0aXZlQ2FsbFsyXS5xdWV1ZSA9PT0gZmFsc2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSXRlcmF0ZSB0aHJvdWdoIHRoZSBjYWxscyB0YXJnZXRlZCBieSB0aGUgc3RvcCBjb21tYW5kLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihsLCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2hlY2sgdGhhdCB0aGlzIGNhbGwgd2FzIGFwcGxpZWQgdG8gdGhlIHRhcmdldCBlbGVtZW50LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09PSBhY3RpdmVFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE9wdGlvbmFsbHkgY2xlYXIgdGhlIHJlbWFpbmluZyBxdWV1ZWQgY2FsbHMuIElmIHdlJ3JlIGRvaW5nIFwiZmluaXNoQWxsXCIgdGhpcyB3b24ndCBmaW5kIGFueXRoaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdWUgdG8gdGhlIHF1ZXVlLWNsZWFyaW5nIGFib3ZlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyA9PT0gdHJ1ZSB8fCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJdGVyYXRlIHRocm91Z2ggdGhlIGl0ZW1zIGluIHRoZSBlbGVtZW50J3MgcXVldWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goJC5xdWV1ZShlbGVtZW50LCBUeXBlLmlzU3RyaW5nKG9wdGlvbnMpID8gb3B0aW9ucyA6IFwiXCIpLCBmdW5jdGlvbihfLCBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHF1ZXVlIGFycmF5IGNhbiBjb250YWluIGFuIFwiaW5wcm9ncmVzc1wiIHN0cmluZywgd2hpY2ggd2Ugc2tpcC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc0Z1bmN0aW9uKGl0ZW0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFBhc3MgdGhlIGl0ZW0ncyBjYWxsYmFjayBhIGZsYWcgaW5kaWNhdGluZyB0aGF0IHdlIHdhbnQgdG8gYWJvcnQgZnJvbSB0aGUgcXVldWUgY2FsbC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKFNwZWNpZmljYWxseSwgdGhlIHF1ZXVlIHdpbGwgcmVzb2x2ZSB0aGUgY2FsbCdzIGFzc29jaWF0ZWQgcHJvbWlzZSB0aGVuIGFib3J0LikgICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0obnVsbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ2xlYXJpbmcgdGhlICQucXVldWUoKSBhcnJheSBpcyBhY2hpZXZlZCBieSByZXNldHRpbmcgaXQgdG8gW10uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnF1ZXVlKGVsZW1lbnQsIFR5cGUuaXNTdHJpbmcob3B0aW9ucykgPyBvcHRpb25zIDogXCJcIiwgW10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc01hcCA9PT0gXCJzdG9wXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIFwicmV2ZXJzZVwiIHVzZXMgY2FjaGVkIHN0YXJ0IHZhbHVlcyAodGhlIHByZXZpb3VzIGNhbGwncyBlbmRWYWx1ZXMpLCB0aGVzZSB2YWx1ZXMgbXVzdCBiZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlZCB0byByZWZsZWN0IHRoZSBmaW5hbCB2YWx1ZSB0aGF0IHRoZSBlbGVtZW50cyB3ZXJlIGFjdHVhbGx5IHR3ZWVuZWQgdG8uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJZiBvbmx5IHF1ZXVlOmZhbHNlIGFuaW1hdGlvbnMgYXJlIGN1cnJlbnRseSBydW5uaW5nIG9uIGFuIGVsZW1lbnQsIGl0IHdvbid0IGhhdmUgYSB0d2VlbnNDb250YWluZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdC4gQWxzbywgcXVldWU6ZmFsc2UgYW5pbWF0aW9ucyBjYW4ndCBiZSByZXZlcnNlZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpICYmIERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyICYmIHF1ZXVlTmFtZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXIsIGZ1bmN0aW9uKG0sIGFjdGl2ZVR3ZWVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZVR3ZWVuLmVuZFZhbHVlID0gYWN0aXZlVHdlZW4uY3VycmVudFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxzVG9TdG9wLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocHJvcGVydGllc01hcCA9PT0gXCJmaW5pc2hcIiB8fCBwcm9wZXJ0aWVzTWFwID09PSBcImZpbmlzaEFsbFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUbyBnZXQgYWN0aXZlIHR3ZWVucyB0byBmaW5pc2ggaW1tZWRpYXRlbHksIHdlIGZvcmNlZnVsbHkgc2hvcnRlbiB0aGVpciBkdXJhdGlvbnMgdG8gMW1zIHNvIHRoYXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZXkgZmluaXNoIHVwb24gdGhlIG5leHQgckFmIHRpY2sgdGhlbiBwcm9jZWVkIHdpdGggbm9ybWFsIGNhbGwgY29tcGxldGlvbiBsb2dpYy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNhbGxbMl0uZHVyYXRpb24gPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIFByZW1hdHVyZWx5IGNhbGwgY29tcGxldGVDYWxsKCkgb24gZWFjaCBtYXRjaGVkIGFjdGl2ZSBjYWxsLiBQYXNzIGFuIGFkZGl0aW9uYWwgZmxhZyBmb3IgXCJzdG9wXCIgdG8gaW5kaWNhdGVcclxuICAgICAgICAgICAgICAgICAgIHRoYXQgdGhlIGNvbXBsZXRlIGNhbGxiYWNrIGFuZCBkaXNwbGF5Om5vbmUgc2V0dGluZyBzaG91bGQgYmUgc2tpcHBlZCBzaW5jZSB3ZSdyZSBjb21wbGV0aW5nIHByZW1hdHVyZWx5LiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNNYXAgPT09IFwic3RvcFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGNhbGxzVG9TdG9wLCBmdW5jdGlvbihpLCBqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbChqLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByb21pc2VEYXRhLnByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSW1tZWRpYXRlbHkgcmVzb2x2ZSB0aGUgcHJvbWlzZSBhc3NvY2lhdGVkIHdpdGggdGhpcyBzdG9wIGNhbGwgc2luY2Ugc3RvcCBydW5zIHN5bmNocm9ub3VzbHkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogU2luY2Ugd2UncmUgc3RvcHBpbmcsIGFuZCBub3QgcHJvY2VlZGluZyB3aXRoIHF1ZXVlaW5nLCBleGl0IG91dCBvZiBWZWxvY2l0eS4gKi9cclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIC8qIFRyZWF0IGEgbm9uLWVtcHR5IHBsYWluIG9iamVjdCBhcyBhIGxpdGVyYWwgcHJvcGVydGllcyBtYXAuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoJC5pc1BsYWluT2JqZWN0KHByb3BlcnRpZXNNYXApICYmICFUeXBlLmlzRW1wdHlPYmplY3QocHJvcGVydGllc01hcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb24gPSBcInN0YXJ0XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICBSZWRpcmVjdHNcclxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgLyogQ2hlY2sgaWYgYSBzdHJpbmcgbWF0Y2hlcyBhIHJlZ2lzdGVyZWQgcmVkaXJlY3QgKHNlZSBSZWRpcmVjdHMgYWJvdmUpLiAqL1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzU3RyaW5nKHByb3BlcnRpZXNNYXApICYmIFZlbG9jaXR5LlJlZGlyZWN0c1twcm9wZXJ0aWVzTWFwXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvcHRzID0gJC5leHRlbmQoe30sIG9wdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbk9yaWdpbmFsID0gb3B0cy5kdXJhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsYXlPcmlnaW5hbCA9IG9wdHMuZGVsYXkgfHwgMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGJhY2t3YXJkcyBvcHRpb24gd2FzIHBhc3NlZCBpbiwgcmV2ZXJzZSB0aGUgZWxlbWVudCBzZXQgc28gdGhhdCBlbGVtZW50cyBhbmltYXRlIGZyb20gdGhlIGxhc3QgdG8gdGhlIGZpcnN0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmJhY2t3YXJkcyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50cyA9ICQuZXh0ZW5kKHRydWUsIFtdLCBlbGVtZW50cykucmV2ZXJzZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogSW5kaXZpZHVhbGx5IHRyaWdnZXIgdGhlIHJlZGlyZWN0IGZvciBlYWNoIGVsZW1lbnQgaW4gdGhlIHNldCB0byBwcmV2ZW50IHVzZXJzIGZyb20gaGF2aW5nIHRvIGhhbmRsZSBpdGVyYXRpb24gbG9naWMgaW4gdGhlaXIgcmVkaXJlY3QuICovXHJcbiAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihlbGVtZW50SW5kZXgsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIHN0YWdnZXIgb3B0aW9uIHdhcyBwYXNzZWQgaW4sIHN1Y2Nlc3NpdmVseSBkZWxheSBlYWNoIGVsZW1lbnQgYnkgdGhlIHN0YWdnZXIgdmFsdWUgKGluIG1zKS4gUmV0YWluIHRoZSBvcmlnaW5hbCBkZWxheSB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnNlRmxvYXQob3B0cy5zdGFnZ2VyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSA9IGRlbGF5T3JpZ2luYWwgKyAocGFyc2VGbG9hdChvcHRzLnN0YWdnZXIpICogZWxlbWVudEluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChUeXBlLmlzRnVuY3Rpb24ob3B0cy5zdGFnZ2VyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSA9IGRlbGF5T3JpZ2luYWwgKyBvcHRzLnN0YWdnZXIuY2FsbChlbGVtZW50LCBlbGVtZW50SW5kZXgsIGVsZW1lbnRzTGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGRyYWcgb3B0aW9uIHdhcyBwYXNzZWQgaW4sIHN1Y2Nlc3NpdmVseSBpbmNyZWFzZS9kZWNyZWFzZSAoZGVwZW5kaW5nIG9uIHRoZSBwcmVzZW5zZSBvZiBvcHRzLmJhY2t3YXJkcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlIGR1cmF0aW9uIG9mIGVhY2ggZWxlbWVudCdzIGFuaW1hdGlvbiwgdXNpbmcgZmxvb3JzIHRvIHByZXZlbnQgcHJvZHVjaW5nIHZlcnkgc2hvcnQgZHVyYXRpb25zLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kcmFnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRoZSBkdXJhdGlvbiBvZiBVSSBwYWNrIGVmZmVjdHMgKGNhbGxvdXRzIGFuZCB0cmFuc2l0aW9ucykgdG8gMTAwMG1zIGluc3RlYWQgb2YgdGhlIHVzdWFsIGRlZmF1bHQgZHVyYXRpb24gb2YgNDAwbXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gcGFyc2VGbG9hdChkdXJhdGlvbk9yaWdpbmFsKSB8fCAoL14oY2FsbG91dHx0cmFuc2l0aW9uKS8udGVzdChwcm9wZXJ0aWVzTWFwKSA/IDEwMDAgOiBEVVJBVElPTl9ERUZBVUxUKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZWFjaCBlbGVtZW50LCB0YWtlIHRoZSBncmVhdGVyIGR1cmF0aW9uIG9mOiBBKSBhbmltYXRpb24gY29tcGxldGlvbiBwZXJjZW50YWdlIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5hbCBkdXJhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEIpIDc1JSBvZiB0aGUgb3JpZ2luYWwgZHVyYXRpb24sIG9yIEMpIGEgMjAwbXMgZmFsbGJhY2sgKGluIGNhc2UgZHVyYXRpb24gaXMgYWxyZWFkeSBzZXQgdG8gYSBsb3cgdmFsdWUpLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGVuZCByZXN1bHQgaXMgYSBiYXNlbGluZSBvZiA3NSUgb2YgdGhlIHJlZGlyZWN0J3MgZHVyYXRpb24gdGhhdCBpbmNyZWFzZXMvZGVjcmVhc2VzIGFzIHRoZSBlbmQgb2YgdGhlIGVsZW1lbnQgc2V0IGlzIGFwcHJvYWNoZWQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gTWF0aC5tYXgob3B0cy5kdXJhdGlvbiAqIChvcHRzLmJhY2t3YXJkcyA/IDEgLSBlbGVtZW50SW5kZXgvZWxlbWVudHNMZW5ndGggOiAoZWxlbWVudEluZGV4ICsgMSkgLyBlbGVtZW50c0xlbmd0aCksIG9wdHMuZHVyYXRpb24gKiAwLjc1LCAyMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXNzIGluIHRoZSBjYWxsJ3Mgb3B0cyBvYmplY3Qgc28gdGhhdCB0aGUgcmVkaXJlY3QgY2FuIG9wdGlvbmFsbHkgZXh0ZW5kIGl0LiBJdCBkZWZhdWx0cyB0byBhbiBlbXB0eSBvYmplY3QgaW5zdGVhZCBvZiBudWxsIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlZHVjZSB0aGUgb3B0cyBjaGVja2luZyBsb2dpYyByZXF1aXJlZCBpbnNpZGUgdGhlIHJlZGlyZWN0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5SZWRpcmVjdHNbcHJvcGVydGllc01hcF0uY2FsbChlbGVtZW50LCBlbGVtZW50LCBvcHRzIHx8IHt9LCBlbGVtZW50SW5kZXgsIGVsZW1lbnRzTGVuZ3RoLCBlbGVtZW50cywgcHJvbWlzZURhdGEucHJvbWlzZSA/IHByb21pc2VEYXRhIDogdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogU2luY2UgdGhlIGFuaW1hdGlvbiBsb2dpYyByZXNpZGVzIHdpdGhpbiB0aGUgcmVkaXJlY3QncyBvd24gY29kZSwgYWJvcnQgdGhlIHJlbWFpbmRlciBvZiB0aGlzIGNhbGwuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgKFRoZSBwZXJmb3JtYW5jZSBvdmVyaGVhZCB1cCB0byB0aGlzIHBvaW50IGlzIHZpcnR1YWxseSBub24tZXhpc3RhbnQuKSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRoZSBqUXVlcnkgY2FsbCBjaGFpbiBpcyBrZXB0IGludGFjdCBieSByZXR1cm5pbmcgdGhlIGNvbXBsZXRlIGVsZW1lbnQgc2V0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWJvcnRFcnJvciA9IFwiVmVsb2NpdHk6IEZpcnN0IGFyZ3VtZW50IChcIiArIHByb3BlcnRpZXNNYXAgKyBcIikgd2FzIG5vdCBhIHByb3BlcnR5IG1hcCwgYSBrbm93biBhY3Rpb24sIG9yIGEgcmVnaXN0ZXJlZCByZWRpcmVjdC4gQWJvcnRpbmcuXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YS5wcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VEYXRhLnJlamVjdGVyKG5ldyBFcnJvcihhYm9ydEVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWJvcnRFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0Q2hhaW4oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICBDYWxsLVdpZGUgVmFyaWFibGVzXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIC8qIEEgY29udGFpbmVyIGZvciBDU1MgdW5pdCBjb252ZXJzaW9uIHJhdGlvcyAoZS5nLiAlLCByZW0sIGFuZCBlbSA9PT4gcHgpIHRoYXQgaXMgdXNlZCB0byBjYWNoZSByYXRpb3MgYWNyb3NzIGFsbCBlbGVtZW50c1xyXG4gICAgICAgICAgIGJlaW5nIGFuaW1hdGVkIGluIGEgc2luZ2xlIFZlbG9jaXR5IGNhbGwuIENhbGN1bGF0aW5nIHVuaXQgcmF0aW9zIG5lY2Vzc2l0YXRlcyBET00gcXVlcnlpbmcgYW5kIHVwZGF0aW5nLCBhbmQgaXMgdGhlcmVmb3JlXHJcbiAgICAgICAgICAgYXZvaWRlZCAodmlhIGNhY2hpbmcpIHdoZXJldmVyIHBvc3NpYmxlLiBUaGlzIGNvbnRhaW5lciBpcyBjYWxsLXdpZGUgaW5zdGVhZCBvZiBwYWdlLXdpZGUgdG8gYXZvaWQgdGhlIHJpc2sgb2YgdXNpbmcgc3RhbGVcclxuICAgICAgICAgICBjb252ZXJzaW9uIG1ldHJpY3MgYWNyb3NzIFZlbG9jaXR5IGFuaW1hdGlvbnMgdGhhdCBhcmUgbm90IGltbWVkaWF0ZWx5IGNvbnNlY3V0aXZlbHkgY2hhaW5lZC4gKi9cclxuICAgICAgICB2YXIgY2FsbFVuaXRDb252ZXJzaW9uRGF0YSA9IHtcclxuICAgICAgICAgICAgICAgIGxhc3RQYXJlbnQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBsYXN0UG9zaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgICAgICBsYXN0Rm9udFNpemU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBsYXN0UGVyY2VudFRvUHhXaWR0aDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGxhc3RQZXJjZW50VG9QeEhlaWdodDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGxhc3RFbVRvUHg6IG51bGwsXHJcbiAgICAgICAgICAgICAgICByZW1Ub1B4OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgdndUb1B4OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgdmhUb1B4OiBudWxsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIEEgY29udGFpbmVyIGZvciBhbGwgdGhlIGVuc3VpbmcgdHdlZW4gZGF0YSBhbmQgbWV0YWRhdGEgYXNzb2NpYXRlZCB3aXRoIHRoaXMgY2FsbC4gVGhpcyBjb250YWluZXIgZ2V0cyBwdXNoZWQgdG8gdGhlIHBhZ2Utd2lkZVxyXG4gICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGFycmF5IHRoYXQgaXMgcHJvY2Vzc2VkIGR1cmluZyBhbmltYXRpb24gdGlja2luZy4gKi9cclxuICAgICAgICB2YXIgY2FsbCA9IFtdO1xyXG5cclxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgRWxlbWVudCBQcm9jZXNzaW5nXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAvKiBFbGVtZW50IHByb2Nlc3NpbmcgY29uc2lzdHMgb2YgdGhyZWUgcGFydHMgLS0gZGF0YSBwcm9jZXNzaW5nIHRoYXQgY2Fubm90IGdvIHN0YWxlIGFuZCBkYXRhIHByb2Nlc3NpbmcgdGhhdCAqY2FuKiBnbyBzdGFsZSAoaS5lLiB0aGlyZC1wYXJ0eSBzdHlsZSBtb2RpZmljYXRpb25zKTpcclxuICAgICAgICAgICAxKSBQcmUtUXVldWVpbmc6IEVsZW1lbnQtd2lkZSB2YXJpYWJsZXMsIGluY2x1ZGluZyB0aGUgZWxlbWVudCdzIGRhdGEgc3RvcmFnZSwgYXJlIGluc3RhbnRpYXRlZC4gQ2FsbCBvcHRpb25zIGFyZSBwcmVwYXJlZC4gSWYgdHJpZ2dlcmVkLCB0aGUgU3RvcCBhY3Rpb24gaXMgZXhlY3V0ZWQuXHJcbiAgICAgICAgICAgMikgUXVldWVpbmc6IFRoZSBsb2dpYyB0aGF0IHJ1bnMgb25jZSB0aGlzIGNhbGwgaGFzIHJlYWNoZWQgaXRzIHBvaW50IG9mIGV4ZWN1dGlvbiBpbiB0aGUgZWxlbWVudCdzICQucXVldWUoKSBzdGFjay4gTW9zdCBsb2dpYyBpcyBwbGFjZWQgaGVyZSB0byBhdm9pZCByaXNraW5nIGl0IGJlY29taW5nIHN0YWxlLlxyXG4gICAgICAgICAgIDMpIFB1c2hpbmc6IENvbnNvbGlkYXRpb24gb2YgdGhlIHR3ZWVuIGRhdGEgZm9sbG93ZWQgYnkgaXRzIHB1c2ggb250byB0aGUgZ2xvYmFsIGluLXByb2dyZXNzIGNhbGxzIGNvbnRhaW5lci5cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBwcm9jZXNzRWxlbWVudCAoKSB7XHJcblxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBQYXJ0IEk6IFByZS1RdWV1ZWluZ1xyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBFbGVtZW50LVdpZGUgVmFyaWFibGVzXHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgIHZhciBlbGVtZW50ID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIC8qIFRoZSBydW50aW1lIG9wdHMgb2JqZWN0IGlzIHRoZSBleHRlbnNpb24gb2YgdGhlIGN1cnJlbnQgY2FsbCdzIG9wdGlvbnMgYW5kIFZlbG9jaXR5J3MgcGFnZS13aWRlIG9wdGlvbiBkZWZhdWx0cy4gKi9cclxuICAgICAgICAgICAgICAgIG9wdHMgPSAkLmV4dGVuZCh7fSwgVmVsb2NpdHkuZGVmYXVsdHMsIG9wdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgLyogQSBjb250YWluZXIgZm9yIHRoZSBwcm9jZXNzZWQgZGF0YSBhc3NvY2lhdGVkIHdpdGggZWFjaCBwcm9wZXJ0eSBpbiB0aGUgcHJvcGVydHlNYXAuXHJcbiAgICAgICAgICAgICAgICAgICAoRWFjaCBwcm9wZXJ0eSBpbiB0aGUgbWFwIHByb2R1Y2VzIGl0cyBvd24gXCJ0d2VlblwiLikgKi9cclxuICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciA9IHt9LFxyXG4gICAgICAgICAgICAgICAgZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YTtcclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgRWxlbWVudCBJbml0XHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIFZlbG9jaXR5LmluaXQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgT3B0aW9uOiBEZWxheVxyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAvKiBTaW5jZSBxdWV1ZTpmYWxzZSBkb2Vzbid0IHJlc3BlY3QgdGhlIGl0ZW0ncyBleGlzdGluZyBxdWV1ZSwgd2UgYXZvaWQgaW5qZWN0aW5nIGl0cyBkZWxheSBoZXJlIChpdCdzIHNldCBsYXRlciBvbikuICovXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IFZlbG9jaXR5IHJvbGxzIGl0cyBvd24gZGVsYXkgZnVuY3Rpb24gc2luY2UgalF1ZXJ5IGRvZXNuJ3QgaGF2ZSBhIHV0aWxpdHkgYWxpYXMgZm9yICQuZm4uZGVsYXkoKVxyXG4gICAgICAgICAgICAgICAoYW5kIHRodXMgcmVxdWlyZXMgalF1ZXJ5IGVsZW1lbnQgY3JlYXRpb24sIHdoaWNoIHdlIGF2b2lkIHNpbmNlIGl0cyBvdmVyaGVhZCBpbmNsdWRlcyBET00gcXVlcnlpbmcpLiAqL1xyXG4gICAgICAgICAgICBpZiAocGFyc2VGbG9hdChvcHRzLmRlbGF5KSAmJiBvcHRzLnF1ZXVlICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgJC5xdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlLCBmdW5jdGlvbihuZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogVGhpcyBpcyBhIGZsYWcgdXNlZCB0byBpbmRpY2F0ZSB0byB0aGUgdXBjb21pbmcgY29tcGxldGVDYWxsKCkgZnVuY3Rpb24gdGhhdCB0aGlzIHF1ZXVlIGVudHJ5IHdhcyBpbml0aWF0ZWQgYnkgVmVsb2NpdHkuIFNlZSBjb21wbGV0ZUNhbGwoKSBmb3IgZnVydGhlciBkZXRhaWxzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LnZlbG9jaXR5UXVldWVFbnRyeUZsYWcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgZW5zdWluZyBxdWV1ZSBpdGVtICh3aGljaCBpcyBhc3NpZ25lZCB0byB0aGUgXCJuZXh0XCIgYXJndW1lbnQgdGhhdCAkLnF1ZXVlKCkgYXV0b21hdGljYWxseSBwYXNzZXMgaW4pIHdpbGwgYmUgdHJpZ2dlcmVkIGFmdGVyIGEgc2V0VGltZW91dCBkZWxheS5cclxuICAgICAgICAgICAgICAgICAgICAgICBUaGUgc2V0VGltZW91dCBpcyBzdG9yZWQgc28gdGhhdCBpdCBjYW4gYmUgc3ViamVjdGVkIHRvIGNsZWFyVGltZW91dCgpIGlmIHRoaXMgYW5pbWF0aW9uIGlzIHByZW1hdHVyZWx5IHN0b3BwZWQgdmlhIFZlbG9jaXR5J3MgXCJzdG9wXCIgY29tbWFuZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmRlbGF5VGltZXIgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQ6IHNldFRpbWVvdXQobmV4dCwgcGFyc2VGbG9hdChvcHRzLmRlbGF5KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQ6IG5leHRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgT3B0aW9uOiBEdXJhdGlvblxyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAvKiBTdXBwb3J0IGZvciBqUXVlcnkncyBuYW1lZCBkdXJhdGlvbnMuICovXHJcbiAgICAgICAgICAgIHN3aXRjaCAob3B0cy5kdXJhdGlvbi50b1N0cmluZygpLnRvTG93ZXJDYXNlKCkpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJmYXN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IDIwMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibm9ybWFsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiA9IERVUkFUSU9OX0RFRkFVTFQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNsb3dcIjpcclxuICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gNjAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLyogUmVtb3ZlIHRoZSBwb3RlbnRpYWwgXCJtc1wiIHN1ZmZpeCBhbmQgZGVmYXVsdCB0byAxIGlmIHRoZSB1c2VyIGlzIGF0dGVtcHRpbmcgdG8gc2V0IGEgZHVyYXRpb24gb2YgMCAoaW4gb3JkZXIgdG8gcHJvZHVjZSBhbiBpbW1lZGlhdGUgc3R5bGUgY2hhbmdlKS4gKi9cclxuICAgICAgICAgICAgICAgICAgICBvcHRzLmR1cmF0aW9uID0gcGFyc2VGbG9hdChvcHRzLmR1cmF0aW9uKSB8fCAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgIEdsb2JhbCBPcHRpb246IE1vY2tcclxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgaWYgKFZlbG9jaXR5Lm1vY2sgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBJbiBtb2NrIG1vZGUsIGFsbCBhbmltYXRpb25zIGFyZSBmb3JjZWQgdG8gMW1zIHNvIHRoYXQgdGhleSBvY2N1ciBpbW1lZGlhdGVseSB1cG9uIHRoZSBuZXh0IHJBRiB0aWNrLlxyXG4gICAgICAgICAgICAgICAgICAgQWx0ZXJuYXRpdmVseSwgYSBtdWx0aXBsaWVyIGNhbiBiZSBwYXNzZWQgaW4gdG8gdGltZSByZW1hcCBhbGwgZGVsYXlzIGFuZCBkdXJhdGlvbnMuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoVmVsb2NpdHkubW9jayA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdHMuZHVyYXRpb24gPSBvcHRzLmRlbGF5ID0gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kdXJhdGlvbiAqPSBwYXJzZUZsb2F0KFZlbG9jaXR5Lm1vY2spIHx8IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5kZWxheSAqPSBwYXJzZUZsb2F0KFZlbG9jaXR5Lm1vY2spIHx8IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgIE9wdGlvbjogRWFzaW5nXHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICBvcHRzLmVhc2luZyA9IGdldEVhc2luZyhvcHRzLmVhc2luZywgb3B0cy5kdXJhdGlvbik7XHJcblxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBPcHRpb246IENhbGxiYWNrc1xyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgLyogQ2FsbGJhY2tzIG11c3QgZnVuY3Rpb25zLiBPdGhlcndpc2UsIGRlZmF1bHQgdG8gbnVsbC4gKi9cclxuICAgICAgICAgICAgaWYgKG9wdHMuYmVnaW4gJiYgIVR5cGUuaXNGdW5jdGlvbihvcHRzLmJlZ2luKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0cy5iZWdpbiA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRzLnByb2dyZXNzICYmICFUeXBlLmlzRnVuY3Rpb24ob3B0cy5wcm9ncmVzcykpIHtcclxuICAgICAgICAgICAgICAgIG9wdHMucHJvZ3Jlc3MgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0cy5jb21wbGV0ZSAmJiAhVHlwZS5pc0Z1bmN0aW9uKG9wdHMuY29tcGxldGUpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRzLmNvbXBsZXRlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBPcHRpb246IERpc3BsYXkgJiBWaXNpYmlsaXR5XHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgIC8qIFJlZmVyIHRvIFZlbG9jaXR5J3MgZG9jdW1lbnRhdGlvbiAoVmVsb2NpdHlKUy5vcmcvI2Rpc3BsYXlBbmRWaXNpYmlsaXR5KSBmb3IgYSBkZXNjcmlwdGlvbiBvZiB0aGUgZGlzcGxheSBhbmQgdmlzaWJpbGl0eSBvcHRpb25zJyBiZWhhdmlvci4gKi9cclxuICAgICAgICAgICAgLyogTm90ZTogV2Ugc3RyaWN0bHkgY2hlY2sgZm9yIHVuZGVmaW5lZCBpbnN0ZWFkIG9mIGZhbHNpbmVzcyBiZWNhdXNlIGRpc3BsYXkgYWNjZXB0cyBhbiBlbXB0eSBzdHJpbmcgdmFsdWUuICovXHJcbiAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIG9wdHMuZGlzcGxheSA9IG9wdHMuZGlzcGxheS50b1N0cmluZygpLnRvTG93ZXJDYXNlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogVXNlcnMgY2FuIHBhc3MgaW4gYSBzcGVjaWFsIFwiYXV0b1wiIHZhbHVlIHRvIGluc3RydWN0IFZlbG9jaXR5IHRvIHNldCB0aGUgZWxlbWVudCB0byBpdHMgZGVmYXVsdCBkaXNwbGF5IHZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMuZGlzcGxheSA9PT0gXCJhdXRvXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRzLmRpc3BsYXkgPSBWZWxvY2l0eS5DU1MuVmFsdWVzLmdldERpc3BsYXlUeXBlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3B0cy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy52aXNpYmlsaXR5ICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRzLnZpc2liaWxpdHkgPSBvcHRzLnZpc2liaWxpdHkudG9TdHJpbmcoKS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBPcHRpb246IG1vYmlsZUhBXHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAvKiBXaGVuIHNldCB0byB0cnVlLCBhbmQgaWYgdGhpcyBpcyBhIG1vYmlsZSBkZXZpY2UsIG1vYmlsZUhBIGF1dG9tYXRpY2FsbHkgZW5hYmxlcyBoYXJkd2FyZSBhY2NlbGVyYXRpb24gKHZpYSBhIG51bGwgdHJhbnNmb3JtIGhhY2spXHJcbiAgICAgICAgICAgICAgIG9uIGFuaW1hdGluZyBlbGVtZW50cy4gSEEgaXMgcmVtb3ZlZCBmcm9tIHRoZSBlbGVtZW50IGF0IHRoZSBjb21wbGV0aW9uIG9mIGl0cyBhbmltYXRpb24uICovXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IEFuZHJvaWQgR2luZ2VyYnJlYWQgZG9lc24ndCBzdXBwb3J0IEhBLiBJZiBhIG51bGwgdHJhbnNmb3JtIGhhY2sgKG1vYmlsZUhBKSBpcyBpbiBmYWN0IHNldCwgaXQgd2lsbCBwcmV2ZW50IG90aGVyIHRyYW5mb3JtIHN1YnByb3BlcnRpZXMgZnJvbSB0YWtpbmcgZWZmZWN0LiAqL1xyXG4gICAgICAgICAgICAvKiBOb3RlOiBZb3UgY2FuIHJlYWQgbW9yZSBhYm91dCB0aGUgdXNlIG9mIG1vYmlsZUhBIGluIFZlbG9jaXR5J3MgZG9jdW1lbnRhdGlvbjogVmVsb2NpdHlKUy5vcmcvI21vYmlsZUhBLiAqL1xyXG4gICAgICAgICAgICBvcHRzLm1vYmlsZUhBID0gKG9wdHMubW9iaWxlSEEgJiYgVmVsb2NpdHkuU3RhdGUuaXNNb2JpbGUgJiYgIVZlbG9jaXR5LlN0YXRlLmlzR2luZ2VyYnJlYWQpO1xyXG5cclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgIFBhcnQgSUk6IFF1ZXVlaW5nXHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgLyogV2hlbiBhIHNldCBvZiBlbGVtZW50cyBpcyB0YXJnZXRlZCBieSBhIFZlbG9jaXR5IGNhbGwsIHRoZSBzZXQgaXMgYnJva2VuIHVwIGFuZCBlYWNoIGVsZW1lbnQgaGFzIHRoZSBjdXJyZW50IFZlbG9jaXR5IGNhbGwgaW5kaXZpZHVhbGx5IHF1ZXVlZCBvbnRvIGl0LlxyXG4gICAgICAgICAgICAgICBJbiB0aGlzIHdheSwgZWFjaCBlbGVtZW50J3MgZXhpc3RpbmcgcXVldWUgaXMgcmVzcGVjdGVkOyBzb21lIGVsZW1lbnRzIG1heSBhbHJlYWR5IGJlIGFuaW1hdGluZyBhbmQgYWNjb3JkaW5nbHkgc2hvdWxkIG5vdCBoYXZlIHRoaXMgY3VycmVudCBWZWxvY2l0eSBjYWxsIHRyaWdnZXJlZCBpbW1lZGlhdGVseS4gKi9cclxuICAgICAgICAgICAgLyogSW4gZWFjaCBxdWV1ZSwgdHdlZW4gZGF0YSBpcyBwcm9jZXNzZWQgZm9yIGVhY2ggYW5pbWF0aW5nIHByb3BlcnR5IHRoZW4gcHVzaGVkIG9udG8gdGhlIGNhbGwtd2lkZSBjYWxscyBhcnJheS4gV2hlbiB0aGUgbGFzdCBlbGVtZW50IGluIHRoZSBzZXQgaGFzIGhhZCBpdHMgdHdlZW5zIHByb2Nlc3NlZCxcclxuICAgICAgICAgICAgICAgdGhlIGNhbGwgYXJyYXkgaXMgcHVzaGVkIHRvIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGZvciBsaXZlIHByb2Nlc3NpbmcgYnkgdGhlIHJlcXVlc3RBbmltYXRpb25GcmFtZSB0aWNrLiAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBidWlsZFF1ZXVlIChuZXh0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgIE9wdGlvbjogQmVnaW5cclxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgLyogVGhlIGJlZ2luIGNhbGxiYWNrIGlzIGZpcmVkIG9uY2UgcGVyIGNhbGwgLS0gbm90IG9uY2UgcGVyIGVsZW1lbmV0IC0tIGFuZCBpcyBwYXNzZWQgdGhlIGZ1bGwgcmF3IERPTSBlbGVtZW50IHNldCBhcyBib3RoIGl0cyBjb250ZXh0IGFuZCBpdHMgZmlyc3QgYXJndW1lbnQuICovXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5iZWdpbiAmJiBlbGVtZW50c0luZGV4ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogV2UgdGhyb3cgY2FsbGJhY2tzIGluIGEgc2V0VGltZW91dCBzbyB0aGF0IHRocm93biBlcnJvcnMgZG9uJ3QgaGFsdCB0aGUgZXhlY3V0aW9uIG9mIFZlbG9jaXR5IGl0c2VsZi4gKi9cclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmJlZ2luLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyB0aHJvdyBlcnJvcjsgfSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDb25zdHJ1Y3Rpb24gKGZvciBTY3JvbGwpXHJcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBOb3RlOiBJbiBvcmRlciB0byBiZSBzdWJqZWN0ZWQgdG8gY2hhaW5pbmcgYW5kIGFuaW1hdGlvbiBvcHRpb25zLCBzY3JvbGwncyB0d2VlbmluZyBpcyByb3V0ZWQgdGhyb3VnaCBWZWxvY2l0eSBhcyBpZiBpdCB3ZXJlIGEgc3RhbmRhcmQgQ1NTIHByb3BlcnR5IGFuaW1hdGlvbi4gKi9cclxuICAgICAgICAgICAgICAgIGlmIChhY3Rpb24gPT09IFwic2Nyb2xsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgc2Nyb2xsIGFjdGlvbiB1bmlxdWVseSB0YWtlcyBhbiBvcHRpb25hbCBcIm9mZnNldFwiIG9wdGlvbiAtLSBzcGVjaWZpZWQgaW4gcGl4ZWxzIC0tIHRoYXQgb2Zmc2V0cyB0aGUgdGFyZ2V0ZWQgc2Nyb2xsIHBvc2l0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzY3JvbGxEaXJlY3Rpb24gPSAoL154JC9pLnRlc3Qob3B0cy5heGlzKSA/IFwiTGVmdFwiIDogXCJUb3BcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCA9IHBhcnNlRmxvYXQob3B0cy5vZmZzZXQpIHx8IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uQ3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50QWx0ZXJuYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkVuZDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogU2Nyb2xsIGFsc28gdW5pcXVlbHkgdGFrZXMgYW4gb3B0aW9uYWwgXCJjb250YWluZXJcIiBvcHRpb24sIHdoaWNoIGluZGljYXRlcyB0aGUgcGFyZW50IGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgc2Nyb2xsZWQgLS1cclxuICAgICAgICAgICAgICAgICAgICAgICBhcyBvcHBvc2VkIHRvIHRoZSBicm93c2VyIHdpbmRvdyBpdHNlbGYuIFRoaXMgaXMgdXNlZnVsIGZvciBzY3JvbGxpbmcgdG93YXJkIGFuIGVsZW1lbnQgdGhhdCdzIGluc2lkZSBhbiBvdmVyZmxvd2luZyBwYXJlbnQgZWxlbWVudC4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5jb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogRW5zdXJlIHRoYXQgZWl0aGVyIGEgalF1ZXJ5IG9iamVjdCBvciBhIHJhdyBET00gZWxlbWVudCB3YXMgcGFzc2VkIGluLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZS5pc1dyYXBwZWQob3B0cy5jb250YWluZXIpIHx8IFR5cGUuaXNOb2RlKG9wdHMuY29udGFpbmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRXh0cmFjdCB0aGUgcmF3IERPTSBlbGVtZW50IGZyb20gdGhlIGpRdWVyeSB3cmFwcGVyLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0cy5jb250YWluZXIgPSBvcHRzLmNvbnRhaW5lclswXSB8fCBvcHRzLmNvbnRhaW5lcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFVubGlrZSBvdGhlciBwcm9wZXJ0aWVzIGluIFZlbG9jaXR5LCB0aGUgYnJvd3NlcidzIHNjcm9sbCBwb3NpdGlvbiBpcyBuZXZlciBjYWNoZWQgc2luY2UgaXQgc28gZnJlcXVlbnRseSBjaGFuZ2VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZHVlIHRvIHRoZSB1c2VyJ3MgbmF0dXJhbCBpbnRlcmFjdGlvbiB3aXRoIHRoZSBwYWdlKS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFBvc2l0aW9uQ3VycmVudCA9IG9wdHMuY29udGFpbmVyW1wic2Nyb2xsXCIgKyBzY3JvbGxEaXJlY3Rpb25dOyAvKiBHRVQgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAkLnBvc2l0aW9uKCkgdmFsdWVzIGFyZSByZWxhdGl2ZSB0byB0aGUgY29udGFpbmVyJ3MgY3VycmVudGx5IHZpZXdhYmxlIGFyZWEgKHdpdGhvdXQgdGFraW5nIGludG8gYWNjb3VudCB0aGUgY29udGFpbmVyJ3MgdHJ1ZSBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtLSBzYXksIGZvciBleGFtcGxlLCBpZiB0aGUgY29udGFpbmVyIHdhcyBub3Qgb3ZlcmZsb3dpbmcpLiBUaHVzLCB0aGUgc2Nyb2xsIGVuZCB2YWx1ZSBpcyB0aGUgc3VtIG9mIHRoZSBjaGlsZCBlbGVtZW50J3MgcG9zaXRpb24gKmFuZCpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBzY3JvbGwgY29udGFpbmVyJ3MgY3VycmVudCBzY3JvbGwgcG9zaXRpb24uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkVuZCA9IChzY3JvbGxQb3NpdGlvbkN1cnJlbnQgKyAkKGVsZW1lbnQpLnBvc2l0aW9uKClbc2Nyb2xsRGlyZWN0aW9uLnRvTG93ZXJDYXNlKCldKSArIHNjcm9sbE9mZnNldDsgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIGEgdmFsdWUgb3RoZXIgdGhhbiBhIGpRdWVyeSBvYmplY3Qgb3IgYSByYXcgRE9NIGVsZW1lbnQgd2FzIHBhc3NlZCBpbiwgZGVmYXVsdCB0byBudWxsIHNvIHRoYXQgdGhpcyBvcHRpb24gaXMgaWdub3JlZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMuY29udGFpbmVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSB3aW5kb3cgaXRzZWxmIGlzIGJlaW5nIHNjcm9sbGVkIC0tIG5vdCBhIGNvbnRhaW5pbmcgZWxlbWVudCAtLSBwZXJmb3JtIGEgbGl2ZSBzY3JvbGwgcG9zaXRpb24gbG9va3VwIHVzaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZSBhcHByb3ByaWF0ZSBjYWNoZWQgcHJvcGVydHkgbmFtZXMgKHdoaWNoIGRpZmZlciBiYXNlZCBvbiBicm93c2VyIHR5cGUpLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxQb3NpdGlvbkN1cnJlbnQgPSBWZWxvY2l0eS5TdGF0ZS5zY3JvbGxBbmNob3JbVmVsb2NpdHkuU3RhdGVbXCJzY3JvbGxQcm9wZXJ0eVwiICsgc2Nyb2xsRGlyZWN0aW9uXV07IC8qIEdFVCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHNjcm9sbGluZyB0aGUgYnJvd3NlciB3aW5kb3csIGNhY2hlIHRoZSBhbHRlcm5hdGUgYXhpcydzIGN1cnJlbnQgdmFsdWUgc2luY2Ugd2luZG93LnNjcm9sbFRvKCkgZG9lc24ndCBsZXQgdXMgY2hhbmdlIG9ubHkgb25lIHZhbHVlIGF0IGEgdGltZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25DdXJyZW50QWx0ZXJuYXRlID0gVmVsb2NpdHkuU3RhdGUuc2Nyb2xsQW5jaG9yW1ZlbG9jaXR5LlN0YXRlW1wic2Nyb2xsUHJvcGVydHlcIiArIChzY3JvbGxEaXJlY3Rpb24gPT09IFwiTGVmdFwiID8gXCJUb3BcIiA6IFwiTGVmdFwiKV1dOyAvKiBHRVQgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFVubGlrZSAkLnBvc2l0aW9uKCksICQub2Zmc2V0KCkgdmFsdWVzIGFyZSByZWxhdGl2ZSB0byB0aGUgYnJvd3NlciB3aW5kb3cncyB0cnVlIGRpbWVuc2lvbnMgLS0gbm90IG1lcmVseSBpdHMgY3VycmVudGx5IHZpZXdhYmxlIGFyZWEgLS1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5kIHRoZXJlZm9yZSBlbmQgdmFsdWVzIGRvIG5vdCBuZWVkIHRvIGJlIGNvbXBvdW5kZWQgb250byBjdXJyZW50IHZhbHVlcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25FbmQgPSAkKGVsZW1lbnQpLm9mZnNldCgpW3Njcm9sbERpcmVjdGlvbi50b0xvd2VyQ2FzZSgpXSArIHNjcm9sbE9mZnNldDsgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGVyZSdzIG9ubHkgb25lIGZvcm1hdCB0aGF0IHNjcm9sbCdzIGFzc29jaWF0ZWQgdHdlZW5zQ29udGFpbmVyIGNhbiB0YWtlLCB3ZSBjcmVhdGUgaXQgbWFudWFsbHkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGw6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3RQcm9wZXJ0eVZhbHVlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWU6IHNjcm9sbFBvc2l0aW9uQ3VycmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZTogc2Nyb2xsUG9zaXRpb25DdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWU6IHNjcm9sbFBvc2l0aW9uRW5kLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IG9wdHMuZWFzaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcjogb3B0cy5jb250YWluZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiBzY3JvbGxEaXJlY3Rpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWx0ZXJuYXRlVmFsdWU6IHNjcm9sbFBvc2l0aW9uQ3VycmVudEFsdGVybmF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSBjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoc2Nyb2xsKTogXCIsIHR3ZWVuc0NvbnRhaW5lci5zY3JvbGwsIGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgIFR3ZWVuIERhdGEgQ29uc3RydWN0aW9uIChmb3IgUmV2ZXJzZSlcclxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBSZXZlcnNlIGFjdHMgbGlrZSBhIFwic3RhcnRcIiBhY3Rpb24gaW4gdGhhdCBhIHByb3BlcnR5IG1hcCBpcyBhbmltYXRlZCB0b3dhcmQuIFRoZSBvbmx5IGRpZmZlcmVuY2UgaXNcclxuICAgICAgICAgICAgICAgICAgIHRoYXQgdGhlIHByb3BlcnR5IG1hcCB1c2VkIGZvciByZXZlcnNlIGlzIHRoZSBpbnZlcnNlIG9mIHRoZSBtYXAgdXNlZCBpbiB0aGUgcHJldmlvdXMgY2FsbC4gVGh1cywgd2UgbWFuaXB1bGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgdGhlIHByZXZpb3VzIGNhbGwgdG8gY29uc3RydWN0IG91ciBuZXcgbWFwOiB1c2UgdGhlIHByZXZpb3VzIG1hcCdzIGVuZCB2YWx1ZXMgYXMgb3VyIG5ldyBtYXAncyBzdGFydCB2YWx1ZXMuIENvcHkgb3ZlciBhbGwgb3RoZXIgZGF0YS4gKi9cclxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IFJldmVyc2UgY2FuIGJlIGRpcmVjdGx5IGNhbGxlZCB2aWEgdGhlIFwicmV2ZXJzZVwiIHBhcmFtZXRlciwgb3IgaXQgY2FuIGJlIGluZGlyZWN0bHkgdHJpZ2dlcmVkIHZpYSB0aGUgbG9vcCBvcHRpb24uIChMb29wcyBhcmUgY29tcG9zZWQgb2YgbXVsdGlwbGUgcmV2ZXJzZXMuKSAqL1xyXG4gICAgICAgICAgICAgICAgLyogTm90ZTogUmV2ZXJzZSBjYWxscyBkbyBub3QgbmVlZCB0byBiZSBjb25zZWN1dGl2ZWx5IGNoYWluZWQgb250byBhIGN1cnJlbnRseS1hbmltYXRpbmcgZWxlbWVudCBpbiBvcmRlciB0byBvcGVyYXRlIG9uIGNhY2hlZCB2YWx1ZXM7XHJcbiAgICAgICAgICAgICAgICAgICB0aGVyZSBpcyBubyBoYXJtIHRvIHJldmVyc2UgYmVpbmcgY2FsbGVkIG9uIGEgcG90ZW50aWFsbHkgc3RhbGUgZGF0YSBjYWNoZSBzaW5jZSByZXZlcnNlJ3MgYmVoYXZpb3IgaXMgc2ltcGx5IGRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgIGFzIHJldmVydGluZyB0byB0aGUgZWxlbWVudCdzIHZhbHVlcyBhcyB0aGV5IHdlcmUgcHJpb3IgdG8gdGhlIHByZXZpb3VzICpWZWxvY2l0eSogY2FsbC4gKi9cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSBcInJldmVyc2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIEFib3J0IGlmIHRoZXJlIGlzIG5vIHByaW9yIGFuaW1hdGlvbiBkYXRhIHRvIHJldmVyc2UgdG8uICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFEYXRhKGVsZW1lbnQpLnR3ZWVuc0NvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBEZXF1ZXVlIHRoZSBlbGVtZW50IHNvIHRoYXQgdGhpcyBxdWV1ZSBlbnRyeSByZWxlYXNlcyBpdHNlbGYgaW1tZWRpYXRlbHksIGFsbG93aW5nIHN1YnNlcXVlbnQgcXVldWUgZW50cmllcyB0byBydW4uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZGVxdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIE9wdGlvbnMgUGFyc2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZWxlbWVudCB3YXMgaGlkZGVuIHZpYSB0aGUgZGlzcGxheSBvcHRpb24gaW4gdGhlIHByZXZpb3VzIGNhbGwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVydCBkaXNwbGF5IHRvIFwiYXV0b1wiIHByaW9yIHRvIHJldmVyc2FsIHNvIHRoYXQgdGhlIGVsZW1lbnQgaXMgdmlzaWJsZSBhZ2Fpbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkub3B0cy5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5vcHRzLmRpc3BsYXkgPSBcImF1dG9cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkub3B0cy52aXNpYmlsaXR5ID09PSBcImhpZGRlblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLm9wdHMudmlzaWJpbGl0eSA9IFwidmlzaWJsZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgbG9vcCBvcHRpb24gd2FzIHNldCBpbiB0aGUgcHJldmlvdXMgY2FsbCwgZGlzYWJsZSBpdCBzbyB0aGF0IFwicmV2ZXJzZVwiIGNhbGxzIGFyZW4ndCByZWN1cnNpdmVseSBnZW5lcmF0ZWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEZ1cnRoZXIsIHJlbW92ZSB0aGUgcHJldmlvdXMgY2FsbCdzIGNhbGxiYWNrIG9wdGlvbnM7IHR5cGljYWxseSwgdXNlcnMgZG8gbm90IHdhbnQgdGhlc2UgdG8gYmUgcmVmaXJlZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5vcHRzLmxvb3AgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5vcHRzLmJlZ2luID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS5vcHRzLmNvbXBsZXRlID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIHdlJ3JlIGV4dGVuZGluZyBhbiBvcHRzIG9iamVjdCB0aGF0IGhhcyBhbHJlYWR5IGJlZW4gZXh0ZW5kZWQgd2l0aCB0aGUgZGVmYXVsdHMgb3B0aW9ucyBvYmplY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlIHJlbW92ZSBub24tZXhwbGljaXRseS1kZWZpbmVkIHByb3BlcnRpZXMgdGhhdCBhcmUgYXV0by1hc3NpZ25lZCB2YWx1ZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0aW9ucy5lYXNpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvcHRzLmVhc2luZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHRpb25zLmR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgb3B0cy5kdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIG9wdHMgb2JqZWN0IHVzZWQgZm9yIHJldmVyc2FsIGlzIGFuIGV4dGVuc2lvbiBvZiB0aGUgb3B0aW9ucyBvYmplY3Qgb3B0aW9uYWxseSBwYXNzZWQgaW50byB0aGlzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldmVyc2UgY2FsbCBwbHVzIHRoZSBvcHRpb25zIHVzZWQgaW4gdGhlIHByZXZpb3VzIFZlbG9jaXR5IGNhbGwuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMgPSAkLmV4dGVuZCh7fSwgRGF0YShlbGVtZW50KS5vcHRzLCBvcHRzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFR3ZWVucyBDb250YWluZXIgUmVjb25zdHJ1Y3Rpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENyZWF0ZSBhIGRlZXB5IGNvcHkgKGluZGljYXRlZCB2aWEgdGhlIHRydWUgZmxhZykgb2YgdGhlIHByZXZpb3VzIGNhbGwncyB0d2VlbnNDb250YWluZXIuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VHdlZW5zQ29udGFpbmVyID0gJC5leHRlbmQodHJ1ZSwge30sIERhdGEoZWxlbWVudCkudHdlZW5zQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE1hbmlwdWxhdGUgdGhlIHByZXZpb3VzIHR3ZWVuc0NvbnRhaW5lciBieSByZXBsYWNpbmcgaXRzIGVuZCB2YWx1ZXMgYW5kIGN1cnJlbnRWYWx1ZXMgd2l0aCBpdHMgc3RhcnQgdmFsdWVzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBsYXN0VHdlZW4gaW4gbGFzdFR3ZWVuc0NvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSW4gYWRkaXRpb24gdG8gdHdlZW4gZGF0YSwgdHdlZW5zQ29udGFpbmVycyBjb250YWluIGFuIGVsZW1lbnQgcHJvcGVydHkgdGhhdCB3ZSBpZ25vcmUgaGVyZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsYXN0VHdlZW4gIT09IFwiZWxlbWVudFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxhc3RTdGFydFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLnN0YXJ0VmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5zdGFydFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dLmN1cnJlbnRWYWx1ZSA9IGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5lbmRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyW2xhc3RUd2Vlbl0uZW5kVmFsdWUgPSBsYXN0U3RhcnRWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRWFzaW5nIGlzIHRoZSBvbmx5IG9wdGlvbiB0aGF0IGVtYmVkcyBpbnRvIHRoZSBpbmRpdmlkdWFsIHR3ZWVuIGRhdGEgKHNpbmNlIGl0IGNhbiBiZSBkZWZpbmVkIG9uIGEgcGVyLXByb3BlcnR5IGJhc2lzKS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBY2NvcmRpbmdseSwgZXZlcnkgcHJvcGVydHkncyBlYXNpbmcgdmFsdWUgbXVzdCBiZSB1cGRhdGVkIHdoZW4gYW4gb3B0aW9ucyBvYmplY3QgaXMgcGFzc2VkIGluIHdpdGggYSByZXZlcnNlIGNhbGwuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIHNpZGUgZWZmZWN0IG9mIHRoaXMgZXh0ZW5zaWJpbGl0eSBpcyB0aGF0IGFsbCBwZXItcHJvcGVydHkgZWFzaW5nIHZhbHVlcyBhcmUgZm9yY2VmdWxseSByZXNldCB0byB0aGUgbmV3IHZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghVHlwZS5pc0VtcHR5T2JqZWN0KG9wdGlvbnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RUd2VlbnNDb250YWluZXJbbGFzdFR3ZWVuXS5lYXNpbmcgPSBvcHRzLmVhc2luZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZykgY29uc29sZS5sb2coXCJyZXZlcnNlIHR3ZWVuc0NvbnRhaW5lciAoXCIgKyBsYXN0VHdlZW4gKyBcIik6IFwiICsgSlNPTi5zdHJpbmdpZnkobGFzdFR3ZWVuc0NvbnRhaW5lcltsYXN0VHdlZW5dKSwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lciA9IGxhc3RUd2VlbnNDb250YWluZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDb25zdHJ1Y3Rpb24gKGZvciBTdGFydClcclxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoYWN0aW9uID09PSBcInN0YXJ0XCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmFsdWUgVHJhbnNmZXJyaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhpcyBxdWV1ZSBlbnRyeSBmb2xsb3dzIGEgcHJldmlvdXMgVmVsb2NpdHktaW5pdGlhdGVkIHF1ZXVlIGVudHJ5ICphbmQqIGlmIHRoaXMgZW50cnkgd2FzIGNyZWF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSB0aGUgZWxlbWVudCB3YXMgaW4gdGhlIHByb2Nlc3Mgb2YgYmVpbmcgYW5pbWF0ZWQgYnkgVmVsb2NpdHksIHRoZW4gdGhpcyBjdXJyZW50IGNhbGwgaXMgc2FmZSB0byB1c2VcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGUgZW5kIHZhbHVlcyBmcm9tIHRoZSBwcmlvciBjYWxsIGFzIGl0cyBzdGFydCB2YWx1ZXMuIFZlbG9jaXR5IGF0dGVtcHRzIHRvIHBlcmZvcm0gdGhpcyB2YWx1ZSB0cmFuc2ZlclxyXG4gICAgICAgICAgICAgICAgICAgICAgIHByb2Nlc3Mgd2hlbmV2ZXIgcG9zc2libGUgaW4gb3JkZXIgdG8gYXZvaWQgcmVxdWVyeWluZyB0aGUgRE9NLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHZhbHVlcyBhcmVuJ3QgdHJhbnNmZXJyZWQgZnJvbSBhIHByaW9yIGNhbGwgYW5kIHN0YXJ0IHZhbHVlcyB3ZXJlIG5vdCBmb3JjZWZlZCBieSB0aGUgdXNlciAobW9yZSBvbiB0aGlzIGJlbG93KSxcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGVuIHRoZSBET00gaXMgcXVlcmllZCBmb3IgdGhlIGVsZW1lbnQncyBjdXJyZW50IHZhbHVlcyBhcyBhIGxhc3QgcmVzb3J0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IENvbnZlcnNlbHksIGFuaW1hdGlvbiByZXZlcnNhbCAoYW5kIGxvb3BpbmcpICphbHdheXMqIHBlcmZvcm0gaW50ZXItY2FsbCB2YWx1ZSB0cmFuc2ZlcnM7IHRoZXkgbmV2ZXIgcmVxdWVyeSB0aGUgRE9NLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsYXN0VHdlZW5zQ29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcGVyLWVsZW1lbnQgaXNBbmltYXRpbmcgZmxhZyBpcyB1c2VkIHRvIGluZGljYXRlIHdoZXRoZXIgaXQncyBzYWZlIChpLmUuIHRoZSBkYXRhIGlzbid0IHN0YWxlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRvIHRyYW5zZmVyIG92ZXIgZW5kIHZhbHVlcyB0byB1c2UgYXMgc3RhcnQgdmFsdWVzLiBJZiBpdCdzIHNldCB0byB0cnVlIGFuZCB0aGVyZSBpcyBhIHByZXZpb3VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkgY2FsbCB0byBwdWxsIHZhbHVlcyBmcm9tLCBkbyBzby4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXIgJiYgRGF0YShlbGVtZW50KS5pc0FuaW1hdGluZyA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0VHdlZW5zQ29udGFpbmVyID0gRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgVHdlZW4gRGF0YSBDYWxjdWxhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogVGhpcyBmdW5jdGlvbiBwYXJzZXMgcHJvcGVydHkgZGF0YSBhbmQgZGVmYXVsdHMgZW5kVmFsdWUsIGVhc2luZywgYW5kIHN0YXJ0VmFsdWUgYXMgYXBwcm9wcmlhdGUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgLyogUHJvcGVydHkgbWFwIHZhbHVlcyBjYW4gZWl0aGVyIHRha2UgdGhlIGZvcm0gb2YgMSkgYSBzaW5nbGUgdmFsdWUgcmVwcmVzZW50aW5nIHRoZSBlbmQgdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgb3IgMikgYW4gYXJyYXkgaW4gdGhlIGZvcm0gb2YgWyBlbmRWYWx1ZSwgWywgZWFzaW5nXSBbLCBzdGFydFZhbHVlXSBdLlxyXG4gICAgICAgICAgICAgICAgICAgICAgIFRoZSBvcHRpb25hbCB0aGlyZCBwYXJhbWV0ZXIgaXMgYSBmb3JjZWZlZCBzdGFydFZhbHVlIHRvIGJlIHVzZWQgaW5zdGVhZCBvZiBxdWVyeWluZyB0aGUgRE9NIGZvclxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoZSBlbGVtZW50J3MgY3VycmVudCB2YWx1ZS4gUmVhZCBWZWxvY2l0eSdzIGRvY21lbnRhdGlvbiB0byBsZWFybiBtb3JlIGFib3V0IGZvcmNlZmVlZGluZzogVmVsb2NpdHlKUy5vcmcvI2ZvcmNlZmVlZGluZyAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHBhcnNlUHJvcGVydHlWYWx1ZSAodmFsdWVEYXRhLCBza2lwUmVzb2x2aW5nRWFzaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmRWYWx1ZSA9IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgdGhlIGFycmF5IGZvcm1hdCwgd2hpY2ggY2FuIGJlIHN0cnVjdHVyZWQgYXMgb25lIG9mIHRocmVlIHBvdGVudGlhbCBvdmVybG9hZHM6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEEpIFsgZW5kVmFsdWUsIGVhc2luZywgc3RhcnRWYWx1ZSBdLCBCKSBbIGVuZFZhbHVlLCBlYXNpbmcgXSwgb3IgQykgWyBlbmRWYWx1ZSwgc3RhcnRWYWx1ZSBdICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzQXJyYXkodmFsdWVEYXRhKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZW5kVmFsdWUgaXMgYWx3YXlzIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBhcnJheS4gRG9uJ3QgYm90aGVyIHZhbGlkYXRpbmcgZW5kVmFsdWUncyB2YWx1ZSBub3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNpbmNlIHRoZSBlbnN1aW5nIHByb3BlcnR5IGN5Y2xpbmcgbG9naWMgZG9lcyB0aGF0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB2YWx1ZURhdGFbMF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVHdvLWl0ZW0gYXJyYXkgZm9ybWF0OiBJZiB0aGUgc2Vjb25kIGl0ZW0gaXMgYSBudW1iZXIsIGZ1bmN0aW9uLCBvciBoZXggc3RyaW5nLCB0cmVhdCBpdCBhcyBhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydCB2YWx1ZSBzaW5jZSBlYXNpbmdzIGNhbiBvbmx5IGJlIG5vbi1oZXggc3RyaW5ncyBvciBhcnJheXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKCFUeXBlLmlzQXJyYXkodmFsdWVEYXRhWzFdKSAmJiAvXltcXGQtXS8udGVzdCh2YWx1ZURhdGFbMV0pKSB8fCBUeXBlLmlzRnVuY3Rpb24odmFsdWVEYXRhWzFdKSB8fCBDU1MuUmVnRXguaXNIZXgudGVzdCh2YWx1ZURhdGFbMV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHZhbHVlRGF0YVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFR3byBvciB0aHJlZS1pdGVtIGFycmF5OiBJZiB0aGUgc2Vjb25kIGl0ZW0gaXMgYSBub24taGV4IHN0cmluZyBvciBhbiBhcnJheSwgdHJlYXQgaXQgYXMgYW4gZWFzaW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoVHlwZS5pc1N0cmluZyh2YWx1ZURhdGFbMV0pICYmICFDU1MuUmVnRXguaXNIZXgudGVzdCh2YWx1ZURhdGFbMV0pKSB8fCBUeXBlLmlzQXJyYXkodmFsdWVEYXRhWzFdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IHNraXBSZXNvbHZpbmdFYXNpbmcgPyB2YWx1ZURhdGFbMV0gOiBnZXRFYXNpbmcodmFsdWVEYXRhWzFdLCBvcHRzLmR1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRG9uJ3QgYm90aGVyIHZhbGlkYXRpbmcgc3RhcnRWYWx1ZSdzIHZhbHVlIG5vdyBzaW5jZSB0aGUgZW5zdWluZyBwcm9wZXJ0eSBjeWNsaW5nIGxvZ2ljIGluaGVyZW50bHkgZG9lcyB0aGF0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZURhdGFbMl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gdmFsdWVEYXRhWzJdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIHRoZSBzaW5nbGUtdmFsdWUgZm9ybWF0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB2YWx1ZURhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERlZmF1bHQgdG8gdGhlIGNhbGwncyBlYXNpbmcgaWYgYSBwZXItcHJvcGVydHkgZWFzaW5nIHR5cGUgd2FzIG5vdCBkZWZpbmVkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNraXBSZXNvbHZpbmdFYXNpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZyA9IGVhc2luZyB8fCBvcHRzLmVhc2luZztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgZnVuY3Rpb25zIHdlcmUgcGFzc2VkIGluIGFzIHZhbHVlcywgcGFzcyB0aGUgZnVuY3Rpb24gdGhlIGN1cnJlbnQgZWxlbWVudCBhcyBpdHMgY29udGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgcGx1cyB0aGUgZWxlbWVudCdzIGluZGV4IGFuZCB0aGUgZWxlbWVudCBzZXQncyBzaXplIGFzIGFyZ3VtZW50cy4gVGhlbiwgYXNzaWduIHRoZSByZXR1cm5lZCB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUuaXNGdW5jdGlvbihlbmRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gZW5kVmFsdWUuY2FsbChlbGVtZW50LCBlbGVtZW50c0luZGV4LCBlbGVtZW50c0xlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlLmlzRnVuY3Rpb24oc3RhcnRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBzdGFydFZhbHVlLmNhbGwoZWxlbWVudCwgZWxlbWVudHNJbmRleCwgZWxlbWVudHNMZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBBbGxvdyBzdGFydFZhbHVlIHRvIGJlIGxlZnQgYXMgdW5kZWZpbmVkIHRvIGluZGljYXRlIHRvIHRoZSBlbnN1aW5nIGNvZGUgdGhhdCBpdHMgdmFsdWUgd2FzIG5vdCBmb3JjZWZlZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFsgZW5kVmFsdWUgfHwgMCwgZWFzaW5nLCBzdGFydFZhbHVlIF07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBDeWNsZSB0aHJvdWdoIGVhY2ggcHJvcGVydHkgaW4gdGhlIG1hcCwgbG9va2luZyBmb3Igc2hvcnRoYW5kIGNvbG9yIHByb3BlcnRpZXMgKGUuZy4gXCJjb2xvclwiIGFzIG9wcG9zZWQgdG8gXCJjb2xvclJlZFwiKS4gSW5qZWN0IHRoZSBjb3JyZXNwb25kaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgY29sb3JSZWQsIGNvbG9yR3JlZW4sIGFuZCBjb2xvckJsdWUgUkdCIGNvbXBvbmVudCB0d2VlbnMgaW50byB0aGUgcHJvcGVydGllc01hcCAod2hpY2ggVmVsb2NpdHkgdW5kZXJzdGFuZHMpIGFuZCByZW1vdmUgdGhlIHNob3J0aGFuZCBwcm9wZXJ0eS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAkLmVhY2gocHJvcGVydGllc01hcCwgZnVuY3Rpb24ocHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZpbmQgc2hvcnRoYW5kIGNvbG9yIHByb3BlcnRpZXMgdGhhdCBoYXZlIGJlZW4gcGFzc2VkIGEgaGV4IHN0cmluZy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFJlZ0V4cChcIl5cIiArIENTUy5MaXN0cy5jb2xvcnMuam9pbihcIiR8XlwiKSArIFwiJFwiKS50ZXN0KHByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUGFyc2UgdGhlIHZhbHVlIGRhdGEgZm9yIGVhY2ggc2hvcnRoYW5kLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlRGF0YSA9IHBhcnNlUHJvcGVydHlWYWx1ZSh2YWx1ZSwgdHJ1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSB2YWx1ZURhdGFbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gdmFsdWVEYXRhWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSB2YWx1ZURhdGFbMl07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5SZWdFeC5pc0hleC50ZXN0KGVuZFZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnZlcnQgdGhlIGhleCBzdHJpbmdzIGludG8gdGhlaXIgUkdCIGNvbXBvbmVudCBhcnJheXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvbG9yQ29tcG9uZW50cyA9IFsgXCJSZWRcIiwgXCJHcmVlblwiLCBcIkJsdWVcIiBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVJHQiA9IENTUy5WYWx1ZXMuaGV4VG9SZ2IoZW5kVmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlUkdCID0gc3RhcnRWYWx1ZSA/IENTUy5WYWx1ZXMuaGV4VG9SZ2Ioc3RhcnRWYWx1ZSkgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluamVjdCB0aGUgUkdCIGNvbXBvbmVudCB0d2VlbnMgaW50byBwcm9wZXJ0aWVzTWFwLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sb3JDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkYXRhQXJyYXkgPSBbIGVuZFZhbHVlUkdCW2ldIF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWFzaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXkucHVzaChlYXNpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhcnRWYWx1ZVJHQiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhQXJyYXkucHVzaChzdGFydFZhbHVlUkdCW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc01hcFtwcm9wZXJ0eSArIGNvbG9yQ29tcG9uZW50c1tpXV0gPSBkYXRhQXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIGludGVybWVkaWFyeSBzaG9ydGhhbmQgcHJvcGVydHkgZW50cnkgbm93IHRoYXQgd2UndmUgcHJvY2Vzc2VkIGl0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBwcm9wZXJ0aWVzTWFwW3Byb3BlcnR5XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBDcmVhdGUgYSB0d2VlbiBvdXQgb2YgZWFjaCBwcm9wZXJ0eSwgYW5kIGFwcGVuZCBpdHMgYXNzb2NpYXRlZCBkYXRhIHRvIHR3ZWVuc0NvbnRhaW5lci4gKi9cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiBwcm9wZXJ0aWVzTWFwKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgU3RhcnQgVmFsdWUgU291cmNpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXJzZSBvdXQgZW5kVmFsdWUsIGVhc2luZywgYW5kIHN0YXJ0VmFsdWUgZnJvbSB0aGUgcHJvcGVydHkncyBkYXRhLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWVEYXRhID0gcGFyc2VQcm9wZXJ0eVZhbHVlKHByb3BlcnRpZXNNYXBbcHJvcGVydHldKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gdmFsdWVEYXRhWzBdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gdmFsdWVEYXRhWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHZhbHVlRGF0YVsyXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdyB0aGF0IHRoZSBvcmlnaW5hbCBwcm9wZXJ0eSBuYW1lJ3MgZm9ybWF0IGhhcyBiZWVuIHVzZWQgZm9yIHRoZSBwYXJzZVByb3BlcnR5VmFsdWUoKSBsb29rdXAgYWJvdmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHdlIGZvcmNlIHRoZSBwcm9wZXJ0eSB0byBpdHMgY2FtZWxDYXNlIHN0eWxpbmcgdG8gbm9ybWFsaXplIGl0IGZvciBtYW5pcHVsYXRpb24uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5ID0gQ1NTLk5hbWVzLmNhbWVsQ2FzZShwcm9wZXJ0eSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJbiBjYXNlIHRoaXMgcHJvcGVydHkgaXMgYSBob29rLCB0aGVyZSBhcmUgY2lyY3Vtc3RhbmNlcyB3aGVyZSB3ZSB3aWxsIGludGVuZCB0byB3b3JrIG9uIHRoZSBob29rJ3Mgcm9vdCBwcm9wZXJ0eSBhbmQgbm90IHRoZSBob29rZWQgc3VicHJvcGVydHkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByb290UHJvcGVydHkgPSBDU1MuSG9va3MuZ2V0Um9vdChwcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogT3RoZXIgdGhhbiBmb3IgdGhlIGR1bW15IHR3ZWVuIHByb3BlcnR5LCBwcm9wZXJ0aWVzIHRoYXQgYXJlIG5vdCBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIgKGFuZCBkbyBub3QgaGF2ZSBhbiBhc3NvY2lhdGVkIG5vcm1hbGl6YXRpb24pIHdpbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5oZXJlbnRseSBwcm9kdWNlIG5vIHN0eWxlIGNoYW5nZXMgd2hlbiBzZXQsIHNvIHRoZXkgYXJlIHNraXBwZWQgaW4gb3JkZXIgdG8gZGVjcmVhc2UgYW5pbWF0aW9uIHRpY2sgb3ZlcmhlYWQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb3BlcnR5IHN1cHBvcnQgaXMgZGV0ZXJtaW5lZCB2aWEgcHJlZml4Q2hlY2soKSwgd2hpY2ggcmV0dXJucyBhIGZhbHNlIGZsYWcgd2hlbiBubyBzdXBwb3J0ZWQgaXMgZGV0ZWN0ZWQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNpbmNlIFNWRyBlbGVtZW50cyBoYXZlIHNvbWUgb2YgdGhlaXIgcHJvcGVydGllcyBkaXJlY3RseSBhcHBsaWVkIGFzIEhUTUwgYXR0cmlidXRlcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhlcmUgaXMgbm8gd2F5IHRvIGNoZWNrIGZvciB0aGVpciBleHBsaWNpdCBicm93c2VyIHN1cHBvcnQsIGFuZCBzbyB3ZSBza2lwIHNraXAgdGhpcyBjaGVjayBmb3IgdGhlbS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFEYXRhKGVsZW1lbnQpLmlzU1ZHICYmIHJvb3RQcm9wZXJ0eSAhPT0gXCJ0d2VlblwiICYmIENTUy5OYW1lcy5wcmVmaXhDaGVjayhyb290UHJvcGVydHkpWzFdID09PSBmYWxzZSAmJiBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtyb290UHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZykgY29uc29sZS5sb2coXCJTa2lwcGluZyBbXCIgKyByb290UHJvcGVydHkgKyBcIl0gZHVlIHRvIGEgbGFjayBvZiBicm93c2VyIHN1cHBvcnQuXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgZGlzcGxheSBvcHRpb24gaXMgYmVpbmcgc2V0IHRvIGEgbm9uLVwibm9uZVwiIChlLmcuIFwiYmxvY2tcIikgYW5kIG9wYWNpdHkgKGZpbHRlciBvbiBJRTw9OCkgaXMgYmVpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQgdG8gYW4gZW5kVmFsdWUgb2Ygbm9uLXplcm8sIHRoZSB1c2VyJ3MgaW50ZW50aW9uIGlzIHRvIGZhZGUgaW4gZnJvbSBpbnZpc2libGUsIHRodXMgd2UgZm9yY2VmZWVkIG9wYWNpdHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYSBzdGFydFZhbHVlIG9mIDAgaWYgaXRzIHN0YXJ0VmFsdWUgaGFzbid0IGFscmVhZHkgYmVlbiBzb3VyY2VkIGJ5IHZhbHVlIHRyYW5zZmVycmluZyBvciBwcmlvciBmb3JjZWZlZWRpbmcuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoKG9wdHMuZGlzcGxheSAhPT0gdW5kZWZpbmVkICYmIG9wdHMuZGlzcGxheSAhPT0gbnVsbCAmJiBvcHRzLmRpc3BsYXkgIT09IFwibm9uZVwiKSB8fCAob3B0cy52aXNpYmlsaXR5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy52aXNpYmlsaXR5ICE9PSBcImhpZGRlblwiKSkgJiYgL29wYWNpdHl8ZmlsdGVyLy50ZXN0KHByb3BlcnR5KSAmJiAhc3RhcnRWYWx1ZSAmJiBlbmRWYWx1ZSAhPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIElmIHZhbHVlcyBoYXZlIGJlZW4gdHJhbnNmZXJyZWQgZnJvbSB0aGUgcHJldmlvdXMgVmVsb2NpdHkgY2FsbCwgZXh0cmFjdCB0aGUgZW5kVmFsdWUgYW5kIHJvb3RQcm9wZXJ0eVZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciBhbGwgb2YgdGhlIGN1cnJlbnQgY2FsbCdzIHByb3BlcnRpZXMgdGhhdCB3ZXJlICphbHNvKiBhbmltYXRlZCBpbiB0aGUgcHJldmlvdXMgY2FsbC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogVmFsdWUgdHJhbnNmZXJyaW5nIGNhbiBvcHRpb25hbGx5IGJlIGRpc2FibGVkIGJ5IHRoZSB1c2VyIHZpYSB0aGUgX2NhY2hlVmFsdWVzIG9wdGlvbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMuX2NhY2hlVmFsdWVzICYmIGxhc3RUd2VlbnNDb250YWluZXIgJiYgbGFzdFR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGFydFZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gbGFzdFR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0uZW5kVmFsdWUgKyBsYXN0VHdlZW5zQ29udGFpbmVyW3Byb3BlcnR5XS51bml0VHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBUaGUgcHJldmlvdXMgY2FsbCdzIHJvb3RQcm9wZXJ0eVZhbHVlIGlzIGV4dHJhY3RlZCBmcm9tIHRoZSBlbGVtZW50J3MgZGF0YSBjYWNoZSBzaW5jZSB0aGF0J3MgdGhlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZSBvZiByb290UHJvcGVydHlWYWx1ZSB0aGF0IGdldHMgZnJlc2hseSB1cGRhdGVkIGJ5IHRoZSB0d2VlbmluZyBwcm9jZXNzLCB3aGVyZWFzIHRoZSByb290UHJvcGVydHlWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0YWNoZWQgdG8gdGhlIGluY29taW5nIGxhc3RUd2VlbnNDb250YWluZXIgaXMgZXF1YWwgdG8gdGhlIHJvb3QgcHJvcGVydHkncyB2YWx1ZSBwcmlvciB0byBhbnkgdHdlZW5pbmcuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtyb290UHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB2YWx1ZXMgd2VyZSBub3QgdHJhbnNmZXJyZWQgZnJvbSBhIHByZXZpb3VzIFZlbG9jaXR5IGNhbGwsIHF1ZXJ5IHRoZSBET00gYXMgbmVlZGVkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSGFuZGxlIGhvb2tlZCBwcm9wZXJ0aWVzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKENTUy5Ib29rcy5yZWdpc3RlcmVkW3Byb3BlcnR5XSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXJ0VmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHJvb3RQcm9wZXJ0eSk7IC8qIEdFVCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBUaGUgZm9sbG93aW5nIGdldFByb3BlcnR5VmFsdWUoKSBjYWxsIGRvZXMgbm90IGFjdHVhbGx5IHRyaWdnZXIgYSBET00gcXVlcnk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdldFByb3BlcnR5VmFsdWUoKSB3aWxsIGV4dHJhY3QgdGhlIGhvb2sgZnJvbSByb290UHJvcGVydHlWYWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIHByb3BlcnR5LCByb290UHJvcGVydHlWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgc3RhcnRWYWx1ZSBpcyBhbHJlYWR5IGRlZmluZWQgdmlhIGZvcmNlZmVlZGluZywgZG8gbm90IHF1ZXJ5IHRoZSBET00gZm9yIHRoZSByb290IHByb3BlcnR5J3MgdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdCBncmFiIHJvb3RQcm9wZXJ0eSdzIHplcm8tdmFsdWUgdGVtcGxhdGUgZnJvbSBDU1MuSG9va3MuIFRoaXMgb3ZlcndyaXRlcyB0aGUgZWxlbWVudCdzIGFjdHVhbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvb3QgcHJvcGVydHkgdmFsdWUgKGlmIG9uZSBpcyBzZXQpLCBidXQgdGhpcyBpcyBhY2NlcHRhYmxlIHNpbmNlIHRoZSBwcmltYXJ5IHJlYXNvbiB1c2VycyBmb3JjZWZlZWQgaXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0byBhdm9pZCBET00gcXVlcmllcywgYW5kIHRodXMgd2UgbGlrZXdpc2UgYXZvaWQgcXVlcnlpbmcgdGhlIERPTSBmb3IgdGhlIHJvb3QgcHJvcGVydHkncyB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBHcmFiIHRoaXMgaG9vaydzIHplcm8tdmFsdWUgdGVtcGxhdGUsIGUuZy4gXCIwcHggMHB4IDBweCBibGFja1wiLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSA9IENTUy5Ib29rcy50ZW1wbGF0ZXNbcm9vdFByb3BlcnR5XVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBIYW5kbGUgbm9uLWhvb2tlZCBwcm9wZXJ0aWVzIHRoYXQgaGF2ZW4ndCBhbHJlYWR5IGJlZW4gZGVmaW5lZCB2aWEgZm9yY2VmZWVkaW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzdGFydFZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlID0gQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgcHJvcGVydHkpOyAvKiBHRVQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFZhbHVlIERhdGEgRXh0cmFjdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzZXBhcmF0ZWRWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlVW5pdFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogU2VwYXJhdGVzIGEgcHJvcGVydHkgdmFsdWUgaW50byBpdHMgbnVtZXJpYyB2YWx1ZSBhbmQgaXRzIHVuaXQgdHlwZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gc2VwYXJhdGVWYWx1ZSAocHJvcGVydHksIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdW5pdFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bWVyaWNWYWx1ZSA9ICh2YWx1ZSB8fCBcIjBcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudG9TdHJpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50b0xvd2VyQ2FzZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogTWF0Y2ggdGhlIHVuaXQgdHlwZSBhdCB0aGUgZW5kIG9mIHRoZSB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvWyVBLXpdKyQvLCBmdW5jdGlvbihtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBHcmFiIHRoZSB1bml0IHR5cGUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRUeXBlID0gbWF0Y2g7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdHJpcCB0aGUgdW5pdCB0eXBlIG9mZiBvZiB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgbm8gdW5pdCB0eXBlIHdhcyBzdXBwbGllZCwgYXNzaWduIG9uZSB0aGF0IGlzIGFwcHJvcHJpYXRlIGZvciB0aGlzIHByb3BlcnR5IChlLmcuIFwiZGVnXCIgZm9yIHJvdGF0ZVogb3IgXCJweFwiIGZvciB3aWR0aCkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXVuaXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGUgPSBDU1MuVmFsdWVzLmdldFVuaXRUeXBlKHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gWyBudW1lcmljVmFsdWUsIHVuaXRUeXBlIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNlcGFyYXRlIHN0YXJ0VmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcGFyYXRlZFZhbHVlID0gc2VwYXJhdGVWYWx1ZShwcm9wZXJ0eSwgc3RhcnRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgPSBzZXBhcmF0ZWRWYWx1ZVswXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZVVuaXRUeXBlID0gc2VwYXJhdGVkVmFsdWVbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTZXBhcmF0ZSBlbmRWYWx1ZSwgYW5kIGV4dHJhY3QgYSB2YWx1ZSBvcGVyYXRvciAoZS5nLiBcIis9XCIsIFwiLT1cIikgaWYgb25lIGV4aXN0cy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VwYXJhdGVkVmFsdWUgPSBzZXBhcmF0ZVZhbHVlKHByb3BlcnR5LCBlbmRWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gc2VwYXJhdGVkVmFsdWVbMF0ucmVwbGFjZSgvXihbKy1cXC8qXSk9LywgZnVuY3Rpb24obWF0Y2gsIHN1Yk1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRvciA9IHN1Yk1hdGNoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFN0cmlwIHRoZSBvcGVyYXRvciBvZmYgb2YgdGhlIHZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZVVuaXRUeXBlID0gc2VwYXJhdGVkVmFsdWVbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBQYXJzZSBmbG9hdCB2YWx1ZXMgZnJvbSBlbmRWYWx1ZSBhbmQgc3RhcnRWYWx1ZS4gRGVmYXVsdCB0byAwIGlmIE5hTiBpcyByZXR1cm5lZC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSA9IHBhcnNlRmxvYXQoc3RhcnRWYWx1ZSkgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBwYXJzZUZsb2F0KGVuZFZhbHVlKSB8fCAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9wZXJ0eS1TcGVjaWZpYyBWYWx1ZSBDb252ZXJzaW9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEN1c3RvbSBzdXBwb3J0IGZvciBwcm9wZXJ0aWVzIHRoYXQgZG9uJ3QgYWN0dWFsbHkgYWNjZXB0IHRoZSAlIHVuaXQgdHlwZSwgYnV0IHdoZXJlIHBvbGx5ZmlsbGluZyBpcyB0cml2aWFsIGFuZCByZWxhdGl2ZWx5IGZvb2xwcm9vZi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVuZFZhbHVlVW5pdFR5cGUgPT09IFwiJVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBBICUtdmFsdWUgZm9udFNpemUvbGluZUhlaWdodCBpcyByZWxhdGl2ZSB0byB0aGUgcGFyZW50J3MgZm9udFNpemUgKGFzIG9wcG9zZWQgdG8gdGhlIHBhcmVudCdzIGRpbWVuc2lvbnMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggaXMgaWRlbnRpY2FsIHRvIHRoZSBlbSB1bml0J3MgYmVoYXZpb3IsIHNvIHdlIHBpZ2d5YmFjayBvZmYgb2YgdGhhdC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvXihmb250U2l6ZXxsaW5lSGVpZ2h0KSQvLnRlc3QocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogQ29udmVydCAlIGludG8gYW4gZW0gZGVjaW1hbCB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlIC8gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBcImVtXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBGb3Igc2NhbGVYIGFuZCBzY2FsZVksIGNvbnZlcnQgdGhlIHZhbHVlIGludG8gaXRzIGRlY2ltYWwgZm9ybWF0IGFuZCBzdHJpcCBvZmYgdGhlIHVuaXQgdHlwZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoL15zY2FsZS8udGVzdChwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IGVuZFZhbHVlIC8gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRm9yIFJHQiBjb21wb25lbnRzLCB0YWtlIHRoZSBkZWZpbmVkIHBlcmNlbnRhZ2Ugb2YgMjU1IGFuZCBzdHJpcCBvZmYgdGhlIHVuaXQgdHlwZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoLyhSZWR8R3JlZW58Qmx1ZSkkL2kudGVzdChwcm9wZXJ0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IChlbmRWYWx1ZSAvIDEwMCkgKiAyNTU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgVW5pdCBSYXRpbyBDYWxjdWxhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVuIHF1ZXJpZWQsIHRoZSBicm93c2VyIHJldHVybnMgKG1vc3QpIENTUyBwcm9wZXJ0eSB2YWx1ZXMgaW4gcGl4ZWxzLiBUaGVyZWZvcmUsIGlmIGFuIGVuZFZhbHVlIHdpdGggYSB1bml0IHR5cGUgb2ZcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJSwgZW0sIG9yIHJlbSBpcyBhbmltYXRlZCB0b3dhcmQsIHN0YXJ0VmFsdWUgbXVzdCBiZSBjb252ZXJ0ZWQgZnJvbSBwaXhlbHMgaW50byB0aGUgc2FtZSB1bml0IHR5cGUgYXMgZW5kVmFsdWUgaW4gb3JkZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIHZhbHVlIG1hbmlwdWxhdGlvbiBsb2dpYyAoaW5jcmVtZW50L2RlY3JlbWVudCkgdG8gcHJvY2VlZC4gRnVydGhlciwgaWYgdGhlIHN0YXJ0VmFsdWUgd2FzIGZvcmNlZmVkIG9yIHRyYW5zZmVycmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyb20gYSBwcmV2aW91cyBjYWxsLCBzdGFydFZhbHVlIG1heSBhbHNvIG5vdCBiZSBpbiBwaXhlbHMuIFVuaXQgY29udmVyc2lvbiBsb2dpYyB0aGVyZWZvcmUgY29uc2lzdHMgb2YgdHdvIHN0ZXBzOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAxKSBDYWxjdWxhdGluZyB0aGUgcmF0aW8gb2YgJS9lbS9yZW0vdmgvdncgcmVsYXRpdmUgdG8gcGl4ZWxzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDIpIENvbnZlcnRpbmcgc3RhcnRWYWx1ZSBpbnRvIHRoZSBzYW1lIHVuaXQgb2YgbWVhc3VyZW1lbnQgYXMgZW5kVmFsdWUgYmFzZWQgb24gdGhlc2UgcmF0aW9zLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBVbml0IGNvbnZlcnNpb24gcmF0aW9zIGFyZSBjYWxjdWxhdGVkIGJ5IGluc2VydGluZyBhIHNpYmxpbmcgbm9kZSBuZXh0IHRvIHRoZSB0YXJnZXQgbm9kZSwgY29weWluZyBvdmVyIGl0cyBwb3NpdGlvbiBwcm9wZXJ0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZyB2YWx1ZXMgd2l0aCB0aGUgdGFyZ2V0IHVuaXQgdHlwZSB0aGVuIGNvbXBhcmluZyB0aGUgcmV0dXJuZWQgcGl4ZWwgdmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEV2ZW4gaWYgb25seSBvbmUgb2YgdGhlc2UgdW5pdCB0eXBlcyBpcyBiZWluZyBhbmltYXRlZCwgYWxsIHVuaXQgcmF0aW9zIGFyZSBjYWxjdWxhdGVkIGF0IG9uY2Ugc2luY2UgdGhlIG92ZXJoZWFkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIGJhdGNoaW5nIHRoZSBTRVRzIGFuZCBHRVRzIHRvZ2V0aGVyIHVwZnJvbnQgb3V0d2VpZ2h0cyB0aGUgcG90ZW50aWFsIG92ZXJoZWFkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mIGxheW91dCB0aHJhc2hpbmcgY2F1c2VkIGJ5IHJlLXF1ZXJ5aW5nIGZvciB1bmNhbGN1bGF0ZWQgcmF0aW9zIGZvciBzdWJzZXF1ZW50bHktcHJvY2Vzc2VkIHByb3BlcnRpZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvZG86IFNoaWZ0IHRoaXMgbG9naWMgaW50byB0aGUgY2FsbHMnIGZpcnN0IHRpY2sgaW5zdGFuY2Ugc28gdGhhdCBpdCdzIHN5bmNlZCB3aXRoIFJBRi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gY2FsY3VsYXRlVW5pdFJhdGlvcyAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNhbWUgUmF0aW8gQ2hlY2tzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogVGhlIHByb3BlcnRpZXMgYmVsb3cgYXJlIHVzZWQgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGVsZW1lbnQgZGlmZmVycyBzdWZmaWNpZW50bHkgZnJvbSB0aGlzIGNhbGwnc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJldmlvdXNseSBpdGVyYXRlZCBlbGVtZW50IHRvIGFsc28gZGlmZmVyIGluIGl0cyB1bml0IGNvbnZlcnNpb24gcmF0aW9zLiBJZiB0aGUgcHJvcGVydGllcyBtYXRjaCB1cCB3aXRoIHRob3NlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiB0aGUgcHJpb3IgZWxlbWVudCwgdGhlIHByaW9yIGVsZW1lbnQncyBjb252ZXJzaW9uIHJhdGlvcyBhcmUgdXNlZC4gTGlrZSBtb3N0IG9wdGltaXphdGlvbnMgaW4gVmVsb2NpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzIGlzIGRvbmUgdG8gbWluaW1pemUgRE9NIHF1ZXJ5aW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNhbWVSYXRpb0luZGljYXRvcnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG15UGFyZW50OiBlbGVtZW50LnBhcmVudE5vZGUgfHwgZG9jdW1lbnQuYm9keSwgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBDU1MuZ2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInBvc2l0aW9uXCIpLCAvKiBHRVQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IENTUy5nZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZm9udFNpemVcIikgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZXRlcm1pbmUgaWYgdGhlIHNhbWUgJSByYXRpbyBjYW4gYmUgdXNlZC4gJSBpcyBiYXNlZCBvbiB0aGUgZWxlbWVudCdzIHBvc2l0aW9uIHZhbHVlIGFuZCBpdHMgcGFyZW50J3Mgd2lkdGggYW5kIGhlaWdodCBkaW1lbnNpb25zLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWVQZXJjZW50UmF0aW8gPSAoKHNhbWVSYXRpb0luZGljYXRvcnMucG9zaXRpb24gPT09IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBvc2l0aW9uKSAmJiAoc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudCA9PT0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UGFyZW50KSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRGV0ZXJtaW5lIGlmIHRoZSBzYW1lIGVtIHJhdGlvIGNhbiBiZSB1c2VkLiBlbSBpcyByZWxhdGl2ZSB0byB0aGUgZWxlbWVudCdzIGZvbnRTaXplLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhbWVFbVJhdGlvID0gKHNhbWVSYXRpb0luZGljYXRvcnMuZm9udFNpemUgPT09IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdEZvbnRTaXplKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTdG9yZSB0aGVzZSByYXRpbyBpbmRpY2F0b3JzIGNhbGwtd2lkZSBmb3IgdGhlIG5leHQgZWxlbWVudCB0byBjb21wYXJlIGFnYWluc3QuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLmxhc3RQYXJlbnQgPSBzYW1lUmF0aW9JbmRpY2F0b3JzLm15UGFyZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0UG9zaXRpb24gPSBzYW1lUmF0aW9JbmRpY2F0b3JzLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0Rm9udFNpemUgPSBzYW1lUmF0aW9JbmRpY2F0b3JzLmZvbnRTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVsZW1lbnQtU3BlY2lmaWMgVW5pdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBJRTggcm91bmRzIHRvIHRoZSBuZWFyZXN0IHBpeGVsIHdoZW4gcmV0dXJuaW5nIENTUyB2YWx1ZXMsIHRodXMgd2UgcGVyZm9ybSBjb252ZXJzaW9ucyB1c2luZyBhIG1lYXN1cmVtZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZiAxMDAgKGluc3RlYWQgb2YgMSkgdG8gZ2l2ZSBvdXIgcmF0aW9zIGEgcHJlY2lzaW9uIG9mIGF0IGxlYXN0IDIgZGVjaW1hbCB2YWx1ZXMuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbWVhc3VyZW1lbnQgPSAxMDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2FtZUVtUmF0aW8gfHwgIXNhbWVQZXJjZW50UmF0aW8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZHVtbXkgPSBEYXRhKGVsZW1lbnQpLmlzU1ZHID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJyZWN0XCIpIDogZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuaW5pdChkdW1teSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudC5hcHBlbmRDaGlsZChkdW1teSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRvIGFjY3VyYXRlbHkgYW5kIGNvbnNpc3RlbnRseSBjYWxjdWxhdGUgY29udmVyc2lvbiByYXRpb3MsIHRoZSBlbGVtZW50J3MgY2FzY2FkZWQgb3ZlcmZsb3cgYW5kIGJveC1zaXppbmcgYXJlIHN0cmlwcGVkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNpbWlsYXJseSwgc2luY2Ugd2lkdGgvaGVpZ2h0IGNhbiBiZSBhcnRpZmljaWFsbHkgY29uc3RyYWluZWQgYnkgdGhlaXIgbWluLS9tYXgtIGVxdWl2YWxlbnRzLCB0aGVzZSBhcmUgY29udHJvbGxlZCBmb3IgYXMgd2VsbC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBPdmVyZmxvdyBtdXN0IGJlIGFsc28gYmUgY29udHJvbGxlZCBmb3IgcGVyLWF4aXMgc2luY2UgdGhlIG92ZXJmbG93IHByb3BlcnR5IG92ZXJ3cml0ZXMgaXRzIHBlci1heGlzIHZhbHVlcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goWyBcIm92ZXJmbG93XCIsIFwib3ZlcmZsb3dYXCIsIFwib3ZlcmZsb3dZXCIgXSwgZnVuY3Rpb24oaSwgcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIHByb3BlcnR5LCBcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJwb3NpdGlvblwiLCBzYW1lUmF0aW9JbmRpY2F0b3JzLnBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJmb250U2l6ZVwiLCBzYW1lUmF0aW9JbmRpY2F0b3JzLmZvbnRTaXplKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJib3hTaXppbmdcIiwgXCJjb250ZW50LWJveFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogd2lkdGggYW5kIGhlaWdodCBhY3QgYXMgb3VyIHByb3h5IHByb3BlcnRpZXMgZm9yIG1lYXN1cmluZyB0aGUgaG9yaXpvbnRhbCBhbmQgdmVydGljYWwgJSByYXRpb3MuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKFsgXCJtaW5XaWR0aFwiLCBcIm1heFdpZHRoXCIsIFwid2lkdGhcIiwgXCJtaW5IZWlnaHRcIiwgXCJtYXhIZWlnaHRcIiwgXCJoZWlnaHRcIiBdLCBmdW5jdGlvbihpLCBwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5DU1Muc2V0UHJvcGVydHlWYWx1ZShkdW1teSwgcHJvcGVydHksIG1lYXN1cmVtZW50ICsgXCIlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIHBhZGRpbmdMZWZ0IGFyYml0cmFyaWx5IGFjdHMgYXMgb3VyIHByb3h5IHByb3BlcnR5IGZvciB0aGUgZW0gcmF0aW8uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkuQ1NTLnNldFByb3BlcnR5VmFsdWUoZHVtbXksIFwicGFkZGluZ0xlZnRcIiwgbWVhc3VyZW1lbnQgKyBcImVtXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEaXZpZGUgdGhlIHJldHVybmVkIHZhbHVlIGJ5IHRoZSBtZWFzdXJlbWVudCB0byBnZXQgdGhlIHJhdGlvIGJldHdlZW4gMSUgYW5kIDFweC4gRGVmYXVsdCB0byAxIHNpbmNlIHdvcmtpbmcgd2l0aCAwIGNhbiBwcm9kdWNlIEluZmluaXRlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhXaWR0aCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4V2lkdGggPSAocGFyc2VGbG9hdChDU1MuZ2V0UHJvcGVydHlWYWx1ZShkdW1teSwgXCJ3aWR0aFwiLCBudWxsLCB0cnVlKSkgfHwgMSkgLyBtZWFzdXJlbWVudDsgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5wZXJjZW50VG9QeEhlaWdodCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4SGVpZ2h0ID0gKHBhcnNlRmxvYXQoQ1NTLmdldFByb3BlcnR5VmFsdWUoZHVtbXksIFwiaGVpZ2h0XCIsIG51bGwsIHRydWUpKSB8fCAxKSAvIG1lYXN1cmVtZW50OyAvKiBHRVQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLmVtVG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdEVtVG9QeCA9IChwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGR1bW15LCBcInBhZGRpbmdMZWZ0XCIpKSB8fCAxKSAvIG1lYXN1cmVtZW50OyAvKiBHRVQgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2FtZVJhdGlvSW5kaWNhdG9ycy5teVBhcmVudC5yZW1vdmVDaGlsZChkdW1teSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MuZW1Ub1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS5sYXN0RW1Ub1B4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucGVyY2VudFRvUHhXaWR0aCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4V2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFJhdGlvcy5wZXJjZW50VG9QeEhlaWdodCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEubGFzdFBlcmNlbnRUb1B4SGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEVsZW1lbnQtQWdub3N0aWMgVW5pdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBXaGVyZWFzICUgYW5kIGVtIHJhdGlvcyBhcmUgZGV0ZXJtaW5lZCBvbiBhIHBlci1lbGVtZW50IGJhc2lzLCB0aGUgcmVtIHVuaXQgb25seSBuZWVkcyB0byBiZSBjaGVja2VkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmNlIHBlciBjYWxsIHNpbmNlIGl0J3MgZXhjbHVzaXZlbHkgZGVwZW5kYW50IHVwb24gZG9jdW1lbnQuYm9keSdzIGZvbnRTaXplLiBJZiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGF0IGNhbGN1bGF0ZVVuaXRSYXRpb3MoKSBpcyBiZWluZyBydW4gZHVyaW5nIHRoaXMgY2FsbCwgcmVtVG9QeCB3aWxsIHN0aWxsIGJlIHNldCB0byBpdHMgZGVmYXVsdCB2YWx1ZSBvZiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc28gd2UgY2FsY3VsYXRlIGl0IG5vdy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsVW5pdENvbnZlcnNpb25EYXRhLnJlbVRvUHggPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBEZWZhdWx0IHRvIGJyb3dzZXJzJyBkZWZhdWx0IGZvbnRTaXplIG9mIDE2cHggaW4gdGhlIGNhc2Ugb2YgMC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsVW5pdENvbnZlcnNpb25EYXRhLnJlbVRvUHggPSBwYXJzZUZsb2F0KENTUy5nZXRQcm9wZXJ0eVZhbHVlKGRvY3VtZW50LmJvZHksIFwiZm9udFNpemVcIikpIHx8IDE2OyAvKiBHRVQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW1pbGFybHksIHZpZXdwb3J0IHVuaXRzIGFyZSAlLXJlbGF0aXZlIHRvIHRoZSB3aW5kb3cncyBpbm5lciBkaW1lbnNpb25zLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNhbGxVbml0Q29udmVyc2lvbkRhdGEudndUb1B4ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52d1RvUHggPSBwYXJzZUZsb2F0KHdpbmRvdy5pbm5lcldpZHRoKSAvIDEwMDsgLyogR0VUICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52aFRvUHggPSBwYXJzZUZsb2F0KHdpbmRvdy5pbm5lckhlaWdodCkgLyAxMDA7IC8qIEdFVCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MucmVtVG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEucmVtVG9QeDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuaXRSYXRpb3MudndUb1B4ID0gY2FsbFVuaXRDb252ZXJzaW9uRGF0YS52d1RvUHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1bml0UmF0aW9zLnZoVG9QeCA9IGNhbGxVbml0Q29udmVyc2lvbkRhdGEudmhUb1B4O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChWZWxvY2l0eS5kZWJ1ZyA+PSAxKSBjb25zb2xlLmxvZyhcIlVuaXQgcmF0aW9zOiBcIiArIEpTT04uc3RyaW5naWZ5KHVuaXRSYXRpb3MpLCBlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5pdFJhdGlvcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFVuaXQgQ29udmVyc2lvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSAqIGFuZCAvIG9wZXJhdG9ycywgd2hpY2ggYXJlIG5vdCBwYXNzZWQgaW4gd2l0aCBhbiBhc3NvY2lhdGVkIHVuaXQsIGluaGVyZW50bHkgdXNlIHN0YXJ0VmFsdWUncyB1bml0LiBTa2lwIHZhbHVlIGFuZCB1bml0IGNvbnZlcnNpb24uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICgvW1xcLypdLy50ZXN0KG9wZXJhdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWVVbml0VHlwZSA9IHN0YXJ0VmFsdWVVbml0VHlwZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgc3RhcnRWYWx1ZSBhbmQgZW5kVmFsdWUgZGlmZmVyIGluIHVuaXQgdHlwZSwgY29udmVydCBzdGFydFZhbHVlIGludG8gdGhlIHNhbWUgdW5pdCB0eXBlIGFzIGVuZFZhbHVlIHNvIHRoYXQgaWYgZW5kVmFsdWVVbml0VHlwZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBpcyBhIHJlbGF0aXZlIHVuaXQgKCUsIGVtLCByZW0pLCB0aGUgdmFsdWVzIHNldCBkdXJpbmcgdHdlZW5pbmcgd2lsbCBjb250aW51ZSB0byBiZSBhY2N1cmF0ZWx5IHJlbGF0aXZlIGV2ZW4gaWYgdGhlIG1ldHJpY3MgdGhleSBkZXBlbmRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgb24gYXJlIGR5bmFtaWNhbGx5IGNoYW5naW5nIGR1cmluZyB0aGUgY291cnNlIG9mIHRoZSBhbmltYXRpb24uIENvbnZlcnNlbHksIGlmIHdlIGFsd2F5cyBub3JtYWxpemVkIGludG8gcHggYW5kIHVzZWQgcHggZm9yIHNldHRpbmcgdmFsdWVzLCB0aGUgcHggcmF0aW9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgd291bGQgYmVjb21lIHN0YWxlIGlmIHRoZSBvcmlnaW5hbCB1bml0IGJlaW5nIGFuaW1hdGVkIHRvd2FyZCB3YXMgcmVsYXRpdmUgYW5kIHRoZSB1bmRlcmx5aW5nIG1ldHJpY3MgY2hhbmdlIGR1cmluZyB0aGUgYW5pbWF0aW9uLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBTaW5jZSAwIGlzIDAgaW4gYW55IHVuaXQgdHlwZSwgbm8gY29udmVyc2lvbiBpcyBuZWNlc3Nhcnkgd2hlbiBzdGFydFZhbHVlIGlzIDAgLS0gd2UganVzdCBzdGFydCBhdCAwIHdpdGggZW5kVmFsdWVVbml0VHlwZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoc3RhcnRWYWx1ZVVuaXRUeXBlICE9PSBlbmRWYWx1ZVVuaXRUeXBlKSAmJiBzdGFydFZhbHVlICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBVbml0IGNvbnZlcnNpb24gaXMgYWxzbyBza2lwcGVkIHdoZW4gZW5kVmFsdWUgaXMgMCwgYnV0ICpzdGFydFZhbHVlVW5pdFR5cGUqIG11c3QgYmUgdXNlZCBmb3IgdHdlZW4gdmFsdWVzIHRvIHJlbWFpbiBhY2N1cmF0ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFNraXBwaW5nIHVuaXQgY29udmVyc2lvbiBoZXJlIG1lYW5zIHRoYXQgaWYgZW5kVmFsdWVVbml0VHlwZSB3YXMgb3JpZ2luYWxseSBhIHJlbGF0aXZlIHVuaXQsIHRoZSBhbmltYXRpb24gd29uJ3QgcmVsYXRpdmVseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2ggdGhlIHVuZGVybHlpbmcgbWV0cmljcyBpZiB0aGV5IGNoYW5nZSwgYnV0IHRoaXMgaXMgYWNjZXB0YWJsZSBzaW5jZSB3ZSdyZSBhbmltYXRpbmcgdG93YXJkIGludmlzaWJpbGl0eSBpbnN0ZWFkIG9mIHRvd2FyZCB2aXNpYmlsaXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2hpY2ggcmVtYWlucyBwYXN0IHRoZSBwb2ludCBvZiB0aGUgYW5pbWF0aW9uJ3MgY29tcGxldGlvbi4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbmRWYWx1ZSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlVW5pdFR5cGUgPSBzdGFydFZhbHVlVW5pdFR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEJ5IHRoaXMgcG9pbnQsIHdlIGNhbm5vdCBhdm9pZCB1bml0IGNvbnZlcnNpb24gKGl0J3MgdW5kZXNpcmFibGUgc2luY2UgaXQgY2F1c2VzIGxheW91dCB0aHJhc2hpbmcpLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIElmIHdlIGhhdmVuJ3QgYWxyZWFkeSwgd2UgdHJpZ2dlciBjYWxjdWxhdGVVbml0UmF0aW9zKCksIHdoaWNoIHJ1bnMgb25jZSBwZXIgZWxlbWVudCBwZXIgY2FsbC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhID0gZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YSB8fCBjYWxjdWxhdGVVbml0UmF0aW9zKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFRoZSBmb2xsb3dpbmcgUmVnRXggbWF0Y2hlcyBDU1MgcHJvcGVydGllcyB0aGF0IGhhdmUgdGhlaXIgJSB2YWx1ZXMgbWVhc3VyZWQgcmVsYXRpdmUgdG8gdGhlIHgtYXhpcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBOb3RlOiBXM0Mgc3BlYyBtYW5kYXRlcyB0aGF0IGFsbCBvZiBtYXJnaW4gYW5kIHBhZGRpbmcncyBwcm9wZXJ0aWVzIChldmVuIHRvcCBhbmQgYm90dG9tKSBhcmUgJS1yZWxhdGl2ZSB0byB0aGUgKndpZHRoKiBvZiB0aGUgcGFyZW50IGVsZW1lbnQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF4aXMgPSAoL21hcmdpbnxwYWRkaW5nfGxlZnR8cmlnaHR8d2lkdGh8dGV4dHx3b3JkfGxldHRlci9pLnRlc3QocHJvcGVydHkpIHx8IC9YJC8udGVzdChwcm9wZXJ0eSkgfHwgcHJvcGVydHkgPT09IFwieFwiKSA/IFwieFwiIDogXCJ5XCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEluIG9yZGVyIHRvIGF2b2lkIGdlbmVyYXRpbmcgbl4yIGJlc3Bva2UgY29udmVyc2lvbiBmdW5jdGlvbnMsIHVuaXQgY29udmVyc2lvbiBpcyBhIHR3by1zdGVwIHByb2Nlc3M6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgMSkgQ29udmVydCBzdGFydFZhbHVlIGludG8gcGl4ZWxzLiAyKSBDb252ZXJ0IHRoaXMgbmV3IHBpeGVsIHZhbHVlIGludG8gZW5kVmFsdWUncyB1bml0IHR5cGUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChzdGFydFZhbHVlVW5pdFR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIiVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IHRyYW5zbGF0ZVggYW5kIHRyYW5zbGF0ZVkgYXJlIHRoZSBvbmx5IHByb3BlcnRpZXMgdGhhdCBhcmUgJS1yZWxhdGl2ZSB0byBhbiBlbGVtZW50J3Mgb3duIGRpbWVuc2lvbnMgLS0gbm90IGl0cyBwYXJlbnQncyBkaW1lbnNpb25zLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVmVsb2NpdHkgZG9lcyBub3QgaW5jbHVkZSBhIHNwZWNpYWwgY29udmVyc2lvbiBwcm9jZXNzIHRvIGFjY291bnQgZm9yIHRoaXMgYmVoYXZpb3IuIFRoZXJlZm9yZSwgYW5pbWF0aW5nIHRyYW5zbGF0ZVgvWSBmcm9tIGEgJSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gYSBub24tJSB2YWx1ZSB3aWxsIHByb2R1Y2UgYW4gaW5jb3JyZWN0IHN0YXJ0IHZhbHVlLiBGb3J0dW5hdGVseSwgdGhpcyBzb3J0IG9mIGNyb3NzLXVuaXQgY29udmVyc2lvbiBpcyByYXJlbHkgZG9uZSBieSB1c2VycyBpbiBwcmFjdGljZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0VmFsdWUgKj0gKGF4aXMgPT09IFwieFwiID8gZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YS5wZXJjZW50VG9QeFdpZHRoIDogZWxlbWVudFVuaXRDb252ZXJzaW9uRGF0YS5wZXJjZW50VG9QeEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJweFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogcHggYWN0cyBhcyBvdXIgbWlkcG9pbnQgaW4gdGhlIHVuaXQgY29udmVyc2lvbiBwcm9jZXNzOyBkbyBub3RoaW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRWYWx1ZSAqPSBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhW3N0YXJ0VmFsdWVVbml0VHlwZSArIFwiVG9QeFwiXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEludmVydCB0aGUgcHggcmF0aW9zIHRvIGNvbnZlcnQgaW50byB0byB0aGUgdGFyZ2V0IHVuaXQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChlbmRWYWx1ZVVuaXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlICo9IDEgLyAoYXhpcyA9PT0gXCJ4XCIgPyBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4V2lkdGggOiBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhLnBlcmNlbnRUb1B4SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInB4XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBzdGFydFZhbHVlIGlzIGFscmVhZHkgaW4gcHgsIGRvIG5vdGhpbmc7IHdlJ3JlIGRvbmUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlICo9IDEgLyBlbGVtZW50VW5pdENvbnZlcnNpb25EYXRhW2VuZFZhbHVlVW5pdFR5cGUgKyBcIlRvUHhcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlbGF0aXZlIFZhbHVlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBPcGVyYXRvciBsb2dpYyBtdXN0IGJlIHBlcmZvcm1lZCBsYXN0IHNpbmNlIGl0IHJlcXVpcmVzIHVuaXQtbm9ybWFsaXplZCBzdGFydCBhbmQgZW5kIHZhbHVlcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90ZTogUmVsYXRpdmUgKnBlcmNlbnQgdmFsdWVzKiBkbyBub3QgYmVoYXZlIGhvdyBtb3N0IHBlb3BsZSB0aGluazsgd2hpbGUgb25lIHdvdWxkIGV4cGVjdCBcIis9NTAlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgdG8gaW5jcmVhc2UgdGhlIHByb3BlcnR5IDEuNXggaXRzIGN1cnJlbnQgdmFsdWUsIGl0IGluIGZhY3QgaW5jcmVhc2VzIHRoZSBwZXJjZW50IHVuaXRzIGluIGFic29sdXRlIHRlcm1zOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA1MCBwb2ludHMgaXMgYWRkZWQgb24gdG9wIG9mIHRoZSBjdXJyZW50ICUgdmFsdWUuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob3BlcmF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIrXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlICsgZW5kVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcIi1cIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmRWYWx1ZSA9IHN0YXJ0VmFsdWUgLSBlbmRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiKlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZFZhbHVlID0gc3RhcnRWYWx1ZSAqIGVuZFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCIvXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWUgPSBzdGFydFZhbHVlIC8gZW5kVmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0d2VlbnNDb250YWluZXIgUHVzaFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIENvbnN0cnVjdCB0aGUgcGVyLXByb3BlcnR5IHR3ZWVuIG9iamVjdCwgYW5kIHB1c2ggaXQgdG8gdGhlIGVsZW1lbnQncyB0d2VlbnNDb250YWluZXIuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuc0NvbnRhaW5lcltwcm9wZXJ0eV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZTogcm9vdFByb3BlcnR5VmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFydFZhbHVlOiBzdGFydFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlOiBzdGFydFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5kVmFsdWU6IGVuZFZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5pdFR5cGU6IGVuZFZhbHVlVW5pdFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LmRlYnVnKSBjb25zb2xlLmxvZyhcInR3ZWVuc0NvbnRhaW5lciAoXCIgKyBwcm9wZXJ0eSArIFwiKTogXCIgKyBKU09OLnN0cmluZ2lmeSh0d2VlbnNDb250YWluZXJbcHJvcGVydHldKSwgZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBBbG9uZyB3aXRoIGl0cyBwcm9wZXJ0eSBkYXRhLCBzdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudCBpdHNlbGYgb250byB0d2VlbnNDb250YWluZXIuICovXHJcbiAgICAgICAgICAgICAgICAgICAgdHdlZW5zQ29udGFpbmVyLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgIENhbGwgUHVzaFxyXG4gICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgLyogTm90ZTogdHdlZW5zQ29udGFpbmVyIGNhbiBiZSBlbXB0eSBpZiBhbGwgb2YgdGhlIHByb3BlcnRpZXMgaW4gdGhpcyBjYWxsJ3MgcHJvcGVydHkgbWFwIHdlcmUgc2tpcHBlZCBkdWUgdG8gbm90XHJcbiAgICAgICAgICAgICAgICAgICBiZWluZyBzdXBwb3J0ZWQgYnkgdGhlIGJyb3dzZXIuIFRoZSBlbGVtZW50IHByb3BlcnR5IGlzIHVzZWQgZm9yIGNoZWNraW5nIHRoYXQgdGhlIHR3ZWVuc0NvbnRhaW5lciBoYXMgYmVlbiBhcHBlbmRlZCB0by4gKi9cclxuICAgICAgICAgICAgICAgIGlmICh0d2VlbnNDb250YWluZXIuZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIEFwcGx5IHRoZSBcInZlbG9jaXR5LWFuaW1hdGluZ1wiIGluZGljYXRvciBjbGFzcy4gKi9cclxuICAgICAgICAgICAgICAgICAgICBDU1MuVmFsdWVzLmFkZENsYXNzKGVsZW1lbnQsIFwidmVsb2NpdHktYW5pbWF0aW5nXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBUaGUgY2FsbCBhcnJheSBob3VzZXMgdGhlIHR3ZWVuc0NvbnRhaW5lcnMgZm9yIGVhY2ggZWxlbWVudCBiZWluZyBhbmltYXRlZCBpbiB0aGUgY3VycmVudCBjYWxsLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGwucHVzaCh0d2VlbnNDb250YWluZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBTdG9yZSB0aGUgdHdlZW5zQ29udGFpbmVyIGFuZCBvcHRpb25zIGlmIHdlJ3JlIHdvcmtpbmcgb24gdGhlIGRlZmF1bHQgZWZmZWN0cyBxdWV1ZSwgc28gdGhhdCB0aGV5IGNhbiBiZSB1c2VkIGJ5IHRoZSByZXZlcnNlIGNvbW1hbmQuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMucXVldWUgPT09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXIgPSB0d2VlbnNDb250YWluZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkub3B0cyA9IG9wdHM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBTd2l0Y2ggb24gdGhlIGVsZW1lbnQncyBhbmltYXRpbmcgZmxhZy4gKi9cclxuICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLmlzQW5pbWF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogT25jZSB0aGUgZmluYWwgZWxlbWVudCBpbiB0aGlzIGNhbGwncyBlbGVtZW50IHNldCBoYXMgYmVlbiBwcm9jZXNzZWQsIHB1c2ggdGhlIGNhbGwgYXJyYXkgb250b1xyXG4gICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGZvciB0aGUgYW5pbWF0aW9uIHRpY2sgdG8gaW1tZWRpYXRlbHkgYmVnaW4gcHJvY2Vzc2luZy4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudHNJbmRleCA9PT0gZWxlbWVudHNMZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFkZCB0aGUgY3VycmVudCBjYWxsIHBsdXMgaXRzIGFzc29jaWF0ZWQgbWV0YWRhdGEgKHRoZSBlbGVtZW50IHNldCBhbmQgdGhlIGNhbGwncyBvcHRpb25zKSBvbnRvIHRoZSBnbG9iYWwgY2FsbCBjb250YWluZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIEFueXRoaW5nIG9uIHRoaXMgY2FsbCBjb250YWluZXIgaXMgc3ViamVjdGVkIHRvIHRpY2soKSBwcm9jZXNzaW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscy5wdXNoKFsgY2FsbCwgZWxlbWVudHMsIG9wdHMsIG51bGwsIHByb21pc2VEYXRhLnJlc29sdmVyIF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogSWYgdGhlIGFuaW1hdGlvbiB0aWNrIGlzbid0IHJ1bm5pbmcsIHN0YXJ0IGl0LiAoVmVsb2NpdHkgc2h1dHMgaXQgb2ZmIHdoZW4gdGhlcmUgYXJlIG5vIGFjdGl2ZSBjYWxscyB0byBwcm9jZXNzLikgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogU3RhcnQgdGhlIHRpY2sgbG9vcC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpY2soKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzSW5kZXgrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIFdoZW4gdGhlIHF1ZXVlIG9wdGlvbiBpcyBzZXQgdG8gZmFsc2UsIHRoZSBjYWxsIHNraXBzIHRoZSBlbGVtZW50J3MgcXVldWUgYW5kIGZpcmVzIGltbWVkaWF0ZWx5LiAqL1xyXG4gICAgICAgICAgICBpZiAob3B0cy5xdWV1ZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIC8qIFNpbmNlIHRoaXMgYnVpbGRRdWV1ZSBjYWxsIGRvZXNuJ3QgcmVzcGVjdCB0aGUgZWxlbWVudCdzIGV4aXN0aW5nIHF1ZXVlICh3aGljaCBpcyB3aGVyZSBhIGRlbGF5IG9wdGlvbiB3b3VsZCBoYXZlIGJlZW4gYXBwZW5kZWQpLFxyXG4gICAgICAgICAgICAgICAgICAgd2UgbWFudWFsbHkgaW5qZWN0IHRoZSBkZWxheSBwcm9wZXJ0eSBoZXJlIHdpdGggYW4gZXhwbGljaXQgc2V0VGltZW91dC4gKi9cclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLmRlbGF5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChidWlsZFF1ZXVlLCBvcHRzLmRlbGF5KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRRdWV1ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKiBPdGhlcndpc2UsIHRoZSBjYWxsIHVuZGVyZ29lcyBlbGVtZW50IHF1ZXVlaW5nIGFzIG5vcm1hbC4gKi9cclxuICAgICAgICAgICAgLyogTm90ZTogVG8gaW50ZXJvcGVyYXRlIHdpdGggalF1ZXJ5LCBWZWxvY2l0eSB1c2VzIGpRdWVyeSdzIG93biAkLnF1ZXVlKCkgc3RhY2sgZm9yIHF1ZXVpbmcgbG9naWMuICovXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkLnF1ZXVlKGVsZW1lbnQsIG9wdHMucXVldWUsIGZ1bmN0aW9uKG5leHQsIGNsZWFyUXVldWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGUgY2xlYXJRdWV1ZSBmbGFnIHdhcyBwYXNzZWQgaW4gYnkgdGhlIHN0b3AgY29tbWFuZCwgcmVzb2x2ZSB0aGlzIGNhbGwncyBwcm9taXNlLiAoUHJvbWlzZXMgY2FuIG9ubHkgYmUgcmVzb2x2ZWQgb25jZSxcclxuICAgICAgICAgICAgICAgICAgICAgICBzbyBpdCdzIGZpbmUgaWYgdGhpcyBpcyByZXBlYXRlZGx5IHRyaWdnZXJlZCBmb3IgZWFjaCBlbGVtZW50IGluIHRoZSBhc3NvY2lhdGVkIGNhbGwuKSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjbGVhclF1ZXVlID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9taXNlRGF0YS5wcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9taXNlRGF0YS5yZXNvbHZlcihlbGVtZW50cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERvIG5vdCBjb250aW51ZSB3aXRoIGFuaW1hdGlvbiBxdWV1ZWluZy4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBUaGlzIGZsYWcgaW5kaWNhdGVzIHRvIHRoZSB1cGNvbWluZyBjb21wbGV0ZUNhbGwoKSBmdW5jdGlvbiB0aGF0IHRoaXMgcXVldWUgZW50cnkgd2FzIGluaXRpYXRlZCBieSBWZWxvY2l0eS5cclxuICAgICAgICAgICAgICAgICAgICAgICBTZWUgY29tcGxldGVDYWxsKCkgZm9yIGZ1cnRoZXIgZGV0YWlscy4gKi9cclxuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgYnVpbGRRdWV1ZShuZXh0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICBBdXRvLURlcXVldWluZ1xyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAvKiBBcyBwZXIgalF1ZXJ5J3MgJC5xdWV1ZSgpIGJlaGF2aW9yLCB0byBmaXJlIHRoZSBmaXJzdCBub24tY3VzdG9tLXF1ZXVlIGVudHJ5IG9uIGFuIGVsZW1lbnQsIHRoZSBlbGVtZW50XHJcbiAgICAgICAgICAgICAgIG11c3QgYmUgZGVxdWV1ZWQgaWYgaXRzIHF1ZXVlIHN0YWNrIGNvbnNpc3RzICpzb2xlbHkqIG9mIHRoZSBjdXJyZW50IGNhbGwuIChUaGlzIGNhbiBiZSBkZXRlcm1pbmVkIGJ5IGNoZWNraW5nXHJcbiAgICAgICAgICAgICAgIGZvciB0aGUgXCJpbnByb2dyZXNzXCIgaXRlbSB0aGF0IGpRdWVyeSBwcmVwZW5kcyB0byBhY3RpdmUgcXVldWUgc3RhY2sgYXJyYXlzLikgUmVnYXJkbGVzcywgd2hlbmV2ZXIgdGhlIGVsZW1lbnQnc1xyXG4gICAgICAgICAgICAgICBxdWV1ZSBpcyBmdXJ0aGVyIGFwcGVuZGVkIHdpdGggYWRkaXRpb25hbCBpdGVtcyAtLSBpbmNsdWRpbmcgJC5kZWxheSgpJ3Mgb3IgZXZlbiAkLmFuaW1hdGUoKSBjYWxscywgdGhlIHF1ZXVlJ3NcclxuICAgICAgICAgICAgICAgZmlyc3QgZW50cnkgaXMgYXV0b21hdGljYWxseSBmaXJlZC4gVGhpcyBiZWhhdmlvciBjb250cmFzdHMgdGhhdCBvZiBjdXN0b20gcXVldWVzLCB3aGljaCBuZXZlciBhdXRvLWZpcmUuICovXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IFdoZW4gYW4gZWxlbWVudCBzZXQgaXMgYmVpbmcgc3ViamVjdGVkIHRvIGEgbm9uLXBhcmFsbGVsIFZlbG9jaXR5IGNhbGwsIHRoZSBhbmltYXRpb24gd2lsbCBub3QgYmVnaW4gdW50aWxcclxuICAgICAgICAgICAgICAgZWFjaCBvbmUgb2YgdGhlIGVsZW1lbnRzIGluIHRoZSBzZXQgaGFzIHJlYWNoZWQgdGhlIGVuZCBvZiBpdHMgaW5kaXZpZHVhbGx5IHByZS1leGlzdGluZyBxdWV1ZSBjaGFpbi4gKi9cclxuICAgICAgICAgICAgLyogTm90ZTogVW5mb3J0dW5hdGVseSwgbW9zdCBwZW9wbGUgZG9uJ3QgZnVsbHkgZ3Jhc3AgalF1ZXJ5J3MgcG93ZXJmdWwsIHlldCBxdWlya3ksICQucXVldWUoKSBmdW5jdGlvbi5cclxuICAgICAgICAgICAgICAgTGVhbiBtb3JlIGhlcmU6IGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTA1ODE1OC9jYW4tc29tZWJvZHktZXhwbGFpbi1qcXVlcnktcXVldWUtdG8tbWUgKi9cclxuICAgICAgICAgICAgaWYgKChvcHRzLnF1ZXVlID09PSBcIlwiIHx8IG9wdHMucXVldWUgPT09IFwiZnhcIikgJiYgJC5xdWV1ZShlbGVtZW50KVswXSAhPT0gXCJpbnByb2dyZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgICQuZGVxdWV1ZShlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgRWxlbWVudCBTZXQgSXRlcmF0aW9uXHJcbiAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIC8qIElmIHRoZSBcIm5vZGVUeXBlXCIgcHJvcGVydHkgZXhpc3RzIG9uIHRoZSBlbGVtZW50cyB2YXJpYWJsZSwgd2UncmUgYW5pbWF0aW5nIGEgc2luZ2xlIGVsZW1lbnQuXHJcbiAgICAgICAgICAgUGxhY2UgaXQgaW4gYW4gYXJyYXkgc28gdGhhdCAkLmVhY2goKSBjYW4gaXRlcmF0ZSBvdmVyIGl0LiAqL1xyXG4gICAgICAgICQuZWFjaChlbGVtZW50cywgZnVuY3Rpb24oaSwgZWxlbWVudCkge1xyXG4gICAgICAgICAgICAvKiBFbnN1cmUgZWFjaCBlbGVtZW50IGluIGEgc2V0IGhhcyBhIG5vZGVUeXBlIChpcyBhIHJlYWwgZWxlbWVudCkgdG8gYXZvaWQgdGhyb3dpbmcgZXJyb3JzLiAqL1xyXG4gICAgICAgICAgICBpZiAoVHlwZS5pc05vZGUoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIHByb2Nlc3NFbGVtZW50LmNhbGwoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgIE9wdGlvbjogTG9vcFxyXG4gICAgICAgICoqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgLyogVGhlIGxvb3Agb3B0aW9uIGFjY2VwdHMgYW4gaW50ZWdlciBpbmRpY2F0aW5nIGhvdyBtYW55IHRpbWVzIHRoZSBlbGVtZW50IHNob3VsZCBsb29wIGJldHdlZW4gdGhlIHZhbHVlcyBpbiB0aGVcclxuICAgICAgICAgICBjdXJyZW50IGNhbGwncyBwcm9wZXJ0aWVzIG1hcCBhbmQgdGhlIGVsZW1lbnQncyBwcm9wZXJ0eSB2YWx1ZXMgcHJpb3IgdG8gdGhpcyBjYWxsLiAqL1xyXG4gICAgICAgIC8qIE5vdGU6IFRoZSBsb29wIG9wdGlvbidzIGxvZ2ljIGlzIHBlcmZvcm1lZCBoZXJlIC0tIGFmdGVyIGVsZW1lbnQgcHJvY2Vzc2luZyAtLSBiZWNhdXNlIHRoZSBjdXJyZW50IGNhbGwgbmVlZHNcclxuICAgICAgICAgICB0byB1bmRlcmdvIGl0cyBxdWV1ZSBpbnNlcnRpb24gcHJpb3IgdG8gdGhlIGxvb3Agb3B0aW9uIGdlbmVyYXRpbmcgaXRzIHNlcmllcyBvZiBjb25zdGl0dWVudCBcInJldmVyc2VcIiBjYWxscyxcclxuICAgICAgICAgICB3aGljaCBjaGFpbiBhZnRlciB0aGUgY3VycmVudCBjYWxsLiBUd28gcmV2ZXJzZSBjYWxscyAodHdvIFwiYWx0ZXJuYXRpb25zXCIpIGNvbnN0aXR1dGUgb25lIGxvb3AuICovXHJcbiAgICAgICAgdmFyIG9wdHMgPSAkLmV4dGVuZCh7fSwgVmVsb2NpdHkuZGVmYXVsdHMsIG9wdGlvbnMpLFxyXG4gICAgICAgICAgICByZXZlcnNlQ2FsbHNDb3VudDtcclxuXHJcbiAgICAgICAgb3B0cy5sb29wID0gcGFyc2VJbnQob3B0cy5sb29wKTtcclxuICAgICAgICByZXZlcnNlQ2FsbHNDb3VudCA9IChvcHRzLmxvb3AgKiAyKSAtIDE7XHJcblxyXG4gICAgICAgIGlmIChvcHRzLmxvb3ApIHtcclxuICAgICAgICAgICAgLyogRG91YmxlIHRoZSBsb29wIGNvdW50IHRvIGNvbnZlcnQgaXQgaW50byBpdHMgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIFwicmV2ZXJzZVwiIGNhbGxzLlxyXG4gICAgICAgICAgICAgICBTdWJ0cmFjdCAxIGZyb20gdGhlIHJlc3VsdGluZyB2YWx1ZSBzaW5jZSB0aGUgY3VycmVudCBjYWxsIGlzIGluY2x1ZGVkIGluIHRoZSB0b3RhbCBhbHRlcm5hdGlvbiBjb3VudC4gKi9cclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCByZXZlcnNlQ2FsbHNDb3VudDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAvKiBTaW5jZSB0aGUgbG9naWMgZm9yIHRoZSByZXZlcnNlIGFjdGlvbiBvY2N1cnMgaW5zaWRlIFF1ZXVlaW5nIGFuZCB0aGVyZWZvcmUgdGhpcyBjYWxsJ3Mgb3B0aW9ucyBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgIGlzbid0IHBhcnNlZCB1bnRpbCB0aGVuIGFzIHdlbGwsIHRoZSBjdXJyZW50IGNhbGwncyBkZWxheSBvcHRpb24gbXVzdCBiZSBleHBsaWNpdGx5IHBhc3NlZCBpbnRvIHRoZSByZXZlcnNlXHJcbiAgICAgICAgICAgICAgICAgICBjYWxsIHNvIHRoYXQgdGhlIGRlbGF5IGxvZ2ljIHRoYXQgb2NjdXJzIGluc2lkZSAqUHJlLVF1ZXVlaW5nKiBjYW4gcHJvY2VzcyBpdC4gKi9cclxuICAgICAgICAgICAgICAgIHZhciByZXZlcnNlT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxheTogb3B0cy5kZWxheSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9ncmVzczogb3B0cy5wcm9ncmVzc1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBJZiBhIGNvbXBsZXRlIGNhbGxiYWNrIHdhcyBwYXNzZWQgaW50byB0aGlzIGNhbGwsIHRyYW5zZmVyIGl0IHRvIHRoZSBsb29wIHJlZGlyZWN0J3MgZmluYWwgXCJyZXZlcnNlXCIgY2FsbFxyXG4gICAgICAgICAgICAgICAgICAgc28gdGhhdCBpdCdzIHRyaWdnZXJlZCB3aGVuIHRoZSBlbnRpcmUgcmVkaXJlY3QgaXMgY29tcGxldGUgKGFuZCBub3Qgd2hlbiB0aGUgdmVyeSBmaXJzdCBhbmltYXRpb24gaXMgY29tcGxldGUpLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPT09IHJldmVyc2VDYWxsc0NvdW50IC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldmVyc2VPcHRpb25zLmRpc3BsYXkgPSBvcHRzLmRpc3BsYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV2ZXJzZU9wdGlvbnMudmlzaWJpbGl0eSA9IG9wdHMudmlzaWJpbGl0eTtcclxuICAgICAgICAgICAgICAgICAgICByZXZlcnNlT3B0aW9ucy5jb21wbGV0ZSA9IG9wdHMuY29tcGxldGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgYW5pbWF0ZShlbGVtZW50cywgXCJyZXZlcnNlXCIsIHJldmVyc2VPcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICBDaGFpbmluZ1xyXG4gICAgICAgICoqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgLyogUmV0dXJuIHRoZSBlbGVtZW50cyBiYWNrIHRvIHRoZSBjYWxsIGNoYWluLCB3aXRoIHdyYXBwZWQgZWxlbWVudHMgdGFraW5nIHByZWNlZGVuY2UgaW4gY2FzZSBWZWxvY2l0eSB3YXMgY2FsbGVkIHZpYSB0aGUgJC5mbi4gZXh0ZW5zaW9uLiAqL1xyXG4gICAgICAgIHJldHVybiBnZXRDaGFpbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKiBUdXJuIFZlbG9jaXR5IGludG8gdGhlIGFuaW1hdGlvbiBmdW5jdGlvbiwgZXh0ZW5kZWQgd2l0aCB0aGUgcHJlLWV4aXN0aW5nIFZlbG9jaXR5IG9iamVjdC4gKi9cclxuICAgIFZlbG9jaXR5ID0gJC5leHRlbmQoYW5pbWF0ZSwgVmVsb2NpdHkpO1xyXG4gICAgLyogRm9yIGxlZ2FjeSBzdXBwb3J0LCBhbHNvIGV4cG9zZSB0aGUgbGl0ZXJhbCBhbmltYXRlIG1ldGhvZC4gKi9cclxuICAgIFZlbG9jaXR5LmFuaW1hdGUgPSBhbmltYXRlO1xyXG5cclxuICAgIC8qKioqKioqKioqKioqKlxyXG4gICAgICAgIFRpbWluZ1xyXG4gICAgKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLyogVGlja2VyIGZ1bmN0aW9uLiAqL1xyXG4gICAgdmFyIHRpY2tlciA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgckFGU2hpbTtcclxuXHJcbiAgICAvKiBJbmFjdGl2ZSBicm93c2VyIHRhYnMgcGF1c2UgckFGLCB3aGljaCByZXN1bHRzIGluIGFsbCBhY3RpdmUgYW5pbWF0aW9ucyBpbW1lZGlhdGVseSBzcHJpbnRpbmcgdG8gdGhlaXIgY29tcGxldGlvbiBzdGF0ZXMgd2hlbiB0aGUgdGFiIHJlZm9jdXNlcy5cclxuICAgICAgIFRvIGdldCBhcm91bmQgdGhpcywgd2UgZHluYW1pY2FsbHkgc3dpdGNoIHJBRiB0byBzZXRUaW1lb3V0ICh3aGljaCB0aGUgYnJvd3NlciAqZG9lc24ndCogcGF1c2UpIHdoZW4gdGhlIHRhYiBsb3NlcyBmb2N1cy4gV2Ugc2tpcCB0aGlzIGZvciBtb2JpbGVcclxuICAgICAgIGRldmljZXMgdG8gYXZvaWQgd2FzdGluZyBiYXR0ZXJ5IHBvd2VyIG9uIGluYWN0aXZlIHRhYnMuICovXHJcbiAgICAvKiBOb3RlOiBUYWIgZm9jdXMgZGV0ZWN0aW9uIGRvZXNuJ3Qgd29yayBvbiBvbGRlciB2ZXJzaW9ucyBvZiBJRSwgYnV0IHRoYXQncyBva2F5IHNpbmNlIHRoZXkgZG9uJ3Qgc3VwcG9ydCByQUYgdG8gYmVnaW4gd2l0aC4gKi9cclxuICAgIGlmICghVmVsb2NpdHkuU3RhdGUuaXNNb2JpbGUgJiYgZG9jdW1lbnQuaGlkZGVuICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwidmlzaWJpbGl0eWNoYW5nZVwiLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgLyogUmVhc3NpZ24gdGhlIHJBRiBmdW5jdGlvbiAod2hpY2ggdGhlIGdsb2JhbCB0aWNrKCkgZnVuY3Rpb24gdXNlcykgYmFzZWQgb24gdGhlIHRhYidzIGZvY3VzIHN0YXRlLiAqL1xyXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICB0aWNrZXIgPSBmdW5jdGlvbihjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIFRoZSB0aWNrIGZ1bmN0aW9uIG5lZWRzIGEgdHJ1dGh5IGZpcnN0IGFyZ3VtZW50IGluIG9yZGVyIHRvIHBhc3MgaXRzIGludGVybmFsIHRpbWVzdGFtcCBjaGVjay4gKi9cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2sodHJ1ZSkgfSwgMTYpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUaGUgckFGIGxvb3AgaGFzIGJlZW4gcGF1c2VkIGJ5IHRoZSBicm93c2VyLCBzbyB3ZSBtYW51YWxseSByZXN0YXJ0IHRoZSB0aWNrLiAqL1xyXG4gICAgICAgICAgICAgICAgdGljaygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGlja2VyID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCByQUZTaGltO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKlxyXG4gICAgICAgIFRpY2tcclxuICAgICoqKioqKioqKioqKi9cclxuXHJcbiAgICAvKiBOb3RlOiBBbGwgY2FsbHMgdG8gVmVsb2NpdHkgYXJlIHB1c2hlZCB0byB0aGUgVmVsb2NpdHkuU3RhdGUuY2FsbHMgYXJyYXksIHdoaWNoIGlzIGZ1bGx5IGl0ZXJhdGVkIHRocm91Z2ggdXBvbiBlYWNoIHRpY2suICovXHJcbiAgICBmdW5jdGlvbiB0aWNrICh0aW1lc3RhbXApIHtcclxuICAgICAgICAvKiBBbiBlbXB0eSB0aW1lc3RhbXAgYXJndW1lbnQgaW5kaWNhdGVzIHRoYXQgdGhpcyBpcyB0aGUgZmlyc3QgdGljayBvY2N1cmVuY2Ugc2luY2UgdGlja2luZyB3YXMgdHVybmVkIG9uLlxyXG4gICAgICAgICAgIFdlIGxldmVyYWdlIHRoaXMgbWV0YWRhdGEgdG8gZnVsbHkgaWdub3JlIHRoZSBmaXJzdCB0aWNrIHBhc3Mgc2luY2UgUkFGJ3MgaW5pdGlhbCBwYXNzIGlzIGZpcmVkIHdoZW5ldmVyXHJcbiAgICAgICAgICAgdGhlIGJyb3dzZXIncyBuZXh0IHRpY2sgc3luYyB0aW1lIG9jY3Vycywgd2hpY2ggcmVzdWx0cyBpbiB0aGUgZmlyc3QgZWxlbWVudHMgc3ViamVjdGVkIHRvIFZlbG9jaXR5XHJcbiAgICAgICAgICAgY2FsbHMgYmVpbmcgYW5pbWF0ZWQgb3V0IG9mIHN5bmMgd2l0aCBhbnkgZWxlbWVudHMgYW5pbWF0ZWQgaW1tZWRpYXRlbHkgdGhlcmVhZnRlci4gSW4gc2hvcnQsIHdlIGlnbm9yZVxyXG4gICAgICAgICAgIHRoZSBmaXJzdCBSQUYgdGljayBwYXNzIHNvIHRoYXQgZWxlbWVudHMgYmVpbmcgaW1tZWRpYXRlbHkgY29uc2VjdXRpdmVseSBhbmltYXRlZCAtLSBpbnN0ZWFkIG9mIHNpbXVsdGFuZW91c2x5IGFuaW1hdGVkXHJcbiAgICAgICAgICAgYnkgdGhlIHNhbWUgVmVsb2NpdHkgY2FsbCAtLSBhcmUgcHJvcGVybHkgYmF0Y2hlZCBpbnRvIHRoZSBzYW1lIGluaXRpYWwgUkFGIHRpY2sgYW5kIGNvbnNlcXVlbnRseSByZW1haW4gaW4gc3luYyB0aGVyZWFmdGVyLiAqL1xyXG4gICAgICAgIGlmICh0aW1lc3RhbXApIHtcclxuICAgICAgICAgICAgLyogV2UgaWdub3JlIFJBRidzIGhpZ2ggcmVzb2x1dGlvbiB0aW1lc3RhbXAgc2luY2UgaXQgY2FuIGJlIHNpZ25pZmljYW50bHkgb2Zmc2V0IHdoZW4gdGhlIGJyb3dzZXIgaXNcclxuICAgICAgICAgICAgICAgdW5kZXIgaGlnaCBzdHJlc3M7IHdlIG9wdCBmb3IgY2hvcHBpbmVzcyBvdmVyIGFsbG93aW5nIHRoZSBicm93c2VyIHRvIGRyb3AgaHVnZSBjaHVua3Mgb2YgZnJhbWVzLiAqL1xyXG4gICAgICAgICAgICB2YXIgdGltZUN1cnJlbnQgPSAobmV3IERhdGUpLmdldFRpbWUoKTtcclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBDYWxsIEl0ZXJhdGlvblxyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgIHZhciBjYWxsc0xlbmd0aCA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8qIFRvIHNwZWVkIHVwIGl0ZXJhdGluZyBvdmVyIHRoaXMgYXJyYXksIGl0IGlzIGNvbXBhY3RlZCAoZmFsc2V5IGl0ZW1zIC0tIGNhbGxzIHRoYXQgaGF2ZSBjb21wbGV0ZWQgLS0gYXJlIHJlbW92ZWQpXHJcbiAgICAgICAgICAgICAgIHdoZW4gaXRzIGxlbmd0aCBoYXMgYmFsbG9vbmVkIHRvIGEgcG9pbnQgdGhhdCBjYW4gaW1wYWN0IHRpY2sgcGVyZm9ybWFuY2UuIFRoaXMgb25seSBiZWNvbWVzIG5lY2Vzc2FyeSB3aGVuIGFuaW1hdGlvblxyXG4gICAgICAgICAgICAgICBoYXMgYmVlbiBjb250aW51b3VzIHdpdGggbWFueSBlbGVtZW50cyBvdmVyIGEgbG9uZyBwZXJpb2Qgb2YgdGltZTsgd2hlbmV2ZXIgYWxsIGFjdGl2ZSBjYWxscyBhcmUgY29tcGxldGVkLCBjb21wbGV0ZUNhbGwoKSBjbGVhcnMgVmVsb2NpdHkuU3RhdGUuY2FsbHMuICovXHJcbiAgICAgICAgICAgIGlmIChjYWxsc0xlbmd0aCA+IDEwMDAwKSB7XHJcbiAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxscyA9IGNvbXBhY3RTcGFyc2VBcnJheShWZWxvY2l0eS5TdGF0ZS5jYWxscyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCBlYWNoIGFjdGl2ZSBjYWxsLiAqL1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxzTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8qIFdoZW4gYSBWZWxvY2l0eSBjYWxsIGlzIGNvbXBsZXRlZCwgaXRzIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGVudHJ5IGlzIHNldCB0byBmYWxzZS4gQ29udGludWUgb24gdG8gdGhlIG5leHQgY2FsbC4gKi9cclxuICAgICAgICAgICAgICAgIGlmICghVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICBDYWxsLVdpZGUgVmFyaWFibGVzXHJcbiAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxDb250YWluZXIgPSBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXSxcclxuICAgICAgICAgICAgICAgICAgICBjYWxsID0gY2FsbENvbnRhaW5lclswXSxcclxuICAgICAgICAgICAgICAgICAgICBvcHRzID0gY2FsbENvbnRhaW5lclsyXSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lU3RhcnQgPSBjYWxsQ29udGFpbmVyWzNdLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0VGljayA9ICEhdGltZVN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgICAgIHR3ZWVuRHVtbXlWYWx1ZSA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgLyogSWYgdGltZVN0YXJ0IGlzIHVuZGVmaW5lZCwgdGhlbiB0aGlzIGlzIHRoZSBmaXJzdCB0aW1lIHRoYXQgdGhpcyBjYWxsIGhhcyBiZWVuIHByb2Nlc3NlZCBieSB0aWNrKCkuXHJcbiAgICAgICAgICAgICAgICAgICBXZSBhc3NpZ24gdGltZVN0YXJ0IG5vdyBzbyB0aGF0IGl0cyB2YWx1ZSBpcyBhcyBjbG9zZSB0byB0aGUgcmVhbCBhbmltYXRpb24gc3RhcnQgdGltZSBhcyBwb3NzaWJsZS5cclxuICAgICAgICAgICAgICAgICAgIChDb252ZXJzZWx5LCBoYWQgdGltZVN0YXJ0IGJlZW4gZGVmaW5lZCB3aGVuIHRoaXMgY2FsbCB3YXMgYWRkZWQgdG8gVmVsb2NpdHkuU3RhdGUuY2FsbHMsIHRoZSBkZWxheVxyXG4gICAgICAgICAgICAgICAgICAgYmV0d2VlbiB0aGF0IHRpbWUgYW5kIG5vdyB3b3VsZCBjYXVzZSB0aGUgZmlyc3QgZmV3IGZyYW1lcyBvZiB0aGUgdHdlZW4gdG8gYmUgc2tpcHBlZCBzaW5jZVxyXG4gICAgICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlIGlzIGNhbGN1bGF0ZWQgcmVsYXRpdmUgdG8gdGltZVN0YXJ0LikgKi9cclxuICAgICAgICAgICAgICAgIC8qIEZ1cnRoZXIsIHN1YnRyYWN0IDE2bXMgKHRoZSBhcHByb3hpbWF0ZSByZXNvbHV0aW9uIG9mIFJBRikgZnJvbSB0aGUgY3VycmVudCB0aW1lIHZhbHVlIHNvIHRoYXQgdGhlXHJcbiAgICAgICAgICAgICAgICAgICBmaXJzdCB0aWNrIGl0ZXJhdGlvbiBpc24ndCB3YXN0ZWQgYnkgYW5pbWF0aW5nIGF0IDAlIHR3ZWVuIGNvbXBsZXRpb24sIHdoaWNoIHdvdWxkIHByb2R1Y2UgdGhlXHJcbiAgICAgICAgICAgICAgICAgICBzYW1lIHN0eWxlIHZhbHVlIGFzIHRoZSBlbGVtZW50J3MgY3VycmVudCB2YWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgIGlmICghdGltZVN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZVN0YXJ0ID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbaV1bM10gPSB0aW1lQ3VycmVudCAtIDE2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIFRoZSB0d2VlbidzIGNvbXBsZXRpb24gcGVyY2VudGFnZSBpcyByZWxhdGl2ZSB0byB0aGUgdHdlZW4ncyBzdGFydCB0aW1lLCBub3QgdGhlIHR3ZWVuJ3Mgc3RhcnQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICh3aGljaCB3b3VsZCByZXN1bHQgaW4gdW5wcmVkaWN0YWJsZSB0d2VlbiBkdXJhdGlvbnMgc2luY2UgSmF2YVNjcmlwdCdzIHRpbWVycyBhcmUgbm90IHBhcnRpY3VsYXJseSBhY2N1cmF0ZSkuXHJcbiAgICAgICAgICAgICAgICAgICBBY2NvcmRpbmdseSwgd2UgZW5zdXJlIHRoYXQgcGVyY2VudENvbXBsZXRlIGRvZXMgbm90IGV4Y2VlZCAxLiAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIHBlcmNlbnRDb21wbGV0ZSA9IE1hdGgubWluKCh0aW1lQ3VycmVudCAtIHRpbWVTdGFydCkgLyBvcHRzLmR1cmF0aW9uLCAxKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgRWxlbWVudCBJdGVyYXRpb25cclxuICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgLyogRm9yIGV2ZXJ5IGNhbGwsIGl0ZXJhdGUgdGhyb3VnaCBlYWNoIG9mIHRoZSBlbGVtZW50cyBpbiBpdHMgc2V0LiAqL1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDAsIGNhbGxMZW5ndGggPSBjYWxsLmxlbmd0aDsgaiA8IGNhbGxMZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0d2VlbnNDb250YWluZXIgPSBjYWxsW2pdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gdHdlZW5zQ29udGFpbmVyLmVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIENoZWNrIHRvIHNlZSBpZiB0aGlzIGVsZW1lbnQgaGFzIGJlZW4gZGVsZXRlZCBtaWR3YXkgdGhyb3VnaCB0aGUgYW5pbWF0aW9uIGJ5IGNoZWNraW5nIGZvciB0aGVcclxuICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZWQgZXhpc3RlbmNlIG9mIGl0cyBkYXRhIGNhY2hlLiBJZiBpdCdzIGdvbmUsIHNraXAgYW5pbWF0aW5nIHRoaXMgZWxlbWVudC4gKi9cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIURhdGEoZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtUHJvcGVydHlFeGlzdHMgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICBEaXNwbGF5ICYgVmlzaWJpbGl0eSBUb2dnbGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIHRoZSBkaXNwbGF5IG9wdGlvbiBpcyBzZXQgdG8gbm9uLVwibm9uZVwiLCBzZXQgaXQgdXBmcm9udCBzbyB0aGF0IHRoZSBlbGVtZW50IGNhbiBiZWNvbWUgdmlzaWJsZSBiZWZvcmUgdHdlZW5pbmcgYmVnaW5zLlxyXG4gICAgICAgICAgICAgICAgICAgICAgIChPdGhlcndpc2UsIGRpc3BsYXkncyBcIm5vbmVcIiB2YWx1ZSBpcyBzZXQgaW4gY29tcGxldGVDYWxsKCkgb25jZSB0aGUgYW5pbWF0aW9uIGhhcyBjb21wbGV0ZWQuKSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLmRpc3BsYXkgIT09IG51bGwgJiYgb3B0cy5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSBcImZsZXhcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZsZXhWYWx1ZXMgPSBbIFwiLXdlYmtpdC1ib3hcIiwgXCItbW96LWJveFwiLCBcIi1tcy1mbGV4Ym94XCIsIFwiLXdlYmtpdC1mbGV4XCIgXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmVhY2goZmxleFZhbHVlcywgZnVuY3Rpb24oaSwgZmxleFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIGZsZXhWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJkaXNwbGF5XCIsIG9wdHMuZGlzcGxheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBTYW1lIGdvZXMgd2l0aCB0aGUgdmlzaWJpbGl0eSBvcHRpb24sIGJ1dCBpdHMgXCJub25lXCIgZXF1aXZhbGVudCBpcyBcImhpZGRlblwiLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLnZpc2liaWxpdHkgIT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLnNldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgXCJ2aXNpYmlsaXR5XCIsIG9wdHMudmlzaWJpbGl0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgUHJvcGVydHkgSXRlcmF0aW9uXHJcbiAgICAgICAgICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBGb3IgZXZlcnkgZWxlbWVudCwgaXRlcmF0ZSB0aHJvdWdoIGVhY2ggcHJvcGVydHkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdHdlZW5zQ29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IEluIGFkZGl0aW9uIHRvIHByb3BlcnR5IHR3ZWVuIGRhdGEsIHR3ZWVuc0NvbnRhaW5lciBjb250YWlucyBhIHJlZmVyZW5jZSB0byBpdHMgYXNzb2NpYXRlZCBlbGVtZW50LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT09IFwiZWxlbWVudFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHdlZW4gPSB0d2VlbnNDb250YWluZXJbcHJvcGVydHldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBFYXNpbmcgY2FuIGVpdGhlciBiZSBhIHByZS1nZW5lcmVhdGVkIGZ1bmN0aW9uIG9yIGEgc3RyaW5nIHRoYXQgcmVmZXJlbmNlcyBhIHByZS1yZWdpc3RlcmVkIGVhc2luZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uIHRoZSBWZWxvY2l0eS5FYXNpbmdzIG9iamVjdC4gSW4gZWl0aGVyIGNhc2UsIHJldHVybiB0aGUgYXBwcm9wcmlhdGUgZWFzaW5nICpmdW5jdGlvbiouICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWFzaW5nID0gVHlwZS5pc1N0cmluZyh0d2Vlbi5lYXNpbmcpID8gVmVsb2NpdHkuRWFzaW5nc1t0d2Vlbi5lYXNpbmddIDogdHdlZW4uZWFzaW5nO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEN1cnJlbnQgVmFsdWUgQ2FsY3VsYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIGlzIHRoZSBsYXN0IHRpY2sgcGFzcyAoaWYgd2UndmUgcmVhY2hlZCAxMDAlIGNvbXBsZXRpb24gZm9yIHRoaXMgdHdlZW4pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW5zdXJlIHRoYXQgY3VycmVudFZhbHVlIGlzIGV4cGxpY2l0bHkgc2V0IHRvIGl0cyB0YXJnZXQgZW5kVmFsdWUgc28gdGhhdCBpdCdzIG5vdCBzdWJqZWN0ZWQgdG8gYW55IHJvdW5kaW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHR3ZWVuLmVuZFZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogT3RoZXJ3aXNlLCBjYWxjdWxhdGUgY3VycmVudFZhbHVlIGJhc2VkIG9uIHRoZSBjdXJyZW50IGRlbHRhIGZyb20gc3RhcnRWYWx1ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHR3ZWVuRGVsdGEgPSB0d2Vlbi5lbmRWYWx1ZSAtIHR3ZWVuLnN0YXJ0VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFZhbHVlID0gdHdlZW4uc3RhcnRWYWx1ZSArICh0d2VlbkRlbHRhICogZWFzaW5nKHBlcmNlbnRDb21wbGV0ZSwgb3B0cywgdHdlZW5EZWx0YSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiBubyB2YWx1ZSBjaGFuZ2UgaXMgb2NjdXJyaW5nLCBkb24ndCBwcm9jZWVkIHdpdGggRE9NIHVwZGF0aW5nLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmlyc3RUaWNrICYmIChjdXJyZW50VmFsdWUgPT09IHR3ZWVuLmN1cnJlbnRWYWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLmN1cnJlbnRWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBJZiB3ZSdyZSB0d2VlbmluZyBhIGZha2UgJ3R3ZWVuJyBwcm9wZXJ0eSBpbiBvcmRlciB0byBsb2cgdHJhbnNpdGlvbiB2YWx1ZXMsIHVwZGF0ZSB0aGUgb25lLXBlci1jYWxsIHZhcmlhYmxlIHNvIHRoYXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0IGNhbiBiZSBwYXNzZWQgaW50byB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2suICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgPT09IFwidHdlZW5cIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuRHVtbXlWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEhvb2tzOiBQYXJ0IElcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEZvciBob29rZWQgcHJvcGVydGllcywgdGhlIG5ld2x5LXVwZGF0ZWQgcm9vdFByb3BlcnR5VmFsdWVDYWNoZSBpcyBjYWNoZWQgb250byB0aGUgZWxlbWVudCBzbyB0aGF0IGl0IGNhbiBiZSB1c2VkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIHN1YnNlcXVlbnQgaG9va3MgaW4gdGhpcyBjYWxsIHRoYXQgYXJlIGFzc29jaWF0ZWQgd2l0aCB0aGUgc2FtZSByb290IHByb3BlcnR5LiBJZiB3ZSBkaWRuJ3QgY2FjaGUgdGhlIHVwZGF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByb290UHJvcGVydHlWYWx1ZSwgZWFjaCBzdWJzZXF1ZW50IHVwZGF0ZSB0byB0aGUgcm9vdCBwcm9wZXJ0eSBpbiB0aGlzIHRpY2sgcGFzcyB3b3VsZCByZXNldCB0aGUgcHJldmlvdXMgaG9vaydzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXBkYXRlcyB0byByb290UHJvcGVydHlWYWx1ZSBwcmlvciB0byBpbmplY3Rpb24uIEEgbmljZSBwZXJmb3JtYW5jZSBieXByb2R1Y3Qgb2Ygcm9vdFByb3BlcnR5VmFsdWUgY2FjaGluZyBpcyB0aGF0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2VxdWVudGx5IGNoYWluZWQgYW5pbWF0aW9ucyB1c2luZyB0aGUgc2FtZSBob29rUm9vdCBidXQgYSBkaWZmZXJlbnQgaG9vayBjYW4gdXNlIHRoaXMgY2FjaGVkIHJvb3RQcm9wZXJ0eVZhbHVlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuSG9va3MucmVnaXN0ZXJlZFtwcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGhvb2tSb290ID0gQ1NTLkhvb2tzLmdldFJvb3QocHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9vdFByb3BlcnR5VmFsdWVDYWNoZSA9IERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtob29rUm9vdF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocm9vdFByb3BlcnR5VmFsdWVDYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4ucm9vdFByb3BlcnR5VmFsdWUgPSByb290UHJvcGVydHlWYWx1ZUNhY2hlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRE9NIFVwZGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBzZXRQcm9wZXJ0eVZhbHVlKCkgcmV0dXJucyBhbiBhcnJheSBvZiB0aGUgcHJvcGVydHkgbmFtZSBhbmQgcHJvcGVydHkgdmFsdWUgcG9zdCBhbnkgbm9ybWFsaXphdGlvbiB0aGF0IG1heSBoYXZlIGJlZW4gcGVyZm9ybWVkLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGU6IFRvIHNvbHZlIGFuIElFPD04IHBvc2l0aW9uaW5nIGJ1ZywgdGhlIHVuaXQgdHlwZSBpcyBkcm9wcGVkIHdoZW4gc2V0dGluZyBhIHByb3BlcnR5IHZhbHVlIG9mIDAuICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkanVzdGVkU2V0RGF0YSA9IENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIC8qIFNFVCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW4uY3VycmVudFZhbHVlICsgKHBhcnNlRmxvYXQoY3VycmVudFZhbHVlKSA9PT0gMCA/IFwiXCIgOiB0d2Vlbi51bml0VHlwZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuLnJvb3RQcm9wZXJ0eVZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0d2Vlbi5zY3JvbGxEYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBIb29rczogUGFydCBJSVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdyB0aGF0IHdlIGhhdmUgdGhlIGhvb2sncyB1cGRhdGVkIHJvb3RQcm9wZXJ0eVZhbHVlICh0aGUgcG9zdC1wcm9jZXNzZWQgdmFsdWUgcHJvdmlkZWQgYnkgYWRqdXN0ZWRTZXREYXRhKSwgY2FjaGUgaXQgb250byB0aGUgZWxlbWVudC4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoQ1NTLkhvb2tzLnJlZ2lzdGVyZWRbcHJvcGVydHldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIFNpbmNlIGFkanVzdGVkU2V0RGF0YSBjb250YWlucyBub3JtYWxpemVkIGRhdGEgcmVhZHkgZm9yIERPTSB1cGRhdGluZywgdGhlIHJvb3RQcm9wZXJ0eVZhbHVlIG5lZWRzIHRvIGJlIHJlLWV4dHJhY3RlZCBmcm9tIGl0cyBub3JtYWxpemVkIGZvcm0uID8/ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZVtob29rUm9vdF0gPSBDU1MuTm9ybWFsaXphdGlvbnMucmVnaXN0ZXJlZFtob29rUm9vdF0oXCJleHRyYWN0XCIsIG51bGwsIGFkanVzdGVkU2V0RGF0YVsxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEYXRhKGVsZW1lbnQpLnJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGVbaG9va1Jvb3RdID0gYWRqdXN0ZWRTZXREYXRhWzFdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVHJhbnNmb3Jtc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRmxhZyB3aGV0aGVyIGEgdHJhbnNmb3JtIHByb3BlcnR5IGlzIGJlaW5nIGFuaW1hdGVkIHNvIHRoYXQgZmx1c2hUcmFuc2Zvcm1DYWNoZSgpIGNhbiBiZSB0cmlnZ2VyZWQgb25jZSB0aGlzIHRpY2sgcGFzcyBpcyBjb21wbGV0ZS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWRqdXN0ZWRTZXREYXRhWzBdID09PSBcInRyYW5zZm9ybVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2JpbGVIQVxyXG4gICAgICAgICAgICAgICAgICAgICoqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIG1vYmlsZUhBIGlzIGVuYWJsZWQsIHNldCB0aGUgdHJhbnNsYXRlM2QgdHJhbnNmb3JtIHRvIG51bGwgdG8gZm9yY2UgaGFyZHdhcmUgYWNjZWxlcmF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgIEl0J3Mgc2FmZSB0byBvdmVycmlkZSB0aGlzIHByb3BlcnR5IHNpbmNlIFZlbG9jaXR5IGRvZXNuJ3QgYWN0dWFsbHkgc3VwcG9ydCBpdHMgYW5pbWF0aW9uIChob29rcyBhcmUgdXNlZCBpbiBpdHMgcGxhY2UpLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcHRzLm1vYmlsZUhBKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIERvbid0IHNldCB0aGUgbnVsbCB0cmFuc2Zvcm0gaGFjayBpZiB3ZSd2ZSBhbHJlYWR5IGRvbmUgc28uICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIEFsbCBlbnRyaWVzIG9uIHRoZSB0cmFuc2Zvcm1DYWNoZSBvYmplY3QgYXJlIGxhdGVyIGNvbmNhdGVuYXRlZCBpbnRvIGEgc2luZ2xlIHRyYW5zZm9ybSBzdHJpbmcgdmlhIGZsdXNoVHJhbnNmb3JtQ2FjaGUoKS4gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGUudHJhbnNsYXRlM2QgPSBcIigwcHgsIDBweCwgMHB4KVwiO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybVByb3BlcnR5RXhpc3RzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENTUy5mbHVzaFRyYW5zZm9ybUNhY2hlKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBUaGUgbm9uLVwibm9uZVwiIGRpc3BsYXkgdmFsdWUgaXMgb25seSBhcHBsaWVkIHRvIGFuIGVsZW1lbnQgb25jZSAtLSB3aGVuIGl0cyBhc3NvY2lhdGVkIGNhbGwgaXMgZmlyc3QgdGlja2VkIHRocm91Z2guXHJcbiAgICAgICAgICAgICAgICAgICBBY2NvcmRpbmdseSwgaXQncyBzZXQgdG8gZmFsc2Ugc28gdGhhdCBpdCBpc24ndCByZS1wcm9jZXNzZWQgYnkgdGhpcyBjYWxsIGluIHRoZSBuZXh0IHRpY2suICovXHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ICE9PSB1bmRlZmluZWQgJiYgb3B0cy5kaXNwbGF5ICE9PSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzW2ldWzJdLmRpc3BsYXkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgIT09IHVuZGVmaW5lZCAmJiBvcHRzLnZpc2liaWxpdHkgIT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tpXVsyXS52aXNpYmlsaXR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogUGFzcyB0aGUgZWxlbWVudHMgYW5kIHRoZSB0aW1pbmcgZGF0YSAocGVyY2VudENvbXBsZXRlLCBtc1JlbWFpbmluZywgdGltZVN0YXJ0LCB0d2VlbkR1bW15VmFsdWUpIGludG8gdGhlIHByb2dyZXNzIGNhbGxiYWNrLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdHMucHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRzLnByb2dyZXNzLmNhbGwoY2FsbENvbnRhaW5lclsxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbENvbnRhaW5lclsxXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVyY2VudENvbXBsZXRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBNYXRoLm1heCgwLCAodGltZVN0YXJ0ICsgb3B0cy5kdXJhdGlvbikgLSB0aW1lQ3VycmVudCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVTdGFydCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5EdW1teVZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBJZiB0aGlzIGNhbGwgaGFzIGZpbmlzaGVkIHR3ZWVuaW5nLCBwYXNzIGl0cyBpbmRleCB0byBjb21wbGV0ZUNhbGwoKSB0byBoYW5kbGUgY2FsbCBjbGVhbnVwLiAqL1xyXG4gICAgICAgICAgICAgICAgaWYgKHBlcmNlbnRDb21wbGV0ZSA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlQ2FsbChpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogTm90ZTogY29tcGxldGVDYWxsKCkgc2V0cyB0aGUgaXNUaWNraW5nIGZsYWcgdG8gZmFsc2Ugd2hlbiB0aGUgbGFzdCBjYWxsIG9uIFZlbG9jaXR5LlN0YXRlLmNhbGxzIGhhcyBjb21wbGV0ZWQuICovXHJcbiAgICAgICAgaWYgKFZlbG9jaXR5LlN0YXRlLmlzVGlja2luZykge1xyXG4gICAgICAgICAgICB0aWNrZXIodGljayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICAgQ2FsbCBDb21wbGV0aW9uXHJcbiAgICAqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgIC8qIE5vdGU6IFVubGlrZSB0aWNrKCksIHdoaWNoIHByb2Nlc3NlcyBhbGwgYWN0aXZlIGNhbGxzIGF0IG9uY2UsIGNhbGwgY29tcGxldGlvbiBpcyBoYW5kbGVkIG9uIGEgcGVyLWNhbGwgYmFzaXMuICovXHJcbiAgICBmdW5jdGlvbiBjb21wbGV0ZUNhbGwgKGNhbGxJbmRleCwgaXNTdG9wcGVkKSB7XHJcbiAgICAgICAgLyogRW5zdXJlIHRoZSBjYWxsIGV4aXN0cy4gKi9cclxuICAgICAgICBpZiAoIVZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogUHVsbCB0aGUgbWV0YWRhdGEgZnJvbSB0aGUgY2FsbC4gKi9cclxuICAgICAgICB2YXIgY2FsbCA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF1bMF0sXHJcbiAgICAgICAgICAgIGVsZW1lbnRzID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XVsxXSxcclxuICAgICAgICAgICAgb3B0cyA9IFZlbG9jaXR5LlN0YXRlLmNhbGxzW2NhbGxJbmRleF1bMl0sXHJcbiAgICAgICAgICAgIHJlc29sdmVyID0gVmVsb2NpdHkuU3RhdGUuY2FsbHNbY2FsbEluZGV4XVs0XTtcclxuXHJcbiAgICAgICAgdmFyIHJlbWFpbmluZ0NhbGxzRXhpc3QgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICBFbGVtZW50IEZpbmFsaXphdGlvblxyXG4gICAgICAgICoqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBjYWxsTGVuZ3RoID0gY2FsbC5sZW5ndGg7IGkgPCBjYWxsTGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBjYWxsW2ldLmVsZW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAvKiBJZiB0aGUgdXNlciBzZXQgZGlzcGxheSB0byBcIm5vbmVcIiAoaW50ZW5kaW5nIHRvIGhpZGUgdGhlIGVsZW1lbnQpLCBzZXQgaXQgbm93IHRoYXQgdGhlIGFuaW1hdGlvbiBoYXMgY29tcGxldGVkLiAqL1xyXG4gICAgICAgICAgICAvKiBOb3RlOiBkaXNwbGF5Om5vbmUgaXNuJ3Qgc2V0IHdoZW4gY2FsbHMgYXJlIG1hbnVhbGx5IHN0b3BwZWQgKHZpYSBWZWxvY2l0eShcInN0b3BcIikuICovXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IERpc3BsYXkgZ2V0cyBpZ25vcmVkIHdpdGggXCJyZXZlcnNlXCIgY2FsbHMgYW5kIGluZmluaXRlIGxvb3BzLCBzaW5jZSB0aGlzIGJlaGF2aW9yIHdvdWxkIGJlIHVuZGVzaXJhYmxlLiAqL1xyXG4gICAgICAgICAgICBpZiAoIWlzU3RvcHBlZCAmJiAhb3B0cy5sb29wKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0cy5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIENTUy5zZXRQcm9wZXJ0eVZhbHVlKGVsZW1lbnQsIFwiZGlzcGxheVwiLCBvcHRzLmRpc3BsYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvcHRzLnZpc2liaWxpdHkgPT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBDU1Muc2V0UHJvcGVydHlWYWx1ZShlbGVtZW50LCBcInZpc2liaWxpdHlcIiwgb3B0cy52aXNpYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogSWYgdGhlIGVsZW1lbnQncyBxdWV1ZSBpcyBlbXB0eSAoaWYgb25seSB0aGUgXCJpbnByb2dyZXNzXCIgaXRlbSBpcyBsZWZ0IGF0IHBvc2l0aW9uIDApIG9yIGlmIGl0cyBxdWV1ZSBpcyBhYm91dCB0byBydW5cclxuICAgICAgICAgICAgICAgYSBub24tVmVsb2NpdHktaW5pdGlhdGVkIGVudHJ5LCB0dXJuIG9mZiB0aGUgaXNBbmltYXRpbmcgZmxhZy4gQSBub24tVmVsb2NpdHktaW5pdGlhdGllZCBxdWV1ZSBlbnRyeSdzIGxvZ2ljIG1pZ2h0IGFsdGVyXHJcbiAgICAgICAgICAgICAgIGFuIGVsZW1lbnQncyBDU1MgdmFsdWVzIGFuZCB0aGVyZWJ5IGNhdXNlIFZlbG9jaXR5J3MgY2FjaGVkIHZhbHVlIGRhdGEgdG8gZ28gc3RhbGUuIFRvIGRldGVjdCBpZiBhIHF1ZXVlIGVudHJ5IHdhcyBpbml0aWF0ZWQgYnkgVmVsb2NpdHksXHJcbiAgICAgICAgICAgICAgIHdlIGNoZWNrIGZvciB0aGUgZXhpc3RlbmNlIG9mIG91ciBzcGVjaWFsIFZlbG9jaXR5LnF1ZXVlRW50cnlGbGFnIGRlY2xhcmF0aW9uLCB3aGljaCBtaW5pZmllcnMgd29uJ3QgcmVuYW1lIHNpbmNlIHRoZSBmbGFnXHJcbiAgICAgICAgICAgICAgIGlzIGFzc2lnbmVkIHRvIGpRdWVyeSdzIGdsb2JhbCAkIG9iamVjdCBhbmQgdGh1cyBleGlzdHMgb3V0IG9mIFZlbG9jaXR5J3Mgb3duIHNjb3BlLiAqL1xyXG4gICAgICAgICAgICBpZiAob3B0cy5sb29wICE9PSB0cnVlICYmICgkLnF1ZXVlKGVsZW1lbnQpWzFdID09PSB1bmRlZmluZWQgfHwgIS9cXC52ZWxvY2l0eVF1ZXVlRW50cnlGbGFnL2kudGVzdCgkLnF1ZXVlKGVsZW1lbnQpWzFdKSkpIHtcclxuICAgICAgICAgICAgICAgIC8qIFRoZSBlbGVtZW50IG1heSBoYXZlIGJlZW4gZGVsZXRlZC4gRW5zdXJlIHRoYXQgaXRzIGRhdGEgY2FjaGUgc3RpbGwgZXhpc3RzIGJlZm9yZSBhY3Rpbmcgb24gaXQuICovXHJcbiAgICAgICAgICAgICAgICBpZiAoRGF0YShlbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAvKiBDbGVhciB0aGUgZWxlbWVudCdzIHJvb3RQcm9wZXJ0eVZhbHVlQ2FjaGUsIHdoaWNoIHdpbGwgYmVjb21lIHN0YWxlLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIERhdGEoZWxlbWVudCkucm9vdFByb3BlcnR5VmFsdWVDYWNoZSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNmb3JtSEFQcm9wZXJ0eUV4aXN0cyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIElmIGFueSAzRCB0cmFuc2Zvcm0gc3VicHJvcGVydHkgaXMgYXQgaXRzIGRlZmF1bHQgdmFsdWUgKHJlZ2FyZGxlc3Mgb2YgdW5pdCB0eXBlKSwgcmVtb3ZlIGl0LiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICQuZWFjaChDU1MuTGlzdHMudHJhbnNmb3JtczNELCBmdW5jdGlvbihpLCB0cmFuc2Zvcm1OYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSAvXnNjYWxlLy50ZXN0KHRyYW5zZm9ybU5hbWUpID8gMSA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50VmFsdWUgPSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlW3RyYW5zZm9ybU5hbWVdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkudHJhbnNmb3JtQ2FjaGVbdHJhbnNmb3JtTmFtZV0gIT09IHVuZGVmaW5lZCAmJiBuZXcgUmVnRXhwKFwiXlxcXFwoXCIgKyBkZWZhdWx0VmFsdWUgKyBcIlteLl1cIikudGVzdChjdXJyZW50VmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1IQVByb3BlcnR5RXhpc3RzID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgRGF0YShlbGVtZW50KS50cmFuc2Zvcm1DYWNoZVt0cmFuc2Zvcm1OYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBNb2JpbGUgZGV2aWNlcyBoYXZlIGhhcmR3YXJlIGFjY2VsZXJhdGlvbiByZW1vdmVkIGF0IHRoZSBlbmQgb2YgdGhlIGFuaW1hdGlvbiBpbiBvcmRlciB0byBhdm9pZCBob2dnaW5nIHRoZSBHUFUncyBtZW1vcnkuICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdHMubW9iaWxlSEEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtSEFQcm9wZXJ0eUV4aXN0cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBEYXRhKGVsZW1lbnQpLnRyYW5zZm9ybUNhY2hlLnRyYW5zbGF0ZTNkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogRmx1c2ggdGhlIHN1YnByb3BlcnR5IHJlbW92YWxzIHRvIHRoZSBET00uICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRyYW5zZm9ybUhBUHJvcGVydHlFeGlzdHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ1NTLmZsdXNoVHJhbnNmb3JtQ2FjaGUoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgdGhlIFwidmVsb2NpdHktYW5pbWF0aW5nXCIgaW5kaWNhdG9yIGNsYXNzLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIENTUy5WYWx1ZXMucmVtb3ZlQ2xhc3MoZWxlbWVudCwgXCJ2ZWxvY2l0eS1hbmltYXRpbmdcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgT3B0aW9uOiBDb21wbGV0ZVxyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgICAgICAvKiBDb21wbGV0ZSBpcyBmaXJlZCBvbmNlIHBlciBjYWxsIChub3Qgb25jZSBwZXIgZWxlbWVudCkgYW5kIGlzIHBhc3NlZCB0aGUgZnVsbCByYXcgRE9NIGVsZW1lbnQgc2V0IGFzIGJvdGggaXRzIGNvbnRleHQgYW5kIGl0cyBmaXJzdCBhcmd1bWVudC4gKi9cclxuICAgICAgICAgICAgLyogTm90ZTogQ2FsbGJhY2tzIGFyZW4ndCBmaXJlZCB3aGVuIGNhbGxzIGFyZSBtYW51YWxseSBzdG9wcGVkICh2aWEgVmVsb2NpdHkoXCJzdG9wXCIpLiAqL1xyXG4gICAgICAgICAgICBpZiAoIWlzU3RvcHBlZCAmJiBvcHRzLmNvbXBsZXRlICYmICFvcHRzLmxvb3AgJiYgKGkgPT09IGNhbGxMZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgLyogV2UgdGhyb3cgY2FsbGJhY2tzIGluIGEgc2V0VGltZW91dCBzbyB0aGF0IHRocm93biBlcnJvcnMgZG9uJ3QgaGFsdCB0aGUgZXhlY3V0aW9uIG9mIFZlbG9jaXR5IGl0c2VsZi4gKi9cclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZS5jYWxsKGVsZW1lbnRzLCBlbGVtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHRocm93IGVycm9yOyB9LCAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKipcclxuICAgICAgICAgICAgICAgUHJvbWlzZSBSZXNvbHZpbmdcclxuICAgICAgICAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgIC8qIE5vdGU6IEluZmluaXRlIGxvb3BzIGRvbid0IHJldHVybiBwcm9taXNlcy4gKi9cclxuICAgICAgICAgICAgaWYgKHJlc29sdmVyICYmIG9wdHMubG9vcCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZXIoZWxlbWVudHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBPcHRpb246IExvb3AgKEluZmluaXRlKVxyXG4gICAgICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgICAgICAgICAgaWYgKERhdGEoZWxlbWVudCkgJiYgb3B0cy5sb29wID09PSB0cnVlICYmICFpc1N0b3BwZWQpIHtcclxuICAgICAgICAgICAgICAgIC8qIElmIGEgcm90YXRlWC9ZL1ogcHJvcGVydHkgaXMgYmVpbmcgYW5pbWF0ZWQgdG8gMzYwIGRlZyB3aXRoIGxvb3A6dHJ1ZSwgc3dhcCB0d2VlbiBzdGFydC9lbmQgdmFsdWVzIHRvIGVuYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgY29udGludW91cyBpdGVyYXRpdmUgcm90YXRpb24gbG9vcGluZy4gKE90aGVyaXNlLCB0aGUgZWxlbWVudCB3b3VsZCBqdXN0IHJvdGF0ZSBiYWNrIGFuZCBmb3J0aC4pICovXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goRGF0YShlbGVtZW50KS50d2VlbnNDb250YWluZXIsIGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgdHdlZW5Db250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoL15yb3RhdGUvLnRlc3QocHJvcGVydHlOYW1lKSAmJiBwYXJzZUZsb2F0KHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlKSA9PT0gMzYwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5Db250YWluZXIuc3RhcnRWYWx1ZSA9IDM2MDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgvXmJhY2tncm91bmRQb3NpdGlvbi8udGVzdChwcm9wZXJ0eU5hbWUpICYmIHBhcnNlRmxvYXQodHdlZW5Db250YWluZXIuZW5kVmFsdWUpID09PSAxMDAgJiYgdHdlZW5Db250YWluZXIudW5pdFR5cGUgPT09IFwiJVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR3ZWVuQ29udGFpbmVyLmVuZFZhbHVlID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5Db250YWluZXIuc3RhcnRWYWx1ZSA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBWZWxvY2l0eShlbGVtZW50LCBcInJldmVyc2VcIiwgeyBsb29wOiB0cnVlLCBkZWxheTogb3B0cy5kZWxheSB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgICAgICBEZXF1ZXVlaW5nXHJcbiAgICAgICAgICAgICoqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgIC8qIEZpcmUgdGhlIG5leHQgY2FsbCBpbiB0aGUgcXVldWUgc28gbG9uZyBhcyB0aGlzIGNhbGwncyBxdWV1ZSB3YXNuJ3Qgc2V0IHRvIGZhbHNlICh0byB0cmlnZ2VyIGEgcGFyYWxsZWwgYW5pbWF0aW9uKSxcclxuICAgICAgICAgICAgICAgd2hpY2ggd291bGQgaGF2ZSBhbHJlYWR5IGNhdXNlZCB0aGUgbmV4dCBjYWxsIHRvIGZpcmUuIE5vdGU6IEV2ZW4gaWYgdGhlIGVuZCBvZiB0aGUgYW5pbWF0aW9uIHF1ZXVlIGhhcyBiZWVuIHJlYWNoZWQsXHJcbiAgICAgICAgICAgICAgICQuZGVxdWV1ZSgpIG11c3Qgc3RpbGwgYmUgY2FsbGVkIGluIG9yZGVyIHRvIGNvbXBsZXRlbHkgY2xlYXIgalF1ZXJ5J3MgYW5pbWF0aW9uIHF1ZXVlLiAqL1xyXG4gICAgICAgICAgICBpZiAob3B0cy5xdWV1ZSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICQuZGVxdWV1ZShlbGVtZW50LCBvcHRzLnF1ZXVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKioqKioqKlxyXG4gICAgICAgICAgIENhbGxzIEFycmF5IENsZWFudXBcclxuICAgICAgICAqKioqKioqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgICAgIC8qIFNpbmNlIHRoaXMgY2FsbCBpcyBjb21wbGV0ZSwgc2V0IGl0IHRvIGZhbHNlIHNvIHRoYXQgdGhlIHJBRiB0aWNrIHNraXBzIGl0LiBUaGlzIGFycmF5IGlzIGxhdGVyIGNvbXBhY3RlZCB2aWEgY29tcGFjdFNwYXJzZUFycmF5KCkuXHJcbiAgICAgICAgICAoRm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIHRoZSBjYWxsIGlzIHNldCB0byBmYWxzZSBpbnN0ZWFkIG9mIGJlaW5nIGRlbGV0ZWQgZnJvbSB0aGUgYXJyYXk6IGh0dHA6Ly93d3cuaHRtbDVyb2Nrcy5jb20vZW4vdHV0b3JpYWxzL3NwZWVkL3Y4LykgKi9cclxuICAgICAgICBWZWxvY2l0eS5TdGF0ZS5jYWxsc1tjYWxsSW5kZXhdID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8qIEl0ZXJhdGUgdGhyb3VnaCB0aGUgY2FsbHMgYXJyYXkgdG8gZGV0ZXJtaW5lIGlmIHRoaXMgd2FzIHRoZSBmaW5hbCBpbi1wcm9ncmVzcyBhbmltYXRpb24uXHJcbiAgICAgICAgICAgSWYgc28sIHNldCBhIGZsYWcgdG8gZW5kIHRpY2tpbmcgYW5kIGNsZWFyIHRoZSBjYWxscyBhcnJheS4gKi9cclxuICAgICAgICBmb3IgKHZhciBqID0gMCwgY2FsbHNMZW5ndGggPSBWZWxvY2l0eS5TdGF0ZS5jYWxscy5sZW5ndGg7IGogPCBjYWxsc0xlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChWZWxvY2l0eS5TdGF0ZS5jYWxsc1tqXSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJlbWFpbmluZ0NhbGxzRXhpc3QgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAocmVtYWluaW5nQ2FsbHNFeGlzdCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgLyogdGljaygpIHdpbGwgZGV0ZWN0IHRoaXMgZmxhZyB1cG9uIGl0cyBuZXh0IGl0ZXJhdGlvbiBhbmQgc3Vic2VxdWVudGx5IHR1cm4gaXRzZWxmIG9mZi4gKi9cclxuICAgICAgICAgICAgVmVsb2NpdHkuU3RhdGUuaXNUaWNraW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvKiBDbGVhciB0aGUgY2FsbHMgYXJyYXkgc28gdGhhdCBpdHMgbGVuZ3RoIGlzIHJlc2V0LiAqL1xyXG4gICAgICAgICAgICBkZWxldGUgVmVsb2NpdHkuU3RhdGUuY2FsbHM7XHJcbiAgICAgICAgICAgIFZlbG9jaXR5LlN0YXRlLmNhbGxzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKioqKioqKioqKioqKioqKipcclxuICAgICAgICBGcmFtZXdvcmtzXHJcbiAgICAqKioqKioqKioqKioqKioqKiovXHJcblxyXG4gICAgLyogQm90aCBqUXVlcnkgYW5kIFplcHRvIGFsbG93IHRoZWlyICQuZm4gb2JqZWN0IHRvIGJlIGV4dGVuZGVkIHRvIGFsbG93IHdyYXBwZWQgZWxlbWVudHMgdG8gYmUgc3ViamVjdGVkIHRvIHBsdWdpbiBjYWxscy5cclxuICAgICAgIElmIGVpdGhlciBmcmFtZXdvcmsgaXMgbG9hZGVkLCByZWdpc3RlciBhIFwidmVsb2NpdHlcIiBleHRlbnNpb24gcG9pbnRpbmcgdG8gVmVsb2NpdHkncyBjb3JlIGFuaW1hdGUoKSBtZXRob2QuICBWZWxvY2l0eVxyXG4gICAgICAgYWxzbyByZWdpc3RlcnMgaXRzZWxmIG9udG8gYSBnbG9iYWwgY29udGFpbmVyICh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byB8fCB3aW5kb3cpIHNvIHRoYXQgY2VydGFpbiBmZWF0dXJlcyBhcmVcclxuICAgICAgIGFjY2Vzc2libGUgYmV5b25kIGp1c3QgYSBwZXItZWxlbWVudCBzY29wZS4gVGhpcyBtYXN0ZXIgb2JqZWN0IGNvbnRhaW5zIGFuIC5hbmltYXRlKCkgbWV0aG9kLCB3aGljaCBpcyBsYXRlciBhc3NpZ25lZCB0byAkLmZuXHJcbiAgICAgICAoaWYgalF1ZXJ5IG9yIFplcHRvIGFyZSBwcmVzZW50KS4gQWNjb3JkaW5nbHksIFZlbG9jaXR5IGNhbiBib3RoIGFjdCBvbiB3cmFwcGVkIERPTSBlbGVtZW50cyBhbmQgc3RhbmQgYWxvbmUgZm9yIHRhcmdldGluZyByYXcgRE9NIGVsZW1lbnRzLiAqL1xyXG4gICAgZ2xvYmFsLlZlbG9jaXR5ID0gVmVsb2NpdHk7XHJcblxyXG4gICAgaWYgKGdsb2JhbCAhPT0gd2luZG93KSB7XHJcbiAgICAgICAgLyogQXNzaWduIHRoZSBlbGVtZW50IGZ1bmN0aW9uIHRvIFZlbG9jaXR5J3MgY29yZSBhbmltYXRlKCkgbWV0aG9kLiAqL1xyXG4gICAgICAgIGdsb2JhbC5mbi52ZWxvY2l0eSA9IGFuaW1hdGU7XHJcbiAgICAgICAgLyogQXNzaWduIHRoZSBvYmplY3QgZnVuY3Rpb24ncyBkZWZhdWx0cyB0byBWZWxvY2l0eSdzIGdsb2JhbCBkZWZhdWx0cyBvYmplY3QuICovXHJcbiAgICAgICAgZ2xvYmFsLmZuLnZlbG9jaXR5LmRlZmF1bHRzID0gVmVsb2NpdHkuZGVmYXVsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqXHJcbiAgICAgICBQYWNrYWdlZCBSZWRpcmVjdHNcclxuICAgICoqKioqKioqKioqKioqKioqKioqKioqL1xyXG5cclxuICAgIC8qIHNsaWRlVXAsIHNsaWRlRG93biAqL1xyXG4gICAgJC5lYWNoKFsgXCJEb3duXCIsIFwiVXBcIiBdLCBmdW5jdGlvbihpLCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBWZWxvY2l0eS5SZWRpcmVjdHNbXCJzbGlkZVwiICsgZGlyZWN0aW9uXSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50c0luZGV4LCBlbGVtZW50c1NpemUsIGVsZW1lbnRzLCBwcm9taXNlRGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKSxcclxuICAgICAgICAgICAgICAgIGJlZ2luID0gb3B0cy5iZWdpbixcclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlID0gb3B0cy5jb21wbGV0ZSxcclxuICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWVzID0geyBoZWlnaHQ6IFwiXCIsIG1hcmdpblRvcDogXCJcIiwgbWFyZ2luQm90dG9tOiBcIlwiLCBwYWRkaW5nVG9wOiBcIlwiLCBwYWRkaW5nQm90dG9tOiBcIlwiIH0sXHJcbiAgICAgICAgICAgICAgICBpbmxpbmVWYWx1ZXMgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgLyogU2hvdyB0aGUgZWxlbWVudCBiZWZvcmUgc2xpZGVEb3duIGJlZ2lucyBhbmQgaGlkZSB0aGUgZWxlbWVudCBhZnRlciBzbGlkZVVwIGNvbXBsZXRlcy4gKi9cclxuICAgICAgICAgICAgICAgIC8qIE5vdGU6IElubGluZSBlbGVtZW50cyBjYW5ub3QgaGF2ZSBkaW1lbnNpb25zIGFuaW1hdGVkLCBzbyB0aGV5J3JlIHJldmVydGVkIHRvIGlubGluZS1ibG9jay4gKi9cclxuICAgICAgICAgICAgICAgIG9wdHMuZGlzcGxheSA9IChkaXJlY3Rpb24gPT09IFwiRG93blwiID8gKFZlbG9jaXR5LkNTUy5WYWx1ZXMuZ2V0RGlzcGxheVR5cGUoZWxlbWVudCkgPT09IFwiaW5saW5lXCIgPyBcImlubGluZS1ibG9ja1wiIDogXCJibG9ja1wiKSA6IFwibm9uZVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3B0cy5iZWdpbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLyogSWYgdGhlIHVzZXIgcGFzc2VkIGluIGEgYmVnaW4gY2FsbGJhY2ssIGZpcmUgaXQgbm93LiAqL1xyXG4gICAgICAgICAgICAgICAgYmVnaW4gJiYgYmVnaW4uY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIENhY2hlIHRoZSBlbGVtZW50cycgb3JpZ2luYWwgdmVydGljYWwgZGltZW5zaW9uYWwgcHJvcGVydHkgdmFsdWVzIHNvIHRoYXQgd2UgY2FuIGFuaW1hdGUgYmFjayB0byB0aGVtLiAqL1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gY29tcHV0ZWRWYWx1ZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmxpbmVWYWx1ZXNbcHJvcGVydHldID0gZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8qIEZvciBzbGlkZURvd24sIHVzZSBmb3JjZWZlZWRpbmcgdG8gYW5pbWF0ZSBhbGwgdmVydGljYWwgcHJvcGVydGllcyBmcm9tIDAuIEZvciBzbGlkZVVwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIHVzZSBmb3JjZWZlZWRpbmcgdG8gc3RhcnQgZnJvbSBjb21wdXRlZCB2YWx1ZXMgYW5kIGFuaW1hdGUgZG93biB0byAwLiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eVZhbHVlID0gVmVsb2NpdHkuQ1NTLmdldFByb3BlcnR5VmFsdWUoZWxlbWVudCwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkVmFsdWVzW3Byb3BlcnR5XSA9IChkaXJlY3Rpb24gPT09IFwiRG93blwiKSA/IFsgcHJvcGVydHlWYWx1ZSwgMCBdIDogWyAwLCBwcm9wZXJ0eVZhbHVlIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLyogRm9yY2UgdmVydGljYWwgb3ZlcmZsb3cgY29udGVudCB0byBjbGlwIHNvIHRoYXQgc2xpZGluZyB3b3JrcyBhcyBleHBlY3RlZC4gKi9cclxuICAgICAgICAgICAgICAgIGlubGluZVZhbHVlcy5vdmVyZmxvdyA9IGVsZW1lbnQuc3R5bGUub3ZlcmZsb3c7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgLyogUmVzZXQgZWxlbWVudCB0byBpdHMgcHJlLXNsaWRlIGlubGluZSB2YWx1ZXMgb25jZSBpdHMgc2xpZGUgYW5pbWF0aW9uIGlzIGNvbXBsZXRlLiAqL1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gaW5saW5lVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wZXJ0eV0gPSBpbmxpbmVWYWx1ZXNbcHJvcGVydHldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8qIElmIHRoZSB1c2VyIHBhc3NlZCBpbiBhIGNvbXBsZXRlIGNhbGxiYWNrLCBmaXJlIGl0IG5vdy4gKi9cclxuICAgICAgICAgICAgICAgIGNvbXBsZXRlICYmIGNvbXBsZXRlLmNhbGwoZWxlbWVudHMsIGVsZW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIHByb21pc2VEYXRhICYmIHByb21pc2VEYXRhLnJlc29sdmVyKGVsZW1lbnRzKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIFZlbG9jaXR5KGVsZW1lbnQsIGNvbXB1dGVkVmFsdWVzLCBvcHRzKTtcclxuICAgICAgICB9O1xyXG4gICAgfSk7XHJcblxyXG4gICAgLyogZmFkZUluLCBmYWRlT3V0ICovXHJcbiAgICAkLmVhY2goWyBcIkluXCIsIFwiT3V0XCIgXSwgZnVuY3Rpb24oaSwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgVmVsb2NpdHkuUmVkaXJlY3RzW1wiZmFkZVwiICsgZGlyZWN0aW9uXSA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zLCBlbGVtZW50c0luZGV4LCBlbGVtZW50c1NpemUsIGVsZW1lbnRzLCBwcm9taXNlRGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgb3B0cyA9ICQuZXh0ZW5kKHt9LCBvcHRpb25zKSxcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNNYXAgPSB7IG9wYWNpdHk6IChkaXJlY3Rpb24gPT09IFwiSW5cIikgPyAxIDogMCB9LFxyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxDb21wbGV0ZSA9IG9wdHMuY29tcGxldGU7XHJcblxyXG4gICAgICAgICAgICAvKiBTaW5jZSByZWRpcmVjdHMgYXJlIHRyaWdnZXJlZCBpbmRpdmlkdWFsbHkgZm9yIGVhY2ggZWxlbWVudCBpbiB0aGUgYW5pbWF0ZWQgc2V0LCBhdm9pZCByZXBlYXRlZGx5IHRyaWdnZXJpbmdcclxuICAgICAgICAgICAgICAgY2FsbGJhY2tzIGJ5IGZpcmluZyB0aGVtIG9ubHkgd2hlbiB0aGUgZmluYWwgZWxlbWVudCBoYXMgYmVlbiByZWFjaGVkLiAqL1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudHNJbmRleCAhPT0gZWxlbWVudHNTaXplIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IG9wdHMuYmVnaW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgb3B0cy5jb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcmlnaW5hbENvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsQ29tcGxldGUuY2FsbChlbGVtZW50cywgZWxlbWVudHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZURhdGEgJiYgcHJvbWlzZURhdGEucmVzb2x2ZXIoZWxlbWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKiBJZiBhIGRpc3BsYXkgd2FzIHBhc3NlZCBpbiwgdXNlIGl0LiBPdGhlcndpc2UsIGRlZmF1bHQgdG8gXCJub25lXCIgZm9yIGZhZGVPdXQgb3IgdGhlIGVsZW1lbnQtc3BlY2lmaWMgZGVmYXVsdCBmb3IgZmFkZUluLiAqL1xyXG4gICAgICAgICAgICAvKiBOb3RlOiBXZSBhbGxvdyB1c2VycyB0byBwYXNzIGluIFwibnVsbFwiIHRvIHNraXAgZGlzcGxheSBzZXR0aW5nIGFsdG9nZXRoZXIuICovXHJcbiAgICAgICAgICAgIGlmIChvcHRzLmRpc3BsYXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgb3B0cy5kaXNwbGF5ID0gKGRpcmVjdGlvbiA9PT0gXCJJblwiID8gXCJhdXRvXCIgOiBcIm5vbmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIFZlbG9jaXR5KHRoaXMsIHByb3BlcnRpZXNNYXAsIG9wdHMpO1xyXG4gICAgICAgIH07XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gVmVsb2NpdHk7XHJcbn0oKHdpbmRvdy5qUXVlcnkgfHwgd2luZG93LlplcHRvIHx8IHdpbmRvdyksIHdpbmRvdywgZG9jdW1lbnQpO1xyXG59KSk7XHJcblxyXG4vKioqKioqKioqKioqKioqKioqXHJcbiAgIEtub3duIElzc3Vlc1xyXG4qKioqKioqKioqKioqKioqKiovXHJcblxyXG4vKiBUaGUgQ1NTIHNwZWMgbWFuZGF0ZXMgdGhhdCB0aGUgdHJhbnNsYXRlWC9ZL1ogdHJhbnNmb3JtcyBhcmUgJS1yZWxhdGl2ZSB0byB0aGUgZWxlbWVudCBpdHNlbGYgLS0gbm90IGl0cyBwYXJlbnQuXHJcblZlbG9jaXR5LCBob3dldmVyLCBkb2Vzbid0IG1ha2UgdGhpcyBkaXN0aW5jdGlvbi4gVGh1cywgY29udmVydGluZyB0byBvciBmcm9tIHRoZSAlIHVuaXQgd2l0aCB0aGVzZSBzdWJwcm9wZXJ0aWVzXHJcbndpbGwgcHJvZHVjZSBhbiBpbmFjY3VyYXRlIGNvbnZlcnNpb24gdmFsdWUuIFRoZSBzYW1lIGlzc3VlIGV4aXN0cyB3aXRoIHRoZSBjeC9jeSBhdHRyaWJ1dGVzIG9mIFNWRyBjaXJjbGVzIGFuZCBlbGxpcHNlcy4gKi8iLCIvKlxyXG49PSBtYWxpaHUganF1ZXJ5IGN1c3RvbSBzY3JvbGxiYXIgcGx1Z2luID09XHJcblZlcnNpb246IDMuMS4zXHJcblBsdWdpbiBVUkk6IGh0dHA6Ly9tYW5vcy5tYWxpaHUuZ3IvanF1ZXJ5LWN1c3RvbS1jb250ZW50LXNjcm9sbGVyXHJcbkF1dGhvcjogbWFsaWh1XHJcbkF1dGhvciBVUkk6IGh0dHA6Ly9tYW5vcy5tYWxpaHUuZ3JcclxuTGljZW5zZTogTUlUIExpY2Vuc2UgKE1JVClcclxuKi9cclxuXHJcbi8qXHJcbkNvcHlyaWdodCBNYW5vcyBNYWxpaHV0c2FraXMgKGVtYWlsOiBtYW5vc0BtYWxpaHUuZ3IpXHJcblxyXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcclxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xyXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcblRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qXHJcblRoZSBjb2RlIGJlbG93IGlzIGZhaXJseSBsb25nLCBmdWxseSBjb21tZW50ZWQgYW5kIHNob3VsZCBiZSBub3JtYWxseSB1c2VkIGluIGRldmVsb3BtZW50LlxyXG5Gb3IgcHJvZHVjdGlvbiwgdXNlIGVpdGhlciB0aGUgbWluaWZpZWQganF1ZXJ5Lm1DdXN0b21TY3JvbGxiYXIubWluLmpzIHNjcmlwdCBvclxyXG50aGUgcHJvZHVjdGlvbi1yZWFkeSBqcXVlcnkubUN1c3RvbVNjcm9sbGJhci5jb25jYXQubWluLmpzIHdoaWNoIGNvbnRhaW5zIHRoZSBwbHVnaW5cclxuYW5kIGRlcGVuZGVuY2llcyAobWluaWZpZWQpLlxyXG4qL1xyXG5cclxuKGZ1bmN0aW9uKGZhY3Rvcnkpe1xyXG4gICAgaWYodHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpe1xyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzPWZhY3Rvcnk7XHJcbiAgICB9ZWxzZXtcclxuICAgICAgICBmYWN0b3J5KGpRdWVyeSx3aW5kb3csZG9jdW1lbnQpO1xyXG4gICAgfVxyXG59KGZ1bmN0aW9uKCQpe1xyXG4oZnVuY3Rpb24oaW5pdCl7XHJcbiAgICB2YXIgX3Jqcz10eXBlb2YgZGVmaW5lPT09XCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQsIC8qIFJlcXVpcmVKUyAqL1xyXG4gICAgICAgIF9uanM9dHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cywgLyogTm9kZUpTICovXHJcbiAgICAgICAgX2RscD0oXCJodHRwczpcIj09ZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wpID8gXCJodHRwczpcIiA6IFwiaHR0cDpcIiwgLyogbG9jYXRpb24gcHJvdG9jb2wgKi9cclxuICAgICAgICBfdXJsPVwiY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2pxdWVyeS1tb3VzZXdoZWVsLzMuMS4xMy9qcXVlcnkubW91c2V3aGVlbC5taW4uanNcIjtcclxuICAgIGlmKCFfcmpzKXtcclxuICAgICAgICBpZihfbmpzKXtcclxuICAgICAgICAgICAgcmVxdWlyZShcImpxdWVyeS1tb3VzZXdoZWVsXCIpKCQpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAvKiBsb2FkIGpxdWVyeS1tb3VzZXdoZWVsIHBsdWdpbiAodmlhIENETikgaWYgaXQncyBub3QgcHJlc2VudCBvciBub3QgbG9hZGVkIHZpYSBSZXF1aXJlSlNcclxuICAgICAgICAgICAgKHdvcmtzIHdoZW4gbUN1c3RvbVNjcm9sbGJhciBmbiBpcyBjYWxsZWQgb24gd2luZG93IGxvYWQpICovXHJcbiAgICAgICAgICAgICQuZXZlbnQuc3BlY2lhbC5tb3VzZXdoZWVsIHx8ICQoXCJoZWFkXCIpLmFwcGVuZChkZWNvZGVVUkkoXCIlM0NzY3JpcHQgc3JjPVwiK19kbHArXCIvL1wiK191cmwrXCIlM0UlM0Mvc2NyaXB0JTNFXCIpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBpbml0KCk7XHJcbn0oZnVuY3Rpb24oKXtcclxuXHJcbiAgICAvKlxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgUExVR0lOIE5BTUVTUEFDRSwgUFJFRklYLCBERUZBVUxUIFNFTEVDVE9SKFMpXHJcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAqL1xyXG5cclxuICAgIHZhciBwbHVnaW5OUz1cIm1DdXN0b21TY3JvbGxiYXJcIixcclxuICAgICAgICBwbHVnaW5QZng9XCJtQ1NcIixcclxuICAgICAgICBkZWZhdWx0U2VsZWN0b3I9XCIubUN1c3RvbVNjcm9sbGJhclwiLFxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgREVGQVVMVCBPUFRJT05TXHJcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAqL1xyXG5cclxuICAgICAgICBkZWZhdWx0cz17XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHNldCBlbGVtZW50L2NvbnRlbnQgd2lkdGgvaGVpZ2h0IHByb2dyYW1tYXRpY2FsbHlcclxuICAgICAgICAgICAgdmFsdWVzOiBib29sZWFuLCBwaXhlbHMsIHBlcmNlbnRhZ2VcclxuICAgICAgICAgICAgICAgIG9wdGlvbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgICAgICBzZXRXaWR0aCAgICAgICAgICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgICAgICAgIHNldEhlaWdodCAgICAgICAgICAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBzZXQgdGhlIGluaXRpYWwgY3NzIHRvcCBwcm9wZXJ0eSBvZiBjb250ZW50XHJcbiAgICAgICAgICAgIHZhbHVlczogc3RyaW5nIChlLmcuIFwiLTEwMHB4XCIsIFwiMTAlXCIgZXRjLilcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2V0VG9wOjAsXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHNldCB0aGUgaW5pdGlhbCBjc3MgbGVmdCBwcm9wZXJ0eSBvZiBjb250ZW50XHJcbiAgICAgICAgICAgIHZhbHVlczogc3RyaW5nIChlLmcuIFwiLTEwMHB4XCIsIFwiMTAlXCIgZXRjLilcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2V0TGVmdDowLFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBzY3JvbGxiYXIgYXhpcyAodmVydGljYWwgYW5kL29yIGhvcml6b250YWwgc2Nyb2xsYmFycylcclxuICAgICAgICAgICAgdmFsdWVzIChzdHJpbmcpOiBcInlcIiwgXCJ4XCIsIFwieXhcIlxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBheGlzOlwieVwiLFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBwb3NpdGlvbiBvZiBzY3JvbGxiYXIgcmVsYXRpdmUgdG8gY29udGVudFxyXG4gICAgICAgICAgICB2YWx1ZXMgKHN0cmluZyk6IFwiaW5zaWRlXCIsIFwib3V0c2lkZVwiIChcIm91dHNpZGVcIiByZXF1aXJlcyBlbGVtZW50cyB3aXRoIHBvc2l0aW9uOnJlbGF0aXZlKVxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzY3JvbGxiYXJQb3NpdGlvbjpcImluc2lkZVwiLFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBzY3JvbGxpbmcgaW5lcnRpYVxyXG4gICAgICAgICAgICB2YWx1ZXM6IGludGVnZXIgKG1pbGxpc2Vjb25kcylcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc2Nyb2xsSW5lcnRpYTo5NTAsXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGF1dG8tYWRqdXN0IHNjcm9sbGJhciBkcmFnZ2VyIGxlbmd0aFxyXG4gICAgICAgICAgICB2YWx1ZXM6IGJvb2xlYW5cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgYXV0b0RyYWdnZXJMZW5ndGg6dHJ1ZSxcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgYXV0by1oaWRlIHNjcm9sbGJhciB3aGVuIGlkbGVcclxuICAgICAgICAgICAgdmFsdWVzOiBib29sZWFuXHJcbiAgICAgICAgICAgICAgICBvcHRpb24gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgYXV0b0hpZGVTY3JvbGxiYXIgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGF1dG8tZXhwYW5kcyBzY3JvbGxiYXIgb24gbW91c2Utb3ZlciBhbmQgZHJhZ2dpbmdcclxuICAgICAgICAgICAgdmFsdWVzOiBib29sZWFuXHJcbiAgICAgICAgICAgICAgICBvcHRpb24gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgYXV0b0V4cGFuZFNjcm9sbGJhciAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGFsd2F5cyBzaG93IHNjcm9sbGJhciwgZXZlbiB3aGVuIHRoZXJlJ3Mgbm90aGluZyB0byBzY3JvbGxcclxuICAgICAgICAgICAgdmFsdWVzOiBpbnRlZ2VyICgwPWRpc2FibGUsIDE9YWx3YXlzIHNob3cgZHJhZ2dlciByYWlsIGFuZCBidXR0b25zLCAyPWFsd2F5cyBzaG93IGRyYWdnZXIgcmFpbCwgZHJhZ2dlciBhbmQgYnV0dG9ucyksIGJvb2xlYW5cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgYWx3YXlzU2hvd1Njcm9sbGJhcjowLFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBzY3JvbGxpbmcgYWx3YXlzIHNuYXBzIHRvIGEgbXVsdGlwbGUgb2YgdGhpcyBudW1iZXIgaW4gcGl4ZWxzXHJcbiAgICAgICAgICAgIHZhbHVlczogaW50ZWdlciwgYXJyYXkgKFt5LHhdKVxyXG4gICAgICAgICAgICAgICAgb3B0aW9uICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRcclxuICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgICAgIHNuYXBBbW91bnQgICAgICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHdoZW4gc25hcHBpbmcsIHNuYXAgd2l0aCB0aGlzIG51bWJlciBpbiBwaXhlbHMgYXMgYW4gb2Zmc2V0XHJcbiAgICAgICAgICAgIHZhbHVlczogaW50ZWdlclxyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBzbmFwT2Zmc2V0OjAsXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIG1vdXNlLXdoZWVsIHNjcm9sbGluZ1xyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBtb3VzZVdoZWVsOntcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBlbmFibGUgbW91c2Utd2hlZWwgc2Nyb2xsaW5nXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IGJvb2xlYW5cclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBlbmFibGU6dHJ1ZSxcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxpbmcgYW1vdW50IGluIHBpeGVsc1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBcImF1dG9cIiwgaW50ZWdlclxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNjcm9sbEFtb3VudDpcImF1dG9cIixcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBtb3VzZS13aGVlbCBzY3JvbGxpbmcgYXhpc1xyXG4gICAgICAgICAgICAgICAgdGhlIGRlZmF1bHQgc2Nyb2xsaW5nIGRpcmVjdGlvbiB3aGVuIGJvdGggdmVydGljYWwgYW5kIGhvcml6b250YWwgc2Nyb2xsYmFycyBhcmUgcHJlc2VudFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzIChzdHJpbmcpOiBcInlcIiwgXCJ4XCJcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBheGlzOlwieVwiLFxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIHByZXZlbnQgdGhlIGRlZmF1bHQgYmVoYXZpb3VyIHdoaWNoIGF1dG9tYXRpY2FsbHkgc2Nyb2xscyB0aGUgcGFyZW50IGVsZW1lbnQocykgd2hlbiBlbmQgb2Ygc2Nyb2xsaW5nIGlzIHJlYWNoZWRcclxuICAgICAgICAgICAgICAgIHZhbHVlczogYm9vbGVhblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0ICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIHRoZSByZXBvcnRlZCBtb3VzZS13aGVlbCBkZWx0YSB2YWx1ZS4gVGhlIG51bWJlciBvZiBsaW5lcyAodHJhbnNsYXRlZCB0byBwaXhlbHMpIG9uZSB3aGVlbCBub3RjaCBzY3JvbGxzLlxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBcImF1dG9cIiwgaW50ZWdlclxyXG4gICAgICAgICAgICAgICAgXCJhdXRvXCIgdXNlcyB0aGUgZGVmYXVsdCBPUy9icm93c2VyIHZhbHVlXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZGVsdGFGYWN0b3I6XCJhdXRvXCIsXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgbm9ybWFsaXplIG1vdXNlLXdoZWVsIGRlbHRhIHRvIC0xIG9yIDEgKGRpc2FibGVzIG1vdXNlLXdoZWVsIGFjY2VsZXJhdGlvbilcclxuICAgICAgICAgICAgICAgIHZhbHVlczogYm9vbGVhblxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgICAgIG5vcm1hbGl6ZURlbHRhICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGludmVydCBtb3VzZS13aGVlbCBzY3JvbGxpbmcgZGlyZWN0aW9uXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IGJvb2xlYW5cclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgICAgICAgICBpbnZlcnQgICAgICAgICAgICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICB0aGUgdGFncyB0aGF0IGRpc2FibGUgbW91c2Utd2hlZWwgd2hlbiBjdXJzb3IgaXMgb3ZlciB0aGVtXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgZGlzYWJsZU92ZXI6W1wic2VsZWN0XCIsXCJvcHRpb25cIixcImtleWdlblwiLFwiZGF0YWxpc3RcIixcInRleHRhcmVhXCJdXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHNjcm9sbGJhciBidXR0b25zXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHNjcm9sbEJ1dHRvbnM6e1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGVuYWJsZSBzY3JvbGxiYXIgYnV0dG9uc1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBib29sZWFuXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRcclxuICAgICAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlICAgICAgICAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyIGJ1dHRvbnMgc2Nyb2xsaW5nIHR5cGVcclxuICAgICAgICAgICAgICAgIHZhbHVlcyAoc3RyaW5nKTogXCJzdGVwbGVzc1wiLCBcInN0ZXBwZWRcIlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNjcm9sbFR5cGU6XCJzdGVwbGVzc1wiLFxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIHNjcm9sbGluZyBhbW91bnQgaW4gcGl4ZWxzXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IFwiYXV0b1wiLCBpbnRlZ2VyXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsQW1vdW50OlwiYXV0b1wiXHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgdGFiaW5kZXggb2YgdGhlIHNjcm9sbGJhciBidXR0b25zXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IGZhbHNlLCBpbnRlZ2VyXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9uICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHRcclxuICAgICAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgICAgICAgICAgdGFiaW5kZXggICAgICAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGtleWJvYXJkIHNjcm9sbGluZ1xyXG4gICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBrZXlib2FyZDp7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgZW5hYmxlIHNjcm9sbGluZyB2aWEga2V5Ym9hcmRcclxuICAgICAgICAgICAgICAgIHZhbHVlczogYm9vbGVhblxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGVuYWJsZTp0cnVlLFxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGtleWJvYXJkIHNjcm9sbGluZyB0eXBlXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXMgKHN0cmluZyk6IFwic3RlcGxlc3NcIiwgXCJzdGVwcGVkXCJcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUeXBlOlwic3RlcGxlc3NcIixcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxpbmcgYW1vdW50IGluIHBpeGVsc1xyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBcImF1dG9cIiwgaW50ZWdlclxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHNjcm9sbEFtb3VudDpcImF1dG9cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBlbmFibGUgY29udGVudCB0b3VjaC1zd2lwZSBzY3JvbGxpbmdcclxuICAgICAgICAgICAgdmFsdWVzOiBib29sZWFuLCBpbnRlZ2VyLCBzdHJpbmcgKG51bWJlcilcclxuICAgICAgICAgICAgaW50ZWdlciB2YWx1ZXMgZGVmaW5lIHRoZSBheGlzLXNwZWNpZmljIG1pbmltdW0gYW1vdW50IHJlcXVpcmVkIGZvciBzY3JvbGxpbmcgbW9tZW50dW1cclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgY29udGVudFRvdWNoU2Nyb2xsOjI1LFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBlbmFibGUvZGlzYWJsZSBkb2N1bWVudCAoZGVmYXVsdCkgdG91Y2gtc3dpcGUgc2Nyb2xsaW5nXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGRvY3VtZW50VG91Y2hTY3JvbGw6dHJ1ZSxcclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgYWR2YW5jZWQgb3B0aW9uIHBhcmFtZXRlcnNcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgYWR2YW5jZWQ6e1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGF1dG8tZXhwYW5kIGNvbnRlbnQgaG9yaXpvbnRhbGx5IChmb3IgXCJ4XCIgb3IgXCJ5eFwiIGF4aXMpXHJcbiAgICAgICAgICAgICAgICB2YWx1ZXM6IGJvb2xlYW4sIGludGVnZXIgKHRoZSB2YWx1ZSAyIGZvcmNlcyB0aGUgbm9uIHNjcm9sbEhlaWdodC9zY3JvbGxXaWR0aCBtZXRob2QsIHRoZSB2YWx1ZSAzIGZvcmNlcyB0aGUgc2Nyb2xsSGVpZ2h0L3Njcm9sbFdpZHRoIG1ldGhvZClcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgICAgICAgICBhdXRvRXhwYW5kSG9yaXpvbnRhbFNjcm9sbCAgbnVsbFxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBhdXRvLXNjcm9sbCB0byBlbGVtZW50cyB3aXRoIGZvY3VzXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgYXV0b1Njcm9sbE9uRm9jdXM6XCJpbnB1dCx0ZXh0YXJlYSxzZWxlY3QsYnV0dG9uLGRhdGFsaXN0LGtleWdlbixhW3RhYmluZGV4XSxhcmVhLG9iamVjdCxbY29udGVudGVkaXRhYmxlPSd0cnVlJ11cIixcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBhdXRvLXVwZGF0ZSBzY3JvbGxiYXJzIG9uIGNvbnRlbnQsIGVsZW1lbnQgb3Igdmlld3BvcnQgcmVzaXplXHJcbiAgICAgICAgICAgICAgICBzaG91bGQgYmUgdHJ1ZSBmb3IgZmx1aWQgbGF5b3V0cy9lbGVtZW50cywgYWRkaW5nL3JlbW92aW5nIGNvbnRlbnQgZHluYW1pY2FsbHksIGhpZGluZy9zaG93aW5nIGVsZW1lbnRzLCBjb250ZW50IHdpdGggaW1hZ2VzIGV0Yy5cclxuICAgICAgICAgICAgICAgIHZhbHVlczogYm9vbGVhblxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHVwZGF0ZU9uQ29udGVudFJlc2l6ZTp0cnVlLFxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGF1dG8tdXBkYXRlIHNjcm9sbGJhcnMgZWFjaCB0aW1lIGVhY2ggaW1hZ2UgaW5zaWRlIHRoZSBlbGVtZW50IGlzIGZ1bGx5IGxvYWRlZFxyXG4gICAgICAgICAgICAgICAgdmFsdWVzOiBcImF1dG9cIiwgYm9vbGVhblxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHVwZGF0ZU9uSW1hZ2VMb2FkOlwiYXV0b1wiLFxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGF1dG8tdXBkYXRlIHNjcm9sbGJhcnMgYmFzZWQgb24gdGhlIGFtb3VudCBhbmQgc2l6ZSBjaGFuZ2VzIG9mIHNwZWNpZmljIHNlbGVjdG9yc1xyXG4gICAgICAgICAgICAgICAgdXNlZnVsIHdoZW4geW91IG5lZWQgdG8gdXBkYXRlIHRoZSBzY3JvbGxiYXIocykgYXV0b21hdGljYWxseSwgZWFjaCB0aW1lIGEgdHlwZSBvZiBlbGVtZW50IGlzIGFkZGVkLCByZW1vdmVkIG9yIGNoYW5nZXMgaXRzIHNpemVcclxuICAgICAgICAgICAgICAgIHZhbHVlczogYm9vbGVhbiwgc3RyaW5nIChlLmcuIFwidWwgbGlcIiB3aWxsIGF1dG8tdXBkYXRlIHNjcm9sbGJhcnMgZWFjaCB0aW1lIGxpc3QtaXRlbXMgaW5zaWRlIHRoZSBlbGVtZW50IGFyZSBjaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgYSB2YWx1ZSBvZiB0cnVlIChib29sZWFuKSB3aWxsIGF1dG8tdXBkYXRlIHNjcm9sbGJhcnMgZWFjaCB0aW1lIGFueSBlbGVtZW50IGlzIGNoYW5nZWRcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb24gICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVPblNlbGVjdG9yQ2hhbmdlICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICBleHRyYSBzZWxlY3RvcnMgdGhhdCdsbCBhbGxvdyBzY3JvbGxiYXIgZHJhZ2dpbmcgdXBvbiBtb3VzZW1vdmUvdXAsIHBvaW50ZXJtb3ZlL3VwLCB0b3VjaGVuZCBldGMuIChlLmcuIFwic2VsZWN0b3ItMSwgc2VsZWN0b3ItMlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgICAgIGV4dHJhRHJhZ2dhYmxlU2VsZWN0b3JzICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGV4dHJhIHNlbGVjdG9ycyB0aGF0J2xsIHJlbGVhc2Ugc2Nyb2xsYmFyIGRyYWdnaW5nIHVwb24gbW91c2V1cCwgcG9pbnRlcnVwLCB0b3VjaGVuZCBldGMuIChlLmcuIFwic2VsZWN0b3ItMSwgc2VsZWN0b3ItMlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICAgICAgICAgIHJlbGVhc2VEcmFnZ2FibGVTZWxlY3RvcnMgICBudWxsXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGF1dG8tdXBkYXRlIHRpbWVvdXRcclxuICAgICAgICAgICAgICAgIHZhbHVlczogaW50ZWdlciAobWlsbGlzZWNvbmRzKVxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIGF1dG9VcGRhdGVUaW1lb3V0OjYwXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHNjcm9sbGJhciB0aGVtZVxyXG4gICAgICAgICAgICB2YWx1ZXM6IHN0cmluZyAoc2VlIENTUy9wbHVnaW4gVVJJIGZvciBhIGxpc3Qgb2YgcmVhZHktdG8tdXNlIHRoZW1lcylcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhlbWU6XCJsaWdodFwiLFxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICB1c2VyIGRlZmluZWQgY2FsbGJhY2sgZnVuY3Rpb25zXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNhbGxiYWNrczp7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgQXZhaWxhYmxlIGNhbGxiYWNrczpcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayAgICAgICAgICAgICAgICAgICAgZGVmYXVsdFxyXG4gICAgICAgICAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgICAgICAgICBvbkNyZWF0ZSAgICAgICAgICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIG9uSW5pdCAgICAgICAgICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgb25TY3JvbGxTdGFydCAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICAgICBvblNjcm9sbCAgICAgICAgICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIG9uVG90YWxTY3JvbGwgICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgb25Ub3RhbFNjcm9sbEJhY2sgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZVNjcm9sbGluZyAgICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIG9uT3ZlcmZsb3dZICAgICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgb25PdmVyZmxvd1ggICAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICAgICBvbk92ZXJmbG93WU5vbmUgICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIG9uT3ZlcmZsb3dYTm9uZSAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgb25JbWFnZUxvYWQgICAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICAgICBvblNlbGVjdG9yQ2hhbmdlICAgICAgICAgICAgbnVsbFxyXG4gICAgICAgICAgICAgICAgICAgIG9uQmVmb3JlVXBkYXRlICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICAgICAgICAgb25VcGRhdGUgICAgICAgICAgICAgICAgICAgIG51bGxcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBvblRvdGFsU2Nyb2xsT2Zmc2V0OjAsXHJcbiAgICAgICAgICAgICAgICBvblRvdGFsU2Nyb2xsQmFja09mZnNldDowLFxyXG4gICAgICAgICAgICAgICAgYWx3YXlzVHJpZ2dlck9mZnNldHM6dHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIGFkZCBzY3JvbGxiYXIocykgb24gYWxsIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBjdXJyZW50IHNlbGVjdG9yLCBub3cgYW5kIGluIHRoZSBmdXR1cmVcclxuICAgICAgICAgICAgdmFsdWVzOiBib29sZWFuLCBzdHJpbmdcclxuICAgICAgICAgICAgc3RyaW5nIHZhbHVlczogXCJvblwiIChlbmFibGUpLCBcIm9uY2VcIiAoZGlzYWJsZSBhZnRlciBmaXJzdCBpbnZvY2F0aW9uKSwgXCJvZmZcIiAoZGlzYWJsZSlcclxuICAgICAgICAgICAgbGl2ZVNlbGVjdG9yIHZhbHVlczogc3RyaW5nIChzZWxlY3RvcilcclxuICAgICAgICAgICAgICAgIG9wdGlvbiAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0XHJcbiAgICAgICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgICAgICBsaXZlICAgICAgICAgICAgICAgICAgICAgICAgZmFsc2VcclxuICAgICAgICAgICAgICAgIGxpdmVTZWxlY3RvciAgICAgICAgICAgICAgICBudWxsXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIFZBUlMsIENPTlNUQU5UU1xyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgKi9cclxuXHJcbiAgICAgICAgdG90YWxJbnN0YW5jZXM9MCwgLyogcGx1Z2luIGluc3RhbmNlcyBhbW91bnQgKi9cclxuICAgICAgICBsaXZlVGltZXJzPXt9LCAvKiBsaXZlIG9wdGlvbiB0aW1lcnMgKi9cclxuICAgICAgICBvbGRJRT0od2luZG93LmF0dGFjaEV2ZW50ICYmICF3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikgPyAxIDogMCwgLyogZGV0ZWN0IElFIDwgOSAqL1xyXG4gICAgICAgIHRvdWNoQWN0aXZlPWZhbHNlLHRvdWNoYWJsZSwgLyogZ2xvYmFsIHRvdWNoIHZhcnMgKGZvciB0b3VjaCBhbmQgcG9pbnRlciBldmVudHMpICovXHJcbiAgICAgICAgLyogZ2VuZXJhbCBwbHVnaW4gY2xhc3NlcyAqL1xyXG4gICAgICAgIGNsYXNzZXM9W1xyXG4gICAgICAgICAgICBcIm1DU0JfZHJhZ2dlcl9vbkRyYWdcIixcIm1DU0Jfc2Nyb2xsVG9vbHNfb25EcmFnXCIsXCJtQ1NfaW1nX2xvYWRlZFwiLFwibUNTX2Rpc2FibGVkXCIsXCJtQ1NfZGVzdHJveWVkXCIsXCJtQ1Nfbm9fc2Nyb2xsYmFyXCIsXHJcbiAgICAgICAgICAgIFwibUNTLWF1dG9IaWRlXCIsXCJtQ1MtZGlyLXJ0bFwiLFwibUNTX25vX3Njcm9sbGJhcl95XCIsXCJtQ1Nfbm9fc2Nyb2xsYmFyX3hcIixcIm1DU195X2hpZGRlblwiLFwibUNTX3hfaGlkZGVuXCIsXCJtQ1NCX2RyYWdnZXJDb250YWluZXJcIixcclxuICAgICAgICAgICAgXCJtQ1NCX2J1dHRvblVwXCIsXCJtQ1NCX2J1dHRvbkRvd25cIixcIm1DU0JfYnV0dG9uTGVmdFwiLFwibUNTQl9idXR0b25SaWdodFwiXHJcbiAgICAgICAgXSxcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIE1FVEhPRFNcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICovXHJcblxyXG4gICAgICAgIG1ldGhvZHM9e1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgcGx1Z2luIGluaXRpYWxpemF0aW9uIG1ldGhvZFxyXG4gICAgICAgICAgICBjcmVhdGVzIHRoZSBzY3JvbGxiYXIocyksIHBsdWdpbiBkYXRhIG9iamVjdCBhbmQgb3B0aW9uc1xyXG4gICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgICovXHJcblxyXG4gICAgICAgICAgICBpbml0OmZ1bmN0aW9uKG9wdGlvbnMpe1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zPSQuZXh0ZW5kKHRydWUse30sZGVmYXVsdHMsb3B0aW9ucyksXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3I9X3NlbGVjdG9yLmNhbGwodGhpcyk7IC8qIHZhbGlkYXRlIHNlbGVjdG9yICovXHJcblxyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIGlmIGxpdmUgb3B0aW9uIGlzIGVuYWJsZWQsIG1vbml0b3IgZm9yIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBjdXJyZW50IHNlbGVjdG9yIGFuZFxyXG4gICAgICAgICAgICAgICAgYXBwbHkgc2Nyb2xsYmFyKHMpIHdoZW4gZm91bmQgKG5vdyBhbmQgaW4gdGhlIGZ1dHVyZSlcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBpZihvcHRpb25zLmxpdmUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaXZlU2VsZWN0b3I9b3B0aW9ucy5saXZlU2VsZWN0b3IgfHwgdGhpcy5zZWxlY3RvciB8fCBkZWZhdWx0U2VsZWN0b3IsIC8qIGxpdmUgc2VsZWN0b3IocykgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGxpdmVTZWxlY3Rvcj0kKGxpdmVTZWxlY3Rvcik7IC8qIGxpdmUgc2VsZWN0b3IocykgYXMganF1ZXJ5IG9iamVjdCAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMubGl2ZT09PVwib2ZmXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlIGxpdmUgaWYgcmVxdWVzdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKHtsaXZlOlwib2ZmXCJ9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTGl2ZVRpbWVycyhsaXZlU2VsZWN0b3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGxpdmVUaW1lcnNbbGl2ZVNlbGVjdG9yXT1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGNhbGwgbUN1c3RvbVNjcm9sbGJhciBmbiBvbiBsaXZlIHNlbGVjdG9yKHMpIGV2ZXJ5IGhhbGYtc2Vjb25kICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRsaXZlU2VsZWN0b3IubUN1c3RvbVNjcm9sbGJhcihvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9ucy5saXZlPT09XCJvbmNlXCIgJiYgJGxpdmVTZWxlY3Rvci5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZGlzYWJsZSBsaXZlIGFmdGVyIGZpcnN0IGludm9jYXRpb24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpdmVUaW1lcnMobGl2ZVNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sNTAwKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUxpdmVUaW1lcnMobGl2ZVNlbGVjdG9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBvcHRpb25zIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgKGZvciB2ZXJzaW9ucyA8IDMuMC4wKSBhbmQgbm9ybWFsaXphdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zZXRXaWR0aD0ob3B0aW9ucy5zZXRfd2lkdGgpID8gb3B0aW9ucy5zZXRfd2lkdGggOiBvcHRpb25zLnNldFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5zZXRIZWlnaHQ9KG9wdGlvbnMuc2V0X2hlaWdodCkgPyBvcHRpb25zLnNldF9oZWlnaHQgOiBvcHRpb25zLnNldEhlaWdodDtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuYXhpcz0ob3B0aW9ucy5ob3Jpem9udGFsU2Nyb2xsKSA/IFwieFwiIDogX2ZpbmRBeGlzKG9wdGlvbnMuYXhpcyk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNjcm9sbEluZXJ0aWE9b3B0aW9ucy5zY3JvbGxJbmVydGlhPjAgJiYgb3B0aW9ucy5zY3JvbGxJbmVydGlhPDE3ID8gMTcgOiBvcHRpb25zLnNjcm9sbEluZXJ0aWE7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2Ygb3B0aW9ucy5tb3VzZVdoZWVsIT09XCJvYmplY3RcIiAmJiAgb3B0aW9ucy5tb3VzZVdoZWVsPT10cnVlKXsgLyogb2xkIHNjaG9vbCBtb3VzZVdoZWVsIG9wdGlvbiAobm9uLW9iamVjdCkgKi9cclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLm1vdXNlV2hlZWw9e2VuYWJsZTp0cnVlLHNjcm9sbEFtb3VudDpcImF1dG9cIixheGlzOlwieVwiLHByZXZlbnREZWZhdWx0OmZhbHNlLGRlbHRhRmFjdG9yOlwiYXV0b1wiLG5vcm1hbGl6ZURlbHRhOmZhbHNlLGludmVydDpmYWxzZX1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9wdGlvbnMubW91c2VXaGVlbC5zY3JvbGxBbW91bnQ9IW9wdGlvbnMubW91c2VXaGVlbFBpeGVscyA/IG9wdGlvbnMubW91c2VXaGVlbC5zY3JvbGxBbW91bnQgOiBvcHRpb25zLm1vdXNlV2hlZWxQaXhlbHM7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLm1vdXNlV2hlZWwubm9ybWFsaXplRGVsdGE9IW9wdGlvbnMuYWR2YW5jZWQubm9ybWFsaXplTW91c2VXaGVlbERlbHRhID8gb3B0aW9ucy5tb3VzZVdoZWVsLm5vcm1hbGl6ZURlbHRhIDogb3B0aW9ucy5hZHZhbmNlZC5ub3JtYWxpemVNb3VzZVdoZWVsRGVsdGE7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnNjcm9sbEJ1dHRvbnMuc2Nyb2xsVHlwZT1fZmluZFNjcm9sbEJ1dHRvbnNUeXBlKG9wdGlvbnMuc2Nyb2xsQnV0dG9ucy5zY3JvbGxUeXBlKTtcclxuXHJcbiAgICAgICAgICAgICAgICBfdGhlbWUob3B0aW9ucyk7IC8qIHRoZW1lLXNwZWNpZmljIG9wdGlvbnMgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAvKiBwbHVnaW4gY29uc3RydWN0b3IgKi9cclxuICAgICAgICAgICAgICAgIHJldHVybiAkKHNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZighJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogcHJldmVudCBtdWx0aXBsZSBpbnN0YW50aWF0aW9ucyAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogc3RvcmUgb3B0aW9ucyBhbmQgY3JlYXRlIG9iamVjdHMgaW4ganF1ZXJ5IGRhdGEgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuZGF0YShwbHVnaW5QZngse1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWR4OisrdG90YWxJbnN0YW5jZXMsIC8qIGluc3RhbmNlIGluZGV4ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHQ6b3B0aW9ucywgLyogb3B0aW9ucyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsUmF0aW86e3k6bnVsbCx4Om51bGx9LCAvKiBzY3JvbGxiYXIgdG8gY29udGVudCByYXRpbyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3dlZDpudWxsLCAvKiBvdmVyZmxvd2VkIGF4aXMgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRSZXNldDp7eTpudWxsLHg6bnVsbH0sIC8qIG9iamVjdCB0byBjaGVjayB3aGVuIGNvbnRlbnQgcmVzZXRzICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kRXZlbnRzOmZhbHNlLCAvKiBvYmplY3QgdG8gY2hlY2sgaWYgZXZlbnRzIGFyZSBib3VuZCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHdlZW5SdW5uaW5nOmZhbHNlLCAvKiBvYmplY3QgdG8gY2hlY2sgaWYgdHdlZW4gaXMgcnVubmluZyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VxdWVudGlhbDp7fSwgLyogc2VxdWVudGlhbCBzY3JvbGxpbmcgb2JqZWN0ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYW5nRGlyOiR0aGlzLmNzcyhcImRpcmVjdGlvblwiKSwgLyogZGV0ZWN0L3N0b3JlIGRpcmVjdGlvbiAobHRyIG9yIHJ0bCkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiT2Zmc2V0czpudWxsLCAvKiBvYmplY3QgdG8gY2hlY2sgd2hldGhlciBjYWxsYmFjayBvZmZzZXRzIGFsd2F5cyB0cmlnZ2VyICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0IHRvIGNoZWNrIGhvdyBzY3JvbGxpbmcgZXZlbnRzIHdoZXJlIGxhc3QgdHJpZ2dlcmVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImludGVybmFsXCIgKGRlZmF1bHQgLSB0cmlnZ2VyZWQgYnkgdGhpcyBzY3JpcHQpLCBcImV4dGVybmFsXCIgKHRyaWdnZXJlZCBieSBvdGhlciBzY3JpcHRzLCBlLmcuIHZpYSBzY3JvbGxUbyBtZXRob2QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZTogb2JqZWN0LmRhdGEoXCJtQ1NcIikudHJpZ2dlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXI6bnVsbCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3QgdG8gY2hlY2sgZm9yIGNoYW5nZXMgaW4gZWxlbWVudHMgaW4gb3JkZXIgdG8gY2FsbCB0aGUgdXBkYXRlIG1ldGhvZCBhdXRvbWF0aWNhbGx5XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9sbDp7c2l6ZTp7bzowLG46MH0saW1nOntvOjAsbjowfSxjaGFuZ2U6e286MCxuOjB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogSFRNTCBkYXRhIGF0dHJpYnV0ZXMgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGh0bWxEYXRhQXhpcz0kdGhpcy5kYXRhKFwibWNzLWF4aXNcIiksaHRtbERhdGFTYlBvcz0kdGhpcy5kYXRhKFwibWNzLXNjcm9sbGJhci1wb3NpdGlvblwiKSxodG1sRGF0YVRoZW1lPSR0aGlzLmRhdGEoXCJtY3MtdGhlbWVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihodG1sRGF0YUF4aXMpe28uYXhpcz1odG1sRGF0YUF4aXM7fSAvKiB1c2FnZSBleGFtcGxlOiBkYXRhLW1jcy1heGlzPVwieVwiICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGh0bWxEYXRhU2JQb3Mpe28uc2Nyb2xsYmFyUG9zaXRpb249aHRtbERhdGFTYlBvczt9IC8qIHVzYWdlIGV4YW1wbGU6IGRhdGEtbWNzLXNjcm9sbGJhci1wb3NpdGlvbj1cIm91dHNpZGVcIiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihodG1sRGF0YVRoZW1lKXsgLyogdXNhZ2UgZXhhbXBsZTogZGF0YS1tY3MtdGhlbWU9XCJtaW5pbWFsXCIgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8udGhlbWU9aHRtbERhdGFUaGVtZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGVtZShvKTsgLyogdGhlbWUtc3BlY2lmaWMgb3B0aW9ucyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfcGx1Z2luTWFya3VwLmNhbGwodGhpcyk7IC8qIGFkZCBwbHVnaW4gbWFya3VwICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkICYmIG8uY2FsbGJhY2tzLm9uQ3JlYXRlICYmIHR5cGVvZiBvLmNhbGxiYWNrcy5vbkNyZWF0ZT09PVwiZnVuY3Rpb25cIil7by5jYWxsYmFja3Mub25DcmVhdGUuY2FsbCh0aGlzKTt9IC8qIGNhbGxiYWNrczogb25DcmVhdGUgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXIgaW1nOm5vdCguXCIrY2xhc3Nlc1syXStcIilcIikuYWRkQ2xhc3MoY2xhc3Nlc1syXSk7IC8qIGZsYWcgbG9hZGVkIGltYWdlcyAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kcy51cGRhdGUuY2FsbChudWxsLCR0aGlzKTsgLyogY2FsbCB0aGUgdXBkYXRlIG1ldGhvZCAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHBsdWdpbiB1cGRhdGUgbWV0aG9kXHJcbiAgICAgICAgICAgIHVwZGF0ZXMgY29udGVudCBhbmQgc2Nyb2xsYmFyKHMpIHZhbHVlcywgZXZlbnRzIGFuZCBzdGF0dXNcclxuICAgICAgICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgICAgICAgICB1c2FnZTogJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcihcInVwZGF0ZVwiKTtcclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZTpmdW5jdGlvbihlbCxjYil7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdG9yPWVsIHx8IF9zZWxlY3Rvci5jYWxsKHRoaXMpOyAvKiB2YWxpZGF0ZSBzZWxlY3RvciAqL1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiAkKHNlbGVjdG9yKS5lYWNoKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZigkdGhpcy5kYXRhKHBsdWdpblBmeCkpeyAvKiBjaGVjayBpZiBwbHVnaW4gaGFzIGluaXRpYWxpemVkICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIW1DU0JfY29udGFpbmVyLmxlbmd0aCl7cmV0dXJuO31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGQudHdlZW5SdW5uaW5nKXtfc3RvcCgkdGhpcyk7fSAvKiBzdG9wIGFueSBydW5uaW5nIHR3ZWVucyB3aGlsZSB1cGRhdGluZyAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2IgJiYgZCAmJiBvLmNhbGxiYWNrcy5vbkJlZm9yZVVwZGF0ZSAmJiB0eXBlb2Ygby5jYWxsYmFja3Mub25CZWZvcmVVcGRhdGU9PT1cImZ1bmN0aW9uXCIpe28uY2FsbGJhY2tzLm9uQmVmb3JlVXBkYXRlLmNhbGwodGhpcyk7fSAvKiBjYWxsYmFja3M6IG9uQmVmb3JlVXBkYXRlICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBpZiBlbGVtZW50IHdhcyBkaXNhYmxlZCBvciBkZXN0cm95ZWQsIHJlbW92ZSBjbGFzcyhlcykgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJHRoaXMuaGFzQ2xhc3MoY2xhc3Nlc1szXSkpeyR0aGlzLnJlbW92ZUNsYXNzKGNsYXNzZXNbM10pO31cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJHRoaXMuaGFzQ2xhc3MoY2xhc3Nlc1s0XSkpeyR0aGlzLnJlbW92ZUNsYXNzKGNsYXNzZXNbNF0pO31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGNzcyBmbGV4Ym94IGZpeCwgZGV0ZWN0L3NldCBtYXgtaGVpZ2h0ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1DdXN0b21TY3JvbGxCb3guY3NzKFwibWF4LWhlaWdodFwiLFwibm9uZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSE9PSR0aGlzLmhlaWdodCgpKXttQ3VzdG9tU2Nyb2xsQm94LmNzcyhcIm1heC1oZWlnaHRcIiwkdGhpcy5oZWlnaHQoKSk7fVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgX2V4cGFuZENvbnRlbnRIb3Jpem9udGFsbHkuY2FsbCh0aGlzKTsgLyogZXhwYW5kIGNvbnRlbnQgaG9yaXpvbnRhbGx5ICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvLmF4aXMhPT1cInlcIiAmJiAhby5hZHZhbmNlZC5hdXRvRXhwYW5kSG9yaXpvbnRhbFNjcm9sbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lci5jc3MoXCJ3aWR0aFwiLF9jb250ZW50V2lkdGgobUNTQl9jb250YWluZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZC5vdmVyZmxvd2VkPV9vdmVyZmxvd2VkLmNhbGwodGhpcyk7IC8qIGRldGVybWluZSBpZiBzY3JvbGxpbmcgaXMgcmVxdWlyZWQgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zY3JvbGxiYXJWaXNpYmlsaXR5LmNhbGwodGhpcyk7IC8qIHNob3cvaGlkZSBzY3JvbGxiYXIocykgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGF1dG8tYWRqdXN0IHNjcm9sbGJhciBkcmFnZ2VyIGxlbmd0aCBhbmFsb2dvdXMgdG8gY29udGVudCAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvLmF1dG9EcmFnZ2VyTGVuZ3RoKXtfc2V0RHJhZ2dlckxlbmd0aC5jYWxsKHRoaXMpO31cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zY3JvbGxSYXRpby5jYWxsKHRoaXMpOyAvKiBjYWxjdWxhdGUgYW5kIHN0b3JlIHNjcm9sbGJhciB0byBjb250ZW50IHJhdGlvICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYmluZEV2ZW50cy5jYWxsKHRoaXMpOyAvKiBiaW5kIHNjcm9sbGJhciBldmVudHMgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIHJlc2V0IHNjcm9sbGluZyBwb3NpdGlvbiBhbmQvb3IgZXZlbnRzICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0bz1bTWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wKSxNYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0KV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG8uYXhpcyE9PVwieFwiKXsgLyogeS95eCBheGlzICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZighZC5vdmVyZmxvd2VkWzBdKXsgLyogeSBzY3JvbGxpbmcgaXMgbm90IHJlcXVpcmVkICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihvLmF4aXM9PT1cInlcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF91bmJpbmRFdmVudHMuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihvLmF4aXM9PT1cInl4XCIgJiYgZC5vdmVyZmxvd2VkWzFdKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLHRvWzFdLnRvU3RyaW5nKCkse2RpcjpcInhcIixkdXI6MCxvdmVyd3JpdGU6XCJub25lXCJ9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihtQ1NCX2RyYWdnZXJbMF0uaGVpZ2h0KCk+bUNTQl9kcmFnZ2VyWzBdLnBhcmVudCgpLmhlaWdodCgpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzZXRDb250ZW50UG9zaXRpb24uY2FsbCh0aGlzKTsgLyogcmVzZXQgY29udGVudCBwb3NpdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7IC8qIHkgc2Nyb2xsaW5nIGlzIHJlcXVpcmVkICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLHRvWzBdLnRvU3RyaW5nKCkse2RpcjpcInlcIixkdXI6MCxvdmVyd3JpdGU6XCJub25lXCJ9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLmNvbnRlbnRSZXNldC55PW51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoby5heGlzIT09XCJ5XCIpeyAvKiB4L3l4IGF4aXMgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkLm92ZXJmbG93ZWRbMV0peyAvKiB4IHNjcm9sbGluZyBpcyBub3QgcmVxdWlyZWQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzZXRDb250ZW50UG9zaXRpb24uY2FsbCh0aGlzKTsgLyogcmVzZXQgY29udGVudCBwb3NpdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKG8uYXhpcz09PVwieFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3VuYmluZEV2ZW50cy5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKG8uYXhpcz09PVwieXhcIiAmJiBkLm92ZXJmbG93ZWRbMF0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2Nyb2xsVG8oJHRoaXMsdG9bMF0udG9TdHJpbmcoKSx7ZGlyOlwieVwiLGR1cjowLG92ZXJ3cml0ZTpcIm5vbmVcIn0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKG1DU0JfZHJhZ2dlclsxXS53aWR0aCgpPm1DU0JfZHJhZ2dlclsxXS5wYXJlbnQoKS53aWR0aCgpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzZXRDb250ZW50UG9zaXRpb24uY2FsbCh0aGlzKTsgLyogcmVzZXQgY29udGVudCBwb3NpdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7IC8qIHggc2Nyb2xsaW5nIGlzIHJlcXVpcmVkICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLHRvWzFdLnRvU3RyaW5nKCkse2RpcjpcInhcIixkdXI6MCxvdmVyd3JpdGU6XCJub25lXCJ9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLmNvbnRlbnRSZXNldC54PW51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGNhbGxiYWNrczogb25JbWFnZUxvYWQsIG9uU2VsZWN0b3JDaGFuZ2UsIG9uVXBkYXRlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGNiICYmIGQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoY2I9PT0yICYmIG8uY2FsbGJhY2tzLm9uSW1hZ2VMb2FkICYmIHR5cGVvZiBvLmNhbGxiYWNrcy5vbkltYWdlTG9hZD09PVwiZnVuY3Rpb25cIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby5jYWxsYmFja3Mub25JbWFnZUxvYWQuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNiPT09MyAmJiBvLmNhbGxiYWNrcy5vblNlbGVjdG9yQ2hhbmdlICYmIHR5cGVvZiBvLmNhbGxiYWNrcy5vblNlbGVjdG9yQ2hhbmdlPT09XCJmdW5jdGlvblwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvLmNhbGxiYWNrcy5vblNlbGVjdG9yQ2hhbmdlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZihvLmNhbGxiYWNrcy5vblVwZGF0ZSAmJiB0eXBlb2Ygby5jYWxsYmFja3Mub25VcGRhdGU9PT1cImZ1bmN0aW9uXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uY2FsbGJhY2tzLm9uVXBkYXRlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hdXRvVXBkYXRlLmNhbGwodGhpcyk7IC8qIGluaXRpYWxpemUgYXV0b21hdGljIHVwZGF0aW5nIChmb3IgZHluYW1pYyBjb250ZW50LCBmbHVpZCBsYXlvdXRzIGV0Yy4pICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgcGx1Z2luIHNjcm9sbFRvIG1ldGhvZFxyXG4gICAgICAgICAgICB0cmlnZ2VycyBhIHNjcm9sbGluZyBldmVudCB0byBhIHNwZWNpZmljIHZhbHVlXHJcbiAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgdXNhZ2U6ICQoc2VsZWN0b3IpLm1DdXN0b21TY3JvbGxiYXIoXCJzY3JvbGxUb1wiLHZhbHVlLG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAqL1xyXG5cclxuICAgICAgICAgICAgc2Nyb2xsVG86ZnVuY3Rpb24odmFsLG9wdGlvbnMpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8qIHByZXZlbnQgc2lsbHkgdGhpbmdzIGxpa2UgJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcihcInNjcm9sbFRvXCIsdW5kZWZpbmVkKTsgKi9cclxuICAgICAgICAgICAgICAgIGlmKHR5cGVvZiB2YWw9PVwidW5kZWZpbmVkXCIgfHwgdmFsPT1udWxsKXtyZXR1cm47fVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBtZXRob2QgZGVmYXVsdCBvcHRpb25zICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXRob2REZWZhdWx0cz17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjpcImV4dGVybmFsXCIsIC8qIG1ldGhvZCBpcyBieSBkZWZhdWx0IHRyaWdnZXJlZCBleHRlcm5hbGx5IChlLmcuIGZyb20gb3RoZXIgc2NyaXB0cykgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxJbmVydGlhOm8uc2Nyb2xsSW5lcnRpYSwgLyogc2Nyb2xsaW5nIGluZXJ0aWEgKGFuaW1hdGlvbiBkdXJhdGlvbikgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIiwgLyogYW5pbWF0aW9uIGVhc2luZyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1vdmVEcmFnZ2VyOmZhbHNlLCAvKiBtb3ZlIGRyYWdnZXIgaW5zdGVhZCBvZiBjb250ZW50ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDo2MCwgLyogc2Nyb2xsLXRvIGRlbGF5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOnRydWUsIC8qIGVuYWJsZS9kaXNhYmxlIGNhbGxiYWNrcyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU3RhcnQ6dHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblVwZGF0ZTp0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGU6dHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZE9wdGlvbnM9JC5leHRlbmQodHJ1ZSx7fSxtZXRob2REZWZhdWx0cyxvcHRpb25zKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvPV9hcnIuY2FsbCh0aGlzLHZhbCksZHVyPW1ldGhvZE9wdGlvbnMuc2Nyb2xsSW5lcnRpYT4wICYmIG1ldGhvZE9wdGlvbnMuc2Nyb2xsSW5lcnRpYTwxNyA/IDE3IDogbWV0aG9kT3B0aW9ucy5zY3JvbGxJbmVydGlhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogdHJhbnNsYXRlIHl4IHZhbHVlcyB0byBhY3R1YWwgc2Nyb2xsLXRvIHBvc2l0aW9ucyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b1swXT1fdG8uY2FsbCh0aGlzLHRvWzBdLFwieVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9bMV09X3RvLmNhbGwodGhpcyx0b1sxXSxcInhcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGVjayBpZiBzY3JvbGwtdG8gdmFsdWUgbW92ZXMgdGhlIGRyYWdnZXIgaW5zdGVhZCBvZiBjb250ZW50LlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBPbmx5IHBpeGVsIHZhbHVlcyBhcHBseSBvbiBkcmFnZ2VyIChlLmcuIDEwMCwgXCIxMDBweFwiLCBcIi09MTAwXCIgZXRjLilcclxuICAgICAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYobWV0aG9kT3B0aW9ucy5tb3ZlRHJhZ2dlcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1swXSo9ZC5zY3JvbGxSYXRpby55O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9bMV0qPWQuc2Nyb2xsUmF0aW8ueDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kT3B0aW9ucy5kdXI9X2lzVGFiSGlkZGVuKCkgPyAwIDogZHVyOyAvL3NraXAgYW5pbWF0aW9ucyBpZiBicm93c2VyIHRhYiBpcyBoaWRkZW5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGRvIHRoZSBzY3JvbGxpbmcgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRvWzBdIT09bnVsbCAmJiB0eXBlb2YgdG9bMF0hPT1cInVuZGVmaW5lZFwiICYmIG8uYXhpcyE9PVwieFwiICYmIGQub3ZlcmZsb3dlZFswXSl7IC8qIHNjcm9sbCB5ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kT3B0aW9ucy5kaXI9XCJ5XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kT3B0aW9ucy5vdmVyd3JpdGU9XCJhbGxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2Nyb2xsVG8oJHRoaXMsdG9bMF0udG9TdHJpbmcoKSxtZXRob2RPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRvWzFdIT09bnVsbCAmJiB0eXBlb2YgdG9bMV0hPT1cInVuZGVmaW5lZFwiICYmIG8uYXhpcyE9PVwieVwiICYmIGQub3ZlcmZsb3dlZFsxXSl7IC8qIHNjcm9sbCB4ICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kT3B0aW9ucy5kaXI9XCJ4XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kT3B0aW9ucy5vdmVyd3JpdGU9XCJub25lXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLHRvWzFdLnRvU3RyaW5nKCksbWV0aG9kT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sbWV0aG9kT3B0aW9ucy50aW1lb3V0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICBwbHVnaW4gc3RvcCBtZXRob2RcclxuICAgICAgICAgICAgc3RvcHMgc2Nyb2xsaW5nIGFuaW1hdGlvblxyXG4gICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwic3RvcFwiKTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgc3RvcDpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgX3N0b3AoJHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgIHBsdWdpbiBkaXNhYmxlIG1ldGhvZFxyXG4gICAgICAgICAgICB0ZW1wb3JhcmlseSBkaXNhYmxlcyB0aGUgc2Nyb2xsYmFyKHMpXHJcbiAgICAgICAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgICAgICAgICAgdXNhZ2U6ICQoc2VsZWN0b3IpLm1DdXN0b21TY3JvbGxiYXIoXCJkaXNhYmxlXCIscmVzZXQpO1xyXG4gICAgICAgICAgICByZXNldCAoYm9vbGVhbik6IHJlc2V0cyBjb250ZW50IHBvc2l0aW9uIHRvIDBcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZGlzYWJsZTpmdW5jdGlvbihyKXtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0b3I9X3NlbGVjdG9yLmNhbGwodGhpcyk7IC8qIHZhbGlkYXRlIHNlbGVjdG9yICovXHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQoc2VsZWN0b3IpLmVhY2goZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzPSQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCR0aGlzLmRhdGEocGx1Z2luUGZ4KSl7IC8qIGNoZWNrIGlmIHBsdWdpbiBoYXMgaW5pdGlhbGl6ZWQgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9hdXRvVXBkYXRlLmNhbGwodGhpcyxcInJlbW92ZVwiKTsgLyogcmVtb3ZlIGF1dG9tYXRpYyB1cGRhdGluZyAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgX3VuYmluZEV2ZW50cy5jYWxsKHRoaXMpOyAvKiB1bmJpbmQgZXZlbnRzICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyKXtfcmVzZXRDb250ZW50UG9zaXRpb24uY2FsbCh0aGlzKTt9IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zY3JvbGxiYXJWaXNpYmlsaXR5LmNhbGwodGhpcyx0cnVlKTsgLyogc2hvdy9oaWRlIHNjcm9sbGJhcihzKSAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoY2xhc3Nlc1szXSk7IC8qIGFkZCBkaXNhYmxlIGNsYXNzICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgcGx1Z2luIGRlc3Ryb3kgbWV0aG9kXHJcbiAgICAgICAgICAgIGNvbXBsZXRlbHkgcmVtb3ZlcyB0aGUgc2Nyb2xsYmFyKHMpIGFuZCByZXR1cm5zIHRoZSBlbGVtZW50IHRvIGl0cyBvcmlnaW5hbCBzdGF0ZVxyXG4gICAgICAgICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAgICAgICAgIHVzYWdlOiAkKHNlbGVjdG9yKS5tQ3VzdG9tU2Nyb2xsYmFyKFwiZGVzdHJveVwiKTtcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgZGVzdHJveTpmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzZWxlY3Rvcj1fc2VsZWN0b3IuY2FsbCh0aGlzKTsgLyogdmFsaWRhdGUgc2VsZWN0b3IgKi9cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJChzZWxlY3RvcikuZWFjaChmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHRoaXMuZGF0YShwbHVnaW5QZngpKXsgLyogY2hlY2sgaWYgcGx1Z2luIGhhcyBpbml0aWFsaXplZCAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsYmFyPSQoXCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvLmxpdmUpe3JlbW92ZUxpdmVUaW1lcnMoby5saXZlU2VsZWN0b3IgfHwgJChzZWxlY3Rvcikuc2VsZWN0b3IpO30gLyogcmVtb3ZlIGxpdmUgdGltZXJzICovXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfYXV0b1VwZGF0ZS5jYWxsKHRoaXMsXCJyZW1vdmVcIik7IC8qIHJlbW92ZSBhdXRvbWF0aWMgdXBkYXRpbmcgKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF91bmJpbmRFdmVudHMuY2FsbCh0aGlzKTsgLyogdW5iaW5kIGV2ZW50cyAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgX3Jlc2V0Q29udGVudFBvc2l0aW9uLmNhbGwodGhpcyk7IC8qIHJlc2V0IGNvbnRlbnQgcG9zaXRpb24gKi9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZURhdGEocGx1Z2luUGZ4KTsgLyogcmVtb3ZlIHBsdWdpbiBkYXRhIG9iamVjdCAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgX2RlbGV0ZSh0aGlzLFwibWNzXCIpOyAvKiBkZWxldGUgY2FsbGJhY2tzIG9iamVjdCAqL1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogcmVtb3ZlIHBsdWdpbiBtYXJrdXAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsYmFyLnJlbW92ZSgpOyAvKiByZW1vdmUgc2Nyb2xsYmFyKHMpIGZpcnN0ICh0aG9zZSBjYW4gYmUgZWl0aGVyIGluc2lkZSBvciBvdXRzaWRlIHBsdWdpbidzIGlubmVyIHdyYXBwZXIpICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyLmZpbmQoXCJpbWcuXCIrY2xhc3Nlc1syXSkucmVtb3ZlQ2xhc3MoY2xhc3Nlc1syXSk7IC8qIHJlbW92ZSBsb2FkZWQgaW1hZ2VzIGZsYWcgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgbUN1c3RvbVNjcm9sbEJveC5yZXBsYWNlV2l0aChtQ1NCX2NvbnRhaW5lci5jb250ZW50cygpKTsgLyogcmVwbGFjZSBwbHVnaW4ncyBpbm5lciB3cmFwcGVyIHdpdGggdGhlIG9yaWdpbmFsIGNvbnRlbnQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogcmVtb3ZlIHBsdWdpbiBjbGFzc2VzIGZyb20gdGhlIGVsZW1lbnQgYW5kIGFkZCBkZXN0cm95IGNsYXNzICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKHBsdWdpbk5TK1wiIF9cIitwbHVnaW5QZngrXCJfXCIrZC5pZHgrXCIgXCIrY2xhc3Nlc1s2XStcIiBcIitjbGFzc2VzWzddK1wiIFwiK2NsYXNzZXNbNV0rXCIgXCIrY2xhc3Nlc1szXSkuYWRkQ2xhc3MoY2xhc3Nlc1s0XSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKlxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgRlVOQ1RJT05TXHJcbiAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICAqL1xyXG5cclxuICAgICAgICAvKiB2YWxpZGF0ZXMgc2VsZWN0b3IgKGlmIHNlbGVjdG9yIGlzIGludmFsaWQgb3IgdW5kZWZpbmVkIHVzZXMgdGhlIGRlZmF1bHQgb25lKSAqL1xyXG4gICAgICAgIF9zZWxlY3Rvcj1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICByZXR1cm4gKHR5cGVvZiAkKHRoaXMpIT09XCJvYmplY3RcIiB8fCAkKHRoaXMpLmxlbmd0aDwxKSA/IGRlZmF1bHRTZWxlY3RvciA6IHRoaXM7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogY2hhbmdlcyBvcHRpb25zIGFjY29yZGluZyB0byB0aGVtZSAqL1xyXG4gICAgICAgIF90aGVtZT1mdW5jdGlvbihvYmope1xyXG4gICAgICAgICAgICB2YXIgZml4ZWRTaXplU2Nyb2xsYmFyVGhlbWVzPVtcInJvdW5kZWRcIixcInJvdW5kZWQtZGFya1wiLFwicm91bmRlZC1kb3RzXCIsXCJyb3VuZGVkLWRvdHMtZGFya1wiXSxcclxuICAgICAgICAgICAgICAgIG5vbkV4cGFuZGVkU2Nyb2xsYmFyVGhlbWVzPVtcInJvdW5kZWQtZG90c1wiLFwicm91bmRlZC1kb3RzLWRhcmtcIixcIjNkXCIsXCIzZC1kYXJrXCIsXCIzZC10aGlja1wiLFwiM2QtdGhpY2stZGFya1wiLFwiaW5zZXRcIixcImluc2V0LWRhcmtcIixcImluc2V0LTJcIixcImluc2V0LTItZGFya1wiLFwiaW5zZXQtM1wiLFwiaW5zZXQtMy1kYXJrXCJdLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZWRTY3JvbGxCdXR0b25zVGhlbWVzPVtcIm1pbmltYWxcIixcIm1pbmltYWwtZGFya1wiXSxcclxuICAgICAgICAgICAgICAgIGVuYWJsZWRBdXRvSGlkZVNjcm9sbGJhclRoZW1lcz1bXCJtaW5pbWFsXCIsXCJtaW5pbWFsLWRhcmtcIl0sXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXJQb3NpdGlvbk91dHNpZGVUaGVtZXM9W1wibWluaW1hbFwiLFwibWluaW1hbC1kYXJrXCJdO1xyXG4gICAgICAgICAgICBvYmouYXV0b0RyYWdnZXJMZW5ndGg9JC5pbkFycmF5KG9iai50aGVtZSxmaXhlZFNpemVTY3JvbGxiYXJUaGVtZXMpID4gLTEgPyBmYWxzZSA6IG9iai5hdXRvRHJhZ2dlckxlbmd0aDtcclxuICAgICAgICAgICAgb2JqLmF1dG9FeHBhbmRTY3JvbGxiYXI9JC5pbkFycmF5KG9iai50aGVtZSxub25FeHBhbmRlZFNjcm9sbGJhclRoZW1lcykgPiAtMSA/IGZhbHNlIDogb2JqLmF1dG9FeHBhbmRTY3JvbGxiYXI7XHJcbiAgICAgICAgICAgIG9iai5zY3JvbGxCdXR0b25zLmVuYWJsZT0kLmluQXJyYXkob2JqLnRoZW1lLGRpc2FibGVkU2Nyb2xsQnV0dG9uc1RoZW1lcykgPiAtMSA/IGZhbHNlIDogb2JqLnNjcm9sbEJ1dHRvbnMuZW5hYmxlO1xyXG4gICAgICAgICAgICBvYmouYXV0b0hpZGVTY3JvbGxiYXI9JC5pbkFycmF5KG9iai50aGVtZSxlbmFibGVkQXV0b0hpZGVTY3JvbGxiYXJUaGVtZXMpID4gLTEgPyB0cnVlIDogb2JqLmF1dG9IaWRlU2Nyb2xsYmFyO1xyXG4gICAgICAgICAgICBvYmouc2Nyb2xsYmFyUG9zaXRpb249JC5pbkFycmF5KG9iai50aGVtZSxzY3JvbGxiYXJQb3NpdGlvbk91dHNpZGVUaGVtZXMpID4gLTEgPyBcIm91dHNpZGVcIiA6IG9iai5zY3JvbGxiYXJQb3NpdGlvbjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiBsaXZlIG9wdGlvbiB0aW1lcnMgcmVtb3ZhbCAqL1xyXG4gICAgICAgIHJlbW92ZUxpdmVUaW1lcnM9ZnVuY3Rpb24oc2VsZWN0b3Ipe1xyXG4gICAgICAgICAgICBpZihsaXZlVGltZXJzW3NlbGVjdG9yXSl7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobGl2ZVRpbWVyc1tzZWxlY3Rvcl0pO1xyXG4gICAgICAgICAgICAgICAgX2RlbGV0ZShsaXZlVGltZXJzLHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIG5vcm1hbGl6ZXMgYXhpcyBvcHRpb24gdG8gdmFsaWQgdmFsdWVzOiBcInlcIiwgXCJ4XCIsIFwieXhcIiAqL1xyXG4gICAgICAgIF9maW5kQXhpcz1mdW5jdGlvbih2YWwpe1xyXG4gICAgICAgICAgICByZXR1cm4gKHZhbD09PVwieXhcIiB8fCB2YWw9PT1cInh5XCIgfHwgdmFsPT09XCJhdXRvXCIpID8gXCJ5eFwiIDogKHZhbD09PVwieFwiIHx8IHZhbD09PVwiaG9yaXpvbnRhbFwiKSA/IFwieFwiIDogXCJ5XCI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogbm9ybWFsaXplcyBzY3JvbGxCdXR0b25zLnNjcm9sbFR5cGUgb3B0aW9uIHRvIHZhbGlkIHZhbHVlczogXCJzdGVwbGVzc1wiLCBcInN0ZXBwZWRcIiAqL1xyXG4gICAgICAgIF9maW5kU2Nyb2xsQnV0dG9uc1R5cGU9ZnVuY3Rpb24odmFsKXtcclxuICAgICAgICAgICAgcmV0dXJuICh2YWw9PT1cInN0ZXBwZWRcIiB8fCB2YWw9PT1cInBpeGVsc1wiIHx8IHZhbD09PVwic3RlcFwiIHx8IHZhbD09PVwiY2xpY2tcIikgPyBcInN0ZXBwZWRcIiA6IFwic3RlcGxlc3NcIjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiBnZW5lcmF0ZXMgcGx1Z2luIG1hcmt1cCAqL1xyXG4gICAgICAgIF9wbHVnaW5NYXJrdXA9ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksbz1kLm9wdCxcclxuICAgICAgICAgICAgICAgIGV4cGFuZENsYXNzPW8uYXV0b0V4cGFuZFNjcm9sbGJhciA/IFwiIFwiK2NsYXNzZXNbMV0rXCJfZXhwYW5kXCIgOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyPVtcIjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyX3ZlcnRpY2FsJyBjbGFzcz0nbUNTQl9zY3JvbGxUb29scyBtQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhciBtQ1MtXCIrby50aGVtZStcIiBtQ1NCX3Njcm9sbFRvb2xzX3ZlcnRpY2FsXCIrZXhwYW5kQ2xhc3MrXCInPjxkaXYgY2xhc3M9J1wiK2NsYXNzZXNbMTJdK1wiJz48ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWwnIGNsYXNzPSdtQ1NCX2RyYWdnZXInIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTsnIG9uY29udGV4dG1lbnU9J3JldHVybiBmYWxzZTsnPjxkaXYgY2xhc3M9J21DU0JfZHJhZ2dlcl9iYXInIC8+PC9kaXY+PGRpdiBjbGFzcz0nbUNTQl9kcmFnZ2VyUmFpbCcgLz48L2Rpdj48L2Rpdj5cIixcIjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyX2hvcml6b250YWwnIGNsYXNzPSdtQ1NCX3Njcm9sbFRvb2xzIG1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyIG1DUy1cIitvLnRoZW1lK1wiIG1DU0Jfc2Nyb2xsVG9vbHNfaG9yaXpvbnRhbFwiK2V4cGFuZENsYXNzK1wiJz48ZGl2IGNsYXNzPSdcIitjbGFzc2VzWzEyXStcIic+PGRpdiBpZD0nbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWwnIGNsYXNzPSdtQ1NCX2RyYWdnZXInIHN0eWxlPSdwb3NpdGlvbjphYnNvbHV0ZTsnIG9uY29udGV4dG1lbnU9J3JldHVybiBmYWxzZTsnPjxkaXYgY2xhc3M9J21DU0JfZHJhZ2dlcl9iYXInIC8+PC9kaXY+PGRpdiBjbGFzcz0nbUNTQl9kcmFnZ2VyUmFpbCcgLz48L2Rpdj48L2Rpdj5cIl0sXHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyQ2xhc3M9by5heGlzPT09XCJ5eFwiID8gXCJtQ1NCX3ZlcnRpY2FsX2hvcml6b250YWxcIiA6IG8uYXhpcz09PVwieFwiID8gXCJtQ1NCX2hvcml6b250YWxcIiA6IFwibUNTQl92ZXJ0aWNhbFwiLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFycz1vLmF4aXM9PT1cInl4XCIgPyBzY3JvbGxiYXJbMF0rc2Nyb2xsYmFyWzFdIDogby5heGlzPT09XCJ4XCIgPyBzY3JvbGxiYXJbMV0gOiBzY3JvbGxiYXJbMF0sXHJcbiAgICAgICAgICAgICAgICBjb250ZW50V3JhcHBlcj1vLmF4aXM9PT1cInl4XCIgPyBcIjxkaXYgaWQ9J21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyX3dyYXBwZXInIGNsYXNzPSdtQ1NCX2NvbnRhaW5lcl93cmFwcGVyJyAvPlwiIDogXCJcIixcclxuICAgICAgICAgICAgICAgIGF1dG9IaWRlQ2xhc3M9by5hdXRvSGlkZVNjcm9sbGJhciA/IFwiIFwiK2NsYXNzZXNbNl0gOiBcIlwiLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyRGlyQ2xhc3M9KG8uYXhpcyE9PVwieFwiICYmIGQubGFuZ0Rpcj09PVwicnRsXCIpID8gXCIgXCIrY2xhc3Nlc1s3XSA6IFwiXCI7XHJcbiAgICAgICAgICAgIGlmKG8uc2V0V2lkdGgpeyR0aGlzLmNzcyhcIndpZHRoXCIsby5zZXRXaWR0aCk7fSAvKiBzZXQgZWxlbWVudCB3aWR0aCAqL1xyXG4gICAgICAgICAgICBpZihvLnNldEhlaWdodCl7JHRoaXMuY3NzKFwiaGVpZ2h0XCIsby5zZXRIZWlnaHQpO30gLyogc2V0IGVsZW1lbnQgaGVpZ2h0ICovXHJcbiAgICAgICAgICAgIG8uc2V0TGVmdD0oby5heGlzIT09XCJ5XCIgJiYgZC5sYW5nRGlyPT09XCJydGxcIikgPyBcIjk4OTk5OXB4XCIgOiBvLnNldExlZnQ7IC8qIGFkanVzdCBsZWZ0IHBvc2l0aW9uIGZvciBydGwgZGlyZWN0aW9uICovXHJcbiAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKHBsdWdpbk5TK1wiIF9cIitwbHVnaW5QZngrXCJfXCIrZC5pZHgrYXV0b0hpZGVDbGFzcytzY3JvbGxiYXJEaXJDbGFzcykud3JhcElubmVyKFwiPGRpdiBpZD0nbUNTQl9cIitkLmlkeCtcIicgY2xhc3M9J21DdXN0b21TY3JvbGxCb3ggbUNTLVwiK28udGhlbWUrXCIgXCIrd3JhcHBlckNsYXNzK1wiJz48ZGl2IGlkPSdtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lcicgY2xhc3M9J21DU0JfY29udGFpbmVyJyBzdHlsZT0ncG9zaXRpb246cmVsYXRpdmU7IHRvcDpcIitvLnNldFRvcCtcIjsgbGVmdDpcIitvLnNldExlZnQrXCI7JyBkaXI9XCIrZC5sYW5nRGlyK1wiIC8+PC9kaXY+XCIpO1xyXG4gICAgICAgICAgICB2YXIgbUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKTtcclxuICAgICAgICAgICAgaWYoby5heGlzIT09XCJ5XCIgJiYgIW8uYWR2YW5jZWQuYXV0b0V4cGFuZEhvcml6b250YWxTY3JvbGwpe1xyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXIuY3NzKFwid2lkdGhcIixfY29udGVudFdpZHRoKG1DU0JfY29udGFpbmVyKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoby5zY3JvbGxiYXJQb3NpdGlvbj09PVwib3V0c2lkZVwiKXtcclxuICAgICAgICAgICAgICAgIGlmKCR0aGlzLmNzcyhcInBvc2l0aW9uXCIpPT09XCJzdGF0aWNcIil7IC8qIHJlcXVpcmVzIGVsZW1lbnRzIHdpdGggbm9uLXN0YXRpYyBwb3NpdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmNzcyhcInBvc2l0aW9uXCIsXCJyZWxhdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICR0aGlzLmNzcyhcIm92ZXJmbG93XCIsXCJ2aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgbUN1c3RvbVNjcm9sbEJveC5hZGRDbGFzcyhcIm1DU0Jfb3V0c2lkZVwiKS5hZnRlcihzY3JvbGxiYXJzKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94LmFkZENsYXNzKFwibUNTQl9pbnNpZGVcIikuYXBwZW5kKHNjcm9sbGJhcnMpO1xyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXIud3JhcChjb250ZW50V3JhcHBlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgX3Njcm9sbEJ1dHRvbnMuY2FsbCh0aGlzKTsgLyogYWRkIHNjcm9sbGJhciBidXR0b25zICovXHJcbiAgICAgICAgICAgIC8qIG1pbmltdW0gZHJhZ2dlciBsZW5ndGggKi9cclxuICAgICAgICAgICAgdmFyIG1DU0JfZHJhZ2dlcj1bJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWxcIiksJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfaG9yaXpvbnRhbFwiKV07XHJcbiAgICAgICAgICAgIG1DU0JfZHJhZ2dlclswXS5jc3MoXCJtaW4taGVpZ2h0XCIsbUNTQl9kcmFnZ2VyWzBdLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgbUNTQl9kcmFnZ2VyWzFdLmNzcyhcIm1pbi13aWR0aFwiLG1DU0JfZHJhZ2dlclsxXS53aWR0aCgpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiBjYWxjdWxhdGVzIGNvbnRlbnQgd2lkdGggKi9cclxuICAgICAgICBfY29udGVudFdpZHRoPWZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgICAgdmFyIHZhbD1bZWxbMF0uc2Nyb2xsV2lkdGgsTWF0aC5tYXguYXBwbHkoTWF0aCxlbC5jaGlsZHJlbigpLm1hcChmdW5jdGlvbigpe3JldHVybiAkKHRoaXMpLm91dGVyV2lkdGgodHJ1ZSk7fSkuZ2V0KCkpXSx3PWVsLnBhcmVudCgpLndpZHRoKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB2YWxbMF0+dyA/IHZhbFswXSA6IHZhbFsxXT53ID8gdmFsWzFdIDogXCIxMDAlXCI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogZXhwYW5kcyBjb250ZW50IGhvcml6b250YWxseSAqL1xyXG4gICAgICAgIF9leHBhbmRDb250ZW50SG9yaXpvbnRhbGx5PWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpO1xyXG4gICAgICAgICAgICBpZihvLmFkdmFuY2VkLmF1dG9FeHBhbmRIb3Jpem9udGFsU2Nyb2xsICYmIG8uYXhpcyE9PVwieVwiKXtcclxuICAgICAgICAgICAgICAgIC8qIGNhbGN1bGF0ZSBzY3JvbGxXaWR0aCAqL1xyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXIuY3NzKHtcIndpZHRoXCI6XCJhdXRvXCIsXCJtaW4td2lkdGhcIjowLFwib3ZlcmZsb3cteFwiOlwic2Nyb2xsXCJ9KTtcclxuICAgICAgICAgICAgICAgIHZhciB3PU1hdGguY2VpbChtQ1NCX2NvbnRhaW5lclswXS5zY3JvbGxXaWR0aCk7XHJcbiAgICAgICAgICAgICAgICBpZihvLmFkdmFuY2VkLmF1dG9FeHBhbmRIb3Jpem9udGFsU2Nyb2xsPT09MyB8fCAoby5hZHZhbmNlZC5hdXRvRXhwYW5kSG9yaXpvbnRhbFNjcm9sbCE9PTIgJiYgdz5tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKS53aWR0aCgpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXIuY3NzKHtcIndpZHRoXCI6dyxcIm1pbi13aWR0aFwiOlwiMTAwJVwiLFwib3ZlcmZsb3cteFwiOlwiaW5oZXJpdFwifSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgICAgIHdyYXAgY29udGVudCB3aXRoIGFuIGluZmluaXRlIHdpZHRoIGRpdiBhbmQgc2V0IGl0cyBwb3NpdGlvbiB0byBhYnNvbHV0ZSBhbmQgd2lkdGggdG8gYXV0by5cclxuICAgICAgICAgICAgICAgICAgICBTZXR0aW5nIHdpZHRoIHRvIGF1dG8gYmVmb3JlIGNhbGN1bGF0aW5nIHRoZSBhY3R1YWwgd2lkdGggaXMgaW1wb3J0YW50IVxyXG4gICAgICAgICAgICAgICAgICAgIFdlIG11c3QgbGV0IHRoZSBicm93c2VyIHNldCB0aGUgd2lkdGggYXMgYnJvd3NlciB6b29tIHZhbHVlcyBhcmUgaW1wb3NzaWJsZSB0byBjYWxjdWxhdGUuXHJcbiAgICAgICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lci5jc3Moe1wib3ZlcmZsb3cteFwiOlwiaW5oZXJpdFwiLFwicG9zaXRpb25cIjpcImFic29sdXRlXCJ9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAud3JhcChcIjxkaXYgY2xhc3M9J21DU0JfaF93cmFwcGVyJyBzdHlsZT0ncG9zaXRpb246cmVsYXRpdmU7IGxlZnQ6MDsgd2lkdGg6OTk5OTk5cHg7JyAvPlwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAuY3NzKHsgLyogc2V0IGFjdHVhbCB3aWR0aCwgb3JpZ2luYWwgcG9zaXRpb24gYW5kIHVuLXdyYXAgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnZXQgdGhlIGV4YWN0IHdpZHRoICh3aXRoIGRlY2ltYWxzKSBhbmQgdGhlbiByb3VuZC11cC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFVzaW5nIGpxdWVyeSBvdXRlcldpZHRoKCkgd2lsbCByb3VuZCB0aGUgd2lkdGggdmFsdWUgd2hpY2ggd2lsbCBtZXNzIHVwIHdpdGggaW5uZXIgZWxlbWVudHMgdGhhdCBoYXZlIG5vbi1pbnRlZ2VyIHdpZHRoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ3aWR0aFwiOihNYXRoLmNlaWwobUNTQl9jb250YWluZXJbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkucmlnaHQrMC40KS1NYXRoLmZsb29yKG1DU0JfY29udGFpbmVyWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibWluLXdpZHRoXCI6XCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBvc2l0aW9uXCI6XCJyZWxhdGl2ZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnVud3JhcCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogYWRkcyBzY3JvbGxiYXIgYnV0dG9ucyAqL1xyXG4gICAgICAgIF9zY3JvbGxCdXR0b25zPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBtQ1NCX3Njcm9sbFRvb2xzPSQoXCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXI6Zmlyc3RcIiksXHJcbiAgICAgICAgICAgICAgICB0YWJpbmRleD0hX2lzTnVtZXJpYyhvLnNjcm9sbEJ1dHRvbnMudGFiaW5kZXgpID8gXCJcIiA6IFwidGFiaW5kZXg9J1wiK28uc2Nyb2xsQnV0dG9ucy50YWJpbmRleCtcIidcIixcclxuICAgICAgICAgICAgICAgIGJ0bkhUTUw9W1xyXG4gICAgICAgICAgICAgICAgICAgIFwiPGEgaHJlZj0nIycgY2xhc3M9J1wiK2NsYXNzZXNbMTNdK1wiJyBvbmNvbnRleHRtZW51PSdyZXR1cm4gZmFsc2U7JyBcIit0YWJpbmRleCtcIiAvPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPGEgaHJlZj0nIycgY2xhc3M9J1wiK2NsYXNzZXNbMTRdK1wiJyBvbmNvbnRleHRtZW51PSdyZXR1cm4gZmFsc2U7JyBcIit0YWJpbmRleCtcIiAvPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPGEgaHJlZj0nIycgY2xhc3M9J1wiK2NsYXNzZXNbMTVdK1wiJyBvbmNvbnRleHRtZW51PSdyZXR1cm4gZmFsc2U7JyBcIit0YWJpbmRleCtcIiAvPlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiPGEgaHJlZj0nIycgY2xhc3M9J1wiK2NsYXNzZXNbMTZdK1wiJyBvbmNvbnRleHRtZW51PSdyZXR1cm4gZmFsc2U7JyBcIit0YWJpbmRleCtcIiAvPlwiXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgYnRuPVsoby5heGlzPT09XCJ4XCIgPyBidG5IVE1MWzJdIDogYnRuSFRNTFswXSksKG8uYXhpcz09PVwieFwiID8gYnRuSFRNTFszXSA6IGJ0bkhUTUxbMV0pLGJ0bkhUTUxbMl0sYnRuSFRNTFszXV07XHJcbiAgICAgICAgICAgIGlmKG8uc2Nyb2xsQnV0dG9ucy5lbmFibGUpe1xyXG4gICAgICAgICAgICAgICAgbUNTQl9zY3JvbGxUb29scy5wcmVwZW5kKGJ0blswXSkuYXBwZW5kKGJ0blsxXSkubmV4dChcIi5tQ1NCX3Njcm9sbFRvb2xzXCIpLnByZXBlbmQoYnRuWzJdKS5hcHBlbmQoYnRuWzNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGF1dG8tYWRqdXN0cyBzY3JvbGxiYXIgZHJhZ2dlciBsZW5ndGggKi9cclxuICAgICAgICBfc2V0RHJhZ2dlckxlbmd0aD1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxcclxuICAgICAgICAgICAgICAgIG1DdXN0b21TY3JvbGxCb3g9JChcIiNtQ1NCX1wiK2QuaWR4KSxcclxuICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2RyYWdnZXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsXCIpLCQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIildLFxyXG4gICAgICAgICAgICAgICAgcmF0aW89W21DdXN0b21TY3JvbGxCb3guaGVpZ2h0KCkvbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpLG1DdXN0b21TY3JvbGxCb3gud2lkdGgoKS9tQ1NCX2NvbnRhaW5lci5vdXRlcldpZHRoKGZhbHNlKV0sXHJcbiAgICAgICAgICAgICAgICBsPVtcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludChtQ1NCX2RyYWdnZXJbMF0uY3NzKFwibWluLWhlaWdodFwiKSksTWF0aC5yb3VuZChyYXRpb1swXSptQ1NCX2RyYWdnZXJbMF0ucGFyZW50KCkuaGVpZ2h0KCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KG1DU0JfZHJhZ2dlclsxXS5jc3MoXCJtaW4td2lkdGhcIikpLE1hdGgucm91bmQocmF0aW9bMV0qbUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCkpXHJcbiAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgaD1vbGRJRSAmJiAobFsxXTxsWzBdKSA/IGxbMF0gOiBsWzFdLHc9b2xkSUUgJiYgKGxbM108bFsyXSkgPyBsWzJdIDogbFszXTtcclxuICAgICAgICAgICAgbUNTQl9kcmFnZ2VyWzBdLmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcImhlaWdodFwiOmgsXCJtYXgtaGVpZ2h0XCI6KG1DU0JfZHJhZ2dlclswXS5wYXJlbnQoKS5oZWlnaHQoKS0xMClcclxuICAgICAgICAgICAgfSkuZmluZChcIi5tQ1NCX2RyYWdnZXJfYmFyXCIpLmNzcyh7XCJsaW5lLWhlaWdodFwiOmxbMF0rXCJweFwifSk7XHJcbiAgICAgICAgICAgIG1DU0JfZHJhZ2dlclsxXS5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJ3aWR0aFwiOncsXCJtYXgtd2lkdGhcIjoobUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCktMTApXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGNhbGN1bGF0ZXMgc2Nyb2xsYmFyIHRvIGNvbnRlbnQgcmF0aW8gKi9cclxuICAgICAgICBfc2Nyb2xsUmF0aW89ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksXHJcbiAgICAgICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9kcmFnZ2VyPVskKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiKSwkKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCIpXSxcclxuICAgICAgICAgICAgICAgIHNjcm9sbEFtb3VudD1bbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpLW1DdXN0b21TY3JvbGxCb3guaGVpZ2h0KCksbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSktbUN1c3RvbVNjcm9sbEJveC53aWR0aCgpXSxcclxuICAgICAgICAgICAgICAgIHJhdGlvPVtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxBbW91bnRbMF0vKG1DU0JfZHJhZ2dlclswXS5wYXJlbnQoKS5oZWlnaHQoKS1tQ1NCX2RyYWdnZXJbMF0uaGVpZ2h0KCkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbEFtb3VudFsxXS8obUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCktbUNTQl9kcmFnZ2VyWzFdLndpZHRoKCkpXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICBkLnNjcm9sbFJhdGlvPXt5OnJhdGlvWzBdLHg6cmF0aW9bMV19O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIHRvZ2dsZXMgc2Nyb2xsaW5nIGNsYXNzZXMgKi9cclxuICAgICAgICBfb25EcmFnQ2xhc3Nlcz1mdW5jdGlvbihlbCxhY3Rpb24seHBuZCl7XHJcbiAgICAgICAgICAgIHZhciBleHBhbmRDbGFzcz14cG5kID8gY2xhc3Nlc1swXStcIl9leHBhbmRlZFwiIDogXCJcIixcclxuICAgICAgICAgICAgICAgIHNjcm9sbGJhcj1lbC5jbG9zZXN0KFwiLm1DU0Jfc2Nyb2xsVG9vbHNcIik7XHJcbiAgICAgICAgICAgIGlmKGFjdGlvbj09PVwiYWN0aXZlXCIpe1xyXG4gICAgICAgICAgICAgICAgZWwudG9nZ2xlQ2xhc3MoY2xhc3Nlc1swXStcIiBcIitleHBhbmRDbGFzcyk7IHNjcm9sbGJhci50b2dnbGVDbGFzcyhjbGFzc2VzWzFdKTtcclxuICAgICAgICAgICAgICAgIGVsWzBdLl9kcmFnZ2FibGU9ZWxbMF0uX2RyYWdnYWJsZSA/IDAgOiAxO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGlmKCFlbFswXS5fZHJhZ2dhYmxlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihhY3Rpb249PT1cImhpZGVcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLnJlbW92ZUNsYXNzKGNsYXNzZXNbMF0pOyBzY3JvbGxiYXIucmVtb3ZlQ2xhc3MoY2xhc3Nlc1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLmFkZENsYXNzKGNsYXNzZXNbMF0pOyBzY3JvbGxiYXIuYWRkQ2xhc3MoY2xhc3Nlc1sxXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogY2hlY2tzIGlmIGNvbnRlbnQgb3ZlcmZsb3dzIGl0cyBjb250YWluZXIgdG8gZGV0ZXJtaW5lIGlmIHNjcm9sbGluZyBpcyByZXF1aXJlZCAqL1xyXG4gICAgICAgIF9vdmVyZmxvd2VkPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLFxyXG4gICAgICAgICAgICAgICAgbUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuICAgICAgICAgICAgICAgIGNvbnRlbnRIZWlnaHQ9ZC5vdmVyZmxvd2VkPT1udWxsID8gbUNTQl9jb250YWluZXIuaGVpZ2h0KCkgOiBtQ1NCX2NvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSksXHJcbiAgICAgICAgICAgICAgICBjb250ZW50V2lkdGg9ZC5vdmVyZmxvd2VkPT1udWxsID8gbUNTQl9jb250YWluZXIud2lkdGgoKSA6IG1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgaD1tQ1NCX2NvbnRhaW5lclswXS5zY3JvbGxIZWlnaHQsdz1tQ1NCX2NvbnRhaW5lclswXS5zY3JvbGxXaWR0aDtcclxuICAgICAgICAgICAgaWYoaD5jb250ZW50SGVpZ2h0KXtjb250ZW50SGVpZ2h0PWg7fVxyXG4gICAgICAgICAgICBpZih3PmNvbnRlbnRXaWR0aCl7Y29udGVudFdpZHRoPXc7fVxyXG4gICAgICAgICAgICByZXR1cm4gW2NvbnRlbnRIZWlnaHQ+bUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSxjb250ZW50V2lkdGg+bUN1c3RvbVNjcm9sbEJveC53aWR0aCgpXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiByZXNldHMgY29udGVudCBwb3NpdGlvbiB0byAwICovXHJcbiAgICAgICAgX3Jlc2V0Q29udGVudFBvc2l0aW9uPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9kcmFnZ2VyPVskKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiKSwkKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCIpXTtcclxuICAgICAgICAgICAgX3N0b3AoJHRoaXMpOyAvKiBzdG9wIGFueSBjdXJyZW50IHNjcm9sbGluZyBiZWZvcmUgcmVzZXR0aW5nICovXHJcbiAgICAgICAgICAgIGlmKChvLmF4aXMhPT1cInhcIiAmJiAhZC5vdmVyZmxvd2VkWzBdKSB8fCAoby5heGlzPT09XCJ5XCIgJiYgZC5vdmVyZmxvd2VkWzBdKSl7IC8qIHJlc2V0IHkgKi9cclxuICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlclswXS5hZGQobUNTQl9jb250YWluZXIpLmNzcyhcInRvcFwiLDApO1xyXG4gICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLFwiX3Jlc2V0WVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZigoby5heGlzIT09XCJ5XCIgJiYgIWQub3ZlcmZsb3dlZFsxXSkgfHwgKG8uYXhpcz09PVwieFwiICYmIGQub3ZlcmZsb3dlZFsxXSkpeyAvKiByZXNldCB4ICovXHJcbiAgICAgICAgICAgICAgICB2YXIgY3g9ZHg9MDtcclxuICAgICAgICAgICAgICAgIGlmKGQubGFuZ0Rpcj09PVwicnRsXCIpeyAvKiBhZGp1c3QgbGVmdCBwb3NpdGlvbiBmb3IgcnRsIGRpcmVjdGlvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGN4PW1DdXN0b21TY3JvbGxCb3gud2lkdGgoKS1tQ1NCX2NvbnRhaW5lci5vdXRlcldpZHRoKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICBkeD1NYXRoLmFicyhjeC9kLnNjcm9sbFJhdGlvLngpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXIuY3NzKFwibGVmdFwiLGN4KTtcclxuICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlclsxXS5jc3MoXCJsZWZ0XCIsZHgpO1xyXG4gICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLFwiX3Jlc2V0WFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGJpbmRzIHNjcm9sbGJhciBldmVudHMgKi9cclxuICAgICAgICBfYmluZEV2ZW50cz1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0O1xyXG4gICAgICAgICAgICBpZighZC5iaW5kRXZlbnRzKXsgLyogY2hlY2sgaWYgZXZlbnRzIGFyZSBhbHJlYWR5IGJvdW5kICovXHJcbiAgICAgICAgICAgICAgICBfZHJhZ2dhYmxlLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZihvLmNvbnRlbnRUb3VjaFNjcm9sbCl7X2NvbnRlbnREcmFnZ2FibGUuY2FsbCh0aGlzKTt9XHJcbiAgICAgICAgICAgICAgICBfc2VsZWN0YWJsZS5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYoby5tb3VzZVdoZWVsLmVuYWJsZSl7IC8qIGJpbmQgbW91c2V3aGVlbCBmbiB3aGVuIHBsdWdpbiBpcyBhdmFpbGFibGUgKi9cclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBfbXd0KCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vdXNld2hlZWxUaW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCEkLmV2ZW50LnNwZWNpYWwubW91c2V3aGVlbCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX213dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KG1vdXNld2hlZWxUaW1lb3V0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfbW91c2V3aGVlbC5jYWxsKCR0aGlzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwxMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB2YXIgbW91c2V3aGVlbFRpbWVvdXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgX213dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX2RyYWdnZXJSYWlsLmNhbGwodGhpcyk7XHJcbiAgICAgICAgICAgICAgICBfd3JhcHBlclNjcm9sbC5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYoby5hZHZhbmNlZC5hdXRvU2Nyb2xsT25Gb2N1cyl7X2ZvY3VzLmNhbGwodGhpcyk7fVxyXG4gICAgICAgICAgICAgICAgaWYoby5zY3JvbGxCdXR0b25zLmVuYWJsZSl7X2J1dHRvbnMuY2FsbCh0aGlzKTt9XHJcbiAgICAgICAgICAgICAgICBpZihvLmtleWJvYXJkLmVuYWJsZSl7X2tleWJvYXJkLmNhbGwodGhpcyk7fVxyXG4gICAgICAgICAgICAgICAgZC5iaW5kRXZlbnRzPXRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiB1bmJpbmRzIHNjcm9sbGJhciBldmVudHMgKi9cclxuICAgICAgICBfdW5iaW5kRXZlbnRzPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG4gICAgICAgICAgICAgICAgc2I9XCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIixcclxuICAgICAgICAgICAgICAgIHNlbD0kKFwiI21DU0JfXCIrZC5pZHgrXCIsI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyLCNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lcl93cmFwcGVyLFwiK3NiK1wiIC5cIitjbGFzc2VzWzEyXStcIiwjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX3ZlcnRpY2FsLCNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfaG9yaXpvbnRhbCxcIitzYitcIj5hXCIpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKTtcclxuICAgICAgICAgICAgaWYoby5hZHZhbmNlZC5yZWxlYXNlRHJhZ2dhYmxlU2VsZWN0b3JzKXtzZWwuYWRkKCQoby5hZHZhbmNlZC5yZWxlYXNlRHJhZ2dhYmxlU2VsZWN0b3JzKSk7fVxyXG4gICAgICAgICAgICBpZihvLmFkdmFuY2VkLmV4dHJhRHJhZ2dhYmxlU2VsZWN0b3JzKXtzZWwuYWRkKCQoby5hZHZhbmNlZC5leHRyYURyYWdnYWJsZVNlbGVjdG9ycykpO31cclxuICAgICAgICAgICAgaWYoZC5iaW5kRXZlbnRzKXsgLyogY2hlY2sgaWYgZXZlbnRzIGFyZSBib3VuZCAqL1xyXG4gICAgICAgICAgICAgICAgLyogdW5iaW5kIG5hbWVzcGFjZWQgZXZlbnRzIGZyb20gZG9jdW1lbnQvc2VsZWN0b3JzICovXHJcbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50KS5hZGQoJCghX2NhbkFjY2Vzc0lGcmFtZSgpIHx8IHRvcC5kb2N1bWVudCkpLnVuYmluZChcIi5cIituYW1lc3BhY2UpO1xyXG4gICAgICAgICAgICAgICAgc2VsLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnVuYmluZChcIi5cIituYW1lc3BhY2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvKiBjbGVhciBhbmQgZGVsZXRlIHRpbWVvdXRzL29iamVjdHMgKi9cclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCgkdGhpc1swXS5fZm9jdXNUaW1lb3V0KTsgX2RlbGV0ZSgkdGhpc1swXSxcIl9mb2N1c1RpbWVvdXRcIik7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoZC5zZXF1ZW50aWFsLnN0ZXApOyBfZGVsZXRlKGQuc2VxdWVudGlhbCxcInN0ZXBcIik7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobUNTQl9jb250YWluZXJbMF0ub25Db21wbGV0ZVRpbWVvdXQpOyBfZGVsZXRlKG1DU0JfY29udGFpbmVyWzBdLFwib25Db21wbGV0ZVRpbWVvdXRcIik7XHJcbiAgICAgICAgICAgICAgICBkLmJpbmRFdmVudHM9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiB0b2dnbGVzIHNjcm9sbGJhciB2aXNpYmlsaXR5ICovXHJcbiAgICAgICAgX3Njcm9sbGJhclZpc2liaWxpdHk9ZnVuY3Rpb24oZGlzYWJsZWQpe1xyXG4gICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG4gICAgICAgICAgICAgICAgY29udGVudFdyYXBwZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lcl93cmFwcGVyXCIpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudD1jb250ZW50V3JhcHBlci5sZW5ndGggPyBjb250ZW50V3JhcHBlciA6ICQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXI9WyQoXCIjbUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJfdmVydGljYWxcIiksJChcIiNtQ1NCX1wiK2QuaWR4K1wiX3Njcm9sbGJhcl9ob3Jpem9udGFsXCIpXSxcclxuICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlcj1bc2Nyb2xsYmFyWzBdLmZpbmQoXCIubUNTQl9kcmFnZ2VyXCIpLHNjcm9sbGJhclsxXS5maW5kKFwiLm1DU0JfZHJhZ2dlclwiKV07XHJcbiAgICAgICAgICAgIGlmKG8uYXhpcyE9PVwieFwiKXtcclxuICAgICAgICAgICAgICAgIGlmKGQub3ZlcmZsb3dlZFswXSAmJiAhZGlzYWJsZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbGJhclswXS5hZGQobUNTQl9kcmFnZ2VyWzBdKS5hZGQoc2Nyb2xsYmFyWzBdLmNoaWxkcmVuKFwiYVwiKSkuY3NzKFwiZGlzcGxheVwiLFwiYmxvY2tcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudC5yZW1vdmVDbGFzcyhjbGFzc2VzWzhdK1wiIFwiK2NsYXNzZXNbMTBdKTtcclxuICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG8uYWx3YXlzU2hvd1Njcm9sbGJhcil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG8uYWx3YXlzU2hvd1Njcm9sbGJhciE9PTIpe21DU0JfZHJhZ2dlclswXS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO31cclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudC5yZW1vdmVDbGFzcyhjbGFzc2VzWzEwXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbGJhclswXS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50LmFkZENsYXNzKGNsYXNzZXNbMTBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudC5hZGRDbGFzcyhjbGFzc2VzWzhdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihvLmF4aXMhPT1cInlcIil7XHJcbiAgICAgICAgICAgICAgICBpZihkLm92ZXJmbG93ZWRbMV0gJiYgIWRpc2FibGVkKXtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxiYXJbMV0uYWRkKG1DU0JfZHJhZ2dlclsxXSkuYWRkKHNjcm9sbGJhclsxXS5jaGlsZHJlbihcImFcIikpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucmVtb3ZlQ2xhc3MoY2xhc3Nlc1s5XStcIiBcIitjbGFzc2VzWzExXSk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICBpZihvLmFsd2F5c1Nob3dTY3JvbGxiYXIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihvLmFsd2F5c1Nob3dTY3JvbGxiYXIhPT0yKXttQ1NCX2RyYWdnZXJbMV0uY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQucmVtb3ZlQ2xhc3MoY2xhc3Nlc1sxMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxiYXJbMV0uY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudC5hZGRDbGFzcyhjbGFzc2VzWzExXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQuYWRkQ2xhc3MoY2xhc3Nlc1s5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoIWQub3ZlcmZsb3dlZFswXSAmJiAhZC5vdmVyZmxvd2VkWzFdKXtcclxuICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKGNsYXNzZXNbNV0pO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICR0aGlzLnJlbW92ZUNsYXNzKGNsYXNzZXNbNV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogcmV0dXJucyBpbnB1dCBjb29yZGluYXRlcyBvZiBwb2ludGVyLCB0b3VjaCBhbmQgbW91c2UgZXZlbnRzIChyZWxhdGl2ZSB0byBkb2N1bWVudCkgKi9cclxuICAgICAgICBfY29vcmRpbmF0ZXM9ZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHZhciB0PWUudHlwZSxvPWUudGFyZ2V0Lm93bmVyRG9jdW1lbnQhPT1kb2N1bWVudCA/IFskKGZyYW1lRWxlbWVudCkub2Zmc2V0KCkudG9wLCQoZnJhbWVFbGVtZW50KS5vZmZzZXQoKS5sZWZ0XSA6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBpbz1fY2FuQWNjZXNzSUZyYW1lKCkgJiYgZS50YXJnZXQub3duZXJEb2N1bWVudCE9PXRvcC5kb2N1bWVudCA/IFskKGUudmlldy5mcmFtZUVsZW1lbnQpLm9mZnNldCgpLnRvcCwkKGUudmlldy5mcmFtZUVsZW1lbnQpLm9mZnNldCgpLmxlZnRdIDogWzAsMF07XHJcbiAgICAgICAgICAgIHN3aXRjaCh0KXtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJwb2ludGVyZG93blwiOiBjYXNlIFwiTVNQb2ludGVyRG93blwiOiBjYXNlIFwicG9pbnRlcm1vdmVcIjogY2FzZSBcIk1TUG9pbnRlck1vdmVcIjogY2FzZSBcInBvaW50ZXJ1cFwiOiBjYXNlIFwiTVNQb2ludGVyVXBcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbyA/IFtlLm9yaWdpbmFsRXZlbnQucGFnZVktb1swXStpb1swXSxlLm9yaWdpbmFsRXZlbnQucGFnZVgtb1sxXStpb1sxXSxmYWxzZV0gOiBbZS5vcmlnaW5hbEV2ZW50LnBhZ2VZLGUub3JpZ2luYWxFdmVudC5wYWdlWCxmYWxzZV07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidG91Y2hzdGFydFwiOiBjYXNlIFwidG91Y2htb3ZlXCI6IGNhc2UgXCJ0b3VjaGVuZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0b3VjaD1lLm9yaWdpbmFsRXZlbnQudG91Y2hlc1swXSB8fCBlLm9yaWdpbmFsRXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdWNoZXM9ZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoIHx8IGUub3JpZ2luYWxFdmVudC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGUudGFyZ2V0Lm93bmVyRG9jdW1lbnQhPT1kb2N1bWVudCA/IFt0b3VjaC5zY3JlZW5ZLHRvdWNoLnNjcmVlblgsdG91Y2hlcz4xXSA6IFt0b3VjaC5wYWdlWSx0b3VjaC5wYWdlWCx0b3VjaGVzPjFdO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbyA/IFtlLnBhZ2VZLW9bMF0raW9bMF0sZS5wYWdlWC1vWzFdK2lvWzFdLGZhbHNlXSA6IFtlLnBhZ2VZLGUucGFnZVgsZmFsc2VdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBTQ1JPTExCQVIgRFJBRyBFVkVOVFNcclxuICAgICAgICBzY3JvbGxzIGNvbnRlbnQgdmlhIHNjcm9sbGJhciBkcmFnZ2luZ1xyXG4gICAgICAgICovXHJcbiAgICAgICAgX2RyYWdnYWJsZT1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlPXBsdWdpblBmeCtcIl9cIitkLmlkeCxcclxuICAgICAgICAgICAgICAgIGRyYWdnZXJJZD1bXCJtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWxcIixcIm1DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCJdLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlcj0kKFwiI1wiK2RyYWdnZXJJZFswXStcIiwjXCIrZHJhZ2dlcklkWzFdKSxcclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZSxkcmFnWSxkcmFnWCxcclxuICAgICAgICAgICAgICAgIHJkcz1vLmFkdmFuY2VkLnJlbGVhc2VEcmFnZ2FibGVTZWxlY3RvcnMgPyBtQ1NCX2RyYWdnZXIuYWRkKCQoby5hZHZhbmNlZC5yZWxlYXNlRHJhZ2dhYmxlU2VsZWN0b3JzKSkgOiBtQ1NCX2RyYWdnZXIsXHJcbiAgICAgICAgICAgICAgICBlZHM9by5hZHZhbmNlZC5leHRyYURyYWdnYWJsZVNlbGVjdG9ycyA/ICQoIV9jYW5BY2Nlc3NJRnJhbWUoKSB8fCB0b3AuZG9jdW1lbnQpLmFkZCgkKG8uYWR2YW5jZWQuZXh0cmFEcmFnZ2FibGVTZWxlY3RvcnMpKSA6ICQoIV9jYW5BY2Nlc3NJRnJhbWUoKSB8fCB0b3AuZG9jdW1lbnQpO1xyXG4gICAgICAgICAgICBtQ1NCX2RyYWdnZXIuYmluZChcIm1vdXNlZG93bi5cIituYW1lc3BhY2UrXCIgdG91Y2hzdGFydC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcmRvd24uXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlckRvd24uXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIGlmKCFfbW91c2VCdG5MZWZ0KGUpKXtyZXR1cm47fSAvKiBsZWZ0IG1vdXNlIGJ1dHRvbiBvbmx5ICovXHJcbiAgICAgICAgICAgICAgICB0b3VjaEFjdGl2ZT10cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYob2xkSUUpe2RvY3VtZW50Lm9uc2VsZWN0c3RhcnQ9ZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2U7fX0gLyogZGlzYWJsZSB0ZXh0IHNlbGVjdGlvbiBmb3IgSUUgPCA5ICovXHJcbiAgICAgICAgICAgICAgICBfaWZyYW1lKGZhbHNlKTsgLyogZW5hYmxlIHNjcm9sbGJhciBkcmFnZ2luZyBvdmVyIGlmcmFtZXMgYnkgZGlzYWJsaW5nIHRoZWlyIGV2ZW50cyAqL1xyXG4gICAgICAgICAgICAgICAgX3N0b3AoJHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgZHJhZ2dhYmxlPSQodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0PWRyYWdnYWJsZS5vZmZzZXQoKSx5PV9jb29yZGluYXRlcyhlKVswXS1vZmZzZXQudG9wLHg9X2Nvb3JkaW5hdGVzKGUpWzFdLW9mZnNldC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgIGg9ZHJhZ2dhYmxlLmhlaWdodCgpK29mZnNldC50b3Asdz1kcmFnZ2FibGUud2lkdGgoKStvZmZzZXQubGVmdDtcclxuICAgICAgICAgICAgICAgIGlmKHk8aCAmJiB5PjAgJiYgeDx3ICYmIHg+MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgZHJhZ1k9eTtcclxuICAgICAgICAgICAgICAgICAgICBkcmFnWD14O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgX29uRHJhZ0NsYXNzZXMoZHJhZ2dhYmxlLFwiYWN0aXZlXCIsby5hdXRvRXhwYW5kU2Nyb2xsYmFyKTtcclxuICAgICAgICAgICAgfSkuYmluZChcInRvdWNobW92ZS5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9mZnNldD1kcmFnZ2FibGUub2Zmc2V0KCkseT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcCx4PV9jb29yZGluYXRlcyhlKVsxXS1vZmZzZXQubGVmdDtcclxuICAgICAgICAgICAgICAgIF9kcmFnKGRyYWdZLGRyYWdYLHkseCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAkKGRvY3VtZW50KS5hZGQoZWRzKS5iaW5kKFwibW91c2Vtb3ZlLlwiK25hbWVzcGFjZStcIiBwb2ludGVybW92ZS5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyTW92ZS5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBpZihkcmFnZ2FibGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXQ9ZHJhZ2dhYmxlLm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZHJhZ1k9PT15ICYmIGRyYWdYPT09eCl7cmV0dXJuO30gLyogaGFzIGl0IHJlYWxseSBtb3ZlZD8gKi9cclxuICAgICAgICAgICAgICAgICAgICBfZHJhZyhkcmFnWSxkcmFnWCx5LHgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KS5hZGQocmRzKS5iaW5kKFwibW91c2V1cC5cIituYW1lc3BhY2UrXCIgdG91Y2hlbmQuXCIrbmFtZXNwYWNlK1wiIHBvaW50ZXJ1cC5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyVXAuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgaWYoZHJhZ2dhYmxlKXtcclxuICAgICAgICAgICAgICAgICAgICBfb25EcmFnQ2xhc3NlcyhkcmFnZ2FibGUsXCJhY3RpdmVcIixvLmF1dG9FeHBhbmRTY3JvbGxiYXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZT1udWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdG91Y2hBY3RpdmU9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZihvbGRJRSl7ZG9jdW1lbnQub25zZWxlY3RzdGFydD1udWxsO30gLyogZW5hYmxlIHRleHQgc2VsZWN0aW9uIGZvciBJRSA8IDkgKi9cclxuICAgICAgICAgICAgICAgIF9pZnJhbWUodHJ1ZSk7IC8qIGVuYWJsZSBpZnJhbWVzIGV2ZW50cyAqL1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gX2lmcmFtZShldnQpe1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsPW1DU0JfY29udGFpbmVyLmZpbmQoXCJpZnJhbWVcIik7XHJcbiAgICAgICAgICAgICAgICBpZighZWwubGVuZ3RoKXtyZXR1cm47fSAvKiBjaGVjayBpZiBjb250ZW50IGNvbnRhaW5zIGlmcmFtZXMgKi9cclxuICAgICAgICAgICAgICAgIHZhciB2YWw9IWV2dCA/IFwibm9uZVwiIDogXCJhdXRvXCI7XHJcbiAgICAgICAgICAgICAgICBlbC5jc3MoXCJwb2ludGVyLWV2ZW50c1wiLHZhbCk7IC8qIGZvciBJRTExLCBpZnJhbWUncyBkaXNwbGF5IHByb3BlcnR5IHNob3VsZCBub3QgYmUgXCJibG9ja1wiICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gX2RyYWcoZHJhZ1ksZHJhZ1gseSx4KXtcclxuICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyWzBdLmlkbGVUaW1lcj1vLnNjcm9sbEluZXJ0aWE8MjMzID8gMjUwIDogMDtcclxuICAgICAgICAgICAgICAgIGlmKGRyYWdnYWJsZS5hdHRyKFwiaWRcIik9PT1kcmFnZ2VySWRbMV0pe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBkaXI9XCJ4XCIsdG89KChkcmFnZ2FibGVbMF0ub2Zmc2V0TGVmdC1kcmFnWCkreCkqZC5zY3JvbGxSYXRpby54O1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpcj1cInlcIix0bz0oKGRyYWdnYWJsZVswXS5vZmZzZXRUb3AtZHJhZ1kpK3kpKmQuc2Nyb2xsUmF0aW8ueTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF9zY3JvbGxUbygkdGhpcyx0by50b1N0cmluZygpLHtkaXI6ZGlyLGRyYWc6dHJ1ZX0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBUT1VDSCBTV0lQRSBFVkVOVFNcclxuICAgICAgICBzY3JvbGxzIGNvbnRlbnQgdmlhIHRvdWNoIHN3aXBlXHJcbiAgICAgICAgRW11bGF0ZXMgdGhlIG5hdGl2ZSB0b3VjaC1zd2lwZSBzY3JvbGxpbmcgd2l0aCBtb21lbnR1bSBmb3VuZCBpbiBpT1MsIEFuZHJvaWQgYW5kIFdQIGRldmljZXNcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9jb250ZW50RHJhZ2dhYmxlPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG4gICAgICAgICAgICAgICAgbUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlcj1bJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWxcIiksJChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfaG9yaXpvbnRhbFwiKV0sXHJcbiAgICAgICAgICAgICAgICBkcmFnZ2FibGUsZHJhZ1ksZHJhZ1gsdG91Y2hTdGFydFksdG91Y2hTdGFydFgsdG91Y2hNb3ZlWT1bXSx0b3VjaE1vdmVYPVtdLHN0YXJ0VGltZSxydW5uaW5nVGltZSxlbmRUaW1lLGRpc3RhbmNlLHNwZWVkLGFtb3VudCxcclxuICAgICAgICAgICAgICAgIGR1ckE9MCxkdXJCLG92ZXJ3cml0ZT1vLmF4aXM9PT1cInl4XCIgPyBcIm5vbmVcIiA6IFwiYWxsXCIsdG91Y2hJbnRlbnQ9W10sdG91Y2hEcmFnLGRvY0RyYWcsXHJcbiAgICAgICAgICAgICAgICBpZnJhbWU9bUNTQl9jb250YWluZXIuZmluZChcImlmcmFtZVwiKSxcclxuICAgICAgICAgICAgICAgIGV2ZW50cz1bXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0b3VjaHN0YXJ0LlwiK25hbWVzcGFjZStcIiBwb2ludGVyZG93bi5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyRG93bi5cIituYW1lc3BhY2UsIC8vc3RhcnRcclxuICAgICAgICAgICAgICAgICAgICBcInRvdWNobW92ZS5cIituYW1lc3BhY2UrXCIgcG9pbnRlcm1vdmUuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlck1vdmUuXCIrbmFtZXNwYWNlLCAvL21vdmVcclxuICAgICAgICAgICAgICAgICAgICBcInRvdWNoZW5kLlwiK25hbWVzcGFjZStcIiBwb2ludGVydXAuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlclVwLlwiK25hbWVzcGFjZSAvL2VuZFxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIHRvdWNoQWN0aW9uPWRvY3VtZW50LmJvZHkuc3R5bGUudG91Y2hBY3Rpb24hPT11bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIG1DU0JfY29udGFpbmVyLmJpbmQoZXZlbnRzWzBdLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgX29uVG91Y2hzdGFydChlKTtcclxuICAgICAgICAgICAgfSkuYmluZChldmVudHNbMV0sZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBfb25Ub3VjaG1vdmUoZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94LmJpbmQoZXZlbnRzWzBdLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgX29uVG91Y2hzdGFydDIoZSk7XHJcbiAgICAgICAgICAgIH0pLmJpbmQoZXZlbnRzWzJdLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgX29uVG91Y2hlbmQoZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZihpZnJhbWUubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIGlmcmFtZS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5sb2FkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGJpbmQgZXZlbnRzIG9uIGFjY2Vzc2libGUgaWZyYW1lcyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfY2FuQWNjZXNzSUZyYW1lKHRoaXMpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy5jb250ZW50RG9jdW1lbnQgfHwgdGhpcy5jb250ZW50V2luZG93LmRvY3VtZW50KS5iaW5kKGV2ZW50c1swXSxmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfb25Ub3VjaHN0YXJ0KGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9vblRvdWNoc3RhcnQyKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYmluZChldmVudHNbMV0sZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX29uVG91Y2htb3ZlKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuYmluZChldmVudHNbMl0sZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX29uVG91Y2hlbmQoZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gX29uVG91Y2hzdGFydChlKXtcclxuICAgICAgICAgICAgICAgIGlmKCFfcG9pbnRlclRvdWNoKGUpIHx8IHRvdWNoQWN0aXZlIHx8IF9jb29yZGluYXRlcyhlKVsyXSl7dG91Y2hhYmxlPTA7IHJldHVybjt9XHJcbiAgICAgICAgICAgICAgICB0b3VjaGFibGU9MTsgdG91Y2hEcmFnPTA7IGRvY0RyYWc9MDsgZHJhZ2dhYmxlPTE7XHJcbiAgICAgICAgICAgICAgICAkdGhpcy5yZW1vdmVDbGFzcyhcIm1DU190b3VjaF9hY3Rpb25cIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0PW1DU0JfY29udGFpbmVyLm9mZnNldCgpO1xyXG4gICAgICAgICAgICAgICAgZHJhZ1k9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3A7XHJcbiAgICAgICAgICAgICAgICBkcmFnWD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQ7XHJcbiAgICAgICAgICAgICAgICB0b3VjaEludGVudD1bX2Nvb3JkaW5hdGVzKGUpWzBdLF9jb29yZGluYXRlcyhlKVsxXV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gX29uVG91Y2htb3ZlKGUpe1xyXG4gICAgICAgICAgICAgICAgaWYoIV9wb2ludGVyVG91Y2goZSkgfHwgdG91Y2hBY3RpdmUgfHwgX2Nvb3JkaW5hdGVzKGUpWzJdKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgaWYoIW8uZG9jdW1lbnRUb3VjaFNjcm9sbCl7ZS5wcmV2ZW50RGVmYXVsdCgpO31cclxuICAgICAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBpZihkb2NEcmFnICYmICF0b3VjaERyYWcpe3JldHVybjt9XHJcbiAgICAgICAgICAgICAgICBpZihkcmFnZ2FibGUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJ1bm5pbmdUaW1lPV9nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9mZnNldD1tQ3VzdG9tU2Nyb2xsQm94Lm9mZnNldCgpLHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3AseD1fY29vcmRpbmF0ZXMoZSlbMV0tb2Zmc2V0LmxlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZz1cIm1jc0xpbmVhck91dFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRvdWNoTW92ZVkucHVzaCh5KTtcclxuICAgICAgICAgICAgICAgICAgICB0b3VjaE1vdmVYLnB1c2goeCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG91Y2hJbnRlbnRbMl09TWF0aC5hYnMoX2Nvb3JkaW5hdGVzKGUpWzBdLXRvdWNoSW50ZW50WzBdKTsgdG91Y2hJbnRlbnRbM109TWF0aC5hYnMoX2Nvb3JkaW5hdGVzKGUpWzFdLXRvdWNoSW50ZW50WzFdKTtcclxuICAgICAgICAgICAgICAgICAgICBpZihkLm92ZXJmbG93ZWRbMF0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbGltaXQ9bUNTQl9kcmFnZ2VyWzBdLnBhcmVudCgpLmhlaWdodCgpLW1DU0JfZHJhZ2dlclswXS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByZXZlbnQ9KChkcmFnWS15KT4wICYmICh5LWRyYWdZKT4tKGxpbWl0KmQuc2Nyb2xsUmF0aW8ueSkgJiYgKHRvdWNoSW50ZW50WzNdKjI8dG91Y2hJbnRlbnRbMl0gfHwgby5heGlzPT09XCJ5eFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGQub3ZlcmZsb3dlZFsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBsaW1pdFg9bUNTQl9kcmFnZ2VyWzFdLnBhcmVudCgpLndpZHRoKCktbUNTQl9kcmFnZ2VyWzFdLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmV2ZW50WD0oKGRyYWdYLXgpPjAgJiYgKHgtZHJhZ1gpPi0obGltaXRYKmQuc2Nyb2xsUmF0aW8ueCkgJiYgKHRvdWNoSW50ZW50WzJdKjI8dG91Y2hJbnRlbnRbM10gfHwgby5heGlzPT09XCJ5eFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHByZXZlbnQgfHwgcHJldmVudFgpeyAvKiBwcmV2ZW50IG5hdGl2ZSBkb2N1bWVudCBzY3JvbGxpbmcgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRvdWNoQWN0aW9uKXtlLnByZXZlbnREZWZhdWx0KCk7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaERyYWc9MTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jRHJhZz0xO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy5hZGRDbGFzcyhcIm1DU190b3VjaF9hY3Rpb25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvdWNoQWN0aW9uKXtlLnByZXZlbnREZWZhdWx0KCk7fVxyXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudD1vLmF4aXM9PT1cInl4XCIgPyBbKGRyYWdZLXkpLChkcmFnWC14KV0gOiBvLmF4aXM9PT1cInhcIiA/IFtudWxsLChkcmFnWC14KV0gOiBbKGRyYWdZLXkpLG51bGxdO1xyXG4gICAgICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyWzBdLmlkbGVUaW1lcj0yNTA7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZC5vdmVyZmxvd2VkWzBdKXtfZHJhZyhhbW91bnRbMF0sZHVyQSxlYXNpbmcsXCJ5XCIsXCJhbGxcIix0cnVlKTt9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZC5vdmVyZmxvd2VkWzFdKXtfZHJhZyhhbW91bnRbMV0sZHVyQSxlYXNpbmcsXCJ4XCIsb3ZlcndyaXRlLHRydWUpO31cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBfb25Ub3VjaHN0YXJ0MihlKXtcclxuICAgICAgICAgICAgICAgIGlmKCFfcG9pbnRlclRvdWNoKGUpIHx8IHRvdWNoQWN0aXZlIHx8IF9jb29yZGluYXRlcyhlKVsyXSl7dG91Y2hhYmxlPTA7IHJldHVybjt9XHJcbiAgICAgICAgICAgICAgICB0b3VjaGFibGU9MTtcclxuICAgICAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBfc3RvcCgkdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWU9X2dldFRpbWUoKTtcclxuICAgICAgICAgICAgICAgIHZhciBvZmZzZXQ9bUN1c3RvbVNjcm9sbEJveC5vZmZzZXQoKTtcclxuICAgICAgICAgICAgICAgIHRvdWNoU3RhcnRZPV9jb29yZGluYXRlcyhlKVswXS1vZmZzZXQudG9wO1xyXG4gICAgICAgICAgICAgICAgdG91Y2hTdGFydFg9X2Nvb3JkaW5hdGVzKGUpWzFdLW9mZnNldC5sZWZ0O1xyXG4gICAgICAgICAgICAgICAgdG91Y2hNb3ZlWT1bXTsgdG91Y2hNb3ZlWD1bXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBfb25Ub3VjaGVuZChlKXtcclxuICAgICAgICAgICAgICAgIGlmKCFfcG9pbnRlclRvdWNoKGUpIHx8IHRvdWNoQWN0aXZlIHx8IF9jb29yZGluYXRlcyhlKVsyXSl7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgIGRyYWdnYWJsZT0wO1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHRvdWNoRHJhZz0wOyBkb2NEcmFnPTA7XHJcbiAgICAgICAgICAgICAgICBlbmRUaW1lPV9nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0PW1DdXN0b21TY3JvbGxCb3gub2Zmc2V0KCkseT1fY29vcmRpbmF0ZXMoZSlbMF0tb2Zmc2V0LnRvcCx4PV9jb29yZGluYXRlcyhlKVsxXS1vZmZzZXQubGVmdDtcclxuICAgICAgICAgICAgICAgIGlmKChlbmRUaW1lLXJ1bm5pbmdUaW1lKT4zMCl7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgIHNwZWVkPTEwMDAvKGVuZFRpbWUtc3RhcnRUaW1lKTtcclxuICAgICAgICAgICAgICAgIHZhciBlYXNpbmc9XCJtY3NFYXNlT3V0XCIsc2xvdz1zcGVlZDwyLjUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlmZj1zbG93ID8gW3RvdWNoTW92ZVlbdG91Y2hNb3ZlWS5sZW5ndGgtMl0sdG91Y2hNb3ZlWFt0b3VjaE1vdmVYLmxlbmd0aC0yXV0gOiBbMCwwXTtcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlPXNsb3cgPyBbKHktZGlmZlswXSksKHgtZGlmZlsxXSldIDogW3ktdG91Y2hTdGFydFkseC10b3VjaFN0YXJ0WF07XHJcbiAgICAgICAgICAgICAgICB2YXIgYWJzRGlzdGFuY2U9W01hdGguYWJzKGRpc3RhbmNlWzBdKSxNYXRoLmFicyhkaXN0YW5jZVsxXSldO1xyXG4gICAgICAgICAgICAgICAgc3BlZWQ9c2xvdyA/IFtNYXRoLmFicyhkaXN0YW5jZVswXS80KSxNYXRoLmFicyhkaXN0YW5jZVsxXS80KV0gOiBbc3BlZWQsc3BlZWRdO1xyXG4gICAgICAgICAgICAgICAgdmFyIGE9W1xyXG4gICAgICAgICAgICAgICAgICAgIE1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldFRvcCktKGRpc3RhbmNlWzBdKl9tKChhYnNEaXN0YW5jZVswXS9zcGVlZFswXSksc3BlZWRbMF0pKSxcclxuICAgICAgICAgICAgICAgICAgICBNYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRMZWZ0KS0oZGlzdGFuY2VbMV0qX20oKGFic0Rpc3RhbmNlWzFdL3NwZWVkWzFdKSxzcGVlZFsxXSkpXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAgICAgYW1vdW50PW8uYXhpcz09PVwieXhcIiA/IFthWzBdLGFbMV1dIDogby5heGlzPT09XCJ4XCIgPyBbbnVsbCxhWzFdXSA6IFthWzBdLG51bGxdO1xyXG4gICAgICAgICAgICAgICAgZHVyQj1bKGFic0Rpc3RhbmNlWzBdKjQpK28uc2Nyb2xsSW5lcnRpYSwoYWJzRGlzdGFuY2VbMV0qNCkrby5zY3JvbGxJbmVydGlhXTtcclxuICAgICAgICAgICAgICAgIHZhciBtZD1wYXJzZUludChvLmNvbnRlbnRUb3VjaFNjcm9sbCkgfHwgMDsgLyogYWJzb2x1dGUgbWluaW11bSBkaXN0YW5jZSByZXF1aXJlZCAqL1xyXG4gICAgICAgICAgICAgICAgYW1vdW50WzBdPWFic0Rpc3RhbmNlWzBdPm1kID8gYW1vdW50WzBdIDogMDtcclxuICAgICAgICAgICAgICAgIGFtb3VudFsxXT1hYnNEaXN0YW5jZVsxXT5tZCA/IGFtb3VudFsxXSA6IDA7XHJcbiAgICAgICAgICAgICAgICBpZihkLm92ZXJmbG93ZWRbMF0pe19kcmFnKGFtb3VudFswXSxkdXJCWzBdLGVhc2luZyxcInlcIixvdmVyd3JpdGUsZmFsc2UpO31cclxuICAgICAgICAgICAgICAgIGlmKGQub3ZlcmZsb3dlZFsxXSl7X2RyYWcoYW1vdW50WzFdLGR1ckJbMV0sZWFzaW5nLFwieFwiLG92ZXJ3cml0ZSxmYWxzZSk7fVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9tKGRzLHMpe1xyXG4gICAgICAgICAgICAgICAgdmFyIHI9W3MqMS41LHMqMixzLzEuNSxzLzJdO1xyXG4gICAgICAgICAgICAgICAgaWYoZHM+OTApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzPjQgPyByWzBdIDogclszXTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKGRzPjYwKXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcz4zID8gclszXSA6IHJbMl07XHJcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihkcz4zMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHM+OCA/IHJbMV0gOiBzPjYgPyByWzBdIDogcz40ID8gcyA6IHJbMl07XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcz44ID8gcyA6IHJbM107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gX2RyYWcoYW1vdW50LGR1cixlYXNpbmcsZGlyLG92ZXJ3cml0ZSxkcmFnKXtcclxuICAgICAgICAgICAgICAgIGlmKCFhbW91bnQpe3JldHVybjt9XHJcbiAgICAgICAgICAgICAgICBfc2Nyb2xsVG8oJHRoaXMsYW1vdW50LnRvU3RyaW5nKCkse2R1cjpkdXIsc2Nyb2xsRWFzaW5nOmVhc2luZyxkaXI6ZGlyLG92ZXJ3cml0ZTpvdmVyd3JpdGUsZHJhZzpkcmFnfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIFNFTEVDVCBURVhUIEVWRU5UU1xyXG4gICAgICAgIHNjcm9sbHMgY29udGVudCB3aGVuIHRleHQgaXMgc2VsZWN0ZWRcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9zZWxlY3RhYmxlPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG4gICAgICAgICAgICAgICAgd3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcclxuICAgICAgICAgICAgICAgIGFjdGlvbjtcclxuICAgICAgICAgICAgbUNTQl9jb250YWluZXIuYmluZChcIm1vdXNlZG93bi5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBpZih0b3VjaGFibGUpe3JldHVybjt9XHJcbiAgICAgICAgICAgICAgICBpZighYWN0aW9uKXthY3Rpb249MTsgdG91Y2hBY3RpdmU9dHJ1ZTt9XHJcbiAgICAgICAgICAgIH0pLmFkZChkb2N1bWVudCkuYmluZChcIm1vdXNlbW92ZS5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBpZighdG91Y2hhYmxlICYmIGFjdGlvbiAmJiBfc2VsKCkpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBvZmZzZXQ9bUNTQl9jb250YWluZXIub2Zmc2V0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHk9X2Nvb3JkaW5hdGVzKGUpWzBdLW9mZnNldC50b3ArbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wLHg9X2Nvb3JkaW5hdGVzKGUpWzFdLW9mZnNldC5sZWZ0K21DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoeT4wICYmIHk8d3JhcHBlci5oZWlnaHQoKSAmJiB4PjAgJiYgeDx3cmFwcGVyLndpZHRoKCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZXEuc3RlcCl7X3NlcShcIm9mZlwiLG51bGwsXCJzdGVwcGVkXCIpO31cclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoby5heGlzIT09XCJ4XCIgJiYgZC5vdmVyZmxvd2VkWzBdKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHk8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlcShcIm9uXCIsMzgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoeT53cmFwcGVyLmhlaWdodCgpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc2VxKFwib25cIiw0MCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoby5heGlzIT09XCJ5XCIgJiYgZC5vdmVyZmxvd2VkWzFdKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHg8MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlcShcIm9uXCIsMzcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoeD53cmFwcGVyLndpZHRoKCkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zZXEoXCJvblwiLDM5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkuYmluZChcIm1vdXNldXAuXCIrbmFtZXNwYWNlK1wiIGRyYWdlbmQuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgaWYodG91Y2hhYmxlKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgaWYoYWN0aW9uKXthY3Rpb249MDsgX3NlcShcIm9mZlwiLG51bGwpO31cclxuICAgICAgICAgICAgICAgIHRvdWNoQWN0aXZlPWZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gX3NlbCgpe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICB3aW5kb3cuZ2V0U2VsZWN0aW9uID8gd2luZG93LmdldFNlbGVjdGlvbigpLnRvU3RyaW5nKCkgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5zZWxlY3Rpb24gJiYgZG9jdW1lbnQuc2VsZWN0aW9uLnR5cGUhPVwiQ29udHJvbFwiID8gZG9jdW1lbnQuc2VsZWN0aW9uLmNyZWF0ZVJhbmdlKCkudGV4dCA6IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gX3NlcShhLGMscyl7XHJcbiAgICAgICAgICAgICAgICBzZXEudHlwZT1zICYmIGFjdGlvbiA/IFwic3RlcHBlZFwiIDogXCJzdGVwbGVzc1wiO1xyXG4gICAgICAgICAgICAgICAgc2VxLnNjcm9sbEFtb3VudD0xMDtcclxuICAgICAgICAgICAgICAgIF9zZXF1ZW50aWFsU2Nyb2xsKCR0aGlzLGEsYyxcIm1jc0xpbmVhck91dFwiLHMgPyA2MCA6IG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBNT1VTRSBXSEVFTCBFVkVOVFxyXG4gICAgICAgIHNjcm9sbHMgY29udGVudCB2aWEgbW91c2Utd2hlZWxcclxuICAgICAgICB2aWEgbW91c2Utd2hlZWwgcGx1Z2luIChodHRwczovL2dpdGh1Yi5jb20vYnJhbmRvbmFhcm9uL2pxdWVyeS1tb3VzZXdoZWVsKVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX21vdXNld2hlZWw9ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgaWYoISQodGhpcykuZGF0YShwbHVnaW5QZngpKXtyZXR1cm47fSAvKiBDaGVjayBpZiB0aGUgc2Nyb2xsYmFyIGlzIHJlYWR5IHRvIHVzZSBtb3VzZXdoZWVsIGV2ZW50cyAoaXNzdWU6ICMxODUpICovXHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG4gICAgICAgICAgICAgICAgbUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9kcmFnZ2VyPVskKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl92ZXJ0aWNhbFwiKSwkKFwiI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCIpXSxcclxuICAgICAgICAgICAgICAgIGlmcmFtZT0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLmZpbmQoXCJpZnJhbWVcIik7XHJcbiAgICAgICAgICAgIGlmKGlmcmFtZS5sZW5ndGgpe1xyXG4gICAgICAgICAgICAgICAgaWZyYW1lLmVhY2goZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmxvYWQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogYmluZCBldmVudHMgb24gYWNjZXNzaWJsZSBpZnJhbWVzICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9jYW5BY2Nlc3NJRnJhbWUodGhpcykpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmNvbnRlbnREb2N1bWVudCB8fCB0aGlzLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQpLmJpbmQoXCJtb3VzZXdoZWVsLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlLGRlbHRhKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfb25Nb3VzZXdoZWVsKGUsZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1DdXN0b21TY3JvbGxCb3guYmluZChcIm1vdXNld2hlZWwuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUsZGVsdGEpe1xyXG4gICAgICAgICAgICAgICAgX29uTW91c2V3aGVlbChlLGRlbHRhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9vbk1vdXNld2hlZWwoZSxkZWx0YSl7XHJcbiAgICAgICAgICAgICAgICBfc3RvcCgkdGhpcyk7XHJcbiAgICAgICAgICAgICAgICBpZihfZGlzYWJsZU1vdXNld2hlZWwoJHRoaXMsZS50YXJnZXQpKXtyZXR1cm47fSAvKiBkaXNhYmxlcyBtb3VzZS13aGVlbCB3aGVuIGhvdmVyaW5nIHNwZWNpZmljIGVsZW1lbnRzICovXHJcbiAgICAgICAgICAgICAgICB2YXIgZGVsdGFGYWN0b3I9by5tb3VzZVdoZWVsLmRlbHRhRmFjdG9yIT09XCJhdXRvXCIgPyBwYXJzZUludChvLm1vdXNlV2hlZWwuZGVsdGFGYWN0b3IpIDogKG9sZElFICYmIGUuZGVsdGFGYWN0b3I8MTAwKSA/IDEwMCA6IGUuZGVsdGFGYWN0b3IgfHwgMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cj1vLnNjcm9sbEluZXJ0aWE7XHJcbiAgICAgICAgICAgICAgICBpZihvLmF4aXM9PT1cInhcIiB8fCBvLm1vdXNlV2hlZWwuYXhpcz09PVwieFwiKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGlyPVwieFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBweD1bTWF0aC5yb3VuZChkZWx0YUZhY3RvcipkLnNjcm9sbFJhdGlvLngpLHBhcnNlSW50KG8ubW91c2VXaGVlbC5zY3JvbGxBbW91bnQpXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYW1vdW50PW8ubW91c2VXaGVlbC5zY3JvbGxBbW91bnQhPT1cImF1dG9cIiA/IHB4WzFdIDogcHhbMF0+PW1DdXN0b21TY3JvbGxCb3gud2lkdGgoKSA/IG1DdXN0b21TY3JvbGxCb3gud2lkdGgoKSowLjkgOiBweFswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFBvcz1NYXRoLmFicygkKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpWzBdLm9mZnNldExlZnQpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkcmFnZ2VyUG9zPW1DU0JfZHJhZ2dlclsxXVswXS5vZmZzZXRMZWZ0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdD1tQ1NCX2RyYWdnZXJbMV0ucGFyZW50KCkud2lkdGgoKS1tQ1NCX2RyYWdnZXJbMV0ud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGx0PWUuZGVsdGFYIHx8IGUuZGVsdGFZIHx8IGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRpcj1cInlcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHg9W01hdGgucm91bmQoZGVsdGFGYWN0b3IqZC5zY3JvbGxSYXRpby55KSxwYXJzZUludChvLm1vdXNlV2hlZWwuc2Nyb2xsQW1vdW50KV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFtb3VudD1vLm1vdXNlV2hlZWwuc2Nyb2xsQW1vdW50IT09XCJhdXRvXCIgPyBweFsxXSA6IHB4WzBdPj1tQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpID8gbUN1c3RvbVNjcm9sbEJveC5oZWlnaHQoKSowLjkgOiBweFswXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFBvcz1NYXRoLmFicygkKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpWzBdLm9mZnNldFRvcCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRyYWdnZXJQb3M9bUNTQl9kcmFnZ2VyWzBdWzBdLm9mZnNldFRvcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGltaXQ9bUNTQl9kcmFnZ2VyWzBdLnBhcmVudCgpLmhlaWdodCgpLW1DU0JfZHJhZ2dlclswXS5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGx0PWUuZGVsdGFZIHx8IGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoKGRpcj09PVwieVwiICYmICFkLm92ZXJmbG93ZWRbMF0pIHx8IChkaXI9PT1cInhcIiAmJiAhZC5vdmVyZmxvd2VkWzFdKSl7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgIGlmKG8ubW91c2VXaGVlbC5pbnZlcnQgfHwgZS53ZWJraXREaXJlY3Rpb25JbnZlcnRlZEZyb21EZXZpY2Upe2RsdD0tZGx0O31cclxuICAgICAgICAgICAgICAgIGlmKG8ubW91c2VXaGVlbC5ub3JtYWxpemVEZWx0YSl7ZGx0PWRsdDwwID8gLTEgOiAxO31cclxuICAgICAgICAgICAgICAgIGlmKChkbHQ+MCAmJiBkcmFnZ2VyUG9zIT09MCkgfHwgKGRsdDwwICYmIGRyYWdnZXJQb3MhPT1saW1pdCkgfHwgby5tb3VzZVdoZWVsLnByZXZlbnREZWZhdWx0KXtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKGUuZGVsdGFGYWN0b3I8MiAmJiAhby5tb3VzZVdoZWVsLm5vcm1hbGl6ZURlbHRhKXtcclxuICAgICAgICAgICAgICAgICAgICAvL3ZlcnkgbG93IGRlbHRhRmFjdG9yIHZhbHVlcyBtZWFuIHNvbWUga2luZCBvZiBkZWx0YSBhY2NlbGVyYXRpb24gKGUuZy4gb3N4IHRyYWNrcGFkKSwgc28gYWRqdXN0aW5nIHNjcm9sbGluZyBhY2NvcmRpbmdseVxyXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudD1lLmRlbHRhRmFjdG9yOyBkdXI9MTc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfc2Nyb2xsVG8oJHRoaXMsKGNvbnRlbnRQb3MtKGRsdCphbW91bnQpKS50b1N0cmluZygpLHtkaXI6ZGlyLGR1cjpkdXJ9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGNoZWNrcyBpZiBpZnJhbWUgY2FuIGJlIGFjY2Vzc2VkICovXHJcbiAgICAgICAgX2NhbkFjY2Vzc0lGcmFtZT1mdW5jdGlvbihpZnJhbWUpe1xyXG4gICAgICAgICAgICB2YXIgaHRtbD1udWxsO1xyXG4gICAgICAgICAgICBpZighaWZyYW1lKXtcclxuICAgICAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZG9jPXRvcC5kb2N1bWVudDtcclxuICAgICAgICAgICAgICAgICAgICBodG1sPWRvYy5ib2R5LmlubmVySFRNTDtcclxuICAgICAgICAgICAgICAgIH1jYXRjaChlcnIpey8qIGRvIG5vdGhpbmcgKi99XHJcbiAgICAgICAgICAgICAgICByZXR1cm4oaHRtbCE9PW51bGwpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIHRyeXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZG9jPWlmcmFtZS5jb250ZW50RG9jdW1lbnQgfHwgaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaHRtbD1kb2MuYm9keS5pbm5lckhUTUw7XHJcbiAgICAgICAgICAgICAgICB9Y2F0Y2goZXJyKXsvKiBkbyBub3RoaW5nICovfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuKGh0bWwhPT1udWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGRpc2FibGVzIG1vdXNlLXdoZWVsIHdoZW4gaG92ZXJpbmcgc3BlY2lmaWMgZWxlbWVudHMgbGlrZSBzZWxlY3QsIGRhdGFsaXN0IGV0Yy4gKi9cclxuICAgICAgICBfZGlzYWJsZU1vdXNld2hlZWw9ZnVuY3Rpb24oZWwsdGFyZ2V0KXtcclxuICAgICAgICAgICAgdmFyIHRhZz10YXJnZXQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSxcclxuICAgICAgICAgICAgICAgIHRhZ3M9ZWwuZGF0YShwbHVnaW5QZngpLm9wdC5tb3VzZVdoZWVsLmRpc2FibGVPdmVyLFxyXG4gICAgICAgICAgICAgICAgLyogZWxlbWVudHMgdGhhdCByZXF1aXJlIGZvY3VzICovXHJcbiAgICAgICAgICAgICAgICBmb2N1c1RhZ3M9W1wic2VsZWN0XCIsXCJ0ZXh0YXJlYVwiXTtcclxuICAgICAgICAgICAgcmV0dXJuICQuaW5BcnJheSh0YWcsdGFncykgPiAtMSAmJiAhKCQuaW5BcnJheSh0YWcsZm9jdXNUYWdzKSA+IC0xICYmICEkKHRhcmdldCkuaXMoXCI6Zm9jdXNcIikpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgRFJBR0dFUiBSQUlMIENMSUNLIEVWRU5UXHJcbiAgICAgICAgc2Nyb2xscyBjb250ZW50IHZpYSBkcmFnZ2VyIHJhaWxcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9kcmFnZ2VyUmFpbD1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG4gICAgICAgICAgICAgICAgd3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcclxuICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlckNvbnRhaW5lcj0kKFwiLm1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyIC5cIitjbGFzc2VzWzEyXSksXHJcbiAgICAgICAgICAgICAgICBjbGlja2FibGU7XHJcbiAgICAgICAgICAgIG1DU0JfZHJhZ2dlckNvbnRhaW5lci5iaW5kKFwibW91c2Vkb3duLlwiK25hbWVzcGFjZStcIiB0b3VjaHN0YXJ0LlwiK25hbWVzcGFjZStcIiBwb2ludGVyZG93bi5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyRG93bi5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICB0b3VjaEFjdGl2ZT10cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYoISQoZS50YXJnZXQpLmhhc0NsYXNzKFwibUNTQl9kcmFnZ2VyXCIpKXtjbGlja2FibGU9MTt9XHJcbiAgICAgICAgICAgIH0pLmJpbmQoXCJ0b3VjaGVuZC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcnVwLlwiK25hbWVzcGFjZStcIiBNU1BvaW50ZXJVcC5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICB0b3VjaEFjdGl2ZT1mYWxzZTtcclxuICAgICAgICAgICAgfSkuYmluZChcImNsaWNrLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgIGlmKCFjbGlja2FibGUpe3JldHVybjt9XHJcbiAgICAgICAgICAgICAgICBjbGlja2FibGU9MDtcclxuICAgICAgICAgICAgICAgIGlmKCQoZS50YXJnZXQpLmhhc0NsYXNzKGNsYXNzZXNbMTJdKSB8fCAkKGUudGFyZ2V0KS5oYXNDbGFzcyhcIm1DU0JfZHJhZ2dlclJhaWxcIikpe1xyXG4gICAgICAgICAgICAgICAgICAgIF9zdG9wKCR0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZWw9JCh0aGlzKSxtQ1NCX2RyYWdnZXI9ZWwuZmluZChcIi5tQ1NCX2RyYWdnZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoZWwucGFyZW50KFwiLm1DU0Jfc2Nyb2xsVG9vbHNfaG9yaXpvbnRhbFwiKS5sZW5ndGg+MCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkLm92ZXJmbG93ZWRbMV0pe3JldHVybjt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXI9XCJ4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0Rpcj1lLnBhZ2VYPm1DU0JfZHJhZ2dlci5vZmZzZXQoKS5sZWZ0ID8gLTEgOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdCktKGNsaWNrRGlyKih3cmFwcGVyLndpZHRoKCkqMC45KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkLm92ZXJmbG93ZWRbMF0pe3JldHVybjt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXI9XCJ5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlja0Rpcj1lLnBhZ2VZPm1DU0JfZHJhZ2dlci5vZmZzZXQoKS50b3AgPyAtMSA6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bz1NYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3ApLShjbGlja0Rpciood3JhcHBlci5oZWlnaHQoKSowLjkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLHRvLnRvU3RyaW5nKCkse2RpcjpkaXIsc2Nyb2xsRWFzaW5nOlwibWNzRWFzZUluT3V0XCJ9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBGT0NVUyBFVkVOVFxyXG4gICAgICAgIHNjcm9sbHMgY29udGVudCB2aWEgZWxlbWVudCBmb2N1cyAoZS5nLiBjbGlja2luZyBhbiBpbnB1dCwgcHJlc3NpbmcgVEFCIGtleSBldGMuKVxyXG4gICAgICAgICovXHJcbiAgICAgICAgX2ZvY3VzPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuICAgICAgICAgICAgICAgIHdyYXBwZXI9bUNTQl9jb250YWluZXIucGFyZW50KCk7XHJcbiAgICAgICAgICAgIG1DU0JfY29udGFpbmVyLmJpbmQoXCJmb2N1c2luLlwiK25hbWVzcGFjZSxmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgIHZhciBlbD0kKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLFxyXG4gICAgICAgICAgICAgICAgICAgIG5lc3RlZD1tQ1NCX2NvbnRhaW5lci5maW5kKFwiLm1DdXN0b21TY3JvbGxCb3hcIikubGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cj0wO1xyXG4gICAgICAgICAgICAgICAgaWYoIWVsLmlzKG8uYWR2YW5jZWQuYXV0b1Njcm9sbE9uRm9jdXMpKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgX3N0b3AoJHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCR0aGlzWzBdLl9mb2N1c1RpbWVvdXQpO1xyXG4gICAgICAgICAgICAgICAgJHRoaXNbMF0uX2ZvY3VzVGltZXI9bmVzdGVkID8gKGR1cisxNykqbmVzdGVkIDogMDtcclxuICAgICAgICAgICAgICAgICR0aGlzWzBdLl9mb2N1c1RpbWVvdXQ9c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0bz1bX2NoaWxkUG9zKGVsKVswXSxfY2hpbGRQb3MoZWwpWzFdXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFBvcz1bbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wLG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnRdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1Zpc2libGU9W1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNvbnRlbnRQb3NbMF0rdG9bMF0+PTAgJiYgY29udGVudFBvc1swXSt0b1swXTx3cmFwcGVyLmhlaWdodCgpLWVsLm91dGVySGVpZ2h0KGZhbHNlKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY29udGVudFBvc1sxXSt0b1sxXT49MCAmJiBjb250ZW50UG9zWzBdK3RvWzFdPHdyYXBwZXIud2lkdGgoKS1lbC5vdXRlcldpZHRoKGZhbHNlKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcndyaXRlPShvLmF4aXM9PT1cInl4XCIgJiYgIWlzVmlzaWJsZVswXSAmJiAhaXNWaXNpYmxlWzFdKSA/IFwibm9uZVwiIDogXCJhbGxcIjtcclxuICAgICAgICAgICAgICAgICAgICBpZihvLmF4aXMhPT1cInhcIiAmJiAhaXNWaXNpYmxlWzBdKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLHRvWzBdLnRvU3RyaW5nKCkse2RpcjpcInlcIixzY3JvbGxFYXNpbmc6XCJtY3NFYXNlSW5PdXRcIixvdmVyd3JpdGU6b3ZlcndyaXRlLGR1cjpkdXJ9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoby5heGlzIT09XCJ5XCIgJiYgIWlzVmlzaWJsZVsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zY3JvbGxUbygkdGhpcyx0b1sxXS50b1N0cmluZygpLHtkaXI6XCJ4XCIsc2Nyb2xsRWFzaW5nOlwibWNzRWFzZUluT3V0XCIsb3ZlcndyaXRlOm92ZXJ3cml0ZSxkdXI6ZHVyfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwkdGhpc1swXS5fZm9jdXNUaW1lcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIHNldHMgY29udGVudCB3cmFwcGVyIHNjcm9sbFRvcC9zY3JvbGxMZWZ0IGFsd2F5cyB0byAwICovXHJcbiAgICAgICAgX3dyYXBwZXJTY3JvbGw9ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyICR0aGlzPSQodGhpcyksZD0kdGhpcy5kYXRhKHBsdWdpblBmeCksXHJcbiAgICAgICAgICAgICAgICBuYW1lc3BhY2U9cGx1Z2luUGZ4K1wiX1wiK2QuaWR4LFxyXG4gICAgICAgICAgICAgICAgd3JhcHBlcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLnBhcmVudCgpO1xyXG4gICAgICAgICAgICB3cmFwcGVyLmJpbmQoXCJzY3JvbGwuXCIrbmFtZXNwYWNlLGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICAgICAgaWYod3JhcHBlci5zY3JvbGxUb3AoKSE9PTAgfHwgd3JhcHBlci5zY3JvbGxMZWZ0KCkhPT0wKXtcclxuICAgICAgICAgICAgICAgICAgICAkKFwiLm1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyXCIpLmNzcyhcInZpc2liaWxpdHlcIixcImhpZGRlblwiKTsgLyogaGlkZSBzY3JvbGxiYXIocykgKi9cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLypcclxuICAgICAgICBCVVRUT05TIEVWRU5UU1xyXG4gICAgICAgIHNjcm9sbHMgY29udGVudCB2aWEgdXAsIGRvd24sIGxlZnQgYW5kIHJpZ2h0IGJ1dHRvbnNcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9idXR0b25zPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXHJcbiAgICAgICAgICAgICAgICBzZWw9XCIubUNTQl9cIitkLmlkeCtcIl9zY3JvbGxiYXJcIixcclxuICAgICAgICAgICAgICAgIGJ0bj0kKHNlbCtcIj5hXCIpO1xyXG4gICAgICAgICAgICBidG4uYmluZChcIm1vdXNlZG93bi5cIituYW1lc3BhY2UrXCIgdG91Y2hzdGFydC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcmRvd24uXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlckRvd24uXCIrbmFtZXNwYWNlK1wiIG1vdXNldXAuXCIrbmFtZXNwYWNlK1wiIHRvdWNoZW5kLlwiK25hbWVzcGFjZStcIiBwb2ludGVydXAuXCIrbmFtZXNwYWNlK1wiIE1TUG9pbnRlclVwLlwiK25hbWVzcGFjZStcIiBtb3VzZW91dC5cIituYW1lc3BhY2UrXCIgcG9pbnRlcm91dC5cIituYW1lc3BhY2UrXCIgTVNQb2ludGVyT3V0LlwiK25hbWVzcGFjZStcIiBjbGljay5cIituYW1lc3BhY2UsZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBpZighX21vdXNlQnRuTGVmdChlKSl7cmV0dXJuO30gLyogbGVmdCBtb3VzZSBidXR0b24gb25seSAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGJ0bkNsYXNzPSQodGhpcykuYXR0cihcImNsYXNzXCIpO1xyXG4gICAgICAgICAgICAgICAgc2VxLnR5cGU9by5zY3JvbGxCdXR0b25zLnNjcm9sbFR5cGU7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goZS50eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibW91c2Vkb3duXCI6IGNhc2UgXCJ0b3VjaHN0YXJ0XCI6IGNhc2UgXCJwb2ludGVyZG93blwiOiBjYXNlIFwiTVNQb2ludGVyRG93blwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZXEudHlwZT09PVwic3RlcHBlZFwiKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaEFjdGl2ZT10cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkLnR3ZWVuUnVubmluZz1mYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3NlcShcIm9uXCIsYnRuQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibW91c2V1cFwiOiBjYXNlIFwidG91Y2hlbmRcIjogY2FzZSBcInBvaW50ZXJ1cFwiOiBjYXNlIFwiTVNQb2ludGVyVXBcIjpcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibW91c2VvdXRcIjogY2FzZSBcInBvaW50ZXJvdXRcIjogY2FzZSBcIk1TUG9pbnRlck91dFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZXEudHlwZT09PVwic3RlcHBlZFwiKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaEFjdGl2ZT1mYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2VxLmRpcil7X3NlcShcIm9mZlwiLGJ0bkNsYXNzKTt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjbGlja1wiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihzZXEudHlwZSE9PVwic3RlcHBlZFwiIHx8IGQudHdlZW5SdW5uaW5nKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VxKFwib25cIixidG5DbGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gX3NlcShhLGMpe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcS5zY3JvbGxBbW91bnQ9by5zY3JvbGxCdXR0b25zLnNjcm9sbEFtb3VudDtcclxuICAgICAgICAgICAgICAgICAgICBfc2VxdWVudGlhbFNjcm9sbCgkdGhpcyxhLGMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIEtFWUJPQVJEIEVWRU5UU1xyXG4gICAgICAgIHNjcm9sbHMgY29udGVudCB2aWEga2V5Ym9hcmRcclxuICAgICAgICBLZXlzOiB1cCBhcnJvdywgZG93biBhcnJvdywgbGVmdCBhcnJvdywgcmlnaHQgYXJyb3csIFBnVXAsIFBnRG4sIEhvbWUsIEVuZFxyXG4gICAgICAgICovXHJcbiAgICAgICAgX2tleWJvYXJkPWZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcclxuICAgICAgICAgICAgICAgIG5hbWVzcGFjZT1wbHVnaW5QZngrXCJfXCIrZC5pZHgsXHJcbiAgICAgICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94PSQoXCIjbUNTQl9cIitkLmlkeCksXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpLFxyXG4gICAgICAgICAgICAgICAgd3JhcHBlcj1tQ1NCX2NvbnRhaW5lci5wYXJlbnQoKSxcclxuICAgICAgICAgICAgICAgIGVkaXRhYmxlcz1cImlucHV0LHRleHRhcmVhLHNlbGVjdCxkYXRhbGlzdCxrZXlnZW4sW2NvbnRlbnRlZGl0YWJsZT0ndHJ1ZSddXCIsXHJcbiAgICAgICAgICAgICAgICBpZnJhbWU9bUNTQl9jb250YWluZXIuZmluZChcImlmcmFtZVwiKSxcclxuICAgICAgICAgICAgICAgIGV2ZW50cz1bXCJibHVyLlwiK25hbWVzcGFjZStcIiBrZXlkb3duLlwiK25hbWVzcGFjZStcIiBrZXl1cC5cIituYW1lc3BhY2VdO1xyXG4gICAgICAgICAgICBpZihpZnJhbWUubGVuZ3RoKXtcclxuICAgICAgICAgICAgICAgIGlmcmFtZS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5sb2FkKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGJpbmQgZXZlbnRzIG9uIGFjY2Vzc2libGUgaWZyYW1lcyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfY2FuQWNjZXNzSUZyYW1lKHRoaXMpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcy5jb250ZW50RG9jdW1lbnQgfHwgdGhpcy5jb250ZW50V2luZG93LmRvY3VtZW50KS5iaW5kKGV2ZW50c1swXSxmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfb25LZXlib2FyZChlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94LmF0dHIoXCJ0YWJpbmRleFwiLFwiMFwiKS5iaW5kKGV2ZW50c1swXSxmdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgICAgIF9vbktleWJvYXJkKGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gX29uS2V5Ym9hcmQoZSl7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2goZS50eXBlKXtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYmx1clwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkLnR3ZWVuUnVubmluZyAmJiBzZXEuZGlyKXtfc2VxKFwib2ZmXCIsbnVsbCk7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwia2V5ZG93blwiOiBjYXNlIFwia2V5dXBcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvZGU9ZS5rZXlDb2RlID8gZS5rZXlDb2RlIDogZS53aGljaCxhY3Rpb249XCJvblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigoby5heGlzIT09XCJ4XCIgJiYgKGNvZGU9PT0zOCB8fCBjb2RlPT09NDApKSB8fCAoby5heGlzIT09XCJ5XCIgJiYgKGNvZGU9PT0zNyB8fCBjb2RlPT09MzkpKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiB1cCAoMzgpLCBkb3duICg0MCksIGxlZnQgKDM3KSwgcmlnaHQgKDM5KSBhcnJvd3MgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCgoY29kZT09PTM4IHx8IGNvZGU9PT00MCkgJiYgIWQub3ZlcmZsb3dlZFswXSkgfHwgKChjb2RlPT09MzcgfHwgY29kZT09PTM5KSAmJiAhZC5vdmVyZmxvd2VkWzFdKSl7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGUudHlwZT09PVwia2V5dXBcIil7YWN0aW9uPVwib2ZmXCI7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoISQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoZWRpdGFibGVzKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3NlcShhY3Rpb24sY29kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNvZGU9PT0zMyB8fCBjb2RlPT09MzQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUGdVcCAoMzMpLCBQZ0RuICgzNCkgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGQub3ZlcmZsb3dlZFswXSB8fCBkLm92ZXJmbG93ZWRbMV0pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZS50eXBlPT09XCJrZXl1cFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfc3RvcCgkdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleWJvYXJkRGlyPWNvZGU9PT0zNCA/IC0xIDogMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihvLmF4aXM9PT1cInhcIiB8fCAoby5heGlzPT09XCJ5eFwiICYmIGQub3ZlcmZsb3dlZFsxXSAmJiAhZC5vdmVyZmxvd2VkWzBdKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXI9XCJ4XCIsdG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0TGVmdCktKGtleWJvYXJkRGlyKih3cmFwcGVyLndpZHRoKCkqMC45KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXI9XCJ5XCIsdG89TWF0aC5hYnMobUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wKS0oa2V5Ym9hcmREaXIqKHdyYXBwZXIuaGVpZ2h0KCkqMC45KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9zY3JvbGxUbygkdGhpcyx0by50b1N0cmluZygpLHtkaXI6ZGlyLHNjcm9sbEVhc2luZzpcIm1jc0Vhc2VJbk91dFwifSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGNvZGU9PT0zNSB8fCBjb2RlPT09MzYpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogRW5kICgzNSksIEhvbWUgKDM2KSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoISQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoZWRpdGFibGVzKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZC5vdmVyZmxvd2VkWzBdIHx8IGQub3ZlcmZsb3dlZFsxXSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZS50eXBlPT09XCJrZXl1cFwiKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoby5heGlzPT09XCJ4XCIgfHwgKG8uYXhpcz09PVwieXhcIiAmJiBkLm92ZXJmbG93ZWRbMV0gJiYgIWQub3ZlcmZsb3dlZFswXSkpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpcj1cInhcIix0bz1jb2RlPT09MzUgPyBNYXRoLmFicyh3cmFwcGVyLndpZHRoKCktbUNTQl9jb250YWluZXIub3V0ZXJXaWR0aChmYWxzZSkpIDogMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlyPVwieVwiLHRvPWNvZGU9PT0zNSA/IE1hdGguYWJzKHdyYXBwZXIuaGVpZ2h0KCktbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpKSA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3Njcm9sbFRvKCR0aGlzLHRvLnRvU3RyaW5nKCkse2RpcjpkaXIsc2Nyb2xsRWFzaW5nOlwibWNzRWFzZUluT3V0XCJ9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBfc2VxKGEsYyl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VxLnR5cGU9by5rZXlib2FyZC5zY3JvbGxUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcS5zY3JvbGxBbW91bnQ9by5rZXlib2FyZC5zY3JvbGxBbW91bnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoc2VxLnR5cGU9PT1cInN0ZXBwZWRcIiAmJiBkLnR3ZWVuUnVubmluZyl7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgICAgICBfc2VxdWVudGlhbFNjcm9sbCgkdGhpcyxhLGMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogc2Nyb2xscyBjb250ZW50IHNlcXVlbnRpYWxseSAodXNlZCB3aGVuIHNjcm9sbGluZyB2aWEgYnV0dG9ucywga2V5Ym9hcmQgYXJyb3dzIGV0Yy4pICovXHJcbiAgICAgICAgX3NlcXVlbnRpYWxTY3JvbGw9ZnVuY3Rpb24oZWwsYWN0aW9uLHRyaWdnZXIsZSxzKXtcclxuICAgICAgICAgICAgdmFyIGQ9ZWwuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsc2VxPWQuc2VxdWVudGlhbCxcclxuICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9jb250YWluZXJcIiksXHJcbiAgICAgICAgICAgICAgICBvbmNlPXNlcS50eXBlPT09XCJzdGVwcGVkXCIgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzdGVwbGVzc1NwZWVkPW8uc2Nyb2xsSW5lcnRpYSA8IDI2ID8gMjYgOiBvLnNjcm9sbEluZXJ0aWEsIC8qIDI2LzEuNT0xNyAqL1xyXG4gICAgICAgICAgICAgICAgc3RlcHBlZFNwZWVkPW8uc2Nyb2xsSW5lcnRpYSA8IDEgPyAxNyA6IG8uc2Nyb2xsSW5lcnRpYTtcclxuICAgICAgICAgICAgc3dpdGNoKGFjdGlvbil7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwib25cIjpcclxuICAgICAgICAgICAgICAgICAgICBzZXEuZGlyPVtcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRyaWdnZXI9PT1jbGFzc2VzWzE2XSB8fCB0cmlnZ2VyPT09Y2xhc3Nlc1sxNV0gfHwgdHJpZ2dlcj09PTM5IHx8IHRyaWdnZXI9PT0zNyA/IFwieFwiIDogXCJ5XCIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodHJpZ2dlcj09PWNsYXNzZXNbMTNdIHx8IHRyaWdnZXI9PT1jbGFzc2VzWzE1XSB8fCB0cmlnZ2VyPT09MzggfHwgdHJpZ2dlcj09PTM3ID8gLTEgOiAxKVxyXG4gICAgICAgICAgICAgICAgICAgIF07XHJcbiAgICAgICAgICAgICAgICAgICAgX3N0b3AoZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKF9pc051bWVyaWModHJpZ2dlcikgJiYgc2VxLnR5cGU9PT1cInN0ZXBwZWRcIil7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgICAgICBfb24ob25jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwib2ZmXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgX29mZigpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9uY2UgfHwgKGQudHdlZW5SdW5uaW5nICYmIHNlcS5kaXIpKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX29uKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyogc3RhcnRzIHNlcXVlbmNlICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9vbihvbmNlKXtcclxuICAgICAgICAgICAgICAgIGlmKG8uc25hcEFtb3VudCl7c2VxLnNjcm9sbEFtb3VudD0hKG8uc25hcEFtb3VudCBpbnN0YW5jZW9mIEFycmF5KSA/IG8uc25hcEFtb3VudCA6IHNlcS5kaXJbMF09PT1cInhcIiA/IG8uc25hcEFtb3VudFsxXSA6IG8uc25hcEFtb3VudFswXTt9IC8qIHNjcm9sbGluZyBzbmFwcGluZyAqL1xyXG4gICAgICAgICAgICAgICAgdmFyIGM9c2VxLnR5cGUhPT1cInN0ZXBwZWRcIiwgLyogY29udGludW91cyBzY3JvbGxpbmcgKi9cclxuICAgICAgICAgICAgICAgICAgICB0PXMgPyBzIDogIW9uY2UgPyAxMDAwLzYwIDogYyA/IHN0ZXBsZXNzU3BlZWQvMS41IDogc3RlcHBlZFNwZWVkLCAvKiB0aW1lciAqL1xyXG4gICAgICAgICAgICAgICAgICAgIG09IW9uY2UgPyAyLjUgOiBjID8gNy41IDogNDAsIC8qIG11bHRpcGxpZXIgKi9cclxuICAgICAgICAgICAgICAgICAgICBjb250ZW50UG9zPVtNYXRoLmFicyhtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3ApLE1hdGguYWJzKG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQpXSxcclxuICAgICAgICAgICAgICAgICAgICByYXRpbz1bZC5zY3JvbGxSYXRpby55PjEwID8gMTAgOiBkLnNjcm9sbFJhdGlvLnksZC5zY3JvbGxSYXRpby54PjEwID8gMTAgOiBkLnNjcm9sbFJhdGlvLnhdLFxyXG4gICAgICAgICAgICAgICAgICAgIGFtb3VudD1zZXEuZGlyWzBdPT09XCJ4XCIgPyBjb250ZW50UG9zWzFdKyhzZXEuZGlyWzFdKihyYXRpb1sxXSptKSkgOiBjb250ZW50UG9zWzBdKyhzZXEuZGlyWzFdKihyYXRpb1swXSptKSksXHJcbiAgICAgICAgICAgICAgICAgICAgcHg9c2VxLmRpclswXT09PVwieFwiID8gY29udGVudFBvc1sxXSsoc2VxLmRpclsxXSpwYXJzZUludChzZXEuc2Nyb2xsQW1vdW50KSkgOiBjb250ZW50UG9zWzBdKyhzZXEuZGlyWzFdKnBhcnNlSW50KHNlcS5zY3JvbGxBbW91bnQpKSxcclxuICAgICAgICAgICAgICAgICAgICB0bz1zZXEuc2Nyb2xsQW1vdW50IT09XCJhdXRvXCIgPyBweCA6IGFtb3VudCxcclxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc9ZSA/IGUgOiAhb25jZSA/IFwibWNzTGluZWFyXCIgOiBjID8gXCJtY3NMaW5lYXJPdXRcIiA6IFwibWNzRWFzZUluT3V0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZT0hb25jZSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmKG9uY2UgJiYgdDwxNyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdG89c2VxLmRpclswXT09PVwieFwiID8gY29udGVudFBvc1sxXSA6IGNvbnRlbnRQb3NbMF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfc2Nyb2xsVG8oZWwsdG8udG9TdHJpbmcoKSx7ZGlyOnNlcS5kaXJbMF0sc2Nyb2xsRWFzaW5nOmVhc2luZyxkdXI6dCxvbkNvbXBsZXRlOm9uQ29tcGxldGV9KTtcclxuICAgICAgICAgICAgICAgIGlmKG9uY2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIHNlcS5kaXI9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNlcS5zdGVwKTtcclxuICAgICAgICAgICAgICAgIHNlcS5zdGVwPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBfb24oKTtcclxuICAgICAgICAgICAgICAgIH0sdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyogc3RvcHMgc2VxdWVuY2UgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gX29mZigpe1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNlcS5zdGVwKTtcclxuICAgICAgICAgICAgICAgIF9kZWxldGUoc2VxLFwic3RlcFwiKTtcclxuICAgICAgICAgICAgICAgIF9zdG9wKGVsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIHJldHVybnMgYSB5eCBhcnJheSBmcm9tIHZhbHVlICovXHJcbiAgICAgICAgX2Fycj1mdW5jdGlvbih2YWwpe1xyXG4gICAgICAgICAgICB2YXIgbz0kKHRoaXMpLmRhdGEocGx1Z2luUGZ4KS5vcHQsdmFscz1bXTtcclxuICAgICAgICAgICAgaWYodHlwZW9mIHZhbD09PVwiZnVuY3Rpb25cIil7dmFsPXZhbCgpO30gLyogY2hlY2sgaWYgdGhlIHZhbHVlIGlzIGEgc2luZ2xlIGFub255bW91cyBmdW5jdGlvbiAqL1xyXG4gICAgICAgICAgICAvKiBjaGVjayBpZiB2YWx1ZSBpcyBvYmplY3Qgb3IgYXJyYXksIGl0cyBsZW5ndGggYW5kIGNyZWF0ZSBhbiBhcnJheSB3aXRoIHl4IHZhbHVlcyAqL1xyXG4gICAgICAgICAgICBpZighKHZhbCBpbnN0YW5jZW9mIEFycmF5KSl7IC8qIG9iamVjdCB2YWx1ZSAoZS5nLiB7eTpcIjEwMFwiLHg6XCIxMDBcIn0sIDEwMCBldGMuKSAqL1xyXG4gICAgICAgICAgICAgICAgdmFsc1swXT12YWwueSA/IHZhbC55IDogdmFsLnggfHwgby5heGlzPT09XCJ4XCIgPyBudWxsIDogdmFsO1xyXG4gICAgICAgICAgICAgICAgdmFsc1sxXT12YWwueCA/IHZhbC54IDogdmFsLnkgfHwgby5heGlzPT09XCJ5XCIgPyBudWxsIDogdmFsO1xyXG4gICAgICAgICAgICB9ZWxzZXsgLyogYXJyYXkgdmFsdWUgKGUuZy4gWzEwMCwxMDBdKSAqL1xyXG4gICAgICAgICAgICAgICAgdmFscz12YWwubGVuZ3RoPjEgPyBbdmFsWzBdLHZhbFsxXV0gOiBvLmF4aXM9PT1cInhcIiA/IFtudWxsLHZhbFswXV0gOiBbdmFsWzBdLG51bGxdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIGNoZWNrIGlmIGFycmF5IHZhbHVlcyBhcmUgYW5vbnltb3VzIGZ1bmN0aW9ucyAqL1xyXG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsc1swXT09PVwiZnVuY3Rpb25cIil7dmFsc1swXT12YWxzWzBdKCk7fVxyXG4gICAgICAgICAgICBpZih0eXBlb2YgdmFsc1sxXT09PVwiZnVuY3Rpb25cIil7dmFsc1sxXT12YWxzWzFdKCk7fVxyXG4gICAgICAgICAgICByZXR1cm4gdmFscztcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiB0cmFuc2xhdGVzIHZhbHVlcyAoZS5nLiBcInRvcFwiLCAxMDAsIFwiMTAwcHhcIiwgXCIjaWRcIikgdG8gYWN0dWFsIHNjcm9sbC10byBwb3NpdGlvbnMgKi9cclxuICAgICAgICBfdG89ZnVuY3Rpb24odmFsLGRpcil7XHJcbiAgICAgICAgICAgIGlmKHZhbD09bnVsbCB8fCB0eXBlb2YgdmFsPT1cInVuZGVmaW5lZFwiKXtyZXR1cm47fVxyXG4gICAgICAgICAgICB2YXIgJHRoaXM9JCh0aGlzKSxkPSR0aGlzLmRhdGEocGx1Z2luUGZ4KSxvPWQub3B0LFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuICAgICAgICAgICAgICAgIHdyYXBwZXI9bUNTQl9jb250YWluZXIucGFyZW50KCksXHJcbiAgICAgICAgICAgICAgICB0PXR5cGVvZiB2YWw7XHJcbiAgICAgICAgICAgIGlmKCFkaXIpe2Rpcj1vLmF4aXM9PT1cInhcIiA/IFwieFwiIDogXCJ5XCI7fVxyXG4gICAgICAgICAgICB2YXIgY29udGVudExlbmd0aD1kaXI9PT1cInhcIiA/IG1DU0JfY29udGFpbmVyLm91dGVyV2lkdGgoZmFsc2UpIDogbUNTQl9jb250YWluZXIub3V0ZXJIZWlnaHQoZmFsc2UpLFxyXG4gICAgICAgICAgICAgICAgY29udGVudFBvcz1kaXI9PT1cInhcIiA/IG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQgOiBtQ1NCX2NvbnRhaW5lclswXS5vZmZzZXRUb3AsXHJcbiAgICAgICAgICAgICAgICBjc3NQcm9wPWRpcj09PVwieFwiID8gXCJsZWZ0XCIgOiBcInRvcFwiO1xyXG4gICAgICAgICAgICBzd2l0Y2godCl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZnVuY3Rpb25cIjogLyogdGhpcyBjdXJyZW50bHkgaXMgbm90IHVzZWQuIENvbnNpZGVyIHJlbW92aW5nIGl0ICovXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOiAvKiBqcy9qcXVlcnkgb2JqZWN0ICovXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaj12YWwuanF1ZXJ5ID8gdmFsIDogJCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFvYmoubGVuZ3RoKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXI9PT1cInhcIiA/IF9jaGlsZFBvcyhvYmopWzFdIDogX2NoaWxkUG9zKG9iailbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6IGNhc2UgXCJudW1iZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBpZihfaXNOdW1lcmljKHZhbCkpeyAvKiBudW1lcmljIHZhbHVlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyh2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHZhbC5pbmRleE9mKFwiJVwiKSE9PS0xKXsgLyogcGVyY2VudGFnZSB2YWx1ZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMoY29udGVudExlbmd0aCpwYXJzZUludCh2YWwpLzEwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYodmFsLmluZGV4T2YoXCItPVwiKSE9PS0xKXsgLyogZGVjcmVhc2UgdmFsdWUgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKGNvbnRlbnRQb3MtcGFyc2VJbnQodmFsLnNwbGl0KFwiLT1cIilbMV0pKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih2YWwuaW5kZXhPZihcIis9XCIpIT09LTEpeyAvKiBpbnJlYXNlIHZhbHVlICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwPShjb250ZW50UG9zK3BhcnNlSW50KHZhbC5zcGxpdChcIis9XCIpWzFdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwPj0wID8gMCA6IE1hdGguYWJzKHApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHZhbC5pbmRleE9mKFwicHhcIikhPT0tMSAmJiBfaXNOdW1lcmljKHZhbC5zcGxpdChcInB4XCIpWzBdKSl7IC8qIHBpeGVscyBzdHJpbmcgdmFsdWUgKGUuZy4gXCIxMDBweFwiKSAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnModmFsLnNwbGl0KFwicHhcIilbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih2YWw9PT1cInRvcFwiIHx8IHZhbD09PVwibGVmdFwiKXsgLyogc3BlY2lhbCBzdHJpbmdzICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYodmFsPT09XCJib3R0b21cIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMod3JhcHBlci5oZWlnaHQoKS1tQ1NCX2NvbnRhaW5lci5vdXRlckhlaWdodChmYWxzZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZSBpZih2YWw9PT1cInJpZ2h0XCIpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKHdyYXBwZXIud2lkdGgoKS1tQ1NCX2NvbnRhaW5lci5vdXRlcldpZHRoKGZhbHNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKHZhbD09PVwiZmlyc3RcIiB8fCB2YWw9PT1cImxhc3RcIil7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb2JqPW1DU0JfY29udGFpbmVyLmZpbmQoXCI6XCIrdmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXI9PT1cInhcIiA/IF9jaGlsZFBvcyhvYmopWzFdIDogX2NoaWxkUG9zKG9iailbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoJCh2YWwpLmxlbmd0aCl7IC8qIGpxdWVyeSBzZWxlY3RvciAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXI9PT1cInhcIiA/IF9jaGlsZFBvcygkKHZhbCkpWzFdIDogX2NoaWxkUG9zKCQodmFsKSlbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXsgLyogb3RoZXIgdmFsdWVzIChlLmcuIFwiMTAwZW1cIikgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lci5jc3MoY3NzUHJvcCx2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZHMudXBkYXRlLmNhbGwobnVsbCwkdGhpc1swXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogY2FsbHMgdGhlIHVwZGF0ZSBtZXRob2QgYXV0b21hdGljYWxseSAqL1xyXG4gICAgICAgIF9hdXRvVXBkYXRlPWZ1bmN0aW9uKHJlbSl7XHJcbiAgICAgICAgICAgIHZhciAkdGhpcz0kKHRoaXMpLGQ9JHRoaXMuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lcj0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyXCIpO1xyXG4gICAgICAgICAgICBpZihyZW0pe1xyXG4gICAgICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICAgIHJlbW92ZXMgYXV0b1VwZGF0ZSB0aW1lclxyXG4gICAgICAgICAgICAgICAgdXNhZ2U6IF9hdXRvVXBkYXRlLmNhbGwodGhpcyxcInJlbW92ZVwiKTtcclxuICAgICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobUNTQl9jb250YWluZXJbMF0uYXV0b1VwZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBfZGVsZXRlKG1DU0JfY29udGFpbmVyWzBdLFwiYXV0b1VwZGF0ZVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1cGQoKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkKCl7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQobUNTQl9jb250YWluZXJbMF0uYXV0b1VwZGF0ZSk7XHJcbiAgICAgICAgICAgICAgICBpZigkdGhpcy5wYXJlbnRzKFwiaHRtbFwiKS5sZW5ndGg9PT0wKXtcclxuICAgICAgICAgICAgICAgICAgICAvKiBjaGVjayBlbGVtZW50IGluIGRvbSB0cmVlICovXHJcbiAgICAgICAgICAgICAgICAgICAgJHRoaXM9bnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lclswXS5hdXRvVXBkYXRlPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAvKiB1cGRhdGUgb24gc3BlY2lmaWMgc2VsZWN0b3IocykgbGVuZ3RoIGFuZCBzaXplIGNoYW5nZSAqL1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucG9sbC5jaGFuZ2Uubj1zaXplc1N1bSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkLnBvbGwuY2hhbmdlLm4hPT1kLnBvbGwuY2hhbmdlLm8pe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5wb2xsLmNoYW5nZS5vPWQucG9sbC5jaGFuZ2UubjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvVXBkKDMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHVwZGF0ZSBvbiBtYWluIGVsZW1lbnQgYW5kIHNjcm9sbGJhciBzaXplIGNoYW5nZXMgKi9cclxuICAgICAgICAgICAgICAgICAgICBpZihvLmFkdmFuY2VkLnVwZGF0ZU9uQ29udGVudFJlc2l6ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGQucG9sbC5zaXplLm49JHRoaXNbMF0uc2Nyb2xsSGVpZ2h0KyR0aGlzWzBdLnNjcm9sbFdpZHRoK21DU0JfY29udGFpbmVyWzBdLm9mZnNldEhlaWdodCskdGhpc1swXS5vZmZzZXRIZWlnaHQrJHRoaXNbMF0ub2Zmc2V0V2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGQucG9sbC5zaXplLm4hPT1kLnBvbGwuc2l6ZS5vKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQucG9sbC5zaXplLm89ZC5wb2xsLnNpemUubjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvVXBkKDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8qIHVwZGF0ZSBvbiBpbWFnZSBsb2FkICovXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoby5hZHZhbmNlZC51cGRhdGVPbkltYWdlTG9hZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCEoby5hZHZhbmNlZC51cGRhdGVPbkltYWdlTG9hZD09PVwiYXV0b1wiICYmIG8uYXhpcz09PVwieVwiKSl7IC8vYnkgZGVmYXVsdCwgaXQgZG9lc24ndCBydW4gb24gdmVydGljYWwgY29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC5wb2xsLmltZy5uPW1DU0JfY29udGFpbmVyLmZpbmQoXCJpbWdcIikubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZC5wb2xsLmltZy5uIT09ZC5wb2xsLmltZy5vKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkLnBvbGwuaW1nLm89ZC5wb2xsLmltZy5uO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyLmZpbmQoXCJpbWdcIikuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWdMb2FkZXIodGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZSB8fCBvLmFkdmFuY2VkLnVwZGF0ZU9uQ29udGVudFJlc2l6ZSB8fCBvLmFkdmFuY2VkLnVwZGF0ZU9uSW1hZ2VMb2FkKXt1cGQoKTt9XHJcbiAgICAgICAgICAgICAgICB9LG8uYWR2YW5jZWQuYXV0b1VwZGF0ZVRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIGEgdGlueSBpbWFnZSBsb2FkZXIgKi9cclxuICAgICAgICAgICAgZnVuY3Rpb24gaW1nTG9hZGVyKGVsKXtcclxuICAgICAgICAgICAgICAgIGlmKCQoZWwpLmhhc0NsYXNzKGNsYXNzZXNbMl0pKXtkb1VwZCgpOyByZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgdmFyIGltZz1uZXcgSW1hZ2UoKTtcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGNyZWF0ZURlbGVnYXRlKGNvbnRleHRPYmplY3QsZGVsZWdhdGVNZXRob2Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpe3JldHVybiBkZWxlZ2F0ZU1ldGhvZC5hcHBseShjb250ZXh0T2JqZWN0LGFyZ3VtZW50cyk7fVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gaW1nT25Mb2FkKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbmxvYWQ9bnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAkKGVsKS5hZGRDbGFzcyhjbGFzc2VzWzJdKTtcclxuICAgICAgICAgICAgICAgICAgICBkb1VwZCgyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGltZy5vbmxvYWQ9Y3JlYXRlRGVsZWdhdGUoaW1nLGltZ09uTG9hZCk7XHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjPWVsLnNyYztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvKiByZXR1cm5zIHRoZSB0b3RhbCBoZWlnaHQgYW5kIHdpZHRoIHN1bSBvZiBhbGwgZWxlbWVudHMgbWF0Y2hpbmcgdGhlIHNlbGVjdG9yICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNpemVzU3VtKCl7XHJcbiAgICAgICAgICAgICAgICBpZihvLmFkdmFuY2VkLnVwZGF0ZU9uU2VsZWN0b3JDaGFuZ2U9PT10cnVlKXtvLmFkdmFuY2VkLnVwZGF0ZU9uU2VsZWN0b3JDaGFuZ2U9XCIqXCI7fVxyXG4gICAgICAgICAgICAgICAgdmFyIHRvdGFsPTAsc2VsPW1DU0JfY29udGFpbmVyLmZpbmQoby5hZHZhbmNlZC51cGRhdGVPblNlbGVjdG9yQ2hhbmdlKTtcclxuICAgICAgICAgICAgICAgIGlmKG8uYWR2YW5jZWQudXBkYXRlT25TZWxlY3RvckNoYW5nZSAmJiBzZWwubGVuZ3RoPjApe3NlbC5lYWNoKGZ1bmN0aW9uKCl7dG90YWwrPXRoaXMub2Zmc2V0SGVpZ2h0K3RoaXMub2Zmc2V0V2lkdGg7fSk7fVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRvdGFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIGNhbGxzIHRoZSB1cGRhdGUgbWV0aG9kICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRvVXBkKGNiKXtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChtQ1NCX2NvbnRhaW5lclswXS5hdXRvVXBkYXRlKTtcclxuICAgICAgICAgICAgICAgIG1ldGhvZHMudXBkYXRlLmNhbGwobnVsbCwkdGhpc1swXSxjYik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiBzbmFwcyBzY3JvbGxpbmcgdG8gYSBtdWx0aXBsZSBvZiBhIHBpeGVscyBudW1iZXIgKi9cclxuICAgICAgICBfc25hcEFtb3VudD1mdW5jdGlvbih0byxhbW91bnQsb2Zmc2V0KXtcclxuICAgICAgICAgICAgcmV0dXJuIChNYXRoLnJvdW5kKHRvL2Ftb3VudCkqYW1vdW50LW9mZnNldCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogc3RvcHMgY29udGVudCBhbmQgc2Nyb2xsYmFyIGFuaW1hdGlvbnMgKi9cclxuICAgICAgICBfc3RvcD1mdW5jdGlvbihlbCl7XHJcbiAgICAgICAgICAgIHZhciBkPWVsLmRhdGEocGx1Z2luUGZ4KSxcclxuICAgICAgICAgICAgICAgIHNlbD0kKFwiI21DU0JfXCIrZC5pZHgrXCJfY29udGFpbmVyLCNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lcl93cmFwcGVyLCNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWwsI21DU0JfXCIrZC5pZHgrXCJfZHJhZ2dlcl9ob3Jpem9udGFsXCIpO1xyXG4gICAgICAgICAgICBzZWwuZWFjaChmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgX3N0b3BUd2Vlbi5jYWxsKHRoaXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKlxyXG4gICAgICAgIEFOSU1BVEVTIENPTlRFTlRcclxuICAgICAgICBUaGlzIGlzIHdoZXJlIHRoZSBhY3R1YWwgc2Nyb2xsaW5nIGhhcHBlbnNcclxuICAgICAgICAqL1xyXG4gICAgICAgIF9zY3JvbGxUbz1mdW5jdGlvbihlbCx0byxvcHRpb25zKXtcclxuICAgICAgICAgICAgdmFyIGQ9ZWwuZGF0YShwbHVnaW5QZngpLG89ZC5vcHQsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0cz17XHJcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjpcImludGVybmFsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyOlwieVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbEVhc2luZzpcIm1jc0Vhc2VPdXRcIixcclxuICAgICAgICAgICAgICAgICAgICBkcmFnOmZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGR1cjpvLnNjcm9sbEluZXJ0aWEsXHJcbiAgICAgICAgICAgICAgICAgICAgb3ZlcndyaXRlOlwiYWxsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tzOnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgb25TdGFydDp0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIG9uVXBkYXRlOnRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgb25Db21wbGV0ZTp0cnVlXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucz0kLmV4dGVuZChkZWZhdWx0cyxvcHRpb25zKSxcclxuICAgICAgICAgICAgICAgIGR1cj1bb3B0aW9ucy5kdXIsKG9wdGlvbnMuZHJhZyA/IDAgOiBvcHRpb25zLmR1cildLFxyXG4gICAgICAgICAgICAgICAgbUN1c3RvbVNjcm9sbEJveD0kKFwiI21DU0JfXCIrZC5pZHgpLFxyXG4gICAgICAgICAgICAgICAgbUNTQl9jb250YWluZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2NvbnRhaW5lclwiKSxcclxuICAgICAgICAgICAgICAgIHdyYXBwZXI9bUNTQl9jb250YWluZXIucGFyZW50KCksXHJcbiAgICAgICAgICAgICAgICB0b3RhbFNjcm9sbE9mZnNldHM9by5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbE9mZnNldCA/IF9hcnIuY2FsbChlbCxvLmNhbGxiYWNrcy5vblRvdGFsU2Nyb2xsT2Zmc2V0KSA6IFswLDBdLFxyXG4gICAgICAgICAgICAgICAgdG90YWxTY3JvbGxCYWNrT2Zmc2V0cz1vLmNhbGxiYWNrcy5vblRvdGFsU2Nyb2xsQmFja09mZnNldCA/IF9hcnIuY2FsbChlbCxvLmNhbGxiYWNrcy5vblRvdGFsU2Nyb2xsQmFja09mZnNldCkgOiBbMCwwXTtcclxuICAgICAgICAgICAgZC50cmlnZ2VyPW9wdGlvbnMudHJpZ2dlcjtcclxuICAgICAgICAgICAgaWYod3JhcHBlci5zY3JvbGxUb3AoKSE9PTAgfHwgd3JhcHBlci5zY3JvbGxMZWZ0KCkhPT0wKXsgLyogYWx3YXlzIHJlc2V0IHNjcm9sbFRvcC9MZWZ0ICovXHJcbiAgICAgICAgICAgICAgICAkKFwiLm1DU0JfXCIrZC5pZHgrXCJfc2Nyb2xsYmFyXCIpLmNzcyhcInZpc2liaWxpdHlcIixcInZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnNjcm9sbFRvcCgwKS5zY3JvbGxMZWZ0KDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRvPT09XCJfcmVzZXRZXCIgJiYgIWQuY29udGVudFJlc2V0Lnkpe1xyXG4gICAgICAgICAgICAgICAgLyogY2FsbGJhY2tzOiBvbk92ZXJmbG93WU5vbmUgKi9cclxuICAgICAgICAgICAgICAgIGlmKF9jYihcIm9uT3ZlcmZsb3dZTm9uZVwiKSl7by5jYWxsYmFja3Mub25PdmVyZmxvd1lOb25lLmNhbGwoZWxbMF0pO31cclxuICAgICAgICAgICAgICAgIGQuY29udGVudFJlc2V0Lnk9MTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0bz09PVwiX3Jlc2V0WFwiICYmICFkLmNvbnRlbnRSZXNldC54KXtcclxuICAgICAgICAgICAgICAgIC8qIGNhbGxiYWNrczogb25PdmVyZmxvd1hOb25lICovXHJcbiAgICAgICAgICAgICAgICBpZihfY2IoXCJvbk92ZXJmbG93WE5vbmVcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dYTm9uZS5jYWxsKGVsWzBdKTt9XHJcbiAgICAgICAgICAgICAgICBkLmNvbnRlbnRSZXNldC54PTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodG89PT1cIl9yZXNldFlcIiB8fCB0bz09PVwiX3Jlc2V0WFwiKXtyZXR1cm47fVxyXG4gICAgICAgICAgICBpZigoZC5jb250ZW50UmVzZXQueSB8fCAhZWxbMF0ubWNzKSAmJiBkLm92ZXJmbG93ZWRbMF0pe1xyXG4gICAgICAgICAgICAgICAgLyogY2FsbGJhY2tzOiBvbk92ZXJmbG93WSAqL1xyXG4gICAgICAgICAgICAgICAgaWYoX2NiKFwib25PdmVyZmxvd1lcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dZLmNhbGwoZWxbMF0pO31cclxuICAgICAgICAgICAgICAgIGQuY29udGVudFJlc2V0Lng9bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZigoZC5jb250ZW50UmVzZXQueCB8fCAhZWxbMF0ubWNzKSAmJiBkLm92ZXJmbG93ZWRbMV0pe1xyXG4gICAgICAgICAgICAgICAgLyogY2FsbGJhY2tzOiBvbk92ZXJmbG93WCAqL1xyXG4gICAgICAgICAgICAgICAgaWYoX2NiKFwib25PdmVyZmxvd1hcIikpe28uY2FsbGJhY2tzLm9uT3ZlcmZsb3dYLmNhbGwoZWxbMF0pO31cclxuICAgICAgICAgICAgICAgIGQuY29udGVudFJlc2V0Lng9bnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihvLnNuYXBBbW91bnQpeyAvKiBzY3JvbGxpbmcgc25hcHBpbmcgKi9cclxuICAgICAgICAgICAgICAgIHZhciBzbmFwQW1vdW50PSEoby5zbmFwQW1vdW50IGluc3RhbmNlb2YgQXJyYXkpID8gby5zbmFwQW1vdW50IDogb3B0aW9ucy5kaXI9PT1cInhcIiA/IG8uc25hcEFtb3VudFsxXSA6IG8uc25hcEFtb3VudFswXTtcclxuICAgICAgICAgICAgICAgIHRvPV9zbmFwQW1vdW50KHRvLHNuYXBBbW91bnQsby5zbmFwT2Zmc2V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2gob3B0aW9ucy5kaXIpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInhcIjpcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbUNTQl9kcmFnZ2VyPSQoXCIjbUNTQl9cIitkLmlkeCtcIl9kcmFnZ2VyX2hvcml6b250YWxcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5PVwibGVmdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50UG9zPW1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbWl0PVtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1DdXN0b21TY3JvbGxCb3gud2lkdGgoKS1tQ1NCX2NvbnRhaW5lci5vdXRlcldpZHRoKGZhbHNlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlci5wYXJlbnQoKS53aWR0aCgpLW1DU0JfZHJhZ2dlci53aWR0aCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvPVt0byx0bz09PTAgPyAwIDogKHRvL2Quc2Nyb2xsUmF0aW8ueCldLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0c289dG90YWxTY3JvbGxPZmZzZXRzWzFdLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0c2JvPXRvdGFsU2Nyb2xsQmFja09mZnNldHNbMV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU2Nyb2xsT2Zmc2V0PXRzbz4wID8gdHNvL2Quc2Nyb2xsUmF0aW8ueCA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsU2Nyb2xsQmFja09mZnNldD10c2JvPjAgPyB0c2JvL2Quc2Nyb2xsUmF0aW8ueCA6IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwieVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtQ1NCX2RyYWdnZXI9JChcIiNtQ1NCX1wiK2QuaWR4K1wiX2RyYWdnZXJfdmVydGljYWxcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5PVwidG9wXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRQb3M9bUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW1pdD1bXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ3VzdG9tU2Nyb2xsQm94LmhlaWdodCgpLW1DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1DU0JfZHJhZ2dlci5wYXJlbnQoKS5oZWlnaHQoKS1tQ1NCX2RyYWdnZXIuaGVpZ2h0KClcclxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG89W3RvLHRvPT09MCA/IDAgOiAodG8vZC5zY3JvbGxSYXRpby55KV0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRzbz10b3RhbFNjcm9sbE9mZnNldHNbMF0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRzYm89dG90YWxTY3JvbGxCYWNrT2Zmc2V0c1swXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTY3JvbGxPZmZzZXQ9dHNvPjAgPyB0c28vZC5zY3JvbGxSYXRpby55IDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWxTY3JvbGxCYWNrT2Zmc2V0PXRzYm8+MCA/IHRzYm8vZC5zY3JvbGxSYXRpby55IDogMDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihzY3JvbGxUb1sxXTwwIHx8IChzY3JvbGxUb1swXT09PTAgJiYgc2Nyb2xsVG9bMV09PT0wKSl7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxUbz1bMCwwXTtcclxuICAgICAgICAgICAgfWVsc2UgaWYoc2Nyb2xsVG9bMV0+PWxpbWl0WzFdKXtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvPVtsaW1pdFswXSxsaW1pdFsxXV07XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9bMF09LXNjcm9sbFRvWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKCFlbFswXS5tY3Mpe1xyXG4gICAgICAgICAgICAgICAgX21jcygpOyAgLyogaW5pdCBtY3Mgb2JqZWN0IChvbmNlKSB0byBtYWtlIGl0IGF2YWlsYWJsZSBiZWZvcmUgY2FsbGJhY2tzICovXHJcbiAgICAgICAgICAgICAgICBpZihfY2IoXCJvbkluaXRcIikpe28uY2FsbGJhY2tzLm9uSW5pdC5jYWxsKGVsWzBdKTt9IC8qIGNhbGxiYWNrczogb25Jbml0ICovXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KG1DU0JfY29udGFpbmVyWzBdLm9uQ29tcGxldGVUaW1lb3V0KTtcclxuICAgICAgICAgICAgX3R3ZWVuVG8obUNTQl9kcmFnZ2VyWzBdLHByb3BlcnR5LE1hdGgucm91bmQoc2Nyb2xsVG9bMV0pLGR1clsxXSxvcHRpb25zLnNjcm9sbEVhc2luZyk7XHJcbiAgICAgICAgICAgIGlmKCFkLnR3ZWVuUnVubmluZyAmJiAoKGNvbnRlbnRQb3M9PT0wICYmIHNjcm9sbFRvWzBdPj0wKSB8fCAoY29udGVudFBvcz09PWxpbWl0WzBdICYmIHNjcm9sbFRvWzBdPD1saW1pdFswXSkpKXtyZXR1cm47fVxyXG4gICAgICAgICAgICBfdHdlZW5UbyhtQ1NCX2NvbnRhaW5lclswXSxwcm9wZXJ0eSxNYXRoLnJvdW5kKHNjcm9sbFRvWzBdKSxkdXJbMF0sb3B0aW9ucy5zY3JvbGxFYXNpbmcsb3B0aW9ucy5vdmVyd3JpdGUse1xyXG4gICAgICAgICAgICAgICAgb25TdGFydDpmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG9wdGlvbnMuY2FsbGJhY2tzICYmIG9wdGlvbnMub25TdGFydCAmJiAhZC50d2VlblJ1bm5pbmcpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiBjYWxsYmFja3M6IG9uU2Nyb2xsU3RhcnQgKi9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoX2NiKFwib25TY3JvbGxTdGFydFwiKSl7X21jcygpOyBvLmNhbGxiYWNrcy5vblNjcm9sbFN0YXJ0LmNhbGwoZWxbMF0pO31cclxuICAgICAgICAgICAgICAgICAgICAgICAgZC50d2VlblJ1bm5pbmc9dHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX29uRHJhZ0NsYXNzZXMobUNTQl9kcmFnZ2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZC5jYk9mZnNldHM9X2NiT2Zmc2V0cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sb25VcGRhdGU6ZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihvcHRpb25zLmNhbGxiYWNrcyAmJiBvcHRpb25zLm9uVXBkYXRlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogY2FsbGJhY2tzOiB3aGlsZVNjcm9sbGluZyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfY2IoXCJ3aGlsZVNjcm9sbGluZ1wiKSl7X21jcygpOyBvLmNhbGxiYWNrcy53aGlsZVNjcm9sbGluZy5jYWxsKGVsWzBdKTt9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxvbkNvbXBsZXRlOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYob3B0aW9ucy5jYWxsYmFja3MgJiYgb3B0aW9ucy5vbkNvbXBsZXRlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoby5heGlzPT09XCJ5eFwiKXtjbGVhclRpbWVvdXQobUNTQl9jb250YWluZXJbMF0ub25Db21wbGV0ZVRpbWVvdXQpO31cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHQ9bUNTQl9jb250YWluZXJbMF0uaWRsZVRpbWVyIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1DU0JfY29udGFpbmVyWzBdLm9uQ29tcGxldGVUaW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGNhbGxiYWNrczogb25TY3JvbGwsIG9uVG90YWxTY3JvbGwsIG9uVG90YWxTY3JvbGxCYWNrICovXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfY2IoXCJvblNjcm9sbFwiKSl7X21jcygpOyBvLmNhbGxiYWNrcy5vblNjcm9sbC5jYWxsKGVsWzBdKTt9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihfY2IoXCJvblRvdGFsU2Nyb2xsXCIpICYmIHNjcm9sbFRvWzFdPj1saW1pdFsxXS10b3RhbFNjcm9sbE9mZnNldCAmJiBkLmNiT2Zmc2V0c1swXSl7X21jcygpOyBvLmNhbGxiYWNrcy5vblRvdGFsU2Nyb2xsLmNhbGwoZWxbMF0pO31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKF9jYihcIm9uVG90YWxTY3JvbGxCYWNrXCIpICYmIHNjcm9sbFRvWzFdPD10b3RhbFNjcm9sbEJhY2tPZmZzZXQgJiYgZC5jYk9mZnNldHNbMV0pe19tY3MoKTsgby5jYWxsYmFja3Mub25Ub3RhbFNjcm9sbEJhY2suY2FsbChlbFswXSk7fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZC50d2VlblJ1bm5pbmc9ZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtQ1NCX2NvbnRhaW5lclswXS5pZGxlVGltZXI9MDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9vbkRyYWdDbGFzc2VzKG1DU0JfZHJhZ2dlcixcImhpZGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgLyogY2hlY2tzIGlmIGNhbGxiYWNrIGZ1bmN0aW9uIGV4aXN0cyAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBfY2IoY2Ipe1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGQgJiYgby5jYWxsYmFja3NbY2JdICYmIHR5cGVvZiBvLmNhbGxiYWNrc1tjYl09PT1cImZ1bmN0aW9uXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLyogY2hlY2tzIHdoZXRoZXIgY2FsbGJhY2sgb2Zmc2V0cyBhbHdheXMgdHJpZ2dlciAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBfY2JPZmZzZXRzKCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW28uY2FsbGJhY2tzLmFsd2F5c1RyaWdnZXJPZmZzZXRzIHx8IGNvbnRlbnRQb3M+PWxpbWl0WzBdK3RzbyxvLmNhbGxiYWNrcy5hbHdheXNUcmlnZ2VyT2Zmc2V0cyB8fCBjb250ZW50UG9zPD0tdHNib107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgcG9wdWxhdGVzIG9iamVjdCB3aXRoIHVzZWZ1bCB2YWx1ZXMgZm9yIHRoZSB1c2VyXHJcbiAgICAgICAgICAgIHZhbHVlczpcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHRoaXMubWNzLmNvbnRlbnRcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgdG9wIHBvc2l0aW9uOiB0aGlzLm1jcy50b3BcclxuICAgICAgICAgICAgICAgIGNvbnRlbnQgbGVmdCBwb3NpdGlvbjogdGhpcy5tY3MubGVmdFxyXG4gICAgICAgICAgICAgICAgZHJhZ2dlciB0b3AgcG9zaXRpb246IHRoaXMubWNzLmRyYWdnZXJUb3BcclxuICAgICAgICAgICAgICAgIGRyYWdnZXIgbGVmdCBwb3NpdGlvbjogdGhpcy5tY3MuZHJhZ2dlckxlZnRcclxuICAgICAgICAgICAgICAgIHNjcm9sbGluZyB5IHBlcmNlbnRhZ2U6IHRoaXMubWNzLnRvcFBjdFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsaW5nIHggcGVyY2VudGFnZTogdGhpcy5tY3MubGVmdFBjdFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsaW5nIGRpcmVjdGlvbjogdGhpcy5tY3MuZGlyZWN0aW9uXHJcbiAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9tY3MoKXtcclxuICAgICAgICAgICAgICAgIHZhciBjcD1bbUNTQl9jb250YWluZXJbMF0ub2Zmc2V0VG9wLG1DU0JfY29udGFpbmVyWzBdLm9mZnNldExlZnRdLCAvKiBjb250ZW50IHBvc2l0aW9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgZHA9W21DU0JfZHJhZ2dlclswXS5vZmZzZXRUb3AsbUNTQl9kcmFnZ2VyWzBdLm9mZnNldExlZnRdLCAvKiBkcmFnZ2VyIHBvc2l0aW9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgY2w9W21DU0JfY29udGFpbmVyLm91dGVySGVpZ2h0KGZhbHNlKSxtQ1NCX2NvbnRhaW5lci5vdXRlcldpZHRoKGZhbHNlKV0sIC8qIGNvbnRlbnQgbGVuZ3RoICovXHJcbiAgICAgICAgICAgICAgICAgICAgcGw9W21DdXN0b21TY3JvbGxCb3guaGVpZ2h0KCksbUN1c3RvbVNjcm9sbEJveC53aWR0aCgpXTsgLyogY29udGVudCBwYXJlbnQgbGVuZ3RoICovXHJcbiAgICAgICAgICAgICAgICBlbFswXS5tY3M9e1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6bUNTQl9jb250YWluZXIsIC8qIG9yaWdpbmFsIGNvbnRlbnQgd3JhcHBlciBhcyBqcXVlcnkgb2JqZWN0ICovXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOmNwWzBdLGxlZnQ6Y3BbMV0sZHJhZ2dlclRvcDpkcFswXSxkcmFnZ2VyTGVmdDpkcFsxXSxcclxuICAgICAgICAgICAgICAgICAgICB0b3BQY3Q6TWF0aC5yb3VuZCgoMTAwKk1hdGguYWJzKGNwWzBdKSkvKE1hdGguYWJzKGNsWzBdKS1wbFswXSkpLGxlZnRQY3Q6TWF0aC5yb3VuZCgoMTAwKk1hdGguYWJzKGNwWzFdKSkvKE1hdGguYWJzKGNsWzFdKS1wbFsxXSkpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjpvcHRpb25zLmRpclxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAgICB0aGlzIHJlZmVycyB0byB0aGUgb3JpZ2luYWwgZWxlbWVudCBjb250YWluaW5nIHRoZSBzY3JvbGxiYXIocylcclxuICAgICAgICAgICAgICAgIHVzYWdlOiB0aGlzLm1jcy50b3AsIHRoaXMubWNzLmxlZnRQY3QgZXRjLlxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgQ1VTVE9NIEpBVkFTQ1JJUFQgQU5JTUFUSU9OIFRXRUVOXHJcbiAgICAgICAgTGlnaHRlciBhbmQgZmFzdGVyIHRoYW4ganF1ZXJ5IGFuaW1hdGUoKSBhbmQgY3NzIHRyYW5zaXRpb25zXHJcbiAgICAgICAgQW5pbWF0ZXMgdG9wL2xlZnQgcHJvcGVydGllcyBhbmQgaW5jbHVkZXMgZWFzaW5nc1xyXG4gICAgICAgICovXHJcbiAgICAgICAgX3R3ZWVuVG89ZnVuY3Rpb24oZWwscHJvcCx0byxkdXJhdGlvbixlYXNpbmcsb3ZlcndyaXRlLGNhbGxiYWNrcyl7XHJcbiAgICAgICAgICAgIGlmKCFlbC5fbVR3ZWVuKXtlbC5fbVR3ZWVuPXt0b3A6e30sbGVmdDp7fX07fVxyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tzPWNhbGxiYWNrcyB8fCB7fSxcclxuICAgICAgICAgICAgICAgIG9uU3RhcnQ9Y2FsbGJhY2tzLm9uU3RhcnQgfHwgZnVuY3Rpb24oKXt9LG9uVXBkYXRlPWNhbGxiYWNrcy5vblVwZGF0ZSB8fCBmdW5jdGlvbigpe30sb25Db21wbGV0ZT1jYWxsYmFja3Mub25Db21wbGV0ZSB8fCBmdW5jdGlvbigpe30sXHJcbiAgICAgICAgICAgICAgICBzdGFydFRpbWU9X2dldFRpbWUoKSxfZGVsYXkscHJvZ3Jlc3M9MCxmcm9tPWVsLm9mZnNldFRvcCxlbFN0eWxlPWVsLnN0eWxlLF9yZXF1ZXN0LHRvYmo9ZWwuX21Ud2Vlbltwcm9wXTtcclxuICAgICAgICAgICAgaWYocHJvcD09PVwibGVmdFwiKXtmcm9tPWVsLm9mZnNldExlZnQ7fVxyXG4gICAgICAgICAgICB2YXIgZGlmZj10by1mcm9tO1xyXG4gICAgICAgICAgICB0b2JqLnN0b3A9MDtcclxuICAgICAgICAgICAgaWYob3ZlcndyaXRlIT09XCJub25lXCIpe19jYW5jZWxUd2VlbigpO31cclxuICAgICAgICAgICAgX3N0YXJ0VHdlZW4oKTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gX3N0ZXAoKXtcclxuICAgICAgICAgICAgICAgIGlmKHRvYmouc3RvcCl7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgIGlmKCFwcm9ncmVzcyl7b25TdGFydC5jYWxsKCk7fVxyXG4gICAgICAgICAgICAgICAgcHJvZ3Jlc3M9X2dldFRpbWUoKS1zdGFydFRpbWU7XHJcbiAgICAgICAgICAgICAgICBfdHdlZW4oKTtcclxuICAgICAgICAgICAgICAgIGlmKHByb2dyZXNzPj10b2JqLnRpbWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvYmoudGltZT0ocHJvZ3Jlc3M+dG9iai50aW1lKSA/IHByb2dyZXNzK19kZWxheS0ocHJvZ3Jlc3MtdG9iai50aW1lKSA6IHByb2dyZXNzK19kZWxheS0xO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvYmoudGltZTxwcm9ncmVzcysxKXt0b2JqLnRpbWU9cHJvZ3Jlc3MrMTt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZih0b2JqLnRpbWU8ZHVyYXRpb24pe3RvYmouaWQ9X3JlcXVlc3QoX3N0ZXApO31lbHNle29uQ29tcGxldGUuY2FsbCgpO31cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiBfdHdlZW4oKXtcclxuICAgICAgICAgICAgICAgIGlmKGR1cmF0aW9uPjApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRvYmouY3VyclZhbD1fZWFzZSh0b2JqLnRpbWUsZnJvbSxkaWZmLGR1cmF0aW9uLGVhc2luZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxTdHlsZVtwcm9wXT1NYXRoLnJvdW5kKHRvYmouY3VyclZhbCkrXCJweFwiO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxTdHlsZVtwcm9wXT10bytcInB4XCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvblVwZGF0ZS5jYWxsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gX3N0YXJ0VHdlZW4oKXtcclxuICAgICAgICAgICAgICAgIF9kZWxheT0xMDAwLzYwO1xyXG4gICAgICAgICAgICAgICAgdG9iai50aW1lPXByb2dyZXNzK19kZWxheTtcclxuICAgICAgICAgICAgICAgIF9yZXF1ZXN0PSghd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSkgPyBmdW5jdGlvbihmKXtfdHdlZW4oKTsgcmV0dXJuIHNldFRpbWVvdXQoZiwwLjAxKTt9IDogd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuICAgICAgICAgICAgICAgIHRvYmouaWQ9X3JlcXVlc3QoX3N0ZXApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9jYW5jZWxUd2Vlbigpe1xyXG4gICAgICAgICAgICAgICAgaWYodG9iai5pZD09bnVsbCl7cmV0dXJuO31cclxuICAgICAgICAgICAgICAgIGlmKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKXtjbGVhclRpbWVvdXQodG9iai5pZCk7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZXt3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodG9iai5pZCk7fVxyXG4gICAgICAgICAgICAgICAgdG9iai5pZD1udWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9lYXNlKHQsYixjLGQsdHlwZSl7XHJcbiAgICAgICAgICAgICAgICBzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImxpbmVhclwiOiBjYXNlIFwibWNzTGluZWFyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjKnQvZCArIGI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJtY3NMaW5lYXJPdXRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdC89ZDsgdC0tOyByZXR1cm4gYyAqIE1hdGguc3FydCgxIC0gdCp0KSArIGI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlYXNlSW5PdXRTbW9vdGhcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdC89ZC8yO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0PDEpIHJldHVybiBjLzIqdCp0ICsgYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLWMvMiAqICh0Kih0LTIpIC0gMSkgKyBiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZWFzZUluT3V0U3Ryb25nXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQvPWQvMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodDwxKSByZXR1cm4gYy8yICogTWF0aC5wb3coIDIsIDEwICogKHQgLSAxKSApICsgYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYy8yICogKCAtTWF0aC5wb3coIDIsIC0xMCAqIHQpICsgMiApICsgYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImVhc2VJbk91dFwiOiBjYXNlIFwibWNzRWFzZUluT3V0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQvPWQvMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYodDwxKSByZXR1cm4gYy8yKnQqdCp0ICsgYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdC09MjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGMvMioodCp0KnQgKyAyKSArIGI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlYXNlT3V0U21vb3RoXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHQvPWQ7IHQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC1jICogKHQqdCp0KnQgLSAxKSArIGI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlYXNlT3V0U3Ryb25nXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjICogKCAtTWF0aC5wb3coIDIsIC0xMCAqIHQvZCApICsgMSApICsgYjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImVhc2VPdXRcIjogY2FzZSBcIm1jc0Vhc2VPdXRcIjogZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRzPSh0Lz1kKSp0LHRjPXRzKnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiK2MqKDAuNDk5OTk5OTk5OTk5OTk3KnRjKnRzICsgLTIuNSp0cyp0cyArIDUuNSp0YyArIC02LjUqdHMgKyA0KnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogcmV0dXJucyBjdXJyZW50IHRpbWUgKi9cclxuICAgICAgICBfZ2V0VGltZT1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBpZih3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2Uud2Via2l0Tm93KXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnBlcmZvcm1hbmNlLndlYmtpdE5vdygpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoRGF0ZS5ub3cpe3JldHVybiBEYXRlLm5vdygpO31lbHNle3JldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTt9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiBzdG9wcyBhIHR3ZWVuICovXHJcbiAgICAgICAgX3N0b3BUd2Vlbj1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgZWw9dGhpcztcclxuICAgICAgICAgICAgaWYoIWVsLl9tVHdlZW4pe2VsLl9tVHdlZW49e3RvcDp7fSxsZWZ0Ont9fTt9XHJcbiAgICAgICAgICAgIHZhciBwcm9wcz1bXCJ0b3BcIixcImxlZnRcIl07XHJcbiAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPHByb3BzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wPXByb3BzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYoZWwuX21Ud2Vlbltwcm9wXS5pZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpe2NsZWFyVGltZW91dChlbC5fbVR3ZWVuW3Byb3BdLmlkKTtcclxuICAgICAgICAgICAgICAgICAgICB9ZWxzZXt3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoZWwuX21Ud2Vlbltwcm9wXS5pZCk7fVxyXG4gICAgICAgICAgICAgICAgICAgIGVsLl9tVHdlZW5bcHJvcF0uaWQ9bnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBlbC5fbVR3ZWVuW3Byb3BdLnN0b3A9MTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGRlbGV0ZXMgYSBwcm9wZXJ0eSAoYXZvaWRpbmcgdGhlIGV4Y2VwdGlvbiB0aHJvd24gYnkgSUUpICovXHJcbiAgICAgICAgX2RlbGV0ZT1mdW5jdGlvbihjLG0pe1xyXG4gICAgICAgICAgICB0cnl7ZGVsZXRlIGNbbV07fWNhdGNoKGUpe2NbbV09bnVsbDt9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogZGV0ZWN0cyBsZWZ0IG1vdXNlIGJ1dHRvbiAqL1xyXG4gICAgICAgIF9tb3VzZUJ0bkxlZnQ9ZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHJldHVybiAhKGUud2hpY2ggJiYgZS53aGljaCE9PTEpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGRldGVjdHMgaWYgcG9pbnRlciB0eXBlIGV2ZW50IGlzIHRvdWNoICovXHJcbiAgICAgICAgX3BvaW50ZXJUb3VjaD1mdW5jdGlvbihlKXtcclxuICAgICAgICAgICAgdmFyIHQ9ZS5vcmlnaW5hbEV2ZW50LnBvaW50ZXJUeXBlO1xyXG4gICAgICAgICAgICByZXR1cm4gISh0ICYmIHQhPT1cInRvdWNoXCIgJiYgdCE9PTIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG4gICAgICAgIC8qIGNoZWNrcyBpZiB2YWx1ZSBpcyBudW1lcmljICovXHJcbiAgICAgICAgX2lzTnVtZXJpYz1mdW5jdGlvbih2YWwpe1xyXG4gICAgICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQodmFsKSkgJiYgaXNGaW5pdGUodmFsKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuICAgICAgICAvKiByZXR1cm5zIGVsZW1lbnQgcG9zaXRpb24gYWNjb3JkaW5nIHRvIGNvbnRlbnQgKi9cclxuICAgICAgICBfY2hpbGRQb3M9ZnVuY3Rpb24oZWwpe1xyXG4gICAgICAgICAgICB2YXIgcD1lbC5wYXJlbnRzKFwiLm1DU0JfY29udGFpbmVyXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gW2VsLm9mZnNldCgpLnRvcC1wLm9mZnNldCgpLnRvcCxlbC5vZmZzZXQoKS5sZWZ0LXAub2Zmc2V0KCkubGVmdF07XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcbiAgICAgICAgLyogY2hlY2tzIGlmIGJyb3dzZXIgdGFiIGlzIGhpZGRlbi9pbmFjdGl2ZSB2aWEgUGFnZSBWaXNpYmlsaXR5IEFQSSAqL1xyXG4gICAgICAgIF9pc1RhYkhpZGRlbj1mdW5jdGlvbigpe1xyXG4gICAgICAgICAgICB2YXIgcHJvcD1fZ2V0SGlkZGVuUHJvcCgpO1xyXG4gICAgICAgICAgICBpZighcHJvcCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnRbcHJvcF07XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIF9nZXRIaWRkZW5Qcm9wKCl7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGZ4PVtcIndlYmtpdFwiLFwibW96XCIsXCJtc1wiLFwib1wiXTtcclxuICAgICAgICAgICAgICAgIGlmKFwiaGlkZGVuXCIgaW4gZG9jdW1lbnQpIHJldHVybiBcImhpZGRlblwiOyAvL25hdGl2ZWx5IHN1cHBvcnRlZFxyXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8cGZ4Lmxlbmd0aDsgaSsrKXsgLy9wcmVmaXhlZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKChwZnhbaV0rXCJIaWRkZW5cIikgaW4gZG9jdW1lbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwZnhbaV0rXCJIaWRkZW5cIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsOyAvL25vdCBzdXBwb3J0ZWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLypcclxuICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgIFBMVUdJTiBTRVRVUFxyXG4gICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAgKi9cclxuXHJcbiAgICAvKiBwbHVnaW4gY29uc3RydWN0b3IgZnVuY3Rpb25zICovXHJcbiAgICAkLmZuW3BsdWdpbk5TXT1mdW5jdGlvbihtZXRob2QpeyAvKiB1c2FnZTogJChzZWxlY3RvcikubUN1c3RvbVNjcm9sbGJhcigpOyAqL1xyXG4gICAgICAgIGlmKG1ldGhvZHNbbWV0aG9kXSl7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRob2RzW21ldGhvZF0uYXBwbHkodGhpcyxBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSkpO1xyXG4gICAgICAgIH1lbHNlIGlmKHR5cGVvZiBtZXRob2Q9PT1cIm9iamVjdFwiIHx8ICFtZXRob2Qpe1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kcy5pbml0LmFwcGx5KHRoaXMsYXJndW1lbnRzKTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgJC5lcnJvcihcIk1ldGhvZCBcIittZXRob2QrXCIgZG9lcyBub3QgZXhpc3RcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgICRbcGx1Z2luTlNdPWZ1bmN0aW9uKG1ldGhvZCl7IC8qIHVzYWdlOiAkLm1DdXN0b21TY3JvbGxiYXIoKTsgKi9cclxuICAgICAgICBpZihtZXRob2RzW21ldGhvZF0pe1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kc1ttZXRob2RdLmFwcGx5KHRoaXMsQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLDEpKTtcclxuICAgICAgICB9ZWxzZSBpZih0eXBlb2YgbWV0aG9kPT09XCJvYmplY3RcIiB8fCAhbWV0aG9kKXtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZHMuaW5pdC5hcHBseSh0aGlzLGFyZ3VtZW50cyk7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICQuZXJyb3IoXCJNZXRob2QgXCIrbWV0aG9kK1wiIGRvZXMgbm90IGV4aXN0XCIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLypcclxuICAgIGFsbG93IHNldHRpbmcgcGx1Z2luIGRlZmF1bHQgb3B0aW9ucy5cclxuICAgIHVzYWdlOiAkLm1DdXN0b21TY3JvbGxiYXIuZGVmYXVsdHMuc2Nyb2xsSW5lcnRpYT01MDA7XHJcbiAgICB0byBhcHBseSBhbnkgY2hhbmdlZCBkZWZhdWx0IG9wdGlvbnMgb24gZGVmYXVsdCBzZWxlY3RvcnMgKGJlbG93KSwgdXNlIGluc2lkZSBkb2N1bWVudCByZWFkeSBmblxyXG4gICAgZS5nLjogJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXsgJC5tQ3VzdG9tU2Nyb2xsYmFyLmRlZmF1bHRzLnNjcm9sbEluZXJ0aWE9NTAwOyB9KTtcclxuICAgICovXHJcbiAgICAkW3BsdWdpbk5TXS5kZWZhdWx0cz1kZWZhdWx0cztcclxuXHJcbiAgICAvKlxyXG4gICAgYWRkIHdpbmRvdyBvYmplY3QgKHdpbmRvdy5tQ3VzdG9tU2Nyb2xsYmFyKVxyXG4gICAgdXNhZ2U6IGlmKHdpbmRvdy5tQ3VzdG9tU2Nyb2xsYmFyKXtjb25zb2xlLmxvZyhcImN1c3RvbSBzY3JvbGxiYXIgcGx1Z2luIGxvYWRlZFwiKTt9XHJcbiAgICAqL1xyXG4gICAgd2luZG93W3BsdWdpbk5TXT10cnVlO1xyXG5cclxuICAgICQod2luZG93KS5sb2FkKGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICQoZGVmYXVsdFNlbGVjdG9yKVtwbHVnaW5OU10oKTsgLyogYWRkIHNjcm9sbGJhcnMgYXV0b21hdGljYWxseSBvbiBkZWZhdWx0IHNlbGVjdG9yICovXHJcblxyXG4gICAgICAgIC8qIGV4dGVuZCBqUXVlcnkgZXhwcmVzc2lvbnMgKi9cclxuICAgICAgICAkLmV4dGVuZCgkLmV4cHJbXCI6XCJdLHtcclxuICAgICAgICAgICAgLyogY2hlY2tzIGlmIGVsZW1lbnQgaXMgd2l0aGluIHNjcm9sbGFibGUgdmlld3BvcnQgKi9cclxuICAgICAgICAgICAgbWNzSW5WaWV3OiQuZXhwcltcIjpcIl0ubWNzSW5WaWV3IHx8IGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgICAgICAgIHZhciAkZWw9JChlbCksY29udGVudD0kZWwucGFyZW50cyhcIi5tQ1NCX2NvbnRhaW5lclwiKSx3cmFwcGVyLGNQb3M7XHJcbiAgICAgICAgICAgICAgICBpZighY29udGVudC5sZW5ndGgpe3JldHVybjt9XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyPWNvbnRlbnQucGFyZW50KCk7XHJcbiAgICAgICAgICAgICAgICBjUG9zPVtjb250ZW50WzBdLm9mZnNldFRvcCxjb250ZW50WzBdLm9mZnNldExlZnRdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICBjUG9zWzBdK19jaGlsZFBvcygkZWwpWzBdPj0wICYmIGNQb3NbMF0rX2NoaWxkUG9zKCRlbClbMF08d3JhcHBlci5oZWlnaHQoKS0kZWwub3V0ZXJIZWlnaHQoZmFsc2UpICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNQb3NbMV0rX2NoaWxkUG9zKCRlbClbMV0+PTAgJiYgY1Bvc1sxXStfY2hpbGRQb3MoJGVsKVsxXTx3cmFwcGVyLndpZHRoKCktJGVsLm91dGVyV2lkdGgoZmFsc2UpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvKiBjaGVja3MgaWYgZWxlbWVudCBpcyBvdmVyZmxvd2VkIGhhdmluZyB2aXNpYmxlIHNjcm9sbGJhcihzKSAqL1xyXG4gICAgICAgICAgICBtY3NPdmVyZmxvdzokLmV4cHJbXCI6XCJdLm1jc092ZXJmbG93IHx8IGZ1bmN0aW9uKGVsKXtcclxuICAgICAgICAgICAgICAgIHZhciBkPSQoZWwpLmRhdGEocGx1Z2luUGZ4KTtcclxuICAgICAgICAgICAgICAgIGlmKCFkKXtyZXR1cm47fVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGQub3ZlcmZsb3dlZFswXSB8fCBkLm92ZXJmbG93ZWRbMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn0pKX0pKTsiLCIoZnVuY3Rpb24oJCxzcil7XHJcblxyXG4gIC8vIGRlYm91bmNpbmcgZnVuY3Rpb24gZnJvbSBKb2huIEhhbm5cclxuICAvLyBodHRwOi8vdW5zY3JpcHRhYmxlLmNvbS9pbmRleC5waHAvMjAwOS8wMy8yMC9kZWJvdW5jaW5nLWphdmFzY3JpcHQtbWV0aG9kcy9cclxuICB2YXIgZGVib3VuY2UgPSBmdW5jdGlvbiAoZnVuYywgdGhyZXNob2xkLCBleGVjQXNhcCkge1xyXG4gICAgICB2YXIgdGltZW91dDtcclxuXHJcbiAgICAgIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZWQgKCkge1xyXG4gICAgICAgICAgdmFyIG9iaiA9IHRoaXMsIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICBmdW5jdGlvbiBkZWxheWVkICgpIHtcclxuICAgICAgICAgICAgICBpZiAoIWV4ZWNBc2FwKVxyXG4gICAgICAgICAgICAgICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XHJcbiAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGlmICh0aW1lb3V0KVxyXG4gICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgIGVsc2UgaWYgKGV4ZWNBc2FwKVxyXG4gICAgICAgICAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcclxuXHJcbiAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChkZWxheWVkLCB0aHJlc2hvbGQgfHwgMTAwKTtcclxuICAgICAgfTtcclxuICB9XHJcbiAgLy8gc21hcnRyZXNpemVcclxuICBqUXVlcnkuZm5bc3JdID0gZnVuY3Rpb24oZm4peyAgcmV0dXJuIGZuID8gdGhpcy5iaW5kKCdyZXNpemUnLCBkZWJvdW5jZShmbikpIDogdGhpcy50cmlnZ2VyKHNyKTsgfTtcclxuXHJcbn0pKGpRdWVyeSwnc21hcnRyZXNpemUnKTtcclxuIiwiLyohXHJcbiAqIGNsaXBib2FyZC5qcyB2MS41LjhcclxuICogaHR0cHM6Ly96ZW5vcm9jaGEuZ2l0aHViLmlvL2NsaXBib2FyZC5qc1xyXG4gKlxyXG4gKiBMaWNlbnNlZCBNSVQgwqkgWmVubyBSb2NoYVxyXG4gKi9cclxuKGZ1bmN0aW9uKGYpe2lmKHR5cGVvZiBleHBvcnRzPT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZSE9PVwidW5kZWZpbmVkXCIpe21vZHVsZS5leHBvcnRzPWYoKX1lbHNlIGlmKHR5cGVvZiBkZWZpbmU9PT1cImZ1bmN0aW9uXCImJmRlZmluZS5hbWQpe2RlZmluZShbXSxmKX1lbHNle3ZhciBnO2lmKHR5cGVvZiB3aW5kb3chPT1cInVuZGVmaW5lZFwiKXtnPXdpbmRvd31lbHNlIGlmKHR5cGVvZiBnbG9iYWwhPT1cInVuZGVmaW5lZFwiKXtnPWdsb2JhbH1lbHNlIGlmKHR5cGVvZiBzZWxmIT09XCJ1bmRlZmluZWRcIil7Zz1zZWxmfWVsc2V7Zz10aGlzfWcuQ2xpcGJvYXJkID0gZigpfX0pKGZ1bmN0aW9uKCl7dmFyIGRlZmluZSxtb2R1bGUsZXhwb3J0cztyZXR1cm4gKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG52YXIgbWF0Y2hlcyA9IHJlcXVpcmUoJ21hdGNoZXMtc2VsZWN0b3InKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IsIGNoZWNrWW9TZWxmKSB7XHJcbiAgdmFyIHBhcmVudCA9IGNoZWNrWW9TZWxmID8gZWxlbWVudCA6IGVsZW1lbnQucGFyZW50Tm9kZVxyXG5cclxuICB3aGlsZSAocGFyZW50ICYmIHBhcmVudCAhPT0gZG9jdW1lbnQpIHtcclxuICAgIGlmIChtYXRjaGVzKHBhcmVudCwgc2VsZWN0b3IpKSByZXR1cm4gcGFyZW50O1xyXG4gICAgcGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGVcclxuICB9XHJcbn1cclxuXHJcbn0se1wibWF0Y2hlcy1zZWxlY3RvclwiOjV9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcclxudmFyIGNsb3Nlc3QgPSByZXF1aXJlKCdjbG9zZXN0Jyk7XHJcblxyXG4vKipcclxuICogRGVsZWdhdGVzIGV2ZW50IHRvIGEgc2VsZWN0b3IuXHJcbiAqXHJcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICogQHBhcmFtIHtCb29sZWFufSB1c2VDYXB0dXJlXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICovXHJcbmZ1bmN0aW9uIGRlbGVnYXRlKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSkge1xyXG4gICAgdmFyIGxpc3RlbmVyRm4gPSBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lckZuLCB1c2VDYXB0dXJlKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXJGbiwgdXNlQ2FwdHVyZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogRmluZHMgY2xvc2VzdCBtYXRjaCBhbmQgaW52b2tlcyBjYWxsYmFjay5cclxuICpcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbGVtZW50XHJcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn1cclxuICovXHJcbmZ1bmN0aW9uIGxpc3RlbmVyKGVsZW1lbnQsIHNlbGVjdG9yLCB0eXBlLCBjYWxsYmFjaykge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICBlLmRlbGVnYXRlVGFyZ2V0ID0gY2xvc2VzdChlLnRhcmdldCwgc2VsZWN0b3IsIHRydWUpO1xyXG5cclxuICAgICAgICBpZiAoZS5kZWxlZ2F0ZVRhcmdldCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKGVsZW1lbnQsIGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBkZWxlZ2F0ZTtcclxuXHJcbn0se1wiY2xvc2VzdFwiOjF9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcclxuLyoqXHJcbiAqIENoZWNrIGlmIGFyZ3VtZW50IGlzIGEgSFRNTCBlbGVtZW50LlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmV4cG9ydHMubm9kZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICYmIHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcclxuICAgICAgICAmJiB2YWx1ZS5ub2RlVHlwZSA9PT0gMTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBhcmd1bWVudCBpcyBhIGxpc3Qgb2YgSFRNTCBlbGVtZW50cy5cclxuICpcclxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlXHJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAqL1xyXG5leHBvcnRzLm5vZGVMaXN0ID0gZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIHZhciB0eXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICYmICh0eXBlID09PSAnW29iamVjdCBOb2RlTGlzdF0nIHx8IHR5cGUgPT09ICdbb2JqZWN0IEhUTUxDb2xsZWN0aW9uXScpXHJcbiAgICAgICAgJiYgKCdsZW5ndGgnIGluIHZhbHVlKVxyXG4gICAgICAgICYmICh2YWx1ZS5sZW5ndGggPT09IDAgfHwgZXhwb3J0cy5ub2RlKHZhbHVlWzBdKSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2hlY2sgaWYgYXJndW1lbnQgaXMgYSBzdHJpbmcuXHJcbiAqXHJcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZVxyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gKi9cclxuZXhwb3J0cy5zdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZydcclxuICAgICAgICB8fCB2YWx1ZSBpbnN0YW5jZW9mIFN0cmluZztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBhcmd1bWVudCBpcyBhIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICovXHJcbmV4cG9ydHMuZm4gPSBmdW5jdGlvbih2YWx1ZSkge1xyXG4gICAgdmFyIHR5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xyXG5cclxuICAgIHJldHVybiB0eXBlID09PSAnW29iamVjdCBGdW5jdGlvbl0nO1xyXG59O1xyXG5cclxufSx7fV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XHJcbnZhciBpcyA9IHJlcXVpcmUoJy4vaXMnKTtcclxudmFyIGRlbGVnYXRlID0gcmVxdWlyZSgnZGVsZWdhdGUnKTtcclxuXHJcbi8qKlxyXG4gKiBWYWxpZGF0ZXMgYWxsIHBhcmFtcyBhbmQgY2FsbHMgdGhlIHJpZ2h0XHJcbiAqIGxpc3RlbmVyIGZ1bmN0aW9uIGJhc2VkIG9uIGl0cyB0YXJnZXQgdHlwZS5cclxuICpcclxuICogQHBhcmFtIHtTdHJpbmd8SFRNTEVsZW1lbnR8SFRNTENvbGxlY3Rpb258Tm9kZUxpc3R9IHRhcmdldFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xyXG4gKiBAcmV0dXJuIHtPYmplY3R9XHJcbiAqL1xyXG5mdW5jdGlvbiBsaXN0ZW4odGFyZ2V0LCB0eXBlLCBjYWxsYmFjaykge1xyXG4gICAgaWYgKCF0YXJnZXQgJiYgIXR5cGUgJiYgIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIGFyZ3VtZW50cycpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghaXMuc3RyaW5nKHR5cGUpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYSBTdHJpbmcnKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIWlzLmZuKGNhbGxiYWNrKSkge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoaXJkIGFyZ3VtZW50IG11c3QgYmUgYSBGdW5jdGlvbicpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpcy5ub2RlKHRhcmdldCkpIHtcclxuICAgICAgICByZXR1cm4gbGlzdGVuTm9kZSh0YXJnZXQsIHR5cGUsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzLm5vZGVMaXN0KHRhcmdldCkpIHtcclxuICAgICAgICByZXR1cm4gbGlzdGVuTm9kZUxpc3QodGFyZ2V0LCB0eXBlLCBjYWxsYmFjayk7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpcy5zdHJpbmcodGFyZ2V0KSkge1xyXG4gICAgICAgIHJldHVybiBsaXN0ZW5TZWxlY3Rvcih0YXJnZXQsIHR5cGUsIGNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBTdHJpbmcsIEhUTUxFbGVtZW50LCBIVE1MQ29sbGVjdGlvbiwgb3IgTm9kZUxpc3QnKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZHMgYW4gZXZlbnQgbGlzdGVuZXIgdG8gYSBIVE1MIGVsZW1lbnRcclxuICogYW5kIHJldHVybnMgYSByZW1vdmUgbGlzdGVuZXIgZnVuY3Rpb24uXHJcbiAqXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGVcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gbGlzdGVuTm9kZShub2RlLCB0eXBlLCBjYWxsYmFjaykge1xyXG4gICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBub2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBhIGxpc3Qgb2YgSFRNTCBlbGVtZW50c1xyXG4gKiBhbmQgcmV0dXJucyBhIHJlbW92ZSBsaXN0ZW5lciBmdW5jdGlvbi5cclxuICpcclxuICogQHBhcmFtIHtOb2RlTGlzdHxIVE1MQ29sbGVjdGlvbn0gbm9kZUxpc3RcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gbGlzdGVuTm9kZUxpc3Qobm9kZUxpc3QsIHR5cGUsIGNhbGxiYWNrKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKG5vZGVMaXN0LCBmdW5jdGlvbihub2RlKSB7XHJcbiAgICAgICAgbm9kZS5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGNhbGxiYWNrKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZGVzdHJveTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwobm9kZUxpc3QsIGZ1bmN0aW9uKG5vZGUpIHtcclxuICAgICAgICAgICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCBhbiBldmVudCBsaXN0ZW5lciB0byBhIHNlbGVjdG9yXHJcbiAqIGFuZCByZXR1cm5zIGEgcmVtb3ZlIGxpc3RlbmVyIGZ1bmN0aW9uLlxyXG4gKlxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcclxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcclxuICogQHJldHVybiB7T2JqZWN0fVxyXG4gKi9cclxuZnVuY3Rpb24gbGlzdGVuU2VsZWN0b3Ioc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKSB7XHJcbiAgICByZXR1cm4gZGVsZWdhdGUoZG9jdW1lbnQuYm9keSwgc2VsZWN0b3IsIHR5cGUsIGNhbGxiYWNrKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBsaXN0ZW47XHJcblxyXG59LHtcIi4vaXNcIjozLFwiZGVsZWdhdGVcIjoyfV0sNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XHJcblxyXG4vKipcclxuICogRWxlbWVudCBwcm90b3R5cGUuXHJcbiAqL1xyXG5cclxudmFyIHByb3RvID0gRWxlbWVudC5wcm90b3R5cGU7XHJcblxyXG4vKipcclxuICogVmVuZG9yIGZ1bmN0aW9uLlxyXG4gKi9cclxuXHJcbnZhciB2ZW5kb3IgPSBwcm90by5tYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by53ZWJraXRNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcclxuICB8fCBwcm90by5tc01hdGNoZXNTZWxlY3RvclxyXG4gIHx8IHByb3RvLm9NYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4vKipcclxuICogRXhwb3NlIGBtYXRjaCgpYC5cclxuICovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1hdGNoO1xyXG5cclxuLyoqXHJcbiAqIE1hdGNoIGBlbGAgdG8gYHNlbGVjdG9yYC5cclxuICpcclxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxyXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcclxuICogQHJldHVybiB7Qm9vbGVhbn1cclxuICogQGFwaSBwdWJsaWNcclxuICovXHJcblxyXG5mdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcclxuICBpZiAodmVuZG9yKSByZXR1cm4gdmVuZG9yLmNhbGwoZWwsIHNlbGVjdG9yKTtcclxuICB2YXIgbm9kZXMgPSBlbC5wYXJlbnROb2RlLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcclxuICAgIGlmIChub2Rlc1tpXSA9PSBlbCkgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG59LHt9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcclxuZnVuY3Rpb24gc2VsZWN0KGVsZW1lbnQpIHtcclxuICAgIHZhciBzZWxlY3RlZFRleHQ7XHJcblxyXG4gICAgaWYgKGVsZW1lbnQubm9kZU5hbWUgPT09ICdJTlBVVCcgfHwgZWxlbWVudC5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xyXG4gICAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICBlbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKDAsIGVsZW1lbnQudmFsdWUubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgc2VsZWN0ZWRUZXh0ID0gZWxlbWVudC52YWx1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmIChlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnY29udGVudGVkaXRhYmxlJykpIHtcclxuICAgICAgICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9IHdpbmRvdy5nZXRTZWxlY3Rpb24oKTtcclxuICAgICAgICB2YXIgcmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVSYW5nZSgpO1xyXG5cclxuICAgICAgICByYW5nZS5zZWxlY3ROb2RlQ29udGVudHMoZWxlbWVudCk7XHJcbiAgICAgICAgc2VsZWN0aW9uLnJlbW92ZUFsbFJhbmdlcygpO1xyXG4gICAgICAgIHNlbGVjdGlvbi5hZGRSYW5nZShyYW5nZSk7XHJcblxyXG4gICAgICAgIHNlbGVjdGVkVGV4dCA9IHNlbGVjdGlvbi50b1N0cmluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzZWxlY3RlZFRleHQ7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2VsZWN0O1xyXG5cclxufSx7fV0sNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XHJcbmZ1bmN0aW9uIEUgKCkge1xyXG5cdC8vIEtlZXAgdGhpcyBlbXB0eSBzbyBpdCdzIGVhc2llciB0byBpbmhlcml0IGZyb21cclxuICAvLyAodmlhIGh0dHBzOi8vZ2l0aHViLmNvbS9saXBzbWFjayBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zY290dGNvcmdhbi90aW55LWVtaXR0ZXIvaXNzdWVzLzMpXHJcbn1cclxuXHJcbkUucHJvdG90eXBlID0ge1xyXG5cdG9uOiBmdW5jdGlvbiAobmFtZSwgY2FsbGJhY2ssIGN0eCkge1xyXG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcclxuXHJcbiAgICAoZVtuYW1lXSB8fCAoZVtuYW1lXSA9IFtdKSkucHVzaCh7XHJcbiAgICAgIGZuOiBjYWxsYmFjayxcclxuICAgICAgY3R4OiBjdHhcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcblxyXG4gIG9uY2U6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaywgY3R4KSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICBmdW5jdGlvbiBsaXN0ZW5lciAoKSB7XHJcbiAgICAgIHNlbGYub2ZmKG5hbWUsIGxpc3RlbmVyKTtcclxuICAgICAgY2FsbGJhY2suYXBwbHkoY3R4LCBhcmd1bWVudHMpO1xyXG4gICAgfTtcclxuXHJcbiAgICBsaXN0ZW5lci5fID0gY2FsbGJhY2tcclxuICAgIHJldHVybiB0aGlzLm9uKG5hbWUsIGxpc3RlbmVyLCBjdHgpO1xyXG4gIH0sXHJcblxyXG4gIGVtaXQ6IGZ1bmN0aW9uIChuYW1lKSB7XHJcbiAgICB2YXIgZGF0YSA9IFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuICAgIHZhciBldnRBcnIgPSAoKHRoaXMuZSB8fCAodGhpcy5lID0ge30pKVtuYW1lXSB8fCBbXSkuc2xpY2UoKTtcclxuICAgIHZhciBpID0gMDtcclxuICAgIHZhciBsZW4gPSBldnRBcnIubGVuZ3RoO1xyXG5cclxuICAgIGZvciAoaTsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgIGV2dEFycltpXS5mbi5hcHBseShldnRBcnJbaV0uY3R4LCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG5cclxuICBvZmY6IGZ1bmN0aW9uIChuYW1lLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIGUgPSB0aGlzLmUgfHwgKHRoaXMuZSA9IHt9KTtcclxuICAgIHZhciBldnRzID0gZVtuYW1lXTtcclxuICAgIHZhciBsaXZlRXZlbnRzID0gW107XHJcblxyXG4gICAgaWYgKGV2dHMgJiYgY2FsbGJhY2spIHtcclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGV2dHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoZXZ0c1tpXS5mbiAhPT0gY2FsbGJhY2sgJiYgZXZ0c1tpXS5mbi5fICE9PSBjYWxsYmFjaylcclxuICAgICAgICAgIGxpdmVFdmVudHMucHVzaChldnRzW2ldKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlbW92ZSBldmVudCBmcm9tIHF1ZXVlIHRvIHByZXZlbnQgbWVtb3J5IGxlYWtcclxuICAgIC8vIFN1Z2dlc3RlZCBieSBodHRwczovL2dpdGh1Yi5jb20vbGF6ZFxyXG4gICAgLy8gUmVmOiBodHRwczovL2dpdGh1Yi5jb20vc2NvdHRjb3JnYW4vdGlueS1lbWl0dGVyL2NvbW1pdC9jNmViZmFhOWJjOTczYjMzZDExMGE4NGEzMDc3NDJiN2NmOTRjOTUzI2NvbW1pdGNvbW1lbnQtNTAyNDkxMFxyXG5cclxuICAgIChsaXZlRXZlbnRzLmxlbmd0aClcclxuICAgICAgPyBlW25hbWVdID0gbGl2ZUV2ZW50c1xyXG4gICAgICA6IGRlbGV0ZSBlW25hbWVdO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRTtcclxuXHJcbn0se31dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5cclxudmFyIF9jcmVhdGVDbGFzcyA9IChmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoJ3ZhbHVlJyBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSkoKTtcclxuXHJcbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7ICdkZWZhdWx0Jzogb2JqIH07IH1cclxuXHJcbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uJyk7IH0gfVxyXG5cclxudmFyIF9zZWxlY3QgPSByZXF1aXJlKCdzZWxlY3QnKTtcclxuXHJcbnZhciBfc2VsZWN0MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NlbGVjdCk7XHJcblxyXG4vKipcclxuICogSW5uZXIgY2xhc3Mgd2hpY2ggcGVyZm9ybXMgc2VsZWN0aW9uIGZyb20gZWl0aGVyIGB0ZXh0YCBvciBgdGFyZ2V0YFxyXG4gKiBwcm9wZXJ0aWVzIGFuZCB0aGVuIGV4ZWN1dGVzIGNvcHkgb3IgY3V0IG9wZXJhdGlvbnMuXHJcbiAqL1xyXG5cclxudmFyIENsaXBib2FyZEFjdGlvbiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKi9cclxuXHJcbiAgICBmdW5jdGlvbiBDbGlwYm9hcmRBY3Rpb24ob3B0aW9ucykge1xyXG4gICAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDbGlwYm9hcmRBY3Rpb24pO1xyXG5cclxuICAgICAgICB0aGlzLnJlc29sdmVPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNlbGVjdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVmaW5lcyBiYXNlIHByb3BlcnRpZXMgcGFzc2VkIGZyb20gY29uc3RydWN0b3IuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICAgICovXHJcblxyXG4gICAgQ2xpcGJvYXJkQWN0aW9uLnByb3RvdHlwZS5yZXNvbHZlT3B0aW9ucyA9IGZ1bmN0aW9uIHJlc29sdmVPcHRpb25zKCkge1xyXG4gICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMF07XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aW9uID0gb3B0aW9ucy5hY3Rpb247XHJcbiAgICAgICAgdGhpcy5lbWl0dGVyID0gb3B0aW9ucy5lbWl0dGVyO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0ID0gb3B0aW9ucy50YXJnZXQ7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gb3B0aW9ucy50ZXh0O1xyXG4gICAgICAgIHRoaXMudHJpZ2dlciA9IG9wdGlvbnMudHJpZ2dlcjtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSAnJztcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWNpZGVzIHdoaWNoIHNlbGVjdGlvbiBzdHJhdGVneSBpcyBnb2luZyB0byBiZSBhcHBsaWVkIGJhc2VkXHJcbiAgICAgKiBvbiB0aGUgZXhpc3RlbmNlIG9mIGB0ZXh0YCBhbmQgYHRhcmdldGAgcHJvcGVydGllcy5cclxuICAgICAqL1xyXG5cclxuICAgIENsaXBib2FyZEFjdGlvbi5wcm90b3R5cGUuaW5pdFNlbGVjdGlvbiA9IGZ1bmN0aW9uIGluaXRTZWxlY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudGV4dCAmJiB0aGlzLnRhcmdldCkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ011bHRpcGxlIGF0dHJpYnV0ZXMgZGVjbGFyZWQsIHVzZSBlaXRoZXIgXCJ0YXJnZXRcIiBvciBcInRleHRcIicpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy50ZXh0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0RmFrZSgpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy50YXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RUYXJnZXQoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgcmVxdWlyZWQgYXR0cmlidXRlcywgdXNlIGVpdGhlciBcInRhcmdldFwiIG9yIFwidGV4dFwiJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSBmYWtlIHRleHRhcmVhIGVsZW1lbnQsIHNldHMgaXRzIHZhbHVlIGZyb20gYHRleHRgIHByb3BlcnR5LFxyXG4gICAgICogYW5kIG1ha2VzIGEgc2VsZWN0aW9uIG9uIGl0LlxyXG4gICAgICovXHJcblxyXG4gICAgQ2xpcGJvYXJkQWN0aW9uLnByb3RvdHlwZS5zZWxlY3RGYWtlID0gZnVuY3Rpb24gc2VsZWN0RmFrZSgpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgaXNSVEwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkaXInKSA9PSAncnRsJztcclxuXHJcbiAgICAgICAgdGhpcy5yZW1vdmVGYWtlKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZmFrZUhhbmRsZXIgPSBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXMucmVtb3ZlRmFrZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmZha2VFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcclxuICAgICAgICAvLyBQcmV2ZW50IHpvb21pbmcgb24gaU9TXHJcbiAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5mb250U2l6ZSA9ICcxMnB0JztcclxuICAgICAgICAvLyBSZXNldCBib3ggbW9kZWxcclxuICAgICAgICB0aGlzLmZha2VFbGVtLnN0eWxlLmJvcmRlciA9ICcwJztcclxuICAgICAgICB0aGlzLmZha2VFbGVtLnN0eWxlLnBhZGRpbmcgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5tYXJnaW4gPSAnMCc7XHJcbiAgICAgICAgLy8gTW92ZSBlbGVtZW50IG91dCBvZiBzY3JlZW4gaG9yaXpvbnRhbGx5XHJcbiAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZVtpc1JUTCA/ICdyaWdodCcgOiAnbGVmdCddID0gJy05OTk5cHgnO1xyXG4gICAgICAgIC8vIE1vdmUgZWxlbWVudCB0byB0aGUgc2FtZSBwb3NpdGlvbiB2ZXJ0aWNhbGx5XHJcbiAgICAgICAgdGhpcy5mYWtlRWxlbS5zdHlsZS50b3AgPSAod2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3ApICsgJ3B4JztcclxuICAgICAgICB0aGlzLmZha2VFbGVtLnNldEF0dHJpYnV0ZSgncmVhZG9ubHknLCAnJyk7XHJcbiAgICAgICAgdGhpcy5mYWtlRWxlbS52YWx1ZSA9IHRoaXMudGV4dDtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmZha2VFbGVtKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSBfc2VsZWN0MlsnZGVmYXVsdCddKHRoaXMuZmFrZUVsZW0pO1xyXG4gICAgICAgIHRoaXMuY29weVRleHQoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPbmx5IHJlbW92ZXMgdGhlIGZha2UgZWxlbWVudCBhZnRlciBhbm90aGVyIGNsaWNrIGV2ZW50LCB0aGF0IHdheVxyXG4gICAgICogYSB1c2VyIGNhbiBoaXQgYEN0cmwrQ2AgdG8gY29weSBiZWNhdXNlIHNlbGVjdGlvbiBzdGlsbCBleGlzdHMuXHJcbiAgICAgKi9cclxuXHJcbiAgICBDbGlwYm9hcmRBY3Rpb24ucHJvdG90eXBlLnJlbW92ZUZha2UgPSBmdW5jdGlvbiByZW1vdmVGYWtlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmZha2VIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snKTtcclxuICAgICAgICAgICAgdGhpcy5mYWtlSGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5mYWtlRWxlbSkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuZmFrZUVsZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmZha2VFbGVtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VsZWN0cyB0aGUgY29udGVudCBmcm9tIGVsZW1lbnQgcGFzc2VkIG9uIGB0YXJnZXRgIHByb3BlcnR5LlxyXG4gICAgICovXHJcblxyXG4gICAgQ2xpcGJvYXJkQWN0aW9uLnByb3RvdHlwZS5zZWxlY3RUYXJnZXQgPSBmdW5jdGlvbiBzZWxlY3RUYXJnZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFRleHQgPSBfc2VsZWN0MlsnZGVmYXVsdCddKHRoaXMudGFyZ2V0KTtcclxuICAgICAgICB0aGlzLmNvcHlUZXh0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhlY3V0ZXMgdGhlIGNvcHkgb3BlcmF0aW9uIGJhc2VkIG9uIHRoZSBjdXJyZW50IHNlbGVjdGlvbi5cclxuICAgICAqL1xyXG5cclxuICAgIENsaXBib2FyZEFjdGlvbi5wcm90b3R5cGUuY29weVRleHQgPSBmdW5jdGlvbiBjb3B5VGV4dCgpIHtcclxuICAgICAgICB2YXIgc3VjY2VlZGVkID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBzdWNjZWVkZWQgPSBkb2N1bWVudC5leGVjQ29tbWFuZCh0aGlzLmFjdGlvbik7XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIHN1Y2NlZWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5oYW5kbGVSZXN1bHQoc3VjY2VlZGVkKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaXJlcyBhbiBldmVudCBiYXNlZCBvbiB0aGUgY29weSBvcGVyYXRpb24gcmVzdWx0LlxyXG4gICAgICogQHBhcmFtIHtCb29sZWFufSBzdWNjZWVkZWRcclxuICAgICAqL1xyXG5cclxuICAgIENsaXBib2FyZEFjdGlvbi5wcm90b3R5cGUuaGFuZGxlUmVzdWx0ID0gZnVuY3Rpb24gaGFuZGxlUmVzdWx0KHN1Y2NlZWRlZCkge1xyXG4gICAgICAgIGlmIChzdWNjZWVkZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0dGVyLmVtaXQoJ3N1Y2Nlc3MnLCB7XHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IHRoaXMuYWN0aW9uLFxyXG4gICAgICAgICAgICAgICAgdGV4dDogdGhpcy5zZWxlY3RlZFRleHQsXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0aGlzLnRyaWdnZXIsXHJcbiAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbjogdGhpcy5jbGVhclNlbGVjdGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdlcnJvcicsIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogdGhpcy5hY3Rpb24sXHJcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiB0aGlzLnRyaWdnZXIsXHJcbiAgICAgICAgICAgICAgICBjbGVhclNlbGVjdGlvbjogdGhpcy5jbGVhclNlbGVjdGlvbi5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVzIGN1cnJlbnQgc2VsZWN0aW9uIGFuZCBmb2N1cyBmcm9tIGB0YXJnZXRgIGVsZW1lbnQuXHJcbiAgICAgKi9cclxuXHJcbiAgICBDbGlwYm9hcmRBY3Rpb24ucHJvdG90eXBlLmNsZWFyU2VsZWN0aW9uID0gZnVuY3Rpb24gY2xlYXJTZWxlY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LmJsdXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdpbmRvdy5nZXRTZWxlY3Rpb24oKS5yZW1vdmVBbGxSYW5nZXMoKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXRzIHRoZSBgYWN0aW9uYCB0byBiZSBwZXJmb3JtZWQgd2hpY2ggY2FuIGJlIGVpdGhlciAnY29weScgb3IgJ2N1dCcuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIERlc3Ryb3kgbGlmZWN5Y2xlLlxyXG4gICAgICovXHJcblxyXG4gICAgQ2xpcGJvYXJkQWN0aW9uLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLnJlbW92ZUZha2UoKTtcclxuICAgIH07XHJcblxyXG4gICAgX2NyZWF0ZUNsYXNzKENsaXBib2FyZEFjdGlvbiwgW3tcclxuICAgICAgICBrZXk6ICdhY3Rpb24nLFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gc2V0KCkge1xyXG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gYXJndW1lbnRzLmxlbmd0aCA8PSAwIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gJ2NvcHknIDogYXJndW1lbnRzWzBdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fYWN0aW9uID0gYWN0aW9uO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGlvbiAhPT0gJ2NvcHknICYmIHRoaXMuX2FjdGlvbiAhPT0gJ2N1dCcpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBcImFjdGlvblwiIHZhbHVlLCB1c2UgZWl0aGVyIFwiY29weVwiIG9yIFwiY3V0XCInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldHMgdGhlIGBhY3Rpb25gIHByb3BlcnR5LlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGlvbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNldHMgdGhlIGB0YXJnZXRgIHByb3BlcnR5IHVzaW5nIGFuIGVsZW1lbnRcclxuICAgICAgICAgKiB0aGF0IHdpbGwgYmUgaGF2ZSBpdHMgY29udGVudCBjb3BpZWQuXHJcbiAgICAgICAgICogQHBhcmFtIHtFbGVtZW50fSB0YXJnZXRcclxuICAgICAgICAgKi9cclxuICAgIH0sIHtcclxuICAgICAgICBrZXk6ICd0YXJnZXQnLFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24gc2V0KHRhcmdldCkge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldCA9PT0gJ29iamVjdCcgJiYgdGFyZ2V0Lm5vZGVUeXBlID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXCJ0YXJnZXRcIiB2YWx1ZSwgdXNlIGEgdmFsaWQgRWxlbWVudCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0cyB0aGUgYHRhcmdldGAgcHJvcGVydHkuXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfEhUTUxFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0O1xyXG4gICAgICAgIH1cclxuICAgIH1dKTtcclxuXHJcbiAgICByZXR1cm4gQ2xpcGJvYXJkQWN0aW9uO1xyXG59KSgpO1xyXG5cclxuZXhwb3J0c1snZGVmYXVsdCddID0gQ2xpcGJvYXJkQWN0aW9uO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcclxuXHJcbn0se1wic2VsZWN0XCI6Nn1dLDk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xyXG5cclxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgJ2RlZmF1bHQnOiBvYmogfTsgfVxyXG5cclxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb24nKTsgfSB9XHJcblxyXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSAnZnVuY3Rpb24nICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcignU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCAnICsgdHlwZW9mIHN1cGVyQ2xhc3MpOyB9IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwgeyBjb25zdHJ1Y3RvcjogeyB2YWx1ZTogc3ViQ2xhc3MsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlIH0gfSk7IGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzczsgfVxyXG5cclxudmFyIF9jbGlwYm9hcmRBY3Rpb24gPSByZXF1aXJlKCcuL2NsaXBib2FyZC1hY3Rpb24nKTtcclxuXHJcbnZhciBfY2xpcGJvYXJkQWN0aW9uMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NsaXBib2FyZEFjdGlvbik7XHJcblxyXG52YXIgX3RpbnlFbWl0dGVyID0gcmVxdWlyZSgndGlueS1lbWl0dGVyJyk7XHJcblxyXG52YXIgX3RpbnlFbWl0dGVyMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3RpbnlFbWl0dGVyKTtcclxuXHJcbnZhciBfZ29vZExpc3RlbmVyID0gcmVxdWlyZSgnZ29vZC1saXN0ZW5lcicpO1xyXG5cclxudmFyIF9nb29kTGlzdGVuZXIyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ29vZExpc3RlbmVyKTtcclxuXHJcbi8qKlxyXG4gKiBCYXNlIGNsYXNzIHdoaWNoIHRha2VzIG9uZSBvciBtb3JlIGVsZW1lbnRzLCBhZGRzIGV2ZW50IGxpc3RlbmVycyB0byB0aGVtLFxyXG4gKiBhbmQgaW5zdGFudGlhdGVzIGEgbmV3IGBDbGlwYm9hcmRBY3Rpb25gIG9uIGVhY2ggY2xpY2suXHJcbiAqL1xyXG5cclxudmFyIENsaXBib2FyZCA9IChmdW5jdGlvbiAoX0VtaXR0ZXIpIHtcclxuICAgIF9pbmhlcml0cyhDbGlwYm9hcmQsIF9FbWl0dGVyKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfEhUTUxFbGVtZW50fEhUTUxDb2xsZWN0aW9ufE5vZGVMaXN0fSB0cmlnZ2VyXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xyXG4gICAgICovXHJcblxyXG4gICAgZnVuY3Rpb24gQ2xpcGJvYXJkKHRyaWdnZXIsIG9wdGlvbnMpIHtcclxuICAgICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2xpcGJvYXJkKTtcclxuXHJcbiAgICAgICAgX0VtaXR0ZXIuY2FsbCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXNvbHZlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgICAgICB0aGlzLmxpc3RlbkNsaWNrKHRyaWdnZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIHJldHJpZXZlIGF0dHJpYnV0ZSB2YWx1ZS5cclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdWZmaXhcclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gZWxlbWVudFxyXG4gICAgICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmVzIGlmIGF0dHJpYnV0ZXMgd291bGQgYmUgcmVzb2x2ZWQgdXNpbmcgaW50ZXJuYWwgc2V0dGVyIGZ1bmN0aW9uc1xyXG4gICAgICogb3IgY3VzdG9tIGZ1bmN0aW9ucyB0aGF0IHdlcmUgcGFzc2VkIGluIHRoZSBjb25zdHJ1Y3Rvci5cclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXHJcbiAgICAgKi9cclxuXHJcbiAgICBDbGlwYm9hcmQucHJvdG90eXBlLnJlc29sdmVPcHRpb25zID0gZnVuY3Rpb24gcmVzb2x2ZU9wdGlvbnMoKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1swXTtcclxuXHJcbiAgICAgICAgdGhpcy5hY3Rpb24gPSB0eXBlb2Ygb3B0aW9ucy5hY3Rpb24gPT09ICdmdW5jdGlvbicgPyBvcHRpb25zLmFjdGlvbiA6IHRoaXMuZGVmYXVsdEFjdGlvbjtcclxuICAgICAgICB0aGlzLnRhcmdldCA9IHR5cGVvZiBvcHRpb25zLnRhcmdldCA9PT0gJ2Z1bmN0aW9uJyA/IG9wdGlvbnMudGFyZ2V0IDogdGhpcy5kZWZhdWx0VGFyZ2V0O1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHR5cGVvZiBvcHRpb25zLnRleHQgPT09ICdmdW5jdGlvbicgPyBvcHRpb25zLnRleHQgOiB0aGlzLmRlZmF1bHRUZXh0O1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZHMgYSBjbGljayBldmVudCBsaXN0ZW5lciB0byB0aGUgcGFzc2VkIHRyaWdnZXIuXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xIVE1MRWxlbWVudHxIVE1MQ29sbGVjdGlvbnxOb2RlTGlzdH0gdHJpZ2dlclxyXG4gICAgICovXHJcblxyXG4gICAgQ2xpcGJvYXJkLnByb3RvdHlwZS5saXN0ZW5DbGljayA9IGZ1bmN0aW9uIGxpc3RlbkNsaWNrKHRyaWdnZXIpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLmxpc3RlbmVyID0gX2dvb2RMaXN0ZW5lcjJbJ2RlZmF1bHQnXSh0cmlnZ2VyLCAnY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3RoaXMub25DbGljayhlKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZWZpbmVzIGEgbmV3IGBDbGlwYm9hcmRBY3Rpb25gIG9uIGVhY2ggY2xpY2sgZXZlbnQuXHJcbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlXHJcbiAgICAgKi9cclxuXHJcbiAgICBDbGlwYm9hcmQucHJvdG90eXBlLm9uQ2xpY2sgPSBmdW5jdGlvbiBvbkNsaWNrKGUpIHtcclxuICAgICAgICB2YXIgdHJpZ2dlciA9IGUuZGVsZWdhdGVUYXJnZXQgfHwgZS5jdXJyZW50VGFyZ2V0O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jbGlwYm9hcmRBY3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5jbGlwYm9hcmRBY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5jbGlwYm9hcmRBY3Rpb24gPSBuZXcgX2NsaXBib2FyZEFjdGlvbjJbJ2RlZmF1bHQnXSh7XHJcbiAgICAgICAgICAgIGFjdGlvbjogdGhpcy5hY3Rpb24odHJpZ2dlciksXHJcbiAgICAgICAgICAgIHRhcmdldDogdGhpcy50YXJnZXQodHJpZ2dlciksXHJcbiAgICAgICAgICAgIHRleHQ6IHRoaXMudGV4dCh0cmlnZ2VyKSxcclxuICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlcixcclxuICAgICAgICAgICAgZW1pdHRlcjogdGhpc1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgYGFjdGlvbmAgbG9va3VwIGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSB0cmlnZ2VyXHJcbiAgICAgKi9cclxuXHJcbiAgICBDbGlwYm9hcmQucHJvdG90eXBlLmRlZmF1bHRBY3Rpb24gPSBmdW5jdGlvbiBkZWZhdWx0QWN0aW9uKHRyaWdnZXIpIHtcclxuICAgICAgICByZXR1cm4gZ2V0QXR0cmlidXRlVmFsdWUoJ2FjdGlvbicsIHRyaWdnZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgYHRhcmdldGAgbG9va3VwIGZ1bmN0aW9uLlxyXG4gICAgICogQHBhcmFtIHtFbGVtZW50fSB0cmlnZ2VyXHJcbiAgICAgKi9cclxuXHJcbiAgICBDbGlwYm9hcmQucHJvdG90eXBlLmRlZmF1bHRUYXJnZXQgPSBmdW5jdGlvbiBkZWZhdWx0VGFyZ2V0KHRyaWdnZXIpIHtcclxuICAgICAgICB2YXIgc2VsZWN0b3IgPSBnZXRBdHRyaWJ1dGVWYWx1ZSgndGFyZ2V0JywgdHJpZ2dlcik7XHJcblxyXG4gICAgICAgIGlmIChzZWxlY3Rvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmF1bHQgYHRleHRgIGxvb2t1cCBmdW5jdGlvbi5cclxuICAgICAqIEBwYXJhbSB7RWxlbWVudH0gdHJpZ2dlclxyXG4gICAgICovXHJcblxyXG4gICAgQ2xpcGJvYXJkLnByb3RvdHlwZS5kZWZhdWx0VGV4dCA9IGZ1bmN0aW9uIGRlZmF1bHRUZXh0KHRyaWdnZXIpIHtcclxuICAgICAgICByZXR1cm4gZ2V0QXR0cmlidXRlVmFsdWUoJ3RleHQnLCB0cmlnZ2VyKTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEZXN0cm95IGxpZmVjeWNsZS5cclxuICAgICAqL1xyXG5cclxuICAgIENsaXBib2FyZC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lci5kZXN0cm95KCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNsaXBib2FyZEFjdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmNsaXBib2FyZEFjdGlvbi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpcGJvYXJkQWN0aW9uID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBDbGlwYm9hcmQ7XHJcbn0pKF90aW55RW1pdHRlcjJbJ2RlZmF1bHQnXSk7XHJcblxyXG5leHBvcnRzWydkZWZhdWx0J10gPSBDbGlwYm9hcmQ7XHJcbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZVZhbHVlKHN1ZmZpeCwgZWxlbWVudCkge1xyXG4gICAgdmFyIGF0dHJpYnV0ZSA9ICdkYXRhLWNsaXBib2FyZC0nICsgc3VmZml4O1xyXG5cclxuICAgIGlmICghZWxlbWVudC5oYXNBdHRyaWJ1dGUoYXR0cmlidXRlKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGUoYXR0cmlidXRlKTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHNbJ2RlZmF1bHQnXTtcclxuXHJcbn0se1wiLi9jbGlwYm9hcmQtYWN0aW9uXCI6OCxcImdvb2QtbGlzdGVuZXJcIjo0LFwidGlueS1lbWl0dGVyXCI6N31dfSx7fSxbOV0pKDkpXHJcbn0pOyIsInZhciBtYWluTmF2ID0gKGZ1bmN0aW9uICgkKSB7XHJcblxyXG4gICAgdmFyICRuYXYgPSAkKCcubWFpbi1uYXYnKTtcclxuXHJcbiAgICB2YXIgbW9iaWxlTWF4V2lkdGggPSA3Mzk7XHJcblxyXG5cclxuICAgIC8vIE9QRU4gT04gUEFHRSBMT0FEXHJcbiAgICB2YXIgcGFnZSA9ICQoJ2JvZHknKS5kYXRhKCdwYWdlJyk7XHJcbiAgICB2YXIgJHNlbGVjdGVkTmF2ID0gJG5hdi5maW5kKCdsaVtkYXRhLW5hdj1cIicrIHBhZ2UgKydcIl0nKTtcclxuXHJcbiAgICBpZigkc2VsZWN0ZWROYXYuY2xvc2VzdCgnLm1haW4tbmF2X19kcm9wZG93bicpLmxlbmd0aCl7XHJcbiAgICAgICAgdmFyICRkcm9wZG93biA9ICRzZWxlY3RlZE5hdi5jbG9zZXN0KCcubWFpbi1uYXZfX2Ryb3Bkb3duJylcclxuICAgICAgICAkZHJvcGRvd24uY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJykuY2xvc2VzdCgnLm1haW4tbmF2X19wcmltYXJ5JykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG4gICAgfVxyXG5cclxuICAgICQoJy5tYWluLW5hdl9fcHJpbWFyeScpLm9uKCdjbGljaycsICc+IGEnLCBmdW5jdGlvbihlKXtcclxuICAgICAgICBpZiAoJCh0aGlzKS5uZXh0KCcubWFpbi1uYXZfX2Ryb3Bkb3duJykubGVuZ3RoKXtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0b2dnbGVOYXYoJCh0aGlzKS5uZXh0KCcubWFpbi1uYXZfX2Ryb3Bkb3duJykpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiB0b2dnbGVOYXYoJGRyb3Bkb3duKXtcclxuICAgICAgICAkZHJvcGRvd24uY2xvc2VzdCgnLm1haW4tbmF2X19wcmltYXJ5JykudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cclxuICAgICAgICBpZiAoJGRyb3Bkb3duLmlzKCc6aGlkZGVuJykpe1xyXG4gICAgICAgICAgICAkZHJvcGRvd24udmVsb2NpdHkoJ3NsaWRlRG93bicsIHsgZHVyYXRpb246IDI1MCB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRkcm9wZG93bi52ZWxvY2l0eSgnc2xpZGVVcCcsIHsgZHVyYXRpb246IDI1MCB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIENVU1RPTSBTQ1JPTExCQVJcclxuXHJcbiAgICAvLyBQbHVnaW4gYWN0cyBmdW5ueSB3aXRoIGZsZXhib3ggY29udHJvbGxlZCBoZWlnaHQuXHJcbiAgICAvLyBOZWVkIHRvIHNldCBtYXgtaGVpZ2h0IGFuZCB0cmlnZ2VyIHVwZGF0ZSBmb3IgaXQgdG8gYmVoYXZlXHJcblxyXG4gICAgZnVuY3Rpb24gc2V0TmF2TWF4SGVpZ2h0KCl7XHJcbiAgICAgICAgdmFyIHZpZXdwb3J0SGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgIHZhciBzaWRlQ29sUm93SGVpZ2h0ID0gJCgnLnNpZGUtY29sX19yb3cnKS5oZWlnaHQoKTtcclxuICAgICAgICB2YXIgbmF2SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQgLSBzaWRlQ29sUm93SGVpZ2h0O1xyXG4gICAgICAgICRuYXYuY3NzKCdtYXgtaGVpZ2h0JywgbmF2SGVpZ2h0KS5tQ3VzdG9tU2Nyb2xsYmFyKCd1cGRhdGUnKTtcclxuICAgIH1cclxuICAgIHNldE5hdk1heEhlaWdodCgpO1xyXG5cclxuICAgICQod2luZG93KS5zbWFydHJlc2l6ZShmdW5jdGlvbigpe1xyXG4gICAgICAgIHNldE5hdk1heEhlaWdodCgpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICRuYXYubUN1c3RvbVNjcm9sbGJhcih7XHJcbiAgICAgICAgdGhlbWU6IFwibWluaW1hbFwiLFxyXG4gICAgICAgIHNjcm9sbGJhclBvc2l0aW9uOiBcIm91dHNpZGVcIixcclxuICAgICAgICBzY3JvbGxJbnRlcnRpYTogMTAwMCxcclxuICAgICAgICBtb3VzZVdoZWVsOnsgcHJldmVudERlZmF1bHQ6IHRydWUgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcblxyXG4gICAgLy8gPT09IE1PQklMRVxyXG4gICAgJCgnLm5hdi10b2dnbGUnKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIHZhciAkbmF2ID0gJCgnLm1haW4tbmF2X193cmFwJyk7XHJcbiAgICAgICAgaWYgKCRuYXYuaXMoJzp2aXNpYmxlJykpe1xyXG4gICAgICAgICAgICAkbmF2LnZlbG9jaXR5KCdzbGlkZVVwJywge1xyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246IDMwMCxcclxuICAgICAgICAgICAgICAgIGVhc2luZzogWyAwLjIxNSwgMC42MSwgMC4zNTUsIDEgXVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICRuYXYudmVsb2NpdHkoJ3NsaWRlRG93bicsIHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAzMDAsXHJcbiAgICAgICAgICAgICAgICBlYXNpbmc6IFsgMC4yMTUsIDAuNjEsIDAuMzU1LCAxIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkKCcuaGFtYnVyZ2VyJykudG9nZ2xlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG5cclxufSkoalF1ZXJ5KTtcclxuIiwiXHJcbnZhciBwYXR0ZXJuID0gKGZ1bmN0aW9uICgkKSB7XHJcblxyXG5cclxuICAgIHZhciBwYXR0ZXJuQ2xpcGJvYXJkID0gbmV3IENsaXBib2FyZCgnW2RhdGEtbWFya3VwLWNvcHldJywge1xyXG4gICAgICAgIHRleHQ6IGZ1bmN0aW9uKHRyaWdnZXIpIHtcclxuICAgICAgICAgICAgdmFyICRjb2RlID0gJCh0cmlnZ2VyKS5zaWJsaW5ncygnW2RhdGEtbWFya3VwXScpLmZpbmQoJ2NvZGUnKTtcclxuICAgICAgICAgICAgcmV0dXJuICRjb2RlLnRleHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBwYXR0ZXJuQ2xpcGJvYXJkLm9uKCdzdWNjZXNzJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICQoZS50cmlnZ2VyKS5hZGRDbGFzcygnaXMtc3VjY2VzcycpLmZpbmQoJ3VzZScpLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2NvcHktc3VjY2VzcycpO1xyXG5cclxuICAgICAgICByZXNldEljb24oZS50cmlnZ2VyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHBhdHRlcm5DbGlwYm9hcmQub24oJ2Vycm9yJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0FjdGlvbjonLCBlLmFjdGlvbik7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignVHJpZ2dlcjonLCBlLnRyaWdnZXIpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gcmVzZXRJY29uKHRyaWdnZXIpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJCh0cmlnZ2VyKS5yZW1vdmVDbGFzcygnaXMtc3VjY2VzcycpLmZpbmQoJ3VzZScpLmF0dHIoJ3hsaW5rOmhyZWYnLCAnI2NvcHknKTtcclxuICAgICAgICB9LCAzMDAwKTtcclxuICAgIH1cclxuXHJcblxyXG59KShqUXVlcnkpO1xyXG4iLCJcclxudmFyIHRhYnMgPSAoZnVuY3Rpb24gKCQpIHtcclxuXHJcbiAgICB2YXIgYWN0aXZlQ2xhc3MgPSAnaXMtYWN0aXZlJztcclxuXHJcbiAgICAvLyBTRVQgSU5JVElBTCBTVEFURVxyXG4gICAgJCgnW2RhdGEtdGFic10nKS5lYWNoKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcclxuICAgICAgICB2YXIgYWN0aXZlVGFiSW5kZXggPSAkdGhpcy5kYXRhKCd0YWJzLWFjdGl2ZScpIHx8IDA7XHJcbiAgICAgICAgdG9nZ2xlUGFuZXMoJHRoaXMsIGFjdGl2ZVRhYkluZGV4KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICAvLyBUQUIgQ0xJQ0tcclxuICAgICQoJ1tkYXRhLXRhYnNdJykub24oJ2NsaWNrJywgJ1tkYXRhLXRhYl06bm90KC5pcy1hY3RpdmUpJywgZnVuY3Rpb24oKXtcclxuICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XHJcbiAgICAgICB2YXIgJHRhYnMgPSAkdGhpcy5jbG9zZXN0KCdbZGF0YS10YWJzXScpO1xyXG4gICAgICAgdmFyIHRhYkluZGV4ID0gJHRoaXMuaW5kZXgoKTtcclxuICAgICAgIHRvZ2dsZVBhbmVzKCR0YWJzLCB0YWJJbmRleCk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gdG9nZ2xlUGFuZXMoJHRhYnMsIHBhbmVJbmRleCl7XHJcbiAgICAgICAgdmFyICRuYXYgPSAkdGFicy5maW5kKCdbZGF0YS10YWItbmF2XScpO1xyXG4gICAgICAgIHZhciAkcGFuZXMgPSAkdGFicy5maW5kKCdbZGF0YS10YWItcGFuZXNdJyk7XHJcblxyXG4gICAgICAgIC8vIEFjdGl2ZSBjbGFzc2VzXHJcbiAgICAgICAgJG5hdlxyXG4gICAgICAgICAgICAuZmluZCgnW2RhdGEtdGFiXTplcSgnKyBwYW5lSW5kZXggKycpJykuYWRkQ2xhc3MoYWN0aXZlQ2xhc3MpXHJcbiAgICAgICAgICAgIC5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKGFjdGl2ZUNsYXNzKTtcclxuXHJcbiAgICAgICAgLy8gVG9nZ2xlIFBhbmVzXHJcbiAgICAgICAgJHBhbmVzXHJcbiAgICAgICAgICAgIC5maW5kKCdbZGF0YS10YWItcGFuZV06ZXEoJysgcGFuZUluZGV4ICsnKScpLnNob3coKVxyXG4gICAgICAgICAgICAuc2libGluZ3MoKS5oaWRlKCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcbn0pKGpRdWVyeSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
