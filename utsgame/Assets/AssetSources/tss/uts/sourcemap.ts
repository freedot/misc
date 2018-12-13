// https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1
// 目前不继续完善该类，等duk新版本发布自动支持sourcemap

interface SourceMapSpan {
    /** Line number in the .js file. */
    emittedLine: number;
    /** Column number in the .js file. */
    emittedColumn: number;
    /** Line number in the .ts file. */
    sourceLine: number;
    /** Column number in the .ts file. */
    sourceColumn: number;
    /** Optional name (index into names array) associated with this span. */
    nameIndex?: number;
    /** .ts file (index into sources array) associated with this span */
    sourceIndex: number;
}
 
interface MapLines {
    [index: string]: Array<SourceMapSpan>;
}

interface SMap {
    version: string,
    exist: boolean,
    file: string,
    sourceRoot: string,
    sources: Array<string>,
    names: Array<string>,
    maplines: MapLines,
}

module SourceMapDecoder {
    let sourceMapMappings: string;
    let sourceMapNames: string[];
    let decodingIndex: number;
    let prevNameIndex: number;
    let decodeOfEncodedMapping: SourceMapSpan;
    let errorDecodeOfEncodedMapping: string;

    export function initializeSourceMapDecoding(map: SMap, mapraw:string) {
        sourceMapMappings = mapraw;
        sourceMapNames = map.names;
        decodingIndex = 0;
        prevNameIndex = 0;
        decodeOfEncodedMapping = {
            emittedLine: 1,
            emittedColumn: 1,
            sourceLine: 1,
            sourceColumn: 1,
            sourceIndex: 0,
        };
        errorDecodeOfEncodedMapping = undefined;
    }

    function isSourceMappingSegmentEnd() {
        if (decodingIndex === sourceMapMappings.length) {
            return true;
        }

        if (sourceMapMappings.charAt(decodingIndex) == ",") {
            return true;
        }

        if (sourceMapMappings.charAt(decodingIndex) == ";") {
            return true;
        }

        return false;
    }

