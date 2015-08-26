// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

/* Provide simplebuild API */

//var simplebuild = require("../../core/lib/simplebuild");
var simplebuild = require("simplebuild");
var jshint = require("./jshint_runner.js");
var messages = require("./messages.js");

var DEFAULT_OPTIONS = {
	options: {},
	globals: {}
};

exports.checkFiles = function checkFiles(userOptions, succeed, fail) {
	try {
		var types = {
			files: [String, Array],
			options: Object,
			globals: Object
		};
		var options = simplebuild.normalizeOptions(userOptions, DEFAULT_OPTIONS, types);

		//if (typeof userOptions !== "object") return fail(messages.OPTIONS_MUST_BE_OBJECT);
		//if (userOptions === null) return fail(messages.OPTIONS_MUST_NOT_BE_NULL);
		//if (userOptions.files === undefined) return fail(messages.NO_FILES_OPTION);

		var files = simplebuild.deglobSync(options.files);

		var passed = jshint.validateFileList(files, options.options, options.globals);
		if (passed) succeed();
		else fail(messages.VALIDATION_FAILED);
	}
	catch (err) {
		return fail(err.message);
	}
};
//exports.checkFiles.descriptors = messages.FILE_LIST_VALIDATOR_DESCRIPTORS;


exports.checkOneFile = function checkOneFile(userOptions, succeed, fail) {
	try {
		var types = {
			file: String,
			options: Object,
			globals: Object
		};
		var options = simplebuild.normalizeOptions(userOptions, DEFAULT_OPTIONS, types);

		//if (typeof options !== "object") return fail(messages.OPTIONS_MUST_BE_OBJECT);
		//if (options === null) return fail(messages.OPTIONS_MUST_NOT_BE_NULL);
		//if (options.file === undefined) return fail(messages.NO_FILE_OPTION);

		var passed = jshint.validateFile(options.file, options.options, options.globals);
		if (passed) succeed();
		else fail(messages.VALIDATION_FAILED);
	}
	catch (err) {
		return fail(err.message);
	}
};
//exports.checkOneFile.descriptors = messages.ONE_FILE_VALIDATOR_DESCRIPTORS;


exports.checkCode = function checkCode(userOptions, succeed, fail) {
	try {
		var types = {
			code: String,
			options: Object,
			globals: Object
		};
		var options = simplebuild.normalizeOptions(userOptions, DEFAULT_OPTIONS, types);

		//if (typeof options !== "object") return fail(messages.OPTIONS_MUST_BE_OBJECT);
		//if (options === null) return fail(messages.OPTIONS_MUST_NOT_BE_NULL);
		//if (options.code === undefined) return fail(messages.NO_CODE_OPTION);

		var passed = jshint.validateSource(options.code, options.options, options.globals);
		if (passed) succeed();
		else fail(messages.VALIDATION_FAILED);
	}
	catch (err) {
		return fail(err.message);
	}
};
//exports.checkCode.descriptors = messages.SOURCE_VALIDATOR_DESCRIPTORS;
