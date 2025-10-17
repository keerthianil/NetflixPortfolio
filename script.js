// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Trigger initial animations after loading screen is hidden
                initializeAnimations();
            }, 500);
        }, 1500);
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
        console.log('Total projects found:', projectCards.length);
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

    // Project Data 
    const projectData = {
        'cloud-native': {
            title: 'Cloud-Native Web Application',
            description: 'Enterprise-grade RESTful API with comprehensive testing and CI/CD pipeline.',
            longDescription: `A production-ready cloud-native web application built with modern DevOps practices and scalable architecture:
            
            • Developed stateless RESTful API with Node.js/Express implementing user and product management with Basic Authentication, BCrypt password hashing, and comprehensive CRUD operations following OpenAPI specifications
            • Engineered 74 integration tests using Jest/Supertest achieving 78% code coverage, validating authentication flows, data integrity, edge cases, and concurrent operations with less than 3 second response times
            • Built CI/CD pipeline using GitHub Actions with PostgreSQL service containers, automating test execution on pull requests and enforcing branch protection rules ensuring code quality before merge
            • Designed cloud-native architecture with stateless design, environment-based configuration, health check endpoints for orchestration, and database abstraction with Sequelize ORM`,
            tech: ['Node.js', 'Express.js', 'PostgreSQL', 'Jest', 'Supertest', 'GitHub Actions', 'Sequelize ORM', 'BCrypt', 'OpenAPI'],
            links: {
                github: 'https://github.com/keerthianil/webapp'
            },
            impact: '78% test coverage, sub-3 second response times, fully automated CI/CD pipeline'
        },
        'swaptitude': {
            title: 'Swaptitude - iOS Skill Exchange Platform',
            description: 'A comprehensive skill-exchange iOS application with real-time messaging.',
            longDescription: `Innovative iOS application designed to connect users based on complementary skills and facilitate knowledge exchange:
            
            • Developed native iOS application using SwiftUI and MVVM architecture, implementing user authentication with Firebase Auth supporting email and password sign-in
            • Built real-time messaging feature with Firestore database, enabling instant chat functionality with offline support and push notifications
            • Engineered skill-matching algorithm to connect users based on complementary expertise, utilizing Firebase Cloud Functions for backend logic
            • Designed user profile system with skill portfolios, ratings, and review functionality, implementing data validation and content moderation for maintaining platform quality`,
            tech: ['SwiftUI', 'Firebase', 'Firestore', 'MVVM', 'Push Notifications', 'Cloud Functions', 'iOS'],
            links: {
                github: 'https://github.com/keerthianil/Swaptitude'
            },
            impact: 'Real-time messaging with offline support, intelligent skill-matching algorithm'
        },
        'travelplanner': {
            title: 'TravelPlanner - iOS Travel Organization App',
            description: 'Comprehensive travel planning iOS app with Core Data persistence.',
            longDescription: `Feature-rich iOS application designed to simplify travel planning and organization:
            
            • Built a responsive travel planning iOS application using SwiftUI that enables users to discover destinations, create custom itineraries, and manage trip budgets with an intuitive mobile-first interface
            • Implemented Core Data for persistent storage of trips and itineraries, and developed a smart budget tracking system with expense categorization and real-time calculations
            • Designed features including destination search with filtering, day-by-day itinerary planning with activity management, photo integration for trip memories, and comprehensive trip statistics dashboard
            • Integrated MapKit for location services and navigation, ensuring seamless travel experience even offline`,
            tech: ['SwiftUI', 'Core Data', 'MapKit', 'CoreLocation', 'iOS', 'MVVM', 'Swift'],
            links: {
                github: 'https://github.com/keerthianil/TravelPlanner'
            },
            impact: 'Offline-first design with Core Data, comprehensive budget tracking system'
        },
        'accident-detection': {
            title: 'AI-Powered Accident Detection System',
            description: 'Real-time accident detection using CNN with automated emergency response.',
            longDescription: `Final year project implementing computer vision and deep learning for real-time accident detection:
            
            • Trained CNN model using TensorFlow on dataset of 5,000+ traffic images, achieving 91% accuracy in detecting vehicle accidents from surveillance footage
            • Implemented real-time video processing pipeline with OpenCV, capable of analyzing 15 frames per second and detecting accidents within seconds of occurrence
            • Integrated AWS S3 for cloud storage with intelligent lifecycle policies, reducing storage costs while maintaining sub-second retrieval times for critical incidents
            • Designed automated alert system for emergency services with location tracking and incident severity assessment`,
            tech: ['Python', 'TensorFlow', 'OpenCV', 'CNN', 'AWS S3', 'Computer Vision', 'Deep Learning'],
            impact: '91% accuracy in accident detection with sub-second response time for emergency alerts'
        },
        'food-ordering': {
            title: 'Food Ordering Platform',
            description: 'Fully responsive food ordering system with optimized database performance.',
            longDescription: `Modern food ordering platform developed during internship at Varcons Technology:
            
            • Built responsive food-ordering website prototype using HTML5/CSS3 with mobile-first design, implementing CSS Grid and Flexbox layouts for 100+ test users
            • Developed MySQL database schema with normalized tables for orders, customers, and restaurants, improving data integrity and query performance by 35%
            • Collaborated with backend developers to understand RESTful API architecture and data flow, contributing to frontend optimization that reduced page load times by 30%
            • Implemented real-time order tracking features and interactive UI components using vanilla JavaScript`,
            tech: ['HTML5', 'CSS3', 'JavaScript', 'MySQL', 'RESTful APIs', 'Flexbox', 'CSS Grid'],
            links: {
                github: 'https://github.com/keerthianil/CafeOrderingSystem'
            },
            impact: '30% reduction in page load times, 35% improvement in query performance'
        },
        'portfolio': {
            title: 'Netflix-Style Portfolio Website',
            description: 'This interactive portfolio website inspired by Netflix\'s UI/UX.',
            longDescription: `A unique portfolio website that reimagines the traditional developer portfolio through Netflix's interface:
            
            • Netflix-inspired card-based layout with smooth animations and transitions
            • Fully responsive design optimized for all devices from mobile to 4K displays
            • Interactive project showcases with detailed modal popups
            • Performance optimized with lazy loading and efficient asset management
            • SEO friendly with proper meta tags and semantic HTML
            • Accessibility compliant following WCAG guidelines
            • Clean code architecture with modular CSS and vanilla JavaScript`,
            tech: ['HTML5', 'CSS3', 'JavaScript', 'GitHub Pages', 'Responsive Design'],
            links: {
                github: 'https://github.com/keerthianil/NetflixPortfolio'
            },
            impact: '90+ Lighthouse score, 2s load time, fully responsive across all devices'
        }
    };

    // Updated Experience Data
    const experienceData = {
        'ra': {
            title: 'Research Assistant - iOS Developer',
            company: 'Northeastern University',
            duration: 'Sep 2025 - Present',
            location: 'Portland, Maine (Remote)',
            description: `Assisting iOS/visionOS development for cutting-edge accessibility research projects focused on improving mobile experiences for blind and low-vision users.`,
            responsibilities: [
                'Design accessibility-focused iOS/visionOS applications for blind and low-vision users, implementing multimodal feedback systems',
                'Implement advanced haptics, audio feedback, and VoiceOver integration using AVFoundation and Core Haptics APIs',
                'Collaborate with interdisciplinary research teams to enhance inclusive mobile interaction patterns',
                'Conduct user testing sessions with visually impaired participants to gather feedback and iterate on designs',
                'Develop prototypes for innovative gesture-based and voice-controlled interfaces'
            ],
            technologies: ['iOS', 'visionOS', 'Swift', 'SwiftUI', 'AVFoundation', 'Core Haptics', 'VoiceOver', 'Accessibility APIs']
        },
        'ta': {
            title: 'Teaching Assistant',
            company: 'Northeastern University',
            duration: 'Sep 2025 - Present',
            location: 'Boston, MA',
            description: `As a Teaching Assistant for iOS Development courses, I guide students through the intricacies of mobile app development using Swift and SwiftUI.`,
            responsibilities: [
                'Lead lab sessions and office hours for iOS development graduate students, helping them master Swift and SwiftUI fundamentals',
                'Mentor student teams through complex iOS projects, providing code reviews and debugging assistance',
                'Evaluate assignments with detailed, actionable feedback to improve understanding',
                'Guide debugging sessions covering iOS frameworks including Core Data, Combine, and testing with XCTest',
                'Create supplementary learning materials and code examples for challenging concepts'
            ],
            technologies: ['Swift', 'SwiftUI', 'Core Data', 'Combine', 'XCTest', 'iOS', 'Xcode']
        },
        'capgemini': {
            title: 'Cloud Analyst',
            company: 'Capgemini',
            duration: 'Jun 2023 - Aug 2024',
            location: 'Bengaluru, India',
            description: `As a Cloud Analyst at Capgemini, I played a crucial role in enterprise cloud transformation initiatives, focusing on AWS infrastructure optimization and automation.`,
            responsibilities: [
                'Supported migration of 10+ enterprise applications to AWS cloud, implementing EC2 instances with auto-scaling groups and S3 lifecycle policies to optimize infrastructure costs by 30%',
                'Created reusable Terraform modules for AWS resources including VPCs, security groups, and RDS instances, reducing deployment time from hours to minutes',
                'Configured CloudWatch dashboards with custom metrics and alarms for production applications, enabling proactive monitoring and minimizing downtime incidents',
                'Containerized applications using Docker and deployed on Amazon ECS, implementing blue-green deployments for zero-downtime releases',
                'Collaborated with development teams to design RESTful APIs and microservices architecture for business-critical applications'
            ],
            technologies: ['AWS', 'EC2', 'S3', 'RDS', 'Lambda', 'CloudWatch', 'IAM', 'ECS', 'Docker', 'Terraform', 'GitLab CI/CD']
        },
        'varcons': {
            title: 'Web Developer Intern',
            company: 'Varcons Technology',
            duration: 'Jan 2023 - Apr 2023',
            location: 'Bengaluru, India',
            description: `During my internship at Varcons Technology, I contributed to developing a comprehensive food ordering platform with focus on performance optimization.`,
            responsibilities: [
                'Built responsive food-ordering website prototype using HTML5/CSS3 with mobile-first design, implementing CSS Grid and Flexbox layouts',
                'Developed MySQL database schema with normalized tables, improving data integrity and query performance by 35%',
                'Collaborated with backend developers to understand RESTful API architecture and data flow',
                'Contributing to frontend optimization that reduced page load times by 30%',
                'Implemented real-time order tracking features and interactive UI components using vanilla JavaScript'
            ],
            technologies: ['HTML5', 'CSS3', 'JavaScript', 'MySQL', 'RESTful APIs', 'Git', 'Responsive Design']
        },
        'cmr-research': {
            title: 'Research Assistant - Accessibility Technology',
            company: 'CMR Institute of Technology',
            duration: 'Aug 2021 - Dec 2021',
            location: 'Bengaluru, India',
            description: `Contributed to innovative accessibility technology research focusing on hands-free computer control for physically handicapped users.`,
            responsibilities: [
                'Contributed to Face Embedded Mouse interface project selected for Smart India Hackathon 2021',
                'Developed hands-free computer control system for physically handicapped users using Python and facial recognition',
                'Assisted in implementing facial gesture detection algorithms and voice assistant integration',
                'Enabled cursor control through nose movements and eye blinks for users with amelia and amputation',
                'Collaborated with team of 5 to document technical specifications and test software with target user requirements'
            ],
            technologies: ['Python', 'OpenCV', 'Facial Recognition', 'Computer Vision', 'AI', 'Accessibility']
        },
        'ace-club': {
            title: 'Club Head',
            company: 'ACE Club (Association of Computer Engineers), CMRIT',
            duration: 'Oct 2021 - Dec 2022',
            location: 'Bengaluru, Karnataka, India',
            description: `As Club Head of ACE (Association of Computer Engineers), I led the Computer Science department's premier technical club for over a year, driving initiatives that enhanced the technical and professional development of 200+ students.`,
            responsibilities: [
                'Led a team to organize technical workshops, hackathons, and industry expert sessions',
                'Organized events including coding competitions, tech talks, and career development workshops reaching 100+ students',
                'Increased club membership by 40% through strategic outreach and engaging technical content',
                'Mentored junior members in event management, public speaking, and technical skills development'
            ],
            technologies: ['Team Leadership', 'Event Planning', 'Event Management', 'Public Speaking', 'Strategic Planning', 'Community Building']
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
                    ${project.links.demo ? `<a href="${project.links.demo}" target="_blank" class="btn btn-secondary"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
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
    document.querySelectorAll('.project-card, .timeline-item, .skill-category, .interest-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.zIndex = '1';
        });
    });
});