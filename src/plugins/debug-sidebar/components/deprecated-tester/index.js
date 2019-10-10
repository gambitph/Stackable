/**
 * External dependencies
 */
import { DEPRECATION_TESTS_URL, DEPRECATION_TESTS_URL_LOCAL } from '~stackable/constants'

/**
 * Internal dependencies
 */
import { validateBlockHTML } from '../../util'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	BaseControl, Button, ClipboardButton, Dashicon, IconButton,
} from '@wordpress/components'
import { Component, Fragment } from '@wordpress/element'
import { i18n, srcUrl } from 'stackable'
import classnames from 'classnames'

class DeprecatedTester extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			tests: [],
			testBlockNames: [],
			show: [],
			loaded: false,
			isLoading: false,
		}
		this.onClick = this.onClick.bind( this )
		this.onClickLocal = this.onClickLocal.bind( this )
		this.onRunAllTests = this.onRunAllTests.bind( this )
		this.onRunTest = this.onRunTest.bind( this )
		this.onShowToggle = this.onShowToggle.bind( this )
	}

	updateTestState( tests ) {
		this.setState( {
			tests: tests.map( test => {
				return {
					...test,
					passed: null,
				}
			} ),
			testBlockNames: [ ...new Set( tests.map( test => test.block ) ) ],
		} )
	}

	fetchTests( url = DEPRECATION_TESTS_URL ) {
		this.setState( { isLoading: true } )
		fetch( url )
			.then( response => {
				this.setState( {
					isLoading: false,
					loaded: true,
				} )
				return response.json()
			} )
			.then( tests => {
				this.updateTestState( tests )
			} )
	}

	onClick() {
		this.fetchTests( DEPRECATION_TESTS_URL )
	}

	onClickLocal() {
		this.fetchTests( sprintf( DEPRECATION_TESTS_URL_LOCAL, srcUrl ) )
	}

	onRunAllTests() {
		const newTests = this.state.tests.map( test => {
			if ( test.skip ) {
				return {
					...test,
					passed: true,
				}
			}
			return {
				...test,
				passed: validateBlockHTML( test.html ),
			}
		} )
		this.setState( { tests: newTests } )
	}

	onRunTest( blockName ) {
		const newTests = this.state.tests.map( test => {
			if ( test.block !== blockName ) {
				return test
			}
			if ( test.skip ) {
				return {
					...test,
					passed: true,
				}
			}
			return {
				...test,
				passed: validateBlockHTML( test.html ),
			}
		} )
		this.setState( { tests: newTests } )
	}

	onShowToggle( blockName ) {
		this.setState( {
			show: ! this.state.show.includes( blockName ) ?
				this.state.show.concat( blockName ) :
				this.state.show.filter( shownBlock => shownBlock !== blockName ),
		} )
	}

	render() {
		const mainClasses = classnames( [
			'ugb-deprecated-tester',
		], {
			'ugb-deprecated-tester--loading': this.state.isLoading,
		} )

		return (
			<div className={ mainClasses }>
				<BaseControl>
					<p className="components-base-control__help">
						{ __( 'When Stackable blocks are updated, block internal workings may change & editing existing blocks may result in errors if the changes are not backward compatible. This area tests multiple outdated blocks on whether they can migrate properly to newer versions.', i18n ) }
					</p>
					<Button className="ugb-deprecated-tester__load-button" isDefault={ true } onClick={ this.onClick } disabled={ this.state.isLoading }>
						<Dashicon icon="image-rotate" size="12" />
						{ __( 'Load Tests from Server', i18n ) }
					</Button>
					{ process.env.NODE_ENV === 'development' && (
						<Button className="ugb-deprecated-tester__load-button" isDefault={ true } onClick={ this.onClickLocal } disabled={ this.state.isLoading }>
							<Dashicon icon="image-rotate" size="12" />
							{ __( 'Load Tests from Local', i18n ) }
						</Button>
					) }
				</BaseControl>
				{ this.state.loaded && (
					<Fragment>
						<hr />
						<p className="ugb-deprecated-tester--row ugb--first">
							<Button isPrimary={ true } isSmall={ true } onClick={ this.onRunAllTests }>{ __( 'Run All Tests', i18n ) }</Button>
						</p>
					</Fragment>
				) }
				{ this.state.loaded && this.state.testBlockNames.map( ( blockName, i ) => {
					const currentBlockTests = this.state.tests.filter( test => test.block === blockName )
					const numTests = currentBlockTests.length
					const numPassed = currentBlockTests.filter( test => test.passed ).length
					return (
						<Fragment key={ i }>
							<div key={ i } className="ugb-deprecated-tester--row">
								<span className="ugb-deprecated-tester--name">
									{ blockName }
									<IconButton isDefault={ false } icon="editor-help" onClick={ () => this.onShowToggle( blockName ) } />
								</span>
								<span className={ numTests === numPassed ? 'ugb--green' : '' }>
									{ sprintf( __( '%d / %d Tests', i18n ), numPassed, numTests ) }
									<IconButton isDefault={ false } onClick={ () => this.onRunTest( blockName ) } icon="controls-play" />
								</span>
							</div>
							{ this.state.show.includes( blockName ) && (
								<div className="ugb-deprecated-tester--test-detail-wrapper">
									{ currentBlockTests.map( ( test, i ) => {
										// Escape new lines and tabs in the block's attribute list.
										const copiedHTML = test.html.replace( /(<!--[\s\S]*?-->)/g, ( match, html ) => {
											return html.replace( /\n/g, '\\n', ).replace( /\t/g, '\\t' )
										} )

										return (
											<div key={ i }>
												<div>
													{ test.description }
													{ ! test.skip && test.passed === true && <small className="ugb--passed">{ __( 'Passed', i18n ) }</small> }
													{ ! test.skip && test.passed === false && <small className="ugb--failed">{ __( 'Failed', i18n ) }</small> }
													{ test.skip && <small className="ugb--skipped">{ __( 'Skipped', i18n ) }</small> }
												</div>
												<div className="ugb-deprecated-tester--test-details">
													<small className="ugb--version">{ sprintf( __( 'v%s', i18n ), test.version ) }</small>
													{ test.plan && <small className={ `ugb--plan ugb--plan-${ test.plan }` }>{ test.plan }</small> }
													<ClipboardButton isDefault={ false } isLink text={ copiedHTML }>{ __( 'Copy code', i18n ) }</ClipboardButton>
													{ test.skip && <small className="ugb--skipped-note"><span role="img" aria-label={ __( 'Note', i18n ) }>⚠️</span> { test.skip }</small> }
												</div>
											</div>
										)
									} ) }
								</div>
							) }
						</Fragment>
					)
				} ) }
			</div>
		)
	}
}

export default DeprecatedTester
