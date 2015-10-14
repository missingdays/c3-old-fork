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

    describe("width", function(){
        it("should get width when no arguments given", function(done){
            // Just some unusual number
            chart.resize({ width: 1087, height: 1087 });
    
            wait(function(){
                expect(chart.width()).toBe(1087);
                done();
            });
        });

        it("should set width", function(done){
            chart.width(1087);

            wait(function(){
                expect(chart.width()).toBe(1087);
                done();
            });
        });
    });

    describe("height", function(){
        it("should get height when no arguments given", function(done){
            // Just some unusual number
            chart.resize({ width: 1087, height: 1087 });
    
            wait(function(){
                expect(chart.height()).toBe(1087);
                done();
            });
        });

        it("should set height", function(done){
            chart.height(1087);

            wait(function(){
                expect(chart.height()).toBe(1087);
                done();
            });
        });
    });

});
