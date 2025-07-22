import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Correct: Import js-cookie
import { useNavigate } from 'react-router-dom';

// SVG Icons for Google and LinkedIn (No changes needed)
const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.022,35.244,44,30.036,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);
 
const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);


// Main Auth Component
export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    
    const navigate = useNavigate();
    const clientId = '950084142781-o9prl3b49at4roi8diqj1r5hoe5lsait.apps.googleusercontent.com';
    
  const linkedInClientId = '78a5ldmurs1o8g';
  const linkedInRedirectUri = 'http://localhost:5173/login'

    // Ensure this redirect URI is authorized in your Google Cloud Console
    const redirectUri = 'http://localhost:5173/login'; // Changed back to /login as it's the auth page
    

    useEffect(() => {
        // This effect handles the redirect back from the OAuth provider
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Clean the URL by removing the code and state parameters
            window.history.replaceState({}, document.title, '/login');

            // Determine if the auth callback is from Google or LinkedIn
            const source = urlParams.get('state')?.includes('linkedin') ? 'linkedin' : 'google';
            console.log(code);

            const endpoint = source === 'linkedin'
                ? 'http://localhost:8080/public/Linkedin-auth-callback'
                : 'http://localhost:8080/public/google-auth-callback';

            // Exchange the authorization code for a token with your backend
            axios.post(endpoint, { code }, { headers: { 'Content-Type': 'application/json' } })
                .then((res) => {
                    // Correct: Use Cookies.set from js-cookie to store the token
                    Cookies.set('token', res.data, { path: '/' });
                    // Redirect to the user's profile page upon successful login
                    navigate('/home');
                })
                .catch((err) => {
                    // Log the error for debugging and show a user-friendly message
                    console.error(`${source} login failed:`, err);
                    // Consider showing an error message in the UI instead of an alert
                });
        }
    }, [navigate]);

    const handleGoogleLogin = () => {
        // Construct the Google OAuth URL and redirect the user
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
    };

   const handleLinkedInLogin = () => {

 const authUrl = `https://www.linkedin.com/oauth/v2/authorization` +
    `?response_type=code` +
    `&client_id=${linkedInClientId}` +
    `&redirect_uri=${linkedInRedirectUri}` +
    `&scope=openid%20profile%20email`+
    `&state=linkedin`; // Corrected scopes!

  window.location.href = authUrl;
};


    // --- STYLES (No changes needed) ---
    const pageStyles = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'var(--background-light)',
    };

    const mainContentStyles = {
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
    };

    const formContainerStyles = {
        width: '100%',
        maxWidth: '450px',
        backgroundColor: 'var(--white)',
        padding: '3rem',
        borderRadius: '1rem',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-color)',
        textAlign: 'center',
    };

    const inputGroupStyles = {
        position: 'relative',
        marginBottom: '1.75rem',
        textAlign: 'left',
    };

    const inputStyles = {
        width: '100%',
        padding: '0.9rem 1rem 0.9rem 3.25rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color)',
        fontSize: '1rem',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    };
    
    const inputIconStyles = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-light)',
    };

    const passwordIconStyles = {
        ...inputIconStyles,
        left: 'auto',
        right: '1rem',
        cursor: 'pointer'
    };

    const socialButtonStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        width: '100%',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        border: '1px solid var(--border-color)',
        background: 'var(--white)',
        color: 'var(--text-secondary)',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'var(--transition-fast)',
    };
    
    const footerStyles = {
        padding: '1.5rem',
        textAlign: 'center',
        color: 'var(--text-light)',
        fontSize: '0.875rem',
    };

    return (
        <div style={pageStyles}>
            <main style={mainContentStyles}>
                <div style={formContainerStyles}>
                    <a href="/" className="logo" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '1.5rem' }}>
                        Get Hired
                    </a>
                    <h1 className="section-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                        {isLoginView ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="section-subtitle" style={{ marginTop: 0, marginBottom: '3rem' }}>
                        {isLoginView ? 'Log in to continue your journey.' : 'Start your journey with us today.'}
                    </p>

                    <form>
                        {!isLoginView && (
                            <div style={inputGroupStyles}>
                                <User size={20} style={inputIconStyles} />
                                <input type="text" placeholder="Full Name" required style={inputStyles} />
                            </div>
                        )}
                        
                        {!isLoginView && (
                            <div style={inputGroupStyles}>
                                <Phone size={20} style={inputIconStyles} />
                                <input type="tel" placeholder="Phone Number" required style={inputStyles} />
                            </div>
                        )}

                        <div style={inputGroupStyles}>
                            <Mail size={20} style={inputIconStyles} />
                            <input type="email" placeholder="Email Address" required style={inputStyles} />
                        </div>

                        <div style={inputGroupStyles}>
                            <Lock size={20} style={inputIconStyles} />
                            <input type={showPassword ? "text" : "password"} placeholder="Password" required style={inputStyles} />
                            <div style={passwordIconStyles} onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>

                        {isLoginView && (
                             <div style={{ textAlign: 'right', marginBottom: '1.75rem' }}>
                                <a href="#" style={{ fontSize: '0.875rem', color: 'var(--primary-accent)', textDecoration: 'none' }}>
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
                            {isLoginView ? 'Log In' : 'Sign Up'}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2.5rem 0' }}>
                        <hr style={{ flexGrow: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
                        <span style={{ color: 'var(--text-light)', fontWeight: '500', fontSize: '0.875rem' }}>OR</span>
                        <hr style={{ flexGrow: 1, border: 'none', borderTop: '1px solid var(--border-color)' }} />
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button style={socialButtonStyles} onClick={handleGoogleLogin}>
                            <GoogleIcon />
                            Continue with Google
                        </button>
                        <button onClick={handleLinkedInLogin} style={{...socialButtonStyles, background: '#0077B5', color: 'var(--white)', border: 'none' }}>
                           <LinkedInIcon />
                            Continue with LinkedIn
                        </button>
                    </div>

                    <p style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        {isLoginView ? "Don't have an account?" : "Already have an account?"}
                        <button onClick={() => setIsLoginView(!isLoginView)} style={{ background: 'none', border: 'none', color: 'var(--primary-accent)', fontWeight: '600', cursor: 'pointer', marginLeft: '0.5rem', fontSize: '1rem' }}>
                            {isLoginView ? 'Sign Up' : 'Log In'}
                        </button>
                    </p>
                </div>
            </main>
            <footer style={footerStyles}>
                &copy; {new Date().getFullYear()} Get Hired. All Rights Reserved.
            </footer>
        </div>
    );
}
