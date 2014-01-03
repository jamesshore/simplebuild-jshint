/* Copyright (c) 2012 James Shore - See README.txt for license */
"use strict";

var jshint = require("jshint").JSHINT;
var fs = require("fs");

exports.validateSource = function(sourceCode, options, globals, description) {
	description = description ? description + " " : "";
	var pass = jshint(sourceCode, options, globals);
	if (!pass) {
		console.log("\n" + description + "failed");
		jshint.errors.forEach(function(error) {
			console.log(error.line + ": " + error.evidence.trim());
			console.log("   " + error.reason);
		});
	}
	return pass;
};

exports.validateFileList = function(fileList, options, globals) {
	var pass = true;
	fileList.forEach(function(filename) {
		process.stdout.write(".");
		var sourceCode = fs.readFileSync(filename, "utf8");
		pass = exports.validateSource(sourceCode, options, globals, filename) && pass;
	});
	process.stdout.write("\n");
	return pass;
};