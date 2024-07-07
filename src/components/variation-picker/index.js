/**
 * External dependencies
 */
import classnames from 'classnames'
import {
	isPro, showProNotice, i18n,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Button, Placeholder } from '@wordpress/components'
import { layout } from '@wordpress/icons'

// Create our own variation picker
const VariationPicker = props => {
	const {
		icon = layout,
		label = __( 'Choose variation' ), // Dev note: no text domain here since this will use WP's translation.
		instructions = __( 'Select a variation to start with.' ), // Dev note: no text domain here since this will use WP's translation.
		variations,
		onSelect,
		allowSkip,
	} = props

	const classes = classnames( 'block-editor-block-variation-picker', {
		'has-many-variations': variations.length > 4,
	} )

	const hasPremium = variations.some( variation => variation.isPremium )

	return (
		<div className="stk-variation-picker">
			<Placeholder
				icon={ icon }
				label={ label }
				instructions={ instructions }
				className={ classes }
			>
				{	/* eslint-disable jsx-a11y/no-redundant-roles */ }
				<ul
					className="block-editor-block-variation-picker__variations"
					role="list"
					aria-label={ __( 'Block variations' ) } // Dev note: no text domain here since this will use WP's translation.
				>
					{ variations.map( variation => (
						<li key={ variation.name }>
							<Button
								variant="tertiary"
								icon={ variation.pickerIcon || variation.icon }
								iconSize={ 48 }
								onClick={ () => onSelect( variation ) }
								className={ classnames( 'block-editor-block-variation-picker__variation', {
									'is-premium': variation.isPremium,
								} ) }
								label={ variation.description || variation.pickerTitle || variation.title }
								disabled={ ! isPro && variation.isPremium }
							/>
							<span
								className="block-editor-block-variation-picker__variation-label"
								role="presentation"
							>
								{ variation.pickerTitle || variation.title }
							</span>
						</li>
					) ) }
				</ul>
				{ ! isPro && showProNotice && hasPremium && (
					<p className="block-editor-block-variation-picker__notice">
						{ __( 'Upgrade to Premium to get more design variations.', i18n ) }
						&nbsp;
						<a href="https://wpstackable.com/premium/?utm_source=variation-picker&utm_campaign=learnmore&utm_medium=gutenberg" target="_premium">
							{ __( 'Learn more', i18n ) }
						</a>
					</p>
				) }
				{ /* eslint-enable jsx-a11y/no-redundant-roles */ }
				{ allowSkip && (
					<div className="block-editor-block-variation-picker__skip">
						<Button variant="link" onClick={ () => onSelect() }>
							{ __( 'Skip' ) /* Dev note: no text domain here since this will use WP's translation. */ }
						</Button>
					</div>
				) }
			</Placeholder>
		</div>
	)
}

export default VariationPicker
