<?php
/**
 * Attributes of `ugb/blog-posts` block.
 *
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_blog_posts_attributes' ) ) {
	/**
	 * Returns all the attributes for the blog post block to
	 * be used for `register_block_type`
	 * This is generated from the attributes found in index.js
	 *
	 * @return array The blog post attributes.
	 *
	 * @see index.js
	 *
	 * @since 2.0
	 */
	function stackable_blog_posts_attributes() {
		return array (
			'design' => array(
				'type' => 'string',
				'default' => 'basic',
			),
			'columns' => array(
				'type' => 'number',
				'default' => 2,
			),
			'borderRadius' => array(
				'type' => 'number',
				'default' => 12,
			),
			'shadow' => array(
				'type' => 'number',
				'default' => 3,
			),
			'contentOrder' => array(
				'type' => 'string',
				'default' => '',
			),
			'numberOfItems' => array(
				'type' => 'number',
				'default' => 6,
			),
			'order' => array(
				'type' => 'string',
				'default' => 'desc',
			),
			'orderBy' => array(
				'type' => 'string',
				'default' => 'date',
			),
			'postType' => array(
				'type' => 'string',
				'default' => 'post',
			),
			'taxonomyType' => array(
				'type' => 'string',
				'default' => 'category',
			),
			'taxonomy' => array(
				'type' => 'string',
				'default' => '',
			),
			'postOffset' => array(
				'type' => 'number',
				'default' => '',
			),
			'postExclude' => array(
				'type' => 'string',
				'default' => '',
			),
			'postInclude' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundColorType' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundColor2' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundMediaId' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundMediaUrl' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnTabletBackgroundMediaId' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnTabletBackgroundMediaUrl' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnMobileBackgroundMediaId' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnMobileBackgroundMediaUrl' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundGradientBlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundPosition' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnTabletBackgroundPosition' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnMobileBackgroundPosition' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundRepeat' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnTabletBackgroundRepeat' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnMobileBackgroundRepeat' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundSize' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnTabletBackgroundSize' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnMobileBackgroundSize' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundImageBlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnBackgroundColorOpacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnBackgroundTintStrength' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnBackgroundGradientDirection' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnBackgroundCustomSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnTabletBackgroundCustomSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnMobileBackgroundCustomSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnBackgroundGradientLocation1' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnBackgroundGradientLocation2' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnFixedBackground' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'columnBackgroundCustomSizeUnit' => array(
				'type' => 'string',
				'default' => '%',
			),
			'columnTabletBackgroundCustomSizeUnit' => array(
				'type' => 'string',
				'default' => '%',
			),
			'columnMobileBackgroundCustomSizeUnit' => array(
				'type' => 'string',
				'default' => '%',
			),
			'showImage' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'imageSize' => array(
				'type' => 'string',
				'default' => '',
			),
			'imageWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'imageTabletWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'imageMobileWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'imageHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'imageTabletHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'imageMobileHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'showCategory' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'categoryFontFamily' => array(
				'type' => 'string',
				'default' => '',
			),
			'categoryFontWeight' => array(
				'type' => 'string',
				'default' => '',
			),
			'categoryTextTransform' => array(
				'type' => 'string',
				'default' => '',
			),
			'categoryLetterSpacing' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryTabletFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryMobileFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryTabletLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryMobileLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'categoryTabletFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'categoryMobileFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'titleLineHeightUnitLineHeightUnit' => array(
				'type' => 'string',
				'default' => 'em',
			),
			'titleTabletLineHeightUnitLineHeightUnit' => array(
				'type' => 'string',
				'default' => 'em',
			),
			'titleMobileLineHeightUnitLineHeightUnit' => array(
				'type' => 'string',
				'default' => 'em',
			),
			'categoryHighlighted' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'categoryColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'categoryHoverColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'categoryAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'categoryTabletAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'categoryMobileAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'showTitle' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'titleFontFamily' => array(
				'type' => 'string',
				'default' => '',
			),
			'titleFontWeight' => array(
				'type' => 'string',
				'default' => '',
			),
			'titleTextTransform' => array(
				'type' => 'string',
				'default' => '',
			),
			'titleLetterSpacing' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleTabletFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleMobileFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleTabletLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleMobileLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'titleTabletFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'titleMobileFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'titleTag' => array(
				'type' => 'string',
				'defualt' => '',
			),
			'titleColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'titleHoverColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'titleAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'titleTabletAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'titleMobileAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'showExcerpt' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'excerptFontFamily' => array(
				'type' => 'string',
				'default' => '',
			),
			'excerptFontWeight' => array(
				'type' => 'string',
				'default' => '',
			),
			'excerptTextTransform' => array(
				'type' => 'string',
				'default' => '',
			),
			'excerptLetterSpacing' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptTabletFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptMobileFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptTabletLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptMobileLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'excerptTabletFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'excerptMobileFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'excerptLength' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'excerptAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'excerptTabletAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'excerptMobileAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'showMeta' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'showAuthor' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'showDate' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'showComments' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'metaFontFamily' => array(
				'type' => 'string',
				'default' => '',
			),
			'metaFontWeight' => array(
				'type' => 'string',
				'default' => '',
			),
			'metaTextTransform' => array(
				'type' => 'string',
				'default' => '',
			),
			'metaLetterSpacing' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaTabletFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaMobileFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaTabletLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaMobileLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'metaTabletFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'metaMobileFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'metaColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'metaSeparator' => array(
				'type' => 'string',
				'default' => '',
			),
			'metaAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'metaTabletAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'metaMobileAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'showReadmore' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'readmoreText' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreFontFamily' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreFontWeight' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreTextTransform' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreLetterSpacing' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreTabletFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreMobileFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreTabletLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreMobileLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'readmoreTabletFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'readmoreMobileFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'readmoreColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreHoverColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreTabletAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'readmoreMobileAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'imageBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'imageTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'imageMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'categoryMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'titleMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'excerptMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'metaMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'readmoreMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'uniqueClass' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTag' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockOpacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletBlockOpacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileBlockOpacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockZIndex' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletBlockZIndex' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileBlockZIndex' => array(
				'type' => 'number',
				'default' => '',
			),
			'marginTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'marginRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'marginBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'marginLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletMarginTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletMarginRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletMarginBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletMarginLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileMarginTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileMarginRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileMarginBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileMarginLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'marginUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'tabletMarginUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'mobileMarginUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'paddingTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'paddingRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'paddingBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'paddingLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletPaddingTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletPaddingRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletPaddingBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletPaddingLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobilePaddingTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobilePaddingRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobilePaddingBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobilePaddingLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'paddingUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'tabletPaddingUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'mobilePaddingUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletBlockHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileBlockHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockHeightUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'tabletBlockHeightUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'mobileBlockHeightUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletBlockWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileBlockWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockWidthUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'tabletBlockWidthUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'mobileBlockWidthUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'tabletBlockVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'tabletBlockHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'mobileBlockVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'mobileBlockHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnPaddingTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnPaddingRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnPaddingBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnPaddingLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletColumnPaddingTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletColumnPaddingRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletColumnPaddingBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletColumnPaddingLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileColumnPaddingTop' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileColumnPaddingRight' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileColumnPaddingBottom' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileColumnPaddingLeft' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnPaddingUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'tabletColumnPaddingUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'mobileColumnPaddingUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'columnGap' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletColumnGap' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileColumnGap' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'tabletColumnHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'mobileColumnHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'columnContentVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnContentHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'tabletColumnContentVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'tabletColumnContentHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'mobileColumnContentVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'mobileColumnContentHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'columnHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'tabletColumnVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'tabletColumnHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'mobileColumnVerticalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'mobileColumnHorizontalAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'hideDesktop' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'hideTablet' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'hideMobile' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'showBlockBackground' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'blockInnerWidth' => array(
				'type' => 'string',
				'default' => '',
			),
			'align' => array(
				'type' => 'string',
			),
			'blockBackgroundBackgroundColorType' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundColor2' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundMediaId' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundMediaUrl' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundTabletBackgroundMediaId' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundTabletBackgroundMediaUrl' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundMobileBackgroundMediaId' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundMobileBackgroundMediaUrl' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundGradientBlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundPosition' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundTabletBackgroundPosition' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundMobileBackgroundPosition' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundRepeat' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundTabletBackgroundRepeat' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundMobileBackgroundRepeat' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundSize' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundTabletBackgroundSize' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundMobileBackgroundSize' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundImageBlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockBackgroundBackgroundColorOpacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundBackgroundTintStrength' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundBackgroundGradientDirection' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundBackgroundCustomSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundTabletBackgroundCustomSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundMobileBackgroundCustomSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundBackgroundGradientLocation1' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundBackgroundGradientLocation2' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockBackgroundFixedBackground' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'blockBackgroundBackgroundCustomSizeUnit' => array(
				'type' => 'string',
				'default' => '%',
			),
			'blockBackgroundTabletBackgroundCustomSizeUnit' => array(
				'type' => 'string',
				'default' => '%',
			),
			'blockBackgroundMobileBackgroundCustomSizeUnit' => array(
				'type' => 'string',
				'default' => '%',
			),
			'showTopSeparator' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'showBottomSeparator' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'topSeparatorDesign' => array(
				'type' => 'string',
				'default' => 'wave-1',
			),
			'bottomSeparatorDesign' => array(
				'type' => 'string',
				'default' => 'wave-1',
			),
			'topSeparatorColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'bottomSeparatorColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'topSeparatorHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorTabletHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorMobileHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorTabletHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorMobileHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorWidth' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorFlipHorizontally' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'topSeparatorBringToFront' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'bottomSeparatorFlipHorizontally' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'bottomSeparatorBringToFront' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'topSeparatorShadow' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'bottomSeparatorShadow' => array(
				'type' => 'boolean',
				'default' => true,
			),
			'showTopSeparatorLayer2' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'showTopSeparatorLayer3' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'showBottomSeparatorLayer2' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'showBottomSeparatorLayer3' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'topSeparatorLayer2Color' => array(
				'type' => 'string',
				'default' => '',
			),
			'topSeparatorLayer3Color' => array(
				'type' => 'string',
				'default' => '',
			),
			'topSeparatorLayer2BlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'topSeparatorLayer3BlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'bottomSeparatorLayer2Color' => array(
				'type' => 'string',
				'default' => '',
			),
			'bottomSeparatorLayer3Color' => array(
				'type' => 'string',
				'default' => '',
			),
			'bottomSeparatorLayer2BlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'bottomSeparatorLayer3BlendMode' => array(
				'type' => 'string',
				'default' => '',
			),
			'topSeparatorLayer2Height' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorLayer3Height' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorLayer2Width' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorLayer3Width' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorLayer2Opacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorLayer3Opacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorLayer2Height' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorLayer3Height' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorLayer2Width' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorLayer3Width' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorLayer2Opacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'bottomSeparatorLayer3Opacity' => array(
				'type' => 'number',
				'default' => '',
			),
			'topSeparatorLayer2FlipHorizontally' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'topSeparatorLayer3FlipHorizontally' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'bottomSeparatorLayer2FlipHorizontally' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'bottomSeparatorLayer3FlipHorizontally' => array(
				'type' => 'boolean',
				'default' => '',
			),
			'showBlockTitle' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'blockTitle' => array(
				'source' => 'html',
				'selector' => '.ugb-block-title',
				'default' => 'Title for This Block',
			),
			'blockTitleBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleFontFamily' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTitleFontWeight' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTitleTextTransform' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTitleLetterSpacing' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleTabletFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleMobileFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleTabletLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleMobileLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockTitleFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockTitleTabletFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockTitleMobileFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockTitleAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTitleTabletAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTitleMobileAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTitleColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockTitleTag' => array(
				'type' => 'string',
				'default' => '',
			),
			'showBlockDescription' => array(
				'type' => 'boolean',
				'default' => false,
			),
			'blockDescription' => array(
				'source' => 'html',
				'selector' => '.ugb-block-description',
				'default' => 'Description for this block. Use this space for describing your block. Any text will do.',
			),
			'blockDescriptionBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionTabletBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionMobileBottomMargin' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionFontFamily' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockDescriptionFontWeight' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockDescriptionTextTransform' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockDescriptionLetterSpacing' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionTabletFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionMobileFontSize' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionTabletLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionMobileLineHeight' => array(
				'type' => 'number',
				'default' => '',
			),
			'blockDescriptionFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockDescriptionTabletFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockDescriptionMobileFontSizeUnit' => array(
				'type' => 'string',
				'default' => 'px',
			),
			'blockDescriptionAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockDescriptionTabletAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockDescriptionMobileAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'blockDescriptionColor' => array(
				'type' => 'string',
				'default' => '',
			),
			'contentAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'tabletContentAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'mobileContentAlign' => array(
				'type' => 'string',
				'default' => '',
			),
			'customCSS' => array(
				'type' => 'string',
				'default' => '',
			),
			'customCSSCompiled' => array(
				'type' => 'string',
				'default' => '',
			),
			'customCSSUniqueID' => array(
				'type' => 'string',
				'default' => '',
			),
			'className' => array(
				'type' => 'string',
			),
		);
	}
}
