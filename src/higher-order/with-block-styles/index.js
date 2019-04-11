import { Component, Fragment } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { BlockStyles } from '@stackable/components'
import classnames from 'classnames'
import { createHigherOrderComponent } from '@wordpress/compose'
import { getUniqueIDFromProps } from '@stackable/util'

const withBlockStyles = ( styleFunction, render = true ) => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		render() {
			const {
				className = '',
			} = this.props

			const newClassName = classnames( [
				className,
				getUniqueIDFromProps( this.props ),
			] )

			const blockName = this.props.blockName
			const styleObject = applyFilters( `stackable.${ blockName }.styles`, styleFunction( this.props ), this.props )

			const BlockStyle = (
				<BlockStyles
					blockUniqueClassName={ getUniqueIDFromProps( this.props ) }
					blockMainClassName={ this.props.mainClassName }
					style={ styleObject }
				/>
			)

			return (
				<Fragment>
					{ render && BlockStyle }
					<WrappedComponent { ...this.props } className={ newClassName } styleTag={ BlockStyle } />
				</Fragment>
			)
		}
	},
	'withBlockStyles'
)

export default withBlockStyles
