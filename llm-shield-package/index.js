// ===== SAME DETECTION ARRAYS (UNCHANGED) =====
// (keep all your phrase arrays here exactly same)

// ===== CORE FUNCTION =====
async function analyzePrompt(prompt, aiEnabled = false, anthropicApiKey = null) {
  const normalizedPrompt = prompt.toLowerCase();
  const flags = [];
  let rule_score = 0;
  let hasCritical = false;

  // Detection logic (same as yours)
  CRITICAL_PHRASES.forEach(phrase => {
    if (normalizedPrompt.includes(phrase.toLowerCase())) {
      flags.push(phrase);
      rule_score += 40;
      hasCritical = true;
    }
  });

  HIGH_PHRASES.forEach(p => normalizedPrompt.includes(p) && (flags.push(p), rule_score += 25));
  EXTRACTION_PHRASES.forEach(p => normalizedPrompt.includes(p) && (flags.push(p), rule_score += 25));
  INDIRECT_PHRASES.forEach(p => normalizedPrompt.includes(p) && (flags.push(p), rule_score += 20));
  MEDIUM_PHRASES.forEach(p => normalizedPrompt.includes(p) && (flags.push(p), rule_score += 15));

  if (/[#\*\_]{5,}/.test(prompt)) rule_score += 10;
  if (/base64/i.test(prompt)) rule_score += 15;
  if (/(system|assistant|user|prompt):/i.test(prompt)) rule_score += 15;

  if (hasCritical && rule_score < 75) rule_score = 75;
  rule_score = Math.min(rule_score, 100);

  let final_score = rule_score;

  let risk = "safe";
  let confidence = "low";
  let message = "Prompt appears safe.";

  if (final_score >= 70) {
    risk = "dangerous";
    confidence = "high";
    message = "Prompt contains severe injection patterns.";
  } else if (final_score >= 31) {
    risk = "suspicious";
    confidence = "medium";
    message = "Suspicious phrasing detected.";
  } else if (final_score > 0) {
    confidence = "medium";
    message = "Minor irregularities detected.";
  }

  return {
    risk,
    score: final_score,
    confidence,
    flags,
    message
  };
}

// ===== MIDDLEWARE =====
function llmShield(config = {}) {
  const threshold = config.threshold || 70;

  return async (req, res, next) => {
    const prompt = req.body?.prompt || req.query?.prompt;

    if (!prompt || typeof prompt !== 'string') {
      return next();
    }

    try {
      const result = await analyzePrompt(prompt);

      req.llmShield = result;

      if (result.score >= threshold) {
        return res.status(403).json({
          error: "Malicious Prompt Blocked",
          shield_metadata: result
        });
      }

      next();
    } catch (err) {
      console.error("[LLM Shield Error]", err);
      return res.status(500).json({
        error: "LLM Shield internal error"
      });
    }
  };
}

// ===== ✅ FIXED EXPORT =====
module.exports = llmShield;
module.exports.analyzePrompt = analyzePrompt;