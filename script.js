const gallery = document.getElementById("gallery");

async function loadMatches() {
    if (!gallery) return;

    gallery.innerHTML = "Loading matches...";

    try {
        const response = await fetch(
            "https://api.github.com/repos/N49SR/N14-Photography/contents/images?ref=main"
        );

        if (!response.ok) throw new Error("Could not load matches");

        const files = await response.json();

        const matches = files
            .filter(file => file.type === "dir")
            .sort((a, b) => a.name.localeCompare(
                b.name, undefined, { numeric: true }
            ));

        gallery.innerHTML = "";

        for (const match of matches) {
            const photoResponse = await fetch(match.url);
            if (!photoResponse.ok) continue;

            const photoFiles = await photoResponse.json();

            const photos = photoFiles
                .filter(file =>
                    file.type === "file" &&
                    /\.(jpg|jpeg|png|webp)$/i.test(file.name)
                )
                .sort((a, b) => a.name.localeCompare(
                    b.name, undefined, { numeric: true }
                ));

            if (photos.length === 0) continue;

            const card = document.createElement("div");
            card.className = "match-card";

            const cover = document.createElement("img");
            cover.className = "match-cover";
            cover.src = "https://raw.githubusercontent.com/N49SR/N14-Photography/main/" + photos[0].path;
            cover.alt = match.name;
            cover.loading = "lazy";

            const title = document.createElement("h3");
            title.textContent = match.name.replace(/-/g, " ").toUpperCase();

            const button = document.createElement("button");
            button.textContent = "VIEW PHOTOS";

            const photosContainer = document.createElement("div");
            photosContainer.className = "match-photos";
            photosContainer.hidden = true;

            photos.forEach(photo => {
                const img = document.createElement("img");
                img.src = "https://raw.githubusercontent.com/N49SR/N14-Photography/main/" + photo.path;
                img.alt = match.name;
                img.loading = "lazy";
                img.style.cursor = "zoom-in";

img.addEventListener("click", () => {
    let currentIndex = photos.indexOf(photo);

    const viewer = document.createElement("div");
    viewer.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.96);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        padding: 20px;
    `;

    const largeImage = document.createElement("img");
    largeImage.style.cssText = `
        max-width: 85%;
        max-height: 85vh;
        object-fit: contain;
    `;

    function updateImage() {
        largeImage.src =
            "https://raw.githubusercontent.com/N49SR/N14-Photography/main/" +
            photos[currentIndex].path;

        download.href = largeImage.src;
        download.download = photos[currentIndex].name;
    }

    const prev = document.createElement("button");
    prev.textContent = "❮";
    const next = document.createElement("button");
    next.textContent = "❯";

    const close = document.createElement("button");
    close.textContent = "✕";

    const download = document.createElement("a");
    download.textContent = "⬇ DOWNLOAD";
    download.style.cssText = `
        color: white;
        background: #e00000;
        padding: 12px 20px;
        text-decoration: none;
        position: absolute;
        bottom: 25px;
    `;

    [prev, next, close].forEach(button => {
        button.style.cssText = `
            position: absolute;
            background: #222;
            color: white;
            border: none;
            padding: 15px;
            font-size: 22px;
            cursor: pointer;
        `;
    });

    prev.style.left = "20px";
    next.style.right = "20px";
    close.style.right = "20px";
    close.style.top = "20px";

    prev.onclick = () => {
        currentIndex = (currentIndex - 1 + photos.length) % photos.length;
        updateImage();
    };

    next.onclick = () => {
        currentIndex = (currentIndex + 1) % photos.length;
        updateImage();
    };

    close.onclick = () => viewer.remove();

    viewer.append(
        largeImage, prev, next, close, download
    );

    viewer.onclick = event => {
        if (event.target === viewer) viewer.remove();
    };

    updateImage();
    document.body.appendChild(viewer);
});
                photosContainer.appendChild(img);
            });

            button.addEventListener("click", () => {
                photosContainer.hidden = !photosContainer.hidden;
                button.textContent = photosContainer.hidden
                    ? "VIEW PHOTOS"
                    : "HIDE PHOTOS";
            });

            card.append(cover, title, button, photosContainer);
            gallery.appendChild(card);
        }

    } catch (error) {
        gallery.textContent = "Could not load matches.";
        console.error(error);
    }
}

loadMatches();
