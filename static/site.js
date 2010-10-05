function onBitlyLink(response) {
  var link = document.createElement('a');
  link.href = response.data.url;
  link.className = 'shortlink';
  
  var hash = document.createElement('strong');
  hash.appendChild(document.createTextNode(response.data.hash));
  
  link.appendChild(document.createTextNode('http://bit.ly/'));
  link.appendChild(hash);
  
  document.body.appendChild(link);
};

function fetchBitlyLink() {
  var base = "http://api.bit.ly/v3/shorten";
  var params = {
    'longUrl': encodeURIComponent(window.location.toString()),
    'format': 'json',
    'callback': 'onBitlyLink',
    'apiKey': 'R_395cd3f5007f5daa0f821488ca175c33',
    'login': 'kurrik'
  };
  var query = [];
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      query.push([key, params[key]].join('='));
    }
  }
  var script = document.createElement('script');
  script.src = base + '?' + query.join('&');
  document.head.appendChild(script);
};

fetchBitlyLink();