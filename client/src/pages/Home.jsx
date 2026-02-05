import { HiCheckCircle, HiTruck, HiAcademicCap } from 'react-icons/hi';
import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ProductCard from '../components/common/ProductCard';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../services/firebase';

const Home = () => {
  const [currentCount, setCurrentCount] = useState({
    farmers: 0,
    successRate: 0,
    programs: 0,
  });

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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

  // Fetch one product from each category
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoadingProducts(true);
        
        // Categories to fetch from
        const categories = ['Automatic Incubators', 'Brooding Equipment', 'Cages & Mesh', 'Drinkers', 'Feeders'];
        const products = [];

        // Fetch one product from each category
        for (const category of categories) {
          const q = query(
            collection(db, 'products'),
            where('category', '==', category),
            where('inStock', '==', true),
            limit(1)
          );
          
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            products.push({
              id: doc.id,
              ...doc.data()
            });
          });
        }

        console.log('✅ Fetched featured products:', products.length);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('❌ Error fetching featured products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen md:h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/rooster-family.webp" 
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
                Building Thriving Poultry Farms, <br />
                <span className="text-yellow-400">One Chick at a Time</span>
              </h1>
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
      {/* Customer Success Story Section - Replaces "Why Choose Us" */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            
            {/* Left Side - Video with Play Button */}
            <AnimatedSection animation="fade-right">
              <div className="relative group cursor-pointer rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
                {/* Background Image */}
                <div className="relative h-[400px] md:h-[500px]">
                  <img 
                    src="/mkulimasharp-grow.webp" 
                    alt="Mkulima Sharp Success Story" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop';
                    }}
                  />
                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                  
                  {/* Play Button Overlay */}
                  <a 
                    href="https://www.youtube.com/watch?v=2wU3ToPNEVc" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="relative">
                      {/* Outer Pulse Ring */}
                      <div className="absolute inset-0 bg-yellow-400/30 rounded-full animate-ping" />
                      
                      {/* Play Button Circle */}
                      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-yellow-400 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-2xl">
                        {/* Play Icon */}
                        <svg 
                          className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </a>

                  {/* "Watch Full Story" Text */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm md:text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Watch Full Story
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Side - Success Story Text */}
            <AnimatedSection animation="fade-left">
              <div className="space-y-6">

                {/* Main Heading */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 leading-tight">
                  We Partner in Your Success
                </h2>

                {/* Success Story Paragraph */}
                <div className="text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Meet Nicodemus from Vihiga County, who started his poultry journey with Mkulima Sharp just 5 months ago. Our team member Amos recently visited his farm to see the incredible progress. Starting with day old chicks from our trusted suppliers, Nicodemus now has 471 healthy chickens that have begun laying eggs and generating income. This is what Mkulima Sharp is all about. We provide ongoing site visits, expert consultancy, and continuous follow up to ensure every farmer succeeds. Your success is our success.
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => window.location.href = '/contact'}
                  >
                    Book a Consultation
                  </Button>
                </div>
              </div>
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

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            {loadingProducts ? (
              // Loading Skeleton
              [1, 2, 3].map((i) => (
                <AnimatedSection key={i} animation="fade-up" delay={i * 100}>
                  <div className="animate-pulse bg-white rounded-xl shadow-card overflow-hidden">
                    <div className="bg-gray-200 h-56"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-10 bg-gray-200 rounded mt-4"></div>
                    </div>
                  </div>
                </AnimatedSection>
              ))
            ) : featuredProducts.length === 0 ? (
              // No Products Found
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">No products available at the moment</p>
                <p className="text-gray-400 text-sm">Check back soon for new arrivals</p>
              </div>
            ) : (
              // Products Loaded
              featuredProducts.map((product, index) => (
                <AnimatedSection 
                  key={product.id} 
                  animation="fade-up" 
                  delay={index * 100}
                >
                  <ProductCard product={product} />
                </AnimatedSection>
              ))
            )}
          </div>

          {/* View All Button */}
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
                    src="/testimonials/farmer-1.webp" 
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
                    src="/testimonials/farmer-2.webp" 
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
              onClick={() => window.location.href = '/academy'}
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