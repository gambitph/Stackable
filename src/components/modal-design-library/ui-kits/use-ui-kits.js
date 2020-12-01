/**
 * UI Kits tab books.
 */

/**
 * External deprendencies
 */
import {
	getAllCategories, getUIKits, getDesign,
} from '~stackable/design-library'
import { useLocalStorage } from '~stackable/util'
import { startCase } from 'lodash'
import { i18n, isPro } from 'stackable'

/**
 * WordPress deprendencies
 */
import {
	useState, useEffect, useMemo, useCallback,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'

const useUIKits = props => { //eslint-disable-line
	const [ styleList, setStyleList ] = useState( [] )
	const [ style, _setStyle ] = useState( '' )
	const [ plan, _setPlan ] = useState( '' )
	const [ search, _setSearch ] = useState( props.search )
	const [ isBusy, setIsBusy ] = useState( true )
	const [ mood, setMood ] = useState( '' )
	const [ doReset, setDoReset ] = useState( false )
	const [ columns, setColumns ] = useState( 3 )
	const [ UIKits, setUIKits ] = useState( [] )
	const [ previewMode, setPreviewMode ] = useState( props.cache.uiKits.preview || null )
	const [ isApplyingDesign, setIsApplyingDesign ] = useState( false )
	const [ contentTitle, setContentTitle ] = useState( __( 'All UI Kits', i18n ) )

	const [ searchDebounced, setSearchDebounced ] = useState( search )
	const [ debounceTimeout, setDebounceTimeout ] = useState( null )

	const [ isDevMode, setIsDevMode ] = useLocalStorage( 'stk__design_library_dev_mode', false )

	const options = useMemo( () => [
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
	], [] )

	const setPlan = useCallback( plan => {
		setContentTitle( options.find( option => option.value === plan ).label )
		_setSearch( '' )
		_setPlan( plan )
	}, [ JSON.stringify( options ) ] )

	const setStyle = useCallback( block => {
		setContentTitle( sprintf( __( '%s UI Kits', i18n ),
			styleList.find( option => option.value === block ).label ) )
		_setSearch( '' )
		_setStyle( block )
	}, [ JSON.stringify( styleList ) ] )

	const setSearch = useCallback( search => {
		setContentTitle( sprintf( __( 'Search result for: "%s"', i18n ), search ) )
		if ( search === '' ) {
			setContentTitle( options.find( option => option.value === plan ).label )
		}
		_setSearch( search )
	}, [ JSON.stringify( options ) ] )

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
				props.cache.lastUIKit = previewMode
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

	return {
		styleList,
		style,
		setStyle,
		search,
		setSearch,
		setPlan,
		plan,
		contentTitle,
		options,
		mood,
		setMood,
		columns,
		UIKits,
		setColumns,
		isBusy,
		isDevMode,
		setIsDevMode,
		setDoReset,
		itemProps,
		previewMode,
		setPreviewMode,
		isApplyingDesign,
		previewInnerProps,
		backButtonOnClick,
	}
}

export default useUIKits
