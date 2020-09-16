export function GTMPush(eventLabel) {
    var dataLayer = window.dataLayer || null;
    if (dataLayer) {
        dataLayer.push({ 'event': 'Interactive Click', 'eventData': eventLabel });
    }
}
export function publishWindowResize(S, delay = 350) { // need to pass in the StateModule
    window.addEventListener("resize", resizeThrottler, false);

    var resizeTimeout;

    function resizeThrottler() { // adapted from https://developer.mozilla.org/en-US/docs/Web/Events/resize#setTimeout
        // ignore resize events as long as an actualResizeHandler execution is in the queue
        if (!resizeTimeout) {
            resizeTimeout = setTimeout(function() {
                actualResizeHandler();
                resizeTimeout = null;
            }, delay);
        }
    }

    function actualResizeHandler() {

        S.setState('resize', [document.documentElement.clientWidth, document.documentElement.clientHeight]);
    }
}
export const FadeInText = (function() {
    HTMLElement.prototype.fadeOutContent = function() {
        this.classList.add('no-opacity');
    };
    HTMLElement.prototype.fadeInContent = function(content, s) {
        var durationS = s || 0;
        if (s) {
            this.style.transition = 'opacity ' + s + 's ease-in-out';
        }
        return new Promise((resolve) => {
            var durationStr = window.getComputedStyle(this).getPropertyValue('transition-duration') || durationS,
                duration = parseFloat(durationStr) * 1000;
            this.fadeOutContent();
            setTimeout(() => {
                this.innerHTML = content;
                this.classList.remove('no-opacity');
                resolve(true);
            }, duration);
        });
    };
})();
export const StringHelpers = (function() {
    String.prototype.cleanString = function() { // lowercase and remove punctuation and replace spaces with hyphens; delete punctuation
        return this.replace(/[ /]/g, '-').replace(/['"”’“‘,.!?;()&:]/g, '').toLowerCase();
    };

    String.prototype.removeUnderscores = function() {
        return this.replace(/_/g, ' ');
    };

    String.prototype.undoCamelCase = function() {
        return this.replace(/([A-Z])/g, ' $1').toLowerCase();
    };
    String.prototype.doCamelCase = function() { // HT: https://stackoverflow.com/a/2970667
        return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index == 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    String.prototype.trunc = String.prototype.trunc || // ht https://stackoverflow.com/a/1199420
        function(n, useWordBoundary) {
            if (this.length <= n) { return this; }
            var subString = this.substr(0, n - 1);
            return (useWordBoundary ?
                subString.substr(0, subString.lastIndexOf(' ')) :
                subString) + "...";
        };

    String.prototype.hashCode = function() {
        var hash = 0,
            i, chr;
        if (this.length === 0) return hash;
        for (i = 0; i < this.length; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
})()

export const DOMHelpers = {
    c: (s) => {

        if (s.indexOf('.') !== -1 || s.indexOf('#') !== -1) {
            let classStrings = s.match(/\.([^#.]*)/g) || [];
            let idString = s.match(/#([^.]*)/);
            let elString = s.match(/^([^.#]+)/);


            let el = document.createElement(elString[0]);
            classStrings.forEach(klass => {
                el.classList.add(klass.replace('.', ''));
            });
            if (idString !== null) {
                el.setAttribute('id', idString[1]);
            }
            return el;
        }
        return document.createElement(s);
    },
    q: (s) => document.querySelector(s),
    qa: (s) => document.querySelectorAll(s)
}

export function disableHoverOnTouch(){
/* adds and removes `_isTouchMode` bool property to document.body based on touch and mouse events
 accounts for devices with both touch and mouse. touching sets _isTouchMode to true; using the mouse sets
 it to false. app can query this property elsewhere */
// HT: https://stackoverflow.com/a/30303898
    var container = document.body;
    var lastTouchTime = 0;
    function enableHover() {
        if (new Date() - lastTouchTime < 500) return;
        if (!container._isTouchMode) return;
        container._isTouchMode = false;
        console.log(container._isTouchMode);
    }
    function disableHover() {
        if (container._isTouchMode) return;
        container._isTouchMode = true;
        console.log(container._isTouchMode);
    }
    function updateLastTouchTime() {
        lastTouchTime = new Date();
    }
    document.addEventListener('touchstart', updateLastTouchTime, true);
    document.addEventListener('touchstart', disableHover, true);
    document.addEventListener('mousemove', enableHover, true);
}