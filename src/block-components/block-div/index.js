import { addAttributes } from './attributes'
import { useUniqueId } from './use-unique-id'
import { addStyles } from './style'
import { Edit } from './edit'

import classnames from 'classnames'
import { Div } from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'
import { getUniqueBlockClass } from '~stackable/util'

import { useBlockEditContext } from '@wordpress/block-editor'
import { getHtmlTag } from '../advanced/use-html-tag'

export const BlockDiv = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	useUniqueId()

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )

	const classNames = classnames( [
		props.className,
		'stk-block',
		getUniqueBlockClass( attributes.uniqueId ),
	], {
		'stk-block-background': attributes.hasBackground,
	} )

	return <Div
		{ ...props }
		className={ classNames }
		data-id={ attributes.uniqueId }
		blockTag={ htmlTag }
		backgroundUrl={ attributes.blockBackgroundMediaUrl }
		backgroundUrlTablet={ attributes.blockBackgroundMediaUrlTablet }
		backgroundUrlMobile={ attributes.blockBackgroundMediaUrlMobile }
		backgroundColorType={ attributes.blockBackgroundColorType }
	/>
}

BlockDiv.defaultProps = {
	className: '',
}

BlockDiv.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	// The HTML Tag selected of the block in the Advanced tab.
	const htmlTag = getHtmlTag( attributes )

	const classNames = classnames( [
		props.className,
		'stk-block',
		getUniqueBlockClass( attributes.uniqueId ),
	], {
		'stk-block-background': attributes.hasBackground,
	} )

	return <Div.Content
		{ ...propsToPass }
		className={ classNames }
		data-id={ attributes.uniqueId }
		blockTag={ htmlTag }
		backgroundUrl={ attributes.blockBackgroundMediaUrl }
		backgroundUrlTablet={ attributes.blockBackgroundMediaUrlTablet }
		backgroundUrlMobile={ attributes.blockBackgroundMediaUrlMobile }
		backgroundColorType={ attributes.blockBackgroundColorType }
	/>
}

BlockDiv.Content.defaultProps = {
	className: '',
	attributes: {},
}

BlockDiv.InspectorControls = Edit

BlockDiv.addAttributes = addAttributes

BlockDiv.addStyles = addStyles
