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
			this.styleTop = 0
			this.styleWidth = 0
			this.state = {
				fixedTabs: false,
			}
		}

		onSidebarScroll() {
			// Calculate the top for scroll checking.
			if ( ! this.tabTop ) {
				const inspectorCard = document.querySelector( '.block-editor-block-card' )
				this.tabTop = inspectorCard ? inspectorCard.getBoundingClientRect().height + 32 : 75
			}

			// Calculate the sticky location.
			if ( ! this.styleWidth ) {
				const sidebarHeader = document.querySelector( '.edit-post-sidebar-header' )
				if ( sidebarHeader ) {
					const rect = sidebarHeader.getBoundingClientRect()
					this.styleTop = rect.bottom - 2 // This has a 1px top & bottom border
					this.styleWidth = rect.width
				} else {
					// Fallback if there's no header, for sure there's a sidebar.
					const sidebarSidebar = document.querySelector( '.edit-post-sidebar' )
					if ( sidebarSidebar ) {
						const rect = sidebarSidebar.getBoundingClientRect()
						this.styleTop = rect.top
						this.styleWidth = rect.width
					}
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
