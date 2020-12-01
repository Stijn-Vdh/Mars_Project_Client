"use strict";
const pageHistory = [];
const pages = {};
const dynamicElements = {};
let pressedElement;
let currentPage;

function initNavigation() {
    document.querySelectorAll('.back').forEach(el => el.addEventListener('click', goBack));
    document.querySelector('body').addEventListener('click', checkForDynamicDataEvents);
}

function checkForDynamicDataEvents(e) {
    Object.keys(dynamicElements).forEach(el => {
        const target = e.target.closest(el);
        if (target !== null) {
            e.preventDefault();
            goTo(dynamicElements[el], target);
        }
    });
}

function addPage(selector, activators=[], dynamicData=false) {
    pages[selector] = new Page(selector);
    if (dynamicData) {
        activators.forEach(activator => dynamicElements[activator] = selector);
    }
    activators.forEach(activator => {
        document.querySelectorAll(activator).forEach(el => el.addEventListener('click', (e) => {
            e.preventDefault();
            goTo(selector);
        }))
    })
}

function goBack(e) {
    e.preventDefault();
    if (pageHistory.splice(pageHistory.length - 1, 1)[0].leave()) {
        pageHistory[pageHistory.length - 1].goto();
    }
}

function goTo(page) {
    if (pageHistory.length < 1 || pageHistory[pageHistory.length - 1].leave()) {
        pages[page].goto();
        pageHistory.push(pages[page]);
    }
}

class Page {
    element;
    selector;
    onOpen;
    onLeave;

    constructor(selector, onOpen=null, onLeave=null) {
        this.element = document.querySelector(selector);
        this.selector = selector;
        this.onOpen = onOpen;
        this.onLeave = onLeave;
    }

    goto() {
        this.element.classList.add('active');
    }

    leave() {
        this.element.classList.remove('active');
        return true;
    }
}