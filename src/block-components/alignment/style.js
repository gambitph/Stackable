/**
 * External dependencies
 */
import {
	__getValue,
} from '~stackable/util'

import { Style as StyleComponent } from '~stackable/components'
import { useMemo } from '@wordpress/element'

export const getStyles = attributes => {
	const getValue = __getValue( attributes )

	const isHorizontal = getValue( 'innerBlockOrientation' ) === 'horizontal'

	return {
		'': {
			textAlign: getValue( 'contentAlign' ),
			alignSelf: getValue( 'columnAlign' ), // Column-only option: Self = the current column.
		},
		tablet: {
			'': {
				textAlign: getValue( 'contentAlignTablet' ),
				alignSelf: getValue( 'columnAlignTablet' ), // Column-only option: Self = the current column.
			},
		},
		mobile: {
			'': {
				textAlign: getValue( 'contentAlignMobile' ),
				alignSelf: getValue( 'columnAlignMobile' ), // Column-only option: Self = the current column.
			},
		},

		saveOnly: {
			[ `.stk--block-align-${ attributes.uniqueId }` ]: {
				alignItems: getValue( 'rowAlign' ) || // Row-only option
					( isHorizontal ? getValue( 'innerBlockVerticalAlign' ) : undefined ), // Column-only option
				justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlign' ) : undefined, // Column-only option
			},
			tablet: {
				[ `.stk--block-align-${ attributes.uniqueId }` ]: {
					alignItems: getValue( 'rowAlignTablet' ) || // Row-only option
						( isHorizontal ? getValue( 'innerBlockVerticalAlignTablet' ) : undefined ), // Column-only option
					justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlignTablet' ) : undefined, // Column-only option
				},
			},
			mobile: {
				[ `.stk--block-align-${ attributes.uniqueId }` ]: {
					alignItems: getValue( 'rowAlignMobile' ) || // Row-only option
						( isHorizontal ? getValue( 'innerBlockVerticalAlignMobile' ) : undefined ), // Column-only option
					justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlignMobile' ) : undefined, // Column-only option
				},
			},
		},

		editor: {
			[ `.stk--block-align-${ attributes.uniqueId } > .block-editor-inner-blocks > .block-editor-block-list__layout` ]: {
				alignItems: getValue( 'rowAlign' ) || // Row-only option
					( isHorizontal ? getValue( 'innerBlockVerticalAlign' ) : undefined ), // Column-only option
				justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlign' ) : undefined, // Column-only option
			},
			tablet: {
				[ `.stk--block-align-${ attributes.uniqueId } > .block-editor-inner-blocks > .block-editor-block-list__layout` ]: {
					alignItems: getValue( 'rowAlignTablet' ) || // Row-only option
						( isHorizontal ? getValue( 'innerBlockVerticalAlignTablet' ) : undefined ), // Column-only option
					justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlignTablet' ) : undefined, // Column-only option
				},
			},
			mobile: {
				[ `.stk--block-align-${ attributes.uniqueId } > .block-editor-inner-blocks > .block-editor-block-list__layout` ]: {
					alignItems: getValue( 'rowAlignMobile' ) || // Row-only option
						( isHorizontal ? getValue( 'innerBlockVerticalAlignMobile' ) : undefined ), // Column-only option
					justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlignMobile' ) : undefined, // Column-only option
				},
			},
		},
	}
}

export const Style = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const getValue = __getValue( attributes )

	const styles = useMemo(
		() => getStyles( attributes, options ),
		[
			getValue( 'contentAlign' ),
			getValue( 'columnAlign' ),
			getValue( 'contentAlignTablet' ),
			getValue( 'columnAlignTablet' ),
			getValue( 'contentAlignMobile' ),
			getValue( 'columnAlignMobile' ),

			getValue( 'rowAlign' ),
			getValue( 'innerBlockVerticalAlign' ),
			getValue( 'rowAlignTablet' ),
			getValue( 'innerBlockVerticalAlignTablet' ),
			getValue( 'rowAlignMobile' ),
			getValue( 'innerBlockVerticalAlignMobile' ),

			attributes.uniqueId,
		]
	)

	return (
		<StyleComponent
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}

Style.Content = props => {
	const {
		attributes,
		options = {},
		...propsToPass
	} = props

	const styles = getStyles( attributes, options )

	return (
		<StyleComponent.Content
			styles={ styles }
			versionAdded="3.0.0"
			versionDeprecated=""
			{ ...propsToPass }
		/>
	)
}
