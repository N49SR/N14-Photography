
const gallery = document.getElementById("gallery");

let photos = [];
let currentIndex = 0;

async function loadPhotos() {
    if (!gallery) return;

    gallery.innerHTML = "Loading photos...";

    try {
        const response = await fetch(
            "https://api.github.com/repos/N49SR/N14-Photography/contents/images?ref=main"
        );

        if (!response.ok) throw new Error("Could not load photos");

        const files = await response.json();

        photos = files
            .filter(file =>
                file.type === "file" &&
                /\.(jpg|jpeg|png|webp)$/i.test(file.name) &&
                !/(logo|favicon)/i.test(file.name)
            )
            .sort((a, b) =>
                a.name.localeCompare(b.name, undefined, {
                    numeric: true
                })
            );

        gallery.innerHTML = "";

        photos.forEach((photo, index) => {
            const img = document.createElement("img");

            img.src = photo.download_url;
            img.alt = "N14 Football Photography";
            img.loading = "lazy";

            img.addEventListener("click", () => {
                openLightbox(index);
            });

            gallery.appendChild(img);
        });

        if (photos.length === 0) {
            gallery.textContent = "No photos available yet.";
        }

    } catch (error) {
        gallery.textContent = "Could not load the gallery.";
        console.error(error);
    }
}

// Create image viewer
const lightbox = document.createElement("div");
lightbox.id = "lightbox";

lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close">&times;</button>
    <button class="lightbox-prev" aria-label="Previous">&#10094;</button>
    <img class="lightbox-image" alt="N14 Photography">
    <button class="lightbox-next" aria-label="Next">&#10095;</button>
    <button class="lightbox-download">DOWNLOAD ↓</button>
`;

document.body.appendChild(lightbox);

const lightboxImage = lightbox.querySelector(".lightbox-image");

function openLightbox(index) {
    currentIndex = index;
    showPhoto();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function showPhoto() {
    lightboxImage.src = photos[currentIndex].download_url;
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

function nextPhoto() {
    currentIndex = (currentIndex + 1) % photos.length;
    showPhoto();
}

function previousPhoto() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    showPhoto();
}

lightbox.querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);

lightbox.querySelector(".lightbox-next")
    .addEventListener("click", nextPhoto);

lightbox.querySelector(".lightbox-prev")
    .addEventListener("click", previousPhoto);

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
});

// Download original image
lightbox.querySelector(".lightbox-download")
    .addEventListener("click", async () => {
        const photo = photos[currentIndex];

        try {
            const response = await fetch(photo.download_url);
            if (!response.ok) throw new Error("Download failed");

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = photo.name;
            document.body.appendChild(link);
            link.click();
            link.remove();

            URL.revokeObjectURL(url);
        } catch (error) {
            window.open(photo.download_url, "_blank");
        }
    });

// Keyboard controls
document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("active")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") nextPhoto();
    if (event.key === "ArrowLeft") previousPhoto();
});

loadPhotos();
