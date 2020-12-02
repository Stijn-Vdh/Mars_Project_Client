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
            goTo('main');
            if (response.status === 402) {
                warn(response.message);
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
    return [
        {
            "id": 1,
            "name": "Home",
            "available": true,
            "location": "here",
            "privateEndpoint": true
        },
        {
            "id": 2,
            "name": "Maldi",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 3,
            "name": "Debby",
            "available": true,
            "location": "somwhere else",
            "privateEndpoint": true
        },
        {
            "id": 4,
            "name": "Tasle",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 5,
            "name": "Maruyt",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 6,
            "name": "Malbert Hein",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 7,
            "name": "Work",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        },
        {
            "id": 8,
            "name": "Mars Square",
            "available": true,
            "location": "somewhere else",
            "privateEndpoint": false
        }
    ]
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
