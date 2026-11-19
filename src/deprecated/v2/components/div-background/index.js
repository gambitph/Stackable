/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	hasBackgroundOverlay,
	createVideoBackground,
} from '../../util'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { getPropsWithDefaults } from '../../../../util/props'

const DivBackground = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, DIV_BACKGROUND_DEFAULT_PROPS )
	const {
		blockTag: BlockTag,
		className,
		backgroundAttrName,
		blockProps,
		showBackground,
		showVideoBackground,
		...propsToPass
	} = props
	const divClasses = classnames( [
		className,
	], {
		'ugb--has-background-overlay': showBackground && hasBackgroundOverlay( backgroundAttrName, blockProps.attributes ),
	} )

	return (
		<BlockTag className={ divClasses } { ...omit( propsToPass, 'index' ) }>
			{ props.children }
			{ showBackground && showVideoBackground && createVideoBackground( backgroundAttrName, blockProps ) }
			{ applyFilters( 'stackable.div-background.output.after', null, props, blockProps ) }
		</BlockTag>
	)
}

const DIV_BACKGROUND_DEFAULT_PROPS = {
	className: '',
	backgroundAttrName: '%s',
	blockProps: {},
	showBackground: true,
	showVideoBackground: true,
	blockTag: 'div',
}

export default DivBackground
