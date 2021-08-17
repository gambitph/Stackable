/**
 * External dependencies
 */
import { useAttributeEditHandlers } from '~stackable/hooks'

/**
 * Internal dependencies
 */
import { Style } from './style'
import { Edit } from './edit'
import { addAttributes } from './attributes'
import SeparatorComp from './separator'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const Separator = ( { children } ) => {
	const {
		getAttribute,
		getAttributes,
	} = useAttributeEditHandlers()

	return (
		<>
			{ getAttribute( 'topSeparatorShow' ) && (
				<>
					<div className="stk-top-separator">
						<SeparatorComp
							design={ getAttribute( 'topSeparatorDesign' ) }
							inverted={ getAttribute( 'topSeparatorFlipVertically' ) }
						>
							{ applyFilters( 'stackable.block-component.separator.output.top.after', null, getAttributes() ) }
						</SeparatorComp>
					</div>
				</>
			) }
			{ children }
			{ getAttribute( 'bottomSeparatorShow' ) && (
				<>
					<div className="stk-bottom-separator">
						<SeparatorComp
							design={ getAttribute( 'bottomSeparatorDesign' ) }
							inverted={ getAttribute( 'bottomSeparatorFlipVertically' ) }
						>
							{ applyFilters( 'stackable.block-component.separator.output.bottom.after', null, getAttributes ) }
						</SeparatorComp>
					</div>
				</>
			) }
		</>
	)
}

Separator.Content = ( { children, attributes } ) => {
	return (
		<>
			{ attributes.topSeparatorShow && (
				<>
					<div className="stk-top-separator">
						<SeparatorComp
							design={ attributes.topSeparatorDesign }
							inverted={ attributes.topSeparatorFlipVertically }
						>
							{ applyFilters( 'stackable.block-component.separator.output.top.after', null, attributes ) }
						</SeparatorComp>
					</div>
				</>
			) }
			{ children }
			{ attributes.bottomSeparatorShow && (
				<>
					<div className="stk-bottom-separator">
						<SeparatorComp
							design={ attributes.bottomSeparatorDesign }
							inverted={ attributes.bottomSeparatorFlipVertically }
						>
							{ applyFilters( 'stackable.block-component.separator.output.bottom.after', null, attributes ) }
						</SeparatorComp>
					</div>
				</>
			) }
		</>
	)
}

Separator.Content.defaultProps = {
	attributes: {},
}

Separator.InspectorControls = Edit

Separator.addAttributes = addAttributes

Separator.Style = Style
