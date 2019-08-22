/**
 * A Panel for selecting designs
 */

/**
 * External dependencies
 */
import { ColorPaletteControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import { ColorIndicator, PanelBody } from '@wordpress/components'
import { i18n } from 'stackable'

function PanelColorSettings( props ) {
	const {
		colorSettings = [],
		title = __( 'Color Settings', i18n ),
	} = props

	const className = 'editor-panel-color-settings'

	return (
		<PanelBody
			className="ugb-color-panel-body"
			{ ...props }
			title={
				<span className={ `${ className }__panel-title` }>
					{ title }
					{ renderColorIndicators( colorSettings ) }
				</span>
			}
		>
			{ colorSettings.map( ( settings, index ) => (
				<ColorPaletteControl
					key={ index }
					{ ...settings }
				/>
			) ) }
			{ props.children }
		</PanelBody>
	)
}

const renderColorIndicators = colorSettings => {
	return colorSettings.map(
		( { value, label }, index ) => {
			if ( ! value ) {
				return null
			}

			const ariaLabel = sprintf( __( '(%s: %s)', i18n ), label.toLowerCase(), value )

			return (
				<ColorIndicator
					key={ index }
					colorValue={ value }
					aria-label={ ariaLabel }
				/>
			)
		}
	)
}

export default PanelColorSettings
