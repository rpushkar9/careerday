'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import { UserCircle } from 'lucide-react';
import { findJobsForMajor } from '@/lib/jobs-action';
import { ChevronDown, ChevronUp } from 'lucide-react'; // Importing the arrow icons

export default function UserProfileForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    major: '',
    age: '',
    university: '',
    careerInterests: '',
    gender: '',
    raceEthnicity: '',
    firstGen: '',
    financialAid: '',
    language: '',
    learningStyle: '',
    passionsHobbies: '',
  });

  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState(false); // State to toggle visibility of additional questions

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fetch jobs related to the entered major
    const jobs = await findJobsForMajor(formData.major);

    // Limit to top 3 jobs
    const top3Jobs = jobs.slice(0, 3);

    // Save to localStorage
    localStorage.setItem('recommendedJobs', JSON.stringify(top3Jobs));

    // Navigate to /recommendation page
    router.push('/recommendation');
  };

  const toggleAdditionalQuestions = () => {
    setShowAdditionalQuestions(prev => !prev); // Toggle the visibility state
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <Card className="text-center p-6 rounded-xl">
        <CardHeader className="flex flex-col items-center">
          <UserCircle className="h-16 w-16 text-[#6d6bd3]" />
          <p className="text-gray-600 mt-2">
            We would love to learn more information about you!
          </p>
        </CardHeader>
        <CardContent className="text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <Label htmlFor="firstName" className="mb-2">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="lastName" className="mb-2">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <Label htmlFor="major" className="mb-2">
                Major
              </Label>
              <Input
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="age" className="mb-2">
                Age
              </Label>
              <Input
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex flex-col">
              <Label htmlFor="university" className="mb-2">
                University
              </Label>
              <Input
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                required
              />
            </div>

            {/* Button to toggle the visibility of additional questions */}
            <Button
              type="button"
              onClick={toggleAdditionalQuestions}
              variant="outline"
              className="w-full mt-4"
            >
              {showAdditionalQuestions ? (
                <ChevronUp className="mr-2" />
              ) : (
                <ChevronDown className="mr-2" />
              )}
              {showAdditionalQuestions
                ? 'Hide Additional Questions'
                : 'Show Additional Questions'}
            </Button>

            {/* Show additional questions if toggle is true */}
            {showAdditionalQuestions && (
              <div className="space-y-4 mt-4">
                <div className="flex flex-col">
                  <Label htmlFor="gender" className="mb-2">
                    Gender (Optional)
                  </Label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Other">Other</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="raceEthnicity" className="mb-2">
                    Race/Ethnicity (Optional)
                  </Label>
                  <select
                    id="raceEthnicity"
                    name="raceEthnicity"
                    value={formData.raceEthnicity}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="">Select Race/Ethnicity</option>
                    <option value="Asian">Asian</option>
                    <option value="Black or African American">
                      Black or African American
                    </option>
                    <option value="Hispanic or Latino">
                      Hispanic or Latino
                    </option>
                    <option value="White">White</option>
                    <option value="Native American">Native American</option>
                    <option value="Pacific Islander">Pacific Islander</option>
                    <option value="Other">Other</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="firstGen" className="mb-2">
                    First-Generation College Student (Optional)
                  </Label>
                  <select
                    id="firstGen"
                    name="firstGen"
                    value={formData.firstGen}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="">Select Option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="financialAid" className="mb-2">
                    Financial Aid (Optional)
                  </Label>
                  <select
                    id="financialAid"
                    name="financialAid"
                    value={formData.financialAid}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="">Select Option</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="language" className="mb-2">
                    Language(s) Spoken (Optional)
                  </Label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="learningStyle" className="mb-2">
                    Learning Style (Optional)
                  </Label>
                  <select
                    id="learningStyle"
                    name="learningStyle"
                    value={formData.learningStyle}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="">Select Option</option>
                    <option value="Hands-on">Hands-on</option>
                    <option value="Lecture-based">Lecture-based</option>
                    <option value="Online">Online</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="passionsHobbies" className="mb-2">
                    Passions and Hobbies (Optional)
                  </Label>
                  <select
                    id="passionsHobbies"
                    name="passionsHobbies"
                    value={formData.passionsHobbies}
                    onChange={handleChange}
                    className="border rounded p-2"
                  >
                    <option value="">Select Hobbies</option>
                    <option value="Sports">Sports</option>
                    <option value="Music">Music</option>
                    <option value="Art">Art</option>
                    <option value="Reading">Reading</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            <CardFooter className="flex justify-center pt-4">
              <Button
                type="submit"
                variant="default"
                className="bg-[#6d6bd3] hover:bg-[#5c5ac0] text-white px-6 py-2"
              >
                Submit
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import Navbar from "@/components/navbar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Slider } from "@/components/ui/slider"
// import { Textarea } from "@/components/ui/textarea"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Loader2 } from "lucide-react"

// export default function SurveyPage() {
//   const router = useRouter()
//   const [currentStep, setCurrentStep] = useState(1)
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     major: "",
//     university: "",
//     gpa: "",
//     interests: [],
//     skills: [],
//     workEnvironment: "",
//     personalityType: "",
//     valuesMoney: 50,
//     valuesWorkLife: 50,
//     valuesCreativity: 50,
//     valuesHelping: 50,
//     additionalInfo: "",
//   })

//   const totalSteps = 5

//   const handleInputChange = (e) => {
//     const { name, value } = e.target
//     setFormData({ ...formData, [name]: value })
//   }

//   const handleSliderChange = (name, value) => {
//     setFormData({ ...formData, [name]: value[0] })
//   }

//   const handleCheckboxChange = (field, value) => {
//     setFormData((prev) => {
//       const currentValues = prev[field] || []
//       if (currentValues.includes(value)) {
//         return { ...prev, [field]: currentValues.filter((v) => v !== value) }
//       } else {
//         return { ...prev, [field]: [...currentValues, value] }
//       }
//     })
//   }

//   const handleSelectChange = (name, value) => {
//     setFormData({ ...formData, [name]: value })
//   }

//   const nextStep = () => {
//     if (currentStep < totalSteps) {
//       setCurrentStep(currentStep + 1)
//     }
//   }

//   const prevStep = () => {
//     if (currentStep > 1) {
//       setCurrentStep(currentStep - 1)
//     }
//   }

//   const generateRecommendations = async () => {
//     try {
//       setIsSubmitting(true)

//       // Call our API to generate recommendations
//       const response = await fetch("/api/generate-recommendations", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       })

//       if (!response.ok) {
//         throw new Error("Failed to generate recommendations")
//       }

//       const data = await response.json()

//       // Save to localStorage
//       localStorage.setItem("recommendedJobs", JSON.stringify(data.recommendations))
//       localStorage.setItem("userUniversity", formData.university)

//       // Navigate to results page
//       router.push("/recommended-jobs")
//     } catch (error) {
//       console.error("Error generating recommendations:", error)
//       alert("There was an error generating your recommendations. Please try again.")
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const renderStep = () => {
//     switch (currentStep) {
//       case 1:
//         return (
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Full Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 placeholder="Enter your full name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleInputChange}
//                 placeholder="Enter your email"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="university">University</Label>
//               <Input
//                 id="university"
//                 name="university"
//                 value={formData.university}
//                 onChange={handleInputChange}
//                 placeholder="Enter your university name"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="major">Current or Intended Major</Label>
//               <Select onValueChange={(value) => handleSelectChange("major", value)} value={formData.major}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select your major" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Computer Science">Computer Science</SelectItem>
//                   <SelectItem value="Business">Business</SelectItem>
//                   <SelectItem value="Engineering">Engineering</SelectItem>
//                   <SelectItem value="Psychology">Psychology</SelectItem>
//                   <SelectItem value="Biology">Biology</SelectItem>
//                   <SelectItem value="Communications">Communications</SelectItem>
//                   <SelectItem value="Economics">Economics</SelectItem>
//                   <SelectItem value="English">English</SelectItem>
//                   <SelectItem value="Mathematics">Mathematics</SelectItem>
//                   <SelectItem value="Political Science">Political Science</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="gpa">Current GPA (if applicable)</Label>
//               <Input id="gpa" name="gpa" value={formData.gpa} onChange={handleInputChange} placeholder="e.g., 3.5" />
//             </div>
//           </CardContent>
//         )
//       case 2:
//         return (
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <Label>Academic Interests (Select all that apply)</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   "Technology",
//                   "Science",
//                   "Mathematics",
//                   "Writing",
//                   "Art",
//                   "History",
//                   "Business",
//                   "Psychology",
//                   "Engineering",
//                   "Languages",
//                 ].map((interest) => (
//                   <div key={interest} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={`interest-${interest}`}
//                       checked={formData.interests.includes(interest.toLowerCase())}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           handleCheckboxChange("interests", interest.toLowerCase())
//                         } else {
//                           handleCheckboxChange("interests", interest.toLowerCase())
//                         }
//                       }}
//                     />
//                     <label
//                       htmlFor={`interest-${interest}`}
//                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                     >
//                       {interest}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </CardContent>
//         )
//       case 3:
//         return (
//           <CardContent className="space-y-6">
//             <div className="space-y-4">
//               <Label>Skills & Strengths (Select all that apply)</Label>
//               <div className="grid grid-cols-2 gap-4">
//                 {[
//                   "Problem-solving",
//                   "Creativity",
//                   "Communication",
//                   "Leadership",
//                   "Teamwork",
//                   "Analysis",
//                   "Organization",
//                   "Detail-oriented",
//                   "Coding",
//                   "Design",
//                 ].map((skill) => (
//                   <div key={skill} className="flex items-center space-x-2">
//                     <Checkbox
//                       id={`skill-${skill}`}
//                       checked={formData.skills.includes(skill.toLowerCase())}
//                       onCheckedChange={(checked) => {
//                         if (checked) {
//                           handleCheckboxChange("skills", skill.toLowerCase())
//                         } else {
//                           handleCheckboxChange("skills", skill.toLowerCase())
//                         }
//                       }}
//                     />
//                     <label
//                       htmlFor={`skill-${skill}`}
//                       className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
//                     >
//                       {skill}
//                     </label>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="workEnvironment">Preferred Work Environment</Label>
//               <Select
//                 onValueChange={(value) => handleSelectChange("workEnvironment", value)}
//                 value={formData.workEnvironment}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select work environment" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="office">Office Setting</SelectItem>
//                   <SelectItem value="remote">Remote Work</SelectItem>
//                   <SelectItem value="field">Field Work</SelectItem>
//                   <SelectItem value="lab">Laboratory</SelectItem>
//                   <SelectItem value="hospital">Healthcare Setting</SelectItem>
//                   <SelectItem value="studio">Creative Studio</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         )
//       case 4:
//         return (
//           <CardContent className="space-y-6">
//             <div className="space-y-2">
//               <Label htmlFor="personalityType">How would you describe your personality?</Label>
//               <RadioGroup
//                 value={formData.personalityType}
//                 onValueChange={(value) => handleSelectChange("personalityType", value)}
//               >
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="analytical" id="analytical" />
//                   <Label htmlFor="analytical">Analytical & Logical</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="creative" id="creative" />
//                   <Label htmlFor="creative">Creative & Innovative</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="social" id="social" />
//                   <Label htmlFor="social">Social & Collaborative</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="practical" id="practical" />
//                   <Label htmlFor="practical">Practical & Hands-on</Label>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <RadioGroupItem value="leader" id="leader" />
//                   <Label htmlFor="leader">Leadership & Management</Label>
//                 </div>
//               </RadioGroup>
//             </div>

//             <div className="space-y-6">
//               <Label>What do you value in a career? (Adjust sliders)</Label>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <Label>Income Potential</Label>
//                     <span className="text-sm text-gray-500">{formData.valuesMoney}%</span>
//                   </div>
//                   <Slider
//                     defaultValue={[formData.valuesMoney]}
//                     max={100}
//                     step={1}
//                     onValueChange={(value) => handleSliderChange("valuesMoney", value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <Label>Work-Life Balance</Label>
//                     <span className="text-sm text-gray-500">{formData.valuesWorkLife}%</span>
//                   </div>
//                   <Slider
//                     defaultValue={[formData.valuesWorkLife]}
//                     max={100}
//                     step={1}
//                     onValueChange={(value) => handleSliderChange("valuesWorkLife", value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <Label>Creativity & Innovation</Label>
//                     <span className="text-sm text-gray-500">{formData.valuesCreativity}%</span>
//                   </div>
//                   <Slider
//                     defaultValue={[formData.valuesCreativity]}
//                     max={100}
//                     step={1}
//                     onValueChange={(value) => handleSliderChange("valuesCreativity", value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <Label>Helping Others</Label>
//                     <span className="text-sm text-gray-500">{formData.valuesHelping}%</span>
//                   </div>
//                   <Slider
//                     defaultValue={[formData.valuesHelping]}
//                     max={100}
//                     step={1}
//                     onValueChange={(value) => handleSliderChange("valuesHelping", value)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         )
//       case 5:
//         return (
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="additionalInfo">Anything else you'd like to share?</Label>
//               <Textarea
//                 id="additionalInfo"
//                 name="additionalInfo"
//                 value={formData.additionalInfo}
//                 onChange={handleInputChange}
//                 placeholder="Additional information that might help with your career recommendations..."
//                 rows={4}
//               />
//             </div>
//             <div className="pt-4">
//               <p className="text-sm text-gray-500">
//                 Click "Generate Recommendations" below to see your personalized career matches based on your responses.
//               </p>
//             </div>
//           </CardContent>
//         )
//       default:
//         return null
//     }
//   }

//   return (
//     <>

//       <div className="max-w-3xl mx-auto mt-10 p-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>
//               Step {currentStep} of {totalSteps}
//             </CardTitle>
//             <CardDescription>
//               {currentStep === 1 && "Let's start with some basic information"}
//               {currentStep === 2 && "Tell us about your academic interests"}
//               {currentStep === 3 && "What are your skills and work preferences?"}
//               {currentStep === 4 && "Let's understand your personality and values"}
//               {currentStep === 5 && "Almost done! Any additional information?"}
//             </CardDescription>
//           </CardHeader>

//           {renderStep()}

//           <CardFooter className="flex justify-between">
//             <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
//               Previous
//             </Button>

//             <div className="flex space-x-2">
//               {currentStep < totalSteps ? (
//                 <Button onClick={nextStep}>Next</Button>
//               ) : (
//                 <Button
//                   onClick={generateRecommendations}
//                   className="bg-[#6d6bd3] hover:bg-[#5a58b8]"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Generating...
//                     </>
//                   ) : (
//                     "Generate Recommendations"
//                   )}
//                 </Button>
//               )}
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </>
//   )
// }
