




        document.addEventListener('DOMContentLoaded', function () {
             // Page load animation
            const accordionItems = document.querySelectorAll('.animated-item');
            accordionItems.forEach((item, index) => {
                item.style.setProperty('--animation-delay', `${(index) * 100}ms`);
            });
            
             // Main accordion logic
            const accordionHeaders = document.querySelectorAll('.accordion-header');
            accordionHeaders.forEach(header => {
                header.addEventListener('click', function () {
                    const content = this.nextElementSibling;
                    const icon = this.querySelector('svg');

                    const wasOpen = content.classList.contains('open');

                    // If not searching, close all other accordions
                    if (document.getElementById('search-input').value.trim() === '') {
                        document.querySelectorAll('.accordion-content').forEach(item => {
                            if (item !== content) {
                                item.style.maxHeight = null;
                                item.classList.remove('open');
                                const otherIcon = item.previousElementSibling.querySelector('svg');
                                if (otherIcon) otherIcon.classList.remove('rotate-180');
                            }
                        });
                    }

                    // Toggle the clicked accordion
                    if (wasOpen) {
                        content.style.maxHeight = null;
                        content.classList.remove('open');
                        if(icon) icon.classList.remove('rotate-180');
                    } else {
                        content.style.maxHeight = content.scrollHeight + 'px';
                        content.classList.add('open');
                        if(icon) icon.classList.add('rotate-180');
                    }
                });
            });

            // Search logic
            const searchInput = document.getElementById('search-input');
            const noResults = document.getElementById('no-results');
            const allAccordionItems = document.querySelectorAll('.accordion-item');
            
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                const isNumberSearch = /^\d+(\.\d+)?$/.test(searchTerm);
                let resultsFound = false;

                allAccordionItems.forEach(item => {
                    const header = item.querySelector('.accordion-header');
                    const content = item.querySelector('.accordion-content');
                    const icon = header.querySelector('svg');
                    let matchFoundInItem = false;

                    const priceItems = item.querySelectorAll('.price-item');
                    
                    // Always show all price items first before filtering
                    priceItems.forEach(p => p.style.display = 'flex');

                    // Check if header matches first
                    if (header.textContent.toLowerCase().includes(searchTerm)) {
                        matchFoundInItem = true;
                    } else {
                         // Filter individual price items
                        priceItems.forEach(priceItem => {
                            const priceItemText = priceItem.textContent.toLowerCase();
                            const priceText = priceItem.querySelector('.price')?.textContent.toLowerCase() || '';
                            let match = false;
                            
                            if (isNumberSearch) {
                                const numbersInPrice = priceText.match(/\d+(\.\d+)?/g) || [];
                                if (numbersInPrice.some(num => num === searchTerm)) {
                                    match = true;
                                }
                            } else {
                                if (priceItemText.includes(searchTerm)) {
                                    match = true;
                                }
                            }

                            if (match) {
                                priceItem.style.display = 'flex';
                                matchFoundInItem = true;
                            } else {
                                priceItem.style.display = 'none';
                            }
                        });
                    }

                    // Special handling for sections without standard .price-item (like Sticken)
                     if (item.querySelector('#sticken-groesse-buttons') || item.querySelector('.calculator-button')) {
                        if (item.textContent.toLowerCase().includes(searchTerm)) {
                             matchFoundInItem = true;
                        }
                     }

                    if (matchFoundInItem) {
                        item.style.display = 'block';
                        resultsFound = true;
                        if(searchTerm.length > 0) {
                            content.style.maxHeight = content.scrollHeight + 'px';
                            content.classList.add('open');
                            if(icon) icon.classList.add('rotate-180');
                        }
                    } else {
                        item.style.display = 'none';
                    }
                });

                noResults.style.display = resultsFound ? 'none' : 'block';

                if (searchTerm === '') {
                    allAccordionItems.forEach(item => {
                        item.style.display = 'block';
                        item.querySelectorAll('.price-item').forEach(p => p.style.display = 'flex');

                        const content = item.querySelector('.accordion-content');
                        const icon = item.querySelector('svg');
                        content.style.maxHeight = null;
                        content.classList.remove('open');
                        if (icon) icon.classList.remove('rotate-180');
                    });
                    noResults.style.display = 'none';
                }
            });

            // "Back to top" button logic
            const toTopButton = document.getElementById('to-top-button');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    toTopButton.classList.add('show');
                } else {
                    toTopButton.classList.remove('show');
                }
            });
            toTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Hosen tabs logic
            const hosenButtons = document.querySelectorAll('#hosen-buttons .option-button');
            const hosenPanels = document.querySelectorAll('.hosen-panel');
            hosenButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const targetPanelId = button.dataset.target;
                    
                    if (button.classList.contains('active')) {
                        button.classList.remove('active');
                        document.getElementById(targetPanelId).classList.add('hidden');
                    } else {
                        hosenButtons.forEach(btn => btn.classList.remove('active'));
                        hosenPanels.forEach(panel => panel.classList.add('hidden'));
                        button.classList.add('active');
                        document.getElementById(targetPanelId).classList.remove('hidden');
                    }
                    // Recalculate parent accordion height
                    const parentAccordionContent = button.closest('.accordion-content');
                    if (parentAccordionContent && parentAccordionContent.style.maxHeight) {
                        setTimeout(() => {
                           parentAccordionContent.style.maxHeight = parentAccordionContent.scrollHeight + 'px';
                        }, 50);
                    }
                });
            });

            // Sticken calculator logic
            const sizeButtons = document.querySelectorAll('#sticken-groesse-buttons .option-button');
            const quantitySlider = document.getElementById('sticken-stueckzahl');
            const quantityOutput = document.getElementById('stueckzahl-output');
            const pricePerPieceEl = document.getElementById('price-per-piece');
            const totalPriceEl = document.getElementById('total-price');

            const priceMatrix = [
                [29, 18, 16, 13, 10, 7],  // bis 25 cm²
                [33, 22, 18, 16, 12, 9],  // bis 50 cm²
                [37, 25, 21, 19, 14, 12], // bis 75 cm²
                [42, 29, 24, 22, 18, 14], // bis 100 cm²
                [47, 33, 28, 26, 20, 18], // bis 150 cm²
                [52, 38, 32, 30, 25, 22]  // bis 200 cm²
            ];

            let selectedSizeIndex = -1;

            function getQuantityIndex(quantity) {
                if (quantity >= 100) return 5;
                if (quantity >= 50) return 4;
                if (quantity >= 20) return 3;
                if (quantity >= 10) return 2;
                if (quantity >= 5) return 1;
                return 0; // 1-4
            }

            function calculatePrice() {
                if (selectedSizeIndex === -1) {
                    pricePerPieceEl.textContent = 'Wählen Sie Grösse';
                    totalPriceEl.textContent = '-';
                    return;
                }
                const quantity = parseInt(quantitySlider.value);
                const quantityIndex = getQuantityIndex(quantity);
                const pricePerPiece = priceMatrix[selectedSizeIndex][quantityIndex];
                const totalPrice = pricePerPiece * quantity;

                pricePerPieceEl.textContent = `${pricePerPiece.toFixed(2)} CHF`;
                totalPriceEl.textContent = `${totalPrice.toFixed(2)} CHF`;
            }

sizeButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    // Jeśli klik w ikonę „i” – nic nie rób, pozwól iść dalej (modal/tooltip to obsłuży)
    if (event.target.closest('.tooltip-icon')) {
      return; // NIE przerywaj propagacji, nie zmieniaj wyboru rozmiaru
    }

    // Dla normalnego kliku w przycisk nadal blokujemy propagację, żeby akordeon nie łapał
    event.stopPropagation();

    const sizeIndex = parseInt(button.dataset.size, 10);
    if (selectedSizeIndex === sizeIndex) {
      selectedSizeIndex = -1;
      button.classList.remove('active');
    } else {
      sizeButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      selectedSizeIndex = sizeIndex;
    }
    calculatePrice();
  });
});

            
            quantitySlider.addEventListener('input', () => {
                quantityOutput.textContent = quantitySlider.value;
                calculatePrice();
            });
            
            // Search toggle logic
            const searchContainer = document.getElementById('search-container');
            const searchToggleButton = document.getElementById('search-toggle-button');
    
            searchToggleButton.addEventListener('click', (e) => {
                e.stopPropagation();
                searchContainer.classList.add('search-active');
                searchInput.focus();
            });
    
            document.addEventListener('click', (e) => {
                 if (!searchContainer.contains(e.target) && searchInput.value.trim() === '') {
                    searchContainer.classList.remove('search-active');
                 }
            });

        });

        
 

