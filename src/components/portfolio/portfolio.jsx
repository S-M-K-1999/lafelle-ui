import React from "react";
import "./portfolio.scss";
import Arrow from "../../assets/portfolio/arrow.svg";
import Button from "../ui-components/button/button";
import Title from "../ui-components/title/title";
import ProjectBox from "../ui-components/projectBox/projectBox";
import WhatsAppButton from "../whatsappButton/WhatsAppButton"; 

import F1Image from "../../assets/flowers/f1.jpeg";
import F2Image from "../../assets/flowers/f2.jpeg";
import F3Image from "../../assets/flowers/f3.jpeg";
import C1Image from "../../assets/chocolate/c1.jpeg";
import C2Image from "../../assets/chocolate/c2.jpeg";
import C3Image from "../../assets/chocolate/c3.jpeg";

// --- STATIC PROJECT DATA with working URLs ---
const STATIC_PROJECTS = [
  {
    id: "f1",
    // Red Rose Bouquet
    preview: F1Image,
    title: "Pastel Dream Bouquet",
    tag: "flowers",
    originalIndex: 1,
  },
  {
    id: "c1",
    // Assorted Chocolate Truffles
    preview: C1Image,
    title: "Gold & Silver Delights Tray",
    tag: "chocolates",
    originalIndex: 2,
  },
  {
    id: "f2",
    // Pink Peony and Rose Bouquet
    preview: F2Image, 
    title: "Luxury Rose Box",
    tag: "flowers",
    originalIndex: 3,
  },
  {
    id: "c2",
    // Chocolate Bar and Cocoa
    preview: C2Image,
    title: "Mixed Cheese & Chocolate Platter",
    tag: "chocolates",
    originalIndex: 4,
  },
  {
    id: "f3",
    // Mixed Bouquet with Lilies and Daisies
    preview: F3Image, 
    title: "Crimson Velvet Bouquet",
    tag: "flowers",
    originalIndex: 5,
  },
  {
    id: "c3",
    // White Chocolate Bar
    preview: C3Image,
    title: "Orchid & Truffle Display",
    tag: "chocolates",
    originalIndex: 6,
  },
];
// --- END STATIC PROJECT DATA ---

