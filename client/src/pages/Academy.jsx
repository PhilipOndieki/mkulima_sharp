import { useState } from 'react';
import AnimatedSection from '../components/common/AnimatedSection';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { 
  HiAcademicCap, 
  HiChartBar, 
  HiDocumentText,
  HiLightBulb,
  HiShieldCheck,
  HiTrendingUp 
} from 'react-icons/hi';

const Academy = () => {
  const [activeBreed, setActiveBreed] = useState('kienyeji');
  const [selectedCalculator, setSelectedCalculator] = useState('broiler');
  const [birdCount, setBirdCount] = useState(50);
  
  // Breed comparison data
  const breeds = {
    kienyeji: {
      name: 'Indigenous (Kienyeji) Chicken',
      purpose: 'Meat & Eggs',
      strains: 'Kari Improved Kienyeji, Rainbow Rooster, Sasso-based Kienyeji',
      advantages: ['Hardy', 'Disease resistant', 'Low feeding cost', 'High market demand'],
      disadvantages: ['Slow growth', 'Low egg production'],
      marketAge: '3-6 months',
      image: '/breeds/kienyeji.webp'
    },
    broiler: {
      name: 'Broilers',
      purpose: 'Meat',
      strains: 'Cobb 500, Ross 308, Arbor Acres',
      advantages: ['Very fast growth', 'High meat yield', 'Ready in 5-6 weeks'],
      disadvantages: ['High feed cost', 'Sensitive to disease'],
      marketAge: '5-6 weeks',
      image: '/breeds/broiler.webp'
    },
    layer: {
      name: 'Layers',
      purpose: 'Eggs',
      strains: 'ISA Brown, Lohmann Brown, Hy-Line Brown',
      advantages: ['High egg production (280-320 eggs/year)', 'Consistent income'],
      disadvantages: ['Require good management', 'Specialized feeding'],
      marketAge: '18-20 weeks (start laying)',
      image: '/breeds/layers.webp'
    },
    dualPurpose: {
      name: 'Dual-Purpose Breeds',
      purpose: 'Meat & Eggs',
      strains: 'Rhode Island Red, Sussex, Plymouth Rock',
      advantages: ['Balanced productivity', 'Versatile', 'Good for beginners'],
      disadvantages: ['Slower than broilers', 'Fewer eggs than layers'],
      marketAge: '4-5 months',
      image: '/breeds/dual-purpose.webp'
    },
    improved: {
      name: 'Improved Exotic/Hybrid',
      purpose: 'Meat & Eggs',
      strains: 'Sasso, Kuroiler, Kenbro',
      advantages: ['Faster growth than kienyeji', 'Hardier than broilers', 'Good market price'],
      disadvantages: ['Slightly higher feed cost'],
      marketAge: '8-16 weeks',
      image: '/breeds/improved.webp'
    }
  };

  // Calculator data
  const calculatorData = {
    broiler: {
      chicksPerBird: 120,
      feedPerBird: 4.25,
      feedCostPerKg: 70,
      vaccines: { 50: 1000, 100: 2000, 500: 8000 },
      bedding: { 50: 800, 100: 3000, 500: 10000 },
      labor: { 50: 0, 100: 3000, 500: 15000 },
      sellingPrice: 1000,
      duration: '6 weeks'
    },
    layer: {
      chicksPerBird: 150,
      feedPerBird: 58,
      feedCostPerKg: 62,
      vaccines: { 50: 1500, 100: 2500, 500: 10000 },
      bedding: { 50: 1000, 100: 4000, 500: 12000 },
      labor: { 50: 0, 100: 4000, 500: 20000 },
      eggsPerYear: 280,
      eggPrice: 15,
      duration: '72 weeks'
    },
    kienyeji: {
      chicksPerBird: 80,
      feedPerBird: 11.8,
      feedCostPerKg: 60,
      vaccines: { 50: 800, 100: 1500, 500: 6000 },
      bedding: { 50: 600, 100: 2000, 500: 8000 },
      labor: { 50: 0, 100: 2000, 500: 12000 },
      sellingPrice: 1200,
      duration: '4-6 months'
    }
  };

  // Calculate profit
  const calculateProfit = () => {
    const data = calculatorData[selectedCalculator];
    const chicksCost = birdCount * data.chicksPerBird;
    const feedCost = birdCount * data.feedPerBird * data.feedCostPerKg;
    
    let vaccines, bedding, labor;
    if (birdCount <= 50) {
      vaccines = data.vaccines[50];
      bedding = data.bedding[50];
      labor = data.labor[50];
    } else if (birdCount <= 100) {
      vaccines = data.vaccines[100];
      bedding = data.bedding[100];
      labor = data.labor[100];
    } else {
      vaccines = data.vaccines[500] * (birdCount / 500);
      bedding = data.bedding[500] * (birdCount / 500);
      labor = data.labor[500] * (birdCount / 500);
    }

    const totalCost = chicksCost + feedCost + vaccines + bedding + labor;
    
    let income;
    if (selectedCalculator === 'layer') {
      income = birdCount * data.eggsPerYear * data.eggPrice;
    } else {
      income = birdCount * data.sellingPrice;
    }

    const profit = income - totalCost;
    const roi = ((profit / totalCost) * 100).toFixed(1);

    return {
      chicksCost,
      feedCost,
      vaccines,
      bedding,
      labor,
      totalCost,
      income,
      profit,
      roi
    };
  };

  const results = calculateProfit();

  // Vaccination schedule
  const vaccinationSchedule = [
    { age: 'Day 7', vaccine: 'Newcastle', method: 'Eye drop / drinking water' },
    { age: 'Day 14', vaccine: 'Gumboro', method: 'Drinking water' },
    { age: 'Day 21', vaccine: 'Gumboro (Booster)', method: 'Drinking water' },
    { age: 'Week 4', vaccine: 'Fowl Pox', method: 'Wing web' },
    { age: 'Every 3 months', vaccine: 'Newcastle (Booster)', method: 'Eye drop / drinking water' }
  ];

  // Common mistakes
  const commonMistakes = [
    {
      title: 'Overcrowding',
      description: 'Too many birds in small space leads to stress, disease, and poor growth',
      solution: 'Follow space requirements: Broilers 1 sq ft, Layers 1.5-2 sq ft per bird'
    },
    {
      title: 'Poor Feeding',
      description: 'Using wrong feed type or compromising on quality',
      solution: 'Use correct feed for each stage and never compromise on quality'
    },
    {
      title: 'Skipping Vaccination',
      description: 'Missing even one vaccine can wipe out entire flock',
      solution: 'Follow vaccination schedule strictly and keep records'
    },
    {
      title: 'No Record Keeping',
      description: 'Cannot track profit or identify problems without records',
      solution: 'Keep daily records of feed, mortality, medication, and expenses'
    },
    {
      title: 'Poor Biosecurity',
      description: 'Allowing visitors and not disinfecting equipment',
      solution: 'Maintain strict biosecurity: footbaths, restricted access, clean equipment'
    }
  ];

  return (
    <div className="min-h-screen py-8 md:py-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16 md:py-20 mb-12">
        <div className="container-custom">
          <AnimatedSection animation="fade-up">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                <HiAcademicCap className="w-16 h-16 md:w-20 md:h-20" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Mkulima Sharp Academy
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 mb-8">
                From Zero Knowledge to Commercial Success - Your Complete Poultry Farming Guide
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => document.getElementById('breed-comparison').scrollIntoView({ behavior: 'smooth' })}
                >
                  Compare Breeds
                </Button>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => document.getElementById('profit-calculator').scrollIntoView({ behavior: 'smooth' })}
                >
                  Calculate Profit
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      <div className="container-custom">
        {/* Introduction Section */}
        <AnimatedSection animation="fade-up">
          <Card className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome to Poultry Farming Excellence
            </h2>
            <div className="prose max-w-none text-gray-700 space-y-4">
              <p className="text-lg leading-relaxed">
                Poultry farming is one of the most profitable and accessible agricultural ventures in Kenya. 
                With proper knowledge, discipline, and planning, any farmer can succeed. This comprehensive 
                guide covers everything from breed selection to commercial-scale operations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start space-x-4">
                  <HiShieldCheck className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quick Returns</h3>
                    <p className="text-gray-600">Broilers ready in 6 weeks, eggs start at 18-20 weeks</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <HiTrendingUp className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Low Startup Cost</h3>
                    <p className="text-gray-600">Start with as few as 50 birds, small land required</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <HiLightBulb className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">High Demand</h3>
                    <p className="text-gray-600">Constant market for eggs and chicken meat</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <HiChartBar className="w-8 h-8 text-primary-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Scalable Business</h3>
                    <p className="text-gray-600">Grow from backyard to commercial operation</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </AnimatedSection>

        {/* Breed Comparison Section */}
        <section id="breed-comparison" className="mb-16 scroll-mt-20">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Compare Chicken Breeds
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Choose the right breed for your goals. Each breed has unique advantages.
            </p>
          </AnimatedSection>

          {/* Breed Selection Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.keys(breeds).map((key) => (
              <button
                key={key}
                onClick={() => setActiveBreed(key)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  activeBreed === key
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-primary-50 shadow-card'
                }`}
              >
                {breeds[key].name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Active Breed Display */}
          <AnimatedSection animation="scale" key={activeBreed}>
            <Card className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={breeds[activeBreed].image}
                    alt={breeds[activeBreed].name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-900">Purpose:</span>
                      <span className="ml-2 text-gray-700">{breeds[activeBreed].purpose}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Market Age:</span>
                      <span className="ml-2 text-gray-700">{breeds[activeBreed].marketAge}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">Popular Strains:</span>
                      <p className="text-gray-700 mt-1">{breeds[activeBreed].strains}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {breeds[activeBreed].name}
                  </h3>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-primary-700 mb-3 flex items-center">
                      <HiShieldCheck className="w-5 h-5 mr-2" />
                      Advantages
                    </h4>
                    <ul className="space-y-2">
                      {breeds[activeBreed].advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary-600 mr-2">✓</span>
                          <span className="text-gray-700">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Disadvantages</h4>
                    <ul className="space-y-2">
                      {breeds[activeBreed].disadvantages.map((disadvantage, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-gray-400 mr-2">•</span>
                          <span className="text-gray-600">{disadvantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </section>

        {/* Profit Calculator Section */}
        <section id="profit-calculator" className="mb-16 scroll-mt-20">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Profitability Calculator
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Calculate your potential profits based on flock size and bird type
            </p>
          </AnimatedSection>

          <Card className="max-w-5xl mx-auto">
            {/* Calculator Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Select Bird Type
                </label>
                <div className="space-y-2">
                  {['broiler', 'layer', 'kienyeji'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedCalculator(type)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedCalculator === type
                          ? 'bg-primary-100 text-primary-700 font-semibold border-2 border-primary-600'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)} - {calculatorData[type].duration}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-3">
                  Number of Birds: {birdCount}
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={birdCount}
                  onChange={(e) => setBirdCount(Number(e.target.value))}
                  className="w-full h-3 bg-primary-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>50 birds</span>
                  <span>1000 birds</span>
                </div>
                
                {/* Quick Select Buttons */}
                <div className="flex gap-2 mt-4">
                  {[50, 100, 250, 500, 1000].map((count) => (
                    <button
                      key={count}
                      onClick={() => setBirdCount(count)}
                      className="px-3 py-1 bg-primary-50 text-primary-700 rounded-md text-sm hover:bg-primary-100"
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Cost Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Day-old Chicks ({birdCount} × KES {calculatorData[selectedCalculator].chicksPerBird})</span>
                  <span className="font-semibold text-gray-900">KES {results.chicksCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Feed Cost</span>
                  <span className="font-semibold text-gray-900">KES {results.feedCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Vaccines & Medication</span>
                  <span className="font-semibold text-gray-900">KES {results.vaccines.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Bedding & Utilities</span>
                  <span className="font-semibold text-gray-900">KES {results.bedding.toLocaleString()}</span>
                </div>
                {results.labor > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Labor</span>
                    <span className="font-semibold text-gray-900">KES {results.labor.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                  <span className="text-gray-900 font-bold text-lg">Total Cost</span>
                  <span className="font-bold text-gray-900 text-xl">KES {results.totalCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Revenue & Profit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary-50 rounded-xl p-6 text-center">
                <p className="text-primary-700 font-medium mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-primary-900">
                  KES {results.income.toLocaleString()}
                </p>
              </div>

              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-green-700 font-medium mb-2">Net Profit</p>
                <p className="text-3xl font-bold text-green-900">
                  KES {results.profit.toLocaleString()}
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl p-6 text-center">
                <p className="text-amber-700 font-medium mb-2">ROI</p>
                <p className="text-3xl font-bold text-amber-900">
                  {results.roi}%
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> These are estimates based on average market prices in Kenya. 
                Actual costs and profits may vary based on location, feed prices, and market conditions.
                Duration: <strong>{calculatorData[selectedCalculator].duration}</strong>
              </p>
            </div>
          </Card>
        </section>

        {/* Vaccination Schedule */}
        <section className="mb-16">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Vaccination Schedule
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Missing even one vaccine can wipe out your entire flock
            </p>
          </AnimatedSection>

          <Card className="max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Age</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Vaccine</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Method</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vaccinationSchedule.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-900 font-medium">{item.age}</td>
                      <td className="px-6 py-4 text-gray-700">{item.vaccine}</td>
                      <td className="px-6 py-4 text-gray-600">{item.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* Common Mistakes Section */}
        <section className="mb-16">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Common Mistakes to Avoid
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              Learn from others' mistakes - these errors cost farmers thousands
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonMistakes.map((mistake, index) => (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <Card className="h-full border-l-4 border-red-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {mistake.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    <strong>Problem:</strong> {mistake.description}
                  </p>
                  <p className="text-primary-700">
                    <strong>Solution:</strong> {mistake.solution}
                  </p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>

        {/* Rearing Timeline */}
        <section className="mb-16">
          <AnimatedSection animation="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Step-by-Step Rearing Guide
            </h2>
          </AnimatedSection>

          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Stage 1 */}
            <AnimatedSection animation="fade-right">
              <Card className="border-l-4 border-primary-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Stage 1: Day 0-7 (Brooding)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Temperature:</strong> 32-35°C (reduce by 2-3°C weekly)</p>
                  <p><strong>Space:</strong> 30-40 chicks per m²</p>
                  <p><strong>Feed:</strong> Chick Mash (20-22% protein)</p>
                  <p><strong>Water:</strong> Clean, lukewarm with vitamins</p>
                  <p><strong>Lighting:</strong> 24 hours</p>
                  <div className="bg-amber-50 p-4 rounded-lg mt-4">
                    <p className="text-sm"><strong>Warning Signs:</strong></p>
                    <p className="text-sm">• Chicks crowding together = Too cold</p>
                    <p className="text-sm">• Chicks moving away from heat = Too hot</p>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            {/* Stage 2 */}
            <AnimatedSection animation="fade-left">
              <Card className="border-l-4 border-primary-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Stage 2: Week 2-4 (Early Growth)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Temperature:</strong> Gradually reduce to 24-27°C</p>
                  <p><strong>Feed:</strong> Broiler Starter or Chick Mash</p>
                  <p><strong>Health:</strong> Vaccinate for Newcastle, Gumboro</p>
                  <p><strong>Management:</strong> Keep litter dry, provide grit</p>
                </div>
              </Card>
            </AnimatedSection>

            {/* Stage 3 */}
            <AnimatedSection animation="fade-right">
              <Card className="border-l-4 border-primary-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Stage 3: Week 5-8 (Growth/Finishing)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Broilers:</strong> Finisher feed, ready at 5-6 weeks (1.8-2.5kg)</p>
                  <p><strong>Kienyeji:</strong> Grower mash, free-range allowed</p>
                  <p><strong>Health:</strong> Deworm at week 6, Fowl Pox vaccine</p>
                </div>
              </Card>
            </AnimatedSection>

            {/* Stage 4 - Layers */}
            <AnimatedSection animation="fade-left">
              <Card className="border-l-4 border-primary-600">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Stage 4: Layers (18-72 weeks)
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p><strong>Feed:</strong> Layer Mash (18+ weeks)</p>
                  <p><strong>Production:</strong> Starts 18-20 weeks, peaks 28-40 weeks</p>
                  <p><strong>Requirements:</strong> Calcium supplements, 16 hours light/day</p>
                  <p><strong>Management:</strong> Nest boxes, regular egg collection</p>
                </div>
              </Card>
            </AnimatedSection>
          </div>
        </section>

        {/* Key Management Principles */}
        <section className="mb-16">
          <AnimatedSection animation="fade-up">
            <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-600">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                Key Success Principles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-primary-700 mb-3">Feed Quality</h3>
                  <p className="text-gray-700 text-sm">
                    Feed accounts for 60-70% of production cost. Never compromise on quality - it determines your profit.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-primary-700 mb-3">Biosecurity First</h3>
                  <p className="text-gray-700 text-sm">
                    Footbaths, restricted visitors, separate age groups. Prevention is cheaper than treatment.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-primary-700 mb-3">Record Keeping</h3>
                  <p className="text-gray-700 text-sm">
                    Track feed, mortality, medication, sales, expenses daily. Records determine profit or loss.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-primary-700 mb-3">Water Management</h3>
                  <p className="text-gray-700 text-sm">
                    Clean water daily, wash drinkers, avoid contamination. Poor water reduces feed intake.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-primary-700 mb-3">Market First</h3>
                  <p className="text-gray-700 text-sm">
                    Identify your buyers before starting. Farm gate, hotels, markets - know where you'll sell.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <h3 className="font-bold text-primary-700 mb-3">Financial Planning</h3>
                  <p className="text-gray-700 text-sm">
                    Understand cost of production, break-even point, profit margins. Farming is business, not gambling.
                  </p>
                </div>
              </div>
            </Card>
          </AnimatedSection>
        </section>

        {/* Resources Section */}
        <section className="mb-16">
          <AnimatedSection animation="fade-up">
            <Card className="text-center max-w-3xl mx-auto">
              <HiDocumentText className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Download Full Training Manual
              </h2>
              <p className="text-gray-700 mb-8">
                Get the complete PDF guide with detailed vaccination schedules, feed formulas, 
                disease management, and business planning templates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Download Training Manual
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.location.href = '/contact'}>
                  Book Training Session
                </Button>
              </div>
            </Card>
          </AnimatedSection>
        </section>

        {/* CTA Section */}
        <AnimatedSection animation="fade-up">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Poultry Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Get quality chicks, feeds, and equipment delivered to your farm
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.href = '/products'}
              >
                Shop Products
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                onClick={() => window.location.href = '/contact'}
              >
                Talk to Expert
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Academy;