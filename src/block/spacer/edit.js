/**
 * External dependencies
 */
import {
	AdvancedRangeControl, BlockContainer, WhenResponsiveScreen,
} from '~stackable/components'
import {
	withBlockStyles, withGoogleFont, withSetAttributeHook, withTabbedInspector, withUniqueClass,
} from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'
import { PanelBody } from '@wordpress/components'

addFilter( 'stackable.spacer.edit.inspector.style.before', 'stackable/spacer', ( output, props ) => {
	const { setAttributes } = props
	const {
		height = '',
		tabletHeight = '',
		mobileHeight = '',
		heightUnit = 'px',
		tabletHeightUnit = 'px',
		mobileHeightUnit = 'px',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<WhenResponsiveScreen>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						units={ [ 'px', 'vh' ] }
						min={ [ 0, 0 ] }
						max={ [ 500, 100 ] }
						step={ [ 1, 1 ] }
						allowReset={ true }
						value={ height }
						unit={ heightUnit }
						onChange={ height => setAttributes( { height } ) }
						onChangeUnit={ heightUnit => setAttributes( { heightUnit } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="tablet">
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						units={ [ 'px', 'vh' ] }
						min={ [ 0, 0 ] }
						max={ [ 500, 100 ] }
						step={ [ 1, 1 ] }
						allowReset={ true }
						value={ tabletHeight }
						unit={ tabletHeightUnit }
						onChange={ tabletHeight => setAttributes( { tabletHeight } ) }
						onChangeUnit={ tabletHeightUnit => setAttributes( { tabletHeightUnit } ) }
					/>
				</WhenResponsiveScreen>
				<WhenResponsiveScreen screen="mobile">
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						units={ [ 'px', 'vh' ] }
						min={ [ 0, 0 ] }
						max={ [ 500, 100 ] }
						step={ [ 1, 1 ] }
						allowReset={ true }
						value={ mobileHeight }
						unit={ mobileHeightUnit }
						onChange={ mobileHeight => setAttributes( { mobileHeight } ) }
						onChangeUnit={ mobileHeightUnit => setAttributes( { mobileHeightUnit } ) }
					/>
				</WhenResponsiveScreen>
			</PanelBody>
		</Fragment>
	)
} )

const edit = props => {
	return <BlockContainer.Edit className={ props.className } blockProps={ props } render={ () => null } />
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector( [ 'style', 'advanced' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
