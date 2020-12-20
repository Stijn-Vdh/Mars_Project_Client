"use strict";

function initReport() {
    document.querySelector('#report form').updateEventListener('submit', postReport)
}

function postReport(e) {
    e.preventDefault();

    report({
        section: document.querySelector('#select-type').value,
        description: document.querySelector('#reason').value
    }).then(notifyThenGoBack);
    document.querySelector('#reason').value = ""; // empties the text area
}