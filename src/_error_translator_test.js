// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

var expect = require("expect.js");
var translator = require("./error_translator.js");

describe("Error translation", function() {

	it("converts JSHint errors array to human-readable text", function() {
		expect(translator.translate([
			{
				line: 1,
				evidence: "source code",
				reason: "error description",
				code: "error code"
			}
		])).to.eql([
			"1: source code",
			"   error description (error code)"
		]);
	});

	it("handles multiple errors", function() {
		expect(translator.translate([
			{
				line: 1,
				evidence: "evidence1",
				reason: "reason1",
				code: "code1"
			},
			{
				line: 2,
				evidence: "evidence2",
				reason: "reason2",
				code: "code2"
			}
		])).to.eql([
			"1: evidence1",
			"   reason1 (code1)",
			"2: evidence2",
			"   reason2 (code2)"
		]);
	});

	it("trims whitespace from source code", function() {
		expect(translator.translate([
			{
				line: 1,
				evidence: "      source code     ",
				reason: "reason",
				code: "code"
			}
		])).to.eql([
			"1: source code",
			"   reason (code)"
		]);
	});

	it("handles missing evidence property (occurs in JSHint 2.8.0 when source code is 'a?')", function() {
		expect(translator.translate([
			{
				line: 1,
				reason: "reason",
				code: "code"
			}
		])).to.eql([
			"1",
			"   reason (code)"
		]);
	});

	it("handles missing 'code' property (occurs in JSHint 0.9.1)", function() {
		expect(translator.translate([
			{
				line: 1,
				evidence: "evidence",
				reason: "reason"
			}
		])).to.eql([
			"1: evidence",
			"   reason"
		]);
	});

	it("handles null errors (occurs in JSHint 2.8.0 when source code is 'a?')", function() {
		expect(translator.translate([
			null
		])).to.eql([]);
	});



});
