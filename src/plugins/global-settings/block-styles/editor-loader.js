import { useEffect, useState } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

export const renderGlobalBlockStyleStyles = ( setStyles, allBlockStyles, returnSaveCss = false, returnCss = false ) => {
	let styles = ''

	for ( const blockName in allBlockStyles ) {
		const blockStyles = allBlockStyles[ blockName ]
		blockStyles.forEach( blockStyle => {
			if ( returnSaveCss ) {
				styles += blockStyle.saveCss
				return
			}

			styles += blockStyle.editCss
		} )
	}

	if ( returnCss ) {
		return styles
	}

	setStyles( styles )
}

export const GlobalBlockStyles = () => {
	const allBlockStyles = useSelect( select => select( 'stackable/global-block-styles' ).getAllBlockStyles(), [] )

	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( allBlockStyles && typeof allBlockStyles === 'object' && Object.keys( allBlockStyles ).length ) {
			renderGlobalBlockStyleStyles( setStyles, allBlockStyles )
		}
	}, [ allBlockStyles ] )

	return styles
}
