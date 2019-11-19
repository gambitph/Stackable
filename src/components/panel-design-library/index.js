/**
 * A Panel for Stackable-built designs
 */
/**
 * External dependencies
 */
import { DesignControl, DesignPanelBody } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { omit } from 'lodash'

function PanelDesignLibrary( props ) {
	const {
		block = 'all',
		options = applyFilters( `stackable.${ block }.edit.templates`, props.options || [] ),
		className = '',
		title = __( 'Designs', i18n ),
		help = __( 'Pick a design to start from, this will override your block settings', i18n ),
	} = props

	const mainClasses = classnames( [ 'ugb-panel-design-settings', className ] )

	if ( ! options.length ) {
		return null
	}

	// Convert the options. The `value` is the one that's passed onChange,
	// but it can't be an object. Use the array index instead.
	const fixedOptions = options.map( ( option, i ) => {
		return {
			...option,
			value: i,
		}
	} )

	return (
		<DesignPanelBody
			{ ...omit( props, [ 'options' ] ) }
			selectedOptionInTitle={ false }
			title={ title }
			className={ mainClasses }
			help={ help }
		>
			{ options &&
				<DesignControl
					{ ...omit( props, [ 'help', 'title' ] ) }
					options={ fixedOptions }
					onChange={ i => {
						const designAttributes = options[ i ].value
						const currentBlockClientID = select( 'core/block-editor' ).getBlockSelectionStart()
						dispatch( 'core/block-editor' ).updateBlockAttributes( currentBlockClientID, designAttributes )
					} }
				/>
			}
			{ props.children }
		</DesignPanelBody>
	)
}

export default PanelDesignLibrary
