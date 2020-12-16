"use strict";

let dragStarted = false;
let dragInitialized = false;
let dragInfo = {
    started: false,
    initialized: false,
    startPos: null,
    prevPos: null
};

function initQuickAccess() {
    document.querySelector('#quick-access > header').updateEventListener('touchstart', dragStart);
    document.querySelector('#quick-access > header').updateEventListener('touchmove', dragMove);
    document.querySelector('#quick-access > header').updateEventListener('touchend', dragEnd);

    showGreeting();
    document.querySelector('#recent-trips ul').updateEventListener('scroll', recentTripScroll);
}

function recentTripScroll(e) {
    document.querySelectorAll('#recent-trips ul li').forEach(el => {
        const loc = (el.getBoundingClientRect().left + el.getBoundingClientRect().right) / 2;
        let maxShadow = loc % (window.screen.width / 2);
        let halfScreen = (window.screen.width / 2);

        if (loc > halfScreen) {
            maxShadow = halfScreen - maxShadow;
            if (loc > window.screen.width) {
                maxShadow = 0;
            }
        }

        if (maxShadow < halfScreen * 0.25) maxShadow = halfScreen * 0.25;

        maxShadow = (33 / halfScreen) * maxShadow;
        
        el.style.boxShadow = `0 ${maxShadow * 0.08}px ${maxShadow * 0.12}px rgba(0, 0, 0, 0.02), 0 ${maxShadow * 0.15}px ${maxShadow * 0.15}px rgba(0, 0, 0, 0.028), 0 ${maxShadow * 0.28}px ${maxShadow * 0.3}px rgba(0, 0, 0, 0.035), 0 ${maxShadow * 0.36}px ${maxShadow * 0.54}px rgba(0, 0, 0, 0.042), 0 ${maxShadow / 2}px ${maxShadow}px rgba(0, 0, 0, 0.07)`
    })
}

function openQuickAccess() {
    document.querySelector('#searchBox-1').parentNode.classList.add('quick-access-open');
}

function closeQuickAccess() {
    document.querySelector('#searchBox-1').parentNode.classList.remove('quick-access-open');
}

function showGreeting() {
    const currentTime = new Date().getHours();

    document.querySelector('#quick-access > header h2').innerHTML = currentTime < 6 ? 'Good night': currentTime < 12 ? 'Good morning': currentTime < 18 ? 'Good afternoon': 'Good evening';
}

function dragStart(e) {
    if (!dragInfo.started) {
        dragInfo.startPos = document.querySelector('#quick-access').getBoundingClientRect().top;
    }
    dragInfo.started = true;
    dragInfo.prevPos = dragInfo.startPos;
}

function dragMove(e) {
    e.preventDefault();
    dragInfo.initialized = true;
    let curPos = e.clientY || e.touches[0].clientY;
    document.querySelector('#quick-access').style.transform = `translateY(${curPos}px)`;
    dragInfo.prevPos = dragInfo.prevPos - (dragInfo.prevPos - curPos);
}

function dragEnd(e) {
    document.querySelector('#quick-access').style.transition = 'transform 0.3s ease-in-out';

    if (dragInfo.prevPos < dragInfo.startPos * .7 || (!dragInfo.initialized && !document.querySelector('#quick-access').classList.contains('active'))) {
        document.querySelector('#quick-access').style.transform = `translateY(0)`;
        if (!document.querySelector('#quick-access').classList.contains('active')) {
            goTo('#quick-access');
        }
    } else {
        document.querySelector('#quick-access').style.transform = `translateY(75vh)`;
        goBack();
    }
    dragInfo.initialized = false;
    setTimeout(() => {
        document.querySelector('#quick-access').style.transform = ``;
        document.querySelector('#quick-access').style.top = ``;
        document.querySelector('#quick-access').style.transition = '';
    }, 400)
}