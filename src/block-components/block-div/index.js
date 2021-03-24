import { attributes } from './attributes'
import { useUniqueId } from './use-unique-id'
import { addStyles } from './style'
import { Edit } from './edit'

import classnames from 'classnames'

import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect } from '@wordpress/data'
import { Div } from '~stackable/components'

export const getUniqueBlockClass = uniqueId => uniqueId ? `stk-${ uniqueId }` : ''

export const BlockDiv = props => {
	const { clientId } = useBlockEditContext()
	useUniqueId()

	const { attributes } = useSelect(
		select => {
			const { getBlockAttributes } = select( 'core/block-editor' )
			return {
				attributes: getBlockAttributes( clientId ),
			}
		},
		[ clientId ]
	)

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
	/>
}

BlockDiv.Content.defaultProps = {
	className: '',
	attributes: {},
}

BlockDiv.InspectorControls = Edit

BlockDiv.attributes = attributes

BlockDiv.addStyles = addStyles
