c3_chart_internal_fn.setTargetType = function (targetIds, type) {
    var $$ = this, config = $$.config;
    $$.mapToTargetIds(targetIds).forEach(function (id) {
        $$.withoutFadeIn[id] = (type === config[__data_types][id]);
        config[__data_types][id] = type;
    });
    if (!targetIds) {
        config[__data_type] = type;
    }
};
c3_chart_internal_fn.hasType = function (type, targets) {
    var $$ = this, types = $$.config[__data_types], has = false;
    (targets || $$.data.targets).forEach(function (t) {
        if ((types[t.id] && types[t.id].indexOf(type) >= 0) || (!(t.id in types) && type === 'line')) {
            has = true;
        }
    });
    return has;
};
c3_chart_internal_fn.hasArcType = function (targets) {
    return this.hasType('pie', targets) || this.hasType('donut', targets) || this.hasType('gauge', targets);
};
c3_chart_internal_fn.isLineType = function (d) {
    var config = this.config, id = isString(d) ? d : d.id;
    return !config[__data_types][id] || ['line', 'spline', 'area', 'area-spline', 'step', 'area-step'].indexOf(config[__data_types][id]) >= 0;
};
c3_chart_internal_fn.isStepType = function (d) {
    var id = isString(d) ? d : d.id;
    return ['step', 'area-step'].indexOf(this.config[__data_types][id]) >= 0;
};
c3_chart_internal_fn.isSplineType = function (d) {
    var id = isString(d) ? d : d.id;
    return ['spline', 'area-spline'].indexOf(this.config[__data_types][id]) >= 0;
};
c3_chart_internal_fn.isAreaType = function (d) {
    var id = isString(d) ? d : d.id;
    return ['area', 'area-spline', 'area-step'].indexOf(this.config[__data_types][id]) >= 0;
};
c3_chart_internal_fn.isBarType = function (d) {
    var id = isString(d) ? d : d.id;
    return this.config[__data_types][id] === 'bar';
};
c3_chart_internal_fn.isScatterType = function (d) {
    var id = isString(d) ? d : d.id;
    return this.config[__data_types][id] === 'scatter';
};
c3_chart_internal_fn.isPieType = function (d) {
    var id = isString(d) ? d : d.id;
    return this.config[__data_types][id] === 'pie';
};
c3_chart_internal_fn.isGaugeType = function (d) {
    var id = isString(d) ? d : d.id;
    return this.config[__data_types][id] === 'gauge';
};
c3_chart_internal_fn.isDonutType = function (d) {
    var id = isString(d) ? d : d.id;
    return this.config[__data_types][id] === 'donut';
};
c3_chart_internal_fn.isArcType = function (d) {
    return this.isPieType(d) || this.isDonutType(d) || this.isGaugeType(d);
};
c3_chart_internal_fn.lineData = function (d) {
    return this.isLineType(d) ? [d] : [];
};
c3_chart_internal_fn.arcData = function (d) {
    return this.isArcType(d.data) ? [d] : [];
};
/* not used
 function scatterData(d) {
 return isScatterType(d) ? d.values : [];
 }
 */
c3_chart_internal_fn.barData = function (d) {
    return this.isBarType(d) ? d.values : [];
};
c3_chart_internal_fn.lineOrScatterData = function (d) {
    return this.isLineType(d) || this.isScatterType(d) ? d.values : [];
};
c3_chart_internal_fn.barOrLineData = function (d) {
    return this.isBarType(d) || this.isLineType(d) ? d.values : [];
};