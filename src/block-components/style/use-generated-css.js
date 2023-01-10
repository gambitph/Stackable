/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element'

export const useGeneratedCss = attributes => {
	useEffect( () => {
		attributes.generatedCss = ''
	}, [ attributes.uniqueId ] )
}
