"use strict";
const pageHistory = [];
const pages = {};
let currentPage;

function initNavigation() {
    document.querySelectorAll('.back').forEach(el => el.addEventListener('click', goBack));
}

function addPage(selector, activators=[]) {
    pages[selector] = new Page(selector);
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
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.selector = selector;
    }

    goto() {
        this.element.classList.add('active');
    }

    leave() {
        this.element.classList.remove('active');
        return true;
    }
}