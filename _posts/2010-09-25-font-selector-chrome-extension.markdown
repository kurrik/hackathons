---
layout: default
title: Font Selector Chrome Extension
snippet: 
categories:
- chrome extension
- css3
- webfonts
---
<style>
  .icontable {
    margin: 0 auto;
  }
  .icontable td, .icontable th {
    text-align: center;
    padding: 5px 20px;
  }
</style>

This codelab will walk you through the steps of building a Google Chrome Extension which will let users change the font of elements on a web page.

To make the choice of fonts interesting, the extension will use [CSS3 Webfonts](http://www.w3.org/TR/css3-webfonts/) provided by the [Google Font API](http://code.google.com/apis/webfonts/).

We'll be using the following extension APIs:
 * [Tabs](http://code.google.com/chrome/extensions/tabs.html)
 * [Context Menus](http://code.google.com/chrome/extensions/contextMenus.html)
 * [Content Scripts](http://code.google.com/chrome/extensions/content_scripts.html)
 * [Browser Actions](http://code.google.com/chrome/extensions/browserAction.html)

## Step 1: Requirements

To write an extension, make sure you have the following installed:
 * [Google Chrome](http://chrome.google.com)
 * A text editor

You do not need to know how to write an extension before completing this codelab.

## Step 2: Project setup

Create a folder somewhere on your computer to contain your extension's code.
Inside your extension's folder, create a text file called **manifest.json**, 
with the following contents:

    {
      "name": "Font Selector",
      "version": "1.0.0",
      "description": "Replace fonts on a page using Google's Font API.",
      "icons": {
        "128" : "fontselector-128.png"
      }
    }

Note that there is an icon file referenced in the manifest file.  In total, the extension will use three icons.  Feel free to make your own, but here are three that have already been made:

<table class="icontable">
  <tr>
    <th>fontselector-128.png</th>
    <th>fontselector-19-regular.png</th>
    <th>fontselector-19-active.png</th>
  </tr>
  <tr>
    <td>
      <img class="bordered" src="{{ site.url }}/static/img/fontselector-128.png" />
    </td>
    <td>
      <img class="bordered" src="{{ site.url }}/static/img/fontselector-19-regular.png" />
    </td>
    <td>
      <img class="bordered" src="{{ site.url }}/static/img/fontselector-19-active.png" />
    </td>
  </tr>
  <tr>
    <td>128 x 128 px</td>
    <td>19 x 19 px</td>
    <td>19 x 19 px</td>
  </tr>
</table>

Put the icons in the same directory as the **manifest.json** file.

When you're done, go to [chrome://extensions]() in Google Chrome and click **developer mode**.  Then click **load unpacked extension** and select your directory.  Your first extension is done!

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-01.png"/>
</div>

## Step 3: Add a background page

The [background page](http://code.google.com/chrome/extensions/background_pages.html) of an extension is loaded once and runs for as long as the extension stays active.  Most of the logic of your extension will be here.

Add the following to your manifest:

<pre class="delta"><code>{
  "name": "Font Selector",
  "version": "1.0.0",
  "description": "Replace fonts on a page using Google's Font API.",
  <em>"background_page" : "background.html",</em>
  "icons": {
    "128" : "fontselector-128.png"
  }
}</code></pre>

Create a new file named **background.html** with the following code:

    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <script>
          console.log('Hello, world');
        </script>
      </body>
    </html>

Reload your extension on the [chrome://extensions]() page and you will see an
link for **background.html** listed.  Clicking the link will open the inspector
for the background page, and you will see your output in the console.

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-02.png"/>
</div>

## Step 4: Add a browser action

We need a way for the user to activate the extension, so we will add a [browser action](http://code.google.com/chrome/extensions/browserAction.html).  Clicking on the icon will enable the functionality of the extension.

Add the following to your manifest:

<pre class="delta"><code>{
  "name": "Font Selector",
  "version": "1.0.0",
  "description": "Replace fonts on a page using Google's Font API.",
  "background_page" : "background.html",
  <em>"browser_action" : {
    "default_icon" : "fontselector-19-regular.png"
  },</em>
  "icons": {
    "128" : "fontselector-128.png"
  }
}</code></pre>

Then change the script block in your background page to the following:

<pre class="delta"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;script&gt;
      <em>function onBrowserActionClicked(tab) {
        console.log('Browser action clicked');
      };
      chrome.browserAction.onClicked.addListener(onBrowserActionClicked);</em>
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

When you reload, the page action will be visible:

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-03.png"/>
</div>

Clicking the browser action icon will log to the background page's console:

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-04.png"/>
</div>