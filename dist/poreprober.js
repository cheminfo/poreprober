/**
 * poreprober - Getting basic structural descriptors for porous materials
 * @version v0.1.0
 * @link https://github.com/cheminfo/poreprober#readme
 * @license MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.PoreProber = {}));
}(this, (function (exports) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, basedir, module) {
		return module = {
			path: basedir,
			exports: {},
			require: function (path, base) {
				return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
			}
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var tokens = createCommonjsModule(function (module) {
	  /* Rules taken from the technical specification for CIF 1.1 as seen at:
	  
	      https://www.iucr.org/resources/cif/spec/version1.1/cifsyntax
	  */

	  /* CIF format standard tokens in RegExp form
	  
	  These Regular Expressions are meant to embody the standard syntax of CIF
	  files as found at the URL above. However, they will not all be used in
	  practice, as some needed features (especially the look-behind assertions) are
	  relatively new and may not be supported for all users.
	  
	  */

	  var sp = ' ';
	  var ht = '\\t';
	  var eol = '\\n'; // Carriage return missing for now; need to figure out how to make it work...

	  /*
	  
	  <OrdinaryChar>:
	  
	  { '!' | '%' | '&' | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | '0' | '1' 
	  | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | ':' | '<' | '=' | '>' | '?' 
	  | '@' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' 
	  | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' 
	  | 'Z' | '\' | '^' | '`' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' 
	  | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' 
	  | 'w' | 'x' | 'y' | 'z' | '{' | '|' | '}' | '~' }
	   */

	  var ordinary_char = "a-zA-Z0-9!%&\(\)*+,\-.\\/:<=>\?@\\^`\{\¦\}~";
	  module.exports.ordinary_char = "[" + ordinary_char + "]";
	  /*
	  
	  <NonBlankChar>:
	  
	  <OrdinaryChar> | <double_quote> | '#' | '$' | <single_quote> | '_' |';' | '[' 
	  | ']' 
	   */

	  var nonblank_char = ordinary_char + "\"#$'_;\\[\\]";
	  module.exports.nonblank_char = "[" + nonblank_char + "]"; // These variations are useful for strings with quotes

	  var nonblank_char_nosingle = ordinary_char + "\"#$_;\\[\\]";
	  var nonblank_char_nodouble = ordinary_char + "#$'_;\\[\\]";
	  /*
	  
	  <TextLeadChar>:
	  
	  <OrdinaryChar> | <double_quote> | '#' | '$' | <single_quote> | '_' | <SP> | 
	  <HT> |'[' | ']' 
	   */

	  var textlead_char = ordinary_char + "\"#$'_\\[\\]" + sp + ht;
	  module.exports.textlead_char = "[" + textlead_char + "]";
	  /*
	  
	  <AnyPrintChar>:
	  
	  <OrdinaryChar> | <double_quote> | '#' | '$' | <single_quote> | '_' | <SP> |
	  <HT> | ';' | '[' | ']'  
	   */

	  var anyprint_char = nonblank_char + sp + ht;
	  module.exports.anyprint_char = "[" + anyprint_char + "]";
	  /*
	  
	  <Digit>
	  
	  { '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' }
	   */

	  var digit = '0-9';
	  module.exports.digit = "[" + digit + "]";
	  /*
	  
	  <Comments>
	  
	  { '#' {<AnyPrintChar>}* <eol>}+ 
	   */

	  var comments = "(?:#[" + anyprint_char + "]*" + eol + ")+";
	  module.exports.comments = comments;
	  /*
	  
	  <TokenizedComments>
	  
	  { <SP> | <HT> | <eol> |}+ <Comments>    
	   */

	  var tok_comments = "[" + sp + ht + eol + "]+" + comments;
	  module.exports.tok_comments = tok_comments;
	  /*
	  
	  <WhiteSpace>
	  
	  { <SP> | <HT> | <eol> | <TokenizedComments>}+   
	   */

	  var whitespace = "(?:" + tok_comments + "|" + sp + "|" + ht + "|" + eol + ")+";
	  module.exports.whitespace = whitespace;
	  /*
	  
	  <SemiColonTextField>
	  
	  ';' { {<AnyPrintChar>}* <eol>
	  {{<TextLeadChar> {<AnyPrintChar>}*}? <eol>}*
	  } ';'
	   */

	  var semicolontext = ";[" + anyprint_char + "]*" + eol + "(?:(?:[" + textlead_char + "][" + anyprint_char + "]*)?" + eol + ")*;";
	  module.exports.semicolontext = semicolontext;
	  /*
	  
	  <SingleQuotedString>
	  
	  <single_quote>{<AnyPrintChar>}* <single_quote>
	   */

	  var squotestring = "'[" + nonblank_char_nosingle + sp + ht + "]*'";
	  module.exports.squotestring = squotestring;
	  /*
	  
	  <DoubleQuotedString>
	  
	  <double_quote>{<AnyPrintChar>}* <double_quote>
	   */

	  var dquotestring = '"[' + nonblank_char_nodouble + sp + ht + ']*"';
	  module.exports.dquotestring = dquotestring;
	  /* 
	  
	  <UnquotedString>
	  
	  <eol><OrdinaryChar> {<NonBlankChar>}*   
	  or 
	  <eol><OrdinaryChar> {<NonBlankChar>}*   
	  <noteol>{<OrdinaryChar>|';'} {<NonBlankChar>}
	  
	  NOTE: this is troublesome because in theory it requires lookbehinds.
	  We will try not to use it in practice. This is an approximation
	  **/

	  var uquotestring = "[" + eol + sp + ht + "][" + ordinary_char + "][" + nonblank_char + "]*";
	  module.exports.uquotestring = uquotestring;
	  /*
	  
	  <QuotedString> 
	  
	  <SingleQuotedString> | <DoubleQuotedString>
	  */

	  var quotestring = "(?:" + squotestring + "|" + dquotestring + ")";
	  module.exports.quotestring = quotestring;
	  /*
	  
	  <CharString>
	  
	  <UnquotedString> | <SingleQuotedString> | <DoubleQuotedString>  
	   */

	  var chrstring = "(?:" + squotestring + "|" + dquotestring + "|" + uquotestring + ")";
	  module.exports.chrstring = chrstring;
	  /*
	  
	  <UnsignedInteger>
	  
	  { <Digit> }+
	   */

	  var unsigned_int = "[" + digit + "]+";
	  module.exports.unsigned_int = unsigned_int;
	  /*
	  
	  <Integer>
	  
	  { '+' | '-' }? <UnsignedInteger>
	   */

	  var integer = "[+\-]?" + unsigned_int;
	  module.exports.integer = integer;
	  /*
	  
	  <Exponent>
	  
	  { {'e' | 'E' } | {'e' | 'E' } { '+' | '- ' } } <UnsignedInteger>
	   */

	  var exponent = "[eE]" + integer;
	  module.exports.exponent = exponent;
	  /*
	  
	  <Float>
	  
	  { <Integer><Exponent> | { {'+'|'-'} ? { {<Digit>} * '.' <UnsignedInteger> } |
	  { <Digit>} + '.' } } {<Exponent>} ? } }
	   */

	  var float = "(?:(?:[+\-]?(?:[" + digit + "]*\\." + unsigned_int + "|[" + digit + "]+\\.)(?:" + exponent + ")?)|(?:" + integer + exponent + "))";
	  module.exports.float = float;
	  /*
	  
	  <Number>
	  
	  {<Integer> | <Float> }
	   */

	  var number = "(?:" + float + "|" + integer + ")";
	  module.exports.number = number;
	  /*
	  
	  <Numeric>
	  
	  { <Number> | <Number> '(' <UnsignedInteger> ')' }
	   */

	  var numeric = "(?:(" + number + ")\\((" + unsigned_int + ")\\)|(" + number + "))";
	  module.exports.numeric = numeric;
	  /*
	  
	  <Tag>
	  
	  '_'{ <NonBlankChar>}+
	   */

	  var tag = "_[" + nonblank_char + "]+";
	  module.exports.tag = tag;
	  /*
	  
	  <Value> 
	  
	  { '.' | '?' | <Numeric> | <CharString> | <TextField> }
	   */

	  var value = "(\\.|\\?|" + numeric + "|" + chrstring + "|" + semicolontext + ")";
	  module.exports.value = value;
	  /*
	  
	  <LOOP_>
	  
	  */

	  var loop_kw = "[Ll][Oo][Oo][Pp]_";
	  module.exports.loop_kw = loop_kw;
	  /*
	  
	  <LoopHeader>
	  
	  <LOOP_> {<WhiteSpace> <Tag>}+
	   */

	  var loop_header = loop_kw + "(" + whitespace + tag + ")+";
	  module.exports.loop_header = loop_header;
	  /*
	  
	  <LoopBody>
	  
	  <Value> { <WhiteSpace> <Value> }*   
	   */

	  var loop_body = value + "(" + whitespace + value + ")*";
	  module.exports.loop_body = loop_body;
	  /*
	  
	  <DataHeader>
	  
	  <DATA_> { <NonBlankChar> }+
	  */

	  var data_header = "[Dd][Aa][Tt][Aa]_[" + nonblank_char + "]+";
	  module.exports.data_header = data_header;
	  /*
	  
	  <DataItem>
	  
	  <Tag> <WhiteSpace> <Value> | <LoopHeader> <LoopBody>
	   */

	  var data_item = "(?:(" + tag + ")" + whitespace + value + "|" + loop_header + loop_body + ")";
	  module.exports.data_item = data_item; // Reserved keywords

	  module.exports.reserved = "(data|loop|global|save|stop)"; // Utility function to get ready regular expressions

	  module.exports.tokenRegex = function (tname, start, end, flags) {
	    var flags = flags || 'g';

	    if (tname == 'reserved') {
	      flags = 'gi';
	    }

	    var restr = module.exports[tname];

	    if (start) {
	      restr = '^' + restr;
	    }

	    if (end) {
	      restr = restr + '$';
	    }

	    return RegExp(restr, flags);
	  };
	});

	/** Represents a single value (string or numerical) in a CIF file.
	 *  @class
	 *  @param  {string}    type      Type of the value (int, float, string, mstring,
	 *                                N/A or ?)
	 *  @param  {*}         pvalue]   Parsed value itself (should be appropriate to
	 *                                type, unnecessary for N/A and ?)
	 *  @param  {int}       [prec]    Precision number (only for numerals)
	 */


	var CifValue = function (type, value, prec) {
	  /** @member {string} */
	  this.type = type;
	  /** @member {int} */

	  this.prec = prec;

	  switch (type) {
	    case 'int':
	    case 'float':
	      /** @member {number} */
	      this.num = value;
	      break;

	    case 'string':
	    case 'mstring':
	      /** @member {string} */
	      this.text = value;
	      break;
	  }
	};

	CifValue.prototype = {
	  get_value: function () {
	    return this.num !== undefined ? this.num : this.text; // Universal function
	  }
	};
	/**
	 *  Split a text CIF file into elementary tokens for further processing.
	 *  @param  {string} cif    CIF file in text string format
	 *  @return {Array}         Array of parsed tokens
	 */

	function tokenize(cif) {
	  /* Split into tokens (separated by non-blank characters except for the
	     quoted strings and semicolon text )
	  */
	  // Grab a bunch of regular expressions
	  var all_re = [tokens.tokenRegex('whitespace', false, false), tokens.tokenRegex('quotestring', true), tokens.tokenRegex('semicolontext', true), tokens.tokenRegex('tag', true), tokens.tokenRegex('data_header', true), tokens.tokenRegex('loop_kw', true)]; // Now create fake matches for each of them

	  var tokenized = [];
	  var cifsl = cif.slice();

	  while (cifsl.length > 0) {
	    // First, try to see if it's any of the various non-whitespace types
	    var m_type = 1;
	    var m = null;

	    for (; m_type < all_re.length; ++m_type) {
	      m = cifsl.match(all_re[m_type]);
	      if (m) break;
	    }

	    if (m) {
	      tokenized.push({
	        'val': m[0],
	        'type': ['quotestring', 'semicolontext', 'tag', 'data_headers', 'loop_kw'][m_type - 1]
	      });
	      cifsl = cifsl.slice(m[0].length);
	      continue;
	    } // Now check for whitespace


	    all_re[0].lastIndex = 0;
	    var w = all_re[0].exec(cifsl);

	    if (w) {
	      if (w.index == 0) {
	        // Trim
	        cifsl = cifsl.slice(w[0].length);
	      } else {
	        // Capture an unknown
	        // A regular value/string
	        tokenized.push({
	          'val': cifsl.slice(0, w.index),
	          'type': 'unknown'
	        });
	        cifsl = cifsl.slice(w.index + w[0].length);
	      }

	      continue;
	    } // Ran out of string to parse


	    if (cifsl.length > 0) {
	      tokenized.push({
	        'val': cifsl,
	        'type': 'unknown'
	      });
	      break;
	    }
	  }

	  return tokenized;
	}

	var tokenize_1 = tokenize;
	/**
	 *  Parse a single token as a value.
	 *  @param  {Object} tok    Token to parse (must not be a reserved keyword
	 *                          like a data_ or loop_ token)
	 *  @return {CifValue}      Parsed value
	 */

	function parseValue(tok) {
	  // If it's a string, easy one
	  if (tok.type == 'quotestring') {
	    return new CifValue('string', tok.val.slice(1, tok.val.length - 1));
	  }

	  if (tok.type == 'semicolontext') {
	    return new CifValue('mstring', tok.val.slice(1, tok.val.length - 1));
	  }

	  if (tok.type != 'unknown') {
	    // Something's wrong
	    return null;
	  } // We now know it's unknown, so...


	  var strval = tok.val; // First, check for special types

	  if (strval.trim() == '.') {
	    return new CifValue('N/A');
	  } else if (strval.trim() == '?') {
	    return new CifValue('?');
	  }

	  var type; // It can be a numeric value

	  var m = tokens.tokenRegex('numeric', true, true).exec(strval.trim());

	  if (m) {
	    // Does it have a precision?
	    var prec = null;
	    var strnum = m[3]; // Will be undefined if there's a precision

	    if (strnum === undefined) {
	      prec = parseInt(m[2]);
	      strnum = m[1];
	    } // Integer or float?


	    var num;

	    if (strnum.match(tokens.tokenRegex('float', true, true))) {
	      num = parseFloat(strnum);
	      type = 'float';
	    } else {
	      num = parseInt(strnum);
	      type = 'int';
	    }

	    return new CifValue(type, num, prec);
	  } // Or it's just an unquoted string


	  return new CifValue('string', strval);
	}

	var parseValue_1 = parseValue;
	/**
	 * Finds and splits the data blocks from a tokenized CIF file.
	 * @param  {Array}   ciftokens   Array of tokens contained in the file
	 * @return {Array}               Array of data blocks in the form 
	 *                               [name, [tokens]]
	 */

	function parseDataBlocks(ciftokens) {
	  // Identify all data blocks
	  var tagre = tokens.tokenRegex('tag');
	  var data_headers = [];

	  for (var i = 0; i < ciftokens.length; ++i) {
	    var tok = ciftokens[i];

	    if (tok.type == 'data_headers') {
	      var name = tok.val.match(tagre);

	      if (name.length != 1) {
	        throw 'Invalid data header ' + tok.val;
	      }

	      data_headers.push([i, name[0].slice(1)]);
	    }
	  } // Now gather the blocks


	  var data_blocks = [];

	  for (var i = 0; i < data_headers.length; ++i) {
	    var dh = data_headers[i];
	    var end = i < data_headers.length - 1 ? data_headers[i + 1][0] : ciftokens.length;
	    var db = [dh[1], ciftokens.slice(dh[0] + 1, end)];
	    data_blocks.push(db);
	  }

	  return data_blocks;
	}

	var parseDataBlocks_1 = parseDataBlocks;
	/**
	 * Parses a series of tokens defining a data block into data items.
	 * @param  {Array}  blocktokens  Array of tokens defining the block
	 * @return {Array}               Array of parsed tata items
	 */

	function parseDataItems(blocktokens) {
	  // Parse the data items inside a data block
	  var data_items = [];
	  /* There are two possible structures here:
	  1) alternating series of tag - value
	  2) loop with series of tags, then corresponding series of values  
	  */
	  // Acceptable value token types

	  var vtypes = ['quotestring', 'semicolontext', 'unknown'];
	  data_items = [];
	  var btokens = blocktokens.slice();

	  while (btokens.length > 0) {
	    var btok = btokens.shift(); // What type is it?

	    if (btok === undefined) {
	      break;
	    }

	    switch (btok.type) {
	      case 'tag':
	        var valtok = btokens.shift();

	        if (valtok == null || !vtypes.includes(valtok.type)) {
	          throw 'Invalid or missing value for tag ' + btok.val;
	        }

	        data_items.push({
	          'tag': btok.val,
	          'type': 'single',
	          'value': parseValue(valtok)
	        });
	        break;

	      case 'loop_kw':
	        // Start by parsing the header
	        var header = [];
	        var ltok = btokens.shift();

	        while (ltok !== undefined && ltok.type == 'tag') {
	          header.push(ltok.val);
	          ltok = btokens.shift();
	        }

	        var body = [];

	        while (ltok !== undefined && vtypes.includes(ltok.type)) {
	          body.push(parseValue(ltok));
	          ltok = btokens.shift();
	        } // Put back that last one...


	        btokens.unshift(ltok); // Check if the loop is correct

	        if (body.length % header.length != 0) {
	          throw 'Invalid loop - values must be a multiple of tags';
	        }

	        var tagn = header.length;
	        var loopn = body.length / header.length;

	        for (var i = 0; i < header.length; ++i) {
	          var di = {
	            'tag': header[i],
	            'type': 'loop',
	            'value': []
	          };

	          for (var j = 0; j < loopn; ++j) {
	            di.value.push(body[j * tagn + i]);
	          }

	          data_items.push(di);
	        }

	        break;
	    }
	  }

	  return data_items;
	}

	var parseDataItems_1 = parseDataItems;
	/**
	 * Parses a cif file returning the data blocks and items (not interpreted).
	 * @param  {string} ciftext CIF file as a string
	 * @return {Object}         Parsed CIF file as data structure
	 */

	var parseCif = function parseCif(ciftext) {
	  // First, extract the tokens
	  var tk = tokenize(ciftext); // Then the blocks

	  var db = parseDataBlocks(tk); // Now on to the items for each block

	  var cifdict = {};

	  for (var i = 0; i < db.length; ++i) {
	    var block = db[i];
	    cifdict[block[0]] = {}; // SAVE frames are not supported for now, so we only look 
	    // for data items

	    var items = parseDataItems(block[1]);

	    for (var j = 0; j < items.length; ++j) {
	      cifdict[block[0]][items[j].tag] = items[j];
	    }
	  }

	  return cifdict;
	};

	var parse = {
	  tokenize: tokenize_1,
	  parseValue: parseValue_1,
	  parseDataBlocks: parseDataBlocks_1,
	  parseDataItems: parseDataItems_1,
	  parseCif: parseCif
	};

	var numeric1_2_6 = createCommonjsModule(function (module, exports) {

	  var numeric =  exports;

	  if (typeof commonjsGlobal !== "undefined") {
	    commonjsGlobal.numeric = numeric;
	  }

	  numeric.version = "1.2.6"; // 1. Utility functions

	  numeric.bench = function bench(f, interval) {
	    var t1, t2, n, i;

	    if (typeof interval === "undefined") {
	      interval = 15;
	    }

	    n = 0.5;
	    t1 = new Date();

	    while (1) {
	      n *= 2;

	      for (i = n; i > 3; i -= 4) {
	        f();
	        f();
	        f();
	        f();
	      }

	      while (i > 0) {
	        f();
	        i--;
	      }

	      t2 = new Date();
	      if (t2 - t1 > interval) break;
	    }

	    for (i = n; i > 3; i -= 4) {
	      f();
	      f();
	      f();
	      f();
	    }

	    while (i > 0) {
	      f();
	      i--;
	    }

	    t2 = new Date();
	    return 1000 * (3 * n - 1) / (t2 - t1);
	  };

	  numeric._myIndexOf = function _myIndexOf(w) {
	    var n = this.length,
	        k;

	    for (k = 0; k < n; ++k) if (this[k] === w) return k;

	    return -1;
	  };

	  numeric.myIndexOf = Array.prototype.indexOf ? Array.prototype.indexOf : numeric._myIndexOf;
	  numeric.Function = Function;
	  numeric.precision = 4;
	  numeric.largeArray = 50;

	  numeric.prettyPrint = function prettyPrint(x) {
	    function fmtnum(x) {
	      if (x === 0) {
	        return '0';
	      }

	      if (isNaN(x)) {
	        return 'NaN';
	      }

	      if (x < 0) {
	        return '-' + fmtnum(-x);
	      }

	      if (isFinite(x)) {
	        var scale = Math.floor(Math.log(x) / Math.log(10));
	        var normalized = x / Math.pow(10, scale);
	        var basic = normalized.toPrecision(numeric.precision);

	        if (parseFloat(basic) === 10) {
	          scale++;
	          normalized = 1;
	          basic = normalized.toPrecision(numeric.precision);
	        }

	        return parseFloat(basic).toString() + 'e' + scale.toString();
	      }

	      return 'Infinity';
	    }

	    var ret = [];

	    function foo(x) {
	      var k;

	      if (typeof x === "undefined") {
	        ret.push(Array(numeric.precision + 8).join(' '));
	        return false;
	      }

	      if (typeof x === "string") {
	        ret.push('"' + x + '"');
	        return false;
	      }

	      if (typeof x === "boolean") {
	        ret.push(x.toString());
	        return false;
	      }

	      if (typeof x === "number") {
	        var a = fmtnum(x);
	        var b = x.toPrecision(numeric.precision);
	        var c = parseFloat(x.toString()).toString();
	        var d = [a, b, c, parseFloat(b).toString(), parseFloat(c).toString()];

	        for (k = 1; k < d.length; k++) {
	          if (d[k].length < a.length) a = d[k];
	        }

	        ret.push(Array(numeric.precision + 8 - a.length).join(' ') + a);
	        return false;
	      }

	      if (x === null) {
	        ret.push("null");
	        return false;
	      }

	      if (typeof x === "function") {
	        ret.push(x.toString());
	        var flag = false;

	        for (k in x) {
	          if (x.hasOwnProperty(k)) {
	            if (flag) ret.push(',\n');else ret.push('\n{');
	            flag = true;
	            ret.push(k);
	            ret.push(': \n');
	            foo(x[k]);
	          }
	        }

	        if (flag) ret.push('}\n');
	        return true;
	      }

	      if (x instanceof Array) {
	        if (x.length > numeric.largeArray) {
	          ret.push('...Large Array...');
	          return true;
	        }

	        var flag = false;
	        ret.push('[');

	        for (k = 0; k < x.length; k++) {
	          if (k > 0) {
	            ret.push(',');
	            if (flag) ret.push('\n ');
	          }

	          flag = foo(x[k]);
	        }

	        ret.push(']');
	        return true;
	      }

	      ret.push('{');
	      var flag = false;

	      for (k in x) {
	        if (x.hasOwnProperty(k)) {
	          if (flag) ret.push(',\n');
	          flag = true;
	          ret.push(k);
	          ret.push(': \n');
	          foo(x[k]);
	        }
	      }

	      ret.push('}');
	      return true;
	    }

	    foo(x);
	    return ret.join('');
	  };

	  numeric.parseDate = function parseDate(d) {
	    function foo(d) {
	      if (typeof d === 'string') {
	        return Date.parse(d.replace(/-/g, '/'));
	      }

	      if (!(d instanceof Array)) {
	        throw new Error("parseDate: parameter must be arrays of strings");
	      }

	      var ret = [],
	          k;

	      for (k = 0; k < d.length; k++) {
	        ret[k] = foo(d[k]);
	      }

	      return ret;
	    }

	    return foo(d);
	  };

	  numeric.parseFloat = function parseFloat_(d) {
	    function foo(d) {
	      if (typeof d === 'string') {
	        return parseFloat(d);
	      }

	      if (!(d instanceof Array)) {
	        throw new Error("parseFloat: parameter must be arrays of strings");
	      }

	      var ret = [],
	          k;

	      for (k = 0; k < d.length; k++) {
	        ret[k] = foo(d[k]);
	      }

	      return ret;
	    }

	    return foo(d);
	  };

	  numeric.parseCSV = function parseCSV(t) {
	    var foo = t.split('\n');
	    var j, k;
	    var ret = [];
	    var pat = /(([^'",]*)|('[^']*')|("[^"]*")),/g;
	    var patnum = /^\s*(([+-]?[0-9]+(\.[0-9]*)?(e[+-]?[0-9]+)?)|([+-]?[0-9]*(\.[0-9]+)?(e[+-]?[0-9]+)?))\s*$/;

	    var stripper = function (n) {
	      return n.substr(0, n.length - 1);
	    };

	    var count = 0;

	    for (k = 0; k < foo.length; k++) {
	      var bar = (foo[k] + ",").match(pat),
	          baz;

	      if (bar.length > 0) {
	        ret[count] = [];

	        for (j = 0; j < bar.length; j++) {
	          baz = stripper(bar[j]);

	          if (patnum.test(baz)) {
	            ret[count][j] = parseFloat(baz);
	          } else ret[count][j] = baz;
	        }

	        count++;
	      }
	    }

	    return ret;
	  };

	  numeric.toCSV = function toCSV(A) {
	    var s = numeric.dim(A);
	    var i, j, m, n, row, ret;
	    m = s[0];
	    n = s[1];
	    ret = [];

	    for (i = 0; i < m; i++) {
	      row = [];

	      for (j = 0; j < m; j++) {
	        row[j] = A[i][j].toString();
	      }

	      ret[i] = row.join(', ');
	    }

	    return ret.join('\n') + '\n';
	  };

	  numeric.getURL = function getURL(url) {
	    var client = new XMLHttpRequest();
	    client.open("GET", url, false);
	    client.send();
	    return client;
	  };

	  numeric.imageURL = function imageURL(img) {
	    function base64(A) {
	      var n = A.length,
	          i,
	          x,
	          y,
	          z,
	          p,
	          q,
	          r,
	          s;
	      var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	      var ret = "";

	      for (i = 0; i < n; i += 3) {
	        x = A[i];
	        y = A[i + 1];
	        z = A[i + 2];
	        p = x >> 2;
	        q = ((x & 3) << 4) + (y >> 4);
	        r = ((y & 15) << 2) + (z >> 6);
	        s = z & 63;

	        if (i + 1 >= n) {
	          r = s = 64;
	        } else if (i + 2 >= n) {
	          s = 64;
	        }

	        ret += key.charAt(p) + key.charAt(q) + key.charAt(r) + key.charAt(s);
	      }

	      return ret;
	    }

	    function crc32Array(a, from, to) {
	      if (typeof from === "undefined") {
	        from = 0;
	      }

	      if (typeof to === "undefined") {
	        to = a.length;
	      }

	      var table = [0x00000000, 0x77073096, 0xEE0E612C, 0x990951BA, 0x076DC419, 0x706AF48F, 0xE963A535, 0x9E6495A3, 0x0EDB8832, 0x79DCB8A4, 0xE0D5E91E, 0x97D2D988, 0x09B64C2B, 0x7EB17CBD, 0xE7B82D07, 0x90BF1D91, 0x1DB71064, 0x6AB020F2, 0xF3B97148, 0x84BE41DE, 0x1ADAD47D, 0x6DDDE4EB, 0xF4D4B551, 0x83D385C7, 0x136C9856, 0x646BA8C0, 0xFD62F97A, 0x8A65C9EC, 0x14015C4F, 0x63066CD9, 0xFA0F3D63, 0x8D080DF5, 0x3B6E20C8, 0x4C69105E, 0xD56041E4, 0xA2677172, 0x3C03E4D1, 0x4B04D447, 0xD20D85FD, 0xA50AB56B, 0x35B5A8FA, 0x42B2986C, 0xDBBBC9D6, 0xACBCF940, 0x32D86CE3, 0x45DF5C75, 0xDCD60DCF, 0xABD13D59, 0x26D930AC, 0x51DE003A, 0xC8D75180, 0xBFD06116, 0x21B4F4B5, 0x56B3C423, 0xCFBA9599, 0xB8BDA50F, 0x2802B89E, 0x5F058808, 0xC60CD9B2, 0xB10BE924, 0x2F6F7C87, 0x58684C11, 0xC1611DAB, 0xB6662D3D, 0x76DC4190, 0x01DB7106, 0x98D220BC, 0xEFD5102A, 0x71B18589, 0x06B6B51F, 0x9FBFE4A5, 0xE8B8D433, 0x7807C9A2, 0x0F00F934, 0x9609A88E, 0xE10E9818, 0x7F6A0DBB, 0x086D3D2D, 0x91646C97, 0xE6635C01, 0x6B6B51F4, 0x1C6C6162, 0x856530D8, 0xF262004E, 0x6C0695ED, 0x1B01A57B, 0x8208F4C1, 0xF50FC457, 0x65B0D9C6, 0x12B7E950, 0x8BBEB8EA, 0xFCB9887C, 0x62DD1DDF, 0x15DA2D49, 0x8CD37CF3, 0xFBD44C65, 0x4DB26158, 0x3AB551CE, 0xA3BC0074, 0xD4BB30E2, 0x4ADFA541, 0x3DD895D7, 0xA4D1C46D, 0xD3D6F4FB, 0x4369E96A, 0x346ED9FC, 0xAD678846, 0xDA60B8D0, 0x44042D73, 0x33031DE5, 0xAA0A4C5F, 0xDD0D7CC9, 0x5005713C, 0x270241AA, 0xBE0B1010, 0xC90C2086, 0x5768B525, 0x206F85B3, 0xB966D409, 0xCE61E49F, 0x5EDEF90E, 0x29D9C998, 0xB0D09822, 0xC7D7A8B4, 0x59B33D17, 0x2EB40D81, 0xB7BD5C3B, 0xC0BA6CAD, 0xEDB88320, 0x9ABFB3B6, 0x03B6E20C, 0x74B1D29A, 0xEAD54739, 0x9DD277AF, 0x04DB2615, 0x73DC1683, 0xE3630B12, 0x94643B84, 0x0D6D6A3E, 0x7A6A5AA8, 0xE40ECF0B, 0x9309FF9D, 0x0A00AE27, 0x7D079EB1, 0xF00F9344, 0x8708A3D2, 0x1E01F268, 0x6906C2FE, 0xF762575D, 0x806567CB, 0x196C3671, 0x6E6B06E7, 0xFED41B76, 0x89D32BE0, 0x10DA7A5A, 0x67DD4ACC, 0xF9B9DF6F, 0x8EBEEFF9, 0x17B7BE43, 0x60B08ED5, 0xD6D6A3E8, 0xA1D1937E, 0x38D8C2C4, 0x4FDFF252, 0xD1BB67F1, 0xA6BC5767, 0x3FB506DD, 0x48B2364B, 0xD80D2BDA, 0xAF0A1B4C, 0x36034AF6, 0x41047A60, 0xDF60EFC3, 0xA867DF55, 0x316E8EEF, 0x4669BE79, 0xCB61B38C, 0xBC66831A, 0x256FD2A0, 0x5268E236, 0xCC0C7795, 0xBB0B4703, 0x220216B9, 0x5505262F, 0xC5BA3BBE, 0xB2BD0B28, 0x2BB45A92, 0x5CB36A04, 0xC2D7FFA7, 0xB5D0CF31, 0x2CD99E8B, 0x5BDEAE1D, 0x9B64C2B0, 0xEC63F226, 0x756AA39C, 0x026D930A, 0x9C0906A9, 0xEB0E363F, 0x72076785, 0x05005713, 0x95BF4A82, 0xE2B87A14, 0x7BB12BAE, 0x0CB61B38, 0x92D28E9B, 0xE5D5BE0D, 0x7CDCEFB7, 0x0BDBDF21, 0x86D3D2D4, 0xF1D4E242, 0x68DDB3F8, 0x1FDA836E, 0x81BE16CD, 0xF6B9265B, 0x6FB077E1, 0x18B74777, 0x88085AE6, 0xFF0F6A70, 0x66063BCA, 0x11010B5C, 0x8F659EFF, 0xF862AE69, 0x616BFFD3, 0x166CCF45, 0xA00AE278, 0xD70DD2EE, 0x4E048354, 0x3903B3C2, 0xA7672661, 0xD06016F7, 0x4969474D, 0x3E6E77DB, 0xAED16A4A, 0xD9D65ADC, 0x40DF0B66, 0x37D83BF0, 0xA9BCAE53, 0xDEBB9EC5, 0x47B2CF7F, 0x30B5FFE9, 0xBDBDF21C, 0xCABAC28A, 0x53B39330, 0x24B4A3A6, 0xBAD03605, 0xCDD70693, 0x54DE5729, 0x23D967BF, 0xB3667A2E, 0xC4614AB8, 0x5D681B02, 0x2A6F2B94, 0xB40BBE37, 0xC30C8EA1, 0x5A05DF1B, 0x2D02EF8D];
	      var crc = -1,
	          y = 0,
	          n = a.length,
	          i;

	      for (i = from; i < to; i++) {
	        y = (crc ^ a[i]) & 0xFF;
	        crc = crc >>> 8 ^ table[y];
	      }

	      return crc ^ -1;
	    }

	    var h = img[0].length,
	        w = img[0][0].length,
	        s1,
	        s2,
	        k,
	        length,
	        a,
	        b,
	        i,
	        j,
	        adler32,
	        crc32;
	    var stream = [137, 80, 78, 71, 13, 10, 26, 10, //  0: PNG signature
	    0, 0, 0, 13, //  8: IHDR Chunk length
	    73, 72, 68, 82, // 12: "IHDR" 
	    w >> 24 & 255, w >> 16 & 255, w >> 8 & 255, w & 255, // 16: Width
	    h >> 24 & 255, h >> 16 & 255, h >> 8 & 255, h & 255, // 20: Height
	    8, // 24: bit depth
	    2, // 25: RGB
	    0, // 26: deflate
	    0, // 27: no filter
	    0, // 28: no interlace
	    -1, -2, -3, -4, // 29: CRC
	    -5, -6, -7, -8, // 33: IDAT Chunk length
	    73, 68, 65, 84, // 37: "IDAT"
	    // RFC 1950 header starts here
	    8, // 41: RFC1950 CMF
	    29 // 42: RFC1950 FLG
	    ];
	    crc32 = crc32Array(stream, 12, 29);
	    stream[29] = crc32 >> 24 & 255;
	    stream[30] = crc32 >> 16 & 255;
	    stream[31] = crc32 >> 8 & 255;
	    stream[32] = crc32 & 255;
	    s1 = 1;
	    s2 = 0;

	    for (i = 0; i < h; i++) {
	      if (i < h - 1) {
	        stream.push(0);
	      } else {
	        stream.push(1);
	      }

	      a = 3 * w + 1 + (i === 0) & 255;
	      b = 3 * w + 1 + (i === 0) >> 8 & 255;
	      stream.push(a);
	      stream.push(b);
	      stream.push(~a & 255);
	      stream.push(~b & 255);
	      if (i === 0) stream.push(0);

	      for (j = 0; j < w; j++) {
	        for (k = 0; k < 3; k++) {
	          a = img[k][i][j];
	          if (a > 255) a = 255;else if (a < 0) a = 0;else a = Math.round(a);
	          s1 = (s1 + a) % 65521;
	          s2 = (s2 + s1) % 65521;
	          stream.push(a);
	        }
	      }

	      stream.push(0);
	    }

	    adler32 = (s2 << 16) + s1;
	    stream.push(adler32 >> 24 & 255);
	    stream.push(adler32 >> 16 & 255);
	    stream.push(adler32 >> 8 & 255);
	    stream.push(adler32 & 255);
	    length = stream.length - 41;
	    stream[33] = length >> 24 & 255;
	    stream[34] = length >> 16 & 255;
	    stream[35] = length >> 8 & 255;
	    stream[36] = length & 255;
	    crc32 = crc32Array(stream, 37);
	    stream.push(crc32 >> 24 & 255);
	    stream.push(crc32 >> 16 & 255);
	    stream.push(crc32 >> 8 & 255);
	    stream.push(crc32 & 255);
	    stream.push(0);
	    stream.push(0);
	    stream.push(0);
	    stream.push(0); //    a = stream.length;

	    stream.push(73); // I

	    stream.push(69); // E

	    stream.push(78); // N

	    stream.push(68); // D

	    stream.push(174); // CRC1

	    stream.push(66); // CRC2

	    stream.push(96); // CRC3

	    stream.push(130); // CRC4

	    return 'data:image/png;base64,' + base64(stream);
	  }; // 2. Linear algebra with Arrays.


	  numeric._dim = function _dim(x) {
	    var ret = [];

	    while (typeof x === "object") {
	      ret.push(x.length);
	      x = x[0];
	    }

	    return ret;
	  };

	  numeric.dim = function dim(x) {
	    var y, z;

	    if (typeof x === "object") {
	      y = x[0];

	      if (typeof y === "object") {
	        z = y[0];

	        if (typeof z === "object") {
	          return numeric._dim(x);
	        }

	        return [x.length, y.length];
	      }

	      return [x.length];
	    }

	    return [];
	  };

	  numeric.mapreduce = function mapreduce(body, init) {
	    return Function('x', 'accum', '_s', '_k', 'if(typeof accum === "undefined") accum = ' + init + ';\n' + 'if(typeof x === "number") { var xi = x; ' + body + '; return accum; }\n' + 'if(typeof _s === "undefined") _s = numeric.dim(x);\n' + 'if(typeof _k === "undefined") _k = 0;\n' + 'var _n = _s[_k];\n' + 'var i,xi;\n' + 'if(_k < _s.length-1) {\n' + '    for(i=_n-1;i>=0;i--) {\n' + '        accum = arguments.callee(x[i],accum,_s,_k+1);\n' + '    }' + '    return accum;\n' + '}\n' + 'for(i=_n-1;i>=1;i-=2) { \n' + '    xi = x[i];\n' + '    ' + body + ';\n' + '    xi = x[i-1];\n' + '    ' + body + ';\n' + '}\n' + 'if(i === 0) {\n' + '    xi = x[i];\n' + '    ' + body + '\n' + '}\n' + 'return accum;');
	  };

	  numeric.mapreduce2 = function mapreduce2(body, setup) {
	    return Function('x', 'var n = x.length;\n' + 'var i,xi;\n' + setup + ';\n' + 'for(i=n-1;i!==-1;--i) { \n' + '    xi = x[i];\n' + '    ' + body + ';\n' + '}\n' + 'return accum;');
	  };

	  numeric.same = function same(x, y) {
	    var i, n;

	    if (!(x instanceof Array) || !(y instanceof Array)) {
	      return false;
	    }

	    n = x.length;

	    if (n !== y.length) {
	      return false;
	    }

	    for (i = 0; i < n; i++) {
	      if (x[i] === y[i]) {
	        continue;
	      }

	      if (typeof x[i] === "object") {
	        if (!same(x[i], y[i])) return false;
	      } else {
	        return false;
	      }
	    }

	    return true;
	  };

	  numeric.rep = function rep(s, v, k) {
	    if (typeof k === "undefined") {
	      k = 0;
	    }

	    var n = s[k],
	        ret = Array(n),
	        i;

	    if (k === s.length - 1) {
	      for (i = n - 2; i >= 0; i -= 2) {
	        ret[i + 1] = v;
	        ret[i] = v;
	      }

	      if (i === -1) {
	        ret[0] = v;
	      }

	      return ret;
	    }

	    for (i = n - 1; i >= 0; i--) {
	      ret[i] = numeric.rep(s, v, k + 1);
	    }

	    return ret;
	  };

	  numeric.dotMMsmall = function dotMMsmall(x, y) {
	    var i, j, k, p, q, r, ret, foo, bar, woo, i0;
	    p = x.length;
	    q = y.length;
	    r = y[0].length;
	    ret = Array(p);

	    for (i = p - 1; i >= 0; i--) {
	      foo = Array(r);
	      bar = x[i];

	      for (k = r - 1; k >= 0; k--) {
	        woo = bar[q - 1] * y[q - 1][k];

	        for (j = q - 2; j >= 1; j -= 2) {
	          i0 = j - 1;
	          woo += bar[j] * y[j][k] + bar[i0] * y[i0][k];
	        }

	        if (j === 0) {
	          woo += bar[0] * y[0][k];
	        }

	        foo[k] = woo;
	      }

	      ret[i] = foo;
	    }

	    return ret;
	  };

	  numeric._getCol = function _getCol(A, j, x) {
	    var n = A.length,
	        i;

	    for (i = n - 1; i > 0; --i) {
	      x[i] = A[i][j];
	      --i;
	      x[i] = A[i][j];
	    }

	    if (i === 0) x[0] = A[0][j];
	  };

	  numeric.dotMMbig = function dotMMbig(x, y) {
	    var gc = numeric._getCol,
	        p = y.length,
	        v = Array(p);
	    var m = x.length,
	        n = y[0].length,
	        A = new Array(m),
	        xj;
	    var VV = numeric.dotVV;
	    var i, j;
	    --p;
	    --m;

	    for (i = m; i !== -1; --i) A[i] = Array(n);

	    --n;

	    for (i = n; i !== -1; --i) {
	      gc(y, i, v);

	      for (j = m; j !== -1; --j) {
	        xj = x[j];
	        A[j][i] = VV(xj, v);
	      }
	    }

	    return A;
	  };

	  numeric.dotMV = function dotMV(x, y) {
	    var p = x.length,
	        q = y.length,
	        i;
	    var ret = Array(p),
	        dotVV = numeric.dotVV;

	    for (i = p - 1; i >= 0; i--) {
	      ret[i] = dotVV(x[i], y);
	    }

	    return ret;
	  };

	  numeric.dotVM = function dotVM(x, y) {
	    var j, k, p, q, ret, woo, i0;
	    p = x.length;
	    q = y[0].length;
	    ret = Array(q);

	    for (k = q - 1; k >= 0; k--) {
	      woo = x[p - 1] * y[p - 1][k];

	      for (j = p - 2; j >= 1; j -= 2) {
	        i0 = j - 1;
	        woo += x[j] * y[j][k] + x[i0] * y[i0][k];
	      }

	      if (j === 0) {
	        woo += x[0] * y[0][k];
	      }

	      ret[k] = woo;
	    }

	    return ret;
	  };

	  numeric.dotVV = function dotVV(x, y) {
	    var i,
	        n = x.length,
	        i1,
	        ret = x[n - 1] * y[n - 1];

	    for (i = n - 2; i >= 1; i -= 2) {
	      i1 = i - 1;
	      ret += x[i] * y[i] + x[i1] * y[i1];
	    }

	    if (i === 0) {
	      ret += x[0] * y[0];
	    }

	    return ret;
	  };

	  numeric.dot = function dot(x, y) {
	    var d = numeric.dim;

	    switch (d(x).length * 1000 + d(y).length) {
	      case 2002:
	        if (y.length < 10) return numeric.dotMMsmall(x, y);else return numeric.dotMMbig(x, y);

	      case 2001:
	        return numeric.dotMV(x, y);

	      case 1002:
	        return numeric.dotVM(x, y);

	      case 1001:
	        return numeric.dotVV(x, y);

	      case 1000:
	        return numeric.mulVS(x, y);

	      case 1:
	        return numeric.mulSV(x, y);

	      case 0:
	        return x * y;

	      default:
	        throw new Error('numeric.dot only works on vectors and matrices');
	    }
	  };

	  numeric.diag = function diag(d) {
	    var i,
	        i1,
	        j,
	        n = d.length,
	        A = Array(n),
	        Ai;

	    for (i = n - 1; i >= 0; i--) {
	      Ai = Array(n);
	      i1 = i + 2;

	      for (j = n - 1; j >= i1; j -= 2) {
	        Ai[j] = 0;
	        Ai[j - 1] = 0;
	      }

	      if (j > i) {
	        Ai[j] = 0;
	      }

	      Ai[i] = d[i];

	      for (j = i - 1; j >= 1; j -= 2) {
	        Ai[j] = 0;
	        Ai[j - 1] = 0;
	      }

	      if (j === 0) {
	        Ai[0] = 0;
	      }

	      A[i] = Ai;
	    }

	    return A;
	  };

	  numeric.getDiag = function (A) {
	    var n = Math.min(A.length, A[0].length),
	        i,
	        ret = Array(n);

	    for (i = n - 1; i >= 1; --i) {
	      ret[i] = A[i][i];
	      --i;
	      ret[i] = A[i][i];
	    }

	    if (i === 0) {
	      ret[0] = A[0][0];
	    }

	    return ret;
	  };

	  numeric.identity = function identity(n) {
	    return numeric.diag(numeric.rep([n], 1));
	  };

	  numeric.pointwise = function pointwise(params, body, setup) {
	    if (typeof setup === "undefined") {
	      setup = "";
	    }

	    var fun = [];
	    var k;
	    var avec = /\[i\]$/,
	        p,
	        thevec = '';
	    var haveret = false;

	    for (k = 0; k < params.length; k++) {
	      if (avec.test(params[k])) {
	        p = params[k].substring(0, params[k].length - 3);
	        thevec = p;
	      } else {
	        p = params[k];
	      }

	      if (p === 'ret') haveret = true;
	      fun.push(p);
	    }

	    fun[params.length] = '_s';
	    fun[params.length + 1] = '_k';
	    fun[params.length + 2] = 'if(typeof _s === "undefined") _s = numeric.dim(' + thevec + ');\n' + 'if(typeof _k === "undefined") _k = 0;\n' + 'var _n = _s[_k];\n' + 'var i' + (haveret ? '' : ', ret = Array(_n)') + ';\n' + 'if(_k < _s.length-1) {\n' + '    for(i=_n-1;i>=0;i--) ret[i] = arguments.callee(' + params.join(',') + ',_s,_k+1);\n' + '    return ret;\n' + '}\n' + setup + '\n' + 'for(i=_n-1;i!==-1;--i) {\n' + '    ' + body + '\n' + '}\n' + 'return ret;';
	    return Function.apply(null, fun);
	  };

	  numeric.pointwise2 = function pointwise2(params, body, setup) {
	    if (typeof setup === "undefined") {
	      setup = "";
	    }

	    var fun = [];
	    var k;
	    var avec = /\[i\]$/,
	        p,
	        thevec = '';
	    var haveret = false;

	    for (k = 0; k < params.length; k++) {
	      if (avec.test(params[k])) {
	        p = params[k].substring(0, params[k].length - 3);
	        thevec = p;
	      } else {
	        p = params[k];
	      }

	      if (p === 'ret') haveret = true;
	      fun.push(p);
	    }

	    fun[params.length] = 'var _n = ' + thevec + '.length;\n' + 'var i' + (haveret ? '' : ', ret = Array(_n)') + ';\n' + setup + '\n' + 'for(i=_n-1;i!==-1;--i) {\n' + body + '\n' + '}\n' + 'return ret;';
	    return Function.apply(null, fun);
	  };

	  numeric._biforeach = function _biforeach(x, y, s, k, f) {
	    if (k === s.length - 1) {
	      f(x, y);
	      return;
	    }

	    var i,
	        n = s[k];

	    for (i = n - 1; i >= 0; i--) {
	      _biforeach(typeof x === "object" ? x[i] : x, typeof y === "object" ? y[i] : y, s, k + 1, f);
	    }
	  };

	  numeric._biforeach2 = function _biforeach2(x, y, s, k, f) {
	    if (k === s.length - 1) {
	      return f(x, y);
	    }

	    var i,
	        n = s[k],
	        ret = Array(n);

	    for (i = n - 1; i >= 0; --i) {
	      ret[i] = _biforeach2(typeof x === "object" ? x[i] : x, typeof y === "object" ? y[i] : y, s, k + 1, f);
	    }

	    return ret;
	  };

	  numeric._foreach = function _foreach(x, s, k, f) {
	    if (k === s.length - 1) {
	      f(x);
	      return;
	    }

	    var i,
	        n = s[k];

	    for (i = n - 1; i >= 0; i--) {
	      _foreach(x[i], s, k + 1, f);
	    }
	  };

	  numeric._foreach2 = function _foreach2(x, s, k, f) {
	    if (k === s.length - 1) {
	      return f(x);
	    }

	    var i,
	        n = s[k],
	        ret = Array(n);

	    for (i = n - 1; i >= 0; i--) {
	      ret[i] = _foreach2(x[i], s, k + 1, f);
	    }

	    return ret;
	  };
	  /*numeric.anyV = numeric.mapreduce('if(xi) return true;','false');
	  numeric.allV = numeric.mapreduce('if(!xi) return false;','true');
	  numeric.any = function(x) { if(typeof x.length === "undefined") return x; return numeric.anyV(x); }
	  numeric.all = function(x) { if(typeof x.length === "undefined") return x; return numeric.allV(x); }*/


	  numeric.ops2 = {
	    add: '+',
	    sub: '-',
	    mul: '*',
	    div: '/',
	    mod: '%',
	    and: '&&',
	    or: '||',
	    eq: '===',
	    neq: '!==',
	    lt: '<',
	    gt: '>',
	    leq: '<=',
	    geq: '>=',
	    band: '&',
	    bor: '|',
	    bxor: '^',
	    lshift: '<<',
	    rshift: '>>',
	    rrshift: '>>>'
	  };
	  numeric.opseq = {
	    addeq: '+=',
	    subeq: '-=',
	    muleq: '*=',
	    diveq: '/=',
	    modeq: '%=',
	    lshifteq: '<<=',
	    rshifteq: '>>=',
	    rrshifteq: '>>>=',
	    bandeq: '&=',
	    boreq: '|=',
	    bxoreq: '^='
	  };
	  numeric.mathfuns = ['abs', 'acos', 'asin', 'atan', 'ceil', 'cos', 'exp', 'floor', 'log', 'round', 'sin', 'sqrt', 'tan', 'isNaN', 'isFinite'];
	  numeric.mathfuns2 = ['atan2', 'pow', 'max', 'min'];
	  numeric.ops1 = {
	    neg: '-',
	    not: '!',
	    bnot: '~',
	    clone: ''
	  };
	  numeric.mapreducers = {
	    any: ['if(xi) return true;', 'var accum = false;'],
	    all: ['if(!xi) return false;', 'var accum = true;'],
	    sum: ['accum += xi;', 'var accum = 0;'],
	    prod: ['accum *= xi;', 'var accum = 1;'],
	    norm2Squared: ['accum += xi*xi;', 'var accum = 0;'],
	    norminf: ['accum = max(accum,abs(xi));', 'var accum = 0, max = Math.max, abs = Math.abs;'],
	    norm1: ['accum += abs(xi)', 'var accum = 0, abs = Math.abs;'],
	    sup: ['accum = max(accum,xi);', 'var accum = -Infinity, max = Math.max;'],
	    inf: ['accum = min(accum,xi);', 'var accum = Infinity, min = Math.min;']
	  };

	  (function () {
	    var i, o;

	    for (i = 0; i < numeric.mathfuns2.length; ++i) {
	      o = numeric.mathfuns2[i];
	      numeric.ops2[o] = o;
	    }

	    for (i in numeric.ops2) {
	      if (numeric.ops2.hasOwnProperty(i)) {
	        o = numeric.ops2[i];
	        var code,
	            codeeq,
	            setup = '';

	        if (numeric.myIndexOf.call(numeric.mathfuns2, i) !== -1) {
	          setup = 'var ' + o + ' = Math.' + o + ';\n';

	          code = function (r, x, y) {
	            return r + ' = ' + o + '(' + x + ',' + y + ')';
	          };

	          codeeq = function (x, y) {
	            return x + ' = ' + o + '(' + x + ',' + y + ')';
	          };
	        } else {
	          code = function (r, x, y) {
	            return r + ' = ' + x + ' ' + o + ' ' + y;
	          };

	          if (numeric.opseq.hasOwnProperty(i + 'eq')) {
	            codeeq = function (x, y) {
	              return x + ' ' + o + '= ' + y;
	            };
	          } else {
	            codeeq = function (x, y) {
	              return x + ' = ' + x + ' ' + o + ' ' + y;
	            };
	          }
	        }

	        numeric[i + 'VV'] = numeric.pointwise2(['x[i]', 'y[i]'], code('ret[i]', 'x[i]', 'y[i]'), setup);
	        numeric[i + 'SV'] = numeric.pointwise2(['x', 'y[i]'], code('ret[i]', 'x', 'y[i]'), setup);
	        numeric[i + 'VS'] = numeric.pointwise2(['x[i]', 'y'], code('ret[i]', 'x[i]', 'y'), setup);
	        numeric[i] = Function('var n = arguments.length, i, x = arguments[0], y;\n' + 'var VV = numeric.' + i + 'VV, VS = numeric.' + i + 'VS, SV = numeric.' + i + 'SV;\n' + 'var dim = numeric.dim;\n' + 'for(i=1;i!==n;++i) { \n' + '  y = arguments[i];\n' + '  if(typeof x === "object") {\n' + '      if(typeof y === "object") x = numeric._biforeach2(x,y,dim(x),0,VV);\n' + '      else x = numeric._biforeach2(x,y,dim(x),0,VS);\n' + '  } else if(typeof y === "object") x = numeric._biforeach2(x,y,dim(y),0,SV);\n' + '  else ' + codeeq('x', 'y') + '\n' + '}\nreturn x;\n');
	        numeric[o] = numeric[i];
	        numeric[i + 'eqV'] = numeric.pointwise2(['ret[i]', 'x[i]'], codeeq('ret[i]', 'x[i]'), setup);
	        numeric[i + 'eqS'] = numeric.pointwise2(['ret[i]', 'x'], codeeq('ret[i]', 'x'), setup);
	        numeric[i + 'eq'] = Function('var n = arguments.length, i, x = arguments[0], y;\n' + 'var V = numeric.' + i + 'eqV, S = numeric.' + i + 'eqS\n' + 'var s = numeric.dim(x);\n' + 'for(i=1;i!==n;++i) { \n' + '  y = arguments[i];\n' + '  if(typeof y === "object") numeric._biforeach(x,y,s,0,V);\n' + '  else numeric._biforeach(x,y,s,0,S);\n' + '}\nreturn x;\n');
	      }
	    }

	    for (i = 0; i < numeric.mathfuns2.length; ++i) {
	      o = numeric.mathfuns2[i];
	      delete numeric.ops2[o];
	    }

	    for (i = 0; i < numeric.mathfuns.length; ++i) {
	      o = numeric.mathfuns[i];
	      numeric.ops1[o] = o;
	    }

	    for (i in numeric.ops1) {
	      if (numeric.ops1.hasOwnProperty(i)) {
	        setup = '';
	        o = numeric.ops1[i];

	        if (numeric.myIndexOf.call(numeric.mathfuns, i) !== -1) {
	          if (Math.hasOwnProperty(o)) setup = 'var ' + o + ' = Math.' + o + ';\n';
	        }

	        numeric[i + 'eqV'] = numeric.pointwise2(['ret[i]'], 'ret[i] = ' + o + '(ret[i]);', setup);
	        numeric[i + 'eq'] = Function('x', 'if(typeof x !== "object") return ' + o + 'x\n' + 'var i;\n' + 'var V = numeric.' + i + 'eqV;\n' + 'var s = numeric.dim(x);\n' + 'numeric._foreach(x,s,0,V);\n' + 'return x;\n');
	        numeric[i + 'V'] = numeric.pointwise2(['x[i]'], 'ret[i] = ' + o + '(x[i]);', setup);
	        numeric[i] = Function('x', 'if(typeof x !== "object") return ' + o + '(x)\n' + 'var i;\n' + 'var V = numeric.' + i + 'V;\n' + 'var s = numeric.dim(x);\n' + 'return numeric._foreach2(x,s,0,V);\n');
	      }
	    }

	    for (i = 0; i < numeric.mathfuns.length; ++i) {
	      o = numeric.mathfuns[i];
	      delete numeric.ops1[o];
	    }

	    for (i in numeric.mapreducers) {
	      if (numeric.mapreducers.hasOwnProperty(i)) {
	        o = numeric.mapreducers[i];
	        numeric[i + 'V'] = numeric.mapreduce2(o[0], o[1]);
	        numeric[i] = Function('x', 's', 'k', o[1] + 'if(typeof x !== "object") {' + '    xi = x;\n' + o[0] + ';\n' + '    return accum;\n' + '}' + 'if(typeof s === "undefined") s = numeric.dim(x);\n' + 'if(typeof k === "undefined") k = 0;\n' + 'if(k === s.length-1) return numeric.' + i + 'V(x);\n' + 'var xi;\n' + 'var n = x.length, i;\n' + 'for(i=n-1;i!==-1;--i) {\n' + '   xi = arguments.callee(x[i]);\n' + o[0] + ';\n' + '}\n' + 'return accum;\n');
	      }
	    }
	  })();

	  numeric.truncVV = numeric.pointwise(['x[i]', 'y[i]'], 'ret[i] = round(x[i]/y[i])*y[i];', 'var round = Math.round;');
	  numeric.truncVS = numeric.pointwise(['x[i]', 'y'], 'ret[i] = round(x[i]/y)*y;', 'var round = Math.round;');
	  numeric.truncSV = numeric.pointwise(['x', 'y[i]'], 'ret[i] = round(x/y[i])*y[i];', 'var round = Math.round;');

	  numeric.trunc = function trunc(x, y) {
	    if (typeof x === "object") {
	      if (typeof y === "object") return numeric.truncVV(x, y);
	      return numeric.truncVS(x, y);
	    }

	    if (typeof y === "object") return numeric.truncSV(x, y);
	    return Math.round(x / y) * y;
	  };

	  numeric.inv = function inv(x) {
	    var s = numeric.dim(x),
	        abs = Math.abs,
	        m = s[0],
	        n = s[1];
	    var A = numeric.clone(x),
	        Ai,
	        Aj;
	    var I = numeric.identity(m),
	        Ii,
	        Ij;
	    var i, j, k, x;

	    for (j = 0; j < n; ++j) {
	      var i0 = -1;
	      var v0 = -1;

	      for (i = j; i !== m; ++i) {
	        k = abs(A[i][j]);

	        if (k > v0) {
	          i0 = i;
	          v0 = k;
	        }
	      }

	      Aj = A[i0];
	      A[i0] = A[j];
	      A[j] = Aj;
	      Ij = I[i0];
	      I[i0] = I[j];
	      I[j] = Ij;
	      x = Aj[j];

	      for (k = j; k !== n; ++k) Aj[k] /= x;

	      for (k = n - 1; k !== -1; --k) Ij[k] /= x;

	      for (i = m - 1; i !== -1; --i) {
	        if (i !== j) {
	          Ai = A[i];
	          Ii = I[i];
	          x = Ai[j];

	          for (k = j + 1; k !== n; ++k) Ai[k] -= Aj[k] * x;

	          for (k = n - 1; k > 0; --k) {
	            Ii[k] -= Ij[k] * x;
	            --k;
	            Ii[k] -= Ij[k] * x;
	          }

	          if (k === 0) Ii[0] -= Ij[0] * x;
	        }
	      }
	    }

	    return I;
	  };

	  numeric.det = function det(x) {
	    var s = numeric.dim(x);

	    if (s.length !== 2 || s[0] !== s[1]) {
	      throw new Error('numeric: det() only works on square matrices');
	    }

	    var n = s[0],
	        ret = 1,
	        i,
	        j,
	        k,
	        A = numeric.clone(x),
	        Aj,
	        Ai,
	        alpha,
	        temp,
	        k1;

	    for (j = 0; j < n - 1; j++) {
	      k = j;

	      for (i = j + 1; i < n; i++) {
	        if (Math.abs(A[i][j]) > Math.abs(A[k][j])) {
	          k = i;
	        }
	      }

	      if (k !== j) {
	        temp = A[k];
	        A[k] = A[j];
	        A[j] = temp;
	        ret *= -1;
	      }

	      Aj = A[j];

	      for (i = j + 1; i < n; i++) {
	        Ai = A[i];
	        alpha = Ai[j] / Aj[j];

	        for (k = j + 1; k < n - 1; k += 2) {
	          k1 = k + 1;
	          Ai[k] -= Aj[k] * alpha;
	          Ai[k1] -= Aj[k1] * alpha;
	        }

	        if (k !== n) {
	          Ai[k] -= Aj[k] * alpha;
	        }
	      }

	      if (Aj[j] === 0) {
	        return 0;
	      }

	      ret *= Aj[j];
	    }

	    return ret * A[j][j];
	  };

	  numeric.transpose = function transpose(x) {
	    var i,
	        j,
	        m = x.length,
	        n = x[0].length,
	        ret = Array(n),
	        A0,
	        A1,
	        Bj;

	    for (j = 0; j < n; j++) ret[j] = Array(m);

	    for (i = m - 1; i >= 1; i -= 2) {
	      A1 = x[i];
	      A0 = x[i - 1];

	      for (j = n - 1; j >= 1; --j) {
	        Bj = ret[j];
	        Bj[i] = A1[j];
	        Bj[i - 1] = A0[j];
	        --j;
	        Bj = ret[j];
	        Bj[i] = A1[j];
	        Bj[i - 1] = A0[j];
	      }

	      if (j === 0) {
	        Bj = ret[0];
	        Bj[i] = A1[0];
	        Bj[i - 1] = A0[0];
	      }
	    }

	    if (i === 0) {
	      A0 = x[0];

	      for (j = n - 1; j >= 1; --j) {
	        ret[j][0] = A0[j];
	        --j;
	        ret[j][0] = A0[j];
	      }

	      if (j === 0) {
	        ret[0][0] = A0[0];
	      }
	    }

	    return ret;
	  };

	  numeric.negtranspose = function negtranspose(x) {
	    var i,
	        j,
	        m = x.length,
	        n = x[0].length,
	        ret = Array(n),
	        A0,
	        A1,
	        Bj;

	    for (j = 0; j < n; j++) ret[j] = Array(m);

	    for (i = m - 1; i >= 1; i -= 2) {
	      A1 = x[i];
	      A0 = x[i - 1];

	      for (j = n - 1; j >= 1; --j) {
	        Bj = ret[j];
	        Bj[i] = -A1[j];
	        Bj[i - 1] = -A0[j];
	        --j;
	        Bj = ret[j];
	        Bj[i] = -A1[j];
	        Bj[i - 1] = -A0[j];
	      }

	      if (j === 0) {
	        Bj = ret[0];
	        Bj[i] = -A1[0];
	        Bj[i - 1] = -A0[0];
	      }
	    }

	    if (i === 0) {
	      A0 = x[0];

	      for (j = n - 1; j >= 1; --j) {
	        ret[j][0] = -A0[j];
	        --j;
	        ret[j][0] = -A0[j];
	      }

	      if (j === 0) {
	        ret[0][0] = -A0[0];
	      }
	    }

	    return ret;
	  };

	  numeric._random = function _random(s, k) {
	    var i,
	        n = s[k],
	        ret = Array(n),
	        rnd;

	    if (k === s.length - 1) {
	      rnd = Math.random;

	      for (i = n - 1; i >= 1; i -= 2) {
	        ret[i] = rnd();
	        ret[i - 1] = rnd();
	      }

	      if (i === 0) {
	        ret[0] = rnd();
	      }

	      return ret;
	    }

	    for (i = n - 1; i >= 0; i--) ret[i] = _random(s, k + 1);

	    return ret;
	  };

	  numeric.random = function random(s) {
	    return numeric._random(s, 0);
	  };

	  numeric.norm2 = function norm2(x) {
	    return Math.sqrt(numeric.norm2Squared(x));
	  };

	  numeric.linspace = function linspace(a, b, n) {
	    if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);

	    if (n < 2) {
	      return n === 1 ? [a] : [];
	    }

	    var i,
	        ret = Array(n);
	    n--;

	    for (i = n; i >= 0; i--) {
	      ret[i] = (i * b + (n - i) * a) / n;
	    }

	    return ret;
	  };

	  numeric.getBlock = function getBlock(x, from, to) {
	    var s = numeric.dim(x);

	    function foo(x, k) {
	      var i,
	          a = from[k],
	          n = to[k] - a,
	          ret = Array(n);

	      if (k === s.length - 1) {
	        for (i = n; i >= 0; i--) {
	          ret[i] = x[i + a];
	        }

	        return ret;
	      }

	      for (i = n; i >= 0; i--) {
	        ret[i] = foo(x[i + a], k + 1);
	      }

	      return ret;
	    }

	    return foo(x, 0);
	  };

	  numeric.setBlock = function setBlock(x, from, to, B) {
	    var s = numeric.dim(x);

	    function foo(x, y, k) {
	      var i,
	          a = from[k],
	          n = to[k] - a;

	      if (k === s.length - 1) {
	        for (i = n; i >= 0; i--) {
	          x[i + a] = y[i];
	        }
	      }

	      for (i = n; i >= 0; i--) {
	        foo(x[i + a], y[i], k + 1);
	      }
	    }

	    foo(x, B, 0);
	    return x;
	  };

	  numeric.getRange = function getRange(A, I, J) {
	    var m = I.length,
	        n = J.length;
	    var i, j;
	    var B = Array(m),
	        Bi,
	        AI;

	    for (i = m - 1; i !== -1; --i) {
	      B[i] = Array(n);
	      Bi = B[i];
	      AI = A[I[i]];

	      for (j = n - 1; j !== -1; --j) Bi[j] = AI[J[j]];
	    }

	    return B;
	  };

	  numeric.blockMatrix = function blockMatrix(X) {
	    var s = numeric.dim(X);
	    if (s.length < 4) return numeric.blockMatrix([X]);
	    var m = s[0],
	        n = s[1],
	        M,
	        N,
	        i,
	        j,
	        Xij;
	    M = 0;
	    N = 0;

	    for (i = 0; i < m; ++i) M += X[i][0].length;

	    for (j = 0; j < n; ++j) N += X[0][j][0].length;

	    var Z = Array(M);

	    for (i = 0; i < M; ++i) Z[i] = Array(N);

	    var I = 0,
	        J,
	        ZI,
	        k,
	        l,
	        Xijk;

	    for (i = 0; i < m; ++i) {
	      J = N;

	      for (j = n - 1; j !== -1; --j) {
	        Xij = X[i][j];
	        J -= Xij[0].length;

	        for (k = Xij.length - 1; k !== -1; --k) {
	          Xijk = Xij[k];
	          ZI = Z[I + k];

	          for (l = Xijk.length - 1; l !== -1; --l) ZI[J + l] = Xijk[l];
	        }
	      }

	      I += X[i][0].length;
	    }

	    return Z;
	  };

	  numeric.tensor = function tensor(x, y) {
	    if (typeof x === "number" || typeof y === "number") return numeric.mul(x, y);
	    var s1 = numeric.dim(x),
	        s2 = numeric.dim(y);

	    if (s1.length !== 1 || s2.length !== 1) {
	      throw new Error('numeric: tensor product is only defined for vectors');
	    }

	    var m = s1[0],
	        n = s2[0],
	        A = Array(m),
	        Ai,
	        i,
	        j,
	        xi;

	    for (i = m - 1; i >= 0; i--) {
	      Ai = Array(n);
	      xi = x[i];

	      for (j = n - 1; j >= 3; --j) {
	        Ai[j] = xi * y[j];
	        --j;
	        Ai[j] = xi * y[j];
	        --j;
	        Ai[j] = xi * y[j];
	        --j;
	        Ai[j] = xi * y[j];
	      }

	      while (j >= 0) {
	        Ai[j] = xi * y[j];
	        --j;
	      }

	      A[i] = Ai;
	    }

	    return A;
	  }; // 3. The Tensor type T


	  numeric.T = function T(x, y) {
	    this.x = x;
	    this.y = y;
	  };

	  numeric.t = function t(x, y) {
	    return new numeric.T(x, y);
	  };

	  numeric.Tbinop = function Tbinop(rr, rc, cr, cc, setup) {
	    var io = numeric.indexOf;

	    if (typeof setup !== "string") {
	      var k;
	      setup = '';

	      for (k in numeric) {
	        if (numeric.hasOwnProperty(k) && (rr.indexOf(k) >= 0 || rc.indexOf(k) >= 0 || cr.indexOf(k) >= 0 || cc.indexOf(k) >= 0) && k.length > 1) {
	          setup += 'var ' + k + ' = numeric.' + k + ';\n';
	        }
	      }
	    }

	    return Function(['y'], 'var x = this;\n' + 'if(!(y instanceof numeric.T)) { y = new numeric.T(y); }\n' + setup + '\n' + 'if(x.y) {' + '  if(y.y) {' + '    return new numeric.T(' + cc + ');\n' + '  }\n' + '  return new numeric.T(' + cr + ');\n' + '}\n' + 'if(y.y) {\n' + '  return new numeric.T(' + rc + ');\n' + '}\n' + 'return new numeric.T(' + rr + ');\n');
	  };

	  numeric.T.prototype.add = numeric.Tbinop('add(x.x,y.x)', 'add(x.x,y.x),y.y', 'add(x.x,y.x),x.y', 'add(x.x,y.x),add(x.y,y.y)');
	  numeric.T.prototype.sub = numeric.Tbinop('sub(x.x,y.x)', 'sub(x.x,y.x),neg(y.y)', 'sub(x.x,y.x),x.y', 'sub(x.x,y.x),sub(x.y,y.y)');
	  numeric.T.prototype.mul = numeric.Tbinop('mul(x.x,y.x)', 'mul(x.x,y.x),mul(x.x,y.y)', 'mul(x.x,y.x),mul(x.y,y.x)', 'sub(mul(x.x,y.x),mul(x.y,y.y)),add(mul(x.x,y.y),mul(x.y,y.x))');

	  numeric.T.prototype.reciprocal = function reciprocal() {
	    var mul = numeric.mul,
	        div = numeric.div;

	    if (this.y) {
	      var d = numeric.add(mul(this.x, this.x), mul(this.y, this.y));
	      return new numeric.T(div(this.x, d), div(numeric.neg(this.y), d));
	    }

	    return new T(div(1, this.x));
	  };

	  numeric.T.prototype.div = function div(y) {
	    if (!(y instanceof numeric.T)) y = new numeric.T(y);

	    if (y.y) {
	      return this.mul(y.reciprocal());
	    }

	    var div = numeric.div;

	    if (this.y) {
	      return new numeric.T(div(this.x, y.x), div(this.y, y.x));
	    }

	    return new numeric.T(div(this.x, y.x));
	  };

	  numeric.T.prototype.dot = numeric.Tbinop('dot(x.x,y.x)', 'dot(x.x,y.x),dot(x.x,y.y)', 'dot(x.x,y.x),dot(x.y,y.x)', 'sub(dot(x.x,y.x),dot(x.y,y.y)),add(dot(x.x,y.y),dot(x.y,y.x))');

	  numeric.T.prototype.transpose = function transpose() {
	    var t = numeric.transpose,
	        x = this.x,
	        y = this.y;

	    if (y) {
	      return new numeric.T(t(x), t(y));
	    }

	    return new numeric.T(t(x));
	  };

	  numeric.T.prototype.transjugate = function transjugate() {
	    var t = numeric.transpose,
	        x = this.x,
	        y = this.y;

	    if (y) {
	      return new numeric.T(t(x), numeric.negtranspose(y));
	    }

	    return new numeric.T(t(x));
	  };

	  numeric.Tunop = function Tunop(r, c, s) {
	    if (typeof s !== "string") {
	      s = '';
	    }

	    return Function('var x = this;\n' + s + '\n' + 'if(x.y) {' + '  ' + c + ';\n' + '}\n' + r + ';\n');
	  };

	  numeric.T.prototype.exp = numeric.Tunop('return new numeric.T(ex)', 'return new numeric.T(mul(cos(x.y),ex),mul(sin(x.y),ex))', 'var ex = numeric.exp(x.x), cos = numeric.cos, sin = numeric.sin, mul = numeric.mul;');
	  numeric.T.prototype.conj = numeric.Tunop('return new numeric.T(x.x);', 'return new numeric.T(x.x,numeric.neg(x.y));');
	  numeric.T.prototype.neg = numeric.Tunop('return new numeric.T(neg(x.x));', 'return new numeric.T(neg(x.x),neg(x.y));', 'var neg = numeric.neg;');
	  numeric.T.prototype.sin = numeric.Tunop('return new numeric.T(numeric.sin(x.x))', 'return x.exp().sub(x.neg().exp()).div(new numeric.T(0,2));');
	  numeric.T.prototype.cos = numeric.Tunop('return new numeric.T(numeric.cos(x.x))', 'return x.exp().add(x.neg().exp()).div(2);');
	  numeric.T.prototype.abs = numeric.Tunop('return new numeric.T(numeric.abs(x.x));', 'return new numeric.T(numeric.sqrt(numeric.add(mul(x.x,x.x),mul(x.y,x.y))));', 'var mul = numeric.mul;');
	  numeric.T.prototype.log = numeric.Tunop('return new numeric.T(numeric.log(x.x));', 'var theta = new numeric.T(numeric.atan2(x.y,x.x)), r = x.abs();\n' + 'return new numeric.T(numeric.log(r.x),theta.x);');
	  numeric.T.prototype.norm2 = numeric.Tunop('return numeric.norm2(x.x);', 'var f = numeric.norm2Squared;\n' + 'return Math.sqrt(f(x.x)+f(x.y));');

	  numeric.T.prototype.inv = function inv() {
	    var A = this;

	    if (typeof A.y === "undefined") {
	      return new numeric.T(numeric.inv(A.x));
	    }

	    var n = A.x.length,
	        i,
	        j,
	        k;
	    var Rx = numeric.identity(n),
	        Ry = numeric.rep([n, n], 0);
	    var Ax = numeric.clone(A.x),
	        Ay = numeric.clone(A.y);
	    var Aix, Aiy, Ajx, Ajy, Rix, Riy, Rjx, Rjy;
	    var i, j, k, d, d1, ax, ay, bx, by, temp;

	    for (i = 0; i < n; i++) {
	      ax = Ax[i][i];
	      ay = Ay[i][i];
	      d = ax * ax + ay * ay;
	      k = i;

	      for (j = i + 1; j < n; j++) {
	        ax = Ax[j][i];
	        ay = Ay[j][i];
	        d1 = ax * ax + ay * ay;

	        if (d1 > d) {
	          k = j;
	          d = d1;
	        }
	      }

	      if (k !== i) {
	        temp = Ax[i];
	        Ax[i] = Ax[k];
	        Ax[k] = temp;
	        temp = Ay[i];
	        Ay[i] = Ay[k];
	        Ay[k] = temp;
	        temp = Rx[i];
	        Rx[i] = Rx[k];
	        Rx[k] = temp;
	        temp = Ry[i];
	        Ry[i] = Ry[k];
	        Ry[k] = temp;
	      }

	      Aix = Ax[i];
	      Aiy = Ay[i];
	      Rix = Rx[i];
	      Riy = Ry[i];
	      ax = Aix[i];
	      ay = Aiy[i];

	      for (j = i + 1; j < n; j++) {
	        bx = Aix[j];
	        by = Aiy[j];
	        Aix[j] = (bx * ax + by * ay) / d;
	        Aiy[j] = (by * ax - bx * ay) / d;
	      }

	      for (j = 0; j < n; j++) {
	        bx = Rix[j];
	        by = Riy[j];
	        Rix[j] = (bx * ax + by * ay) / d;
	        Riy[j] = (by * ax - bx * ay) / d;
	      }

	      for (j = i + 1; j < n; j++) {
	        Ajx = Ax[j];
	        Ajy = Ay[j];
	        Rjx = Rx[j];
	        Rjy = Ry[j];
	        ax = Ajx[i];
	        ay = Ajy[i];

	        for (k = i + 1; k < n; k++) {
	          bx = Aix[k];
	          by = Aiy[k];
	          Ajx[k] -= bx * ax - by * ay;
	          Ajy[k] -= by * ax + bx * ay;
	        }

	        for (k = 0; k < n; k++) {
	          bx = Rix[k];
	          by = Riy[k];
	          Rjx[k] -= bx * ax - by * ay;
	          Rjy[k] -= by * ax + bx * ay;
	        }
	      }
	    }

	    for (i = n - 1; i > 0; i--) {
	      Rix = Rx[i];
	      Riy = Ry[i];

	      for (j = i - 1; j >= 0; j--) {
	        Rjx = Rx[j];
	        Rjy = Ry[j];
	        ax = Ax[j][i];
	        ay = Ay[j][i];

	        for (k = n - 1; k >= 0; k--) {
	          bx = Rix[k];
	          by = Riy[k];
	          Rjx[k] -= ax * bx - ay * by;
	          Rjy[k] -= ax * by + ay * bx;
	        }
	      }
	    }

	    return new numeric.T(Rx, Ry);
	  };

	  numeric.T.prototype.get = function get(i) {
	    var x = this.x,
	        y = this.y,
	        k = 0,
	        ik,
	        n = i.length;

	    if (y) {
	      while (k < n) {
	        ik = i[k];
	        x = x[ik];
	        y = y[ik];
	        k++;
	      }

	      return new numeric.T(x, y);
	    }

	    while (k < n) {
	      ik = i[k];
	      x = x[ik];
	      k++;
	    }

	    return new numeric.T(x);
	  };

	  numeric.T.prototype.set = function set(i, v) {
	    var x = this.x,
	        y = this.y,
	        k = 0,
	        ik,
	        n = i.length,
	        vx = v.x,
	        vy = v.y;

	    if (n === 0) {
	      if (vy) {
	        this.y = vy;
	      } else if (y) {
	        this.y = undefined;
	      }

	      this.x = x;
	      return this;
	    }

	    if (vy) {
	      if (y) ; else {
	        y = numeric.rep(numeric.dim(x), 0);
	        this.y = y;
	      }

	      while (k < n - 1) {
	        ik = i[k];
	        x = x[ik];
	        y = y[ik];
	        k++;
	      }

	      ik = i[k];
	      x[ik] = vx;
	      y[ik] = vy;
	      return this;
	    }

	    if (y) {
	      while (k < n - 1) {
	        ik = i[k];
	        x = x[ik];
	        y = y[ik];
	        k++;
	      }

	      ik = i[k];
	      x[ik] = vx;
	      if (vx instanceof Array) y[ik] = numeric.rep(numeric.dim(vx), 0);else y[ik] = 0;
	      return this;
	    }

	    while (k < n - 1) {
	      ik = i[k];
	      x = x[ik];
	      k++;
	    }

	    ik = i[k];
	    x[ik] = vx;
	    return this;
	  };

	  numeric.T.prototype.getRows = function getRows(i0, i1) {
	    var n = i1 - i0 + 1,
	        j;
	    var rx = Array(n),
	        ry,
	        x = this.x,
	        y = this.y;

	    for (j = i0; j <= i1; j++) {
	      rx[j - i0] = x[j];
	    }

	    if (y) {
	      ry = Array(n);

	      for (j = i0; j <= i1; j++) {
	        ry[j - i0] = y[j];
	      }

	      return new numeric.T(rx, ry);
	    }

	    return new numeric.T(rx);
	  };

	  numeric.T.prototype.setRows = function setRows(i0, i1, A) {
	    var j;
	    var rx = this.x,
	        ry = this.y,
	        x = A.x,
	        y = A.y;

	    for (j = i0; j <= i1; j++) {
	      rx[j] = x[j - i0];
	    }

	    if (y) {
	      if (!ry) {
	        ry = numeric.rep(numeric.dim(rx), 0);
	        this.y = ry;
	      }

	      for (j = i0; j <= i1; j++) {
	        ry[j] = y[j - i0];
	      }
	    } else if (ry) {
	      for (j = i0; j <= i1; j++) {
	        ry[j] = numeric.rep([x[j - i0].length], 0);
	      }
	    }

	    return this;
	  };

	  numeric.T.prototype.getRow = function getRow(k) {
	    var x = this.x,
	        y = this.y;

	    if (y) {
	      return new numeric.T(x[k], y[k]);
	    }

	    return new numeric.T(x[k]);
	  };

	  numeric.T.prototype.setRow = function setRow(i, v) {
	    var rx = this.x,
	        ry = this.y,
	        x = v.x,
	        y = v.y;
	    rx[i] = x;

	    if (y) {
	      if (!ry) {
	        ry = numeric.rep(numeric.dim(rx), 0);
	        this.y = ry;
	      }

	      ry[i] = y;
	    } else if (ry) {
	      ry = numeric.rep([x.length], 0);
	    }

	    return this;
	  };

	  numeric.T.prototype.getBlock = function getBlock(from, to) {
	    var x = this.x,
	        y = this.y,
	        b = numeric.getBlock;

	    if (y) {
	      return new numeric.T(b(x, from, to), b(y, from, to));
	    }

	    return new numeric.T(b(x, from, to));
	  };

	  numeric.T.prototype.setBlock = function setBlock(from, to, A) {
	    if (!(A instanceof numeric.T)) A = new numeric.T(A);
	    var x = this.x,
	        y = this.y,
	        b = numeric.setBlock,
	        Ax = A.x,
	        Ay = A.y;

	    if (Ay) {
	      if (!y) {
	        this.y = numeric.rep(numeric.dim(this), 0);
	        y = this.y;
	      }

	      b(x, from, to, Ax);
	      b(y, from, to, Ay);
	      return this;
	    }

	    b(x, from, to, Ax);
	    if (y) b(y, from, to, numeric.rep(numeric.dim(Ax), 0));
	  };

	  numeric.T.rep = function rep(s, v) {
	    var T = numeric.T;
	    if (!(v instanceof T)) v = new T(v);
	    var x = v.x,
	        y = v.y,
	        r = numeric.rep;
	    if (y) return new T(r(s, x), r(s, y));
	    return new T(r(s, x));
	  };

	  numeric.T.diag = function diag(d) {
	    if (!(d instanceof numeric.T)) d = new numeric.T(d);
	    var x = d.x,
	        y = d.y,
	        diag = numeric.diag;
	    if (y) return new numeric.T(diag(x), diag(y));
	    return new numeric.T(diag(x));
	  };

	  numeric.T.eig = function eig() {
	    if (this.y) {
	      throw new Error('eig: not implemented for complex matrices.');
	    }

	    return numeric.eig(this.x);
	  };

	  numeric.T.identity = function identity(n) {
	    return new numeric.T(numeric.identity(n));
	  };

	  numeric.T.prototype.getDiag = function getDiag() {
	    var n = numeric;
	    var x = this.x,
	        y = this.y;

	    if (y) {
	      return new n.T(n.getDiag(x), n.getDiag(y));
	    }

	    return new n.T(n.getDiag(x));
	  }; // 4. Eigenvalues of real matrices


	  numeric.house = function house(x) {
	    var v = numeric.clone(x);
	    var s = x[0] >= 0 ? 1 : -1;
	    var alpha = s * numeric.norm2(x);
	    v[0] += alpha;
	    var foo = numeric.norm2(v);

	    if (foo === 0) {
	      /* this should not happen */
	      throw new Error('eig: internal error');
	    }

	    return numeric.div(v, foo);
	  };

	  numeric.toUpperHessenberg = function toUpperHessenberg(me) {
	    var s = numeric.dim(me);

	    if (s.length !== 2 || s[0] !== s[1]) {
	      throw new Error('numeric: toUpperHessenberg() only works on square matrices');
	    }

	    var m = s[0],
	        i,
	        j,
	        k,
	        x,
	        v,
	        A = numeric.clone(me),
	        B,
	        C,
	        Ai,
	        Ci,
	        Q = numeric.identity(m),
	        Qi;

	    for (j = 0; j < m - 2; j++) {
	      x = Array(m - j - 1);

	      for (i = j + 1; i < m; i++) {
	        x[i - j - 1] = A[i][j];
	      }

	      if (numeric.norm2(x) > 0) {
	        v = numeric.house(x);
	        B = numeric.getBlock(A, [j + 1, j], [m - 1, m - 1]);
	        C = numeric.tensor(v, numeric.dot(v, B));

	        for (i = j + 1; i < m; i++) {
	          Ai = A[i];
	          Ci = C[i - j - 1];

	          for (k = j; k < m; k++) Ai[k] -= 2 * Ci[k - j];
	        }

	        B = numeric.getBlock(A, [0, j + 1], [m - 1, m - 1]);
	        C = numeric.tensor(numeric.dot(B, v), v);

	        for (i = 0; i < m; i++) {
	          Ai = A[i];
	          Ci = C[i];

	          for (k = j + 1; k < m; k++) Ai[k] -= 2 * Ci[k - j - 1];
	        }

	        B = Array(m - j - 1);

	        for (i = j + 1; i < m; i++) B[i - j - 1] = Q[i];

	        C = numeric.tensor(v, numeric.dot(v, B));

	        for (i = j + 1; i < m; i++) {
	          Qi = Q[i];
	          Ci = C[i - j - 1];

	          for (k = 0; k < m; k++) Qi[k] -= 2 * Ci[k];
	        }
	      }
	    }

	    return {
	      H: A,
	      Q: Q
	    };
	  };

	  numeric.epsilon = 2.220446049250313e-16;

	  numeric.QRFrancis = function (H, maxiter) {
	    if (typeof maxiter === "undefined") {
	      maxiter = 10000;
	    }

	    H = numeric.clone(H);
	    var H0 = numeric.clone(H);
	    var s = numeric.dim(H),
	        m = s[0],
	        x,
	        v,
	        a,
	        b,
	        c,
	        d,
	        det,
	        tr,
	        Hloc,
	        Q = numeric.identity(m),
	        Qi,
	        Hi,
	        B,
	        C,
	        Ci,
	        i,
	        j,
	        k,
	        iter;

	    if (m < 3) {
	      return {
	        Q: Q,
	        B: [[0, m - 1]]
	      };
	    }

	    var epsilon = numeric.epsilon;

	    for (iter = 0; iter < maxiter; iter++) {
	      for (j = 0; j < m - 1; j++) {
	        if (Math.abs(H[j + 1][j]) < epsilon * (Math.abs(H[j][j]) + Math.abs(H[j + 1][j + 1]))) {
	          var QH1 = numeric.QRFrancis(numeric.getBlock(H, [0, 0], [j, j]), maxiter);
	          var QH2 = numeric.QRFrancis(numeric.getBlock(H, [j + 1, j + 1], [m - 1, m - 1]), maxiter);
	          B = Array(j + 1);

	          for (i = 0; i <= j; i++) {
	            B[i] = Q[i];
	          }

	          C = numeric.dot(QH1.Q, B);

	          for (i = 0; i <= j; i++) {
	            Q[i] = C[i];
	          }

	          B = Array(m - j - 1);

	          for (i = j + 1; i < m; i++) {
	            B[i - j - 1] = Q[i];
	          }

	          C = numeric.dot(QH2.Q, B);

	          for (i = j + 1; i < m; i++) {
	            Q[i] = C[i - j - 1];
	          }

	          return {
	            Q: Q,
	            B: QH1.B.concat(numeric.add(QH2.B, j + 1))
	          };
	        }
	      }

	      a = H[m - 2][m - 2];
	      b = H[m - 2][m - 1];
	      c = H[m - 1][m - 2];
	      d = H[m - 1][m - 1];
	      tr = a + d;
	      det = a * d - b * c;
	      Hloc = numeric.getBlock(H, [0, 0], [2, 2]);

	      if (tr * tr >= 4 * det) {
	        var s1, s2;
	        s1 = 0.5 * (tr + Math.sqrt(tr * tr - 4 * det));
	        s2 = 0.5 * (tr - Math.sqrt(tr * tr - 4 * det));
	        Hloc = numeric.add(numeric.sub(numeric.dot(Hloc, Hloc), numeric.mul(Hloc, s1 + s2)), numeric.diag(numeric.rep([3], s1 * s2)));
	      } else {
	        Hloc = numeric.add(numeric.sub(numeric.dot(Hloc, Hloc), numeric.mul(Hloc, tr)), numeric.diag(numeric.rep([3], det)));
	      }

	      x = [Hloc[0][0], Hloc[1][0], Hloc[2][0]];
	      v = numeric.house(x);
	      B = [H[0], H[1], H[2]];
	      C = numeric.tensor(v, numeric.dot(v, B));

	      for (i = 0; i < 3; i++) {
	        Hi = H[i];
	        Ci = C[i];

	        for (k = 0; k < m; k++) Hi[k] -= 2 * Ci[k];
	      }

	      B = numeric.getBlock(H, [0, 0], [m - 1, 2]);
	      C = numeric.tensor(numeric.dot(B, v), v);

	      for (i = 0; i < m; i++) {
	        Hi = H[i];
	        Ci = C[i];

	        for (k = 0; k < 3; k++) Hi[k] -= 2 * Ci[k];
	      }

	      B = [Q[0], Q[1], Q[2]];
	      C = numeric.tensor(v, numeric.dot(v, B));

	      for (i = 0; i < 3; i++) {
	        Qi = Q[i];
	        Ci = C[i];

	        for (k = 0; k < m; k++) Qi[k] -= 2 * Ci[k];
	      }

	      var J;

	      for (j = 0; j < m - 2; j++) {
	        for (k = j; k <= j + 1; k++) {
	          if (Math.abs(H[k + 1][k]) < epsilon * (Math.abs(H[k][k]) + Math.abs(H[k + 1][k + 1]))) {
	            var QH1 = numeric.QRFrancis(numeric.getBlock(H, [0, 0], [k, k]), maxiter);
	            var QH2 = numeric.QRFrancis(numeric.getBlock(H, [k + 1, k + 1], [m - 1, m - 1]), maxiter);
	            B = Array(k + 1);

	            for (i = 0; i <= k; i++) {
	              B[i] = Q[i];
	            }

	            C = numeric.dot(QH1.Q, B);

	            for (i = 0; i <= k; i++) {
	              Q[i] = C[i];
	            }

	            B = Array(m - k - 1);

	            for (i = k + 1; i < m; i++) {
	              B[i - k - 1] = Q[i];
	            }

	            C = numeric.dot(QH2.Q, B);

	            for (i = k + 1; i < m; i++) {
	              Q[i] = C[i - k - 1];
	            }

	            return {
	              Q: Q,
	              B: QH1.B.concat(numeric.add(QH2.B, k + 1))
	            };
	          }
	        }

	        J = Math.min(m - 1, j + 3);
	        x = Array(J - j);

	        for (i = j + 1; i <= J; i++) {
	          x[i - j - 1] = H[i][j];
	        }

	        v = numeric.house(x);
	        B = numeric.getBlock(H, [j + 1, j], [J, m - 1]);
	        C = numeric.tensor(v, numeric.dot(v, B));

	        for (i = j + 1; i <= J; i++) {
	          Hi = H[i];
	          Ci = C[i - j - 1];

	          for (k = j; k < m; k++) Hi[k] -= 2 * Ci[k - j];
	        }

	        B = numeric.getBlock(H, [0, j + 1], [m - 1, J]);
	        C = numeric.tensor(numeric.dot(B, v), v);

	        for (i = 0; i < m; i++) {
	          Hi = H[i];
	          Ci = C[i];

	          for (k = j + 1; k <= J; k++) Hi[k] -= 2 * Ci[k - j - 1];
	        }

	        B = Array(J - j);

	        for (i = j + 1; i <= J; i++) B[i - j - 1] = Q[i];

	        C = numeric.tensor(v, numeric.dot(v, B));

	        for (i = j + 1; i <= J; i++) {
	          Qi = Q[i];
	          Ci = C[i - j - 1];

	          for (k = 0; k < m; k++) Qi[k] -= 2 * Ci[k];
	        }
	      }
	    }

	    throw new Error('numeric: eigenvalue iteration does not converge -- increase maxiter?');
	  };

	  numeric.eig = function eig(A, maxiter) {
	    var QH = numeric.toUpperHessenberg(A);
	    var QB = numeric.QRFrancis(QH.H, maxiter);
	    var T = numeric.T;
	    var n = A.length,
	        i,
	        k,
	        B = QB.B,
	        H = numeric.dot(QB.Q, numeric.dot(QH.H, numeric.transpose(QB.Q)));
	    var Q = new T(numeric.dot(QB.Q, QH.Q)),
	        Q0;
	    var m = B.length,
	        j;
	    var a, b, c, d, p1, p2, disc, x, y, p, q, n1, n2;
	    var sqrt = Math.sqrt;

	    for (k = 0; k < m; k++) {
	      i = B[k][0];

	      if (i === B[k][1]) ; else {
	        j = i + 1;
	        a = H[i][i];
	        b = H[i][j];
	        c = H[j][i];
	        d = H[j][j];
	        if (b === 0 && c === 0) continue;
	        p1 = -a - d;
	        p2 = a * d - b * c;
	        disc = p1 * p1 - 4 * p2;

	        if (disc >= 0) {
	          if (p1 < 0) x = -0.5 * (p1 - sqrt(disc));else x = -0.5 * (p1 + sqrt(disc));
	          n1 = (a - x) * (a - x) + b * b;
	          n2 = c * c + (d - x) * (d - x);

	          if (n1 > n2) {
	            n1 = sqrt(n1);
	            p = (a - x) / n1;
	            q = b / n1;
	          } else {
	            n2 = sqrt(n2);
	            p = c / n2;
	            q = (d - x) / n2;
	          }

	          Q0 = new T([[q, -p], [p, q]]);
	          Q.setRows(i, j, Q0.dot(Q.getRows(i, j)));
	        } else {
	          x = -0.5 * p1;
	          y = 0.5 * sqrt(-disc);
	          n1 = (a - x) * (a - x) + b * b;
	          n2 = c * c + (d - x) * (d - x);

	          if (n1 > n2) {
	            n1 = sqrt(n1 + y * y);
	            p = (a - x) / n1;
	            q = b / n1;
	            x = 0;
	            y /= n1;
	          } else {
	            n2 = sqrt(n2 + y * y);
	            p = c / n2;
	            q = (d - x) / n2;
	            x = y / n2;
	            y = 0;
	          }

	          Q0 = new T([[q, -p], [p, q]], [[x, y], [y, -x]]);
	          Q.setRows(i, j, Q0.dot(Q.getRows(i, j)));
	        }
	      }
	    }

	    var R = Q.dot(A).dot(Q.transjugate()),
	        n = A.length,
	        E = numeric.T.identity(n);

	    for (j = 0; j < n; j++) {
	      if (j > 0) {
	        for (k = j - 1; k >= 0; k--) {
	          var Rk = R.get([k, k]),
	              Rj = R.get([j, j]);

	          if (numeric.neq(Rk.x, Rj.x) || numeric.neq(Rk.y, Rj.y)) {
	            x = R.getRow(k).getBlock([k], [j - 1]);
	            y = E.getRow(j).getBlock([k], [j - 1]);
	            E.set([j, k], R.get([k, j]).neg().sub(x.dot(y)).div(Rk.sub(Rj)));
	          } else {
	            E.setRow(j, E.getRow(k));
	            continue;
	          }
	        }
	      }
	    }

	    for (j = 0; j < n; j++) {
	      x = E.getRow(j);
	      E.setRow(j, x.div(x.norm2()));
	    }

	    E = E.transpose();
	    E = Q.transjugate().dot(E);
	    return {
	      lambda: R.getDiag(),
	      E: E
	    };
	  }; // 5. Compressed Column Storage matrices


	  numeric.ccsSparse = function ccsSparse(A) {
	    var m = A.length,
	        n,
	        foo,
	        i,
	        j,
	        counts = [];

	    for (i = m - 1; i !== -1; --i) {
	      foo = A[i];

	      for (j in foo) {
	        j = parseInt(j);

	        while (j >= counts.length) counts[counts.length] = 0;

	        if (foo[j] !== 0) counts[j]++;
	      }
	    }

	    var n = counts.length;
	    var Ai = Array(n + 1);
	    Ai[0] = 0;

	    for (i = 0; i < n; ++i) Ai[i + 1] = Ai[i] + counts[i];

	    var Aj = Array(Ai[n]),
	        Av = Array(Ai[n]);

	    for (i = m - 1; i !== -1; --i) {
	      foo = A[i];

	      for (j in foo) {
	        if (foo[j] !== 0) {
	          counts[j]--;
	          Aj[Ai[j] + counts[j]] = i;
	          Av[Ai[j] + counts[j]] = foo[j];
	        }
	      }
	    }

	    return [Ai, Aj, Av];
	  };

	  numeric.ccsFull = function ccsFull(A) {
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2],
	        s = numeric.ccsDim(A),
	        m = s[0],
	        n = s[1],
	        i,
	        j,
	        j0,
	        j1;
	    var B = numeric.rep([m, n], 0);

	    for (i = 0; i < n; i++) {
	      j0 = Ai[i];
	      j1 = Ai[i + 1];

	      for (j = j0; j < j1; ++j) {
	        B[Aj[j]][i] = Av[j];
	      }
	    }

	    return B;
	  };

	  numeric.ccsTSolve = function ccsTSolve(A, b, x, bj, xj) {
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2],
	        m = Ai.length - 1,
	        max = Math.max,
	        n = 0;
	    if (typeof bj === "undefined") x = numeric.rep([m], 0);
	    if (typeof bj === "undefined") bj = numeric.linspace(0, x.length - 1);
	    if (typeof xj === "undefined") xj = [];

	    function dfs(j) {
	      var k;
	      if (x[j] !== 0) return;
	      x[j] = 1;

	      for (k = Ai[j]; k < Ai[j + 1]; ++k) dfs(Aj[k]);

	      xj[n] = j;
	      ++n;
	    }

	    var i, j, j0, j1, k, l, a;

	    for (i = bj.length - 1; i !== -1; --i) {
	      dfs(bj[i]);
	    }

	    xj.length = n;

	    for (i = xj.length - 1; i !== -1; --i) {
	      x[xj[i]] = 0;
	    }

	    for (i = bj.length - 1; i !== -1; --i) {
	      j = bj[i];
	      x[j] = b[j];
	    }

	    for (i = xj.length - 1; i !== -1; --i) {
	      j = xj[i];
	      j0 = Ai[j];
	      j1 = max(Ai[j + 1], j0);

	      for (k = j0; k !== j1; ++k) {
	        if (Aj[k] === j) {
	          x[j] /= Av[k];
	          break;
	        }
	      }

	      a = x[j];

	      for (k = j0; k !== j1; ++k) {
	        l = Aj[k];
	        if (l !== j) x[l] -= a * Av[k];
	      }
	    }

	    return x;
	  };

	  numeric.ccsDFS = function ccsDFS(n) {
	    this.k = Array(n);
	    this.k1 = Array(n);
	    this.j = Array(n);
	  };

	  numeric.ccsDFS.prototype.dfs = function dfs(J, Ai, Aj, x, xj, Pinv) {
	    var m = 0,
	        foo,
	        n = xj.length;
	    var k = this.k,
	        k1 = this.k1,
	        j = this.j,
	        km,
	        k11;
	    if (x[J] !== 0) return;
	    x[J] = 1;
	    j[0] = J;
	    k[0] = km = Ai[J];
	    k1[0] = k11 = Ai[J + 1];

	    while (1) {
	      if (km >= k11) {
	        xj[n] = j[m];
	        if (m === 0) return;
	        ++n;
	        --m;
	        km = k[m];
	        k11 = k1[m];
	      } else {
	        foo = Pinv[Aj[km]];

	        if (x[foo] === 0) {
	          x[foo] = 1;
	          k[m] = km;
	          ++m;
	          j[m] = foo;
	          km = Ai[foo];
	          k1[m] = k11 = Ai[foo + 1];
	        } else ++km;
	      }
	    }
	  };

	  numeric.ccsLPSolve = function ccsLPSolve(A, B, x, xj, I, Pinv, dfs) {
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2],
	        m = Ai.length - 1;
	    var Bi = B[0],
	        Bj = B[1],
	        Bv = B[2];
	    var i, i0, i1, j, j0, j1, k, l, a;
	    i0 = Bi[I];
	    i1 = Bi[I + 1];
	    xj.length = 0;

	    for (i = i0; i < i1; ++i) {
	      dfs.dfs(Pinv[Bj[i]], Ai, Aj, x, xj, Pinv);
	    }

	    for (i = xj.length - 1; i !== -1; --i) {
	      x[xj[i]] = 0;
	    }

	    for (i = i0; i !== i1; ++i) {
	      j = Pinv[Bj[i]];
	      x[j] = Bv[i];
	    }

	    for (i = xj.length - 1; i !== -1; --i) {
	      j = xj[i];
	      j0 = Ai[j];
	      j1 = Ai[j + 1];

	      for (k = j0; k < j1; ++k) {
	        if (Pinv[Aj[k]] === j) {
	          x[j] /= Av[k];
	          break;
	        }
	      }

	      a = x[j];

	      for (k = j0; k < j1; ++k) {
	        l = Pinv[Aj[k]];
	        if (l !== j) x[l] -= a * Av[k];
	      }
	    }

	    return x;
	  };

	  numeric.ccsLUP1 = function ccsLUP1(A, threshold) {
	    var m = A[0].length - 1;
	    var L = [numeric.rep([m + 1], 0), [], []],
	        U = [numeric.rep([m + 1], 0), [], []];
	    var Li = L[0],
	        Lj = L[1],
	        Lv = L[2],
	        Ui = U[0],
	        Uj = U[1],
	        Uv = U[2];
	    var x = numeric.rep([m], 0),
	        xj = numeric.rep([m], 0);
	    var i, j, k, a, e, c, d;
	    var sol = numeric.ccsLPSolve,
	        abs = Math.abs;
	    var P = numeric.linspace(0, m - 1),
	        Pinv = numeric.linspace(0, m - 1);
	    var dfs = new numeric.ccsDFS(m);

	    if (typeof threshold === "undefined") {
	      threshold = 1;
	    }

	    for (i = 0; i < m; ++i) {
	      sol(L, A, x, xj, i, Pinv, dfs);
	      a = -1;
	      e = -1;

	      for (j = xj.length - 1; j !== -1; --j) {
	        k = xj[j];
	        if (k <= i) continue;
	        c = abs(x[k]);

	        if (c > a) {
	          e = k;
	          a = c;
	        }
	      }

	      if (abs(x[i]) < threshold * a) {
	        j = P[i];
	        a = P[e];
	        P[i] = a;
	        Pinv[a] = i;
	        P[e] = j;
	        Pinv[j] = e;
	        a = x[i];
	        x[i] = x[e];
	        x[e] = a;
	      }

	      a = Li[i];
	      e = Ui[i];
	      d = x[i];
	      Lj[a] = P[i];
	      Lv[a] = 1;
	      ++a;

	      for (j = xj.length - 1; j !== -1; --j) {
	        k = xj[j];
	        c = x[k];
	        xj[j] = 0;
	        x[k] = 0;

	        if (k <= i) {
	          Uj[e] = k;
	          Uv[e] = c;
	          ++e;
	        } else {
	          Lj[a] = P[k];
	          Lv[a] = c / d;
	          ++a;
	        }
	      }

	      Li[i + 1] = a;
	      Ui[i + 1] = e;
	    }

	    for (j = Lj.length - 1; j !== -1; --j) {
	      Lj[j] = Pinv[Lj[j]];
	    }

	    return {
	      L: L,
	      U: U,
	      P: P,
	      Pinv: Pinv
	    };
	  };

	  numeric.ccsDFS0 = function ccsDFS0(n) {
	    this.k = Array(n);
	    this.k1 = Array(n);
	    this.j = Array(n);
	  };

	  numeric.ccsDFS0.prototype.dfs = function dfs(J, Ai, Aj, x, xj, Pinv, P) {
	    var m = 0,
	        foo,
	        n = xj.length;
	    var k = this.k,
	        k1 = this.k1,
	        j = this.j,
	        km,
	        k11;
	    if (x[J] !== 0) return;
	    x[J] = 1;
	    j[0] = J;
	    k[0] = km = Ai[Pinv[J]];
	    k1[0] = k11 = Ai[Pinv[J] + 1];

	    while (1) {
	      if (isNaN(km)) throw new Error("Ow!");

	      if (km >= k11) {
	        xj[n] = Pinv[j[m]];
	        if (m === 0) return;
	        ++n;
	        --m;
	        km = k[m];
	        k11 = k1[m];
	      } else {
	        foo = Aj[km];

	        if (x[foo] === 0) {
	          x[foo] = 1;
	          k[m] = km;
	          ++m;
	          j[m] = foo;
	          foo = Pinv[foo];
	          km = Ai[foo];
	          k1[m] = k11 = Ai[foo + 1];
	        } else ++km;
	      }
	    }
	  };

	  numeric.ccsLPSolve0 = function ccsLPSolve0(A, B, y, xj, I, Pinv, P, dfs) {
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2],
	        m = Ai.length - 1;
	    var Bi = B[0],
	        Bj = B[1],
	        Bv = B[2];
	    var i, i0, i1, j, j0, j1, k, l, a;
	    i0 = Bi[I];
	    i1 = Bi[I + 1];
	    xj.length = 0;

	    for (i = i0; i < i1; ++i) {
	      dfs.dfs(Bj[i], Ai, Aj, y, xj, Pinv, P);
	    }

	    for (i = xj.length - 1; i !== -1; --i) {
	      j = xj[i];
	      y[P[j]] = 0;
	    }

	    for (i = i0; i !== i1; ++i) {
	      j = Bj[i];
	      y[j] = Bv[i];
	    }

	    for (i = xj.length - 1; i !== -1; --i) {
	      j = xj[i];
	      l = P[j];
	      j0 = Ai[j];
	      j1 = Ai[j + 1];

	      for (k = j0; k < j1; ++k) {
	        if (Aj[k] === l) {
	          y[l] /= Av[k];
	          break;
	        }
	      }

	      a = y[l];

	      for (k = j0; k < j1; ++k) y[Aj[k]] -= a * Av[k];

	      y[l] = a;
	    }
	  };

	  numeric.ccsLUP0 = function ccsLUP0(A, threshold) {
	    var m = A[0].length - 1;
	    var L = [numeric.rep([m + 1], 0), [], []],
	        U = [numeric.rep([m + 1], 0), [], []];
	    var Li = L[0],
	        Lj = L[1],
	        Lv = L[2],
	        Ui = U[0],
	        Uj = U[1],
	        Uv = U[2];
	    var y = numeric.rep([m], 0),
	        xj = numeric.rep([m], 0);
	    var i, j, k, a, e, c, d;
	    var sol = numeric.ccsLPSolve0,
	        abs = Math.abs;
	    var P = numeric.linspace(0, m - 1),
	        Pinv = numeric.linspace(0, m - 1);
	    var dfs = new numeric.ccsDFS0(m);

	    if (typeof threshold === "undefined") {
	      threshold = 1;
	    }

	    for (i = 0; i < m; ++i) {
	      sol(L, A, y, xj, i, Pinv, P, dfs);
	      a = -1;
	      e = -1;

	      for (j = xj.length - 1; j !== -1; --j) {
	        k = xj[j];
	        if (k <= i) continue;
	        c = abs(y[P[k]]);

	        if (c > a) {
	          e = k;
	          a = c;
	        }
	      }

	      if (abs(y[P[i]]) < threshold * a) {
	        j = P[i];
	        a = P[e];
	        P[i] = a;
	        Pinv[a] = i;
	        P[e] = j;
	        Pinv[j] = e;
	      }

	      a = Li[i];
	      e = Ui[i];
	      d = y[P[i]];
	      Lj[a] = P[i];
	      Lv[a] = 1;
	      ++a;

	      for (j = xj.length - 1; j !== -1; --j) {
	        k = xj[j];
	        c = y[P[k]];
	        xj[j] = 0;
	        y[P[k]] = 0;

	        if (k <= i) {
	          Uj[e] = k;
	          Uv[e] = c;
	          ++e;
	        } else {
	          Lj[a] = P[k];
	          Lv[a] = c / d;
	          ++a;
	        }
	      }

	      Li[i + 1] = a;
	      Ui[i + 1] = e;
	    }

	    for (j = Lj.length - 1; j !== -1; --j) {
	      Lj[j] = Pinv[Lj[j]];
	    }

	    return {
	      L: L,
	      U: U,
	      P: P,
	      Pinv: Pinv
	    };
	  };

	  numeric.ccsLUP = numeric.ccsLUP0;

	  numeric.ccsDim = function ccsDim(A) {
	    return [numeric.sup(A[1]) + 1, A[0].length - 1];
	  };

	  numeric.ccsGetBlock = function ccsGetBlock(A, i, j) {
	    var s = numeric.ccsDim(A),
	        m = s[0],
	        n = s[1];

	    if (typeof i === "undefined") {
	      i = numeric.linspace(0, m - 1);
	    } else if (typeof i === "number") {
	      i = [i];
	    }

	    if (typeof j === "undefined") {
	      j = numeric.linspace(0, n - 1);
	    } else if (typeof j === "number") {
	      j = [j];
	    }

	    var p,
	        P = i.length,
	        q,
	        Q = j.length,
	        r,
	        jq,
	        ip;
	    var Bi = numeric.rep([n], 0),
	        Bj = [],
	        Bv = [],
	        B = [Bi, Bj, Bv];
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2];
	    var x = numeric.rep([m], 0),
	        count = 0,
	        flags = numeric.rep([m], 0);

	    for (q = 0; q < Q; ++q) {
	      jq = j[q];
	      var q0 = Ai[jq];
	      var q1 = Ai[jq + 1];

	      for (p = q0; p < q1; ++p) {
	        r = Aj[p];
	        flags[r] = 1;
	        x[r] = Av[p];
	      }

	      for (p = 0; p < P; ++p) {
	        ip = i[p];

	        if (flags[ip]) {
	          Bj[count] = p;
	          Bv[count] = x[i[p]];
	          ++count;
	        }
	      }

	      for (p = q0; p < q1; ++p) {
	        r = Aj[p];
	        flags[r] = 0;
	      }

	      Bi[q + 1] = count;
	    }

	    return B;
	  };

	  numeric.ccsDot = function ccsDot(A, B) {
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2];
	    var Bi = B[0],
	        Bj = B[1],
	        Bv = B[2];
	    var sA = numeric.ccsDim(A),
	        sB = numeric.ccsDim(B);
	    var m = sA[0],
	        n = sA[1],
	        o = sB[1];
	    var x = numeric.rep([m], 0),
	        flags = numeric.rep([m], 0),
	        xj = Array(m);
	    var Ci = numeric.rep([o], 0),
	        Cj = [],
	        Cv = [],
	        C = [Ci, Cj, Cv];
	    var i, j, k, j0, j1, i0, i1, l, p, a, b;

	    for (k = 0; k !== o; ++k) {
	      j0 = Bi[k];
	      j1 = Bi[k + 1];
	      p = 0;

	      for (j = j0; j < j1; ++j) {
	        a = Bj[j];
	        b = Bv[j];
	        i0 = Ai[a];
	        i1 = Ai[a + 1];

	        for (i = i0; i < i1; ++i) {
	          l = Aj[i];

	          if (flags[l] === 0) {
	            xj[p] = l;
	            flags[l] = 1;
	            p = p + 1;
	          }

	          x[l] = x[l] + Av[i] * b;
	        }
	      }

	      j0 = Ci[k];
	      j1 = j0 + p;
	      Ci[k + 1] = j1;

	      for (j = p - 1; j !== -1; --j) {
	        b = j0 + j;
	        i = xj[j];
	        Cj[b] = i;
	        Cv[b] = x[i];
	        flags[i] = 0;
	        x[i] = 0;
	      }

	      Ci[k + 1] = Ci[k] + p;
	    }

	    return C;
	  };

	  numeric.ccsLUPSolve = function ccsLUPSolve(LUP, B) {
	    var L = LUP.L,
	        U = LUP.U,
	        P = LUP.P;
	    var Bi = B[0];
	    var flag = false;

	    if (typeof Bi !== "object") {
	      B = [[0, B.length], numeric.linspace(0, B.length - 1), B];
	      Bi = B[0];
	      flag = true;
	    }

	    var Bj = B[1],
	        Bv = B[2];
	    var n = L[0].length - 1,
	        m = Bi.length - 1;
	    var x = numeric.rep([n], 0),
	        xj = Array(n);
	    var b = numeric.rep([n], 0),
	        bj = Array(n);
	    var Xi = numeric.rep([m + 1], 0),
	        Xj = [],
	        Xv = [];
	    var sol = numeric.ccsTSolve;
	    var i,
	        j,
	        j0,
	        j1,
	        k,
	        J,
	        N = 0;

	    for (i = 0; i < m; ++i) {
	      k = 0;
	      j0 = Bi[i];
	      j1 = Bi[i + 1];

	      for (j = j0; j < j1; ++j) {
	        J = LUP.Pinv[Bj[j]];
	        bj[k] = J;
	        b[J] = Bv[j];
	        ++k;
	      }

	      bj.length = k;
	      sol(L, b, x, bj, xj);

	      for (j = bj.length - 1; j !== -1; --j) b[bj[j]] = 0;

	      sol(U, x, b, xj, bj);
	      if (flag) return b;

	      for (j = xj.length - 1; j !== -1; --j) x[xj[j]] = 0;

	      for (j = bj.length - 1; j !== -1; --j) {
	        J = bj[j];
	        Xj[N] = J;
	        Xv[N] = b[J];
	        b[J] = 0;
	        ++N;
	      }

	      Xi[i + 1] = N;
	    }

	    return [Xi, Xj, Xv];
	  };

	  numeric.ccsbinop = function ccsbinop(body, setup) {
	    if (typeof setup === "undefined") setup = '';
	    return Function('X', 'Y', 'var Xi = X[0], Xj = X[1], Xv = X[2];\n' + 'var Yi = Y[0], Yj = Y[1], Yv = Y[2];\n' + 'var n = Xi.length-1,m = Math.max(numeric.sup(Xj),numeric.sup(Yj))+1;\n' + 'var Zi = numeric.rep([n+1],0), Zj = [], Zv = [];\n' + 'var x = numeric.rep([m],0),y = numeric.rep([m],0);\n' + 'var xk,yk,zk;\n' + 'var i,j,j0,j1,k,p=0;\n' + setup + 'for(i=0;i<n;++i) {\n' + '  j0 = Xi[i]; j1 = Xi[i+1];\n' + '  for(j=j0;j!==j1;++j) {\n' + '    k = Xj[j];\n' + '    x[k] = 1;\n' + '    Zj[p] = k;\n' + '    ++p;\n' + '  }\n' + '  j0 = Yi[i]; j1 = Yi[i+1];\n' + '  for(j=j0;j!==j1;++j) {\n' + '    k = Yj[j];\n' + '    y[k] = Yv[j];\n' + '    if(x[k] === 0) {\n' + '      Zj[p] = k;\n' + '      ++p;\n' + '    }\n' + '  }\n' + '  Zi[i+1] = p;\n' + '  j0 = Xi[i]; j1 = Xi[i+1];\n' + '  for(j=j0;j!==j1;++j) x[Xj[j]] = Xv[j];\n' + '  j0 = Zi[i]; j1 = Zi[i+1];\n' + '  for(j=j0;j!==j1;++j) {\n' + '    k = Zj[j];\n' + '    xk = x[k];\n' + '    yk = y[k];\n' + body + '\n' + '    Zv[j] = zk;\n' + '  }\n' + '  j0 = Xi[i]; j1 = Xi[i+1];\n' + '  for(j=j0;j!==j1;++j) x[Xj[j]] = 0;\n' + '  j0 = Yi[i]; j1 = Yi[i+1];\n' + '  for(j=j0;j!==j1;++j) y[Yj[j]] = 0;\n' + '}\n' + 'return [Zi,Zj,Zv];');
	  };

	  (function () {
	    var k, A, B, C;

	    for (k in numeric.ops2) {
	      if (isFinite(eval('1' + numeric.ops2[k] + '0'))) A = '[Y[0],Y[1],numeric.' + k + '(X,Y[2])]';else A = 'NaN';
	      if (isFinite(eval('0' + numeric.ops2[k] + '1'))) B = '[X[0],X[1],numeric.' + k + '(X[2],Y)]';else B = 'NaN';
	      if (isFinite(eval('1' + numeric.ops2[k] + '0')) && isFinite(eval('0' + numeric.ops2[k] + '1'))) C = 'numeric.ccs' + k + 'MM(X,Y)';else C = 'NaN';
	      numeric['ccs' + k + 'MM'] = numeric.ccsbinop('zk = xk ' + numeric.ops2[k] + 'yk;');
	      numeric['ccs' + k] = Function('X', 'Y', 'if(typeof X === "number") return ' + A + ';\n' + 'if(typeof Y === "number") return ' + B + ';\n' + 'return ' + C + ';\n');
	    }
	  })();

	  numeric.ccsScatter = function ccsScatter(A) {
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2];
	    var n = numeric.sup(Aj) + 1,
	        m = Ai.length;
	    var Ri = numeric.rep([n], 0),
	        Rj = Array(m),
	        Rv = Array(m);
	    var counts = numeric.rep([n], 0),
	        i;

	    for (i = 0; i < m; ++i) counts[Aj[i]]++;

	    for (i = 0; i < n; ++i) Ri[i + 1] = Ri[i] + counts[i];

	    var ptr = Ri.slice(0),
	        k,
	        Aii;

	    for (i = 0; i < m; ++i) {
	      Aii = Aj[i];
	      k = ptr[Aii];
	      Rj[k] = Ai[i];
	      Rv[k] = Av[i];
	      ptr[Aii] = ptr[Aii] + 1;
	    }

	    return [Ri, Rj, Rv];
	  };

	  numeric.ccsGather = function ccsGather(A) {
	    var Ai = A[0],
	        Aj = A[1],
	        Av = A[2];
	    var n = Ai.length - 1,
	        m = Aj.length;
	    var Ri = Array(m),
	        Rj = Array(m),
	        Rv = Array(m);
	    var i, j, j0, j1, p;
	    p = 0;

	    for (i = 0; i < n; ++i) {
	      j0 = Ai[i];
	      j1 = Ai[i + 1];

	      for (j = j0; j !== j1; ++j) {
	        Rj[p] = i;
	        Ri[p] = Aj[j];
	        Rv[p] = Av[j];
	        ++p;
	      }
	    }

	    return [Ri, Rj, Rv];
	  }; // The following sparse linear algebra routines are deprecated.


	  numeric.sdim = function dim(A, ret, k) {
	    if (typeof ret === "undefined") {
	      ret = [];
	    }

	    if (typeof A !== "object") return ret;

	    if (typeof k === "undefined") {
	      k = 0;
	    }

	    if (!(k in ret)) {
	      ret[k] = 0;
	    }

	    if (A.length > ret[k]) ret[k] = A.length;
	    var i;

	    for (i in A) {
	      if (A.hasOwnProperty(i)) dim(A[i], ret, k + 1);
	    }

	    return ret;
	  };

	  numeric.sclone = function clone(A, k, n) {
	    if (typeof k === "undefined") {
	      k = 0;
	    }

	    if (typeof n === "undefined") {
	      n = numeric.sdim(A).length;
	    }

	    var i,
	        ret = Array(A.length);

	    if (k === n - 1) {
	      for (i in A) {
	        if (A.hasOwnProperty(i)) ret[i] = A[i];
	      }

	      return ret;
	    }

	    for (i in A) {
	      if (A.hasOwnProperty(i)) ret[i] = clone(A[i], k + 1, n);
	    }

	    return ret;
	  };

	  numeric.sdiag = function diag(d) {
	    var n = d.length,
	        i,
	        ret = Array(n),
	        i1;

	    for (i = n - 1; i >= 1; i -= 2) {
	      i1 = i - 1;
	      ret[i] = [];
	      ret[i][i] = d[i];
	      ret[i1] = [];
	      ret[i1][i1] = d[i1];
	    }

	    if (i === 0) {
	      ret[0] = [];
	      ret[0][0] = d[i];
	    }

	    return ret;
	  };

	  numeric.sidentity = function identity(n) {
	    return numeric.sdiag(numeric.rep([n], 1));
	  };

	  numeric.stranspose = function transpose(A) {
	    var ret = [],
	        n = A.length,
	        i,
	        j,
	        Ai;

	    for (i in A) {
	      if (!A.hasOwnProperty(i)) continue;
	      Ai = A[i];

	      for (j in Ai) {
	        if (!Ai.hasOwnProperty(j)) continue;

	        if (typeof ret[j] !== "object") {
	          ret[j] = [];
	        }

	        ret[j][i] = Ai[j];
	      }
	    }

	    return ret;
	  };

	  numeric.sLUP = function LUP(A, tol) {
	    throw new Error("The function numeric.sLUP had a bug in it and has been removed. Please use the new numeric.ccsLUP function instead.");
	  };

	  numeric.sdotMM = function dotMM(A, B) {
	    var p = A.length,
	        q = B.length,
	        BT = numeric.stranspose(B),
	        r = BT.length,
	        Ai,
	        BTk;
	    var i, j, k, accum;
	    var ret = Array(p),
	        reti;

	    for (i = p - 1; i >= 0; i--) {
	      reti = [];
	      Ai = A[i];

	      for (k = r - 1; k >= 0; k--) {
	        accum = 0;
	        BTk = BT[k];

	        for (j in Ai) {
	          if (!Ai.hasOwnProperty(j)) continue;

	          if (j in BTk) {
	            accum += Ai[j] * BTk[j];
	          }
	        }

	        if (accum) reti[k] = accum;
	      }

	      ret[i] = reti;
	    }

	    return ret;
	  };

	  numeric.sdotMV = function dotMV(A, x) {
	    var p = A.length,
	        Ai,
	        i,
	        j;
	    var ret = Array(p),
	        accum;

	    for (i = p - 1; i >= 0; i--) {
	      Ai = A[i];
	      accum = 0;

	      for (j in Ai) {
	        if (!Ai.hasOwnProperty(j)) continue;
	        if (x[j]) accum += Ai[j] * x[j];
	      }

	      if (accum) ret[i] = accum;
	    }

	    return ret;
	  };

	  numeric.sdotVM = function dotMV(x, A) {
	    var i, j, Ai, alpha;
	    var ret = [];

	    for (i in x) {
	      if (!x.hasOwnProperty(i)) continue;
	      Ai = A[i];
	      alpha = x[i];

	      for (j in Ai) {
	        if (!Ai.hasOwnProperty(j)) continue;

	        if (!ret[j]) {
	          ret[j] = 0;
	        }

	        ret[j] += alpha * Ai[j];
	      }
	    }

	    return ret;
	  };

	  numeric.sdotVV = function dotVV(x, y) {
	    var i,
	        ret = 0;

	    for (i in x) {
	      if (x[i] && y[i]) ret += x[i] * y[i];
	    }

	    return ret;
	  };

	  numeric.sdot = function dot(A, B) {
	    var m = numeric.sdim(A).length,
	        n = numeric.sdim(B).length;
	    var k = m * 1000 + n;

	    switch (k) {
	      case 0:
	        return A * B;

	      case 1001:
	        return numeric.sdotVV(A, B);

	      case 2001:
	        return numeric.sdotMV(A, B);

	      case 1002:
	        return numeric.sdotVM(A, B);

	      case 2002:
	        return numeric.sdotMM(A, B);

	      default:
	        throw new Error('numeric.sdot not implemented for tensors of order ' + m + ' and ' + n);
	    }
	  };

	  numeric.sscatter = function scatter(V) {
	    var n = V[0].length,
	        Vij,
	        i,
	        j,
	        m = V.length,
	        A = [],
	        Aj;

	    for (i = n - 1; i >= 0; --i) {
	      if (!V[m - 1][i]) continue;
	      Aj = A;

	      for (j = 0; j < m - 2; j++) {
	        Vij = V[j][i];
	        if (!Aj[Vij]) Aj[Vij] = [];
	        Aj = Aj[Vij];
	      }

	      Aj[V[j][i]] = V[j + 1][i];
	    }

	    return A;
	  };

	  numeric.sgather = function gather(A, ret, k) {
	    if (typeof ret === "undefined") ret = [];
	    if (typeof k === "undefined") k = [];
	    var n, i, Ai;
	    n = k.length;

	    for (i in A) {
	      if (A.hasOwnProperty(i)) {
	        k[n] = parseInt(i);
	        Ai = A[i];

	        if (typeof Ai === "number") {
	          if (Ai) {
	            if (ret.length === 0) {
	              for (i = n + 1; i >= 0; --i) ret[i] = [];
	            }

	            for (i = n; i >= 0; --i) ret[i].push(k[i]);

	            ret[n + 1].push(Ai);
	          }
	        } else gather(Ai, ret, k);
	      }
	    }

	    if (k.length > n) k.pop();
	    return ret;
	  }; // 6. Coordinate matrices


	  numeric.cLU = function LU(A) {
	    var I = A[0],
	        J = A[1],
	        V = A[2];
	    var p = I.length,
	        m = 0,
	        i,
	        j,
	        k,
	        a,
	        b,
	        c;

	    for (i = 0; i < p; i++) if (I[i] > m) m = I[i];

	    m++;
	    var L = Array(m),
	        U = Array(m),
	        left = numeric.rep([m], Infinity),
	        right = numeric.rep([m], -Infinity);
	    var Ui, Uj, alpha;

	    for (k = 0; k < p; k++) {
	      i = I[k];
	      j = J[k];
	      if (j < left[i]) left[i] = j;
	      if (j > right[i]) right[i] = j;
	    }

	    for (i = 0; i < m - 1; i++) {
	      if (right[i] > right[i + 1]) right[i + 1] = right[i];
	    }

	    for (i = m - 1; i >= 1; i--) {
	      if (left[i] < left[i - 1]) left[i - 1] = left[i];
	    }

	    var countL = 0,
	        countU = 0;

	    for (i = 0; i < m; i++) {
	      U[i] = numeric.rep([right[i] - left[i] + 1], 0);
	      L[i] = numeric.rep([i - left[i]], 0);
	      countL += i - left[i] + 1;
	      countU += right[i] - i + 1;
	    }

	    for (k = 0; k < p; k++) {
	      i = I[k];
	      U[i][J[k] - left[i]] = V[k];
	    }

	    for (i = 0; i < m - 1; i++) {
	      a = i - left[i];
	      Ui = U[i];

	      for (j = i + 1; left[j] <= i && j < m; j++) {
	        b = i - left[j];
	        c = right[i] - i;
	        Uj = U[j];
	        alpha = Uj[b] / Ui[a];

	        if (alpha) {
	          for (k = 1; k <= c; k++) {
	            Uj[k + b] -= alpha * Ui[k + a];
	          }

	          L[j][i - left[j]] = alpha;
	        }
	      }
	    }

	    var Ui = [],
	        Uj = [],
	        Uv = [],
	        Li = [],
	        Lj = [],
	        Lv = [];
	    var p, q, foo;
	    p = 0;
	    q = 0;

	    for (i = 0; i < m; i++) {
	      a = left[i];
	      b = right[i];
	      foo = U[i];

	      for (j = i; j <= b; j++) {
	        if (foo[j - a]) {
	          Ui[p] = i;
	          Uj[p] = j;
	          Uv[p] = foo[j - a];
	          p++;
	        }
	      }

	      foo = L[i];

	      for (j = a; j < i; j++) {
	        if (foo[j - a]) {
	          Li[q] = i;
	          Lj[q] = j;
	          Lv[q] = foo[j - a];
	          q++;
	        }
	      }

	      Li[q] = i;
	      Lj[q] = i;
	      Lv[q] = 1;
	      q++;
	    }

	    return {
	      U: [Ui, Uj, Uv],
	      L: [Li, Lj, Lv]
	    };
	  };

	  numeric.cLUsolve = function LUsolve(lu, b) {
	    var L = lu.L,
	        U = lu.U,
	        ret = numeric.clone(b);
	    var Li = L[0],
	        Lj = L[1],
	        Lv = L[2];
	    var Ui = U[0],
	        Uj = U[1],
	        Uv = U[2];
	    var p = Ui.length,
	        q = Li.length;
	    var m = ret.length,
	        i,
	        k;
	    k = 0;

	    for (i = 0; i < m; i++) {
	      while (Lj[k] < i) {
	        ret[i] -= Lv[k] * ret[Lj[k]];
	        k++;
	      }

	      k++;
	    }

	    k = p - 1;

	    for (i = m - 1; i >= 0; i--) {
	      while (Uj[k] > i) {
	        ret[i] -= Uv[k] * ret[Uj[k]];
	        k--;
	      }

	      ret[i] /= Uv[k];
	      k--;
	    }

	    return ret;
	  };

	  numeric.cgrid = function grid(n, shape) {
	    if (typeof n === "number") n = [n, n];
	    var ret = numeric.rep(n, -1);
	    var i, j, count;

	    if (typeof shape !== "function") {
	      switch (shape) {
	        case 'L':
	          shape = function (i, j) {
	            return i >= n[0] / 2 || j < n[1] / 2;
	          };

	          break;

	        default:
	          shape = function (i, j) {
	            return true;
	          };

	          break;
	      }
	    }

	    count = 0;

	    for (i = 1; i < n[0] - 1; i++) for (j = 1; j < n[1] - 1; j++) if (shape(i, j)) {
	      ret[i][j] = count;
	      count++;
	    }

	    return ret;
	  };

	  numeric.cdelsq = function delsq(g) {
	    var dir = [[-1, 0], [0, -1], [0, 1], [1, 0]];
	    var s = numeric.dim(g),
	        m = s[0],
	        n = s[1],
	        i,
	        j,
	        k,
	        p,
	        q;
	    var Li = [],
	        Lj = [],
	        Lv = [];

	    for (i = 1; i < m - 1; i++) for (j = 1; j < n - 1; j++) {
	      if (g[i][j] < 0) continue;

	      for (k = 0; k < 4; k++) {
	        p = i + dir[k][0];
	        q = j + dir[k][1];
	        if (g[p][q] < 0) continue;
	        Li.push(g[i][j]);
	        Lj.push(g[p][q]);
	        Lv.push(-1);
	      }

	      Li.push(g[i][j]);
	      Lj.push(g[i][j]);
	      Lv.push(4);
	    }

	    return [Li, Lj, Lv];
	  };

	  numeric.cdotMV = function dotMV(A, x) {
	    var ret,
	        Ai = A[0],
	        Aj = A[1],
	        Av = A[2],
	        k,
	        p = Ai.length,
	        N;
	    N = 0;

	    for (k = 0; k < p; k++) {
	      if (Ai[k] > N) N = Ai[k];
	    }

	    N++;
	    ret = numeric.rep([N], 0);

	    for (k = 0; k < p; k++) {
	      ret[Ai[k]] += Av[k] * x[Aj[k]];
	    }

	    return ret;
	  }; // 7. Splines


	  numeric.Spline = function Spline(x, yl, yr, kl, kr) {
	    this.x = x;
	    this.yl = yl;
	    this.yr = yr;
	    this.kl = kl;
	    this.kr = kr;
	  };

	  numeric.Spline.prototype._at = function _at(x1, p) {
	    var x = this.x;
	    var yl = this.yl;
	    var yr = this.yr;
	    var kl = this.kl;
	    var kr = this.kr;
	    var x1, a, b, t;
	    var add = numeric.add,
	        sub = numeric.sub,
	        mul = numeric.mul;
	    a = sub(mul(kl[p], x[p + 1] - x[p]), sub(yr[p + 1], yl[p]));
	    b = add(mul(kr[p + 1], x[p] - x[p + 1]), sub(yr[p + 1], yl[p]));
	    t = (x1 - x[p]) / (x[p + 1] - x[p]);
	    var s = t * (1 - t);
	    return add(add(add(mul(1 - t, yl[p]), mul(t, yr[p + 1])), mul(a, s * (1 - t))), mul(b, s * t));
	  };

	  numeric.Spline.prototype.at = function at(x0) {
	    if (typeof x0 === "number") {
	      var x = this.x;
	      var n = x.length;
	      var p,
	          q,
	          mid,
	          floor = Math.floor;
	      p = 0;
	      q = n - 1;

	      while (q - p > 1) {
	        mid = floor((p + q) / 2);
	        if (x[mid] <= x0) p = mid;else q = mid;
	      }

	      return this._at(x0, p);
	    }

	    var n = x0.length,
	        i,
	        ret = Array(n);

	    for (i = n - 1; i !== -1; --i) ret[i] = this.at(x0[i]);

	    return ret;
	  };

	  numeric.Spline.prototype.diff = function diff() {
	    var x = this.x;
	    var yl = this.yl;
	    var yr = this.yr;
	    var kl = this.kl;
	    var kr = this.kr;
	    var n = yl.length;
	    var i, dx, dy;
	    var zl = kl,
	        zr = kr,
	        pl = Array(n),
	        pr = Array(n);
	    var add = numeric.add,
	        mul = numeric.mul,
	        div = numeric.div,
	        sub = numeric.sub;

	    for (i = n - 1; i !== -1; --i) {
	      dx = x[i + 1] - x[i];
	      dy = sub(yr[i + 1], yl[i]);
	      pl[i] = div(add(mul(dy, 6), mul(kl[i], -4 * dx), mul(kr[i + 1], -2 * dx)), dx * dx);
	      pr[i + 1] = div(add(mul(dy, -6), mul(kl[i], 2 * dx), mul(kr[i + 1], 4 * dx)), dx * dx);
	    }

	    return new numeric.Spline(x, zl, zr, pl, pr);
	  };

	  numeric.Spline.prototype.roots = function roots() {
	    function sqr(x) {
	      return x * x;
	    }

	    var ret = [];
	    var x = this.x,
	        yl = this.yl,
	        yr = this.yr,
	        kl = this.kl,
	        kr = this.kr;

	    if (typeof yl[0] === "number") {
	      yl = [yl];
	      yr = [yr];
	      kl = [kl];
	      kr = [kr];
	    }

	    var m = yl.length,
	        n = x.length - 1,
	        i,
	        j,
	        k;
	    var ai,
	        bi,
	        ci,
	        di,
	        ret = Array(m),
	        ri,
	        k0,
	        k1,
	        y0,
	        y1,
	        A,
	        B,
	        D,
	        dx,
	        cx,
	        stops,
	        z0,
	        z1,
	        zm,
	        t0,
	        t1,
	        tm;
	    var sqrt = Math.sqrt;

	    for (i = 0; i !== m; ++i) {
	      ai = yl[i];
	      bi = yr[i];
	      ci = kl[i];
	      di = kr[i];
	      ri = [];

	      for (j = 0; j !== n; j++) {
	        if (j > 0 && bi[j] * ai[j] < 0) ri.push(x[j]);
	        dx = x[j + 1] - x[j];
	        cx = x[j];
	        y0 = ai[j];
	        y1 = bi[j + 1];
	        k0 = ci[j] / dx;
	        k1 = di[j + 1] / dx;
	        D = sqr(k0 - k1 + 3 * (y0 - y1)) + 12 * k1 * y0;
	        A = k1 + 3 * y0 + 2 * k0 - 3 * y1;
	        B = 3 * (k1 + k0 + 2 * (y0 - y1));

	        if (D <= 0) {
	          z0 = A / B;
	          if (z0 > x[j] && z0 < x[j + 1]) stops = [x[j], z0, x[j + 1]];else stops = [x[j], x[j + 1]];
	        } else {
	          z0 = (A - sqrt(D)) / B;
	          z1 = (A + sqrt(D)) / B;
	          stops = [x[j]];
	          if (z0 > x[j] && z0 < x[j + 1]) stops.push(z0);
	          if (z1 > x[j] && z1 < x[j + 1]) stops.push(z1);
	          stops.push(x[j + 1]);
	        }

	        t0 = stops[0];
	        z0 = this._at(t0, j);

	        for (k = 0; k < stops.length - 1; k++) {
	          t1 = stops[k + 1];
	          z1 = this._at(t1, j);

	          if (z0 === 0) {
	            ri.push(t0);
	            t0 = t1;
	            z0 = z1;
	            continue;
	          }

	          if (z1 === 0 || z0 * z1 > 0) {
	            t0 = t1;
	            z0 = z1;
	            continue;
	          }

	          var side = 0;

	          while (1) {
	            tm = (z0 * t1 - z1 * t0) / (z0 - z1);

	            if (tm <= t0 || tm >= t1) {
	              break;
	            }

	            zm = this._at(tm, j);

	            if (zm * z1 > 0) {
	              t1 = tm;
	              z1 = zm;
	              if (side === -1) z0 *= 0.5;
	              side = -1;
	            } else if (zm * z0 > 0) {
	              t0 = tm;
	              z0 = zm;
	              if (side === 1) z1 *= 0.5;
	              side = 1;
	            } else break;
	          }

	          ri.push(tm);
	          t0 = stops[k + 1];
	          z0 = this._at(t0, j);
	        }

	        if (z1 === 0) ri.push(t1);
	      }

	      ret[i] = ri;
	    }

	    if (typeof this.yl[0] === "number") return ret[0];
	    return ret;
	  };

	  numeric.spline = function spline(x, y, k1, kn) {
	    var n = x.length,
	        b = [],
	        dx = [],
	        dy = [];
	    var i;
	    var sub = numeric.sub,
	        mul = numeric.mul,
	        add = numeric.add;

	    for (i = n - 2; i >= 0; i--) {
	      dx[i] = x[i + 1] - x[i];
	      dy[i] = sub(y[i + 1], y[i]);
	    }

	    if (typeof k1 === "string" || typeof kn === "string") {
	      k1 = kn = "periodic";
	    } // Build sparse tridiagonal system


	    var T = [[], [], []];

	    switch (typeof k1) {
	      case "undefined":
	        b[0] = mul(3 / (dx[0] * dx[0]), dy[0]);
	        T[0].push(0, 0);
	        T[1].push(0, 1);
	        T[2].push(2 / dx[0], 1 / dx[0]);
	        break;

	      case "string":
	        b[0] = add(mul(3 / (dx[n - 2] * dx[n - 2]), dy[n - 2]), mul(3 / (dx[0] * dx[0]), dy[0]));
	        T[0].push(0, 0, 0);
	        T[1].push(n - 2, 0, 1);
	        T[2].push(1 / dx[n - 2], 2 / dx[n - 2] + 2 / dx[0], 1 / dx[0]);
	        break;

	      default:
	        b[0] = k1;
	        T[0].push(0);
	        T[1].push(0);
	        T[2].push(1);
	        break;
	    }

	    for (i = 1; i < n - 1; i++) {
	      b[i] = add(mul(3 / (dx[i - 1] * dx[i - 1]), dy[i - 1]), mul(3 / (dx[i] * dx[i]), dy[i]));
	      T[0].push(i, i, i);
	      T[1].push(i - 1, i, i + 1);
	      T[2].push(1 / dx[i - 1], 2 / dx[i - 1] + 2 / dx[i], 1 / dx[i]);
	    }

	    switch (typeof kn) {
	      case "undefined":
	        b[n - 1] = mul(3 / (dx[n - 2] * dx[n - 2]), dy[n - 2]);
	        T[0].push(n - 1, n - 1);
	        T[1].push(n - 2, n - 1);
	        T[2].push(1 / dx[n - 2], 2 / dx[n - 2]);
	        break;

	      case "string":
	        T[1][T[1].length - 1] = 0;
	        break;

	      default:
	        b[n - 1] = kn;
	        T[0].push(n - 1);
	        T[1].push(n - 1);
	        T[2].push(1);
	        break;
	    }

	    if (typeof b[0] !== "number") b = numeric.transpose(b);else b = [b];
	    var k = Array(b.length);

	    if (typeof k1 === "string") {
	      for (i = k.length - 1; i !== -1; --i) {
	        k[i] = numeric.ccsLUPSolve(numeric.ccsLUP(numeric.ccsScatter(T)), b[i]);
	        k[i][n - 1] = k[i][0];
	      }
	    } else {
	      for (i = k.length - 1; i !== -1; --i) {
	        k[i] = numeric.cLUsolve(numeric.cLU(T), b[i]);
	      }
	    }

	    if (typeof y[0] === "number") k = k[0];else k = numeric.transpose(k);
	    return new numeric.Spline(x, y, y, k, k);
	  }; // 8. FFT


	  numeric.fftpow2 = function fftpow2(x, y) {
	    var n = x.length;
	    if (n === 1) return;
	    var cos = Math.cos,
	        sin = Math.sin,
	        i,
	        j;
	    var xe = Array(n / 2),
	        ye = Array(n / 2),
	        xo = Array(n / 2),
	        yo = Array(n / 2);
	    j = n / 2;

	    for (i = n - 1; i !== -1; --i) {
	      --j;
	      xo[j] = x[i];
	      yo[j] = y[i];
	      --i;
	      xe[j] = x[i];
	      ye[j] = y[i];
	    }

	    fftpow2(xe, ye);
	    fftpow2(xo, yo);
	    j = n / 2;
	    var t,
	        k = -6.2831853071795864769252867665590057683943387987502116419 / n,
	        ci,
	        si;

	    for (i = n - 1; i !== -1; --i) {
	      --j;
	      if (j === -1) j = n / 2 - 1;
	      t = k * i;
	      ci = cos(t);
	      si = sin(t);
	      x[i] = xe[j] + ci * xo[j] - si * yo[j];
	      y[i] = ye[j] + ci * yo[j] + si * xo[j];
	    }
	  };

	  numeric._ifftpow2 = function _ifftpow2(x, y) {
	    var n = x.length;
	    if (n === 1) return;
	    var cos = Math.cos,
	        sin = Math.sin,
	        i,
	        j;
	    var xe = Array(n / 2),
	        ye = Array(n / 2),
	        xo = Array(n / 2),
	        yo = Array(n / 2);
	    j = n / 2;

	    for (i = n - 1; i !== -1; --i) {
	      --j;
	      xo[j] = x[i];
	      yo[j] = y[i];
	      --i;
	      xe[j] = x[i];
	      ye[j] = y[i];
	    }

	    _ifftpow2(xe, ye);

	    _ifftpow2(xo, yo);

	    j = n / 2;
	    var t,
	        k = 6.2831853071795864769252867665590057683943387987502116419 / n,
	        ci,
	        si;

	    for (i = n - 1; i !== -1; --i) {
	      --j;
	      if (j === -1) j = n / 2 - 1;
	      t = k * i;
	      ci = cos(t);
	      si = sin(t);
	      x[i] = xe[j] + ci * xo[j] - si * yo[j];
	      y[i] = ye[j] + ci * yo[j] + si * xo[j];
	    }
	  };

	  numeric.ifftpow2 = function ifftpow2(x, y) {
	    numeric._ifftpow2(x, y);

	    numeric.diveq(x, x.length);
	    numeric.diveq(y, y.length);
	  };

	  numeric.convpow2 = function convpow2(ax, ay, bx, by) {
	    numeric.fftpow2(ax, ay);
	    numeric.fftpow2(bx, by);
	    var i,
	        n = ax.length,
	        axi,
	        bxi,
	        ayi,
	        byi;

	    for (i = n - 1; i !== -1; --i) {
	      axi = ax[i];
	      ayi = ay[i];
	      bxi = bx[i];
	      byi = by[i];
	      ax[i] = axi * bxi - ayi * byi;
	      ay[i] = axi * byi + ayi * bxi;
	    }

	    numeric.ifftpow2(ax, ay);
	  };

	  numeric.T.prototype.fft = function fft() {
	    var x = this.x,
	        y = this.y;
	    var n = x.length,
	        log = Math.log,
	        log2 = log(2),
	        p = Math.ceil(log(2 * n - 1) / log2),
	        m = Math.pow(2, p);
	    var cx = numeric.rep([m], 0),
	        cy = numeric.rep([m], 0),
	        cos = Math.cos,
	        sin = Math.sin;
	    var k,
	        c = -3.141592653589793238462643383279502884197169399375105820 / n,
	        t;
	    var a = numeric.rep([m], 0),
	        b = numeric.rep([m], 0);

	    for (k = 0; k < n; k++) a[k] = x[k];

	    if (typeof y !== "undefined") for (k = 0; k < n; k++) b[k] = y[k];
	    cx[0] = 1;

	    for (k = 1; k <= m / 2; k++) {
	      t = c * k * k;
	      cx[k] = cos(t);
	      cy[k] = sin(t);
	      cx[m - k] = cos(t);
	      cy[m - k] = sin(t);
	    }

	    var X = new numeric.T(a, b),
	        Y = new numeric.T(cx, cy);
	    X = X.mul(Y);
	    numeric.convpow2(X.x, X.y, numeric.clone(Y.x), numeric.neg(Y.y));
	    X = X.mul(Y);
	    X.x.length = n;
	    X.y.length = n;
	    return X;
	  };

	  numeric.T.prototype.ifft = function ifft() {
	    var x = this.x,
	        y = this.y;
	    var n = x.length,
	        log = Math.log,
	        log2 = log(2),
	        p = Math.ceil(log(2 * n - 1) / log2),
	        m = Math.pow(2, p);
	    var cx = numeric.rep([m], 0),
	        cy = numeric.rep([m], 0),
	        cos = Math.cos,
	        sin = Math.sin;
	    var k,
	        c = 3.141592653589793238462643383279502884197169399375105820 / n,
	        t;
	    var a = numeric.rep([m], 0),
	        b = numeric.rep([m], 0);

	    for (k = 0; k < n; k++) a[k] = x[k];

	    if (typeof y !== "undefined") for (k = 0; k < n; k++) b[k] = y[k];
	    cx[0] = 1;

	    for (k = 1; k <= m / 2; k++) {
	      t = c * k * k;
	      cx[k] = cos(t);
	      cy[k] = sin(t);
	      cx[m - k] = cos(t);
	      cy[m - k] = sin(t);
	    }

	    var X = new numeric.T(a, b),
	        Y = new numeric.T(cx, cy);
	    X = X.mul(Y);
	    numeric.convpow2(X.x, X.y, numeric.clone(Y.x), numeric.neg(Y.y));
	    X = X.mul(Y);
	    X.x.length = n;
	    X.y.length = n;
	    return X.div(n);
	  }; //9. Unconstrained optimization


	  numeric.gradient = function gradient(f, x) {
	    var n = x.length;
	    var f0 = f(x);
	    if (isNaN(f0)) throw new Error('gradient: f(x) is a NaN!');
	    var max = Math.max;
	    var i,
	        x0 = numeric.clone(x),
	        f1,
	        f2,
	        J = Array(n);
	    var div = numeric.div,
	        sub = numeric.sub,
	        errest,
	        max = Math.max,
	        eps = 1e-3,
	        abs = Math.abs,
	        min = Math.min;
	    var t0,
	        t1,
	        t2,
	        it = 0,
	        d1,
	        d2,
	        N;

	    for (i = 0; i < n; i++) {
	      var h = max(1e-6 * f0, 1e-8);

	      while (1) {
	        ++it;

	        if (it > 20) {
	          throw new Error("Numerical gradient fails");
	        }

	        x0[i] = x[i] + h;
	        f1 = f(x0);
	        x0[i] = x[i] - h;
	        f2 = f(x0);
	        x0[i] = x[i];

	        if (isNaN(f1) || isNaN(f2)) {
	          h /= 16;
	          continue;
	        }

	        J[i] = (f1 - f2) / (2 * h);
	        t0 = x[i] - h;
	        t1 = x[i];
	        t2 = x[i] + h;
	        d1 = (f1 - f0) / h;
	        d2 = (f0 - f2) / h;
	        N = max(abs(J[i]), abs(f0), abs(f1), abs(f2), abs(t0), abs(t1), abs(t2), 1e-8);
	        errest = min(max(abs(d1 - J[i]), abs(d2 - J[i]), abs(d1 - d2)) / N, h / N);

	        if (errest > eps) {
	          h /= 16;
	        } else break;
	      }
	    }

	    return J;
	  };

	  numeric.uncmin = function uncmin(f, x0, tol, gradient, maxit, callback, options) {
	    var grad = numeric.gradient;

	    if (typeof options === "undefined") {
	      options = {};
	    }

	    if (typeof tol === "undefined") {
	      tol = 1e-8;
	    }

	    if (typeof gradient === "undefined") {
	      gradient = function (x) {
	        return grad(f, x);
	      };
	    }

	    if (typeof maxit === "undefined") maxit = 1000;
	    x0 = numeric.clone(x0);
	    var n = x0.length;
	    var f0 = f(x0),
	        f1,
	        df0;
	    if (isNaN(f0)) throw new Error('uncmin: f(x0) is a NaN!');
	    var max = Math.max,
	        norm2 = numeric.norm2;
	    tol = max(tol, numeric.epsilon);
	    var step,
	        g0,
	        g1,
	        H1 = options.Hinv || numeric.identity(n);
	    var dot = numeric.dot,
	        inv = numeric.inv,
	        sub = numeric.sub,
	        add = numeric.add,
	        ten = numeric.tensor,
	        div = numeric.div,
	        mul = numeric.mul;
	    var all = numeric.all,
	        isfinite = numeric.isFinite,
	        neg = numeric.neg;
	    var it = 0,
	        s,
	        x1,
	        y,
	        Hy,
	        ys,
	        t,
	        nstep;
	    var msg = "";
	    g0 = gradient(x0);

	    while (it < maxit) {
	      if (typeof callback === "function") {
	        if (callback(it, x0, f0, g0, H1)) {
	          msg = "Callback returned true";
	          break;
	        }
	      }

	      if (!all(isfinite(g0))) {
	        msg = "Gradient has Infinity or NaN";
	        break;
	      }

	      step = neg(dot(H1, g0));

	      if (!all(isfinite(step))) {
	        msg = "Search direction has Infinity or NaN";
	        break;
	      }

	      nstep = norm2(step);

	      if (nstep < tol) {
	        msg = "Newton step smaller than tol";
	        break;
	      }

	      t = 1;
	      df0 = dot(g0, step); // line search

	      x1 = x0;

	      while (it < maxit) {
	        if (t * nstep < tol) {
	          break;
	        }

	        s = mul(step, t);
	        x1 = add(x0, s);
	        f1 = f(x1);

	        if (f1 - f0 >= 0.1 * t * df0 || isNaN(f1)) {
	          t *= 0.5;
	          ++it;
	          continue;
	        }

	        break;
	      }

	      if (t * nstep < tol) {
	        msg = "Line search step size smaller than tol";
	        break;
	      }

	      if (it === maxit) {
	        msg = "maxit reached during line search";
	        break;
	      }

	      g1 = gradient(x1);
	      y = sub(g1, g0);
	      ys = dot(y, s);
	      Hy = dot(H1, y);
	      H1 = sub(add(H1, mul((ys + dot(y, Hy)) / (ys * ys), ten(s, s))), div(add(ten(Hy, s), ten(s, Hy)), ys));
	      x0 = x1;
	      f0 = f1;
	      g0 = g1;
	      ++it;
	    }

	    return {
	      solution: x0,
	      f: f0,
	      gradient: g0,
	      invHessian: H1,
	      iterations: it,
	      message: msg
	    };
	  }; // 10. Ode solver (Dormand-Prince)


	  numeric.Dopri = function Dopri(x, y, f, ymid, iterations, msg, events) {
	    this.x = x;
	    this.y = y;
	    this.f = f;
	    this.ymid = ymid;
	    this.iterations = iterations;
	    this.events = events;
	    this.message = msg;
	  };

	  numeric.Dopri.prototype._at = function _at(xi, j) {
	    function sqr(x) {
	      return x * x;
	    }

	    var sol = this;
	    var xs = sol.x;
	    var ys = sol.y;
	    var k1 = sol.f;
	    var ymid = sol.ymid;
	    var n = xs.length;
	    var x0, x1, xh, y0, y1, yh, xi;
	    var h;
	    var c = 0.5;
	    var add = numeric.add,
	        mul = numeric.mul,
	        sub = numeric.sub,
	        p,
	        q,
	        w;
	    x0 = xs[j];
	    x1 = xs[j + 1];
	    y0 = ys[j];
	    y1 = ys[j + 1];
	    h = x1 - x0;
	    xh = x0 + c * h;
	    yh = ymid[j];
	    p = sub(k1[j], mul(y0, 1 / (x0 - xh) + 2 / (x0 - x1)));
	    q = sub(k1[j + 1], mul(y1, 1 / (x1 - xh) + 2 / (x1 - x0)));
	    w = [sqr(xi - x1) * (xi - xh) / sqr(x0 - x1) / (x0 - xh), sqr(xi - x0) * sqr(xi - x1) / sqr(x0 - xh) / sqr(x1 - xh), sqr(xi - x0) * (xi - xh) / sqr(x1 - x0) / (x1 - xh), (xi - x0) * sqr(xi - x1) * (xi - xh) / sqr(x0 - x1) / (x0 - xh), (xi - x1) * sqr(xi - x0) * (xi - xh) / sqr(x0 - x1) / (x1 - xh)];
	    return add(add(add(add(mul(y0, w[0]), mul(yh, w[1])), mul(y1, w[2])), mul(p, w[3])), mul(q, w[4]));
	  };

	  numeric.Dopri.prototype.at = function at(x) {
	    var i,
	        j,
	        k,
	        floor = Math.floor;

	    if (typeof x !== "number") {
	      var n = x.length,
	          ret = Array(n);

	      for (i = n - 1; i !== -1; --i) {
	        ret[i] = this.at(x[i]);
	      }

	      return ret;
	    }

	    var x0 = this.x;
	    i = 0;
	    j = x0.length - 1;

	    while (j - i > 1) {
	      k = floor(0.5 * (i + j));
	      if (x0[k] <= x) i = k;else j = k;
	    }

	    return this._at(x, i);
	  };

	  numeric.dopri = function dopri(x0, x1, y0, f, tol, maxit, event) {
	    if (typeof tol === "undefined") {
	      tol = 1e-6;
	    }

	    if (typeof maxit === "undefined") {
	      maxit = 1000;
	    }

	    var xs = [x0],
	        ys = [y0],
	        k1 = [f(x0, y0)],
	        k2,
	        k3,
	        k4,
	        k5,
	        k6,
	        k7,
	        ymid = [];
	    var A2 = 1 / 5;
	    var A3 = [3 / 40, 9 / 40];
	    var A4 = [44 / 45, -56 / 15, 32 / 9];
	    var A5 = [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729];
	    var A6 = [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656];
	    var b = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84];
	    var bm = [0.5 * 6025192743 / 30085553152, 0, 0.5 * 51252292925 / 65400821598, 0.5 * -2691868925 / 45128329728, 0.5 * 187940372067 / 1594534317056, 0.5 * -1776094331 / 19743644256, 0.5 * 11237099 / 235043384];
	    var c = [1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1];
	    var e = [-71 / 57600, 0, 71 / 16695, -71 / 1920, 17253 / 339200, -22 / 525, 1 / 40];
	    var i = 0,
	        er,
	        j;
	    var h = (x1 - x0) / 10;
	    var it = 0;
	    var add = numeric.add,
	        mul = numeric.mul,
	        y1,
	        erinf;
	    var min = Math.min,
	        abs = Math.abs,
	        norminf = numeric.norminf,
	        pow = Math.pow;
	    var any = numeric.any,
	        lt = numeric.lt,
	        and = numeric.and,
	        sub = numeric.sub;
	    var e0, e1, ev;
	    var ret = new numeric.Dopri(xs, ys, k1, ymid, -1, "");
	    if (typeof event === "function") e0 = event(x0, y0);

	    while (x0 < x1 && it < maxit) {
	      ++it;
	      if (x0 + h > x1) h = x1 - x0;
	      k2 = f(x0 + c[0] * h, add(y0, mul(A2 * h, k1[i])));
	      k3 = f(x0 + c[1] * h, add(add(y0, mul(A3[0] * h, k1[i])), mul(A3[1] * h, k2)));
	      k4 = f(x0 + c[2] * h, add(add(add(y0, mul(A4[0] * h, k1[i])), mul(A4[1] * h, k2)), mul(A4[2] * h, k3)));
	      k5 = f(x0 + c[3] * h, add(add(add(add(y0, mul(A5[0] * h, k1[i])), mul(A5[1] * h, k2)), mul(A5[2] * h, k3)), mul(A5[3] * h, k4)));
	      k6 = f(x0 + c[4] * h, add(add(add(add(add(y0, mul(A6[0] * h, k1[i])), mul(A6[1] * h, k2)), mul(A6[2] * h, k3)), mul(A6[3] * h, k4)), mul(A6[4] * h, k5)));
	      y1 = add(add(add(add(add(y0, mul(k1[i], h * b[0])), mul(k3, h * b[2])), mul(k4, h * b[3])), mul(k5, h * b[4])), mul(k6, h * b[5]));
	      k7 = f(x0 + h, y1);
	      er = add(add(add(add(add(mul(k1[i], h * e[0]), mul(k3, h * e[2])), mul(k4, h * e[3])), mul(k5, h * e[4])), mul(k6, h * e[5])), mul(k7, h * e[6]));
	      if (typeof er === "number") erinf = abs(er);else erinf = norminf(er);

	      if (erinf > tol) {
	        // reject
	        h = 0.2 * h * pow(tol / erinf, 0.25);

	        if (x0 + h === x0) {
	          ret.msg = "Step size became too small";
	          break;
	        }

	        continue;
	      }

	      ymid[i] = add(add(add(add(add(add(y0, mul(k1[i], h * bm[0])), mul(k3, h * bm[2])), mul(k4, h * bm[3])), mul(k5, h * bm[4])), mul(k6, h * bm[5])), mul(k7, h * bm[6]));
	      ++i;
	      xs[i] = x0 + h;
	      ys[i] = y1;
	      k1[i] = k7;

	      if (typeof event === "function") {
	        var yi,
	            xl = x0,
	            xr = x0 + 0.5 * h,
	            xi;
	        e1 = event(xr, ymid[i - 1]);
	        ev = and(lt(e0, 0), lt(0, e1));

	        if (!any(ev)) {
	          xl = xr;
	          xr = x0 + h;
	          e0 = e1;
	          e1 = event(xr, y1);
	          ev = and(lt(e0, 0), lt(0, e1));
	        }

	        if (any(ev)) {
	          var en, ei;
	          var side = 0,
	              sl = 1.0,
	              sr = 1.0;

	          while (1) {
	            if (typeof e0 === "number") xi = (sr * e1 * xl - sl * e0 * xr) / (sr * e1 - sl * e0);else {
	              xi = xr;

	              for (j = e0.length - 1; j !== -1; --j) {
	                if (e0[j] < 0 && e1[j] > 0) xi = min(xi, (sr * e1[j] * xl - sl * e0[j] * xr) / (sr * e1[j] - sl * e0[j]));
	              }
	            }
	            if (xi <= xl || xi >= xr) break;
	            yi = ret._at(xi, i - 1);
	            ei = event(xi, yi);
	            en = and(lt(e0, 0), lt(0, ei));

	            if (any(en)) {
	              xr = xi;
	              e1 = ei;
	              ev = en;
	              sr = 1.0;
	              if (side === -1) sl *= 0.5;else sl = 1.0;
	              side = -1;
	            } else {
	              xl = xi;
	              e0 = ei;
	              sl = 1.0;
	              if (side === 1) sr *= 0.5;else sr = 1.0;
	              side = 1;
	            }
	          }

	          y1 = ret._at(0.5 * (x0 + xi), i - 1);
	          ret.f[i] = f(xi, yi);
	          ret.x[i] = xi;
	          ret.y[i] = yi;
	          ret.ymid[i - 1] = y1;
	          ret.events = ev;
	          ret.iterations = it;
	          return ret;
	        }
	      }

	      x0 += h;
	      y0 = y1;
	      e0 = e1;
	      h = min(0.8 * h * pow(tol / erinf, 0.25), 4 * h);
	    }

	    ret.iterations = it;
	    return ret;
	  }; // 11. Ax = b


	  numeric.LU = function (A, fast) {
	    fast = fast || false;
	    var abs = Math.abs;
	    var i, j, k, absAjk, Akk, Ak, Pk, Ai;
	    var max;
	    var n = A.length,
	        n1 = n - 1;
	    var P = new Array(n);
	    if (!fast) A = numeric.clone(A);

	    for (k = 0; k < n; ++k) {
	      Pk = k;
	      Ak = A[k];
	      max = abs(Ak[k]);

	      for (j = k + 1; j < n; ++j) {
	        absAjk = abs(A[j][k]);

	        if (max < absAjk) {
	          max = absAjk;
	          Pk = j;
	        }
	      }

	      P[k] = Pk;

	      if (Pk != k) {
	        A[k] = A[Pk];
	        A[Pk] = Ak;
	        Ak = A[k];
	      }

	      Akk = Ak[k];

	      for (i = k + 1; i < n; ++i) {
	        A[i][k] /= Akk;
	      }

	      for (i = k + 1; i < n; ++i) {
	        Ai = A[i];

	        for (j = k + 1; j < n1; ++j) {
	          Ai[j] -= Ai[k] * Ak[j];
	          ++j;
	          Ai[j] -= Ai[k] * Ak[j];
	        }

	        if (j === n1) Ai[j] -= Ai[k] * Ak[j];
	      }
	    }

	    return {
	      LU: A,
	      P: P
	    };
	  };

	  numeric.LUsolve = function LUsolve(LUP, b) {
	    var i, j;
	    var LU = LUP.LU;
	    var n = LU.length;
	    var x = numeric.clone(b);
	    var P = LUP.P;
	    var Pi, LUi, tmp;

	    for (i = n - 1; i !== -1; --i) x[i] = b[i];

	    for (i = 0; i < n; ++i) {
	      Pi = P[i];

	      if (P[i] !== i) {
	        tmp = x[i];
	        x[i] = x[Pi];
	        x[Pi] = tmp;
	      }

	      LUi = LU[i];

	      for (j = 0; j < i; ++j) {
	        x[i] -= x[j] * LUi[j];
	      }
	    }

	    for (i = n - 1; i >= 0; --i) {
	      LUi = LU[i];

	      for (j = i + 1; j < n; ++j) {
	        x[i] -= x[j] * LUi[j];
	      }

	      x[i] /= LUi[i];
	    }

	    return x;
	  };

	  numeric.solve = function solve(A, b, fast) {
	    return numeric.LUsolve(numeric.LU(A, fast), b);
	  }; // 12. Linear programming


	  numeric.echelonize = function echelonize(A) {
	    var s = numeric.dim(A),
	        m = s[0],
	        n = s[1];
	    var I = numeric.identity(m);
	    var P = Array(m);
	    var i, j, k, l, Ai, Ii, Z, a;
	    var abs = Math.abs;
	    var diveq = numeric.diveq;
	    A = numeric.clone(A);

	    for (i = 0; i < m; ++i) {
	      k = 0;
	      Ai = A[i];
	      Ii = I[i];

	      for (j = 1; j < n; ++j) if (abs(Ai[k]) < abs(Ai[j])) k = j;

	      P[i] = k;
	      diveq(Ii, Ai[k]);
	      diveq(Ai, Ai[k]);

	      for (j = 0; j < m; ++j) if (j !== i) {
	        Z = A[j];
	        a = Z[k];

	        for (l = n - 1; l !== -1; --l) Z[l] -= Ai[l] * a;

	        Z = I[j];

	        for (l = m - 1; l !== -1; --l) Z[l] -= Ii[l] * a;
	      }
	    }

	    return {
	      I: I,
	      A: A,
	      P: P
	    };
	  };

	  numeric.__solveLP = function __solveLP(c, A, b, tol, maxit, x, flag) {
	    var sum = numeric.sum,
	        log = numeric.log,
	        mul = numeric.mul,
	        sub = numeric.sub,
	        dot = numeric.dot,
	        div = numeric.div,
	        add = numeric.add;
	    var m = c.length,
	        n = b.length,
	        y;
	    var unbounded = false,
	        i0 = 0;
	    var alpha = 1.0;
	    var AT = numeric.transpose(A),
	        svd = numeric.svd,
	        transpose = numeric.transpose,
	        leq = numeric.leq,
	        sqrt = Math.sqrt,
	        abs = Math.abs;
	    var muleq = numeric.muleq;
	    var norm = numeric.norminf,
	        any = numeric.any,
	        min = Math.min;
	    var all = numeric.all,
	        gt = numeric.gt;
	    var p = Array(m),
	        A0 = Array(n),
	        e = numeric.rep([n], 1),
	        H;
	    var solve = numeric.solve,
	        z = sub(b, dot(A, x)),
	        count;
	    var dotcc = dot(c, c);
	    var g;

	    for (count = i0; count < maxit; ++count) {
	      var i, d;

	      for (i = n - 1; i !== -1; --i) A0[i] = div(A[i], z[i]);

	      var A1 = transpose(A0);

	      for (i = m - 1; i !== -1; --i) p[i] =
	      /*x[i]+*/
	      sum(A1[i]);

	      alpha = 0.25 * abs(dotcc / dot(c, p));
	      var a1 = 100 * sqrt(dotcc / dot(p, p));
	      if (!isFinite(alpha) || alpha > a1) alpha = a1;
	      g = add(c, mul(alpha, p));
	      H = dot(A1, A0);

	      for (i = m - 1; i !== -1; --i) H[i][i] += 1;

	      d = solve(H, div(g, alpha), true);
	      var t0 = div(z, dot(A, d));
	      var t = 1.0;

	      for (i = n - 1; i !== -1; --i) if (t0[i] < 0) t = min(t, -0.999 * t0[i]);

	      y = sub(x, mul(d, t));
	      z = sub(b, dot(A, y));
	      if (!all(gt(z, 0))) return {
	        solution: x,
	        message: "",
	        iterations: count
	      };
	      x = y;
	      if (alpha < tol) return {
	        solution: y,
	        message: "",
	        iterations: count
	      };

	      if (flag) {
	        var s = dot(c, g),
	            Ag = dot(A, g);
	        unbounded = true;

	        for (i = n - 1; i !== -1; --i) if (s * Ag[i] < 0) {
	          unbounded = false;
	          break;
	        }
	      } else {
	        if (x[m - 1] >= 0) unbounded = false;else unbounded = true;
	      }

	      if (unbounded) return {
	        solution: y,
	        message: "Unbounded",
	        iterations: count
	      };
	    }

	    return {
	      solution: x,
	      message: "maximum iteration count exceeded",
	      iterations: count
	    };
	  };

	  numeric._solveLP = function _solveLP(c, A, b, tol, maxit) {
	    var m = c.length,
	        n = b.length,
	        y;
	    var sum = numeric.sum,
	        log = numeric.log,
	        mul = numeric.mul,
	        sub = numeric.sub,
	        dot = numeric.dot,
	        div = numeric.div,
	        add = numeric.add;
	    var c0 = numeric.rep([m], 0).concat([1]);
	    var J = numeric.rep([n, 1], -1);
	    var A0 = numeric.blockMatrix([[A, J]]);
	    var b0 = b;
	    var y = numeric.rep([m], 0).concat(Math.max(0, numeric.sup(numeric.neg(b))) + 1);

	    var x0 = numeric.__solveLP(c0, A0, b0, tol, maxit, y, false);

	    var x = numeric.clone(x0.solution);
	    x.length = m;
	    var foo = numeric.inf(sub(b, dot(A, x)));

	    if (foo < 0) {
	      return {
	        solution: NaN,
	        message: "Infeasible",
	        iterations: x0.iterations
	      };
	    }

	    var ret = numeric.__solveLP(c, A, b, tol, maxit - x0.iterations, x, true);

	    ret.iterations += x0.iterations;
	    return ret;
	  };

	  numeric.solveLP = function solveLP(c, A, b, Aeq, beq, tol, maxit) {
	    if (typeof maxit === "undefined") maxit = 1000;
	    if (typeof tol === "undefined") tol = numeric.epsilon;
	    if (typeof Aeq === "undefined") return numeric._solveLP(c, A, b, tol, maxit);
	    var m = Aeq.length,
	        n = Aeq[0].length,
	        o = A.length;
	    var B = numeric.echelonize(Aeq);
	    var flags = numeric.rep([n], 0);
	    var P = B.P;
	    var Q = [];
	    var i;

	    for (i = P.length - 1; i !== -1; --i) flags[P[i]] = 1;

	    for (i = n - 1; i !== -1; --i) if (flags[i] === 0) Q.push(i);

	    var g = numeric.getRange;
	    var I = numeric.linspace(0, m - 1),
	        J = numeric.linspace(0, o - 1);
	    var Aeq2 = g(Aeq, I, Q),
	        A1 = g(A, J, P),
	        A2 = g(A, J, Q),
	        dot = numeric.dot,
	        sub = numeric.sub;
	    var A3 = dot(A1, B.I);
	    var A4 = sub(A2, dot(A3, Aeq2)),
	        b4 = sub(b, dot(A3, beq));
	    var c1 = Array(P.length),
	        c2 = Array(Q.length);

	    for (i = P.length - 1; i !== -1; --i) c1[i] = c[P[i]];

	    for (i = Q.length - 1; i !== -1; --i) c2[i] = c[Q[i]];

	    var c4 = sub(c2, dot(c1, dot(B.I, Aeq2)));

	    var S = numeric._solveLP(c4, A4, b4, tol, maxit);

	    var x2 = S.solution;
	    if (x2 !== x2) return S;
	    var x1 = dot(B.I, sub(beq, dot(Aeq2, x2)));
	    var x = Array(c.length);

	    for (i = P.length - 1; i !== -1; --i) x[P[i]] = x1[i];

	    for (i = Q.length - 1; i !== -1; --i) x[Q[i]] = x2[i];

	    return {
	      solution: x,
	      message: S.message,
	      iterations: S.iterations
	    };
	  };

	  numeric.MPStoLP = function MPStoLP(MPS) {
	    if (MPS instanceof String) {
	      MPS.split('\n');
	    }

	    var state = 0;
	    var states = ['Initial state', 'NAME', 'ROWS', 'COLUMNS', 'RHS', 'BOUNDS', 'ENDATA'];
	    var n = MPS.length;
	    var i,
	        j,
	        z,
	        N = 0,
	        rows = {},
	        sign = [],
	        rl = 0,
	        vars = {},
	        nv = 0;
	    var name;
	    var c = [],
	        A = [],
	        b = [];

	    function err(e) {
	      throw new Error('MPStoLP: ' + e + '\nLine ' + i + ': ' + MPS[i] + '\nCurrent state: ' + states[state] + '\n');
	    }

	    for (i = 0; i < n; ++i) {
	      z = MPS[i];
	      var w0 = z.match(/\S*/g);
	      var w = [];

	      for (j = 0; j < w0.length; ++j) if (w0[j] !== "") w.push(w0[j]);

	      if (w.length === 0) continue;

	      for (j = 0; j < states.length; ++j) if (z.substr(0, states[j].length) === states[j]) break;

	      if (j < states.length) {
	        state = j;

	        if (j === 1) {
	          name = w[1];
	        }

	        if (j === 6) return {
	          name: name,
	          c: c,
	          A: numeric.transpose(A),
	          b: b,
	          rows: rows,
	          vars: vars
	        };
	        continue;
	      }

	      switch (state) {
	        case 0:
	        case 1:
	          err('Unexpected line');

	        case 2:
	          switch (w[0]) {
	            case 'N':
	              if (N === 0) N = w[1];else err('Two or more N rows');
	              break;

	            case 'L':
	              rows[w[1]] = rl;
	              sign[rl] = 1;
	              b[rl] = 0;
	              ++rl;
	              break;

	            case 'G':
	              rows[w[1]] = rl;
	              sign[rl] = -1;
	              b[rl] = 0;
	              ++rl;
	              break;

	            case 'E':
	              rows[w[1]] = rl;
	              sign[rl] = 0;
	              b[rl] = 0;
	              ++rl;
	              break;

	            default:
	              err('Parse error ' + numeric.prettyPrint(w));
	          }

	          break;

	        case 3:
	          if (!vars.hasOwnProperty(w[0])) {
	            vars[w[0]] = nv;
	            c[nv] = 0;
	            A[nv] = numeric.rep([rl], 0);
	            ++nv;
	          }

	          var p = vars[w[0]];

	          for (j = 1; j < w.length; j += 2) {
	            if (w[j] === N) {
	              c[p] = parseFloat(w[j + 1]);
	              continue;
	            }

	            var q = rows[w[j]];
	            A[p][q] = (sign[q] < 0 ? -1 : 1) * parseFloat(w[j + 1]);
	          }

	          break;

	        case 4:
	          for (j = 1; j < w.length; j += 2) b[rows[w[j]]] = (sign[rows[w[j]]] < 0 ? -1 : 1) * parseFloat(w[j + 1]);

	          break;

	        case 5:
	          /*FIXME*/
	          break;

	        case 6:
	          err('Internal error');
	      }
	    }

	    err('Reached end of file without ENDATA');
	  }; // seedrandom.js version 2.0.
	  // Author: David Bau 4/2/2011
	  //
	  // Defines a method Math.seedrandom() that, when called, substitutes
	  // an explicitly seeded RC4-based algorithm for Math.random().  Also
	  // supports automatic seeding from local or network sources of entropy.
	  //
	  // Usage:
	  //
	  //   <script src=http://davidbau.com/encode/seedrandom-min.js></script>
	  //
	  //   Math.seedrandom('yipee'); Sets Math.random to a function that is
	  //                             initialized using the given explicit seed.
	  //
	  //   Math.seedrandom();        Sets Math.random to a function that is
	  //                             seeded using the current time, dom state,
	  //                             and other accumulated local entropy.
	  //                             The generated seed string is returned.
	  //
	  //   Math.seedrandom('yowza', true);
	  //                             Seeds using the given explicit seed mixed
	  //                             together with accumulated entropy.
	  //
	  //   <script src="http://bit.ly/srandom-512"></script>
	  //                             Seeds using physical random bits downloaded
	  //                             from random.org.
	  //
	  //   <script src="https://jsonlib.appspot.com/urandom?callback=Math.seedrandom">
	  //   </script>                 Seeds using urandom bits from call.jsonlib.com,
	  //                             which is faster than random.org.
	  //
	  // Examples:
	  //
	  //   Math.seedrandom("hello");            // Use "hello" as the seed.
	  //   document.write(Math.random());       // Always 0.5463663768140734
	  //   document.write(Math.random());       // Always 0.43973793770592234
	  //   var rng1 = Math.random;              // Remember the current prng.
	  //
	  //   var autoseed = Math.seedrandom();    // New prng with an automatic seed.
	  //   document.write(Math.random());       // Pretty much unpredictable.
	  //
	  //   Math.random = rng1;                  // Continue "hello" prng sequence.
	  //   document.write(Math.random());       // Always 0.554769432473455
	  //
	  //   Math.seedrandom(autoseed);           // Restart at the previous seed.
	  //   document.write(Math.random());       // Repeat the 'unpredictable' value.
	  //
	  // Notes:
	  //
	  // Each time seedrandom('arg') is called, entropy from the passed seed
	  // is accumulated in a pool to help generate future seeds for the
	  // zero-argument form of Math.seedrandom, so entropy can be injected over
	  // time by calling seedrandom with explicit data repeatedly.
	  //
	  // On speed - This javascript implementation of Math.random() is about
	  // 3-10x slower than the built-in Math.random() because it is not native
	  // code, but this is typically fast enough anyway.  Seeding is more expensive,
	  // especially if you use auto-seeding.  Some details (timings on Chrome 4):
	  //
	  // Our Math.random()            - avg less than 0.002 milliseconds per call
	  // seedrandom('explicit')       - avg less than 0.5 milliseconds per call
	  // seedrandom('explicit', true) - avg less than 2 milliseconds per call
	  // seedrandom()                 - avg about 38 milliseconds per call
	  //
	  // LICENSE (BSD):
	  //
	  // Copyright 2010 David Bau, all rights reserved.
	  //
	  // Redistribution and use in source and binary forms, with or without
	  // modification, are permitted provided that the following conditions are met:
	  // 
	  //   1. Redistributions of source code must retain the above copyright
	  //      notice, this list of conditions and the following disclaimer.
	  //
	  //   2. Redistributions in binary form must reproduce the above copyright
	  //      notice, this list of conditions and the following disclaimer in the
	  //      documentation and/or other materials provided with the distribution.
	  // 
	  //   3. Neither the name of this module nor the names of its contributors may
	  //      be used to endorse or promote products derived from this software
	  //      without specific prior written permission.
	  // 
	  // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	  // "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	  // LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	  // A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	  // OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	  // SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	  // LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	  // DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	  // THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  // (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	  // OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	  //

	  /**
	   * All code is in an anonymous closure to keep the global namespace clean.
	   *
	   * @param {number=} overflow 
	   * @param {number=} startdenom
	   */
	  // Patched by Seb so that seedrandom.js does not pollute the Math object.
	  // My tests suggest that doing Math.trouble = 1 makes Math lookups about 5%
	  // slower.


	  numeric.seedrandom = {
	    pow: Math.pow,
	    random: Math.random
	  };

	  (function (pool, math, width, chunks, significance, overflow, startdenom) {
	    //
	    // seedrandom()
	    // This is the seedrandom function described above.
	    //
	    math['seedrandom'] = function seedrandom(seed, use_entropy) {
	      var key = [];
	      var arc4; // Flatten the seed string or build one from local entropy if needed.

	      seed = mixkey(flatten(use_entropy ? [seed, pool] : arguments.length ? seed : [new Date().getTime(), pool, window], 3), key); // Use the seed to initialize an ARC4 generator.

	      arc4 = new ARC4(key); // Mix the randomness into accumulated entropy.

	      mixkey(arc4.S, pool); // Override Math.random
	      // This function returns a random double in [0, 1) that contains
	      // randomness in every bit of the mantissa of the IEEE 754 value.

	      math['random'] = function random() {
	        // Closure to return a random double:
	        var n = arc4.g(chunks); // Start with a numerator n < 2 ^ 48

	        var d = startdenom; //   and denominator d = 2 ^ 48.

	        var x = 0; //   and no 'extra last byte'.

	        while (n < significance) {
	          // Fill up all significant digits by
	          n = (n + x) * width; //   shifting numerator and

	          d *= width; //   denominator and generating a

	          x = arc4.g(1); //   new least-significant-byte.
	        }

	        while (n >= overflow) {
	          // To avoid rounding up, before adding
	          n /= 2; //   last byte, shift everything

	          d /= 2; //   right using integer math until

	          x >>>= 1; //   we have exactly the desired bits.
	        }

	        return (n + x) / d; // Form the number within [0, 1).
	      }; // Return the seed that was used


	      return seed;
	    }; //
	    // ARC4
	    //
	    // An ARC4 implementation.  The constructor takes a key in the form of
	    // an array of at most (width) integers that should be 0 <= x < (width).
	    //
	    // The g(count) method returns a pseudorandom integer that concatenates
	    // the next (count) outputs from ARC4.  Its return value is a number x
	    // that is in the range 0 <= x < (width ^ count).
	    //

	    /** @constructor */


	    function ARC4(key) {
	      var t,
	          u,
	          me = this,
	          keylen = key.length;
	      var i = 0,
	          j = me.i = me.j = me.m = 0;
	      me.S = [];
	      me.c = []; // The empty key [] is treated as [0].

	      if (!keylen) {
	        key = [keylen++];
	      } // Set up S using the standard key scheduling algorithm.


	      while (i < width) {
	        me.S[i] = i++;
	      }

	      for (i = 0; i < width; i++) {
	        t = me.S[i];
	        j = lowbits(j + t + key[i % keylen]);
	        u = me.S[j];
	        me.S[i] = u;
	        me.S[j] = t;
	      } // The "g" method returns the next (count) outputs as one number.


	      me.g = function getnext(count) {
	        var s = me.S;
	        var i = lowbits(me.i + 1);
	        var t = s[i];
	        var j = lowbits(me.j + t);
	        var u = s[j];
	        s[i] = u;
	        s[j] = t;
	        var r = s[lowbits(t + u)];

	        while (--count) {
	          i = lowbits(i + 1);
	          t = s[i];
	          j = lowbits(j + t);
	          u = s[j];
	          s[i] = u;
	          s[j] = t;
	          r = r * width + s[lowbits(t + u)];
	        }

	        me.i = i;
	        me.j = j;
	        return r;
	      }; // For robust unpredictability discard an initial batch of values.
	      // See http://www.rsa.com/rsalabs/node.asp?id=2009


	      me.g(width);
	    } //
	    // flatten()
	    // Converts an object tree to nested arrays of strings.
	    //

	    /** @param {Object=} result 
	      * @param {string=} prop
	      * @param {string=} typ */


	    function flatten(obj, depth, result, prop, typ) {
	      result = [];
	      typ = typeof obj;

	      if (depth && typ == 'object') {
	        for (prop in obj) {
	          if (prop.indexOf('S') < 5) {
	            // Avoid FF3 bug (local/sessionStorage)
	            try {
	              result.push(flatten(obj[prop], depth - 1));
	            } catch (e) {}
	          }
	        }
	      }

	      return result.length ? result : obj + (typ != 'string' ? '\0' : '');
	    } //
	    // mixkey()
	    // Mixes a string seed into a key that is an array of integers, and
	    // returns a shortened string seed that is equivalent to the result key.
	    //

	    /** @param {number=} smear 
	      * @param {number=} j */


	    function mixkey(seed, key, smear, j) {
	      seed += ''; // Ensure the seed is a string

	      smear = 0;

	      for (j = 0; j < seed.length; j++) {
	        key[lowbits(j)] = lowbits((smear ^= key[lowbits(j)] * 19) + seed.charCodeAt(j));
	      }

	      seed = '';

	      for (j in key) {
	        seed += String.fromCharCode(key[j]);
	      }

	      return seed;
	    } //
	    // lowbits()
	    // A quick "n mod width" for width a power of 2.
	    //


	    function lowbits(n) {
	      return n & width - 1;
	    } //
	    // The following constants are related to IEEE 754 limits.
	    //


	    startdenom = math.pow(width, chunks);
	    significance = math.pow(2, significance);
	    overflow = significance * 2; //
	    // When seedrandom.js is loaded, we immediately mix a few bits
	    // from the built-in RNG into the entropy pool.  Because we do
	    // not want to intefere with determinstic PRNG state later,
	    // seedrandom will not call math.random on its own again after
	    // initialization.
	    //

	    mixkey(math.random(), pool); // End anonymous scope, and pass initial values.
	  })([], // pool: entropy pool starts empty
	  numeric.seedrandom, // math: package containing random, pow, and seedrandom
	  256, // width: each RC4 output is 0 <= x < 256
	  6, // chunks: at least six RC4 outputs for each double
	  52 // significance: there are 52 significant digits in a double
	  );
	  /* This file is a slightly modified version of quadprog.js from Alberto Santini.
	   * It has been slightly modified by Sébastien Loisel to make sure that it handles
	   * 0-based Arrays instead of 1-based Arrays.
	   * License is in resources/LICENSE.quadprog */


	  (function (exports) {
	    function base0to1(A) {
	      if (typeof A !== "object") {
	        return A;
	      }

	      var ret = [],
	          i,
	          n = A.length;

	      for (i = 0; i < n; i++) ret[i + 1] = base0to1(A[i]);

	      return ret;
	    }

	    function base1to0(A) {
	      if (typeof A !== "object") {
	        return A;
	      }

	      var ret = [],
	          i,
	          n = A.length;

	      for (i = 1; i < n; i++) ret[i - 1] = base1to0(A[i]);

	      return ret;
	    }

	    function dpori(a, lda, n) {
	      var i, j, k, kp1, t;

	      for (k = 1; k <= n; k = k + 1) {
	        a[k][k] = 1 / a[k][k];
	        t = -a[k][k]; //~ dscal(k - 1, t, a[1][k], 1);

	        for (i = 1; i < k; i = i + 1) {
	          a[i][k] = t * a[i][k];
	        }

	        kp1 = k + 1;

	        if (n < kp1) {
	          break;
	        }

	        for (j = kp1; j <= n; j = j + 1) {
	          t = a[k][j];
	          a[k][j] = 0; //~ daxpy(k, t, a[1][k], 1, a[1][j], 1);

	          for (i = 1; i <= k; i = i + 1) {
	            a[i][j] = a[i][j] + t * a[i][k];
	          }
	        }
	      }
	    }

	    function dposl(a, lda, n, b) {
	      var i, k, kb, t;

	      for (k = 1; k <= n; k = k + 1) {
	        //~ t = ddot(k - 1, a[1][k], 1, b[1], 1);
	        t = 0;

	        for (i = 1; i < k; i = i + 1) {
	          t = t + a[i][k] * b[i];
	        }

	        b[k] = (b[k] - t) / a[k][k];
	      }

	      for (kb = 1; kb <= n; kb = kb + 1) {
	        k = n + 1 - kb;
	        b[k] = b[k] / a[k][k];
	        t = -b[k]; //~ daxpy(k - 1, t, a[1][k], 1, b[1], 1);

	        for (i = 1; i < k; i = i + 1) {
	          b[i] = b[i] + t * a[i][k];
	        }
	      }
	    }

	    function dpofa(a, lda, n, info) {
	      var i, j, jm1, k, t, s;

	      for (j = 1; j <= n; j = j + 1) {
	        info[1] = j;
	        s = 0;
	        jm1 = j - 1;

	        if (jm1 < 1) {
	          s = a[j][j] - s;

	          if (s <= 0) {
	            break;
	          }

	          a[j][j] = Math.sqrt(s);
	        } else {
	          for (k = 1; k <= jm1; k = k + 1) {
	            //~ t = a[k][j] - ddot(k - 1, a[1][k], 1, a[1][j], 1);
	            t = a[k][j];

	            for (i = 1; i < k; i = i + 1) {
	              t = t - a[i][j] * a[i][k];
	            }

	            t = t / a[k][k];
	            a[k][j] = t;
	            s = s + t * t;
	          }

	          s = a[j][j] - s;

	          if (s <= 0) {
	            break;
	          }

	          a[j][j] = Math.sqrt(s);
	        }

	        info[1] = 0;
	      }
	    }

	    function qpgen2(dmat, dvec, fddmat, n, sol, crval, amat, bvec, fdamat, q, meq, iact, nact, iter, work, ierr) {
	      var i, j, l, l1, info, it1, iwzv, iwrv, iwrm, iwsv, iwuv, nvl, r, iwnbv, temp, sum, t1, tt, gc, gs, nu, t1inf, t2min, vsmall, tmpa, tmpb, go;
	      r = Math.min(n, q);
	      l = 2 * n + r * (r + 5) / 2 + 2 * q + 1;
	      vsmall = 1.0e-60;

	      do {
	        vsmall = vsmall + vsmall;
	        tmpa = 1 + 0.1 * vsmall;
	        tmpb = 1 + 0.2 * vsmall;
	      } while (tmpa <= 1 || tmpb <= 1);

	      for (i = 1; i <= n; i = i + 1) {
	        work[i] = dvec[i];
	      }

	      for (i = n + 1; i <= l; i = i + 1) {
	        work[i] = 0;
	      }

	      for (i = 1; i <= q; i = i + 1) {
	        iact[i] = 0;
	      }

	      info = [];

	      if (ierr[1] === 0) {
	        dpofa(dmat, fddmat, n, info);

	        if (info[1] !== 0) {
	          ierr[1] = 2;
	          return;
	        }

	        dposl(dmat, fddmat, n, dvec);
	        dpori(dmat, fddmat, n);
	      } else {
	        for (j = 1; j <= n; j = j + 1) {
	          sol[j] = 0;

	          for (i = 1; i <= j; i = i + 1) {
	            sol[j] = sol[j] + dmat[i][j] * dvec[i];
	          }
	        }

	        for (j = 1; j <= n; j = j + 1) {
	          dvec[j] = 0;

	          for (i = j; i <= n; i = i + 1) {
	            dvec[j] = dvec[j] + dmat[j][i] * sol[i];
	          }
	        }
	      }

	      crval[1] = 0;

	      for (j = 1; j <= n; j = j + 1) {
	        sol[j] = dvec[j];
	        crval[1] = crval[1] + work[j] * sol[j];
	        work[j] = 0;

	        for (i = j + 1; i <= n; i = i + 1) {
	          dmat[i][j] = 0;
	        }
	      }

	      crval[1] = -crval[1] / 2;
	      ierr[1] = 0;
	      iwzv = n;
	      iwrv = iwzv + n;
	      iwuv = iwrv + r;
	      iwrm = iwuv + r + 1;
	      iwsv = iwrm + r * (r + 1) / 2;
	      iwnbv = iwsv + q;

	      for (i = 1; i <= q; i = i + 1) {
	        sum = 0;

	        for (j = 1; j <= n; j = j + 1) {
	          sum = sum + amat[j][i] * amat[j][i];
	        }

	        work[iwnbv + i] = Math.sqrt(sum);
	      }

	      nact = 0;
	      iter[1] = 0;
	      iter[2] = 0;

	      function fn_goto_50() {
	        iter[1] = iter[1] + 1;
	        l = iwsv;

	        for (i = 1; i <= q; i = i + 1) {
	          l = l + 1;
	          sum = -bvec[i];

	          for (j = 1; j <= n; j = j + 1) {
	            sum = sum + amat[j][i] * sol[j];
	          }

	          if (Math.abs(sum) < vsmall) {
	            sum = 0;
	          }

	          if (i > meq) {
	            work[l] = sum;
	          } else {
	            work[l] = -Math.abs(sum);

	            if (sum > 0) {
	              for (j = 1; j <= n; j = j + 1) {
	                amat[j][i] = -amat[j][i];
	              }

	              bvec[i] = -bvec[i];
	            }
	          }
	        }

	        for (i = 1; i <= nact; i = i + 1) {
	          work[iwsv + iact[i]] = 0;
	        }

	        nvl = 0;
	        temp = 0;

	        for (i = 1; i <= q; i = i + 1) {
	          if (work[iwsv + i] < temp * work[iwnbv + i]) {
	            nvl = i;
	            temp = work[iwsv + i] / work[iwnbv + i];
	          }
	        }

	        if (nvl === 0) {
	          return 999;
	        }

	        return 0;
	      }

	      function fn_goto_55() {
	        for (i = 1; i <= n; i = i + 1) {
	          sum = 0;

	          for (j = 1; j <= n; j = j + 1) {
	            sum = sum + dmat[j][i] * amat[j][nvl];
	          }

	          work[i] = sum;
	        }

	        l1 = iwzv;

	        for (i = 1; i <= n; i = i + 1) {
	          work[l1 + i] = 0;
	        }

	        for (j = nact + 1; j <= n; j = j + 1) {
	          for (i = 1; i <= n; i = i + 1) {
	            work[l1 + i] = work[l1 + i] + dmat[i][j] * work[j];
	          }
	        }

	        t1inf = true;

	        for (i = nact; i >= 1; i = i - 1) {
	          sum = work[i];
	          l = iwrm + i * (i + 3) / 2;
	          l1 = l - i;

	          for (j = i + 1; j <= nact; j = j + 1) {
	            sum = sum - work[l] * work[iwrv + j];
	            l = l + j;
	          }

	          sum = sum / work[l1];
	          work[iwrv + i] = sum;

	          if (iact[i] < meq) {
	            // continue;
	            break;
	          }

	          if (sum < 0) {
	            // continue;
	            break;
	          }

	          t1inf = false;
	          it1 = i;
	        }

	        if (!t1inf) {
	          t1 = work[iwuv + it1] / work[iwrv + it1];

	          for (i = 1; i <= nact; i = i + 1) {
	            if (iact[i] < meq) {
	              // continue;
	              break;
	            }

	            if (work[iwrv + i] < 0) {
	              // continue;
	              break;
	            }

	            temp = work[iwuv + i] / work[iwrv + i];

	            if (temp < t1) {
	              t1 = temp;
	              it1 = i;
	            }
	          }
	        }

	        sum = 0;

	        for (i = iwzv + 1; i <= iwzv + n; i = i + 1) {
	          sum = sum + work[i] * work[i];
	        }

	        if (Math.abs(sum) <= vsmall) {
	          if (t1inf) {
	            ierr[1] = 1; // GOTO 999

	            return 999;
	          } else {
	            for (i = 1; i <= nact; i = i + 1) {
	              work[iwuv + i] = work[iwuv + i] - t1 * work[iwrv + i];
	            }

	            work[iwuv + nact + 1] = work[iwuv + nact + 1] + t1; // GOTO 700

	            return 700;
	          }
	        } else {
	          sum = 0;

	          for (i = 1; i <= n; i = i + 1) {
	            sum = sum + work[iwzv + i] * amat[i][nvl];
	          }

	          tt = -work[iwsv + nvl] / sum;
	          t2min = true;

	          if (!t1inf) {
	            if (t1 < tt) {
	              tt = t1;
	              t2min = false;
	            }
	          }

	          for (i = 1; i <= n; i = i + 1) {
	            sol[i] = sol[i] + tt * work[iwzv + i];

	            if (Math.abs(sol[i]) < vsmall) {
	              sol[i] = 0;
	            }
	          }

	          crval[1] = crval[1] + tt * sum * (tt / 2 + work[iwuv + nact + 1]);

	          for (i = 1; i <= nact; i = i + 1) {
	            work[iwuv + i] = work[iwuv + i] - tt * work[iwrv + i];
	          }

	          work[iwuv + nact + 1] = work[iwuv + nact + 1] + tt;

	          if (t2min) {
	            nact = nact + 1;
	            iact[nact] = nvl;
	            l = iwrm + (nact - 1) * nact / 2 + 1;

	            for (i = 1; i <= nact - 1; i = i + 1) {
	              work[l] = work[i];
	              l = l + 1;
	            }

	            if (nact === n) {
	              work[l] = work[n];
	            } else {
	              for (i = n; i >= nact + 1; i = i - 1) {
	                if (work[i] === 0) {
	                  // continue;
	                  break;
	                }

	                gc = Math.max(Math.abs(work[i - 1]), Math.abs(work[i]));
	                gs = Math.min(Math.abs(work[i - 1]), Math.abs(work[i]));

	                if (work[i - 1] >= 0) {
	                  temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	                } else {
	                  temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	                }

	                gc = work[i - 1] / temp;
	                gs = work[i] / temp;

	                if (gc === 1) {
	                  // continue;
	                  break;
	                }

	                if (gc === 0) {
	                  work[i - 1] = gs * temp;

	                  for (j = 1; j <= n; j = j + 1) {
	                    temp = dmat[j][i - 1];
	                    dmat[j][i - 1] = dmat[j][i];
	                    dmat[j][i] = temp;
	                  }
	                } else {
	                  work[i - 1] = temp;
	                  nu = gs / (1 + gc);

	                  for (j = 1; j <= n; j = j + 1) {
	                    temp = gc * dmat[j][i - 1] + gs * dmat[j][i];
	                    dmat[j][i] = nu * (dmat[j][i - 1] + temp) - dmat[j][i];
	                    dmat[j][i - 1] = temp;
	                  }
	                }
	              }

	              work[l] = work[nact];
	            }
	          } else {
	            sum = -bvec[nvl];

	            for (j = 1; j <= n; j = j + 1) {
	              sum = sum + sol[j] * amat[j][nvl];
	            }

	            if (nvl > meq) {
	              work[iwsv + nvl] = sum;
	            } else {
	              work[iwsv + nvl] = -Math.abs(sum);

	              if (sum > 0) {
	                for (j = 1; j <= n; j = j + 1) {
	                  amat[j][nvl] = -amat[j][nvl];
	                }

	                bvec[nvl] = -bvec[nvl];
	              }
	            } // GOTO 700


	            return 700;
	          }
	        }

	        return 0;
	      }

	      function fn_goto_797() {
	        l = iwrm + it1 * (it1 + 1) / 2 + 1;
	        l1 = l + it1;

	        if (work[l1] === 0) {
	          // GOTO 798
	          return 798;
	        }

	        gc = Math.max(Math.abs(work[l1 - 1]), Math.abs(work[l1]));
	        gs = Math.min(Math.abs(work[l1 - 1]), Math.abs(work[l1]));

	        if (work[l1 - 1] >= 0) {
	          temp = Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	        } else {
	          temp = -Math.abs(gc * Math.sqrt(1 + gs * gs / (gc * gc)));
	        }

	        gc = work[l1 - 1] / temp;
	        gs = work[l1] / temp;

	        if (gc === 1) {
	          // GOTO 798
	          return 798;
	        }

	        if (gc === 0) {
	          for (i = it1 + 1; i <= nact; i = i + 1) {
	            temp = work[l1 - 1];
	            work[l1 - 1] = work[l1];
	            work[l1] = temp;
	            l1 = l1 + i;
	          }

	          for (i = 1; i <= n; i = i + 1) {
	            temp = dmat[i][it1];
	            dmat[i][it1] = dmat[i][it1 + 1];
	            dmat[i][it1 + 1] = temp;
	          }
	        } else {
	          nu = gs / (1 + gc);

	          for (i = it1 + 1; i <= nact; i = i + 1) {
	            temp = gc * work[l1 - 1] + gs * work[l1];
	            work[l1] = nu * (work[l1 - 1] + temp) - work[l1];
	            work[l1 - 1] = temp;
	            l1 = l1 + i;
	          }

	          for (i = 1; i <= n; i = i + 1) {
	            temp = gc * dmat[i][it1] + gs * dmat[i][it1 + 1];
	            dmat[i][it1 + 1] = nu * (dmat[i][it1] + temp) - dmat[i][it1 + 1];
	            dmat[i][it1] = temp;
	          }
	        }

	        return 0;
	      }

	      function fn_goto_798() {
	        l1 = l - it1;

	        for (i = 1; i <= it1; i = i + 1) {
	          work[l1] = work[l];
	          l = l + 1;
	          l1 = l1 + 1;
	        }

	        work[iwuv + it1] = work[iwuv + it1 + 1];
	        iact[it1] = iact[it1 + 1];
	        it1 = it1 + 1;

	        if (it1 < nact) {
	          // GOTO 797
	          return 797;
	        }

	        return 0;
	      }

	      function fn_goto_799() {
	        work[iwuv + nact] = work[iwuv + nact + 1];
	        work[iwuv + nact + 1] = 0;
	        iact[nact] = 0;
	        nact = nact - 1;
	        iter[2] = iter[2] + 1;
	        return 0;
	      }

	      go = 0;

	      while (true) {
	        go = fn_goto_50();

	        if (go === 999) {
	          return;
	        }

	        while (true) {
	          go = fn_goto_55();

	          if (go === 0) {
	            break;
	          }

	          if (go === 999) {
	            return;
	          }

	          if (go === 700) {
	            if (it1 === nact) {
	              fn_goto_799();
	            } else {
	              while (true) {
	                fn_goto_797();
	                go = fn_goto_798();

	                if (go !== 797) {
	                  break;
	                }
	              }

	              fn_goto_799();
	            }
	          }
	        }
	      }
	    }

	    function solveQP(Dmat, dvec, Amat, bvec, meq, factorized) {
	      Dmat = base0to1(Dmat);
	      dvec = base0to1(dvec);
	      Amat = base0to1(Amat);
	      var i,
	          n,
	          q,
	          nact,
	          r,
	          crval = [],
	          iact = [],
	          sol = [],
	          work = [],
	          iter = [],
	          message;
	      meq = meq || 0;
	      factorized = factorized ? base0to1(factorized) : [undefined, 0];
	      bvec = bvec ? base0to1(bvec) : []; // In Fortran the array index starts from 1

	      n = Dmat.length - 1;
	      q = Amat[1].length - 1;

	      if (!bvec) {
	        for (i = 1; i <= q; i = i + 1) {
	          bvec[i] = 0;
	        }
	      }

	      for (i = 1; i <= q; i = i + 1) {
	        iact[i] = 0;
	      }

	      nact = 0;
	      r = Math.min(n, q);

	      for (i = 1; i <= n; i = i + 1) {
	        sol[i] = 0;
	      }

	      crval[1] = 0;

	      for (i = 1; i <= 2 * n + r * (r + 5) / 2 + 2 * q + 1; i = i + 1) {
	        work[i] = 0;
	      }

	      for (i = 1; i <= 2; i = i + 1) {
	        iter[i] = 0;
	      }

	      qpgen2(Dmat, dvec, n, n, sol, crval, Amat, bvec, n, q, meq, iact, nact, iter, work, factorized);
	      message = "";

	      if (factorized[1] === 1) {
	        message = "constraints are inconsistent, no solution!";
	      }

	      if (factorized[1] === 2) {
	        message = "matrix D in quadratic function is not positive definite!";
	      }

	      return {
	        solution: base1to0(sol),
	        value: base1to0(crval),
	        unconstrained_solution: base1to0(dvec),
	        iterations: base1to0(iter),
	        iact: base1to0(iact),
	        message: message
	      };
	    }

	    exports.solveQP = solveQP;
	  })(numeric);
	  /*
	  Shanti Rao sent me this routine by private email. I had to modify it
	  slightly to work on Arrays instead of using a Matrix object.
	  It is apparently translated from http://stitchpanorama.sourceforge.net/Python/svd.py
	  */


	  numeric.svd = function svd(A) {
	    var temp; //Compute the thin SVD from G. H. Golub and C. Reinsch, Numer. Math. 14, 403-420 (1970)

	    var prec = numeric.epsilon; //Math.pow(2,-52) // assumes double prec

	    var tolerance = 1.e-64 / prec;
	    var itmax = 50;
	    var c = 0;
	    var i = 0;
	    var j = 0;
	    var k = 0;
	    var l = 0;
	    var u = numeric.clone(A);
	    var m = u.length;
	    var n = u[0].length;
	    if (m < n) throw "Need more rows than columns";
	    var e = new Array(n);
	    var q = new Array(n);

	    for (i = 0; i < n; i++) e[i] = q[i] = 0.0;

	    var v = numeric.rep([n, n], 0); //	v.zero();

	    function pythag(a, b) {
	      a = Math.abs(a);
	      b = Math.abs(b);
	      if (a > b) return a * Math.sqrt(1.0 + b * b / a / a);else if (b == 0.0) return a;
	      return b * Math.sqrt(1.0 + a * a / b / b);
	    } //Householder's reduction to bidiagonal form


	    var f = 0.0;
	    var g = 0.0;
	    var h = 0.0;
	    var x = 0.0;
	    var y = 0.0;
	    var z = 0.0;
	    var s = 0.0;

	    for (i = 0; i < n; i++) {
	      e[i] = g;
	      s = 0.0;
	      l = i + 1;

	      for (j = i; j < m; j++) s += u[j][i] * u[j][i];

	      if (s <= tolerance) g = 0.0;else {
	        f = u[i][i];
	        g = Math.sqrt(s);
	        if (f >= 0.0) g = -g;
	        h = f * g - s;
	        u[i][i] = f - g;

	        for (j = l; j < n; j++) {
	          s = 0.0;

	          for (k = i; k < m; k++) s += u[k][i] * u[k][j];

	          f = s / h;

	          for (k = i; k < m; k++) u[k][j] += f * u[k][i];
	        }
	      }
	      q[i] = g;
	      s = 0.0;

	      for (j = l; j < n; j++) s = s + u[i][j] * u[i][j];

	      if (s <= tolerance) g = 0.0;else {
	        f = u[i][i + 1];
	        g = Math.sqrt(s);
	        if (f >= 0.0) g = -g;
	        h = f * g - s;
	        u[i][i + 1] = f - g;

	        for (j = l; j < n; j++) e[j] = u[i][j] / h;

	        for (j = l; j < m; j++) {
	          s = 0.0;

	          for (k = l; k < n; k++) s += u[j][k] * u[i][k];

	          for (k = l; k < n; k++) u[j][k] += s * e[k];
	        }
	      }
	      y = Math.abs(q[i]) + Math.abs(e[i]);
	      if (y > x) x = y;
	    } // accumulation of right hand gtransformations


	    for (i = n - 1; i != -1; i += -1) {
	      if (g != 0.0) {
	        h = g * u[i][i + 1];

	        for (j = l; j < n; j++) v[j][i] = u[i][j] / h;

	        for (j = l; j < n; j++) {
	          s = 0.0;

	          for (k = l; k < n; k++) s += u[i][k] * v[k][j];

	          for (k = l; k < n; k++) v[k][j] += s * v[k][i];
	        }
	      }

	      for (j = l; j < n; j++) {
	        v[i][j] = 0;
	        v[j][i] = 0;
	      }

	      v[i][i] = 1;
	      g = e[i];
	      l = i;
	    } // accumulation of left hand transformations


	    for (i = n - 1; i != -1; i += -1) {
	      l = i + 1;
	      g = q[i];

	      for (j = l; j < n; j++) u[i][j] = 0;

	      if (g != 0.0) {
	        h = u[i][i] * g;

	        for (j = l; j < n; j++) {
	          s = 0.0;

	          for (k = l; k < m; k++) s += u[k][i] * u[k][j];

	          f = s / h;

	          for (k = i; k < m; k++) u[k][j] += f * u[k][i];
	        }

	        for (j = i; j < m; j++) u[j][i] = u[j][i] / g;
	      } else for (j = i; j < m; j++) u[j][i] = 0;

	      u[i][i] += 1;
	    } // diagonalization of the bidiagonal form


	    prec = prec * x;

	    for (k = n - 1; k != -1; k += -1) {
	      for (var iteration = 0; iteration < itmax; iteration++) {
	        // test f splitting
	        var test_convergence = false;

	        for (l = k; l != -1; l += -1) {
	          if (Math.abs(e[l]) <= prec) {
	            test_convergence = true;
	            break;
	          }

	          if (Math.abs(q[l - 1]) <= prec) break;
	        }

	        if (!test_convergence) {
	          // cancellation of e[l] if l>0
	          c = 0.0;
	          s = 1.0;
	          var l1 = l - 1;

	          for (i = l; i < k + 1; i++) {
	            f = s * e[i];
	            e[i] = c * e[i];
	            if (Math.abs(f) <= prec) break;
	            g = q[i];
	            h = pythag(f, g);
	            q[i] = h;
	            c = g / h;
	            s = -f / h;

	            for (j = 0; j < m; j++) {
	              y = u[j][l1];
	              z = u[j][i];
	              u[j][l1] = y * c + z * s;
	              u[j][i] = -y * s + z * c;
	            }
	          }
	        } // test f convergence


	        z = q[k];

	        if (l == k) {
	          //convergence
	          if (z < 0.0) {
	            //q[k] is made non-negative
	            q[k] = -z;

	            for (j = 0; j < n; j++) v[j][k] = -v[j][k];
	          }

	          break; //break out of iteration loop and move on to next k value
	        }

	        if (iteration >= itmax - 1) throw 'Error: no convergence.'; // shift from bottom 2x2 minor

	        x = q[l];
	        y = q[k - 1];
	        g = e[k - 1];
	        h = e[k];
	        f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2.0 * h * y);
	        g = pythag(f, 1.0);
	        if (f < 0.0) f = ((x - z) * (x + z) + h * (y / (f - g) - h)) / x;else f = ((x - z) * (x + z) + h * (y / (f + g) - h)) / x; // next QR transformation

	        c = 1.0;
	        s = 1.0;

	        for (i = l + 1; i < k + 1; i++) {
	          g = e[i];
	          y = q[i];
	          h = s * g;
	          g = c * g;
	          z = pythag(f, h);
	          e[i - 1] = z;
	          c = f / z;
	          s = h / z;
	          f = x * c + g * s;
	          g = -x * s + g * c;
	          h = y * s;
	          y = y * c;

	          for (j = 0; j < n; j++) {
	            x = v[j][i - 1];
	            z = v[j][i];
	            v[j][i - 1] = x * c + z * s;
	            v[j][i] = -x * s + z * c;
	          }

	          z = pythag(f, h);
	          q[i - 1] = z;
	          c = f / z;
	          s = h / z;
	          f = c * g + s * y;
	          x = -s * g + c * y;

	          for (j = 0; j < m; j++) {
	            y = u[j][i - 1];
	            z = u[j][i];
	            u[j][i - 1] = y * c + z * s;
	            u[j][i] = -y * s + z * c;
	          }
	        }

	        e[l] = 0.0;
	        e[k] = f;
	        q[k] = x;
	      }
	    } //vt= transpose(v)
	    //return (u,q,vt)


	    for (i = 0; i < q.length; i++) if (q[i] < prec) q[i] = 0; //sort eigenvalues	


	    for (i = 0; i < n; i++) {
	      //writeln(q)
	      for (j = i - 1; j >= 0; j--) {
	        if (q[j] < q[i]) {
	          //  writeln(i,'-',j)
	          c = q[j];
	          q[j] = q[i];
	          q[i] = c;

	          for (k = 0; k < u.length; k++) {
	            temp = u[k][i];
	            u[k][i] = u[k][j];
	            u[k][j] = temp;
	          }

	          for (k = 0; k < v.length; k++) {
	            temp = v[k][i];
	            v[k][i] = v[k][j];
	            v[k][j] = temp;
	          } //	   u.swapCols(i,j)
	          //	   v.swapCols(i,j)


	          i = j;
	        }
	      }
	    }

	    return {
	      U: u,
	      S: q,
	      V: v
	    };
	  };
	});

	var H = {
		name: "hydrogen",
		symbol: "H",
		type: "other-nonmetal",
		number: 1,
		mass: 1.008,
		period: 1,
		group: 1,
		melting: 14.01,
		boiling: 20.28,
		density: 0.00008988,
		electronegativity: 2.2,
		radius: 25,
		valence: 1,
		specificheat: 14.304,
		comment: ""
	};
	var He = {
		name: "helium",
		symbol: "He",
		type: "noble-gas",
		number: 2,
		mass: 4.002602,
		period: 1,
		group: 18,
		melting: 0.95,
		boiling: 4.22,
		density: 0.0001785,
		electronegativity: "",
		radius: 31,
		valence: 2,
		specificheat: 5.193,
		comment: ""
	};
	var Li = {
		name: "lithium",
		symbol: "Li",
		type: "alkali-metal",
		number: 3,
		mass: 6.94,
		period: 2,
		group: 1,
		melting: 453.69,
		boiling: 1560,
		density: 0.534,
		electronegativity: 0.98,
		radius: 145,
		valence: 1,
		specificheat: 3.582,
		comment: ""
	};
	var Be = {
		name: "beryllium",
		symbol: "Be",
		type: "alkaline-earth",
		number: 4,
		mass: 9.012,
		period: 2,
		group: 2,
		melting: 1560,
		boiling: 2742,
		density: 1.85,
		electronegativity: 1.57,
		radius: 105,
		valence: 2,
		specificheat: 1.825,
		comment: ""
	};
	var B = {
		name: "boron",
		symbol: "B",
		type: "metalloid",
		number: 5,
		mass: 10.81,
		period: 2,
		group: 13,
		melting: 2349,
		boiling: 4200,
		density: 2.34,
		electronegativity: 2.04,
		radius: "",
		valence: "",
		specificheat: 1.026,
		comment: ""
	};
	var C = {
		name: "carbon",
		symbol: "C",
		type: "other-nonmetal",
		number: 6,
		mass: 12.011,
		period: 2,
		group: 14,
		melting: 3800,
		boiling: 4300,
		density: 2.267,
		electronegativity: 2.55,
		radius: "",
		valence: "",
		specificheat: 0.709,
		comment: ""
	};
	var N = {
		name: "nitrogen",
		symbol: "N",
		type: "other-nonmetal",
		number: 7,
		mass: 14.007,
		period: 2,
		group: 15,
		melting: 63.15,
		boiling: 77.36,
		density: 0.0012506,
		electronegativity: 3.04,
		radius: "",
		valence: "",
		specificheat: 1.04,
		comment: ""
	};
	var O = {
		name: "oxygen",
		symbol: "O",
		type: "other-nonmetal",
		number: 8,
		mass: 15.999,
		period: 2,
		group: 16,
		melting: 54.36,
		boiling: 90.2,
		density: 0.001429,
		electronegativity: 3.44,
		radius: "",
		valence: "",
		specificheat: 0.918,
		comment: ""
	};
	var F = {
		name: "fluorine",
		symbol: "F",
		type: "halogen",
		number: 9,
		mass: 18.998,
		period: 2,
		group: 17,
		melting: 53.53,
		boiling: 85.03,
		density: 0.001696,
		electronegativity: 3.98,
		radius: "",
		valence: "",
		specificheat: 0.824,
		comment: ""
	};
	var Ne = {
		name: "neon",
		symbol: "Ne",
		type: "noble-gas",
		number: 10,
		mass: 20.1797,
		period: 2,
		group: 18,
		melting: 24.56,
		boiling: 27.07,
		density: 0.0008999,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: 1.03,
		comment: ""
	};
	var Na = {
		name: "sodium",
		symbol: "Na",
		type: "alkali-metal",
		number: 11,
		mass: 22.989,
		period: 3,
		group: 1,
		melting: 370.87,
		boiling: 1156,
		density: 0.971,
		electronegativity: 0.93,
		radius: "",
		valence: "",
		specificheat: 1.228,
		comment: ""
	};
	var Mg = {
		name: "magnesium",
		symbol: "Mg",
		type: "alkaline-earth",
		number: 12,
		mass: 24.305,
		period: 3,
		group: 2,
		melting: 923,
		boiling: 1363,
		density: 1.738,
		electronegativity: 1.31,
		radius: "",
		valence: "",
		specificheat: 1.023,
		comment: ""
	};
	var Al = {
		name: "aluminium",
		symbol: "Al",
		type: "post-transition-metal",
		number: 13,
		mass: 26.982,
		period: 3,
		group: 13,
		melting: 933.47,
		boiling: 2792,
		density: 2.698,
		electronegativity: 1.61,
		radius: "",
		valence: "",
		specificheat: 0.897,
		comment: ""
	};
	var Si = {
		name: "silicon",
		symbol: "Si",
		type: "metalloid",
		number: 14,
		mass: 28.085,
		period: 3,
		group: 14,
		melting: 1687,
		boiling: 3538,
		density: 2.3296,
		electronegativity: 1.9,
		radius: "",
		valence: "",
		specificheat: 0.705,
		comment: ""
	};
	var P = {
		name: "phosphorus",
		symbol: "P",
		type: "other-nonmetal",
		number: 15,
		mass: 30.974,
		period: 3,
		group: 15,
		melting: 317.3,
		boiling: 550,
		density: 1.82,
		electronegativity: 2.19,
		radius: "",
		valence: "",
		specificheat: 0.769,
		comment: ""
	};
	var S = {
		name: "sulfur",
		symbol: "S",
		type: "other-nonmetal",
		number: 16,
		mass: 32.06,
		period: 3,
		group: 16,
		melting: 388.36,
		boiling: 717.87,
		density: 2.067,
		electronegativity: 2.58,
		radius: "",
		valence: "",
		specificheat: 0.71,
		comment: ""
	};
	var Cl = {
		name: "chlorine",
		symbol: "Cl",
		type: "halogen",
		number: 17,
		mass: 35.45,
		period: 3,
		group: 17,
		melting: 171.6,
		boiling: 239.11,
		density: 0.003214,
		electronegativity: 3.16,
		radius: "",
		valence: "",
		specificheat: 0.479,
		comment: ""
	};
	var Ar = {
		name: "argon",
		symbol: "Ar",
		type: "noble-gas",
		number: 18,
		mass: 39.948,
		period: 3,
		group: 18,
		melting: 83.8,
		boiling: 87.3,
		density: 0.0017837,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: 0.52,
		comment: ""
	};
	var K = {
		name: "potassium",
		symbol: "K",
		type: "alkali-metal",
		number: 19,
		mass: 39.0983,
		period: 4,
		group: 1,
		melting: 336.53,
		boiling: 1032,
		density: 0.862,
		electronegativity: 0.82,
		radius: "",
		valence: "",
		specificheat: 0.757,
		comment: ""
	};
	var Ca = {
		name: "calcium",
		symbol: "Ca",
		type: "alkaline-earth",
		number: 20,
		mass: 40.078,
		period: 4,
		group: 2,
		melting: 1115,
		boiling: 1757,
		density: 1.54,
		electronegativity: 1,
		radius: "",
		valence: "",
		specificheat: 0.647,
		comment: ""
	};
	var Sc = {
		name: "scandium",
		symbol: "Sc",
		type: "transition-metal",
		number: 21,
		mass: 44.956,
		period: 4,
		group: 3,
		melting: 1814,
		boiling: 3109,
		density: 2.989,
		electronegativity: 1.36,
		radius: "",
		valence: "",
		specificheat: 0.568,
		comment: ""
	};
	var Ti = {
		name: "titanium",
		symbol: "Ti",
		type: "transition-metal",
		number: 22,
		mass: 47.867,
		period: 4,
		group: 4,
		melting: 1941,
		boiling: 3560,
		density: 4.54,
		electronegativity: 1.54,
		radius: "",
		valence: "",
		specificheat: 0.523,
		comment: ""
	};
	var V = {
		name: "vandium",
		symbol: "V",
		type: "transition-metal",
		number: 23,
		mass: 50.9415,
		period: 4,
		group: 5,
		melting: 2183,
		boiling: 3680,
		density: 6.11,
		electronegativity: 1.63,
		radius: "",
		valence: "",
		specificheat: 0.489,
		comment: ""
	};
	var Cr = {
		name: "chromium",
		symbol: "Cr",
		type: "transition-metal",
		number: 24,
		mass: 51.9961,
		period: 4,
		group: 6,
		melting: 2180,
		boiling: 2944,
		density: 7.15,
		electronegativity: 1.66,
		radius: "",
		valence: "",
		specificheat: 0.449,
		comment: ""
	};
	var Mn = {
		name: "manganese",
		symbol: "Mn",
		type: "transition-metal",
		number: 25,
		mass: 54.938,
		period: 4,
		group: 7,
		melting: 1519,
		boiling: 2334,
		density: 7.44,
		electronegativity: 1.55,
		radius: "",
		valence: "",
		specificheat: 0.479,
		comment: ""
	};
	var Fe = {
		name: "iron",
		symbol: "Fe",
		type: "transition-metal",
		number: 26,
		mass: 55.845,
		period: 4,
		group: 8,
		melting: 1811,
		boiling: 3134,
		density: 7.874,
		electronegativity: 1.83,
		radius: "",
		valence: "",
		specificheat: 0.449,
		comment: ""
	};
	var Co = {
		name: "cobalt",
		symbol: "Co",
		type: "transition-metal",
		number: 27,
		mass: 58.933,
		period: 4,
		group: 9,
		melting: 1768,
		boiling: 3200,
		density: 8.86,
		electronegativity: 1.88,
		radius: "",
		valence: "",
		specificheat: 0.421,
		comment: ""
	};
	var Ni = {
		name: "nickel",
		symbol: "Ni",
		type: "transition-metal",
		number: 28,
		mass: 58.6934,
		period: 4,
		group: 10,
		melting: 1728,
		boiling: 3186,
		density: 8.912,
		electronegativity: 1.91,
		radius: "",
		valence: "",
		specificheat: 0.444,
		comment: ""
	};
	var Cu = {
		name: "copper",
		symbol: "Cu",
		type: "transition-metal",
		number: 29,
		mass: 63.546,
		period: 4,
		group: 11,
		melting: 1357.77,
		boiling: 2835,
		density: 8.96,
		electronegativity: 1.9,
		radius: "",
		valence: "",
		specificheat: 0.385,
		comment: ""
	};
	var Zn = {
		name: "zinc",
		symbol: "Zn",
		type: "transition-metal",
		number: 30,
		mass: 65.38,
		period: 4,
		group: 12,
		melting: 692.88,
		boiling: 1180,
		density: 7.134,
		electronegativity: 1.65,
		radius: "",
		valence: "",
		specificheat: 0.388,
		comment: ""
	};
	var Ga = {
		name: "gallium",
		symbol: "Ga",
		type: "post-transition-metal",
		number: 31,
		mass: 69.723,
		period: 4,
		group: 13,
		melting: 302.9146,
		boiling: 2477,
		density: 5.907,
		electronegativity: 1.81,
		radius: "",
		valence: "",
		specificheat: 0.371,
		comment: ""
	};
	var Ge = {
		name: "germanium",
		symbol: "Ge",
		type: "metalloid",
		number: 32,
		mass: 72.63,
		period: 4,
		group: 14,
		melting: 1211.4,
		boiling: 3106,
		density: 5.323,
		electronegativity: 2.01,
		radius: "",
		valence: "",
		specificheat: 0.32,
		comment: ""
	};
	var As = {
		name: "arsenic",
		symbol: "As",
		type: "metalloid",
		number: 33,
		mass: 74.921,
		period: 4,
		group: 15,
		melting: 1090,
		boiling: 887,
		density: 5.776,
		electronegativity: 2.18,
		radius: "",
		valence: "",
		specificheat: 0.329,
		comment: ""
	};
	var Se = {
		name: "selenium",
		symbol: "Se",
		type: "other-nonmetal",
		number: 34,
		mass: 78.971,
		period: 4,
		group: 16,
		melting: 453,
		boiling: 958,
		density: 4.809,
		electronegativity: 2.55,
		radius: "",
		valence: "",
		specificheat: 0.321,
		comment: ""
	};
	var Br = {
		name: "bromine",
		symbol: "Br",
		type: "halogen",
		number: 35,
		mass: 79.904,
		period: 4,
		group: 17,
		melting: 265.8,
		boiling: 332,
		density: 3.122,
		electronegativity: 2.96,
		radius: "",
		valence: "",
		specificheat: 0.474,
		comment: ""
	};
	var Kr = {
		name: "krypton",
		symbol: "Kr",
		type: "noble-gas",
		number: 36,
		mass: 83.798,
		period: 4,
		group: 18,
		melting: 115.79,
		boiling: 119.93,
		density: 0.003733,
		electronegativity: 3,
		radius: "",
		valence: "",
		specificheat: 0.248,
		comment: ""
	};
	var Rb = {
		name: "rubidium",
		symbol: "Rb",
		type: "alkali-metal",
		number: 37,
		mass: 85.4678,
		period: 5,
		group: 1,
		melting: 312.46,
		boiling: 961,
		density: 1.532,
		electronegativity: 0.82,
		radius: "",
		valence: "",
		specificheat: 0.363,
		comment: ""
	};
	var Sr = {
		name: "strontium",
		symbol: "Sr",
		type: "alkaline-earth",
		number: 38,
		mass: 87.62,
		period: 5,
		group: 2,
		melting: 1050,
		boiling: 1655,
		density: 2.64,
		electronegativity: 0.95,
		radius: "",
		valence: "",
		specificheat: 0.301,
		comment: ""
	};
	var Y = {
		name: "yttrium",
		symbol: "Y",
		type: "transition-metal",
		number: 39,
		mass: 88.906,
		period: 5,
		group: 3,
		melting: 1799,
		boiling: 3609,
		density: 4.469,
		electronegativity: 1.22,
		radius: "",
		valence: "",
		specificheat: 0.298,
		comment: ""
	};
	var Zr = {
		name: "zirconium",
		symbol: "Zr",
		type: "transition-metal",
		number: 40,
		mass: 91.224,
		period: 5,
		group: 4,
		melting: 2128,
		boiling: 4682,
		density: 6.506,
		electronegativity: 1.33,
		radius: "",
		valence: "",
		specificheat: 0.278,
		comment: ""
	};
	var Nb = {
		name: "niobium",
		symbol: "Nb",
		type: "transition-metal",
		number: 41,
		mass: 92.9064,
		period: 5,
		group: 5,
		melting: 2750,
		boiling: 5017,
		density: 8.57,
		electronegativity: 1.6,
		radius: "",
		valence: "",
		specificheat: 0.265,
		comment: ""
	};
	var Mo = {
		name: "molybdenum",
		symbol: "Mo",
		type: "transition-metal",
		number: 42,
		mass: 95.95,
		period: 5,
		group: 6,
		melting: 2896,
		boiling: 4912,
		density: 10.28,
		electronegativity: 2.16,
		radius: "",
		valence: "",
		specificheat: 0.251,
		comment: ""
	};
	var Tc = {
		name: "technetium",
		symbol: "Tc",
		type: "transition-metal",
		number: 43,
		mass: 97,
		period: 5,
		group: 7,
		melting: 2430,
		boiling: 4538,
		density: 11.5,
		electronegativity: 1.9,
		radius: "",
		valence: "",
		specificheat: 0.63,
		comment: ""
	};
	var Ru = {
		name: "ruthenium",
		symbol: "Ru",
		type: "transition-metal",
		number: 44,
		mass: 101.07,
		period: 5,
		group: 8,
		melting: 2607,
		boiling: 4423,
		density: 12.37,
		electronegativity: 2.2,
		radius: "",
		valence: "",
		specificheat: 0.238,
		comment: ""
	};
	var Rh = {
		name: "rhodium",
		symbol: "Rh",
		type: "transition-metal",
		number: 45,
		mass: 102.9055,
		period: 5,
		group: 9,
		melting: 2237,
		boiling: 3968,
		density: 12.41,
		electronegativity: 2.28,
		radius: "",
		valence: "",
		specificheat: 0.243,
		comment: ""
	};
	var Pd = {
		name: "palladium",
		symbol: "Pd",
		type: "transition-metal",
		number: 46,
		mass: 106.42,
		period: 5,
		group: 10,
		melting: 1828.05,
		boiling: 3236,
		density: 12.02,
		electronegativity: 2.2,
		radius: "",
		valence: "",
		specificheat: 0.244,
		comment: ""
	};
	var Ag = {
		name: "silver",
		symbol: "Ag",
		type: "transition-metal",
		number: 47,
		mass: 107.8682,
		period: 5,
		group: 11,
		melting: 1234.93,
		boiling: 2435,
		density: 10.501,
		electronegativity: 1.93,
		radius: "",
		valence: "",
		specificheat: 0.235,
		comment: ""
	};
	var Cd = {
		name: "cadmium",
		symbol: "Cd",
		type: "transition-metal",
		number: 48,
		mass: 112.414,
		period: 5,
		group: 12,
		melting: 594.22,
		boiling: 1040,
		density: 8.69,
		electronegativity: 1.69,
		radius: "",
		valence: "",
		specificheat: 0.232,
		comment: ""
	};
	var In = {
		name: "indium",
		symbol: "In",
		type: "post-transition-metal",
		number: 49,
		mass: 114.818,
		period: 5,
		group: 13,
		melting: 429.75,
		boiling: 2345,
		density: 7.31,
		electronegativity: 1.78,
		radius: "",
		valence: "",
		specificheat: 0.233,
		comment: ""
	};
	var Sn = {
		name: "tin",
		symbol: "Sn",
		type: "post-transition-metal",
		number: 50,
		mass: 118.71,
		period: 5,
		group: 14,
		melting: 505.08,
		boiling: 2875,
		density: 7.287,
		electronegativity: 1.96,
		radius: "",
		valence: "",
		specificheat: 0.228,
		comment: ""
	};
	var Sb = {
		name: "antimony",
		symbol: "Sb",
		type: "metalloid",
		number: 51,
		mass: 121.76,
		period: 5,
		group: 15,
		melting: 903.78,
		boiling: 1860,
		density: 6.685,
		electronegativity: 2.05,
		radius: "",
		valence: "",
		specificheat: 0.207,
		comment: ""
	};
	var Te = {
		name: "tellurium",
		symbol: "Te",
		type: "metalloid",
		number: 52,
		mass: 127.6,
		period: 5,
		group: 16,
		melting: 722.66,
		boiling: 1261,
		density: 6.232,
		electronegativity: 2.1,
		radius: "",
		valence: "",
		specificheat: 0.202,
		comment: ""
	};
	var I = {
		name: "iodine",
		symbol: "I",
		type: "halogen",
		number: 53,
		mass: 126.90447,
		period: 5,
		group: 17,
		melting: 386.85,
		boiling: 457.4,
		density: 4.93,
		electronegativity: 2.66,
		radius: "",
		valence: "",
		specificheat: 0.214,
		comment: ""
	};
	var Xe = {
		name: "xenon",
		symbol: "Xe",
		type: "noble-gas",
		number: 54,
		mass: 131.293,
		period: 5,
		group: 18,
		melting: 161.4,
		boiling: 165.03,
		density: 0.005887,
		electronegativity: 2.6,
		radius: "",
		valence: "",
		specificheat: 0.158,
		comment: ""
	};
	var Cs = {
		name: "caesium",
		symbol: "Cs",
		type: "alkali-metal",
		number: 55,
		mass: 132.9055,
		period: 6,
		group: 1,
		melting: 301.59,
		boiling: 944,
		density: 1.873,
		electronegativity: 0.79,
		radius: "",
		valence: "",
		specificheat: 0.242,
		comment: ""
	};
	var Ba = {
		name: "barium",
		symbol: "Ba",
		type: "alkaline-earth",
		number: 56,
		mass: 137.327,
		period: 6,
		group: 2,
		melting: 1000,
		boiling: 2170,
		density: 3.594,
		electronegativity: 0.89,
		radius: "",
		valence: "",
		specificheat: 0.204,
		comment: ""
	};
	var La = {
		name: "Lanthanum",
		symbol: "La",
		type: "lanthanoid",
		number: 57,
		mass: 138.9055,
		period: 6,
		group: "",
		melting: 1193,
		boiling: 3737,
		density: 6.145,
		electronegativity: 1.1,
		radius: "",
		valence: "",
		specificheat: 0.195,
		comment: ""
	};
	var Ce = {
		name: "cerium",
		symbol: "Ce",
		type: "lanthanoid",
		number: 58,
		mass: 140.116,
		period: 6,
		group: "",
		melting: 1068,
		boiling: 3716,
		density: 6.77,
		electronegativity: 1.12,
		radius: "",
		valence: "",
		specificheat: 0.192,
		comment: ""
	};
	var Pr = {
		name: "praseodymium",
		symbol: "Pr",
		type: "lanthanoid",
		number: 59,
		mass: 140.90766,
		period: 6,
		group: "",
		melting: 1208,
		boiling: 3793,
		density: 6.773,
		electronegativity: 1.13,
		radius: "",
		valence: "",
		specificheat: 0.193,
		comment: ""
	};
	var Nd = {
		name: "neodymium",
		symbol: "Nd",
		type: "lanthanoid",
		number: 60,
		mass: 144.242,
		period: 6,
		group: "",
		melting: 1297,
		boiling: 3347,
		density: 7.007,
		electronegativity: 1.14,
		radius: "",
		valence: "",
		specificheat: 0.19,
		comment: ""
	};
	var Pm = {
		name: "promethium",
		symbol: "Pm",
		type: "lanthanoid",
		number: 61,
		mass: 145,
		period: 6,
		group: "",
		melting: 1315,
		boiling: 3273,
		density: 7.26,
		electronegativity: 1.13,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Sm = {
		name: "samarium",
		symbol: "Sm",
		type: "lanthanoid",
		number: 62,
		mass: 150.36,
		period: 6,
		group: "",
		melting: 1345,
		boiling: 2067,
		density: 7.52,
		electronegativity: 1.17,
		radius: "",
		valence: "",
		specificheat: 0.197,
		comment: ""
	};
	var Eu = {
		name: "europium",
		symbol: "Eu",
		type: "lanthanoid",
		number: 63,
		mass: 151.964,
		period: 6,
		group: "",
		melting: 1099,
		boiling: 1802,
		density: 5.243,
		electronegativity: 1.2,
		radius: "",
		valence: "",
		specificheat: 0.182,
		comment: ""
	};
	var Gd = {
		name: "gadolinium",
		symbol: "Gd",
		type: "lanthanoid",
		number: 64,
		mass: 157.25,
		period: 6,
		group: "",
		melting: 1585,
		boiling: 3546,
		density: 7.895,
		electronegativity: 1.2,
		radius: "",
		valence: "",
		specificheat: 0.236,
		comment: ""
	};
	var Tb = {
		name: "terbium",
		symbol: "Tb",
		type: "lanthanoid",
		number: 65,
		mass: 158.92535,
		period: 6,
		group: "",
		melting: 1629,
		boiling: 3503,
		density: 8.229,
		electronegativity: 1.2,
		radius: "",
		valence: "",
		specificheat: 0.182,
		comment: ""
	};
	var Dy = {
		name: "dysprosium",
		symbol: "Dy",
		type: "lanthanoid",
		number: 66,
		mass: 162.5,
		period: 6,
		group: "",
		melting: 1680,
		boiling: 2840,
		density: 8.55,
		electronegativity: 1.22,
		radius: "",
		valence: "",
		specificheat: 0.17,
		comment: ""
	};
	var Ho = {
		name: "holmium",
		symbol: "Ho",
		type: "lanthanoid",
		number: 67,
		mass: 164.93033,
		period: 6,
		group: "",
		melting: 1734,
		boiling: 2993,
		density: 8.795,
		electronegativity: 1.23,
		radius: "",
		valence: "",
		specificheat: 0.165,
		comment: ""
	};
	var Er = {
		name: "erbium",
		symbol: "Er",
		type: "lanthanoid",
		number: 68,
		mass: 167.259,
		period: 6,
		group: "",
		melting: 1802,
		boiling: 3141,
		density: 9.066,
		electronegativity: 1.24,
		radius: "",
		valence: "",
		specificheat: 0.168,
		comment: ""
	};
	var Tm = {
		name: "thulium",
		symbol: "Tm",
		type: "lanthanoid",
		number: 69,
		mass: 168.9342,
		period: 6,
		group: "",
		melting: 1818,
		boiling: 2223,
		density: 9.321,
		electronegativity: 1.25,
		radius: "",
		valence: "",
		specificheat: 0.16,
		comment: ""
	};
	var Yb = {
		name: "ytterbium",
		symbol: "Yb",
		type: "lanthanoid",
		number: 70,
		mass: 173.045,
		period: 6,
		group: "",
		melting: 1097,
		boiling: 1469,
		density: 6.965,
		electronegativity: 1.1,
		radius: "",
		valence: "",
		specificheat: 0.155,
		comment: ""
	};
	var Lu = {
		name: "lutetium",
		symbol: "Lu",
		type: "lanthanoid",
		number: 71,
		mass: 174.9668,
		period: 6,
		group: 3,
		melting: 1925,
		boiling: 3675,
		density: 9.84,
		electronegativity: 1.27,
		radius: "",
		valence: "",
		specificheat: 0.154,
		comment: ""
	};
	var Hf = {
		name: "hafnium",
		symbol: "Hf",
		type: "transition-metal",
		number: 72,
		mass: 178.49,
		period: 6,
		group: 4,
		melting: 2506,
		boiling: 4876,
		density: 13.31,
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: 0.1444,
		comment: ""
	};
	var Ta = {
		name: "tantalum",
		symbol: "Ta",
		type: "transition-metal",
		number: 73,
		mass: 180.94788,
		period: 6,
		group: 5,
		melting: 3290,
		boiling: 5731,
		density: 16.654,
		electronegativity: 1.5,
		radius: "",
		valence: "",
		specificheat: 0.14,
		comment: ""
	};
	var W = {
		name: "tungsten",
		symbol: "W",
		type: "transition-metal",
		number: 74,
		mass: 183.84,
		period: 6,
		group: 6,
		melting: 3290,
		boiling: 5731,
		density: 16.654,
		electronegativity: 1.5,
		radius: "",
		valence: "",
		specificheat: 0.14,
		comment: ""
	};
	var Re = {
		name: "rhenium",
		symbol: "Re",
		type: "transition-metal",
		number: 75,
		mass: 186.207,
		period: 6,
		group: 7,
		melting: 3459,
		boiling: 5869,
		density: 21.02,
		electronegativity: 1.9,
		radius: "",
		valence: "",
		specificheat: 1.37,
		comment: ""
	};
	var Os = {
		name: "osmium",
		symbol: "Os",
		type: "transition-metal",
		number: 76,
		mass: 190.23,
		period: 6,
		group: 8,
		melting: 3306,
		boiling: 5285,
		density: 22.61,
		electronegativity: 2.2,
		radius: "",
		valence: "",
		specificheat: 0.13,
		comment: ""
	};
	var Ir = {
		name: "iridium",
		symbol: "Ir",
		type: "transition-metal",
		number: 77,
		mass: 192.217,
		period: 6,
		group: 9,
		melting: 2719,
		boiling: 4701,
		density: 22.56,
		electronegativity: 2.2,
		radius: "",
		valence: "",
		specificheat: 0.131,
		comment: ""
	};
	var Pt = {
		name: "platinum",
		symbol: "Pt",
		type: "transition-metal",
		number: 78,
		mass: 195.084,
		period: 6,
		group: 10,
		melting: 2041.4,
		boiling: 4098,
		density: 21.46,
		electronegativity: 2.28,
		radius: "",
		valence: "",
		specificheat: 0.133,
		comment: ""
	};
	var Au = {
		name: "gold",
		symbol: "Au",
		type: "transition-metal",
		number: 79,
		mass: 196.966569,
		period: 6,
		group: 11,
		melting: 1337.33,
		boiling: 3129,
		density: 19.282,
		electronegativity: 2.54,
		radius: "",
		valence: "",
		specificheat: 0.129,
		comment: ""
	};
	var Hg = {
		name: "mercury",
		symbol: "Hg",
		type: "transition-metal",
		number: 80,
		mass: 200.592,
		period: 6,
		group: 12,
		melting: 234.43,
		boiling: 629.88,
		density: 13.5336,
		electronegativity: 2,
		radius: "",
		valence: "",
		specificheat: 0.14,
		comment: ""
	};
	var Tl = {
		name: "thalium",
		symbol: "Tl",
		type: "post-transition-metal",
		number: 81,
		mass: 204.38,
		period: 6,
		group: 13,
		melting: 577,
		boiling: 1746,
		density: 11.85,
		electronegativity: 1.62,
		radius: "",
		valence: "",
		specificheat: 0.129,
		comment: ""
	};
	var Pb = {
		name: "lead",
		symbol: "Pb",
		type: "post-transition-metal",
		number: 82,
		mass: 207.2,
		period: 6,
		group: 14,
		melting: 600.61,
		boiling: 2022,
		density: 11.342,
		electronegativity: 1.87,
		radius: "",
		valence: "",
		specificheat: 0.129,
		comment: ""
	};
	var Bi = {
		name: "bismuth",
		symbol: "Bi",
		type: "post-transition-metal",
		number: 83,
		mass: 208.9804,
		period: 6,
		group: 15,
		melting: 544.7,
		boiling: 1837,
		density: 9.807,
		electronegativity: 2.02,
		radius: "",
		valence: "",
		specificheat: 0.122,
		comment: ""
	};
	var Po = {
		name: "polonium",
		symbol: "Po",
		type: "metalloid",
		number: 84,
		mass: 209,
		period: 6,
		group: 16,
		melting: 527,
		boiling: 1235,
		density: 9.32,
		electronegativity: 2,
		radius: "",
		valence: "",
		specificheat: 0.125,
		comment: ""
	};
	var At = {
		name: "astatine",
		symbol: "At",
		type: "halogen",
		number: 85,
		mass: 210,
		period: 6,
		group: 17,
		melting: 575,
		boiling: 610,
		density: 7,
		electronegativity: 2.2,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Rn = {
		name: "radon",
		symbol: "Rn",
		type: "noble-gas",
		number: 86,
		mass: 222,
		period: 6,
		group: 18,
		melting: 202,
		boiling: 211.3,
		density: 0.00973,
		electronegativity: 2.2,
		radius: "",
		valence: "",
		specificheat: 0.094,
		comment: ""
	};
	var Fr = {
		name: "francium",
		symbol: "Fr",
		type: "alkali-metal",
		number: 87,
		mass: 223,
		period: 7,
		group: 1,
		melting: 300,
		boiling: 950,
		density: 1.87,
		electronegativity: 0.7,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Ra = {
		name: "radium",
		symbol: "Ra",
		type: "alkaline-earth",
		number: 88,
		mass: 226,
		period: 7,
		group: 2,
		melting: 973,
		boiling: 2010,
		density: 5.5,
		electronegativity: 0.9,
		radius: "",
		valence: "",
		specificheat: 0.094,
		comment: ""
	};
	var Ac = {
		name: "actinium",
		symbol: "Ac",
		type: "actinoid",
		number: 89,
		mass: 227,
		period: 7,
		group: "",
		melting: 1323,
		boiling: 3471,
		density: 10.07,
		electronegativity: 1.1,
		radius: "",
		valence: "",
		specificheat: 0.12,
		comment: ""
	};
	var Th = {
		name: "thorium",
		symbol: "Th",
		type: "actinoid",
		number: 90,
		mass: 232.0377,
		period: 7,
		group: "",
		melting: 2115,
		boiling: 5061,
		density: 11.72,
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: 0.113,
		comment: ""
	};
	var Pa = {
		name: "protactinium",
		symbol: "Pa",
		type: "actinoid",
		number: 91,
		mass: 231.03588,
		period: 7,
		group: "",
		melting: 1841,
		boiling: 4300,
		density: 15.37,
		electronegativity: 1.5,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var U = {
		name: "uranium",
		symbol: "U",
		type: "actinoid",
		number: 92,
		mass: 238.02891,
		period: 7,
		group: "",
		melting: 1405.3,
		boiling: 4404,
		density: 18.95,
		electronegativity: 1.38,
		radius: "",
		valence: "",
		specificheat: 0.116,
		comment: ""
	};
	var Np = {
		name: "neptunium",
		symbol: "Np",
		type: "actinoid",
		number: 93,
		mass: 237,
		period: 7,
		group: "",
		melting: 917,
		boiling: 4273,
		density: 20.45,
		electronegativity: 1.36,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Pu = {
		name: "plutonium",
		symbol: "Pu",
		type: "actinoid",
		number: 94,
		mass: 244,
		period: 7,
		group: "",
		melting: 912.5,
		boiling: 3501,
		density: 19.84,
		electronegativity: 1.28,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Am = {
		name: "americium",
		symbol: "Am",
		type: "actinoid",
		number: 95,
		mass: 243,
		period: 7,
		group: "",
		melting: 1449,
		boiling: 2880,
		density: 13.69,
		electronegativity: 1.13,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Cm = {
		name: "curium",
		symbol: "Cm",
		type: "actinoid",
		number: 96,
		mass: 247,
		period: 7,
		group: "",
		melting: 1613,
		boiling: 3383,
		density: 13.51,
		electronegativity: 1.28,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Bk = {
		name: "berkelium",
		symbol: "Bk",
		type: "actinoid",
		number: 97,
		mass: 247,
		period: 7,
		group: "",
		melting: 1259,
		boiling: 2900,
		density: 14.79,
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Cf = {
		name: "californium",
		symbol: "Cf",
		type: "actinoid",
		number: 98,
		mass: 251,
		period: 7,
		group: "",
		melting: 1173,
		boiling: 1743,
		density: 15.1,
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Es = {
		name: "einsteinium",
		symbol: "Es",
		type: "actinoid",
		number: 99,
		mass: 252,
		period: 7,
		group: "",
		melting: 1133,
		boiling: 1269,
		density: 8.84,
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Fm = {
		name: "fermium",
		symbol: "Fm",
		type: "actinoid",
		number: 100,
		mass: 257,
		period: 7,
		group: "",
		melting: 1125,
		boiling: "",
		density: "",
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Md = {
		name: "mendelevium",
		symbol: "Md",
		type: "actinoid",
		number: 101,
		mass: 258,
		period: 7,
		group: "",
		melting: 1100,
		boiling: "",
		density: "",
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var No = {
		name: "nobelium",
		symbol: "No",
		type: "actinoid",
		number: 102,
		mass: 259,
		period: 7,
		group: "",
		melting: 1100,
		boiling: "",
		density: "",
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Lr = {
		name: "lawrencium",
		symbol: "Lr",
		type: "actinoid",
		number: 103,
		mass: 262,
		period: 7,
		group: 3,
		melting: 1900,
		boiling: "",
		density: "",
		electronegativity: 1.3,
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Rf = {
		name: "rutherforium",
		symbol: "Rf",
		type: "transition-metal",
		number: 104,
		mass: 267,
		period: 7,
		group: 4,
		melting: 2400,
		boiling: 5800,
		density: 23.2,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Db = {
		name: "dubnium",
		symbol: "Db",
		type: "transition-metal",
		number: 105,
		mass: 270,
		period: 7,
		group: 5,
		melting: "",
		boiling: "",
		density: 29.3,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Sg = {
		name: "seaborgium",
		symbol: "Sg",
		type: "transition-metal",
		number: 106,
		mass: 269,
		period: 7,
		group: 6,
		melting: "",
		boiling: "",
		density: 35,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Bh = {
		name: "bohrium",
		symbol: "Bh",
		type: "transition-metal",
		number: 107,
		mass: 270,
		period: 7,
		group: 7,
		melting: "",
		boiling: "",
		density: 37.1,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Hs = {
		name: "hassium",
		symbol: "Hs",
		type: "transition-metal",
		number: 108,
		mass: 270,
		period: 7,
		group: 8,
		melting: "",
		boiling: "",
		density: 40.7,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Mt = {
		name: "meitnerium",
		symbol: "Mt",
		type: "transition-metal",
		number: 109,
		mass: 278,
		period: 7,
		group: 9,
		melting: "",
		boiling: "",
		density: 37.4,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Ds = {
		name: "darmstadtium",
		symbol: "Ds",
		type: "transition-metal",
		number: 110,
		mass: 281,
		period: 7,
		group: 10,
		melting: "",
		boiling: "",
		density: 34.8,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Rg = {
		name: "roentgenium",
		symbol: "Rg",
		type: "transition-metal",
		number: 111,
		mass: 281,
		period: 7,
		group: 11,
		melting: "",
		boiling: "",
		density: 28.7,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Cn = {
		name: "copernicium",
		symbol: "Cn",
		type: "transition-metal",
		number: 112,
		mass: 285,
		period: 7,
		group: 12,
		melting: "",
		boiling: 357,
		density: 23.7,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Nh = {
		name: "nihonium",
		symbol: "Nh",
		type: "post-transition-metal",
		number: 113,
		mass: 286,
		period: 7,
		group: 13,
		melting: 700,
		boiling: 1400,
		density: 16,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Fl = {
		name: "flerovium",
		symbol: "Fl",
		type: "post-transition-metal",
		number: 114,
		mass: 289,
		period: 7,
		group: 14,
		melting: 340,
		boiling: 420,
		density: 14,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Mc = {
		name: "moscovium",
		symbol: "Mc",
		type: "post-transition-metal",
		number: 115,
		mass: 289,
		period: 7,
		group: 15,
		melting: 700,
		boiling: 1400,
		density: 13.5,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Lv = {
		name: "livermorium",
		symbol: "Lv",
		type: "post-transition-metal",
		number: 116,
		mass: 293,
		period: 7,
		group: 16,
		melting: 708.5,
		boiling: 1085,
		density: 12.9,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Ts = {
		name: "tennessine",
		symbol: "Ts",
		type: "halogen",
		number: 117,
		mass: 293,
		period: 7,
		group: 17,
		melting: 673,
		boiling: 823,
		density: 7.2,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var Og = {
		name: "oganesson",
		symbol: "Og",
		type: "noble-gas",
		number: 118,
		mass: 294,
		period: 7,
		group: 18,
		melting: 258,
		boiling: 263,
		density: 5,
		electronegativity: "",
		radius: "",
		valence: "",
		specificheat: "",
		comment: ""
	};
	var elements = {
		H: H,
		He: He,
		Li: Li,
		Be: Be,
		B: B,
		C: C,
		N: N,
		O: O,
		F: F,
		Ne: Ne,
		Na: Na,
		Mg: Mg,
		Al: Al,
		Si: Si,
		P: P,
		S: S,
		Cl: Cl,
		Ar: Ar,
		K: K,
		Ca: Ca,
		Sc: Sc,
		Ti: Ti,
		V: V,
		Cr: Cr,
		Mn: Mn,
		Fe: Fe,
		Co: Co,
		Ni: Ni,
		Cu: Cu,
		Zn: Zn,
		Ga: Ga,
		Ge: Ge,
		As: As,
		Se: Se,
		Br: Br,
		Kr: Kr,
		Rb: Rb,
		Sr: Sr,
		Y: Y,
		Zr: Zr,
		Nb: Nb,
		Mo: Mo,
		Tc: Tc,
		Ru: Ru,
		Rh: Rh,
		Pd: Pd,
		Ag: Ag,
		Cd: Cd,
		In: In,
		Sn: Sn,
		Sb: Sb,
		Te: Te,
		I: I,
		Xe: Xe,
		Cs: Cs,
		Ba: Ba,
		La: La,
		Ce: Ce,
		Pr: Pr,
		Nd: Nd,
		Pm: Pm,
		Sm: Sm,
		Eu: Eu,
		Gd: Gd,
		Tb: Tb,
		Dy: Dy,
		Ho: Ho,
		Er: Er,
		Tm: Tm,
		Yb: Yb,
		Lu: Lu,
		Hf: Hf,
		Ta: Ta,
		W: W,
		Re: Re,
		Os: Os,
		Ir: Ir,
		Pt: Pt,
		Au: Au,
		Hg: Hg,
		Tl: Tl,
		Pb: Pb,
		Bi: Bi,
		Po: Po,
		At: At,
		Rn: Rn,
		Fr: Fr,
		Ra: Ra,
		Ac: Ac,
		Th: Th,
		Pa: Pa,
		U: U,
		Np: Np,
		Pu: Pu,
		Am: Am,
		Cm: Cm,
		Bk: Bk,
		Cf: Cf,
		Es: Es,
		Fm: Fm,
		Md: Md,
		No: No,
		Lr: Lr,
		Rf: Rf,
		Db: Db,
		Sg: Sg,
		Bh: Bh,
		Hs: Hs,
		Mt: Mt,
		Ds: Ds,
		Rg: Rg,
		Cn: Cn,
		Nh: Nh,
		Fl: Fl,
		Mc: Mc,
		Lv: Lv,
		Ts: Ts,
		Og: Og
	};

	class Compound {
	  constructor(element_list) {
	    this.elements = {};
	    this.elementsList = [];

	    if (element_list) {
	      for (var element in element_list) {
	        let quantity = element_list[element];
	        this.add(element, quantity);
	      }
	    }
	  }

	  add(element, quantity) {
	    quantity = quantity || 1;

	    if (!elements[element]) {
	      return false;
	    }

	    if (this.elements[element]) {
	      this.elements[element] += quantity;
	    } else {
	      this.elements[element] = quantity;
	      this.elementsList.push(element);
	    }

	    return true;
	  }

	  remove(element, quantity) {
	    quantity = quantity || 1;

	    if (!elements[element] || !this.elements[element]) {
	      return false;
	    }

	    let elementCount = this.elements[element];

	    if (quantity >= elementCount) {
	      delete this.elements[element];
	      this.elementsList.splice(this.elementsList.indexOf(element), 1);
	    } else {
	      this.elements[element] -= quantity;
	    }

	    return true;
	  }

	  clear() {
	    this.elements = {};
	    this.elementsList = [];
	  }

	  getMass() {
	    let mass = 0; // Okay okay, if I have time i'll find better names, this is getting nuts.

	    for (var element in this.elements) {
	      mass += this.elements[element] * elements[element].mass;
	    }

	    return mass;
	  }

	  getPercentages() {
	    let self = this;
	    let mass = this.getMass();
	    let percentages = this.elementsList.map(function (el) {
	      return {
	        element: el,
	        percentage: self.elements[el] * elements[el].mass / mass
	      };
	    });
	    return percentages;
	  }

	  toHTML() {
	    let html = '';

	    for (var element in this.elements) {
	      let quantity = this.elements[element];
	      html += element;
	      html += quantity <= 1 ? '' : '<sub>' + quantity + '</sub>';
	    }

	    return html;
	  }

	}

	var Compound_1 = Compound;

	class PeriodicTable {
	  static getElement(el) {
	    if (elements[el]) {
	      return elements[el];
	    } else {
	      return null;
	    }
	  }

	  static getAtomic(atomicNumber) {
	    let results = filterElements(v => {
	      return elements[v].number == atomicNumber;
	    });
	    return results[0] || null;
	  }

	  static getGroup(group) {
	    let results = filterElements(v => {
	      return elements[v].group == group;
	    });

	    if (results.length <= 0) {
	      return null;
	    }

	    return results || null;
	  }

	  static getPeriod(period) {
	    let results = filterElements(v => {
	      return elements[v].period == period;
	    });

	    if (results.length <= 0) {
	      return null;
	    }

	    return results || null;
	  }

	  static getType(type) {
	    let results = filterElements(v => {
	      return elements[v].type == type;
	    });

	    if (results.length <= 0) {
	      return null;
	    }

	    return results || null;
	  }

	}

	function filterElements(filter) {
	  let results = Object.keys(elements).filter(filter).map(v => {
	    return elements[v];
	  });
	  return results;
	}

	var PeriodicTable_1 = PeriodicTable;

	class Utility {
	  static stringToElementList(str) {
	    var list = {};
	    var matches = str.match(/(([A-Z]{1}[a-z]*)([0-9]*))/g);

	    for (var i in matches) {
	      var fragment = matches[i];
	      var element = fragment.match(/([A-Z]{1}[a-z]*)/g);

	      if (PeriodicTable_1.getElement(element) === null) {
	        return null;
	      }

	      var quantity = fragment.match(/([0-9]+)/g) || 1;
	      list[element] = parseInt(quantity) + (list[element] || 0);
	    }

	    return list;
	  }

	}

	var Utility_1 = Utility;

	var mendeleev = {
	  Compound: Compound_1,
	  PeriodicTable: PeriodicTable_1,
	  Utility: Utility_1
	};

	/* Utility functions */

	/**
	 *  Deep clone an object
	 *  @param  {Object}    obj     Object to clone
	 *  @return {Object}            Clone 
	 */

	function deepClone(obj) {
	  return JSON.parse(JSON.stringify(obj));
	}

	var deepClone_1 = deepClone;
	/**
	 *  Cross product of two vectors of 3 elements
	 *  @param  {Array} v1  
	 *  @param  {Array} v2
	 *  @return {Array}     v1 X v2
	 */

	function cross(v1, v2) {
	  return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
	}

	var cross_1 = cross;
	/**
	 *  Returns the unit vector version of v
	 *  @param  {Array} v
	 *  @return {Array}     Unit vector
	 */

	function unit(v) {
	  var n = Math.sqrt(v.reduce(function (s, x) {
	    return s + x * x;
	  }, 0));
	  return v.map(function (x) {
	    return x / n;
	  });
	}

	var unit_1 = unit;
	/**
	 * Reduce a vector to modulo 1 (interval [0,1]). Meant for fractional 
	 * coordinates
	 * @param  {Array} v 
	 * @return {Array}      Reduced vector
	 */

	function mod1(v) {
	  return v.map(function (x) {
	    x = x % 1;
	    return x >= 0 ? x : x + 1;
	  });
	}

	var mod1_1 = mod1;

	var _deg2rad = Math.PI / 180.0;
	/**
	 *  Convert degrees to radians
	 *  @param  {number}    deg     Angle in degrees
	 *  @return {number}            Angle in radians
	 */


	function degToRad(deg) {
	  return deg * _deg2rad;
	}

	var degToRad_1 = degToRad;
	/**
	 *  Convert radians to degrees
	 *  @param  {number}    rad     Angle in radians
	 *  @return {number}            Angle in degrees
	 */

	function radToDeg(rad) {
	  return rad / _deg2rad;
	}

	var radToDeg_1 = radToDeg;
	/**
	 *  Check if an array includes multiple elements
	 *  @param  {Array}     arr     Array to check
	 *  @param  {Array}     elems   Elements to search in arr
	 *  @return {bool}              Whether the check was successful
	 */

	function includesAll(arr, elems) {
	  var ans = true;

	  for (var i = 0; i < elems.length; ++i) {
	    ans = ans && arr.includes(elems[i]);
	  }

	  return ans;
	}

	var includesAll_1 = includesAll;
	var utils = {
	  deepClone: deepClone_1,
	  cross: cross_1,
	  unit: unit_1,
	  mod1: mod1_1,
	  degToRad: degToRad_1,
	  radToDeg: radToDeg_1,
	  includesAll: includesAll_1
	};

	var symdata = {
		"1": {
		pointgroup_international: "C1",
		schoenflies: "C1^1",
		pointgroup_schoenflies: "1",
		international_short: "P1",
		translations: [
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 1,
		choice: "",
		international_full: "P 1",
		hall_symbol: "P 1",
		international: "P 1",
		arithmetic_crystal_class_number: 1,
		arithmetic_crystal_class_symbol: "1P"
	},
		"2": {
		pointgroup_international: "Ci",
		schoenflies: "Ci^1",
		pointgroup_schoenflies: "-1",
		international_short: "P-1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 2,
		choice: "",
		international_full: "P -1",
		hall_symbol: "-P 1",
		international: "P -1",
		arithmetic_crystal_class_number: 2,
		arithmetic_crystal_class_symbol: "-1P"
	},
		"3": {
		pointgroup_international: "C2",
		schoenflies: "C2^1",
		pointgroup_schoenflies: "2",
		international_short: "P2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 3,
		choice: "b",
		international_full: "P 1 2 1",
		hall_symbol: "P 2y",
		international: "P 2 = P 1 2 1",
		arithmetic_crystal_class_number: 3,
		arithmetic_crystal_class_symbol: "2P"
	},
		"4": {
		pointgroup_international: "C2",
		schoenflies: "C2^1",
		pointgroup_schoenflies: "2",
		international_short: "P2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 3,
		choice: "c",
		international_full: "P 1 1 2",
		hall_symbol: "P 2",
		international: "P 2 = P 1 1 2",
		arithmetic_crystal_class_number: 3,
		arithmetic_crystal_class_symbol: "2P"
	},
		"5": {
		pointgroup_international: "C2",
		schoenflies: "C2^1",
		pointgroup_schoenflies: "2",
		international_short: "P2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 3,
		choice: "a",
		international_full: "P 2 1 1",
		hall_symbol: "P 2x",
		international: "P 2 = P 2 1 1",
		arithmetic_crystal_class_number: 3,
		arithmetic_crystal_class_symbol: "2P"
	},
		"6": {
		pointgroup_international: "C2",
		schoenflies: "C2^2",
		pointgroup_schoenflies: "2",
		international_short: "P2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 4,
		choice: "b",
		international_full: "P 1 2_1 1",
		hall_symbol: "P 2yb",
		international: "P 2_1 = P 1 2_1 1",
		arithmetic_crystal_class_number: 3,
		arithmetic_crystal_class_symbol: "2P"
	},
		"7": {
		pointgroup_international: "C2",
		schoenflies: "C2^2",
		pointgroup_schoenflies: "2",
		international_short: "P2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 4,
		choice: "c",
		international_full: "P 1 1 2_1",
		hall_symbol: "P 2c",
		international: "P 2_1 = P 1 1 2_1",
		arithmetic_crystal_class_number: 3,
		arithmetic_crystal_class_symbol: "2P"
	},
		"8": {
		pointgroup_international: "C2",
		schoenflies: "C2^2",
		pointgroup_schoenflies: "2",
		international_short: "P2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 4,
		choice: "a",
		international_full: "P 2_1 1 1",
		hall_symbol: "P 2xa",
		international: "P 2_1 = P 2_1 1 1",
		arithmetic_crystal_class_number: 3,
		arithmetic_crystal_class_symbol: "2P"
	},
		"9": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 5,
		choice: "b1",
		international_full: "C 1 2 1",
		hall_symbol: "C 2y",
		international: "C 2 = C 1 2 1",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"10": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 5,
		choice: "b2",
		international_full: "A 1 2 1",
		hall_symbol: "A 2y",
		international: "C 2 = A 1 2 1",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"11": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 5,
		choice: "b3",
		international_full: "I 1 2 1",
		hall_symbol: "I 2y",
		international: "C 2 = I 1 2 1",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"12": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 5,
		choice: "c1",
		international_full: "A 1 1 2",
		hall_symbol: "A 2",
		international: "C 2 = A 1 1 2",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"13": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 5,
		choice: "c2",
		international_full: "B 1 1 2",
		hall_symbol: "B 2",
		international: "C 2 = B 1 1 2 = B 2",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"14": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 5,
		choice: "c3",
		international_full: "I 1 1 2",
		hall_symbol: "I 2",
		international: "C 2 = I 1 1 2",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"15": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 5,
		choice: "a1",
		international_full: "B 2 1 1",
		hall_symbol: "B 2x",
		international: "C 2 = B 2 1 1",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"16": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 5,
		choice: "a2",
		international_full: "C 2 1 1",
		hall_symbol: "C 2x",
		international: "C 2 = C 2 1 1",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"17": {
		pointgroup_international: "C2",
		schoenflies: "C2^3",
		pointgroup_schoenflies: "2",
		international_short: "C2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 5,
		choice: "a3",
		international_full: "I 2 1 1",
		hall_symbol: "I 2x",
		international: "C 2 = I 2 1 1",
		arithmetic_crystal_class_number: 4,
		arithmetic_crystal_class_symbol: "2C"
	},
		"18": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^1",
		pointgroup_schoenflies: "m",
		international_short: "Pm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 6,
		choice: "b",
		international_full: "P 1 m 1",
		hall_symbol: "P -2y",
		international: "P m = P 1 m 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"19": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^1",
		pointgroup_schoenflies: "m",
		international_short: "Pm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 6,
		choice: "c",
		international_full: "P 1 1 m",
		hall_symbol: "P -2",
		international: "P m = P 1 1 m",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"20": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^1",
		pointgroup_schoenflies: "m",
		international_short: "Pm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 6,
		choice: "a",
		international_full: "P m 1 1",
		hall_symbol: "P -2x",
		international: "P m = P m 1 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"21": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 7,
		choice: "b1",
		international_full: "P 1 c 1",
		hall_symbol: "P -2yc",
		international: "P c = P 1 c 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"22": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 7,
		choice: "b2",
		international_full: "P 1 n 1",
		hall_symbol: "P -2yac",
		international: "P c = P 1 n 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"23": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 7,
		choice: "b3",
		international_full: "P 1 a 1",
		hall_symbol: "P -2ya",
		international: "P c = P 1 a 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"24": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 7,
		choice: "c1",
		international_full: "P 1 1 a",
		hall_symbol: "P -2a",
		international: "P c = P 1 1 a",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"25": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 7,
		choice: "c2",
		international_full: "P 1 1 n",
		hall_symbol: "P -2ab",
		international: "P c = P 1 1 n",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"26": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 7,
		choice: "c3",
		international_full: "P 1 1 b",
		hall_symbol: "P -2b",
		international: "P c = P 1 1 b = P b",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"27": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 7,
		choice: "a1",
		international_full: "P b 1 1",
		hall_symbol: "P -2xb",
		international: "P c = P b 1 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"28": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 7,
		choice: "a2",
		international_full: "P n 1 1",
		hall_symbol: "P -2xbc",
		international: "P c = P n 1 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"29": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^2",
		pointgroup_schoenflies: "m",
		international_short: "Pc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 7,
		choice: "a3",
		international_full: "P c 1 1",
		hall_symbol: "P -2xc",
		international: "P c = P c 1 1",
		arithmetic_crystal_class_number: 5,
		arithmetic_crystal_class_symbol: "mP"
	},
		"30": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 8,
		choice: "b1",
		international_full: "C 1 m 1",
		hall_symbol: "C -2y",
		international: "C m = C 1 m 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"31": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 8,
		choice: "b2",
		international_full: "A 1 m 1",
		hall_symbol: "A -2y",
		international: "C m = A 1 m 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"32": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 8,
		choice: "b3",
		international_full: "I 1 m 1",
		hall_symbol: "I -2y",
		international: "C m = I 1 m 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"33": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 8,
		choice: "c1",
		international_full: "A 1 1 m",
		hall_symbol: "A -2",
		international: "C m = A 1 1 m",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"34": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 8,
		choice: "c2",
		international_full: "B 1 1 m",
		hall_symbol: "B -2",
		international: "C m = B 1 1 m = B m",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"35": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 8,
		choice: "c3",
		international_full: "I 1 1 m",
		hall_symbol: "I -2",
		international: "C m = I 1 1 m",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"36": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 8,
		choice: "a1",
		international_full: "B m 1 1",
		hall_symbol: "B -2x",
		international: "C m = B m 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"37": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 8,
		choice: "a2",
		international_full: "C m 1 1",
		hall_symbol: "C -2x",
		international: "C m = C m 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"38": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^3",
		pointgroup_schoenflies: "m",
		international_short: "Cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 8,
		choice: "a3",
		international_full: "I m 1 1",
		hall_symbol: "I -2x",
		international: "C m = I m 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"39": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "b1",
		international_full: "C 1 c 1",
		hall_symbol: "C -2yc",
		international: "C c = C 1 c 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"40": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "b2",
		international_full: "A 1 n 1",
		hall_symbol: "A -2yac",
		international: "C c = A 1 n 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"41": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "b3",
		international_full: "I 1 a 1",
		hall_symbol: "I -2ya",
		international: "C c = I 1 a 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"42": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "-b1",
		international_full: "A 1 a 1",
		hall_symbol: "A -2ya",
		international: "C c = A 1 a 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"43": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "-b2",
		international_full: "C 1 n 1",
		hall_symbol: "C -2ybc",
		international: "C c = C 1 n 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"44": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "-b3",
		international_full: "I 1 c 1",
		hall_symbol: "I -2yc",
		international: "C c = I 1 c 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"45": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 9,
		choice: "c1",
		international_full: "A 1 1 a",
		hall_symbol: "A -2a",
		international: "C c = A 1 1 a",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"46": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 9,
		choice: "c2",
		international_full: "B 1 1 n",
		hall_symbol: "B -2bc",
		international: "C c = B 1 1 n",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"47": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 9,
		choice: "c3",
		international_full: "I 1 1 b",
		hall_symbol: "I -2b",
		international: "C c = I 1 1 b",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"48": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 9,
		choice: "-c1",
		international_full: "B 1 1 b",
		hall_symbol: "B -2b",
		international: "C c = B 1 1 b = B b",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"49": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 9,
		choice: "-c2",
		international_full: "A 1 1 n",
		hall_symbol: "A -2ac",
		international: "C c = A 1 1 n",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"50": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 9,
		choice: "-c3",
		international_full: "I 1 1 a",
		hall_symbol: "I -2a",
		international: "C c = I 1 1 a",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"51": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "a1",
		international_full: "B b 1 1",
		hall_symbol: "B -2xb",
		international: "C c = B b 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"52": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "a2",
		international_full: "C n 1 1",
		hall_symbol: "C -2xbc",
		international: "C c = C n 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"53": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "a3",
		international_full: "I c 1 1",
		hall_symbol: "I -2xc",
		international: "C c = I c 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"54": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "-a1",
		international_full: "C c 1 1",
		hall_symbol: "C -2xc",
		international: "C c = C c 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"55": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "-a2",
		international_full: "B n 1 1",
		hall_symbol: "B -2xbc",
		international: "C c = B n 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"56": {
		pointgroup_international: "Cs",
		schoenflies: "Cs^4",
		pointgroup_schoenflies: "m",
		international_short: "Cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 9,
		choice: "-a3",
		international_full: "I b 1 1",
		hall_symbol: "I -2xb",
		international: "C c = I b 1 1",
		arithmetic_crystal_class_number: 6,
		arithmetic_crystal_class_symbol: "mC"
	},
		"57": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^1",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 10,
		choice: "b",
		international_full: "P 1 2/m 1",
		hall_symbol: "-P 2y",
		international: "P 2/m = P 1 2/m 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"58": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^1",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 10,
		choice: "c",
		international_full: "P 1 1 2/m",
		hall_symbol: "-P 2",
		international: "P 2/m = P 1 1 2/m",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"59": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^1",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 10,
		choice: "a",
		international_full: "P 2/m 1 1",
		hall_symbol: "-P 2x",
		international: "P 2/m = P 2/m 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"60": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^2",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 11,
		choice: "b",
		international_full: "P 1 2_1/m 1",
		hall_symbol: "-P 2yb",
		international: "P 2_1/m = P 1 2_1/m 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"61": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^2",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 11,
		choice: "c",
		international_full: "P 1 1 2_1/m",
		hall_symbol: "-P 2c",
		international: "P 2_1/m = P 1 1 2_1/m",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"62": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^2",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 11,
		choice: "a",
		international_full: "P 2_1/m 1 1",
		hall_symbol: "-P 2xa",
		international: "P 2_1/m = P 2_1/m 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"63": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 12,
		choice: "b1",
		international_full: "C 1 2/m 1",
		hall_symbol: "-C 2y",
		international: "C 2/m = C 1 2/m 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"64": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 12,
		choice: "b2",
		international_full: "A 1 2/m 1",
		hall_symbol: "-A 2y",
		international: "C 2/m = A 1 2/m 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"65": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 12,
		choice: "b3",
		international_full: "I 1 2/m 1",
		hall_symbol: "-I 2y",
		international: "C 2/m = I 1 2/m 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"66": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 12,
		choice: "c1",
		international_full: "A 1 1 2/m",
		hall_symbol: "-A 2",
		international: "C 2/m = A 1 1 2/m",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"67": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 12,
		choice: "c2",
		international_full: "B 1 1 2/m",
		hall_symbol: "-B 2",
		international: "C 2/m = B 1 1 2/m = B 2/m",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"68": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 12,
		choice: "c3",
		international_full: "I 1 1 2/m",
		hall_symbol: "-I 2",
		international: "C 2/m = I 1 1 2/m",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"69": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 12,
		choice: "a1",
		international_full: "B 2/m 1 1",
		hall_symbol: "-B 2x",
		international: "C 2/m = B 2/m 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"70": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 12,
		choice: "a2",
		international_full: "C 2/m 1 1",
		hall_symbol: "-C 2x",
		international: "C 2/m = C 2/m 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"71": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^3",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 12,
		choice: "a3",
		international_full: "I 2/m 1 1",
		hall_symbol: "-I 2x",
		international: "C 2/m = I 2/m 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"72": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 13,
		choice: "b1",
		international_full: "P 1 2/c 1",
		hall_symbol: "-P 2yc",
		international: "P 2/c = P 1 2/c 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"73": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 13,
		choice: "b2",
		international_full: "P 1 2/n 1",
		hall_symbol: "-P 2yac",
		international: "P 2/c = P 1 2/n 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"74": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 13,
		choice: "b3",
		international_full: "P 1 2/a 1",
		hall_symbol: "-P 2ya",
		international: "P 2/c = P 1 2/a 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"75": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 13,
		choice: "c1",
		international_full: "P 1 1 2/a",
		hall_symbol: "-P 2a",
		international: "P 2/c = P 1 1 2/a",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"76": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 13,
		choice: "c2",
		international_full: "P 1 1 2/n",
		hall_symbol: "-P 2ab",
		international: "P 2/c = P 1 1 2/n",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"77": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 13,
		choice: "c3",
		international_full: "P 1 1 2/b",
		hall_symbol: "-P 2b",
		international: "P 2/c = P 1 1 2/b = P 2/b",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"78": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 13,
		choice: "a1",
		international_full: "P 2/b 1 1",
		hall_symbol: "-P 2xb",
		international: "P 2/c = P 2/b 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"79": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 13,
		choice: "a2",
		international_full: "P 2/n 1 1",
		hall_symbol: "-P 2xbc",
		international: "P 2/c = P 2/n 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"80": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^4",
		pointgroup_schoenflies: "2/m",
		international_short: "P2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 13,
		choice: "a3",
		international_full: "P 2/c 1 1",
		hall_symbol: "-P 2xc",
		international: "P 2/c = P 2/c 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"81": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 14,
		choice: "b1",
		international_full: "P 1 2_1/c 1",
		hall_symbol: "-P 2ybc",
		international: "P 2_1/c = P 1 2_1/c 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"82": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 14,
		choice: "b2",
		international_full: "P 1 2_1/n 1",
		hall_symbol: "-P 2yn",
		international: "P 2_1/c = P 1 2_1/n 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"83": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 14,
		choice: "b3",
		international_full: "P 1 2_1/a 1",
		hall_symbol: "-P 2yab",
		international: "P 2_1/c = P 1 2_1/a 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"84": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 14,
		choice: "c1",
		international_full: "P 1 1 2_1/a",
		hall_symbol: "-P 2ac",
		international: "P 2_1/c = P 1 1 2_1/a",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"85": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 14,
		choice: "c2",
		international_full: "P 1 1 2_1/n",
		hall_symbol: "-P 2n",
		international: "P 2_1/c = P 1 1 2_1/n",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"86": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 14,
		choice: "c3",
		international_full: "P 1 1 2_1/b",
		hall_symbol: "-P 2bc",
		international: "P 2_1/c = P 1 1 2_1/b = P 2_1/b",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"87": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 14,
		choice: "a1",
		international_full: "P 2_1/b 1 1",
		hall_symbol: "-P 2xab",
		international: "P 2_1/c = P 2_1/b 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"88": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 14,
		choice: "a2",
		international_full: "P 2_1/n 1 1",
		hall_symbol: "-P 2xn",
		international: "P 2_1/c = P 2_1/n 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"89": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^5",
		pointgroup_schoenflies: "2/m",
		international_short: "P2_1/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 14,
		choice: "a3",
		international_full: "P 2_1/c 1 1",
		hall_symbol: "-P 2xac",
		international: "P 2_1/c = P 2_1/c 1 1",
		arithmetic_crystal_class_number: 7,
		arithmetic_crystal_class_symbol: "2/mP"
	},
		"90": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "b1",
		international_full: "C 1 2/c 1",
		hall_symbol: "-C 2yc",
		international: "C 2/c = C 1 2/c 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"91": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "b2",
		international_full: "A 1 2/n 1",
		hall_symbol: "-A 2yac",
		international: "C 2/c = A 1 2/n 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"92": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "b3",
		international_full: "I 1 2/a 1",
		hall_symbol: "-I 2ya",
		international: "C 2/c = I 1 2/a 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"93": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "-b1",
		international_full: "A 1 2/a 1",
		hall_symbol: "-A 2ya",
		international: "C 2/c = A 1 2/a 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"94": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "-b2",
		international_full: "C 1 2/n 1",
		hall_symbol: "-C 2ybc",
		international: "C 2/c = C 1 2/n 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"95": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "-b3",
		international_full: "I 1 2/c 1",
		hall_symbol: "-I 2yc",
		international: "C 2/c = I 1 2/c 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"96": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 15,
		choice: "c1",
		international_full: "A 1 1 2/a",
		hall_symbol: "-A 2a",
		international: "C 2/c = A 1 1 2/a",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"97": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 15,
		choice: "c2",
		international_full: "B 1 1 2/n",
		hall_symbol: "-B 2bc",
		international: "C 2/c = B 1 1 2/n",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"98": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 15,
		choice: "c3",
		international_full: "I 1 1 2/b",
		hall_symbol: "-I 2b",
		international: "C 2/c = I 1 1 2/b",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"99": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 15,
		choice: "-c1",
		international_full: "B 1 1 2/b",
		hall_symbol: "-B 2b",
		international: "C 2/c = B 1 1 2/b = B 2/b",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"100": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 15,
		choice: "-c2",
		international_full: "A 1 1 2/n",
		hall_symbol: "-A 2ac",
		international: "C 2/c = A 1 1 2/n",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"101": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 15,
		choice: "-c3",
		international_full: "I 1 1 2/a",
		hall_symbol: "-I 2a",
		international: "C 2/c = I 1 1 2/a",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"102": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "a1",
		international_full: "B 2/b 1 1",
		hall_symbol: "-B 2xb",
		international: "C 2/c = B 2/b 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"103": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "a2",
		international_full: "C 2/n 1 1",
		hall_symbol: "-C 2xbc",
		international: "C 2/c = C 2/n 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"104": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "a3",
		international_full: "I 2/c 1 1",
		hall_symbol: "-I 2xc",
		international: "C 2/c = I 2/c 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"105": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "-a1",
		international_full: "C 2/c 1 1",
		hall_symbol: "-C 2xc",
		international: "C 2/c = C 2/c 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"106": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "-a2",
		international_full: "B 2/n 1 1",
		hall_symbol: "-B 2xbc",
		international: "C 2/c = B 2/n 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"107": {
		pointgroup_international: "C2h",
		schoenflies: "C2h^6",
		pointgroup_schoenflies: "2/m",
		international_short: "C2/c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 15,
		choice: "-a3",
		international_full: "I 2/b 1 1",
		hall_symbol: "-I 2xb",
		international: "C 2/c = I 2/b 1 1",
		arithmetic_crystal_class_number: 8,
		arithmetic_crystal_class_symbol: "2/mC"
	},
		"108": {
		pointgroup_international: "D2",
		schoenflies: "D2^1",
		pointgroup_schoenflies: "222",
		international_short: "P222",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 16,
		choice: "",
		international_full: "P 2 2 2",
		hall_symbol: "P 2 2",
		international: "P 2 2 2",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"109": {
		pointgroup_international: "D2",
		schoenflies: "D2^2",
		pointgroup_schoenflies: "222",
		international_short: "P222_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 17,
		choice: "",
		international_full: "P 2 2 2_1",
		hall_symbol: "P 2c 2",
		international: "P 2 2 2_1",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"110": {
		pointgroup_international: "D2",
		schoenflies: "D2^2",
		pointgroup_schoenflies: "222",
		international_short: "P2_122",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 17,
		choice: "cab",
		international_full: "P 2_1 2 2",
		hall_symbol: "P 2a 2a",
		international: "P 2_1 2 2",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"111": {
		pointgroup_international: "D2",
		schoenflies: "D2^2",
		pointgroup_schoenflies: "222",
		international_short: "P22_12",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 17,
		choice: "bca",
		international_full: "P 2 2_1 2",
		hall_symbol: "P 2 2b",
		international: "P 2 2_1 2",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"112": {
		pointgroup_international: "D2",
		schoenflies: "D2^3",
		pointgroup_schoenflies: "222",
		international_short: "P2_12_12",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 18,
		choice: "",
		international_full: "P 2_1 2_1 2",
		hall_symbol: "P 2 2ab",
		international: "P 2_1 2_1 2",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"113": {
		pointgroup_international: "D2",
		schoenflies: "D2^3",
		pointgroup_schoenflies: "222",
		international_short: "P22_12_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 18,
		choice: "cab",
		international_full: "P 2 2_1 2_1",
		hall_symbol: "P 2bc 2",
		international: "P 2 2_1 2_1",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"114": {
		pointgroup_international: "D2",
		schoenflies: "D2^3",
		pointgroup_schoenflies: "222",
		international_short: "P2_122_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 18,
		choice: "bca",
		international_full: "P 2_1 2 2_1",
		hall_symbol: "P 2ac 2ac",
		international: "P 2_1 2 2_1",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"115": {
		pointgroup_international: "D2",
		schoenflies: "D2^4",
		pointgroup_schoenflies: "222",
		international_short: "P2_12_12_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 19,
		choice: "",
		international_full: "P 2_1 2_1 2_1",
		hall_symbol: "P 2ac 2ab",
		international: "P 2_1 2_1 2_1",
		arithmetic_crystal_class_number: 9,
		arithmetic_crystal_class_symbol: "222P"
	},
		"116": {
		pointgroup_international: "D2",
		schoenflies: "D2^5",
		pointgroup_schoenflies: "222",
		international_short: "C222_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 20,
		choice: "",
		international_full: "C 2 2 2_1",
		hall_symbol: "C 2c 2",
		international: "C 2 2 2_1",
		arithmetic_crystal_class_number: 10,
		arithmetic_crystal_class_symbol: "222C"
	},
		"117": {
		pointgroup_international: "D2",
		schoenflies: "D2^5",
		pointgroup_schoenflies: "222",
		international_short: "A2_122",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 20,
		choice: "cab",
		international_full: "A 2_1 2 2",
		hall_symbol: "A 2a 2a",
		international: "A 2_1 2 2",
		arithmetic_crystal_class_number: 10,
		arithmetic_crystal_class_symbol: "222C"
	},
		"118": {
		pointgroup_international: "D2",
		schoenflies: "D2^5",
		pointgroup_schoenflies: "222",
		international_short: "B22_12",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 20,
		choice: "bca",
		international_full: "B 2 2_1 2",
		hall_symbol: "B 2 2b",
		international: "B 2 2_1 2",
		arithmetic_crystal_class_number: 10,
		arithmetic_crystal_class_symbol: "222C"
	},
		"119": {
		pointgroup_international: "D2",
		schoenflies: "D2^6",
		pointgroup_schoenflies: "222",
		international_short: "C222",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 21,
		choice: "",
		international_full: "C 2 2 2",
		hall_symbol: "C 2 2",
		international: "C 2 2 2",
		arithmetic_crystal_class_number: 10,
		arithmetic_crystal_class_symbol: "222C"
	},
		"120": {
		pointgroup_international: "D2",
		schoenflies: "D2^6",
		pointgroup_schoenflies: "222",
		international_short: "A222",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 21,
		choice: "cab",
		international_full: "A 2 2 2",
		hall_symbol: "A 2 2",
		international: "A 2 2 2",
		arithmetic_crystal_class_number: 10,
		arithmetic_crystal_class_symbol: "222C"
	},
		"121": {
		pointgroup_international: "D2",
		schoenflies: "D2^6",
		pointgroup_schoenflies: "222",
		international_short: "B222",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 21,
		choice: "bca",
		international_full: "B 2 2 2",
		hall_symbol: "B 2 2",
		international: "B 2 2 2",
		arithmetic_crystal_class_number: 10,
		arithmetic_crystal_class_symbol: "222C"
	},
		"122": {
		pointgroup_international: "D2",
		schoenflies: "D2^7",
		pointgroup_schoenflies: "222",
		international_short: "F222",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 22,
		choice: "",
		international_full: "F 2 2 2",
		hall_symbol: "F 2 2",
		international: "F 2 2 2",
		arithmetic_crystal_class_number: 11,
		arithmetic_crystal_class_symbol: "222F"
	},
		"123": {
		pointgroup_international: "D2",
		schoenflies: "D2^8",
		pointgroup_schoenflies: "222",
		international_short: "I222",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 23,
		choice: "",
		international_full: "I 2 2 2",
		hall_symbol: "I 2 2",
		international: "I 2 2 2",
		arithmetic_crystal_class_number: 12,
		arithmetic_crystal_class_symbol: "222I"
	},
		"124": {
		pointgroup_international: "D2",
		schoenflies: "D2^9",
		pointgroup_schoenflies: "222",
		international_short: "I2_12_12_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 24,
		choice: "",
		international_full: "I 2_1 2_1 2_1",
		hall_symbol: "I 2b 2c",
		international: "I 2_1 2_1 2_1",
		arithmetic_crystal_class_number: 12,
		arithmetic_crystal_class_symbol: "222I"
	},
		"125": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^1",
		pointgroup_schoenflies: "mm2",
		international_short: "Pmm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 25,
		choice: "",
		international_full: "P m m 2",
		hall_symbol: "P 2 -2",
		international: "P m m 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"126": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^1",
		pointgroup_schoenflies: "mm2",
		international_short: "P2mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 25,
		choice: "cab",
		international_full: "P 2 m m",
		hall_symbol: "P -2 2",
		international: "P 2 m m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"127": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^1",
		pointgroup_schoenflies: "mm2",
		international_short: "Pm2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 25,
		choice: "bca",
		international_full: "P m 2 m",
		hall_symbol: "P -2 -2",
		international: "P m 2 m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"128": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^2",
		pointgroup_schoenflies: "mm2",
		international_short: "Pmc2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 26,
		choice: "",
		international_full: "P m c 2_1",
		hall_symbol: "P 2c -2",
		international: "P m c 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"129": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^2",
		pointgroup_schoenflies: "mm2",
		international_short: "Pcm2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 26,
		choice: "ba-c",
		international_full: "P c m 2_1",
		hall_symbol: "P 2c -2c",
		international: "P c m 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"130": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^2",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1ma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 26,
		choice: "cab",
		international_full: "P 2_1 m a",
		hall_symbol: "P -2a 2a",
		international: "P 2_1 m a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"131": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^2",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1am",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 26,
		choice: "-cba",
		international_full: "P 2_1 a m",
		hall_symbol: "P -2 2a",
		international: "P 2_1 a m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"132": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^2",
		pointgroup_schoenflies: "mm2",
		international_short: "Pb2_1m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 26,
		choice: "bca",
		international_full: "P b 2_1 m",
		hall_symbol: "P -2 -2b",
		international: "P b 2_1 m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"133": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^2",
		pointgroup_schoenflies: "mm2",
		international_short: "Pm2_1b",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 26,
		choice: "a-cb",
		international_full: "P m 2_1 b",
		hall_symbol: "P -2b -2",
		international: "P m 2_1 b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"134": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^3",
		pointgroup_schoenflies: "mm2",
		international_short: "Pcc2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 27,
		choice: "",
		international_full: "P c c 2",
		hall_symbol: "P 2 -2c",
		international: "P c c 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"135": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^3",
		pointgroup_schoenflies: "mm2",
		international_short: "P2aa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 27,
		choice: "cab",
		international_full: "P 2 a a",
		hall_symbol: "P -2a 2",
		international: "P 2 a a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"136": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^3",
		pointgroup_schoenflies: "mm2",
		international_short: "Pb2b",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 27,
		choice: "bca",
		international_full: "P b 2 b",
		hall_symbol: "P -2b -2b",
		international: "P b 2 b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"137": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^4",
		pointgroup_schoenflies: "mm2",
		international_short: "Pma2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 28,
		choice: "",
		international_full: "P m a 2",
		hall_symbol: "P 2 -2a",
		international: "P m a 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"138": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^4",
		pointgroup_schoenflies: "mm2",
		international_short: "Pbm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 28,
		choice: "ba-c",
		international_full: "P b m 2",
		hall_symbol: "P 2 -2b",
		international: "P b m 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"139": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^4",
		pointgroup_schoenflies: "mm2",
		international_short: "P2mb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 28,
		choice: "cab",
		international_full: "P 2 m b",
		hall_symbol: "P -2b 2",
		international: "P 2 m b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"140": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^4",
		pointgroup_schoenflies: "mm2",
		international_short: "P2cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 28,
		choice: "-cba",
		international_full: "P 2 c m",
		hall_symbol: "P -2c 2",
		international: "P 2 c m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"141": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^4",
		pointgroup_schoenflies: "mm2",
		international_short: "Pc2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 28,
		choice: "bca",
		international_full: "P c 2 m",
		hall_symbol: "P -2c -2c",
		international: "P c 2 m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"142": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^4",
		pointgroup_schoenflies: "mm2",
		international_short: "Pm2a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 28,
		choice: "a-cb",
		international_full: "P m 2 a",
		hall_symbol: "P -2a -2a",
		international: "P m 2 a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"143": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^5",
		pointgroup_schoenflies: "mm2",
		international_short: "Pca2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 29,
		choice: "",
		international_full: "P c a 2_1",
		hall_symbol: "P 2c -2ac",
		international: "P c a 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"144": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^5",
		pointgroup_schoenflies: "mm2",
		international_short: "Pbc2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 29,
		choice: "ba-c",
		international_full: "P b c 2_1",
		hall_symbol: "P 2c -2b",
		international: "P b c 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"145": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^5",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1ab",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 29,
		choice: "cab",
		international_full: "P 2_1 a b",
		hall_symbol: "P -2b 2a",
		international: "P 2_1 a b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"146": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^5",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1ca",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 29,
		choice: "-cba",
		international_full: "P 2_1 c a",
		hall_symbol: "P -2ac 2a",
		international: "P 2_1 c a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"147": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^5",
		pointgroup_schoenflies: "mm2",
		international_short: "Pc2_1b",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 29,
		choice: "bca",
		international_full: "P c 2_1 b",
		hall_symbol: "P -2bc -2c",
		international: "P c 2_1 b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"148": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^5",
		pointgroup_schoenflies: "mm2",
		international_short: "Pb2_1a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 29,
		choice: "a-cb",
		international_full: "P b 2_1 a",
		hall_symbol: "P -2a -2ab",
		international: "P b 2_1 a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"149": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^6",
		pointgroup_schoenflies: "mm2",
		international_short: "Pnc2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 30,
		choice: "",
		international_full: "P n c 2",
		hall_symbol: "P 2 -2bc",
		international: "P n c 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"150": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^6",
		pointgroup_schoenflies: "mm2",
		international_short: "Pcn2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 30,
		choice: "ba-c",
		international_full: "P c n 2",
		hall_symbol: "P 2 -2ac",
		international: "P c n 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"151": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^6",
		pointgroup_schoenflies: "mm2",
		international_short: "P2na",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 30,
		choice: "cab",
		international_full: "P 2 n a",
		hall_symbol: "P -2ac 2",
		international: "P 2 n a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"152": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^6",
		pointgroup_schoenflies: "mm2",
		international_short: "P2an",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 30,
		choice: "-cba",
		international_full: "P 2 a n",
		hall_symbol: "P -2ab 2",
		international: "P 2 a n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"153": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^6",
		pointgroup_schoenflies: "mm2",
		international_short: "Pb2n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 30,
		choice: "bca",
		international_full: "P b 2 n",
		hall_symbol: "P -2ab -2ab",
		international: "P b 2 n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"154": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^6",
		pointgroup_schoenflies: "mm2",
		international_short: "Pn2b",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 30,
		choice: "a-cb",
		international_full: "P n 2 b",
		hall_symbol: "P -2bc -2bc",
		international: "P n 2 b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"155": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^7",
		pointgroup_schoenflies: "mm2",
		international_short: "Pmn2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 31,
		choice: "",
		international_full: "P m n 2_1",
		hall_symbol: "P 2ac -2",
		international: "P m n 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"156": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^7",
		pointgroup_schoenflies: "mm2",
		international_short: "Pnm2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 31,
		choice: "ba-c",
		international_full: "P n m 2_1",
		hall_symbol: "P 2bc -2bc",
		international: "P n m 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"157": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^7",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1mn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 31,
		choice: "cab",
		international_full: "P 2_1 m n",
		hall_symbol: "P -2ab 2ab",
		international: "P 2_1 m n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"158": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^7",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1nm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 31,
		choice: "-cba",
		international_full: "P 2_1 n m",
		hall_symbol: "P -2 2ac",
		international: "P 2_1 n m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"159": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^7",
		pointgroup_schoenflies: "mm2",
		international_short: "Pn2_1m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 31,
		choice: "bca",
		international_full: "P n 2_1 m",
		hall_symbol: "P -2 -2bc",
		international: "P n 2_1 m",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"160": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^7",
		pointgroup_schoenflies: "mm2",
		international_short: "Pm2_1n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 31,
		choice: "a-cb",
		international_full: "P m 2_1 n",
		hall_symbol: "P -2ab -2",
		international: "P m 2_1 n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"161": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^8",
		pointgroup_schoenflies: "mm2",
		international_short: "Pba2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 32,
		choice: "",
		international_full: "P b a 2",
		hall_symbol: "P 2 -2ab",
		international: "P b a 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"162": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^8",
		pointgroup_schoenflies: "mm2",
		international_short: "P2cb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 32,
		choice: "cab",
		international_full: "P 2 c b",
		hall_symbol: "P -2bc 2",
		international: "P 2 c b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"163": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^8",
		pointgroup_schoenflies: "mm2",
		international_short: "Pc2a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 32,
		choice: "bca",
		international_full: "P c 2 a",
		hall_symbol: "P -2ac -2ac",
		international: "P c 2 a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"164": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^9",
		pointgroup_schoenflies: "mm2",
		international_short: "Pna2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 33,
		choice: "",
		international_full: "P n a 2_1",
		hall_symbol: "P 2c -2n",
		international: "P n a 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"165": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^9",
		pointgroup_schoenflies: "mm2",
		international_short: "Pbn2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 33,
		choice: "ba-c",
		international_full: "P b n 2_1",
		hall_symbol: "P 2c -2ab",
		international: "P b n 2_1",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"166": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^9",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1nb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 33,
		choice: "cab",
		international_full: "P 2_1 n b",
		hall_symbol: "P -2bc 2a",
		international: "P 2_1 n b",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"167": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^9",
		pointgroup_schoenflies: "mm2",
		international_short: "P2_1cn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 33,
		choice: "-cba",
		international_full: "P 2_1 c n",
		hall_symbol: "P -2n 2a",
		international: "P 2_1 c n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"168": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^9",
		pointgroup_schoenflies: "mm2",
		international_short: "Pc2_1n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 33,
		choice: "bca",
		international_full: "P c 2_1 n",
		hall_symbol: "P -2n -2ac",
		international: "P c 2_1 n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"169": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^9",
		pointgroup_schoenflies: "mm2",
		international_short: "Pn2_1a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 33,
		choice: "a-cb",
		international_full: "P n 2_1 a",
		hall_symbol: "P -2ac -2n",
		international: "P n 2_1 a",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"170": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^10",
		pointgroup_schoenflies: "mm2",
		international_short: "Pnn2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 34,
		choice: "",
		international_full: "P n n 2",
		hall_symbol: "P 2 -2n",
		international: "P n n 2",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"171": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^10",
		pointgroup_schoenflies: "mm2",
		international_short: "P2nn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 34,
		choice: "cab",
		international_full: "P 2 n n",
		hall_symbol: "P -2n 2",
		international: "P 2 n n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"172": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^10",
		pointgroup_schoenflies: "mm2",
		international_short: "Pn2n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 34,
		choice: "bca",
		international_full: "P n 2 n",
		hall_symbol: "P -2n -2n",
		international: "P n 2 n",
		arithmetic_crystal_class_number: 13,
		arithmetic_crystal_class_symbol: "mm2P"
	},
		"173": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^11",
		pointgroup_schoenflies: "mm2",
		international_short: "Cmm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 35,
		choice: "",
		international_full: "C m m 2",
		hall_symbol: "C 2 -2",
		international: "C m m 2",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"174": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^11",
		pointgroup_schoenflies: "mm2",
		international_short: "A2mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 35,
		choice: "cab",
		international_full: "A 2 m m",
		hall_symbol: "A -2 2",
		international: "A 2 m m",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"175": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^11",
		pointgroup_schoenflies: "mm2",
		international_short: "Bm2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 35,
		choice: "bca",
		international_full: "B m 2 m",
		hall_symbol: "B -2 -2",
		international: "B m 2 m",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"176": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^12",
		pointgroup_schoenflies: "mm2",
		international_short: "Cmc2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 36,
		choice: "",
		international_full: "C m c 2_1",
		hall_symbol: "C 2c -2",
		international: "C m c 2_1",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"177": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^12",
		pointgroup_schoenflies: "mm2",
		international_short: "Ccm2_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 36,
		choice: "ba-c",
		international_full: "C c m 2_1",
		hall_symbol: "C 2c -2c",
		international: "C c m 2_1",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"178": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^12",
		pointgroup_schoenflies: "mm2",
		international_short: "A2_1ma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 36,
		choice: "cab",
		international_full: "A 2_1 m a",
		hall_symbol: "A -2a 2a",
		international: "A 2_1 m a",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"179": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^12",
		pointgroup_schoenflies: "mm2",
		international_short: "A2_1am",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 36,
		choice: "-cba",
		international_full: "A 2_1 a m",
		hall_symbol: "A -2 2a",
		international: "A 2_1 a m",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"180": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^12",
		pointgroup_schoenflies: "mm2",
		international_short: "Bb2_1m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 36,
		choice: "bca",
		international_full: "B b 2_1 m",
		hall_symbol: "B -2 -2b",
		international: "B b 2_1 m",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"181": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^12",
		pointgroup_schoenflies: "mm2",
		international_short: "Bm2_1b",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 36,
		choice: "a-cb",
		international_full: "B m 2_1 b",
		hall_symbol: "B -2b -2",
		international: "B m 2_1 b",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"182": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^13",
		pointgroup_schoenflies: "mm2",
		international_short: "Ccc2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 37,
		choice: "",
		international_full: "C c c 2",
		hall_symbol: "C 2 -2c",
		international: "C c c 2",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"183": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^13",
		pointgroup_schoenflies: "mm2",
		international_short: "A2aa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 37,
		choice: "cab",
		international_full: "A 2 a a",
		hall_symbol: "A -2a 2",
		international: "A 2 a a",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"184": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^13",
		pointgroup_schoenflies: "mm2",
		international_short: "Bb2b",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 37,
		choice: "bca",
		international_full: "B b 2 b",
		hall_symbol: "B -2b -2b",
		international: "B b 2 b",
		arithmetic_crystal_class_number: 14,
		arithmetic_crystal_class_symbol: "mm2C"
	},
		"185": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^14",
		pointgroup_schoenflies: "mm2",
		international_short: "Amm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 38,
		choice: "",
		international_full: "A m m 2",
		hall_symbol: "A 2 -2",
		international: "A m m 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"186": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^14",
		pointgroup_schoenflies: "mm2",
		international_short: "Bmm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 38,
		choice: "ba-c",
		international_full: "B m m 2",
		hall_symbol: "B 2 -2",
		international: "B m m 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"187": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^14",
		pointgroup_schoenflies: "mm2",
		international_short: "B2mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 38,
		choice: "cab",
		international_full: "B 2 m m",
		hall_symbol: "B -2 2",
		international: "B 2 m m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"188": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^14",
		pointgroup_schoenflies: "mm2",
		international_short: "C2mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 38,
		choice: "-cba",
		international_full: "C 2 m m",
		hall_symbol: "C -2 2",
		international: "C 2 m m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"189": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^14",
		pointgroup_schoenflies: "mm2",
		international_short: "Cm2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 38,
		choice: "bca",
		international_full: "C m 2 m",
		hall_symbol: "C -2 -2",
		international: "C m 2 m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"190": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^14",
		pointgroup_schoenflies: "mm2",
		international_short: "Am2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 38,
		choice: "a-cb",
		international_full: "A m 2 m",
		hall_symbol: "A -2 -2",
		international: "A m 2 m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"191": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^15",
		pointgroup_schoenflies: "mm2",
		international_short: "Aem2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 39,
		choice: "",
		international_full: "A e m 2",
		hall_symbol: "A 2 -2c",
		international: "A e m 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"192": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^15",
		pointgroup_schoenflies: "mm2",
		international_short: "Bme2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 39,
		choice: "ba-c",
		international_full: "B m e 2",
		hall_symbol: "B 2 -2c",
		international: "B m e 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"193": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^15",
		pointgroup_schoenflies: "mm2",
		international_short: "B2em",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 39,
		choice: "cab",
		international_full: "B 2 e m",
		hall_symbol: "B -2c 2",
		international: "B 2 e m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"194": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^15",
		pointgroup_schoenflies: "mm2",
		international_short: "C2me",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 39,
		choice: "-cba",
		international_full: "C 2 m e",
		hall_symbol: "C -2b 2",
		international: "C 2 m e",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"195": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^15",
		pointgroup_schoenflies: "mm2",
		international_short: "Cm2e",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 39,
		choice: "bca",
		international_full: "C m 2 e",
		hall_symbol: "C -2b -2b",
		international: "C m 2 e",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"196": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^15",
		pointgroup_schoenflies: "mm2",
		international_short: "Ae2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 39,
		choice: "a-cb",
		international_full: "A e 2 m",
		hall_symbol: "A -2c -2c",
		international: "A e 2 m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"197": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^16",
		pointgroup_schoenflies: "mm2",
		international_short: "Ama2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 40,
		choice: "",
		international_full: "A m a 2",
		hall_symbol: "A 2 -2a",
		international: "A m a 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"198": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^16",
		pointgroup_schoenflies: "mm2",
		international_short: "Bbm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 40,
		choice: "ba-c",
		international_full: "B b m 2",
		hall_symbol: "B 2 -2b",
		international: "B b m 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"199": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^16",
		pointgroup_schoenflies: "mm2",
		international_short: "B2mb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 40,
		choice: "cab",
		international_full: "B 2 m b",
		hall_symbol: "B -2b 2",
		international: "B 2 m b",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"200": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^16",
		pointgroup_schoenflies: "mm2",
		international_short: "C2cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 40,
		choice: "-cba",
		international_full: "C 2 c m",
		hall_symbol: "C -2c 2",
		international: "C 2 c m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"201": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^16",
		pointgroup_schoenflies: "mm2",
		international_short: "Cc2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 40,
		choice: "bca",
		international_full: "C c 2 m",
		hall_symbol: "C -2c -2c",
		international: "C c 2 m",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"202": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^16",
		pointgroup_schoenflies: "mm2",
		international_short: "Am2a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 40,
		choice: "a-cb",
		international_full: "A m 2 a",
		hall_symbol: "A -2a -2a",
		international: "A m 2 a",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"203": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^17",
		pointgroup_schoenflies: "mm2",
		international_short: "Aea2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 41,
		choice: "",
		international_full: "A e a 2",
		hall_symbol: "A 2 -2ac",
		international: "A e a 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"204": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^17",
		pointgroup_schoenflies: "mm2",
		international_short: "Bbe2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 41,
		choice: "ba-c",
		international_full: "B b e 2",
		hall_symbol: "B 2 -2bc",
		international: "B b e 2",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"205": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^17",
		pointgroup_schoenflies: "mm2",
		international_short: "B2eb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 41,
		choice: "cab",
		international_full: "B 2 e b",
		hall_symbol: "B -2bc 2",
		international: "B 2 e b",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"206": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^17",
		pointgroup_schoenflies: "mm2",
		international_short: "C2ce",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 41,
		choice: "-cba",
		international_full: "C 2 c e",
		hall_symbol: "C -2bc 2",
		international: "C 2 c e",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"207": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^17",
		pointgroup_schoenflies: "mm2",
		international_short: "Cc2e",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 41,
		choice: "bca",
		international_full: "C c 2 e",
		hall_symbol: "C -2bc -2bc",
		international: "C c 2 e",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"208": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^17",
		pointgroup_schoenflies: "mm2",
		international_short: "Ae2a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 41,
		choice: "a-cb",
		international_full: "A e 2 a",
		hall_symbol: "A -2ac -2ac",
		international: "A e 2 a",
		arithmetic_crystal_class_number: 15,
		arithmetic_crystal_class_symbol: "2mmC"
	},
		"209": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^18",
		pointgroup_schoenflies: "mm2",
		international_short: "Fmm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 42,
		choice: "",
		international_full: "F m m 2",
		hall_symbol: "F 2 -2",
		international: "F m m 2",
		arithmetic_crystal_class_number: 16,
		arithmetic_crystal_class_symbol: "mm2F"
	},
		"210": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^18",
		pointgroup_schoenflies: "mm2",
		international_short: "F2mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 42,
		choice: "cab",
		international_full: "F 2 m m",
		hall_symbol: "F -2 2",
		international: "F 2 m m",
		arithmetic_crystal_class_number: 16,
		arithmetic_crystal_class_symbol: "mm2F"
	},
		"211": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^18",
		pointgroup_schoenflies: "mm2",
		international_short: "Fm2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 42,
		choice: "bca",
		international_full: "F m 2 m",
		hall_symbol: "F -2 -2",
		international: "F m 2 m",
		arithmetic_crystal_class_number: 16,
		arithmetic_crystal_class_symbol: "mm2F"
	},
		"212": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^19",
		pointgroup_schoenflies: "mm2",
		international_short: "Fdd2",
		translations: [
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.75,
				0.75,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 43,
		choice: "",
		international_full: "F d d 2",
		hall_symbol: "F 2 -2d",
		international: "F d d 2",
		arithmetic_crystal_class_number: 16,
		arithmetic_crystal_class_symbol: "mm2F"
	},
		"213": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^19",
		pointgroup_schoenflies: "mm2",
		international_short: "F2dd",
		translations: [
			[
				0.5,
				0.5,
				0
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.75,
				0.25,
				0.75
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 43,
		choice: "cab",
		international_full: "F 2 d d",
		hall_symbol: "F -2d 2",
		international: "F 2 d d",
		arithmetic_crystal_class_number: 16,
		arithmetic_crystal_class_symbol: "mm2F"
	},
		"214": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^19",
		pointgroup_schoenflies: "mm2",
		international_short: "Fd2d",
		translations: [
			[
				0.5,
				0,
				0.5
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 43,
		choice: "bca",
		international_full: "F d 2 d",
		hall_symbol: "F -2d -2d",
		international: "F d 2 d",
		arithmetic_crystal_class_number: 16,
		arithmetic_crystal_class_symbol: "mm2F"
	},
		"215": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^20",
		pointgroup_schoenflies: "mm2",
		international_short: "Imm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 44,
		choice: "",
		international_full: "I m m 2",
		hall_symbol: "I 2 -2",
		international: "I m m 2",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"216": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^20",
		pointgroup_schoenflies: "mm2",
		international_short: "I2mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 44,
		choice: "cab",
		international_full: "I 2 m m",
		hall_symbol: "I -2 2",
		international: "I 2 m m",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"217": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^20",
		pointgroup_schoenflies: "mm2",
		international_short: "Im2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 44,
		choice: "bca",
		international_full: "I m 2 m",
		hall_symbol: "I -2 -2",
		international: "I m 2 m",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"218": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^21",
		pointgroup_schoenflies: "mm2",
		international_short: "Iba2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 45,
		choice: "",
		international_full: "I b a 2",
		hall_symbol: "I 2 -2c",
		international: "I b a 2",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"219": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^21",
		pointgroup_schoenflies: "mm2",
		international_short: "I2cb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 45,
		choice: "cab",
		international_full: "I 2 c b",
		hall_symbol: "I -2a 2",
		international: "I 2 c b",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"220": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^21",
		pointgroup_schoenflies: "mm2",
		international_short: "Ic2a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 45,
		choice: "bca",
		international_full: "I c 2 a",
		hall_symbol: "I -2b -2b",
		international: "I c 2 a",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"221": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^22",
		pointgroup_schoenflies: "mm2",
		international_short: "Ima2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 46,
		choice: "",
		international_full: "I m a 2",
		hall_symbol: "I 2 -2a",
		international: "I m a 2",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"222": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^22",
		pointgroup_schoenflies: "mm2",
		international_short: "Ibm2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 46,
		choice: "ba-c",
		international_full: "I b m 2",
		hall_symbol: "I 2 -2b",
		international: "I b m 2",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"223": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^22",
		pointgroup_schoenflies: "mm2",
		international_short: "I2mb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 46,
		choice: "cab",
		international_full: "I 2 m b",
		hall_symbol: "I -2b 2",
		international: "I 2 m b",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"224": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^22",
		pointgroup_schoenflies: "mm2",
		international_short: "I2cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 46,
		choice: "-cba",
		international_full: "I 2 c m",
		hall_symbol: "I -2c 2",
		international: "I 2 c m",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"225": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^22",
		pointgroup_schoenflies: "mm2",
		international_short: "Ic2m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 46,
		choice: "bca",
		international_full: "I c 2 m",
		hall_symbol: "I -2c -2c",
		international: "I c 2 m",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"226": {
		pointgroup_international: "C2v",
		schoenflies: "C2v^22",
		pointgroup_schoenflies: "mm2",
		international_short: "Im2a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 46,
		choice: "a-cb",
		international_full: "I m 2 a",
		hall_symbol: "I -2a -2a",
		international: "I m 2 a",
		arithmetic_crystal_class_number: 17,
		arithmetic_crystal_class_symbol: "mm2I"
	},
		"227": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^1",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 47,
		choice: "",
		international_full: "P 2/m 2/m 2/m",
		hall_symbol: "-P 2 2",
		international: "P m m m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"228": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^2",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnnn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 48,
		choice: "1",
		international_full: "P 2/n 2/n 2/n",
		hall_symbol: "P 2 2 -1n",
		international: "P n n n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"229": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^2",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnnn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 48,
		choice: "2",
		international_full: "P 2/n 2/n 2/n",
		hall_symbol: "-P 2ab 2bc",
		international: "P n n n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"230": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^3",
		pointgroup_schoenflies: "mmm",
		international_short: "Pccm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 49,
		choice: "",
		international_full: "P 2/c 2/c 2/m",
		hall_symbol: "-P 2 2c",
		international: "P c c m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"231": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^3",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 49,
		choice: "cab",
		international_full: "P 2/m 2/a 2/a",
		hall_symbol: "-P 2a 2",
		international: "P m a a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"232": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^3",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbmb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 49,
		choice: "bca",
		international_full: "P 2/b 2/m 2/b",
		hall_symbol: "-P 2b 2b",
		international: "P b m b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"233": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^4",
		pointgroup_schoenflies: "mmm",
		international_short: "Pban",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 50,
		choice: "1",
		international_full: "P 2/b 2/a 2/n",
		hall_symbol: "P 2 2 -1ab",
		international: "P b a n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"234": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^4",
		pointgroup_schoenflies: "mmm",
		international_short: "Pban",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 50,
		choice: "2",
		international_full: "P 2/b 2/a 2/n",
		hall_symbol: "-P 2ab 2b",
		international: "P b a n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"235": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^4",
		pointgroup_schoenflies: "mmm",
		international_short: "Pncb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 50,
		choice: "1cab",
		international_full: "P 2/n 2/c 2/b",
		hall_symbol: "P 2 2 -1bc",
		international: "P n c b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"236": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^4",
		pointgroup_schoenflies: "mmm",
		international_short: "Pncb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 50,
		choice: "2cab",
		international_full: "P 2/n 2/c 2/b",
		hall_symbol: "-P 2b 2bc",
		international: "P n c b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"237": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^4",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcna",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 50,
		choice: "1bca",
		international_full: "P 2/c 2/n 2/a",
		hall_symbol: "P 2 2 -1ac",
		international: "P c n a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"238": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^4",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcna",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 50,
		choice: "2bca",
		international_full: "P 2/c 2/n 2/a",
		hall_symbol: "-P 2a 2c",
		international: "P c n a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"239": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^5",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 51,
		choice: "",
		international_full: "P 2_1/m 2/m 2/a",
		hall_symbol: "-P 2a 2a",
		international: "P m m a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"240": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^5",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmmb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 51,
		choice: "ba-c",
		international_full: "P 2/m 2_1/m 2/b",
		hall_symbol: "-P 2b 2",
		international: "P m m b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"241": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^5",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 51,
		choice: "cab",
		international_full: "P 2/b 2_1/m 2/m",
		hall_symbol: "-P 2 2b",
		international: "P b m m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"242": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^5",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 51,
		choice: "-cba",
		international_full: "P 2/c 2/m 2_1/m",
		hall_symbol: "-P 2c 2c",
		international: "P c m m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"243": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^5",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmcm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 51,
		choice: "bca",
		international_full: "P 2/m 2/c 2_1/m",
		hall_symbol: "-P 2c 2",
		international: "P m c m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"244": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^5",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 51,
		choice: "a-cb",
		international_full: "P 2_1/m 2/a 2/m",
		hall_symbol: "-P 2 2a",
		international: "P m a m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"245": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^6",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnna",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 52,
		choice: "",
		international_full: "P 2/n 2_1/n 2/a",
		hall_symbol: "-P 2a 2bc",
		international: "P n n a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"246": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^6",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnnb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 52,
		choice: "ba-c",
		international_full: "P 2_1/n 2/n 2/b",
		hall_symbol: "-P 2b 2n",
		international: "P n n b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"247": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^6",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbnn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 52,
		choice: "cab",
		international_full: "P 2/b 2/n 2_1/n",
		hall_symbol: "-P 2n 2b",
		international: "P b n n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"248": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^6",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcnn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 52,
		choice: "-cba",
		international_full: "P 2/c 2_1/n 2/n",
		hall_symbol: "-P 2ab 2c",
		international: "P c n n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"249": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^6",
		pointgroup_schoenflies: "mmm",
		international_short: "Pncn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 52,
		choice: "bca",
		international_full: "P 2_1/n 2/c 2/n",
		hall_symbol: "-P 2ab 2n",
		international: "P n c n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"250": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^6",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnan",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 52,
		choice: "a-cb",
		international_full: "P 2/n 2/a 2_1/n",
		hall_symbol: "-P 2n 2bc",
		international: "P n a n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"251": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^7",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmna",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 53,
		choice: "",
		international_full: "P 2/m 2/n 2_1/a",
		hall_symbol: "-P 2ac 2",
		international: "P m n a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"252": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^7",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnmb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 53,
		choice: "ba-c",
		international_full: "P 2/n 2/m 2_1/b",
		hall_symbol: "-P 2bc 2bc",
		international: "P n m b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"253": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^7",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbmn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 53,
		choice: "cab",
		international_full: "P 2_1/b 2/m 2/n",
		hall_symbol: "-P 2ab 2ab",
		international: "P b m n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"254": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^7",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 53,
		choice: "-cba",
		international_full: "P 2_1/c 2/n 2/m",
		hall_symbol: "-P 2 2ac",
		international: "P c n m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"255": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^7",
		pointgroup_schoenflies: "mmm",
		international_short: "Pncm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 53,
		choice: "bca",
		international_full: "P 2/n 2_1/c 2/m",
		hall_symbol: "-P 2 2bc",
		international: "P n c m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"256": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^7",
		pointgroup_schoenflies: "mmm",
		international_short: "Pman",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 53,
		choice: "a-cb",
		international_full: "P 2/m 2_1/a 2/n",
		hall_symbol: "-P 2ab 2",
		international: "P m a n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"257": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^8",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcca",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 54,
		choice: "",
		international_full: "P 2_1/c 2/c 2/a",
		hall_symbol: "-P 2a 2ac",
		international: "P c c a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"258": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^8",
		pointgroup_schoenflies: "mmm",
		international_short: "Pccb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 54,
		choice: "ba-c",
		international_full: "P 2/c 2_1/c 2/b",
		hall_symbol: "-P 2b 2c",
		international: "P c c b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"259": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^8",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 54,
		choice: "cab",
		international_full: "P 2/b 2_1/a 2/a",
		hall_symbol: "-P 2a 2b",
		international: "P b a a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"260": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^8",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 54,
		choice: "-cba",
		international_full: "P 2/c 2/a 2_1/a",
		hall_symbol: "-P 2ac 2c",
		international: "P c a a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"261": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^8",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbcb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 54,
		choice: "bca",
		international_full: "P 2/b 2/c 2_1/b",
		hall_symbol: "-P 2bc 2b",
		international: "P b c b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"262": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^8",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbab",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 54,
		choice: "a-cb",
		international_full: "P 2_1/b 2/a 2/b",
		hall_symbol: "-P 2b 2ab",
		international: "P b a b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"263": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^9",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 55,
		choice: "",
		international_full: "P 2_1/b 2_1/a 2/m",
		hall_symbol: "-P 2 2ab",
		international: "P b a m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"264": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^9",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmcb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 55,
		choice: "cab",
		international_full: "P 2/m 2_1/c 2_1/b",
		hall_symbol: "-P 2bc 2",
		international: "P m c b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"265": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^9",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 55,
		choice: "bca",
		international_full: "P 2_1/c 2/m 2_1/a",
		hall_symbol: "-P 2ac 2ac",
		international: "P c m a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"266": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^10",
		pointgroup_schoenflies: "mmm",
		international_short: "Pccn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 56,
		choice: "",
		international_full: "P 2_1/c 2_1/c 2/n",
		hall_symbol: "-P 2ab 2ac",
		international: "P c c n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"267": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^10",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 56,
		choice: "cab",
		international_full: "P 2/n 2_1/a 2_1/a",
		hall_symbol: "-P 2ac 2bc",
		international: "P n a a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"268": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^10",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbnb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 56,
		choice: "bca",
		international_full: "P 2_1/b 2/n 2_1/b",
		hall_symbol: "-P 2bc 2ab",
		international: "P b n b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"269": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^11",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbcm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 57,
		choice: "",
		international_full: "P 2/b 2_1/c 2_1/m",
		hall_symbol: "-P 2c 2b",
		international: "P b c m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"270": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^11",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 57,
		choice: "ba-c",
		international_full: "P 2_1/c 2/a 2_1/m",
		hall_symbol: "-P 2c 2ac",
		international: "P c a m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"271": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^11",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmca",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 57,
		choice: "cab",
		international_full: "P 2_1/m 2/c 2_1/a",
		hall_symbol: "-P 2ac 2a",
		international: "P m c a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"272": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^11",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmab",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 57,
		choice: "-cba",
		international_full: "P 2_1/m 2_1/a 2/b",
		hall_symbol: "-P 2b 2a",
		international: "P m a b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"273": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^11",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 57,
		choice: "bca",
		international_full: "P 2_1/b 2_1/m 2/a",
		hall_symbol: "-P 2a 2ab",
		international: "P b m a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"274": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^11",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcmb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 57,
		choice: "a-cb",
		international_full: "P 2/c 2_1/m 2_1/b",
		hall_symbol: "-P 2bc 2c",
		international: "P c m b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"275": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^12",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 58,
		choice: "",
		international_full: "P 2_1/n 2_1/n 2/m",
		hall_symbol: "-P 2 2n",
		international: "P n n m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"276": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^12",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmnn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 58,
		choice: "cab",
		international_full: "P 2/m 2_1/n 2_1/n",
		hall_symbol: "-P 2n 2",
		international: "P m n n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"277": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^12",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnmn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 58,
		choice: "bca",
		international_full: "P 2_1/n 2/m 2_1/n",
		hall_symbol: "-P 2n 2n",
		international: "P n m n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"278": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^13",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmmn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 59,
		choice: "1",
		international_full: "P 2_1/m 2_1/m 2/n",
		hall_symbol: "P 2 2ab -1ab",
		international: "P m m n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"279": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^13",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmmn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 59,
		choice: "2",
		international_full: "P 2_1/m 2_1/m 2/n",
		hall_symbol: "-P 2ab 2a",
		international: "P m m n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"280": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^13",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 59,
		choice: "1cab",
		international_full: "P 2/n 2_1/m 2_1/m",
		hall_symbol: "P 2bc 2 -1bc",
		international: "P n m m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"281": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^13",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 59,
		choice: "2cab",
		international_full: "P 2/n 2_1/m 2_1/m",
		hall_symbol: "-P 2c 2bc",
		international: "P n m m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"282": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^13",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 59,
		choice: "1bca",
		international_full: "P 2_1/m 2/n 2_1/m",
		hall_symbol: "P 2ac 2ac -1ac",
		international: "P m n m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"283": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^13",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 59,
		choice: "2bca",
		international_full: "P 2_1/m 2/n 2_1/m",
		hall_symbol: "-P 2c 2a",
		international: "P m n m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"284": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^14",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbcn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 60,
		choice: "",
		international_full: "P 2_1/b 2/c 2_1/n",
		hall_symbol: "-P 2n 2ab",
		international: "P b c n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"285": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^14",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcan",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 60,
		choice: "ba-c",
		international_full: "P 2/c 2_1/a 2_1/n",
		hall_symbol: "-P 2n 2c",
		international: "P c a n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"286": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^14",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnca",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 60,
		choice: "cab",
		international_full: "P 2_1/n 2_1/c 2/a",
		hall_symbol: "-P 2a 2n",
		international: "P n c a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"287": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^14",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnab",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 60,
		choice: "-cba",
		international_full: "P 2_1/n 2/a 2_1/b",
		hall_symbol: "-P 2bc 2n",
		international: "P n a b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"288": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^14",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbna",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 60,
		choice: "bca",
		international_full: "P 2/b 2_1/n 2_1/a",
		hall_symbol: "-P 2ac 2b",
		international: "P b n a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"289": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^14",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcnb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 60,
		choice: "a-cb",
		international_full: "P 2_1/c 2_1/n 2/b",
		hall_symbol: "-P 2b 2ac",
		international: "P c n b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"290": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^15",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbca",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 61,
		choice: "",
		international_full: "P 2_1/b 2_1/c 2_1/a",
		hall_symbol: "-P 2ac 2ab",
		international: "P b c a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"291": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^15",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcab",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 61,
		choice: "ba-c",
		international_full: "P 2_1/c 2_1/a 2_1/b",
		hall_symbol: "-P 2bc 2ac",
		international: "P c a b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"292": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^16",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 62,
		choice: "",
		international_full: "P 2_1/n 2_1/m 2_1/a",
		hall_symbol: "-P 2ac 2n",
		international: "P n m a",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"293": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^16",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmnb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 62,
		choice: "ba-c",
		international_full: "P 2_1/m 2_1/n 2_1/b",
		hall_symbol: "-P 2bc 2a",
		international: "P m n b",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"294": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^16",
		pointgroup_schoenflies: "mmm",
		international_short: "Pbnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 62,
		choice: "cab",
		international_full: "P 2_1/b 2_1/n 2_1/m",
		hall_symbol: "-P 2c 2ab",
		international: "P b n m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"295": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^16",
		pointgroup_schoenflies: "mmm",
		international_short: "Pcmn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 62,
		choice: "-cba",
		international_full: "P 2_1/c 2_1/m 2_1/n",
		hall_symbol: "-P 2n 2ac",
		international: "P c m n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"296": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^16",
		pointgroup_schoenflies: "mmm",
		international_short: "Pmcn",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 62,
		choice: "bca",
		international_full: "P 2_1/m 2_1/c 2_1/n",
		hall_symbol: "-P 2n 2a",
		international: "P m c n",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"297": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^16",
		pointgroup_schoenflies: "mmm",
		international_short: "Pnam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 62,
		choice: "a-cb",
		international_full: "P 2_1/n 2_1/a 2_1/m",
		hall_symbol: "-P 2c 2n",
		international: "P n a m",
		arithmetic_crystal_class_number: 18,
		arithmetic_crystal_class_symbol: "mmmP"
	},
		"298": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^17",
		pointgroup_schoenflies: "mmm",
		international_short: "Cmcm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 63,
		choice: "",
		international_full: "C 2/m 2/c 2_1/m",
		hall_symbol: "-C 2c 2",
		international: "C m c m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"299": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^17",
		pointgroup_schoenflies: "mmm",
		international_short: "Ccmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 63,
		choice: "ba-c",
		international_full: "C 2/c 2/m 2_1/m",
		hall_symbol: "-C 2c 2c",
		international: "C c m m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"300": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^17",
		pointgroup_schoenflies: "mmm",
		international_short: "Amma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 63,
		choice: "cab",
		international_full: "A 2_1/m 2/m 2/a",
		hall_symbol: "-A 2a 2a",
		international: "A m m a",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"301": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^17",
		pointgroup_schoenflies: "mmm",
		international_short: "Amam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 63,
		choice: "-cba",
		international_full: "A 2_1/m 2/a 2/m",
		hall_symbol: "-A 2 2a",
		international: "A m a m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"302": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^17",
		pointgroup_schoenflies: "mmm",
		international_short: "Bbmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 63,
		choice: "bca",
		international_full: "B 2/b 2_1/m 2/m",
		hall_symbol: "-B 2 2b",
		international: "B b m m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"303": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^17",
		pointgroup_schoenflies: "mmm",
		international_short: "Bmmb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 63,
		choice: "a-cb",
		international_full: "B 2/m 2_1/m 2/b",
		hall_symbol: "-B 2b 2",
		international: "B m m b",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"304": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^18",
		pointgroup_schoenflies: "mmm",
		international_short: "Cmce",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 64,
		choice: "",
		international_full: "C 2/m 2/c 2_1/e",
		hall_symbol: "-C 2bc 2",
		international: "C m c e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"305": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^18",
		pointgroup_schoenflies: "mmm",
		international_short: "Ccme",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 64,
		choice: "ba-c",
		international_full: "C 2/c 2/m 2_1/e",
		hall_symbol: "-C 2bc 2bc",
		international: "C c m e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"306": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^18",
		pointgroup_schoenflies: "mmm",
		international_short: "Aema",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 64,
		choice: "cab",
		international_full: "A 2_1/e 2/m 2/a",
		hall_symbol: "-A 2ac 2ac",
		international: "A e m a",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"307": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^18",
		pointgroup_schoenflies: "mmm",
		international_short: "Aeam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 64,
		choice: "-cba",
		international_full: "A 2_1/e 2/a 2/m",
		hall_symbol: "-A 2 2ac",
		international: "A e a m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"308": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^18",
		pointgroup_schoenflies: "mmm",
		international_short: "Bbem",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 64,
		choice: "bca",
		international_full: "B 2/b 2_1/e 2/m",
		hall_symbol: "-B 2 2bc",
		international: "B b e m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"309": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^18",
		pointgroup_schoenflies: "mmm",
		international_short: "Bmeb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 64,
		choice: "a-cb",
		international_full: "B 2/m 2_1/e 2/b",
		hall_symbol: "-B 2bc 2",
		international: "B m e b",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"310": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^19",
		pointgroup_schoenflies: "mmm",
		international_short: "Cmmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 65,
		choice: "",
		international_full: "C 2/m 2/m 2/m",
		hall_symbol: "-C 2 2",
		international: "C m m m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"311": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^19",
		pointgroup_schoenflies: "mmm",
		international_short: "Ammm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 65,
		choice: "cab",
		international_full: "A 2/m 2/m 2/m",
		hall_symbol: "-A 2 2",
		international: "A m m m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"312": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^19",
		pointgroup_schoenflies: "mmm",
		international_short: "Bmmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 65,
		choice: "bca",
		international_full: "B 2/m 2/m 2/m",
		hall_symbol: "-B 2 2",
		international: "B m m m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"313": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^20",
		pointgroup_schoenflies: "mmm",
		international_short: "Cccm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 66,
		choice: "",
		international_full: "C 2/c 2/c 2/m",
		hall_symbol: "-C 2 2c",
		international: "C c c m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"314": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^20",
		pointgroup_schoenflies: "mmm",
		international_short: "Amaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 66,
		choice: "cab",
		international_full: "A 2/m 2/a 2/a",
		hall_symbol: "-A 2a 2",
		international: "A m a a",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"315": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^20",
		pointgroup_schoenflies: "mmm",
		international_short: "Bbmb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 66,
		choice: "bca",
		international_full: "B 2/b 2/m 2/b",
		hall_symbol: "-B 2b 2b",
		international: "B b m b",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"316": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^21",
		pointgroup_schoenflies: "mmm",
		international_short: "Cmme",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 67,
		choice: "",
		international_full: "C 2/m 2/m 2/e",
		hall_symbol: "-C 2b 2",
		international: "C m m e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"317": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^21",
		pointgroup_schoenflies: "mmm",
		international_short: "Cmme",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 67,
		choice: "ba-c",
		international_full: "C 2/m 2/m 2/e",
		hall_symbol: "-C 2b 2b",
		international: "C m m e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"318": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^21",
		pointgroup_schoenflies: "mmm",
		international_short: "Aemm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 67,
		choice: "cab",
		international_full: "A 2/e 2/m 2/m",
		hall_symbol: "-A 2c 2c",
		international: "A e m m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"319": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^21",
		pointgroup_schoenflies: "mmm",
		international_short: "Aemm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 67,
		choice: "-cba",
		international_full: "A 2/e 2/m 2/m",
		hall_symbol: "-A 2 2c",
		international: "A e m m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"320": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^21",
		pointgroup_schoenflies: "mmm",
		international_short: "Bmem",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 67,
		choice: "bca",
		international_full: "B 2/m 2/e 2/m",
		hall_symbol: "-B 2 2c",
		international: "B m e m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"321": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^21",
		pointgroup_schoenflies: "mmm",
		international_short: "Bmem",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 67,
		choice: "a-cb",
		international_full: "B 2/m 2/e 2/m",
		hall_symbol: "-B 2c 2",
		international: "B m e m",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"322": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Ccce",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "1",
		international_full: "C 2/c 2/c 2/e",
		hall_symbol: "C 2 2 -1bc",
		international: "C c c e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"323": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Ccce",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "2",
		international_full: "C 2/c 2/c 2/e",
		hall_symbol: "-C 2b 2bc",
		international: "C c c e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"324": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Ccce",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "1ba-c",
		international_full: "C 2/c 2/c 2/e",
		hall_symbol: "C 2 2 -1bc",
		international: "C c c e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"325": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Ccce",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "2ba-c",
		international_full: "C 2/c 2/c 2/e",
		hall_symbol: "-C 2b 2c",
		international: "C c c e",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"326": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Aeaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "1cab",
		international_full: "A 2/e 2/a 2/a",
		hall_symbol: "A 2 2 -1ac",
		international: "A e a a",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"327": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Aeaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "2cab",
		international_full: "A 2/e 2/a 2/a",
		hall_symbol: "-A 2a 2c",
		international: "A e a a",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"328": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Aeaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "1-cba",
		international_full: "A 2/e 2/a 2/a",
		hall_symbol: "A 2 2 -1ac",
		international: "A e a a",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"329": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Aeaa",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "2-cba",
		international_full: "A 2/e 2/a 2/a",
		hall_symbol: "-A 2ac 2c",
		international: "A e a a",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"330": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Bbeb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "1bca",
		international_full: "B 2/b 2/e 2/b",
		hall_symbol: "B 2 2 -1bc",
		international: "B b e b",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"331": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Bbcb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "2bca",
		international_full: "B 2/b 2/e 2/b",
		hall_symbol: "-B 2bc 2b",
		international: "B b c b",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"332": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Bbeb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "1a-cb",
		international_full: "B 2/b 2/e 2/b",
		hall_symbol: "B 2 2 -1bc",
		international: "B b e b",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"333": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^22",
		pointgroup_schoenflies: "mmm",
		international_short: "Bbeb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 68,
		choice: "2a-cb",
		international_full: "B 2/b 2/e 2/b",
		hall_symbol: "-B 2b 2bc",
		international: "B b e b",
		arithmetic_crystal_class_number: 19,
		arithmetic_crystal_class_symbol: "mmmC"
	},
		"334": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^23",
		pointgroup_schoenflies: "mmm",
		international_short: "Fmmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 69,
		choice: "",
		international_full: "F 2/m 2/m 2/m",
		hall_symbol: "-F 2 2",
		international: "F m m m",
		arithmetic_crystal_class_number: 20,
		arithmetic_crystal_class_symbol: "mmmF"
	},
		"335": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^24",
		pointgroup_schoenflies: "mmm",
		international_short: "Fddd",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.75,
				0.75,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 70,
		choice: "1",
		international_full: "F 2/d 2/d 2/d",
		hall_symbol: "F 2 2 -1d",
		international: "F d d d",
		arithmetic_crystal_class_number: 20,
		arithmetic_crystal_class_symbol: "mmmF"
	},
		"336": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^24",
		pointgroup_schoenflies: "mmm",
		international_short: "Fddd",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.25,
				0.25,
				0
			],
			[
				0.25,
				0.25,
				0
			],
			[
				0,
				0.25,
				0.25
			],
			[
				0,
				0.25,
				0.25
			],
			[
				0.25,
				0,
				0.25
			],
			[
				0.25,
				0,
				0.25
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.25,
				0.75,
				0.5
			],
			[
				0.25,
				0.75,
				0.5
			],
			[
				0,
				0.75,
				0.75
			],
			[
				0,
				0.75,
				0.75
			],
			[
				0.25,
				0.5,
				0.75
			],
			[
				0.25,
				0.5,
				0.75
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.75,
				0.25,
				0.5
			],
			[
				0.75,
				0.25,
				0.5
			],
			[
				0.5,
				0.25,
				0.75
			],
			[
				0.5,
				0.25,
				0.75
			],
			[
				0.75,
				0,
				0.75
			],
			[
				0.75,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.75,
				0.75,
				0
			],
			[
				0.75,
				0.75,
				0
			],
			[
				0.5,
				0.75,
				0.25
			],
			[
				0.5,
				0.75,
				0.25
			],
			[
				0.75,
				0.5,
				0.25
			],
			[
				0.75,
				0.5,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 70,
		choice: "2",
		international_full: "F 2/d 2/d 2/d",
		hall_symbol: "-F 2uv 2vw",
		international: "F d d d",
		arithmetic_crystal_class_number: 20,
		arithmetic_crystal_class_symbol: "mmmF"
	},
		"337": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^25",
		pointgroup_schoenflies: "mmm",
		international_short: "Immm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 71,
		choice: "",
		international_full: "I 2/m 2/m 2/m",
		hall_symbol: "-I 2 2",
		international: "I m m m",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"338": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^26",
		pointgroup_schoenflies: "mmm",
		international_short: "Ibam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 72,
		choice: "",
		international_full: "I 2/b 2/a 2/m",
		hall_symbol: "-I 2 2c",
		international: "I b a m",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"339": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^26",
		pointgroup_schoenflies: "mmm",
		international_short: "Imcb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 72,
		choice: "cab",
		international_full: "I 2/m 2/c 2/b",
		hall_symbol: "-I 2a 2",
		international: "I m c b",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"340": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^26",
		pointgroup_schoenflies: "mmm",
		international_short: "Icma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 72,
		choice: "bca",
		international_full: "I 2/c 2/m 2/a",
		hall_symbol: "-I 2b 2b",
		international: "I c m a",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"341": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^27",
		pointgroup_schoenflies: "mmm",
		international_short: "Ibca",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 73,
		choice: "",
		international_full: "I 2/b 2/c 2/a",
		hall_symbol: "-I 2b 2c",
		international: "I b c a",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"342": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^27",
		pointgroup_schoenflies: "mmm",
		international_short: "Icab",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 73,
		choice: "ba-c",
		international_full: "I 2/c 2/a 2/b",
		hall_symbol: "-I 2a 2b",
		international: "I c a b",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"343": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^28",
		pointgroup_schoenflies: "mmm",
		international_short: "Imma",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 74,
		choice: "",
		international_full: "I 2/m 2/m 2/a",
		hall_symbol: "-I 2b 2",
		international: "I m m a",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"344": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^28",
		pointgroup_schoenflies: "mmm",
		international_short: "Immb",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 74,
		choice: "ba-c",
		international_full: "I 2/m 2/m 2/b",
		hall_symbol: "-I 2a 2a",
		international: "I m m b",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"345": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^28",
		pointgroup_schoenflies: "mmm",
		international_short: "Ibmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 74,
		choice: "cab",
		international_full: "I 2/b 2/m 2/m",
		hall_symbol: "-I 2c 2c",
		international: "I b m m",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"346": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^28",
		pointgroup_schoenflies: "mmm",
		international_short: "Icmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 74,
		choice: "-cba",
		international_full: "I 2/c 2/m 2/m",
		hall_symbol: "-I 2 2b",
		international: "I c m m",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"347": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^28",
		pointgroup_schoenflies: "mmm",
		international_short: "Imcm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 74,
		choice: "bca",
		international_full: "I 2/m 2/c 2/m",
		hall_symbol: "-I 2 2a",
		international: "I m c m",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"348": {
		pointgroup_international: "D2h",
		schoenflies: "D2h^28",
		pointgroup_schoenflies: "mmm",
		international_short: "Imam",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 74,
		choice: "a-cb",
		international_full: "I 2/m 2/a 2/m",
		hall_symbol: "-I 2c 2",
		international: "I m a m",
		arithmetic_crystal_class_number: 21,
		arithmetic_crystal_class_symbol: "mmmI"
	},
		"349": {
		pointgroup_international: "C4",
		schoenflies: "C4^1",
		pointgroup_schoenflies: "4",
		international_short: "P4",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 75,
		choice: "",
		international_full: "P 4",
		hall_symbol: "P 4",
		international: "P 4",
		arithmetic_crystal_class_number: 22,
		arithmetic_crystal_class_symbol: "4P"
	},
		"350": {
		pointgroup_international: "C4",
		schoenflies: "C4^2",
		pointgroup_schoenflies: "4",
		international_short: "P4_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.25
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.75
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 76,
		choice: "",
		international_full: "P 4_1",
		hall_symbol: "P 4w",
		international: "P 4_1",
		arithmetic_crystal_class_number: 22,
		arithmetic_crystal_class_symbol: "4P"
	},
		"351": {
		pointgroup_international: "C4",
		schoenflies: "C4^3",
		pointgroup_schoenflies: "4",
		international_short: "P4_2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 77,
		choice: "",
		international_full: "P 4_2",
		hall_symbol: "P 4c",
		international: "P 4_2",
		arithmetic_crystal_class_number: 22,
		arithmetic_crystal_class_symbol: "4P"
	},
		"352": {
		pointgroup_international: "C4",
		schoenflies: "C4^4",
		pointgroup_schoenflies: "4",
		international_short: "P4_3",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 78,
		choice: "",
		international_full: "P 4_3",
		hall_symbol: "P 4cw",
		international: "P 4_3",
		arithmetic_crystal_class_number: 22,
		arithmetic_crystal_class_symbol: "4P"
	},
		"353": {
		pointgroup_international: "C4",
		schoenflies: "C4^5",
		pointgroup_schoenflies: "4",
		international_short: "I4",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 79,
		choice: "",
		international_full: "I 4",
		hall_symbol: "I 4",
		international: "I 4",
		arithmetic_crystal_class_number: 23,
		arithmetic_crystal_class_symbol: "4I"
	},
		"354": {
		pointgroup_international: "C4",
		schoenflies: "C4^6",
		pointgroup_schoenflies: "4",
		international_short: "I4_1",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 80,
		choice: "",
		international_full: "I 4_1",
		hall_symbol: "I 4bw",
		international: "I 4_1",
		arithmetic_crystal_class_number: 23,
		arithmetic_crystal_class_symbol: "4I"
	},
		"355": {
		pointgroup_international: "S4",
		schoenflies: "S4^1",
		pointgroup_schoenflies: "-4",
		international_short: "P-4",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 81,
		choice: "",
		international_full: "P -4",
		hall_symbol: "P -4",
		international: "P -4",
		arithmetic_crystal_class_number: 24,
		arithmetic_crystal_class_symbol: "-4P"
	},
		"356": {
		pointgroup_international: "S4",
		schoenflies: "S4^2",
		pointgroup_schoenflies: "-4",
		international_short: "I-4",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 82,
		choice: "",
		international_full: "I -4",
		hall_symbol: "I -4",
		international: "I -4",
		arithmetic_crystal_class_number: 25,
		arithmetic_crystal_class_symbol: "-4I"
	},
		"357": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^1",
		pointgroup_schoenflies: "4/m",
		international_short: "P4/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 83,
		choice: "",
		international_full: "P 4/m",
		hall_symbol: "-P 4",
		international: "P 4/m",
		arithmetic_crystal_class_number: 26,
		arithmetic_crystal_class_symbol: "4/mP"
	},
		"358": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^2",
		pointgroup_schoenflies: "4/m",
		international_short: "P4_2/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 84,
		choice: "",
		international_full: "P 4_2/m",
		hall_symbol: "-P 4c",
		international: "P 4_2/m",
		arithmetic_crystal_class_number: 26,
		arithmetic_crystal_class_symbol: "4/mP"
	},
		"359": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^3",
		pointgroup_schoenflies: "4/m",
		international_short: "P4/n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 85,
		choice: "1",
		international_full: "P 4/n",
		hall_symbol: "P 4ab -1ab",
		international: "P 4/n",
		arithmetic_crystal_class_number: 26,
		arithmetic_crystal_class_symbol: "4/mP"
	},
		"360": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^3",
		pointgroup_schoenflies: "4/m",
		international_short: "P4/n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 85,
		choice: "2",
		international_full: "P 4/n",
		hall_symbol: "-P 4a",
		international: "P 4/n",
		arithmetic_crystal_class_number: 26,
		arithmetic_crystal_class_symbol: "4/mP"
	},
		"361": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^4",
		pointgroup_schoenflies: "4/m",
		international_short: "P4_2/n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 86,
		choice: "1",
		international_full: "P 4_2/n",
		hall_symbol: "P 4n -1n",
		international: "P 4_2/n",
		arithmetic_crystal_class_number: 26,
		arithmetic_crystal_class_symbol: "4/mP"
	},
		"362": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^4",
		pointgroup_schoenflies: "4/m",
		international_short: "P4_2/n",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 86,
		choice: "2",
		international_full: "P 4_2/n",
		hall_symbol: "-P 4bc",
		international: "P 4_2/n",
		arithmetic_crystal_class_number: 26,
		arithmetic_crystal_class_symbol: "4/mP"
	},
		"363": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^5",
		pointgroup_schoenflies: "4/m",
		international_short: "I4/m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 87,
		choice: "",
		international_full: "I 4/m",
		hall_symbol: "-I 4",
		international: "I 4/m",
		arithmetic_crystal_class_number: 27,
		arithmetic_crystal_class_symbol: "4/mI"
	},
		"364": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^6",
		pointgroup_schoenflies: "4/m",
		international_short: "I4_1/a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 88,
		choice: "1",
		international_full: "I 4_1/a",
		hall_symbol: "I 4bw -1bw",
		international: "I 4_1/a",
		arithmetic_crystal_class_number: 27,
		arithmetic_crystal_class_symbol: "4/mI"
	},
		"365": {
		pointgroup_international: "C4h",
		schoenflies: "C4h^6",
		pointgroup_schoenflies: "4/m",
		international_short: "I4_1/a",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.75,
				0.25,
				0.25
			],
			[
				0.75,
				0.25,
				0.25
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.75,
				0.75,
				0.75
			],
			[
				0.75,
				0.75,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0.25,
				0.75,
				0.75
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.25,
				0.25,
				0.25
			],
			[
				0.25,
				0.25,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 88,
		choice: "2",
		international_full: "I 4_1/a",
		hall_symbol: "-I 4ad",
		international: "I 4_1/a",
		arithmetic_crystal_class_number: 27,
		arithmetic_crystal_class_symbol: "4/mI"
	},
		"366": {
		pointgroup_international: "D4",
		schoenflies: "D4^1",
		pointgroup_schoenflies: "422",
		international_short: "P422",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 89,
		choice: "",
		international_full: "P 4 2 2",
		hall_symbol: "P 4 2",
		international: "P 4 2 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"367": {
		pointgroup_international: "D4",
		schoenflies: "D4^2",
		pointgroup_schoenflies: "422",
		international_short: "P42_12",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 90,
		choice: "",
		international_full: "P 4 2_1 2",
		hall_symbol: "P 4ab 2ab",
		international: "P 4 2_1 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"368": {
		pointgroup_international: "D4",
		schoenflies: "D4^3",
		pointgroup_schoenflies: "422",
		international_short: "P4_122",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.25
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.75
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 91,
		choice: "",
		international_full: "P 4_1 2 2",
		hall_symbol: "P 4w 2c",
		international: "P 4_1 2 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"369": {
		pointgroup_international: "D4",
		schoenflies: "D4^4",
		pointgroup_schoenflies: "422",
		international_short: "P4_12_12",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.25
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.75
			],
			[
				0.5,
				0.5,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 92,
		choice: "",
		international_full: "P 4_1 2_1 2",
		hall_symbol: "P 4abw 2nw",
		international: "P 4_1 2_1 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"370": {
		pointgroup_international: "D4",
		schoenflies: "D4^5",
		pointgroup_schoenflies: "422",
		international_short: "P4_222",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 93,
		choice: "",
		international_full: "P 4_2 2 2",
		hall_symbol: "P 4c 2",
		international: "P 4_2 2 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"371": {
		pointgroup_international: "D4",
		schoenflies: "D4^6",
		pointgroup_schoenflies: "422",
		international_short: "P4_22_12",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 94,
		choice: "",
		international_full: "P 4_2 2_1 2",
		hall_symbol: "P 4n 2n",
		international: "P 4_2 2_1 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"372": {
		pointgroup_international: "D4",
		schoenflies: "D4^7",
		pointgroup_schoenflies: "422",
		international_short: "P4_322",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.25
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 95,
		choice: "",
		international_full: "P 4_3 2 2",
		hall_symbol: "P 4cw 2c",
		international: "P 4_3 2 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"373": {
		pointgroup_international: "D4",
		schoenflies: "D4^8",
		pointgroup_schoenflies: "422",
		international_short: "P4_32_12",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.25
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.75
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 96,
		choice: "",
		international_full: "P 4_3 2_1 2",
		hall_symbol: "P 4nw 2abw",
		international: "P 4_3 2_1 2",
		arithmetic_crystal_class_number: 28,
		arithmetic_crystal_class_symbol: "422P"
	},
		"374": {
		pointgroup_international: "D4",
		schoenflies: "D4^9",
		pointgroup_schoenflies: "422",
		international_short: "I422",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 97,
		choice: "",
		international_full: "I 4 2 2",
		hall_symbol: "I 4 2",
		international: "I 4 2 2",
		arithmetic_crystal_class_number: 29,
		arithmetic_crystal_class_symbol: "422I"
	},
		"375": {
		pointgroup_international: "D4",
		schoenflies: "D4^10",
		pointgroup_schoenflies: "422",
		international_short: "I4_122",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 98,
		choice: "",
		international_full: "I 4_1 2 2",
		hall_symbol: "I 4bw 2bw",
		international: "I 4_1 2 2",
		arithmetic_crystal_class_number: 29,
		arithmetic_crystal_class_symbol: "422I"
	},
		"376": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^1",
		pointgroup_schoenflies: "4mm",
		international_short: "P4mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 99,
		choice: "",
		international_full: "P 4 m m",
		hall_symbol: "P 4 -2",
		international: "P 4 m m",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"377": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^2",
		pointgroup_schoenflies: "4mm",
		international_short: "P4bm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 100,
		choice: "",
		international_full: "P 4 b m",
		hall_symbol: "P 4 -2ab",
		international: "P 4 b m",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"378": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^3",
		pointgroup_schoenflies: "4mm",
		international_short: "P4_2cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 101,
		choice: "",
		international_full: "P 4_2 c m",
		hall_symbol: "P 4c -2c",
		international: "P 4_2 c m",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"379": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^4",
		pointgroup_schoenflies: "4mm",
		international_short: "P4_2nm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 102,
		choice: "",
		international_full: "P 4_2 n m",
		hall_symbol: "P 4n -2n",
		international: "P 4_2 n m",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"380": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^5",
		pointgroup_schoenflies: "4mm",
		international_short: "P4cc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 103,
		choice: "",
		international_full: "P 4 c c",
		hall_symbol: "P 4 -2c",
		international: "P 4 c c",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"381": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^6",
		pointgroup_schoenflies: "4mm",
		international_short: "P4nc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 104,
		choice: "",
		international_full: "P 4 n c",
		hall_symbol: "P 4 -2n",
		international: "P 4 n c",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"382": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^7",
		pointgroup_schoenflies: "4mm",
		international_short: "P4_2mc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 105,
		choice: "",
		international_full: "P 4_2 m c",
		hall_symbol: "P 4c -2",
		international: "P 4_2 m c",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"383": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^8",
		pointgroup_schoenflies: "4mm",
		international_short: "P4_2bc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 106,
		choice: "",
		international_full: "P 4_2 b c",
		hall_symbol: "P 4c -2ab",
		international: "P 4_2 b c",
		arithmetic_crystal_class_number: 30,
		arithmetic_crystal_class_symbol: "4mmP"
	},
		"384": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^9",
		pointgroup_schoenflies: "4mm",
		international_short: "I4mm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 107,
		choice: "",
		international_full: "I 4 m m",
		hall_symbol: "I 4 -2",
		international: "I 4 m m",
		arithmetic_crystal_class_number: 31,
		arithmetic_crystal_class_symbol: "4mmI"
	},
		"385": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^10",
		pointgroup_schoenflies: "4mm",
		international_short: "I4cm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 108,
		choice: "",
		international_full: "I 4 c m",
		hall_symbol: "I 4 -2c",
		international: "I 4 c m",
		arithmetic_crystal_class_number: 31,
		arithmetic_crystal_class_symbol: "4mmI"
	},
		"386": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^11",
		pointgroup_schoenflies: "4mm",
		international_short: "I4_1md",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 109,
		choice: "",
		international_full: "I 4_1 m d",
		hall_symbol: "I 4bw -2",
		international: "I 4_1 m d",
		arithmetic_crystal_class_number: 31,
		arithmetic_crystal_class_symbol: "4mmI"
	},
		"387": {
		pointgroup_international: "C4v",
		schoenflies: "C4v^12",
		pointgroup_schoenflies: "4mm",
		international_short: "I4_1cd",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.75
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.25
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.75
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 110,
		choice: "",
		international_full: "I 4_1 c d",
		hall_symbol: "I 4bw -2c",
		international: "I 4_1 c d",
		arithmetic_crystal_class_number: 31,
		arithmetic_crystal_class_symbol: "4mmI"
	},
		"388": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^1",
		pointgroup_schoenflies: "-42m",
		international_short: "P-42m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 111,
		choice: "",
		international_full: "P -4 2 m",
		hall_symbol: "P -4 2",
		international: "P -4 2 m",
		arithmetic_crystal_class_number: 32,
		arithmetic_crystal_class_symbol: "-42mP"
	},
		"389": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^2",
		pointgroup_schoenflies: "-42m",
		international_short: "P-42c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 112,
		choice: "",
		international_full: "P -4 2 c",
		hall_symbol: "P -4 2c",
		international: "P -4 2 c",
		arithmetic_crystal_class_number: 32,
		arithmetic_crystal_class_symbol: "-42mP"
	},
		"390": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^3",
		pointgroup_schoenflies: "-42m",
		international_short: "P-42_1m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 113,
		choice: "",
		international_full: "P -4 2_1 m",
		hall_symbol: "P -4 2ab",
		international: "P -4 2_1 m",
		arithmetic_crystal_class_number: 32,
		arithmetic_crystal_class_symbol: "-42mP"
	},
		"391": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^4",
		pointgroup_schoenflies: "-42m",
		international_short: "P-42_1c",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 114,
		choice: "",
		international_full: "P -4 2_1 c",
		hall_symbol: "P -4 2n",
		international: "P -4 2_1 c",
		arithmetic_crystal_class_number: 32,
		arithmetic_crystal_class_symbol: "-42mP"
	},
		"392": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^5",
		pointgroup_schoenflies: "-42m",
		international_short: "P-4m2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 115,
		choice: "",
		international_full: "P -4 m 2",
		hall_symbol: "P -4 -2",
		international: "P -4 m 2",
		arithmetic_crystal_class_number: 33,
		arithmetic_crystal_class_symbol: "-4m2P"
	},
		"393": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^6",
		pointgroup_schoenflies: "-42m",
		international_short: "P-4c2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 116,
		choice: "",
		international_full: "P -4 c 2",
		hall_symbol: "P -4 -2c",
		international: "P -4 c 2",
		arithmetic_crystal_class_number: 33,
		arithmetic_crystal_class_symbol: "-4m2P"
	},
		"394": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^7",
		pointgroup_schoenflies: "-42m",
		international_short: "P-4b2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 117,
		choice: "",
		international_full: "P -4 b 2",
		hall_symbol: "P -4 -2ab",
		international: "P -4 b 2",
		arithmetic_crystal_class_number: 33,
		arithmetic_crystal_class_symbol: "-4m2P"
	},
		"395": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^8",
		pointgroup_schoenflies: "-42m",
		international_short: "P-4n2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 118,
		choice: "",
		international_full: "P -4 n 2",
		hall_symbol: "P -4 -2n",
		international: "P -4 n 2",
		arithmetic_crystal_class_number: 33,
		arithmetic_crystal_class_symbol: "-4m2P"
	},
		"396": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^9",
		pointgroup_schoenflies: "-42m",
		international_short: "I-4m2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 119,
		choice: "",
		international_full: "I -4 m 2",
		hall_symbol: "I -4 -2",
		international: "I -4 m 2",
		arithmetic_crystal_class_number: 34,
		arithmetic_crystal_class_symbol: "-4m2I"
	},
		"397": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^10",
		pointgroup_schoenflies: "-42m",
		international_short: "I-4c2",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			]
		],
		number: 120,
		choice: "",
		international_full: "I -4 c 2",
		hall_symbol: "I -4 -2c",
		international: "I -4 c 2",
		arithmetic_crystal_class_number: 34,
		arithmetic_crystal_class_symbol: "-4m2I"
	},
		"398": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^11",
		pointgroup_schoenflies: "-42m",
		international_short: "I-42m",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 121,
		choice: "",
		international_full: "I -4 2 m",
		hall_symbol: "I -4 2",
		international: "I -4 2 m",
		arithmetic_crystal_class_number: 35,
		arithmetic_crystal_class_symbol: "-42mI"
	},
		"399": {
		pointgroup_international: "D2d",
		schoenflies: "D2d^12",
		pointgroup_schoenflies: "-42m",
		international_short: "I-42d",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0,
				0.75
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 122,
		choice: "",
		international_full: "I -4 2 d",
		hall_symbol: "I -4 2bw",
		international: "I -4 2 d",
		arithmetic_crystal_class_number: 35,
		arithmetic_crystal_class_symbol: "-42mI"
	},
		"400": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^1",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/mmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 123,
		choice: "",
		international_full: "P 4/m 2/m 2/m",
		hall_symbol: "-P 4 2",
		international: "P 4/m m m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"401": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^2",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/mcc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 124,
		choice: "",
		international_full: "P 4/m 2/c 2/c",
		hall_symbol: "-P 4 2c",
		international: "P 4/m c c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"402": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^3",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/nbm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 125,
		choice: "1",
		international_full: "P 4/n 2/b 2/m",
		hall_symbol: "P 4 2 -1ab",
		international: "P 4/n b m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"403": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^3",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/nbm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 125,
		choice: "2",
		international_full: "P 4/n 2/b 2/m",
		hall_symbol: "-P 4a 2b",
		international: "P 4/n b m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"404": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^4",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/nnc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 126,
		choice: "1",
		international_full: "P 4/n 2/n 2/c",
		hall_symbol: "P 4 2 -1n",
		international: "P 4/n n c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"405": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^4",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/nnc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 126,
		choice: "2",
		international_full: "P 4/n 2/n 2/c",
		hall_symbol: "-P 4a 2bc",
		international: "P 4/n n c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"406": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^5",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/mbm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 127,
		choice: "",
		international_full: "P 4/m 2_1/b m",
		hall_symbol: "-P 4 2ab",
		international: "P 4/m b m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"407": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^6",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/mnc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 128,
		choice: "",
		international_full: "P 4/m 2_1/n c",
		hall_symbol: "-P 4 2n",
		international: "P 4/m n c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"408": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^7",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/nmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 129,
		choice: "1",
		international_full: "P 4/n 2_1/m m",
		hall_symbol: "P 4ab 2ab -1ab",
		international: "P 4/n m m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"409": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^7",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/nmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 129,
		choice: "2",
		international_full: "P 4/n 2_1/m m",
		hall_symbol: "-P 4a 2a",
		international: "P 4/n m m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"410": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^8",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/ncc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 130,
		choice: "1",
		international_full: "P 4/n 2_1/c c",
		hall_symbol: "P 4ab 2n -1ab",
		international: "P 4/n c c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"411": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^8",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4/ncc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 130,
		choice: "2",
		international_full: "P 4/n 2_1/c c",
		hall_symbol: "-P 4a 2ac",
		international: "P 4/n c c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"412": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^9",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/mmc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 131,
		choice: "",
		international_full: "P 4_2/m 2/m 2/c",
		hall_symbol: "-P 4c 2",
		international: "P 4_2/m m c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"413": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^10",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/mcm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 132,
		choice: "",
		international_full: "P 4_2/m 2/c 2/m",
		hall_symbol: "-P 4c 2c",
		international: "P 4_2/m c m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"414": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^11",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/nbc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 133,
		choice: "1",
		international_full: "P 4_2/n 2/b 2/c",
		hall_symbol: "P 4n 2c -1n",
		international: "P 4_2/n b c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"415": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^11",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/nbc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 133,
		choice: "2",
		international_full: "P 4_2/n 2/b 2/c",
		hall_symbol: "-P 4ac 2b",
		international: "P 4_2/n b c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"416": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^12",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/nnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 134,
		choice: "1",
		international_full: "P 4_2/n 2/n 2/m",
		hall_symbol: "P 4n 2 -1n",
		international: "P 4_2/n n m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"417": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^12",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/nnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 134,
		choice: "2",
		international_full: "P 4_2/n 2/n 2/m",
		hall_symbol: "-P 4ac 2bc",
		international: "P 4_2/n n m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"418": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^13",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/mbc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 135,
		choice: "",
		international_full: "P 4_2/m 2_1/b 2/c",
		hall_symbol: "-P 4c 2ab",
		international: "P 4_2/m b c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"419": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^14",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/mnm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 136,
		choice: "",
		international_full: "P 4_2/m 2_1/n 2/m",
		hall_symbol: "-P 4n 2n",
		international: "P 4_2/m n m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"420": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^15",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/nmc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 137,
		choice: "1",
		international_full: "P 4_2/n 2_1/m 2/c",
		hall_symbol: "P 4n 2n -1n",
		international: "P 4_2/n m c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"421": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^15",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/nmc",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0
			],
			[
				0.5,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 137,
		choice: "2",
		international_full: "P 4_2/n 2_1/m 2/c",
		hall_symbol: "-P 4ac 2a",
		international: "P 4_2/n m c",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"422": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^16",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/ncm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 138,
		choice: "1",
		international_full: "P 4_2/n 2_1/c 2/m",
		hall_symbol: "P 4n 2ab -1n",
		international: "P 4_2/n c m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"423": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^16",
		pointgroup_schoenflies: "4/mmm",
		international_short: "P4_2/ncm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 138,
		choice: "2",
		international_full: "P 4_2/n 2_1/c 2/m",
		hall_symbol: "-P 4ac 2ac",
		international: "P 4_2/n c m",
		arithmetic_crystal_class_number: 36,
		arithmetic_crystal_class_symbol: "4/mmmP"
	},
		"424": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^17",
		pointgroup_schoenflies: "4/mmm",
		international_short: "I4/mmm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 139,
		choice: "",
		international_full: "I 4/m 2/m 2/m",
		hall_symbol: "-I 4 2",
		international: "I 4/m m m",
		arithmetic_crystal_class_number: 37,
		arithmetic_crystal_class_symbol: "4/mmmI"
	},
		"425": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^18",
		pointgroup_schoenflies: "4/mmm",
		international_short: "I4/mcm",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0.5,
				0
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 140,
		choice: "",
		international_full: "I 4/m 2/c 2/m",
		hall_symbol: "-I 4 2c",
		international: "I 4/m c m",
		arithmetic_crystal_class_number: 37,
		arithmetic_crystal_class_symbol: "4/mmmI"
	},
		"426": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^19",
		pointgroup_schoenflies: "4/mmm",
		international_short: "I4_1/amd",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 141,
		choice: "1",
		international_full: "I 4_1/a 2/m 2/d",
		hall_symbol: "I 4bw 2bw -1bw",
		international: "I 4_1/a m d",
		arithmetic_crystal_class_number: 37,
		arithmetic_crystal_class_symbol: "4/mmmI"
	},
		"427": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^19",
		pointgroup_schoenflies: "4/mmm",
		international_short: "I4_1/amd",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.25,
				0.75,
				0.25
			],
			[
				0.25,
				0.75,
				0.25
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.25,
				0.25,
				0.75
			],
			[
				0.25,
				0.25,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0
			],
			[
				0.25,
				0.25,
				0.75
			],
			[
				0.25,
				0.25,
				0.75
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.5
			],
			[
				0.25,
				0.75,
				0.25
			],
			[
				0.25,
				0.75,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0.75,
				0.75,
				0.25
			],
			[
				0,
				0.5,
				0
			],
			[
				0,
				0.5,
				0
			],
			[
				0.75,
				0.25,
				0.75
			],
			[
				0.75,
				0.25,
				0.75
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			]
		],
		number: 141,
		choice: "2",
		international_full: "I 4_1/a 2/m 2/d",
		hall_symbol: "-I 4bd 2",
		international: "I 4_1/a m d",
		arithmetic_crystal_class_number: 37,
		arithmetic_crystal_class_symbol: "4/mmmI"
	},
		"428": {
		pointgroup_international: "D4h",
		schoenflies: "D4h^20",
		pointgroup_schoenflies: "4/mmm",
		international_short: "I4_1/acd",
		translations: [
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0,
				0.25
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0,
				0.5,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.25
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0.5,
				0.75
			],
			[
				0,
				0,
				0.5
			],
			[
				0.5,
				0,
				0.25
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.75
			],
			[
				0.5,
				0.5,
				0.5
			],
			[
				0,
				0.5,
				0.25
			],
			[
				0,
				0,
				0
			],
			[
				0,
				0,
				0.5
			],
			[
				0,
				0.5,
				0.75
			],
			[
				0.5,
				0.5,
				0
			],
			[
				0.5,
				0,
				0.25
			]
		],
		rotations: [
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					1
				]
			],
			[
				[
					1,
					0,
					0
				],
				[
					0,
					-1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					-1,
					0
				],
				[
					-1,
					0,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					-1,
					0,
					0
				],
				[
					0,
					1,
					0
				],
				[
					0,
					0,
					-1
				]
			],
			[
				[
					0,
					1,
					0
				],
				[
					1,
					0,
					0
				],
				[
					0,
					0,
					-1
			[