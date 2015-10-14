c3_chart_fn.xgrids = function (grids) {
    var $$ = this.internal, config = $$.config;
    if (! grids) { return config.grid_x_lines; }
    config.grid_x_lines = grids;
    $$.redrawWithoutRescale();
    return config.grid_x_lines;
};
c3_chart_fn.xgrids.add = function (grids) {
    var $$ = this.internal;
    return this.xgrids($$.config.grid_x_lines.concat(grids ? grids : []));
};
c3_chart_fn.xgrids.remove = function (params) { // TODO: multiple
    var $$ = this.internal;
    $$.removeGridLines(params, true);
};

c3_chart_fn.ygrids = function (grids) {
    var $$ = this.internal, config = $$.config;
    if (! grids) { return config.grid_y_lines; }
    config.grid_y_lines = grids;
    $$.redrawWithoutRescale();
    return config.grid_y_lines;
};
c3_chart_fn.ygrids.add = function (grids) {
    var $$ = this.internal;
    return this.ygrids($$.config.grid_y_lines.concat(grids ? grids : []));
};
c3_chart_fn.ygrids.remove = function (params) { // TODO: multiple
    var $$ = this.internal;
    $$.removeGridLines(params, false);
};

c3_chart_fn.gridX = function() {
    var $$ = this.internal;       
    return $$.config.grid_x_show; 
};               

c3_chart_fn.gridX.show = function() {
    var $$ = this.internal;       
    $$.config.grid_x_show = true; 

    if (isUndefined($$.xgrid)){
        return;
    }

    var gridx = $$.xgrid[0];      
    for (var id in gridx) {
        if(gridx[id]){
            gridx[id].style.display = "";
        }
    }

    $$.updateAndRedraw({withLegend: true});
};

c3_chart_fn.gridX.hide = function() {
    var $$ = this.internal;
    $$.config.grid_x_show = false;

    if (isUndefined($$.xgrid)){
        return;
    }

    var gridx = $$.xgrid[0];
    for (var id in gridx) {
        if(gridx[id]){
            gridx[id].style.display = "none";
        }
    }

    $$.updateAndRedraw({withLegend: true});
};

c3_chart_fn.gridY = function() {
    var $$ = this.internal;
    return $$.config.grid_y_show;

};

c3_chart_fn.gridY.show = function() {
    var $$ = this.internal;
    $$.config.grid_y_show = true;

    if (isUndefined($$.ygrid)){
        return;
    }

    var gridy = $$.ygrid[0];
    for (var id in gridy) {
        gridy[id].style.display = "";
    }

    $$.updateAndRedraw({withLegend: true});
};

c3_chart_fn.gridY.hide = function() {
    var $$ = this.internal;
    $$.config.grid_y_show = false;

    if (isUndefined($$.ygrid)){
        return;
    }

    var gridy = $$.ygrid[0];
    for (var id in gridy) {
        gridy[id].style.display = "none";
    }

    $$.updateAndRedraw({withLegend: true});
};
