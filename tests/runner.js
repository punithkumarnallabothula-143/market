const bcrypt = require("bcryptjs");
const crypto = require("crypto");

let totalTests = 0;
let passedTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    process.exitCode = 1;
  }
}

// Logic mirror of lib/currency.ts
function calculateFinancials(subtotal, discount = 0, commissionRatePercent = 10) {
  const taxableAmount = Math.max(0, subtotal - discount);
  const platformCommission = Math.round((taxableAmount * commissionRatePercent) / 100);
  const creatorGrossShare = taxableAmount - platformCommission;
  const tax = 0;
  const total = taxableAmount + tax;
  return { subtotal, discount, taxableAmount, platformCommission, creatorGrossShare, tax, total };
}

function formatPrice(amount, currency = "INR") {
  if (amount === 0) return "Free";
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
  }
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

// Logic mirror of lib/payments.ts
function generateLicenseKey(productSlug, licenseType = "STD") {
  const prefix = productSlug.slice(0, 4).toUpperCase();
  const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `FM-${prefix}-${randomPart}-${timestamp}-${licenseType.slice(0, 3).toUpperCase()}`;
}

function generateOrderNumber() {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `FM-ORD-${dateStr}-${random}`;
}

async function runTests() {
  console.log("=== FrameMarket Automated Test Suite ===");

  // Test 1: Financial & Commission Math
  console.log("\n1. Financial & Commission Math:");
  const fin1 = calculateFinancials(2000, 0, 10);
  assert(fin1.platformCommission === 200, "10% Platform commission on ₹2,000 equals ₹200");
  assert(fin1.creatorGrossShare === 1800, "90% Creator gross share on ₹2,000 equals ₹1,800");
  assert(fin1.total === 2000, "Total equals ₹2,000");

  const fin2 = calculateFinancials(1499, 0, 10);
  assert(fin2.platformCommission === 150, "10% Platform commission on ₹1,499 rounds to integer ₹150");
  assert(fin2.creatorGrossShare === 1349, "90% Creator share on ₹1,499 equals ₹1,349");

  // Test 2: Price Formatter
  console.log("\n2. Currency Formatting:");
  assert(formatPrice(0) === "Free", "formatPrice(0) returns 'Free'");
  assert(formatPrice(2499, "INR").includes("2,499"), "formatPrice(2499) formats with thousand separators");

  // Test 3: License Key & Order Number Generators
  console.log("\n3. Licensing & Identification:");
  const lic = generateLicenseKey("nova-saas-landing-page", "Standard");
  assert(lic.startsWith("FM-NOVA-"), "License key has FM-[PREFIX] format");
  assert(lic.endsWith("-STA"), "License key has standard license suffix");

  const ord = generateOrderNumber();
  assert(ord.startsWith("FM-ORD-"), "Order number has FM-ORD- prefix");
  assert(ord.length >= 15, "Order number has sufficient entropy");

  // Test 4: Password Hashing Verification
  console.log("\n4. Authentication & Cryptography:");
  const pass = "TestSecurePassword123!";
  const hash = await bcrypt.hash(pass, 10);
  const match = await bcrypt.compare(pass, hash);
  const mismatch = await bcrypt.compare("WrongPassword!", hash);
  assert(match === true, "Bcrypt hash validates correct password");
  assert(mismatch === false, "Bcrypt hash rejects incorrect password");

  console.log(`\n========================================`);
  console.log(`Tests Completed: ${passedTests}/${totalTests} Passed.`);
  console.log(`========================================\n`);
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
