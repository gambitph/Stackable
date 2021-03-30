import { addAttributes } from './attributes'
import { useUniqueId } from './use-unique-id'
import { addStyles } from './style'
import { Edit } from './edit'

import classnames from 'classnames'
import { Div } from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'

export const getUniqueBlockClass = uniqueId => uniqueId ? `stk-${ uniqueId }` : ''

export const BlockDiv = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	useUniqueId()

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
