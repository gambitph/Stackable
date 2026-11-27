// The set of URLs/variants captured for before/after comparison.
const TT5 = [ 'home', 'about', 'services', 'pricing', 'contact', 'event', 'blog', 'faq', 'ks-layout', 'ks-content', 'ks-interactive', 'design-system', 'benchmark', 'highlight-core',
	'dyn-synced', 'dyn-template-part', 'dyn-popup', 'dyn-query', 'dyn-alm', 'post-launch-checklist', 'post-faq-roundup' ]
const TT1 = [ 'home', 'blog', 'ks-content', 'design-system', 'benchmark', 'highlight-core', 'dyn-widget', 'dyn-synced', 'dyn-alm' ]
const BP = [ 'home', 'ks-layout', 'ks-content', 'design-system', 'benchmark' ]
const T = []
TT5.forEach( s => T.push( { id: `tt5/${ s }`, path: `/${ s }/`, cookies: {}, viewports: [ 1440, 768, 375 ] } ) )
T.push( { id: 'tt5/blog-page2', path: '/blog/?stk-query-1-page=2', cookies: {}, viewports: [ 1440, 768, 375 ] } )
TT1.forEach( s => T.push( { id: `tt1/${ s }`, path: `/${ s }/`, cookies: { lm_theme: 'twentytwentyone' }, viewports: [ 1440, 768, 375 ] } ) )
BP.forEach( s => T.push( { id: `bp/${ s }`, path: `/${ s }/`, cookies: { lm_bp: '1' }, viewports: [ 1440, 1050, 768, 375 ] } ) )
module.exports = T
