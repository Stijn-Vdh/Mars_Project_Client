"use strict";

function podOrderInit() {
    document.querySelectorAll('#standard-pod, #luxury-pod').forEach(el => el.updateEventListener('click', switchPod));
    document.querySelector('#select-travel-location').updateEventListener('submit', orderPod);
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

function setTraveling() {
    apiCall('routeInfo', 'GET', true)
        .then(routeInfo => {
            const eps = JSON.parse(sessionStorage.getItem('endpoints')),
                fromCoords = eps.find(ep => ep.id === routeInfo.from.id).coordinate,
                toCoords = eps.find(ep => ep.id === routeInfo.destination.id).coordinate,
                arriveOn = getDistance([fromCoords.latitude, fromCoords.longitude], [toCoords.latitude, toCoords.longitude]) / 600;

            document.querySelector('.animate-route').style.animation = `test ${arriveOn}s ease-in-out forwards`;
        
            setTimeout(() => {
                notify(`You arrived at ${routeInfo.destination.name}.`);
                setTimeout(() => {
                    document.querySelector('.animate-route').style.animation = ``;
                    document.querySelector('.searchbar').style.display = '';
                    routeController.setWaypoints([]);
                    markers.filter(marker => marker.options.endpointId !== routeInfo.from.id && marker.options.endpointId !== routeInfo.destination.id).forEach(marker => {
                        marker.addTo(map);
                    });
                }, 2000)
            }, (arriveOn * 1000));
        })
}