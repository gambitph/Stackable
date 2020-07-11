import { addCustomIconClass, cleanSvgString } from '..'

describe( 'addCustomIconClass', () => {
	it( 'should add class', () => {
		expect( addCustomIconClass( '<svg></svg>', 'my-class' ) ).toBe( '<svg class="my-class"></svg>' )
		expect( addCustomIconClass( '<svg class="another"></svg>', 'my-class' ) ).toBe( '<svg class="my-class another"></svg>' )
		expect( addCustomIconClass( '<svg class=\'another\'></svg>', 'my-class' ) ).toBe( '<svg class=\'my-class another\'></svg>' )
		expect( addCustomIconClass( '<svg attr="1" attr2="2" class=\'another\'></svg>', 'my-class' ) ).toBe( '<svg attr="1" attr2="2" class=\'my-class another\'></svg>' )
		expect( addCustomIconClass( '<svg class="another"><g></g></svg>', 'my-class' ) ).toBe( '<svg class="my-class another"><g></g></svg>' )
		expect( addCustomIconClass( '<svg><g class="another"></g></svg>', 'my-class' ) ).toBe( '<svg class="my-class"><g class="another"></g></svg>' )
		expect( addCustomIconClass( '<div><svg></svg></div>', 'my-class' ) ).toBe( '<div><svg class="my-class"></svg></div>' )
		expect( addCustomIconClass( '<div>not an svg</div>', 'my-class' ) ).toBe( '<div>not an svg</div>' )
	} )
} )

describe( 'cleanSvgString', () => {
	it( 'sould extract the SVG only', () => {
		expect( cleanSvgString( '<svg></svg>' ) ).toBe( '<svg></svg>' )
		expect( cleanSvgString( '<?xml ?><svg></svg>' ) ).toBe( '<svg></svg>' )
		expect( cleanSvgString( '<?xml ?><!-- Generator: Adobe Illustrator --><svg></svg>' ) ).toBe( '<svg></svg>' )
		expect( cleanSvgString( '<!-- Generator: Adobe Illustrator --><svg></svg>' ) ).toBe( '<svg></svg>' )
		expect( cleanSvgString( 'something<svg></svg>something' ) ).toBe( '<svg></svg>' )
	} )

	it( 'should remove simple SVG groupings', () => {
		expect( cleanSvgString( '<svg><g><path /></g></svg>' ) ).toBe( '<svg><path /></svg>' )
		expect( cleanSvgString( '<svg><g><g></g><g><path /></g></g><g></g></svg>' ) ).toBe( '<svg><path /></svg>' )
	} )

	it( 'should not remove complex SVG groupings', () => {
		expect( cleanSvgString( '<svg><g id="id"><path /></g></svg>' ) ).toBe( '<svg><g id="id"><path /></g></svg>' )
	} )
} )
