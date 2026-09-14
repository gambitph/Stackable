<?php
/**
 * Posts block WP_Query args from block attributes.
 *
 * @package Stackable
 */

class PostsQueryTest extends Stackable_TestCase {

	protected function set_up() {
		parent::set_up();
		$this->require_plugin_file( 'src/block/posts/index.php' );
	}

	public function test_defaults_use_numberposts_not_posts_per_page() {
		$query = generate_post_query_from_stackable_posts_block( array() );
		$this->assertSame( 6, $query['numberposts'] );
		$this->assertArrayNotHasKey( 'posts_per_page', $query );
		$this->assertSame( 'date', $query['orderby'] );
		$this->assertSame( 'desc', $query['order'] );
		$this->assertSame( 'post', $query['post_type'] );
	}

	public function test_category_in_and_not_in() {
		$in = generate_post_query_from_stackable_posts_block( array(
			'taxonomyType' => 'category',
			'taxonomy' => '3,7',
			'taxonomyFilterType' => '__in',
		) );
		$this->assertSame( array( '3', '7' ), $in['category__in'] );

		$not = generate_post_query_from_stackable_posts_block( array(
			'taxonomyType' => 'category',
			'taxonomy' => '3,7',
			'taxonomyFilterType' => '__not_in',
		) );
		$this->assertSame( array( '3', '7' ), $not['category__not_in'] );
	}

	public function test_custom_taxonomy_operator() {
		$in = generate_post_query_from_stackable_posts_block( array(
			'taxonomyType' => 'product_cat',
			'taxonomy' => '11,12',
			'taxonomyFilterType' => '__in',
		) );
		$this->assertSame( 'IN', $in['tax_query'][0]['operator'] );
		$this->assertSame( array( '11', '12' ), $in['tax_query'][0]['terms'] );

		$not = generate_post_query_from_stackable_posts_block( array(
			'taxonomyType' => 'product_cat',
			'taxonomy' => '11',
			'taxonomyFilterType' => '__not_in',
		) );
		$this->assertSame( 'NOT IN', $not['tax_query'][0]['operator'] );
	}

	public function test_two_category_filters_produce_different_queries() {
		$a = generate_post_query_from_stackable_posts_block( array(
			'taxonomyType' => 'category',
			'taxonomy' => '1',
			'taxonomyFilterType' => '__in',
		) );
		$b = generate_post_query_from_stackable_posts_block( array(
			'taxonomyType' => 'category',
			'taxonomy' => '2',
			'taxonomyFilterType' => '__in',
		) );
		$this->assertNotSame( $a['category__in'], $b['category__in'] );
	}
}
