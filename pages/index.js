import { useState } from 'react';

export default function Home() {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [startAge, setStartAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('60');
  const [annuityPercent, setAnnuityPercent] = useState('40');
  const [annuityRatePA, setAnnuityRatePA] = useState('6');
  const [results, setResults] = useState(null);

  const calculateNPS = () => {
    // Parse inputs
    const P = parseFloat(monthlyInvestment) || 0;
    const r = (parseFloat(expectedReturn) || 0) / 100;
    const n = 12; // compounded monthly
    const t = (parseInt(retirementAge, 10) || 60) - (parseInt(startAge, 10) || 0);
    const N = t * 12; // total months
    const annuityPct = (parseFloat(annuityPercent) || 40) / 100;

    // Total invested
    const totalInvested = P * N;

    // Future Value of SIP: FV = P * [((1 + r/n)^(n*t) - 1) / (r/n)] * (1 + r/n)
    let fv = 0;
    if (r > 0 && n > 0 && t > 0) {
      fv = P * ((Math.pow(1 + r / n, n * t) - 1) / (r / n)) * (1 + r / n);
    }
    // Interest earned
    const interestEarned = fv - totalInvested;
    // Maturity amount
    const maturityAmount = fv;
    // Annuity value
    const annuityValue = maturityAmount * annuityPct;
    // Lump sum value
    const lumpSum = maturityAmount - annuityValue;
    // Estimated monthly pension (use user input annuity rate)
    const annuityRate = (parseFloat(annuityRatePA) || 0) / 100;
    const estimatedMonthlyPension = annuityValue * annuityRate / 12;

    setResults({
      totalInvested: Math.round(totalInvested),
      interestEarned: Math.round(interestEarned),
      maturityAmount: Math.round(maturityAmount),
      lumpSum: Math.round(lumpSum),
      annuityValue: Math.round(annuityValue),
      estimatedMonthlyPension: Math.round(estimatedMonthlyPension)
    });
  };

  return (
    <div className="container">
      <h1 className="title">Calculate your NPS returns</h1>
      <div className="subtitle">Use this free calculator to estimate your NPS corpus, lump sum, annuity, and monthly pension at retirement.</div>
      <div className="card form-card">
        <div className="form-row">
          <label>Monthly Investment (₹)
            <input
              type="number"
              min="0"
              value={monthlyInvestment}
              onChange={e => setMonthlyInvestment(e.target.value)}
              placeholder="e.g. 5000"
            />
          </label>
          <label>Expected Return (% p.a.)
            <input
              type="number"
              min="0"
              max="100"
              value={expectedReturn}
              onChange={e => setExpectedReturn(e.target.value)}
              placeholder="e.g. 10"
            />
          </label>
        </div>
        <div className="form-row">
          <label>Start Age
            <input
              type="number"
              min="18"
              max="60"
              value={startAge}
              onChange={e => setStartAge(e.target.value)}
              placeholder="e.g. 25"
            />
          </label>
          <label>Retirement Age
            <input
              type="number"
              min={startAge || 18}
              max="60"
              value={retirementAge}
              onChange={e => setRetirementAge(e.target.value)}
              placeholder="e.g. 60"
            />
          </label>
        </div>
        <div className="form-row">
          <label>Annuity % (40-100)
            <select value={annuityPercent} onChange={e => setAnnuityPercent(e.target.value)}>
              {[40,45,50,55,60,65,70,75,80,85,90,95,100].map(val => (
                <option key={val} value={val}>{val}%</option>
              ))}
            </select>
          </label>
          <label>Expected Annuity rate (PA)
            <input
              type="number"
              min="1"
              max="15"
              step="0.01"
              required
              value={annuityRatePA}
              onChange={e => setAnnuityRatePA(e.target.value)}
              placeholder="e.g. 6"
            />
          </label>
          <button className="calc-btn" onClick={calculateNPS}>Calculate</button>
        </div>
      </div>
      {results && (
        <div className="card results-card">
          <div className="results-flex">
            <div className="pie-wrap">
              {/* Pie chart for Lump Sum vs Annuity */}
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60" cy="60" r="54"
                  fill="#f1f3f6"
                  stroke="#e0e0e0"
                  strokeWidth="2"
                />
                {/* Annuity arc */}
                <path
                  d={describeArc(60, 60, 54, 0, (results.annuityValue / results.maturityAmount) * 360)}
                  fill="none"
                  stroke="#4f8cff"
                  strokeWidth="12"
                />
                {/* Lump sum arc */}
                <path
                  d={describeArc(60, 60, 54, (results.annuityValue / results.maturityAmount) * 360, 360)}
                  fill="none"
                  stroke="#00c853"
                  strokeWidth="12"
                />
                <text x="60" y="65" textAnchor="middle" fontSize="16" fill="#222">
                  ₹{results.maturityAmount.toLocaleString()}
                </text>
              </svg>
              <div className="legend">
                <span><span className="dot annuity" /> Annuity</span>
                <span><span className="dot lump" /> Lump Sum</span>
              </div>
            </div>
            <div className="result-values">
              <div><strong>Total Invested:</strong> ₹{results.totalInvested.toLocaleString()}</div>
              <div><strong>Interest Earned:</strong> ₹{results.interestEarned.toLocaleString()}</div>
              <div><strong>Maturity Amount:</strong> ₹{results.maturityAmount.toLocaleString()}</div>
              <div><strong>Lump Sum Value:</strong> ₹{results.lumpSum.toLocaleString()}</div>
              <div><strong>Annuity Value:</strong> ₹{results.annuityValue.toLocaleString()}</div>
              <div><strong>Estimated Monthly Pension:</strong> ₹{results.estimatedMonthlyPension.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
      <div className="card formula-card">
        <h2>Formula for NPS Calculation</h2>
        <div>
          <strong>Future Value of SIP:</strong><br />
          FV = P × [((1 + r/n)<sup>nt</sup> - 1) / (r/n)] × (1 + r/n)
        </div>
        <ul>
          <li>P = Monthly investment</li>
          <li>r = Expected annual return (in decimals)</li>
          <li>n = Number of compounding periods per year (12 for monthly)</li>
          <li>t = Number of years</li>
        </ul>
      </div>
      <style jsx>{`
        .container {
          max-width: 700px;
          margin: 40px auto;
          padding: 2rem 1rem;
          background: #f6f8fa;
          border-radius: 14px;
          font-family: system-ui, sans-serif;
        }
        .title {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .subtitle {
          text-align: center;
          color: #444;
          margin-bottom: 1.5rem;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          margin-bottom: 1.5rem;
          padding: 1.5rem 1.5rem 1rem 1.5rem;
        }
        .form-card {
          margin-bottom: 2rem;
        }
        .form-row {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .form-row label {
          flex: 1 1 220px;
          font-weight: 500;
          color: #333;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .form-row input, .form-row select {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }
        .calc-btn {
          align-self: flex-end;
          padding: 0.6rem 1.5rem;
          background: #4f8cff;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          cursor: pointer;
          margin-top: 1.2rem;
        }
        .results-card {
          margin-bottom: 2rem;
        }
        .results-flex {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex-wrap: wrap;
        }
        .pie-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 140px;
        }
        .legend {
          margin-top: 0.5rem;
          display: flex;
          gap: 1.2rem;
        }
        .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 6px;
        }
        .dot.annuity { background: #4f8cff; }
        .dot.lump { background: #00c853; }
        .result-values {
          flex: 1 1 220px;
          font-size: 1.08rem;
        }
        .result-values > div {
          margin: 0.5rem 0;
        }
        .formula-card {
          margin-top: 2rem;
        }
        .formula-card ul {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        @media (max-width: 700px) {
          .results-flex { flex-direction: column; gap: 1.2rem; }
        }
      `}</style>
    </div>
  );

  // Pie chart arc generator (SVG)
  function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = [
      'M', start.x, start.y,
      'A', r, r, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
    return d;
  }
  function polarToCartesian(cx, cy, r, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians)
    };
  }

}
