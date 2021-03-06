/**
 * External dependencies
 */
import { addMarginBottomStyles } from '~stackable/helpers'
import {
	__getValue,
	StyleObject,
	appendImportantAll,
} from '~stackable/util'

const createStyles = ( version = '' ) => props => {
	const getValue = __getValue( props.attributes )
	const styles = new StyleObject()

	addMarginBottomStyles( styles, props )

	return styles.getMerged( version )
}

export default createStyles
