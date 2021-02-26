/**
 * External dependencies
 */
import classnames from 'classnames'
import { hasBackgroundOverlay } from '~stackable/util'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const DivBackground = props => {
	const {
		blockTag: BlockTag,
		className,
		backgroundAttrName,
		blockProps,
		showBackground,
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
			{ applyFilters( 'stackable.div-background.output.after', null, props, blockProps ) }
		</BlockTag>
	)
}

DivBackground.defaultProps = {
	className: '',
	backgroundAttrName: '%s',
	blockProps: {},
	showBackground: true,
	showVideoBackground: true,
	blockTag: 'div',
}

export default DivBackground
