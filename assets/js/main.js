// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  // Include header and footer
  includeComponents();
  
  // Setup search functionality
  setupSearch();
});

// Function to include header and footer components
function includeComponents() {
  // Include Header
  const headerElement = document.querySelector('#header-placeholder');
  if (headerElement) {
    fetch('components/header.html')
      .then(response => response.text())
      .then(data => {
        headerElement.innerHTML = data;
        
        // Fix paths in header for tools pages
        if (window.location.pathname.includes('/tools/')) {
          fixToolPagePaths();
        }
        
        // Initialize Bootstrap dropdowns after header is loaded
        const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
        const dropdownList = [...dropdownElementList].map(dropdownToggleEl => new bootstrap.Dropdown(dropdownToggleEl));
      })
      .catch(error => console.error('Error loading header:', error));
  }
  
  // Include Footer
  const footerElement = document.querySelector('#footer-placeholder');
  if (footerElement) {
    fetch('components/footer.html')
      .then(response => response.text())
      .then(data => {
        footerElement.innerHTML = data;
        
        // Fix paths in footer for tools pages
        if (window.location.pathname.includes('/tools/')) {
          fixToolPagePaths();
        }
      })
      .catch(error => console.error('Error loading footer:', error));
  }
}

// Fix paths for tool pages
function fixToolPagePaths() {
  // Fix logo and assets paths
  const logo = document.querySelector('.navbar-brand img');
  if (logo && logo.src.indexOf('../') === -1) {
    logo.src = '../' + logo.getAttribute('src');
  }
  
  // Fix home link
  const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html"]');
  if (homeLink) {
    homeLink.setAttribute('href', '../index.html');
  }
  
  // Fix tool links in header
  const toolLinks = document.querySelectorAll('.navbar-nav .dropdown-item');
  toolLinks.forEach(link => {
    if (link.getAttribute('href').startsWith('tools/')) {
      link.setAttribute('href', '../' + link.getAttribute('href'));
    }
  });
  
  // Fix footer links
  const footerLinks = document.querySelectorAll('.footer-links a, .text-md-end a');
  footerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#') && href.indexOf('../') === -1) {
      link.setAttribute('href', '../' + href);
    }
  });
}

// Search functionality
function setupSearch() {
  // Wait for the header to be loaded
  setTimeout(() => {
    const searchInput = document.getElementById('searchTools');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const toolCards = document.querySelectorAll('.tool-card');
        
        toolCards.forEach(card => {
          const title = card.querySelector('.card-title').textContent.toLowerCase();
          const description = card.querySelector('.card-text').textContent.toLowerCase();
          
          if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
        
        // Show/hide category sections based on visible cards
        const categories = document.querySelectorAll('.category-section');
        categories.forEach(category => {
          const visibleCards = category.querySelectorAll('.tool-card[style="display: block;"]');
          if (visibleCards.length === 0) {
            category.style.display = 'none';
          } else {
            category.style.display = 'block';
          }
        });
      });
    }
  }, 1000); // Wait 1 second for components to load
}

// Function to handle tool form submissions
function processToolForm(formId, processFunction, resultElementId) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const resultElement = document.getElementById(resultElementId);
      
      try {
        const result = processFunction(form);
        if (resultElement) {
          resultElement.innerHTML = result;
          resultElement.style.display = 'block';
        }
      } catch (error) {
        if (resultElement) {
          resultElement.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
          resultElement.style.display = 'block';
        }
      }
    });
  }
}

// Function to show a loading spinner
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    element.style.display = 'block';
  }
}

// Function to hide a loading spinner
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
  }
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  
  // Show toast notification
  const toast = document.createElement('div');
  toast.className = 'position-fixed bottom-0 end-0 p-3';
  toast.style.zIndex = '5';
  toast.innerHTML = `
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Multi-Tools</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">
        Copied to clipboard!
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
}

// Helper function to download a file
function downloadFile(filename, content, contentType) {
  const element = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
} 