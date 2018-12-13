declare function __bugReport(msg);
declare function __log(msg);
declare function __logWarning(msg);
declare function __logError(msg);
declare function __read_file(path): string;
declare function __workSpace(): string;
declare class __DynBind {
    constructor(cls: string, ...args);
    __call(id: number, method: string, ...args);
    __set(attr: string, val: any);
    __get(attr: string, retType:number, rtype?:any): any;
    static __call(id: number, method: string, ...args);
    static __as(o: any, toTypeName: string, toType: any):any;
}
declare module Duktape {
    export function gc();
    export function fin(prototype, fun);
}
