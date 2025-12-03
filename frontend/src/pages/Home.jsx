import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Sparkles, Loader, Save, Check } from 'lucide-react';
import ChatPrompt from '../components/ChatPrompt';
import CoursePreview from '../components/CoursePreview';
import LessonRenderer from '../components/LessonRenderer';
import { saveCourse } from '../utils/api';
import './Home.css';

const Home = ({
  activeCourse,
  activeLesson,
  onCourseGenerated,
  onSaveCourse,
  onSelectLesson,
  onBackToCourse,
  onNewCourse,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const prevLessonIdRef = useRef(null);

  // 🔧 STEP 1: Disable browser scroll restoration on mount
  useEffect(() => {
    console.log('🔧 STEP 1: Disabling browser scroll restoration');
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
      console.log('✅ STEP 1: Scroll restoration set to manual');
    }
  }, []);

  const handleAIResponse = (generatedCourse) => {
    console.log('Course generated:', generatedCourse);
    onCourseGenerated(generatedCourse);
    setIsGenerating(false);
    setSaved(false);
  };

  const handleSaveCourse = async () => {
    if (!isAuthenticated) {
      alert('Please login to save courses');
      return;
    }

    if (!activeCourse) return;

    try {
      const token = await getAccessTokenSilently();
      await saveCourse(activeCourse, token);
      onSaveCourse(activeCourse);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save course:', err);
      alert('Failed to save course');
    }
  };

  // 🔧 Helper: Get total lessons
  const getTotalLessons = () => {
    if (!activeCourse || !activeCourse.modules) return 0;
    return activeCourse.modules.reduce((total, module) => {
      return total + (module.lessons?.length || 0);
    }, 0);
  };

  // 🔧 Helper: Get current lesson index
  const getCurrentLessonIndex = () => {
    if (!activeLesson || !activeCourse || !activeCourse.modules) return 0;

    let currentIndex = 0;
    for (let modIdx = 0; modIdx < activeCourse.modules.length; modIdx++) {
      const module = activeCourse.modules[modIdx];
      if (!module.lessons) continue;

      for (let lesIdx = 0; lesIdx < module.lessons.length; lesIdx++) {
        const lessonId = module.lessons[lesIdx]._id;
        const activeLessonId = activeLesson.lesson?._id || activeLesson._id;
        
        if (lessonId === activeLessonId) {
          return currentIndex;
        }
        currentIndex++;
      }
    }
    return 0;
  };

  // 🔧 Helper: Get lesson by index
  const getLessonByIndex = (globalIndex) => {
    if (!activeCourse || !activeCourse.modules) return null;

    let currentIndex = 0;
    for (let modIdx = 0; modIdx < activeCourse.modules.length; modIdx++) {
      const module = activeCourse.modules[modIdx];
      if (!module.lessons) continue;

      for (let lesIdx = 0; lesIdx < module.lessons.length; lesIdx++) {
        if (currentIndex === globalIndex) {
          return {
            lesson: module.lessons[lesIdx],
            module: module,
            lessonIdx: lesIdx,
            moduleIdx: modIdx,
          };
        }
        currentIndex++;
      }
    }
    return null;
  };

  // 🔧 STEP 2: Triple verification scroll function
  const resetScrollToTop = (source) => {
    console.log(`\n🔧 STEP 2: Resetting scroll to top from ${source}`);
    
    // Verification 1: Immediate scroll
    window.scrollTo(0, 0);
    const check1 = window.scrollY;
    console.log(`   ✓ Check 1 - Immediate scroll. scrollY = ${check1}`);

    // Verification 2: DOM level scroll
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const check2 = document.documentElement.scrollTop;
    console.log(`   ✓ Check 2 - DOM scroll. scrollTop = ${check2}`);

    // Verification 3: Delayed scroll (after render)
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      const check3 = window.scrollY;
      console.log(`   ✓ Check 3 - Delayed scroll. scrollY = ${check3}`);
    }, 0);

    return true;
  };

  // 🔧 STEP 3: Monitor lesson changes and verify scroll
  useEffect(() => {
    const currentLessonId = activeLesson?.lesson?._id || activeLesson?._id;
    
    if (currentLessonId && currentLessonId !== prevLessonIdRef.current) {
      console.log(`\n🔧 STEP 3: Lesson ID changed`);
      console.log(`   Previous: ${prevLessonIdRef.current}`);
      console.log(`   Current: ${currentLessonId}`);
      
      prevLessonIdRef.current = currentLessonId;
      resetScrollToTop('useEffect');

      // Verify scroll after component renders
      setTimeout(() => {
        const finalScroll = window.scrollY;
        console.log(`   ✅ Final verification - scrollY = ${finalScroll}`);
      }, 100);
    }
  }, [activeLesson?.lesson?._id, activeLesson?._id]);

  // Handle lesson selection from CoursePreview
  const handleLessonSelection = (lessonData) => {
    console.log('\n📍 CoursePreview: Lesson selection triggered');
    resetScrollToTop('CoursePreview');
    
    if (lessonData && lessonData.lesson) {
      onSelectLesson(lessonData);
    }
  };

  // Handle previous lesson
  const handlePreviousLesson = () => {
    console.log('\n📍 Previous button: Clicked');
    resetScrollToTop('PreviousButton');
    
    const currentIndex = getCurrentLessonIndex();

    if (currentIndex > 0) {
      const previousLesson = getLessonByIndex(currentIndex - 1);
      
      if (previousLesson) {
        onSelectLesson(previousLesson);
      }
    }
  };

  // Handle next lesson
  const handleNextLesson = () => {
    console.log('\n📍 Next button: Clicked');
    resetScrollToTop('NextButton');
    
    const currentIndex = getCurrentLessonIndex();
    const totalLessons = getTotalLessons();

    if (currentIndex < totalLessons - 1) {
      const nextLesson = getLessonByIndex(currentIndex + 1);
      
      if (nextLesson) {
        onSelectLesson(nextLesson);
      }
    }
  };

  // Show lesson content
  if (activeLesson) {
    const currentIndex = getCurrentLessonIndex();
    const totalLessons = getTotalLessons();

    return (
      <div className="home-lesson-view">
        <LessonRenderer
          key={`lesson-${activeLesson.lesson?._id || activeLesson._id}`}
          lesson={activeLesson.lesson || activeLesson}
          module={activeLesson.module}
          course={activeCourse}
          moduleIdx={activeLesson.moduleIdx || 0}
          lessonIdx={currentIndex}
          totalLessons={totalLessons}
          onBack={onBackToCourse}
          onPrevious={handlePreviousLesson}
          onNext={handleNextLesson}
        />
      </div>
    );
  }

  // Show course preview
  if (activeCourse) {
    return (
      <div className="home-course-view">
        <div className="course-actions">
          <button onClick={onNewCourse} className="new-course-action-btn">
            ✕ New Course
          </button>
          {isAuthenticated && (
            <button
              onClick={handleSaveCourse}
              className="save-course-btn"
              disabled={saved}
            >
              {saved ? (
                <>
                  <Check size={18} />
                  Saved!
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Course
                </>
              )}
            </button>
          )}
        </div>
        <CoursePreview
          course={activeCourse}
          onLessonSelect={handleLessonSelection}
        />
      </div>
    );
  }

  // Show home page
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-badge">
          <Sparkles size={16} />
          <span>AI-Powered Learning</span>
        </div>
        <h1 className="home-title">Generate Your Perfect Course</h1>
        <p className="home-subtitle">
          Describe what you want to learn, and our AI creates a structured course with modules and lessons.
        </p>
      </header>

      <section className="home-prompt-section">
        <ChatPrompt
          onResponse={handleAIResponse}
          onGenerationStart={() => setIsGenerating(true)}
          onError={(err) => setError(err)}
          isGenerating={isGenerating}
        />
      </section>

      {isGenerating && (
        <div className="home-loading">
          <Loader size={48} className="spinner" />
          <h3>Creating Your Course</h3>
          <p>Generating modules, lessons, and content...</p>
        </div>
      )}

      {error && (
        <div className="home-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {!isGenerating && !error && (
        <div className="home-empty-state">
          <Sparkles size={64} />
          <h2>Ready to Learn Something New?</h2>
          <p>Enter a topic above to generate your personalized course</p>
        </div>
      )}
    </div>
  );
};

export default Home;




