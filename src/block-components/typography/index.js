/**
 * Internal dependencies
 */
import { Edit } from './edit'
import { addAttributes } from './attributes'
import { Style } from './style'

/**
 * External dependencies
 */
import { useAttributeEditHandlers } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { getAttributeName, getAttrName } from '~stackable/util'

export { getTypographyClasses } from './get-typography-classes'

export const Typography = props => {
	const {
		className,
		attrNameTemplate,
		tagName,
		defaultTag,
		value,
		onChange,
		...rest
	} = props

	const {
		getAttribute, updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )

	return (
		<Fragment>
			{ getAttribute( 'showTopLine' ) && <div className="stk--top-line" /> }
			<RichText
				className={ className }
				tagName={ ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag }
				value={ value === null ? getAttribute( 'text' ) : value }
				onChange={ onChange === null ? value => updateAttribute( 'text', value ) : onChange }
				{ ...rest }
			/>
			{ getAttribute( 'showBottomLine' ) && <div className="stk--bottom-line" /> }
		</Fragment>
	)
}

Typography.defaultProps = {
	attrNameTemplate: '%s',
	tagName: null,
	defaultTag: 'p',
	value: null,
	onChange: null,
}

Typography.Content = props => {
	const {
		className,
		attrNameTemplate,
		attributes,
		tagName,
		defaultTag,
		value,
		...rest
	} = props

	const getAttribute = _attrName => {
		const attrName = getAttrName( attrNameTemplate, _attrName )
		return attributes[ getAttributeName( attrName ) ]
	}

	return (
		<Fragment>
			{ getAttribute( 'showTopLine' ) && <div className="stk--top-line" /> }
			<RichText.Content
				className={ className }
				tagName={ ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag }
				value={ value === null ? getAttribute( 'text' ) : value }
				{ ...rest }
			/>
			{ getAttribute( 'showBottomLine' ) && <div className="stk--bottom-line" /> }
		</Fragment>
	)
}

Typography.Content.defaultProps = {
	attrNameTemplate: '%s',
	attributes: {},
	tagName: null,
	defaultTag: 'p',
	value: null,
}

Typography.InspectorControls = Edit

Typography.addAttributes = addAttributes

Typography.Style = Style

