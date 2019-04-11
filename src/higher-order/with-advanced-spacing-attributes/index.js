const withAdvancedSpacingAttributes = attributes => {
	return {
		marginTop: {
			type: 'number',
			default: '',
		},
		marginRight: {
			type: 'number',
			default: '',
		},
		marginBottom: {
			type: 'number',
			default: '',
		},
		marginLeft: {
			type: 'number',
			default: '',
		},
		marginUnit: {
			type: 'string',
			default: 'px',
		},

		tabletMarginTop: {
			type: 'number',
			default: '',
		},
		tabletMarginRight: {
			type: 'number',
			default: '',
		},
		tabletMarginBottom: {
			type: 'number',
			default: '',
		},
		tabletMarginLeft: {
			type: 'number',
			default: '',
		},
		tabletMarginUnit: {
			type: 'string',
			default: 'px',
		},

		mobileMarginTop: {
			type: 'number',
			default: '',
		},
		mobileMarginRight: {
			type: 'number',
			default: '',
		},
		mobileMarginBottom: {
			type: 'number',
			default: '',
		},
		mobileMarginLeft: {
			type: 'number',
			default: '',
		},
		mobileMarginUnit: {
			type: 'string',
			default: 'px',
		},

		paddingTop: {
			type: 'number',
			default: '',
		},
		paddingRight: {
			type: 'number',
			default: '',
		},
		paddingBottom: {
			type: 'number',
			default: '',
		},
		paddingLeft: {
			type: 'number',
			default: '',
		},
		paddingUnit: {
			type: 'string',
			default: 'px',
		},

		tabletPaddingTop: {
			type: 'number',
			default: '',
		},
		tabletPaddingRight: {
			type: 'number',
			default: '',
		},
		tabletPaddingBottom: {
			type: 'number',
			default: '',
		},
		tabletPaddingLeft: {
			type: 'number',
			default: '',
		},
		tabletPaddingUnit: {
			type: 'string',
			default: 'px',
		},

		mobilePaddingTop: {
			type: 'number',
			default: '',
		},
		mobilePaddingRight: {
			type: 'number',
			default: '',
		},
		mobilePaddingBottom: {
			type: 'number',
			default: '',
		},
		mobilePaddingLeft: {
			type: 'number',
			default: '',
		},
		mobilePaddingUnit: {
			type: 'string',
			default: 'px',
		},

		...attributes,
	}
}

export default withAdvancedSpacingAttributes
