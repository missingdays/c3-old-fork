c3_chart_internal_fn.initAxis = function(){
    var $$ = this, config = $$.config, main = $$.main;
    $$.axes.x = main.append("g")
        .attr("class", CLASS.axis + ' ' + CLASS.axisX)
        .attr("clip-path", $$.clipPathForXAxis)
        .attr("transform", $$.getTranslate('x'))
        .style("visibility", config.axis_x_show ? 'visible' : 'hidden');
    $$.axes.x.append("text")
        .attr("class", CLASS.axisXLabel)
        .attr("transform", config.axis_rotated ? "rotate(-90)" : "")
        .style("text-anchor", $$.textAnchorForXAxisLabel.bind($$));

    $$.axes.y = main.append("g")
        .attr("class", CLASS.axis + ' ' + CLASS.axisY)
        .attr("clip-path", config.axis_y_inner ? "" : $$.clipPathForYAxis)
        .attr("transform", $$.getTranslate('y'))
        .style("visibility", config.axis_y_show ? 'visible' : 'hidden');
    $$.axes.y.append("text")
        .attr("class", CLASS.axisYLabel)
        .attr("transform", config.axis_rotated ? "" : "rotate(-90)")
        .style("text-anchor", $$.textAnchorForYAxisLabel.bind($$));

    $$.axes.y2 = main.append("g")
        .attr("class", CLASS.axis + ' ' + CLASS.axisY2)
        // clip-path?
        .attr("transform", $$.getTranslate('y2'))
        .style("visibility", config.axis_y2_show ? 'visible' : 'hidden');
    $$.axes.y2.append("text")
        .attr("class", CLASS.axisY2Label)
        .attr("transform", config.axis_rotated ? "" : "rotate(-90)")
        .style("text-anchor", $$.textAnchorForY2AxisLabel.bind($$));
};
c3_chart_internal_fn.getXAxis = function (scale, orient, tickFormat, tickValues, withOuterTick, withoutTransition) {
    var $$ = this, config = $$.config,
        axisParams = {
            isCategory: $$.isCategorized(),
            withOuterTick: withOuterTick,
            tickMultiline: config.axis_x_tick_multiline,
            tickWidth: config.axis_x_tick_width,
            withoutTransition: withoutTransition,
        },
        axis = c3_axis($$.d3, axisParams).scale(scale).orient(orient);

    if ($$.isTimeSeries() && tickValues) {
        tickValues = tickValues.map(function (v) { return $$.parseDate(v); });
    }

    // Set tick
    axis.tickFormat(tickFormat).tickValues(tickValues);
    if ($$.isCategorized()) {
        axis.tickCentered(config.axis_x_tick_centered);
        if (isEmpty(config.axis_x_tick_culling)) {
            config.axis_x_tick_culling = false;
        }
    } else {
        // TODO: move this to c3_axis
        axis.tickOffset = function () {
            var scale = this.scale(),
                edgeX = $$.getEdgeX($$.data.targets), diff = scale(edgeX[1]) - scale(edgeX[0]),
                base = diff ? diff : (config.axis_rotated ? $$.height : $$.width);
            return (base / $$.getMaxDataCount()) / 2;
        };
    }

    return axis;
};
c3_chart_internal_fn.updateXAxisTickValues = function (targets, axis) {
    var $$ = this, config = $$.config, tickValues;
    if (config.axis_x_tick_fit || config.axis_x_tick_count) {
        tickValues = $$.generateTickValues($$.mapTargetsToUniqueXs(targets), config.axis_x_tick_count, $$.isTimeSeries());
    }
    if (axis) {
        axis.tickValues(tickValues);
    } else {
        $$.xAxis.tickValues(tickValues);
        $$.subXAxis.tickValues(tickValues);
    }
    return tickValues;
};
c3_chart_internal_fn.getYAxis = function (scale, orient, tickFormat, tickValues, withOuterTick) {
    var axisParams = {withOuterTick: withOuterTick},
        axis = c3_axis(this.d3, axisParams).scale(scale).orient(orient).tickFormat(tickFormat);
    if (this.isTimeSeriesY()) {
        axis.ticks(this.d3.time[this.config.axis_y_tick_time_value], this.config.axis_y_tick_time_interval);
    } else {
        axis.tickValues(tickValues);
    }
    return axis;
};
c3_chart_internal_fn.getAxisId = function (id) {
    var config = this.config;
    return id in config.data_axes ? config.data_axes[id] : 'y';
};
c3_chart_internal_fn.getXAxisTickFormat = function () {
    var $$ = this, config = $$.config,
        format = $$.isTimeSeries() ? $$.defaultAxisTimeFormat : $$.isCategorized() ? $$.categoryName : function (v) { return v < 0 ? v.toFixed(0) : v; };
    if (config.axis_x_tick_format) {
        if (isFunction(config.axis_x_tick_format)) {
            format = config.axis_x_tick_format;
        } else if ($$.isTimeSeries()) {
            format = function (date) {
                return date ? $$.axisTimeFormat(config.axis_x_tick_format)(date) : "";
            };
        }
    }
    return isFunction(format) ? function (v) { return format.call($$, v); } : format;
};
c3_chart_internal_fn.getAxisTickValues = function (tickValues, axis) {
    return tickValues ? tickValues : axis ? axis.tickValues() : undefined;
};
c3_chart_internal_fn.getXAxisTickValues = function () {
    return this.getAxisTickValues(this.config.axis_x_tick_values, this.xAxis);
};
c3_chart_internal_fn.getYAxisTickValues = function () {
    return this.getAxisTickValues(this.config.axis_y_tick_values, this.yAxis);
};
c3_chart_internal_fn.getY2AxisTickValues = function () {
    return this.getAxisTickValues(this.config.axis_y2_tick_values, this.y2Axis);
};
c3_chart_internal_fn.getAxisLabelOptionByAxisId = function (axisId) {
    var $$ = this, config = $$.config, option;
    if (axisId === 'y') {
        option = config.axis_y_label;
    } else if (axisId === 'y2') {
        option = config.axis_y2_label;
    } else if (axisId === 'x') {
        option = config.axis_x_label;
    }
    return option;
};
c3_chart_internal_fn.getAxisLabelText = function (axisId) {
    var option = this.getAxisLabelOptionByAxisId(axisId);
    return isString(option) ? option : option ? option.text : null;
};
c3_chart_internal_fn.setAxisLabelText = function (axisId, text) {
    var $$ = this, config = $$.config,
        option = $$.getAxisLabelOptionByAxisId(axisId);
    if (isString(option)) {
        if (axisId === 'y') {
            config.axis_y_label = text;
        } else if (axisId === 'y2') {
            config.axis_y2_label = text;
        } else if (axisId === 'x') {
            config.axis_x_label = text;
        }
    } else if (option) {
        option.text = text;
    }
};
c3_chart_internal_fn.getAxisLabelPosition = function (axisId, defaultPosition) {
    var option = this.getAxisLabelOptionByAxisId(axisId),
        position = (option && typeof option === 'object' && option.position) ? option.position : defaultPosition;
    return {
        isInner: position.indexOf('inner') >= 0,
        isOuter: position.indexOf('outer') >= 0,
        isLeft: position.indexOf('left') >= 0,
        isCenter: position.indexOf('center') >= 0 || position.indexOf('middle') >= 0,
        isRight: position.indexOf('right') >= 0,
        isTop: position.indexOf('top') >= 0,
        isMiddle: position.indexOf('middle') >= 0 || position.indexOf('center') >= 0,
        isBottom: position.indexOf('bottom') >= 0
    };
};
c3_chart_internal_fn.getXAxisLabelPosition = function () {
    return this.getAxisLabelPosition('x', this.config.axis_rotated ? 'inner-top' : 'inner-right');
};
c3_chart_internal_fn.getYAxisLabelPosition = function () {
    return this.getAxisLabelPosition('y', this.config.axis_rotated ? 'inner-right' : 'inner-top');
};
c3_chart_internal_fn.getY2AxisLabelPosition = function () {
    return this.getAxisLabelPosition('y2', this.config.axis_rotated ? 'inner-right' : 'inner-top');
};
c3_chart_internal_fn.getAxisLabelPositionById = function (id) {
    return id === 'y2' ? this.getY2AxisLabelPosition() : id === 'y' ? this.getYAxisLabelPosition() : this.getXAxisLabelPosition();
};
c3_chart_internal_fn.textForXAxisLabel = function () {
    return this.getAxisLabelText('x');
};
c3_chart_internal_fn.textForYAxisLabel = function () {
    return this.getAxisLabelText('y');
};
c3_chart_internal_fn.textForY2AxisLabel = function () {
    return this.getAxisLabelText('y2');
};
c3_chart_internal_fn.xForAxisLabel = function (forHorizontal, position) {
    var $$ = this;
    if (forHorizontal) {
        return position.isLeft ? 0 : position.isCenter ? $$.width / 2 : $$.width;
    } else {
        return position.isBottom ? -$$.height : position.isMiddle ? -$$.height / 2 : 0;
    }
};
c3_chart_internal_fn.dxForAxisLabel = function (forHorizontal, position) {
    if (forHorizontal) {
        return position.isLeft ? "0.5em" : position.isRight ? "-0.5em" : "0";
    } else {
        return position.isTop ? "-0.5em" : position.isBottom ? "0.5em" : "0";
    }
};
c3_chart_internal_fn.textAnchorForAxisLabel = function (forHorizontal, position) {
    if (forHorizontal) {
        return position.isLeft ? 'start' : position.isCenter ? 'middle' : 'end';
    } else {
        return position.isBottom ? 'start' : position.isMiddle ? 'middle' : 'end';
    }
};
c3_chart_internal_fn.xForXAxisLabel = function () {
    return this.xForAxisLabel(!this.config.axis_rotated, this.getXAxisLabelPosition());
};
c3_chart_internal_fn.xForYAxisLabel = function () {
    return this.xForAxisLabel(this.config.axis_rotated, this.getYAxisLabelPosition());
};
c3_chart_internal_fn.xForY2AxisLabel = function () {
    return this.xForAxisLabel(this.config.axis_rotated, this.getY2AxisLabelPosition());
};
c3_chart_internal_fn.dxForXAxisLabel = function () {
    return this.dxForAxisLabel(!this.config.axis_rotated, this.getXAxisLabelPosition());
};
c3_chart_internal_fn.dxForYAxisLabel = function () {
    return this.dxForAxisLabel(this.config.axis_rotated, this.getYAxisLabelPosition());
};
c3_chart_internal_fn.dxForY2AxisLabel = function () {
    return this.dxForAxisLabel(this.config.axis_rotated, this.getY2AxisLabelPosition());
};
c3_chart_internal_fn.dyForXAxisLabel = function () {
    var $$ = this, config = $$.config,
        position = $$.getXAxisLabelPosition();
    if (config.axis_rotated) {
        return position.isInner ? "1.2em" : -25 - $$.getMaxTickWidth('x');
    } else {
        return position.isInner ? "-0.5em" : config.axis_x_height ? config.axis_x_height - 10 : "3em";
    }
};
c3_chart_internal_fn.dyForYAxisLabel = function () {
    var $$ = this,
        position = $$.getYAxisLabelPosition();
    if ($$.config.axis_rotated) {
        return position.isInner ? "-0.5em" : "3em";
    } else {
        return position.isInner ? "1.2em" : -10 - ($$.config.axis_y_inner ? 0 : ($$.getMaxTickWidth('y') + 10));
    }
};
c3_chart_internal_fn.dyForY2AxisLabel = function () {
    var $$ = this,
        position = $$.getY2AxisLabelPosition();
    if ($$.config.axis_rotated) {
        return position.isInner ? "1.2em" : "-2.2em";
    } else {
        return position.isInner ? "-0.5em" : 15 + ($$.config.axis_y2_inner ? 0 : (this.getMaxTickWidth('y2') + 15));
    }
};
c3_chart_internal_fn.textAnchorForXAxisLabel = function () {
    var $$ = this;
    return $$.textAnchorForAxisLabel(!$$.config.axis_rotated, $$.getXAxisLabelPosition());
};
c3_chart_internal_fn.textAnchorForYAxisLabel = function () {
    var $$ = this;
    return $$.textAnchorForAxisLabel($$.config.axis_rotated, $$.getYAxisLabelPosition());
};
c3_chart_internal_fn.textAnchorForY2AxisLabel = function () {
    var $$ = this;
    return $$.textAnchorForAxisLabel($$.config.axis_rotated, $$.getY2AxisLabelPosition());
};

