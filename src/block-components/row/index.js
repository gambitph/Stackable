import { addAttributes } from './attributes'

import { useBlockAttributesContext, useBlockContext } from '~stackable/hooks'

import { Fragment, useEffect } from '@wordpress/element'

export * from './use-row'

export const Row = props => {
	const { numInnerBlocks } = useBlockContext()
	const attributes = useBlockAttributesContext()

	useEffect( () => {
		attributes.numInnerBlocks = numInnerBlocks
	}, [ numInnerBlocks ] )

	return <Fragment children={ props.children } />
}

Row.InspectorControls = null

Row.addAttributes = addAttributes

Row.addStyles = () => {}
