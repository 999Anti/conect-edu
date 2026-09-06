'use client';

import React, { useState, useEffect } from 'react';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import { Card, CardBody } from '@components/ui/Card';
import Loading from '@components/ui/Loading';
import { NIGERIAN_STATES, CURRICULA, BOARDING_OPTIONS, GENDERS, SCHOOL_TYPES } from '@constants/index';
import { MapPin, Star, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import schoolService, { SchoolFilters } from '@services/schools';
import { School } from '@app-types/index';

export default function Schools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<SchoolFilters>({
    search: '',
    state: '',
    curriculum: '',
    boardingOption: '',
    gender: '',
    schoolType: '',
    page: 1,
    limit: 12,
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, [filters]);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const response = await schoolService.getAllSchools(filters);
      setSchools(response.data);
    } catch (error) {
      console.error('Failed to fetch schools:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof SchoolFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (value: string) => {
    handleFilterChange('search', value);
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-secondary-50">
        <div className="container max-w-7xl mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-secondary-900 mb-4">
              Find Your Perfect School
            </h1>
            <p className="text-lg text-secondary-600">
              Search and filter from Nigeria's leading private secondary schools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              <Card>
                <CardBody className="space-y-4">
                  <h3 className="font-bold text-lg text-secondary-900">Filters</h3>

                  <Input
                    label="Search Schools"
                    placeholder="School name..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />

                  <Select
                    label="State"
                    options={[
                      { value: '', label: 'All States' },
                      ...NIGERIAN_STATES.map(state => ({ value: state, label: state })),
                    ]}
                    value={filters.state || ''}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                  />

                  <Select
                    label="Curriculum"
                    options={[
                      { value: '', label: 'All Curricula' },
                      { value: 'nigerian', label: 'Nigerian' },
                      { value: 'igcse', label: 'IGCSE' },
                      { value: 'ib', label: 'IB' },
                      { value: 'mixed', label: 'Mixed' },
                    ]}
                    value={filters.curriculum || ''}
                    onChange={(e) => handleFilterChange('curriculum', e.target.value)}
                  />

                  <Select
                    label="Boarding Option"
                    options={[
                      { value: '', label: 'All Options' },
                      { value: 'day', label: 'Day School' },
                      { value: 'boarding', label: 'Boarding' },
                      { value: 'mixed', label: 'Mixed' },
                    ]}
                    value={filters.boardingOption || ''}
                    onChange={(e) => handleFilterChange('boardingOption', e.target.value)}
                  />

                  <Select
                    label="Gender"
                    options={[
                      { value: '', label: 'All' },
                      { value: 'male', label: 'Boys' },
                      { value: 'female', label: 'Girls' },
                      { value: 'mixed', label: 'Mixed' },
                    ]}
                    value={filters.gender || ''}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                  />

                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setFilters({
                      search: '',
                      state: '',
                      curriculum: '',
                      boardingOption: '',
                      gender: '',
                      schoolType: '',
                      page: 1,
                      limit: 12,
                    })}
                  >
                    Clear Filters
                  </Button>
                </CardBody>
              </Card>
            </div>

            {/* Schools Grid */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-secondary-600">
                  Showing <span className="font-semibold">{schools.length}</span> schools
                </p>
                <button
                  className="lg:hidden text-primary-600 font-semibold"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              {isLoading ? (
                <div className="py-12 text-center">
                  <Loading />
                </div>
              ) : schools.length === 0 ? (
                <Card>
                  <CardBody className="py-12 text-center">
                    <p className="text-secondary-600 mb-4">No schools found matching your criteria</p>
                    <Button variant="outline" onClick={() => handleSearch('')}>
                      Clear Filters
                    </Button>
                  </CardBody>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {schools.map(school => (
                    <Card key={school.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                      {/* School Header */}
                      <div className="bg-gradient-to-r from-primary-50 to-primary-100 h-40 flex items-center justify-center">
                        {school.logo ? (
                          <img
                            src={school.logo}
                            alt={school.name}
                            className="h-32 w-32 object-contain"
                          />
                        ) : (
                          <div className="w-32 h-32 bg-primary-200 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-bold text-4xl">
                              {school.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>

                      <CardBody className="space-y-3">
                        {/* School Name & Location */}
                        <div>
                          <h3 className="text-lg font-bold text-secondary-900">
                            {school.name}
                          </h3>
                          <div className="flex items-center gap-2 text-secondary-600 text-sm mt-1">
                            <MapPin size={16} />
                            {school.city}, {school.state}
                          </div>
                        </div>

                        {/* School Details */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-secondary-700">
                            <BookOpen size={16} className="text-primary-600" />
                            <span>{school.curriculum.toUpperCase()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-secondary-700">
                            <Users size={16} className="text-primary-600" />
                            <span>{school.boardingOption}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-secondary-600 text-sm line-clamp-2">
                          {school.description || 'No description available'}
                        </p>

                        {/* Rating */}
                        {school.rating && (
                          <div className="flex items-center gap-2">
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-semibold">{school.rating.toFixed(1)}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Link href={`/schools/${school.id}`} className="flex-1">
                            <Button variant="outline" fullWidth size="sm">
                              View School
                            </Button>
                          </Link>
                          <Link href={`/apply/${school.id}`} className="flex-1">
                            <Button fullWidth size="sm">
                              Apply Now
                            </Button>
                          </Link>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
