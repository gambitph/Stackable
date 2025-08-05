import { useSelect } from '@wordpress/data'

export const useDesignSystem = () => {
	const { colors } = useSelect( select => {
		const colors = select( 'stackable/global-colors' ).getSettings().stackableColors || []

		// TODO: get other settings in the design system

		return { colors }
	}, [] )

	return {
		colors,
	}
}
