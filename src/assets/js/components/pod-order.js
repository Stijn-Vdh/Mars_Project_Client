"use strict";

function podOrderInit() {
    document.querySelectorAll('#standard-pod, #luxury-pod').forEach(el => el.updateEventListener('click', switchPod));
    document.querySelector('#select-travel-location').updateEventListener('submit', orderPod);
    document.querySelector('#favourite-endpoint').addEventListener('change', favouriteRoute);

    document.querySelector('#reward-points').addEventListener('change', checkedRewardPoints);
    document.querySelector('#discount').addEventListener('input', updateRange);
}

function updateRange(e) {
    document.querySelector('#discount-used').value = e.currentTarget.value;
    document.querySelector('#pod-pricing span').innerHTML = `M${3 - (parseInt(e.currentTarget.value) / 100)}`;
}

function checkedRewardPoints() {
    document.querySelector('#discount-used').value = document.querySelector('#discount').value;
    if (document.querySelector('#reward-points').checked) {
        document.querySelector('#luxury-pod').click();
        document.querySelector('#travel-discount-info').classList.remove('hidden');
    } else {
        document.querySelector('#travel-discount-info').classList.add('hidden');
        document.querySelector('#pod-pricing span').innerHTML = `M3`;
    }
}

function switchPod(e) {
    const selectedPod = e.currentTarget.id;

    document.querySelector('#selected-pod').value = selectedPod.split('-')[0];

    if (selectedPod.split('-')[0] === "standard") {
        document.querySelector('#reward-points').checked = false;
        checkedRewardPoints();
    }

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
                    document.querySelector('#travel-view').style.transitionDuration = `0s`;
                    document.querySelector('.timeline .travel-pod').style.left = `0%`;
                    document.querySelector('#travel-view .travel-pod').style.top = `2.05rem`;
                    document.querySelector('.animate-route').style.animation = ``;
                    document.querySelector('.searchbar').style.display = '';
                    document.querySelector('#current-location').classList.remove("hidden");
                    document.querySelector('#quick-access').classList.remove('traveling');
                    routeController.setWaypoints([]);
                    updateMarkers();
                    startMapUpdater();
                    enableMapControl();
                }, 2000)
            }, (arriveOn * 1000));
        })
}

function checkFavoured() {
    let id = document.querySelector('#select-location').value;
    document.querySelector('#favourite-endpoint').checked = false;
    document.querySelector('#favourite-icon').setAttribute('name', 'star-outline');
    accInfo.favouriteEndpoints.forEach(endpoint => {
        if (endpoint.id === parseInt(id)) {
            document.querySelector('#favourite-endpoint').checked = true;
            setTimeout(() => {
                document.querySelector('#favourite-icon').setAttribute('name', 'star');
            }, 100)
        }
    });

}