import { attributes } from './attributes'
// import { addStyles } from './style'
// import { useColumn } from './use-column'

import { useBlockAttributes, useBlockContext } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'
import { Fragment, useEffect } from '@wordpress/element'

export * from './use-row'

export const Row = props => {
	// const {
	// 	isHovered,
	// 	...propsToPass
	// } = props

	const { clientId } = useBlockEditContext()
	const { numInnerBlocks } = useBlockContext()
	const attributes = useBlockAttributes( clientId )

	useEffect( () => {
		attributes.numInnerBlocks = numInnerBlocks
	}, [ numInnerBlocks ] )

	return <Fragment children={ props.children } />
}

// Row.defaultProps = {
// 	isHovered: true,
// }

// Row.InspectorControls = null

Row.attributes = attributes

// Row.addStyles = addStyles
