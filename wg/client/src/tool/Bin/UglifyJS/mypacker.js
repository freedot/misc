var fs = require('fs');
var uglify = require('./uglify-js.js')

var options = {
        ast: false,
        consolidate: false,
        mangle: true,
        mangle_toplevel: false,
        no_mangle_functions: false,
        squeeze: true,
        make_seqs: true,
        dead_code: true,
        verbose: false,
        show_copyright: true,
        out_same_file: false,
        max_line_length: 32 * 1024,
        unsafe: false,
        reserved_names: null,
        defines: { },
        lift_vars: false,
        codegen_options: {
                ascii_only: false,
                beautify: false,
                indent_level: 4,
                indent_start: 0,
                quote_keys: false,
                space_colon: false,
                inline_script: false
        },
        make: false,
		strict_semicolons: true,
        output: true            // stdout
};

function loadInputFile(fileName) {
	var s = '';
	try{
		s = fs.readFileSync(fileName, encoding='utf8');
	} 
	catch(e) {
		return '';
	}
	return s;
}

function saveOutputFile(fileName, ps) {
	try{
		fs.writeFileSync(fileName, ps, encoding='utf8');
	} 
	catch(e) {
	}
}

function conventJs(inputName, outputName) {
	var s = loadInputFile(inputName);
	if ( s == '' ) {
		return;
	}
	
	var ps = uglify(s, options);
	saveOutputFile(outputName, ps);
}

var inputName = process.argv[2];
var outputName = process.argv[3];
conventJs(inputName, outputName);





