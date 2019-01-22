import { edit, save } from '../index'

describe( 'Header', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				title: 'Heading Title',
				subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.',
				url: 'https://images.unsplash.com/photo-1506269351850-0428eaed2193?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a1512d7659e4817df8217cdb9aa09d7a&auto=format&fit=crop&w=1050&q=80',
				buttonURL: 'http://www.gambit.ph/',
				titleColor: '#ffffff',
				subtitleColor: '#ffffff',
				buttonText: 'Button',
				buttonColor: '#2091e1',
				buttonTextColor: '#ffffff',
				size: 'normal',
				cornerButtonRadius: 4,
				contentAlign: 'center',
				id: '',
				backgroundColor: '#000000',
				opacity: 5,
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				title: 'Heading Title',
				subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus congue tincidunt nisit ut pretium. Duis blandit, tortor et suscipit tincidunt, dolor metus mattis neque, ac varius magna nibh ac tortor.',
				url: 'https://images.unsplash.com/photo-1506269351850-0428eaed2193?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a1512d7659e4817df8217cdb9aa09d7a&auto=format&fit=crop&w=1050&q=80',
				buttonURL: 'http://www.gambit.ph/',
				titleColor: '#ffffff',
				subtitleColor: '#ffffff',
				buttonText: 'Button',
				buttonColor: '#2091e1',
				buttonTextColor: '#ffffff',
				size: 'normal',
				cornerButtonRadius: 4,
				contentAlign: 'center',
				id: '',
				backgroundColor: '#000000',
				opacity: 5,
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
