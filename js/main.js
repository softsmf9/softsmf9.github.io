document.addEventListener('DOMContentLoaded', function() {
    const sidebarLinks = document.querySelectorAll('.sidebar nav a');
    const currentPath = window.location.pathname.split('/').pop(); // Get the current HTML file name
    const currentHash = window.location.hash; // Get the hash part (#section)

    // Function to normalize href for comparison
    const normalizeHref = (href) => {
        // Remove leading './' if present
        let normalized = href.startsWith('./') ? href.substring(2) : href;
        // If it's just a hash, prepend the current filename
        if (normalized.startsWith('#')) {
            normalized = currentPath + normalized;
        }
        return normalized;
    };

    // Determine the target href based on path and hash
    let targetHref = currentPath;
    if (currentHash) {
        targetHref += currentHash;
    }

    // Remove active class from all links first
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        // Also remove active from parent LI if it's a section title link (optional styling)
        if (link.parentElement.classList.contains('nav-section-title')) {
             // Assuming section titles aren't meant to be 'active' directly
        }
    });

    // Find the matching link and add the active class
    let foundActiveLink = false;
    sidebarLinks.forEach(link => {
        const linkHref = normalizeHref(link.getAttribute('href'));
        if (linkHref === targetHref) {
            link.classList.add('active');
            foundActiveLink = true;

            // Expand parent UL if it's in a sub-menu (optional)
            const parentUl = link.closest('ul');
            const parentLi = parentUl ? parentUl.closest('li') : null;
            if (parentLi && parentUl !== link.closest('.sidebar nav > ul')) {
                 // Could add logic here to expand parent menus if they are collapsible
            }
        }
    });

    // If no exact match (e.g., index.html without hash), activate the base link
    if (!foundActiveLink && !currentHash) {
         sidebarLinks.forEach(link => {
             const linkHref = normalizeHref(link.getAttribute('href'));
             if (linkHref === currentPath) {
                 link.classList.add('active');
             }
         });
    }

    // Handle smooth scrolling for hash links on the *same* page
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const linkHref = link.getAttribute('href');
            const linkPath = linkHref.split('#')[0];
            const linkHash = linkHref.includes('#') ? '#' + linkHref.split('#')[1] : null;

            // Check if the link points to the current page but has a hash
            if ((linkPath === currentPath || linkPath === '' || linkPath === './') && linkHash) {
                const targetElement = document.querySelector(linkHash);
                if (targetElement) {
                    event.preventDefault(); // Prevent default jump
                    targetElement.scrollIntoView({ behavior: 'smooth' });

                    // Update active class immediately for same-page navigation
                    sidebarLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');

                    // Optionally update URL hash without full page reload (for history)
                    // history.pushState(null, null, linkHash);
                }
            }
            // If it navigates to a different page, let the browser handle it,
            // and the script will run again on the new page load to set the active state.
        });
    });

});