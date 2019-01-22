import { edit, save } from '../index'

describe( 'Image Box', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				title: 'Title',
				subtitle: 'Subtitle goes here',
				url: 'https://images.unsplash.com/photo-1506269351850-0428eaed2193?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a1512d7659e4817df8217cdb9aa09d7a&auto=format&fit=crop&w=1050&q=80',
				href: 'http://google.com',
				titleColor: '#ffffff',
				subtitleColor: '#ffffff',
				overlayColor: '#42b078',
				id: '',
				width: '400',
				height: '400',
				verticalAlign: 'center',
				horizontalAlign: 'center',
				full: false,
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				title: 'Title',
				subtitle: 'Subtitle goes here',
				url: 'https://images.unsplash.com/photo-1506269351850-0428eaed2193?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a1512d7659e4817df8217cdb9aa09d7a&auto=format&fit=crop&w=1050&q=80',
				href: 'http://google.com',
				titleColor: '#ffffff',
				subtitleColor: '#ffffff',
				overlayColor: '#42b078',
				id: '',
				width: '400',
				height: '400',
				verticalAlign: 'center',
				horizontalAlign: 'center',
				full: false,
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
