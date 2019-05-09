import { __, sprintf } from '@wordpress/i18n'
import { BaseControl, Button, ClipboardButton, Dashicon, IconButton } from '@wordpress/components'
import { Component, Fragment } from '@wordpress/element'
import { DEPRECATION_TESTS_URL, DEPRECATION_TESTS_URL_LOCAL } from '@stackable/constants'
import classnames from 'classnames'
import { srcUrl } from 'stackable'
import { validateBlockHTML } from '../../util'

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
						{ __( 'When Stackable blocks are updated, block internal workings may change & editing existing blocks may result in errors if the changes are not backward compatible. This area tests multiple outdated blocks on whether they can migrate properly to newer versions.' ) }
					</p>
					<Button className="ugb-deprecated-tester__load-button" isDefault={ true } onClick={ this.onClick } disabled={ this.state.isLoading }>
						<Dashicon icon="image-rotate" size="12" />
						{ __( 'Load Tests from Server' ) }
					</Button>
					{ process.env.NODE_ENV === 'development' && (
						<Button className="ugb-deprecated-tester__load-button" isDefault={ true } onClick={ this.onClickLocal } disabled={ this.state.isLoading }>
							<Dashicon icon="image-rotate" size="12" />
							{ __( 'Load Tests from Local' ) }
						</Button>
					) }
				</BaseControl>
				{ this.state.loaded && (
					<Fragment>
						<hr />
						<p className="ugb-deprecated-tester--row ugb--first">
							<Button isPrimary={ true } isSmall={ true } onClick={ this.onRunAllTests }>{ __( 'Run All Tests' ) }</Button>
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
									{ sprintf( __( '%d / %d Tests' ), numPassed, numTests ) }
									<IconButton isDefault={ false } onClick={ () => this.onRunTest( blockName ) } icon="controls-play" />
								</span>
							</div>
							{ this.state.show.includes( blockName ) && (
								<div className="ugb-deprecated-tester--test-detail-wrapper">
									{ currentBlockTests.map( ( test, i ) => {
										return (
											<div key={ i }>
												<div>
													{ test.description }
													{ test.passed === true && <small className="ugb--passed">{ __( 'Passed' ) }</small> }
													{ test.passed === false && <small className="ugb--failed">{ __( 'Failed' ) }</small> }
												</div>
												<div className="ugb-deprecated-tester--test-details">
													<small className="ugb--version">{ sprintf( __( 'v%s' ), test.version ) }</small>
													<ClipboardButton isDefault={ false } isLink text={ test.html }>{ __( 'Copy code' ) }</ClipboardButton>
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
