"use strict";

function initSearchbar() {
    document.querySelectorAll(".searchbar").forEach(el => loadSearchbar(el));
    document.querySelectorAll(".searchbar > input").forEach(el => {
        el.removeEventListener('focusin', toggleFocus);
        el.addEventListener('focusin', toggleFocus);
    });
    document.querySelectorAll(".searchbar > input").forEach(el => {
        el.removeEventListener('focusout', toggleFocus);
        el.addEventListener('focusout', toggleFocus);
    });
    document.querySelectorAll(".searchbar > input").forEach(el => {
        el.removeEventListener('input', loadSearchbar);
        el.addEventListener('input', loadSearchbar);
    });
}

function toggleFocus(e) {
    let wait = 0;
    if (e.target.parentNode.classList.contains("active")) {
        setTimeout(() => {
            e.target.parentNode.querySelector('ul').style.maxHeight = '0';
        }, 100);
        wait = 300;
    }
    setTimeout(() => {
        e.target.parentNode.classList.toggle('active');
        e.target.parentNode.querySelector('ul').style.maxHeight = '';
    }, wait);
}

function loadSearchbar(e) {
    let sb, filter = "";
    if (e.currentTarget !== undefined) {
        sb = e.currentTarget.parentNode, filter = e.currentTarget.value;
    } else {
        sb = e;
    }
    let endpointsToShow = [...endpoints];

    if (filter !== "") {
        endpointsToShow = endpointsToShow.filter(endpoint => endpoint.name.toLowerCase().includes(filter.toLowerCase()));
    }
    endpointsToShow = endpointsToShow.slice(0, 6);

    sb.querySelector('ul').innerHTML = "";
    endpointsToShow.forEach(endpoint => {
        sb.querySelector('ul').innerHTML += `<li data-order-pod="${endpoint.id}" id="sb-endpoint-${endpoint.id}">${endpoint.name}</li>`;
    });
}