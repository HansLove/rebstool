/**
 * Formats phone numbers for display and WhatsApp links
 * Handles various formats including international codes
 */

interface FormattedPhone {
  display: string; // Formatted for display
  whatsapp: string; // Clean number for WhatsApp (digits only)
  country?: string; // Detected country
}

/**
 * Detects country code from phone number
 * Only detects if we're confident the number includes a country code
 */
function detectCountryCode(phone: string): { code: string; country: string; remaining: string } | null {
  const cleanPhone = phone.replace(/\D/g, "");
  
  // Minimum length for international numbers (country code + local number)
  const MIN_INTERNATIONAL_LENGTH = 10;
  
  // If number is too short, it's likely local
  if (cleanPhone.length < MIN_INTERNATIONAL_LENGTH) {
    return null;
  }
  
  // Common country codes (longest first to avoid partial matches)
  const countryCodes: Record<string, { country: string; minLength: number; maxLength: number }> = {
    "521": { country: "Mexico", minLength: 12, maxLength: 13 }, // Mexico mobile (52 = country, 1 = mobile indicator)
    "52": { country: "Mexico", minLength: 12, maxLength: 12 },  // Mexico (10 digits after 52)
    "1": { country: "United States/Canada", minLength: 11, maxLength: 11 }, // North America (10 digits after 1)
    "44": { country: "United Kingdom", minLength: 11, maxLength: 12 },
    "33": { country: "France", minLength: 11, maxLength: 11 },
    "49": { country: "Germany", minLength: 11, maxLength: 13 },
    "34": { country: "Spain", minLength: 11, maxLength: 11 },
    "39": { country: "Italy", minLength: 11, maxLength: 12 },
    "7": { country: "Russia", minLength: 11, maxLength: 11 }, // Russia/Kazakhstan
    "81": { country: "Japan", minLength: 12, maxLength: 12 },
    "86": { country: "China", minLength: 13, maxLength: 13 },
    "91": { country: "India", minLength: 12, maxLength: 12 },
    "61": { country: "Australia", minLength: 11, maxLength: 11 },
    "55": { country: "Brazil", minLength: 12, maxLength: 13 },
    "54": { country: "Argentina", minLength: 12, maxLength: 12 },
    "56": { country: "Chile", minLength: 11, maxLength: 11 },
    "57": { country: "Colombia", minLength: 12, maxLength: 12 },
    "51": { country: "Peru", minLength: 11, maxLength: 11 },
    "58": { country: "Venezuela", minLength: 12, maxLength: 12 },
  };

  // Check for Mexico mobile format (521...) - must be exactly 13 digits
  if (cleanPhone.startsWith("521") && cleanPhone.length === 13) {
    return {
      code: "521",
      country: "Mexico",
      remaining: cleanPhone.substring(3),
    };
  }

  // Check other country codes (2-3 digits) - must match expected length
  for (const [code, config] of Object.entries(countryCodes)) {
    if (code !== "521" && cleanPhone.startsWith(code)) {
      const remaining = cleanPhone.substring(code.length);
      // Validate: remaining digits must match expected length range
      const totalLength = cleanPhone.length;
      if (totalLength >= config.minLength && totalLength <= config.maxLength) {
        // Additional validation: remaining should be reasonable (7-15 digits)
        if (remaining.length >= 7 && remaining.length <= 15) {
          return { code, country: config.country, remaining };
        }
      }
    }
  }

  return null;
}

/**
 * Formats phone number for display based on country
 */
function formatByCountry(
  country: string,
  code: string,
  remaining: string
): string {
  const digits = remaining;

  switch (country) {
    case "Mexico":
      if (code === "521") {
        // Mexico mobile: +52 1 XX XXXX XXXX
        if (digits.length === 10) {
          return `+52 1 ${digits.substring(0, 2)} ${digits.substring(2, 6)} ${digits.substring(6)}`;
        }
        return `+52 1 ${digits}`;
      } else {
        // Mexico landline: +52 XX XXXX XXXX
        if (digits.length === 10) {
          return `+52 ${digits.substring(0, 2)} ${digits.substring(2, 6)} ${digits.substring(6)}`;
        }
        return `+52 ${digits}`;
      }

    case "United States/Canada":
      // +1 (XXX) XXX-XXXX
      if (digits.length === 10) {
        return `+1 (${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6)}`;
      }
      return `+1 ${digits}`;

    case "United Kingdom":
      // +44 XXXX XXXXXX
      if (digits.length === 10) {
        return `+44 ${digits.substring(0, 4)} ${digits.substring(4)}`;
      }
      return `+44 ${digits}`;

    default:
      // Generic international format
      if (digits.length >= 8 && digits.length <= 12) {
        // Group digits in chunks
        const chunks = [];
        let remaining = digits;
        while (remaining.length > 0) {
          if (remaining.length > 4) {
            chunks.push(remaining.substring(0, 4) as never);
            remaining = remaining.substring(4);
          } else {
            chunks.push(remaining as never);
            remaining = "";
          }
        }
        return `+${code} ${chunks.join(" ")}`;
      }
      return `+${code} ${digits}`;
  }
}

