/**
 * Internal dependencies
 */
import {
	BorderStyle, SizeStyle, BackgroundStyle,
} from '../helpers'
import { useBlockAttributesContext } from '~stackable/hooks'

import { memo } from '@wordpress/element'

export const Style = memo( props => {
	const {
		backgroundSelector = '.%s-container',
		borderSelector = '.%s-container',
		sizeSelector = '.%s-container',
		sizeVerticalAlignRule = null,
		sizeHorizontalAlignRule = 'margin',
		wrapperSelector = '',
		sizeVerticalAlignSelector = '',
		// sizeVerticalAlignSelectorEdit = '',
	} = props

	const hasContainer = useBlockAttributesContext( attributes => attributes.hasContainer )

	return (
		<>
			{ hasContainer &&
				<BackgroundStyle
					{ ...props }
					attrNameTemplate="container%s"
					selector={ backgroundSelector }
				/>
			}
			{ hasContainer &&
				<BorderStyle
					{ ...props }
					attrNameTemplate="container%s"
					selector={ borderSelector }
					hoverSelector={ `${ borderSelector }:hover` }
				/>
			}
			<SizeStyle
				{ ...props }
				attrNameTemplate="container%s"
				selector={ sizeSelector }
				verticalAlignRule={ sizeVerticalAlignRule }
				verticalAlignSelector={ sizeVerticalAlignSelector }
				// verticalAlignSelectorEdit={ sizeVerticalAlignSelectorEdit }
				horizontalAlignRule={ sizeHorizontalAlignRule }
				wrapperSelector={ wrapperSelector }
				// hasPaddings={ hasContainer }
			/>
		</>
	)
} )

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
		// sizeVerticalAlignSelectorEdit = '',
		attributes,
	} = props

	return (
		<>
			{ attributes.hasContainer &&
				<BackgroundStyle.Content
					{ ...props }
					attrNameTemplate="container%s"
					selector={ backgroundSelector }
				/>
			}
			{ attributes.hasContainer &&
				<BorderStyle.Content
					{ ...props }
					attrNameTemplate="container%s"
					selector={ borderSelector }
					hoverSelector={ `${ borderSelector }:hover` }
				/>
			}
			<SizeStyle.Content
				{ ...props }
				attrNameTemplate="container%s"
				selector={ sizeSelector }
				verticalAlignRule={ sizeVerticalAlignRule }
				verticalAlignSelector={ sizeVerticalAlignSelector }
				// verticalAlignSelectorEdit={ sizeVerticalAlignSelectorEdit }
				horizontalAlignRule={ sizeHorizontalAlignRule }
				wrapperSelector={ wrapperSelector }
				// hasPaddings={ attributes.hasContainer }
			/>
		</>
	)
}

