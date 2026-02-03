import React, { useState } from 'react';
import { Search, ChevronDown, Check, Clock, User } from 'lucide-react';
import Results from './components/Results';
import DegreeRemainingList from './components/DegreeRemainingList';
import type { DropdownOption } from './lib/filters';
import { REMAINING_COURSES, filterCourses, getKeywordOptions, SUBJECT_OPTIONS } from './lib/filters';

 // --- Components ---

const FilterSection = ({ title, children, className = "" }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={`mb-6 ${className}`}>
    <label className="block text-sm font-medium text-gray-600 mb-2">
      {title}
    </label>
    {children}
  </div>
);

const CustomSelect = ({ value, onChange, options, placeholder }: { value: string, onChange: (v: string) => void, options: string[], placeholder?: string }) => (
  <div className="relative">
    <select
      className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>{placeholder || 'Select...'}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
      <ChevronDown size={16} />
    </div>
  </div>
);

const SearchableDropdown = ({ 
  placeholder, 
  options, 
  value, 
  onChange 
}: { 
  placeholder: string, 
  options: DropdownOption[], 
  value: string, 
  onChange: (val: string) => void 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Filter options based on mock search
  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          className="w-full border border-gray-300 text-gray-800 py-3 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder={placeholder}
          value={search || value} // Display selected value label if set, else search term
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
            onChange(''); // Clear selection on type
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay to allow click
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-1 pointer-events-none">
          <Search size={18} className="text-gray-400" />
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <div
                key={opt.value}
                className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm text-gray-700 transition-colors"
                onClick={() => {
                  onChange(opt.label);
                  setSearch(opt.label);
                  setIsOpen(false);
                }}
              >
                {opt.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

const CheckboxGroup = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (val: string) => void }) => {
  return (
    <div className="flex gap-3">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
              ${isSelected 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'border-white bg-purple-600' : 'border-gray-400 bg-white'}`}>
              {isSelected && <Check size={12} className="text-white" />}
            </div>
            {opt}
          </button>
        );
      })}
    </div>
  );
};

export default function App() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [term, setTerm] = useState('Spring 2026');
  const [subject, setSubject] = useState('');
  const [keyword, setKeyword] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>(['M/W', 'T/TH']); // Pre-selected based on mock
  const [showResults, setShowResults] = useState(false);

  // Derived options and filtered results using helpers
  const keywordOptions = getKeywordOptions(filterCourses(REMAINING_COURSES, { subject, selectedDays, openOnly }));
  const results = filterCourses(REMAINING_COURSES, { subject, selectedDays, openOnly, keyword });

  // Static degree list (first 7 MS Computer Science courses)
  const MS_REQUIRED_COURSES = REMAINING_COURSES.filter(c => c.subjects.includes('MS Computer Science')).slice(0, 7);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  }; 

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* Top Banner / Nav Placeholder */}
      <div className="h-1 bg-purple-600 w-full mb-8" />

      <main className="max-w-7xl mx-auto px-6 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {showResults ? (
          <div className="lg:col-span-12 xl:col-span-12">
            <Results results={results} onBack={() => setShowResults(false)} />
          </div>
        ) : (<div className="contents">
        
        {/* LEFT COLUMN - SEARCH FILTERS */}
        <div className="lg:col-span-5 xl:col-span-4">
          <h1 className="text-3xl font-light text-gray-800 mb-8 tracking-tight">
            Class Search
          </h1>

          <div className="space-y-6">
            
            {/* Term */}
            <FilterSection title="Term">
              <CustomSelect 
                value={term} 
                onChange={setTerm} 
                options={['Spring 2026', 'Summer 2026', 'Fall 2026']} 
              />
            </FilterSection>

            {/* Subject */}
            <FilterSection title="Subject">
              <SearchableDropdown 
                placeholder="Computer Sci" 
                options={SUBJECT_OPTIONS} 
                value={subject} 
                onChange={setSubject} 
              />
            </FilterSection>

            {/* Keyword */}
            <FilterSection title="Keyword Search">
              <SearchableDropdown 
                placeholder="Algor" 
                options={keywordOptions} 
                value={keyword} 
                onChange={setKeyword} 
              />
            </FilterSection>

            <div className="text-sm text-gray-500 mb-4">Keyword options: {keywordOptions.length} — Results: {results.length}</div>

            {/* Open Classes Toggle */}
            <div className="flex items-center gap-3 py-2 cursor-pointer" onClick={() => setOpenOnly(!openOnly)}>
              <div className={`
                w-5 h-5 rounded border transition-colors flex items-center justify-center
                ${openOnly ? 'bg-purple-600 border-purple-600' : 'bg-white border-purple-400'}
              `}>
                {openOnly && <Check size={14} className="text-white" />}
              </div>
              <span className="text-gray-700 select-none">Only show open classes</span>
            </div>

            {/* Meeting Days */}
            <FilterSection title="Meeting Days">
              <CheckboxGroup 
                options={['M/W', 'T/TH', 'F']} 
                selected={selectedDays} 
                onChange={toggleDay} 
              />
            </FilterSection>

            {/* ADVANCED SECTION */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showAdvanced ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="pt-4 border-t border-gray-100 space-y-5">
                <div className="bg-purple-50 p-4 rounded-lg space-y-4">
                    <h3 className="text-purple-900 font-medium text-sm uppercase tracking-wider mb-2">Advanced Options</h3>
                    
                    <FilterSection title="Session" className="mb-0">
                        <CustomSelect value="" onChange={() => {}} options={['Regular Academic Session', 'Eight Week - First', 'Eight Week - Second']} placeholder="Select Session" />
                    </FilterSection>

                    <FilterSection title="Instructor" className="mb-0">
                         <div className="relative">
                            <input type="text" placeholder="Last Name" className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-purple-500 outline-none" />
                             <User className="absolute right-3 top-2.5 text-gray-400" size={16} />
                         </div>
                    </FilterSection>

                    <div className="grid grid-cols-2 gap-4">
                         <FilterSection title="Start Time" className="mb-0">
                             <div className="relative">
                                <CustomSelect value="" onChange={() => {}} options={['8:00 AM', '10:00 AM', '1:00 PM']} placeholder="After..." />
                                <div className="absolute right-8 top-3 pointer-events-none text-gray-400"><Clock size={14}/></div>
                             </div>
                         </FilterSection>
                         <FilterSection title="End Time" className="mb-0">
                            <div className="relative">
                                <CustomSelect value="" onChange={() => {}} options={['11:00 AM', '3:00 PM', '5:00 PM']} placeholder="Before..." />
                                <div className="absolute right-8 top-3 pointer-events-none text-gray-400"><Clock size={14}/></div>
                            </div>
                         </FilterSection>
                    </div>

                    <FilterSection title="Mode of Instruction" className="mb-0">
                         <CustomSelect value="" onChange={() => {}} options={['In Person', 'Hybrid', 'Online']} placeholder="Any Mode" />
                    </FilterSection>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full py-3 border border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 font-medium transition-colors"
              >
                {showAdvanced ? 'Hide Advanced Search Options' : 'Show Advanced Search Options'}
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setTerm('Spring 2026');
                    setSubject('');
                    setKeyword('');
                    setOpenOnly(false);
                    setSelectedDays([]);
                  }}
                  className="w-full py-3 border border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 font-medium transition-colors"
                >
                  Reset
                </button>
                <button onClick={() => setShowResults(true)} className="w-full py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-medium shadow-md hover:shadow-lg transition-all">
                  Submit
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - STATIC REMAINING COURSES (first 7 MS Computer Science) */}
        <div className="lg:col-span-7 xl:col-span-8 pt-4 lg:pt-0">
          <DegreeRemainingList courses={MS_REQUIRED_COURSES} />
        </div>
        </div>)}
      </main>

      {/* Global CSS for utilities */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px; /* Hidden native scrollbar to use our custom visual one */
          background: transparent;
        }
      `}</style>
    </div>
  );
}