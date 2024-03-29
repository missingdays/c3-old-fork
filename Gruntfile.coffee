module.exports = (grunt) ->
    require('load-grunt-tasks') grunt, pattern: ['grunt-contrib-*', 'grunt-sass']

    grunt.initConfig
        watch:
          concat:
            tasks: 'concat'
            files: ['src/*.js']
          sass:
            tasks: 'sass'
            files: ['src/scss/*.scss']

        concat:
          dist:
            options:
              process: (src, filepath) ->
                if filepath != 'src/head.js' && filepath != 'src/tail.js'
                  lines = []
                  src.split('\n').forEach (line) ->
                    lines.push( (if line.length > 0 then '    ' else '') + line)
                  src = lines.join('\n')
                return src
            src: [
              'src/head.js',
              'src/buffer.js',
              'src/core.js',
              'src/config.js',
              'src/scale.js',
              'src/domain.js',
              'src/data.js',
              'src/data.convert.js',
              'src/data.load.js',
              'src/category.js',
              'src/interaction.js',
              'src/size.js',
              'src/shape.js',
              'src/shape.line.js',
              'src/shape.bar.js',
              'src/stacked.js',
              'src/text.js',
              'src/type.js',
              'src/grid.js',
              'src/tooltip.js',
              'src/legend.js',
              'src/title.js',
              'src/axis.js',
              'src/clip.js',
              'src/arc.js',
              'src/region.js',
              'src/drag.js',
              'src/selection.js',
              'src/subchart.js',
              'src/zoom.js',
              'src/color.js',
              'src/format.js',
              'src/cache.js',
              'src/callbacks.js',
              'src/class.js',
              'src/util.js',
              'src/lines.js',
              'src/api.focus.js',
              'src/api.title.js',
              'src/api.show.js',
              'src/api.zoom.js',
              'src/api.load.js',
              'src/api.flow.js',
              'src/api.selection.js',
              'src/api.transform.js',
              'src/api.group.js',
              'src/api.grid.js',
              'src/api.region.js',
              'src/api.data.js',
              'src/api.category.js',
              'src/api.color.js',
              'src/api.x.js',
              'src/api.axis.js',
              'src/api.legend.js',
              'src/api.chart.js',
              'src/api.tooltip.js',
              'src/c3.axis.js',
              'src/ua.js',
              'src/polyfill.js',
              'src/tail.js'
            ]
            dest: 'c3.js'

        jshint:
          c3: 'c3.js'
          spec: 'spec/*.js'
          options:
            jshintrc: '.jshintrc'

        jasmine:
          c3:
            src: 'c3.js'
            options:
              specs: 'spec/*-spec.js'
              helpers: 'spec/*-helper.js'
              styles: 'c3.css'
              vendor: 'bower_components/d3/d3.js'

        uglify:
          c3:
            files:
              'c3.min.js': 'c3.js'

        cssmin:
          c3:
            src: 'c3.css'
            dest: 'c3.min.css'

    grunt.registerTask 'default', ['concat', 'test', 'posttest']
    grunt.registerTask 'test', ['jasmine']
    grunt.registerTask 'build', ['concat', 'posttest']
    grunt.registerTask 'posttest', ['cssmin', 'uglify']
