// Hamburger menu functionality
function toggleHamburgerMenu() {
	const menu = document.getElementById('mobile-menu');
	const overlay = document.getElementById('mobile-menu-overlay');
	const toggle = document.getElementById('hamburger-toggle');
	
	if (menu.classList.contains('active')) {
		closeHamburgerMenu();
	} else {
		openHamburgerMenu();
	}
}

function openHamburgerMenu() {
	const menu = document.getElementById('mobile-menu');
	const overlay = document.getElementById('mobile-menu-overlay');
	const toggle = document.getElementById('hamburger-toggle');
	
	menu.classList.add('active');
	overlay.classList.add('active');
	toggle.classList.add('active');
	document.body.style.overflow = 'hidden';
	
	// Populate timeline if on about page
	populateTimelineInMenu();
}

function closeHamburgerMenu() {
	const menu = document.getElementById('mobile-menu');
	const overlay = document.getElementById('mobile-menu-overlay');
	const toggle = document.getElementById('hamburger-toggle');
	
	menu.classList.remove('active');
	overlay.classList.remove('active');
	toggle.classList.remove('active');
	document.body.style.overflow = '';
}

window.updateMobileTimelineActive = () => {};

function populateTimelineInMenu() {
	const timelineSection = document.getElementById('mobile-timeline-section');
	const timelineContainer = document.getElementById('mobile-timeline-container');
	
	// Check if we're on the about page and timeline links exist
	const timelineLinks = document.querySelectorAll('.timeline-nav-link');
	if (timelineLinks.length > 0 && window.location.pathname.includes('about')) {
		timelineSection.style.display = 'block';
		timelineContainer.innerHTML = '';
		const mobileItems = new Map();
		
		timelineLinks.forEach(link => {
			const period = link.getAttribute('data-period');
			const periodLabel = link.querySelector('.timeline-nav-period')?.textContent?.trim() || period;
			const titleText = link.querySelector('.timeline-nav-title')?.textContent?.trim() || link.textContent.trim();
			
			const menuItem = document.createElement('button');
			menuItem.type = 'button';
			menuItem.className = 'mobile-timeline-item';
			menuItem.innerHTML = `
				<span class="mobile-timeline-period">${periodLabel || ''}</span>
				<span class="mobile-timeline-title">${titleText}</span>
			`;
			menuItem.onclick = () => {
				if (period && typeof window.navigateTimelineTo === 'function') {
					window.navigateTimelineTo(period);
				} else {
					const targetId = link.getAttribute('href');
					const target = targetId ? document.querySelector(targetId) : null;
					if (target) {
						target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					}
				}
				closeHamburgerMenu();
			};
			
			// Add active class if timeline item is active
			if (link.classList.contains('active')) {
				menuItem.classList.add('active');
			}
			
			timelineContainer.appendChild(menuItem);
			if (period) {
				mobileItems.set(period, menuItem);
			}
		});
		
		window.updateMobileTimelineActive = (activePeriod) => {
			mobileItems.forEach((item, periodKey) => {
				item.classList.toggle('active', periodKey === activePeriod);
			});
		};
		
		const currentPeriod = typeof window.getActiveTimelinePeriod === 'function'
			? window.getActiveTimelinePeriod()
			: null;
		if (currentPeriod) {
			window.updateMobileTimelineActive(currentPeriod);
		}
	} else {
		timelineSection.style.display = 'none';
		window.updateMobileTimelineActive = () => {};
	}
}

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

// Keyboard support
document.addEventListener('keydown', function(e) {
	if (e.key === 'Escape') {
		closeHamburgerMenu();
	}
});

// Initialize mobile theme toggle text
document.addEventListener('DOMContentLoaded', function() {
	updateMobileThemeToggle();
});

// Theme switching functionality - Light and Dark Brutalism
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themes = ['light', 'dark'];

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

function updateToggleButton(theme) {
	const themeNames = {
		'light': 'Dark',
		'dark': 'Light'
	};
	themeToggle.textContent = themeNames[theme] || 'Dark';
	updateMobileThemeToggle();
}

