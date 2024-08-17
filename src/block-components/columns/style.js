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
		columnWrapDesktopSaveStyleRule = '',
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
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-column"
				styleRule={ columnWrapDesktopSaveStyleRule || 'flexWrap' }
				attrName="columnWrapDesktop"
				key="columnWrapDesktop-save"
				valueCallback={ value => value ? 'wrap' : undefined }
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout"
				styleRule="flexWrap"
				attrName="columnWrapDesktop"
				key="columnWrapDesktop"
				valueCallback={ value => value ? 'wrap' : undefined }
			/>
			{ /*
			   * Desktop columns stretch to the whole width because of flex-grow,
			   * we need to force it to not grow or else we cannot specify a
			   * column that's 50% (and alone without any column beside it)
			   * because it will always stretch to 100%. */
			}
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".%s-column"
				styleRule="--stk-flex-grow"
				attrName="columnWrapDesktop"
				key="columnWrapDesktop-FlexGrow-save"
				valueCallback={ value => value ? '0' : undefined }
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

Style.addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		hasRowGap = true,
		columnWrapDesktopSaveStyleRule = '',
	} = props

	blockStyleGenerator.addBlockStyles( 'columnSpacing', [ {
		...propsToPass,
		selector: '.%s-column',
		styleRule: '--stk-columns-spacing',
		attrName: 'columnSpacing',
		hasUnits: 'px',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'columnGap', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: '--stk-column-gap',
		attrName: 'columnGap',
		format: '%spx',
		responsive: 'all',
	}, {
		...propsToPass,
		renderIn: 'edit',
		selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
		styleRule: '--stk-column-gap',
		attrName: 'columnGap',
		format: '%spx',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'columnWrapDesktop', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: columnWrapDesktopSaveStyleRule || 'flexWrap',
		attrName: 'columnWrapDesktop',
		valueCallback: value => value ? 'wrap' : undefined,
	}, {
		...propsToPass,
		renderIn: 'edit',
		selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
		styleRule: 'flexWrap',
		attrName: 'columnWrapDesktop',
		valueCallback: value => value ? 'wrap' : undefined,
	} ] )

	// Desktop columns stretch to the whole width because of flex-grow, we need
	// to force it to not grow or else we cannot specify a column that's 50%
	// (and alone without any column beside it) because it will always stretch
	// to 100%.
	blockStyleGenerator.addBlockStyles( 'columnWrapDesktop', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: '--stk-flex-grow',
		attrName: 'columnWrapDesktop',
		valueCallback: value => value ? '0' : undefined,
	} ] )

	if ( hasRowGap ) {
		blockStyleGenerator.addBlockStyles( 'rowGap', [ {
			...propsToPass,
			renderIn: 'save',
			selector: '.%s-column',
			styleRule: 'rowGap',
			attrName: 'rowGap',
			format: '%spx',
			responsive: 'all',
		}, {
			...propsToPass,
			renderIn: 'edit',
			selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
			styleRule: 'rowGap',
			attrName: 'rowGap',
			format: '%spx',
			responsive: 'all',
		} ] )
	}

	blockStyleGenerator.addBlockStyles( 'columnJustify', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: 'justifyContent',
		attrName: 'columnJustify',
		responsive: 'all',
	}, {
		...propsToPass,
		renderIn: 'edit',
		selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
		styleRule: 'justifyContent',
		attrName: 'columnJustify',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyleConditionally( ( attributes, addBlockCssFunc ) => {
		const numColumns = ( attributes.columnArrangementMobile || attributes.columnArrangementTablet || '' ).split( ',' ).length

		range( 1, numColumns + 1 ).forEach( i => {
			addBlockCssFunc( {
				...propsToPass,
				// In the editor, target the specific column to change the order.
				renderIn: 'edit',
				selector: `> .stk-block-content > .block-editor-inner-blocks > .block-editor-block-list__layout > :nth-child(${ i })`,
				styleRule: 'order',
				responsive: 'all',
				attrName: 'columnArrangement',
				valueCallback: value => {
					// Look for the order in the values list for the column i
					return ( value.split( ',' ) || [] ).indexOf( i.toString() ) + 1
				},
				valuePreCallback: ( value, getAttribute, device ) => {
					const tabletAttribute = getAttribute( 'columnArrangement', 'tablet' )
					if ( device === 'mobile' && ! value && tabletAttribute ) {
						return [ ...Array( numColumns ).keys() ].map( i => i + 1 ).join( ',' )
					}
					return value
				},
			} )

			addBlockCssFunc( {
				// In the frontend, use the css custom property to specify the order.
				// See style.scss We do this because we cannot use the direct descendent
				// selector ">" in the saved CSS or else non-admin users in multisite
				// will encounter block errors (this is a WP issue)
				renderIn: 'save',
				styleRule: `--stk-col-order-${ i }`,
				responsive: 'all',
				attrName: 'columnArrangement',
				valueCallback: value => {
					// Look for the order in the values list for the column i
					return ( value.split( ',' ) || [] ).indexOf( i.toString() ) + 1
				},
				valuePreCallback: ( value, getAttribute, device ) => {
					const tabletAttribute = getAttribute( 'columnArrangement', 'tablet' )
					if ( device === 'mobile' && ! value && tabletAttribute ) {
						return [ ...Array( numColumns ).keys() ].map( i => i + 1 ).join( ',' )
					}
					return value
				},
			} )
		} )
	} )
}
