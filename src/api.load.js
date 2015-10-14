c3_chart_fn.load = function (args) {
    var $$ = this.internal, config = $$.config;
    // update xs if specified
    if (args.xs) {
        $$.addXs(args.xs);
    }
    // update classes if exists
    if ('classes' in args) {
        Object.keys(args.classes).forEach(function (id) {
            config.data_classes[id] = args.classes[id];
        });
    }
    // update categories if exists
    if ('categories' in args && $$.isCategorized()) {
        config.axis_x_categories = args.categories;
    }
    // update axes if exists
    if ('axes' in args) {
        Object.keys(args.axes).forEach(function (id) {
            config.data_axes[id] = args.axes[id];
        });
    }
    // use cache if exists
    if ('cacheIds' in args && $$.hasCaches(args.cacheIds)) {
        $$.load($$.getCaches(args.cacheIds), args.done);
        return;
    }
    // unload if needed
    if ('unload' in args) {
        // TODO: do not unload if target will load (included in url/rows/columns)
        $$.unload($$.mapToTargetIds((typeof args.unload === 'boolean' && args.unload) ? null : args.unload), function () {
            $$.loadFromArgs(args);
        });
    } else {
        $$.loadFromArgs(args);
    }
};

c3_chart_fn.unload = function (args) {
    var $$ = this.internal;
    args = args || {};
    if (args instanceof Array) {
        args = {ids: args};
    } else if (typeof args === 'string') {
        args = {ids: [args]};
    }
    $$.unload($$.mapToTargetIds(args.ids), function () {
        $$.redraw({withUpdateOrgXDomain: true, withUpdateXDomain: true, withLegend: true});
        if (args.done) { args.done(); }
    });
};

c3_chart_fn.appendToColumn = function(col) {
    var $$ = this.internal;
    var column = $$.api.getDataById(col[0]);

    if(!isUndefined(column)){
        for(var i = column.length - 1; i > -1; i--){
                col.splice(1, 0, column[i].value);
        }
    }

    $$.api.loadColumns([col]);
};

c3_chart_fn.popFromColumn = function(id, amount){
    var $$ = this.internal;
    var columns = $$.api.getDataById(id);

    if(isUndefined(columns)){
        throw new Error("Popping values from non-existing sequence");
    }

    for(var i = 0; i < amount; i++){
        columns.pop();
    }

    $$.api.loadColumns(columns);
};

c3_chart_fn.loadColumns = function(cols){
    var $$ = this.internal;
    $$.api.load({
        columns: cols
    });
};

c3_chart_fn.setValue = function(id, i, value){
    var $$ = this.internal;
    var column = $$.api.getDataById(id);

    if(isUndefined(column)){
        throw new Error("Setting value to non-existing sequence " + id);
    }

    if(isUndefined(column[i])){
        $$.api.appendToColumn([id, value]);
    } else {
        column[i] = value;
        $$.api.loadColumns([[id].concat(column)]);
    }
};

c3_chart_fn.getValue = function(id, i){
    var $$ = this.internal;

    var column = $$.api.getDataById(id);
    if(isUndefined(column)){
        return undefined;
    }

    var v = column[i];

    if(isUndefined(v)){
        return undefined;
    }

    return v.value;
};
