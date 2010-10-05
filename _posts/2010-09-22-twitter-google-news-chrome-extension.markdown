---
layout: default
title: Twitter + Google News Chrome Extension
snippet: We'll be building an extension which mashes up Google News and Twitter trending topics.  If you want to take a look before starting to code, the extension is available in the Chrome Extensions gallery <a href="https://chrome.google.com/extensions/detail/gijhnpblnlmaklpnabpjlngpelkofhih">here</a>
categories:
- chrome extension
- html5
---
We'll be building an extension which mashes up Google News and Twitter trending topics.  If you want to take a look before starting to code, the extension is available in the Chrome Extensions gallery here: <https://chrome.google.com/extensions/detail/gijhnpblnlmaklpnabpjlngpelkofhih>

## Step 1: Requirements

To write an extension, make sure you have the following installed:
 * Google Chrome
 * A text editor

If you want to use experimental features, you should download a recent nightly build of Chromium.  You can get these for all 3 platforms here:
 <http://build.chromium.org/buildbot/snapshots/> - just unzip and run the executable inside (it won't overwrite your current Chrome install).

## Step 2: Writing your first Extension

Create a folder somewhere on your computer to contain your extension's code.
Inside your extension's folder, create a text file called **manifest.json**, and put this in it:

    {
      "name": "Twitter + Google News Extension",
      "version": "1.0.0",
      "description": "Puts Twitter data in Google News.",
      "icons": {
        "48" : "sample-48.png",
        "128" : "sample-128.png"
      }
    }

Note that there are two icons referenced in the manifest file.  You can make your own or use these:

<table class="icontable">
  <tr>
    <th>sample-128.png</th>
    <th>sample-48.png</th>
  </tr>
  <tr>
    <td>
      <img class="bordered" src="{{ site.url }}/static/img/sample-128.png" />
    </td>
    <td>
      <img class="bordered" src="{{ site.url }}/static/img/sample-48.png" />
    </td>
  </tr>
  <tr>
    <td>128 x 128 px</td>
    <td>48 x 48 px</td>
  </tr>
</table>

Put the icons in the same directory as the **manifest.json** file.

When you're done, go to <chrome://extensions> in Google Chrome and click **developer mode**.  Then click load unpacked extension and select your directory.  Your first extension is done!

## Step 3: Add a background page

Add a line to your **manifest.json** file so that it looks like this:

<pre class="delta"><code>{
  "name": "Twitter + Google News Extension",
  "version": "1.0.0",
  "description": "Puts Twitter data in Google News.",
  "icons": {
    "48" : "sample-48.png",
    "128" : "sample-128.png"
  }<em>,
  "background_page": "background.html"</em>
}
</code></pre>
    
This tells chrome to load **background.html** for your extension, so create a file called **background.html** in the same directory and paste this into it:

    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <script>
          console.log('hello world');
        </script>
      </body>
    </html>

Now if you go to <chrome://extensions> and click **reload** next to your extension, you should see a link to **background.html** which will open up Chrome's Inspector.  Click the link and make sure that "hello world" is printed in the console.

## Step 4: Add a content script

Add the following lines to your **manifest.json** so it looks like this:

<pre class="delta"><code>{
  "name": "Twitter + Google News Extension",
  "version": "1.0.0",
  "description": "Puts Twitter data in Google News.",
  "icons": {
    "48" : "sample-48.png",
    "128" : "sample-128.png"
  },
  "background_page": "background.html",
  <em>"content_scripts": [
    {
      "matches": ["http://news.google.com/*"],
      "js" : ["contentscript.js"]
    }
  ]</em>
}
</code></pre>

This will cause **contentscript.js** to be injected into all **news.google.com** web pages.  Create a file called **contentscript.js** and paste the following into it:

    alert('news.google.com');
    console.log('Hello from a content script');

Now if you reload your extension and go to **news.google.com** you should see an alert box.  **Right click** on the page and choose **inspect element**. Then check the console to make sure that "Hello from a content script" was printed there.  Note that this is a different console than the background page!

## Step 5: Send a message to the background page

Change your **contentscript.js** to the following:

    function onResponse(data) {};
    chrome.extension.sendRequest({'action' : 'fetch'}, onResponse);

Then change your **background.html** page to this:

    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <script>
          function onRequest(request, sender, callback) {
            console.log("Request from content script:", request);
          };

          chrome.extension.onRequest.addListener(onRequest);
        </script>
      </body>
    </html>

**Reload your extension** and go to **news.google.com**.  Check the console for the background page.  You should see the request from the content script in the console.  The content script can now send messages to the background page.

## Step 6: Fetch data from Twitter

Change your **background.html** page to this:

    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <script>
          function fetchTwitterFeed() {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(data) {
              if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                  var data = JSON.parse(xhr.responseText);
                  console.log(data);
                } else {
                  console.log('Failed');
                }
              }
            }
            var url = 'http://search.twitter.com/trends/current.json?exclude=hashtags';
            xhr.open('GET', url, true);
            xhr.send();
          };

          function onRequest(request, sender, callback) {
            // Only supports the 'fetchTwitterFeed' method, although this could
            // be generalized into a more robust RPC system.
            if (request.action == 'fetch') {
              fetchTwitterFeed();
            }
          };

          chrome.extension.onRequest.addListener(onRequest);
        </script>
      </body>
    </html>

