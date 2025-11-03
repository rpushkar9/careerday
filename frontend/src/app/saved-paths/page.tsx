'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Trash2, Eye, Download, Bookmark, BookmarkCheck } from 'lucide-react';

interface SavedPath {
  id: string;
  careerTitle: string;
  careerDescription?: string;
  salary?: string;
  growth?: string;
  socCode?: string;
  roadmapContent?: string;
  savedAt: string;
  isFavorite: boolean;
}

export default function SavedPathsPage() {
  const [user, setUser] = useState<any>(null);
  const [savedPaths, setSavedPaths] = useState<SavedPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<SavedPath | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      window.location.href = '/general-account/login';
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);

    // Load saved paths from localStorage
    const storedPaths = localStorage.getItem('savedCareerPaths');
    if (storedPaths) {
      setSavedPaths(JSON.parse(storedPaths));
    }
  }, []);

  const savePath = (careerData: any) => {
    const newPath: SavedPath = {
      id: Date.now().toString(),
      careerTitle: careerData.career_title || careerData.careerTitle,
      careerDescription: careerData.career_description || careerData.careerDescription,
      salary: careerData.salary,
      growth: careerData.growth,
      socCode: careerData.soc_code || careerData.socCode,
      roadmapContent: careerData.roadmapContent,
      savedAt: new Date().toISOString(),
      isFavorite: false,
    };

    const updatedPaths = [...savedPaths, newPath];
    setSavedPaths(updatedPaths);
    localStorage.setItem('savedCareerPaths', JSON.stringify(updatedPaths));
  };

  const deletePath = (id: string) => {
    if (confirm('Are you sure you want to remove this career path?')) {
      const updatedPaths = savedPaths.filter(path => path.id !== id);
      setSavedPaths(updatedPaths);
      localStorage.setItem('savedCareerPaths', JSON.stringify(updatedPaths));
      
      if (selectedPath?.id === id) {
        setSelectedPath(null);
      }
    }
  };

  const toggleFavorite = (id: string) => {
    const updatedPaths = savedPaths.map(path =>
      path.id === id ? { ...path, isFavorite: !path.isFavorite } : path
    );
    setSavedPaths(updatedPaths);
    localStorage.setItem('savedCareerPaths', JSON.stringify(updatedPaths));
  };

  const viewRoadmap = (path: SavedPath) => {
    const params = new URLSearchParams({
      name: user.name,
      career_title: path.careerTitle,
      career_description: path.careerDescription || '',
      salary: path.salary || 'N/A',
      growth: path.growth || 'N/A',
      soc_code: path.socCode || '',
      school: user.profile?.school || '',
      major: user.profile?.major || '',
    });
    window.location.href = `/roadmap?${params.toString()}`;
  };

  const downloadPath = (path: SavedPath) => {
    const content = `
# Career Path: ${path.careerTitle}

**Saved on:** ${new Date(path.savedAt).toLocaleDateString()}

## Career Information
- **Title:** ${path.careerTitle}
- **Description:** ${path.careerDescription || 'N/A'}
- **Salary Range:** ${path.salary || 'N/A'}
- **Growth Outlook:** ${path.growth || 'N/A'}
- **SOC Code:** ${path.socCode || 'N/A'}

## Your Roadmap
${path.roadmapContent || 'Roadmap not yet generated. Visit the roadmap page to create your personalized plan.'}
    `.trim();

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${path.careerTitle.replace(/\s+/g, '-')}-career-path.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!user) return null;

  const favoritePaths = savedPaths.filter(p => p.isFavorite);
  const regularPaths = savedPaths.filter(p => !p.isFavorite);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#6d6bd3] mb-2">Saved Career Paths</h1>
          <p className="text-xl text-gray-600">
            Your bookmarked careers and roadmaps in one place
          </p>
        </motion.div>

        {savedPaths.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12">
                <div className="text-6xl mb-6">📚</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  No Saved Paths Yet
                </h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start exploring careers and save the ones you're interested in. 
                  You can bookmark careers from your matches or the explore page!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-[#6d6bd3] hover:bg-[#5a58b8] text-white"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/explore-careers'}
                    variant="outline"
                    className="border-[#6d6bd3] text-[#6d6bd3]"
                  >
                    Explore Careers
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Sidebar - Saved Paths List */}
            <div className="lg:col-span-1 space-y-4">
              
              {/* Favorites Section */}
              {favoritePaths.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                    ⭐ Favorites
                  </h3>
                  <div className="space-y-3">
                    {favoritePaths.map((path) => (
                      <motion.div
                        key={path.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all hover:shadow-lg ${
                            selectedPath?.id === path.id ? 'ring-2 ring-[#6d6bd3] shadow-lg' : ''
                          }`}
                          onClick={() => setSelectedPath(path)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800 mb-1">
                                  {path.careerTitle}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  Saved {new Date(path.savedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(path.id);
                                }}
                                className="text-yellow-500 hover:text-yellow-600"
                              >
                                <BookmarkCheck className="w-5 h-5" />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Paths Section */}
              <div>
                <h3 className="text-lg font-bold text-gray-700 mb-3">
                  All Saved Paths ({regularPaths.length})
                </h3>
                <div className="space-y-3">
                  {regularPaths.map((path) => (
                    <motion.div
                      key={path.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-lg ${
                          selectedPath?.id === path.id ? 'ring-2 ring-[#6d6bd3] shadow-lg' : ''
                        }`}
                        onClick={() => setSelectedPath(path)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 mb-1">
                                {path.careerTitle}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Saved {new Date(path.savedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(path.id);
                              }}
                              className="text-gray-400 hover:text-yellow-500"
                            >
                              <Bookmark className="w-5 h-5" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Path Details */}
            <div className="lg:col-span-2">
              {selectedPath ? (
                <motion.div
                  key={selectedPath.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="shadow-xl">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-3xl text-[#6d6bd3] mb-2">
                            {selectedPath.careerTitle}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            Saved on {new Date(selectedPath.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {selectedPath.isFavorite && (
                          <span className="text-2xl">⭐</span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      
                      {/* Career Details */}
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedPath.salary && (
                          <div className="bg-green-50 rounded-lg p-4">
                            <div className="text-sm text-green-700 font-medium mb-1">
                              💰 Salary Range
                            </div>
                            <div className="text-lg font-bold text-green-900">
                              {selectedPath.salary}
                            </div>
                          </div>
                        )}
                        
                        {selectedPath.growth && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-sm text-blue-700 font-medium mb-1">
                              📈 Job Growth
                            </div>
                            <div className="text-lg font-bold text-blue-900">
                              {selectedPath.growth}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Description */}
                      {selectedPath.careerDescription && (
                        <div>
                          <h3 className="font-bold text-gray-800 mb-2">About This Career</h3>
                          <p className="text-gray-600 leading-relaxed">
                            {selectedPath.careerDescription}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <Button
                          onClick={() => viewRoadmap(selectedPath)}
                          className="bg-[#6d6bd3] hover:bg-[#5a58b8] text-white flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Roadmap
                        </Button>
                        
                        <Button
                          onClick={() => downloadPath(selectedPath)}
                          variant="outline"
                          className="border-[#6d6bd3] text-[#6d6bd3] flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </Button>

                        <Button
                          onClick={() => toggleFavorite(selectedPath.id)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          {selectedPath.isFavorite ? (
                            <>
                              <BookmarkCheck className="w-4 h-4" />
                              Remove from Favorites
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-4 h-4" />
                              Add to Favorites
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={() => deletePath(selectedPath.id)}
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </Button>
                      </div>

                      {/* Roadmap Preview */}
                      {selectedPath.roadmapContent && (
                        <div className="mt-6">
                          <h3 className="font-bold text-gray-800 mb-3">Roadmap Preview</h3>
                          <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-700">
                            <pre className="whitespace-pre-wrap font-sans">
                              {selectedPath.roadmapContent.substring(0, 500)}...
                            </pre>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                /* No Selection State */
                <Card className="shadow-xl">
                  <CardContent className="py-20 text-center">
                    <div className="text-6xl mb-4">👈</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Select a Career Path
                    </h3>
                    <p className="text-gray-600">
                      Click on a saved path from the list to view details
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => window.location.href = '/dashboard'}
            variant="outline"
            className="border-gray-300 text-gray-700"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}