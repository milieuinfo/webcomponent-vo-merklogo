import { PropertyOptions } from './lit-element.js';
export declare function customElement(tagname: string): (clazz: any) => void;
export declare function property(options?: PropertyOptions): (prototype: any, propertyName: string) => any;
export declare function attribute(attrName: string): (prototype: any, propertyName: string) => any;
export declare function computed<T = any>(...targets: (keyof T)[]): (prototype: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export declare function listen(eventName: string, target: string | EventTarget): (prototype: any, methodName: string) => void;
