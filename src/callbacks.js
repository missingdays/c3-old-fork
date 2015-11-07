c3.chart.internal.fn.pushCallback = function(callback){
    var $$ = this;
    if(callback){
        if($$.callbacks){
            $$.callbacks.push(callback);
        } else {
            $$.callbacks = [callback];
        }
    }
};

c3.chart.internal.fn.resolveCallbacks = function(){
    var $$ = this;
    if($$.callbacks){
        $$.callbacks.forEach(function(callback){
            if(callback){
                callback();
            }
        });
    }
    $$.callbacks = [];
};

c3.chart.internal.fn.resolveDraw = function(options){
    var $$ = this;
    $$.resolveCallbacks();
    $$.updateAndRedraw();
    // Hack so sub-chart draws correctly.
    if($$.config.hasSubs || $$.config.isSub){
        setTimeout(function(){
            $$.api.flush();
        });
    }
};

c3.chart.internal.fn.cachedRedraw = function(options, callback){
    var $$ = this;

    $$.pushCallback(callback);

    if($$.config.shouldCache){
        if(!$$.buffer.has("tune-axis" + $$.config.isSub)){
            $$.buffer.onlastfinish("cached-redraw" + $$.config.isSub,
                function(){
                    $$.resolveDraw(options);
                }
            );
        }
    } else {
        $$.resolveDraw(options);
    }
};

c3.chart.fn.setDrawCaching = function(should){
    var $$ = this.internal;
    $$.config.shouldCache = should;
};

c3_chart_fn.getDrawCaching = function(){
    var $$ = this.internal;
    return $$.config.shouldCache;
};
