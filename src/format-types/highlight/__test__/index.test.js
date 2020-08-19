import { extractColors } from '../'

describe( 'extractColors', () => {
	it( 'should extract different colors', () => {
		expect( extractColors( 'color: #123456' ) ).toEqual( {
			colorType: '',
			textColor: '#123456',
			highlightColor: '',
		} )
		expect( extractColors( 'color:#123456;' ) ).toEqual( {
			colorType: '',
			textColor: '#123456',
			highlightColor: '',
		} )
		expect( extractColors( 'color: #123456; background-color: #abcdef' ) ).toEqual( {
			colorType: 'highlight',
			textColor: '#123456',
			highlightColor: '#abcdef',
		} )
		expect( extractColors( 'color:#123456;background-color:#abcdef;' ) ).toEqual( {
			colorType: 'highlight',
			textColor: '#123456',
			highlightColor: '#abcdef',
		} )
		expect( extractColors( 'background-color:#abcdef;color:#123456;' ) ).toEqual( {
			colorType: 'highlight',
			textColor: '#123456',
			highlightColor: '#abcdef',
		} )
		expect( extractColors( 'background:linear-gradient( to bottom , transparent 50%, #abcdef 50%); color:#123456;' ) ).toEqual( {
			colorType: 'half',
			textColor: '#123456',
			highlightColor: '#abcdef',
		} )
		expect( extractColors( 'background:linear-gradient(to bottom,transparent 60%,#abcdef 60%);color:#123456;' ) ).toEqual( {
			colorType: 'half',
			textColor: '#123456',
			highlightColor: '#abcdef',
		} )
		expect( extractColors( 'color:#123456;background:linear-gradient(to bottom,transparent 60%,#abcdef 60%)' ) ).toEqual( {
			colorType: 'half',
			textColor: '#123456',
			highlightColor: '#abcdef',
		} )
	} )

	it( 'should extract custom properties', () => {
		expect( extractColors( 'color: var(--text-color123)' ) ).toEqual( {
			colorType: '',
			textColor: 'var(--text-color123)',
			highlightColor: '',
		} )
		expect( extractColors( 'color:var(--text-color123);' ) ).toEqual( {
			colorType: '',
			textColor: 'var(--text-color123)',
			highlightColor: '',
		} )
		expect( extractColors( 'color: var(--text-color123); background-color: var(--highlight-color123)' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'var(--text-color123)',
			highlightColor: 'var(--highlight-color123)',
		} )
		expect( extractColors( 'color:var(--text-color123);background-color:var(--highlight-color123);' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'var(--text-color123)',
			highlightColor: 'var(--highlight-color123)',
		} )
		expect( extractColors( 'background-color:var(--highlight-color123);color:var(--text-color123);' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'var(--text-color123)',
			highlightColor: 'var(--highlight-color123)',
		} )
		expect( extractColors( 'background:linear-gradient( to bottom , transparent 50%, var(--highlight-color123) 50%); color:var(--text-color123);' ) ).toEqual( {
			colorType: 'half',
			textColor: 'var(--text-color123)',
			highlightColor: 'var(--highlight-color123)',
		} )
		expect( extractColors( 'background:linear-gradient(to bottom,transparent 60%,var(--highlight-color123) 60%);color:var(--text-color123);' ) ).toEqual( {
			colorType: 'half',
			textColor: 'var(--text-color123)',
			highlightColor: 'var(--highlight-color123)',
		} )
		expect( extractColors( 'color:var(--text-color123);background:linear-gradient(to bottom,transparent 60%,var(--highlight-color123) 60%)' ) ).toEqual( {
			colorType: 'half',
			textColor: 'var(--text-color123)',
			highlightColor: 'var(--highlight-color123)',
		} )
		expect( extractColors( 'color: var(--text-color123, #123456)' ) ).toEqual( {
			colorType: '',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: '',
		} )
		expect( extractColors( 'color:var(--text-color123, #123456);' ) ).toEqual( {
			colorType: '',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: '',
		} )
		expect( extractColors( 'color: var(--text-color123, #123456); background-color: var(--highlight-color123, #123456)' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: 'var(--highlight-color123, #123456)',
		} )
		expect( extractColors( 'color:var(--text-color123, #123456);background-color:var(--highlight-color123, #123456);' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: 'var(--highlight-color123, #123456)',
		} )
		expect( extractColors( 'background-color:var(--highlight-color123, #123456);color:var(--text-color123, #123456);' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: 'var(--highlight-color123, #123456)',
		} )
		expect( extractColors( 'background:linear-gradient( to bottom , transparent 50%, var(--highlight-color123, #123456) 50%); color:var(--text-color123, #123456);' ) ).toEqual( {
			colorType: 'half',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: 'var(--highlight-color123, #123456)',
		} )
		expect( extractColors( 'background:linear-gradient(to bottom,transparent 60%,var(--highlight-color123, #123456) 60%);color:var(--text-color123, #123456);' ) ).toEqual( {
			colorType: 'half',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: 'var(--highlight-color123, #123456)',
		} )
		expect( extractColors( 'color:var(--text-color123, #123456);background:linear-gradient(to bottom,transparent 60%,var(--highlight-color123, #123456) 60%)' ) ).toEqual( {
			colorType: 'half',
			textColor: 'var(--text-color123, #123456)',
			highlightColor: 'var(--highlight-color123, #123456)',
		} )
	} )

	it( 'should extract rgb', () => {
		expect( extractColors( 'color: rgb(1, 2, 256)' ) ).toEqual( {
			colorType: '',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: '',
		} )
		expect( extractColors( 'color:rgb(1, 2, 256);' ) ).toEqual( {
			colorType: '',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: '',
		} )
		expect( extractColors( 'color: rgb(1, 2, 256); background-color: rgba(123, 123, 123, 0.50)' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: 'rgba(123, 123, 123, 0.50)',
		} )
		expect( extractColors( 'color:rgb(1, 2, 256);background-color:rgba(123, 123, 123, 0.50);' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: 'rgba(123, 123, 123, 0.50)',
		} )
		expect( extractColors( 'background-color:rgba(123, 123, 123, 0.50);color:rgb(1, 2, 256);' ) ).toEqual( {
			colorType: 'highlight',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: 'rgba(123, 123, 123, 0.50)',
		} )
		expect( extractColors( 'background:linear-gradient( to bottom , transparent 50%, rgba(123, 123, 123, 0.50) 50%); color:rgb(1, 2, 256);' ) ).toEqual( {
			colorType: 'half',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: 'rgba(123, 123, 123, 0.50)',
		} )
		expect( extractColors( 'background:linear-gradient(to bottom,transparent 60%,rgba(123, 123, 123, 0.50) 60%);color:rgb(1, 2, 256);' ) ).toEqual( {
			colorType: 'half',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: 'rgba(123, 123, 123, 0.50)',
		} )
		expect( extractColors( 'color:rgb(1, 2, 256);background:linear-gradient(to bottom,transparent 60%,rgba(123, 123, 123, 0.50) 60%)' ) ).toEqual( {
			colorType: 'half',
			textColor: 'rgb(1, 2, 256)',
			highlightColor: 'rgba(123, 123, 123, 0.50)',
		} )
	} )
} )
