# DesignControl

A control for selecting designs.

## Usage

```
export const edit = ( props ) => {
    const { design } = props.attributes

    return (
        <InspectorControls>
            <PanelBody>
                <DesignControl
                    selected={ design }
                    options={ [
                        { label: 'Basic', value: 'basic', image: 'test.jpg' },
                        { label: 'Line', value: 'line', image: 'test.jpg', isPro: true },
                        { label: 'Minimal', value: 'minimal', image: 'https://via.placeholder.com/350x150', isPro: true },
                    ] }
                    onChange={ ( design ) => { setAttributes( { design } ) } }
                    />
            </PanelBody>
        </InspectorControls>
    )
}
```