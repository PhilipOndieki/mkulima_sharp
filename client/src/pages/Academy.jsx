import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';

const Academy = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container-custom">
        <AnimatedSection animation="fade-up">
          <h1 className="section-header">Mkulima Sharp Academy</h1>
          <p className="section-subheader">
            From beginner to profitable farmer - comprehensive poultry farming education
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              Comprehensive poultry farming courses, interactive calculators, and expert resources.
            </p>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Academy;