c3_chart_internal_fn.xForRotatedTickText = function (r) {
    return 8 * Math.sin(Math.PI * (r / 180));
};
c3_chart_internal_fn.yForRotatedTickText = function (r) {
    return 11.5 - 2.5 * (r / 15) * (r > 0 ? 1 : -1);
};
c3_chart_internal_fn.rotateTickText = function (axis, transition, rotate) {
    axis.selectAll('.tick text')
        .style("text-anchor", rotate > 0 ? "start" : "end");
    transition.selectAll('.tick text')
        .attr("y", this.yForRotatedTickText(rotate))
        .attr("transform", "rotate(" + rotate + ")")
      .selectAll('tspan')
        .attr('dx', this.xForRotatedTickText(rotate));
};

c3_chart_internal_fn.getMaxTickWidth = function () {
    var $$ = this;
    return $$.config.normalized ? 15 : 10;
};

c3_chart_internal_fn.updateAxisLabels = function (withTransition) {
    var $$ = this;
    var axisXLabel = $$.main.select('.' + CLASS.axisX + ' .' + CLASS.axisXLabel),
        axisYLabel = $$.main.select('.' + CLASS.axisY + ' .' + CLASS.axisYLabel),
        axisY2Label = $$.main.select('.' + CLASS.axisY2 + ' .' + CLASS.axisY2Label);
    (withTransition ? axisXLabel.transition() : axisXLabel)
        .attr("x", $$.xForXAxisLabel.bind($$))
        .attr("dx", $$.dxForXAxisLabel.bind($$))
        .attr("dy", $$.dyForXAxisLabel.bind($$))
        .text($$.textForXAxisLabel.bind($$));
    (withTransition ? axisYLabel.transition() : axisYLabel)
        .attr("x", $$.xForYAxisLabel.bind($$))
        .attr("dx", $$.dxForYAxisLabel.bind($$))
        .attr("dy", $$.dyForYAxisLabel.bind($$))
        .text($$.textForYAxisLabel.bind($$));
    (withTransition ? axisY2Label.transition() : axisY2Label)
        .attr("x", $$.xForY2AxisLabel.bind($$))
        .attr("dx", $$.dxForY2AxisLabel.bind($$))
        .attr("dy", $$.dyForY2AxisLabel.bind($$))
        .text($$.textForY2AxisLabel.bind($$));
};

