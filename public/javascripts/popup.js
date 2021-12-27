const popup = document.querySelector("#popup");
const openPopup = document.querySelector("#open-popup");
const popupInner = document.querySelector("#popup-inner");

if (popup && openPopup) {
    popup.addEventListener("click", () => {
        popup.classList.remove("visible");
        popup.classList.add("invisible");
    });

    popupInner.addEventListener("click", (e) => e.stopPropagation());

    // popup.classList.add("invisible");
    openPopup.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.classList.remove("invisible");
        popup.classList.add("visible");
    });
}