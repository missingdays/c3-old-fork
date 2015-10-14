c3_chart_fn.legend = function () {};
c3_chart_fn.legend.show = function (targetIds) {
    var $$ = this.internal;
    $$.showLegend($$.mapToTargetIds(targetIds));
    $$.updateAndRedraw({withLegend: true});
};
c3_chart_fn.legend.hide = function (targetIds) {
    var $$ = this.internal;
    $$.hideLegend(targetIds);
    $$.updateAndRedraw({withLegend: true});
};

c3_chart_fn.legend.position = function(position) {
    var $$ = this.internal;         

    if (!arguments.length) {        
        if (!$$.config.legend_show) {   
            position = 'off';               
        } else if ($$.isLegendRight) {  
            position = 'right';             
        } else if ($$.isLegendInset) {  
            position = 'inset';             
        } else {   
            position = 'bottom';            
        }          
        return position;                
    }              

    $$.isLegendRight = position === 'right';
    $$.isLegendInset = position === 'inset';

    $$.cachedRedraw({withLegend: true});
};

