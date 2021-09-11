/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { AdvancedRangeControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const FlexGapControls = () => {
	return (
		<>
			<AdvancedRangeControl
				label={ __( 'Column Gap', i18n ) }
				attribute="columnGap"
				responsive="all"
				min="0"
				sliderMax="50"
				placeholder=""
			/>
			<AdvancedRangeControl
				label={ __( 'Row Gap', i18n ) }
				attribute="rowGap"
				responsive="all"
				min="0"
				sliderMax="50"
				placeholder=""
			/>
		</>
	)
}
