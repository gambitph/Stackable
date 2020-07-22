# Role Manager and Content Editing Mode

In WordPress, each user is assigned roles. These roles allow or restrict users to do specific things in your site. You can learn more about [WordPress roles here](https://wordpress.org/support/article/roles-and-capabilities/).

**Stackable allows you to assign different editing modes to different user roles.** This is especially helpful if you want to allow your clients to edit the content the site, but do not want them to alter the design of your blocks.

{% hint style="warning" %}
This feature is only available in Stackable Premium
{% endhint %}

## Assigning Editing Modes via The Role Manager

To assign different editing modes, just go to **Stackable &gt; Settings**. 

Under the **Role Manager** area, you can change the editing modes for each user role:

* **Full editing mode** - you have full controls over the styles of every block.
* **Content only editing mode** - the inspector is locked and you cannot modify the settings of the block, you can however still modify the block's content \(text, images, icons\).

{% hint style="info" %}
Content only editing mode applies to **ALL** blocks and not just Stackable blocks.
{% endhint %}

In Content Only Editing mode, the user will only see this when a block is selected:

![](../../.gitbook/assets/screen-shot-2020-07-20-at-8.22.17-am.jpg)

## How Content Only Editing Works

Content Only Editing works by locking out the inspector, and hiding some parts of the interface in order to prevent the user from editing the styles of blocks.

{% hint style="danger" %}
In this mode, the inspector is locked and some interface elements are hidden. This is not however a bullet-proof way of preventing someone from changing only the content.

Shortcut keys like delete, copy and pasting blocks; and advanced methods of editing blocks, like through the Block Editor's Code Editor mode are still possible.
{% endhint %}

The interface is changed in a few ways when Content Only Editing is enabled:

* The inspector options are hidden
* Adding of non-text blocks are disabled
* The block moving buttons are hidden
* The block width/wide/full toolbar is hidden
* The edit as HTML option is hidden
* Reusable blocks are hidden
* The remove button is hidden \(except for text blocks\)
* The patterns tab is hidden

Users can perform the following functions:

* Editing block text, images, icons and links
* Adding text and heading blocks
* Functions that blocks allow you to perform on the block itself \(for example adjusting size of the native image block\)

This also affects other non-Stackable blocks \(even third-party blocks!\)



