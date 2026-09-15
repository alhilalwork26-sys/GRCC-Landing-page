export const TAX_INVOICE_KEY = "butuh_faktur_pajak";
export const TAX_INVOICE_COMPANY_KEY = "faktur_nama_perusahaan";
export const TAX_INVOICE_EMAIL_KEY = "faktur_email_finance";
export const TAX_INVOICE_PIC_KEY = "faktur_pic_finance";
export const TAX_INVOICE_PHONE_KEY = "faktur_wa_finance";
export const TAX_INVOICE_NPWP_PHOTO_KEY = "faktur_npwp_photo_url";

// Legacy keys — tidak dipakai form baru, tapi tetap diekspor supaya submission
// lama (alamat perusahaan, NPWP diketik, checkbox konfirmasi) masih terbaca
// dengan benar di Admin.
export const TAX_INVOICE_ADDRESS_KEY = "faktur_alamat_perusahaan";
export const TAX_INVOICE_NPWP_KEY = "faktur_npwp_perusahaan";
export const TAX_INVOICE_CONTACTED_KEY = "faktur_sudah_hubungi_admin";

export const TAX_INVOICE_REQUIRED_KEYS = [
  TAX_INVOICE_PIC_KEY,
  TAX_INVOICE_COMPANY_KEY,
  TAX_INVOICE_EMAIL_KEY,
  TAX_INVOICE_PHONE_KEY,
  TAX_INVOICE_NPWP_PHOTO_KEY,
] as const;

export const TAX_INVOICE_LABELS: Record<string, string> = {
  [TAX_INVOICE_KEY]: "Butuh Faktur Pajak",
  [TAX_INVOICE_PIC_KEY]: "Nama PIC",
  [TAX_INVOICE_COMPANY_KEY]: "Nama Instansi",
  [TAX_INVOICE_EMAIL_KEY]: "Email Aktif",
  [TAX_INVOICE_PHONE_KEY]: "Nomor WA Aktif",
  [TAX_INVOICE_NPWP_PHOTO_KEY]: "Foto NPWP",
  // legacy
  [TAX_INVOICE_ADDRESS_KEY]: "Alamat Perusahaan",
  [TAX_INVOICE_NPWP_KEY]: "NPWP Perusahaan",
  [TAX_INVOICE_CONTACTED_KEY]: "Paham Tidak Transfer Dulu",
};

export function needsTaxInvoice(customData?: Record<string, string> | null) {
  return customData?.[TAX_INVOICE_KEY] === "Ya";
}

export function taxInvoiceLabel(key: string) {
  return TAX_INVOICE_LABELS[key];
}
