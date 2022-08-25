/**
 * Internal dependencies
 */
import {
	BorderStyle, SizeStyle, BackgroundStyle,
} from '../helpers'
import { useBlockAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

export const Style = props => {
	const {
		backgroundSelector = '.%s-container',
		borderSelector = '.%s-container',
		sizeSelector = '.%s-container',
		sizeVerticalAlignRule = null,
		sizeHorizontalAlignRule = 'margin',
		wrapperSelector = '',
		sizeVerticalAlignSelector = '',
		sizeVerticalAlignSelectorEdit = '',
	} = props

	const hasContainer = useBlockAttributesContext( attributes => attributes.hasContainer )

	return (
		<Fragment>
			{ hasContainer &&
				<BackgroundStyle
					{ ...props }
					attrNameTemplate="container%s"
					selector={ backgroundSelector }
				/>
			}
			<BorderStyle
				{ ...props }
				attrNameTemplate="container%s"
				selector={ borderSelector }
				hoverSelector={ `${ borderSelector }:hover` }
			/>
			<SizeStyle
				{ ...props }
				attrNameTemplate="container%s"
				selector={ sizeSelector }
				verticalAlignRule={ sizeVerticalAlignRule }
				verticalAlignSelector={ sizeVerticalAlignSelector }
				verticalAlignSelectorEdit={ sizeVerticalAlignSelectorEdit }
				horizontalAlignRule={ sizeHorizontalAlignRule }
				wrapperSelector={ wrapperSelector }
			/>
		</Fragment>
	)
}

Style.defaultProps = {
	options: {},
}

Style.Content = props => {
	const {
		backgroundSelector = '.%s-container',
		borderSelector = '.%s-container',
		sizeSelector = '.%s-container',
		sizeVerticalAlignRule = null,
		sizeHorizontalAlignRule = 'margin',
		wrapperSelector = '',
		sizeVerticalAlignSelector = '',
		sizeVerticalAlignSelectorEdit = '',
	} = props.options

	return (
		<Fragment>
			{ props.attributes.hasContainer &&
				<BackgroundStyle.Content
					{ ...props }
					options={ {
						attrNameTemplate: 'container%s',
						selector: backgroundSelector,
					} }
				/>
			}
			<BorderStyle.Content
				{ ...props }
				options={ {
					attrNameTemplate: 'container%s',
					selector: borderSelector,
					hoverSelector: `${ borderSelector }:hover`,
				} }
			/>
			<SizeStyle.Content
				{ ...props }
				options={ {
					attrNameTemplate: 'container%s',
					selector: sizeSelector,
					verticalAlignRule: sizeVerticalAlignRule,
					verticalAlignSelector: sizeVerticalAlignSelector,
					verticalAlignSelectorEdit: sizeVerticalAlignSelectorEdit,
					horizontalAlignRule: sizeHorizontalAlignRule,
					wrapperSelector,
				} }
			/>
		</Fragment>
	)
}

Style.Content.defaultProps = {
	options: {},
}
