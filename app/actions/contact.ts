'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
})

export async function sendContactEmail(formData: FormData) {
  try {
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    // Validate the form data
    const validatedData = contactSchema.parse(data)

    // In a real application, you would send an email here
    // For now, we'll just simulate a successful submission
    console.log('Contact form submission:', validatedData)

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // You can integrate with email services like:
    // - Resend
    // - SendGrid
    // - Nodemailer
    // - AWS SES
    // etc.

    return {
      success: true,
      message: 'Message sent successfully!'
    }
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message
      }
    }

    return {
      success: false,
      error: 'Failed to send message. Please try again.'
    }
  }
}