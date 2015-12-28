// Copyright (c) 2012-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.

/* Run JSHint and print output to console */

(function() {
	"use strict";

	var jshintWrapper = require("./forkable_jshint_wrapper");
	var fs = require("fs");
	var async = require("async");
	var errorTranslator = require("./error_translator.js");

	var MAX_PARALLEL_FILE_READS = 25;

	exports.validateSource = function(sourceCode, options, globals, name) {
		var result;
		var parameters = {
			sourceCode: sourceCode,
			options: options,
			globals: globals
		};

		// jshintWrapper is actually synchronous, which lets us get away with some shenanigans.
		// We need to make it work asynchronously before we can implement forking, but that
		// requires us to make validateSource work asynchronously first.
		jshintWrapper(parameters, function(err, callbackResult) {
			result = callbackResult;
		});
		if (!result.pass) reportErrors(result.errors, name);
		return result.pass;
	};

	exports.validateFile = function(filename, options, globals) {
		var sourceCode = fs.readFileSync(filename, "utf8");
		return exports.validateSource(sourceCode, options, globals, filename);
	};

	exports.validateFileList = function(fileList, options, globals, callback) {
		async.mapLimit(fileList, MAX_PARALLEL_FILE_READS, mapIt, reduceIt);

		function mapIt(filename, mapCallback) {
			fs.readFile(filename, "utf8", function(err, sourceCode) {
				process.stdout.write(".");
				if (err) return mapCallback(err);
				return mapCallback(null, exports.validateSource(sourceCode, options, globals, filename));
			});
		}

		function reduceIt(err, results) {
			if (err) return callback(err);

			var pass = results.reduce(function(pass, result) {
				return pass && result;
			}, true);

			process.stdout.write("\n");
			return callback(null, pass);
		}
	};

	function reportErrors(errors, name) {
		name = name ? name + " " : "";
		console.log("\n" + name + "failed");
		errorTranslator.translate(errors).forEach(function(errorLine) {
			console.log(errorLine);
		});
	}

})();