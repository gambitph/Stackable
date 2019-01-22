import { edit, save } from '../index'

describe( 'Divider Block', () => {
	test( 'block edit matches snapshot', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				height: 1,
				width: 50,
				color: '#dddddd',
				alignment: 'center',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshot', () => {
		const wrapper = save( {
			attributes: {
				height: 1,
				width: 50,
				color: '#dddddd',
				alignment: 'center',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
