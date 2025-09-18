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
import { usePresetControls } from '~stackable/hooks'
import { isPro, i18n } from 'stackable'
import classnames from 'classnames'
import { Tooltip } from '~stackable/components'

/**
 * WordPress dependencies.
 */
import { forwardRef, useState } from '@wordpress/element'
import { Dashicon, Spinner } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const DesignLibraryListItem = forwardRef( ( props, ref ) => {
	const {
		label,
		plan,
		selectedNum = false,
		selectedData = null,
		previewSize,
		previewProps,
		selectedTab,
		isMultiSelectBusy,
	} = props

	const presetMarks = usePresetControls( 'spacingSizes' )?.getPresetMarks() || null

	const spacingSize = ! presetMarks || ! Array.isArray( presetMarks ) ? 120 : presetMarks[ presetMarks.length - 2 ].value

	const [ isLoading, setIsLoading ] = useState( true )

	const { hostRef, shadowRoot } = useShadowRoot()

	const {
		blocks, enableBackground,
		shadowBodySizeRef, blocksForSubstitutionRef,
		onClickDesign,
	} = usePreviewRenderer(
		previewProps, previewSize, plan, spacingSize,
		selectedTab, selectedNum, selectedData,
		ref, hostRef, shadowRoot, setIsLoading,
	)

	const {
		onMouseOut, onMouseOver, onMouseDown,
	} = useAutoScroll( hostRef, shadowBodySizeRef, selectedTab )

	const getDesignPreviewSize = () => {
		if ( ! shadowRoot || isLoading ) {
			return 0
		}

		return selectedNum && selectedData ? selectedData.selectedPreviewSize.preview
			: ( enableBackground ? previewSize.heightBackground : previewSize.heightNoBackground )
	}

	const mainClasses = classnames( [
		'ugb-design-library-item',
		'ugb-design-library-item--toggle',
	], {
		[ `ugb--is-${ plan }` ]: ! isPro && plan !== 'free',
		'ugb--is-toggled': selectedNum,
	} )

	const onClickHost = e => {
		e.stopPropagation()
		if ( selectedTab === 'pages' ) {
			return
		}
		onClickDesign()
	}

	return (
		// eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
		<button
			className={ mainClasses }
			ref={ ref }
			onClick={ onClickHost }
			onMouseOut={ onMouseOut }
			onMouseOver={ onMouseOver }
		>
			{ ! isPro && plan !== 'free' && <span className="stk-pulsating-circle" role="presentation" /> }
			<div style={ { position: 'relative' } } className={ `${ getDesignPreviewSize() > 100 ? 'stk--design-preview-large' : 'stk--design-preview-small' }` }>
				{ ! isPro && plan !== 'free' && (
					<ProControl
						type="design-library"
						showImage={ false }
						showHideNote={ false }
					/>
				) }
				{ isLoading && <div className="stk-spinner-container"><Spinner /></div> }
				<div
					className="stk-block-design__host-container"
					style={ {
						transform: `scale(${ selectedNum && selectedData ? selectedData.selectedPreviewSize.scale : previewSize?.scale })`,
						transformOrigin: 'top left',
						height: getDesignPreviewSize(),
					} }
				>
					<div className="stk-block-design__host" ref={ hostRef }>
						{ shadowRoot && ! isLoading && <DesignPreview
							blocks={ blocks }
							shadowRoot={ shadowRoot }
							selectedTab={ selectedTab }
							onMouseDown={ onMouseDown }
						/> }
					</div>
				</div>
			</div>

			<footer
				// Add the number if isToggle is a number, signifying an order instead of just an on/off.
				data-selected-num={ selectedNum }
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
							<Dashicon icon="lock" size={ 16 } />
						</Tooltip>
					}
					{ selectedTab === 'patterns' ? <span className="stk-block-design__selected-num">{ selectedNum === 0 ? '' : selectedNum }</span>
						: <div>
							<Button
								label={ __( 'Insert', i18n ) }
								className="ugb-modal-design-library__add-multi"
								disabled={ isMultiSelectBusy }
								onClick={ () => onClickDesign() }
							>
								{ __( 'Insert', i18n ) }
								{ isMultiSelectBusy && <Spinner /> }
							</Button>
						</div>
					}
				</div>
			</footer>
		</button>
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
