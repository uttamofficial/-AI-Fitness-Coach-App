import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Sun, Moon, Dumbbell, HeartPulse, User, Cake, Target, Zap, MapPin, Soup, Info, Weight, Ruler, ChevronsUpDown,
  Loader, AlertTriangle, Brain, Salad, Apple, Fish, Beef, CheckSquare, Sparkles, Wand2,
  Volume2, Play, StopCircle, Coffee,
  X, // For Modal
  Trash2 // For Clear Plan
} from 'lucide-react';

// Environment: read Google API key from Vite env. Set VITE_GOOGLE_API_KEY in your local `.env`.
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

// --- LOCAL STORAGE HELPERS (Chapter 7) ---
const useStickyState = (defaultValue, key) => {
  const [value, setValue] = useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    try {
      return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
    } catch (e) {
      console.error("Failed to parse local storage key", key, e);
      return defaultValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// --- OPTIMIZED HELPER COMPONENTS ---

const FormInput = ({ id, label, type = 'text', value, onChange, icon: Icon, placeholder, darkMode }) => (
  <div className="space-y-2.5">
    <label htmlFor={id} className={`block text-base font-semibold transition-colors duration-300 ${
      darkMode ? 'text-slate-300' : 'text-blue-900'
    }`}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Icon className={`w-5 h-5 transition-colors duration-300 ${
          darkMode ? 'text-indigo-400' : 'text-blue-600'
        }`} />
      </div>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-4 border rounded-xl text-base shadow-sm focus:outline-none focus:ring-2 transition-all ${
          darkMode 
            ? 'border-slate-700/50 bg-slate-800/30 text-white placeholder-slate-500 focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-slate-600/50' 
            : 'border-blue-200/50 bg-white/50 text-slate-900 placeholder-blue-400/50 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-300/50'
        } backdrop-blur-sm`}
      />
    </div>
  </div>
);

const FormSelect = ({ id, label, value, onChange, icon: Icon, options, darkMode }) => (
  <div className="space-y-2.5">
    <label htmlFor={id} className={`block text-base font-semibold transition-colors duration-300 ${
      darkMode ? 'text-slate-300' : 'text-blue-900'
    }`}>
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
        <Icon className={`w-5 h-5 transition-colors duration-300 ${
          darkMode ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-blue-600 group-hover:text-blue-700'
        }`} />
      </div>
      <select
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`w-full pl-12 pr-12 py-4 border rounded-xl text-base shadow-sm focus:outline-none focus:ring-2 appearance-none transition-all cursor-pointer ${
          darkMode 
            ? 'border-slate-700/50 bg-slate-800/30 text-white focus:ring-indigo-500/50 focus:border-indigo-500/50 hover:border-slate-600/50 hover:bg-slate-800/40' 
            : 'border-blue-200/50 bg-white/50 text-slate-900 focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-300/50 hover:bg-blue-50/50'
        } backdrop-blur-sm`}
        style={{
          backgroundImage: 'none'
        }}
      >
        {options.map((option) => (
          <option key={option} value={option} className={darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>{option}</option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <ChevronsUpDown className={`w-5 h-5 transition-colors duration-300 ${
          darkMode ? 'text-indigo-400 group-hover:text-indigo-300' : 'text-blue-600 group-hover:text-blue-700'
        }`} />
      </div>
      {/* Gradient border on hover */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${
        darkMode ? 'from-indigo-500/0 via-indigo-500/20 to-indigo-500/0' : 'from-blue-500/0 via-blue-500/20 to-blue-500/0'
      }`}></div>
    </div>
  </div>
);

// --- OPTIMIZED PLAN DISPLAY COMPONENTS ---

const WorkoutPlan = ({ plan, onExerciseClick, onPlayAudio, isSpeaking, currentlyPlaying, darkMode }) => {
  // Add safety checks for the plan data
  if (!plan || !plan.daily_routine || !Array.isArray(plan.daily_routine)) {
    return (
      <div className="text-center p-8 text-red-500">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>Invalid workout plan data. Please regenerate your plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plan.daily_routine.map((day) => (
        <div key={day.day} className={`group relative backdrop-blur-xl p-5 rounded-2xl border shadow-lg transition-all duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-900/40 to-slate-800/20 border-slate-700/50 hover:border-indigo-500/50 hover:shadow-indigo-500/20' 
            : 'bg-gradient-to-br from-white/80 to-blue-50/60 border-blue-200/50 hover:border-blue-400/50 hover:shadow-blue-500/20'
        }`}>
          {/* Animated gradient overlay */}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            darkMode 
              ? 'bg-gradient-to-r from-indigo-500/0 via-purple-500/5 to-indigo-500/0' 
              : 'bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0'
          }`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`relative p-2.5 rounded-xl shadow-lg ${
                  darkMode 
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30' 
                    : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/30'
                }`}>
                  <Dumbbell className="w-5 h-5 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                </div>
                <div>
                  <h4 className={`font-bold text-lg ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>{day.day}</h4>
                  <p className={`text-sm font-medium ${
                    darkMode ? 'text-indigo-400' : 'text-blue-700'
                  }`}>{day.focus}</p>
                </div>
              </div>
              <button
                onClick={() => onPlayAudio(day.day, `Workout for ${day.day}: ${day.focus}. ${day.exercises?.map(ex => `${ex.name}: ${ex.sets} sets of ${ex.reps}`).join('. ') || ''}`)}
                className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700/50 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-300' 
                    : 'bg-blue-50/50 border-blue-200/50 text-blue-700 hover:bg-blue-100/50 hover:border-blue-400/50 hover:text-blue-800'
                }`}
                aria-label={`Read ${day.day} workout`}
              >
                {isSpeaking && currentlyPlaying === day.day ? 
                  <StopCircle className="w-5 h-5" /> : 
                  <Play className="w-5 h-5" />
                }
              </button>
            </div>
            <div className="grid gap-2">
              {(day.exercises || []).map((ex, idx) => (
                <div 
                  key={ex.name}
                  className={`flex items-center justify-between p-3.5 backdrop-blur-sm rounded-xl border cursor-pointer hover:shadow-lg transition-all duration-300 group/item ${
                    darkMode 
                      ? 'bg-slate-900/30 border-slate-700/30 hover:border-indigo-500/50 hover:bg-slate-800/40' 
                      : 'bg-white/60 border-blue-200/30 hover:border-blue-400/50 hover:bg-blue-50/60'
                  }`}
                  onClick={() => onExerciseClick(ex.name, "A clear, high-quality, realistic photo of a person performing a " + ex.name)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-indigo-400 border-slate-600/50 group-hover/item:from-indigo-500 group-hover/item:to-purple-600 group-hover/item:text-white' 
                        : 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 border-blue-300/50 group-hover/item:from-blue-600 group-hover/item:to-indigo-700 group-hover/item:text-white'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-sm block truncate ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>{ex.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-md border ${
                          darkMode 
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
                            : 'bg-indigo-100/80 text-indigo-800 border-indigo-300/50'
                        }`}>{ex.sets} sets</span>
                        <span className={`text-xs px-2 py-0.5 rounded-md border ${
                          darkMode 
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                            : 'bg-purple-100/80 text-purple-800 border-purple-300/50'
                        }`}>{ex.reps}</span>
                        <span className={`text-xs ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>{ex.rest} rest</span>
                      </div>
                    </div>
                  </div>
                  <Wand2 className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ${
                    darkMode ? 'text-indigo-400' : 'text-blue-600'
                  }`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const getMealIcon = (mealType) => {
  const icons = {
    breakfast: { Icon: Coffee, color: 'text-amber-500' },
    lunch: { Icon: Salad, color: 'text-green-500' },
    dinner: { Icon: Fish, color: 'text-blue-500' },
    snacks: { Icon: Apple, color: 'text-red-500' }
  };
  return icons[mealType] || { Icon: Beef, color: 'text-slate-500' };
};

const DietPlan = ({ plan, onMealClick, onPlayAudio, isSpeaking, currentlyPlaying, darkMode }) => {
  // Add safety checks for the plan data
  if (!plan || !plan.meal_plan || !Array.isArray(plan.meal_plan)) {
    return (
      <div className="text-center p-8 text-red-500">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>Invalid diet plan data. Please regenerate your plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {plan.meal_plan.map((mealDay) => (
        <div key={mealDay.day} className={`group relative backdrop-blur-xl p-5 rounded-2xl border shadow-lg transition-all duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-900/40 to-slate-800/20 border-slate-700/50 hover:border-green-500/50 hover:shadow-green-500/20' 
            : 'bg-gradient-to-br from-white/80 to-green-50/60 border-green-200/50 hover:border-green-400/50 hover:shadow-green-500/20'
        }`}>
          {/* Animated gradient overlay */}
          <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
            darkMode 
              ? 'bg-gradient-to-r from-green-500/0 via-emerald-500/5 to-green-500/0' 
              : 'bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0'
          }`}></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`relative p-2.5 rounded-xl shadow-lg ${
                  darkMode 
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30' 
                    : 'bg-gradient-to-br from-green-600 to-emerald-700 shadow-green-500/30'
                }`}>
                  <Soup className="w-5 h-5 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                </div>
                <h4 className={`font-bold text-lg ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>{mealDay.day}</h4>
              </div>
              <button
                onClick={() => onPlayAudio(mealDay.day, `Diet for ${mealDay.day}: ${Object.entries(mealDay.meals || {}).map(([type, meal]) => `${type}: ${meal?.name || 'Unknown'}.`).join(' ')}`)}
                className={`p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                  darkMode 
                    ? 'bg-slate-800/50 border-slate-700/50 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-300' 
                    : 'bg-green-50/50 border-green-200/50 text-green-700 hover:bg-green-100/50 hover:border-green-400/50 hover:text-green-800'
                }`}
                aria-label={`Read ${mealDay.day} diet`}
              >
                {isSpeaking && currentlyPlaying === mealDay.day ? 
                  <StopCircle className="w-5 h-5" /> : 
                  <Play className="w-5 h-5" />
                }
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(mealDay.meals || {}).map(([mealType, meal]) => {
                const { Icon, color } = getMealIcon(mealType);
                return (
                  <div 
                    key={mealType} 
                    className={`flex items-start gap-3 p-3.5 backdrop-blur-sm rounded-xl border cursor-pointer hover:shadow-lg transition-all duration-300 group/item ${
                      darkMode 
                        ? 'bg-slate-900/30 border-slate-700/30 hover:border-green-500/50 hover:bg-slate-800/40' 
                        : 'bg-white/60 border-green-200/30 hover:border-green-400/50 hover:bg-green-50/60'
                    }`}
                    onClick={() => onMealClick(meal.name, "A delicious, high-resolution, food-photography style photo of " + meal.name)}
                  >
                    <div className={`p-2 rounded-lg group-hover/item:scale-110 transition-transform duration-300 ${
                      darkMode ? 'bg-slate-800/50' : 'bg-slate-100/80'
                    }`}>
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-bold text-sm capitalize mb-0.5 ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>{mealType}</h5>
                      <p className={`text-xs font-medium truncate mb-1 ${
                        darkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}>{meal.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-md border ${
                          darkMode 
                            ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                            : 'bg-green-100/80 text-green-800 border-green-300/50'
                        }`}>{meal.calories} cal</span>
                      </div>
                    </div>
                    <Wand2 className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};const AiTips = ({ tips, darkMode }) => {
  // Add safety checks for tips data
  if (!tips) {
    return (
      <div className="text-center p-8 text-red-500">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>AI tips data not available. Please regenerate your plan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className={`relative backdrop-blur-xl p-6 rounded-2xl border shadow-lg ${
        darkMode 
          ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/20 border-blue-500/30 shadow-blue-500/10' 
          : 'bg-gradient-to-br from-white/80 to-blue-50/60 border-blue-200/50 shadow-blue-500/10'
      }`}>
        <div className={`absolute inset-0 rounded-2xl ${
          darkMode 
            ? 'bg-gradient-to-r from-blue-500/5 via-indigo-500/10 to-blue-500/5' 
            : 'bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-blue-500/5'
        }`}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`relative p-2.5 rounded-xl shadow-lg ${
              darkMode 
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/30' 
                : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/30'
            }`}>
              <Brain className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
            </div>
            <h4 className={`font-bold text-xl ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>Lifestyle & Wellness Tips</h4>
          </div>
          <div className="grid gap-2">
            {(tips.lifestyle_tips || []).map((tip, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-slate-900/30 border-slate-700/30 hover:border-blue-500/50' 
                  : 'bg-white/60 border-blue-200/30 hover:border-blue-400/50'
              }`}>
                <div className={`flex items-center justify-center w-6 h-6 rounded-lg text-white font-bold text-xs flex-shrink-0 mt-0.5 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600' 
                    : 'bg-gradient-to-br from-blue-600 to-indigo-700'
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm leading-relaxed ${
                  darkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={`relative backdrop-blur-xl p-6 rounded-2xl border shadow-lg ${
        darkMode 
          ? 'bg-gradient-to-br from-amber-900/40 to-orange-900/20 border-amber-500/30 shadow-amber-500/10' 
          : 'bg-gradient-to-br from-white/80 to-amber-50/60 border-amber-200/50 shadow-amber-500/10'
      }`}>
        <div className={`absolute inset-0 rounded-2xl ${
          darkMode 
            ? 'bg-gradient-to-r from-amber-500/5 via-orange-500/10 to-amber-500/5' 
            : 'bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5'
        }`}></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`relative p-2.5 rounded-xl shadow-lg ${
              darkMode 
                ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30' 
                : 'bg-gradient-to-br from-amber-600 to-orange-700 shadow-amber-500/30'
            }`}>
              <Sparkles className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
            </div>
            <h4 className={`font-bold text-xl ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>Your Daily Motivation</h4>
          </div>
          <p className={`italic text-base leading-relaxed pl-3 border-l-4 ${
            darkMode 
              ? 'text-slate-200 border-amber-500/50' 
              : 'text-slate-800 border-amber-500/60'
          }`}>"{tips.motivation || 'Stay motivated and consistent with your fitness journey!'}"</p>
        </div>
      </div>
    </div>
    );
  };

const PlanDisplay = ({ plan, onRegenerate, onClearPlan, onActionItemClick, onPlayAudio, isSpeaking, currentlyPlaying, darkMode }) => {
  const [activeTab, setActiveTab] = useState('workout');

  // Add safety checks for plan data
  if (!plan) {
    return (
      <div className="text-center p-8 text-red-500">
        <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
        <p>No plan data available. Please generate your plan.</p>
      </div>
    );
  }

  const readFullPlan = () => {
    const workoutText = plan.workout_plan?.daily_routine ? 
      `Here is your workout plan. ${plan.workout_plan.daily_routine.map(day => `${day.day}, ${day.focus}: ${(day.exercises || []).map(ex => ex.name).join(', ')}`).join('. ')}` :
      'Workout plan not available.';
    
    const dietText = plan.diet_plan?.meal_plan ?
      `Here is your diet plan. ${plan.diet_plan.meal_plan.map(day => `${day.day}: ${Object.entries(day.meals || {}).map(([type, meal]) => `${type}: ${meal?.name || 'Unknown'}`).join(', ')}`).join('. ')}` :
      'Diet plan not available.';
    
    let textToRead = "";
    if (activeTab === 'workout') textToRead = workoutText;
    else if (activeTab === 'diet') textToRead = dietText;
    else textToRead = plan.ai_tips ? `Here are your AI tips. ${(plan.ai_tips.lifestyle_tips || []).join('. ')}. And for motivation: ${plan.ai_tips.motivation || 'Stay motivated!'}` : 'AI tips not available.';
    
    onPlayAudio('fullPlan', textToRead);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <h2 className={`text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent ${
          darkMode 
            ? 'from-indigo-400 to-purple-400' 
            : 'from-blue-600 to-indigo-600'
        }`}>Your AI-Generated Plan</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={readFullPlan}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-green-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50 flex items-center gap-2 text-sm"
          >
            {isSpeaking && currentlyPlaying === 'fullPlan' ? 
              <StopCircle className="w-5 h-5" /> : 
              <Volume2 className="w-5 h-5" />
            }
            {isSpeaking && currentlyPlaying === 'fullPlan' ? 'Stop' : 'Read Plan'}
          </button>
          <button
            onClick={onRegenerate}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 flex items-center gap-2 text-sm"
          >
            <Brain className="w-5 h-5" />
            Regenerate
          </button>
          <button
            onClick={onClearPlan}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500/50 flex items-center gap-2 text-sm"
          >
            <Trash2 className="w-5 h-5" />
            Clear
          </button>
        </div>
      </div>

      <div className={`mb-8 border-b transition-colors duration-300 ${
        darkMode ? 'border-slate-700/50' : 'border-blue-200/50'
      }`}>
        <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
          {[
            { id: 'workout', label: 'Workout', icon: Dumbbell },
            { id: 'diet', label: 'Diet', icon: Soup },
            { id: 'tips', label: 'AI Tips', icon: CheckSquare }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`whitespace-nowrap pb-4 px-2 border-b-3 font-bold text-sm transition-all duration-300 flex items-center gap-2.5 ${
                activeTab === id
                  ? darkMode
                    ? 'border-indigo-500 text-indigo-400 scale-105'
                    : 'border-blue-600 text-blue-700 scale-105'
                  : darkMode
                    ? 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-blue-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div>
        {activeTab === 'workout' && <WorkoutPlan plan={plan.workout_plan} onExerciseClick={onActionItemClick} onPlayAudio={onPlayAudio} isSpeaking={isSpeaking} currentlyPlaying={currentlyPlaying} darkMode={darkMode} />}
        {activeTab === 'diet' && <DietPlan plan={plan.diet_plan} onMealClick={onActionItemClick} onPlayAudio={onPlayAudio} isSpeaking={isSpeaking} currentlyPlaying={currentlyPlaying} darkMode={darkMode} />}
        {activeTab === 'tips' && <AiTips tips={plan.ai_tips} darkMode={darkMode} />}
      </div>
    </div>
  );
};

// --- IMAGE MODAL COMPONENT (Chapter 6) ---
const ImageModal = ({ isOpen, onClose, title, imageUrl, isLoading }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity duration-300"
    >
      {/* Modal Content */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-300 transform scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }} // Keep final state of animation
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Image Area */}
        <div className="p-4">
          <div className="aspect-square w-full bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            {isLoading && (
              <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                <Loader className="w-10 h-10 animate-spin text-indigo-500" />
                <span className="mt-3 text-sm font-medium">Generating image...</span>
              </div>
            )}
            {!isLoading && imageUrl && (
              <img 
                src={imageUrl} 
                alt={title} 
                className="w-full h-full object-cover" 
              />
            )}
            {!isLoading && !imageUrl && (
              <div className="flex flex-col items-center text-center p-4 text-red-500">
                <AlertTriangle className="w-10 h-10" />
                <span className="mt-3 text-sm font-medium">Failed to generate image.</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add keyframes for animation */}
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

// --- SIMPLIFIED JSON SCHEMA FOR FASTER GENERATION ---
const JSON_SCHEMA = {
  type: "OBJECT",
  properties: {
    workout_plan: {
      type: "OBJECT",
      properties: {
        daily_routine: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              day: { type: "STRING" },
              focus: { type: "STRING" },
              exercises: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    sets: { type: "STRING" },
                    reps: { type: "STRING" },
                    rest: { type: "STRING" }
                  },
                  required: ["name", "sets", "reps", "rest"]
                }
              }
            },
            required: ["day", "focus", "exercises"]
          }
        }
      },
      required: ["daily_routine"]
    },
    diet_plan: {
      type: "OBJECT",
      properties: {
        meal_plan: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              day: { type: "STRING" },
              meals: {
                type: "OBJECT",
                properties: {
                  breakfast: { 
                    type: "OBJECT", 
                    properties: { 
                      name: { type: "STRING" }, 
                      calories: { type: "NUMBER" } 
                    },
                    required: ["name", "calories"]
                  },
                  lunch: { 
                    type: "OBJECT", 
                    properties: { 
                      name: { type: "STRING" }, 
                      calories: { type: "NUMBER" } 
                    },
                    required: ["name", "calories"]
                  },
                  dinner: { 
                    type: "OBJECT", 
                    properties: { 
                      name: { type: "STRING" }, 
                      calories: { type: "NUMBER" } 
                    },
                    required: ["name", "calories"]
                  },
                  snacks: { 
                    type: "OBJECT", 
                    properties: { 
                      name: { type: "STRING" }, 
                      calories: { type: "NUMBER" } 
                    },
                    required: ["name", "calories"]
                  }
                },
                required: ["breakfast", "lunch", "dinner", "snacks"]
              }
            },
            required: ["day", "meals"]
          }
        }
      },
      required: ["meal_plan"]
    },
    ai_tips: {
      type: "OBJECT",
      properties: {
        lifestyle_tips: { 
          type: "ARRAY", 
          items: { type: "STRING" } 
        },
        motivation: { type: "STRING" }
      },
      required: ["lifestyle_tips", "motivation"]
    }
  },
  required: ["workout_plan", "diet_plan", "ai_tips"]
};

// --- TTS HELPERS ---
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcmData, sampleRate) => {
  const numSamples = pcmData.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + numSamples * 2, true); // File size
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // Audio format 1 (PCM)
  view.setUint16(22, 1, true); // Number of channels 1
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * 2, true); // Byte rate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // Block align (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // Bits per sample
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, numSamples * 2, true); // Data size

  // pcmData is Int16Array
  const pcm16 = new Int16Array(pcmData.buffer);
  for (let i = 0; i < numSamples; i++) {
    view.setInt16(44 + i * 2, pcm16[i], true);
  }

  return new Blob([view], { type: 'audio/wav' });
};

// --- MAIN APP ---
export default function App() {
  // --- State ---
  // Use sticky state for persistence (Chapter 7)
  const [darkMode, setDarkMode] = useStickyState(true, 'ai-fitness-dark-mode');
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  // Start with an empty form so users must enter values manually on fresh load.
  const [formData, setFormData] = useStickyState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    fitnessLevel: '',
    workoutLocation: '',
    dietaryPreference: '',
    medicalHistory: '',
  }, 'ai-fitness-form-data');

  // Ensure any previously saved form data is cleared on mount so the form is blank
  // on every fresh load (as requested). We clear the saved key and reset state.
  useEffect(() => {
    try {
      window.localStorage.removeItem('ai-fitness-form-data');
    } catch (e) {
      // ignore
    }
    setFormData({
      name: '',
      age: '',
      gender: '',
      height: '',
      weight: '',
      fitnessGoal: '',
      fitnessLevel: '',
      workoutLocation: '',
      dietaryPreference: '',
      medicalHistory: '',
    });
  }, []);
  const [generatedPlan, setGeneratedPlan] = useStickyState(null, 'ai-fitness-generated-plan');
  const [currentStep, setCurrentStep] = useState(1);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const audioRef = useRef(null);

  // Image Modal State (Chapter 6)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', imageUrl: null });

  // --- Theme Toggle Handler ---
  const handleThemeToggle = () => {
    setIsThemeChanging(true);
    setTimeout(() => {
      setDarkMode(!darkMode);
      setTimeout(() => {
        setIsThemeChanging(false);
      }, 400);
    }, 200);
  };

  // --- Effects ---
  useEffect(() => {
    // This effect now just toggles the class
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    // Cleanup audio element on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // --- Form Handling ---
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, [setFormData]);

  // --- API: Generate Plan (Multiple Models with Fallback) ---
  const callGeminiApi = async (payload, retries = 3) => {
  const apiKey = GOOGLE_API_KEY;
    
    // Try the latest flash model first (preferred), then fall back to others
    const models = [
      'gemini-2.0-flash-exp',
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest'
    ];

    // Helper function to clean and parse JSON
    const parseJSON = (text) => {
      try {
        return JSON.parse(text);
      } catch (e) {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
        
        // Try to find JSON object in the text
        const objectMatch = text.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          return JSON.parse(objectMatch[0]);
        }
        
        throw e;
      }
    };

    for (const model of models) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      
      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            if (response.status === 404) {
              console.log(`Model ${model} not available, trying next model...`);
              break; // Try next model
            }
            throw new Error(`API Error: ${response.status}`);
          }

          const result = await response.json();
          const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (jsonText) {
            console.log(`Successfully used model: ${model}`);
            return parseJSON(jsonText);
          }
          throw new Error("Invalid response structure");
        } catch (error) {
          console.error(`Model ${model} attempt ${i + 1} failed:`, error);
          if (i === retries - 1) {
            console.log(`All retries failed for model ${model}, trying next model...`);
            break; // Try next model
          }
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
        }
      }
    }
    
    throw new Error("All models failed to generate plan");
  };

  // --- API: Generate TTS (Multiple Models with Fallback) ---
  const callGeminiTtsApi = async (textToSpeak, retries = 3) => {
  const apiKey = GOOGLE_API_KEY;
    
    // Define TTS models to try: prefer the newest TTS preview first, then fall back.
    const ttsModels = [
      'gemini-2.5-flash-preview-tts',
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro'
    ];

    for (const model of ttsModels) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: `Say with a friendly and encouraging tone: ${textToSpeak}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } }
        }
      };

      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            if (response.status === 404) {
              console.log(`TTS Model ${model} not available, trying next model...`);
              break; // Try next model
            }
            throw new Error(`TTS API Error: ${response.status}`);
          }

          const result = await response.json();
          const part = result?.candidates?.[0]?.content?.parts?.[0];
          const audioData = part?.inlineData?.data;
          const mimeType = part?.inlineData?.mimeType;

          if (audioData && mimeType?.startsWith("audio/")) {
            const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
            const pcmData = base64ToArrayBuffer(audioData);
            const wavBlob = pcmToWav(new Int16Array(pcmData), sampleRate);
            console.log(`TTS successfully used model: ${model}`);
            return URL.createObjectURL(wavBlob);
          }
          throw new Error("Invalid TTS response");
        } catch (error) {
          console.error(`TTS Model ${model} attempt ${i + 1} failed:`, error);
          if (i === retries - 1) {
            console.log(`All retries failed for TTS model ${model}, trying next model...`);
            break; // Try next model
          }
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
        }
      }
    }
    
    throw new Error("All TTS models failed");
  };

  // --- API: Generate Image (Multiple Models with Fallback) ---
  const callImagenApi = async (prompt, retries = 3) => {
  const apiKey = GOOGLE_API_KEY;
    
    // Define image models to try
    const imageModels = [
      'imagen-3.0-generate-002',
      'imagen-2.0-generate-002'
    ];

    for (const model of imageModels) {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`;

      const payload = {
        instances: [{ prompt: prompt }],
        parameters: { "sampleCount": 1 }
      };

      for (let i = 0; i < retries; i++) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (!response.ok) {
            if (response.status === 404) {
              console.log(`Image Model ${model} not available, trying next model...`);
              break; // Try next model
            }
            throw new Error(`Imagen API Error: ${response.status}`);
          }

          const result = await response.json();
          if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
            console.log(`Image successfully used model: ${model}`);
            return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
          }
          throw new Error("Invalid Imagen response structure");
        } catch (error) {
          console.error(`Image Model ${model} attempt ${i + 1} failed:`, error);
          if (i === retries - 1) {
            console.log(`All retries failed for Image model ${model}, trying next model...`);
            break; // Try next model
          }
          await new Promise(res => setTimeout(res, 1000 * Math.pow(2, i)));
        }
      }
    }
    
    throw new Error("All image models failed");
  };

  // --- Audio Controls ---
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    }
  }, []);

  const handlePlayAudio = useCallback(async (itemId, textToSpeak) => {
    if (isSpeaking && currentlyPlaying === itemId) {
      stopAudio();
      return;
    }
    if (isSpeaking) stopAudio();

    setIsSpeaking(true);
    setCurrentlyPlaying(itemId);

    try {
      const audioUrl = await callGeminiTtsApi(textToSpeak);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.play();
      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentlyPlaying(null);
        URL.revokeObjectURL(audioUrl);
        audioRef.current = null;
      };
    } catch (error) {
      console.error("TTS Error:", error);
      setErrorMessage("Couldn't play audio. Please try again.");
      setIsSpeaking(false);
      setCurrentlyPlaying(null);
    }
  }, [isSpeaking, currentlyPlaying, stopAudio]);

  // --- Main Form Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    stopAudio();
    setIsLoading(true);
    setGeneratedPlan(null); // Clear old plan before generating new one
    setErrorMessage(null);

    // Optimized prompt for faster generation with strict JSON formatting
    const systemPrompt = `You are an AI fitness coach. Create a valid JSON fitness plan.

User: ${formData.name}, ${formData.age}y, ${formData.gender}, ${formData.height}cm, ${formData.weight}kg
Goal: ${formData.fitnessGoal} | Level: ${formData.fitnessLevel} | Location: ${formData.workoutLocation}
Diet: ${formData.dietaryPreference} | Medical: ${formData.medicalHistory}

IMPORTANT: Return ONLY valid JSON. No markdown, no explanations, no code blocks.

Requirements:
- 7 days: each with 4-5 exercises (name, sets, reps, rest time)
- 7 days: meals with breakfast, lunch, dinner, snacks (name and calories only)
- 5 practical lifestyle tips
- 1 motivational quote

Keep all text short and professional. Ensure all strings are properly escaped.`;

    const payload = {
      contents: [{ parts: [{ text: "Generate the fitness plan in strict JSON format now." }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: JSON_SCHEMA,
        temperature: 0.5,
        maxOutputTokens: 3072
      }
    };
    
    try {
      const plan = await callGeminiApi(payload);
      setGeneratedPlan(plan); // This will trigger the useEffect to save it
    } catch (error) {
      setErrorMessage("Failed to generate plan. Please try again or adjust your inputs.");
      console.error("Plan generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Image Modal Click Handler (Chapter 6) ---
  const handleActionItemClick = useCallback(async (name, prompt) => {
    setIsModalOpen(true);
    setIsImageLoading(true);
    setModalContent({ title: name, imageUrl: null });

    try {
      const imageUrl = await callImagenApi(prompt);
      setModalContent({ title: name, imageUrl: imageUrl });
    } catch (error) {
      console.error("Error generating image:", error);
      setModalContent({ title: name, imageUrl: null }); // Keep title, but show error (imageUrl: null)
    } finally {
      setIsImageLoading(false);
    }
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // --- Clear Plan Handler (Chapter 7) ---
  const handleClearPlan = () => {
    stopAudio();
    setGeneratedPlan(null);
    setErrorMessage(null);
    // No need to clear localStorage manually, useStickyState does it
  };

  // --- RENDER ---
  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-slate-900'
    }`}>
      {/* Animated background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse transition-all duration-500 ${
          darkMode ? 'bg-indigo-500/10' : 'bg-blue-400/20'
        }`}></div>
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse transition-all duration-500 ${
          darkMode ? 'bg-purple-500/10' : 'bg-indigo-400/20'
        }`} style={{animationDelay: '1s'}}></div>
        <div className={`absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse transition-all duration-500 ${
          darkMode ? 'bg-blue-500/5' : 'bg-purple-400/15'
        }`} style={{animationDelay: '2s'}}></div>
      </div>
      
      <header className={`sticky top-0 z-40 backdrop-blur-2xl border-b shadow-2xl transition-all duration-500 ${
        darkMode 
          ? 'bg-slate-950/70 border-slate-800/50 shadow-indigo-500/5' 
          : 'bg-white/70 border-blue-200/50 shadow-blue-500/10'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className={`relative p-3 rounded-2xl shadow-lg transition-all duration-500 ${
                darkMode 
                  ? 'bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 shadow-indigo-500/50' 
                  : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 shadow-blue-500/50'
              }`}>
                <Dumbbell className="h-7 w-7 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-2xl font-black bg-gradient-to-r bg-clip-text text-transparent transition-all duration-500 ${
                  darkMode 
                    ? 'from-indigo-400 via-purple-400 to-pink-400' 
                    : 'from-blue-600 via-indigo-600 to-blue-700'
                }`}>AI Fitness Coach</h1>
                <p className={`text-xs font-medium transition-colors duration-500 ${
                  darkMode ? 'text-slate-400' : 'text-blue-600'
                }`}>Powered by Advanced AI</p>
              </div>
            </div>
            <button
              onClick={handleThemeToggle}
              className={`p-3 rounded-xl backdrop-blur-sm border transition-all duration-300 hover:scale-110 ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-700/50 text-indigo-400 hover:bg-indigo-500/20 hover:border-indigo-500/50' 
                  : 'bg-blue-50/50 border-blue-200/50 text-blue-600 hover:bg-blue-100/50 hover:border-blue-400/50'
              }`}
            >
              {/* FIX: Corrected w-V to w-5 */}
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Theme Transition Overlay */}
      {isThemeChanging && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className={`absolute inset-0 transition-opacity duration-200 ${
            darkMode 
              ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950' 
              : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
          } animate-pulse`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`relative ${
                darkMode ? 'text-indigo-400' : 'text-blue-600'
              }`}>
                <div className="w-16 h-16 border-4 border-current border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {darkMode ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transform scale-90 origin-top">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
            
          {/* LEFT COLUMN - FORM */}
          <div className="lg:col-span-1 space-y-4">
            <div className={`sticky top-24 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border transition-all duration-500 ${
              darkMode 
                ? 'bg-slate-900/40 border-slate-700/50 shadow-indigo-500/5' 
                : 'bg-white/60 border-blue-200/50 shadow-blue-500/10'
            }`}>
              {/* Step Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs transition-all duration-300 ${
                        currentStep === step 
                          ? darkMode
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white scale-110 shadow-lg shadow-indigo-500/50'
                            : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 shadow-lg shadow-blue-500/50'
                          : currentStep > step
                          ? darkMode
                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50'
                            : 'bg-green-500/30 text-green-600 border-2 border-green-500/60'
                          : darkMode
                          ? 'bg-slate-800/50 text-slate-500 border-2 border-slate-700/50'
                          : 'bg-blue-50/50 text-blue-400 border-2 border-blue-200/50'
                      }`}>
                        {currentStep > step ? '✓' : step}
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-0.5 mx-1.5 rounded-full transition-all duration-300 ${
                          currentStep > step 
                            ? darkMode ? 'bg-green-500/50' : 'bg-green-500/60' 
                            : darkMode ? 'bg-slate-700/50' : 'bg-blue-200/50'
                        }`}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <h3 className={`text-base font-bold transition-colors duration-300 ${
                    darkMode ? 'text-white' : 'text-blue-900'
                  }`}>
                    {currentStep === 1 && 'Personal Information'}
                    {currentStep === 2 && 'Fitness Details'}
                    {currentStep === 3 && 'Preferences & Goals'}
                  </h3>
                  <p className={`text-xs mt-0.5 transition-colors duration-300 ${
                    darkMode ? 'text-slate-400' : 'text-blue-600'
                  }`}>Step {currentStep} of 3</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-xl shadow-lg transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30' 
                          : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/30'
                      }`}>
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h2 className={`text-lg font-black bg-gradient-to-r bg-clip-text text-transparent ${
                        darkMode 
                          ? 'from-indigo-400 to-purple-400' 
                          : 'from-blue-700 to-indigo-700'
                      }`}>About You</h2>
                    </div>

                    <FormInput
                      id="name"
                      label="Full Name"
                      value={formData.name}
                      onChange={handleFormChange}
                      icon={User}
                      placeholder="e.g., Jane Doe"
                      darkMode={darkMode}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput
                        id="age"
                        label="Age"
                        type="number"
                        value={formData.age}
                        onChange={handleFormChange}
                        icon={Cake}
                        placeholder="30"
                        darkMode={darkMode}
                      />
                      <FormSelect
                        id="gender"
                        label="Gender"
                        value={formData.gender}
                        onChange={handleFormChange}
                        icon={User}
                        options={['Male', 'Female', 'Other']}
                        darkMode={darkMode}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <FormInput
                        id="height"
                        label="Height (cm)"
                        type="number"
                        value={formData.height}
                        onChange={handleFormChange}
                        icon={Ruler}
                        placeholder="165"
                        darkMode={darkMode}
                      />
                      <FormInput
                        id="weight"
                        label="Weight (kg)"
                        type="number"
                        value={formData.weight}
                        onChange={handleFormChange}
                        icon={Weight}
                        placeholder="70"
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Fitness Details */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-xl shadow-lg transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30' 
                          : 'bg-gradient-to-br from-green-600 to-emerald-700 shadow-green-500/30'
                      }`}>
                        <Dumbbell className="w-5 h-5 text-white" />
                      </div>
                      <h2 className={`text-lg font-black bg-gradient-to-r bg-clip-text text-transparent ${
                        darkMode 
                          ? 'from-green-400 to-emerald-400' 
                          : 'from-green-700 to-emerald-700'
                      }`}>Fitness Profile</h2>
                    </div>

                    <FormSelect
                      id="fitnessGoal"
                      label="Primary Fitness Goal"
                      value={formData.fitnessGoal}
                      onChange={handleFormChange}
                      icon={Target}
                      options={['Weight Loss', 'Muscle Gain', 'General Fitness', 'Improve Endurance', 'Flexibility', 'Athletic Performance']}
                      darkMode={darkMode}
                    />

                    <FormSelect
                      id="fitnessLevel"
                      label="Current Fitness Level"
                      value={formData.fitnessLevel}
                      onChange={handleFormChange}
                      icon={Zap}
                      options={['Beginner', 'Intermediate', 'Advanced']}
                      darkMode={darkMode}
                    />

                    <FormSelect
                      id="workoutLocation"
                      label="Workout Location"
                      value={formData.workoutLocation}
                      onChange={handleFormChange}
                      icon={MapPin}
                      options={['Home (No Equipment)', 'Home (Basic Equipment)', 'Gym', 'Outdoor']}
                      darkMode={darkMode}
                    />
                  </div>
                )}

                {/* Step 3: Preferences & Goals */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center gap-2 mb-4">
                      <div className={`p-2 rounded-xl shadow-lg transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/30' 
                          : 'bg-gradient-to-br from-amber-600 to-orange-700 shadow-amber-500/30'
                      }`}>
                        <Soup className="w-5 h-5 text-white" />
                      </div>
                      <h2 className={`text-lg font-black bg-gradient-to-r bg-clip-text text-transparent ${
                        darkMode 
                          ? 'from-amber-400 to-orange-400' 
                          : 'from-amber-700 to-orange-700'
                      }`}>Final Details</h2>
                    </div>

                    <FormSelect
                      id="dietaryPreference"
                      label="Dietary Preference"
                      value={formData.dietaryPreference}
                      onChange={handleFormChange}
                      icon={Soup}
                      options={['Non-Vegetarian', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean']}
                      darkMode={darkMode}
                    />

                    <FormInput
                      id="medicalHistory"
                      label="Medical Conditions (Optional)"
                      value={formData.medicalHistory}
                      onChange={handleFormChange}
                      icon={Info}
                      placeholder="e.g., Knee injury, diabetes, allergies"
                      darkMode={darkMode}
                    />

                    <div className={`p-3 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-blue-500/10 border-blue-500/30' 
                        : 'bg-blue-100/80 border-blue-300/50'
                    }`}>
                      <div className="flex items-start gap-2">
                        <Info className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          darkMode ? 'text-blue-400' : 'text-blue-700'
                        }`} />
                        <div className="text-xs">
                          <p className={`font-semibold mb-0.5 ${
                            darkMode ? 'text-blue-300' : 'text-blue-900'
                          }`}>Privacy Notice</p>
                          <p className={`text-xs ${
                            darkMode ? 'text-blue-400/80' : 'text-blue-800'
                          }`}>Your information is used only to generate your personalized fitness plan and is stored locally on your device.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className={`flex gap-2 mt-6 pt-4 border-t transition-colors duration-300 ${
                  darkMode ? 'border-slate-700/50' : 'border-blue-200/50'
                }`}>
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className={`flex-1 font-semibold py-3 px-4 rounded-xl border transition-all duration-300 text-sm ${
                        darkMode 
                          ? 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border-slate-700/50 hover:border-slate-600/50' 
                          : 'bg-blue-50/50 hover:bg-blue-100/50 text-blue-700 hover:text-blue-900 border-blue-200/50 hover:border-blue-300/50'
                      }`}
                    >
                      ← Previous
                    </button>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className={`${currentStep === 1 ? 'w-full' : 'flex-1'} text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 text-sm ${
                        darkMode 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-indigo-500/30' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30'
                      }`}
                    >
                      Next Step →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 relative text-white font-bold py-3 px-4 rounded-xl shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 overflow-hidden group text-sm ${
                        darkMode 
                          ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 shadow-indigo-500/50 hover:shadow-indigo-500/70 focus:ring-indigo-500/50 focus:ring-offset-slate-900' 
                          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 shadow-blue-500/50 hover:shadow-blue-500/70 focus:ring-blue-500/50 focus:ring-offset-white'
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      {isLoading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin relative z-10" />
                          <span className="relative z-10">Generating...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">Generate Plan</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN - PLAN */}
          <div className="lg:col-span-2 mt-6 lg:mt-0">
            <div className={`backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl border min-h-[500px] transition-all duration-500 ${
              darkMode 
                ? 'bg-slate-900/40 border-slate-700/50 shadow-indigo-500/5' 
                : 'bg-white/90 border-blue-200/50 shadow-blue-500/10'
            }`}>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="relative">
                    <div className={`w-24 h-24 border-4 rounded-full animate-spin ${
                      darkMode 
                        ? 'border-indigo-500/30 border-t-indigo-500' 
                        : 'border-blue-500/30 border-t-blue-600'
                    }`}></div>
                    <div className={`absolute inset-0 w-24 h-24 border-4 rounded-full animate-spin ${
                      darkMode 
                        ? 'border-purple-500/20 border-t-purple-500' 
                        : 'border-indigo-500/20 border-t-indigo-600'
                    }`} style={{animationDuration: '1.5s', animationDirection: 'reverse'}}></div>
                    <Brain className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 animate-pulse ${
                      darkMode ? 'text-indigo-400' : 'text-blue-600'
                    }`} />
                  </div>
                  <h2 className={`mt-10 text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent ${
                    darkMode 
                      ? 'from-indigo-400 to-purple-400' 
                      : 'from-blue-600 to-indigo-600'
                  }`}>
                    Crafting Your Perfect Plan
                  </h2>
                  <p className={`mt-4 text-base text-center max-w-md leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-blue-700'
                  }`}>
                    Our AI is analyzing your profile and generating a personalized fitness roadmap...
                  </p>
                  <div className="mt-6 flex gap-2">
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-indigo-500' : 'bg-blue-600'
                    }`}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-purple-500' : 'bg-indigo-600'
                    }`} style={{animationDelay: '0.1s'}}></div>
                    <div className={`w-2 h-2 rounded-full animate-bounce ${
                      darkMode ? 'bg-pink-500' : 'bg-blue-700'
                    }`} style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="p-5 bg-red-500/10 backdrop-blur-sm rounded-2xl border border-red-500/30">
                    <AlertTriangle className="w-20 h-20 text-red-400" />
                  </div>
                  <h2 className={`mt-8 text-3xl font-black ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Oops! Something Went Wrong
                  </h2>
                  <p className={`mt-4 text-base text-center max-w-md ${
                    darkMode ? 'text-slate-400' : 'text-blue-700'
                  }`}>
                    {errorMessage}
                  </p>
                  <button
                    onClick={handleSubmit}
                    className="mt-8 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-500/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !errorMessage && !generatedPlan && (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="relative">
                    <div className={`absolute inset-0 blur-3xl rounded-full ${
                      darkMode 
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20' 
                        : 'bg-gradient-to-r from-blue-500/30 to-indigo-500/30'
                    }`}></div>
                    <div className={`relative p-6 backdrop-blur-sm rounded-3xl border ${
                      darkMode 
                        ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30' 
                        : 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border-blue-500/40'
                    }`}>
                      <HeartPulse className={`w-20 h-20 animate-pulse ${
                        darkMode ? 'text-indigo-400' : 'text-blue-600'
                      }`} />
                    </div>
                  </div>
                  <h2 className={`mt-10 text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent ${
                    darkMode 
                      ? 'from-indigo-400 via-purple-400 to-pink-400' 
                      : 'from-blue-600 via-indigo-600 to-blue-700'
                  }`}>
                    Your Transformation Starts Here
                  </h2>
                  <p className={`mt-4 text-lg text-center max-w-lg leading-relaxed ${
                    darkMode ? 'text-slate-400' : 'text-blue-800'
                  }`}>
                    Complete your profile and let our advanced AI create a personalized fitness plan tailored just for you!
                  </p>
                  <div className="mt-10 flex items-center gap-6 text-sm">
                    <div className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-slate-800/50 border-slate-700/50' 
                        : 'bg-slate-700/90 border-slate-600/50'
                    }`}>
                      <CheckSquare className={`w-5 h-5 ${
                        darkMode ? 'text-green-400' : 'text-green-300'
                      }`} />
                      <span className={`font-medium ${
                        darkMode ? 'text-slate-300' : 'text-white'
                      }`}>Personalized</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-slate-800/50 border-slate-700/50' 
                        : 'bg-slate-700/90 border-slate-600/50'
                    }`}>
                      <CheckSquare className={`w-5 h-5 ${
                        darkMode ? 'text-green-400' : 'text-green-300'
                      }`} />
                      <span className={`font-medium ${
                        darkMode ? 'text-slate-300' : 'text-white'
                      }`}>Science-Based</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                      darkMode 
                        ? 'bg-slate-800/50 border-slate-700/50' 
                        : 'bg-slate-700/90 border-slate-600/50'
                    }`}>
                      <CheckSquare className={`w-5 h-5 ${
                        darkMode ? 'text-green-400' : 'text-green-300'
                      }`} />
                      <span className={`font-medium ${
                        darkMode ? 'text-slate-300' : 'text-white'
                      }`}>7-Day Plan</span>
                    </div>
                  </div>
                </div>
              )}

              {generatedPlan && (
                <PlanDisplay 
                  plan={generatedPlan} 
                  onRegenerate={() => handleSubmit(new Event('submit'))}
                  onClearPlan={handleClearPlan}
                  onActionItemClick={handleActionItemClick} // <-- Wired up
                  onPlayAudio={handlePlayAudio}
                  isSpeaking={isSpeaking}
                  currentlyPlaying={currentlyPlaying}
                  darkMode={darkMode}
                />
              )}
              
            </div>
          </div>

        </div>
      </main>

      {/* --- RENDER THE MODAL (Chapter 6) --- */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        imageUrl={modalContent.imageUrl}
        isLoading={isImageLoading}
      />
    </div>
  );
}


