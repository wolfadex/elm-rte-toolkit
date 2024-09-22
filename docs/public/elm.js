(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.ba.ak === region.bt.ak)
	{
		return 'on line ' + region.ba.ak;
	}
	return 'on lines ' + region.ba.ak + ' through ' + region.bt.ak;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cI,
		impl.c8,
		impl.c6,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		N: func(record.N),
		bb: record.bb,
		a5: record.a5
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.N;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bb;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.a5) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cI,
		impl.c8,
		impl.c6,
		function(sendToApp, initialModel) {
			var view = impl.c9;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cI,
		impl.c8,
		impl.c6,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.a9 && impl.a9(sendToApp)
			var view = impl.c9;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.bn);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.ca) && (_VirtualDom_doc.title = title = doc.ca);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.cS;
	var onUrlRequest = impl.cT;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		a9: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bX === next.bX
							&& curr.bC === next.bC
							&& curr.bQ.a === next.bQ.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		cI: function(flags)
		{
			return A3(impl.cI, flags, _Browser_getUrl(), key);
		},
		c9: impl.c9,
		c8: impl.c8,
		c6: impl.c6
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { cF: 'hidden', cn: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { cF: 'mozHidden', cn: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { cF: 'msHidden', cn: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { cF: 'webkitHidden', cn: 'webkitvisibilitychange' }
		: { cF: 'hidden', cn: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		b1: _Browser_getScene(),
		cd: {
			cf: _Browser_window.pageXOffset,
			cg: _Browser_window.pageYOffset,
			ce: _Browser_doc.documentElement.clientWidth,
			bA: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ce: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		bA: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			b1: {
				ce: node.scrollWidth,
				bA: node.scrollHeight
			},
			cd: {
				cf: node.scrollLeft,
				cg: node.scrollTop,
				ce: node.clientWidth,
				bA: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			b1: _Browser_getScene(),
			cd: {
				cf: x,
				cg: y,
				ce: _Browser_doc.documentElement.clientWidth,
				bA: _Browser_doc.documentElement.clientHeight
			},
			aC: {
				cf: x + rect.left,
				cg: y + rect.top,
				ce: rect.width,
				bA: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});


function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}

// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function(options, string)
{
	var flags = 'g';
	if (options.cQ) { flags += 'm'; }
	if (options.cm) { flags += 'i'; }

	try
	{
		return $elm$core$Maybe$Just(new RegExp(string, flags));
	}
	catch(error)
	{
		return $elm$core$Maybe$Nothing;
	}
});


// USE

var _Regex_contains = F2(function(re, string)
{
	return string.match(re) !== null;
});


var _Regex_findAtMost = F3(function(n, re, str)
{
	var out = [];
	var number = 0;
	var string = str;
	var lastIndex = re.lastIndex;
	var prevLastIndex = -1;
	var result;
	while (number++ < n && (result = re.exec(string)))
	{
		if (prevLastIndex == re.lastIndex) break;
		var i = result.length - 1;
		var subs = new Array(i);
		while (i > 0)
		{
			var submatch = result[i];
			subs[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		out.push(A4($elm$regex$Regex$Match, result[0], result.index, number, _List_fromArray(subs)));
		prevLastIndex = re.lastIndex;
	}
	re.lastIndex = lastIndex;
	return _List_fromArray(out);
});


var _Regex_replaceAtMost = F4(function(n, re, replacer, string)
{
	var count = 0;
	function jsReplacer(match)
	{
		if (count++ >= n)
		{
			return match;
		}
		var i = arguments.length - 3;
		var submatches = new Array(i);
		while (i > 0)
		{
			var submatch = arguments[i];
			submatches[--i] = submatch
				? $elm$core$Maybe$Just(submatch)
				: $elm$core$Maybe$Nothing;
		}
		return replacer(A4($elm$regex$Regex$Match, match, arguments[arguments.length - 2], count, _List_fromArray(submatches)));
	}
	return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function(n, re, str)
{
	var string = str;
	var out = [];
	var start = re.lastIndex;
	var restoreLastIndex = re.lastIndex;
	while (n--)
	{
		var result = re.exec(string);
		if (!result) break;
		out.push(string.slice(start, result.index));
		start = re.lastIndex;
	}
	out.push(string.slice(start));
	re.lastIndex = restoreLastIndex;
	return _List_fromArray(out);
});

var _Regex_infinity = Infinity;




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $author$project$Main$ChangedUrl = function (a) {
	return {$: 0, a: a};
};
var $author$project$Main$ClickedLink = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.i) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.j),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.j);
		} else {
			var treeLen = builder.i * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.k) : builder.k;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.i);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.j) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.j);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{k: nodeList, i: (len / $elm$core$Array$branchFactor) | 0, j: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {cD: fragment, bC: host, cV: path, bQ: port_, bX: protocol, bY: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$Main$Redirect = function (a) {
	return {$: 0, a: a};
};
var $author$project$Session$Session = $elm$core$Basics$identity;
var $author$project$Main$Basic = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$Examples = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$GotBasicMsg = function (a) {
	return {$: 2, a: a};
};
var $author$project$Main$GotExamplesMsg = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$GotHomeMsg = function (a) {
	return {$: 7, a: a};
};
var $author$project$Main$GotMarkdownMsg = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$GotSpecExtensionMsg = function (a) {
	return {$: 4, a: a};
};
var $author$project$Main$GotSpecFromScratchMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$Home = function (a) {
	return {$: 6, a: a};
};
var $author$project$Main$Markdown = function (a) {
	return {$: 5, a: a};
};
var $author$project$Main$NotFound = function (a) {
	return {$: 1, a: a};
};
var $author$project$Main$SpecExtension = function (a) {
	return {$: 3, a: a};
};
var $author$project$Main$SpecFromScratch = function (a) {
	return {$: 4, a: a};
};
var $author$project$Controls$Bold = 0;
var $author$project$Controls$Italic = 1;
var $author$project$RichText$Internal$Editor$Editor = $elm$core$Basics$identity;
var $author$project$RichText$Internal$Editor$defaultDequeSize = 64;
var $author$project$RichText$Internal$History$History = $elm$core$Basics$identity;
var $folkertdev$elm_deque$BoundedDeque$BoundedDeque = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $folkertdev$elm_deque$Internal$empty = {t: _List_Nil, u: _List_Nil, p: 0, q: 0};
var $folkertdev$elm_deque$BoundedDeque$empty = function (size) {
	return A2($folkertdev$elm_deque$BoundedDeque$BoundedDeque, $folkertdev$elm_deque$Internal$empty, size);
};
var $author$project$RichText$Internal$History$empty = function (config) {
	return {
		bz: config.bz,
		aZ: 0,
		am: _List_Nil,
		E: $folkertdev$elm_deque$BoundedDeque$empty(config.c2)
	};
};
var $author$project$RichText$Config$Keys$meta = 'Meta';
var $author$project$RichText$Internal$Editor$editor = function (iState) {
	return {
		ay: $elm$core$Maybe$Nothing,
		ai: 0,
		aj: 0,
		aH: $author$project$RichText$Internal$History$empty(
			{bz: 500, c2: $author$project$RichText$Internal$Editor$defaultDequeSize}),
		bI: false,
		an: 0,
		ap: 0,
		c1: $author$project$RichText$Config$Keys$meta,
		aO: iState
	};
};
var $author$project$RichText$Editor$init = $author$project$RichText$Internal$Editor$editor;
var $author$project$Editor$initEditor = function (iState) {
	return $author$project$RichText$Editor$init(iState);
};
var $author$project$Editor$initInsertImageModal = {bl: '', bs: $elm$core$Maybe$Nothing, b6: '', aT: false};
var $author$project$Editor$initInsertLinkModal = {bs: $elm$core$Maybe$Nothing, bD: '', ca: '', aT: false};
var $author$project$Editor$init = function (iState) {
	return {
		a: $author$project$Editor$initEditor(iState),
		v: $author$project$Editor$initInsertImageModal,
		w: $author$project$Editor$initInsertLinkModal,
		bc: _List_fromArray(
			[0, 1])
	};
};
var $author$project$RichText$Model$Node$Block = $elm$core$Basics$identity;
var $author$project$RichText$Model$Node$block = F2(
	function (parameters, cn) {
		return {cp: cn, aL: parameters};
	});
var $author$project$RichText$Model$Node$BlockArray = $elm$core$Basics$identity;
var $author$project$RichText$Model$Node$BlockChildren = function (a) {
	return {$: 0, a: a};
};
var $author$project$RichText$Model$Node$blockChildren = function (arr) {
	return $author$project$RichText$Model$Node$BlockChildren(arr);
};
var $author$project$RichText$Internal$Definitions$BlockNodeType = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$RichText$Config$ElementDefinition$blockNode = function (allowedGroups) {
	return $author$project$RichText$Internal$Definitions$BlockNodeType(
		$elm$core$List$isEmpty(allowedGroups) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
			$elm$core$Set$fromList(allowedGroups)));
};
var $author$project$RichText$Model$HtmlNode$ElementNode = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $author$project$RichText$Definitions$docToHtml = F2(
	function (_v0, children) {
		return A3(
			$author$project$RichText$Model$HtmlNode$ElementNode,
			'div',
			_List_fromArray(
				[
					_Utils_Tuple2('data-rte-doc', 'true')
				]),
			children);
	});
var $author$project$RichText$Internal$Definitions$ElementDefinition = $elm$core$Basics$identity;
var $author$project$RichText$Config$ElementDefinition$elementDefinition = function (contents) {
	return contents;
};
var $author$project$RichText$Internal$Definitions$ElementParameters = $elm$core$Basics$identity;
var $author$project$RichText$Internal$Constants$selectable = '__selectable__';
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $elm$core$Set$singleton = function (key) {
	return A2($elm$core$Dict$singleton, key, 0);
};
var $author$project$RichText$Internal$Definitions$element = F2(
	function (def, attrs) {
		var d = def;
		return {
			ax: d.c0 ? $elm$core$Set$singleton($author$project$RichText$Internal$Constants$selectable) : $elm$core$Set$empty,
			H: attrs,
			bM: d.bM
		};
	});
var $author$project$RichText$Model$Element$element = $author$project$RichText$Internal$Definitions$element;
var $author$project$RichText$Definitions$htmlToDoc = F2(
	function (definition, node) {
		if (!node.$) {
			var name = node.a;
			var attrs = node.b;
			var children = node.c;
			return ((name === 'div') && _Utils_eq(
				attrs,
				_List_fromArray(
					[
						_Utils_Tuple2('data-rte-doc', 'true')
					]))) ? $elm$core$Maybe$Just(
				_Utils_Tuple2(
					A2($author$project$RichText$Model$Element$element, definition, _List_Nil),
					children)) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$doc = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$blockNode(
			_List_fromArray(
				['block'])),
		by: $author$project$RichText$Definitions$htmlToDoc,
		cE: 'root',
		bM: 'doc',
		c0: false,
		cb: $author$project$RichText$Definitions$docToHtml
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{k: nodeList, i: nodeListSize, j: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $author$project$RichText$Model$Node$InlineChildren = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Model$Node$InlineLeafArray = $elm$core$Basics$identity;
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $author$project$RichText$Model$Node$inlineTreeToPaths = F2(
	function (backwardsPath, tree) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var i = _v0.a;
				var n = _v0.b;
				if (n.$ === 1) {
					return _List_fromArray(
						[
							$elm$core$List$reverse(
							A2($elm$core$List$cons, i, backwardsPath))
						]);
				} else {
					var mn = n.a;
					return A2(
						$author$project$RichText$Model$Node$inlineTreeToPaths,
						A2($elm$core$List$cons, i, backwardsPath),
						mn.cq);
				}
			},
			A2(
				$elm$core$List$indexedMap,
				$elm$core$Tuple$pair,
				$elm$core$Array$toList(tree)));
	});
var $author$project$RichText$Model$InlineElement$marks = function (parameters) {
	var c = parameters;
	return c.W;
};
var $author$project$RichText$Model$Text$marks = function (parameters) {
	var c = parameters;
	return c.W;
};
var $author$project$RichText$Model$Node$marks = function (leaf) {
	if (leaf.$ === 1) {
		var l = leaf.a;
		return $author$project$RichText$Model$Text$marks(l);
	} else {
		var l = leaf.a;
		return $author$project$RichText$Model$InlineElement$marks(l);
	}
};
var $author$project$RichText$Model$Node$LeafNode = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Model$Node$MarkNode = function (a) {
	return {$: 0, a: a};
};
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elmcraft$core_extra$List$Extra$groupWhile = F2(
	function (isSameGroup, items) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					if (!acc.b) {
						return _List_fromArray(
							[
								_Utils_Tuple2(x, _List_Nil)
							]);
					} else {
						var _v1 = acc.a;
						var y = _v1.a;
						var restOfGroup = _v1.b;
						var groups = acc.b;
						return A2(isSameGroup, x, y) ? A2(
							$elm$core$List$cons,
							_Utils_Tuple2(
								x,
								A2($elm$core$List$cons, y, restOfGroup)),
							groups) : A2(
							$elm$core$List$cons,
							_Utils_Tuple2(x, _List_Nil),
							acc);
					}
				}),
			_List_Nil,
			items);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$RichText$Internal$Definitions$nameFromMark = function (m) {
	var c = m;
	return c.bM;
};
var $author$project$RichText$Model$Mark$name = $author$project$RichText$Internal$Definitions$nameFromMark;
var $author$project$RichText$Model$Node$marksToMarkNodeListRec = function (indexedMarkLists) {
	return $elm$core$Array$fromList(
		A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var _v1 = _v0.a;
				var i = _v1.a;
				var _v2 = _v1.b;
				var m = _v2.a;
				var rest = _v2.b;
				var groupRest = _v0.b;
				if (m.$ === 1) {
					return A2(
						$elm$core$List$cons,
						$author$project$RichText$Model$Node$LeafNode(i),
						A2(
							$elm$core$List$map,
							function (_v4) {
								var j = _v4.a;
								return $author$project$RichText$Model$Node$LeafNode(j);
							},
							groupRest));
				} else {
					var mk = m.a;
					return _List_fromArray(
						[
							$author$project$RichText$Model$Node$MarkNode(
							{
								cq: $author$project$RichText$Model$Node$marksToMarkNodeListRec(
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(i, rest),
										A2(
											$elm$core$List$map,
											function (_v5) {
												var j = _v5.a;
												var _v6 = _v5.b;
												var r = _v6.b;
												return _Utils_Tuple2(j, r);
											},
											groupRest))),
								bK: mk
							})
						]);
				}
			},
			A2(
				$elmcraft$core_extra$List$Extra$groupWhile,
				F2(
					function (_v7, _v9) {
						var _v8 = _v7.b;
						var m1 = _v8.a;
						var _v10 = _v9.b;
						var m2 = _v10.a;
						if (m1.$ === 1) {
							if (m2.$ === 1) {
								return true;
							} else {
								return false;
							}
						} else {
							var v1 = m1.a;
							if (!m2.$) {
								var v2 = m2.a;
								return _Utils_eq(
									$author$project$RichText$Model$Mark$name(v1),
									$author$project$RichText$Model$Mark$name(v2));
							} else {
								return false;
							}
						}
					}),
				A2(
					$elm$core$List$map,
					function (_v14) {
						var i = _v14.a;
						var a = _v14.b;
						return _Utils_Tuple2(
							i,
							_Utils_Tuple2(
								$elm$core$List$head(a),
								A2($elm$core$List$drop, 1, a)));
					},
					indexedMarkLists))));
};
var $author$project$RichText$Model$Node$marksToMarkNodeList = function (markLists) {
	return $author$project$RichText$Model$Node$marksToMarkNodeListRec(
		A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, markLists));
};
var $author$project$RichText$Model$Node$inlineChildren = function (arr) {
	var tree = $author$project$RichText$Model$Node$marksToMarkNodeList(
		A2(
			$elm$core$List$map,
			$author$project$RichText$Model$Node$marks,
			$elm$core$Array$toList(arr)));
	return $author$project$RichText$Model$Node$InlineChildren(
		{
			aU: arr,
			a7: $elm$core$Array$fromList(
				A2($author$project$RichText$Model$Node$inlineTreeToPaths, _List_Nil, tree)),
			be: tree
		});
};
var $author$project$RichText$Definitions$htmlToParagraph = F2(
	function (definition, node) {
		if (!node.$) {
			var name = node.a;
			var children = node.c;
			return (name === 'p') ? $elm$core$Maybe$Just(
				_Utils_Tuple2(
					A2($author$project$RichText$Model$Element$element, definition, _List_Nil),
					children)) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$paragraphToHtml = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'p', _List_Nil, children);
	});
var $author$project$RichText$Internal$Definitions$TextBlockNodeType = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Config$ElementDefinition$textBlock = function (config) {
	return $author$project$RichText$Internal$Definitions$TextBlockNodeType(
		{
			ci: $elm$core$List$isEmpty(config.ci) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				$elm$core$Set$fromList(config.ci)),
			cj: $elm$core$List$isEmpty(config.cj) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				$elm$core$Set$fromList(config.cj))
		});
};
var $author$project$RichText$Definitions$paragraph = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$textBlock(
			{
				ci: _List_fromArray(
					['inline']),
				cj: _List_Nil
			}),
		by: $author$project$RichText$Definitions$htmlToParagraph,
		cE: 'block',
		bM: 'paragraph',
		c0: false,
		cb: $author$project$RichText$Definitions$paragraphToHtml
	});
var $author$project$RichText$Model$Node$Text = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Model$Text$Text = $elm$core$Basics$identity;
var $author$project$RichText$Model$Text$empty = {ax: $elm$core$Set$empty, W: _List_Nil, as: ''};
var $author$project$RichText$Model$Text$withText = F2(
	function (s, parameters) {
		var c = parameters;
		return _Utils_update(
			c,
			{as: s});
	});
var $author$project$RichText$Model$Node$plainText = function (s) {
	return $author$project$RichText$Model$Node$Text(
		A2($author$project$RichText$Model$Text$withText, s, $author$project$RichText$Model$Text$empty));
};
var $author$project$Editor$initialEditorNode = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil),
	$author$project$RichText$Model$Node$inlineChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$RichText$Model$Node$plainText('This is some sample text')
				]))));
var $author$project$Editor$docInitNode = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$doc, _List_Nil),
	$author$project$RichText$Model$Node$blockChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[$author$project$Editor$initialEditorNode]))));
var $author$project$RichText$Model$State$State = $elm$core$Basics$identity;
var $author$project$RichText$Model$State$state = F2(
	function (root_, sel_) {
		return {c_: root_, b2: sel_};
	});
var $author$project$Editor$initialState = A2($author$project$RichText$Model$State$state, $author$project$Editor$docInitNode, $elm$core$Maybe$Nothing);
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Page$Basic$init = function (session) {
	return _Utils_Tuple2(
		{
			a: $author$project$Editor$init($author$project$Editor$initialState),
			aN: session
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Page$Examples$init = function (session) {
	return _Utils_Tuple2(
		{aN: session},
		$elm$core$Platform$Cmd$none);
};
var $author$project$RichText$Definitions$codeToHtmlNode = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'code', _List_Nil, children);
	});
var $author$project$RichText$Internal$Definitions$Mark = $elm$core$Basics$identity;
var $author$project$RichText$Internal$Definitions$mark = F2(
	function (n, a) {
		var nn = n;
		return {H: a, bM: nn.bM};
	});
var $author$project$RichText$Config$MarkDefinition$defaultHtmlToMark = F3(
	function (htmlTag, def, node) {
		if (!node.$) {
			var name_ = node.a;
			var children = node.c;
			return _Utils_eq(name_, htmlTag) ? $elm$core$Maybe$Just(
				_Utils_Tuple2(
					A2($author$project$RichText$Internal$Definitions$mark, def, _List_Nil),
					children)) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$htmlNodeToCode = $author$project$RichText$Config$MarkDefinition$defaultHtmlToMark('code');
var $author$project$RichText$Internal$Definitions$MarkDefinition = $elm$core$Basics$identity;
var $author$project$RichText$Config$MarkDefinition$markDefinition = function (contents) {
	return contents;
};
var $author$project$RichText$Definitions$code = $author$project$RichText$Config$MarkDefinition$markDefinition(
	{by: $author$project$RichText$Definitions$htmlNodeToCode, bM: 'code', cb: $author$project$RichText$Definitions$codeToHtmlNode});
var $author$project$RichText$Model$Mark$mark = $author$project$RichText$Internal$Definitions$mark;
var $author$project$RichText$Model$Text$withMarks = F2(
	function (m, parameters) {
		var c = parameters;
		return _Utils_update(
			c,
			{W: m});
	});
var $author$project$Page$Home$initialEditorNode = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil),
	$author$project$RichText$Model$Node$inlineChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$RichText$Model$Node$plainText('Rich Text Editor Toolkit is an open source project to make cross platform editors on the web. ' + 'This package treats '),
					$author$project$RichText$Model$Node$Text(
					A2(
						$author$project$RichText$Model$Text$withMarks,
						_List_fromArray(
							[
								A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$code, _List_Nil)
							]),
						A2($author$project$RichText$Model$Text$withText, 'contenteditable', $author$project$RichText$Model$Text$empty))),
					$author$project$RichText$Model$Node$plainText(' as an I/O device, and uses browser events and mutation observers ' + ('to detect changes and update itself.  The editor\'s model is defined ' + ('and validated by a programmable specification that allows you to create a ' + 'custom tailored editor that fits your needs.')))
				]))));
var $author$project$Page$Home$initNode = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$doc, _List_Nil),
	$author$project$RichText$Model$Node$blockChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[$author$project$Page$Home$initialEditorNode]))));
var $author$project$Page$Home$initialState = A2($author$project$RichText$Model$State$state, $author$project$Page$Home$initNode, $elm$core$Maybe$Nothing);
var $author$project$Page$Home$init = function (session) {
	return _Utils_Tuple2(
		{
			a: $author$project$Editor$init($author$project$Page$Home$initialState),
			aN: session
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Page$Markdown$WYSIWYG = 1;
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$Page$Markdown$initializeEditor = function (state) {
	var initialEditor = $author$project$Editor$init(state);
	return _Utils_update(
		initialEditor,
		{
			bc: _List_fromArray(
				[0, 1])
		});
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $author$project$Page$Markdown$indentEverythingButFirstLine = F2(
	function (n, s) {
		return A2(
			$elm$core$String$join,
			'\n',
			A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, x) {
						return (!i) ? x : _Utils_ap(
							A2($elm$core$String$repeat, n, ' '),
							x);
					}),
				A2($elm$core$String$split, '\n', s)));
	});
var $author$project$Page$Markdown$escapeForMarkdown = function (s) {
	return s;
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $author$project$Page$Markdown$unwrapAndFilterChildNodes = function (results) {
	var unwrappedResults = A2(
		$elm$core$List$filterMap,
		function (x) {
			if (!x.$) {
				var v = x.a;
				return $elm$core$Maybe$Just(v);
			} else {
				return $elm$core$Maybe$Nothing;
			}
		},
		results);
	return _Utils_eq(
		$elm$core$List$length(unwrappedResults),
		$elm$core$List$length(results)) ? $elm$core$Result$Ok(unwrappedResults) : $elm$core$Result$Err(
		A2(
			$elm$core$String$join,
			'\n',
			A2(
				$elm$core$List$filterMap,
				function (x) {
					if (x.$ === 1) {
						var s = x.a;
						return $elm$core$Maybe$Just(s);
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				results)));
};
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Page$Markdown$inlineMarkdownChildrenToString = function (inlines) {
	return A2(
		$elm$core$Result$map,
		$elm$core$String$join(''),
		$author$project$Page$Markdown$unwrapAndFilterChildNodes(
			A2($elm$core$List$map, $author$project$Page$Markdown$inlineMarkdownToString, inlines)));
};
var $author$project$Page$Markdown$inlineMarkdownToString = function (inline) {
	switch (inline.$) {
		case 0:
			var s = inline.a;
			return $elm$core$Result$Ok(
				$author$project$Page$Markdown$escapeForMarkdown(s));
		case 1:
			return $elm$core$Result$Ok('  \n');
		case 2:
			var s = inline.a;
			return $elm$core$Result$Ok('`' + (s + '`'));
		case 3:
			var href = inline.a;
			var title = inline.b;
			var children = inline.c;
			return A2(
				$elm$core$Result$map,
				function (c) {
					var t = A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function (m) {
								return ' \"' + (m + '\"');
							},
							title));
					return '[' + (c + ('](' + (href + (t + ')'))));
				},
				$author$project$Page$Markdown$inlineMarkdownChildrenToString(children));
		case 4:
			var url = inline.a;
			var alt = inline.b;
			var children = inline.c;
			return A2(
				$elm$core$Result$map,
				function (c) {
					var a = A2(
						$elm$core$Maybe$withDefault,
						'',
						A2(
							$elm$core$Maybe$map,
							function (m) {
								return ' \"' + (m + '\"');
							},
							alt));
					return '![' + (c + ('](' + (url + (a + ')'))));
				},
				$author$project$Page$Markdown$inlineMarkdownChildrenToString(children));
		case 6:
			var length = inline.a;
			var children = inline.b;
			var e = A2($elm$core$String$repeat, length, '*');
			return A2(
				$elm$core$Result$map,
				function (c) {
					return _Utils_ap(
						e,
						_Utils_ap(c, e));
				},
				$author$project$Page$Markdown$inlineMarkdownChildrenToString(children));
		case 5:
			return $elm$core$Result$Err('Html inline is not implemented.');
		default:
			return $elm$core$Result$Err('Custom elements are not implemented');
	}
};
var $author$project$Page$Markdown$markdownCodeBlockToString = F2(
	function (cb, s) {
		if (cb.$ === 1) {
			var fence = cb.b;
			var delimeter = A2($elm$core$String$repeat, fence.bw, fence.cA);
			return $elm$core$Result$Ok(
				(delimeter + '\n') + (A2(
					$elm$core$String$join,
					'\n',
					A2(
						$elm$core$List$map,
						function (v) {
							return _Utils_ap(
								A2($elm$core$String$repeat, fence.aI, ' '),
								v);
						},
						A2($elm$core$String$split, '\n', s))) + ('\n' + delimeter)));
		} else {
			return $elm$core$Result$Ok(
				A2(
					$elm$core$String$join,
					'\n',
					A2(
						$elm$core$List$map,
						function (v) {
							return '    ' + v;
						},
						A2($elm$core$String$split, '\n', s))));
		}
	});
var $author$project$Page$Markdown$blockMarkdownChildrenToString = function (blocks) {
	return A2(
		$elm$core$Result$map,
		$elm$core$String$join('\n'),
		$author$project$Page$Markdown$unwrapAndFilterChildNodes(
			A2($elm$core$List$map, $author$project$Page$Markdown$markdownBlockToString, blocks)));
};
var $author$project$Page$Markdown$listMarkdownToString = F2(
	function (listBlock, listItems) {
		return A2(
			$elm$core$Result$map,
			function (children) {
				return A2(
					$elm$core$String$join,
					'\n',
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (i, z) {
								var prefix = function () {
									var _v1 = listBlock.bf;
									if (!_v1.$) {
										return listBlock.aB + ' ';
									} else {
										var startIndex = _v1.a;
										return $elm$core$String$fromInt(startIndex + i) + (listBlock.aB + ' ');
									}
								}();
								return _Utils_ap(
									prefix,
									A2(
										$author$project$Page$Markdown$indentEverythingButFirstLine,
										$elm$core$String$length(prefix),
										z));
							}),
						children));
			},
			$author$project$Page$Markdown$unwrapAndFilterChildNodes(
				A2($elm$core$List$map, $author$project$Page$Markdown$blockMarkdownChildrenToString, listItems)));
	});
var $author$project$Page$Markdown$markdownBlockToString = function (block) {
	switch (block.$) {
		case 0:
			var s = block.a;
			return $elm$core$Result$Ok(s);
		case 1:
			return $elm$core$Result$Ok('---');
		case 2:
			var i = block.b;
			var children = block.c;
			return A2(
				$elm$core$Result$map,
				function (x) {
					return A2($elm$core$String$repeat, i, '#') + (' ' + x);
				},
				$author$project$Page$Markdown$inlineMarkdownChildrenToString(children));
		case 3:
			var cb = block.a;
			var s = block.b;
			return A2($author$project$Page$Markdown$markdownCodeBlockToString, cb, s);
		case 4:
			var children = block.b;
			return A2(
				$elm$core$Result$map,
				function (x) {
					return x + '\n';
				},
				$author$project$Page$Markdown$inlineMarkdownChildrenToString(children));
		case 5:
			var children = block.a;
			return A2(
				$elm$core$Result$map,
				function (x) {
					return A2(
						$elm$core$String$join,
						'\n',
						A2(
							$elm$core$List$map,
							function (m) {
								return '> ' + m;
							},
							A2($elm$core$String$split, '\n', x)));
				},
				$author$project$Page$Markdown$blockMarkdownChildrenToString(children));
		case 6:
			var lb = block.a;
			var listItems = block.b;
			return A2($author$project$Page$Markdown$listMarkdownToString, lb, listItems);
		case 7:
			var children = block.a;
			return $author$project$Page$Markdown$inlineMarkdownChildrenToString(children);
		default:
			return $elm$core$Result$Err('Custom element are not implemented');
	}
};
var $author$project$Page$Markdown$markdownToString = $author$project$Page$Markdown$blockMarkdownChildrenToString;
var $author$project$RichText$Model$State$root = function (st) {
	var s = st;
	return s.c_;
};
var $pablohirafuji$elm_markdown$Markdown$Block$BlockQuote = function (a) {
	return {$: 5, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$Block$List = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$Block$Ordered = function (a) {
	return {$: 1, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$Block$Paragraph = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$Block$ThematicBreak = {$: 1};
var $pablohirafuji$elm_markdown$Markdown$Block$Unordered = {$: 0};
var $author$project$RichText$Internal$Definitions$attributesFromElement = function (parameters) {
	var c = parameters;
	return c.H;
};
var $author$project$RichText$Model$Element$attributes = $author$project$RichText$Internal$Definitions$attributesFromElement;
var $author$project$RichText$Model$Node$childNodes = function (node) {
	var n = node;
	return n.cp;
};
var $pablohirafuji$elm_markdown$Markdown$Block$CodeBlock = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$Block$Indented = {$: 0};
var $author$project$RichText$Model$InlineElement$element = function (parameters) {
	var c = parameters;
	return c.aC;
};
var $elm$core$Elm$JsArray$map = _JsArray_map;
var $elm$core$Array$map = F2(
	function (func, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = function (node) {
			if (!node.$) {
				var subTree = node.a;
				return $elm$core$Array$SubTree(
					A2($elm$core$Elm$JsArray$map, helper, subTree));
			} else {
				var values = node.a;
				return $elm$core$Array$Leaf(
					A2($elm$core$Elm$JsArray$map, func, values));
			}
		};
		return A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A2($elm$core$Elm$JsArray$map, helper, tree),
			A2($elm$core$Elm$JsArray$map, func, tail));
	});
var $author$project$RichText$Internal$Definitions$nameFromElement = function (parameters) {
	var c = parameters;
	return c.bM;
};
var $author$project$RichText$Model$Element$name = $author$project$RichText$Internal$Definitions$nameFromElement;
var $author$project$RichText$Model$Text$text = function (parameters) {
	var c = parameters;
	return c.as;
};
var $author$project$RichText$Model$Node$toInlineArray = function (arr) {
	var a = arr;
	return a.aU;
};
var $author$project$Page$Markdown$textFromChildNodes = function (cn) {
	if (cn.$ === 1) {
		var il = cn.a;
		return A2(
			$elm$core$String$join,
			'',
			$elm$core$Array$toList(
				A2(
					$elm$core$Array$map,
					function (l) {
						if (l.$ === 1) {
							var tl = l.a;
							return $author$project$RichText$Model$Text$text(tl);
						} else {
							var p = l.a;
							return ($author$project$RichText$Model$Element$name(
								$author$project$RichText$Model$InlineElement$element(p)) === 'hard_break') ? '\n' : '';
						}
					},
					$author$project$RichText$Model$Node$toInlineArray(il))));
	} else {
		return '';
	}
};
var $author$project$Page$Markdown$codeBlockToMarkdown = function (cn) {
	var t = $author$project$Page$Markdown$textFromChildNodes(cn);
	return $elm$core$Result$Ok(
		A2($pablohirafuji$elm_markdown$Markdown$Block$CodeBlock, $pablohirafuji$elm_markdown$Markdown$Block$Indented, t));
};
var $author$project$RichText$Model$Node$element = function (node) {
	var n = node;
	return n.aL;
};
var $author$project$RichText$Model$Attribute$findStringAttribute = F2(
	function (name, attributes) {
		findStringAttribute:
		while (true) {
			if (!attributes.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = attributes.a;
				var xs = attributes.b;
				if (!x.$) {
					var k = x.a;
					var v = x.b;
					if (_Utils_eq(k, name)) {
						return $elm$core$Maybe$Just(v);
					} else {
						var $temp$name = name,
							$temp$attributes = xs;
						name = $temp$name;
						attributes = $temp$attributes;
						continue findStringAttribute;
					}
				} else {
					var $temp$name = name,
						$temp$attributes = xs;
					name = $temp$name;
					attributes = $temp$attributes;
					continue findStringAttribute;
				}
			}
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$Heading = F3(
	function (a, b, c) {
		return {$: 2, a: a, b: b, c: c};
	});
var $author$project$RichText$Model$Attribute$findIntegerAttribute = F2(
	function (name, attributes) {
		findIntegerAttribute:
		while (true) {
			if (!attributes.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = attributes.a;
				var xs = attributes.b;
				if (x.$ === 1) {
					var k = x.a;
					var v = x.b;
					if (_Utils_eq(k, name)) {
						return $elm$core$Maybe$Just(v);
					} else {
						var $temp$name = name,
							$temp$attributes = xs;
						name = $temp$name;
						attributes = $temp$attributes;
						continue findIntegerAttribute;
					}
				} else {
					var $temp$name = name,
						$temp$attributes = xs;
					name = $temp$name;
					attributes = $temp$attributes;
					continue findIntegerAttribute;
				}
			}
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Inline$CodeInline = function (a) {
	return {$: 2, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$Inline$Emphasis = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$Inline$HardLineBreak = {$: 1};
var $pablohirafuji$elm_markdown$Markdown$Inline$Link = F3(
	function (a, b, c) {
		return {$: 3, a: a, b: b, c: c};
	});
var $pablohirafuji$elm_markdown$Markdown$Inline$Text = function (a) {
	return {$: 0, a: a};
};
var $author$project$RichText$Internal$Definitions$attributesFromMark = function (m) {
	var c = m;
	return c.H;
};
var $author$project$RichText$Model$Mark$attributes = $author$project$RichText$Internal$Definitions$attributesFromMark;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $pablohirafuji$elm_markdown$Markdown$Inline$Image = F3(
	function (a, b, c) {
		return {$: 4, a: a, b: b, c: c};
	});
var $author$project$Page$Markdown$imageToMarkdown = function (parameters) {
	var attributes = $author$project$RichText$Model$Element$attributes(parameters);
	var alt = A2($author$project$RichText$Model$Attribute$findStringAttribute, 'alt', attributes);
	var _v0 = A2($author$project$RichText$Model$Attribute$findStringAttribute, 'src', attributes);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('No src attribute found');
	} else {
		var src = _v0.a;
		return $elm$core$Result$Ok(
			A3($pablohirafuji$elm_markdown$Markdown$Inline$Image, src, alt, _List_Nil));
	}
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $author$project$Page$Markdown$inlineToMarkdown = F2(
	function (leaves, tree) {
		if (tree.$ === 1) {
			var i = tree.a;
			var _v1 = A2($elm$core$Array$get, i, leaves);
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('Invalid leaf tree');
			} else {
				var inlineLeaf = _v1.a;
				if (inlineLeaf.$ === 1) {
					var p = inlineLeaf.a;
					return $elm$core$Result$Ok(
						_List_fromArray(
							[
								$pablohirafuji$elm_markdown$Markdown$Inline$Text(
								$author$project$RichText$Model$Text$text(p))
							]));
				} else {
					var il = inlineLeaf.a;
					var parameters = $author$project$RichText$Model$InlineElement$element(il);
					var _v3 = $author$project$RichText$Model$Element$name(parameters);
					switch (_v3) {
						case 'image':
							return A2(
								$elm$core$Result$map,
								$elm$core$List$singleton,
								$author$project$Page$Markdown$imageToMarkdown(parameters));
						case 'hard_break':
							return $elm$core$Result$Ok(
								_List_fromArray(
									[$pablohirafuji$elm_markdown$Markdown$Inline$HardLineBreak]));
						default:
							var name = _v3;
							return $elm$core$Result$Err('Unsupported inline leaf :' + name);
					}
				}
			}
		} else {
			var m = tree.a;
			var _v4 = $author$project$Page$Markdown$unwrapAndFilterChildNodes(
				A2(
					$elm$core$List$map,
					$author$project$Page$Markdown$inlineToMarkdown(leaves),
					$elm$core$Array$toList(m.cq)));
			if (_v4.$ === 1) {
				var s = _v4.a;
				return $elm$core$Result$Err(s);
			} else {
				var children = _v4.a;
				var flattenedChildren = A2($elm$core$List$concatMap, $elm$core$Basics$identity, children);
				var _v5 = $author$project$RichText$Model$Mark$name(m.bK);
				switch (_v5) {
					case 'bold':
						return $elm$core$Result$Ok(
							_List_fromArray(
								[
									A2($pablohirafuji$elm_markdown$Markdown$Inline$Emphasis, 2, flattenedChildren)
								]));
					case 'italic':
						return $elm$core$Result$Ok(
							_List_fromArray(
								[
									A2($pablohirafuji$elm_markdown$Markdown$Inline$Emphasis, 1, flattenedChildren)
								]));
					case 'code':
						return $elm$core$Result$Ok(
							A2(
								$elm$core$List$map,
								function (x) {
									if (!x.$) {
										var s = x.a;
										return $pablohirafuji$elm_markdown$Markdown$Inline$CodeInline(s);
									} else {
										return x;
									}
								},
								flattenedChildren));
					case 'link':
						var attributes = $author$project$RichText$Model$Mark$attributes(m.bK);
						var title = A2($author$project$RichText$Model$Attribute$findStringAttribute, 'title', attributes);
						var _v7 = A2($author$project$RichText$Model$Attribute$findStringAttribute, 'href', attributes);
						if (_v7.$ === 1) {
							return $elm$core$Result$Err('Invalid link mark');
						} else {
							var href = _v7.a;
							return $elm$core$Result$Ok(
								_List_fromArray(
									[
										A3($pablohirafuji$elm_markdown$Markdown$Inline$Link, href, title, flattenedChildren)
									]));
						}
					default:
						var name = _v5;
						return $elm$core$Result$Err('Unsupported mark: ' + name);
				}
			}
		}
	});
var $author$project$RichText$Model$Node$toInlineTree = function (arr) {
	var a = arr;
	return a.be;
};
var $author$project$Page$Markdown$inlineChildrenToMarkdown = function (cn) {
	switch (cn.$) {
		case 1:
			var a = cn.a;
			var results = A2(
				$elm$core$List$map,
				$author$project$Page$Markdown$inlineToMarkdown(
					$author$project$RichText$Model$Node$toInlineArray(a)),
				$elm$core$Array$toList(
					$author$project$RichText$Model$Node$toInlineTree(a)));
			return A2(
				$elm$core$Result$map,
				$elm$core$List$concatMap($elm$core$Basics$identity),
				$author$project$Page$Markdown$unwrapAndFilterChildNodes(results));
		case 0:
			return $elm$core$Result$Err('Invalid child nodes, was expected inline, received block');
		default:
			return $elm$core$Result$Err('Invalid child nodes, was expected inline, received leaf');
	}
};
var $author$project$Page$Markdown$headingToMarkdown = F2(
	function (p, cn) {
		var attributes = $author$project$RichText$Model$Element$attributes(p);
		var level = A2(
			$elm$core$Maybe$withDefault,
			1,
			A2($author$project$RichText$Model$Attribute$findIntegerAttribute, 'level', attributes));
		return A2(
			$elm$core$Result$map,
			A2($pablohirafuji$elm_markdown$Markdown$Block$Heading, '', level),
			$author$project$Page$Markdown$inlineChildrenToMarkdown(cn));
	});
var $author$project$RichText$Model$Node$toBlockArray = function (arr) {
	var a = arr;
	return a;
};
var $author$project$Page$Markdown$blockChildrenToMarkdown = function (cn) {
	switch (cn.$) {
		case 0:
			var a = cn.a;
			var results = A2(
				$elm$core$List$map,
				$author$project$Page$Markdown$blockToMarkdown,
				$elm$core$Array$toList(
					$author$project$RichText$Model$Node$toBlockArray(a)));
			return $author$project$Page$Markdown$unwrapAndFilterChildNodes(results);
		case 1:
			return $elm$core$Result$Err('Invalid child nodes, received inline, expected block');
		default:
			return $elm$core$Result$Err('Invalid child nodes, received leaf, expected block');
	}
};
var $author$project$Page$Markdown$blockToMarkdown = function (node) {
	var parameters = $author$project$RichText$Model$Node$element(node);
	var children = $author$project$RichText$Model$Node$childNodes(node);
	var _v3 = $author$project$RichText$Model$Element$name(parameters);
	switch (_v3) {
		case 'paragraph':
			return A2(
				$elm$core$Result$map,
				$pablohirafuji$elm_markdown$Markdown$Block$Paragraph(''),
				$author$project$Page$Markdown$inlineChildrenToMarkdown(children));
		case 'blockquote':
			return A2(
				$elm$core$Result$map,
				$pablohirafuji$elm_markdown$Markdown$Block$BlockQuote,
				$author$project$Page$Markdown$blockChildrenToMarkdown(children));
		case 'horizontal_rule':
			return $elm$core$Result$Ok($pablohirafuji$elm_markdown$Markdown$Block$ThematicBreak);
		case 'heading':
			return A2($author$project$Page$Markdown$headingToMarkdown, parameters, children);
		case 'code_block':
			return $author$project$Page$Markdown$codeBlockToMarkdown(children);
		case 'unordered_list':
			return A3($author$project$Page$Markdown$listToMarkdown, $pablohirafuji$elm_markdown$Markdown$Block$Unordered, parameters, children);
		case 'ordered_list':
			return A3(
				$author$project$Page$Markdown$listToMarkdown,
				$pablohirafuji$elm_markdown$Markdown$Block$Ordered(1),
				parameters,
				children);
		default:
			var name = _v3;
			return $elm$core$Result$Err('Unexpected element: ' + name);
	}
};
var $author$project$Page$Markdown$listToMarkdown = F3(
	function (type_, parameters, cn) {
		var listItems = function () {
			if (!cn.$) {
				var a = cn.a;
				var children = $elm$core$Array$toList(
					$author$project$RichText$Model$Node$toBlockArray(a));
				return $author$project$Page$Markdown$unwrapAndFilterChildNodes(
					A2(
						$elm$core$List$map,
						function (x) {
							return $author$project$Page$Markdown$blockChildrenToMarkdown(
								$author$project$RichText$Model$Node$childNodes(x));
						},
						children));
			} else {
				return $elm$core$Result$Err('Invalid list items');
			}
		}();
		var defaultDelimiter = function () {
			if (!type_.$) {
				return '*';
			} else {
				return '.';
			}
		}();
		var delimiter = A2(
			$elm$core$Maybe$withDefault,
			defaultDelimiter,
			A2(
				$author$project$RichText$Model$Attribute$findStringAttribute,
				'delimiter',
				$author$project$RichText$Model$Element$attributes(parameters)));
		if (listItems.$ === 1) {
			var s = listItems.a;
			return $elm$core$Result$Err(s);
		} else {
			var lis = listItems.a;
			return $elm$core$Result$Ok(
				A2(
					$pablohirafuji$elm_markdown$Markdown$Block$List,
					{aB: delimiter, aI: 3, cL: false, bf: type_},
					lis));
		}
	});
var $author$project$Page$Markdown$rootToMarkdown = function (node) {
	var children = $author$project$RichText$Model$Node$childNodes(node);
	return $author$project$Page$Markdown$blockChildrenToMarkdown(children);
};
var $author$project$Page$Markdown$init = function (session) {
	var markdownNodes = $author$project$Page$Markdown$rootToMarkdown(
		$author$project$RichText$Model$State$root($author$project$Editor$initialState));
	var _v0 = function () {
		var _v1 = A2($elm$core$Result$andThen, $author$project$Page$Markdown$markdownToString, markdownNodes);
		if (_v1.$ === 1) {
			var e = _v1.a;
			return _Utils_Tuple2(
				'',
				$elm$core$Maybe$Just(e));
		} else {
			var m = _v1.a;
			return _Utils_Tuple2(m, $elm$core$Maybe$Nothing);
		}
	}();
	var result = _v0.a;
	var error = _v0.b;
	return _Utils_Tuple2(
		{
			a: $author$project$Page$Markdown$initializeEditor($author$project$Editor$initialState),
			K: 1,
			V: error,
			aN: session,
			Z: result
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Controls$Strikethrough = 3;
var $author$project$Controls$Underline = 4;
var $author$project$RichText$Model$Node$Leaf = {$: 2};
var $author$project$RichText$Model$Attribute$StringAttribute = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $author$project$RichText$Internal$Definitions$BlockLeafNodeType = {$: 2};
var $author$project$RichText$Config$ElementDefinition$blockLeaf = $author$project$RichText$Internal$Definitions$BlockLeafNodeType;
var $author$project$Page$SpecExtension$parseImageAttributes = function (node) {
	if (!node.$) {
		var name = node.a;
		var attributes = node.b;
		return (name === 'img') ? $elm$core$Maybe$Just(
			A2(
				$elm$core$List$filterMap,
				function (_v1) {
					var k = _v1.a;
					var v = _v1.b;
					switch (k) {
						case 'src':
							return $elm$core$Maybe$Just(
								A2($author$project$RichText$Model$Attribute$StringAttribute, 'src', v));
						case 'alt':
							return $elm$core$Maybe$Just(
								A2($author$project$RichText$Model$Attribute$StringAttribute, 'alt', v));
						case 'title':
							return $elm$core$Maybe$Just(
								A2($author$project$RichText$Model$Attribute$StringAttribute, 'title', v));
						case 'data-caption':
							return $elm$core$Maybe$Just(
								A2($author$project$RichText$Model$Attribute$StringAttribute, 'caption', v));
						default:
							return $elm$core$Maybe$Nothing;
					}
				},
				attributes)) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Page$SpecExtension$htmlNodeToImage = F2(
	function (def, node) {
		if (!node.$) {
			var name = node.a;
			var children = node.c;
			if (name === 'figure') {
				var _v1 = A2($elm$core$Array$get, 0, children);
				if (_v1.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var img = _v1.a;
					var _v2 = $author$project$Page$SpecExtension$parseImageAttributes(img);
					if (_v2.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var attr = _v2.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								A2($author$project$RichText$Model$Element$element, def, attr),
								$elm$core$Array$empty));
					}
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Page$SpecExtension$imageToHtmlNode = F2(
	function (parameters, _v0) {
		var caption = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2(
				$author$project$RichText$Model$Attribute$findStringAttribute,
				'caption',
				$author$project$RichText$Model$Element$attributes(parameters)));
		var attributes = A2(
			$elm$core$List$filterMap,
			$elm$core$Basics$identity,
			_List_fromArray(
				[
					$elm$core$Maybe$Just(
					_Utils_Tuple2(
						'src',
						A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$author$project$RichText$Model$Attribute$findStringAttribute,
								'src',
								$author$project$RichText$Model$Element$attributes(parameters))))),
					A2(
					$elm$core$Maybe$map,
					function (x) {
						return _Utils_Tuple2('alt', x);
					},
					A2(
						$author$project$RichText$Model$Attribute$findStringAttribute,
						'alt',
						$author$project$RichText$Model$Element$attributes(parameters))),
					A2(
					$elm$core$Maybe$map,
					function (x) {
						return _Utils_Tuple2('title', x);
					},
					A2(
						$author$project$RichText$Model$Attribute$findStringAttribute,
						'title',
						$author$project$RichText$Model$Element$attributes(parameters))),
					$elm$core$Maybe$Just(
					_Utils_Tuple2('data-caption', caption))
				]));
		return A3(
			$author$project$RichText$Model$HtmlNode$ElementNode,
			'figure',
			_List_fromArray(
				[
					_Utils_Tuple2('contenteditable', 'false')
				]),
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						A3($author$project$RichText$Model$HtmlNode$ElementNode, 'img', attributes, $elm$core$Array$empty),
						A3(
						$author$project$RichText$Model$HtmlNode$ElementNode,
						'figcaption',
						_List_Nil,
						$elm$core$Array$fromList(
							_List_fromArray(
								[
									A3(
									$author$project$RichText$Model$HtmlNode$ElementNode,
									'input',
									_List_fromArray(
										[
											_Utils_Tuple2('value', caption),
											_Utils_Tuple2('type', 'text'),
											_Utils_Tuple2('class', 'caption'),
											_Utils_Tuple2('placeholder', 'Add a caption...')
										]),
									$elm$core$Array$empty)
								])))
					])));
	});
var $author$project$Page$SpecExtension$captionedImage = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{ct: $author$project$RichText$Config$ElementDefinition$blockLeaf, by: $author$project$Page$SpecExtension$htmlNodeToImage, cE: 'block', bM: 'captioned_image', c0: true, cb: $author$project$Page$SpecExtension$imageToHtmlNode});
var $author$project$Page$SpecExtension$initialCaptionedImage = A2(
	$author$project$RichText$Model$Node$block,
	A2(
		$author$project$RichText$Model$Element$element,
		$author$project$Page$SpecExtension$captionedImage,
		_List_fromArray(
			[
				A2($author$project$RichText$Model$Attribute$StringAttribute, 'caption', 'The elm logo!'),
				A2($author$project$RichText$Model$Attribute$StringAttribute, 'src', 'public/logo.svg')
			])),
	$author$project$RichText$Model$Node$Leaf);
var $author$project$Page$SpecExtension$loremParagraph = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil),
	$author$project$RichText$Model$Node$inlineChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$RichText$Model$Node$plainText('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.')
				]))));
var $author$project$Page$SpecExtension$docInitNode = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$doc, _List_Nil),
	$author$project$RichText$Model$Node$blockChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[$author$project$Page$SpecExtension$loremParagraph, $author$project$Page$SpecExtension$initialCaptionedImage, $author$project$Page$SpecExtension$loremParagraph]))));
var $author$project$Page$SpecExtension$initialState = A2($author$project$RichText$Model$State$state, $author$project$Page$SpecExtension$docInitNode, $elm$core$Maybe$Nothing);
var $author$project$Page$SpecExtension$init = function (session) {
	var editor = $author$project$Editor$init($author$project$Page$SpecExtension$initialState);
	var newEditor = _Utils_update(
		editor,
		{
			bc: _List_fromArray(
				[0, 1, 3, 4])
		});
	return _Utils_Tuple2(
		{
			a: newEditor,
			m: {bl: '', ah: '', bs: $elm$core$Maybe$Nothing, b6: '', aT: false},
			aN: session
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$RichText$Model$Attribute$BoolAttribute = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $author$project$Page$SpecFromScratch$htmlToItem = F2(
	function (def, node) {
		if (!node.$) {
			var name = node.a;
			var children = node.c;
			if ((name === 'li') && ($elm$core$Array$length(children) === 2)) {
				var _v1 = A2($elm$core$Array$get, 0, children);
				if (!_v1.$) {
					var n = _v1.a;
					if (!n.$) {
						var childName = n.a;
						var attributes = n.b;
						if ((childName === 'input') && A2(
							$elm$core$List$any,
							function (_v3) {
								var k = _v3.a;
								var v = _v3.b;
								return (k === 'type') && (v === 'checkbox');
							},
							attributes)) {
							var checked = A2(
								$elm$core$List$any,
								function (_v6) {
									var k = _v6.a;
									var v = _v6.b;
									return (k === 'checked') && (v === 'checked');
								},
								attributes);
							var _v4 = A2($elm$core$Array$get, 1, children);
							if (!_v4.$) {
								var n2 = _v4.a;
								if (!n2.$) {
									var c = n2.c;
									var parameters = A2(
										$author$project$RichText$Model$Element$element,
										def,
										_List_fromArray(
											[
												A2($author$project$RichText$Model$Attribute$BoolAttribute, 'checked', checked)
											]));
									return $elm$core$Maybe$Just(
										_Utils_Tuple2(parameters, c));
								} else {
									return $elm$core$Maybe$Nothing;
								}
							} else {
								return $elm$core$Maybe$Nothing;
							}
						} else {
							return $elm$core$Maybe$Nothing;
						}
					} else {
						return $elm$core$Maybe$Nothing;
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Model$Attribute$findBoolAttribute = F2(
	function (name, attributes) {
		findBoolAttribute:
		while (true) {
			if (!attributes.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = attributes.a;
				var xs = attributes.b;
				if (x.$ === 2) {
					var k = x.a;
					var v = x.b;
					if (_Utils_eq(k, name)) {
						return $elm$core$Maybe$Just(v);
					} else {
						var $temp$name = name,
							$temp$attributes = xs;
						name = $temp$name;
						attributes = $temp$attributes;
						continue findBoolAttribute;
					}
				} else {
					var $temp$name = name,
						$temp$attributes = xs;
					name = $temp$name;
					attributes = $temp$attributes;
					continue findBoolAttribute;
				}
			}
		}
	});
var $author$project$Page$SpecFromScratch$itemToHtml = F2(
	function (params, children) {
		var attributes = $author$project$RichText$Model$Element$attributes(params);
		var checked = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2($author$project$RichText$Model$Attribute$findBoolAttribute, 'checked', attributes));
		return A3(
			$author$project$RichText$Model$HtmlNode$ElementNode,
			'li',
			_List_fromArray(
				[
					_Utils_Tuple2('class', 'todo-list-item')
				]),
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						A3(
						$author$project$RichText$Model$HtmlNode$ElementNode,
						'div',
						_List_fromArray(
							[
								_Utils_Tuple2('contenteditable', 'false')
							]),
						$elm$core$Array$fromList(
							_List_fromArray(
								[
									A3(
									$author$project$RichText$Model$HtmlNode$ElementNode,
									'div',
									checked ? _List_fromArray(
										[
											_Utils_Tuple2('class', 'checked checkbox')
										]) : _List_fromArray(
										[
											_Utils_Tuple2('class', 'not-checked checkbox')
										]),
									$elm$core$Array$empty)
								]))),
						A3(
						$author$project$RichText$Model$HtmlNode$ElementNode,
						'div',
						_List_fromArray(
							[
								_Utils_Tuple2('class', 'todo-list-item-contents')
							]),
						children)
					])));
	});
var $author$project$Page$SpecFromScratch$item = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$textBlock(
			{
				ci: _List_fromArray(
					['inline']),
				cj: _List_Nil
			}),
		by: $author$project$Page$SpecFromScratch$htmlToItem,
		cE: 'items',
		bM: 'todo_item',
		c0: false,
		cb: $author$project$Page$SpecFromScratch$itemToHtml
	});
var $author$project$Page$SpecFromScratch$initialTodoNode = function (s) {
	return A2(
		$author$project$RichText$Model$Node$block,
		A2($author$project$RichText$Model$Element$element, $author$project$Page$SpecFromScratch$item, _List_Nil),
		$author$project$RichText$Model$Node$inlineChildren(
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						$author$project$RichText$Model$Node$plainText(s)
					]))));
};
var $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement = F3(
	function (htmlTag, def, node) {
		if (!node.$) {
			var name_ = node.a;
			var children = node.c;
			return _Utils_eq(name_, htmlTag) ? $elm$core$Maybe$Just(
				_Utils_Tuple2(
					A2($author$project$RichText$Internal$Definitions$element, def, _List_Nil),
					children)) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Page$SpecFromScratch$htmlToTodoList = $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement('ul');
var $author$project$Page$SpecFromScratch$todoListToHtml = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'ul', _List_Nil, children);
	});
var $author$project$Page$SpecFromScratch$todoList = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$blockNode(
			_List_fromArray(
				['items'])),
		by: $author$project$Page$SpecFromScratch$htmlToTodoList,
		cE: 'root',
		bM: 'todo_list',
		c0: false,
		cb: $author$project$Page$SpecFromScratch$todoListToHtml
	});
var $author$project$Page$SpecFromScratch$todoInitNode = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$Page$SpecFromScratch$todoList, _List_Nil),
	$author$project$RichText$Model$Node$blockChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$Page$SpecFromScratch$initialTodoNode('Item 1'),
					$author$project$Page$SpecFromScratch$initialTodoNode('Item 2')
				]))));
var $author$project$Page$SpecFromScratch$initialState = A2($author$project$RichText$Model$State$state, $author$project$Page$SpecFromScratch$todoInitNode, $elm$core$Maybe$Nothing);
var $author$project$Page$SpecFromScratch$init = function (session) {
	return _Utils_Tuple2(
		{
			a: $author$project$RichText$Editor$init($author$project$Page$SpecFromScratch$initialState),
			aN: session
		},
		$elm$core$Platform$Cmd$none);
};
var $author$project$Page$Basic$toSession = function (model) {
	return model.aN;
};
var $author$project$Page$Examples$toSession = function (model) {
	return model.aN;
};
var $author$project$Page$Home$toSession = function (model) {
	return model.aN;
};
var $author$project$Page$Markdown$toSession = function (model) {
	return model.aN;
};
var $author$project$Page$SpecExtension$toSession = function (model) {
	return model.aN;
};
var $author$project$Page$SpecFromScratch$toSession = function (model) {
	return model.aN;
};
var $author$project$Main$toSession = function (page) {
	switch (page.$) {
		case 0:
			var session = page.a;
			return session;
		case 1:
			var session = page.a;
			return session;
		case 6:
			var home = page.a;
			return $author$project$Page$Home$toSession(home);
		case 2:
			var basic = page.a;
			return $author$project$Page$Basic$toSession(basic);
		case 5:
			var full = page.a;
			return $author$project$Page$Markdown$toSession(full);
		case 3:
			var e = page.a;
			return $author$project$Page$SpecExtension$toSession(e);
		case 4:
			var e = page.a;
			return $author$project$Page$SpecFromScratch$toSession(e);
		default:
			var examples = page.a;
			return $author$project$Page$Examples$toSession(examples);
	}
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $author$project$Main$updateWith = F4(
	function (toModel, toMsg, model, _v0) {
		var subModel = _v0.a;
		var subCmd = _v0.b;
		return _Utils_Tuple2(
			toModel(subModel),
			A2($elm$core$Platform$Cmd$map, toMsg, subCmd));
	});
var $author$project$Main$changeRouteTo = F2(
	function (maybeRoute, model) {
		var session = $author$project$Main$toSession(model);
		if (maybeRoute.$ === 1) {
			return _Utils_Tuple2(
				$author$project$Main$NotFound(session),
				$elm$core$Platform$Cmd$none);
		} else {
			switch (maybeRoute.a) {
				case 0:
					var _v1 = maybeRoute.a;
					return A4(
						$author$project$Main$updateWith,
						$author$project$Main$Basic,
						$author$project$Main$GotBasicMsg,
						model,
						$author$project$Page$Basic$init(session));
				case 1:
					var _v2 = maybeRoute.a;
					return A4(
						$author$project$Main$updateWith,
						$author$project$Main$Markdown,
						$author$project$Main$GotMarkdownMsg,
						model,
						$author$project$Page$Markdown$init(session));
				case 2:
					var _v3 = maybeRoute.a;
					return A4(
						$author$project$Main$updateWith,
						$author$project$Main$SpecExtension,
						$author$project$Main$GotSpecExtensionMsg,
						model,
						$author$project$Page$SpecExtension$init(session));
				case 3:
					var _v4 = maybeRoute.a;
					return A4(
						$author$project$Main$updateWith,
						$author$project$Main$SpecFromScratch,
						$author$project$Main$GotSpecFromScratchMsg,
						model,
						$author$project$Page$SpecFromScratch$init(session));
				case 4:
					var _v5 = maybeRoute.a;
					return A4(
						$author$project$Main$updateWith,
						$author$project$Main$Home,
						$author$project$Main$GotHomeMsg,
						model,
						$author$project$Page$Home$init(session));
				default:
					var _v6 = maybeRoute.a;
					return A4(
						$author$project$Main$updateWith,
						$author$project$Main$Examples,
						$author$project$Main$GotExamplesMsg,
						model,
						$author$project$Page$Examples$init(session));
			}
		}
	});
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {T: frag, X: params, Q: unvisited, F: value, _: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.Q;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state.F);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state.F);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.cV),
					$elm$url$Url$Parser$prepareQuery(url.bY),
					url.cD,
					$elm$core$Basics$identity)));
	});
var $author$project$Route$Basic = 0;
var $author$project$Route$Examples = 5;
var $author$project$Route$Home = 4;
var $author$project$Route$Markdown = 1;
var $author$project$Route$SpecExtension = 2;
var $author$project$Route$SpecFromScratch = 3;
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0._;
		var unvisited = _v0.Q;
		var params = _v0.X;
		var frag = _v0.T;
		var value = _v0.F;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1._;
			var unvisited = _v1.Q;
			var params = _v1.X;
			var frag = _v1.T;
			var value = _v1.F;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0._;
		var unvisited = _v0.Q;
		var params = _v0.X;
		var frag = _v0.T;
		var value = _v0.F;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$Route$parser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2($elm$url$Url$Parser$map, 4, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			5,
			$elm$url$Url$Parser$s('examples')),
			A2(
			$elm$url$Url$Parser$map,
			0,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('examples'),
				$elm$url$Url$Parser$s('basic'))),
			A2(
			$elm$url$Url$Parser$map,
			1,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('examples'),
				$elm$url$Url$Parser$s('markdown'))),
			A2(
			$elm$url$Url$Parser$map,
			2,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('examples'),
				$elm$url$Url$Parser$s('spec-extension'))),
			A2(
			$elm$url$Url$Parser$map,
			3,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('examples'),
				$elm$url$Url$Parser$s('spec-from-scratch')))
		]));
var $author$project$Route$fromUrl = function (url) {
	return A2(
		$elm$url$Url$Parser$parse,
		$author$project$Route$parser,
		_Utils_update(
			url,
			{
				cD: $elm$core$Maybe$Nothing,
				cV: A2($elm$core$Maybe$withDefault, '', url.cD)
			}));
};
var $author$project$Main$init = F3(
	function (_v0, url, navKey) {
		return A2(
			$author$project$Main$changeRouteTo,
			$author$project$Route$fromUrl(url),
			$author$project$Main$Redirect(navKey));
	});
var $author$project$Main$GotSession = function (a) {
	return {$: 8, a: a};
};
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Session$onStoreChange = _Platform_incomingPort('onStoreChange', $elm$json$Json$Decode$value);
var $author$project$Session$changes = F2(
	function (toMsg, key) {
		return $author$project$Session$onStoreChange(
			function (_v0) {
				return toMsg(key);
			});
	});
var $elm$core$Platform$Sub$map = _Platform_map;
var $author$project$Session$navKey = function (session) {
	var key = session;
	return key;
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Page$Basic$GotSession = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Basic$subscriptions = function (model) {
	return A2(
		$author$project$Session$changes,
		$author$project$Page$Basic$GotSession,
		$author$project$Session$navKey(model.aN));
};
var $author$project$Page$Examples$GotSession = $elm$core$Basics$identity;
var $author$project$Page$Examples$subscriptions = function (model) {
	return A2(
		$author$project$Session$changes,
		$elm$core$Basics$identity,
		$author$project$Session$navKey(model.aN));
};
var $author$project$Page$Home$GotSession = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Home$subscriptions = function (model) {
	return A2(
		$author$project$Session$changes,
		$author$project$Page$Home$GotSession,
		$author$project$Session$navKey(model.aN));
};
var $author$project$Page$Markdown$GotSession = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$Markdown$subscriptions = function (model) {
	return A2(
		$author$project$Session$changes,
		$author$project$Page$Markdown$GotSession,
		$author$project$Session$navKey(model.aN));
};
var $author$project$Page$SpecExtension$GotSession = function (a) {
	return {$: 6, a: a};
};
var $author$project$Page$SpecExtension$subscriptions = function (model) {
	return A2(
		$author$project$Session$changes,
		$author$project$Page$SpecExtension$GotSession,
		$author$project$Session$navKey(model.aN));
};
var $author$project$Page$SpecFromScratch$GotSession = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$SpecFromScratch$subscriptions = function (model) {
	return A2(
		$author$project$Session$changes,
		$author$project$Page$SpecFromScratch$GotSession,
		$author$project$Session$navKey(model.aN));
};
var $author$project$Main$subscriptions = function (model) {
	switch (model.$) {
		case 1:
			return $elm$core$Platform$Sub$none;
		case 0:
			return A2(
				$author$project$Session$changes,
				$author$project$Main$GotSession,
				$author$project$Session$navKey(
					$author$project$Main$toSession(model)));
		case 6:
			var m = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GotHomeMsg,
				$author$project$Page$Home$subscriptions(m));
		case 2:
			var m = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GotBasicMsg,
				$author$project$Page$Basic$subscriptions(m));
		case 5:
			var m = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GotMarkdownMsg,
				$author$project$Page$Markdown$subscriptions(m));
		case 7:
			var m = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GotExamplesMsg,
				$author$project$Page$Examples$subscriptions(m));
		case 3:
			var m = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GotSpecExtensionMsg,
				$author$project$Page$SpecExtension$subscriptions(m));
		default:
			var m = model.a;
			return A2(
				$elm$core$Platform$Sub$map,
				$author$project$Main$GotSpecFromScratchMsg,
				$author$project$Page$SpecFromScratch$subscriptions(m));
	}
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.bX;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.cD,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.bY,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.bQ,
					_Utils_ap(http, url.bC)),
				url.cV)));
};
var $author$project$Controls$InternalMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$RichText$Model$Mark$Flip = 2;
var $author$project$RichText$Definitions$boldToHtmlNode = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'b', _List_Nil, children);
	});
var $author$project$RichText$Definitions$htmlNodeToBold = $author$project$RichText$Config$MarkDefinition$defaultHtmlToMark('b');
var $author$project$RichText$Definitions$bold = $author$project$RichText$Config$MarkDefinition$markDefinition(
	{by: $author$project$RichText$Definitions$htmlNodeToBold, bM: 'bold', cb: $author$project$RichText$Definitions$boldToHtmlNode});
var $author$project$RichText$Config$Command$CommandMap = $elm$core$Basics$identity;
var $author$project$RichText$Config$Command$compose = F3(
	function (k, commandList, d) {
		var _v0 = A2($elm$core$Dict$get, k, d);
		if (_v0.$ === 1) {
			return A3($elm$core$Dict$insert, k, commandList, d);
		} else {
			var v = _v0.a;
			return A3(
				$elm$core$Dict$insert,
				k,
				_Utils_ap(commandList, v),
				d);
		}
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $author$project$RichText$Config$Command$combine = F2(
	function (m1, m2) {
		var map1 = m1;
		var map2 = m2;
		return {
			I: function (e) {
				return _Utils_ap(
					map1.I(e),
					map2.I(e));
			},
			J: function (e) {
				return _Utils_ap(
					map1.J(e),
					map2.J(e));
			},
			M: A3($elm$core$Dict$foldl, $author$project$RichText$Config$Command$compose, map2.M, map1.M),
			x: A3($elm$core$Dict$foldl, $author$project$RichText$Config$Command$compose, map2.x, map1.x)
		};
	});
var $author$project$RichText$Config$Command$Redo = 1;
var $author$project$RichText$Config$Command$Undo = 0;
var $author$project$RichText$Config$Keys$alt = 'Alt';
var $author$project$RichText$Config$Keys$backspace = 'Backspace';
var $author$project$RichText$Node$BlockFragment = function (a) {
	return {$: 0, a: a};
};
var $author$project$RichText$Model$Selection$anchorNode = function (selection) {
	var c = selection;
	return c.R;
};
var $author$project$RichText$Model$Selection$anchorOffset = function (selection) {
	var c = selection;
	return c.B;
};
var $author$project$RichText$Node$Block = function (a) {
	return {$: 0, a: a};
};
var $author$project$RichText$Node$Inline = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Model$Node$InlineElement = function (a) {
	return {$: 0, a: a};
};
var $author$project$RichText$Model$Text$annotations = function (parameters) {
	var c = parameters;
	return c.ax;
};
var $author$project$RichText$Internal$Definitions$annotationsFromElement = function (parameters) {
	var c = parameters;
	return c.ax;
};
var $author$project$RichText$Model$Element$annotations = $author$project$RichText$Internal$Definitions$annotationsFromElement;
var $author$project$RichText$Internal$Definitions$elementWithAnnotations = F2(
	function (annotations, parameters) {
		var c = parameters;
		return _Utils_update(
			c,
			{ax: annotations});
	});
var $author$project$RichText$Model$Element$withAnnotations = $author$project$RichText$Internal$Definitions$elementWithAnnotations;
var $author$project$RichText$Annotation$toggleElementParameters = F3(
	function (func, annotation, parameters) {
		var annotations = $author$project$RichText$Model$Element$annotations(parameters);
		return A2(
			$author$project$RichText$Model$Element$withAnnotations,
			A2(func, annotation, annotations),
			parameters);
	});
var $author$project$RichText$Model$Text$withAnnotations = F2(
	function (ann, parameters) {
		var c = parameters;
		return _Utils_update(
			c,
			{ax: ann});
	});
var $author$project$RichText$Model$InlineElement$InlineElement = $elm$core$Basics$identity;
var $author$project$RichText$Model$InlineElement$withElement = F2(
	function (eparams, iparams) {
		var c = iparams;
		return _Utils_update(
			c,
			{aC: eparams});
	});
var $author$project$RichText$Model$Node$withElement = F2(
	function (parameters, node) {
		var c = node;
		return _Utils_update(
			c,
			{aL: parameters});
	});
var $author$project$RichText$Annotation$toggle = F3(
	function (func, annotation, node) {
		if (!node.$) {
			var bn = node.a;
			var newParameters = A3(
				$author$project$RichText$Annotation$toggleElementParameters,
				func,
				annotation,
				$author$project$RichText$Model$Node$element(bn));
			var newBlockNode = A2($author$project$RichText$Model$Node$withElement, newParameters, bn);
			return $author$project$RichText$Node$Block(newBlockNode);
		} else {
			var il = node.a;
			return $author$project$RichText$Node$Inline(
				function () {
					if (!il.$) {
						var l = il.a;
						var newParameters = A3(
							$author$project$RichText$Annotation$toggleElementParameters,
							func,
							annotation,
							$author$project$RichText$Model$InlineElement$element(l));
						return $author$project$RichText$Model$Node$InlineElement(
							A2($author$project$RichText$Model$InlineElement$withElement, newParameters, l));
					} else {
						var tl = il.a;
						return $author$project$RichText$Model$Node$Text(
							A2(
								$author$project$RichText$Model$Text$withAnnotations,
								A2(
									func,
									annotation,
									$author$project$RichText$Model$Text$annotations(tl)),
								tl));
					}
				}());
		}
	});
var $author$project$RichText$Annotation$add = $author$project$RichText$Annotation$toggle($elm$core$Set$insert);
var $author$project$RichText$Node$nodeAt = F2(
	function (path, node) {
		nodeAt:
		while (true) {
			if (!path.b) {
				return $elm$core$Maybe$Just(
					$author$project$RichText$Node$Block(node));
			} else {
				var x = path.a;
				var xs = path.b;
				var _v1 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v1.$) {
					case 0:
						var arr = _v1.a;
						var _v2 = A2(
							$elm$core$Array$get,
							x,
							$author$project$RichText$Model$Node$toBlockArray(arr));
						if (_v2.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var childNode = _v2.a;
							var $temp$path = xs,
								$temp$node = childNode;
							path = $temp$path;
							node = $temp$node;
							continue nodeAt;
						}
					case 1:
						var a = _v1.a;
						var _v3 = A2(
							$elm$core$Array$get,
							x,
							$author$project$RichText$Model$Node$toInlineArray(a));
						if (_v3.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var childLeafNode = _v3.a;
							return $elm$core$List$isEmpty(xs) ? $elm$core$Maybe$Just(
								$author$project$RichText$Node$Inline(childLeafNode)) : $elm$core$Maybe$Nothing;
						}
					default:
						return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $author$project$RichText$Node$InlineFragment = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.j)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.j, tail);
		return (notAppended < 0) ? {
			k: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.k),
			i: builder.i + 1,
			j: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			k: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.k),
			i: builder.i + 1,
			j: $elm$core$Elm$JsArray$empty
		} : {k: builder.k, i: builder.i, j: appended});
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!value.$) {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (!node.$) {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		k: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		i: (len / $elm$core$Array$branchFactor) | 0,
		j: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (!node.$) {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (!_v0.$) {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (!node.$) {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						k: _List_Nil,
						i: 0,
						j: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (!_v0.$) {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (!_v0.$) {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (!_v0.$) {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $elmcraft$core_extra$Array$Extra$sliceFrom = F2(
	function (lengthDropped, array) {
		return A3(
			$elm$core$Array$slice,
			lengthDropped,
			$elm$core$Array$length(array),
			array);
	});
var $elmcraft$core_extra$Array$Extra$sliceUntil = F2(
	function (exclusiveEndIndex, array) {
		return A3($elm$core$Array$slice, 0, exclusiveEndIndex, array);
	});
var $author$project$RichText$Model$Node$withChildNodes = F2(
	function (cn, node) {
		var n = node;
		return _Utils_update(
			n,
			{cp: cn});
	});
var $author$project$RichText$Node$replaceWithFragment = F3(
	function (path, fragment, root) {
		if (!path.b) {
			return $elm$core$Result$Err('Invalid path');
		} else {
			if (!path.b.b) {
				var x = path.a;
				var _v1 = $author$project$RichText$Model$Node$childNodes(root);
				switch (_v1.$) {
					case 0:
						var a = _v1.a;
						if (!fragment.$) {
							var blocks = fragment.a;
							var arr = $author$project$RichText$Model$Node$toBlockArray(a);
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$Node$withChildNodes,
									$author$project$RichText$Model$Node$blockChildren(
										A2(
											$elm$core$Array$append,
											A2(
												$elm$core$Array$append,
												A2($elmcraft$core_extra$Array$Extra$sliceUntil, x, arr),
												blocks),
											A2($elmcraft$core_extra$Array$Extra$sliceFrom, x + 1, arr))),
									root));
						} else {
							return $elm$core$Result$Err('I cannot replace a block fragment with an inline leaf fragment');
						}
					case 1:
						var a = _v1.a;
						if (fragment.$ === 1) {
							var leaves = fragment.a;
							var arr = $author$project$RichText$Model$Node$toInlineArray(a);
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$Node$withChildNodes,
									$author$project$RichText$Model$Node$inlineChildren(
										A2(
											$elm$core$Array$append,
											A2(
												$elm$core$Array$append,
												A2($elmcraft$core_extra$Array$Extra$sliceUntil, x, arr),
												leaves),
											A2($elmcraft$core_extra$Array$Extra$sliceFrom, x + 1, arr))),
									root));
						} else {
							return $elm$core$Result$Err('I cannot replace an inline fragment with a block fragment');
						}
					default:
						return $elm$core$Result$Err('Not implemented');
				}
			} else {
				var x = path.a;
				var xs = path.b;
				var _v4 = $author$project$RichText$Model$Node$childNodes(root);
				switch (_v4.$) {
					case 0:
						var a = _v4.a;
						var arr = $author$project$RichText$Model$Node$toBlockArray(a);
						var _v5 = A2($elm$core$Array$get, x, arr);
						if (_v5.$ === 1) {
							return $elm$core$Result$Err('I received an invalid path, I can\'t find a block node at the given index.');
						} else {
							var node = _v5.a;
							var _v6 = A3($author$project$RichText$Node$replaceWithFragment, xs, fragment, node);
							if (!_v6.$) {
								var n = _v6.a;
								return $elm$core$Result$Ok(
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A3($elm$core$Array$set, x, n, arr)),
										root));
							} else {
								var v = _v6.a;
								return $elm$core$Result$Err(v);
							}
						}
					case 1:
						return $elm$core$Result$Err('I received an invalid path, I reached an inline leaf array but I still have more path left.');
					default:
						return $elm$core$Result$Err('I received an invalid path, I am on a leaf node, but I still have more path left.');
				}
			}
		}
	});
var $author$project$RichText$Node$replace = F3(
	function (path, node, root) {
		if (!path.b) {
			if (!node.$) {
				var n = node.a;
				return $elm$core$Result$Ok(n);
			} else {
				return $elm$core$Result$Err('I cannot replace a block node with an inline leaf.');
			}
		} else {
			var fragment = function () {
				if (!node.$) {
					var n = node.a;
					return $author$project$RichText$Node$BlockFragment(
						$elm$core$Array$fromList(
							_List_fromArray(
								[n])));
				} else {
					var n = node.a;
					return $author$project$RichText$Node$InlineFragment(
						$elm$core$Array$fromList(
							_List_fromArray(
								[n])));
				}
			}();
			return A3($author$project$RichText$Node$replaceWithFragment, path, fragment, root);
		}
	});
var $author$project$RichText$Annotation$addAtPath = F3(
	function (annotation, path, node) {
		var _v0 = A2($author$project$RichText$Node$nodeAt, path, node);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('No block found at path');
		} else {
			var n = _v0.a;
			return A3(
				$author$project$RichText$Node$replace,
				path,
				A2($author$project$RichText$Annotation$add, annotation, n),
				node);
		}
	});
var $author$project$RichText$Internal$Constants$selection = '__selection__';
var $author$project$RichText$Annotation$selection = $author$project$RichText$Internal$Constants$selection;
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$RichText$Annotation$addSelectionAnnotationAtPath = F2(
	function (nodePath, node) {
		return A2(
			$elm$core$Result$withDefault,
			node,
			A3($author$project$RichText$Annotation$addAtPath, $author$project$RichText$Annotation$selection, nodePath, node));
	});
var $author$project$RichText$Model$Selection$focusNode = function (selection) {
	var c = selection;
	return c.S;
};
var $author$project$RichText$Annotation$annotateSelection = F2(
	function (selection_, node) {
		return A2(
			$author$project$RichText$Annotation$addSelectionAnnotationAtPath,
			$author$project$RichText$Model$Selection$focusNode(selection_),
			A2(
				$author$project$RichText$Annotation$addSelectionAnnotationAtPath,
				$author$project$RichText$Model$Selection$anchorNode(selection_),
				node));
	});
var $author$project$RichText$Node$map = F2(
	function (func, node) {
		var applied = func(node);
		if (!applied.$) {
			var blockNode = applied.a;
			return $author$project$RichText$Node$Block(
				A2(
					$author$project$RichText$Model$Node$withChildNodes,
					function () {
						var _v1 = $author$project$RichText$Model$Node$childNodes(blockNode);
						switch (_v1.$) {
							case 0:
								var a = _v1.a;
								return $author$project$RichText$Model$Node$blockChildren(
									A2(
										$elm$core$Array$map,
										function (v) {
											var _v2 = A2(
												$author$project$RichText$Node$map,
												func,
												$author$project$RichText$Node$Block(v));
											if (!_v2.$) {
												var b = _v2.a;
												return b;
											} else {
												return v;
											}
										},
										$author$project$RichText$Model$Node$toBlockArray(a)));
							case 1:
								var a = _v1.a;
								return $author$project$RichText$Model$Node$inlineChildren(
									A2(
										$elm$core$Array$map,
										function (v) {
											var _v3 = A2(
												$author$project$RichText$Node$map,
												func,
												$author$project$RichText$Node$Inline(v));
											if (_v3.$ === 1) {
												var b = _v3.a;
												return b;
											} else {
												return v;
											}
										},
										$author$project$RichText$Model$Node$toInlineArray(a)));
							default:
								return $author$project$RichText$Model$Node$Leaf;
						}
					}(),
					blockNode));
		} else {
			var inlineLeaf = applied.a;
			return $author$project$RichText$Node$Inline(inlineLeaf);
		}
	});
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $author$project$RichText$Annotation$remove = $author$project$RichText$Annotation$toggle($elm$core$Set$remove);
var $author$project$RichText$Annotation$clear = F2(
	function (annotation, root) {
		var _v0 = A2(
			$author$project$RichText$Node$map,
			$author$project$RichText$Annotation$remove(annotation),
			$author$project$RichText$Node$Block(root));
		if (!_v0.$) {
			var bn = _v0.a;
			return bn;
		} else {
			return root;
		}
	});
var $author$project$RichText$Annotation$clearSelectionAnnotations = $author$project$RichText$Annotation$clear($author$project$RichText$Annotation$selection);
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$RichText$Model$Node$parent = function (path) {
	return A2(
		$elm$core$List$take,
		$elm$core$List$length(path) - 1,
		path);
};
var $author$project$RichText$Node$findClosestBlockPath = F2(
	function (path, node) {
		var _v0 = A2($author$project$RichText$Node$nodeAt, path, node);
		if (_v0.$ === 1) {
			return _List_Nil;
		} else {
			var n = _v0.a;
			if (!n.$) {
				return path;
			} else {
				return $author$project$RichText$Model$Node$parent(path);
			}
		}
	});
var $author$project$RichText$Model$Selection$focusOffset = function (selection) {
	var c = selection;
	return c.C;
};
var $elm$core$Basics$not = _Basics_not;
var $author$project$RichText$Node$last = function (node) {
	var _v0 = $author$project$RichText$Model$Node$childNodes(node);
	switch (_v0.$) {
		case 0:
			var a = _v0.a;
			var arr = $author$project$RichText$Model$Node$toBlockArray(a);
			var lastIndex = $elm$core$Array$length(arr) - 1;
			var _v1 = A2($elm$core$Array$get, lastIndex, arr);
			if (_v1.$ === 1) {
				return _Utils_Tuple2(
					_List_Nil,
					$author$project$RichText$Node$Block(node));
			} else {
				var b = _v1.a;
				var _v2 = $author$project$RichText$Node$last(b);
				var p = _v2.a;
				var n = _v2.b;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, lastIndex, p),
					n);
			}
		case 1:
			var a = _v0.a;
			var array = $author$project$RichText$Model$Node$toInlineArray(a);
			var lastIndex = $elm$core$Array$length(array) - 1;
			var _v3 = A2($elm$core$Array$get, lastIndex, array);
			if (_v3.$ === 1) {
				return _Utils_Tuple2(
					_List_Nil,
					$author$project$RichText$Node$Block(node));
			} else {
				var l = _v3.a;
				return _Utils_Tuple2(
					_List_fromArray(
						[lastIndex]),
					$author$project$RichText$Node$Inline(l));
			}
		default:
			return _Utils_Tuple2(
				_List_Nil,
				$author$project$RichText$Node$Block(node));
	}
};
var $author$project$RichText$Node$previous = F2(
	function (path, node) {
		if (!path.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!path.b.b) {
				var x = path.a;
				var prevIndex = x - 1;
				var _v1 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v1.$) {
					case 0:
						var a = _v1.a;
						var _v2 = A2(
							$elm$core$Array$get,
							prevIndex,
							$author$project$RichText$Model$Node$toBlockArray(a));
						if (_v2.$ === 1) {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									_List_Nil,
									$author$project$RichText$Node$Block(node)));
						} else {
							var b = _v2.a;
							var _v3 = $author$project$RichText$Node$last(b);
							var p = _v3.a;
							var n = _v3.b;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									A2($elm$core$List$cons, prevIndex, p),
									n));
						}
					case 1:
						var a = _v1.a;
						var _v4 = A2(
							$elm$core$Array$get,
							prevIndex,
							$author$project$RichText$Model$Node$toInlineArray(a));
						if (_v4.$ === 1) {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									_List_Nil,
									$author$project$RichText$Node$Block(node)));
						} else {
							var l = _v4.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									_List_fromArray(
										[prevIndex]),
									$author$project$RichText$Node$Inline(l)));
						}
					default:
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								_List_Nil,
								$author$project$RichText$Node$Block(node)));
				}
			} else {
				var x = path.a;
				var xs = path.b;
				var _v5 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v5.$) {
					case 0:
						var a = _v5.a;
						var _v6 = A2(
							$elm$core$Array$get,
							x,
							$author$project$RichText$Model$Node$toBlockArray(a));
						if (_v6.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var b = _v6.a;
							var _v7 = A2($author$project$RichText$Node$previous, xs, b);
							if (_v7.$ === 1) {
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										_List_fromArray(
											[x]),
										$author$project$RichText$Node$Block(b)));
							} else {
								var _v8 = _v7.a;
								var p = _v8.a;
								var n = _v8.b;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										A2($elm$core$List$cons, x, p),
										n));
							}
						}
					case 1:
						var a = _v5.a;
						var _v9 = A2(
							$elm$core$Array$get,
							x - 1,
							$author$project$RichText$Model$Node$toInlineArray(a));
						if (_v9.$ === 1) {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									_List_Nil,
									$author$project$RichText$Node$Block(node)));
						} else {
							var l = _v9.a;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									_List_fromArray(
										[x - 1]),
									$author$project$RichText$Node$Inline(l)));
						}
					default:
						return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $author$project$RichText$Model$State$selection = function (st) {
	var s = st;
	return s.b2;
};
var $author$project$RichText$Annotation$fromNode = function (node) {
	if (!node.$) {
		var blockNode = node.a;
		return $author$project$RichText$Model$Element$annotations(
			$author$project$RichText$Model$Node$element(blockNode));
	} else {
		var inlineLeaf = node.a;
		if (!inlineLeaf.$) {
			var p = inlineLeaf.a;
			return $author$project$RichText$Model$Element$annotations(
				$author$project$RichText$Model$InlineElement$element(p));
		} else {
			var p = inlineLeaf.a;
			return $author$project$RichText$Model$Text$annotations(p);
		}
	}
};
var $elm$core$Array$foldl = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldl, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldl,
			func,
			A3($elm$core$Elm$JsArray$foldl, helper, baseCase, tree),
			tail);
	});
var $elm$core$Elm$JsArray$indexedMap = _JsArray_indexedMap;
var $elm$core$Array$indexedMap = F2(
	function (func, _v0) {
		var len = _v0.a;
		var tree = _v0.c;
		var tail = _v0.d;
		var initialBuilder = {
			k: _List_Nil,
			i: 0,
			j: A3(
				$elm$core$Elm$JsArray$indexedMap,
				func,
				$elm$core$Array$tailIndex(len),
				tail)
		};
		var helper = F2(
			function (node, builder) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldl, helper, builder, subTree);
				} else {
					var leaf = node.a;
					var offset = builder.i * $elm$core$Array$branchFactor;
					var mappedLeaf = $elm$core$Array$Leaf(
						A3($elm$core$Elm$JsArray$indexedMap, func, offset, leaf));
					return {
						k: A2($elm$core$List$cons, mappedLeaf, builder.k),
						i: builder.i + 1,
						j: builder.j
					};
				}
			});
		return A2(
			$elm$core$Array$builderToArray,
			true,
			A3($elm$core$Elm$JsArray$foldl, helper, initialBuilder, tree));
	});
var $author$project$RichText$Node$indexedFoldlRec = F4(
	function (path, func, acc, node) {
		if (!node.$) {
			var blockNode = node.a;
			var children = A2(
				$elm$core$Array$indexedMap,
				$elm$core$Tuple$pair,
				function () {
					var _v2 = $author$project$RichText$Model$Node$childNodes(blockNode);
					switch (_v2.$) {
						case 2:
							return $elm$core$Array$empty;
						case 1:
							var a = _v2.a;
							return A2(
								$elm$core$Array$map,
								$author$project$RichText$Node$Inline,
								$author$project$RichText$Model$Node$toInlineArray(a));
						default:
							var a = _v2.a;
							return A2(
								$elm$core$Array$map,
								$author$project$RichText$Node$Block,
								$author$project$RichText$Model$Node$toBlockArray(a));
					}
				}());
			return A3(
				$elm$core$Array$foldl,
				F2(
					function (_v1, agg) {
						var index = _v1.a;
						var childNode = _v1.b;
						return A4(
							$author$project$RichText$Node$indexedFoldlRec,
							_Utils_ap(
								path,
								_List_fromArray(
									[index])),
							func,
							agg,
							childNode);
					}),
				A3(func, path, node, acc),
				children);
		} else {
			return A3(func, path, node, acc);
		}
	});
var $author$project$RichText$Node$indexedFoldl = $author$project$RichText$Node$indexedFoldlRec(_List_Nil);
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$RichText$Annotation$findPathsWithAnnotation = F2(
	function (annotation, node) {
		return A3(
			$author$project$RichText$Node$indexedFoldl,
			F3(
				function (path, n, agg) {
					return A2(
						$elm$core$Set$member,
						annotation,
						$author$project$RichText$Annotation$fromNode(n)) ? A2($elm$core$List$cons, path, agg) : agg;
				}),
			_List_Nil,
			$author$project$RichText$Node$Block(node));
	});
var $author$project$RichText$Annotation$findNodeRangeFromSelectionAnnotations = function (node) {
	var paths = A2($author$project$RichText$Annotation$findPathsWithAnnotation, $author$project$RichText$Annotation$selection, node);
	if (!paths.b) {
		return $elm$core$Maybe$Nothing;
	} else {
		if (!paths.b.b) {
			var x = paths.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(x, x));
		} else {
			var end = paths.a;
			var _v1 = paths.b;
			var start = _v1.a;
			return $elm$core$Maybe$Just(
				_Utils_Tuple2(start, end));
		}
	}
};
var $author$project$RichText$Model$Selection$Selection = $elm$core$Basics$identity;
var $author$project$RichText$Model$Selection$range = F4(
	function (aNode, aOffset, fNode, fOffset) {
		return {R: aNode, B: aOffset, S: fNode, C: fOffset};
	});
var $author$project$RichText$Annotation$selectionFromAnnotations = F3(
	function (node, anchorOffset, focusOffset) {
		var _v0 = $author$project$RichText$Annotation$findNodeRangeFromSelectionAnnotations(node);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = _v0.a;
			var start = _v1.a;
			var end = _v1.b;
			return $elm$core$Maybe$Just(
				A4($author$project$RichText$Model$Selection$range, start, anchorOffset, end, focusOffset));
		}
	});
var $author$project$RichText$Node$findAncestor = F3(
	function (pred, path, node) {
		if (!path.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = path.a;
			var xs = path.b;
			var _v1 = $author$project$RichText$Model$Node$childNodes(node);
			if (!_v1.$) {
				var a = _v1.a;
				var _v2 = A2(
					$elm$core$Array$get,
					x,
					$author$project$RichText$Model$Node$toBlockArray(a));
				if (_v2.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var childNode = _v2.a;
					var _v3 = A3($author$project$RichText$Node$findAncestor, pred, xs, childNode);
					if (_v3.$ === 1) {
						return pred(node) ? $elm$core$Maybe$Just(
							_Utils_Tuple2(_List_Nil, node)) : $elm$core$Maybe$Nothing;
					} else {
						var _v4 = _v3.a;
						var p = _v4.a;
						var result = _v4.b;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								A2($elm$core$List$cons, x, p),
								result));
					}
				}
			} else {
				return pred(node) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(_List_Nil, node)) : $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RichText$Node$findTextBlockNodeAncestor = $author$project$RichText$Node$findAncestor(
	function (n) {
		var _v0 = $author$project$RichText$Model$Node$childNodes(n);
		if (_v0.$ === 1) {
			return true;
		} else {
			return false;
		}
	});
var $author$project$RichText$Model$Selection$isCollapsed = function (selection) {
	var c = selection;
	return _Utils_eq(c.B, c.C) && _Utils_eq(c.R, c.S);
};
var $elm$core$Array$isEmpty = function (_v0) {
	var len = _v0.a;
	return !len;
};
var $elmcraft$core_extra$List$Extra$last = function (items) {
	last:
	while (true) {
		if (!items.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!items.b.b) {
				var x = items.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = items.b;
				var $temp$items = rest;
				items = $temp$items;
				continue last;
			}
		}
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$RichText$Node$selectionIsBeginningOfTextBlock = F2(
	function (selection, root) {
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return false;
		} else {
			var _v0 = A2(
				$author$project$RichText$Node$findTextBlockNodeAncestor,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				root);
			if (_v0.$ === 1) {
				return false;
			} else {
				var _v1 = _v0.a;
				var n = _v1.b;
				var _v2 = $author$project$RichText$Model$Node$childNodes(n);
				if (_v2.$ === 1) {
					var a = _v2.a;
					var _v3 = $elmcraft$core_extra$List$Extra$last(
						$author$project$RichText$Model$Selection$anchorNode(selection));
					if (_v3.$ === 1) {
						return false;
					} else {
						var i = _v3.a;
						return ((!(!i)) || $elm$core$Array$isEmpty(
							$author$project$RichText$Model$Node$toInlineArray(a))) ? false : (!$author$project$RichText$Model$Selection$anchorOffset(selection));
					}
				} else {
					return false;
				}
			}
		}
	});
var $author$project$RichText$Model$State$withRoot = F2(
	function (node, st) {
		var s = st;
		return _Utils_update(
			s,
			{c_: node});
	});
var $author$project$RichText$Model$State$withSelection = F2(
	function (sel, st) {
		var s = st;
		return _Utils_update(
			s,
			{b2: sel});
	});
var $author$project$RichText$Commands$backspaceBlock = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!A2(
			$author$project$RichText$Node$selectionIsBeginningOfTextBlock,
			selection,
			$author$project$RichText$Model$State$root(editorState))) {
			return $elm$core$Result$Err('Cannot backspace a block element if we\'re not at the beginning of a text block');
		} else {
			var markedRoot = A2(
				$author$project$RichText$Annotation$annotateSelection,
				selection,
				$author$project$RichText$Model$State$root(editorState));
			var blockPath = A2(
				$author$project$RichText$Node$findClosestBlockPath,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			var _v1 = A2(
				$author$project$RichText$Node$previous,
				blockPath,
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('There is no previous element to backspace');
			} else {
				var _v2 = _v1.a;
				var path = _v2.a;
				var node = _v2.b;
				if (!node.$) {
					var bn = node.a;
					var _v4 = $author$project$RichText$Model$Node$childNodes(bn);
					if (_v4.$ === 2) {
						var _v5 = A3(
							$author$project$RichText$Node$replaceWithFragment,
							path,
							$author$project$RichText$Node$BlockFragment($elm$core$Array$empty),
							markedRoot);
						if (_v5.$ === 1) {
							var s = _v5.a;
							return $elm$core$Result$Err(s);
						} else {
							var newRoot = _v5.a;
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$State$withSelection,
									A3(
										$author$project$RichText$Annotation$selectionFromAnnotations,
										newRoot,
										$author$project$RichText$Model$Selection$anchorOffset(selection),
										$author$project$RichText$Model$Selection$focusOffset(selection)),
									A2(
										$author$project$RichText$Model$State$withRoot,
										$author$project$RichText$Annotation$clearSelectionAnnotations(newRoot),
										editorState)));
						}
					} else {
						return $elm$core$Result$Err('The previous element is not a block leaf');
					}
				} else {
					return $elm$core$Result$Err('The previous element is not a block node');
				}
			}
		}
	}
};
var $author$project$RichText$Model$Selection$singleNodeRange = F3(
	function (node, aOffset, fOffset) {
		return A4($author$project$RichText$Model$Selection$range, node, aOffset, node, fOffset);
	});
var $author$project$RichText$Model$Selection$caret = F2(
	function (nodePath, offset) {
		return A3($author$project$RichText$Model$Selection$singleNodeRange, nodePath, offset, offset);
	});
var $author$project$RichText$Model$Node$decrement = function (np) {
	var _v0 = $elmcraft$core_extra$List$Extra$last(np);
	if (_v0.$ === 1) {
		return _List_Nil;
	} else {
		var i = _v0.a;
		return _Utils_ap(
			A2(
				$elm$core$List$take,
				$elm$core$List$length(np) - 1,
				np),
			_List_fromArray(
				[i - 1]));
	}
};
var $author$project$RichText$Commands$backspaceInlineElement = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('I can only backspace an inline element if the selection is collapsed');
		} else {
			if (!(!$author$project$RichText$Model$Selection$anchorOffset(selection))) {
				return $elm$core$Result$Err('I can only backspace an inline element if the offset is 0');
			} else {
				var decrementedPath = $author$project$RichText$Model$Node$decrement(
					$author$project$RichText$Model$Selection$anchorNode(selection));
				var _v1 = A2(
					$author$project$RichText$Node$nodeAt,
					decrementedPath,
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('There is no previous inline element');
				} else {
					var node = _v1.a;
					if (node.$ === 1) {
						var il = node.a;
						if (!il.$) {
							var _v4 = A3(
								$author$project$RichText$Node$replaceWithFragment,
								decrementedPath,
								$author$project$RichText$Node$InlineFragment($elm$core$Array$empty),
								$author$project$RichText$Model$State$root(editorState));
							if (_v4.$ === 1) {
								var s = _v4.a;
								return $elm$core$Result$Err(s);
							} else {
								var newRoot = _v4.a;
								return $elm$core$Result$Ok(
									A2(
										$author$project$RichText$Model$State$withRoot,
										newRoot,
										A2(
											$author$project$RichText$Model$State$withSelection,
											$elm$core$Maybe$Just(
												A2($author$project$RichText$Model$Selection$caret, decrementedPath, 0)),
											editorState)));
							}
						} else {
							return $elm$core$Result$Err('There is no previous inline leaf element, found a text leaf');
						}
					} else {
						return $elm$core$Result$Err('There is no previous inline leaf element, found a block node');
					}
				}
			}
		}
	}
};
var $author$project$RichText$Node$findNodeFrom = F4(
	function (iterator, pred, path, node) {
		var _v2 = A2($author$project$RichText$Node$nodeAt, path, node);
		if (!_v2.$) {
			var n = _v2.a;
			return A2(pred, path, n) ? $elm$core$Maybe$Just(
				_Utils_Tuple2(path, n)) : A4($author$project$RichText$Node$findNodeFromExclusive, iterator, pred, path, node);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Node$findNodeFromExclusive = F4(
	function (iterator, pred, path, node) {
		var _v0 = A2(iterator, path, node);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = _v0.a;
			var nextPath = _v1.a;
			return A4($author$project$RichText$Node$findNodeFrom, iterator, pred, nextPath, node);
		}
	});
var $author$project$RichText$Node$findBackwardFromExclusive = $author$project$RichText$Node$findNodeFromExclusive($author$project$RichText$Node$previous);
var $author$project$RichText$Commands$isTextBlock = F2(
	function (_v0, node) {
		if (!node.$) {
			var bn = node.a;
			var _v2 = $author$project$RichText$Model$Node$childNodes(bn);
			if (_v2.$ === 1) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
var $author$project$RichText$Commands$findTextBlock = F3(
	function (findFunc, path, node) {
		var _v0 = A3(findFunc, $author$project$RichText$Commands$isTextBlock, path, node);
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v1 = _v0.a;
			var p = _v1.a;
			var n = _v1.b;
			if (!n.$) {
				var bn = n.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(p, bn));
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RichText$Commands$findPreviousTextBlock = $author$project$RichText$Commands$findTextBlock($author$project$RichText$Node$findBackwardFromExclusive);
var $author$project$RichText$Node$next = F2(
	function (path, node) {
		if (!path.b) {
			var _v1 = $author$project$RichText$Model$Node$childNodes(node);
			switch (_v1.$) {
				case 0:
					var a = _v1.a;
					var _v2 = A2(
						$elm$core$Array$get,
						0,
						$author$project$RichText$Model$Node$toBlockArray(a));
					if (_v2.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var b = _v2.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								_List_fromArray(
									[0]),
								$author$project$RichText$Node$Block(b)));
					}
				case 1:
					var a = _v1.a;
					var _v3 = A2(
						$elm$core$Array$get,
						0,
						$author$project$RichText$Model$Node$toInlineArray(a));
					if (_v3.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var b = _v3.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								_List_fromArray(
									[0]),
								$author$project$RichText$Node$Inline(b)));
					}
				default:
					return $elm$core$Maybe$Nothing;
			}
		} else {
			var x = path.a;
			var xs = path.b;
			var _v4 = $author$project$RichText$Model$Node$childNodes(node);
			switch (_v4.$) {
				case 0:
					var a = _v4.a;
					var arr = $author$project$RichText$Model$Node$toBlockArray(a);
					var _v5 = A2($elm$core$Array$get, x, arr);
					if (_v5.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var b = _v5.a;
						var _v6 = A2($author$project$RichText$Node$next, xs, b);
						if (_v6.$ === 1) {
							var _v7 = A2($elm$core$Array$get, x + 1, arr);
							if (_v7.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var bNext = _v7.a;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(
										_List_fromArray(
											[x + 1]),
										$author$project$RichText$Node$Block(bNext)));
							}
						} else {
							var _v8 = _v6.a;
							var p = _v8.a;
							var n = _v8.b;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									A2($elm$core$List$cons, x, p),
									n));
						}
					}
				case 1:
					var a = _v4.a;
					var _v9 = A2(
						$elm$core$Array$get,
						x + 1,
						$author$project$RichText$Model$Node$toInlineArray(a));
					if (_v9.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var b = _v9.a;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								_List_fromArray(
									[x + 1]),
								$author$project$RichText$Node$Inline(b)));
					}
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RichText$Node$findForwardFromExclusive = $author$project$RichText$Node$findNodeFromExclusive($author$project$RichText$Node$next);
var $author$project$RichText$Commands$findNextTextBlock = $author$project$RichText$Commands$findTextBlock($author$project$RichText$Node$findForwardFromExclusive);
var $author$project$RichText$Node$joinBlocks = F2(
	function (b1, b2) {
		var _v0 = $author$project$RichText$Model$Node$childNodes(b1);
		switch (_v0.$) {
			case 0:
				var a1 = _v0.a;
				var _v1 = $author$project$RichText$Model$Node$childNodes(b2);
				if (!_v1.$) {
					var a2 = _v1.a;
					return $elm$core$Maybe$Just(
						A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$blockChildren(
								A2(
									$elm$core$Array$append,
									$author$project$RichText$Model$Node$toBlockArray(a1),
									$author$project$RichText$Model$Node$toBlockArray(a2))),
							b1));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			case 1:
				var a1 = _v0.a;
				var _v2 = $author$project$RichText$Model$Node$childNodes(b2);
				if (_v2.$ === 1) {
					var a2 = _v2.a;
					return $elm$core$Maybe$Just(
						A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$inlineChildren(
								A2(
									$elm$core$Array$append,
									$author$project$RichText$Model$Node$toInlineArray(a1),
									$author$project$RichText$Model$Node$toInlineArray(a2))),
							b1));
				} else {
					return $elm$core$Maybe$Nothing;
				}
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elmcraft$core_extra$Array$Extra$splitAt = F2(
	function (index, array) {
		return (index <= 0) ? _Utils_Tuple2($elm$core$Array$empty, array) : _Utils_Tuple2(
			A2($elmcraft$core_extra$Array$Extra$sliceUntil, index, array),
			A2($elmcraft$core_extra$Array$Extra$sliceFrom, index, array));
	});
var $elmcraft$core_extra$Array$Extra$removeAt = F2(
	function (index, array) {
		if (_Utils_cmp(index, -1) < 1) {
			return array;
		} else {
			var _v0 = A2($elmcraft$core_extra$Array$Extra$splitAt, index, array);
			var beforeIndex = _v0.a;
			var startingAtIndex = _v0.b;
			var lengthStartingAtIndex = $elm$core$Array$length(startingAtIndex);
			return (!lengthStartingAtIndex) ? beforeIndex : A2(
				$elm$core$Array$append,
				beforeIndex,
				A3($elm$core$Array$slice, 1, lengthStartingAtIndex, startingAtIndex));
		}
	});
var $author$project$RichText$Node$removeNodeAndEmptyParents = F2(
	function (path, node) {
		if (!path.b) {
			return node;
		} else {
			if (!path.b.b) {
				var x = path.a;
				var _v1 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v1.$) {
					case 0:
						var a = _v1.a;
						return A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$blockChildren(
								A2(
									$elmcraft$core_extra$Array$Extra$removeAt,
									x,
									$author$project$RichText$Model$Node$toBlockArray(a))),
							node);
					case 1:
						var a = _v1.a;
						return A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$inlineChildren(
								A2(
									$elmcraft$core_extra$Array$Extra$removeAt,
									x,
									$author$project$RichText$Model$Node$toInlineArray(a))),
							node);
					default:
						return node;
				}
			} else {
				var x = path.a;
				var xs = path.b;
				var _v2 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v2.$) {
					case 0:
						var a = _v2.a;
						var arr = $author$project$RichText$Model$Node$toBlockArray(a);
						var _v3 = A2($elm$core$Array$get, x, arr);
						if (_v3.$ === 1) {
							return node;
						} else {
							var n = _v3.a;
							var newNode = A2($author$project$RichText$Node$removeNodeAndEmptyParents, xs, n);
							var _v4 = $author$project$RichText$Model$Node$childNodes(newNode);
							switch (_v4.$) {
								case 0:
									var newNodeChildren = _v4.a;
									var newChildNodes = $author$project$RichText$Model$Node$toBlockArray(newNodeChildren);
									return $elm$core$Array$isEmpty(newChildNodes) ? A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A2($elmcraft$core_extra$Array$Extra$removeAt, x, arr)),
										node) : A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A3($elm$core$Array$set, x, newNode, arr)),
										node);
								case 1:
									var newNodeChildren = _v4.a;
									var newChildNodes = $author$project$RichText$Model$Node$toInlineArray(newNodeChildren);
									return $elm$core$Array$isEmpty(newChildNodes) ? A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A2($elmcraft$core_extra$Array$Extra$removeAt, x, arr)),
										node) : A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A3($elm$core$Array$set, x, newNode, arr)),
										node);
								default:
									return A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A3($elm$core$Array$set, x, newNode, arr)),
										node);
							}
						}
					case 1:
						return node;
					default:
						return node;
				}
			}
		}
	});
var $author$project$RichText$Node$selectionIsEndOfTextBlock = F2(
	function (selection, root) {
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return false;
		} else {
			var _v0 = A2(
				$author$project$RichText$Node$findTextBlockNodeAncestor,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				root);
			if (_v0.$ === 1) {
				return false;
			} else {
				var _v1 = _v0.a;
				var n = _v1.b;
				var _v2 = $author$project$RichText$Model$Node$childNodes(n);
				if (_v2.$ === 1) {
					var a = _v2.a;
					var _v3 = $elmcraft$core_extra$List$Extra$last(
						$author$project$RichText$Model$Selection$anchorNode(selection));
					if (_v3.$ === 1) {
						return false;
					} else {
						var i = _v3.a;
						if (!_Utils_eq(
							i,
							$elm$core$Array$length(
								$author$project$RichText$Model$Node$toInlineArray(a)) - 1)) {
							return false;
						} else {
							var _v4 = A2(
								$elm$core$Array$get,
								i,
								$author$project$RichText$Model$Node$toInlineArray(a));
							if (_v4.$ === 1) {
								return false;
							} else {
								var leaf = _v4.a;
								if (leaf.$ === 1) {
									var tl = leaf.a;
									return _Utils_eq(
										$elm$core$String$length(
											$author$project$RichText$Model$Text$text(tl)),
										$author$project$RichText$Model$Selection$anchorOffset(selection));
								} else {
									return true;
								}
							}
						}
					}
				} else {
					return false;
				}
			}
		}
	});
var $author$project$RichText$Model$Node$toString = function (nodePath) {
	return A2(
		$elm$core$String$join,
		':',
		A2($elm$core$List$map, $elm$core$String$fromInt, nodePath));
};
var $author$project$RichText$Commands$joinForward = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!A2(
			$author$project$RichText$Node$selectionIsEndOfTextBlock,
			selection,
			$author$project$RichText$Model$State$root(editorState))) {
			return $elm$core$Result$Err('I can only join forward if the selection is at end of a text block');
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$findTextBlockNodeAncestor,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('The selection has no text block ancestor');
			} else {
				var _v2 = _v1.a;
				var p1 = _v2.a;
				var n1 = _v2.b;
				var _v3 = A2(
					$author$project$RichText$Commands$findNextTextBlock,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v3.$ === 1) {
					return $elm$core$Result$Err('There is no text block I can join forward with');
				} else {
					var _v4 = _v3.a;
					var p2 = _v4.a;
					var n2 = _v4.b;
					var _v5 = A2($author$project$RichText$Node$joinBlocks, n1, n2);
					if (_v5.$ === 1) {
						return $elm$core$Result$Err(
							'I could not join these two blocks at' + ($author$project$RichText$Model$Node$toString(p1) + (' ,' + $author$project$RichText$Model$Node$toString(p2))));
					} else {
						var newBlock = _v5.a;
						var removed = A2(
							$author$project$RichText$Node$removeNodeAndEmptyParents,
							p2,
							$author$project$RichText$Model$State$root(editorState));
						var _v6 = A3(
							$author$project$RichText$Node$replace,
							p1,
							$author$project$RichText$Node$Block(newBlock),
							removed);
						if (_v6.$ === 1) {
							var e = _v6.a;
							return $elm$core$Result$Err(e);
						} else {
							var b = _v6.a;
							return $elm$core$Result$Ok(
								A2($author$project$RichText$Model$State$withRoot, b, editorState));
						}
					}
				}
			}
		}
	}
};
var $author$project$RichText$Commands$joinBackward = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!A2(
			$author$project$RichText$Node$selectionIsBeginningOfTextBlock,
			selection,
			$author$project$RichText$Model$State$root(editorState))) {
			return $elm$core$Result$Err('I can only join backward if the selection is at beginning of a text block');
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$findTextBlockNodeAncestor,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('There is no text block at the selection');
			} else {
				var _v2 = _v1.a;
				var textBlockPath = _v2.a;
				var _v3 = A2(
					$author$project$RichText$Commands$findPreviousTextBlock,
					textBlockPath,
					$author$project$RichText$Model$State$root(editorState));
				if (_v3.$ === 1) {
					return $elm$core$Result$Err('There is no text block I can join backward with');
				} else {
					var _v4 = _v3.a;
					var p = _v4.a;
					var n = _v4.b;
					var _v5 = $author$project$RichText$Model$Node$childNodes(n);
					if (_v5.$ === 1) {
						var a = _v5.a;
						var array = $author$project$RichText$Model$Node$toInlineArray(a);
						var _v6 = A2(
							$elm$core$Array$get,
							$elm$core$Array$length(array) - 1,
							array);
						if (_v6.$ === 1) {
							return $elm$core$Result$Err('There must be at least one element in the inline node to join with');
						} else {
							var leaf = _v6.a;
							var newSelection = function () {
								if (leaf.$ === 1) {
									var tl = leaf.a;
									return A2(
										$author$project$RichText$Model$Selection$caret,
										_Utils_ap(
											p,
											_List_fromArray(
												[
													$elm$core$Array$length(array) - 1
												])),
										$elm$core$String$length(
											$author$project$RichText$Model$Text$text(tl)));
								} else {
									return A2(
										$author$project$RichText$Model$Selection$caret,
										_Utils_ap(
											p,
											_List_fromArray(
												[
													$elm$core$Array$length(array) - 1
												])),
										0);
								}
							}();
							return $author$project$RichText$Commands$joinForward(
								A2(
									$author$project$RichText$Model$State$withSelection,
									$elm$core$Maybe$Just(newSelection),
									editorState));
						}
					} else {
						return $elm$core$Result$Err('I can only join with text blocks');
					}
				}
			}
		}
	}
};
var $author$project$RichText$Node$findForwardFrom = $author$project$RichText$Node$findNodeFrom($author$project$RichText$Node$next);
var $author$project$RichText$Model$Node$increment = function (np) {
	var _v0 = $elmcraft$core_extra$List$Extra$last(np);
	if (_v0.$ === 1) {
		return _List_Nil;
	} else {
		var i = _v0.a;
		return _Utils_ap(
			A2(
				$elm$core$List$take,
				$elm$core$List$length(np) - 1,
				np),
			_List_fromArray(
				[i + 1]));
	}
};
var $author$project$RichText$Annotation$selectable = $author$project$RichText$Internal$Constants$selectable;
var $author$project$RichText$Annotation$isSelectable = function (node) {
	if (!node.$) {
		var bn = node.a;
		return A2(
			$elm$core$Set$member,
			$author$project$RichText$Annotation$selectable,
			$author$project$RichText$Model$Element$annotations(
				$author$project$RichText$Model$Node$element(bn)));
	} else {
		var ln = node.a;
		if (ln.$ === 1) {
			return true;
		} else {
			var l = ln.a;
			return A2(
				$elm$core$Set$member,
				$author$project$RichText$Annotation$selectable,
				$author$project$RichText$Model$Element$annotations(
					$author$project$RichText$Model$InlineElement$element(l)));
		}
	}
};
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $author$project$RichText$Model$Selection$normalize = function (selection) {
	var c = selection;
	var _v1 = A2($elm$core$Basics$compare, c.R, c.S);
	switch (_v1) {
		case 1:
			return _Utils_update(
				c,
				{
					B: A2($elm$core$Basics$min, c.C, c.B),
					C: A2($elm$core$Basics$max, c.C, c.B)
				});
		case 0:
			return c;
		default:
			return _Utils_update(
				c,
				{R: c.S, B: c.C, S: c.R, C: c.B});
	}
};
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$RichText$Node$removeInRange = F3(
	function (start, end, node) {
		var startRest = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(start));
		var startIndex = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$List$head(start));
		var endRest = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			$elm$core$List$tail(end));
		var endIndex = A2(
			$elm$core$Maybe$withDefault,
			function () {
				var _v5 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v5.$) {
					case 0:
						var a = _v5.a;
						return $elm$core$Array$length(
							$author$project$RichText$Model$Node$toBlockArray(a));
					case 1:
						var a = _v5.a;
						return $elm$core$Array$length(
							$author$project$RichText$Model$Node$toInlineArray(a));
					default:
						return 0;
				}
			}(),
			$elm$core$List$head(end));
		if (_Utils_cmp(startIndex, endIndex) > 0) {
			return node;
		} else {
			if (_Utils_eq(startIndex, endIndex)) {
				var _v0 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v0.$) {
					case 0:
						var a = _v0.a;
						var array = $author$project$RichText$Model$Node$toBlockArray(a);
						if ($elm$core$List$isEmpty(startRest) && $elm$core$List$isEmpty(endRest)) {
							return A2(
								$author$project$RichText$Model$Node$withChildNodes,
								$author$project$RichText$Model$Node$blockChildren(
									A2($elmcraft$core_extra$Array$Extra$removeAt, startIndex, array)),
								node);
						} else {
							var _v1 = A2($elm$core$Array$get, startIndex, array);
							if (_v1.$ === 1) {
								return node;
							} else {
								var b = _v1.a;
								return A2(
									$author$project$RichText$Model$Node$withChildNodes,
									$author$project$RichText$Model$Node$blockChildren(
										A3(
											$elm$core$Array$set,
											startIndex,
											A3($author$project$RichText$Node$removeInRange, startRest, endRest, b),
											array)),
									node);
							}
						}
					case 1:
						var a = _v0.a;
						return ($elm$core$List$isEmpty(startRest) && $elm$core$List$isEmpty(endRest)) ? A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$inlineChildren(
								A2(
									$elmcraft$core_extra$Array$Extra$removeAt,
									startIndex,
									$author$project$RichText$Model$Node$toInlineArray(a))),
							node) : node;
					default:
						return node;
				}
			} else {
				var _v2 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v2.$) {
					case 0:
						var a = _v2.a;
						var arr = $author$project$RichText$Model$Node$toBlockArray(a);
						var left = A2($elmcraft$core_extra$Array$Extra$sliceUntil, startIndex, arr);
						var leftRest = function () {
							if ($elm$core$List$isEmpty(startRest)) {
								return $elm$core$Array$empty;
							} else {
								var _v4 = A2($elm$core$Array$get, startIndex, arr);
								if (_v4.$ === 1) {
									return $elm$core$Array$empty;
								} else {
									var b = _v4.a;
									return $elm$core$Array$fromList(
										_List_fromArray(
											[
												A3(
												$author$project$RichText$Node$removeInRange,
												startRest,
												$author$project$RichText$Node$last(b).a,
												b)
											]));
								}
							}
						}();
						var right = A2($elmcraft$core_extra$Array$Extra$sliceFrom, endIndex + 1, arr);
						var rightRest = function () {
							if ($elm$core$List$isEmpty(endRest)) {
								return $elm$core$Array$empty;
							} else {
								var _v3 = A2($elm$core$Array$get, endIndex, arr);
								if (_v3.$ === 1) {
									return $elm$core$Array$empty;
								} else {
									var b = _v3.a;
									return $elm$core$Array$fromList(
										_List_fromArray(
											[
												A3($author$project$RichText$Node$removeInRange, _List_Nil, endRest, b)
											]));
								}
							}
						}();
						return A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$blockChildren(
								A3(
									$elm$core$List$foldr,
									$elm$core$Array$append,
									$elm$core$Array$empty,
									_List_fromArray(
										[left, leftRest, rightRest, right]))),
							node);
					case 1:
						var a = _v2.a;
						var arr = $author$project$RichText$Model$Node$toInlineArray(a);
						var left = A2(
							$elmcraft$core_extra$Array$Extra$sliceUntil,
							$elm$core$List$isEmpty(startRest) ? startIndex : (startIndex + 1),
							arr);
						var right = A2(
							$elmcraft$core_extra$Array$Extra$sliceFrom,
							$elm$core$List$isEmpty(endRest) ? (endIndex + 1) : endIndex,
							arr);
						return A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$inlineChildren(
								A2($elm$core$Array$append, left, right)),
							node);
					default:
						return node;
				}
			}
		}
	});
var $author$project$RichText$Commands$removeNodeOrTextWithRange = F4(
	function (nodePath, start, maybeEnd, root) {
		var _v0 = A2($author$project$RichText$Node$nodeAt, nodePath, root);
		if (!_v0.$) {
			var node = _v0.a;
			if (!node.$) {
				var previouslySelectablePathAndNode = A3(
					$author$project$RichText$Node$findBackwardFromExclusive,
					F2(
						function (_v2, n) {
							return $author$project$RichText$Annotation$isSelectable(n);
						}),
					nodePath,
					root);
				var newRoot = A2($author$project$RichText$Node$removeNodeAndEmptyParents, nodePath, root);
				return $elm$core$Result$Ok(
					_Utils_Tuple2(newRoot, previouslySelectablePathAndNode));
			} else {
				var leaf = node.a;
				if (!leaf.$) {
					var previouslySelectablePath = A3(
						$author$project$RichText$Node$findBackwardFromExclusive,
						F2(
							function (_v4, n) {
								return $author$project$RichText$Annotation$isSelectable(n);
							}),
						nodePath,
						root);
					var newRoot = A2($author$project$RichText$Node$removeNodeAndEmptyParents, nodePath, root);
					return $elm$core$Result$Ok(
						_Utils_Tuple2(newRoot, previouslySelectablePath));
				} else {
					var v = leaf.a;
					var textNode = function () {
						if (maybeEnd.$ === 1) {
							return $author$project$RichText$Model$Node$Text(
								A2(
									$author$project$RichText$Model$Text$withText,
									A2(
										$elm$core$String$left,
										start,
										$author$project$RichText$Model$Text$text(v)),
									v));
						} else {
							var end = maybeEnd.a;
							return $author$project$RichText$Model$Node$Text(
								A2(
									$author$project$RichText$Model$Text$withText,
									_Utils_ap(
										A2(
											$elm$core$String$left,
											start,
											$author$project$RichText$Model$Text$text(v)),
										A2(
											$elm$core$String$dropLeft,
											end,
											$author$project$RichText$Model$Text$text(v))),
									v));
						}
					}();
					return A2(
						$elm$core$Result$map,
						function (r) {
							return _Utils_Tuple2(
								r,
								$elm$core$Maybe$Just(
									_Utils_Tuple2(
										nodePath,
										$author$project$RichText$Node$Inline(textNode))));
						},
						A3(
							$author$project$RichText$Node$replace,
							nodePath,
							$author$project$RichText$Node$Inline(textNode),
							root));
				}
			}
		} else {
			return $elm$core$Result$Err(
				'There is no node at node path ' + $author$project$RichText$Model$Node$toString(nodePath));
		}
	});
var $author$project$RichText$Commands$removeRange = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if ($author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('Cannot remove contents of collapsed selection');
		} else {
			var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
			if (_Utils_eq(
				$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
				$author$project$RichText$Model$Selection$focusNode(normalizedSelection))) {
				var _v1 = A4(
					$author$project$RichText$Commands$removeNodeOrTextWithRange,
					$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
					$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
					$elm$core$Maybe$Just(
						$author$project$RichText$Model$Selection$focusOffset(normalizedSelection)),
					$author$project$RichText$Model$State$root(editorState));
				if (!_v1.$) {
					var _v2 = _v1.a;
					var newRoot = _v2.a;
					var newSelection = A2(
						$author$project$RichText$Model$Selection$caret,
						$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
						$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection));
					return $elm$core$Result$Ok(
						A2(
							$author$project$RichText$Model$State$withSelection,
							$elm$core$Maybe$Just(newSelection),
							A2($author$project$RichText$Model$State$withRoot, newRoot, editorState)));
				} else {
					var s = _v1.a;
					return $elm$core$Result$Err(s);
				}
			} else {
				var focusTextBlock = A2(
					$author$project$RichText$Node$findTextBlockNodeAncestor,
					$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
					$author$project$RichText$Model$State$root(editorState));
				var anchorTextBlock = A2(
					$author$project$RichText$Node$findTextBlockNodeAncestor,
					$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
					$author$project$RichText$Model$State$root(editorState));
				var _v3 = A4(
					$author$project$RichText$Commands$removeNodeOrTextWithRange,
					$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
					0,
					$elm$core$Maybe$Just(
						$author$project$RichText$Model$Selection$focusOffset(normalizedSelection)),
					$author$project$RichText$Model$State$root(editorState));
				if (_v3.$ === 1) {
					var s = _v3.a;
					return $elm$core$Result$Err(s);
				} else {
					var _v4 = _v3.a;
					var removedEnd = _v4.a;
					var removedNodes = A3(
						$author$project$RichText$Node$removeInRange,
						$author$project$RichText$Model$Node$increment(
							$author$project$RichText$Model$Selection$anchorNode(normalizedSelection)),
						$author$project$RichText$Model$Node$decrement(
							$author$project$RichText$Model$Selection$focusNode(normalizedSelection)),
						removedEnd);
					var _v5 = A4(
						$author$project$RichText$Commands$removeNodeOrTextWithRange,
						$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
						$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
						$elm$core$Maybe$Nothing,
						removedNodes);
					if (_v5.$ === 1) {
						var s = _v5.a;
						return $elm$core$Result$Err(s);
					} else {
						var _v6 = _v5.a;
						var removedStart = _v6.a;
						var maybePath = _v6.b;
						var newSelection = A2(
							$elm$core$Maybe$map,
							function (_v14) {
								var p = _v14.a;
								var n = _v14.b;
								var offset = function () {
									if (n.$ === 1) {
										var i = n.a;
										if (i.$ === 1) {
											var t = i.a;
											return $elm$core$String$length(
												$author$project$RichText$Model$Text$text(t));
										} else {
											return 0;
										}
									} else {
										return 0;
									}
								}();
								return A2($author$project$RichText$Model$Selection$caret, p, offset);
							},
							maybePath);
						var defaultedSelection = function () {
							if (newSelection.$ === 1) {
								return A2(
									$elm$core$Maybe$map,
									function (_v12) {
										var p = _v12.a;
										return A2($author$project$RichText$Model$Selection$caret, p, 0);
									},
									A3(
										$author$project$RichText$Node$findForwardFrom,
										F2(
											function (_v13, n) {
												return $author$project$RichText$Annotation$isSelectable(n);
											}),
										_List_Nil,
										removedStart));
							} else {
								return newSelection;
							}
						}();
						var newEditorState = A2(
							$author$project$RichText$Model$State$withSelection,
							defaultedSelection,
							A2($author$project$RichText$Model$State$withRoot, removedStart, editorState));
						if (anchorTextBlock.$ === 1) {
							return $elm$core$Result$Ok(newEditorState);
						} else {
							var _v8 = anchorTextBlock.a;
							var ap = _v8.a;
							if (focusTextBlock.$ === 1) {
								return $elm$core$Result$Ok(newEditorState);
							} else {
								var _v10 = focusTextBlock.a;
								var fp = _v10.a;
								return _Utils_eq(ap, fp) ? $elm$core$Result$Ok(newEditorState) : $elm$core$Result$Ok(
									A2(
										$elm$core$Result$withDefault,
										newEditorState,
										$author$project$RichText$Commands$joinForward(newEditorState)));
							}
						}
					}
				}
			}
		}
	}
};
var $author$project$RichText$Commands$isLeafNode = F2(
	function (path, root) {
		var _v0 = A2($author$project$RichText$Node$nodeAt, path, root);
		if (_v0.$ === 1) {
			return false;
		} else {
			var node = _v0.a;
			if (!node.$) {
				var bn = node.a;
				var _v2 = $author$project$RichText$Model$Node$childNodes(bn);
				if (_v2.$ === 2) {
					return true;
				} else {
					return false;
				}
			} else {
				var l = node.a;
				if (!l.$) {
					return true;
				} else {
					return false;
				}
			}
		}
	});
var $author$project$RichText$Commands$removeSelectedLeafElement = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('I cannot remove a leaf element if it is not collapsed');
		} else {
			if (A2(
				$author$project$RichText$Commands$isLeafNode,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState))) {
				var newSelection = function () {
					var _v1 = A3(
						$author$project$RichText$Node$findBackwardFromExclusive,
						F2(
							function (_v2, n) {
								return $author$project$RichText$Annotation$isSelectable(n);
							}),
						$author$project$RichText$Model$Selection$anchorNode(selection),
						$author$project$RichText$Model$State$root(editorState));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var _v3 = _v1.a;
						var p = _v3.a;
						var n = _v3.b;
						var offset = function () {
							if (n.$ === 1) {
								var il = n.a;
								if (il.$ === 1) {
									var t = il.a;
									return $elm$core$String$length(
										$author$project$RichText$Model$Text$text(t));
								} else {
									return 0;
								}
							} else {
								return 0;
							}
						}();
						return $elm$core$Maybe$Just(
							A2($author$project$RichText$Model$Selection$caret, p, offset));
					}
				}();
				return $elm$core$Result$Ok(
					A2(
						$author$project$RichText$Model$State$withSelection,
						newSelection,
						A2(
							$author$project$RichText$Model$State$withRoot,
							A2(
								$author$project$RichText$Node$removeNodeAndEmptyParents,
								$author$project$RichText$Model$Selection$anchorNode(selection),
								$author$project$RichText$Model$State$root(editorState)),
							editorState)));
			} else {
				return $elm$core$Result$Err('There\'s no leaf node at the given selection');
			}
		}
	}
};
var $author$project$RichText$Commands$selectBackward = function (state) {
	var _v0 = $author$project$RichText$Model$State$selection(state);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('There is no selection to move forward');
	} else {
		var selection = _v0.a;
		var root = $author$project$RichText$Model$State$root(state);
		if (!A2(
			$author$project$RichText$Node$selectionIsBeginningOfTextBlock,
			selection,
			$author$project$RichText$Model$State$root(state))) {
			return $elm$core$Result$Err('I can only select a node backwards if this is the beginning of a text block');
		} else {
			var _v1 = A3(
				$author$project$RichText$Node$findBackwardFromExclusive,
				F2(
					function (_v2, n) {
						return $author$project$RichText$Annotation$isSelectable(n);
					}),
				$author$project$RichText$Model$Selection$anchorNode(selection),
				root);
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('I could not find a selectable node prior to the selected one');
			} else {
				var _v3 = _v1.a;
				var newAnchor = _v3.a;
				var n = _v3.b;
				var offset = function () {
					if (n.$ === 1) {
						var i = n.a;
						if (i.$ === 1) {
							var t = i.a;
							return $elm$core$String$length(
								$author$project$RichText$Model$Text$text(t));
						} else {
							return 0;
						}
					} else {
						return 0;
					}
				}();
				return $elm$core$Result$Ok(
					A2(
						$author$project$RichText$Model$State$withSelection,
						$elm$core$Maybe$Just(
							A2($author$project$RichText$Model$Selection$caret, newAnchor, offset)),
						state));
			}
		}
	}
};
var $author$project$RichText$Config$Command$TransformCommand = function (a) {
	return {$: 0, a: a};
};
var $author$project$RichText$Config$Command$transform = function (t) {
	return $author$project$RichText$Config$Command$TransformCommand(t);
};
var $author$project$RichText$Commands$backspaceCommands = _List_fromArray(
	[
		_Utils_Tuple2(
		'removeRange',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$removeRange)),
		_Utils_Tuple2(
		'removeSelectedLeafElementCommand',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$removeSelectedLeafElement)),
		_Utils_Tuple2(
		'backspaceInlineElement',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$backspaceInlineElement)),
		_Utils_Tuple2(
		'backspaceBlock',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$backspaceBlock)),
		_Utils_Tuple2(
		'joinBackward',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$joinBackward)),
		_Utils_Tuple2(
		'selectBackward',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$selectBackward))
	]);
var $author$project$RichText$Commands$backspaceText = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('I can only backspace a collapsed selection');
		} else {
			if ($author$project$RichText$Model$Selection$anchorOffset(selection) > 1) {
				return $elm$core$Result$Err('I use native behavior when doing backspace when the ' + 'anchor offset could not result in a node change');
			} else {
				var _v1 = A2(
					$author$project$RichText$Node$nodeAt,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('Invalid selection');
				} else {
					var node = _v1.a;
					if (!node.$) {
						return $elm$core$Result$Err('I cannot backspace a block node');
					} else {
						var il = node.a;
						if (!il.$) {
							return $elm$core$Result$Err('I cannot backspace text of an inline leaf');
						} else {
							var tl = il.a;
							if ($author$project$RichText$Model$Selection$anchorOffset(selection) === 1) {
								var _v4 = A3(
									$author$project$RichText$Node$replace,
									$author$project$RichText$Model$Selection$anchorNode(selection),
									$author$project$RichText$Node$Inline(
										$author$project$RichText$Model$Node$Text(
											A2(
												$author$project$RichText$Model$Text$withText,
												A2(
													$elm$core$String$dropLeft,
													1,
													$author$project$RichText$Model$Text$text(tl)),
												tl))),
									$author$project$RichText$Model$State$root(editorState));
								if (_v4.$ === 1) {
									var s = _v4.a;
									return $elm$core$Result$Err(s);
								} else {
									var newRoot = _v4.a;
									var newSelection = A2(
										$author$project$RichText$Model$Selection$caret,
										$author$project$RichText$Model$Selection$anchorNode(selection),
										0);
									return $elm$core$Result$Ok(
										A2(
											$author$project$RichText$Model$State$withSelection,
											$elm$core$Maybe$Just(newSelection),
											A2($author$project$RichText$Model$State$withRoot, newRoot, editorState)));
								}
							} else {
								var _v5 = A2(
									$author$project$RichText$Node$previous,
									$author$project$RichText$Model$Selection$anchorNode(selection),
									$author$project$RichText$Model$State$root(editorState));
								if (_v5.$ === 1) {
									return $elm$core$Result$Err('No previous node to backspace text');
								} else {
									var _v6 = _v5.a;
									var previousPath = _v6.a;
									var previousNode = _v6.b;
									if (previousNode.$ === 1) {
										var previousInlineLeafWrapper = previousNode.a;
										if (previousInlineLeafWrapper.$ === 1) {
											var previousTextLeaf = previousInlineLeafWrapper.a;
											var l = $elm$core$String$length(
												$author$project$RichText$Model$Text$text(previousTextLeaf));
											var newSelection = A3(
												$author$project$RichText$Model$Selection$singleNodeRange,
												previousPath,
												l,
												A2($elm$core$Basics$max, 0, l - 1));
											return $author$project$RichText$Commands$removeRange(
												A2(
													$author$project$RichText$Model$State$withSelection,
													$elm$core$Maybe$Just(newSelection),
													editorState));
										} else {
											return $elm$core$Result$Err('Cannot backspace if the previous node is an inline leaf');
										}
									} else {
										return $elm$core$Result$Err('Cannot backspace if the previous node is a block');
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var $author$project$RichText$Internal$DeleteWord$chameleonCharactersRegexString = '[\'‘’]';
var $author$project$RichText$Internal$DeleteWord$punctuationRegexString = '[.,+*?$|#{}()\'\\^\\-\\[\\]\\\\\\/!@%\"~=<>_:;' + ('・、。〈-】〔-〟：-？！-／' + ('［-｀｛-･⸮؟٪-٬؛،؍' + '﴾﴿᠁।၊။‐-‧‰-⁞]'));
var $author$project$RichText$Internal$DeleteWord$whitespaceAndPunctuationRegexString = '\\s|(?![_])' + $author$project$RichText$Internal$DeleteWord$punctuationRegexString;
var $author$project$RichText$Internal$DeleteWord$backspaceWordRegexString = '(?:(?!' + ($author$project$RichText$Internal$DeleteWord$whitespaceAndPunctuationRegexString + (').)' + ('(?:' + ($author$project$RichText$Internal$DeleteWord$chameleonCharactersRegexString + ('|(?!' + ($author$project$RichText$Internal$DeleteWord$whitespaceAndPunctuationRegexString + (').)*' + ('(?:' + ($author$project$RichText$Internal$DeleteWord$whitespaceAndPunctuationRegexString + (')*' + '$'))))))))));
var $elm$regex$Regex$Match = F4(
	function (match, index, number, submatches) {
		return {bF: index, cO: match, cR: number, c5: submatches};
	});
var $elm$regex$Regex$fromStringWith = _Regex_fromStringWith;
var $elm$regex$Regex$fromString = function (string) {
	return A2(
		$elm$regex$Regex$fromStringWith,
		{cm: false, cQ: false},
		string);
};
var $elm$regex$Regex$never = _Regex_never;
var $author$project$RichText$Internal$DeleteWord$backspaceWordRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString($author$project$RichText$Internal$DeleteWord$backspaceWordRegexString));
var $elm$regex$Regex$findAtMost = _Regex_findAtMost;
var $author$project$RichText$Commands$groupSameTypeInlineLeaf = F2(
	function (a, b) {
		if (!a.$) {
			if (!b.$) {
				return true;
			} else {
				return false;
			}
		} else {
			if (b.$ === 1) {
				return true;
			} else {
				return false;
			}
		}
	});
var $author$project$RichText$Commands$lengthsFromGroup = function (leaves) {
	return A2(
		$elm$core$List$map,
		function (il) {
			if (il.$ === 1) {
				var tl = il.a;
				return $elm$core$String$length(
					$author$project$RichText$Model$Text$text(tl));
			} else {
				return 0;
			}
		},
		leaves);
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$RichText$Commands$textFromGroup = function (leaves) {
	return A2(
		$elm$core$String$join,
		'',
		A2(
			$elm$core$List$map,
			function (leaf) {
				if (leaf.$ === 1) {
					var t = leaf.a;
					return $author$project$RichText$Model$Text$text(t);
				} else {
					return '';
				}
			},
			leaves));
};
var $author$project$RichText$Commands$backspaceWord = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('I cannot remove a word of a range selection');
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$findTextBlockNodeAncestor,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('I can only remove a word on a text leaf');
			} else {
				var _v2 = _v1.a;
				var p = _v2.a;
				var n = _v2.b;
				var _v3 = $author$project$RichText$Model$Node$childNodes(n);
				if (_v3.$ === 1) {
					var arr = _v3.a;
					var groupedLeaves = A2(
						$elmcraft$core_extra$List$Extra$groupWhile,
						$author$project$RichText$Commands$groupSameTypeInlineLeaf,
						$elm$core$Array$toList(
							$author$project$RichText$Model$Node$toInlineArray(arr)));
					var _v4 = $elmcraft$core_extra$List$Extra$last(
						$author$project$RichText$Model$Selection$anchorNode(selection));
					if (_v4.$ === 1) {
						return $elm$core$Result$Err('Somehow the anchor node is the root node');
					} else {
						var lastIndex = _v4.a;
						var _v5 = A3(
							$elm$core$List$foldl,
							F2(
								function (_v6, _v7) {
									var first = _v6.a;
									var rest = _v6.b;
									var i = _v7.a;
									var g = _v7.b;
									return (!$elm$core$List$isEmpty(g)) ? _Utils_Tuple2(i, g) : ((_Utils_cmp(
										$elm$core$List$length(rest) + 1,
										i) > 0) ? _Utils_Tuple2(
										i,
										A2($elm$core$List$cons, first, rest)) : _Utils_Tuple2(
										i - ($elm$core$List$length(rest) + 1),
										g));
								}),
							_Utils_Tuple2(lastIndex, _List_Nil),
							groupedLeaves);
						var relativeLastIndex = _v5.a;
						var group = _v5.b;
						var groupText = $author$project$RichText$Commands$textFromGroup(group);
						var offsetUpToNewIndex = $elm$core$List$sum(
							A2(
								$elm$core$List$take,
								relativeLastIndex,
								$author$project$RichText$Commands$lengthsFromGroup(group)));
						var offset = offsetUpToNewIndex + $author$project$RichText$Model$Selection$anchorOffset(selection);
						var stringFrom = A2($elm$core$String$left, offset, groupText);
						if ($elm$core$String$isEmpty(stringFrom)) {
							return $elm$core$Result$Err('Cannot remove word a word if the text fragment is empty');
						} else {
							var matches = A3($elm$regex$Regex$findAtMost, 1, $author$project$RichText$Internal$DeleteWord$backspaceWordRegex, stringFrom);
							var matchOffset = function () {
								var _v10 = $elm$core$List$head(matches);
								if (_v10.$ === 1) {
									return 0;
								} else {
									var match = _v10.a;
									return match.bF;
								}
							}();
							var _v8 = A3(
								$elm$core$List$foldl,
								F2(
									function (l, _v9) {
										var i = _v9.a;
										var o = _v9.b;
										var done = _v9.c;
										return done ? _Utils_Tuple3(i, o, done) : ((_Utils_cmp(l, o) < 0) ? _Utils_Tuple3(i + 1, o - l, false) : _Utils_Tuple3(i, o, true));
									}),
								_Utils_Tuple3(0, matchOffset, false),
								$author$project$RichText$Commands$lengthsFromGroup(group));
							var newGroupIndex = _v8.a;
							var newOffset = _v8.b;
							var newIndex = lastIndex - (relativeLastIndex - newGroupIndex);
							var newSelection = A4(
								$author$project$RichText$Model$Selection$range,
								_Utils_ap(
									p,
									_List_fromArray(
										[newIndex])),
								newOffset,
								$author$project$RichText$Model$Selection$anchorNode(selection),
								$author$project$RichText$Model$Selection$anchorOffset(selection));
							var newState = A2(
								$author$project$RichText$Model$State$withSelection,
								$elm$core$Maybe$Just(newSelection),
								editorState);
							return $author$project$RichText$Commands$removeRange(newState);
						}
					}
				} else {
					return $elm$core$Result$Err('I expected an inline leaf array');
				}
			}
		}
	}
};
var $author$project$RichText$Commands$insertAt = F3(
	function (insert, pos, string) {
		return _Utils_ap(
			A3($elm$core$String$slice, 0, pos, string),
			_Utils_ap(
				insert,
				A3(
					$elm$core$String$slice,
					pos,
					$elm$core$String$length(string),
					string)));
	});
var $author$project$RichText$Commands$insertText = F2(
	function (s, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return A2(
					$elm$core$Result$andThen,
					$author$project$RichText$Commands$insertText(s),
					$author$project$RichText$Commands$removeRange(editorState));
			} else {
				var _v1 = A2(
					$author$project$RichText$Node$nodeAt,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('Invalid selection after remove range');
				} else {
					var node = _v1.a;
					if (!node.$) {
						return $elm$core$Result$Err('I was expecting a text leaf, but instead I found a block node');
					} else {
						var il = node.a;
						if (!il.$) {
							return $elm$core$Result$Err('I was expecting a text leaf, but instead found an inline element');
						} else {
							var tl = il.a;
							var newText = A3(
								$author$project$RichText$Commands$insertAt,
								s,
								$author$project$RichText$Model$Selection$anchorOffset(selection),
								$author$project$RichText$Model$Text$text(tl));
							var newTextLeaf = $author$project$RichText$Model$Node$Text(
								A2($author$project$RichText$Model$Text$withText, newText, tl));
							var _v4 = A3(
								$author$project$RichText$Node$replace,
								$author$project$RichText$Model$Selection$anchorNode(selection),
								$author$project$RichText$Node$Inline(newTextLeaf),
								$author$project$RichText$Model$State$root(editorState));
							if (_v4.$ === 1) {
								var e = _v4.a;
								return $elm$core$Result$Err(e);
							} else {
								var newRoot = _v4.a;
								return $elm$core$Result$Ok(
									A2(
										$author$project$RichText$Model$State$withSelection,
										$elm$core$Maybe$Just(
											A2(
												$author$project$RichText$Model$Selection$caret,
												$author$project$RichText$Model$Selection$anchorNode(selection),
												$author$project$RichText$Model$Selection$anchorOffset(selection) + $elm$core$String$length(s))),
										A2($author$project$RichText$Model$State$withRoot, newRoot, editorState)));
							}
						}
					}
				}
			}
		}
	});
var $author$project$RichText$Commands$removeRangeAndInsert = F2(
	function (s, editorState) {
		return A2(
			$elm$core$Result$map,
			function (removedRangeEditorState) {
				return A2(
					$elm$core$Result$withDefault,
					removedRangeEditorState,
					A2($author$project$RichText$Commands$insertText, s, removedRangeEditorState));
			},
			$author$project$RichText$Commands$removeRange(editorState));
	});
var $author$project$RichText$Commands$defaultInputEventCommand = function (event) {
	if (event.cJ === 'insertText') {
		var _v0 = event.cw;
		if (_v0.$ === 1) {
			return _List_Nil;
		} else {
			var data = _v0.a;
			return _List_fromArray(
				[
					_Utils_Tuple2(
					'removeRangeAndInsert',
					$author$project$RichText$Config$Command$transform(
						$author$project$RichText$Commands$removeRangeAndInsert(data)))
				]);
		}
	} else {
		return _List_Nil;
	}
};
var $author$project$RichText$Commands$defaultKeyCommand = function (event) {
	return ((!event.ck) && ((!event.cP) && ((!event.cv) && ($elm$core$String$length(event.bJ) === 1)))) ? _List_fromArray(
		[
			_Utils_Tuple2(
			'removeRangeAndInsert',
			$author$project$RichText$Config$Command$transform(
				$author$project$RichText$Commands$removeRangeAndInsert(event.bJ)))
		]) : _List_Nil;
};
var $author$project$RichText$Config$Keys$delete = 'Delete';
var $author$project$RichText$Commands$deleteBlock = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!A2(
			$author$project$RichText$Node$selectionIsEndOfTextBlock,
			selection,
			$author$project$RichText$Model$State$root(editorState))) {
			return $elm$core$Result$Err('Cannot delete a block element if we\'re not at the end of a text block');
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$next,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('There is no next node to delete');
			} else {
				var _v2 = _v1.a;
				var path = _v2.a;
				var node = _v2.b;
				if (!node.$) {
					var bn = node.a;
					var _v4 = $author$project$RichText$Model$Node$childNodes(bn);
					if (_v4.$ === 2) {
						var _v5 = A3(
							$author$project$RichText$Node$replaceWithFragment,
							path,
							$author$project$RichText$Node$BlockFragment($elm$core$Array$empty),
							$author$project$RichText$Model$State$root(editorState));
						if (_v5.$ === 1) {
							var s = _v5.a;
							return $elm$core$Result$Err(s);
						} else {
							var newRoot = _v5.a;
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$State$withRoot,
									$author$project$RichText$Annotation$clearSelectionAnnotations(newRoot),
									editorState));
						}
					} else {
						return $elm$core$Result$Err('The next node is not a block leaf');
					}
				} else {
					return $elm$core$Result$Err('The next node is not a block leaf, it\'s an inline leaf');
				}
			}
		}
	}
};
var $author$project$RichText$Commands$deleteInlineElement = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('I can only delete an inline element if the selection is collapsed');
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$nodeAt,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('I was given an invalid path to delete text');
			} else {
				var node = _v1.a;
				if (!node.$) {
					return $elm$core$Result$Err('I cannot delete text if the selection a block node');
				} else {
					var il = node.a;
					var length = function () {
						if (il.$ === 1) {
							var t = il.a;
							return $elm$core$String$length(
								$author$project$RichText$Model$Text$text(t));
						} else {
							return 0;
						}
					}();
					if (_Utils_cmp(
						$author$project$RichText$Model$Selection$anchorOffset(selection),
						length) < 0) {
						return $elm$core$Result$Err('I cannot delete an inline element if the cursor is not at the end of an inline node');
					} else {
						var incrementedPath = $author$project$RichText$Model$Node$increment(
							$author$project$RichText$Model$Selection$anchorNode(selection));
						var _v3 = A2(
							$author$project$RichText$Node$nodeAt,
							incrementedPath,
							$author$project$RichText$Model$State$root(editorState));
						if (_v3.$ === 1) {
							return $elm$core$Result$Err('There is no next inline leaf to delete');
						} else {
							var incrementedNode = _v3.a;
							if (incrementedNode.$ === 1) {
								var nil = incrementedNode.a;
								if (!nil.$) {
									var _v6 = A3(
										$author$project$RichText$Node$replaceWithFragment,
										incrementedPath,
										$author$project$RichText$Node$InlineFragment($elm$core$Array$empty),
										$author$project$RichText$Model$State$root(editorState));
									if (_v6.$ === 1) {
										var s = _v6.a;
										return $elm$core$Result$Err(s);
									} else {
										var newRoot = _v6.a;
										return $elm$core$Result$Ok(
											A2($author$project$RichText$Model$State$withRoot, newRoot, editorState));
									}
								} else {
									return $elm$core$Result$Err('There is no next inline leaf element, found a text leaf');
								}
							} else {
								return $elm$core$Result$Err('There is no next inline leaf, found a block node');
							}
						}
					}
				}
			}
		}
	}
};
var $author$project$RichText$Commands$selectForward = function (state) {
	var _v0 = $author$project$RichText$Model$State$selection(state);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('There is no selection to move forward');
	} else {
		var selection = _v0.a;
		var root = $author$project$RichText$Model$State$root(state);
		if (!A2(
			$author$project$RichText$Node$selectionIsEndOfTextBlock,
			selection,
			$author$project$RichText$Model$State$root(state))) {
			return $elm$core$Result$Err('I can only select a node forward if this is the end of a text block');
		} else {
			var _v1 = A3(
				$author$project$RichText$Node$findForwardFromExclusive,
				F2(
					function (_v2, n) {
						return $author$project$RichText$Annotation$isSelectable(n);
					}),
				$author$project$RichText$Model$Selection$anchorNode(selection),
				root);
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('I could not find a selectable node after the selected one');
			} else {
				var _v3 = _v1.a;
				var newAnchor = _v3.a;
				return $elm$core$Result$Ok(
					A2(
						$author$project$RichText$Model$State$withSelection,
						$elm$core$Maybe$Just(
							A2($author$project$RichText$Model$Selection$caret, newAnchor, 0)),
						state));
			}
		}
	}
};
var $author$project$RichText$Commands$deleteCommands = _List_fromArray(
	[
		_Utils_Tuple2(
		'removeRange',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$removeRange)),
		_Utils_Tuple2(
		'removeSelectedLeafElementCommand',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$removeSelectedLeafElement)),
		_Utils_Tuple2(
		'deleteInlineElement',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$deleteInlineElement)),
		_Utils_Tuple2(
		'deleteBlock',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$deleteBlock)),
		_Utils_Tuple2(
		'joinForward',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$joinForward)),
		_Utils_Tuple2(
		'selectForward',
		$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$selectForward))
	]);
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $author$project$RichText$Commands$deleteText = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('I can only backspace a collapsed selection');
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$nodeAt,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('I was given an invalid path to delete text');
			} else {
				var node = _v1.a;
				if (!node.$) {
					return $elm$core$Result$Err('I cannot delete text if the selection a block node');
				} else {
					var il = node.a;
					if (!il.$) {
						return $elm$core$Result$Err('I cannot delete text if the selection an inline leaf');
					} else {
						var tl = il.a;
						var textLength = $elm$core$String$length(
							$author$project$RichText$Model$Text$text(tl));
						if (_Utils_cmp(
							$author$project$RichText$Model$Selection$anchorOffset(selection),
							textLength - 1) < 0) {
							return $elm$core$Result$Err('I use the default behavior when deleting text when the anchor offset is not at the end of a text node');
						} else {
							if (_Utils_eq(
								$author$project$RichText$Model$Selection$anchorOffset(selection),
								textLength - 1)) {
								var _v4 = A3(
									$author$project$RichText$Node$replace,
									$author$project$RichText$Model$Selection$anchorNode(selection),
									$author$project$RichText$Node$Inline(
										$author$project$RichText$Model$Node$Text(
											A2(
												$author$project$RichText$Model$Text$withText,
												A2(
													$elm$core$String$dropRight,
													1,
													$author$project$RichText$Model$Text$text(tl)),
												tl))),
									$author$project$RichText$Model$State$root(editorState));
								if (_v4.$ === 1) {
									var s = _v4.a;
									return $elm$core$Result$Err(s);
								} else {
									var newRoot = _v4.a;
									return $elm$core$Result$Ok(
										A2($author$project$RichText$Model$State$withRoot, newRoot, editorState));
								}
							} else {
								var _v5 = A2(
									$author$project$RichText$Node$next,
									$author$project$RichText$Model$Selection$anchorNode(selection),
									$author$project$RichText$Model$State$root(editorState));
								if (_v5.$ === 1) {
									return $elm$core$Result$Err('I cannot do delete because there is no neighboring text node');
								} else {
									var _v6 = _v5.a;
									var nextPath = _v6.a;
									var nextNode = _v6.b;
									if (!nextNode.$) {
										return $elm$core$Result$Err('Cannot delete the text of a block node');
									} else {
										var nextInlineLeafWrapper = nextNode.a;
										if (nextInlineLeafWrapper.$ === 1) {
											var newSelection = A3($author$project$RichText$Model$Selection$singleNodeRange, nextPath, 0, 1);
											return $author$project$RichText$Commands$removeRange(
												A2(
													$author$project$RichText$Model$State$withSelection,
													$elm$core$Maybe$Just(newSelection),
													editorState));
										} else {
											return $elm$core$Result$Err('Cannot delete if the previous node is an inline leaf');
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
};
var $author$project$RichText$Internal$DeleteWord$deleteWordRegexString = '^' + ('(?:' + ($author$project$RichText$Internal$DeleteWord$whitespaceAndPunctuationRegexString + (')*' + ('(?:' + ($author$project$RichText$Internal$DeleteWord$chameleonCharactersRegexString + ('|(?!' + ($author$project$RichText$Internal$DeleteWord$whitespaceAndPunctuationRegexString + (').)*' + ('(?:(?!' + ($author$project$RichText$Internal$DeleteWord$whitespaceAndPunctuationRegexString + ').)'))))))))));
var $author$project$RichText$Internal$DeleteWord$deleteWordRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString($author$project$RichText$Internal$DeleteWord$deleteWordRegexString));
var $author$project$RichText$Commands$deleteWord = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return $elm$core$Result$Err('I cannot remove a word of a range selection');
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$findTextBlockNodeAncestor,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('I can only remove a word on a text leaf');
			} else {
				var _v2 = _v1.a;
				var p = _v2.a;
				var n = _v2.b;
				var _v3 = $author$project$RichText$Model$Node$childNodes(n);
				if (_v3.$ === 1) {
					var arr = _v3.a;
					var groupedLeaves = A2(
						$elmcraft$core_extra$List$Extra$groupWhile,
						$author$project$RichText$Commands$groupSameTypeInlineLeaf,
						$elm$core$Array$toList(
							$author$project$RichText$Model$Node$toInlineArray(arr)));
					var _v4 = $elmcraft$core_extra$List$Extra$last(
						$author$project$RichText$Model$Selection$anchorNode(selection));
					if (_v4.$ === 1) {
						return $elm$core$Result$Err('Somehow the anchor node is the root node');
					} else {
						var lastIndex = _v4.a;
						var _v5 = A3(
							$elm$core$List$foldl,
							F2(
								function (_v6, _v7) {
									var first = _v6.a;
									var rest = _v6.b;
									var i = _v7.a;
									var g = _v7.b;
									return (!$elm$core$List$isEmpty(g)) ? _Utils_Tuple2(i, g) : ((_Utils_cmp(
										$elm$core$List$length(rest) + 1,
										i) > 0) ? _Utils_Tuple2(
										i,
										A2($elm$core$List$cons, first, rest)) : _Utils_Tuple2(
										i - ($elm$core$List$length(rest) + 1),
										g));
								}),
							_Utils_Tuple2(lastIndex, _List_Nil),
							groupedLeaves);
						var relativeLastIndex = _v5.a;
						var group = _v5.b;
						var groupText = $author$project$RichText$Commands$textFromGroup(group);
						var offsetUpToNewIndex = $elm$core$List$sum(
							A2(
								$elm$core$List$take,
								relativeLastIndex,
								$author$project$RichText$Commands$lengthsFromGroup(group)));
						var offset = offsetUpToNewIndex + $author$project$RichText$Model$Selection$anchorOffset(selection);
						var stringTo = A2($elm$core$String$dropLeft, offset, groupText);
						if ($elm$core$String$isEmpty(stringTo)) {
							return $elm$core$Result$Err('Cannot remove word a word if the text fragment is empty');
						} else {
							var matches = A3($elm$regex$Regex$findAtMost, 1, $author$project$RichText$Internal$DeleteWord$deleteWordRegex, stringTo);
							var matchOffset = function () {
								var _v10 = $elm$core$List$head(matches);
								if (_v10.$ === 1) {
									return 0;
								} else {
									var match = _v10.a;
									return match.bF + $elm$core$String$length(match.cO);
								}
							}();
							var _v8 = A3(
								$elm$core$List$foldl,
								F2(
									function (l, _v9) {
										var i = _v9.a;
										var o = _v9.b;
										var done = _v9.c;
										return done ? _Utils_Tuple3(i, o, done) : ((_Utils_cmp(l, o) < 0) ? _Utils_Tuple3(i + 1, o - l, false) : _Utils_Tuple3(i, o, true));
									}),
								_Utils_Tuple3(0, offset + matchOffset, false),
								$author$project$RichText$Commands$lengthsFromGroup(group));
							var newGroupIndex = _v8.a;
							var newOffset = _v8.b;
							var newIndex = lastIndex - (relativeLastIndex - newGroupIndex);
							var newSelection = A4(
								$author$project$RichText$Model$Selection$range,
								_Utils_ap(
									p,
									_List_fromArray(
										[newIndex])),
								newOffset,
								$author$project$RichText$Model$Selection$anchorNode(selection),
								$author$project$RichText$Model$Selection$anchorOffset(selection));
							var newState = A2(
								$author$project$RichText$Model$State$withSelection,
								$elm$core$Maybe$Just(newSelection),
								editorState);
							return $author$project$RichText$Commands$removeRange(newState);
						}
					}
				} else {
					return $elm$core$Result$Err('I expected an inline leaf array');
				}
			}
		}
	}
};
var $author$project$RichText$Config$Command$emptyFunction = function (_v0) {
	return _List_Nil;
};
var $author$project$RichText$Config$Command$emptyCommandMap = {I: $author$project$RichText$Config$Command$emptyFunction, J: $author$project$RichText$Config$Command$emptyFunction, M: $elm$core$Dict$empty, x: $elm$core$Dict$empty};
var $author$project$RichText$Config$Keys$enter = 'Enter';
var $author$project$RichText$Config$Command$InputEventType = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Config$Command$inputEvent = function (type_) {
	return $author$project$RichText$Config$Command$InputEventType(type_);
};
var $author$project$RichText$Config$ElementDefinition$defaultElementToHtml = F3(
	function (tagName, elementParameters, children) {
		return A3(
			$author$project$RichText$Model$HtmlNode$ElementNode,
			tagName,
			A2(
				$elm$core$List$filterMap,
				function (attr) {
					if (!attr.$) {
						var k = attr.a;
						var v = attr.b;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(k, v));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				$author$project$RichText$Internal$Definitions$attributesFromElement(elementParameters)),
			children);
	});
var $author$project$RichText$Definitions$hardBreakToHtml = $author$project$RichText$Config$ElementDefinition$defaultElementToHtml('br');
var $author$project$RichText$Definitions$htmlToHardBreak = $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement('br');
var $author$project$RichText$Internal$Definitions$InlineLeafNodeType = {$: 3};
var $author$project$RichText$Config$ElementDefinition$inlineLeaf = $author$project$RichText$Internal$Definitions$InlineLeafNodeType;
var $author$project$RichText$Definitions$hardBreak = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{ct: $author$project$RichText$Config$ElementDefinition$inlineLeaf, by: $author$project$RichText$Definitions$htmlToHardBreak, cE: 'inline', bM: 'hard_break', c0: false, cb: $author$project$RichText$Definitions$hardBreakToHtml});
var $author$project$RichText$Model$InlineElement$inlineElement = F2(
	function (parameters, m) {
		return {aC: parameters, W: m};
	});
var $author$project$RichText$Model$Node$inlineElement = F2(
	function (parameters, mark) {
		return $author$project$RichText$Model$Node$InlineElement(
			A2($author$project$RichText$Model$InlineElement$inlineElement, parameters, mark));
	});
var $author$project$RichText$Node$splitTextLeaf = F2(
	function (offset, leaf) {
		var leafText = $author$project$RichText$Model$Text$text(leaf);
		return _Utils_Tuple2(
			A2(
				$author$project$RichText$Model$Text$withText,
				A2($elm$core$String$left, offset, leafText),
				leaf),
			A2(
				$author$project$RichText$Model$Text$withText,
				A2($elm$core$String$dropLeft, offset, leafText),
				leaf));
	});
var $author$project$RichText$Commands$insertInline = F2(
	function (leaf, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return A2(
					$elm$core$Result$andThen,
					$author$project$RichText$Commands$insertInline(leaf),
					$author$project$RichText$Commands$removeRange(editorState));
			} else {
				var _v1 = A2(
					$author$project$RichText$Node$nodeAt,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('Invalid selection');
				} else {
					var node = _v1.a;
					if (node.$ === 1) {
						var il = node.a;
						if (!il.$) {
							var _v4 = A3(
								$author$project$RichText$Node$replace,
								$author$project$RichText$Model$Selection$anchorNode(selection),
								$author$project$RichText$Node$Inline(leaf),
								$author$project$RichText$Model$State$root(editorState));
							if (_v4.$ === 1) {
								var e = _v4.a;
								return $elm$core$Result$Err(e);
							} else {
								var newRoot = _v4.a;
								var newSelection = function () {
									var _v5 = A3(
										$author$project$RichText$Node$findForwardFrom,
										F2(
											function (_v6, n) {
												return $author$project$RichText$Annotation$isSelectable(n);
											}),
										$author$project$RichText$Model$Selection$anchorNode(selection),
										newRoot);
									if (_v5.$ === 1) {
										return $elm$core$Maybe$Nothing;
									} else {
										var _v7 = _v5.a;
										var p = _v7.a;
										return $elm$core$Maybe$Just(
											A2($author$project$RichText$Model$Selection$caret, p, 0));
									}
								}();
								return $elm$core$Result$Ok(
									A2(
										$author$project$RichText$Model$State$withSelection,
										newSelection,
										A2($author$project$RichText$Model$State$withRoot, newRoot, editorState)));
							}
						} else {
							var tl = il.a;
							var _v8 = A2(
								$author$project$RichText$Node$splitTextLeaf,
								$author$project$RichText$Model$Selection$anchorOffset(selection),
								tl);
							var before = _v8.a;
							var after = _v8.b;
							var _v9 = A3(
								$author$project$RichText$Node$replaceWithFragment,
								$author$project$RichText$Model$Selection$anchorNode(selection),
								$author$project$RichText$Node$InlineFragment(
									$elm$core$Array$fromList(
										_List_fromArray(
											[
												$author$project$RichText$Model$Node$Text(before),
												leaf,
												$author$project$RichText$Model$Node$Text(after)
											]))),
								$author$project$RichText$Model$State$root(editorState));
							if (_v9.$ === 1) {
								var e = _v9.a;
								return $elm$core$Result$Err(e);
							} else {
								var newRoot = _v9.a;
								var newSelection = function () {
									var _v10 = A3(
										$author$project$RichText$Node$findForwardFromExclusive,
										F2(
											function (_v11, n) {
												return $author$project$RichText$Annotation$isSelectable(n);
											}),
										$author$project$RichText$Model$Selection$anchorNode(selection),
										newRoot);
									if (_v10.$ === 1) {
										return $elm$core$Maybe$Nothing;
									} else {
										var _v12 = _v10.a;
										var p = _v12.a;
										return $elm$core$Maybe$Just(
											A2($author$project$RichText$Model$Selection$caret, p, 0));
									}
								}();
								return $elm$core$Result$Ok(
									A2(
										$author$project$RichText$Model$State$withSelection,
										newSelection,
										A2($author$project$RichText$Model$State$withRoot, newRoot, editorState)));
							}
						}
					} else {
						return $elm$core$Result$Err('I can not insert an inline element if a block is selected');
					}
				}
			}
		}
	});
var $author$project$RichText$Commands$insertLineBreak = $author$project$RichText$Commands$insertInline(
	A2(
		$author$project$RichText$Model$Node$inlineElement,
		A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$hardBreak, _List_Nil),
		_List_Nil));
var $author$project$RichText$Config$Command$InternalCommand = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Config$Command$internal = function (i) {
	return $author$project$RichText$Config$Command$InternalCommand(i);
};
var $author$project$RichText$Config$Command$Key = function (a) {
	return {$: 0, a: a};
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elmcraft$core_extra$List$Extra$uniqueHelp = F4(
	function (f, existing, remaining, accumulator) {
		uniqueHelp:
		while (true) {
			if (!remaining.b) {
				return $elm$core$List$reverse(accumulator);
			} else {
				var first = remaining.a;
				var rest = remaining.b;
				var computedFirst = f(first);
				if (A2($elm$core$List$member, computedFirst, existing)) {
					var $temp$f = f,
						$temp$existing = existing,
						$temp$remaining = rest,
						$temp$accumulator = accumulator;
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				} else {
					var $temp$f = f,
						$temp$existing = A2($elm$core$List$cons, computedFirst, existing),
						$temp$remaining = rest,
						$temp$accumulator = A2($elm$core$List$cons, first, accumulator);
					f = $temp$f;
					existing = $temp$existing;
					remaining = $temp$remaining;
					accumulator = $temp$accumulator;
					continue uniqueHelp;
				}
			}
		}
	});
var $elmcraft$core_extra$List$Extra$unique = function (list) {
	return A4($elmcraft$core_extra$List$Extra$uniqueHelp, $elm$core$Basics$identity, _List_Nil, list, _List_Nil);
};
var $author$project$RichText$Config$Command$key = function (keys) {
	return $author$project$RichText$Config$Command$Key(
		$elm$core$List$sort(
			$elmcraft$core_extra$List$Extra$unique(keys)));
};
var $author$project$RichText$Node$isEmptyTextBlock = function (node) {
	if (!node.$) {
		var bn = node.a;
		var _v1 = $author$project$RichText$Model$Node$childNodes(bn);
		if (_v1.$ === 1) {
			var a = _v1.a;
			var array = $author$project$RichText$Model$Node$toInlineArray(a);
			var _v2 = A2($elm$core$Array$get, 0, array);
			if (_v2.$ === 1) {
				return $elm$core$Array$isEmpty(array);
			} else {
				var n = _v2.a;
				return ($elm$core$Array$length(array) === 1) && function () {
					if (n.$ === 1) {
						var t = n.a;
						return $elm$core$String$isEmpty(
							$author$project$RichText$Model$Text$text(t));
					} else {
						return false;
					}
				}();
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
};
var $author$project$RichText$Node$indexedMapRec = F3(
	function (path, func, node) {
		var applied = A2(func, path, node);
		if (!applied.$) {
			var blockNode = applied.a;
			var cn = function () {
				var _v1 = $author$project$RichText$Model$Node$childNodes(blockNode);
				switch (_v1.$) {
					case 0:
						var a = _v1.a;
						return $author$project$RichText$Model$Node$blockChildren(
							A2(
								$elm$core$Array$indexedMap,
								F2(
									function (i, v) {
										var _v2 = A3(
											$author$project$RichText$Node$indexedMapRec,
											_Utils_ap(
												path,
												_List_fromArray(
													[i])),
											func,
											$author$project$RichText$Node$Block(v));
										if (!_v2.$) {
											var b = _v2.a;
											return b;
										} else {
											return v;
										}
									}),
								$author$project$RichText$Model$Node$toBlockArray(a)));
					case 1:
						var a = _v1.a;
						return $author$project$RichText$Model$Node$inlineChildren(
							A2(
								$elm$core$Array$indexedMap,
								F2(
									function (i, v) {
										var _v3 = A3(
											$author$project$RichText$Node$indexedMapRec,
											_Utils_ap(
												path,
												_List_fromArray(
													[i])),
											func,
											$author$project$RichText$Node$Inline(v));
										if (_v3.$ === 1) {
											var b = _v3.a;
											return b;
										} else {
											return v;
										}
									}),
								$author$project$RichText$Model$Node$toInlineArray(a)));
					default:
						return $author$project$RichText$Model$Node$Leaf;
				}
			}();
			return $author$project$RichText$Node$Block(
				A2($author$project$RichText$Model$Node$withChildNodes, cn, blockNode));
		} else {
			var inlineLeaf = applied.a;
			return $author$project$RichText$Node$Inline(inlineLeaf);
		}
	});
var $author$project$RichText$Node$indexedMap = $author$project$RichText$Node$indexedMapRec(_List_Nil);
var $author$project$RichText$Internal$Constants$lift = '__lift__';
var $author$project$RichText$Annotation$lift = $author$project$RichText$Internal$Constants$lift;
var $author$project$RichText$Commands$addLiftMarkToBlocksInSelection = F2(
	function (selection, root) {
		var start = A2(
			$author$project$RichText$Node$findClosestBlockPath,
			$author$project$RichText$Model$Selection$anchorNode(selection),
			root);
		var end = A2(
			$author$project$RichText$Node$findClosestBlockPath,
			$author$project$RichText$Model$Selection$focusNode(selection),
			root);
		var _v0 = A2(
			$author$project$RichText$Node$indexedMap,
			F2(
				function (path, node) {
					if ((_Utils_cmp(path, start) < 0) || (_Utils_cmp(path, end) > 0)) {
						return node;
					} else {
						if (!node.$) {
							var bn = node.a;
							var addMarker = function () {
								var _v2 = $author$project$RichText$Model$Node$childNodes(bn);
								switch (_v2.$) {
									case 2:
										return true;
									case 1:
										return true;
									default:
										return false;
								}
							}();
							return addMarker ? A2(
								$author$project$RichText$Annotation$add,
								$author$project$RichText$Annotation$lift,
								$author$project$RichText$Node$Block(bn)) : node;
						} else {
							return node;
						}
					}
				}),
			$author$project$RichText$Node$Block(root));
		if (!_v0.$) {
			var bn = _v0.a;
			return bn;
		} else {
			return root;
		}
	});
var $author$project$RichText$Node$concatMap = F2(
	function (func, node) {
		var newChildren = function () {
			var _v0 = $author$project$RichText$Model$Node$childNodes(node);
			switch (_v0.$) {
				case 2:
					return $author$project$RichText$Model$Node$Leaf;
				case 0:
					var a = _v0.a;
					var c = A2(
						$elm$core$List$concatMap,
						function (x) {
							if (!x.$) {
								var v = x.a;
								return _List_fromArray(
									[v]);
							} else {
								return _List_Nil;
							}
						},
						A2(
							$elm$core$List$concatMap,
							func,
							A2(
								$elm$core$List$map,
								$author$project$RichText$Node$Block,
								$elm$core$Array$toList(
									$author$project$RichText$Model$Node$toBlockArray(a)))));
					return $author$project$RichText$Model$Node$blockChildren(
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$map,
								$author$project$RichText$Node$concatMap(func),
								c)));
				default:
					var a = _v0.a;
					return $author$project$RichText$Model$Node$inlineChildren(
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$concatMap,
								function (x) {
									if (!x.$) {
										return _List_Nil;
									} else {
										var v = x.a;
										return _List_fromArray(
											[v]);
									}
								},
								A2(
									$elm$core$List$concatMap,
									func,
									A2(
										$elm$core$List$map,
										$author$project$RichText$Node$Inline,
										$elm$core$Array$toList(
											$author$project$RichText$Model$Node$toInlineArray(a)))))));
			}
		}();
		return A2($author$project$RichText$Model$Node$withChildNodes, newChildren, node);
	});
var $author$project$RichText$Annotation$annotationsFromBlockNode = function (node) {
	return $author$project$RichText$Model$Element$annotations(
		$author$project$RichText$Model$Node$element(node));
};
var $author$project$RichText$Annotation$liftConcatMapFunc = function (node) {
	if (!node.$) {
		var bn = node.a;
		var _v1 = $author$project$RichText$Model$Node$childNodes(bn);
		switch (_v1.$) {
			case 2:
				return _List_fromArray(
					[node]);
			case 1:
				return _List_fromArray(
					[node]);
			default:
				var a = _v1.a;
				var groupedBlockNodes = A2(
					$elmcraft$core_extra$List$Extra$groupWhile,
					F2(
						function (n1, n2) {
							return _Utils_eq(
								A2(
									$elm$core$Set$member,
									$author$project$RichText$Annotation$lift,
									$author$project$RichText$Annotation$annotationsFromBlockNode(n1)),
								A2(
									$elm$core$Set$member,
									$author$project$RichText$Annotation$lift,
									$author$project$RichText$Annotation$annotationsFromBlockNode(n2)));
						}),
					$elm$core$Array$toList(
						$author$project$RichText$Model$Node$toBlockArray(a)));
				return A2(
					$elm$core$List$map,
					$author$project$RichText$Node$Block,
					A2(
						$elm$core$List$concatMap,
						function (_v2) {
							var n = _v2.a;
							var l = _v2.b;
							return A2(
								$elm$core$Set$member,
								$author$project$RichText$Annotation$lift,
								$author$project$RichText$Annotation$annotationsFromBlockNode(n)) ? A2($elm$core$List$cons, n, l) : _List_fromArray(
								[
									A2(
									$author$project$RichText$Model$Node$withChildNodes,
									$author$project$RichText$Model$Node$blockChildren(
										$elm$core$Array$fromList(
											A2($elm$core$List$cons, n, l))),
									bn)
								]);
						},
						groupedBlockNodes));
		}
	} else {
		return _List_fromArray(
			[node]);
	}
};
var $author$project$RichText$Annotation$doLift = function (root) {
	return A2($author$project$RichText$Node$concatMap, $author$project$RichText$Annotation$liftConcatMapFunc, root);
};
var $author$project$RichText$Commands$lift = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
		var markedRoot = A2(
			$author$project$RichText$Commands$addLiftMarkToBlocksInSelection,
			normalizedSelection,
			A2(
				$author$project$RichText$Annotation$annotateSelection,
				normalizedSelection,
				$author$project$RichText$Model$State$root(editorState)));
		var liftedRoot = $author$project$RichText$Annotation$doLift(markedRoot);
		var newSelection = A3(
			$author$project$RichText$Annotation$selectionFromAnnotations,
			liftedRoot,
			$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
			$author$project$RichText$Model$Selection$focusOffset(normalizedSelection));
		return $elm$core$Result$Ok(
			A2(
				$author$project$RichText$Model$State$withRoot,
				A2(
					$author$project$RichText$Annotation$clear,
					$author$project$RichText$Annotation$lift,
					$author$project$RichText$Annotation$clearSelectionAnnotations(liftedRoot)),
				A2($author$project$RichText$Model$State$withSelection, newSelection, editorState)));
	}
};
var $author$project$RichText$Commands$liftEmpty = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Nothing is selected');
	} else {
		var selection = _v0.a;
		if ((!$author$project$RichText$Model$Selection$isCollapsed(selection)) || (!(!$author$project$RichText$Model$Selection$anchorOffset(selection)))) {
			return $elm$core$Result$Err('Can only lift empty text blocks');
		} else {
			var p = A2(
				$author$project$RichText$Node$findClosestBlockPath,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			var _v1 = A2(
				$author$project$RichText$Node$nodeAt,
				p,
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('Invalid root path');
			} else {
				var node = _v1.a;
				return (!$author$project$RichText$Node$isEmptyTextBlock(node)) ? $elm$core$Result$Err('I can only lift an empty text block') : (($elm$core$List$length(p) < 2) ? $elm$core$Result$Err('I cannot lift a node that\'s root or an immediate child of root') : $author$project$RichText$Commands$lift(editorState));
			}
		}
	}
};
var $author$project$RichText$Config$Keys$return = 'Return';
var $author$project$RichText$Commands$selectAll = function (editorState) {
	var _v0 = A3(
		$author$project$RichText$Node$indexedFoldl,
		F3(
			function (path, node, _v1) {
				var firstAndLast = _v1.a;
				var offset = _v1.b;
				if ($author$project$RichText$Annotation$isSelectable(node)) {
					var newOffset = function () {
						if (node.$ === 1) {
							var il = node.a;
							if (il.$ === 1) {
								var tl = il.a;
								return $elm$core$String$length(
									$author$project$RichText$Model$Text$text(tl));
							} else {
								return 0;
							}
						} else {
							return 0;
						}
					}();
					if (firstAndLast.$ === 1) {
						return _Utils_Tuple2(
							$elm$core$Maybe$Just(
								_Utils_Tuple2(path, path)),
							newOffset);
					} else {
						var _v3 = firstAndLast.a;
						var first = _v3.a;
						return _Utils_Tuple2(
							$elm$core$Maybe$Just(
								_Utils_Tuple2(first, path)),
							newOffset);
					}
				} else {
					return _Utils_Tuple2(firstAndLast, offset);
				}
			}),
		_Utils_Tuple2($elm$core$Maybe$Nothing, 0),
		$author$project$RichText$Node$Block(
			$author$project$RichText$Model$State$root(editorState)));
	var fl = _v0.a;
	var lastOffset = _v0.b;
	if (fl.$ === 1) {
		return $elm$core$Result$Err('Nothing is selectable');
	} else {
		var _v7 = fl.a;
		var first = _v7.a;
		var last = _v7.b;
		return $elm$core$Result$Ok(
			A2(
				$author$project$RichText$Model$State$withSelection,
				$elm$core$Maybe$Just(
					A4($author$project$RichText$Model$Selection$range, first, 0, last, lastOffset)),
				editorState));
	}
};
var $author$project$RichText$Config$Command$set = F3(
	function (bindings, func, map) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (binding, accMap) {
					var m = accMap;
					if (!binding.$) {
						var keys = binding.a;
						return _Utils_update(
							m,
							{
								x: A3($elm$core$Dict$insert, keys, func, m.x)
							});
					} else {
						var type_ = binding.a;
						return _Utils_update(
							m,
							{
								M: A3($elm$core$Dict$insert, type_, func, m.M)
							});
					}
				}),
			map,
			bindings);
	});
var $author$project$RichText$Config$Keys$shift = 'Shift';
var $author$project$RichText$Config$Keys$short = '__Short__';
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $author$project$RichText$Node$splitBlockAtPathAndOffset = F3(
	function (path, offset, node) {
		if (!path.b) {
			var _v1 = $author$project$RichText$Model$Node$childNodes(node);
			switch (_v1.$) {
				case 0:
					var a = _v1.a;
					var arr = $author$project$RichText$Model$Node$toBlockArray(a);
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A2(
								$author$project$RichText$Model$Node$withChildNodes,
								$author$project$RichText$Model$Node$blockChildren(
									A2($elmcraft$core_extra$Array$Extra$sliceUntil, offset, arr)),
								node),
							A2(
								$author$project$RichText$Model$Node$withChildNodes,
								$author$project$RichText$Model$Node$blockChildren(
									A2($elmcraft$core_extra$Array$Extra$sliceFrom, offset, arr)),
								node)));
				case 1:
					var a = _v1.a;
					var arr = $author$project$RichText$Model$Node$toInlineArray(a);
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(
							A2(
								$author$project$RichText$Model$Node$withChildNodes,
								$author$project$RichText$Model$Node$inlineChildren(
									A2($elmcraft$core_extra$Array$Extra$sliceUntil, offset, arr)),
								node),
							A2(
								$author$project$RichText$Model$Node$withChildNodes,
								$author$project$RichText$Model$Node$inlineChildren(
									A2($elmcraft$core_extra$Array$Extra$sliceFrom, offset, arr)),
								node)));
				default:
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(node, node));
			}
		} else {
			var x = path.a;
			var xs = path.b;
			var _v2 = $author$project$RichText$Model$Node$childNodes(node);
			switch (_v2.$) {
				case 0:
					var a = _v2.a;
					var arr = $author$project$RichText$Model$Node$toBlockArray(a);
					var _v3 = A2($elm$core$Array$get, x, arr);
					if (_v3.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var n = _v3.a;
						var _v4 = A3($author$project$RichText$Node$splitBlockAtPathAndOffset, xs, offset, n);
						if (_v4.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var _v5 = _v4.a;
							var before = _v5.a;
							var after = _v5.b;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A2(
												$elm$core$Array$append,
												A2($elmcraft$core_extra$Array$Extra$sliceUntil, x, arr),
												$elm$core$Array$fromList(
													_List_fromArray(
														[before])))),
										node),
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$blockChildren(
											A2(
												$elm$core$Array$append,
												$elm$core$Array$fromList(
													_List_fromArray(
														[after])),
												A2($elmcraft$core_extra$Array$Extra$sliceFrom, x + 1, arr))),
										node)));
						}
					}
				case 1:
					var a = _v2.a;
					var arr = $author$project$RichText$Model$Node$toInlineArray(a);
					var _v6 = A2($elm$core$Array$get, x, arr);
					if (_v6.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var n = _v6.a;
						if (n.$ === 1) {
							var tl = n.a;
							var _v8 = A2($author$project$RichText$Node$splitTextLeaf, offset, tl);
							var before = _v8.a;
							var after = _v8.b;
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$inlineChildren(
											A3(
												$elm$core$Array$set,
												x,
												$author$project$RichText$Model$Node$Text(before),
												A2($elmcraft$core_extra$Array$Extra$sliceUntil, x + 1, arr))),
										node),
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$inlineChildren(
											A3(
												$elm$core$Array$set,
												0,
												$author$project$RichText$Model$Node$Text(after),
												A2($elmcraft$core_extra$Array$Extra$sliceFrom, x, arr))),
										node)));
						} else {
							return $elm$core$Maybe$Just(
								_Utils_Tuple2(
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$inlineChildren(
											A2($elmcraft$core_extra$Array$Extra$sliceUntil, x, arr)),
										node),
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$inlineChildren(
											A2($elmcraft$core_extra$Array$Extra$sliceFrom, x, arr)),
										node)));
						}
					}
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RichText$Commands$splitBlock = F2(
	function (ancestorFunc, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return A2(
					$elm$core$Result$andThen,
					$author$project$RichText$Commands$splitBlock(ancestorFunc),
					$author$project$RichText$Commands$removeRange(editorState));
			} else {
				var _v1 = A2(
					ancestorFunc,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('I cannot find a proper ancestor to split');
				} else {
					var _v2 = _v1.a;
					var ancestorPath = _v2.a;
					var ancestorNode = _v2.b;
					var relativePath = A2(
						$elm$core$List$drop,
						$elm$core$List$length(ancestorPath),
						$author$project$RichText$Model$Selection$anchorNode(selection));
					var _v3 = A3(
						$author$project$RichText$Node$splitBlockAtPathAndOffset,
						relativePath,
						$author$project$RichText$Model$Selection$anchorOffset(selection),
						ancestorNode);
					if (_v3.$ === 1) {
						return $elm$core$Result$Err(
							'Can not split block at path ' + $author$project$RichText$Model$Node$toString(
								$author$project$RichText$Model$Selection$anchorNode(selection)));
					} else {
						var _v4 = _v3.a;
						var before = _v4.a;
						var after = _v4.b;
						var _v5 = A3(
							$author$project$RichText$Node$replaceWithFragment,
							ancestorPath,
							$author$project$RichText$Node$BlockFragment(
								$elm$core$Array$fromList(
									_List_fromArray(
										[before, after]))),
							$author$project$RichText$Model$State$root(editorState));
						if (_v5.$ === 1) {
							var s = _v5.a;
							return $elm$core$Result$Err(s);
						} else {
							var newRoot = _v5.a;
							var newSelectionPath = _Utils_ap(
								$author$project$RichText$Model$Node$increment(ancestorPath),
								A2(
									$elm$core$List$repeat,
									$elm$core$List$length(
										$author$project$RichText$Model$Selection$anchorNode(selection)) - $elm$core$List$length(ancestorPath),
									0));
							var newSelection = A2($author$project$RichText$Model$Selection$caret, newSelectionPath, 0);
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$State$withSelection,
									$elm$core$Maybe$Just(newSelection),
									A2($author$project$RichText$Model$State$withRoot, newRoot, editorState)));
						}
					}
				}
			}
		}
	});
var $author$project$RichText$Commands$splitTextBlock = $author$project$RichText$Commands$splitBlock($author$project$RichText$Node$findTextBlockNodeAncestor);
var $author$project$RichText$Config$Command$withDefaultInputEventCommand = F2(
	function (func, map) {
		var m = map;
		return _Utils_update(
			m,
			{I: func});
	});
var $author$project$RichText$Config$Command$withDefaultKeyCommand = F2(
	function (func, map) {
		var m = map;
		return _Utils_update(
			m,
			{J: func});
	});
var $author$project$RichText$Commands$defaultCommandMap = A2(
	$author$project$RichText$Config$Command$withDefaultInputEventCommand,
	$author$project$RichText$Commands$defaultInputEventCommand,
	A2(
		$author$project$RichText$Config$Command$withDefaultKeyCommand,
		$author$project$RichText$Commands$defaultKeyCommand,
		A3(
			$author$project$RichText$Config$Command$set,
			_List_fromArray(
				[
					$author$project$RichText$Config$Command$inputEvent('historyRedo'),
					$author$project$RichText$Config$Command$key(
					_List_fromArray(
						[$author$project$RichText$Config$Keys$short, $author$project$RichText$Config$Keys$shift, 'z']))
				]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'redo',
					$author$project$RichText$Config$Command$internal(1))
				]),
			A3(
				$author$project$RichText$Config$Command$set,
				_List_fromArray(
					[
						$author$project$RichText$Config$Command$inputEvent('historyUndo'),
						$author$project$RichText$Config$Command$key(
						_List_fromArray(
							[$author$project$RichText$Config$Keys$short, 'z']))
					]),
				_List_fromArray(
					[
						_Utils_Tuple2(
						'undo',
						$author$project$RichText$Config$Command$internal(0))
					]),
				A3(
					$author$project$RichText$Config$Command$set,
					_List_fromArray(
						[
							$author$project$RichText$Config$Command$key(
							_List_fromArray(
								[$author$project$RichText$Config$Keys$short, 'a']))
						]),
					_List_fromArray(
						[
							_Utils_Tuple2(
							'selectAll',
							$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$selectAll))
						]),
					A3(
						$author$project$RichText$Config$Command$set,
						_List_fromArray(
							[
								$author$project$RichText$Config$Command$inputEvent('deleteWordForward'),
								$author$project$RichText$Config$Command$key(
								_List_fromArray(
									[$author$project$RichText$Config$Keys$alt, $author$project$RichText$Config$Keys$delete]))
							]),
						_Utils_ap(
							$author$project$RichText$Commands$deleteCommands,
							_List_fromArray(
								[
									_Utils_Tuple2(
									'deleteWord',
									$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$deleteWord))
								])),
						A3(
							$author$project$RichText$Config$Command$set,
							_List_fromArray(
								[
									$author$project$RichText$Config$Command$inputEvent('deleteContentForward'),
									$author$project$RichText$Config$Command$key(
									_List_fromArray(
										[$author$project$RichText$Config$Keys$delete]))
								]),
							_Utils_ap(
								$author$project$RichText$Commands$deleteCommands,
								_List_fromArray(
									[
										_Utils_Tuple2(
										'deleteText',
										$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$deleteText))
									])),
							A3(
								$author$project$RichText$Config$Command$set,
								_List_fromArray(
									[
										$author$project$RichText$Config$Command$inputEvent('deleteWordBackward'),
										$author$project$RichText$Config$Command$key(
										_List_fromArray(
											[$author$project$RichText$Config$Keys$alt, $author$project$RichText$Config$Keys$backspace]))
									]),
								_Utils_ap(
									$author$project$RichText$Commands$backspaceCommands,
									_List_fromArray(
										[
											_Utils_Tuple2(
											'backspaceWord',
											$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$backspaceWord))
										])),
								A3(
									$author$project$RichText$Config$Command$set,
									_List_fromArray(
										[
											$author$project$RichText$Config$Command$inputEvent('deleteContentBackward'),
											$author$project$RichText$Config$Command$key(
											_List_fromArray(
												[$author$project$RichText$Config$Keys$backspace]))
										]),
									_Utils_ap(
										$author$project$RichText$Commands$backspaceCommands,
										_List_fromArray(
											[
												_Utils_Tuple2(
												'backspaceText',
												$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$backspaceText))
											])),
									A3(
										$author$project$RichText$Config$Command$set,
										_List_fromArray(
											[
												$author$project$RichText$Config$Command$inputEvent('insertParagraph'),
												$author$project$RichText$Config$Command$key(
												_List_fromArray(
													[$author$project$RichText$Config$Keys$enter])),
												$author$project$RichText$Config$Command$key(
												_List_fromArray(
													[$author$project$RichText$Config$Keys$return]))
											]),
										_List_fromArray(
											[
												_Utils_Tuple2(
												'liftEmpty',
												$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$liftEmpty)),
												_Utils_Tuple2(
												'splitTextBlock',
												$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$splitTextBlock))
											]),
										A3(
											$author$project$RichText$Config$Command$set,
											_List_fromArray(
												[
													$author$project$RichText$Config$Command$inputEvent('insertLineBreak'),
													$author$project$RichText$Config$Command$key(
													_List_fromArray(
														[$author$project$RichText$Config$Keys$shift, $author$project$RichText$Config$Keys$enter])),
													$author$project$RichText$Config$Command$key(
													_List_fromArray(
														[$author$project$RichText$Config$Keys$shift, $author$project$RichText$Config$Keys$return]))
												]),
											_List_fromArray(
												[
													_Utils_Tuple2(
													'insertLineBreak',
													$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$insertLineBreak))
												]),
											$author$project$RichText$Config$Command$emptyCommandMap)))))))))));
var $author$project$Editor$emptyParagraph = A2(
	$author$project$RichText$Model$Node$block,
	A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil),
	$author$project$RichText$Model$Node$inlineChildren(
		$elm$core$Array$fromList(
			_List_fromArray(
				[
					$author$project$RichText$Model$Node$plainText('')
				]))));
var $author$project$RichText$Commands$firstSelectablePath = function (block) {
	var _v0 = A3(
		$author$project$RichText$Node$findForwardFromExclusive,
		F2(
			function (_v1, n) {
				return $author$project$RichText$Annotation$isSelectable(n);
			}),
		_List_Nil,
		block);
	if (_v0.$ === 1) {
		return $elm$core$Maybe$Nothing;
	} else {
		var _v2 = _v0.a;
		var p = _v2.a;
		return $elm$core$Maybe$Just(p);
	}
};
var $author$project$RichText$Node$insertAfter = F3(
	function (path, fragment, root) {
		var _v0 = A2($author$project$RichText$Node$nodeAt, path, root);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('There is no node at this path');
		} else {
			var node = _v0.a;
			if (node.$ === 1) {
				var il = node.a;
				if (fragment.$ === 1) {
					var a = fragment.a;
					var newFragment = $author$project$RichText$Node$InlineFragment(
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$cons,
								il,
								$elm$core$Array$toList(a))));
					return A3($author$project$RichText$Node$replaceWithFragment, path, newFragment, root);
				} else {
					return $elm$core$Result$Err('I cannot insert a block node fragment into an inline leaf fragment');
				}
			} else {
				var bn = node.a;
				if (!fragment.$) {
					var a = fragment.a;
					var newFragment = $author$project$RichText$Node$BlockFragment(
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$cons,
								bn,
								$elm$core$Array$toList(a))));
					return A3($author$project$RichText$Node$replaceWithFragment, path, newFragment, root);
				} else {
					return $elm$core$Result$Err('I cannot insert an inline leaf fragment fragment into a block node fragment');
				}
			}
		}
	});
var $author$project$RichText$Commands$isBlockLeaf = F2(
	function (selection, root) {
		var _v0 = A2(
			$author$project$RichText$Node$nodeAt,
			$author$project$RichText$Model$Selection$anchorNode(selection),
			root);
		if (_v0.$ === 1) {
			return false;
		} else {
			var n = _v0.a;
			if (!n.$) {
				var b = n.a;
				var _v2 = $author$project$RichText$Model$Node$childNodes(b);
				if (_v2.$ === 2) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
	});
var $author$project$RichText$Commands$insertAfterBlockLeaf = F2(
	function (blockToInsert, state) {
		var _v0 = $author$project$RichText$Model$State$selection(state);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return $elm$core$Result$Err('I cannot insert an empty paragraph unless the selection is collapsed');
			} else {
				if (!A2(
					$author$project$RichText$Commands$isBlockLeaf,
					selection,
					$author$project$RichText$Model$State$root(state))) {
					return $elm$core$Result$Err('I can only insert an element after a block leaf');
				} else {
					var _v1 = A3(
						$author$project$RichText$Node$insertAfter,
						$author$project$RichText$Model$Selection$anchorNode(selection),
						$author$project$RichText$Node$BlockFragment(
							$elm$core$Array$fromList(
								_List_fromArray(
									[blockToInsert]))),
						$author$project$RichText$Model$State$root(state));
					if (_v1.$ === 1) {
						var s = _v1.a;
						return $elm$core$Result$Err(s);
					} else {
						var newRoot = _v1.a;
						var relativeSelectablePath = A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							$author$project$RichText$Commands$firstSelectablePath(blockToInsert));
						var newAnchorPath = _Utils_ap(
							$author$project$RichText$Model$Node$increment(
								$author$project$RichText$Model$Selection$anchorNode(selection)),
							relativeSelectablePath);
						return $elm$core$Result$Ok(
							A2(
								$author$project$RichText$Model$State$state,
								newRoot,
								$elm$core$Maybe$Just(
									A2($author$project$RichText$Model$Selection$caret, newAnchorPath, 0))));
					}
				}
			}
		}
	});
var $author$project$RichText$Commands$insertNewline = F2(
	function (elements, editorState) {
		var removedRangeEditorState = A2(
			$elm$core$Result$withDefault,
			editorState,
			$author$project$RichText$Commands$removeRange(editorState));
		var _v0 = $author$project$RichText$Model$State$selection(removedRangeEditorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Invalid selection');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return $elm$core$Result$Err('I can only try to insert a newline if the selection is collapsed');
			} else {
				var _v1 = A2(
					$author$project$RichText$Node$findTextBlockNodeAncestor,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(removedRangeEditorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('No textblock node ancestor found');
				} else {
					var _v2 = _v1.a;
					var textblock = _v2.b;
					return A2(
						$elm$core$List$member,
						$author$project$RichText$Model$Element$name(
							$author$project$RichText$Model$Node$element(textblock)),
						elements) ? A2($author$project$RichText$Commands$insertText, '\n', removedRangeEditorState) : $elm$core$Result$Err('Selection is not a textblock');
				}
			}
		}
	});
var $author$project$RichText$Definitions$htmlNodeToItalic = $author$project$RichText$Config$MarkDefinition$defaultHtmlToMark('i');
var $author$project$RichText$Definitions$italicToHtmlNode = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'i', _List_Nil, children);
	});
var $author$project$RichText$Definitions$italic = $author$project$RichText$Config$MarkDefinition$markDefinition(
	{by: $author$project$RichText$Definitions$htmlNodeToItalic, bM: 'italic', cb: $author$project$RichText$Definitions$italicToHtmlNode});
var $author$project$RichText$List$findListItemAncestor = function (parameters) {
	return $author$project$RichText$Node$findAncestor(
		function (n) {
			return _Utils_eq(
				$author$project$RichText$Model$Element$name(
					$author$project$RichText$Model$Node$element(n)),
				$author$project$RichText$Model$Element$name(parameters));
		});
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$RichText$List$item = function (definition) {
	var c = definition;
	return c.aY;
};
var $author$project$RichText$List$isBeginningOfListItem = F3(
	function (definition, selection, root) {
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return false;
		} else {
			if (!(!$author$project$RichText$Model$Selection$anchorOffset(selection))) {
				return false;
			} else {
				var _v0 = A3(
					$author$project$RichText$List$findListItemAncestor,
					$author$project$RichText$List$item(definition),
					$author$project$RichText$Model$Selection$anchorNode(selection),
					root);
				if (_v0.$ === 1) {
					return false;
				} else {
					var _v1 = _v0.a;
					var p = _v1.a;
					var relativePath = A2(
						$elm$core$List$drop,
						$elm$core$List$length(p),
						$author$project$RichText$Model$Selection$anchorNode(selection));
					return A2(
						$elm$core$List$all,
						function (i) {
							return !i;
						},
						relativePath);
				}
			}
		}
	});
var $author$project$RichText$List$addLiftAnnotationAtPathAndChildren = F2(
	function (path, root) {
		var _v0 = A3($author$project$RichText$Annotation$addAtPath, $author$project$RichText$Annotation$lift, path, root);
		if (_v0.$ === 1) {
			var s = _v0.a;
			return $elm$core$Result$Err(s);
		} else {
			var newRoot = _v0.a;
			var _v1 = A2($author$project$RichText$Node$nodeAt, path, newRoot);
			if (_v1.$ === 1) {
				return $elm$core$Result$Err('Invalid path');
			} else {
				var node = _v1.a;
				if (!node.$) {
					var bn = node.a;
					var _v3 = $author$project$RichText$Model$Node$childNodes(bn);
					if (!_v3.$) {
						var ba = _v3.a;
						return A3(
							$elm$core$List$foldl,
							F2(
								function (i, result) {
									if (result.$ === 1) {
										return result;
									} else {
										var n = result.a;
										return A3(
											$author$project$RichText$Annotation$addAtPath,
											$author$project$RichText$Annotation$lift,
											_Utils_ap(
												path,
												_List_fromArray(
													[i])),
											n);
									}
								}),
							$elm$core$Result$Ok(newRoot),
							A2(
								$elm$core$List$range,
								0,
								$elm$core$Array$length(
									$author$project$RichText$Model$Node$toBlockArray(ba)) - 1));
					} else {
						return $elm$core$Result$Err('I was expecting a block array to add a lift mark to');
					}
				} else {
					return $elm$core$Result$Err('I was expecting a block node to add a lift mark to');
				}
			}
		}
	});
var $author$project$RichText$Model$Node$commonAncestor = F2(
	function (xPath, yPath) {
		if (!xPath.b) {
			return _List_Nil;
		} else {
			var x = xPath.a;
			var xs = xPath.b;
			if (!yPath.b) {
				return _List_Nil;
			} else {
				var y = yPath.a;
				var ys = yPath.b;
				return _Utils_eq(x, y) ? A2(
					$elm$core$List$cons,
					x,
					A2($author$project$RichText$Model$Node$commonAncestor, xs, ys)) : _List_Nil;
			}
		}
	});
var $elmcraft$core_extra$List$Extra$getAt = F2(
	function (idx, xs) {
		return (idx < 0) ? $elm$core$Maybe$Nothing : $elm$core$List$head(
			A2($elm$core$List$drop, idx, xs));
	});
var $author$project$RichText$List$ordered = function (definition) {
	var c = definition;
	return c.a3;
};
var $author$project$RichText$List$unordered = function (definition) {
	var c = definition;
	return c.bg;
};
var $author$project$RichText$List$isListNode = F2(
	function (definition, node) {
		if (node.$ === 1) {
			return false;
		} else {
			var bn = node.a;
			var bnName = $author$project$RichText$Model$Element$name(
				$author$project$RichText$Model$Node$element(bn));
			return _Utils_eq(
				bnName,
				$author$project$RichText$Model$Element$name(
					$author$project$RichText$List$ordered(definition))) || _Utils_eq(
				bnName,
				$author$project$RichText$Model$Element$name(
					$author$project$RichText$List$unordered(definition)));
		}
	});
var $author$project$RichText$List$addLiftMarkToListItems = F3(
	function (definition, selection, root) {
		var _v0 = A3(
			$author$project$RichText$List$findListItemAncestor,
			$author$project$RichText$List$item(definition),
			$author$project$RichText$Model$Selection$anchorNode(selection),
			root);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('There is no list item ancestor at anchor path');
		} else {
			var _v1 = _v0.a;
			var start = _v1.a;
			var _v2 = A3(
				$author$project$RichText$List$findListItemAncestor,
				$author$project$RichText$List$item(definition),
				$author$project$RichText$Model$Selection$focusNode(selection),
				root);
			if (_v2.$ === 1) {
				return $elm$core$Result$Err('There is no list item ancestor at focus path');
			} else {
				var _v3 = _v2.a;
				var end = _v3.a;
				if (_Utils_eq(start, end)) {
					return A2($author$project$RichText$List$addLiftAnnotationAtPathAndChildren, start, root);
				} else {
					var ancestor = A2($author$project$RichText$Model$Node$commonAncestor, start, end);
					var _v4 = A2($author$project$RichText$Node$nodeAt, ancestor, root);
					if (_v4.$ === 1) {
						return $elm$core$Result$Err('Invalid ancestor path');
					} else {
						var ancestorNode = _v4.a;
						if (!A2($author$project$RichText$List$isListNode, definition, ancestorNode)) {
							return $elm$core$Result$Err('I cannot lift list items unless the common ancestor is a list');
						} else {
							var _v5 = A2(
								$elmcraft$core_extra$List$Extra$getAt,
								$elm$core$List$length(ancestor),
								start);
							if (_v5.$ === 1) {
								return $elm$core$Result$Err('Invalid start index');
							} else {
								var startIndex = _v5.a;
								var _v6 = A2(
									$elmcraft$core_extra$List$Extra$getAt,
									$elm$core$List$length(ancestor),
									end);
								if (_v6.$ === 1) {
									return $elm$core$Result$Err('Invalid end index');
								} else {
									var endIndex = _v6.a;
									return A3(
										$elm$core$List$foldl,
										F2(
											function (i, result) {
												if (result.$ === 1) {
													return result;
												} else {
													var node = result.a;
													return A2(
														$author$project$RichText$List$addLiftAnnotationAtPathAndChildren,
														_Utils_ap(
															ancestor,
															_List_fromArray(
																[i])),
														node);
												}
											}),
										$elm$core$Result$Ok(root),
										A2($elm$core$List$range, startIndex, endIndex));
								}
							}
						}
					}
				}
			}
		}
	});
var $author$project$RichText$List$lift = F2(
	function (definition, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
			var _v1 = A3(
				$author$project$RichText$List$addLiftMarkToListItems,
				definition,
				normalizedSelection,
				A2(
					$author$project$RichText$Annotation$annotateSelection,
					normalizedSelection,
					$author$project$RichText$Model$State$root(editorState)));
			if (_v1.$ === 1) {
				var s = _v1.a;
				return $elm$core$Result$Err(s);
			} else {
				var markedRoot = _v1.a;
				var liftedRoot = $author$project$RichText$Annotation$doLift(
					$author$project$RichText$Annotation$doLift(markedRoot));
				var newSelection = A3(
					$author$project$RichText$Annotation$selectionFromAnnotations,
					liftedRoot,
					$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
					$author$project$RichText$Model$Selection$focusOffset(normalizedSelection));
				return $elm$core$Result$Ok(
					A2(
						$author$project$RichText$Model$State$withRoot,
						A2(
							$author$project$RichText$Annotation$clear,
							$author$project$RichText$Annotation$lift,
							$author$project$RichText$Annotation$clearSelectionAnnotations(liftedRoot)),
						A2($author$project$RichText$Model$State$withSelection, newSelection, editorState)));
			}
		}
	});
var $author$project$RichText$List$joinBackward = F2(
	function (definition, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!A3(
				$author$project$RichText$List$isBeginningOfListItem,
				definition,
				selection,
				$author$project$RichText$Model$State$root(editorState))) {
				return $elm$core$Result$Err('I can only join a list item backward if the selection is the beginning of a list item');
			} else {
				var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
				var markedRoot = A2(
					$author$project$RichText$Annotation$annotateSelection,
					normalizedSelection,
					$author$project$RichText$Model$State$root(editorState));
				var _v1 = A3(
					$author$project$RichText$List$findListItemAncestor,
					$author$project$RichText$List$item(definition),
					$author$project$RichText$Model$Selection$anchorNode(selection),
					markedRoot);
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('There is no list item selected');
				} else {
					var _v2 = _v1.a;
					var liPath = _v2.a;
					var liNode = _v2.b;
					if (_Utils_eq(
						$elmcraft$core_extra$List$Extra$last(liPath),
						$elm$core$Maybe$Just(0))) {
						return A2($author$project$RichText$List$lift, definition, editorState);
					} else {
						var prevLiPath = $author$project$RichText$Model$Node$decrement(liPath);
						var _v3 = A2($author$project$RichText$Node$nodeAt, prevLiPath, markedRoot);
						if (_v3.$ === 1) {
							return $elm$core$Result$Err('Invalid list item path');
						} else {
							var prevLiNode = _v3.a;
							if (prevLiNode.$ === 1) {
								return $elm$core$Result$Err('There is no list item at path');
							} else {
								var prevBn = prevLiNode.a;
								var _v5 = A2($author$project$RichText$Node$joinBlocks, prevBn, liNode);
								if (_v5.$ === 1) {
									return $elm$core$Result$Err('Could not join list items');
								} else {
									var joinedLi = _v5.a;
									var joinedNodes = A2(
										$elm$core$Result$andThen,
										A2(
											$author$project$RichText$Node$replaceWithFragment,
											liPath,
											$author$project$RichText$Node$BlockFragment($elm$core$Array$empty)),
										A3(
											$author$project$RichText$Node$replace,
											prevLiPath,
											$author$project$RichText$Node$Block(joinedLi),
											markedRoot));
									if (joinedNodes.$ === 1) {
										var s = joinedNodes.a;
										return $elm$core$Result$Err(s);
									} else {
										var newRoot = joinedNodes.a;
										return $elm$core$Result$Ok(
											A2(
												$author$project$RichText$Model$State$withRoot,
												$author$project$RichText$Annotation$clearSelectionAnnotations(newRoot),
												A2(
													$author$project$RichText$Model$State$withSelection,
													A3(
														$author$project$RichText$Annotation$selectionFromAnnotations,
														newRoot,
														$author$project$RichText$Model$Selection$anchorOffset(selection),
														$author$project$RichText$Model$Selection$focusOffset(selection)),
													editorState)));
									}
								}
							}
						}
					}
				}
			}
		}
	});
var $author$project$RichText$List$isEndOfListItem = F3(
	function (definition, selection, root) {
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return false;
		} else {
			var _v0 = A3(
				$author$project$RichText$List$findListItemAncestor,
				$author$project$RichText$List$item(definition),
				$author$project$RichText$Model$Selection$anchorNode(selection),
				root);
			if (_v0.$ === 1) {
				return false;
			} else {
				var _v1 = _v0.a;
				var path = _v1.a;
				var node = _v1.b;
				var _v2 = $author$project$RichText$Node$last(node);
				var lastPath = _v2.a;
				var lastNode = _v2.b;
				if (!_Utils_eq(
					$author$project$RichText$Model$Selection$anchorNode(selection),
					_Utils_ap(path, lastPath))) {
					return false;
				} else {
					if (lastNode.$ === 1) {
						var il = lastNode.a;
						if (il.$ === 1) {
							var tl = il.a;
							return _Utils_eq(
								$elm$core$String$length(
									$author$project$RichText$Model$Text$text(tl)),
								$author$project$RichText$Model$Selection$anchorOffset(selection));
						} else {
							return true;
						}
					} else {
						return true;
					}
				}
			}
		}
	});
var $author$project$RichText$List$joinForward = F2(
	function (definition, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!A3(
				$author$project$RichText$List$isEndOfListItem,
				definition,
				selection,
				$author$project$RichText$Model$State$root(editorState))) {
				return $elm$core$Result$Err('I can only join a list item forward if the selection is at the end of a list item');
			} else {
				var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
				var markedRoot = A2(
					$author$project$RichText$Annotation$annotateSelection,
					normalizedSelection,
					$author$project$RichText$Model$State$root(editorState));
				var _v1 = A3(
					$author$project$RichText$List$findListItemAncestor,
					$author$project$RichText$List$item(definition),
					$author$project$RichText$Model$Selection$anchorNode(selection),
					markedRoot);
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('There is no list item selected');
				} else {
					var _v2 = _v1.a;
					var liPath = _v2.a;
					var liNode = _v2.b;
					var nextLiPath = $author$project$RichText$Model$Node$increment(liPath);
					var _v3 = A2($author$project$RichText$Node$nodeAt, nextLiPath, markedRoot);
					if (_v3.$ === 1) {
						return $elm$core$Result$Err('I cannot join forward a list item if there is no subsequent list item');
					} else {
						var nextLi = _v3.a;
						if (nextLi.$ === 1) {
							return $elm$core$Result$Err('There is no list item at path');
						} else {
							var nextBn = nextLi.a;
							var _v5 = A2($author$project$RichText$Node$joinBlocks, liNode, nextBn);
							if (_v5.$ === 1) {
								return $elm$core$Result$Err('I could not join these list items');
							} else {
								var joinedLi = _v5.a;
								var joinedNodes = A2(
									$elm$core$Result$andThen,
									A2(
										$author$project$RichText$Node$replaceWithFragment,
										nextLiPath,
										$author$project$RichText$Node$BlockFragment($elm$core$Array$empty)),
									A3(
										$author$project$RichText$Node$replace,
										liPath,
										$author$project$RichText$Node$Block(joinedLi),
										markedRoot));
								if (joinedNodes.$ === 1) {
									var s = joinedNodes.a;
									return $elm$core$Result$Err(s);
								} else {
									var newRoot = joinedNodes.a;
									return $elm$core$Result$Ok(
										A2(
											$author$project$RichText$Model$State$withRoot,
											$author$project$RichText$Annotation$clearSelectionAnnotations(newRoot),
											A2(
												$author$project$RichText$Model$State$withSelection,
												A3(
													$author$project$RichText$Annotation$selectionFromAnnotations,
													newRoot,
													$author$project$RichText$Model$Selection$anchorOffset(selection),
													$author$project$RichText$Model$Selection$focusOffset(selection)),
												editorState)));
								}
							}
						}
					}
				}
			}
		}
	});
var $author$project$RichText$List$liftEmpty = F2(
	function (definition, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if ((!$author$project$RichText$Model$Selection$isCollapsed(selection)) || (!(!$author$project$RichText$Model$Selection$anchorOffset(selection)))) {
				return $elm$core$Result$Err('I can only lift collapsed selections at the beginning of a text node');
			} else {
				var _v1 = A3(
					$author$project$RichText$List$findListItemAncestor,
					$author$project$RichText$List$item(definition),
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('No list item ancestor to lift');
				} else {
					var _v2 = _v1.a;
					var node = _v2.b;
					var _v3 = $author$project$RichText$Model$Node$childNodes(node);
					if (!_v3.$) {
						var a = _v3.a;
						var _v4 = A2(
							$elm$core$Array$get,
							0,
							$author$project$RichText$Model$Node$toBlockArray(a));
						if (_v4.$ === 1) {
							return $elm$core$Result$Err('Cannot lift a list item with no children');
						} else {
							var firstNode = _v4.a;
							return (!$author$project$RichText$Node$isEmptyTextBlock(
								$author$project$RichText$Node$Block(firstNode))) ? $elm$core$Result$Err('I cannot lift a node that is not an empty text block') : A2($author$project$RichText$List$lift, definition, editorState);
						}
					} else {
						return $elm$core$Result$Err('I was expecting a list item to have block child nodes');
					}
				}
			}
		}
	});
var $author$project$RichText$List$split = function (definition) {
	return $author$project$RichText$Commands$splitBlock(
		$author$project$RichText$List$findListItemAncestor(
			$author$project$RichText$List$item(definition)));
};
var $author$project$RichText$List$defaultCommandMap = function (definition) {
	var deleteCommand = $author$project$RichText$List$joinForward(definition);
	var backspaceCommand = $author$project$RichText$List$joinBackward(definition);
	return A3(
		$author$project$RichText$Config$Command$set,
		_List_fromArray(
			[
				$author$project$RichText$Config$Command$inputEvent('deleteWordForward'),
				$author$project$RichText$Config$Command$key(
				_List_fromArray(
					[$author$project$RichText$Config$Keys$alt, $author$project$RichText$Config$Keys$delete]))
			]),
		_List_fromArray(
			[
				_Utils_Tuple2(
				'joinListForward',
				$author$project$RichText$Config$Command$transform(deleteCommand))
			]),
		A3(
			$author$project$RichText$Config$Command$set,
			_List_fromArray(
				[
					$author$project$RichText$Config$Command$inputEvent('deleteWordBackward'),
					$author$project$RichText$Config$Command$key(
					_List_fromArray(
						[$author$project$RichText$Config$Keys$alt, $author$project$RichText$Config$Keys$backspace]))
				]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'joinListBackward',
					$author$project$RichText$Config$Command$transform(backspaceCommand))
				]),
			A3(
				$author$project$RichText$Config$Command$set,
				_List_fromArray(
					[
						$author$project$RichText$Config$Command$inputEvent('deleteContentForward'),
						$author$project$RichText$Config$Command$key(
						_List_fromArray(
							[$author$project$RichText$Config$Keys$delete]))
					]),
				_List_fromArray(
					[
						_Utils_Tuple2(
						'joinListForward',
						$author$project$RichText$Config$Command$transform(deleteCommand))
					]),
				A3(
					$author$project$RichText$Config$Command$set,
					_List_fromArray(
						[
							$author$project$RichText$Config$Command$inputEvent('deleteContentBackward'),
							$author$project$RichText$Config$Command$key(
							_List_fromArray(
								[$author$project$RichText$Config$Keys$backspace]))
						]),
					_List_fromArray(
						[
							_Utils_Tuple2(
							'joinListBackward',
							$author$project$RichText$Config$Command$transform(backspaceCommand))
						]),
					A3(
						$author$project$RichText$Config$Command$set,
						_List_fromArray(
							[
								$author$project$RichText$Config$Command$inputEvent('insertParagraph'),
								$author$project$RichText$Config$Command$key(
								_List_fromArray(
									[$author$project$RichText$Config$Keys$enter])),
								$author$project$RichText$Config$Command$key(
								_List_fromArray(
									[$author$project$RichText$Config$Keys$return]))
							]),
						_List_fromArray(
							[
								_Utils_Tuple2(
								'liftEmptyListItem',
								$author$project$RichText$Config$Command$transform(
									$author$project$RichText$List$liftEmpty(definition))),
								_Utils_Tuple2(
								'splitListItem',
								$author$project$RichText$Config$Command$transform(
									$author$project$RichText$List$split(definition)))
							]),
						$author$project$RichText$Config$Command$emptyCommandMap)))));
};
var $author$project$RichText$List$ListDefinition = $elm$core$Basics$identity;
var $author$project$RichText$List$listDefinition = function (contents) {
	return contents;
};
var $author$project$RichText$Definitions$htmlToListItem = $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement('li');
var $author$project$RichText$Definitions$listItemToHtml = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'li', _List_Nil, children);
	});
var $author$project$RichText$Definitions$listItem = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$blockNode(
			_List_fromArray(
				['block'])),
		by: $author$project$RichText$Definitions$htmlToListItem,
		cE: 'list_item',
		bM: 'list_item',
		c0: false,
		cb: $author$project$RichText$Definitions$listItemToHtml
	});
var $author$project$RichText$Definitions$htmlToOrderedList = $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement('ol');
var $author$project$RichText$Definitions$orderedListToHtml = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'ol', _List_Nil, children);
	});
var $author$project$RichText$Definitions$orderedList = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$blockNode(
			_List_fromArray(
				['list_item'])),
		by: $author$project$RichText$Definitions$htmlToOrderedList,
		cE: 'block',
		bM: 'ordered_list',
		c0: false,
		cb: $author$project$RichText$Definitions$orderedListToHtml
	});
var $author$project$RichText$Definitions$htmlToUnorderedList = $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement('ul');
var $author$project$RichText$Definitions$unorderedListToHtml = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'ul', _List_Nil, children);
	});
var $author$project$RichText$Definitions$unorderedList = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$blockNode(
			_List_fromArray(
				['list_item'])),
		by: $author$project$RichText$Definitions$htmlToUnorderedList,
		cE: 'block',
		bM: 'unordered_list',
		c0: false,
		cb: $author$project$RichText$Definitions$unorderedListToHtml
	});
var $author$project$RichText$List$defaultListDefinition = $author$project$RichText$List$listDefinition(
	{
		aY: A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$listItem, _List_Nil),
		a3: A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$orderedList, _List_Nil),
		bg: A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$unorderedList, _List_Nil)
	});
var $author$project$Editor$listCommandBindings = $author$project$RichText$List$defaultCommandMap($author$project$RichText$List$defaultListDefinition);
var $author$project$RichText$Model$Mark$MarkOrder = $elm$core$Basics$identity;
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $author$project$RichText$Config$Spec$markDefinitions = function (spec) {
	var c = spec;
	return c.W;
};
var $author$project$RichText$Model$Mark$markOrderFromSpec = function (spec) {
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, m) {
					var md = m;
					return _Utils_Tuple2(md.bM, i);
				}),
			$author$project$RichText$Config$Spec$markDefinitions(spec)));
};
var $author$project$RichText$Commands$splitBlockHeaderToNewParagraph = F3(
	function (headerElements, paragraphElement, editorState) {
		var _v0 = $author$project$RichText$Commands$splitTextBlock(editorState);
		if (_v0.$ === 1) {
			var s = _v0.a;
			return $elm$core$Result$Err(s);
		} else {
			var splitEditorState = _v0.a;
			var _v1 = $author$project$RichText$Model$State$selection(splitEditorState);
			if (_v1.$ === 1) {
				return $elm$core$Result$Ok(splitEditorState);
			} else {
				var selection = _v1.a;
				if ((!$author$project$RichText$Model$Selection$isCollapsed(selection)) || (!(!$author$project$RichText$Model$Selection$anchorOffset(selection)))) {
					return $elm$core$Result$Ok(splitEditorState);
				} else {
					var p = A2(
						$author$project$RichText$Node$findClosestBlockPath,
						$author$project$RichText$Model$Selection$anchorNode(selection),
						$author$project$RichText$Model$State$root(splitEditorState));
					var _v2 = A2(
						$author$project$RichText$Node$nodeAt,
						p,
						$author$project$RichText$Model$State$root(splitEditorState));
					if (_v2.$ === 1) {
						return $elm$core$Result$Ok(splitEditorState);
					} else {
						var node = _v2.a;
						if (!node.$) {
							var bn = node.a;
							var parameters = $author$project$RichText$Model$Node$element(bn);
							if (A2(
								$elm$core$List$member,
								$author$project$RichText$Model$Element$name(parameters),
								headerElements) && $author$project$RichText$Node$isEmptyTextBlock(node)) {
								var _v4 = A3(
									$author$project$RichText$Node$replace,
									p,
									$author$project$RichText$Node$Block(
										A2($author$project$RichText$Model$Node$withElement, paragraphElement, bn)),
									$author$project$RichText$Model$State$root(splitEditorState));
								if (_v4.$ === 1) {
									return $elm$core$Result$Ok(splitEditorState);
								} else {
									var newRoot = _v4.a;
									return $elm$core$Result$Ok(
										A2($author$project$RichText$Model$State$withRoot, newRoot, splitEditorState));
								}
							} else {
								return $elm$core$Result$Ok(splitEditorState);
							}
						} else {
							return $elm$core$Result$Ok(splitEditorState);
						}
					}
				}
			}
		}
	});
var $author$project$RichText$Commands$hugLeft = function (state) {
	var _v0 = $author$project$RichText$Model$State$selection(state);
	if (_v0.$ === 1) {
		return state;
	} else {
		var selection = _v0.a;
		if ($author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return state;
		} else {
			var root = $author$project$RichText$Model$State$root(state);
			var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
			var anchorPath = $author$project$RichText$Model$Selection$anchorNode(normalizedSelection);
			var _v1 = A2($author$project$RichText$Node$nodeAt, anchorPath, root);
			if (_v1.$ === 1) {
				return state;
			} else {
				var n = _v1.a;
				if (n.$ === 1) {
					var il = n.a;
					if (il.$ === 1) {
						var t = il.a;
						if (_Utils_eq(
							$elm$core$String$length(
								$author$project$RichText$Model$Text$text(t)),
							$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection))) {
							var _v4 = A2(
								$author$project$RichText$Node$nodeAt,
								$author$project$RichText$Model$Node$increment(anchorPath),
								root);
							if (_v4.$ === 1) {
								return state;
							} else {
								var n2 = _v4.a;
								if (n2.$ === 1) {
									var il2 = n2.a;
									if (il2.$ === 1) {
										return A2(
											$author$project$RichText$Model$State$withSelection,
											$elm$core$Maybe$Just(
												A4(
													$author$project$RichText$Model$Selection$range,
													$author$project$RichText$Model$Node$increment(anchorPath),
													0,
													$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
													$author$project$RichText$Model$Selection$focusOffset(normalizedSelection))),
											state);
									} else {
										return state;
									}
								} else {
									return state;
								}
							}
						} else {
							return state;
						}
					} else {
						return state;
					}
				} else {
					return state;
				}
			}
		}
	}
};
var $author$project$RichText$Commands$hugRight = function (state) {
	var _v0 = $author$project$RichText$Model$State$selection(state);
	if (_v0.$ === 1) {
		return state;
	} else {
		var selection = _v0.a;
		if ($author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return state;
		} else {
			var root = $author$project$RichText$Model$State$root(state);
			var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
			var focusPath = $author$project$RichText$Model$Selection$focusNode(normalizedSelection);
			var _v1 = A2($author$project$RichText$Node$nodeAt, focusPath, root);
			if (_v1.$ === 1) {
				return state;
			} else {
				var n = _v1.a;
				if (n.$ === 1) {
					var il = n.a;
					if (il.$ === 1) {
						if (!$author$project$RichText$Model$Selection$focusOffset(normalizedSelection)) {
							var _v4 = A2(
								$author$project$RichText$Node$nodeAt,
								$author$project$RichText$Model$Node$decrement(focusPath),
								root);
							if (_v4.$ === 1) {
								return state;
							} else {
								var n2 = _v4.a;
								if (n2.$ === 1) {
									var il2 = n2.a;
									if (il2.$ === 1) {
										var t = il2.a;
										return A2(
											$author$project$RichText$Model$State$withSelection,
											$elm$core$Maybe$Just(
												A4(
													$author$project$RichText$Model$Selection$range,
													$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
													$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
													$author$project$RichText$Model$Node$decrement(focusPath),
													$elm$core$String$length(
														$author$project$RichText$Model$Text$text(t)))),
											state);
									} else {
										return state;
									}
								} else {
									return state;
								}
							}
						} else {
							return state;
						}
					} else {
						return state;
					}
				} else {
					return state;
				}
			}
		}
	}
};
var $author$project$RichText$Commands$hug = function (state) {
	return $author$project$RichText$Commands$hugRight(
		$author$project$RichText$Commands$hugLeft(state));
};
var $author$project$RichText$Model$Mark$Add = 0;
var $author$project$RichText$Model$Mark$Remove = 1;
var $author$project$RichText$Node$allRange = F4(
	function (pred, start, end, root) {
		allRange:
		while (true) {
			if (_Utils_cmp(start, end) > 0) {
				return true;
			} else {
				var _v0 = A2($author$project$RichText$Node$nodeAt, start, root);
				if (_v0.$ === 1) {
					return true;
				} else {
					var node = _v0.a;
					if (pred(node)) {
						var _v1 = A2($author$project$RichText$Node$next, start, root);
						if (_v1.$ === 1) {
							return true;
						} else {
							var _v2 = _v1.a;
							var nextPath = _v2.a;
							var $temp$pred = pred,
								$temp$start = nextPath,
								$temp$end = end,
								$temp$root = root;
							pred = $temp$pred;
							start = $temp$start;
							end = $temp$end;
							root = $temp$root;
							continue allRange;
						}
					} else {
						return false;
					}
				}
			}
		}
	});
var $author$project$RichText$Model$Mark$hasMarkWithName = F2(
	function (name_, marks) {
		return A2(
			$elm$core$List$any,
			function (m) {
				return _Utils_eq(
					name_,
					$author$project$RichText$Model$Mark$name(m));
			},
			marks);
	});
var $author$project$RichText$Commands$isBlockOrInlineNodeWithMark = F2(
	function (markName, node) {
		if (node.$ === 1) {
			var il = node.a;
			return A2(
				$author$project$RichText$Model$Mark$hasMarkWithName,
				markName,
				$author$project$RichText$Model$Node$marks(il));
		} else {
			return true;
		}
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$RichText$Model$Mark$sort = F2(
	function (order, marks) {
		var o = order;
		return A2(
			$elm$core$List$sortBy,
			function (m) {
				return _Utils_Tuple2(
					A2(
						$elm$core$Maybe$withDefault,
						-1,
						A2(
							$elm$core$Dict$get,
							$author$project$RichText$Model$Mark$name(m),
							o)),
					$author$project$RichText$Model$Mark$name(m));
			},
			marks);
	});
var $author$project$RichText$Model$Mark$toggle = F4(
	function (toggleAction, order, mark_, marks) {
		var isMember = A2(
			$elm$core$List$any,
			function (m) {
				return _Utils_eq(
					$author$project$RichText$Model$Mark$name(m),
					$author$project$RichText$Model$Mark$name(mark_));
			},
			marks);
		return ((toggleAction === 1) || ((toggleAction === 2) && isMember)) ? A2(
			$elm$core$List$filter,
			function (x) {
				return !_Utils_eq(
					$author$project$RichText$Model$Mark$name(x),
					$author$project$RichText$Model$Mark$name(mark_));
			},
			marks) : ((!isMember) ? A2(
			$author$project$RichText$Model$Mark$sort,
			order,
			A2($elm$core$List$cons, mark_, marks)) : A2(
			$elm$core$List$map,
			function (x) {
				return _Utils_eq(
					$author$project$RichText$Model$Mark$name(x),
					$author$project$RichText$Model$Mark$name(mark_)) ? mark_ : x;
			},
			marks));
	});
var $author$project$RichText$Model$InlineElement$withMarks = F2(
	function (m, iparams) {
		var c = iparams;
		return _Utils_update(
			c,
			{W: m});
	});
var $author$project$RichText$Node$toggleMark = F4(
	function (action, markOrder, mark, node) {
		if (!node.$) {
			return node;
		} else {
			var il = node.a;
			return $author$project$RichText$Node$Inline(
				function () {
					if (il.$ === 1) {
						var leaf = il.a;
						return $author$project$RichText$Model$Node$Text(
							A2(
								$author$project$RichText$Model$Text$withMarks,
								A4(
									$author$project$RichText$Model$Mark$toggle,
									action,
									markOrder,
									mark,
									$author$project$RichText$Model$Text$marks(leaf)),
								leaf));
					} else {
						var leaf = il.a;
						return $author$project$RichText$Model$Node$InlineElement(
							A2(
								$author$project$RichText$Model$InlineElement$withMarks,
								A4(
									$author$project$RichText$Model$Mark$toggle,
									action,
									markOrder,
									mark,
									$author$project$RichText$Model$InlineElement$marks(leaf)),
								leaf));
					}
				}());
		}
	});
var $author$project$RichText$Commands$toggleMarkSingleInlineNode = F4(
	function (markOrder, mark, action, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!_Utils_eq(
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$Selection$focusNode(selection))) {
				return $elm$core$Result$Err('I can only toggle a single inline node');
			} else {
				var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
				var _v1 = A2(
					$author$project$RichText$Node$nodeAt,
					$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('No node at selection');
				} else {
					var node = _v1.a;
					if (!node.$) {
						return $elm$core$Result$Err('Cannot toggle a block node');
					} else {
						var il = node.a;
						var path = (!$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection)) ? $author$project$RichText$Model$Selection$anchorNode(normalizedSelection) : $author$project$RichText$Model$Node$increment(
							$author$project$RichText$Model$Selection$anchorNode(normalizedSelection));
						var newSelection = A3(
							$author$project$RichText$Model$Selection$singleNodeRange,
							path,
							0,
							$author$project$RichText$Model$Selection$focusOffset(normalizedSelection) - $author$project$RichText$Model$Selection$anchorOffset(normalizedSelection));
						var newMarks = A4(
							$author$project$RichText$Model$Mark$toggle,
							action,
							markOrder,
							mark,
							$author$project$RichText$Model$Node$marks(il));
						var leaves = function () {
							if (!il.$) {
								var leaf = il.a;
								return _List_fromArray(
									[
										$author$project$RichText$Model$Node$InlineElement(
										A2($author$project$RichText$Model$InlineElement$withMarks, newMarks, leaf))
									]);
							} else {
								var leaf = il.a;
								if (_Utils_eq(
									$elm$core$String$length(
										$author$project$RichText$Model$Text$text(leaf)),
									$author$project$RichText$Model$Selection$focusOffset(normalizedSelection)) && (!$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection))) {
									return _List_fromArray(
										[
											$author$project$RichText$Model$Node$Text(
											A2($author$project$RichText$Model$Text$withMarks, newMarks, leaf))
										]);
								} else {
									var right = $author$project$RichText$Model$Node$Text(
										A2(
											$author$project$RichText$Model$Text$withText,
											A2(
												$elm$core$String$dropLeft,
												$author$project$RichText$Model$Selection$focusOffset(normalizedSelection),
												$author$project$RichText$Model$Text$text(leaf)),
											leaf));
									var newNode = $author$project$RichText$Model$Node$Text(
										A2(
											$author$project$RichText$Model$Text$withText,
											A3(
												$elm$core$String$slice,
												$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
												$author$project$RichText$Model$Selection$focusOffset(normalizedSelection),
												$author$project$RichText$Model$Text$text(leaf)),
											A2($author$project$RichText$Model$Text$withMarks, newMarks, leaf)));
									var left = $author$project$RichText$Model$Node$Text(
										A2(
											$author$project$RichText$Model$Text$withText,
											A2(
												$elm$core$String$left,
												$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
												$author$project$RichText$Model$Text$text(leaf)),
											leaf));
									return (!$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection)) ? _List_fromArray(
										[newNode, right]) : (_Utils_eq(
										$elm$core$String$length(
											$author$project$RichText$Model$Text$text(leaf)),
										$author$project$RichText$Model$Selection$focusOffset(normalizedSelection)) ? _List_fromArray(
										[left, newNode]) : _List_fromArray(
										[left, newNode, right]));
								}
							}
						}();
						var _v3 = A3(
							$author$project$RichText$Node$replaceWithFragment,
							$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
							$author$project$RichText$Node$InlineFragment(
								$elm$core$Array$fromList(leaves)),
							$author$project$RichText$Model$State$root(editorState));
						if (_v3.$ === 1) {
							var s = _v3.a;
							return $elm$core$Result$Err(s);
						} else {
							var newRoot = _v3.a;
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$State$withRoot,
									newRoot,
									A2(
										$author$project$RichText$Model$State$withSelection,
										$elm$core$Maybe$Just(newSelection),
										editorState)));
						}
					}
				}
			}
		}
	});
var $author$project$RichText$Commands$toggleMarkFull = F4(
	function (markOrder, mark, action, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (_Utils_eq(
				$author$project$RichText$Model$Selection$focusNode(selection),
				$author$project$RichText$Model$Selection$anchorNode(selection))) {
				return A4($author$project$RichText$Commands$toggleMarkSingleInlineNode, markOrder, mark, 2, editorState);
			} else {
				var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
				var toggleAction = (action !== 2) ? action : (A4(
					$author$project$RichText$Node$allRange,
					$author$project$RichText$Commands$isBlockOrInlineNodeWithMark(
						$author$project$RichText$Model$Mark$name(mark)),
					$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
					$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
					$author$project$RichText$Model$State$root(editorState)) ? 1 : 0);
				var incrementAnchorOffset = !(!$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection));
				var betweenRoot = function () {
					var _v4 = A2(
						$author$project$RichText$Node$next,
						$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
						$author$project$RichText$Model$State$root(editorState));
					if (_v4.$ === 1) {
						return $author$project$RichText$Model$State$root(editorState);
					} else {
						var _v5 = _v4.a;
						var afterAnchor = _v5.a;
						var _v6 = A2(
							$author$project$RichText$Node$previous,
							$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
							$author$project$RichText$Model$State$root(editorState));
						if (_v6.$ === 1) {
							return $author$project$RichText$Model$State$root(editorState);
						} else {
							var _v7 = _v6.a;
							var beforeFocus = _v7.a;
							var _v8 = A2(
								$author$project$RichText$Node$indexedMap,
								F2(
									function (path, node) {
										if ((_Utils_cmp(path, afterAnchor) < 0) || (_Utils_cmp(path, beforeFocus) > 0)) {
											return node;
										} else {
											if (!node.$) {
												return node;
											} else {
												return A4($author$project$RichText$Node$toggleMark, toggleAction, markOrder, mark, node);
											}
										}
									}),
								$author$project$RichText$Node$Block(
									$author$project$RichText$Model$State$root(editorState)));
							if (!_v8.$) {
								var bn = _v8.a;
								return bn;
							} else {
								return $author$project$RichText$Model$State$root(editorState);
							}
						}
					}
				}();
				var modifiedEndNodeEditorState = A2(
					$elm$core$Result$withDefault,
					A2($author$project$RichText$Model$State$withRoot, betweenRoot, editorState),
					A4(
						$author$project$RichText$Commands$toggleMarkSingleInlineNode,
						markOrder,
						mark,
						toggleAction,
						A2(
							$author$project$RichText$Model$State$withSelection,
							$elm$core$Maybe$Just(
								A3(
									$author$project$RichText$Model$Selection$singleNodeRange,
									$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
									0,
									$author$project$RichText$Model$Selection$focusOffset(normalizedSelection))),
							A2($author$project$RichText$Model$State$withRoot, betweenRoot, editorState))));
				var modifiedStartNodeEditorState = function () {
					var _v1 = A2(
						$author$project$RichText$Node$nodeAt,
						$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
						$author$project$RichText$Model$State$root(editorState));
					if (_v1.$ === 1) {
						return modifiedEndNodeEditorState;
					} else {
						var node = _v1.a;
						if (node.$ === 1) {
							var il = node.a;
							var focusOffset = function () {
								if (il.$ === 1) {
									var leaf = il.a;
									return $elm$core$String$length(
										$author$project$RichText$Model$Text$text(leaf));
								} else {
									return 0;
								}
							}();
							return A2(
								$elm$core$Result$withDefault,
								modifiedEndNodeEditorState,
								A4(
									$author$project$RichText$Commands$toggleMarkSingleInlineNode,
									markOrder,
									mark,
									toggleAction,
									A2(
										$author$project$RichText$Model$State$withSelection,
										$elm$core$Maybe$Just(
											A3(
												$author$project$RichText$Model$Selection$singleNodeRange,
												$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
												$author$project$RichText$Model$Selection$anchorOffset(normalizedSelection),
												focusOffset)),
										modifiedEndNodeEditorState)));
						} else {
							return modifiedEndNodeEditorState;
						}
					}
				}();
				var anchorAndFocusHaveSameParent = _Utils_eq(
					$author$project$RichText$Model$Node$parent(
						$author$project$RichText$Model$Selection$anchorNode(normalizedSelection)),
					$author$project$RichText$Model$Node$parent(
						$author$project$RichText$Model$Selection$focusNode(normalizedSelection)));
				var newSelection = A4(
					$author$project$RichText$Model$Selection$range,
					incrementAnchorOffset ? $author$project$RichText$Model$Node$increment(
						$author$project$RichText$Model$Selection$anchorNode(normalizedSelection)) : $author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
					0,
					(incrementAnchorOffset && anchorAndFocusHaveSameParent) ? $author$project$RichText$Model$Node$increment(
						$author$project$RichText$Model$Selection$focusNode(normalizedSelection)) : $author$project$RichText$Model$Selection$focusNode(normalizedSelection),
					$author$project$RichText$Model$Selection$focusOffset(normalizedSelection));
				return $elm$core$Result$Ok(
					A2(
						$author$project$RichText$Model$State$withSelection,
						$elm$core$Maybe$Just(newSelection),
						modifiedStartNodeEditorState));
			}
		}
	});
var $author$project$RichText$Commands$toggleMark = F4(
	function (markOrder, mark, action, editorState) {
		return A4(
			$author$project$RichText$Commands$toggleMarkFull,
			markOrder,
			mark,
			action,
			$author$project$RichText$Commands$hug(editorState));
	});
var $author$project$Editor$commandBindings = function (spec) {
	var markOrder = $author$project$RichText$Model$Mark$markOrderFromSpec(spec);
	return A2(
		$author$project$RichText$Config$Command$combine,
		$author$project$Editor$listCommandBindings,
		A3(
			$author$project$RichText$Config$Command$set,
			_List_fromArray(
				[
					$author$project$RichText$Config$Command$inputEvent('formatItalic'),
					$author$project$RichText$Config$Command$key(
					_List_fromArray(
						[$author$project$RichText$Config$Keys$short, 'i']))
				]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'toggleStyle',
					$author$project$RichText$Config$Command$transform(
						A3(
							$author$project$RichText$Commands$toggleMark,
							markOrder,
							A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$italic, _List_Nil),
							2)))
				]),
			A3(
				$author$project$RichText$Config$Command$set,
				_List_fromArray(
					[
						$author$project$RichText$Config$Command$inputEvent('formatBold'),
						$author$project$RichText$Config$Command$key(
						_List_fromArray(
							[$author$project$RichText$Config$Keys$short, 'b']))
					]),
				_List_fromArray(
					[
						_Utils_Tuple2(
						'toggleStyle',
						$author$project$RichText$Config$Command$transform(
							A3(
								$author$project$RichText$Commands$toggleMark,
								markOrder,
								A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$bold, _List_Nil),
								2)))
					]),
				A3(
					$author$project$RichText$Config$Command$set,
					_List_fromArray(
						[
							$author$project$RichText$Config$Command$inputEvent('insertParagraph'),
							$author$project$RichText$Config$Command$key(
							_List_fromArray(
								[$author$project$RichText$Config$Keys$enter])),
							$author$project$RichText$Config$Command$key(
							_List_fromArray(
								[$author$project$RichText$Config$Keys$return]))
						]),
					_List_fromArray(
						[
							_Utils_Tuple2(
							'insertNewline',
							$author$project$RichText$Config$Command$transform(
								$author$project$RichText$Commands$insertNewline(
									_List_fromArray(
										['code_block'])))),
							_Utils_Tuple2(
							'liftEmpty',
							$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$liftEmpty)),
							_Utils_Tuple2(
							'splitBlockHeaderToNewParagraph',
							$author$project$RichText$Config$Command$transform(
								A2(
									$author$project$RichText$Commands$splitBlockHeaderToNewParagraph,
									_List_fromArray(
										['heading']),
									A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil)))),
							_Utils_Tuple2(
							'insertEmptyParagraph',
							$author$project$RichText$Config$Command$transform(
								$author$project$RichText$Commands$insertAfterBlockLeaf($author$project$Editor$emptyParagraph)))
						]),
					$author$project$RichText$Commands$defaultCommandMap))));
};
var $author$project$RichText$Editor$Config = $elm$core$Basics$identity;
var $author$project$RichText$Editor$config = function (cfg) {
	return cfg;
};
var $author$project$RichText$Config$Decorations$elementDecorations = function (d) {
	var c = d;
	return c.aD;
};
var $author$project$RichText$Config$ElementDefinition$name = function (definition_) {
	var c = definition_;
	return c.bM;
};
var $author$project$RichText$Config$Decorations$Decorations = $elm$core$Basics$identity;
var $author$project$RichText$Config$Decorations$withElementDecorations = F2(
	function (elements, d) {
		var c = d;
		return _Utils_update(
			c,
			{aD: elements});
	});
var $author$project$RichText$Config$Decorations$addElementDecoration = F3(
	function (definition, decorator, decorations) {
		var name = $author$project$RichText$Config$ElementDefinition$name(definition);
		var eleDecorators = $author$project$RichText$Config$Decorations$elementDecorations(decorations);
		var previousDecorations = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2($elm$core$Dict$get, name, eleDecorators));
		return A2(
			$author$project$RichText$Config$Decorations$withElementDecorations,
			A3(
				$elm$core$Dict$insert,
				name,
				A2($elm$core$List$cons, decorator, previousDecorations),
				eleDecorators),
			decorations);
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $author$project$RichText$Config$Decorations$emptyDecorations = {aD: $elm$core$Dict$empty, W: $elm$core$Dict$empty, aQ: _List_Nil};
var $author$project$RichText$Definitions$horizontalRuleToHtml = $author$project$RichText$Config$ElementDefinition$defaultElementToHtml('hr');
var $author$project$RichText$Definitions$htmlToHorizontalRule = F2(
	function (def, node) {
		if (!node.$) {
			var name = node.a;
			return (name === 'hr') ? $elm$core$Maybe$Just(
				_Utils_Tuple2(
					A2(
						$author$project$RichText$Model$Element$withAnnotations,
						$elm$core$Set$fromList(
							_List_fromArray(
								[$author$project$RichText$Annotation$selectable])),
						A2($author$project$RichText$Model$Element$element, def, _List_Nil)),
					$elm$core$Array$empty)) : $elm$core$Maybe$Nothing;
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$horizontalRule = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{ct: $author$project$RichText$Config$ElementDefinition$blockLeaf, by: $author$project$RichText$Definitions$htmlToHorizontalRule, cE: 'block', bM: 'horizontal_rule', c0: true, cb: $author$project$RichText$Definitions$horizontalRuleToHtml});
var $author$project$RichText$Definitions$htmlNodeToImage = F2(
	function (def, node) {
		if (!node.$) {
			var name = node.a;
			var attributes = node.b;
			if (name === 'img') {
				var elementNodeAttributes = A2(
					$elm$core$List$filterMap,
					function (_v1) {
						var k = _v1.a;
						var v = _v1.b;
						switch (k) {
							case 'src':
								return $elm$core$Maybe$Just(
									A2($author$project$RichText$Model$Attribute$StringAttribute, 'src', v));
							case 'alt':
								return $elm$core$Maybe$Just(
									A2($author$project$RichText$Model$Attribute$StringAttribute, 'alt', v));
							case 'title':
								return $elm$core$Maybe$Just(
									A2($author$project$RichText$Model$Attribute$StringAttribute, 'title', v));
							default:
								return $elm$core$Maybe$Nothing;
						}
					},
					attributes);
				return (!_Utils_eq(
					A2($author$project$RichText$Model$Attribute$findStringAttribute, 'src', elementNodeAttributes),
					$elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(
						A2(
							$author$project$RichText$Model$Element$withAnnotations,
							$elm$core$Set$singleton($author$project$RichText$Annotation$selectable),
							A2($author$project$RichText$Model$Element$element, def, elementNodeAttributes)),
						$elm$core$Array$empty)) : $elm$core$Maybe$Nothing;
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$filterAttributesToHtml = function (attrs) {
	return A2(
		$elm$core$List$filterMap,
		function (_v0) {
			var p = _v0.a;
			var v = _v0.b;
			if (v.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var tv = v.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(p, tv));
			}
		},
		attrs);
};
var $author$project$RichText$Definitions$imageToHtmlNode = F2(
	function (parameters, _v0) {
		var attr = $author$project$RichText$Definitions$filterAttributesToHtml(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'src',
					$elm$core$Maybe$Just(
						A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$author$project$RichText$Model$Attribute$findStringAttribute,
								'src',
								$author$project$RichText$Model$Element$attributes(parameters))))),
					_Utils_Tuple2(
					'alt',
					A2(
						$author$project$RichText$Model$Attribute$findStringAttribute,
						'alt',
						$author$project$RichText$Model$Element$attributes(parameters))),
					_Utils_Tuple2(
					'title',
					A2(
						$author$project$RichText$Model$Attribute$findStringAttribute,
						'title',
						$author$project$RichText$Model$Element$attributes(parameters)))
				]));
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'img', attr, $elm$core$Array$empty);
	});
var $author$project$RichText$Definitions$image = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{ct: $author$project$RichText$Config$ElementDefinition$inlineLeaf, by: $author$project$RichText$Definitions$htmlNodeToImage, cE: 'inline', bM: 'image', c0: true, cb: $author$project$RichText$Definitions$imageToHtmlNode});
var $author$project$RichText$Internal$Editor$SelectionEvent = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$RichText$Config$Decorations$selectableDecoration = F4(
	function (tagger, editorNodePath, elementParameters, _v0) {
		return _Utils_ap(
			A2(
				$elm$core$Set$member,
				$author$project$RichText$Internal$Constants$selection,
				$author$project$RichText$Model$Element$annotations(elementParameters)) ? _List_fromArray(
				[
					$elm$html$Html$Attributes$class('rte-selected')
				]) : _List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$Events$onClick(
					tagger(
						A2(
							$author$project$RichText$Internal$Editor$SelectionEvent,
							$elm$core$Maybe$Just(
								A2($author$project$RichText$Model$Selection$caret, editorNodePath, 0)),
							false)))
				]));
	});
var $author$project$RichText$Config$Decorations$withTopLevelAttributes = F2(
	function (topLevelAttributes_, d) {
		var c = d;
		return _Utils_update(
			c,
			{aQ: topLevelAttributes_});
	});
var $author$project$Editor$decorations = A2(
	$author$project$RichText$Config$Decorations$withTopLevelAttributes,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$attribute, 'data-gramm_editor', 'false')
		]),
	A3(
		$author$project$RichText$Config$Decorations$addElementDecoration,
		$author$project$RichText$Definitions$horizontalRule,
		$author$project$RichText$Config$Decorations$selectableDecoration($author$project$Controls$InternalMsg),
		A3(
			$author$project$RichText$Config$Decorations$addElementDecoration,
			$author$project$RichText$Definitions$image,
			$author$project$RichText$Config$Decorations$selectableDecoration($author$project$Controls$InternalMsg),
			$author$project$RichText$Config$Decorations$emptyDecorations)));
var $author$project$RichText$Definitions$blockquoteToHtml = $author$project$RichText$Config$ElementDefinition$defaultElementToHtml('blockquote');
var $author$project$RichText$Definitions$htmlToBlockquote = $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement('blockquote');
var $author$project$RichText$Definitions$blockquote = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$blockNode(
			_List_fromArray(
				['block'])),
		by: $author$project$RichText$Definitions$htmlToBlockquote,
		cE: 'block',
		bM: 'blockquote',
		c0: false,
		cb: $author$project$RichText$Definitions$blockquoteToHtml
	});
var $author$project$RichText$Definitions$codeBlockToHtmlNode = F2(
	function (_v0, children) {
		return A3(
			$author$project$RichText$Model$HtmlNode$ElementNode,
			'pre',
			_List_Nil,
			$elm$core$Array$fromList(
				_List_fromArray(
					[
						A3($author$project$RichText$Model$HtmlNode$ElementNode, 'code', _List_Nil, children)
					])));
	});
var $author$project$RichText$Definitions$htmlNodeToCodeBlock = F2(
	function (def, node) {
		if (!node.$) {
			var name = node.a;
			var children = node.c;
			if ((name === 'pre') && ($elm$core$Array$length(children) === 1)) {
				var _v1 = A2($elm$core$Array$get, 0, children);
				if (_v1.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var n = _v1.a;
					if (!n.$) {
						var childChildren = n.c;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(
								A2($author$project$RichText$Model$Element$element, def, _List_Nil),
								childChildren));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$codeBlock = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$textBlock(
			{
				ci: _List_fromArray(
					['text']),
				cj: _List_fromArray(
					['__nothing__'])
			}),
		by: $author$project$RichText$Definitions$htmlNodeToCodeBlock,
		cE: 'block',
		bM: 'code_block',
		c0: false,
		cb: $author$project$RichText$Definitions$codeBlockToHtmlNode
	});
var $author$project$RichText$Config$Spec$Spec = $elm$core$Basics$identity;
var $author$project$RichText$Config$Spec$emptySpec = {aD: _List_Nil, W: _List_Nil, aJ: $elm$core$Dict$empty, aK: $elm$core$Dict$empty};
var $author$project$RichText$Definitions$headingToHtml = F2(
	function (parameters, children) {
		var level = A2(
			$elm$core$Maybe$withDefault,
			1,
			A2(
				$author$project$RichText$Model$Attribute$findIntegerAttribute,
				'level',
				$author$project$RichText$Model$Element$attributes(parameters)));
		return A3(
			$author$project$RichText$Model$HtmlNode$ElementNode,
			'h' + $elm$core$String$fromInt(level),
			_List_Nil,
			children);
	});
var $author$project$RichText$Model$Attribute$IntegerAttribute = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$RichText$Definitions$htmlToHeading = F2(
	function (def, node) {
		if (!node.$) {
			var name = node.a;
			var children = node.c;
			var maybeLevel = function () {
				switch (name) {
					case 'h1':
						return $elm$core$Maybe$Just(1);
					case 'h2':
						return $elm$core$Maybe$Just(2);
					case 'h3':
						return $elm$core$Maybe$Just(3);
					case 'h4':
						return $elm$core$Maybe$Just(4);
					case 'h5':
						return $elm$core$Maybe$Just(5);
					case 'h6':
						return $elm$core$Maybe$Just(6);
					default:
						return $elm$core$Maybe$Nothing;
				}
			}();
			if (maybeLevel.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var level = maybeLevel.a;
				return $elm$core$Maybe$Just(
					_Utils_Tuple2(
						A2(
							$author$project$RichText$Model$Element$element,
							def,
							_List_fromArray(
								[
									A2($author$project$RichText$Model$Attribute$IntegerAttribute, 'level', level)
								])),
						children));
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$heading = $author$project$RichText$Config$ElementDefinition$elementDefinition(
	{
		ct: $author$project$RichText$Config$ElementDefinition$textBlock(
			{
				ci: _List_fromArray(
					['inline']),
				cj: _List_Nil
			}),
		by: $author$project$RichText$Definitions$htmlToHeading,
		cE: 'block',
		bM: 'heading',
		c0: false,
		cb: $author$project$RichText$Definitions$headingToHtml
	});
var $author$project$RichText$Definitions$htmlNodeToLink = F2(
	function (def, node) {
		if (!node.$) {
			var name = node.a;
			var attributes = node.b;
			var children = node.c;
			if (name === 'a') {
				var elementNodeAttributes = A2(
					$elm$core$List$filterMap,
					function (_v1) {
						var k = _v1.a;
						var v = _v1.b;
						switch (k) {
							case 'href':
								return $elm$core$Maybe$Just(
									A2($author$project$RichText$Model$Attribute$StringAttribute, 'href', v));
							case 'title':
								return $elm$core$Maybe$Just(
									A2($author$project$RichText$Model$Attribute$StringAttribute, 'title', v));
							default:
								return $elm$core$Maybe$Nothing;
						}
					},
					attributes);
				return (!_Utils_eq(
					A2($author$project$RichText$Model$Attribute$findStringAttribute, 'href', elementNodeAttributes),
					$elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
					_Utils_Tuple2(
						A2($author$project$RichText$Model$Mark$mark, def, elementNodeAttributes),
						children)) : $elm$core$Maybe$Nothing;
			} else {
				return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Definitions$linkToHtmlNode = F2(
	function (mark, children) {
		var attributes = $author$project$RichText$Definitions$filterAttributesToHtml(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'href',
					$elm$core$Maybe$Just(
						A2(
							$elm$core$Maybe$withDefault,
							'',
							A2(
								$author$project$RichText$Model$Attribute$findStringAttribute,
								'href',
								$author$project$RichText$Model$Mark$attributes(mark))))),
					_Utils_Tuple2(
					'title',
					A2(
						$author$project$RichText$Model$Attribute$findStringAttribute,
						'title',
						$author$project$RichText$Model$Mark$attributes(mark)))
				]));
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'a', attributes, children);
	});
var $author$project$RichText$Definitions$link = $author$project$RichText$Config$MarkDefinition$markDefinition(
	{by: $author$project$RichText$Definitions$htmlNodeToLink, bM: 'link', cb: $author$project$RichText$Definitions$linkToHtmlNode});
var $author$project$RichText$Config$Spec$withElementDefinitions = F2(
	function (nodes, spec) {
		var c = spec;
		return _Utils_update(
			c,
			{
				aD: nodes,
				aJ: $elm$core$Dict$fromList(
					A2(
						$elm$core$List$map,
						function (x) {
							var m = x;
							return _Utils_Tuple2(m.bM, x);
						},
						nodes))
			});
	});
var $author$project$RichText$Config$Spec$withMarkDefinitions = F2(
	function (marks, spec) {
		var c = spec;
		return _Utils_update(
			c,
			{
				W: marks,
				aK: $elm$core$Dict$fromList(
					A2(
						$elm$core$List$map,
						function (x) {
							var m = x;
							return _Utils_Tuple2(m.bM, x);
						},
						marks))
			});
	});
var $author$project$RichText$Definitions$markdown = A2(
	$author$project$RichText$Config$Spec$withMarkDefinitions,
	_List_fromArray(
		[$author$project$RichText$Definitions$link, $author$project$RichText$Definitions$bold, $author$project$RichText$Definitions$italic, $author$project$RichText$Definitions$code]),
	A2(
		$author$project$RichText$Config$Spec$withElementDefinitions,
		_List_fromArray(
			[$author$project$RichText$Definitions$doc, $author$project$RichText$Definitions$paragraph, $author$project$RichText$Definitions$blockquote, $author$project$RichText$Definitions$horizontalRule, $author$project$RichText$Definitions$heading, $author$project$RichText$Definitions$codeBlock, $author$project$RichText$Definitions$image, $author$project$RichText$Definitions$hardBreak, $author$project$RichText$Definitions$unorderedList, $author$project$RichText$Definitions$orderedList, $author$project$RichText$Definitions$listItem]),
		$author$project$RichText$Config$Spec$emptySpec));
var $author$project$Page$Basic$config = $author$project$RichText$Editor$config(
	{
		cr: $author$project$Editor$commandBindings($author$project$RichText$Definitions$markdown),
		cx: $author$project$Editor$decorations,
		c4: $author$project$RichText$Definitions$markdown,
		c7: $author$project$Controls$InternalMsg
	});
var $author$project$RichText$Internal$History$contents = function (history) {
	var c = history;
	return c;
};
var $author$project$RichText$Internal$History$fromContents = function (c) {
	return c;
};
var $author$project$RichText$Internal$Editor$history = function (e) {
	var c = e;
	return c.aH;
};
var $author$project$RichText$Internal$Editor$incrementChangeCount = function (e) {
	var c = e;
	return _Utils_update(
		c,
		{ai: c.ai + 1});
};
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $folkertdev$elm_deque$Internal$rebalance = function (deque) {
	var sizeF = deque.p;
	var sizeR = deque.q;
	var front = deque.t;
	var rear = deque.u;
	var size1 = ((sizeF + sizeR) / 2) | 0;
	var size2 = (sizeF + sizeR) - size1;
	var balanceConstant = 4;
	if ((sizeF + sizeR) < 2) {
		return deque;
	} else {
		if (_Utils_cmp(sizeF, (balanceConstant * sizeR) + 1) > 0) {
			var newRear = _Utils_ap(
				rear,
				$elm$core$List$reverse(
					A2($elm$core$List$drop, size1, front)));
			var newFront = A2($elm$core$List$take, size1, front);
			return {t: newFront, u: newRear, p: size1, q: size2};
		} else {
			if (_Utils_cmp(sizeR, (balanceConstant * sizeF) + 1) > 0) {
				var newRear = A2($elm$core$List$take, size1, rear);
				var newFront = _Utils_ap(
					front,
					$elm$core$List$reverse(
						A2($elm$core$List$drop, size1, rear)));
				return {t: newFront, u: newRear, p: size1, q: size2};
			} else {
				return deque;
			}
		}
	}
};
var $folkertdev$elm_deque$Internal$popBack = function (deque) {
	var front = deque.t;
	var rear = deque.u;
	var _v0 = _Utils_Tuple2(front, rear);
	if (!_v0.b.b) {
		if (!_v0.a.b) {
			return _Utils_Tuple2($elm$core$Maybe$Nothing, $folkertdev$elm_deque$Internal$empty);
		} else {
			if (!_v0.a.b.b) {
				var _v1 = _v0.a;
				var x = _v1.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(x),
					$folkertdev$elm_deque$Internal$empty);
			} else {
				return _Utils_Tuple2($elm$core$Maybe$Nothing, $folkertdev$elm_deque$Internal$empty);
			}
		}
	} else {
		var _v2 = _v0.b;
		var r = _v2.a;
		var rs = _v2.b;
		return _Utils_Tuple2(
			$elm$core$Maybe$Just(r),
			$folkertdev$elm_deque$Internal$rebalance(
				{t: deque.t, u: rs, p: deque.p, q: deque.q - 1}));
	}
};
var $folkertdev$elm_deque$BoundedDeque$popBack = function (_v0) {
	var deque = _v0.a;
	var maxSize = _v0.b;
	return A2(
		$elm$core$Tuple$mapSecond,
		function (newDeque) {
			return A2($folkertdev$elm_deque$BoundedDeque$BoundedDeque, newDeque, maxSize);
		},
		$folkertdev$elm_deque$Internal$popBack(deque));
};
var $folkertdev$elm_deque$BoundedDeque$reachedMaxSize = function (_v0) {
	var sizeF = _v0.a.p;
	var sizeR = _v0.a.q;
	var maxSize = _v0.b;
	return _Utils_eq(sizeF + sizeR, maxSize);
};
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $folkertdev$elm_deque$BoundedDeque$pushFront = F2(
	function (elem, deque) {
		var maxSize = deque.b;
		if (!maxSize) {
			return deque;
		} else {
			var _v0 = $folkertdev$elm_deque$BoundedDeque$reachedMaxSize(deque) ? $folkertdev$elm_deque$BoundedDeque$popBack(deque).b : deque;
			var newDeque = _v0.a;
			var newMaxSize = _v0.b;
			var newerDeque = {
				t: A2($elm$core$List$cons, elem, newDeque.t),
				u: newDeque.u,
				p: newDeque.p + 1,
				q: newDeque.q
			};
			return A2(
				$folkertdev$elm_deque$BoundedDeque$BoundedDeque,
				$folkertdev$elm_deque$Internal$rebalance(newerDeque),
				newMaxSize);
		}
	});
var $author$project$RichText$Internal$Editor$state = function (e) {
	var c = e;
	return c.aO;
};
var $author$project$RichText$Internal$Editor$withHistory = F2(
	function (h, e) {
		var c = e;
		return _Utils_update(
			c,
			{aH: h});
	});
var $author$project$RichText$Internal$Editor$withState = F2(
	function (s, e) {
		var c = e;
		return _Utils_update(
			c,
			{aO: s});
	});
var $author$project$RichText$Internal$Editor$handleRedo = function (editor_) {
	var editorHistory = $author$project$RichText$Internal$History$contents(
		$author$project$RichText$Internal$Editor$history(editor_));
	var _v0 = editorHistory.am;
	if (!_v0.b) {
		return $elm$core$Result$Err('There are no states on the redo stack');
	} else {
		var newState = _v0.a;
		var xs = _v0.b;
		var newHistory = _Utils_update(
			editorHistory,
			{
				am: xs,
				E: A2(
					$folkertdev$elm_deque$BoundedDeque$pushFront,
					_Utils_Tuple2(
						'redo',
						$author$project$RichText$Internal$Editor$state(editor_)),
					editorHistory.E)
			});
		return $elm$core$Result$Ok(
			$author$project$RichText$Internal$Editor$incrementChangeCount(
				A2(
					$author$project$RichText$Internal$Editor$withHistory,
					$author$project$RichText$Internal$History$fromContents(newHistory),
					A2($author$project$RichText$Internal$Editor$withState, newState, editor_))));
	}
};
var $folkertdev$elm_deque$Internal$popFront = function (deque) {
	var front = deque.t;
	var rear = deque.u;
	var _v0 = _Utils_Tuple2(front, rear);
	if (!_v0.a.b) {
		if (!_v0.b.b) {
			return _Utils_Tuple2($elm$core$Maybe$Nothing, $folkertdev$elm_deque$Internal$empty);
		} else {
			if (!_v0.b.b.b) {
				var _v1 = _v0.b;
				var x = _v1.a;
				return _Utils_Tuple2(
					$elm$core$Maybe$Just(x),
					$folkertdev$elm_deque$Internal$empty);
			} else {
				return _Utils_Tuple2($elm$core$Maybe$Nothing, $folkertdev$elm_deque$Internal$empty);
			}
		}
	} else {
		var _v2 = _v0.a;
		var f = _v2.a;
		var fs = _v2.b;
		return _Utils_Tuple2(
			$elm$core$Maybe$Just(f),
			$folkertdev$elm_deque$Internal$rebalance(
				{t: fs, u: deque.u, p: deque.p - 1, q: deque.q}));
	}
};
var $folkertdev$elm_deque$BoundedDeque$popFront = function (_v0) {
	var deque = _v0.a;
	var maxSize = _v0.b;
	return A2(
		$elm$core$Tuple$mapSecond,
		function (newDeque) {
			return A2($folkertdev$elm_deque$BoundedDeque$BoundedDeque, newDeque, maxSize);
		},
		$folkertdev$elm_deque$Internal$popFront(deque));
};
var $author$project$RichText$Internal$Editor$findNextState = F2(
	function (editorState, undoDeque) {
		findNextState:
		while (true) {
			var _v0 = $folkertdev$elm_deque$BoundedDeque$popFront(undoDeque);
			var maybeState = _v0.a;
			var rest = _v0.b;
			if (maybeState.$ === 1) {
				return _Utils_Tuple2($elm$core$Maybe$Nothing, rest);
			} else {
				var _v2 = maybeState.a;
				var state_ = _v2.b;
				if (!_Utils_eq(state_, editorState)) {
					return _Utils_Tuple2(
						$elm$core$Maybe$Just(state_),
						rest);
				} else {
					var $temp$editorState = editorState,
						$temp$undoDeque = rest;
					editorState = $temp$editorState;
					undoDeque = $temp$undoDeque;
					continue findNextState;
				}
			}
		}
	});
var $author$project$RichText$Internal$Editor$handleUndo = function (editor_) {
	var editorState = $author$project$RichText$Internal$Editor$state(editor_);
	var editorHistory = $author$project$RichText$Internal$History$contents(
		$author$project$RichText$Internal$Editor$history(editor_));
	var _v0 = A2($author$project$RichText$Internal$Editor$findNextState, editorState, editorHistory.E);
	var maybeState = _v0.a;
	var newUndoDeque = _v0.b;
	if (maybeState.$ === 1) {
		return editor_;
	} else {
		var newState = maybeState.a;
		var newHistory = _Utils_update(
			editorHistory,
			{
				aZ: 0,
				am: A2($elm$core$List$cons, editorState, editorHistory.am),
				E: newUndoDeque
			});
		return $author$project$RichText$Internal$Editor$incrementChangeCount(
			A2(
				$author$project$RichText$Internal$Editor$withHistory,
				$author$project$RichText$Internal$History$fromContents(newHistory),
				A2($author$project$RichText$Internal$Editor$withState, newState, editor_)));
	}
};
var $author$project$RichText$Internal$Editor$applyInternalCommand = F2(
	function (action, editor_) {
		if (!action) {
			return $elm$core$Result$Ok(
				$author$project$RichText$Internal$Editor$handleUndo(editor_));
		} else {
			return $author$project$RichText$Internal$Editor$handleRedo(editor_);
		}
	});
var $author$project$RichText$Internal$Editor$forceReselection = function (e) {
	var c = e;
	return _Utils_update(
		c,
		{ap: c.ap + 1});
};
var $author$project$RichText$State$mergeSimilarInlineLeaves = function (inlineLeaves) {
	mergeSimilarInlineLeaves:
	while (true) {
		if (!inlineLeaves.b) {
			return inlineLeaves;
		} else {
			if (!inlineLeaves.b.b) {
				return inlineLeaves;
			} else {
				var x = inlineLeaves.a;
				var _v1 = inlineLeaves.b;
				var y = _v1.a;
				var xs = _v1.b;
				if (x.$ === 1) {
					var xL = x.a;
					if (y.$ === 1) {
						var yL = y.a;
						if (_Utils_eq(
							$author$project$RichText$Model$Text$marks(xL),
							$author$project$RichText$Model$Text$marks(yL))) {
							var $temp$inlineLeaves = A2(
								$elm$core$List$cons,
								$author$project$RichText$Model$Node$Text(
									A2(
										$author$project$RichText$Model$Text$withText,
										_Utils_ap(
											$author$project$RichText$Model$Text$text(xL),
											$author$project$RichText$Model$Text$text(yL)),
										xL)),
								xs);
							inlineLeaves = $temp$inlineLeaves;
							continue mergeSimilarInlineLeaves;
						} else {
							return A2(
								$elm$core$List$cons,
								x,
								$author$project$RichText$State$mergeSimilarInlineLeaves(
									A2($elm$core$List$cons, y, xs)));
						}
					} else {
						return A2(
							$elm$core$List$cons,
							x,
							$author$project$RichText$State$mergeSimilarInlineLeaves(
								A2($elm$core$List$cons, y, xs)));
					}
				} else {
					return A2(
						$elm$core$List$cons,
						x,
						$author$project$RichText$State$mergeSimilarInlineLeaves(
							A2($elm$core$List$cons, y, xs)));
				}
			}
		}
	}
};
var $author$project$RichText$State$removeExtraEmptyTextLeaves = function (inlineLeaves) {
	removeExtraEmptyTextLeaves:
	while (true) {
		if (!inlineLeaves.b) {
			return inlineLeaves;
		} else {
			if (!inlineLeaves.b.b) {
				return inlineLeaves;
			} else {
				var x = inlineLeaves.a;
				var _v1 = inlineLeaves.b;
				var y = _v1.a;
				var xs = _v1.b;
				if (x.$ === 1) {
					var xL = x.a;
					if (y.$ === 1) {
						var yL = y.a;
						if ($elm$core$String$isEmpty(
							$author$project$RichText$Model$Text$text(xL)) && (!A2(
							$elm$core$Set$member,
							$author$project$RichText$Annotation$selection,
							$author$project$RichText$Model$Text$annotations(xL)))) {
							var $temp$inlineLeaves = A2($elm$core$List$cons, y, xs);
							inlineLeaves = $temp$inlineLeaves;
							continue removeExtraEmptyTextLeaves;
						} else {
							if ($elm$core$String$isEmpty(
								$author$project$RichText$Model$Text$text(yL)) && (!A2(
								$elm$core$Set$member,
								$author$project$RichText$Annotation$selection,
								$author$project$RichText$Model$Text$annotations(yL)))) {
								var $temp$inlineLeaves = A2($elm$core$List$cons, x, xs);
								inlineLeaves = $temp$inlineLeaves;
								continue removeExtraEmptyTextLeaves;
							} else {
								return A2(
									$elm$core$List$cons,
									x,
									$author$project$RichText$State$removeExtraEmptyTextLeaves(
										A2($elm$core$List$cons, y, xs)));
							}
						}
					} else {
						return A2(
							$elm$core$List$cons,
							x,
							$author$project$RichText$State$removeExtraEmptyTextLeaves(
								A2($elm$core$List$cons, y, xs)));
					}
				} else {
					return A2(
						$elm$core$List$cons,
						x,
						$author$project$RichText$State$removeExtraEmptyTextLeaves(
							A2($elm$core$List$cons, y, xs)));
				}
			}
		}
	}
};
var $author$project$RichText$State$reduceNode = function (node) {
	var _v0 = A2(
		$author$project$RichText$Node$map,
		function (x) {
			if (!x.$) {
				var bn = x.a;
				var _v2 = $author$project$RichText$Model$Node$childNodes(bn);
				if (_v2.$ === 1) {
					var a = _v2.a;
					return $author$project$RichText$Node$Block(
						A2(
							$author$project$RichText$Model$Node$withChildNodes,
							$author$project$RichText$Model$Node$inlineChildren(
								$elm$core$Array$fromList(
									$author$project$RichText$State$mergeSimilarInlineLeaves(
										$author$project$RichText$State$removeExtraEmptyTextLeaves(
											$elm$core$Array$toList(
												$author$project$RichText$Model$Node$toInlineArray(a)))))),
							bn));
				} else {
					return x;
				}
			} else {
				return x;
			}
		},
		$author$project$RichText$Node$Block(node));
	if (!_v0.$) {
		var newNode = _v0.a;
		return newNode;
	} else {
		return node;
	}
};
var $author$project$RichText$State$childOffset = F2(
	function (leaves, offset) {
		var _v0 = A3(
			$elm$core$Array$foldl,
			F2(
				function (l, _v1) {
					var i = _v1.a;
					var accOffset = _v1.b;
					var done = _v1.c;
					if (done) {
						return _Utils_Tuple3(i, accOffset, done);
					} else {
						if (accOffset <= 0) {
							return _Utils_Tuple3(i, accOffset, true);
						} else {
							if (l.$ === 1) {
								var tl = l.a;
								return (_Utils_cmp(
									accOffset,
									$elm$core$String$length(
										$author$project$RichText$Model$Text$text(tl))) < 1) ? _Utils_Tuple3(i, accOffset, true) : _Utils_Tuple3(
									i + 1,
									accOffset - $elm$core$String$length(
										$author$project$RichText$Model$Text$text(tl)),
									false);
							} else {
								return _Utils_Tuple3(i + 1, accOffset - 1, false);
							}
						}
					}
				}),
			_Utils_Tuple3(0, offset, false),
			leaves);
		var newIndex = _v0.a;
		var newOffset = _v0.b;
		return _Utils_Tuple2(newIndex, newOffset);
	});
var $author$project$RichText$State$parentOffset = F3(
	function (leaves, index, offset) {
		var _v0 = A3(
			$elm$core$Array$foldl,
			F2(
				function (l, _v1) {
					var i = _v1.a;
					var accOffset = _v1.b;
					if (l.$ === 1) {
						var tl = l.a;
						return _Utils_Tuple2(
							i + 1,
							(_Utils_cmp(i, index) < 0) ? (accOffset + $elm$core$String$length(
								$author$project$RichText$Model$Text$text(tl))) : accOffset);
					} else {
						return _Utils_Tuple2(
							i + 1,
							(_Utils_cmp(i, index) < 0) ? (accOffset + 1) : accOffset);
					}
				}),
			_Utils_Tuple2(0, offset),
			leaves);
		var newOffset = _v0.b;
		return newOffset;
	});
var $author$project$RichText$State$translatePath = F4(
	function (old, _new, path, offset) {
		var _v0 = A2($author$project$RichText$Node$findTextBlockNodeAncestor, path, old);
		if (_v0.$ === 1) {
			return _Utils_Tuple2(path, offset);
		} else {
			var _v1 = _v0.a;
			var oldN = _v1.b;
			var _v2 = A2($author$project$RichText$Node$findTextBlockNodeAncestor, path, _new);
			if (_v2.$ === 1) {
				return _Utils_Tuple2(path, offset);
			} else {
				var _v3 = _v2.a;
				var newN = _v3.b;
				if (_Utils_eq(oldN, newN)) {
					return _Utils_Tuple2(path, offset);
				} else {
					var _v4 = $author$project$RichText$Model$Node$childNodes(oldN);
					if (_v4.$ === 1) {
						var oldA = _v4.a;
						var _v5 = $elmcraft$core_extra$List$Extra$last(path);
						if (_v5.$ === 1) {
							return _Utils_Tuple2(path, offset);
						} else {
							var lastIndex = _v5.a;
							var _v6 = $author$project$RichText$Model$Node$childNodes(newN);
							if (_v6.$ === 1) {
								var newA = _v6.a;
								var pOff = A3(
									$author$project$RichText$State$parentOffset,
									$author$project$RichText$Model$Node$toInlineArray(oldA),
									lastIndex,
									offset);
								var _v7 = A2(
									$author$project$RichText$State$childOffset,
									$author$project$RichText$Model$Node$toInlineArray(newA),
									pOff);
								var cI = _v7.a;
								var cO = _v7.b;
								var newPath = _Utils_ap(
									A2(
										$elm$core$List$take,
										$elm$core$List$length(path) - 1,
										path),
									_List_fromArray(
										[cI]));
								return _Utils_Tuple2(newPath, cO);
							} else {
								return _Utils_Tuple2(path, offset);
							}
						}
					} else {
						return _Utils_Tuple2(path, offset);
					}
				}
			}
		}
	});
var $author$project$RichText$State$translateReducedTextBlockSelection = F2(
	function (root, state) {
		var _v0 = $author$project$RichText$Model$State$selection(state);
		if (_v0.$ === 1) {
			return A2($author$project$RichText$Model$State$withRoot, root, state);
		} else {
			var selection = _v0.a;
			var _v1 = A4(
				$author$project$RichText$State$translatePath,
				$author$project$RichText$Model$State$root(state),
				root,
				$author$project$RichText$Model$Selection$focusNode(selection),
				$author$project$RichText$Model$Selection$focusOffset(selection));
			var fP = _v1.a;
			var fO = _v1.b;
			var _v2 = A4(
				$author$project$RichText$State$translatePath,
				$author$project$RichText$Model$State$root(state),
				root,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$Selection$anchorOffset(selection));
			var aP = _v2.a;
			var aO = _v2.b;
			return A2(
				$author$project$RichText$Model$State$withSelection,
				$elm$core$Maybe$Just(
					A4($author$project$RichText$Model$Selection$range, aP, aO, fP, fO)),
				A2($author$project$RichText$Model$State$withRoot, root, state));
		}
	});
var $author$project$RichText$State$reduce = function (editorState) {
	var markedRoot = function () {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $author$project$RichText$Model$State$root(editorState);
		} else {
			var selection = _v0.a;
			return A2(
				$author$project$RichText$Annotation$annotateSelection,
				selection,
				$author$project$RichText$Model$State$root(editorState));
		}
	}();
	var reducedRoot = $author$project$RichText$Annotation$clearSelectionAnnotations(
		$author$project$RichText$State$reduceNode(markedRoot));
	return A2($author$project$RichText$State$translateReducedTextBlockSelection, reducedRoot, editorState);
};
var $folkertdev$elm_deque$Internal$first = function (deque) {
	var _v0 = _Utils_Tuple2(deque.t, deque.u);
	if (((!_v0.a.b) && _v0.b.b) && (!_v0.b.b.b)) {
		var _v1 = _v0.b;
		var x = _v1.a;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$List$head(deque.t);
	}
};
var $folkertdev$elm_deque$BoundedDeque$first = function (_v0) {
	var deque = _v0.a;
	return $folkertdev$elm_deque$Internal$first(deque);
};
var $author$project$RichText$Internal$Editor$updateEditorStateWithTimestamp = F4(
	function (maybeTimestamp, action, newState, editor_) {
		var timestamp = A2($elm$core$Maybe$withDefault, 0, maybeTimestamp);
		var editorHistory = $author$project$RichText$Internal$History$contents(
			$author$project$RichText$Internal$Editor$history(editor_));
		var newUndoDeque = function () {
			var _v0 = $folkertdev$elm_deque$BoundedDeque$first(editorHistory.E);
			if (_v0.$ === 1) {
				return A2(
					$folkertdev$elm_deque$BoundedDeque$pushFront,
					_Utils_Tuple2(
						action,
						$author$project$RichText$Internal$Editor$state(editor_)),
					editorHistory.E);
			} else {
				var _v1 = _v0.a;
				var lastAction = _v1.a;
				return (_Utils_eq(lastAction, action) && ((!(!timestamp)) && (_Utils_cmp(timestamp - editorHistory.aZ, editorHistory.bz) < 0))) ? editorHistory.E : A2(
					$folkertdev$elm_deque$BoundedDeque$pushFront,
					_Utils_Tuple2(
						action,
						$author$project$RichText$Internal$Editor$state(editor_)),
					editorHistory.E);
			}
		}();
		var newHistory = _Utils_update(
			editorHistory,
			{aZ: timestamp, am: _List_Nil, E: newUndoDeque});
		return $author$project$RichText$Internal$Editor$incrementChangeCount(
			A2(
				$author$project$RichText$Internal$Editor$withHistory,
				$author$project$RichText$Internal$History$fromContents(newHistory),
				A2($author$project$RichText$Internal$Editor$withState, newState, editor_)));
	});
var $author$project$RichText$Internal$Editor$updateEditorState = $author$project$RichText$Internal$Editor$updateEditorStateWithTimestamp($elm$core$Maybe$Nothing);
var $author$project$RichText$Config$ElementDefinition$contentType = function (definition_) {
	var c = definition_;
	return c.ct;
};
var $author$project$RichText$Config$ElementDefinition$defaultElementDefinition = F3(
	function (name_, group_, contentType_) {
		return $author$project$RichText$Config$ElementDefinition$elementDefinition(
			{
				ct: contentType_,
				by: $author$project$RichText$Config$ElementDefinition$defaultHtmlToElement(name_),
				cE: group_,
				bM: name_,
				c0: false,
				cb: $author$project$RichText$Config$ElementDefinition$defaultElementToHtml(name_)
			});
	});
var $author$project$RichText$Config$Spec$elementDefinition = F2(
	function (name, spec) {
		var c = spec;
		return A2($elm$core$Dict$get, name, c.aJ);
	});
var $author$project$RichText$Internal$Spec$elementDefinitionWithDefault = F2(
	function (ele, spec) {
		var name = $author$project$RichText$Internal$Definitions$nameFromElement(ele);
		return A2(
			$elm$core$Maybe$withDefault,
			A3(
				$author$project$RichText$Config$ElementDefinition$defaultElementDefinition,
				name,
				'block',
				$author$project$RichText$Config$ElementDefinition$blockNode(_List_Nil)),
			A2($author$project$RichText$Config$Spec$elementDefinition, name, spec));
	});
var $author$project$RichText$Config$ElementDefinition$group = function (definition_) {
	var c = definition_;
	return c.cE;
};
var $author$project$RichText$Internal$Definitions$toStringContentType = function (contentType) {
	switch (contentType.$) {
		case 1:
			return 'TextBlockNodeType';
		case 3:
			return 'InlineLeafNodeType';
		case 0:
			return 'BlockNodeType';
		default:
			return 'BlockLeafNodeType';
	}
};
var $author$project$RichText$State$validateAllowedGroups = F3(
	function (allowedGroups, group, name) {
		if (allowedGroups.$ === 1) {
			return _List_Nil;
		} else {
			var groups = allowedGroups.a;
			return A2($elm$core$Set$member, group, groups) ? _List_Nil : (A2($elm$core$Set$member, name, groups) ? _List_Nil : _List_fromArray(
				[
					'Group ' + (group + (' is not in allowed groups [' + (A2(
					$elm$core$String$join,
					', ',
					$elm$core$Set$toList(groups)) + ']')))
				]));
		}
	});
var $elm$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2($elm$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});
var $elm$core$Set$diff = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$diff, dict1, dict2);
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $author$project$RichText$State$validateAllowedMarks = F2(
	function (allowedMarks, leaf) {
		if (allowedMarks.$ === 1) {
			return _List_Nil;
		} else {
			var allowed = allowedMarks.a;
			var notAllowed = A2(
				$elm$core$Set$diff,
				$elm$core$Set$fromList(
					A2(
						$elm$core$List$map,
						function (m) {
							return $author$project$RichText$Model$Mark$name(m);
						},
						$author$project$RichText$Model$Node$marks(leaf))),
				allowed);
			return $elm$core$Set$isEmpty(notAllowed) ? _List_Nil : _List_fromArray(
				[
					'Inline node is only allowed the following marks: ' + (A2(
					$elm$core$String$join,
					',',
					$elm$core$Set$toList(allowed)) + (', but found ' + A2(
					$elm$core$String$join,
					',',
					$elm$core$Set$toList(notAllowed))))
				]);
		}
	});
var $author$project$RichText$State$validateInlineLeaf = F4(
	function (spec, allowedGroups, allowedMarks, leaf) {
		return _Utils_ap(
			A2($author$project$RichText$State$validateAllowedMarks, allowedMarks, leaf),
			function () {
				if (leaf.$ === 1) {
					return _List_Nil;
				} else {
					var il = leaf.a;
					var definition = A2(
						$author$project$RichText$Internal$Spec$elementDefinitionWithDefault,
						$author$project$RichText$Model$InlineElement$element(il),
						spec);
					return A3(
						$author$project$RichText$State$validateAllowedGroups,
						allowedGroups,
						$author$project$RichText$Config$ElementDefinition$group(definition),
						$author$project$RichText$Config$ElementDefinition$name(definition));
				}
			}());
	});
var $author$project$RichText$State$validateEditorBlockNode = F3(
	function (spec, allowedGroups, node) {
		var parameters = $author$project$RichText$Model$Node$element(node);
		var definition = A2($author$project$RichText$Internal$Spec$elementDefinitionWithDefault, parameters, spec);
		var allowedGroupsErrors = A3(
			$author$project$RichText$State$validateAllowedGroups,
			allowedGroups,
			$author$project$RichText$Config$ElementDefinition$group(definition),
			$author$project$RichText$Config$ElementDefinition$name(definition));
		if (!$elm$core$List$isEmpty(allowedGroupsErrors)) {
			return allowedGroupsErrors;
		} else {
			var contentType = $author$project$RichText$Config$ElementDefinition$contentType(definition);
			var _v0 = $author$project$RichText$Model$Node$childNodes(node);
			switch (_v0.$) {
				case 0:
					var ba = _v0.a;
					if (!contentType.$) {
						var groups = contentType.a;
						return A2(
							$elm$core$List$concatMap,
							A2($author$project$RichText$State$validateEditorBlockNode, spec, groups),
							$elm$core$Array$toList(
								$author$project$RichText$Model$Node$toBlockArray(ba)));
					} else {
						return _List_fromArray(
							[
								'I was expecting textblock content type, but instead I got ' + $author$project$RichText$Internal$Definitions$toStringContentType(contentType)
							]);
					}
				case 1:
					var la = _v0.a;
					if (contentType.$ === 1) {
						var config = contentType.a;
						return A2(
							$elm$core$List$concatMap,
							A3($author$project$RichText$State$validateInlineLeaf, spec, config.ci, config.cj),
							$elm$core$Array$toList(
								$author$project$RichText$Model$Node$toInlineArray(la)));
					} else {
						return _List_fromArray(
							[
								'I was expecting textblock content type, but instead I got ' + $author$project$RichText$Internal$Definitions$toStringContentType(contentType)
							]);
					}
				default:
					return _Utils_eq(contentType, $author$project$RichText$Config$ElementDefinition$blockLeaf) ? _List_Nil : _List_fromArray(
						[
							'I was expecting leaf blockleaf content type, but instead I got ' + $author$project$RichText$Internal$Definitions$toStringContentType(contentType)
						]);
			}
		}
	});
var $author$project$RichText$State$validate = F2(
	function (spec, editorState) {
		var root = $author$project$RichText$Model$State$root(editorState);
		var _v0 = A3(
			$author$project$RichText$State$validateEditorBlockNode,
			spec,
			$elm$core$Maybe$Just(
				$elm$core$Set$singleton('root')),
			root);
		if (!_v0.b) {
			return $elm$core$Result$Ok(editorState);
		} else {
			var result = _v0;
			return $elm$core$Result$Err(
				A2($elm$core$String$join, ', ', result));
		}
	});
var $author$project$RichText$Internal$Editor$applyCommand = F3(
	function (_v0, spec, editor_) {
		var name = _v0.a;
		var command = _v0.b;
		if (command.$ === 1) {
			var action = command.a;
			return A2($author$project$RichText$Internal$Editor$applyInternalCommand, action, editor_);
		} else {
			var transform = command.a;
			var _v2 = A2(
				$elm$core$Result$andThen,
				$author$project$RichText$State$validate(spec),
				transform(
					$author$project$RichText$Internal$Editor$state(editor_)));
			if (_v2.$ === 1) {
				var s = _v2.a;
				return $elm$core$Result$Err(s);
			} else {
				var v = _v2.a;
				var reducedState = $author$project$RichText$State$reduce(v);
				return $elm$core$Result$Ok(
					$author$project$RichText$Internal$Editor$forceReselection(
						A3($author$project$RichText$Internal$Editor$updateEditorState, name, reducedState, editor_)));
			}
		}
	});
var $author$project$RichText$Editor$apply = $author$project$RichText$Internal$Editor$applyCommand;
var $author$project$RichText$Commands$insertBlockBeforeSelection = F2(
	function (node, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return $elm$core$Result$Err('I can only insert a block element before a collapsed selection');
			} else {
				var markedRoot = A2(
					$author$project$RichText$Annotation$annotateSelection,
					selection,
					$author$project$RichText$Model$State$root(editorState));
				var closestBlockPath = A2(
					$author$project$RichText$Node$findClosestBlockPath,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					markedRoot);
				var _v1 = A2($author$project$RichText$Node$nodeAt, closestBlockPath, markedRoot);
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('Invalid selection');
				} else {
					var anchorNode = _v1.a;
					if (!anchorNode.$) {
						var bn = anchorNode.a;
						var newFragment = $author$project$RichText$Node$isEmptyTextBlock(
							$author$project$RichText$Node$Block(bn)) ? _List_fromArray(
							[node]) : _List_fromArray(
							[node, bn]);
						var _v3 = A3(
							$author$project$RichText$Node$replaceWithFragment,
							closestBlockPath,
							$author$project$RichText$Node$BlockFragment(
								$elm$core$Array$fromList(newFragment)),
							markedRoot);
						if (_v3.$ === 1) {
							var s = _v3.a;
							return $elm$core$Result$Err(s);
						} else {
							var newRoot = _v3.a;
							var newSelection = $author$project$RichText$Annotation$isSelectable(
								$author$project$RichText$Node$Block(node)) ? $elm$core$Maybe$Just(
								A2($author$project$RichText$Model$Selection$caret, closestBlockPath, 0)) : A3(
								$author$project$RichText$Annotation$selectionFromAnnotations,
								newRoot,
								$author$project$RichText$Model$Selection$anchorOffset(selection),
								$author$project$RichText$Model$Selection$focusOffset(selection));
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$State$withRoot,
									$author$project$RichText$Annotation$clearSelectionAnnotations(newRoot),
									A2($author$project$RichText$Model$State$withSelection, newSelection, editorState)));
						}
					} else {
						return $elm$core$Result$Err('Invalid state! I was expecting a block node.');
					}
				}
			}
		}
	});
var $author$project$RichText$Commands$insertBlock = F2(
	function (node, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return A2(
					$elm$core$Result$andThen,
					$author$project$RichText$Commands$insertBlock(node),
					$author$project$RichText$Commands$removeRange(editorState));
			} else {
				var _v1 = A2(
					$author$project$RichText$Node$nodeAt,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('Invalid selection');
				} else {
					var aNode = _v1.a;
					if (!aNode.$) {
						var bn = aNode.a;
						var _v3 = A3(
							$author$project$RichText$Node$replaceWithFragment,
							$author$project$RichText$Model$Selection$anchorNode(selection),
							$author$project$RichText$Node$BlockFragment(
								$elm$core$Array$fromList(
									_List_fromArray(
										[bn, node]))),
							$author$project$RichText$Model$State$root(editorState));
						if (_v3.$ === 1) {
							var s = _v3.a;
							return $elm$core$Result$Err(s);
						} else {
							var newRoot = _v3.a;
							var newSelection = $author$project$RichText$Annotation$isSelectable(
								$author$project$RichText$Node$Block(node)) ? A2(
								$author$project$RichText$Model$Selection$caret,
								$author$project$RichText$Model$Node$increment(
									$author$project$RichText$Model$Selection$anchorNode(selection)),
								0) : selection;
							return $elm$core$Result$Ok(
								A2(
									$author$project$RichText$Model$State$withRoot,
									newRoot,
									A2(
										$author$project$RichText$Model$State$withSelection,
										$elm$core$Maybe$Just(newSelection),
										editorState)));
						}
					} else {
						var _v4 = $author$project$RichText$Commands$splitTextBlock(editorState);
						if (_v4.$ === 1) {
							var s = _v4.a;
							return $elm$core$Result$Err(s);
						} else {
							var splitEditorState = _v4.a;
							return A2($author$project$RichText$Commands$insertBlockBeforeSelection, node, splitEditorState);
						}
					}
				}
			}
		}
	});
var $author$project$Editor$handleInsertHorizontalRule = F2(
	function (spec, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'insertHR',
							$author$project$RichText$Config$Command$transform(
								$author$project$RichText$Commands$insertBlock(
									A2(
										$author$project$RichText$Model$Node$block,
										A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$horizontalRule, _List_Nil),
										$author$project$RichText$Model$Node$Leaf)))),
						spec,
						model.a))
			});
	});
var $author$project$Editor$setResult = F2(
	function (result, _v0) {
		return result;
	});
var $author$project$Editor$handleInsertImage = F2(
	function (spec, model) {
		var insertImageModal = model.v;
		var newEditor = function () {
			var _v0 = insertImageModal.bs;
			if (_v0.$ === 1) {
				return model.a;
			} else {
				var state_ = _v0.a;
				var params = A2(
					$author$project$RichText$Model$Element$element,
					$author$project$RichText$Definitions$image,
					_List_fromArray(
						[
							A2($author$project$RichText$Model$Attribute$StringAttribute, 'src', insertImageModal.b6),
							A2($author$project$RichText$Model$Attribute$StringAttribute, 'alt', insertImageModal.bl)
						]));
				var img = A2($author$project$RichText$Model$Node$inlineElement, params, _List_Nil);
				return A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'insertImage',
							$author$project$RichText$Config$Command$transform(
								$author$project$Editor$setResult(
									A2($author$project$RichText$Commands$insertInline, img, state_)))),
						spec,
						model.a));
			}
		}();
		return _Utils_update(
			model,
			{
				a: newEditor,
				v: _Utils_update(
					insertImageModal,
					{bl: '', bs: $elm$core$Maybe$Nothing, b6: '', aT: false})
			});
	});
var $author$project$Editor$handleInsertLink = F2(
	function (spec, model) {
		var insertLinkModal = model.w;
		var newEditor = function () {
			var _v0 = insertLinkModal.bs;
			if (_v0.$ === 1) {
				return model.a;
			} else {
				var state_ = _v0.a;
				var markOrder = $author$project$RichText$Model$Mark$markOrderFromSpec(spec);
				var attributes = _List_fromArray(
					[
						A2($author$project$RichText$Model$Attribute$StringAttribute, 'href', insertLinkModal.bD),
						A2($author$project$RichText$Model$Attribute$StringAttribute, 'title', insertLinkModal.ca)
					]);
				var linkMark = A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$link, attributes);
				return A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'insertLink',
							$author$project$RichText$Config$Command$transform(
								$author$project$Editor$setResult(
									A4($author$project$RichText$Commands$toggleMark, markOrder, linkMark, 0, state_)))),
						spec,
						model.a));
			}
		}();
		return _Utils_update(
			model,
			{
				a: newEditor,
				w: _Utils_update(
					insertLinkModal,
					{bs: $elm$core$Maybe$Nothing, bD: '', ca: '', aT: false})
			});
	});
var $author$project$RichText$Internal$Editor$applyNamedCommandList = F3(
	function (list, spec, editor_) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (cmd, result) {
					if (result.$ === 1) {
						var _v1 = A3($author$project$RichText$Internal$Editor$applyCommand, cmd, spec, editor_);
						if (_v1.$ === 1) {
							var s2 = _v1.a;
							return $elm$core$Result$Err(s2);
						} else {
							var o = _v1.a;
							return $elm$core$Result$Ok(o);
						}
					} else {
						return result;
					}
				}),
			$elm$core$Result$Err('No commands found'),
			list);
	});
var $author$project$RichText$Editor$applyList = $author$project$RichText$Internal$Editor$applyNamedCommandList;
var $author$project$Editor$handleLiftBlock = F2(
	function (spec, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$applyList,
						_List_fromArray(
							[
								_Utils_Tuple2(
								'liftList',
								$author$project$RichText$Config$Command$transform(
									$author$project$RichText$List$lift($author$project$RichText$List$defaultListDefinition))),
								_Utils_Tuple2(
								'lift',
								$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$lift))
							]),
						spec,
						model.a))
			});
	});
var $author$project$Editor$handleRedo = F2(
	function (spec, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'redo',
							$author$project$RichText$Config$Command$internal(1)),
						spec,
						model.a))
			});
	});
var $author$project$RichText$Editor$state = $author$project$RichText$Internal$Editor$state;
var $author$project$Editor$handleShowInsertImageModal = function (model) {
	var insertImageModal = model.v;
	return _Utils_update(
		model,
		{
			v: _Utils_update(
				insertImageModal,
				{
					bs: $elm$core$Maybe$Just(
						$author$project$RichText$Editor$state(model.a)),
					aT: true
				})
		});
};
var $author$project$RichText$Node$anyRange = F4(
	function (pred, start, end, root) {
		return !A4(
			$author$project$RichText$Node$allRange,
			function (x) {
				return !pred(x);
			},
			start,
			end,
			root);
	});
var $author$project$Editor$handleShowInsertLinkModal = F2(
	function (spec, model) {
		var insertLinkModal = model.w;
		var editorState = $author$project$RichText$Editor$state(model.a);
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return model;
		} else {
			var selection = _v0.a;
			var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
			var hasLink = A4(
				$author$project$RichText$Node$anyRange,
				function (n) {
					if (n.$ === 1) {
						var il = n.a;
						return A2(
							$elm$core$List$any,
							function (m) {
								return $author$project$RichText$Model$Mark$name(m) === 'link';
							},
							$author$project$RichText$Model$Node$marks(il));
					} else {
						return false;
					}
				},
				$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
				$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
				$author$project$RichText$Model$State$root(editorState));
			if (hasLink) {
				var markOrder = $author$project$RichText$Model$Mark$markOrderFromSpec(spec);
				var linkMark = A2(
					$author$project$RichText$Model$Mark$mark,
					$author$project$RichText$Definitions$link,
					_List_fromArray(
						[
							A2($author$project$RichText$Model$Attribute$StringAttribute, 'src', '')
						]));
				var newEditor = A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'removeLink',
							$author$project$RichText$Config$Command$transform(
								A3($author$project$RichText$Commands$toggleMark, markOrder, linkMark, 1))),
						spec,
						model.a));
				return _Utils_update(
					model,
					{a: newEditor});
			} else {
				return _Utils_update(
					model,
					{
						w: _Utils_update(
							insertLinkModal,
							{
								bs: $elm$core$Maybe$Just(editorState),
								aT: true
							})
					});
			}
		}
	});
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $author$project$RichText$Commands$convertInlineChildrenToString = function (ic) {
	return A3(
		$elm$core$Array$foldl,
		F2(
			function (i, s) {
				if (i.$ === 1) {
					var t = i.a;
					return _Utils_ap(
						s,
						$author$project$RichText$Model$Text$text(t));
				} else {
					return s;
				}
			}),
		'',
		$author$project$RichText$Model$Node$toInlineArray(ic));
};
var $author$project$RichText$Commands$toggleTextBlock = F4(
	function (onElement, offElement, convertToPlainText, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected.');
		} else {
			var selection = _v0.a;
			var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
			var focusPath = A2(
				$author$project$RichText$Node$findClosestBlockPath,
				$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
				$author$project$RichText$Model$State$root(editorState));
			var anchorPath = A2(
				$author$project$RichText$Node$findClosestBlockPath,
				$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
				$author$project$RichText$Model$State$root(editorState));
			var doOffBehavior = A4(
				$author$project$RichText$Node$allRange,
				function (node) {
					if (!node.$) {
						var bn = node.a;
						var _v5 = $author$project$RichText$Model$Node$childNodes(bn);
						if (_v5.$ === 1) {
							return _Utils_eq(
								$author$project$RichText$Model$Node$element(bn),
								onElement);
						} else {
							return true;
						}
					} else {
						return true;
					}
				},
				anchorPath,
				focusPath,
				$author$project$RichText$Model$State$root(editorState));
			var newParams = doOffBehavior ? offElement : onElement;
			var newRoot = function () {
				var _v1 = A2(
					$author$project$RichText$Node$indexedMap,
					F2(
						function (path, node) {
							if ((_Utils_cmp(path, anchorPath) < 0) || (_Utils_cmp(path, focusPath) > 0)) {
								return node;
							} else {
								if (!node.$) {
									var bn = node.a;
									var _v3 = $author$project$RichText$Model$Node$childNodes(bn);
									if (_v3.$ === 1) {
										var ic = _v3.a;
										var newInlineChildren = convertToPlainText ? $author$project$RichText$Model$Node$inlineChildren(
											$elm$core$Array$fromList(
												_List_fromArray(
													[
														$author$project$RichText$Model$Node$plainText(
														$author$project$RichText$Commands$convertInlineChildrenToString(ic))
													]))) : $author$project$RichText$Model$Node$InlineChildren(ic);
										return $author$project$RichText$Node$Block(
											A2(
												$author$project$RichText$Model$Node$withChildNodes,
												newInlineChildren,
												A2($author$project$RichText$Model$Node$withElement, newParams, bn)));
									} else {
										return node;
									}
								} else {
									return node;
								}
							}
						}),
					$author$project$RichText$Node$Block(
						$author$project$RichText$Model$State$root(editorState)));
				if (!_v1.$) {
					var bn = _v1.a;
					return bn;
				} else {
					return $author$project$RichText$Model$State$root(editorState);
				}
			}();
			return convertToPlainText ? $elm$core$Result$Ok(
				A2($author$project$RichText$State$translateReducedTextBlockSelection, newRoot, editorState)) : $elm$core$Result$Ok(
				A2($author$project$RichText$Model$State$withRoot, newRoot, editorState));
		}
	});
var $author$project$Editor$handleToggleBlock = F3(
	function (spec, block, model) {
		var offParams = A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil);
		var isCode = block === 'Code block';
		var onParams = isCode ? A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$codeBlock, _List_Nil) : A2(
			$author$project$RichText$Model$Element$element,
			$author$project$RichText$Definitions$heading,
			_List_fromArray(
				[
					A2(
					$author$project$RichText$Model$Attribute$IntegerAttribute,
					'level',
					A2(
						$elm$core$Maybe$withDefault,
						1,
						$elm$core$String$toInt(
							A2($elm$core$String$right, 1, block))))
				]));
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'toggleBlock',
							$author$project$RichText$Config$Command$transform(
								A3($author$project$RichText$Commands$toggleTextBlock, onParams, offParams, isCode))),
						spec,
						model.a))
			});
	});
var $author$project$ExtraMarks$htmlNodeToStrikethrough = $author$project$RichText$Config$MarkDefinition$defaultHtmlToMark('s');
var $author$project$ExtraMarks$strikethroughToHtmlNode = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 's', _List_Nil, children);
	});
var $author$project$ExtraMarks$strikethrough = $author$project$RichText$Config$MarkDefinition$markDefinition(
	{by: $author$project$ExtraMarks$htmlNodeToStrikethrough, bM: 'strikethrough', cb: $author$project$ExtraMarks$strikethroughToHtmlNode});
var $author$project$ExtraMarks$htmlNodeToUnderline = $author$project$RichText$Config$MarkDefinition$defaultHtmlToMark('u');
var $author$project$ExtraMarks$underlineToHtmlNode = F2(
	function (_v0, children) {
		return A3($author$project$RichText$Model$HtmlNode$ElementNode, 'u', _List_Nil, children);
	});
var $author$project$ExtraMarks$underline = $author$project$RichText$Config$MarkDefinition$markDefinition(
	{by: $author$project$ExtraMarks$htmlNodeToUnderline, bM: 'underline', cb: $author$project$ExtraMarks$underlineToHtmlNode});
var $author$project$Editor$handleToggleStyle = F3(
	function (style, spec, model) {
		var markOrder = $author$project$RichText$Model$Mark$markOrderFromSpec(spec);
		var markDef = function () {
			switch (style) {
				case 0:
					return $author$project$RichText$Definitions$bold;
				case 1:
					return $author$project$RichText$Definitions$italic;
				case 2:
					return $author$project$RichText$Definitions$code;
				case 3:
					return $author$project$ExtraMarks$strikethrough;
				default:
					return $author$project$ExtraMarks$underline;
			}
		}();
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'toggleStyle',
							$author$project$RichText$Config$Command$transform(
								A3(
									$author$project$RichText$Commands$toggleMark,
									markOrder,
									A2($author$project$RichText$Model$Mark$mark, markDef, _List_Nil),
									2))),
						spec,
						model.a))
			});
	});
var $author$project$Editor$handleUndo = F2(
	function (spec, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'undo',
							$author$project$RichText$Config$Command$internal(0)),
						spec,
						model.a))
			});
	});
var $author$project$Editor$handleUpdateImageAlt = F2(
	function (alt, model) {
		var insertImageModal = model.v;
		return _Utils_update(
			model,
			{
				v: _Utils_update(
					insertImageModal,
					{bl: alt})
			});
	});
var $author$project$Editor$handleUpdateImageSrc = F2(
	function (src, model) {
		var insertImageModal = model.v;
		return _Utils_update(
			model,
			{
				v: _Utils_update(
					insertImageModal,
					{b6: src})
			});
	});
var $author$project$Editor$handleUpdateLinkHref = F2(
	function (href, model) {
		var insertLinkModal = model.w;
		return _Utils_update(
			model,
			{
				w: _Utils_update(
					insertLinkModal,
					{bD: href})
			});
	});
var $author$project$Editor$handleUpdateLinkTitle = F2(
	function (title, model) {
		var insertLinkModal = model.w;
		return _Utils_update(
			model,
			{
				w: _Utils_update(
					insertLinkModal,
					{ca: title})
			});
	});
var $author$project$RichText$Commands$wrap = F3(
	function (contentsMapFunc, elementParameters, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
			var markedRoot = A2(
				$author$project$RichText$Annotation$annotateSelection,
				normalizedSelection,
				$author$project$RichText$Model$State$root(editorState));
			var focusBlockPath = A2(
				$author$project$RichText$Node$findClosestBlockPath,
				$author$project$RichText$Model$Selection$focusNode(normalizedSelection),
				markedRoot);
			var anchorBlockPath = A2(
				$author$project$RichText$Node$findClosestBlockPath,
				$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
				markedRoot);
			var ancestor = A2($author$project$RichText$Model$Node$commonAncestor, anchorBlockPath, focusBlockPath);
			if (_Utils_eq(ancestor, anchorBlockPath) || _Utils_eq(ancestor, focusBlockPath)) {
				var _v1 = A2($author$project$RichText$Node$nodeAt, ancestor, markedRoot);
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('I cannot find a node at selection');
				} else {
					var node = _v1.a;
					var newChildren = function () {
						if (!node.$) {
							var bn = node.a;
							return $author$project$RichText$Model$Node$blockChildren(
								A2(
									$elm$core$Array$map,
									contentsMapFunc,
									$elm$core$Array$fromList(
										_List_fromArray(
											[bn]))));
						} else {
							var il = node.a;
							return $author$project$RichText$Model$Node$inlineChildren(
								$elm$core$Array$fromList(
									_List_fromArray(
										[il])));
						}
					}();
					var newNode = A2($author$project$RichText$Model$Node$block, elementParameters, newChildren);
					var _v2 = A3(
						$author$project$RichText$Node$replace,
						ancestor,
						$author$project$RichText$Node$Block(newNode),
						markedRoot);
					if (_v2.$ === 1) {
						var err = _v2.a;
						return $elm$core$Result$Err(err);
					} else {
						var newRoot = _v2.a;
						return $elm$core$Result$Ok(
							A2(
								$author$project$RichText$Model$State$withSelection,
								A3(
									$author$project$RichText$Annotation$selectionFromAnnotations,
									newRoot,
									$author$project$RichText$Model$Selection$anchorOffset(selection),
									$author$project$RichText$Model$Selection$focusOffset(selection)),
								A2(
									$author$project$RichText$Model$State$withRoot,
									$author$project$RichText$Annotation$clearSelectionAnnotations(newRoot),
									editorState)));
					}
				}
			} else {
				var _v4 = A2(
					$elmcraft$core_extra$List$Extra$getAt,
					$elm$core$List$length(ancestor),
					$author$project$RichText$Model$Selection$anchorNode(normalizedSelection));
				if (_v4.$ === 1) {
					return $elm$core$Result$Err('Invalid ancestor path at anchor node');
				} else {
					var childAnchorIndex = _v4.a;
					var _v5 = A2(
						$elmcraft$core_extra$List$Extra$getAt,
						$elm$core$List$length(ancestor),
						$author$project$RichText$Model$Selection$focusNode(normalizedSelection));
					if (_v5.$ === 1) {
						return $elm$core$Result$Err('Invalid ancestor path at focus node');
					} else {
						var childFocusIndex = _v5.a;
						var _v6 = A2($author$project$RichText$Node$nodeAt, ancestor, markedRoot);
						if (_v6.$ === 1) {
							return $elm$core$Result$Err('Invalid common ancestor path');
						} else {
							var node = _v6.a;
							if (!node.$) {
								var bn = node.a;
								var _v8 = $author$project$RichText$Model$Node$childNodes(bn);
								switch (_v8.$) {
									case 0:
										var a = _v8.a;
										var newChildNode = A2(
											$author$project$RichText$Model$Node$block,
											elementParameters,
											$author$project$RichText$Model$Node$blockChildren(
												A2(
													$elm$core$Array$map,
													contentsMapFunc,
													A3(
														$elm$core$Array$slice,
														childAnchorIndex,
														childFocusIndex + 1,
														$author$project$RichText$Model$Node$toBlockArray(a)))));
										var newBlockArray = $author$project$RichText$Model$Node$blockChildren(
											A2(
												$elm$core$Array$append,
												A2(
													$elm$core$Array$append,
													A2(
														$elmcraft$core_extra$Array$Extra$sliceUntil,
														childAnchorIndex,
														$author$project$RichText$Model$Node$toBlockArray(a)),
													$elm$core$Array$fromList(
														_List_fromArray(
															[newChildNode]))),
												A2(
													$elmcraft$core_extra$Array$Extra$sliceFrom,
													childFocusIndex + 1,
													$author$project$RichText$Model$Node$toBlockArray(a))));
										var newNode = A2($author$project$RichText$Model$Node$withChildNodes, newBlockArray, bn);
										var _v9 = A3(
											$author$project$RichText$Node$replace,
											ancestor,
											$author$project$RichText$Node$Block(newNode),
											markedRoot);
										if (_v9.$ === 1) {
											var s = _v9.a;
											return $elm$core$Result$Err(s);
										} else {
											var newRoot = _v9.a;
											return $elm$core$Result$Ok(
												A2(
													$author$project$RichText$Model$State$withSelection,
													A3(
														$author$project$RichText$Annotation$selectionFromAnnotations,
														newRoot,
														$author$project$RichText$Model$Selection$anchorOffset(selection),
														$author$project$RichText$Model$Selection$focusOffset(selection)),
													A2(
														$author$project$RichText$Model$State$withRoot,
														$author$project$RichText$Annotation$clearSelectionAnnotations(newRoot),
														editorState)));
										}
									case 1:
										return $elm$core$Result$Err('Cannot wrap inline elements');
									default:
										return $elm$core$Result$Err('Cannot wrap leaf elements');
								}
							} else {
								return $elm$core$Result$Err('Invalid ancestor path... somehow we have an inline leaf');
							}
						}
					}
				}
			}
		}
	});
var $author$project$Editor$handleWrapBlockNode = F2(
	function (spec, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'wrapBlockquote',
							$author$project$RichText$Config$Command$transform(
								A2(
									$author$project$RichText$Commands$wrap,
									function (n) {
										return n;
									},
									A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$blockquote, _List_Nil)))),
						spec,
						model.a))
			});
	});
var $author$project$RichText$List$Ordered = 0;
var $author$project$RichText$List$addListItem = F2(
	function (definition, node) {
		return A2(
			$author$project$RichText$Model$Node$block,
			$author$project$RichText$List$item(definition),
			$author$project$RichText$Model$Node$blockChildren(
				$elm$core$Array$fromList(
					_List_fromArray(
						[node]))));
	});
var $author$project$RichText$List$wrap = F3(
	function (definition, type_, editorState) {
		return A3(
			$author$project$RichText$Commands$wrap,
			$author$project$RichText$List$addListItem(definition),
			(!type_) ? $author$project$RichText$List$ordered(definition) : $author$project$RichText$List$unordered(definition),
			editorState);
	});
var $author$project$Editor$handleWrapInList = F3(
	function (spec, listType, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'wrapList',
							$author$project$RichText$Config$Command$transform(
								A2($author$project$RichText$List$wrap, $author$project$RichText$List$defaultListDefinition, listType))),
						spec,
						model.a))
			});
	});
var $author$project$RichText$Editor$spec = function (cfg) {
	var c = cfg;
	return c.c4;
};
var $author$project$RichText$Internal$Editor$forceRerender = function (e) {
	var c = e;
	return _Utils_update(
		c,
		{an: c.an + 1});
};
var $author$project$RichText$Config$Command$namedCommandListFromInputEvent = F2(
	function (event, map) {
		var contents = map;
		return A2(
			$elm$core$Maybe$withDefault,
			contents.I(event),
			A2($elm$core$Dict$get, event.cJ, contents.M));
	});
var $author$project$RichText$Internal$BeforeInput$handleInputEvent = F4(
	function (commandMap, spec, editor, inputEvent) {
		var namedCommandList = A2($author$project$RichText$Config$Command$namedCommandListFromInputEvent, inputEvent, commandMap);
		return A3($author$project$RichText$Internal$Editor$applyNamedCommandList, namedCommandList, spec, editor);
	});
var $author$project$RichText$Internal$Editor$isComposing = function (e) {
	var c = e;
	return c.bI;
};
var $author$project$RichText$Internal$BeforeInput$handleBeforeInput = F4(
	function (inputEvent, commandMap, spec, editor) {
		if (inputEvent.bI || $author$project$RichText$Internal$Editor$isComposing(editor)) {
			return editor;
		} else {
			var _v0 = A4($author$project$RichText$Internal$BeforeInput$handleInputEvent, commandMap, spec, editor, inputEvent);
			if (_v0.$ === 1) {
				return editor;
			} else {
				var newEditor = _v0.a;
				return $author$project$RichText$Internal$Editor$forceRerender(newEditor);
			}
		}
	});
var $author$project$RichText$Internal$Editor$bufferedEditorState = function (e) {
	var c = e;
	return c.ay;
};
var $author$project$RichText$Internal$Editor$withBufferedEditorState = F2(
	function (s, e) {
		var c = e;
		return _Utils_update(
			c,
			{ay: s});
	});
var $author$project$RichText$Internal$Editor$withComposing = F2(
	function (composing, e) {
		var c = e;
		return _Utils_update(
			c,
			{bI: composing});
	});
var $author$project$RichText$Editor$applyForceFunctionOnEditor = F2(
	function (rerenderFunc, editor_) {
		return rerenderFunc(
			function () {
				var _v0 = $author$project$RichText$Internal$Editor$bufferedEditorState(editor_);
				if (_v0.$ === 1) {
					return editor_;
				} else {
					var bufferedEditorState = _v0.a;
					var newEditor = A3($author$project$RichText$Internal$Editor$updateEditorState, 'buffered', bufferedEditorState, editor_);
					return A2(
						$author$project$RichText$Internal$Editor$withComposing,
						false,
						A2($author$project$RichText$Internal$Editor$withBufferedEditorState, $elm$core$Maybe$Nothing, newEditor));
				}
			}());
	});
var $author$project$RichText$Editor$handleCompositionEnd = function (editor_) {
	var _v0 = $author$project$RichText$Internal$Editor$bufferedEditorState(editor_);
	if (_v0.$ === 1) {
		return A2($author$project$RichText$Internal$Editor$withComposing, false, editor_);
	} else {
		return A2($author$project$RichText$Editor$applyForceFunctionOnEditor, $author$project$RichText$Internal$Editor$forceReselection, editor_);
	}
};
var $author$project$RichText$Editor$handleCompositionStart = function (editor_) {
	return A2($author$project$RichText$Internal$Editor$withComposing, true, editor_);
};
var $author$project$RichText$Editor$handleCut = F2(
	function (spec_, editor_) {
		var _v0 = A3(
			$author$project$RichText$Editor$applyList,
			_List_fromArray(
				[
					_Utils_Tuple2(
					'removeRangeSelection',
					$author$project$RichText$Config$Command$transform($author$project$RichText$Commands$removeRange))
				]),
			spec_,
			editor_);
		if (_v0.$ === 1) {
			return editor_;
		} else {
			var e = _v0.a;
			return $author$project$RichText$Internal$Editor$forceRerender(e);
		}
	});
var $author$project$RichText$Internal$Editor$withShortKey = F2(
	function (key, e) {
		var c = e;
		return _Utils_update(
			c,
			{c1: key});
	});
var $author$project$RichText$Editor$handleInitEvent = F2(
	function (initEvent, editor_) {
		return A2($author$project$RichText$Internal$Editor$withShortKey, initEvent.c1, editor_);
	});
var $author$project$RichText$Config$Command$addAltKey = F2(
	function (keyboardEvent, keys) {
		return keyboardEvent.ck ? A2($elm$core$List$cons, $author$project$RichText$Config$Keys$alt, keys) : keys;
	});
var $author$project$RichText$Config$Keys$ctrl = 'Control';
var $author$project$RichText$Config$Command$addCtrlKey = F2(
	function (keyboardEvent, keys) {
		return keyboardEvent.cv ? A2($elm$core$List$cons, $author$project$RichText$Config$Keys$ctrl, keys) : keys;
	});
var $author$project$RichText$Config$Command$addMetaKey = F2(
	function (keyboardEvent, keys) {
		return keyboardEvent.cP ? A2($elm$core$List$cons, $author$project$RichText$Config$Keys$meta, keys) : keys;
	});
var $author$project$RichText$Config$Command$addShiftKey = F2(
	function (keyboardEvent, keys) {
		return keyboardEvent.b4 ? A2($elm$core$List$cons, $author$project$RichText$Config$Keys$shift, keys) : keys;
	});
var $author$project$RichText$Config$Command$keyboardEventToDictKey = function (keyboardEvent) {
	return $elm$core$List$sort(
		A2(
			$author$project$RichText$Config$Command$addAltKey,
			keyboardEvent,
			A2(
				$author$project$RichText$Config$Command$addCtrlKey,
				keyboardEvent,
				A2(
					$author$project$RichText$Config$Command$addMetaKey,
					keyboardEvent,
					A2(
						$author$project$RichText$Config$Command$addShiftKey,
						keyboardEvent,
						_List_fromArray(
							[keyboardEvent.bJ]))))));
};
var $author$project$RichText$Config$Command$namedCommandListFromKeyboardEvent = F3(
	function (shortKey, event, map) {
		var contents = map;
		var mapping = $author$project$RichText$Config$Command$keyboardEventToDictKey(event);
		var shortKeyReplaced = A2(
			$elm$core$List$map,
			function (v) {
				return _Utils_eq(v, shortKey) ? $author$project$RichText$Config$Keys$short : v;
			},
			mapping);
		var _v1 = A2($elm$core$Dict$get, shortKeyReplaced, contents.x);
		if (_v1.$ === 1) {
			var _v2 = A2($elm$core$Dict$get, mapping, contents.x);
			if (_v2.$ === 1) {
				return contents.J(event);
			} else {
				var v = _v2.a;
				return v;
			}
		} else {
			var v = _v1.a;
			var _v3 = A2($elm$core$Dict$get, mapping, contents.x);
			if (_v3.$ === 1) {
				return v;
			} else {
				var v2 = _v3.a;
				return _Utils_ap(v, v2);
			}
		}
	});
var $author$project$RichText$Internal$Editor$shortKey = function (e) {
	var c = e;
	return c.c1;
};
var $author$project$RichText$Internal$KeyDown$handleKeyDownEvent = F4(
	function (commandMap, spec, editor, event) {
		var namedCommandList = A3(
			$author$project$RichText$Config$Command$namedCommandListFromKeyboardEvent,
			$author$project$RichText$Internal$Editor$shortKey(editor),
			event,
			commandMap);
		return A3($author$project$RichText$Internal$Editor$applyNamedCommandList, namedCommandList, spec, editor);
	});
var $author$project$RichText$Internal$KeyDown$handleKeyDown = F4(
	function (keyboardEvent, commandMap, spec, editor) {
		return (keyboardEvent.bI || $author$project$RichText$Internal$Editor$isComposing(editor)) ? editor : A2(
			$elm$core$Result$withDefault,
			editor,
			A4($author$project$RichText$Internal$KeyDown$handleKeyDownEvent, commandMap, spec, editor, keyboardEvent));
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $author$project$RichText$Internal$Spec$reduceEditorFragmentArray = function (fragmentArray) {
	return A3(
		$elm$core$Array$foldl,
		F2(
			function (fragment, arr) {
				var _v0 = A2(
					$elm$core$Array$get,
					$elm$core$Array$length(arr) - 1,
					arr);
				if (_v0.$ === 1) {
					return A2($elm$core$Array$push, fragment, arr);
				} else {
					var prevFragment = _v0.a;
					if (prevFragment.$ === 1) {
						var pilf = prevFragment.a;
						if (fragment.$ === 1) {
							var ilf = fragment.a;
							return A3(
								$elm$core$Array$set,
								$elm$core$Array$length(arr) - 1,
								$author$project$RichText$Node$InlineFragment(
									A2($elm$core$Array$append, pilf, ilf)),
								arr);
						} else {
							return A2($elm$core$Array$push, fragment, arr);
						}
					} else {
						var pbnf = prevFragment.a;
						if (fragment.$ === 1) {
							return A2($elm$core$Array$push, fragment, arr);
						} else {
							var bnf = fragment.a;
							return A3(
								$elm$core$Array$set,
								$elm$core$Array$length(arr) - 1,
								$author$project$RichText$Node$BlockFragment(
									A2($elm$core$Array$append, pbnf, bnf)),
								arr);
						}
					}
				}
			}),
		$elm$core$Array$empty,
		fragmentArray);
};
var $author$project$RichText$Internal$Spec$arrayToFragment = function (results) {
	var aResult = A3(
		$elm$core$Array$foldl,
		F2(
			function (fragmentResult, arrayResult) {
				if (arrayResult.$ === 1) {
					var e = arrayResult.a;
					return $elm$core$Result$Err(e);
				} else {
					var arr = arrayResult.a;
					if (fragmentResult.$ === 1) {
						var e = fragmentResult.a;
						return $elm$core$Result$Err(e);
					} else {
						var fragment = fragmentResult.a;
						return $elm$core$Result$Ok(
							A2($elm$core$Array$push, fragment, arr));
					}
				}
			}),
		$elm$core$Result$Ok($elm$core$Array$empty),
		results);
	if (aResult.$ === 1) {
		var e = aResult.a;
		return $elm$core$Result$Err(e);
	} else {
		var result = aResult.a;
		var reducedArray = $author$project$RichText$Internal$Spec$reduceEditorFragmentArray(result);
		var _v1 = A2($elm$core$Array$get, 0, reducedArray);
		if (_v1.$ === 1) {
			return $elm$core$Result$Err('Unable to parse an editor fragment from the results');
		} else {
			var fragment = _v1.a;
			return ($elm$core$Array$length(reducedArray) !== 1) ? $elm$core$Result$Err('I received both inline and block fragments, which is invalid.') : $elm$core$Result$Ok(fragment);
		}
	}
};
var $author$project$RichText$Internal$Spec$arrayToChildNodes = F2(
	function (contentType, results) {
		if ($elm$core$Array$isEmpty(results)) {
			if (contentType.$ === 2) {
				return $elm$core$Result$Ok($author$project$RichText$Model$Node$Leaf);
			} else {
				return $elm$core$Result$Err('Invalid node type for empty fragment result array');
			}
		} else {
			var _v1 = $author$project$RichText$Internal$Spec$arrayToFragment(results);
			if (_v1.$ === 1) {
				var e = _v1.a;
				return $elm$core$Result$Err(e);
			} else {
				var fragment = _v1.a;
				if (fragment.$ === 1) {
					var ilf = fragment.a;
					if (contentType.$ === 1) {
						return $elm$core$Result$Ok(
							$author$project$RichText$Model$Node$inlineChildren(ilf));
					} else {
						return $elm$core$Result$Err('I received an inline leaf fragment, but the node I parsed doesn\'t accept this child type');
					}
				} else {
					var bnf = fragment.a;
					if (!contentType.$) {
						return $elm$core$Result$Ok(
							$author$project$RichText$Model$Node$blockChildren(bnf));
					} else {
						return $elm$core$Result$Err('I received a block node fragment, but the node I parsed doesn\'t accept this child type');
					}
				}
			}
		}
	});
var $author$project$RichText$Config$Spec$elementDefinitions = function (spec) {
	var c = spec;
	return c.aD;
};
var $author$project$RichText$Config$ElementDefinition$fromHtmlNode = function (definition_) {
	var c = definition_;
	return c.by;
};
var $author$project$RichText$Config$MarkDefinition$fromHtmlNode = function (definition_) {
	var c = definition_;
	return c.by;
};
var $author$project$RichText$Internal$Spec$htmlNodeToMark = F2(
	function (spec, node) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (definition, result) {
					if (result.$ === 1) {
						var _v1 = A3($author$project$RichText$Config$MarkDefinition$fromHtmlNode, definition, definition, node);
						if (_v1.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var m = _v1.a;
							return $elm$core$Maybe$Just(m);
						}
					} else {
						return result;
					}
				}),
			$elm$core$Maybe$Nothing,
			$author$project$RichText$Config$Spec$markDefinitions(spec));
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$RichText$Internal$Constants$zeroWidthSpace = '\u200B';
var $author$project$RichText$Internal$Spec$htmlNodeToEditorFragment = F3(
	function (spec, marks, node) {
		if (node.$ === 1) {
			var s = node.a;
			return $elm$core$Result$Ok(
				$author$project$RichText$Node$InlineFragment(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$RichText$Model$Node$Text(
								A2(
									$author$project$RichText$Model$Text$withMarks,
									marks,
									A2(
										$author$project$RichText$Model$Text$withText,
										A3($elm$core$String$replace, $author$project$RichText$Internal$Constants$zeroWidthSpace, '', s),
										$author$project$RichText$Model$Text$empty)))
							]))));
		} else {
			var definitions = $author$project$RichText$Config$Spec$elementDefinitions(spec);
			var maybeElementAndChildren = A3(
				$elm$core$List$foldl,
				F2(
					function (definition, result) {
						if (result.$ === 1) {
							var _v8 = A3($author$project$RichText$Config$ElementDefinition$fromHtmlNode, definition, definition, node);
							if (_v8.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var v = _v8.a;
								return $elm$core$Maybe$Just(
									_Utils_Tuple2(definition, v));
							}
						} else {
							return result;
						}
					}),
				$elm$core$Maybe$Nothing,
				definitions);
			if (!maybeElementAndChildren.$) {
				var _v2 = maybeElementAndChildren.a;
				var definition = _v2.a;
				var _v3 = _v2.b;
				var element = _v3.a;
				var children = _v3.b;
				var contentType = $author$project$RichText$Config$ElementDefinition$contentType(definition);
				if (_Utils_eq(contentType, $author$project$RichText$Internal$Definitions$InlineLeafNodeType)) {
					return $elm$core$Result$Ok(
						$author$project$RichText$Node$InlineFragment(
							$elm$core$Array$fromList(
								_List_fromArray(
									[
										$author$project$RichText$Model$Node$InlineElement(
										A2($author$project$RichText$Model$InlineElement$inlineElement, element, marks))
									]))));
				} else {
					var childArr = A2(
						$elm$core$Array$map,
						A2($author$project$RichText$Internal$Spec$htmlNodeToEditorFragment, spec, _List_Nil),
						children);
					var _v4 = A2($author$project$RichText$Internal$Spec$arrayToChildNodes, contentType, childArr);
					if (_v4.$ === 1) {
						var s = _v4.a;
						return $elm$core$Result$Err(s);
					} else {
						var childNodes = _v4.a;
						return $elm$core$Result$Ok(
							$author$project$RichText$Node$BlockFragment(
								$elm$core$Array$fromList(
									_List_fromArray(
										[
											A2($author$project$RichText$Model$Node$block, element, childNodes)
										]))));
					}
				}
			} else {
				var _v5 = A2($author$project$RichText$Internal$Spec$htmlNodeToMark, spec, node);
				if (_v5.$ === 1) {
					return $elm$core$Result$Err('No mark or node matches the spec');
				} else {
					var _v6 = _v5.a;
					var mark = _v6.a;
					var children = _v6.b;
					var newMarks = A4(
						$author$project$RichText$Model$Mark$toggle,
						0,
						$author$project$RichText$Model$Mark$markOrderFromSpec(spec),
						mark,
						marks);
					var newChildren = A2(
						$elm$core$Array$map,
						A2($author$project$RichText$Internal$Spec$htmlNodeToEditorFragment, spec, newMarks),
						children);
					return $author$project$RichText$Internal$Spec$arrayToFragment(newChildren);
				}
			}
		}
	});
var $elm$core$Tuple$mapFirst = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			func(x),
			y);
	});
var $author$project$RichText$Internal$Spec$resultFilterMap = F2(
	function (f, xs) {
		var maybePush = F3(
			function (f_, mx, xs_) {
				var _v0 = f_(mx);
				if (!_v0.$) {
					var x = _v0.a;
					return A2(
						$elm$core$Tuple$mapFirst,
						$elm$core$Array$push(x),
						xs_);
				} else {
					var err = _v0.a;
					return A2(
						$elm$core$Tuple$mapSecond,
						$elm$core$List$cons(err),
						xs_);
				}
			});
		return A3(
			$elm$core$Array$foldl,
			maybePush(f),
			_Utils_Tuple2($elm$core$Array$empty, _List_Nil),
			xs);
	});
var $author$project$RichText$Model$HtmlNode$TextNode = function (a) {
	return {$: 1, a: a};
};
var $elm$core$String$toLower = _String_toLower;
var $author$project$RichText$Internal$Spec$nodeListToHtmlNodeArray = function (nodeList) {
	return $elm$core$Array$fromList(
		A2(
			$elm$core$List$concatMap,
			function (n) {
				switch (n.$) {
					case 1:
						var name = n.a;
						var attributes = n.b;
						var children = n.c;
						return ($elm$core$String$toLower(name) !== 'meta') ? _List_fromArray(
							[
								A3(
								$author$project$RichText$Model$HtmlNode$ElementNode,
								name,
								attributes,
								$author$project$RichText$Internal$Spec$nodeListToHtmlNodeArray(children))
							]) : _List_Nil;
					case 0:
						var s = n.a;
						return _List_fromArray(
							[
								$author$project$RichText$Model$HtmlNode$TextNode(s)
							]);
					default:
						return _List_Nil;
				}
			},
			nodeList));
};
var $hecrj$html_parser$Html$Parser$Element = F3(
	function (a, b, c) {
		return {$: 1, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {bp: col, cu: contextStack, bU: problem, b0: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.b0, s.bp, x, s.e));
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.b, s.b6);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bp: 1, e: s.e, g: s.g, b: s.b + 1, b0: s.b0 + 1, b6: s.b6}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bp: s.bp + 1, e: s.e, g: s.g, b: newOffset, b0: s.b0, b6: s.b6}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.b6);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.b, offset) < 0,
					0,
					{bp: col, e: s0.e, g: s0.g, b: offset, b0: row, b6: s0.b6});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.b, s.b0, s.bp, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $hecrj$html_parser$Html$Parser$chompOneOrMore = function (fn) {
	return A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$chompIf(fn),
		$elm$parser$Parser$chompWhile(fn));
};
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.b, s1.b, s0.b6),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $hecrj$html_parser$Html$Parser$isSpaceCharacter = function (c) {
	return (c === ' ') || ((c === '\t') || ((c === '\n') || ((c === '\u000D') || ((c === '\u000C') || (c === '\u00A0')))));
};
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $hecrj$html_parser$Html$Parser$closingTag = function (name) {
	var chompName = A2(
		$elm$parser$Parser$andThen,
		function (closingName) {
			return _Utils_eq(
				$elm$core$String$toLower(closingName),
				name) ? $elm$parser$Parser$succeed(0) : $elm$parser$Parser$problem('closing tag does not match opening tag: ' + name);
		},
		$elm$parser$Parser$getChompedString(
			$hecrj$html_parser$Html$Parser$chompOneOrMore(
				function (c) {
					return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && (c !== '>');
				})));
	return A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('<')),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('/'))),
				chompName),
			$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('>')));
};
var $hecrj$html_parser$Html$Parser$Comment = function (a) {
	return {$: 2, a: a};
};
var $elm$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $elm$parser$Parser$Advanced$fromInfo = F4(
	function (row, col, x, context) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, row, col, x, context));
	});
var $elm$parser$Parser$Advanced$chompUntil = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$findSubString, str, s.b, s.b0, s.bp, s.b6);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A4($elm$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.e)) : A3(
			$elm$parser$Parser$Advanced$Good,
			_Utils_cmp(s.b, newOffset) < 0,
			0,
			{bp: newCol, e: s.e, g: s.g, b: newOffset, b0: newRow, b6: s.b6});
	};
};
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$chompUntil = function (str) {
	return $elm$parser$Parser$Advanced$chompUntil(
		$elm$parser$Parser$toToken(str));
};
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.b, s.b0, s.bp, s.b6);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{bp: newCol, e: s.e, g: s.g, b: newOffset, b0: newRow, b6: s.b6});
	};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $hecrj$html_parser$Html$Parser$commentString = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$token('<!')),
		$elm$parser$Parser$token('--')),
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$getChompedString(
			$elm$parser$Parser$chompUntil('-->')),
		$elm$parser$Parser$token('-->')));
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $hecrj$html_parser$Html$Parser$comment = A2($elm$parser$Parser$map, $hecrj$html_parser$Html$Parser$Comment, $hecrj$html_parser$Html$Parser$commentString);
var $hecrj$html_parser$Html$Parser$voidElements = _List_fromArray(
	['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
var $hecrj$html_parser$Html$Parser$isVoidElement = function (name) {
	return A2($elm$core$List$member, name, $hecrj$html_parser$Html$Parser$voidElements);
};
var $elm$parser$Parser$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$loopHelp = F4(
	function (p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
						$temp$state = newState,
						$temp$callback = callback,
						$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($elm$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $elm$parser$Parser$Advanced$loop = F2(
	function (state, callback) {
		return function (s) {
			return A4($elm$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $elm$parser$Parser$Advanced$Done = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Loop = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$toAdvancedStep = function (step) {
	if (!step.$) {
		var s = step.a;
		return $elm$parser$Parser$Advanced$Loop(s);
	} else {
		var a = step.a;
		return $elm$parser$Parser$Advanced$Done(a);
	}
};
var $elm$parser$Parser$loop = F2(
	function (state, callback) {
		return A2(
			$elm$parser$Parser$Advanced$loop,
			state,
			function (s) {
				return A2(
					$elm$parser$Parser$map,
					$elm$parser$Parser$toAdvancedStep,
					callback(s));
			});
	});
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $hecrj$html_parser$Html$Parser$many = function (parser_) {
	return A2(
		$elm$parser$Parser$loop,
		_List_Nil,
		function (list) {
			return $elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						A2(
						$elm$parser$Parser$map,
						function (_new) {
							return $elm$parser$Parser$Loop(
								A2($elm$core$List$cons, _new, list));
						},
						parser_),
						$elm$parser$Parser$succeed(
						$elm$parser$Parser$Done(
							$elm$core$List$reverse(list)))
					]));
		});
};
var $hecrj$html_parser$Html$Parser$isTagAttributeCharacter = function (c) {
	return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && ((c !== '\"') && ((c !== '\'') && ((c !== '>') && ((c !== '/') && (c !== '=')))));
};
var $hecrj$html_parser$Html$Parser$tagAttributeName = A2(
	$elm$parser$Parser$map,
	$elm$core$String$toLower,
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($hecrj$html_parser$Html$Parser$isTagAttributeCharacter)));
var $hecrj$html_parser$Html$Parser$chompSemicolon = $elm$parser$Parser$chompIf(
	$elm$core$Basics$eq(';'));
var $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('Aacute', 'Á'),
			_Utils_Tuple2('aacute', 'á'),
			_Utils_Tuple2('Abreve', 'Ă'),
			_Utils_Tuple2('abreve', 'ă'),
			_Utils_Tuple2('ac', '∾'),
			_Utils_Tuple2('acd', '∿'),
			_Utils_Tuple2('acE', '∾̳'),
			_Utils_Tuple2('Acirc', 'Â'),
			_Utils_Tuple2('acirc', 'â'),
			_Utils_Tuple2('acute', '´'),
			_Utils_Tuple2('Acy', 'А'),
			_Utils_Tuple2('acy', 'а'),
			_Utils_Tuple2('AElig', 'Æ'),
			_Utils_Tuple2('aelig', 'æ'),
			_Utils_Tuple2('af', '\u2061'),
			_Utils_Tuple2('Afr', '\uD835\uDD04'),
			_Utils_Tuple2('afr', '\uD835\uDD1E'),
			_Utils_Tuple2('Agrave', 'À'),
			_Utils_Tuple2('agrave', 'à'),
			_Utils_Tuple2('alefsym', 'ℵ'),
			_Utils_Tuple2('aleph', 'ℵ'),
			_Utils_Tuple2('Alpha', 'Α'),
			_Utils_Tuple2('alpha', 'α'),
			_Utils_Tuple2('Amacr', 'Ā'),
			_Utils_Tuple2('amacr', 'ā'),
			_Utils_Tuple2('amalg', '⨿'),
			_Utils_Tuple2('amp', '&'),
			_Utils_Tuple2('AMP', '&'),
			_Utils_Tuple2('andand', '⩕'),
			_Utils_Tuple2('And', '⩓'),
			_Utils_Tuple2('and', '∧'),
			_Utils_Tuple2('andd', '⩜'),
			_Utils_Tuple2('andslope', '⩘'),
			_Utils_Tuple2('andv', '⩚'),
			_Utils_Tuple2('ang', '∠'),
			_Utils_Tuple2('ange', '⦤'),
			_Utils_Tuple2('angle', '∠'),
			_Utils_Tuple2('angmsdaa', '⦨'),
			_Utils_Tuple2('angmsdab', '⦩'),
			_Utils_Tuple2('angmsdac', '⦪'),
			_Utils_Tuple2('angmsdad', '⦫'),
			_Utils_Tuple2('angmsdae', '⦬'),
			_Utils_Tuple2('angmsdaf', '⦭'),
			_Utils_Tuple2('angmsdag', '⦮'),
			_Utils_Tuple2('angmsdah', '⦯'),
			_Utils_Tuple2('angmsd', '∡'),
			_Utils_Tuple2('angrt', '∟'),
			_Utils_Tuple2('angrtvb', '⊾'),
			_Utils_Tuple2('angrtvbd', '⦝'),
			_Utils_Tuple2('angsph', '∢'),
			_Utils_Tuple2('angst', 'Å'),
			_Utils_Tuple2('angzarr', '⍼'),
			_Utils_Tuple2('Aogon', 'Ą'),
			_Utils_Tuple2('aogon', 'ą'),
			_Utils_Tuple2('Aopf', '\uD835\uDD38'),
			_Utils_Tuple2('aopf', '\uD835\uDD52'),
			_Utils_Tuple2('apacir', '⩯'),
			_Utils_Tuple2('ap', '≈'),
			_Utils_Tuple2('apE', '⩰'),
			_Utils_Tuple2('ape', '≊'),
			_Utils_Tuple2('apid', '≋'),
			_Utils_Tuple2('apos', '\''),
			_Utils_Tuple2('ApplyFunction', '\u2061'),
			_Utils_Tuple2('approx', '≈'),
			_Utils_Tuple2('approxeq', '≊'),
			_Utils_Tuple2('Aring', 'Å'),
			_Utils_Tuple2('aring', 'å'),
			_Utils_Tuple2('Ascr', '\uD835\uDC9C'),
			_Utils_Tuple2('ascr', '\uD835\uDCB6'),
			_Utils_Tuple2('Assign', '≔'),
			_Utils_Tuple2('ast', '*'),
			_Utils_Tuple2('asymp', '≈'),
			_Utils_Tuple2('asympeq', '≍'),
			_Utils_Tuple2('Atilde', 'Ã'),
			_Utils_Tuple2('atilde', 'ã'),
			_Utils_Tuple2('Auml', 'Ä'),
			_Utils_Tuple2('auml', 'ä'),
			_Utils_Tuple2('awconint', '∳'),
			_Utils_Tuple2('awint', '⨑'),
			_Utils_Tuple2('backcong', '≌'),
			_Utils_Tuple2('backepsilon', '϶'),
			_Utils_Tuple2('backprime', '‵'),
			_Utils_Tuple2('backsim', '∽'),
			_Utils_Tuple2('backsimeq', '⋍'),
			_Utils_Tuple2('Backslash', '∖'),
			_Utils_Tuple2('Barv', '⫧'),
			_Utils_Tuple2('barvee', '⊽'),
			_Utils_Tuple2('barwed', '⌅'),
			_Utils_Tuple2('Barwed', '⌆'),
			_Utils_Tuple2('barwedge', '⌅'),
			_Utils_Tuple2('bbrk', '⎵'),
			_Utils_Tuple2('bbrktbrk', '⎶'),
			_Utils_Tuple2('bcong', '≌'),
			_Utils_Tuple2('Bcy', 'Б'),
			_Utils_Tuple2('bcy', 'б'),
			_Utils_Tuple2('bdquo', '„'),
			_Utils_Tuple2('becaus', '∵'),
			_Utils_Tuple2('because', '∵'),
			_Utils_Tuple2('Because', '∵'),
			_Utils_Tuple2('bemptyv', '⦰'),
			_Utils_Tuple2('bepsi', '϶'),
			_Utils_Tuple2('bernou', 'ℬ'),
			_Utils_Tuple2('Bernoullis', 'ℬ'),
			_Utils_Tuple2('Beta', 'Β'),
			_Utils_Tuple2('beta', 'β'),
			_Utils_Tuple2('beth', 'ℶ'),
			_Utils_Tuple2('between', '≬'),
			_Utils_Tuple2('Bfr', '\uD835\uDD05'),
			_Utils_Tuple2('bfr', '\uD835\uDD1F'),
			_Utils_Tuple2('bigcap', '⋂'),
			_Utils_Tuple2('bigcirc', '◯'),
			_Utils_Tuple2('bigcup', '⋃'),
			_Utils_Tuple2('bigodot', '⨀'),
			_Utils_Tuple2('bigoplus', '⨁'),
			_Utils_Tuple2('bigotimes', '⨂'),
			_Utils_Tuple2('bigsqcup', '⨆'),
			_Utils_Tuple2('bigstar', '★'),
			_Utils_Tuple2('bigtriangledown', '▽'),
			_Utils_Tuple2('bigtriangleup', '△'),
			_Utils_Tuple2('biguplus', '⨄'),
			_Utils_Tuple2('bigvee', '⋁'),
			_Utils_Tuple2('bigwedge', '⋀'),
			_Utils_Tuple2('bkarow', '⤍'),
			_Utils_Tuple2('blacklozenge', '⧫'),
			_Utils_Tuple2('blacksquare', '▪'),
			_Utils_Tuple2('blacktriangle', '▴'),
			_Utils_Tuple2('blacktriangledown', '▾'),
			_Utils_Tuple2('blacktriangleleft', '◂'),
			_Utils_Tuple2('blacktriangleright', '▸'),
			_Utils_Tuple2('blank', '␣'),
			_Utils_Tuple2('blk12', '▒'),
			_Utils_Tuple2('blk14', '░'),
			_Utils_Tuple2('blk34', '▓'),
			_Utils_Tuple2('block', '█'),
			_Utils_Tuple2('bne', '=⃥'),
			_Utils_Tuple2('bnequiv', '≡⃥'),
			_Utils_Tuple2('bNot', '⫭'),
			_Utils_Tuple2('bnot', '⌐'),
			_Utils_Tuple2('Bopf', '\uD835\uDD39'),
			_Utils_Tuple2('bopf', '\uD835\uDD53'),
			_Utils_Tuple2('bot', '⊥'),
			_Utils_Tuple2('bottom', '⊥'),
			_Utils_Tuple2('bowtie', '⋈'),
			_Utils_Tuple2('boxbox', '⧉'),
			_Utils_Tuple2('boxdl', '┐'),
			_Utils_Tuple2('boxdL', '╕'),
			_Utils_Tuple2('boxDl', '╖'),
			_Utils_Tuple2('boxDL', '╗'),
			_Utils_Tuple2('boxdr', '┌'),
			_Utils_Tuple2('boxdR', '╒'),
			_Utils_Tuple2('boxDr', '╓'),
			_Utils_Tuple2('boxDR', '╔'),
			_Utils_Tuple2('boxh', '─'),
			_Utils_Tuple2('boxH', '═'),
			_Utils_Tuple2('boxhd', '┬'),
			_Utils_Tuple2('boxHd', '╤'),
			_Utils_Tuple2('boxhD', '╥'),
			_Utils_Tuple2('boxHD', '╦'),
			_Utils_Tuple2('boxhu', '┴'),
			_Utils_Tuple2('boxHu', '╧'),
			_Utils_Tuple2('boxhU', '╨'),
			_Utils_Tuple2('boxHU', '╩'),
			_Utils_Tuple2('boxminus', '⊟'),
			_Utils_Tuple2('boxplus', '⊞'),
			_Utils_Tuple2('boxtimes', '⊠'),
			_Utils_Tuple2('boxul', '┘'),
			_Utils_Tuple2('boxuL', '╛'),
			_Utils_Tuple2('boxUl', '╜'),
			_Utils_Tuple2('boxUL', '╝'),
			_Utils_Tuple2('boxur', '└'),
			_Utils_Tuple2('boxuR', '╘'),
			_Utils_Tuple2('boxUr', '╙'),
			_Utils_Tuple2('boxUR', '╚'),
			_Utils_Tuple2('boxv', '│'),
			_Utils_Tuple2('boxV', '║'),
			_Utils_Tuple2('boxvh', '┼'),
			_Utils_Tuple2('boxvH', '╪'),
			_Utils_Tuple2('boxVh', '╫'),
			_Utils_Tuple2('boxVH', '╬'),
			_Utils_Tuple2('boxvl', '┤'),
			_Utils_Tuple2('boxvL', '╡'),
			_Utils_Tuple2('boxVl', '╢'),
			_Utils_Tuple2('boxVL', '╣'),
			_Utils_Tuple2('boxvr', '├'),
			_Utils_Tuple2('boxvR', '╞'),
			_Utils_Tuple2('boxVr', '╟'),
			_Utils_Tuple2('boxVR', '╠'),
			_Utils_Tuple2('bprime', '‵'),
			_Utils_Tuple2('breve', '˘'),
			_Utils_Tuple2('Breve', '˘'),
			_Utils_Tuple2('brvbar', '¦'),
			_Utils_Tuple2('bscr', '\uD835\uDCB7'),
			_Utils_Tuple2('Bscr', 'ℬ'),
			_Utils_Tuple2('bsemi', '⁏'),
			_Utils_Tuple2('bsim', '∽'),
			_Utils_Tuple2('bsime', '⋍'),
			_Utils_Tuple2('bsolb', '⧅'),
			_Utils_Tuple2('bsol', '\\'),
			_Utils_Tuple2('bsolhsub', '⟈'),
			_Utils_Tuple2('bull', '•'),
			_Utils_Tuple2('bullet', '•'),
			_Utils_Tuple2('bump', '≎'),
			_Utils_Tuple2('bumpE', '⪮'),
			_Utils_Tuple2('bumpe', '≏'),
			_Utils_Tuple2('Bumpeq', '≎'),
			_Utils_Tuple2('bumpeq', '≏'),
			_Utils_Tuple2('Cacute', 'Ć'),
			_Utils_Tuple2('cacute', 'ć'),
			_Utils_Tuple2('capand', '⩄'),
			_Utils_Tuple2('capbrcup', '⩉'),
			_Utils_Tuple2('capcap', '⩋'),
			_Utils_Tuple2('cap', '∩'),
			_Utils_Tuple2('Cap', '⋒'),
			_Utils_Tuple2('capcup', '⩇'),
			_Utils_Tuple2('capdot', '⩀'),
			_Utils_Tuple2('CapitalDifferentialD', 'ⅅ'),
			_Utils_Tuple2('caps', '∩︀'),
			_Utils_Tuple2('caret', '⁁'),
			_Utils_Tuple2('caron', 'ˇ'),
			_Utils_Tuple2('Cayleys', 'ℭ'),
			_Utils_Tuple2('ccaps', '⩍'),
			_Utils_Tuple2('Ccaron', 'Č'),
			_Utils_Tuple2('ccaron', 'č'),
			_Utils_Tuple2('Ccedil', 'Ç'),
			_Utils_Tuple2('ccedil', 'ç'),
			_Utils_Tuple2('Ccirc', 'Ĉ'),
			_Utils_Tuple2('ccirc', 'ĉ'),
			_Utils_Tuple2('Cconint', '∰'),
			_Utils_Tuple2('ccups', '⩌'),
			_Utils_Tuple2('ccupssm', '⩐'),
			_Utils_Tuple2('Cdot', 'Ċ'),
			_Utils_Tuple2('cdot', 'ċ'),
			_Utils_Tuple2('cedil', '¸'),
			_Utils_Tuple2('Cedilla', '¸'),
			_Utils_Tuple2('cemptyv', '⦲'),
			_Utils_Tuple2('cent', '¢'),
			_Utils_Tuple2('centerdot', '·'),
			_Utils_Tuple2('CenterDot', '·'),
			_Utils_Tuple2('cfr', '\uD835\uDD20'),
			_Utils_Tuple2('Cfr', 'ℭ'),
			_Utils_Tuple2('CHcy', 'Ч'),
			_Utils_Tuple2('chcy', 'ч'),
			_Utils_Tuple2('check', '✓'),
			_Utils_Tuple2('checkmark', '✓'),
			_Utils_Tuple2('Chi', 'Χ'),
			_Utils_Tuple2('chi', 'χ'),
			_Utils_Tuple2('circ', 'ˆ'),
			_Utils_Tuple2('circeq', '≗'),
			_Utils_Tuple2('circlearrowleft', '↺'),
			_Utils_Tuple2('circlearrowright', '↻'),
			_Utils_Tuple2('circledast', '⊛'),
			_Utils_Tuple2('circledcirc', '⊚'),
			_Utils_Tuple2('circleddash', '⊝'),
			_Utils_Tuple2('CircleDot', '⊙'),
			_Utils_Tuple2('circledR', '®'),
			_Utils_Tuple2('circledS', 'Ⓢ'),
			_Utils_Tuple2('CircleMinus', '⊖'),
			_Utils_Tuple2('CirclePlus', '⊕'),
			_Utils_Tuple2('CircleTimes', '⊗'),
			_Utils_Tuple2('cir', '○'),
			_Utils_Tuple2('cirE', '⧃'),
			_Utils_Tuple2('cire', '≗'),
			_Utils_Tuple2('cirfnint', '⨐'),
			_Utils_Tuple2('cirmid', '⫯'),
			_Utils_Tuple2('cirscir', '⧂'),
			_Utils_Tuple2('ClockwiseContourIntegral', '∲'),
			_Utils_Tuple2('CloseCurlyDoubleQuote', '”'),
			_Utils_Tuple2('CloseCurlyQuote', '’'),
			_Utils_Tuple2('clubs', '♣'),
			_Utils_Tuple2('clubsuit', '♣'),
			_Utils_Tuple2('colon', ':'),
			_Utils_Tuple2('Colon', '∷'),
			_Utils_Tuple2('Colone', '⩴'),
			_Utils_Tuple2('colone', '≔'),
			_Utils_Tuple2('coloneq', '≔'),
			_Utils_Tuple2('comma', ','),
			_Utils_Tuple2('commat', '@'),
			_Utils_Tuple2('comp', '∁'),
			_Utils_Tuple2('compfn', '∘'),
			_Utils_Tuple2('complement', '∁'),
			_Utils_Tuple2('complexes', 'ℂ'),
			_Utils_Tuple2('cong', '≅'),
			_Utils_Tuple2('congdot', '⩭'),
			_Utils_Tuple2('Congruent', '≡'),
			_Utils_Tuple2('conint', '∮'),
			_Utils_Tuple2('Conint', '∯'),
			_Utils_Tuple2('ContourIntegral', '∮'),
			_Utils_Tuple2('copf', '\uD835\uDD54'),
			_Utils_Tuple2('Copf', 'ℂ'),
			_Utils_Tuple2('coprod', '∐'),
			_Utils_Tuple2('Coproduct', '∐'),
			_Utils_Tuple2('copy', '©'),
			_Utils_Tuple2('COPY', '©'),
			_Utils_Tuple2('copysr', '℗'),
			_Utils_Tuple2('CounterClockwiseContourIntegral', '∳'),
			_Utils_Tuple2('crarr', '↵'),
			_Utils_Tuple2('cross', '✗'),
			_Utils_Tuple2('Cross', '⨯'),
			_Utils_Tuple2('Cscr', '\uD835\uDC9E'),
			_Utils_Tuple2('cscr', '\uD835\uDCB8'),
			_Utils_Tuple2('csub', '⫏'),
			_Utils_Tuple2('csube', '⫑'),
			_Utils_Tuple2('csup', '⫐'),
			_Utils_Tuple2('csupe', '⫒'),
			_Utils_Tuple2('ctdot', '⋯'),
			_Utils_Tuple2('cudarrl', '⤸'),
			_Utils_Tuple2('cudarrr', '⤵'),
			_Utils_Tuple2('cuepr', '⋞'),
			_Utils_Tuple2('cuesc', '⋟'),
			_Utils_Tuple2('cularr', '↶'),
			_Utils_Tuple2('cularrp', '⤽'),
			_Utils_Tuple2('cupbrcap', '⩈'),
			_Utils_Tuple2('cupcap', '⩆'),
			_Utils_Tuple2('CupCap', '≍'),
			_Utils_Tuple2('cup', '∪'),
			_Utils_Tuple2('Cup', '⋓'),
			_Utils_Tuple2('cupcup', '⩊'),
			_Utils_Tuple2('cupdot', '⊍'),
			_Utils_Tuple2('cupor', '⩅'),
			_Utils_Tuple2('cups', '∪︀'),
			_Utils_Tuple2('curarr', '↷'),
			_Utils_Tuple2('curarrm', '⤼'),
			_Utils_Tuple2('curlyeqprec', '⋞'),
			_Utils_Tuple2('curlyeqsucc', '⋟'),
			_Utils_Tuple2('curlyvee', '⋎'),
			_Utils_Tuple2('curlywedge', '⋏'),
			_Utils_Tuple2('curren', '¤'),
			_Utils_Tuple2('curvearrowleft', '↶'),
			_Utils_Tuple2('curvearrowright', '↷'),
			_Utils_Tuple2('cuvee', '⋎'),
			_Utils_Tuple2('cuwed', '⋏'),
			_Utils_Tuple2('cwconint', '∲'),
			_Utils_Tuple2('cwint', '∱'),
			_Utils_Tuple2('cylcty', '⌭'),
			_Utils_Tuple2('dagger', '†'),
			_Utils_Tuple2('Dagger', '‡'),
			_Utils_Tuple2('daleth', 'ℸ'),
			_Utils_Tuple2('darr', '↓'),
			_Utils_Tuple2('Darr', '↡'),
			_Utils_Tuple2('dArr', '⇓'),
			_Utils_Tuple2('dash', '‐'),
			_Utils_Tuple2('Dashv', '⫤'),
			_Utils_Tuple2('dashv', '⊣'),
			_Utils_Tuple2('dbkarow', '⤏'),
			_Utils_Tuple2('dblac', '˝'),
			_Utils_Tuple2('Dcaron', 'Ď'),
			_Utils_Tuple2('dcaron', 'ď'),
			_Utils_Tuple2('Dcy', 'Д'),
			_Utils_Tuple2('dcy', 'д'),
			_Utils_Tuple2('ddagger', '‡'),
			_Utils_Tuple2('ddarr', '⇊'),
			_Utils_Tuple2('DD', 'ⅅ'),
			_Utils_Tuple2('dd', 'ⅆ'),
			_Utils_Tuple2('DDotrahd', '⤑'),
			_Utils_Tuple2('ddotseq', '⩷'),
			_Utils_Tuple2('deg', '°'),
			_Utils_Tuple2('Del', '∇'),
			_Utils_Tuple2('Delta', 'Δ'),
			_Utils_Tuple2('delta', 'δ'),
			_Utils_Tuple2('demptyv', '⦱'),
			_Utils_Tuple2('dfisht', '⥿'),
			_Utils_Tuple2('Dfr', '\uD835\uDD07'),
			_Utils_Tuple2('dfr', '\uD835\uDD21'),
			_Utils_Tuple2('dHar', '⥥'),
			_Utils_Tuple2('dharl', '⇃'),
			_Utils_Tuple2('dharr', '⇂'),
			_Utils_Tuple2('DiacriticalAcute', '´'),
			_Utils_Tuple2('DiacriticalDot', '˙'),
			_Utils_Tuple2('DiacriticalDoubleAcute', '˝'),
			_Utils_Tuple2('DiacriticalGrave', '`'),
			_Utils_Tuple2('DiacriticalTilde', '˜'),
			_Utils_Tuple2('diam', '⋄'),
			_Utils_Tuple2('diamond', '⋄'),
			_Utils_Tuple2('Diamond', '⋄'),
			_Utils_Tuple2('diamondsuit', '♦'),
			_Utils_Tuple2('diams', '♦'),
			_Utils_Tuple2('die', '¨'),
			_Utils_Tuple2('DifferentialD', 'ⅆ'),
			_Utils_Tuple2('digamma', 'ϝ'),
			_Utils_Tuple2('disin', '⋲'),
			_Utils_Tuple2('div', '÷'),
			_Utils_Tuple2('divide', '÷'),
			_Utils_Tuple2('divideontimes', '⋇'),
			_Utils_Tuple2('divonx', '⋇'),
			_Utils_Tuple2('DJcy', 'Ђ'),
			_Utils_Tuple2('djcy', 'ђ'),
			_Utils_Tuple2('dlcorn', '⌞'),
			_Utils_Tuple2('dlcrop', '⌍'),
			_Utils_Tuple2('dollar', '$'),
			_Utils_Tuple2('Dopf', '\uD835\uDD3B'),
			_Utils_Tuple2('dopf', '\uD835\uDD55'),
			_Utils_Tuple2('Dot', '¨'),
			_Utils_Tuple2('dot', '˙'),
			_Utils_Tuple2('DotDot', '⃜'),
			_Utils_Tuple2('doteq', '≐'),
			_Utils_Tuple2('doteqdot', '≑'),
			_Utils_Tuple2('DotEqual', '≐'),
			_Utils_Tuple2('dotminus', '∸'),
			_Utils_Tuple2('dotplus', '∔'),
			_Utils_Tuple2('dotsquare', '⊡'),
			_Utils_Tuple2('doublebarwedge', '⌆'),
			_Utils_Tuple2('DoubleContourIntegral', '∯'),
			_Utils_Tuple2('DoubleDot', '¨'),
			_Utils_Tuple2('DoubleDownArrow', '⇓'),
			_Utils_Tuple2('DoubleLeftArrow', '⇐'),
			_Utils_Tuple2('DoubleLeftRightArrow', '⇔'),
			_Utils_Tuple2('DoubleLeftTee', '⫤'),
			_Utils_Tuple2('DoubleLongLeftArrow', '⟸'),
			_Utils_Tuple2('DoubleLongLeftRightArrow', '⟺'),
			_Utils_Tuple2('DoubleLongRightArrow', '⟹'),
			_Utils_Tuple2('DoubleRightArrow', '⇒'),
			_Utils_Tuple2('DoubleRightTee', '⊨'),
			_Utils_Tuple2('DoubleUpArrow', '⇑'),
			_Utils_Tuple2('DoubleUpDownArrow', '⇕'),
			_Utils_Tuple2('DoubleVerticalBar', '∥'),
			_Utils_Tuple2('DownArrowBar', '⤓'),
			_Utils_Tuple2('downarrow', '↓'),
			_Utils_Tuple2('DownArrow', '↓'),
			_Utils_Tuple2('Downarrow', '⇓'),
			_Utils_Tuple2('DownArrowUpArrow', '⇵'),
			_Utils_Tuple2('DownBreve', '̑'),
			_Utils_Tuple2('downdownarrows', '⇊'),
			_Utils_Tuple2('downharpoonleft', '⇃'),
			_Utils_Tuple2('downharpoonright', '⇂'),
			_Utils_Tuple2('DownLeftRightVector', '⥐'),
			_Utils_Tuple2('DownLeftTeeVector', '⥞'),
			_Utils_Tuple2('DownLeftVectorBar', '⥖'),
			_Utils_Tuple2('DownLeftVector', '↽'),
			_Utils_Tuple2('DownRightTeeVector', '⥟'),
			_Utils_Tuple2('DownRightVectorBar', '⥗'),
			_Utils_Tuple2('DownRightVector', '⇁'),
			_Utils_Tuple2('DownTeeArrow', '↧'),
			_Utils_Tuple2('DownTee', '⊤'),
			_Utils_Tuple2('drbkarow', '⤐'),
			_Utils_Tuple2('drcorn', '⌟'),
			_Utils_Tuple2('drcrop', '⌌'),
			_Utils_Tuple2('Dscr', '\uD835\uDC9F'),
			_Utils_Tuple2('dscr', '\uD835\uDCB9'),
			_Utils_Tuple2('DScy', 'Ѕ'),
			_Utils_Tuple2('dscy', 'ѕ'),
			_Utils_Tuple2('dsol', '⧶'),
			_Utils_Tuple2('Dstrok', 'Đ'),
			_Utils_Tuple2('dstrok', 'đ'),
			_Utils_Tuple2('dtdot', '⋱'),
			_Utils_Tuple2('dtri', '▿'),
			_Utils_Tuple2('dtrif', '▾'),
			_Utils_Tuple2('duarr', '⇵'),
			_Utils_Tuple2('duhar', '⥯'),
			_Utils_Tuple2('dwangle', '⦦'),
			_Utils_Tuple2('DZcy', 'Џ'),
			_Utils_Tuple2('dzcy', 'џ'),
			_Utils_Tuple2('dzigrarr', '⟿'),
			_Utils_Tuple2('Eacute', 'É'),
			_Utils_Tuple2('eacute', 'é'),
			_Utils_Tuple2('easter', '⩮'),
			_Utils_Tuple2('Ecaron', 'Ě'),
			_Utils_Tuple2('ecaron', 'ě'),
			_Utils_Tuple2('Ecirc', 'Ê'),
			_Utils_Tuple2('ecirc', 'ê'),
			_Utils_Tuple2('ecir', '≖'),
			_Utils_Tuple2('ecolon', '≕'),
			_Utils_Tuple2('Ecy', 'Э'),
			_Utils_Tuple2('ecy', 'э'),
			_Utils_Tuple2('eDDot', '⩷'),
			_Utils_Tuple2('Edot', 'Ė'),
			_Utils_Tuple2('edot', 'ė'),
			_Utils_Tuple2('eDot', '≑'),
			_Utils_Tuple2('ee', 'ⅇ'),
			_Utils_Tuple2('efDot', '≒'),
			_Utils_Tuple2('Efr', '\uD835\uDD08'),
			_Utils_Tuple2('efr', '\uD835\uDD22'),
			_Utils_Tuple2('eg', '⪚'),
			_Utils_Tuple2('Egrave', 'È'),
			_Utils_Tuple2('egrave', 'è'),
			_Utils_Tuple2('egs', '⪖'),
			_Utils_Tuple2('egsdot', '⪘'),
			_Utils_Tuple2('el', '⪙'),
			_Utils_Tuple2('Element', '∈'),
			_Utils_Tuple2('elinters', '⏧'),
			_Utils_Tuple2('ell', 'ℓ'),
			_Utils_Tuple2('els', '⪕'),
			_Utils_Tuple2('elsdot', '⪗'),
			_Utils_Tuple2('Emacr', 'Ē'),
			_Utils_Tuple2('emacr', 'ē'),
			_Utils_Tuple2('empty', '∅'),
			_Utils_Tuple2('emptyset', '∅'),
			_Utils_Tuple2('EmptySmallSquare', '◻'),
			_Utils_Tuple2('emptyv', '∅'),
			_Utils_Tuple2('EmptyVerySmallSquare', '▫'),
			_Utils_Tuple2('emsp13', '\u2004'),
			_Utils_Tuple2('emsp14', '\u2005'),
			_Utils_Tuple2('emsp', '\u2003'),
			_Utils_Tuple2('ENG', 'Ŋ'),
			_Utils_Tuple2('eng', 'ŋ'),
			_Utils_Tuple2('ensp', '\u2002'),
			_Utils_Tuple2('Eogon', 'Ę'),
			_Utils_Tuple2('eogon', 'ę'),
			_Utils_Tuple2('Eopf', '\uD835\uDD3C'),
			_Utils_Tuple2('eopf', '\uD835\uDD56'),
			_Utils_Tuple2('epar', '⋕'),
			_Utils_Tuple2('eparsl', '⧣'),
			_Utils_Tuple2('eplus', '⩱'),
			_Utils_Tuple2('epsi', 'ε'),
			_Utils_Tuple2('Epsilon', 'Ε'),
			_Utils_Tuple2('epsilon', 'ε'),
			_Utils_Tuple2('epsiv', 'ϵ'),
			_Utils_Tuple2('eqcirc', '≖'),
			_Utils_Tuple2('eqcolon', '≕'),
			_Utils_Tuple2('eqsim', '≂'),
			_Utils_Tuple2('eqslantgtr', '⪖'),
			_Utils_Tuple2('eqslantless', '⪕'),
			_Utils_Tuple2('Equal', '⩵'),
			_Utils_Tuple2('equals', '='),
			_Utils_Tuple2('EqualTilde', '≂'),
			_Utils_Tuple2('equest', '≟'),
			_Utils_Tuple2('Equilibrium', '⇌'),
			_Utils_Tuple2('equiv', '≡'),
			_Utils_Tuple2('equivDD', '⩸'),
			_Utils_Tuple2('eqvparsl', '⧥'),
			_Utils_Tuple2('erarr', '⥱'),
			_Utils_Tuple2('erDot', '≓'),
			_Utils_Tuple2('escr', 'ℯ'),
			_Utils_Tuple2('Escr', 'ℰ'),
			_Utils_Tuple2('esdot', '≐'),
			_Utils_Tuple2('Esim', '⩳'),
			_Utils_Tuple2('esim', '≂'),
			_Utils_Tuple2('Eta', 'Η'),
			_Utils_Tuple2('eta', 'η'),
			_Utils_Tuple2('ETH', 'Ð'),
			_Utils_Tuple2('eth', 'ð'),
			_Utils_Tuple2('Euml', 'Ë'),
			_Utils_Tuple2('euml', 'ë'),
			_Utils_Tuple2('euro', '€'),
			_Utils_Tuple2('excl', '!'),
			_Utils_Tuple2('exist', '∃'),
			_Utils_Tuple2('Exists', '∃'),
			_Utils_Tuple2('expectation', 'ℰ'),
			_Utils_Tuple2('exponentiale', 'ⅇ'),
			_Utils_Tuple2('ExponentialE', 'ⅇ'),
			_Utils_Tuple2('fallingdotseq', '≒'),
			_Utils_Tuple2('Fcy', 'Ф'),
			_Utils_Tuple2('fcy', 'ф'),
			_Utils_Tuple2('female', '♀'),
			_Utils_Tuple2('ffilig', 'ﬃ'),
			_Utils_Tuple2('fflig', 'ﬀ'),
			_Utils_Tuple2('ffllig', 'ﬄ'),
			_Utils_Tuple2('Ffr', '\uD835\uDD09'),
			_Utils_Tuple2('ffr', '\uD835\uDD23'),
			_Utils_Tuple2('filig', 'ﬁ'),
			_Utils_Tuple2('FilledSmallSquare', '◼'),
			_Utils_Tuple2('FilledVerySmallSquare', '▪'),
			_Utils_Tuple2('fjlig', 'fj'),
			_Utils_Tuple2('flat', '♭'),
			_Utils_Tuple2('fllig', 'ﬂ'),
			_Utils_Tuple2('fltns', '▱'),
			_Utils_Tuple2('fnof', 'ƒ'),
			_Utils_Tuple2('Fopf', '\uD835\uDD3D'),
			_Utils_Tuple2('fopf', '\uD835\uDD57'),
			_Utils_Tuple2('forall', '∀'),
			_Utils_Tuple2('ForAll', '∀'),
			_Utils_Tuple2('fork', '⋔'),
			_Utils_Tuple2('forkv', '⫙'),
			_Utils_Tuple2('Fouriertrf', 'ℱ'),
			_Utils_Tuple2('fpartint', '⨍'),
			_Utils_Tuple2('frac12', '½'),
			_Utils_Tuple2('frac13', '⅓'),
			_Utils_Tuple2('frac14', '¼'),
			_Utils_Tuple2('frac15', '⅕'),
			_Utils_Tuple2('frac16', '⅙'),
			_Utils_Tuple2('frac18', '⅛'),
			_Utils_Tuple2('frac23', '⅔'),
			_Utils_Tuple2('frac25', '⅖'),
			_Utils_Tuple2('frac34', '¾'),
			_Utils_Tuple2('frac35', '⅗'),
			_Utils_Tuple2('frac38', '⅜'),
			_Utils_Tuple2('frac45', '⅘'),
			_Utils_Tuple2('frac56', '⅚'),
			_Utils_Tuple2('frac58', '⅝'),
			_Utils_Tuple2('frac78', '⅞'),
			_Utils_Tuple2('frasl', '⁄'),
			_Utils_Tuple2('frown', '⌢'),
			_Utils_Tuple2('fscr', '\uD835\uDCBB'),
			_Utils_Tuple2('Fscr', 'ℱ'),
			_Utils_Tuple2('gacute', 'ǵ'),
			_Utils_Tuple2('Gamma', 'Γ'),
			_Utils_Tuple2('gamma', 'γ'),
			_Utils_Tuple2('Gammad', 'Ϝ'),
			_Utils_Tuple2('gammad', 'ϝ'),
			_Utils_Tuple2('gap', '⪆'),
			_Utils_Tuple2('Gbreve', 'Ğ'),
			_Utils_Tuple2('gbreve', 'ğ'),
			_Utils_Tuple2('Gcedil', 'Ģ'),
			_Utils_Tuple2('Gcirc', 'Ĝ'),
			_Utils_Tuple2('gcirc', 'ĝ'),
			_Utils_Tuple2('Gcy', 'Г'),
			_Utils_Tuple2('gcy', 'г'),
			_Utils_Tuple2('Gdot', 'Ġ'),
			_Utils_Tuple2('gdot', 'ġ'),
			_Utils_Tuple2('ge', '≥'),
			_Utils_Tuple2('gE', '≧'),
			_Utils_Tuple2('gEl', '⪌'),
			_Utils_Tuple2('gel', '⋛'),
			_Utils_Tuple2('geq', '≥'),
			_Utils_Tuple2('geqq', '≧'),
			_Utils_Tuple2('geqslant', '⩾'),
			_Utils_Tuple2('gescc', '⪩'),
			_Utils_Tuple2('ges', '⩾'),
			_Utils_Tuple2('gesdot', '⪀'),
			_Utils_Tuple2('gesdoto', '⪂'),
			_Utils_Tuple2('gesdotol', '⪄'),
			_Utils_Tuple2('gesl', '⋛︀'),
			_Utils_Tuple2('gesles', '⪔'),
			_Utils_Tuple2('Gfr', '\uD835\uDD0A'),
			_Utils_Tuple2('gfr', '\uD835\uDD24'),
			_Utils_Tuple2('gg', '≫'),
			_Utils_Tuple2('Gg', '⋙'),
			_Utils_Tuple2('ggg', '⋙'),
			_Utils_Tuple2('gimel', 'ℷ'),
			_Utils_Tuple2('GJcy', 'Ѓ'),
			_Utils_Tuple2('gjcy', 'ѓ'),
			_Utils_Tuple2('gla', '⪥'),
			_Utils_Tuple2('gl', '≷'),
			_Utils_Tuple2('glE', '⪒'),
			_Utils_Tuple2('glj', '⪤'),
			_Utils_Tuple2('gnap', '⪊'),
			_Utils_Tuple2('gnapprox', '⪊'),
			_Utils_Tuple2('gne', '⪈'),
			_Utils_Tuple2('gnE', '≩'),
			_Utils_Tuple2('gneq', '⪈'),
			_Utils_Tuple2('gneqq', '≩'),
			_Utils_Tuple2('gnsim', '⋧'),
			_Utils_Tuple2('Gopf', '\uD835\uDD3E'),
			_Utils_Tuple2('gopf', '\uD835\uDD58'),
			_Utils_Tuple2('grave', '`'),
			_Utils_Tuple2('GreaterEqual', '≥'),
			_Utils_Tuple2('GreaterEqualLess', '⋛'),
			_Utils_Tuple2('GreaterFullEqual', '≧'),
			_Utils_Tuple2('GreaterGreater', '⪢'),
			_Utils_Tuple2('GreaterLess', '≷'),
			_Utils_Tuple2('GreaterSlantEqual', '⩾'),
			_Utils_Tuple2('GreaterTilde', '≳'),
			_Utils_Tuple2('Gscr', '\uD835\uDCA2'),
			_Utils_Tuple2('gscr', 'ℊ'),
			_Utils_Tuple2('gsim', '≳'),
			_Utils_Tuple2('gsime', '⪎'),
			_Utils_Tuple2('gsiml', '⪐'),
			_Utils_Tuple2('gtcc', '⪧'),
			_Utils_Tuple2('gtcir', '⩺'),
			_Utils_Tuple2('gt', '>'),
			_Utils_Tuple2('GT', '>'),
			_Utils_Tuple2('Gt', '≫'),
			_Utils_Tuple2('gtdot', '⋗'),
			_Utils_Tuple2('gtlPar', '⦕'),
			_Utils_Tuple2('gtquest', '⩼'),
			_Utils_Tuple2('gtrapprox', '⪆'),
			_Utils_Tuple2('gtrarr', '⥸'),
			_Utils_Tuple2('gtrdot', '⋗'),
			_Utils_Tuple2('gtreqless', '⋛'),
			_Utils_Tuple2('gtreqqless', '⪌'),
			_Utils_Tuple2('gtrless', '≷'),
			_Utils_Tuple2('gtrsim', '≳'),
			_Utils_Tuple2('gvertneqq', '≩︀'),
			_Utils_Tuple2('gvnE', '≩︀'),
			_Utils_Tuple2('Hacek', 'ˇ'),
			_Utils_Tuple2('hairsp', '\u200A'),
			_Utils_Tuple2('half', '½'),
			_Utils_Tuple2('hamilt', 'ℋ'),
			_Utils_Tuple2('HARDcy', 'Ъ'),
			_Utils_Tuple2('hardcy', 'ъ'),
			_Utils_Tuple2('harrcir', '⥈'),
			_Utils_Tuple2('harr', '↔'),
			_Utils_Tuple2('hArr', '⇔'),
			_Utils_Tuple2('harrw', '↭'),
			_Utils_Tuple2('Hat', '^'),
			_Utils_Tuple2('hbar', 'ℏ'),
			_Utils_Tuple2('Hcirc', 'Ĥ'),
			_Utils_Tuple2('hcirc', 'ĥ'),
			_Utils_Tuple2('hearts', '♥'),
			_Utils_Tuple2('heartsuit', '♥'),
			_Utils_Tuple2('hellip', '…'),
			_Utils_Tuple2('hercon', '⊹'),
			_Utils_Tuple2('hfr', '\uD835\uDD25'),
			_Utils_Tuple2('Hfr', 'ℌ'),
			_Utils_Tuple2('HilbertSpace', 'ℋ'),
			_Utils_Tuple2('hksearow', '⤥'),
			_Utils_Tuple2('hkswarow', '⤦'),
			_Utils_Tuple2('hoarr', '⇿'),
			_Utils_Tuple2('homtht', '∻'),
			_Utils_Tuple2('hookleftarrow', '↩'),
			_Utils_Tuple2('hookrightarrow', '↪'),
			_Utils_Tuple2('hopf', '\uD835\uDD59'),
			_Utils_Tuple2('Hopf', 'ℍ'),
			_Utils_Tuple2('horbar', '―'),
			_Utils_Tuple2('HorizontalLine', '─'),
			_Utils_Tuple2('hscr', '\uD835\uDCBD'),
			_Utils_Tuple2('Hscr', 'ℋ'),
			_Utils_Tuple2('hslash', 'ℏ'),
			_Utils_Tuple2('Hstrok', 'Ħ'),
			_Utils_Tuple2('hstrok', 'ħ'),
			_Utils_Tuple2('HumpDownHump', '≎'),
			_Utils_Tuple2('HumpEqual', '≏'),
			_Utils_Tuple2('hybull', '⁃'),
			_Utils_Tuple2('hyphen', '‐'),
			_Utils_Tuple2('Iacute', 'Í'),
			_Utils_Tuple2('iacute', 'í'),
			_Utils_Tuple2('ic', '\u2063'),
			_Utils_Tuple2('Icirc', 'Î'),
			_Utils_Tuple2('icirc', 'î'),
			_Utils_Tuple2('Icy', 'И'),
			_Utils_Tuple2('icy', 'и'),
			_Utils_Tuple2('Idot', 'İ'),
			_Utils_Tuple2('IEcy', 'Е'),
			_Utils_Tuple2('iecy', 'е'),
			_Utils_Tuple2('iexcl', '¡'),
			_Utils_Tuple2('iff', '⇔'),
			_Utils_Tuple2('ifr', '\uD835\uDD26'),
			_Utils_Tuple2('Ifr', 'ℑ'),
			_Utils_Tuple2('Igrave', 'Ì'),
			_Utils_Tuple2('igrave', 'ì'),
			_Utils_Tuple2('ii', 'ⅈ'),
			_Utils_Tuple2('iiiint', '⨌'),
			_Utils_Tuple2('iiint', '∭'),
			_Utils_Tuple2('iinfin', '⧜'),
			_Utils_Tuple2('iiota', '℩'),
			_Utils_Tuple2('IJlig', 'Ĳ'),
			_Utils_Tuple2('ijlig', 'ĳ'),
			_Utils_Tuple2('Imacr', 'Ī'),
			_Utils_Tuple2('imacr', 'ī'),
			_Utils_Tuple2('image', 'ℑ'),
			_Utils_Tuple2('ImaginaryI', 'ⅈ'),
			_Utils_Tuple2('imagline', 'ℐ'),
			_Utils_Tuple2('imagpart', 'ℑ'),
			_Utils_Tuple2('imath', 'ı'),
			_Utils_Tuple2('Im', 'ℑ'),
			_Utils_Tuple2('imof', '⊷'),
			_Utils_Tuple2('imped', 'Ƶ'),
			_Utils_Tuple2('Implies', '⇒'),
			_Utils_Tuple2('incare', '℅'),
			_Utils_Tuple2('in', '∈'),
			_Utils_Tuple2('infin', '∞'),
			_Utils_Tuple2('infintie', '⧝'),
			_Utils_Tuple2('inodot', 'ı'),
			_Utils_Tuple2('intcal', '⊺'),
			_Utils_Tuple2('int', '∫'),
			_Utils_Tuple2('Int', '∬'),
			_Utils_Tuple2('integers', 'ℤ'),
			_Utils_Tuple2('Integral', '∫'),
			_Utils_Tuple2('intercal', '⊺'),
			_Utils_Tuple2('Intersection', '⋂'),
			_Utils_Tuple2('intlarhk', '⨗'),
			_Utils_Tuple2('intprod', '⨼'),
			_Utils_Tuple2('InvisibleComma', '\u2063'),
			_Utils_Tuple2('InvisibleTimes', '\u2062'),
			_Utils_Tuple2('IOcy', 'Ё'),
			_Utils_Tuple2('iocy', 'ё'),
			_Utils_Tuple2('Iogon', 'Į'),
			_Utils_Tuple2('iogon', 'į'),
			_Utils_Tuple2('Iopf', '\uD835\uDD40'),
			_Utils_Tuple2('iopf', '\uD835\uDD5A'),
			_Utils_Tuple2('Iota', 'Ι'),
			_Utils_Tuple2('iota', 'ι'),
			_Utils_Tuple2('iprod', '⨼'),
			_Utils_Tuple2('iquest', '¿'),
			_Utils_Tuple2('iscr', '\uD835\uDCBE'),
			_Utils_Tuple2('Iscr', 'ℐ'),
			_Utils_Tuple2('isin', '∈'),
			_Utils_Tuple2('isindot', '⋵'),
			_Utils_Tuple2('isinE', '⋹'),
			_Utils_Tuple2('isins', '⋴'),
			_Utils_Tuple2('isinsv', '⋳'),
			_Utils_Tuple2('isinv', '∈'),
			_Utils_Tuple2('it', '\u2062'),
			_Utils_Tuple2('Itilde', 'Ĩ'),
			_Utils_Tuple2('itilde', 'ĩ'),
			_Utils_Tuple2('Iukcy', 'І'),
			_Utils_Tuple2('iukcy', 'і'),
			_Utils_Tuple2('Iuml', 'Ï'),
			_Utils_Tuple2('iuml', 'ï'),
			_Utils_Tuple2('Jcirc', 'Ĵ'),
			_Utils_Tuple2('jcirc', 'ĵ'),
			_Utils_Tuple2('Jcy', 'Й'),
			_Utils_Tuple2('jcy', 'й'),
			_Utils_Tuple2('Jfr', '\uD835\uDD0D'),
			_Utils_Tuple2('jfr', '\uD835\uDD27'),
			_Utils_Tuple2('jmath', 'ȷ'),
			_Utils_Tuple2('Jopf', '\uD835\uDD41'),
			_Utils_Tuple2('jopf', '\uD835\uDD5B'),
			_Utils_Tuple2('Jscr', '\uD835\uDCA5'),
			_Utils_Tuple2('jscr', '\uD835\uDCBF'),
			_Utils_Tuple2('Jsercy', 'Ј'),
			_Utils_Tuple2('jsercy', 'ј'),
			_Utils_Tuple2('Jukcy', 'Є'),
			_Utils_Tuple2('jukcy', 'є'),
			_Utils_Tuple2('Kappa', 'Κ'),
			_Utils_Tuple2('kappa', 'κ'),
			_Utils_Tuple2('kappav', 'ϰ'),
			_Utils_Tuple2('Kcedil', 'Ķ'),
			_Utils_Tuple2('kcedil', 'ķ'),
			_Utils_Tuple2('Kcy', 'К'),
			_Utils_Tuple2('kcy', 'к'),
			_Utils_Tuple2('Kfr', '\uD835\uDD0E'),
			_Utils_Tuple2('kfr', '\uD835\uDD28'),
			_Utils_Tuple2('kgreen', 'ĸ'),
			_Utils_Tuple2('KHcy', 'Х'),
			_Utils_Tuple2('khcy', 'х'),
			_Utils_Tuple2('KJcy', 'Ќ'),
			_Utils_Tuple2('kjcy', 'ќ'),
			_Utils_Tuple2('Kopf', '\uD835\uDD42'),
			_Utils_Tuple2('kopf', '\uD835\uDD5C'),
			_Utils_Tuple2('Kscr', '\uD835\uDCA6'),
			_Utils_Tuple2('kscr', '\uD835\uDCC0'),
			_Utils_Tuple2('lAarr', '⇚'),
			_Utils_Tuple2('Lacute', 'Ĺ'),
			_Utils_Tuple2('lacute', 'ĺ'),
			_Utils_Tuple2('laemptyv', '⦴'),
			_Utils_Tuple2('lagran', 'ℒ'),
			_Utils_Tuple2('Lambda', 'Λ'),
			_Utils_Tuple2('lambda', 'λ'),
			_Utils_Tuple2('lang', '⟨'),
			_Utils_Tuple2('Lang', '⟪'),
			_Utils_Tuple2('langd', '⦑'),
			_Utils_Tuple2('langle', '⟨'),
			_Utils_Tuple2('lap', '⪅'),
			_Utils_Tuple2('Laplacetrf', 'ℒ'),
			_Utils_Tuple2('laquo', '«'),
			_Utils_Tuple2('larrb', '⇤'),
			_Utils_Tuple2('larrbfs', '⤟'),
			_Utils_Tuple2('larr', '←'),
			_Utils_Tuple2('Larr', '↞'),
			_Utils_Tuple2('lArr', '⇐'),
			_Utils_Tuple2('larrfs', '⤝'),
			_Utils_Tuple2('larrhk', '↩'),
			_Utils_Tuple2('larrlp', '↫'),
			_Utils_Tuple2('larrpl', '⤹'),
			_Utils_Tuple2('larrsim', '⥳'),
			_Utils_Tuple2('larrtl', '↢'),
			_Utils_Tuple2('latail', '⤙'),
			_Utils_Tuple2('lAtail', '⤛'),
			_Utils_Tuple2('lat', '⪫'),
			_Utils_Tuple2('late', '⪭'),
			_Utils_Tuple2('lates', '⪭︀'),
			_Utils_Tuple2('lbarr', '⤌'),
			_Utils_Tuple2('lBarr', '⤎'),
			_Utils_Tuple2('lbbrk', '❲'),
			_Utils_Tuple2('lbrace', '{'),
			_Utils_Tuple2('lbrack', '['),
			_Utils_Tuple2('lbrke', '⦋'),
			_Utils_Tuple2('lbrksld', '⦏'),
			_Utils_Tuple2('lbrkslu', '⦍'),
			_Utils_Tuple2('Lcaron', 'Ľ'),
			_Utils_Tuple2('lcaron', 'ľ'),
			_Utils_Tuple2('Lcedil', 'Ļ'),
			_Utils_Tuple2('lcedil', 'ļ'),
			_Utils_Tuple2('lceil', '⌈'),
			_Utils_Tuple2('lcub', '{'),
			_Utils_Tuple2('Lcy', 'Л'),
			_Utils_Tuple2('lcy', 'л'),
			_Utils_Tuple2('ldca', '⤶'),
			_Utils_Tuple2('ldquo', '“'),
			_Utils_Tuple2('ldquor', '„'),
			_Utils_Tuple2('ldrdhar', '⥧'),
			_Utils_Tuple2('ldrushar', '⥋'),
			_Utils_Tuple2('ldsh', '↲'),
			_Utils_Tuple2('le', '≤'),
			_Utils_Tuple2('lE', '≦'),
			_Utils_Tuple2('LeftAngleBracket', '⟨'),
			_Utils_Tuple2('LeftArrowBar', '⇤'),
			_Utils_Tuple2('leftarrow', '←'),
			_Utils_Tuple2('LeftArrow', '←'),
			_Utils_Tuple2('Leftarrow', '⇐'),
			_Utils_Tuple2('LeftArrowRightArrow', '⇆'),
			_Utils_Tuple2('leftarrowtail', '↢'),
			_Utils_Tuple2('LeftCeiling', '⌈'),
			_Utils_Tuple2('LeftDoubleBracket', '⟦'),
			_Utils_Tuple2('LeftDownTeeVector', '⥡'),
			_Utils_Tuple2('LeftDownVectorBar', '⥙'),
			_Utils_Tuple2('LeftDownVector', '⇃'),
			_Utils_Tuple2('LeftFloor', '⌊'),
			_Utils_Tuple2('leftharpoondown', '↽'),
			_Utils_Tuple2('leftharpoonup', '↼'),
			_Utils_Tuple2('leftleftarrows', '⇇'),
			_Utils_Tuple2('leftrightarrow', '↔'),
			_Utils_Tuple2('LeftRightArrow', '↔'),
			_Utils_Tuple2('Leftrightarrow', '⇔'),
			_Utils_Tuple2('leftrightarrows', '⇆'),
			_Utils_Tuple2('leftrightharpoons', '⇋'),
			_Utils_Tuple2('leftrightsquigarrow', '↭'),
			_Utils_Tuple2('LeftRightVector', '⥎'),
			_Utils_Tuple2('LeftTeeArrow', '↤'),
			_Utils_Tuple2('LeftTee', '⊣'),
			_Utils_Tuple2('LeftTeeVector', '⥚'),
			_Utils_Tuple2('leftthreetimes', '⋋'),
			_Utils_Tuple2('LeftTriangleBar', '⧏'),
			_Utils_Tuple2('LeftTriangle', '⊲'),
			_Utils_Tuple2('LeftTriangleEqual', '⊴'),
			_Utils_Tuple2('LeftUpDownVector', '⥑'),
			_Utils_Tuple2('LeftUpTeeVector', '⥠'),
			_Utils_Tuple2('LeftUpVectorBar', '⥘'),
			_Utils_Tuple2('LeftUpVector', '↿'),
			_Utils_Tuple2('LeftVectorBar', '⥒'),
			_Utils_Tuple2('LeftVector', '↼'),
			_Utils_Tuple2('lEg', '⪋'),
			_Utils_Tuple2('leg', '⋚'),
			_Utils_Tuple2('leq', '≤'),
			_Utils_Tuple2('leqq', '≦'),
			_Utils_Tuple2('leqslant', '⩽'),
			_Utils_Tuple2('lescc', '⪨'),
			_Utils_Tuple2('les', '⩽'),
			_Utils_Tuple2('lesdot', '⩿'),
			_Utils_Tuple2('lesdoto', '⪁'),
			_Utils_Tuple2('lesdotor', '⪃'),
			_Utils_Tuple2('lesg', '⋚︀'),
			_Utils_Tuple2('lesges', '⪓'),
			_Utils_Tuple2('lessapprox', '⪅'),
			_Utils_Tuple2('lessdot', '⋖'),
			_Utils_Tuple2('lesseqgtr', '⋚'),
			_Utils_Tuple2('lesseqqgtr', '⪋'),
			_Utils_Tuple2('LessEqualGreater', '⋚'),
			_Utils_Tuple2('LessFullEqual', '≦'),
			_Utils_Tuple2('LessGreater', '≶'),
			_Utils_Tuple2('lessgtr', '≶'),
			_Utils_Tuple2('LessLess', '⪡'),
			_Utils_Tuple2('lesssim', '≲'),
			_Utils_Tuple2('LessSlantEqual', '⩽'),
			_Utils_Tuple2('LessTilde', '≲'),
			_Utils_Tuple2('lfisht', '⥼'),
			_Utils_Tuple2('lfloor', '⌊'),
			_Utils_Tuple2('Lfr', '\uD835\uDD0F'),
			_Utils_Tuple2('lfr', '\uD835\uDD29'),
			_Utils_Tuple2('lg', '≶'),
			_Utils_Tuple2('lgE', '⪑'),
			_Utils_Tuple2('lHar', '⥢'),
			_Utils_Tuple2('lhard', '↽'),
			_Utils_Tuple2('lharu', '↼'),
			_Utils_Tuple2('lharul', '⥪'),
			_Utils_Tuple2('lhblk', '▄'),
			_Utils_Tuple2('LJcy', 'Љ'),
			_Utils_Tuple2('ljcy', 'љ'),
			_Utils_Tuple2('llarr', '⇇'),
			_Utils_Tuple2('ll', '≪'),
			_Utils_Tuple2('Ll', '⋘'),
			_Utils_Tuple2('llcorner', '⌞'),
			_Utils_Tuple2('Lleftarrow', '⇚'),
			_Utils_Tuple2('llhard', '⥫'),
			_Utils_Tuple2('lltri', '◺'),
			_Utils_Tuple2('Lmidot', 'Ŀ'),
			_Utils_Tuple2('lmidot', 'ŀ'),
			_Utils_Tuple2('lmoustache', '⎰'),
			_Utils_Tuple2('lmoust', '⎰'),
			_Utils_Tuple2('lnap', '⪉'),
			_Utils_Tuple2('lnapprox', '⪉'),
			_Utils_Tuple2('lne', '⪇'),
			_Utils_Tuple2('lnE', '≨'),
			_Utils_Tuple2('lneq', '⪇'),
			_Utils_Tuple2('lneqq', '≨'),
			_Utils_Tuple2('lnsim', '⋦'),
			_Utils_Tuple2('loang', '⟬'),
			_Utils_Tuple2('loarr', '⇽'),
			_Utils_Tuple2('lobrk', '⟦'),
			_Utils_Tuple2('longleftarrow', '⟵'),
			_Utils_Tuple2('LongLeftArrow', '⟵'),
			_Utils_Tuple2('Longleftarrow', '⟸'),
			_Utils_Tuple2('longleftrightarrow', '⟷'),
			_Utils_Tuple2('LongLeftRightArrow', '⟷'),
			_Utils_Tuple2('Longleftrightarrow', '⟺'),
			_Utils_Tuple2('longmapsto', '⟼'),
			_Utils_Tuple2('longrightarrow', '⟶'),
			_Utils_Tuple2('LongRightArrow', '⟶'),
			_Utils_Tuple2('Longrightarrow', '⟹'),
			_Utils_Tuple2('looparrowleft', '↫'),
			_Utils_Tuple2('looparrowright', '↬'),
			_Utils_Tuple2('lopar', '⦅'),
			_Utils_Tuple2('Lopf', '\uD835\uDD43'),
			_Utils_Tuple2('lopf', '\uD835\uDD5D'),
			_Utils_Tuple2('loplus', '⨭'),
			_Utils_Tuple2('lotimes', '⨴'),
			_Utils_Tuple2('lowast', '∗'),
			_Utils_Tuple2('lowbar', '_'),
			_Utils_Tuple2('LowerLeftArrow', '↙'),
			_Utils_Tuple2('LowerRightArrow', '↘'),
			_Utils_Tuple2('loz', '◊'),
			_Utils_Tuple2('lozenge', '◊'),
			_Utils_Tuple2('lozf', '⧫'),
			_Utils_Tuple2('lpar', '('),
			_Utils_Tuple2('lparlt', '⦓'),
			_Utils_Tuple2('lrarr', '⇆'),
			_Utils_Tuple2('lrcorner', '⌟'),
			_Utils_Tuple2('lrhar', '⇋'),
			_Utils_Tuple2('lrhard', '⥭'),
			_Utils_Tuple2('lrm', '\u200E'),
			_Utils_Tuple2('lrtri', '⊿'),
			_Utils_Tuple2('lsaquo', '‹'),
			_Utils_Tuple2('lscr', '\uD835\uDCC1'),
			_Utils_Tuple2('Lscr', 'ℒ'),
			_Utils_Tuple2('lsh', '↰'),
			_Utils_Tuple2('Lsh', '↰'),
			_Utils_Tuple2('lsim', '≲'),
			_Utils_Tuple2('lsime', '⪍'),
			_Utils_Tuple2('lsimg', '⪏'),
			_Utils_Tuple2('lsqb', '['),
			_Utils_Tuple2('lsquo', '‘'),
			_Utils_Tuple2('lsquor', '‚'),
			_Utils_Tuple2('Lstrok', 'Ł'),
			_Utils_Tuple2('lstrok', 'ł'),
			_Utils_Tuple2('ltcc', '⪦'),
			_Utils_Tuple2('ltcir', '⩹'),
			_Utils_Tuple2('lt', '<'),
			_Utils_Tuple2('LT', '<'),
			_Utils_Tuple2('Lt', '≪'),
			_Utils_Tuple2('ltdot', '⋖'),
			_Utils_Tuple2('lthree', '⋋'),
			_Utils_Tuple2('ltimes', '⋉'),
			_Utils_Tuple2('ltlarr', '⥶'),
			_Utils_Tuple2('ltquest', '⩻'),
			_Utils_Tuple2('ltri', '◃'),
			_Utils_Tuple2('ltrie', '⊴'),
			_Utils_Tuple2('ltrif', '◂'),
			_Utils_Tuple2('ltrPar', '⦖'),
			_Utils_Tuple2('lurdshar', '⥊'),
			_Utils_Tuple2('luruhar', '⥦'),
			_Utils_Tuple2('lvertneqq', '≨︀'),
			_Utils_Tuple2('lvnE', '≨︀'),
			_Utils_Tuple2('macr', '¯'),
			_Utils_Tuple2('male', '♂'),
			_Utils_Tuple2('malt', '✠'),
			_Utils_Tuple2('maltese', '✠'),
			_Utils_Tuple2('Map', '⤅'),
			_Utils_Tuple2('map', '↦'),
			_Utils_Tuple2('mapsto', '↦'),
			_Utils_Tuple2('mapstodown', '↧'),
			_Utils_Tuple2('mapstoleft', '↤'),
			_Utils_Tuple2('mapstoup', '↥'),
			_Utils_Tuple2('marker', '▮'),
			_Utils_Tuple2('mcomma', '⨩'),
			_Utils_Tuple2('Mcy', 'М'),
			_Utils_Tuple2('mcy', 'м'),
			_Utils_Tuple2('mdash', '—'),
			_Utils_Tuple2('mDDot', '∺'),
			_Utils_Tuple2('measuredangle', '∡'),
			_Utils_Tuple2('MediumSpace', '\u205F'),
			_Utils_Tuple2('Mellintrf', 'ℳ'),
			_Utils_Tuple2('Mfr', '\uD835\uDD10'),
			_Utils_Tuple2('mfr', '\uD835\uDD2A'),
			_Utils_Tuple2('mho', '℧'),
			_Utils_Tuple2('micro', 'µ'),
			_Utils_Tuple2('midast', '*'),
			_Utils_Tuple2('midcir', '⫰'),
			_Utils_Tuple2('mid', '∣'),
			_Utils_Tuple2('middot', '·'),
			_Utils_Tuple2('minusb', '⊟'),
			_Utils_Tuple2('minus', '−'),
			_Utils_Tuple2('minusd', '∸'),
			_Utils_Tuple2('minusdu', '⨪'),
			_Utils_Tuple2('MinusPlus', '∓'),
			_Utils_Tuple2('mlcp', '⫛'),
			_Utils_Tuple2('mldr', '…'),
			_Utils_Tuple2('mnplus', '∓'),
			_Utils_Tuple2('models', '⊧'),
			_Utils_Tuple2('Mopf', '\uD835\uDD44'),
			_Utils_Tuple2('mopf', '\uD835\uDD5E'),
			_Utils_Tuple2('mp', '∓'),
			_Utils_Tuple2('mscr', '\uD835\uDCC2'),
			_Utils_Tuple2('Mscr', 'ℳ'),
			_Utils_Tuple2('mstpos', '∾'),
			_Utils_Tuple2('Mu', 'Μ'),
			_Utils_Tuple2('mu', 'μ'),
			_Utils_Tuple2('multimap', '⊸'),
			_Utils_Tuple2('mumap', '⊸'),
			_Utils_Tuple2('nabla', '∇'),
			_Utils_Tuple2('Nacute', 'Ń'),
			_Utils_Tuple2('nacute', 'ń'),
			_Utils_Tuple2('nang', '∠⃒'),
			_Utils_Tuple2('nap', '≉'),
			_Utils_Tuple2('napE', '⩰̸'),
			_Utils_Tuple2('napid', '≋̸'),
			_Utils_Tuple2('napos', 'ŉ'),
			_Utils_Tuple2('napprox', '≉'),
			_Utils_Tuple2('natural', '♮'),
			_Utils_Tuple2('naturals', 'ℕ'),
			_Utils_Tuple2('natur', '♮'),
			_Utils_Tuple2('nbsp', '\u00A0'),
			_Utils_Tuple2('nbump', '≎̸'),
			_Utils_Tuple2('nbumpe', '≏̸'),
			_Utils_Tuple2('ncap', '⩃'),
			_Utils_Tuple2('Ncaron', 'Ň'),
			_Utils_Tuple2('ncaron', 'ň'),
			_Utils_Tuple2('Ncedil', 'Ņ'),
			_Utils_Tuple2('ncedil', 'ņ'),
			_Utils_Tuple2('ncong', '≇'),
			_Utils_Tuple2('ncongdot', '⩭̸'),
			_Utils_Tuple2('ncup', '⩂'),
			_Utils_Tuple2('Ncy', 'Н'),
			_Utils_Tuple2('ncy', 'н'),
			_Utils_Tuple2('ndash', '–'),
			_Utils_Tuple2('nearhk', '⤤'),
			_Utils_Tuple2('nearr', '↗'),
			_Utils_Tuple2('neArr', '⇗'),
			_Utils_Tuple2('nearrow', '↗'),
			_Utils_Tuple2('ne', '≠'),
			_Utils_Tuple2('nedot', '≐̸'),
			_Utils_Tuple2('NegativeMediumSpace', '\u200B'),
			_Utils_Tuple2('NegativeThickSpace', '\u200B'),
			_Utils_Tuple2('NegativeThinSpace', '\u200B'),
			_Utils_Tuple2('NegativeVeryThinSpace', '\u200B'),
			_Utils_Tuple2('nequiv', '≢'),
			_Utils_Tuple2('nesear', '⤨'),
			_Utils_Tuple2('nesim', '≂̸'),
			_Utils_Tuple2('NestedGreaterGreater', '≫'),
			_Utils_Tuple2('NestedLessLess', '≪'),
			_Utils_Tuple2('NewLine', '\n'),
			_Utils_Tuple2('nexist', '∄'),
			_Utils_Tuple2('nexists', '∄'),
			_Utils_Tuple2('Nfr', '\uD835\uDD11'),
			_Utils_Tuple2('nfr', '\uD835\uDD2B'),
			_Utils_Tuple2('ngE', '≧̸'),
			_Utils_Tuple2('nge', '≱'),
			_Utils_Tuple2('ngeq', '≱'),
			_Utils_Tuple2('ngeqq', '≧̸'),
			_Utils_Tuple2('ngeqslant', '⩾̸'),
			_Utils_Tuple2('nges', '⩾̸'),
			_Utils_Tuple2('nGg', '⋙̸'),
			_Utils_Tuple2('ngsim', '≵'),
			_Utils_Tuple2('nGt', '≫⃒'),
			_Utils_Tuple2('ngt', '≯'),
			_Utils_Tuple2('ngtr', '≯'),
			_Utils_Tuple2('nGtv', '≫̸'),
			_Utils_Tuple2('nharr', '↮'),
			_Utils_Tuple2('nhArr', '⇎'),
			_Utils_Tuple2('nhpar', '⫲'),
			_Utils_Tuple2('ni', '∋'),
			_Utils_Tuple2('nis', '⋼'),
			_Utils_Tuple2('nisd', '⋺'),
			_Utils_Tuple2('niv', '∋'),
			_Utils_Tuple2('NJcy', 'Њ'),
			_Utils_Tuple2('njcy', 'њ'),
			_Utils_Tuple2('nlarr', '↚'),
			_Utils_Tuple2('nlArr', '⇍'),
			_Utils_Tuple2('nldr', '‥'),
			_Utils_Tuple2('nlE', '≦̸'),
			_Utils_Tuple2('nle', '≰'),
			_Utils_Tuple2('nleftarrow', '↚'),
			_Utils_Tuple2('nLeftarrow', '⇍'),
			_Utils_Tuple2('nleftrightarrow', '↮'),
			_Utils_Tuple2('nLeftrightarrow', '⇎'),
			_Utils_Tuple2('nleq', '≰'),
			_Utils_Tuple2('nleqq', '≦̸'),
			_Utils_Tuple2('nleqslant', '⩽̸'),
			_Utils_Tuple2('nles', '⩽̸'),
			_Utils_Tuple2('nless', '≮'),
			_Utils_Tuple2('nLl', '⋘̸'),
			_Utils_Tuple2('nlsim', '≴'),
			_Utils_Tuple2('nLt', '≪⃒'),
			_Utils_Tuple2('nlt', '≮'),
			_Utils_Tuple2('nltri', '⋪'),
			_Utils_Tuple2('nltrie', '⋬'),
			_Utils_Tuple2('nLtv', '≪̸'),
			_Utils_Tuple2('nmid', '∤'),
			_Utils_Tuple2('NoBreak', '\u2060'),
			_Utils_Tuple2('NonBreakingSpace', '\u00A0'),
			_Utils_Tuple2('nopf', '\uD835\uDD5F'),
			_Utils_Tuple2('Nopf', 'ℕ'),
			_Utils_Tuple2('Not', '⫬'),
			_Utils_Tuple2('not', '¬'),
			_Utils_Tuple2('NotCongruent', '≢'),
			_Utils_Tuple2('NotCupCap', '≭'),
			_Utils_Tuple2('NotDoubleVerticalBar', '∦'),
			_Utils_Tuple2('NotElement', '∉'),
			_Utils_Tuple2('NotEqual', '≠'),
			_Utils_Tuple2('NotEqualTilde', '≂̸'),
			_Utils_Tuple2('NotExists', '∄'),
			_Utils_Tuple2('NotGreater', '≯'),
			_Utils_Tuple2('NotGreaterEqual', '≱'),
			_Utils_Tuple2('NotGreaterFullEqual', '≧̸'),
			_Utils_Tuple2('NotGreaterGreater', '≫̸'),
			_Utils_Tuple2('NotGreaterLess', '≹'),
			_Utils_Tuple2('NotGreaterSlantEqual', '⩾̸'),
			_Utils_Tuple2('NotGreaterTilde', '≵'),
			_Utils_Tuple2('NotHumpDownHump', '≎̸'),
			_Utils_Tuple2('NotHumpEqual', '≏̸'),
			_Utils_Tuple2('notin', '∉'),
			_Utils_Tuple2('notindot', '⋵̸'),
			_Utils_Tuple2('notinE', '⋹̸'),
			_Utils_Tuple2('notinva', '∉'),
			_Utils_Tuple2('notinvb', '⋷'),
			_Utils_Tuple2('notinvc', '⋶'),
			_Utils_Tuple2('NotLeftTriangleBar', '⧏̸'),
			_Utils_Tuple2('NotLeftTriangle', '⋪'),
			_Utils_Tuple2('NotLeftTriangleEqual', '⋬'),
			_Utils_Tuple2('NotLess', '≮'),
			_Utils_Tuple2('NotLessEqual', '≰'),
			_Utils_Tuple2('NotLessGreater', '≸'),
			_Utils_Tuple2('NotLessLess', '≪̸'),
			_Utils_Tuple2('NotLessSlantEqual', '⩽̸'),
			_Utils_Tuple2('NotLessTilde', '≴'),
			_Utils_Tuple2('NotNestedGreaterGreater', '⪢̸'),
			_Utils_Tuple2('NotNestedLessLess', '⪡̸'),
			_Utils_Tuple2('notni', '∌'),
			_Utils_Tuple2('notniva', '∌'),
			_Utils_Tuple2('notnivb', '⋾'),
			_Utils_Tuple2('notnivc', '⋽'),
			_Utils_Tuple2('NotPrecedes', '⊀'),
			_Utils_Tuple2('NotPrecedesEqual', '⪯̸'),
			_Utils_Tuple2('NotPrecedesSlantEqual', '⋠'),
			_Utils_Tuple2('NotReverseElement', '∌'),
			_Utils_Tuple2('NotRightTriangleBar', '⧐̸'),
			_Utils_Tuple2('NotRightTriangle', '⋫'),
			_Utils_Tuple2('NotRightTriangleEqual', '⋭'),
			_Utils_Tuple2('NotSquareSubset', '⊏̸'),
			_Utils_Tuple2('NotSquareSubsetEqual', '⋢'),
			_Utils_Tuple2('NotSquareSuperset', '⊐̸'),
			_Utils_Tuple2('NotSquareSupersetEqual', '⋣'),
			_Utils_Tuple2('NotSubset', '⊂⃒'),
			_Utils_Tuple2('NotSubsetEqual', '⊈'),
			_Utils_Tuple2('NotSucceeds', '⊁'),
			_Utils_Tuple2('NotSucceedsEqual', '⪰̸'),
			_Utils_Tuple2('NotSucceedsSlantEqual', '⋡'),
			_Utils_Tuple2('NotSucceedsTilde', '≿̸'),
			_Utils_Tuple2('NotSuperset', '⊃⃒'),
			_Utils_Tuple2('NotSupersetEqual', '⊉'),
			_Utils_Tuple2('NotTilde', '≁'),
			_Utils_Tuple2('NotTildeEqual', '≄'),
			_Utils_Tuple2('NotTildeFullEqual', '≇'),
			_Utils_Tuple2('NotTildeTilde', '≉'),
			_Utils_Tuple2('NotVerticalBar', '∤'),
			_Utils_Tuple2('nparallel', '∦'),
			_Utils_Tuple2('npar', '∦'),
			_Utils_Tuple2('nparsl', '⫽⃥'),
			_Utils_Tuple2('npart', '∂̸'),
			_Utils_Tuple2('npolint', '⨔'),
			_Utils_Tuple2('npr', '⊀'),
			_Utils_Tuple2('nprcue', '⋠'),
			_Utils_Tuple2('nprec', '⊀'),
			_Utils_Tuple2('npreceq', '⪯̸'),
			_Utils_Tuple2('npre', '⪯̸'),
			_Utils_Tuple2('nrarrc', '⤳̸'),
			_Utils_Tuple2('nrarr', '↛'),
			_Utils_Tuple2('nrArr', '⇏'),
			_Utils_Tuple2('nrarrw', '↝̸'),
			_Utils_Tuple2('nrightarrow', '↛'),
			_Utils_Tuple2('nRightarrow', '⇏'),
			_Utils_Tuple2('nrtri', '⋫'),
			_Utils_Tuple2('nrtrie', '⋭'),
			_Utils_Tuple2('nsc', '⊁'),
			_Utils_Tuple2('nsccue', '⋡'),
			_Utils_Tuple2('nsce', '⪰̸'),
			_Utils_Tuple2('Nscr', '\uD835\uDCA9'),
			_Utils_Tuple2('nscr', '\uD835\uDCC3'),
			_Utils_Tuple2('nshortmid', '∤'),
			_Utils_Tuple2('nshortparallel', '∦'),
			_Utils_Tuple2('nsim', '≁'),
			_Utils_Tuple2('nsime', '≄'),
			_Utils_Tuple2('nsimeq', '≄'),
			_Utils_Tuple2('nsmid', '∤'),
			_Utils_Tuple2('nspar', '∦'),
			_Utils_Tuple2('nsqsube', '⋢'),
			_Utils_Tuple2('nsqsupe', '⋣'),
			_Utils_Tuple2('nsub', '⊄'),
			_Utils_Tuple2('nsubE', '⫅̸'),
			_Utils_Tuple2('nsube', '⊈'),
			_Utils_Tuple2('nsubset', '⊂⃒'),
			_Utils_Tuple2('nsubseteq', '⊈'),
			_Utils_Tuple2('nsubseteqq', '⫅̸'),
			_Utils_Tuple2('nsucc', '⊁'),
			_Utils_Tuple2('nsucceq', '⪰̸'),
			_Utils_Tuple2('nsup', '⊅'),
			_Utils_Tuple2('nsupE', '⫆̸'),
			_Utils_Tuple2('nsupe', '⊉'),
			_Utils_Tuple2('nsupset', '⊃⃒'),
			_Utils_Tuple2('nsupseteq', '⊉'),
			_Utils_Tuple2('nsupseteqq', '⫆̸'),
			_Utils_Tuple2('ntgl', '≹'),
			_Utils_Tuple2('Ntilde', 'Ñ'),
			_Utils_Tuple2('ntilde', 'ñ'),
			_Utils_Tuple2('ntlg', '≸'),
			_Utils_Tuple2('ntriangleleft', '⋪'),
			_Utils_Tuple2('ntrianglelefteq', '⋬'),
			_Utils_Tuple2('ntriangleright', '⋫'),
			_Utils_Tuple2('ntrianglerighteq', '⋭'),
			_Utils_Tuple2('Nu', 'Ν'),
			_Utils_Tuple2('nu', 'ν'),
			_Utils_Tuple2('num', '#'),
			_Utils_Tuple2('numero', '№'),
			_Utils_Tuple2('numsp', '\u2007'),
			_Utils_Tuple2('nvap', '≍⃒'),
			_Utils_Tuple2('nvdash', '⊬'),
			_Utils_Tuple2('nvDash', '⊭'),
			_Utils_Tuple2('nVdash', '⊮'),
			_Utils_Tuple2('nVDash', '⊯'),
			_Utils_Tuple2('nvge', '≥⃒'),
			_Utils_Tuple2('nvgt', '>⃒'),
			_Utils_Tuple2('nvHarr', '⤄'),
			_Utils_Tuple2('nvinfin', '⧞'),
			_Utils_Tuple2('nvlArr', '⤂'),
			_Utils_Tuple2('nvle', '≤⃒'),
			_Utils_Tuple2('nvlt', '<⃒'),
			_Utils_Tuple2('nvltrie', '⊴⃒'),
			_Utils_Tuple2('nvrArr', '⤃'),
			_Utils_Tuple2('nvrtrie', '⊵⃒'),
			_Utils_Tuple2('nvsim', '∼⃒'),
			_Utils_Tuple2('nwarhk', '⤣'),
			_Utils_Tuple2('nwarr', '↖'),
			_Utils_Tuple2('nwArr', '⇖'),
			_Utils_Tuple2('nwarrow', '↖'),
			_Utils_Tuple2('nwnear', '⤧'),
			_Utils_Tuple2('Oacute', 'Ó'),
			_Utils_Tuple2('oacute', 'ó'),
			_Utils_Tuple2('oast', '⊛'),
			_Utils_Tuple2('Ocirc', 'Ô'),
			_Utils_Tuple2('ocirc', 'ô'),
			_Utils_Tuple2('ocir', '⊚'),
			_Utils_Tuple2('Ocy', 'О'),
			_Utils_Tuple2('ocy', 'о'),
			_Utils_Tuple2('odash', '⊝'),
			_Utils_Tuple2('Odblac', 'Ő'),
			_Utils_Tuple2('odblac', 'ő'),
			_Utils_Tuple2('odiv', '⨸'),
			_Utils_Tuple2('odot', '⊙'),
			_Utils_Tuple2('odsold', '⦼'),
			_Utils_Tuple2('OElig', 'Œ'),
			_Utils_Tuple2('oelig', 'œ'),
			_Utils_Tuple2('ofcir', '⦿'),
			_Utils_Tuple2('Ofr', '\uD835\uDD12'),
			_Utils_Tuple2('ofr', '\uD835\uDD2C'),
			_Utils_Tuple2('ogon', '˛'),
			_Utils_Tuple2('Ograve', 'Ò'),
			_Utils_Tuple2('ograve', 'ò'),
			_Utils_Tuple2('ogt', '⧁'),
			_Utils_Tuple2('ohbar', '⦵'),
			_Utils_Tuple2('ohm', 'Ω'),
			_Utils_Tuple2('oint', '∮'),
			_Utils_Tuple2('olarr', '↺'),
			_Utils_Tuple2('olcir', '⦾'),
			_Utils_Tuple2('olcross', '⦻'),
			_Utils_Tuple2('oline', '‾'),
			_Utils_Tuple2('olt', '⧀'),
			_Utils_Tuple2('Omacr', 'Ō'),
			_Utils_Tuple2('omacr', 'ō'),
			_Utils_Tuple2('Omega', 'Ω'),
			_Utils_Tuple2('omega', 'ω'),
			_Utils_Tuple2('Omicron', 'Ο'),
			_Utils_Tuple2('omicron', 'ο'),
			_Utils_Tuple2('omid', '⦶'),
			_Utils_Tuple2('ominus', '⊖'),
			_Utils_Tuple2('Oopf', '\uD835\uDD46'),
			_Utils_Tuple2('oopf', '\uD835\uDD60'),
			_Utils_Tuple2('opar', '⦷'),
			_Utils_Tuple2('OpenCurlyDoubleQuote', '“'),
			_Utils_Tuple2('OpenCurlyQuote', '‘'),
			_Utils_Tuple2('operp', '⦹'),
			_Utils_Tuple2('oplus', '⊕'),
			_Utils_Tuple2('orarr', '↻'),
			_Utils_Tuple2('Or', '⩔'),
			_Utils_Tuple2('or', '∨'),
			_Utils_Tuple2('ord', '⩝'),
			_Utils_Tuple2('order', 'ℴ'),
			_Utils_Tuple2('orderof', 'ℴ'),
			_Utils_Tuple2('ordf', 'ª'),
			_Utils_Tuple2('ordm', 'º'),
			_Utils_Tuple2('origof', '⊶'),
			_Utils_Tuple2('oror', '⩖'),
			_Utils_Tuple2('orslope', '⩗'),
			_Utils_Tuple2('orv', '⩛'),
			_Utils_Tuple2('oS', 'Ⓢ'),
			_Utils_Tuple2('Oscr', '\uD835\uDCAA'),
			_Utils_Tuple2('oscr', 'ℴ'),
			_Utils_Tuple2('Oslash', 'Ø'),
			_Utils_Tuple2('oslash', 'ø'),
			_Utils_Tuple2('osol', '⊘'),
			_Utils_Tuple2('Otilde', 'Õ'),
			_Utils_Tuple2('otilde', 'õ'),
			_Utils_Tuple2('otimesas', '⨶'),
			_Utils_Tuple2('Otimes', '⨷'),
			_Utils_Tuple2('otimes', '⊗'),
			_Utils_Tuple2('Ouml', 'Ö'),
			_Utils_Tuple2('ouml', 'ö'),
			_Utils_Tuple2('ovbar', '⌽'),
			_Utils_Tuple2('OverBar', '‾'),
			_Utils_Tuple2('OverBrace', '⏞'),
			_Utils_Tuple2('OverBracket', '⎴'),
			_Utils_Tuple2('OverParenthesis', '⏜'),
			_Utils_Tuple2('para', '¶'),
			_Utils_Tuple2('parallel', '∥'),
			_Utils_Tuple2('par', '∥'),
			_Utils_Tuple2('parsim', '⫳'),
			_Utils_Tuple2('parsl', '⫽'),
			_Utils_Tuple2('part', '∂'),
			_Utils_Tuple2('PartialD', '∂'),
			_Utils_Tuple2('Pcy', 'П'),
			_Utils_Tuple2('pcy', 'п'),
			_Utils_Tuple2('percnt', '%'),
			_Utils_Tuple2('period', '.'),
			_Utils_Tuple2('permil', '‰'),
			_Utils_Tuple2('perp', '⊥'),
			_Utils_Tuple2('pertenk', '‱'),
			_Utils_Tuple2('Pfr', '\uD835\uDD13'),
			_Utils_Tuple2('pfr', '\uD835\uDD2D'),
			_Utils_Tuple2('Phi', 'Φ'),
			_Utils_Tuple2('phi', 'φ'),
			_Utils_Tuple2('phiv', 'ϕ'),
			_Utils_Tuple2('phmmat', 'ℳ'),
			_Utils_Tuple2('phone', '☎'),
			_Utils_Tuple2('Pi', 'Π'),
			_Utils_Tuple2('pi', 'π'),
			_Utils_Tuple2('pitchfork', '⋔'),
			_Utils_Tuple2('piv', 'ϖ'),
			_Utils_Tuple2('planck', 'ℏ'),
			_Utils_Tuple2('planckh', 'ℎ'),
			_Utils_Tuple2('plankv', 'ℏ'),
			_Utils_Tuple2('plusacir', '⨣'),
			_Utils_Tuple2('plusb', '⊞'),
			_Utils_Tuple2('pluscir', '⨢'),
			_Utils_Tuple2('plus', '+'),
			_Utils_Tuple2('plusdo', '∔'),
			_Utils_Tuple2('plusdu', '⨥'),
			_Utils_Tuple2('pluse', '⩲'),
			_Utils_Tuple2('PlusMinus', '±'),
			_Utils_Tuple2('plusmn', '±'),
			_Utils_Tuple2('plussim', '⨦'),
			_Utils_Tuple2('plustwo', '⨧'),
			_Utils_Tuple2('pm', '±'),
			_Utils_Tuple2('Poincareplane', 'ℌ'),
			_Utils_Tuple2('pointint', '⨕'),
			_Utils_Tuple2('popf', '\uD835\uDD61'),
			_Utils_Tuple2('Popf', 'ℙ'),
			_Utils_Tuple2('pound', '£'),
			_Utils_Tuple2('prap', '⪷'),
			_Utils_Tuple2('Pr', '⪻'),
			_Utils_Tuple2('pr', '≺'),
			_Utils_Tuple2('prcue', '≼'),
			_Utils_Tuple2('precapprox', '⪷'),
			_Utils_Tuple2('prec', '≺'),
			_Utils_Tuple2('preccurlyeq', '≼'),
			_Utils_Tuple2('Precedes', '≺'),
			_Utils_Tuple2('PrecedesEqual', '⪯'),
			_Utils_Tuple2('PrecedesSlantEqual', '≼'),
			_Utils_Tuple2('PrecedesTilde', '≾'),
			_Utils_Tuple2('preceq', '⪯'),
			_Utils_Tuple2('precnapprox', '⪹'),
			_Utils_Tuple2('precneqq', '⪵'),
			_Utils_Tuple2('precnsim', '⋨'),
			_Utils_Tuple2('pre', '⪯'),
			_Utils_Tuple2('prE', '⪳'),
			_Utils_Tuple2('precsim', '≾'),
			_Utils_Tuple2('prime', '′'),
			_Utils_Tuple2('Prime', '″'),
			_Utils_Tuple2('primes', 'ℙ'),
			_Utils_Tuple2('prnap', '⪹'),
			_Utils_Tuple2('prnE', '⪵'),
			_Utils_Tuple2('prnsim', '⋨'),
			_Utils_Tuple2('prod', '∏'),
			_Utils_Tuple2('Product', '∏'),
			_Utils_Tuple2('profalar', '⌮'),
			_Utils_Tuple2('profline', '⌒'),
			_Utils_Tuple2('profsurf', '⌓'),
			_Utils_Tuple2('prop', '∝'),
			_Utils_Tuple2('Proportional', '∝'),
			_Utils_Tuple2('Proportion', '∷'),
			_Utils_Tuple2('propto', '∝'),
			_Utils_Tuple2('prsim', '≾'),
			_Utils_Tuple2('prurel', '⊰'),
			_Utils_Tuple2('Pscr', '\uD835\uDCAB'),
			_Utils_Tuple2('pscr', '\uD835\uDCC5'),
			_Utils_Tuple2('Psi', 'Ψ'),
			_Utils_Tuple2('psi', 'ψ'),
			_Utils_Tuple2('puncsp', '\u2008'),
			_Utils_Tuple2('Qfr', '\uD835\uDD14'),
			_Utils_Tuple2('qfr', '\uD835\uDD2E'),
			_Utils_Tuple2('qint', '⨌'),
			_Utils_Tuple2('qopf', '\uD835\uDD62'),
			_Utils_Tuple2('Qopf', 'ℚ'),
			_Utils_Tuple2('qprime', '⁗'),
			_Utils_Tuple2('Qscr', '\uD835\uDCAC'),
			_Utils_Tuple2('qscr', '\uD835\uDCC6'),
			_Utils_Tuple2('quaternions', 'ℍ'),
			_Utils_Tuple2('quatint', '⨖'),
			_Utils_Tuple2('quest', '?'),
			_Utils_Tuple2('questeq', '≟'),
			_Utils_Tuple2('quot', '\"'),
			_Utils_Tuple2('QUOT', '\"'),
			_Utils_Tuple2('rAarr', '⇛'),
			_Utils_Tuple2('race', '∽̱'),
			_Utils_Tuple2('Racute', 'Ŕ'),
			_Utils_Tuple2('racute', 'ŕ'),
			_Utils_Tuple2('radic', '√'),
			_Utils_Tuple2('raemptyv', '⦳'),
			_Utils_Tuple2('rang', '⟩'),
			_Utils_Tuple2('Rang', '⟫'),
			_Utils_Tuple2('rangd', '⦒'),
			_Utils_Tuple2('range', '⦥'),
			_Utils_Tuple2('rangle', '⟩'),
			_Utils_Tuple2('raquo', '»'),
			_Utils_Tuple2('rarrap', '⥵'),
			_Utils_Tuple2('rarrb', '⇥'),
			_Utils_Tuple2('rarrbfs', '⤠'),
			_Utils_Tuple2('rarrc', '⤳'),
			_Utils_Tuple2('rarr', '→'),
			_Utils_Tuple2('Rarr', '↠'),
			_Utils_Tuple2('rArr', '⇒'),
			_Utils_Tuple2('rarrfs', '⤞'),
			_Utils_Tuple2('rarrhk', '↪'),
			_Utils_Tuple2('rarrlp', '↬'),
			_Utils_Tuple2('rarrpl', '⥅'),
			_Utils_Tuple2('rarrsim', '⥴'),
			_Utils_Tuple2('Rarrtl', '⤖'),
			_Utils_Tuple2('rarrtl', '↣'),
			_Utils_Tuple2('rarrw', '↝'),
			_Utils_Tuple2('ratail', '⤚'),
			_Utils_Tuple2('rAtail', '⤜'),
			_Utils_Tuple2('ratio', '∶'),
			_Utils_Tuple2('rationals', 'ℚ'),
			_Utils_Tuple2('rbarr', '⤍'),
			_Utils_Tuple2('rBarr', '⤏'),
			_Utils_Tuple2('RBarr', '⤐'),
			_Utils_Tuple2('rbbrk', '❳'),
			_Utils_Tuple2('rbrace', '}'),
			_Utils_Tuple2('rbrack', ']'),
			_Utils_Tuple2('rbrke', '⦌'),
			_Utils_Tuple2('rbrksld', '⦎'),
			_Utils_Tuple2('rbrkslu', '⦐'),
			_Utils_Tuple2('Rcaron', 'Ř'),
			_Utils_Tuple2('rcaron', 'ř'),
			_Utils_Tuple2('Rcedil', 'Ŗ'),
			_Utils_Tuple2('rcedil', 'ŗ'),
			_Utils_Tuple2('rceil', '⌉'),
			_Utils_Tuple2('rcub', '}'),
			_Utils_Tuple2('Rcy', 'Р'),
			_Utils_Tuple2('rcy', 'р'),
			_Utils_Tuple2('rdca', '⤷'),
			_Utils_Tuple2('rdldhar', '⥩'),
			_Utils_Tuple2('rdquo', '”'),
			_Utils_Tuple2('rdquor', '”'),
			_Utils_Tuple2('rdsh', '↳'),
			_Utils_Tuple2('real', 'ℜ'),
			_Utils_Tuple2('realine', 'ℛ'),
			_Utils_Tuple2('realpart', 'ℜ'),
			_Utils_Tuple2('reals', 'ℝ'),
			_Utils_Tuple2('Re', 'ℜ'),
			_Utils_Tuple2('rect', '▭'),
			_Utils_Tuple2('reg', '®'),
			_Utils_Tuple2('REG', '®'),
			_Utils_Tuple2('ReverseElement', '∋'),
			_Utils_Tuple2('ReverseEquilibrium', '⇋'),
			_Utils_Tuple2('ReverseUpEquilibrium', '⥯'),
			_Utils_Tuple2('rfisht', '⥽'),
			_Utils_Tuple2('rfloor', '⌋'),
			_Utils_Tuple2('rfr', '\uD835\uDD2F'),
			_Utils_Tuple2('Rfr', 'ℜ'),
			_Utils_Tuple2('rHar', '⥤'),
			_Utils_Tuple2('rhard', '⇁'),
			_Utils_Tuple2('rharu', '⇀'),
			_Utils_Tuple2('rharul', '⥬'),
			_Utils_Tuple2('Rho', 'Ρ'),
			_Utils_Tuple2('rho', 'ρ'),
			_Utils_Tuple2('rhov', 'ϱ'),
			_Utils_Tuple2('RightAngleBracket', '⟩'),
			_Utils_Tuple2('RightArrowBar', '⇥'),
			_Utils_Tuple2('rightarrow', '→'),
			_Utils_Tuple2('RightArrow', '→'),
			_Utils_Tuple2('Rightarrow', '⇒'),
			_Utils_Tuple2('RightArrowLeftArrow', '⇄'),
			_Utils_Tuple2('rightarrowtail', '↣'),
			_Utils_Tuple2('RightCeiling', '⌉'),
			_Utils_Tuple2('RightDoubleBracket', '⟧'),
			_Utils_Tuple2('RightDownTeeVector', '⥝'),
			_Utils_Tuple2('RightDownVectorBar', '⥕'),
			_Utils_Tuple2('RightDownVector', '⇂'),
			_Utils_Tuple2('RightFloor', '⌋'),
			_Utils_Tuple2('rightharpoondown', '⇁'),
			_Utils_Tuple2('rightharpoonup', '⇀'),
			_Utils_Tuple2('rightleftarrows', '⇄'),
			_Utils_Tuple2('rightleftharpoons', '⇌'),
			_Utils_Tuple2('rightrightarrows', '⇉'),
			_Utils_Tuple2('rightsquigarrow', '↝'),
			_Utils_Tuple2('RightTeeArrow', '↦'),
			_Utils_Tuple2('RightTee', '⊢'),
			_Utils_Tuple2('RightTeeVector', '⥛'),
			_Utils_Tuple2('rightthreetimes', '⋌'),
			_Utils_Tuple2('RightTriangleBar', '⧐'),
			_Utils_Tuple2('RightTriangle', '⊳'),
			_Utils_Tuple2('RightTriangleEqual', '⊵'),
			_Utils_Tuple2('RightUpDownVector', '⥏'),
			_Utils_Tuple2('RightUpTeeVector', '⥜'),
			_Utils_Tuple2('RightUpVectorBar', '⥔'),
			_Utils_Tuple2('RightUpVector', '↾'),
			_Utils_Tuple2('RightVectorBar', '⥓'),
			_Utils_Tuple2('RightVector', '⇀'),
			_Utils_Tuple2('ring', '˚'),
			_Utils_Tuple2('risingdotseq', '≓'),
			_Utils_Tuple2('rlarr', '⇄'),
			_Utils_Tuple2('rlhar', '⇌'),
			_Utils_Tuple2('rlm', '\u200F'),
			_Utils_Tuple2('rmoustache', '⎱'),
			_Utils_Tuple2('rmoust', '⎱'),
			_Utils_Tuple2('rnmid', '⫮'),
			_Utils_Tuple2('roang', '⟭'),
			_Utils_Tuple2('roarr', '⇾'),
			_Utils_Tuple2('robrk', '⟧'),
			_Utils_Tuple2('ropar', '⦆'),
			_Utils_Tuple2('ropf', '\uD835\uDD63'),
			_Utils_Tuple2('Ropf', 'ℝ'),
			_Utils_Tuple2('roplus', '⨮'),
			_Utils_Tuple2('rotimes', '⨵'),
			_Utils_Tuple2('RoundImplies', '⥰'),
			_Utils_Tuple2('rpar', ')'),
			_Utils_Tuple2('rpargt', '⦔'),
			_Utils_Tuple2('rppolint', '⨒'),
			_Utils_Tuple2('rrarr', '⇉'),
			_Utils_Tuple2('Rrightarrow', '⇛'),
			_Utils_Tuple2('rsaquo', '›'),
			_Utils_Tuple2('rscr', '\uD835\uDCC7'),
			_Utils_Tuple2('Rscr', 'ℛ'),
			_Utils_Tuple2('rsh', '↱'),
			_Utils_Tuple2('Rsh', '↱'),
			_Utils_Tuple2('rsqb', ']'),
			_Utils_Tuple2('rsquo', '’'),
			_Utils_Tuple2('rsquor', '’'),
			_Utils_Tuple2('rthree', '⋌'),
			_Utils_Tuple2('rtimes', '⋊'),
			_Utils_Tuple2('rtri', '▹'),
			_Utils_Tuple2('rtrie', '⊵'),
			_Utils_Tuple2('rtrif', '▸'),
			_Utils_Tuple2('rtriltri', '⧎'),
			_Utils_Tuple2('RuleDelayed', '⧴'),
			_Utils_Tuple2('ruluhar', '⥨'),
			_Utils_Tuple2('rx', '℞'),
			_Utils_Tuple2('Sacute', 'Ś'),
			_Utils_Tuple2('sacute', 'ś'),
			_Utils_Tuple2('sbquo', '‚'),
			_Utils_Tuple2('scap', '⪸'),
			_Utils_Tuple2('Scaron', 'Š'),
			_Utils_Tuple2('scaron', 'š'),
			_Utils_Tuple2('Sc', '⪼'),
			_Utils_Tuple2('sc', '≻'),
			_Utils_Tuple2('sccue', '≽'),
			_Utils_Tuple2('sce', '⪰'),
			_Utils_Tuple2('scE', '⪴'),
			_Utils_Tuple2('Scedil', 'Ş'),
			_Utils_Tuple2('scedil', 'ş'),
			_Utils_Tuple2('Scirc', 'Ŝ'),
			_Utils_Tuple2('scirc', 'ŝ'),
			_Utils_Tuple2('scnap', '⪺'),
			_Utils_Tuple2('scnE', '⪶'),
			_Utils_Tuple2('scnsim', '⋩'),
			_Utils_Tuple2('scpolint', '⨓'),
			_Utils_Tuple2('scsim', '≿'),
			_Utils_Tuple2('Scy', 'С'),
			_Utils_Tuple2('scy', 'с'),
			_Utils_Tuple2('sdotb', '⊡'),
			_Utils_Tuple2('sdot', '⋅'),
			_Utils_Tuple2('sdote', '⩦'),
			_Utils_Tuple2('searhk', '⤥'),
			_Utils_Tuple2('searr', '↘'),
			_Utils_Tuple2('seArr', '⇘'),
			_Utils_Tuple2('searrow', '↘'),
			_Utils_Tuple2('sect', '§'),
			_Utils_Tuple2('semi', ';'),
			_Utils_Tuple2('seswar', '⤩'),
			_Utils_Tuple2('setminus', '∖'),
			_Utils_Tuple2('setmn', '∖'),
			_Utils_Tuple2('sext', '✶'),
			_Utils_Tuple2('Sfr', '\uD835\uDD16'),
			_Utils_Tuple2('sfr', '\uD835\uDD30'),
			_Utils_Tuple2('sfrown', '⌢'),
			_Utils_Tuple2('sharp', '♯'),
			_Utils_Tuple2('SHCHcy', 'Щ'),
			_Utils_Tuple2('shchcy', 'щ'),
			_Utils_Tuple2('SHcy', 'Ш'),
			_Utils_Tuple2('shcy', 'ш'),
			_Utils_Tuple2('ShortDownArrow', '↓'),
			_Utils_Tuple2('ShortLeftArrow', '←'),
			_Utils_Tuple2('shortmid', '∣'),
			_Utils_Tuple2('shortparallel', '∥'),
			_Utils_Tuple2('ShortRightArrow', '→'),
			_Utils_Tuple2('ShortUpArrow', '↑'),
			_Utils_Tuple2('shy', '\u00AD'),
			_Utils_Tuple2('Sigma', 'Σ'),
			_Utils_Tuple2('sigma', 'σ'),
			_Utils_Tuple2('sigmaf', 'ς'),
			_Utils_Tuple2('sigmav', 'ς'),
			_Utils_Tuple2('sim', '∼'),
			_Utils_Tuple2('simdot', '⩪'),
			_Utils_Tuple2('sime', '≃'),
			_Utils_Tuple2('simeq', '≃'),
			_Utils_Tuple2('simg', '⪞'),
			_Utils_Tuple2('simgE', '⪠'),
			_Utils_Tuple2('siml', '⪝'),
			_Utils_Tuple2('simlE', '⪟'),
			_Utils_Tuple2('simne', '≆'),
			_Utils_Tuple2('simplus', '⨤'),
			_Utils_Tuple2('simrarr', '⥲'),
			_Utils_Tuple2('slarr', '←'),
			_Utils_Tuple2('SmallCircle', '∘'),
			_Utils_Tuple2('smallsetminus', '∖'),
			_Utils_Tuple2('smashp', '⨳'),
			_Utils_Tuple2('smeparsl', '⧤'),
			_Utils_Tuple2('smid', '∣'),
			_Utils_Tuple2('smile', '⌣'),
			_Utils_Tuple2('smt', '⪪'),
			_Utils_Tuple2('smte', '⪬'),
			_Utils_Tuple2('smtes', '⪬︀'),
			_Utils_Tuple2('SOFTcy', 'Ь'),
			_Utils_Tuple2('softcy', 'ь'),
			_Utils_Tuple2('solbar', '⌿'),
			_Utils_Tuple2('solb', '⧄'),
			_Utils_Tuple2('sol', '/'),
			_Utils_Tuple2('Sopf', '\uD835\uDD4A'),
			_Utils_Tuple2('sopf', '\uD835\uDD64'),
			_Utils_Tuple2('spades', '♠'),
			_Utils_Tuple2('spadesuit', '♠'),
			_Utils_Tuple2('spar', '∥'),
			_Utils_Tuple2('sqcap', '⊓'),
			_Utils_Tuple2('sqcaps', '⊓︀'),
			_Utils_Tuple2('sqcup', '⊔'),
			_Utils_Tuple2('sqcups', '⊔︀'),
			_Utils_Tuple2('Sqrt', '√'),
			_Utils_Tuple2('sqsub', '⊏'),
			_Utils_Tuple2('sqsube', '⊑'),
			_Utils_Tuple2('sqsubset', '⊏'),
			_Utils_Tuple2('sqsubseteq', '⊑'),
			_Utils_Tuple2('sqsup', '⊐'),
			_Utils_Tuple2('sqsupe', '⊒'),
			_Utils_Tuple2('sqsupset', '⊐'),
			_Utils_Tuple2('sqsupseteq', '⊒'),
			_Utils_Tuple2('square', '□'),
			_Utils_Tuple2('Square', '□'),
			_Utils_Tuple2('SquareIntersection', '⊓'),
			_Utils_Tuple2('SquareSubset', '⊏'),
			_Utils_Tuple2('SquareSubsetEqual', '⊑'),
			_Utils_Tuple2('SquareSuperset', '⊐'),
			_Utils_Tuple2('SquareSupersetEqual', '⊒'),
			_Utils_Tuple2('SquareUnion', '⊔'),
			_Utils_Tuple2('squarf', '▪'),
			_Utils_Tuple2('squ', '□'),
			_Utils_Tuple2('squf', '▪'),
			_Utils_Tuple2('srarr', '→'),
			_Utils_Tuple2('Sscr', '\uD835\uDCAE'),
			_Utils_Tuple2('sscr', '\uD835\uDCC8'),
			_Utils_Tuple2('ssetmn', '∖'),
			_Utils_Tuple2('ssmile', '⌣'),
			_Utils_Tuple2('sstarf', '⋆'),
			_Utils_Tuple2('Star', '⋆'),
			_Utils_Tuple2('star', '☆'),
			_Utils_Tuple2('starf', '★'),
			_Utils_Tuple2('straightepsilon', 'ϵ'),
			_Utils_Tuple2('straightphi', 'ϕ'),
			_Utils_Tuple2('strns', '¯'),
			_Utils_Tuple2('sub', '⊂'),
			_Utils_Tuple2('Sub', '⋐'),
			_Utils_Tuple2('subdot', '⪽'),
			_Utils_Tuple2('subE', '⫅'),
			_Utils_Tuple2('sube', '⊆'),
			_Utils_Tuple2('subedot', '⫃'),
			_Utils_Tuple2('submult', '⫁'),
			_Utils_Tuple2('subnE', '⫋'),
			_Utils_Tuple2('subne', '⊊'),
			_Utils_Tuple2('subplus', '⪿'),
			_Utils_Tuple2('subrarr', '⥹'),
			_Utils_Tuple2('subset', '⊂'),
			_Utils_Tuple2('Subset', '⋐'),
			_Utils_Tuple2('subseteq', '⊆'),
			_Utils_Tuple2('subseteqq', '⫅'),
			_Utils_Tuple2('SubsetEqual', '⊆'),
			_Utils_Tuple2('subsetneq', '⊊'),
			_Utils_Tuple2('subsetneqq', '⫋'),
			_Utils_Tuple2('subsim', '⫇'),
			_Utils_Tuple2('subsub', '⫕'),
			_Utils_Tuple2('subsup', '⫓'),
			_Utils_Tuple2('succapprox', '⪸'),
			_Utils_Tuple2('succ', '≻'),
			_Utils_Tuple2('succcurlyeq', '≽'),
			_Utils_Tuple2('Succeeds', '≻'),
			_Utils_Tuple2('SucceedsEqual', '⪰'),
			_Utils_Tuple2('SucceedsSlantEqual', '≽'),
			_Utils_Tuple2('SucceedsTilde', '≿'),
			_Utils_Tuple2('succeq', '⪰'),
			_Utils_Tuple2('succnapprox', '⪺'),
			_Utils_Tuple2('succneqq', '⪶'),
			_Utils_Tuple2('succnsim', '⋩'),
			_Utils_Tuple2('succsim', '≿'),
			_Utils_Tuple2('SuchThat', '∋'),
			_Utils_Tuple2('sum', '∑'),
			_Utils_Tuple2('Sum', '∑'),
			_Utils_Tuple2('sung', '♪'),
			_Utils_Tuple2('sup1', '¹'),
			_Utils_Tuple2('sup2', '²'),
			_Utils_Tuple2('sup3', '³'),
			_Utils_Tuple2('sup', '⊃'),
			_Utils_Tuple2('Sup', '⋑'),
			_Utils_Tuple2('supdot', '⪾'),
			_Utils_Tuple2('supdsub', '⫘'),
			_Utils_Tuple2('supE', '⫆'),
			_Utils_Tuple2('supe', '⊇'),
			_Utils_Tuple2('supedot', '⫄'),
			_Utils_Tuple2('Superset', '⊃'),
			_Utils_Tuple2('SupersetEqual', '⊇'),
			_Utils_Tuple2('suphsol', '⟉'),
			_Utils_Tuple2('suphsub', '⫗'),
			_Utils_Tuple2('suplarr', '⥻'),
			_Utils_Tuple2('supmult', '⫂'),
			_Utils_Tuple2('supnE', '⫌'),
			_Utils_Tuple2('supne', '⊋'),
			_Utils_Tuple2('supplus', '⫀'),
			_Utils_Tuple2('supset', '⊃'),
			_Utils_Tuple2('Supset', '⋑'),
			_Utils_Tuple2('supseteq', '⊇'),
			_Utils_Tuple2('supseteqq', '⫆'),
			_Utils_Tuple2('supsetneq', '⊋'),
			_Utils_Tuple2('supsetneqq', '⫌'),
			_Utils_Tuple2('supsim', '⫈'),
			_Utils_Tuple2('supsub', '⫔'),
			_Utils_Tuple2('supsup', '⫖'),
			_Utils_Tuple2('swarhk', '⤦'),
			_Utils_Tuple2('swarr', '↙'),
			_Utils_Tuple2('swArr', '⇙'),
			_Utils_Tuple2('swarrow', '↙'),
			_Utils_Tuple2('swnwar', '⤪'),
			_Utils_Tuple2('szlig', 'ß'),
			_Utils_Tuple2('Tab', '\t'),
			_Utils_Tuple2('target', '⌖'),
			_Utils_Tuple2('Tau', 'Τ'),
			_Utils_Tuple2('tau', 'τ'),
			_Utils_Tuple2('tbrk', '⎴'),
			_Utils_Tuple2('Tcaron', 'Ť'),
			_Utils_Tuple2('tcaron', 'ť'),
			_Utils_Tuple2('Tcedil', 'Ţ'),
			_Utils_Tuple2('tcedil', 'ţ'),
			_Utils_Tuple2('Tcy', 'Т'),
			_Utils_Tuple2('tcy', 'т'),
			_Utils_Tuple2('tdot', '⃛'),
			_Utils_Tuple2('telrec', '⌕'),
			_Utils_Tuple2('Tfr', '\uD835\uDD17'),
			_Utils_Tuple2('tfr', '\uD835\uDD31'),
			_Utils_Tuple2('there4', '∴'),
			_Utils_Tuple2('therefore', '∴'),
			_Utils_Tuple2('Therefore', '∴'),
			_Utils_Tuple2('Theta', 'Θ'),
			_Utils_Tuple2('theta', 'θ'),
			_Utils_Tuple2('thetasym', 'ϑ'),
			_Utils_Tuple2('thetav', 'ϑ'),
			_Utils_Tuple2('thickapprox', '≈'),
			_Utils_Tuple2('thicksim', '∼'),
			_Utils_Tuple2('ThickSpace', '\u205F\u200A'),
			_Utils_Tuple2('ThinSpace', '\u2009'),
			_Utils_Tuple2('thinsp', '\u2009'),
			_Utils_Tuple2('thkap', '≈'),
			_Utils_Tuple2('thksim', '∼'),
			_Utils_Tuple2('THORN', 'Þ'),
			_Utils_Tuple2('thorn', 'þ'),
			_Utils_Tuple2('tilde', '˜'),
			_Utils_Tuple2('Tilde', '∼'),
			_Utils_Tuple2('TildeEqual', '≃'),
			_Utils_Tuple2('TildeFullEqual', '≅'),
			_Utils_Tuple2('TildeTilde', '≈'),
			_Utils_Tuple2('timesbar', '⨱'),
			_Utils_Tuple2('timesb', '⊠'),
			_Utils_Tuple2('times', '×'),
			_Utils_Tuple2('timesd', '⨰'),
			_Utils_Tuple2('tint', '∭'),
			_Utils_Tuple2('toea', '⤨'),
			_Utils_Tuple2('topbot', '⌶'),
			_Utils_Tuple2('topcir', '⫱'),
			_Utils_Tuple2('top', '⊤'),
			_Utils_Tuple2('Topf', '\uD835\uDD4B'),
			_Utils_Tuple2('topf', '\uD835\uDD65'),
			_Utils_Tuple2('topfork', '⫚'),
			_Utils_Tuple2('tosa', '⤩'),
			_Utils_Tuple2('tprime', '‴'),
			_Utils_Tuple2('trade', '™'),
			_Utils_Tuple2('TRADE', '™'),
			_Utils_Tuple2('triangle', '▵'),
			_Utils_Tuple2('triangledown', '▿'),
			_Utils_Tuple2('triangleleft', '◃'),
			_Utils_Tuple2('trianglelefteq', '⊴'),
			_Utils_Tuple2('triangleq', '≜'),
			_Utils_Tuple2('triangleright', '▹'),
			_Utils_Tuple2('trianglerighteq', '⊵'),
			_Utils_Tuple2('tridot', '◬'),
			_Utils_Tuple2('trie', '≜'),
			_Utils_Tuple2('triminus', '⨺'),
			_Utils_Tuple2('TripleDot', '⃛'),
			_Utils_Tuple2('triplus', '⨹'),
			_Utils_Tuple2('trisb', '⧍'),
			_Utils_Tuple2('tritime', '⨻'),
			_Utils_Tuple2('trpezium', '⏢'),
			_Utils_Tuple2('Tscr', '\uD835\uDCAF'),
			_Utils_Tuple2('tscr', '\uD835\uDCC9'),
			_Utils_Tuple2('TScy', 'Ц'),
			_Utils_Tuple2('tscy', 'ц'),
			_Utils_Tuple2('TSHcy', 'Ћ'),
			_Utils_Tuple2('tshcy', 'ћ'),
			_Utils_Tuple2('Tstrok', 'Ŧ'),
			_Utils_Tuple2('tstrok', 'ŧ'),
			_Utils_Tuple2('twixt', '≬'),
			_Utils_Tuple2('twoheadleftarrow', '↞'),
			_Utils_Tuple2('twoheadrightarrow', '↠'),
			_Utils_Tuple2('Uacute', 'Ú'),
			_Utils_Tuple2('uacute', 'ú'),
			_Utils_Tuple2('uarr', '↑'),
			_Utils_Tuple2('Uarr', '↟'),
			_Utils_Tuple2('uArr', '⇑'),
			_Utils_Tuple2('Uarrocir', '⥉'),
			_Utils_Tuple2('Ubrcy', 'Ў'),
			_Utils_Tuple2('ubrcy', 'ў'),
			_Utils_Tuple2('Ubreve', 'Ŭ'),
			_Utils_Tuple2('ubreve', 'ŭ'),
			_Utils_Tuple2('Ucirc', 'Û'),
			_Utils_Tuple2('ucirc', 'û'),
			_Utils_Tuple2('Ucy', 'У'),
			_Utils_Tuple2('ucy', 'у'),
			_Utils_Tuple2('udarr', '⇅'),
			_Utils_Tuple2('Udblac', 'Ű'),
			_Utils_Tuple2('udblac', 'ű'),
			_Utils_Tuple2('udhar', '⥮'),
			_Utils_Tuple2('ufisht', '⥾'),
			_Utils_Tuple2('Ufr', '\uD835\uDD18'),
			_Utils_Tuple2('ufr', '\uD835\uDD32'),
			_Utils_Tuple2('Ugrave', 'Ù'),
			_Utils_Tuple2('ugrave', 'ù'),
			_Utils_Tuple2('uHar', '⥣'),
			_Utils_Tuple2('uharl', '↿'),
			_Utils_Tuple2('uharr', '↾'),
			_Utils_Tuple2('uhblk', '▀'),
			_Utils_Tuple2('ulcorn', '⌜'),
			_Utils_Tuple2('ulcorner', '⌜'),
			_Utils_Tuple2('ulcrop', '⌏'),
			_Utils_Tuple2('ultri', '◸'),
			_Utils_Tuple2('Umacr', 'Ū'),
			_Utils_Tuple2('umacr', 'ū'),
			_Utils_Tuple2('uml', '¨'),
			_Utils_Tuple2('UnderBar', '_'),
			_Utils_Tuple2('UnderBrace', '⏟'),
			_Utils_Tuple2('UnderBracket', '⎵'),
			_Utils_Tuple2('UnderParenthesis', '⏝'),
			_Utils_Tuple2('Union', '⋃'),
			_Utils_Tuple2('UnionPlus', '⊎'),
			_Utils_Tuple2('Uogon', 'Ų'),
			_Utils_Tuple2('uogon', 'ų'),
			_Utils_Tuple2('Uopf', '\uD835\uDD4C'),
			_Utils_Tuple2('uopf', '\uD835\uDD66'),
			_Utils_Tuple2('UpArrowBar', '⤒'),
			_Utils_Tuple2('uparrow', '↑'),
			_Utils_Tuple2('UpArrow', '↑'),
			_Utils_Tuple2('Uparrow', '⇑'),
			_Utils_Tuple2('UpArrowDownArrow', '⇅'),
			_Utils_Tuple2('updownarrow', '↕'),
			_Utils_Tuple2('UpDownArrow', '↕'),
			_Utils_Tuple2('Updownarrow', '⇕'),
			_Utils_Tuple2('UpEquilibrium', '⥮'),
			_Utils_Tuple2('upharpoonleft', '↿'),
			_Utils_Tuple2('upharpoonright', '↾'),
			_Utils_Tuple2('uplus', '⊎'),
			_Utils_Tuple2('UpperLeftArrow', '↖'),
			_Utils_Tuple2('UpperRightArrow', '↗'),
			_Utils_Tuple2('upsi', 'υ'),
			_Utils_Tuple2('Upsi', 'ϒ'),
			_Utils_Tuple2('upsih', 'ϒ'),
			_Utils_Tuple2('Upsilon', 'Υ'),
			_Utils_Tuple2('upsilon', 'υ'),
			_Utils_Tuple2('UpTeeArrow', '↥'),
			_Utils_Tuple2('UpTee', '⊥'),
			_Utils_Tuple2('upuparrows', '⇈'),
			_Utils_Tuple2('urcorn', '⌝'),
			_Utils_Tuple2('urcorner', '⌝'),
			_Utils_Tuple2('urcrop', '⌎'),
			_Utils_Tuple2('Uring', 'Ů'),
			_Utils_Tuple2('uring', 'ů'),
			_Utils_Tuple2('urtri', '◹'),
			_Utils_Tuple2('Uscr', '\uD835\uDCB0'),
			_Utils_Tuple2('uscr', '\uD835\uDCCA'),
			_Utils_Tuple2('utdot', '⋰'),
			_Utils_Tuple2('Utilde', 'Ũ'),
			_Utils_Tuple2('utilde', 'ũ'),
			_Utils_Tuple2('utri', '▵'),
			_Utils_Tuple2('utrif', '▴'),
			_Utils_Tuple2('uuarr', '⇈'),
			_Utils_Tuple2('Uuml', 'Ü'),
			_Utils_Tuple2('uuml', 'ü'),
			_Utils_Tuple2('uwangle', '⦧'),
			_Utils_Tuple2('vangrt', '⦜'),
			_Utils_Tuple2('varepsilon', 'ϵ'),
			_Utils_Tuple2('varkappa', 'ϰ'),
			_Utils_Tuple2('varnothing', '∅'),
			_Utils_Tuple2('varphi', 'ϕ'),
			_Utils_Tuple2('varpi', 'ϖ'),
			_Utils_Tuple2('varpropto', '∝'),
			_Utils_Tuple2('varr', '↕'),
			_Utils_Tuple2('vArr', '⇕'),
			_Utils_Tuple2('varrho', 'ϱ'),
			_Utils_Tuple2('varsigma', 'ς'),
			_Utils_Tuple2('varsubsetneq', '⊊︀'),
			_Utils_Tuple2('varsubsetneqq', '⫋︀'),
			_Utils_Tuple2('varsupsetneq', '⊋︀'),
			_Utils_Tuple2('varsupsetneqq', '⫌︀'),
			_Utils_Tuple2('vartheta', 'ϑ'),
			_Utils_Tuple2('vartriangleleft', '⊲'),
			_Utils_Tuple2('vartriangleright', '⊳'),
			_Utils_Tuple2('vBar', '⫨'),
			_Utils_Tuple2('Vbar', '⫫'),
			_Utils_Tuple2('vBarv', '⫩'),
			_Utils_Tuple2('Vcy', 'В'),
			_Utils_Tuple2('vcy', 'в'),
			_Utils_Tuple2('vdash', '⊢'),
			_Utils_Tuple2('vDash', '⊨'),
			_Utils_Tuple2('Vdash', '⊩'),
			_Utils_Tuple2('VDash', '⊫'),
			_Utils_Tuple2('Vdashl', '⫦'),
			_Utils_Tuple2('veebar', '⊻'),
			_Utils_Tuple2('vee', '∨'),
			_Utils_Tuple2('Vee', '⋁'),
			_Utils_Tuple2('veeeq', '≚'),
			_Utils_Tuple2('vellip', '⋮'),
			_Utils_Tuple2('verbar', '|'),
			_Utils_Tuple2('Verbar', '‖'),
			_Utils_Tuple2('vert', '|'),
			_Utils_Tuple2('Vert', '‖'),
			_Utils_Tuple2('VerticalBar', '∣'),
			_Utils_Tuple2('VerticalLine', '|'),
			_Utils_Tuple2('VerticalSeparator', '❘'),
			_Utils_Tuple2('VerticalTilde', '≀'),
			_Utils_Tuple2('VeryThinSpace', '\u200A'),
			_Utils_Tuple2('Vfr', '\uD835\uDD19'),
			_Utils_Tuple2('vfr', '\uD835\uDD33'),
			_Utils_Tuple2('vltri', '⊲'),
			_Utils_Tuple2('vnsub', '⊂⃒'),
			_Utils_Tuple2('vnsup', '⊃⃒'),
			_Utils_Tuple2('Vopf', '\uD835\uDD4D'),
			_Utils_Tuple2('vopf', '\uD835\uDD67'),
			_Utils_Tuple2('vprop', '∝'),
			_Utils_Tuple2('vrtri', '⊳'),
			_Utils_Tuple2('Vscr', '\uD835\uDCB1'),
			_Utils_Tuple2('vscr', '\uD835\uDCCB'),
			_Utils_Tuple2('vsubnE', '⫋︀'),
			_Utils_Tuple2('vsubne', '⊊︀'),
			_Utils_Tuple2('vsupnE', '⫌︀'),
			_Utils_Tuple2('vsupne', '⊋︀'),
			_Utils_Tuple2('Vvdash', '⊪'),
			_Utils_Tuple2('vzigzag', '⦚'),
			_Utils_Tuple2('Wcirc', 'Ŵ'),
			_Utils_Tuple2('wcirc', 'ŵ'),
			_Utils_Tuple2('wedbar', '⩟'),
			_Utils_Tuple2('wedge', '∧'),
			_Utils_Tuple2('Wedge', '⋀'),
			_Utils_Tuple2('wedgeq', '≙'),
			_Utils_Tuple2('weierp', '℘'),
			_Utils_Tuple2('Wfr', '\uD835\uDD1A'),
			_Utils_Tuple2('wfr', '\uD835\uDD34'),
			_Utils_Tuple2('Wopf', '\uD835\uDD4E'),
			_Utils_Tuple2('wopf', '\uD835\uDD68'),
			_Utils_Tuple2('wp', '℘'),
			_Utils_Tuple2('wr', '≀'),
			_Utils_Tuple2('wreath', '≀'),
			_Utils_Tuple2('Wscr', '\uD835\uDCB2'),
			_Utils_Tuple2('wscr', '\uD835\uDCCC'),
			_Utils_Tuple2('xcap', '⋂'),
			_Utils_Tuple2('xcirc', '◯'),
			_Utils_Tuple2('xcup', '⋃'),
			_Utils_Tuple2('xdtri', '▽'),
			_Utils_Tuple2('Xfr', '\uD835\uDD1B'),
			_Utils_Tuple2('xfr', '\uD835\uDD35'),
			_Utils_Tuple2('xharr', '⟷'),
			_Utils_Tuple2('xhArr', '⟺'),
			_Utils_Tuple2('Xi', 'Ξ'),
			_Utils_Tuple2('xi', 'ξ'),
			_Utils_Tuple2('xlarr', '⟵'),
			_Utils_Tuple2('xlArr', '⟸'),
			_Utils_Tuple2('xmap', '⟼'),
			_Utils_Tuple2('xnis', '⋻'),
			_Utils_Tuple2('xodot', '⨀'),
			_Utils_Tuple2('Xopf', '\uD835\uDD4F'),
			_Utils_Tuple2('xopf', '\uD835\uDD69'),
			_Utils_Tuple2('xoplus', '⨁'),
			_Utils_Tuple2('xotime', '⨂'),
			_Utils_Tuple2('xrarr', '⟶'),
			_Utils_Tuple2('xrArr', '⟹'),
			_Utils_Tuple2('Xscr', '\uD835\uDCB3'),
			_Utils_Tuple2('xscr', '\uD835\uDCCD'),
			_Utils_Tuple2('xsqcup', '⨆'),
			_Utils_Tuple2('xuplus', '⨄'),
			_Utils_Tuple2('xutri', '△'),
			_Utils_Tuple2('xvee', '⋁'),
			_Utils_Tuple2('xwedge', '⋀'),
			_Utils_Tuple2('Yacute', 'Ý'),
			_Utils_Tuple2('yacute', 'ý'),
			_Utils_Tuple2('YAcy', 'Я'),
			_Utils_Tuple2('yacy', 'я'),
			_Utils_Tuple2('Ycirc', 'Ŷ'),
			_Utils_Tuple2('ycirc', 'ŷ'),
			_Utils_Tuple2('Ycy', 'Ы'),
			_Utils_Tuple2('ycy', 'ы'),
			_Utils_Tuple2('yen', '¥'),
			_Utils_Tuple2('Yfr', '\uD835\uDD1C'),
			_Utils_Tuple2('yfr', '\uD835\uDD36'),
			_Utils_Tuple2('YIcy', 'Ї'),
			_Utils_Tuple2('yicy', 'ї'),
			_Utils_Tuple2('Yopf', '\uD835\uDD50'),
			_Utils_Tuple2('yopf', '\uD835\uDD6A'),
			_Utils_Tuple2('Yscr', '\uD835\uDCB4'),
			_Utils_Tuple2('yscr', '\uD835\uDCCE'),
			_Utils_Tuple2('YUcy', 'Ю'),
			_Utils_Tuple2('yucy', 'ю'),
			_Utils_Tuple2('yuml', 'ÿ'),
			_Utils_Tuple2('Yuml', 'Ÿ'),
			_Utils_Tuple2('Zacute', 'Ź'),
			_Utils_Tuple2('zacute', 'ź'),
			_Utils_Tuple2('Zcaron', 'Ž'),
			_Utils_Tuple2('zcaron', 'ž'),
			_Utils_Tuple2('Zcy', 'З'),
			_Utils_Tuple2('zcy', 'з'),
			_Utils_Tuple2('Zdot', 'Ż'),
			_Utils_Tuple2('zdot', 'ż'),
			_Utils_Tuple2('zeetrf', 'ℨ'),
			_Utils_Tuple2('ZeroWidthSpace', '\u200B'),
			_Utils_Tuple2('Zeta', 'Ζ'),
			_Utils_Tuple2('zeta', 'ζ'),
			_Utils_Tuple2('zfr', '\uD835\uDD37'),
			_Utils_Tuple2('Zfr', 'ℨ'),
			_Utils_Tuple2('ZHcy', 'Ж'),
			_Utils_Tuple2('zhcy', 'ж'),
			_Utils_Tuple2('zigrarr', '⇝'),
			_Utils_Tuple2('zopf', '\uD835\uDD6B'),
			_Utils_Tuple2('Zopf', 'ℤ'),
			_Utils_Tuple2('Zscr', '\uD835\uDCB5'),
			_Utils_Tuple2('zscr', '\uD835\uDCCF'),
			_Utils_Tuple2('zwj', '\u200D'),
			_Utils_Tuple2('zwnj', '\u200C')
		]));
var $hecrj$html_parser$Html$Parser$namedCharacterReference = A2(
	$elm$parser$Parser$map,
	function (reference) {
		return A2(
			$elm$core$Maybe$withDefault,
			'&' + (reference + ';'),
			A2($elm$core$Dict$get, reference, $hecrj$html_parser$Html$Parser$NamedCharacterReferences$dict));
	},
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isAlpha)));
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Char$fromCode = _Char_fromCode;
var $elm$core$Basics$pow = _Basics_pow;
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$Char$isHexDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return ((48 <= code) && (code <= 57)) || (((65 <= code) && (code <= 70)) || ((97 <= code) && (code <= 102)));
};
var $hecrj$html_parser$Html$Parser$hexadecimal = A2(
	$elm$parser$Parser$andThen,
	function (hex) {
		var _v0 = $rtfeldman$elm_hex$Hex$fromString(
			$elm$core$String$toLower(hex));
		if (!_v0.$) {
			var value = _v0.a;
			return $elm$parser$Parser$succeed(value);
		} else {
			var error = _v0.a;
			return $elm$parser$Parser$problem(error);
		}
	},
	$elm$parser$Parser$getChompedString(
		$hecrj$html_parser$Html$Parser$chompOneOrMore($elm$core$Char$isHexDigit)));
var $elm$parser$Parser$ExpectingInt = {$: 1};
var $elm$parser$Parser$Advanced$consumeBase = _Parser_consumeBase;
var $elm$parser$Parser$Advanced$consumeBase16 = _Parser_consumeBase16;
var $elm$parser$Parser$Advanced$bumpOffset = F2(
	function (newOffset, s) {
		return {bp: s.bp + (newOffset - s.b), e: s.e, g: s.g, b: newOffset, b0: s.b0, b6: s.b6};
	});
var $elm$parser$Parser$Advanced$chompBase10 = _Parser_chompBase10;
var $elm$parser$Parser$Advanced$isAsciiCode = _Parser_isAsciiCode;
var $elm$parser$Parser$Advanced$consumeExp = F2(
	function (offset, src) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 101, offset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 69, offset, src)) {
			var eOffset = offset + 1;
			var expOffset = (A3($elm$parser$Parser$Advanced$isAsciiCode, 43, eOffset, src) || A3($elm$parser$Parser$Advanced$isAsciiCode, 45, eOffset, src)) ? (eOffset + 1) : eOffset;
			var newOffset = A2($elm$parser$Parser$Advanced$chompBase10, expOffset, src);
			return _Utils_eq(expOffset, newOffset) ? (-newOffset) : newOffset;
		} else {
			return offset;
		}
	});
var $elm$parser$Parser$Advanced$consumeDotAndExp = F2(
	function (offset, src) {
		return A3($elm$parser$Parser$Advanced$isAsciiCode, 46, offset, src) ? A2(
			$elm$parser$Parser$Advanced$consumeExp,
			A2($elm$parser$Parser$Advanced$chompBase10, offset + 1, src),
			src) : A2($elm$parser$Parser$Advanced$consumeExp, offset, src);
	});
var $elm$parser$Parser$Advanced$finalizeInt = F5(
	function (invalid, handler, startOffset, _v0, s) {
		var endOffset = _v0.a;
		var n = _v0.b;
		if (handler.$ === 1) {
			var x = handler.a;
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A2($elm$parser$Parser$Advanced$fromState, s, x));
		} else {
			var toValue = handler.a;
			return _Utils_eq(startOffset, endOffset) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				_Utils_cmp(s.b, startOffset) < 0,
				A2($elm$parser$Parser$Advanced$fromState, s, invalid)) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				toValue(n),
				A2($elm$parser$Parser$Advanced$bumpOffset, endOffset, s));
		}
	});
var $elm$core$String$toFloat = _String_toFloat;
var $elm$parser$Parser$Advanced$finalizeFloat = F6(
	function (invalid, expecting, intSettings, floatSettings, intPair, s) {
		var intOffset = intPair.a;
		var floatOffset = A2($elm$parser$Parser$Advanced$consumeDotAndExp, intOffset, s.b6);
		if (floatOffset < 0) {
			return A2(
				$elm$parser$Parser$Advanced$Bad,
				true,
				A4($elm$parser$Parser$Advanced$fromInfo, s.b0, s.bp - (floatOffset + s.b), invalid, s.e));
		} else {
			if (_Utils_eq(s.b, floatOffset)) {
				return A2(
					$elm$parser$Parser$Advanced$Bad,
					false,
					A2($elm$parser$Parser$Advanced$fromState, s, expecting));
			} else {
				if (_Utils_eq(intOffset, floatOffset)) {
					return A5($elm$parser$Parser$Advanced$finalizeInt, invalid, intSettings, s.b, intPair, s);
				} else {
					if (floatSettings.$ === 1) {
						var x = floatSettings.a;
						return A2(
							$elm$parser$Parser$Advanced$Bad,
							true,
							A2($elm$parser$Parser$Advanced$fromState, s, invalid));
					} else {
						var toValue = floatSettings.a;
						var _v1 = $elm$core$String$toFloat(
							A3($elm$core$String$slice, s.b, floatOffset, s.b6));
						if (_v1.$ === 1) {
							return A2(
								$elm$parser$Parser$Advanced$Bad,
								true,
								A2($elm$parser$Parser$Advanced$fromState, s, invalid));
						} else {
							var n = _v1.a;
							return A3(
								$elm$parser$Parser$Advanced$Good,
								true,
								toValue(n),
								A2($elm$parser$Parser$Advanced$bumpOffset, floatOffset, s));
						}
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$number = function (c) {
	return function (s) {
		if (A3($elm$parser$Parser$Advanced$isAsciiCode, 48, s.b, s.b6)) {
			var zeroOffset = s.b + 1;
			var baseOffset = zeroOffset + 1;
			return A3($elm$parser$Parser$Advanced$isAsciiCode, 120, zeroOffset, s.b6) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.cK,
				c.bB,
				baseOffset,
				A2($elm$parser$Parser$Advanced$consumeBase16, baseOffset, s.b6),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 111, zeroOffset, s.b6) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.cK,
				c.bO,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 8, baseOffset, s.b6),
				s) : (A3($elm$parser$Parser$Advanced$isAsciiCode, 98, zeroOffset, s.b6) ? A5(
				$elm$parser$Parser$Advanced$finalizeInt,
				c.cK,
				c.bm,
				baseOffset,
				A3($elm$parser$Parser$Advanced$consumeBase, 2, baseOffset, s.b6),
				s) : A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.cK,
				c.bv,
				c.bH,
				c.bx,
				_Utils_Tuple2(zeroOffset, 0),
				s)));
		} else {
			return A6(
				$elm$parser$Parser$Advanced$finalizeFloat,
				c.cK,
				c.bv,
				c.bH,
				c.bx,
				A3($elm$parser$Parser$Advanced$consumeBase, 10, s.b, s.b6),
				s);
		}
	};
};
var $elm$parser$Parser$Advanced$int = F2(
	function (expecting, invalid) {
		return $elm$parser$Parser$Advanced$number(
			{
				bm: $elm$core$Result$Err(invalid),
				bv: expecting,
				bx: $elm$core$Result$Err(invalid),
				bB: $elm$core$Result$Err(invalid),
				bH: $elm$core$Result$Ok($elm$core$Basics$identity),
				cK: invalid,
				bO: $elm$core$Result$Err(invalid)
			});
	});
var $elm$parser$Parser$int = A2($elm$parser$Parser$Advanced$int, $elm$parser$Parser$ExpectingInt, $elm$parser$Parser$ExpectingInt);
var $hecrj$html_parser$Html$Parser$numericCharacterReference = function () {
	var codepoint = $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompIf(
						function (c) {
							return (c === 'x') || (c === 'X');
						})),
				$hecrj$html_parser$Html$Parser$hexadecimal),
				A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq('0'))),
				$elm$parser$Parser$int)
			]));
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq('#'))),
		A2(
			$elm$parser$Parser$map,
			A2($elm$core$Basics$composeR, $elm$core$Char$fromCode, $elm$core$String$fromChar),
			codepoint));
}();
var $hecrj$html_parser$Html$Parser$characterReference = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($elm$core$Basics$identity),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('&'))),
	$elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$namedCharacterReference),
				$hecrj$html_parser$Html$Parser$chompSemicolon),
				A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$backtrackable($hecrj$html_parser$Html$Parser$numericCharacterReference),
				$hecrj$html_parser$Html$Parser$chompSemicolon),
				$elm$parser$Parser$succeed('&')
			])));
var $hecrj$html_parser$Html$Parser$tagAttributeQuotedValue = function (quote) {
	var isQuotedValueChar = function (c) {
		return (!_Utils_eq(c, quote)) && (c !== '&');
	};
	return A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq(quote))),
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$map,
				$elm$core$String$join(''),
				$hecrj$html_parser$Html$Parser$many(
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$getChompedString(
								$hecrj$html_parser$Html$Parser$chompOneOrMore(isQuotedValueChar)),
								$hecrj$html_parser$Html$Parser$characterReference
							])))),
			$elm$parser$Parser$chompIf(
				$elm$core$Basics$eq(quote))));
};
var $hecrj$html_parser$Html$Parser$oneOrMore = F2(
	function (type_, parser_) {
		return A2(
			$elm$parser$Parser$loop,
			_List_Nil,
			function (list) {
				return $elm$parser$Parser$oneOf(
					_List_fromArray(
						[
							A2(
							$elm$parser$Parser$map,
							function (_new) {
								return $elm$parser$Parser$Loop(
									A2($elm$core$List$cons, _new, list));
							},
							parser_),
							$elm$core$List$isEmpty(list) ? $elm$parser$Parser$problem('expecting at least one ' + type_) : $elm$parser$Parser$succeed(
							$elm$parser$Parser$Done(
								$elm$core$List$reverse(list)))
						]));
			});
	});
var $hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue = function () {
	var isUnquotedValueChar = function (c) {
		return (!$hecrj$html_parser$Html$Parser$isSpaceCharacter(c)) && ((c !== '\"') && ((c !== '\'') && ((c !== '=') && ((c !== '<') && ((c !== '>') && ((c !== '`') && (c !== '&')))))));
	};
	return A2(
		$elm$parser$Parser$map,
		$elm$core$String$join(''),
		A2(
			$hecrj$html_parser$Html$Parser$oneOrMore,
			'attribute value',
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$getChompedString(
						$hecrj$html_parser$Html$Parser$chompOneOrMore(isUnquotedValueChar)),
						$hecrj$html_parser$Html$Parser$characterReference
					]))));
}();
var $hecrj$html_parser$Html$Parser$tagAttributeValue = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Basics$identity),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('='))),
				$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$hecrj$html_parser$Html$Parser$tagAttributeUnquotedValue,
						$hecrj$html_parser$Html$Parser$tagAttributeQuotedValue('\"'),
						$hecrj$html_parser$Html$Parser$tagAttributeQuotedValue('\'')
					]))),
			$elm$parser$Parser$succeed('')
		]));
var $hecrj$html_parser$Html$Parser$tagAttribute = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$keeper,
		$elm$parser$Parser$succeed($elm$core$Tuple$pair),
		A2(
			$elm$parser$Parser$ignorer,
			$hecrj$html_parser$Html$Parser$tagAttributeName,
			$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))),
	A2(
		$elm$parser$Parser$ignorer,
		$hecrj$html_parser$Html$Parser$tagAttributeValue,
		$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter)));
var $hecrj$html_parser$Html$Parser$tagAttributes = $hecrj$html_parser$Html$Parser$many($hecrj$html_parser$Html$Parser$tagAttribute);
var $hecrj$html_parser$Html$Parser$tagName = A2(
	$elm$parser$Parser$map,
	$elm$core$String$toLower,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$chompIf($elm$core$Char$isAlphaNum),
			$elm$parser$Parser$chompWhile(
				function (c) {
					return $elm$core$Char$isAlphaNum(c) || (c === '-');
				}))));
var $hecrj$html_parser$Html$Parser$Text = function (a) {
	return {$: 0, a: a};
};
var $hecrj$html_parser$Html$Parser$text = A2(
	$elm$parser$Parser$map,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$join(''),
		$hecrj$html_parser$Html$Parser$Text),
	A2(
		$hecrj$html_parser$Html$Parser$oneOrMore,
		'text element',
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$getChompedString(
					$hecrj$html_parser$Html$Parser$chompOneOrMore(
						function (c) {
							return (c !== '<') && (c !== '&');
						})),
					$hecrj$html_parser$Html$Parser$characterReference
				]))));
function $hecrj$html_parser$Html$Parser$cyclic$node() {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				$hecrj$html_parser$Html$Parser$text,
				$hecrj$html_parser$Html$Parser$comment,
				$hecrj$html_parser$Html$Parser$cyclic$element()
			]));
}
function $hecrj$html_parser$Html$Parser$cyclic$element() {
	return A2(
		$elm$parser$Parser$andThen,
		function (_v0) {
			var name = _v0.a;
			var attributes = _v0.b;
			return $hecrj$html_parser$Html$Parser$isVoidElement(name) ? A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A3($hecrj$html_parser$Html$Parser$Element, name, attributes, _List_Nil)),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$elm$parser$Parser$chompIf(
								$elm$core$Basics$eq('/')),
								$elm$parser$Parser$succeed(0)
							]))),
				$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq('>'))) : A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed(
						A2($hecrj$html_parser$Html$Parser$Element, name, attributes)),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('>'))),
				A2(
					$elm$parser$Parser$ignorer,
					$hecrj$html_parser$Html$Parser$many(
						$elm$parser$Parser$backtrackable(
							$hecrj$html_parser$Html$Parser$cyclic$node())),
					$hecrj$html_parser$Html$Parser$closingTag(name)));
		},
		A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($elm$core$Tuple$pair),
					$elm$parser$Parser$chompIf(
						$elm$core$Basics$eq('<'))),
				A2(
					$elm$parser$Parser$ignorer,
					$hecrj$html_parser$Html$Parser$tagName,
					$elm$parser$Parser$chompWhile($hecrj$html_parser$Html$Parser$isSpaceCharacter))),
			$hecrj$html_parser$Html$Parser$tagAttributes));
}
var $hecrj$html_parser$Html$Parser$node = $hecrj$html_parser$Html$Parser$cyclic$node();
$hecrj$html_parser$Html$Parser$cyclic$node = function () {
	return $hecrj$html_parser$Html$Parser$node;
};
var $hecrj$html_parser$Html$Parser$element = $hecrj$html_parser$Html$Parser$cyclic$element();
$hecrj$html_parser$Html$Parser$cyclic$element = function () {
	return $hecrj$html_parser$Html$Parser$element;
};
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {bp: col, bU: problem, b0: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.b0, p.bp, p.bU);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{bp: 1, e: _List_Nil, g: 1, b: 0, b0: 1, b6: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $hecrj$html_parser$Html$Parser$run = function (str) {
	return $elm$core$String$isEmpty(str) ? $elm$core$Result$Ok(_List_Nil) : A2(
		$elm$parser$Parser$run,
		A2($hecrj$html_parser$Html$Parser$oneOrMore, 'node', $hecrj$html_parser$Html$Parser$node),
		str);
};
var $author$project$RichText$Internal$Spec$stringToHtmlNodeArray = function (html) {
	var _v0 = $hecrj$html_parser$Html$Parser$run(html);
	if (_v0.$ === 1) {
		return $elm$core$Result$Err('Could not parse html string');
	} else {
		var nodeList = _v0.a;
		return $elm$core$Result$Ok(
			$author$project$RichText$Internal$Spec$nodeListToHtmlNodeArray(nodeList));
	}
};
var $author$project$RichText$Internal$Spec$htmlToElementArray = F2(
	function (spec, html) {
		var _v0 = $author$project$RichText$Internal$Spec$stringToHtmlNodeArray(html);
		if (_v0.$ === 1) {
			var s = _v0.a;
			return $elm$core$Result$Err(s);
		} else {
			var htmlNodeArray = _v0.a;
			var _v1 = A2(
				$author$project$RichText$Internal$Spec$resultFilterMap,
				A2($author$project$RichText$Internal$Spec$htmlNodeToEditorFragment, spec, _List_Nil),
				htmlNodeArray);
			var newArray = _v1.a;
			var errList = _v1.b;
			return (!_Utils_eq(
				$elm$core$Array$length(newArray),
				$elm$core$Array$length(htmlNodeArray))) ? $elm$core$Result$Err(
				'Could not create a valid editor node array from html node array:\n' + A3(
					$elm$core$List$foldr,
					$elm$core$Basics$append,
					'',
					A2(
						$elm$core$List$map,
						$elm$core$Basics$append('\n'),
						errList))) : $elm$core$Result$Ok(
				$author$project$RichText$Internal$Spec$reduceEditorFragmentArray(newArray));
		}
	});
var $author$project$RichText$Internal$Paste$pasteBlockArray = F2(
	function (blockFragment, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return A2(
					$elm$core$Result$andThen,
					$author$project$RichText$Internal$Paste$pasteBlockArray(blockFragment),
					$author$project$RichText$Commands$removeRange(editorState));
			} else {
				var parentPath = $author$project$RichText$Model$Node$parent(
					$author$project$RichText$Model$Selection$anchorNode(selection));
				var _v1 = A2(
					$author$project$RichText$Node$nodeAt,
					parentPath,
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('I cannot find the parent node of the selection');
				} else {
					var parentNode = _v1.a;
					if (parentNode.$ === 1) {
						return $elm$core$Result$Err('Invalid parent node');
					} else {
						var bn = parentNode.a;
						var _v3 = $author$project$RichText$Model$Node$childNodes(bn);
						switch (_v3.$) {
							case 2:
								return $elm$core$Result$Err('Invalid parent node, somehow the parent node was a leaf');
							case 0:
								var _v4 = A3(
									$author$project$RichText$Node$replaceWithFragment,
									$author$project$RichText$Model$Selection$anchorNode(selection),
									$author$project$RichText$Node$BlockFragment(blockFragment),
									$author$project$RichText$Model$State$root(editorState));
								if (_v4.$ === 1) {
									var s = _v4.a;
									return $elm$core$Result$Err(s);
								} else {
									var newRoot = _v4.a;
									var _v5 = $elmcraft$core_extra$List$Extra$last(
										$author$project$RichText$Model$Selection$anchorNode(selection));
									if (_v5.$ === 1) {
										return $elm$core$Result$Err('Invalid anchor node, somehow the parent is root');
									} else {
										var index = _v5.a;
										var newSelection = A2(
											$author$project$RichText$Model$Selection$caret,
											_Utils_ap(
												parentPath,
												_List_fromArray(
													[
														(index + $elm$core$Array$length(blockFragment)) - 1
													])),
											0);
										return $elm$core$Result$Ok(
											A2(
												$author$project$RichText$Model$State$withRoot,
												newRoot,
												A2(
													$author$project$RichText$Model$State$withSelection,
													$elm$core$Maybe$Just(newSelection),
													editorState)));
									}
								}
							default:
								var _v6 = $author$project$RichText$Commands$splitTextBlock(editorState);
								if (_v6.$ === 1) {
									var s = _v6.a;
									return $elm$core$Result$Err(s);
								} else {
									var splitEditorState = _v6.a;
									var _v7 = $author$project$RichText$Model$State$selection(splitEditorState);
									if (_v7.$ === 1) {
										return $elm$core$Result$Err('Invalid editor state selection after split action.');
									} else {
										var splitSelection = _v7.a;
										var annotatedSelectionRoot = A2(
											$author$project$RichText$Annotation$annotateSelection,
											splitSelection,
											$author$project$RichText$Model$State$root(splitEditorState));
										var _v8 = A3(
											$author$project$RichText$Node$insertAfter,
											parentPath,
											$author$project$RichText$Node$BlockFragment(blockFragment),
											annotatedSelectionRoot);
										if (_v8.$ === 1) {
											var s = _v8.a;
											return $elm$core$Result$Err(s);
										} else {
											var addedNodesRoot = _v8.a;
											var addNodesEditorState = A2($author$project$RichText$Model$State$withRoot, addedNodesRoot, editorState);
											var joinBeginningState = A2(
												$elm$core$Result$withDefault,
												addNodesEditorState,
												$author$project$RichText$Commands$joinForward(
													A2(
														$author$project$RichText$Model$State$withSelection,
														$elm$core$Maybe$Just(
															A2(
																$author$project$RichText$Model$Selection$caret,
																$author$project$RichText$Model$Selection$anchorNode(selection),
																$author$project$RichText$Model$Selection$anchorOffset(selection))),
														addNodesEditorState)));
											var annotatedSelection = A3(
												$author$project$RichText$Annotation$selectionFromAnnotations,
												$author$project$RichText$Model$State$root(joinBeginningState),
												$author$project$RichText$Model$Selection$anchorOffset(splitSelection),
												$author$project$RichText$Model$Selection$focusOffset(splitSelection));
											var joinEndState = A2(
												$elm$core$Result$withDefault,
												joinBeginningState,
												$author$project$RichText$Commands$joinBackward(
													A2($author$project$RichText$Model$State$withSelection, annotatedSelection, joinBeginningState)));
											return $elm$core$Result$Ok(
												A2(
													$author$project$RichText$Model$State$withRoot,
													$author$project$RichText$Annotation$clearSelectionAnnotations(
														$author$project$RichText$Model$State$root(joinEndState)),
													joinEndState));
										}
									}
								}
						}
					}
				}
			}
		}
	});
var $author$project$RichText$Internal$Paste$pasteInlineArray = F2(
	function (inlineFragment, editorState) {
		var _v0 = $author$project$RichText$Model$State$selection(editorState);
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('Nothing is selected');
		} else {
			var selection = _v0.a;
			if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
				return A2(
					$elm$core$Result$andThen,
					$author$project$RichText$Internal$Paste$pasteInlineArray(inlineFragment),
					$author$project$RichText$Commands$removeRange(editorState));
			} else {
				var _v1 = A2(
					$author$project$RichText$Node$findTextBlockNodeAncestor,
					$author$project$RichText$Model$Selection$anchorNode(selection),
					$author$project$RichText$Model$State$root(editorState));
				if (_v1.$ === 1) {
					return $elm$core$Result$Err('I can only paste an inline array into a text block node');
				} else {
					var _v2 = _v1.a;
					var path = _v2.a;
					var node = _v2.b;
					var _v3 = $author$project$RichText$Model$Node$childNodes(node);
					switch (_v3.$) {
						case 0:
							return $elm$core$Result$Err('I cannot add an inline array to a block array');
						case 2:
							return $elm$core$Result$Err('I cannot add an inline array to a block leaf');
						default:
							var a = _v3.a;
							var _v4 = $elmcraft$core_extra$List$Extra$last(
								$author$project$RichText$Model$Selection$anchorNode(selection));
							if (_v4.$ === 1) {
								return $elm$core$Result$Err('Invalid state, somehow the anchor node is the root node');
							} else {
								var index = _v4.a;
								var _v5 = A2(
									$elm$core$Array$get,
									index,
									$author$project$RichText$Model$Node$toInlineArray(a));
								if (_v5.$ === 1) {
									return $elm$core$Result$Err('Invalid anchor node path');
								} else {
									var inlineNode = _v5.a;
									if (inlineNode.$ === 1) {
										var tl = inlineNode.a;
										var newSelection = A2(
											$author$project$RichText$Model$Selection$caret,
											_Utils_ap(
												path,
												_List_fromArray(
													[
														(index + $elm$core$Array$length(inlineFragment)) + 1
													])),
											0);
										var _v7 = A2(
											$author$project$RichText$Node$splitTextLeaf,
											$author$project$RichText$Model$Selection$anchorOffset(selection),
											tl);
										var previous = _v7.a;
										var next = _v7.b;
										var newFragment = $elm$core$Array$fromList(
											A2(
												$elm$core$List$cons,
												$author$project$RichText$Model$Node$Text(previous),
												_Utils_ap(
													$elm$core$Array$toList(inlineFragment),
													_List_fromArray(
														[
															$author$project$RichText$Model$Node$Text(next)
														]))));
										var replaceResult = A3(
											$author$project$RichText$Node$replaceWithFragment,
											$author$project$RichText$Model$Selection$anchorNode(selection),
											$author$project$RichText$Node$InlineFragment(newFragment),
											$author$project$RichText$Model$State$root(editorState));
										if (replaceResult.$ === 1) {
											var s = replaceResult.a;
											return $elm$core$Result$Err(s);
										} else {
											var newRoot = replaceResult.a;
											return $elm$core$Result$Ok(
												A2(
													$author$project$RichText$Model$State$withRoot,
													newRoot,
													A2(
														$author$project$RichText$Model$State$withSelection,
														$elm$core$Maybe$Just(newSelection),
														editorState)));
										}
									} else {
										var replaceResult = A3(
											$author$project$RichText$Node$replaceWithFragment,
											$author$project$RichText$Model$Selection$anchorNode(selection),
											$author$project$RichText$Node$InlineFragment(inlineFragment),
											$author$project$RichText$Model$State$root(editorState));
										var newSelection = A2(
											$author$project$RichText$Model$Selection$caret,
											_Utils_ap(
												path,
												_List_fromArray(
													[
														(index + $elm$core$Array$length(inlineFragment)) - 1
													])),
											0);
										if (replaceResult.$ === 1) {
											var s = replaceResult.a;
											return $elm$core$Result$Err(s);
										} else {
											var newRoot = replaceResult.a;
											return $elm$core$Result$Ok(
												A2(
													$author$project$RichText$Model$State$withRoot,
													newRoot,
													A2(
														$author$project$RichText$Model$State$withSelection,
														$elm$core$Maybe$Just(newSelection),
														editorState)));
										}
									}
								}
							}
					}
				}
			}
		}
	});
var $author$project$RichText$Internal$Paste$pasteFragment = F2(
	function (fragment, editorState) {
		if (fragment.$ === 1) {
			var a = fragment.a;
			return A2($author$project$RichText$Internal$Paste$pasteInlineArray, a, editorState);
		} else {
			var a = fragment.a;
			return A2($author$project$RichText$Internal$Paste$pasteBlockArray, a, editorState);
		}
	});
var $author$project$RichText$Internal$Paste$pasteHtml = F3(
	function (spec, html, editorState) {
		if ($elm$core$String$isEmpty(html)) {
			return $elm$core$Result$Err('There is no html to paste');
		} else {
			var _v0 = A2($author$project$RichText$Internal$Spec$htmlToElementArray, spec, html);
			if (_v0.$ === 1) {
				var s = _v0.a;
				return $elm$core$Result$Err(s);
			} else {
				var fragmentArray = _v0.a;
				return A3(
					$elm$core$Array$foldl,
					F2(
						function (fragment, result) {
							if (result.$ === 1) {
								return result;
							} else {
								var state = result.a;
								return A2($author$project$RichText$Internal$Paste$pasteFragment, fragment, state);
							}
						}),
					$elm$core$Result$Ok(editorState),
					fragmentArray);
			}
		}
	});
var $author$project$RichText$Internal$Paste$pasteText = F2(
	function (text, editorState) {
		if ($elm$core$String$isEmpty(text)) {
			return $elm$core$Result$Err('There is no text to paste');
		} else {
			var _v0 = $author$project$RichText$Model$State$selection(editorState);
			if (_v0.$ === 1) {
				return $elm$core$Result$Err('Nothing is selected');
			} else {
				var selection = _v0.a;
				if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
					return A2(
						$elm$core$Result$andThen,
						$author$project$RichText$Internal$Paste$pasteText(text),
						$author$project$RichText$Commands$removeRange(editorState));
				} else {
					var lines = A2(
						$elm$core$String$split,
						'\n',
						A3($elm$core$String$replace, $author$project$RichText$Internal$Constants$zeroWidthSpace, '', text));
					var _v1 = A2(
						$author$project$RichText$Node$findTextBlockNodeAncestor,
						$author$project$RichText$Model$Selection$anchorNode(selection),
						$author$project$RichText$Model$State$root(editorState));
					if (_v1.$ === 1) {
						return $elm$core$Result$Err('I can only paste test if there is a text block ancestor');
					} else {
						var _v2 = _v1.a;
						var tbNode = _v2.b;
						var newLines = A2(
							$elm$core$List$map,
							function (line) {
								return A2(
									$author$project$RichText$Model$Node$block,
									$author$project$RichText$Model$Node$element(tbNode),
									$author$project$RichText$Model$Node$inlineChildren(
										$elm$core$Array$fromList(
											_List_fromArray(
												[
													$author$project$RichText$Model$Node$plainText(line)
												]))));
							},
							lines);
						var fragment = $author$project$RichText$Node$BlockFragment(
							$elm$core$Array$fromList(newLines));
						return A2($author$project$RichText$Internal$Paste$pasteFragment, fragment, editorState);
					}
				}
			}
		}
	});
var $author$project$RichText$Internal$Paste$handlePaste = F3(
	function (event, spec, editor) {
		var commandArray = _List_fromArray(
			[
				_Utils_Tuple2(
				'pasteHtml',
				$author$project$RichText$Config$Command$transform(
					A2($author$project$RichText$Internal$Paste$pasteHtml, spec, event.cG))),
				_Utils_Tuple2(
				'pasteText',
				$author$project$RichText$Config$Command$transform(
					$author$project$RichText$Internal$Paste$pasteText(event.as)))
			]);
		return A2(
			$elm$core$Result$withDefault,
			editor,
			A3($author$project$RichText$Internal$Editor$applyNamedCommandList, commandArray, spec, editor));
	});
var $author$project$RichText$Internal$DomNode$DomNode = $elm$core$Basics$identity;
var $author$project$RichText$Internal$DomNode$DomNodeContents = F4(
	function (nodeType, tagName, nodeValue, childNodes) {
		return {cp: childNodes, a1: nodeType, bN: nodeValue, bd: tagName};
	});
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm_community$json_extra$Json$Decode$Extra$combine = A2(
	$elm$core$List$foldr,
	$elm$json$Json$Decode$map2($elm$core$List$cons),
	$elm$json$Json$Decode$succeed(_List_Nil));
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm_community$json_extra$Json$Decode$Extra$collection = function (decoder) {
	return A2(
		$elm$json$Json$Decode$andThen,
		function (length) {
			return $elm_community$json_extra$Json$Decode$Extra$combine(
				A2(
					$elm$core$List$map,
					function (index) {
						return A2(
							$elm$json$Json$Decode$field,
							$elm$core$String$fromInt(index),
							decoder);
					},
					A2($elm$core$List$range, 0, length - 1)));
		},
		A2($elm$json$Json$Decode$field, 'length', $elm$json$Json$Decode$int));
};
var $elm$json$Json$Decode$lazy = function (thunk) {
	return A2(
		$elm$json$Json$Decode$andThen,
		thunk,
		$elm$json$Json$Decode$succeed(0));
};
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $elm$json$Json$Decode$maybe = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder),
				$elm$json$Json$Decode$succeed($elm$core$Maybe$Nothing)
			]));
};
var $elm$json$Json$Decode$string = _Json_decodeString;
function $author$project$RichText$Internal$DomNode$cyclic$decodeDomNode() {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Basics$identity,
		A5(
			$elm$json$Json$Decode$map4,
			$author$project$RichText$Internal$DomNode$DomNodeContents,
			A2($elm$json$Json$Decode$field, 'nodeType', $elm$json$Json$Decode$int),
			$elm$json$Json$Decode$maybe(
				A2($elm$json$Json$Decode$field, 'tagName', $elm$json$Json$Decode$string)),
			$elm$json$Json$Decode$maybe(
				A2($elm$json$Json$Decode$field, 'nodeValue', $elm$json$Json$Decode$string)),
			$elm$json$Json$Decode$maybe(
				A2(
					$elm$json$Json$Decode$field,
					'childNodes',
					A2(
						$elm$json$Json$Decode$map,
						$elm$core$Array$fromList,
						$elm_community$json_extra$Json$Decode$Extra$collection(
							$elm$json$Json$Decode$lazy(
								function (_v0) {
									return $author$project$RichText$Internal$DomNode$cyclic$decodeDomNode();
								})))))));
}
var $author$project$RichText$Internal$DomNode$decodeDomNode = $author$project$RichText$Internal$DomNode$cyclic$decodeDomNode();
$author$project$RichText$Internal$DomNode$cyclic$decodeDomNode = function () {
	return $author$project$RichText$Internal$DomNode$decodeDomNode;
};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $author$project$RichText$Editor$sanitizeMutations = function (changes) {
	return A2(
		$elm$core$List$map,
		function (_v0) {
			var p = _v0.a;
			var t = _v0.b;
			return _Utils_eq(t, $author$project$RichText$Internal$Constants$zeroWidthSpace) ? _Utils_Tuple2(p, '') : _Utils_Tuple2(p, t);
		},
		changes);
};
var $author$project$RichText$Config$ElementDefinition$toHtmlNode = function (definition_) {
	var c = definition_;
	return c.cb;
};
var $author$project$RichText$Internal$HtmlNode$elementToHtmlNode = F3(
	function (spec, parameters, children) {
		var elementDefinition = A2($author$project$RichText$Internal$Spec$elementDefinitionWithDefault, parameters, spec);
		return A3($author$project$RichText$Config$ElementDefinition$toHtmlNode, elementDefinition, parameters, children);
	});
var $author$project$RichText$Internal$HtmlNode$textToHtmlNode = function (text) {
	return $author$project$RichText$Model$HtmlNode$TextNode(text);
};
var $author$project$RichText$Internal$HtmlNode$editorInlineLeafToHtmlNode = F2(
	function (spec, node) {
		if (node.$ === 1) {
			var contents = node.a;
			return $author$project$RichText$Internal$HtmlNode$textToHtmlNode(
				$author$project$RichText$Model$Text$text(contents));
		} else {
			var l = node.a;
			return A3(
				$author$project$RichText$Internal$HtmlNode$elementToHtmlNode,
				spec,
				$author$project$RichText$Model$InlineElement$element(l),
				$elm$core$Array$empty);
		}
	});
var $author$project$RichText$Internal$HtmlNode$errorNode = A3(
	$author$project$RichText$Model$HtmlNode$ElementNode,
	'div',
	_List_fromArray(
		[
			_Utils_Tuple2('class', 'rte-error')
		]),
	$elm$core$Array$empty);
var $author$project$RichText$Config$MarkDefinition$defaultMarkToHtml = F3(
	function (tag, mark_, children) {
		return A3(
			$author$project$RichText$Model$HtmlNode$ElementNode,
			tag,
			A2(
				$elm$core$List$filterMap,
				function (attr) {
					if (!attr.$) {
						var k = attr.a;
						var v = attr.b;
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(k, v));
					} else {
						return $elm$core$Maybe$Nothing;
					}
				},
				$author$project$RichText$Internal$Definitions$attributesFromMark(mark_)),
			children);
	});
var $author$project$RichText$Config$MarkDefinition$defaultMarkDefinition = function (name_) {
	return $author$project$RichText$Config$MarkDefinition$markDefinition(
		{
			by: $author$project$RichText$Config$MarkDefinition$defaultHtmlToMark(name_),
			bM: name_,
			cb: $author$project$RichText$Config$MarkDefinition$defaultMarkToHtml(name_)
		});
};
var $author$project$RichText$Config$Spec$markDefinition = F2(
	function (name, spec) {
		var c = spec;
		return A2($elm$core$Dict$get, name, c.aK);
	});
var $author$project$RichText$Internal$Spec$markDefinitionWithDefault = F2(
	function (mark, spec) {
		var name = $author$project$RichText$Internal$Definitions$nameFromMark(mark);
		return A2(
			$elm$core$Maybe$withDefault,
			$author$project$RichText$Config$MarkDefinition$defaultMarkDefinition(name),
			A2($author$project$RichText$Config$Spec$markDefinition, name, spec));
	});
var $author$project$RichText$Config$MarkDefinition$toHtmlNode = function (definition_) {
	var c = definition_;
	return c.cb;
};
var $author$project$RichText$Internal$HtmlNode$markToHtmlNode = F3(
	function (spec, mark, children) {
		var markDefinition = A2($author$project$RichText$Internal$Spec$markDefinitionWithDefault, mark, spec);
		return A3($author$project$RichText$Config$MarkDefinition$toHtmlNode, markDefinition, mark, children);
	});
var $author$project$RichText$Internal$HtmlNode$editorInlineLeafTreeToHtmlNode = F3(
	function (spec, array, tree) {
		if (tree.$ === 1) {
			var i = tree.a;
			var _v1 = A2($elm$core$Array$get, i, array);
			if (_v1.$ === 1) {
				return $author$project$RichText$Internal$HtmlNode$errorNode;
			} else {
				var l = _v1.a;
				return A2($author$project$RichText$Internal$HtmlNode$editorInlineLeafToHtmlNode, spec, l);
			}
		} else {
			var n = tree.a;
			return A3(
				$author$project$RichText$Internal$HtmlNode$markToHtmlNode,
				spec,
				n.bK,
				A2(
					$elm$core$Array$map,
					A2($author$project$RichText$Internal$HtmlNode$editorInlineLeafTreeToHtmlNode, spec, array),
					n.cq));
		}
	});
var $author$project$RichText$Internal$HtmlNode$childNodesToHtmlNode = F2(
	function (spec, childNodes) {
		switch (childNodes.$) {
			case 0:
				var blockArray = childNodes.a;
				return A2(
					$elm$core$Array$map,
					$author$project$RichText$Internal$HtmlNode$editorBlockNodeToHtmlNode(spec),
					$author$project$RichText$Model$Node$toBlockArray(blockArray));
			case 1:
				var inlineLeafArray = childNodes.a;
				return A2(
					$elm$core$Array$map,
					A2(
						$author$project$RichText$Internal$HtmlNode$editorInlineLeafTreeToHtmlNode,
						spec,
						$author$project$RichText$Model$Node$toInlineArray(inlineLeafArray)),
					$author$project$RichText$Model$Node$toInlineTree(inlineLeafArray));
			default:
				return $elm$core$Array$empty;
		}
	});
var $author$project$RichText$Internal$HtmlNode$editorBlockNodeToHtmlNode = F2(
	function (spec, node) {
		return A3(
			$author$project$RichText$Internal$HtmlNode$elementToHtmlNode,
			spec,
			$author$project$RichText$Model$Node$element(node),
			A2(
				$author$project$RichText$Internal$HtmlNode$childNodesToHtmlNode,
				spec,
				$author$project$RichText$Model$Node$childNodes(node)));
	});
var $author$project$RichText$Internal$DomNode$domElementNodeType = 1;
var $author$project$RichText$Internal$DomNode$domTextNodeType = 3;
var $elmcraft$core_extra$Array$Extra$map2 = F3(
	function (elementsCombine, aArray, bArray) {
		return $elm$core$Array$fromList(
			A3(
				$elm$core$List$map2,
				elementsCombine,
				$elm$core$Array$toList(aArray),
				$elm$core$Array$toList(bArray)));
	});
var $elm$core$String$toUpper = _String_toUpper;
var $author$project$RichText$Internal$DomNode$findTextChangesRec = F3(
	function (htmlNode, domNode, backwardsNodePath) {
		var domNodeContents = domNode;
		if (!htmlNode.$) {
			var tag = htmlNode.a;
			var children = htmlNode.c;
			var domChildNodes = A2($elm$core$Maybe$withDefault, $elm$core$Array$empty, domNodeContents.cp);
			if (!_Utils_eq(domNodeContents.a1, $author$project$RichText$Internal$DomNode$domElementNodeType)) {
				return $elm$core$Result$Err('Dom node is a text node, but I was expecting an element node');
			} else {
				if (!_Utils_eq(
					$elm$core$Maybe$Just(
						$elm$core$String$toUpper(tag)),
					domNodeContents.bd)) {
					return $elm$core$Result$Err(
						'Dom node\'s tag was ' + (A2($elm$core$Maybe$withDefault, '', domNodeContents.bd) + (', but I was expecting ' + tag)));
				} else {
					if (!_Utils_eq(
						$elm$core$Array$length(domChildNodes),
						$elm$core$Array$length(children))) {
						return $elm$core$Result$Err(
							'Dom node\'s children length was ' + ($elm$core$String$fromInt(
								$elm$core$Array$length(domChildNodes)) + (', but I was expecting ' + $elm$core$String$fromInt(
								$elm$core$Array$length(children)))));
					} else {
						var indexedNodePairs = A2(
							$elm$core$Array$indexedMap,
							$elm$core$Tuple$pair,
							A3($elmcraft$core_extra$Array$Extra$map2, $elm$core$Tuple$pair, children, domChildNodes));
						return A3(
							$elm$core$Array$foldl,
							F2(
								function (_v2, resultTextChangeList) {
									var i = _v2.a;
									var _v3 = _v2.b;
									var htmlChild = _v3.a;
									var domChild = _v3.b;
									if (resultTextChangeList.$ === 1) {
										var s = resultTextChangeList.a;
										return $elm$core$Result$Err(s);
									} else {
										var x = resultTextChangeList.a;
										var _v5 = A3(
											$author$project$RichText$Internal$DomNode$findTextChangesRec,
											htmlChild,
											domChild,
											A2($elm$core$List$cons, i, backwardsNodePath));
										if (_v5.$ === 1) {
											var s = _v5.a;
											return $elm$core$Result$Err(s);
										} else {
											var y = _v5.a;
											return $elm$core$Result$Ok(
												_Utils_ap(x, y));
										}
									}
								}),
							$elm$core$Result$Ok(_List_Nil),
							indexedNodePairs);
					}
				}
			}
		} else {
			var textNodeText = htmlNode.a;
			if (!_Utils_eq(domNodeContents.a1, $author$project$RichText$Internal$DomNode$domTextNodeType)) {
				return $elm$core$Result$Err('Dom node was an element node, but I was expecting a text node');
			} else {
				var _v6 = domNodeContents.bN;
				if (_v6.$ === 1) {
					return $elm$core$Result$Err('Dom node is a text node, but has no value');
				} else {
					var domNodeText = _v6.a;
					var domNodeSanitizedText = _Utils_eq(domNodeText, $author$project$RichText$Internal$Constants$zeroWidthSpace) ? '' : domNodeText;
					return (!_Utils_eq(domNodeSanitizedText, textNodeText)) ? $elm$core$Result$Ok(
						_List_fromArray(
							[
								_Utils_Tuple2(
								$elm$core$List$reverse(backwardsNodePath),
								domNodeSanitizedText)
							])) : $elm$core$Result$Ok(_List_Nil);
				}
			}
		}
	});
var $author$project$RichText$Internal$DomNode$findTextChanges = F2(
	function (htmlNode, domNode) {
		return A3($author$project$RichText$Internal$DomNode$findTextChangesRec, htmlNode, domNode, _List_Nil);
	});
var $author$project$RichText$Editor$deriveTextChanges = F3(
	function (spec_, editorNode, domNode) {
		var htmlNode = A2($author$project$RichText$Internal$HtmlNode$editorBlockNodeToHtmlNode, spec_, editorNode);
		return A2($author$project$RichText$Internal$DomNode$findTextChanges, htmlNode, domNode);
	});
var $author$project$RichText$Internal$DomNode$extractRootEditorBlockNode = function (domNode) {
	var node = domNode;
	var _v1 = node.cp;
	if (_v1.$ === 1) {
		return $elm$core$Maybe$Nothing;
	} else {
		var childNodes = _v1.a;
		return A2($elm$core$Array$get, 0, childNodes);
	}
};
var $author$project$RichText$Internal$Editor$forceCompleteRerender = function (e) {
	var c = e;
	return _Utils_update(
		c,
		{aj: c.aj + 1});
};
var $author$project$RichText$Editor$needCompleteRerender = function (root) {
	var v = root;
	var cnodes = A2($elm$core$Maybe$withDefault, $elm$core$Array$empty, v.cp);
	return $elm$core$Array$length(cnodes) !== 1;
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$RichText$Editor$differentText = F2(
	function (root, _v0) {
		var path = _v0.a;
		var t = _v0.b;
		var _v1 = A2($author$project$RichText$Node$nodeAt, path, root);
		if (_v1.$ === 1) {
			return true;
		} else {
			var node = _v1.a;
			if (node.$ === 1) {
				var il = node.a;
				if (il.$ === 1) {
					var tl = il.a;
					return !_Utils_eq(
						$author$project$RichText$Model$Text$text(tl),
						t);
				} else {
					return true;
				}
			} else {
				return true;
			}
		}
	});
var $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder = $elm$core$Array$fromList(
	_List_fromArray(
		[
			A3($author$project$RichText$Model$HtmlNode$ElementNode, '__child_node_marker__', _List_Nil, $elm$core$Array$empty)
		]));
var $author$project$RichText$Internal$Path$removePathUpToChildContents = F2(
	function (node, path) {
		removePathUpToChildContents:
		while (true) {
			if (!node.$) {
				var children = node.c;
				if (_Utils_eq(children, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder)) {
					return $elm$core$Maybe$Just(path);
				} else {
					if (!path.b) {
						return $elm$core$Maybe$Just(path);
					} else {
						var x = path.a;
						var xs = path.b;
						var _v2 = A2($elm$core$Array$get, x, children);
						if (_v2.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var child = _v2.a;
							var $temp$node = child,
								$temp$path = xs;
							node = $temp$node;
							path = $temp$path;
							continue removePathUpToChildContents;
						}
					}
				}
			} else {
				return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RichText$Internal$Path$domToEditorInlineLeafTree = F3(
	function (spec, tree, path) {
		domToEditorInlineLeafTree:
		while (true) {
			if (tree.$ === 1) {
				var i = tree.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[i]));
			} else {
				var n = tree.a;
				var markDefinition = A2($author$project$RichText$Internal$Spec$markDefinitionWithDefault, n.bK, spec);
				var structure = A3($author$project$RichText$Config$MarkDefinition$toHtmlNode, markDefinition, n.bK, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder);
				var _v1 = A2($author$project$RichText$Internal$Path$removePathUpToChildContents, structure, path);
				if (_v1.$ === 1) {
					return $elm$core$Maybe$Nothing;
				} else {
					var rest = _v1.a;
					var _v2 = $elm$core$List$head(rest);
					if (_v2.$ === 1) {
						return $elm$core$Maybe$Just(_List_Nil);
					} else {
						var i = _v2.a;
						var _v3 = A2($elm$core$Array$get, i, n.cq);
						if (_v3.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var l = _v3.a;
							var $temp$spec = spec,
								$temp$tree = l,
								$temp$path = A2($elm$core$List$drop, 1, rest);
							spec = $temp$spec;
							tree = $temp$tree;
							path = $temp$path;
							continue domToEditorInlineLeafTree;
						}
					}
				}
			}
		}
	});
var $author$project$RichText$Internal$Path$domToEditor = F3(
	function (spec, node, path) {
		if ($elm$core$List$isEmpty(path)) {
			return $elm$core$Maybe$Just(_List_Nil);
		} else {
			var parameters = $author$project$RichText$Model$Node$element(node);
			var elementDefinition = A2($author$project$RichText$Internal$Spec$elementDefinitionWithDefault, parameters, spec);
			var structure = A3($author$project$RichText$Config$ElementDefinition$toHtmlNode, elementDefinition, parameters, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder);
			var _v0 = A2($author$project$RichText$Internal$Path$removePathUpToChildContents, structure, path);
			if (_v0.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var rest = _v0.a;
				var _v1 = $elm$core$List$head(rest);
				if (_v1.$ === 1) {
					return $elm$core$Maybe$Just(_List_Nil);
				} else {
					var i = _v1.a;
					var _v2 = $author$project$RichText$Model$Node$childNodes(node);
					switch (_v2.$) {
						case 0:
							var l = _v2.a;
							var _v3 = A2(
								$elm$core$Array$get,
								i,
								$author$project$RichText$Model$Node$toBlockArray(l));
							if (_v3.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var childNode = _v3.a;
								var _v4 = A3(
									$author$project$RichText$Internal$Path$domToEditor,
									spec,
									childNode,
									A2($elm$core$List$drop, 1, rest));
								if (_v4.$ === 1) {
									return $elm$core$Maybe$Nothing;
								} else {
									var p = _v4.a;
									return $elm$core$Maybe$Just(
										A2($elm$core$List$cons, i, p));
								}
							}
						case 1:
							var l = _v2.a;
							var _v5 = A2(
								$elm$core$Array$get,
								i,
								$author$project$RichText$Model$Node$toInlineTree(l));
							if (_v5.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var tree = _v5.a;
								return A3(
									$author$project$RichText$Internal$Path$domToEditorInlineLeafTree,
									spec,
									tree,
									A2($elm$core$List$drop, 1, rest));
							}
						default:
							return $elm$core$Maybe$Nothing;
					}
				}
			}
		}
	});
var $author$project$RichText$Internal$Selection$transformSelection = F3(
	function (transformation, node, selection) {
		var _v0 = A2(
			transformation,
			node,
			$author$project$RichText$Model$Selection$anchorNode(selection));
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var an = _v0.a;
			var _v1 = A2(
				transformation,
				node,
				$author$project$RichText$Model$Selection$focusNode(selection));
			if (_v1.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var fn = _v1.a;
				return $elm$core$Maybe$Just(
					A4(
						$author$project$RichText$Model$Selection$range,
						an,
						$author$project$RichText$Model$Selection$anchorOffset(selection),
						fn,
						$author$project$RichText$Model$Selection$focusOffset(selection)));
			}
		}
	});
var $author$project$RichText$Internal$Selection$domToEditor = function (spec) {
	return $author$project$RichText$Internal$Selection$transformSelection(
		$author$project$RichText$Internal$Path$domToEditor(spec));
};
var $author$project$RichText$Editor$applyTextChange = F2(
	function (editorNode, _v0) {
		var path = _v0.a;
		var text = _v0.b;
		if (!path.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = path.a;
			var xs = path.b;
			var _v2 = $author$project$RichText$Model$Node$childNodes(editorNode);
			switch (_v2.$) {
				case 0:
					var array = _v2.a;
					var a = $author$project$RichText$Model$Node$toBlockArray(array);
					var _v3 = A2($elm$core$Array$get, x, a);
					if (_v3.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var cblock = _v3.a;
						var _v4 = A2(
							$author$project$RichText$Editor$applyTextChange,
							cblock,
							_Utils_Tuple2(xs, text));
						if (_v4.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var textChangeNode = _v4.a;
							return $elm$core$Maybe$Just(
								A2(
									$author$project$RichText$Model$Node$withChildNodes,
									$author$project$RichText$Model$Node$blockChildren(
										A3($elm$core$Array$set, x, textChangeNode, a)),
									editorNode));
						}
					}
				case 1:
					var array = _v2.a;
					var a = $author$project$RichText$Model$Node$toInlineArray(array);
					if (!$elm$core$List$isEmpty(xs)) {
						return $elm$core$Maybe$Nothing;
					} else {
						var _v5 = A2($elm$core$Array$get, x, a);
						if (_v5.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var inlineNode = _v5.a;
							if (inlineNode.$ === 1) {
								var contents = inlineNode.a;
								return $elm$core$Maybe$Just(
									A2(
										$author$project$RichText$Model$Node$withChildNodes,
										$author$project$RichText$Model$Node$inlineChildren(
											A3(
												$elm$core$Array$set,
												x,
												$author$project$RichText$Model$Node$Text(
													A2(
														$author$project$RichText$Model$Text$withText,
														A3($elm$core$String$replace, $author$project$RichText$Internal$Constants$zeroWidthSpace, '', text),
														contents)),
												a)),
										editorNode));
							} else {
								return $elm$core$Maybe$Nothing;
							}
						}
					}
				default:
					return $elm$core$Maybe$Nothing;
			}
		}
	});
var $author$project$RichText$Editor$replaceText = F2(
	function (editorNode, changes) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (change, maybeNode) {
					if (maybeNode.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var node = maybeNode.a;
						return A2($author$project$RichText$Editor$applyTextChange, node, change);
					}
				}),
			$elm$core$Maybe$Just(editorNode),
			changes);
	});
var $author$project$RichText$Editor$textChangesDomToEditor = F3(
	function (spec_, editorNode, changes) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, maybeAgg) {
					var p = _v0.a;
					var text = _v0.b;
					if (maybeAgg.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var agg = maybeAgg.a;
						var _v2 = A3($author$project$RichText$Internal$Path$domToEditor, spec_, editorNode, p);
						if (_v2.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var translatedPath = _v2.a;
							return $elm$core$Maybe$Just(
								A2(
									$elm$core$List$cons,
									_Utils_Tuple2(translatedPath, text),
									agg));
						}
					}
				}),
			$elm$core$Maybe$Just(_List_Nil),
			changes);
	});
var $author$project$RichText$Editor$updateChangeEventTextChanges = F6(
	function (timestamp, composing, textChanges, selection, spec_, editor_) {
		var editorComposing = composing || $author$project$RichText$Internal$Editor$isComposing(editor_);
		var stateToCompare = editorComposing ? A2(
			$elm$core$Maybe$withDefault,
			$author$project$RichText$Editor$state(editor_),
			$author$project$RichText$Internal$Editor$bufferedEditorState(editor_)) : $author$project$RichText$Editor$state(editor_);
		var _v0 = A3(
			$author$project$RichText$Editor$textChangesDomToEditor,
			spec_,
			$author$project$RichText$Model$State$root(stateToCompare),
			textChanges);
		if (_v0.$ === 1) {
			return A2($author$project$RichText$Editor$applyForceFunctionOnEditor, $author$project$RichText$Internal$Editor$forceRerender, editor_);
		} else {
			var changes = _v0.a;
			var editorState = $author$project$RichText$Editor$state(editor_);
			var actualChanges = A2(
				$elm$core$List$filter,
				$author$project$RichText$Editor$differentText(
					$author$project$RichText$Model$State$root(stateToCompare)),
				changes);
			if ($elm$core$List$isEmpty(actualChanges)) {
				return editor_;
			} else {
				var _v1 = A2(
					$author$project$RichText$Editor$replaceText,
					$author$project$RichText$Model$State$root(editorState),
					actualChanges);
				if (_v1.$ === 1) {
					return A2($author$project$RichText$Editor$applyForceFunctionOnEditor, $author$project$RichText$Internal$Editor$forceRerender, editor_);
				} else {
					var replacedEditorNodes = _v1.a;
					var newEditorState = A2(
						$author$project$RichText$Model$State$withRoot,
						replacedEditorNodes,
						A2(
							$author$project$RichText$Model$State$withSelection,
							A2(
								$elm$core$Maybe$andThen,
								A2(
									$author$project$RichText$Internal$Selection$domToEditor,
									spec_,
									$author$project$RichText$Model$State$root(editorState)),
								selection),
							editorState));
					if (editorComposing) {
						return A2(
							$author$project$RichText$Internal$Editor$withBufferedEditorState,
							$elm$core$Maybe$Just(newEditorState),
							editor_);
					} else {
						var newEditor = A4(
							$author$project$RichText$Internal$Editor$updateEditorStateWithTimestamp,
							$elm$core$Maybe$Just(timestamp),
							'textChange',
							newEditorState,
							editor_);
						return A2($author$project$RichText$Editor$applyForceFunctionOnEditor, $author$project$RichText$Internal$Editor$forceReselection, newEditor);
					}
				}
			}
		}
	});
var $author$project$RichText$Editor$updateChangeEventFullScan = F6(
	function (timestamp, isComposing, domRoot, selection, spec_, editor_) {
		var _v0 = $author$project$RichText$Internal$DomNode$extractRootEditorBlockNode(domRoot);
		if (_v0.$ === 1) {
			return A2($author$project$RichText$Editor$applyForceFunctionOnEditor, $author$project$RichText$Internal$Editor$forceCompleteRerender, editor_);
		} else {
			var editorRootDomNode = _v0.a;
			if ($author$project$RichText$Editor$needCompleteRerender(domRoot)) {
				return A2($author$project$RichText$Editor$applyForceFunctionOnEditor, $author$project$RichText$Internal$Editor$forceCompleteRerender, editor_);
			} else {
				var _v1 = A3(
					$author$project$RichText$Editor$deriveTextChanges,
					spec_,
					$author$project$RichText$Model$State$root(
						$author$project$RichText$Editor$state(editor_)),
					editorRootDomNode);
				if (!_v1.$) {
					var changes = _v1.a;
					return A6($author$project$RichText$Editor$updateChangeEventTextChanges, timestamp, isComposing, changes, selection, spec_, editor_);
				} else {
					return A2($author$project$RichText$Editor$applyForceFunctionOnEditor, $author$project$RichText$Internal$Editor$forceRerender, editor_);
				}
			}
		}
	});
var $author$project$RichText$Editor$updateChangeEvent = F3(
	function (change, spec_, editor_) {
		var _v0 = change.co;
		if (_v0.$ === 1) {
			var _v1 = A2($elm$json$Json$Decode$decodeValue, $author$project$RichText$Internal$DomNode$decodeDomNode, change.c_);
			if (_v1.$ === 1) {
				return editor_;
			} else {
				var root = _v1.a;
				return A6($author$project$RichText$Editor$updateChangeEventFullScan, change.b9, change.bI, root, change.b2, spec_, editor_);
			}
		} else {
			var characterDataMutations = _v0.a;
			return A6(
				$author$project$RichText$Editor$updateChangeEventTextChanges,
				change.b9,
				change.bI,
				$author$project$RichText$Editor$sanitizeMutations(characterDataMutations),
				change.b2,
				spec_,
				editor_);
		}
	});
var $author$project$RichText$Editor$updateSelection = F4(
	function (maybeSelection, isDomPath, spec_, editor_) {
		var editorState = $author$project$RichText$Editor$state(editor_);
		if (maybeSelection.$ === 1) {
			return A2(
				$author$project$RichText$Internal$Editor$withState,
				A2($author$project$RichText$Model$State$withSelection, maybeSelection, editorState),
				editor_);
		} else {
			var selection = maybeSelection.a;
			var translatedSelection = isDomPath ? A3(
				$author$project$RichText$Internal$Selection$domToEditor,
				spec_,
				$author$project$RichText$Model$State$root(editorState),
				selection) : $elm$core$Maybe$Just(selection);
			if ($author$project$RichText$Internal$Editor$isComposing(editor_)) {
				var bufferedState = A2(
					$elm$core$Maybe$withDefault,
					editorState,
					$author$project$RichText$Internal$Editor$bufferedEditorState(editor_));
				return A2(
					$author$project$RichText$Internal$Editor$withBufferedEditorState,
					$elm$core$Maybe$Just(
						A2($author$project$RichText$Model$State$withSelection, translatedSelection, bufferedState)),
					editor_);
			} else {
				return A2(
					$author$project$RichText$Internal$Editor$withState,
					A2($author$project$RichText$Model$State$withSelection, translatedSelection, editorState),
					editor_);
			}
		}
	});
var $author$project$RichText$Editor$update = F3(
	function (cfg, msg, editor_) {
		var c = cfg;
		var spec_ = c.c4;
		var commandMap_ = c.cr;
		switch (msg.$) {
			case 1:
				var change = msg.a;
				return A3($author$project$RichText$Editor$updateChangeEvent, change, spec_, editor_);
			case 0:
				var selection = msg.a;
				var isDomPath = msg.b;
				return A4($author$project$RichText$Editor$updateSelection, selection, isDomPath, spec_, editor_);
			case 2:
				var inputEvent = msg.a;
				return A4($author$project$RichText$Internal$BeforeInput$handleBeforeInput, inputEvent, commandMap_, spec_, editor_);
			case 4:
				return $author$project$RichText$Editor$handleCompositionStart(editor_);
			case 5:
				return $author$project$RichText$Editor$handleCompositionEnd(editor_);
			case 3:
				var e = msg.a;
				return A4($author$project$RichText$Internal$KeyDown$handleKeyDown, e, commandMap_, spec_, editor_);
			case 6:
				var e = msg.a;
				return A3($author$project$RichText$Internal$Paste$handlePaste, e, spec_, editor_);
			case 7:
				return A2($author$project$RichText$Editor$handleCut, spec_, editor_);
			default:
				var e = msg.a;
				return A2($author$project$RichText$Editor$handleInitEvent, e, editor_);
		}
	});
var $author$project$Editor$update = F3(
	function (cfg, msg, model) {
		var spec = $author$project$RichText$Editor$spec(cfg);
		switch (msg.$) {
			case 0:
				var internalEditorMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: A3($author$project$RichText$Editor$update, cfg, internalEditorMsg, model.a)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var style = msg.a;
				return _Utils_Tuple2(
					A3($author$project$Editor$handleToggleStyle, style, spec, model),
					$elm$core$Platform$Cmd$none);
			case 2:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleShowInsertLinkModal, spec, model),
					$elm$core$Platform$Cmd$none);
			case 5:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleInsertLink, spec, model),
					$elm$core$Platform$Cmd$none);
			case 3:
				var href = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Editor$handleUpdateLinkHref, href, model),
					$elm$core$Platform$Cmd$none);
			case 4:
				var title = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Editor$handleUpdateLinkTitle, title, model),
					$elm$core$Platform$Cmd$none);
			case 8:
				return _Utils_Tuple2(
					$author$project$Editor$handleShowInsertImageModal(model),
					$elm$core$Platform$Cmd$none);
			case 9:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleInsertImage, spec, model),
					$elm$core$Platform$Cmd$none);
			case 10:
				var src = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Editor$handleUpdateImageSrc, src, model),
					$elm$core$Platform$Cmd$none);
			case 11:
				var alt = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Editor$handleUpdateImageAlt, alt, model),
					$elm$core$Platform$Cmd$none);
			case 13:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleWrapBlockNode, spec, model),
					$elm$core$Platform$Cmd$none);
			case 12:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleInsertHorizontalRule, spec, model),
					$elm$core$Platform$Cmd$none);
			case 14:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleLiftBlock, spec, model),
					$elm$core$Platform$Cmd$none);
			case 6:
				var block = msg.a;
				return _Utils_Tuple2(
					A3($author$project$Editor$handleToggleBlock, spec, block, model),
					$elm$core$Platform$Cmd$none);
			case 7:
				var listType = msg.a;
				return _Utils_Tuple2(
					A3($author$project$Editor$handleWrapInList, spec, listType, model),
					$elm$core$Platform$Cmd$none);
			case 17:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleUndo, spec, model),
					$elm$core$Platform$Cmd$none);
			case 18:
				return _Utils_Tuple2(
					A2($author$project$Editor$handleRedo, spec, model),
					$elm$core$Platform$Cmd$none);
			case 15:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Basic$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var editorMsg = msg.a;
			var _v1 = A3($author$project$Editor$update, $author$project$Page$Basic$config, editorMsg, model.a);
			var e = _v1.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{a: e}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Home$config = $author$project$RichText$Editor$config(
	{
		cr: $author$project$Editor$commandBindings($author$project$RichText$Definitions$markdown),
		cx: $author$project$Editor$decorations,
		c4: $author$project$RichText$Definitions$markdown,
		c7: $author$project$Controls$InternalMsg
	});
var $author$project$Page$Home$update = F2(
	function (msg, model) {
		if (!msg.$) {
			var editorMsg = msg.a;
			var _v1 = A3($author$project$Editor$update, $author$project$Page$Home$config, editorMsg, model.a);
			var e = _v1.a;
			return _Utils_Tuple2(
				_Utils_update(
					model,
					{a: e}),
				$elm$core$Platform$Cmd$none);
		} else {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$Markdown$Markdown = 0;
var $author$project$Page$Markdown$changeEditorTypeToMarkdown = function (model) {
	var markdownNodes = $author$project$Page$Markdown$rootToMarkdown(
		$author$project$RichText$Model$State$root(
			$author$project$RichText$Editor$state(model.a.a)));
	var _v0 = function () {
		var _v1 = A2($elm$core$Result$andThen, $author$project$Page$Markdown$markdownToString, markdownNodes);
		if (_v1.$ === 1) {
			var e = _v1.a;
			return _Utils_Tuple2(
				model.Z,
				$elm$core$Maybe$Just(e));
		} else {
			var m = _v1.a;
			return _Utils_Tuple2(m, $elm$core$Maybe$Nothing);
		}
	}();
	var result = _v0.a;
	var error = _v0.b;
	if (!error.$) {
		var e = error.a;
		return _Utils_update(
			model,
			{
				V: $elm$core$Maybe$Just(e)
			});
	} else {
		return _Utils_update(
			model,
			{K: 0, V: $elm$core$Maybe$Nothing, Z: result});
	}
};
var $pablohirafuji$elm_markdown$Markdown$Config$DontParse = {$: 2};
var $author$project$Page$Markdown$filterBlankLines = function (blocks) {
	var newBlocks = A2(
		$elm$core$List$filterMap,
		function (block) {
			switch (block.$) {
				case 0:
					return $elm$core$Maybe$Nothing;
				case 5:
					var children = block.a;
					return $elm$core$Maybe$Just(
						$pablohirafuji$elm_markdown$Markdown$Block$BlockQuote(
							$author$project$Page$Markdown$filterBlankLines(children)));
				case 6:
					var lb = block.a;
					var listItems = block.b;
					return $elm$core$Maybe$Just(
						A2(
							$pablohirafuji$elm_markdown$Markdown$Block$List,
							lb,
							A2($elm$core$List$map, $author$project$Page$Markdown$filterBlankLines, listItems)));
				default:
					return $elm$core$Maybe$Just(block);
			}
		},
		blocks);
	return $elm$core$List$isEmpty(newBlocks) ? blocks : newBlocks;
};
var $author$project$Page$Markdown$markdownCodeBlockToEditorBlock = F2(
	function (cb, s) {
		var attributes = function () {
			if (!cb.$) {
				return _List_fromArray(
					[
						A2($author$project$RichText$Model$Attribute$StringAttribute, 'type', 'indented')
					]);
			} else {
				var b = cb.a;
				var f = cb.b;
				return A2(
					$elm$core$List$filterMap,
					$elm$core$Basics$identity,
					_List_fromArray(
						[
							$elm$core$Maybe$Just(
							A2($author$project$RichText$Model$Attribute$BoolAttribute, 'open', b)),
							$elm$core$Maybe$Just(
							A2($author$project$RichText$Model$Attribute$StringAttribute, 'type', 'fenced')),
							$elm$core$Maybe$Just(
							A2($author$project$RichText$Model$Attribute$IntegerAttribute, 'indentLength', f.aI)),
							$elm$core$Maybe$Just(
							A2($author$project$RichText$Model$Attribute$IntegerAttribute, 'fenceLength', f.bw)),
							A2(
							$elm$core$Maybe$map,
							function (m) {
								return A2($author$project$RichText$Model$Attribute$StringAttribute, 'language', m);
							},
							f.cN)
						]));
			}
		}();
		return $elm$core$Result$Ok(
			A2(
				$author$project$RichText$Model$Node$block,
				A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$codeBlock, attributes),
				$author$project$RichText$Model$Node$inlineChildren(
					$elm$core$Array$fromList(
						_List_fromArray(
							[
								$author$project$RichText$Model$Node$plainText(s)
							])))));
	});
var $author$project$Page$Markdown$markdownMarkOrder = $author$project$RichText$Model$Mark$markOrderFromSpec($author$project$RichText$Definitions$markdown);
var $author$project$RichText$Model$Node$markedText = F2(
	function (s, marks_) {
		return $author$project$RichText$Model$Node$Text(
			A2(
				$author$project$RichText$Model$Text$withMarks,
				marks_,
				A2($author$project$RichText$Model$Text$withText, s, $author$project$RichText$Model$Text$empty)));
	});
var $author$project$Page$Markdown$markdownInlineListToInlineLeaves = F2(
	function (marks, inlines) {
		return A2(
			$elm$core$Result$map,
			function (items) {
				return A2($elm$core$List$concatMap, $elm$core$Basics$identity, items);
			},
			$author$project$Page$Markdown$unwrapAndFilterChildNodes(
				A2(
					$elm$core$List$map,
					$author$project$Page$Markdown$markdownInlineToInlineLeaves(marks),
					inlines)));
	});
var $author$project$Page$Markdown$markdownInlineToInlineLeaves = F2(
	function (marks, inline) {
		switch (inline.$) {
			case 0:
				var s = inline.a;
				return $elm$core$Result$Ok(
					_List_fromArray(
						[
							A2(
							$author$project$RichText$Model$Node$markedText,
							s,
							A2($author$project$RichText$Model$Mark$sort, $author$project$Page$Markdown$markdownMarkOrder, marks))
						]));
			case 1:
				return $elm$core$Result$Ok(
					_List_fromArray(
						[
							A2(
							$author$project$RichText$Model$Node$inlineElement,
							A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$hardBreak, _List_Nil),
							_List_Nil)
						]));
			case 2:
				var s = inline.a;
				var codeMark = A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$code, _List_Nil);
				return $elm$core$Result$Ok(
					_List_fromArray(
						[
							A2(
							$author$project$RichText$Model$Node$markedText,
							s,
							A2(
								$author$project$RichText$Model$Mark$sort,
								$author$project$Page$Markdown$markdownMarkOrder,
								A2($elm$core$List$cons, codeMark, marks)))
						]));
			case 3:
				var href = inline.a;
				var title = inline.b;
				var children = inline.c;
				var linkMark = A2(
					$author$project$RichText$Model$Mark$mark,
					$author$project$RichText$Definitions$link,
					A2(
						$elm$core$List$filterMap,
						$elm$core$Basics$identity,
						_List_fromArray(
							[
								$elm$core$Maybe$Just(
								A2($author$project$RichText$Model$Attribute$StringAttribute, 'href', href)),
								A2(
								$elm$core$Maybe$map,
								function (t) {
									return A2($author$project$RichText$Model$Attribute$StringAttribute, 'title', t);
								},
								title)
							])));
				return A2(
					$author$project$Page$Markdown$markdownInlineListToInlineLeaves,
					A2($elm$core$List$cons, linkMark, marks),
					children);
			case 4:
				var src = inline.a;
				var alt = inline.b;
				var inlineImage = A2(
					$author$project$RichText$Model$Node$inlineElement,
					A2(
						$author$project$RichText$Model$Element$element,
						$author$project$RichText$Definitions$image,
						A2(
							$elm$core$List$filterMap,
							$elm$core$Basics$identity,
							_List_fromArray(
								[
									$elm$core$Maybe$Just(
									A2($author$project$RichText$Model$Attribute$StringAttribute, 'src', src)),
									A2(
									$elm$core$Maybe$map,
									function (t) {
										return A2($author$project$RichText$Model$Attribute$StringAttribute, 'alt', t);
									},
									alt)
								]))),
					A2($author$project$RichText$Model$Mark$sort, $author$project$Page$Markdown$markdownMarkOrder, marks));
				return $elm$core$Result$Ok(
					_List_fromArray(
						[inlineImage]));
			case 6:
				var i = inline.a;
				var children = inline.b;
				var emphasis = function () {
					switch (i) {
						case 1:
							return _List_fromArray(
								[
									A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$italic, _List_Nil)
								]);
						case 2:
							return _List_fromArray(
								[
									A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$bold, _List_Nil)
								]);
						case 3:
							return _List_fromArray(
								[
									A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$bold, _List_Nil),
									A2($author$project$RichText$Model$Mark$mark, $author$project$RichText$Definitions$italic, _List_Nil)
								]);
						default:
							return _List_Nil;
					}
				}();
				return A2(
					$author$project$Page$Markdown$markdownInlineListToInlineLeaves,
					_Utils_ap(emphasis, marks),
					children);
			case 5:
				return $elm$core$Result$Err('Not implemented');
			default:
				return $elm$core$Result$Err('Not implemented');
		}
	});
var $author$project$Page$Markdown$markdownInlineListToInlineChildNodes = function (inlines) {
	return A2(
		$elm$core$Result$map,
		function (items) {
			return $author$project$RichText$Model$Node$inlineChildren(
				$elm$core$Array$fromList(items));
		},
		A2($author$project$Page$Markdown$markdownInlineListToInlineLeaves, _List_Nil, inlines));
};
var $author$project$Page$Markdown$markdownInlineToParagraphBlock = function (children) {
	return A2(
		$elm$core$Result$map,
		function (c) {
			return A2(
				$author$project$RichText$Model$Node$block,
				A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil),
				c);
		},
		$author$project$Page$Markdown$markdownInlineListToInlineChildNodes(children));
};
var $author$project$Page$Markdown$markdownBlockListToBlockChildNodes = function (blocks) {
	return A2(
		$elm$core$Result$map,
		function (items) {
			return $author$project$RichText$Model$Node$blockChildren(
				$elm$core$Array$fromList(items));
		},
		$author$project$Page$Markdown$markdownBlockListToBlockLeaves(blocks));
};
var $author$project$Page$Markdown$markdownBlockListToBlockLeaves = function (blocks) {
	return $author$project$Page$Markdown$unwrapAndFilterChildNodes(
		A2($elm$core$List$map, $author$project$Page$Markdown$markdownBlockToEditorBlock, blocks));
};
var $author$project$Page$Markdown$markdownBlockToEditorBlock = function (mblock) {
	switch (mblock.$) {
		case 0:
			var s = mblock.a;
			return $elm$core$Result$Ok(
				A2(
					$author$project$RichText$Model$Node$block,
					A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$paragraph, _List_Nil),
					$author$project$RichText$Model$Node$inlineChildren(
						$elm$core$Array$fromList(
							_List_fromArray(
								[
									$author$project$RichText$Model$Node$plainText(s)
								])))));
		case 1:
			return $elm$core$Result$Ok(
				A2(
					$author$project$RichText$Model$Node$block,
					A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$horizontalRule, _List_Nil),
					$author$project$RichText$Model$Node$Leaf));
		case 2:
			var i = mblock.b;
			var children = mblock.c;
			return A2(
				$elm$core$Result$map,
				function (c) {
					return A2(
						$author$project$RichText$Model$Node$block,
						A2(
							$author$project$RichText$Model$Element$element,
							$author$project$RichText$Definitions$heading,
							_List_fromArray(
								[
									A2($author$project$RichText$Model$Attribute$IntegerAttribute, 'level', i)
								])),
						c);
				},
				$author$project$Page$Markdown$markdownInlineListToInlineChildNodes(children));
		case 3:
			var cb = mblock.a;
			var s = mblock.b;
			return A2($author$project$Page$Markdown$markdownCodeBlockToEditorBlock, cb, s);
		case 4:
			var children = mblock.b;
			return $author$project$Page$Markdown$markdownInlineToParagraphBlock(children);
		case 5:
			var children = mblock.a;
			return A2(
				$elm$core$Result$map,
				function (c) {
					return A2(
						$author$project$RichText$Model$Node$block,
						A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$blockquote, _List_Nil),
						c);
				},
				$author$project$Page$Markdown$markdownBlockListToBlockChildNodes(children));
		case 6:
			var lb = mblock.a;
			var listItems = mblock.b;
			return A2($author$project$Page$Markdown$markdownListToEditorBlock, lb, listItems);
		case 7:
			var children = mblock.a;
			return $author$project$Page$Markdown$markdownInlineToParagraphBlock(children);
		default:
			return $elm$core$Result$Err('Custom elements are not implemented');
	}
};
var $author$project$Page$Markdown$markdownListToEditorBlock = F2(
	function (lb, children) {
		var _v0 = function () {
			var _v1 = lb.bf;
			if (_v1.$ === 1) {
				var i = _v1.a;
				return _Utils_Tuple2(
					$author$project$RichText$Definitions$orderedList,
					_List_fromArray(
						[
							A2($author$project$RichText$Model$Attribute$IntegerAttribute, 'startIndex', i)
						]));
			} else {
				return _Utils_Tuple2($author$project$RichText$Definitions$unorderedList, _List_Nil);
			}
		}();
		var node = _v0.a;
		var typeAttributes = _v0.b;
		var attributes = _Utils_ap(
			_List_fromArray(
				[
					A2($author$project$RichText$Model$Attribute$IntegerAttribute, 'indentLength', lb.aI),
					A2($author$project$RichText$Model$Attribute$StringAttribute, 'delimiter', lb.aB)
				]),
			typeAttributes);
		return A2(
			$elm$core$Result$map,
			function (listItems) {
				return A2(
					$author$project$RichText$Model$Node$block,
					A2($author$project$RichText$Model$Element$element, node, attributes),
					$author$project$RichText$Model$Node$blockChildren(
						$elm$core$Array$fromList(
							A2(
								$elm$core$List$map,
								function (cn) {
									return A2(
										$author$project$RichText$Model$Node$block,
										A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$listItem, _List_Nil),
										cn);
								},
								listItems))));
			},
			$author$project$Page$Markdown$unwrapAndFilterChildNodes(
				A2(
					$elm$core$List$map,
					function (x) {
						return $author$project$Page$Markdown$markdownBlockListToBlockChildNodes(x);
					},
					children)));
	});
var $author$project$Page$Markdown$markdownToBlock = function (md) {
	return A2(
		$elm$core$Result$map,
		function (children) {
			return A2(
				$author$project$RichText$Model$Node$block,
				A2($author$project$RichText$Model$Element$element, $author$project$RichText$Definitions$doc, _List_Nil),
				children);
		},
		$author$project$Page$Markdown$markdownBlockListToBlockChildNodes(md));
};
var $elm$core$String$trim = _String_trim;
var $pablohirafuji$elm_markdown$Markdown$Block$formatParagraphLine = function (rawParagraph) {
	return (A2($elm$core$String$right, 2, rawParagraph) === '  ') ? ($elm$core$String$trim(rawParagraph) + '  ') : $elm$core$String$trim(rawParagraph);
};
var $pablohirafuji$elm_markdown$Markdown$Block$addToParagraph = F2(
	function (paragraph, rawLine) {
		return A2(
			$pablohirafuji$elm_markdown$Markdown$Block$Paragraph,
			paragraph + ('\n' + $pablohirafuji$elm_markdown$Markdown$Block$formatParagraphLine(rawLine)),
			_List_Nil);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$blockQuoteLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^ {0,3}(?:>[ ]?)(.*)$'));
var $pablohirafuji$elm_markdown$Markdown$Block$blankLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\s*$'));
var $elm$regex$Regex$contains = _Regex_contains;
var $pablohirafuji$elm_markdown$Markdown$Block$calcListIndentLength = function (_v0) {
	var listBlock = _v0.a;
	var indentSpace = _v0.b;
	var rawLine = _v0.c;
	var indentSpaceLength = $elm$core$String$length(indentSpace);
	var isIndentedCode = indentSpaceLength >= 4;
	var updtRawLine = isIndentedCode ? _Utils_ap(indentSpace, rawLine) : rawLine;
	var indentLength = (isIndentedCode || A2($elm$regex$Regex$contains, $pablohirafuji$elm_markdown$Markdown$Block$blankLineRegex, rawLine)) ? (listBlock.aI - indentSpaceLength) : listBlock.aI;
	return _Utils_Tuple2(
		_Utils_update(
			listBlock,
			{aI: indentLength}),
		updtRawLine);
};
var $pablohirafuji$elm_markdown$Markdown$Block$atxHeadingLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^ {0,3}(#{1,6})' + ('(?:[ \\t]+[ \\t#]+$|[ \\t]+|$)' + '(.*?)(?:\\s+[ \\t#]*)?$')));
var $pablohirafuji$elm_markdown$Markdown$Block$extractATXHeadingRM = function (match) {
	var _v0 = match.c5;
	if ((_v0.b && (!_v0.a.$)) && _v0.b.b) {
		var lvl = _v0.a.a;
		var _v1 = _v0.b;
		var maybeHeading = _v1.a;
		return $elm$core$Maybe$Just(
			A3(
				$pablohirafuji$elm_markdown$Markdown$Block$Heading,
				A2($elm$core$Maybe$withDefault, '', maybeHeading),
				$elm$core$String$length(lvl),
				_List_Nil));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Result$fromMaybe = F2(
	function (err, maybe) {
		if (!maybe.$) {
			var v = maybe.a;
			return $elm$core$Result$Ok(v);
		} else {
			return $elm$core$Result$Err(err);
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$checkATXHeadingLine = function (_v0) {
	var rawLine = _v0.a;
	var ast = _v0.b;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple2(rawLine, ast),
		A2(
			$elm$core$Maybe$map,
			function (a) {
				return A2($elm$core$List$cons, a, ast);
			},
			A2(
				$elm$core$Maybe$andThen,
				$pablohirafuji$elm_markdown$Markdown$Block$extractATXHeadingRM,
				$elm$core$List$head(
					A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$atxHeadingLineRegex, rawLine)))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$BlankLine = function (a) {
	return {$: 0, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$Block$Fenced = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$Block$addBlankLineToListBlock = F2(
	function (match, asts) {
		if (!asts.b) {
			return _List_fromArray(
				[
					_List_fromArray(
					[
						$pablohirafuji$elm_markdown$Markdown$Block$BlankLine(match.cO)
					])
				]);
		} else {
			var ast = asts.a;
			var astsTail = asts.b;
			return A2(
				$elm$core$List$cons,
				A2($pablohirafuji$elm_markdown$Markdown$Block$parseBlankLine, ast, match),
				astsTail);
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseBlankLine = F2(
	function (ast, match) {
		_v0$2:
		while (true) {
			if (ast.b) {
				switch (ast.a.$) {
					case 3:
						if ((ast.a.a.$ === 1) && ast.a.a.a) {
							var _v1 = ast.a;
							var _v2 = _v1.a;
							var fence = _v2.b;
							var code = _v1.b;
							var astTail = ast.b;
							return function (a) {
								return A2($elm$core$List$cons, a, astTail);
							}(
								A2(
									$pablohirafuji$elm_markdown$Markdown$Block$CodeBlock,
									A2($pablohirafuji$elm_markdown$Markdown$Block$Fenced, true, fence),
									code + '\n'));
						} else {
							break _v0$2;
						}
					case 6:
						var _v3 = ast.a;
						var model = _v3.a;
						var items = _v3.b;
						var astTail = ast.b;
						return A2(
							$elm$core$List$cons,
							A2(
								$pablohirafuji$elm_markdown$Markdown$Block$List,
								model,
								A2($pablohirafuji$elm_markdown$Markdown$Block$addBlankLineToListBlock, match, items)),
							astTail);
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return A2(
			$elm$core$List$cons,
			$pablohirafuji$elm_markdown$Markdown$Block$BlankLine(match.cO),
			ast);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$checkBlankLine = function (_v0) {
	var rawLine = _v0.a;
	var ast = _v0.b;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple2(rawLine, ast),
		A2(
			$elm$core$Maybe$map,
			$pablohirafuji$elm_markdown$Markdown$Block$parseBlankLine(ast),
			$elm$core$List$head(
				A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$blankLineRegex, rawLine))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$indentedCodeLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^(?: {4,4}| {0,3}\\t)(.*)$'));
var $pablohirafuji$elm_markdown$Markdown$Block$blocksAfterBlankLines = F2(
	function (ast, blankLines) {
		blocksAfterBlankLines:
		while (true) {
			if (ast.b && (!ast.a.$)) {
				var blankStr = ast.a.a;
				var astTail = ast.b;
				var $temp$ast = astTail,
					$temp$blankLines = A2($elm$core$List$cons, blankStr, blankLines);
				ast = $temp$ast;
				blankLines = $temp$blankLines;
				continue blocksAfterBlankLines;
			} else {
				return _Utils_Tuple2(ast, blankLines);
			}
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$maybeContinueParagraph = F2(
	function (rawLine, ast) {
		_v0$3:
		while (true) {
			if (ast.b) {
				switch (ast.a.$) {
					case 4:
						var _v1 = ast.a;
						var paragraph = _v1.a;
						var astTail = ast.b;
						return $elm$core$Maybe$Just(
							A2(
								$elm$core$List$cons,
								A2($pablohirafuji$elm_markdown$Markdown$Block$addToParagraph, paragraph, rawLine),
								astTail));
					case 5:
						var bqAST = ast.a.a;
						var astTail = ast.b;
						return A2(
							$elm$core$Maybe$map,
							function (updtBqAST) {
								return A2(
									$elm$core$List$cons,
									$pablohirafuji$elm_markdown$Markdown$Block$BlockQuote(updtBqAST),
									astTail);
							},
							A2($pablohirafuji$elm_markdown$Markdown$Block$maybeContinueParagraph, rawLine, bqAST));
					case 6:
						var _v2 = ast.a;
						var model = _v2.a;
						var items = _v2.b;
						var astTail = ast.b;
						if (items.b) {
							var itemAST = items.a;
							var itemASTTail = items.b;
							return A2(
								$elm$core$Maybe$map,
								A2(
									$elm$core$Basics$composeR,
									function (a) {
										return A2($elm$core$List$cons, a, itemASTTail);
									},
									A2(
										$elm$core$Basics$composeR,
										$pablohirafuji$elm_markdown$Markdown$Block$List(model),
										function (a) {
											return A2($elm$core$List$cons, a, astTail);
										})),
								A2($pablohirafuji$elm_markdown$Markdown$Block$maybeContinueParagraph, rawLine, itemAST));
						} else {
							return $elm$core$Maybe$Nothing;
						}
					default:
						break _v0$3;
				}
			} else {
				break _v0$3;
			}
		}
		return $elm$core$Maybe$Nothing;
	});
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $elm$regex$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $elm$regex$Regex$replaceAtMost = _Regex_replaceAtMost;
var $pablohirafuji$elm_markdown$Markdown$Helpers$tabRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('\\t'));
var $pablohirafuji$elm_markdown$Markdown$Helpers$indentLine = function (indentLength_) {
	return A2(
		$elm$core$Basics$composeR,
		A2(
			$elm$regex$Regex$replace,
			$pablohirafuji$elm_markdown$Markdown$Helpers$tabRegex,
			function (_v0) {
				return '    ';
			}),
		A3(
			$elm$regex$Regex$replaceAtMost,
			1,
			A2(
				$elm$core$Maybe$withDefault,
				$elm$regex$Regex$never,
				$elm$regex$Regex$fromString(
					'^ {0,' + ($elm$core$String$fromInt(indentLength_) + '}'))),
			function (_v1) {
				return '';
			}));
};
var $pablohirafuji$elm_markdown$Markdown$Block$resumeIndentedCodeBlock = F2(
	function (codeLine, _v0) {
		var remainBlocks = _v0.a;
		var blankLines = _v0.b;
		if ((remainBlocks.b && (remainBlocks.a.$ === 3)) && (!remainBlocks.a.a.$)) {
			var _v2 = remainBlocks.a;
			var _v3 = _v2.a;
			var codeStr = _v2.b;
			var remainBlocksTail = remainBlocks.b;
			return $elm$core$Maybe$Just(
				function (a) {
					return A2($elm$core$List$cons, a, remainBlocksTail);
				}(
					A2(
						$pablohirafuji$elm_markdown$Markdown$Block$CodeBlock,
						$pablohirafuji$elm_markdown$Markdown$Block$Indented,
						function (a) {
							return a + (codeLine + '\n');
						}(
							_Utils_ap(
								codeStr,
								$elm$core$String$concat(
									A2(
										$elm$core$List$map,
										function (bl) {
											return A2($pablohirafuji$elm_markdown$Markdown$Helpers$indentLine, 4, bl) + '\n';
										},
										blankLines)))))));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseIndentedCodeLine = F2(
	function (ast, codeLine) {
		_v0$2:
		while (true) {
			if (ast.b) {
				switch (ast.a.$) {
					case 3:
						if (!ast.a.a.$) {
							var _v1 = ast.a;
							var _v2 = _v1.a;
							var codeStr = _v1.b;
							var astTail = ast.b;
							return function (a) {
								return A2($elm$core$List$cons, a, astTail);
							}(
								A2($pablohirafuji$elm_markdown$Markdown$Block$CodeBlock, $pablohirafuji$elm_markdown$Markdown$Block$Indented, codeStr + (codeLine + '\n')));
						} else {
							break _v0$2;
						}
					case 0:
						var blankStr = ast.a.a;
						var astTail = ast.b;
						return A2(
							$elm$core$Maybe$withDefault,
							function (a) {
								return A2($elm$core$List$cons, a, ast);
							}(
								A2($pablohirafuji$elm_markdown$Markdown$Block$CodeBlock, $pablohirafuji$elm_markdown$Markdown$Block$Indented, codeLine + '\n')),
							A2(
								$pablohirafuji$elm_markdown$Markdown$Block$resumeIndentedCodeBlock,
								codeLine,
								A2(
									$pablohirafuji$elm_markdown$Markdown$Block$blocksAfterBlankLines,
									astTail,
									_List_fromArray(
										[blankStr]))));
					default:
						break _v0$2;
				}
			} else {
				break _v0$2;
			}
		}
		return A2(
			$elm$core$Maybe$withDefault,
			function (a) {
				return A2($elm$core$List$cons, a, ast);
			}(
				A2($pablohirafuji$elm_markdown$Markdown$Block$CodeBlock, $pablohirafuji$elm_markdown$Markdown$Block$Indented, codeLine + '\n')),
			A2($pablohirafuji$elm_markdown$Markdown$Block$maybeContinueParagraph, codeLine, ast));
	});
var $pablohirafuji$elm_markdown$Markdown$Block$checkIndentedCode = function (_v0) {
	var rawLine = _v0.a;
	var ast = _v0.b;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple2(rawLine, ast),
		A2(
			$elm$core$Maybe$map,
			$pablohirafuji$elm_markdown$Markdown$Block$parseIndentedCodeLine(ast),
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Maybe$Nothing,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Maybe$Nothing,
					A2(
						$elm$core$Maybe$map,
						A2(
							$elm$core$Basics$composeR,
							function ($) {
								return $.c5;
							},
							$elm$core$List$head),
						$elm$core$List$head(
							A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$indentedCodeLineRegex, rawLine)))))));
};
var $pablohirafuji$elm_markdown$Markdown$Entity$decimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#([0-9]{1,8});'));
var $elm$core$Basics$modBy = _Basics_modBy;
var $pablohirafuji$elm_markdown$Markdown$Entity$isBadEndUnicode = function (_int) {
	var remain_ = A2($elm$core$Basics$modBy, 16, _int);
	var remain = A2($elm$core$Basics$modBy, 131070, _int);
	return (_int >= 131070) && ((((0 <= remain) && (remain <= 15)) || ((65536 <= remain) && (remain <= 65551))) && ((remain_ === 14) || (remain_ === 15)));
};
var $pablohirafuji$elm_markdown$Markdown$Entity$isValidUnicode = function (_int) {
	return (_int === 9) || ((_int === 10) || ((_int === 13) || ((_int === 133) || (((32 <= _int) && (_int <= 126)) || (((160 <= _int) && (_int <= 55295)) || (((57344 <= _int) && (_int <= 64975)) || (((65008 <= _int) && (_int <= 65533)) || ((65536 <= _int) && (_int <= 1114109)))))))));
};
var $pablohirafuji$elm_markdown$Markdown$Entity$validUnicode = function (_int) {
	return ($pablohirafuji$elm_markdown$Markdown$Entity$isValidUnicode(_int) && (!$pablohirafuji$elm_markdown$Markdown$Entity$isBadEndUnicode(_int))) ? $elm$core$String$fromChar(
		$elm$core$Char$fromCode(_int)) : $elm$core$String$fromChar(
		$elm$core$Char$fromCode(65533));
};
var $pablohirafuji$elm_markdown$Markdown$Entity$replaceDecimal = function (match) {
	return A2(
		$elm$core$Maybe$withDefault,
		match.cO,
		A2(
			$elm$core$Maybe$map,
			$pablohirafuji$elm_markdown$Markdown$Entity$validUnicode,
			A2(
				$elm$core$Maybe$andThen,
				$elm$core$String$toInt,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Maybe$Nothing,
					$elm$core$List$head(match.c5)))));
};
var $pablohirafuji$elm_markdown$Markdown$Entity$replaceDecimals = A2($elm$regex$Regex$replace, $pablohirafuji$elm_markdown$Markdown$Entity$decimalRegex, $pablohirafuji$elm_markdown$Markdown$Entity$replaceDecimal);
var $pablohirafuji$elm_markdown$Markdown$Entity$entitiesRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&([0-9a-zA-Z]+);'));
var $pablohirafuji$elm_markdown$Markdown$Entity$entities = $elm$core$Dict$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2('quot', 34),
			_Utils_Tuple2('amp', 38),
			_Utils_Tuple2('apos', 39),
			_Utils_Tuple2('lt', 60),
			_Utils_Tuple2('gt', 62),
			_Utils_Tuple2('nbsp', 160),
			_Utils_Tuple2('iexcl', 161),
			_Utils_Tuple2('cent', 162),
			_Utils_Tuple2('pound', 163),
			_Utils_Tuple2('curren', 164),
			_Utils_Tuple2('yen', 165),
			_Utils_Tuple2('brvbar', 166),
			_Utils_Tuple2('sect', 167),
			_Utils_Tuple2('uml', 168),
			_Utils_Tuple2('copy', 169),
			_Utils_Tuple2('ordf', 170),
			_Utils_Tuple2('laquo', 171),
			_Utils_Tuple2('not', 172),
			_Utils_Tuple2('shy', 173),
			_Utils_Tuple2('reg', 174),
			_Utils_Tuple2('macr', 175),
			_Utils_Tuple2('deg', 176),
			_Utils_Tuple2('plusmn', 177),
			_Utils_Tuple2('sup2', 178),
			_Utils_Tuple2('sup3', 179),
			_Utils_Tuple2('acute', 180),
			_Utils_Tuple2('micro', 181),
			_Utils_Tuple2('para', 182),
			_Utils_Tuple2('middot', 183),
			_Utils_Tuple2('cedil', 184),
			_Utils_Tuple2('sup1', 185),
			_Utils_Tuple2('ordm', 186),
			_Utils_Tuple2('raquo', 187),
			_Utils_Tuple2('frac14', 188),
			_Utils_Tuple2('frac12', 189),
			_Utils_Tuple2('frac34', 190),
			_Utils_Tuple2('iquest', 191),
			_Utils_Tuple2('Agrave', 192),
			_Utils_Tuple2('Aacute', 193),
			_Utils_Tuple2('Acirc', 194),
			_Utils_Tuple2('Atilde', 195),
			_Utils_Tuple2('Auml', 196),
			_Utils_Tuple2('Aring', 197),
			_Utils_Tuple2('AElig', 198),
			_Utils_Tuple2('Ccedil', 199),
			_Utils_Tuple2('Egrave', 200),
			_Utils_Tuple2('Eacute', 201),
			_Utils_Tuple2('Ecirc', 202),
			_Utils_Tuple2('Euml', 203),
			_Utils_Tuple2('Igrave', 204),
			_Utils_Tuple2('Iacute', 205),
			_Utils_Tuple2('Icirc', 206),
			_Utils_Tuple2('Iuml', 207),
			_Utils_Tuple2('ETH', 208),
			_Utils_Tuple2('Ntilde', 209),
			_Utils_Tuple2('Ograve', 210),
			_Utils_Tuple2('Oacute', 211),
			_Utils_Tuple2('Ocirc', 212),
			_Utils_Tuple2('Otilde', 213),
			_Utils_Tuple2('Ouml', 214),
			_Utils_Tuple2('times', 215),
			_Utils_Tuple2('Oslash', 216),
			_Utils_Tuple2('Ugrave', 217),
			_Utils_Tuple2('Uacute', 218),
			_Utils_Tuple2('Ucirc', 219),
			_Utils_Tuple2('Uuml', 220),
			_Utils_Tuple2('Yacute', 221),
			_Utils_Tuple2('THORN', 222),
			_Utils_Tuple2('szlig', 223),
			_Utils_Tuple2('agrave', 224),
			_Utils_Tuple2('aacute', 225),
			_Utils_Tuple2('acirc', 226),
			_Utils_Tuple2('atilde', 227),
			_Utils_Tuple2('auml', 228),
			_Utils_Tuple2('aring', 229),
			_Utils_Tuple2('aelig', 230),
			_Utils_Tuple2('ccedil', 231),
			_Utils_Tuple2('egrave', 232),
			_Utils_Tuple2('eacute', 233),
			_Utils_Tuple2('ecirc', 234),
			_Utils_Tuple2('euml', 235),
			_Utils_Tuple2('igrave', 236),
			_Utils_Tuple2('iacute', 237),
			_Utils_Tuple2('icirc', 238),
			_Utils_Tuple2('iuml', 239),
			_Utils_Tuple2('eth', 240),
			_Utils_Tuple2('ntilde', 241),
			_Utils_Tuple2('ograve', 242),
			_Utils_Tuple2('oacute', 243),
			_Utils_Tuple2('ocirc', 244),
			_Utils_Tuple2('otilde', 245),
			_Utils_Tuple2('ouml', 246),
			_Utils_Tuple2('divide', 247),
			_Utils_Tuple2('oslash', 248),
			_Utils_Tuple2('ugrave', 249),
			_Utils_Tuple2('uacute', 250),
			_Utils_Tuple2('ucirc', 251),
			_Utils_Tuple2('uuml', 252),
			_Utils_Tuple2('yacute', 253),
			_Utils_Tuple2('thorn', 254),
			_Utils_Tuple2('yuml', 255),
			_Utils_Tuple2('OElig', 338),
			_Utils_Tuple2('oelig', 339),
			_Utils_Tuple2('Scaron', 352),
			_Utils_Tuple2('scaron', 353),
			_Utils_Tuple2('Yuml', 376),
			_Utils_Tuple2('fnof', 402),
			_Utils_Tuple2('circ', 710),
			_Utils_Tuple2('tilde', 732),
			_Utils_Tuple2('Alpha', 913),
			_Utils_Tuple2('Beta', 914),
			_Utils_Tuple2('Gamma', 915),
			_Utils_Tuple2('Delta', 916),
			_Utils_Tuple2('Epsilon', 917),
			_Utils_Tuple2('Zeta', 918),
			_Utils_Tuple2('Eta', 919),
			_Utils_Tuple2('Theta', 920),
			_Utils_Tuple2('Iota', 921),
			_Utils_Tuple2('Kappa', 922),
			_Utils_Tuple2('Lambda', 923),
			_Utils_Tuple2('Mu', 924),
			_Utils_Tuple2('Nu', 925),
			_Utils_Tuple2('Xi', 926),
			_Utils_Tuple2('Omicron', 927),
			_Utils_Tuple2('Pi', 928),
			_Utils_Tuple2('Rho', 929),
			_Utils_Tuple2('Sigma', 931),
			_Utils_Tuple2('Tau', 932),
			_Utils_Tuple2('Upsilon', 933),
			_Utils_Tuple2('Phi', 934),
			_Utils_Tuple2('Chi', 935),
			_Utils_Tuple2('Psi', 936),
			_Utils_Tuple2('Omega', 937),
			_Utils_Tuple2('alpha', 945),
			_Utils_Tuple2('beta', 946),
			_Utils_Tuple2('gamma', 947),
			_Utils_Tuple2('delta', 948),
			_Utils_Tuple2('epsilon', 949),
			_Utils_Tuple2('zeta', 950),
			_Utils_Tuple2('eta', 951),
			_Utils_Tuple2('theta', 952),
			_Utils_Tuple2('iota', 953),
			_Utils_Tuple2('kappa', 954),
			_Utils_Tuple2('lambda', 955),
			_Utils_Tuple2('mu', 956),
			_Utils_Tuple2('nu', 957),
			_Utils_Tuple2('xi', 958),
			_Utils_Tuple2('omicron', 959),
			_Utils_Tuple2('pi', 960),
			_Utils_Tuple2('rho', 961),
			_Utils_Tuple2('sigmaf', 962),
			_Utils_Tuple2('sigma', 963),
			_Utils_Tuple2('tau', 964),
			_Utils_Tuple2('upsilon', 965),
			_Utils_Tuple2('phi', 966),
			_Utils_Tuple2('chi', 967),
			_Utils_Tuple2('psi', 968),
			_Utils_Tuple2('omega', 969),
			_Utils_Tuple2('thetasym', 977),
			_Utils_Tuple2('upsih', 978),
			_Utils_Tuple2('piv', 982),
			_Utils_Tuple2('ensp', 8194),
			_Utils_Tuple2('emsp', 8195),
			_Utils_Tuple2('thinsp', 8201),
			_Utils_Tuple2('zwnj', 8204),
			_Utils_Tuple2('zwj', 8205),
			_Utils_Tuple2('lrm', 8206),
			_Utils_Tuple2('rlm', 8207),
			_Utils_Tuple2('ndash', 8211),
			_Utils_Tuple2('mdash', 8212),
			_Utils_Tuple2('lsquo', 8216),
			_Utils_Tuple2('rsquo', 8217),
			_Utils_Tuple2('sbquo', 8218),
			_Utils_Tuple2('ldquo', 8220),
			_Utils_Tuple2('rdquo', 8221),
			_Utils_Tuple2('bdquo', 8222),
			_Utils_Tuple2('dagger', 8224),
			_Utils_Tuple2('Dagger', 8225),
			_Utils_Tuple2('bull', 8226),
			_Utils_Tuple2('hellip', 8230),
			_Utils_Tuple2('permil', 8240),
			_Utils_Tuple2('prime', 8242),
			_Utils_Tuple2('Prime', 8243),
			_Utils_Tuple2('lsaquo', 8249),
			_Utils_Tuple2('rsaquo', 8250),
			_Utils_Tuple2('oline', 8254),
			_Utils_Tuple2('frasl', 8260),
			_Utils_Tuple2('euro', 8364),
			_Utils_Tuple2('image', 8465),
			_Utils_Tuple2('weierp', 8472),
			_Utils_Tuple2('real', 8476),
			_Utils_Tuple2('trade', 8482),
			_Utils_Tuple2('alefsym', 8501),
			_Utils_Tuple2('larr', 8592),
			_Utils_Tuple2('uarr', 8593),
			_Utils_Tuple2('rarr', 8594),
			_Utils_Tuple2('darr', 8595),
			_Utils_Tuple2('harr', 8596),
			_Utils_Tuple2('crarr', 8629),
			_Utils_Tuple2('lArr', 8656),
			_Utils_Tuple2('uArr', 8657),
			_Utils_Tuple2('rArr', 8658),
			_Utils_Tuple2('dArr', 8659),
			_Utils_Tuple2('hArr', 8660),
			_Utils_Tuple2('forall', 8704),
			_Utils_Tuple2('part', 8706),
			_Utils_Tuple2('exist', 8707),
			_Utils_Tuple2('empty', 8709),
			_Utils_Tuple2('nabla', 8711),
			_Utils_Tuple2('isin', 8712),
			_Utils_Tuple2('notin', 8713),
			_Utils_Tuple2('ni', 8715),
			_Utils_Tuple2('prod', 8719),
			_Utils_Tuple2('sum', 8721),
			_Utils_Tuple2('minus', 8722),
			_Utils_Tuple2('lowast', 8727),
			_Utils_Tuple2('radic', 8730),
			_Utils_Tuple2('prop', 8733),
			_Utils_Tuple2('infin', 8734),
			_Utils_Tuple2('ang', 8736),
			_Utils_Tuple2('and', 8743),
			_Utils_Tuple2('or', 8744),
			_Utils_Tuple2('cap', 8745),
			_Utils_Tuple2('cup', 8746),
			_Utils_Tuple2('int', 8747),
			_Utils_Tuple2('there4', 8756),
			_Utils_Tuple2('sim', 8764),
			_Utils_Tuple2('cong', 8773),
			_Utils_Tuple2('asymp', 8776),
			_Utils_Tuple2('ne', 8800),
			_Utils_Tuple2('equiv', 8801),
			_Utils_Tuple2('le', 8804),
			_Utils_Tuple2('ge', 8805),
			_Utils_Tuple2('sub', 8834),
			_Utils_Tuple2('sup', 8835),
			_Utils_Tuple2('nsub', 8836),
			_Utils_Tuple2('sube', 8838),
			_Utils_Tuple2('supe', 8839),
			_Utils_Tuple2('oplus', 8853),
			_Utils_Tuple2('otimes', 8855),
			_Utils_Tuple2('perp', 8869),
			_Utils_Tuple2('sdot', 8901),
			_Utils_Tuple2('lceil', 8968),
			_Utils_Tuple2('rceil', 8969),
			_Utils_Tuple2('lfloor', 8970),
			_Utils_Tuple2('rfloor', 8971),
			_Utils_Tuple2('lang', 9001),
			_Utils_Tuple2('rang', 9002),
			_Utils_Tuple2('loz', 9674),
			_Utils_Tuple2('spades', 9824),
			_Utils_Tuple2('clubs', 9827),
			_Utils_Tuple2('hearts', 9829),
			_Utils_Tuple2('diams', 9830)
		]));
var $pablohirafuji$elm_markdown$Markdown$Entity$replaceEntity = function (match) {
	return A2(
		$elm$core$Maybe$withDefault,
		match.cO,
		A2(
			$elm$core$Maybe$map,
			A2($elm$core$Basics$composeR, $elm$core$Char$fromCode, $elm$core$String$fromChar),
			A2(
				$elm$core$Maybe$andThen,
				function (a) {
					return A2($elm$core$Dict$get, a, $pablohirafuji$elm_markdown$Markdown$Entity$entities);
				},
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Maybe$Nothing,
					$elm$core$List$head(match.c5)))));
};
var $pablohirafuji$elm_markdown$Markdown$Entity$replaceEntities = A2($elm$regex$Regex$replace, $pablohirafuji$elm_markdown$Markdown$Entity$entitiesRegex, $pablohirafuji$elm_markdown$Markdown$Entity$replaceEntity);
var $pablohirafuji$elm_markdown$Markdown$Helpers$escapableRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\+)([!\"#$%&\\\'()*+,./:;<=>?@[\\\\\\]^_`{|}~-])'));
var $pablohirafuji$elm_markdown$Markdown$Helpers$replaceEscapable = A2(
	$elm$regex$Regex$replace,
	$pablohirafuji$elm_markdown$Markdown$Helpers$escapableRegex,
	function (regexMatch) {
		var _v0 = regexMatch.c5;
		if (((_v0.b && (!_v0.a.$)) && _v0.b.b) && (!_v0.b.a.$)) {
			var backslashes = _v0.a.a;
			var _v1 = _v0.b;
			var escapedStr = _v1.a.a;
			return _Utils_ap(
				A2(
					$elm$core$String$repeat,
					($elm$core$String$length(backslashes) / 2) | 0,
					'\\'),
				escapedStr);
		} else {
			return regexMatch.cO;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Entity$hexadecimalRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('&#[Xx]([0-9a-fA-F]{1,8});'));
var $pablohirafuji$elm_markdown$Markdown$Entity$hexToInt = A2(
	$elm$core$Basics$composeR,
	$elm$core$String$toLower,
	A2(
		$elm$core$Basics$composeR,
		$elm$core$String$toList,
		A2(
			$elm$core$List$foldl,
			F2(
				function (hexDigit, _int) {
					return ((_int * 16) + A2(
						$elm$core$Basics$modBy,
						39,
						$elm$core$Char$toCode(hexDigit))) - 9;
				}),
			0)));
var $pablohirafuji$elm_markdown$Markdown$Entity$replaceHexadecimal = function (match) {
	return A2(
		$elm$core$Maybe$withDefault,
		match.cO,
		A2(
			$elm$core$Maybe$map,
			A2($elm$core$Basics$composeR, $pablohirafuji$elm_markdown$Markdown$Entity$hexToInt, $pablohirafuji$elm_markdown$Markdown$Entity$validUnicode),
			A2(
				$elm$core$Maybe$withDefault,
				$elm$core$Maybe$Nothing,
				$elm$core$List$head(match.c5))));
};
var $pablohirafuji$elm_markdown$Markdown$Entity$replaceHexadecimals = A2($elm$regex$Regex$replace, $pablohirafuji$elm_markdown$Markdown$Entity$hexadecimalRegex, $pablohirafuji$elm_markdown$Markdown$Entity$replaceHexadecimal);
var $pablohirafuji$elm_markdown$Markdown$Helpers$formatStr = function (str) {
	return $pablohirafuji$elm_markdown$Markdown$Entity$replaceHexadecimals(
		$pablohirafuji$elm_markdown$Markdown$Entity$replaceDecimals(
			$pablohirafuji$elm_markdown$Markdown$Entity$replaceEntities(
				$pablohirafuji$elm_markdown$Markdown$Helpers$replaceEscapable(str))));
};
var $elm$core$String$words = _String_words;
var $pablohirafuji$elm_markdown$Markdown$Block$extractOpenCodeFenceRM = function (match) {
	var _v0 = match.c5;
	if (((_v0.b && _v0.b.b) && (!_v0.b.a.$)) && _v0.b.b.b) {
		var maybeIndent = _v0.a;
		var _v1 = _v0.b;
		var fence = _v1.a.a;
		var _v2 = _v1.b;
		var maybeLanguage = _v2.a;
		return $elm$core$Maybe$Just(
			A2(
				$pablohirafuji$elm_markdown$Markdown$Block$Fenced,
				true,
				{
					cA: A2($elm$core$String$left, 1, fence),
					bw: $elm$core$String$length(fence),
					aI: A2(
						$elm$core$Maybe$withDefault,
						0,
						A2($elm$core$Maybe$map, $elm$core$String$length, maybeIndent)),
					cN: A2(
						$elm$core$Maybe$map,
						$pablohirafuji$elm_markdown$Markdown$Helpers$formatStr,
						A2(
							$elm$core$Maybe$andThen,
							function (lang) {
								return (lang === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(lang);
							},
							$elm$core$List$head(
								A2(
									$elm$core$Maybe$withDefault,
									_List_Nil,
									A2($elm$core$Maybe$map, $elm$core$String$words, maybeLanguage)))))
				}));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$Block$openCodeFenceLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^( {0,3})(`{3,}(?!.*`)|~{3,}(?!.*~))(.*)$'));
var $pablohirafuji$elm_markdown$Markdown$Block$checkOpenCodeFenceLine = function (_v0) {
	var rawLine = _v0.a;
	var ast = _v0.b;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple2(rawLine, ast),
		A2(
			$elm$core$Maybe$map,
			function (a) {
				return A2($elm$core$List$cons, a, ast);
			},
			A2(
				$elm$core$Maybe$map,
				function (f) {
					return A2($pablohirafuji$elm_markdown$Markdown$Block$CodeBlock, f, '');
				},
				A2(
					$elm$core$Maybe$andThen,
					$pablohirafuji$elm_markdown$Markdown$Block$extractOpenCodeFenceRM,
					$elm$core$List$head(
						A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$openCodeFenceLineRegex, rawLine))))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$extractOrderedListRM = function (match) {
	var _v0 = match.c5;
	if (((((((_v0.b && (!_v0.a.$)) && _v0.b.b) && (!_v0.b.a.$)) && _v0.b.b.b) && (!_v0.b.b.a.$)) && _v0.b.b.b.b) && _v0.b.b.b.b.b) {
		var indentString = _v0.a.a;
		var _v1 = _v0.b;
		var start = _v1.a.a;
		var _v2 = _v1.b;
		var delimiter = _v2.a.a;
		var _v3 = _v2.b;
		var maybeIndentSpace = _v3.a;
		var _v4 = _v3.b;
		var maybeRawLine = _v4.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple3(
				{
					aB: delimiter,
					aI: $elm$core$String$length(indentString) + 1,
					cL: false,
					bf: A2(
						$elm$core$Maybe$withDefault,
						$pablohirafuji$elm_markdown$Markdown$Block$Unordered,
						A2(
							$elm$core$Maybe$map,
							$pablohirafuji$elm_markdown$Markdown$Block$Ordered,
							$elm$core$String$toInt(start)))
				},
				A2($elm$core$Maybe$withDefault, '', maybeIndentSpace),
				A2($elm$core$Maybe$withDefault, '', maybeRawLine)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$Block$orderedListLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^( *(\\d{1,9})([.)])( {0,4}))(?:[ \\t](.*))?$'));
var $pablohirafuji$elm_markdown$Markdown$Block$checkOrderedListLine = function (rawLine) {
	return A2(
		$elm$core$Result$fromMaybe,
		rawLine,
		A2(
			$elm$core$Maybe$andThen,
			$pablohirafuji$elm_markdown$Markdown$Block$extractOrderedListRM,
			$elm$core$List$head(
				A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$orderedListLineRegex, rawLine))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$extractSetextHeadingRM = function (match) {
	var _v0 = match.c5;
	if (_v0.b && (!_v0.a.$)) {
		var delimiter = _v0.a.a;
		return A2($elm$core$String$startsWith, '=', delimiter) ? $elm$core$Maybe$Just(
			_Utils_Tuple2(1, delimiter)) : $elm$core$Maybe$Just(
			_Utils_Tuple2(2, delimiter));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$Block$parseSetextHeadingLine = F3(
	function (rawLine, ast, _v0) {
		var lvl = _v0.a;
		var delimiter = _v0.b;
		if (ast.b && (ast.a.$ === 4)) {
			var _v2 = ast.a;
			var rawText = _v2.a;
			var astTail = ast.b;
			return $elm$core$Maybe$Just(
				A2(
					$elm$core$List$cons,
					A3($pablohirafuji$elm_markdown$Markdown$Block$Heading, rawText, lvl, _List_Nil),
					astTail));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$setextHeadingLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^ {0,3}(=+|-+)[ \\t]*$'));
var $pablohirafuji$elm_markdown$Markdown$Block$checkSetextHeadingLine = function (_v0) {
	var rawLine = _v0.a;
	var ast = _v0.b;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple2(rawLine, ast),
		A2(
			$elm$core$Maybe$andThen,
			A2($pablohirafuji$elm_markdown$Markdown$Block$parseSetextHeadingLine, rawLine, ast),
			A2(
				$elm$core$Maybe$andThen,
				$pablohirafuji$elm_markdown$Markdown$Block$extractSetextHeadingRM,
				$elm$core$List$head(
					A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$setextHeadingLineRegex, rawLine)))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$thematicBreakLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^ {0,3}(?:' + ('(?:\\*[ \\t]*){3,}' + ('|(?:_[ \\t]*){3,}' + '|(?:-[ \\t]*){3,})[ \\t]*$'))));
var $pablohirafuji$elm_markdown$Markdown$Block$checkThematicBreakLine = function (_v0) {
	var rawLine = _v0.a;
	var ast = _v0.b;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple2(rawLine, ast),
		A2(
			$elm$core$Maybe$map,
			function (_v1) {
				return A2($elm$core$List$cons, $pablohirafuji$elm_markdown$Markdown$Block$ThematicBreak, ast);
			},
			$elm$core$List$head(
				A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$thematicBreakLineRegex, rawLine))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$extractUnorderedListRM = function (match) {
	var _v0 = match.c5;
	if ((((((_v0.b && (!_v0.a.$)) && _v0.b.b) && (!_v0.b.a.$)) && _v0.b.b.b) && _v0.b.b.b.b) && (!_v0.b.b.b.b.b)) {
		var indentString = _v0.a.a;
		var _v1 = _v0.b;
		var delimiter = _v1.a.a;
		var _v2 = _v1.b;
		var maybeIndentSpace = _v2.a;
		var _v3 = _v2.b;
		var maybeRawLine = _v3.a;
		return $elm$core$Maybe$Just(
			_Utils_Tuple3(
				{
					aB: delimiter,
					aI: $elm$core$String$length(indentString) + 1,
					cL: false,
					bf: $pablohirafuji$elm_markdown$Markdown$Block$Unordered
				},
				A2($elm$core$Maybe$withDefault, '', maybeIndentSpace),
				A2($elm$core$Maybe$withDefault, '', maybeRawLine)));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$Block$unorderedListLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^( *([\\*\\-\\+])( {0,4}))(?:[ \\t](.*))?$'));
var $pablohirafuji$elm_markdown$Markdown$Block$checkUnorderedListLine = function (rawLine) {
	return A2(
		$elm$core$Result$fromMaybe,
		rawLine,
		A2(
			$elm$core$Maybe$andThen,
			$pablohirafuji$elm_markdown$Markdown$Block$extractUnorderedListRM,
			$elm$core$List$head(
				A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$unorderedListLineRegex, rawLine))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$closeCodeFenceLineRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^ {0,3}(`{3,}|~{3,})\\s*$'));
var $pablohirafuji$elm_markdown$Markdown$Block$isCloseFenceLineHelp = F2(
	function (fence, match) {
		var _v0 = match.c5;
		if (_v0.b && (!_v0.a.$)) {
			var fenceStr = _v0.a.a;
			return (_Utils_cmp(
				$elm$core$String$length(fenceStr),
				fence.bw) > -1) && _Utils_eq(
				A2($elm$core$String$left, 1, fenceStr),
				fence.cA);
		} else {
			return false;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$isCloseFenceLine = function (fence) {
	return A2(
		$elm$core$Basics$composeR,
		A2($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$closeCodeFenceLineRegex),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map(
					$pablohirafuji$elm_markdown$Markdown$Block$isCloseFenceLineHelp(fence)),
				$elm$core$Maybe$withDefault(false))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$continueOrCloseCodeFence = F3(
	function (fence, previousCode, rawLine) {
		return A2($pablohirafuji$elm_markdown$Markdown$Block$isCloseFenceLine, fence, rawLine) ? A2(
			$pablohirafuji$elm_markdown$Markdown$Block$CodeBlock,
			A2($pablohirafuji$elm_markdown$Markdown$Block$Fenced, false, fence),
			previousCode) : A2(
			$pablohirafuji$elm_markdown$Markdown$Block$CodeBlock,
			A2($pablohirafuji$elm_markdown$Markdown$Block$Fenced, true, fence),
			previousCode + (A2($pablohirafuji$elm_markdown$Markdown$Helpers$indentLine, fence.aI, rawLine) + '\n'));
	});
var $pablohirafuji$elm_markdown$Markdown$Helpers$ifError = F2(
	function (_function, result) {
		if (!result.$) {
			return result;
		} else {
			var err = result.a;
			return _function(err);
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Helpers$initSpacesRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^ +'));
var $pablohirafuji$elm_markdown$Markdown$Helpers$indentLength = A2(
	$elm$core$Basics$composeR,
	A2(
		$elm$regex$Regex$replace,
		$pablohirafuji$elm_markdown$Markdown$Helpers$tabRegex,
		function (_v0) {
			return '    ';
		}),
	A2(
		$elm$core$Basics$composeR,
		A2($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Helpers$initSpacesRegex),
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map(
					A2(
						$elm$core$Basics$composeR,
						function ($) {
							return $.cO;
						},
						$elm$core$String$length)),
				$elm$core$Maybe$withDefault(0)))));
var $pablohirafuji$elm_markdown$Markdown$Block$isBlankLineLast = function (items) {
	isBlankLineLast:
	while (true) {
		if (!items.b) {
			return false;
		} else {
			var item = items.a;
			var itemsTail = items.b;
			_v1$3:
			while (true) {
				if (item.b) {
					switch (item.a.$) {
						case 0:
							if (!item.b.b) {
								return false;
							} else {
								return true;
							}
						case 6:
							var _v2 = item.a;
							var items_ = _v2.b;
							var $temp$items = items_;
							items = $temp$items;
							continue isBlankLineLast;
						default:
							break _v1$3;
					}
				} else {
					break _v1$3;
				}
			}
			return false;
		}
	}
};
var $pablohirafuji$elm_markdown$Markdown$Block$parseTextLine = F2(
	function (rawLine, ast) {
		return A2(
			$elm$core$Maybe$withDefault,
			A2(
				$elm$core$List$cons,
				A2(
					$pablohirafuji$elm_markdown$Markdown$Block$Paragraph,
					$pablohirafuji$elm_markdown$Markdown$Block$formatParagraphLine(rawLine),
					_List_Nil),
				ast),
			A2($pablohirafuji$elm_markdown$Markdown$Block$maybeContinueParagraph, rawLine, ast));
	});
var $pablohirafuji$elm_markdown$Markdown$Block$checkBlockQuote = function (_v16) {
	var rawLine = _v16.a;
	var ast = _v16.b;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple2(rawLine, ast),
		A2(
			$elm$core$Maybe$map,
			$pablohirafuji$elm_markdown$Markdown$Block$parseBlockQuoteLine(ast),
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.c5;
					},
					A2(
						$elm$core$Basics$composeR,
						$elm$core$List$head,
						A2(
							$elm$core$Basics$composeR,
							$elm$core$Maybe$withDefault($elm$core$Maybe$Nothing),
							$elm$core$Maybe$withDefault('')))),
				$elm$core$List$head(
					A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$blockQuoteLineRegex, rawLine)))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$checkListLine = function (_v15) {
	var rawLine = _v15.a;
	var ast = _v15.b;
	return A2(
		$elm$core$Result$mapError,
		function (e) {
			return _Utils_Tuple2(e, ast);
		},
		A2(
			$elm$core$Result$map,
			A2($pablohirafuji$elm_markdown$Markdown$Block$parseListLine, rawLine, ast),
			A2(
				$elm$core$Result$map,
				$pablohirafuji$elm_markdown$Markdown$Block$calcListIndentLength,
				A2(
					$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
					$pablohirafuji$elm_markdown$Markdown$Block$checkUnorderedListLine,
					$pablohirafuji$elm_markdown$Markdown$Block$checkOrderedListLine(rawLine)))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$incorporateLine = F2(
	function (rawLine, ast) {
		_v11$2:
		while (true) {
			if (ast.b) {
				switch (ast.a.$) {
					case 3:
						if ((ast.a.a.$ === 1) && ast.a.a.a) {
							var _v12 = ast.a;
							var _v13 = _v12.a;
							var fence = _v13.b;
							var code = _v12.b;
							var astTail = ast.b;
							return function (a) {
								return A2($elm$core$List$cons, a, astTail);
							}(
								A3($pablohirafuji$elm_markdown$Markdown$Block$continueOrCloseCodeFence, fence, code, rawLine));
						} else {
							break _v11$2;
						}
					case 6:
						var _v14 = ast.a;
						var model = _v14.a;
						var items = _v14.b;
						var astTail = ast.b;
						return (_Utils_cmp(
							$pablohirafuji$elm_markdown$Markdown$Helpers$indentLength(rawLine),
							model.aI) > -1) ? A5($pablohirafuji$elm_markdown$Markdown$Block$parseIndentedListLine, rawLine, model, items, ast, astTail) : A2(
							$elm$core$Result$withDefault,
							A2($pablohirafuji$elm_markdown$Markdown$Block$parseTextLine, rawLine, ast),
							A2(
								$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
								$pablohirafuji$elm_markdown$Markdown$Block$checkBlockQuote,
								A2(
									$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
									$pablohirafuji$elm_markdown$Markdown$Block$checkATXHeadingLine,
									A2(
										$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
										$pablohirafuji$elm_markdown$Markdown$Block$checkSetextHeadingLine,
										A2(
											$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
											$pablohirafuji$elm_markdown$Markdown$Block$checkOpenCodeFenceLine,
											A2(
												$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
												$pablohirafuji$elm_markdown$Markdown$Block$checkIndentedCode,
												A2(
													$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
													$pablohirafuji$elm_markdown$Markdown$Block$checkBlankLine,
													A2(
														$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
														$pablohirafuji$elm_markdown$Markdown$Block$checkListLine,
														$pablohirafuji$elm_markdown$Markdown$Block$checkThematicBreakLine(
															_Utils_Tuple2(rawLine, ast))))))))));
					default:
						break _v11$2;
				}
			} else {
				break _v11$2;
			}
		}
		return A2($pablohirafuji$elm_markdown$Markdown$Block$parseRawLine, rawLine, ast);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseBlockQuoteLine = F2(
	function (ast, rawLine) {
		if (ast.b && (ast.a.$ === 5)) {
			var bqAST = ast.a.a;
			var astTail = ast.b;
			return function (a) {
				return A2($elm$core$List$cons, a, astTail);
			}(
				$pablohirafuji$elm_markdown$Markdown$Block$BlockQuote(
					A2($pablohirafuji$elm_markdown$Markdown$Block$incorporateLine, rawLine, bqAST)));
		} else {
			return function (a) {
				return A2($elm$core$List$cons, a, ast);
			}(
				$pablohirafuji$elm_markdown$Markdown$Block$BlockQuote(
					A2($pablohirafuji$elm_markdown$Markdown$Block$incorporateLine, rawLine, _List_Nil)));
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseIndentedListLine = F5(
	function (rawLine, model, items, ast, astTail) {
		if (!items.b) {
			return function (a) {
				return A2($elm$core$List$cons, a, astTail);
			}(
				A2(
					$pablohirafuji$elm_markdown$Markdown$Block$List,
					model,
					function (a) {
						return A2($elm$core$List$cons, a, _List_Nil);
					}(
						function (a) {
							return A2($pablohirafuji$elm_markdown$Markdown$Block$incorporateLine, a, _List_Nil);
						}(
							A2($pablohirafuji$elm_markdown$Markdown$Helpers$indentLine, model.aI, rawLine)))));
		} else {
			var item = items.a;
			var itemsTail = items.b;
			var indentedRawLine = A2($pablohirafuji$elm_markdown$Markdown$Helpers$indentLine, model.aI, rawLine);
			var updateList = function (model_) {
				return function (a) {
					return A2($elm$core$List$cons, a, astTail);
				}(
					A2(
						$pablohirafuji$elm_markdown$Markdown$Block$List,
						model_,
						function (a) {
							return A2($elm$core$List$cons, a, itemsTail);
						}(
							A2($pablohirafuji$elm_markdown$Markdown$Block$incorporateLine, indentedRawLine, item))));
			};
			_v7$3:
			while (true) {
				if (item.b) {
					switch (item.a.$) {
						case 0:
							if (!item.b.b) {
								return updateList(model);
							} else {
								var itemTail = item.b;
								return A2(
									$elm$core$List$all,
									function (block) {
										if (!block.$) {
											return true;
										} else {
											return false;
										}
									},
									itemTail) ? A2($pablohirafuji$elm_markdown$Markdown$Block$parseRawLine, rawLine, ast) : updateList(
									_Utils_update(
										model,
										{cL: true}));
							}
						case 6:
							var _v9 = item.a;
							var model_ = _v9.a;
							var items_ = _v9.b;
							var itemTail = item.b;
							return (_Utils_cmp(
								$pablohirafuji$elm_markdown$Markdown$Helpers$indentLength(indentedRawLine),
								model_.aI) > -1) ? updateList(model) : ($pablohirafuji$elm_markdown$Markdown$Block$isBlankLineLast(items_) ? updateList(
								_Utils_update(
									model,
									{cL: true})) : updateList(model));
						default:
							break _v7$3;
					}
				} else {
					break _v7$3;
				}
			}
			return updateList(model);
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseListLine = F3(
	function (rawLine, ast, _v0) {
		var listBlock = _v0.a;
		var listRawLine = _v0.b;
		var parsedRawLine = A2($pablohirafuji$elm_markdown$Markdown$Block$incorporateLine, listRawLine, _List_Nil);
		var newList = A2(
			$elm$core$List$cons,
			A2(
				$pablohirafuji$elm_markdown$Markdown$Block$List,
				listBlock,
				_List_fromArray(
					[parsedRawLine])),
			ast);
		_v1$2:
		while (true) {
			if (ast.b) {
				switch (ast.a.$) {
					case 6:
						var _v2 = ast.a;
						var model = _v2.a;
						var items = _v2.b;
						var astTail = ast.b;
						return _Utils_eq(listBlock.aB, model.aB) ? function (a) {
							return A2($elm$core$List$cons, a, astTail);
						}(
							A2(
								$pablohirafuji$elm_markdown$Markdown$Block$List,
								_Utils_update(
									model,
									{
										aI: listBlock.aI,
										cL: model.cL || $pablohirafuji$elm_markdown$Markdown$Block$isBlankLineLast(items)
									}),
								A2($elm$core$List$cons, parsedRawLine, items))) : newList;
					case 4:
						var _v3 = ast.a;
						var rawText = _v3.a;
						var inlines = _v3.b;
						var astTail = ast.b;
						if ((parsedRawLine.b && (!parsedRawLine.a.$)) && (!parsedRawLine.b.b)) {
							return A2(
								$elm$core$List$cons,
								A2($pablohirafuji$elm_markdown$Markdown$Block$addToParagraph, rawText, rawLine),
								astTail);
						} else {
							var _v5 = listBlock.bf;
							if (_v5.$ === 1) {
								if (_v5.a === 1) {
									return newList;
								} else {
									var _int = _v5.a;
									return A2(
										$elm$core$List$cons,
										A2($pablohirafuji$elm_markdown$Markdown$Block$addToParagraph, rawText, rawLine),
										astTail);
								}
							} else {
								return newList;
							}
						}
					default:
						break _v1$2;
				}
			} else {
				break _v1$2;
			}
		}
		return newList;
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseRawLine = F2(
	function (rawLine, ast) {
		return A2(
			$elm$core$Result$withDefault,
			A2($pablohirafuji$elm_markdown$Markdown$Block$parseTextLine, rawLine, ast),
			A2(
				$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
				$pablohirafuji$elm_markdown$Markdown$Block$checkListLine,
				A2(
					$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
					$pablohirafuji$elm_markdown$Markdown$Block$checkThematicBreakLine,
					A2(
						$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
						$pablohirafuji$elm_markdown$Markdown$Block$checkBlockQuote,
						A2(
							$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
							$pablohirafuji$elm_markdown$Markdown$Block$checkATXHeadingLine,
							A2(
								$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
								$pablohirafuji$elm_markdown$Markdown$Block$checkSetextHeadingLine,
								A2(
									$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
									$pablohirafuji$elm_markdown$Markdown$Block$checkOpenCodeFenceLine,
									A2(
										$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
										$pablohirafuji$elm_markdown$Markdown$Block$checkIndentedCode,
										$pablohirafuji$elm_markdown$Markdown$Block$checkBlankLine(
											_Utils_Tuple2(rawLine, ast))))))))));
	});
var $pablohirafuji$elm_markdown$Markdown$Block$incorporateLines = F2(
	function (rawLines, ast) {
		if (!rawLines.b) {
			return ast;
		} else {
			var rawLine = rawLines.a;
			var rawLinesTail = rawLines.b;
			return A2(
				$pablohirafuji$elm_markdown$Markdown$Block$incorporateLines,
				rawLinesTail,
				A2($pablohirafuji$elm_markdown$Markdown$Block$incorporateLine, rawLine, ast));
		}
	});
var $elm$core$String$lines = _String_lines;
var $pablohirafuji$elm_markdown$Markdown$Block$Custom = F2(
	function (a, b) {
		return {$: 8, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$Block$PlainInlines = function (a) {
	return {$: 7, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$Config$Sanitize = function (a) {
	return {$: 1, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$Config$defaultAllowedHtmlAttributes = _List_fromArray(
	['name', 'class']);
var $pablohirafuji$elm_markdown$Markdown$Config$defaultAllowedHtmlElements = _List_fromArray(
	['address', 'article', 'aside', 'b', 'blockquote', 'br', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'dd', 'details', 'div', 'dl', 'dt', 'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'i', 'legend', 'li', 'menu', 'menuitem', 'nav', 'ol', 'optgroup', 'option', 'p', 'pre', 'section', 'strike', 'summary', 'small', 'table', 'tbody', 'td', 'tfoot', 'th', 'thead', 'tr', 'ul']);
var $pablohirafuji$elm_markdown$Markdown$Config$defaultSanitizeOptions = {bj: $pablohirafuji$elm_markdown$Markdown$Config$defaultAllowedHtmlAttributes, bk: $pablohirafuji$elm_markdown$Markdown$Config$defaultAllowedHtmlElements};
var $pablohirafuji$elm_markdown$Markdown$Config$defaultOptions = {
	cY: $pablohirafuji$elm_markdown$Markdown$Config$Sanitize($pablohirafuji$elm_markdown$Markdown$Config$defaultSanitizeOptions),
	c3: false
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$initParser = F3(
	function (options, refs, rawText) {
		return {c: _List_Nil, ac: options, o: rawText, a6: refs, h: _List_Nil};
	});
var $pablohirafuji$elm_markdown$Markdown$Inline$HtmlInline = F3(
	function (a, b, c) {
		return {$: 5, a: a, b: b, c: c};
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$matchToInline = function (_v0) {
	var match = _v0;
	var _v1 = match.bf;
	switch (_v1.$) {
		case 0:
			return $pablohirafuji$elm_markdown$Markdown$Inline$Text(match.as);
		case 1:
			return $pablohirafuji$elm_markdown$Markdown$Inline$HardLineBreak;
		case 2:
			return $pablohirafuji$elm_markdown$Markdown$Inline$CodeInline(match.as);
		case 3:
			var _v2 = _v1.a;
			var text = _v2.a;
			var url = _v2.b;
			return A3(
				$pablohirafuji$elm_markdown$Markdown$Inline$Link,
				url,
				$elm$core$Maybe$Nothing,
				_List_fromArray(
					[
						$pablohirafuji$elm_markdown$Markdown$Inline$Text(text)
					]));
		case 4:
			var _v3 = _v1.a;
			var url = _v3.a;
			var maybeTitle = _v3.b;
			return A3(
				$pablohirafuji$elm_markdown$Markdown$Inline$Link,
				url,
				maybeTitle,
				$pablohirafuji$elm_markdown$Markdown$InlineParser$matchesToInlines(match.c));
		case 5:
			var _v4 = _v1.a;
			var url = _v4.a;
			var maybeTitle = _v4.b;
			return A3(
				$pablohirafuji$elm_markdown$Markdown$Inline$Image,
				url,
				maybeTitle,
				$pablohirafuji$elm_markdown$Markdown$InlineParser$matchesToInlines(match.c));
		case 6:
			var model = _v1.a;
			return A3(
				$pablohirafuji$elm_markdown$Markdown$Inline$HtmlInline,
				model.aq,
				model.H,
				$pablohirafuji$elm_markdown$Markdown$InlineParser$matchesToInlines(match.c));
		default:
			var length = _v1.a;
			return A2(
				$pablohirafuji$elm_markdown$Markdown$Inline$Emphasis,
				length,
				$pablohirafuji$elm_markdown$Markdown$InlineParser$matchesToInlines(match.c));
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$matchesToInlines = function (matches) {
	return A2($elm$core$List$map, $pablohirafuji$elm_markdown$Markdown$InlineParser$matchToInline, matches);
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$Match = $elm$core$Basics$identity;
var $pablohirafuji$elm_markdown$Markdown$InlineParser$prepareChildMatch = F2(
	function (parentMatch, childMatch) {
		return _Utils_update(
			childMatch,
			{bt: childMatch.bt - parentMatch.A, ba: childMatch.ba - parentMatch.A, ae: childMatch.ae - parentMatch.A, A: childMatch.A - parentMatch.A});
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$addChild = F2(
	function (parentMatch, childMatch) {
		return _Utils_update(
			parentMatch,
			{
				c: A2(
					$elm$core$List$cons,
					A2($pablohirafuji$elm_markdown$Markdown$InlineParser$prepareChildMatch, parentMatch, childMatch),
					parentMatch.c)
			});
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$organizeMatch = F2(
	function (_v0, matches) {
		var match = _v0;
		if (!matches.b) {
			return _List_fromArray(
				[match]);
		} else {
			var prevMatch = matches.a;
			var matchesTail = matches.b;
			return (_Utils_cmp(prevMatch.bt, match.ba) < 1) ? A2($elm$core$List$cons, match, matches) : (((_Utils_cmp(prevMatch.ba, match.ba) < 0) && (_Utils_cmp(prevMatch.bt, match.bt) > 0)) ? A2(
				$elm$core$List$cons,
				A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addChild, prevMatch, match),
				matchesTail) : matches);
		}
	});
function $pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$organizeMatches() {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$sortBy(
			function (_v0) {
				var match = _v0;
				return match.ba;
			}),
		A2(
			$elm$core$Basics$composeR,
			A2($elm$core$List$foldl, $pablohirafuji$elm_markdown$Markdown$InlineParser$organizeMatch, _List_Nil),
			$elm$core$List$map(
				function (_v1) {
					var match = _v1;
					return _Utils_update(
						match,
						{
							c: $pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$organizeMatches()(match.c)
						});
				})));
}
var $pablohirafuji$elm_markdown$Markdown$InlineParser$organizeMatches = $pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$organizeMatches();
$pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$organizeMatches = function () {
	return $pablohirafuji$elm_markdown$Markdown$InlineParser$organizeMatches;
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$organizeParserMatches = function (model) {
	return _Utils_update(
		model,
		{
			c: $pablohirafuji$elm_markdown$Markdown$InlineParser$organizeMatches(model.c)
		});
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$NormalType = {$: 0};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$normalMatch = function (text) {
	return {
		bt: 0,
		c: _List_Nil,
		ba: 0,
		as: $pablohirafuji$elm_markdown$Markdown$Helpers$formatStr(text),
		ae: 0,
		A: 0,
		bf: $pablohirafuji$elm_markdown$Markdown$InlineParser$NormalType
	};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$parseTextMatch = F3(
	function (rawText, _v2, parsedMatches) {
		var matchModel = _v2;
		var updtMatch = _Utils_update(
			matchModel,
			{
				c: A3($pablohirafuji$elm_markdown$Markdown$InlineParser$parseTextMatches, matchModel.as, _List_Nil, matchModel.c)
			});
		if (!parsedMatches.b) {
			var finalStr = A2($elm$core$String$dropLeft, matchModel.bt, rawText);
			return $elm$core$String$isEmpty(finalStr) ? _List_fromArray(
				[updtMatch]) : _List_fromArray(
				[
					updtMatch,
					$pablohirafuji$elm_markdown$Markdown$InlineParser$normalMatch(finalStr)
				]);
		} else {
			var matchHead = parsedMatches.a;
			var matchesTail = parsedMatches.b;
			return _Utils_eq(matchHead.bf, $pablohirafuji$elm_markdown$Markdown$InlineParser$NormalType) ? A2($elm$core$List$cons, updtMatch, parsedMatches) : (_Utils_eq(matchModel.bt, matchHead.ba) ? A2($elm$core$List$cons, updtMatch, parsedMatches) : ((_Utils_cmp(matchModel.bt, matchHead.ba) < 0) ? A2(
				$elm$core$List$cons,
				updtMatch,
				A2(
					$elm$core$List$cons,
					$pablohirafuji$elm_markdown$Markdown$InlineParser$normalMatch(
						A3($elm$core$String$slice, matchModel.bt, matchHead.ba, rawText)),
					parsedMatches)) : parsedMatches));
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$parseTextMatches = F3(
	function (rawText, parsedMatches, matches) {
		parseTextMatches:
		while (true) {
			if (!matches.b) {
				if (!parsedMatches.b) {
					return $elm$core$String$isEmpty(rawText) ? _List_Nil : _List_fromArray(
						[
							$pablohirafuji$elm_markdown$Markdown$InlineParser$normalMatch(rawText)
						]);
				} else {
					var matchModel = parsedMatches.a;
					return (matchModel.ba > 0) ? A2(
						$elm$core$List$cons,
						$pablohirafuji$elm_markdown$Markdown$InlineParser$normalMatch(
							A2($elm$core$String$left, matchModel.ba, rawText)),
						parsedMatches) : parsedMatches;
				}
			} else {
				var match = matches.a;
				var matchesTail = matches.b;
				var $temp$rawText = rawText,
					$temp$parsedMatches = A3($pablohirafuji$elm_markdown$Markdown$InlineParser$parseTextMatch, rawText, match, parsedMatches),
					$temp$matches = matchesTail;
				rawText = $temp$rawText;
				parsedMatches = $temp$parsedMatches;
				matches = $temp$matches;
				continue parseTextMatches;
			}
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$parseText = function (model) {
	return _Utils_update(
		model,
		{
			c: A3($pablohirafuji$elm_markdown$Markdown$InlineParser$parseTextMatches, model.o, _List_Nil, model.c)
		});
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\<)'));
var $elm$regex$Regex$find = _Regex_findAtMost(_Regex_infinity);
var $pablohirafuji$elm_markdown$Markdown$InlineParser$CharToken = function (a) {
	return {$: 3, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$Helpers$isEven = function (_int) {
	return !A2($elm$core$Basics$modBy, 2, _int);
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken = function (regMatch) {
	var _v0 = regMatch.c5;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var delimiter = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{
				bF: regMatch.bF + backslashesLength,
				d: 1,
				f: $pablohirafuji$elm_markdown$Markdown$InlineParser$CharToken('<')
			}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketLToken,
		A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$angleBracketLTokenRegex, str));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\>)'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$RightAngleBracket = function (a) {
	return {$: 4, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken = function (regMatch) {
	var _v0 = regMatch.c5;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				bF: regMatch.bF + backslashesLength,
				d: 1,
				f: $pablohirafuji$elm_markdown$Markdown$InlineParser$RightAngleBracket(
					!$pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength))
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToAngleBracketRToken,
		A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$angleBracketRTokenRegex, str));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^*])?(\\*+)([^*])?'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$EmphasisToken = F2(
	function (a, b) {
		return {$: 6, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$punctuationRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('[!-#%-\\*,-/:;\\?@\\[-\\]_\\{\\}]'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$containPunctuation = $elm$regex$Regex$contains($pablohirafuji$elm_markdown$Markdown$InlineParser$punctuationRegex);
var $pablohirafuji$elm_markdown$Markdown$InlineParser$spaceRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('\\s'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$containSpace = $elm$regex$Regex$contains($pablohirafuji$elm_markdown$Markdown$InlineParser$spaceRegex);
var $pablohirafuji$elm_markdown$Markdown$InlineParser$charFringeRank = function (_char) {
	var string = $elm$core$String$fromChar(_char);
	return $pablohirafuji$elm_markdown$Markdown$InlineParser$containSpace(string) ? 0 : ($pablohirafuji$elm_markdown$Markdown$InlineParser$containPunctuation(string) ? 1 : 2);
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$maybeCharFringeRank = function (maybeChar) {
	return A2(
		$elm$core$Maybe$withDefault,
		0,
		A2($elm$core$Maybe$map, $pablohirafuji$elm_markdown$Markdown$InlineParser$charFringeRank, maybeChar));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$getFringeRank = A2(
	$elm$core$Basics$composeR,
	$elm$core$Maybe$map(
		A2(
			$elm$core$Basics$composeR,
			$elm$core$String$uncons,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map($elm$core$Tuple$first),
				$pablohirafuji$elm_markdown$Markdown$InlineParser$maybeCharFringeRank))),
	$elm$core$Maybe$withDefault(0));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken = F3(
	function (_char, rawText, regMatch) {
		var _v0 = regMatch.c5;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.a.$)) && _v0.b.b.b.b) {
			var maybeBackslashes = _v0.a;
			var _v1 = _v0.b;
			var maybeLeftFringe = _v1.a;
			var _v2 = _v1.b;
			var delimiter = _v2.a.a;
			var _v3 = _v2.b;
			var maybeRightFringe = _v3.a;
			var leftFringeLength = A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Maybe$map, $elm$core$String$length, maybeLeftFringe));
			var mLeftFringe = ((!(!regMatch.bF)) && (!leftFringeLength)) ? $elm$core$Maybe$Just(
				A3($elm$core$String$slice, regMatch.bF - 1, regMatch.bF, rawText)) : maybeLeftFringe;
			var backslashesLength = A2(
				$elm$core$Maybe$withDefault,
				0,
				A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
			var isEscaped = ((!$pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength)) && (!leftFringeLength)) || _Utils_eq(
				mLeftFringe,
				$elm$core$Maybe$Just('\\'));
			var delimiterLength = isEscaped ? ($elm$core$String$length(delimiter) - 1) : $elm$core$String$length(delimiter);
			var fringeRank = _Utils_Tuple2(
				isEscaped ? 1 : $pablohirafuji$elm_markdown$Markdown$InlineParser$getFringeRank(mLeftFringe),
				$pablohirafuji$elm_markdown$Markdown$InlineParser$getFringeRank(maybeRightFringe));
			var index = ((regMatch.bF + backslashesLength) + leftFringeLength) + (isEscaped ? 1 : 0);
			return ((delimiterLength <= 0) || ((_char === '_') && _Utils_eq(
				fringeRank,
				_Utils_Tuple2(2, 2)))) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
				{
					bF: index,
					d: delimiterLength,
					f: A2($pablohirafuji$elm_markdown$Markdown$InlineParser$EmphasisToken, _char, fringeRank)
				});
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2($pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken, '*', str),
		A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$asteriskEmphasisTokenRegex, str));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$codeTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\`+)'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$CodeToken = function (a) {
	return {$: 0, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToCodeToken = function (regMatch) {
	var _v0 = regMatch.c5;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var backtick = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $elm$core$Maybe$Just(
			{
				bF: regMatch.bF + backslashesLength,
				d: $elm$core$String$length(backtick),
				f: $pablohirafuji$elm_markdown$Markdown$InlineParser$CodeToken(
					!$pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength))
			});
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findCodeTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToCodeToken,
		A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$codeTokenRegex, str));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( {2,}))\\n'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakToken = {$: 8};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken = function (regMatch) {
	var _v0 = regMatch.c5;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (!_v0.a.$) {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return (!$pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength)) ? $elm$core$Maybe$Just(
					{bF: (regMatch.bF + backslashesLength) - 1, d: 2, f: $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Nothing;
			} else {
				if (_v0.b.b && (!_v0.b.a.$)) {
					var _v1 = _v0.b;
					return $elm$core$Maybe$Just(
						{
							bF: regMatch.bF,
							d: $elm$core$String$length(regMatch.cO),
							f: $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken = function (regMatch) {
	var _v0 = regMatch.c5;
	_v0$2:
	while (true) {
		if (_v0.b) {
			if (!_v0.a.$) {
				var backslashes = _v0.a.a;
				var backslashesLength = $elm$core$String$length(backslashes);
				return $pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
					{bF: regMatch.bF + backslashesLength, d: 1, f: $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakToken}) : $elm$core$Maybe$Just(
					{bF: (regMatch.bF + backslashesLength) - 1, d: 2, f: $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakToken});
			} else {
				if (_v0.b.b) {
					var _v1 = _v0.b;
					var maybeSpaces = _v1.a;
					return $elm$core$Maybe$Just(
						{
							bF: regMatch.bF,
							d: $elm$core$String$length(regMatch.cO),
							f: $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakToken
						});
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(?:(\\\\+)|( *))\\n'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findHardBreakTokens = F2(
	function (softAsHardLineBreak, str) {
		return softAsHardLineBreak ? A2(
			$elm$core$List$filterMap,
			$pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToSoftHardBreakToken,
			A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$softAsHardLineBreakTokenRegex, str)) : A2(
			$elm$core$List$filterMap,
			$pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToHardBreakToken,
			A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$hardBreakTokenRegex, str));
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\])'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken = function (regMatch) {
	var _v0 = regMatch.c5;
	if ((_v0.b && _v0.b.b) && (!_v0.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var delimiter = _v1.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		return $pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength) ? $elm$core$Maybe$Just(
			{
				bF: regMatch.bF + backslashesLength,
				d: 1,
				f: $pablohirafuji$elm_markdown$Markdown$InlineParser$CharToken(']')
			}) : $elm$core$Maybe$Nothing;
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToLinkImageCloseToken,
		A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$linkImageCloseTokenRegex, str));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)(\\!)?(\\[)'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$ImageOpenToken = {$: 2};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$LinkOpenToken = function (a) {
	return {$: 1, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken = function (regMatch) {
	var _v0 = regMatch.c5;
	if (((_v0.b && _v0.b.b) && _v0.b.b.b) && (!_v0.b.b.a.$)) {
		var maybeBackslashes = _v0.a;
		var _v1 = _v0.b;
		var maybeImageOpen = _v1.a;
		var _v2 = _v1.b;
		var delimiter = _v2.a.a;
		var backslashesLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Maybe$map, $elm$core$String$length, maybeBackslashes));
		var isEscaped = !$pablohirafuji$elm_markdown$Markdown$Helpers$isEven(backslashesLength);
		var index = (regMatch.bF + backslashesLength) + ((isEscaped && _Utils_eq(
			maybeImageOpen,
			$elm$core$Maybe$Just('!'))) ? 1 : 0);
		var meaning = isEscaped ? A2(
			$elm$core$Maybe$map,
			function (_v3) {
				return $pablohirafuji$elm_markdown$Markdown$InlineParser$LinkOpenToken(true);
			},
			maybeImageOpen) : $elm$core$Maybe$Just(
			A2(
				$elm$core$Maybe$withDefault,
				$pablohirafuji$elm_markdown$Markdown$InlineParser$LinkOpenToken(true),
				A2(
					$elm$core$Maybe$map,
					function (_v4) {
						return $pablohirafuji$elm_markdown$Markdown$InlineParser$ImageOpenToken;
					},
					maybeImageOpen)));
		var length = _Utils_eq(
			meaning,
			$elm$core$Maybe$Just($pablohirafuji$elm_markdown$Markdown$InlineParser$ImageOpenToken)) ? 2 : 1;
		var toModel = function (m) {
			return {bF: index, d: length, f: m};
		};
		return A2($elm$core$Maybe$map, toModel, meaning);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		$pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToLinkImageOpenToken,
		A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$linkImageOpenTokenRegex, str));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('(\\\\*)([^_])?(\\_+)([^_])?'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens = function (str) {
	return A2(
		$elm$core$List$filterMap,
		A2($pablohirafuji$elm_markdown$Markdown$InlineParser$regMatchToEmphasisToken, '_', str),
		A2($elm$regex$Regex$find, $pablohirafuji$elm_markdown$Markdown$InlineParser$underlineEmphasisTokenRegex, str));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$tokenize = function (model) {
	return _Utils_update(
		model,
		{
			h: A2(
				$elm$core$List$sortBy,
				function ($) {
					return $.bF;
				},
				_Utils_ap(
					$pablohirafuji$elm_markdown$Markdown$InlineParser$findAngleBracketRTokens(model.o),
					_Utils_ap(
						$pablohirafuji$elm_markdown$Markdown$InlineParser$findAngleBracketLTokens(model.o),
						_Utils_ap(
							A2($pablohirafuji$elm_markdown$Markdown$InlineParser$findHardBreakTokens, model.ac.c3, model.o),
							_Utils_ap(
								$pablohirafuji$elm_markdown$Markdown$InlineParser$findLinkImageCloseTokens(model.o),
								_Utils_ap(
									$pablohirafuji$elm_markdown$Markdown$InlineParser$findLinkImageOpenTokens(model.o),
									_Utils_ap(
										$pablohirafuji$elm_markdown$Markdown$InlineParser$findUnderlineEmphasisTokens(model.o),
										_Utils_ap(
											$pablohirafuji$elm_markdown$Markdown$InlineParser$findAsteriskEmphasisTokens(model.o),
											$pablohirafuji$elm_markdown$Markdown$InlineParser$findCodeTokens(model.o)))))))))
		});
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$CodeType = {$: 2};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$EmphasisType = function (a) {
	return {$: 7, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlType = function (a) {
	return {$: 6, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$ImageType = function (a) {
	return {$: 5, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$LinkType = function (a) {
	return {$: 4, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$addMatch = F2(
	function (model, match) {
		return _Utils_update(
			model,
			{
				c: A2($elm$core$List$cons, match, model.c)
			});
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$addToken = F2(
	function (model, token) {
		return _Utils_update(
			model,
			{
				h: A2($elm$core$List$cons, token, model.h)
			});
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$applyTTM = F2(
	function (finderFunction, model) {
		return finderFunction(
			_Utils_Tuple2(
				model.h,
				_Utils_update(
					model,
					{h: _List_Nil})));
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$AutolinkType = function (a) {
	return {$: 3, a: a};
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$decodeUrlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('%(?:3B|2C|2F|3F|3A|40|26|3D|2B|24|23|25)'));
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $pablohirafuji$elm_markdown$Markdown$InlineParser$encodeUrl = A2(
	$elm$core$Basics$composeR,
	$elm$url$Url$percentEncode,
	A2(
		$elm$regex$Regex$replace,
		$pablohirafuji$elm_markdown$Markdown$InlineParser$decodeUrlRegex,
		function (match) {
			return A2(
				$elm$core$Maybe$withDefault,
				match.cO,
				$elm$url$Url$percentDecode(match.cO));
		}));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$urlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([A-Za-z][A-Za-z0-9.+\\-]{1,31}:[^<>\\x00-\\x20]*)$'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$autolinkToMatch = function (_v0) {
	var match = _v0;
	return A2($elm$regex$Regex$contains, $pablohirafuji$elm_markdown$Markdown$InlineParser$urlRegex, match.as) ? $elm$core$Result$Ok(
		_Utils_update(
			match,
			{
				bf: $pablohirafuji$elm_markdown$Markdown$InlineParser$AutolinkType(
					_Utils_Tuple2(
						match.as,
						$pablohirafuji$elm_markdown$Markdown$InlineParser$encodeUrl(match.as)))
			})) : $elm$core$Result$Err(match);
};
var $pablohirafuji$elm_markdown$Markdown$Helpers$whiteSpaceChars = ' \\t\\f\\v\\r\\n';
var $pablohirafuji$elm_markdown$Markdown$InlineParser$hrefRegex = '(?:<([^<>' + ($pablohirafuji$elm_markdown$Markdown$Helpers$whiteSpaceChars + (']*)>|([^' + ($pablohirafuji$elm_markdown$Markdown$Helpers$whiteSpaceChars + ('\\(\\)\\\\]*(?:\\\\.[^' + ($pablohirafuji$elm_markdown$Markdown$Helpers$whiteSpaceChars + '\\(\\)\\\\]*)*))')))));
var $pablohirafuji$elm_markdown$Markdown$Helpers$titleRegex = '(?:[' + ($pablohirafuji$elm_markdown$Markdown$Helpers$whiteSpaceChars + (']+' + ('(?:\'([^\'\\\\]*(?:\\\\.[^\'\\\\]*)*)\'|' + ('\"([^\"\\\\]*(?:\\\\.[^\"\\\\]*)*)\"|' + '\\(([^\\)\\\\]*(?:\\\\.[^\\)\\\\]*)*)\\)))?'))));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\(\\s*' + ($pablohirafuji$elm_markdown$Markdown$InlineParser$hrefRegex + ($pablohirafuji$elm_markdown$Markdown$Helpers$titleRegex + '\\s*\\)'))));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle = function (_v0) {
	var rawUrl = _v0.a;
	var maybeTitle = _v0.b;
	return _Utils_Tuple2(
		$pablohirafuji$elm_markdown$Markdown$InlineParser$encodeUrl(
			$pablohirafuji$elm_markdown$Markdown$Helpers$formatStr(rawUrl)),
		A2($elm$core$Maybe$map, $pablohirafuji$elm_markdown$Markdown$Helpers$formatStr, maybeTitle));
};
var $pablohirafuji$elm_markdown$Markdown$Helpers$returnFirstJust = function (maybes) {
	var process = F2(
		function (a, maybeFound) {
			if (!maybeFound.$) {
				var found = maybeFound.a;
				return $elm$core$Maybe$Just(found);
			} else {
				return a;
			}
		});
	return A3($elm$core$List$foldl, process, $elm$core$Maybe$Nothing, maybes);
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch = F3(
	function (matchModel, model, regexMatch) {
		var _v0 = regexMatch.c5;
		if ((((_v0.b && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) {
			var maybeRawUrlAngleBrackets = _v0.a;
			var _v1 = _v0.b;
			var maybeRawUrlWithoutBrackets = _v1.a;
			var _v2 = _v1.b;
			var maybeTitleSingleQuotes = _v2.a;
			var _v3 = _v2.b;
			var maybeTitleDoubleQuotes = _v3.a;
			var _v4 = _v3.b;
			var maybeTitleParenthesis = _v4.a;
			var maybeTitle = $pablohirafuji$elm_markdown$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeTitleSingleQuotes, maybeTitleDoubleQuotes, maybeTitleParenthesis]));
			var toMatch = function (rawUrl) {
				return _Utils_update(
					matchModel,
					{
						bt: matchModel.bt + $elm$core$String$length(regexMatch.cO),
						bf: function () {
							var _v5 = matchModel.bf;
							if (_v5.$ === 5) {
								return $pablohirafuji$elm_markdown$Markdown$InlineParser$ImageType;
							} else {
								return $pablohirafuji$elm_markdown$Markdown$InlineParser$LinkType;
							}
						}()(
							$pablohirafuji$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle(
								_Utils_Tuple2(rawUrl, maybeTitle)))
					});
			};
			var maybeRawUrl = $pablohirafuji$elm_markdown$Markdown$Helpers$returnFirstJust(
				_List_fromArray(
					[maybeRawUrlAngleBrackets, maybeRawUrlWithoutBrackets]));
			return $elm$core$Maybe$Just(
				toMatch(
					A2($elm$core$Maybe$withDefault, '', maybeRawUrl)));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType = function (_v0) {
	var remainText = _v0.a;
	var tempMatch = _v0.b;
	var model = _v0.c;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple3(remainText, tempMatch, model),
		A2(
			$elm$core$Maybe$map,
			$pablohirafuji$elm_markdown$Markdown$InlineParser$addMatch(model),
			A2(
				$elm$core$Maybe$andThen,
				A2($pablohirafuji$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegexToMatch, tempMatch, model),
				$elm$core$List$head(
					A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$InlineParser$inlineLinkTypeOrImageTypeRegex, remainText)))));
};
var $pablohirafuji$elm_markdown$Markdown$Helpers$insideSquareBracketRegex = '[^\\[\\]\\\\]*(?:\\\\.[^\\[\\]\\\\]*)*';
var $pablohirafuji$elm_markdown$Markdown$InlineParser$refLabelRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\[\\s*(' + ($pablohirafuji$elm_markdown$Markdown$Helpers$insideSquareBracketRegex + ')\\s*\\]')));
var $pablohirafuji$elm_markdown$Markdown$Helpers$whitespacesRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('[' + ($pablohirafuji$elm_markdown$Markdown$Helpers$whiteSpaceChars + ']+')));
var $pablohirafuji$elm_markdown$Markdown$Helpers$cleanWhitespaces = A2(
	$elm$core$Basics$composeR,
	$elm$core$String$trim,
	A2(
		$elm$regex$Regex$replace,
		$pablohirafuji$elm_markdown$Markdown$Helpers$whitespacesRegex,
		function (_v0) {
			return ' ';
		}));
var $pablohirafuji$elm_markdown$Markdown$Helpers$prepareRefLabel = A2($elm$core$Basics$composeR, $pablohirafuji$elm_markdown$Markdown$Helpers$cleanWhitespaces, $elm$core$String$toLower);
var $pablohirafuji$elm_markdown$Markdown$InlineParser$refRegexToMatch = F3(
	function (matchModel, model, maybeRegexMatch) {
		var regexMatchLength = A2(
			$elm$core$Maybe$withDefault,
			0,
			A2(
				$elm$core$Maybe$map,
				A2(
					$elm$core$Basics$composeR,
					function ($) {
						return $.cO;
					},
					$elm$core$String$length),
				maybeRegexMatch));
		var toMatch = function (urlTitle) {
			return _Utils_update(
				matchModel,
				{
					bt: matchModel.bt + regexMatchLength,
					bf: function () {
						var _v0 = matchModel.bf;
						if (_v0.$ === 5) {
							return $pablohirafuji$elm_markdown$Markdown$InlineParser$ImageType;
						} else {
							return $pablohirafuji$elm_markdown$Markdown$InlineParser$LinkType;
						}
					}()(
						$pablohirafuji$elm_markdown$Markdown$InlineParser$prepareUrlAndTitle(urlTitle))
				});
		};
		var refLabel = function (str) {
			return $elm$core$String$isEmpty(str) ? matchModel.as : str;
		}(
			A2(
				$elm$core$Maybe$withDefault,
				matchModel.as,
				A2(
					$elm$core$Maybe$withDefault,
					$elm$core$Maybe$Nothing,
					A2(
						$elm$core$Maybe$withDefault,
						$elm$core$Maybe$Nothing,
						A2(
							$elm$core$Maybe$map,
							A2(
								$elm$core$Basics$composeR,
								function ($) {
									return $.c5;
								},
								$elm$core$List$head),
							maybeRegexMatch)))));
		var maybeRefItem = A2(
			$elm$core$Dict$get,
			$pablohirafuji$elm_markdown$Markdown$Helpers$prepareRefLabel(refLabel),
			model.a6);
		return A2($elm$core$Maybe$map, toMatch, maybeRefItem);
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$checkForRefLinkTypeOrImageType = function (_v0) {
	var remainText = _v0.a;
	var tempMatch = _v0.b;
	var model = _v0.c;
	return A2(
		$elm$core$Result$fromMaybe,
		_Utils_Tuple3(remainText, tempMatch, model),
		A2(
			$elm$core$Maybe$map,
			$pablohirafuji$elm_markdown$Markdown$InlineParser$addMatch(model),
			A3(
				$pablohirafuji$elm_markdown$Markdown$InlineParser$refRegexToMatch,
				tempMatch,
				model,
				$elm$core$List$head(
					A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$InlineParser$refLabelRegex, remainText)))));
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping = function (parser) {
	var _v0 = parser.c;
	if (!_v0.b) {
		return $elm$core$Result$Err(0);
	} else {
		var match = _v0.a;
		var remainMatches = _v0.b;
		var overlappingMatches = A2(
			$elm$core$List$filter,
			function (_v1) {
				var testMatch = _v1;
				return (_Utils_cmp(match.bt, testMatch.ba) > 0) && (_Utils_cmp(match.bt, testMatch.bt) < 0);
			},
			remainMatches);
		return ($elm$core$List$isEmpty(remainMatches) || $elm$core$List$isEmpty(overlappingMatches)) ? $elm$core$Result$Ok(parser) : $elm$core$Result$Err(0);
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$emailRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^([a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~\\-]+@[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?)*)$'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch = function (_v0) {
	var match = _v0;
	return A2($elm$regex$Regex$contains, $pablohirafuji$elm_markdown$Markdown$InlineParser$emailRegex, match.as) ? $elm$core$Result$Ok(
		_Utils_update(
			match,
			{
				bf: $pablohirafuji$elm_markdown$Markdown$InlineParser$AutolinkType(
					_Utils_Tuple2(
						match.as,
						'mailto:' + $pablohirafuji$elm_markdown$Markdown$InlineParser$encodeUrl(match.as)))
			})) : $elm$core$Result$Err(match);
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$filterTokens = F2(
	function (filter, model) {
		return _Utils_update(
			model,
			{
				h: A2($elm$core$List$filter, filter, model.h)
			});
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$findToken = F2(
	function (isToken, tokens) {
		var search = F2(
			function (token, _v2) {
				var maybeToken = _v2.a;
				var innerTokens = _v2.b;
				var remainTokens = _v2.c;
				if (maybeToken.$ === 1) {
					return isToken(token) ? _Utils_Tuple3(
						$elm$core$Maybe$Just(token),
						innerTokens,
						_List_Nil) : _Utils_Tuple3(
						$elm$core$Maybe$Nothing,
						A2($elm$core$List$cons, token, innerTokens),
						_List_Nil);
				} else {
					return _Utils_Tuple3(
						maybeToken,
						innerTokens,
						A2($elm$core$List$cons, token, remainTokens));
				}
			});
		var _return = function (_v0) {
			var maybeToken = _v0.a;
			var innerTokens = _v0.b;
			var remainTokens = _v0.c;
			return A2(
				$elm$core$Maybe$map,
				function (token) {
					return _Utils_Tuple3(
						token,
						$elm$core$List$reverse(innerTokens),
						$elm$core$List$reverse(remainTokens));
				},
				maybeToken);
		};
		return _return(
			A3(
				$elm$core$List$foldl,
				search,
				_Utils_Tuple3($elm$core$Maybe$Nothing, _List_Nil, _List_Nil),
				tokens));
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlModel = F2(
	function (tag, attributes) {
		return {H: attributes, aq: tag};
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlToken = F2(
	function (a, b) {
		return {$: 5, a: a, b: b};
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$attributesFromRegex = function (regexMatch) {
	var _v0 = regexMatch.c5;
	_v0$2:
	while (true) {
		if (_v0.b && (!_v0.a.$)) {
			if (_v0.a.a === '') {
				return $elm$core$Maybe$Nothing;
			} else {
				if ((_v0.b.b && _v0.b.b.b) && _v0.b.b.b.b) {
					var name = _v0.a.a;
					var _v1 = _v0.b;
					var maybeDoubleQuotes = _v1.a;
					var _v2 = _v1.b;
					var maybeSingleQuotes = _v2.a;
					var _v3 = _v2.b;
					var maybeUnquoted = _v3.a;
					var maybeValue = $pablohirafuji$elm_markdown$Markdown$Helpers$returnFirstJust(
						_List_fromArray(
							[maybeDoubleQuotes, maybeSingleQuotes, maybeUnquoted]));
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(name, maybeValue));
				} else {
					break _v0$2;
				}
			}
		} else {
			break _v0$2;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlAttributesRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('([a-zA-Z:_][a-zA-Z0-9\\-_.:]*)(?: ?= ?(?:\"([^\"]*)\"|\'([^\']*)\'|([^\\s\"\'=<>`]*)))?'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$applyAttributesRegex = A2(
	$elm$core$Basics$composeR,
	$elm$regex$Regex$find($pablohirafuji$elm_markdown$Markdown$InlineParser$htmlAttributesRegex),
	$elm$core$List$filterMap($pablohirafuji$elm_markdown$Markdown$InlineParser$attributesFromRegex));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlFromRegex = F3(
	function (model, match, regexMatch) {
		var _v0 = regexMatch.c5;
		if ((((_v0.b && _v0.b.b) && (!_v0.b.a.$)) && _v0.b.b.b) && _v0.b.b.b.b) {
			var maybeClose = _v0.a;
			var _v1 = _v0.b;
			var tag = _v1.a.a;
			var _v2 = _v1.b;
			var maybeAttributes = _v2.a;
			var _v3 = _v2.b;
			var maybeSelfClosing = _v3.a;
			var updateModel = function (attrs) {
				return A2(
					$pablohirafuji$elm_markdown$Markdown$InlineParser$addToken,
					model,
					{
						bF: match.ba,
						d: match.bt - match.ba,
						f: A2(
							$pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlToken,
							_Utils_eq(maybeClose, $elm$core$Maybe$Nothing) && _Utils_eq(maybeSelfClosing, $elm$core$Maybe$Nothing),
							A2($pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlModel, tag, attrs))
					});
			};
			var filterAttributes = F2(
				function (attrs, allowed) {
					return A2(
						$elm$core$List$filter,
						function (attr) {
							return A2($elm$core$List$member, attr.a, allowed);
						},
						attrs);
				});
			var attributes = A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				A2($elm$core$Maybe$map, $pablohirafuji$elm_markdown$Markdown$InlineParser$applyAttributesRegex, maybeAttributes));
			var noAttributesInCloseTag = _Utils_eq(maybeClose, $elm$core$Maybe$Nothing) || ((!_Utils_eq(maybeClose, $elm$core$Maybe$Nothing)) && _Utils_eq(attributes, _List_Nil));
			var _v4 = model.ac.cY;
			switch (_v4.$) {
				case 0:
					return noAttributesInCloseTag ? $elm$core$Maybe$Just(
						updateModel(attributes)) : $elm$core$Maybe$Nothing;
				case 1:
					var allowedHtmlElements = _v4.a.bk;
					var allowedHtmlAttributes = _v4.a.bj;
					return (A2($elm$core$List$member, tag, allowedHtmlElements) && noAttributesInCloseTag) ? $elm$core$Maybe$Just(
						updateModel(
							A2(filterAttributes, attributes, allowedHtmlAttributes))) : $elm$core$Maybe$Nothing;
				default:
					return $elm$core$Maybe$Nothing;
			}
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^(\\/)?([a-zA-Z][a-zA-Z0-9\\-]*)(?:\\s+([^<>]*?))?(\\/)?$'));
var $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlToToken = F2(
	function (model, _v0) {
		var match = _v0;
		var _v1 = model.ac.cY;
		if (_v1.$ === 2) {
			return $elm$core$Maybe$Nothing;
		} else {
			return A2(
				$elm$core$Maybe$andThen,
				A2($pablohirafuji$elm_markdown$Markdown$InlineParser$htmlFromRegex, model, match),
				$elm$core$List$head(
					A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlRegex, match.as)));
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$isCloseToken = F2(
	function (htmlModel, token) {
		var _v0 = token.f;
		if ((_v0.$ === 5) && (!_v0.a)) {
			var htmlModel_ = _v0.b;
			return _Utils_eq(htmlModel.aq, htmlModel_.aq);
		} else {
			return false;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$isCodeTokenPair = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.f;
		if (!_v0.$) {
			var isEscaped = _v0.a;
			return isEscaped ? _Utils_eq(openToken.d - 1, closeToken.d) : _Utils_eq(openToken.d, closeToken.d);
		} else {
			return false;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken = function (token) {
	var _v0 = token.f;
	switch (_v0.$) {
		case 1:
			return true;
		case 2:
			return true;
		default:
			return false;
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken = F2(
	function (closeToken, openToken) {
		var _v0 = openToken.f;
		if (_v0.$ === 6) {
			var openChar = _v0.a;
			var _v1 = _v0.b;
			var openLR = _v1.a;
			var openRR = _v1.b;
			var _v2 = closeToken.f;
			if (_v2.$ === 6) {
				var closeChar = _v2.a;
				var _v3 = _v2.b;
				var closeLR = _v3.a;
				var closeRR = _v3.b;
				return _Utils_eq(openChar, closeChar) ? ((_Utils_eq(openLR, openRR) || _Utils_eq(closeLR, closeRR)) ? (!(!A2($elm$core$Basics$modBy, 3, closeToken.d + openToken.d))) : true) : false;
			} else {
				return false;
			}
		} else {
			return false;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$voidHtmlTags = _List_fromArray(
	['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
var $pablohirafuji$elm_markdown$Markdown$InlineParser$isVoidTag = function (htmlModel) {
	return A2($elm$core$List$member, htmlModel.aq, $pablohirafuji$elm_markdown$Markdown$InlineParser$voidHtmlTags);
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakType = {$: 1};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$SoftLineBreakToken = {$: 7};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$reverseTokens = function (model) {
	return _Utils_update(
		model,
		{
			h: $elm$core$List$reverse(model.h)
		});
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$tokenToMatch = F2(
	function (token, type_) {
		return {bt: token.bF + token.d, c: _List_Nil, ba: token.bF, as: '', ae: 0, A: 0, bf: type_};
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$lineBreakTTM = function (_v0) {
	lineBreakTTM:
	while (true) {
		var tokens = _v0.a;
		var model = _v0.b;
		if (!tokens.b) {
			return $pablohirafuji$elm_markdown$Markdown$InlineParser$reverseTokens(model);
		} else {
			var token = tokens.a;
			var tokensTail = tokens.b;
			if (_Utils_eq(token.f, $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakToken) || (_Utils_eq(token.f, $pablohirafuji$elm_markdown$Markdown$InlineParser$SoftLineBreakToken) && model.ac.c3)) {
				return $pablohirafuji$elm_markdown$Markdown$InlineParser$lineBreakTTM(
					function (b) {
						return _Utils_Tuple2(tokensTail, b);
					}(
						_Utils_update(
							model,
							{
								c: A2(
									$elm$core$List$cons,
									A2($pablohirafuji$elm_markdown$Markdown$InlineParser$tokenToMatch, token, $pablohirafuji$elm_markdown$Markdown$InlineParser$HardLineBreakType),
									model.c)
							})));
			} else {
				var $temp$_v0 = _Utils_Tuple2(
					tokensTail,
					A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token));
				_v0 = $temp$_v0;
				continue lineBreakTTM;
			}
		}
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens = F2(
	function (tokensTail, parser) {
		var _v0 = parser.c;
		if (!_v0.b) {
			return _Utils_Tuple2(tokensTail, parser);
		} else {
			var match = _v0.a;
			return _Utils_Tuple2(
				A2(
					$elm$core$List$filter,
					function (token) {
						return _Utils_cmp(token.bF, match.bt) > -1;
					},
					tokensTail),
				parser);
		}
	});
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$angleBracketsToMatch = F4(
	function (closeToken, isEscaped, model, _v24) {
		var openToken = _v24.a;
		var remainTokens = _v24.c;
		return function (result) {
			if (result.$ === 1) {
				var tempMatch = result.a;
				return (!isEscaped) ? A2(
					$pablohirafuji$elm_markdown$Markdown$InlineParser$htmlToToken,
					_Utils_update(
						model,
						{h: remainTokens}),
					tempMatch) : $elm$core$Result$toMaybe(result);
			} else {
				return $elm$core$Result$toMaybe(result);
			}
		}(
			A2(
				$elm$core$Result$map,
				function (newMatch) {
					return _Utils_update(
						model,
						{
							c: A2($elm$core$List$cons, newMatch, model.c),
							h: remainTokens
						});
				},
				A2(
					$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
					$pablohirafuji$elm_markdown$Markdown$InlineParser$emailAutolinkTypeToMatch,
					$pablohirafuji$elm_markdown$Markdown$InlineParser$autolinkToMatch(
						A6(
							$pablohirafuji$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
							model,
							function (s) {
								return s;
							},
							$pablohirafuji$elm_markdown$Markdown$InlineParser$CodeType,
							openToken,
							closeToken,
							_List_Nil)))));
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM = function (_v21) {
	codeAutolinkTypeHtmlTagTTM:
	while (true) {
		var tokens = _v21.a;
		var model = _v21.b;
		if (!tokens.b) {
			return $pablohirafuji$elm_markdown$Markdown$InlineParser$reverseTokens(model);
		} else {
			var token = tokens.a;
			var tokensTail = tokens.b;
			var _v23 = token.f;
			switch (_v23.$) {
				case 0:
					var isEscaped = _v23.a;
					return $pablohirafuji$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM(
						function (b) {
							return _Utils_Tuple2(tokensTail, b);
						}(
							A2(
								$elm$core$Maybe$withDefault,
								A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token),
								A2(
									$elm$core$Maybe$map,
									A2($pablohirafuji$elm_markdown$Markdown$InlineParser$codeToMatch, token, model),
									A2(
										$pablohirafuji$elm_markdown$Markdown$InlineParser$findToken,
										$pablohirafuji$elm_markdown$Markdown$InlineParser$isCodeTokenPair(token),
										model.h)))));
				case 4:
					var isEscaped = _v23.a;
					return $pablohirafuji$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM(
						function (b) {
							return _Utils_Tuple2(tokensTail, b);
						}(
							A2(
								$pablohirafuji$elm_markdown$Markdown$InlineParser$filterTokens,
								A2(
									$elm$core$Basics$composeR,
									function ($) {
										return $.f;
									},
									$elm$core$Basics$neq(
										$pablohirafuji$elm_markdown$Markdown$InlineParser$CharToken('<'))),
								A2(
									$elm$core$Maybe$withDefault,
									model,
									A2(
										$elm$core$Maybe$andThen,
										A3($pablohirafuji$elm_markdown$Markdown$InlineParser$angleBracketsToMatch, token, isEscaped, model),
										A2(
											$pablohirafuji$elm_markdown$Markdown$InlineParser$findToken,
											A2(
												$elm$core$Basics$composeR,
												function ($) {
													return $.f;
												},
												$elm$core$Basics$eq(
													$pablohirafuji$elm_markdown$Markdown$InlineParser$CharToken('<'))),
											model.h))))));
				default:
					var $temp$_v21 = _Utils_Tuple2(
						tokensTail,
						A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token));
					_v21 = $temp$_v21;
					continue codeAutolinkTypeHtmlTagTTM;
			}
		}
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$codeToMatch = F3(
	function (closeToken, model, _v20) {
		var openToken = _v20.a;
		var remainTokens = _v20.c;
		var updtOpenToken = _Utils_eq(
			openToken.f,
			$pablohirafuji$elm_markdown$Markdown$InlineParser$CodeToken(true)) ? _Utils_update(
			openToken,
			{bF: openToken.bF + 1, d: openToken.d - 1}) : openToken;
		return _Utils_update(
			model,
			{
				c: A2(
					$elm$core$List$cons,
					A6($pablohirafuji$elm_markdown$Markdown$InlineParser$tokenPairToMatch, model, $pablohirafuji$elm_markdown$Markdown$Helpers$cleanWhitespaces, $pablohirafuji$elm_markdown$Markdown$InlineParser$CodeType, updtOpenToken, closeToken, _List_Nil),
					model.c),
				h: remainTokens
			});
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$emphasisTTM = function (_v16) {
	emphasisTTM:
	while (true) {
		var tokens = _v16.a;
		var model = _v16.b;
		if (!tokens.b) {
			return $pablohirafuji$elm_markdown$Markdown$InlineParser$reverseTokens(model);
		} else {
			var token = tokens.a;
			var tokensTail = tokens.b;
			var _v18 = token.f;
			if (_v18.$ === 6) {
				var _char = _v18.a;
				var _v19 = _v18.b;
				var leftRank = _v19.a;
				var rightRank = _v19.b;
				if (_Utils_eq(leftRank, rightRank)) {
					if ((!(!rightRank)) && ((_char !== '_') || (rightRank === 1))) {
						return $pablohirafuji$elm_markdown$Markdown$InlineParser$emphasisTTM(
							A2(
								$elm$core$Maybe$withDefault,
								_Utils_Tuple2(
									tokensTail,
									A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token)),
								A2(
									$elm$core$Maybe$map,
									A3($pablohirafuji$elm_markdown$Markdown$InlineParser$emphasisToMatch, token, tokensTail, model),
									A2(
										$pablohirafuji$elm_markdown$Markdown$InlineParser$findToken,
										$pablohirafuji$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token),
										model.h))));
					} else {
						var $temp$_v16 = _Utils_Tuple2(tokensTail, model);
						_v16 = $temp$_v16;
						continue emphasisTTM;
					}
				} else {
					if (_Utils_cmp(leftRank, rightRank) < 0) {
						var $temp$_v16 = _Utils_Tuple2(
							tokensTail,
							A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token));
						_v16 = $temp$_v16;
						continue emphasisTTM;
					} else {
						return $pablohirafuji$elm_markdown$Markdown$InlineParser$emphasisTTM(
							A2(
								$elm$core$Maybe$withDefault,
								_Utils_Tuple2(tokensTail, model),
								A2(
									$elm$core$Maybe$map,
									A3($pablohirafuji$elm_markdown$Markdown$InlineParser$emphasisToMatch, token, tokensTail, model),
									A2(
										$pablohirafuji$elm_markdown$Markdown$InlineParser$findToken,
										$pablohirafuji$elm_markdown$Markdown$InlineParser$isOpenEmphasisToken(token),
										model.h))));
					}
				}
			} else {
				var $temp$_v16 = _Utils_Tuple2(
					tokensTail,
					A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token));
				_v16 = $temp$_v16;
				continue emphasisTTM;
			}
		}
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$emphasisToMatch = F4(
	function (closeToken, tokensTail, model, _v15) {
		var openToken = _v15.a;
		var innerTokens = _v15.b;
		var remainTokens = _v15.c;
		var remainLength = openToken.d - closeToken.d;
		var updt = (!remainLength) ? {aA: closeToken, al: openToken, aM: remainTokens, aP: tokensTail} : ((remainLength > 0) ? {
			aA: closeToken,
			al: _Utils_update(
				openToken,
				{bF: openToken.bF + remainLength, d: closeToken.d}),
			aM: A2(
				$elm$core$List$cons,
				_Utils_update(
					openToken,
					{d: remainLength}),
				remainTokens),
			aP: tokensTail
		} : {
			aA: _Utils_update(
				closeToken,
				{d: openToken.d}),
			al: openToken,
			aM: remainTokens,
			aP: A2(
				$elm$core$List$cons,
				_Utils_update(
					closeToken,
					{bF: closeToken.bF + openToken.d, d: -remainLength}),
				tokensTail)
		});
		var match = A6(
			$pablohirafuji$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
			model,
			function (s) {
				return s;
			},
			$pablohirafuji$elm_markdown$Markdown$InlineParser$EmphasisType(updt.al.d),
			updt.al,
			updt.aA,
			$elm$core$List$reverse(innerTokens));
		return _Utils_Tuple2(
			updt.aP,
			_Utils_update(
				model,
				{
					c: A2($elm$core$List$cons, match, model.c),
					h: updt.aM
				}));
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlElementTTM = function (_v12) {
	htmlElementTTM:
	while (true) {
		var tokens = _v12.a;
		var model = _v12.b;
		if (!tokens.b) {
			return $pablohirafuji$elm_markdown$Markdown$InlineParser$reverseTokens(model);
		} else {
			var token = tokens.a;
			var tokensTail = tokens.b;
			var _v14 = token.f;
			if (_v14.$ === 5) {
				var isOpen = _v14.a;
				var htmlModel = _v14.b;
				return ($pablohirafuji$elm_markdown$Markdown$InlineParser$isVoidTag(htmlModel) || (!isOpen)) ? $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlElementTTM(
					function (b) {
						return _Utils_Tuple2(tokensTail, b);
					}(
						A2(
							$pablohirafuji$elm_markdown$Markdown$InlineParser$addMatch,
							model,
							A2(
								$pablohirafuji$elm_markdown$Markdown$InlineParser$tokenToMatch,
								token,
								$pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel))))) : $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlElementTTM(
					A2(
						$elm$core$Maybe$withDefault,
						function (b) {
							return _Utils_Tuple2(tokensTail, b);
						}(
							A2(
								$pablohirafuji$elm_markdown$Markdown$InlineParser$addMatch,
								model,
								A2(
									$pablohirafuji$elm_markdown$Markdown$InlineParser$tokenToMatch,
									token,
									$pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel)))),
						A2(
							$elm$core$Maybe$map,
							A3($pablohirafuji$elm_markdown$Markdown$InlineParser$htmlElementToMatch, token, model, htmlModel),
							A2(
								$pablohirafuji$elm_markdown$Markdown$InlineParser$findToken,
								$pablohirafuji$elm_markdown$Markdown$InlineParser$isCloseToken(htmlModel),
								tokensTail))));
			} else {
				var $temp$_v12 = _Utils_Tuple2(
					tokensTail,
					A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token));
				_v12 = $temp$_v12;
				continue htmlElementTTM;
			}
		}
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$htmlElementToMatch = F4(
	function (openToken, model, htmlModel, _v11) {
		var closeToken = _v11.a;
		var innerTokens = _v11.b;
		var remainTokens = _v11.c;
		return _Utils_Tuple2(
			remainTokens,
			_Utils_update(
				model,
				{
					c: A2(
						$elm$core$List$cons,
						A6(
							$pablohirafuji$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
							model,
							function (s) {
								return s;
							},
							$pablohirafuji$elm_markdown$Markdown$InlineParser$HtmlType(htmlModel),
							openToken,
							closeToken,
							innerTokens),
						model.c)
				}));
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$linkImageTypeTTM = function (_v8) {
	linkImageTypeTTM:
	while (true) {
		var tokens = _v8.a;
		var model = _v8.b;
		if (!tokens.b) {
			return $pablohirafuji$elm_markdown$Markdown$InlineParser$reverseTokens(model);
		} else {
			var token = tokens.a;
			var tokensTail = tokens.b;
			var _v10 = token.f;
			if ((_v10.$ === 3) && (']' === _v10.a)) {
				return $pablohirafuji$elm_markdown$Markdown$InlineParser$linkImageTypeTTM(
					A2(
						$elm$core$Maybe$withDefault,
						_Utils_Tuple2(tokensTail, model),
						A2(
							$elm$core$Maybe$andThen,
							A3($pablohirafuji$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch, token, tokensTail, model),
							A2($pablohirafuji$elm_markdown$Markdown$InlineParser$findToken, $pablohirafuji$elm_markdown$Markdown$InlineParser$isLinkTypeOrImageOpenToken, model.h))));
			} else {
				var $temp$_v8 = _Utils_Tuple2(
					tokensTail,
					A2($pablohirafuji$elm_markdown$Markdown$InlineParser$addToken, model, token));
				_v8 = $temp$_v8;
				continue linkImageTypeTTM;
			}
		}
	}
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$linkOrImageTypeToMatch = F4(
	function (closeToken, tokensTail, model, _v1) {
		var openToken = _v1.a;
		var innerTokens = _v1.b;
		var remainTokens = _v1.c;
		var tempMatch = function (isLinkType) {
			return A6(
				$pablohirafuji$elm_markdown$Markdown$InlineParser$tokenPairToMatch,
				model,
				function (s) {
					return s;
				},
				isLinkType ? $pablohirafuji$elm_markdown$Markdown$InlineParser$LinkType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)) : $pablohirafuji$elm_markdown$Markdown$InlineParser$ImageType(
					_Utils_Tuple2('', $elm$core$Maybe$Nothing)),
				openToken,
				closeToken,
				$elm$core$List$reverse(innerTokens));
		};
		var removeOpenToken = _Utils_Tuple2(
			tokensTail,
			_Utils_update(
				model,
				{
					h: _Utils_ap(innerTokens, remainTokens)
				}));
		var remainText = A2($elm$core$String$dropLeft, closeToken.bF + 1, model.o);
		var linkOpenTokenToInactive = function (model_) {
			var process = function (token) {
				var _v7 = token.f;
				if (_v7.$ === 1) {
					return _Utils_update(
						token,
						{
							f: $pablohirafuji$elm_markdown$Markdown$InlineParser$LinkOpenToken(false)
						});
				} else {
					return token;
				}
			};
			return _Utils_update(
				model_,
				{
					h: A2($elm$core$List$map, process, model_.h)
				});
		};
		var args = function (isLinkType) {
			return _Utils_Tuple3(
				remainText,
				tempMatch(isLinkType),
				_Utils_update(
					model,
					{h: remainTokens}));
		};
		var _v2 = openToken.f;
		switch (_v2.$) {
			case 2:
				return $elm$core$Result$toMaybe(
					A2(
						$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
						function (_v4) {
							return $elm$core$Result$Ok(removeOpenToken);
						},
						A2(
							$elm$core$Result$map,
							$pablohirafuji$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens(tokensTail),
							A2(
								$elm$core$Result$andThen,
								$pablohirafuji$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping,
								A2(
									$elm$core$Result$mapError,
									function (_v3) {
										return 0;
									},
									A2(
										$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
										$pablohirafuji$elm_markdown$Markdown$InlineParser$checkForRefLinkTypeOrImageType,
										$pablohirafuji$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType(
											args(false))))))));
			case 1:
				if (_v2.a) {
					return $elm$core$Result$toMaybe(
						A2(
							$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
							function (_v6) {
								return $elm$core$Result$Ok(removeOpenToken);
							},
							A2(
								$elm$core$Result$map,
								$pablohirafuji$elm_markdown$Markdown$InlineParser$removeParsedAheadTokens(tokensTail),
								A2(
									$elm$core$Result$map,
									linkOpenTokenToInactive,
									A2(
										$elm$core$Result$andThen,
										$pablohirafuji$elm_markdown$Markdown$InlineParser$checkParsedAheadOverlapping,
										A2(
											$elm$core$Result$mapError,
											function (_v5) {
												return 0;
											},
											A2(
												$pablohirafuji$elm_markdown$Markdown$Helpers$ifError,
												$pablohirafuji$elm_markdown$Markdown$InlineParser$checkForRefLinkTypeOrImageType,
												$pablohirafuji$elm_markdown$Markdown$InlineParser$checkForInlineLinkTypeOrImageType(
													args(true)))))))));
				} else {
					return $elm$core$Maybe$Just(removeOpenToken);
				}
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$InlineParser$tokenPairToMatch = F6(
	function (model, processText, type_, openToken, closeToken, innerTokens) {
		var textStart = openToken.bF + openToken.d;
		var textEnd = closeToken.bF;
		var start = openToken.bF;
		var end = closeToken.bF + closeToken.d;
		var match = {
			bt: end,
			c: _List_Nil,
			ba: start,
			as: processText(
				A3($elm$core$String$slice, textStart, textEnd, model.o)),
			ae: textEnd,
			A: textStart,
			bf: type_
		};
		var matches = A2(
			$elm$core$List$map,
			function (_v0) {
				var matchModel = _v0;
				return A2($pablohirafuji$elm_markdown$Markdown$InlineParser$prepareChildMatch, match, matchModel);
			},
			$pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$tokensToMatches()(
				_Utils_update(
					model,
					{c: _List_Nil, h: innerTokens})).c);
		return _Utils_update(
			match,
			{c: matches});
	});
function $pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$tokensToMatches() {
	return A2(
		$elm$core$Basics$composeR,
		$pablohirafuji$elm_markdown$Markdown$InlineParser$applyTTM($pablohirafuji$elm_markdown$Markdown$InlineParser$codeAutolinkTypeHtmlTagTTM),
		A2(
			$elm$core$Basics$composeR,
			$pablohirafuji$elm_markdown$Markdown$InlineParser$applyTTM($pablohirafuji$elm_markdown$Markdown$InlineParser$htmlElementTTM),
			A2(
				$elm$core$Basics$composeR,
				$pablohirafuji$elm_markdown$Markdown$InlineParser$applyTTM($pablohirafuji$elm_markdown$Markdown$InlineParser$linkImageTypeTTM),
				A2(
					$elm$core$Basics$composeR,
					$pablohirafuji$elm_markdown$Markdown$InlineParser$applyTTM($pablohirafuji$elm_markdown$Markdown$InlineParser$emphasisTTM),
					$pablohirafuji$elm_markdown$Markdown$InlineParser$applyTTM($pablohirafuji$elm_markdown$Markdown$InlineParser$lineBreakTTM)))));
}
var $pablohirafuji$elm_markdown$Markdown$InlineParser$tokensToMatches = $pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$tokensToMatches();
$pablohirafuji$elm_markdown$Markdown$InlineParser$cyclic$tokensToMatches = function () {
	return $pablohirafuji$elm_markdown$Markdown$InlineParser$tokensToMatches;
};
var $pablohirafuji$elm_markdown$Markdown$InlineParser$parse = F3(
	function (options, refs, rawText) {
		return $pablohirafuji$elm_markdown$Markdown$InlineParser$matchesToInlines(
			$pablohirafuji$elm_markdown$Markdown$InlineParser$parseText(
				$pablohirafuji$elm_markdown$Markdown$InlineParser$organizeParserMatches(
					$pablohirafuji$elm_markdown$Markdown$InlineParser$tokensToMatches(
						$pablohirafuji$elm_markdown$Markdown$InlineParser$tokenize(
							A3(
								$pablohirafuji$elm_markdown$Markdown$InlineParser$initParser,
								options,
								refs,
								$elm$core$String$trim(rawText)))))).c);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseInline = F4(
	function (maybeOptions, textAsParagraph, refs, block) {
		var options = A2($elm$core$Maybe$withDefault, $pablohirafuji$elm_markdown$Markdown$Config$defaultOptions, maybeOptions);
		switch (block.$) {
			case 2:
				var rawText = block.a;
				var lvl = block.b;
				return A3(
					$pablohirafuji$elm_markdown$Markdown$Block$Heading,
					rawText,
					lvl,
					A3($pablohirafuji$elm_markdown$Markdown$InlineParser$parse, options, refs, rawText));
			case 4:
				var rawText = block.a;
				var inlines = A3($pablohirafuji$elm_markdown$Markdown$InlineParser$parse, options, refs, rawText);
				if ((inlines.b && (inlines.a.$ === 5)) && (!inlines.b.b)) {
					var _v3 = inlines.a;
					return $pablohirafuji$elm_markdown$Markdown$Block$PlainInlines(inlines);
				} else {
					return textAsParagraph ? A2($pablohirafuji$elm_markdown$Markdown$Block$Paragraph, rawText, inlines) : $pablohirafuji$elm_markdown$Markdown$Block$PlainInlines(inlines);
				}
			case 5:
				var blocks = block.a;
				return $pablohirafuji$elm_markdown$Markdown$Block$BlockQuote(
					A3(
						$pablohirafuji$elm_markdown$Markdown$Block$parseInlines,
						maybeOptions,
						true,
						_Utils_Tuple2(refs, blocks)));
			case 6:
				var model = block.a;
				var items = block.b;
				return A2(
					$pablohirafuji$elm_markdown$Markdown$Block$List,
					model,
					function (a) {
						return A2($elm$core$List$map, a, items);
					}(
						A2(
							$elm$core$Basics$composeL,
							A2($pablohirafuji$elm_markdown$Markdown$Block$parseInlines, maybeOptions, model.cL),
							function (b) {
								return _Utils_Tuple2(refs, b);
							})));
			case 8:
				var customBlock = block.a;
				var blocks = block.b;
				return A2(
					$pablohirafuji$elm_markdown$Markdown$Block$Custom,
					customBlock,
					A3(
						$pablohirafuji$elm_markdown$Markdown$Block$parseInlines,
						maybeOptions,
						true,
						_Utils_Tuple2(refs, blocks)));
			default:
				return block;
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseInlines = F3(
	function (maybeOptions, textAsParagraph, _v0) {
		var refs = _v0.a;
		var blocks = _v0.b;
		return A2(
			$elm$core$List$map,
			A3($pablohirafuji$elm_markdown$Markdown$Block$parseInline, maybeOptions, textAsParagraph, refs),
			blocks);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$dropRefString = F2(
	function (rawText, inlineMatch) {
		var strippedText = A2($elm$core$String$dropLeft, inlineMatch.a_, rawText);
		return A2($elm$regex$Regex$contains, $pablohirafuji$elm_markdown$Markdown$Block$blankLineRegex, strippedText) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(strippedText);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$insertLinkMatch = F2(
	function (refs, linkMatch) {
		return A2($elm$core$Dict$member, linkMatch.U, refs) ? refs : A3(
			$elm$core$Dict$insert,
			linkMatch.U,
			_Utils_Tuple2(linkMatch.aS, linkMatch.a$),
			refs);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$extractUrlTitleRegex = function (regexMatch) {
	var _v0 = regexMatch.c5;
	if ((((((_v0.b && (!_v0.a.$)) && _v0.b.b) && _v0.b.b.b) && _v0.b.b.b.b) && _v0.b.b.b.b.b) && _v0.b.b.b.b.b.b) {
		var rawText = _v0.a.a;
		var _v1 = _v0.b;
		var maybeRawUrlAngleBrackets = _v1.a;
		var _v2 = _v1.b;
		var maybeRawUrlWithoutBrackets = _v2.a;
		var _v3 = _v2.b;
		var maybeTitleSingleQuotes = _v3.a;
		var _v4 = _v3.b;
		var maybeTitleDoubleQuotes = _v4.a;
		var _v5 = _v4.b;
		var maybeTitleParenthesis = _v5.a;
		var toReturn = function (rawUrl) {
			return {
				U: rawText,
				a_: $elm$core$String$length(regexMatch.cO),
				a$: $pablohirafuji$elm_markdown$Markdown$Helpers$returnFirstJust(
					_List_fromArray(
						[maybeTitleSingleQuotes, maybeTitleDoubleQuotes, maybeTitleParenthesis])),
				aS: rawUrl
			};
		};
		var maybeRawUrl = $pablohirafuji$elm_markdown$Markdown$Helpers$returnFirstJust(
			_List_fromArray(
				[maybeRawUrlAngleBrackets, maybeRawUrlWithoutBrackets]));
		return A2($elm$core$Maybe$map, toReturn, maybeRawUrl);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $pablohirafuji$elm_markdown$Markdown$Block$hrefRegex = '\\s*(?:<([^<>\\s]*)>|([^\\s]*))';
var $pablohirafuji$elm_markdown$Markdown$Block$refRegex = A2(
	$elm$core$Maybe$withDefault,
	$elm$regex$Regex$never,
	$elm$regex$Regex$fromString('^\\s*\\[(' + ($pablohirafuji$elm_markdown$Markdown$Helpers$insideSquareBracketRegex + (')\\]:' + ($pablohirafuji$elm_markdown$Markdown$Block$hrefRegex + ($pablohirafuji$elm_markdown$Markdown$Helpers$titleRegex + '\\s*(?![^\\n])'))))));
var $pablohirafuji$elm_markdown$Markdown$Block$maybeLinkMatch = function (rawText) {
	return A2(
		$elm$core$Maybe$andThen,
		function (linkMatch) {
			return ((linkMatch.aS === '') || (linkMatch.U === '')) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(linkMatch);
		},
		A2(
			$elm$core$Maybe$map,
			function (linkMatch) {
				return _Utils_update(
					linkMatch,
					{
						U: $pablohirafuji$elm_markdown$Markdown$Helpers$prepareRefLabel(linkMatch.U)
					});
			},
			A2(
				$elm$core$Maybe$andThen,
				$pablohirafuji$elm_markdown$Markdown$Block$extractUrlTitleRegex,
				$elm$core$List$head(
					A3($elm$regex$Regex$findAtMost, 1, $pablohirafuji$elm_markdown$Markdown$Block$refRegex, rawText)))));
};
var $pablohirafuji$elm_markdown$Markdown$Block$parseReference = F2(
	function (refs, rawText) {
		parseReference:
		while (true) {
			var _v0 = $pablohirafuji$elm_markdown$Markdown$Block$maybeLinkMatch(rawText);
			if (!_v0.$) {
				var linkMatch = _v0.a;
				var updtRefs = A2($pablohirafuji$elm_markdown$Markdown$Block$insertLinkMatch, refs, linkMatch);
				var maybeStrippedText = A2($pablohirafuji$elm_markdown$Markdown$Block$dropRefString, rawText, linkMatch);
				if (!maybeStrippedText.$) {
					var strippedText = maybeStrippedText.a;
					var $temp$refs = updtRefs,
						$temp$rawText = strippedText;
					refs = $temp$refs;
					rawText = $temp$rawText;
					continue parseReference;
				} else {
					return _Utils_Tuple2(updtRefs, $elm$core$Maybe$Nothing);
				}
			} else {
				return _Utils_Tuple2(
					refs,
					$elm$core$Maybe$Just(rawText));
			}
		}
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parseReferences = function (refs) {
	return A2(
		$elm$core$List$foldl,
		$pablohirafuji$elm_markdown$Markdown$Block$parseReferencesHelp,
		_Utils_Tuple2(refs, _List_Nil));
};
var $pablohirafuji$elm_markdown$Markdown$Block$parseReferencesHelp = F2(
	function (block, _v0) {
		var refs = _v0.a;
		var parsedAST = _v0.b;
		switch (block.$) {
			case 4:
				var rawText = block.a;
				var _v2 = A2($pablohirafuji$elm_markdown$Markdown$Block$parseReference, $elm$core$Dict$empty, rawText);
				var paragraphRefs = _v2.a;
				var maybeUpdtText = _v2.b;
				var updtRefs = A2($elm$core$Dict$union, paragraphRefs, refs);
				if (!maybeUpdtText.$) {
					var updtText = maybeUpdtText.a;
					return _Utils_Tuple2(
						updtRefs,
						A2(
							$elm$core$List$cons,
							A2($pablohirafuji$elm_markdown$Markdown$Block$Paragraph, updtText, _List_Nil),
							parsedAST));
				} else {
					return _Utils_Tuple2(updtRefs, parsedAST);
				}
			case 6:
				var model = block.a;
				var items = block.b;
				var _v4 = A3(
					$elm$core$List$foldl,
					F2(
						function (item, _v5) {
							var refs__ = _v5.a;
							var parsedItems = _v5.b;
							return A2(
								$elm$core$Tuple$mapSecond,
								function (a) {
									return A2($elm$core$List$cons, a, parsedItems);
								},
								A2($pablohirafuji$elm_markdown$Markdown$Block$parseReferences, refs__, item));
						}),
					_Utils_Tuple2(refs, _List_Nil),
					items);
				var updtRefs = _v4.a;
				var updtItems = _v4.b;
				return _Utils_Tuple2(
					updtRefs,
					A2(
						$elm$core$List$cons,
						A2($pablohirafuji$elm_markdown$Markdown$Block$List, model, updtItems),
						parsedAST));
			case 5:
				var blocks = block.a;
				return A2(
					$elm$core$Tuple$mapSecond,
					function (a) {
						return A2($elm$core$List$cons, a, parsedAST);
					},
					A2(
						$elm$core$Tuple$mapSecond,
						$pablohirafuji$elm_markdown$Markdown$Block$BlockQuote,
						A2($pablohirafuji$elm_markdown$Markdown$Block$parseReferences, refs, blocks)));
			case 8:
				var customBlock = block.a;
				var blocks = block.b;
				return A2(
					$elm$core$Tuple$mapSecond,
					function (a) {
						return A2($elm$core$List$cons, a, parsedAST);
					},
					A2(
						$elm$core$Tuple$mapSecond,
						$pablohirafuji$elm_markdown$Markdown$Block$Custom(customBlock),
						A2($pablohirafuji$elm_markdown$Markdown$Block$parseReferences, refs, blocks)));
			default:
				return _Utils_Tuple2(
					refs,
					A2($elm$core$List$cons, block, parsedAST));
		}
	});
var $pablohirafuji$elm_markdown$Markdown$Block$parse = function (maybeOptions) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$String$lines,
		A2(
			$elm$core$Basics$composeR,
			function (a) {
				return A2($pablohirafuji$elm_markdown$Markdown$Block$incorporateLines, a, _List_Nil);
			},
			A2(
				$elm$core$Basics$composeR,
				$pablohirafuji$elm_markdown$Markdown$Block$parseReferences($elm$core$Dict$empty),
				A2($pablohirafuji$elm_markdown$Markdown$Block$parseInlines, maybeOptions, true))));
};
var $author$project$Page$Markdown$changeEditorTypeToWYSIWYG = function (model) {
	var markdownNodes = A2(
		$pablohirafuji$elm_markdown$Markdown$Block$parse,
		$elm$core$Maybe$Just(
			{cY: $pablohirafuji$elm_markdown$Markdown$Config$DontParse, c3: false}),
		model.Z);
	var result = $author$project$Page$Markdown$markdownToBlock(
		$author$project$Page$Markdown$filterBlankLines(markdownNodes));
	if (result.$ === 1) {
		var e = result.a;
		return _Utils_update(
			model,
			{
				V: $elm$core$Maybe$Just(e)
			});
	} else {
		var root = result.a;
		return _Utils_update(
			model,
			{
				a: $author$project$Page$Markdown$initializeEditor(
					A2($author$project$RichText$Model$State$state, root, $elm$core$Maybe$Nothing)),
				K: 1,
				V: $elm$core$Maybe$Nothing
			});
	}
};
var $author$project$Page$Markdown$changeEditorType = F2(
	function (type_, model) {
		if (_Utils_eq(type_, model.K)) {
			return model;
		} else {
			if (type_ === 1) {
				return $author$project$Page$Markdown$changeEditorTypeToWYSIWYG(model);
			} else {
				return $author$project$Page$Markdown$changeEditorTypeToMarkdown(model);
			}
		}
	});
var $author$project$Page$Markdown$config = $author$project$RichText$Editor$config(
	{
		cr: $author$project$Editor$commandBindings($author$project$RichText$Definitions$markdown),
		cx: $author$project$Editor$decorations,
		c4: $author$project$RichText$Definitions$markdown,
		c7: $author$project$Controls$InternalMsg
	});
var $author$project$Page$Markdown$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var editorMsg = msg.a;
				var _v1 = A3($author$project$Editor$update, $author$project$Page$Markdown$config, editorMsg, model.a);
				var e = _v1.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a: e}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var type_ = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Page$Markdown$changeEditorType, type_, model),
					$elm$core$Platform$Cmd$none);
			case 2:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Z: value}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$SpecExtension$customSpec = A2(
	$author$project$RichText$Config$Spec$withMarkDefinitions,
	_Utils_ap(
		$author$project$RichText$Config$Spec$markDefinitions($author$project$RichText$Definitions$markdown),
		_List_fromArray(
			[$author$project$ExtraMarks$strikethrough, $author$project$ExtraMarks$underline])),
	A2(
		$author$project$RichText$Config$Spec$withElementDefinitions,
		_Utils_ap(
			$author$project$RichText$Config$Spec$elementDefinitions($author$project$RichText$Definitions$markdown),
			_List_fromArray(
				[$author$project$Page$SpecExtension$captionedImage])),
		$author$project$RichText$Definitions$markdown));
var $author$project$Page$SpecExtension$commandBindings = function (spec) {
	var markOrder = $author$project$RichText$Model$Mark$markOrderFromSpec(spec);
	return A3(
		$author$project$RichText$Config$Command$set,
		_List_fromArray(
			[
				$author$project$RichText$Config$Command$inputEvent('formatStrikeThrough'),
				$author$project$RichText$Config$Command$key(
				_List_fromArray(
					[$author$project$RichText$Config$Keys$short, 'd']))
			]),
		_List_fromArray(
			[
				_Utils_Tuple2(
				'toggleStyle',
				$author$project$RichText$Config$Command$transform(
					A3(
						$author$project$RichText$Commands$toggleMark,
						markOrder,
						A2($author$project$RichText$Model$Mark$mark, $author$project$ExtraMarks$strikethrough, _List_Nil),
						2)))
			]),
		A3(
			$author$project$RichText$Config$Command$set,
			_List_fromArray(
				[
					$author$project$RichText$Config$Command$inputEvent('formatUnderline'),
					$author$project$RichText$Config$Command$key(
					_List_fromArray(
						[$author$project$RichText$Config$Keys$short, 'u']))
				]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					'toggleStyle',
					$author$project$RichText$Config$Command$transform(
						A3(
							$author$project$RichText$Commands$toggleMark,
							markOrder,
							A2($author$project$RichText$Model$Mark$mark, $author$project$ExtraMarks$underline, _List_Nil),
							2)))
				]),
			$author$project$Editor$commandBindings($author$project$Page$SpecExtension$customSpec)));
};
var $author$project$Controls$CaptionedImage = F2(
	function (a, b) {
		return {$: 16, a: a, b: b};
	});
var $author$project$Controls$Noop = {$: 15};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $author$project$Page$SpecExtension$preventKeyDownPropagationDecoration = F3(
	function (editorNodePath, elementParameters, elementPath) {
		return _Utils_eq(elementPath, _List_Nil) ? A4($author$project$RichText$Config$Decorations$selectableDecoration, $author$project$Controls$InternalMsg, editorNodePath, elementParameters, elementPath) : (_Utils_eq(
			elementPath,
			_List_fromArray(
				[1, 0])) ? _List_fromArray(
			[
				A2(
				$elm$html$Html$Events$stopPropagationOn,
				'keydown',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2($author$project$Controls$Noop, true))),
				A2(
				$elm$html$Html$Events$stopPropagationOn,
				'beforeinput',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2($author$project$Controls$Noop, true))),
				$elm$html$Html$Events$onInput(
				$author$project$Controls$CaptionedImage(editorNodePath))
			]) : _List_Nil);
	});
var $author$project$Page$SpecExtension$newDecorations = A3($author$project$RichText$Config$Decorations$addElementDecoration, $author$project$Page$SpecExtension$captionedImage, $author$project$Page$SpecExtension$preventKeyDownPropagationDecoration, $author$project$Editor$decorations);
var $author$project$Page$SpecExtension$config = $author$project$RichText$Editor$config(
	{
		cr: $author$project$Page$SpecExtension$commandBindings($author$project$Page$SpecExtension$customSpec),
		cx: $author$project$Page$SpecExtension$newDecorations,
		c4: $author$project$Page$SpecExtension$customSpec,
		c7: $author$project$Controls$InternalMsg
	});
var $author$project$RichText$Internal$Editor$applyCommandNoForceSelection = F3(
	function (_v0, spec, editor_) {
		var name = _v0.a;
		var command = _v0.b;
		if (command.$ === 1) {
			var action = command.a;
			return A2($author$project$RichText$Internal$Editor$applyInternalCommand, action, editor_);
		} else {
			var transform = command.a;
			var _v2 = A2(
				$elm$core$Result$andThen,
				$author$project$RichText$State$validate(spec),
				transform(
					$author$project$RichText$Internal$Editor$state(editor_)));
			if (_v2.$ === 1) {
				var s = _v2.a;
				return $elm$core$Result$Err(s);
			} else {
				var v = _v2.a;
				var reducedState = $author$project$RichText$State$reduce(v);
				return $elm$core$Result$Ok(
					A3($author$project$RichText$Internal$Editor$updateEditorState, name, reducedState, editor_));
			}
		}
	});
var $author$project$RichText$Editor$applyNoForceSelection = $author$project$RichText$Internal$Editor$applyCommandNoForceSelection;
var $author$project$RichText$Model$Attribute$replaceOrAddStringAttribute = F3(
	function (name, value, attributes) {
		var _v0 = A2($author$project$RichText$Model$Attribute$findStringAttribute, name, attributes);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$List$cons,
				A2($author$project$RichText$Model$Attribute$StringAttribute, name, value),
				attributes);
		} else {
			return A2(
				$elm$core$List$map,
				function (x) {
					if (!x.$) {
						var k = x.a;
						var v = x.b;
						return _Utils_eq(k, name) ? A2($author$project$RichText$Model$Attribute$StringAttribute, name, value) : x;
					} else {
						return x;
					}
				},
				attributes);
		}
	});
var $author$project$RichText$Internal$Definitions$elementWithAttributes = F2(
	function (attrs, parameters) {
		var c = parameters;
		return _Utils_update(
			c,
			{H: attrs});
	});
var $author$project$RichText$Model$Element$withAttributes = $author$project$RichText$Internal$Definitions$elementWithAttributes;
var $author$project$Page$SpecExtension$updateCaptionedImageText = F3(
	function (path, value, state) {
		var r = $author$project$RichText$Model$State$root(state);
		var _v0 = A2(
			$author$project$RichText$Node$nodeAt,
			path,
			$author$project$RichText$Model$State$root(state));
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('There is no node at the given path');
		} else {
			var node = _v0.a;
			if (node.$ === 1) {
				return $elm$core$Result$Err('I can only update captioned images, but I received an inline node');
			} else {
				var bn = node.a;
				var ep = $author$project$RichText$Model$Node$element(bn);
				var attributes = $author$project$RichText$Model$Element$attributes(ep);
				var newAttributes = A3($author$project$RichText$Model$Attribute$replaceOrAddStringAttribute, 'caption', value, attributes);
				var newElementParameters = A2($author$project$RichText$Model$Element$withAttributes, newAttributes, ep);
				var newBlockNode = A2($author$project$RichText$Model$Node$withElement, newElementParameters, bn);
				if ($author$project$RichText$Model$Element$name(ep) !== 'captioned_image') {
					return $elm$core$Result$Err('I received a node that was not a captioned image');
				} else {
					var _v2 = A3(
						$author$project$RichText$Node$replace,
						path,
						$author$project$RichText$Node$Block(newBlockNode),
						r);
					if (_v2.$ === 1) {
						var s = _v2.a;
						return $elm$core$Result$Err(s);
					} else {
						var newRoot = _v2.a;
						return $elm$core$Result$Ok(
							A2($author$project$RichText$Model$State$withRoot, newRoot, state));
					}
				}
			}
		}
	});
var $author$project$Page$SpecExtension$handleCaptionedImageText = F3(
	function (path, value, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$applyNoForceSelection,
						_Utils_Tuple2(
							'updateCaptionedImageText',
							$author$project$RichText$Config$Command$transform(
								A2($author$project$Page$SpecExtension$updateCaptionedImageText, path, value))),
						$author$project$Page$SpecExtension$customSpec,
						model.a))
			});
	});
var $author$project$Page$SpecExtension$handleInsertCaptionedImage = F2(
	function (spec, model) {
		var insertImageModal = model.m;
		var newEditor = function () {
			var _v0 = insertImageModal.bs;
			if (_v0.$ === 1) {
				return model.a.a;
			} else {
				var state_ = _v0.a;
				var params = A2(
					$author$project$RichText$Model$Element$element,
					$author$project$Page$SpecExtension$captionedImage,
					_List_fromArray(
						[
							A2($author$project$RichText$Model$Attribute$StringAttribute, 'src', insertImageModal.b6),
							A2($author$project$RichText$Model$Attribute$StringAttribute, 'alt', insertImageModal.bl),
							A2($author$project$RichText$Model$Attribute$StringAttribute, 'caption', insertImageModal.ah)
						]));
				var img = A2($author$project$RichText$Model$Node$block, params, $author$project$RichText$Model$Node$Leaf);
				return A2(
					$elm$core$Result$withDefault,
					model.a.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'insertImage',
							$author$project$RichText$Config$Command$transform(
								$author$project$Editor$setResult(
									A2($author$project$RichText$Commands$insertBlock, img, state_)))),
						spec,
						model.a.a));
			}
		}();
		var editor = model.a;
		return _Utils_update(
			model,
			{
				a: _Utils_update(
					editor,
					{a: newEditor}),
				m: _Utils_update(
					insertImageModal,
					{bl: '', ah: '', bs: $elm$core$Maybe$Nothing, b6: '', aT: false})
			});
	});
var $author$project$Page$SpecExtension$handleShowInsertCaptionedImageModal = function (model) {
	var insertImageModal = model.m;
	return _Utils_update(
		model,
		{
			m: _Utils_update(
				insertImageModal,
				{
					bs: $elm$core$Maybe$Just(
						$author$project$RichText$Editor$state(model.a.a)),
					aT: true
				})
		});
};
var $author$project$Page$SpecExtension$handleUpdateCaption = F2(
	function (caption, model) {
		var insertImageModal = model.m;
		return _Utils_update(
			model,
			{
				m: _Utils_update(
					insertImageModal,
					{ah: caption})
			});
	});
var $author$project$Page$SpecExtension$handleUpdateCaptionedImageAlt = F2(
	function (alt, model) {
		var insertImageModal = model.m;
		return _Utils_update(
			model,
			{
				m: _Utils_update(
					insertImageModal,
					{bl: alt})
			});
	});
var $author$project$Page$SpecExtension$handleUpdateCaptionedImageSrc = F2(
	function (src, model) {
		var insertImageModal = model.m;
		return _Utils_update(
			model,
			{
				m: _Utils_update(
					insertImageModal,
					{b6: src})
			});
	});
var $author$project$Page$SpecExtension$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 5:
				var editorMsg = msg.a;
				if (editorMsg.$ === 16) {
					var path = editorMsg.a;
					var s = editorMsg.b;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a: A3($author$project$Page$SpecExtension$handleCaptionedImageText, path, s, model.a)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var _v2 = A3($author$project$Editor$update, $author$project$Page$SpecExtension$config, editorMsg, model.a);
					var e = _v2.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a: e}),
						$elm$core$Platform$Cmd$none);
				}
			case 0:
				return _Utils_Tuple2(
					$author$project$Page$SpecExtension$handleShowInsertCaptionedImageModal(model),
					$elm$core$Platform$Cmd$none);
			case 1:
				var s = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Page$SpecExtension$handleUpdateCaptionedImageSrc, s, model),
					$elm$core$Platform$Cmd$none);
			case 2:
				var s = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Page$SpecExtension$handleUpdateCaptionedImageAlt, s, model),
					$elm$core$Platform$Cmd$none);
			case 3:
				var s = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Page$SpecExtension$handleUpdateCaption, s, model),
					$elm$core$Platform$Cmd$none);
			case 4:
				return _Utils_Tuple2(
					A2($author$project$Page$SpecExtension$handleInsertCaptionedImage, $author$project$Page$SpecExtension$customSpec, model),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Page$SpecFromScratch$InternalMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$SpecFromScratch$commandBindings = $author$project$RichText$Commands$defaultCommandMap;
var $author$project$Page$SpecFromScratch$ToggleCheckedTodoItem = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Page$SpecFromScratch$toggleCheckboxDecoration = F3(
	function (editorNodePath, elementParameters, p) {
		var checked = A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$author$project$RichText$Model$Attribute$findBoolAttribute,
				'checked',
				$author$project$RichText$Model$Element$attributes(elementParameters)));
		return _Utils_eq(
			p,
			_List_fromArray(
				[0, 0])) ? _List_fromArray(
			[
				$elm$html$Html$Events$onClick(
				A2($author$project$Page$SpecFromScratch$ToggleCheckedTodoItem, editorNodePath, !checked))
			]) : _List_Nil;
	});
var $author$project$Page$SpecFromScratch$decorations = A2(
	$author$project$RichText$Config$Decorations$withTopLevelAttributes,
	_List_fromArray(
		[
			A2($elm$html$Html$Attributes$attribute, 'data-gramm_editor', 'false')
		]),
	A3($author$project$RichText$Config$Decorations$addElementDecoration, $author$project$Page$SpecFromScratch$item, $author$project$Page$SpecFromScratch$toggleCheckboxDecoration, $author$project$RichText$Config$Decorations$emptyDecorations));
var $author$project$Page$SpecFromScratch$todoSpec = A2(
	$author$project$RichText$Config$Spec$withElementDefinitions,
	_List_fromArray(
		[$author$project$Page$SpecFromScratch$todoList, $author$project$Page$SpecFromScratch$item, $author$project$RichText$Definitions$hardBreak]),
	$author$project$RichText$Config$Spec$emptySpec);
var $author$project$Page$SpecFromScratch$config = $author$project$RichText$Editor$config(
	{cr: $author$project$Page$SpecFromScratch$commandBindings, cx: $author$project$Page$SpecFromScratch$decorations, c4: $author$project$Page$SpecFromScratch$todoSpec, c7: $author$project$Page$SpecFromScratch$InternalMsg});
var $author$project$RichText$Model$Attribute$replaceOrAddBoolAttribute = F3(
	function (name, value, attributes) {
		var _v0 = A2($author$project$RichText$Model$Attribute$findStringAttribute, name, attributes);
		if (_v0.$ === 1) {
			return A2(
				$elm$core$List$cons,
				A2($author$project$RichText$Model$Attribute$BoolAttribute, name, value),
				attributes);
		} else {
			return A2(
				$elm$core$List$map,
				function (x) {
					if (x.$ === 2) {
						var k = x.a;
						var v = x.b;
						return _Utils_eq(k, name) ? A2($author$project$RichText$Model$Attribute$BoolAttribute, name, value) : x;
					} else {
						return x;
					}
				},
				attributes);
		}
	});
var $author$project$Page$SpecFromScratch$updateTodoListItem = F3(
	function (path, value, state) {
		var r = $author$project$RichText$Model$State$root(state);
		var _v0 = A2(
			$author$project$RichText$Node$nodeAt,
			path,
			$author$project$RichText$Model$State$root(state));
		if (_v0.$ === 1) {
			return $elm$core$Result$Err('There is no node at the given path');
		} else {
			var node = _v0.a;
			if (node.$ === 1) {
				return $elm$core$Result$Err('I can only update todo item, but I received an inline node');
			} else {
				var bn = node.a;
				var ep = $author$project$RichText$Model$Node$element(bn);
				var attributes = $author$project$RichText$Model$Element$attributes(ep);
				var newAttributes = A3($author$project$RichText$Model$Attribute$replaceOrAddBoolAttribute, 'checked', value, attributes);
				var newElementParameters = A2($author$project$RichText$Model$Element$withAttributes, newAttributes, ep);
				var newBlockNode = A2($author$project$RichText$Model$Node$withElement, newElementParameters, bn);
				if ($author$project$RichText$Model$Element$name(ep) !== 'todo_item') {
					return $elm$core$Result$Err('I received a node that was not a todo item');
				} else {
					var _v2 = A3(
						$author$project$RichText$Node$replace,
						path,
						$author$project$RichText$Node$Block(newBlockNode),
						r);
					if (_v2.$ === 1) {
						var s = _v2.a;
						return $elm$core$Result$Err(s);
					} else {
						var newRoot = _v2.a;
						return $elm$core$Result$Ok(
							A2($author$project$RichText$Model$State$withRoot, newRoot, state));
					}
				}
			}
		}
	});
var $author$project$Page$SpecFromScratch$handleTodoListChecked = F3(
	function (path, value, model) {
		return _Utils_update(
			model,
			{
				a: A2(
					$elm$core$Result$withDefault,
					model.a,
					A3(
						$author$project$RichText$Editor$apply,
						_Utils_Tuple2(
							'updateTodoListItem',
							$author$project$RichText$Config$Command$transform(
								A2($author$project$Page$SpecFromScratch$updateTodoListItem, path, value))),
						$author$project$Page$SpecFromScratch$todoSpec,
						model.a))
			});
	});
var $author$project$Page$SpecFromScratch$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 0:
				var editorMsg = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a: A3($author$project$RichText$Editor$update, $author$project$Page$SpecFromScratch$config, editorMsg, model.a)
						}),
					$elm$core$Platform$Cmd$none);
			case 1:
				var path = msg.a;
				var value = msg.b;
				return _Utils_Tuple2(
					A3($author$project$Page$SpecFromScratch$handleTodoListChecked, path, value, model),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		var _v0 = _Utils_Tuple2(msg, model);
		_v0$7:
		while (true) {
			switch (_v0.a.$) {
				case 1:
					var urlRequest = _v0.a.a;
					if (!urlRequest.$) {
						var url = urlRequest.a;
						var _v2 = url.cD;
						if (_v2.$ === 1) {
							return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
						} else {
							return _Utils_Tuple2(
								model,
								A2(
									$elm$browser$Browser$Navigation$pushUrl,
									$author$project$Session$navKey(
										$author$project$Main$toSession(model)),
									$elm$url$Url$toString(url)));
						}
					} else {
						var href = urlRequest.a;
						return _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(href));
					}
				case 0:
					var url = _v0.a.a;
					return A2(
						$author$project$Main$changeRouteTo,
						$author$project$Route$fromUrl(url),
						model);
				case 7:
					if (_v0.b.$ === 6) {
						var subMsg = _v0.a.a;
						var home = _v0.b.a;
						return A4(
							$author$project$Main$updateWith,
							$author$project$Main$Home,
							$author$project$Main$GotHomeMsg,
							model,
							A2($author$project$Page$Home$update, subMsg, home));
					} else {
						break _v0$7;
					}
				case 3:
					if (_v0.b.$ === 5) {
						var subMsg = _v0.a.a;
						var md = _v0.b.a;
						return A4(
							$author$project$Main$updateWith,
							$author$project$Main$Markdown,
							$author$project$Main$GotMarkdownMsg,
							model,
							A2($author$project$Page$Markdown$update, subMsg, md));
					} else {
						break _v0$7;
					}
				case 2:
					if (_v0.b.$ === 2) {
						var subMsg = _v0.a.a;
						var basic = _v0.b.a;
						return A4(
							$author$project$Main$updateWith,
							$author$project$Main$Basic,
							$author$project$Main$GotBasicMsg,
							model,
							A2($author$project$Page$Basic$update, subMsg, basic));
					} else {
						break _v0$7;
					}
				case 4:
					if (_v0.b.$ === 3) {
						var subMsg = _v0.a.a;
						var md = _v0.b.a;
						return A4(
							$author$project$Main$updateWith,
							$author$project$Main$SpecExtension,
							$author$project$Main$GotSpecExtensionMsg,
							model,
							A2($author$project$Page$SpecExtension$update, subMsg, md));
					} else {
						break _v0$7;
					}
				case 5:
					if (_v0.b.$ === 4) {
						var subMsg = _v0.a.a;
						var basic = _v0.b.a;
						return A4(
							$author$project$Main$updateWith,
							$author$project$Main$SpecFromScratch,
							$author$project$Main$GotSpecFromScratchMsg,
							model,
							A2($author$project$Page$SpecFromScratch$update, subMsg, basic));
					} else {
						break _v0$7;
					}
				default:
					break _v0$7;
			}
		}
		return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
	});
var $author$project$Page$Basic = 0;
var $author$project$Page$Examples = 5;
var $author$project$Page$Home = 4;
var $author$project$Page$Markdown = 1;
var $author$project$Page$SpecExtension = 2;
var $author$project$Page$SpecFromScratch = 3;
var $elm$virtual_dom$VirtualDom$map = _VirtualDom_map;
var $elm$html$Html$map = $elm$virtual_dom$VirtualDom$map;
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Page$Home$notFoundView = {
	cs: _List_fromArray(
		[
			A2(
			$elm$html$Html$p,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('not-found')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('I\'m sorry, I couldn\'t find the content you were looking for.')
				]))
		]),
	ca: 'Not found'
};
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$node = $elm$virtual_dom$VirtualDom$node;
var $lattyware$elm_fontawesome$FontAwesome$Styles$css = A3(
	$elm$html$Html$node,
	'style',
	_List_Nil,
	_List_fromArray(
		[
			$elm$html$Html$text(':root, :host {  --fa-font-solid: normal 900 1em/1 \"Font Awesome 6 Solid\";  --fa-font-regular: normal 400 1em/1 \"Font Awesome 6 Regular\";  --fa-font-light: normal 300 1em/1 \"Font Awesome 6 Light\";  --fa-font-thin: normal 100 1em/1 \"Font Awesome 6 Thin\";  --fa-font-duotone: normal 900 1em/1 \"Font Awesome 6 Duotone\";  --fa-font-sharp-solid: normal 900 1em/1 \"Font Awesome 6 Sharp\";  --fa-font-sharp-regular: normal 400 1em/1 \"Font Awesome 6 Sharp\";  --fa-font-sharp-light: normal 300 1em/1 \"Font Awesome 6 Sharp\";  --fa-font-sharp-thin: normal 100 1em/1 \"Font Awesome 6 Sharp\";  --fa-font-brands: normal 400 1em/1 \"Font Awesome 6 Brands\";}svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {  overflow: visible;  box-sizing: content-box;}.svg-inline--fa {  display: var(--fa-display, inline-block);  height: 1em;  overflow: visible;  vertical-align: -0.125em;}.svg-inline--fa.fa-2xs {  vertical-align: 0.1em;}.svg-inline--fa.fa-xs {  vertical-align: 0em;}.svg-inline--fa.fa-sm {  vertical-align: -0.0714285705em;}.svg-inline--fa.fa-lg {  vertical-align: -0.2em;}.svg-inline--fa.fa-xl {  vertical-align: -0.25em;}.svg-inline--fa.fa-2xl {  vertical-align: -0.3125em;}.svg-inline--fa.fa-pull-left {  margin-right: var(--fa-pull-margin, 0.3em);  width: auto;}.svg-inline--fa.fa-pull-right {  margin-left: var(--fa-pull-margin, 0.3em);  width: auto;}.svg-inline--fa.fa-li {  width: var(--fa-li-width, 2em);  top: 0.25em;}.svg-inline--fa.fa-fw {  width: var(--fa-fw-width, 1.25em);}.fa-layers svg.svg-inline--fa {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;}.fa-layers-counter, .fa-layers-text {  display: inline-block;  position: absolute;  text-align: center;}.fa-layers {  display: inline-block;  height: 1em;  position: relative;  text-align: center;  vertical-align: -0.125em;  width: 1em;}.fa-layers svg.svg-inline--fa {  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-text {  left: 50%;  top: 50%;  -webkit-transform: translate(-50%, -50%);          transform: translate(-50%, -50%);  -webkit-transform-origin: center center;          transform-origin: center center;}.fa-layers-counter {  background-color: var(--fa-counter-background-color, #ff253a);  border-radius: var(--fa-counter-border-radius, 1em);  box-sizing: border-box;  color: var(--fa-inverse, #fff);  line-height: var(--fa-counter-line-height, 1);  max-width: var(--fa-counter-max-width, 5em);  min-width: var(--fa-counter-min-width, 1.5em);  overflow: hidden;  padding: var(--fa-counter-padding, 0.25em 0.5em);  right: var(--fa-right, 0);  text-overflow: ellipsis;  top: var(--fa-top, 0);  -webkit-transform: scale(var(--fa-counter-scale, 0.25));          transform: scale(var(--fa-counter-scale, 0.25));  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-bottom-right {  bottom: var(--fa-bottom, 0);  right: var(--fa-right, 0);  top: auto;  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: bottom right;          transform-origin: bottom right;}.fa-layers-bottom-left {  bottom: var(--fa-bottom, 0);  left: var(--fa-left, 0);  right: auto;  top: auto;  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: bottom left;          transform-origin: bottom left;}.fa-layers-top-right {  top: var(--fa-top, 0);  right: var(--fa-right, 0);  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: top right;          transform-origin: top right;}.fa-layers-top-left {  left: var(--fa-left, 0);  right: auto;  top: var(--fa-top, 0);  -webkit-transform: scale(var(--fa-layers-scale, 0.25));          transform: scale(var(--fa-layers-scale, 0.25));  -webkit-transform-origin: top left;          transform-origin: top left;}.fa-1x {  font-size: 1em;}.fa-2x {  font-size: 2em;}.fa-3x {  font-size: 3em;}.fa-4x {  font-size: 4em;}.fa-5x {  font-size: 5em;}.fa-6x {  font-size: 6em;}.fa-7x {  font-size: 7em;}.fa-8x {  font-size: 8em;}.fa-9x {  font-size: 9em;}.fa-10x {  font-size: 10em;}.fa-2xs {  font-size: 0.625em;  line-height: 0.1em;  vertical-align: 0.225em;}.fa-xs {  font-size: 0.75em;  line-height: 0.0833333337em;  vertical-align: 0.125em;}.fa-sm {  font-size: 0.875em;  line-height: 0.0714285718em;  vertical-align: 0.0535714295em;}.fa-lg {  font-size: 1.25em;  line-height: 0.05em;  vertical-align: -0.075em;}.fa-xl {  font-size: 1.5em;  line-height: 0.0416666682em;  vertical-align: -0.125em;}.fa-2xl {  font-size: 2em;  line-height: 0.03125em;  vertical-align: -0.1875em;}.fa-fw {  text-align: center;  width: 1.25em;}.fa-ul {  list-style-type: none;  margin-left: var(--fa-li-margin, 2.5em);  padding-left: 0;}.fa-ul > li {  position: relative;}.fa-li {  left: calc(var(--fa-li-width, 2em) * -1);  position: absolute;  text-align: center;  width: var(--fa-li-width, 2em);  line-height: inherit;}.fa-border {  border-color: var(--fa-border-color, #eee);  border-radius: var(--fa-border-radius, 0.1em);  border-style: var(--fa-border-style, solid);  border-width: var(--fa-border-width, 0.08em);  padding: var(--fa-border-padding, 0.2em 0.25em 0.15em);}.fa-pull-left {  float: left;  margin-right: var(--fa-pull-margin, 0.3em);}.fa-pull-right {  float: right;  margin-left: var(--fa-pull-margin, 0.3em);}.fa-beat {  -webkit-animation-name: fa-beat;          animation-name: fa-beat;  -webkit-animation-delay: var(--fa-animation-delay, 0s);          animation-delay: var(--fa-animation-delay, 0s);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);          animation-timing-function: var(--fa-animation-timing, ease-in-out);}.fa-bounce {  -webkit-animation-name: fa-bounce;          animation-name: fa-bounce;  -webkit-animation-delay: var(--fa-animation-delay, 0s);          animation-delay: var(--fa-animation-delay, 0s);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));}.fa-fade {  -webkit-animation-name: fa-fade;          animation-name: fa-fade;  -webkit-animation-delay: var(--fa-animation-delay, 0s);          animation-delay: var(--fa-animation-delay, 0s);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));}.fa-beat-fade {  -webkit-animation-name: fa-beat-fade;          animation-name: fa-beat-fade;  -webkit-animation-delay: var(--fa-animation-delay, 0s);          animation-delay: var(--fa-animation-delay, 0s);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));          animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));}.fa-flip {  -webkit-animation-name: fa-flip;          animation-name: fa-flip;  -webkit-animation-delay: var(--fa-animation-delay, 0s);          animation-delay: var(--fa-animation-delay, 0s);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, ease-in-out);          animation-timing-function: var(--fa-animation-timing, ease-in-out);}.fa-shake {  -webkit-animation-name: fa-shake;          animation-name: fa-shake;  -webkit-animation-delay: var(--fa-animation-delay, 0s);          animation-delay: var(--fa-animation-delay, 0s);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, linear);          animation-timing-function: var(--fa-animation-timing, linear);}.fa-spin {  -webkit-animation-name: fa-spin;          animation-name: fa-spin;  -webkit-animation-delay: var(--fa-animation-delay, 0s);          animation-delay: var(--fa-animation-delay, 0s);  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 2s);          animation-duration: var(--fa-animation-duration, 2s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, linear);          animation-timing-function: var(--fa-animation-timing, linear);}.fa-spin-reverse {  --fa-animation-direction: reverse;}.fa-pulse,.fa-spin-pulse {  -webkit-animation-name: fa-spin;          animation-name: fa-spin;  -webkit-animation-direction: var(--fa-animation-direction, normal);          animation-direction: var(--fa-animation-direction, normal);  -webkit-animation-duration: var(--fa-animation-duration, 1s);          animation-duration: var(--fa-animation-duration, 1s);  -webkit-animation-iteration-count: var(--fa-animation-iteration-count, infinite);          animation-iteration-count: var(--fa-animation-iteration-count, infinite);  -webkit-animation-timing-function: var(--fa-animation-timing, steps(8));          animation-timing-function: var(--fa-animation-timing, steps(8));}@media (prefers-reduced-motion: reduce) {  .fa-beat,.fa-bounce,.fa-fade,.fa-beat-fade,.fa-flip,.fa-pulse,.fa-shake,.fa-spin,.fa-spin-pulse {    -webkit-animation-delay: -1ms;            animation-delay: -1ms;    -webkit-animation-duration: 1ms;            animation-duration: 1ms;    -webkit-animation-iteration-count: 1;            animation-iteration-count: 1;    -webkit-transition-delay: 0s;            transition-delay: 0s;    -webkit-transition-duration: 0s;            transition-duration: 0s;  }}@-webkit-keyframes fa-beat {  0%, 90% {    -webkit-transform: scale(1);            transform: scale(1);  }  45% {    -webkit-transform: scale(var(--fa-beat-scale, 1.25));            transform: scale(var(--fa-beat-scale, 1.25));  }}@keyframes fa-beat {  0%, 90% {    -webkit-transform: scale(1);            transform: scale(1);  }  45% {    -webkit-transform: scale(var(--fa-beat-scale, 1.25));            transform: scale(var(--fa-beat-scale, 1.25));  }}@-webkit-keyframes fa-bounce {  0% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  10% {    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);  }  30% {    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));  }  50% {    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);  }  57% {    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));  }  64% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  100% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }}@keyframes fa-bounce {  0% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  10% {    -webkit-transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);            transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);  }  30% {    -webkit-transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));            transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));  }  50% {    -webkit-transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);            transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);  }  57% {    -webkit-transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));            transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));  }  64% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }  100% {    -webkit-transform: scale(1, 1) translateY(0);            transform: scale(1, 1) translateY(0);  }}@-webkit-keyframes fa-fade {  50% {    opacity: var(--fa-fade-opacity, 0.4);  }}@keyframes fa-fade {  50% {    opacity: var(--fa-fade-opacity, 0.4);  }}@-webkit-keyframes fa-beat-fade {  0%, 100% {    opacity: var(--fa-beat-fade-opacity, 0.4);    -webkit-transform: scale(1);            transform: scale(1);  }  50% {    opacity: 1;    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));            transform: scale(var(--fa-beat-fade-scale, 1.125));  }}@keyframes fa-beat-fade {  0%, 100% {    opacity: var(--fa-beat-fade-opacity, 0.4);    -webkit-transform: scale(1);            transform: scale(1);  }  50% {    opacity: 1;    -webkit-transform: scale(var(--fa-beat-fade-scale, 1.125));            transform: scale(var(--fa-beat-fade-scale, 1.125));  }}@-webkit-keyframes fa-flip {  50% {    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));  }}@keyframes fa-flip {  50% {    -webkit-transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));            transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));  }}@-webkit-keyframes fa-shake {  0% {    -webkit-transform: rotate(-15deg);            transform: rotate(-15deg);  }  4% {    -webkit-transform: rotate(15deg);            transform: rotate(15deg);  }  8%, 24% {    -webkit-transform: rotate(-18deg);            transform: rotate(-18deg);  }  12%, 28% {    -webkit-transform: rotate(18deg);            transform: rotate(18deg);  }  16% {    -webkit-transform: rotate(-22deg);            transform: rotate(-22deg);  }  20% {    -webkit-transform: rotate(22deg);            transform: rotate(22deg);  }  32% {    -webkit-transform: rotate(-12deg);            transform: rotate(-12deg);  }  36% {    -webkit-transform: rotate(12deg);            transform: rotate(12deg);  }  40%, 100% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }}@keyframes fa-shake {  0% {    -webkit-transform: rotate(-15deg);            transform: rotate(-15deg);  }  4% {    -webkit-transform: rotate(15deg);            transform: rotate(15deg);  }  8%, 24% {    -webkit-transform: rotate(-18deg);            transform: rotate(-18deg);  }  12%, 28% {    -webkit-transform: rotate(18deg);            transform: rotate(18deg);  }  16% {    -webkit-transform: rotate(-22deg);            transform: rotate(-22deg);  }  20% {    -webkit-transform: rotate(22deg);            transform: rotate(22deg);  }  32% {    -webkit-transform: rotate(-12deg);            transform: rotate(-12deg);  }  36% {    -webkit-transform: rotate(12deg);            transform: rotate(12deg);  }  40%, 100% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }}@-webkit-keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}@keyframes fa-spin {  0% {    -webkit-transform: rotate(0deg);            transform: rotate(0deg);  }  100% {    -webkit-transform: rotate(360deg);            transform: rotate(360deg);  }}.fa-rotate-90 {  -webkit-transform: rotate(90deg);          transform: rotate(90deg);}.fa-rotate-180 {  -webkit-transform: rotate(180deg);          transform: rotate(180deg);}.fa-rotate-270 {  -webkit-transform: rotate(270deg);          transform: rotate(270deg);}.fa-flip-horizontal {  -webkit-transform: scale(-1, 1);          transform: scale(-1, 1);}.fa-flip-vertical {  -webkit-transform: scale(1, -1);          transform: scale(1, -1);}.fa-flip-both,.fa-flip-horizontal.fa-flip-vertical {  -webkit-transform: scale(-1, -1);          transform: scale(-1, -1);}.fa-rotate-by {  -webkit-transform: rotate(var(--fa-rotate-angle, 0));          transform: rotate(var(--fa-rotate-angle, 0));}.fa-stack {  display: inline-block;  vertical-align: middle;  height: 2em;  position: relative;  width: 2.5em;}.fa-stack-1x,.fa-stack-2x {  bottom: 0;  left: 0;  margin: auto;  position: absolute;  right: 0;  top: 0;  z-index: var(--fa-stack-z-index, auto);}.svg-inline--fa.fa-stack-1x {  height: 1em;  width: 1.25em;}.svg-inline--fa.fa-stack-2x {  height: 2em;  width: 2.5em;}.fa-inverse {  color: var(--fa-inverse, #fff);}.sr-only,.fa-sr-only {  position: absolute;  width: 1px;  height: 1px;  padding: 0;  margin: -1px;  overflow: hidden;  clip: rect(0, 0, 0, 0);  white-space: nowrap;  border-width: 0;}.sr-only-focusable:not(:focus),.fa-sr-only-focusable:not(:focus) {  position: absolute;  width: 1px;  height: 1px;  padding: 0;  margin: -1px;  overflow: hidden;  clip: rect(0, 0, 0, 0);  white-space: nowrap;  border-width: 0;}.svg-inline--fa .fa-primary {  fill: var(--fa-primary-color, currentColor);  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa .fa-secondary {  fill: var(--fa-secondary-color, currentColor);  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-primary {  opacity: var(--fa-secondary-opacity, 0.4);}.svg-inline--fa.fa-swap-opacity .fa-secondary {  opacity: var(--fa-primary-opacity, 1);}.svg-inline--fa mask .fa-primary,.svg-inline--fa mask .fa-secondary {  fill: black;}.fad.fa-inverse,.fa-duotone.fa-inverse {  color: var(--fa-inverse, #fff);}')
		]));
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Page$fontAwesomeStyle = A2(
	$elm$html$Html$div,
	_List_Nil,
	_List_fromArray(
		[$lattyware$elm_fontawesome$FontAwesome$Styles$css]));
var $elm$html$Html$article = _VirtualDom_node('article');
var $author$project$Page$viewContent = function (content) {
	return A2($elm$html$Html$article, _List_Nil, content);
};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$html$Html$footer = _VirtualDom_node('footer');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Page$viewFooter = A2(
	$elm$html$Html$footer,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('attribution')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('This is a demo for the '),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$href('https://github.com/wolfadex/elm-rte-toolkit')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(' Elm Rich Text Editor Toolkit')
								])),
							$elm$html$Html$text('. Code & design licensed under BSD-3-Clause License.')
						]))
				]))
		]));
var $elm$html$Html$header = _VirtualDom_node('header');
var $author$project$Route$routeToPieces = function (page) {
	switch (page) {
		case 4:
			return _List_Nil;
		case 0:
			return _List_fromArray(
				['examples', 'basic']);
		case 1:
			return _List_fromArray(
				['examples', 'markdown']);
		case 2:
			return _List_fromArray(
				['examples', 'spec-extension']);
		case 3:
			return _List_fromArray(
				['examples', 'spec-from-scratch']);
		default:
			return _List_fromArray(
				['examples']);
	}
};
var $author$project$Route$routeToString = function (page) {
	return '#/' + A2(
		$elm$core$String$join,
		'/',
		$author$project$Route$routeToPieces(page));
};
var $author$project$Route$href = function (targetRoute) {
	return $elm$html$Html$Attributes$href(
		$author$project$Route$routeToString(targetRoute));
};
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$Attributes$classList = function (classes) {
	return $elm$html$Html$Attributes$class(
		A2(
			$elm$core$String$join,
			' ',
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				A2($elm$core$List$filter, $elm$core$Tuple$second, classes))));
};
var $author$project$Page$isActive = F2(
	function (page, route) {
		var _v0 = _Utils_Tuple2(page, route);
		_v0$3:
		while (true) {
			switch (_v0.a) {
				case 4:
					if (_v0.b === 4) {
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return true;
					} else {
						break _v0$3;
					}
				case 0:
					if (!_v0.b) {
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						return true;
					} else {
						break _v0$3;
					}
				case 1:
					if (_v0.b === 1) {
						var _v5 = _v0.a;
						var _v6 = _v0.b;
						return true;
					} else {
						break _v0$3;
					}
				default:
					break _v0$3;
			}
		}
		return false;
	});
var $author$project$Page$navbarLink = F3(
	function (page, route, linkContent) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('nav-link', true),
							_Utils_Tuple2(
							'active',
							A2($author$project$Page$isActive, page, route))
						])),
					$author$project$Route$href(route)
				]),
			linkContent);
	});
var $author$project$Page$navbarExternalLink = F2(
	function (href, linkContent) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-link'),
					$elm$html$Html$Attributes$href(href)
				]),
			linkContent);
	});
var $author$project$Page$viewMenu = function (page) {
	var linkTo = $author$project$Page$navbarLink(page);
	return _List_fromArray(
		[
			A2(
			linkTo,
			5,
			_List_fromArray(
				[
					$elm$html$Html$text('Examples')
				])),
			A2(
			$author$project$Page$navbarExternalLink,
			'https://github.com/wolfadex/elm-rte-toolkit',
			_List_fromArray(
				[
					$elm$html$Html$text('Github')
				]))
		]);
};
var $author$project$Page$viewHeader = function (page) {
	return A2(
		$elm$html$Html$header,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$nav,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('logo'),
								$author$project$Route$href(4)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Rich Text Editor Toolkit')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-links')
							]),
						A2(
							$elm$core$List$cons,
							A3(
								$author$project$Page$navbarLink,
								page,
								4,
								_List_fromArray(
									[
										$elm$html$Html$text('Home')
									])),
							$author$project$Page$viewMenu(page)))
					]))
			]));
};
var $author$project$Page$view = F2(
	function (page, _v0) {
		var title = _v0.ca;
		var content = _v0.cs;
		return {
			bn: A2(
				$elm$core$List$cons,
				$author$project$Page$fontAwesomeStyle,
				A2(
					$elm$core$List$cons,
					$author$project$Page$viewHeader(page),
					A2(
						$elm$core$List$cons,
						$author$project$Page$viewContent(content),
						_List_fromArray(
							[$author$project$Page$viewFooter])))),
			ca: title
		};
	});
var $author$project$Page$Basic$EditorMsg = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Links$rteToolkit = 'https://github.com/wolfadex/elm-rte-toolkit';
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Controls$Disabled = 2;
var $author$project$Controls$Enabled = 1;
var $author$project$RichText$List$Unordered = 1;
var $elm$svg$Svg$Attributes$class = _VirtualDom_attribute('class');
var $elm$svg$Svg$Attributes$id = _VirtualDom_attribute('id');
var $elm$virtual_dom$VirtualDom$mapAttribute = _VirtualDom_mapAttribute;
var $elm$html$Html$Attributes$map = $elm$virtual_dom$VirtualDom$mapAttribute;
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$text = $elm$virtual_dom$VirtualDom$text;
var $elm$svg$Svg$title = $elm$svg$Svg$trustedNode('title');
var $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions = function (_v1) {
	var icon = _v1.bE;
	var outer = _v1.a4;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.c2,
		A2($elm$core$Maybe$map, $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal, outer));
};
var $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensionsInternal = function (_v0) {
	var icon = _v0.bE;
	var outer = _v0.a4;
	return A2(
		$elm$core$Maybe$withDefault,
		icon.c2,
		A2($elm$core$Maybe$map, $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions, outer));
};
var $elm$svg$Svg$defs = $elm$svg$Svg$trustedNode('defs');
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $lattyware$elm_fontawesome$FontAwesome$Svg$fill = _List_fromArray(
	[
		$elm$svg$Svg$Attributes$x('0'),
		$elm$svg$Svg$Attributes$y('0'),
		$elm$svg$Svg$Attributes$width('100%'),
		$elm$svg$Svg$Attributes$height('100%')
	]);
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$g = $elm$svg$Svg$trustedNode('g');
var $elm$svg$Svg$mask = $elm$svg$Svg$trustedNode('mask');
var $elm$svg$Svg$Attributes$mask = _VirtualDom_attribute('mask');
var $elm$svg$Svg$Attributes$maskContentUnits = _VirtualDom_attribute('maskContentUnits');
var $elm$svg$Svg$Attributes$maskUnits = _VirtualDom_attribute('maskUnits');
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add = F2(
	function (transform, combined) {
		switch (transform.$) {
			case 0:
				var by = transform.a;
				return _Utils_update(
					combined,
					{c2: combined.c2 + by});
			case 1:
				var axis = transform.a;
				var by = transform.b;
				var _v1 = function () {
					if (!axis) {
						return _Utils_Tuple2(0, by);
					} else {
						return _Utils_Tuple2(by, 0);
					}
				}();
				var x = _v1.a;
				var y = _v1.b;
				return _Utils_update(
					combined,
					{cf: combined.cf + x, cg: combined.cg + y});
			case 2:
				var rotation = transform.a;
				return _Utils_update(
					combined,
					{c$: combined.c$ + rotation});
			default:
				var axis = transform.a;
				if (!axis) {
					return _Utils_update(
						combined,
						{cC: !combined.cC});
				} else {
					return _Utils_update(
						combined,
						{cB: !combined.cB});
				}
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize = 16;
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform = {cB: false, cC: false, c$: 0, c2: $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize, cf: 0, cg: 0};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine = function (transforms) {
	return A3($elm$core$List$foldl, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$add, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform, transforms);
};
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform = function (transforms) {
	var combined = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$combine(transforms);
	return _Utils_eq(combined, $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaninglessTransform) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(combined);
};
var $elm$svg$Svg$rect = $elm$svg$Svg$trustedNode('rect');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Attributes$transform = _VirtualDom_attribute('transform');
var $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg = F3(
	function (containerWidth, iconWidth, transform) {
		var path = 'translate(' + ($elm$core$String$fromFloat((iconWidth / 2) * (-1)) + ' -256)');
		var outer = 'translate(' + ($elm$core$String$fromFloat(containerWidth / 2) + ' 256)');
		var innerTranslate = 'translate(' + ($elm$core$String$fromFloat(transform.cf * 32) + (',' + ($elm$core$String$fromFloat(transform.cg * 32) + ') ')));
		var innerRotate = 'rotate(' + ($elm$core$String$fromFloat(transform.c$) + ' 0 0)');
		var flipY = transform.cC ? (-1) : 1;
		var scaleY = (transform.c2 / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipY;
		var flipX = transform.cB ? (-1) : 1;
		var scaleX = (transform.c2 / $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$baseSize) * flipX;
		var innerScale = 'scale(' + ($elm$core$String$fromFloat(scaleX) + (', ' + ($elm$core$String$fromFloat(scaleY) + ') ')));
		return {
			bG: $elm$svg$Svg$Attributes$transform(
				_Utils_ap(
					innerTranslate,
					_Utils_ap(innerScale, innerRotate))),
			a4: $elm$svg$Svg$Attributes$transform(outer),
			cV: $elm$svg$Svg$Attributes$transform(path)
		};
	});
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewPath = F2(
	function (attrs, d) {
		return A2(
			$elm$svg$Svg$path,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$d(d),
				attrs),
			_List_Nil);
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewPaths = F2(
	function (attrs, _v0) {
		var paths = _v0.cW;
		if (paths.b.$ === 1) {
			var only = paths.a;
			var _v2 = paths.b;
			return A2($lattyware$elm_fontawesome$FontAwesome$Svg$viewPath, attrs, only);
		} else {
			var secondary = paths.a;
			var primary = paths.b.a;
			return A2(
				$elm$svg$Svg$g,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$class('fa-group')
					]),
				_List_fromArray(
					[
						A2(
						$lattyware$elm_fontawesome$FontAwesome$Svg$viewPath,
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$class('fa-secondary'),
							attrs),
						secondary),
						A2(
						$lattyware$elm_fontawesome$FontAwesome$Svg$viewPath,
						A2(
							$elm$core$List$cons,
							$elm$svg$Svg$Attributes$class('fa-primary'),
							attrs),
						primary)
					]));
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewWithTransform = F3(
	function (color, _v0, icon) {
		var outer = _v0.a4;
		var inner = _v0.bG;
		var path = _v0.cV;
		return A2(
			$elm$svg$Svg$g,
			_List_fromArray(
				[outer]),
			_List_fromArray(
				[
					A2(
					$elm$svg$Svg$g,
					_List_fromArray(
						[inner]),
					_List_fromArray(
						[
							A2(
							$lattyware$elm_fontawesome$FontAwesome$Svg$viewPaths,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$fill(color),
									path
								]),
							icon)
						]))
				]));
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewInColor = F2(
	function (color, fullIcon) {
		var icon = fullIcon.bE;
		var transforms = fullIcon.aR;
		var id = fullIcon.aX;
		var outer = fullIcon.a4;
		var combinedTransforms = $lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$meaningfulTransform(transforms);
		var _v0 = icon.c2;
		var width = _v0.a;
		var _v1 = $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions(fullIcon);
		var topLevelWidth = _v1.a;
		if (!combinedTransforms.$) {
			var meaningfulTransform = combinedTransforms.a;
			var svgTransform = A3($lattyware$elm_fontawesome$FontAwesome$Transforms$Internal$transformForSvg, topLevelWidth, width, meaningfulTransform);
			if (!outer.$) {
				var outerIcon = outer.a;
				return A4($lattyware$elm_fontawesome$FontAwesome$Svg$viewMaskedWithTransform, color, svgTransform, icon, outerIcon);
			} else {
				return A3($lattyware$elm_fontawesome$FontAwesome$Svg$viewWithTransform, color, svgTransform, icon);
			}
		} else {
			return A2(
				$lattyware$elm_fontawesome$FontAwesome$Svg$viewPaths,
				_List_fromArray(
					[
						$elm$svg$Svg$Attributes$fill(color)
					]),
				icon);
		}
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$viewMaskedWithTransform = F4(
	function (color, transforms, exclude, include) {
		var id = include.aX;
		var alwaysId = A2($elm$core$Maybe$withDefault, '', id);
		var clipId = 'clip-' + alwaysId;
		var maskId = 'mask-' + alwaysId;
		var maskTag = A2(
			$elm$svg$Svg$mask,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$id(maskId),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$maskUnits('userSpaceOnUse'),
					A2(
						$elm$core$List$cons,
						$elm$svg$Svg$Attributes$maskContentUnits('userSpaceOnUse'),
						$lattyware$elm_fontawesome$FontAwesome$Svg$fill))),
			_List_fromArray(
				[
					A2($lattyware$elm_fontawesome$FontAwesome$Svg$viewInColor, 'white', include),
					A3($lattyware$elm_fontawesome$FontAwesome$Svg$viewWithTransform, 'black', transforms, exclude)
				]));
		var defs = A2(
			$elm$svg$Svg$defs,
			_List_Nil,
			_List_fromArray(
				[maskTag]));
		var rect = A2(
			$elm$svg$Svg$rect,
			A2(
				$elm$core$List$cons,
				$elm$svg$Svg$Attributes$fill(color),
				A2(
					$elm$core$List$cons,
					$elm$svg$Svg$Attributes$mask('url(#' + (maskId + ')')),
					$lattyware$elm_fontawesome$FontAwesome$Svg$fill)),
			_List_Nil);
		return A2(
			$elm$svg$Svg$g,
			_List_Nil,
			_List_fromArray(
				[defs, rect]));
	});
var $lattyware$elm_fontawesome$FontAwesome$Svg$view = $lattyware$elm_fontawesome$FontAwesome$Svg$viewInColor('currentColor');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $lattyware$elm_fontawesome$FontAwesome$internalView = F2(
	function (fullIcon, extraAttributes) {
		var icon = fullIcon.bE;
		var transforms = fullIcon.aR;
		var role = fullIcon.a8;
		var id = fullIcon.aX;
		var title = fullIcon.ca;
		var outer = fullIcon.a4;
		var attributes = fullIcon.H;
		var contents = $lattyware$elm_fontawesome$FontAwesome$Svg$view(fullIcon);
		var _v0 = function () {
			if (!title.$) {
				var givenTitle = title.a;
				var titleId = A2($elm$core$Maybe$withDefault, '', id) + '-title';
				return _Utils_Tuple2(
					A2($elm$html$Html$Attributes$attribute, 'aria-labelledby', titleId),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$title,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$id(titleId)
								]),
							_List_fromArray(
								[
									$elm$svg$Svg$text(givenTitle)
								])),
							contents
						]));
			} else {
				return _Utils_Tuple2(
					A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
					_List_fromArray(
						[contents]));
			}
		}();
		var semantics = _v0.a;
		var potentiallyTitledContents = _v0.b;
		var _v2 = $lattyware$elm_fontawesome$FontAwesome$Internal$topLevelDimensions(fullIcon);
		var width = _v2.a;
		var height = _v2.b;
		var aspectRatio = $elm$core$Basics$ceiling((width / height) * 16);
		var classes = _List_fromArray(
			[
				'svg-inline--fa',
				'fa-' + icon.bM,
				'fa-w-' + $elm$core$String$fromInt(aspectRatio)
			]);
		return A2(
			$elm$svg$Svg$svg,
			$elm$core$List$concat(
				_List_fromArray(
					[
						_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'role', role),
							A2($elm$html$Html$Attributes$attribute, 'xmlns', 'http://www.w3.org/2000/svg'),
							$elm$svg$Svg$Attributes$viewBox(
							'0 0 ' + ($elm$core$String$fromInt(width) + (' ' + $elm$core$String$fromInt(height)))),
							semantics
						]),
						A2($elm$core$List$map, $elm$svg$Svg$Attributes$class, classes),
						A2(
						$elm$core$List$map,
						$elm$html$Html$Attributes$map($elm$core$Basics$never),
						attributes),
						extraAttributes
					])),
			potentiallyTitledContents);
	});
var $lattyware$elm_fontawesome$FontAwesome$view = function (presentation) {
	return A2($lattyware$elm_fontawesome$FontAwesome$internalView, presentation, _List_Nil);
};
var $author$project$Controls$createButton = F4(
	function (status, actionAttribute, icon, title) {
		return A2(
			$elm$html$Html$span,
			_Utils_ap(
				_List_fromArray(
					[
						actionAttribute,
						$elm$html$Html$Attributes$title(title),
						$elm$html$Html$Attributes$class('rte-button')
					]),
				function () {
					switch (status) {
						case 0:
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class('rte-active')
								]);
						case 2:
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class('rte-disabled')
								]);
						default:
							return _List_fromArray(
								[
									$elm$html$Html$Attributes$class('rte-enabled')
								]);
					}
				}()),
			_List_fromArray(
				[
					$lattyware$elm_fontawesome$FontAwesome$view(icon)
				]));
	});
var $lattyware$elm_fontawesome$FontAwesome$IconDef = F4(
	function (prefix, name, size, paths) {
		return {bM: name, cW: paths, cX: prefix, c2: size};
	});
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$listOl = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'list-ol',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M24 56c0-13.3 10.7-24 24-24H80c13.3 0 24 10.7 24 24V176h16c13.3 0 24 10.7 24 24s-10.7 24-24 24H40c-13.3 0-24-10.7-24-24s10.7-24 24-24H56V80H48C34.7 80 24 69.3 24 56zM86.7 341.2c-6.5-7.4-18.3-6.9-24 1.2L51.5 357.9c-7.7 10.8-22.7 13.3-33.5 5.6s-13.3-22.7-5.6-33.5l11.1-15.6c23.7-33.2 72.3-35.6 99.2-4.9c21.3 24.4 20.8 60.9-1.1 84.7L86.8 432H120c13.3 0 24 10.7 24 24s-10.7 24-24 24H32c-9.5 0-18.2-5.6-22-14.4s-2.1-18.9 4.3-25.9l72-78c5.3-5.8 5.4-14.6 .3-20.5zM224 64H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 160H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Internal$Icon = $elm$core$Basics$identity;
var $lattyware$elm_fontawesome$FontAwesome$present = function (icon) {
	return {H: _List_Nil, bE: icon, aX: $elm$core$Maybe$Nothing, a4: $elm$core$Maybe$Nothing, a8: 'img', ca: $elm$core$Maybe$Nothing, aR: _List_Nil};
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$listOl = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$listOl);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$listUl = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'list-ul',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$listUl = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$listUl);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$minus = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'minus',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$minus = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$minus);
var $author$project$Controls$InsertHorizontalRule = {$: 12};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $author$project$Controls$onButtonPressInsertHR = A2(
	$elm$html$Html$Events$preventDefaultOn,
	'mousedown',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2($author$project$Controls$InsertHorizontalRule, true)));
var $author$project$Controls$LiftOutOfBlock = {$: 14};
var $author$project$Controls$onButtonPressLiftOutOfBlock = A2(
	$elm$html$Html$Events$preventDefaultOn,
	'mousedown',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2($author$project$Controls$LiftOutOfBlock, true)));
var $author$project$Controls$WrapInList = function (a) {
	return {$: 7, a: a};
};
var $author$project$Controls$onButtonPressToggleList = function (listType) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'mousedown',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Controls$WrapInList(listType),
				true)));
};
var $author$project$Controls$WrapInBlockQuote = {$: 13};
var $author$project$Controls$onButtonPressWrapBlockquote = A2(
	$elm$html$Html$Events$preventDefaultOn,
	'mousedown',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2($author$project$Controls$WrapInBlockQuote, true)));
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$outdent = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'outdent',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M0 64C0 46.3 14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64zM192 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32zm32 96H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H224c-17.7 0-32-14.3-32-32s14.3-32 32-32zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM.2 268.6c-8.2-6.4-8.2-18.9 0-25.3l101.9-79.3c10.5-8.2 25.8-.7 25.8 12.6V335.3c0 13.3-15.3 20.8-25.8 12.6L.2 268.6z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$outdent = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$outdent);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$quoteRight = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'quote-right',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M448 296c0 66.3-53.7 120-120 120h-8c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H320c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72zm-256 0c0 66.3-53.7 120-120 120H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h8c30.9 0 56-25.1 56-56v-8H64c-35.3 0-64-28.7-64-64V160c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v32 32 72z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$quoteRight = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$quoteRight);
var $author$project$Controls$blockElements = function (controlStatus) {
	var liftStatus = controlStatus.az ? 1 : 2;
	var blockStatus = controlStatus.aF ? 1 : 2;
	return _List_fromArray(
		[
			A4(
			$author$project$Controls$createButton,
			blockStatus,
			$author$project$Controls$onButtonPressToggleList(0),
			$lattyware$elm_fontawesome$FontAwesome$Solid$listOl,
			'ordered list'),
			A4(
			$author$project$Controls$createButton,
			blockStatus,
			$author$project$Controls$onButtonPressToggleList(1),
			$lattyware$elm_fontawesome$FontAwesome$Solid$listUl,
			'unordered list'),
			A4($author$project$Controls$createButton, blockStatus, $author$project$Controls$onButtonPressInsertHR, $lattyware$elm_fontawesome$FontAwesome$Solid$minus, 'horizontal rule'),
			A4($author$project$Controls$createButton, blockStatus, $author$project$Controls$onButtonPressWrapBlockquote, $lattyware$elm_fontawesome$FontAwesome$Solid$quoteRight, 'blockquote'),
			A4($author$project$Controls$createButton, liftStatus, $author$project$Controls$onButtonPressLiftOutOfBlock, $lattyware$elm_fontawesome$FontAwesome$Solid$outdent, 'lift')
		]);
};
var $author$project$Controls$ToggleStyle = function (a) {
	return {$: 1, a: a};
};
var $author$project$Controls$onButtonPressToggleStyle = function (style) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'mousedown',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Controls$ToggleStyle(style),
				true)));
};
var $author$project$Controls$Active = 0;
var $author$project$Controls$styleToString = function (style) {
	switch (style) {
		case 0:
			return 'bold';
		case 1:
			return 'italic';
		case 2:
			return 'code';
		case 3:
			return 'strikethrough';
		default:
			return 'underline';
	}
};
var $author$project$Controls$statusForStyle = F2(
	function (style, controlState) {
		return ((!controlState.L) || A2($elm$core$Set$member, 'code_block', controlState.O)) ? 2 : (A2(
			$elm$core$Set$member,
			$author$project$Controls$styleToString(style),
			controlState.W) ? 0 : 1);
	});
var $author$project$Controls$titleForStyle = function (style) {
	switch (style) {
		case 0:
			return 'bold';
		case 1:
			return 'italic';
		case 2:
			return 'code';
		case 4:
			return 'underline';
		default:
			return 'strikethrough';
	}
};
var $author$project$Controls$createButtonForStyle = F3(
	function (controlState, style, icon) {
		var title = $author$project$Controls$titleForStyle(style);
		var status = A2($author$project$Controls$statusForStyle, style, controlState);
		return A4(
			$author$project$Controls$createButton,
			status,
			$author$project$Controls$onButtonPressToggleStyle(style),
			icon,
			title);
	});
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$union, dict1, dict2);
	});
var $author$project$Controls$accumulateControlState = F2(
	function (node, controlState) {
		if (!node.$) {
			var n = node.a;
			return _Utils_update(
				controlState,
				{
					O: A2(
						$elm$core$Set$insert,
						$author$project$RichText$Model$Element$name(
							$author$project$RichText$Model$Node$element(n)),
						controlState.O)
				});
		} else {
			var inline = node.a;
			var names = A2(
				$elm$core$List$map,
				$author$project$RichText$Model$Mark$name,
				$author$project$RichText$Model$Node$marks(inline));
			return _Utils_update(
				controlState,
				{
					L: true,
					W: A2(
						$elm$core$Set$union,
						$elm$core$Set$fromList(names),
						controlState.W)
				});
		}
	});
var $author$project$RichText$Node$foldlRangeRec = F6(
	function (start, end, func, acc, root, node) {
		foldlRangeRec:
		while (true) {
			if (_Utils_cmp(start, end) > 0) {
				return acc;
			} else {
				var result = A2(func, node, acc);
				var _v0 = A2($author$project$RichText$Node$next, start, root);
				if (_v0.$ === 1) {
					return result;
				} else {
					var _v1 = _v0.a;
					var p = _v1.a;
					var n = _v1.b;
					var $temp$start = p,
						$temp$end = end,
						$temp$func = func,
						$temp$acc = result,
						$temp$root = root,
						$temp$node = n;
					start = $temp$start;
					end = $temp$end;
					func = $temp$func;
					acc = $temp$acc;
					root = $temp$root;
					node = $temp$node;
					continue foldlRangeRec;
				}
			}
		}
	});
var $author$project$RichText$Node$foldlRange = F5(
	function (start, end, func, acc, root) {
		var _v0 = A2($author$project$RichText$Node$nodeAt, start, root);
		if (_v0.$ === 1) {
			return acc;
		} else {
			var node = _v0.a;
			return A6($author$project$RichText$Node$foldlRangeRec, start, end, func, acc, root, node);
		}
	});
var $author$project$Controls$accumulateControlStateWithRanges = F3(
	function (ranges, root, controlState) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, cs) {
					var start = _v0.a;
					var end = _v0.b;
					return A5($author$project$RichText$Node$foldlRange, start, end, $author$project$Controls$accumulateControlState, cs, root);
				}),
			controlState,
			ranges);
	});
var $author$project$Controls$emptyControlState = {az: false, L: false, aE: false, aF: false, aG: false, W: $elm$core$Set$empty, O: $elm$core$Set$empty};
var $author$project$RichText$Editor$history = $author$project$RichText$Internal$Editor$history;
var $author$project$RichText$Internal$History$peek = function (history) {
	var c = history;
	return $folkertdev$elm_deque$BoundedDeque$first(c.E);
};
var $author$project$RichText$Model$History$peek = $author$project$RichText$Internal$History$peek;
var $author$project$RichText$Internal$History$redoList = function (history) {
	var c = history;
	return c.am;
};
var $author$project$RichText$Model$History$redoList = $author$project$RichText$Internal$History$redoList;
var $author$project$Controls$deriveControlState = function (editor) {
	var state_ = $author$project$RichText$Editor$state(editor);
	var history_ = $author$project$RichText$Editor$history(editor);
	var _v0 = $author$project$RichText$Model$State$selection(state_);
	if (_v0.$ === 1) {
		return $author$project$Controls$emptyControlState;
	} else {
		var selection = _v0.a;
		var normalizedSelection = $author$project$RichText$Model$Selection$normalize(selection);
		var parentAnchor = $author$project$RichText$Model$Node$parent(
			$author$project$RichText$Model$Selection$anchorNode(normalizedSelection));
		var parentFocus = $author$project$RichText$Model$Node$parent(
			$author$project$RichText$Model$Selection$focusNode(normalizedSelection));
		var hasUndo = !_Utils_eq(
			$author$project$RichText$Model$History$peek(history_),
			$elm$core$Maybe$Nothing);
		var hasRedo = !$elm$core$List$isEmpty(
			$author$project$RichText$Model$History$redoList(history_));
		var controlState = A3(
			$author$project$Controls$accumulateControlStateWithRanges,
			_List_fromArray(
				[
					_Utils_Tuple2(
					$author$project$RichText$Model$Selection$anchorNode(normalizedSelection),
					$author$project$RichText$Model$Selection$focusNode(normalizedSelection)),
					_Utils_Tuple2(parentFocus, parentFocus),
					_Utils_Tuple2(parentAnchor, parentAnchor)
				]),
			$author$project$RichText$Model$State$root(state_),
			_Utils_update(
				$author$project$Controls$emptyControlState,
				{aF: true}));
		return _Utils_update(
			controlState,
			{
				az: ($elm$core$List$length(
					$author$project$RichText$Model$Selection$anchorNode(normalizedSelection)) > 2) || (($elm$core$List$length(
					$author$project$RichText$Model$Selection$focusNode(normalizedSelection)) > 2) || (A2($elm$core$Set$member, 'blockquote', controlState.O) || A2($elm$core$Set$member, 'li', controlState.O))),
				aE: hasRedo,
				aG: hasUndo
			});
	}
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$codeBranch = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'code-branch',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M80 104a24 24 0 1 0 0-48 24 24 0 1 0 0 48zm80-24c0 32.8-19.7 61-48 73.3v87.8c18.8-10.9 40.7-17.1 64-17.1h96c35.3 0 64-28.7 64-64v-6.7C307.7 141 288 112.8 288 80c0-44.2 35.8-80 80-80s80 35.8 80 80c0 32.8-19.7 61-48 73.3V160c0 70.7-57.3 128-128 128H176c-35.3 0-64 28.7-64 64v6.7c28.3 12.3 48 40.5 48 73.3c0 44.2-35.8 80-80 80s-80-35.8-80-80c0-32.8 19.7-61 48-73.3V352 153.3C19.7 141 0 112.8 0 80C0 35.8 35.8 0 80 0s80 35.8 80 80zm232 0a24 24 0 1 0 -48 0 24 24 0 1 0 48 0zM80 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$codeBranch = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$codeBranch);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$heading = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'heading',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M0 64C0 46.3 14.3 32 32 32H80h48c17.7 0 32 14.3 32 32s-14.3 32-32 32H112V208H336V96H320c-17.7 0-32-14.3-32-32s14.3-32 32-32h48 48c17.7 0 32 14.3 32 32s-14.3 32-32 32H400V240 416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H368 320c-17.7 0-32-14.3-32-32s14.3-32 32-32h16V272H112V416h16c17.7 0 32 14.3 32 32s-14.3 32-32 32H80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V240 96H32C14.3 96 0 81.7 0 64z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$heading = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$heading);
var $elm$core$List$map3 = _List_map3;
var $author$project$Controls$ToggleBlock = function (a) {
	return {$: 6, a: a};
};
var $author$project$Controls$onButtonPressToggleBlock = function (action) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'mousedown',
		$elm$json$Json$Decode$succeed(
			_Utils_Tuple2(
				$author$project$Controls$ToggleBlock(action),
				true)));
};
var $author$project$Controls$headerElements = function (controlState) {
	return A4(
		$elm$core$List$map3,
		F3(
			function (block, icon, title) {
				return A4(
					$author$project$Controls$createButton,
					controlState.L ? (A2(
						$elm$core$Set$member,
						A3($elm$core$String$replace, ' ', '_', title),
						controlState.O) ? 0 : 1) : 2,
					$author$project$Controls$onButtonPressToggleBlock(block),
					icon,
					title);
			}),
		_List_fromArray(
			['H1', 'Code block']),
		_List_fromArray(
			[$lattyware$elm_fontawesome$FontAwesome$Solid$heading, $lattyware$elm_fontawesome$FontAwesome$Solid$codeBranch]),
		_List_fromArray(
			['heading', 'code block']));
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$code = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'code',
	_Utils_Tuple2(640, 512),
	_Utils_Tuple2('M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$code = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$code);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$image = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'image',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$image = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$image);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$link = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'link',
	_Utils_Tuple2(640, 512),
	_Utils_Tuple2('M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$link = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$link);
var $author$project$Controls$Code = 2;
var $author$project$Controls$onButtonPressInsertCode = A2(
	$elm$html$Html$Events$preventDefaultOn,
	'mousedown',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2(
			$author$project$Controls$ToggleStyle(2),
			true)));
var $author$project$Controls$ShowInsertImageModal = {$: 8};
var $author$project$Controls$onButtonPressInsertImage = A2(
	$elm$html$Html$Events$preventDefaultOn,
	'mousedown',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2($author$project$Controls$ShowInsertImageModal, true)));
var $author$project$Controls$ShowInsertLinkModal = {$: 2};
var $author$project$Controls$onButtonPressInsertLink = A2(
	$elm$html$Html$Events$preventDefaultOn,
	'mousedown',
	$elm$json$Json$Decode$succeed(
		_Utils_Tuple2($author$project$Controls$ShowInsertLinkModal, true)));
var $author$project$Controls$inlineElementButtons = function (controlState) {
	var linkStatus = (!controlState.L) ? 2 : (A2($elm$core$Set$member, 'link', controlState.W) ? 0 : 1);
	var imageStatus = (!controlState.L) ? 2 : 1;
	var codeStatus = (!controlState.L) ? 2 : (A2($elm$core$Set$member, 'code', controlState.W) ? 0 : 1);
	return _List_fromArray(
		[
			A4($author$project$Controls$createButton, codeStatus, $author$project$Controls$onButtonPressInsertCode, $lattyware$elm_fontawesome$FontAwesome$Solid$code, 'code'),
			A4($author$project$Controls$createButton, linkStatus, $author$project$Controls$onButtonPressInsertLink, $lattyware$elm_fontawesome$FontAwesome$Solid$link, 'link'),
			A4($author$project$Controls$createButton, imageStatus, $author$project$Controls$onButtonPressInsertImage, $lattyware$elm_fontawesome$FontAwesome$Solid$image, 'image')
		]);
};
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$bold = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'bold',
	_Utils_Tuple2(384, 512),
	_Utils_Tuple2('M0 64C0 46.3 14.3 32 32 32H80 96 224c70.7 0 128 57.3 128 128c0 31.3-11.3 60.1-30 82.3c37.1 22.4 62 63.1 62 109.7c0 70.7-57.3 128-128 128H96 80 32c-17.7 0-32-14.3-32-32s14.3-32 32-32H48V256 96H32C14.3 96 0 81.7 0 64zM224 224c35.3 0 64-28.7 64-64s-28.7-64-64-64H112V224H224zM112 288V416H256c35.3 0 64-28.7 64-64s-28.7-64-64-64H224 112z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$bold = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$bold);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$italic = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'italic',
	_Utils_Tuple2(384, 512),
	_Utils_Tuple2('M128 64c0-17.7 14.3-32 32-32H352c17.7 0 32 14.3 32 32s-14.3 32-32 32H293.3L160 416h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H90.7L224 96H160c-17.7 0-32-14.3-32-32z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$italic = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$italic);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$strikethrough = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'strikethrough',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M161.3 144c3.2-17.2 14-30.1 33.7-38.6c21.1-9 51.8-12.3 88.6-6.5c11.9 1.9 48.8 9.1 60.1 12c17.1 4.5 34.6-5.6 39.2-22.7s-5.6-34.6-22.7-39.2c-14.3-3.8-53.6-11.4-66.6-13.4c-44.7-7-88.3-4.2-123.7 10.9c-36.5 15.6-64.4 44.8-71.8 87.3c-.1 .6-.2 1.1-.2 1.7c-2.8 23.9 .5 45.6 10.1 64.6c4.5 9 10.2 16.9 16.7 23.9H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H270.1c-.1 0-.3-.1-.4-.1l-1.1-.3c-36-10.8-65.2-19.6-85.2-33.1c-9.3-6.3-15-12.6-18.2-19.1c-3.1-6.1-5.2-14.6-3.8-27.4zM348.9 337.2c2.7 6.5 4.4 15.8 1.9 30.1c-3 17.6-13.8 30.8-33.9 39.4c-21.1 9-51.7 12.3-88.5 6.5c-18-2.9-49.1-13.5-74.4-22.1c-5.6-1.9-11-3.7-15.9-5.4c-16.8-5.6-34.9 3.5-40.5 20.3s3.5 34.9 20.3 40.5c3.6 1.2 7.9 2.7 12.7 4.3l0 0 0 0c24.9 8.5 63.6 21.7 87.6 25.6l0 0 .2 0c44.7 7 88.3 4.2 123.7-10.9c36.5-15.6 64.4-44.8 71.8-87.3c3.6-21 2.7-40.4-3.1-58.1H335.1c7 5.6 11.4 11.2 13.9 17.2z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$strikethrough = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$strikethrough);
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$underline = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'underline',
	_Utils_Tuple2(448, 512),
	_Utils_Tuple2('M16 64c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H128V224c0 53 43 96 96 96s96-43 96-96V96H304c-17.7 0-32-14.3-32-32s14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H384V224c0 88.4-71.6 160-160 160s-160-71.6-160-160V96H48C30.3 96 16 81.7 16 64zM0 448c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$underline = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$underline);
var $author$project$Controls$styleToIcon = function (style) {
	switch (style) {
		case 0:
			return $lattyware$elm_fontawesome$FontAwesome$Solid$bold;
		case 1:
			return $lattyware$elm_fontawesome$FontAwesome$Solid$italic;
		case 2:
			return $lattyware$elm_fontawesome$FontAwesome$Solid$code;
		case 3:
			return $lattyware$elm_fontawesome$FontAwesome$Solid$strikethrough;
		default:
			return $lattyware$elm_fontawesome$FontAwesome$Solid$underline;
	}
};
var $author$project$Controls$Redo = {$: 18};
var $author$project$Controls$Undo = {$: 17};
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowRotateRight = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'arrow-rotate-right',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$arrowRotateRight = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowRotateRight);
var $lattyware$elm_fontawesome$FontAwesome$Solid$redo = $lattyware$elm_fontawesome$FontAwesome$Solid$arrowRotateRight;
var $lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowRotateLeft = A4(
	$lattyware$elm_fontawesome$FontAwesome$IconDef,
	'fas',
	'arrow-rotate-left',
	_Utils_Tuple2(512, 512),
	_Utils_Tuple2('M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z', $elm$core$Maybe$Nothing));
var $lattyware$elm_fontawesome$FontAwesome$Solid$arrowRotateLeft = $lattyware$elm_fontawesome$FontAwesome$present($lattyware$elm_fontawesome$FontAwesome$Solid$Definitions$arrowRotateLeft);
var $lattyware$elm_fontawesome$FontAwesome$Solid$undo = $lattyware$elm_fontawesome$FontAwesome$Solid$arrowRotateLeft;
var $author$project$Controls$undoRedo = function (controlState) {
	return _List_fromArray(
		[
			A4(
			$author$project$Controls$createButton,
			controlState.aG ? 1 : 2,
			A2(
				$elm$html$Html$Events$preventDefaultOn,
				'mousedown',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2($author$project$Controls$Undo, true))),
			$lattyware$elm_fontawesome$FontAwesome$Solid$undo,
			'undo'),
			A4(
			$author$project$Controls$createButton,
			controlState.aE ? 1 : 2,
			A2(
				$elm$html$Html$Events$preventDefaultOn,
				'mousedown',
				$elm$json$Json$Decode$succeed(
					_Utils_Tuple2($author$project$Controls$Redo, true))),
			$lattyware$elm_fontawesome$FontAwesome$Solid$redo,
			'redo')
		]);
};
var $author$project$Controls$editorControlPanel = F2(
	function (styles, editor) {
		var controlState = $author$project$Controls$deriveControlState(editor);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('rte-controls-container')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('rte-controls')
						]),
					A3(
						$elm$core$List$map2,
						$author$project$Controls$createButtonForStyle(controlState),
						styles,
						A2($elm$core$List$map, $author$project$Controls$styleToIcon, styles))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('rte-controls')
						]),
					_Utils_ap(
						$author$project$Controls$inlineElementButtons(controlState),
						$author$project$Controls$blockElements(controlState))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('rte-controls')
						]),
					$author$project$Controls$headerElements(controlState)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('rte-controls')
						]),
					$author$project$Controls$undoRedo(controlState))
				]));
	});
var $author$project$Controls$InsertImage = {$: 9};
var $author$project$Controls$UpdateImageAlt = function (a) {
	return {$: 11, a: a};
};
var $author$project$Controls$UpdateImageSrc = function (a) {
	return {$: 10, a: a};
};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$input = _VirtualDom_node('input');
var $author$project$Controls$modal = F2(
	function (visible, children) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$classList(
					_List_fromArray(
						[
							_Utils_Tuple2('modal', true),
							_Utils_Tuple2('modal-isOpen', visible),
							_Utils_Tuple2('modal--top', true)
						]))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-container')
						]),
					children),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-backdrop')
						]),
					_List_Nil)
				]));
	});
var $elm$html$Html$Attributes$name = $elm$html$Html$Attributes$stringProperty('name');
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Controls$renderInsertImageModal = function (insertImageModal) {
	return A2(
		$author$project$Controls$modal,
		insertImageModal.aT,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Insert image')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$name('src'),
								$elm$html$Html$Attributes$value(insertImageModal.b6),
								$elm$html$Html$Attributes$placeholder('Image URL (ex: https://via.placeholder.com/150.png)'),
								$elm$html$Html$Events$onInput($author$project$Controls$UpdateImageSrc)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$name('alt'),
								$elm$html$Html$Attributes$value(insertImageModal.bl),
								$elm$html$Html$Attributes$placeholder('Alt text'),
								$elm$html$Html$Events$onInput($author$project$Controls$UpdateImageAlt)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Controls$InsertImage)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Insert')
							]))
					]))
			]));
};
var $author$project$Controls$InsertLink = {$: 5};
var $author$project$Controls$UpdateLinkHref = function (a) {
	return {$: 3, a: a};
};
var $author$project$Controls$UpdateLinkTitle = function (a) {
	return {$: 4, a: a};
};
var $author$project$Controls$renderInsertLinkModal = function (insertLinkModal) {
	return A2(
		$author$project$Controls$modal,
		insertLinkModal.aT,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Insert link')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$name('href'),
								$elm$html$Html$Attributes$value(insertLinkModal.bD),
								$elm$html$Html$Attributes$placeholder('Location'),
								$elm$html$Html$Events$onInput($author$project$Controls$UpdateLinkHref)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$name('title'),
								$elm$html$Html$Attributes$value(insertLinkModal.ca),
								$elm$html$Html$Attributes$placeholder('Title'),
								$elm$html$Html$Events$onInput($author$project$Controls$UpdateLinkTitle)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Controls$InsertLink)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Insert')
							]))
					]))
			]));
};
var $author$project$RichText$Internal$Editor$completeRerenderCount = function (e) {
	var c = e;
	return c.aj;
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$contenteditable = $elm$html$Html$Attributes$boolProperty('contentEditable');
var $author$project$RichText$Internal$Path$pathToChildContents = function (node) {
	if (!node.$) {
		var children = node.c;
		return _Utils_eq(children, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder) ? $elm$core$Maybe$Just(_List_Nil) : A3(
			$elm$core$Array$foldl,
			F2(
				function (_v1, maybePath) {
					var i = _v1.a;
					var childNode = _v1.b;
					if (maybePath.$ === 1) {
						var _v3 = $author$project$RichText$Internal$Path$pathToChildContents(childNode);
						if (_v3.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var path = _v3.a;
							return $elm$core$Maybe$Just(
								A2($elm$core$List$cons, i, path));
						}
					} else {
						return maybePath;
					}
				}),
			$elm$core$Maybe$Nothing,
			A2($elm$core$Array$indexedMap, $elm$core$Tuple$pair, children));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$RichText$Internal$Path$pathToChildContentsFromElementParameters = F2(
	function (spec, parameters) {
		var elementDefinition = A2($author$project$RichText$Internal$Spec$elementDefinitionWithDefault, parameters, spec);
		var nodeStructure = A3($author$project$RichText$Config$ElementDefinition$toHtmlNode, elementDefinition, parameters, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder);
		return $author$project$RichText$Internal$Path$pathToChildContents(nodeStructure);
	});
var $author$project$RichText$Internal$Path$pathToChildContentsFromMark = F2(
	function (spec, mark) {
		var markDefinition = A2($author$project$RichText$Internal$Spec$markDefinitionWithDefault, mark, spec);
		var markStructure = A3($author$project$RichText$Config$MarkDefinition$toHtmlNode, markDefinition, mark, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder);
		return $author$project$RichText$Internal$Path$pathToChildContents(markStructure);
	});
var $author$project$RichText$Internal$Path$pathToChildContentsFromInlineTreePath = F4(
	function (spec, array, treeArray, path) {
		if (!path.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var x = path.a;
			var xs = path.b;
			var _v1 = A2($elm$core$Array$get, x, treeArray);
			if (_v1.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var tree = _v1.a;
				if (tree.$ === 1) {
					var i = tree.a;
					var _v3 = A2($elm$core$Array$get, i, array);
					if (_v3.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						return $elm$core$Maybe$Just(
							_List_fromArray(
								[x]));
					}
				} else {
					var n = tree.a;
					var _v4 = A2($author$project$RichText$Internal$Path$pathToChildContentsFromMark, spec, n.bK);
					if (_v4.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var p = _v4.a;
						var _v5 = A4($author$project$RichText$Internal$Path$pathToChildContentsFromInlineTreePath, spec, array, n.cq, xs);
						if (_v5.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var rest = _v5.a;
							return $elm$core$Maybe$Just(
								A2(
									$elm$core$List$cons,
									x,
									_Utils_ap(p, rest)));
						}
					}
				}
			}
		}
	});
var $author$project$RichText$Model$Node$reverseLookup = function (arr) {
	var a = arr;
	return a.a7;
};
var $author$project$RichText$Internal$Path$editorToDom = F3(
	function (spec, node, path) {
		if (!path.b) {
			return $elm$core$Maybe$Just(_List_Nil);
		} else {
			var x = path.a;
			var xs = path.b;
			var _v1 = A2(
				$author$project$RichText$Internal$Path$pathToChildContentsFromElementParameters,
				spec,
				$author$project$RichText$Model$Node$element(node));
			if (_v1.$ === 1) {
				return $elm$core$Maybe$Nothing;
			} else {
				var childPath = _v1.a;
				var _v2 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v2.$) {
					case 0:
						var l = _v2.a;
						var _v3 = A2(
							$elm$core$Array$get,
							x,
							$author$project$RichText$Model$Node$toBlockArray(l));
						if (_v3.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var childNode = _v3.a;
							var _v4 = A3($author$project$RichText$Internal$Path$editorToDom, spec, childNode, xs);
							if (_v4.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var p = _v4.a;
								return $elm$core$Maybe$Just(
									_Utils_ap(
										childPath,
										A2($elm$core$List$cons, x, p)));
							}
						}
					case 1:
						var l = _v2.a;
						var _v5 = A2(
							$elm$core$Array$get,
							x,
							$author$project$RichText$Model$Node$reverseLookup(l));
						if (_v5.$ === 1) {
							return $elm$core$Maybe$Nothing;
						} else {
							var inlineTreePath = _v5.a;
							var _v6 = A4(
								$author$project$RichText$Internal$Path$pathToChildContentsFromInlineTreePath,
								spec,
								$author$project$RichText$Model$Node$toInlineArray(l),
								$author$project$RichText$Model$Node$toInlineTree(l),
								inlineTreePath);
							if (_v6.$ === 1) {
								return $elm$core$Maybe$Nothing;
							} else {
								var childInlineTreePath = _v6.a;
								return $elm$core$Maybe$Just(
									_Utils_ap(childPath, childInlineTreePath));
							}
						}
					default:
						return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $author$project$RichText$Internal$Selection$editorToDom = function (spec) {
	return $author$project$RichText$Internal$Selection$transformSelection(
		$author$project$RichText$Internal$Path$editorToDom(spec));
};
var $author$project$RichText$Editor$editorToDomSelection = F2(
	function (spec_, editor_) {
		var _v0 = $author$project$RichText$Model$State$selection(
			$author$project$RichText$Editor$state(editor_));
		if (_v0.$ === 1) {
			return $elm$core$Maybe$Nothing;
		} else {
			var selection = _v0.a;
			return A3(
				$author$project$RichText$Internal$Selection$editorToDom,
				spec_,
				$author$project$RichText$Model$State$root(
					$author$project$RichText$Editor$state(editor_)),
				selection);
		}
	});
var $author$project$RichText$Editor$markCaretSelectionOnEditorNodes = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return $author$project$RichText$Model$State$root(editorState);
	} else {
		var selection = _v0.a;
		return $author$project$RichText$Model$Selection$isCollapsed(selection) ? A2(
			$author$project$RichText$Annotation$annotateSelection,
			selection,
			$author$project$RichText$Model$State$root(editorState)) : $author$project$RichText$Model$State$root(editorState);
	}
};
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$html$Html$Keyed$node = $elm$virtual_dom$VirtualDom$keyedNode;
var $author$project$RichText$Internal$Editor$BeforeInputEvent = function (a) {
	return {$: 2, a: a};
};
var $author$project$RichText$Internal$Event$InputEvent = F3(
	function (data, isComposing, inputType) {
		return {cw: data, cJ: inputType, bI: isComposing};
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$RichText$Internal$BeforeInput$beforeInputDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$RichText$Internal$Editor$BeforeInputEvent,
	A4(
		$elm$json$Json$Decode$map3,
		$author$project$RichText$Internal$Event$InputEvent,
		$elm$json$Json$Decode$maybe(
			A2($elm$json$Json$Decode$field, 'data', $elm$json$Json$Decode$string)),
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2($elm$json$Json$Decode$field, 'isComposing', $elm$json$Json$Decode$bool),
					$elm$json$Json$Decode$succeed(false)
				])),
		A2($elm$json$Json$Decode$field, 'inputType', $elm$json$Json$Decode$string)));
var $author$project$RichText$Internal$BeforeInput$shouldPreventDefault = F4(
	function (commandMap, spec, editor, inputEvent) {
		var _v0 = A4($author$project$RichText$Internal$BeforeInput$handleInputEvent, commandMap, spec, editor, inputEvent);
		if (_v0.$ === 1) {
			return false;
		} else {
			return true;
		}
	});
var $author$project$RichText$Internal$BeforeInput$preventDefaultOn = F4(
	function (commandMap, spec, editor, msg) {
		if (msg.$ === 2) {
			var inputEvent = msg.a;
			return (inputEvent.bI || $author$project$RichText$Internal$Editor$isComposing(editor)) ? _Utils_Tuple2(msg, false) : _Utils_Tuple2(
				msg,
				A4($author$project$RichText$Internal$BeforeInput$shouldPreventDefault, commandMap, spec, editor, inputEvent));
		} else {
			return _Utils_Tuple2(msg, false);
		}
	});
var $author$project$RichText$Internal$BeforeInput$preventDefaultOnBeforeInputDecoder = F4(
	function (tagger, commandMap, spec, editor) {
		return A2(
			$elm$json$Json$Decode$map,
			function (_v0) {
				var i = _v0.a;
				var b = _v0.b;
				return _Utils_Tuple2(
					tagger(i),
					b);
			},
			A2(
				$elm$json$Json$Decode$map,
				A3($author$project$RichText$Internal$BeforeInput$preventDefaultOn, commandMap, spec, editor),
				$author$project$RichText$Internal$BeforeInput$beforeInputDecoder));
	});
var $author$project$RichText$Editor$onBeforeInput = F4(
	function (tagger, commandMap_, spec_, editor_) {
		return A2(
			$elm$html$Html$Events$preventDefaultOn,
			'beforeinput',
			A4($author$project$RichText$Internal$BeforeInput$preventDefaultOnBeforeInputDecoder, tagger, commandMap_, spec_, editor_));
	});
var $author$project$RichText$Internal$Editor$CompositionEnd = {$: 5};
var $author$project$RichText$Editor$onCompositionEnd = function (msgFunc) {
	return A2(
		$elm$html$Html$Events$on,
		'editorcompositionend',
		A2(
			$elm$json$Json$Decode$map,
			msgFunc,
			$elm$json$Json$Decode$succeed($author$project$RichText$Internal$Editor$CompositionEnd)));
};
var $author$project$RichText$Internal$Editor$CompositionStart = {$: 4};
var $author$project$RichText$Editor$onCompositionStart = function (msgFunc) {
	return A2(
		$elm$html$Html$Events$on,
		'compositionstart',
		A2(
			$elm$json$Json$Decode$map,
			msgFunc,
			$elm$json$Json$Decode$succeed($author$project$RichText$Internal$Editor$CompositionStart)));
};
var $author$project$RichText$Internal$Editor$CutEvent = {$: 7};
var $author$project$RichText$Editor$onCut = function (msgFunc) {
	return A2(
		$elm$html$Html$Events$on,
		'cut',
		A2(
			$elm$json$Json$Decode$map,
			msgFunc,
			$elm$json$Json$Decode$succeed($author$project$RichText$Internal$Editor$CutEvent)));
};
var $author$project$RichText$Internal$Editor$ChangeEvent = function (a) {
	return {$: 1, a: a};
};
var $author$project$RichText$Internal$Event$EditorChange = F5(
	function (root, selection, characterDataMutations, timestamp, isComposing) {
		return {co: characterDataMutations, bI: isComposing, c_: root, b2: selection, b9: timestamp};
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$RichText$Editor$characterDataMutationsDecoder = $elm$json$Json$Decode$list(
	A3(
		$elm$json$Json$Decode$map2,
		$elm$core$Tuple$pair,
		A2(
			$elm$json$Json$Decode$field,
			'path',
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
		A2($elm$json$Json$Decode$field, 'text', $elm$json$Json$Decode$string)));
var $elm$json$Json$Decode$map5 = _Json_map5;
var $author$project$RichText$Editor$selectionDecoder = $elm$json$Json$Decode$maybe(
	A5(
		$elm$json$Json$Decode$map4,
		$author$project$RichText$Model$Selection$range,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['anchorNode']),
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['anchorOffset']),
			$elm$json$Json$Decode$int),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['focusNode']),
			$elm$json$Json$Decode$list($elm$json$Json$Decode$int)),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['focusOffset']),
			$elm$json$Json$Decode$int)));
var $author$project$RichText$Editor$editorChangeDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$RichText$Internal$Editor$ChangeEvent,
	A6(
		$elm$json$Json$Decode$map5,
		$author$project$RichText$Internal$Event$EditorChange,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'root']),
			$elm$json$Json$Decode$value),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'selection']),
			$author$project$RichText$Editor$selectionDecoder),
		$elm$json$Json$Decode$maybe(
			A2(
				$elm$json$Json$Decode$at,
				_List_fromArray(
					['detail', 'characterDataMutations']),
				$author$project$RichText$Editor$characterDataMutationsDecoder)),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'timestamp']),
			$elm$json$Json$Decode$int),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'isComposing']),
			$elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						$elm$json$Json$Decode$bool,
						$elm$json$Json$Decode$succeed(false)
					])))));
var $author$project$RichText$Editor$onEditorChange = function (msgFunc) {
	return A2(
		$elm$html$Html$Events$on,
		'editorchange',
		A2($elm$json$Json$Decode$map, msgFunc, $author$project$RichText$Editor$editorChangeDecoder));
};
var $author$project$RichText$Editor$editorSelectionChangeDecoder = A3(
	$elm$json$Json$Decode$map2,
	$author$project$RichText$Internal$Editor$SelectionEvent,
	A2(
		$elm$json$Json$Decode$at,
		_List_fromArray(
			['detail']),
		$author$project$RichText$Editor$selectionDecoder),
	$elm$json$Json$Decode$succeed(true));
var $author$project$RichText$Editor$onEditorSelectionChange = function (msgFunc) {
	return A2(
		$elm$html$Html$Events$on,
		'editorselectionchange',
		A2($elm$json$Json$Decode$map, msgFunc, $author$project$RichText$Editor$editorSelectionChangeDecoder));
};
var $author$project$RichText$Internal$Editor$Init = function (a) {
	return {$: 8, a: a};
};
var $author$project$RichText$Internal$Event$InitEvent = function (shortKey) {
	return {c1: shortKey};
};
var $author$project$RichText$Editor$initDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$RichText$Internal$Editor$Init,
	A2(
		$elm$json$Json$Decode$map,
		$author$project$RichText$Internal$Event$InitEvent,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'shortKey']),
			$elm$json$Json$Decode$string)));
var $author$project$RichText$Editor$onInit = function (msgFunc) {
	return A2(
		$elm$html$Html$Events$on,
		'editorinit',
		A2($elm$json$Json$Decode$map, msgFunc, $author$project$RichText$Editor$initDecoder));
};
var $author$project$RichText$Internal$Editor$KeyDownEvent = function (a) {
	return {$: 3, a: a};
};
var $author$project$RichText$Internal$Event$KeyboardEvent = F7(
	function (keyCode, key, altKey, metaKey, ctrlKey, shiftKey, isComposing) {
		return {ck: altKey, cv: ctrlKey, bI: isComposing, bJ: key, cM: keyCode, cP: metaKey, b4: shiftKey};
	});
var $elm$json$Json$Decode$map7 = _Json_map7;
var $author$project$RichText$Internal$KeyDown$keyDownDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$RichText$Internal$Editor$KeyDownEvent,
	A8(
		$elm$json$Json$Decode$map7,
		$author$project$RichText$Internal$Event$KeyboardEvent,
		A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'key', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'altKey', $elm$json$Json$Decode$bool),
		A2($elm$json$Json$Decode$field, 'metaKey', $elm$json$Json$Decode$bool),
		A2($elm$json$Json$Decode$field, 'ctrlKey', $elm$json$Json$Decode$bool),
		A2($elm$json$Json$Decode$field, 'shiftKey', $elm$json$Json$Decode$bool),
		$elm$json$Json$Decode$oneOf(
			_List_fromArray(
				[
					A2($elm$json$Json$Decode$field, 'isComposing', $elm$json$Json$Decode$bool),
					$elm$json$Json$Decode$succeed(false)
				]))));
var $author$project$RichText$Internal$KeyDown$shouldPreventDefault = F4(
	function (comamndMap, spec, editor, keyboardEvent) {
		var _v0 = A4($author$project$RichText$Internal$KeyDown$handleKeyDownEvent, comamndMap, spec, editor, keyboardEvent);
		if (_v0.$ === 1) {
			return false;
		} else {
			return true;
		}
	});
var $author$project$RichText$Internal$KeyDown$preventDefaultOn = F4(
	function (commandMap, spec, editor, msg) {
		if (msg.$ === 3) {
			var key = msg.a;
			return (key.bI || $author$project$RichText$Internal$Editor$isComposing(editor)) ? _Utils_Tuple2(msg, false) : _Utils_Tuple2(
				msg,
				A4($author$project$RichText$Internal$KeyDown$shouldPreventDefault, commandMap, spec, editor, key));
		} else {
			return _Utils_Tuple2(msg, false);
		}
	});
var $author$project$RichText$Internal$KeyDown$preventDefaultOnKeyDownDecoder = F4(
	function (tagger, commandMap, spec, editor) {
		return A2(
			$elm$json$Json$Decode$map,
			function (_v0) {
				var i = _v0.a;
				var b = _v0.b;
				return _Utils_Tuple2(
					tagger(i),
					b);
			},
			A2(
				$elm$json$Json$Decode$map,
				A3($author$project$RichText$Internal$KeyDown$preventDefaultOn, commandMap, spec, editor),
				$author$project$RichText$Internal$KeyDown$keyDownDecoder));
	});
var $author$project$RichText$Editor$onKeyDown = F4(
	function (tagger, commandMap_, spec_, editor_) {
		return A2(
			$elm$html$Html$Events$preventDefaultOn,
			'keydown',
			A4($author$project$RichText$Internal$KeyDown$preventDefaultOnKeyDownDecoder, tagger, commandMap_, spec_, editor_));
	});
var $author$project$RichText$Internal$Event$PasteEvent = F2(
	function (text, html) {
		return {cG: html, as: text};
	});
var $author$project$RichText$Internal$Editor$PasteWithDataEvent = function (a) {
	return {$: 6, a: a};
};
var $author$project$RichText$Editor$pasteWithDataDecoder = A2(
	$elm$json$Json$Decode$map,
	$author$project$RichText$Internal$Editor$PasteWithDataEvent,
	A3(
		$elm$json$Json$Decode$map2,
		$author$project$RichText$Internal$Event$PasteEvent,
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'text']),
			$elm$json$Json$Decode$string),
		A2(
			$elm$json$Json$Decode$at,
			_List_fromArray(
				['detail', 'html']),
			$elm$json$Json$Decode$string)));
var $author$project$RichText$Editor$onPasteWithData = function (msgFunc) {
	return A2(
		$elm$html$Html$Events$on,
		'pastewithdata',
		A2($elm$json$Json$Decode$map, msgFunc, $author$project$RichText$Editor$pasteWithDataDecoder));
};
var $author$project$RichText$Internal$Editor$renderCount = function (e) {
	var c = e;
	return c.an;
};
var $author$project$RichText$Editor$selectionAttribute = F3(
	function (maybeSelection, renderCount, selectionCount) {
		if (maybeSelection.$ === 1) {
			return 'render-count=' + $elm$core$String$fromInt(renderCount);
		} else {
			var selection = maybeSelection.a;
			return A2(
				$elm$core$String$join,
				',',
				_List_fromArray(
					[
						'anchor-offset=' + $elm$core$String$fromInt(
						$author$project$RichText$Model$Selection$anchorOffset(selection)),
						'anchor-node=' + $author$project$RichText$Model$Node$toString(
						$author$project$RichText$Model$Selection$anchorNode(selection)),
						'focus-offset=' + $elm$core$String$fromInt(
						$author$project$RichText$Model$Selection$focusOffset(selection)),
						'focus-node=' + $author$project$RichText$Model$Node$toString(
						$author$project$RichText$Model$Selection$focusNode(selection)),
						'render-count=' + $elm$core$String$fromInt(renderCount),
						'selection-count=' + $elm$core$String$fromInt(selectionCount)
					]));
		}
	});
var $author$project$RichText$Internal$Editor$selectionCount = function (e) {
	var c = e;
	return c.ap;
};
var $author$project$RichText$Editor$shouldHideCaret = function (editorState) {
	var _v0 = $author$project$RichText$Model$State$selection(editorState);
	if (_v0.$ === 1) {
		return true;
	} else {
		var selection = _v0.a;
		if (!$author$project$RichText$Model$Selection$isCollapsed(selection)) {
			return false;
		} else {
			var _v1 = A2(
				$author$project$RichText$Node$nodeAt,
				$author$project$RichText$Model$Selection$anchorNode(selection),
				$author$project$RichText$Model$State$root(editorState));
			if (_v1.$ === 1) {
				return false;
			} else {
				var node = _v1.a;
				if (!node.$) {
					return true;
				} else {
					var leaf = node.a;
					if (!leaf.$) {
						return true;
					} else {
						return false;
					}
				}
			}
		}
	}
};
var $author$project$RichText$Config$Decorations$topLevelAttributes = function (d) {
	var c = d;
	return c.aQ;
};
var $author$project$RichText$Editor$viewHtmlNode = F4(
	function (node, decorators, vdomChildren, backwardsRelativePath) {
		if (!node.$) {
			var name = node.a;
			var attributes = node.b;
			var children = node.c;
			var childNodes = _Utils_eq(children, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder) ? vdomChildren : A2(
				$elm$core$Array$indexedMap,
				F2(
					function (i, n) {
						return A4(
							$author$project$RichText$Editor$viewHtmlNode,
							n,
							decorators,
							vdomChildren,
							A2($elm$core$List$cons, i, backwardsRelativePath));
					}),
				children);
			return A3(
				$elm$html$Html$node,
				name,
				_Utils_ap(
					A2(
						$elm$core$List$map,
						function (_v1) {
							var k = _v1.a;
							var v = _v1.b;
							return A2($elm$html$Html$Attributes$attribute, k, v);
						},
						attributes),
					A2(
						$elm$core$List$concatMap,
						function (d) {
							return d(
								$elm$core$List$reverse(backwardsRelativePath));
						},
						decorators)),
				$elm$core$Array$toList(childNodes));
		} else {
			var v = node.a;
			return $elm$html$Html$text(v);
		}
	});
var $author$project$RichText$Editor$viewElement = F5(
	function (spec_, decorations_, elementParameters, backwardsNodePath, children) {
		var eDecorators = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Dict$get,
				$author$project$RichText$Model$Element$name(elementParameters),
				$author$project$RichText$Config$Decorations$elementDecorations(decorations_)));
		var definition = A2($author$project$RichText$Internal$Spec$elementDefinitionWithDefault, elementParameters, spec_);
		var node = A3($author$project$RichText$Config$ElementDefinition$toHtmlNode, definition, elementParameters, $author$project$RichText$Internal$HtmlNode$childNodesPlaceholder);
		var decorators = A2(
			$elm$core$List$map,
			function (d) {
				return A2(
					d,
					$elm$core$List$reverse(backwardsNodePath),
					elementParameters);
			},
			eDecorators);
		var nodeHtml = A4($author$project$RichText$Editor$viewHtmlNode, node, decorators, children, _List_Nil);
		return nodeHtml;
	});
var $author$project$RichText$Editor$viewText = function (text) {
	return $elm$html$Html$text(
		$elm$core$String$isEmpty(text) ? $author$project$RichText$Internal$Constants$zeroWidthSpace : text);
};
var $author$project$RichText$Editor$viewInlineLeaf = F4(
	function (spec_, decorations_, backwardsPath, leaf) {
		if (!leaf.$) {
			var l = leaf.a;
			return A5(
				$author$project$RichText$Editor$viewElement,
				spec_,
				decorations_,
				$author$project$RichText$Model$InlineElement$element(l),
				backwardsPath,
				$elm$core$Array$empty);
		} else {
			var v = leaf.a;
			return $author$project$RichText$Editor$viewText(
				$author$project$RichText$Model$Text$text(v));
		}
	});
var $author$project$RichText$Config$Decorations$markDecorations = function (d) {
	var c = d;
	return c.W;
};
var $author$project$RichText$Editor$viewMark = F5(
	function (spec_, decorations_, backwardsNodePath, mark, children) {
		var node = A3(
			$author$project$RichText$Config$MarkDefinition$toHtmlNode,
			A2($author$project$RichText$Internal$Spec$markDefinitionWithDefault, mark, spec_),
			mark,
			$author$project$RichText$Internal$HtmlNode$childNodesPlaceholder);
		var mDecorators = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Dict$get,
				$author$project$RichText$Model$Mark$name(mark),
				$author$project$RichText$Config$Decorations$markDecorations(decorations_)));
		var decorators = A2(
			$elm$core$List$map,
			function (d) {
				return A2(
					d,
					$elm$core$List$reverse(backwardsNodePath),
					mark);
			},
			mDecorators);
		return A4($author$project$RichText$Editor$viewHtmlNode, node, decorators, children, _List_Nil);
	});
var $author$project$RichText$Editor$viewInlineLeafTree = F5(
	function (spec_, decorations_, backwardsPath, inlineLeafArray, inlineLeafTree) {
		if (inlineLeafTree.$ === 1) {
			var i = inlineLeafTree.a;
			var _v1 = A2($elm$core$Array$get, i, inlineLeafArray);
			if (!_v1.$) {
				var l = _v1.a;
				return A4(
					$author$project$RichText$Editor$viewInlineLeaf,
					spec_,
					decorations_,
					A2($elm$core$List$cons, i, backwardsPath),
					l);
			} else {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('rte-error')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Invalid leaf tree.')
						]));
			}
		} else {
			var n = inlineLeafTree.a;
			return A5(
				$author$project$RichText$Editor$viewMark,
				spec_,
				decorations_,
				backwardsPath,
				n.bK,
				A2(
					$elm$core$Array$map,
					A4($author$project$RichText$Editor$viewInlineLeafTree, spec_, decorations_, backwardsPath, inlineLeafArray),
					n.cq));
		}
	});
var $author$project$RichText$Editor$viewEditorBlockNode = F4(
	function (spec_, decorations_, backwardsPath, node) {
		return A5(
			$author$project$RichText$Editor$viewElement,
			spec_,
			decorations_,
			$author$project$RichText$Model$Node$element(node),
			backwardsPath,
			function () {
				var _v0 = $author$project$RichText$Model$Node$childNodes(node);
				switch (_v0.$) {
					case 0:
						var l = _v0.a;
						return A2(
							$elm$core$Array$indexedMap,
							F2(
								function (i, n) {
									return A4(
										$author$project$RichText$Editor$viewEditorBlockNode,
										spec_,
										decorations_,
										A2($elm$core$List$cons, i, backwardsPath),
										n);
								}),
							$author$project$RichText$Model$Node$toBlockArray(l));
					case 1:
						var l = _v0.a;
						return A2(
							$elm$core$Array$map,
							function (n) {
								return A5(
									$author$project$RichText$Editor$viewInlineLeafTree,
									spec_,
									decorations_,
									backwardsPath,
									$author$project$RichText$Model$Node$toInlineArray(l),
									n);
							},
							$author$project$RichText$Model$Node$toInlineTree(l));
					default:
						return $elm$core$Array$empty;
				}
			}());
	});
var $author$project$RichText$Editor$view = F2(
	function (cfg, editor_) {
		var c = cfg;
		var tagger = c.c7;
		var state_ = $author$project$RichText$Editor$state(editor_);
		var spec_ = c.c4;
		var decorations_ = c.cx;
		var commandMap_ = c.cr;
		return A3(
			$elm$html$Html$Keyed$node,
			'elm-editor',
			_List_fromArray(
				[
					$author$project$RichText$Editor$onEditorChange(tagger),
					$author$project$RichText$Editor$onEditorSelectionChange(tagger),
					$author$project$RichText$Editor$onCompositionStart(tagger),
					$author$project$RichText$Editor$onCompositionEnd(tagger),
					$author$project$RichText$Editor$onPasteWithData(tagger),
					$author$project$RichText$Editor$onCut(tagger),
					$author$project$RichText$Editor$onInit(tagger)
				]),
			_List_fromArray(
				[
					_Utils_Tuple2(
					$elm$core$String$fromInt(
						$author$project$RichText$Internal$Editor$completeRerenderCount(editor_)),
					A3(
						$elm$html$Html$Keyed$node,
						'div',
						_Utils_ap(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$contenteditable(true),
									$elm$html$Html$Attributes$class('rte-main'),
									A2($elm$html$Html$Attributes$attribute, 'data-rte-main', 'true'),
									$elm$html$Html$Attributes$classList(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'rte-hide-caret',
											$author$project$RichText$Editor$shouldHideCaret(state_))
										])),
									A4($author$project$RichText$Editor$onBeforeInput, tagger, commandMap_, spec_, editor_),
									A4($author$project$RichText$Editor$onKeyDown, tagger, commandMap_, spec_, editor_)
								]),
							$author$project$RichText$Config$Decorations$topLevelAttributes(decorations_)),
						_List_fromArray(
							[
								_Utils_Tuple2(
								$elm$core$String$fromInt(
									$author$project$RichText$Internal$Editor$renderCount(editor_)),
								A4(
									$author$project$RichText$Editor$viewEditorBlockNode,
									spec_,
									decorations_,
									_List_Nil,
									$author$project$RichText$Editor$markCaretSelectionOnEditorNodes(state_)))
							]))),
					_Utils_Tuple2(
					'selectionstate',
					A3(
						$elm$html$Html$node,
						'selection-state',
						_List_fromArray(
							[
								A2(
								$elm$html$Html$Attributes$attribute,
								'selection',
								A3(
									$author$project$RichText$Editor$selectionAttribute,
									A2($author$project$RichText$Editor$editorToDomSelection, spec_, editor_),
									$author$project$RichText$Internal$Editor$renderCount(editor_),
									$author$project$RichText$Internal$Editor$selectionCount(editor_)))
							]),
						_List_Nil))
				]));
	});
var $author$project$Editor$view = F2(
	function (cfg, model) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('editor-container'),
					A2($elm$html$Html$Attributes$attribute, 'data-gramm_editor', 'false')
				]),
			_List_fromArray(
				[
					A2($author$project$Controls$editorControlPanel, model.bc, model.a),
					A2($author$project$RichText$Editor$view, cfg, model.a),
					$author$project$Controls$renderInsertLinkModal(model.w),
					$author$project$Controls$renderInsertImageModal(model.v)
				]));
	});
var $author$project$Page$Basic$view = function (model) {
	return {
		cs: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Basic example')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('You can use this package to create all sorts of editors. Trying to write\n                    one from scratch can be a little overwhelming though, so the package provides a\n                    default spec and default commands as a jumping off point for your own editor.\n                    In this example, we use the default spec to create an editor which supports\n                    things like headers, lists, as well as links and images.')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('You can see the code for this example in the '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$title('git repo'),
								$elm$html$Html$Attributes$href($author$project$Links$rteToolkit + '/tree/master/docs/src/Page/Basic.elm')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('git repo.')
							]))
					])),
				A2(
				$elm$html$Html$map,
				$author$project$Page$Basic$EditorMsg,
				A2($author$project$Editor$view, $author$project$Page$Basic$config, model.a))
			]),
		ca: 'Basic'
	};
};
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$li = _VirtualDom_node('li');
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Page$Examples$values = _List_fromArray(
	[
		{ao: 0, as: 'This example shows how to set up a minimal ' + 'rich text editor with the default configuration.', ca: 'Basics'},
		{ao: 1, as: 'This example shows how you can switch between a ' + 'plain markdown editor and a fancier rich text editor.', ca: 'Markdown'},
		{ao: 2, as: 'This example shows how you can extend the default specification ' + 'with your own mark and element definitions.', ca: 'Extend a specification'},
		{ao: 3, as: 'This example shows how you can create a new document specification from scratch.', ca: 'New specification'}
	]);
var $author$project$Page$Examples$view = function (_v0) {
	return {
		cs: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Examples of some of the things this toolkit can do')
					])),
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid-list')
					]),
				A2(
					$elm$core$List$map,
					function (v) {
						return A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('blocklink'),
											$author$project$Route$href(v.ao)
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h2,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(v.ca)
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(v.as)
												]))
										]))
								]));
					},
					$author$project$Page$Examples$values))
			]),
		ca: 'Examples'
	};
};
var $author$project$Page$Home$EditorMsg = function (a) {
	return {$: 0, a: a};
};
var $author$project$Page$Home$features = _List_fromArray(
	[
		{as: 'Instead of relying on inconsistent contenteditable APIs, the package depends on other web standards, like mutation observers, that are supported in all evergreen browsers on both desktop and mobile', ca: 'Cross-browser support'},
		{as: 'You can define a document with a custom structure, without having to code the rules from scratch.', ca: 'Customizable specification'},
		{as: 'All logic defining the editor is in Elm.  You don\'t need to write any js at all, and the only javascript you need to include are some pre-requisite webcomponents to bridge the gap between Elm and web APIs it doesn\'t natively support yet.', ca: '100% functional'},
		{as: 'This package follows the guidelines of the Elm architecture and can fit seemlessly into your application.', ca: 'Fits into the Elm Architecture'}
	]);
var $author$project$Page$Home$view = function (model) {
	return {
		cs: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('main-header')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Elm package for building rich text editors')
					])),
				A2(
				$elm$html$Html$map,
				$author$project$Page$Home$EditorMsg,
				A2($author$project$Editor$view, $author$project$Page$Home$config, model.a)),
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Features')
					])),
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('grid-list')
					]),
				A2(
					$elm$core$List$map,
					function (v) {
						return A2(
							$elm$html$Html$li,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(v.ca)
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(v.as)
										]))
								]));
					},
					$author$project$Page$Home$features)),
				A2(
				$elm$html$Html$h2,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('About')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Rich Text Editor Toolkit is an '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://github.com/wolfadex/elm-rte-toolkit/blob/master/LICENSE')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('open source')
							])),
						$elm$html$Html$text(' project that you are free to use commercially. The '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://github.com/wolfadex/elm-rte-toolkit')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('source code is hosted on GitHub.')
							]))
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Contributions in the form of bug reports, pull requests, or thoughtful discussions in the '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://github.com/wolfadex/elm-rte-toolkit/issues')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('GitHub issue tracker')
							])),
						$elm$html$Html$text(' are welcome. Please see the '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$href('https://github.com/wolfadex/elm-rte-toolkit/blob/master/CODE_OF_CONDUCT.md')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Code of Conduct')
							])),
						$elm$html$Html$text(' for our pledge to contributors.')
					]))
			]),
		ca: 'Home'
	};
};
var $elm$html$Html$code = _VirtualDom_node('code');
var $author$project$Page$Markdown$EditorChange = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$Markdown$EditorMsg = function (a) {
	return {$: 0, a: a};
};
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$label = _VirtualDom_node('label');
var $author$project$Page$Markdown$TextAreaChange = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$Page$Markdown$markdownTextArea = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$textarea,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('markdown-textarea'),
						$elm$html$Html$Attributes$value(model.Z),
						A2($elm$html$Html$Attributes$attribute, 'data-gramm_editor', 'false'),
						$elm$html$Html$Events$onInput($author$project$Page$Markdown$TextAreaChange)
					]),
				_List_Nil)
			]));
};
var $author$project$Page$Markdown$markdownOrEditorView = function (model) {
	var editor = (model.K === 1) ? A2(
		$elm$html$Html$map,
		$author$project$Page$Markdown$EditorMsg,
		A2($author$project$Editor$view, $author$project$Page$Markdown$config, model.a)) : $author$project$Page$Markdown$markdownTextArea(model);
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('radio'),
								$elm$html$Html$Attributes$name('editorView'),
								$elm$html$Html$Events$onClick(
								$author$project$Page$Markdown$EditorChange(1)),
								$elm$html$Html$Attributes$checked(model.K === 1)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('editorView')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('WYSIWYG')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('radio'),
								$elm$html$Html$Attributes$name('editorView'),
								$elm$html$Html$Events$onClick(
								$author$project$Page$Markdown$EditorChange(0)),
								$elm$html$Html$Attributes$checked(!model.K)
							]),
						_List_Nil),
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('editorView')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Markdown')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('editor-error')
					]),
				A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					A2(
						$elm$core$Maybe$map,
						function (x) {
							return _List_fromArray(
								[
									$elm$html$Html$text(x)
								]);
						},
						model.V))),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('switch-editor-container')
					]),
				_List_fromArray(
					[editor]))
			]));
};
var $author$project$Page$Markdown$view = function (model) {
	return {
		cs: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Markdown example')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('This is a markdown example.  In combination with the '),
						A2(
						$elm$html$Html$code,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('pablohirafuji/elm-markdown')
							])),
						$elm$html$Html$text(' package, it coverts to and from CommonMark and the editor\'s state.')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('You can see the code for this example in the '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$title('git repo'),
								$elm$html$Html$Attributes$href($author$project$Links$rteToolkit + '/tree/master/docs/src/Page/Markdown.elm')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('git repo.')
							]))
					])),
				$author$project$Page$Markdown$markdownOrEditorView(model)
			]),
		ca: 'Markdown'
	};
};
var $author$project$Page$SpecExtension$EditorMsg = function (a) {
	return {$: 5, a: a};
};
var $author$project$Page$SpecExtension$ShowUpdateCaptionedImageModel = {$: 0};
var $author$project$Page$SpecExtension$InsertCaptionedImage = {$: 4};
var $author$project$Page$SpecExtension$UpdateCaption = function (a) {
	return {$: 3, a: a};
};
var $author$project$Page$SpecExtension$UpdateCaptionedImageAlt = function (a) {
	return {$: 2, a: a};
};
var $author$project$Page$SpecExtension$UpdateCaptionedImageSrc = function (a) {
	return {$: 1, a: a};
};
var $author$project$Page$SpecExtension$renderInsertCaptionedImageModal = function (insertImageModal) {
	return A2(
		$author$project$Controls$modal,
		insertImageModal.aT,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Insert captioned image')
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$name('src'),
								$elm$html$Html$Attributes$value(insertImageModal.b6),
								$elm$html$Html$Attributes$placeholder('Image URL (ex: https://via.placeholder.com/150.png)'),
								$elm$html$Html$Events$onInput($author$project$Page$SpecExtension$UpdateCaptionedImageSrc)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$name('alt'),
								$elm$html$Html$Attributes$value(insertImageModal.bl),
								$elm$html$Html$Attributes$placeholder('Alt text'),
								$elm$html$Html$Events$onInput($author$project$Page$SpecExtension$UpdateCaptionedImageAlt)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$type_('text'),
								$elm$html$Html$Attributes$name('caption'),
								$elm$html$Html$Attributes$value(insertImageModal.bl),
								$elm$html$Html$Attributes$placeholder('Caption'),
								$elm$html$Html$Events$onInput($author$project$Page$SpecExtension$UpdateCaption)
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Page$SpecExtension$InsertCaptionedImage)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Insert')
							]))
					]))
			]));
};
var $author$project$Page$SpecExtension$captionedImageView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Page$SpecExtension$ShowUpdateCaptionedImageModel)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Insert captioned image')
					])),
				$author$project$Page$SpecExtension$renderInsertCaptionedImageModal(model.m)
			]));
};
var $author$project$Page$SpecExtension$view = function (model) {
	return {
		cs: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Extending a specification')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('This example shows how you can extend a specification.  Namely, we add two\n            extra marks for strikethrough and underline, and we add a new block leaf element to\n            display a captioned image.')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('You can see the code for this example in the '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$title('git repo'),
								$elm$html$Html$Attributes$href($author$project$Links$rteToolkit + '/tree/master/docs/src/Page/SpecExtension.elm')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('git repo.')
							]))
					])),
				$author$project$Page$SpecExtension$captionedImageView(model),
				A2(
				$elm$html$Html$map,
				$author$project$Page$SpecExtension$EditorMsg,
				A2($author$project$Editor$view, $author$project$Page$SpecExtension$config, model.a))
			]),
		ca: 'Extending a specification'
	};
};
var $author$project$Page$SpecFromScratch$view = function (model) {
	return {
		cs: _List_fromArray(
			[
				A2(
				$elm$html$Html$h1,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Creating a new specification')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('This example shows how you can create a completely new specification from scratch by\n            making a simple checklist editor.\n            ')
					])),
				A2(
				$elm$html$Html$p,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('You can see the code for this example in the '),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$title('git repo'),
								$elm$html$Html$Attributes$href($author$project$Links$rteToolkit + '/tree/master/docs/src/Page/SpecFromScratch.elm')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('git repo.')
							]))
					])),
				A2($author$project$RichText$Editor$view, $author$project$Page$SpecFromScratch$config, model.a)
			]),
		ca: 'New specification'
	};
};
var $author$project$Main$view = function (model) {
	var viewPage = F3(
		function (page, toMsg, config) {
			var _v1 = A2($author$project$Page$view, page, config);
			var title = _v1.ca;
			var body = _v1.bn;
			return {
				bn: A2(
					$elm$core$List$map,
					$elm$html$Html$map(toMsg),
					body),
				ca: title
			};
		});
	switch (model.$) {
		case 0:
			var session = model.a;
			return A2($author$project$Page$view, 4, $author$project$Page$Home$notFoundView);
		case 1:
			var session = model.a;
			return A2($author$project$Page$view, 4, $author$project$Page$Home$notFoundView);
		case 6:
			var home = model.a;
			return A3(
				viewPage,
				4,
				$author$project$Main$GotHomeMsg,
				$author$project$Page$Home$view(home));
		case 2:
			var basic = model.a;
			return A3(
				viewPage,
				0,
				$author$project$Main$GotBasicMsg,
				$author$project$Page$Basic$view(basic));
		case 5:
			var md = model.a;
			return A3(
				viewPage,
				1,
				$author$project$Main$GotMarkdownMsg,
				$author$project$Page$Markdown$view(md));
		case 3:
			var se = model.a;
			return A3(
				viewPage,
				2,
				$author$project$Main$GotSpecExtensionMsg,
				$author$project$Page$SpecExtension$view(se));
		case 4:
			var sfs = model.a;
			return A3(
				viewPage,
				3,
				$author$project$Main$GotSpecFromScratchMsg,
				$author$project$Page$SpecFromScratch$view(sfs));
		default:
			var examples = model.a;
			return A3(
				viewPage,
				5,
				$author$project$Main$GotExamplesMsg,
				$author$project$Page$Examples$view(examples));
	}
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{cI: $author$project$Main$init, cS: $author$project$Main$ChangedUrl, cT: $author$project$Main$ClickedLink, c6: $author$project$Main$subscriptions, c8: $author$project$Main$update, c9: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));