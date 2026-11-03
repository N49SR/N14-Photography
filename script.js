
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
            .sort((a, b) => a.name.localeCompare(b.name, undefined, {
                numeric: true
            }));

        gallery.innerHTML = "";

        for (const match of matches) {
            const card = document.createElement("div");
            card.className = "match-card";

            const title = document.createElement("h3");
            title.textContent = match.name.replace(/-/g, " ").toUpperCase();

            const button = document.createElement("button");
            button.textContent = "VIEW PHOTOS";

            const photosContainer = document.createElement("div");
            photosContainer.className = "match-photos";
            photosContainer.hidden = true;

            button.addEventListener("click", async () => {
                if (photosContainer.hidden) {
                    if (!photosContainer.dataset.loaded) {
                        const photoResponse = await fetch(match.url);
                        const photoFiles = await photoResponse.json();

                        photoFiles
                            .filter(file =>
                                file.type === "file" &&
                                /\.(jpg|jpeg|png|webp)$/i.test(file.name)
                            )
                            .sort((a, b) => a.name.localeCompare(
                                b.name, undefined, { numeric: true }
                            ))
                            .forEach(photo => {
                                const img = document.createElement("img");
                                img.src = photo.download_url;
                                img.alt = title.textContent;
                                img.loading = "lazy";
                                photosContainer.appendChild(img);
                            });

                        photosContainer.dataset.loaded = "true";
                    }

                    photosContainer.hidden = false;
                    button.textContent = "HIDE PHOTOS";
                } else {
                    photosContainer.hidden = true;
                    button.textContent = "VIEW PHOTOS";
                }
            });

            card.append(title, button, photosContainer);
            gallery.appendChild(card);
        }

        if (matches.length === 0) {
            gallery.textContent = "No matches available yet.";
        }

    } catch (error) {
        gallery.textContent = "Could not load matches.";
        console.error(error);
    }
}

loadMatches();
