/**
 * External dependencies
 */
import {
	Alignment,
	BlockDiv, Column, Image,
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

	// Column styles.
	Column.addStyles( styles, attributes )

	// TODO: image adv styles like zoom, filter, etc.
	Image.addStyles( styles, attributes, {
		enableWidth: false,
		selector: '.stk-card__image',
	} )

	return styles.getMerged( version )
}

export default createStyles
