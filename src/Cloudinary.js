
var _ = require('lodash');

var appConfig = require('./appConfig.json').cloudinary;


var cloudinary = module.exports;

var  $ = {
	cloudinary: {}
};
var config = $.cloudinary.config = function(){
	return appConfig;
};

//exports.utils = require("cloudinary/lib/utils");

var option_consume = exports.option_consume = function(options, option_name, default_value) {
	var result;
	result = options[option_name];
	delete options[option_name];
	if (result != null) {
		return result;
	} else {
		return default_value;
	}
};

exports.url = function(public_id, options) {
	options = _.extend({}, options);
	return url(public_id, options);
};

var html_attrs = function(attrs) {
	var pairs;
	pairs = _.filter(_.map(attrs, function(value, key) {
		return join_pair(key, value);
	}));
	pairs.sort();
	return pairs.join(" ");
};

var   finalize_resource_type = function(resource_type, type, url_suffix, use_root_path, shorten) {
	if (type == null) {
		type = 'upload';
	}
	if (url_suffix != null) {
		if (resource_type === 'image' && type === 'upload') {
			resource_type = "images";
			type = null;
		} else if (resource_type === 'raw' && type === 'upload') {
			resource_type = 'files';
			type = null;
		} else {
			throw new Error("URL Suffix only supported for image/upload and raw/upload");
		}
	}
	if (use_root_path) {
		if ((resource_type === 'image' && type === 'upload') || (resource_type === 'images' && (type == null))) {
			resource_type = null;
			type = null;
		} else {
			throw new Error("Root path only supported for image/upload");
		}
	}
	if (shorten && resource_type === 'image' && type === 'upload') {
		resource_type = 'iu';
		type = null;
	}
	return [resource_type, type];
};

var unsigned_url_prefix = function(source, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution) {
	var cdn_part, host, prefix, shared_domain, subdomain, subdomain_part;
	if (cloud_name.indexOf("/") === 0) {
		return '/res' + cloud_name;
	}
	shared_domain = !private_cdn;
	if (secure) {
		if ((secure_distribution == null) || secure_distribution === exports.OLD_AKAMAI_SHARED_CDN) {
			secure_distribution = private_cdn ? cloud_name + "-res.cloudinary.com" : exports.SHARED_CDN;
		}
		if (shared_domain == null) {
			shared_domain = secure_distribution === exports.SHARED_CDN;
		}
		if ((secure_cdn_subdomain == null) && shared_domain) {
			secure_cdn_subdomain = cdn_subdomain;
		}
		if (secure_cdn_subdomain) {
			secure_distribution = secure_distribution.replace('res.cloudinary.com', 'res-' + ((crc32(source) % 5) + 1 + '.cloudinary.com'));
		}
		prefix = 'https://' + secure_distribution;
	} else if (cname) {
		subdomain = cdn_subdomain ? 'a' + ((crc32(source) % 5) + 1) + '.' : '';
		prefix = 'http://' + subdomain + cname;
	} else {
		cdn_part = private_cdn ? cloud_name + '-' : '';
		subdomain_part = cdn_subdomain ? '-' + ((crc32(source) % 5) + 1) : '';
		host = [cdn_part, 'res', subdomain_part, '.cloudinary.com'].join('');
		prefix = 'http://' + host;
	}
	if (shared_domain) {
		prefix += '/' + cloud_name;
	}
	return prefix;
};

var smart_escape = function(string) {
	return encodeURIComponent(string).replace(/%3A/g, ":").replace(/%2F/g, "/");
};

