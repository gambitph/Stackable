/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { createHigherOrderComponent } from '@wordpress/compose'

const withSticky = createHigherOrderComponent(
	WrappedComponent => class extends Component {
		static defaultProps = {
			className: '',
		}

		constructor() {
			super( ...arguments )
			this.onSidebarScroll = this.onSidebarScroll.bind( this )

			this.sidebarEl = null
			this.tabTop = 0
			this.state = {
				fixedTabs: false,
			}
			this.styleTop = 120
			this.styleWidth = 280
		}

		calcStyleTop() {
			const card = document.querySelector( '.block-editor-block-card' )
			if ( card ) {
				return card.getBoundingClientRect().top
			}
			return 120
		}

		calcStyleWidth() {
			const sidebar = document.querySelector( '.components-panel' )
			if ( sidebar ) {
				return sidebar.getBoundingClientRect().width
			}
			return 279
		}

		onSidebarScroll() {
			if ( ! this.tabTop ) {
				const inspectorCard = document.querySelector( '.block-editor-block-card' )
				if ( inspectorCard ) {
					this.tabTop = inspectorCard ? inspectorCard.getBoundingClientRect().height + 32 : 75
					this.styleTop = this.calcStyleTop()
					this.styleWidth = this.calcStyleWidth()
				}
			}
			if ( this.sidebarEl && this.tabTop ) {
				this.setState( {
					fixedTabs: this.sidebarEl.scrollTop >= this.tabTop,
				} )
			}
		}

		componentDidMount() {
			this.sidebarEl = document.querySelector( '.edit-post-sidebar' )
			if ( this.sidebarEl ) {
				this.sidebarEl.addEventListener( 'scroll', this.onSidebarScroll )
			}
		}

		componentWillUnmount() {
			if ( this.sidebarEl ) {
				this.sidebarEl.removeEventListener( 'scroll', this.onSidebarScroll )
			}
		}

		render() {
			const classNames = classnames( [
				this.props.className,
			], {
				'ugb--fixed-tabs': this.state.fixedTabs,
			} )

			return (
				<Fragment>
					<WrappedComponent { ...this.props } className={ classNames }
						style={ {
							top: this.state.fixedTabs ? `${ this.styleTop }px` : undefined,
							width: this.state.fixedTabs ? `${ this.styleWidth }px` : undefined,
						} }
					/>
					{ this.state.fixedTabs && <div className="ugb--panel-tabs-dummy" /> }
				</Fragment>
			)
		}
	},
	'withSticky'
)

export default withSticky
