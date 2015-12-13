/*global require, requirejs */

requirejs.config({
    baseUrl: 'js/app',
    paths: {
        'lib': '../vendor'
    },
    map: {
        'controllers/AppController': {
            'api/Socket': 'api/WebSocket'
        }
    }
});

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addPointerDownHandler = function (dom, handler) {
    'use strict';
    dom.addEventListener('touchstart', function (event) {
        handler.apply(this, arguments);
        event.preventDefault();
    }, false);

    dom.addEventListener('mousedown', function () {
        handler.apply(this, arguments);
    }, false);
};

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addPointerUpHandler = function (dom, handler) {
    'use strict';
    dom.addEventListener('touchend', function (event) {
        handler.apply(this, arguments);
        event.preventDefault();
    }, false);

    dom.addEventListener('mouseup', function () {
        handler.apply(this, arguments);
    }, false);
};

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addPointerMoveHandler = function (dom, handler) {
    'use strict';
    dom.addEventListener('touchmove', function (event) {
        handler.apply(this, arguments);
        event.preventDefault();
    }, false);

    dom.addEventListener('mousemove', function () {
        handler.apply(this, arguments);
    }, false);
};

/**
 *
 * @param {HTMLElement} dom
 * @param {function} handler
 */
window.addClickHandler = function (dom, handler) {
    'use strict';
    var toFire = false;

    dom.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            return;
        }
        toFire = true;
    }, false);

    dom.addEventListener('touchmove', function () {
        toFire = false;
    }, false);

    dom.addEventListener('touchend', function (event) {
        var focused;
        if (toFire) {
            handler.apply(this, arguments);

            focused = document.querySelector(':focus');

            if (focused && event.target !== focused) {
                focused.blur();
            }

            if (event.target.tagName !== 'INPUT') {
                event.preventDefault();
            }
        }
    }, false);

    dom.addEventListener('click', function () {
        handler.apply(this, arguments);
    }, false);
};

function checkInstallFirefoxOS() {
    'use strict';
    var manifest_url, installCheck;

    manifest_url = [location.protocol, '//', location.host, location.pathname.replace('index.html',''), 'manifest.webapp'].join('');
    installCheck = navigator.mozApps.checkInstalled(manifest_url);

    installCheck.onsuccess = function() {
        var installLoc;
        if(!installCheck.result) {
            if (confirm('Do you want to install hyperion remote contorl on your device?')) {
                installLoc = navigator.mozApps.install(manifest_url);
                installLoc.onsuccess = function(data) {
                };
                installLoc.onerror = function() {
                    alert(installLoc.error.name);
                };
            }
        }
    };
}

require(['controllers/AppController'], function (AppController) {
    'use strict';
    var app = new AppController();
    app.init();
    if (navigator.mozApps && navigator.userAgent.indexOf('Mobile') !== -1 && navigator.userAgent.indexOf('Android') === -1) {
        checkInstallFirefoxOS();
    }
});
