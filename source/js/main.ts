let imgLightbox = <HTMLElement>document.body.querySelector("img");
let lightboxFont = <HTMLElement>document.body.querySelector(".hidden");

imgLightbox.addEventListener("click", function() {

    imgLightbox.classList.toggle("lightbox");
    lightboxFont.classList.toggle("show");
});
