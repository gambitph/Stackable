/**
 * External dependencies
 */
import {
	BlockContainer,
	ButtonControlsHelper,
	ButtonEdit,
	ContentAlignControl,
	DesignPanelBody,
	PanelAdvancedSettings,
	ProControlButton,
} from '~stackable/components'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
} from '~stackable/higher-order'
import { createButtonAttributeNames } from '~stackable/util'

/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignBasic from './images/basic.png'
import ImageDesignFullWidth from './images/fullwidth.png'
import ImageDesignGrouped1 from './images/grouped-1.png'
import ImageDesignGrouped2 from './images/grouped-2.png'
import ImageDesignSpread from './images/spread.png'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import classnames from 'classnames'
import {
	PanelBody, RangeControl, SelectControl,
} from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { i18n, showProNotice } from 'stackable'
import { addFilter, applyFilters } from '@wordpress/hooks'

addFilter( 'stackable.button.edit.inspector.layout.before', 'stackable/button', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<DesignPanelBody
				initialOpen={ true }
				selected={ design }
				options={ applyFilters( 'stackable.button.edit.designs', [
					{
						label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
					},
					{
						label: __( 'Spread', i18n ), value: 'spread', image: ImageDesignSpread,
					},
					{
						label: __( 'Full Width', i18n ), value: 'fullwidth', image: ImageDesignFullWidth,
					},
					{
						label: __( 'Grouped 1', i18n ), value: 'grouped-1', image: ImageDesignGrouped1,
					},
					{
						label: __( 'Grouped 2', i18n ), value: 'grouped-2', image: ImageDesignGrouped2,
					},
				] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.button.edit.inspector.style.before', 'stackable/button', ( output, props ) => {
	const { setAttributes } = props
	const {
		borderRadius = '',
		collapseOn = '',
		showButton2 = false,
		showButton3 = false,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Border Radius', i18n ) }
					value={ borderRadius }
					min="0"
					max="70"
					onChange={ borderRadius => {
						const attrs = {
							button1BorderRadius: borderRadius,
							borderRadius,
						}
						if ( showButton2 ) {
							attrs.button2BorderRadius = borderRadius
						}
						if ( showButton3 ) {
							attrs.button3BorderRadius = borderRadius
						}
						setAttributes( attrs )
					} }
					allowReset={ true }
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<SelectControl
					label={ __( 'Collapse Buttons On', i18n ) }
					value={ collapseOn }
					options={ [
						{ value: '', label: __( 'Don\'t collapse', i18n ) },
						{ value: 'tablet', label: __( 'Tablet', i18n ) },
						{ value: 'mobile', label: __( 'Mobile', i18n ) },
					] }
					onChange={ collapseOn => setAttributes( { collapseOn } ) }
				/>
			</PanelBody>
			<PanelBody title={ sprintf( __( 'Button #%s', i18n ), 1 ) } initialOpen={ true }>
				<ButtonControlsHelper
					attrNameTemplate="button1%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>
			<PanelAdvancedSettings
				title={ sprintf( __( 'Button #%s', i18n ), 2 ) }
				checked={ showButton2 }
				onChange={ showButton2 => setAttributes( { showButton2 } ) }
				toggleOnSetAttributes={ createButtonAttributeNames( 'button2%s' ) }
				toggleAttributeName="showButton2"
			>
				<ButtonControlsHelper
					attrNameTemplate="button2%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ sprintf( __( 'Button #%s', i18n ), 3 ) }
				checked={ showButton3 }
				onChange={ showButton3 => setAttributes( { showButton3 } ) }
				toggleOnSetAttributes={ createButtonAttributeNames( 'button3%s' ) }
				toggleAttributeName="showButton3"
			>
				<ButtonControlsHelper
					attrNameTemplate="button3%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

const edit = props => {
	const {
		setAttributes, className, attributes,
	} = props
	const {
		design = 'plain',
		tabletContentAlign = '',
		mobileContentAlign = '',
		collapseOn = '',
		showButton2 = false,
		showButton3 = false,
		button1Size = 'normal',
		button1Text = '',
		button1Shadow = 0,
		button1HoverEffect = '',
		button1Icon = '',
		button1IconPosition = '',
		button1Design = 'basic',
		button1HoverGhostToNormal = false,
		button2Size = 'normal',
		button2Text = '',
		button2Shadow = 0,
		button2HoverEffect = '',
		button2Icon = '',
		button2IconPosition = '',
		button2Design = 'basic',
		button2HoverGhostToNormal = false,
		button3Size = 'normal',
		button3Text = '',
		button3Shadow = 0,
		button3HoverEffect = '',
		button3Icon = '',
		button3IconPosition = '',
		button3Design = 'basic',
		button3HoverGhostToNormal = false,
	} = attributes

	const mainClasses = classnames( [
		className,
	], applyFilters( 'stackable.button.mainclasses', {
		'ugb-button--tablet-aligned': tabletContentAlign !== '',
		'ugb-button--mobile-aligned': mobileContentAlign !== '',
		[ `ugb-button--collapse-${ collapseOn }` ]: collapseOn,
		[ `ugb-button--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<ButtonEdit
					className="ugb-button1"
					size={ button1Size !== '' ? button1Size : 'normal' }
					text={ button1Text }
					icon={ button1Icon }
					design={ button1Design !== '' ? button1Design : 'basic' }
					shadow={ button1Shadow }
					hoverEffect={ button1HoverEffect }
					ghostToNormalEffect={ button1HoverGhostToNormal }
					iconPosition={ button1IconPosition }
					onChange={ button1Text => setAttributes( { button1Text } ) }
				/>
				{ showButton2 &&
					<ButtonEdit
						className="ugb-button2"
						size={ button2Size !== '' ? button2Size : 'normal' }
						text={ button2Text }
						icon={ button2Icon }
						design={ button2Design !== '' ? button2Design : 'basic' }
						shadow={ button2Shadow }
						hoverEffect={ button2HoverEffect }
						ghostToNormalEffect={ button2HoverGhostToNormal }
						iconPosition={ button2IconPosition }
						onChange={ button2Text => setAttributes( { button2Text } ) }
					/>
				}
				{ showButton3 &&
					<ButtonEdit
						className="ugb-button3"
						size={ button3Size !== '' ? button3Size : 'normal' }
						text={ button3Text }
						icon={ button3Icon }
						design={ button3Design !== '' ? button3Design : 'basic' }
						shadow={ button3Shadow }
						hoverEffect={ button3HoverEffect }
						ghostToNormalEffect={ button3HoverGhostToNormal }
						iconPosition={ button3IconPosition }
						onChange={ button3Text => setAttributes( { button3Text } ) }
					/>
				}
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