// === GLOBAL TOOLTIP MODAL – działa dla wszystkich tooltipów na stronie ===
(() => {
  // Sprawdza, czy ekran ma maksymalnie 1023px szerokości
// Sprawdza brak hovera LUB "gruby" wskaźnik (co zwykle oznacza dotyk)
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  // Referencje do modala:
  const modal   = document.getElementById('tooltipModal');
  if (!modal) return; // brak modala => nic nie robimy
  const panel   = modal.querySelector('.tooltip-panel');
  const backdrop= modal.querySelector('.tooltip-backdrop');
  const btnX    = modal.querySelector('.tooltip-close');
  const h3      = modal.querySelector('.tooltip-modal-title');
  const body    = modal.querySelector('.tooltip-modal-body');

  let lastFocused = null;
  let uid = 1;

  // Upewnij się, że KAŻDY tooltip ma powiązanie aria-describedby
  function wireAllTooltips(root = document) {
    root.querySelectorAll('.tooltip-container').forEach(tc => {
      const btn = tc.querySelector('.tooltip-icon, button.tooltip-icon');
      const tip = tc.querySelector('.tooltip-text');
      if (!btn || !tip) return;

      // Nadaj id jeśli brakuje
      if (!tip.id) {
        tip.id = `tt-auto-${uid++}`;
      }
      // Ustaw aria-describedby jeśli brakuje lub nie zgadza się
      if (btn.getAttribute('aria-describedby') !== tip.id) {
        btn.setAttribute('aria-describedby', tip.id);
      }
      // Upewnij się, że przycisk jest focusowalny
      if (btn.tagName !== 'BUTTON') btn.setAttribute('tabindex', '0');
    });
  }

  wireAllTooltips();
  // Jeśli w przyszłości dynamicznie dodasz HTML:
  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(n => {
        if (!(n instanceof HTMLElement)) return;
        if (n.matches && n.matches('.tooltip-container, .tooltip-container *')) {
          wireAllTooltips(n.closest('.tooltip-container') || n);
        } else {
          wireAllTooltips(n);
        }
      });
    });
  });
  mo.observe(document.body, { childList: true, subtree: true });

  // Otwórz modal z HTML tooltipa




  
  function openModalFrom(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;

    // Pierwszy <b>...></b> traktujemy jako tytuł
    let heading = '';
    if (tmp.firstElementChild && tmp.firstElementChild.tagName === 'B') {
      heading = tmp.firstElementChild.textContent.trim();
      tmp.firstElementChild.remove();
      if (tmp.firstChild && tmp.firstChild.nodeName === 'BR') tmp.removeChild(tmp.firstChild);
    }
    h3.textContent = heading || 'Zeigt die ungefähre Stickgrösse – der Teil, der bestickt wird.';
    body.innerHTML = tmp.innerHTML;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    btnX.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    if (lastFocused) {
      try { lastFocused.focus(); } catch (_) {}
      lastFocused = null;
    }
  }

  btnX.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  // Delegacja kliknięć w ikony "i" – działa dla CAŁEJ strony
  document.addEventListener('click', e => {
    const btn = e.target.closest('.tooltip-icon');
    if (!btn) return;

    // Mobile: modal; Desktop: zostawiasz hover (brak modala)
    if (!isTouch) return;

    const id = btn.getAttribute('aria-describedby');
    if (!id) return;
    const src = document.getElementById(id);
    if (!src) return;

    e.preventDefault();
    lastFocused = btn;
    openModalFrom(src.innerHTML);
  });



  
  // Opcjonalnie: klawiatura na desktopie – Enter/Space otwiera modal też na dotyku
  document.addEventListener('keydown', e => {
    if (!isTouch) return;
    const target = e.target.closest && e.target.closest('.tooltip-icon');
    if (!target) return;
    if (e.key === 'Enter' || e.key === ' ') {
      const id = target.getAttribute('aria-describedby');
      const src = id && document.getElementById(id);
      if (src) {
        e.preventDefault();
        lastFocused = target;
        openModalFrom(src.innerHTML);
      }
    }
  });
})();

