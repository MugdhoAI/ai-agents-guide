// Regression tests for script.js, run with: node test/script.test.js
//
// The page script reads the saved theme from localStorage as its very
// first step, with no error handling. In browsers that refuse storage
// access (blocked cookies/storage, some private modes), that read
// throws, the whole script dies, and every enhancement on the page
// stops working: the mobile menu will not open, the theme button does
// nothing, and the copy buttons are dead. These tests drive the real
// script.js in a vm with a small fake DOM and hostile storage.

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const test = require('node:test');
const assert = require('node:assert');

const source = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');

function makeClassList() {
    const classes = new Set();
    return {
        add: (name) => classes.add(name),
        contains: (name) => classes.has(name),
        toggle: (name, force) => {
            const on = force === undefined ? !classes.has(name) : Boolean(force);
            if (on) classes.add(name); else classes.delete(name);
            return on;
        },
    };
}

function makeElement() {
    return {
        classList: makeClassList(),
        textContent: '',
        listeners: {},
        addEventListener(type, fn) {
            (this.listeners[type] = this.listeners[type] || []).push(fn);
        },
        setAttribute() {},
        focus() {},
        querySelector: () => null,
        querySelectorAll: () => [],
    };
}

function click(element) {
    for (const fn of element.listeners.click || []) fn({});
}

// storage: object with getItem/setItem, or the string 'denied' to make
// both throw, like a browser refusing storage access.
function loadPage(storage) {
    const body = makeElement();
    const nav = makeElement();
    const theme = makeElement();
    const menubtn = makeElement();
    const documentStub = {
        body,
        querySelector: (selector) => ({ nav, '.theme': theme, '.menubtn': menubtn })[selector] || null,
        querySelectorAll: () => [],
        addEventListener() {},
    };
    const localStorage = storage === 'denied'
        ? {
            getItem() { throw new Error('storage access denied'); },
            setItem() { throw new Error('storage access denied'); },
        }
        : storage;
    const sandbox = {
        document: documentStub,
        localStorage,
        navigator: { clipboard: { writeText: async () => {} } },
    };
    vm.createContext(sandbox);
    let loadError = null;
    try {
        vm.runInContext(source, sandbox);
    } catch (error) {
        loadError = error;
    }
    return { body, nav, theme, menubtn, loadError };
}

function memoryStorage(initial = {}) {
    const data = { ...initial };
    return {
        data,
        getItem: (key) => (key in data ? data[key] : null),
        setItem: (key, value) => { data[key] = String(value); },
    };
}

test('when storage access is denied the menu and theme still work', () => {
    const page = loadPage('denied');
    assert.strictEqual(page.loadError, null,
        `script should survive denied storage, got: ${page.loadError}`);
    click(page.menubtn);
    assert.ok(page.nav.classList.contains('open'), 'menu should open');
    click(page.theme);
    assert.ok(page.body.classList.contains('dark'), 'theme should toggle');
});

test('a saved dark theme is applied on load', () => {
    const page = loadPage(memoryStorage({ 'agents-theme': 'dark' }));
    assert.strictEqual(page.loadError, null);
    assert.ok(page.body.classList.contains('dark'));
    assert.strictEqual(page.theme.textContent, '☀');
});

test('toggling the theme saves the choice when storage works', () => {
    const storage = memoryStorage();
    const page = loadPage(storage);
    click(page.theme);
    assert.strictEqual(storage.data['agents-theme'], 'dark');
    assert.strictEqual(page.theme.textContent, '☀');
    click(page.theme);
    assert.strictEqual(storage.data['agents-theme'], 'light');
});

test('when saving throws, the theme still toggles and the icon updates', () => {
    const storage = {
        getItem: () => null,
        setItem() { throw new Error('quota exceeded'); },
    };
    const page = loadPage(storage);
    assert.strictEqual(page.loadError, null);
    click(page.theme);
    assert.ok(page.body.classList.contains('dark'));
    assert.strictEqual(page.theme.textContent, '☀');
});
