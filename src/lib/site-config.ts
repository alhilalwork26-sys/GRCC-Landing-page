const cleanPhone = (value?: string) => value?.replace(/[^\d]/g, "") ?? "";

export const siteConfig = {
  contactEmail:   process.env.NEXT_PUBLIC_CONTACT_EMAIL || "grcc.ailg@gmail.com",
  whatsappNumber: cleanPhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  phoneNumber:    cleanPhone(process.env.NEXT_PUBLIC_PHONE_NUMBER),
  payment: {
    bankName:      process.env.NEXT_PUBLIC_PAYMENT_BANK_NAME   || "",
    accountNumber: process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NUMBER || "",
    accountName:   process.env.NEXT_PUBLIC_PAYMENT_ACCOUNT_NAME   || "",
  },
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/grcc_ailgunair/",
    linkedin:  process.env.NEXT_PUBLIC_LINKEDIN_URL  || "",
    youtube:   process.env.NEXT_PUBLIC_YOUTUBE_URL   || "",
    twitter:   process.env.NEXT_PUBLIC_TWITTER_URL   || "",
  },
};

export function whatsappHref(message: string) {
  if (!siteConfig.whatsappNumber) return `mailto:${siteConfig.contactEmail}`;
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function telHref() {
  if (!siteConfig.phoneNumber) return `mailto:${siteConfig.contactEmail}`;
  return `tel:+${siteConfig.phoneNumber}`;
}

export function paymentInstruction() {
  const { bankName, accountNumber, accountName } = siteConfig.payment;
  if (!bankName || !accountNumber || !accountName) {
    return "Detail pembayaran belum dikonfigurasi. Silakan hubungi admin GRCC sebelum melakukan pembayaran.";
  }

  return `Transfer ke ${bankName} · No. Rek: ${accountNumber} · a.n. ${accountName}.`;
}
