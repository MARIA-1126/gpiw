// Facilities Page JavaScript
// Beginner-friendly vanilla JS

(function() {
    // Admin mode toggle
    const isAdmin = true;

    // Initial posts data
    let posts = [
        {
            id: 1,
            title: "Scholarship Program 2024",
            description: "Apply for merit-based scholarships for outstanding students in all departments.",
            date: "2024-06-15",
            image: "pics/pexels-yankrukov-8199162.jpg"
        },
        {
            id: 2,
            title: "Internship at Tech Corp",
            description: "3-month paid internship opportunity for final year IT and CS students.",
            date: "2024-06-10",
            image: "pics/pexels-max-fischer-5212345.jpg"
        },
        {
            id: 3,
            title: "Sports Week Registration",
            description: "Register now for the annual inter-college sports week starting next month.",
            date: "2024-06-05",
            image: "pics/2022-02-13.webp"
        }
    ];

    // DOM Elements
    const opportunitiesGrid = document.getElementById('opportunities-grid');
    const btnAddOpportunity = document.getElementById('btn-add-opportunity');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalForm = document.getElementById('modal-form');

    // Render posts to the DOM
    function renderPosts() {
        opportunitiesGrid.innerHTML = '';
        posts.forEach(function(post) {
            const card = document.createElement('div');
            card.className = 'post-card';

            const imgHtml = '<div class="post-image"><img src="' + post.image + '" alt="' + post.title + '"></div>';
            const contentHtml = '<div class="post-content">' +
                '<h3>' + post.title + '</h3>' +
                '<p>' + post.description + '</p>' +
                '<span class="post-date">' + formatDate(post.date) + '</span>' +
                '</div>';

            card.innerHTML = imgHtml + contentHtml;
            opportunitiesGrid.appendChild(card);
        });
    }

    // Format date nicely
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    // Show/hide admin button
    function checkAdmin() {
        if (isAdmin) {
            btnAddOpportunity.style.display = 'inline-block';
        }
    }

    // Open modal
    function openModal() {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        modalForm.reset();
    }

    // Handle form submit
    modalForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const titleInput = document.getElementById('post-title');
        const descInput = document.getElementById('post-desc');
        const imageInput = document.getElementById('post-image');

        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const file = imageInput.files[0];

        if (!title || !description || !file) {
            alert('Please fill in all fields and upload an image.');
            return;
        }

        // Use FileReader to create a local preview URL
        const reader = new FileReader();
        reader.onload = function(event) {
            const newPost = {
                id: posts.length + 1,
                title: title,
                description: description,
                date: new Date().toISOString().split('T')[0],
                image: event.target.result
            };

            posts.unshift(newPost); // Add to beginning
            renderPosts();
            closeModal();
        };
        reader.readAsDataURL(file);
    });

    // Event listeners
    btnAddOpportunity.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking outside the card
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Initialize
    checkAdmin();
    renderPosts();
})();
