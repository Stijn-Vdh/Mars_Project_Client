"use strict";

function initQuickAccess() {
    document.querySelector('#quick-access > header').addEventListener('touchstart', dragStart);
    document.querySelector('#quick-access > header').addEventListener('touchmove', dragMove);
    document.querySelector('#quick-access > header').addEventListener('touchend', dragEnd);
}