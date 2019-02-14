var CustomStyle = (function CustomStyleClosure() {
    var prefixes = ['ms', 'Moz', 'Webkit', 'O'];
    var _cache = { };

    function CustomStyle() {
        
    }

    CustomStyle.getProp = function get(propName, element) {
        // check cache only when no element is given
        if (arguments.length == 1 && typeof _cache[propName] == 'string') {
            return _cache[propName];
        }

        element = element || document.documentElement;
        var style = element.style, prefixed, uPropName;

        // test standard property first
        if (typeof style[propName] == 'string') {
            return (_cache[propName] = propName);
        }

        // capitalize
        uPropName = propName.charAt(0).toUpperCase() + propName.slice(1);

        // test vendor specific properties
        for (var i = 0, l = prefixes.length; i < l; i++) {
            prefixed = prefixes[i] + uPropName;
            if (typeof style[prefixed] == 'string') {
                return (_cache[propName] = prefixed);
            }
        }

        //if all fails then set to undefined
        return (_cache[propName] = 'undefined');
    };

    CustomStyle.setProp = function set(propName, element, str) {
        var prop = this.getProp(propName);
        if (prop != 'undefined')
            element.style[prop] = str;
    };

    return CustomStyle;
})();

function getOutputScale() {
    var pixelRatio = 'devicePixelRatio' in window ? window.devicePixelRatio : 1;
    return {
        sx: pixelRatio,
        sy: pixelRatio,
        scaled: pixelRatio != 1
    };
}

function GetCanvasOffset(canvas){
    return canvas.getBoundingClientRect();
}
export {getOutputScale,CustomStyle,GetCanvasOffset};