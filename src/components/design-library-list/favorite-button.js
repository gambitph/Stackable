import { useState } from '@wordpress/element'
import SVGHeart from './images/heart.svg'
import SVGHeartFill from './images/heart-fill.svg'
import classnames from 'classnames'

const FavoriteButton = props => {
	const [ isFavorite, setIsFavorite ] = useState( props.isFavorite )
	// const [ isBusy, setIsBusy ] = useState( true )

	const mainClasses = classnames( [
		'ugb-design-library-item__favorite',
	], {
		'ugb--is-favorite': isFavorite,
		// 'ugb--is-busy': isBusy,
	} )

	return (
		<button
			className={ mainClasses }
			onClick={ () => {
				// setIsBusy( true )
				setIsFavorite( ! isFavorite )
				props.onClick( ! isFavorite )
				// .finally( () => {
				// 	setIsBusy( false )
				// } )
			} }
		>
			{ ! isFavorite && <span role="img" data-testid="empty-icon"><SVGHeart /></span> }
			{ isFavorite && <span role="img" data-testid="filled-icon"><SVGHeartFill /></span> }
		</button>
	)
}

FavoriteButton.defaultProps = {
	isFavorite: false,
	// onClick: () => new Promise( resolve => setTimeout( resolve, 2000 ) ),
	onClick: () => {},
}

export default FavoriteButton

