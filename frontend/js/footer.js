document.addEventListener('DOMContentLoaded', () => {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = `
            <footer class="footer" id="footer">
                <div class="footer-content">
                    <div class="footer-box footer-box-1">
                        <h4>About Jerry Edits</h4>
                        <p style="color: #bbb; line-height: 1.6; font-size: 14px;">Jerry Edits is an official Tamil WhatsApp status and EFX video editing showcase created by Deepan S. Since August 2020, we have published 89+ curated video edits accumulating over 285,000 views across YouTube and social platforms.</p>
                    </div>
                    <div class="footer-box footer-box-2">
                        <h4>Quick Links</h4>
                        <a href="index.html">Home</a>
                        <a href="about.html">About Jerry Edits</a>
                        <a href="videos.html">All Videos</a>
                        <a href="insights.html">Channel Insights</a>
                        <a href="contact.html">Contact Us</a>
                    </div>
                    <div class="footer-box footer-box-work">
                        <h4>Legal & Policies</h4>
                        <a href="privacy-policy.html">Privacy Policy</a>
                        <a href="terms.html">Terms & Conditions</a>
                        <a href="disclaimer.html">Copyright & Disclaimer</a>
                        <a href="https://portfolio-deepan.vercel.app/" target="_blank" rel="noopener noreferrer">Creator Portfolio</a>
                    </div>
                    <div class="footer-box footer-box-3">
                        <h4>Contact Us</h4>
                        <div class="footer-contact-info">
                            <p class="footer-contact-item"><i class="fa-solid fa-phone"></i> +91 7639432800</p>
                            <p class="footer-contact-item"><i class="fa fa-envelope"></i> deepansenthil098@gmail.com</p>
                        </div>
                        <div class="icon-div" style="margin-top: 15px;">
                            <a href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin"></i></a>
                            <a href="https://github.com/Deepan-senthilkumar" aria-label="GitHub" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-github"></i></a>
                            <a href="https://www.youtube.com/@jerryedits4" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-youtube"></i></a>
                            <a href="https://www.instagram.com/jerry_edits_offical/" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a>
                            <a href="https://telegram.me/JerryEditz18" aria-label="Telegram" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-telegram"></i></a>
                        </div>
                    </div>
                </div>

                <div class="copyright-text">
                    <p>Copyright &copy; 2020-2026 All rights reserved | Jerry Edits Official (@jerryedits4)</p>
                    <p class="developer-credit">Created and Curated by <a href="https://portfolio-deepan.vercel.app/" target="_blank" rel="noopener noreferrer">Deepan S</a></p>
                </div>
            </footer>
        `;
    }
});
