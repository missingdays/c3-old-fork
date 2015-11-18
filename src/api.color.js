// TODO: fix
c3_chart_fn.color = function (id) {
    var $$ = this.internal;
    return $$.color(id); // more patterns
};

c3_chart_fn.colorPattern = function(pattern){
    var $$ = this.internal;

    if(!pattern){
        return $$.config.color_pattern;
    }

    $$.config.color_pattern = pattern;
    $$.color = $$.generateColor();

};