/**
 * Infers country code from currency
 */
function inferCountryFromCurrency(currency: string | null | undefined): { code: string; country: string } | null {
  if (!currency) return null;
  
  const currencyMap: Record<string, { code: string; country: string }> = {
    MXN: { code: "52", country: "Mexico" },
    USD: { code: "1", country: "United States/Canada" },
    CAD: { code: "1", country: "Canada" },
    GBP: { code: "44", country: "United Kingdom" },
    EUR: { code: "33", country: "France" }, // Default to France for EUR, but could be others
    AUD: { code: "61", country: "Australia" },
    JPY: { code: "81", country: "Japan" },
    BRL: { code: "55", country: "Brazil" },
    ARS: { code: "54", country: "Argentina" },
    CLP: { code: "56", country: "Chile" },
    COP: { code: "57", country: "Colombia" },
    PEN: { code: "51", country: "Peru" },
    VES: { code: "58", country: "Venezuela" },
    CNY: { code: "86", country: "China" },
    INR: { code: "91", country: "India" },
  };
  
  return currencyMap[currency] || null;
}

/**
 * Formats a phone number for display and WhatsApp
 * @param phone - Phone number to format
 * @param baseCurrency - Optional currency to infer country code if phone doesn't have one
 */
export function formatPhoneNumber(
  phone: string | null | undefined,
  baseCurrency?: string | null | undefined
): FormattedPhone | null {
  if (!phone) return null;

  const cleanPhone = phone.replace(/\D/g, "");
  
  if (cleanPhone.length < 7) {
    // Too short, return as is
    return {
      display: phone,
      whatsapp: cleanPhone,
    };
  }

  const detected = detectCountryCode(cleanPhone);
  
  if (detected) {
    const display = formatByCountry(detected.country, detected.code, detected.remaining);
    return {
      display,
      whatsapp: cleanPhone, // WhatsApp needs full number with country code
      country: detected.country,
    };
  }

  // No country code detected - try to infer from currency
  const inferred = inferCountryFromCurrency(baseCurrency);
  
  if (inferred && cleanPhone.length >= 10) {
    // Try to format with inferred country code
    const display = formatByCountry(inferred.country, inferred.code, cleanPhone);
    return {
      display,
      whatsapp: inferred.code + cleanPhone, // Add country code for WhatsApp
      country: inferred.country,
    };
  }

  // No country code detected and can't infer - treat as local number
  // Format for display based on length
  let display = phone;
  if (cleanPhone.length === 10) {
    // Format as: XXX-XXX-XXXX
    display = `${cleanPhone.substring(0, 3)}-${cleanPhone.substring(3, 6)}-${cleanPhone.substring(6)}`;
  } else if (cleanPhone.length > 10) {
    // Long number, add some spacing
    display = cleanPhone.match(/.{1,4}/g)?.join(" ") || cleanPhone;
  }
  
  // For WhatsApp, return the number as-is (may need country code)
  return {
    display,
    whatsapp: cleanPhone, // Return as-is, WhatsApp will show error if invalid
  };
}

/**
 * Gets WhatsApp URL for a phone number
 * @param phone - Phone number
 * @param baseCurrency - Optional currency to infer country code
 */
export function getWhatsAppUrl(
  phone: string | null | undefined,
  baseCurrency?: string | null | undefined
): string | null {
  if (!phone) return null;
  
  const formatted = formatPhoneNumber(phone, baseCurrency);
  if (!formatted) return null;
  
  return `https://wa.me/${formatted.whatsapp}`;
}

