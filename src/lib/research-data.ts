// Centralized premium dark-themed gradient SVG placeholders loaded offline
export const PLACEHOLDER_IMAGES = {
  project: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%230891b2'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g1)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%230891b2' stroke-width='2'/><path d='M-15-20 h30 v40 h-30 z M-10-10 h20 M-10-2 h20 M-10 6 h12' stroke='%230891b2' stroke-width='3' fill='none'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Project Record</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>",
  facility: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%233b82f6'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g2)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%233b82f6' stroke-width='2'/><path d='M-20 20 v-30 l20-10 l20 10 v30 z M-20 0 h40 M0-20 v40' stroke='%233b82f6' stroke-width='3' fill='none'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Lab Facility</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>",
  equipment: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g3' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2314b8a6'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g3)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%2314b8a6' stroke-width='2'/><path d='M-15-15 l30 30 M15-15 l-30 30' stroke='%2314b8a6' stroke-width='4' stroke-linecap='round'/><circle cx='0' cy='0' r='12' fill='%230f172a' stroke='%2314b8a6' stroke-width='3'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Equipment Asset</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>",
  fieldActivity: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g4)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%236366f1' stroke-width='2'/><path d='M-20 10 c10-10 30-10 40 0 M-20-5 c10-10 30-10 40 0' stroke='%236366f1' stroke-width='3' fill='none' stroke-linecap='round'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Field Deployment</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>"
};

export interface ProjectRecord {
  id: string;
  type: "external" | "internal" | "student" | "phd";
  title?: string;
  fundingAgency?: string;
  amount?: string;
  status: "Ongoing" | "Completed" | "Coursework Completed" | "Thesis Submitted";
  duration?: string;
  role?: string;
  pi?: string;
  copi?: string;
  team?: string[];
  description?: string;
  projectSummary?: string;
  fullDescription?: string;
  publications?: string[];
  publicationCount?: number;
  images?: string[];
  thumbnail?: string;
  scholar?: string;
  researchArea?: string;
  purpose?: string;
  keywords?: string;
  location?: string;
}

