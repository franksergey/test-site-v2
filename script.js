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

    // Масштаб от 1 до 0.92
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