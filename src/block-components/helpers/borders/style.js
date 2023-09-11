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
		borderEnabledCallback = getAttribute => getAttribute( 'borderType' ),
	} = props

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				selector={ borderRadiusSelector || selector }
				styleRule="borderTopLeftRadius"
				attrName="borderRadius2"
				key="borderTopLeftRadius2"
				attrNameTemplate={ attrNameTemplate }
				format="%spx"
				responsive="all"
				hover="all"
				valuePreCallback={ value => value?.top }
				hoverSelector={ borderRadiusSelector ? undefined : hoverSelector }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ borderRadiusSelector || selector }
				styleRule="borderTopRightRadius"
				attrName="borderRadius2"
				key="borderTopRightRadius2"
				attrNameTemplate={ attrNameTemplate }
				format="%spx"
				responsive="all"
				hover="all"
				valuePreCallback={ value => value?.right }
				hoverSelector={ borderRadiusSelector ? undefined : hoverSelector }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ borderRadiusSelector || selector }
				styleRule="borderBottomRightRadius"
				attrName="borderRadius2"
				key="borderBottomRightRadius2"
				attrNameTemplate={ attrNameTemplate }
				format="%spx"
				responsive="all"
				hover="all"
				valuePreCallback={ value => value?.left }
				hoverSelector={ borderRadiusSelector ? undefined : hoverSelector }
			/>
			<BlockCss
				{ ...propsToPass }
				selector={ borderRadiusSelector || selector }
				styleRule="borderBottomLeftRadius"
				attrName="borderRadius2"
				key="borderBottomLeftRadius2"
				attrNameTemplate={ attrNameTemplate }
				format="%spx"
				responsive="all"
				hover="all"
				valuePreCallback={ value => value?.bottom }
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
				enabledCallback={ borderEnabledCallback }
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
				enabledCallback={ borderEnabledCallback }
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
				enabledCallback={ borderEnabledCallback }
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
				enabledCallback={ borderEnabledCallback }
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
				enabledCallback={ borderEnabledCallback }
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
