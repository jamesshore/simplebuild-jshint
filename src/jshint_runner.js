// Copyright (c) 2012-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.

/* Run JSHint */

(function() {
	"use strict";

	var jshint = require("jshint").JSHINT;
	var fs = require("fs");
	var async = require("async");
	var errorTranslator = require("./error_translator.js");

	exports.validateSource = function(sourceCode, options, globals, name) {
		var pass = jshint(sourceCode, options, globals);
		if (!pass) reportErrors(name);
		return pass;
	};

	exports.validateFile = function(filename, options, globals) {
		var sourceCode = fs.readFileSync(filename, "utf8");
		return exports.validateSource(sourceCode, options, globals, filename);
	};

	exports.validateFileList = function(fileList, options, globals, callback) {
		try {
			var results = fileList.map(function(filename) {
				process.stdout.write(".");
				var sourceCode = fs.readFileSync(filename, "utf8");
				return exports.validateSource(sourceCode, options, globals, filename);
			});

			var pass = results.reduce(function(pass, result) {
				return pass && result;
			}, true);

			process.stdout.write("\n");
			return callback(null, pass);
		}
		catch (err) {
			return callback(err);
		}
	};

	//exports.validateFileList = function(fileList, options, globals, callback) {
	//	async.mapSeries(fileList, function(filename, mapCallback) {
	//		try {
	//			process.stdout.write(".");
	//			var sourceCode = fs.readFileSync(filename, "utf8");
	//			mapCallback(null, exports.validateSource(sourceCode, options, globals, filename));
	//		}
	//		catch (err) {
	//			mapCallback(err);
	//		}
	//	}, function(err, results) {
	//		if (err) {
	//			console.log(err.stack);
	//			return callback(false);
	//		}
	//
	//		var pass = results.reduce(function(pass, result) {
	//			return pass && result;
	//		}, true);
	//
	//		process.stdout.write("\n");
	//		return callback(pass);
	//	});
	//};


	function reportErrors(name) {
		// The errors from the last run are stored globally on the jshint object. Yeah.
		name = name ? name + " " : "";
		console.log("\n" + name + "failed");
		errorTranslator.translate(jshint.errors).forEach(function(errorLine) {
			console.log(errorLine);
		});
	}

})();