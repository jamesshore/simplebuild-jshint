// Copyright (c) 2012-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.

/* Run JSHint and print results to console */

(function() {
	"use strict";

	var jshintWrapper = require("./forkable_jshint_wrapper");
	var fs = require("fs");
	var async = require("async");
	var errorTranslator = require("./error_translator.js");

	var MAX_PARALLEL_FILE_READS = 25;

	exports.validateSource = function(sourceCode, options, globals, name, callback) {
		var parameters = {
			sourceCode: sourceCode,
			options: options,
			globals: globals
		};

		jshintWrapper(parameters, function(err, result) {
			if (err) return callback(err);

			if (!result.pass) reportErrors(result.errors, name);
			return callback(null, result.pass);
		});
	};

	exports.validateFile = function(filename, options, globals, callback) {
		fs.readFile(filename, "utf8", function(err, sourceCode) {
			if (err) return callback(err);

			exports.validateSource(sourceCode, options, globals, filename, callback);
		});
	};

	exports.validateFileList = function(fileList, options, globals, callback) {
		async.mapLimit(fileList, MAX_PARALLEL_FILE_READS, mapIt, reduceIt);

		function mapIt(filename, mapItCallback) {
			fs.readFile(filename, "utf8", function(err, sourceCode) {
				if (err) return mapItCallback(err);

				process.stdout.write(".");
				exports.validateSource(sourceCode, options, globals, filename, mapItCallback);
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