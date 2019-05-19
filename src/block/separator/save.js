import { separators, shadows } from './separators'
import { withBlockStyles, withUniqueClass } from '@stackable/higher-order'
import { applyFilters } from '@wordpress/hooks'
import { BlockContainer } from '@stackable/components'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
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
		`ugb-separator--design-${ design }`,
	], applyFilters( 'stackable.separator.mainclasses', {
		'ugb-separator--flip-vertical': flipVertically,
		'ugb-separator--flip-horizontal': flipHorizontally,
	}, design, props ) )

	const Separator = separators[ design ]
	const Shadow = shadows[ design ]

	return (
		<BlockContainer.Save mainClass={ false } className={ mainClasses } aria-hidden="true" blockProps={ props } render={ () => (
			<Fragment>
				<div className="ugb-separator__top-pad" />
				<div className="ugb-separator__svg-wrapper">
					<div className="ugb-separator__svg-inner">
						{ layer1Shadow && (
							<Shadow className="ugb-separator__shadow" preserveAspectRatio="none" />
						) }
						<Separator
							className="ugb-separator__layer-1"
							preserveAspectRatio="none"
						/>
						{ applyFilters( 'stackable.separator.save.output.layers', null, design, props ) }
					</div>
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
