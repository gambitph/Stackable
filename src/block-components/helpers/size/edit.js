/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AdvancedRangeControl,
	ColorPaletteControl,
	SpacingControl,
	ShadowControl,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useAttributeEditHandlers, useDeviceType } from '~stackable/hooks'

export const SizeControls = props => {
	const deviceType = useDeviceType()

	const {
		getAttribute,
		updateAttributeHandler,
		updateAttributes,
	} = useAttributeEditHandlers( props.attrNameTemplate )

	// TODO: screen picker not working
	return (
		<Fragment>
			{ deviceType === 'Desktop' &&
				<AdvancedRangeControl
					label={ __( 'Min. Block Height', i18n ) }
					units={ [ 'px', 'vh' ] }
					min={ [ 0, 0 ] }
					max={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					screens="all"
					value={ getAttribute( 'height' ) }
					unit={ getAttribute( 'heightUnit' ) }
					onChange={ updateAttributeHandler( 'height' ) }
					onChangeUnit={ updateAttributeHandler( 'heightUnit' ) }
					placeholder="0"
					className="ugb--help-tip-advanced-block-height"
				/>
			}
			{ deviceType === 'Tablet' &&
				<AdvancedRangeControl
					label={ __( 'Min. Block Height', i18n ) }
					units={ [ 'px', 'vh' ] }
					min={ [ 0, 0 ] }
					max={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					screens="all"
					value={ getAttribute( 'heightTablet' ) }
					unit={ getAttribute( 'heightUnitTablet' ) }
					onChange={ updateAttributeHandler( 'heightTablet' ) }
					onChangeUnit={ updateAttributeHandler( 'heightUnitTablet' ) }
					placeholder="0"
					className="ugb--help-tip-advanced-block-height"
				/>
			}
			{ deviceType === 'Mobile' &&
				<AdvancedRangeControl
					label={ __( 'Min. Block Height', i18n ) }
					units={ [ 'px', 'vh' ] }
					min={ [ 0, 0 ] }
					max={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					screens="all"
					allowReset={ true }
					value={ getAttribute( 'Mobile' ) }
					unit={ getAttribute( 'Mobile' ) }
					onChange={ updateAttributeHandler( 'Mobile' ) }
					onChangeUnit={ updateAttributeHandler( 'Mobile' ) }
					placeholder="0"
					className="ugb--help-tip-advanced-block-height"
				/>
			}
		</Fragment>
	)
	// TODO: other controls
}

SizeControls.defaultProps = {
	attrNameTemplate: '%s',
}
