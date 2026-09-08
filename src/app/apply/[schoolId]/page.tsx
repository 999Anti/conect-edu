'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Textarea from '@components/ui/Textarea';
import { Card, CardBody, CardHeader } from '@components/ui/Card';
import Loading from '@components/ui/Loading';
import { useStore } from '@store/auth';
import { YEAR_GROUPS } from '@constants/index';
import schoolService from '@services/schools';
import applicationService from '@services/applications';
import { School } from '@app-types/index';

export default function ApplyPage({ params }: { params: { schoolId: string } }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useStore();
  const [school, setSchool] = useState<School | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    studentDOB: '',
    studentGender: 'male',
    studentNationality: 'Nigerian',
    currentSchool: '',
    currentClass: '',
    desiredClass: '',
    branchId: '',
    parentName: '',
    parentEmail: user?.email || '',
    parentPhone: '',
    parentAddress: '',
    customAnswers: [] as Array<{ questionId: string; question: string; answer: string }>,
  });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchSchool();
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    if (user?.email) {
      setFormData((current) => current.parentEmail ? current : { ...current, parentEmail: user.email });
    }
  }, [user?.email]);

  const fetchSchool = async () => {
    try {
      const data = await schoolService.getSchoolById(params.schoolId);
      setSchool(data);
    } catch (error) {
      console.error('Failed to fetch school:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const application = await applicationService.createApplication({
        schoolId: params.schoolId,
        ...formData,
      });
      router.push(`/applications/${application.id}`);
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCustomAnswer = (questionId: string, question: string, answer: string) => setFormData((current) => ({ ...current, customAnswers: [...current.customAnswers.filter((item) => item.questionId !== questionId), { questionId, question, answer }] }));

  if (isLoading || isAuthLoading) {
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
          <p>School not found</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-secondary-50 py-12">
        <div className="container max-w-2xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Application to {school.name}
            </h1>
            <p className="text-secondary-600">
              Step {currentStep} of 3
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex gap-2">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${
                    step <= currentStep ? 'bg-primary-600' : 'bg-secondary-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Student Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Student Information
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      name="studentFirstName"
                      value={formData.studentFirstName}
                      onChange={handleInputChange}
                      required
                    />
                    <Input
                      label="Last Name"
                      name="studentLastName"
                      value={formData.studentLastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Input
                    label="Date of Birth"
                    type="date"
                    name="studentDOB"
                    value={formData.studentDOB}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Gender"
                      name="studentGender"
                      value={formData.studentGender}
                      onChange={handleInputChange}
                      options={[
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                      ]}
                    />
                    <Input
                      label="Nationality"
                      name="studentNationality"
                      value={formData.studentNationality}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <Input
                    label="Current School"
                    name="currentSchool"
                    value={formData.currentSchool}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Current Class"
                      name="currentClass"
                      value={formData.currentClass}
                      onChange={handleInputChange}
                      options={YEAR_GROUPS.map(yg => ({ value: yg, label: yg }))}
                      required
                    />
                    <Select
                      label="Desired Class"
                      name="desiredClass"
                      value={formData.desiredClass}
                      onChange={handleInputChange}
                      options={YEAR_GROUPS.map(yg => ({ value: yg, label: yg }))}
                      required
                    />
                  </div>

                  {school.branches?.length ? <Select label="Preferred school branch" name="branchId" value={formData.branchId} onChange={handleInputChange} options={[{ value: '', label: 'Select a branch' }, ...school.branches.map((branch) => ({ value: branch.id, label: `${branch.name} - ${branch.city}, ${branch.state}` }))]} required /> : null}
                </CardBody>
              </Card>
            )}

            {/* Step 2: Parent Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Parent/Guardian Information
                  </h2>
                </CardHeader>
                <CardBody className="space-y-4">
                  <Input
                    label="Full Name"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Email"
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    required
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleInputChange}
                    required
                  />

                  <Textarea
                    label="Address"
                    name="parentAddress"
                    value={formData.parentAddress}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                  {school.applicationQuestions?.map((question) => <Textarea key={question.id} label={question.question} value={formData.customAnswers.find((item) => item.questionId === question.id)?.answer || ''} onChange={(event) => updateCustomAnswer(question.id, question.question, event.target.value)} rows={3} required={question.required} />)}
                </CardBody>
              </Card>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold text-secondary-900">
                    Review Application
                  </h2>
                </CardHeader>
                <CardBody className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-3">Student Details</h3>
                    <div className="bg-secondary-50 p-4 rounded-lg space-y-2 text-secondary-700">
                      <p>
                        <span className="font-semibold">Name:</span> {formData.studentFirstName} {formData.studentLastName}
                      </p>
                      <p>
                        <span className="font-semibold">DOB:</span> {formData.studentDOB}
                      </p>
                      <p>
                        <span className="font-semibold">Current School:</span> {formData.currentSchool}
                      </p>
                      <p>
                        <span className="font-semibold">Desired Class:</span> {formData.desiredClass}
                      </p>
                      {formData.branchId && <p><span className="font-semibold">Preferred Branch:</span> {school.branches?.find((branch) => branch.id === formData.branchId)?.name}</p>}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-3">Parent Details</h3>
                    <div className="bg-secondary-50 p-4 rounded-lg space-y-2 text-secondary-700">
                      <p>
                        <span className="font-semibold">Name:</span> {formData.parentName}
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span> {formData.parentEmail}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span> {formData.parentPhone}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
                    <p className="text-primary-900 font-semibold mb-2">Application Fee</p>
                    <p className="text-lg font-bold text-primary-600">₦5,000 + processing fee</p>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="flex-1"
                >
                  Submit Application
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}
