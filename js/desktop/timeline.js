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
		target.scrollIntoView({ behavior, block: 'start' });
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

