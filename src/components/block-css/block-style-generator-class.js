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

export class BlockStyleGenerator {
	constructor( commonProps ) {
		this.commonProps = commonProps
		this._blockStyles = {} // This holds all the blockStyles indices, keys are the attrName
		this._dynamicBlockStyles = [] // Holds functions that will be called when generating blocks styles.
		this._blockStyleNamesWithValuePreCallbacks = [] // This holds all block style keys that have valuePreCallbacks, becuase these will need to be run even if the attribute is blank.
		this._orderedStyles = [] // This holds all the blockStyles added in order
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

		// Remember the block styles that have valuePreCallbacks
		if ( blockStyle.valuePreCallback ) {
			this._blockStyleNamesWithValuePreCallbacks.push( attrName )
		}

		this._orderedStyles.push( blockStyle )
		const blockStyleIndex = this._orderedStyles.length - 1

		if ( ! this._blockStyles[ attrName ] ) {
			this._blockStyles[ attrName ] = [ blockStyleIndex ]
			return
		}
		this._blockStyles[ attrName ].push( blockStyleIndex )
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
		this._orderedStyles.push( fn )
		const blockStyleIndex = this._orderedStyles.length - 1
		this._dynamicBlockStyles.push( blockStyleIndex )
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
	 * @return {Object} Object of blockStyles, keys are the indices
	 */
	getBlockStyles( attrNames ) {
		if ( ! attrNames ) {
			return this._blockStyles
		}

		// Since, JavaScript objects are ordered by default, use object with block style indices as keys
		// to maintain the order since attrNames may not follow the correct order.
		const orderdBlockStyles = {}
		const blockStyles = attrNames.reduce( ( blockStyles, attrName ) => {
			if ( ! blockStyles[ attrName ] && this._blockStyles[ attrName ] ) {
				blockStyles[ attrName ] = true
				// iterate over the block style indices, and add them to the array
				this._blockStyles[ attrName ].forEach( index => {
					orderdBlockStyles[ index ] = this._orderedStyles[ index ]
				} )
			}
			const rootAttrName = this.getRootAttrName( attrName )
			if ( ! blockStyles[ rootAttrName ] && this._blockStyles[ rootAttrName ] ) {
				blockStyles[ rootAttrName ] = true
				this._blockStyles[ rootAttrName ].forEach( index => {
					orderdBlockStyles[ index ] = this._orderedStyles[ index ]
				} )
			}
			return blockStyles
		}, {} )

		// Alays include block styles that have valuePreCallbacks.
		this._blockStyleNamesWithValuePreCallbacks.forEach( attrName => {
			if ( ! blockStyles[ attrName ] ) {
				blockStyles[ attrName ] = true
				this._blockStyles[ attrName ].forEach( index => {
					orderdBlockStyles[ index ] = this._orderedStyles[ index ]
				} )
			}
		} )

		// Add dynamic block styles
		this._dynamicBlockStyles.forEach( index => {
			if ( ! orderdBlockStyles[ index ] ) {
				orderdBlockStyles[ index ] = this._orderedStyles[ index ]
			}
		} )

		return orderdBlockStyles
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

		// Generate block styles based on the attributes that have values
		Object.values( blockStyles ).forEach( blockStyle => {
			// Call block styles that are added conditionally
			if ( typeof blockStyle === 'function' ) {
				const fn = blockStyle
				const _BlockCssFunc = _blockStyle => {
					if ( ! this.styleShouldRender( _blockStyle, attributes ) ) {
						return
					}
					const css = BlockCssFunc( {
						...this.commonProps,
						..._blockStyle,
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
				return
			}

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

		let output = generatedCss.join( '' )
		output = getDynamicContentEdit( output, args.clientId, args.context )
		output = applyFilters( 'stackable.block-styles.edit', output, getUniqueBlockClass( attributes.uniqueId ) )
		return output
	}

	/**
	 * Compiles the blockStyles based on the attributes given. Make sure to pass
	 * the same CssSaveCompiler instance for the same block for a more optimized
	 * way of compiling.
	 *
	 * @param {CssSaveCompiler} cssCompiler An instance of CssSaveCompiler
	 * @param {Object} attributes
	 * @param {Array} blockStyles
	 * @param {Object} args
	 *
	 * @return {string} Compiled css
	 */
	generateBlockStylesForSave( cssCompiler, attributes, blockStyles, args ) {
		// Generate block styles based on the attributes that have values
		Object.values( blockStyles ).forEach( blockStyle => {
			// Call block styles that are added conditionally
			if ( typeof blockStyle === 'function' ) {
				const fn = blockStyle
				const _BlockCssFunc = _blockStyle => {
					if ( ! this.styleShouldRender( _blockStyle, attributes ) ) {
						return
					}

					return BlockCssFunc( {
						...this.commonProps,
						..._blockStyle,
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
				return
			}

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

		return cssCompiler.compile()
	}
}
