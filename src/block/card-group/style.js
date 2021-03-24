/**
 * External dependencies
 */
import { BlockDiv, MarginBottom } from '~stackable/block-components'
import {
	// __getValue,
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => attributes => {
	// const getValue = __getValue( attributes )
	const styles = new StyleObject()

	BlockDiv.addStyles( styles, attributes )

	MarginBottom.addStyles( styles, attributes )

	return styles.getMerged( version )
}

export default createStyles
