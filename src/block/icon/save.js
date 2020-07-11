/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	DivBackground,
	SvgIconHelper,
} from '~stackable/components'
import { withUniqueClass, withBlockStyles } from '~stackable/higher-order'
import classnames from 'classnames'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

const save = props => {
	const { attributes, className } = props

	const {
		columns = 1,
		design = 'basic',
		showTitle = false,
		titleTop = false,
		titleTag = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon--v2',
		`ugb-icon--design-${ design }`,
	], applyFilters( 'stackable.icon.mainclasses', {
	}, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className="ugb-icon__content-wrapper">
					{ range( 1, columns + 1 ).map( i => {
						const icon = attributes[ `icon${ i }` ]
						const title = attributes[ `title${ i }` ]
						const url = attributes[ `url${ i }` ]
						const newTab = attributes[ `newTab${ i }` ]
						const noFollow = attributes[ `noFollow${ i }` ]

						const boxClasses = classnames( [
							'ugb-icon__item',
							`ugb-icon__item${ i }`,
						], applyFilters( 'stackable.icon.boxclasses', {}, props ) )

						const IconTag = url ? 'a' : 'div'
						const linkProps = {}
						if ( url ) {
							linkProps.href = url
						}
						if ( newTab ) {
							linkProps.target = '_blank'
							linkProps.rel = 'noopener noreferrer'
							if ( noFollow ) {
								linkProps.rel += ' nofollow'
							}
						} else if ( noFollow ) {
							linkProps.rel = 'nofollow'
						}

						const iconComp = (
							<IconTag className="ugb-icon__icon" { ...linkProps }>
								<SvgIconHelper.Content
									attrNameTemplate="icon%s"
									blockAttributes={ props.attributes }
									value={ icon }
								/>
							</IconTag>
						)

						const titleComp = showTitle && ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName={ titleTag || 'h5' }
								className="ugb-icon__title"
								value={ title }
							/>
						)

						let comps = [ iconComp, titleComp ]
						if ( titleTop ) {
							comps = [ titleComp, iconComp ]
						}

						return (
							<DivBackground
								key={ i }
								className={ boxClasses }
								backgroundAttrName="column%s"
								blockProps={ props }
								showBackground={ show.columnBackground }
							>
								{ comps }
							</DivBackground>
						)
					} ) }
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
