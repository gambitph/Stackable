/**
 * External dependencies
 */
import {
	BlockContainer, ButtonEdit, DivBackground,
} from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className } = props
	const {
		design = 'basic',
		shadow = '',

		// Title.
		showTitle = true,
		title = '',
		titleTag = 'h3',

		// Description.
		showDescription = true,
		description = '',

		// Button.
		showButton = true,
		buttonUrl = '',
		buttonNewTab = false,
		buttonSize = 'normal',
		buttonText = '',
		buttonShadow = 0,
		buttonHoverEffect = '',
		buttonIcon = '',
		buttonIconPosition = '',
		buttonDesign = 'basic',
		buttonHoverGhostToNormal = false,
		buttonNoFollow = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb-cta--v2',
	], applyFilters( 'stackable.cta.mainclasses', {
		[ `ugb-cta--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-cta__item',
	], applyFilters( 'stackable.cta.boxclasses', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== '',
	}, design, props ) )

	const titleComp = showTitle && ! RichText.isEmpty( title ) &&
		<RichText.Content
			tagName={ titleTag || 'h3' }
			className="ugb-cta__title"
			value={ title }
		/>
	const descriptionComp = showDescription && ! RichText.isEmpty( description ) &&
		<RichText.Content
			tagName="p"
			className="ugb-cta__description"
			value={ description }
		/>
	const buttonComp = showButton && !! buttonText.length &&
		<ButtonEdit.Content
			size={ buttonSize !== '' ? buttonSize : 'normal' }
			text={ buttonText }
			icon={ buttonIcon }
			newTab={ buttonNewTab !== '' && buttonNewTab }
			url={ buttonUrl }
			noFollow={ buttonNoFollow }
			hoverEffect={ buttonHoverEffect }
			ghostToNormalEffect={ buttonHoverGhostToNormal }
			shadow={ buttonShadow }
			iconPosition={ buttonIconPosition }
			design={ buttonDesign !== '' ? buttonDesign : 'basic' }
		/>

	const comps = {
		title: titleComp,
		description: descriptionComp,
		button: buttonComp,
	}

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
				>
					{ applyFilters( 'stackable.cta.save.output', (
						<Fragment>
							{ titleComp }
							{ descriptionComp }
							{ buttonComp }
						</Fragment>
					), comps, props ) }
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
