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

const FeaturedListItem = props => {
	const {
		image,
		title,
		description,
		onClickButton1,
		onClickButton2,
		button1Href,
		button2Href,
		button1,
		button2,
		showLock,
		itemIsBusy,
		...rest
	} = props

	const [ showOverlay, setShowOverlay ] = useState( false )
	const [ imageLoaded, setImageLoaded ] = useState( false )

	const renderButton1 = button1Href ?
		<a className="primary ugb-shadow-7" href={ button1Href }>{ button1 }</a> :
		<Button className="primary ugb-shadow-7" onClick={ onClickButton1 }>{ button1 }</Button>

	const renderButton2 = button2Href ?
		<a className="secondary ugb-shadow-7" href={ button2Href }>{ button2 }</a> :
		<Button className="secondary ugb-shadow-7" onClick={ onClickButton2 }>{ button2 }</Button>

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
					{ ! imageLoaded && <Spinner className="test" /> }
					{ showOverlay && (
						<span>
							{ itemIsBusy && <Spinner /> }
							{ ! itemIsBusy && button1 && renderButton1 }
							{ ! itemIsBusy && button2 && renderButton2 }
						</span>
					) }
					<img
						className={ ! imageLoaded ? 'loading' : undefined }
						src={ image }
						alt={ title }
						loading="lazy"
						onLoad={ () => setImageLoaded( true ) }
					/>
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
	button1Href: '',
	button2: '',
	button2Href: '',
	showLock: true,
}

const FeaturedList = props => {
	const {
		options,
		columns,
		title,
		isBusy,
		itemIsBusy,
		fallbackText,
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
								( props.itemProps( option ) || {} ) : {}

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

			{ ! isBusy && ! options.length && fallbackText && (
				<p className="components-base-control__help" data-testid="nothing-found-note">{ fallbackText }</p>
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
	fallbackText: __( 'No designs found.', i18n ),
}

export default FeaturedList
