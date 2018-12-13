///<reference path="declare/uts.d.ts"/>
import sm = require('./sourcemap');
export enum RET_TYPE {
    VOID = 0,
    NUMBER = 1,
    STRING = 2,
    BOOL = 3,
    FUN = 4,
    ARRAY = 5,
    DICT = 6,
    CLASSOBJECT = 7,
    MULTIDICT = 8,
}

export enum ARG_TYPE {
    OBJECT = 0,
    CSOBJECT = 1,
    CALLBACK = 2, 
    NUMBER = 3,
    STRING = 4,
    BOOL = 5,
    FUN = 6,
    ARRAY = 7,
    DICT = 8,
}

export function delegate(thisobj, caller) {
    return function (...args) {
        try {
            caller.apply(thisobj, args);
        }
        catch (e) {
            bugReport(e.stack || e);
        }
    }
}

export function gc(){
    Duktape.gc();
}

export function finalizer(prototype, fun) {
    Duktape.fin(prototype, fun);
}

export function handleStack(stack: string): string {
    let newstack = '';
    let stacks = stack.split('\n');
    for (let frame of stacks) {
        frame = frame.trim().replace(/\\/g, '/');
        let groups = frame.match(/^at\s+([\[\]\w]+)\s+\(([\w\/\.]+):(\d+)(.*)/); // matching:  at main (Assets/Resources/tss/.dist/test.js:15)
        if (groups == null) {
            newstack += frame + '\n';
            continue;
        }
        
        let method = groups[1];
        let file = groups[2].replace(/\.js$/, ''); // remove .js 
        let fullfile = file.indexOf('Assets') == 0 ? file : __workSpace() + file;
        let lineno = Number(groups[3]);
        let rt = sm.getSourceLine(fullfile + '.js', lineno);
        if (rt.line < 0) {
            newstack += frame + '\n';
            continue;
        }

        newstack += '    ' + method + ' ';
        newstack += fullfile + '.ts:' + rt.line + ' ';
        newstack += groups[4] + '\n';
    }
    return newstack;
}

export function bugReport(s: string) {
    __bugReport(handleStack(s));
}

export function log(s: string) {
    __log(s);
}

export function logError(s: string) {
    __logError(s);
}

export function logWarning(s: string) {
    __logWarning(s);
}

export function logSuccess(s: string) {
    __log('<color=green>' + s + '</color>');
}

export function logFailure(s: string) {
    __log('<color=red>' + s + '</color>');
}


