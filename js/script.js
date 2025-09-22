// ========== script.js (REPLACEMENT) ==========
'use strict';

// ========== ELEMENTS ==========
const gallery = document.getElementById("gallery");
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const closePopup = document.getElementById("closePopup");
const popupPrev = document.getElementById("popupPrev");
const popupNext = document.getElementById("popupNext");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const pageNumbers = document.getElementById("page-numbers");

const downloadPopup = document.getElementById("downloadPopup");
const closeDownloadPopup = document.getElementById("closeDownloadPopup");
const saveDeviceBtn = document.getElementById("saveDevice");

const toolbarDownloadBtn = document.querySelector(".download"); // zip all button

// ========== STATE ==========
let images = [];
let currentPage = 1;
let perPage = 8;
let currentIndex = 0;

let maxImages = 150;
let loaded = 0;
let selectedFile = null; // untuk download popup

// ========== LOAD IMAGES ==========
images = new Array(maxImages);

for (let i = 1; i <= maxImages; i++) {
  const thumbPath = `images/thumbnail/${i}.jpg`;
  const fullPath = `images/full/${i}.jpg`;

  const img = new Image();
  img.src = thumbPath;

  img.onload = () => {
    images[i - 1] = { thumb: thumbPath, full: fullPath };
    loaded++;
    if (loaded === maxImages) {
      images = images.filter(Boolean);
      renderGallery();
    }
  };

  img.onerror = () => {
    loaded++;
    if (loaded === maxImages) {
      images = images.filter(Boolean);
      renderGallery();
    }
    console.log(`Foto ${i} tidak ditemukan, dilewati.`);
  };
}

// ========== RENDER GALLERY ==========
function renderGallery() {
  gallery.innerHTML = "";
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const items = images.slice(start, end);

  items.forEach((imgObj, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "thumbnail-wrapper";

    const img = document.createElement("img");
    img.src = imgObj.thumb;
    img.alt = `Photo ${start + i + 1}`;
    img.dataset.full = imgObj.full;

    const overlay = document.createElement("div");
    overlay.className = "thumbnail-overlay";

    const dlBtn = document.createElement("button");
    dlBtn.className = "thumb-btn download";
    dlBtn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down"></i>`;

    overlay.appendChild(dlBtn);
    wrapper.appendChild(img);
    wrapper.appendChild(overlay);
    gallery.appendChild(wrapper);

    // klik image -> buka popup gallery
    img.addEventListener("click", () => {
      const globalIndex = start + i;
      openPopup(globalIndex);
    });

    // klik tombol download
    dlBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const fileName = imgObj.full.split("/").pop();
      openDownloadPopup(fileName);
    });
  });

  renderPagination();
}

// ========== PAGINATION ==========
function renderPagination() {
  pageNumbers.innerHTML = "";
  const totalPages = Math.ceil(images.length / perPage);

  // responsive: 5 angka di HP, 7 di layar besar
  const maxVisible = window.innerWidth <= 600 ? 5 : 7;

  let pages = [];

  if (totalPages <= maxVisible) {
    // kalau halaman sedikit, tampil semua
    for (let p = 1; p <= totalPages; p++) pages.push(p);
  } else {
    if (currentPage <= Math.floor(maxVisible / 2)) {
      // dekat awal
      let end = maxVisible - 2; // sisakan tempat buat ... & last
      for (let p = 1; p <= end; p++) pages.push(p);
      pages.push("...", totalPages);
    } else if (currentPage >= totalPages - Math.floor(maxVisible / 2)) {
      // dekat akhir
      pages.push(1, "...");
      let start = totalPages - (maxVisible - 2);
      for (let p = start; p <= totalPages; p++) pages.push(p);
    } else {
      // di tengah
      pages.push(1, "...");
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      pages.push("...", totalPages);
    }
  }

  pages.forEach(p => {
    if (p === "...") {
      const span = document.createElement("span");
      span.textContent = "...";
      span.className = "ellipsis";
      pageNumbers.appendChild(span);
    } else {
      const btn = document.createElement("button");
      btn.textContent = p;
      if (p === currentPage) btn.classList.add("active");
      btn.addEventListener("click", () => {
        currentPage = p;
        renderGallery();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      pageNumbers.appendChild(btn);
    }
  });

  // Update tombol prev/next luar
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}



if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderGallery();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(images.length / perPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderGallery();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

// ========== POPUP IMAGE ==========
function openPopup(index) {
  currentIndex = index;
  popup.style.display = "flex";
  setTimeout(() => popup.classList.add("show"), 10);
  showImage(currentIndex);
}
function showImage(index) {
  if (!images[index]) return;
  popupImg.src = images[index].full;

  const popupFilename = document.getElementById("popupFilename");
  if (popupFilename) {
    const fileName = images[index].full.split("/").pop();
    popupFilename.textContent = fileName;
  }
}

function closePopupFn() {
  popup.classList.remove("show");
  setTimeout(() => (popup.style.display = "none"), 300);
}
closePopup.addEventListener("click", closePopupFn);

popupPrev.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
});
popupNext.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
});
popup.addEventListener("click", (e) => {
  if (e.target === popup) closePopupFn();
});

