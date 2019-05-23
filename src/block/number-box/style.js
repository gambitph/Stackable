import { marginLeftAlign, marginRightAlign } from '@stackable/util/styles'
import { createTypographyStyles } from '@stackable/util'
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
		columnGap = '',
		contentAlign = '',
		tabletContentAlign = '',
		mobileContentAlign = '',
		tabletColumnGap = '',
		mobileColumnGap = '',
		numberBottomMargin = '',
		numberTabletBottomMargin = '',
		numberMobileBottomMargin = '',
		titleBottomMargin = '',
		titleTabletBottomMargin = '',
		titleMobileBottomMargin = '',
		descriptionSize = '',
		descriptionTabletSize = '',
		descriptionMobileSize = '',
		descriptionUnit = 'px',
		boxTopPadding = '',
		boxRightPadding = '',
		boxBottomPadding = '',
		boxLeftPadding = '',
	} = props.attributes

	return {
		'.ugb-number-box .ugb-inner-block': {
			gridGap: columnGap !== '' ? `${ columnGap }px` : undefined,
		},
		'.ugb-number-box__item': {
			borderRadius: design !== 'plain' && borderRadius !== 12 ? `${ borderRadius }px` : undefined,
			backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
			paddingTop: boxTopPadding !== '' ? `${ boxTopPadding }px` : undefined,
			paddingRight: boxRightPadding !== '' ? `${ boxRightPadding }px` : undefined,
			paddingBottom: boxBottomPadding !== '' ? `${ boxBottomPadding }px` : undefined,
			paddingLeft: boxLeftPadding !== '' ? `${ boxLeftPadding }px` : undefined,
			textAlign: contentAlign !== '' ? contentAlign : undefined,
		},
		'.ugb-number-box__number': {
			marginLeft: marginLeftAlign( contentAlign ),
			marginRight: marginRightAlign( contentAlign ),
			backgroundColor: numberBGColor,
			marginBottom: numberBottomMargin !== '' ? `${ numberBottomMargin }px` : undefined,
			color: numberColor ? numberColor :
				   ! numberBGColor ? undefined :
				   isDarkColor( numberBGColor ) ? '#ffffff' : '#222222',
		},
		'.ugb-number-box__title': {
			...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
			marginBottom: titleBottomMargin !== '' ? `${ titleBottomMargin }px` : undefined,
			color: titleColor ? titleColor :
			       design === 'plain' ? undefined :
			       ! backgroundColor ? undefined :
			       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
		},
		'.ugb-number-box__description': {
			fontSize: descriptionSize ? `${ descriptionSize }${ descriptionUnit } !important` : undefined,
			color: descriptionColor ? descriptionColor :
			       design === 'plain' ? undefined :
			       ! backgroundColor ? undefined :
			       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
		},
		tablet: {
			'.ugb-number-box .ugb-inner-block': {
				gridGap: tabletColumnGap !== '' ? `${ tabletColumnGap }px` : undefined,
			},
			'.ugb-number-box__item': {
				textAlign: tabletContentAlign !== '' ? tabletContentAlign : undefined,
			},
			'.ugb-number-box__number': {
				marginLeft: marginLeftAlign( tabletContentAlign ),
				marginRight: marginRightAlign( tabletContentAlign ),
				marginBottom: numberTabletBottomMargin !== '' ? `${ numberTabletBottomMargin }px` : undefined,
			},
			'.ugb-number-box__title': {
				marginBottom: titleTabletBottomMargin !== '' ? `${ titleTabletBottomMargin }px` : undefined,
				...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
			},
		},
		mobile: {
			'.ugb-number-box .ugb-inner-block': {
				gridGap: mobileColumnGap !== '' ? `${ mobileColumnGap }px` : undefined,
			},
			'.ugb-number-box__item': {
				textAlign: mobileContentAlign !== '' ? mobileContentAlign : undefined,
			},
			'.ugb-number-box__number': {
				marginLeft: marginLeftAlign( mobileContentAlign ),
				marginRight: marginRightAlign( mobileContentAlign ),
				marginBottom: numberMobileBottomMargin !== '' ? `${ numberMobileBottomMargin }px` : undefined,
			},
			'.ugb-number-box__title': {
				marginBottom: titleMobileBottomMargin !== '' ? `${ titleMobileBottomMargin }px` : undefined,
				...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
			},
		},
	}
}

export default createStyles
