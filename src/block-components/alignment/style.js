/**
 * External dependencies
 */
import {
	__getValue,
} from '~stackable/util'

/**
 * Adds image styles.
 *
 * @param {Object} styles The StyleObject to append to
 * @param {Object} attributes Block attributes
 */
export const addStyles = ( styles, attributes ) => {
	const getValue = __getValue( attributes )

	const isHorizontal = getValue( 'innerBlockOrientation' ) === 'horizontal'

	styles.add( {
		style: {
			'': {
				textAlign: getValue( 'contentAlign' ),
				alignSelf: getValue( 'columnAlign' ), // Column-only option: Self = the current column.
			},
			[ `.stk--block-align-${ attributes.uniqueId }` ]: {
				alignItems: getValue( 'rowAlign' ) || // Row-only option
					( isHorizontal ? getValue( 'innerBlockVerticalAlign' ) : undefined ), // Column-only option
				justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlign' ) : undefined, // Column-only option
			},
			tablet: {
				'': {
					textAlign: getValue( 'contentAlignTablet' ),
					alignSelf: getValue( 'columnAlignTablet' ), // Column-only option: Self = the current column.
				},
				[ `.stk--block-align-${ attributes.uniqueId }` ]: {
					alignItems: getValue( 'rowAlignTablet' ) || // Row-only option
						( isHorizontal ? getValue( 'innerBlockVerticalAlignTablet' ) : undefined ), // Column-only option
					justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlignTablet' ) : undefined, // Column-only option
				},
			},
			mobile: {
				'': {
					textAlign: getValue( 'contentAlignMobile' ),
					alignSelf: getValue( 'columnAlignMobile' ), // Column-only option: Self = the current column.
				},
				[ `.stk--block-align-${ attributes.uniqueId }` ]: {
					alignItems: getValue( 'rowAlignMobile' ) || // Row-only option
						( isHorizontal ? getValue( 'innerBlockVerticalAlignMobile' ) : undefined ), // Column-only option
					justifyContent: ! isHorizontal ? getValue( 'innerBlockVerticalAlignMobile' ) : undefined, // Column-only option
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
		},
		versionAdded: '3.0.0',
		versionDeprecated: '',
	} )
}
