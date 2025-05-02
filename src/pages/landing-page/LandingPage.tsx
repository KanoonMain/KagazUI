import React from "react";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../assets/css/templatemo-chain-app-dev.css";
import "../../assets/css/animated.css";
import "../../assets/css/owl.css";
import slider from "../../assets/images/slider-dec.png";
import logo from "../../assets/images/logo.png";
import heading from "../../assets/images/heading-line-dec.png";
import about from "../../assets/images/about-right-dec.png";
import pricing from "../../assets/images/pricing-table-01.png";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <>
      {/* Header */}
      <header
        className="header-area header-sticky wow slideInDown"
        data-wow-duration="0.75s"
        data-wow-delay="0s"
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                <a href="#top" className="logo">
                  <img src={logo} alt="Kagaz" />
                </a>
                <ul className="nav">
                  <li className="scroll-to-section">
                    <a href="#top" className="active">
                      Home
                    </a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#services">Services</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#about">About</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#pricing">Pricing</a>
                  </li>
                  <li className="scroll-to-section">
                    <a href="#newsletter">Get Updates</a>
                  </li>
                  <li>
                    <div className="gradient-button">
                      <i className="fa fa-sign-in-alt"></i>
                      <Link to="/signin">Sign In</Link>
                    </div>
                  </li>
                </ul>
                <a className="menu-trigger">
                  <span>Menu</span>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Banner */}
      <div
        className="main-banner wow fadeIn"
        id="top"
        data-wow-duration="1s"
        data-wow-delay="0.5s"
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="row">
                <div className="col-lg-6 align-self-center">
                  <div
                    className="left-content show-up header-text wow fadeInLeft"
                    data-wow-duration="1s"
                    data-wow-delay="1s"
                  >
                    <div className="row">
                      <div className="col-lg-12">
                        <h2>Draft on-the-go.</h2>
                        <p>
                          Generate legal documents, from rent agreements to
                          petitions, in a matter of seconds with the all-new
                          AI-powered Kagaz.
                        </p>
                      </div>
                      <div className="col-lg-12">
                        <div className="white-button scroll-to-section">
                          <div className="gradient-button">
                            <Link to="/create">Try Now</Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div
                    className="right-image wow fadeInRight"
                    data-wow-duration="1s"
                    data-wow-delay="0.5s"
                  >
                    <img src={slider} alt="banner" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="services section">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div
                className="section-heading wow fadeInDown"
                data-wow-duration="1s"
                data-wow-delay="0.5s"
              >
                <h4>
                  <em>Services & Features</em>
                </h4>
                <img src={heading} alt="decoration" />
                <p>
                  Documents are difficult. From font sizes to the words used,
                  the margins are thin - but not impossible. Kagaz offers you a
                  simple and ultra-quick way to generate legal documents on the
                  fly...
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {/* Individual Service Items */}
            {[
              {
                title: "Set Parameters",
                text: "Select from an exhaustive list of templates and get started by adding specific details",
              },
              {
                title: "Quick results",
                text: "Advanced syntax-matching algorithms prepare a unique draft in a matter of seconds",
              },
              {
                title: "Multiple categories",
                text: "Pick from various categories like civil, criminal, and more based on your drafting needs",
              },
              {
                title: "Help & Support",
                text: "Get instant assistance from experienced lawyers to get your drafts in order",
              },
            ].map((service, index) => (
              <div key={index} className="col-lg-3">
                <div
                  className={`service-item ${["first", "second", "third", "fourth"][index]}-service`}
                >
                  <div className="icon"></div>
                  <h4>{service.title}</h4>
                  <p>{service.text}</p>
                  <div className="text-button">
                    <a href="#">
                      Read More <i className="fa fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="about-us section">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 align-self-center">
              <div className="section-heading">
                <h4>
                  <em>What We Do</em>
                </h4>
                <img src={heading} alt="heading" />
                <p>
                  Kagaz emerges from a desire to help legal professionals spend
                  their time on more important tasks...
                </p>
              </div>
              <div className="row">
                {[
                  { title: "Rental agreements", text: "42 options" },
                  { title: "Land petitions", text: "4 sections, 34 options" },
                  { title: "Civil disputes", text: "3 sections, 31 options" },
                  { title: "PILs", text: "4 sections, 54 options" },
                ].map((item, index) => (
                  <div key={index} className="col-lg-6">
                    <div className="box-item">
                      <h4>
                        <Link to="/create">{item.title}</Link>
                      </h4>
                      <p>{item.text}</p>
                    </div>
                  </div>
                ))}
                <div className="col-lg-12">
                  <p>
                    Get the drafting out of the way and give your cases some out
                    of the box thinking.
                  </p>
                  <div className="gradient-button">
                    <Link to="/create">Buy Drafting Credits</Link>
                  </div>
                  <span>*No Credit Card Required</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-image">
                <img src={about} alt="about" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="pricing-tables">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="section-heading">
                <h4>
                  Subscribe <em>and Save</em>
                </h4>
                <img src={heading} alt="line" />
                <p>
                  Take the pain out of drafting with our monthly and annual
                  subscription packages
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            {[
              {
                title: "Individual Pack",
                price: "₹99-499",
                features: [
                  "Basic legal documents",
                  "Create up to 10 drafts",
                  "Valid up to 1 year",
                ],
                link: "Start Drafting",
              },
              {
                title: "Monthly Access",
                price: "₹999",
                features: [
                  "Basic & enhanced documents",
                  "Create up to 50 drafts",
                  "Priority access",
                  "On-call Support",
                ],
                link: "Subscribe for 1 month",
              },
              {
                title: "Yearly Access",
                price: "₹9999",
                features: [
                  "Basic & enhanced documents",
                  "Create up to 500 drafts",
                  "Priority access",
                  "On-call Support",
                  "Valid up to 1 year",
                ],
                link: "Subscribe for 1 year",
              },
            ].map((plan, index) => (
              <div key={index} className="col-lg-4">
                <div
                  className={`pricing-item-${index === 1 ? "pro" : "regular"}`}
                >
                  <span className="price">{plan.price}</span>
                  <h4>{plan.title}</h4>
                  <div className="icon">
                    <img src={pricing} alt="pricing" />
                  </div>
                  <ul>
                    {plan.features.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                  <div className="border-button">
                    <Link to="/create">{plan.link}</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="newsletter">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className="section-heading">
                <h4>Features and updates</h4>
              </div>
            </div>
            <div className="col-lg-6 offset-lg-3">
              <form id="search" action="#" method="GET">
                <div className="row">
                  <div className="col-lg-6 col-sm-6">
                    <fieldset>
                      <input
                        type="email"
                        name="address"
                        className="email"
                        placeholder="Email Address..."
                        required
                      />
                    </fieldset>
                  </div>
                  <div className="col-lg-6 col-sm-6">
                    <fieldset>
                      <button type="submit" className="main-button">
                        Keep me informed <i className="fa fa-angle-right"></i>
                      </button>
                    </fieldset>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="row">
            {/* Footer Columns */}
            {/* Contacts, Links, About */}
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
