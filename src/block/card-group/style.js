/**
 * External dependencies
 */
import { BlockDiv } from '~stackable/block-components'
import { addMarginBottomStyles } from '~stackable/helpers'
import {
	// __getValue,
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => attributes => {
	// const getValue = __getValue( attributes )
	const styles = new StyleObject()

	BlockDiv.addStyles( styles, attributes )

	addMarginBottomStyles( styles, attributes )

	return styles.getMerged( version )
}

export default createStyles
