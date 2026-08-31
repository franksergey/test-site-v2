const story = document.querySelector(".client-pain");
const texts = document.querySelectorAll(".p-accent");

const trigger = document.querySelector(".decision");
const button = document.querySelector(".button-sticky");
const footer = document.querySelector("footer");

window.addEventListener("scroll", () => {

    const rect = story.getBoundingClientRect();

    const progress =
        -rect.top / (story.offsetHeight - window.innerHeight);

    let index = 0;

    if (progress > 0.66) {
        index = 2;
    } else if (progress > 0.33) {
        index = 1;
    }

    // Ограничиваем progress диапазоном 0-1
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    // Масштаб от 1 до 0.8
    const scale = 1 - clampedProgress * 0.2;

    texts.forEach((text, i) => {

        const active = i === index;

        text.classList.toggle("p-active", active);

        if (active) {
            text.style.transform = `scale(${scale})`;
        } else {
            text.style.transform = "scale(1)";
        }

    });

    const triggerTop = trigger.getBoundingClientRect().top;
    const footerTop = footer.getBoundingClientRect().top;

    if (
        triggerTop < window.innerHeight * 0.8 &&
        footerTop > window.innerHeight
    ) {
        button.classList.add("visible");
    } else {
        button.classList.remove("visible");
    }

});

window.addEventListener("load", () => {
    const video = document.querySelector(".background-video");
    if (!video) return;

    video.querySelectorAll("source").forEach(source => {
        source.src = source.dataset.src;
    });

    video.load();
    video.play().catch(() => {});
});

(function () {
    const video = document.querySelector(".background-video");
    const button = document.getElementById("sound-toggle");

    if (!video || !button) return;

    button.addEventListener("click", () => {
        video.muted = !video.muted;
        button.classList.toggle("is-unmuted", !video.muted);
        button.setAttribute(
            "aria-label",
            video.muted ? "Включить звук" : "Выключить звук"
        );
    });
})();

// (function () {
//     const gallery = document.getElementById("space-gallery");
//     const track = document.getElementById("space-gallery-track");

//     if (!gallery || !track) return;

//     // клонируем набор фото ещё дважды, чтобы скролл был бесконечным
//     const originalItems = Array.from(track.children);
//     originalItems.forEach(item => track.appendChild(item.cloneNode(true)));
//     originalItems.forEach(item => track.insertBefore(item.cloneNode(true), track.firstChild));

//     let setWidth = 0;

//     function centerScroll() {
//         setWidth = track.scrollWidth / 3;
//         gallery.scrollLeft = setWidth;
//     }

//     window.addEventListener("load", centerScroll);
//     window.addEventListener("resize", centerScroll);

//     // зацикливание при достижении края
//     gallery.addEventListener("scroll", () => {
//         if (gallery.scrollLeft <= 0) {
//             gallery.scrollLeft += setWidth;
//         } else if (gallery.scrollLeft >= setWidth * 2) {
//             gallery.scrollLeft -= setWidth;
//         }
//     });

//     // --- автоскролл ---
//     const AUTO_SPEED = 40; // px в секунду, примерно 1 фото в секунду
//     const RESUME_DELAY = 3000; // через сколько мс после взаимодействия снова включать автоскролл

//     let autoEnabled = true;
//     let resumeTimeout = null;
//     let lastTime = null;

//     function autoStep(time) {
//         if (lastTime === null) lastTime = time;
//         const dt = (time - lastTime) / 1000;
//         lastTime = time;

//         if (autoEnabled && !isDown) {
//             gallery.scrollLeft += AUTO_SPEED * dt;
//         }

//         requestAnimationFrame(autoStep);
//     }
//     requestAnimationFrame(autoStep);

//     function pauseAuto() {
//         autoEnabled = false;
//         clearTimeout(resumeTimeout);
//         resumeTimeout = setTimeout(() => {
//             autoEnabled = true;
//         }, RESUME_DELAY);
//     }

//     // любое ручное взаимодействие останавливает автоскролл
//     gallery.addEventListener("wheel", pauseAuto, { passive: true });
//     gallery.addEventListener("touchstart", pauseAuto, { passive: true });

//     // перетаскивание мышью
//     let isDown = false;
//     let startX = 0;
//     let scrollStart = 0;

//     gallery.addEventListener("mousedown", (e) => {
//         isDown = true;
//         pauseAuto();
//         gallery.classList.add("dragging");
//         startX = e.pageX;
//         scrollStart = gallery.scrollLeft;
//     });

//     window.addEventListener("mouseup", () => {
//         isDown = false;
//         gallery.classList.remove("dragging");
//     });

//     window.addEventListener("mousemove", (e) => {
//         if (!isDown) return;
//         e.preventDefault();
//         gallery.scrollLeft = scrollStart - (e.pageX - startX);
//     });
// })();


