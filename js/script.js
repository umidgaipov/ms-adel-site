const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
const serviceToggles = document.querySelectorAll(".service-toggle");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const dragAreas = document.querySelectorAll(".drag-scroll");
const lightbox = document.querySelector("#lightbox");
const heroImage = document.querySelector(".hero-media img");
const locationPhotos = document.querySelectorAll(".location-photo");

function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
}

function openMobileMenu() {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Закрыть меню");
    mobileMenu.setAttribute("aria-hidden", "false");
    mobileMenu.classList.add("is-open");
    header.classList.add("is-open");
    document.body.classList.add("menu-open");

    const firstFocusable = mobileMenu.querySelector("a, button");
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

function closeMobileMenu(returnFocus = true) {
    if (!menuToggle || !mobileMenu) return;
    const wasOpen = mobileMenu.classList.contains("is-open");
    if (!wasOpen) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Открыть меню");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");

    if (returnFocus && document.activeElement && mobileMenu.contains(document.activeElement)) {
        menuToggle.focus();
    }
}

function toggleMobileMenu() {
    if (!menuToggle) return;
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function updateHeroParallax() {
    if (!heroImage || window.matchMedia("(max-width: 980px)").matches) {
        return;
    }

    const offset = Math.min(window.scrollY * 0.08, 34);
    heroImage.style.transform = `translateY(${offset}px) scale(1.02)`;
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

window.addEventListener("scroll", updateHeroParallax, { passive: true });
updateHeroParallax();

window.addEventListener("resize", () => {
    if (window.innerWidth > 980 && mobileMenu?.classList.contains("is-open")) {
        closeMobileMenu(false);
    }
});

function updateLocationParallax() {
    if (!locationPhotos.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    locationPhotos.forEach((photo, index) => {
        const rect = photo.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const photoCenter = rect.top + rect.height / 2;
        const intensity = index === 0 ? 0.028 : 0.044;
        const offset = Math.max(-18, Math.min(18, (viewportCenter - photoCenter) * intensity));

        photo.style.setProperty("--location-parallax", `${offset}px`);
    });
}

window.addEventListener("scroll", updateLocationParallax, { passive: true });
window.addEventListener("resize", updateLocationParallax);
updateLocationParallax();

function syncMarqueeOffsets() {
    document.querySelectorAll(".portfolio-track, .reviews-track").forEach((track) => {
        const firstDuplicate = track.querySelector(".duplicate");

        if (!firstDuplicate) {
            return;
        }

        track.style.setProperty("--marquee-offset", `${-firstDuplicate.offsetLeft}px`);
        track.closest(".drag-scroll")?.style.setProperty("--marquee-loop", `${firstDuplicate.offsetLeft}px`);
    });
}

function fillReviewMarquee() {
    const track = document.querySelector(".reviews-track");
    const marquee = track?.closest(".reviews-marquee");

    if (!track || !marquee) {
        return;
    }

    const originalCards = Array.from(track.children).filter((card) => !card.classList.contains("duplicate"));
    const firstDuplicate = track.querySelector(".duplicate");

    if (!originalCards.length || !firstDuplicate) {
        return;
    }

    const loopWidth = firstDuplicate.offsetLeft;
    if (loopWidth <= 0) {
        return;
    }

    const targetWidth = loopWidth * 2 + marquee.offsetWidth;
    let safety = 0;

    while (track.scrollWidth < targetWidth && safety < 10) {
        safety++;
        originalCards.forEach((card) => {
            const clone = card.cloneNode(true);
            clone.classList.add("duplicate");
            clone.setAttribute("aria-hidden", "true");
            clone.querySelectorAll("img").forEach((img) => {
                img.alt = "";
            });
            track.appendChild(clone);
        });
    }
}

function setupMarquees() {
    fillReviewMarquee();
    syncMarqueeOffsets();
}

window.addEventListener("resize", setupMarquees);
window.addEventListener("load", setupMarquees);
if (document.readyState === "complete") {
    setupMarquees();
} else {
    window.addEventListener("DOMContentLoaded", setupMarquees);
}

if (menuToggle) {
    menuToggle.addEventListener("click", toggleMobileMenu);
}

if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu(false);
        });
    });
}

/* -------------------------------------------------------------
   Direction-Aware Tabs
   ------------------------------------------------------------- */
