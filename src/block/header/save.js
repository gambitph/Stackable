/**
 * External dependencies
 */
import {
	BlockContainer, ButtonEditHelper, DivBackground,
} from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

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
		restrictContentWidth = 'center',
		fullHeight = false,
		shadow = '',
		design = 'basic',
		titleTag = '',
		title,
		subtitle,
		showTitle = true,
		showSubtitle = true,
		showButton = true,
		showButton2 = false,
		buttonText = '',
		invert = false,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-header--v3',
		[ `ugb-header--design-${ design }` ],
	], applyFilters( 'stackable.header.mainclasses', {
		'ugb--restrict-content-width': show.restrictContent && restrictContentWidth,
		'ugb-header--invert': invert,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-header__item',
	], applyFilters( 'stackable.header.boxclasses', {
		'ugb--full-height': fullHeight,
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
	}, props ) )

	const titleComp = showTitle && ! RichText.isEmpty( title ) &&
		<RichText.Content
			tagName={ titleTag || 'h2' }
			className="ugb-header__title"
			value={ title }
		/>
	const subtitleComp = showSubtitle && ! RichText.isEmpty( subtitle ) &&
		<RichText.Content
			tagName="p"
			className="ugb-header__subtitle"
			value={ subtitle }
		/>
	const buttonComp = showButton && !! buttonText.length &&
		<ButtonEditHelper.Content
			className="ugb-button1"
			attrNameTemplate="button%s"
			blockAttributes={ props.attributes }
		/>
	const button2Comp = showButton2 && //!! button2Text.length &&
		<ButtonEditHelper.Content
			className="ugb-button2"
			attrNameTemplate="button2%s"
			blockAttributes={ props.attributes }
		/>

	const comps = {
		titleComp,
		subtitleComp,
		buttonComp,
		button2Comp,
	}

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
					showBackground={ show.columnBackground }
				>
					<div className="ugb-content-wrapper">
						{ applyFilters( 'stackable.header.save.output', (
							<Fragment>
								{ showTitle && titleComp }
								{ showSubtitle && subtitleComp }
								{ ( showButton || showButton2 ) &&
									<div className="ugb-header__buttons">
										{ showButton && buttonComp }
										{ showButton2 && button2Comp }
									</div>
								}
							</Fragment>
						), design, props, comps ) }
					</div>
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
