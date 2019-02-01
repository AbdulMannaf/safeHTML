# safeHTML

jQuery library to manipulate HTML string.

## Dependencies

- [jQuery](http://jquery.com/) (>= 1.8)

## Quick Start

- First, the [jQuery](http://jquery.com/) library and the [safeHTML](http://github.com/AbdulMannaf/safeHTML) library needs to be included.

```html
<script type="text/javascript" src="path/to/jquery.min.js"></script>
<script type="text/javascript" src="path/to/safeHTML.min.js"></script>
```

- The jQuery library and the safeHTML library can also be included using a CDN, for example the [jsDelivr](https://www.jsdelivr.com) CDN:

```html
// Include jQuery v3.3.1
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/jquery/jquery@3.3.1/dist/jquery.min.js"></script>

// Include safeHTML
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/AbdulMannaf/safeHTML/safeHTML.min.js"></script>
```

- Both the jQuery library and safeHTML library can also be included in one HTTP request, using the jsDelivr CDN.

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/combine/gh/jquery/jquery@3.3.1/dist/jquery.min.js,gh/AbdulMannaf/safeHTML/safeHTML.min.js"></script>
```

## Examples


### `$().removeTags()` examples.
---
<a name="removeTags"></a>

- Remove comments from HTML string.

```js
var htmlString = '<!-- First Comment --><div id="main"> <!-- Second Comment --> <a href='#go'>Visit</a></div><!-- Last Comment -->';
var outputHTML = $().removeTags(
	htmlString,
	{
		'#comment': ''
	}
);
// <div id='main'><a href='#go'>Visit</a></div>
```

- HTML Structure Without comments and innerText

```js
var htmlString = '<!-- First Comment --><div id="main"> <!-- Second Comment --> <a href='#go'>Visit</a></div><!-- Last Comment -->';
var outputHTML = $().removeTags(
	htmlString,
	{
		'#comment': '',
		'#text': ''
	}
);
// <div id='main'><a href='#go'></a></div>
```

- Remove All Attributes

```js
var htmlString = '<div id="main"><a href="#go" class="download">Download</a></div>';
var outputHTML = $().removeTags(
	htmlString, {
		'*': '*', // All attributes of all tag
	}
);
// <div><a>Download</a></div>
```

- Remove `class` and `id` attribute from `div` tag, `class` attribute from `a` tag and all attributes from other tags.

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a></div>';
var outputHTML = $().removeTags(
	htmlString, {
		'div': ['id', 'class'], // `id` and `class` from `div` tag
		'a': 'class', // `class` from `a` tag
		'*': '*' // all attributes from other tags
	}
);
// <div style='padding:5px'><b>Free Download</b><a href='#go' onclick='download();'>Download</a></div>
```

- Remove `div` and `a` tag and all attributes of `b` tag
---

**Note : It will remove the tag and its attributes but It will not remove its inner HTML.**

----
```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a></div>';
var outputHTML = $().removeTags(
	htmlString, {
		'div': '', // div tag
		'a': '', // a tag
		'b': '*' // all attributes of b tag
	}
);
// <b>Free Download</b>Download
```


### `$().keepTags()` examples.
---
<a name="keepTags"></a>

- Keep all tags and attributes

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*" // All tags and all attributes
	}
);
// <div id='main' class='firstDiv' style='padding:5px'><b style='font-family:Ubuntu' onclick='do();'>Free Download</b><a href='#go' class='download' onclick='download();'>Download</a></div>
```

- Keep all tags but remove all attributes

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "" // All tags but no attribute
	}
);
// <div><b>Free Download</b><a>Download</a></div>
```

- Keep all tags but remove all attributes except `id` and `class`

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": ['id', 'class']
	}
);
// <div id='main' class='firstDiv'><b>Free Download</b><a class='download'>Download</a></div>
```

- Keep all tags but remove all attributes except `href` attribute of `a` tag

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "", // all tags
		"a": 'href' // a tag and href attribute
	}
);
// <div><b>Free Download</b><a href='#go'>Download</a></div>
```