utf8_encode = function(argString) {
	var c1, enc, end, n, start, string, stringl, utftext;
	if (argString == null) {
		return "";
	}
	string = argString + "";
	utftext = "";
	start = void 0;
	end = void 0;
	stringl = 0;
	start = end = 0;
	stringl = string.length;
	n = 0;
	while (n < stringl) {
		c1 = string.charCodeAt(n);
		enc = null;
		if (c1 < 128) {
			end++;
		} else if (c1 > 127 && c1 < 2048) {
			enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
		} else {
			enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
		}
		if (enc !== null) {
			if (end > start) {
				utftext += string.slice(start, end);
			}
			utftext += enc;
			start = end = n + 1;
		}
		n++;
	}
	if (end > start) {
		utftext += string.slice(start, stringl);
	}
	return utftext;
};

 var crc32 = function(str) {
	var crc, i, iTop, table, x, y;
	str = utf8_encode(str);
	table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
	crc = 0;
	x = 0;
	y = 0;
	crc = crc ^ (-1);
	i = 0;
	iTop = str.length;
	while (i < iTop) {
		y = (crc ^ str.charCodeAt(i)) & 0xFF;
		x = "0x" + table.substr(y * 9, 8);
		crc = (crc >>> 8) ^ x;
		i++;
	}
	crc = crc ^ (-1);
	if (crc < 0) {
		crc += 4294967296;
	}
	return crc;
};


var build_array = function(arg) {
	if (arg == null) {
		return [];
	} else if (_.isArray(arg)) {
		return arg;
	} else {
		return [arg];
	}
};

var present = function(value) {
	return !_.isUndefined(value) && ("" + value).length > 0;
};

var   norm_range_value = function(value) {
	var modifier, offset;
	offset = String(value).match(RegExp("^" + offset_any_pattern + "$"));
	if (offset) {
		modifier = offset[5] ? 'p' : '';
		value = "" + (offset[1] || offset[4]) + modifier;
	}
	return value;
};


var number_pattern = "([0-9]*)\\.([0-9]+)|([0-9]+)";

var offset_any_pattern = "(" + number_pattern + ")([%pP])?";

var offset_any_pattern_re = RegExp("(" + offset_any_pattern + ")\\.\\.(" + offset_any_pattern + ")");

var split_range = function(range) {
	switch (range.constructor) {
		case String:
			if (offset_any_pattern_re = ~range) {
				return range.split("..");
			}
			break;
		case Array:
			return [_.first(range), _.last(range)];
		default:
			return [null, null];
	}
};



//exports.cloudinary_js_config = cloudinary_js_config;

exports.BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
//exports.v2 = require('./lib/v2');


