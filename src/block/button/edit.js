/**
 * External dependencies
 */
import {
	BlockContainer,
	ButtonControlsHelper,
	ContentAlignControl,
	DesignPanelBody,
	PanelAdvancedSettings,
	ProControlButton,
	ButtonEditHelper,
	AdvancedRangeControl,
} from '~stackable/components'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
	withClickOpenInspector,
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
	PanelBody, SelectControl,
} from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
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
				options={ applyFilters( 'stackable.button.edit.layouts', [
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
						label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Grouped', i18n ), 1 ), value: 'grouped-1', image: ImageDesignGrouped1,
					},
					{
						label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Grouped', i18n ), 2 ), value: 'grouped-2', image: ImageDesignGrouped2,
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
				<AdvancedRangeControl
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
					placeholder="12"
					className="ugb--help-tip-button-border-radius"
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
					className="ugb--help-tip-button-collapse"
				/>
			</PanelBody>
			<PanelAdvancedSettings
				title={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button', i18n ), 1 ) }
				initialOpen={ true }
				id="button1"
			>
				<ButtonControlsHelper
					attrNameTemplate="button1%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button', i18n ), 2 ) }
				id="button2"
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
				title={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button', i18n ), 3 ) }
				id="button3"
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
				<ButtonEditHelper
					className="ugb-button1"
					attrNameTemplate="button1%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				{ showButton2 &&
					<ButtonEditHelper
						className="ugb-button2"
						attrNameTemplate="button2%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				}
				{ showButton3 &&
					<ButtonEditHelper
						className="ugb-button3"
						attrNameTemplate="button3%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
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
	withClickOpenInspector( [
		[ '.ugb-button1', 'button1' ],
		[ '.ugb-button2', 'button2' ],
		[ '.ugb-button3', 'button3' ],
	] )
)( edit )
