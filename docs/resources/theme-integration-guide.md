# Theme Integration Guide

Stackable should fit themes generally well, but here are a few things that you can do to ensure that Stackable blocks would fit your theme's content area.

## Theme's Content Width

Some functionality in Stackable uses your theme's content width. To ensure the width is easily detected, make sure you define it in the theme's functions.php file:

```php
global $content_width;
$content_width = 640;
```

## Block Background Widths

One of the unique features in Stackable are [Block Backgrounds](../stackable-guides/beginner-guides/column-backgrounds-and-block-backgrounds.md). When Block Backgrounds are turned on, the block will go full width and you can control the width of the content to be centered, wide and full.

The inner widths are assigned different class names and you can target them via CSS:

```css
.ugb-inner-block--center {
    --block-max-width: 600px;
}
.ugb-inner-block--wide {
    --block-max-width: 1100px;
}
.ugb-inner-block--full {
    --block-max-width: 1400px;
}
```



