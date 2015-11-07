c3.chart.internal.fn.drawLine = function(line, x1, x2, y1, y2){

    line.attr("class", "lineForSubChart")
        .attr("x1", x1)
        .attr("x2", x2)
        .attr("y1", y1)
        .attr("y2", y2)
        .style("stroke-width", 1)
        .style("stroke", "#aaa");
};

c3.chart.internal.fn.getBox = function(selection){
    var box;
    // FIXME: hack for nodejs
    try {
        box = selection.node().getBBox();
    } catch(e){
        box = {
            y: 0,
            x: 0,
            height: 0,
            width: 0
        };
    }

    return box;
};

c3.chart.internal.fn.getLineCoordsForBar = function(center, order){
    var $$ = this;

    var x1, x2, y1, y2;

    if(isSub($$.config.ed3Type)){

        $$.ed3Config.subBox = $$.getBox($$.main.selectAll(".sub-chart .c3-chart-bars"));

        if(isUndefined($$.ed3Config.coords[order])) return;

        var coords = $$.ed3Config.coords[order];

        x1 = coords.x1;
        x2 = coords.x2;
        y1 = coords.y1;
        y2 = coords.y2;

        x1 -= ($$.getCurrentWidth());
        x2 -= ($$.getCurrentWidth());

    } else {
        try {
            $$.config.angle = $$.updateAngle($$.config.newd).startAngle;
        } catch(e){
            $$.config.angle = 0;
        }

        // Does first sequence take less than half of the chart?
        var small = toDegrees($$.config.angle) > 0;

        x1 = center.x;

        if(small){
            x1 += $$.radius * Math.sin($$.config.angle);
        }

        if(order === 0){
            y1 = center.y - $$.radius * (small ? Math.cos($$.config.angle) : 1);
        } else {
            y1 = center.y + $$.radius * (small ? Math.cos($$.config.angle) : 1);
        }

        if(!$$.ed3Config.subBox) return; 

        x2 = $$.ed3Config.subBox.x + $$.getCurrentWidth();
        y2 = $$.ed3Config.subBox.y;

        if(order === 1){
            y2 += $$.ed3Config.subBox.height;
        }

        $$.ed3Config.coords[order] = {
            x1: x1,
            x2: x2,
            y1: y1,
            y2: y2
        };

   }
    
    return {
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2
    };

};

c3.chart.internal.fn.getLineCoordsForPie = function(center, order){
    var $$ = this;

    var x1, x2, y1, y2;

    if(isSub($$.config.ed3Type)){

        if(!$$.ed3Config.coords[order]) return;

        var coords = $$.ed3Config.coords[order];

        x1 = coords.x1;
        x2 = coords.x2;
        y1 = coords.y1;
        y2 = coords.y2;

        x1 -= ($$.getCurrentWidth());
        x2 -= ($$.getCurrentWidth());

    } else {
        $$.config.angle = $$.updateAngle($$.config.newd).startAngle;

        // Does first sequence take less than half of the chart?
        var small = toDegrees($$.config.angle) > 0;

        x1 = center.x;

        if(small){
            x1 += $$.radius * Math.sin($$.config.angle);
        }

        x2 = x1 + $$.getCurrentWidth();

        if(order === 0){
            y1 = center.y - $$.radius * (small ? Math.cos($$.config.angle) : 1);

            y2 = center.y - $$.radius;
        } else {
            y1 = center.y + $$.radius * (small ? Math.cos($$.config.angle) : 1);

            y2 = center.y + $$.radius;
        }

        if(small){
            var subCenter = {
                x: center.x + $$.getCurrentWidth(),
                y: center.y
            };

            // middle circle
            var x3 = (center.x + subCenter.x) / 2;
            var y3 = (center.y + subCenter.y) / 2;
            var r3 = Math.sqrt((x3 - center.x) * (x3 - center.x) + (y3 - center.y) * (y3 - center.y));

            var r4 = $$.radius;

            // get intersection of middle and sub circles
            var e = (subCenter.x - x3);
            var f = (subCenter.y - y3);

            // http://mathforum.org/library/drmath/view/51836.html
            var p = Math.sqrt(e*e + f*f);
            var k = (p*p + r3*r3 - r4*r4) / ( 2 * p);

            if(order === 1){
                x2 = x3 + e*k/p - (f/p) * Math.sqrt(r3*r3 - k*k);
                y2 = y3 + f*k/p + (e/p) * Math.sqrt(r3*r3 - k*k);
            } else {
                x2 = x3 + e*k/p + (f/p) * Math.sqrt(r3*r3 - k*k);
                y2 = y3 + f*k/p - (e/p) * Math.sqrt(r3*r3 - k*k);
            }
        }

        $$.ed3Config.coords[order] = {
            x1: x1,
            x2: x2,
            y1: y1,
            y2: y2
        };

   }
    
    return {
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2
    };
};

c3.chart.internal.fn.redrawLines = function(){
    var line;
    var $$ = this;
    var main = $$.main;

    // If line wasn't created yet
    if(main.selectAll(".lineForSubChart")[0].length === 0){
        line = main.append("line");
    } else {
        line = main.selectAll(".lineForSubChart").filter(function(d, i){ return i === 0; });
    }

    var center = $$.getCenter(main.selectAll('.c3-chart'));

    var coords;

    if($$.config.subType === "sub-pie"){
        coords = $$.getLineCoordsForPie(center, 0);
    } else if($$.config.subType === "sub-bar"){
        coords = $$.getLineCoordsForBar(center, 0);
    }

    if(!coords) return;

    $$.drawLine(line, coords.x1, coords.x2, coords.y1, coords.y2);

    // If only previous line was created
    if(main.selectAll(".lineForSubChart")[0].length === 1){
        line = main.append("line");
    } else {
        line = main.selectAll(".lineForSubChart").filter(function(d, i){ return i === 1; });
    }

    center = $$.getCenter(main.selectAll('.c3-chart'));

    if($$.config.subType === "sub-pie"){
        coords = $$.getLineCoordsForPie(center, 1);
    } else if($$.config.subType === "sub-bar"){
        coords = $$.getLineCoordsForBar(center, 1);
    }

    if(!coords) return;

    $$.drawLine(line, coords.x1, coords.x2, coords.y1, coords.y2);

};

c3.chart.internal.fn.getCenter = function(selection){
    var $$ = this;
    var bbox = $$.getBox(selection);

    return {
        x: bbox.x + bbox.width/2, 
        y: bbox.y + bbox.height/2
    };
};
