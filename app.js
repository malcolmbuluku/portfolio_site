// app.js
import { createClient } from "@supabase/supabase-js";

/* --------------------------
   Supabase Initialization
--------------------------- */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("⚠️ Missing Supabase env vars. Did you set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY?");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* --------------------------
   Hero Section Animations
--------------------------- */
window.addEventListener("load", () => {
  ["hero-title", "hero-subtitle", "hero-cta"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("opacity-100", "translate-y-0");
  });
});

/* --------------------------
   Section Scroll Animations
--------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    section.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-700", "ease-out");
    observer.observe(section);
  });
});

/* --------------------------
   Load Projects
--------------------------- */
export async function loadProjects() {
  const { data: projects = [], error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const list = document.getElementById("project-list");
  if (!list) return;
  list.innerHTML = "";

  if (error) {
    list.innerHTML = `<p class="text-red-600">❌ Failed to load projects.</p>`;
    console.error(error);
    return;
  }

  projects.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl hover:scale-105 transition-transform duration-300 dark:bg-gray-800";
    card.innerHTML = `
      ${p.image_url ? `<img src="${p.image_url}" alt="${p.title}" class="rounded-md mb-4 w-full h-48 object-cover">` : ""}
      <h3 class="text-xl font-semibold mb-2">${p.title}</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-2">${p.description || ""}</p>
      <div class="space-x-2">
        ${p.live_url ? `<a href="${p.live_url}" target="_blank" rel="noopener noreferrer" class="text-green-700 dark:text-green-300 font-medium hover:underline">View Live</a>` : ""}
        ${p.github_url ? `<a href="${p.github_url}" target="_blank" rel="noopener noreferrer" class="text-gray-700 dark:text-gray-200 font-medium hover:underline">GitHub</a>` : ""}
      </div>
    `;
    list.appendChild(card);
  });
}

/* --------------------------
   Load Skills
--------------------------- */
export async function loadSkills() {
  const { data: skills = [], error } = await supabase
    .from("skills")
    .select("*")
    .order("level", { ascending: false });

  const list = document.getElementById("skills-list");
  if (!list) return;
  list.innerHTML = "";

  if (error) {
    list.innerHTML = `<p class="text-red-600">❌ Failed to load skills.</p>`;
    console.error(error);
    return;
  }

  skills.forEach(s => {
    const li = document.createElement("li");
    li.className = "bg-green-100 text-green-900 rounded-lg p-4 font-medium shadow hover:bg-green-200 transition dark:bg-gray-700 dark:text-gray-200";
    li.textContent = `${s.name} (${s.level ?? ""}/10)`;
    list.appendChild(li);
  });
}

/* --------------------------
   Load Blogs
--------------------------- */
export async function loadBlogList(limit = 6) {
  const { data: posts = [], error } = await supabase
    .from("blog")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  const list = document.getElementById("blog-list");
  if (!list) return;
  list.innerHTML = "";

  if (error) {
    list.innerHTML = `<p class="text-red-600">❌ Failed to load blog posts.</p>`;
    console.error(error);
    return;
  }

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl hover:scale-105 transition-transform duration-300 dark:bg-gray-800";
    const link = post.url?.trim() ? post.url : `/blog.html?id=${post.id}`;
    const target = post.url?.trim() ? "_blank" : "_self";

    card.innerHTML = `
      ${post.image_url ? `<img src="${post.image_url}" alt="${post.title}" class="rounded-md mb-4 w-full h-40 object-cover">` : ""}
      <h3 class="text-xl font-semibold mb-2">${post.title}</h3>
      <p class="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">${post.excerpt || ""}</p>
      <div class="mt-auto text-right">
        <a href="${link}" target="${target}" rel="noopener noreferrer" class="text-green-700 dark:text-green-300 font-medium hover:underline">Read More →</a>
      </div>
    `;
    list.appendChild(card);
  });
}

/* --------------------------
   Load Testimonials
--------------------------- */
export async function loadTestimonials() {
  const { data: items = [], error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const list = document.getElementById("testimonial-list");
  if (!list) return;
  list.innerHTML = "";

  if (error) {
    list.innerHTML = `<p class="text-red-600">❌ Failed to load testimonials.</p>`;
    console.error(error);
    return;
  }

  items.forEach(t => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl shadow p-4 dark:bg-gray-800";
    card.innerHTML = `
      <p class="text-gray-700 dark:text-gray-200 mb-3">"${t.message}"</p>
      <p class="font-semibold">${t.author}</p>
      <p class="text-sm text-gray-500">${t.role || ""}</p>
    `;
    list.appendChild(card);
  });
}

/* --------------------------
   Contact Form Handler
--------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const responseMsg = document.getElementById("response-message");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !email || !message) {
        responseMsg.textContent = "⚠️ All fields are required.";
        responseMsg.className = "mt-2 font-medium text-yellow-600";
        return;
      }

      // Try serverless endpoint first (Vercel) fallback to Supabase
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message })
        });

        if (res.ok) {
          responseMsg.textContent = "✅ Message sent successfully!";
          responseMsg.className = "mt-2 font-medium text-green-600";
          form.reset();
          return;
        }
      } catch (err) {
        console.warn("Serverless endpoint failed, falling back to Supabase:", err);
      }

      // fallback: insert to Supabase
      const { error } = await supabase.from("messages").insert([{ name, email, message }]);
      if (error) {
        responseMsg.textContent = "❌ Failed to send message. Try again later.";
        responseMsg.className = "mt-2 font-medium text-red-600";
        console.error(error);
      } else {
        responseMsg.textContent = "✅ Message recorded. Thank you!";
        responseMsg.className = "mt-2 font-medium text-green-600";
        form.reset();
      }
    });
  }

  // Load dynamic content
  loadProjects();
  loadSkills();
  loadBlogList();
  loadTestimonials();
});
