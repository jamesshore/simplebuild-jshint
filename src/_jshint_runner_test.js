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
			it("should pass good source code", function() {
				assert.ok(runner.validateSource("var a = 1;"));
			});

			it("should fail bad source code", function() {
				assert.notOk(runner.validateSource("bargledy-bargle"));
			});

			it("should respect options", function() {
				assert.ok(runner.validateSource("a = 1", { asi: true }));
			});

			it("should respect globals", function() {
				assert.ok(runner.validateSource("a = 1;", { undef: true }, { a: true }));
			});

			it("DOES NOT support 'globals' option in place of globals parameter", function() {
				var globals = { a: true };
				assert.notOk(runner.validateSource("a = 1;", { undef: true, globals: globals }, {}));
			});
		});

		describe("File validation", function() {
			it("should respect options", function() {
				testFiles.writeSync("var a=1", function(filenames) {
					assert.ok(runner.validateFile(filenames[0], { asi: true }));
				});
			});

			it("should respect globals", function() {
				testFiles.writeSync("a = 1;", function(filenames) {
					assert.ok(runner.validateFile(filenames[0], { undef: true }, { a: true }));
				});
			});

			it("should fail when file is invalid", function() {
				testFiles.writeSync("YARR", function(filenames) {
					assert.notOk(runner.validateFile(filenames[0]));
				});
			});

			it("should report nothing on success", function() {
				stdout.inspectSync(function(output) {
					testFiles.writeSync("var a=1;", function(filenames) {
						runner.validateFile(filenames[0]);
						assert.deepEqual(output, []);
					});
				});
			});

			it("should report filename on failure (as well as normal error messages)", function() {
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

			it("should respect options", function(done) {
				var files = testFiles.write("var a=1");
				runner.validateFileList(files.filenames, { asi: true }, {}, assertPass(files, done));
			});

			it("should respect globals", function(done) {
				var files = testFiles.write("a = 1;");
				runner.validateFileList(files.filenames, { undef: true }, { a: true }, assertPass(files, done));
			});

			it("should pass when all files are valid", function(done) {
				var files = testFiles.write("var a=1;", "var b=1;", "var c=1;");
				runner.validateFileList(files.filenames, {}, {}, assertPass(files, done));
			});

			it("should fail when any file is invalid", function(done) {
				var files = testFiles.write("var a=1;", "var b=1;", "YARR", "var d=1;");
				runner.validateFileList(files.filenames, {}, {}, assertFail(files, done));
			});

			it("should report one dot per file", function(done) {
				var inspect = stdout.inspect();
				var files = testFiles.write("var a=1;", "var b=1;", "var c=1;");
				runner.validateFileList(files.filenames, {}, {}, function() {
					inspect.restore();
					files.delete();
					assert.deepEqual(inspect.output, [".", ".", ".", "\n"]);
					done();
				});
			});

			it("should validate later files even if early file fails", function(done) {
				var inspect = stdout.inspect();
				var files = testFiles.write("YARR=1", "var b=1;", "var c=1;");
				runner.validateFileList(files.filenames, {}, {}, function() {
					inspect.restore();
					files.delete();
					assert.equal(inspect.output[0], ".");
					assert.equal(inspect.output[1], "\n" + files.filenames[0] + " failed\n");
					assert.equal(inspect.output[4], ".");
					assert.equal(inspect.output[5], ".");
					done();
				});
			});

			function assertPass(files, done) {
				return function(pass) {
					if (files !== undefined) files.delete();
					assert.ok(pass);
					done();
				};
			}

			function assertFail(files, done) {
				return function(pass) {
					if (files !== undefined) files.delete();
					assert.notOk(pass);
					done();
				};
			}

		});

		describe("Error reporting", function() {
			it("should say nothing on pass", function() {
				stdout.inspectSync(function(output) {
					runner.validateSource("");
					assert.deepEqual(output, []);
				});
			});

			it("should include optional description", function() {
				stdout.inspectSync(function(output) {
					runner.validateSource("foo;", {}, {}, "(description)");
					assert.equal(output[0], "\n(description) failed\n");
				});
			});

			it("should report errors on failure", function() {
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