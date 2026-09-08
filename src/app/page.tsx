import React from 'react';
import Link from 'next/link';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import { ArrowRight, Search, Star, Shield, Users, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 md:py-32">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
                  Find the Right School.
                  <span className="text-primary-600"> Apply with Ease.</span>
                </h1>
                <p className="text-xl text-secondary-600 mb-8">
                  Discover Nigeria's leading private secondary schools, explore their campuses, compare your options, and apply online as a parent or guardian.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/schools">
                    <Button size="lg" className="gap-2">
                      Find a School
                      <ArrowRight size={20} />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button variant="outline" size="lg">
                      How It Works
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Hero Image Placeholder */}
              <div className="bg-gradient-to-br from-primary-200 to-primary-400 rounded-xl h-80 md:h-96 flex items-center justify-center">
                <div className="text-center">
                  <Search size={64} className="text-primary-600 mx-auto mb-4" />
                  <p className="text-primary-700 font-semibold">School Discovery</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Why Choose CONECT EDU?
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                Making school admission digital, transparent, and accessible for every family.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 border border-secondary-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="text-primary-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Discover Easily
                </h3>
                <p className="text-secondary-600">
                  Search and filter by location, curriculum, boarding options, fees, and more.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 border border-secondary-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-primary-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Secure & Verified
                </h3>
                <p className="text-secondary-600">
                  All schools on our platform are verified and trusted by thousands of families.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 border border-secondary-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-primary-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Expert Support
                </h3>
                <p className="text-secondary-600">
                  Our team is here to help you every step of the admission journey.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-32 bg-secondary-50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Simple 5-Step Process
              </h2>
              <p className="text-xl text-secondary-600">
                From discovery to admission in just a few clicks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {[
                { step: '1', title: 'Discover', desc: 'Find schools matching your criteria' },
                { step: '2', title: 'Compare', desc: 'Compare schools side by side' },
                { step: '3', title: 'Apply', desc: 'Complete your application' },
                { step: '4', title: 'Pay', desc: 'Secure online payment' },
                { step: '5', title: 'Track', desc: 'Monitor your application status' },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
              Ready to Find Your Ideal School?
            </h2>
            <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto">
              Join thousands of families who have already discovered their perfect school through CONECT EDU.
            </p>
            <Link href="/schools">
              <Button size="lg" className="gap-2">
                Start Exploring Now
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
