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
            if (response.status === 401 || response.status === 403 || response.status === 422) {
                warn(response.message);
            } else {
                notify(response);
                goBack();
            }
        })
}