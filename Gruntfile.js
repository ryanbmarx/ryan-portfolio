module.exports = function(grunt) {
  var config = {};

  // Put your JavaScript library dependencies here. e.g. jQuery, underscore,
  // etc.
  // You'll also have to install them using a command similar to:
  //     npm install --save jquery
  var VENDOR_LIBRARIES = [
    "@fortawesome/fontawesome-pro-solid",
    "@fortawesome/fontawesome-pro-regular",
    "@fortawesome/fontawesome-pro-light",
    "@fortawesome/fontawesome-free-brands"
  ];

  config.browserify = {
    options: {
      browserifyOptions: {
        debug: true
      }
    },
    app: {
      src: ['js/src/app.js'],
      dest: 'js/app.min.js',
      options: {
        plugin: [
          [
            'minifyify', {
              map: 'app.min.js.map',
              output: './js/app.min.js.map'
            }
          ]
        ],
        transform: [
          [
            'babelify', {
              "presets": [
                ["env", {
                  "targets": {
                    "browsers": ["last 2 versions", "ie >= 12"]
                  }
                }]
              ]
            }
          ]
        ]
      }
    }
  };

  // Check if there are vendor libraries and build a vendor bundle if needed
  if (VENDOR_LIBRARIES.length) {
    config.browserify.app.options = config.browserify.app.options || {};
    config.browserify.app.options.exclude = VENDOR_LIBRARIES;

    config.browserify.vendor = {
      src: [],
      dest: 'js/vendor.min.js',
      options: {
        plugin: [
          [
            'minifyify', {
              map: 'vendor.min.js.map',
              output: './js/vendor.min.js.map'
            }
          ],
        ],
        transform: ['rollupify'],
        require: VENDOR_LIBRARIES
      }
    };
  }

  config.sass = {
    options: {
      outputStyle: 'compressed',
      sourceMap: true,
      includePaths: [ 'sass/']
    },
    app: {
      files: {
        'css/styles.css': 'sass/styles.scss'
      }
    }
  };

  config.postcss = {
    options: {
      processors: [
        require('autoprefixer')({
          browsers: [
           'last 2 versions',
           'ie >= 12'
          ]
        }) 
      ]
    },
    dist: {
      src: 'css/*.css'
    }
  }
 
 config.svgstore = {
    options: {
      cleanup:true,
      cleanupdefs:true
    },
    min: {
      // Target-specific file lists and/or options go here. 
      src:['img/src/**/*.svg'],
      dest:'img/sprite.svg'
    },
  };

  config.watch = {
    sass: {
      files: ['sass/**/*.scss'],
      tasks: ['sass', 'postcss']
    },
    js: {
      files: ['js/src/**/*.js'],
      tasks: ['browserify:app']
    },
    svg: {
      files: ['img/src/**/*.svg'],
      tasks: ['svgstore']
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-svgstore');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-postcss');

  var defaultTasks = [];

  defaultTasks.push('svgstore');
  defaultTasks.push('sass');
  defaultTasks.push('browserify');
  defaultTasks.push('postcss');

  grunt.registerTask('default', defaultTasks);
};
