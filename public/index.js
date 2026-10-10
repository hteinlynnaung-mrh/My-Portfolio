import {
  bio,
  skills,
  education,
  experience,
  footer,
  contactLinks,
} from "./user-data/data.js";
import { html, render } from "https://unpkg.com/lit-html?module";
import { t, applyTranslations, setLanguage } from "./js/i18n.js";

import { URLs } from "./user-data/urls.js";

const { medium, gitConnected, gitRepo } = URLs;

async function fetchBlogsFromMedium(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      populateBlogs([], "blogs");
      return;
    }

    const payload = await response.json();
    const items = Array.isArray(payload?.items) ? payload.items : [];
    populateBlogs(items, "blogs");
  } catch (error) {
    console.warn("Medium blog data is unavailable.", error);
    populateBlogs([], "blogs");
  }
}

async function fetchReposFromGit(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return;

    const payload = await response.json();
    const items = Array.isArray(payload) ? payload : [];
    populateRepo(items, "repos");
  } catch (error) {
    console.warn("GitHub repository data is unavailable.", error);
  }
}

async function fetchGitConnectedData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) return;

    const payload = await response.json();
    if (payload?.basics) mapBasicResponse(payload.basics);
  } catch (error) {
    console.warn("GitConnected profile data is unavailable.", error);
  }
}

function mapBasicResponse(basics) {
  const {
    name,
    label,
    image,
    email,
    phone,
    url,
    summary,
    profiles,
    headline,
    blog,
    yearsOfExperience,
    username,
    locationAsString,
    region,
    karma,
    id,
    followers,
    following,
    picture,
    website,
  } = basics;

  window.parent.document.title = name;
}

function populateBio(items, id) {
  const bioTag = document.getElementById(id);
  const bioTemplate = html` ${items.map((bioItem) => html`<p>${bioItem}</p>`)}`;
  render(bioTemplate, bioTag);
}

function populateSkills(items, id) {
  const skillsTag = document.getElementById(id);

  if (!skillsTag) return;

  const categories = [
    {
      title: "skill_group_programming",
      names: ["HTML5", "CSS", "JavaScript", "Java", "PHP", "Golang", "Python"],
    },
    {
      title: "skill_group_frameworks",
      names: [
        "Bootstrap",
        "Tailwind CSS",
        "React",
        "React Native",
        "Next.js",
        "Express.js",
        "Spring Boot",
        "Laravel",
      ],
    },
    {
      title: "skill_group_databases",
      names: ["MySQL", "PostgreSQL", "MongoDB"],
    },
    {
      title: "skill_group_tools",
      names: ["Git&GitHub", "Docker"],
    },
    { title: "skill_group_language", names: ["JLPT-N2"] },
  ];

  const groupedSkills = categories
    .map((category) => ({
      ...category,
      skills: category.names
        .map((name) => items.find((item) => item.name === name))
        .filter(Boolean),
    }))
    .filter((category) => category.skills.length);

  const skillsTemplate = html`
    <div class="skills-groups">
      ${groupedSkills.map(
        (group) => html`
          <div class="skill-group">
            <h3 class="skill-group-title">${t(group.title)}</h3>
            <div class="skill-chips">
              ${group.skills.map(
                (item) => html`
                  <span
                    class="skill-chip"
                    style="--skill-color: ${item.color}; --skill-foreground: ${
                      ["#F7DF1E", "#FFD700"].includes(item.color)
                        ? "#1d1d1d"
                        : "#fff"
                    }"
                  >
                    <i class="${item.icon} colored skill-icon" aria-hidden="true"></i>
                    <span>${item.name}</span>
                  </span>
                `
              )}
            </div>
          </div>
        `
      )}
    </div>
  `;
  render(skillsTemplate, skillsTag);
}

function populateBlogs(items, id) {
  const projectdesign = document.getElementById(id);
  if (!projectdesign) return;

  const accordion = projectdesign.closest(".accordion");
  const safeItems = Array.isArray(items) ? items : [];
  accordion?.classList.toggle("blogs-empty", safeItems.length === 0);

  if (safeItems.length === 0) {
    projectdesign.replaceChildren();
    return;
  }

  const createCategoryBadges = (categories) => html`
    <div class="categories-div">
      ${categories.map(
        (category) => html` <div class="profile-badge brown-badge">${category}</div> `
      )}
    </div>
  `;

  const blogTemplate = html`
    ${safeItems.slice(0, 3).map(
      (item) => html`
        <div class="blog-card">
          <div class="blog-content">
            <a href="${item.link}" target="_blank" class="blog-link">
              <p class="blog-heading">${item.title}</p>
              <p class="publish-date">${getBlogDate(item.pubDate)}</p>
              <p class="blog-description">
                ${item.content.replace(/<[^>]*>/g, '').trim()}
              </p>
              ${createCategoryBadges(item.categories)}
            </a>
          </div>
        </div>
      `
    )}
  `;

  render(blogTemplate, projectdesign);
}

