/*!
safeHTML v1.1
Author: Abdul Mannaf
Source: https://github.com/AbdulMannaf/safeHTML
*/

(function ($) {
	var TEXT_CASES = ['LOWERCASE', 'UPPERCASE'],
		LT = '&lt;',
		GT = '&gt;',
		TAG_OPEN = '<',
		TAG_CLOSE = '>',
		QUOTATION = "'",
		TAG_NAME = TEXT_CASES[0], // Text case of tag name
		ATTRIBUTE_NAME = TEXT_CASES[0], // Textcase of attribute name
		ATTRIBUTE_VALUE = '', // Text case of attribute value
		TEXT = '', // Text case of Inner Text
		ENTITIES_ENCODE = false,
		KEEP_ATTRIBUTES = true,
		MINIFY = false,

		// Default Safe Tags
		KEEP_TAGS_ATTRIBUTES = {
			"#text": [], // Text Node
			a: ['href'], // "a" tag with "href" attribute
			b: [],
			br: [],
			strong: [],
			i: [],
			em: [],
			u: [],
			ins: [],
			s: [],
			del: [],
			strike: [],
			q: [],
			small: [],
			big: [],
			sup: [],
			sub: [],
		},

		// Default Unsafe Tags
		REMOVE_TAGS_ATTRIBUTES = {
			code: [],
			pre: [],
			script: [],
			style: []
		},

		// Self closing tags
		SELF_CLOSING_TAGS = [
			'area',
			'base',
			'br',
			'col',
			'command',
			'embed',
			'hr',
			'img',
			'input',
			'keygen',
			'link',
			'meta',
			'param',
			'source',
			'track',
			'wbr'
		],

		// Allowed empty tags
		EMPTY_TAGS = [
			'#text',
			'td',
			'th',
		],

		// Rename tags before parse
		RENAME_TAGS = [
			'!doctype',
			'html',
			'head',
			'body',
			'img',
			'script',
			'iframe',
			'object',
			'applet',
			'source',
			'embed',
			'frame',
			'style',
			'track'
		],

		// Special Nodes
		SPECIAL_NODES = [
			'#comment', // Comment Node
			'#text', // Text node
		];


	$.fn.keepTags = function (htmlData, keepTags, options) {
		construct(options);
		var keepTagsAndAttrib = tagsAttributes(keepTags, KEEP_TAGS_ATTRIBUTES);
		return cleanHTML(htmlData, keepTagsAndAttrib, 'keep');
	}

	$.fn.removeTags = function (htmlData, removeTagsAttrib, options) {
		construct(options);
		var removeTagsAndAttrib = tagsAttributes(removeTagsAttrib, REMOVE_TAGS_ATTRIBUTES);
		return cleanHTML(htmlData, removeTagsAndAttrib, 'remove');
	}

	function getTagName(tagName, toOriginal) {
		var returnTagName = tagName;
		if (toOriginal) {
			if (tagName.search(/^SAFE_HTML_/i) > -1) {
				returnTagName = tagName.slice(10);
				if (returnTagName.toLowerCase() == 'doctype') {
					returnTagName = '!' + returnTagName;
				}
			}
		} else {
			returnTagName = tagName.toLowerCase();
			if ($.inArray(returnTagName, RENAME_TAGS) > -1) {
				if (returnTagName == '!doctype') {
					returnTagName = 'SAFE_HTML_DOCTYPE';
				} else {
					returnTagName = 'SAFE_HTML_' + returnTagName;
				}
			}
		}
		return changeCase(returnTagName, TAG_NAME);
	}

	function renameUnsupportedTags(data, toOriginal) {
		RENAME_TAGS.forEach(tag => {
			var tagName = getTagName(tag);

			if (toOriginal) {
				var renameFrom = tagName,
					renameTo = tag;
			} else {
				var renameFrom = tag,
					renameTo = tagName;
			}

			var openRegex = new RegExp('(<' + renameFrom + ' [^>]*>|<' + renameFrom + '>)', 'gi');
			data = data.replace(openRegex, function (match) {
				var returnData = '<';
				returnData += renameTo;
				returnData += match.slice(renameFrom.length + 1);
				return returnData;
			});

			var closeRegex = new RegExp('(</' + renameFrom + '>)', 'gi');
			data = data.replace(closeRegex, function () {
				return '</' + renameTo + '>'
			});
		});
		return data;
	}

	function construct(options) {
		var optionsType = $.type(options);
		if (optionsType === 'object') {
			for (var option in options) {
				if (options.hasOwnProperty(option)) {
					var no = option.toUpperCase();
					switch (no) {
						case 'QUOTATION':
							QUOTATION = options[option];
							break;
						case 'ENTITIESENCODE':
							ENTITIES_ENCODE = options[option];
							break;
						case 'KEEPATTRIBUTES':
							KEEP_ATTRIBUTES = options[option];
							break;
						case 'TAGNAME':
							TAG_NAME = options[option];
							break;
						case 'ATTRIBUTENAME':
							ATTRIBUTE_NAME = options[option];
							break;
						case 'ATTRIBUTEVALUE':
							ATTRIBUTE_VALUE = options[option];
							break;
						case 'TEXT':
							TEXT = options[option];
							break;
						case 'SELFCLOSINGTAGS':
						case 'EMPTYTAGS':
							var _t = options[option];
							var _tType = $.type(_t);
							var _tf = [];
							if (_tType === 'array') {
								_tf = _t;
							} else if (_tType === 'string') {
								_tf = [_t];
							}

							if (no == 'EMPTYTAGS') {
								EMPTY_TAGS = _tf;
							} else if (no == 'SELFCLOSINGTAGS') {
								SELF_CLOSING_TAGS = _tf;
							}
							break;
						case 'TAGOPEN':
							TAG_OPEN = options[option];
							break;
						case 'TAGCLOSE':
							TAG_CLOSE = options[option];
							break;
						case 'MINIFY':
							if (options[option]) {
								MINIFY = true;
							} else {
								MINIFY = false;
							}
							break;
						default:
							// Invalid option
							console.warn("Invalid option " + option + " : " + options[option]);
							break;
					}
				}
			}
		} else if (optionsType !== 'undefined') {
			console.warn("Options must object. " + optionsType + " type provided.");
		}

		// Add doctype tag to self closing tag
		SELF_CLOSING_TAGS.push('SAFE_HTML_DOCTYPE');

		// Change the text case of the self closing tags
		for (let i = 0; i < SELF_CLOSING_TAGS.length; i++) {
			SELF_CLOSING_TAGS[i] = changeCase(getTagName(SELF_CLOSING_TAGS[i]), TAG_NAME);
		}

		// Change text case of empty tags
		for (let i = 0; i < EMPTY_TAGS.length; i++) {
			EMPTY_TAGS[i] = changeCase(getTagName(EMPTY_TAGS[i]), TAG_NAME);
		}

		// Change text case of special node
		for (let i = 0; i < SPECIAL_NODES.length; i++) {
			SPECIAL_NODES[i] = changeCase(getTagName(SPECIAL_NODES[i]), TAG_NAME);
		}

	}

	/**
	 * Converts a string to lowercase letters or uppercase letters
	 * @param {string} data - Data string
	 * @param {string} changeCase - UPPERCASE or LOWERCASE
	 */
	function changeCase(data, changeCase) {
		changeCase = changeCase.toUpperCase();
		if (changeCase == TEXT_CASES[0]) {
			return data.toLowerCase();
		} else if (changeCase == TEXT_CASES[1]) {
			return data.toUpperCase();
		} else {
			return data;
		}
	}

	function tagsAttributes(tagsAttributes, defaultTagsAttrib) {
		if ($.type(tagsAttributes) !== "object") {
			// If no tags and attributes set
			var tagsAttributes = defaultTagsAttrib;
		}
		var _tagsAttrib = {};
		for (var tag in tagsAttributes) {
			if (tagsAttributes.hasOwnProperty(tag)) {
				var attributes = tagsAttributes[tag];
				var attributesType = $.type(attributes);
				tag = getTagName(tag);

				if (attributesType === 'array') {
					var _attributes = [];
					attributes.forEach(element => {
						_attributes.push(changeCase(element, ATTRIBUTE_NAME));
					});
					_tagsAttrib[tag] = _attributes;
				} else if (attributesType === 'string' && attributes != '') {
					_tagsAttrib[tag] = [changeCase(attributes, ATTRIBUTE_NAME)];
				} else {
					_tagsAttrib[tag] = [];
				}
			}
		}
		return _tagsAttrib;
	}

	function joinAttributes(attributeName, attributeValue) {
		attributeName = changeCase(attributeName, ATTRIBUTE_NAME);
		attributeValue = changeCase(attributeValue, ATTRIBUTE_VALUE);
		if (attributeValue == '') {
			return " " + attributeName;
		} else {
			return " " + attributeName + "=" + QUOTATION + attributeValue.replace(new RegExp(QUOTATION, 'gi'), function (match) {
				return '&#' + match.charCodeAt(0) + ';';
			}) + QUOTATION;
		}
	}

	function getText(nodeName, innerData) {
		var returnData = "";
		if (nodeName.toLowerCase() == '#comment') {
			returnData = '!--' + innerData + '--';
			if (ENTITIES_ENCODE) {
				returnData = LT + returnData + GT;
			} else {
				returnData = TAG_OPEN + returnData + TAG_CLOSE;
			}
		} else {
			returnData = $.trim(changeCase(innerData, TEXT));
			if (MINIFY) {
				returnData = returnData.replace(/(?:\r\n|\r|\n)/g, ' ').replace(/\s\s+/g, ' ');
			}
		}
		return returnData;
	}

	/**
	 * Clean HTML
	 * @param {string} htmlData - HTML String
	 * @param {Object} tagsAttributes - Tags and Attributes
	 * @param {string} action - "keep" or "remove"
	 */
	function cleanHTML(htmlData, tagsAttributes, action) {
		// Rename unsupported tags before parse
		htmlData = renameUnsupportedTags(htmlData);
		var PARSE_HTML = $.parseHTML(htmlData, document, true);
		var SAFE_HTML = "";
		for (var key in PARSE_HTML) {
			if (PARSE_HTML.hasOwnProperty(key)) {
				var element = PARSE_HTML[key];
				var nodeName = changeCase(element.nodeName, TAG_NAME);
				var childNodeLength = element.childNodes.length;

				if (action == "keep") {
					if (nodeName in tagsAttributes || "*" in tagsAttributes) {
						if ($.inArray(nodeName, SPECIAL_NODES) > -1) { // If text or comment node
							SAFE_HTML += getText(nodeName, element.textContent);
						} else { // Not Text or Comment Node
							var tagName = changeCase(element.tagName, TAG_NAME);
							var innerHTML = element.innerHTML;

							var finalAttributes = "";
							if (element.attributes.length > 0) {
								var attributes = element.attributes;
								for (var attrKey in attributes) {
									if (attributes.hasOwnProperty(attrKey)) {
										var attribute = attributes[attrKey];
										var attributeName = changeCase(attribute.name, ATTRIBUTE_NAME);
										if (tagName in tagsAttributes) {
											var keepAttributes = tagsAttributes[tagName];
										} else {
											var keepAttributes = tagsAttributes["*"];
										}

										if ($.inArray("*", keepAttributes) > -1 || $.inArray(attributeName, keepAttributes) > -1) {
											finalAttributes += joinAttributes(attributeName, attribute.value);
										}
									}
								}
							}

							var finalData = cleanHTML(innerHTML, tagsAttributes, action);

							if (finalAttributes != '' || finalData != '' || $.inArray('*', EMPTY_TAGS) > -1 || $.inArray(tagName, EMPTY_TAGS) > -1 || $.inArray(tagName, SELF_CLOSING_TAGS) > -1) {
								SAFE_HTML += TAG_OPEN +
									getTagName(tagName, true) +
									finalAttributes +
									TAG_CLOSE +
									finalData;

								if ($.inArray(tagName, SELF_CLOSING_TAGS) < 0) {
									SAFE_HTML += TAG_OPEN + '/' + getTagName(tagName, true) + TAG_CLOSE;
								}
							}
						}
					} else {
						if (ENTITIES_ENCODE) {
							if ($.inArray(nodeName, SPECIAL_NODES) > -1) {
								SAFE_HTML += getText(nodeName, element.textContent);
							} else {
								var tagName = changeCase(element.tagName, TAG_NAME);
								var innerHTML = element.innerHTML;
								var finalAttributes = "";
								if (KEEP_ATTRIBUTES && element.attributes.length > 0) {
									var attributes = element.attributes;
									for (var attrKey in attributes) {
										if (attributes.hasOwnProperty(attrKey)) {
											var attribute = attributes[attrKey];
											var attributeName = changeCase(attribute.name, ATTRIBUTE_NAME);
											finalAttributes += joinAttributes(attributeName, attribute.value);
										}
									}
								}
								var finalData = cleanHTML(innerHTML, tagsAttributes, action);
								SAFE_HTML += LT + getTagName(tagName, true) + finalAttributes + GT + finalData;

								if ($.inArray(tagName, SELF_CLOSING_TAGS) < 0) {
									SAFE_HTML += LT + '/' + getTagName(tagName, true) + GT;
								}
							}
						} else {
							if ($.inArray(nodeName, SPECIAL_NODES) < 0) {
								SAFE_HTML += getText(nodeName, element.textContent);
							}
						}
					}
				} else if (action == "remove") {
					if (nodeName in tagsAttributes || "*" in tagsAttributes) {

						if (nodeName in tagsAttributes) {
							var removeAttributes = tagsAttributes[nodeName];
						} else {
							var removeAttributes = tagsAttributes["*"];
						}

						if ($.inArray(nodeName, SPECIAL_NODES) > -1) {
							if (removeAttributes.length > 0 || ENTITIES_ENCODE) {
								SAFE_HTML += getText(nodeName, element.textContent);
							}
						} else {
							if (removeAttributes.length > 0) { // Remove only the attributes
								var tagName = changeCase(element.tagName, TAG_NAME);
								var innerHTML = element.innerHTML;
								var finalAttributes = "";
								if ($.inArray('*', removeAttributes) < 0) { // Remove some attributes
									var attributes = element.attributes;
									for (var attrKey in attributes) {
										if (attributes.hasOwnProperty(attrKey)) {
											var attribute = attributes[attrKey];
											var attributeName = changeCase(attribute.name, ATTRIBUTE_NAME);
											if ($.inArray(attributeName, removeAttributes) < 0) {
												finalAttributes += joinAttributes(attributeName, attribute.value);
											}
										}
									}
								}

								var finalData = cleanHTML(innerHTML, tagsAttributes, action);

								if (ENTITIES_ENCODE) {
									var to = LT;
									var tc = GT;
								} else {
									var to = TAG_OPEN;
									var tc = TAG_CLOSE;
								}
								SAFE_HTML += to + getTagName(tagName, true) + finalAttributes + tc + finalData;

								if ($.inArray(tagName, SELF_CLOSING_TAGS) < 0) {
									SAFE_HTML += to + '/' + getTagName(tagName, true) + tc;
								}
							} else { // Remove both tags and attributes
								var innerHTML = element.innerHTML;

								if (ENTITIES_ENCODE) {
									var tagName = changeCase(element.tagName, TAG_NAME);
									var finalData = cleanHTML(innerHTML, tagsAttributes, action);
									var finalAttributes = "";
									var attributes = element.attributes;
									for (var attrKey in attributes) {
										if (attributes.hasOwnProperty(attrKey)) {
											var attribute = attributes[attrKey];
											var attributeName = changeCase(attribute.name, ATTRIBUTE_NAME);
											finalAttributes += joinAttributes(attributeName, attribute.value);
										}
									}
									SAFE_HTML += LT + getTagName(tagName, true) + finalAttributes + GT + finalData;

									if ($.inArray(tagName, SELF_CLOSING_TAGS) < 0) {
										SAFE_HTML += LT + '/' + getTagName(tagName, true) + GT;
									}
								} else {
									SAFE_HTML += cleanHTML(innerHTML, tagsAttributes, action);
								}
							}
						}
					} else {

						if ($.inArray(nodeName, SPECIAL_NODES) > -1) { // If text node
							SAFE_HTML += getText(nodeName, element.textContent);
						} else { // Not Text Node
							var tagName = changeCase(element.tagName, TAG_NAME);
							var innerHTML = element.innerHTML;

							var finalAttributes = "";
							if (element.attributes.length > 0) {
								var attributes = element.attributes;
								for (var attrKey in attributes) {
									if (attributes.hasOwnProperty(attrKey)) {
										var attribute = attributes[attrKey];
										var attributeName = changeCase(attribute.name, ATTRIBUTE_NAME);
										finalAttributes += joinAttributes(attributeName, attribute.value);
									}
								}
							}

							var finalData = cleanHTML(innerHTML, tagsAttributes, action);
							if (finalAttributes != '' || finalData != '' || $.inArray('*', EMPTY_TAGS) > -1 || $.inArray(tagName, EMPTY_TAGS) > -1 || $.inArray(tagName, SELF_CLOSING_TAGS) > -1) {
								SAFE_HTML += TAG_OPEN + getTagName(tagName, true) + finalAttributes + TAG_CLOSE + finalData;

								if ($.inArray(tagName, SELF_CLOSING_TAGS) < 0) {
									SAFE_HTML += TAG_OPEN + '/' + getTagName(tagName, true) + TAG_CLOSE;
								}
							}
						}
					}
				}
			}
		}
		return SAFE_HTML;
	}
}(jQuery));