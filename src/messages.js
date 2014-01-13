// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

// General messages
exports.VALIDATION_FAILED = "JSHint failed.";
exports.OPTIONS_MUST_BE_OBJECT = "Options parameter must be an object.";
exports.OPTIONS_MUST_NOT_BE_NULL = "Options parameter must not be null.";

// Source validator
exports.NO_CODE_OPTION = "Need 'code' option containing source code to check.";
exports.SOURCE_VALIDATOR_DESCRIPTORS = {
	title: "JSHint Source Validator",
	description: "Check JavaScript source code for common errors."
};

// File validator
exports.NO_FILES_OPTION = "Need 'files' option containing array of filenames (or globs) to check.";
exports.FILE_VALIDATOR_DESCRIPTORS = {
	title: "JSHint File Validator",
	description: "Check JavaScript files for common errors."
};
