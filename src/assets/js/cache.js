"use strict";

// save here responses from api calls, they are available inside each script, and prevent unnecessary api calls which lead to delayed interface
let accInfo;
let currentLocationEndpointId

function updateAccInfo() {
    return getUserInfo().then(userInfo => {
        console.log("updatedAccInfo");
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