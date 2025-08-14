'use client';

import { useState, useEffect } from 'react';

interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionData {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface ApiResponse {
  success: boolean;
  data: ContributionData;
  year: number;
  username: string;
}

export default function ContributionsCalendar() {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const year = 2025;
  
  // Rango fijo de meses: marzo a agosto (meses 2-7, ya que enero es 0)
  const startMonth = 2; // marzo
  const endMonth = 7;   // agosto

  const fetchContributions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/github-contributions?year=${year}`);
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch contributions');
      }
      
      setContributionData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count < 3) return 'bg-green-100 dark:bg-green-900';
    if (count < 6) return 'bg-green-300 dark:bg-green-700';
    if (count < 10) return 'bg-green-500 dark:bg-green-500';
    return 'bg-green-700 dark:bg-green-300';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Función para filtrar las semanas del rango de meses especificado
  const filterMonthRange = (weeks: ContributionWeek[]) => {
    return weeks.filter(week => {
      // Verificar si algún día de la semana está dentro del rango de meses
      return week.contributionDays.some(day => {
        const dayDate = new Date(day.date);
        const month = dayDate.getMonth();
        return month >= startMonth && month <= endMonth && dayDate.getFullYear() === year;
      });
    }).map(week => ({
      ...week,
      contributionDays: week.contributionDays.filter(day => {
        const dayDate = new Date(day.date);
        const month = dayDate.getMonth();
        return month >= startMonth && month <= endMonth && dayDate.getFullYear() === year;
      })
    })).filter(week => week.contributionDays.length > 0);
  };

  // Calcular contribuciones filtradas para el rango de meses
  const getFilteredData = () => {
    if (!contributionData) return null;
    
    const filteredWeeks = filterMonthRange(contributionData.weeks);
    const totalContributions = filteredWeeks.reduce((total, week) => 
      total + week.contributionDays.reduce((weekTotal, day) => 
        weekTotal + day.contributionCount, 0), 0);
    
    return {
      weeks: filteredWeeks,
      totalContributions
    };
  };

  // Etiquetas de meses fijas para el rango marzo-agosto
  const fixedMonthLabels = ['Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago'];

  if (loading) {
    return (
      <div className="rounded-2xl p-6 border bg-card">
        <h3 className="text-lg font-semibold mb-4">GitHub Contributions</h3>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl p-6 border bg-card">
        <h3 className="text-lg font-semibold mb-4">My GitHub in {year}</h3>
        <div className="text-center text-red-500">
          <p>Failed to load contributions</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => fetchContributions()}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!contributionData) {
    return null;
  }

  const filteredData = getFilteredData();

  return (
    <div className="rounded-2xl p-6 border bg-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">My GitHub in {year}</h3>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-muted-foreground">
          {filteredData?.totalContributions} contributions
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="w-fit">
          {/* Month labels */}
          <div className="flex mb-5">
            <div className="flex gap-1 relative">
              {/* Calculate month positions based on weeks */}
              {(() => {
                const monthPositions: { month: string; position: number; width: number }[] = [];
                let currentWeek = 0;
                
                if (filteredData?.weeks) {
                  for (let i = 0; i < filteredData.weeks.length; i++) {
                    const week = filteredData.weeks[i];
                    if (week.contributionDays.length > 0) {
                      const firstDay = week.contributionDays[0];
                      const date = new Date(firstDay.date);
                      const month = date.getMonth();
                      const monthName = fixedMonthLabels[month - startMonth];
                      
                      if (monthName && !monthPositions.find(mp => mp.month === monthName)) {
                        // Count weeks for this month
                        let weekCount = 0;
                        for (let j = i; j < filteredData.weeks.length; j++) {
                          const weekCheck = filteredData.weeks[j];
                          if (weekCheck.contributionDays.length > 0) {
                            const checkDate = new Date(weekCheck.contributionDays[0].date);
                            if (checkDate.getMonth() === month) {
                              weekCount++;
                            } else {
                              break;
                            }
                          }
                        }
                        
                        monthPositions.push({
                          month: monthName,
                          position: currentWeek,
                          width: weekCount
                        });
                      }
                    }
                    currentWeek++;
                  }
                }
                
                return monthPositions.map((mp, index) => (
                  <div 
                    key={index} 
                    className="text-xs text-muted-foreground text-center"
                    style={{
                      position: 'absolute',
                      left: `${mp.position * 16}px`, // 16px = w-3 + gap
                      width: `${mp.width * 16 - 4}px`
                    }}
                  >
                    {mp.month}
                  </div>
                ));
              })()}
            </div>
          </div>
          
          {/* Calendar grid */}
          <div className="flex">
            {/* Contribution squares */}
            <div className="flex gap-1">
              {filteredData?.weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.contributionDays.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-4 h-4 rounded-sm border ${getIntensityClass(day.contributionCount)} hover:ring-1 hover:ring-primary cursor-pointer transition-all`}
                      title={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>Menos</span>
            <div className="flex gap-1">
              {[0, 1, 3, 6, 10].map((count) => (
                <div
                  key={count}
                  className={`w-3 h-3 rounded-sm border ${getIntensityClass(count)}`}
                />
              ))}
            </div>
            <span>Más</span>
          </div>
        </div>
      </div>
    </div>
  );
}