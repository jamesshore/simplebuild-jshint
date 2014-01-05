// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var assert = require("assert");

// This code inspired by http://userinexperience.com/?p=714
exports.override = function override(newStdout) {
	var original = process.stdout.write;
	process.stdout.write = newStdout;
	return function() {
		process.stdout.write = original;
	};
};

exports.ignore = function ignore() {
	return exports.override(function() {});
};

exports.inspect = function inspect(callback) {
	var output = [];
	var restoreStdout = exports.override(function(string) {
		output.push(string);
	});
	callback(output);
	restoreStdout();
};
