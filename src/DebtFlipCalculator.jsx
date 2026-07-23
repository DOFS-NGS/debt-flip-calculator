import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION — edit these values before going live
// ═══════════════════════════════════════════════════════════════════════

// GHL Webhook URL — replace with your inbound webhook trigger URL
const WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/LIO2RKxENzW5WOerlkFr/webhook-trigger/ec381483-c089-447f-8bd6-2f1325f385af";

// GHL Calendar Booking URL — replace with your GHL calendar link
const BOOKING_BASE_URL = "https://api.leadconnectorhq.com/widget/bookings/discovery-call-booking-01";

// GHL standard-field prefill via URL params is semi-official and can be
// finicky — confirm the exact param keys in the calendar's Share link
// and TEST the prefilled link in a private browser window before going live.
const GHL_PREFILL_PARAMS = {
  first_name: "first_name",
  last_name: "last_name",   // left blank — only first name captured at gate
  email: "email",
  phone: "phone",           // maps to the "mobile" field from the gate
};

// Booking integration style: "redirect" (opens in new tab) or "embed" (iframe)
const BOOKING_MODE = "redirect";

// Business name for consent copy — replace with your registered entity name
const BUSINESS_NAME = "DO. Financial Services";

// Consolidated loan rate used for Debt Flip projections (p.a.)
// This is a current competitive market rate and is stated in the assumptions disclosure.
// Update this value as market rates change.
const FLIP_RATE = 6.14;

// Base URL for results permalink
const PERMALINK_BASE = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";

// ═══════════════════════════════════════════════════════════════════════

// ─── Logo ────────────────────────────────────────────────────────────
const LOGO_SRC = "data:image/png;base64,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";

// ─── GTM / DataLayer Tracking ────────────────────────────────────────
const trackEvent = (eventName, data = {}) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...data });
};

