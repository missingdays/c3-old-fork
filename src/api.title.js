c3_chart_fn.title = function(title, hasSubs, isSub) {
    var $$ = this.internal;

    if (!arguments.length) {
        if ($$.data.title) {
            return $$.data.title.text();
        } else
            return undefined;
    }

    /* Remove title */
    if (title === null) {
        $$.data.title = undefined;
        return;
    }

    $$.config.chartTitle = title;

    $$.api.redrawTitle(hasSubs, isSub);
};

c3_chart_fn.title.show = function() {
    var $$ = this.internal;

    // Add padding for title
    $$.config.padding_top = 42;
    $$.cachedRedraw({withLegend: true});

    if (!isUndefined($$.data.title)){
        $$.data.title.style("display", "block");
    }
};

c3_chart_fn.title.hide = function() {
    var $$ = this.internal;

    if ($$.data.title) {
        $$.data.title.style("display", "none");
    }

    // Remove padding
    $$.config.padding_top = 0;
    $$.cachedRedraw({withLegend: true});
};

c3.chart.fn.redrawTitle = function(hasSubs, isSub){
    var $$ = this.internal;

    var title = $$.config.chartTitle;

    var x = $$.currentWidth;

    if(!hasSubs) x /= 2;
    if(isSub) x = 0;

    var y = 32;

    if (!$$.data.title) {
        $$.data.title = $$.svg.append('text')
                        .attr("class", 'c3-title')
                        .attr("text-anchor", 'middle')
                        .attr('x', x)
                        .attr('y', y);
        $$.data.title.append('tspan').text(title);
    } else {
        $$.data.title
            .text(title)
            .attr('x', x)
            .attr('y', y);
    }

};

