/**
 * Frontend CSS rule data (used by src/frontend-css.php).
 *
 * For each frontend stylesheet we write a `.rules` file next to it, with one
 * CSS rule per line and, for each selector, the Stackable classes an element
 * needs for that selector to match anything. At runtime PHP only prints the
 * rules whose classes are on the page (see Stackable_Frontend_CSS::get_css_subset).
 *
 * Line format (tab separated):
 *
 *   kind \t media \t conditions \t selectors \t declarations
 *
 * - kind: r = rule, h = rule with vendor-prefixed selectors (all or nothing,
 *   so browsers still drop it as a whole), x = other at-rule, always printed
 *   as is (the at-rule text is in the last column).
 * - media: the @media params the rule is in, or empty.
 * - conditions / selectors: one per selector, separated by \x1f.
 *   A condition is a space separated list of atoms that all need to match:
 *     stk-foo       the class must be on the page
 *     stk-a|stk-b   one of the classes must be on the page (from :is() / :where())
 *     #3            a column block with at least 3 columns must be on the page
 *   An empty condition always matches.
 *
 * Only `stk-` / `ugb-` classes (and the responsive text align classes) are
 * conditions. Classes inside :not() / :has() are ignored, classes added by
 * our frontend scripts count as always present (or present when their
 * block is), so a rule is only left out when it can't match.
 */
const fs = require( 'fs' )
const path = require( 'path' )
const postcss = require( 'postcss' )
const selectorParser = require( 'postcss-selector-parser' )

const TOKEN = /^(stk|ugb)-|^has-text-align-[a-z]+-(tablet|mobile)$/
const SEP = '\x1f'

/**
 * Classes our frontend scripts add or look for. Returns
 * { always: Set, prefixes: [], triggered: Map( class => Set( trigger classes ) ) }
 *
 * Scripts of a block (src/block/{name}/frontend-*.js) only run when the block
 * is on the page, their classes are only possible when `stk-block-{name}` is.
 */
