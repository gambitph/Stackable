# Content Align Control

The main block alignment control.

What's special with control is that it resets other align attributes onChange.

This control handles responsive alignments.

# Usage

```js
<ContentAlignControl
	setAttributes={ setAttributes }
	blockAttributes={ props.attributes }
	attributeNamesToReset={ [ 'Number%sAlign', 'Title%sAlign', 'Description%sAlign' ] }
/>
```

`attributeNamesToReset`

An array of attribute name templates which will be reset when the alignment is changed.

Responsive names are going to be added into the attribute names.

For example:

```js
[ 'Number%sAlign', 'Title%sAlign', 'Description%sAlign' ]
```

The example will reset the following attributes:
- In desktop mode: numberAlign, titleAlign, descriptionAlign
- In tablet mode: numberTabletAlign, titleTabletAlign, descriptionTabletAlign
- In mobile mode: numberMobileAlign, titleMobileAlign, descriptionMobileAlign