document.addEventListener("keydown", (e) => {
  if (!popup.classList.contains("show")) return;
  if (e.key === "ArrowLeft") popupPrev.click();
  if (e.key === "ArrowRight") popupNext.click();
  if (e.key === "Escape") closePopupFn();
});

// ========== HAMBURGER ==========
const hamburger = document.querySelector(".hamburger");
const toolbar = document.querySelector(".toolbar");
hamburger && hamburger.addEventListener("click", () => toolbar.classList.toggle("active"));

// ========== DYNAMIC HEADER HEIGHT ==========
document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".header");
  if (header) {
    document.documentElement.style.setProperty("--header-height", header.offsetHeight + "px");
  }
});

// ========== DOWNLOAD ALL (toolbar) ==========
if (toolbarDownloadBtn) {
  toolbarDownloadBtn.addEventListener("click", async () => {
    const zip = new JSZip();
    const folder = zip.folder("photo_gallery");
    let count = 0;
    for (let i = 1; i <= maxImages; i++) {
      const filePath = `images/real/${i}.jpg`;
      try {
        const response = await fetch(filePath);
        if (!response.ok) continue;
        const blob = await response.blob();
        folder.file(`${i}.jpg`, blob);
        count++;
      } catch (err) {
        console.warn("fetch error", err);
      }
    }
    if (count > 0) {
      zip.generateAsync({ type: "blob" }).then(content => saveAs(content, "photo_gallery.zip"));
    } else {
      alert("Tidak ada foto yang berhasil diunduh.");
    }
  });
}

// ========== DOWNLOAD POPUP ==========
function openDownloadPopup(fileName) {
  selectedFile = fileName;

  const pref = getPreference();
  if (pref === "device") {
    saveToDevice(selectedFile);
    return;
  }

  if (downloadPopup) {
    downloadPopup.style.display = "flex";
  }
}

async function saveToDevice(file) {
  if (!file) return;
  const realPath = `images/real/${file}`;
  try {
    const resp = await fetch(realPath);
    if (!resp.ok) {
      alert("File tidak ditemukan.");
      return;
    }
    const blob = await resp.blob();
    saveAs(blob, file);
    savePreference("device");
  } catch (err) {
    console.error(err);
    alert("Gagal mengunduh foto.");
  }
  downloadPopup.style.display = "none";
  selectedFile = null;
}

// ========== REMEMBER MY CHOICE ==========
const rememberCheckbox = document.getElementById("rememberChoice");

function savePreference(choice) {
  if (rememberCheckbox && rememberCheckbox.checked) {
    localStorage.setItem("downloadPreference", choice);
  }
}
function getPreference() {
  return localStorage.getItem("downloadPreference");
}
function clearPreference() {
  localStorage.removeItem("downloadPreference");
}

// ========== CLOSE DOWNLOAD POPUP ==========
if (saveDeviceBtn) {
  saveDeviceBtn.addEventListener("click", () => saveToDevice(selectedFile));
}
if (closeDownloadPopup) {
  closeDownloadPopup.addEventListener("click", () => {
    downloadPopup.style.display = "none";
    selectedFile = null;
  });
}
if (downloadPopup) {
  downloadPopup.addEventListener("click", (e) => {
    if (e.target === downloadPopup) {
      downloadPopup.style.display = "none";
      selectedFile = null;
    }
  });
}

// ========== SLIDESHOW ==========
const slideshowBtn = document.querySelector(".slideshow");
const slideshowCloseBtn = document.getElementById("slideshowClose");

let slideshowInterval = null;

// Fungsi mulai slideshow
function startSlideshow() {
  if (!images || images.length === 0) return;

  currentIndex = 0; // mulai dari foto pertama
  popup.style.display = "flex";
  setTimeout(() => popup.classList.add("show"), 10); // aktifkan animasi

  showImage(currentIndex); // tampilkan foto pertama

  // tampilkan tombol close slideshow
  slideshowCloseBtn.style.display = "flex";

  slideshowInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex); // pakai fungsi showImage biar konsisten
  }, 3000); // ganti gambar tiap 3 detik
}

// Fungsi berhenti slideshow
function stopSlideshow() {
  clearInterval(slideshowInterval);
  slideshowInterval = null;
  slideshowCloseBtn.style.display = "none";

  popup.classList.remove("show");
  setTimeout(() => (popup.style.display = "none"), 300);
}

// Klik tombol slideshow di toolbar
slideshowBtn.addEventListener("click", () => {
  startSlideshow();
});

// Klik tombol close slideshow (× di pojok kanan)
slideshowCloseBtn.addEventListener("click", () => {
  stopSlideshow();
  popup.style.display = "none";
  popup.setAttribute("aria-hidden", "true");
});


