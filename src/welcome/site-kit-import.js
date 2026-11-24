/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'
import { Button, Notice } from '@wordpress/components'
import {
	__, _n, sprintf,
} from '@wordpress/i18n'
import { useRef, useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { i18n, siteKitImport } from 'stackable'

export const SiteKitImport = () => {
	const inputRef = useRef( null )
	const [ isImporting, setIsImporting ] = useState( false )
	const [ result, setResult ] = useState( null )
	const [ error, setError ] = useState( null )

	const importSiteKit = async event => {
		const file = event.target.files?.[ 0 ]
		event.target.value = ''
		if ( ! file ) {
			return
		}
		if ( file.size > siteKitImport.maxUploadBytes ) {
			setError( __( 'The Site Kit ZIP is larger than this site allows.', i18n ) )
			return
		}

		setIsImporting( true )
		setResult( null )
		setError( null )

		try {
			const prepareBody = new FormData()
			prepareBody.append( 'siteKit', file )
			const prepared = await apiFetch( {
				path: siteKitImport.preparePath,
				method: 'POST',
				body: prepareBody,
			} )
			let generatedBlockStyles = {}
			if ( Object.keys( prepared.blockStyles ).length ) {
				const { generateSiteKitBlockStyles } = await import( './site-kit-block-styles' )
				generatedBlockStyles = generateSiteKitBlockStyles( prepared.blockStyles, siteKitImport.stackableVersion )
			}

			const body = new FormData()
			body.append( 'siteKit', file )
			body.append( 'selection', JSON.stringify( { mode: 'complete' } ) )
			body.append( 'generatedBlockStyles', JSON.stringify( generatedBlockStyles ) )
			setResult( await apiFetch( {
				path: siteKitImport.path,
				method: 'POST',
				body,
			} ) )
		} catch ( exception ) {
			setError( exception?.message || __( 'The Site Kit could not be imported.', i18n ) )
		} finally {
			setIsImporting( false )
		}
	}

	return <div className="s-setting-group stk-site-kit-import">
		<h2>{ __( 'Site Kit Import', i18n ) }</h2>
		<p className="s-settings-subtitle">
			{ __( 'Upload a Site Kit ZIP and apply the complete package to this development site.', i18n ) }
		</p>
		<Button
			variant="secondary"
			isBusy={ isImporting }
			disabled={ isImporting }
			onClick={ () => inputRef.current?.click() }
		>
			{ isImporting ? __( 'Importing Site Kit…', i18n ) : __( 'Choose Site Kit ZIP', i18n ) }
		</Button>
		<input
			type="file"
			accept=".zip,application/zip"
			hidden
			ref={ inputRef }
			onChange={ importSiteKit }
		/>

		{ error && <Notice status="error" isDismissible={ false }>
			<p>{ error }</p>
		</Notice> }
		{ result && <Notice status={ result.warnings?.length ? 'warning' : 'success' } isDismissible={ false }>
			<p>{ sprintf(
				/* translators: %1$s is a localized page count and %2$s is a localized media count. */
				__( 'Site Kit imported: %1$s and %2$s.', i18n ),
				sprintf( _n( '%d page', '%d pages', result.pages, i18n ), result.pages ),
				sprintf( _n( '%d media item', '%d media items', result.media, i18n ), result.media )
			) }</p>
			{ result.warnings?.map( ( warning, index ) => <p key={ index }>{ warning.message || warning }</p> ) }
		</Notice> }
	</div>
}
