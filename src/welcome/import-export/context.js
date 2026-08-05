import { createContext, useContext } from '@wordpress/element'

export const ImportExportSettingsContext = createContext( {} )

export const useImportExportSettingsContext = () => {
	return useContext( ImportExportSettingsContext )
}

