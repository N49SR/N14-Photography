const gallery = document.getElementById("gallery");

async function loadPhotos() {
    if (!gallery) return;

    gallery.innerHTML = "Loading photos...";

    try {
        const response = await fetch(
            "https://api.github.com/repos/N49SR/N14-Photography/contents/images?ref=main"
        );

        if (!response.ok) {
            throw new Error("Could not load photos");
        }

        const files = await response.json();

        const photos = files
            .filter(file =>
    file.type === "file" &&
    /\.(jpg|jpeg|png|webp)$/i.test(file.name) &&
    !/(logo|favicon)/i.test(file.name)
)
            .sort((a, b) =>
    b.name.localeCompare(a.name, undefined, {
        numeric: true
    })
);
        gallery.innerHTML = "";

        photos.forEach(photo => {
            const img = document.createElement("img");

            img.src = photo.download_url;
            img.alt = "N14 Football Photography";
            img.loading = "lazy";

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

loadPhotos();
