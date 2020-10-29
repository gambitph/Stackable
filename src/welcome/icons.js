import SVGNoticeIcon from './images/notice.svg'
import SVGCheckIcon from './images/check.svg'
import SVGCrossIcon from './images/cross.svg'
import {
	i18n,
	iconsIsFAPluginActive,
	iconsIsFAProEnabled,
	iconsFAProError,
	iconsFaKit,
} from 'stackable'

/**
 * WordPress Dependencies
 */
import domReady from '@wordpress/dom-ready'
import {
	Fragment, render, useState, useEffect, RawHTML,
} from '@wordpress/element'
import { Spinner } from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { loadPromise, models } from '@wordpress/api'

const IconSettings = () => {
	const [ showField, setShowField ] = useState( ! iconsIsFAPluginActive || iconsFaKit )
	const [ hideFAError, setHideFAError ] = useState( true )
	const [ faKit, setFaKit ] = useState( '' )
	const [ faKitIsValid, setFaKitIsValid ] = useState( null )
	const [ version, setVersion ] = useState( 'latest' )
	const [ license, setLicense ] = useState( '' )
	const [ isBusy, setIsBusy ] = useState( false )
	const [ isSaving, setIsSaving ] = useState( false )
	const [ isDirty, setIsDirty ] = useState( false )
	const [ isLoading, setIsLoading ] = useState( true )

	// Load the settings.
	useEffect( () => {
		setIsBusy( true )
		loadPromise.then( () => {
			const settings = new models.Settings()
			settings.fetch().then( response => {
				setHideFAError( response.stackable_icons_dont_show_fa_error )
				setFaKit( response.stackable_icons_fa_kit )
				setIsBusy( false )
				setIsLoading( false )
				if ( response.stackable_icons_fa_kit ) {
					setShowField( true )
				}
			} )
		} )
	}, [] )

	const updateSetting = ( setting, value ) => {
		setIsBusy( true )
		const model = new models.Settings( { [ setting ]: value } )
		model.save().then( () => setIsBusy( false ) )
	}

	const onClickShowCode = () => {
		setShowField( true )
	}

	const onClickDontShowAgain = () => {
		updateSetting( 'stackable_icons_dont_show_fa_error', '1' )
		setShowField( true )
	}

	const verifyKit = () => {
		let value = faKit
		setIsBusy( true )
		if ( faKit.match( /.js/ ) ) {
			const match = faKit.match( /([\d\w]+).js/ )
			if ( match ) {
				value = match[ 1 ]
				setFaKit( value )
			}
		}

		if ( ! value.trim() ) {
			setFaKitIsValid( null )
			setVersion( 'latest' )
			setIsBusy( false )
		} else {
			const kitUrl = `https://kit.fontawesome.com/${ value }.js`
			fetch( kitUrl, { cache: 'no-store' } )
				.then( response => {
					if ( ! response.ok ) {
						// If license is invalid.
						setFaKitIsValid( false )
						setLicense( '' )
					} else {
						return response.text()
					}
				} )
				.then( text => {
					const licenseMatch = text.match( /license['"]\s*:\s*['"](.*?)['"]/ )
					const versionMatch = text.match( /version['"]\s*:\s*['"](.*?)['"]/ )
					const license = licenseMatch ? licenseMatch[ 1 ] : ''
					const version = versionMatch ? versionMatch[ 1 ] : 'latest'

					setFaKitIsValid( license !== 'free' )
					setLicense( license )
					setVersion( version )
				} )
				.finally( () => {
					setIsBusy( false )
				} )
		}
	}

	const onSave = () => {
		setIsSaving( true )

		const model = new models.Settings( {
			stackable_icons_fa_kit: faKit, // eslint-disable-line camelcase
			stackable_icons_fa_version: version, // eslint-disable-line camelcase
		} )

		model.save().then( () => setIsSaving( false ) )
	}

	const faProActiveProEnabled = iconsIsFAPluginActive && iconsIsFAProEnabled
	const faProActiveWithError = iconsIsFAPluginActive && ! iconsIsFAProEnabled && iconsFAProError.error

	return (
		<div>
			{ ! showField &&
				<Fragment>
					{ faProActiveProEnabled &&
						<Fragment>
							<div className="s-notice s-notice-good">
								<p><RawHTML>{ iconsFAProError.message }</RawHTML></p>
							</div>
							<a href="#0" onClick={ event => {
								onClickShowCode()
								event.preventDefault()
							} }>{ __( 'Let me enter my Font Awesome Pro Kit code', i18n ) }</a>
						</Fragment>
					}
					{ faProActiveWithError && ! hideFAError &&
						<div className="s-notice s-notice-bad s-notice--with-icon">
							<SVGNoticeIcon />
							<p><RawHTML>{ iconsFAProError.message }</RawHTML></p>
							<a href="#0" onClick={ event => {
								onClickDontShowAgain()
								event.preventDefault()
							} }>{ __( 'Don\'t show me this again', i18n ) }</a>
						</div>
					}
				</Fragment>
			}
			{ ( showField || ( faProActiveWithError && hideFAError ) ) &&
				<Fragment>
					<div className="s-settings-field">
						<label className="s-text-field" htmlFor="s-icon-kit-field">
							<span className="s-settings-field__title">{ __( 'FontAwesome Pro Kit', i18n ) }</span>
							<div className="s-settings-field__status">
								{ isBusy === false && faKitIsValid === true &&
									<div className="s-settings-field__status--check"><SVGCheckIcon /></div>
								}
								{ isBusy === false && faKitIsValid === false &&
									<div className="s-settings-field__status--cross"><SVGCrossIcon /></div>
								}
								{ isBusy && <Spinner /> }
							</div>
							<input
								id="s-icon-kit-field"
								type="text"
								placeholder={ isLoading ? __( 'Please wait...', i18n ) : sprintf( __( 'Paste your Kit code %s', i18n ), '<script src="https://kit.fontawesome.com/123456789.js" crossorigin="anonymous"></script>' ) }
								value={ faKit }
								disabled={ isBusy }
								onChange={ event => {
									setIsDirty( true )
									setFaKit( event.target.value )
								} }
								onBlur={ verifyKit }
								onMouseOut={ () => {
									if ( isDirty ) {
										setIsDirty( false )
										verifyKit()
									}
								} }
							/>
						</label>
						{ isBusy === false && faKitIsValid === false && license === 'free' &&
							<p className="s-settings-error">
								{ __( 'Please make sure you have Pro icons selected in your kit. Edit your kit settings at: ', i18n ) }
								<a href={ `https://fontawesome.com/kits` } target="_fa">{ `https://fontawesome.com/kits` }</a>
								<br />
								<a href="#0" onClick={ event => {
									verifyKit()
									event.preventDefault()
								} }>{ __( 'Click here to check again', i18n ) }</a>
							</p>
						}
						{ isBusy === false && faKitIsValid === false && license === '' &&
							<p className="s-settings-error">{ __( 'Please enter a valid Font Awesome Pro Kit code.', i18n ) }</p>
						}
						<p><a href="https://docs.wpstackable.com/stackable-guides/advanced-guides/how-to-use-your-font-awesome-pro-icons?utm_source=wp-settings-icons&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">{ __( 'Need help? Read our guide.', i18n ) }</a></p>
					</div>
					<div className="s-button-set">
						<button
							className="s-button s-button-left"
							disabled={ isBusy || faKitIsValid === false }
							onClick={ onSave }
						>{ __( 'Save changes', i18n ) }</button>
						{ isSaving && <Spinner /> }
					</div>
				</Fragment>
			}
		</div>
	)
}

domReady( () => {
	if ( document.querySelector( '.s-icon-settings' ) ) {
		render(
			<IconSettings />,
			document.querySelector( '.s-icon-settings' )
		)
	}
} )
