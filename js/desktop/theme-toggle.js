// Theme switching functionality - Light and Dark Brutalism
const themeToggle = document.getElementById('theme-toggle');
if (!themeToggle) {
	console.warn('Desktop theme toggle button not found');
} else {
	const body = document.body;
	const themes = ['light', 'dark'];
	
	function updateToggleButton(theme) {
		const themeNames = {
			'light': 'Dark',
			'dark': 'Light'
		};
		themeToggle.textContent = themeNames[theme] || 'Dark';
		
		// Update mobile theme toggle text if it exists
		if (typeof updateMobileThemeToggle === 'function') {
			updateMobileThemeToggle();
		}
	}
	
	// Check for saved theme or default to light mode
	const currentTheme = localStorage.getItem('theme') || 'light';
	body.setAttribute('data-theme', currentTheme);
	updateToggleButton(currentTheme);
	
	themeToggle.addEventListener('click', () => {
		const currentTheme = body.getAttribute('data-theme');
		const currentIndex = themes.indexOf(currentTheme);
		const nextIndex = (currentIndex + 1) % themes.length;
		const newTheme = themes[nextIndex];
		
		body.setAttribute('data-theme', newTheme);
		localStorage.setItem('theme', newTheme);
		updateToggleButton(newTheme);
	});
}

