import { edit, save } from '../index'

describe( 'Pullquote', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				text: 'It\'s okay to acknowledge that life can get complicated, but we musn\'t forget the beauty in its simplicity, too. From the multitude of stars above, to freshly mowed grass in the morning, life is simply wonderful.',
				color: '#2091e1',
				borderColor: '#2091e1',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				text: 'It\'s okay to acknowledge that life can get complicated, but we musn\'t forget the beauty in its simplicity, too. From the multitude of stars above, to freshly mowed grass in the morning, life is simply wonderful.',
				color: '#2091e1',
				borderColor: '#2091e1',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
