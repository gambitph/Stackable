import { ImportExportSettingsContext } from './context'
import './design-library'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	Button, Modal, Snackbar, TabPanel,
} from '@wordpress/components'
import {
	useState, useMemo, Fragment,
} from '@wordpress/element'
import { models } from '@wordpress/api'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { applyFilters } from '@wordpress/hooks'

export const ImportExportModal = props => {
	const {
		onClose, modalState, settings, importFile,
	} = props
	const title = modalState === 'IMPORT' ? __( 'Import', i18n ) : __( 'Export', i18n )

	const [ notice, setNotice ] = useState( null )

	return <>
		{ notice && <div className="stk-snackbar__wrapper">
			<Snackbar onRemove={ () => setNotice( null ) }> { notice } </Snackbar>
		</div> }
		{ modalState !== 'CLOSED' && <Modal
			title={ title }
			onRequestClose={ onClose }
			className="stk-modal-import-export-settings"
		>
			{ modalState === 'IMPORT' ? <ImportSettings
				importFile={ importFile }
				settings={ settings }
				onClose={ onClose }
				setNotice={ setNotice }
			/> : <ExportSettings
				settings={ settings }
				onClose={ onClose }
				setNotice={ setNotice }
			/> }
		</Modal> }
	</>
}

const ImportSettings = ( {
	importFile, settings, onClose, setNotice,
} ) => {
	const [ importedSettings, setImportedSettings ] = useState( importFile )

	const {
		settingsToSave, errors, asyncImports = [],
	} = useMemo( () => {
		return applyFilters( 'stackable.admin-settings.import-export.handle-import', {
			settingsToSave: {},
			errors: {},
			asyncImports: [],
		}, importedSettings )
	}, [ importedSettings ] )

	const handleImport = async () => {
		if ( ! ( 'settings' in importedSettings ) ) {
			onClose()
			return
		}

		if ( Object.keys( errors ).length ) {
			setNotice( __( 'Failed to import settings.', i18n ) )
			// eslint-disable-next-line no-console
			console.error( sprintf( __( 'Stackable: Import error - %s', i18n ), Object.values( errors ).join( '\n' ) ) )
			return
		}

		try {
			for ( const asyncImport of asyncImports ) {
				await asyncImport()
			}

			if ( Object.keys( settingsToSave ).length === 0 && asyncImports.length === 0 ) {
				setNotice( __( 'No settings imported.', i18n ) )
				return
			}

			if ( Object.keys( settingsToSave ).length > 0 ) {
				const model = new models.Settings( settingsToSave )
				await model.save()
			}

			setNotice( __( 'Settings imported successfully.', i18n ) )
			onClose()
		} catch ( e ) {
			setNotice( __( 'Failed to import settings.', i18n ) )
			// eslint-disable-next-line no-console
			console.error( sprintf( __( 'Stackable: Import error - %s', i18n ), e ) )
		}
	}

	const AllImportSettings = useMemo( () => applyFilters( 'stackable.admin-settings.import-settings', Fragment ), [] )

	const importContextValue = useMemo( () => [ importFile, importedSettings, setImportedSettings ],
		[ importFile, importedSettings, setImportedSettings ] )

	return <ImportExportSettingsContext.Provider value={ importContextValue }>
		<TabPanel
			orientation="vertical"
			className="stk-import-export__tabs"
			activeClass="s-active"
			tabs={ [
				{
					name: 'design-library',
					title: __( 'Design Library', i18n ),
				},
				{
					name: 'design-system',
					title: __( 'Design System', i18n ),
					disabled: true,
				},
			] }
		>
			{ tab => <AllImportSettings tab={ tab } settings={ settings } /> }
		</TabPanel>
		<Button
			className="stk-import-button"
			label={ __( 'Import', i18n ) }
			text={ __( 'Import', i18n ) }
			variant="primary"
			disabled={ Object.keys( settingsToSave ).length === 0 }
			onClick={ () => handleImport() }
		/>
	</ImportExportSettingsContext.Provider>
}

const getExportFileName = () => {
	const now = new Date()
	const pad = n => n.toString().padStart( 2, '0' )
	const y = now.getFullYear()
	const m = pad( now.getMonth() + 1 )
	const d = pad( now.getDate() )
	const h = pad( now.getHours() )
	const min = pad( now.getMinutes() )
	const s = pad( now.getSeconds() )

	return `stackable-export-${ y }${ m }${ d }-${ h }${ min }${ s }.json`
}

const ExportSettings = ( {
	settings, onClose, setNotice,
} ) => {
	const [ exportedSettings, setExportedSettings ] = useState( {} )

	const handleExport = () => {
		try {
			const dataStr = JSON.stringify( exportedSettings, null, 4 )
			const blob = new Blob( [ dataStr ], { type: 'application/json' } )
			const url = URL.createObjectURL( blob )
			const a = document.createElement( 'a' )
			a.href = url

			a.download = getExportFileName()
			document.body.appendChild( a )
			a.click()
			document.body.removeChild( a )
			URL.revokeObjectURL( url )
			onClose()
		} catch ( e ) {
			setNotice( __( 'Failed to export settings.', i18n ) )
			// eslint-disable-next-line no-console
			console.error( sprintf( __( 'Stackable: Export error - %s', i18n ), e ) )
		}
	}

	const AllExportSettings = useMemo( () => applyFilters( 'stackable.admin-settings.export-settings', Fragment ), [] )

	const exportContextValue = useMemo( () => [ exportedSettings, setExportedSettings ],
		[ exportedSettings, setExportedSettings ] )

	return <ImportExportSettingsContext.Provider value={ exportContextValue }>
		<TabPanel
			orientation="vertical"
			className="stk-import-export__tabs"
			activeClass="s-active"
			tabs={ [
				{
					name: 'design-library',
					title: __( 'Design Library', i18n ),
				},
				{
					name: 'design-system',
					title: __( 'Design System', i18n ),
					disabled: true,
				},
			] }
		>
			{ tab => <AllExportSettings tab={ tab } settings={ settings } /> }
		</TabPanel>
		<Button
			className="stk-export-button"
			label={ __( 'Export', i18n ) }
			text={ __( 'Export', i18n ) }
			variant="primary"
			disabled={ Object.keys( exportedSettings ).length === 0 }
			onClick={ () => handleExport() }
		/>
	</ImportExportSettingsContext.Provider>
}
