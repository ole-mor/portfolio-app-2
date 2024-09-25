import React, { useRef, useState, useEffect } from 'react';
import './App.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface TypewriterProps {
  text: string;
  isDeleting: boolean;
  tS: number;
  startDelay: number;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, isDeleting, tS, startDelay }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [typingStarted, setTypingStarted] = useState<boolean>(false);
  const typingSpeed = tS;
  const deletingSpeed = 50;
  const typewriterRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !typingStarted) {
          const delayTimeout = setTimeout(() => {
            setTypingStarted(true);
          }, startDelay);

          return () => clearTimeout(delayTimeout);
        }
      },
      { threshold: 0.1 }
    );

    if (typewriterRef.current) {
      observer.observe(typewriterRef.current);
    }

    return () => {
      if (typewriterRef.current) {
        observer.unobserve(typewriterRef.current);
      }
    };
  }, [startDelay, typingStarted]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (typingStarted && !isDeleting) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex < text.length) {
            return prevIndex + 1;
          } else {
            clearInterval(intervalId);
            return prevIndex;
          }
        });
      }, typingSpeed);
    } else if (typingStarted && isDeleting) {
      intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex > 0) {
            return prevIndex - 1;
          } else {
            clearInterval(intervalId);
            return prevIndex;
          }
        });
      }, deletingSpeed);
    }

    return () => clearInterval(intervalId);
  }, [text, isDeleting, typingStarted, typingSpeed, deletingSpeed]);

  return <span ref={typewriterRef} className="inline-text">{text.slice(0, currentIndex)}</span>;
};

