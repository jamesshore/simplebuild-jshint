// Copyright (c) 2014-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
/*global desc, task, jake, fail, complete, directory*/
"use strict";

var jshint = require("./src/index.js");
var mocha = require("./build/mocha_runner");

desc("Validate code (lint and test)");
task("default", ["lint", "test"], function() {
	console.log("\n\nOK");
});

desc("Lint everything");
task("lint", function() {
	jshint.checkFiles({
		files: [ "*.js", "src/**/*.js" ],
		options: lintOptions(),
		globals: lintGlobals()
	}, complete, fail);
}, { async: true });

desc("Run tests");
task("test", [], function() {
	mocha.runTests({
		files: "src/**/_*_test.js",
		options: {
			ui: "bdd",
			reporter: "dot"
		}
	}, complete, fail);
}, {async: true});

function testFiles() {
	var files = new jake.FileList();
	files.include("src/**/_*_test.js");
	return files.toArray();
}

function lintOptions() {
	return {
		bitwise: true,
		curly: false,
		eqeqeq: true,
		forin: true,
		immed: true,
		latedef: false,
		newcap: true,
		noarg: true,
		noempty: true,
		nonew: true,
		regexp: true,
		undef: true,
		strict: true,
		trailing: true,
		node: true
	};
}

function lintGlobals() {
	return {
		beforeEach: false,
		afterEach: false,
		describe: false,
		it: false
	};
}
