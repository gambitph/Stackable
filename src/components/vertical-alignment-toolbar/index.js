/**
 * Vertical alignment toolbar
 * Very similar to the AlignmentToolbar, but is meant for top/center/bottom vertical alignments
 *
 * The code is mostly from AlignmentToolbar
 */
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { find } from 'lodash'
import { Toolbar } from '@wordpress/components'
import { withSelect } from '@wordpress/data'
import { withViewportMatch } from '@wordpress/viewport'

export const IconTop = () => {
	return (
		<svg viewBox="0 0 20 20" width="20" height="20">
			<rect x="3" y="3" width="14" height="2" />
			<path d="M10.6,17.1H9.4V8.4L8.1,9.7L7,9l3-3l3,3l-1.1,0.8l-1.3-1.3C10.6,8.5,10.6,17.1,10.6,17.1z" />
		</svg>
	)
}

export const IconCenter = () => {
	return (
		<svg viewBox="0 0 20 20" width="20" height="20">
			<rect x="3" y="9" width="14" height="2" />
			<path d="M10.6,18.4H9.4v-3.9l-1.3,1.3L7,15l3-3l3,3l-1.1,0.8l-1.3-1.3V18.4z" />
			<path d="M9.4,1.6h1.2v3.9l1.3-1.3L13,5l-3,3L7,5l1.1-0.8l1.3,1.3V1.6z" />
		</svg>
	)
}

export const IconBottom = () => {
	return (
		<svg viewBox="0 0 20 20" width="20" height="20">
			<rect x="3" y="15.1" width="14" height="2" />
			<path d="M9.4,2.9h1.2v8.6l1.3-1.3L13,11l-3,3l-3-3l1.1-0.8l1.3,1.3V2.9z" />
		</svg>
	)
}

const ALIGNMENT_CONTROLS = [
	{
		icon: IconTop(),
		title: __( 'Align Top' ),
		align: 'flex-start',
	},
	{
		icon: IconCenter(),
		title: __( 'Align center' ),
		align: 'center',
	},
	{
		icon: IconBottom(),
		title: __( 'Align right' ),
		align: 'flex-end',
	},
]

export function VerticalAlignmentToolbar( {
	isCollapsed, value, onChange,
} ) {
	function applyOrUnset( align ) {
		return () => onChange( value === align ? undefined : align )
	}

	const activeAlignment = find( ALIGNMENT_CONTROLS, control => control.align === value )

	return (
		<Toolbar
			isCollapsed={ isCollapsed }
			icon={ activeAlignment ? activeAlignment.icon : IconTop() }
			label={ __( 'Change Vertical Alignment' ) }
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
		const { getBlockRootClientId, getEditorSettings } = select( 'core/editor' )
		return {
			isCollapsed: isCollapsed || ! isLargeViewport || (
				! getEditorSettings().hasFixedToolbar &&
				getBlockRootClientId( clientId )
			),
		}
	} ),
)( VerticalAlignmentToolbar )
