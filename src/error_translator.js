// Copyright (c) 2015 Titanium I.T. LLC. All rights reserved. For license, see "README" or "LICENSE" file.
"use strict";

/* Convert JSHint error object to human-readable strings (one string per line) */


exports.translate = function translate(errors) {
	var result = [];

	errors.forEach(function(error) {
		if (error === null) return;
		var evidence = (error.evidence !== undefined) ? ": " + error.evidence.trim() : "";
		var code = (error.code !== undefined) ? " (" + error.code + ")" : "";

		result.push(error.line + evidence);
		result.push("   " + error.reason + code);
	});

	return result;
};