/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch'
import {
	Button, Notice, SelectControl, TextareaControl, TextControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { i18n, siteKitExport } from 'stackable'

const INITIAL_METADATA = {
	slug: '',
	title: '',
	description: '',
	plan: 'free',
}

export const SiteKitExport = () => {
	const [ metadata, setMetadata ] = useState( INITIAL_METADATA )
	const [ validation, setValidation ] = useState( null )
	const [ error, setError ] = useState( null )
	const [ isValidating, setIsValidating ] = useState( false )

	const updateMetadata = property => value => {
		setMetadata( current => ( { ...current, [ property ]: value } ) )
		setValidation( null )
		setError( null )
	}

	const validateExport = async event => {
		event.preventDefault()
		setIsValidating( true )
		setValidation( null )
		setError( null )

		try {
			const result = await apiFetch( {
				path: siteKitExport.path,
				method: 'POST',
				data: metadata,
			} )
			setValidation( result )
		} catch ( exception ) {
			setError( {
				message: exception?.message || __( 'The Site Kit could not be validated.', i18n ),
				items: exception?.data?.validationErrors || [],
				warnings: exception?.data?.warnings || [],
			} )
		} finally {
			setIsValidating( false )
		}
	}

	return <div className="s-setting-group stk-site-kit-export">
		<h2>{ __( 'Site Kit Export', i18n ) }</h2>
		<p className="s-settings-subtitle">
			{ __( 'Create a complete Site Kit ZIP from this development site.', i18n ) }
		</p>
		<form onSubmit={ validateExport }>
			<div className="stk-site-kit-export__fields">
				<TextControl
					label={ __( 'Slug', i18n ) }
					help={ __( 'Use lowercase letters, numbers, and hyphens.', i18n ) }
					value={ metadata.slug }
					onChange={ updateMetadata( 'slug' ) }
					required
				/>
				<TextControl
					label={ __( 'Title', i18n ) }
					value={ metadata.title }
					onChange={ updateMetadata( 'title' ) }
					required
				/>
				<SelectControl
					label={ __( 'Plan', i18n ) }
					value={ metadata.plan }
					options={ [
						{ label: __( 'Free', i18n ), value: 'free' },
						{ label: __( 'Premium', i18n ), value: 'premium' },
					] }
					onChange={ updateMetadata( 'plan' ) }
				/>
				<TextareaControl
					label={ __( 'Description', i18n ) }
					value={ metadata.description }
					onChange={ updateMetadata( 'description' ) }
				/>
			</div>
			<Button
				type="submit"
				variant="secondary"
				isBusy={ isValidating }
				disabled={ isValidating || ! metadata.slug || ! metadata.title }
			>
				{ isValidating ? __( 'Validating Site Kit…', i18n ) : __( 'Validate Site Kit', i18n ) }
			</Button>
		</form>

		{ error && <Notice status="error" isDismissible={ false }>
			<p>{ error.message }</p>
			<ValidationItems items={ error.items } />
			<ValidationItems items={ error.warnings } />
		</Notice> }

		{ validation && <Notice status={ validation.warnings?.length ? 'warning' : 'success' } isDismissible={ false }>
			<p>{ __( 'The Site Kit passed validation and is ready to download.', i18n ) }</p>
			<ValidationItems items={ validation.warnings } />
			<Button
				variant="primary"
				href={ validation.downloadUrl }
				download={ validation.filename }
			>
				{ __( 'Download Site Kit', i18n ) }
			</Button>
		</Notice> }
	</div>
}

const ValidationItems = ( { items = [] } ) => {
	if ( ! items.length ) {
		return null
	}

	return <ul className="stk-site-kit-export__validation-list">
		{ items.map( ( item, index ) => <li key={ `${ item.code || 'message' }-${ index }` }>
			{ item.path && item.path !== '/' ? <code>{ item.path }</code> : null }
			{ item.path && item.path !== '/' ? ' ' : null }
			{ item.message }
		</li> ) }
	</ul>
}
