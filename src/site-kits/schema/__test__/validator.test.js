/* eslint-env node */

const fs = require( 'fs' )
const path = require( 'path' )

const {
	isPortablePackagePath,
	listPackageEntries,
	listPackageFiles,
	validatePackageDirectory,
	validateSiteKitPackage,
} = require( '../../../../tools/site-kits/validate-package' )

const fixtureRoot = path.resolve( __dirname, '../../../../e2e/config/fixtures/site-kits' )
const validPackageDirectory = path.join( fixtureRoot, 'valid/consultant' )
const validPackage = JSON.parse( fs.readFileSync( path.join( validPackageDirectory, 'meta.json' ), 'utf8' ) )
const invalidCases = JSON.parse( fs.readFileSync( path.join( fixtureRoot, 'invalid-cases.json' ), 'utf8' ) )

const clone = value => JSON.parse( JSON.stringify( value ) )

const setAtPath = ( target, fieldPath, value ) => {
	const segments = fieldPath.split( '.' )
	const property = segments.pop()
	const parent = segments.reduce( ( current, segment ) => current[ segment ], target )
	parent[ property ] = value
}

describe( 'Site Kit package validator', () => {
	test( 'accepts the canonical version 1 package directory', () => {
		expect( validatePackageDirectory( validPackageDirectory ) ).toEqual( [] )
	} )

	test.each( Object.entries( invalidCases ) )( 'returns specific errors for %s', ( name, fixture ) => {
		const packageData = clone( validPackage )
		fixture.mutations.forEach( mutation => {
			setAtPath( packageData, mutation.path, mutation.value )
		} )

		const removedFiles = new Set( fixture.removeFiles || [] )
		const files = listPackageFiles( validPackageDirectory ).filter( file => ! removedFiles.has( file ) )
		const errors = validateSiteKitPackage( packageData, {
			directorySlug: fixture.directorySlug || packageData.slug,
			files,
		} )
		const errorCodes = errors.map( error => error.code )

		for ( const expectedCode of fixture.expectedCodes ) {
			expect( errorCodes ).toContain( expectedCode )
		}
	} )

	test( 'rejects package media references missing from the manifest', () => {
		const packageData = clone( validPackage )
		packageData.pages[ 0 ].content = packageData.pages[ 0 ].content.replace(
			'assets/hero-office.png',
			'assets/unlisted.png'
		)

		const errors = validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
		} )

		expect( errors.map( error => error.code ) ).toContain( 'unlisted_media_reference' )
	} )

	test( 'rejects references to pages that are not in the package', () => {
		const packageData = clone( validPackage )
		packageData.menu.items[ 0 ].page = 'missing-page'

		const errors = validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
		} )

		expect( errors.map( error => error.code ) ).toContain( 'unknown_page_reference' )
	} )

	test( 'rejects symbolic links discovered in the package directory', () => {
		const packageData = clone( validPackage )
		const errors = validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
			unsafeFiles: [ 'assets/linked-file.svg' ],
		} )

		expect( errors ).toContainEqual( expect.objectContaining( {
			code: 'invalid_path',
			message: expect.stringContaining( 'symbolic links' ),
		} ) )
	} )

	test( 'discovers symbolic links without following them', () => {
		const readdirSpy = jest.spyOn( fs, 'readdirSync' ).mockReturnValue( [ {
			name: 'linked-file.svg',
			isDirectory: () => false,
			isSymbolicLink: () => true,
		} ] )

		try {
			expect( listPackageEntries( '/site-kit/assets' ) ).toEqual( {
				files: [],
				unsafeFiles: [ 'linked-file.svg' ],
			} )
		} finally {
			readdirSpy.mockRestore()
		}
	} )

	test.each( [ '../outside.svg', 'assets/../outside.svg', 'assets/./image.svg', '/assets/image.svg', 'C:\\image.svg' ] )(
		'rejects non-portable package path %s',
		filePath => {
			expect( isPortablePackagePath( filePath ) ).toBe( false )
		}
	)

	test( 'accepts a single-file WordPress plugin slug', () => {
		const packageData = clone( validPackage )
		packageData.plugins[ 0 ].slug = 'hello.php'

		expect( validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
		} ) ).toEqual( [] )
	} )

	test( 'rejects extensionless media embedded in markup', () => {
		const packageData = clone( validPackage )
		packageData.pages[ 0 ].content = '<img src="https://cdn.example.com/media/123" />'

		expect( validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
		} ).map( error => error.code ) ).toContain( 'external_media_url' )
	} )

	test( 'rejects extensionless media stored in a block media attribute', () => {
		const packageData = clone( validPackage )
		packageData.pages[ 0 ].content = '<!-- wp:stackable/image {"imageUrl":"https://cdn.example.com/media/123"} /-->'

		expect( validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
		} ).map( error => error.code ) ).toContain( 'external_media_url' )
	} )

	test( 'rejects media ID tokens missing from the manifest', () => {
		const packageData = clone( validPackage )
		packageData.pages[ 0 ].content = '<!-- wp:image {"stkSiteKitMediaIds":{"id":"missing-media"}} /-->'

		expect( validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
		} ).map( error => error.code ) ).toContain( 'unknown_media_reference' )
	} )

	test( 'does not hide a wrong version type as an unknown supported version', () => {
		const packageData = clone( validPackage )
		packageData.version = '1'

		expect( validateSiteKitPackage( packageData, {
			directorySlug: packageData.slug,
			files: listPackageFiles( validPackageDirectory ),
		} ).map( error => error.code ) ).toContain( 'schema_const' )
	} )
} )
