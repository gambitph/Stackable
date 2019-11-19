/**
 * Horizontal alignment toolbar
 * Very similar to the AlignmentToolbar, but is meant for left/center/right horizontal alignments
 *
 * The code is mostly from AlignmentToolbar
 */
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
		icon: 'align-wide',
		title: __( 'Occupy Entire Width', i18n ),
		align: 'full',
	},
	{
		icon: 'align-pull-left',
		title: __( 'Half & Align Left', i18n ),
		align: 'left',
	},
	{
		icon: 'align-center',
		title: __( 'Half & Align Center', i18n ),
		align: 'center',
	},
	{
		icon: 'align-pull-right',
		title: __( 'Half & Align Right', i18n ),
		align: 'right',
	},
]

export function HorizontalAlignmentToolbar( {
	isCollapsed, value, onChange,
} ) {
	function applyOrUnset( align ) {
		return () => onChange( align )
	}

	const activeAlignment = find( ALIGNMENT_CONTROLS, control => control.align === value )

	return (
		<Toolbar
			isCollapsed={ isCollapsed }
			icon={ activeAlignment ? activeAlignment.icon : 'align-wide' }
			label={ __( 'Change Horizontal Alignment', i18n ) }
			controls={ ALIGNMENT_CONTROLS.map( control => {
				const { align } = control
				const isActive = ( value === align )

				return {
					...control,
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
)( HorizontalAlignmentToolbar )
