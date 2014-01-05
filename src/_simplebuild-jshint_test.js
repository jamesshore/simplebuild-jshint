// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var jshint = require("./simplebuild-jshint.js");
var messages = require("./messages.js");
var stdout = require("./__stdout.js");

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

		//TODO: simplify testing of success and failure functions
		//TODO: validate options

		it("calls success() callback on success", function() {
			jshint.checkSource({
				code: "var a = 1;"
			}, success, failure);
			expectSuccess();
		});

		it("calls failure() callback on failure", function() {
			jshint.checkSource({
				code: "bargledy-bargle"
			}, success, failure);
			expectFailure(messages.VALIDATION_FAILED);
		});

		it("fails when no code is provided", function() {
			jshint.checkSource({}, success, failure);
			expectFailure(messages.NO_CODE_OPTION);
		});

		it("fails when option variable isn't an object", function() {
			jshint.checkSource("foo", success, failure);
			expectFailure(messages.OPTIONS_MUST_BE_OBJECT);
		});

		it("fails when option variable is null", function() {
			jshint.checkSource(null, success, failure);
			expectFailure(messages.OPTIONS_MUST_NOT_BE_NULL);
		});

		//TODO: check that options are an object
		//TODO: check that source code is a string?

//		it("takes source code, options, and globals", function() {
//			jshint.checkSource({
//				code: "a = 1;",
//				options: { undef: true },
//				globals: { a: true }
//			}, success, failure);
//
//			expect(succeeded).to.be(true);
//
//		});
	});

	describe("file validator", function() {
		//TBD
	});

	function success() {
		successArgs = arguments;
	}

	function failure() {
		failureArgs = arguments;
	}

	function expectSuccess() {
		if (successArgs === null) throw new Error("Expected success callback to be called");
		if (failureArgs !== null) throw new Error("Did not expect failure callback to be called");
		expect(successArgs).to.eql([]);
	}

	function expectFailure(failureMessage) {
		if (failureArgs === null) throw new Error("Expected failure callback to be called");
		if (successArgs !== null) throw new Error("Did not expect success callback to be called");
		expect(failureArgs).to.eql([ failureMessage ]);
	}

});