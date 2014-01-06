// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var fs = require("fs");
var assert = require("assert");

var testRoot = "temp_files/file-list-validation.js-";

exports.write = function write() {
	var testFiles = [];

	for (var i = 0; i < arguments.length - 1; i++) {
		var testFile = testRoot + i;
		fs.writeFileSync(testFile, arguments[i]);
		testFiles.push(testFile);
	}
	var callback = arguments[arguments.length - 1];

	callback(testFiles);

	testFiles.forEach(function(testFile) {
		fs.unlinkSync(testFile);
		assert.ok(!fs.existsSync(testFile), "Could not delete test file: " + testFile);
	});
};