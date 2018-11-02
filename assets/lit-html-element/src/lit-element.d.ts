import { TemplateResult } from '../node_modules/lit-html/lit-html.js';
export { html } from '../node_modules/lit-html/lib/lit-extended.js';
export { TemplateResult } from '../node_modules/lit-html/lit-html.js';
export interface PropertyOptions {
    type?: BooleanConstructor | DateConstructor | NumberConstructor | StringConstructor | ArrayConstructor | ObjectConstructor;
    value?: any;
    attrName?: string;
    computed?: string;
}
export interface ListenerOptions {
    target: string | EventTarget;
    eventName: string;
    handler: Function;
}
export interface Map<T> {
    [key: string]: T;
}
export declare function createProperty(prototype: any, propertyName: string, options?: PropertyOptions): void;
export declare function whenAllDefined(result: TemplateResult): Promise<void[]>;
export declare class LitElement extends HTMLElement {
    private _needsRender;
    private _lookupCache;
    private _attrMap;
    private _deps;
    __values__: Map<any>;
    _setPropertyValue(propertyName: string, newValue: any): void;
    _setPropertyValueFromAttributeValue(attrName: string, newValue: any): void;
    _setAttributeValue(attrName: string, value: any, typeFn: any): void;
    static readonly properties: Map<PropertyOptions>;
    static readonly listeners: Array<ListenerOptions>;
    static readonly observedAttributes: string[];
    constructor();
    static withProperties(): typeof LitElement;
    renderCallback(): void;
    render(self: any): TemplateResult;
    attributeChangedCallback(attrName: string, _oldValue: string, newValue: string): void;
    connectedCallback(): void;
    invalidate(): Promise<void>;
    $(id: string): HTMLElement;
}
