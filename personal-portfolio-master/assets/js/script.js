'use strict';

/* ========= Safe helper ========= */
const safeQuery = (sel) => {
  try {
    return document.querySelector(sel);
  } catch (e) {
    console.error('safeQuery error for', sel, e);
    return null;
  }
};
const safeQueryAll = (sel) => {
  try {
    return Array.from(document.querySelectorAll(sel));
  } catch (e) {
    console.error('safeQueryAll error for', sel, e);
    return [];
  }
};

const elementToggleFunc = (elem) => {
  if (!elem) return;
  elem.classList.toggle('active');
};

/* ========= Sidebar toggle ========= */
const sidebar = safeQuery('[data-sidebar]');
const sidebarBtn = safeQuery('[data-sidebar-btn]');
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener('click', () => elementToggleFunc(sidebar));
}

/* ========= Testimonials modal ========= */
const testimonialsItem = safeQueryAll('[data-testimonials-item]');
const modalContainer = safeQuery('[data-modal-container]');
const modalCloseBtn = safeQuery('[data-modal-close-btn]');
const overlay = safeQuery('[data-overlay]');
const modalImg = safeQuery('[data-modal-img]');
const modalTitle = safeQuery('[data-modal-title]');
const modalText = safeQuery('[data-modal-text]');

const testimonialsModalFunc = () => {
  if (modalContainer) modalContainer.classList.toggle('active');
  if (overlay) overlay.classList.toggle('active');
};

if (testimonialsItem.length && modalContainer && overlay) {
  testimonialsItem.forEach(item => {
    item.addEventListener('click', () => {
      try {
        const avatar = item.querySelector('[data-testimonials-avatar]');
        const title = item.querySelector('[data-testimonials-title]');
        const text = item.querySelector('[data-testimonials-text]');

        if (modalImg && avatar) modalImg.src = avatar.src || '';
        if (modalImg && avatar) modalImg.alt = avatar.alt || '';
        if (modalTitle && title) modalTitle.textContent = title.textContent || '';
        if (modalText && text) modalText.textContent = text.textContent || '';

        testimonialsModalFunc();
      } catch (err) {
        console.error('testimonials click error', err);
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', testimonialsModalFunc);
  overlay.addEventListener('click', testimonialsModalFunc);
}

/* ========= Project filter / custom select ========= */
const select = safeQuery('[data-select]');
const selectItems = safeQueryAll('[data-select-item]');
const selectValue = safeQuery('[data-selecct-value]'); // keep original spelling
const filterBtn = safeQueryAll('[data-filter-btn]');
const filterItems = safeQueryAll('[data-filter-item]');

const normalize = str => (str || '').toString().trim().toLowerCase();

const filterFunc = (selectedValue) => {
  const normSel = normalize(selectedValue);
  filterItems.forEach(item => {
    const cat = normalize(item.dataset.category);
    if (normSel === 'all' || normSel === cat || cat.includes(normSel)) {
      item.classList.add('active');
      item.style.display = '';
    } else {
      item.classList.remove('active');
      item.style.display = 'none';
    }
  });
};

// select dropdown toggle
if (select) {
  select.addEventListener('click', () => elementToggleFunc(select));
}

// select items click
if (selectItems.length && selectValue) {
  selectItems.forEach(it => {
    it.addEventListener('click', () => {
      const txt = it.innerText || it.textContent;
      selectValue.innerText = txt;
      elementToggleFunc(select);
      filterFunc(txt);
    });
  });
}

// large-screen filter buttons
if (filterBtn.length) {
  let lastClickedBtn = filterBtn[0];
  filterBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      const txt = btn.innerText || btn.textContent;
      if (selectValue) selectValue.innerText = txt;
      filterFunc(txt);
      if (lastClickedBtn) lastClickedBtn.classList.remove('active');
      btn.classList.add('active');
      lastClickedBtn = btn;
    });
  });
}

/* ========= Contact form validation ========= */
const form = safeQuery('[data-form]');
const formInputs = safeQueryAll('[data-form-input]');
const formBtn = safeQuery('[data-form-btn]');

if (form && formInputs.length && formBtn) {
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      try {
        if (form.checkValidity()) {
          formBtn.removeAttribute('disabled');
        } else {
          formBtn.setAttribute('disabled', '');
        }
      } catch (err) {
        console.error('form validity error', err);
      }
    });
  });
}

/* ========= Page navigation (robust) ========= */
const navigationLinks = safeQueryAll('[data-nav-link]');
const pages = safeQueryAll('[data-page]');

if (navigationLinks.length && pages.length) {
  navigationLinks.forEach(link => {
    link.addEventListener('click', () => {
      try {
        // Try to use data attribute first (if provided), otherwise use text content
        // We normalize both to compare to data-page values
        let target = null;

        // If link has data-target or data-page attribute (some templates do), prefer it
        if (link.dataset && link.dataset.target) target = normalize(link.dataset.target);
        if (!target && link.dataset && link.dataset.page) target = normalize(link.dataset.page);

        // fallback to displayed text
        if (!target) target = normalize(link.textContent);

        // if still empty, abort
        if (!target) {
          console.warn('nav link target could not be determined for', link);
          return;
        }

        // Activate matching page; deactivate others
        pages.forEach(page => {
          const pageId = normalize(page.dataset.page);
          if (pageId === target) {
            page.classList.add('active');
            // scroll to top to mimic expected behaviour
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            page.classList.remove('active');
          }
        });

        // update nav active class
        navigationLinks.forEach(n => n.classList.remove('active'));
        link.classList.add('active');

      } catch (err) {
        console.error('navigation click error', err);
      }
    });
  });
} else {
  console.warn('Navigation or pages not found', { navigationLinksLength: navigationLinks.length, pagesLength: pages.length });
}

/* ========= Final: helpful console info ========= */
console.info('Custom script loaded. Navigation links:', navigationLinks.length, 'Pages:', pages.length);
