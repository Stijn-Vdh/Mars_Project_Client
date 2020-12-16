"use strict";
const pageHistory = [];
const pages = {};
const dynamicElements = {};
let pressedElement;
let currentPage;

function initNavigation() {
    document.querySelectorAll('.back').forEach(el => el.updateEventListener('click', goBack));
    document.querySelector('body').updateEventListener('click', checkForDynamicDataEvents);
}

function checkForDynamicDataEvents(e) {
    Object.keys(dynamicElements).forEach(el => {
        const target = e.target.closest(el);
        if (target !== null) {
            e.preventDefault();
            const h2 = target.querySelector("h2");
            goTo(dynamicElements[el], {
                id: target.getAttribute('data-order-pod'),
                name: h2 ? h2.innerHTML : target.innerHTML
            });
        }
    });
}

function addPage(selector, activators = [], options = {}, page = new Page(selector, options.onOpen, options.onLeave)) {
    console.log(page);
    pages[selector] = page;
    activators.forEach(activator => {
        document.querySelectorAll(activator).forEach(el => el.addEventListener('click', (e) => {
            e.preventDefault();
            goTo(selector);
        }))
    })
}

function addPodOrderPage(selector, activators = [], options = {}) {
    addPage(selector, activators, options, new PodOrderPage(selector, options.onOpen, options.onLeave));
    activators.forEach(activator => dynamicElements[activator] = selector);
}

function clearNavigationHistory() {
    pageHistory.splice(0);
    pageHistory.push(pages['main']);
}

function goBack(e = null) {
    if (e !== null) e.preventDefault();
    if (pageHistory.length > 1 && pageHistory.splice(pageHistory.length - 1, 1)[0].leave()) {
        pageHistory[pageHistory.length - 1].goto();
    }
}

function goTo(page, payload) {
    console.log(page);
    if (pageHistory.length < 1 || pageHistory[pageHistory.length - 1].leave()) {
        pages[page].goto(payload);
        pageHistory.push(pages[page]);
    }
}

class Page {
    element;
    selector;
    onOpen;
    onLeave;

    constructor(selector, onOpen = null, onLeave = null) {
        this.element = document.querySelector(selector);
        this.selector = selector;
        this.onOpen = onOpen;
        this.onLeave = onLeave;
    }

    goto() {
        if (this.onOpen !== undefined && this.onOpen !== null) this.onOpen();
        this.element.classList.add('active');
    }

    leave() {
        if (this.onLeave !== undefined && this.onLeave !== null) this.onLeave();
        this.element.classList.remove('active');
        return true;
    }
}

class PodOrderPage extends Page {
    goto(payload) {
        document.querySelector('#select-location').value = payload.id;
        document.querySelector('#select-location-text').value = payload.name;
        super.goto();
    }
}