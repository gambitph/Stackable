/**
 * External dependencies
 */
import classnames from 'classnames'
import { isPro } from 'stackable'

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
		label = __( 'Choose variation' ),
		instructions = __( 'Select a variation to start with.' ),
		variations,
		onSelect,
		allowSkip,
	} = props

	const classes = classnames( 'block-editor-block-variation-picker', {
		'has-many-variations': variations.length > 4,
	} )

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
					aria-label={ __( 'Block variations' ) }
				>
					{ variations.map( variation => (
						<li key={ variation.name }>
							<Button
								variant="secondary"
								icon={ variation.icon }
								iconSize={ 48 }
								onClick={ () => onSelect( variation ) }
								className={ classnames( 'block-editor-block-variation-picker__variation', {
									'is-premium': variation.isPremium,
								} ) }
								label={ variation.description || variation.title }
								disabled={ ! isPro && variation.isPremium }
							/>
							<span
								className="block-editor-block-variation-picker__variation-label"
								role="presentation"
							>
								{ variation.title }
							</span>
						</li>
					) ) }
				</ul>
				{ /* eslint-enable jsx-a11y/no-redundant-roles */ }
				{ allowSkip && (
					<div className="block-editor-block-variation-picker__skip">
						<Button variant="link" onClick={ () => onSelect() }>
							{ __( 'Skip' ) }
						</Button>
					</div>
				) }
			</Placeholder>
		</div>
	)
}

export default VariationPicker
