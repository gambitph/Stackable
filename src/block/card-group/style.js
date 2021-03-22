/**
 * External dependencies
 */
import { BlockDiv } from '~stackable/block-components'
import { addMarginBottomStyles } from '~stackable/helpers'
import {
	// __getValue,
	StyleObject,
} from '~stackable/util'

const createStyles = ( version = '' ) => props => {
	// const getValue = __getValue( props.attributes )
	const styles = new StyleObject()

	BlockDiv.addStyles( styles, props )

	addMarginBottomStyles( styles, props )

	return styles.getMerged( version )
}

export default createStyles