// Skills Carousel Functionality - Infinite Scroll
document.addEventListener('DOMContentLoaded', function() {
	const track = document.getElementById('skills-track');
	const prevBtn = document.getElementById('skills-prev');
	const nextBtn = document.getElementById('skills-next');
	const dotsContainer = document.getElementById('skills-dots');
	
	if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
	
	// Store original cards and create infinite scroll setup
	const originalCards = Array.from(track.children);
	const totalCards = originalCards.length;
	let cardWidth = 200;
	let gap = 20;
	let currentIndex = 0;
	let actualIndex = 0; // For tracking real position in original array
	let isTransitioning = false;
	let autoPlayInterval = null;
	
	// Clone cards for infinite effect
	function setupInfiniteScroll() {
		// Clear track
		track.innerHTML = '';
		
		// Clone last few cards at the beginning
		const clonesAtStart = Math.min(3, totalCards);
		for (let i = totalCards - clonesAtStart; i < totalCards; i++) {
			const clone = originalCards[i].cloneNode(true);
			clone.classList.add('carousel-clone');
			track.appendChild(clone);
		}
		
		// Add original cards
		originalCards.forEach(card => {
			track.appendChild(card.cloneNode(true));
		});
		
		// Clone first few cards at the end
		const clonesAtEnd = Math.min(3, totalCards);
		for (let i = 0; i < clonesAtEnd; i++) {
			const clone = originalCards[i].cloneNode(true);
			clone.classList.add('carousel-clone');
			track.appendChild(clone);
		}
		
		// Set initial position to first real card (after clones)
		currentIndex = clonesAtStart;
		actualIndex = 0;
	}
	
	function calculateDimensions() {
		const carouselWidth = track.parentElement.offsetWidth;
		const currentTheme = document.body.getAttribute('data-theme');
		
		cardWidth = 200;
		gap = 20;
		
		return {
			visibleCards: Math.floor(carouselWidth / (cardWidth + gap)),
			maxIndex: Math.max(0, totalCards - Math.floor(carouselWidth / (cardWidth + gap)))
		};
	}
	
	function createDots() {
		dotsContainer.innerHTML = '';
		const { maxIndex } = calculateDimensions();
		
		for (let i = 0; i <= maxIndex; i++) {
			const dot = document.createElement('div');
			dot.className = 'carousel-dot';
			if (i === actualIndex) dot.classList.add('active');
			dot.addEventListener('click', () => goToSlide(i));
			dotsContainer.appendChild(dot);
		}
	}
	
	function updateCarousel(withTransition = true) {
		if (withTransition) {
			track.style.transition = 'transform 0.5s ease';
		} else {
			track.style.transition = 'none';
		}
		
		// Calculate offset to account for the clones at the start
		const clonesAtStart = Math.min(3, totalCards);
		const offsetIndex = currentIndex - clonesAtStart;
		const translateX = -offsetIndex * (cardWidth + gap);
		track.style.transform = `translateX(${translateX}px)`;
		
		// Enable looping - never disable buttons
		prevBtn.disabled = false;
		nextBtn.disabled = false;
		
		// Update actualIndex based on current position
		if (currentIndex >= clonesAtStart && currentIndex < clonesAtStart + totalCards) {
			actualIndex = currentIndex - clonesAtStart;
		}
		
		const dots = dotsContainer.children;
		Array.from(dots).forEach((dot, index) => {
			dot.classList.toggle('active', index === actualIndex);
		});
		
		// Handle infinite scroll wraparound
		if (!isTransitioning && withTransition) {
			const clonesAtEnd = Math.min(3, totalCards);
			const totalItemsWithClones = totalCards + clonesAtStart + clonesAtEnd;
			
			setTimeout(() => {
				// If we're at a clone at the end, jump to the beginning
				if (currentIndex >= totalItemsWithClones - clonesAtEnd) {
					isTransitioning = true;
					const offset = currentIndex - (totalItemsWithClones - clonesAtEnd);
					currentIndex = clonesAtStart + offset;
					actualIndex = offset % totalCards;
					updateCarousel(false);
					setTimeout(() => isTransitioning = false, 50);
				}
				// If we're at a clone at the beginning, jump to the end
				else if (currentIndex < clonesAtStart) {
					isTransitioning = true;
					const offset = clonesAtStart - currentIndex;
					currentIndex = totalItemsWithClones - clonesAtEnd - offset;
					actualIndex = (totalCards - offset) % totalCards;
					updateCarousel(false);
					setTimeout(() => isTransitioning = false, 50);
				}
			}, 500);
		}
	}
	
	function goToSlide(index) {
		if (isTransitioning) return;
		
		const { maxIndex } = calculateDimensions();
		actualIndex = Math.max(0, Math.min(index, maxIndex));
		const clonesAtStart = Math.min(3, totalCards);
		currentIndex = clonesAtStart + actualIndex;
		updateCarousel();
		resetAutoPlay(); // Reset timer on manual interaction
	}
	
	function startAutoPlay() {
		stopAutoPlay(); // Clear any existing interval
		autoPlayInterval = setInterval(() => {
			if (!isTransitioning) {
				currentIndex++;
				updateCarousel();
			}
		}, 20000); // 20 seconds
	}
	
	function stopAutoPlay() {
		if (autoPlayInterval) {
			clearInterval(autoPlayInterval);
			autoPlayInterval = null;
		}
	}
	
	function resetAutoPlay() {
		startAutoPlay();
	}
	
	prevBtn.addEventListener('click', () => {
		if (isTransitioning) return;
		
		currentIndex--;
		updateCarousel();
		resetAutoPlay(); // Reset timer on manual interaction
	});
	
	nextBtn.addEventListener('click', () => {
		if (isTransitioning) return;
		
		currentIndex++;
		updateCarousel();
		resetAutoPlay(); // Reset timer on manual interaction
	});
	
	let resizeTimeout;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			createDots();
			const { maxIndex } = calculateDimensions();
			// Keep actualIndex within bounds
			if (actualIndex > maxIndex) {
				actualIndex = Math.min(actualIndex, maxIndex);
				const clonesAtStart = Math.min(3, totalCards);
				currentIndex = clonesAtStart + actualIndex;
			}
			updateCarousel(false);
		}, 250);
	});
	
	// Initialize infinite scroll
	setupInfiniteScroll();
	createDots();
	updateCarousel(false);
	
	// Start auto-play
	startAutoPlay();
});

