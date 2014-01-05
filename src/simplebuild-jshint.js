// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var jshint = require("./jshint_runner.js");
var messages = require("./messages.js");

exports.checkSource = function checkSource(options, success, failure) {
	if (options.code === undefined) return failure(messages.NO_CODE_OPTION);

	var passed = jshint.validateSource(options.code);
	if (passed) success();
	else failure(messages.VALIDATION_FAILED);
};