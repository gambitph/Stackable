/**
 * Internal dependencies
 */
import DisplayLogic from '../index'

/**
 * External dependencies
 */
import React from 'react'

describe( 'Display Logic', () => {
	test( 'component is div and prints children', () => {
		const wrapper = DisplayLogic( { condition: true, children: <div className="child"></div> } )
		const div = shallow( wrapper )

		expect( div.is( 'div' ) ).toBeTruthy()
		expect( div.find( '.child' ).length ).toBe( 1 )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'component false condition works', () => {
		const wrapper = DisplayLogic( { condition: false, children: <div className="child"></div> } )
		const div = shallow( wrapper )

		expect( div.is( 'div' ) ).toBeTruthy()
		expect( div.find( '.child' ).length ).toBe( 1 )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
