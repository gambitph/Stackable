import { withBlockStyles, withUniqueClass } from '@stackable/higher-order'
import { applyFilters } from '@wordpress/hooks'
import { BlockContainer } from '@stackable/components'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className } = props
	const {
		icon,
		text,
		columns,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list-wrapper',
	], applyFilters( 'stackable.icon-list.mainclasses', {}, design, props ) )

	const ulClasses = classnames( [
		'ugb-icon-list',
		`ugb-icon--icon-${ icon }`,
		`ugb-icon--columns-${ columns }`,
	], applyFilters( 'stackable.icon-list.ulclasses', {}, design, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<RichText.Content
					tagName="ul"
					className={ ulClasses }
					value={ text }
				/>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
