// Copyright (c) 2014 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var jshint = require("./simplebuild-jshint.js");

describe("Simplebuild module", function() {

	describe("source validator", function() {

		//TODO: factor out and use console inspector?
		//TODO: simplify testing of success and failure functions

		var succeeded = false;

		it("takes source code, options, and globals", function() {
			jshint.checkSource({
				code: "a = 1;",
				options: { undef: true },
				globals: { a: true }
			}, success, failure);

			expect(succeeded).to.be(true);

			function success() {
				succeeded = true;
			}

			function failure() {
				throw new Error("Failure function called unexpectedly");
			}
		});

	});

	describe("file validator", function() {
		//TBD
	});

});