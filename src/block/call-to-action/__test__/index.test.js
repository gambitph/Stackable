import { edit, save } from '../index'

describe( 'Call to Action', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				ctaTitle: 'Get Started Today',
				bodyText: 'Get Stackable: Ultimate Gutenberg Blocks today.  Apart from adding new blocks, it gives Gutenberg users more options and settings to tinker with, expanding Gutenberg’s functionality.',
				buttonText: 'Button',
				color: '#2091e1',
				textColor: '#ffffff',
				titleColor: '#23282d',
				bodyTextColor: '#ffffff',
				bgColor: '#f4f4f4',
				size: 'normal',
				borderButtonRadius: 4,
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				ctaTitle: 'Get Started Today',
				bodyText: 'Get Stackable: Ultimate Gutenberg Blocks today.  Apart from adding new blocks, it gives Gutenberg users more options and settings to tinker with, expanding Gutenberg’s functionality.',
				buttonText: 'Button',
				color: '#2091e1',
				textColor: '#ffffff',
				titleColor: '#23282d',
				bodyTextColor: '#ffffff',
				bgColor: '#f4f4f4',
				size: 'normal',
				borderButtonRadius: 4,
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
