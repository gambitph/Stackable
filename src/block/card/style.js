/**
 * External dependencies
 */
import { addColumnStyles, addImageStyles } from '~stackable/helpers'
import {
	// __getValue,
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => props => {
	// const getValue = __getValue( props.attributes )
	const styles = new StyleObject()

	// Column styles.
	addColumnStyles( styles, props )

	// TODO: image adv styles like zoom, filter, etc.
	// Image styles.
	addImageStyles( styles, props, {
		enableWidth: false,
		selector: '.stk-card__image',
	} )

	return styles.getMerged( version )
}

export default createStyles
