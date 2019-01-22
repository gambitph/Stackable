import { edit, save } from '../index'

describe( 'Feature Grid', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				columns: 3,
				imageSize: 100,
				imageID1: 123,
				imageID2: 123,
				imageID3: 123,
				imageUrl1: '#',
				imageUrl2: '#',
				imageUrl3: '#',
				title1: 'Title',
				title2: 'Title',
				title3: 'Title',
				description1: 'Description',
				description2: 'Description',
				description3: 'Description',
				linkUrl1: '#',
				linkUrl2: '#',
				linkUrl3: '#',
				linkText1: 'View More',
				linkText2: 'View More',
				linkText3: 'View More',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save all attributes matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				columns: 3,
				imageSize: 100,
				imageID1: 123,
				imageID2: 123,
				imageID3: 123,
				imageUrl1: '#',
				imageUrl2: '#',
				imageUrl3: '#',
				title1: 'Title',
				title2: 'Title',
				title3: 'Title',
				description1: 'Description',
				description2: 'Description',
				description3: 'Description',
				linkUrl1: '#',
				linkUrl2: '#',
				linkUrl3: '#',
				linkText1: 'View More',
				linkText2: 'View More',
				linkText3: 'View More',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save 3 columns', () => {
		const wrapper = shallow( save( {
			isSelected: false,
			attributes: {
				columns: 3,
			},
		} ) )

		expect( wrapper.find( '.ugb-feature-grid-item' ).length ).toBe( 3 )
	} )

	test( 'block save 2 columns', () => {
		const wrapper = shallow( save( {
			isSelected: false,
			attributes: {
				columns: 2,
			},
		} ) )

		expect( wrapper.find( '.ugb-feature-grid-item' ).length ).toBe( 2 )
	} )

	test( 'block save 1 column', () => {
		const wrapper = shallow( save( {
			isSelected: false,
			attributes: {
				columns: 1,
			},
		} ) )

		expect( wrapper.find( '.ugb-feature-grid-item' ).length ).toBe( 1 )
	} )
} )
