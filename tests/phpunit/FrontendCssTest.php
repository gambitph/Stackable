<?php
/**
 * Frontend CSS: rule trimming, color scheme markers, custom breakpoints,
 * CSS for injected content, and the legacy setting on install / upgrade.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class FrontendCssTest extends Stackable_TestCase {

	private $dir;

	protected function set_up() {
		parent::set_up();
		Functions\when( 'is_admin' )->justReturn( false );
		Functions\when( 'wp_doing_ajax' )->justReturn( false );
		$this->require_plugin_file( 'src/frontend-css.php' );
		$this->dir = sys_get_temp_dir() . '/stk-frontend-css-' . uniqid();
		mkdir( $this->dir );
	}

	protected function tear_down() {
		array_map( 'unlink', glob( $this->dir . '/*' ) );
		rmdir( $this->dir );
		parent::tear_down();
	}

	/**
	 * Writes a stylesheet and its rule data (format of .config/frontend-css-rules.js).
	 */
	private function write( $css, $lines ) {
		file_put_contents( $this->dir . '/a.css', $css );
		file_put_contents( $this->dir . '/a.rules', implode( "\n", $lines ) . "\n" );
		return $this->dir . '/a.css';
	}

	public function test_condition_atoms() {
		$tokens = array( 'stk-a' => true, 'stk-b' => true );
		$this->assertTrue( Stackable_Frontend_CSS_Rules::condition_matches( 'stk-a', $tokens, 0 ) );
		$this->assertTrue( Stackable_Frontend_CSS_Rules::condition_matches( 'stk-a stk-b', $tokens, 0 ) );
		$this->assertFalse( Stackable_Frontend_CSS_Rules::condition_matches( 'stk-a stk-c', $tokens, 0 ) );
		$this->assertTrue( Stackable_Frontend_CSS_Rules::condition_matches( 'stk-c|stk-b', $tokens, 0 ) ); // :is() / :where()
		$this->assertFalse( Stackable_Frontend_CSS_Rules::condition_matches( 'stk-c|stk-d', $tokens, 0 ) );
		$this->assertFalse( Stackable_Frontend_CSS_Rules::condition_matches( 'stk-a #3', $tokens, 2 ) ); // nth-child(3) needs 3 columns
		$this->assertTrue( Stackable_Frontend_CSS_Rules::condition_matches( 'stk-a #3', $tokens, 3 ) );
	}

	public function test_subset_keeps_matching_selectors_in_order_and_media() {
		$sep = "\x1f";
		$path = $this->write( 'unused', array(
			"r\t\t\t.a\tcolor:red",
			"r\t\tstk-x\t.stk-x .y\tcolor:blue",
			"r\t(max-width:767px)\tstk-x\t.stk-x\tmargin:0",
			"r\t(max-width:767px)\tstk-z\t.stk-z\tmargin:1px",
			"r\t\tstk-z{$sep}stk-x\t.stk-z{$sep}.stk-x p\tpadding:0",
			"h\t\tstk-q{$sep}stk-x\t.stk-q::-moz-selection{$sep}.stk-x::selection\tcolor:red",
			"x\t\t\t\t@font-face{font-family:x}",
		) );
		$this->assertSame(
			'.a{color:red}.stk-x .y{color:blue}@media (max-width:767px){.stk-x{margin:0}}.stk-x p{padding:0}.stk-q::-moz-selection,.stk-x::selection{color:red}@font-face{font-family:x}',
			Stackable_Frontend_CSS_Rules::get_matching_css( $path, array( 'stk-x' => true ), 0 )
		);
		$this->assertSame( '.a{color:red}@font-face{font-family:x}', Stackable_Frontend_CSS_Rules::get_matching_css( $path, array(), 0 ) );
	}

	public function test_without_rule_data_the_whole_file_is_used() {
		file_put_contents( $this->dir . '/b.css', '.b{color:red}' );
		$this->assertSame( '.b{color:red}', Stackable_Frontend_CSS_Rules::get_matching_css( $this->dir . '/b.css', array(), 0 ) );
	}

	/**
	 * stackable_force_css_load prints whole files, and markup added by scripts
	 * has no color scheme marker class, so the old color scheme selectors
	 * are used again.
	 */
	public function test_old_color_scheme_selectors_replace_the_marker() {
		$this->assertSame(
			'.a{color:red}:where(' . Stackable_Frontend_CSS_Color_Schemes::OLD_SELECTORS . ') .stk-block>p{color:var(--stk-text-color)}',
			Stackable_Frontend_CSS_Color_Schemes::use_old_selectors( '.a{color:red}:where(.stk-has-scheme) .stk-block>p{color:var(--stk-text-color)}' )
		);
	}

	/**
	 * Custom breakpoints adjust the free stylesheets, but not the Premium
	 * ones: their media queries always used the default breakpoints.
	 */
	public function test_custom_breakpoints_adjust_free_stylesheets_only() {
		add_filter( 'stackable_frontend_css_has_custom_breakpoints', '__return_true' );
		add_filter( 'stackable_frontend_css', function( $css ) {
			return str_replace( '767px', '600px', $css );
		} );
		$css = '@media (max-width:767px){.a{x:1}}';
		$this->assertSame( '@media (max-width:600px){.a{x:1}}', Stackable_Frontend_CSS_Breakpoints::adjust_css( 'stk-block-card', $css ) );
		$this->assertSame( $css, Stackable_Frontend_CSS_Breakpoints::adjust_css( 'stk-block-card-premium', $css ) );
	}

	public function test_color_scheme_selectors_match_the_scss_list() {
		$scss = file_get_contents( dirname( __DIR__, 2 ) . '/src/styles/cssvars.scss' );
		$this->assertSame( 1, preg_match( '/\$stk-has-color-schemes-selector:(.*?)!default;/s', $scss, $m ) );
		preg_match_all( '/"([^"]+)"/', $m[1], $items );
		$this->assertSame( implode( ',', $items[1] ), Stackable_Frontend_CSS_Color_Schemes::OLD_SELECTORS );
	}

	public function test_fresh_install_stores_the_flag_off_and_autoloaded() {
		$added = null;
		Functions\when( 'add_option' )->alias( function( $name, $value = '', $deprecated = '', $autoload = null ) use ( &$added ) {
			$added = array( $name, $value, $autoload );
			return true;
		} );
		Functions\expect( 'update_option' )->never();
		( new Stackable_Frontend_CSS() )->keep_legacy_loading_on_upgrade( '', '3.21.0' );
		$this->assertSame( array( 'stackable_use_legacy_frontend_css', '', true ), $added );
	}

	public function test_upgrade_from_an_older_version_turns_the_flag_on() {
		Functions\when( 'get_option' )->justReturn( false );
		Functions\when( 'plugin_dir_path' )->alias( function( $f ) { return trailingslashit( dirname( $f ) ); } );
		Functions\when( 'trailingslashit' )->alias( function( $s ) { return rtrim( $s, '/' ) . '/'; } );
		Functions\expect( 'update_option' )->once()->with( 'stackable_use_legacy_frontend_css', '1' );
		( new Stackable_Frontend_CSS() )->keep_legacy_loading_on_upgrade( '3.20.3', '3.21.0' );
		$this->assertTrue( true );
	}

	public function test_upgrade_keeps_a_flag_the_user_already_set() {
		Functions\when( 'get_option' )->justReturn( '' );
		Functions\expect( 'update_option' )->never();
		( new Stackable_Frontend_CSS() )->keep_legacy_loading_on_upgrade( '3.20.3', '3.21.0' );
		$this->assertTrue( true );
	}

	public function test_reprint_starts_at_the_first_new_rule() {
		$old = '.a{x:1}@media (max-width:767px){.b{x:2}.d{x:4}}.e{content:"}"}';
		$new = '.a{x:1}@media (max-width:767px){.b{x:2}.c{x:3}.d{x:4}}.e{content:"}"}.f{x:6}';
		// The media query with the new rule is printed whole, with everything after it.
		$this->assertSame( '@media (max-width:767px){.b{x:2}.c{x:3}.d{x:4}}.e{content:"}"}.f{x:6}', Stackable_Frontend_CSS_Printer::get_css_from_first_change( $old, $new ) );
		$this->assertSame( '.f{x:6}', Stackable_Frontend_CSS_Printer::get_css_from_first_change( '.a{x:1}.e{content:"}"}', '.a{x:1}.e{content:"}"}.f{x:6}' ) );
		$this->assertSame( '.b{x:2}', Stackable_Frontend_CSS_Printer::get_css_from_first_change( '.a{x:1}', '.a{x:1}.b{x:2}' ) );
		$this->assertSame( '.b{x:2}.a{x:1}', Stackable_Frontend_CSS_Printer::get_css_from_first_change( '.a{x:1}', '.b{x:2}.a{x:1}' ) );
	}

	public function test_global_body_classes_for_ajax_and_rest() {
		$this->require_plugin_file( 'src/plugins/global-settings/color-schemes/index.php' );
		$options = array();
		Functions\when( 'get_option' )->alias( function( $name, $default = false ) use ( &$options ) {
			return array_key_exists( $name, $options ) ? $options[ $name ] : $default;
		} );
		$this->assertSame( array(), Stackable_Frontend_CSS_Page_Content::get_global_body_classes() );
		$options = array(
			'stackable_global_spacing_and_borders' => array( 'container-padding' => array( 'desktop' => array( 'top' => 36 ) ) ),
			'stackable_global_buttons_and_icons' => array( 'button-padding' => array( 'desktop' => array( 'top' => 12 ) ) ),
			'stackable_global_color_scheme_generated_css' => ':root{--stk-text-color:#000}.stk-block-background{--stk-text-color:#111}',
		);
		$classes = Stackable_Frontend_CSS_Page_Content::get_global_body_classes();
		$this->assertContains( 'stk-has-design-system-spacing-and-borders', $classes );
		$this->assertContains( 'stk-has-design-system-buttons-and-icons', $classes );
		$this->assertContains( 'stk--has-base-scheme', $classes );
		$this->assertContains( 'stk--has-background-scheme', $classes );
		// The body is styled by the base scheme, so it gets the marker class.
		$this->assertContains( Stackable_Frontend_CSS_Color_Schemes::MARKER, $classes );
	}

	public function test_scope_css_for_injected_content() {
		$w = ':where(.stk-injected-content,.stk-injected-content *)';
		// Custom properties go only on the outermost injected elements, so
		// that their children inherit them (and block styles still win).
		$top = ' :where(.stk-injected-content)';
		$css = ':root{--a:1}body.stk--has-base-scheme{--b:2}.stk-block .stk-a>p,.stk-b:hover{color:red}'
			. '@media (max-width:767px){.stk-c::before{content:"{,}"}}'
			. '@keyframes k{from{opacity:0}to{opacity:1}}@font-face{font-family:f}'
			. ':where(.stk-has-scheme) .stk-d:is(.a,.b) :not(.c){margin:0}.stk-e:after{x:y}';
		$this->assertSame(
			':where(:root)' . $top . '{--a:1}:where(body.stk--has-base-scheme)' . $top . '{--b:2}.stk-block .stk-a>p' . $w . ',.stk-b:hover' . $w . '{color:red}'
			. '@media (max-width:767px){.stk-c' . $w . '::before{content:"{,}"}}'
			. '@keyframes k{from{opacity:0}to{opacity:1}}@font-face{font-family:f}'
			. ':where(.stk-has-scheme) .stk-d:is(.a,.b) :not(.c)' . $w . '{margin:0}.stk-e' . $w . ':after{x:y}'
			. ':where(:root)' . $top . '{--c:3}body.stk--anim-init .stk-f' . $w . '{x:y}',
			Stackable_Frontend_CSS_Injected_Content::scope_css( $css . '/* comment */:root{--c:3}body.stk--anim-init .stk-f{x:y}' )
		);
	}
}
