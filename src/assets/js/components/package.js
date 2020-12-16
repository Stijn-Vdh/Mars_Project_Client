"use strict";

let packageEndpoints;

function initPackage() {
    document.querySelector('#select-package-order ion-icon').addEventListener('click', swap);
    document.querySelector('#select-package-order').addEventListener('click', orderPackagePod);

    getPackageEndpoints()
        .then(response =>{
            packageEndpoints = response;
            initEndpoints();
        })
}

function initEndpoints(){
    document.querySelectorAll(".packageSearch").forEach(el => loadPackageEndpoints(el));
    loadPackageEndpoints();
}

function swap(){
    let from = document.querySelector('#p-from').value;
    let to = document.querySelector('#p-destination').value;

    document.querySelector('#p-from').value = to;
    document.querySelector('#p-destination').value = from;
}

function loadPackageEndpoints() {
    let endpointsToShow = [...packageEndpoints];
    let selectDestination = document.querySelector('#select-package-order #p-destination')
    let selectFrom = document.querySelector('#select-package-order #p-from')

    selectDestination.innerHTML = "";
    selectFrom.innerHTML = "";

    endpointsToShow.forEach(endpoint => {
        selectDestination.innerHTML += `<option data-order-Packagepod="${endpoint.id}" id="orderPackage-endpoint-${endpoint.id}">${endpoint.name}</option>`;
        selectFrom.innerHTML += `<option data-order-Packagepod="${endpoint.id}" id="orderPackage-endpoint-${endpoint.id}">${endpoint.name}</option>`;
    });
}

