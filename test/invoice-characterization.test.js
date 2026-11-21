var test = require('node:test');
var assert = require('node:assert/strict');

var pricing = require('../lib/pricing');
var invoice = require('../lib/invoice');
var reports = require('../lib/reports');

function riceOrder() {
  return {
    id: 901,
    date: '2026-11-21T00:00:00.000Z',
    customer: 'Characterization Customer',
    coupon: 'SAVE10',
    items: [{
      id: 1,
      name: 'Rice',
      sku: 'RICE-1',
      hsn: '1006',
      price: 600,
      qty: 1
    }],
    subtotal: 600,
    discount: 60,
    tax: 27,
    total: 567
  };
}

test('CURRENT BEHAVIOUR: order pricing applies the HSN rate after the coupon discount', function () {
  var totals = pricing.computeTotals(riceOrder().items, 'SAVE10');

  assert.deepEqual(totals, {
    subtotal: 600,
    discount: 60,
    taxable: 540,
    tax: 27,
    cgst: 13.5,
    sgst: 13.5,
    total: 567,
    lines: [{
      id: 1,
      name: 'Rice',
      hsn: '1006',
      gstPercent: 5,
      gross: 600,
      discount: 60,
      taxable: 540,
      tax: 27,
      net: 567
    }]
  });
});

test('invoice uses the billed HSN GST rate and applies the coupon before GST', function () {
  var figures = invoice.computeInvoiceFigures(riceOrder());

  assert.deepEqual(figures, {
    subtotal: 600,
    discount: 60,
    tax: 27,
    cgst: 13.5,
    sgst: 13.5,
    total: 567,
    rows: [{
      name: 'Rice',
      sku: 'RICE-1',
      hsn: '1006',
      qty: 1,
      price: 600,
      gstPercent: 5,
      line: 600,
      lineTax: 27
    }]
  });
});

test('reconciliation matches an invoice to the billed order', function () {
  var reconciliation = reports.getGstReconciliation({ orders: [riceOrder()] });

  assert.deepEqual(reconciliation, {
    totalChecked: 1,
    mismatchCount: 0,
    totalDelta: 0,
    rows: [{
      orderId: 901,
      date: '2026-11-21T00:00:00.000Z',
      customer: 'Characterization Customer',
      coupon: 'SAVE10',
      ledgerSubtotal: 600,
      ledgerDiscount: 60,
      ledgerTax: 27,
      ledgerTotal: 567,
      invoiceDiscount: 60,
      invoiceTax: 27,
      invoiceTotal: 567,
      delta: 0,
      matched: true
    }]
  });
});
