// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var jshint = require("./simplebuild-jshint.js");

describe("Simplebuild module", function() {

	describe("source validator", function() {

		//TODO: factor out and use console inspector?
		//TODO: simplify testing of success and failure functions

		var successCalled;
		var failureCalled;

		beforeEach(function() {
			successCalled = false;
			failureCalled = false;
		});

		it("calls success() callback on success", function() {
			jshint.checkSource({
//				code: "var a = 1;"
			}, success, failure);

			expect(successCalled).to.be(true);
			expect(failureCalled).to.be(false);
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

		function success() {
			successCalled = true;
		}

		function failure() {
			failureCalled = false;
		}
	});

	describe("file validator", function() {
		//TBD
	});

});