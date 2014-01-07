// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
/*global desc, task, jake, fail, complete, directory*/
"use strict";

var jshint = require("./src/index.js");
var Mocha = require("mocha");

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
	var mocha = new Mocha({ui: "bdd"});
	testFiles().forEach(mocha.addFile.bind(mocha));

	var failures = false;
	mocha.run()
	.on("fail", function() {
		failures = true;
	}).on("end", function() {
		if (failures) fail("Tests failed");
		complete();
	});
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
