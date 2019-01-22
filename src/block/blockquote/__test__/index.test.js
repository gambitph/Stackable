import { edit, save } from '../index'

describe( 'Blockquote Block', () => {
	test( 'block edit matches snapshot', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				color: '#424242',
				borderColor: '#2091e1',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshot', () => {
		const wrapper = save( {
			attributes: {
				text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				color: '#424242',
				borderColor: '#2091e1',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