export const PROJECTS_DATABASE: ProjectRecord[] = [
  // EXTERNAL FUNDED PROJECTS
  {
    id: "ext-1",
    type: "external",
    title: "Automated Identification and Characterization of Underwater Images in Deep Ocean",
    fundingAgency: "Ministry of Earth Sciences (MoES/PAMC/DOM)",
    amount: "₹ 48.16 Lakhs",
    status: "Ongoing",
    duration: "2023-2026",
    pi: "Dr. K. Muthumeenakshi",
    copi: "Dr. S. Sakthivel Murugan, Dr. N. Padmapriya",
    team: ["M. Vimal Raj", "S. Sabareesan", "R. Sathiya Priya", "K. Muthu Akila"],
    publicationCount: 3,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "ext-2",
    type: "external",
    title: "Off-shore Excavation of Heritage rich submerged sites of Poompuhar and Mahabalipuram using Machine Learning",
    fundingAgency: "Department of Science and Technology (DST-SSTP)",
    amount: "₹ 50.00 Lakhs",
    status: "Completed",
    duration: "2018-2021",
    pi: "Dr. S. Sakthivel Murugan",
    copi: "Dr. N. Padmapriya",
    team: ["M. Dhana Lakshmi (JRF)"],
    description: "Underwater exploration creates awareness and knowledge transformation on the lost rich heritage sites mentioned in our epics were not a myth. Here, the project focuses on exploration of the buried objects in Mahabalipuram and Poompuhar shoreline. In Mahabalipuram, It is believed that only one shore temple is in existence out of seven shore temples built. Tsunami struck in the year 2004 pulled back the water from shore. People then witnessed the presence of wall like structures in the ocean. Archaeological Survey of India(ASI) then conducted explorations which brought light to Huge wall structures and some of the small structures around 5-8m depth. Similarly the well-known Poompuhar which was highly rich in heritage and culture will also be excavated. Hence it is very important for us to preserve our identity and ancient heritage that is submerged in water today. Underwater Submersible vehicle can be used for survey purposes. These captured images are in degradation quality due to the underwater environment. Due to this, the image enhancement method such as Empirical Mode Decomposition (EMD) and Xtended Central Symmetric Local Binary Pattern (XCS-LBP), Visibility improvement technique with weighted filter are applied on submersible images to extract the texture feature. On Feature Extraction, Different keypoint detector and mapping algorithms are considered for the extraction of keypoints (features). It is observed that the Scale Invariant Feature Transform (SIFT) with Fast Library for Approximate Nearest Neighbor Search (FLANN) and RANdom Sample Consensus RANSAC have shown superior results. Underwater Image Classification system using deep learning can be developed to classify the submerged objects.",
    publicationCount: 20,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "ext-3",
    type: "external",
    title: "Implementation of Magnetic Induction based Underground Sensor Network for Smart Irrigation",
    fundingAgency: "Tamil Nadu State Council for Science & Technology (TNSCST)",
    amount: "₹ 8.70 Lakhs",
    status: "Completed",
    duration: "2017-2020",
    pi: "Dr. S. Sakthivel Murugan",
    copi: "Dr. K. Muthumeenakshi",
    team: ["M. Vimal Raj", "S. Swathi"],
    description: "India is primarily an agriculture-based country and agriculture depends on monsoon. Recently due to climatic conditions monsoon has become uncertain which makes farmer opt for irrigation. This emphasizes farmers to efficiently utilize the scarcely available water for high yield. Hence, this project focuses on introducing a novel idea of using magnetic induction (MI) coils for underground (UG) communication to achieve efficient agricultural data transfer for smart irrigation. MI sensor system prototype including moisture sensor, temperature sensor, transceiver coils, microcontroller etc. for analyzing various agriculture parameters such as soil moisture, air humidity, temperature, soil nutrients. MI sensor system prototype was developed; agricultural data from different parts of the field is collected by MI communication and sent to user’s mobile app through cloud. IoT based app is developed for easy access of field sensor data in mobile. The real field is monitored and their data is recorded through Blynk app. Prototype was successfully tested at in-lab UG test bed and real time field by deploying various sensors at a distance of 1m. In future additional sensors pertaining to soil pH and nutrient content will be included.",
    publicationCount: 7,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "ext-4",
    type: "external",
    title: "Design & Hardware Implementation of Adaptive Algorithm for Wind Driven Ambient Noise in Shallow Water",
    fundingAgency: "National Institute of Ocean Technology (NIOT)",
    amount: "₹ 20.64 Lakhs",
    status: "Completed",
    duration: "2010-2013",
    pi: "Dr. S. Radha",
    copi: "Dr. S. Sakthivel Murugan",
    description: "The contribution of this work is the development of signal enhancement for underwater channels against ambient noise. The methods adapted for the signal enhancement is the use of adaptive algorithms that have fast and stable convergence and implementation of the adaptive algorithms in hardware. The efficacy of the proposed techniques is verified with real time noise data, collected from the shallow region of the Bay of Bengal. A family of adaptive filtering algorithms is applied for noise reduction in an underwater environment. The Least Mean Square (LMS), Normalized LMS (NLMS) and Kalman based Normalized Least Mean Square (KLMS) adaptive algorithms are analyzed in terms of their performance, with the aid of performance measure characteristics such as Signal to Noise Ratio (SNR) and Mean Square Error (MSE). The analysis is carried out for source signals with a frequency range of 100 Hz to 10 KHz, and the algorithms are designed to reconstruct the source signals against the presence of ambient noise in this frequency range. Finally, the KLMS adaptive filtering algorithms are implemented in hardware for real time applications and the results are validated.",
    publicationCount: 0,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  
  // INTERNAL FUNDED PROJECTS
  {
    id: "int-1",
    type: "internal",
    title: "Design and Development of Indigenous Research based Inspection Class Remotely Operated Vehicle (ROV)",
    fundingAgency: "SSNCE Internal Funding",
    amount: "₹ 9.50 Lakhs",
    status: "Completed",
    duration: "2018-2020",
    pi: "Dr. S. Sakthivel Murugan",
    copi: "Dr. K. Murugesan, Dr. R. Vimal Samsingh",
    team: [
      "Tejaswini Panati", "Vishal M", "Raksshitha N J", "Sai Deepika I",
      "Vigneshwar Veeravagu", "Hashmat Banday", "Anirudh Anand",
      "Karthik Raja Anandan", "Nivedhitha D", "Karthick D",
      "Harsha Thippa Ramesh", "Sandhya B"
    ],
    description: "The main objective of this project is to design and develop an Inspection-class Remotely Operated Vehicle (ROV) that can operate in ocean conditions for inspection and surveillance purpose, to create a repository of the images and inspection data collected underwater. Remotely Operated Vehicles (ROVs) are mobile robots, which find their advantage in various underwater applications like surveillance and inspection of head race tunnels, ocean floor exploration, search, and rescue operation. Team Starboard has successfully developed one such inspection class ROV named ORCA for primary application of inspection underwater, specifically, inspection of silt detection inside the head race tunnels. Orca is an open frame low-cost ROV, 500 x 350 x 210 cm in dimension and weighs 8 kgs , built using HDPE and is neutrally buoyant. To enclose the electronics a watertight acrylic enclosure with Aluminum end caps were used. It is mounted with Six Blue Robotics T200 thrusters where four thrusters were vectored at 45° helping in the horizontal motion along with two vertical thrusters to dive. The vehicle can surge, sway, dive, roll and head actively. A voltage of 14.8V from the battery has been stepped down to 5V by using a buck converter to power up the electronics and the sensors of the system. ORCA is equipped with a DS18B20 temperature sensor and DFRobot analog pressure sensor to study the temperature and pressure variations underwater respectively. The 9-axis Honeywell HG1120 IMU mounted on the electronic tray gives us the vehicle’s current acceleration, gyroscope and magnetometer readings along x, y and z axes respectively. A PID control system was implemented to minimize the positional errors and drift of the vehicle. MOOS-IvP, a robust software architecture predominantly used for autonomous operation has been incorporated into the system for precise navigation and control which enables shuffling between remote and autonomous modes of operation. A Blue Robotics Low Light HD USB camera is also mounted in the vehicle for live streaming and capture of images underwater. A detailed simulation analysis of the vehicle was carried to ensure that the vehicle was sturdy and intact to handle the challenging ocean conditions. Preliminary tests such as buoyancy test, leak test, and bench test were successfully carried, and the vehicle was deployed in a nearby pool and easily maneuvered.",
    publicationCount: 4,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "int-2",
    type: "internal",
    title: "Establishment of Underwater Acoustic Test Tank",
    fundingAgency: "SSNCE Internal Funding",
    amount: "₹ 6.00 Lakhs",
    status: "Completed",
    duration: "Sanctioned Year: 2019",
    description: "The underwater acoustic research lab was established with an essential equipments in the field of underwater acoustic signal processing. The main objective of the project is to establish the Underwater test tank with dimensions of 5m length, 4 m diameter and 2.5 m depth (5x4x2.5) with total water capacity of 52000 litres approximately to test those equipments. This will help in undergoing various researches on coherence analysis study, ambient noise characteristics, animal bioacoustics, absorption and scattering loss pattern modeling and analysis, testing of underwater systems such as Remotely Operated Vehicle (ROV), Ambient noise measurement system, Buried Object Detection (BOD) etc.",
    publicationCount: 0,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "int-3",
    type: "internal",
    title: "Enhancement of Underwater Acoustic Research Lab",
    fundingAgency: "SSNCE Internal Funding",
    amount: "₹ 3.40 Lakhs",
    status: "Completed",
    publicationCount: 0,
  },
  {
    id: "int-4",
    type: "internal",
    title: "Data Collection for Characterisation of Underwater Ambient Noise at Bay of Bengal",
    fundingAgency: "SSNCE Internal Funding",
    amount: "₹ 2.85 Lakhs",
    status: "Completed",
    publicationCount: 0,
  },
  {
    id: "int-5",
    type: "internal",
    title: "Development of Underwater Acoustic Research Lab",
    fundingAgency: "SSNCE Internal Funding",
    amount: "₹ 7.00 Lakhs",
    status: "Completed",
    publicationCount: 0,
  },

  // STUDENT FUNDED PROJECTS
  {
    id: "stud-1",
    type: "student",
    title: "Enhancement and Restoration of blurred underwater images.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.28 Lakhs",
    role: "Project Supervisor",
    duration: "2023-2025",
    status: "Completed"
  },
  {
    id: "stud-2",
    type: "student",
    title: "Hybrid underwater energy harvesting system using ocean water and solar cell.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2023-2025",
    status: "Completed"
  },
  {
    id: "stud-3",
    type: "student",
    title: "Amphibious waterbody and beach cleaning BOT.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.28 Lakhs",
    role: "Project Supervisor",
    duration: "2023-2025",
    status: "Completed"
  },
  {
    id: "stud-4",
    type: "student",
    title: "Passive acoustic detector for monitoring of underwater mammals.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.30 Lakhs",
    role: "Project Supervisor",
    duration: "2022-2024",
    status: "Completed"
  },
  {
    id: "stud-5",
    type: "student",
    title: "Arming and automation of remotely operable vehicles (RoV).",
    fundingAgency: "SSNCE",
    amount: "₹ 0.29 Lakhs",
    role: "Project Supervisor",
    duration: "2022-2024",
    status: "Completed"
  },
  {
    id: "stud-6",
    type: "student",
    title: "Development of autonomous navigation suite for an underwater vehicle (UWV).",
    fundingAgency: "SSNCE",
    amount: "₹ 0.30 Lakhs",
    role: "Project Supervisor",
    duration: "2022-2023",
    status: "Completed"
  },
  {
    id: "stud-7",
    type: "student",
    title: "Experimental study of permanent magnet linear generator for underwater wave motion.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2020",
    status: "Completed"
  },
  {
    id: "stud-8",
    type: "student",
    title: "Design and testing of metamaterial enhanced magnetic induction based underground communication.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.24 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2020",
    status: "Completed"
  },
  {
    id: "stud-9",
    type: "student",
    title: "Enhancement of Underwater Images Using Image Restoration Techniques",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-10",
    type: "student",
    title: "Prototype Development of energy harvesting system using acoustic signals from Aircraft engines.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-11",
    type: "student",
    title: "Design and development of a Chassis for a remotely operated vehicle.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-12",
    type: "student",
    title: "Thrust control for an inspection class mini-ROV.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2020",
    status: "Completed"
  },
  {
    id: "stud-13",
    type: "student",
    title: "Prototype of position tracking in a remotely operated vehicle using sensors.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-14",
    type: "student",
    title: "Geo acoustic inversion study to classify the sediments and determine the sediment depth.",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-15",
    type: "student",
    title: "Prototype Implementation of IoT in underwater using Lifi Technology",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2019",
    status: "Completed"
  },
  {
    id: "stud-16",
    type: "student",
    title: "Designing the stack arrangement of galvanic cell for energy harvesting in underwater",
    fundingAgency: "SSNCE",
    amount: "₹ 0.20 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2018",
    status: "Completed"
  },
  {
    id: "stud-17",
    type: "student",
    title: "Development of Smart electricity energy management system for smart campus using IoT",
    fundingAgency: "SSNCE",
    amount: "₹ 0.22 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2018",
    status: "Completed"
  },
  {
    id: "stud-18",
    type: "student",
    title: "Prototype development of energy harvesting system using sea water activated battery for underwater applications",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2019",
    status: "Completed"
  },
  {
    id: "stud-19",
    type: "student",
    title: "Design and development of Insulation tester",
    fundingAgency: "SSNCE",
    amount: "₹ 0.18 Lakhs",
    role: "Project Supervisor",
    duration: "2016-2017",
    status: "Completed"
  },
  {
    id: "stud-20",
    type: "student",
    title: "Development of an energy harvesting microbial fuel cell system using marine sediment for underwater applications",
    fundingAgency: "SSNCE",
    amount: "₹ 0.30 Lakhs",
    role: "Project Supervisor",
    duration: "2014-2015",
    status: "Completed"
  },
  {
    id: "stud-21",
    type: "student",
    title: "Development of wind speed frequency distribution algorithm and its implementation with DSP based hardware for real time graphical representation",
    fundingAgency: "SSNCE",
    amount: "₹ 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2014-2015",
    status: "Completed"
  },

  // PHD RESEARCH PROJECTS
  {
    id: "phd-1",
    type: "phd",
    scholar: "R. Sathya Priya",
    researchArea: "Automated Identification and Classification of Underwater Images",
    status: "Coursework Completed",
    publicationCount: 1,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-2",
    type: "phd",
    scholar: "M. Vimal Raj",
    researchArea: "Deblurring and Enhancement of Underwater Motion Blurred Images",
    status: "Thesis Submitted",
    description: "Exploration of Underwater Images will be a challenging task due to its degradations by haze, blur, color cast and noise. In order to extract the latent information from the blurred portion, its parameters are estimated and various algorithms were analyzed. Initially, length and angle of motion blurred image are estimated. Then, filters and restoration algorithms were implemented for controlling of ringing artifacts, removal of noise and latent information restoration. Some of the model based classical methods were implemented and analyzed for underwater motion blurred image restoration.",
    publicationCount: 6,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-3",
    type: "phd",
    scholar: "R. Logeshwaran",
    researchArea: "Optimization of Cluster-Based Routing Protocol for AUV Localization",
    status: "Thesis Submitted",
    description: "Underwater communication has turned into a prominent research region in deep-sea investigation, undersea navigation, and control of automated underwater vehicles (AUVs). Acoustic communication is the most liable and universally accepted method in underwater medium because of the low attenuation (signal reduction) of sound in water. The operation of underwater acoustic communication (UWAC) structure is rendered challenging by factors such as limited available bandwidth, long propagation delay, huge Doppler spread, time-varying channel conditions, salinity and diverse pressure conditions. The vital applications of Underwater Wireless Sensor Networks (UWSN) are underwater military surveillances and underwater research. The current progressions in innovation, the outline of sensor networks was reborn to a new era of monitoring the global physical entity. These design advancements cleared a path to the disclosure of new unopened insider secrets in the field of marine habitats, deep sea environments and ice sheets explorations. This research gives a proficient technique for packet transmission in a selective frequency to enhance the scope and network between the sensor AUV’s which are in observation under secluded ocean. Scientific model is utilized to portray the dynamic changes in the sea. The channel model has been established considering all the channel properties under the sea. The AUVs are connected to a cluster-based network and an efficient cluster-based routing protocol (CBRP) is used to convey the 3-D location of the AUVs. By selecting an optimum frequency for transmitting the routing packets, overall life time of the network is extended with least routing delay. CBRP Technique is utilised to limit the channel impairments as a result of its vigour against excessively restricted transmission capacity and recurrence reuse. The simulation results of the proposed algorithm show better connectivity and coverage between the surveillance AUVs and to communicate their location with one another.",
    publicationCount: 3,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-4",
    type: "phd",
    scholar: "K. Balaji",
    researchArea: "Blue-Green Spectral Channel Characterization and Analysis of Channel Losses for Underwater Optical Wireless Communication",
    status: "Thesis Submitted",
    description: "One third of Earth is covered with water. Earth is also called as blue planet. Communication in underwater faces a lot of challenges due to underwater environment. Some of the challenges include Transmitter and Receiver Configurations, Transmission Wavelength, Solar Background and Transmission Protocol. Communication is broadly classified into Wired and Wireless communication. The wired communication includes Coaxial cable, Optical fiber communication etc..,. The wireless communication includes RF communication, optical communication, Magnetic Induction, Acoustic Communication, etc..,. For Underwater Environment, Acoustic and optical communication are possible. Acoustic communication suffers due to lack of Speed, high latency, low data rate and less bandwidth. Optical communication in Underwater overcomes the above drawbacks and provides the better solution. For Implementing Optical Communication in Underwater Environment, we utilized Bio-Optical Model of underwater. Various channel Losses like Absorption, Scattering and Attenuation were analyzed in detail using optical in Underwater Communication. Suitable wavelength (λ=532 nm) for using optical in Underwater Communication was found using Bio-Optical Model of Underwater. It is concluded that Green light is suitable for Optical Communication in underwater Environment.",
    publicationCount: 6,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-5",
    type: "phd",
    scholar: "M. Somasekar",
    researchArea: "Analysis of Underwater Image Enhancement Techniques based on Contrast and Edge Preservation",
    status: "Completed",
    description: "The ocean possesses vast treasures of ancient submerged remains. The last two decades have witnessed numerable ventures of underwater ancient discoveries. The object detection methodology is most widely used to trace the submerged objects in terms of image that were captured from modern maritime Side Scan Sonar (SSS) device. The images are usually of low color contrast due to varying lighting conditions. Moreover, this leads to loss of object texture and hence difficult to retrieve an object present on SSS image. This prompts an enhancement preprocessing prior to feature extraction. A comparative analysis on the different enhancement techniques such as Histogram Equalization, Contrast Stretching, EMD with Optimal have been considered in enhancing the side scan sonar images and corresponding enhancement processing. Exploratory outcomes demonstrate that EMDW technique can acquire exact edge information and improved Visual Appearance. The Empirical Mode Decomposition with Optimal Weight (EMDW) picture upgrade procedure has been utilized to enhance the nature of sonar pictures. However, there is a scope in improvising the contrast and detailed analysis on the various contrast enhancement techniques are in progress. Some of the feature extraction methods investigated includes Support Vector Machine (SVM) and YOLO. These are prone to time consumption. This research is directed towards evolving an effective preprocessing technique for feature extraction using the above mentioned algorithms with updations and advancements on the same.",
    publicationCount: 6,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-6",
    type: "phd",
    scholar: "G. Annalakshmi",
    researchArea: "Feature Descriptors and Optimization Techniques for Classification of Coral Images",
    status: "Completed",
    description: "The marine environment covers approximately 70% of the earth’s surface. In general, the classification of sea bottom characteristics has become an essential tool for various applications including marine resource investigations, marine environmental monitoring, coastal engineering, geotechnical engineering and scientific research. The traditional means of sediment surveying by direct sampling cannot be used on a large scale, as it is a complex and time-consuming process. Hence, the automatic processing of images with its visual contents based on different features like colour, shape and texture. In this work a texture based feature extraction method is carried to categorize the different types of ocean bottom sediments. The local feature descriptor play a significant role in texture classification. However, in the traditional local binary pattern (LBP) method, image pixels are converted into a binary pattern based on the relationship between centre and neighbourhood pixels. Here, a novel feature extraction method named LNERBP (Local Neighbourhood Edge Responsive Binary Pattern) is introduced to extract and categorize the reliable texture features from images. Initially, the local intensity difference values of pixels are extracted based on a mutual relationship between odd and even pixel value of a 3x3 image patch. Further, the edge information is extracted using the local directional pattern (LDP) method from all images. The edge response of the image is obtained using a kirsch mask in all the eight directions. Then the encoding condition is applied to both the local intensity and the edge information to create a unique descriptor value. Finally, a new learning algorithm called GMJAYA-ELM combines the Gaussian mutated JAYA (GMJAYA) with an extreme learning machine (ELM) for texture classification. The GMJAYA is used to optimize the input weights and hidden biases of single-hidden-layer feed-forward neural networks (SLFN). The experimental results demonstrate that the proposed approach produces higher performance in terms of accuracy and sensitivity across different classes. The proposed algorithm is validated by comparing the results with traditional learning schemes such as PSO-ELM, GA-ELM, ABC-ELM, Birds fly-ELM, and JAYA-ELM, and the result indicates GMJAYA-ELM superiority.",
    publicationCount: 12,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-7",
    type: "phd",
    scholar: "S. Swathi",
    researchArea: "Enhancement of Magnetic Induction System using Planar Spiral Coils for Underground Communication",
    status: "Completed",
    description: "Earlier researches have proved that magnetic induction (MI) communication has a better performance compared to the electromagnetic (EM) wave propagation in underground (UG) medium as it provides low signal attenuation using small MI coils. In general, non-planar coils are employed as transceivers in the MI UG communication and their performance is dependent on coil parameters. The disadvantages of non-planar coils are their bulkiness and limited transmission distance. A novel idea of using compact filamentary planar spiral coils for MI UG communication is proposed to achieve higher received power at a greater transmission distance. An enhanced MI channel model is also proposed to study the medium's influence on MI performance accurately by considering different soil characteristics. Performances of circular and square coils in the MI system are evaluated based on mutual inductance, path-loss, received power, and signal-to-noise ratio. The performance comparison suggests that the filamentary planar spiral square coil achieves 9.22% higher received power than the filamentary planar spiral circular coil. Moreover, the lateral and angular misalignment study shows that square coils are more tolerant to misalignments. For the proposed filamentary planar square spiral coil (FPSSC), the influence of coil parameters, channel parameters, and coil misalignment on the received power was carried out and its least sensitive and most sensitive parameters were identified for further optimization. The performance comparison between the proposed FPSSC and the traditional non-planar MI coil system suggests that the received power of the proposed system is improved by around 47- 49dBm thus extending the achievable transmission distance.",
    publicationCount: 7,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-8",
    type: "phd",
    scholar: "S. Mary Cecilia",
    researchArea: "Dehazing Algorithms for Visibility Improvement of Degraded Single Underwater Images",
    status: "Completed",
    description: "Underwater Images are of degraded quality due to the scattering and absorption. The color cast and turbidity that hinder the visibility of such images are due to the sediments present that vary for diverse environments. Shallow water images are very turbid. The images too suffer from negative effects of artificial illumination when capturing data. Here a two-step approach is formulated to restore and enhance the underwater images from different locations. The images are then blended using a wavelet fusion considering the mean of the images. The output images demonstrate reduced haze, improved contrast and enhanced sharpness with adequate removal of the color cast. The results project better visibility on both subjective and objective measures compared to recent restoration and enhancement methods.",
    publicationCount: 5,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-9",
    type: "phd",
    scholar: "M. Dhana Lakshmi",
    researchArea: "Enhancement and Classification of Underwater species images using Transfer Learning Neural Network",
    status: "Completed",
    description: "Underwater navigation and intelligent object recognition require robust machine learning algorithms to operate in turbid water. Modern life created the man-made pollution in oceans, rivers, and lakes, which contaminate our water resources. The underwater vehicle can be used for survey purposes. Submersible captured images are in degradation quality due to the underwater environment. To overcome this, Enhancement experimental analyses are carried out for both Image Formation Model (IFM) - free and IFM-based techniques. It is observed that proposed visibility improvement techniques have shown overwhelming qualitative observation. For the classification of submerged objects in the captured imagery, the Convolutional neural Network (ConvNet) is trained. Finally, the feature map size is condensed and complex features are extracted and passed into a neural network. The output of the network results in a probability distribution over L classes. Stochastic gradient descent with ADAM optimizer is used to square the gradients in order to scale the learning rate and reduces the difference between the actual and predicted classes. It is found that the proposed ConvNet underwater image recognition detector, achieves good accuracy than the existing multiclass detector.",
    publicationCount: 10,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  }
];

export interface EquipmentRecord {
  id: string;
  name: string;
  category: "underwater-platforms" | "acoustic-systems" | "test-facilities" | "sensors-comm" | "field-equipment";
  shortDescription?: string;
  specs?: { label: string; value: string }[];
  purpose?: string;
  url?: string;
  image?: string;
  images?: string[];
  thumbnail?: string;
}

export const EQUIPMENT_DATABASE: EquipmentRecord[] = [
  // Underwater Platforms
  {
    id: "eq-1",
    name: "ROVITO-4 ROV",
    category: "underwater-platforms",
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-2",
    name: "ORCA Remotely Operated Vehicle (ROV)",
    category: "underwater-platforms",
    specs: [
      { label: "Dimensions", value: "500 x 350 x 210 cm" },
      { label: "Weight", value: "8 kg" },
      { label: "Material", value: "High-density Polyethylene (HDPE) frame" },
      { label: "Propulsion", value: "6 Blue Robotics T200 thrusters (4 vectored, 2 vertical)" },
      { label: "Payload Camera", value: "Blue Robotics Low Light HD USB Camera" },
      { label: "Enclosure", value: "Acrylic pressure cylinder with aluminum end caps" },
      { label: "Sensors", value: "Honeywell HG1120 9-axis IMU, DS18B20 Temp, DFRobot pressure" }
    ],
    purpose: "Remotely Operated Vehicle designed for inspection of head race tunnels, ocean floor exploration, search, and rescue operations.",
    url: "https://sites.google.com/prod/view/uwarlssn/rd/consortium?authuser=0",
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-3",
    name: "SOFAR Trident - Underwater Drone",
    category: "underwater-platforms",
    url: "https://www.sofarocean.com/products/trident"
  },
  {
    id: "eq-4",
    name: "Trident Controller",
    category: "underwater-platforms",
    url: "https://www.sofarocean.com/products/trident"
  },
  {
    id: "eq-5",
    name: "100m Tether & Reel",
    category: "underwater-platforms",
    url: "https://www.sofarocean.com/products/trident"
  },

  // Acoustic & Survey Systems
  {
    id: "eq-6",
    name: "Side Scan Sonar (SSS)",
    category: "acoustic-systems",
    url: "http://www.cmaxsonar.com/towfish.html",
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-7",
    name: "Sonar Transceiver (STR)",
    category: "acoustic-systems",
    url: "http://www.cmaxsonar.com/acquisition.html"
  },
  {
    id: "eq-8",
    name: "Sound Velocity Profiler (SVP)",
    category: "acoustic-systems",
    url: "https://www.valeport.co.uk/products/swift-svp/"
  },
  {
    id: "eq-9",
    name: "Hydrophone 6 Array - Acoustic Receiver",
    category: "acoustic-systems",
    specs: [
      { label: "Manufacturer", value: "CEDICOM Electronics" },
      { label: "Frequency Range", value: "50 Hz - 10 kHz" },
      { label: "Operating Depth", value: "200 m" }
    ]
  },
  {
    id: "eq-10",
    name: "Acoustic Transmitter",
    category: "acoustic-systems",
    specs: [
      { label: "Manufacturer", value: "CEDICOM Electronics" },
      { label: "Frequency Range", value: "50 Hz - 25 kHz" },
      { label: "Operating Depth", value: "100 m" }
    ]
  },

  // Sensors & Communication Systems
  {
    id: "eq-11",
    name: "MEMS Inertial Measurement Unit (IMU)",
    category: "sensors-comm",
    specs: [
      { label: "Manufacturer", value: "Honeywell HG1120" }
    ],
    url: "https://aerospace.honeywell.com/en/learn/products/sensors/hg1120-mems-inertial-measurement-unit"
  },
  {
    id: "eq-12",
    name: "Data Acquisition System (DAS)",
    category: "sensors-comm",
    specs: [
      { label: "Manufacturer", value: "Measurement Computing USB-1608FS-Plus" }
    ],
    url: "https://www.mccdaq.com/usb-data-acquisition/USB-1608FS-Plus-Series"
  },
  {
    id: "eq-13",
    name: "Onboard Underwater Camera",
    category: "sensors-comm",
    specs: [
      { label: "Display", value: "7-inch LCD Monitor" },
      { label: "Resolution", value: "1000 TVL" },
      { label: "Illumination", value: "12pcs IR Infrared LEDs" },
      { label: "Cable", value: "15m Waterproof coaxial" }
    ],
    url: "https://www.eyoyousa.com/eyoyo-ice-fishing-camera-7-inch-lcd-monitor-1000tvl-camera-15m-cable-12pcs-ir-infrared-leds-p00139p1.html"
  },
  {
    id: "eq-14",
    name: "GoPro Underwater Camera",
    category: "sensors-comm",
    specs: [
      { label: "Model", value: "GoPro Hero 12 Black" }
    ],
    url: "https://gopro.com/en/in/shop/cameras/hero12-black/CHDHX-121-master.html"
  },
  {
    id: "eq-15",
    name: "Endoscope Underwater Camera",
    category: "sensors-comm",
    specs: [
      { label: "Model", value: "IWOBAC Inspection Camera" },
      { label: "Resolution", value: "2.0 Megapixels" }
    ],
    url: "https://www.amazon.com/IWOBAC-Inspection-Waterproof-Semi-Rigid-Megapixels/dp/B07YCB6DS2"
  },
  {
    id: "eq-16",
    name: "Handheld Salinity Refractometer",
    category: "sensors-comm",
    url: "https://www.pce-instruments.com/english/measuring-instruments/test-meters/refractometer-pce-instruments-handheld-refractometer-pce-0100-salinity-det_54316.htm"
  },
  {
    id: "eq-17",
    name: "Soil Moisture Sensors",
    category: "sensors-comm",
    url: "https://www.xcluma.com/soil-moisture-meter-testing-module"
  },

  // Test Facilities
  {
    id: "eq-18",
    name: "Underwater Test Tank I",
    category: "test-facilities",
    specs: [
      { label: "Dimensions", value: "12' L x 8' W x 4' H" },
      { label: "Capacity", value: "10,874 Liters" }
    ],
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-19",
    name: "Underwater Test Tank II",
    category: "test-facilities",
    specs: [
      { label: "Dimensions", value: "125cm x 78cm x 65 cm" },
      { label: "Capacity", value: "633.75 Liters" }
    ]
  },
  {
    id: "eq-20",
    name: "Underground Test Bed",
    category: "test-facilities",
    specs: [
      { label: "Dimensions", value: "225cm x 30cm x 30 cm" },
      { label: "Volume", value: "202,500 Cubic cm" }
    ]
  },

  // Field Equipment
  {
    id: "eq-21",
    name: "Portable Winch System",
    category: "field-equipment",
    url: "http://www.cmaxsonar.com/cables.html"
  },
  {
    id: "eq-22",
    name: "Manual Hand Winch",
    category: "field-equipment",
  },
  {
    id: "eq-23",
    name: "Water Sampler",
    category: "field-equipment",
  },
  {
    id: "eq-24",
    name: "Grab Collector",
    category: "field-equipment",
  },
  {
    id: "eq-25",
    name: "Ahuja Power Amplifier",
    category: "field-equipment",
    specs: [
      { label: "Model", value: "Ahuja SSB-120" }
    ],
    url: "https://www.ahujaradios.com/mixer-amplifiers/medium-wattage-pa-mixer-amplifiers/ssb-120supsup.html"
  },
  {
    id: "eq-26",
    name: "Scientific Dual Power Supply",
    category: "field-equipment",
    specs: [
      { label: "Model", value: "PSD3203 (30V, 3A)" }
    ],
    url: "https://www.scientificindia.com/products/PSD3203-30V-3-A-Dual-Power-Supply.aspx"
  },
  {
    id: "eq-27",
    name: "Portable UPS Units",
    category: "field-equipment",
  },
  {
    id: "eq-28",
    name: "Mooring Floats",
    category: "field-equipment",
  },
  {
    id: "eq-29",
    name: "Life Jackets",
    category: "field-equipment",
  }
];

export interface FieldActivityRecord {
  id: string;
  title: string;
  year: number | string;
  location: string;
  date: string;
  equipmentTags: string[] | string;
  activityType: "Survey" | "Data Collection" | "ROV Testing" | "Sea Trial" | "Ocean Expedition" | "Laboratory Validation";
  team?: string[] | string;
  description?: string;
  images?: string[] | string;
  thumbnail?: string;
}

export const FIELD_ACTIVITIES_DATABASE: FieldActivityRecord[] = [
  // 2025
  {
    id: "fa-1",
    title: "Coral Reef Survey - Off Akalmadam",
    year: 2025,
    location: "Off-Akalmadam, Rameswaram",
    date: "10-12 August 2025",
    equipmentTags: ["ROVITO-4 ROV", "Onboard Camera"],
    activityType: "Survey",
    team: ["Dr. M. Vimal Raj", "Mr. S. Sabareesan", "Mrs. Manosundari"],
    description: "Collected underwater coral reef data using the ROVITO-4 ROV camera at the data collection spot Off-Akalmadam, Rameswaram, during the field surveys conducted from 10–12 August 2025.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-2",
    title: "Coral Reef Survey - Off Sippikulam",
    year: 2025,
    location: "Off-Sippikulam, Tuticorin",
    date: "15-16 March 2025",
    equipmentTags: ["ROVITO-4 ROV", "Onboard Camera"],
    activityType: "Survey",
    team: ["Dr. S. Sakthivel Murugan", "Dr. K. Muthumeenakshi", "Mr. M. Vimal Raj", "Mr. Sabareesan", "Dr. Saravanan R", "Mr. Sreenivasan"],
    description: "Collected underwater data using ROVITO-4 ROV and captured the coral reefs data along the coastal area of Off-sippikulam at Tuticorin, from 15th- 16th March 2025.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-3",
    title: "ROV Testing - Kalpakkam",
    year: 2025,
    location: "Off-Kalpakkam",
    date: "8 March 2025",
    equipmentTags: ["ROVITO-4 ROV"],
    activityType: "ROV Testing",
    team: ["Mr. M. Vimal Raj"],
    description: "Tested ROVITO-4 ROV along the coastal area of Off-Kalpakkam on 8th March 2025.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },

  // 2023
  {
    id: "fa-4",
    title: "Sea-bed Mapping Survey - Mahabalipuram",
    year: 2023,
    location: "Off-Mahabalipuram",
    date: "10-13 May 2023",
    equipmentTags: ["Side Scan Sonar (SSS)", "ORV Sagar Manjusha"],
    activityType: "Ocean Expedition",
    team: ["Dr. S. Sakthivel Murugan", "M. Vimal Raj", "Sairithvik", "Rahul"],
    description: "Collected underwater data using Side Scan Sonar (SSS), which captures the structure of the sea-bed using the towfish connected with ORV Sagar Manjusha from Ministry of Earth Sciences for sea bed mapping along the coastal area of Off-Mahabalipuram, from 10th May- 13th May. 2023.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },

  // 2022
  {
    id: "fa-5",
    title: "Side Scan Sonar Testing",
    year: 2022,
    location: "SSN Well & UWARL Test Tank",
    date: "21 & 25 March 2022",
    equipmentTags: ["Side Scan Sonar (SSS)"],
    activityType: "Laboratory Validation",
    team: ["Dr. S. Sakthivel Murugan", "Mr. M. Vimal Raj", "Ms. S. Mary Cecilia", "Ms. G. Annalakshmi", "Ms. M. Dhana Lakshmi", "Ms. S. Swathi"],
    description: "Tested the Side Scan Sonar at SSN Well on 25th March 2022, and deployed the Side Scan Sonar at UWARL Test Tank on 21st March 2022.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-6",
    title: "Underwater Drone Deployment - Kasimedu",
    year: 2022,
    location: "Kasimedu Fishing Harbour",
    date: "10 March 2022",
    equipmentTags: ["Underwater Drone", "GoPro Camera"],
    activityType: "Sea Trial",
    team: ["Mr. M. Vimal Raj", "Ms. M. Dhana Lakshmi", "Mr. Ramnath", "Scuba Divers"],
    description: "Deployed the Underwater Drone with GoPro Underwater Camera at Kasimedu Fishing harbour (lat. 13° 13'N and long. 80° 30'E) on 10th March 2022.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },

  // 2020-2021
  {
    id: "fa-7",
    title: "Underwater Drone Deployment - Various Locations",
    year: "2020-2021",
    location: "Chengalpattu Lake, Aquaculture Tank",
    date: "Dec 2020 - Aug 2021",
    equipmentTags: ["Underwater Drone", "GoPro Camera"],
    activityType: "Data Collection",
    team: ["Dr. S. Sakthivel Murugan", "Mr. M. Vimal Raj", "Ms. S. Mary Cecilia", "Mr. M. Somasekar", "Mr. R. Logeshwaran", "Mr. K. Balaji", "Ms. M. Dhana Lakshmi"],
    description: "Deployed the Underwater Drone at various locations between Dec 2020 and Aug 2021. On 14th August 2021, captured underwater images near Chengalpattu lake at 12.71° N 79.98° E. On 9th Dec 2020 and 2nd Aug 2021, the drone was deployed on aquaculture tank at 12.81° N 80.24° E.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-8",
    title: "Testing of Underwater Drone",
    year: "2020-2021",
    location: "SSN Fountain",
    date: "28 November 2020",
    equipmentTags: ["Underwater Drone"],
    activityType: "Laboratory Validation",
    team: ["Dr. S. Sakthivel Murugan", "Mr. M. Vimal Raj", "Ms. S. Mary Cecilia", "Ms. M. Dhana Lakshmi"],
    description: "Tested the Underwater Drone at SSN Fountain on 28th Nov. 2020.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-9",
    title: "Primary Qualitative Optical Data Collection",
    year: "2020-2021",
    location: "Kovalam Backwaters",
    date: "5 March 2020",
    equipmentTags: ["GoPro Camera", "Endoscope Camera"],
    activityType: "Data Collection",
    team: ["M. Vimal Raj", "S. Mary Cecilia", "Sukanthi Kannan"],
    description: "Endeavored to get underwater images from the backwaters near Kovalam (lat. 12° 46'N and long. 80° 18'E). The devices used are GoPro for capturing videos, endoscope camera, and a laptop for on board monitoring.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-10",
    title: "Underwater Image Collection",
    year: "2020-2021",
    location: "Lake at 13.1079° N, 80.1059° E",
    date: "6 March 2020",
    equipmentTags: ["GoPro Camera"],
    activityType: "Data Collection",
    team: ["M. Vimal Raj", "G. Annalakshmi", "S. Mary Cecilia"],
    description: "Strived to capture underwater images from a lake at 13.1079° N lat and 80.1059° E long.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },

  // 2019
  {
    id: "fa-11",
    title: "On-Shore Data Collection - Mahabalipuram",
    year: 2019,
    location: "Shore Temple, Pancha Rathas & Arjuna's Penance",
    date: "28 November 2019",
    equipmentTags: ["Nikon Coolpix", "Nikon D5200"],
    activityType: "Data Collection",
    team: ["G. Annalakshmi", "M. Vimal Raj", "M. Dhana Lakshmi", "S. Mary Cecilia"],
    description: "A team of Image Processing research scholars undertook a data collection expedition to Mahabalipuram to collect the images of the ancient structures at Shore Temple, Pancha Rathas and Arjuna’s Penance on the 28th of November 2019. The videos and images were captured with a view to study the structures and textures of the monuments.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-12",
    title: "Testing of ROV - Pondicherry",
    year: 2019,
    location: "Pondicherry Coastal area",
    date: "10 April 2019",
    equipmentTags: ["ORCA ROV"],
    activityType: "Sea Trial",
    team: ["Dr. S. Sakthivel Murugan", "Vigneshwar Veeravagu"],
    description: "Took part in the testing of ROV arranged by Hexiqon Technologies at Pondicherry on 10th Apr. 2019.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },

  // 2018
  {
    id: "fa-13",
    title: "MBES Survey Campaign",
    year: 2018,
    location: "Off-Chennai, Off-Mettukuppam, Off-Mahabalipuram, Off-Kalpakkam",
    date: "29 Aug - 2 Sep 2018",
    equipmentTags: ["Multi-Beam Echo Sounder (MBES)", "ORV Sagar Manjusha"],
    activityType: "Ocean Expedition",
    team: ["Dr. S. Sakthivel Murugan", "R. Logeswaran", "M. Somasekar", "M. Vimal Raj", "S. Swathi", "M. Dhana Lakshmi", "B. Arunkumar"],
    description: "Collected underwater data using Multi-Beam Echo Sounder (MBES) which captures the structure of the sea-bed mounted at the bottom of ORV Sagar Manjusha from Ministry of Earth Sciences for various studies along the coastal areas of Off-Chennai, Off-Mettukuppam, Off-Mahabalipuram, Off-Kalpakkam from 29th Aug - 2nd Sep. 2018.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },

  // 2017
  {
    id: "fa-14",
    title: "Sagar Purvi Expedition",
    year: 2017,
    location: "Off-Chennai, Off-Mahabalipuram, Off-Kalpakkam, Off-Pondicherry, Off-Cuddalore, Off-Poompuhar",
    date: "6-8 August 2017",
    equipmentTags: ["Hydrophone Array", "CTD", "Grab Collector", "Water Sampler", "Sagar Purvi ship"],
    activityType: "Ocean Expedition",
    team: ["Dr. S. Sakthivel Murugan", "G. Annalakshmi", "R. Logeswaran", "M. Somasekar", "Sneha"],
    description: "Collected underwater data along with NIOT using the ship Sagar Purvi from Ministry of Earth Sciences for various studies along the coastal areas from 6th – 8th Aug. 2017. Deployed six-channel hydrophone array, CTD, grab collector and water sampler.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },

  // Undated
  {
    id: "fa-15",
    title: "Ambient Noise Data Collection",
    year: "Undated",
    location: "Offshore Chennai Coast",
    date: "Estuary Trial Run",
    equipmentTags: ["Hydrophone Array", "Acoustic Transmitter", "DAS"],
    activityType: "Data Collection",
    description: "A set of ambient noise data was collected at off shores, Chennai using the vertical linear array of hydrophones deployed at various locations at 15 m depth. The data were collected at a wind speed of 2m/s to 7m/s.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  }
];
