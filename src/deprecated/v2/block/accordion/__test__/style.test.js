/**
 * Internal dependencies
 */
import { name, settings } from '../'
import registerStackableBlock from '~stackable/register-block'

/**
 * External dependencies
 */
import {
	getBlockType,
	getSaveElement,
	unregisterBlockType,
} from '@wordpress/blocks'
import { render } from '@testing-library/react'

describe( `${ settings.title } block`, () => {
	beforeEach( () => {
		if ( ! getBlockType( name ) ) {
			registerStackableBlock( name, { ...settings, category: 'common' } )
		}
	} )

	afterAll( () => {
		unregisterBlockType( name )
	} )

	it( 'Rendered styled output', () => {
		const attributes = {
			uniqueClass: 'ugb-123',
			design: 'basic',
			marginTop: '100',
			titleColor: '#cd2653',
			arrowColor: '#333333',
		}

		const { baseElement } = render( getSaveElement( name, attributes ) )
		const block = baseElement.querySelector( `.wp-block-${ name.replace( '/', '-' ) }` )

		expect( block.querySelector( '.ugb-accordion__title' ) ).toHaveStyle( { color: '#cd2653' } )
		expect( block.querySelector( '.ugb-accordion__arrow' ) ).toHaveStyle( { fill: '#333333' } )
	} )
} )
