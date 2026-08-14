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