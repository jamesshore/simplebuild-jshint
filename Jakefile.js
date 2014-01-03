// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
/*global desc, task, jake, fail, complete, directory*/
"use strict";

var lint = require("./src/jshint_runner.js");

desc("Validate code (lint and test)");
task("default", ["lint"], function() {
	console.log("\n\nOK");
});

desc("Lint everything");
task("lint", function() {
	var passed = lint.validateFileList(lintFiles(), lintOptions(), {});
	if (!passed) fail("Lint failed");
});

function lintFiles() {
	var javascriptFiles = new jake.FileList();
	javascriptFiles.include("*.js");
	javascriptFiles.include("src/**/*.js");
	return javascriptFiles.toArray();
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