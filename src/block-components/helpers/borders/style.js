/**
 * External dependencies
 */
import { BlockCss } from '~stackable/components'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		addBorderRadiusOverflow = true,
		selector = '',
		attrNameTemplate = '%s',
		hoverSelector,
		borderRadiusSelector,
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ borderRadiusSelector || selector }
				styleRule="borderRadius"
				attrName="borderRadius"
				key="borderRadius"
				attrNameTemplate={ attrNameTemplate }
				format="%spx"
				responsive="all"
				hover="all"
				hoverSelector={ borderRadiusSelector ? undefined : hoverSelector }
			/>
			<BlockCss
				{ ...propsToPass }
				// Adding a border radius should append `overflow: hidden`.
				// This is to prevent gradient background from overflowing.
				selector={ borderRadiusSelector || selector }
				styleRule="overflow"
				attrName="borderRadius"
				key="borderRadius-overflow"
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
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="boxShadow"
				attrName="shadow"
				key="shadow"
				attrNameTemplate={ attrNameTemplate }
				hover="all"
				hoverSelector={ hoverSelector }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="borderStyle"
				attrName="borderType"
				key="borderType"
				attrNameTemplate={ attrNameTemplate }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="borderColor"
				attrName="borderColor"
				key="borderColor"
				attrNameTemplate={ attrNameTemplate }
				enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
				hover="all"
				hoverSelector={ hoverSelector }
				dependencies={ [ 'borderType' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="borderTopWidth"
				attrName="borderWidth"
				key="borderWidth-top"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hoverSelector={ hoverSelector }
				format="%spx"
				enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
				valuePreCallback={ value => value?.top }
				dependencies={ [ 'borderType' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="borderRightWidth"
				attrName="borderWidth"
				key="borderWidth-right"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hoverSelector={ hoverSelector }
				format="%spx"
				enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
				valuePreCallback={ value => value?.right }
				dependencies={ [ 'borderType' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="borderBottomWidth"
				attrName="borderWidth"
				key="borderWidth-bottom"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hoverSelector={ hoverSelector }
				format="%spx"
				enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
				valuePreCallback={ value => value?.bottom }
				dependencies={ [ 'borderType' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ selector }
				styleRule="borderLeftWidth"
				attrName="borderWidth"
				key="borderWidth-left"
				attrNameTemplate={ attrNameTemplate }
				responsive="all"
				hover="all"
				hoverSelector={ hoverSelector }
				format="%spx"
				enabledCallback={ getAttribute => getAttribute( 'borderType' ) }
				valuePreCallback={ value => value?.left }
				dependencies={ [ 'borderType' ] }
			/>
		</>
	)
}

export const BorderStyle = props => {
	return <Styles { ...props } />
}

BorderStyle.Content = props => {
	return <Styles { ...props } />
}
