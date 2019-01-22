import { edit, save } from '../index'

describe( 'Pricing Box', () => {
	test( 'block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				pricingBoxTitle: 'Basic',
				price: '$9',
				perMonthLabel: 'per month',
				buttonText: 'Buy Now',
				featureList: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				pricingBoxColor: '#000000',
				priceColor: '#000000',
				perMonthLabelColor: '#000000',
				buttonColor: '#000000',
				buttonTextColor: '#000000',
				featureListColor: '#000000',
				columns: '1',
				size: 'normal',
				cornerButtonRadius: '4',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '2 column block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				url2: 'http://www.gambit.ph/',
				pricingBoxTitle: 'Basic',
				pricingBoxTitle2: 'Basic',
				price: '$9',
				price2: '$9',
				perMonthLabel: 'per month',
				perMonthLabel2: 'per month',
				buttonText: 'Buy Now',
				buttonText2: 'Buy Now',
				featureList: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				featureList2: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				pricingBoxColor: '#000000',
				priceColor: '#000000',
				perMonthLabelColor: '#000000',
				buttonColor: '#000000',
				buttonTextColor: '#000000',
				featureListColor: '#000000',
				columns: '2',
				size: 'normal',
				cornerButtonRadius: '4',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '3 column block edit matches snapshots', () => {
		const wrapper = edit( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				url2: 'http://www.gambit.ph/',
				url3: 'http://www.gambit.ph/',
				pricingBoxTitle: 'Basic',
				pricingBoxTitle2: 'Basic',
				pricingBoxTitle3: 'Basic',
				price: '$9',
				price2: '$9',
				price3: '$9',
				perMonthLabel: 'per month',
				perMonthLabel2: 'per month',
				perMonthLabel3: 'per month',
				buttonText: 'Buy Now',
				buttonText2: 'Buy Now',
				buttonText3: 'Buy Now',
				featureList: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				featureList2: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				featureList3: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				pricingBoxColor: '#000000',
				priceColor: '#000000',
				perMonthLabelColor: '#000000',
				buttonColor: '#000000',
				buttonTextColor: '#000000',
				featureListColor: '#000000',
				columns: '3',
				size: 'normal',
				cornerButtonRadius: '4',
			},

		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( 'block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				pricingBoxTitle: 'Basic',
				price: '$9',
				perMonthLabel: 'per month',
				buttonText: 'Buy Now',
				featureList: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				pricingBoxColor: '#000000',
				priceColor: '#000000',
				perMonthLabelColor: '#000000',
				buttonColor: '#000000',
				buttonTextColor: '#000000',
				featureListColor: '#000000',
				columns: '1',
				size: 'normal',
				cornerButtonRadius: '4',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '2 column block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				url2: 'http://www.gambit.ph/',
				pricingBoxTitle: 'Basic',
				pricingBoxTitle2: 'Basic',
				price: '$9',
				price2: '$9',
				perMonthLabel: 'per month',
				perMonthLabel2: 'per month',
				buttonText: 'Buy Now',
				buttonText2: 'Buy Now',
				featureList: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				featureList2: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				pricingBoxColor: '#000000',
				priceColor: '#000000',
				perMonthLabelColor: '#000000',
				buttonColor: '#000000',
				buttonTextColor: '#000000',
				featureListColor: '#000000',
				columns: '2',
				size: 'normal',
				cornerButtonRadius: '4',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )

	test( '3 column block save matches snapshots', () => {
		const wrapper = save( {
			isSelected: false,
			attributes: {
				url: 'http://www.gambit.ph/',
				url2: 'http://www.gambit.ph/',
				url3: 'http://www.gambit.ph/',
				pricingBoxTitle: 'Basic',
				pricingBoxTitle2: 'Basic',
				pricingBoxTitle3: 'Basic',
				price: '$9',
				price2: '$9',
				price3: '$9',
				perMonthLabel: 'per month',
				perMonthLabel2: 'per month',
				perMonthLabel3: 'per month',
				buttonText: 'Buy Now',
				buttonText2: 'Buy Now',
				buttonText3: 'Buy Now',
				featureList: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				featureList2: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				featureList3: 'Consectetur adipiscing elit Suspendisse at pretium tortor Vestibulum ante ipsum primis In faucibus orci luctus et Ultrices posuere cubilia cura Aenean consectetur nec',
				pricingBoxColor: '#000000',
				priceColor: '#000000',
				perMonthLabelColor: '#000000',
				buttonColor: '#000000',
				buttonTextColor: '#000000',
				featureListColor: '#000000',
				columns: '3',
				size: 'normal',
				cornerButtonRadius: '4',
			},
		} )

		expect( wrapper ).toMatchSnapshot()
	} )
} )
