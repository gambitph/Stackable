/**
 * This is the 3rd implementation of the BlockStyles class.  Context: 1st
 * implementation was a function that generated css - slow since it traversed
 * all the attributes 2nd implementation was ReactJS Components - lots of
 * rerenders and slow
 *
 * 3rd implementation: A class that generates css by traversing only the
 * attributes with values
 *
 * Usage: This class should be instantiated on script load and once per block.
 * The function `addBlockStyles` should be used to add block styles during that
 * time.
 *
 * In the block edit component, the function `generateBlockStyles` should be
 * called to generate the css string for the block.
 */
import { getUniqueBlockClass } from '~stackable/util'
import { getDynamicContentEdit } from '../dynamic-content-control'
import { applyFilters } from '@wordpress/hooks'
import { BlockCssFunc } from '.'
import { pickBy } from 'lodash'
import CssSaveCompiler from './css-save-compiler'

export class BlockStyleGenerator {
	constructor( commonProps ) {
		this.commonProps = commonProps
		this._blockStyles = {} // This holds all the blockStyles, keys are the attrName
		this._saveCache = {}
	}

	addBlockStylesOldWay( blockStyles ) {
		const attrName = blockStyles.attrName
		if ( ! this._blockStyles[ attrName ] ) {
			this._blockStyles[ attrName ] = [ blockStyles ]
		}
	}

	addBlockStyles( attrName, blockStyles ) {
		if ( ! this._blockStyles[ attrName ] ) {
			this._blockStyles[ attrName ] = Array.isArray( blockStyles ) ? blockStyles : [ blockStyles ]
			return
		}
		if ( ! Array.isArray( blockStyles ) ) {
			this._blockStyles[ attrName ].push( blockStyles )
		} else {
			this._blockStyles[ attrName ] = this._blockStyles[ attrName ].concat( blockStyles )
		}
	}

	/**
	 * Removes any suffixes from the attribute name.
	 *
	 * @param {string} attrName Attribute name
	 * @return {string} Root attribute name
	 */
	getRootAttrName( attrName ) {
		return attrName.replace( /(Hover|ParentHover|Collapsed|Tablet|TabletHover|TabletParentHover|TabletCollapsed|Mobile|MobileHover|MobileParentHover|MobileCollapsed|Unit|UnitHover|UnitParentHover|UnitCollapsed|UnitTablet|UnitTabletHover|UnitTabletParentHover|UnitTabletCollapsed|UnitMobile|UnitMobileHover|UnitMobileParentHover|UnitMobileCollapsed)$/, '' )
	}

	/**
	 * Gets all the block styles for the given attribute names
	 *
	 * @param {Array} attrNames Array of attribute names
	 * @return {Object} Object of blockStyles, keys are the attrName
	 */
	getBlockStyles( attrNames ) {
		if ( ! attrNames ) {
			return this._blockStyles
		}

		return attrNames.reduce( ( blockStyles, attrName ) => {
			if ( ! blockStyles[ attrName ] && this._blockStyles[ attrName ] ) {
				blockStyles[ attrName ] = this._blockStyles[ attrName ]
			}
			const rootAttrName = this.getRootAttrName( attrName )
			if ( ! blockStyles[ rootAttrName ] && this._blockStyles[ rootAttrName ] ) {
				blockStyles[ rootAttrName ] = this._blockStyles[ rootAttrName ]
			}
			return blockStyles
		}, {} )
	}

	getAttributesWithValues( attributes ) {
		const test = value => typeof value !== 'undefined' && value !== ''
		return Object.keys( pickBy( attributes, test ) )
	}

	generateBlockStylesForEditor( attributes, blockStyles, args ) {
		// const attrNamesWithValues = this.getAttributesWithValues( attributes )
		// const blockStyles = this.getBlockStyles( attrNamesWithValues )

		const generatedCss = []
		Object.keys( blockStyles ).forEach( attrName => {
			blockStyles[ attrName ].forEach( blockStyle => {
				const css = BlockCssFunc( {
					...this.commonProps,
					...blockStyle,
					version: args.version || this.commonProps.version,
					versionDeprecated: args.versionDeprecated || this.commonProps.versionDeprecated,
					blockState: args.blockState,
					clientId: args.clientId,
					uniqueId: args.uniqueId,
					instanceId: args.instanceId,
					attrName,
					attributes,
					editorMode: true,
				} )
				if ( css ) {
					generatedCss.push( css )
				}
			} )
		} )

		let output = generatedCss.join( '' )
		output = getDynamicContentEdit( output, args.clientId, args.context )
		output = applyFilters( 'stackable.block-styles.edit', output, getUniqueBlockClass( attributes.uniqueId ) )

		return output
	}

	generateBlockStylesForSave( attributes, blockStyles, args ) {
		// const attrNamesWithValues = this.getAttributesWithValues( attributes )
		// const blockStyles = this.getBlockStyles( attrNamesWithValues )

		// We initialize a single css object, all styles will be saved in this.
		const cssCompiler = new CssSaveCompiler()

		Object.keys( blockStyles ).forEach( attrName => {
			blockStyles[ attrName ].forEach( blockStyle => {
				BlockCssFunc( {
					...this.commonProps,
					...blockStyle,
					version: args.version || this.commonProps.version,
					versionDeprecated: args.versionDeprecated || this.commonProps.versionDeprecated,
					// blockState: args.blockState,
					// clientId: args.clientId,
					uniqueId: attributes.uniqueId,
					// instanceId: args.instanceId,
					attrName,
					attributes,
					editorMode: false,
					compileCssTo: cssCompiler,
				} )
			} )
		} )

		return cssCompiler.compile()
	}
}
