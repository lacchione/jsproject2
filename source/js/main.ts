let imgLightbox = <HTMLElement>document.body.querySelector("img");

imgLightbox.addEventListener("click", function() {

    imgLightbox.classList.toggle("lightbox");
});
