module.exports = {
	extends: "@wordpress/stylelint-config/scss",
	plugins: [
		"stylelint-no-unsupported-browser-features"
	],
	rules: {
		"plugin/no-unsupported-browser-features": [
			true,
			{
				severity: "error",
				ignore: [
					"user-select-none", // Not supported in UC browser for Android - not that important if this doesn't work.
					"css3-cursors",
					"css3-cursors-newer",
				],
				ignorePartialSupport: true,
			}
		],
		"at-rule-empty-line-before": null,
		"at-rule-no-unknown": null,
		"comment-empty-line-before": null,
		"declaration-block-no-duplicate-properties": null,
		"declaration-property-unit-whitelist": null,
		"font-weight-notation": null,
		"max-line-length": null,
		"no-descending-specificity": null,
		"no-duplicate-selectors": null,
		"rule-empty-line-before": null,
		"selector-class-pattern": null,
		"value-keyword-case": null,
		"length-zero-no-unit": null,
		"font-family-no-missing-generic-family-keyword": null
	}
}
