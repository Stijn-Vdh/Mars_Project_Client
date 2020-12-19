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
            }
        );
}

function updateSharingLocation(sharing) {
    if (sharing) {
        return apiCall("shareLocation", "DELETE", true)
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    warn(response.message);
                } else {
                    notify(response);
                }
            })
            .then(updateAccInfo);
    } else {
        return apiCall("shareLocation", "POST", true)
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    warn(response.message);
                } else {
                    notify(response);
                }
            })
            .then(updateAccInfo);
    }
}

/**
 * Log the user in
 *
 * @param body            body sent with request
 */
function login(body) {
    apiCall('login', 'POST', false, body)
        .then((response) => {
            if (response.status === 402) {
                warn(response.message);
            } else {
                checkNotificationPermissions();
                localStorage.setItem('token', response);
                initLogin().finally(() => {
                    clearNavigationHistory();
                    notify('Welcome back');
                });
            }
        });
}

/**
 * register a user in
 *
 * @param body            body to be sent with request
 */
function register(body) {
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
                if (response.status === 401 || response.status === 403 || response.status === 402) {
                    warn(response.message);
                } else {
                    notify(response);
                    goBack();
                }
            })
            .finally(updateAccInfo)

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

    if (document.querySelector('#bank').checked || document.querySelector('#reward-points').checked){
        const body = {
            from: currentLocationEndpointId,
            destination: parseInt(e.target.querySelector('#select-location').value),
            podType: e.target.querySelector('#selected-pod').value
        }


        if (body.from === body.destination) {
            warn("You are at this endpoint already!");
            return;
        }

        if (e.target.hasAttribute('data-friend')) {
            body.toFriend = e.target.getAttribute('data-friend');
            e.target.removeAttribute('data-friend');
        }

        if (body.from === body.destination) {
            warn("You are at this endpoint already!");
            return;
        }


        apiCall('travel', 'POST', true, body)
            .then(response => {
                const user = accInfo;
                updateCurrentLocation(body.destination);
                goTo('#process-payment');
                if (accInfo.subscription.unlimitedTravels) {
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
                            const eps = travelEndpoints,
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
                            document.querySelector('#current-location').classList.add("hidden");

                            document.querySelector('#travel-view').style.transitionDuration = `${route.arrivalTime}s`;
                            document.querySelector('#travel-view .travel-pod').style.top = `9rem`;

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
    }else{
        notify('Please choose a payment type.');
    }
}

function favouriteRoute(e) {
    e.preventDefault();
    let id = parseInt(e.path[2].querySelector('#select-location').value);
    let checked = e.target.checked;

    if (!checked) {
        apiCall(`endpoint/favorite/${id}`, "DELETE", true)
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    warn(response.message);
                } else {
                    notify(response);
                    document.querySelector('#favourite-icon').setAttribute('name', 'star-outline');
                }
            })
            .then(updateAccInfo);
    } else {
        return apiCall(`endpoint/favorite/${id}`, "POST", true)
            .then(response => {
                if (response.status === 401 || response.status === 403) {
                    warn(response.message);
                } else {
                    notify(response);
                    document.querySelector('#favourite-icon').setAttribute('name', 'star');
                }
            })
            .then(updateAccInfo);
    }
}

function orderPackagePod(e) {
    e.preventDefault();

    const body = {
        deliveryType: "small",
        from: parseInt(e.target.querySelector('#p-location').value),
        destination: parseInt(e.target.querySelector('#p-destination-value').value)
    }

    apiCall("sendPackage", "POST", true, body)
        .then(response => {
            goTo('#process-payment');
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