function getScriptClasses( root ) {
	const glob = require( 'glob' )
	const entries = []
	for ( const base of [ 'src', 'pro__premium_only/src' ] ) {
		for ( const f of glob.sync( base + '/**/*.js', { cwd: root } ) ) {
			if ( /\/deprecated\//.test( f ) || /\/(node_modules|test|__tests__)\//.test( f ) ) {
				continue
			}
			// Frontend entries, and polyfills loaded in the frontend (e.g. the image optimizer polyfill).
			if ( /(^|\/)(frontend[^/]*|[^/]*-frontend|block-frontend|[^/]*polyfill[^/]*)\.js$/.test( f ) ) {
				const m = f.match( /\/block\/([^/]+)\/[^/]+$/ )
				entries.push( { file: path.resolve( root, f ), trigger: m ? 'stk-block-' + m[ 1 ] : '' } )
			}
		}
	}
	const always = new Set(), prefixes = new Set(), triggered = new Map()
	const add = ( cls, trigger ) => {
		if ( ! trigger ) {
			return always.add( cls )
		}
		if ( ! triggered.has( cls ) ) {
			triggered.set( cls, new Set() )
		}
		triggered.get( cls ).add( trigger )
	}
	for ( const { file, trigger } of entries ) {
		// The entry and the local modules it imports.
		const seen = new Set( [ file ] ), queue = [ file ]
		while ( queue.length ) {
			const f = queue.pop()
			const src = fs.readFileSync( f, 'utf8' )
			for ( const m of src.matchAll( /(?:from\s+|require\(\s*|import\(\s*)['"]([^'"]+)['"]/g ) ) {
				let p = m[ 1 ]
				if ( p.startsWith( '~stackable/' ) ) {
					p = path.resolve( root, 'src', p.slice( 11 ) )
				} else if ( p.startsWith( '.' ) ) {
					p = path.resolve( path.dirname( f ), p )
				} else {
					continue
				}
				for ( const c of [ p, p + '.js', p + '/index.js' ] ) {
					if ( fs.existsSync( c ) && fs.statSync( c ).isFile() ) {
						if ( ! seen.has( c ) ) {
							seen.add( c )
							queue.push( c )
						}
						break
					}
				}
			}
			// All class-like words in strings.
			for ( const m of src.matchAll( /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g ) ) {
				const parts = m[ 2 ].split( /\$\{[^}]*\}/ )
				parts.forEach( ( part, i ) => {
					const words = part.split( /[\s.,>:#[\]()'"=+~*]+/ )
					words.forEach( ( word, j ) => {
						if ( ! TOKEN.test( word ) ) {
							return
						}
						// `stk-foo-${ x }`: any class starting with stk-foo-
						if ( i < parts.length - 1 && j === words.length - 1 && part.endsWith( word ) ) {
							if ( word.length > 6 ) {
								prefixes.add( word )
							}
							return
						}
						add( word, trigger )
					} )
				} )
			}
			// Pairing quotes can go out of step (e.g. an apostrophe in a
			// comment), so also take every class-like word in the file.
			// Extra words only keep more rules, never fewer.
			for ( const m of src.matchAll( /[A-Za-z0-9_-]+/g ) ) {
				if ( TOKEN.test( m[ 0 ] ) && ! m[ 0 ].endsWith( '-' ) ) {
					add( m[ 0 ], trigger )
				}
			}
			// Class names built at runtime: `stk-foo-${ x }` or 'stk-foo-' + x
			for ( const m of src.matchAll( /([A-Za-z0-9_-]+-)(?:\$\{|['"`]\s*\+)/g ) ) {
				if ( TOKEN.test( m[ 1 ] ) && m[ 1 ].length > 6 ) {
					prefixes.add( m[ 1 ] )
				}
			}
		}
	}
	// Inline scripts printed by PHP, e.g. the `stk--anim-init` body class
	// added in src/init.php. These run on every page.
	for ( const base of [ 'src', 'pro__premium_only/src' ] ) {
		for ( const f of glob.sync( base + '/**/*.php', { cwd: root } ) ) {
			const src = fs.readFileSync( path.resolve( root, f ), 'utf8' )
			for ( const m of src.matchAll( /classList\.(?:add|toggle|replace)\(([^)]*)\)/g ) ) {
				for ( const w of m[ 1 ].match( /[A-Za-z0-9_-]+/g ) || [] ) {
					if ( TOKEN.test( w ) && ! w.endsWith( '-' ) ) {
						always.add( w )
					}
				}
			}
		}
	}
	return { always, prefixes: [ ...prefixes ], triggered }
}

// The condition (array of atoms) of one selector.
function selectorCondition( sel, scripts ) {
	const atoms = []
	const classAtom = cls => {
		if ( ! TOKEN.test( cls ) || scripts.always.has( cls ) || scripts.prefixes.some( p => cls.startsWith( p ) ) ) {
			return null
		}
		if ( scripts.triggered.has( cls ) ) {
			return [ cls, ...scripts.triggered.get( cls ) ].join( '|' )
		}
		return cls
	}
	let compound = []
	const compounds = [ compound ]
	sel.nodes.forEach( n => {
		if ( n.type === 'combinator' ) {
			compound = []
			compounds.push( compound )
		} else {
			compound.push( n )
		}
	} )
	for ( const c of compounds ) {
		const isColumn = c.some( n => n.type === 'class' && n.value === 'stk-block-column' )
		for ( const n of c ) {
			if ( n.type === 'class' ) {
				const atom = classAtom( n.value )
				if ( atom ) {
					atoms.push( atom )
				}
			} else if ( n.type === 'pseudo' ) {
				const name = n.value.toLowerCase()
				if ( name === ':is' || name === ':where' || name === ':matches' || name === ':-webkit-any' || name === ':-moz-any' ) {
					// One of the selectors in it has to match. For each, use
					// one class it needs (a necessary condition).
					const alts = n.nodes.map( s => selectorCondition( s, scripts ).filter( a => a[ 0 ] !== '#' ) )
					if ( alts.length && alts.every( a => a.length ) ) {
						const tokens = new Set()
						alts.forEach( a => {
							const single = a.find( x => ! x.includes( '|' ) ) || a[ 0 ]
							single.split( '|' ).forEach( t => tokens.add( t ) )
						} )
						atoms.push( [ ...tokens ].join( '|' ) )
					}
				} else if ( isColumn && /^:nth-(last-)?(child|of-type)$/.test( name ) && n.nodes.length === 1 ) {
					const arg = String( n.nodes[ 0 ] ).trim()
					if ( /^\d+$/.test( arg ) && +arg > 1 ) {
						atoms.push( '#' + arg )
					}
				}
				// :not(), :has() and others: ignored.
			}
		}
	}
	return [ ...new Set( atoms ) ]
}

const clean = s => s.replace( /\s*\n\s*/g, ' ' ).trim()

/**
 * The rule data of a stylesheet.
 *
 * @param {string} css
 * @param {Object} scripts getScriptClasses()
 * @return {string}
 */
function buildRules( css, scripts ) {
	const lines = []
	const check = ( s, where ) => {
		if ( /[\t\x1f\n\r]/.test( s ) ) {
			throw new Error( `frontend-css-rules: unexpected character in ${ where }: ${ s.slice( 0, 100 ) }` )
		}
		return s
	}
	const ruleLine = ( rule, media ) => {
		const selectors = rule.selectors.map( clean )
		const hack = selectors.some( s => /:-|::-/.test( s ) )
		const conds = selectors.map( s => {
			let cond = []
			selectorParser( root => {
				cond = selectorCondition( root.nodes[ 0 ], scripts )
			} ).processSync( s )
			return cond.join( ' ' )
		} )
		const body = clean( rule.nodes.map( n => n.toString() ).join( ';' ) )
		lines.push( [ hack ? 'h' : 'r', check( media, 'media' ), conds.join( SEP ), selectors.map( x => check( x, 'selector' ) ).join( SEP ), check( body, 'declarations' ) ].join( '\t' ) )
	}
	const rawLine = ( node, media ) => {
		lines.push( [ 'x', check( media, 'media' ), '', '', check( clean( node.toString() ), 'at-rule' ) ].join( '\t' ) )
	}
	postcss.parse( css ).nodes.forEach( node => {
		if ( node.type === 'rule' ) {
			ruleLine( node, '' )
		} else if ( node.type === 'atrule' && node.name === 'media' ) {
			node.nodes.forEach( child => {
				if ( child.type === 'rule' ) {
					ruleLine( child, clean( node.params ) )
				} else if ( child.type !== 'comment' ) {
					rawLine( child, clean( node.params ) )
				}
			} )
		} else if ( node.type === 'atrule' ) {
			rawLine( node, '' )
		}
	} )
	return lines.join( '\n' ) + '\n'
}

/**
 * Writes {file}.rules next to each of the given stylesheets.
 */
function writeRulesFiles( root, files ) {
	const scripts = getScriptClasses( root )
	for ( const file of files ) {
		const abs = path.resolve( root, file )
		fs.writeFileSync( abs.replace( /\.css$/, '.rules' ), buildRules( fs.readFileSync( abs, 'utf8' ), scripts ) )
	}
}

/**
 * The same subset as PHP prints, for tests and tools.
 *
 * @param {string} rules  Contents of a .rules file
 * @param {Set} tokens   Classes on the page
 * @param {number} maxColumns
 */
function subset( rules, tokens, maxColumns = 0 ) {
	const ok = cond => cond === '' || cond.split( ' ' ).every( a => a[ 0 ] === '#' ? maxColumns >= +a.slice( 1 ) : a.split( '|' ).some( t => tokens.has( t ) ) )
	let out = '', media = ''
	for ( const line of rules.split( '\n' ) ) {
		if ( ! line ) {
			continue
		}
		const [ kind, m, conds, sels, body ] = line.split( '\t' )
		let css = ''
		if ( kind === 'x' ) {
			css = body
		} else {
			const s = sels.split( SEP )
			let keep = conds.split( SEP ).map( ( c, i ) => ok( c ) ? s[ i ] : null ).filter( x => x !== null )
			if ( kind === 'h' && keep.length ) {
				keep = s
			}
			if ( ! keep.length ) {
				continue
			}
			css = keep.join( ',' ) + '{' + body + '}'
		}
		if ( m !== media ) {
			out += ( media ? '}' : '' ) + ( m ? '@media ' + m + '{' : '' )
			media = m
		}
		out += css
	}
	return out + ( media ? '}' : '' )
}

module.exports = { getScriptClasses, buildRules, writeRulesFiles, subset, selectorCondition }
