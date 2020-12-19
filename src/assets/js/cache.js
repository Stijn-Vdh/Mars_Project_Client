"use strict";

// save here responses from api calls, they are available inside each script, and prevent unnecessary api calls which lead to delayed interface
let accInfo;
let currentLocationEndpointId;
let markers = [];
let subscriptions
let travelEndpoints;
let packageEndpoints;


function updateAccInfo() {
    return getUserInfo().then(userInfo => {
        accInfo = userInfo
        checkForFriendRequests(userInfo);
        loadFriends(userInfo);
        loadDataInQuickAccess(userInfo);
        updatePrice();
        if (currentLocationEndpointId === undefined) {
            currentLocationEndpointId = accInfo.homeEndpoint;
        }
    });
}

function cacheSubscriptions() {
    apiCall('subscription', 'GET', true)
        .then((currSubscriptions) => subscriptions = currSubscriptions);
}

function cacheTravelEndpoints() {
    return getTravelEndpoints().then(endpoints => travelEndpoints = endpoints);
}

function cachePackageEndpoints() {
    return getPackageEndpoints()
        .then(endpoints => packageEndpoints = endpoints);
}