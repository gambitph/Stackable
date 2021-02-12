# Using Pods Fields in Blocks

Learn how to use (a few of) your fields from Pods inside your blocks.

[Pods](https://pods.io/) is used by many site creators for working with WordPress custom post types and custom fields.

Pods allows people to create tailored user interfaces for creating and managing custom field data.

## Pods Support

You can use **any Pods field** relatively easily -- all you want to do is call the [Pods Shortcode](https://docs.pods.io/displaying-pods/pods-shortcode/).

### Displaying as Text in Blocks

You can display your field values by typing in the [[pods]](https://docs.pods.io/displaying-pods/pods-shortcode/) shortcode as text in your blocks.

Let’s say I have a text Pods field with the name `myfield` that contains the string `Hello there from Pods`. I can display this value in any text in my block by typing in the shortcode:

![Screenshot of the block edit](../../.gitbook/assets/screen-shot-2019-08-07-at-12.26.41-pm.jpg)

If you view this in the frontend (previewing the page won’t work), you will see that the title gets replaced with your field value:

![Screenshot of the frontend view](../../.gitbook/assets/screen-shot-2019-08-07-at-12.39.24-pm.jpg)

You can do this method for titles, descriptions and button text labels.

{% hint style="info" %}
You can also save your block as a **Reusable Block** and it will work as expected across different posts.
{% endhint %}
