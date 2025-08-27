/*
Maps CIP 2-digit codes to industry names.

Source: https://nces.ed.gov/ipeds/cipcode/browse.aspx?y=55
*/

const INDUSTRY_MAP: Record<string, string> = {
  '01': 'Agriculture',
  '03': 'Environmental Science',
  '04': 'Architecture',
  '05': 'Cultural & Gender Studies',
  '09': 'Communications',
  '10': 'Tech Support',
  '11': 'STEM',
  '12': 'Culinary & Personal Services',
  '13': 'Education',
  '14': 'STEM',
  '15': 'Applied Engineering',
  '16': 'Languages & Linguistics',
  '19': 'Family & Consumer Sciences',
  '22': 'Law',
  '23': 'Liberal Arts',
  '24': 'Liberal Arts',
  '26': 'STEM',
  '27': 'STEM',
  '30': 'Interdisciplinary',
  '40': 'STEM',
  '41': 'STEM',
  '42': 'STEM',
  '43': 'Security & Protective Services',
  '44': 'Public Service',
  '45': 'Social Science',
  '46': 'Trades',
  '47': 'Trades',
  '48': 'Manufacturing',
  '49': 'Transportation',
  '50': 'Arts',
  '51': 'Health',
  '52': 'Business',
  '54': 'History',

  // Medical Residency Programs
  '60': 'STEM',
  '61': 'STEM',
};

export default INDUSTRY_MAP;
