/**
 * Internal dependencies.
 */
import ProControl from '../pro-control'

/**
 * External dependencies.
 */
import { getDesign } from '~stackable/design-library'
import { isPro, i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies.
 */
import { useState } from '@wordpress/element'
import { Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const DesignLibraryListItem = props => {
	const {
		designId,
		image,
		label,
		onClick,
		plan,
		isPro,
		apiVersion,
		isMultiSelectMode = false,
		selectedNum = false,
	} = props

	const [ isBusy, setIsBusy ] = useState( false )
	// const [ isFavorite, setIsFavorite ] = useState( props.isFavorite )

	const mainClasses = classnames( [
		'ugb-design-library-item',
	], {
		'ugb--is-busy': isBusy,
		[ `ugb--is-${ plan }` ]: ! isPro && plan !== 'free',
		'ugb-design-library-item--toggle': isMultiSelectMode,
		'ugb--is-toggled': isMultiSelectMode && selectedNum,
	} )

	return (
		<div
			className={ mainClasses }
			// Add the number if isToggle is a number, signifying an order instead of just an on/off.
			data-selected-num={ isMultiSelectMode ? selectedNum : undefined }
		>
			{ isBusy && <span className="ugb-design-library-item__spinner" data-testid="spinner"><Spinner /></span> }
			{ ! isPro && plan !== 'free' && <span className="stk-pulsating-circle" role="presentation" /> }
			<button
				className="ugb-design-library-item__image"
				onClick={ () => {
					if ( ! isPro && plan !== 'free' ) {
						return
					}
					if ( isMultiSelectMode ) {
						onClick( designId )
						return
					}
					setIsBusy( true )
					getDesign( designId, apiVersion ).then( designData => {
						const cb = setIsBusy( false )
						onClick( designData, cb )
					} )
				} }
			>
				{ ! isPro && plan !== 'free' && (
					<ProControl
						type="design-library"
						showImage={ false }
						showHideNote={ false }
					/>
				) }
				<img src={ image } alt={ label } loading="lazy" />
			</button>

			<footer>
				<span>{ label }</span>
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
	apiVersion: '',
	// isFavorite: false,
}

export default DesignLibraryListItem
