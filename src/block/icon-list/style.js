import {
	createTypographyStyles,
	whiteIfDark,
} from '@stackable/util'
import { getIconSVGBase64 } from './util'

export const createStyles = props => {
	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		gap,
		showBlockBackground = '',
		blockBackgroundBackgroundColor = '',
		listTextColor = '',
	} = props.attributes

	const iconSVGString = getIconSVGBase64(
		icon,
		iconShape,
		whiteIfDark( iconColor, showBlockBackground && blockBackgroundBackgroundColor )
	)

	return {
		'.ugb-icon-list li': {
			...createTypographyStyles( 'listText%s', 'desktop', props.attributes ),
			color: whiteIfDark( listTextColor, showBlockBackground && blockBackgroundBackgroundColor ),
			'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
			'--icon-size': iconSize ? `${ iconSize }px` : undefined,
			'--gap': gap ? `${ gap }px` : undefined,
		},
	}
}

export default createStyles