var generate_transformation_string = function(options) {
	var angle, background, base_transformation, base_transformations, border, color, crop, dpr, effect, flags, has_layer, height, j, key, len, named_transformation, no_html_sizes, param, params, range_value, ref, ref1, ref2, ref3, ref4, ref5, responsive_width, responsive_width_transformation, result, short, simple_params, size, transformations, value, width;
	if (_.isArray(options)) {
		result = (function() {
			var j, len, results;
			results = [];
			for (j = 0, len = options.length; j < len; j++) {
				base_transformation = options[j];
				results.push(generate_transformation_string(_.clone(base_transformation)));
			}
			return results;
		})();
		return result.join("/");
	}
	responsive_width = option_consume(options, "responsive_width", config().responsive_width);
	width = options["width"];
	height = options["height"];
	size = option_consume(options, "size");
	if (size) {
		ref1 = (ref = size.split("x"), width = ref[0], height = ref[1], ref), options["width"] = ref1[0], options["height"] = ref1[1];
	}
	has_layer = options.overlay || options.underlay;
	crop = option_consume(options, "crop");
	angle = build_array(option_consume(options, "angle")).join(".");
	no_html_sizes = has_layer || present(angle) || crop === "fit" || crop === "limit" || responsive_width;
	if (width && (width === "auto" || no_html_sizes || parseFloat(width) < 1)) {
		delete options["width"];
	}
	if (height && (no_html_sizes || parseFloat(height) < 1)) {
		delete options["height"];
	}
	background = option_consume(options, "background");
	background = background && background.replace(/^#/, "rgb:");
	color = option_consume(options, "color");
	color = color && color.replace(/^#/, "rgb:");
	base_transformations = build_array(option_consume(options, "transformation", []));
	named_transformation = [];
	if (_.filter(base_transformations, _.isObject).length > 0) {
		base_transformations = _.map(base_transformations, function(base_transformation) {
			if (_.isObject(base_transformation)) {
				return generate_transformation_string(_.clone(base_transformation));
			} else {
				return generate_transformation_string({
					transformation: base_transformation
				});
			}
		});
	} else {
		named_transformation = base_transformations.join(".");
		base_transformations = [];
	}
	effect = option_consume(options, "effect");
	if (_.isArray(effect)) {
		effect = effect.join(":");
	} else if (_.isObject(effect)) {
		for (key in effect) {
			value = effect[key];
			effect = key + ":" + value;
		}
	}
	border = option_consume(options, "border");
	if (_.isObject(border)) {
		border = ((ref2 = border.width) != null ? ref2 : 2) + "px_solid_" + (((ref3 = border.color) != null ? ref3 : "black").replace(/^#/, 'rgb:'));
	} else if (/^\d+$/.exec(border)) {
		options.border = border;
		border = void 0;
	}
	flags = build_array(option_consume(options, "flags")).join(".");
	dpr = option_consume(options, "dpr", config().dpr);
	if (options["offset"] != null) {
		ref4 = split_range(option_consume(options, "offset")), options["start_offset"] = ref4[0], options["end_offset"] = ref4[1];
	}
	params = {
		c: crop,
		t: named_transformation,
		w: width,
		h: height,
		b: background,
		co: color,
		e: effect,
		a: angle,
		bo: border,
		fl: flags,
		dpr: dpr
	};
	simple_params = {
		audio_codec: "ac",
		audio_frequency: "af",
		bit_rate: 'br',
		color_space: "cs",
		default_image: "d",
		delay: "dl",
		density: "dn",
		duration: "du",
		end_offset: "eo",
		fetch_format: "f",
		gravity: "g",
		opacity: "o",
		overlay: "l",
		page: "pg",
		prefix: "p",
		quality: "q",
		radius: "r",
		start_offset: "so",
		underlay: "u",
		video_codec: "vc",
		video_sampling: "vs",
		x: "x",
		y: "y",
		zoom: "z"
	};
	for (param in simple_params) {
		short = simple_params[param];
		params[short] = option_consume(options, param);
	}
	if (params["vc"] != null) {
		params["vc"] = process_video_params(params["vc"]);
	}
	ref5 = ["so", "eo", "du"];
	for (j = 0, len = ref5.length; j < len; j++) {
		range_value = ref5[j];
		if (range_value in params) {
			params[range_value] = norm_range_value(params[range_value]);
		}
	}
	params = _.sortBy((function() {
		var results;
		results = [];
		for (key in params) {
			value = params[key];
			results.push([key, value]);
		}
		return results;
	})(), function(key, value) {
		return key;
	});
	params.push([option_consume(options, "raw_transformation")]);
	transformations = ((function() {
		var l, len1, results;
		results = [];
		for (l = 0, len1 = params.length; l < len1; l++) {
			param = params[l];
			if (present(_.last(param))) {
				results.push(param.join("_"));
			}
		}
		return results;
	})()).join(",");
	base_transformations.push(transformations);
	transformations = base_transformations;
	if (responsive_width) {
		responsive_width_transformation = config().responsive_width_transformation || DEFAULT_RESPONSIVE_WIDTH_TRANSFORMATION;
		transformations.push(generate_transformation_string(_.clone(responsive_width_transformation)));
	}
	if (width === "auto" || responsive_width) {
		options.responsive = true;
	}
	if (dpr === "auto") {
		options.hidpi = true;
	}
	return _.filter(transformations, present).join("/");
};
function cloudinary_url_prefix(public_id, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution, protocol) {
	if (cloud_name.match(/^\//) && !secure) {
		return "/res" + cloud_name;
	}

	var prefix = secure ? 'https://' : (window.location.protocol === 'file:' ? "file://" : 'http://');
	prefix = protocol ? protocol + '//' : prefix;

	var shared_domain = !private_cdn;
	if (secure) {
		if (!secure_distribution || secure_distribution == OLD_AKAMAI_SHARED_CDN) {
			secure_distribution = private_cdn ? cloud_name + "-res.cloudinary.com" : SHARED_CDN;
		}
		shared_domain = shared_domain || secure_distribution == SHARED_CDN;
		if (secure_cdn_subdomain == null && shared_domain) {
			secure_cdn_subdomain = cdn_subdomain;
		}
		if (secure_cdn_subdomain) {
			secure_distribution = secure_distribution.replace('res.cloudinary.com', "res-" + ((crc32(public_id) % 5) + 1) + ".cloudinary.com");
		}
		prefix += secure_distribution;
	} else if (cname) {
		var subdomain = cdn_subdomain ? "a" + ((crc32(public_id) % 5) + 1) + "." : "";
		prefix += subdomain + cname;
	} else {
		prefix += (private_cdn ? cloud_name + "-res" : "res");
		prefix += (cdn_subdomain ? "-" + ((crc32(public_id) % 5) + 1) : "");
		prefix += ".cloudinary.com";
	}
	if (shared_domain) prefix += "/" + cloud_name;
	return prefix;
}




function cloudinary_url(public_id, options) {
	options = options || {};
	var type = option_consume(options, 'type', 'upload');
	if (type == 'fetch') {
		options.fetch_format = options.fetch_format || option_consume(options, 'format');
	}
	var transformation = generate_transformation_string(options);
	var resource_type = option_consume(options, 'resource_type', "image");
	var version = option_consume(options, 'version');
	var format = option_consume(options, 'format');
	var cloud_name = option_consume(options, 'cloud_name', $.cloudinary.config().cloud_name);
	if (!cloud_name) throw "Unknown cloud_name";
	var private_cdn = option_consume(options, 'private_cdn', $.cloudinary.config().private_cdn);
	var secure_distribution = option_consume(options, 'secure_distribution', $.cloudinary.config().secure_distribution);
	var cname = option_consume(options, 'cname', $.cloudinary.config().cname);
	var cdn_subdomain = option_consume(options, 'cdn_subdomain', $.cloudinary.config().cdn_subdomain);
	var secure_cdn_subdomain = option_consume(options, 'secure_cdn_subdomain', $.cloudinary.config().secure_cdn_subdomain);
	var shorten = option_consume(options, 'shorten', $.cloudinary.config().shorten);
	var secure = option_consume(options, 'secure', window.location.protocol == 'https:');
	var protocol = option_consume(options, 'protocol', $.cloudinary.config().protocol);
	var trust_public_id = option_consume(options, 'trust_public_id');
	var url_suffix = option_consume(options, 'url_suffix');
	var use_root_path = option_consume(options, 'use_root_path', $.cloudinary.config().use_root_path);

	if (url_suffix && !private_cdn) {
		throw "URL Suffix only supported in private CDN";
	}

	if (type == 'fetch') {
		public_id = absolutize(public_id);
	}

	if (public_id.search("/") >= 0 && !public_id.match(/^v[0-9]+/) && !public_id.match(/^https?:\//) && !present(version)) {
		version = 1;
	}

	if (public_id.match(/^https?:/)) {
		if (type == "upload" || type == "asset") return public_id;
		public_id = encodeURIComponent(public_id).replace(/%3A/g, ":").replace(/%2F/g, "/");
	} else {
		// Make sure public_id is URI encoded.
		public_id = encodeURIComponent(decodeURIComponent(public_id)).replace(/%3A/g, ":").replace(/%2F/g, "/");
		if (url_suffix) {
			if (url_suffix.match(/[\.\/]/)) throw "url_suffix should not include . or /";
			public_id = public_id + "/" + url_suffix;
		}
		if (format) {
			if (!trust_public_id) public_id = public_id.replace(/\.(jpg|png|gif|webp)$/, '');
			public_id = public_id + "." + format;
		}
	}

	var resource_type_and_type = finalize_resource_type(resource_type, type, url_suffix, use_root_path, shorten);
	var prefix = cloudinary_url_prefix(public_id, cloud_name, private_cdn, cdn_subdomain, secure_cdn_subdomain, cname, secure, secure_distribution, protocol);
	var url = [prefix, resource_type_and_type, transformation, version ? "v" + version : "",
		public_id].join("/").replace(/([^:])\/+/g, '$1/');

	url = url.replace(/,/, '/');
	return url;
}



exports.url = cloudinary_url;