class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: STATIC_PROJECTS,
      filterResult: STATIC_PROJECTS,
      pickedFilter: "all",
      filterMenuActive: false,
      pickedFilterDropdown: "NEWEST",
      scrollPosition: 0,
    };
    this.carouselRef = React.createRef();
    this.scrollStep = 300;
  }

  componentDidMount() {
    // Data is static, no API call needed
  }
  
  // --- Carousel Navigation Methods ---
  handleScroll = () => {
    if (this.carouselRef.current) {
        this.setState({ scrollPosition: this.carouselRef.current.scrollLeft });
    }
  };

  scrollLeft = () => {
    if (this.carouselRef.current) {
      this.carouselRef.current.scrollBy({ left: -this.scrollStep, behavior: 'smooth' });
    }
  };

  scrollRight = () => {
    if (this.carouselRef.current) {
      this.carouselRef.current.scrollBy({ left: this.scrollStep, behavior: 'smooth' });
    }
  };

  // --- Filtering Methods ---
  filterGallery = (target) => {
    let projectsArr = [...STATIC_PROJECTS];
    let result;

    if (target !== "all") {
      result = projectsArr.filter((project) => project.tag === target);
    } else {
      result = projectsArr;
    }

    if (this.carouselRef.current) {
        this.carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
    this.setState({ 
        filterResult: result, 
        pickedFilter: target, 
        pickedFilterDropdown: "NEWEST" 
    });
  };

  filterMenuHover = (event) => {
    this.setState({ filterMenuActive: !!event });
  }

  filterDropDownHandler = (filter) => {
    this.setState({ pickedFilterDropdown: filter, filterMenuActive: false });

    let projectsArr = [...this.state.filterResult];
    let result;

    // Sorting by originalIndex
    if (filter === "NEWEST") {
      result = projectsArr.sort((a, b) => a.originalIndex - b.originalIndex);
    }else if (filter === "OLDEST") {
      result = projectsArr.sort((a, b) => b.originalIndex - a.originalIndex);
    }

    this.setState({ filterResult: result});
  }

  // --- Render Method ---
  render() {
    const { filterResult, pickedFilter, filterMenuActive, pickedFilterDropdown, scrollPosition } = this.state;
    
    let projectsRender = null;
    if (filterResult) {
      projectsRender = filterResult.map((project) => (
        <ProjectBox key={project.id} preview={project.preview} title={project.title} tag={project.tag} />
      ));
    }
    
    let filterDroppDown = null;
    if(filterMenuActive) {
      filterDroppDown = (
        <div className="portfolio__filter-menu shadow">
          <p className="font12" onClick={() => this.filterDropDownHandler("NEWEST")}>
            NEWEST
          </p>
          <p className="font12" onClick={() => this.filterDropDownHandler("OLDEST")}>
            OLDEST
          </p>
        </div>
      );
    }
    
    // Logic to determine button visibility
    const isScrollable = this.carouselRef.current && this.carouselRef.current.scrollWidth > this.carouselRef.current.clientWidth;
    const isAtStart = scrollPosition < 20;
    const isAtEnd = this.carouselRef.current && (scrollPosition >= this.carouselRef.current.scrollWidth - this.carouselRef.current.clientWidth - 20);

    return (
      <div id="portfolio">
        <div className="wrapper">
          <Title title="PRODUCTS SHOWCASE." />
          <div className="row">
            <div className="col-12 col-md-8 col-lg-9">
              {/* --- FILTER TABS --- */}
              <div className="portfolio__nav">
                <ul>
                  <li className={pickedFilter === "all" ? "portfolio__nav-active font12" : "font12"} onClick={() => this.filterGallery("all")}>
                    ALL
                  </li>
                  <li
                    className={pickedFilter === "flowers" ? "portfolio__nav-active font12" : "font12"}
                    onClick={() => this.filterGallery("flowers")}
                  >
                    FLOWERS
                  </li>
                  <li
                    className={pickedFilter === "chocolates" ? "portfolio__nav-active font12" : "font12"}
                    onClick={() => this.filterGallery("chocolates")}
                  >
                    CHOCOLATES
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className="col-12 col-md-4 col-lg-3">
              <div className="portfolio__filter" onMouseEnter={() => this.filterMenuHover(true)} onMouseLeave={() => this.filterMenuHover(false)}>
                <p className="font12">{pickedFilterDropdown} FIRST</p>
                <img src={Arrow} alt="arrow" />
                {filterDroppDown}
              </div>
            </div> */}
          </div>
          
          {/* --- CAROUSEL/GRID SECTION --- */}
          <div className="portfolio__grid-wrapper">
            {/* Left Scroll Button */}
            {isScrollable && !isAtStart && window.innerWidth > 767 && (
              <button 
                className="portfolio__nav-button portfolio__nav-button--left" 
                onClick={this.scrollLeft}
                aria-label="Scroll Left"
              >
                &lt;
              </button>
            )}

            {/* The actual scrolling container */}
            <div 
                ref={this.carouselRef}
                className="portfolio__carousel"
                onScroll={this.handleScroll}
                style={{
                    display: 'flex',
                    // flexWrap: 'wrap',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    // Height is controlled by CSS in portfolio.scss
                }}
            >
                {projectsRender}
            </div>

            {/* Right Scroll Button */}
            {isScrollable && !isAtEnd && window.innerWidth > 767 && (
              <button 
                className="portfolio__nav-button portfolio__nav-button--right" 
                onClick={this.scrollRight}
                aria-label="Scroll Right"
              >
                &gt;
              </button>
            )}
          </div>
          {/* --- END CAROUSEL/GRID SECTION --- */}

          <div className="row flex-center padding40">
            <div className="col-12">
              <Button label="HAVE WORK FOR US?" target={"contact"} />
            </div>
          </div>
        </div>
        <WhatsAppButton />
      </div>
    );
  }
}

export default Portfolio