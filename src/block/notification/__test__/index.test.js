import { edit, save } from '../index'

describe( 'Notification', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				text: 'This is an informational alert, usually used for successful subscriptions, promo announcements, and the like.',
				color: '#000000',
				textColor: '#ffffff',
				notifType: 'success',
				dismissible: false,
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				text: 'This is an informational alert, usually used for successful subscriptions, promo announcements, and the like.',
				color: '#000000',
				textColor: '#ffffff',
				notifType: 'success',
				dismissible: false,
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
