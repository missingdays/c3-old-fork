describe("c3 chart", function(){
    'use strict';
    var chart;
    var args = {
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

    describe("colorPattern", function(){
        it("should update pattern", function(){
            chart.colorPattern(['#fff', '#000', '#fff', '#fff']);

            expect(chart.color("data1")).toBe("#fff");
            expect(chart.color("data2")).toBe("#000");
        });
    });
});
