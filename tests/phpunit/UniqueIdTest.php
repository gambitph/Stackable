<?php
/**
 * Duplicate uniqueId rewrite on the frontend.
 *
 * @package Stackable
 */

class UniqueIdTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/unique-id.php' );
		$GLOBALS['stackable_unique_ids'] = array();
	}

	public function test_non_stackable_block_is_unchanged() {
		$html = '<p class="stk-abc1234">Hello</p>';
		$out = stackable_prevent_duplicate_unique_ids( $html, array(
			'blockName' => 'core/paragraph',
			'attrs' => array( 'uniqueId' => 'abc1234' ),
		) );
		$this->assertSame( $html, $out );
	}

	public function test_missing_attrs_is_unchanged() {
		$html = '<div class="stk-abc1234"></div>';
		$out = stackable_prevent_duplicate_unique_ids( $html, array(
			'blockName' => 'stackable/heading',
		) );
		$this->assertSame( $html, $out );
	}

	public function test_empty_unique_id_is_unchanged() {
		$html = '<div class="stk-block"></div>';
		$out = stackable_prevent_duplicate_unique_ids( $html, array(
			'blockName' => 'stackable/heading',
			'attrs' => array( 'uniqueId' => '' ),
		) );
		$this->assertSame( $html, $out );
	}

	public function test_first_unique_id_is_kept() {
		$html = '<h2 class="stk-abc1234" data-block-id="abc1234">Title</h2>';
		$block = array(
			'blockName' => 'stackable/heading',
			'attrs' => array( 'uniqueId' => 'abc1234' ),
		);
		$out = stackable_prevent_duplicate_unique_ids( $html, $block );
		$this->assertSame( $html, $out );
	}

	public function test_duplicate_unique_id_is_rewritten() {
		$html = '<h2 class="stk-abc1234" data-block-id="abc1234">Title</h2>';
		$block = array(
			'blockName' => 'stackable/heading',
			'attrs' => array( 'uniqueId' => 'abc1234' ),
		);

		stackable_prevent_duplicate_unique_ids( $html, $block );
		$second = stackable_prevent_duplicate_unique_ids( $html, $block );

		$this->assertStringNotContainsString( 'abc1234', $second );
		$this->assertMatchesRegularExpression( '/stk-[0-9a-z]{7}/', $second );
		$this->assertMatchesRegularExpression( '/data-block-id="[0-9a-z]{7}"/', $second );

		$third = stackable_prevent_duplicate_unique_ids( $html, $block );
		$this->assertStringNotContainsString( 'abc1234', $third );
		$this->assertNotSame( $second, $third );
	}
}
