/**
 * Normalize score to percentage
 */
const normalizeScore = (score, maxScore = 100) => {
  if (maxScore === 0) return 0;
  return (score / maxScore) * 100;
};

/**
 * Calculate weighted average
 */
const calculateWeightedAverage = (scores) => {
  if (!scores || scores.length === 0) return 0;

  const totalWeight = scores.reduce((sum, item) => sum + (item.weight || 1), 0);
  const weightedSum = scores.reduce((sum, item) => {
    const weight = item.weight || 1;
    const normalizedScore = normalizeScore(item.score, item.maxScore || 100);
    return sum + normalizedScore * weight;
  }, 0);

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
};

/**
 * Calculate grade based on percentage
 */
const calculateGrade = (percentage) => {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
};

/**
 * Check if score meets minimum requirement
 */
const meetsMinimumScore = (score, maxScore, minimumPercentage) => {
  const percentage = normalizeScore(score, maxScore);
  return percentage >= minimumPercentage;
};

module.exports = {
  normalizeScore,
  calculateWeightedAverage,
  calculateGrade,
  meetsMinimumScore,
};
