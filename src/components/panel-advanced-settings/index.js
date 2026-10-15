/**
 * A Panel for selecting designs
 */
import PanelBody from './panel-body'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { getPropsWithDefaults } from '../../util/props'

const noop = () => {}

const PanelAdvancedSettings = memo( incomingProps => {
	const props = getPropsWithDefaults( incomingProps, PANEL_ADVANCED_SETTINGS_DEFAULT_PROPS )
	return <PanelBody { ...props } />
} )

const PANEL_ADVANCED_SETTINGS_DEFAULT_PROPS = {
	id: '',
	className: '',
	title: __( 'Settings', i18n ),
	checked: false,
	onChange: null,
	initialOpen: false,
	hasToggle: false,
	onToggle: noop,
	isOpen: null,
}

export default PanelAdvancedSettings
