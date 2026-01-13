import jsPDF from 'jspdf'
import type { ItineraryResponse } from '@/types'

export function exportToPDF(itinerary: ItineraryResponse) {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 15
  const lineHeight = 7
  let yPosition = margin

  const addNewPageIfNeeded = (neededSpace: number) => {
    if (yPosition + neededSpace > pageHeight - margin) {
      pdf.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Header
  pdf.setFillColor(37, 99, 235) // Blue
  pdf.rect(0, 0, pageWidth, 40, 'F')
  
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Wanderlust AI', margin, 20)
  
  pdf.setFontSize(16)
  pdf.text(itinerary.destination, margin, 30)
  
  yPosition = 50

  // Trip Details
  pdf.setTextColor(0, 0, 0)
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Duration: ${itinerary.totalDays} days`, margin, yPosition)
  pdf.text(`Budget: $${itinerary.totalBudget.toLocaleString()}`, margin + 60, yPosition)
  pdf.text(`Daily Average: $${Math.round(itinerary.totalBudget / itinerary.totalDays)}`, margin + 120, yPosition)
  
  yPosition += lineHeight * 2

  // Overview
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Trip Overview', margin, yPosition)
  yPosition += lineHeight
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const overviewLines = pdf.splitTextToSize(itinerary.overview, pageWidth - 2 * margin)
  pdf.text(overviewLines, margin, yPosition)
  yPosition += overviewLines.length * lineHeight + lineHeight

  // Best Time to Visit
  addNewPageIfNeeded(20)
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Best Time to Visit', margin, yPosition)
  yPosition += lineHeight
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  const timeLines = pdf.splitTextToSize(itinerary.bestTimeToVisit, pageWidth - 2 * margin)
  pdf.text(timeLines, margin, yPosition)
  yPosition += timeLines.length * lineHeight + lineHeight

  // Budget Breakdown
  addNewPageIfNeeded(60)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Budget Breakdown', margin, yPosition)
  yPosition += lineHeight * 1.5

  pdf.setFillColor(249, 250, 251)
  pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 45, 'F')
  
  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  const budgetItems = [
    { name: '🏨 Accommodation', value: itinerary.budgetBreakdown.accommodation },
    { name: '🍽️ Food & Dining', value: itinerary.budgetBreakdown.food },
    { name: '🎭 Activities', value: itinerary.budgetBreakdown.activities },
    { name: '🚗 Transportation', value: itinerary.budgetBreakdown.transportation },
    { name: '💼 Miscellaneous', value: itinerary.budgetBreakdown.miscellaneous }
  ]

  budgetItems.forEach((item, idx) => {
    pdf.text(item.name, margin + 5, yPosition + (idx * 8))
    pdf.text(`$${item.value.toLocaleString()}`, pageWidth - margin - 30, yPosition + (idx * 8))
  })
  
  yPosition += 50

  // Daily Itinerary
  addNewPageIfNeeded(20)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Day-by-Day Itinerary', margin, yPosition)
  yPosition += lineHeight * 1.5

  itinerary.dailyItinerary.forEach((day) => {
    addNewPageIfNeeded(80)
    
    // Day Header
    pdf.setFillColor(59, 130, 246)
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 10, 'F')
    
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.text(`Day ${day.day}: ${day.title}`, margin + 3, yPosition)
    
    yPosition += lineHeight * 2
    pdf.setTextColor(0, 0, 0)

    // Activities
    day.activities.forEach((activity) => {
      addNewPageIfNeeded(25)
      
      pdf.setFontSize(10)
      pdf.setFont('helvetica', 'bold')
      pdf.text(`⏰ ${activity.time}`, margin + 5, yPosition)
      yPosition += lineHeight
      
      pdf.setFont('helvetica', 'normal')
      pdf.text(activity.activity, margin + 5, yPosition)
      yPosition += lineHeight
      
      const descLines = pdf.splitTextToSize(activity.description, pageWidth - 2 * margin - 10)
      pdf.setFontSize(9)
      pdf.text(descLines, margin + 5, yPosition)
      yPosition += descLines.length * (lineHeight - 1)
      
      pdf.setFontSize(9)
      pdf.text(`📍 ${activity.location}`, margin + 5, yPosition)
      pdf.text(`💵 $${activity.estimatedCost}`, pageWidth - margin - 30, yPosition)
      
      yPosition += lineHeight * 1.5
    })

    // Meals
    addNewPageIfNeeded(20)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text("Today's Meals:", margin + 5, yPosition)
    yPosition += lineHeight
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`Breakfast: ${day.meals.breakfast.suggestion} ($${day.meals.breakfast.cost})`, margin + 5, yPosition)
    yPosition += lineHeight - 1
    pdf.text(`Lunch: ${day.meals.lunch.suggestion} ($${day.meals.lunch.cost})`, margin + 5, yPosition)
    yPosition += lineHeight - 1
    pdf.text(`Dinner: ${day.meals.dinner.suggestion} ($${day.meals.dinner.cost})`, margin + 5, yPosition)
    yPosition += lineHeight

    // Accommodation
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Accommodation:', margin + 5, yPosition)
    yPosition += lineHeight
    
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.text(`${day.accommodation.suggestion} ($${day.accommodation.cost}/night)`, margin + 5, yPosition)
    
    yPosition += lineHeight * 2
  })

  // Travel Tips
  addNewPageIfNeeded(60)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('💡 Travel Tips', margin, yPosition)
  yPosition += lineHeight * 1.5

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  itinerary.travelTips.forEach((tip, idx) => {
    addNewPageIfNeeded(15)
    const tipLines = pdf.splitTextToSize(`${idx + 1}. ${tip}`, pageWidth - 2 * margin - 5)
    pdf.text(tipLines, margin + 5, yPosition)
    yPosition += tipLines.length * lineHeight
  })

  yPosition += lineHeight

  // Packing Essentials
  addNewPageIfNeeded(40)
  pdf.setFontSize(14)
  pdf.setFont('helvetica', 'bold')
  pdf.text('🎒 Packing Essentials', margin, yPosition)
  yPosition += lineHeight * 1.5

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'normal')
  
  const halfItems = Math.ceil(itinerary.packingEssentials.length / 2)
  const column1 = itinerary.packingEssentials.slice(0, halfItems)
  const column2 = itinerary.packingEssentials.slice(halfItems)

  column1.forEach((item, idx) => {
    pdf.text(`• ${item}`, margin + 5, yPosition + (idx * lineHeight))
  })
  
  column2.forEach((item, idx) => {
    pdf.text(`• ${item}`, pageWidth / 2 + 10, yPosition + (idx * lineHeight))
  })

  yPosition += halfItems * lineHeight + lineHeight * 2

  // Footer
  if (yPosition > pageHeight - 30) {
    pdf.addPage()
    yPosition = margin
  }
  
  pdf.setFontSize(8)
  pdf.setTextColor(100, 100, 100)
  pdf.text('Generated by Wanderlust AI - Your AI Travel Companion', margin, pageHeight - 10)
  pdf.text(`Created on ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, pageHeight - 10)

  // Save PDF
  pdf.save(`${itinerary.destination.replace(/[^a-z0-9]/gi, '_')}_itinerary.pdf`)
}
