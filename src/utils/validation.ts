/**
 * Validation utilities for Spanish NIF/CIF and phone numbers
 */

/**
 * Validates Spanish NIF (DNI) format
 * Format: 8 digits followed by a letter (e.g., 12345678Z)
 */
export function validateNIF(nif: string): boolean {
    if (!nif) return true; // Allow empty

    // Remove spaces and convert to uppercase
    const cleanNIF = nif.replace(/\s/g, '').toUpperCase();

    // Check format: 8 digits + 1 letter
    const nifRegex = /^[0-9]{8}[A-Z]$/;
    if (!nifRegex.test(cleanNIF)) return false;

    // Validate letter
    const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const number = parseInt(cleanNIF.substring(0, 8), 10);
    const letter = cleanNIF.charAt(8);

    return letters.charAt(number % 23) === letter;
}

/**
 * Validates Spanish CIF format
 * Format: Letter + 7 digits + control character (e.g., B12345678)
 */
export function validateCIF(cif: string): boolean {
    if (!cif) return true; // Allow empty

    // Remove spaces and convert to uppercase
    const cleanCIF = cif.replace(/\s/g, '').toUpperCase();

    // Check format: 1 letter + 7 digits + 1 letter/digit
    const cifRegex = /^[ABCDEFGHJNPQRSUVW][0-9]{7}[0-9A-J]$/;
    return cifRegex.test(cleanCIF);
}

/**
 * Validates NIF or CIF
 */
export function validateNIFOrCIF(value: string): boolean {
    if (!value) return true; // Allow empty
    return validateNIF(value) || validateCIF(value);
}

/**
 * Validates Spanish phone number
 * Accepts formats:
 * - +34 600 000 000
 * - +34 600000000
 * - 600 000 000
 * - 600000000
 * - 34600000000
 */
export function validateSpanishPhone(phone: string): boolean {
    if (!phone) return true; // Allow empty

    // Remove spaces
    const cleanPhone = phone.replace(/\s/g, '');

    // Check various formats
    const phoneRegex = /^(\+34|0034|34)?[6-9][0-9]{8}$/;
    return phoneRegex.test(cleanPhone);
}

/**
 * Formats a phone number to Spanish format with spaces
 * Example: 600000000 -> +34 600 000 000
 */
export function formatSpanishPhone(phone: string): string {
    if (!phone) return '';

    // Remove all non-digit characters except +
    let cleanPhone = phone.replace(/[^\d+]/g, '');

    // Remove leading zeros
    cleanPhone = cleanPhone.replace(/^0+/, '');

    // Remove country code if present to re-add it
    cleanPhone = cleanPhone.replace(/^(\+34|34)/, '');

    // If we have 9 digits, format them
    if (cleanPhone.length === 9) {
        return `+34 ${cleanPhone.substring(0, 3)} ${cleanPhone.substring(3, 6)} ${cleanPhone.substring(6, 9)}`;
    }

    return phone; // Return original if can't format
}

/**
 * Formats NIF/CIF to uppercase without spaces
 */
export function formatNIFOrCIF(value: string): string {
    if (!value) return '';
    return value.replace(/\s/g, '').toUpperCase();
}
