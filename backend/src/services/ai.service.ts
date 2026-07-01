export interface AiResponse {
  content: string;
  disclaimer: string;
}

const MEDICAL_DISCLAIMER =
  'Afya Flow AI provides educational insights only. This is not medical advice, diagnosis, or prescription. Please consult your physician for medical concerns.';

export class AiService {
  /**
   * Safe educational chat query parser. Refuses symptoms diagnosis or medication prescriptions.
   */
  public static async queryEducationalAssistant(prompt: string): Promise<AiResponse> {
    const query = prompt.toLowerCase();

    // 1. Refusal Guardrails (Diagnosis/Prescription block)
    const diagnosisKeywords = [
      'diagnose',
      'i have a fever',
      'my chest hurts',
      'prescribe',
      'treatment for',
      'cure for',
      'what disease',
      'am i sick',
      'headache treatment',
    ];
    if (diagnosisKeywords.some((keyword) => query.includes(keyword))) {
      return {
        content:
          'As an educational health assistant, I am not authorized to diagnose medical conditions, evaluate symptoms, or prescribe medication treatments. Please schedule a clinic appointment or consult your healthcare practitioner immediately for any clinical diagnosis.',
        disclaimer: MEDICAL_DISCLAIMER,
      };
    }

    // 2. Educational Responses Fallback
    let responseText = '';

    if (query.includes('side effect') || query.includes('medication') || query.includes('pill')) {
      responseText =
        'Common medication side effects vary by therapeutic drug class:\n' +
        '- Cardiovascular agents (e.g., Amlodipine) may cause mild peripheral edema, dizziness, or flushing.\n' +
        '- Cholesterol management (e.g., Statins) can sometimes result in transient muscle soreness or digestive issues.\n' +
        'Always report recurring side effects to your doctor before altering any dosage schedules.';
    } else if (query.includes('hydrate') || query.includes('hydration') || query.includes('water')) {
      responseText =
        'Hydration targets depend on activity levels and clinical guidelines:\n' +
        '- Average adult recommendations: 2.5L to 3.0L daily.\n' +
        '- Stable fluid ingestion reduces workload on the left ventricle and balances blood sodium values.';
    } else if (query.includes('eat') || query.includes('eating') || query.includes('meal') || query.includes('nutrition')) {
      responseText =
        'Healthy eating practices focus on whole foods and glycemic management:\n' +
        '- Focus on lean proteins, fiber-rich vegetables, and complex carbohydrates.\n' +
        '- Individuals managing hypertension should limit sodium levels to under 1500mg daily.';
    } else {
      responseText =
        'Afya Flow Educational Guide:\n' +
        '- Focus on active hydration limits (2.5L+).\n' +
        '- Keep a structured sleep window (7-8 hours) to reduce cortisol stress levels.\n' +
        '- Adhere to the nutrition plans assigned by your organization doctor.';
    }

    return {
      content: responseText,
      disclaimer: MEDICAL_DISCLAIMER,
    };
  }

  /**
   * Generates a draft meal plan for doctor review.
   */
  public static async generateMealPlanDraft(patientCondition: string): Promise<string> {
    const condition = patientCondition.toLowerCase();
    let draft = '';

    if (condition.includes('pressure') || condition.includes('hypertension') || condition.includes('heart')) {
      draft =
        'DRAFT LOW-SODIUM DIET PLAN:\n' +
        '- Breakfast: Oatmeal with raw berries and a handful of unsalted almonds.\n' +
        '- Lunch: Grilled chicken breast over mixed spinach salad with olive oil dressing.\n' +
        '- Dinner: Baked salmon with roasted asparagus and brown rice.\n' +
        '- Fluid target: 2500mL daily.';
    } else if (condition.includes('diabetic') || condition.includes('sugar') || condition.includes('glucose')) {
      draft =
        'DRAFT GLYCEMIC CONTROL DIET PLAN:\n' +
        '- Breakfast: Scrambled egg whites with avocado and spinach.\n' +
        '- Lunch: Quinoa salad with grilled tofu, cucumber, and light lemon dressing.\n' +
        '- Dinner: Steamed cod fillet with broccoli and sautéed cauliflower rice.\n' +
        '- Fluid target: 3000mL daily.';
    } else {
      draft =
        'DRAFT STANDARD BALANCED DIET PLAN:\n' +
        '- Breakfast: Greek yogurt with fresh fruit slices and honey.\n' +
        '- Lunch: Turkey wrap with whole wheat tortilla, lettuce, and sliced tomatoes.\n' +
        '- Dinner: Grilled chicken breast with sweet potatoes and steam-sautéed beans.\n' +
        '- Fluid target: 2800mL daily.';
    }

    return draft;
  }
}
