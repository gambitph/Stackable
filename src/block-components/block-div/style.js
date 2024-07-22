/**
 * Internal dependencies
 */
import { Fragment } from '@wordpress/element'
import { useBlockAttributesContext } from '~stackable/hooks'
import {
	BorderStyle, SizeStyle, BackgroundStyle,
} from '../helpers'

export const Style = props => {
	const hasBackground = useBlockAttributesContext( attributes => attributes.hasBackground )

	return (
		<>
			{ hasBackground && <BackgroundStyle { ...props } attrNameTemplate="block%s" /> }
			<BorderStyle { ...props } attrNameTemplate="block%s" />
			<SizeStyle { ...props } attrNameTemplate="block%s" />
		</>
	)
}

Style.Content = props => {
	return (
		<>
			{ props.attributes.hasBackground && <BackgroundStyle.Content { ...props } attrNameTemplate="block%s" /> }
			<BorderStyle.Content { ...props } attrNameTemplate="block%s" />
			<SizeStyle.Content { ...props } attrNameTemplate="block%s" />
		</>
	)
}
