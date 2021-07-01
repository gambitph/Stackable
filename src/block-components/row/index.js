import { addAttributes } from './attributes'

import { useBlockAttributes, useBlockContext } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'
import { Fragment, useEffect } from '@wordpress/element'

export * from './use-row'

export const Row = props => {
	const { clientId } = useBlockEditContext()
	const { numInnerBlocks } = useBlockContext()
	const attributes = useBlockAttributes( clientId )

	useEffect( () => {
		attributes.numInnerBlocks = numInnerBlocks
	}, [ numInnerBlocks ] )

	return <Fragment children={ props.children } />
}

Row.InspectorControls = null

Row.addAttributes = addAttributes

Row.addStyles = () => {}