function App() {

  interface NavbarProps {
    showNavbar: boolean;
  }

  const Navbar: React.FC<NavbarProps> = ({ showNavbar }) => (
    <nav className={`navbar ${showNavbar ? 'visible' : ''}`}>
      <ul className="bebas-neue-regular">
        <li><a href="#section1" aria-label="Home">Home</a></li>
        <li><a href="#section2" aria-label="About">About</a></li>
        <li><a href="#section3" aria-label="Projects">Projects</a></li>
        <li><a href="https://drive.google.com/file/d/1oZo5Ci-2AQnpfJNAx51p2nMq__H6K5Gj/view?usp=share_link" aria-label="Resumé">Resumé</a></li>
        <li>
        <button
          onClick={(e) => {
            e.preventDefault(); // Prevent default behavior
            setIsDarkMode((prevMode) => !prevMode); // Toggle dark mode
          }}
          onTouchStart={(e) => {
            e.preventDefault(); // Prevent default behavior on touch
            setIsDarkMode((prevMode) => !prevMode); // Toggle dark mode
          }}
          className="dark-mode-toggle"
          aria-label="Toggle Dark Mode"
          style={{ WebkitTapHighlightColor: 'transparent' }}  // Disable mobile tap highlight
        >
          {isDarkMode ? (
            <img src={`${process.env.PUBLIC_URL}/assets/icons/moon.png`} alt="moon" className="mymoon" />
          ) : (
            <img src={`${process.env.PUBLIC_URL}/assets/icons/sun.png`} alt="sun" className="mysun" />
          )}
        </button>
        </li>
      </ul>
    </nav>
  );

  interface SideMenuProps {
    isOpen: boolean;
  }

  const SideMenu: React.FC<SideMenuProps> = ({ isOpen }) => (
    <div className={`side-menu ${isOpen ? 'open' : ''}`}>
      <ul className="bebas-neue-regular">
        <li><a href="#section1" aria-label="Home">Home</a></li>
        <li><a href="#section2" aria-label="About">About</a></li>
        <li><a href="#section3" aria-label="Projects">Projects</a></li>
      </ul>
    </div>
  );

  // MenuToggle remains commented out as per your original code
  // interface MenuToggleProps {
  //   isOpen: boolean;
  //   onClick: () => void;
  // }
  //
  // const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, onClick }) => (
  //   <button className="menu-toggle" onClick={onClick} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
  //     <img
  //       src={isOpen ? '/assets/icons/close_sidebar.png' : '/assets/icons/open_sidebar.png'}
  //       alt={isOpen ? 'Close Menu' : 'Open Menu'}
  //     />
  //   </button>
  // );

  function useOnScreen(ref: React.RefObject<HTMLElement>, threshold: number = 0.5) {
    const [isIntersecting, setIntersecting] = useState(false);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting),
        { threshold }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) observer.unobserve(ref.current);
      };
    }, [ref, threshold]);

    return isIntersecting;
  }

  const useScrollDetection = () => {
    const [showNavbar, setShowNavbar] = useState(false);
    const [showSideMenu, setShowSideMenu] = useState(false);

    useEffect(() => {
      const sections = document.querySelectorAll<HTMLElement>('.section');

      const handleScroll = () => {
        const currentScroll = window.scrollY;
        const viewportHeight = window.innerHeight;

        sections.forEach((section, index) => {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (currentScroll >= sectionTop - viewportHeight / 2 && currentScroll < sectionBottom - viewportHeight / 2) {
            if (index === 0) {
              // We are in section1
              setShowNavbar(true);
              setShowSideMenu(false);
            } else {
              // We are in any section other than section1
              setShowNavbar(false);
              setShowSideMenu(true);
            }
          }
        });
      };

      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Trigger scroll handler on initial load to set correct states
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return { showNavbar, showSideMenu };
  };

  // Project state and data
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isProjectChanging, setIsProjectChanging] = useState(false);
  // Updated project data with two code snippets per project
  const projects = [
    {
      id: 'proj1',
      name: 'React web-app',
      icon: '/assets/icons/react-logo.png',
      codeSnippets: [
{       code: ` // Navbar.tsx //
import React from 'react';

interface NavbarProps {
  showNavbar: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({{ showNavbar }}) => (
  <nav className={{\`navbar \${showNavbar ? 'visible' : ''}\`}}>
    <ul className="bebas-neue-regular">
      <li><a href="#section1">Home</a></li>
      <li><a href="#section2">About</a></li>
      <li><a href="#section3">Projects</a></li>
      <li><a href="https://drive.google.com/file/d/...">Resumé</a></li>
    </ul>
  </nav>
);
`, 
language: "typescript",
  }
        ,
{
  code: `
// App.tsx //
{showSideMenu && <SideMenu isOpen={true} />}
<div className="projects-section">
  <div className="projects-container">
    {/* Container 1: Two Code Snippets */}
    <div className="code-snippets">
      <div className="code-container">
        <div className="code-box">
          <pre>{{selectedCodeSnippet1}}</pre>
        </div>
        <div className="code-box">
          <pre>{{selectedCodeSnippet2}}</pre>
        </div>
      </div>
    </div>

    {/* Container 2: Interactive GitHub Projects */}
    <div className="project-descriptions">
      <h3>GitHub Projects</h3>
      <ul className="ibm-plex-mono-bold">
        {{projects.map((project) => (
          <li
            key={{project.id}}
            className={{selectedProject === project.id ? "selected" : ''}}
            onClick={() => handleProjectClick(project.id)}
          ...
`,
language: "html"
}
      ],
    },
    {
      id: 'proj2',
      name: '3D rendering',
      icon: '/assets/icons/3d.png',
      codeSnippets: [
        
{
  code: ` \
// fragment_shader.glsl
vec3 ambient = 0.1 * lights[0].color;

// Diffuse lighting
vec3 norm = normalize(Normal);
vec3 lightDir = normalize(lights[0].position - FragPos);
float diff = max(dot(norm, lightDir), 0.0);
vec3 diffuse = diff * lights[0].color;

// Specular lighting
vec3 viewDir = normalize(viewPos - FragPos); 
vec3 reflectDir = reflect(-lightDir, norm);
float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);
vec3 specular = spec * lights[0].color;

vec3 lighting = (ambient + diffuse + specular) * material.baseColor.rgb;
FragColor = vec4(lighting, material.baseColor.a);
`,
language: "glsl",
},
{
  code: `
// main.cpp //
void Render(Shader &shader) {
    glm::mat4 modelWithInitialPosition = glm::translate(modelMatrix, position);
    shader.setMat4("model", modelWithInitialPosition);
    
    // Set materials
    if (!materials.empty()) {
        shader.setVec4("material.baseColor", materials[0].baseColor);
        shader.setFloat("material.metallic", materials[0].metallic);
        shader.setFloat("material.roughness", materials[0].roughness);
    }
    
    // Set lights
    for (size_t i = 0; i < lights.size(); ++i) {
        shader.setVec3("lights[" + std::to_string(i) + "].position", lights[i].position);
        shader.setVec3("lights[" + std::to_string(i) + "].color", lights[i].color);
        shader.setFloat("lights[" + std::to_string(i) + "].intensity", lights[i].intensity);
    }
    shader.setInt("numLights", static_cast<int>(lights.size()));

    for (auto &mesh : meshes) {
        RenderMesh(mesh);
    }
}
`,
language: "c++",
},
      ],
    },
    {
      id: 'proj3',
      name: 'Survey tool',
      icon: '/assets/icons/survey-app.png',
      codeSnippets: [
{
  code: ` \
// survey-app/src/main.rs
fn calculate_statistics(&self, data: &Vec<Option<f64>>) -> (f64, f64) {
    let filtered_data: Vec<f64> = data.iter().filter_map(|&x| x).collect();
    let array = Array1::from(filtered_data);
    let mean = array.mean().unwrap_or(f64::NAN);
    let std_dev = array.std(0.0);
    (mean, std_dev)
}

fn create_normal_distribution_points(mean: f64, std_dev: f64) -> PlotPoints {
    let mut points = Vec::new();
    let step = 0.1;
    for x in (0..300).map(|x| -10.0 + step * x as f64) {
        let y = (1.0 / (std_dev * (2.0 * PI).sqrt())) * (-0.5 * ((x - mean) /\\
std_dev).powi(2)).exp();
        points.push([x, y]);
    }
    PlotPoints::from(points)
}
`,
language: "rust"
},
{
  code: `
// storedata.py //
def read_csv_headers(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        headers = next(reader, [])
    return headers

def write_csv_headers(file_path, headers):
    with open(file_path, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)

def append_csv_row(file_path, row):
    with open(file_path, 'a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(row)

def read_generated_csv(file_path):
    with open(file_path, 'r') as file:
        reader = csv.reader(file)
        categories = next(reader, [])
        numbers = next(reader, [])
    return dict(zip(categories, numbers))
`,
language: "python",
},
      ],
    },    
    {
      id: 'proj4',
      name: 'DX tools',
      icon: '/assets/icons/devx.png',
      codeSnippets: [
{
  code: ` // ~/.config/nvim/init.lua //
local width = 80
local function center_pad(str)
  local padding = math.floor((width - #str) / 2)
  return string.rep(" ", padding) .. str
end

startify.section.header.val = {
                                                                         
    "•͡˘㇁•͡˘"

}
startify.section.header.opts = { position = "center", hl = "AlphaHeader" }
alpha.setup(startify.config)
`,
language: "lua"
},
{
  code: `
// Bot-app/Makefile //
VENV := venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
REQUIREMENTS := requirements.txt

.PHONY: venv install run clean

# Ensure that the venv directory exists and install dependencies only once
$(VENV)/bin/activate: $(REQUIREMENTS)
	@if [ ! -d "$(VENV)" ]; then \\
		python3 -m venv $(VENV); \\
		$(PIP) install -r $(REQUIREMENTS); \\
	fi

# Install target just sets up the virtual environment if it doesn't exist
install: $(VENV)/bin/activate

# Run the main script with arguments passed, ensuring venv is created first
run: $(VENV)/bin/activate
	$(PYTHON) -m super_figma.main $(ARGS)

# Clean up unnecessary files
clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -exec rm -r {} +
	rm -rf $(VENV)
`,
language: "makefile"
},
      ],
    },
    {
      id: 'proj5',
      name: 'Embedded/ Intgrated Systems',
      icon: '/assets/icons/embint.png',
      codeSnippets: [
{
  code: ` // tidy/tidy.py //
port = "/dev/ttyS1"
baudrate = 38400

def tmp100_get(rs232, a):
    rs232.write("Q:DV_FZ:adr=1;all_temp=N:CS\\r\\n")
    sleep(0.1)
    while True:
        rs232_out = rs232.read()
        if (len(rs232_out) == 0):
            a += rs232_out
            break
        else:
            a += rs232_out
    return a

def test_serial_communicaition(baudrate, port):
    rs232 = serial.Serial(
        port = port,
        baudrate = baudrate,
        timeout = 1
    )
    a=""
    a=tmp100_get(rs232, a)
    return a
`,
language: "python"
},
{
  code: `
// ESP32_MQTT_NODERED_ZumoMain.ino
  // Data sendt every second
  if (millis() - everySecondTimer > 1000) {
    printSerialData(BATTERYLEVEL, batteryLevel);
    printSerialData(MEASUREDSPEED, measuredSpeed);
    everySecondTimer = millis();
  }
  
  // Data sendt every 10 seconds
  if (millis() - every10SecondTimer > 10000) {
    printSerialData(BATTERYHEALTH, batteryHealth);          
    every10SecondTimer = millis();
  }
`,
language: "ino"
},
      ],
    },
    {
      id: 'proj6',
      name: 'Video Manipulation',
      icon: '/assets/icons/vision.png',
      codeSnippets: [
{
  code: ` // SwiftVideoApp/VideoDisplay.swift //
private func addFaceBoundingBoxes(for observations: [VNFaceObservation]) {
    let frameSize = displayLayer?.bounds.size ?? .zero

    for observation in observations {
        // Convert normalized bounding box to screen coordinates
        let boundingBox = observation.boundingBox
        let x = boundingBox.origin.x * frameSize.width
        let y = boundingBox.origin.y * frameSize.height
        let width = boundingBox.width * frameSize.width
        let height = boundingBox.height * frameSize.height

        let faceRect = CGRect(x: x, y: y, width: width, height: height)

        // Create a red box for the detected face
        let shapeLayer = CAShapeLayer()
        shapeLayer.frame = faceRect
        shapeLayer.borderColor = NSColor.red.cgColor
        shapeLayer.borderWidth = 2.0

        displayLayer?.addSublayer(shapeLayer)
        faceBoundingBoxLayers.append(shapeLayer)
    }
}

@objc private func saveCroppedFaces() {
    ...
`,
language: "swift"
},
{
  code: ` // MockModel.swift //
import CoreML

class MockModel: MLModel {
    override func prediction(from input: MLFeatureProvider, options: MLPredictionOptions) \\
throws -> MLFeatureProvider {
        let outputArray = try MLMultiArray(shape: [128], dataType: .double)
        for i in 0..<128 {
            outputArray[i] = NSNumber(value: Double(i) / 100.0)
        }
        return try MLDictionaryFeatureProvider(dictionary: ["output": outputArray])
    }
}
`,
language: "swift"
},
      ],
    },
    {
      id: 'proj7',
      name: 'Website',
      icon: '/assets/icons/fullstack.png',
      codeSnippets: [
{
  code: ` // 2024-07-21-084717_create_posts/up.sql //
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    noted_count INTEGER NOT NULL DEFAULT 0,
    read_count INTEGER NOT NULL DEFAULT 0
);
 // 2024-07-21-084717_create_posts/down.sql //
DROP TABLE posts;
`,
language: "sql"
},
{
  code: ` // src/routes/forum.rs //
#[derive(Deserialize)]
pub struct CreatePost {
    pub content: String,
}

#[derive(Deserialize, Debug)]
pub struct RecordReaction {
    pub post_id: i32,
    pub reaction: String,
}

pub async fn forum(pool: web::Data<Pool>, tmpl: web::Data<Tera>) -> impl Responder {
    info!("Forum route hit");
    let mut conn = pool.get().expect("Couldn't get db connection from pool");
    let all_posts = posts::table.load::<Post>(&mut conn).expect("Error loading posts");

    let mut ctx = Context::new();
    ctx.insert("posts", &all_posts);
    match tmpl.render("forum.html", &ctx) {
        Ok(rendered) => HttpResponse::Ok().body(rendered),
        Err(_) => HttpResponse::InternalServerError().finish(),
    }
}

pub async fn create_post(
    post: web::Json<CreatePost>, 
    pool: web::Data<Pool>) 
    -> impl Responder {
    let mut conn = pool.get().expect("Couldn't get db connection from pool");

    let new_post = NewPost {
        content: &post.content,
    };

    diesel::insert_into(posts::table)
        .values(&new_post)
        .execute(&mut conn)
        .expect("Error saving new post");

    HttpResponse::Ok().json("Post created")
}
`,
language: "rust"
},
      ],
    },
    
  ];

  const handleProjectClick = (projectId: string) => {
    setIsProjectChanging(true);

    setTimeout(() => {
      setSelectedProject(projectId);
      setIsProjectChanging(false);
    }, 400);
  };

  const selectedProjectData = projects.find(
    (project) => project.id === selectedProject
  );

  const selectedCodeSnippets = selectedProjectData ? selectedProjectData.codeSnippets : [];

  const { showNavbar, showSideMenu } = useScrollDetection();

  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const isAboutVisible = useOnScreen(aboutRef, 0.5);
  const isProjectsVisible = useOnScreen(projectsRef, 0.5);
  const isContactVisible = useOnScreen(contactRef, 0.5);

  const myarray: string[] = ['Programming', 'Web Design', 'Audio+Visual Art'];
  const [currentTextIndex, setCurrentTextIndex] = useState<number>(0);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [typewriterTriggered, setTypewriterTriggered] = useState<boolean>(false);

  useEffect(() => {
    if (isAboutVisible && !typewriterTriggered) {
      setTypewriterTriggered(true);
    }
  }, [isAboutVisible, typewriterTriggered]);

  useEffect(() => {
    const typingDelay = (myarray[currentTextIndex].length + 1) * 100;
    const pauseDuration = 1500;
    const resetDelay = 800;

    let timeoutId: NodeJS.Timeout;

    if (!isDeleting && !isPaused) {
      timeoutId = setTimeout(() => {
        setIsPaused(true);
      }, typingDelay);
    } else if (isPaused) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
        setIsPaused(false);
      }, pauseDuration);
    } else {
      timeoutId = setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % myarray.length);
        setIsDeleting(false);
      }, resetDelay);
    }

    return () => clearTimeout(timeoutId);
  }, [currentTextIndex, isDeleting, isPaused, myarray]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScroll = (event: WheelEvent) => {
    const sections = document.querySelectorAll('.section');
    let currentIndex = -1;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 0 && rect.bottom > 0) {
        currentIndex = index;
      }
    });

    if (event.deltaY > 0 && currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      scrollToSection(nextSection.id);
    } else if (event.deltaY < 0 && currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      scrollToSection(prevSection.id);
    }
  };

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const isInteractiveElement = (element: HTMLElement): boolean => {
    return (
      element.tagName === 'A' ||
      element.tagName === 'BUTTON' ||
      element.closest('.project-descriptions') !== null
    );
  };

  const handleTouchStart = (event: TouchEvent) => {
    const target = event.target as HTMLElement;
    if (isInteractiveElement(target)) {
      return;
    }
    setTouchStart(event.touches[0].clientY);
  };

  const handleTouchMove = (event: TouchEvent) => {
    const target = event.target as HTMLElement;
    if (isInteractiveElement(target)) {
      return;
    }
    setTouchEnd(event.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart === 0 || touchEnd === 0) {
      return;
    }

    const swipeDistance = touchStart - touchEnd;
    const SWIPE_THRESHOLD = 50;

    if (Math.abs(swipeDistance) < SWIPE_THRESHOLD) {
      return;
    }

    const sections = document.querySelectorAll('.section');
    let currentIndex = -1;

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 0 && rect.bottom > 0) {
        currentIndex = index;
      }
    });

    if (swipeDistance > 150 && currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      scrollToSection(nextSection.id);
    } else if (swipeDistance < -150 && currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      scrollToSection(prevSection.id);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd]);

  // Dark Mode Toggle State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Choose syntax highlighting theme based on dark mode
  const syntaxTheme = isDarkMode ? vs2015 : docco;

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&display=swap');
      </style>
      <section className="section" id="section1">
        {showNavbar && <Navbar showNavbar={true} />}
        <div className="home-screen">
          <div className="intro-text">
            <a className="bebas-neue-regular">Hi, my name is <u className="myName">Ole Mathias Ornæs</u></a>
          </div>
          <div className="array-text">
            <div id="typewriter_text" className="Typewriter">
              <a className="bebas-neue-regular">
                I do: <a href=""> </a>
                <Typewriter text={myarray[currentTextIndex]} isDeleting={isDeleting} tS={100} startDelay={0} />
              </a>
            </div>
          </div>
          <div className="frontpage-art">
            <div className="cubepng"><img src={`${process.env.PUBLIC_URL}/assets/images/cube.png`} alt="cube"  className="cube"/></div>

          </div>
        </div>
      </section>

      <section className={`section fade-section ${isAboutVisible ? 'in-view' : ''}`} id="section2" ref={aboutRef}>
        {showSideMenu && <SideMenu isOpen={true} />}
        <div className="about-container">
          <div className="boxed-text-container">
            <div className="boxed-text-about">
              {typewriterTriggered && (
                <div className="ibm-plex-mono-regular">
                  <Typewriter text="I am a Master Student at Kristiania College in " isDeleting={false} tS={20} startDelay={0} />
                  <a href="https://earth.google.com/web/search/oslo">
                    <Typewriter text="Oslo, Norway" isDeleting={false} tS={20} startDelay={1000} />
                  </a>
                  <Typewriter text=", specializing in HCI, working on UI/UX for web and Embedded systems architecture." isDeleting={false} tS={20} startDelay={1200} />
                  <p></p>
                  <Typewriter text="I enjoy taking walks, and love spending time in nature, but my ideal environment is where I can enjoy building my projects, and being on the cutting edge of digital media." isDeleting={false} tS={15} startDelay={3000} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={`section fade-section ${isProjectsVisible ? 'in-view' : ''}`} id="section3" ref={projectsRef}>
        {showSideMenu && <SideMenu isOpen={true} />}
        <div className="projects-section">
          <div className="projects-container">
            <div className={`code-snippets ${isProjectChanging ? 'slide-out' : 'slide-in'}`}>
              <div className="code-container">
                {selectedCodeSnippets.map((snippet, index) => (
                  <div className="code-box" key={index}>
                    <SyntaxHighlighter language={snippet.language} style={syntaxTheme} showLineNumbers={false}>
                      {snippet.code}
                    </SyntaxHighlighter>
                  </div>
                ))}
              </div>
            </div>

            <div className="project-descriptions">
              <ul className="ibm-plex-mono-bold">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className={selectedProject === project.id ? 'selected' : ''}
                    onClick={() => handleProjectClick(project.id)}
                    tabIndex={0}
                    onKeyPress={(e) => e.key === 'Enter' && handleProjectClick(project.id)}
                    aria-label={`View ${project.name}`}
                  >
                    <img src={project.icon} alt={project.name} className="project-icon" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="project-image">
              <img src={`${process.env.PUBLIC_URL}/assets/images/part1.gif`} alt="Project visual" />
            </div>
          </div>
        </div>
      </div>

      <section className={`section fade-section ${isContactVisible ? 'in-view' : ''}`} id="section4" ref={contactRef}>
        {showSideMenu && <SideMenu isOpen={true} />}
        <div className="contactinfo-text">
          <div><p>Contact info:</p></div>
          <div><a href="mailto:ole.ornas@gmail.com">ole.ornas@gmail.com</a></div>
          <div><a href="resumélink">Resumé</a></div>
        </div>
      </section>
    </div>
  );
}

export default App;