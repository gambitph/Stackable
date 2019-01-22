import { edit, save } from '../index'

describe( 'Ghost Button', () => {
	test( 'block edit matches snapshot', () => {
		const wrapper = edit( {
			attributes: {
				url: 'http://www.gambit.ph/',
				text: 'Button',
				textAlignment: 'center',
				color: '#ffffff',
				textColor: '#2091e1',
				size: 'normal',
				cornerButtonRadius: '4',
				borderThickness: '1',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshot', () => {
		const wrapper = save( {
			attributes: {
				url: 'http://www.gambit.ph/',
				text: 'Button',
				textAlignment: 'center',
				color: '#ffffff',
				textColor: '#2091e1',
				size: 'normal',
				cornerButtonRadius: '4',
				borderThickness: '1',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