c3_chart_internal_fn.getAxisPadding = function (padding, key, defaultValue, domainLength) {
    if (!isValue(padding[key])) {
        return defaultValue;
    }
    if (padding.unit === 'ratio') {
        return padding[key] * domainLength;
    }
    // assume padding is pixels if unit is not specified
    return this.convertPixelsToAxisPadding(padding[key], domainLength);
};
c3_chart_internal_fn.convertPixelsToAxisPadding = function (pixels, domainLength) {
    var length = this.config.axis_rotated ? this.width : this.height;
    return domainLength * (pixels / length);
};

c3_chart_internal_fn.generateTickValues = function (values, tickCount, forTimeSeries) {
    var tickValues = values, targetCount, start, end, count, interval, i, tickValue;
    if (tickCount) {
        targetCount = isFunction(tickCount) ? tickCount() : tickCount;
        // compute ticks according to tickCount
        if (targetCount === 1) {
            tickValues = [values[0]];
        } else if (targetCount === 2) {
            tickValues = [values[0], values[values.length - 1]];
        } else if (targetCount > 2) {
            count = targetCount - 2;
            start = values[0];
            end = values[values.length - 1];
            interval = (end - start) / (count + 1);
            // re-construct unique values
            tickValues = [start];
            for (i = 0; i < count; i++) {
                tickValue = +start + interval * (i + 1);
                tickValues.push(forTimeSeries ? new Date(tickValue) : tickValue);
            }
            tickValues.push(end);
        }
    }
    if (!forTimeSeries) { tickValues = tickValues.sort(function (a, b) { return a - b; }); }
    return tickValues;
};
c3_chart_internal_fn.generateAxisTransitions = function (duration) {
    var $$ = this, axes = $$.axes;
    return {
        axisX: duration ? axes.x.transition().duration(duration) : axes.x,
        axisY: duration ? axes.y.transition().duration(duration) : axes.y,
        axisY2: duration ? axes.y2.transition().duration(duration) : axes.y2,
        axisSubX: duration ? axes.subx.transition().duration(duration) : axes.subx
    };
};
c3_chart_internal_fn.redrawAxis = function (transitions, isHidden) {
    var $$ = this, config = $$.config;
    $$.axes.x.style("opacity", isHidden ? 0 : 1);
    $$.axes.y.style("opacity", isHidden ? 0 : 1);
    $$.axes.y2.style("opacity", isHidden ? 0 : 1);
    $$.axes.subx.style("opacity", isHidden ? 0 : 1);
    transitions.axisX.call($$.xAxis);
    transitions.axisY.call($$.yAxis);
    transitions.axisY2.call($$.y2Axis);
    transitions.axisSubX.call($$.subXAxis);
    // rotate tick text if needed
    if (!config.axis_rotated && config.axis_x_tick_rotate) {
        $$.rotateTickText($$.axes.x, transitions.axisX, config.axis_x_tick_rotate);
        $$.rotateTickText($$.axes.subx, transitions.axisSubX, config.axis_x_tick_rotate);
    }
};

