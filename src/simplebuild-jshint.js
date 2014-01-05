// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var jshint = require("./jshint_runner.js");

exports.checkSource = function checkSource(options, success, failure) {
	if (options.code === undefined) return failure("Need 'code' option containing source code to check.");

	var passed = jshint.validateSource(options.code);
	if (passed) success();
	else failure("JSHint failed.");
};