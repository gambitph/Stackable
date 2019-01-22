import { edit, save } from '../index'

describe( 'Number Box', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				numberBox: '01',
				name: 'Registration',
				body: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				numberBoxColor: '#444444',
				nameColor: '#444444',
				bodyTextColor: '#444444',
				numberBGColor: '#dddddd',
				columns: '1',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '2 column block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				numberBox: '01',
				numberBoxTwo: '02',
				name: 'Registration',
				nameTwo: 'Waiting Period',
				body: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				bodyTwo: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				numberBoxColor: '#444444',
				nameColor: '#444444',
				bodyTextColor: '#444444',
				numberBGColor: '#dddddd',
				columns: '2',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '3 column block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				numberBox: '01',
				numberBoxTwo: '02',
				numberBoxThree: '03',
				name: 'Registration',
				nameTwo: 'Waiting Period',
				nameThree: 'Delivery',
				body: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				bodyTwo: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				bodyThree: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				numberBoxColor: '#444444',
				nameColor: '#444444',
				bodyTextColor: '#444444',
				numberBGColor: '#dddddd',
				columns: '3',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				numberBox: '01',
				name: 'Registration',
				body: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				numberBoxColor: '#444444',
				nameColor: '#444444',
				bodyTextColor: '#444444',
				numberBGColor: '#dddddd',
				columns: '1',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '2 column block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				numberBox: '01',
				numberBoxTwo: '02',
				name: 'Registration',
				nameTwo: 'Waiting Period',
				body: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				bodyTwo: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				numberBoxColor: '#444444',
				nameColor: '#444444',
				bodyTextColor: '#444444',
				numberBGColor: '#dddddd',
				columns: '2',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '3 column block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				numberBox: '01',
				numberBoxTwo: '02',
				numberBoxThree: '03',
				name: 'Registration',
				nameTwo: 'Waiting Period',
				nameThree: 'Delivery',
				body: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				bodyTwo: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				bodyThree: 'This is just a sample write-up, but you can check out more info on Gutenberg on the WP repository.',
				numberBoxColor: '#444444',
				nameColor: '#444444',
				bodyTextColor: '#444444',
				numberBGColor: '#dddddd',
				columns: '3',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
