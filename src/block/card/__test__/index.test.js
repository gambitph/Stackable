import { edit } from '../index'

describe( 'Team Member', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				mediaID: 1,
				mediaURL: 'http://www.gambit.ph/',
				heading: 'Ben Adams',
				tagline: 'Ben is the head of our small team',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				headingColor: 'string',
				taglineColor: 'string',
				desColor: 'string',
				buttonURL: 'http://www.gambit.ph/',
				buttonText: 'Button',
				buttonColor: '#2091e1',
				buttonTextColor: '#ffffff',
				size: 'normal',
				cornerButtonRadius: 4,
				contentAlign: 'left',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				mediaID: 1,
				mediaURL: 'http://www.gambit.ph/',
				heading: 'Ben Adams',
				tagline: 'Ben is the head of our small team',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				headingColor: 'string',
				taglineColor: 'string',
				desColor: 'string',
				buttonURL: 'http://www.gambit.ph/',
				buttonText: 'Button',
				buttonColor: '#2091e1',
				buttonTextColor: '#ffffff',
				size: 'normal',
				cornerButtonRadius: 4,
				contentAlign: 'left',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
