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

const noop = () => {}

const PanelAdvancedSettings = memo( props => {
	return <PanelBody { ...props } />
} )

PanelAdvancedSettings.defaultProps = {
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
