import { addCustomIconClass } from '..'

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
