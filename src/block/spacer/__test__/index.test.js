import { edit, save } from '../index'

describe( 'Spacer Block', () => {
	test( 'block edit matches snapshot', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				height: 100,
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshot', () => {
		const wrapper = save( {
			attributes: {
				height: 100,
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
