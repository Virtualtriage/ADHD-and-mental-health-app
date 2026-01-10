
import { useState, useEffect } from 'react';
import './ADHDMentalHealth.css';

function ADHDMentalHealth() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Handle body scroll locking when modal is open
  useEffect(() => {
    if (showBookingForm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showBookingForm]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Available ADHD Specialists data
  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Eleanor Richardson',
      specialization: 'ADHD Specialist & Adult Psychiatry',
      location: 'London, United Kingdom',
      experience: '18 years experience',
      price: '£680',
      isAvailable: true,
      rating: 4.9,
      reviewCount: 215,
      languages: ['English', 'French'],
      nextAvailable: 'Today, 3:30 PM'
    },
    {
      id: 2,
      name: 'Dr. James Wilson',
      specialization: 'Child & Adolescent ADHD',
      location: 'Manchester, United Kingdom',
      experience: '15 years experience',
      price: '£490',
      isAvailable: true,
      rating: 4.8,
      reviewCount: 178,
      languages: ['English'],
      nextAvailable: 'Today, 4:00 PM'
    },
    {
      id: 3,
      name: 'Dr. Sarah Chen',
      specialization: 'Adult ADHD Assessment',
      location: 'Bristol, United Kingdom',
      experience: '12 years experience',
      price: '£300',
      isAvailable: true,
      rating: 4.9,
      reviewCount: 142,
      languages: ['English', 'Mandarin'],
      nextAvailable: 'Today, 5:30 PM'
    },
    {
      id: 4,
      name: 'Dr. Michael O\'Brien',
      specialization: 'ADHD & Co-occurring Conditions',
      location: 'Edinburgh, United Kingdom',
      experience: '20 years experience',
      price: '£720',
      isAvailable: false,
      rating: 5.0,
      reviewCount: 189,
      languages: ['English', 'Gaelic'],
      nextAvailable: 'Tomorrow, 9:00 AM'
    },
    {
      id: 5,
      name: 'Dr. Amina Patel',
      specialization: 'Women\'s ADHD & Mental Health',
      location: 'Birmingham, United Kingdom',
      experience: '14 years experience',
      price: '£580',
      isAvailable: true,
      rating: 4.7,
      reviewCount: 165,
      languages: ['English', 'Hindi', 'Gujarati'],
      nextAvailable: 'Today, 6:00 PM'
    },
    {
      id: 5,
      name: 'Dr. Shaeel Javaid',
      specialization: 'ADHD & Mental Health',
      location: 'Birmingham, United Kingdom',
      experience: '14 years experience',
      price: '£400',
      isAvailable: true,
      rating: 4.7,
      reviewCount: 165,
      languages: ['English', 'Urdu'],
      nextAvailable: 'Today, 6:00 PM'
    }
  ];

  // Metrics data
  const metrics = [
    {
      icon: 'fas fa-brain',
      value: '96%',
      label: 'Accuracy Rate'
    },
    {
      icon: 'fas fa-stopwatch',
      value: '2-3 weeks',
      label: 'Assessment Time'
    },
    {
      icon: 'fas fa-star',
      value: '4.8 ★',
      label: 'Patient Rating'
    }
  ];

  // How It Works steps data - ADHD Focused
  const howItWorksSteps = [
    {
      step: '1',
      icon: 'fas fa-file-signature',
      title: 'Pre-Assessment Screening',
      description: 'Complete our detailed ADHD screening questionnaire based on DIVA-5 and DSM-5 criteria'
    },
    {
      step: '2',
      icon: 'fas fa-video',
      title: 'Clinical Assessment',
      description: '90-minute comprehensive assessment with an ADHD specialist via secure video consultation'
    },
    {
      step: '3',
      icon: 'fas fa-diagnoses',
      title: 'Diagnosis & Report',
      description: 'Receive formal diagnosis (if criteria met) and detailed assessment report'
    },
    {
      step: '4',
      icon: 'fas fa-prescription',
      title: 'Treatment Plan',
      description: 'Personalized treatment plan including medication, therapy, and lifestyle strategies'
    }
  ];

  // Benefits data - ADHD Focused
  const benefits = [
    {
      icon: 'fas fa-user-md',
      title: 'ADHD Specialists Only',
      description: 'All psychiatrists are UK-registered specialists with specific training in ADHD diagnosis and treatment.'
    },
    {
      icon: 'fas fa-shield-alt',
      title: 'NICE Guidelines Compliant',
      description: 'All assessments follow National Institute for Health and Care Excellence (NICE) guidelines.'
    },
    {
      icon: 'fas fa-file-medical',
      title: 'Comprehensive Assessment',
      description: '90-minute detailed assessment including childhood history, current symptoms, and functional impact.'
    },
    {
      icon: 'fas fa-clock',
      title: 'Quick Diagnosis',
      description: 'Get diagnosed within 2-3 weeks instead of NHS waiting times of 6-18 months.'
    },
    {
      icon: 'fas fa-comments',
      title: 'Holistic Treatment Approach',
      description: 'Medication, therapy referrals, coaching, and lifestyle recommendations for complete care.'
    },
    {
      icon: 'fas fa-hand-holding-medical',
      title: 'Ongoing Support',
      description: 'Regular follow-up appointments and support until stable on treatment plan.'
    }
  ];

  // Testimonials data - ADHD Focused
  const testimonials = [
    {
      initials: 'TM',
      name: 'Thomas Morgan',
      location: 'London, UK | Diagnosed at 32',
      text: 'After struggling my entire life, my ADHD diagnosis at 32 explained everything. The specialist was incredibly thorough and understanding. Medication and strategies have transformed my career and relationships.'
    },
    {
      initials: 'SG',
      name: 'Sarah Gibson',
      location: 'Manchester, UK | University Student',
      text: 'As a university student, I was struggling with focus and deadlines. The ADHD assessment process was comprehensive, and the treatment plan has genuinely saved my academic career.'
    },
    {
      initials: 'DJ',
      name: 'David Jones',
      location: 'Bristol, UK | Business Owner',
      text: 'I always thought I was just disorganized. Getting diagnosed with ADHD at 45 helped me understand my brain better. The practical strategies have improved both my business and personal life dramatically.'
    }
  ];

  // FAQs data - ADHD Focused
  const faqs = [
    {
      question: 'How accurate are online ADHD assessments?',
      answer: 'Our online assessments follow the same clinical standards as in-person appointments. We use validated screening tools (DIVA-5, ASRS) and conduct comprehensive 90-minute clinical interviews. Our UK-registered specialists are trained in ADHD diagnosis and follow NICE guidelines.'
    },
    {
      question: 'Can adults be diagnosed with ADHD?',
      answer: 'Absolutely. ADHD is a lifelong neurodevelopmental condition. Many adults receive diagnoses later in life after years of struggling with symptoms. Our specialists are experienced in adult ADHD diagnosis and understand how symptoms present differently in adulthood.'
    },
    {
      question: 'What evidence do I need for an ADHD assessment?',
      answer: 'We recommend bringing: school reports (if available), examples of work challenges, any previous mental health assessments, and information from someone who knew you as a child (parent, sibling). However, we can conduct the assessment with whatever information you have available.'
    },
    {
      question: 'How long does the assessment process take?',
      answer: 'The initial assessment is typically 90 minutes. You\'ll receive a preliminary conclusion at the end, with a full written report within 5-7 working days. The entire process from booking to diagnosis usually takes 2-3 weeks.'
    },
    {
      question: 'What treatment options are available?',
      answer: 'Treatment may include: Medication (stimulants like methylphenidate or lisdexamfetamine, or non-stimulants), ADHD coaching, Cognitive Behavioral Therapy (CBT), workplace/school accommodations, and lifestyle strategies. Your specialist will recommend a personalized combination based on your needs.'
    },
    {
      question: 'Will my GP be informed?',
      answer: 'Only with your explicit consent. We can share your assessment report and treatment recommendations with your NHS GP to facilitate shared care arrangements if appropriate. Many GPs are willing to take over prescribing once stabilized on medication.'
    },
    {
      question: 'How much does private ADHD assessment cost in the UK?',
      answer: 'Our comprehensive ADHD assessment is £680. This includes: Pre-assessment screening, 90-minute clinical assessment with a specialist, detailed diagnostic report, and initial treatment recommendations. Follow-up appointments are £180.'
    },
    {
      question: 'Is ADHD medication safe?',
      answer: 'When prescribed and monitored by a specialist, ADHD medication is generally safe and effective. We conduct thorough health checks before prescribing and monitor you closely during treatment. All medications are prescribed following UK prescribing guidelines.'
    },
    {
      question: 'Can I get diagnosed with ADHD if I have other conditions?',
      answer: 'Yes. Our specialists are trained in differential diagnosis and can distinguish ADHD from other conditions like anxiety, depression, or autism. Many people with ADHD have co-occurring conditions, which we assess and address in your treatment plan.'
    },
    {
      question: 'What happens after diagnosis?',
      answer: 'You\'ll receive a comprehensive treatment plan and regular follow-up appointments. We provide support with medication titration, referrals to therapy/coaching, and advice on workplace/school accommodations. We aim to provide ongoing care until you\'re stable and can transition to shared care with your GP if appropriate.'
    }
  ];

  // ADHD Symptoms data for SEO content
  const adhdSymptoms = [
    {
      category: 'Inattention Symptoms',
      symptoms: [
        'Difficulty sustaining attention in tasks or play activities',
        'Often makes careless mistakes in schoolwork or work',
        'Does not seem to listen when spoken to directly',
        'Fails to follow through on instructions and fails to finish tasks',
        'Difficulty organizing tasks and activities',
        'Avoids tasks that require sustained mental effort'
      ]
    },
    {
      category: 'Hyperactivity Symptoms',
      symptoms: [
        'Fidgets with or taps hands or feet, squirms in seat',
        'Leaves seat in situations where remaining seated is expected',
        'Runs about or climbs in inappropriate situations',
        'Unable to play or engage in activities quietly',
        'Often "on the go" acting as if "driven by a motor"',
        'Talks excessively'
      ]
    },
    {
      category: 'Impulsivity Symptoms',
      symptoms: [
        'Blurts out answers before questions have been completed',
        'Difficulty waiting their turn',
        'Interrupts or intrudes on others\' conversations or games',
        'Makes important decisions without considering long-term consequences',
        'Difficulty controlling immediate reactions',
        'Frequent mood swings and emotional dysregulation'
      ]
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
        'Requires comprehensive treatment approach',
        'Can be managed effectively with proper care'
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
      description: 'Increased risk of anxiety, depression, and low self-esteem without proper diagnosis and treatment.',
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
      type: 'Medication Management',
      description: 'Stimulant and non-stimulant medications can significantly improve ADHD symptoms.',
      details: 'Includes methylphenidate, lisdexamfetamine, atomoxetine, and guanfacine.'
    },
    {
      type: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Evidence-based therapy focusing on developing coping strategies and changing thought patterns.',
      details: 'Specifically adapted for ADHD challenges.'
    },
    {
      type: 'ADHD Coaching',
      description: 'Practical support for developing organizational and time management skills.',
      details: 'Focuses on real-world strategies for daily challenges.'
    },
    {
      type: 'Lifestyle Interventions',
      description: 'Exercise, nutrition, sleep hygiene, and mindfulness practices to support treatment.',
      details: 'Comprehensive approach to wellbeing.'
    }
  ];

  // Event handlers
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleBookNow = () => {
    setShowBookingForm(true);
  };

  const handleCloseModal = () => {
    setShowBookingForm(false);
    setSelectedDoctor(null);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for booking your ADHD assessment! You will receive a confirmation email shortly with your appointment details and pre-assessment questionnaire.');
    setShowBookingForm(false);
    setSelectedDoctor(null);
  };

  const handleBookDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleViewProfile = (doctor) => {
    alert(`Viewing profile of ${doctor.name}\n\nSpecialization: ${doctor.specialization}\nExperience: ${doctor.experience}\nLocation: ${doctor.location}\nRating: ${doctor.rating} ★ (${doctor.reviewCount} reviews)\n\nAssessment Fee: ${doctor.price} (includes comprehensive assessment and report)`);
  };

  return (
    <div className="adhd-mental-health-app">
      {/* Hero Section */}
      <section className="adhd-hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-icon-main">
              <i className="fas fa-brain"></i>
            </div>
            <h1>
              Private ADHD Assessment & Treatment UK
            </h1>
            <h2>Specialist ADHD Diagnosis & Ongoing Care | Video Appointments Available</h2>
            <p className="hero-subtitle">
              Get evaluated for ADHD by UK-registered specialists within days, not months. Complete assessment, diagnosis, and personalized treatment plan from the comfort of your home. Our psychiatrists follow NICE guidelines and provide comprehensive care for adults and children across the UK.
            </p>
            <button className="btn btn-large" onClick={handleBookNow}>
              <i className="fas fa-clipboard-check"></i> Start Your ADHD Assessment
            </button>
            <div className="trust-badges">
              <div className="badge">
                <i className="fas fa-user-md"></i>
                <span>ADHD Specialists</span>
              </div>
              <div className="badge">
                <i className="fas fa-clock"></i>
                <span>2-Week Wait Time</span>
              </div>
              <div className="badge">
                <i className="fas fa-shield-alt"></i>
                <span>NICE Guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available ADHD Specialists Section */}
      <section className="section available-doctors-section">
        <div className="container">
          <div className="doctors-header">
            <h2 className="section-title">
              Available ADHD Specialists
            </h2>
            <p className="section-subtitle">UK-registered psychiatrists specializing in ADHD diagnosis and treatment</p>
          </div>
          
          <div className="doctors-content">
            <div className="doctors-main">
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
                      <div className="doctor-rating">
                        <i className="fas fa-star"></i> {doctor.rating} ★
                        <span className="review-count">({doctor.reviewCount} reviews)</span>
                      </div>
                    </div>
                    
                    <div className="doctor-info">
                      <h3>{doctor.name}</h3>
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
                    
                    <div className="doctor-pricing">
                      <div className="price-label">Comprehensive Assessment:</div>
                      <div className="price-amount">{doctor.price}</div>
                    </div>
                    
                    <div className="doctor-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleBookDoctor(doctor)}
                        disabled={!doctor.isAvailable}
                      >
                        <i className="fas fa-calendar-check"></i> Book Assessment
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
            </div>
            
            <div className="doctors-sidebar">
              <div className="sidebar-card specialties-card">
                <h3>
                  <i className="fas fa-stethoscope" style={{marginRight: '8px', color: '#15c0da'}}></i>
                  Comprehensive ADHD Services
                </h3>
                <p>Adult ADHD assessment, child & adolescent ADHD, co-occurring conditions, and ongoing treatment management.</p>
                <button className="btn btn-secondary">
                  <i className="fas fa-info-circle"></i> Learn More
                </button>
              </div>
              
              <div className="sidebar-card metrics-card">
                <h3>
                  <i className="fas fa-chart-line" style={{marginRight: '8px', color: '#15c0da'}}></i>
                  Our ADHD Service Metrics
                </h3>
                <div className="metrics-grid">
                  {metrics.map((metric, index) => (
                    <div key={index} className="metric-item">
                      <div className="metric-icon">
                        <i className={metric.icon}></i>
                      </div>
                      <div className="metric-value">{metric.value}</div>
                      <div className="metric-label">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - ADHD Focused */}
      <section className="section how-it-works-section">
        <div className="container">
          <h2 className="section-title">
            The ADHD Assessment Process
          </h2>
          <p className="section-subtitle">
            A comprehensive 4-step process for accurate ADHD diagnosis and treatment
          </p>
          
          <div className="steps-container">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="step-card">
                <div className="step-header">
                  <div className="step-number">{step.step}</div>
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
            Why Choose Our ADHD Assessment Service?
          </h2>
          <p className="section-subtitle">
            Professional ADHD care with the expertise and understanding you deserve
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
                <h3>Comprehensive ADHD Treatment Approach</h3>
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
              
              <div className="adhd-info-box">
                <p><i className="fas fa-exclamation-triangle"></i> Many adults with ADHD have developed coping mechanisms that mask their symptoms. If you suspect you might have ADHD, a professional assessment can provide clarity and open doors to effective treatment.</p>
              </div>
              
              <h3> The UK ADHD Assessment Process</h3>
              <p>Our private ADHD assessment process follows National Institute for Health and Care Excellence (NICE) guidelines and includes:</p>
              
              <div className="process-steps">
                <div className="process-step">
                  <div className="step-icon"><i className="fas fa-file-medical"></i></div>
                  <div className="step-content">
                    <h4>Initial Screening & History Taking</h4>
                    <p>Comprehensive review of symptoms across lifespan, including childhood history, school reports, and current functional impairments.</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-icon"><i className="fas fa-user-md"></i></div>
                  <div className="step-content">
                    <h4>Clinical Interview & Assessment</h4>
                    <p>90-minute detailed assessment with a consultant psychiatrist using validated diagnostic tools (DIVA-5, ASRS).</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-icon"><i className="fas fa-diagnoses"></i></div>
                  <div className="step-content">
                    <h4>Differential Diagnosis</h4>
                    <p>Ruling out other conditions that may mimic ADHD symptoms (anxiety, depression, sleep disorders, thyroid issues).</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-icon"><i className="fas fa-file-prescription"></i></div>
                  <div className="step-content">
                    <h4>Treatment Planning</h4>
                    <p>Personalized treatment plan including medication options, therapy recommendations, and lifestyle strategies.</p>
                  </div>
                </div>
              </div>
              
              <div className="cta-box">
                <h3><i className="fas fa-brain"></i> Ready to Understand Your ADHD?</h3>
                <p>Take the first step toward clarity and effective management. Our specialist psychiatrists are here to help you understand your symptoms and develop a personalized treatment plan.</p>
                <button className="btn-large" onClick={handleBookNow}>
                  <i className="fas fa-calendar-check"></i> Book Your Assessment Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section testimonials-section">
        <div className="container">
          <h2 className="section-title">
            Patient Success Stories
          </h2>
          <p className="section-subtitle">
            Hear from individuals who have transformed their lives through ADHD diagnosis and treatment
          </p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>{testimonial.text}</p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.initials}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <p><i className="fas fa-map-marker-alt"></i> {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
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
                    <i className="fas fa-question" style={{marginRight: '10px', color: '#15c0da', fontSize: '0.9rem'}}></i>
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

      {/* Ready to Book Section */}
      <section className="section ready-to-book-section">
        <div className="container">
          <div className="ready-to-book-content">
            <h2>
              <i className="fas fa-brain"></i>
              Take Control of Your ADHD Today
            </h2>
            <div className="trust-badges-row">
              <div className="trust-badge-item">
                <i className="fas fa-user-md"></i>
                <div className="trust-badge-text">
                  <strong>ADHD Specialists</strong>
                  <span>UK-Registered</span>
                </div>
              </div>
              <div className="trust-badge-item">
                <i className="fas fa-file-medical"></i>
                <div className="trust-badge-text">
                  <span>NICE Guidelines</span>
                  <strong>Compliant</strong>
                </div>
              </div>
              <div className="trust-badge-item">
                <i className="fas fa-clock"></i>
                <div className="trust-badge-text">
                  <span>Assessment in</span>
                  <strong>2-3 Weeks</strong>
                </div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={handleBookNow}>
              <i className="fas fa-clipboard-check"></i> Book Your ADHD Assessment
            </button>
            <p style={{marginTop: '20px', fontSize: '14px', opacity: '0.9'}}>
              <i className="fas fa-lock" style={{marginRight: '8px'}}></i>
              Secure online booking • Confidential assessment • UK-wide service
            </p>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="booking-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>
                <i className="fas fa-calendar-plus" style={{marginRight: '10px'}}></i>
                {selectedDoctor 
                  ? `Book ADHD Assessment with ${selectedDoctor.name}`
                  : 'Book ADHD Assessment'
                }
              </h2>
              <button 
                className="modal-close" 
                onClick={handleCloseModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleBookingSubmit}>
              {selectedDoctor && (
                <div className="modal-doctor-summary">
                  <div className="doctor-summary-info">
                    <h4>{selectedDoctor.name}</h4>
                    <p>{selectedDoctor.specialization}</p>
                    <div className="doctor-summary-details">
                      <span><i className="fas fa-map-marker-alt"></i> {selectedDoctor.location}</span>
                      <span><i className="fas fa-briefcase-medical"></i> {selectedDoctor.experience}</span>
                      <span><i className="fas fa-star"></i> {selectedDoctor.rating} ★</span>
                    </div>
                  </div>
                  <div className="doctor-summary-price">
                    <div className="price-label">Assessment Fee</div>
                    <div className="price-amount">{selectedDoctor.price}</div>
                  </div>
                </div>
              )}
              
              <div className="modal-step">
                <h3>
                  <i className="fas fa-user" style={{marginRight: '10px', color: '#15c0da'}}></i>
                  UK Patient Details
                </h3>
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" required placeholder="As per UK identification" />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" required placeholder="Surname" />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" required placeholder="your.email@domain.co.uk" />
                </div>
                <div className="form-group">
                  <label>UK Phone Number *</label>
                  <input type="tel" required placeholder="07XXX XXXXXX" />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input type="date" required />
                </div>
                <div className="form-group">
                  <label>Primary Concern *</label>
                  <select required>
                    <option value="">Select your main concern</option>
                    <option value="adhd-adult">Adult ADHD Assessment</option>
                    <option value="adhd-child">Child/Adolescent ADHD Assessment</option>
                    <option value="adhd-followup">Follow-up ADHD Treatment</option>
                    <option value="adhd-medication">ADHD Medication Management</option>
                    <option value="adhd-coaching">ADHD Coaching/Therapy</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Have you had previous ADHD/mental health treatment? *</label>
                  <select required>
                    <option value="">Please select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                    <option value="unsure">Not Sure</option>
                  </select>
                </div>
              </div>

              <div className="modal-step">
                <h3>
                  <i className="fas fa-calendar" style={{marginRight: '10px', color: '#15c0da'}}></i>
                  Assessment Details
                </h3>
                <div className="form-group">
                  <label>Assessment Type *</label>
                  <div className="radio-group">
                    <label className="radio-option">
                      <input type="radio" name="type" value="initial" defaultChecked />
                      <span><i className="fas fa-stethoscope"></i> Initial ADHD Assessment ({selectedDoctor ? selectedDoctor.price : '£680'})</span>
                    </label>
                    <label className="radio-option">
                      <input type="radio" name="type" value="followup" />
                      <span><i className="fas fa-calendar-check"></i> Follow-up Appointment (£180)</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input type="date" required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="form-group">
                  <label>UK Time Zone *</label>
                  <select required defaultValue="GMT">
                    <option value="GMT">GMT (London)</option>
                    <option value="BST">BST (British Summer Time)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <select required>
                    <option value="">Select appointment time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM (Evening)</option>
                    <option value="19:00">07:00 PM (Evening)</option>
                  </select>
                </div>
                <div className="price-summary">
                  <p><strong>Assessment Fee: {selectedDoctor ? selectedDoctor.price : '£680'}</strong></p>
                  <p className="note">Includes: Pre-assessment questionnaire, 90-minute clinical assessment, comprehensive diagnostic report, and initial treatment recommendations.</p>
                  <p className="note"><i className="fas fa-info-circle"></i> Many UK private health insurers cover ADHD assessments</p>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  <i className="fas fa-times"></i> Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-calendar-check"></i> Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ADHDMentalHealth;