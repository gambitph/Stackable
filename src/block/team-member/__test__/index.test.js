import { edit } from '../index'

describe( 'Team Member', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				name: 'Ben Adams',
				position: 'Founder',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				nameColor: '#000000',
				posColor: '#000000',
				desColor: '#000000',
				iconColor: '#000000',
				columns: '1',
				shapes: 'square',
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
				name: 'Ben Adams',
				nameTwo: 'Alex Johnson',
				position: 'Founder',
				positionTwo: 'Editor',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				desTwo: 'Alex handles all written content. She enjoys painting and playing softball on the weekends.',
				nameColor: '#000000',
				posColor: '#000000',
				desColor: '#000000',
				iconColor: '#000000',
				columns: '2',
				shapes: 'square',
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
				name: 'Ben Adams',
				nameTwo: 'Alex Johnson',
				nameThree: 'Sammy Simpson',
				position: 'Founder',
				positionTwo: 'Editor',
				positionThree: 'Programmer',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				desTwo: 'Alex handles all written content. She enjoys painting and playing softball on the weekends.',
				desThree: 'Sammy is our programmer. You\'ll usually find her nose in a book. She has a cat named Skitty.',
				nameColor: '#000000',
				posColor: '#000000',
				desColor: '#000000',
				iconColor: '#000000',
				columns: '3',
				shapes: 'square',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				name: 'Ben Adams',
				position: 'Founder',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				nameColor: '#000000',
				posColor: '#000000',
				desColor: '#000000',
				iconColor: '#000000',
				columns: '1',
				shapes: 'square',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '2 column block save matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				href: 'http://www.gambit.ph/',
				hrefTwo: 'http://www.gambit.ph/',
				mediaID: '1',
				mediaIDTwo: '2',
				mediaURL: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				mediaURLTwo: 'https://images.unsplash.com/photo-1522198734915-76c764a8454d?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=7892e6f709c6e46512bb4b08ce3d1a3c&auto=format&fit=crop&w=1050&q=80',
				name: 'Ben Adams',
				nameTwo: 'Alex Johnson',
				position: 'Founder',
				positionTwo: 'Editor',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				desTwo: 'Alex handles all written content. She enjoys painting and playing softball on the weekends.',
				nameColor: '#000000',
				posColor: '#000000',
				desColor: '#000000',
				iconColor: '#000000',
				columns: '2',
				shapes: 'square',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '3 column block save matches snapshots', () => {
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
				name: 'Ben Adams',
				nameTwo: 'Alex Johnson',
				nameThree: 'Sammy Simpson',
				position: 'Founder',
				positionTwo: 'Editor',
				positionThree: 'Programmer',
				des: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
				desTwo: 'Alex handles all written content. She enjoys painting and playing softball on the weekends.',
				desThree: 'Sammy is our programmer. You\'ll usually find her nose in a book. She has a cat named Skitty.',
				nameColor: '#000000',
				posColor: '#000000',
				desColor: '#000000',
				iconColor: '#000000',
				columns: '3',
				shapes: 'square',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
