c3_chart_internal_fn.load = function (targets, args) {
    var $$ = this;
    if (targets) {
        // filter loading targets if needed
        if (args.filter) {
            targets = targets.filter(args.filter);
        }
        // set type if args.types || args.type specified
        if (args.type || args.types) {
            targets.forEach(function (t) {
                $$.setTargetType(t.id, args.types ? args.types[t.id] : args.type);
            });
        }
        // Update/Add data
        $$.data._targets.forEach(function (d) {
            for (var i = 0; i < targets.length; i++) {
                if (d.id === targets[i].id) {
                    d.values = targets[i].values;
                    targets.splice(i, 1);
                    break;
                }
            }
        });
        $$.data._targets = $$.data._targets.concat(targets); // add remained
        $$.data.targets = $$.normalize($$.data._targets);
    }

    // Set targets
    $$.updateTargets($$.data.targets);

    $$.tuneAxis();
    // Redraw with new targets
    $$.redraw({withUpdateOrgXDomain: true, withUpdateXDomain: true, withLegend: true});

    if (args && args.done) { args.done(); }
};
c3_chart_internal_fn.loadFromArgs = function (args) {
    var $$ = this;
    if (args.data) {
        $$.load($$.convertDataToTargets(args.data), args);
    }
    else if (args.url) {
        $$.convertUrlToData(args.url, args.mimeType, args.keys, function (data) {
            $$.load($$.convertDataToTargets(data), args);
        });
    }
    else if (args.json) {
        $$.load($$.convertDataToTargets($$.convertJsonToData(args.json, args.keys)), args);
    }
    else if (args.rows) {
        $$.load($$.convertDataToTargets($$.convertRowsToData(args.rows)), args);
    }
    else if (args.columns) {
        $$.load($$.convertDataToTargets($$.convertColumnsToData(args.columns)), args);
    }
    else {
        $$.load(null, args);
    }
};
c3_chart_internal_fn.unload = function (targetIds, done) {
    var $$ = this;
    if (!done) {
        done = function () {};
    }
    // filter existing target
    targetIds = targetIds.filter(function (id) { return $$.hasTarget($$.data._targets, id); });
    // If no target, call done and return
    if (!targetIds || targetIds.length === 0) {
        done();
        return;
    }
    $$.svg.selectAll(targetIds.map(function (id) { return $$.selectorTarget(id); }))
        .transition()
        .style('opacity', 0)
        .remove()
        .call($$.endall, done);
    targetIds.forEach(function (id) {
        // Reset fadein for future load
        $$.withoutFadeIn[id] = false;
        // Remove target's elements
        if ($$.legend) {
            $$.legend.selectAll('.' + CLASS.legendItem + $$.getTargetSelectorSuffix(id)).remove();
        }
        // Remove target
        $$.data._targets = $$.data._targets.filter(function (t) {
            return t.id !== id;
        });
        $$.data.targets = $$.normalize($$.data._targets);
    });
};