// ─── Financial Helpers ───────────────────────────────────────────────
function calcMonthlyPayment(principal, annualRate, years) {
  const r = annualRate / 100 / 12, n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function calcTotalInterest(principal, annualRate, monthlyPmt) {
  if (monthlyPmt <= 0 || annualRate <= 0) return 0;
  const r = annualRate / 100 / 12;
  let balance = principal, totalInt = 0, months = 0;
  while (balance > 0.01 && months < 600) {
    const intCharge = balance * r;
    totalInt += intCharge;
    if (Math.min(monthlyPmt - intCharge, balance) <= 0) return Infinity;
    balance -= Math.min(monthlyPmt - intCharge, balance);
    months++;
  }
  return totalInt;
}

function calcYearsToPayoff(principal, annualRate, monthlyPmt) {
  if (monthlyPmt <= 0 || principal <= 0) return Infinity;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / monthlyPmt / 12;
  let balance = principal, months = 0;
  while (balance > 0.01 && months < 600) {
    const intCharge = balance * r;
    if (monthlyPmt <= intCharge) return Infinity;
    balance = balance + intCharge - monthlyPmt;
    months++;
  }
  return months / 12;
}

// ─── Formatting ──────────────────────────────────────────────────────
const fmt = (n) => {
  if (n === Infinity || isNaN(n)) return "∞";
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
};
const fmtYears = (y) => {
  if (y === Infinity || isNaN(y)) return "∞";
  const yrs = Math.floor(y), mths = Math.round((y - yrs) * 12);
  if (mths === 0) return `${yrs} yrs`;
  if (yrs === 0) return `${mths} mths`;
  return `${yrs} yrs ${mths} mths`;
};
const debtFreeDate = (yrsFromNow) => {
  if (yrsFromNow === Infinity || isNaN(yrsFromNow)) return "Unknown";
  const d = new Date();
  d.setMonth(d.getMonth() + Math.round(yrsFromNow * 12));
  return d.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
};

// ─── Australian Mobile Validation ────────────────────────────────────
const sanitiseMobile = (v) => v.replace(/[\s\-()]/g, "");
const isValidAuMobile = (v) => {
  const clean = sanitiseMobile(v);
  return /^04\d{8}$/.test(clean);
};

// ─── Permalink Encoding/Decoding ─────────────────────────────────────
function encodePermalink(mortgageData, debts) {
  const p = new URLSearchParams();
  p.set("mb", mortgageData.balance);
  p.set("mr", mortgageData.rate);
  p.set("mt", mortgageData.term);
  p.set("mp", mortgageData.payment);
  debts.forEach((d, i) => {
    p.set(`d${i}t`, d.type);
    p.set(`d${i}b`, d.balance);
    p.set(`d${i}r`, d.rate);
    p.set(`d${i}p`, d.payment);
  });
  p.set("dc", String(debts.length));
  return `${PERMALINK_BASE}?${p.toString()}`;
}

function decodePermalink() {
  if (typeof window === "undefined") return null;
  const p = new URLSearchParams(window.location.search);
  if (!p.has("mb")) return null;
  const mortgage = { balance: p.get("mb"), rate: p.get("mr"), term: p.get("mt"), payment: p.get("mp") };
  const count = Number(p.get("dc")) || 0;
  const debts = [];
  for (let i = 0; i < count; i++) {
    debts.push({ type: p.get(`d${i}t`) || "other", balance: p.get(`d${i}b`) || "", rate: p.get(`d${i}r`) || "", payment: p.get(`d${i}p`) || "" });
  }
  return { mortgage, debts };
}

// ─── Booking URL Builder ─────────────────────────────────────────────
function buildBookingURL(firstName, email, mobile) {
  try {
    const url = new URL(BOOKING_BASE_URL);
    if (firstName) url.searchParams.set(GHL_PREFILL_PARAMS.first_name, firstName);
    url.searchParams.set(GHL_PREFILL_PARAMS.last_name, "");
    if (email) url.searchParams.set(GHL_PREFILL_PARAMS.email, email);
    if (mobile) url.searchParams.set(GHL_PREFILL_PARAMS.phone, sanitiseMobile(mobile));
    return url.toString();
  } catch (e) {
    return BOOKING_BASE_URL; // fail gracefully
  }
}

// ─── Brand ───────────────────────────────────────────────────────────
const C = {
  green: "#004225", greenLight: "#00593A", greenPale: "#E8F0EC", greenMist: "#D4E4DB",
  black: "#000000", cream: "#F7F5F0", creamDark: "#EDE9E1", white: "#FFFFFF",
  red: "#C0392B", redPale: "#FBEAE8",
  gray100: "#E8E6E1", gray200: "#CCC9C2", gray400: "#8A867D", gray600: "#5C584F", gray800: "#2D2B27",
};
const FONT = "'Inter', sans-serif";

// ─── Reusable Components ─────────────────────────────────────────────
function InputField({ label, prefix, suffix, type = "text", value, onChange, placeholder, inputStep, helperText, isCurrency = false, error }) {
  const [focused, setFocused] = useState(false);
  const displayValue = isCurrency && value && !focused ? Number(value).toLocaleString("en-AU") : value;
  const handleChange = (e) => {
    if (isCurrency) { const raw = e.target.value.replace(/,/g, ""); if (raw === "" || /^\d*\.?\d*$/.test(raw)) onChange(raw); }
    else onChange(e.target.value);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray800, marginBottom: 6, fontFamily: FONT }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: C.white, border: `1.5px solid ${error ? C.red : focused ? C.green : C.gray200}`, borderRadius: 8, overflow: "hidden", transition: "border-color 0.2s" }}>
        {prefix && <span style={{ padding: "12px 0 12px 14px", color: C.gray400, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>{prefix}</span>}
        <input type={isCurrency ? "text" : type} inputMode={isCurrency ? "decimal" : type === "tel" ? "tel" : undefined} value={displayValue} onChange={handleChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} step={inputStep}
          style={{ flex: 1, border: "none", outline: "none", padding: prefix ? "12px 8px 12px 4px" : "12px 14px", fontSize: 16, fontFamily: FONT, color: C.black, background: "transparent", width: "100%", minWidth: 0 }} />
        {suffix && <span style={{ padding: "12px 14px 12px 0", color: C.gray400, fontSize: 14, fontWeight: 500, fontFamily: FONT }}>{suffix}</span>}
      </div>
      {error && <span style={{ fontSize: 12, color: C.red, marginTop: 4, display: "block", fontFamily: FONT }}>{error}</span>}
      {!error && helperText && <span style={{ fontSize: 11, color: C.gray400, marginTop: 4, display: "block", fontFamily: FONT }}>{helperText}</span>}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray800, marginBottom: 6, fontFamily: FONT }}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "12px 14px", border: `1.5px solid ${C.gray200}`, borderRadius: 8, fontSize: 15, fontFamily: FONT, color: C.black, background: C.white, outline: "none", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238A867D' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", cursor: "pointer" }}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", disabled = false, style: extra = {} }) {
  const base = { padding: "14px 28px", borderRadius: 8, fontSize: 15, fontWeight: 700, fontFamily: FONT, cursor: disabled ? "not-allowed" : "pointer", border: "none", transition: "all 0.2s ease", opacity: disabled ? 0.45 : 1 };
  const styles = {
    primary: { ...base, background: C.green, color: C.white },
    secondary: { ...base, background: "transparent", color: C.gray600, border: `1.5px solid ${C.gray200}` },
    danger: { ...base, background: C.redPale, color: C.red, padding: "8px 16px", fontSize: 13, borderRadius: 6 },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...styles[variant], ...extra }}>{children}</button>;
}

