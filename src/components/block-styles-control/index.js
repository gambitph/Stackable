/**
 * External dependencies
 */
import ProControl from '../pro-control'
import { ResetButton } from '../base-control2/reset-button'
import Button from '../button'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	getBlockStyleAttributesFilter,
	getFilteredAttributes,
	isBlockStyleAttributesModified,
	currentUserHasCapability,
} from '~stackable/util'
import { i18n, isPro } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Dashicon,
	Popover,
	PanelBody,
	Flex,
	FlexItem,
} from '@wordpress/components'
import {
	Fragment,
	useEffect,
	useMemo, useRef, useState,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { getBlockType } from '@wordpress/blocks'
import { applyFilters, doAction } from '@wordpress/hooks'

export const BlockStylesControl = props => {
	const { blockName } = props
	const blockType = getBlockType( blockName )
	const blockAttributesFilter = getBlockStyleAttributesFilter( blockName )
	const defaultBlockAttributes = useMemo( () => getFilteredAttributes( blockType.attributes, blockAttributesFilter ), [] )

	const [ openProNotice, setOpenProNotice ] = useState( false )
	const [ openSaveModal, setOpenSaveModal ] = useState( false )
	const [ openPopover, setOpenPopover ] = useState( false )

	const prevBlockStyleRef = useRef( null )
	const buttonRef = useRef( null )
	const popoverOnCloseTimeout = useRef( null )
	const popoverOnCloseRef = useRef( false )

	// Reset openProNotice when the popover is closed
	useEffect( () => {
		if ( ! openPopover ) {
			setOpenProNotice( false )
		}
	}, [ openPopover ] )

	const mainClasses = classnames( [
		'components-panel__body',
		'ugb-block-styles-controls',
	] )

	const proControlClasses = classnames( [
		'ugb-pro-control-button__wrapper',
	], {
		'ugb-pro-control-button--hidden': ! openProNotice,
	} )

	const attributes = useBlockAttributesContext()

	const {
		blockStyle,
		modifiedBlockStyle: isModified,
		uniqueId: _uniqueId,
		generatedCss: _generatedCss,
		...otherAttributes
	} = attributes

	const setAttributes = useBlockSetAttributesContext()

	useEffect( () => {
		if ( prevBlockStyleRef.current === null ) {
			prevBlockStyleRef.current = blockStyle
			return
		}

		if ( prevBlockStyleRef.current !== blockStyle ) {
			prevBlockStyleRef.current = blockStyle
			return
		}

		if ( isModified || ! blockStyle ) {
			return
		}

		const modified = isBlockStyleAttributesModified( blockName, blockStyle, otherAttributes )
		if ( modified ) {
			setAttributes( { modifiedBlockStyle: true } )
		}
	}, [ attributes ] )

	const globalBlockStyles = useSelect( select => {
		const globalBlockStyles = select( 'stackable/global-block-styles' ).getBlockStyles( blockName )
		return globalBlockStyles
	}, [ isModified ] )

	const {
		inBlockStyleOptions, blockStyleLabel, blockStyleAttributes,
	} = useMemo( () => {
		const selectedIndex = globalBlockStyles.findIndex( item => item.slug === blockStyle )

		if ( selectedIndex === -1 ) {
			return { inBlockStyleOptions: false, blockStyleLabel: __( 'Default', i18n ) }
		}

		return {
			inBlockStyleOptions: true,
			blockStyleLabel: globalBlockStyles[ selectedIndex ].name,
			blockStyleAttributes: globalBlockStyles[ selectedIndex ].nonCssAttributes,
		}
	}, [ blockStyle ] )

	const onSelectDefaultBlockStyle = () => {
		setAttributes( { ...defaultBlockAttributes, modifiedBlockStyle: false } )
	}

	const onSelectBlockStyle = option => {
		if ( isPro ) {
			doAction( 'stackable.global-settings.global-block-styles.select-block-style',
				option,	blockStyle, globalBlockStyles, defaultBlockAttributes, setAttributes )
		} else {
			setOpenProNotice( value => ! value )
		}
	}

	const onAddBlockStyle = () => {
		if ( isPro ) {
			doAction( 'stackable.global-settings.global-block-styles.add-block-style', setOpenSaveModal )
		} else {
			setOpenProNotice( value => ! value )
		}
	}

	const SaveUpdateModal = applyFilters( 'stackable.global-settings.global-block-styles.save-update-modal', Fragment )

	return (
		<>
			<div className={ mainClasses } >
				<div
					className={ `ugb-block-styles-controls__wrapper ${ isModified && inBlockStyleOptions ? 'has-modified' : '' }` }
				>
					<Button
						variant="tertiary"
						className="ugb-block-styles-controls__block-style-button"
						size="small"
						icon="edit"
						iconSize={ 12 }
						onClick={ () => {
							// Clicking this button when the popover is open also triggers the popover's `onClose`, so the popover will close automatically.
							if ( ! openPopover && ! popoverOnCloseRef.current ) {
								setOpenPopover( true )
							}
						} }
						ref={ buttonRef }
					>
						{ `${ __( 'Block Style', i18n ) }:` } <wbr /> { blockStyleLabel }{ isModified && inBlockStyleOptions ? <span className="stk-panel-modified-indicator stk--visible"></span> : '' }

					</Button>
					<ResetButton
						allowReset={ true }
						value={ isModified && inBlockStyleOptions }
						default={ false }
						onChange={ () => {
							if ( ! blockStyle || ! inBlockStyleOptions ) {
								setAttributes( defaultBlockAttributes )
								return
							}

							setAttributes( {
								...defaultBlockAttributes,
								...blockStyleAttributes,
								blockStyle,
							} )
						} }
					/>
				</div>
			</div>
			{ openPopover && (
				<Popover
					className="ugb-button-icon-control__popover ugb-block-styles-controls__popover"
					focusOnMount="container"
					onEscape={ () => setOpenPopover( false ) }
					onClose={ () => {
						setOpenPopover( false )
						// This prevents the popover from reopening if the button was clicked
						popoverOnCloseRef.current = true
						clearTimeout( popoverOnCloseTimeout.current )
						popoverOnCloseTimeout.current = setTimeout( () => popoverOnCloseRef.current = false, 100 )
					 } }
					anchor={ buttonRef.current }
					offset={ 8 }
					placement="left-start"
					resize={ false }
				>
					<PanelBody>
						<h2 className="components-panel__body-title">{ __( 'Block Styles', i18n ) }</h2>
						<p className="components-panel__body-description">
							{ __( 'Choose a block style to quickly apply a predefined set of styles to this block.', i18n ) }
						</p>
						<ul className="ugb-block-styles-controls__list">
							<li>
								<Button
									onClick={ () => onSelectDefaultBlockStyle() }
									className={ ! blockStyle ? 'ugb-block-styles-controls__selected' : '' }
								>
									{ ! blockStyle && <span className="ugb-block-styles-controls__selected-icon"> <Dashicon icon="saved" /> </span> }
									<span className="ugb-block-styles-controls__label">{ __( 'Default', i18n ) }</span>
								</Button>
							</li>
							{ globalBlockStyles.map( ( option, index ) => {
								return <li key={ index }>
									<Button
										onClick={ () => onSelectBlockStyle( option.slug ) }
										className={ blockStyle === option.slug ? 'ugb-block-styles-controls__selected' : '' }
									>
										{ blockStyle === option.slug && <span className="ugb-block-styles-controls__selected-icon"> <Dashicon icon="saved" /> </span> }
										<span className="ugb-block-styles-controls__label">
											{ option.name } { blockStyle === option.slug && inBlockStyleOptions && isModified ? `(${ __( 'Modified', i18n ) })` : '' }
										</span>
										{ ! isPro && <Dashicon icon="lock" size={ 12 } /> }
									</Button>
								</li>
							} ) }
						</ul>
						<SaveUpdateButtons
							blockStyle={ blockStyle }
							inOptions={ inBlockStyleOptions }
							isModified={ isModified }
							setOpenSaveModal={ setOpenSaveModal }
							onAddBlockStyle={ onAddBlockStyle }
						/>
						<div className={ proControlClasses } >
							<ProControl type="global-block-styles" />
						</div>

					</PanelBody>
				</Popover>
			) }
			<SaveUpdateModal
				openSaveModal={ openSaveModal }
				setOpenSaveModal={ setOpenSaveModal }
				blockName={ blockName }
				blockStyleLabel={ blockStyleLabel }
				defaultBlockAttributes={ defaultBlockAttributes }
			/>
		</>
	)
}

const SaveUpdateButtons = props => {
	const {
		blockStyle, inOptions, isModified, setOpenSaveModal, onAddBlockStyle,
	} = props
	const [ userCanManageOptions, setUserCanManageOptions ] = useState( false )
	const id = useSelect( select => select( 'core' ).getCurrentUser()?.id, [] )

	useEffect( () => {
		const checkCapabilities = async () => {
			const capabilities = await currentUserHasCapability( 'manage_options' )
			setUserCanManageOptions( capabilities )
		}

		checkCapabilities()
	}, [ id ] )

	const UpdateButton = applyFilters( 'stackable.global-settings.global-block-styles.update-button', Fragment )

	// Do not show the add and update buttons if the user does not have "manage options" capabilities
	if ( ! userCanManageOptions ) {
		return Fragment
	}

	return ( <>
		<Flex style={ { marginTop: '24px' } }>
			<FlexItem>
				<UpdateButton
					blockStyle={ blockStyle }
					inOptions={ inOptions }
					isModified={ isModified }
					setOpenSaveModal={ setOpenSaveModal }
				/>
			</FlexItem>
			<FlexItem>
				<Button
					variant="primary"
					onClick={ () => onAddBlockStyle() }
				>
					{ __( 'Save as New Style', i18n ) }
					{ ! isPro && <span className="stk-pulsating-circle" role="presentation" /> }
				</Button>
			</FlexItem>
		</Flex>
	</> )
}
