"use client"
import "./guide.css" // Adjusted import path
import type React from "react"
import { useState } from "react"
import ImageUpload, { type ImageObject } from "./ImageUpload" // Adjusted import path
import { useFormValidation } from "./use-form-validation"
import {
  User,
  Mail,
  Bus,
  Train,
  Phone,
  MapPin,
  Building2,
  Tag,
  GlobeIcon,
  FileText,
  Clock,
  DollarSign,
  CreditCard,
  Banknote,
  QrCode,
  Car,
  Globe,
  Wifi,
  Users,
  Calendar,
  Mountain,
  Timer,
  Star,
  List,
  Shirt,
  Backpack,
  AlertTriangle,
  AlertCircle,
} from "lucide-react"
import type { CloudinaryUploadResult } from "./cloudinary" // Corrected import

// Define the form data types
type BaseFormData = {
  name: string
  email: string
  phone: string
  address: string
}

type LearningPointsData = {
  title: string
  category: string
  subcategory: string
  imageUrl: string
  description: string
  googleMapsUrl: string
  duration: string
  bestfor: string
  avgprice: string
  tourname: Record<string, any>
  price: Record<string, any>
  websiteUrl?: string
  address: string
}

type BuyThingsData = {
  title: string
  category: string
  subcategory: string
  description: string
  location: string
  googleMapsUrl: string
  openingHours: string
  contactInfo: string
  entryFee: string
  isCard: boolean
  isCash: boolean
  isQRScan: boolean
  isParking: string
  websiteUrl: string
  wifi: string
  washrooms: string
  familyFriendly: string
}

type AdventuresData = {
  title: string
  category: string
  subcategory: string
  description: string
  googleMapsUrl: string
  duration: string
  contactInfo: string
  bestfor: string
  price: string
  bestTimetoVisit: string
  activities: string
  whatToWear: string
  whatToBring: string
  precautions: string
  websiteUrl: string
  address: string
}

type SpecialEventsData = {
  title: string // Title
  category: string // Category
  subcategory: string // Subcategory
  imageUrl: string // Image URL
  description: string // Description
  googleMapsUrl: string // Google Maps URL
  date: string // Date
  bestfor: string // Best For
  ticketPrice: string // Ticket Price
  dresscode: string // Dress Code
  parking: string // Parking Details
  address: string // Address
  bus: boolean // Bus Available
  taxi: boolean // Taxi Available
  train: boolean // Train Available
}

type PlacesToVisitData = {
  title: string
  category: string
  subcategory: string
  imageUrl: string
  description: string
  googleMapsUrl: string
  tripDuration: string
  contactInfo: string
  bestfor: string
  ticketPrice: string
  bestTimetoVisit: string // String for form input (Date ISO)
  activities: string
  whatToWear: string
  whatToBring: string
  precautions: string
  time: string // Time in HH:MM format
  address: string
  bus: boolean
  taxi: boolean
  train: boolean
}

// Combined form data type, now including the Cloudinary image result
type RegisterPublisherFormData = BaseFormData &
  Partial<BuyThingsData> &
  Partial<AdventuresData> &
  Partial<SpecialEventsData> &
  Partial<LearningPointsData> &
  Partial<PlacesToVisitData> & {
    images?: CloudinaryUploadResult[] // Array of image upload results
    submittedImageCount?: number
    submittedImages?: ImageObject[]
  }

