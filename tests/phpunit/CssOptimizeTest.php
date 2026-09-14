<?php
/**
 * Inline CSS optimizer: parse, skip dynamic, combine selectors.
 *
 * @package Stackable
 */

class CssOptimizeTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/css-optimize.php' );
	}

	public function test_parse_block_style_collects_css_by_unique_id() {
		$styles = array();
		Stackable_CSS_Optimize::parse_block_style(
			array(
				'innerHTML' => '<div><style>.stk-aaaaaaa{color:red}</style></div>',
				'attrs' => array( 'uniqueId' => 'aaaaaaa' ),
			),
			$styles
		);
		$this->assertArrayHasKey( 'aaaaaaa', $styles );
		$this->assertSame( '.stk-aaaaaaa{color:red}', $styles['aaaaaaa'][0][1] );
	}

	public function test_dynamic_style_is_not_collected() {
		$styles = array();
		Stackable_CSS_Optimize::parse_block_style(
			array(
				'innerHTML' => '<div><style>.stk-aaaaaaa{background:url(!#stk_dynamic/current-page/featured-image-data!#)}</style></div>',
				'attrs' => array( 'uniqueId' => 'aaaaaaa' ),
			),
			$styles
		);
		$this->assertSame( array(), $styles );
	}

	public function test_generate_css_combines_matching_rules() {
		$css = Stackable_CSS_Optimize::generate_css( array(
			'.stk-aaaaaaa .child{color:red}',
			'.stk-bbbbbbb .child{color:red}',
		) );
		$this->assertStringContainsString( ':is(.stk-aaaaaaa, .stk-bbbbbbb)', $css );
		$this->assertStringContainsString( 'color:red', $css );
	}

	public function test_zero_px_is_left_in_generated_css() {
		$css = Stackable_CSS_Optimize::generate_css( array(
			'.stk-aaaaaaa{margin:0px}',
		) );
		$this->assertStringContainsString( '0px', $css );
	}
}
