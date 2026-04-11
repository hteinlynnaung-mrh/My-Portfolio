import { html, render } from "https://unpkg.com/lit@latest?module";

async function get(url) {
  const resp = await fetch(url);
  return resp.json();
}

function linkedinCardTemplate() {
  const profileUrl = "https://www.linkedin.com/in/htein-software-engineer/";
  return html`
    <div class="profile-card">
      <div class="profile-header">
        <i class="fa-brands fa-linkedin" style="font-size: 40px; color: #0077b5;"></i>
        <div class="profile-info">
          <div class="profile-badge badge-linkedin">LinkedIn</div>
          <p class="profile-name">Htein Lynn Aung</p>
          <p class="profile-username">Software Engineering Student</p>
        </div>
      </div>
      <div style="margin-top: 15px; text-align: center;">
        <a href="${profileUrl}" target="_blank" class="btn-view-profile">View Profile</a>
      </div>
    </div>
  `;
}

function certificateCardTemplate() {
  return html`
    <div class="profile-card">
      <div class="profile-header">
        <i class="fa-solid fa-award" style="font-size: 40px; color: #d4af37;"></i>
        <div class="profile-info">
          <div class="profile-badge badge-certificate">Certificate</div>
          <p class="profile-name" style="font-size: 14px;">ITPEC Fundamental IT Engineer (FE)</p>
          <p class="profile-username">Issue Date: 2024</p>
        </div>
      </div>
    </div>
  `;
}

function githubCardTemplate(user) {
  const { avatar_url, public_repos, followers, html_url, following } = user;

  return html`
    <a href="${html_url}" target="_blank" class="profile-card">
      <div class="profile-header">
        <img class="profile-avatar" src="${avatar_url}" alt="GitHub avatar" />
        <div>
          <div class="profile-badge badge-github">GitHub</div>
          <p class="profile-url">${html_url}</p>
        </div>
      </div>
      <div class="profile-stats">
        ${[
          { label: "REPOSITORIES", value: public_repos },
          { label: "FOLLOWERS", value: followers },
          { label: "FOLLOWING", value: following },
        ].map(
          (stat) => html`
            <div>
              <p class="stat-label">${stat.label}</p>
              <p class="stat-value">${stat.value}</p>
            </div>
          `
        )}
      </div>
    </a>
  `;
}

function leetcodeCardTemplate(data) {
  const { totalSolved, totalQuestions, acceptanceRate, ranking } = data;

  const leetUrl = "https://leetcode.com/vinaysomawat/";

  return html`
    <a href="${leetUrl}" target="_blank" class="profile-card">
      <div class="profile-header">
        <img
          class="profile-avatar"
          src="https://cdn.iconscout.com/icon/free/png-512/free-leetcode-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-vol-4-pack-logos-icons-2944960.png?f=webp&w=512"
          alt="LeetCode avatar"
        />
        <div>
          <div class="profile-badge badge-leetcode">LeetCode</div>
          <p class="profile-url">${leetUrl}</p>
        </div>
      </div>
      <div class="profile-stats">
        ${[
          { label: "SOLVED", value: `${totalSolved}/${totalQuestions}` },
          { label: "RANK", value: `#${ranking}` },
          { label: "ACCEPTANCE", value: `${acceptanceRate}%` },
        ].map(
          (stat) => html`
            <div>
              <p class="stat-label">${stat.label}</p>
              <p class="stat-value">${stat.value}</p>
            </div>
          `
        )}
      </div>
    </a>
  `;
}

window.addEventListener("DOMContentLoaded", async () => {
  document.querySelectorAll(".linkedin-card").forEach((el) => {
    render(linkedinCardTemplate(), el);
  });

  document.querySelectorAll(".certificate-card").forEach((el) => {
    render(certificateCardTemplate(), el);
  });

  document.querySelectorAll(".github-card").forEach(async (el) => {
    const username = el.getAttribute("username");
    const data = await get(`https://api.github.com/users/${username}`);
    render(githubCardTemplate(data), el);
  });

  document.querySelectorAll(".leetcode-card").forEach(async (el) => {
    const username = el.getAttribute("username");
    const data = await get(
      `https://leetcode-stats-api.herokuapp.com/${username}`
    );
    render(leetcodeCardTemplate(data), el);
  });
});
