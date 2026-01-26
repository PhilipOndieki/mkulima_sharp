import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';

const About = () => {
  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container-custom">
        <AnimatedSection animation="fade-up">
          <h1 className="section-header">About Mkulima Sharp</h1>
          <p className="section-subheader">
            Building Kenya&apos;s poultry future together
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <Card className="text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              Our story, mission, values, team, and partner network.
            </p>
          </Card>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default About;
