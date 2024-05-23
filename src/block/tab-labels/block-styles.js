/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageClassic from './images/classic.svg'
import ImageButton from './images/button.svg'
import ImageCenteredPills from './images/centered-pills.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { getAttributeName as _getAttributeName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const ATTRIBUTES_TO_CLEAR = {
	blockShadow: '',
	tabBorderType: '',
	tabBorderColor: '',
	tabBorderWidth: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	activeTabBorderColor: '',
	tabTextColor: '',
	activeTabTextColor: '',
	tabTextColorHover: '',
	hasBackground: '',
	blockBorderRadius: '',
	tabBorderRadius: '',
	activeTabBackgroundColor: '',
	tabBackgroundColorHover: '',
	blockMargin: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	tabPadding: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	blockPadding: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	tabBackgroundColor: '',
	blockBorderWidth: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	activeTabBorderWidth: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	tabIconColor1: '',
	activeTabIconColor1: '',
	tabIconColor1Hover: '',
	activeTabIconColor1Hover: '',
	tabBorderRadius2: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
	blockBorderRadius2: {
		top: '',
		right: '',
		bottom: '',
		left: '',
	},
}

export const blockStyles = [
	{
		name: 'default',
		label: __( 'Default', i18n ),
		isDefault: true,
		icon: ImageDefault,
		onSelect: ( _, props ) => {
			const willSetAttributesHorizontal = {
				blockShadow: 'inset 0px -1px 0px 0px rgba(0,0,0, 0.1)',
				tabBorderType: 'solid',
				tabBorderColor: 'transparent',
				tabBorderWidth: {
					top: 0,
					right: 0,
					bottom: 2,
					left: 0,
				},
				activeTabBorderColor: '#000000',
				tabTextColor: '#999999',
				activeTabTextColor: '#000000',
				tabTextColorHover: '#000000',
				tabIconColor1: '#909090',
				activeTabIconColor1: '#000000',
				tabIconColor1Hover: '#909090',
				activeTabIconColor1Hover: '#000000',
			}

			const willSetAttributesVertical = {
				hasBackground: '',
				blockShadow: 'inset -1px 0px 0px 0px rgba(0,0,0, 0.1)',
				tabBorderType: 'solid',
				tabBorderColor: 'transparent',
				tabBorderWidth: {
					top: 0,
					right: 2,
					bottom: 0,
					left: 0,
				},
				activeTabBorderColor: '#000000',
				tabTextColor: '#999999',
				activeTabTextColor: '#000000',
				tabTextColorHover: '#000000',
				tabIconColor1: '#909090',
				activeTabIconColor1: '#000000',
				tabIconColor1Hover: '#909090',
				activeTabIconColor1Hover: '#000000',
			}

			return {
				...ATTRIBUTES_TO_CLEAR,
				...( props.context[ 'stackable/tabOrientation' ] !== 'vertical' ? willSetAttributesHorizontal : willSetAttributesVertical ),
			}
		},
	},
	{
		name: 'classic',
		label: __( 'Classic', i18n ),
		disabled: true,
		icon: ImageClassic,
		onSelect: ( _, props ) => {
			const willSetAttributesHorizontal = {
				blockShadow: 'inset 0px -1px 0px 0px rgba(0,0,0, 1)',
				tabBackgroundColor: '#eeeeee',
				tabBorderType: 'solid',
				tabBorderColor: '#000000',
				tabBorderWidth: {
					top: 1,
					right: 1,
					bottom: 1,
					left: 1,
				},
				activeTabBackgroundColor: '#ffffff',
				activeTabBorderColor: '#000000',
				tabTextColor: '#000000',
				activeTabTextColor: '#000000',
				tabIconColor1: '#000000',
				activeTabBorderWidth: {
					top: 1,
					right: 1,
					bottom: 0,
					left: 1,
				},
			}

			const willSetAttributesVertical = {
				hasBackground: '',
				blockShadow: 'inset -1px 0px 0px 0px rgba(0,0,0, 1)',
				tabBackgroundColor: '#eeeeee',
				tabBorderType: 'solid',
				tabBorderColor: '#000000',
				tabBorderWidth: {
					top: 1,
					right: 1,
					bottom: 1,
					left: 1,
				},
				activeTabBackgroundColor: '#ffffff',
				activeTabBorderColor: '#000000',
				tabTextColor: '#000000',
				activeTabTextColor: '#000000',
				tabIconColor1: '#000000',
				activeTabBorderWidth: {
					top: 1,
					right: 0,
					bottom: 1,
					left: 1,
				},
			}

			return {
				...ATTRIBUTES_TO_CLEAR,
				...( props.context[ 'stackable/tabOrientation' ] !== 'vertical' ? willSetAttributesHorizontal : willSetAttributesVertical ),
			}
		},
	},
	{
		name: 'buttons',
		label: __( 'Button', i18n ),
		disabled: true,
		icon: ImageButton,
		onSelect: () => {
			const willSetAttributes = {
				tabBorderColor: 'transparent',
				tabBorderWidth: {
					top: 0,
					right: 0,
					bottom: 2,
					left: 0,
				},
				tabBorderRadius: 4,
				activeTabBackgroundColor: '#000000',
				activeTabBorderColor: '#000000',
				activeTabTextColor: '#ffffff',
				tabBackgroundColorHover: '#eeeeee',
				tabIconColor1: '#000000',
				activeTabIconColor1: '#ffffff',
			}

			return {
				...ATTRIBUTES_TO_CLEAR,
				...willSetAttributes,
			}
		},
	},
	{
		name: 'centered-pills',
		label: __( 'Centered Pills', i18n ),
		disabled: true,
		icon: ImageCenteredPills,
		onSelect: attributes => {
			const willSetAttributes = {
				hasBackground: true,
				blockBorderRadius: 50,
				tabBorderRadius: 50,
				activeTabBackgroundColor: '#000000',
				tabTextColor: '#777777',
				activeTabTextColor: '#ffffff',
				tabBackgroundColorHover: '#dddddd',
				tabTextColorHover: '#000000',
				blockMargin: {
					top: '',
					right: 'auto',
					bottom: '',
					left: 'auto',
				},
				tabPadding: {
					top: 8,
					right: 24,
					bottom: 8,
					left: 24,
				},
				blockPadding: {
					top: 8,
					right: 8,
					bottom: 8,
					left: 8,
				},
				tabIconColor1: '#777777',
				activeTabIconColor1: '#ffffff',
				tabIconColor1Hover: '#000000',
			}

			if ( attributes.fullWidth ) {
				willSetAttributes.blockMargin = {
					top: '',
					right: '',
					bottom: '',
					left: '',
				}
			}

			return {
				...ATTRIBUTES_TO_CLEAR,
				...willSetAttributes,
			}
		},
	},
]
