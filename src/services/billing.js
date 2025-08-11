// billing.js - invoices and payments APIs
import http from './http';

export async function createInvoice(rental_id, amount_due) {
  const { data } = await http.post('/billing/invoices', { rental_id, amount_due });
  return data; // { invoice_id }
}

export async function recordPayment({ rental_id, invoice_id, amount, gateway }) {
  const { data } = await http.post('/billing/payments', { rental_id, invoice_id, amount, gateway });
  return data; // { paid: true, invoice_status }
}


