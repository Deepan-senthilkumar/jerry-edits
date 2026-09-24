document.addEventListener('DOMContentLoaded', () => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer class="footer" id="footer">
                <div class="footer-content">
                    <div class="footer-box footer-box-1">
                        <h4>About Jerry Edits</h4>
                        <p style="color: #bbb; line-height: 1.6; font-size: 14px;">Jerry Edits is a premium Tamil WhatsApp status channel dedicated to crafting romantic, emotional, and friendship status videos. We create heartfelt content designed to connect with emotions, vibe with music, and tell a story 30 seconds at a time.</p>
                    </div>
                    <div class="footer-box footer-box-2">
                        <h4>Quick Links</h4>
                        <a href="index.html#section-0">Home</a>
                        <a href="index.html#section-1">About Me</a>
                        <a href="index.html#section-2">Top Videos</a>
                        <a href="insights.html">Channel Insights</a>
                        <a href="videos.html">All Videos</a>
                    </div>
                    <div class="footer-box footer-box-work">
                        <h4>Me & My Work</h4>
                        <a href="https://portfolio-deepan.vercel.app/" target="_blank" rel="noopener noreferrer">My Portfolio</a>
                        <a href="https://jerry-edits.vercel.app/" target="_blank" rel="noopener noreferrer">Jerry Edits</a>
                    </div>
                    <div class="footer-box footer-box-3">
                        <h4>Contact Us</h4>
                        <div class="footer-contact-info">
                            <p class="footer-contact-item"><i class="fa-solid fa-phone"></i> +91 7639432800</p>
                            <p class="footer-contact-item"><i class="fa fa-envelope"></i> deepansenthil098@gmail.com</p>
                        </div>
                        <div class="icon-div" style="margin-top: 15px;">
                            <a href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit" aria-label="LinkedIn"><i class="fa-brands fa-linkedin"></i></a>
                            <a href="https://github.com/Deepan-senthilkumar" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                            <a href="https://www.youtube.com/@jerryedits4" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
                            <a href="https://www.instagram.com/jerry_edits_offical/" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                        </div>
                    </div>
                </div>

                <div class="copyright-text">
                    <p>Copyright &copy; 2024 All rights reserved | Jerry-Edits</p>
                    <p class="developer-credit">Designed and Developed by <a href="https://portfolio-deepan.vercel.app/" target="_blank" rel="noopener noreferrer">Deepan S</a></p>
                </div>
            </footer>
        `;
    }
});
