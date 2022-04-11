/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	useBlockContext,
	useAttributeEditHandlers,
} from '~stackable/hooks'

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
// stackable/card: [  ]

export const Edit = props => {
	const { clientId } = useBlockEditContext()
	const {
		getAttribute,
	} = useAttributeEditHandlers()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const { innerBlocks } = useBlockContext()

	const effects = useMemo( () => {
		const blockEffects = applyFilters( 'stackable.hover-effects.list', EFFECTS )
		if ( isPro ) {
			return blockEffects.filter( ( { effectsType: e } ) => props.effects.includes( e ) || e === 'transform' )
		}
		return blockEffects.filter( ( { effectsType: e } ) => props.effects.includes( e ) )
	}, [] )

	const effectsList = [
		{
			value: '',
			label: __( 'None', i18n ),
		},
	]

	effects.forEach( x =>
		x.effects.forEach( effect => {
			effectsList.push( effect )
		} )
	)

	const applyEffect = useCallback( value => {
		const attrHoverEffect = getAttribute( 'premadeHoverEffect' )
		// Remove existing hover effects
		const tempAttr = {}
		const prevEffect = effectsList.find( ( { value: v } ) => attrHoverEffect === v && v !== '' )
		if ( prevEffect ) {
			Object.keys( prevEffect.attributes ).forEach( attrName => {
				tempAttr[ attrName ] = ''
			} )
			updateBlockAttributes( clientId, tempAttr )
			if ( prevEffect.removeEffect ) {
				prevEffect.removeEffect( innerBlocks )
			}
		}

		// Apply the hover effect.
		const newEffect = effectsList.find( ( { value: v } ) => v === value )
		updateBlockAttributes( clientId, newEffect.attributes )
		if ( newEffect.onApplyEffect ) {
			newEffect.onApplyEffect( innerBlocks )
		}
		updateBlockAttributes( clientId, { premadeHoverEffect: value } )
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