c3_chart_internal_fn.tuneAxis = function(sync, callback){
    var $$ = this;

    $$.pushCallback(callback);

    // if we don't need to tune
    if($$.config.normalized){
        $$.data.targets = $$.normalize($$.data._targets);
        $$.cachedRedraw();
        return;
    }
        
    var apply = function(){

        var minmax = $$.findMinMax();

        var sizesX;
        if($$.config.is_xy){
            sizesX = $$.getAbscissa($$.config.ed3Type, minmax.minX, minmax.maxX);
        }
        var sizesY = $$.getAxisData(minmax.minY, minmax.maxY);

        $$.api.axis.range({
            min: {
                x: sizesX ? sizesX.min : undefined,
                y: sizesY.min
            },
            max: {
                x: sizesX ? sizesX.max : undefined,
                y: sizesY.max
            }
        });

        $$.resolveCallbacks();

    };

    if(sync){
        apply();
    } else {
        $$.buffer.onlastfinish("tune-axis" + $$.config.isSub, apply);
        $$.buffer.onlastfinish("cached-redraw" + $$.config.isSub, function(){});
    }

};

function log10(n) {
    return Math.log(n) / Math.log(10);
}

function log(n, m) {
    return Math.log(n) / Math.log(m);
}

c3_chart_internal_fn.getAbscissa =  function(type, min, max) {
    var $$ = this; 
    var axis = {};

    switch(type) {
        case 'area':
        case 'area-stacked':
        case 'area-stacked-100':
            axis.min = 1;
            axis.max = max;
            axis.step = 1;
            break;
        case 'bar':
        case 'bar-stacked':
        case 'bar-stacked-100':
            axis = $$.getAxisData(min, max, true);
            break;
        case 'column':
        case 'column-stacked':
        case 'column-stacked-100':
            axis.min = 1;
            axis.max = max;
            axis.step = 1;
            break;
        case 'line-m':
        case 'line':
        case 'line-stacked-m':
        case 'line-stacked':
        case 'line-stacked-100-m':
        case 'line-stacked-100':
            axis.min = 1;
            axis.max = max;
            axis.step = 1;
            break;
        case 'xy-m':
        case 'xy-smooth-m':
        case 'xy-smooth':
        case 'xy-straight-m':
        case 'xy-straight':
            axis = $$.getAxisData(min, max, true);
            break;
        default:
            throw new Error("Unsupported type for axis " + type);
    }
    return axis;
};

