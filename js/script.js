let currentProject = null;

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return; 

  window.addEventListener('scroll', () => {
    btn.classList.toggle('hidden', window.scrollY < 200);
  });

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  loadProjects()
});


function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function loadProjects() {
  const res = await fetch('./projects.json');
  const data = await res.json();
  const projects = data.projects;

  const projectList = document.getElementById("project-list");
  projectList.innerHTML = projects.map((proj) =>
    `<li class="cursor-pointer p-2 rounded hover:bg-gray-100" onclick="showProject('${proj.id}')">
       ${proj.title}
     </li>`
  ).join("");

  window.projectsData = projects;
}

function showProject(id) {
  const proj = window.projectsData.find(p => p.id === id);
  if (!proj) return;

  // Génère le HTML des slides
  const imageSlides = (proj.images && proj.images.length > 0 ? proj.images : ["./assets/images/wip.png"])
    .map((img) => `
      <div class="absolute inset-0 flex items-center justify-center transition-opacity duration-700 opacity-0" data-slide>
        <img src="${img}" class="max-h-full max-w-full object-contain rounded-lg bg-neutral-100" alt="${proj.title}">
      </div>
    `).join("");



  // Badge "Terminé" ou "En cours"
  const statusBadge = proj.finished
    ? `<span class="inline-block bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">Terminé</span>`
    : `<span class="inline-block bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full">En cours</span>`;

  document.getElementById("project-details").innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold">${proj.title}</h2>
      ${statusBadge}
    </div>

    <div id="custom-carousel" class="relative w-full mb-4 overflow-hidden">
      <div class="relative h-64 md:h-96">
        ${imageSlides}
      </div>
      <button type="button" id="prevBtn" class="absolute top-1/2 left-4 -translate-y-1/2 bg-black/40 text-white rounded-full p-2">❮</button>
      <button type="button" id="nextBtn" class="absolute top-1/2 right-4 -translate-y-1/2 bg-black/40 text-white rounded-full p-2">❯</button>
    </div>

    <p class="text-gray-700 mb-4">${proj.description}</p>
    <h3 class="text-lg font-semibold mb-2">Compétences :</h3>
    <ul class="flex gap-2 flex-wrap">
      ${proj.skills.map(skill => `<li class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">${skill}</li>`).join("")}
    </ul>
  `;

  initCustomCarousel("custom-carousel", 4000);
}


function initCustomCarousel(carouselId, interval = 3000) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;

  const slides = carousel.querySelectorAll("[data-slide]");
  const prevBtn = carousel.querySelector("#prevBtn");
  const nextBtn = carousel.querySelector("#nextBtn");

  let current = 0;
  let timer;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("opacity-100", i === index);
      slide.classList.toggle("opacity-0", i !== index);
    });
    current = index;
  }

  function nextSlide() {
    showSlide((current + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((current - 1 + slides.length) % slides.length);
  }

  nextBtn.addEventListener("click", () => { nextSlide(); resetTimer(); });
  prevBtn.addEventListener("click", () => { prevSlide(); resetTimer(); });

  function startTimer() { timer = setInterval(nextSlide, interval); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  showSlide(0);
  startTimer();
}