function initDirectionAwareTabs() {
    const tabsNav = document.querySelector(".tabs-nav");
    const indicator = document.querySelector(".tab-indicator");
    const tabButtons = Array.from(document.querySelectorAll(".tab-btn"));
    const tabPanels = Array.from(document.querySelectorAll(".tab-panel"));

    if (!tabsNav || !indicator || !tabButtons.length || !tabPanels.length) {
        return;
    }

    let currentIndex = tabButtons.findIndex((btn) => btn.classList.contains("is-active"));
    if (currentIndex === -1) {
        currentIndex = 0;
    }

    function updateIndicator(targetBtn) {
        if (!targetBtn) return;
        const navRect = tabsNav.getBoundingClientRect();
        const btnRect = targetBtn.getBoundingClientRect();

        const offsetLeft = btnRect.left - navRect.left;
        const btnWidth = btnRect.width;

        indicator.style.transform = `translateX(${offsetLeft}px)`;
        indicator.style.width = `${btnWidth}px`;
    }

    function switchTab(nextIndex, animate = true) {
        if (nextIndex < 0 || nextIndex >= tabButtons.length) return;
        if (nextIndex === currentIndex && animate) return;

        const prevIndex = currentIndex;
        currentIndex = nextIndex;

        const direction = nextIndex >= prevIndex ? "right" : "left";

        tabButtons.forEach((btn, idx) => {
            const isActive = idx === currentIndex;
            btn.classList.toggle("is-active", isActive);
            btn.setAttribute("aria-selected", String(isActive));
            btn.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        updateIndicator(tabButtons[currentIndex]);

        tabPanels.forEach((panel, idx) => {
            if (idx === currentIndex) {
                panel.hidden = false;
                panel.classList.add("is-active");

                if (animate) {
                    panel.classList.remove("slide-in-right", "slide-in-left");
                    void panel.offsetWidth;
                    panel.classList.add(direction === "right" ? "slide-in-right" : "slide-in-left");
                }
            } else {
                panel.classList.remove("is-active", "slide-in-right", "slide-in-left");
                panel.hidden = true;
            }
        });
    }

    tabButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            switchTab(index, true);
        });
    });

    tabsNav.addEventListener("keydown", (event) => {
        let targetIndex = null;

        if (event.key === "ArrowRight" || event.key === "ArrowDown") {
            event.preventDefault();
            targetIndex = (currentIndex + 1) % tabButtons.length;
        } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
            event.preventDefault();
            targetIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length;
        } else if (event.key === "Home") {
            event.preventDefault();
            targetIndex = 0;
        } else if (event.key === "End") {
            event.preventDefault();
            targetIndex = tabButtons.length - 1;
        }

        if (targetIndex !== null) {
            tabButtons[targetIndex].focus();
            switchTab(targetIndex, true);
        }
    });

    window.addEventListener("resize", () => {
        updateIndicator(tabButtons[currentIndex]);
    });

    // Initial positioning
    updateIndicator(tabButtons[currentIndex]);
    setTimeout(() => {
        updateIndicator(tabButtons[currentIndex]);
    }, 120);

    window.switchServiceTab = switchTab;
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDirectionAwareTabs);
} else {
    initDirectionAwareTabs();
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        const rawHref = link.getAttribute("href");

        if (!rawHref || rawHref === "#") {
            return;
        }

        const tabLinks = {
            "#eyelashes": 0,
            "#permanent": 1,
            "#laser": 2,
        };

        if (tabLinks[rawHref] !== undefined) {
            event.preventDefault();
            if (typeof window.switchServiceTab === "function") {
                window.switchServiceTab(tabLinks[rawHref], true);
            }
            const servicesSection = document.querySelector("#services");
            if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            return;
        }

        const target = document.querySelector(rawHref);

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (window.location.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }
    });
});

portfolioItems.forEach((item) => {
    item.addEventListener("click", (event) => {
        if (item.closest(".drag-scroll")?.dataset.dragged === "true") {
            event.preventDefault();
            return;
        }

        const img = item.querySelector("img");
        lightbox.querySelector("img").src = img.src;
        lightbox.querySelector("img").alt = img.alt;
        lightbox.querySelector("p").textContent = item.dataset.title || img.alt;
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
    });
});

dragAreas.forEach((area) => {
    let startX = 0;
    let startScroll = 0;
    let isPointerDown = false;
    let moved = false;

    area.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
            return;
        }

        isPointerDown = true;
        moved = false;
        startX = event.clientX;
        startScroll = area.scrollLeft;
        area.dataset.dragged = "false";
        area.classList.add("is-dragging");
        area.setPointerCapture(event.pointerId);
    });

    area.addEventListener("pointermove", (event) => {
        if (!isPointerDown) {
            return;
        }

        const delta = event.clientX - startX;
        if (Math.abs(delta) > 5) {
            moved = true;
            area.dataset.dragged = "true";
        }
        area.scrollLeft = startScroll - delta;
        const loopWidth = parseFloat(area.style.getPropertyValue("--marquee-loop"));

        if (loopWidth > 0 && area.scrollLeft >= loopWidth) {
            area.scrollLeft -= loopWidth;
            startScroll -= loopWidth;
        }
    });

    function endDrag(event) {
        if (!isPointerDown) {
            return;
        }

        isPointerDown = false;
        area.classList.remove("is-dragging");
        if (area.hasPointerCapture(event.pointerId)) {
            area.releasePointerCapture(event.pointerId);
        }

        window.setTimeout(() => {
            area.dataset.dragged = "false";
        }, moved ? 140 : 0);
    }

    area.addEventListener("pointerup", endDrag);
    area.addEventListener("pointercancel", endDrag);
    area.addEventListener("pointerleave", (event) => {
        if (isPointerDown) {
            endDrag(event);
        }
    });
});

lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target.classList.contains("lightbox-close")) {
        closeLightbox();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
        return;
    }

    closeMobileMenu();
    closeLightbox();
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: "0px 0px -70px 0px"
});

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});
