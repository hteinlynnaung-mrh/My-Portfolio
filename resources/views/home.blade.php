<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>Htein Lynn Aung | Portfolio</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="Portfolio webpage of Htein Lynn Aung" />
    <meta
      name="keywords"
      content="portfolio,website,personal website,github,projects,computer science and engineering"
    />
    <meta name="author" content="Htein Lynn Aung" />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
    />
    <link rel="icon" type="image/png" href="{{ asset('logo.png') }}" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat|Open+Sans|Raleway&display=swap"
      rel="stylesheet"
    />
    <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    />
    <link rel="stylesheet" href="{{ asset('css/animate.css') }}" />
    <link rel="stylesheet" href="{{ asset('css/style.css') }}" />
    <link
      rel="stylesheet"
      href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
    />

    <script src="{{ asset('js/modernizr-2.6.2.min.js') }}"></script>
    <script>
      (() => {
        const stored = localStorage.getItem("portfolio-theme");
        const theme = stored || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        document.documentElement.dataset.theme = theme;
      })();
    </script>
    <script type="module" src="{{ asset('index.js') }}"></script>
    <script type="module" src="{{ asset('js/profile-card.js') }}"></script>
    <script type="module" src="{{ asset('js/theme.js') }}"></script>
  </head>
  <body>
    <div id="colorlib-page">
      <div class="container-wrap">
        <div class="mobile-nav-bar no-print">
          <a
            href="#"
            class="js-colorlib-nav-toggle colorlib-nav-toggle"
            data-toggle="collapse"
            data-target="#navbar"
            aria-expanded="false"
            aria-controls="navbar"
            aria-label="Toggle navigation menu"
            ><i></i
          ></a>
          <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch to dark mode">
            <i class="fa-solid fa-moon" aria-hidden="true"></i>
            <span class="theme-toggle-label">Dark mode</span>
          </button>
        </div>
        <aside
          id="colorlib-aside"
          role="complementary"
          class="border js-fullheight no-print"
        >
          <div class="text-center">
            <div class="lang-switcher no-print">
              <button id="btn-en" class="lang-btn">EN</button>
              <span class="lang-divider">|</span>
              <button id="btn-jp" class="lang-btn">日本語</button>
            </div>
            <button class="theme-toggle no-print" type="button" data-theme-toggle aria-label="Switch to dark mode">
              <i class="fa-solid fa-moon" aria-hidden="true"></i>
              <span class="theme-toggle-label">Dark mode</span>
            </button>
            <div class="author-img">
              <img id="profile-img" src="{{ asset('images/profile.png') }}" alt="Htein Lynn Aung" />
            </div>
            <h1 id="colorlib-logo"><a href="{{ route('home') }}"><span data-i18n="profile_name">Htein Lynn Aung</span></a></h1>
          </div>
          <nav
            id="colorlib-main-menu"
            role="navigation"
            class="navbar"
            style="padding-top: 2em"
          >
            <div id="navbar" class="collapse">
              <ul>
                <li><a href="#" data-nav-section="about" data-i18n="menu_about">About</a></li>
                <li><a href="#" data-nav-section="skills" data-i18n="menu_skills">Skills</a></li>
                <li>
                  <a href="#" data-nav-section="experience" data-i18n="menu_experience">Work Experience</a>
                </li>
                <li><a href="#" data-nav-section="education" data-i18n="menu_education">Education</a></li>
                <li>
                  <a href="#" data-nav-section="repos" data-i18n="menu_repos">Top Repositories</a>
                </li>
                <li><a href="#" data-nav-section="blogs" data-i18n="menu_blogs">Blogs</a></li>
                <li><a href="#" data-nav-section="contact" data-i18n="menu_contact">Contact</a></li>
              </ul>
            </div>
          </nav>
        </aside>
        <div id="colorlib-main">
          <section class="colorlib-about" data-section="about">
            <div class="colorlib-narrow-content">
              <div class="row animate-box" data-animate-effect="fadeInLeft">
                <div class="about-desc">
                  <h1 data-i18n="section_about">About Me</h1>
                  <div id="bio"></div>
                </div>
              </div>
            </div>
          </section>
          <section class="colorlib-skills" data-section="skills">
            <div class="colorlib-narrow-content">
              <div
                class="row row-bottom-padded-sm animate-box"
                data-animate-effect="fadeInLeft"
              >
                <div class="about-desc">
                  <h1 data-i18n="section_skills">Skills</h1>
                </div>
              </div>
              <div id="skills" class="skills-list" aria-label="Technology skills"></div>
              <div
                id="technology-skills-globe"
                class="technology-skills-globe"
                aria-label="Interactive 3D technology skills globe"
              >
                <div id="technology-skills-canvas"></div>
                <div
                  id="technology-skills-tooltip"
                  class="technology-skills-tooltip"
                  role="tooltip"
                  aria-hidden="true"
                ></div>
              </div>
            </div>
          </section>
          <section class="colorlib-profile" data-section="profile-card">
            <div class="colorlib-narrow-content">
              <div
                class="row row-bottom-padded-sm animate-box"
                data-animate-effect="fadeInLeft"
              >
                <div class="profile-cards">
                  <div class="col">
                    <div class="linkedin-card"></div>
                  </div>
                  <div class="col">
                    <div class="github-card" username="hteinlynnaung-mrh"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section class="colorlib-experience" data-section="experience">
            <div class="colorlib-narrow-content">
              <div
                class="row row-bottom-padded-sm animate-box"
                data-animate-effect="fadeInLeft"
              >
                <div class="about-desc">
                  <h1><span data-i18n="section_experience_title">Work </span><span style="color: #f9bf3f" data-i18n="section_experience_subtitle">Experience</span></h1>
                </div>
              </div>
              <div class="timeline-centered" id="experience"></div>
            </div>
          </section>
          <section class="colorlib-education" data-section="education">
            <div class="colorlib-narrow-content">
              <div
                class="row row-bottom-padded-sm animate-box"
                data-animate-effect="fadeInLeft"
              >
                <div class="about-desc">
                  <h1 data-i18n="section_education">Education</h1>
                </div>
              </div>
              <div class="timeline-centered" id="education"></div>
            </div>
          </section>
          <section class="colorlib-experience no-print" data-section="repos">
            <div class="colorlib-narrow-content">
              <div
                class="row row-bottom-padded-sm animate-box"
                data-animate-effect="fadeInLeft"
              >
                <div class="about-desc">
                  <a
                    href="https://github.com/hteinlynnaung-mrh"
                    target="_blank"
                    style="color: inherit"
                  >
                      <h1 >
                        <span data-i18n="section_repos_title">Top </span><span style="color: #f9bf3f" data-i18n="section_repos_subtitle">Repositories</span>
                        <i
                          class="fa fa-external-link"
                          aria-hidden="true"
                          style="font-size: 30px"
                        ></i>
                      </h1>
                  </a>
                </div>
              </div>
              <ul
                id="accordion"
                class="accordion animate-box"
                data-animate-effect="fadeInLeft"
              >
                <li class="open">
                  <ul
                    id="repos"
                    class=""
                    style="display: block; padding: 0px"
                  ></ul>
                </li>
              </ul>
            </div>
          </section>
          <section class="colorlib-blogs no-print" data-section="blogs">
            <div class="colorlib-narrow-content">
              <div
                class="row row-bottom-padded-sm animate-box"
                data-animate-effect="fadeInLeft"
              >
                <div class="about-desc">
                  <a
                    href="https://freecodecamp.org"
                    target="_blank"
                    style="color: inherit"
                  >
                      <h1>
                        <span data-i18n="section_blogs_title">Latest </span><span style="color: #f9bf3f" data-i18n="section_blogs_subtitle">Blogs</span>
                        <i
                          class="fa fa-external-link"
                          aria-hidden="true"
                          style="font-size: 30px"
                        ></i>
                      </h1>
                  </a>
                </div>
              </div>
              <ul
                id="accordion"
                class="accordion animate-box"
                data-animate-effect="fadeInLeft"
              >
                <li class="open">
                  <ul
                    id="blogs"
                    class="submenu"
                    style="display: flex; flex-direction: column; gap: 20px"
                  ></ul>
                </li>
              </ul>
            </div>
          </section>
          <section class="colorlib-contact" data-section="contact">
            <div class="colorlib-narrow-content aligned-content-shell">
              <div
                class="row row-bottom-padded-sm animate-box"
                data-animate-effect="fadeInLeft"
              >
                <div class="about-desc">
                  <h1 data-i18n="section_contact">Contact</h1>
                </div>
                <p data-i18n="contact_para">
                   Feel free to email me at
                  <strong>hteinlynnaung.1111@gmail.com</strong> for tech
                  discussions, business opportunities, or just to say hello—I’d
                  love to hear from you!
                </p>
              </div>
              <div id="contact-links"></div>
            </div>
          </section>
          
          <section class="colorlib-footer no-print" data-section="footer">
            <div class="colorlib-narrow-content aligned-content-shell">
              <footer class="footer" id="footer"></footer>
            </div>
          </section>
        </div>
      </div>
    </div>
    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery.waypoints.min.js') }}"></script>
    <script src="{{ asset('js/main.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script type="module" src="{{ asset('js/technology-skills-globe.js') }}"></script>

  </body>
</html>
