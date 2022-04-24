/**
 * Loads design system in the editor.
 */

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data'
import { useDeviceType } from '~stackable/hooks'

export const DesignSystem = () => {
	const deviceType = useDeviceType()
	const css = useSelect( select => {
		return select( 'stackable/design-system' ).getCss( deviceType )
	}, [ deviceType ] )

	return css
}
