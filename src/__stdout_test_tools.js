// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var assert = require("assert");

// This code inspired by http://userinexperience.com/?p=714

exports.override = function override(newStdout) {
	var stdout = new TestStdout();
	stdout.redirect(newStdout);
	return stdout.restore.bind(stdout);
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

var TestStdout = exports.TestStdout = function TestStdout(newFunction) {
	var original;
	this.redirect = function(newFunction) {
		assert.ok(!original, "Stdout already redirected");
		original = process.stdout.write;
		process.stdout.write = newFunction;
	};
	this.ignore = function() {
		this.redirect(function() {});
	};
	this.restore = function() {
		assert.ok(original, "Stdout not redirected");
		process.stdout.write = original;
		original = null;
	};
};