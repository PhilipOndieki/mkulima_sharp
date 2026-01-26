import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';

const BusinessBuilder = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container-custom">
        <AnimatedSection animation="fade-up">
          <h1 className="section-header">Poultry Business Builder</h1>
          <p className="section-subheader">
            Step-by-step guidance from planning to profit
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              Interactive business planning tools, investment calculators, and startup guides.
            </p>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default BusinessBuilder;
