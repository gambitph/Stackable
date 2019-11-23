/**
 * External dependencies
 */
import {
	createButtonStyleSet,
	__getValue,
} from '~stackable/util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	const {
		showButton2 = false,
		showButton3 = false,
	} = props.attributes

	const contentAlign = getValue( 'contentAlign' )
	const tabletContentAlign = getValue( 'tabletContentAlign' )
	const mobileContentAlign = getValue( 'mobileContentAlign' )
	const justifyContent = contentAlign === 'left' ? 'flex-start' :
		contentAlign === 'right' ? 'flex-end' :
			contentAlign === 'center' ? 'center' :
				undefined
	const tabletJustifyContent = tabletContentAlign === 'left' ? 'flex-start !important' :
		tabletContentAlign === 'right' ? 'flex-end !important' :
			tabletContentAlign === 'center' ? 'center !important' :
				undefined
	const mobileJustifyContent = mobileContentAlign === 'left' ? 'flex-start !important' :
		mobileContentAlign === 'right' ? 'flex-end !important' :
			mobileContentAlign === 'center' ? 'center !important' :
				undefined

	const collapseOn = getValue( 'collapseOn' )
	const collapseOnTablet = collapseOn === 'tablet'
	const collapseOnMobile = !! collapseOn

	styles.push( {
		'.ugb-block-content': {
			justifyContent,
		},
		'.ugb-block-content .ugb-button': {
			borderRadius: getValue( 'borderRadius', '%spx' ),
		},
		tablet: {
			'.ugb-block-content': {
				justifyContent: ! collapseOnTablet ? tabletJustifyContent : undefined,
				// Collapse buttons in tablet.
				flexDirection: collapseOnTablet ? 'column' : undefined,
				alignItems: collapseOnTablet ? tabletJustifyContent || justifyContent : undefined,
			},
		},
		mobile: {
			'.ugb-block-content': {
				justifyContent: ! collapseOnMobile ? mobileJustifyContent : undefined,
				// Collapse buttons in mobile.
				flexDirection: collapseOnMobile ? 'column' : undefined,
				alignItems: collapseOnMobile ? mobileJustifyContent || justifyContent : undefined,
			},
		},
	} )

	// styles.push( createButtonStyleSet = ( attrNameTemplate = '%s', mainClassName = '', blockAttributes = {} ) )
	styles.push( {
		...createButtonStyleSet( 'button1%s', 'ugb-button1', props.attributes ),
		...( showButton2 ? createButtonStyleSet( 'button2%s', 'ugb-button2', props.attributes ) : {} ),
		...( showButton3 ? createButtonStyleSet( 'button3%s', 'ugb-button3', props.attributes ) : {} ),
	} )

	return deepmerge.all( styles )
}

export default createStyles
