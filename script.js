const gallery = document.getElementById("gallery");

const photos = [
  "Match 1.jpg",
  "Match 2.jpg",
  "Match 3.jpg",
  "Match 4.jpg",
  "Match 5.jpg",
  "Match 6.jpg",
  "Match 7.jpg",
  "Match 8.jpg",
  "Match 9.jpg",
  "Match 11.jpg",
  "Match 13.jpg"
];

if (gallery) {
  photos.forEach((photo) => {
    const img = document.createElement("img");

    img.src = "images/" + encodeURIComponent(photo);
    img.alt = "N14 Football Photography";
    img.loading = "lazy";

    gallery.appendChild(img);
  });
}
