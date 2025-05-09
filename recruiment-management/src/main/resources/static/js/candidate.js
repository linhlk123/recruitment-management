document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('jobModal');
    const closeBtn = document.querySelector('.close-btn');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('h3').textContent;
            const jobCompany = jobCard.querySelector('p').textContent;
            const jobDescription = jobCard.querySelector('.job-details').textContent;

            document.querySelector('.modal-title h2').textContent = jobTitle;
            document.querySelector('.modal-title p').textContent = jobCompany;
            document.querySelector('.modal-body').textContent = jobDescription;

            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });

    // Slider functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlider();
        }
    });

    // Pagination functionality
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            paginationLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Add logic to load the corresponding page content
        });
    });
}); 

const sampleJobs = [
    {
        title: 'Software Engineer',
        company: 'Tech Corp',
        description: 'We are looking for a software engineer to join our team.',
        logo: 'https://via.placeholder.com/60',
        details: ['Full-time', 'Remote', '5+ years']
    },
    {
        title: 'Data Scientist',
        company: 'Data Inc',
        description: 'Join us as a data scientist to work on exciting projects.',
        logo: 'https://via.placeholder.com/60',
        details: ['Full-time', 'On-site', '3+ years']
    },
    {
        title: 'Product Manager',
        company: 'Product Co',
        description: 'We need a product manager to lead our product development.',
        logo: 'https://via.placeholder.com/60',
        details: ['Full-time', 'Hybrid', '4+ years']
    }
];

function populateJobCards() {
    const jobList = document.querySelector('.job-list');
    jobList.innerHTML = '';

    sampleJobs.forEach(job => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.innerHTML = `
            <div class="job-header">
                <img src="${job.logo}" alt="${job.company}" class="job-logo">
                <div>
                    <h3>${job.title}</h3>
                    <p>${job.company}</p>
                </div>
            </div>
            <div class="job-details">
                ${job.details.map(detail => `<span>${detail}</span>`).join('')}
            </div>
            <div class="job-actions">
                <button class="apply-btn">Apply</button>
                <button class="quick-view-btn">Quick View</button>
            </div>
        `;
        jobList.appendChild(jobCard);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    populateJobCards();

    // Modal functionality
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const modal = document.getElementById('jobModal');
    const closeBtn = document.querySelector('.close-btn');

    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const jobCard = this.closest('.job-card');
            const jobTitle = jobCard.querySelector('h3').textContent;
            const jobCompany = jobCard.querySelector('p').textContent;
            const jobDescription = jobCard.querySelector('.job-details').textContent;

            document.querySelector('.modal-title h2').textContent = jobTitle;
            document.querySelector('.modal-title p').textContent = jobCompany;
            document.querySelector('.modal-body').textContent = jobDescription;

            modal.style.display = 'flex';
            document.body.classList.add('modal-open');
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    });

    // Slider functionality
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function updateSlider() {
        slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlider();
        }
    });

    // Pagination functionality
    const paginationLinks = document.querySelectorAll('.pagination a');
    paginationLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            paginationLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Add logic to load the corresponding page content
        });
    });
});