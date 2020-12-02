/**
 * Internal deprendencies
 */
import Sidebar from './sidebar'
import Cover from './cover'
import ControlSeparator from '../control-separator'
import Topbar from './topbar'
import FeaturedList from './featured-list'

/**
 * External deprendencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import { AdvancedToolbarControl } from '~stackable/components'
import {
	getAllCategories, getUIKits, getDesign,
} from '~stackable/design-library'
import { useLocalStorage } from '~stackable/util'
import { startCase } from 'lodash'

/**
 * WordPress deprendencies
 */
import {
	useState, useEffect, useCallback, Fragment,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
import { Button } from '@wordpress/components'
import ProControl from '~stackable/components/pro-control'

const UIKits = props => {
	const [ styleList, setStyleList ] = useState( [] )
	const [ style, setStyle ] = useState( '' )
	const [ plan, setPlan ] = useState( '' )
	const [ search, setSearch ] = useState( props.search )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ mood, setMood ] = useState( '' )
	const [ doReset, setDoReset ] = useState( false )
	const [ columns, setColumns ] = useState( 3 )
	const [ UIKits, setUIKits ] = useState( [] )
	const [ previewMode, setPreviewMode ] = useState( props.cache.uiKits.preview || null )
	const [ isApplyingDesign, setIsApplyingDesign ] = useState( false )

	const [ searchDebounced, setSearchDebounced ] = useState( search )
	const [ debounceTimeout, setDebounceTimeout ] = useState( null )

	const [ isDevMode, setIsDevMode ] = useLocalStorage( 'stk__design_library_dev_mode', false )

	const contentTitle = search !== '' ? sprintf( __( 'Search result for: "%s"', i18n ), search ) :
		plan !== '' || style !== '' ? sprintf( __( '%s %s UI Kits', i18n ), startCase( plan || '' ), startCase( style || '' ) ).trim() : __( 'All UI Kits', i18n )

	const itemProps = useCallback( option => {
		const showLock = ! isPro && option.plan !== 'free'
		const button1 = __( 'View UI Kit', i18n )
		const onClickButton1 = () => setPreviewMode( option )

		return {
			showLock,
			button1,
			onClickButton1,
		}
	}, [] )

	const onDesignSelect = useCallback( design => {
		if ( ! isPro && design.plan !== 'free' ) {
			return
		}
		setIsApplyingDesign( true )
		getDesign( design.id ).then( designData => {
			setIsApplyingDesign( false )
			props.onSelect( designData )
		} )
	}, [ props.onSelect ] )

	const backButtonOnClick = useCallback( () => {
		setPreviewMode( null )
		props.cache.uiKits.preview = null

		if ( previewMode?.fromBlockDesigns ) {
			props.setActiveTab( 'block-designs' )
		}
	}, [ props.setActiveTab, previewMode ] )

	const previewInnerProps = useCallback( option => {
		const showLock = ! isPro && option.plan !== 'free'
		const button1 = showLock ? undefined : __( 'Add Block', i18n )
		const button2 = showLock ? __( 'Learn More', i18n ) : undefined
		const onClickButton1 = showLock ?
			undefined :
			option => {
				props.cache.hasSelectedUIKit = true
				props.cache.uiKits.preview = previewMode
				onDesignSelect( option )
			}
		const button2Href = showLock ? 'https://wpstackable.com/upgrade/?utm_source=design-library-learn-more&utm_campaign=learnmore&utm_medium=gutenberg' : undefined

		return {
			showLock,
			button1,
			button2,
			button2Href,
			onClickButton1,
		}
	}, [ onDesignSelect, previewMode ] )

	useEffect( () => {
		getAllCategories().then( styles => {
			const _styleList = styles.map( style => ( {
				label: startCase( style ),
				value: style,
			} ) )
			setStyleList( [ { label: __( 'All', i18n ), value: '' }, ..._styleList ] )
		} )
	}, [] )

	useEffect( () => {
		if ( debounceTimeout ) {
			clearTimeout( debounceTimeout )
			setDebounceTimeout( null )
		}
		setDebounceTimeout( setTimeout( () => {
			setSearchDebounced( search )
		}, 500 ) )
	}, [ search ] )

	useEffect( () => {
		if ( doReset ) {
			setUIKits( [] )
			setIsBusy( true )
		}

		getUIKits( {
			mood,
			plan,
			search: searchDebounced,
			reset: doReset,
			style,
		} ).then( _UIKits => {
			setUIKits( _UIKits )
		} ).finally( () => {
			setIsBusy( false )
			setDoReset( false )
		} )
	}, [ style, mood, plan, searchDebounced, doReset ] )
	return (
		<Fragment>
			<aside className="ugb-modal-design-library__sidebar">
				{ ! previewMode && (
					<Fragment>
						<Sidebar
							options={ [
								{
									label: __( 'All UI Kits', i18n ),
									value: '',
								},
								{
									label: __( 'Free UI Kits', i18n ),
									value: 'free',
								},
								{
									label: __( 'Premium UI Kits', i18n ),
									value: 'premium',
								},
							] }
							value={ plan }
							onSelect={ plan => {
								setSearch( '' )
								setPlan( plan )
							} }
						/>

						<ControlSeparator />

						<Sidebar
							title={ __( 'Browse By Style', i18n ) }
							options={ styleList }
							value={ style }
							onSelect={ style => {
								setSearch( '' )
								setStyle( style )
							} }
						/>
					</Fragment>
				) }

				{ !! previewMode && (
					<Fragment>
						<Button
							className="ugb-modal-design-library__back-button"
							isLink
							onClick={ backButtonOnClick }
						>
							{ __( 'Back to UI Kits', i18n ) }
						</Button>
						{ ! isPro && showProNotice &&
							<ProControl
								title={ __( 'Upcoming Feature', i18n ) }
								description={ __( 'Build your website with a few clicks with our upcoming Premium feature that will let you use our predesigned templates with ease.', i18n ) }
								button={ __( 'Get Premium', i18n ) }
								showHideNote={ false }
							/>
						}
					</Fragment>
				) }
			</aside>

			<aside className="ugb-modal-design-library__content">

				{ ! previewMode && (
					<Fragment>
						<Cover
							title={ __( 'Stackable UI Kits', i18n ) }
							description={ __( 'Need to design a website ASAP? We\'ve got you covered with our brand new UI Kit designs.', i18n ) }
							placeholder={ __( 'Ex. Corporate, Minimalist, etc.', i18n ) }
							value={ search }
							onChange={ setSearch }
							color={ [ '#a911b9', '#e54476' ] }
						/>

						<div className="ugb-modal-design-library__content-body">
							<Topbar
								setColumns={ setColumns }
								columns={ setColumns }
								setIsDevMode={ setIsDevMode }
								isDevMode={ isDevMode }
								setDoReset={ setDoReset }
							>
								<AdvancedToolbarControl
									className="ugb-modal-design-library__mood-toolbar"
									controls={ [
										{
											value: '',
											title: __( 'All', i18n ),
										},
										{
											value: 'light',
											title: __( 'Light', i18n ),
										},
										{
											value: 'dark',
											title: __( 'Dark', i18n ),
										},
									] }
									value={ mood }
									onChange={ setMood }
								/>
							</Topbar>

							<FeaturedList
								title={ contentTitle }
								columns={ columns }
								isBusy={ isBusy }
								onSelect={ undefined }
								options={ UIKits }
								itemProps={ itemProps }
							/>
						</div>

					</Fragment>
				) }

				{ !! previewMode && (
					<Fragment>

						<div className="ugb-modal-design-library__content-body">

							{ previewMode.plan === 'premium' && (
								<div className="ugb-modal-design-library__tag">
									{ __( 'Premium', i18n ) }
								</div>
							) }

							<Topbar
								setColumns={ setColumns }
								columns={ columns }
								setIsDevMode={ setIsDevMode }
								isDevMode={ isDevMode }
								setDoReset={ setDoReset }
							>
								<div className="ugb-design-library__ui-kit-title-wrapper">
									<h2 className="ugb-design-library__ui-kit-title">{ previewMode.label }</h2>
									<p className="ugb-design-library__ui-kit-title-description">{ previewMode.description }</p>
									<Button
										disabled
										isSecondary
									>
										{ __( 'Apply UI Kit to Site - Coming Soon!', i18n ) }
									</Button>
								</div>
							</Topbar>

							<FeaturedList
								columns={ columns }
								isBusy={ isBusy }
								onSelect={ onDesignSelect }
								options={ previewMode.blockList }
								itemProps={ previewInnerProps }
								itemIsBusy={ isApplyingDesign }
								fallackText={ __( 'No UI Kits found.', i18n ) }
							/>

						</div>

					</Fragment>
				) }

			</aside>

		</Fragment>
	)
}

export default UIKits
