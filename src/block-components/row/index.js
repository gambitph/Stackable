import { addAttributes } from './attributes'

import { useBlockAttributesContext } from '~stackable/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'
import { Fragment, useEffect } from '@wordpress/element'
import { useSelect } from '@wordpress/data'

export * from './use-row'

export const Row = props => {
	const { clientId } = useBlockEditContext()
	const { numInnerBlocks } = useSelect(
		select => {
			const { getBlockOrder } = select( 'core/block-editor' )

			return {
				numInnerBlocks: getBlockOrder( clientId ).length,
			}
		},
		[ clientId ]
	)

	const attributes = useBlockAttributesContext()

	useEffect( () => {
		attributes.numInnerBlocks = numInnerBlocks
	}, [ numInnerBlocks ] )

	return <Fragment children={ props.children } />
}

Row.InspectorControls = null

Row.addAttributes = addAttributes

Row.addStyles = () => {}
