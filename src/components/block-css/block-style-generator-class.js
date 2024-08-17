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
import { getAttrName, getUniqueBlockClass } from '~stackable/util'
import { getDynamicContentEdit } from '../dynamic-content-control'
import { applyFilters } from '@wordpress/hooks'
import { BlockCssFunc } from '.'
import { pickBy } from 'lodash'
import CssSaveCompiler from './css-save-compiler'

export class BlockStyleGenerator {
	constructor( commonProps ) {
		this.commonProps = commonProps
		this._blockStyles = {} // This holds all the blockStyles, keys are the attrName
		this._dynamicBlockStyles = [] // Holds functions that fill be called when generating blocks styles.
	}

	addBlockStylesOldWay( blockStyles ) {
		const attrName = blockStyles.attrName
		if ( ! this._blockStyles[ attrName ] ) {
			this._blockStyles[ attrName ] = [ blockStyles ]
		}
	}

	/**
	 * Used to add block styles to the block style generator. The attribute name
	 * is important because it is used for looking which styles are generated
	 * from a set of attributes.
	 *
	 * @param {string} attrName The attribute name to add block styles to
	 * @param {Array} blockStyles Properties needed to generate the block
	 * styles
	 * @return {undefined}
	 */
	addBlockStyles( attrName, blockStyles ) {
		if ( ! Array.isArray( blockStyles ) ) {
			this.addBlockStyle( attrName, blockStyles )
		} else {
			blockStyles.forEach( blockStyle => {
				this.addBlockStyle( attrName, blockStyle )
			} )
		}
	}

	/**
	 * Used to add one block style to the block style generator. The attribute
	 * name is important because it is used for looking which styles are
	 * generated from a set of attributes.
	 *
	 * @param {string} _attrName The attribute name to add block styles to
	 * @param {Object} blockStyle Properties needed to generate the block styles
	 * @return {undefined}
	 */
	addBlockStyle( _attrName, blockStyle ) {
		if ( ! _attrName ) {
			console.error( 'BlockStyleGenerator: No attribute name provided.' ) // eslint-disable-line no-console
		}

		// If an attribute name template is provided, use it to format the attrName
		const attrName = blockStyle.attrNameTemplate ? getAttrName( blockStyle.attrNameTemplate, _attrName ) : _attrName

		if ( ! this._blockStyles[ attrName ] ) {
			this._blockStyles[ attrName ] = [ blockStyle ]
			return
		}

		this._blockStyles[ attrName ].push( blockStyle )
	}

	/**
	 * Normally, block styles are added with `addBlockStyle`. However, when you
	 * need to generate a block style that need to use a value from an
	 * attribute, you don't have access to the attributes yet. But if you use
	 * this function, then you can add the blockStyle dynamically - although
	 * this is a less performant way to add block styles.
	 *
	 * @param {Function} fn function that's called when generating block styles
	 */
	addBlockStyleConditionally( fn ) {
		this._dynamicBlockStyles.push( fn )
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

	/**
	 * Checks the `renderCondition` property in blockStyle if it matches the
	 * condition to render this, if present.
	 *
	 * @param {Object} blockStyle The block style object
	 * @param {Object} attributes The block attributes
	 */
	styleShouldRender( blockStyle, attributes ) {
		if ( blockStyle.renderCondition ) {
			if ( typeof blockStyle.renderCondition === 'function' ) {
				return blockStyle.renderCondition( attributes )
			}
			// renderCondition is an attribute name.
			return !! attributes[ blockStyle.renderCondition ]
		}
		return true
	}

	generateBlockStylesForEditor( attributes, blockStyles, args ) {
		const generatedCss = []

		// Call block styles that are added conditionally
		this._dynamicBlockStyles.forEach( fn => {
			const _BlockCssFunc = blockStyle => {
				if ( ! this.styleShouldRender( blockStyle, attributes ) ) {
					return
				}

				const css = BlockCssFunc( {
					...this.commonProps,
					...blockStyle,
					version: args.version || this.commonProps.version,
					versionDeprecated: args.versionDeprecated || this.commonProps.versionDeprecated,
					blockState: args.blockState,
					clientId: args.clientId,
					uniqueId: args.uniqueId,
					instanceId: args.instanceId,
					attributes,
					editorMode: true,
				} )
				if ( css ) {
					generatedCss.push( css )
				}
			}
			fn( attributes, _BlockCssFunc )
		} )

		// Generate block styles based on the attributes that have values
		Object.keys( blockStyles ).forEach( attrName => {
			blockStyles[ attrName ].forEach( blockStyle => {
				if ( ! this.styleShouldRender( blockStyle, attributes ) ) {
					return
				}

				const css = BlockCssFunc( {
					...this.commonProps,
					...blockStyle,
					version: args.version || this.commonProps.version,
					versionDeprecated: args.versionDeprecated || this.commonProps.versionDeprecated,
					blockState: args.blockState,
					clientId: args.clientId,
					uniqueId: args.uniqueId,
					instanceId: args.instanceId,
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
		// We initialize a single css object, all styles will be saved in this.
		const cssCompiler = new CssSaveCompiler()

		// Call block styles that are added conditionally
		this._dynamicBlockStyles.forEach( fn => {
			const _BlockCssFunc = blockStyle => {
				if ( ! this.styleShouldRender( blockStyle, attributes ) ) {
					return
				}

				return BlockCssFunc( {
					...this.commonProps,
					...blockStyle,
					version: args.version || this.commonProps.version,
					versionDeprecated: args.versionDeprecated || this.commonProps.versionDeprecated,
					// blockState: args.blockState,
					// clientId: args.clientId,
					uniqueId: attributes.uniqueId,
					// instanceId: args.instanceId,
					attributes,
					editorMode: false,
					compileCssTo: cssCompiler,
				} )
			}
			fn( attributes, _BlockCssFunc )
		} )

		// Generate block styles based on the attributes that have values
		Object.keys( blockStyles ).forEach( attrName => {
			blockStyles[ attrName ].forEach( blockStyle => {
				if ( ! this.styleShouldRender( blockStyle, attributes ) ) {
					return
				}

				BlockCssFunc( {
					...this.commonProps,
					...blockStyle,
					version: args.version || this.commonProps.version,
					versionDeprecated: args.versionDeprecated || this.commonProps.versionDeprecated,
					// blockState: args.blockState,
					// clientId: args.clientId,
					uniqueId: attributes.uniqueId,
					// instanceId: args.instanceId,
					attributes,
					editorMode: false,
					compileCssTo: cssCompiler,
				} )
			} )
		} )

		return cssCompiler.compile()
	}
}
