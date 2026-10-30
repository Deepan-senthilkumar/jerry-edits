(function () {
    var loaded = false;
    function loadAdSense() {
        if (loaded) return;
        loaded = true;
        var s = document.createElement('script');
        s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6469063098847756';
        s.async = true;
        s.crossOrigin = 'anonymous';
        document.head.appendChild(s);
        removeListeners();
    }
    var events = ['scroll', 'touchstart', 'click', 'keydown', 'mousemove'];
    function removeListeners() {
        events.forEach(function (e) {
            window.removeEventListener(e, loadAdSense);
        });
    }
    events.forEach(function (e) {
        window.addEventListener(e, loadAdSense, { passive: true, once: true });
    });
    setTimeout(loadAdSense, 7000);
})();

