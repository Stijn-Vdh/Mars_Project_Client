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
}

function openQuickAccess() {
    document.querySelector('#searchBox-1').parentNode.classList.add('quick-access-open');
}

function closeQuickAccess() {
    document.querySelector('#searchBox-1').parentNode.classList.remove('quick-access-open');
}

function showGreeting() {
    const currentTime = new Date().getHours();

    document.querySelector('#quick-access > header h2').innerHTML = currentTime < 6
        ? 'Good night' : currentTime < 12
            ? 'Good morning' : currentTime < 18
                ? 'Good afternoon' : 'Good evening';
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