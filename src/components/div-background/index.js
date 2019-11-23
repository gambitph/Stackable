/**
 * External dependencies
 */
import classnames from 'classnames'
import { createVideoBackground, hasBackgroundOverlay } from '~stackable/util'

const DivBackground = props => {
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
		<BlockTag className={ divClasses } { ...propsToPass }>
			{ props.children }
			{ showBackground && showVideoBackground && createVideoBackground( backgroundAttrName, blockProps ) }
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
