/**
 * External dependencies
 */
import {
	i18n, isPro,
} from 'stackable'
import { AdvancedSelectControl } from '~stackable/components'
import { find, compact } from 'lodash'

/**
 * WordPress dependencies
 */
import { Component, Fragment } from '@wordpress/element'
import { Spinner, FormTokenField } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addQueryArgs } from '@wordpress/url'
import apiFetch from '@wordpress/api-fetch'

let cachedTerms = []

class TaxonomyControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isLoading: cachedTerms.length === 0,
			termList: cachedTerms,
		}
	}

	componentWillMount() {
		if ( ! this.state.termList.length ) {
			this.isStillMounted = true
			this.fetchRequest = apiFetch( {
				path: addQueryArgs( `/wp/v2/stk_terms`, {
					per_page: -1, // eslint-disable-line camelcase
				} ),
			} ).then(
				termList => {
					if ( this.isStillMounted ) {
						cachedTerms = termList
						this.setState( {
							termList,
							isLoading: false,
						} )
					}
				}
			).catch(
				() => {
					if ( this.isStillMounted ) {
						this.setState( {
							termList: [],
							isLoading: false,
						} )
					}
				}
			)
		}
	}

	componentWillUnmount() {
		this.isStillMounted = false
	}

	render() {
		const postTypeOptions = []
		const taxonomyTypeOptions = []
		const taxonomyOptions = []
		let taxonomyLabel = ''
		const { taxonomy } = this.props

		Object.keys( this.state.termList ).forEach( postType => {
			const {
				label,
				taxonomies,
			} = this.state.termList[ postType ]

			postTypeOptions.push( {
				label,
				value: postType,
			} )

			if ( postType === this.props.postType ) {
				Object.keys( taxonomies ).forEach( ( taxonomy, taxIndex ) => {
					const {
						label,
						terms,
					} = taxonomies[ taxonomy ]

					taxonomyTypeOptions.push( {
						label,
						value: taxonomy,
					} )

					const noTaxonomyTypeSelected = ! this.props.taxonomyType && taxIndex === 0
					if ( taxonomy === this.props.taxonomyType || noTaxonomyTypeSelected ) {
						Object.keys( terms ).forEach( i => {
							taxonomyOptions.push( {
								name: terms[ i ].name,
								value: terms[ i ].term_id,
							} )
						} )
					}
				} )
			}
		} )

		const taxonomySuggestionOptions = taxonomyOptions.map( value => value.name )
		// Parse the taxonomy value to array as passed prop value.
		let taxonomyValue = taxonomy !== '' ? taxonomy.split( ',' ).map( value => {
			const { name } = find( taxonomyOptions, taxonomyEntry => taxonomyEntry.value === parseInt( value ) ) || {}
			return name
		} ) : undefined

		// If the taxonomy value is not included in the list of options, force value as undefined
		if ( ! compact( taxonomyValue ).length ) {
			taxonomyValue = undefined
		}

		if ( taxonomyTypeOptions.length ) {
			const toMatch = this.props.taxonomyType || taxonomyTypeOptions[ 0 ].value
			const matchedOption = taxonomyTypeOptions.filter( ( { value } ) => toMatch === value )
			if ( matchedOption.length ) {
				taxonomyLabel = matchedOption[ 0 ].label
			} else {
				taxonomyLabel = taxonomyTypeOptions[ 0 ].label
			}
		}

		if ( this.state.isLoading ) {
			return <div className="ugb-blog-post__inspector-spinner">
				<Spinner />
			</div>
		}

		return (
			<div>
				{ isPro &&
					<AdvancedSelectControl
						label={ __( 'Post Type', i18n ) }
						options={ postTypeOptions }
						value={ this.props.postType }
						onChange={ value => {
							const taxonomyTypesAvailable = Object.keys( this.state.termList[ value ].taxonomies )
							this.props.onChangePostType( value )
							this.props.onChangeTaxonomyType( taxonomyTypesAvailable.length ? taxonomyTypesAvailable[ 0 ] : '' )
							this.props.onChangeTaxonomy( '' )
						} }
					/>
				}
				{ taxonomyTypeOptions.length > 0 &&
					<AdvancedSelectControl
						label={ __( 'Filter by Taxonomy', i18n ) }
						options={ taxonomyTypeOptions }
						value={ this.props.taxonomyType }
						onChange={ value => {
							this.props.onChangeTaxonomyType( value )
							this.props.onChangeTaxonomy( '' )
						} }
					/>
				}
				{ taxonomyTypeOptions.length > 0 &&
				<Fragment>
					<AdvancedSelectControl
						label={ __( 'Taxonomy Filter Type', i18n ) }
						options={ [
							{ label: __( 'Included In', i18n ), value: '__in' },
							{ label: __( 'Not In', i18n ), value: '__not_in' },
						] }
						value={ this.props.taxonomyFilterType }
						onChange={ this.props.onChangeTaxonomyFilterType }
					/>
					<FormTokenField
						label={ taxonomyLabel }
						suggestions={ taxonomySuggestionOptions }
						value={ taxonomyValue }
						onChange={ value => {
							const passedTaxonomyValues = value.map( selectedTaxonomy => {
								const { value: entry } = find( ( taxonomyOptions || [] ), taxonomyEntry => taxonomyEntry.name === selectedTaxonomy ) || {}
								return entry
							} )

							this.props.onChangeTaxonomy( compact( passedTaxonomyValues ).join( ',' ) )
						} }
					/>
				</Fragment>
				}
			</div>
		)
	}
}

TaxonomyControl.defaultProps = {
	postType: 'post',
	onChangePostType: () => {},
	taxonomyType: 'category',
	onChangeTaxonomyType: () => {},
	taxonomy: '',
	onChangeTaxonomy: () => {},
}

export default TaxonomyControl
