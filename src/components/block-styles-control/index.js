/**
 * External dependencies
 */
import Button from '../button'
import ProControl from '../pro-control'
import { ResetButton } from '../base-control2/reset-button'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	STACKABLE_FILTERS, getFilteredAttributes, isBlockStyleAttributesModified,
} from '~stackable/util'
import { i18n, isPro } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n'
import {
	BaseControl, Modal,
	Dropdown,
	Dashicon,
} from '@wordpress/components'
import {
	Fragment,
	useMemo, useRef, useState,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { getBlockType } from '@wordpress/blocks'
import { applyFilters } from '@wordpress/hooks'

const popoverProps = {
	offset: 6,
	className: 'ugb-block-styles-control__popover',
}

export const BlockStylesControl = props => {
	const { blockName, clientId } = props
	const blockType = getBlockType( blockName )
	const blockAttributesFilter = [ ...( STACKABLE_FILTERS[ blockName ] || [] ), 'uniqueId' ]
	const defaultBlockAttributes = useMemo( () => getFilteredAttributes( blockType.attributes, blockAttributesFilter ), [] )

	const [ openProNoticeModal, setOpenProNoticeModal ] = useState( false )
	const [ openSaveModal, setOpenSaveModal ] = useState( false )
	const initialRender = useRef( true )

	const mainClasses = classnames( [
		'components-panel__body',
		'ugb-block-styles-controls',
	] )

	const {
		blockStyle, modifiedBlockStyle, uniqueId, generatedCss, ...otherAttributes
	} = useBlockAttributesContext()

	const setAttributes = useBlockSetAttributesContext()

	const {
		blockStyleOptions, globalBlockStyles, invalidNames,
	} = useSelect( select => {
		const globalBlockStyles = select( 'stackable/global-block-styles' ).getBlockStyles( blockName )

		const invalidNames = globalBlockStyles.reduce( ( output, item ) => {
			output.add( item.name.toLowerCase() )
			return output
		}, new Set() )

		const blockStyleOptions = globalBlockStyles.reduce( ( options, blockStyle ) => {
			options.push( { label: blockStyle.name, value: blockStyle.slug } )

			return options
		}, [ { label: __( 'Default', i18n ), value: '' } ]
		)

		return {
			blockStyleOptions, globalBlockStyles, invalidNames,
		}
	}, [ clientId ] )

	const isModified = useMemo( () => {
		const modified = isBlockStyleAttributesModified( blockName, blockStyle, otherAttributes, true )
		if ( ! initialRender.current && blockStyle && ! modifiedBlockStyle && modified ) {
			setAttributes( { modifiedBlockStyle: true } )
		} else if ( blockStyle && modifiedBlockStyle && ! modified ) {
			setAttributes( { modifiedBlockStyle: false } )
		}

		if ( initialRender.current ) {
			initialRender.current = false
		}
		return modified
	}, [ blockStyle, otherAttributes ] )

	const { inBlockStyleOptions, blockStyleLabel } = useMemo( () => {
		const selectedIndex = blockStyleOptions.findIndex( item => item.value === blockStyle )

		if ( selectedIndex === -1 ) {
			return { inBlockStyleOptions: false, blockStyleLabel: __( 'Default', i18n ) }
		}

		return { inBlockStyleOptions: true, blockStyleLabel: blockStyleOptions[ selectedIndex ].label }
	}, [ blockStyleOptions, blockStyle ] )

	const SaveUpdateModal = applyFilters( 'stackable.global-settings.global-block-styles.save-update-modal', () => Fragment )
	const SaveUpdateButtons = applyFilters( 'stackable.global-settings.global-block-styles.save-update-buttons', () => Fragment )
	const DropdownOptions = applyFilters( 'stackable.global-settings.global-block-styles.dropdown-options', () => Fragment )

	return (
		<>
			<BaseControl
				className={ mainClasses }
				label={
					<span className="ugb-block-styles-controls__label">
						{ __( 'Style', i18n ) }
						{ ! isPro && <span className="stk-pulsating-circle" role="presentation" /> }
					</span>
				}
			>
				<SaveUpdateButtons
					blockStyle={ blockStyle }
					inOptions={ inBlockStyleOptions }
					isModified={ isModified }
					setOpenSaveModal={ setOpenSaveModal }
				/>
				<Dropdown
					className="ugb-block-styles__select-control"
					popoverProps={ popoverProps }
					focusOnMount="container"
					renderToggle={ ( { onToggle } ) => (
						<Button
							onClick={ () => ! isPro ? setOpenProNoticeModal( true ) : onToggle() }
						>
							<span>{ blockStyleLabel }</span>
							{ isModified && <span>&nbsp;{ `(${ __( 'Modified', i18n ) })` } </span> }
							<span className="ugb-block-styles__dropdown-icon">
								{ ! isPro && <Dashicon icon="lock" size={ 12 } /> }
								<Dashicon icon="arrow-down-alt2" size={ 12 } />
							</span>
						</Button>
					) }
					renderContent={ ( { onClose } ) => (
						<DropdownOptions
							blockStyleOptions={ blockStyleOptions }
							globalBlockStyles={ globalBlockStyles }
							defaultBlockAttributes={ defaultBlockAttributes }
							blockStyle={ blockStyle }
							isModified={ isModified }
							setAttributes={ setAttributes }
							onClose={ onClose }
						/>
					) }
				/>
				<ResetButton
					allowReset={ true }
					value={ isModified }
					default={ false }
					onChange={ () => {
						const blockStyleAttrs = globalBlockStyles.find( item => item.slug === blockStyle )?.attributes

						if ( ! blockStyle || blockStyleAttrs === undefined ) {
							setAttributes( defaultBlockAttributes )
							return
						}

						setAttributes( {
							...defaultBlockAttributes,
							...blockStyleAttrs,
							blockStyle,
						} )
					} }
				/>
			</BaseControl>
			{ openProNoticeModal && <Modal
				className="ugb-block-styles__new-style-modal"
				title={ sprintf( __( '%s Premium Feature', i18n ), __( 'Global Block Styles', i18n ) ) }
				onRequestClose={ () => setOpenProNoticeModal( false ) }
			>
				<ProControl type="global-block-styles" />
			</Modal> }
			<SaveUpdateModal
				openSaveModal={ openSaveModal }
				setOpenSaveModal={ setOpenSaveModal }
				blockName={ blockName }
				invalidNames={ invalidNames }
				blockStyleLabel={ blockStyleLabel }
				attributes={ {
					blockStyle, uniqueId, generatedCss, ...otherAttributes,
				} }
				defaultBlockAttributes={ defaultBlockAttributes }
				globalBlockStyles={ globalBlockStyles }
				setAttributes={ setAttributes }
			/>
		</>
	)
}