c3_chart_internal_fn.getAxisData =  function(min, max, isAbscissa) {
    var $$ = this;

    isAbscissa = isAbscissa || false;
    var axis = {};

    if (min === 0 && max === 0) {
        axis.step = 0.1;
        axis.min = 0;
        axis.max = 1;
        return axis;
    }

    var min4calc = 0;
    var max4calc = 0;
    if (min != max) {
        min4calc = Math.min(min);
        max4calc = Math.max(max);
    }
    else {
        min4calc = signMin > 0 ? 0 : min;
        max4calc = signMin > 0 ? max : 0;
    }

    var signMin = min4calc === 0 ? 0 : min4calc / Math.abs(min4calc);
    var signMax = max4calc === 0 ? 0 : max4calc / Math.abs(max4calc);

    var absMax4calc = Math.max(Math.abs(min), Math.abs(max));
    var absMin4calc = Math.min(Math.abs(min), Math.abs(max));

    var signAbsMax4calc = Math.abs(max) > Math.abs(min) ? signMax : signMin;
    var signAbsMin4calc = Math.abs(max) < Math.abs(min) ? signMax : signMin;

    var isBrokenAxis = Math.abs(Math.abs(max) - Math.abs(min)) < (Math.abs(max) > Math.abs(min)?Math.abs(max):Math.abs(min)) * 0.2 && signMin == signMax;

    var delta = 0;

    if (isBrokenAxis) {
        delta = Math.abs(max4calc - min4calc);
    }
    else {
        if (signMin == signMax) {
                delta = Math.abs(max4calc) > Math.abs(min4calc) ? Math.abs(max4calc) : Math.abs(min4calc);
        }
        else {
            delta = Math.abs(max4calc - min4calc);
        }
    }

    var basePow = log10(delta);
    var normalize = delta / Math.pow(10, Math.floor(basePow));
    var peak = normalize * 1.05;

    if (isBrokenAxis) {
        peak = peak * 1.5;
    }

    var normalizestep = 0;
    if(!isAbscissa) {
            if (peak < 2) {
                normalizestep = 0.2;
            }
            else if (peak < 5) {
                normalizestep = 0.5;
            }
            else if (peak > 10) {
                    normalizestep = 2;
            }
            else {
                normalizestep = 1;
            }
    } else {
            if (peak < 1.8) {
                normalizestep = 0.2;
            }
            else if (peak < 4.5) {
                normalizestep = 0.5;
            }
            else if (peak > 9) {
                normalizestep = 2;
            }
            else {
                normalizestep = 1;
            }
    }

    axis.step = normalizestep * Math.pow(10, Math.floor(basePow));

    var axisMax = 0;
    var axisMin = 0;

    if (!isBrokenAxis) {
        if (signMin == signMax || signMin === 0 || signMax === 0) {
            axisMin = 0;
            axisMax = Math.ceil(absMax4calc * 1.05 / axis.step) * axis.step * (signAbsMax4calc);
        }
        else {
            axisMax = Math.ceil(max4calc * 1.05 / axis.step) * (axis.step);
            axisMin = Math.floor(((max4calc - (max4calc - min4calc) * 1.05)) / axis.step) * (axis.step);
        }
    }
    else {
        axisMin = Math.floor((absMin4calc - (absMax4calc - absMin4calc) / 2 )/ axis.step) * axis.step * signAbsMin4calc;
        axisMax = Math.ceil(((absMax4calc - absMin4calc) * 1.075 + absMin4calc) / axis.step) * axis.step * signAbsMax4calc ;
    }
    axis.min = Math.min(axisMin, axisMax);
    axis.max = Math.max(axisMin, axisMax);
    return axis;
};

