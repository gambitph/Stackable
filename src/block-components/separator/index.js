export * from './get-separator-classes'
/**
 * External dependencies
 */
import { useAttributeEditHandlers } from '~stackable/hooks'
import { Separator2 } from '~stackable/components'

/**
 * Internal dependencies
 */
import { Style, separatorGetStyleParams } from './style'
import { Edit } from './edit'
import {
	addAttributes, createSeparatorAttributes, createSeparatorLayerAttributes,
} from './attributes'
export {
	createSeparatorAttributes, createSeparatorLayerAttributes, separatorGetStyleParams,
}

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
					<div className="stk-separator stk-separator__top">
						<div className="stk-separator__wrapper">
							<Separator2
								design={ getAttribute( 'topSeparatorDesign' ) }
								inverted={ getAttribute( 'topSeparatorInverted' ) }
							/>
							{ applyFilters( 'stackable.block-component.separator.output.top.after', null, getAttributes() ) }
						</div>
					</div>
				</>
			) }
			{ children }
			{ getAttribute( 'bottomSeparatorShow' ) && (
				<>
					<div className="stk-separator stk-separator__bottom">
						<div className="stk-separator__wrapper">
							<Separator2
								design={ getAttribute( 'bottomSeparatorDesign' ) }
								inverted={ getAttribute( 'bottomSeparatorInverted' ) }
							/>
							{ applyFilters( 'stackable.block-component.separator.output.bottom.after', null, getAttributes() ) }
						</div>
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
				<div className="stk-separator stk-separator__top">
					<div className="stk-separator__wrapper">
						<Separator2
							design={ attributes.topSeparatorDesign }
							inverted={ attributes.topSeparatorInverted }
						/>
						{ applyFilters( 'stackable.block-component.separator.output.top.after', null, attributes ) }
					</div>
				</div>
			) }
			{ children }
			{ attributes.bottomSeparatorShow && (
				<div className="stk-separator stk-separator__bottom">
					<div className="stk-separator__wrapper">
						<Separator2
							design={ attributes.bottomSeparatorDesign }
							inverted={ attributes.bottomSeparatorInverted }
						/>
						{ applyFilters( 'stackable.block-component.separator.output.bottom.after', null, attributes ) }
					</div>
				</div>
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
