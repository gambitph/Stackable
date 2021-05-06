/**
 * External dependencies
 */
import {
	BlockDiv,
	CustomCSS,
	Advanced,
	Typography,
} from '~stackable/block-components'
import { StyleObject } from '~stackable/util'

const createStyles = ( version = '' ) => attributes => {
	const styles = new StyleObject()

	BlockDiv.addStyles( styles, attributes )
	Advanced.addStyles( styles, attributes )
	CustomCSS.addStyles( styles, attributes )
	Typography.addStyles( styles, attributes, {
		selector: '.stk-advanced-heading__text',
	} )
	return styles.getMerged( version )
}

export default createStyles
