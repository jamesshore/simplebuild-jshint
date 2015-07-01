/* Copyright (c) 2012-2015 James Shore - See README.txt for license */
"use strict";

var jshint = require("jshint").JSHINT;
var fs = require("fs");

exports.validateSource = function(sourceCode, options, globals, name) {
	var pass = jshint(sourceCode, options, globals);
	if (!pass) reportErrors(name);
	return pass;
};

exports.validateFile = function(filename, options, globals) {
	var sourceCode = fs.readFileSync(filename, "utf8");
	return exports.validateSource(sourceCode, options, globals, filename);
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

function reportErrors(name) {
	// The errors from the last run are stored globally on the jshint object. Yeah.
	name = name ? name + " " : "";
	console.log("\n" + name + "failed");
	jshint.errors.forEach(function(error) {
		if (error === null) return;
		var evidence = (error.evidence !== undefined) ? ": " + error.evidence.trim() : "";

		console.log(error.line + evidence);
		console.log("   " + error.reason + " (" + error.code + ")");
	});
}

