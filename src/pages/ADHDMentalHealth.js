
import { useState, useEffect } from 'react';
import DirectBookingModal from '../component/DirectBookingModal';
import LoginModal from '../component/LoginModal';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import '../styles/ADHDMentalHealth.css';

function ADHDMentalHealth() {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true);
  const [isDirectBookingModalOpen, setIsDirectBookingModalOpen] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingDoctorForBooking, setPendingDoctorForBooking] = useState(null);

  // Fetch doctors from APIs on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        // Fetch from both APIs
        const [psychiatryResponse, psychiatristResponse] = await Promise.all([
          fetch('https://directoryapi.virtualtriage.ai/doctors/specialities/?speciality=psychiatry'),
          fetch('https://directoryapi.virtualtriage.ai/doctors/specialities/?speciality=Psychiatrist')
        ]);

        const psychiatryData = await psychiatryResponse.json();
        const psychiatristData = await psychiatristResponse.json();

        // Combine doctors from both APIs
        const allDoctors = [
          ...(psychiatryData.data?.data || []),
          ...(psychiatristData.data?.data || [])
        ];

        // Remove duplicates based on _id
        const uniqueDoctors = Array.from(
          new Map(allDoctors.map(doctor => [doctor._id, doctor])).values()
        );

        // Transform API data to match component structure
        const transformedDoctors = uniqueDoctors
          .filter(doctor => doctor.status !== false && doctor.verified !== false) // Only show verified and active doctors
          .map((doctor, index) => {
            // Get location string
            const location = doctor.locations && doctor.locations.length > 0
              ? `${doctor.locations[0].city ? doctor.locations[0].city + ', ' : ''}${doctor.locations[0].country || 'United Kingdom'}`
              : 'United Kingdom';

            const speciality = Array.isArray(doctor.speciality) && doctor.speciality.length > 0
              ? doctor.speciality.join(', ')
              : doctor.speciality || 'General Practitioner';

            // Get specialization from subspecialties or speciality
            const specialization = Array.isArray(doctor.subspecialties) && doctor.subspecialties.length > 0
              ? doctor.subspecialties.join(', ')
              : doctor.speciality || 'Psychiatrist';

            // Format experience
            const experience = doctor.experience_years
              ? `${doctor.experience_years} ${typeof doctor.experience_years === 'number' ? 'years' : ''} experience`
              : 'Experienced';

            // Format price
            const price = doctor.new_appointment_fee
              ? `£${doctor.new_appointment_fee}`
              : '£500';

            // Get languages
            const languages = Array.isArray(doctor.languages_spoken) && doctor.languages_spoken.length > 0
              ? doctor.languages_spoken
              : ['English'];

            return {
              id: doctor._id || index,
              name: doctor.full_name || 'Dr. Unknown',
              specialization: specialization,
              speciality: speciality,
              location: location,
              experience: experience,
              price: price,
              isAvailable: doctor.status === true,
              languages: languages,
              nextAvailable: 'Available Soon',
              profilePicture: doctor.profile_picture_url,
              about: doctor.about,
              profileUrl: doctor.profile_url,
              username: doctor.username
            };
          });

        setAvailableDoctors(transformedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        // Fallback to empty array or show error message
        setAvailableDoctors([]);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  // How It Works steps data - ADHD Focused
  const howItWorksSteps = [
    {
      step: '1',
      icon: 'fas fa-file-signature',
      title: 'Pre-Consultation Screening',
      description: 'Complete a structured screening questionnaire used by clinicians to support ADHD consultations'
    },
    {
      step: '2',
      icon: 'fas fa-video',
      title: 'Specialist Consultation',
      description: 'A comprehensive video consultation with a UK-registered clinician'
    },
    {
      step: '3',
      icon: 'fas fa-diagnoses',
      title: 'Clinical Outcome & Documentation',
      description: 'Where appropriate, clinicians may provide written clinical findings and supporting documentation'
    },
    {
      step: '4',
      icon: 'fas fa-prescription',
      title: 'Next-Step Guidance',
      description: 'Clinicians may discuss potential next steps or recommendations based on individual consultations'
    }
  ];

  // Benefits data - ADHD Focused
  const benefits = [
    {
      icon: 'fas fa-user-md',
      title: 'ADHD-Experienced Clinicians',
      description: 'UK-registered psychiatrists with experience in ADHD assessments and consultations.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'Guideline-Aligned Consultations',
      description: 'Consultations are conducted in line with recognised CQC clinical guidelines.'
    },
    {
      icon: 'fas fa-file-medical',
      title: 'In-Depth Consultation',
      description: 'A structured consultation discussing history, current concerns, and daily functioning.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Faster Access to Consultations',
      description: 'Private consultations available sooner than typical NHS waiting times.'
    },
    {
      icon: 'fas fa-comments',
      title: 'Discussion of Next Steps',
      description: 'Clinicians may discuss possible next steps or recommendations following a consultation.'
    },
    {
      icon: 'fas fa-hand-holding-medical',
      title: 'Follow-Up Consultations',
      description: 'Where appropriate, individuals may arrange follow-up consultations directly with their clinician.'
    }
  ];

  // FAQs data - ADHD Focused
  const faqs = [
    {
      question: 'How do online ADHD consultations work?',
      answer: 'Virtual Triage connects individuals with independent, UK-registered clinicians through secure video consultations. The clinician determines how the consultation is conducted and what information is required.'
    },
    {
      question: 'Can adults seek ADHD consultations?',
      answer: 'Yes. Adults of any age may choose to consult with a clinician to discuss ADHD-related concerns and how they present in adulthood.'
    },
    {
      question: 'What evidence do I need for an ADHD assessment?',
      answer: 'Clinicians may request background information to better understand individual concerns. This can vary depending on the clinician and the consultation.'
    },
    {
      question: 'How long does the assessment process take?',
      answer: 'Appointment availability and follow-up timelines vary by clinician.'
    },
    {
      question: "What is Virtual Triage?",
      answer: "Virtual Triage is a digital platform that helps individuals connect with independent, UK-registered clinicians for online consultations."
    },
    {
      question: "Is Virtual Triage a medical provider?",
      answer: "No. Virtual Triage does not provide medical advice, diagnosis, or treatment. All clinical services are delivered independently by clinicians."
    },
    {
      question: "Are consultations online?",
      answer: "Yes. Consultations take place via secure video calls."
    },
    {
      question: "Who are the clinicians on the platform?",
      answer: "Clinicians listed on the platform are independent professionals registered with the appropriate UK regulatory bodies."
    },
    {
      question: "Is Virtual Triage available across the UK?",
      answer: "Yes. The platform is accessible to individuals across the UK."
    }
  ];


  // ADHD Types data - UPDATED WITH CORRECT ICONS
  const adhdTypes = [
    {
      type: 'Predominantly Inattentive Presentation',
      description: 'Previously known as ADD (Attention Deficit Disorder)',
      icon: 'fas fa-eye-slash', // Fixed icon
      symptoms: [
        'Difficulty sustaining attention',
        'Easily distracted',
        'Forgetfulness in daily activities',
        'Poor organizational skills',
        'Avoidance of tasks requiring mental effort'
      ]
    },
    {
      type: 'Predominantly Hyperactive-Impulsive Presentation',
      description: 'Characterized by excessive movement and impulsivity',
      icon: 'fas fa-person-running', // Fixed icon
      symptoms: [
        'Fidgeting and restlessness',
        'Excessive talking',
        'Difficulty waiting turns',
        'Impulsive decision making',
        'Interrupting conversations'
      ]
    },
    {
      type: 'Combined Presentation',
      description: 'Most common type with both inattention and hyperactivity',
      icon: 'fas fa-sync-alt', // Fixed icon
      symptoms: [
        'Symptoms of both inattention and hyperactivity',
        'Often diagnosed in childhood',
        'Affects multiple areas of life',
        'Often involves multiple areas of support',
        'Support strategies may help individuals manage symptoms'
      ]
    }
  ];

  // Life Impact data
  const lifeImpacts = [
    {
      area: 'Academic Performance',
      description: 'ADHD can significantly impact learning, studying, and academic achievement at all levels.',
      icon: 'fas fa-graduation-cap'
    },
    {
      area: 'Workplace Challenges',
      description: 'Difficulty with time management, organization, and task completion affects career progression.',
      icon: 'fas fa-briefcase'
    },
    {
      area: 'Relationships',
      description: 'Impulsivity and inattention can strain personal and professional relationships.',
      icon: 'fas fa-heart'
    },
    {
      area: 'Mental Health',
      description: 'Increased risk of anxiety, depression, and low self-esteem, particularly when symptoms are not well supported.',
      icon: 'fas fa-brain'
    },
    {
      area: 'Daily Living',
      description: 'Challenges with organization, time management, and completing routine tasks.',
      icon: 'fas fa-home'
    },
    {
      area: 'Financial Management',
      description: 'Impulsive spending and difficulty with budgeting and financial planning.',
      icon: 'fas fa-chart-line'
    }
  ];

  // Treatment Options data
  const treatmentOptions = [
    {
      type: 'Therapeutic Support',
      description: 'Some clinicians may explore therapeutic strategies aimed at coping skills and behavioural patterns.',
      details: 'Specifically adapted for ADHD challenges.'
    },
    {
      type: 'ADHD Coaching',
      description: 'Non-clinical coaching approaches that focus on organisation, routines, and practical strategies.',
      details: 'Focuses on real-world strategies for daily challenges.'
    },
    {
      type: 'Lifestyle Factors',
      description: 'General wellbeing practices that some people find helpful alongside professional support.',
      details: 'Comprehensive approach to wellbeing.'
    }
  ];
  

  // Event handlers
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleViewProfile = (doctor) => {
    if (doctor.profileUrl) {
      window.open(doctor.profileUrl, '_blank');
    } else {
      alert(`Viewing profile of ${doctor.name}\n\nSpecialization: ${doctor.specialization}\nSpeciality: ${doctor.speciality}\nExperience: ${doctor.experience}\nLocation: ${doctor.location}\n\nAssessment Fee: ${doctor.price} (includes comprehensive assessment and report)`);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    const authToken = localStorage.getItem('authToken');
    return !!authToken;
  };

  // Handle Book Now button click
  const handleBookNow = (doctor) => {
    if (isAuthenticated()) {
      // User is logged in, open booking modal
      setSelectedDoctorForBooking(doctor);
      setIsDirectBookingModalOpen(true);
    } else {
      // User is not logged in, open login modal and store doctor for later
      setPendingDoctorForBooking(doctor);
      setIsLoginModalOpen(true);
    }
  };

  // Handle successful login
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // If there's a pending doctor, open booking modal
    if (pendingDoctorForBooking) {
      setSelectedDoctorForBooking(pendingDoctorForBooking);
      setIsDirectBookingModalOpen(true);
      setPendingDoctorForBooking(null);
    }
  };

  

  return (
    <div className="adhd-mental-health-app">
      <Navbar />
      {/* Hero Section */}
      <section className="adhd-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-icon-main">
              <i className="fas fa-brain"></i>
            </div>
            <h1>
              Private ADHD Assessments with UK-Registered Specialists
            </h1>
            <h2>Specialist ADHD Assessments | Video Consultations Available</h2>
            <p className="hero-subtitle">
              Connect with independent, UK-registered clinicians for private ADHD assessments via secure video consultations. Assessments are conducted by qualified professionals in line with recognised clinical standards. Appointments are available online, allowing individuals and families across the UK to access specialist consultations without long NHS waiting lists.
            </p>
            <button className="btn btn-large" onClick={() =>
              document.getElementById("doctors-here")?.scrollIntoView({
                behavior: "smooth",
              })
            }>
              <i className="fas fa-clipboard-check"></i> Book an ADHD Consultation
            </button>
            <div className="trust-badges">
              <div className="badge">
                <i className="fas fa-user-md"></i>
                <span>UK-Registered Clinicians</span>
              </div>
              <div className="badge">
                <i className="fas fa-clock"></i>
                <span>Flexible Appointment Availability</span>
              </div>
              <div className="badge">
                <i className="fas fa-shield-alt"></i>
                <span>Guideline-Aligned Assessments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available ADHD Specialists Section */}
      <section className="section available-doctors-section" id='doctors-here'>
        <div className="container">
          <div className="doctors-header">
            <h2 className="section-title">
              ADHD Specialists Available for Consultation
            </h2>
            <p className="section-subtitle">UK-registered psychiatrists providing ADHD consultations for adults and children</p>
          </div>

          <div className="doctors-content">
            <div className="doctors-main">
              {isLoadingDoctors ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#15c0da', marginBottom: '20px' }}></i>
                  <p>Loading doctors...</p>
                </div>
              ) : availableDoctors.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No doctors available at the moment. Please check back later.</p>
                </div>
              ) : (
                <div className="doctors-grid">
                  {availableDoctors.map((doctor) => (
                    <div key={doctor.id} className="doctor-card">
                      <div className="doctor-card-header">
                        <div className="doctor-availability">
                          {doctor.isAvailable ? (
                            <span className="availability-badge available">
                              <i className="fas fa-circle"></i> Available Now
                            </span>
                          ) : (
                            <span className="availability-badge unavailable">
                              <i className="fas fa-clock"></i> Next: {doctor.nextAvailable}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="doctor-image-container">

                        {doctor.profilePicture && (
                          <div className="doctor-image">
                            <img src={doctor.profilePicture} alt={doctor.name} onError={(e) => { e.target.style.display = 'none'; }} />
                          </div>
                        )}

                        <div className="doctor-info">
                          <h3>{doctor.name}</h3>
                          <div className="doctor-speciality">{doctor.speciality}</div>
                          <div className="doctor-specialization">{doctor.specialization}</div>
                          <div className="doctor-location">
                            <i className="fas fa-map-marker-alt"></i> {doctor.location}
                          </div>
                          <div className="doctor-experience">
                            <i className="fas fa-briefcase-medical"></i> {doctor.experience}
                          </div>

                          <div className="doctor-languages">
                            <i className="fas fa-language"></i>
                            <span>{doctor.languages.join(', ')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="doctor-pricing">
                        <div className="price-label">Comprehensive Assessment:</div>
                        <div className="price-amount">{doctor.price}</div>
                      </div>

                      <div className="doctor-actions">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleBookNow(doctor)}
                        >
                          <i className="fas fa-calendar-check"></i> Book Now!
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleViewProfile(doctor)}
                        >
                          <i className="fas fa-user-md"></i> View Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - ADHD Focused */}
      <section className="section how-it-works-section">
        <div className="container">
          <h2 className="section-title">
            The ADHD Assessment Journey
          </h2>
          <p className="section-subtitle">
            A structured, clinician-led consultation process
          </p>

          <div className="steps-container">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="step-card">
                <div className="step-header">
                  <div className="step-icon">
                    <i className={step.icon}></i>
                  </div>
                </div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section - ADHD Focused */}
      <section className="section benefits-section">
        <div className="container">
          <h2 className="section-title">
            Why Use Virtual Triage for ADHD Consultations?
          </h2>
          <p className="section-subtitle">
            A platform connecting you with experienced, independent clinicians
          </p>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">
                  <i className={benefit.icon}></i>
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADHD Information Section - SEO Content */}
      <section className="section adhd-content-section">
        <div className="container">
          <div className="content-wrapper">
            <div className="content-main">
              <h2 className="section-title"> Understanding ADHD in the UK</h2>

              <p>Attention Deficit Hyperactivity Disorder (ADHD) is a neurodevelopmental condition that affects approximately 5% of children and 3-4% of adults in the United Kingdom. Despite common misconceptions, ADHD is not just a childhood condition - many adults continue to experience symptoms that significantly impact their daily lives, careers, and relationships.</p>

              <h3> What is ADHD?</h3>
              <p>ADHD is characterized by persistent patterns of inattention, hyperactivity, and impulsivity that interfere with functioning or development. It's a genetic, brain-based condition that affects executive functions - the cognitive processes that help us plan, focus attention, remember instructions, and juggle multiple tasks successfully.</p>

              <div className="adhd-info-box">
                <p>Important: ADHD is not caused by poor parenting, too much sugar, or lack of discipline. It's a medical condition with strong genetic links, often running in families.</p>
              </div>

              <h3> Common ADHD Symptoms</h3>
              <p>ADHD symptoms can vary significantly between individuals and may change over time. The condition is typically categorized into three presentations:</p>

              <div className="adhd-types-grid">
                {adhdTypes.map((type, index) => (
                  <div key={index} className="adhd-type-card">
                    <div className="adhd-type-icon">
                      <i className={type.icon}></i>
                    </div>
                    <h3>{type.type}</h3>
                    <p>{type.description}</p>
                    <ul>
                      {type.symptoms.map((symptom, idx) => (
                        <li key={idx}>{symptom}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <h3 className='ADHD-affects'>How ADHD Affects Daily Life</h3>

              <div className="impact-grid">
                {lifeImpacts.map((impact, index) => (
                  <div key={index} className="impact-card">
                    <div className="impact-icon">
                      <i className={impact.icon}></i>
                    </div>
                    <h3>{impact.area}</h3>
                    <p>{impact.description}</p>
                  </div>
                ))}
              </div>

              <div className="treatment-process">
                <h3>Common ADHD Support Approaches</h3>
                <p>Effective ADHD management typically involves a multimodal approach tailored to individual needs:</p>

                <div className="adhd-symptoms-grid">
                  {treatmentOptions.map((treatment, index) => (
                    <div key={index} className="symptom-item">
                      <div className="symptom-header">
                        <i className="fas fa-check-circle"></i>
                        <h4>{treatment.type}</h4>
                      </div>
                      <p>{treatment.description}</p>
                      <p><strong>Details:</strong> {treatment.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="when-to-seek-assessment">
                <h3> When to Seek an ADHD Assessment</h3>
                <p>Consider seeking an ADHD assessment if you experience persistent difficulties with:</p>

                <ul>
                  <li><strong>Focus and attention:</strong> Difficulty concentrating on tasks, easily distracted, making careless mistakes</li>
                  <li><strong>Organization:</strong> Chronic disorganization, poor time management, frequently losing things</li>
                  <li><strong>Impulse control:</strong> Speaking without thinking, impulsive decisions, difficulty waiting turns</li>
                  <li><strong>Emotional regulation:</strong> Quick temper, mood swings, low frustration tolerance</li>
                  <li><strong>Task completion:</strong> Starting projects but not finishing them, procrastination</li>
                  <li><strong>Working memory:</strong> Forgetfulness, difficulty following multi-step instructions</li>
                </ul>
              </div>

              <div className="adhd-info-box">
                <p><i className="fas fa-exclamation-triangle"></i> Many adults develop coping strategies that can mask underlying difficulties. If you have concerns about ADHD, a professional assessment may help provide clarity and support informed decision-making.</p>
              </div>


              <div className="cta-box">
                <h3><i className="fas fa-brain"></i>Ready to Explore Your ADHD Concerns?</h3>
                <p>Connect with independent, UK-registered clinicians to discuss your concerns and explore appropriate next steps.</p>
                <button className="btn-large" onClick={() =>
              document.getElementById("doctors-here")?.scrollIntoView({
                behavior: "smooth",
              })}>
                  <i className="fas fa-calendar-check"></i> Book a Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - ADHD Focused */}
      <section className="section faq-section">
        <div className="container">
          <h2 className="section-title">
            ADHD Assessment FAQs
          </h2>
          <p className="section-subtitle">
            Common questions about ADHD diagnosis and treatment in the UK
          </p>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${openFaqIndex === index ? 'open' : ''}`}
              >
                <div
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                >
                  <h3>
                    <i className="fas fa-question" style={{ marginRight: '10px', color: '#15c0da', fontSize: '0.9rem' }}></i>
                    {faq.question}
                  </h3>
                  <span className="faq-toggle">
                    <i className={`fas fa-chevron-${openFaqIndex === index ? 'up' : 'down'}`}></i>
                  </span>
                </div>
                {openFaqIndex === index && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingDoctorForBooking(null);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Direct Booking Modal */}
      <DirectBookingModal
        isOpen={isDirectBookingModalOpen}
        onClose={() => {
          setIsDirectBookingModalOpen(false);
          setSelectedDoctorForBooking(null);
        }}
        doctor={selectedDoctorForBooking}
      />

      <Footer />
    </div>
  );
}

export default ADHDMentalHealth;