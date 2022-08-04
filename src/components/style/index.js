import compareVersions from 'compare-versions'
import { getEditorStylesOnly, generateStyles } from '~stackable/block-components/style'
import { useDynamicContent } from '../dynamic-content-control'
import {
	appendImportant, getUniqueBlockClass, minifyCSS, useQueryLoopInstanceId,
} from '~stackable/util'
import {
	Fragment, memo, useMemo,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'
import {
	useBlockAttributesContext, useDeviceType, useRafMemo,
} from '~stackable/hooks'

const Style = memo( props => {
	const {
		version, versionAdded, versionDeprecated,
		styles, breakTablet, breakMobile,
	} = props

	const deviceType = useDeviceType()
	const attributeUniqueId = useBlockAttributesContext( attributes => attributes.uniqueId )
	const __blockUniqueClassName = getUniqueBlockClass( attributeUniqueId )

	// If there's no blockUniqueClassName supplied, create one based from the
	// clientId so that we can still generate some styles.
	const { clientId } = useBlockEditContext()
	let _blockUniqueClassName = __blockUniqueClassName
	if ( ! __blockUniqueClassName ) {
		const tempUniqueId = createUniqueClass( clientId )
		_blockUniqueClassName = getUniqueBlockClass( tempUniqueId )
	}

	const uniqueId = _blockUniqueClassName?.replace( 'stk-', '' ) || ''
	const instanceId = useQueryLoopInstanceId( uniqueId )

	const blockUniqueClassName = ( instanceId && ! _blockUniqueClassName.match( /-[\d]$/g ) ) ? _blockUniqueClassName + `-${ instanceId }` : _blockUniqueClassName

	const doRender = useMemo( () => {
		// If no version was given, just get everything that's not yet deprecated.
		if ( ! version ) {
			return !! versionDeprecated
		}

		// If given, get styles which...
		return compareVersions( version, versionAdded ) >= 0 && // Were introduced on the same version.
			( ! versionDeprecated || compareVersions( version, versionDeprecated ) === -1 ) // Are not yet deprecated.
	}, [ version, versionAdded, versionDeprecated ] )

	// Only generate the CSS styles Request Animation Frame to make things speedy.
	const css = useRafMemo( () => {
		if ( ! doRender ) {
			return ''
		}

		const stylesToRender = getEditorStylesOnly( styles, deviceType )
		return generateStyles( doImportant( stylesToRender ), blockUniqueClassName, breakTablet, breakMobile ).join( '' )
	}, [ doRender, styles, deviceType, blockUniqueClassName, breakTablet, breakMobile ] )

	const output = useDynamicContent( css )

	// If the block doesn't have a unique className (based on the uniqueId), it
	// means that the user is still picking a layout.
	if ( ! doRender || ! css || ! blockUniqueClassName ) {
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

	// If the block doesn't have a unique className (based on the uniqueId), it
	// means that the user is still picking a layout.
	if ( ! props.blockUniqueClassName ) {
		return null
	}

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
