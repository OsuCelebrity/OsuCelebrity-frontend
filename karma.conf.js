// Karma configuration
// Generated on Wed Mar 02 2016 20:33:28 GMT-0800 (Pacific Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/js/jquery-1.8.2.min.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-route/angular-route.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/app.js',
      'app/config.js',
      'app/components/**/*.js',
      'app/tests/**/*.js',

      //Template preprocessing
      'app/components/**/*.html'
    ],


    // list of files to exclude
    exclude: [
      
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'app/components/**/*.html': ['ng-html2js'],
      'app/components/**/*.js': ['coverage', 'jshint'],
      'app/app.js': ['coverage', 'jshint']
    },

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-ng-html2js-preprocessor'
      //'karma-jshint-preprocessor'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    ngHtml2JsPreprocessor: {
      stripPrefix: 'app/',

      moduleName: 'templates'
    },

    coverageReporter: {
      reporters: [
        { type: 'text'},
        { type: 'json', subdir: '.'},
        { type: 'lcovonly', subdir: '.'}
      ]
    },

    junitReporter: {
      outputFile: 'test-results/junit-results.xml'
    },

    jshintPreprocessor: {
      jshintrc: './.jshintrc'
    }
  })
}
