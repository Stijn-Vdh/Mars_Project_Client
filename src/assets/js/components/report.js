"use strict";

function initReport() {
    document.querySelector('#report form').updateEventListener('submit', postReport)
}

function postReport(e) {
    e.preventDefault();

    const body = {
        section: document.querySelector('#report #select-type').value,
        description: document.querySelector('#report #reason').value
    }

    apiCall('report', 'POST', true, body)
        .then(response => {
            notify(response);
            goBack();
        });
}