(function () {
    const section = document.querySelector(".new-format");
    const svg = section.querySelector(".new-format-lines");
    const title = section.querySelector(".new-format-title");
    const tags = Array.from(section.querySelectorAll(".new-format-tag"));

    if (!section || !svg || !title || tags.length === 0) return;

    const customAngles = [-100, -45, 40, 110, 215]; // градус для каждого тега по порядку
    const customRadii  = [0.45, 0.45, 0.35, 0.43, 0.35]; // доля радиуса для каждого тега

    const FLIGHT_DURATION = 700;   // мс, длительность разлёта одной точки
    const STAGGER = 90;            // мс, задержка между появлением тегов
    const ROTATION_SPEED = 0.5;    // градусов в секунду, скорость вращения всей окружности

    const ENTER_THRESHOLD = 0.4;
    const EXIT_THRESHOLD = 0.02;

    let lineEls = [];
    let isVisible = false;
    let rotating = false;
    let lastRotationTime = null;
    let rotationOffset = 0;
    let introTimers = [];

    function buildLines() {
        svg.innerHTML = "";
        lineEls = tags.map(() => {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            svg.appendChild(line);
            return line;
        });
    }

    function layout(extraOffsetDeg = 0) {
        const rect = section.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const base = Math.min(rect.width, rect.height);

        return tags.map((tag, i) => {
            const angle = (customAngles[i] + extraOffsetDeg) * (Math.PI / 180);
            const radius = base * customRadii[i];
            return {
                x: cx + radius * Math.cos(angle),
                y: cy + radius * Math.sin(angle)
            };
        });
    }

    function applyPositions(targets, useTransition) {
        tags.forEach((tag, i) => {
            tag.style.transition = useTransition
                ? `transform ${FLIGHT_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
                : "none";
            tag.style.setProperty("--tx", `${targets[i].x}px`);
            tag.style.setProperty("--ty", `${targets[i].y}px`);
        });
    }

    function setCenterPositions() {
        const rect = section.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        tags.forEach(tag => {
            tag.style.transition = "none";
            tag.style.setProperty("--tx", `${cx}px`);
            tag.style.setProperty("--ty", `${cy}px`);
        });
    }

    function updateLines() {
        const sectionRect = section.getBoundingClientRect();
        tags.forEach((tag, i) => {
            const tagRect = tag.getBoundingClientRect();
            const next = tags[(i + 1) % tags.length];
            const nextRect = next.getBoundingClientRect();

            const x1 = tagRect.left + tagRect.width / 2 - sectionRect.left;
            const y1 = tagRect.top + tagRect.height / 2 - sectionRect.top;
            const x2 = nextRect.left + nextRect.width / 2 - sectionRect.left;
            const y2 = nextRect.top + nextRect.height / 2 - sectionRect.top;

            lineEls[i].setAttribute("x1", x1);
            lineEls[i].setAttribute("y1", y1);
            lineEls[i].setAttribute("x2", x2);
            lineEls[i].setAttribute("y2", y2);
        });
        requestAnimationFrame(updateLines);
    }

    function rotationStep(time) {
        if (!rotating) return;

        if (lastRotationTime === null) lastRotationTime = time;
        const dt = (time - lastRotationTime) / 1000;
        lastRotationTime = time;

        rotationOffset += ROTATION_SPEED * dt;

        const targets = layout(rotationOffset);
        applyPositions(targets, false);

        requestAnimationFrame(rotationStep);
    }

    function startRotation() {
        if (rotating) return;
        rotating = true;
        lastRotationTime = null;
        requestAnimationFrame(rotationStep);
    }

    function stopRotation() {
        rotating = false;
        lastRotationTime = null;
    }

    function playIntro() {
        stopRotation();
        introTimers.forEach(clearTimeout);
        introTimers = [];

        rotationOffset = 0;
        setCenterPositions();

        void section.offsetHeight; // форсируем reflow

        const targets = layout(0);

        tags.forEach((tag, i) => {
            const t = setTimeout(() => {
                tag.style.transition = `transform ${FLIGHT_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
                tag.style.setProperty("--tx", `${targets[i].x}px`);
                tag.style.setProperty("--ty", `${targets[i].y}px`);
            }, i * STAGGER);
            introTimers.push(t);
        });

        const maxDelay = (tags.length - 1) * STAGGER + FLIGHT_DURATION;
        const t2 = setTimeout(() => {
            startRotation();
        }, maxDelay);
        introTimers.push(t2);
    }

    function resetPositions() {
        const targets = layout(rotationOffset);
        applyPositions(targets, false);
    }

    buildLines();
    setCenterPositions(); // теги стоят в центре, пока блок не появился в кадре
    requestAnimationFrame(updateLines);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const ratio = entry.intersectionRatio;

            if (ratio >= ENTER_THRESHOLD && !isVisible) {
                isVisible = true;
                playIntro();
            } else if (ratio <= EXIT_THRESHOLD && isVisible) {
                isVisible = false;
                stopRotation();
                introTimers.forEach(clearTimeout);
                introTimers = [];
                setCenterPositions();
            }
        });
    }, { threshold: [0, EXIT_THRESHOLD, ENTER_THRESHOLD, 1] });

    observer.observe(section);

    window.addEventListener("resize", () => {
        if (isVisible) resetPositions();
    });
})();