/// BareSpecifier=@polymer/lit-element/test/lit-element_test2
/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
import { html, LitElement } from '../lit-element.js';
import { stripExpressionDelimeters, generateElementName } from './test-helpers.js';
const assert = chai.assert;
suite('LitElement', () => {
    let container;
    setup(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });
    teardown(() => {
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
    });
    test('renders initial content into shadowRoot', async () => {
        const rendered = `hello world`;
        const name = generateElementName();
        customElements.define(name, class extends LitElement {
            render() {
                return html`${rendered}`;
            }
        });
        const el = document.createElement(name);
        container.appendChild(el);
        await new Promise(resolve => {
            setTimeout(() => {
                assert.ok(el.shadowRoot);
                assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), rendered);
                resolve();
            });
        });
    });
    test('invalidate waits until update/rendering', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.updated = 0;
            }
            render() {
                return html`${++this.updated}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.invalidate();
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '1');
        await el.invalidate();
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '2');
        await el.invalidate();
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '3');
    });
    test('updateComplete waits for invalidate but does not trigger invalidation, async', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.updated = 0;
            }
            render() {
                return html`${++this.updated}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '1');
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '1');
        el.invalidate();
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '2');
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '2');
    });
    test('shouldUpdate controls update/rendering', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.needsUpdate = true;
                this.updated = 0;
            }
            shouldUpdate() {
                return this.needsUpdate;
            }
            render() {
                return html`${++this.updated}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '1');
        el.needsUpdate = false;
        await el.invalidate();
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '1');
        el.needsUpdate = true;
        await el.invalidate();
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '2');
        await el.invalidate();
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '3');
    });
    test('can set render target to light dom', async () => {
        const rendered = `hello world`;
        const name = generateElementName();
        customElements.define(name, class extends LitElement {
            render() {
                return html`${rendered}`;
            }
            createRenderRoot() {
                return this;
            }
        });
        const el = document.createElement(name);
        container.appendChild(el);
        await el.updateComplete;
        assert.notOk(el.shadowRoot);
        assert.equal(stripExpressionDelimeters(el.innerHTML), rendered);
    });
    test('renders when created via constructor', async () => {
        const rendered = `hello world`;
        class E extends LitElement {
            render() {
                return html`${rendered}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.ok(el.shadowRoot);
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), rendered);
    });
    test('property options', async () => {
        const shouldInvalidate = (value, old) => old === undefined || value > old;
        const fromAttribute = value => parseInt(value);
        const toAttribute = value => `${value}-attr`;
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.noAttr = 'noAttr';
                this.atTr = 'attr';
                this.customAttr = 'customAttr';
                this.shouldInvalidate = 10;
                this.fromAttribute = 1;
                this.toAttribute = 1;
                this.all = 10;
                this.updated = 0;
            }
            static get properties() {
                return {
                    noAttr: { attribute: false },
                    atTr: { attribute: true },
                    customAttr: { attribute: 'custom', reflect: true },
                    shouldInvalidate: { shouldInvalidate },
                    fromAttribute: { type: fromAttribute },
                    toAttribute: { reflect: true, type: { toAttribute } },
                    all: { attribute: 'all-attr', shouldInvalidate, type: { fromAttribute, toAttribute }, reflect: true }
                };
            }
            update(changed) {
                this.updated++;
                super.update(changed);
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.updated, 1);
        assert.equal(el.noAttr, 'noAttr');
        assert.equal(el.atTr, 'attr');
        assert.equal(el.customAttr, 'customAttr');
        assert.equal(el.shouldInvalidate, 10);
        assert.equal(el.fromAttribute, 1);
        assert.equal(el.toAttribute, 1);
        assert.equal(el.getAttribute('toattribute'), '1-attr');
        assert.equal(el.all, 10);
        assert.equal(el.getAttribute('all-attr'), '10-attr');
        el.setAttribute('noattr', 'noAttr2');
        el.setAttribute('attr', 'attr2');
        el.setAttribute('custom', 'customAttr2');
        el.setAttribute('fromattribute', '2attr');
        el.toAttribute = 2;
        el.all = 5;
        await el.updateComplete;
        assert.equal(el.updated, 2);
        assert.equal(el.noAttr, 'noAttr');
        assert.equal(el.atTr, 'attr2');
        assert.equal(el.customAttr, 'customAttr2');
        assert.equal(el.fromAttribute, 2);
        assert.equal(el.toAttribute, 2);
        assert.equal(el.getAttribute('toattribute'), '2-attr');
        assert.equal(el.all, 5);
        el.all = 15;
        await el.updateComplete;
        assert.equal(el.updated, 3);
        assert.equal(el.all, 15);
        assert.equal(el.getAttribute('all-attr'), '15-attr');
        el.setAttribute('all-attr', '16-attr');
        await el.updateComplete;
        assert.equal(el.updated, 4);
        assert.equal(el.getAttribute('all-attr'), '16-attr');
        assert.equal(el.all, 16);
        el.shouldInvalidate = 5;
        await el.updateComplete;
        assert.equal(el.shouldInvalidate, 5);
        assert.equal(el.updated, 4);
        el.shouldInvalidate = 15;
        await el.updateComplete;
        assert.equal(el.shouldInvalidate, 15);
        assert.equal(el.updated, 5);
        el.setAttribute('all-attr', '5-attr');
        await el.updateComplete;
        assert.equal(el.all, 5);
        assert.equal(el.updated, 5);
        el.all = 15;
        await el.updateComplete;
        assert.equal(el.all, 15);
        assert.equal(el.updated, 6);
    });
    test('attributes deserialize from html', async () => {
        const fromAttribute = value => parseInt(value);
        const toAttributeOnly = value => typeof value === 'string' && value.indexOf(`-attr`) > 0 ? value : `${value}-attr`;
        const toAttribute = value => `${value}-attr`;
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.noAttr = 'noAttr';
                this.atTr = 'attr';
                this.customAttr = 'customAttr';
                this.fromAttribute = 1;
                this.toAttribute = 1;
                this.all = 10;
            }
            static get properties() {
                return {
                    noAttr: { attribute: false },
                    atTr: { attribute: true },
                    customAttr: { attribute: 'custom', reflect: true },
                    fromAttribute: { type: fromAttribute },
                    toAttribute: { reflect: true, type: { toAttribute: toAttributeOnly } },
                    all: { attribute: 'all-attr', type: { fromAttribute, toAttribute }, reflect: true }
                };
            }
            render() {
                return html``;
            }
        }
        const name = generateElementName();
        customElements.define(name, E);
        container.innerHTML = `<${name}
      noattr="1"
      attr="2"
      custom="3"
      fromAttribute="6-attr"
      toAttribute="7"
      all-attr="11-attr"></${name}>`;
        const el = container.firstChild;
        await el.updateComplete;
        assert.equal(el.noAttr, 'noAttr');
        assert.equal(el.getAttribute('noattr'), '1');
        assert.equal(el.atTr, '2');
        assert.equal(el.customAttr, '3');
        assert.equal(el.getAttribute('custom'), '3');
        assert.equal(el.fromAttribute, 6);
        assert.equal(el.toAttribute, '7');
        assert.equal(el.getAttribute('toattribute'), '7-attr');
        assert.equal(el.all, 11);
        assert.equal(el.getAttribute('all-attr'), '11-attr');
    });
    if (Object.getOwnPropertySymbols) {
        test('properties defined using symbols', async () => {
            var _a;
            const zug = Symbol();
            class E extends LitElement {
                constructor() {
                    super(...arguments);
                    this.updated = 0;
                    this.foo = 5;
                    this[_a] = 6;
                }
                static get properties() {
                    return {
                        foo: {},
                        [zug]: {}
                    };
                }
                render() {
                    return html``;
                }
                update() {
                    this.updated++;
                }
            }
            _a = zug;
            customElements.define(generateElementName(), E);
            const el = new E();
            container.appendChild(el);
            await el.updateComplete;
            assert.equal(el.updated, 1);
            assert.equal(el.foo, 5);
            assert.equal(el[zug], 6);
            el.foo = 55;
            await el.updateComplete;
            assert.equal(el.updated, 2);
            assert.equal(el.foo, 55);
            assert.equal(el[zug], 6);
            el[zug] = 66;
            await el.updateComplete;
            assert.equal(el.updated, 3);
            assert.equal(el.foo, 55);
            assert.equal(el[zug], 66);
        });
        test('properties as symbols can set property options', async () => {
            const zug = Symbol();
            class E extends LitElement {
                static get properties() {
                    return {
                        [zug]: { attribute: 'zug', reflect: true, type: value => Number(value) + 100 }
                    };
                }
                constructor() {
                    super();
                    this[zug] = 5;
                }
                render() {
                    return html``;
                }
            }
            customElements.define(generateElementName(), E);
            const el = new E();
            container.appendChild(el);
            await el.updateComplete;
            assert.equal(el[zug], 5);
            assert.equal(el.getAttribute('zug'), '5');
            el[zug] = 6;
            await el.updateComplete;
            assert.equal(el[zug], 6);
            assert.equal(el.getAttribute('zug'), '6');
            el.setAttribute('zug', '7');
            await el.updateComplete;
            assert.equal(el.getAttribute('zug'), '107');
            assert.equal(el[zug], 107);
        });
    }
    test('property options compose when subclassing', async () => {
        const shouldInvalidate = (value, old) => old === undefined || value > old;
        const fromAttribute = value => parseInt(value);
        const toAttribute = value => `${value}-attr`;
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.noAttr = 'noAttr';
                this.atTr = 'attr';
                this.customAttr = 'customAttr';
                this.shouldInvalidate = 10;
                this.updated = 0;
            }
            static get properties() {
                return {
                    noAttr: { attribute: false },
                    atTr: { attribute: true },
                    customAttr: {},
                    shouldInvalidate: {}
                };
            }
            update(changed) {
                this.updated++;
                super.update(changed);
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        class F extends E {
            constructor() {
                super(...arguments);
                this.fromAttribute = 1;
                this.toAttribute = 1;
                this.all = 10;
            }
            static get properties() {
                return {
                    customAttr: { attribute: 'custom', reflect: true },
                    shouldInvalidate: { shouldInvalidate },
                    fromAttribute: {},
                    toAttribute: {}
                };
            }
        }
        class G extends F {
            static get properties() {
                return {
                    fromAttribute: { type: fromAttribute },
                    toAttribute: { reflect: true, type: { toAttribute } },
                    all: { attribute: 'all-attr', shouldInvalidate, type: { fromAttribute, toAttribute }, reflect: true }
                };
            }
        }
        customElements.define(generateElementName(), G);
        const el = new G();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.updated, 1);
        assert.equal(el.noAttr, 'noAttr');
        assert.equal(el.atTr, 'attr');
        assert.equal(el.customAttr, 'customAttr');
        assert.equal(el.shouldInvalidate, 10);
        assert.equal(el.fromAttribute, 1);
        assert.equal(el.toAttribute, 1);
        assert.equal(el.getAttribute('toattribute'), '1-attr');
        assert.equal(el.all, 10);
        assert.equal(el.getAttribute('all-attr'), '10-attr');
        el.setAttribute('noattr', 'noAttr2');
        el.setAttribute('attr', 'attr2');
        el.setAttribute('custom', 'customAttr2');
        el.setAttribute('fromattribute', '2attr');
        el.toAttribute = 2;
        el.all = 5;
        await el.updateComplete;
        assert.equal(el.updated, 2);
        assert.equal(el.noAttr, 'noAttr');
        assert.equal(el.atTr, 'attr2');
        assert.equal(el.customAttr, 'customAttr2');
        assert.equal(el.fromAttribute, 2);
        assert.equal(el.toAttribute, 2);
        assert.equal(el.getAttribute('toattribute'), '2-attr');
        assert.equal(el.all, 5);
        el.all = 15;
        await el.updateComplete;
        assert.equal(el.updated, 3);
        assert.equal(el.all, 15);
        assert.equal(el.getAttribute('all-attr'), '15-attr');
        el.setAttribute('all-attr', '16-attr');
        await el.updateComplete;
        assert.equal(el.updated, 4);
        assert.equal(el.getAttribute('all-attr'), '16-attr');
        assert.equal(el.all, 16);
        el.shouldInvalidate = 5;
        await el.updateComplete;
        assert.equal(el.shouldInvalidate, 5);
        assert.equal(el.updated, 4);
        el.shouldInvalidate = 15;
        await el.updateComplete;
        assert.equal(el.shouldInvalidate, 15);
        assert.equal(el.updated, 5);
        el.setAttribute('all-attr', '5-attr');
        await el.updateComplete;
        assert.equal(el.all, 5);
        assert.equal(el.updated, 5);
        el.all = 15;
        await el.updateComplete;
        assert.equal(el.all, 15);
        assert.equal(el.updated, 6);
    });
    test('superclass properties not affected by subclass', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = 5;
                this.bar = 'bar';
            }
            static get properties() {
                return {
                    foo: { attribute: 'zug', reflect: true },
                    bar: { reflect: true }
                };
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        class F extends E {
            constructor() {
                super(...arguments);
                this.foo = 6;
                this.bar = 'subbar';
                this.nug = 5;
            }
            static get properties() {
                return {
                    foo: { attribute: false },
                    nug: {}
                };
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), F);
        const el = new E();
        const sub = new F();
        container.appendChild(el);
        await el.updateComplete;
        container.appendChild(sub);
        await sub.updateComplete;
        assert.equal(el.foo, 5);
        assert.equal(el.getAttribute('zug'), '5');
        assert.isFalse(el.hasAttribute('foo'));
        assert.equal(el.bar, 'bar');
        assert.equal(el.getAttribute('bar'), 'bar');
        assert.isUndefined(el.nug);
        assert.equal(sub.foo, 6);
        assert.isFalse(sub.hasAttribute('zug'));
        assert.isFalse(sub.hasAttribute('foo'));
        assert.equal(sub.bar, 'subbar');
        assert.equal(sub.getAttribute('bar'), 'subbar');
        assert.equal(sub.nug, 5);
    });
    test('Attributes reflect', async () => {
        const suffix = '-reflected';
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = 0;
            }
            static get properties() {
                return {
                    foo: { reflect: true, type: { toAttribute: value => `${value}${suffix}` } }
                };
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.getAttribute('foo'), `0${suffix}`);
        el.foo = 5;
        await el.updateComplete;
        assert.equal(el.getAttribute('foo'), `5${suffix}`);
    });
    test('Attributes reflect with type: Boolean', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.bar = true;
            }
            static get properties() {
                return {
                    bar: { type: Boolean, reflect: true }
                };
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.getAttribute('bar'), '');
        el.bar = false;
        await el.updateComplete;
        assert.equal(el.hasAttribute('bar'), false);
        el.bar = true;
        await el.updateComplete;
        assert.equal(el.getAttribute('bar'), '');
    });
    test('updates/renders when properties change', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = 'one';
            }
            static get properties() {
                return { foo: {} };
            }
            render() {
                return html`${this.foo}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        assert.ok(el.shadowRoot);
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), 'one');
        el.foo = 'changed';
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), 'changed');
    });
    test('updates/renders when properties and attributes change', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.value = '1';
                this.attrValue = 'attr';
                this.updatedValue = '';
                this.updatedAttrValue = '';
            }
            static get properties() {
                return {
                    value: {},
                    attrValue: {}
                };
            }
            render() {
                return html``;
            }
            update(props) {
                super.update(props);
                this.updatedValue = this.value;
                this.updatedAttrValue = this.attrValue;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        assert.ok(el.shadowRoot);
        await el.updateComplete;
        assert.equal(el.updatedValue, '1');
        assert.equal(el.updatedAttrValue, 'attr');
        el.value = '2';
        await el.updateComplete;
        assert.equal(el.updatedValue, '2');
        assert.equal(el.updatedAttrValue, 'attr');
        el.attrValue = 'attr2';
        await el.updateComplete;
        assert.equal(el.updatedValue, '2');
        assert.equal(el.updatedAttrValue, 'attr2');
        el.setAttribute('attrvalue', 'attr3');
        await el.updateComplete;
        assert.equal(el.updatedValue, '2');
        assert.equal(el.updatedAttrValue, 'attr3');
        el.value = '3';
        el.setAttribute('attrvalue', 'attr4');
        await el.updateComplete;
        assert.equal(el.updatedValue, '3');
        assert.equal(el.updatedAttrValue, 'attr4');
    });
    test('updates/renders changes when attributes change', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = 'one';
            }
            static get properties() {
                return { foo: {} };
            }
            render() {
                return html`${this.foo}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.ok(el.shadowRoot);
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), 'one');
        el.setAttribute('foo', 'changed');
        await el.updateComplete;
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), 'changed');
    });
    test('User defined accessor can trigger update/render', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.info = [];
                this.foo = 0;
            }
            static get properties() {
                return { foo: {}, bar: {} };
            }
            get bar() {
                return this.__bar;
            }
            set bar(value) {
                this.__bar = Number(value);
                this.invalidate();
            }
            render() {
                this.info.push('render');
                return html`${this.foo}${this.bar}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        el.setAttribute('bar', '20');
        await el.updateComplete;
        assert.equal(el.bar, 20);
        assert.equal(el.__bar, 20);
        assert.equal(stripExpressionDelimeters(el.shadowRoot.innerHTML), '020');
    });
    test('updates/renders attributes, properties, and event listeners via lit-html', async () => {
        class E extends LitElement {
            render() {
                const attr = 'attr';
                const prop = 'prop';
                const event = e => {
                    this._event = e;
                };
                return html`<div attr="${attr}" .prop="${prop}" @zug="${event}"></div>`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        const d = el.shadowRoot.querySelector('div');
        assert.equal(d.getAttribute('attr'), 'attr');
        assert.equal(d.prop, 'prop');
        const e = new Event('zug');
        d.dispatchEvent(e);
        assert.equal(el._event, e);
    });
    test('finishFirstUpdate called when element first updates', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.wasUpdated = 0;
                this.wasFirstUpdated = 0;
            }
            update(_props) {
                this.wasUpdated++;
            }
            render() {
                return html``;
            }
            finishFirstUpdate() {
                this.wasFirstUpdated++;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.wasUpdated, 1);
        assert.equal(el.wasFirstUpdated, 1);
        await el.invalidate();
        assert.equal(el.wasUpdated, 2);
        assert.equal(el.wasFirstUpdated, 1);
        await el.invalidate();
        assert.equal(el.wasUpdated, 3);
        assert.equal(el.wasFirstUpdated, 1);
    });
    test('render lifecycle order: shouldUpdate, update, render, finishUpdate, finishFirstUpdate, updateComplete', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.info = [];
            }
            static get properties() {
                return {
                    foo: { type: Number }
                };
            }
            shouldUpdate() {
                this.info.push('shouldUpdate');
                return true;
            }
            render() {
                this.info.push('render');
                return html`hi`;
            }
            update(props) {
                this.info.push('before-update');
                super.update(props);
            }
            finishUpdate(_changedProps) {
                this.info.push('finishUpdate');
            }
            finishFirstUpdate() {
                this.info.push('finishFirstUpdate');
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        el.info.push('updateComplete');
        assert.deepEqual(el.info, ['shouldUpdate', 'before-update', 'render', 'finishFirstUpdate', 'finishUpdate', 'updateComplete']);
    });
    test('setting properties in update does not trigger invalidation', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.promiseFulfilled = false;
                this.foo = 0;
                this.updated = 0;
            }
            static get properties() {
                return {
                    foo: {}
                };
            }
            update(props) {
                this.updated++;
                this.foo++;
                super.update(props);
            }
            render() {
                return html`${this.foo}`;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.foo, 1);
        assert.equal(el.updated, 1);
        assert.equal(el.shadowRoot.textContent, '1');
        el.foo = 5;
        await el.updateComplete;
        assert.equal(el.foo, 6);
        assert.equal(el.updated, 2);
        assert.equal(el.shadowRoot.textContent, '6');
    });
    test('setting properties in update reflects to attribute and is included in `changedProps` passed to `finishUpdate`', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.changedProperties = undefined;
            }
            static get properties() {
                return {
                    foo: {},
                    bar: {},
                    zot: { reflect: true }
                };
            }
            update(changedProperties) {
                this.zot = this.foo + this.bar;
                super.update(changedProperties);
            }
            finishUpdate(changedProperties) {
                this.changedProperties = changedProperties;
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.deepEqual(el.changedProperties, new Map([['zot', undefined]]));
        assert.isNaN(el.zot);
        assert.equal(el.getAttribute('zot'), 'NaN');
        el.bar = 1;
        el.foo = 1;
        await el.updateComplete;
        assert.equal(el.foo, 1);
        assert.equal(el.bar, 1);
        assert.equal(el.zot, 2);
        assert.deepEqual(el.changedProperties, new Map([['foo', undefined], ['bar', undefined], ['zot', NaN]]));
        assert.equal(el.getAttribute('zot'), '2');
        el.bar = 2;
        await el.updateComplete;
        assert.equal(el.bar, 2);
        assert.equal(el.zot, 3);
        assert.deepEqual(el.changedProperties, new Map([['bar', 1], ['zot', 2]]));
        assert.equal(el.getAttribute('zot'), '3');
    });
    test('can await promise in finishUpdate', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.promiseFulfilled = false;
                this.foo = 0;
            }
            static get properties() {
                return {
                    foo: {}
                };
            }
            render() {
                return html`${this.foo}`;
            }
            async finishUpdate() {
                await new Promise(resolve => {
                    setTimeout(() => {
                        this.promiseFulfilled = true;
                        resolve();
                    }, 1);
                });
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.isTrue(el.promiseFulfilled);
    });
    test('can await sub-element updateComplete in finishUpdate', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.promiseFulfilled = false;
                this.foo = 'hi';
            }
            static get properties() {
                return {
                    foo: {}
                };
            }
            render() {
                return html`${this.foo}`;
            }
            async finishUpdate() {
                await new Promise(resolve => {
                    setTimeout(() => {
                        this.promiseFulfilled = true;
                        resolve();
                    }, 0);
                });
            }
        }
        customElements.define('x-1224', E);
        class F extends LitElement {
            constructor() {
                super(...arguments);
                this.inner = null;
            }
            render() {
                return html`<x-1224></x-1224>`;
            }
            async finishUpdate() {
                this.inner = this.shadowRoot.querySelector('x-1224');
                this.inner.foo = 'yo';
                await this.inner.updateComplete;
            }
        }
        customElements.define(generateElementName(), F);
        const el = new F();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.inner.shadowRoot.textContent, 'yo');
        assert.isTrue(el.inner.promiseFulfilled);
    });
    test('updateComplete not blocked by setting properties in finishUpdate', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = 0;
                this.updated = 0;
            }
            static get properties() {
                return {
                    foo: {}
                };
            }
            update(changed) {
                this.updated++;
                super.update(changed);
            }
            finishUpdate() {
                if (this.foo < 2) {
                    this.foo++;
                }
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.updated, 1);
        assert.equal(el.foo, 1);
        await el.updateComplete;
        assert.equal(el.updated, 2);
        assert.equal(el.foo, 2);
        await el.updateComplete;
        assert.equal(el.updated, 3);
        assert.equal(el.foo, 2);
    });
    test('updateComplete not blocked by setting properties in finishUpdate when promise is awaited', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = 0;
                this.updated = 0;
            }
            static get properties() {
                return {
                    foo: {}
                };
            }
            update(changed) {
                this.updated++;
                super.update(changed);
            }
            async finishUpdate() {
                await new Promise(resolve => setTimeout(resolve, 0));
                if (this.foo < 2) {
                    this.foo++;
                }
            }
            render() {
                return html``;
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.updated, 1);
        assert.equal(el.foo, 1);
        await el.updateComplete;
        assert.equal(el.updated, 2);
        assert.equal(el.foo, 2);
        await el.updateComplete;
        assert.equal(el.updated, 3);
        assert.equal(el.foo, 2);
    });
    test('updateComplete can be overridden to resolve after properties set within finishUpdate', async () => {
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = 0;
            }
            static get properties() {
                return {
                    foo: {}
                };
            }
            render() {
                return html`${this.foo}`;
            }
            async finishUpdate(changedProps) {
                if (changedProps.has('inputChanged')) {
                    await this._input.updateComplete;
                    this.inputValid = this._input.isValid();
                }
                // um, await until `this.inputDisabled` is rendered?!?!
                // if (this.foo < 10) {
                //   this.foo++;
                // }
            }
            get updateComplete() {
                return super.updateComplete.then(v => v || this.updateComplete);
            }
        }
        customElements.define(generateElementName(), E);
        const el = new E();
        container.appendChild(el);
        await el.updateComplete;
        assert.equal(el.foo, 10);
        assert.equal(el.shadowRoot.textContent, '10');
    });
    test('properties set before upgrade are applied', async () => {
        const name = generateElementName();
        const el = document.createElement(name);
        container.appendChild(el);
        el.foo = 'hi';
        el.bar = false;
        const objectValue = {};
        el.zug = objectValue;
        class E extends LitElement {
            constructor() {
                super(...arguments);
                this.foo = '';
                this.bar = true;
                this.zug = null;
            }
            static get properties() {
                return {
                    foo: {},
                    bar: {},
                    zug: {}
                };
            }
            render() {
                return html`test`;
            }
        }
        customElements.define(name, E);
        await el.updateComplete;
        assert.equal(el.foo, 'hi');
        assert.equal(el.bar, false);
        assert.equal(el.zug, objectValue);
    });
});
//# sourceMappingURL=lit-element_test2.js.map