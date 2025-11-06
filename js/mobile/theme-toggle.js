// Mobile theme toggle functionality
function toggleTheme() {
	const themeToggle = document.getElementById('theme-toggle');
	if (themeToggle) {
		themeToggle.click();
	}
	// Update mobile theme toggle text
	updateMobileThemeToggle();
}

function updateMobileThemeToggle() {
	const mobileThemeText = document.getElementById('mobile-theme-text');
	const currentTheme = document.body.getAttribute('data-theme');
	if (mobileThemeText) {
		const mobileThemeNames = {
			'light': 'Dark Mode',
			'dark': 'Light Mode'
		};
		mobileThemeText.textContent = mobileThemeNames[currentTheme] || 'Dark Mode';
	}
}

// Initialize mobile theme toggle text
document.addEventListener('DOMContentLoaded', function() {
	updateMobileThemeToggle();
});

