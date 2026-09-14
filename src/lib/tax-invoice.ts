export const TAX_INVOICE_KEY = "butuh_faktur_pajak";
export const TAX_INVOICE_COMPANY_KEY = "faktur_nama_perusahaan";
export const TAX_INVOICE_NPWP_KEY = "faktur_npwp_perusahaan";
export const TAX_INVOICE_ADDRESS_KEY = "faktur_alamat_perusahaan";
export const TAX_INVOICE_EMAIL_KEY = "faktur_email_finance";
export const TAX_INVOICE_PIC_KEY = "faktur_pic_finance";
export const TAX_INVOICE_PHONE_KEY = "faktur_wa_finance";
export const TAX_INVOICE_CONTACTED_KEY = "faktur_sudah_hubungi_admin";

export const TAX_INVOICE_REQUIRED_KEYS = [
  TAX_INVOICE_COMPANY_KEY,
  TAX_INVOICE_NPWP_KEY,
  TAX_INVOICE_ADDRESS_KEY,
  TAX_INVOICE_EMAIL_KEY,
  TAX_INVOICE_PIC_KEY,
  TAX_INVOICE_PHONE_KEY,
  TAX_INVOICE_CONTACTED_KEY,
] as const;

export const TAX_INVOICE_LABELS: Record<string, string> = {
  [TAX_INVOICE_KEY]: "Butuh Faktur Pajak",
  [TAX_INVOICE_COMPANY_KEY]: "Nama Perusahaan Faktur",
  [TAX_INVOICE_NPWP_KEY]: "NPWP Perusahaan",
  [TAX_INVOICE_ADDRESS_KEY]: "Alamat Perusahaan",
  [TAX_INVOICE_EMAIL_KEY]: "Email Finance",
  [TAX_INVOICE_PIC_KEY]: "PIC Finance",
  [TAX_INVOICE_PHONE_KEY]: "WhatsApp PIC Finance",
  [TAX_INVOICE_CONTACTED_KEY]: "Sudah Hubungi Admin",
};

export function needsTaxInvoice(customData?: Record<string, string> | null) {
  return customData?.[TAX_INVOICE_KEY] === "Ya";
}

export function taxInvoiceLabel(key: string) {
  return TAX_INVOICE_LABELS[key];
}
