import { useState, useEffect, useRef, useCallback } from "react";

// ─── Logo ────────────────────────────────────────────────────────────
const LOGO_SRC = "data:image/png;base64,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";

// ─── Meta Pixel Tracking ─────────────────────────────────────────────
const trackEvent = (eventName, data = {}) => {
  if (typeof window.fbq !== "function") return;
  if (eventName === "LeadCaptured") {
    window.fbq("track", "Lead", { content_name: "Debt Flip Calculator", ...data });
  } else {
    window.fbq("trackCustom", eventName, data);
  }
};

// ─── Financial Helpers ───────────────────────────────────────────────
function monthlyPayment(principal, annualRate, years) {
  const r = annualRate / 100 / 12, n = years * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function totalInterest(principal, annualRate, monthlyPmt) {
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

function yearsToPayoff(principal, annualRate, monthlyPmt) {
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

// ─── Brand ───────────────────────────────────────────────────────────
const C = {
  green: "#004225", greenLight: "#00593A", greenPale: "#E8F0EC", greenMist: "#D4E4DB",
  black: "#000000", cream: "#F7F5F0", creamDark: "#EDE9E1", white: "#FFFFFF",
  red: "#C0392B", redPale: "#FBEAE8", redDeep: "#8B1A1A",
  gray100: "#E8E6E1", gray200: "#CCC9C2", gray400: "#8A867D", gray600: "#5C584F", gray800: "#2D2B27",
};
const FONT = "'Inter', sans-serif";

// ─── Reusable Components ─────────────────────────────────────────────
function InputField({ label, prefix, suffix, type = "text", value, onChange, placeholder, inputStep, helperText, isCurrency = false }) {
  const [focused, setFocused] = useState(false);
  const displayValue = isCurrency && value && !focused ? Number(value).toLocaleString("en-AU") : value;
  const handleChange = (e) => {
    if (isCurrency) { const raw = e.target.value.replace(/,/g, ""); if (raw === "" || /^\d*\.?\d*$/.test(raw)) onChange(raw); }
    else onChange(e.target.value);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.gray800, marginBottom: 6, fontFamily: FONT }}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", background: C.white, border: `1.5px solid ${focused ? C.green : C.gray200}`, borderRadius: 8, overflow: "hidden", transition: "border-color 0.2s" }}>
        {prefix && <span style={{ padding: "12px 0 12px 14px", color: C.gray400, fontSize: 15, fontWeight: 600, fontFamily: FONT }}>{prefix}</span>}
        <input type={isCurrency ? "text" : type} inputMode={isCurrency ? "decimal" : undefined} value={displayValue} onChange={handleChange} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder={placeholder} step={inputStep}
          style={{ flex: 1, border: "none", outline: "none", padding: prefix ? "12px 8px 12px 4px" : "12px 14px", fontSize: 16, fontFamily: FONT, color: C.black, background: "transparent", width: "100%", minWidth: 0 }} />
        {suffix && <span style={{ padding: "12px 14px 12px 0", color: C.gray400, fontSize: 14, fontWeight: 500, fontFamily: FONT }}>{suffix}</span>}
      </div>
      {helperText && <span style={{ fontSize: 11, color: C.gray400, marginTop: 4, display: "block", fontFamily: FONT }}>{helperText}</span>}
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
  const containerRef = useRef(null);

  const [mortgageBalance, setMortgageBalance] = useState("");
  const [mortgageRate, setMortgageRate] = useState("");
  const [mortgageTerm, setMortgageTerm] = useState("");
  const [mortgagePayment, setMortgagePayment] = useState("");
  const [debts, setDebts] = useState([{ ...EMPTY_DEBT }]);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

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

  // Track first input interaction
  const onFirstInteraction = useCallback(() => {
    if (!hasTrackedStart) { trackEvent("CalculatorStarted"); setHasTrackedStart(true); }
  }, [hasTrackedStart]);

  // Validation
  const s0ok = Number(mortgageBalance) > 0 && Number(mortgageRate) > 0 && Number(mortgageTerm) > 0 && Number(mortgagePayment) > 0;
  const s1ok = debts.every((d) => Number(d.balance) > 0 && Number(d.rate) >= 0 && Number(d.payment) > 0);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const gateOk = firstName.trim().length >= 2 && validEmail;

  // ─── Core Calculations ─────────────────────────────────────────────
  const mBal = Number(mortgageBalance) || 0;
  const mRate = Number(mortgageRate) || 0;
  const mTerm = Number(mortgageTerm) || 0;
  const mPmt = Number(mortgagePayment) || 0;
  const totalDebtBal = debts.reduce((s, d) => s + (Number(d.balance) || 0), 0);
  const totalDebtPmt = debts.reduce((s, d) => s + (Number(d.payment) || 0), 0);
  const totalAllPmt = mPmt + totalDebtPmt;
  const totalAllBal = mBal + totalDebtBal;
  const totalDebtInt = debts.reduce((s, d) => s + totalInterest(Number(d.balance) || 0, Number(d.rate) || 0, Number(d.payment) || 0), 0);
  const currentMortgageInt = totalInterest(mBal, mRate, mPmt);
  const totalCurrentInt = currentMortgageInt + totalDebtInt;
  const consolidatedBal = mBal + totalDebtBal;
  const consolidatedMin = monthlyPayment(consolidatedBal, mRate, mTerm);
  const flipPmt = totalAllPmt;
  const flipYrs = yearsToPayoff(consolidatedBal, mRate, flipPmt);
  const flipInt = totalInterest(consolidatedBal, mRate, flipPmt);
  const intSaved = totalCurrentInt - flipInt;
  const yrsSaved = mTerm - flipYrs;

  // Slider calculations (upward from current)
  const sliderMax = 1000;
  const adjustedPmt = flipPmt + sliderValue;
  const adjustedYrs = yearsToPayoff(consolidatedBal, mRate, adjustedPmt);
  const adjustedInt = totalInterest(consolidatedBal, mRate, adjustedPmt);
  const adjustedIntSaved = totalCurrentInt - adjustedInt;
  const adjustedYrsSaved = mTerm - adjustedYrs;

  // Cost of waiting: monthly interest difference (first month)
  const currentFirstMonthInt = debts.reduce((s, d) => {
    const bal = Number(d.balance) || 0, rate = Number(d.rate) || 0;
    return s + bal * (rate / 100 / 12);
  }, 0) + mBal * (mRate / 100 / 12);
  const flipFirstMonthInt = consolidatedBal * (mRate / 100 / 12);
  const monthlyCostOfWaiting = Math.round(currentFirstMonthInt - flipFirstMonthInt);

  // Init slider when entering reveal
  useEffect(() => {
    if (step === 4) setSliderValue(0);
  }, [step]);

  const fadeIn = (phase) => ({
    opacity: revealPhase >= phase ? 1 : 0,
    transform: revealPhase >= phase ? "translateY(0)" : "translateY(20px)",
    transition: "all 0.7s cubic-bezier(0.34,1.56,0.64,1)",
  });

  const submitToGHL = async () => {
    setSubmitting(true);
    trackEvent("LeadCaptured", { first_name: firstName, email });
    // Also fire standard Meta Lead event:
    // fbq('track', 'Lead', { content_name: 'Debt Flip Calculator' });
    try {
      const params = new URLSearchParams({
        first_name: firstName, email,
        mortgage_balance: fmt(mBal), total_debt: fmt(totalAllBal),
        interest_saved: intSaved > 0 ? fmt(Math.round(intSaved)) : "$0",
        years_saved: yrsSaved > 0 ? fmtYears(yrsSaved) : "0",
        total_monthly_payment: fmt(totalAllPmt),
        consolidated_balance: fmt(consolidatedBal),
        flip_payoff_years: fmtYears(flipYrs),
        total_current_interest: fmt(Math.round(totalCurrentInt)),
        mortgage_balance_raw: String(mBal), mortgage_rate_raw: String(mRate),
        mortgage_term_raw: String(mTerm), mortgage_payment_raw: String(mPmt),
        total_debt_raw: String(totalAllBal), combined_repayment_raw: String(totalAllPmt),
        interest_saved_raw: String(intSaved > 0 ? Math.round(intSaved) : 0),
        years_saved_raw: String(yrsSaved > 0 ? Math.round(yrsSaved * 100) / 100 : 0),
        consolidated_min_raw: String(Math.round(consolidatedMin)),
        debts_json: JSON.stringify(debts.map((d) => ({ type: d.type, balance: Number(d.balance) || 0, rate: Number(d.rate) || 0, payment: Number(d.payment) || 0 }))),
        contact_permission_requested: "true",
      });
      await fetch("https://services.leadconnectorhq.com/hooks/LIO2RKxENzW5WOerlkFr/webhook-trigger/ec381483-c089-447f-8bd6-2f1325f385af", {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
    } catch (e) { /* silently continue */ }
    setSubmitting(false);
    setStep(4);
  };

  const reset = () => {
    setStep(0); setMortgageBalance(""); setMortgageRate(""); setMortgageTerm("");
    setMortgagePayment(""); setDebts([{ ...EMPTY_DEBT }]); setFirstName(""); setEmail("");
    setSliderValue(0); setHasTrackedStart(false); setHasTrackedSlider(false);
  };

  // Wrapped onChange handlers that also fire CalculatorStarted
  const trackAndSet = (setter) => (v) => { onFirstInteraction(); setter(v); };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div ref={containerRef} style={{ minHeight: "100vh", background: C.cream, fontFamily: FONT, overflowY: "auto" }}>

        {/* ─── Header ─── */}
        <div style={{ background: C.green, padding: "28px 20px 44px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: 16, right: 20, width: 8, height: 8, borderRadius: "50%", background: "#ffffff18" }} />
          <img src={LOGO_SRC} alt="DO. Financial Services" style={{ height: 48, marginBottom: 20, filter: "brightness(0) invert(1)" }} />
          <h1 style={{ fontSize: step >= 2 ? 24 : 26, fontWeight: 800, color: C.white, fontFamily: FONT, lineHeight: 1.2, margin: "0 0 10px 0", maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            {step === 0 || step === 1
              ? "See how fast you could be mortgage-free — without changing your spending."
              : step === 2 ? "Here's what your current path looks like."
              : step === 3 ? "Your Debt Flip result is ready."
              : `${firstName}, here's your Debt Flip`}
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

            {/* ─── Step 0: Mortgage ─── */}
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

            {/* ─── Step 1: Debts ─── */}
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

            {/* ─── Step 2: Villain Number (ungated) ─── */}
            {step === 2 && (
              <div style={{ textAlign: "center" }}>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.gray600, fontFamily: FONT, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    On your current path, you'll pay
                  </div>
                  <div style={{
                    fontSize: 48, fontWeight: 800, color: C.red, fontFamily: FONT, lineHeight: 1.1,
                    animation: "fadeUp 0.8s ease-out",
                  }}>
                    {totalCurrentInt === Infinity ? "more than you can afford" : fmt(Math.round(totalCurrentInt))}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: C.gray600, fontFamily: FONT, marginTop: 8 }}>
                    in total interest across all your debts
                  </div>
                </div>

                <div style={{ background: C.redPale, borderRadius: 10, padding: 16, marginBottom: 28, border: `1px solid ${C.red}18` }}>
                  <p style={{ fontSize: 14, color: C.gray800, fontFamily: FONT, lineHeight: 1.6, margin: 0 }}>
                    That's money paid on top of what you actually borrowed — spread across {debts.length + 1} different debts, each charging its own rate. What if all that money was working together instead?
                  </p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <Btn variant="secondary" onClick={() => setStep(1)}>← Back</Btn>
                  <Btn onClick={() => setStep(3)}>See My Debt Flip Result →</Btn>
                </div>
              </div>
            )}

            {/* ─── Step 3: Gate (name + email only) ─── */}
            {step === 3 && (
              <div>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green, fontFamily: FONT, marginBottom: 8 }}>
                    Your personalised Debt Flip result is ready
                  </div>
                  <p style={{ fontSize: 14, color: C.gray600, fontFamily: FONT, lineHeight: 1.55, margin: 0 }}>
                    See how many years and how much interest you could save — just enter your name and email and we'll send you a copy.
                  </p>
                </div>

                <InputField label="First Name" value={firstName} onChange={setFirstName} placeholder="Sarah" />
                <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="sarah@email.com" />

                {/* Trust microcopy */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                  {["No calls unless you ask for one", "Nothing touches your credit file", "Your results, one email — that's it"].map((line) => (
                    <div key={line} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, color: C.green }}>✓</span>
                      <span style={{ fontSize: 13, color: C.gray600, fontFamily: FONT }}>{line}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <Btn variant="secondary" onClick={() => setStep(2)}>← Back</Btn>
                  <Btn onClick={submitToGHL} disabled={!gateOk || submitting}>
                    {submitting ? "Preparing..." : "Show My Debt Flip ✨"}
                  </Btn>
                </div>
              </div>
            )}

            {/* ─── Step 4: Full Reveal + Slider + CTA ─── */}
            {step === 4 && (
              <div>
                {/* Assumption callout */}
                <div style={{ textAlign: "center", marginBottom: 20, ...fadeIn(0) }}>
                  <div style={{ display: "inline-block", background: C.greenPale, borderRadius: 50, padding: "5px 16px", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: C.green, fontFamily: FONT }}>{firstName}'s Debt Flip Projection</span>
                  </div>
                  <div style={{ background: C.white, border: `1.5px solid ${C.greenMist}`, borderRadius: 10, padding: 12, marginTop: 4 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: C.green, fontFamily: FONT, margin: 0, lineHeight: 1.5 }}>
                      These numbers assume no extra money — just your current payments, redirected.
                    </p>
                  </div>
                </div>

                {/* Years saved — headline */}
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
                  </div>
                </div>

                {/* Comparison bars */}
                <div style={fadeIn(1)}>
                  <div style={{ background: C.greenPale, border: `1.5px solid ${C.greenMist}`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
                    <ComparisonBars currentYears={mTerm} flipYears={flipYrs} maxYears={mTerm} />
                  </div>
                </div>

                {/* Interest saved + details */}
                <div style={fadeIn(2)}>
                  <div style={{ background: C.white, border: `1.5px solid ${C.gray100}`, borderRadius: 12, padding: 18, marginBottom: 18 }}>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                      <StatBox label="Interest Saved" value={intSaved > 0 ? fmt(Math.round(intSaved)) : "—"} large />
                      <StatBox label="Your Repayment" value={fmt(Math.round(flipPmt))} large sub="same as you pay now" />
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <StatBox label="Consolidated Loan" value={fmt(consolidatedBal)} sub="one loan, one payment" />
                      <StatBox label="New Minimum" value={fmt(Math.round(consolidatedMin))} sub="if you wanted breathing room" />
                    </div>
                  </div>
                </div>

                {/* Key line */}
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
                      {sliderValue === 0
                        ? "This is your result without changing a thing."
                        : `What an extra ${fmt(sliderValue)}/mth could do`}
                    </h3>
                    <p style={{ fontSize: 13, color: C.gray600, fontFamily: FONT, margin: "0 0 16px 0", lineHeight: 1.5 }}>
                      {sliderValue === 0
                        ? "Curious what an extra $50 a month would do? Drag the slider."
                        : "Drag the slider to explore your options."}
                    </p>

                    {/* Slider */}
                    <div style={{ padding: "0 4px" }}>
                      <input
                        type="range"
                        min={0}
                        max={sliderMax}
                        step={10}
                        value={sliderValue}
                        onChange={(e) => {
                          setSliderValue(Number(e.target.value));
                          if (!hasTrackedSlider) { trackEvent("SliderEngaged"); setHasTrackedSlider(true); }
                        }}
                        style={{
                          width: "100%", height: 44, cursor: "pointer",
                          WebkitAppearance: "none", appearance: "none",
                          background: "transparent",
                        }}
                      />
                      <style>{`
                        input[type="range"]::-webkit-slider-runnable-track {
                          height: 8px; border-radius: 4px;
                          background: linear-gradient(to right, ${C.green} 0%, ${C.green} ${(sliderValue / sliderMax) * 100}%, ${C.gray200} ${(sliderValue / sliderMax) * 100}%, ${C.gray200} 100%);
                        }
                        input[type="range"]::-webkit-slider-thumb {
                          -webkit-appearance: none; appearance: none;
                          width: 32px; height: 32px; border-radius: 50%;
                          background: ${C.green}; border: 3px solid ${C.white};
                          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                          margin-top: -12px; cursor: pointer;
                        }
                        input[type="range"]::-moz-range-track {
                          height: 8px; border-radius: 4px; background: ${C.gray200};
                        }
                        input[type="range"]::-moz-range-progress {
                          height: 8px; border-radius: 4px; background: ${C.green};
                        }
                        input[type="range"]::-moz-range-thumb {
                          width: 28px; height: 28px; border-radius: 50%;
                          background: ${C.green}; border: 3px solid ${C.white};
                          box-shadow: 0 2px 8px rgba(0,0,0,0.15); cursor: pointer;
                        }
                      `}</style>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.gray400, fontFamily: FONT, marginTop: 4 }}>
                        <span>No change</span>
                        <span>+{fmt(sliderMax)}/mth</span>
                      </div>
                    </div>

                    {/* Slider live results */}
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                      <StatBox label="Monthly Repayment" value={fmt(Math.round(adjustedPmt))} sub={sliderValue > 0 ? `+${fmt(sliderValue)} from current` : "same as now"} />
                      <StatBox label="Mortgage-Free" value={adjustedYrsSaved > 0 ? fmtYears(adjustedYrsSaved) + " sooner" : "—"} />
                    </div>
                    {sliderValue > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <StatBox label="Total Interest Saved" value={adjustedIntSaved > 0 ? fmt(Math.round(adjustedIntSaved)) : "—"} large />
                      </div>
                    )}

                    {/* Updated comparison bars when slider moves */}
                    {sliderValue > 0 && (
                      <div style={{ marginTop: 14 }}>
                        <ComparisonBars currentYears={mTerm} flipYears={adjustedYrs} maxYears={mTerm} animated={false} />
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── Cost of Waiting ─── */}
                <div style={fadeIn(3)}>
                  {monthlyCostOfWaiting > 0 && (
                    <div style={{ background: C.white, border: `1.5px solid ${C.creamDark}`, borderRadius: 10, padding: 16, textAlign: "center", marginBottom: 18 }}>
                      <p style={{ fontSize: 14, color: C.gray800, fontFamily: FONT, lineHeight: 1.55, margin: 0 }}>
                        Every month you wait costs you roughly <span style={{ fontWeight: 800, color: C.red }}>{fmt(monthlyCostOfWaiting)}</span> in interest you don't need to be paying.
                      </p>
                    </div>
                  )}
                </div>

                {/* ─── Single CTA: Booking ─── */}
                <div style={fadeIn(4)}>
                  <div style={{ background: C.green, borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 18 }}>
                    <h3 style={{ fontSize: 20, fontWeight: 800, color: C.white, fontFamily: FONT, margin: "0 0 8px 0" }}>
                      Ready to see if these numbers hold up?
                    </h3>
                    <p style={{ fontSize: 14, color: "#ffffffcc", fontFamily: FONT, margin: "0 0 20px 0", lineHeight: 1.55 }}>
                      Book a free Debt Flip Review. We'll check your projection against actual lender rates and map out your options.
                    </p>
                    {/* ── BOOKING LINK PLACEHOLDER ── Replace href with your Calendly/booking URL */}
                    <a
                      href={`https://api.leadconnectorhq.com/widget/bookings/discovery-call-booking-01?first_name=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={() => trackEvent("BookingClicked")}
                      style={{ display: "inline-block", padding: "16px 36px", background: C.white, color: C.green, borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: FONT, textDecoration: "none" }}>
                      Book Your Free Debt Flip Review →
                    </a>
                  </div>

                  <Btn variant="secondary" onClick={reset} style={{ width: "100%", marginBottom: 12 }}>Start Over</Btn>
                </div>

                {/* ─── Assumptions Footnote ─── */}
                <div style={fadeIn(4)}>
                  <div style={{ background: C.white, borderRadius: 8, padding: 14, border: `1px solid ${C.gray100}`, marginTop: 8 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: C.gray600, fontFamily: FONT, margin: "0 0 6px 0" }}>What these numbers assume</p>
                    {/* ── DISCLAIMER PLACEHOLDER ── Replace with final compliance wording */}
                    <p style={{ fontSize: 11, color: C.gray400, fontFamily: FONT, lineHeight: 1.7, margin: 0 }}>
                      These projections don't include refinancing costs, lender fees, or Lenders Mortgage Insurance. They assume a single fixed interest rate with no rate changes over the life of the loan, and consistent repayment amounts. Results are estimates only and any consolidation is subject to lender approval and individual assessment. This is not credit advice.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fade-up animation */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
