/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	ContentAlignControl,
	AdvancedRangeControl,
	SvgIconPlaceholder,
	DivBackground,
	IconControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	HeadingButtonsControl,
	ColorPaletteControl,
	ResponsiveControl,
	AlignButtonsControl,
	ControlSeparator,
	PanelSpacingBody,
	UrlInputPopover,
} from '~stackable/components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '~stackable/higher-order'
import {
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	numShapesInSvg,
} from '~stackable/util'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { pick, range } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	PanelBody, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'

addFilter( 'stackable.icon.edit.inspector.style.before', 'stackable/icon', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		showTitle = false,
		titleTop = false,
		titleTag = '',
		titleColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<AdvancedRangeControl
					label={ __( 'Number of Icons / Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 8 }
					placeholder="1"
					className="ugb--help-tip-general-columns"
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			<PanelAdvancedSettings
				title={ __( 'Icon', i18n ) }
				id="icon"
				hasToggle={ false }
			>
				<IconControlsHelper
					attrNameTemplate="icon%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					onChangeIcon={ false }
					numPaths={
						// Get the most number of shapes in the SVG.
						Math.max(
							...Object.values(
								pick( props.attributes, [ 'icon1', 'icon2', 'icon3', 'icon4', 'icon5', 'icon6', 'icon7', 'icon8' ] )
							).map( icon => {
								return numShapesInSvg( icon ) || 1
							} )
						)
					}
				/>
				{ show.iconAlign &&
					<ControlSeparator />
				}
				{ show.iconAlign &&
					<ResponsiveControl
						attrNameTemplate="Icon%sAlign"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							className="ugb--help-tip-alignment-icon"
						/>
					</ResponsiveControl>
				}
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'title%s' ),
					'titleTag',
					'titleColor',
					...createResponsiveAttributeNames( 'Title%sAlign' ),
				] }
				toggleAttributeName="showTitle"
			>
				<ToggleControl
					label={ __( 'Title on Top', i18n ) }
					checked={ titleTop }
					onChange={ titleTop => setAttributes( { titleTop } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<HeadingButtonsControl
					value={ titleTag || 'h5' }
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<ColorPaletteControl
					value={ titleColor }
					onChange={ titleColor => setAttributes( { titleColor } ) }
					label={ __( 'Title Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Title%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				<ResponsiveControl
					attrNameTemplate="icon%sBottomMargin"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Icon', i18n ) }
						min={ -50 }
						max={ 100 }
						allowReset={ true }
						className="ugb--help-tip-spacing-icon"
					/>
				</ResponsiveControl>
				{ show.titleSpacing && (
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				) }
			</PanelSpacingBody>
		</Fragment>
	)
} )

const Edit = props => {
	const {
		className,
		setAttributes,
		attributes,
		isSelected,
	} = props

	const {
		design = 'basic',
		columns = 1,
		showTitle = false,
		titleTop = false,
		titleTag = '',
	} = props.attributes

	const [ selected, setSelected ] = useState( false )
	const [ urlPopupPosition, setUrlPopupPosition ] = useState( 'bottom center' )
	const [ refreshPositionInterval, setRefreshPositionInterval ] = useState( null )

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-icon--design-${ design }`,
	], applyFilters( 'stackable.icon.mainclasses', {
	}, props ) )

	// Updates the position of the url popup to be opposite of the icon popup.
	const refreshPosition = () => {
		const popover = document.querySelector( '.ugb-icon-popover' )
		if ( popover ) {
			if ( popover.classList.contains( 'is-from-top' ) ) {
				setUrlPopupPosition( 'top center' )
			} else if ( popover.classList.contains( 'is-from-bottom' ) ) {
				setUrlPopupPosition( 'bottom center' )
			}
		}
	}

	// Always try and check for the popup position changes since. We do it this
	// way since we may miss scroll events.
	useEffect( () => {
		if ( isSelected && ! refreshPositionInterval ) {
			setRefreshPositionInterval( setInterval( refreshPosition, 500 ) )
		} else if ( ! isSelected && refreshPositionInterval ) {
			clearInterval( refreshPositionInterval )
			setRefreshPositionInterval( null )
		}
		return () => {
			if ( refreshPositionInterval ) {
				clearInterval( refreshPositionInterval )
			}
		}
	}, [ isSelected ] )

	// Check if the icon popover's position is top or bottom then adjust
	// the url popup's position.
	const onIconPopupToggle = isOpen => {
		if ( isOpen ) {
			const popover = document.querySelector( '.ugb-icon-popover' )

			// We need to use mutation observer here because the is-from-top
			// class is added afterwards and there's no way to detect it in JS.
			const observer = new MutationObserver( () => {
				if ( popover.classList.contains( 'is-from-top' ) ) {
					setUrlPopupPosition( 'top center' )
					observer.disconnect()
				} else if ( popover.classList.contains( 'is-from-bottom' ) ) {
					setUrlPopupPosition( 'bottom center' )
					observer.disconnect()
				}
			} )

			observer.observe( popover, { attributes: true } )
		}
	}

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className="ugb-icon__content-wrapper">
					{ range( 1, columns + 1 ).map( i => {
						const icon = attributes[ `icon${ i }` ]
						const title = attributes[ `title${ i }` ]

						const boxClasses = classnames( [
							'ugb-icon__item',
							`ugb-icon__item${ i }`,
						], applyFilters( 'stackable.icon.boxclasses', {}, props ) )

						const iconComp = (
							<div className="ugb-icon__icon">
								<SvgIconPlaceholder
									attrNameTemplate="icon%s"
									blockAttributes={ props.attributes }
									value={ icon }
									onChange={ value => setAttributes( { [ `icon${ i }` ]: value } ) }
									onToggle={ onIconPopupToggle }
								/>
							</div>
						)

						const titleComp = showTitle &&
							<RichText
								tagName={ titleTag || 'h5' }
								className="ugb-icon__title"
								value={ title }
								placeholder={ __( 'Title', i18n ) }
								onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
								keepPlaceholderOnFocus
							/>

						let comps = [ iconComp, titleComp ]
						if ( titleTop ) {
							comps = [ titleComp, iconComp ]
						}

						return (
							<DivBackground
								className={ boxClasses }
								backgroundAttrName="column%s"
								blockProps={ props }
								showBackground={ show.columnBackground }
								onClick={ () => setSelected( i ) }
								key={ i }
							>
								{ comps }
								{ isSelected && selected === i &&
									<UrlInputPopover
										value={ attributes[ `url${ i }` ] }
										onChange={ value => setAttributes( { [ `url${ i }` ]: value } ) }
										newTab={ attributes[ `newTab${ i }` ] }
										noFollow={ attributes[ `noFollow${ i }` ] }
										onChangeNewTab={ value => setAttributes( { [ `newTab${ i }` ]: value } ) }
										onChangeNoFollow={ value => setAttributes( { [ `noFollow${ i }` ]: value } ) }
										position={ urlPopupPosition }
									/>
								}
							</DivBackground>
						)
					} ) }
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Icon%sAlign', 'Title%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-icon__item', 'column-background' ],
		[ '.ugb-icon-inner-svg svg', 'icon' ],
		[ '.ugb-icon__title', 'title' ],
	] ),
)( Edit )
