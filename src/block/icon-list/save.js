/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { BlockContainer, SvgIconHelper } from '~stackable/components'
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

const save = props => {
	const { className, attributes } = props
	const {
		design = '',
		displayAsGrid = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list--v2',
	], applyFilters( 'stackable.icon-list.mainclasses', {
		'ugb-icon-list--display-grid': displayAsGrid,
	}, design, props ) )

	const ListItem = range( 1, 7 ).map( index => {
		const icon = attributes[ `icon${ index }` ]
		const text = attributes[ `text${ index }` ]
		return (
			<li
				className={ `ugb-icon-list__item${ index }` }
				key={ index }
			>
				<SvgIconHelper.Content
					className={ `ugb-icon-list__icon${ index }` }
					attrNameTemplate="icon%s"
					blockAttributes={ props.attributes }
					value={ icon }
				/>
				<RichText.Content
					className={ `ugb-icon-list__text${ index }` }
					tagName="p"
					value={ text }
				/>
			</li> )
	 } )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<ul>
					{ ListItem }
				</ul>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
