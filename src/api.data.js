c3_chart_fn.data = function (targetIds) {
    var targets = this.internal.data.targets;
    return typeof targetIds === 'undefined' ? targets : targets.filter(function (t) {
        return [].concat(targetIds).indexOf(t.id) >= 0;
    });
};
c3_chart_fn.data.shown = function (targetIds) {
    return this.internal.filterTargetsToShow(this.data(targetIds));
};
c3_chart_fn.data.values = function (targetId) {
    var targets, values = null;
    if (targetId) {
        targets = this.data(targetId);
        values = targets[0] ? targets[0].values.map(function (d) { return d.value; }) : null;
    }
    return values;
};
c3_chart_fn.data.names = function (names) {
    this.internal.clearLegendItemTextBoxCache();
    return this.internal.updateDataAttributes('names', names);
};
c3_chart_fn.data.colors = function (colors) {
    return this.internal.updateDataAttributes('colors', colors);
};
c3_chart_fn.data.axes = function (axes) {
    return this.internal.updateDataAttributes('axes', axes);
};

c3_chart_fn.getDataById = function(seqId){
    var $$ = this.internal;
    var t = $$.api.data(seqId)[0];
    if(isUndefined(t)) {
        return undefined;
    }
    return t.values;
};

c3_chart_fn.dataType = function(id) {
    var $$ = this.internal;
    return $$.config.data_types[id];
};

c3_chart_fn.dataColor = function(id, value) {
    var $$ = this;
    if (arguments.length < 2)
        return $$.data.colors()[id];
    $$.data.colors()[id] = value;
};

c3_chart_fn.dataHeader = function(id, value) {
    var $$ = this.internal;
    if (arguments.length < 2)
        return $$.api.data.names()[id];
    $$.api.data.names()[id] = value;
};

