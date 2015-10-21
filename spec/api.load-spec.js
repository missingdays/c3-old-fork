describe('c3 api load', function () {
    'use strict';

    var chart, args;  
    args = {
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 5000, 2000, 1000, 4000, 1500, 2500]
            ]
        }
    };


    beforeEach(function (done) {
        chart = window.initChart(chart, args, done);
    });

    describe('indexed data', function () {

        describe('as column', function () {

            it('should load additional data', function (done) {
                var main = chart.internal.main,
                    legend = chart.internal.legend;
                chart.load({
                    columns: [
                        ['data3', 800, 500, 900, 500, 1000, 700]
                    ]
                });
                setTimeout(function () {
                    var target = main.select('.c3-chart-line.c3-target.c3-target-data3'),
                        legendItem = legend.select('.c3-legend-item.c3-legend-item-data3');
                    expect(target.size()).toBe(1);
                    expect(legendItem.size()).toBe(1);
                    done();
                }, 500);
            });

        });

    });

    describe('category data', function () {

        it('should update arg to category data', function () {
            args = {
                data: {
                    x: 'x',
                    columns: [
                        ['x', 'cat1', 'cat2', 'cat3', 'cat4', 'cat5', 'cat6'],
                        ['data1', 30, 200, 100, 400, 150, 250],
                        ['data2', 5000, 2000, 1000, 4000, 1500, 2500]
                    ]
                },
                axis: {
                    x: {
                        type: 'category'
                    }
                }
            };
            expect(true).toBeTruthy();
        });

        describe('as column', function () {

            it('should load additional data', function (done) {
                var main = chart.internal.main,
                    legend = chart.internal.legend;
                chart.load({
                    columns: [
                        ['x', 'new1', 'new2', 'new3', 'new4', 'new5', 'new6'],
                        ['data3', 800, 500, 900, 500, 1000, 700]
                    ]
                });
                setTimeout(function () {
                    var target = main.select('.c3-chart-line.c3-target.c3-target-data3'),
                        legendItem = legend.select('.c3-legend-item.c3-legend-item-data3'),
                        tickTexts = main.selectAll('.c3-axis-x g.tick text'),
                        expected = ['new1', 'new2', 'new3', 'new4', 'new5', 'new6'];
                    expect(target.size()).toBe(1);
                    expect(legendItem.size()).toBe(1);
                    tickTexts.each(function (d, i) {
                        var text = d3.select(this).select('tspan').text();
                        expect(text).toBe(expected[i]);
                    });
                    done();
                }, 500);
            });

        });

    });

    describe('appendToColumn', function(){
        it('should append values to existing column', function(done){
            chart.loadColumns([['data1', 0, 100, 200]]);
            chart.appendToColumn(['data1', 300, 400, 500]);

            setTimeout(function(){
                var data = chart.getDataById('data1');
                for(var i = 0; i < data.length; i++){
                    expect(data[i].value).toBe(i*100);
                }

                done();
            }, 500);
        });

        it('should append values to non-existing column', function(done){
            chart.appendToColumn(['data5', 0, 100, 200, 300]);

            setTimeout(function(){
                var data = chart.getDataById('data5');
                for(var i = 0; i < data.length; i++){
                    expect(data[i].value).toBe(i*100);
                }

                done();
            }, 500);
        });
    });

    describe("popFromColumn", function(){
        it("should pop values from column", function(done){
            chart.loadColumns([['data1', 0, 100, 200, 300]]);
            chart.loadColumns([['data2', 0, -100, -200, -300]]);

            chart.popFromColumn('data1', 1);
            chart.popFromColumn('data2', 3);

            setTimeout(function(){
                var data1 = chart.getDataById('data1');
                var data2 = chart.getDataById('data2');

                expect(data1.length).toBe(3);
                expect(data2.length).toBe(1);

                for(var i = 0; i < data1.length; i++){
                    expect(data1[i].value).toBe(i*100);
                }
                for(i = 0; i < data2.length; i++){
                    expect(data2[i].value).toBe(-i*100);
                }

                done();
            }, 500);
        });

        it("should throw when non-existing sequence given", function(done){
            expect(function(){
                chart.popFromColumn('data2015', 2);
            }).toThrow();
            done();
        });

        it("shouldn't throw when popping more values than there is", function(done){
            chart.loadColumns([['data1', 10, 20]]);

            chart.popFromColumn('data1', 3);
            expect(chart.getDataById('data1').length).toBe(0);

            chart.popFromColumn('data1', 2);
            expect(chart.getDataById('data1').length).toBe(0);

            done();
        });

    });

    describe("getValue", function(){
        it("should get value", function(done){
            chart.loadColumns([['data1', 100, 200], ['data2', 200, 300]]);

            expect(chart.getValue('data1', 0)).toBe(100);
            expect(chart.getValue('data1', 1)).toBe(200);
            expect(chart.getValue('data2', 0)).toBe(200);
            expect(chart.getValue('data2', 1)).toBe(300);

            done();
        });

        it("should return undefined when not found", function(done){
            chart.loadColumns([['data1', 100], ['data2', 200, 300]]);

            expect(chart.getValue('data1', 1)).toBe(undefined);
            expect(chart.getValue('data2', 2)).toBe(undefined);

            done();
        });
    });

    describe("setValue", function(){
        it("should set value", function(done){
            chart.loadColumns([['data1', 0, 100, 200], ['data2', 0, -100]]);

            chart.setValue('data1', 0, 200);
            chart.setValue('data2', 1, 100);

            expect(chart.getValue('data1', 0)).toBe(200);
            expect(chart.getValue('data2', 1)).toBe(100);

            done();
        });

        it("should throw when setting to non-existing sequence", function(done){
            expect(function(){
                chart.setValue('not presented', 0, 1);
            }).toThrow();

            done();
        });

        it("should append value if set to higher point", function(done){
            chart.loadColumns([['data1', 0]]);

            chart.setValue('data1', 10, 100);
            chart.setValue('data1', 2, 200);

            var data = chart.getDataById('data1');
            expect(data.length).toBe(3);

            for(var i = 0; i < 3; i++){
                expect(data[i].value).toBe(i*100);
            }

            done();
        });
    });

});
