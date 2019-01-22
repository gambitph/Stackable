import { edit, save } from '../index'

describe( 'Container', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save all attributes matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
