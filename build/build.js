#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const Concat = require('concat-with-sourcemaps');
const srcDir = path.join(__dirname, '../src/');
const concat = new Concat(true, 'threex.toolkit.js', '\n');
const UglifyJS = require("uglify-js");

concat.add(null, "// (c) Austin Gray");
fs.readdir(srcDir, (err, files) => {
  if (err) {
    throw new Error(err);
  }
  files.forEach((file) => {
    concat.add( `./build/${file}`, fs.readFileSync(srcDir + file) ); // eslint-disable-line no-sync
  });

  fs.writeFile( './dist/threex.toolkit.js', concat.content, function(err) {
    if (err) {
      throw new Error(err);
    }
    // minify
    var result = UglifyJS.minify( './dist/threex.toolkit.js' ).code;
    fs.writeFile( './dist/threex.toolkit.min.js', result, function(err) {
      if (err) {
        throw new Error(err);
      }
    } );
  });
});
