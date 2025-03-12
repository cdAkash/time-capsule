/**
 * Validates a comma-separated list of email addresses
 * @param {string} emailsString - Comma-separated email addresses
 * @param {number} maxEmails - Maximum number of emails allowed
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export function validateEmails(emailsString, maxEmails = 3) {
  if (!emailsString) {
    return { isValid: true, error: null }
  }

  const emails = emailsString
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean)

  if (emails.length > maxEmails) {
    return {
      isValid: false,
      error: `You can only add up to ${maxEmails} email addresses`,
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const invalidEmails = emails.filter((email) => !emailRegex.test(email))

  if (invalidEmails.length > 0) {
    return {
      isValid: false,
      error: `Invalid email address${invalidEmails.length > 1 ? "es" : ""}: ${invalidEmails.join(", ")}`,
    }
  }

  return { isValid: true, error: null }
}

