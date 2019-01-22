# DesignPanelBody

A PanelBody that's used for selection of the block's design.

## Usage

```
export const edit = ( props ) => {
    const { design } = props.attributes

    // Assume stackable.blockSrcUrl is a valid URL.

    return (
        isSelected && (
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ [
						{ label: 'Basic', value: 'basic', image: 'test.jpg' },
						{ label: 'Line', value: 'line', image: 'test.jpg', isPro: true },
						{ label: 'Minimal', value: 'minimal', image: 'https://via.placeholder.com/350x150', isPro: true },
					] }
					onChange={ ( design ) => { setAttributes( { design } ) } }
					/>
			</InspectorControls>
		)
    )
}
```