// Simple interaction logic
document.addEventListener('DOMContentLoaded', () => {
    // Determine environment URL dynamically
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname === 'landing';
    const frontendUrl = isLocal ? 'https://app.localhost' : 'https://d1wxm3z7v3i1dx.cloudfront.net';

    // Update navbar login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.href = `${frontendUrl}/login`;
    }

    // Add interaction to the Get Started button
    const getStartedBtn = document.getElementById('getStartedBtn');
    if(getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // Redirect to the main app dashboard
            window.location.href = `${frontendUrl}/login`;
        });
    }

    // Add subtle parallax effect to orbs based on mouse movement
    document.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.orb');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const moveX = (x - 0.5) * speed;
            const moveY = (y - 0.5) * speed;
            orb.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
});
