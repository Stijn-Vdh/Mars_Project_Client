"use strict";

const api = 'https://project-ii.ti.howest.be/mars-15/api/';

function getFriends() {
    return [
        {
            id: 1,
            name: "John doe",
            icon: "https://randomuser.me/api/portraits/men/85.jpg"
        },
        {
            id: 2,
            name: "Jane Doe",
            icon: "https://randomuser.me/api/portraits/women/85.jpg"
        }
    ];
}

function getUserInfo() {
    return apiCall('accountInformation', 'GET', true)
        .then(response => {
            if (response.status === 401) {
                warn(response.message);
            } else {
                return response;
            }
        })
}

/**
 * Log the user in
 * 
 * @param {SubmitEvent} e             EventListener event
 * 
 * @return {Promise}            request promise 
 */
function login(e) {
    e.preventDefault();
    
    const body = {
        name: e.target.querySelector('#si-name').value,
        password: e.target.querySelector('#si-password').value
    };

    apiCall('login', 'POST', false, body)
        .then((response) => {
            if (response.status === 402) {
                warn(response.message);
            } else {
                localStorage.setItem('token', response);
                goTo('main');
                notify('Welcome back');
            }
        })
}

/**
 * register a user in
 * 
 * @param {SubmitEvent} e             EventListener event
 * 
 * @return {Promise}            request promise 
 */
function register(e) {
    e.preventDefault();
    
    const body = {
        name: e.target.querySelector('#su-name').value,
        password: e.target.querySelector('#su-password').value,
        businessAccount: e.target.querySelector('#su-business').checked,
        homeAddress: e.target.querySelector('#su-address').value,
        homeEndpointId: parseInt(e.target.querySelector('#su-homeEndpointName').value)
    };

    apiCall('createAccount', 'POST', false, body)
        .then((response) => {
            if (response.status === 402) {
                warn(response.message);
            } else {
                goBack();
                goTo('#signin');
            }
        })
}

function orderPod(e) {
    e.preventDefault();

    const body = {
        from: 1,
        destination: e.target.querySelector('#select-location').value,
        podType: e.target.querySelector('#selected-pod').value
    }

    apiCall('travel', 'POST', true, body)
        .then(response => {
            goTo('#process-payment');
            if (response.status !== 200) {
                setTimeout(() => {
                    document.querySelector('#process-payment .checkmark').classList.add('active', 'error');
                    document.querySelector('#payment-response').innerHTML = response.message;
                    setTimeout(() => {
                        goBack();
                        document.querySelector('#process-payment .checkmark').classList.remove('active', 'error')
                        document.querySelector('#payment-response').innerHTML = '';
                    }, 3000);
                }, 1000);
            }
        });
}

/**
 * Test the api
 * 
 * @return {Promise}            request promise
 */
function getMessage() {
    return apiCall("message");
}

/**
 * Get the pod endpoints from the server
 * 
 * @return {Promise}            request promise containing endpoint array.
 */
function getEndpoints() {
    return apiCall("endpoints", 'GET')
}

function getTravelHistory() {
    return apiCall('travel', 'GET', true)
}

/** Call the api

* @param {string} url             The request url
* @param {string} method          The request method
* @param {boolean} authenticated  If we need to send authentication header

* @return {Promise}               The request promise
*/
function apiCall(uri, method='GET', authenticated, body) {
    const request = new Request(api + uri, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: authenticated ? `Bearer ${localStorage.getItem('token')}`: undefined
        },
        body: JSON.stringify(body)
    });

    return fetch(request)
        .then(response => response.json());
}
