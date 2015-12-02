
describe('c3 stacked', function () {
    'use strict';

    var chart, d3;

    var args = {
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250],
                ['data2', 50, 20, 10, 40, 15, 25],
                ['data3', 150, 120, 110, 140, 115, 125]
            ],
            type: 'column'
        },
        normalized: true
    };

    beforeEach(function (done) {
        chart = window.initChart(chart, args, done);
    });

    it("should sum to 1", function(done){
        var data = chart.data();
        for(var i = 0; i < 6; i++){
            var s = 0;

            data.forEach(function(column){
                s += column.values[i].value;
            });

            expect(s).toBeCloseTo(1);
        }

        done();
    });

    it("should sum to 1 even with big data", function(done){
        chart.load({
            columns:
                [
                    ['data1', 1, 1, 1, 1, 100, 20],
                    ['data2', 100, 1, 1, 1, 1, 0.1],
                    ['data3', 1, 1000, 1, 1, 1, 0.1]
                ]
        });

        var data = chart.data();
        
        for(var i = 0; i < 6; i++){
            var s = 0;

            data.forEach(function(column){
                s += column.values[i].value;
            });

            expect(s).toBeCloseTo(1);
        }

        done();

    });

});


