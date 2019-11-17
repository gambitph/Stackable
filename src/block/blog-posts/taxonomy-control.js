/**
 * External dependencies
 */
import {
	i18n, isPro,
} from 'stackable'
import { AdvancedSelectControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element'
import { Spinner } from '@wordpress/components'
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
		const taxonomyOptions = [ { label: __( 'All', i18n ), value: '' } ]
		let taxonomyLabel = ''

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
								label: terms[ i ].name,
								value: terms[ i ].term_id,
							} )
						} )
					}
				} )
			}
		} )

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
					<AdvancedSelectControl
						label={ taxonomyLabel }
						options={ taxonomyOptions }
						value={ this.props.taxonomy }
						onChange={ this.props.onChangeTaxonomy }
					/>
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
