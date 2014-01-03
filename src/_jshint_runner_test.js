/* Copyright (c) 2012 James Shore - See README.txt for license */
/* globals beforeEach, afterEach, describe, it */

"use strict";

var expect = require("expect.js");
var assert = require("assert");
var fs = require("fs");

var lint = require("./jshint_runner.js");
var testDir = "temp_files/";

// console inspection code inspired by http://userinexperience.com/?p=714
function TestStdout(newFunction) {
	var original;
	this.redirect = function(newFunction) {
		assert.ok(!original, "Stdout already redirected");
		original = process.stdout.write;
		process.stdout.write = newFunction;
	};
	this.ignore = function() {
		this.redirect(function() {});
	};
	this.restore = function() {
		assert.ok(original, "Stdout not redirected");
		process.stdout.write = original;
		original = null;
	};
}

function inspectStdout(test) {
	var output = [];
	var stdout = new TestStdout();
	stdout.redirect(function(string) {
		output.push(string);
	});
	test(output);
	stdout.restore();
}

var testStdout = new TestStdout();

beforeEach(function() {
	testStdout.ignore();
});

afterEach(function() {
	testStdout.restore();
});


describe("Source code validation", function() {
	it("should pass good source code", function(){
		expect(lint.validateSource("var a = 1;")).to.be(true);
	});

	it("should fail bad source code", function() {
		expect(lint.validateSource("bargledy-bargle")).to.be(false);
	});

	it("should respect options", function() {
		expect(lint.validateSource("a = 1", { asi: true })).to.be(true);
	});

	it("should respect globals", function() {
		expect(lint.validateSource("a = 1;", { undef: true }, { a: true })).to.be(true);
	});
});

describe("File list validation", function() {
	var testRoot = testDir + "file-list-validation.js-";
	var testFiles;

	beforeEach(function() {
		testFiles = [];
	});

	function writeTestFiles() {
		for (var i = 0; i < arguments.length; i++) {
			var testFile = testRoot + i;
			fs.writeFileSync(testFile, arguments[i]);
			testFiles.push(testFile);
		}
	}

	afterEach(function() {
		testFiles.forEach(function(testFile) {
			fs.unlinkSync(testFile);
			assert.ok(!fs.existsSync(testFile), "Could not delete test file: " + testFile);
		});
	});

	it("should respect options", function() {
		writeTestFiles("var a=1");
		expect(lint.validateFileList(testFiles, { asi: true })).to.be(true);
	});

	it("should respect globals", function() {
		writeTestFiles("a = 1;");
		expect(lint.validateFileList(testFiles, { undef: true }, { a: true })).to.be(true);
	});

	it("should pass when all files valid", function() {
		writeTestFiles("var a=1;", "var b=1;", "var c=1;");
		expect(lint.validateFileList(testFiles)).to.be(true);
	});

	it("should fail when any file invalid", function() {
		writeTestFiles("var a=1;", "var b=1;", "YARR", "var d=1;");
		expect(lint.validateFileList(testFiles)).to.be(false);
	});

	it.skip("should report one dot per file", function() {
		inspectStdout(function(output) {
			writeTestFiles("var a=1;", "var b=1;", "var c=1;");
			lint.validateFileList(testFiles);
			expect(output).to.eql(["..."]);
		});
	});

	it("should validate later files even if early file fails", function() {
		inspectStdout(function(output) {
			writeTestFiles("YARR=1", "var b=1;", "var c=1;");
			lint.validateFileList(testFiles);
			expect(output[0]).to.eql(testFiles[0] + " failed\n");
			expect(output[3]).to.eql(testFiles[1] + " ok\n");
			expect(output[4]).to.eql(testFiles[2] + " ok\n");
		});
	});
});

describe("Error reporting", function() {
	it("should say 'ok' on pass", function() {
		inspectStdout(function(output) {
			lint.validateSource("");
			expect(output).to.eql(["ok\n"]);
		});
	});

	it("should report errors on failure", function() {
		inspectStdout(function(output) {
			lint.validateSource("foo;");
			expect(output).to.eql([
				"failed\n",
				"1: foo;\n",
				"   Expected an assignment or function call and instead saw an expression.\n"
			]);
		});
	});

	it("should report all errors", function() {
		inspectStdout(function(output) {
			lint.validateSource("foo;\nbar()");
			expect(output).to.eql([
				"failed\n",
				"1: foo;\n",
				"   Expected an assignment or function call and instead saw an expression.\n",
				"2: bar()\n",
				"   Missing semicolon.\n"
			]);
		});
	});

	it("should trim whitespace from source code", function() {
		inspectStdout(function(output) {
			lint.validateSource("   foo()\t \n");
			expect(output[1]).to.eql("1: foo()\n");
		});
	});

	it("should include optional description", function() {
		inspectStdout(function(output) {
			lint.validateSource("", {}, {}, "code A");
			expect(output[0]).to.eql("code A ok\n");
		});
		inspectStdout(function(output) {
			lint.validateSource("foo;", {}, {}, "code B");
			expect(output[0]).to.eql("code B failed\n");
		});
	});

	// To do: Some edge cases that I don't know how to trigger, so haven't tested or supported:
	// 1- two reasons in a row (line number & evidence undefined); may not occur in current version
	// 2- null element at end of errors array; occurs when JSHint catches exception
});
