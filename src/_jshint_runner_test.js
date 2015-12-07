// Copyright (c) 2012-2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
(function() {
"use strict";

	var assert = require("./assert.js");
	var runner = require("./jshint_runner.js");
	var stdout = require("test-console").stdout;
	var testFiles = require("./__test_files.js");

	describe("JSHint runner", function() {

		var restoreStdout;

		beforeEach(function() {
			restoreStdout = stdout.ignore();
		});

		afterEach(function() {
			restoreStdout();
		});

		describe("Source code validation", function() {
			it("passes good source code", function() {
				assert.ok(runner.validateSource("var a = 1;"));
			});

			it("fails bad source code", function() {
				assert.notOk(runner.validateSource("bargledy-bargle"));
			});

			it("respects options", function() {
				assert.ok(runner.validateSource("a = 1", { asi: true }));
			});

			it("respects globals", function() {
				assert.ok(runner.validateSource("a = 1;", { undef: true }, { a: true }));
			});

			it("DOES NOT support 'globals' option in place of globals parameter", function() {
				var globals = { a: true };
				assert.notOk(runner.validateSource("a = 1;", { undef: true, globals: globals }, {}));
			});
		});

		describe("File validation", function() {
			it("respects options", function() {
				testFiles.writeSync("var a=1", function(filenames) {
					assert.ok(runner.validateFile(filenames[0], { asi: true }));
				});
			});

			it("respects globals", function() {
				testFiles.writeSync("a = 1;", function(filenames) {
					assert.ok(runner.validateFile(filenames[0], { undef: true }, { a: true }));
				});
			});

			it("fails when file is invalid", function() {
				testFiles.writeSync("YARR", function(filenames) {
					assert.notOk(runner.validateFile(filenames[0]));
				});
			});

			it("reports nothing on success", function() {
				stdout.inspectSync(function(output) {
					testFiles.writeSync("var a=1;", function(filenames) {
						runner.validateFile(filenames[0]);
						assert.deepEqual(output, []);
					});
				});
			});

			it("reports filename on failure (as well as normal error messages)", function() {
				stdout.inspectSync(function(output) {
					testFiles.writeSync("foo;", function(filenames) {
						runner.validateFile(filenames[0]);
						assert.equal(output[0], "\n" + filenames[0] + " failed\n");
					});
				});
			});
		});


		describe("File list validation", function() {

			var files;

			it("respects options", function(done) {
				var files = testFiles.write("var a=1");
				runner.validateFileList(files.filenames, { asi: true }, {}, assertPass(files, done));
			});

			it("respects globals", function(done) {
				var files = testFiles.write("a = 1;");
				runner.validateFileList(files.filenames, { undef: true }, { a: true }, assertPass(files, done));
			});

			it("passes when all files are valid", function(done) {
				var files = testFiles.write("var a=1;", "var b=1;", "var c=1;");
				runner.validateFileList(files.filenames, {}, {}, assertPass(files, done));
			});

			it("fails when any file is invalid", function(done) {
				var files = testFiles.write("var a=1;", "var b=1;", "YARR", "var d=1;");
				runner.validateFileList(files.filenames, {}, {}, assertFail(files, done));
			});

			it("returns error when file doesn't exist (or other exception occurs)", function(done) {
				runner.validateFileList([ "no-such-file.js" ], {}, {}, function(err) {
					assert.isDefined(err);
					assert.equal(err.message, "ENOENT: no such file or directory, open 'no-such-file.js'");
					done();
				});
			});

			it("reports one dot per file", function(done) {
				var inspect = stdout.inspect();
				var files = testFiles.write("var a=1;", "var b=1;", "var c=1;");
				runner.validateFileList(files.filenames, {}, {}, function() {
					inspect.restore();
					files.delete();
					assert.deepEqual(inspect.output, [".", ".", ".", "\n"]);
					done();
				});
			});

			it("validates all files even if one file fails", function(done) {
				var inspect = stdout.inspect();
				var files = testFiles.write("YARR=1", "var b=1;", "var c=1;");
				runner.validateFileList(files.filenames, {}, {}, function() {
					inspect.restore();
					files.delete();
					assert.include(inspect.output, "\n" + files.filenames[0] + " failed\n");
					done();
				});
			});

			function assertPass(files, done) {
				return function(err, pass) {
					if (files !== undefined) files.delete();
					assert.ok(pass);
					done(err);
				};
			}

			function assertFail(files, done) {
				return function(err, pass) {
					if (files !== undefined) files.delete();
					assert.notOk(pass);
					done(err);
				};
			}

		});

		describe("Error reporting", function() {
			it("says nothing on pass", function() {
				stdout.inspectSync(function(output) {
					runner.validateSource("");
					assert.deepEqual(output, []);
				});
			});

			it("includes optional description", function() {
				stdout.inspectSync(function(output) {
					runner.validateSource("foo;", {}, {}, "(description)");
					assert.equal(output[0], "\n(description) failed\n");
				});
			});

			it("reports errors on failure", function() {
				stdout.inspectSync(function(output) {
					runner.validateSource("foo;");
					assert.deepEqual(output, [
						"\nfailed\n",
						"1: foo;\n",
						"   Expected an assignment or function call and instead saw an expression. (W030)\n",
					]);
				});
			});

		});
	});

})();