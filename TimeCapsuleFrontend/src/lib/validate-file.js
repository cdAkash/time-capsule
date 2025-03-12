/**
 * Validates a file for type and size
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @param {string[]} allowedTypes - Array of allowed MIME types
 * @returns {object} - { isValid: boolean, error: string | null }
 */
export function validateFile(
  file,
  maxSizeMB = 10,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"],
) {
  if (!file) {
    return { isValid: true, error: null }
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Only images (JPEG, PNG, GIF) and videos (MP4, MOV) are allowed",
    }
  }

  return { isValid: true, error: null }
}

