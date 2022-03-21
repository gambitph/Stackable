/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useDispatch } from '@wordpress/data'
import {
	Fragment, useCallback, useMemo,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { ENTER, SPACE } from '@wordpress/keycodes'
import { applyFilters } from '@wordpress/hooks'
import { EFFECTS } from './list'

const BLOCKS = [
	{
		type: 'container',
		blockNames: [
			'stackable/card',
			'stackable/feature',
		],
	},
	{
		type: 'text',
		blockNames: [
			'stackable/heading',
			'stackable/text',
			'stackable/subtitle',
		],
	},
]

export const Edit = () => {
	const { clientId, name: blockName } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const effectsList = useMemo( () => {
		const block = BLOCKS.find( item => item.blockNames.includes( blockName ) ? item.type : null )
		const effectsSet = EFFECTS.find( ( { effectsType: e } ) => e === block.type )
		return applyFilters( 'stackable.hover-effects.list', effectsSet.effects )
	}, [] )

	const applyEffect = useCallback( value => {
		// Remove existing hover effects
		const arr = {}
		const prevEffect = effectsList.filter( ( { value: v } ) => value !== v && v !== '' )
		prevEffect.forEach( ( item => {
			Object.keys( item?.attributes ).forEach( attr => arr[ attr ] = '' )
		} ) )
		updateBlockAttributes( clientId, arr )
		if ( prevEffect.removeEffect ) {
			prevEffect.removeEffect( clientId )
		}

		// Apply the hover effect.
		const newEffect = effectsList.find( ( { value: v } ) => v === value )
		updateBlockAttributes( clientId, newEffect.attributes )
		if ( newEffect.onApplyEffect ) {
			newEffect.onApplyEffect( clientId )
		}
	}, [ effectsList ] )

	return (
		<Fragment>
			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Effects', i18n ) }
					id="effects"
				>
					{ /* <AdvancedSelectControl
						label={ __( 'Hover Effect', i18n ) }
						attribute="premadeHoverEffect"
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'shadow', label: __( 'Shadow', i18n ) },
							{ value: 'scaleY(1.5px)', label: __( 'Lift', i18n ) },
							{ value: 'liftMore', label: __( 'Lift More', i18n ) },
							{ value: 'liftShadow', label: __( 'Lift w/ Shadow', i18n ) },
							{ value: 'scale', label: __( 'Scale', i18n ) },
							{ value: 'scaleMore', label: __( 'Scale More', i18n ) },
							{ value: 'scaleShadow', label: __( 'Scale w/ Shadow', i18n ) },
							{ value: 'lower', label: __( 'Lower', i18n ) },
							{ value: 'lowerMore', label: __( 'Lower More', i18n ) },
						] }
					/> */ }
					<div className="block-editor-block-styles">
						{ effectsList.map( effect => {
							const { value, label } = effect

							// Don't show premium effects to free users.
							if ( effect.isPremium && ! isPro ) {
								return null
							}

							return (
								<div
									key={ value }
									className="block-editor-block-styles__item"
									onClick={ () => {
										applyEffect( value )
									} }
									onKeyDown={ event => {
										if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
											event.preventDefault()
											applyEffect( value )
										}
									} }
									role="button"
									tabIndex="0"
									aria-label={ label }
								>
									<div
										className="block-editor-block-styles__item-preview stk-block-styles-preview"
										// data-block={ blockName }
										// data-style={ style.name }
									>
										{ /* { Image && <Image className="block-editor-block-styles__icon" /> } */ }
									</div>
									<div className="block-editor-block-styles__item-label">
										{ label }
									</div>
								</div>
							)
						} ) }
					</div>
				</PanelAdvancedSettings>
			</InspectorStyleControls>
		</Fragment>
	)
}
