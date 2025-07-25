import React from 'react'
import './Footer.css'
import instagram_icon from '../Assets/instagram_icon.png'
import whatsapp_icon from '../Assets/whatsapp_icon.png'
import logo from '../Assets/logo.png'

export const Footer = () => {
    return (
        <footer className='footer'>
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <img src={logo} alt="Schedy Logo" />
                        <h3>Schedy</h3>
                    </div>
                    <p>Smart AI-powered scheduling solution for modern businesses.</p>
                </div>
                
                <div className="footer-section">
                    <h3>Navigation</h3>
                    <ul>
                        <li><a href="/homepage">Dashboard</a></li>
                        <li><a href="/calendar">Calendar</a></li>
                        <li><a href="/operation">Operations</a></li>
                        <li><a href="/settings">Settings</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h3>Contact</h3>
                    <p>Email: support@schedy.com</p>
                    <p>Phone: (555) 123-4567</p>
                    <div className="footer-social">
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <img src={instagram_icon} alt="Instagram"/>
                        </a>
                        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
                            <img src={whatsapp_icon} alt="WhatsApp"/>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <hr/>
                <p>© 2025 Schedy - All Rights Reserved</p>
                <div className="developer-credits">
                    <p>Developed by:</p>
                    <p>Bharat Kumar & Daksh Malhotra</p>
                </div>
            </div>
        </footer>
    )
}
