const translations = {
  en: {
    menu_about: "About",
    menu_skills: "Skills",
    menu_experience: "Work Experience",
    menu_education: "Education",
    menu_repos: "Top Repositories",
    menu_blogs: "Blogs",
    menu_contact: "Contact",
    section_about: "About Me",
    section_skills: "Skills",
    section_experience_title: "Work ",
    section_experience_subtitle: "Experience",
    section_education: "Education",
    section_repos_title: "Top ",
    section_repos_subtitle: "Repositories",
    section_blogs_title: "Latest ",
    section_blogs_subtitle: "Blogs",
    section_contact: "Contact",
    contact_para: "Feel free to email me at <strong>hteinlynnaung.1111@gmail.com</strong> for tech discussions, business opportunities, or just to say hello—I’d love to hear from you!",
    visitor_label: "Total Visitors",
    visitor_loading: "Loading...",
    footer_links: "Links",
    footer_pages: "Pages",
    btn_view_profile: "View Profile",
    badge_certificate: "Certificate",
    badge_linkedin: "LinkedIn",
    badge_github: "GitHub",
    badge_leetcode: "LeetCode",
    issue_date: "Issue Date",
    github_stats_repos: "REPOSITORIES",
    github_stats_followers: "FOLLOWERS",
    github_stats_following: "FOLLOWING",
    leetcode_stats_solved: "SOLVED",
    leetcode_stats_rank: "RANK",
    leetcode_stats_acceptance: "ACCEPTANCE",
    time_seconds_ago: "seconds ago",
    time_minutes_ago: "minutes ago",
    time_hours_ago: "hours ago",
    time_day_ago: "1 day ago",
    time_days_ago: "days ago",
    time_month_ago: "1 month ago",
    time_months_ago: "months ago",
    time_year_ago: "1 year ago",
    time_years_ago: "years ago",
    lang_en: "English",
    lang_jp: "Japanese"
  },
  jp: {
    menu_about: "私について",
    menu_skills: "スキル",
    menu_experience: "職務経歴",
    menu_education: "学歴",
    menu_repos: "主要リポジトリ",
    menu_blogs: "ブログ",
    menu_contact: "連絡先",
    section_about: "自己紹介",
    section_skills: "スキル",
    section_experience_title: "職務",
    section_experience_subtitle: "経歴",
    section_education: "教育",
    section_repos_title: "主要",
    section_repos_subtitle: "リポジトリ",
    section_blogs_title: "最新",
    section_blogs_subtitle: "ブログ",
    section_contact: "連絡先",
    contact_para: "技術的な議論、ビジネスの機会、または単なる挨拶など、お気軽に <strong>hteinlynnaung.1111@gmail.com</strong> までメールをお送りください。ご連絡をお待ちしております！",
    visitor_label: "総訪問者数",
    visitor_loading: "読み込み中...",
    footer_links: "リンク",
    footer_pages: "ページ",
    btn_view_profile: "プロフィールを見る",
    badge_certificate: "資格",
    badge_linkedin: "LinkedIn",
    badge_github: "GitHub",
    badge_leetcode: "LeetCode",
    issue_date: "発行日",
    github_stats_repos: "リポジトリ",
    github_stats_followers: "フォロワー",
    github_stats_following: "フォロー中",
    leetcode_stats_solved: "解決済み",
    leetcode_stats_rank: "ランク",
    leetcode_stats_acceptance: "正解率",
    time_seconds_ago: "ちょうど今",
    time_minutes_ago: "分前",
    time_hours_ago: "時間前",
    time_day_ago: "1 日前",
    time_days_ago: "日前",
    time_month_ago: "1 ヶ月前",
    time_months_ago: "ヶ月前",
    time_year_ago: "1 年前",
    time_years_ago: "年前",
    lang_en: "English",
    lang_jp: "日本語"
  }
};

let currentLanguage = localStorage.getItem('lang') || 'en';

export function getLanguage() {
  return currentLanguage;
}

export function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('lang', lang);
  window.location.reload(); // Simplest way to re-render everything
}

export function t(key) {
  return translations[currentLanguage][key] || key;
}

export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerHTML = t(key);
  });
}
