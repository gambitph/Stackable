/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import {
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
// import { useBlockAttributes } from '~stackable/hooks'
// import { useDeviceEditorClasses } from '~stackable/components/resizable-column/use-device-editor-classes'

/**
 * WordPress dependencies
 */
import {
	__, //_x, sprintf,
} from '@wordpress/i18n'
import { useDispatch } from '@wordpress/data'
import {
	Fragment, useCallback, useMemo,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { ENTER, SPACE } from '@wordpress/keycodes'
import { applyFilters } from '@wordpress/hooks'

const EFFECTS = [
	{
		value: '',
		label: __( 'None', i18n ),
	},
	{
		value: 'shadow',
		label: __( 'Shadow', i18n ),
		attributes: {
			containerShadow: 'none',
			containerShadowHover: '0px 10px 60px rgba(0, 0, 0, 0.1)',
		},
	},
	{
		value: 'lift',
		label: __( 'Lift', i18n ),
		attributes: {
			transformHover: 'translateY(-20px)',
		},
	},
	{
		value: 'lift-more',
		label: __( 'Lift More', i18n ),
		attributes: {
			transformHover: 'translateY(-50px)',
		},
	},
]

export const Edit = () => {
	const { clientId, name: blockName } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const applyEffect = useCallback( value => {
		// Remove all existing hover effects.

		// If None, then just remove all hover effects.
		if ( value === '' ) {
			return
		}

		// Apply the hover effect.
		updateBlockAttributes( clientId, EFFECTS.find( ( { value: v } ) => v === value ).attributes )
	}, [] )

	const effectsList = useMemo( () => {
		return applyFilters( 'stackable.hover-effects.list', EFFECTS )
	}, [] )

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
