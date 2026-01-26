import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useState } from 'react';
import { HiPhone, HiMail, HiLocationMarker } from 'react-icons/hi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Implement Firebase submission
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactOffices = [
    {
      name: 'Nairobi Office 1',
      phone: '0790694608',
      location: 'Nairobi'
    },
    {
      name: 'Nairobi Office 2',
      phone: '+254784519918',
      location: 'Nairobi'
    },
    {
      name: 'Kisii Office',
      phone: '+254735898745',
      location: 'Kisii'
    },
    {
      name: 'Extension Office',
      phone1: '0738151161',
      phone2: '+254792097368',
      location: 'Extension Services'
    },
    {
      name: 'Farm Manager',
      phone: '0716380838',
      location: 'Farm Operations'
    }
  ];

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container-custom">
        <AnimatedSection animation="fade-up">
          <h1 className="section-header text-center">Contact Us</h1>
          <p className="section-subheader text-center">
            Get in touch with our team across Kenya
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Contact Form */}
          <AnimatedSection animation="fade-right">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="254700000000"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="General">General Inquiry</option>
                    <option value="Products">Products</option>
                    <option value="Training">Training</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="textarea-field"
                    placeholder="How can we help you?"
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth>
                  Send Message
                </Button>
              </form>
            </Card>
          </AnimatedSection>

          {/* Main Contact Information */}
          <AnimatedSection animation="fade-left">
            <Card>
              <h2 className="text-2xl font-bold mb-6">Main Office</h2>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <HiLocationMarker className="w-5 h-5 text-primary-600 mr-2" />
                    Address
                  </h3>
                  <p className="text-gray-600 ml-7">
                    Nairobi, Kenya
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <HiMail className="w-5 h-5 text-primary-600 mr-2" />
                    Email
                  </h3>
                  <a 
                    href="mailto:info@mkulimasharp.co.ke"
                    className="text-primary-600 hover:text-primary-700 ml-7 block"
                  >
                    info@mkulimasharp.co.ke
                  </a>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 3:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </div>

        {/* Office Locations Grid */}
        <AnimatedSection animation="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Our Offices Across Kenya
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {contactOffices.map((office, index) => (
            <AnimatedSection 
              key={index} 
              animation="fade-up" 
              delay={index * 100}
            >
              <Card hover className="h-full">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <HiPhone className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {office.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {office.location}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 ml-16">
                  <a 
                    href={`tel:${office.phone || office.phone1}`}
                    className="block text-primary-600 hover:text-primary-700 font-medium"
                  >
                    {office.phone || office.phone1}
                  </a>
                  {office.phone2 && (
                    <a 
                      href={`tel:${office.phone2}`}
                      className="block text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {office.phone2}
                    </a>
                  )}
                </div>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;