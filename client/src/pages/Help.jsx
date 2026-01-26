import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';

const Help = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container-custom">
        <AnimatedSection animation="fade-up">
          <h1 className="section-header text-center">Help Center</h1>
          <p className="section-subheader text-center">
            Find answers to common questions
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <Card className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              Comprehensive FAQ section, troubleshooting guides, and support resources.
            </p>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Help;
