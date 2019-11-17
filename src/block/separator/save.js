/**
 * External dependencies
 */
import { BlockContainer, Separator } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'

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

const save = props => {
	const { className } = props

	const {
		design = 'wave-1',
		flipVertically = false,
		flipHorizontally = false,
		layer1Shadow = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-separator--v2',
		`ugb-separator--design-${ design }`,
	], applyFilters( 'stackable.separator.mainclasses', {
		'ugb-separator--flip-vertical': flipVertically,
		'ugb-separator--flip-horizontal': flipHorizontally,
	}, design, props ) )

	return (
		<BlockContainer.Save mainClass={ false } className={ mainClasses } aria-hidden="true" blockProps={ props } render={ () => (
			<Fragment>
				<div className="ugb-separator__top-pad" />
				<div className="ugb-separator__svg-wrapper">
					<Separator
						design={ design }
						shadow={ layer1Shadow }
						className="ugb-separator__svg-inner"
					>
						{ applyFilters( 'stackable.separator.edit.output.layers', null, design, props ) }
					</Separator>
				</div>
				<div className="ugb-separator__bottom-pad" />
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
