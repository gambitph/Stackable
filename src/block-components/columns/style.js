/**
 * External dependencies
 */
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import { BlockCss } from '~stackable/components'
import { useBlockAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		hasRowGap = true,
		numColumns,
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector=".%s-column"
				styleRule="--stk-columns-spacing"
				attrName="columnSpacing"
				key="columnSpacing"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-column"
				styleRule="--stk-column-gap"
				attrName="columnGap"
				key="columnGap-save"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="--stk-column-gap"
				attrName="columnGap"
				key="columnGap"
				format="%spx"
				responsive="all"
			/>
			{ hasRowGap && <>
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector=".%s-column"
					styleRule="rowGap"
					attrName="rowGap"
					key="rowGap-save"
					format="%spx"
					responsive="all"
				/>
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
					styleRule="rowGap"
					attrName="rowGap"
					key="rowGap"
					format="%spx"
					responsive="all"
				/>
			</> }
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-column"
				styleRule="justifyContent"
				attrName="columnJustify"
				key="columnJustify-save"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="justifyContent"
				attrName="columnJustify"
				key="columnJustify"
				responsive="all"
			/>

			{ range( 1, numColumns + 1 ).map( i => {
				return (
					<Fragment key={ `column-arrangement-${ i }` }>
						<BlockCss
							{ ...propsToPass }
							// In the editor, target the specific column to change the order.
							renderIn="edit"
							selector={ `> .stk-block-content > .block-editor-inner-blocks > .block-editor-block-list__layout > :nth-child(${ i })` }
							styleRule="order"
							responsive="all"
							attrName="columnArrangement"
							key="columnArrangement"
							valueCallback={ value => {
								// Look for the order in the values list for the column i
								return ( value.split( ',' ) || [] ).indexOf( i.toString() ) + 1
							} }
							valuePreCallback={ ( value, getAttribute, device ) => {
								const tabletAttribute = getAttribute( 'columnArrangement', 'tablet' )
								if ( device === 'mobile' && ! value && tabletAttribute ) {
									return [ ...Array( numColumns ).keys() ].map( i => i + 1 ).join( ',' )
								}
								return value
							} }
						/>
						<BlockCss
							{ ...propsToPass }
							// In the frontend, use the css custom property to specify the order.
							// See style.scss We do this because we cannot use the direct descendent
							// selector ">" in the saved CSS or else non-admin users in multisite
							// will encounter block errors (this is a WP issue)
							renderIn="save"
							styleRule={ `--stk-col-order-${ i }` }
							responsive="all"
							attrName="columnArrangement"
							key="columnArrangement-save"
							valueCallback={ value => {
								// Look for the order in the values list for the column i
								return ( value.split( ',' ) || [] ).indexOf( i.toString() ) + 1
							} }
							valuePreCallback={ ( value, getAttribute, device ) => {
								const tabletAttribute = getAttribute( 'columnArrangement', 'tablet' )
								if ( device === 'mobile' && ! value && tabletAttribute ) {
									return [ ...Array( numColumns ).keys() ].map( i => i + 1 ).join( ',' )
								}
								return value
							} }
						/>
					</Fragment>
				)
			} ) }
		</>
	)
}

export const Style = props => {
	const columnArrangement = useBlockAttributesContext( attributes => attributes.columnArrangementMobile || attributes.columnArrangementTablet )
	const numColumns = ( columnArrangement || '' ).split( ',' ).length
	return <Styles { ...props } numColumns={ numColumns } />
}

Style.Content = props => {
	const numColumns = ( props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet || '' ).split( ',' ).length
	return <Styles { ...props } numColumns={ numColumns } />
}
