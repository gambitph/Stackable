import isDarkColor from 'is-dark-color'

export const createStyles = props => {
	const {
		// columns,
		numberColor,
		titleColor,
		descriptionColor,
		numberBGColor,
		design = 'basic',
		borderRadius = 12,
		// shadow = 3,
		backgroundColor,
	} = props.attributes

	return {
		'.ugb-number-box__item': {
			borderRadius: design !== 'plain' && borderRadius !== 12 ? `${ borderRadius }px` : undefined,
			backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		},
		'.ugb-number-box__number': {
			backgroundColor: numberBGColor,
			color: numberColor ? numberColor :
				   ! numberBGColor ? undefined :
				   isDarkColor( numberBGColor ) ? '#ffffff' : '#222222',
		},
		'.ugb-number-box__title': {
			color: titleColor ? titleColor :
			       design === 'plain' ? undefined :
			       ! backgroundColor ? undefined :
			       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
		},
		'.ugb-number-box__description': {
			color: descriptionColor ? descriptionColor :
			       design === 'plain' ? undefined :
			       ! backgroundColor ? undefined :
			       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
		},
	}
}

export default createStyles