// Error display component
const FieldError: React.FC<{ errors?: string[] }> = ({ errors }) => {
  if (!errors || errors.length === 0) return null

  return (
    <div className="field-error">
      <AlertCircle size={16} />
      <div>
        {errors.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    </div>
  )
}

export default function RegisterPublisher() {
  const [category, setCategory] = useState<string>("")
  const [currentStep, setCurrentStep] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  // Add this state variable near the top with other state declarations
  const [submittedImageCount, setSubmittedImageCount] = useState(0)
  const [submittedImages, setSubmittedImages] = useState<ImageObject[]>([])
  // Initialize form data with proper boolean defaults
  const [formData, setFormData] = useState<RegisterPublisherFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    images: [],
    // Initialize boolean fields
    isCard: false,
    isCash: false,
    isQRScan: false,
    bus: false,
    taxi: false,
    train: false,
  })

  // Add validation hook
  const { errors, validateStepData, markFieldAsTouched, clearErrors, getFieldError, hasErrors, debugErrors } =
    useFormValidation()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value)
    clearErrors()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
    // Mark field as touched for validation
    markFieldAsTouched(name)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    markFieldAsTouched(e.target.name)
  }

  // New handler for Cloudinary image upload success
  const [images, setImages] = useState<ImageObject[]>([])

  // Function to handle image changes from ImageUpload component
  const handleImagesChange = (updatedImages: ImageObject[]) => {
    setImages(updatedImages)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Debug current state
    console.log("=== FORM SUBMISSION DEBUG ===")
    console.log("Current form data:", formData)
    console.log("Current category:", category)
    debugErrors()

    // Final validation with processed data
    const processedFormData = {
      ...formData,
      // Ensure boolean fields are properly set
      isCard: formData.isCard || false,
      isCash: formData.isCash || false,
      isQRScan: formData.isQRScan || false,
      bus: formData.bus || false,
      taxi: formData.taxi || false,
      train: formData.train || false,
    }

    const isValid = validateStepData(3, category, processedFormData)
    console.log("Validation result:", isValid)

    if (!isValid) {
      setMessage("Please fix the validation errors before submitting.")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      // Store image count and data before clearing
      const currentImageCount = images.length
      const currentImages = [...images]

      // Prepare data to send to your backend
      const dataToSend = {
        ...processedFormData,
        category: category, // Ensure category is included
        images, // Send the array of Cloudinary image results
      }

      console.log("📤 Sending form data:", dataToSend)

      // Use fetch API for simplicity, as the image is already uploaded to Cloudinary
      const response = await fetch(`http://localhost:2000/api/${category}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (response.ok) {
        console.log("✅ Submission successful:", result.data)

        // Store the submitted data for success display BEFORE clearing images
        setSubmittedImageCount(currentImageCount)
        setSubmittedImages(currentImages)

        setIsSuccess(true)
        setImages([])
      } else {
        setMessage(`Failed to submit the form: ${result.message || "Unknown error"}`)
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error)
      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setMessage("Cannot connect to server. Please check if the server is running on localhost:2000")
        } else {
          setMessage(`Error: ${error.message}`)
        }
      } else {
        setMessage("An unexpected error occurred. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    // Validate current step before proceeding
    const isValid = validateStepData(currentStep, category, { ...formData, category })

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      clearErrors()
    }
  }

  const resetForm = () => {
    setIsSuccess(false)
    setCurrentStep(1)
    setCategory("")
    setMessage("")
    clearErrors()
    setSubmittedImageCount(0)
    setSubmittedImages([])
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      images: [],
      // Reset boolean fields
      isCard: false,
      isCash: false,
      isQRScan: false,
      bus: false,
      taxi: false,
      train: false,
    })
    setImages([])
  }

  // Rest of your component remains the same...
  const renderCategorySpecificFields = () => {
    let fields: {
      label: string
      name: keyof (BuyThingsData & AdventuresData & SpecialEventsData & PlacesToVisitData & LearningPointsData)
      type: string
      icon: React.ReactNode
    }[] = []

    if (category === "buythings") {
      fields = [
        { label: "Title", name: "title", type: "text", icon: <Tag className="labelIcon" /> },
        { label: "Description", name: "description", type: "textarea", icon: <FileText className="labelIcon" /> },
        { label: "Location", name: "location", type: "text", icon: <MapPin className="labelIcon" /> },
        { label: "Google Maps URL", name: "googleMapsUrl", type: "text", icon: <Globe className="labelIcon" /> },
        { label: "Opening Hours", name: "openingHours", type: "timerange", icon: <Clock className="labelIcon" /> },
        { label: "Contact Info", name: "contactInfo", type: "text", icon: <Phone className="labelIcon" /> },
        { label: "Entry Fee", name: "entryFee", type: "text", icon: <DollarSign className="labelIcon" /> },
        { label: "Accepts Card?", name: "isCard", type: "checkbox", icon: <CreditCard className="labelIcon" /> },
        { label: "Accepts Cash?", name: "isCash", type: "checkbox", icon: <Banknote className="labelIcon" /> },
        { label: "Accepts QR Scan?", name: "isQRScan", type: "checkbox", icon: <QrCode className="labelIcon" /> },
        { label: "Parking", name: "isParking", type: "dropdown", icon: <Car className="labelIcon" /> },
        { label: "Website URL", name: "websiteUrl", type: "text", icon: <Globe className="labelIcon" /> },
        { label: "WiFi", name: "wifi", type: "dropdown", icon: <Wifi className="labelIcon" /> },
        { label: "Washrooms", name: "washrooms", type: "dropdown", icon: <Building2 className="labelIcon" /> },
        { label: "Family Friendly", name: "familyFriendly", type: "dropdown", icon: <Users className="labelIcon" /> },
      ]
    } else if (category === "adventures") {
      fields = [
        { label: "Title", name: "title", type: "text", icon: <Mountain className="labelIcon" /> },
        { label: "Description", name: "description", type: "textarea", icon: <FileText className="labelIcon" /> },
        { label: "Google Maps URL", name: "googleMapsUrl", type: "text", icon: <Globe className="labelIcon" /> },
        { label: "Duration", name: "duration", type: "text", icon: <Timer className="labelIcon" /> },
        { label: "Contact Info", name: "contactInfo", type: "text", icon: <Phone className="labelIcon" /> },
        { label: "Best For", name: "bestfor", type: "text", icon: <Star className="labelIcon" /> },
        { label: "Price", name: "price", type: "text", icon: <DollarSign className="labelIcon" /> },
        {
          label: "Best Time to Visit",
          name: "bestTimetoVisit",
          type: "timerange",
          icon: <Calendar className="labelIcon" />,
        },
        { label: "Activities", name: "activities", type: "textarea", icon: <List className="labelIcon" /> },
        { label: "What To Wear", name: "whatToWear", type: "textarea", icon: <Shirt className="labelIcon" /> },
        { label: "What To Bring", name: "whatToBring", type: "textarea", icon: <Backpack className="labelIcon" /> },
        { label: "Precautions", name: "precautions", type: "textarea", icon: <AlertTriangle className="labelIcon" /> },
        { label: "Website URL", name: "websiteUrl", type: "text", icon: <Globe className="labelIcon" /> },
        { label: "Location", name: "address", type: "text", icon: <MapPin className="labelIcon" /> },
      ]
    } else if (category === "specialevents") {
      fields = [
        { label: "Title", name: "title", type: "text", icon: <Mountain className="labelIcon" /> },
        { label: "Location", name: "location", type: "text", icon: <MapPin className="labelIcon" /> },
        { label: "Description", name: "description", type: "textarea", icon: <FileText className="labelIcon" /> },
        { label: "Google Maps URL", name: "googleMapsUrl", type: "text", icon: <Globe className="labelIcon" /> },
        { label: "Date", name: "date", type: "date&time", icon: <Calendar className="labelIcon" /> },
        { label: "Best For", name: "bestfor", type: "text", icon: <Star className="labelIcon" /> },
        { label: "Ticket Price", name: "ticketPrice", type: "text", icon: <DollarSign className="labelIcon" /> },
        { label: "Dress Code", name: "dresscode", type: "text", icon: <Shirt className="labelIcon" /> },
        { label: "Parking Details", name: "parking", type: "text", icon: <Car className="labelIcon" /> },
        { label: "Address", name: "address", type: "text", icon: <MapPin className="labelIcon" /> },
        { label: "Bus Available", name: "bus", type: "checkbox", icon: <Bus className="labelIcon" /> },
        { label: "Taxi Available", name: "taxi", type: "checkbox", icon: <Car className="labelIcon" /> },
        { label: "Train Available", name: "train", type: "checkbox", icon: <Train className="labelIcon" /> },
      ]
    } else if (category === "placestovisit") {
      fields = [
        { label: "Title", name: "title", type: "text", icon: <Mountain className="labelIcon" /> },
        { label: "Description", name: "description", type: "textarea", icon: <FileText className="labelIcon" /> },
        { label: "Google Maps URL", name: "googleMapsUrl", type: "text", icon: <Globe className="labelIcon" /> },
        { label: "Trip Duration", name: "tripDuration", type: "text", icon: <Timer className="labelIcon" /> },
        { label: "Contact Info", name: "contactInfo", type: "text", icon: <Phone className="labelIcon" /> },
        { label: "Best For", name: "bestfor", type: "text", icon: <Star className="labelIcon" /> },
        { label: "Ticket Price", name: "ticketPrice", type: "text", icon: <DollarSign className="labelIcon" /> },
        {
          label: "Best Time to Visit",
          name: "bestTimetoVisit",
          type: "timerange",
          icon: <Calendar className="labelIcon" />,
        },
        { label: "Activities", name: "activities", type: "textarea", icon: <List className="labelIcon" /> },
        { label: "What To Wear", name: "whatToWear", type: "textarea", icon: <Shirt className="labelIcon" /> },
        { label: "What To Bring", name: "whatToBring", type: "textarea", icon: <Backpack className="labelIcon" /> },
        { label: "Precautions", name: "precautions", type: "textarea", icon: <AlertTriangle className="labelIcon" /> },
        { label: "Address", name: "address", type: "text", icon: <MapPin className="labelIcon" /> },
        { label: "Bus Available", name: "bus", type: "checkbox", icon: <Bus className="labelIcon" /> },
        { label: "Taxi Available", name: "taxi", type: "checkbox", icon: <Car className="labelIcon" /> },
        { label: "Train Available", name: "train", type: "checkbox", icon: <Train className="labelIcon" /> },
      ]
    } else if (category === "learningpoints") {
      fields = [
        { label: "Title", name: "title", type: "text", icon: <Mountain className="labelIcon" /> },
        { label: "Description", name: "description", type: "textarea", icon: <FileText className="labelIcon" /> },
        { label: "Google Maps URL", name: "googleMapsUrl", type: "text", icon: <GlobeIcon className="labelIcon" /> },
        { label: "Duration", name: "duration", type: "text", icon: <Timer className="labelIcon" /> },
        { label: "Best For", name: "bestfor", type: "text", icon: <Star className="labelIcon" /> },
        { label: "Average Price", name: "avgprice", type: "text", icon: <DollarSign className="labelIcon" /> },
        { label: "Website URL", name: "websiteUrl", type: "text", icon: <Globe className="labelIcon" /> },
        { label: "Address", name: "address", type: "text", icon: <MapPin className="labelIcon" /> },
      ]
    }

    const dropdownOptions = [
      { value: "", label: "-- Select--" },
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ]

    return (
      <>
        <div className="field">
          <div className="labelWithIcon">
            <Tag className="labelIcon" />
            <span>Category*</span>
          </div>
          <input
            type="text"
            name="category"
            className="input"
            value={
              category === "buythings"
                ? "Buy Things"
                : category === "adventures"
                  ? "Adventures"
                  : category === "placestovisit"
                    ? "Places to Visit"
                    : category === "learningpoints"
                      ? "Learning Points"
                      : category === "specialevents"
                        ? "Special Events"
                        : category === "ayurwedha"
                          ? "Ayurwedha"
                          : ""
            }
            readOnly
          />
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Uploaded Image Details:</h4>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              {formData.images.map((image, index) => (
                <li key={image.public_id || index}>
                  <strong>Image {index + 1}:</strong>{" "}
                  <a href={image.secure_url} target="_blank" rel="noopener noreferrer" className="underline">
                    {image.original_filename || "Link"}
                  </a>{" "}
                  ({Math.round(image.bytes / 1024)} KB, {image.width}x{image.height})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rest of the fields */}
        <div className="row">
          {fields.slice(0, 2).map((field, index) => {
            const fieldErrors = getFieldError(field.name)
            const hasError = fieldErrors && fieldErrors.length > 0

            return (
              <div className="field" key={index}>
                <div className="labelWithIcon">
                  {field.icon}
                  <span>{field.label}*</span>
                </div>
                {field.type === "textarea" ? (
                  <>
                    <textarea
                      name={field.name}
                      value={(formData[field.name] as string) || ""}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      required
                      className={`textarea ${hasError ? "error" : ""}`}
                      rows={3}
                    />
                    <FieldError errors={fieldErrors} />
                  </>
                ) : (
                  <>
                    <input
                      type={field.type}
                      name={field.name}
                      value={(formData[field.name] as string) || ""}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`input ${hasError ? "error" : ""}`}
                    />
                    <FieldError errors={fieldErrors} />
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Remaining fields in rows of two */}
        {(() => {
          const rows = []
          let idx = 2
          while (idx < fields.length) {
            if (["isCard", "isCash", "isQRScan"].includes(fields[idx]?.name)) {
              idx += 1
              continue
            }
            const firstField = fields[idx]
            const secondField = fields[idx + 1]
            rows.push(
              <div className="row" key={idx}>
                {[firstField, secondField].map((field, i) => {
                  if (!field) return null
                  const fieldErrors = getFieldError(field.name)
                  const hasError = fieldErrors && fieldErrors.length > 0

                  return (
                    <div className="field" key={field.name}>
                      <div className="labelWithIcon">
                        {field.icon}
                        <span>{field.label}*</span>
                      </div>
                      {field.type === "textarea" ? (
                        <>
                          <textarea
                            name={field.name}
                            value={(formData[field.name] as string) || ""}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            required
                            className={`textarea ${hasError ? "error" : ""}`}
                            rows={3}
                          />
                          <FieldError errors={fieldErrors} />
                        </>
                      ) : field.type === "dropdown" ? (
                        <>
                          <select
                            name={field.name}
                            value={(formData[field.name] as string) || ""}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                [field.name]: e.target.value,
                              })
                              markFieldAsTouched(field.name)
                            }}
                            className={`select ${hasError ? "error" : ""}`}
                            required
                          >
                            {dropdownOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <FieldError errors={fieldErrors} />
                        </>
                      ) : field.type === "timerange" ? (
                        <>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <input
                              type="time"
                              value={(formData[field.name] as string)?.split(" - ")[0] || ""}
                              onChange={(e) => {
                                const end = (formData[field.name] as string)?.split(" - ")[1] || ""
                                setFormData({
                                  ...formData,
                                  [field.name]: `${e.target.value} - ${end}`,
                                })
                                markFieldAsTouched(field.name)
                              }}
                              required
                              className={`input ${hasError ? "error" : ""}`}
                            />
                            <span style={{ color: "#1e40af", fontWeight: "500" }}>to</span>
                            <input
                              type="time"
                              value={(formData[field.name] as string)?.split(" - ")[1] || ""}
                              onChange={(e) => {
                                const start = (formData[field.name] as string)?.split(" - ")[0] || ""
                                setFormData({
                                  ...formData,
                                  [field.name]: `${start} - ${e.target.value}`,
                                })
                                markFieldAsTouched(field.name)
                              }}
                              required
                              className={`input ${hasError ? "error" : ""}`}
                            />
                          </div>
                          <FieldError errors={fieldErrors} />
                        </>
                      ) : field.type === "date&time" ? (
                        <>
                          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <input
                              type="date"
                              value={(formData[field.name] as string)?.split(" ")[0] || ""}
                              onChange={(e) => {
                                const time = (formData[field.name] as string)?.split(" ")[1] || ""
                                setFormData({
                                  ...formData,
                                  [field.name]: `${e.target.value} ${time}`,
                                })
                                markFieldAsTouched(field.name)
                              }}
                              required
                              className={`input ${hasError ? "error" : ""}`}
                            />
                            <input
                              type="time"
                              value={(formData[field.name] as string)?.split(" ")[1] || ""}
                              onChange={(e) => {
                                const date = (formData[field.name] as string)?.split(" ")[0] || ""
                                setFormData({
                                  ...formData,
                                  [field.name]: `${date} ${e.target.value}`,
                                })
                                markFieldAsTouched(field.name)
                              }}
                              required
                              className={`input ${hasError ? "error" : ""}`}
                            />
                          </div>
                          <FieldError errors={fieldErrors} />
                        </>
                      ) : (
                        <>
                          <input
                            type={field.type}
                            name={field.name}
                            value={(formData[field.name] as string) || ""}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            className={`input ${hasError ? "error" : ""}`}
                          />
                          <FieldError errors={fieldErrors} />
                        </>
                      )}
                    </div>
                  )
                })}
              </div>,
            )
            idx += 2
          }
          return rows
        })()}

        {/* Payment Methods Section */}
        {category === "buythings" && (
          <div className="field">
            <div className="labelWithIcon" style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
              <CreditCard className="labelIcon" />
              <span>Payment Methods</span>
            </div>
            <div className="checkboxRow">
              {["isCard", "isCash", "isQRScan"].map((name) => {
                const field = fields.find((f) => f.name === name)
                if (!field) return null
                return (
                  <div className="checkboxLabel" key={field.name}>
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={!!formData[field.name]}
                      onChange={handleInputChange}
                      className="checkbox"
                    />
                    <div className="labelWithIcon" style={{ margin: 0 }}>
                      {field.icon}
                      <span>{field.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <FieldError errors={getFieldError("paymentMethods")} />
          </div>
        )}

        {/* Transportation Methods Section for Special Events and Places to Visit */}
        {(category === "specialevents" || category === "placestovisit") && (
          <div className="field">
            <div className="labelWithIcon" style={{ marginBottom: "1rem", fontSize: "1.2rem" }}>
              <Bus className="labelIcon" />
              <span>Transportation Methods</span>
            </div>
            <div className="checkboxRow">
              {["bus", "taxi", "train"].map((name) => {
                const field = fields.find((f) => f.name === name)
                if (!field) return null
                return (
                  <div className="checkboxLabel" key={field.name}>
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={!!formData[field.name]}
                      onChange={handleInputChange}
                      className="checkbox"
                    />
                    <div className="labelWithIcon" style={{ margin: 0 }}>
                      {field.icon}
                      <span>{field.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <FieldError errors={getFieldError("transportation")} />
          </div>
        )}
      </>
    )
  }

  const steps = ["Select Category", "Publisher Details", "Category Specific"]
  const categoryTitles: Record<string, string> = {
    buythings: "Buy Things Details",
    adventures: "Adventures Details",
    placestovisit: "Places to Visit Details",
    learningpoints: "Learning Points Details",
    specialevents: "Special Events Details",
    ayurwedha: "Ayurwedha Details",
  }

  const isSubmitDisabled = loading || hasErrors
  console.log("Submit button disabled:", isSubmitDisabled, "Loading:", loading, "Has errors:", hasErrors)

  if (isSuccess) {
    return (
      <div className="container">
        <div className="successWrapper">
          <div className="successIcon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
          </div>
          <h1 className="successTitle">Publisher Successfully Registered!</h1>
          <p className="successMessage">
            Congratulations! <strong>{formData.name}</strong> has been successfully registered as a publisher for{" "}
            <strong>{category}</strong> with {submittedImageCount} image(s) uploaded.
          </p>
          <div className="successDetails">
            <p>
              <strong>Name:</strong> {formData.name}
            </p>
            <p>
              <strong>Email:</strong> {formData.email}
            </p>
            <p>
              <strong>Category:</strong> {category}
            </p>
            <p>
              <strong>Phone:</strong> {formData.phone}
            </p>
            {submittedImages && submittedImages.length > 0 && (
              <p>
                <strong>Images Uploaded:</strong> {submittedImages.length}
                {submittedImages.map((img, idx) => (
                  <span key={img.public_id || idx}>
                    {" "}
                    (
                    <a href={img.url || img.secure_url} target="_blank" rel="noopener noreferrer">
                      {idx + 1}
                    </a>
                    )
                  </span>
                ))}
              </p>
            )}
          </div>
          <button onClick={resetForm} className="newRegistrationButton">
            Register Another Publisher
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="formWrapper">
        {/* Progress Bar */}
        <div className="progressContainer">
          <div className="progressBar">
            <div className="progressFill" style={{ width: `${(currentStep / 3) * 100}%` }}></div>
          </div>
          <div className="stepIndicators">
            {[1, 2, 3].map((step) => (
              <div key={step} className={`stepIndicator ${currentStep >= step ? "active" : ""}`}>
                <div className="stepNumber">{step}</div>
                <div className="stepLabel">{steps[step - 1]}</div>
              </div>
            ))}
          </div>
        </div>

        <h1 className="title">Register Publisher</h1>

        {message && (
          <div className={`message ${message.includes("Error") || message.includes("Failed") ? "error" : "warning"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          {/* Step 1: Select Category */}
          {currentStep === 1 && (
            <div className="step">
              <h2 className="stepTitle">Step 1: Select Category</h2>
              <div className="field">
                <div className="labelWithIcon">
                  <Building2 className="labelIcon" />
                  <span>Select Category *</span>
                </div>
                <select
                  name="category"
                  value={category}
                  onChange={handleCategoryChange}
                  className={`select ${getFieldError("category") ? "error" : ""}`}
                  required
                >
                  <option value="">-- Select a Category --</option>
                  <option value="buythings">Buy Things</option>
                  <option value="adventures">Adventures</option>
                  <option value="placestovisit">Places To Visit</option>
                  <option value="learningpoints">Learning Points</option>
                  <option value="specialevents">Special Events</option>
                </select>
                <FieldError errors={getFieldError("category")} />
              </div>
            </div>
          )}

          {/* Step 2: Publisher Details */}
          {currentStep === 2 && (
            <div className="step">
              <h2 className="stepTitle">Step 2: Publisher Details</h2>
              <div className="row">
                <div className="field">
                  <div className="labelWithIcon">
                    <User className="labelIcon" />
                    <span>Publisher Name *</span>
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${getFieldError("name") ? "error" : ""}`}
                    placeholder="Enter publisher name"
                  />
                  <FieldError errors={getFieldError("name")} />
                </div>
                <div className="field">
                  <div className="labelWithIcon">
                    <Mail className="labelIcon" />
                    <span>Email *</span>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${getFieldError("email") ? "error" : ""}`}
                    placeholder="Enter email address"
                  />
                  <FieldError errors={getFieldError("email")} />
                </div>
              </div>
              <div className="row">
                <div className="field">
                  <div className="labelWithIcon">
                    <Phone className="labelIcon" />
                    <span>Phone *</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    required
                    className={`input ${getFieldError("phone") ? "error" : ""}`}
                    placeholder="Enter phone number"
                  />
                  <FieldError errors={getFieldError("phone")} />
                </div>
                <div className="field">
                  <div className="labelWithIcon">
                    <MapPin className="labelIcon" />
                    <span>Address *</span>
                  </div>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    rows={3}
                    required
                    className={`textarea ${getFieldError("address") ? "error" : ""}`}
                    placeholder="Enter address"
                  />
                  <FieldError errors={getFieldError("address")} />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Category Specific Details */}
          {currentStep === 3 && (
            <div className="step">
              <h2 className="stepTitle">Step 3: {categoryTitles[category] || "Category Details"}</h2>
              <div className="category-fields">{renderCategorySpecificFields()}</div>
              <ImageUpload
                images={images}
                onChange={(updatedImages) => {
                  console.log("📸 Updated images:", updatedImages)
                  setImages(updatedImages)
                }}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="buttonContainer">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="prevButton" disabled={loading}>
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="nextButton" disabled={currentStep === 1 && !category}>
                Next
              </button>
            ) : (
              <button type="submit" className="submitButton" disabled={loading}>
                {loading ? "Submitting..." : "Register Publisher"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
