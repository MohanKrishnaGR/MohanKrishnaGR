// Theme Toggle
function toggleTheme() {
  document.documentElement.setAttribute(
    "data-theme",
    document.documentElement.getAttribute("data-theme") === "light"
      ? "dark"
      : "light"
  );
  localStorage.setItem(
    "theme",
    document.documentElement.getAttribute("data-theme")
  );
}

// Set initial theme
const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);

// Background Music
const audio = document.getElementById("bg-music");
function toggleMusic() {
  audio.paused ? audio.play() : audio.pause();
}

async function fetchMediumBlogs() {
    const container = document.getElementById("blog-container");
  
    try {
      const response = await fetch(
        "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@mohankrishnagr08"
      );
      const data = await response.json();
  
      if (!data.items || data.items.length === 0) {
        throw new Error("No blog posts found");
      }
  
      container.innerHTML = ""; // Clear loading state
  
      data.items.slice(0, 4).forEach((post) => {
        const card = document.createElement("div");
        card.className = "blog-card glass-card";
        card.dataset.aos = "zoom-in";
  
        // Extract and resize image
        const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
        let imageUrl = imgMatch ? imgMatch[1] : "placeholder-image.jpg";
        
        // Resize Medium images to 400px width
        if (imageUrl.includes('cdn-images-1.medium.com')) {
          imageUrl = imageUrl.split('?')[0] + '?w=400';
        }
  
        // Format date
        const postDate = new Date(post.pubDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  
        card.innerHTML = `
          <div class="blog-image" style="background-image: url(${imageUrl})"></div>
          <div class="blog-content">
              <div class="blog-date">${postDate}</div>
              <h3>${post.title}</h3>
              <div class="blog-tags">
                  ${post.categories
                    .slice(0, 3)
                    .map(
                      (cat) =>
                        `<span class="blog-tag">${cat}</span>`
                    )
                    .join("")}
              </div>
              <p>${truncateText(
                removeHtmlTags(post.description),
                120
              )}</p>
              <a href="${
                post.link
              }" class="download-btn" target="_blank">
                  Read Article <i class="fas fa-external-link-alt"></i>
              </a>
          </div>
        `;
  
        container.appendChild(card);
      });
  
      // Initialize animations for new elements
      AOS.refresh();
    } catch (error) {
      console.error("Error fetching blogs:", error);
      container.innerHTML = `
        <div class="blog-error glass-card">
            <i class="fas fa-exclamation-triangle fa-2x"></i>
            <h3>Unable to load blog posts</h3>
            <p>Please visit my <a href="https://medium.com/@mohankrishnagr08" target="_blank">Medium profile</a></p>
        </div>
      `;
    }
  }

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
}

function removeHtmlTags(text) {
  return text.replace(/<[^>]+>/g, "");
}

// Call this in your existing initialization code
fetchMediumBlogs();
AOS.init({
  duration: 1000,
  once: true,
  easing: "ease-in-out",
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Parallax effect
document.addEventListener("mousemove", (e) => {
  const blobs = document.querySelectorAll(".blob");
  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  blobs.forEach((blob, index) => {
    const speed = index === 0 ? 0.02 : 0.03;
    blob.style.transform = `translate(${x * 50 * speed}px, ${
      y * 50 * speed
    }px)`;
  });
});
