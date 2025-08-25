"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"

interface ContactFormProps {
  onSuccess?: () => void
}

const STORAGE_KEY = "fabricpro_contact_form"

export function ContactForm({ onSuccess }: ContactFormProps = {}) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    businessType: "",
    annualVolume: "",
    primaryMarkets: "",
    fabricTypes: [] as string[],
    specifications: "",
    timeline: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Load saved form data
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
          const parsed = JSON.parse(savedData)
          setFormData(parsed.formData || formData)
          setCurrentStep(parsed.currentStep || 1)
          setLastSaved(parsed.lastSaved ? new Date(parsed.lastSaved) : null)
        }
      } catch (error) {
        console.error("Error loading saved form data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedData()
  }, [])

  // Auto-save function
  const saveFormData = useCallback(() => {
    try {
      const dataToSave = {
        formData,
        currentStep,
        lastSaved: new Date().toISOString(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
      setLastSaved(new Date())
      setHasUnsavedChanges(false)
    } catch (error) {
      console.error("Error saving form data:", error)
    }
  }, [formData, currentStep])

  // Auto-save effect
  useEffect(() => {
    if (isLoading) return

    setHasUnsavedChanges(true)
    const timeoutId = setTimeout(() => {
      saveFormData()
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [formData, currentStep, saveFormData, isLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (fabricType: string) => {
    setFormData((prev) => ({
      ...prev,
      fabricTypes: prev.fabricTypes.includes(fabricType)
        ? prev.fabricTypes.filter((type) => type !== fabricType)
        : [...prev.fabricTypes, fabricType],
    }))
  }

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log("Form submitted:", formData)

      // Clear saved data
      localStorage.removeItem(STORAGE_KEY)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
        onSuccess?.()
      }, 3000)
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your form. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading form...</span>
        </div>
      </div>
    )
  }

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Quote Request Submitted!</h3>
          <p className="text-slate-600">Thank you! We'll get back to you within 24 hours.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Auto-save indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges ? (
              <>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-600">Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600">
                  Saved {lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  currentStep >= step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 transition-colors ${currentStep > step ? "bg-blue-600" : "bg-slate-200"}`}
                ></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-slate-600">
          Step {currentStep} of 3:{" "}
          {currentStep === 1 ? "Company Information" : currentStep === 2 ? "Business Details" : "Requirements"}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Person *</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="your@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Business Type *</label>
              <select
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select business type</option>
                <option value="garment-manufacturer">Garment Manufacturer</option>
                <option value="clothing-retailer">Clothing Retailer</option>
                <option value="fabric-importer">Fabric Importer</option>
                <option value="trading-company">Trading Company</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Fabric Volume</label>
              <select
                name="annualVolume"
                value={formData.annualVolume}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select volume range</option>
                <option value="under-10k">Under 10,000 meters</option>
                <option value="10k-50k">10,000 - 50,000 meters</option>
                <option value="50k-100k">50,000 - 100,000 meters</option>
                <option value="100k-500k">100,000 - 500,000 meters</option>
                <option value="over-500k">Over 500,000 meters</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Primary Markets</label>
              <input
                type="text"
                name="primaryMarkets"
                value={formData.primaryMarkets}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="e.g., North America, Europe, Asia"
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Fabric Types of Interest *</label>
              <div className="grid grid-cols-2 gap-3">
                {["Cotton", "Silk", "Polyester", "Blends", "Linen", "Wool", "Technical", "Denim"].map((fabric) => (
                  <label key={fabric} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.fabricTypes.includes(fabric)}
                      onChange={() => handleCheckboxChange(fabric)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">{fabric}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Specifications & Requirements</label>
              <textarea
                name="specifications"
                value={formData.specifications}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Weight, width, color requirements, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Timeline</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select timeline</option>
                <option value="immediate">Immediate (Within 1 month)</option>
                <option value="1-3-months">1-3 months</option>
                <option value="3-6-months">3-6 months</option>
                <option value="6-months-plus">6+ months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Any additional requirements or questions..."
              />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Previous
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={isSubmitting}
              className="ml-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Quote Request</span>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
