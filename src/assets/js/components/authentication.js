"use strict";

function initAuthentication() {
    document.querySelector('#signin form').updateEventListener('submit', btnLogin);
    document.querySelector('#signup form').updateEventListener('submit', register);
    document.querySelector('.searchHomeEndpoint input').updateEventListener('input', (e) => loadHomeEndpointList(e, e.target.value));
    document.querySelector('#signup #su-homeEndpointName').updateEventListener('focusin', () => {
        document.querySelector('.searchHomeEndpoint').classList.add('active');
        document.querySelector('.searchHomeEndpoint input').focus();
    });

    if (localStorage.getItem('token') === null) {
        goTo('#authentication');
    } else {
        getUserInfo()
            .then(response => {
                if (response.status === 403) {
                    goTo('#authentication');
                } else {
                    accInfo = response;
                    initLogin();
                }
            });
    }
}


function selectHomeEndpoint(e) {
    e.preventDefault();

    document.querySelector('#signup #su-homeEndpointName').value = e.target.getAttribute('data-home-endpoint');
    document.querySelector('.searchHomeEndpoint').classList.remove('active');
}

function loadHomeEndpointList(e = null, filter = "") {
    const homeEndpointContainer = document.querySelector('.searchHomeEndpoint ul');
    let endpointsToShow = [...endpoints];

    if (filter !== "") {
        endpointsToShow = endpointsToShow.filter(endpoint => endpoint.name.toLowerCase().includes(filter.toLowerCase()));
    }
    endpointsToShow = endpointsToShow.slice(0, 6);

    homeEndpointContainer.innerHTML = "";
    endpointsToShow.forEach(endpoint => {
        homeEndpointContainer.innerHTML += `<li data-home-endpoint="${endpoint.id}">${endpoint.name}</li>`;
    });

    homeEndpointContainer.querySelectorAll('li').forEach(el => el.updateEventListener('click', selectHomeEndpoint));
}

function btnLogin(e) {
    e.preventDefault();
    login({
        name: e.target.querySelector('#si-name').value,
        password: e.target.querySelector('#si-password').value
    });
}