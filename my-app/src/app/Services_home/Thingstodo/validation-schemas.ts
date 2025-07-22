import { z } from "zod"

// Base schema for publisher details
export const basePublisherSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[\d\s\-()]{10,}$/, "Please enter a valid phone number"),
  address: z.string().min(10, "Address must be at least 10 characters"),
})

// Category-specific schemas
export const buyThingsSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    location: z.string().min(3, "Location is required"),
    googleMapsUrl: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
    openingHours: z.string().min(1, "Opening hours are required"),
    contactInfo: z.string().min(5, "Contact info is required"),
    entryFee: z.string().min(1, "Entry fee information is required"),
    // Fixed: Make boolean fields optional with default false
    isCard: z.boolean().optional().default(false),
    isCash: z.boolean().optional().default(false),
    isQRScan: z.boolean().optional().default(false),
    isParking: z.string().refine((val) => val === "yes" || val === "no", {
      message: "Please select parking availability",
    }),
    websiteUrl: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
    wifi: z.string().refine((val) => val === "yes" || val === "no", {
      message: "Please select WiFi availability",
    }),
    washrooms: z.string().refine((val) => val === "yes" || val === "no", {
      message: "Please select washroom availability",
    }),
    familyFriendly: z.string().refine((val) => val === "yes" || val === "no", {
      message: "Please select family-friendly status",
    }),
  })
  .refine((data) => data.isCard || data.isCash || data.isQRScan, {
    message: "At least one payment method must be selected",
    path: ["paymentMethods"],
  })

export const adventuresSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  googleMapsUrl: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
  duration: z.string().min(1, "Duration is required"),
  contactInfo: z.string().min(5, "Contact info is required"),
  bestfor: z.string().min(3, "Best for information is required"),
  price: z.string().min(1, "Price information is required"),
  bestTimetoVisit: z.string().min(1, "Best time to visit is required"),
  activities: z.string().min(10, "Activities description must be at least 10 characters"),
  whatToWear: z.string().min(10, "What to wear information is required"),
  whatToBring: z.string().min(10, "What to bring information is required"),
  precautions: z.string().min(10, "Precautions information is required"),
  websiteUrl: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  address: z.string().min(10, "Address must be at least 10 characters"),
})

export const specialEventsSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    googleMapsUrl: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
    date: z.string().min(1, "Date and time are required"),
    bestfor: z.string().min(3, "Best for information is required"),
    ticketPrice: z.string().min(1, "Ticket price information is required"),
    dresscode: z.string().min(3, "Dress code information is required"),
    parking: z.string().min(3, "Parking information is required"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    // Fixed: Make boolean fields optional with default false
    bus: z.boolean().optional().default(false),
    taxi: z.boolean().optional().default(false),
    train: z.boolean().optional().default(false),
  })
  .refine((data) => data.bus || data.taxi || data.train, {
    message: "At least one transportation method must be available",
    path: ["transportation"],
  })

export const placesToVisitSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    googleMapsUrl: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
    tripDuration: z.string().min(1, "Trip duration is required"),
    contactInfo: z.string().min(5, "Contact info is required"),
    bestfor: z.string().min(3, "Best for information is required"),
    ticketPrice: z.string().min(1, "Ticket price information is required"),
    bestTimetoVisit: z.string().min(1, "Best time to visit is required"),
    activities: z.string().min(10, "Activities description must be at least 10 characters"),
    whatToWear: z.string().min(10, "What to wear information is required"),
    whatToBring: z.string().min(10, "What to bring information is required"),
    precautions: z.string().min(10, "Precautions information is required"),
    address: z.string().min(10, "Address must be at least 10 characters"),
    // Fixed: Make boolean fields optional with default false
    bus: z.boolean().optional().default(false),
    taxi: z.boolean().optional().default(false),
    train: z.boolean().optional().default(false),
  })
  .refine((data) => data.bus || data.taxi || data.train, {
    message: "At least one transportation method must be available",
    path: ["transportation"],
  })

export const learningPointsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  googleMapsUrl: z.string().url("Please enter a valid Google Maps URL").optional().or(z.literal("")),
  duration: z.string().min(1, "Duration is required"),
  bestfor: z.string().min(3, "Best for information is required"),
  avgprice: z.string().min(1, "Average price information is required"),
  websiteUrl: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  address: z.string().min(10, "Address must be at least 10 characters"),
})

// Combined schemas
export const getValidationSchema = (category: string) => {
  const baseSchema = basePublisherSchema

  switch (category) {
    case "buythings":
      return baseSchema.merge(buyThingsSchema)
    case "adventures":
      return baseSchema.merge(adventuresSchema)
    case "specialevents":
      return baseSchema.merge(specialEventsSchema)
    case "placestovisit":
      return baseSchema.merge(placesToVisitSchema)
    case "learningpoints":
      return baseSchema.merge(learningPointsSchema)
    default:
      return baseSchema
  }
}

// Step-specific validation
export const validateStep = (step: number, category: string, formData: any) => {
  switch (step) {
    case 1:
      return z.object({ category: z.string().min(1, "Please select a category") }).safeParse({ category })
    case 2:
      return basePublisherSchema.safeParse(formData)
    case 3:
      // Preprocess the data to ensure boolean fields have proper values
      const processedData = {
        ...formData,
        // Ensure boolean fields are properly set
        isCard: formData.isCard || false,
        isCash: formData.isCash || false,
        isQRScan: formData.isQRScan || false,
        bus: formData.bus || false,
        taxi: formData.taxi || false,
        train: formData.train || false,
      }
      return getValidationSchema(category).safeParse(processedData)
    default:
      return { success: true, error: null }
  }
}
