/**
 * Vertical alignment toolbar
 * Very similar to the AlignmentToolbar, but is meant for top/center/bottom vertical alignments
 *
 * The code is mostly from AlignmentToolbar
 */

/**
 * Internal dependencies
 */
import SVGIconBottom from './images/bottom.svg'
import SVGIconCenter from './images/center.svg'
import SVGIconTop from './images/top.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'

/**
 * External dependencies
 */
import { find } from 'lodash'
import { i18n } from 'stackable'
import { Toolbar } from '@wordpress/components'
import { withSelect } from '@wordpress/data'
import { withViewportMatch } from '@wordpress/viewport'

const ALIGNMENT_CONTROLS = [
	{
		icon: <SVGIconTop />,
		title: __( 'Align text top', i18n ),
		align: 'flex-start',
	},
	{
		icon: <SVGIconCenter />,
		title: __( 'Align text center', i18n ),
		align: 'center',
	},
	{
		icon: <SVGIconBottom />,
		title: __( 'Align text bottom', i18n ),
		align: 'flex-end',
	},
]

export function VerticalAlignmentToolbar( {
	isCollapsed, value, onChange, isDisabled,
} ) {
	function applyOrUnset( align ) {
		return () => onChange( value === align ? undefined : align )
	}

	const activeAlignment = find( ALIGNMENT_CONTROLS, control => control.align === value )

	return (
		<Toolbar
			isCollapsed={ isCollapsed }
			icon={ activeAlignment ? activeAlignment.icon : <SVGIconTop /> }
			label={ __( 'Change Vertical Alignment', i18n ) }
			controls={ ALIGNMENT_CONTROLS.map( control => {
				const { align } = control
				const isActive = ( value === align )

				return {
					...control,
					isDisabled,
					isActive,
					onClick: applyOrUnset( align ),
				}
			} ) }
		/>
	)
}

export default compose(
	withViewportMatch( { isLargeViewport: 'medium' } ),
	withSelect( ( select, {
		clientId, isLargeViewport, isCollapsed,
	} ) => {
		const { getEditorSettings } = select( 'core/editor' )
		const { getBlockRootClientId } = select( 'core/block-editor' )
		return {
			isCollapsed: isCollapsed || ! isLargeViewport || (
				! getEditorSettings().hasFixedToolbar &&
				getBlockRootClientId( clientId )
			),
		}
	} ),
)( VerticalAlignmentToolbar )
