c3_chart_fn.resize = function (size) {
    var $$ = this.internal, config = $$.config;
    config.size_width = size ? size.width : null;
    config.size_height = size ? size.height : null;
    this.flush();
};

c3_chart_fn.width = function(width){
    var $$ = this.internal;
    if(isUndefined(width)){
        return $$.getCurrentWidth();
    }
    $$.config.size_width = width;
    this.flush();
};

c3_chart_fn.height = function(height){
    var $$ = this.internal;
    if(isUndefined(height)){
        return $$.getCurrentHeight();
    }
    $$.config.size_height = height;
    this.flush();
};

c3_chart_fn.flush = function () {
    var $$ = this.internal;
    $$.updateAndRedraw({withLegend: true, withTransition: false, withTransitionForTransform: false});
};

c3_chart_fn.destroy = function () {
    var $$ = this.internal;

    window.clearInterval($$.intervalForObserveInserted);
    window.onresize = null;

    $$.selectChart.classed('c3', false).html("");

    // MEMO: this is needed because the reference of some elements will not be released, then memory leak will happen.
    Object.keys($$).forEach(function (key) {
        $$[key] = null;
    });

    return null;
};

c3_chart_fn.bgcolor = function(value) {
    var $$ = this.internal;         
    var svg = $$.svg[0][0];         
    if (!arguments.length){         
        if(svg.style.backgroundColor){  
            return svg.style.backgroundColor;
        } else {   
            return undefined;               
        }
    } else {
        svg.style.backgroundColor = value;
    }              
};  

c3.chart.fn.turn = function(options){
    var $$ = this.internal;         
    var turnAngle;

    if(!options){
        return;  
    }

    if(options.radians){            
        turnAngle = options.radians;    
    } else {     
        turnAngle = toRadians(options.degrees);
    }            

    if(options.relative){           
        $$.config.turnAngle += turnAngle;
    } else {     
        $$.config.turnAngle = turnAngle;
    }
};

