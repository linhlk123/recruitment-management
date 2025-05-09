// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// DOM Elements
const createJobButton = document.querySelector('.btn-primary');
const modal = document.getElementById('createJobModal');
const closeButton = document.querySelector('.close-modal');
const form = document.getElementById('createJobForm');
const candidatesSection = document.getElementById('candidates');
const candidateProfileModal = document.getElementById('candidateProfileModal');
const positionFilter = document.getElementById('positionFilter');
const statusFilter = document.getElementById('statusFilter');
const viewControls = document.querySelectorAll('.view-controls button');
const ratingInputs = document.querySelectorAll('.rating input[type="radio"]');
const logoUpload = document.querySelector('.logo-upload button');
const notificationFilters = document.querySelectorAll('.notification-filters button');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadJobPosts();
    generateCalendar();
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // System theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });

    // Job post modal
    createJobButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Navigation
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });

    // Candidate filters
    if (positionFilter && statusFilter) {
        positionFilter.addEventListener('change', filterCandidates);
        statusFilter.addEventListener('change', filterCandidates);
    }

    // Interview view toggle
    viewControls.forEach(button => {
        button.addEventListener('click', () => {
            const view = button.dataset.view;
            viewControls.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const calendarView = document.querySelector('.calendar-view');
            const listView = document.querySelector('.interview-list');
            
            if (view === 'calendar') {
                calendarView.classList.remove('hidden');
                listView.classList.add('hidden');
            } else {
                calendarView.classList.add('hidden');
                listView.classList.remove('hidden');
            }
        });
    });

    // Evaluation form
    ratingInputs.forEach(input => {
        input.addEventListener('change', () => {
            const group = input.closest('.criteria-group');
            group.querySelectorAll('span').forEach(span => {
                span.style.backgroundColor = '';
                span.style.color = '';
            });
            
            const selectedSpan = input.nextElementSibling;
            selectedSpan.style.backgroundColor = 'var(--primary-color)';
            selectedSpan.style.color = 'white';
        });
    });

    // Logo upload
    if (logoUpload) {
        logoUpload.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        document.querySelector('.logo-upload img').src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }

    // Notification filters
    notificationFilters.forEach(button => {
        button.addEventListener('click', () => {
            notificationFilters.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterNotifications(button.textContent.trim());
        });
    });

    // Set default dates for job post form
    const today = new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    document.getElementById('createdAt').value = formatDate(today);
    document.getElementById('endDate').value = formatDate(thirtyDaysFromNow);
});

// Functions
function openModal() {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    form.reset();
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateForDisplay(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function handleSubmit(e) {
    e.preventDefault();

    const formData = {
        jobTitle: document.getElementById('jobTitle').value,
        company_id: document.getElementById('company_id').value, // Có thể lấy từ giá trị form hoặc session
        jobDescription: document.getElementById('jobDescription').value,
        jobQuantity: document.getElementById('jobQuantity').value,
        jobLevel: document.getElementById('jobLevel').value,
        jobSalary: document.getElementById('jobSalary').value,
        jobLocation: document.getElementById('jobLocation').value,
        createdAt: document.getElementById('createdAt').value,
        endDate: document.getElementById('endDate').value,
        jobRequirements: document.getElementById('jobRequirements').value,
        jobBenefits: document.getElementById('jobBenefits').value,
      };

    try {
        const response = await fetch('/recruiter/create-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showNotification('Đã tạo tin tuyển dụng thành công!', 'success');
            closeModal();
            loadJobPosts();
        } else {
            showNotification('Có lỗi xảy ra khi tạo tin tuyển dụng', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Có lỗi xảy ra khi tạo tin tuyển dụng', 'error');
    }
}

async function loadJobPosts() {
    try {
        const response = await fetch('/recruiter');
        const jobPosts = await response.json();
        
        const tbody = document.querySelector('.data-table tbody');
        tbody.innerHTML = '';

        jobPosts.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.jobTitle}</td>
                <td>${formatDateForDisplay(post.startDate)}</td>
                <td>${formatDateForDisplay(post.endDate)}</td>
                <td>${post.jobQuantity}</td>
                <td><span class="status active">Đang tuyển</span></td>
                <td class="actions">
                    <button class="btn-icon" onclick="editJobPost(${post.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="viewJobPost(${post.id})"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" onclick="deleteJobPost(${post.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading job posts:', error);
        showNotification('Có lỗi xảy ra khi tải danh sách tin tuyển dụng', 'error');
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
    });
    document.querySelector(`a[href="#${sectionId}"]`).parentElement.classList.add('active');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function filterNotifications(filter) {
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach(notification => {
        if (filter === 'Tất cả') {
            notification.style.display = 'flex';
        } else if (filter === 'Chưa đọc' && notification.classList.contains('unread')) {
            notification.style.display = 'flex';
        } else if (filter === 'Ứng viên mới' && notification.querySelector('h4').textContent.includes('Ứng viên mới')) {
            notification.style.display = 'flex';
        } else if (filter === 'Phỏng vấn' && notification.querySelector('h4').textContent.includes('phỏng vấn')) {
            notification.style.display = 'flex';
        } else {
            notification.style.display = 'none';
        }
    });
}

function generateCalendar() {
    const calendar = document.querySelector('.calendar-grid');
    if (!calendar) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    calendar.innerHTML = '';
    
    for (let i = 0; i < firstDay; i++) {
        calendar.appendChild(createCalendarDay(''));
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = createCalendarDay(day);
        calendar.appendChild(dayElement);
    }
}

function createCalendarDay(day) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    div.textContent = day;
    return div;
}

// Form validation
const inputs = form.querySelectorAll('input[required], textarea[required]');
inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
        showError(input);
    });

    input.addEventListener('input', () => {
        clearError(input);
    });
});

function showError(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup.querySelector('.error-message')) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = 'Vui lòng điền thông tin này';
        formGroup.appendChild(error);
    }
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove();
    }
}
async function loadJobPosts() {
    try {
        const response = await fetch('/recruiter/job-posts');
        if (response.ok) {
            const jobPosts = await response.json();
            displayJobPosts(jobPosts);  // Hàm để hiển thị dữ liệu lên giao diện
        } else {
            showNotification('Không thể tải tin tuyển dụng', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Có lỗi xảy ra khi tải tin tuyển dụng', 'error');
    }
}

function displayJobPosts(jobPosts) {
    const tableBody = document.getElementById('jobPostsTableBody');
    tableBody.innerHTML = '';  // Xóa dữ liệu cũ trong bảng

    jobPosts.forEach(post => {
        const row = document.createElement('tr');
        
        const titleCell = document.createElement('td');
        titleCell.textContent = post.jobTitle;
        
        const createdAtCell = document.createElement('td');
        createdAtCell.textContent = post.createdAt;
        
        const endDateCell = document.createElement('td');
        endDateCell.textContent = post.endDate;
        
        const quantityCell = document.createElement('td');
        quantityCell.textContent = post.jobQuantity;
        
        const statusCell = document.createElement('td');
        statusCell.textContent = post.status;

        row.appendChild(titleCell);
        row.appendChild(createdAtCell);
        row.appendChild(endDateCell);
        row.appendChild(quantityCell);
        row.appendChild(statusCell);

        tableBody.appendChild(row);
    });
}

// Gọi hàm khi trang tải xong
window.onload = loadJobPosts;