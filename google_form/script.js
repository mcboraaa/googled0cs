// DOM Elements
const signInModal = document.getElementById("signInModal")
const mainForm = document.getElementById("mainForm")
const signInForm = document.getElementById("signInForm")
const surveyForm = document.getElementById("surveyForm")
const successMessage = document.getElementById("successMessage")
const userEmail = document.getElementById("userEmail")
const signOutBtn = document.getElementById("signOutBtn")
const submitAnotherBtn = document.getElementById("submitAnother")
const clearBtn = document.querySelector(".clear-btn")
const googleSignInBtn = document.querySelector(".google-sign-in-btn")

// Sign In Form Handler
signInForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Simple validation (in real app, this would be server-side authentication)
  if (email && password) {
    handleSignIn(email)
  } else {
    alert("Please fill in all fields")
  }
})

// Google Sign In Handler
googleSignInBtn.addEventListener("click", () => {
  // Simulate Google sign in
  const email = "user@gmail.com"
  handleSignIn(email)
})

// Handle successful sign in
function handleSignIn(email) {
  // Hide sign in modal
  signInModal.style.display = "none"

  // Show main form
  mainForm.style.display = "block"

  // Set user email
  userEmail.textContent = email

  // Store user session (in real app, use proper session management)
  sessionStorage.setItem("userEmail", email)
}

// Sign Out Handler
signOutBtn.addEventListener("click", () => {
  // Clear session
  sessionStorage.removeItem("userEmail")

  // Hide main form
  mainForm.style.display = "none"

  // Show sign in modal
  signInModal.style.display = "flex"

  // Reset forms
  signInForm.reset()
  surveyForm.reset()
})

// Survey Form Handler
surveyForm.addEventListener("submit", (e) => {
  e.preventDefault()

  // Get form data
  const formData = new FormData(surveyForm)
  const data = {}

  // Convert FormData to object
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Handle multiple values (checkboxes)
      if (Array.isArray(data[key])) {
        data[key].push(value)
      } else {
        data[key] = [data[key], value]
      }
    } else {
      data[key] = value
    }
  }

  // Simulate form submission
  console.log("Form submitted:", data)

  // Show success message
  successMessage.style.display = "flex"

  // In a real application, you would send this data to a server
  // fetch('/submit-survey', {
  //     method: 'POST',
  //     headers: {
  //         'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(data)
  // });
})

// Clear Form Handler
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all form data?")) {
    surveyForm.reset()
  }
})

// Submit Another Response Handler
submitAnotherBtn.addEventListener("click", () => {
  successMessage.style.display = "none"
  surveyForm.reset()
  window.scrollTo(0, 0)
})

// Check for existing session on page load
window.addEventListener("load", () => {
  const storedEmail = sessionStorage.getItem("userEmail")

  if (storedEmail) {
    handleSignIn(storedEmail)
  }
})

// Form validation enhancements
const inputs = document.querySelectorAll(".form-input, .form-select, .form-textarea")

inputs.forEach((input) => {
  input.addEventListener("blur", function () {
    validateField(this)
  })

  input.addEventListener("input", function () {
    if (this.classList.contains("error")) {
      validateField(this)
    }
  })
})

function validateField(field) {
  const value = field.value.trim()
  const isRequired = field.hasAttribute("required")

  // Remove existing error styling
  field.classList.remove("error")

  // Check if required field is empty
  if (isRequired && !value) {
    field.classList.add("error")
    return false
  }

  // Email validation
  if (field.type === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      field.classList.add("error")
      return false
    }
  }

  return true
}

// Add error styling
const style = document.createElement("style")
style.textContent = `
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: #d93025 !important;
        border-width: 2px !important;
    }
`
document.head.appendChild(style)

// Smooth scrolling for form navigation
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Auto-save form data (optional feature)
let autoSaveTimer

function autoSaveForm() {
  const formData = new FormData(surveyForm)
  const data = {}

  for (const [key, value] of formData.entries()) {
    data[key] = value
  }

  localStorage.setItem("surveyFormDraft", JSON.stringify(data))
}

// Auto-save every 30 seconds
surveyForm.addEventListener("input", () => {
  clearTimeout(autoSaveTimer)
  autoSaveTimer = setTimeout(autoSaveForm, 30000)
})

// Load saved draft on form load
function loadFormDraft() {
  const savedDraft = localStorage.getItem("surveyFormDraft")

  if (savedDraft) {
    const data = JSON.parse(savedDraft)

    Object.keys(data).forEach((key) => {
      const field = surveyForm.querySelector(`[name="${key}"]`)
      if (field) {
        if (field.type === "radio" || field.type === "checkbox") {
          const option = surveyForm.querySelector(`[name="${key}"][value="${data[key]}"]`)
          if (option) option.checked = true
        } else {
          field.value = data[key]
        }
      }
    })
  }
}

// Clear draft when form is submitted successfully
surveyForm.addEventListener("submit", () => {
  localStorage.removeItem("surveyFormDraft")
})