function populateRepo(items, id) {
  const projectdesign = document.getElementById(id);
  if (!projectdesign || !items?.length) return;

  const statsTemplate = (item) => html`
    <div class="stats-row">
      <div class="language-div">
        <span class="language-dot"></span>
        ${item.language}
      </div>
      <div class="stats-div">
        <img
          src="https://img.icons8.com/ios-filled/16/666666/star--v1.png"
          alt="Stars"
        />
        ${item.stars}
      </div>
      <div class="stats-div">
        <img
          src="https://img.icons8.com/ios-filled/16/666666/code-fork.png"
          alt="Forks"
        />
        ${item.forks}
      </div>
    </div>
  `;

  const repoTemplate = html`
    <div class="repo-wrapper">
      ${items.slice(0, 4).map(
        (item) => html`
          <div class="repo-card">
            <a
              href="https://github.com/${item.author}/${item.name}"
              target="_blank"
              class="repo-link"
            >
              <p class="repo-heading">${item.name}</p>
              <p class="repo-description">${item.description}</p>
              ${statsTemplate(item)}
            </a>
          </div>
        `
      )}
    </div>
  `;

  render(repoTemplate, projectdesign);
}

function populateExp_Edu(items, id) {
  const mainContainer = document.getElementById(id);
  if (!mainContainer || !items?.length) return;

  const detailsTemplate = (details) => html`
    ${details.map(
      (detail) => html` <p class="timeline-text">&blacksquare; ${detail}</p> `
    )}
  `;

  const tagsTemplate = (tags) => html`
    <div class="tags-container">
      ${tags.map((tag) => html`<div class="profile-badge brown-badge">${tag}</div>`)}
    </div>
  `;

  const timelineTemplate = html`
    ${items.map(
      (item) => html`
        <article class="timeline-entry animate-box">
          <div class="timeline-entry-inner">
            <div class="timeline-icon color-2">
              <i class="fa fa-${item.icon}"></i>
            </div>
            <div class="timeline-label">
              <div class="exp-heading">
                <p class="blog-heading">${item.title}</p>
                <span class="publish-date">${item.duration}</span>
              </div>
              <span class="timeline-sublabel">${item.subtitle}</span>
              ${detailsTemplate(item.details)} ${tagsTemplate(item.tags)}
            </div>
          </div>
        </article>
      `
    )}
    <article class="timeline-entry begin animate-box">
      <div class="timeline-entry-inner">
        <div class="timeline-icon color-2"></div>
      </div>
    </article>
  `;

  render(timelineTemplate, mainContainer);
}

function populateLinks(items, id) {
  const footer = document.getElementById(id);
  if (!footer || !items?.length) return;

  const linkTemplate = (data) => html`
    <li>
      <a
        href="${data.link || "#"}"
        @click="${data.func || null}"
      >
        ${data.text}
      </a>
    </li>
  `;

  const columnTemplate = (item) => html`
    <span class="col">
      <p class="col-title">${item.label}</p>
      <nav class="col-list">
        <ul>
          ${item.data.map((data) => linkTemplate(data))}
        </ul>
      </nav>
    </span>
  `;

  const copyrightTemplate = (item) => html`
    <div class="copyright-text no-print">
      ${item.data.map((copyright) => html`<p>${copyright}</p>`)}
    </div>
  `;

  const footerTemplate = html`
    ${items.map(
      (item) => html`
        ${item.label === "copyright-text"
          ? copyrightTemplate(item)
          : columnTemplate(item)}
      `
    )}
  `;

  render(footerTemplate, footer);
}

function populateContactLinks(items, id) {
  const contactLinks = document.getElementById(id);
  if (!contactLinks || !items?.length) return;
  const contactLinkTemplate = (item) => html`
    <li class="profile-card" style="padding: 6px 12px">
      <a href="${item.link}" target="_blank" class="contact-link">
        <i class="${item.icon}"></i>
        <span class="contact-label">${item.label}</span>
      </a>
    </li>
  `;
  const contactLinksTemplate = html`
    <ul class="contact-links-list">
      ${items.map((item) => contactLinkTemplate(item))}
    </ul>
  `;
  render(contactLinksTemplate, contactLinks);
}

function getElement(tagName, className) {
  let item = document.createElement(tagName);
  item.className = className;
  return item;
}

function getBlogDate(publishDate) {
  const elapsed = Date.now() - Date.parse(publishDate);

  // Time conversions in milliseconds
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  if (elapsed < msPerMinute) {
    const seconds = Math.floor(elapsed / msPerSecond);
    return t("time_seconds_ago");
  } else if (elapsed < msPerHour) {
    const minutes = Math.floor(elapsed / msPerMinute);
    return `${minutes} ${t("time_minutes_ago")}`;
  } else if (elapsed < msPerDay) {
    const hours = Math.floor(elapsed / msPerHour);
    return `${hours} ${t("time_hours_ago")}`;
  } else if (elapsed < msPerMonth) {
    const days = Math.floor(elapsed / msPerDay);
    return days == 1 ? t("time_day_ago") : `${days} ${t("time_days_ago")}`;
  } else if (elapsed < msPerYear) {
    const months = Math.floor(elapsed / msPerMonth);
    return months == 1
      ? t("time_month_ago")
      : `${months} ${t("time_months_ago")}`;
  } else {
    const years = Math.floor(elapsed / msPerYear);
    return years == 1 ? t("time_year_ago") : `${years} ${t("time_years_ago")}`;
  }
}

populateBio(bio, "bio");

populateSkills(skills, "skills");

fetchBlogsFromMedium(medium);
fetchReposFromGit(gitRepo);
fetchGitConnectedData(gitConnected);

populateExp_Edu(experience, "experience");
populateExp_Edu(education, "education");

populateLinks(footer, "footer");
populateContactLinks(contactLinks, "contact-links");

document
  .getElementById("btn-en")
  ?.addEventListener("click", () => setLanguage("en"));
document
  .getElementById("btn-jp")
  ?.addEventListener("click", () => setLanguage("jp"));



applyTranslations();
