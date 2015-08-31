module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            default: {
                src: [
                    'dist'
                ]
            }
        },
        copy: {
            bower: {
                src: [
                ],
                dest: 'examples',
                expand: true,
                flatten: true
            }
        },
        concat: {
            build: {
                src : [
                    'src/vector3.js',
                    'src/**/*.js'
                ],
                dest: 'build/built.js',
                options: {
                    process: function (src, filepath) {
                        return '// Begin Source: ' + filepath + '\n' + src + ' \n// End Source; ' + filepath + '\n';
                    }
                }
            },
            dist: {
                options: {
                    stripBanners: true,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %> ' +
                        '| (c) 2014 Chris Hafey | https://github.com/chafey/cornerstoneMath */\n'
                },
                src : ['build/built.js'],
                dest: 'dist/cornerstoneMath.js'
            }
        },
        uglify: {
            dist: {
                files: {
                    'dist/cornerstoneMath.min.js': ['dist/cornerstoneMath.js']
                }
            },
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> ' +
                    '| (c) 2014 Chris Hafey | https://github.com/chafey/cornerstoneMath */\n'
            }
        },
        qunit: {
            all: ['test/*.html']
        },
        jshint: {
            files: [
                'src/**/*.js'
            ]
        },
        watch: {
            scripts: {
                files: ['src/**/*.js', 'test/*.js'],
                tasks: ['concat:build', 'concat:dist', 'jshint']
            }
        },

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('buildAll', ['copy', 'concat:build', 'concat:dist', 'uglify', 'jshint']);
    grunt.registerTask('default', ['clean', 'buildAll']);
};


// Release process:
//  1) Update version numbers
//  2) do a build (needed to update dist versions with correct build number)
//  3) commit changes
//      git commit -am "Changes...."
//  4) tag the commit
//      git tag -a 0.1.0 -m "Version 0.1.0"
//  5) push to github
//      git push origin master --tags