/**
 * External dependencies
 */
import {
	BlockDiv, Column, Image,
} from '~stackable/block-components'
import {
	// __getValue,
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => props => {
	// const getValue = __getValue( props.attributes )
	const styles = new StyleObject()

	// addBlockBackgroundStyles( styles, props )
	BlockDiv.addStyles( styles, props )

	// Column styles.
	Column.addStyles( styles, props )

	// TODO: image adv styles like zoom, filter, etc.
	Image.addStyles( styles, props, {
		enableWidth: false,
		selector: '.stk-card__image',
	} )

	return styles.getMerged( version )
}

export default createStyles
