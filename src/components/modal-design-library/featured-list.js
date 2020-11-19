/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Button, Spinner } from '@wordpress/components'

const FeaturedListItem = ( {
	image,
	title,
	description,
	onClick,
	...rest
} ) => (
	<div className="ugb-design-library__featured-list-item" { ...rest }>
		<Button
			onClick={ onClick }
		>
			<img className="ugb-shadow-6" src={ image } alt={ title } loading="lazy" />
			<h4>{ title }</h4>
			<p>{ description }</p>
		</Button>
	</div>
)

FeaturedListItem.defaultProps = {
	image: '',
	title: '',
	description: '',
	onClick: () => {},
}

const FeaturedList = props => {
	const {
		options,
		columns,
		title,
		isBusy,
		onSelect,
	} = props

	const classNames = classnames( [
		'ugb-design-library__featured-list',
	], {
		[ `ugb-design-library__columns-${ columns }` ]: columns,
	} )
	return (
		<div
			className={ classNames }
		>
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
							return (
								<FeaturedListItem
									key={ option.id }
									image={ option.image }
									title={ option.label }
									description="Sample UI Kit"
									onClick={ () => onSelect( option ) }
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
}

export default FeaturedList
