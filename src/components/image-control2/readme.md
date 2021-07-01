# ImageControl

Used to pick an image in the inspector.

*You'll need to supply and save both imageID and imageURL values.*

## Usage

```
<ImageControl
    label={ __( 'Background Image' ) }
    onRemove={ () => { setAttributes( { backgroundImageURL: '', backgroundImageID: 0 } ) } }
    onChange={ ( { url, id } ) => setAttributes( { backgroundImageURL: url, backgroundImageID: id } ) }
    imageID={ backgroundImageID }
    imageURL={ backgroundImageURL }
    />
```