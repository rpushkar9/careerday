const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    console.log('Profile update request:', req.body);

    const { userId, school, major, year, gender, firstGen, interests, skills, careerGoals } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find and update user
    const user = await User.findByIdAndUpdate(
      userId,
      {
        school,
        major,
        year,
        gender,
        firstGen,
        interests,
        skills,
        careerGoals
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Profile updated for:', user.email);

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        school: user.school,
        major: user.major,
        year: user.year,
        gender: user.gender,
        firstGen: user.firstGen,
        interests: user.interests,
        skills: user.skills,
        careerGoals: user.careerGoals
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      message: 'Server error updating profile',
      error: error.message 
    });
  }
});

// Get career matches based on profile
router.post('/career-matches', async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Simple career matching logic based on major and interests
    const careerMatches = generateCareerMatches(user);

    res.status(200).json({
      message: 'Career matches generated',
      matches: careerMatches
    });

  } catch (error) {
    console.error('Career matching error:', error);
    res.status(500).json({ 
      message: 'Server error generating career matches',
      error: error.message 
    });
  }
});

// Career matching algorithm
function generateCareerMatches(user) {
  const { major, interests, skills, careerGoals } = user;
  
  // Convert to lowercase for matching
  const majorLower = major?.toLowerCase() || '';
  const interestsLower = interests?.toLowerCase() || '';
  const skillsLower = skills?.toLowerCase() || '';
  const goalsLower = careerGoals?.toLowerCase() || '';

  const allCareerData = [
    // Tech careers
    {
      title: 'Software Engineer',
      description: 'Design, develop, and maintain software applications and systems.',
      avgSalary: '$120,000',
      growth: 'High',
      skills: ['Programming', 'Problem-solving', 'Teamwork'],
      keywords: ['computer science', 'coding', 'programming', 'tech', 'software', 'development']
    },
    {
      title: 'UX/UI Designer',
      description: 'Create user-friendly interfaces and enhance user experience for digital products.',
      avgSalary: '$95,000',
      growth: 'High',
      skills: ['Design', 'Creativity', 'User research'],
      keywords: ['design', 'creative', 'user experience', 'interface', 'visual', 'art']
    },
    {
      title: 'Data Scientist',
      description: 'Analyze complex data to help companies make better decisions.',
      avgSalary: '$130,000',
      growth: 'Very High',
      skills: ['Statistics', 'Programming', 'Critical thinking'],
      keywords: ['data', 'analytics', 'statistics', 'math', 'analysis', 'science']
    },
    {
      title: 'Product Manager',
      description: 'Lead product development and strategy from concept to launch.',
      avgSalary: '$140,000',
      growth: 'High',
      skills: ['Leadership', 'Communication', 'Strategy'],
      keywords: ['business', 'management', 'leadership', 'strategy', 'product']
    },
    // Healthcare careers
    {
      title: 'Healthcare Administrator',
      description: 'Manage healthcare facilities and ensure quality patient care.',
      avgSalary: '$105,000',
      growth: 'High',
      skills: ['Organization', 'Leadership', 'Healthcare knowledge'],
      keywords: ['healthcare', 'medical', 'health', 'hospital', 'nursing']
    },
    {
      title: 'Nurse Practitioner',
      description: 'Provide advanced nursing care and diagnose/treat patients.',
      avgSalary: '$115,000',
      growth: 'Very High',
      skills: ['Medical knowledge', 'Compassion', 'Critical thinking'],
      keywords: ['nursing', 'healthcare', 'medical', 'health', 'patient care']
    },
    // Business careers
    {
      title: 'Marketing Manager',
      description: 'Develop and execute marketing strategies to promote products/services.',
      avgSalary: '$110,000',
      growth: 'Medium',
      skills: ['Creativity', 'Communication', 'Analytics'],
      keywords: ['marketing', 'business', 'advertising', 'communication', 'creative']
    },
    {
      title: 'Financial Analyst',
      description: 'Analyze financial data to guide business investment decisions.',
      avgSalary: '$85,000',
      growth: 'Medium',
      skills: ['Finance', 'Analytics', 'Attention to detail'],
      keywords: ['finance', 'accounting', 'business', 'economics', 'numbers']
    },
    // Education careers
    {
      title: 'Education Technology Specialist',
      description: 'Integrate technology into educational settings to enhance learning.',
      avgSalary: '$70,000',
      growth: 'High',
      skills: ['Teaching', 'Technology', 'Communication'],
      keywords: ['education', 'teaching', 'technology', 'learning']
    },
    // Creative careers
    {
      title: 'Content Strategist',
      description: 'Plan and create engaging content for digital platforms.',
      avgSalary: '$75,000',
      growth: 'Medium',
      skills: ['Writing', 'Creativity', 'Strategy'],
      keywords: ['writing', 'content', 'creative', 'communication', 'english']
    },
  ];

  // Score each career based on profile match
  const scoredCareers = allCareerData.map(career => {
    let score = 0;
    
    career.keywords.forEach(keyword => {
      if (majorLower.includes(keyword)) score += 3;
      if (interestsLower.includes(keyword)) score += 2;
      if (skillsLower.includes(keyword)) score += 2;
      if (goalsLower.includes(keyword)) score += 1;
    });

    return { ...career, score };
  });

  // Sort by score and return top 3
  const topMatches = scoredCareers
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score, keywords, ...career }) => career); // Remove score and keywords from final result

  return topMatches;
}

module.exports = router;