    export function decodeNextEncodedSourceMapSpan() {
        errorDecodeOfEncodedMapping = undefined;

        function createErrorIfCondition(condition: boolean, errormsg: string) {
            if (errorDecodeOfEncodedMapping) {
                // there was existing error:
                return true;
            }

            if (condition) {
                errorDecodeOfEncodedMapping = errormsg;
            }

            return condition;
        }

        function base64VLQFormatDecode() {
            function base64FormatDecode() {
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(sourceMapMappings.charAt(decodingIndex));
            }

            let moreDigits = true;
            let shiftCount = 0;
            let value = 0;

            for (; moreDigits; decodingIndex++) {
                if (createErrorIfCondition(decodingIndex >= sourceMapMappings.length, "Error in decoding base64VLQFormatDecode, past the mapping string")) {
                    return;
                }

                // 6 digit number
                const currentByte = base64FormatDecode();

                // If msb is set, we still have more bits to continue
                moreDigits = (currentByte & 32) !== 0;

                // least significant 5 bits are the next msbs in the final value.
                value = value | ((currentByte & 31) << shiftCount);
                shiftCount += 5;
            }

            // Least significant bit if 1 represents negative and rest of the msb is actual absolute value
            if ((value & 1) === 0) {
                // + number
                value = value >> 1;
            }
            else {
                // - number
                value = value >> 1;
                value = -value;
            }

            return value;
        }

        while (decodingIndex < sourceMapMappings.length) {
            if (sourceMapMappings.charAt(decodingIndex) == ";") {
                // New line
                decodeOfEncodedMapping.emittedLine++;
                decodeOfEncodedMapping.emittedColumn = 1;
                decodingIndex++;
                continue;
            }

            if (sourceMapMappings.charAt(decodingIndex) == ",") {
                // Next entry is on same line - no action needed
                decodingIndex++;
                continue;
            }

            // Read the current span
            // 1. Column offset from prev read jsColumn
            decodeOfEncodedMapping.emittedColumn += base64VLQFormatDecode();
            // Incorrect emittedColumn dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.emittedColumn < 1, "Invalid emittedColumn found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // Dont support reading mappings that dont have information about original source and its line numbers
            if (createErrorIfCondition(isSourceMappingSegmentEnd(), "Unsupported Error Format: No entries after emitted column")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // 2. Relative sourceIndex
            decodeOfEncodedMapping.sourceIndex += base64VLQFormatDecode();
            // Incorrect sourceIndex dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.sourceIndex < 0, "Invalid sourceIndex found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // Dont support reading mappings that dont have information about original source span
            if (createErrorIfCondition(isSourceMappingSegmentEnd(), "Unsupported Error Format: No entries after sourceIndex")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // 3. Relative sourceLine 0 based
            decodeOfEncodedMapping.sourceLine += base64VLQFormatDecode();
            // Incorrect sourceLine dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.sourceLine < 1, "Invalid sourceLine found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // Dont support reading mappings that dont have information about original source and its line numbers
            if (createErrorIfCondition(isSourceMappingSegmentEnd(), "Unsupported Error Format: No entries after emitted Line")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // 4. Relative sourceColumn 0 based
            decodeOfEncodedMapping.sourceColumn += base64VLQFormatDecode();
            // Incorrect sourceColumn dont support this map
            if (createErrorIfCondition(decodeOfEncodedMapping.sourceColumn < 1, "Invalid sourceLine found")) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }
            // 5. Check if there is name:
            if (!isSourceMappingSegmentEnd()) {
                prevNameIndex += base64VLQFormatDecode();
                decodeOfEncodedMapping.nameIndex = prevNameIndex;
                // Incorrect nameIndex dont support this map
                if (createErrorIfCondition(decodeOfEncodedMapping.nameIndex < 0 || decodeOfEncodedMapping.nameIndex >= sourceMapNames.length, "Invalid name index for the source map entry")) {
                    return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
                }
            }
            // Dont support reading mappings that dont have information about original source and its line numbers
            if (createErrorIfCondition(!isSourceMappingSegmentEnd(), "Unsupported Error Format: There are more entries after " + (decodeOfEncodedMapping.nameIndex === -1 ? "sourceColumn" : "nameIndex"))) {
                return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
            }

            // Populated the entry
            return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
        }

        createErrorIfCondition(/*condition*/ true, "No encoded entry found");
        return { error: errorDecodeOfEncodedMapping, sourceMapSpan: decodeOfEncodedMapping };
    }

    export function hasCompletedDecoding() {
        return decodingIndex === sourceMapMappings.length;
    }

    export function getRemainingDecodeString() {
        return sourceMapMappings.substr(decodingIndex);
    }
}

class SourceMap {
    private _maps: { [index: string]: SMap; } = {};

    public getSourceLine(file: string, line: number): { file: string, line: number } {
        let map = this.getMap(file)
        if (!map.exist) {
            return { file: file, line: -1 };
        }

        let lineSegments = map.maplines[line];
        if (lineSegments == null) {
            return { file: map.sources[0], line: -1 };
        }

        if (lineSegments[0] == null) {
            return { file: map.sources[0], line: -1 };
        }

        return { file: map.sources[0], line: lineSegments[0].sourceLine || 0 };
    }

    public getMap(file: string): SMap {
        let map_file = file + '.map'
        let map = this._maps[map_file]
        if (map != null) return map;

        let s = __read_file(map_file);
        if (s == "" || s == null) {
            this._maps[map_file] = this.getEmptyMap()
            return this._maps[map_file]
        }

        this._maps[map_file] = this.getEmptyMap()
        map = this._maps[map_file];
        map.exist = true;
        map.version = this.getFieldByName(s, 'version');
        map.file = this.getFieldByName(s, 'file');
        map.sourceRoot = this.getFieldByName(s, 'sourceRoot');
        map.sources = this.getFieldsByName(s, 'sources');
        map.names = this.getFieldsByName(s, 'names');
        map.maplines = this.getMaplines(s, 'mappings', map);

        return map;
    }

    private getFieldByName(s: string, field: string): string {
        field = '\"' + field + '\":';
        let pos = s.indexOf(field);
        if (pos < 0) {
            return '';
        }

        pos += field.length;
        let startToken = s.charAt(pos);
        let endToken = '';
        if (startToken == '"') {
            endToken = '"';
            pos++;
        }
        else if (startToken == '[') {
            endToken = ']';
            pos++;
        }
        else {
            endToken = ',';
        }

        let endPos = s.indexOf(endToken, pos);
        if (endPos < 0 && endToken == ',') {
            endPos = s.indexOf('}', pos);
        }
        if (endPos < 0) {
            endPos = s.length;
        }
        return s.substring(pos, endPos);
    }

    private getFieldsByName(s: string, field: string): Array<string> {
        let value = this.getFieldByName(s, field);
        let arr = value.split(',');
        for (let i = 0, n = arr.length; i < n; i++) {
            if (arr[i].charAt(0) == '"') {
                arr[i] = arr[i].slice(1, -1);
            }
        }
        return arr;
    }

    private getMaplines(s: string, field: string, map: SMap): MapLines {
        let maplines: MapLines = {};
        let mapraw = this.getFieldByName(s, field);
        SourceMapDecoder.initializeSourceMapDecoding(map, mapraw);
        while (!SourceMapDecoder.hasCompletedDecoding()) {
            let rt = SourceMapDecoder.decodeNextEncodedSourceMapSpan();
            if (rt.error) return maplines;
            if (!maplines[rt.sourceMapSpan.emittedLine]) {
                maplines[rt.sourceMapSpan.emittedLine] = [];
            }

            maplines[rt.sourceMapSpan.emittedLine].push(this.cloneMapSpan(rt.sourceMapSpan));
        }
        return maplines;
    }

    private getEmptyMap(): SMap {
        return {
            version: '3',
            exist: false,
            file: '',
            sourceRoot: '',
            sources: null,
            names: null,
            maplines: null, 
        };
    }

    private cloneMapSpan(s: SourceMapSpan): SourceMapSpan {
        return {
            emittedLine: s.emittedLine,
            emittedColumn: s.emittedColumn,
            sourceLine: s.sourceLine,
            sourceColumn: s.sourceColumn,
            nameIndex: s.nameIndex,
            sourceIndex: s.sourceIndex
        };
    }
}

let __sm = new SourceMap();
export = __sm;
