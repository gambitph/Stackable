/**
 * External dependencies
 */
import {
	Alignment, BlockDiv, MarginBottom,
} from '~stackable/block-components'
import {
	// __getValue,
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => attributes => {
	// const getValue = __getValue( attributes )
	const styles = new StyleObject()

	Alignment.addStyles( styles, attributes )
	BlockDiv.addStyles( styles, attributes )
	MarginBottom.addStyles( styles, attributes )

	return styles.getMerged( version )
}

export default createStyles
