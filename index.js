'use strict';

var through = require('through2');
var gutil = require('gulp-util');
var ejs = require('ejs');

//module.exports = function (options, settings) {
module.exports = function (_data, _options) {
  var data = _data || {},
      options = _options || {};

  options.ext = typeof options.ext === 'undefined' ? '.html' : options.ext;

  return through.obj(function (file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit(
        'error',
        new gutil.PluginError('gulp-ejs', 'Streaming not supported')
      );
    }

    data.filename = options.filename = file.path;
    try {
      file.contents = new Buffer(ejs.render(file.contents.toString(), data, options));
      file.path = gutil.replaceExtension(file.path, options.ext);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-ejs', err.toString()));
    }

    this.push(file);
    cb();
  });
};