c3_chart_internal_fn.findMinMax = function () {
    var $$ = this, data = $$.data.targets;
    var minY, maxY, minX, maxX;
    var i,j, id;

    // detect if we have stacked group
    var stacked = false;
    var groups = $$.api.groups();
    groups.forEach(function(elem){
        if(elem.length) {
            stacked = true;
        }
    });

    var stackedSum = [];

    var allData = $$.api.data();
    allData.forEach(function(v){
        if(!v)
            return;
        var data = v.values;

        // calc min/max for X axis
        for(i = 0; i < data.length; i++) {
            if (isUndefined(maxX) || data[i].x > maxX)
                maxX = data[i].x;
            if (isUndefined(minX) || data[i].x < minX)
                minX = data[i].x;
        }

        // calc min/max for Y axis
        for(i = 0; i < data.length; i++) {
            if (isUndefined(maxY) || data[i].value > maxY)
                maxY = data[i].value;
            if (isUndefined(minY) || data[i].value < minY)
                minY = data[i].value;
            // calc sum row for stacked
            if (stacked) {
                if (!stackedSum[i])
                    stackedSum[i] = 0;
                stackedSum[i] += data[i].value;
            }
        }
    });

    if (stacked) {
        for(i = 0; i < stackedSum.length; i++) {
            if (isUndefined(maxY) || stackedSum[i] > maxY)
                maxY = stackedSum[i];
            if (isUndefined(minY) || stackedSum[i] < minY)
                minY = stackedSum[i];
        }
    }

    return {minY: minY, maxY: maxY, minX: minX, maxX: maxX};
};

c3_chart_fn.axisLabelX = function(label) {
    var $$ = this.internal;

    if (!arguments.length) {
        if (isUndefined($$.config.axis_x_label))
            return undefined;
        return {text: $$.config.axis_x_label.text, position: $$.config.axis_x_label.position};
    }

    if(isUndefined(label)){
        $$.config.axis_x_label = {};
    } else {
        $$.config.axis_x_label.text = label.text;
        $$.config.axis_x_label.position = label.position;
    }

    $$.cachedRedraw({withLegend: true});
};

c3_chart_fn.axisLabelY = function(label) {
    var $$ = this.internal;

    if (!arguments.length) {
        if (isUndefined($$.config.axis_y_label))
            return undefined;
        return {text: $$.config.axis_y_label.text, position: $$.config.axis_y_label.position};
    }

    if(isUndefined(label)){
        $$.config.axis_y_label = {};
    } else {
        $$.config.axis_y_label.text = label.text;
        $$.config.axis_y_label.position = label.position;
    }

    $$.cachedRedraw({withLegend: true});
};