function DebtCard({ debt, index, onUpdate, onRemove, canRemove }) {
  const opts = [{ value: "credit_card", label: "Credit Card" }, { value: "personal_loan", label: "Personal Loan" }, { value: "car_loan", label: "Car Loan" }, { value: "bnpl", label: "Buy Now Pay Later" }, { value: "other", label: "Other" }];
  const icons = { credit_card: "💳", personal_loan: "🏦", car_loan: "🚗", bnpl: "🛒", other: "📋" };
  return (
    <div style={{ background: C.white, borderRadius: 10, padding: 20, marginBottom: 14, border: `1.5px solid ${C.gray100}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.black, fontFamily: FONT }}>{icons[debt.type]} Debt {index + 1}</span>
        {canRemove && <Btn variant="danger" onClick={onRemove}>Remove</Btn>}
      </div>
      <SelectField label="Debt Type" value={debt.type} onChange={(v) => onUpdate({ ...debt, type: v })} options={opts} />
      <InputField label="Balance Owing" prefix="$" isCurrency value={debt.balance} onChange={(v) => onUpdate({ ...debt, balance: v })} placeholder="5,000" />
      <InputField label="Interest Rate" suffix="% p.a." type="number" value={debt.rate} onChange={(v) => onUpdate({ ...debt, rate: v })} placeholder="18.0" inputStep="0.1" />
      <InputField label="Monthly Payment" prefix="$" isCurrency value={debt.payment} onChange={(v) => onUpdate({ ...debt, payment: v })} placeholder="200" />
    </div>
  );
}

function ComparisonBars({ currentYears, flipYears, maxYears, animated = true }) {
  const max = Math.max(currentYears, maxYears, 30);
  return (
    <div>
      {[
        { label: "Current Path", years: currentYears, pct: Math.min((currentYears / max) * 100, 100), color: C.red, delay: "0s" },
        { label: "Debt Flip Path", years: flipYears, pct: Math.min((flipYears / max) * 100, 100), color: C.green, delay: animated ? "0.3s" : "0s" },
      ].map((bar) => (
        <div key={bar.label} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.gray600, fontFamily: FONT }}>{bar.label}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: bar.color, fontFamily: FONT }}>{fmtYears(bar.years)}</span>
          </div>
          <div style={{ height: 24, background: C.gray100, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${bar.pct}%`, background: bar.color, borderRadius: 6, transition: animated ? "width 1.2s cubic-bezier(0.34,1.56,0.64,1)" : "width 0.3s ease", transitionDelay: bar.delay }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatBox({ label, value, dark = false, large = false, sub }) {
  return (
    <div style={{ background: dark ? C.green : C.white, borderRadius: 10, padding: large ? "24px 20px" : "18px 16px", border: dark ? "none" : `1.5px solid ${C.gray100}`, textAlign: "center", flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: dark ? C.greenPale : C.gray400, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, fontFamily: FONT }}>{label}</div>
      <div style={{ fontSize: large ? 30 : 22, fontWeight: 800, color: dark ? C.white : C.black, fontFamily: FONT, lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: dark ? C.greenMist : C.gray400, marginTop: 4, fontFamily: FONT }}>{sub}</div>}
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────
const EMPTY_DEBT = { type: "credit_card", balance: "", rate: "", payment: "" };

export default function DebtFlipCalculator() {
  // Steps: 0=Mortgage, 1=Debts, 2=Villain, 3=Gate, 4=Reveal
  const [step, setStep] = useState(0);
  const [revealPhase, setRevealPhase] = useState(0);
  const [hasTrackedStart, setHasTrackedStart] = useState(false);
  const [hasTrackedSlider, setHasTrackedSlider] = useState(false);
  const [isPermalink, setIsPermalink] = useState(false);
  const containerRef = useRef(null);

  const [mortgageBalance, setMortgageBalance] = useState("");
  const [mortgageRate, setMortgageRate] = useState("");
  const [mortgageTerm, setMortgageTerm] = useState("");
  const [mortgagePayment, setMortgagePayment] = useState("");
  const [debts, setDebts] = useState([{ ...EMPTY_DEBT }]);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [mobileTouched, setMobileTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [permalink, setPermalink] = useState("");

  // ─── Permalink Detection (load results directly) ───────────────────
  useEffect(() => {
    const data = decodePermalink();
    if (data) {
      setMortgageBalance(data.mortgage.balance);
      setMortgageRate(data.mortgage.rate);
      setMortgageTerm(data.mortgage.term);
      setMortgagePayment(data.mortgage.payment);
      setDebts(data.debts.length > 0 ? data.debts : [{ ...EMPTY_DEBT }]);
      setIsPermalink(true);
      setStep(4);
      setFirstName("there"); // fallback for personalised copy
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (step === 4) {
      setRevealPhase(0);
      trackEvent("ResultsViewed");
      const t1 = setTimeout(() => setRevealPhase(1), 600);
      const t2 = setTimeout(() => setRevealPhase(2), 1400);
      const t3 = setTimeout(() => setRevealPhase(3), 2200);
      const t4 = setTimeout(() => setRevealPhase(4), 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [step]);

  const onFirstInteraction = useCallback(() => {
    if (!hasTrackedStart) { trackEvent("CalculatorStarted"); setHasTrackedStart(true); }
  }, [hasTrackedStart]);

  // ─── Validation ────────────────────────────────────────────────────
  const s0ok = Number(mortgageBalance) > 0 && Number(mortgageRate) > 0 && Number(mortgageTerm) > 0 && Number(mortgagePayment) > 0;
  const s1ok = debts.every((d) => Number(d.balance) > 0 && Number(d.rate) >= 0 && Number(d.payment) > 0);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const validMobile = isValidAuMobile(mobile);
  const mobileError = mobileTouched && mobile.trim() && !validMobile ? "Please enter a valid Australian mobile (starting with 04, 10 digits)" : "";
  const gateOk = firstName.trim().length >= 2 && validEmail && validMobile;

  // ─── Core Calculations ─────────────────────────────────────────────
  const mBal = Number(mortgageBalance) || 0;
  const mRate = Number(mortgageRate) || 0;
  const mTerm = Number(mortgageTerm) || 0;
  const mPmt = Number(mortgagePayment) || 0;
  const totalDebtBal = debts.reduce((s, d) => s + (Number(d.balance) || 0), 0);
  const totalDebtPmt = debts.reduce((s, d) => s + (Number(d.payment) || 0), 0);
  const totalAllPmt = mPmt + totalDebtPmt;
  const totalAllBal = mBal + totalDebtBal;
  const totalDebtInt = debts.reduce((s, d) => s + calcTotalInterest(Number(d.balance) || 0, Number(d.rate) || 0, Number(d.payment) || 0), 0);
  const currentMortgageInt = calcTotalInterest(mBal, mRate, mPmt);
  const totalCurrentInt = currentMortgageInt + totalDebtInt;
  const consolidatedBal = mBal + totalDebtBal;
  const consolidatedMin = calcMonthlyPayment(consolidatedBal, FLIP_RATE, mTerm);
  const flipPmt = totalAllPmt;
  const flipYrs = calcYearsToPayoff(consolidatedBal, FLIP_RATE, flipPmt);
  const flipInt = calcTotalInterest(consolidatedBal, FLIP_RATE, flipPmt);
  const intSaved = totalCurrentInt - flipInt;
  const yrsSaved = mTerm - flipYrs;
  const flipDate = debtFreeDate(flipYrs);

  // Villain number: excess interest, rounded DOWN to nearest $1,000
  const villainRaw = intSaved > 0 ? intSaved : 0;
  const villainRounded = Math.floor(villainRaw / 1000) * 1000;

  // Slider
  const sliderMax = 1000;
  const adjustedPmt = flipPmt + sliderValue;
  const adjustedYrs = calcYearsToPayoff(consolidatedBal, FLIP_RATE, adjustedPmt);
  const adjustedInt = calcTotalInterest(consolidatedBal, FLIP_RATE, adjustedPmt);
  const adjustedIntSaved = totalCurrentInt - adjustedInt;
  const adjustedYrsSaved = mTerm - adjustedYrs;

  // Cost of waiting (first-month interest difference, using DEFAULT flip, not slider)
  const currentFirstMonthInt = debts.reduce((s, d) => {
    const bal = Number(d.balance) || 0, rate = Number(d.rate) || 0;
    return s + bal * (rate / 100 / 12);
  }, 0) + mBal * (mRate / 100 / 12);
  const flipFirstMonthInt = consolidatedBal * (FLIP_RATE / 100 / 12);
  const monthlyCostOfWaiting = Math.round(currentFirstMonthInt - flipFirstMonthInt);

  useEffect(() => { if (step === 4) setSliderValue(0); }, [step]);

  const fadeIn = (phase) => ({
    opacity: revealPhase >= phase ? 1 : 0,
    transform: revealPhase >= phase ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
  });

  // ─── Permalink Generation ──────────────────────────────────────────
  const generatePermalink = () => {
    return encodePermalink(
      { balance: mortgageBalance, rate: mortgageRate, term: mortgageTerm, payment: mortgagePayment },
      debts.map((d) => ({ type: d.type, balance: d.balance, rate: d.rate, payment: d.payment }))
    );
  };

  // ─── Webhook Submission ────────────────────────────────────────────
  const submitToGHL = async () => {
    setSubmitting(true);
    const link = generatePermalink();
    setPermalink(link);
    const now = new Date().toISOString();

    trackEvent("LeadCaptured", { first_name: firstName, email });

    const payload = {
      // Contact fields (map to GHL standard fields)
      first_name: firstName,
      email: email,
      phone: sanitiseMobile(mobile),
      // Calculator inputs
      mortgage_balance: fmt(mBal),
      mortgage_balance_raw: String(mBal),
      mortgage_rate_raw: String(mRate),
      mortgage_term_raw: String(mTerm),
      mortgage_payment_raw: String(mPmt),
      // Debts
      debts_json: JSON.stringify(debts.map((d) => ({ type: d.type, balance: Number(d.balance) || 0, rate: Number(d.rate) || 0, payment: Number(d.payment) || 0 }))),
      // Computed results
      total_debt: fmt(totalAllBal),
      total_debt_raw: String(totalAllBal),
      total_current_interest: fmt(Math.round(totalCurrentInt)),
      total_current_interest_raw: String(Math.round(totalCurrentInt)),
      villain_interest: fmt(villainRounded),
      villain_interest_raw: String(villainRounded),
      flip_total_interest: fmt(Math.round(flipInt)),
      flip_total_interest_raw: String(Math.round(flipInt)),
      interest_saved: fmt(Math.round(intSaved)),
      interest_saved_raw: String(Math.round(intSaved)),
      years_saved: fmtYears(yrsSaved),
      years_saved_raw: String(Math.round(yrsSaved * 100) / 100),
      debtfree_date: flipDate,
      combined_repayment_raw: String(totalAllPmt),
      consolidated_balance_raw: String(consolidatedBal),
      consolidated_rate: String(FLIP_RATE),
      consolidated_min_raw: String(Math.round(consolidatedMin)),
      monthly_cost_of_waiting: fmt(monthlyCostOfWaiting),
      monthly_cost_of_waiting_raw: String(monthlyCostOfWaiting),
      // Permalink & metadata
      results_permalink: link,
      submitted_at: now,
      contact_permission_requested: "true",
    };

    try {
      const params = new URLSearchParams(payload);
      await fetch(WEBHOOK_URL, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    } catch (e) { /* never block results */ }
    setSubmitting(false);
    setStep(4);
  };

  const reset = () => {
    setStep(0); setMortgageBalance(""); setMortgageRate(""); setMortgageTerm("");
    setMortgagePayment(""); setDebts([{ ...EMPTY_DEBT }]); setFirstName(""); setEmail(""); setMobile("");
    setMobileTouched(false); setSliderValue(0); setPermalink(""); setHasTrackedStart(false); setHasTrackedSlider(false); setIsPermalink(false);
    if (typeof window !== "undefined") window.history.replaceState({}, "", window.location.pathname);
  };

  const trackAndSet = (setter) => (v) => { onFirstInteraction(); setter(v); };

  const bookingURL = useMemo(() => buildBookingURL(firstName, email, mobile), [firstName, email, mobile]);

  // ─── Header text per step ──────────────────────────────────────────
  const headerText = step === 4
    ? (isPermalink ? "Your Debt Flip Results" : `${firstName}, here's your Debt Flip`)
    : step === 3 ? "Your Debt Flip result is ready."
    : step === 2 ? "Here's what staying the course costs you."
    : "See how fast you could be mortgage-free — without changing your spending.";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div ref={containerRef} style={{ minHeight: "100vh", background: C.cream, fontFamily: FONT, overflowY: "auto" }}>

        {/* ─── Header ─── */}
        <div style={{ background: C.green, padding: "28px 20px 44px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 16, right: 20, width: 8, height: 8, borderRadius: "50%", background: "#ffffff18" }} />
          <img src={LOGO_SRC} alt="DO. Financial Services" style={{ height: 72, marginBottom: 20, filter: "brightness(0) invert(1)" }} />
          <h1 style={{ fontSize: step >= 2 ? 24 : 26, fontWeight: 800, color: C.white, fontFamily: FONT, lineHeight: 1.2, margin: "0 0 10px 0", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            {headerText}
          </h1>
          {step <= 1 && (
            <p style={{ fontSize: 14, color: "#ffffffcc", fontFamily: FONT, lineHeight: 1.55, maxWidth: 360, margin: "0 auto" }}>
              Takes 2 minutes. No sign-up needed to start.
            </p>
          )}
        </div>

        {/* ─── Card ─── */}
        <div style={{ maxWidth: 480, margin: "-24px auto 0", padding: "0 16px 40px", position: "relative" }}>
          <div style={{ background: C.cream, borderRadius: 14, padding: step === 4 ? "24px 20px" : "28px 24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", border: `1px solid ${C.creamDark}` }}>

            {/* ═══ Step 0: Mortgage ═══ */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 21, fontWeight: 800, color: C.black, marginBottom: 4, fontFamily: FONT }}>Your Home Loan</h2>
                <p style={{ fontSize: 14, color: C.gray600, marginBottom: 24, fontFamily: FONT, lineHeight: 1.55 }}>
                  Start with your existing mortgage. Close enough is fine — you don't need exact figures.
                </p>
                <InputField label="Current Mortgage Balance" prefix="$" isCurrency value={mortgageBalance} onChange={trackAndSet(setMortgageBalance)} placeholder="450,000" />
                <InputField label="Interest Rate" suffix="% p.a." type="number" value={mortgageRate} onChange={trackAndSet(setMortgageRate)} placeholder="6.2" inputStep="0.1" />
                <InputField label="Remaining Term" suffix="years" type="number" value={mortgageTerm} onChange={trackAndSet(setMortgageTerm)} placeholder="25" />
                <InputField label="Current Monthly Repayment" prefix="$" isCurrency value={mortgagePayment} onChange={trackAndSet(setMortgagePayment)} placeholder="2,950" />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <Btn onClick={() => setStep(1)} disabled={!s0ok}>Next → Your Debts</Btn>
                </div>
              </div>
            )}

            {/* ═══ Step 1: Debts ═══ */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 21, fontWeight: 800, color: C.black, marginBottom: 4, fontFamily: FONT }}>Your Other Debts</h2>
                <p style={{ fontSize: 14, color: C.gray600, marginBottom: 24, fontFamily: FONT, lineHeight: 1.55 }}>
                  Add the debts that are costing you. Credit cards, car loans, personal loans, BNPL — no judgement, just numbers.
                </p>
                {debts.map((d, i) => (
                  <DebtCard key={i} debt={d} index={i}
                    onUpdate={(u) => { onFirstInteraction(); setDebts(debts.map((dd, idx) => (idx === i ? u : dd))); }}
                    onRemove={() => setDebts(debts.filter((_, idx) => idx !== i))}
                    canRemove={debts.length > 1} />
                ))}
                <button onClick={() => setDebts([...debts, { ...EMPTY_DEBT }])}
                  style={{ width: "100%", padding: 14, border: `2px dashed ${C.gray200}`, borderRadius: 8, background: "transparent", color: C.green, fontSize: 14, fontWeight: 700, fontFamily: FONT, cursor: "pointer", marginBottom: 20 }}>
                  + Add Another Debt
                </button>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <Btn variant="secondary" onClick={() => setStep(0)}>← Back</Btn>
                  <Btn onClick={() => { setStep(2); trackEvent("VillainNumberViewed"); }} disabled={!s1ok}>Show My Numbers →</Btn>
                </div>
              </div>
            )}

            {/* ═══ Step 2: Villain Number (excess interest, ungated) ═══ */}
            {step === 2 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.gray600, fontFamily: FONT, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Based on the numbers you've entered
                  </div>
                  <p style={{ fontSize: 16, color: C.gray800, fontFamily: FONT, lineHeight: 1.55, margin: "0 0 16px 0" }}>
                    Staying on your current path will cost you more than
                  </p>
                  <div style={{ fontSize: 48, fontWeight: 800, color: C.red, fontFamily: FONT, lineHeight: 1.1, animation: "fadeUp 0.8s ease-out" }}>
                    {villainRounded > 0 ? fmt(villainRounded) : fmt(0)}
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: C.gray600, fontFamily: FONT, marginTop: 8 }}>
                    in interest you don't need to pay
                  </p>
                </div>

                <div style={{ background: C.redPale, borderRadius: 10, padding: 16, marginBottom: 28, border: `1px solid ${C.red}18` }}>
                  <p style={{ fontSize: 14, color: C.gray800, fontFamily: FONT, lineHeight: 1.6, margin: 0 }}>
                    That's the extra cost of keeping your debts scattered across {debts.length + 1} different accounts, each charging its own rate — instead of making all that money work together.
                  </p>
                </div>

                {/* Disclaimer applies here too */}
                <p style={{ fontSize: 11, color: C.gray400, fontFamily: FONT, lineHeight: 1.6, marginBottom: 24 }}>
                  This estimate is based on the numbers you've entered and assumes consolidation at a competitive home loan rate of {FLIP_RATE}% p.a. Actual outcomes depend on individual circumstances and lender approval. This is not credit advice.
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
                  <Btn onClick={() => setStep(3)}>See How to Fix This →</Btn>
                </div>
              </div>
            )}

            {/* ═══ Step 3: Gate (name + email + mobile, ALL required) ═══ */}
            {step === 3 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: C.green, fontFamily: FONT, lineHeight: 1.55, margin: "0 0 8px 0" }}>
                    You've seen what staying the course costs.
                  </p>
                  <p style={{ fontSize: 14, color: C.gray600, fontFamily: FONT, lineHeight: 1.55, margin: 0 }}>
                    Now see how many years sooner you could be mortgage-free — and exactly how the Debt Flip works.
                  </p>
                </div>

                <InputField label="First Name" value={firstName} onChange={setFirstName} placeholder="Sarah" />
                <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="sarah@email.com" />
                <InputField
                  label="Mobile"
                  type="tel"
                  value={mobile}
                  onChange={(v) => { setMobile(v); if (!mobileTouched) setMobileTouched(true); }}
                  placeholder="04XX XXX XXX"
                  error={mobileError}
                  helperText="We'll text you a private link to your results so you can come back to them anytime — and it's the number we'll use for your free Debt Flip Review."
                />

                {/* Consent line */}
                <p style={{ fontSize: 11, color: C.gray400, fontFamily: FONT, lineHeight: 1.6, marginBottom: 20, textAlign: "center" }}>
                  {/* CONSENT PLACEHOLDER — confirm final wording with compliance */}
                  By clicking 'Unlock my results', you agree that {BUSINESS_NAME} may contact you by phone, SMS and email about your results and home loan options.
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
                  <Btn onClick={submitToGHL} disabled={!gateOk || submitting}>
                    {submitting ? "Preparing..." : "Unlock my results"}
                  </Btn>
                </div>
              </div>
            )}

            {/* ═══ Step 4: Full Reveal ═══ */}
            {step === 4 && (
              <div>
                {/* Assumption callout */}
                <div style={{ textAlign: "center", marginBottom: 20, ...fadeIn(0) }}>
                  {!isPermalink && (
                    <div style={{ display: "inline-block", background: C.greenPale, borderRadius: 50, padding: "5px 16px", marginBottom: 10 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: FONT }}>{firstName}'s Debt Flip Projection</span>
                    </div>
                  )}
                  <div style={{ background: C.white, border: `1.5px solid ${C.greenMist}`, borderRadius: 10, padding: 12, marginTop: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.green, fontFamily: FONT, margin: 0, lineHeight: 1.5 }}>
                      These numbers assume no extra money — just your current payments, redirected.
                    </p>
                  </div>
                </div>

                {/* HEADLINE: Years saved / debt-free date */}
                <div style={fadeIn(0)}>
                  <div style={{ background: C.green, borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 18, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: -40, right: -40, width: 120, height: 120, borderRadius: "50%", background: "#ffffff08" }} />
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.greenPale, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8, fontFamily: FONT, position: "relative" }}>
                      You could be mortgage-free
                    </div>
                    <div style={{ fontSize: 42, fontWeight: 800, color: C.white, fontFamily: FONT, lineHeight: 1.1, position: "relative" }}>
                      {yrsSaved > 0 ? fmtYears(yrsSaved) : "—"}
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: C.greenPale, fontFamily: FONT, marginTop: 6, position: "relative" }}>sooner</div>
                    <div style={{ fontSize: 14, color: "#ffffffaa", fontFamily: FONT, marginTop: 8, position: "relative" }}>
                      Debt-free by {flipDate}
                    </div>
                  </div>
                </div>

                {/* Flip repayment breakdown */}
                <div style={fadeIn(1)}>
                  <div style={{ background: C.white, border: `1.5px solid ${C.gray100}`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                      <StatBox label="Your Repayment" value={fmt(Math.round(flipPmt))} large sub="same as you pay now" />
                      <StatBox label="Consolidated Loan" value={fmt(consolidatedBal)} sub="one loan, one payment" />
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <StatBox label="New Minimum" value={fmt(Math.round(consolidatedMin))} sub="if you wanted breathing room" />
                      <StatBox label="Total Debt" value={fmt(totalAllBal)} sub="across all sources" />
                    </div>
                  </div>
                </div>

                {/* Interest saved (now confirmed precisely) */}
                <div style={fadeIn(2)}>
                  <div style={{ background: C.greenPale, border: `1.5px solid ${C.greenMist}`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
                    <div style={{ marginBottom: 14 }}>
                      <StatBox label="Total Interest Saved" value={intSaved > 0 ? fmt(Math.round(intSaved)) : "—"} large />
                    </div>
                    <ComparisonBars currentYears={mTerm} flipYears={flipYrs} maxYears={mTerm} />
                  </div>
                </div>

                {/* Mandated copy line */}
                <div style={fadeIn(2)}>
                  <div style={{ padding: 16, background: C.white, borderRadius: 10, textAlign: "center", marginBottom: 18, border: `1.5px solid ${C.gray100}` }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: C.black, fontFamily: FONT, lineHeight: 1.55, margin: 0 }}>
                      "You're already paying this.<br />
                      <span style={{ color: C.green }}>Let's make it work FOR you, not against you.</span>"
                    </p>
                  </div>
                </div>

                {/* ─── Repayment Slider ─── */}
                <div style={fadeIn(3)}>
                  <div style={{ background: C.greenPale, border: `1.5px solid ${C.greenMist}`, borderRadius: 12, padding: 20, marginBottom: 18 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: C.green, fontFamily: FONT, margin: "0 0 4px 0" }}>
                      {sliderValue === 0 ? "This is your result without changing a thing." : `What an extra ${fmt(sliderValue)}/mth could do`}
                    </h3>
                    <p style={{ fontSize: 13, color: C.gray600, fontFamily: FONT, margin: "0 0 16px 0", lineHeight: 1.5 }}>
                      {sliderValue === 0 ? "Curious what an extra $50 a month would do? Drag the slider." : "Drag the slider to explore your options."}
                    </p>
                    <div style={{ padding: "0 4px" }}>
                      <input type="range" min={0} max={sliderMax} step={10} value={sliderValue}
                        onChange={(e) => { setSliderValue(Number(e.target.value)); if (!hasTrackedSlider) { trackEvent("SliderEngaged"); setHasTrackedSlider(true); } }}
                        style={{ width: "100%", height: 44, cursor: "pointer", WebkitAppearance: "none", appearance: "none", background: "transparent" }} />
                      <style>{`
                        input[type="range"]::-webkit-slider-runnable-track { height: 8px; border-radius: 4px; background: linear-gradient(to right, ${C.green} 0%, ${C.green} ${(sliderValue / sliderMax) * 100}%, ${C.gray200} ${(sliderValue / sliderMax) * 100}%, ${C.gray200} 100%); }
                        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 32px; height: 32px; border-radius: 50%; background: ${C.green}; border: 3px solid ${C.white}; box-shadow: 0 2px 8px rgba(0,0,0,0.15); margin-top: -12px; cursor: pointer; }
                        input[type="range"]::-moz-range-track { height: 8px; border-radius: 4px; background: ${C.gray200}; }
                        input[type="range"]::-moz-range-progress { height: 8px; border-radius: 4px; background: ${C.green}; }
                        input[type="range"]::-moz-range-thumb { width: 28px; height: 28px; border-radius: 50%; background: ${C.green}; border: 3px solid ${C.white}; box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer; }
                      `}</style>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.gray400, fontFamily: FONT, marginTop: 4 }}>
                        <span>No change</span>
                        <span>+{fmt(sliderMax)}/mth</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                      <StatBox label="Monthly Repayment" value={fmt(Math.round(adjustedPmt))} sub={sliderValue > 0 ? `+${fmt(sliderValue)} from current` : "same as now"} />
                      <StatBox label="Mortgage-Free" value={adjustedYrsSaved > 0 ? fmtYears(adjustedYrsSaved) + " sooner" : "—"} />
                    </div>
                    {sliderValue > 0 && (
                      <>
                        <div style={{ marginTop: 10 }}>
                          <StatBox label="Total Interest Saved" value={adjustedIntSaved > 0 ? fmt(Math.round(adjustedIntSaved)) : "—"} large />
                        </div>
                        <div style={{ marginTop: 14 }}>
                          <ComparisonBars currentYears={mTerm} flipYears={adjustedYrs} maxYears={mTerm} animated={false} />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* ─── Single CTA: Booking ─── */}
                <div style={fadeIn(4)}>
                  <div style={{ background: C.green, borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 18 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: FONT, margin: "0 0 8px 0" }}>
                      Ready to see if these numbers hold up?
                    </h3>
                    <p style={{ fontSize: 14, color: "#ffffffcc", fontFamily: FONT, margin: "0 0 20px 0", lineHeight: 1.55 }}>
                      Book a free Discovery Call. We'll check your projection against actual lender rates and map out your options.
                    </p>
                    {/* ── BOOKING CTA — supports redirect or embed mode ── */}
                    <a
                      href={bookingURL}
                      target="_blank" rel="noopener noreferrer"
                      onClick={() => trackEvent("BookingClicked")}
                      style={{ display: "inline-block", padding: "16px 36px", background: C.white, color: C.green, borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: FONT, textDecoration: "none" }}>
                      Book Your Free Discovery Call →
                    </a>
                  </div>

                  {!isPermalink && <Btn variant="secondary" onClick={reset} style={{ width: "100%", marginBottom: 12 }}>Start Over</Btn>}
                </div>

                {/* ─── Assumptions Footnote ─── */}
                <div style={fadeIn(4)}>
                  <div style={{ background: C.white, borderRadius: 8, padding: 14, border: `1px solid ${C.gray100}`, marginTop: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.gray600, fontFamily: FONT, margin: "0 0 6px 0" }}>What these numbers assume</p>
                    {/* ── DISCLAIMER PLACEHOLDER — replace with final compliance wording ── */}
                    <p style={{ fontSize: 11, color: C.gray400, fontFamily: FONT, lineHeight: 1.7, margin: 0 }}>
                      These projections assume a consolidated home loan rate of {FLIP_RATE}% p.a., which reflects a current competitive market rate and may differ from the rate you are offered. They don't include refinancing costs, lender fees, or Lenders Mortgage Insurance. They assume a single fixed interest rate with no rate changes over the life of the loan, and consistent repayment amounts. Results are estimates only and any consolidation is subject to lender approval and individual assessment. This is not credit advice.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
