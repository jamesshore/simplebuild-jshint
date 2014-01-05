// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var jshint = require("./simplebuild-jshint.js");
var stdout = require("./__stdout.js");

describe("Simplebuild module", function() {

	var restoreStdout;
	var successCalled;
	var failureCalled;

	beforeEach(function() {
		successCalled = false;
		failureCalled = false;
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
			expectFailure();
		});

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
		successCalled = true;
	}

	function failure() {
		failureCalled = true;
	}

	function expectSuccess() {
		if (!successCalled) throw new Error("Expected success callback to be called");
		if (failureCalled) throw new Error("Did not expect failure callback to be called");
	}

	function expectFailure() {
		if (!failureCalled) throw new Error("Expected failure callback to be called");
		if (successCalled) throw new Error("Did not expect success callback to be called");
	}

});