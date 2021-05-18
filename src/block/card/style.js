/**
 * Internal dependencies
 */
import { blockStyles } from './variations'

/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv, Column, ContainerDiv, Image,
} from '~stackable/block-components'
import { getBlockStyle } from '~stackable/hooks'
import {
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => attributes => {
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

	const blockStyle = getBlockStyle( blockStyles, attributes.className )
	Image.addStyles( styles, attributes, {
		enableWidth: blockStyle === 'horizontal',
		enableHeight: blockStyle !== 'horizontal',
		selector: '.stk-card__image',
	} )

	return styles.getStyles( version )
}

export default createStyles
