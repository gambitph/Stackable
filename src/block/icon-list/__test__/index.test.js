import { edit, save } from '../index'

describe( 'Icon List', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				icon: 'check',
				iconShape: 'circle',
				iconColor: '#000000',
				iconSize: 20,
				columns: 1,
				text: 'Some Text',
				gap: 16,
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				icon: 'check',
				iconShape: 'circle',
				iconColor: '#000000',
				iconSize: 20,
				columns: 1,
				text: 'Some Text',
				gap: 16,
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
