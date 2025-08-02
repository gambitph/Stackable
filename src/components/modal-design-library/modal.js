/**
 * Internal deprendencies
 */
import HelpSVG from './images/help.svg'
import BlockList from './block-list'
import Button from '../button'
// import AdvancedToolbarControl from '../advanced-toolbar-control'
import DesignLibraryList from '~stackable/components/design-library-list'
import { GuidedModalTour } from '~stackable/components'
import { getDesigns, filterDesigns } from '~stackable/design-library'

/**
 * External deprendencies
 */
import {
	i18n, isPro, devMode,
} from 'stackable'
import classnames from 'classnames'
import { useLocalStorage } from '~stackable/util'

/**
 * WordPress deprendencies
 */
import {
	BaseControl,
	Dashicon,
	Dropdown,
	Modal,
	Spinner,
	ToggleControl,
} from '@wordpress/components'
import { useEffect, useState } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'
import { useBlockColorSchemes } from '~stackable/hooks'
import ColorSchemePreview from '../color-scheme-preview'
import { ColorSchemesHelp } from '../color-schemes-help'
import Tooltip from '../tooltip'

const PLAN_OPTIONS = [ { key: '', label: __( 'All', i18n ) }, { key: 'free', label: __( 'Free', i18n ) }, { key: 'premium', label: __( 'Premium', i18n ) } ]
const popoverProps = {
	className: 'ugb-design-library__color-scheme-popover',
	placement: 'right-start',
	shift: true,
}

// Reset the local storage values for the design library block list.
// This is to make sure that the design library shows "all" at the start.
localStorage?.setItem( 'stk__design_library__block-list__selected', '' )

