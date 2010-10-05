---
layout: default
title: Image "Grayscaler" Chrome Extension
snippet: This codelab will walk you through the steps of building a Google Chrome Extension which will let users pick an image from the web and convert it to grayscale.  You may install the completed extension from the Google Chrome Extensions gallery <a href="https://chrome.google.com/extensions/detail/poekajjboffdbpndplgcldfbjdbabclc">here</a>.
categories:
- chrome extension
- canvas
---
This codelab will walk you through the steps of building a Google Chrome Extension which will let users pick an image from the web and convert it to grayscale.  

We'll be using the following extension APIs:
 * [Windows](http://code.google.com/chrome/extensions/windows.html)
 * [Context Menus](http://code.google.com/chrome/extensions/contextMenus.html)

We'll be using some of these new HTML features:
 * [Canvas](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html)
 * [document.querySelector](http://www.w3.org/TR/selectors-api/#nodeselector)
 * [input type range](http://diveintohtml5.org/forms.html#type-range)

You may install the completed extension from the Google Chrome Extensions gallery <a href="https://chrome.google.com/extensions/detail/poekajjboffdbpndplgcldfbjdbabclc">here</a>.

## Step 1: Requirements

To write an extension, make sure you have the following installed:
 * [Google Chrome](http://chrome.google.com)
 * A text editor

You do not need to know how to write an extension before completing this codelab.

## Step 2: Project Setup

Create a folder somewhere on your computer to contain your extension's code.
Inside your extension's folder, create a text file called **manifest.json**, 
with the following contents:

    {
      "name": "Image 'Grayscaler' Extension",
      "version": "1.0.0",
      "description": "Select images with the context menu and convert to grayscale.",
      "icons": {
        "128" : "sample-128.png"
      }
    }

Note that there is an icon file referenced in the manifest file.  Feel free to make your own, but here's one that has already been made:

<table class="icontable">
  <tr>
    <th>sample-128.png</th>
  </tr>
  <tr>
    <td>
      <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/sample-128.png" />
    </td>
  </tr>
  <tr>
    <td>128 x 128 px</td>
  </tr>
</table>

Put the icon in the same directory as the **manifest.json** file.

When you're done, go to [chrome://extensions]() in Google Chrome and click **developer mode**.  Then click **load unpacked extension** and select your directory.  Your first extension is done!

## Step 3: Add a Background Page

The [background page](http://code.google.com/chrome/extensions/background_pages.html) of an extension is loaded once and runs for as long as the extension stays active.  Most of the logic of your extension will be here.

Add the following to your manifest:

<pre class="delta"><code>{
  "name": "Image 'Grayscaler' Extension",
  "version": "1.0.1",
  "description": "Select images with the context menu and convert to grayscale.",
  "icons": {
    "128" : "sample-128.png"
  },
  <em>"background_page": "background.html"</em>
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

Reload your extension on the <chrome://extensions> page and you will see an
link for **background.html** listed.  Clicking the link will open the inspector
for the background page, and you will see your output in the console.

<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/screen-01.png"/>
</div>

## Step 4: Add a Context Menu

In order to modify images on web pages, the user will need a mechanism to 
select an image.  Luckily, the [context menus](http://code.google.com/chrome/extensions/contextMenus.html) API will give us a quick way to access the URL of an image on the page. 

Start by modifying your background page to register a context menu item:

<pre class="delta"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;script&gt;
      <em>function onImageClick(data, tab) {
        console.log(data);
      };

      chrome.contextMenus.create({
        &quot;title&quot; : &quot;Modify this image&quot;,
        &quot;type&quot; : &quot;normal&quot;,
        &quot;contexts&quot; : [&quot;image&quot;],
        &quot;onclick&quot; : onImageClick
      });</em>
    &lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

The context menus API requires some permissions.  Add the following to your manifest:

<pre class="delta"><code>{
  "name": "Image 'Grayscaler' Extension",
  "version": "1.0.1",
  "description": "Select images with the context menu and convert to grayscale.",
  "icons": {
    "128" : "sample-128.png"
  },
  "background_page": "background.html"<em>,
  "permissions" : [ 
    "contextMenus",
    "http://*/*"
  ]</em>
}</code></pre>

Now if you reload the extension and right click on an image, you should see a context menu item.  

<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/screen-02.png"/>
</div>

If you click on the menu item, you should see an object containing contextual information about the image in the background page's console.

<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/screen-03.png"/>
</div>

## Step 5: Open a Popup

The user interface for this extension is a popup window.  Modify your `onImageClick` function to open a new window when the context menu is activated:

<pre class="delta"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    &lt;script&gt;
      function onImageClick(data, tab) {
        <em>var winData = {
          &#x27;url&#x27;: &#x27;popup.html#&#x27; + encodeURIComponent(data.srcUrl),
          &#x27;width&#x27;: 300,
          &#x27;height&#x27;: 300
        };
        chrome.windows.create(winData);</em>
      };

      chrome.contextMenus.create({
        &quot;title&quot; : &quot;Modify this image&quot;,
        &quot;type&quot; : &quot;normal&quot;,
        &quot;contexts&quot; : [&quot;image&quot;],
        &quot;onclick&quot; : onImageClick
      });
    &lt;/script&gt;
  &lt;/head&gt;
  &lt;body&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

Note that we are passing the src URL of the image to the popup page via the *location.hash* parameter.  This is a simple way to pass information from the background page to a new window without needing to use the messaging API.

Opening a new window requires the *tabs* permission, so add that to your manifest:

<pre class="delta"><code>{
  "name": "Image 'Grayscaler' Extension",
  "version": "1.0.1",
  "description": "Select images with the context menu and convert to grayscale.",
  "icons": {
    "128" : "sample-128.png"
  },
  "background_page": "background.html",
  "permissions" : [ 
    <em>"tabs",</em>
    "contextMenus",
    "http://*/*"
  ]
}</code></pre>

Finally, create a file named *popup.html* so that we have something to show:

<pre><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;h1&gt;Hello!&lt;/h1&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/screen-04.png"/>
</div>

## Step 6: Load the Image

The popup window will need to load the image into an `<img>` element before we can draw it into a canvas. Change your *popup.html*:

<pre class="delta"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
    <em>&lt;style&gt;
      html, body {
        padding: 0;
        margin: 0;
      }
    &lt;/style&gt;
    &lt;script&gt;
      function setWindowSize() {
        chrome.windows.getCurrent(function(win) {
          var updateData = {
            &#x27;width&#x27;: document.body.scrollWidth,
            &#x27;height&#x27;: document.body.offsetHeight + 100
          };
          chrome.windows.update(win.id, updateData);
        });
      };

      function onImageLoaded(evt) {
        document.body.appendChild(this);
        window.setTimeout(setWindowSize, 100);
      };

      function onLoad(evt) {
        var imgUrl = decodeURIComponent(window.location.hash.substring(1));
        var img = document.createElement(&#x27;image&#x27;);
        img.addEventListener(&#x27;load&#x27;, onImageLoaded, false);
        img.src = imgUrl;
      };

      window.addEventListener(&#x27;load&#x27;, onLoad, false);
    &lt;/script&gt;</em>
  &lt;/head&gt;
  &lt;body&gt;
  &lt;/body&gt;
&lt;/html&gt;</code></pre>

Now when the popup is opened, you should see the image in the popup body.

<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/screen-05.png"/>
</div>

## Step 7: Modify the Image

Once the image is loaded in an `<img>` tag, it can be drawn into a `<canvas>`.  We'll be using two canvases so we can keep the original image pixels in memory while modifying them for output.  The following changes to the code implement a function which renders the image in grayscale.
  
First, add the canvas elements:

<pre class="delta"><code>&lt;body&gt;
  <em>&lt;canvas id=&quot;buffer&quot; style=&quot;display: none&quot;&gt;&lt;/canvas&gt;
  &lt;canvas id=&quot;output&quot;&gt;&lt;/canvas&gt;</em>
&lt;/body&gt;</code></pre>

Then the `paintGrayscale` function:

<pre class="delta"><code><em>function paintGrayscale() {
  var buffer = document.querySelector('#buffer');
  var bufferContext = buffer.getContext('2d');
  
  var output = document.querySelector('#output');
  var outputContext = output.getContext('2d');
  output.width = buffer.width;
  output.height = buffer.height;
  
  var imagedata = bufferContext.getImageData(0, 0, 
                                             buffer.width, buffer.height);
      
  for (var i = 0; i &lt; imagedata.data.length; i += 4) {
    var r = imagedata.data[i];
    var g = imagedata.data[i + 1];
    var b = imagedata.data[i + 2];
    
    var gray = (0.3 * r) + (0.59 * g) + (0.11 * b);
    gray = Math.max(Math.min(gray, 255), 0);
    imagedata.data[i] = gray;
    imagedata.data[i + 1] = gray;
    imagedata.data[i + 2] = gray;
  }
  outputContext.putImageData(imagedata, 0, 0);
};</em>

function onImageLoaded(evt) {
  <em>var canvas = document.querySelector('#buffer');
  canvas.width = this.width;
  canvas.height = this.height;
  
  var context = canvas.getContext('2d');
  context.drawImage(this, 0, 0);
  
  paintGrayscale();</em>
  
  window.setTimeout(setWindowSize, 10);
};
</code></pre>

Now when you activate the popup (or reload it) the image will be grayscale.

<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/screen-06.png"/>
</div>

## Step 8: Add a Slider

We'll add some customizability to the extension, through a "posterization" slider.  For this, a new `&lt;input type="range" /&gt;` element will be useful:

<pre class="delta"><code>&lt;body&gt;
  &lt;canvas id=&quot;buffer&quot; style=&quot;display: none&quot;&gt;&lt;/canvas&gt;
  &lt;canvas id=&quot;output&quot;&gt;&lt;/canvas&gt;
  <em>Posterization: &lt;input type=&quot;range&quot; min=&quot;1&quot; max=&quot;255&quot; value=&quot;1&quot; /&gt;</em>
&lt;/body&gt;</code></pre>

We'll take the value of this slider and use it as a parameter to the `paintGrayscale` image:

<pre class="delta"><code>function paintGrayscale(<em>threshold</em>) {
  <em>if (!threshold) {
    threshold = 1;
  }</em>
  
  var buffer = document.querySelector('#buffer');
  var bufferContext = buffer.getContext('2d');
  
  var output = document.querySelector('#output');
  var outputContext = output.getContext('2d');
  output.width = buffer.width;
  output.height = buffer.height;
  
  var imagedata = bufferContext.getImageData(0, 0, 
                                             buffer.width, buffer.height);
      
  for (var i = 0; i &lt; imagedata.data.length; i += 4) {
    var r = imagedata.data[i];
    var g = imagedata.data[i + 1];
    var b = imagedata.data[i + 2];
    
    var gray = (0.3 * r) + (0.59 * g) + (0.11 * b);
    <em>gray = Math.round(gray / threshold) * threshold;</em>
    gray = Math.max(Math.min(gray, 255), 0);
    imagedata.data[i] = gray;
    imagedata.data[i + 1] = gray;
    imagedata.data[i + 2] = gray;
  }
  outputContext.putImageData(imagedata, 0, 0);
};</code></pre>

Next, listen for changes to the slider, and call `paintGrayscale` with the new value when the user manipulates the control:

<pre class="delta"><code><em>function onChange(evt) {
  paintGrayscale(parseInt(this.value));
};</em>
  
function onLoad(evt) {
  var imgUrl = decodeURIComponent(window.location.hash.substring(1));
  
  var img = document.createElement('image');
  img.addEventListener('load', onImageLoaded, false);
  img.src = imgUrl;
  
  <em>var input = document.querySelector('input[type="range"]');
  input.addEventListener('change', onChange, false);</em>
};</code></pre>

Now you're able to offer some customization to your extension!

<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/samples/grayscaler/screen-07.png"/>
</div>

## Suggested Improvements

 * Allow a user to drag a copy of the image onto their Desktop to save it.
 * Add additional controls for contrast.
 * Save control state in `localStorage`.
 * Implement a different visual effect to the original image.

## Final Source Code

Here is the source for the final version of the extension:

 *  [background.html]({{ site.url }}/static/samples/grayscaler/background.html)
 *  [sample-128.png]({{ site.url }}/static/samples/grayscaler/sample-128.png)
 *  [manifest.json]({{ site.url }}/static/samples/grayscaler/manifest.json)
 *  [popup.html]({{ site.url }}/static/samples/grayscaler/popup.html)