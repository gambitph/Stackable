/**
 * External dependencies
 */
import { BlockStyles } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { createHigherOrderComponent } from '@wordpress/compose'
import PropTypes from 'prop-types'

const withBlockStyles = ( styleFunction, options = {} ) => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static propTypes = {
			attributes: PropTypes.shape( {
				uniqueClass: PropTypes.string.isRequired,
			} ),
			blockName: PropTypes.string.isRequired,
			mainClassName: PropTypes.string.isRequired,
		}

		static defaultProps = {
			attributes: {},
			blockName: '',
			className: '',
			mainClassName: '',
		}

		render() {
			const newClassName = classnames( [
				this.props.className,
				this.props.attributes.uniqueClass,
			] )

			const { blockName } = this.props
			const styleObject = applyFilters( `stackable.${ blockName }.styles`, styleFunction( this.props ), this.props )

			const BlockStyle = (
				<BlockStyles
					blockUniqueClassName={ this.props.attributes.uniqueClass }
					blockMainClassName={ this.props.mainClassName }
					style={ styleObject }
					editorMode={ options.editorMode || false }
				/>
			)

			return <WrappedComponent { ...this.props } className={ newClassName } styles={ BlockStyle } />
		}
	},
	'withBlockStyles'
)

export default withBlockStyles
