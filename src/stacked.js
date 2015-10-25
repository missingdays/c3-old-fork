c3.chart.internal.fn.normalize = function(targets){
    var $$ = this, tr = [], c = [];

    if(!$$.config.normalized || isUndefined(targets)){
        return targets;
    }

    var data = copyArray(targets);

    for(var k = 0; k < targets[0].values.length; k++) {
        var tt = 0;
        for(c in targets) {
            tt = tt + targets[c].values[k].value;
        }
        tr[k] = tt;
    }

    for(c in targets) {
        for(k = 0; k < tr.length; k++) {
            data[c].values[k].value = targets[c].values[k].value / tr[k];
        }
    }

    return data;
}
