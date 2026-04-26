/**
 * GPIW Authentication Manager
 * Shared across all pages. Handles login state, profile UI injection, and dropdown.
 */

(function() {
    'use strict';

    const AUTH_KEY = 'gpiw_auth';
    const USER_KEY = 'gpiw_user';

    // ===== State Check =====
    function isLoggedIn() {
        return localStorage.getItem(AUTH_KEY) === 'true';
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(USER_KEY)) || null;
        } catch (e) {
            return null;
        }
    }

    // ===== DOM Injection =====
    function injectAuthUI() {
        const authBtn = document.querySelector('.auth-btn');
        if (!authBtn) return;

        const user = getUser();

        if (isLoggedIn() && user) {
            // Build profile dropdown
            const shortName = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U';
            const profileHTML = `
                <div class="auth-profile" id="authProfile">
                    <div class="profile-trigger" id="profileTrigger">
                        <img src="${user.avatar || 'pics/principal.png'}" alt="${user.name}" class="profile-avatar-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                        <div class="profile-avatar-fallback" style="display:none;">${shortName}</div>
                    <div class="profile-dropdown" id="profileDropdown">
                        <div class="profile-dropdown-header">
                            <img src="${user.avatar || 'pics/principal.png'}" alt="${user.name}" class="dropdown-avatar" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                            <div class="dropdown-avatar-fallback" style="display:none;">${shortName}</div>
                            <div class="dropdown-user-info">
                                <div class="dropdown-name">${escapeHtml(user.name)}</div>
                                <div class="dropdown-email">${escapeHtml(user.email)}</div>
                        </div>
                        <div class="profile-dropdown-divider"></div>
                        <a href="#" class="dropdown-item"><span>&#128100;</span>Profile</a>
                        <a href="#" class="dropdown-item"><span>&#9881;</span>Settings</a>
                        <div class="profile-dropdown-divider"></div>
                        <button class="dropdown-item logout-item" id="logoutBtn"><span>&#128682;</span>Logout</button>
                    </div>
            `;
            authBtn.innerHTML = profileHTML;

            // Bind events
            const trigger = document.getElementById('profileTrigger');
            const dropdown = document.getElementById('profileDropdown');
            const logoutBtn = document.getElementById('logoutBtn');

            if (trigger && dropdown) {
                trigger.addEventListener('click', function(e) {
                    e.stopPropagation();
                    dropdown.classList.toggle('show');
                });

                document.addEventListener('click', function(e) {
                    if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
                        dropdown.classList.remove('show');
                    }
                });
            }

            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    logout();
                });
            }

        } else {
            // Not logged in: ensure Sign In button links to auth.html
            const btn = authBtn.querySelector('.btn');
            if (btn) {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'auth.html';
                });
            } else {
                // If button doesn't exist, create one
                authBtn.innerHTML = '<button class="btn signin">Sign In</button>';
                authBtn.querySelector('.btn').addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'auth.html';
                });
            }
        }
    }

    // ===== Logout =====
    window.logout = function() {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(USER_KEY);
        window.location.reload();
    };

    // ===== Utility =====
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== Init =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectAuthUI);
    } else {
        injectAuthUI();
    }
})();
