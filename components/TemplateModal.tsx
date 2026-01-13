'use client'

import { useState } from 'react'
import { Heart, Users, Backpack, Palmtree, Mountain, Briefcase, Landmark, UtensilsCrossed, Sparkles, ArrowRight, Search } from 'lucide-react'
import { tripTemplates, type TripTemplate } from '@/utils/tripTemplates'
import type { TripData } from '@/types'

interface TemplateModalProps {
  onSelectTemplate: (template: TripTemplate) => void
  onClose: () => void
}

const iconMap: { [key: string]: any } = {
  heart: Heart,
  users: Users,
  backpack: Backpack,
  palmtree: Palmtree,
  mountain: Mountain,
  briefcase: Briefcase,
  landmark: Landmark,
  utensils: UtensilsCrossed,
  binoculars: Search,
  sparkles: Sparkles
}

export default function TemplateModal({ onSelectTemplate, onClose }: TemplateModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TripTemplate | null>(null)

  const handleSelectTemplate = (template: TripTemplate) => {
    setSelectedTemplate(template)
  }

  const handleApply = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Choose Your Adventure</h2>
              <p className="text-blue-100">Select a template to get started quickly</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tripTemplates.map((template) => {
              const Icon = iconMap[template.icon] || Sparkles
              const isSelected = selectedTemplate?.id === template.id

              return (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template)}
                  className={`p-5 rounded-2xl border-2 transition-all text-left hover:shadow-lg ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{template.emoji}</span>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                  </div>

                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">
                    {template.name}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {template.description}
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {template.defaultDuration} days
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Budget:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        ${template.defaultBudgetRange.min} - ${template.defaultBudgetRange.max}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
                    <div className="flex flex-wrap gap-1">
                      {template.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-white dark:bg-slate-600 rounded-full text-xs text-gray-700 dark:text-gray-300"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-slate-700 p-6 bg-gray-50 dark:bg-slate-800/50">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
            >
              Skip & Create Custom
            </button>

            <button
              onClick={handleApply}
              disabled={!selectedTemplate}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all ${
                selectedTemplate
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-300 dark:bg-slate-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Use {selectedTemplate?.name || 'Template'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}