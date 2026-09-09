'use client';

import React, { useState, useEffect } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import Badge from '@components/ui/Badge';
import Loading from '@components/ui/Loading';
import { MapPin, Phone, Mail, BookOpen, Users, DollarSign, Star } from 'lucide-react';
import Link from 'next/link';
import schoolService from '@services/schools';
import { School } from '@app-types/index';

export default function SchoolDetail({ params }: { params: { id: string } }) {
  const [school, setSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchSchool();
  }, [params.id]);

  const fetchSchool = async () => {
    try {
      const data = await schoolService.getSchoolById(params.id);
      setSchool(data);
    } catch (error) {
      console.error('Failed to fetch school:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </>
    );
  }

  if (!school) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardBody>
              <p className="text-secondary-600">School not found</p>
              <Link href="/schools">
                <Button className="mt-4">Back to Schools</Button>
              </Link>
            </CardBody>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-secondary-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 py-12">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Logo */}
              <div className="flex-shrink-0">
                {school.logo ? (
                  <img
                    src={school.logo}
                    alt={school.name}
                    className="h-32 w-32 object-contain bg-white rounded-lg p-2"
                  />
                ) : (
                  <div className="h-32 w-32 bg-primary-300 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-4xl">
                      {school.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* School Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-secondary-900">
                    {school.name}
                  </h1>
                  {school.verified && (
                    <Badge variant="success">Verified</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-secondary-700 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} />
                    <span>{school.city}, {school.state}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={20} />
                    <span>{school.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={20} />
                    <span>{school.email}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge>{school.schoolType}</Badge>
                  <Badge>{school.curriculum}</Badge>
                  <Badge>{school.boardingOption}</Badge>
                  <Badge>{school.gender}</Badge>
                </div>
                {school.branches?.length ? <p className="mb-4 text-sm text-secondary-700">{school.branches.length} campus{school.branches.length === 1 ? '' : 'es'} available. Check the school form for branch instructions.</p> : null}

                <div className="flex gap-4">
                  <Link href={`/apply/${school.id}`}><Button size="lg">{school.applicationFields?.length ? 'Apply Online' : 'Application Details'}</Button></Link>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      const savedSchools = JSON.parse(localStorage.getItem('savedSchools') || '[]');
                      const exists = savedSchools.includes(school.id);
                      const nextSaved = exists
                        ? savedSchools.filter((id: string) => id !== school.id)
                        : [...savedSchools, school.id];

                      localStorage.setItem('savedSchools', JSON.stringify(nextSaved));
                      window.dispatchEvent(new Event('savedSchools:updated'));
                    }}
                  >
                    Save School
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-secondary-200 bg-white sticky top-16 z-10">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex gap-8 overflow-x-auto">
              {['about', 'academics', 'admissions', 'facilities', 'contact'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 font-semibold capitalize border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-secondary-600 hover:text-primary-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container max-w-6xl mx-auto px-4 py-12">
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardBody>
                    <h2 className="text-2xl font-bold text-secondary-900 mb-4">About</h2>
                    <p className="text-secondary-700 leading-relaxed">
                      {school.description || 'No description available'}
                    </p>
                  </CardBody>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardBody>
                    <h3 className="font-bold text-secondary-900 mb-4">Quick Info</h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-secondary-600">Curriculum</p>
                        <p className="font-semibold text-secondary-900">
                          {school.curriculum.toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Boarding</p>
                        <p className="font-semibold text-secondary-900 capitalize">
                          {school.boardingOption}
                        </p>
                      </div>
                      <div>
                        <p className="text-secondary-600">Gender</p>
                        <p className="font-semibold text-secondary-900 capitalize">
                          {school.gender}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {school.rating && (
                  <Card>
                    <CardBody>
                      <div className="flex items-center gap-2">
                        <Star size={20} className="text-yellow-500 fill-yellow-500" />
                        <div>
                          <p className="text-secondary-600 text-sm">Rating</p>
                          <p className="font-bold text-lg">
                            {school.rating.toFixed(1)} / 5.0
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === 'academics' && (
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Academic Programs</h2>
                {school.programmes?.length ? <ul className="list-disc space-y-2 pl-5 text-secondary-700">{school.programmes.map((programme) => <li key={programme}>{programme}</li>)}</ul> : <p className="text-secondary-600">Academic information will be shared by the school soon.</p>}
              </CardBody>
            </Card>
          )}

          {activeTab === 'admissions' && (
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Admissions</h2>
                {school.admissionInstructions && <p className="mb-5 whitespace-pre-line text-secondary-700">{school.admissionInstructions}</p>}
                {school.admissionRequirements?.length ? <><h3 className="mb-3 font-semibold text-secondary-900">Requirements</h3><ul className="list-disc space-y-2 pl-5 text-secondary-700">{school.admissionRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></> : <p className="text-secondary-600">Admission requirements will be shared by the school soon.</p>}
                {school.applicationFields?.length ? <div className="mt-6"><h3 className="mb-3 font-semibold text-secondary-900">Application form</h3><Link className="font-semibold text-primary-700 hover:underline" href={`/apply/${school.id}`}>Complete this school&apos;s application online</Link></div> : null}
                {school.admissionDocuments?.length ? <div className="mt-6"><h3 className="mb-3 font-semibold text-secondary-900">School resources</h3><ul className="space-y-2">{school.admissionDocuments.map((document) => <li key={document.url}><a className="text-primary-700 hover:underline" href={document.url} target="_blank" rel="noreferrer">{document.name}</a></li>)}</ul></div> : null}
              </CardBody>
            </Card>
          )}

          {activeTab === 'facilities' && (
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Facilities</h2>
                {school.facilities?.length ? <ul className="list-disc space-y-2 pl-5 text-secondary-700">{school.facilities.map((facility) => <li key={facility}>{facility}</li>)}</ul> : <p className="text-secondary-600">Facilities information will be shared by the school soon.</p>}
                {school.gallery?.length ? <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">{school.gallery.map((image) => <img key={image} src={image} alt={`${school.name} gallery`} className="h-40 w-full rounded-lg object-cover" />)}</div> : null}
              </CardBody>
            </Card>
          )}

          {activeTab === 'contact' && (
            <Card>
              <CardBody>
                <h2 className="text-2xl font-bold text-secondary-900 mb-6">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-2">Address</h3>
                    <p className="text-secondary-600">{school.address}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-2">Contact</h3>
                    <p className="text-secondary-600">{school.phone}</p>
                    <p className="text-secondary-600">{school.email}</p>
                    {school.website && <a className="mt-2 inline-block font-medium text-primary-700 hover:underline" href={school.website} target="_blank" rel="noreferrer">Visit school website</a>}
                  </div>
                </div>
                {school.branches?.length ? <div className="mt-6 border-t border-secondary-100 pt-6"><h3 className="mb-3 font-semibold text-secondary-900">Campuses</h3><div className="grid gap-3 md:grid-cols-2">{school.branches.map((branch) => <div key={branch.id} className="rounded-lg bg-secondary-50 p-4"><p className="font-semibold text-secondary-900">{branch.name}</p><p className="mt-1 text-sm text-secondary-600">{branch.address}</p><p className="text-sm text-secondary-600">{branch.city}, {branch.state}</p></div>)}</div></div> : null}
              </CardBody>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
