import Link from "next/link";
import Script from "next/script";
import ScrollSpy from "../components/ScrollSpy";
import ScrollReveal from "../components/ScrollReveal";

export default function HomePage() {
  return (
    <>
      <Script id="portfolio-theme-init" strategy="beforeInteractive">
        {`(() => { const stored = localStorage.getItem("portfolio-theme"); const theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); document.documentElement.dataset.theme = theme; })();`}
      </Script>
      <div id="colorlib-page">
        <div className="container-wrap">
          <div className="mobile-nav-bar no-print">
            <a href="#" className="js-colorlib-nav-toggle colorlib-nav-toggle" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" aria-label="Toggle navigation menu"><i /></a>
            <button className="theme-toggle theme-toggle-nav" type="button" data-theme-toggle aria-label="Switch to dark mode"><i className="fa-solid fa-moon" aria-hidden="true" /><span className="theme-toggle-label">Dark mode</span></button>
          </div>
          <aside id="colorlib-aside" role="complementary" className="border js-fullheight no-print">
            <div className="text-center">
              <div className="lang-switcher no-print"><button id="btn-en" className="lang-btn">EN</button><span className="lang-divider">|</span><button id="btn-jp" className="lang-btn">日本語</button></div>
              <button className="theme-toggle theme-toggle-sidebar no-print" type="button" data-theme-toggle aria-label="Switch to dark mode"><i className="fa-solid fa-moon" aria-hidden="true" /><span className="theme-toggle-label">Dark mode</span></button>
              <div className="author-img"><img id="profile-img" src="/images/profile.png" alt="Htein Lynn Aung" /></div>
              <h1 id="colorlib-logo"><Link href="/"><span data-i18n="profile_name">Htein Lynn Aung</span></Link></h1>
            </div>
            <nav id="colorlib-main-menu" role="navigation" className="navbar" style={{ paddingTop: "2em" }}>
              <div id="navbar" className="collapse"><ul>
                <li><a href="#section-about" data-nav-section="about" data-i18n="menu_about">About</a></li>
                <li><a href="#section-skills" data-nav-section="skills" data-i18n="menu_skills">Skills</a></li>
                <li><a href="#section-experience" data-nav-section="experience" data-i18n="menu_experience">Work Experience</a></li>
                <li><a href="#section-education" data-nav-section="education" data-i18n="menu_education">Education</a></li>
                <li><a href="#section-repos" data-nav-section="repos" data-i18n="menu_repos">Top Repositories</a></li>
                <li><a href="#section-blogs" data-nav-section="blogs" data-i18n="menu_blogs">Blogs</a></li>
                <li><a href="#contact" data-nav-section="contact" data-i18n="menu_contact">Contact</a></li>
                <li><Link href="/json-generator">Resume JSON Generator</Link></li>
                <li><Link href="/admin">Admin Dashboard</Link></li>
              </ul></div>
            </nav>
          </aside>
          <main id="colorlib-main">
            <PortfolioSection id="about" title={<span data-i18n="section_about">About Me</span>}><div id="bio" className="about-card" /></PortfolioSection>
            <PortfolioSection id="skills" title={<span data-i18n="section_skills">Skills</span>}><div id="skills" className="skills-list" aria-label="Technology skills" /><div id="technology-skills-globe" className="technology-skills-globe" aria-label="Interactive 3D technology skills globe"><div id="technology-skills-canvas" /><div id="technology-skills-tooltip" className="technology-skills-tooltip" role="tooltip" aria-hidden="true" /></div></PortfolioSection>
            <section className="colorlib-profile" data-section="profile-card"><div className="colorlib-narrow-content"><div className="row row-bottom-padded-sm animate-box" data-animate-effect="fadeInLeft"><div className="profile-cards"><div className="col"><a className="profile-card" href="https://www.linkedin.com/in/htein-software-engineer?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer"><div className="profile-header"><i className="fa-brands fa-linkedin" style={{ fontSize: 40, color: "#0077b5" }} /><div className="profile-info"><div className="profile-badge badge-linkedin">LinkedIn</div><p className="profile-name" data-i18n="profile_name">Htein Lynn Aung</p><p className="profile-username">Software Engineering Student</p></div></div><div style={{ marginTop: 15, textAlign: "center" }}><span className="btn-view-profile">View LinkedIn Profile</span></div></a></div><div className="col"><a className="profile-card" href="https://github.com/hteinlynnaung-mrh" target="_blank" rel="noreferrer"><div className="profile-header"><i className="fa-brands fa-github" style={{ fontSize: 40 }} /><div className="profile-info"><div className="profile-badge badge-github">GitHub</div><p className="profile-name">hteinlynnaung-mrh</p><p className="profile-username">GitHub profile</p></div></div><div style={{ marginTop: 15, textAlign: "center" }}><span className="btn-view-profile">View GitHub Profile</span></div></a></div></div></div></div></section>
            <PortfolioSection id="experience" title={<><span data-i18n="section_experience_title">Work </span><span style={{ color: "#f9bf3f" }} data-i18n="section_experience_subtitle">Experience</span></>}><div id="experience" className="timeline-centered" /></PortfolioSection>
            <PortfolioSection id="education" title={<span data-i18n="section_education">Education</span>}><div id="education" className="timeline-centered" /></PortfolioSection>
            <PortfolioSection id="repos" title={<><span data-i18n="section_repos_title">Top </span><span style={{ color: "#f9bf3f" }} data-i18n="section_repos_subtitle">Repositories</span></>} link="https://github.com/hteinlynnaung-mrh"><ul id="accordion" className="accordion animate-box"><li className="open"><ul id="repos" style={{ display: "block", padding: 0 }} /></li></ul></PortfolioSection>
            <PortfolioSection id="blogs" title={<><span data-i18n="section_blogs_title">Latest </span><span style={{ color: "#f9bf3f" }} data-i18n="section_blogs_subtitle">Blogs</span></>} link="https://freecodecamp.org"><ul id="accordion-blogs" className="accordion animate-box"><li className="open"><ul id="blogs" className="submenu" style={{ display: "flex", flexDirection: "column", gap: 20 }} /></li></ul></PortfolioSection>
            <section className="colorlib-contact" data-section="contact" id="contact"><div className="colorlib-narrow-content aligned-content-shell"><div className="row row-bottom-padded-sm animate-box"><div className="about-desc"><h1 data-i18n="section_contact">Contact</h1></div><p data-i18n="contact_para">Feel free to email me at <strong>hteinlynnaung.1111@gmail.com</strong> for tech discussions, business opportunities, or just to say hello—I’d love to hear from you!</p></div><div id="contact-links" /></div></section>
            <section className="colorlib-footer no-print" data-section="footer"><div className="colorlib-narrow-content aligned-content-shell"><footer className="footer" id="footer" /></div></section>
          </main>
        </div>
      </div>
      <Script src="/js/theme.js" strategy="afterInteractive" type="module" />
      <Script src="/index.js" strategy="afterInteractive" type="module" />
      <Script src="/js/profile-card.js" strategy="afterInteractive" type="module" />
      <Script src="/js/jquery.min.js" strategy="afterInteractive" />
      <Script src="/js/jquery.waypoints.min.js" strategy="afterInteractive" />
      <Script src="/js/main.js" strategy="afterInteractive" />
      <Script src="/js/technology-skills-globe.js" strategy="afterInteractive" type="module" />
      <ScrollSpy />
      <ScrollReveal />
    </>
  );
}

function PortfolioSection({ id, title, children, link }: { id: string; title: React.ReactNode; children: React.ReactNode; link?: string }) {
  return <section className="colorlib-experience" data-section={id} id={`section-${id}`}><div className="colorlib-narrow-content"><div className="row row-bottom-padded-sm animate-box" data-animate-effect="fadeInLeft"><div className="about-desc">{link ? <a href={link} target="_blank" rel="noreferrer" style={{ color: "inherit" }}><h1>{title} <i className="fa fa-external-link" aria-hidden="true" style={{ fontSize: 30 }} /></h1></a> : <h1>{title}</h1>}</div></div>{children}</div></section>;
}
