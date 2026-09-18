document.addEventListener('DOMContentLoaded', () => {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        const path = window.location.pathname.toLowerCase();
        const isInsights = path.includes('insights.html');
        const isVideos = path.includes('videos.html');
        const isHome = !isInsights && !isVideos;

        headerPlaceholder.innerHTML = `
            <section class="section-0" id="section-0">
                <div class="top-bar">
                    <div class="nav-item">
                        <a href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit"
                            style="color: black;"><i class="fa-brands fa-linkedin"></i></a>
                        <a href="https://github.com/Deepan-senthilkumar" style="color: black;"><i
                                class="fa-brands fa-github"></i></a>
                        <a href="https://www.youtube.com/@jerryedits4" style="color: black;"><i
                                class="fa-brands fa-youtube"></i></a>
                        <a href="https://www.instagram.com/jerry_edits_offical/" style="color: black;"><i
                                class="fa-brands fa-instagram"></i></a>
                        <a href="https://telegram.me/JerryEditz18" style="color: black;"><i
                                class="fa-brands fa-telegram"></i></a>
                    </div>
                    <div class="logo">
                        <h1>🎬 Jerry Edits</h1>
                        <h3>Feel the love, vibe the emotion – 30 seconds at a time.</h3>
                    </div>
                    <div class="logo-img-wrapper">
                        <img src="images/logo.jpg" alt="Jerry-Edits" class="top-bar-logo">
                    </div>
                </div>
            </section>

            <nav class="nav-sticky">
                <div class="nav-header">
                    <div class="nav-brand-wrapper">
                        <img src="images/logo.jpg" alt="Jerry-Edits" class="nav-logo">
                        <span class="nav-brand">Jerry Edits</span>
                    </div>
                    <button class="menu-toggle" id="menu-toggle" aria-label="Toggle navigation">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
                <div class="nav-menu" id="nav-menu">
                    <a href="index.html#section-0" class="${isHome ? 'active-nav' : ''}">Home</a>
                    <a href="index.html#section-1">About</a>
                    <a href="index.html#section-2">Top Videos</a>
                    <a href="insights.html" class="${isInsights ? 'active-nav' : ''}">Insights</a>
                    <a href="videos.html" class="${isVideos ? 'active-nav' : ''}">Videos</a>
                    <a href="#footer">Contact</a>
                </div>
            </nav>
        `;

        // Mobile menu toggle functionality
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (menuToggle && navMenu) {
            const menuIcon = menuToggle.querySelector('i');
            const navLinks = navMenu.querySelectorAll('a');

            menuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                if (navMenu.classList.contains('active')) {
                    if (menuIcon) {
                        menuIcon.classList.remove('fa-bars');
                        menuIcon.classList.add('fa-xmark');
                    }
                } else {
                    if (menuIcon) {
                        menuIcon.classList.remove('fa-xmark');
                        menuIcon.classList.add('fa-bars');
                    }
                }
            });

            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    if (menuIcon) {
                        menuIcon.classList.remove('fa-xmark');
                        menuIcon.classList.add('fa-bars');
                    }
                });
            });
        }
    }
});
