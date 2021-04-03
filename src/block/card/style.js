/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv, Column, ContainerDiv, Image,
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
	Column.addStyles( styles, attributes )
	Advanced.addStyles( styles, attributes )
	ContainerDiv.addStyles( styles, attributes, {
		sizeSelector: '.stk-card__content',
		sizeVerticalAlignRule: 'justifyContent',
		sizeHorizontalAlignRule: 'alignSelf',
	} )

	// Column styles.

	// TODO: image adv styles like zoom, filter, etc.
	Image.addStyles( styles, attributes, {
		enableWidth: false,
		selector: '.stk-card__image',
	} )

	return styles.getMerged( version )
}

export default createStyles
