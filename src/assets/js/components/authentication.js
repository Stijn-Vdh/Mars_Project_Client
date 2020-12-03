"use strict";

function initAuthentication() {
    document.querySelector('#signin form').addEventListener('submit', login);
    document.querySelector('#signup form').addEventListener('submit', register);
    document.querySelector('.searchHomeEndpoint input').addEventListener('input', (e) => loadHomeEndpointList(e, e.target.value));
    document.querySelector('#signup #su-homeEndpointName').addEventListener('focusin', () => {
        document.querySelector('.searchHomeEndpoint').classList.add('active');
        document.querySelector('.searchHomeEndpoint input').focus();
    });

    if (localStorage.getItem('token') === null) {
        goTo('#authentication');
    }
}



function selectHomeEndpoint(e) {
    e.preventDefault();

    document.querySelector('#signup #su-homeEndpointName').value = e.target.getAttribute('data-home-endpoint');
    document.querySelector('.searchHomeEndpoint').classList.remove('active');
}

function loadHomeEndpointList(e=null, filter="") {
    const homeEndpointContainer = document.querySelector('.searchHomeEndpoint ul');
    let endpointsToShow = [...endpoints];

    homeEndpointContainer.querySelectorAll('li').forEach(el => el.removeEventListener('click', selectHomeEndpoint));

    if (filter !== "") {
        endpointsToShow = endpointsToShow.filter(endpoint => endpoint.name.toLowerCase().includes(filter.toLowerCase()));
    }
    endpointsToShow = endpointsToShow.slice(0, 6);

    homeEndpointContainer.innerHTML = "";
    endpointsToShow.forEach(endpoint => {
        homeEndpointContainer.innerHTML += `<li data-home-endpoint="${endpoint.id}">${endpoint.name}</li>`;
    });

    homeEndpointContainer.querySelectorAll('li').forEach(el => el.addEventListener('click', selectHomeEndpoint));
}