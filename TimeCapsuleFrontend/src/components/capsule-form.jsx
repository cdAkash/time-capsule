"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon, Clock, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
const API_BASE_URL = "http://localhost:8000/api/v1";
export default function CapsuleForm({ primaryEmail, onSubmit }) {
  const [secondaryEmails, setSecondaryEmails] = useState("")
  const [date, setDate] = useState(null)
  const [time, setTime] = useState("")
  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateEmails = (emails) => {
    if (!emails) return true

    const emailList = emails.split(",").map((email) => email.trim())

    if (emailList.length > 3) {
      return "You can only add up to 3 secondary emails"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const invalidEmails = emailList.filter((email) => !emailRegex.test(email))

    if (invalidEmails.length > 0) {
      return `Invalid email(s): ${invalidEmails.join(", ")}`
    }

    return true
  }

  const validateFile = (file) => {
    if (!file) return true

    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    if (file.size > 10 * 1024 * 1024) {
      return "File size must be less than 10MB"
    }

    // Check file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"]
    if (!allowedTypes.includes(file.type)) {
      return "Only images (JPEG, PNG, GIF) and videos (MP4, MOV) are allowed"
    }

    return true
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile || null)

    // Validate file immediately
    if (selectedFile) {
      const fileValidation = validateFile(selectedFile)
      if (fileValidation !== true) {
        setErrors({ ...errors, file: fileValidation })
      } else {
        const newErrors = { ...errors }
        delete newErrors.file
        setErrors(newErrors)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    const newErrors = {}

    const emailValidation = validateEmails(secondaryEmails)
    if (emailValidation !== true) {
      newErrors.secondaryEmails = emailValidation
    }

    if (!date) {
      newErrors.date = "Please select a delivery date"
    }

    if (!time) {
      newErrors.time = "Please select a delivery time"
    }

    if (file) {
      const fileValidation = validateFile(file)
      if (fileValidation !== true) {
        newErrors.file = fileValidation
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData();
    
    // Add primary email and any secondary emails
    // Add primary email and any secondary emails
  const allEmails = [primaryEmail];
  if (secondaryEmails) {
    allEmails.push(...secondaryEmails.split(",").map(email => email.trim()));
  }
  
  // THIS IS THE CRITICAL PART - make sure it's a proper JSON string
  const emailsJson = JSON.stringify(allEmails);
  console.log("Sending emails JSON:", emailsJson); // Debug the exact string
  formData.append('emails', emailsJson);
    
    // Combine date and time into a single ISO string
    const deliveryDateTime = new Date(date);
    const [hours, minutes] = time.split(':').map(Number);
    deliveryDateTime.setHours(hours, minutes);
    
    formData.append('deliveryDate', deliveryDateTime.toISOString());
    
    // Add file if present
    if (file) {
      formData.append('file', file);
    }
    console.log("Sending emails:", JSON.stringify(allEmails));
      
      const response = await fetch(`${API_BASE_URL}/capsule/create-capsule`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create time capsule");
      }
  
      onSubmit(data.data?.capsule || {});

    } catch (error) {
      console.error("Submission error:", error);
    setErrors({ submit: error.message || "Failed to submit form. Please try again." });
    } finally {
      setIsLoading(false)
    }
  }

  // Generate time options (every 30 minutes)
  const timeOptions = []
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 30]) {
      const h = hour.toString().padStart(2, "0")
      const m = minute.toString().padStart(2, "0")
      timeOptions.push(`${h}:${m}`)
    }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle>Create Your Time Capsule</CardTitle>
        <CardDescription>Fill out the form below to create your digital time capsule.</CardDescription>
      </CardHeader>
      <CardContent>
        {errors.submit && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primaryEmail">Primary Email</Label>
            <Input id="primaryEmail" type="email" value={primaryEmail} disabled />
            <p className="text-sm text-muted-foreground">This is the email you used to log in.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryEmails">Secondary Emails (Optional, max 3, comma-separated)</Label>
            <Input
              id="secondaryEmails"
              type="text"
              placeholder="friend@example.com, family@example.com"
              value={secondaryEmails}
              onChange={(e) => setSecondaryEmails(e.target.value)}
              className={errors.secondaryEmails ? "border-red-500" : ""}
            />
            {errors.secondaryEmails && <p className="text-sm text-red-500">{errors.secondaryEmails}</p>}
            <p className="text-sm text-muted-foreground">
              Add up to 3 email addresses that will also receive your time capsule.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !date && "text-muted-foreground"
                    } ${errors.date ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
            </div>

            <div className="space-y-2">
              <Label>Delivery Time</Label>
              <Select onValueChange={setTime}>
                <SelectTrigger className={errors.time ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select time">
                    {time ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </div>
                    ) : (
                      "Select time"
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((timeOption) => (
                    <SelectItem key={timeOption} value={timeOption}>
                      {timeOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <textarea
              id="message"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add a message to your future self or recipients..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File (Optional, max 10MB)</Label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${
                  errors.file ? "border-red-500" : "border-gray-300"
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">Images or videos (max 10MB)</p>
                  {file && (
                    <p className="mt-2 text-sm text-green-600">
                      {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,video/mp4,video/quicktime"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {errors.file && <p className="text-sm text-red-500">{errors.file}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Time Capsule..." : "Create Time Capsule"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

