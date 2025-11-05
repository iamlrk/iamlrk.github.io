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
		const carouselContainer = track.parentElement;
		
		// Reset max-width to measure the available space
		carouselContainer.style.maxWidth = '';
		const availableWidth = carouselContainer.offsetWidth;
		
		// Determine card width based on viewport (matching CSS media queries)
		const isMobile = window.innerWidth <= 480;
		gap = isMobile ? 10 : 20;
		
		// On mobile, always show exactly 1 card at a time
		let visibleCards;
		if (isMobile) {
			visibleCards = 1;
			// On mobile, card fills the available width (accounting for container padding)
			cardWidth = availableWidth;
		} else {
			// Desktop: uses 300px cards
			cardWidth = 300;
			// Desktop: Calculate how many whole cards can fit
			visibleCards = Math.max(1, Math.floor((availableWidth + gap) / (cardWidth + gap)));
		}
		
		// Calculate the exact width needed for whole cards only
		// Formula: (number of cards × card width) + ((number of cards - 1) × gap)
		const exactWidth = (visibleCards * cardWidth) + ((visibleCards - 1) * gap);
		
		// Set the carousel to show only whole cards - constrain to exact width
		carouselContainer.style.width = `${exactWidth}px`;
		carouselContainer.style.maxWidth = `${exactWidth}px`;
		
		return {
			visibleCards: visibleCards,
			maxIndex: Math.max(0, totalCards - visibleCards)
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
	
	// Touch and Mouse Drag Support
	let isDragging = false;
	let startPos = 0;
	let currentTranslate = 0;
	let prevTranslate = 0;
	let animationID = 0;
	let startTime = 0;
	
	function getPositionX(event) {
		return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
	}
	
	function dragStart(event) {
		if (isTransitioning) return;
		
		isDragging = true;
		startPos = getPositionX(event);
		startTime = Date.now();
		animationID = requestAnimationFrame(animation);
		track.classList.add('dragging');
		stopAutoPlay();
	}
	
	function dragMove(event) {
		if (!isDragging) return;
		event.preventDefault();
		
		const currentPosition = getPositionX(event);
		currentTranslate = prevTranslate + currentPosition - startPos;
	}
	
	function dragEnd(event) {
		if (!isDragging) return;
		
		isDragging = false;
		cancelAnimationFrame(animationID);
		track.classList.remove('dragging');
		
		const movedBy = currentTranslate - prevTranslate;
		const moveTime = Date.now() - startTime;
		const velocity = Math.abs(movedBy) / moveTime;
		
		// Determine if swipe was significant enough (moved > 50px or fast velocity)
		if (Math.abs(movedBy) > 50 || velocity > 0.5) {
			if (movedBy > 0) {
				// Swiped right - go to previous
				currentIndex--;
			} else {
				// Swiped left - go to next
				currentIndex++;
			}
		}
		
		currentTranslate = 0;
		prevTranslate = 0;
		updateCarousel();
		startAutoPlay();
	}
	
	function animation() {
		if (isDragging) {
			requestAnimationFrame(animation);
		}
	}
	
	// Touch events
	track.addEventListener('touchstart', dragStart, { passive: false });
	track.addEventListener('touchmove', dragMove, { passive: false });
	track.addEventListener('touchend', dragEnd);
	track.addEventListener('touchcancel', dragEnd);
	
	// Mouse events for desktop
	track.addEventListener('mousedown', dragStart);
	track.addEventListener('mousemove', dragMove);
	track.addEventListener('mouseup', dragEnd);
	track.addEventListener('mouseleave', () => {
		if (isDragging) dragEnd();
	});
	
	// Prevent context menu on long press
	track.addEventListener('contextmenu', (e) => {
		if (isDragging) e.preventDefault();
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
	
	// Small delay to ensure cards are rendered and styles are computed
	setTimeout(() => {
	createDots();
	updateCarousel(false);
	// Start auto-play
	startAutoPlay();
	}, 50);
});

// Mobile Timeline Tab Navigation
function initMobileTimelineTabs() {
	const timelineContainer = document.querySelector('.timeline-container');
	if (!timelineContainer) return;
	
	// Check if we're on mobile
	if (window.innerWidth > 480) return;
	
	// Get all timeline entries
	const entries = document.querySelectorAll('.timeline-entry');
	if (entries.length === 0) return;
	
	const timelineContent = document.querySelector('.timeline-content');
	if (!timelineContent) return;
	
	// Create mobile tabs container
	const tabsContainer = document.createElement('div');
	tabsContainer.className = 'timeline-mobile-tabs';
	
	// Store tabs for later reference
	const tabs = [];
	
	// Function to show specific entry and hide others
	function showEntry(index) {
		entries.forEach((entry, i) => {
			if (i === index) {
				entry.classList.add('active');
			} else {
				entry.classList.remove('active');
			}
		});
		
		// Scroll content to top when switching entries
		timelineContent.scrollTop = 0;
	}
	
	// Create tabs for each entry (reverse order: oldest to newest)
	const reversedEntries = Array.from(entries).reverse();
	reversedEntries.forEach((entry, reverseIndex) => {
		const originalIndex = entries.length - 1 - reverseIndex;
		const period = entry.querySelector('.timeline-entry-period');
		if (!period) return;
		
		const tab = document.createElement('button');
		tab.className = 'timeline-mobile-tab';
		// Last tab in display order (rightmost) should be active (latest month)
		const isLatest = reverseIndex === reversedEntries.length - 1;
		if (isLatest) tab.classList.add('active');
		tab.textContent = period.textContent.trim();
		tab.dataset.index = originalIndex;
		tabs.push(tab);
		
		tab.addEventListener('click', function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			// Update active tab
			tabs.forEach((t) => {
				t.classList.remove('active');
			});
			tab.classList.add('active');
			
			// Show corresponding entry
			showEntry(originalIndex);
			
			// Center the active tab in the tabs container
			const tabLeft = tab.offsetLeft;
			const tabWidth = tab.offsetWidth;
			const tabsContainerWidth = tabsContainer.offsetWidth;
			const scrollLeft = tabLeft - (tabsContainerWidth / 2) + (tabWidth / 2);
			
			tabsContainer.scrollTo({
				left: scrollLeft,
				behavior: 'smooth'
			});
		}, false);
		
		tabsContainer.appendChild(tab);
	});
	
	// Add tabs to container
	timelineContainer.appendChild(tabsContainer);
	
	// Show first entry by default (latest month - January 2025)
	showEntry(0);
	
	// Scroll to show the rightmost (latest) tab
	setTimeout(() => {
		const lastTab = tabs[tabs.length - 1];
		if (lastTab) {
			const tabLeft = lastTab.offsetLeft;
			const tabWidth = lastTab.offsetWidth;
			const tabsContainerWidth = tabsContainer.offsetWidth;
			const scrollLeft = tabLeft - (tabsContainerWidth / 2) + (tabWidth / 2);
			
			tabsContainer.scrollTo({
				left: scrollLeft,
				behavior: 'smooth'
			});
		}
	}, 100);
}

// Initialize mobile timeline tabs when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initMobileTimelineTabs);
} else {
	initMobileTimelineTabs();
}

// Reinitialize on resize if crossing mobile breakpoint
let wasMobile = window.innerWidth <= 480;
window.addEventListener('resize', () => {
	const isMobile = window.innerWidth <= 480;
	if (isMobile !== wasMobile) {
		wasMobile = isMobile;
		location.reload(); // Reload to reinitialize properly
	}
});

