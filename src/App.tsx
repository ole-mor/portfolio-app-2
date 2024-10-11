// App.tsx
import React, { useRef, useState, useEffect, useCallback } from 'react';
import './App.css';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

// 'myarray' defined outside the App component
const myarray: string[] = ['Programming', 'Web Design', 'Digital art'];

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

    const currentRef = typewriterRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
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

  return (
    <span ref={typewriterRef} className="inline-text">
      {text.slice(0, currentIndex)}
    </span>
  );
};

// Define NavbarProps outside
interface NavbarProps {
  showNavbar: boolean;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleDarkMode: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

// Navbar component defined outside App
const Navbar: React.FC<NavbarProps> = ({ showNavbar, isDarkMode, setIsDarkMode, handleToggleDarkMode }) => {
  const iconRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const icon = iconRef.current;
    if (!icon) return;

    const rect = icon.getBoundingClientRect();

    const iconCenterX = rect.left + rect.width / 2;
    const iconCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - iconCenterX;
    const dy = e.clientY - iconCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const maxScale = 2;
    const minScale = 1;

    const maxDistance = rect.width / 2;

    const scale = maxScale - ((distance / maxDistance) * (maxScale - minScale));

    const clampedScale = Math.max(minScale, Math.min(maxScale, scale));

    icon.style.transform = `scale(${clampedScale})`;
    icon.style.transformOrigin = 'center center';
  };

  const handleMouseLeave = () => {
    const icon = iconRef.current;
    if (!icon) return;

    icon.style.transform = 'scale(1)';
  };
  
    

  return (
    <nav className={`navbar ${showNavbar ? 'visible' : ''}`}>
      <div className="nav-home">
        <ul className="ibm-plex-mono-regular">
          <li>
            <a href="#section1" aria-label="oleornaes">
              <b>oleornas</b>
            </a>
          </li>
        </ul>
      </div>
      <div className="nav-rest">
      <ul className="barlow-semibold">
        <li>
          <a href="#section2" aria-label="About">
            About
          </a>
        </li>
        <li>
          <a href="#section3" aria-label="Projects">
            Projects
          </a>
        </li>
        <li>
          <a
            href="https://drive.google.com/file/d/1oZo5Ci-2AQnpfJNAx51p2nMq__H6K5Gj/view?usp=share_link"
            aria-label="Resumé"
          >
            <b>Resumé</b>
          </a>
        </li>
        <li>
          <div className="ripple-effect"></div>
          <button
            onClick={handleToggleDarkMode}
            className="dark-mode-toggle"
            aria-label="Toggle Dark Mode"
          >
            <img
              src={isDarkMode ? '/assets/icons/moon.png' : '/assets/icons/sun.png'}
              alt={isDarkMode ? 'moon' : 'sun'}
              className={isDarkMode ? 'mymoon' : 'mysun'}
              ref={iconRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          </button>
        </li>
      </ul>
      </div>
    </nav>
  );
};

// Define SideMenuProps outside
interface SideMenuProps {
  isOpen: boolean;
}

// SideMenu component defined outside App
const SideMenu: React.FC<SideMenuProps> = ({ isOpen }) => (
  <div className={`side-menu ${isOpen ? 'open' : ''}`}>
    <ul className="barlow-regular">
      <li>
        <a href="#section1" aria-label="Home">
          Home
        </a>
      </li>
      <li>
        <a href="#section2" aria-label="About">
          About
        </a>
      </li>
      <li>
        <a href="#section3" aria-label="Projects">
          Projects
        </a>
      </li>
    </ul>
  </div>
);

function useOnScreen(ref: React.RefObject<HTMLElement>, threshold: number = 0.5) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { threshold }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [ref, threshold]);

  return isIntersecting;
}