export const ModalDesignLibrary = props => {
	const {
		backgroundModeColorScheme, containerModeColorScheme, colorSchemesCollection,
	} = useBlockColorSchemes()
	const [ isBusy, setIsBusy ] = useState( true )
	const [ doReset, setDoReset ] = useState( false )

	const [ selectedDesignIds, setSelectedDesignIds ] = useState( [] )
	const [ selectedDesignData, setSelectedDesignData ] = useState( [] )

	const [ isMultiSelectBusy, setIsMultiSelectBusy ] = useState( false )

	const [ selectedTab, setSelectedTab ] = useLocalStorage( 'stk__design_library__block-list__view_by', 'patterns' )
	const [ selectedCategory, setSelectedCategory ] = useLocalStorage( 'stk__design_library__block-list__selected', '' )
	const [ selectedPlan, setSelectedPlan ] = useLocalStorage( 'stk__design_library__view-plan', PLAN_OPTIONS[ 0 ] )

	// The sidebar designs are used to update the list of blocks in the sidebar.
	const [ sidebarDesigns, setSidebarDesigns ] = useState( [] )
	// The display designs are used to list the available designs the user can choose.
	const [ displayDesigns, setDisplayDesigns ] = useState( [] )

	const [ enableBackground, setEnableBackground ] = useState( false )
	const [ selectedContainerScheme, setSelectedContainerScheme ] = useState( '' )
	const [ selectedBackgroundScheme, setSelectedBackgroundScheme ] = useState( '' )

	// For version 4, the default tab is now 'patterns' and for category, we use '' instead of 'All'.
	// So we need to update the local storage values here.
	useEffect( () => {
		const version = window.localStorage.getItem( 'stk__design_library__version' )
		if ( ! version ) {
			window.localStorage.setItem( 'stk__design_library__version', 'v4' )
			setSelectedTab( 'patterns' )
			setSelectedCategory( '' )
		}
	}, [] )

	// Update the designs on the sidebar. (this will trigger the display designs update next)
	useEffect( () => {
		setIsBusy( true )
		if ( doReset ) {
			setSidebarDesigns( [] )
			// setDisplayDesigns( [] )
		}
		getDesigns( {
			reset: doReset,
			tab: selectedTab,
		} ).then( designs => {
			setSidebarDesigns( designs )
		} ).finally( () => {
			setDoReset( false )
			setIsBusy( false )
		} )
	}, [ doReset, selectedTab ] )

	// This updates the displayed designs the user can pick.
	useEffect( () => {
		filterDesigns( {
			library: sidebarDesigns,
			category: selectedCategory,
			plan: selectedPlan.key,
		} ).then( designs => {
			setDisplayDesigns( designs )
		} )
	}, [ sidebarDesigns, selectedPlan, selectedCategory ] )

	const colorSchemeHelpCallback = () => {
		if ( selectedDesignIds.length ) {
			// eslint-disable-next-line no-alert
			const confirmClose = window.confirm( sprintf( __( 'You have one or more designs selected. Navigating to %s will close the Design Library and your current selection will be lost. Do you want to continue?', i18n ), __( 'Color Schemes', i18n ) ) )
			if ( ! confirmClose ) {
				return true
			}
		}
		props.onClose()
		return false
	}

	return (
		<Modal
			title={ __( 'Stackable Design Library', i18n ) }
			headerActions={ (
				<>
					{ /* DEV NOTE: hide for now
					<AdvancedToolbarControl
						className="stk-design-library-tabs"
						fullwidth={ false }
						controls={ [
							{
								value: 'patterns',
								title: __( 'Patterns', i18n ),
							},
							{
								value: 'pages',
								title: __( 'Pages', i18n ),
							},
							{
								value: 'design-system',
								title: __( 'Design System', i18n ),
							},
							{
								value: 'site-kits',
								title: __( 'Site Kits', i18n ),
							},
						] }
						value={ selectedTab }
						onChange={ setSelectedTab }
						isToggleOnly={ true }
						allowReset={ false }
					/> */ }

					<div className="stk-design-library__header-settings">
						{ devMode && (
							<ToggleControl
								label="Dev Mode"
								checked={ !! localStorage.getItem( 'stk__design_library__dev_mode' ) || false }
								onChange={ value => {
									localStorage.setItem( 'stk__design_library__dev_mode', value ? '1' : '' )
									setTimeout( () => {
										document?.querySelector( '.ugb-insert-library-button__wrapper .ugb-insert-library-button' ).click()
									}, 100 )
									props.onClose()
								} }
							/>
						) }
						<Button
							icon="image-rotate"
							iconSize={ 14 }
							label={ __( 'Refresh Library', i18n ) }
							className="ugb-modal-design-library__refresh"
							onClick={ () => setDoReset( true ) }
						/>
						{ ! isPro && <Dropdown
							focusOnMount="container"
							renderToggle={ ( { onToggle } ) => (
								<Button
									onClick={ onToggle }
									style={ { height: 'auto' } }
									icon="arrow-down-alt2"
									iconSize={ 12 }
									iconPosition="right"
									variant="secondary"
								>
									<Dashicon icon="lock" size={ 12 } />
									<span>{ selectedPlan.label }</span>
								</Button>
							) }
							renderContent={ ( { onClose } ) => (
								<div className="stk-design-library__plan-dropdown">
									{ PLAN_OPTIONS.map( ( plan, i ) => {
										return <Button
											key={ i }
											onClick={ () => {
												setSelectedPlan( plan )
												onClose()
											} }
										>
											{ plan.label }
										</Button>
									} ) }
								</div>
							) }
						/> }
					</div>
				</>
			) }
			className={ classnames( 'ugb-modal-design-library', 'ugb-modal-design-library--is-multiselect' ) }
			onRequestClose={ props.onClose }
		>
			<div className="ugb-modal-design-library__wrapper">

				<GuidedModalTour tourId="design-library-welcome" />

				<aside className="ugb-modal-design-library__sidebar">
					<div className="ugb-modal-design-library__filters">
						<BlockList
							designs={ sidebarDesigns }
							viewBy={ selectedTab }
							plan={ selectedPlan.key }
							selected={ selectedCategory }
							onSelect={ id => setSelectedCategory( id ) }
							isBusy={ isBusy }
						/>
					</div>
					<div className="ugb-modal-design-library__style-options">
						<div>
							<h4>{ __( 'Style Options', i18n ) }</h4>
							<Tooltip className="ugb-modal-design-library__style-options-tooltip" placement="top" text={ <>
								{ __( 'Customize patterns using the options below.', i18n ) }
								&nbsp;
								<a href="https://docs.wpstackable.com/article/343-using-the-design-library#Design-Library-Style-Options-Pswi5" target="_docs">
									{ __( 'Learn how to use style options.', i18n ) }
								</a>
							</> }>
								<HelpSVG height="14px" width="14px" />
							</Tooltip>
						</div>
						<ToggleControl
							className="ugb-modal-design-library__enable-background"
							label={ __( 'Section Background', i18n ) }
							checked={ enableBackground }
							onChange={ value => {
								setEnableBackground( value )
							} }
						/>
						<BaseControl
							label={ __( 'Background Scheme', i18n ) }
							className="ugb-modal-design-library__color-scheme-label"
						>
							<Dropdown
								className="ugb-modal-design-library__color-scheme-dropdown"
								popoverProps={ popoverProps }
								focusOnMount="container"
								renderToggle={ ( { onToggle } ) => (
									<Button
										onClick={ onToggle }
										className="ugb-modal-design-library__stk-color-scheme stk-color-scheme__toggle"
									>
										{ selectedBackgroundScheme !== ''
											? <ColorSchemePreview isCollapsed={ true } colors={ colorSchemesCollection[ selectedBackgroundScheme || backgroundModeColorScheme ].desktopColors } />
											: <ColorSchemeTextItem label={ __( 'Default', i18n ) } />
										}
									</Button>
								) }
								renderContent={ ( { onClose } ) => (
									<div>
										<div className="ugb-modal-design-library__stk-color-scheme-list-header">
											<p> { __( 'Background Scheme', i18n ) }</p>
											<Button
												icon="no"
												onClick={ () => {
													onClose()
												} }
											/>
										</div>
										<div className="ugb-modal-design-library__stk-color-scheme-list">
											<Button
												className={ `ugb-modal-design-library__stk-color-scheme${ selectedBackgroundScheme === '' ? ' stk-color-scheme__selected' : '' }` }
												onClick={ () => {
													if ( ! enableBackground ) {
														setEnableBackground( true )
													}
													setSelectedBackgroundScheme( '' )
												} }
											>
												<span className="stk-color-scheme-name stk-color-scheme__none"> { __( 'Default', i18n ) } </span>
											</Button>
											{ Object.entries( colorSchemesCollection ).map( ( [ key, scheme ], i ) => {
												return <Button
													key={ i }
													className={ `ugb-modal-design-library__stk-color-scheme${ selectedBackgroundScheme === key ? ' stk-color-scheme__selected' : '' }` }
													onClick={ () => {
														if ( ! enableBackground ) {
															setEnableBackground( true )
														}
														setSelectedBackgroundScheme( key )
													} }
												>
													<ColorSchemePreview colors={ scheme.desktopColors } isCollapsed={ true } />
													<span className="stk-color-scheme-name"> { scheme.name }</span>
												</Button>
											} ) }
											{ Object.keys( colorSchemesCollection ).length
												? <ColorSchemesHelp customText="" callback={ colorSchemeHelpCallback } className="ugb-design-library__manage-scheme" />
												: <ColorSchemesHelp customText={ __( 'You do not have any color schemes.', i18n ) } callback={ colorSchemeHelpCallback } />
											}
										</div>
									</div>
								) }
							/>
						</BaseControl>
						<BaseControl
							label={ __( 'Container Scheme', i18n ) }
							className="ugb-modal-design-library__color-scheme-label"
						>
							<Dropdown
								popoverProps={ popoverProps }
								focusOnMount="container"
								renderToggle={ ( { onToggle } ) => (
									<Button
										onClick={ onToggle }
										className="ugb-modal-design-library__stk-color-scheme stk-color-scheme__toggle"
									>
										{ selectedContainerScheme !== ''
											? <ColorSchemePreview isCollapsed={ true } colors={ colorSchemesCollection[ selectedContainerScheme || containerModeColorScheme ].desktopColors } />
											: <ColorSchemeTextItem label={ __( 'Default', i18n ) } />
										}
									</Button>
								) }
								renderContent={ ( { onClose } ) => (
									<div>
										<div className="ugb-modal-design-library__stk-color-scheme-list-header">
											<p> { __( 'Container Scheme', i18n ) }</p>
											<Button
												icon="no"
												onClick={ () => {
													onClose()
												} }
											/>
										</div>
										<div className="ugb-modal-design-library__stk-color-scheme-list">
											<Button
												className={ `ugb-modal-design-library__stk-color-scheme${ selectedContainerScheme === '' ? ' stk-color-scheme__selected' : '' }` }
												onClick={ () => {
													setSelectedContainerScheme( '' )
												} }
											>
												<span className="stk-color-scheme-name stk-color-scheme__none"> { __( 'Default', i18n ) } </span>
											</Button>
											{ Object.entries( colorSchemesCollection ).map( ( [ key, scheme ], i ) => {
												return <Button
													key={ i }
													className={ `ugb-modal-design-library__stk-color-scheme${ selectedContainerScheme === key ? ' stk-color-scheme__selected' : '' }` }
													onClick={ () => {
														setSelectedContainerScheme( key )
													} }
												>
													<ColorSchemePreview colors={ scheme.desktopColors } isCollapsed={ true } />
													<span className="stk-color-scheme-name"> { scheme.name } </span>
												</Button>
											} ) }
											{ Object.keys( colorSchemesCollection ).length
												? <ColorSchemesHelp customText="" callback={ colorSchemeHelpCallback } className="ugb-design-library__manage-scheme" />
												: <ColorSchemesHelp customText={ __( 'You do not have any color schemes.', i18n ) } callback={ colorSchemeHelpCallback } />
											}
										</div>
									</div>
								) }
							/>
						</BaseControl>

					</div>
				</aside>

				<DesignLibraryList
					className={ `stk-design-library__item-${ selectedTab }` }
					containerScheme={ selectedContainerScheme }
					backgroundScheme={ selectedBackgroundScheme }
					enableBackground={ enableBackground }
					isBusy={ isBusy }
					designs={ displayDesigns }
					selectedDesigns={ selectedDesignIds }
					selectedDesignData={ selectedDesignData }
					onSelectMulti={ ( designId, category, parsedBlocks, blocksForSubstitution, selectedPreviewSize ) => {
						const newSelectedDesigns = [ ...selectedDesignIds ]
						// We also get the design data from displayDesigns
						// already instead of after clicking the "Add
						// Designs" button since displayDesigns can change
						// when the user is switching tabs (block/ui
						// kits/wireframes) and the data can be lost.
						const newSelectedDesignData = [ ...selectedDesignData ]

						if ( newSelectedDesigns.includes( designId ) ) {
							const i = newSelectedDesigns.indexOf( designId )
							newSelectedDesigns.splice( i, 1 )
							setSelectedDesignIds( newSelectedDesigns )
							newSelectedDesignData.splice( i, 1 )
							setSelectedDesignData( newSelectedDesignData )
						} else {
							newSelectedDesigns.push( designId )
							setSelectedDesignIds( newSelectedDesigns )
							newSelectedDesignData.push( {
								designId, category, designData: parsedBlocks, blocksForSubstitution, selectedPreviewSize,
							} )
							setSelectedDesignData( newSelectedDesignData )
						}
					} }
				/>

				<aside className="ugb-modal-design-library__footer">
					<div>{ sprintf( __( `(%d) Selected`, i18n ), selectedDesignIds.length ) }</div>
					<Button
						label={ __( 'Add Designs', i18n ) }
						className="ugb-modal-design-library__add-multi"
						disabled={ ! selectedDesignIds.length || isMultiSelectBusy }
						onClick={ () => {
							setIsMultiSelectBusy( true )
							const cb = () => setIsMultiSelectBusy( false )
							props.onSelect( selectedDesignData, cb )
						} }
					>
						{ __( 'Add Designs', i18n ) }
						{ isMultiSelectBusy && <Spinner /> }
					</Button>
				</aside>
			</div>
		</Modal>
	)
}

ModalDesignLibrary.defaultProps = {
	search: '',
	onClose: () => {},
	onSelect: () => {},

	hasVersionSwitcher: false,
	apiVersion: '',
	onChangeApiVersion: () => {},
}

const ColorSchemeTextItem = props => {
	return <div style={ { position: 'relative' } }>
		<div style={ { opacity: '0' } }><ColorSchemePreview isCollapsed={ true } /></div>
		<span className="stk-color-scheme-name stk-color-scheme__none"> { props.label } </span>
	</div>
}
