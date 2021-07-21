/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	BlockContainer,
	WhenResponsiveScreen,
	BackgroundControlsHelper,
	ControlSeparator,
	PanelAdvancedSettings,
} from '~stackable/components'
import { DivBackground } from '../../components'
import {
	withBlockStyles,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
} from '../../higher-order'
import classnames from 'classnames'

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
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<WhenResponsiveScreen>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						units={ [ 'px', 'vh' ] }
						min={ [ 1, 0 ] }
						max={ [ 500, 100 ] }
						step={ [ 1, 1 ] }
						allowReset={ true }
						value={ height }
						unit={ heightUnit }
						onChange={ height => setAttributes( { height } ) }
						onChangeUnit={ heightUnit => setAttributes( { heightUnit } ) }
						placeholder={ [ 50 ] }
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

				<ControlSeparator />

				<BackgroundControlsHelper
					attrNameTemplate="%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

const edit = props => {
	const mainClasses = classnames( [
		props.className,
		'ugb-spacer--v2',
	] )
	return <BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
		<DivBackground
			className="ugb-spacer--inner"
			backgroundAttrName="%s"
			blockProps={ props }
		/>
	) } />
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector( [ 'style', 'advanced' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