- Convert the tag name to uppercase letters

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		tagName: 'uppercase'
	}
);
// <DIV id='main' class='firstDiv' style='padding:5px'><B style='font-family:Ubuntu' onclick='do();'>Free Download</B><A href='#go' class='download' onclick='download();'>Download</A></DIV>
```

- Convert the tag name to lowercase letters

```js
var htmlString = '<DIV id="main" class="firstDiv" style="padding:5px"><B style="font-family:Ubuntu" onclick="do();">Free Download</B><A href="#go" class="download" onclick="download();">Download</A></DIV>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		tagName: 'lowercase'
	}
);
// <div id='main' class='firstDiv' style='padding:5px'><b style='font-family:Ubuntu' onclick='do();'>Free Download</b><a href='#go' class='download' onclick='download();'>Download</a></div>
```

- Convert the attribute name to uppercase letters

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		attributeName: 'uppercase'
	}
);
// <div ID='main' CLASS='firstDiv' STYLE='padding:5px'><b STYLE='font-family:Ubuntu' ONCLICK='do();'>Free Download</b><a HREF='#go' CLASS='download' ONCLICK='download();'>Download</a></div>
```

- Convert the attribute name to lowercase letters

```js
var htmlString = '<div ID="main" CLASS="firstDiv" STYLE="padding:5px"><b STYLE="font-family:Ubuntu" ONCLICK="do();">Free Download</b><a HREF="#go" CLASS="download" ONCLICK="download();">Download</a></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		attributeName: 'lowercase'
	}
);
// <div id='main' class='firstDiv' style='padding:5px'><b style='font-family:Ubuntu' onclick='do();'>Free Download</b><a href='#go' class='download' onclick='download();'>Download</a></div>
```

- Convert the attribute value to uppercase letters

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick="do();">Free Download</b><a href="#go" class="download" onclick="download();">Download</a></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		attributeValue: 'uppercase'
	}
);
```

- Convert the attribute value to lowercase letters

```js
var htmlString = '<div id="MAIN" class="FIRSTDIV" style="PADDING:5PX"><b style="FONT-FAMILY:UBUNTU" onclick="DO();">Free Download</b><a href="#GO" class="DOWNLOAD" onclick="DOWNLOAD();">Download</a></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		attributeValue: 'lowercase'
	}
);
// <div id='main' class='firstdiv' style='padding:5px'><b style='font-family:ubuntu' onclick='do();'>Free Download</b><a href='#go' class='download' onclick='download();'>Download</a></div>
```

- Convert the HTML inner text to uppercase letters

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick>Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		text: 'uppercase'
	}
);
// <div id='main' class='firstDiv' style='padding:5px'><b style='font-family:Ubuntu' onclick>FREE DOWNLOAD</b><a href='#go' class='download' onclick='download();'>DOWNLOAD</a></div>
```

- Convert the HTML inner text to lowercase letters

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick>FREE DOWNLOAD</b><a href="#go" class="download" onclick="download();">DOWNLOAD</a></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*"
	}, {
		text: 'uppercase'
	}
);
// <div id='main' class='firstDiv' style='padding:5px'><b style='font-family:Ubuntu' onclick>free download</b><a href='#go' class='download' onclick='download();'>download</a></div>
```

- Change HTML tag open and close symbol

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick>Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*",
	}, {
		tagOpen: '«',
		tagClose: '»',
	}
);
// «div id='main' class='firstDiv' style='padding:5px'»«b style='font-family:Ubuntu' onclick»Free Download«/b»«a href='#go' class='download' onclick='download();'»Download«/a»«/div»
```

- Change quotation symbol

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick>Free Download</b><a href="#go" class="download" onclick="download();">Download</a></div>';
var outputHTML = $().keepTags(
	htmlString, {
		"*": "*",
	}, {
		quotation: "'"
	}
);
// <div id='main' class='firstDiv' style='padding:5px'><b style='font-family:Ubuntu' onclick>Free Download</b><a href='#go' class='download' onclick='download();'>Download</a></div>
```

- Keep empty `script` and `style` tag

```js
var htmlString = '<div id="main" class="firstDiv" style="padding:5px"><b style="font-family:Ubuntu" onclick>Free Download</b><a href="#go" class="download" onclick="download();">Download</a><script></script><style></style><i></i></div>';
var outputHTML = $().keepTags(
	htmlString, {
			"*": "*",
	}, {
		emptyTags: [
			'script',
			'style'
		]
	}
);
// <div id='main' class='firstDiv' style='padding:5px'><b style='font-family:Ubuntu' onclick>Free Download</b><a href='#go' class='download' onclick='download();'>Download</a><script></script><style></style></div>
```
