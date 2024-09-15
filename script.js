const searchInput = document.getElementById('search-input');
const skeletonLoader = document.getElementById('skeleton-loader');
const resultImage = document.getElementById('result-image');
const searchBox = document.querySelector('.search-box');
const customCursor = document.getElementById('custom-cursor');
const animationContainer = document.querySelector('.animation-container');

const searchQueries = [
    { query: 'a spacex raptor engine', image: 'images/raptor-engine.jpeg' },
    { query: 'blue origins new glenn', image: 'images/new-glenn.jpeg' },
    { query: 'astranis satellite bus', image: 'images/astranis.jpeg' }
];

let currentSearch = 0;

function animateCursorToSearchBox(callback) {
    // Show the custom cursor
    customCursor.style.display = 'block';

    // Get positions
    const containerRect = animationContainer.getBoundingClientRect();
    const searchBoxRect = searchBox.getBoundingClientRect();

    // Calculate start and end positions relative to the container
    const startX = -20; // Start just outside the left edge
    const startY = containerRect.height / 2;

    const endX = searchBoxRect.left + searchBoxRect.width / 2 - containerRect.left;
    const endY = searchBoxRect.top + searchBoxRect.height / 2 - containerRect.top;

    // Set initial cursor position
    customCursor.style.left = `${startX}px`;
    customCursor.style.top = `${startY}px`;

    // Force a reflow to ensure the initial position is set before the transition
    customCursor.offsetHeight; // Trigger reflow

    // Animate cursor movement
    customCursor.style.transition = 'left 1s linear, top 1s linear';
    customCursor.style.left = `${endX}px`;
    customCursor.style.top = `${endY}px`;

    // After animation ends
    setTimeout(() => {
        // Expand the search box
        searchBox.style.width = '100%';
        searchBox.style.maxWidth = '260px';

        // Start the search animation after the search box has expanded
        setTimeout(() => {
            customCursor.style.display = 'none'; // Hide the custom cursor
            callback();
        }, 500); // Wait for the search box expansion animation
    }, 1000); // Duration of the cursor movement
}

function typeSearchQuery(query, callback) {
    let index = 0;
    searchInput.value = '';
    const typingInterval = setInterval(() => {
        searchInput.value += query.charAt(index);
        index++;
        if (index === query.length) {
            clearInterval(typingInterval);
            callback();
        }
    }, 150);
}

function showSkeletonLoader() {
    skeletonLoader.style.display = 'block';
    resultImage.style.display = 'none';
}

function showResultImage(imageSrc) {
    setTimeout(() => {
        skeletonLoader.style.display = 'none';
        resultImage.src = imageSrc;
        resultImage.style.display = 'block';

        if (currentSearch === 1) {
            // After the first search, remove the 'first-search' class
            searchBox.classList.remove('first-search');
        }
    }, 2000);
}

function startAnimation() {
    if (currentSearch < searchQueries.length) {
        const { query, image } = searchQueries[currentSearch];

        if (currentSearch === 0) {
            // First search: animate cursor to search box
            animateCursorToSearchBox(() => {
                typeSearchQuery(query, () => {
                    showSkeletonLoader();
                    showResultImage(image);
                    currentSearch++;
                    setTimeout(startAnimation, 4000);
                });
            });
        } else {
            // Subsequent searches: no cursor animation
            typeSearchQuery(query, () => {
                showSkeletonLoader();
                showResultImage(image);
                currentSearch++;
                setTimeout(startAnimation, 4000);
            });
        }
    } else {
        // Reset animation
        setTimeout(() => {
            currentSearch = 0;
            searchBox.classList.add('first-search');
            customCursor.style.display = 'none';
            startAnimation();
        }, 4000);
    }
}

// Start the animation
startAnimation();