This will attempt to make a request to <http://search.twitter.com/trends/current.json?exclude=hashtags> to fetch the current trending topics on Twitter.  **This request won't work unless you request permission to fetch this URL**, so change your **manifest.json** to:

    {
      "name": "Twitter + Google News Extension",
      "version": "1.0.0",
      "description": "Puts Twitter data in Google News.",
      "icons": {
        "48" : "sample-48.png",
        "128" : "sample-128.png"
      },
      "background_page": "background.html",
      "content_scripts": [
        {
          "matches": ["http://news.google.com/*"],
          "js" : ["contentscript.js"]
        }
      ],
      "permissions": [
        "http://search.twitter.com/*"
      ]
    }

Now the request will work.  Check the console to see the response from the API.

## Step 7: Passing data back to the content script:

You need to return the Twitter data to the content script, so we'll add a callback parameter to the function that fetches Twitter data.  Change your **background.html** to:

<pre class="delta"><code>&lt;!DOCTYPE html&gt;
&lt;html&gt;
  &lt;head&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;script&gt;
      function fetchTwitterFeed(<em>callback</em>) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              var data = JSON.parse(xhr.responseText);
              <em>callback(data);</em>
            } else {
              <em>callback(null);</em>
            }
          }
        }
        var url = &#x27;http://search.twitter.com/trends/current.json?exclude=hashtags&#x27;;
        xhr.open(&#x27;GET&#x27;, url, true);
        xhr.send();
      };

      function onRequest(request, sender, callback) {
        // Only supports the &#x27;fetchTwitterFeed&#x27; method, although this could be
        // generalized into a more robust RPC system.
        if (request.action == &#x27;fetch&#x27;) {
          fetchTwitterFeed(<em>callback</em>);
        }
      };

      chrome.extension.onRequest.addListener(onRequest);
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;
</code></pre>

This forwards data back to the **onResponse** function in your content script.  Change **contentscript.js** to log the data:

<pre class="delta"><code>function onResponse(data) {
  <em>console.log('onResponse', data);</em>
};
chrome.extension.sendRequest({'action' : 'fetch'}, onResponse);
</code></pre>

Reload the extension and check the content script's console on **news.google.com**.  You should see the Twitter data.

## Step 8: Injecting the data into the page

The Twitter data has been returned to the content script, so all there is left to do is put the data into the page.  Change your **contentscript.js** file to the following:

<pre class="delta"><code>function onResponse(data) {
  <em>if (data.trends) {
    var trend_names = []
    for (var date in data.trends) {
      if (data.trends.hasOwnProperty(date)) {
        var trends = data.trends[date];
        for (var i=0,trend; trend = trends[i]; i++) {
          trend_names.push(trend.name);
        }
      }
    }

    var trends_dom = document.createElement('div');
    var title_dom = document.createElement('strong');
    var text_dom = document.createTextNode(trend_names.join(', '));
    title_dom.innerText = 'Topics currently trending on Twitter ';
    trends_dom.appendChild(title_dom);
    trends_dom.appendChild(text_dom);
    trends_dom.style.background = '#36b';
    trends_dom.style.color = '#fff';
    trends_dom.style.padding = '10px';
    trends_dom.style.position = 'relative';
    trends_dom.style.zIndex = '123456';
    trends_dom.style.font = '14px Arial';
    document.body.insertBefore(trends_dom, document.body.firstChild);
  }</em>
};
chrome.extension.sendRequest({'action' : 'fetch'}, onResponse);
</code></pre>

Congratulations!  You've just build a useful Google Chrome Extension!

## Full source code:

### manifest.json

    {
      "name": "Twitter + Google News Extension",
      "version": "1.0.0",
      "description": "Puts Twitter data in Google News.",
      "icons": {
        "48" : "sample-48.png",
        "128" : "sample-128.png"
      },
      "background_page": "background.html",
      "content_scripts": [
        {
          "matches": ["http://news.google.com/*"],
          "js" : ["contentscript.js"]
        }
      ],
      "permissions": [
        "http://search.twitter.com/*"
      ]
    }
    
### background.html

    <!DOCTYPE html>
    <html>
      <head>
      </head>
      <body>
        <script>
          function fetchTwitterFeed(callback) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(data) {
              if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                  var data = JSON.parse(xhr.responseText);
                  callback(data);
                } else {
                  callback(null);
                }
              }
            }
            var url = 'http://search.twitter.com/trends/current.json?exclude=hashtags';
            xhr.open('GET', url, true);
            xhr.send();
          };

          function onRequest(request, sender, callback) {
            // Only supports the 'fetchTwitterFeed' method, although this could be
            // generalized into a more robust RPC system.
            if (request.action == 'fetch') {
              fetchTwitterFeed(callback);
            }
          };

          chrome.extension.onRequest.addListener(onRequest);
        </script>
      </body>
    </html>

### contentscript.js

    function onResponse(data) {
      if (data.trends) {
        var trend_names = []
        for (var date in data.trends) {
          if (data.trends.hasOwnProperty(date)) {
            var trends = data.trends[date];
            for (var i=0,trend; trend = trends[i]; i++) {
              trend_names.push(trend.name);
            }
          }
        }

        var trends_dom = document.createElement('div');
        var title_dom = document.createElement('strong');
        var text_dom = document.createTextNode(trend_names.join(', '));
        title_dom.innerText = 'Topics currently trending on Twitter ';
        trends_dom.appendChild(title_dom);
        trends_dom.appendChild(text_dom);
        trends_dom.style.background = '#36b';
        trends_dom.style.color = '#fff';
        trends_dom.style.padding = '10px';
        trends_dom.style.position = 'relative';
        trends_dom.style.zIndex = '123456';
        trends_dom.style.font = '14px Arial';
        document.body.insertBefore(trends_dom, document.body.firstChild);
      }
    };
    chrome.extension.sendRequest({'action' : 'fetch'}, onResponse);

