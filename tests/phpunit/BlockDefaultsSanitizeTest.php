<?php
/**
 * Stored block-style sanitizers.
 *
 * @package Stackable
 */

use Brain\Monkey\Functions;

class BlockDefaultsSanitizeTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		Functions\when( 'wp_check_invalid_utf8' )->returnArg( 1 );
		Functions\when( 'parse_blocks' )->justReturn( array() );
		Functions\when( 'serialize_blocks' )->justReturn( '' );
		$this->require_plugin_file( 'src/deprecated/block-defaults/custom-block-styles.php' );
	}

	private function styles() {
		return new Stackable_Custom_Block_Styles();
	}

	public function test_sanitize_block_name_rejects_core_blocks() {
		$styles = $this->styles();
		$this->assertSame( '', $styles->sanitize_block_name( 'core/paragraph' ) );
		$this->assertSame( 'stackable/heading', $styles->sanitize_block_name( 'stackable/heading' ) );
	}

	public function test_sanitize_style_slug_uses_sanitize_title() {
		$this->assertSame( 'my-style', $this->styles()->sanitize_style_slug( 'My Style' ) );
	}

	public function test_sanitize_array_setting_rejects_non_array() {
		$this->assertSame( array(), $this->styles()->sanitize_array_setting( 'nope' ) );
	}

	public function test_sanitize_stored_block_styles_drops_invalid_blocks() {
		$styles = $this->styles();
		$stored = array(
			array(
				'block' => 'core/paragraph',
				'styles' => array(
					array(
						'slug' => 'plain',
						'name' => 'Plain',
						'data' => '{"attributes":{"text":"<script>x</script>"},"innerBlocks":[]}',
						'save' => '',
					),
				),
			),
			array(
				'block' => 'stackable/heading',
				'styles' => array(
					array(
						'slug' => 'hero',
						'name' => 'Hero',
						'data' => '{"attributes":{"text":"Hello <script>x</script>"},"innerBlocks":[]}',
						'save' => '',
					),
				),
			),
		);
		$out = $styles->sanitize_stored_block_styles( $stored );
		$this->assertCount( 1, $out );
		$this->assertSame( 'stackable/heading', $out[0]->block );
		$this->assertSame( 'hero', $out[0]->styles[0]->slug );
		$this->assertStringNotContainsString( '<script>', $out[0]->styles[0]->data );
	}
}
