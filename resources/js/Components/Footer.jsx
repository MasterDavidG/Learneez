
const Footer = () => {
    return (
        <footer className="custom-footer">
            <div className="footer-image-container">
                <img
                    src="/images/footer_logo.png"
                    alt="Learneez Footer"
                    className="footer-image"
                />
            </div>
            <div className="footer-text">
                <p>&copy; 2025 Learneez. България.</p>
                <p>
                    Научете за платформата{' '}
                    <a href="/about" className="footer-link">
                        тук
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
