// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen - Hide it after a short delay
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Trigger initial animations after loading screen is hidden
                initializeAnimations();
            }, 500);
        }, 1500); // Reduced from 2000ms
    } else {
        // If no loading screen, initialize immediately
        initializeAnimations();
    }

    // Initialize animations
    function initializeAnimations() {
        // Trigger scroll reveal for elements already in view
        scrollReveal();
        animateSkills();
    }

    // Navbar Scroll Effect and Arrow Hide
    const navbar = document.getElementById('navbar');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
            // Hide scroll indicator when scrolling
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.visibility = 'hidden';
            }
        } else {
            navbar.classList.remove('scrolled');
            // Show scroll indicator at top
            if (scrollIndicator) {
                scrollIndicator.style.opacity = '1';
                scrollIndicator.style.visibility = 'visible';
            }
        }
        
        lastScroll = currentScroll;
    });

    // Smooth Scroll for Navigation Links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }

            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Project Slider Functionality with Touch Support
    const projectsContainer = document.querySelector('.project-cards');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentIndex = 0;
    let projectCards = [];
    const cardWidth = 316; // 300px + 16px gap
    
    // Touch variables
    let touchStartX = 0;
    let touchEndX = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // Re-query project cards after DOM is loaded
    function initializeProjectSlider() {
        projectCards = document.querySelectorAll('.project-card');
        console.log('Total projects found:', projectCards.length); // Debug log - should show 5
        updateButtonVisibility();
    }

    function updateSlider() {
        if (projectsContainer) {
            const offset = -currentIndex * cardWidth;
            projectsContainer.style.transform = `translateX(${offset}px)`;
            currentTranslate = offset;
            prevTranslate = offset;
            updateButtonVisibility();
        }
    }

    function getVisibleCards() {
        const slider = document.querySelector('.project-slider');
        if (slider) {
            const containerWidth = slider.offsetWidth;
            return Math.floor(containerWidth / cardWidth);
        }
        return 3; // Default
    }

    function updateButtonVisibility() {
        if (!prevBtn || !nextBtn) return;
        
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(0, projectCards.length - visibleCards);
        
        // Show/hide prev button
        if (currentIndex > 0) {
            prevBtn.classList.add('show');
        } else {
            prevBtn.classList.remove('show');
        }
        
        // Show/hide next button
        if (currentIndex < maxIndex && projectCards.length > visibleCards) {
            nextBtn.classList.add('show');
        } else {
            nextBtn.classList.remove('show');
        }
    }

    // Touch event handlers
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
        isDragging = true;
        startPos = e.touches[0].clientX;
        projectsContainer.style.cursor = 'grabbing';
        projectsContainer.style.transition = 'none';
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.touches[0].clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        projectsContainer.style.transform = `translateX(${currentTranslate}px)`;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].clientX;
        isDragging = false;
        projectsContainer.style.cursor = 'grab';
        projectsContainer.style.transition = '';
        
        const movedBy = touchStartX - touchEndX;
        const threshold = 100;

        if (Math.abs(movedBy) > threshold) {
            if (movedBy > 0) {
                // Swiped left - next
                const visibleCards = getVisibleCards();
                const maxIndex = Math.max(0, projectCards.length - visibleCards);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                }
            } else {
                // Swiped right - prev
                if (currentIndex > 0) {
                    currentIndex--;
                }
            }
        }
        updateSlider();
    }

    // Mouse event handlers for desktop
    function handleMouseDown(e) {
        isDragging = true;
        startPos = e.clientX;
        projectsContainer.style.cursor = 'grabbing';
        projectsContainer.style.transition = 'none';
        e.preventDefault();
    }

    function handleMouseMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const currentPosition = e.clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
        projectsContainer.style.transform = `translateX(${currentTranslate}px)`;
    }

    function handleMouseUp(e) {
        if (!isDragging) return;
        isDragging = false;
        projectsContainer.style.cursor = 'grab';
        projectsContainer.style.transition = '';
        
        const movedBy = startPos - e.clientX;
        const threshold = 100;

        if (Math.abs(movedBy) > threshold) {
            if (movedBy > 0) {
                // Dragged left - next
                const visibleCards = getVisibleCards();
                const maxIndex = Math.max(0, projectCards.length - visibleCards);
                if (currentIndex < maxIndex) {
                    currentIndex++;
                }
            } else {
                // Dragged right - prev
                if (currentIndex > 0) {
                    currentIndex--;
                }
            }
        }
        updateSlider();
    }

    if (prevBtn && nextBtn && projectsContainer) {
        // Initialize after a small delay to ensure DOM is ready
        setTimeout(initializeProjectSlider, 100);

        // Add touch support
        projectsContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
        projectsContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
        projectsContainer.addEventListener('touchend', handleTouchEnd);

        // Add mouse support for desktop dragging
        projectsContainer.addEventListener('mousedown', handleMouseDown);
        projectsContainer.addEventListener('mousemove', handleMouseMove);
        projectsContainer.addEventListener('mouseup', handleMouseUp);
        projectsContainer.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                projectsContainer.style.cursor = 'grab';
                projectsContainer.style.transition = '';
                updateSlider();
            }
        });

        // Button click handlers
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            const visibleCards = getVisibleCards();
            const maxIndex = Math.max(0, projectCards.length - visibleCards);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        // Reset on window resize
        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateSlider();
        });
    }

    // Modal Functionality
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');

    // Experience Modal
    const experienceModal = document.getElementById('experienceModal');
    const experienceModalBody = document.getElementById('experienceModalBody');
    const experienceModalClose = document.getElementById('experienceModalClose');

    // Project Data - Updated order and content
    const projectData = {
        'swaptitude': {
            title: 'Swaptitude - iOS Skill Exchange App',
            description: 'A comprehensive skill-exchange iOS application that connects users based on complementary skills and learning preferences.',
            longDescription: `Swaptitude is an innovative iOS application designed to facilitate skill exchange between users. Built as part of my Smartphone-based Web Development course at Northeastern University, it features:
            
            • Real-time messaging with Firestore integration
            • Custom matching algorithm based on skills and preferences
            • Video integration for virtual skill-sharing sessions
            • EventKit calendar synchronization for scheduling
            • Push notifications for engagement
            • Built-in conversational AI assistant
            • MVVM architecture with Combine framework
            • Responsive UI with light/dark theme support`,
            tech: ['SwiftUI', 'Firebase', 'Firestore', 'MVVM', 'Combine', 'EventKit', 'Push Notifications'],
            links: {
                github: 'https://github.com/keerthianil/swaptitude'
            },
            impact: 'Successfully built a feature-rich iOS app demonstrating advanced SwiftUI capabilities and real-time data synchronization'
        },
        'travelplanner': {
            title: 'TravelPlanner - iOS Travel Organization App',
            description: 'A comprehensive travel organization app that helps users plan, organize, and enjoy their trips with modern iOS development practices.',
            longDescription: `TravelPlanner is a feature-rich iOS application designed to simplify travel planning and organization. Built with Swift UIKit and modern iOS development practices, it provides an intuitive interface for managing all aspects of travel planning:
            
            • Trip Creation & Management: Create, edit, and organize multiple trips
            • Itinerary Builder: Create detailed day-by-day schedules
            • Smart Packing Lists: Categorized lists with completion tracking
            • Budget Tracker: Record and categorize travel expenses
            • Smart Reminders: Never miss important travel events
            • Offline Support: Access your plans even without internet
            • Maps Integration: MapKit and CoreLocation for navigation
            • Media Management: AVFoundation for camera and photos`,
            tech: ['Swift', 'UIKit', 'MVVM', 'Core Data', 'MapKit', 'CoreLocation', 'Firebase Auth', 'URLSession'],
            links: {
                github: 'https://github.com/keerthianil/TravelPlanner'
            },
            impact: 'Created an intuitive travel companion app that works seamlessly across all network conditions with smart data management'
        },
        'accident-detection': {
            title: 'AI-Powered Accident Detection System',
            description: 'Real-time accident detection using CNN and automated emergency response.',
            longDescription: `An innovative system developed as my final year project at CMRIT that uses computer vision and deep learning to detect accidents in real-time and automatically alert emergency services. Features:
            
            • Convolutional Neural Network for image analysis
            • Real-time processing of traffic camera feeds
            • Automated emergency service alerts
            • Cloud storage for rapid data access
            • GPS location tracking
            • Severity assessment algorithm
            • Historical data analysis for accident hotspots`,
            tech: ['Python', 'TensorFlow', 'CNN', 'OpenCV', 'Cloud Storage', 'Machine Learning'],
            links: {
                github: 'https://github.com/keerthianil/accident-detection'
            },
            impact: '30% faster emergency response time in test scenarios'
        },
        'food-ordering': {
            title: 'Food Ordering Platform',
            description: 'Fully responsive food ordering system with real-time order tracking.',
            longDescription: `A modern food ordering platform developed during my internship at Varcons Technology, designed to streamline the restaurant ordering process. Features include:
            
            • Responsive design for all devices
            • Real-time order status tracking
            • Integrated payment gateway
            • Restaurant dashboard
            • Customer reviews and ratings
            • Order history and favorites
            • Location-based restaurant search`,
            tech: ['HTML5', 'CSS3', 'JavaScript', 'MySQL', 'PHP'],
            links: {
                github: 'https://github.com/keerthianil/food-ordering'
            },
            impact: '20% reduction in order processing time'
        },
        'portfolio': {
            title: 'Netflix-Style Portfolio Website',
            description: 'This interactive portfolio website inspired by Netflix\'s UI/UX.',
            longDescription: `A unique portfolio website that reimagines the traditional developer portfolio through the lens of Netflix's acclaimed user interface. Features:
            
            • Netflix-inspired card-based layout
            • Smooth animations and transitions
            • Interactive project showcases
            • Responsive design
            • Performance optimized
            • SEO friendly
            • Accessibility compliant`,
            tech: ['HTML5', 'CSS3', 'JavaScript', 'AWS'],
            links: {
                github: 'https://github.com/keerthianil/NetflixPortfolio'
            },
            impact: '90+ Lighthouse score, 2s load time, hosted on AWS'
        }
    };

    // Experience Data - Strictly from resume
    const experienceData = {
        'capgemini': {
            title: 'Cloud Analyst',
            company: 'Capgemini',
            duration: 'Jun 2023 - Aug 2024',
            location: 'Bengaluru, India',
            description: `As a Cloud Analyst at Capgemini, I worked on enterprise-level cloud infrastructure and optimization projects.`,
            responsibilities: [
                'Streamlined client project workflows by implementing Microsoft Azure services (Azure Active Directory, Blob Storage, Kubernetes Service, and Functions), resulting in a 15% increase in operational efficiency',
                'Architected containerized solutions using Docker to standardize development pipelines, reducing deployment errors',
                'Optimized enterprise content management workflows by leveraging OpenText ECM, improving document retrieval efficiency and ensuring regulatory compliance'
            ],
            technologies: ['Microsoft Azure', 'Docker', 'Kubernetes', 'OpenText ECM'],
            achievements: [
                '15% increase in operational efficiency',
                'Reduced deployment errors through containerization',
                'Improved document retrieval efficiency'
            ]
        },
        'varcons': {
            title: 'Web Developer Intern',
            company: 'Varcons Technology Pvt Ltd',
            duration: 'Jan 2023 - Apr 2023',
            location: 'Bengaluru, India',
            description: `During my internship at Varcons Technology, I contributed to developing a comprehensive food ordering platform.`,
            responsibilities: [
                'Designed and developed a fully responsive food-ordering platform using HTML, CSS, and JavaScript, reducing customer order processing time by 20%',
                'Integrated MySQL databases to streamline order management and ensure quick access to customer data, enhancing operational efficiency',
                'Revamped UI/UX through collaborative team efforts, driving an increase in customer engagement and retention'
            ],
            technologies: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
            achievements: [
                '20% reduction in order processing time',
                'Enhanced operational efficiency',
                'Increased customer engagement and retention'
            ]
        },
        'mycaptain': {
            title: 'Business Development Intern',
            company: 'My Captain',
            duration: 'Apr 2020 - May 2020',
            location: 'Bengaluru, India',
            description: `At My Captain, I gained experience in business development and marketing while helping grow online learning programs.`,
            responsibilities: [
                'Facilitated virtual workshops and interactive sessions with 50+ participants, achieving a 20% increase in enrollment rates for online learning programs',
                'Collaborated with cross-functional teams using Agile methodologies to design targeted marketing strategies, driving brand awareness and lead generation',
                'Led a group of colleagues, ensuring seamless communication and timely project completion using MS Office tools (Excel, PowerPoint)'
            ],
            technologies: ['MS Office', 'Agile Methodologies'],
            achievements: [
                '20% increase in enrollment rates',
                'Successfully facilitated workshops with 50+ participants',
                'Led team initiatives for project completion'
            ]
        }
    };

    // Modal Trigger Event Listeners for Projects
    document.querySelectorAll('.modal-trigger').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectId = trigger.dataset.project;
            const project = projectData[projectId];
            
            if (project) {
                displayProjectModal(project);
            }
        });
    });

    // Experience Card Click Event
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const experienceId = item.dataset.experience;
            const experience = experienceData[experienceId];
            
            if (experience) {
                displayExperienceModal(experience);
            }
        });
    });

    function displayProjectModal(project) {
        const modalContent = `
            <div class="modal-project">
                <h2 class="modal-title">${project.title}</h2>
                <p class="modal-description">${project.description}</p>
                
                <div class="modal-section">
                    <h3>Project Overview</h3>
                    <p class="modal-long-description">${project.longDescription.replace(/\n/g, '<br>')}</p>
                </div>
                
                <div class="modal-section">
                    <h3>Technologies Used</h3>
                    <div class="modal-tech">
                        ${project.tech.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Impact & Results</h3>
                    <p class="modal-impact">${project.impact}</p>
                </div>
                
                <div class="modal-links">
                    ${project.links.github ? `<a href="${project.links.github}" target="_blank" class="btn btn-primary"><i class="fab fa-github"></i> View Code</a>` : ''}
                    ${project.links.paper ? `<a href="${project.links.paper}" target="_blank" class="btn btn-secondary"><i class="fas fa-file-pdf"></i> Research Paper</a>` : ''}
                </div>
            </div>
        `;
        
        modalBody.innerHTML = modalContent;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function displayExperienceModal(experience) {
        const modalContent = `
            <div class="modal-experience">
                <h2 class="modal-title">${experience.title}</h2>
                <h3 class="modal-company">${experience.company}</h3>
                <p class="modal-duration">${experience.duration} • ${experience.location}</p>
                
                <div class="modal-section">
                    <h3>Overview</h3>
                    <p class="modal-description">${experience.description}</p>
                </div>
                
                <div class="modal-section">
                    <h3>Key Responsibilities</h3>
                    <ul class="modal-list">
                        ${experience.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3>Technologies Used</h3>
                    <div class="modal-tech">
                        ${experience.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>Key Achievements</h3>
                    <ul class="modal-achievements">
                        ${experience.achievements.map(achievement => `<li><i class="fas fa-trophy"></i> ${achievement}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        experienceModalBody.innerHTML = modalContent;
        experienceModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close Modal
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeProjectModal();
            }
        });
    }

    if (experienceModalClose) {
        experienceModalClose.addEventListener('click', closeExperienceModal);
    }
    if (experienceModal) {
        experienceModal.addEventListener('click', (e) => {
            if (e.target === experienceModal) {
                closeExperienceModal();
            }
        });
    }

    function closeProjectModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function closeExperienceModal() {
        if (experienceModal) {
            experienceModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Escape key to close modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('active')) {
                closeProjectModal();
            }
            if (experienceModal && experienceModal.classList.contains('active')) {
                closeExperienceModal();
            }
        }
    });

    // Scroll Reveal Animation
    const scrollReveal = () => {
        const reveals = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
        
        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', scrollReveal);

    // Parallax Effect
    const parallaxElements = document.querySelectorAll('.parallax-container');
    
    if (parallaxElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Skill Animation
    const animateSkills = () => {
        const skillItems = document.querySelectorAll('.skill-item');
        const skillProgress = document.querySelector('.skill-progress');
        
        skillItems.forEach(item => {
            if (item.getBoundingClientRect().top < window.innerHeight - 100) {
                item.classList.add('animate');
                const level = item.querySelector('.skill-level');
                if (level) {
                    const width = level.dataset.level;
                    setTimeout(() => {
                        level.style.width = `${width}%`;
                    }, 100);
                }
            }
        });

        if (skillProgress && skillProgress.getBoundingClientRect().top < window.innerHeight - 100) {
            const width = skillProgress.dataset.width;
            setTimeout(() => {
                skillProgress.style.width = width;
            }, 100);
        }
    };

    window.addEventListener('scroll', animateSkills);

    // Back to Top Button
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Dynamic Year in Footer
    const currentYear = new Date().getFullYear();
    const footerText = document.querySelector('.footer-content p');
    if (footerText) {
        footerText.innerHTML = `&copy; ${currentYear} Keerthi Anil. Built with passion and code.`;
    }

    // Add hover effect to cards
    document.querySelectorAll('.project-card, .experience-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
});