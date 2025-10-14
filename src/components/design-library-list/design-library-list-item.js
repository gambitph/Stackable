/**
 * Internal dependencies.
 */
import ProControl from '../pro-control'
import Button from '../button'
import { DesignPreview } from './design-preview'
import { useShadowRoot } from './use-shadow-root'
import { usePreviewRenderer } from './use-preview-renderer'
import { useAutoScroll } from './use-auto-scroll'

/**
 * External dependencies.
 */
import { isPro, i18n } from 'stackable'
import classnames from 'classnames'
import { Tooltip } from '~stackable/components'

/**
 * WordPress dependencies.
 */
import {
	useState, useRef, memo,
	useMemo,
} from '@wordpress/element'
import { Dashicon, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const DesignLibraryListItem = memo( props => {
	const {
		shouldRender,
		presetMarks,
		previewProps,
		isMultiSelectBusy,
	} = props

	const {
		selectedTab, selectedNum, selectedData, plan, label,
	} = previewProps

	const spacingSize = Array.isArray( presetMarks ) && presetMarks.length >= 2
		? presetMarks[ presetMarks.length - 2 ].value
		: 120

	const [ isLoading, setIsLoading ] = useState( true )
	const [ selected, setSelected ] = useState( false )

	const {
		hostRef, shadowRoot, stylesLoaded,
	} = useShadowRoot( shouldRender )

	const ref = useRef( null )

	const {
		blocks, enableBackground,
		shadowBodySizeRef, blocksForSubstitutionRef,
		previewSize, onClickDesign,
		updateShadowBodySize,
	} = usePreviewRenderer( previewProps, shouldRender, spacingSize,
		ref, hostRef, shadowRoot, setIsLoading, stylesLoaded )

	const {
		onMouseOut, onMouseOver, onMouseDown,
	} = useAutoScroll( hostRef, shadowBodySizeRef, selectedTab )

	const designPreviewSize = useMemo( () => {
		const tempHeight = selectedTab === 'pages' ? 345 : 100

		const previewHeight = selectedNum && selectedData ? selectedData.selectedPreviewSize.preview
			: ( enableBackground ? previewSize.heightBackground : previewSize.heightNoBackground )

		if ( ! blocks || ! previewHeight ) {
			return tempHeight
		}

		return previewHeight
	}, [ selectedTab, selectedNum, selectedData, previewSize, blocks, enableBackground ] )

	const mainClasses = classnames( [
		'ugb-design-library-item',
		'ugb-design-library-item--toggle',
	], {
		[ `ugb--is-${ plan }` ]: ! isPro && plan !== 'free',
		'ugb--is-toggled': selectedNum,
		'ugb--is-hidden': ! shouldRender,
	} )

	const onClickHost = e => {
		e.stopPropagation()
		onClickDesign()
	}

	const buttonAttributes = {
		tabIndex: 0,
		role: 'button',
		onClick: onClickHost,
	}

	return (
		// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
		<div
			className={ mainClasses }
			ref={ ref }
			onMouseOut={ onMouseOut }
			onMouseOver={ onMouseOver }
			{ ...( selectedTab === 'patterns' ? buttonAttributes : {} ) }
		>
			{ ! isPro && plan !== 'free' && <span className="stk-pulsating-circle" role="presentation" /> }
			<div style={ { position: 'relative' } } className={ `stk-block-design__design-container ${ designPreviewSize > 100 ? 'stk--design-preview-large' : 'stk--design-preview-small' }` }>
				{ ! isPro && plan !== 'free' && (
					<ProControl
						type="design-library"
						showImage={ false }
						showHideNote={ false }
					/>
				) }
				{ isPro && applyFilters( 'stackable.design-library.pattern-actions', previewProps ) }
				<div className={ `stk-spinner-container ${ isLoading || ! shouldRender ? '' : 'stk-hide-spinner' }` }><Spinner /></div>
				<div
					className="stk-block-design__host-container"
					style={ {
						transform: `scale(${ selectedNum && selectedData ? selectedData.selectedPreviewSize.scale : previewSize?.scale })`,
						transformOrigin: 'top left',
						height: designPreviewSize,
					} }
				>
					<div className="stk-block-design__host" ref={ hostRef }>
						{ shouldRender && shadowRoot && <DesignPreview
							blocks={ blocks }
							shadowRoot={ shadowRoot }
							selectedTab={ selectedTab }
							designIndex={ props.designIndex }
							onMouseDown={ onMouseDown }
							updateShadowBodySize={ updateShadowBodySize }
							setIsLoading={ setIsLoading }
						/> }
					</div>
				</div>
			</div>

			{ /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */ }
			<footer
				// Add the number if isToggle is a number, signifying an order instead of just an on/off.
				data-selected-num={ selectedNum }
				{ ...( selectedTab === 'saved' ? buttonAttributes : {} ) }
			>
				<div>
					<h4> { label } </h4>
					{ blocksForSubstitutionRef.current !== false && blocksForSubstitutionRef.current.size !== 0 &&
						<Tooltip text={ __( 'This design contains disabled blocks. You can still insert this design with blocks substituted with other enabled blocks.', i18n ) }>
							<Dashicon icon="warning" size={ 16 } />
						</Tooltip>
					}
				</div>
				<div>
					{ selectedNum !== 0 &&
						<Tooltip text={ __( 'Style options are locked for this design because it is selected.', i18n ) }>
							<Dashicon icon="editor-help" size={ 16 } />
						</Tooltip>
					}
					{ selectedTab !== 'pages' ? <span className="stk-block-design__selected-num">{ selectedNum === 0 ? '' : selectedNum }</span>
						: <div>
							<Button
								label={ __( 'Insert', i18n ) }
								className={ `ugb-modal-design-library__add-multi ${ selected ? 'stk--is-selected' : '' }` }
								disabled={ isMultiSelectBusy }
								onClick={ () => {
									setSelected( true )
									onClickDesign()
								} }
							>
								{ __( 'Insert', i18n ) }
								{ isMultiSelectBusy && <Spinner /> }
							</Button>
						</div>
					}
				</div>
			</footer>
		</div>
	)
} )

DesignLibraryListItem.defaultProps = {
	designId: '',
	image: '',
	label: '',
	onClick: () => {},
	plan: 'free',
	premiumLabel: __( 'Go Premium', i18n ),
}

export default DesignLibraryListItem
