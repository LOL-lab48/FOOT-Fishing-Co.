// ==========================================
// FOOT — Draft 1
// Review system
// ==========================================

const PRODUCT_ID = "foot-demo-rod-001";
const STORAGE_KEY = "foot_reviews_" + PRODUCT_ID;

// ------------------------------------------
// Starter reviews
// ------------------------------------------

const STARTER_REVIEWS = [
    {
        id: "review-1",
        author: "Sam",
        rating: 5,
        title: "Great rod",
        body: "Really nice rod. It feels strong but is still easy to use.",
        experience: "Intermediate",
        fishingType: "Saltwater",
        date: Date.now() - 86400000 * 3,
        hidden: false,
        reports: 0
    },

    {
        id: "review-2",
        author: "Maya",
        rating: 4,
        title: "Easy to cast",
        body: "I really like how light this rod feels. Casting was easy and smooth.",
        experience: "Beginner",
        fishingType: "Freshwater",
        date: Date.now() - 86400000 * 2,
        hidden: false,
        reports: 0
    },

    {
        id: "review-3",
        author: "Tommy",
        rating: 5,
        title: "My first good rod",
        body: "This was really easy to handle and I caught a fish with it on my first trip.",
        experience: "Beginner",
        fishingType: "Freshwater",
        date: Date.now() - 86400000,
        hidden: false,
        reports: 0
    }
];

// ------------------------------------------
// Load reviews
// ------------------------------------------

function loadReviews() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(STARTER_REVIEWS)
        );

        return STARTER_REVIEWS;
    }

    try {
        return JSON.parse(saved);
    } catch {
        return STARTER_REVIEWS;
    }
}

// ------------------------------------------
// Save reviews
// ------------------------------------------

function saveReviews(reviews) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(reviews)
    );
}

// ------------------------------------------
// Escape HTML
// ------------------------------------------

function escapeHTML(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// ------------------------------------------
// Calculate average rating
// ------------------------------------------

function calculateAverageRating() {

    const reviews = loadReviews()
        .filter(review => !review.hidden);

    if (reviews.length === 0) {
        return 0;
    }

    const total = reviews.reduce(
        (sum, review) => sum + review.rating,
        0
    );

    return total / reviews.length;
}

// ------------------------------------------
// Render reviews
// ------------------------------------------

function renderReviews() {

    const container =
        document.getElementById("reviews-list");

    if (!container) return;

    const reviews = loadReviews()
        .filter(review => !review.hidden)
        .sort((a, b) => b.date - a.date);

    const average =
        calculateAverageRating();

    const averageElement =
        document.getElementById("avg-rating");

    if (averageElement) {

        if (reviews.length === 0) {
            averageElement.textContent = "No ratings";
        } else {
            averageElement.textContent =
                `${average.toFixed(1)} ★`;
        }
    }

    container.innerHTML = "";

    if (reviews.length === 0) {

        container.innerHTML = `
            <div class="card">
                <p>No reviews yet.</p>
                <p>Be the first to review this rod!</p>
            </div>
        `;

        return;
    }

    const heading = document.createElement("div");

    heading.className = "card";

    heading.innerHTML = `
        <h2>Customer Reviews</h2>
        <p class="small">
            ${reviews.length}
            ${reviews.length === 1 ? "review" : "reviews"}
        </p>
    `;

    container.appendChild(heading);

    reviews.forEach(review => {

        const reviewElement =
            document.createElement("div");

        reviewElement.className = "review";

        const stars =
            "★".repeat(review.rating) +
            "☆".repeat(5 - review.rating);

        reviewElement.innerHTML = `
            <button
                class="report"
                data-id="${escapeHTML(review.id)}"
                type="button"
            >
                Report
            </button>

            <div class="meta">
                <strong>${escapeHTML(review.author)}</strong>
                • ${escapeHTML(review.experience)}
                • ${escapeHTML(review.fishingType)}
            </div>

            <div class="title">
                ${stars}
                ${escapeHTML(review.title)}
            </div>

            <p>
                ${escapeHTML(review.body)}
            </p>

            <div class="small">
                ${formatDate(review.date)}
            </div>
        `;

        container.appendChild(reviewElement);
    });

    // Add report listeners

    document
        .querySelectorAll(".report")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    reportReview(
                        button.dataset.id
                    );

                }
            );

        });
}

// ------------------------------------------
// Report review
// ------------------------------------------

function reportReview(reviewID) {

    const shouldReport =
        confirm(
            "Report this review?\n\n" +
            "Draft 1 will immediately hide " +
            "the review."
        );

    if (!shouldReport) {
        return;
    }

    const reviews = loadReviews();

    const review =
        reviews.find(
            item => item.id === reviewID
        );

    if (!review) {
        return;
    }

    // Draft 1 rule:
    // ONE report = immediately hidden

    review.hidden = true;

    review.reports =
        (review.reports || 0) + 1;

    saveReviews(reviews);

    alert(
        "Thanks. The review has been " +
        "removed from public view."
    );

    renderReviews();
}

// ------------------------------------------
// Submit review
// ------------------------------------------

function setupReviewForm() {

    const form =
        document.getElementById("review-form");

    if (!form) return;

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();

            const rating =
                Number(
                    document
                        .getElementById("rating")
                        .value
                );

            const title =
                document
                    .getElementById("title")
                    .value
                    .trim();

            const body =
                document
                    .getElementById("body")
                    .value
                    .trim();

            const experience =
                document
                    .getElementById("experience")
                    .value;

            const fishingType =
                document
                    .getElementById("type")
                    .value;

            // Basic validation

            if (!name || !email || !rating || !body) {

                showMessage(
                    "Please fill in your name, email, rating and review."
                );

                return;
            }

            if (!isValidEmail(email)) {

                showMessage(
                    "Please enter a valid email address."
                );

                return;
            }

            const reviews = loadReviews();

            const newReview = {

                id:
                    "review-" +
                    Date.now(),

                author: name,

                email: email,

                rating: rating,

                title:
                    title || "My review",

                body: body,

                experience: experience,

                fishingType: fishingType,

                date: Date.now(),

                hidden: false,

                reports: 0
            };

            reviews.push(newReview);

            saveReviews(reviews);

            showMessage(
                "Your review is now live!"
            );

            // Clear form

            document
                .getElementById("rating")
                .value = "";

            document
                .getElementById("title")
                .value = "";

            document
                .getElementById("body")
                .value = "";

            renderReviews();
        }
    );
}

// ------------------------------------------
// Reset starter reviews
// ------------------------------------------

function setupResetButton() {

    const button =
        document.getElementById("clear-sample");

    if (!button) return;

    button.addEventListener(
        "click",
        () => {

            const confirmReset =
                confirm(
                    "Reset the demo reviews?"
                );

            if (!confirmReset) {
                return;
            }

            localStorage.removeItem(
                STORAGE_KEY
            );

            renderReviews();

            showMessage(
                "Starter reviews restored."
            );
        }
    );
}

// ------------------------------------------
// Email validation
// ------------------------------------------

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}

// ------------------------------------------
// Message
// ------------------------------------------

function showMessage(message) {

    const element =
        document.getElementById("form-msg");

    if (!element) return;

    element.textContent = message;

    setTimeout(
        () => {
            element.textContent = "";
        },
        4000
    );
}

// ------------------------------------------
// Date formatting
// ------------------------------------------

function formatDate(timestamp) {

    return new Date(timestamp)
        .toLocaleDateString(
            "en-AU",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}

// ------------------------------------------
// Start FOOT
// ------------------------------------------

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderReviews();

        setupReviewForm();

        setupResetButton();

    }
);
