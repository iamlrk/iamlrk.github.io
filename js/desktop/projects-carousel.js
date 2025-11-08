// Projects Carousel Functionality - Infinite Scroll
document.addEventListener('DOMContentLoaded', function() {
	const track = document.getElementById('projects-track');
	const prevBtn = document.getElementById('projects-prev');
	const nextBtn = document.getElementById('projects-next');
	const dotsContainer = document.getElementById('projects-dots');
	
	if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
	
	// Store original cards and create infinite scroll setup
	const originalCards = Array.from(track.children);
	const totalCards = originalCards.length;
	let cardWidth = 300; // Will be calculated dynamically
	let gap = 20;
	let currentIndex = 0;
	let actualIndex = 0; // For tracking real position in original array
	let isTransitioning = false;
	let autoPlayInterval = null;
	
	// Set card widths dynamically
	function setCardWidths() {
		const cards = track.querySelectorAll('.project-card');
		cards.forEach(card => {
			card.style.width = `${cardWidth}px`;
		});
	}
	
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
			const clonedCard = card.cloneNode(true);
			track.appendChild(clonedCard);
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
		
		// Determine card width based on viewport
		const isMobile = window.innerWidth <= 480;
		gap = isMobile ? 10 : 20;
		
		// On mobile, show 1 card; on desktop, always show 3 cards
		let visibleCards;
		if (isMobile) {
			visibleCards = 1;
			cardWidth = availableWidth;
		} else {
			// Desktop: Always show exactly 3 cards
			visibleCards = 3;
			// Calculate card width to fit exactly 3 cards: (availableWidth - 2*gap) / 3
			cardWidth = (availableWidth - (visibleCards - 1) * gap) / visibleCards;
		}
		
		// Calculate the exact width needed for whole cards only
		const exactWidth = (visibleCards * cardWidth) + ((visibleCards - 1) * gap);
		
		// Set the carousel to show only whole cards - constrain to exact width
		carouselContainer.style.width = `${exactWidth}px`;
		carouselContainer.style.maxWidth = `${exactWidth}px`;
		
		// Set card widths to calculated width
		setCardWidths();
		
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
			// Card widths are set in calculateDimensions via setCardWidths()
		}, 250);
	});
	
	// Initialize infinite scroll
	setupInfiniteScroll();
	
	// Small delay to ensure cards are rendered and styles are computed
	setTimeout(() => {
		createDots();
		updateCarousel(false);
		// Set card widths after initial setup
		setCardWidths();
		// Start auto-play
		startAutoPlay();
	}, 50);
});

