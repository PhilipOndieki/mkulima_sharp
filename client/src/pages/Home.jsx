import { HiCheckCircle, HiTruck, HiAcademicCap, HiChevronDown } from 'react-icons/hi';
import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProductCard from '../components/common/ProductCard';
import { useState, useEffect } from 'react';

const Home = () => {
  const [currentCount, setCurrentCount] = useState({
    farmers: 0,
    successRate: 0,
    programs: 0,
  });

  // Count-up animation for statistics
  useEffect(() => {
    const targets = { farmers: 5000, successRate: 98, programs: 50 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCurrentCount({
        farmers: Math.floor(targets.farmers * progress),
        successRate: Math.floor(targets.successRate * progress),
        programs: Math.floor(targets.programs * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setCurrentCount(targets);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Sample products for featured section
  const featuredProducts = [
    {
      id: '1',
      name: 'Kari Improved Kienyeji Chicks',
      description: 'Hardy, fast-growing indigenous chickens with excellent meat quality',
      price: 150,
      category: 'Day-Old Chicks',
      imageUrl: '/products/kienyeji-chicks.jpg',
      stock: 500,
      unit: 'chick'
    },
    {
      id: '2',
      name: 'Broiler Starter Feed - 50kg',
      description: 'Complete nutrition for broiler chicks 0-3 weeks',
      price: 3200,
      category: 'Feeds',
      imageUrl: '/products/broiler-feed.jpg',
      stock: 100,
      unit: 'bag'
    },
    {
      id: '3',
      name: 'Automatic Feeder System',
      description: 'Labor-saving feeding system for up to 100 birds',
      price: 8500,
      category: 'Equipment',
      imageUrl: '/products/feeder.jpg',
      stock: 25,
      unit: 'unit'
    },
    {
      id: '4',
      name: 'Poultry Multivitamins - 1L',
      description: 'Essential vitamins and minerals for healthy growth',
      price: 1200,
      category: 'Supplements',
      imageUrl: '/products/vitamins.jpg',
      stock: 75,
      unit: 'bottle'
    },
  ];

  const handleAddToCart = (product) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen md:h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/rooster-family.png" 
            alt="Poultry Farming" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1920&h=1080&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-10 text-center md:text-left">
          <div className="max-w-3xl mx-auto md:mx-0">
            <AnimatedSection animation="fade-up" delay={0}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Building Thriving Poultry Farms, One Chick at a Time
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 md:mb-12 leading-relaxed">
              </p>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth={window.innerWidth < 640}
                  onClick={() => window.location.href = '/products'}
                >
                  Explore Products
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth={window.innerWidth < 640}
                  onClick={() => window.location.href = '/academy'}
                >
                  Start Learning
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection animation="fade-up">
            <h2 className="section-header text-center mb-12 md:mb-16">
              Why Choose Mkulima Sharp
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatedSection animation="fade-up" delay={0}>
              <Card bordered hover className="text-center h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <HiCheckCircle className="w-10 h-10 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Quality Products
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Premium day-old chicks, feeds, and equipment from trusted suppliers. Quality guaranteed.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <Card bordered hover className="text-center h-full">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <HiAcademicCap className="w-10 h-10 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Expert Training
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Mkulima Sharp Academy - From beginner to profitable farming with proven methods.
                </p>
              </Card>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={400}>
              <Card bordered hover className="text-center h-full md:col-span-2 lg:col-span-1">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                    <HiTruck className="w-10 h-10 text-primary-600" />
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  Reliable Delivery
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Track your order from farm to your doorstep. Fast, safe delivery across Kenya.
                </p>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Products Preview */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection animation="fade-up">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="section-header">
                Featured Products
              </h2>
              <p className="section-subheader">
                Quality products for every stage of your poultry farming journey
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
            {featuredProducts.map((product, index) => (
              <AnimatedSection 
                key={product.id} 
                animation="fade-up" 
                delay={index * 100}
              >
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fade-up" className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/products'}
            >
              View All Products
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 md:py-20 bg-primary-700 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <AnimatedSection animation="scale" delay={0}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  {currentCount.farmers.toLocaleString()}+
                </div>
                <div className="text-lg md:text-xl text-primary-100">
                  Happy Farmers
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale" delay={200}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  {currentCount.successRate}%
                </div>
                <div className="text-lg md:text-xl text-primary-100">
                  Success Rate
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale" delay={400}>
              <div className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  {currentCount.programs}+
                </div>
                <div className="text-lg md:text-xl text-primary-100">
                  Training Programs
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="scale" delay={600}>
              <div className="text-center col-span-2 lg:col-span-1">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  24/7
                </div>
                <div className="text-lg md:text-xl text-primary-100">
                  Support Available
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <AnimatedSection animation="fade-up">
            <h2 className="section-header text-center mb-12 md:mb-16">
              Success Stories
            </h2>
          </AnimatedSection>

          <div className="space-y-12 md:space-y-16">
            {/* Testimonial 1 */}
            <AnimatedSection animation="fade-right">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="order-2 lg:order-1">
                  <img 
                    src="/testimonials/farmer-1.jpg" 
                    alt="Success Story" 
                    className="rounded-2xl shadow-card w-full h-64 md:h-96 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop';
                    }}
                  />
                </div>
                <Card className="order-1 lg:order-2">
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                    "Mkulima Sharp transformed my backyard into a profitable business. I started with 50 chicks and now I'm running 500 birds. The training was invaluable."
                  </blockquote>
                  <div className="font-semibold text-gray-900">Mary Wanjiku</div>
                  <div className="text-gray-600">Kiambu County</div>
                </Card>
              </div>
            </AnimatedSection>

            {/* Testimonial 2 */}
            <AnimatedSection animation="fade-left">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Card>
                  <blockquote className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic">
                    "The quality of chicks and feeds is outstanding. Customer support is always available when I need help. Best decision for my farming business."
                  </blockquote>
                  <div className="font-semibold text-gray-900">Peter Omondi</div>
                  <div className="text-gray-600">Kisumu County</div>
                </Card>
                <div>
                  <img 
                    src="/testimonials/farmer-2.jpg" 
                    alt="Success Story" 
                    className="rounded-2xl shadow-card w-full h-64 md:h-96 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop';
                    }}
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom text-center">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
              Ready to Start Your Poultry Journey?
            </h2>
            <p className="text-lg md:text-xl text-primary-100 mb-8 md:mb-12 max-w-2xl mx-auto">
              Join thousands of successful farmers. Get expert guidance, quality products, and reliable support.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => window.location.href = '/business-builder'}
            >
              Join Mkulima Sharp Today
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
