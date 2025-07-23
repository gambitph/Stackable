/**
 * External dependencies
 */
import ProControl from '../pro-control'
import { ResetButton } from '../base-control2/reset-button'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
} from '~stackable/hooks'
import {
	getBlockStyleAttributesFilter, getFilteredAttributes, isBlockStyleAttributesModified,
} from '~stackable/util'
import { i18n, isPro } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	BaseControl, Modal,
	Dashicon,
	SelectControl,
	// eslint-disable-next-line @wordpress/no-unsafe-wp-apis
	__experimentalInputControlSuffixWrapper as InputControlSuffixWrapper,
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

	const [ openProNoticeModal, setOpenProNoticeModal ] = useState( false )
	const [ openSaveModal, setOpenSaveModal ] = useState( false )

	const prevBlockStyleRef = useRef( null )

	const mainClasses = classnames( [
		'components-panel__body',
		'ugb-block-styles-controls',
	] )

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

	const selectOnClick = e => {
		if ( ! isPro ) {
			e.preventDefault()
			setOpenProNoticeModal( true )
		}
	}

	const SaveUpdateModal = applyFilters( 'stackable.global-settings.global-block-styles.save-update-modal', Fragment )
	const SaveUpdateButtons = applyFilters( 'stackable.global-settings.global-block-styles.save-update-buttons', Fragment )

	const selectProps = isPro ? {} : {
		suffix: <InputControlSuffixWrapper style={ { display: 'flex', gap: 4 } }>
			<Dashicon icon="lock" size={ 12 } />
			<Dashicon icon="arrow-down-alt2" size={ 12 } />
		</InputControlSuffixWrapper>,
	}

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
				<SelectControl
					{ ...selectProps }
					value={ blockStyle }
					className={ `ugb-block-styles__select-control${ isModified && inBlockStyleOptions ? ' has-modified' : '' }` }
					onMouseDown={ selectOnClick }
					onKeyDown={ selectOnClick }
					onChange={ option => {
						if ( isPro ) {
							doAction( 'stackable.global-settings.global-block-styles.select-block-style',
								option,	globalBlockStyles, defaultBlockAttributes, setAttributes )
						}
					} }
				>
					<option value="">
						{ __( 'Default', i18n ) }
					</option>
					{ globalBlockStyles.map( ( option, index ) => {
						return <option key={ index } value={ option.slug }>
							{ option.name } { blockStyle === option.slug && inBlockStyleOptions && isModified ? `(${ __( 'Modified', i18n ) })` : '' }
						</option>
					} ) }
				</SelectControl>

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
			</BaseControl>
			{ openProNoticeModal && <Modal
				className="ugb-block-styles__new-style-modal"
				title={ __( 'This Is a Premium Feature', i18n ) }
				onRequestClose={ () => setOpenProNoticeModal( false ) }
			>
				<ProControl type="global-block-styles" />
			</Modal> }
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