const useScrollDetection = () => {
  const [showNavbar, setShowNavbar] = useState(true);  // Show navbar initially
  const [showSideMenu, setShowSideMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const triggerPoint = 300;  // The pixel height at which to switch from navbar to sidebar

      // Check if we've scrolled past the trigger point (1000px)
      if (currentScroll >= triggerPoint) {
        setShowNavbar(true);   // Hide navbar
        setShowSideMenu(false);  // Show sidebar
      } else {
        setShowNavbar(true);    // Show navbar
        setShowSideMenu(false); // Hide sidebar
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();  // Initial check in case user is already scrolled

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { showNavbar, showSideMenu };
};

function App() {
  // isDarkMode state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState('proj1'); // Default to 'proj1'

  // Project state and data
/*   const [selectedProject, setSelectedProject] = useState<string | null>(null); */
  const [isProjectChanging, setIsProjectChanging] = useState(false);

  const rippleRef = useRef<HTMLDivElement>(null);

// App.tsx
const handleToggleDarkMode = (e: React.MouseEvent<HTMLButtonElement>) => {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();

  const rippleX = rect.left + rect.width / 2 + window.scrollX;
  const rippleY = rect.top + rect.height / 2 + window.scrollY;

  document.documentElement.style.setProperty('--ripple-x', `${rippleX}px`);
  document.documentElement.style.setProperty('--ripple-y', `${rippleY}px`);

  const ripple = rippleRef.current;
  const appElement = document.querySelector('.App') as HTMLElement;

  if (ripple && appElement) {
    // Reset the ripple display
    ripple.style.display = 'block';

    const computedStyles = getComputedStyle(document.documentElement);

    const newBackgroundColor = isDarkMode
      ? computedStyles.getPropertyValue('--light-background-color').trim()
      : computedStyles.getPropertyValue('--dark-background-color').trim();
    const oldBackgroundColor = isDarkMode
      ? computedStyles.getPropertyValue('--dark-background-color').trim()
      : computedStyles.getPropertyValue('--dark-background-color').trim();

    ripple.style.backgroundColor = newBackgroundColor;
    appElement.style.setProperty('--background-color', oldBackgroundColor);

    ripple.classList.remove('ripple-expand', 'ripple-retract');

    if (isDarkMode) {
      ripple.style.transform = 'scale(3)';
      ripple.getBoundingClientRect();
      ripple.classList.add('ripple-retract');
    } else {
      ripple.style.transform = 'scale(0)';
      ripple.getBoundingClientRect();
      ripple.classList.add('ripple-expand');
    }

    setTimeout(() => {
      setIsDarkMode(!isDarkMode);

      // Hide the ripple effect after 1.5 seconds
      setTimeout(() => {
        ripple.style.display = 'none';
        ripple.classList.remove('ripple-expand', 'ripple-retract');
        appElement.style.removeProperty('--background-color');
      }, 2000); // Adjust this value to match your animation duration
    }, 0);
  } else {
    setIsDarkMode(!isDarkMode);
  }
};


  // Updated project data with two code snippets per project
  const projects = [
    {
      id: 'proj1',
      name: 'React web-app',
      icon: '/assets/icons/react-logo.png',
      mediaType: 'image',
      media: '/assets/media/react.gif',
      description: 'A web application build with React.',
      githublink: 'https://github.com/ole-mor/portfolio-app-2.git',
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
      mediaType: 'image',
      media: '/assets/media/tcity.gif',
      description: 'A 3d renderer of glb with animation and material support, future game?',
      githublink: 'https://github.com/ole-mor/tcity.git',

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
      mediaType: 'video',
      media: '/assets/media/survey.mp4',
      description: 'A full stack framework for handing survey data using .net and rust backend.',
      githublink: 'https://github.com/ole-mor/_not-yet-posted_',

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
      mediaType: 'image',
      media: '/assets/media/nvim.gif',
      description: 'Misc apps',
      githublink: 'https://github.com/ole-mor/_not-yet-posted_',

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
      mediaType: 'video',
      media: '/assets/media/Zumo.mp4',
      description: 'Small project things',
      githublink: 'https://github.com/ole-mor/_not-yet-posted_',

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
      image: '/assets/images/computer-vision.png',
      description: 'Computer vision project with AI face recognition',
      githublink: 'https://github.com/ole-mor/_not-yet-posted_',

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
      image: '/assets/images/Fullstackwebsite.png',
      description: 'A full stack app make with webassembly for community collaboration',
      githublink: 'https://github.com/ole-mor/_not-yet-posted_',

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

  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const handleProjectClick = (projectId: string) => {
    setIsProjectChanging(true);

    setTimeout(() => {
      setSelectedProject(projectId);
      setCurrentSlide(0);
      setIsProjectChanging(false);
    }, 400);
  };

  const selectedProjectData = projects.find((project) => project.id === selectedProject);

  const { showNavbar, showSideMenu } = useScrollDetection();

  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const isAboutVisible = useOnScreen(aboutRef, 0.5);
  const isProjectsVisible = useOnScreen(projectsRef, 0);
  const isContactVisible = useOnScreen(contactRef, 0.5);

  useEffect(() => {
    console.log('isProjectsVisible:', isProjectsVisible);
  }, [isProjectsVisible]);


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
  }, [currentTextIndex, isDeleting, isPaused]);

  const scrollToSection = useCallback((sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const isInteractiveElement = useCallback((element: HTMLElement): boolean => {
    return (
      element.tagName === 'A' ||
      element.tagName === 'BUTTON' ||
      element.closest('.project-descriptions') !== null
    );
  }, []);

  const handleScroll = useCallback(
    (event: WheelEvent) => {
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
    },
    [scrollToSection]
  );

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventDefault, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, []);
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      const target = event.target as HTMLElement;
      if (isInteractiveElement(target)) {
        return;
      }
      setTouchStart(event.touches[0].clientY);
    },
    [isInteractiveElement]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      const target = event.target as HTMLElement;
      if (isInteractiveElement(target)) {
        return;
      }
      setTouchEnd(event.touches[0].clientY);
    },
    [isInteractiveElement]
  );

  const handleTouchEnd = useCallback(() => {
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
  }, [touchStart, touchEnd, scrollToSection]);

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
  }, [handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Choose syntax highlighting theme based on dark mode
  const syntaxTheme = isDarkMode ? vs2015 : docco;

  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = e.clientX;
      mousePosition.current.y = e.clientY;
    };

    const updatePosition = () => {
      const { x, y } = mousePosition.current;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    document.addEventListener('mousemove', onMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    // Select all video elements inside the `.project-media-container` and remove controls
    const videos = document.querySelectorAll('.project-media-container video');
    videos.forEach((video) => {
      video.removeAttribute('controls');
    });
  }, [selectedProject, currentSlide]); // Run this effect when selected project or slide changes
  

    // Variables for tracking touch
    const [touchStartX, setTouchStartX] = useState<number>(0);
    const [touchEndX, setTouchEndX] = useState<number>(0);
  
    // Slide change on swipe
    const SWIPE_THRESHOLD = 50; // Minimum distance for swipe detection
  
    const handleTouchStartx = (event: React.TouchEvent) => {
      setTouchStartX(event.touches[0].clientX);
    };
  
    const handleTouchMovex = (event: React.TouchEvent) => {
      setTouchEndX(event.touches[0].clientX);
    };
  
    const handleTouchEndx = () => {
      if (touchStartX - touchEndX > SWIPE_THRESHOLD) {
        // Swipe left -> Next slide
        setCurrentSlide((prevSlide) => (prevSlide < 2 ? prevSlide + 1 : prevSlide));
      }
  
      if (touchEndX - touchStartX > SWIPE_THRESHOLD) {
        // Swipe right -> Previous slide
        setCurrentSlide((prevSlide) => (prevSlide > 0 ? prevSlide - 1 : prevSlide));
      }
  
      // Reset touch positions
      setTouchStartX(0);
      setTouchEndX(0);
    };
  

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      {/* Custom Cursor */}
      <div className="custom-cursor" ref={cursorRef}></div>
      <div className="ripple-effect" ref={rippleRef}></div>
      <style>
        @import
        url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&family=Anton&family=Barlow:wght@400;600&family=Bitter:ital,wght@0,100..900;1,100..900&display=swap');
      </style>

      {/* Section 1 */}
      <section className="section" id="section1">
        {showNavbar && (
          <Navbar
            showNavbar={true}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            handleToggleDarkMode={handleToggleDarkMode}
          />
        )}
        <div className="home-screen">
          <div className="intro-name">
            <span className="bitter-homename">
              Ole Ornæs
            </span>
          </div>
          <div className="intro-text">
            <span className="barlow-regular">
              I am a Master Student at Kristiania College in &nbsp;
              <a href="https://earth.google.com/web/search/oslo">Oslo, Norway</a>
              , specializing in HCI, working on UI/UX for web and Embedded systems architecture.

            </span>
          </div>
          <div className="array-text">
            <div id="typewriter_text" className="Typewriter">
              <span className="bebas-neue-regular">
                {' '}
                <Typewriter
                  text={myarray[currentTextIndex]}
                  isDeleting={isDeleting}
                  tS={100}
                  startDelay={0}
                />
              </span>
            </div>
          </div>
          <div className="frontpage-links">
            <ul>
              <li><a href="https://www.linkedin.com/in/ole-ornaes-618220178/">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ln-logo.png`} alt="ln-logo" className="ln-logo" />
              </a></li>
              <li><a href="https://www.facebook.com/profile.php?id=100003266480521">
                <img src={`${process.env.PUBLIC_URL}/assets/images/fb-logo.png`} alt="ln-logo" className="ln-logo" 
                />
              </a></li>
              <li><a href="https://x.com/OliMorn">
                <img src={`${process.env.PUBLIC_URL}/assets/images/x-logo.png`} alt="ln-logo" className="ln-logo" />
              </a></li>
              <li><a href="https://github.com/ole-mor">
                <img src={`${process.env.PUBLIC_URL}/assets/images/ghb-logo.png`} alt="ln-logo" className="ln-logo" />
              </a></li>
            </ul>
          </div>
          <div className="frontpage-art">
            <div className="trianglepyramidpng">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/computart.png`}
                alt="trianglepyramid"
                className="trianglepyramid"
              />
            </div>
{/*             <div className="cubepng">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/cube.png`}
                alt="cube"
                className="cube"
              />
            </div>
            <div className="circlepng">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/circle.png`}
                alt="circle"
                className="circle"
              />
            </div>
            <div className="trianglepyramidpng">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/trianglepyramid.png`}
                alt="trianglepyramid"
                className="trianglepyramid"
              />
            </div>
            <div className="memepng">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/memeda.png`}
                alt="meme"
                className="meme"
              />
            </div> */}

          </div>
        </div>
      </section>

      <section
        className={`section fade-section ${isAboutVisible ? 'in-view' : ''}`}
        id="section2"
        ref={aboutRef}
      >
        <div className="about-container">
          <div className="human">
            <div className="thinking-text">
              <span className="barlow-regular">
                <p>In 2020, I finished my bachelor's degree in psychology. Since I've worked as a in healthcare as a assistant and a therapist.</p>
                <p>I have 4 years experience working with a diverse range of patients, and handled difficult social situations.</p>  
              </span>
            </div>
            <div className="thinking">
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/thinking.png`}
                  alt="art of me thinking"
                  className="thinking"
                />
            </div>
          </div>
          <div className="computer">
            <div className="IT-text">
              <span className="barlow-regular">
                <p>I've used computers ever since I was very little as both my parents are civil engineers. In 2021 to christmas 2022 I tried studying Electrical engineering</p>
                <p>It didn't work out, but I still love engineering and programming.</p>
                <p className="IT-text2">I read my first C book in the Norwegian Ungdomsskole and have since practiced Scripting, 3D modelling, Data handling and tried many languages and styles of project-building.</p>
              </span>
            </div>
            <div className="IT">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/IT.png`}
                alt="art of me on a computer."
                className="IT"
              />
            </div>
          </div>
        </div>
      </section>
      <section
        className={`section fade-section ${isProjectsVisible ? 'in-view' : ''}`}
        id="section3"
        ref={projectsRef}
        onTouchStart={handleTouchStartx}
        onTouchMove={handleTouchMovex}
        onTouchEnd={handleTouchEndx}
      >
        <div className="projects-section">
          <div className="projects-container">
            <div className={`project-slide ${isProjectChanging ? 'slide-out' : 'slide-in'}`}>
              {/* Slide 1: Project Image or Video */}
              <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
                {selectedProjectData && (
                  <div className="project-media-container">
                    {selectedProjectData.mediaType === 'image' ? (
                      <img
                        src={`${process.env.PUBLIC_URL}${selectedProjectData.media}`}
                        alt={selectedProjectData.name}
                        className="project-media"
                      />
                    ) : selectedProjectData.mediaType === 'video' ? (
                      <video
                        src={`${process.env.PUBLIC_URL}${selectedProjectData.media}`}
                        className="project-media"
                        controls
                        autoPlay
                        loop
                        muted
                        playsInline
                      />
                    ) : null}
                  </div>
                )}
              </div>
              {/* Slide 2: Code Snippets */}
              <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
                {selectedProjectData && (
                  <div className="code-snippets">
                    {selectedProjectData.codeSnippets.map((snippet, index) => (
                      <div className="code-box" key={index}>
                        <SyntaxHighlighter
                          language={snippet.language}
                          style={syntaxTheme}
                          showLineNumbers={false}
                        >
                          {snippet.code}
                        </SyntaxHighlighter>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Slide 3: Description and GitHub Link */}
              <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
                {selectedProjectData && (
                  <div className="project-description">
                    <p>{selectedProjectData.description}</p>
                    <a href={selectedProjectData.githublink} target="_blank" rel="noopener noreferrer">
                      View on GitHub
                    </a>
                  </div>
                )}
              </div>
            </div>
            {/* Slide Controls */}
            <div className="slide-controls">
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
            {/* Project Selector */}
            <div className="project-selector">
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
                    <img
                      src={`${process.env.PUBLIC_URL}${project.icon}`}
                      alt={project.name}
                      className="project-icon"
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>


      <section
        className={`section fade-section ${isContactVisible ? 'in-view' : ''}`}
        id="section4"
        ref={contactRef}
      >
        {showSideMenu && <SideMenu isOpen={true} />}
        <div className="contactinfo-text">
          <div>
            <p>Contact info:</p>
          </div>
          <div className="email">
            <div className="profilepic">
              <img
                src={`${process.env.PUBLIC_URL}/assets/images/profile.png`}
                alt="profile"
                className="profile"
              />
            </div>
            <a href="mailto:ole.ornas@gmail.com">ole.ornas@gmail.com</a>
          </div>
          <div>
            <a href="resumélink">Resumé</a>
          </div>
        </div>
        <div>
          <div className="worldartpng">
            <img
              src={`${process.env.PUBLIC_URL}/assets/images/worldart.png`}
              alt="worldart"
              className="worldart"
            />
          </div>
          <img
              src={isDarkMode ? `${process.env.PUBLIC_URL}/assets/images/squigliz-darkmode.png` : `${process.env.PUBLIC_URL}/assets/images/squigliz.png`}
              alt={isDarkMode ? 'sqglz-d' : 'sqlglz'}
              className={isDarkMode ? 'squigliz-darkmode' : 'squigliz'}
            />
        </div>
      </section>
    </div>
  );
}

export default App;
