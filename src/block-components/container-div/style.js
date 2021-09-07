/**
 * Internal dependencies
 */
import {
	BorderStyle, SizeStyle, BackgroundStyle,
} from '../helpers'
import { Fragment } from '@wordpress/element'

export const Style = props => {
	const {
		backgroundSelector = '.%s-container',
		borderSelector = '.%s-container',
		sizeSelector = '.%s-container',
		sizeVerticalAlignRule = null,
		sizeHorizontalAlignRule = null,
	} = props.options

	return (
		<Fragment>
			{ props.attributes.hasContainer &&
				<BackgroundStyle
					{ ...props }
					options={ {
						attrNameTemplate: 'container%s',
						selector: backgroundSelector,
					} }
				/>
			}
			<BorderStyle
				{ ...props }
				options={ {
					attrNameTemplate: 'container%s',
					selector: borderSelector,
					hoverSelector: `${ borderSelector }:hover`,
				} }
			/>
			<SizeStyle
				{ ...props }
				options={ {
					attrNameTemplate: 'container%s',
					selector: sizeSelector,
					verticalAlignRule: sizeVerticalAlignRule,
					horizontalAlignRule: sizeHorizontalAlignRule,
				} }
			/>
		</Fragment>
	)
}

Style.Content = props => {
	const {
		backgroundSelector = '.%s-container',
		borderSelector = '.%s-container',
		sizeSelector = '.%s-container',
		sizeVerticalAlignRule = null,
		sizeHorizontalAlignRule = null,
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
					horizontalAlignRule: sizeHorizontalAlignRule,
				} }
			/>
		</Fragment>
	)
}
