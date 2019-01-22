import { edit, save } from '../index'

describe( 'Testimonial', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				testimonialTitle: 'Ben Adams',
				position: 'Founder',
				body: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				titleColor: '#000000',
				posColor: '#000000',
				bodyTextColor: '#000000',
				iconColor: '#000000',
				columns: '1',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '2 column block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				hrefTwo: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaIDTwo: '2',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				mediaURLTwo: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				testimonialTitle: 'Ben Adams',
				testimonialTitleTwo: 'Alex Johnson',
				position: 'Founder',
				positionTwo: 'Editor',
				body: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				bodyTwo: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				titleColor: '#000000',
				posColor: '#000000',
				bodyTextColor: '#000000',
				iconColor: '#000000',
				columns: '2',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '3 column block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				hrefTwo: 'http://www.gambit.ph/',
				hrefThree: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaIDTwo: '2',
				mediaIDThree: '3',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				mediaURLTwo: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				mediaURLThree: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				testimonialTitle: 'Ben Adams',
				testimonialTitleTwo: 'Alex Johnson',
				testimonialTitleThree: 'Sammy Simpson',
				position: 'Founder',
				positionTwo: 'Editor',
				positionThree: 'Programmer',
				body: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				bodyTwo: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				bodyThree: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				titleColor: '#000000',
				posColor: '#000000',
				bodyTextColor: '#000000',
				iconColor: '#000000',
				columns: '3',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				testimonialTitle: 'Ben Adams',
				position: 'Founder',
				body: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				titleColor: '#000000',
				posColor: '#000000',
				bodyTextColor: '#000000',
				iconColor: '#000000',
				columns: '1',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '2 column block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				hrefTwo: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaIDTwo: '2',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				mediaURLTwo: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				testimonialTitle: 'Ben Adams',
				testimonialTitleTwo: 'Alex Johnson',
				position: 'Founder',
				positionTwo: 'Editor',
				body: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				bodyTwo: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				titleColor: '#000000',
				posColor: '#000000',
				bodyTextColor: '#000000',
				iconColor: '#000000',
				columns: '2',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '3 column block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				hrefTwo: 'http://www.gambit.ph/',
				hrefThree: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaIDTwo: '2',
				mediaIDThree: '3',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				mediaURLTwo: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				mediaURLThree: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				testimonialTitle: 'Ben Adams',
				testimonialTitleTwo: 'Alex Johnson',
				testimonialTitleThree: 'Sammy Simpson',
				position: 'Founder',
				positionTwo: 'Editor',
				positionThree: 'Programmer',
				body: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				bodyTwo: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				bodyThree: 'Stackable: Ultimate Blocks from Gutenberg has all the blocks I need to make a great webpage.',
				titleColor: '#000000',
				posColor: '#000000',
				bodyTextColor: '#000000',
				iconColor: '#000000',
				columns: '3',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
