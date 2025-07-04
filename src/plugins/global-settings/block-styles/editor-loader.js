import { useEffect, useState } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

const renderGlobalStyles = ( setStyles, allBlockStyles ) => {
	let styles = ''

	for ( const blockName in allBlockStyles ) {
		const blockStyles = allBlockStyles[ blockName ]
		blockStyles.forEach( blockStyle => {
			styles += blockStyle.css
		} )
	}

	setStyles( styles )
}

export const GlobalBlockStyles = () => {
	const allBlockStyles = useSelect( select => select( 'stackable/global-block-styles' ).getAllBlockStyles(), [] )

	const [ styles, setStyles ] = useState( '' )

	useEffect( () => {
		if ( allBlockStyles && typeof allBlockStyles === 'object' && Object.keys( allBlockStyles ).length ) {
			renderGlobalStyles( setStyles, allBlockStyles )
		}
	}, [ allBlockStyles ] )

	return styles
}
