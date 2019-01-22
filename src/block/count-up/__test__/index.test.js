import { edit, save } from '../index'

describe( 'Count Up', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				title: 'Happy Customers',
				counter: '12,345',
				des: 'and counting',
				fontSize: '60',
				headingColor: '#444444',
				desColor: '#444444',
				color: '#444444',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				title: 'Happy Customers',
				counter: '12,345',
				des: 'and counting',
				fontSize: '60',
				headingColor: '#444444',
				desColor: '#444444',
				color: '#444444',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
