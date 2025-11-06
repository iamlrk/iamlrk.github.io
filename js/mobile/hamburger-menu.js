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
	
	// Check if timeline section elements exist
	if (!timelineSection || !timelineContainer) {
		return;
	}
	
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

// Keyboard support
document.addEventListener('keydown', function(e) {
	if (e.key === 'Escape') {
		closeHamburgerMenu();
	}
});

