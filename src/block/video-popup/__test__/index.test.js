import { edit, save } from '../index'

describe( 'Video Popup', () => {
	test( 'block edit matches snapshot', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				videoLink: 'QJ9ygdD2sIY',
				mediaLink: 'https://images.unsplash.com/photo-1506269351850-0428eaed2193?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a1512d7659e4817df8217cdb9aa09d7a&auto=format&fit=crop&w=1050&q=80',
				mediaID: '',
				overlayColor: '#000000',
				playButtonType: 'normal',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshot', () => {
		const wrapper = save( {
			attributes: {
				videoLink: 'QJ9ygdD2sIY',
				mediaLink: 'https://images.unsplash.com/photo-1506269351850-0428eaed2193?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a1512d7659e4817df8217cdb9aa09d7a&auto=format&fit=crop&w=1050&q=80',
				mediaID: '',
				overlayColor: '#000000',
				playButtonType: 'normal',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
