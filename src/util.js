var isValue = c3_chart_internal_fn.isValue = function (v) {
    return v || v === 0;
},
    isFunction = c3_chart_internal_fn.isFunction = function (o) {
        return typeof o === 'function';
    },
    isString = c3_chart_internal_fn.isString = function (o) {
        return typeof o === 'string';
    },
    isUndefined = c3_chart_internal_fn.isUndefined = function (v) {
        return typeof v === 'undefined';
    },
    isNull = c3_chart_internal_fn.isNull = function(v){
        return v === null;
    },
    isDefined = c3_chart_internal_fn.isDefined = function (v) {
        return typeof v !== 'undefined';
    },
    ceil10 = c3_chart_internal_fn.ceil10 = function (v) {
        return Math.ceil(v / 10) * 10;
    },
    asHalfPixel = c3_chart_internal_fn.asHalfPixel = function (n) {
        return Math.ceil(n) + 0.5;
    },
    diffDomain = c3_chart_internal_fn.diffDomain = function (d) {
        return d[1] - d[0];
    },
    isEmpty = c3_chart_internal_fn.isEmpty = function (o) {
        return !o || (isString(o) && o.length === 0) || (typeof o === 'object' && Object.keys(o).length === 0);
    },
    notEmpty = c3_chart_internal_fn.notEmpty = function (o) {
        return Object.keys(o).length > 0;
    },
    getOption = c3_chart_internal_fn.getOption = function (options, key, defaultValue) {
        return isDefined(options[key]) ? options[key] : defaultValue;
    },
    hasValue = c3_chart_internal_fn.hasValue = function (dict, value) {
        var found = false;
        Object.keys(dict).forEach(function (key) {
            if (dict[key] === value) { found = true; }
        });
        return found;
    },
    getPathBox = c3_chart_internal_fn.getPathBox = function (path) {
        var box = path.getBoundingClientRect(),
            items = [path.pathSegList.getItem(0), path.pathSegList.getItem(1)],
            minX = items[0].x, minY = Math.min(items[0].y, items[1].y);
        return {x: minX, y: minY, width: box.width, height: box.height};
    },
    toRadians = function(degrees){
        return degrees * (Math.PI / 180);
    },
    toDegrees = function(radians){
        return radians * (180 / Math.PI);
    },
    isSub = function(type){
        if(!type){
            return false;
        }
        return type.indexOf("sub") > -1;
    },
    copyObject = function(oldObj){
        var newObj = {};
        for(var key in oldObj){
            if(oldObj.hasOwnProperty(key)){
                if(Array.isArray(oldObj[key])){
                    newObj[key] = copyArray(oldObj[key]);
                } else if(typeof oldObj[key] === 'object'){
                    newObj[key] = copyObject(oldObj[key]);
                } else if(typeof oldObj[key] === 'function'){
                    newObj[key] = oldObj[key].bind(newObj);
                } else {
                    newObj[key] = oldObj[key];
                }
            }
        }
        return newObj;
    },
    copyArray = function(oldArray){
        var newArray = [];

        oldArray.forEach(function(elem){
            if(typeof elem === 'function'){
                newArray.push(copyFunction(elem));
            } else if(Array.isArray(elem)){
                newArray.push(copyArray(elem));
            } else if(typeof elem === 'object'){
                newArray.push(copyObject(elem));
            } else {
                newArray.push(elem);
            }
        });

        return newArray;
    },
    copyFunction = function(oldFunction){
        var cloneObj = oldFunction;

        if(oldFunction.__isClone) {
            cloneObj = oldFunction.__clonedFrom;
        }

        var temp = function() { return cloneObj.apply(oldFunction, arguments); };

        for(var key in oldFunction) {
            temp[key] = oldFunction[key];
        }

        temp.__isClone = true;
        temp.__clonedFrom = cloneObj;

        return temp;
    },
    isNode = function(){
        return typeof process === 'object';
    };

