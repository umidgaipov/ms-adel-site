const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
const serviceToggles = document.querySelectorAll(".service-toggle");
const portfolioItems = document.querySelectorAll(".portfolio-item");
const dragAreas = document.querySelectorAll(".drag-scroll");
const lightbox = document.querySelector("#lightbox");
const heroImage = document.querySelector(".hero-media img");

function setHeaderState() {
    header.classList.toggle("is-scrolled", window.scrollY > 44);
}

function closeMobileMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    mobileMenu.classList.remove("is-open");
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");
}

function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

window.addEventListener("scroll", setHeaderState);
setHeaderState();

function updateHeroParallax() {
    if (!heroImage || window.matchMedia("(max-width: 980px)").matches) {
        return;
    }

    const offset = Math.min(window.scrollY * 0.08, 34);
    heroImage.style.transform = `translateY(${offset}px) scale(1.02)`;
}

window.addEventListener("scroll", updateHeroParallax, { passive: true });
updateHeroParallax();

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
    const targetWidth = loopWidth * 2 + marquee.offsetWidth;

    while (track.scrollWidth < targetWidth) {
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
setupMarquees();

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.setAttribute("aria-hidden", String(isOpen));
    mobileMenu.classList.toggle("is-open", !isOpen);
    header.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
});

mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
});

serviceToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const card = toggle.closest(".service-card");
        const isOpen = card.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(isOpen));
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
