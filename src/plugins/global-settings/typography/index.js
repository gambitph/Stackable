/**
 * Internal dependencies
 */
import { GlobalTypographyStyles } from './editor-loader'
import TypographyPicker from './typography-picker'

/**
 * External dependencies
 */
import {
	PanelAdvancedSettings, AdvancedSelectControl, ControlSeparator,
} from '~stackable/components'
import { i18n } from 'stackable'
import { omit, head } from 'lodash'

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

export { GlobalTypographyStyles }

const TYPOGRAPHY_TAGS = [
	{
		label: sprintf( __( 'Heading %d', i18n ), 1 ),
		selector: 'h1',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 2 ),
		selector: 'h2',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 3 ),
		selector: 'h3',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 4 ),
		selector: 'h4',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 5 ),
		selector: 'h5',
	},
	{
		label: sprintf( __( 'Heading %d', i18n ), 6 ),
		selector: 'h6',
	},
	{
		label: __( 'Subtitle', i18n ),
		selector: '.stk-subtitle',
		help: (
			<>
				{ sprintf( __( "To apply this typography style, just add `%s` in your block\'s Additional CSS classes. Also make sure that `%s` tag is set to avoid conflict with other typography styles", i18n ), 'stk-subtitle', 'p' ) }
			</> ),
	},
	{
		label: __( 'Body Text', i18n ),
		selector: 'p',
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
				setTypographySettings( ( head( response.stackable_global_typography ) ) || {} )
				setApplySettingsTo( response.stackable_global_typography_apply_to || 'blocks-stackable-native' )
			} )
		} )
	}, [] )

	// When typography styles are changed, trigger our editor style generator to update.
	useEffect( () => {
		doAction( 'stackable.global-settings.typography.update-trigger', typographySettings, applySettingsTo )
	}, [ JSON.stringify( typographySettings ), applySettingsTo ] )

	const changeStyles = ( selector, styles ) => {
		const newSettings = {
			...typographySettings,
			[ selector ]: styles,
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

	const resetStyles = selector => {
		const newSettings = omit( typographySettings, [ selector ] )
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
					<a href="https://docs.wpstackable.com/article/363-how-to-use-global-typography?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
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
				{ TYPOGRAPHY_TAGS.map( ( {
					label, selector, help,
				}, index ) => {
					return (
						<TypographyPicker
							help={ help }
							key={ index }
							label={ label }
							selector={ selector }
							value={ ( typographySettings[ selector ] ) || {} }
							onChange={ value => changeStyles( selector, value ) }
							onReset={ () => resetStyles( selector ) }
						/>
					)
				} ) }
			</PanelAdvancedSettings>
		</Fragment>
	)
} )
