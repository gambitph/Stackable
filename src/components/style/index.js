import compareVersions from 'compare-versions'
import { getEditorStylesOnly, generateStyles } from '~stackable/block-components/style'
import { useDynamicContent } from '../dynamic-content-control'
import { appendImportant, minifyCSS } from '~stackable/util'
import {
	Fragment, memo, useMemo,
} from '@wordpress/element'

const Style = memo( props => {
	const {
		version, versionAdded, versionDeprecated,
		styles, deviceType, blockUniqueClassName, breakTablet, breakMobile,
	} = props

	const doRender = useMemo( () => {
		// If no version was given, just get everything that's not yet deprecated.
		if ( ! version ) {
			return !! versionDeprecated
		}

		// If given, get styles which...
		return compareVersions( version, versionAdded ) >= 0 && // Were introduced on the same version.
			( ! versionDeprecated || compareVersions( version, versionDeprecated ) === -1 ) // Are not yet deprecated.
	}, [ version, versionAdded, versionDeprecated ] )

	const css = useMemo( () => {
		if ( ! doRender ) {
			return ''
		}

		const stylesToRender = getEditorStylesOnly( styles, deviceType )
		return generateStyles( doImportant( stylesToRender ), blockUniqueClassName, breakTablet, breakMobile )
	}, [ doRender, styles, deviceType, blockUniqueClassName, breakTablet, breakMobile ] )

	const output = useDynamicContent( css.join( '' ) )

	if ( ! doRender || ! css ) {
		return null
	}

	return output ? <style>{ output }</style> : null
} )

Style.defaultProps = {
	styles: null,
	blockUniqueClassName: '',
	breakTablet: 1024,
	breakMobile: 768,
	doImportant: true,

	deviceType: '', // If given, then style styles for only given device will be generated.

	version: '', // If given, the styles for only this version will be rendered.
	versionAdded: '', // The version of Stackable when this style was added.
	versionDeprecated: false, // The version of Stackable when this style wasn't used anymore.
}

Style.Content = props => {
	const {
		version, versionAdded, versionDeprecated, styles, blockUniqueClassName, breakTablet, breakMobile,
	} = props

	const doRender = ( () => {
		// If no version was given, just get everything that's not yet deprecated.
		if ( ! version ) {
			return !! versionDeprecated
		}

		// If given, get styles which...
		return compareVersions( version, versionAdded ) >= 0 && // Were introduced on the same version.
			( ! versionDeprecated || compareVersions( version, versionDeprecated ) === -1 ) // Are not yet deprecated.
	} )()

	if ( ! doRender ) {
		return null
	}

	const css = generateStyles( doImportant( styles ), blockUniqueClassName, breakTablet, breakMobile )
	if ( ! css ) {
		return null
	}

	return <Fragment>{ minifyCSS( css.join( '' ) ) }</Fragment>
}

Style.Content.defaultProps = {
	styles: null,
	blockUniqueClassName: '',
	breakTablet: 1024,
	breakMobile: 768,
	doImportant: true,

	version: '', // If given, the styles for only this version will be rendered.
	versionAdded: '', // The version of Stackable when this style was added.
	versionDeprecated: false, // The version of Stackable when this style wasn't used anymore.
}

export default Style

export const doImportant = ( styleObject, important = true ) => {
	if ( typeof styleObject !== 'object' ) {
		return appendImportant( styleObject, important )
	}

	return Object.keys( styleObject ).reduce( ( newStyleObject, key ) => {
		return {
			...newStyleObject,
			[ key ]: doImportant( styleObject[ key ], important ),
		}
	}, {} )
}
