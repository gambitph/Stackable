/**
 * External dependencies.
 */
import { getDesign } from '~stackable/design-library'
import ProModal from '../pro-modal'
import { isPro, i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies.
 */
import { Fragment, useState } from '@wordpress/element'
import { Spinner, Dashicon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const DesignLibraryListItem = props => {
	const {
		designId, image, label, onClick, plan, isPro,
	} = props

	const [ isBusy, setIsBusy ] = useState( false )
	const [ isHovered, setIsHovered ] = useState( false )
	// const [ isFavorite, setIsFavorite ] = useState( props.isFavorite )

	const mainClasses = classnames( [
		'ugb-design-library-item',
	], {
		'ugb--is-busy': isBusy,
		[ `ugb--is-${ plan }` ]: ! isPro && plan !== 'free',
	} )

	return (
		<div
			className={ mainClasses }
			onMouseEnter={ () => setIsHovered( true ) }
			onMouseLeave={ () => setIsHovered( false ) }
		>
			{ isBusy && <span className="ugb-design-library-item__spinner" data-testid="spinner"><Spinner /></span> }
			{ ! isPro && plan !== 'free' && <span className="ugb-design-library-item__premium" data-testid="premium-tag">{ plan }</span> }
			<button
				className="ugb-design-library-item__image"
				onClick={ () => {
					if ( ! isPro && plan !== 'free' ) {
						return
					}
					setIsBusy( true )
					getDesign( designId ).then( designData => {
						setIsBusy( false )
						onClick( designData )
					} )
				} }
			>
				<img src={ image } alt={ label } />
			</button>

			<footer>
				{ ( isPro || plan === 'free' ) && <span>{ label }</span> }
				{ ! isPro && ( plan !== 'free' && ! isHovered ) && <span>{ label }</span> }
				{ ! isPro && ( plan !== 'free' && isHovered ) && (
					<ProModal
						buttonClassName="ugb-design-library-item__premium-link"
						button={
							<Fragment>
								<Dashicon icon="external" />
								{ props.premiumLabel }
							</Fragment>
						} />
				) }
				{ /* <FavoriteButton /> */ }
			</footer>
		</div>
	)
}

DesignLibraryListItem.defaultProps = {
	designId: '',
	image: '',
	label: '',
	onClick: () => {},
	plan: 'free',
	isPro,
	premiumLabel: __( 'Go Premium', i18n ),
	// isFavorite: false,
}

export default DesignLibraryListItem
