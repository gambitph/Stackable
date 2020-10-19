/**
 * Internal dependencies
 */
import './editor-loader'
import TypographyPicker from './typography-picker'

/**
 * External dependencies
 */
import {
	PanelAdvancedSettings, AdvancedSelectControl, ControlSeparator,
} from '~stackable/components'
import { i18n } from 'stackable'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import { loadPromise, models } from '@wordpress/api'
import {
	addFilter, doAction,
} from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'

const TYPOGRAPHY_TAGS = [
	{
		label: sprintf( __( 'Heading %d', i18n ), 1 ),
		tag: 'h1',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 2 ),
		tag: 'h2',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 3 ),
		tag: 'h3',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 4 ),
		tag: 'h4',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 5 ),
		tag: 'h5',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 6 ),
		tag: 'h6',
	},
	{
		label: __( 'Body Text', i18n ),
		tag: 'p',
	},
]

let saveThrottle = null

addFilter( 'stackable.global-settings.inspector', 'stackable/global-typography', output => {
	const [ typographySettings, setTypographySettings ] = useState( [] )
	const [ applySettingsTo, setApplySettingsTo ] = useState( '' )

	useEffect( () => {
		// Get settings.
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setTypographySettings( ( response.stackable_global_typography && response.stackable_global_typography[ 0 ] ) || {} )
				setApplySettingsTo( response.stackable_global_typography_apply_to || 'blocks-stackable-native' )
			} )
		} )
	}, [] )

	// When typography styles are changed, trigger our editor style generator to update.
	useEffect( () => {
		doAction( 'stackable.global-settings.typography.update-trigger', typographySettings, applySettingsTo )
	}, [ JSON.stringify( typographySettings ), applySettingsTo ] )

	const changeStyles = ( tag, styles ) => {
		const newSettings = {
			...typographySettings,
			[ tag ]: styles,
		}
		setTypographySettings( newSettings )

		// Update the global styles immediately when reset font size is triggered.
		if ( styles && ! styles.fontSize ) {
			doAction( 'stackable.global-settings.typography-update-global-styles', newSettings )
		}

		clearTimeout( saveThrottle )
		saveThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_global_typography: [ newSettings ], // eslint-disable-line
			} )
			model.save()
		}, 500 )
	}

	const resetStyles = tag => {
		const newSettings = omit( typographySettings, [ tag ] )
		setTypographySettings( newSettings )
		doAction( 'stackable.global-settings.typography-update-global-styles', newSettings )

		clearTimeout( saveThrottle )
		saveThrottle = setTimeout( () => {
			const model = new models.Settings( {
				stackable_global_typography: [ newSettings ], // eslint-disable-line
			} )
			model.save()
		}, 500 )
	}

	const changeApplySettingsTo = value => {
		setApplySettingsTo( value )
		const model = new models.Settings( {
			stackable_global_typography_apply_to: value, // eslint-disable-line
		} )
		model.save()
	}

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Global Typography', i18n ) }
				initialOpen={ true }
			>
				<p className="components-base-control__help">
					{ __( 'Change the typography of your headings for all your blocks in your site.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-global-typography/?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Global Typography', i18n ) }
					</a>
				</p>
				<AdvancedSelectControl
					label={ __( 'Apply Typography Styles to', i18n ) }
					options={ [
						{ value: 'blocks-stackable-native', label: __( 'Stackable and native blocks only', i18n ) },
						{ value: 'blocks-stackable', label: __( 'Stackable blocks only', i18n ) },
						{ value: 'blocks-all', label: __( 'Stackable and all other blocks', i18n ) },
					] }
					value={ applySettingsTo }
					onChange={ changeApplySettingsTo }
				/>
				<ControlSeparator />
				{ TYPOGRAPHY_TAGS.map( ( { label, tag }, index ) => {
					return (
						<TypographyPicker
							key={ index }
							label={ label }
							tag={ tag }
							value={ ( typographySettings[ tag ] ) || {} }
							onChange={ value => changeStyles( tag, value ) }
							onReset={ () => resetStyles( tag ) }
						/>
					)
				} ) }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

