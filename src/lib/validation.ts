import { z } from 'zod'

// 1. Contact Form Validator Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().optional().or(z.literal('')),
  type: z.enum(['contact', 'consultation', 'seo_audit', 'website_audit', 'automation_assessment']),
  budget: z.string().optional().or(z.literal('')),
  timeline: z.string().optional().or(z.literal('')),
  description: z.string().min(10, 'Project description must be at least 10 characters')
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// 2. Auth Validators
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export type LoginData = z.infer<typeof loginSchema>

// Setup Wizard Validator
export const setupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  supabaseUrl: z.string().url('Please enter a valid URL'),
  supabaseAnonKey: z.string().min(20, 'Please enter a valid Supabase anonymous key')
})

export type SetupData = z.infer<typeof setupSchema>

// 3. Blog Post Validator
export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with dashes'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Article content must be at least 20 characters'),
  featured_image: z.string().url('Please enter a valid image URL').optional().or(z.literal('')),
  status: z.enum(['draft', 'published', 'scheduled']),
  is_featured: z.boolean().default(false),
  reading_time_minutes: z.number().int().min(1).default(5),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  tags: z.array(z.string()).optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional()
})

export type BlogPostData = z.infer<typeof blogPostSchema>

// 4. Product / Marketplace Validator
export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with dashes'),
  short_description: z.string().min(10, 'Short description must be at least 10 characters'),
  description: z.string().min(20, 'Full description must be at least 20 characters'),
  price: z.number().min(0, 'Price must be 0 or positive'),
  is_free: z.boolean().default(true),
  download_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  demo_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  documentation_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must follow semantic formatting (e.g. 1.0.0)'),
  type: z.enum(['saas', 'desktop_app', 'chrome_extension', 'browser_extension', 'template', 'ui_kit', 'ai_tool', 'script', 'ebook', 'resource']),
  status: z.enum(['active', 'inactive', 'archived']),
  seo_title: z.string().optional(),
  seo_description: z.string().optional()
})

export type ProductData = z.infer<typeof productSchema>

// 5. CRM Note Form Validator
export const leadNoteSchema = z.object({
  content: z.string().min(2, 'Note must contain content')
})

export type LeadNoteData = z.infer<typeof leadNoteSchema>

// CRM Task Form Validator
export const leadTaskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().optional(),
  due_date: z.string().optional(),
  assigned_to: z.string().uuid().optional().or(z.literal(''))
})

export type LeadTaskData = z.infer<typeof leadTaskSchema>

// Support Ticket Validator
export const ticketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  product_id: z.string().uuid().optional().or(z.literal('')),
  message: z.string().min(10, 'Message details must be at least 10 characters')
})

export type TicketFormData = z.infer<typeof ticketSchema>

// Ticket Message Validator
export const ticketMessageSchema = z.object({
  message: z.string().min(2, 'Message must be at least 2 characters')
})

export type TicketMessageFormData = z.infer<typeof ticketMessageSchema>

// KB Category Validator
export const kbCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with dashes'),
  description: z.string().optional().or(z.literal(''))
})

export type KBCategoryData = z.infer<typeof kbCategorySchema>

// KB Article Validator
export const kbArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with dashes'),
  category_id: z.string().uuid('Please select a valid category'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  is_published: z.boolean().default(true),
  seo_title: z.string().optional(),
  seo_description: z.string().optional()
})

export type KBArticleData = z.infer<typeof kbArticleSchema>
