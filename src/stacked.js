c3.chart.internal.fn.normalize = function(){
    var $$ = this, tr = [], c = [],
        data = $$.api.data();

    if(!$$.config.normalized){
        return;
    }

    for(var k = 0; k < data[0].values.length; k++) {
        var tt = 0;
        for(c in data) {
            tt = tt + data[c].values[k].value;
        }
        tr[k] = tt;
    }

    for(c in data) {
        for(k = 0; k < tr.length; k++) {
            data[c].values[k].value = data[c].values[k].value / tr[k];
        }
    }
}
