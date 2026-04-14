import { getLanguage } from "../js/i18n.js";

const allData = {
  en: {
    bio: [
      "Hello, I’m Htein Lynn Aung, a Software Engineering student at North Chiang Mai University. Currently, I am deeply immersed in the fundamentals of Computer Science and the Software Development Life Cycle (SDLC). I believe that building great software starts with a strong architectural foundation and a clear understanding of the development process. My journey doesn't stop at development. I am highly motivated to expand my expertise into Cloud Engineering and DevOps. I am passionate about bridging the gap between code and infrastructure to build scalable, efficient, and automated systems."
    ],
    skills: [
      { name: "HTML5", icon: "devicon-html5-plain", color: "#E34F26" },
      { name: "CSS", icon: "devicon-css3-plain", color: "#264DE4" },
      { name: "Bootstrap", icon: "devicon-bootstrap-plain", color: "#563D7C" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-original", color: "#06B6D4" },
      { name: "React", icon: "devicon-react-original", color: "#61DAFB" },
      { name: "JavaScript", icon: "devicon-javascript-plain", color: "#F7DF1E" },
      { name: "Java", icon: "devicon-java-plain", color: "#596706" },
      { name: "Spring Boot", icon: "devicon-spring-plain", color: "#6DB33F" },
      { name: "PHP", icon: "devicon-php-plain", color: "#777BB4" },
      { name: "Laravel", icon: "devicon-laravel-original", color: "#FF2D20" },
      { name: "Golang", icon: "devicon-go-original-wordmark", color: "#00ADD8" },
      { name: "Git&GitHub", icon: "devicon-git-plain", color: "#F05032" },
      { name: "MySQL", icon: "devicon-mysql-plain", color: "#00758F" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain", color: "#336791" },
      { name: "MongoDB", icon: "devicon-mongodb-plain", color: "#47A248" },
      { name: "Docker", icon: "devicon-docker-plain", color: "#2496ED" },
      { name: "JLPT-N2", icon: "fa-solid fa-language", color: "#FFD700" }
    ],
    experience: [
      {
        title: "Production Supervisor",
        duration: "December 2019 - July 2023",
        subtitle: "Hana Seimitsu Co.,Ltd. / Yangon, Myanmar",
        details: [
          "Experienced Production Supervisor with over 3 years of expertise at Hana Seimitsu Co., Ltd. Specialize in manufacturing precision molds using advanced automation systems to optimize production efficiency and quality."
        ],
        tags: ["Automation Systems", "AutoCad 2D", "Production Efficiency", "Quality Control"],
        icon: "heartbeat"
      },
      {
        title: "Special Skills Worker-1(Restaurant)",
        duration: "January 2024 - April 2025",
        subtitle: "Ippinko Co.,Ltd. / Yokohama, Japan",
        details: [
          "Experienced Cook with over a year of expertise in Japanese and Chinese cuisine. Beyond culinary skills, I have a solid understanding of restaurant operational systems, ensuring efficient workflow and service quality."
        ],
        tags: ["Japanese Cuisine", "Chinese Cuisine", "Restaurant Operations", "Workflow Optimization"],
        icon: "qrcode"
      }
    ],
    education: [
      {
        title: "Bachelor of Engineering in Software Engineering",
        duration: "June 2025 - May 2028",
        subtitle: "North Chiang Mai University, Thailand",
        details: [
          "I am currently pursuing a Bachelor of Engineering in Software Engineering at North Chiang Mai University. I'm on a fast-track program with three semesters per year, aiming to complete my degree within three consecutive years."
        ],
        tags: ["Computer Science", "Software Engineering", "Computer Architecture & Organization", "Database Management"],
        icon: "graduation-cap"
      },
      {
        title: "Diploma in Electronic Communication Engineering",
        duration: "December 2016 - October 2019",
        subtitle: "Association of Government Technical Institute (AGTI), Myanmar",
        details: [
          "I attended Government Technical College (Wakema) from 2016 to 2019, specializing in Electronic Communication. I successfully completed the course with a credit standing."
        ],
        tags: ["Telecommunication", "Programming & Networking", "Signal Processing", "Circuit Design"],
        icon: "graduation-cap"
      }
    ],
    contactLinks: [
      { label: "Email", link: "mailto:hteinlynnaung.1111@gmail.com", icon: "fa fa-envelope" },
      { label: "LinkedIn", link: "https://www.linkedin.com/in/htein-software-engineer/", icon: "fa-brands fa-linkedin" },
      { label: "GitHub", link: "https://github.com/hteinlynnaung-mrh", icon: "fa-brands fa-github" },
      { label: "Htein's Bakery", link: "https://htein-bakery.vercel.app/", icon: "fa fa-coffee" }
    ],
    footer: [
      {
        label: "Links",
        data: [
          { text: "Buy me a coffee", link: "https://htein-bakery.vercel.app/" },
          { text: "Github", link: "https://github.com/hteinlynnaung-mrh/hteinlynnaung-mrh.github.io" }
        ]
      },
      {
        label: "Pages",
        data: [
          { text: "Admin Dashboard", link: "./pages/admin.html" },
          { text: "Generate JSON data", link: "./pages/json-generator.html" }
        ]
      },
      {
        label: "copyright-text",
        data: ["Built with HTML, CSS, JavaScript, and ♡"]
      }
    ]
  },
  jp: {
    bio: [
      "こんにちは、ノースチェンマイ大学でソフトウェア工学を学んでいる ティン リン アウンです。現在は、コンピュータサイエンスの基礎とソフトウェア開発ライフサイクル（SDLC）に深く没頭しています。優れたソフトウェアの構築は、強力なアーキテクチャの基盤と開発プロセスの明確な理解から始まると信じています。私の旅は開発に留まりません。クラウドエンジニアリングやDevOpsへの専門知識の拡大に非常に意欲的です。コードとインフラストラクチャのギャップを埋め、スケーラブルで効率的、かつ自動化されたシステムを構築することに情熱を注いでいます。"
    ],
    skills: [
      { name: "HTML5", icon: "devicon-html5-plain", color: "#E34F26" },
      { name: "CSS", icon: "devicon-css3-plain", color: "#264DE4" },
      { name: "Bootstrap", icon: "devicon-bootstrap-plain", color: "#563D7C" },
      { name: "Tailwind CSS", icon: "devicon-tailwindcss-original", color: "#06B6D4" },
      { name: "React", icon: "devicon-react-original", color: "#61DAFB" },
      { name: "JavaScript", icon: "devicon-javascript-plain", color: "#F7DF1E" },
      { name: "Java", icon: "devicon-java-plain", color: "#596706" },
      { name: "Spring Boot", icon: "devicon-spring-plain", color: "#6DB33F" },
      { name: "PHP", icon: "devicon-php-plain", color: "#777BB4" },
      { name: "Laravel", icon: "devicon-laravel-original", color: "#FF2D20" },
      { name: "Golang", icon: "devicon-go-original-wordmark", color: "#00ADD8" },
      { name: "Git&GitHub", icon: "devicon-git-plain", color: "#F05032" },
      { name: "MySQL", icon: "devicon-mysql-plain", color: "#00758F" },
      { name: "PostgreSQL", icon: "devicon-postgresql-plain", color: "#336791" },
      { name: "MongoDB", icon: "devicon-mongodb-plain", color: "#47A248" },
      { name: "Docker", icon: "devicon-docker-plain", color: "#2496ED" },
      { name: "JLPT-N2", icon: "fa-solid fa-language", color: "#FFD700" }
    ],
    experience: [
      {
        title: "生産管理スーパーバイザー",
        duration: "2019年12月 - 2023年7月",
        subtitle: "華精密株式会社 / ミャンマー、ヤンゴン",
        details: [
          "華精密株式会社での3年以上の経験を持つ熟練した生産管理スーパーバイザー。高度な自動化システムを使用して精密金型を製造し、生産効率と品質を最適化することを専門としています。"
        ],
        tags: ["自動化システム", "AutoCad 2D", "生産効率", "品質管理"],
        icon: "heartbeat"
      },
      {
        title: "特定技能1号（外食）",
        duration: "2024年1月 - 2025年4月",
        subtitle: "一品香株式会社 / 日本、横浜",
        details: [
          "日本料理と中国料理において1年以上の経験を持つ熟練した調理師。料理のスキルに加えて、レストランの運営システムをしっかりと理解しており、効率的なワークフローとサービスの質を確保しています。"
        ],
        tags: ["日本料理", "中国料理", "レストラン運営", "ワークフローの最適化"],
        icon: "qrcode"
      }
    ],
    education: [
      {
        title: "ソフトウェア工学 工学士",
        duration: "2025年6月 - 2028年5月",
        subtitle: "ノースチェンマイ大学（タイ）",
        details: [
          "現在、ノースチェンマイ大学でソフトウェア工学の工学士号取得を目指しています。1年3学期の特別（ファストトラック）プログラムに参加しており、3年連続での学位取得を目指しています。"
        ],
        tags: ["コンピュータサイエンス", "ソフトウェア工学", "コンピュータ構成と設計", "データベース管理"],
        icon: "graduation-cap"
      },
      {
        title: "電子通信工学ディプロマ",
        duration: "2016年12月 - 2019年10月",
        subtitle: "政府技術研究所（AGTI） / ミャンマー",
        details: [
          "2016年から2019年まで政府技術学院（ワケマ）に通い、電子通信を専攻しました。コースを優秀な成績で修了しました。"
        ],
        tags: ["電気通信", "プログラミングとネットワーキング", "信号処理", "回路設計"],
        icon: "graduation-cap"
      }
    ],
    contactLinks: [
      { label: "メール", link: "mailto:hteinlynnaung.1111@gmail.com", icon: "fa fa-envelope" },
      { label: "LinkedIn", link: "https://www.linkedin.com/in/htein-software-engineer/", icon: "fa-brands fa-linkedin" },
      { label: "GitHub", link: "https://github.com/hteinlynnaung-mrh", icon: "fa-brands fa-github" },
      { label: "Htein's Bakery", link: "https://htein-bakery.vercel.app/", icon: "fa fa-coffee" }
    ],
    footer: [
      {
        label: "リンク",
        data: [
          { text: "コーヒーをおごる", link: "https://htein-bakery.vercel.app/" },
          { text: "Github", link: "https://github.com/hteinlynnaung-mrh/hteinlynnaung-mrh.github.io" }
        ]
      },
      {
        label: "ページ",
        data: [
          { text: "管理者ダッシュボード", link: "./pages/admin.html" },
          { text: "JSONデータの生成", link: "./pages/json-generator.html" }
        ]
      },
      {
        label: "copyright-text",
        data: ["HTML, CSS, JavaScript, そして ♡ で構築"]
      }
    ]
  }
};

const lang = getLanguage();
const data = allData[lang] || allData.en;

export const bio = data.bio;
export const skills = data.skills;
export const experience = data.experience;
export const education = data.education;
export const contactLinks = data.contactLinks;
export const footer = data.footer;
export default data;
