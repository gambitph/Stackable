import { edit, save } from '../index'

describe( 'Divider Block', () => {
	test( 'block edit matches snapshot', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				text: 'We Simplify and Revolutionize',
				textAlignment: 'center',
				color: '#2091e1',
				textColor: '#ffffff',
				size: 'normal',
				cornerButtonRadius: 4,
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshot', () => {
		const wrapper = save( {
			attributes: {
				url: 'http://www.gambit.ph/',
				text: 'We Simplify and Revolutionize',
				textAlignment: 'center',
				color: '#2091e1',
				textColor: '#ffffff',
				size: 'normal',
				cornerButtonRadius: 4,
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
