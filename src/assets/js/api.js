"use strict";

const api = 'https://project-ii.ti.howest.be/mars-15/api/';
// const api = 'http://localhost:8080/api/';

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

function updateName(newName) {
    return apiCall('changeDisplayName', 'POST', true, {newDisplayName: newName})
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                warn(response.message);
            } else {
                notify(response);
            }
        })
        .then(updateAccInfo);
}

function updatePassword(currentPassword, newPassword) {
    apiCall('changePassword', 'POST', true, {newPassword: newPassword})
        .then(response => {
            if (response.status === 401 || response.status === 403) {
                warn(response.message);
            } else {
                notify(response);
            }
        });
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
                checkNotificationPermissions();
                localStorage.setItem('token', response);
                goTo('main');
                clearNavigationHistory();
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
        });
}

function addFriend(e = null) {
    if (typeof e !== 'string') e.preventDefault();

    apiCall(`friend/${typeof e === 'string' ? e : document.querySelector('#friend-name').value}`, 'POST', true)
        .then((response) => {
            if (response.status === 401 || response.status === 403) {
                warn(response.message);
            } else {
                notify(response);
                goBack();
            }
        }).finally(updateAccInfo);
}

function removeFriend(e = null) {
    if (typeof e !== 'string') e.preventDefault();

    apiCall(`friend/${typeof e === 'string' ? e : e.currentTarget.getAttribute('data-remove-friend')}`, 'DELETE', true)
        .then((response) => {
            if (response.status === 401 || response.status === 403) {
                warn(response.message);
            } else {
                notify(response);
                goBack();
            }
        }).finally(updateAccInfo);
}

function orderPod(e) {
    e.preventDefault();

    const body = {
        from: 1,
        destination: parseInt(e.target.querySelector('#select-location').value),
        podType: e.target.querySelector('#selected-pod').value
    }

    apiCall('travel', 'POST', true, body)
        .then(response => {
            const user = accInfo;
            goTo('#process-payment');
            if (user.subscription.unlimitedTravels) {
                document.querySelector('#process-payment h2').innerHTML = 'Checking subscription.';
            } else {
                document.querySelector('#process-payment h2').innerHTML = 'Checking payment.';
            }
            if (response.status === 401 || response.status === 403) {
                document.querySelector('#process-payment .checkmark').classList.add('active', 'error');
                document.querySelector('#payment-response').innerHTML = response.message;
                setTimeout(() => {
                    goBack();
                    document.querySelector('#process-payment .checkmark').classList.remove('active', 'error')
                    document.querySelector('#payment-response').innerHTML = '';
                }, 3000);
            } else {
                apiCall('routeInfo', 'GET', true)
                    .then(route => {
                        const eps = JSON.parse(sessionStorage.getItem('endpoints')),
                            fromCoords = eps.find(ep => ep.id === route.from.id).coordinate,
                            toCoords = eps.find(ep => ep.id === route.destination.id).coordinate,
                            travelWaypoints = [
                                L.latLng(fromCoords.latitude, fromCoords.longitude),
                                L.latLng(toCoords.latitude, toCoords.longitude)
                            ];

                        routeController.setWaypoints(travelWaypoints);

                        markers.filter(marker => marker.options.endpointId !== route.from.id && marker.options.endpointId !== route.destination.id).forEach(marker => {
                            map.removeLayer(marker);
                        });
                        
                        document.querySelector('.searchbar').style.display = 'none';
                        document.querySelector('#quick-access').classList.add('traveling');
                        document.querySelector('#process-payment .checkmark').classList.add('active', 'success');
                        document.querySelector('#payment-response').innerHTML = `Ordered pod #${response.travelId}.`;
                        setTimeout(() => {
                            goTo('main');
                            notify(`Your pod is on it's way!`);
                            document.querySelector('#process-payment h2').innerHTML = 'Checking payment.';
                            document.querySelector('#process-payment .checkmark').classList.remove('active', 'success')
                            document.querySelector('#payment-response').innerHTML = '';
                        }, 3000);
                    });
            }
        });
}

function orderPackagePod(e) {
    e.preventDefault();

    //does not work yet

    const body = {
        deliveryType: "small",
        from: parseInt(e.target.querySelector('#select-p-from').value),
        destination: parseInt(e.target.querySelector('#select-p-destination').value)
    }

    apiCall("sendPackage", "POST", true, body)
        .then(response => {
            goTo('#process-payment');
            setTimeout(() => {

            }, 1000)
            if (response.status === 401 || response.status === 403 || response.status === 400) {
                document.querySelector('#process-payment .checkmark').classList.add('active', 'error');
                document.querySelector('#payment-response').innerHTML = response.message;
                setTimeout(() => {
                    goBack();
                    document.querySelector('#process-payment .checkmark').classList.remove('active', 'error')
                    document.querySelector('#payment-response').innerHTML = '';
                }, 3000);
            } else {
                document.querySelector('#process-payment .checkmark').classList.add('active', 'success');
                document.querySelector('#payment-response').innerHTML = `Package pod ordered #1.`;
                setTimeout(() => {
                    goTo('main');
                    notify(`Your pod is on it's way!`);
                    document.querySelector('#process-payment .checkmark').classList.remove('active', 'success')
                    document.querySelector('#payment-response').innerHTML = '';
                }, 3000);
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
    return apiCall("endpoint", 'GET')
}

function getPackageEndpoints() {
    return apiCall("endpoint/package", "GET", true)
}

function getTravelEndpoints() {
    return apiCall("endpoint/travel", 'GET', true);
}


function getEndpoint(id) {
    return apiCall(`endpoint/${id}`, 'GET');
}


function getTravelHistory() {
    return apiCall('travel', 'GET', true)
}

function setSubscription(id) {
    return apiCall('subscription', 'POST', true, {subscriptionId: id})
        .finally(updateAccInfo);
}

/** Call the api

 * @param {string} uri             The request url
 * @param {string} method          The request method
 * @param {boolean} authenticated  If we need to send authentication header
 * @param body                     body sent with the request
 *
 * @return {Promise}               The request promise
 */
function apiCall(uri, method = 'GET', authenticated, body) {
    const request = new Request(api + uri, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            Authorization: authenticated ? `Bearer ${localStorage.getItem('token')}` : undefined
        },
        body: JSON.stringify(body)
    });

    return fetch(request)
        .then(response => response.json());
}
