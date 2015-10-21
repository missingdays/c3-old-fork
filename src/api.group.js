c3_chart_fn.groups = function (groups) {
    var $$ = this.internal, config = $$.config;
    if (isUndefined(groups)) { return config.data_groups; }
    config.data_groups = groups;
    $$.redraw();
    return config.data_groups;
};

c3_chart_fn.isNormalized = function(is){
    var $$ = this.internal;
    if(isUndefined(is)){
        return $$.config.normalized;
    }
    $$.config.normalized = is;
};
