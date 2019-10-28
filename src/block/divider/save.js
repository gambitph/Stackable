/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { BlockContainer } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

const save = props => {
	const { className } = props
	const {
		design = 'basic',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-divider--v2',
		`ugb-divider--design-${ design }`,
	], applyFilters( 'stackable.divider.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<hr className="ugb-divider__hr" />
				{ ( design === 'dots' || design === 'asterisks' ) &&
					<div className="ugb-divider__dots" aria-hidden="true">
						<div className="ugb-divider__dot"></div>
						<div className="ugb-divider__dot"></div>
						<div className="ugb-divider__dot"></div>
					</div>
				}
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
