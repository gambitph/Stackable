import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	BlockContainer,
	ButtonControlsHelper,
	ButtonEdit,
	ContentAlignControl,
	DesignPanelBody,
	PanelAdvancedSettings,
	ProControlButton,
} from '@stackable/components'
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components'
import { withBlockStyles, withGoogleFont, withSetAttributeHook, withTabbedInspector, withUniqueClass } from '@stackable/higher-order'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { createButtonAttributeNames } from '@stackable/util'
import createStyles from './style'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignFullWidth from './images/fullwidth.png'
import ImageDesignGrouped1 from './images/grouped-1.png'
import ImageDesignGrouped2 from './images/grouped-2.png'
import ImageDesignSpread from './images/spread.png'
import { showProNotice } from 'stackable'

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
						label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
					},
					{
						label: __( 'Spread' ), value: 'spread', image: ImageDesignSpread,
					},
					{
						label: __( 'Full Width' ), value: 'fullwidth', image: ImageDesignFullWidth,
					},
					{
						label: __( 'Grouped 1' ), value: 'grouped-1', image: ImageDesignGrouped1,
					},
					{
						label: __( 'Grouped 2' ), value: 'grouped-2', image: ImageDesignGrouped2,
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
			<PanelBody title={ __( 'General' ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Border Radius' ) }
					value={ borderRadius }
					min="0"
					max="50"
					onChange={ borderRadius => {
						setAttributes( {
							button1BorderRadius: borderRadius,
							button2BorderRadius: borderRadius,
							button3BorderRadius: borderRadius,
							borderRadius,
						} )
					} }
					allowReset={ true }
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<SelectControl
					label={ __( 'Collapse Buttons On' ) }
					value={ collapseOn }
					options={ [
						{ value: '', label: __( 'Don\'t collapse' ) },
						{ value: 'tablet', label: __( 'Tablet' ) },
						{ value: 'mobile', label: __( 'Mobile' ) },
					] }
					onChange={ collapseOn => setAttributes( { collapseOn } ) }
				/>
			</PanelBody>
			<PanelBody title={ __( 'Button #1' ) } initialOpen={ true }>
				<ButtonControlsHelper
					attrNameTemplate="button1%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>
			<PanelAdvancedSettings
				title={ __( 'Button #2' ) }
				checked={ showButton2 }
				onChange={ showButton2 => setAttributes( { showButton2 } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button2%s' ),
				] }
				toggleAttributeName="showButton2"
			>
				<ButtonControlsHelper
					attrNameTemplate="button2%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Button #3' ) }
				checked={ showButton3 }
				onChange={ showButton3 => setAttributes( { showButton3 } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button3%s' ),
				] }
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
		button2Size = 'normal',
		button2Text = '',
		button2Shadow = 0,
		button2HoverEffect = '',
		button2Icon = '',
		button2IconPosition = '',
		button2Design = 'basic',
		button3Size = 'normal',
		button3Text = '',
		button3Shadow = 0,
		button3HoverEffect = '',
		button3Icon = '',
		button3IconPosition = '',
		button3Design = 'basic',
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
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
