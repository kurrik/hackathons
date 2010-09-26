---
layout: default
title: Font Selector Chrome Extension
snippet: This codelab will walk you through the steps of building a Google Chrome Extension which will let users change the font of elements on a web page.  You may install the completed extension from the Google Chrome Extensions gallery <a href="https://chrome.google.com/extensions/detail/bcpdmdlegeipkagbpefplehebhijpglm">here</a>.
categories:
- chrome extension
- css3
- webfonts
---
This codelab will walk you through the steps of building a Google Chrome Extension which will let users change the font of elements on a web page.

To make the choice of fonts interesting, the extension will use [CSS3 Webfonts](http://www.w3.org/TR/css3-webfonts/) provided by the [Google Font API](http://code.google.com/apis/webfonts/).

We'll be using the following extension APIs:
 * [Tabs](http://code.google.com/chrome/extensions/tabs.html)
 * [Context Menus](http://code.google.com/chrome/extensions/contextMenus.html)
 * [Content Scripts](http://code.google.com/chrome/extensions/content_scripts.html)
 * [Browser Actions](http://code.google.com/chrome/extensions/browserAction.html)

You may install the completed extension from the Google Chrome Extensions gallery [here](https://chrome.google.com/extensions/detail/bcpdmdlegeipkagbpefplehebhijpglm)

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

## Step 5: Execute a script on the current page

The extension has to modify CSS on the current web page, so we have to modify
the background page to call [chrome.tabs.executeScript](http://code.google.com/chrome/extensions/tabs.html#method-executeScript) in response to the browser action click.

Change the **onBrowserActionClicked** function in **background.html** to the following:

    function onBrowserActionClicked(tab) {
      chrome.tabs.executeScript(tab.id, {file:"selectitem.js"});
    };
    
This will execute **selectitem.js** on the current tab when the browser action is clicked.  In order to do this, the extension must request permission for **tabs** as well as for any URLs it wants to execute code on.  Since this is a  general purpose extension, specify all **http://** urls by adding the following to the manifest:

<pre class="delta"><code>{
  "name": "Font Selector",
  "version": "1.0.0",
  "description": "Replace fonts on a page using Google's Font API.",
  "background_page" : "background.html",
  "browser_action" : {
    "default_icon" : "fontselector-19-regular.png"
  },
  <em>"permissions" : [ 
    "tabs",
    "http://*/*"
  ],</em>
  "icons": {
    "128" : "fontselector-128.png"
  }
}</code></pre>

Now create a file named **selectitem.js** with the following contents:

<pre><code>var lastElem = null;
var lastElemStyle = null;

<cite>/**
 * Given and element and an array of CSS style names, returns a dictionary
 * of the element's current style for each of the requested names.
 */</cite>
function getStyleList(elem, names) {
  var styles = {};
  var computedStyle = document.defaultView.getComputedStyle(elem);
  for (var i = 0; i &lt; names.length; i++) {
    styles[names[i]] = computedStyle.getPropertyValue(names[i]);
  }
  return styles;
};

<cite>/**
 * Called every time the mouse is moved.  If the mouse has moved to a new 
 * element, restore the original styling for the previous element and 
 * add the highlighted styles for the new element.
 */</cite>
function onMouseMove(evt) {
  var elem = document.elementFromPoint(evt.clientX, evt.clientY);
  if (elem != lastElem) {
    window.setTimeout(function(){
      resetOldStyles();
      saveElementStyles(elem, ['-webkit-box-shadow', 'cursor', 'border']);
      setStyleList(elem, {
          '-webkit-box-shadow': '0 2px 6px #f66', 
          'cursor': 'pointer',
          'border': '2px solid #f00'
      });
    }, 100);
  }
};

<cite>/**
 * Return the original styles to the element that's currently highlighted.
 */</cite> 
function resetOldStyles() {
  if (lastElem) {
    setStyleList(lastElem, lastElemStyle);
    lastElem = null;
    lastElemStyle = null;
  }
};

<cite>/**
 * Given an element and a list of style names, saves the current values of 
 * each style, along with a reference to the element.
 */</cite>
function saveElementStyles(elem, styles) {
  lastElem = elem;
  lastElemStyle = getStyleList(elem, styles);
};

<cite>/**
 * Given an element and a dictionary of css/value pairs, sets the element's 
 * style to the values in the dictionary.
 */</cite>
function setStyleList(elem, styles) {
  for (var name in styles) {
    if (styles.hasOwnProperty(name)) {
      elem.style.setProperty(name, styles[name]);
    }
  }
};</code></pre>

window.addEventListener('mousemove', onMouseMove, true);
    
Now when you click the browser action icon and move the mouse over the current
page, the page element below the mouse will be highlighted:

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-05.png"/>
</div>

How does the code in **selectitem.js** work? 

 1.  First, the script listens for mouse movement by calling `window.addEventListener('mousemove', onMouseMove, true);`.  Every time the mouse moves, the `onMouseMove` function is called.
 
 1.  The `onMouseMove` function finds out what element is currently under the mouse cursor by calling the `document.elementFromPoint` function with the mouse's X and Y coordinates.  It compares this element against the element that was found the last time the function was called.
 
 1.  If a new element was found:
 
      1.  The last element's CSS styling is reset to its original values by
          calling the `resetOldStyles` function.
      
      1.  The new element's styles are saved by calling `saveElementStyles`.
      
      1.  The new element is assigned CSS styles to highlight the element.  In 
          this case, the element gets a strong red border and a red drop shadow.
      
## Step 6: Keep track of which tab is currently running **selectitem.js**

Currently, the code in **selectitem.js** keeps running until the tab is reloaded or closed.  For the extension to be usable, it needs to keep track of which tabs are currently selecting nodes, so that it can show additional context menu items as needed.

Change the script block in **background.html** to match the following:

<pre><code><cite>// Keeps track of which tabs are active.</cite>
var active = {};

<cite>/**
 * Called when the browser action is clicked.  Runs selectitem.js if 
 * needed.
 */</cite>
function onBrowserActionClicked(tab) {
  if (active[tab.id] == false) {
    setActive(tab.id, true);
    chrome.tabs.executeScript(tab.id, {file:"selectitem.js"});
  }
};

<cite>/**
 * Puts the specified tab in "active" or "inactive" mode, depending on the
 * value of the supplied boolean.
 */</cite>
 function setActive(tabid, val) {
   chrome.tabs.getSelected(null, function (currenttab) {
     active[tabid] = (typeof val == 'boolean') ? val : false;
     if (currenttab.id == tabid) {
       chrome.browserAction.setIcon({
         path: active[tabid] ? 'fontselector-19-active.png' :
                               'fontselector-19-regular.png'
       });
     }
   });
 };

chrome.browserAction.onClicked.addListener(onBrowserActionClicked);

<cite>// Handle tabs being added / removed / updated.</cite>
 
chrome.tabs.onUpdated.addListener(function (tabid) {
  setActive(tabid, false);
});
chrome.tabs.onRemoved.addListener(function (tabid) { 
  delete active[tabid]; 
});
chrome.tabs.onSelectionChanged.addListener(function (tabid) {
  setActive(tabid, active[tabid]);
});</code></pre>
    
Reload the extension and click the browser action button.  You will see the icon change color when the selection code is active.  If you switch tabs or navigate to a new URL, the browser action icon will return to its original state.

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-06.png"/>
</div>
    
How does this code work?

 1.  When the browser action is clicked, the `onBrowserClicked` function checks
     the `active` variable to see if the tab is "active".  If not, it sets the
     tab's state to active by calling `setActive` and then injects 
     **selectitem.js** into the current tab.
     
 1.  The `setActive` function sets the state of the supplied tab to either true
     or false, depending on the value of its second argument. 
     
      *  If the state is set to `true`, then the icon is set to 
      **fontselector-19-active.png**.
      
      *  If the state is set to `false`, then the icon is set to 
      **fontselector-19-regular.png**.

 1.  Listeners are added for the `chrome.tabs` `onUpdated`, `onRemoved`, and  
     `onSelectionChanged` events.
     
      *  If a tab is updated, set the current tab's active state to `false`.
         
      *  If a tab is removed, delete that tab's record.
      
      *  If a different tab is selected, check the value of that tab's state 
         from the `active` variable and set the current state to that.

## Step 7: Add context menu items

Now that we know which tabs are currently running the selection code, we will add a context menu to the code.  This context menu will only be shown when the selection code is active, and will contain a list of fonts for the user to choose from.

In order to use context menus, you must add the **contextMenus** permission to your manifest like this:

<pre class="delta"><code>{
  "name": "Font Selector",
  "version": "1.0.0",
  "description": "Replace fonts on a page using Google's Font API.",
  "background_page" : "background.html",
  "browser_action" : {
    "default_icon" : "fontselector-19-regular.png"
  },
  "permissions" : [ 
    <em>"contextMenus",</em>
    "tabs",
    "http://*/*"
  ],
  "icons": {
    "128" : "fontselector-128.png"
  }
}</code></pre>

Change your **background.html** by adding the following lines:

<pre class="delta"><code>function setActive(tabid, val) {
  chrome.tabs.getSelected(null, function (currenttab) {
    active[tabid] = (typeof val == 'boolean') ? val : false;
    if (currenttab.id == tabid) {
      chrome.browserAction.setIcon({
        path: active[tabid] ? 'fontselector-19-active.png' :
                              'fontselector-19-regular.png'
      });
      <em>setMenu(active[tabid]);</em>
    }
  });
};

<em><cite>// List of fonts the user may select from.</cite>
var fonts = [
  'Droid Sans', 
  'Cuprum', 
  'IM Fell DW Pica', 
  'Lobster', 
  'Molengo',
  'Reenie Beanie',
  'Tangerine'
];
fonts.sort();

<cite>// Keeps track of which fonts already have menu items.</cite>
var menuitems = {};

<cite>/**
 * Adds or removes the context menu entries, depending on the value of
 * the supplied boolean argument.
 */</cite>
function setMenu(active) {
  if (active) {
    for (var i = 0; i &lt; fonts.length; i++) {
      setMenuItem(fonts[i]);
    }
  } else {
    chrome.contextMenus.removeAll();
    menuitems = {};
  }
};

<cite>/**
 * Adds a single context menu item for the given font.
 */</cite>
function setMenuItem(font) {
  if (!menuitems[font]) {
    menuitems[font] = chrome.contextMenus.create({
      "title" : "Change font to " + font,
      "type" : "normal",
      "contexts" : ["all"],
      "onclick" : wrapMenuClick(font)
    });
  } 
};

<cite>/**
 * Returns a function that will handle a context menu item click.  Calls
 * setFont in selectitem.js.
 */</cite>
function wrapMenuClick(font) {
  return function(data, tab) {
    chrome.tabs.executeScript(tab.id, {
        code:"alert('Switch to font " + font + "');"
    });

    setActive(tab.id, false);
  };
};</em>

chrome.browserAction.onClicked.addListener(onBrowserActionClicked);</code></pre>

Reload the extension and navigate to a test web page.  After clicking the browser action icon, highlight an element and right click.  You will see the context menu items for each font:

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-07.png"/>
</div>

Clicking on an item will produce an alert:

<div class="centered">
  <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-08.png"/>
</div>

## Step 8: Changing the font of the selected element

Now that the extension enables selecting an element in the current page and choosing a font, we will apply the font to the element and its children.

Add the following function to **selectitem.js**:

<pre><code><cite>/**
 * Sets the font on the currently selected element.
 */</cite>
function setFont(elem, font) {
  window.removeEventListener('mousemove', onMouseMove, true);
  resetOldStyles();
  setStyleList = function() {};

  var link = document.createElement('link');
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "http://fonts.googleapis.com/css?family=" + 
              encodeURIComponent(font);
  document.head.appendChild(link);  

  var elemqueue = [elem];
  while (elemqueue.length > 0) {
    var e = elemqueue.shift();
    e.style.setProperty('font-family', font);
    for (var i=0; i &lt; e.children.length; i++) {
      elemqueue.push(e.children[i]);
    }
  }
};</code></pre>

Change the **wrapMenuClick** function in **background.html**:

<pre class="delta"><code>function wrapMenuClick(font) {
  return function(data, tab) {
    chrome.tabs.executeScript(tab.id, {
        <em>code:"setFont(lastElem, '" + font + "');"</em>
    });

    setActive(tab.id, false);
  };
};</code></pre>

How does this code work?

 1.  When a context menu item is clicked, the background page will call the 
     `setFont` function in the current tab.

     
 1.  The `setFont` method removes the mousemove event listener from the window
     and resets all of the old styles in the page.  This will disable the
     element selector we have built.

     
 1.  Then `setFont` creates a link element pointing to the [Google Font API](http://code.google.com/apis/webfonts/docs/getting_started.html)
     for the requested font.  This will load a stylesheet containing a reference
     to the font file using the CSS3 webfonts API.

     
 1.  `setFont` iterates over the selected element and all of its children, 
     setting the `font-family` CSS property to the name of the requested font.

Once you choose a font from the context menu, the selected element will now be styled with the font you picked!
     
<div class="centered">
 <img class="bordered" src="{{ site.url }}/static/img/screen-fontselector-09.png"/>
</div>

## Final Source Code

Here is the source for the final version of the extension:

 *  [background.html]({{ site.url }}/static/samples/fontselector/background.html)
 *  [fontselector-128.png]({{ site.url }}/static/samples/fontselector/fontselector-128.png)
 *  [fontselector-19-active.png]({{ site.url }}/static/samples/fontselector/fontselector-19-active.png)
 *  [fontselector-19-regular.png]({{ site.url }}/static/samples/fontselector/fontselector-19-regular.png)
 *  [manifest.json]({{ site.url }}/static/samples/fontselector/manifest.json)
 *  [selectitem.js]({{ site.url }}/static/samples/fontselector/selectitem.js)
 
You may install the completed extension from the Google Chrome Extensions gallery [here](https://chrome.google.com/extensions/detail/bcpdmdlegeipkagbpefplehebhijpglm)
