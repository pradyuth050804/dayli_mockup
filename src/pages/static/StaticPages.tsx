import StaticPage from './StaticPage';

export const AboutPage = () => (
  <StaticPage title="About Us">
    <p>We are DAYLI, pioneering the future of precision nutrition. We believe that health is not a one-size-fits-all approach. By leveraging cutting-edge biological data and advanced AI, we create personalized nutrition plans designed specifically for your unique molecular makeup.</p>
    <h3>Our Mission</h3>
    <p>To optimize human performance and longevity through personalized, data-driven nutritional science.</p>
  </StaticPage>
);

export const TeamPage = () => (
  <StaticPage title="Our Team">
    <p>We are a multidisciplinary team of scientists, technologists, and wellness experts committed to redefining health.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
      {['Sarah Jenkins, PhD (Chief Science Officer)', 'Marcus Chen (Head of AI)', 'Dr. Elena Rossi (Medical Director)', 'David Park (CEO)'].map(member => (
        <div key={member} className="bg-stone-50 p-6 rounded-2xl">
          <div className="w-16 h-16 bg-dayli-red-light rounded-full mb-4"></div>
          <h4 className="font-bold mb-1">{member.split(' (')[0]}</h4>
          <p className="text-sm text-stone-500">{member.split(' (')[1].replace(')', '')}</p>
        </div>
      ))}
    </div>
  </StaticPage>
);

export const FaqPage = () => (
  <StaticPage title="FAQ">
    <h3>How does the AI personalization work?</h3>
    <p>Our Companion AI analyzes your uploaded blood marker reports against thousands of clinical studies to identify specific nutritional gaps and recommend exact supplement formulations tailored to your biology.</p>
    <h3>Are your products tested?</h3>
    <p>Yes, all DAYLI products undergo rigorous third-party testing for purity, potency, and bioavailability.</p>
    <h3>How do subscriptions work?</h3>
    <p>You can choose to subscribe to your personalized stack monthly or quarterly. You can pause or cancel anytime from your account dashboard.</p>
  </StaticPage>
);

export const ContactPage = () => (
  <StaticPage title="Contact Us">
    <p>We're here to help you on your health journey.</p>
    <ul>
      <li><strong>Email:</strong> support@dayli.com</li>
      <li><strong>Phone:</strong> 1-800-555-DAYLI</li>
      <li><strong>Hours:</strong> Monday - Friday, 9AM - 6PM EST</li>
    </ul>
  </StaticPage>
);

export const BlogPage = () => (
  <StaticPage title="Journal">
    <p>Coming soon. Our scientific team is preparing deep dives into the latest longevity research, biomarker analysis, and nutritional science.</p>
  </StaticPage>
);

export const PrivacyPage = () => (
  <StaticPage title="Privacy Policy">
    <p>Your biological data is strictly confidential. We employ military-grade encryption and adhere to strict HIPAA compliance standards for all uploaded lab reports and health surveys. We never sell your personal data.</p>
  </StaticPage>
);

export const TermsPage = () => (
  <StaticPage title="Terms of Service">
    <p>By using the DAYLI platform, you agree to our terms. Our products and AI recommendations are designed for nutritional support and wellness optimization, and are not intended to diagnose, treat, cure, or prevent any medical condition.</p>
  </StaticPage>
);

export const ShippingPage = () => (
  <StaticPage title="Shipping & Returns">
    <h3>Shipping</h3>
    <p>We offer free standard shipping on all orders over $75 within the contiguous US. Expedited shipping options are available at checkout.</p>
    <h3>Returns</h3>
    <p>We stand behind our science. If you are not satisfied with your DAYLI products, you may return them within 30 days of purchase for a full refund (minus shipping costs).</p>
  </StaticPage>
);
