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

