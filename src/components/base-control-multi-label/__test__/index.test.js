/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../'

describe( 'Unit switcher', () => {
	test( 'should have a label', () => {
		expect( shallow( <BaseControlMultiLabel label="hello" /> ).text() ).toContain( 'hello' )
	} )

	test( 'should not display units if single', () => {
		expect( shallow( <BaseControlMultiLabel /> ).find( 'button' ) ).not.toExist()
		expect( shallow( <BaseControlMultiLabel units={ [ '%' ] } /> ).find( 'button' ) ).not.toExist()
		expect( shallow( <BaseControlMultiLabel units={ [] } /> ).find( 'button' ) ).not.toExist()
	} )

	test( 'should display units if multiple', () => {
		const wrapper2 = shallow( <BaseControlMultiLabel units={ [ 'px', '%' ] } /> )
		expect( wrapper2.find( 'button' ).length ).toBe( 2 )
		expect( wrapper2.find( 'button' ).at( 0 ).text() ).toBe( 'px' )
		expect( wrapper2.find( 'button' ).at( 1 ).text() ).toBe( '%' )
		expect( wrapper2.find( 'button' ).at( 0 ).hasClass( 'is-active' ) ).toBe( true )
		expect( wrapper2.find( 'button' ).at( 1 ).hasClass( 'is-active' ) ).toBe( false )

		const wrapper3 = shallow( <BaseControlMultiLabel unit="em" units={ [ 'px', 'em', '%' ] } /> )
		expect( wrapper3.find( 'button' ).length ).toBe( 3 )
		expect( wrapper3.find( 'button' ).at( 0 ).text() ).toBe( 'px' )
		expect( wrapper3.find( 'button' ).at( 1 ).text() ).toBe( 'em' )
		expect( wrapper3.find( 'button' ).at( 2 ).text() ).toBe( '%' )
		expect( wrapper3.find( 'button' ).at( 0 ).hasClass( 'is-active' ) ).toBe( false )
		expect( wrapper3.find( 'button' ).at( 1 ).hasClass( 'is-active' ) ).toBe( true )
		expect( wrapper3.find( 'button' ).at( 2 ).hasClass( 'is-active' ) ).toBe( false )
	} )

	test( 'should change units', () => {
		const onChange = jest.fn()

		const wrapper = shallow( <BaseControlMultiLabel unit="px" units={ [ 'px', '%' ] } onChangeUnit={ onChange } /> )
		wrapper.find( 'button' ).at( 1 ).simulate( 'click' )
		expect( onChange ).toHaveBeenCalledWith( '%' )
	} )
} )
