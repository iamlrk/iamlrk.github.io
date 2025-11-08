// Timeline navigation using left-hand sidebar anchors

document.addEventListener('DOMContentLoaded', () => {
	const navLinks = Array.from(document.querySelectorAll('.timeline-nav-link'));
	const entries = Array.from(document.querySelectorAll('.timeline-entry'));

	if (!navLinks.length || !entries.length) {
		return;
	}

	const entryIdByPeriod = new Map();
	const periodByEntryId = new Map();

	navLinks.forEach(link => {
		const period = link.getAttribute('data-period');
		const entryId = link.getAttribute('href').replace('#', '');
		if (period) {
			entryIdByPeriod.set(period, entryId);
		}
		periodByEntryId.set(entryId, period);
	});

	let currentEntryId = null;

	function updateNavState(entryId, { updateHash = true } = {}) {
		if (!entryId) return;

		navLinks.forEach(link => {
			const linkTarget = link.getAttribute('href').replace('#', '');
			const isActive = linkTarget === entryId;
			link.classList.toggle('active', isActive);
			if (isActive) {
				link.setAttribute('aria-current', 'true');
			} else {
				link.removeAttribute('aria-current');
			}
		});

		currentEntryId = entryId;
		const activePeriod = periodByEntryId.get(entryId) || null;

		if (typeof window.updateMobileTimelineActive === 'function') {
			window.updateMobileTimelineActive(activePeriod);
		}

		if (updateHash) {
			const desiredHash = `#${entryId}`;
			if (window.location.hash !== desiredHash) {
				history.replaceState(null, '', desiredHash);
			}
		}
	}

	function scrollToEntry(entryId, behavior = 'smooth') {
		if (!entryId) return;
		const target = document.getElementById(entryId);
		if (!target) return;
		
		// Get the timeline content container (scrollable area)
		const timelineContent = document.querySelector('.timeline-content');
		if (!timelineContent) {
			// Fallback to default behavior if container not found
			target.scrollIntoView({ behavior, block: 'start' });
			updateNavState(entryId);
			return;
		}
		
		// Get the sidebar to determine its top position
		const sidebar = document.querySelector('.timeline-sidebar');
		if (!sidebar) {
			target.scrollIntoView({ behavior, block: 'start' });
			updateNavState(entryId);
			return;
		}
		
		// Get the sidebar's top position (sticky top value)
		const sidebarRect = sidebar.getBoundingClientRect();
		const sidebarTop = sidebarRect.top;
		
		// Get the timeline content container's position
		const containerRect = timelineContent.getBoundingClientRect();
		
		// Calculate the offset needed: we want the card's top to align with sidebar's top
		// The card's position relative to the container's top edge
		const targetOffsetTop = target.offsetTop;
		
		// Calculate scroll position:
		// Card's visual position = containerRect.top + targetOffsetTop - scrollTop
		// We want: containerRect.top + targetOffsetTop - scrollTop = sidebarTop
		// Therefore: scrollTop = containerRect.top + targetOffsetTop - sidebarTop
		const desiredScrollTop = containerRect.top + targetOffsetTop - sidebarTop;
		
		// Calculate maximum possible scroll (content height - container height)
		const maxScrollTop = timelineContent.scrollHeight - timelineContent.clientHeight;
		
		// Ensure we scroll to align the card top with sidebar top
		// Special case: if this is the first entry (offsetTop is 0 or very small), scroll to top
		// This ensures the "Born" entry can always reach the top
		let finalScrollTop;
		if (targetOffsetTop <= 10) {
			// First entry - scroll to top
			finalScrollTop = 0;
		} else if (desiredScrollTop > maxScrollTop) {
			// Not enough content - scroll to maximum to align card as close to top as possible
			finalScrollTop = maxScrollTop;
		} else {
			// Normal case - scroll to align card top with sidebar top
			finalScrollTop = Math.max(0, desiredScrollTop);
		}
		
		// Scroll the timeline-content container
		timelineContent.scrollTo({
			top: finalScrollTop,
			behavior: behavior
		});
		
		updateNavState(entryId);
	}

	navLinks.forEach(link => {
		link.addEventListener('click', event => {
			event.preventDefault();
			const entryId = link.getAttribute('href').replace('#', '');
			scrollToEntry(entryId);
		});
	});

	const observer = new IntersectionObserver((observerEntries) => {
		const visible = observerEntries
			.filter(entry => entry.isIntersecting)
			.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

		if (!visible.length) return;

		const topEntry = visible[0].target;
		const entryId = topEntry.id;
		if (entryId !== currentEntryId) {
			updateNavState(entryId);
		}
	}, {
		root: null,
		threshold: 0.2,
		rootMargin: '-35% 0px -50% 0px'
	});

	entries.forEach(entry => observer.observe(entry));

	const initialHash = window.location.hash ? window.location.hash.substring(1) : null;
	let initialEntryId = entries[0].id;
	if (initialHash) {
		if (document.getElementById(initialHash)) {
			initialEntryId = initialHash;
		} else {
			const entryFromPeriod = entryIdByPeriod.get(initialHash);
			if (entryFromPeriod) {
				initialEntryId = entryFromPeriod;
			}
		}
	}

	// Use auto behavior for initial positioning to avoid animated jump on load
	setTimeout(() => {
		const behavior = initialHash ? 'auto' : 'auto';
		scrollToEntry(initialEntryId, behavior);
	}, 0);

	window.navigateTimelineTo = (period, behavior = 'smooth') => {
		const entryId = entryIdByPeriod.get(period);
		if (entryId) {
			scrollToEntry(entryId, behavior);
		}
	};

	window.getActiveTimelinePeriod = () => periodByEntryId.get(currentEntryId) || null;
});

