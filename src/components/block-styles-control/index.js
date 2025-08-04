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
import { useSelect, dispatch } from '@wordpress/data'
import { getBlockType } from '@wordpress/blocks'
import { applyFilters, doAction } from '@wordpress/hooks'

export const BlockStylesControl = props => {
	const { blockName } = props
	const blockType = getBlockType( blockName )
	const blockAttributesFilter = getBlockStyleAttributesFilter( blockName )
	const defaultBlockAttributes = useMemo( () => getFilteredAttributes( blockType.attributes, blockAttributesFilter ), [] )

	const [ userCanManageOptions, setUserCanManageOptions ] = useState( false )
	const [ openProNotice, setOpenProNotice ] = useState( false )
	const [ openSaveModal, setOpenSaveModal ] = useState( false )
	const [ openPopover, setOpenPopover ] = useState( false )
	const [ focusedIndex, setFocusedIndex ] = useState( 0 )

	const prevBlockStyleRef = useRef( null )
	const buttonRef = useRef( null )
	const blockStylesListRef = useRef( null )
	const blockStyleButtonsRef = useRef( [] )

	const id = useSelect( select => select( 'core' ).getCurrentUser()?.id, [] )

	const attributes = useBlockAttributesContext()
	const setAttributes = useBlockSetAttributesContext()

	const {
		blockStyle,
		modifiedBlockStyle: isModified,
		uniqueId: _uniqueId,
		generatedCss: _generatedCss,
		...otherAttributes
	} = attributes

	const mainClasses = classnames( [
		'components-panel__body',
		'ugb-block-styles-controls',
	] )

	const proControlClasses = classnames( [
		'ugb-pro-control-button__wrapper',
	], {
		'ugb-pro-control-button--hidden': ! openProNotice,
	} )

	// Handle keyboard navigation for block style buttons
	const handleKeyDown = event => {
	// eslint-disable-next-line @wordpress/no-global-active-element
		if ( ! blockStyleButtonsRef.current.includes( document.activeElement ) ) {
			return
		}

		if ( event.key === 'ArrowDown' ) {
			event.preventDefault()
			setFocusedIndex( prevIndex => ( prevIndex + 1 ) % blockStyleButtonsRef.current.length )
		} else if ( event.key === 'ArrowUp' ) {
			event.preventDefault()
			setFocusedIndex( prevIndex => ( prevIndex - 1 + blockStyleButtonsRef.current.length ) % blockStyleButtonsRef.current.length )
		}
	}

	// Update focused block style
	useEffect( () => {
		if ( blockStyleButtonsRef.current[ focusedIndex ] ) {
			blockStyleButtonsRef.current[ focusedIndex ].focus()
		}
	}, [ focusedIndex ] )

	useEffect( () => {
		// Reset openProNotice, focusedIndex, and blockStyleButtonsRef when the popover is closed
		if ( ! openPopover ) {
			setOpenProNotice( false )
			setFocusedIndex( -1 )
			blockStyleButtonsRef.current = []

			return
		}

		const list = blockStylesListRef.current

		if ( ! list ) {
			return
		}

		if ( ! blockStyleButtonsRef.current.length ) {
			blockStyleButtonsRef.current = Array.from( list.querySelectorAll( 'button' ) )
		}

		// Focus on the selected block style button when the popover is opened.
		const selected = list.querySelector( '.ugb-block-styles-controls__selected' )

		if ( selected && blockStyleButtonsRef.current.length ) {
			const index = blockStyleButtonsRef.current.indexOf( selected )
			setFocusedIndex( index )
		}

		list.addEventListener( 'keydown', handleKeyDown )

		return () => {
			if ( list ) {
				list.removeEventListener( 'keydown', handleKeyDown )
			}
		}
	}, [ openPopover ] )

	// Check if the user has "manage options" capabilities and can manage block styles.
	useEffect( () => {
		const checkCapabilities = async () => {
			const capabilities = await currentUserHasCapability( 'manage_options' )
			setUserCanManageOptions( capabilities )
		}

		checkCapabilities()
	}, [ id ] )

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
		setFocusedIndex( 0 )

		// Do nothing if block style is already "Default"
		if ( ! blockStyle ) {
			return
		}

		setAttributes( { ...defaultBlockAttributes, modifiedBlockStyle: false } )

		// Reset to normal state after selecting block style
		dispatch( 'stackable/hover-state' ).updateHoverState( 'normal' )
	}

	const onSelectBlockStyle = ( option, index ) => {
		setFocusedIndex( index )

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
						onMouseDown={ () => setOpenPopover( isOpen => ! isOpen ) }
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
					anchor={ buttonRef.current }
					onEscape={ () => setOpenPopover( false ) }
					onClose={ () => setOpenPopover( false ) }
					focusOnMount={ false }
					placement="left-start"
					resize={ false }
					offset={ 8 }
				>
					<PanelBody>
						<h2 className="components-panel__body-title">{ __( 'Block Styles', i18n ) }</h2>
						<p className="components-panel__body-description">
							{ __( 'Save the styles of this block to reuse on others. You can also update a saved style, and the changes will apply wherever it\'s used.', i18n ) }
							&nbsp;
							<a href="https://docs.wpstackable.com/article/737-how-to-use-block-styles" target="_docs" rel="noreferrer">{ __( 'Learn more', i18n ) }</a>
						</p>
						<ul className="ugb-block-styles-controls__list" ref={ blockStylesListRef }>
							<li>
								<Button
									onClick={ () => onSelectDefaultBlockStyle() }
									className={ ! blockStyle ? 'ugb-block-styles-controls__selected' : '' }
									tabIndex={ 0 }
								>
									{ ! blockStyle && <span className="ugb-block-styles-controls__selected-icon"> <Dashicon icon="saved" /> </span> }
									<span className="ugb-block-styles-controls__label">{ __( 'Default', i18n ) }</span>
								</Button>
							</li>
							{ globalBlockStyles.map( ( option, index ) => {
								return <li key={ index }>
									<Button
										onClick={ () => onSelectBlockStyle( option.slug, index + 1 ) }
										className={ blockStyle === option.slug ? 'ugb-block-styles-controls__selected' : '' }
										tabIndex={ 0 }
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
						{ userCanManageOptions && (
							<SaveUpdateButtons
								blockName={ blockName }
								blockStyle={ blockStyle }
								inOptions={ inBlockStyleOptions }
								isModified={ isModified }
								setOpenSaveModal={ setOpenSaveModal }
								onAddBlockStyle={ onAddBlockStyle }
							/>
						) }
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
	const { onAddBlockStyle, ...propsToPass } = props
	const ActionButtons = applyFilters( 'stackable.global-settings.global-block-styles.action-buttons', Fragment )

	return ( <>
		<Flex style={ { marginTop: '24px' } }>
			<ActionButtons { ...propsToPass } />
			<FlexItem style={ ! props.blockStyle || ! props.inOptions ? { marginLeft: 'auto' } : {} }>
				<Button
					variant="primary"
					onClick={ () => onAddBlockStyle() }
					size="small"
				>
					{ __( 'Save New Block Style', i18n ) }
					{ ! isPro && <span className="stk-pulsating-circle" role="presentation" /> }
				</Button>
			</FlexItem>
		</Flex>
	</> )
}
