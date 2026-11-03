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
            cover.src = photos[0].download_url;
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
                img.src = photo.download_url;
                img.alt = match.name;
                img.loading = "lazy";
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
