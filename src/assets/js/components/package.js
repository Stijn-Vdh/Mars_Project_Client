"use strict";



function initPackage() {
    document.querySelector('#select-package-order').addEventListener('submit', orderPackagePod);
    loadSearchbar(document.querySelector('.package-endpoint-selection'), packageEndpoints);
    document.querySelector('.package-endpoint-selection ul').updateEventListener('click', selectEndpoint);
}

function selectEndpoint(e) {
    const selectedEndpoint = e.target.closest('*[data-select-package-endpoint]');
    console.log(selectedEndpoint);
    document.querySelector('#p-destination-value').value = selectedEndpoint.getAttribute('data-select-package-endpoint');
    document.querySelector('#p-destination').value = selectedEndpoint.querySelector('h2') ? selectedEndpoint.querySelector('h2').innerHTML : selectedEndpoint.innerHTML
}
