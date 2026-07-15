import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCompatibilityReport, normalizeStructuredReport } from '../agents/orchestrator.js';

test('normalizeStructuredReport falls back to the required wording when nothing is detected', () => {
  const normalized = normalizeStructuredReport({
    detected_objects: [],
    waste_type: '',
    condition: '',
    reuse_ideas: [],
    environmental_impact: { co2_saved_kg: '', water_saved_liters: '' },
    premium_startup_idea: {
      title: '',
      description: '',
      business_model: '',
      estimated_investment_inr: '',
      expected_roi_percentage: '',
      target_market: '',
      scalability: '',
    },
  });

  assert.equal(normalized.waste_type, 'Unable to confidently detect waste from the image');
  assert.equal(normalized.condition, 'Unable to confidently detect waste from the image');
  assert.equal(normalized.reuse_ideas.length, 0);
  assert.equal(normalized.vision.wasteType, 'Unable to confidently detect waste from the image');
});

test('buildCompatibilityReport derives compatible fields from the final JSON response', () => {
  const compatibility = buildCompatibilityReport({
    waste_type: 'Used tyre',
    condition: 'Rubber waste with resale value',
    reuse_ideas: [{ estimated_profit_inr: '₹18,000' }],
    environmental_impact: { co2_saved_kg: '1298', water_saved_liters: '1200' },
    premium_startup_idea: {
      title: 'Tyre crumb hub',
      description: 'Convert tyres into crumb rubber and value-added products',
      business_model: 'Buy-back and processing fee',
      estimated_investment_inr: '₹20 lakh',
      expected_roi_percentage: '30%',
      target_market: 'Delhi NCR, Pune, Hyderabad',
      scalability: 'High',
    },
  });

  assert.equal(compatibility.vision.wasteType, 'Used tyre');
  assert.equal(compatibility.economy.currentValue, 18000);
  assert.equal(compatibility.startup.name, 'Tyre crumb hub');
  assert.equal(compatibility.impact.co2Saved, 1298);
});
