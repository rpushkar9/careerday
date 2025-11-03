'use client';

import { useState, useEffect } from 'react';
import Filters from '@/components/explore-careers/Filters';
import QuizBanner from '@/components/explore-careers/QuizBanner';
import CareerCard from '@/components/explore-careers/CareerCard';
import CareerCardSkeleton from '@/components/explore-careers/CareerCardSkeleton';
import SearchBar from '@/components/explore-careers/SearchBar';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5001';

interface FilterState {
  educationLevel: string;
  minSalary: number | null;
  industry: string;
  major: string;
}

interface Career {
  title: string;
  description: string;
  majors: string[];
  income: string;
  education: string;
  soc_code: string;
  growth: string;
  employment: string;
}

export default function CareerDatabasePage() {
  const [search, setSearch] = useState('');
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
    educationLevel: '',
    minSalary: null,
    industry: '',
    major: '',
  });

  const ITEMS_PER_PAGE = 20;

  // Fetch careers from the API
  const fetchCareers = async (append: boolean = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setCareers([]);
      setOffset(0);
    }

    setError(null);

    try {
      const currentOffset = append ? offset : 0;
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: currentOffset.toString(),
      });

      if (filters.educationLevel) {
        params.append('education_level', filters.educationLevel);
      }

      if (filters.minSalary) {
        params.append('min_salary', filters.minSalary.toString());
      }

      const response = await fetch(`${API_BASE_URL}/api/all-careers?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const transformedCareers: Career[] =
        data.careers?.map((career: any) => ({
          title: career.title || 'Unknown Title',
          description: career.description || 'No description available',
          majors: career.related_majors || ['General'],
          income: career.median_wage || 'N/A',
          education: career.education_level || "Bachelor's degree",
          soc_code: career.soc_code || '',
          growth: career.employment_growth || 'N/A',
          employment: career.employment_2023 || 'N/A',
        })) || [];

      if (append) {
        setCareers(prev => [...prev, ...transformedCareers]);
        setOffset(currentOffset + ITEMS_PER_PAGE);
      } else {
        setCareers(transformedCareers);
        setOffset(ITEMS_PER_PAGE);
      }

      setHasMore(data.has_more || false);
      setTotalCount(data.filtered_count || 0);

      console.log(
        `✓ Loaded ${transformedCareers.length} careers (total: ${data.filtered_count})`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Error fetching careers:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load and filter changes
  useEffect(() => {
    fetchCareers(false);
  }, [filters.educationLevel, filters.minSalary]);

  const handleFilterChange = (newFilters: FilterState) => {
    console.log('🎛️ Filters changed:', newFilters);
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    fetchCareers(true);
  };

  // Industry keyword mappings for better matching
  const industryKeywords: { [key: string]: string[] } = {
    finance: [
      'financial',
      'accountant',
      'banking',
      'investment',
      'economist',
      'actuary',
      'budget',
      'credit',
      'loan',
      'insurance',
      'auditor',
    ],
    healthcare: [
      'health',
      'medical',
      'nurse',
      'doctor',
      'physician',
      'therapist',
      'clinical',
      'hospital',
      'patient',
      'pharmaceutical',
      'dental',
      'surgeon',
    ],
    technology: [
      'software',
      'computer',
      'developer',
      'programmer',
      'data',
      'IT',
      'tech',
      'engineer',
      'analyst',
      'web',
      'cyber',
      'network',
      'database',
    ],
    education: [
      'teacher',
      'professor',
      'instructor',
      'education',
      'school',
      'academic',
      'tutor',
      'educator',
      'curriculum',
      'principal',
    ],
    engineering: [
      'engineer',
      'mechanical',
      'civil',
      'electrical',
      'chemical',
      'architect',
      'construction',
      'design',
      'manufacturing',
    ],
    business: [
      'business',
      'manager',
      'management',
      'marketing',
      'sales',
      'executive',
      'consultant',
      'entrepreneur',
      'operations',
      'human resources',
      'hr',
    ],
  };

  // Client-side filtering for search, industry, and major
  const filteredCareers = careers.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.majors.some(m => m.toLowerCase().includes(search.toLowerCase()));

    // Improved industry matching
    const matchesIndustry =
      !filters.industry ||
      (() => {
        const careerText = `${c.title} ${c.description}`.toLowerCase();
        const keywords = industryKeywords[filters.industry] || [];
        return keywords.some(keyword => careerText.includes(keyword));
      })();

    const matchesMajor =
      !filters.major ||
      c.majors.some(m => m.toLowerCase().includes(filters.major.toLowerCase()));

    return matchesSearch && matchesIndustry && matchesMajor;
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 py-16 px-6 md:px-16">
      {/* Header */}
      <section className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold md:text-6xl tracking-tight"
        >
          Explore <span className="text-[#6d6bd3]">Careers</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-3xl mx-auto text-lg text-slate-600"
        >
          Discover your perfect career path, compare salaries, and explore
          educational requirements to design your future with confidence.
        </motion.p>
      </section>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-12">
        <SearchBar search={search} setSearch={setSearch} />
      </div>

      {/* Quiz Banner */}
      <div className="my-10 max-w-4xl mx-auto">
        <QuizBanner />
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-10 max-w-6xl mx-auto">
        {/* Sidebar Filters */}
        <aside className="md:w-1/4 bg-white rounded-2xl p-6 shadow-md sticky top-24 h-fit">
          <Filters onFilterChange={handleFilterChange} />
        </aside>

        {/* Career Cards */}
        <section className="flex-1 flex flex-col gap-6">
          {/* Loading State */}
          {loading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <CareerCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-800 font-medium">Error loading careers</p>
              <p className="text-red-600 text-sm mt-2">{error}</p>
              <button
                onClick={() => fetchCareers(false)}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="bg-slate-50 rounded-2xl p-12 text-center">
              <p className="text-slate-600 text-lg">
                No careers match your filters
              </p>
              <p className="text-slate-500 text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              {/* Career Count */}
              <div className="flex justify-between items-center text-sm text-slate-600 mb-2">
                <span>
                  Showing{' '}
                  <span className="font-semibold">
                    {filteredCareers.length}
                  </span>{' '}
                  of <span className="font-semibold">{totalCount}</span> careers
                </span>
              </div>

              {/* Career Cards */}
              {filteredCareers.map((career, i) => (
                <motion.div
                  key={career.soc_code || i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.2) }}
                >
                  <CareerCard {...career} />
                </motion.div>
              ))}

              {/* Load More Button */}
              {hasMore && !search && !filters.industry && !filters.major && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-8 py-4 bg-[#6d6bd3] text-white rounded-full font-medium shadow-lg hover:bg-[#5b59c0] transition-all duration-300 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Loading More...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Careers</span>
                        <ArrowDown className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Loading More Skeletons */}
              {loadingMore && (
                <div className="space-y-6 mt-6">
                  {[...Array(3)].map((_, i) => (
                    <CareerCardSkeleton key={`loading-${i}`} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
