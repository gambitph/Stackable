/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'
import { attributeHasValue } from '~stackable/util'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attributes,
		addBorderRadiusOverflow = true,
		selector = '',
		attrNameTemplate = '%s',
		hoverSelector,
		borderRadiusSelector,
	} = props

	return (
		<>
			{ attributeHasValue( 'borderRadius', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ borderRadiusSelector || selector }
					styleRule="borderRadius"
					attrName="borderRadius"
					attrNameTemplate={ attrNameTemplate }
					format="%spx"
					responsive="all"
					hover="all"
					hoverSelector={ borderRadiusSelector ? undefined : hoverSelector }
				/>
			}
			{ attributeHasValue( 'borderRadius', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					// Adding a border radius should append `overflow: hidden`.
					// This is to prevent gradient background from overflowing.
					selector={ borderRadiusSelector || selector }
					styleRule="overflow"
					attrName="borderRadius"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hoverSelector={ borderRadiusSelector ? undefined : hoverSelector }
					enabledCallback={ ( _getAttribute, attributes ) => {
						if ( addBorderRadiusOverflow && attrNameTemplate === 'block%s' && attributes.overflow ) {
							return false
						}
						return addBorderRadiusOverflow
					} }
					valueCallback={ () => 'hidden' }
					dependencies={ [ 'overflow' ] }
				/>
			}
			{ attributeHasValue( 'shadow', attributes, { hasHover: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="boxShadow"
					attrName="shadow"
					attrNameTemplate={ attrNameTemplate }
					hover="all"
					hoverSelector={ hoverSelector }
				/>
			}
			{ attributeHasValue( 'borderType', attributes, { attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="borderStyle"
					attrName="borderType"
					attrNameTemplate={ attrNameTemplate }
				/>
			}
			{ attributeHasValue( 'borderColor', attributes, { hasHover: true, attrNameTemplate } ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="borderColor"
					attrName="borderColor"
					attrNameTemplate={ attrNameTemplate }
					enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
					hover="all"
					hoverSelector={ hoverSelector }
					dependencies={ [ 'borderType' ] }
				/>
			}
			{ attributeHasValue( 'borderWidth', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="borderTopWidth"
					attrName="borderWidth"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hoverSelector={ hoverSelector }
					format="%spx"
					enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
					valuePreCallback={ value => value?.top }
					dependencies={ [ 'borderType' ] }
				/>
			}
			{ attributeHasValue( 'borderWidth', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="borderRightWidth"
					attrName="borderWidth"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hoverSelector={ hoverSelector }
					format="%spx"
					enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
					valuePreCallback={ value => value?.right }
					dependencies={ [ 'borderType' ] }
				/>
			}
			{ attributeHasValue( 'borderWidth', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="borderBottomWidth"
					attrName="borderWidth"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hoverSelector={ hoverSelector }
					format="%spx"
					enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
					valuePreCallback={ value => value?.bottom }
					dependencies={ [ 'borderType' ] }
				/>
			}
			{ attributeHasValue( 'borderWidth', attributes, {
				hasResponsive: true, hasHover: true, attrNameTemplate,
			} ) &&
				<BlockCss
					{ ...propsToPass }
					selector={ selector }
					styleRule="borderLeftWidth"
					attrName="borderWidth"
					attrNameTemplate={ attrNameTemplate }
					responsive="all"
					hover="all"
					hoverSelector={ hoverSelector }
					format="%spx"
					enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
					valuePreCallback={ value => value?.left }
					dependencies={ [ 'borderType' ] }
				/>
			}
		</>
	)
}

export const BorderStyle = props => {
	return <Styles { ...props } />
}

BorderStyle.Content = props => {
	return <Styles { ...props } />
}
