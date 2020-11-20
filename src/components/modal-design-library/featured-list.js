/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Icon, Button, Spinner,
} from '@wordpress/components'
import { useState } from '@wordpress/element'

const FeaturedListItem = ( {
	image,
	title,
	description,
	onClickButton1,
	onClickButton2,
	button1,
	button2,
	showLock,
	itemIsBusy,
	...rest
} ) => {
	const [ showOverlay, setShowOverlay ] = useState( false )

	return (
		<div
			className="ugb-design-library__featured-list-item"
			{ ...rest }
		>
			<div
				className="image-wrapper ugb-shadow-4"
				onMouseEnter={ () => setShowOverlay( true ) }
				onMouseLeave={ () => setShowOverlay( false ) }
			>
				{ showLock && <Icon icon="lock" /> }
				<div className="overlay">
					{ showOverlay && (
						<span>
							{ itemIsBusy && <Spinner /> }
							{ ! itemIsBusy && button1 && <Button className="primary ugb-shadow-7" onClick={ onClickButton1 }>{ button1 }</Button> }
							{ ! itemIsBusy && button2 && <Button className="secondary ugb-shadow-7" onClick={ onClickButton2 }>{ button2 }</Button> }
						</span>
					) }
					<img src={ image } alt={ title } loading="lazy" />
				</div>
			</div>
			<h4>{ title }</h4>
			<p>{ description }</p>
		</div>
	)
}

FeaturedListItem.defaultProps = {
	image: '',
	title: '',
	description: '',
	onClickButton1: () => {},
	onClickButton2: () => {},
	button1: '',
	button2: '',
	showLock: true,
}

const FeaturedList = props => {
	const {
		options,
		columns,
		title,
		isBusy,
		itemIsBusy,
	} = props

	const classNames = classnames( [
		'ugb-design-library__featured-list',
	], {
		[ `ugb-design-library__columns-${ columns }` ]: columns,
	} )
	return (
		<div className={ classNames }>
			{ title && (
				<div className="ugb-design-library__featured-list-title">
					<h2>{ title }</h2>
				</div>
			) }

			{ isBusy && <Spinner /> }

			{ !! options.length && (
				<div className="ugb-design-library__featured-list-wrapper">
					<div className="ugb-design-library__featured-list-content">
						{ ! isBusy && options.map( option => {
							const itemProps = typeof props.itemProps === 'function' ?
								( props.itemProps( option ) || {} ) :
								{}

							return (
								<FeaturedListItem
									itemIsBusy={ itemIsBusy }
									key={ option.id }
									image={ option.image }
									title={ option.label }
									description={ option.description }
									onClickButton1={ itemProps.onClickButton1 ? () => itemProps.onClickButton1( option ) : undefined }
									onClickButton2={ itemProps.onClickButton2 ? () => itemProps.onClickButton2( option ) : undefined }
									{ ...omit( itemProps, [ 'key', 'title', 'description', 'image', 'onClickButton1', 'onClickButton2' ] ) }
								/>
							)
						} ) }
					</div>
				</div>
			) }

			{ ! isBusy && ! options.length && (
				<p className="components-base-control__help" data-testid="nothing-found-note">{ __( 'No designs found.', i18n ) }</p>
			) }
		</div>
	)
}

FeaturedList.defaultProps = {
	options: [],
	columns: 4,
	title: '',
	isBusy: true,
	onSelect: () => {},
	itemProps: () => null,
	itemIsBusy: false,
}

export default FeaturedList
