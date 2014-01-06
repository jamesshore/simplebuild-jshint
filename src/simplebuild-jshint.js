// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var jshint = require("./jshint_runner.js");
var messages = require("./messages.js");

exports.checkCode = function checkCode(options, success, failure) {
	if (typeof options !== "object") return failure(messages.OPTIONS_MUST_BE_OBJECT);
	if (options === null) return failure(messages.OPTIONS_MUST_NOT_BE_NULL);
	if (options.code === undefined) return failure(messages.NO_CODE_OPTION);

	var passed = jshint.validateSource(options.code, options.options, options.globals);
	if (passed) success();
	else failure(messages.VALIDATION_FAILED);
};
exports.checkCode.title = messages.SOURCE_VALIDATOR_TITLE;
exports.checkCode.description = messages.SOURCE_VALIDATOR_DESCRIPTION;

exports.checkFiles = {};
exports.checkFiles.title = messages.FILE_VALIDATOR_TITLE;
exports.checkFiles.description = messages.FILE_VALIDATOR_DESCRIPTION;