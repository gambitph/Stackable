import { CustomAttributes } from '..'

describe( 'CustomAttributes.getCustomAttributes', () => {
	it( 'resolves a named custom attribute list', () => {
		const attributes = {
			text: 'Product details',
			linkCustomAttributes: [
				[ 'aria-label', 'Open %text%' ],
				[ 'data-link-id', 'details' ],
			],
		}

		expect( CustomAttributes.getCustomAttributes( attributes, 'linkCustomAttributes' ) ).toEqual( {
			'aria-label': 'Open Product details',
			'data-link-id': 'details',
		} )
	} )

	it( 'does not resolve the custom attribute list into itself', () => {
		const attributes = {
			linkCustomAttributes: [
				[ 'data-value', '%linkCustomAttributes%' ],
			],
		}

		expect( CustomAttributes.getCustomAttributes( attributes, 'linkCustomAttributes' ) ).toEqual( {
			'data-value': '%linkCustomAttributes%',
		} )
	} )
} )
