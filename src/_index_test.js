// Copyright (c) 2014-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var assert = require("./assert.js");
var jshint = require("./index.js");
var messages = require("./messages.js");
var stdout = require("test-console").stdout;
var testFiles = require("./__test_files.js");

describe("Simplebuild module", function() {

	var restoreStdout;
	var successArgs;
	var failureArgs;

	beforeEach(function() {
		successArgs = null;
		failureArgs = null;
		restoreStdout = stdout.ignore();
	});

	afterEach(function() {
		restoreStdout();
	});

	describe("source validator", function() {

		//it("has descriptors", function() {
		//	expect(jshint.checkCode.descriptors).to.eql(messages.SOURCE_VALIDATOR_DESCRIPTORS);
		//});

		it("calls success() callback on success", function() {
			jshint.checkCode({
				code: "var a = 1;"
			}, success, failure);
			assertSuccess();
		});

		it("calls failure() callback on failure", function() {
			jshint.checkCode({
				code: "bargledy-bargle"
			}, success, failure);
			assertFailure(messages.VALIDATION_FAILED);
		});

		it("passes 'options' option through to JSHint", function() {
			jshint.checkCode({
				code: "a = 1;",
				options: { undef: true },
			}, success, failure);
			assertFailure(messages.VALIDATION_FAILED);
		});

		it("passes 'global' option through to JSHint", function() {
			jshint.checkCode({
				code: "a = 1;",
				options: { undef: true },
				globals: { a: true }
			}, success, failure);
			assertSuccess();
		});

		it("fails when no code is provided", function() {
			jshint.checkCode({}, success, failure);
			assertFailure();
		});

		it("fails when option variable isn't an object", function() {
			jshint.checkCode("foo", success, failure);
			assertFailure();
		});

		it("fails when option variable is null", function() {
			jshint.checkCode(null, success, failure);
			assertFailure();
		});
	});

	describe("single file validator", function() {
		//it("has descriptors", function() {
		//	expect(jshint.checkOneFile.descriptors).to.eql(messages.ONE_FILE_VALIDATOR_DESCRIPTORS);
		//});

		it("calls success() callback on success", function() {
			testFiles.writeSync("var a = 1;", function(filenames) {
				jshint.checkOneFile({
					file: filenames[0]
				}, success, failure);
				assertSuccess();
			});
		});

		it("calls failure() callback on failure", function() {
			testFiles.writeSync("why must you torment me so?", function(filenames) {
				jshint.checkOneFile({
					file: filenames[0]
				}, success, failure);
			});
			assertFailure(messages.VALIDATION_FAILED);
		});

		it("passes 'options' option through to JSHint", function() {
			testFiles.writeSync("a = 1;", function(filenames) {
				jshint.checkOneFile({
					file: filenames[0],
					options: { undef: true },
				}, success, failure);
				assertFailure(messages.VALIDATION_FAILED);
			});
		});

		it("passes 'global' option through to JSHint", function() {
			testFiles.writeSync("a = 1;", function(filenames) {
				jshint.checkOneFile({
					file: filenames[0],
					options: { undef: true },
					globals: { a: true }
				}, success, failure);
				assertSuccess();
			});
		});

		it("fails when no file is provided", function() {
			jshint.checkOneFile({}, success, failure);
			assertFailure();
		});

		it("fails when option variable isn't an object", function() {
			jshint.checkOneFile("foo", success, failure);
			assertFailure();
		});

		it("fails when option variable is null", function() {
			jshint.checkOneFile(null, success, failure);
			assertFailure();
		});

		it("fails when file doesn't exist", function() {
			jshint.checkOneFile({
				file: "no-such-file.js"
			}, success, failure);
			assertFailure("ENOENT: no such file or directory, open 'no-such-file.js'");
		});
	});

	describe("file list validator", function() {
		//it("has descriptors", function() {
		//	expect(jshint.checkFiles.descriptors).to.eql(messages.FILE_LIST_VALIDATOR_DESCRIPTORS);
		//});

		it("calls success() callback on success", function(done) {
			var files = testFiles.write("var a = 1;");
			jshint.checkFiles({
				files: files.filenames
			}, expectSuccess(done, files), expectNoFailure(done, files));
		});

		it("calls failure() callback on failure", function(done) {
			var files = testFiles.write("bargledy-bargle");
			jshint.checkFiles({
				files: files.filenames
			}, expectNoSuccess(done, files), expectFailure(done, files, messages.VALIDATION_FAILED));
		});

		it("supports globs", function(done) {
			var files = testFiles.write("var a = 1;", "bargledy-bargle");
			jshint.checkFiles({
				files: [ "temp_files/*" ]
			}, expectNoSuccess(done, files), expectFailure(done, files, messages.VALIDATION_FAILED));
		});

		it("passes 'options' option through to JSHint", function(done) {
			var files = testFiles.write("a = 1;");
			jshint.checkFiles({
				files: files.filenames,
				options: { undef: true }
			}, expectNoSuccess(done, files), expectFailure(done, files, messages.VALIDATION_FAILED));
		});

		it("passes 'global' option through to JSHint", function(done) {
			var files = testFiles.write("a = 1;");
			jshint.checkFiles({
				files: files.filenames,
				options: { undef: true },
				globals: { a: true }
			}, expectSuccess(done, files), expectNoFailure(done, files));
		});

		it("fails when no code is provided", function(done) {
			jshint.checkFiles({}, expectNoSuccess(done), expectFailure(done));
		});

		it("fails when option variable isn't an object", function(done) {
			jshint.checkFiles("foo", expectNoSuccess(done), expectFailure(done));
		});

		it("fails when option variable is null", function(done) {
			jshint.checkFiles(null, expectNoSuccess(done), expectFailure(done));
		});

		it("skips files that don't exist", function(done) {
			jshint.checkFiles({
				files: "no-such-file.js"
			}, expectSuccess(done), expectNoFailure(done));
		});

	});

	function success() {
		successArgs = toArray(arguments);
	}

	function failure() {
		failureArgs = toArray(arguments);
	}

	function toArray(args) {
		return Array.prototype.slice.call(args);
	}

	function assertSuccess() {
		if (successArgs === null) throw new Error("Expected success callback to be called");
		if (failureArgs !== null) throw new Error("Did not expect failure callback to be called");
		assert.deepEqual(successArgs, []);
	}

	function assertFailure(failureMessage) {
		if (failureArgs === null) throw new Error("Expected failure callback to be called");
		if (successArgs !== null) throw new Error("Did not expect success callback to be called");
		if (failureMessage !== undefined) assert.deepEqual(failureArgs, [ failureMessage ]);
	}

	function expectSuccess(done, files) {
		return function() {
			if (files) files.delete();
			done();
		};
	}

	function expectNoSuccess(done, files) {
		return function() {
			if (files) files.delete();
			assert.fail("should not succeed");
			done();
		};
	}

	function expectFailure(done, files, expectedMessage) {
		return function(actualMessage) {
			if (files) files.delete();
			if (expectedMessage) assert.equal(actualMessage, expectedMessage);
			done();
		};
	}

	function expectNoFailure(done, files) {
		return function() {
			if (files) files.delete();
			assert.fail("should not fail");
			done();
		};
	}

});
