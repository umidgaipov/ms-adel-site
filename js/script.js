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

        track.closest(".drag-scroll")?.style.setProperty("--marquee-loop", `${firstDuplicate.offsetLeft}px`);
    });
}

const MARQUEE_SPEED = 38;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function initMarqueeAutoplay() {
    const areas = Array.from(document.querySelectorAll(".drag-scroll"));
    if (!areas.length) return;

    areas.forEach((area) => {
        area.dataset.paused = area.dataset.paused || "0";
        area.addEventListener("pointerenter", () => { area.dataset.paused = "1"; });
        area.addEventListener("pointerleave", () => { area.dataset.paused = "0"; });
        area.addEventListener("focusin", () => { area.dataset.paused = "1"; });
        area.addEventListener("focusout", () => { area.dataset.paused = "0"; });
    });

    let last = performance.now();

    function tick(now) {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        if (!document.hidden && !reducedMotion.matches) {
            areas.forEach((area) => {
                if (area.dataset.paused === "1" || area.dataset.dragged === "true" || area.classList.contains("is-dragging")) {
                    return;
                }

                const loopWidth = parseFloat(area.style.getPropertyValue("--marquee-loop"));
                if (!loopWidth || loopWidth <= 0) return;

                let next = area.scrollLeft + MARQUEE_SPEED * dt;
                if (next >= loopWidth) next -= loopWidth;
                area.scrollLeft = next;
            });
        }

        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

function fillMarquees() {
    document.querySelectorAll(".drag-scroll").forEach((marquee) => {
        const track = marquee.querySelector(".portfolio-track, .reviews-track");

        if (!track) {
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
                clone.removeAttribute("aria-label");
                clone.setAttribute("tabindex", "-1");
                clone.querySelectorAll("img").forEach((img) => {
                    img.alt = "";
                });
                track.appendChild(clone);
            });
        }
    });
}

function setupMarquees() {
    fillMarquees();
    syncMarqueeOffsets();
}

function bootMarquees() {
    setupMarquees();
    initMarqueeAutoplay();
}

window.addEventListener("resize", setupMarquees);
window.addEventListener("load", setupMarquees);
if (document.readyState === "complete") {
    bootMarquees();
} else if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", bootMarquees);
} else {
    bootMarquees();
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

document.querySelectorAll(".faq-question").forEach((btn) => {
    const item = btn.closest(".faq-item");
    if (!item) return;

    btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        document.querySelectorAll(".faq-item.is-open").forEach((openItem) => {
            if (openItem !== item) {
                openItem.classList.remove("is-open");
                openItem.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
            }
        });

        btn.setAttribute("aria-expanded", String(!expanded));
        item.classList.toggle("is-open", !expanded);
    });
});

document.addEventListener("click", (event) => {
    const item = event.target.closest(".portfolio-item");
    if (!item) return;

    if (item.closest(".drag-scroll")?.dataset.dragged === "true") {
        event.preventDefault();
        return;
    }

    const img = item.querySelector("img");
    if (!img || !lightbox) return;

    const lightboxImg = lightbox.querySelector("img");
    const lightboxCaption = lightbox.querySelector("p");

    if (lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || item.dataset.title || "";
    }
    if (lightboxCaption) {
        lightboxCaption.textContent = item.dataset.title || img.alt || "";
    }

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
});

dragAreas.forEach((area) => {
    let startX = 0;
    let startScroll = 0;
    let isPointerDown = false;
    let moved = false;

    area.addEventListener("scroll", () => {
        const loopWidth = parseFloat(area.style.getPropertyValue("--marquee-loop"));
        if (!loopWidth || loopWidth <= 0) return;

        if (area.scrollLeft >= loopWidth) {
            area.scrollLeft -= loopWidth;
        }
    }, { passive: true });

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
        const loopWidth = parseFloat(area.style.getPropertyValue("--marquee-loop"));
        let next = startScroll - delta;

        if (loopWidth > 0) {
            if (next >= loopWidth) {
                next -= loopWidth;
                startScroll -= loopWidth;
            } else if (next < 0) {
                next += loopWidth;
                startScroll += loopWidth;
            }
        }

        area.scrollLeft = next;
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

        if (!moved) {
            area.dataset.dragged = "false";
            return;
        }

        let calmTimer;
        area.dataset.dragged = "true";

        const settle = () => {
            area.removeEventListener("scroll", onCalmScroll);
            area.dataset.dragged = "false";
        };

        const onCalmScroll = () => {
            window.clearTimeout(calmTimer);
            calmTimer = window.setTimeout(settle, 220);
        };
        area.addEventListener("scroll", onCalmScroll);
        onCalmScroll();
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