// Zamknięcie pola wyszukiwania po kliknięciu ✕ (delegacja zdarzeń)
(function () {
  const container = document.getElementById('search-container');
  const input     = document.getElementById('search-input');
  if (!container || !input) return;

  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('#search-close-button');
    // reaguj tylko gdy kliknięto w nasz ✕ i należy do tego kontenera
    if (!btn || !container.contains(btn)) return;

    ev.stopPropagation();
    container.classList.remove('search-active');
    input.value = '';
    // wymuś zwinięcie nawet przy klasach Tailwinda
    input.style.width = '0px';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    input.blur();
  });
})();


// --- PATCH: stabilny toggle dla wyszukiwarki (open/close style) ---
(function () {
  const container = document.getElementById('search-container');
  const input     = document.getElementById('search-input');
  const btnOpen   = document.getElementById('search-toggle-button');
  const btnClose  = document.getElementById('search-close-button'); // jeśli masz X

  if (!container || !input || !btnOpen) return;

  // style dla stanu OTWARTEGO / ZAMKNIĘTEGO (przebijają Tailwinda)
  const applyOpen  = () => {
    input.style.width = '256px';      // możesz zmienić np. na 224 / 300
    input.style.opacity = '1';
    input.style.pointerEvents = 'auto';
    btnClose && btnClose.classList.remove('hidden');
  };
  const applyClose = () => {
    input.style.width = '0px';
    input.style.opacity = '0';
    input.style.pointerEvents = 'none';
    btnClose && btnClose.classList.add('hidden');
  };

  // Gdy klikniesz lupę: jeśli zamknięte -> otwórz + ustaw style
  btnOpen.addEventListener('click', () => {
    if (!container.classList.contains('search-active')) {
      container.classList.add('search-active');
      applyOpen();
      setTimeout(() => input.focus(), 60);
    }
    // jeśli już otwarte, nie zmieniamy Twojej logiki zamykania
  }, true); // capture, żeby patch zadziałał przed innymi handlerami




  

  // Klik w X: zamknij + style zamknięte
  document.addEventListener('click', (ev) => {
    const x = ev.target.closest('#search-close-button');
    if (!x || !container.contains(x)) return;
    ev.stopPropagation();
    container.classList.remove('search-active');
    input.value = '';
    applyClose();
    input.blur();
  }, true);

  // Klik poza – jeśli puste, też dołóż style zamknięte (spójne z Twoim kodem)
  document.addEventListener('click', (ev) => {
    if (!container.contains(ev.target) && (input.value.trim() === '')) {
      container.classList.remove('search-active');
      applyClose();
    }
  }, true);

  // ESC też zamyka (opcjonalnie)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && container.classList.contains('search-active')) {
      container.classList.remove('search-active');
      applyClose();
      input.blur();
    }
  });
})();




