/**
 * External dependencies
 */
import { Icon } from '~stackable/block-components'

/**
 * Internal dependencies
 */
import { getUseSvgDef } from '../icon-list/util'

/**
 * Icon display for icon list items.
 *
 * Always mounts the full Icon picker so users can click any entry's icon
 * without first selecting that list item (openEvenIfUnselected).
 *
 * @param {Object} props
 * @param {boolean} props.ordered
 * @param {string} props.icon
 * @param {string} props.parentUniqueId
 * @param {Function} props.setAttributes
 */
export const ListItemIcon = ( {
	ordered,
	icon,
	parentUniqueId,
	setAttributes,
} ) => {
	if ( ordered ) {
		return null
	}

	const hasCustomIcon = !! icon
	const iconValue = icon || (
		parentUniqueId
			? getUseSvgDef( `#stk-icon-list__icon-svg-def-${ parentUniqueId }` )
			: ''
	)

	if ( ! iconValue ) {
		return null
	}

	// Remount when switching between custom and inherited icons so the Icon
	// component's internal state resets correctly (e.g. after "Clear icon").
	const iconKey = hasCustomIcon ? 'custom' : `inherit-${ parentUniqueId }`

	return (
		<Icon
			key={ iconKey }
			value={ iconValue }
			openEvenIfUnselected={ true }
			hasLinearGradient={ false }
			onChange={ newIcon => {
				setAttributes( { icon: newIcon } )
			} }
		/>
	)
}
