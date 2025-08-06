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

    // Project Data - Updated to match resume
    const projectData = {
        'swaptitude': {
            title: 'Swaptitude - iOS Skill Exchange Platform',
            description: 'A comprehensive skill-exchange iOS application that connects users based on complementary skills and learning preferences.',
            longDescription: `Swaptitude is an innovative iOS application designed to facilitate skill exchange between users. Built as part of my Smartphone-based Web Development course at Northeastern University, it features:
            
            • Developed native iOS application using SwiftUI and MVVM architecture, implementing user authentication with Firebase Auth supporting email and password sign-in
            • Built real-time messaging feature with Firestore database, enabling instant chat functionality with offline support and push notifications
            • Engineered skill-matching algorithm to connect users based on complementary expertise, utilizing Firebase Cloud Functions for backend logic`,
            tech: ['SwiftUI', 'Firebase', 'Combine', 'Core Data'],
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
            longDescription: `An innovative system developed as my final year project at CMRIT that uses computer vision and deep learning to detect accidents in real-time and automatically alert emergency services:
            
            • Trained CNN model using TensorFlow on dataset of 5,000+ traffic images, achieving 91% accuracy in detecting vehicle accidents from surveillance footage
            • Implemented real-time video processing pipeline with OpenCV, capable of analyzing 15 frames per second and detecting accidents within seconds of occurrence
            • Integrated AWS S3 for cloud storage with intelligent lifecycle policies, reducing storage costs while maintaining sub-second retrieval times for critical incidents`,
            tech: ['Python', 'TensorFlow', 'OpenCV', 'AWS S3'],
            links: {
                github: 'https://github.com/keerthianil/accident-detection'
            },
            impact: '91% accuracy in accident detection with sub-second response time'
        },
        'face-mouse': {
            title: 'Face Embedded Mouse Interface',
            description: 'Hands-free computer control system for physically handicapped users.',
            longDescription: `Selected for Smart India Hackathon 2021, this project provides a hands-free computer interface for users with physical disabilities. Features include:
            
            • Developed hands-free computer control system using Python and facial recognition
            • Designed for users with amelia and amputation conditions
            • Implemented facial gesture detection algorithms
            • Enabled cursor control through nose movements and eye blinks
            • Integrated voice assistant functionality for enhanced accessibility
            • Collaborated with team of 5 to document technical specifications
            • Tested software with target user requirements`,
            tech: ['Python', 'OpenCV', 'Facial Recognition', 'Computer Vision', 'AI'],
            links: {
                github: 'https://github.com/keerthianil/face-mouse'
            },
            impact: 'Selected for Smart India Hackathon 2021, enabling computer access for physically handicapped users'
        },
        'food-ordering': {
            title: 'Food Ordering Platform',
            description: 'Fully responsive food ordering system with optimized performance.',
            longDescription: `A modern food ordering platform developed during my internship at Varcons Technology. Built with:
            
            • Responsive design using HTML5/CSS3 with mobile-first approach
            • Implemented CSS Grid and Flexbox layouts for 100+ test users
            • Developed MySQL database schema with normalized tables
            • Improved data integrity and query performance by 40%
            • Collaborated with backend developers on RESTful API architecture
            • Contributed to frontend optimization reducing page load times by 30%
            • Enhanced UI/UX driving increased customer engagement`,
            tech: ['HTML5', 'CSS3', 'JavaScript', 'MySQL', 'RESTful APIs'],
            links: {
                github: 'https://github.com/keerthianil/food-ordering'
            },
            impact: '30% reduction in page load times and 40% improvement in query performance'
        },
        'portfolio': {
            title: 'Netflix-Style Portfolio Website',
            description: 'This interactive portfolio website inspired by Netflix\'s UI/UX.',
            longDescription: `A unique portfolio website that reimagines the traditional developer portfolio through the lens of Netflix's acclaimed user interface. Features:
            
            • Netflix-inspired card-based layout with smooth animations
            • Fully responsive design for all devices
            • Interactive project showcases with modal popups
            • Performance optimized with lazy loading
            • SEO friendly with proper meta tags
            • Accessibility compliant following WCAG guidelines
            • Clean code architecture with modular CSS and JavaScript`,
            tech: ['HTML5', 'CSS3', 'JavaScript', 'AWS'],
            links: {
                github: 'https://github.com/keerthianil/portfolio'
            },
            impact: '90+ Lighthouse score, 2s load time, hosted on AWS'
        }
    };

    // Experience Data - Updated to match resume exactly
    const experienceData = {
        'capgemini': {
            title: 'Cloud Analyst',
            company: 'Capgemini',
            duration: 'Jun 2023 - Aug 2024',
            location: 'Bengaluru, India',
            description: `As a Cloud Analyst at Capgemini, I worked on enterprise-level cloud infrastructure migration and optimization projects.`,
            responsibilities: [
                'Supported migration of 10+ enterprise applications to AWS cloud, implementing EC2 instances with auto-scaling groups and S3 lifecycle policies, contributing to 30% reduction in monthly infrastructure costs',
                'Created 15+ reusable Terraform modules for AWS resources including VPCs, security groups, and RDS instances, reducing deployment time from 4 hours to 30 minutes',
                'Configured CloudWatch dashboards with custom metrics and alarms for 5+ production applications, enabling proactive monitoring and minimizing downtime incidents',
                'Containerized applications using Docker best practices and deployed on Amazon ECS, implementing blue-green deployments for zero-downtime releases'
            ],
            technologies: ['AWS', 'EC2', 'S3', 'RDS', 'Lambda', 'CloudWatch', 'IAM', 'ECS', 'Docker', 'Terraform', 'GitLab CI/CD'],
            achievements: [
                '30% reduction in monthly infrastructure costs',
                'Reduced deployment time from 4 hours to 30 minutes',
                'Zero-downtime releases with blue-green deployments'
            ]
        },
        'varcons': {
            title: 'Web Developer Intern',
            company: 'Varcons Technology Pvt Ltd',
            duration: 'Jan 2023 - Apr 2023',
            location: 'Bengaluru, India',
            description: `During my internship at Varcons Technology, I contributed to developing a comprehensive food ordering platform.`,
            responsibilities: [
                'Built responsive food-ordering website prototype using HTML5/CSS3 with mobile-first design, implementing CSS Grid and Flexbox layouts for 100+ test users',
                'Developed MySQL database schema with normalized tables for orders, customers, and restaurants, improving data integrity and query performance by 40%',
                'Collaborated with backend developers to understand RESTful API architecture and data flow, contributing to frontend optimization that reduced page load times by 30%'
            ],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'MySQL', 'RESTful APIs'],
            achievements: [
                '30% reduction in page load times',
                '40% improvement in query performance',
                'Successfully tested with 100+ users'
            ]
        },
        'research-assistant': {
            title: 'Research Assistant - Accessibility Technology',
            company: 'CMR Institute of Technology',
            duration: 'Aug 2021 - Dec 2021',
            location: 'Bengaluru, India',
            description: `Contributed to innovative accessibility technology research focusing on hands-free computer control for physically handicapped users.`,
            responsibilities: [
                'Contributed to Face Embedded Mouse interface project selected for Smart India Hackathon 2021, developing hands-free computer control system for physically handicapped users using Python and facial recognition',
                'Assisted in implementing facial gesture detection algorithms and voice assistant integration, enabling cursor control through nose movements and eye blinks for users with amelia and amputation',
                'Collaborated with team of 5 to document technical specifications and test software with target user requirements'
            ],
            technologies: ['Python', 'OpenCV', 'Facial Recognition', 'Computer Vision', 'AI'],
            achievements: [
                'Project selected for Smart India Hackathon 2021',
                'Enabled computer access for physically handicapped users'
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