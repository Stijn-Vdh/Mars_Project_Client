"use strict";

function podOrderInit() {
    document.querySelectorAll('#standard-pod, #luxury-pod').forEach(el => el.updateEventListener('click', switchPod));
    document.querySelector('#select-travel-location').updateEventListener('submit', orderPod);
    document.querySelector('#favourite-endpoint').addEventListener('change', favouriteRoute);

}

function switchPod(e) {
    const selectedPod = e.currentTarget.id;

    document.querySelector('#selected-pod').value = selectedPod.split('-')[0];

    e.currentTarget.parentNode.querySelectorAll('div').forEach(el => {
        if (el.id === selectedPod) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    updatePrice();
}

function updatePrice() {
    const price = document.querySelector("#pod-pricing span");
    const standardPod = document.querySelector("#standard-pod.active");
    if (accInfo.subscription.unlimitedTravels && standardPod) {
        price.innerHTML = `M0`;
    } else if (standardPod) {
        price.innerHTML = `M1`;
    } else {
        price.innerHTML = `M3`;
    }
}

function countdown(time) {
    setTimeout(() => {
        document.querySelector('#travel-estm-time').innerHTML = `${time}s`;
        if (time !== 0) countdown(time - 1);
    }, 1000)
}

function setTraveling() {
    apiCall('routeInfo', 'GET', true)
        .then(routeInfo => {
            const eps = travelEndpoints,
                fromCoords = eps.find(ep => ep.id === routeInfo.from.id).coordinate,
                toCoords = eps.find(ep => ep.id === routeInfo.destination.id).coordinate,
                arriveOn = getDistance([fromCoords.latitude, fromCoords.longitude], [toCoords.latitude, toCoords.longitude]) / 600;

            document.querySelector('.animate-route').style.animation = `test ${arriveOn * 1.6333}s ease-in-out forwards`;

            document.querySelector('#travel-view').style.transitionDuration = `${Math.round(arriveOn)}s`;
            document.querySelector('#travel-view .travel-pod').style.top = `21rem`;
            document.querySelector('.timeline .travel-pod').style.transitionDuration = `${Math.round(arriveOn)}s`;
            document.querySelector('.timeline .travel-pod').style.left = `90%`;
            document.querySelector('#travel-status').innerHTML = `Going to ${routeInfo.destination.name}`;

            countdown(Math.round(arriveOn) - 1);

            setTimeout(() => {
                notify(`You arrived at ${routeInfo.destination.name}.`);
                setTimeout(() => {
                    document.querySelector('#travel-status').innerHTML = `Pod on it's way to you`;
                    document.querySelector('#travel-estm-time').innerHTML = ``;
                    document.querySelector('.animate-route').style.animation = ``;
                    document.querySelector('.searchbar').style.display = '';
                    document.querySelector('#current-location').classList.remove("hidden");
                    document.querySelector('#quick-access').classList.remove('traveling');
                    routeController.setWaypoints([]);
                    markers.filter(marker => marker.options.endpointId !== routeInfo.from.id && marker.options.endpointId !== routeInfo.destination.id).forEach(marker => {
                        marker.addTo(map);
                    });
                }, 2000)
            }, (arriveOn * 1000));
        })
}

function checkFavoured() {
    let id = document.querySelector('#select-location').value;
    document.querySelector('#favourite-endpoint').checked = false;
    accInfo.favouriteEndpoints.forEach(endpoint => {
        if (endpoint.id === parseInt(id)) {
            document.querySelector('#favourite-endpoint').checked = true;
        }
    });

}