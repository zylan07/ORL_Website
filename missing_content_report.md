# Missing Content Report: ORL Website Audit & Migration Strategy

This audit compares the existing UnderWater Acoustic Research Lab (UWARL) Google Site contents and administrative records with the current Ocean Research Laboratory (ORL) codebase to ensure complete migration.

---

## 1. Audit Summary by Section

### About ORL

- **Missing Overview details**: Add relocation context to NITTTR Chennai (September 2024), full description of laboratory research scopes, and founder history.
- **Missing Vision & Mission**: Need complete, comprehensive statements matching the historical UWARL mandate.
- **Missing History & Evolution**: Detail the chronology: 2015 (Foundation at SSN College of Engineering ECE department) &rarr; 2024 (Relocation to NITTTR Chennai under ECE department).
- **Missing Laboratory Evolution**: Highlight the expansion of research tools (moving from simple indoor tanks to full side-scan sonar and ROV sea trials).

### Research

- **Missing Research Areas**: Detail the 4 core pillars: Underwater Acoustics & Telemetry, Subsea Robotics & Vehicle Control, Bio-acoustics & Marine Habitat Classification, and Optical Signal Processing & Image Restoration.
- **Missing Projects**: Detail the seawater galvanic energy harvesting research (SSN Research Trust funded) and the design of the "ORCA" ROV.
- **Missing Research Outcomes**: Mention guide roles (Ph.D. guidance), SIH 2022 Hackathon wins (Team Kyogre), and academic paper benchmarks.
- **Missing Current Research**: Profile active research items: MIMO acoustic propagation channels, ocean noise profiles, and image de-turbidity.

### Facilities

- **Missing Equipment list**: Catalog hydrophone arrays, transducers, NI-DAQ acquisition cards, Sound Velocity Profilers, and underwater cameras.
- **Missing Test Facilities**: Provide detailed specifications of the **10,874-liter Indoor Acoustic Test Tank** (dimensions: 12' L x 8' W x 4' H) used for sensor calibration.
- **Missing Underwater Systems**: Technical specifications of the in-house built inspection-class Remotely Operated Vehicle "ORCA" (buoyancy, depth sensors, thrusters, tether).
- **Missing Instruments**: Document field tools: Side-Scan Sonar (SSS) and Sound Velocity Profilers (SVP) used in estuary trials.

### Field Activities

- **Missing Surveys**: Profile ambient noise characterization surveys in Chennai coastal regions and Bay of Bengal gradients.
- **Missing Data Collection**: Explain acoustic ray-tracing, ocean temperature profiles, salinity logs, and video data captures of coral reefs.
- **Missing Sea Trials**: Describe the estuary and open water testing of the "ORCA" ROV and sensor arrays.
- **Missing Expeditions**: Highlight collaborative deployments with the National Institute of Ocean Technology (NIOT) and local coastal survey runs.

### People

- **Missing Faculty info**: Dr. S. Sakthivel Murugan's educational credentials, tenure, research interests, and publication history.
- **Missing Scholars**: Profiles of graduated Ph.D. scholars (Dr. S. Mary Cecilia, Dr. S. Swathi) and active candidates (Ms. Hasthi Gowthami, Mrs. Sukanthi Kannan).
- **Missing Project Staff**: Mr. K. Balaji (Project Associate) and Mr. M. Vimalraj (Technical Assistant).
- **Missing Alumni**: Mubeena Parveen (M.Tech) and Team Kyogre (SIH Winners).

### Collaborations & Consultancy

- **Missing MoUs**: Detail collaboration agreements with the National Institute of Ocean Technology (NIOT), Chennai, and partnerships with Indian Institute of Technology (IIT) Madras.
- **Missing Research & Industry Partnerships**: Detail consultancy services offered to students, academic institutions, and defense research organizations.

### Gallery

- **Missing Photos & Categories**: Map visual categories for Research, Field, Facilities, Events, and Internships using real images (`academic_seminar.png`, `underwater_robot.png`, `laboratory_workspace.png`) with clear captions.

### Contact

- **Missing contact details**: Exact telephone (+91 44 2254 5400) and mail handles (orl@nitttrc.ac.in), interactive Google Map pointing to NITTTR Chennai (Taramani), and verified social profiles.

---

## 2. Migration Plan

All missing content will be directly integrated into the React route components (`about.tsx`, `research.tsx`, `facilities.tsx`, `field-activities.tsx`, `people.tsx`, `collaborations-consultancy.tsx`, `contact.tsx`, `gallery.tsx`, and `index.tsx`) to eliminate stub content and make the website complete.
