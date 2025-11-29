/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, startOfWeek, addDays, subMonths, addMonths, isToday, isSameMonth } from 'date-fns';
import { useMemo, useState } from 'react';
import { splitDecimals } from '@/core/utils/splitDecimals';
import { useOutletContext } from "react-router-dom";
import { MdCenterFocusStrong, MdChevronLeft, MdChevronRight, MdTrendingUp, MdAccountBalance, MdAttachMoney } from 'react-icons/md';


export default function Journal() {

  const { registrationsReport } = useOutletContext<any>();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
  const end = endOfMonth(currentMonth);

  const days = useMemo(() => {
    const allDays:any = [];
    let date = new Date(start);
    while (date <= end) {
      allDays.push(new Date(date));
      date = addDays(date, 1);
    }
    return allDays;
  }, [currentMonth]);

  const aggregateDataForDate = (date:any) => {
    const filtered = registrationsReport?.filter((entry:any) => {
      const qualificationDate = entry?.qualification_date;
      return qualificationDate && isSameDay(parseISO(qualificationDate), date);
    });

    const totalCommissions = filtered?.reduce((sum:any, e:any) => sum + (e.commission || 0), 0);
    const totalDeposits = filtered?.reduce((sum:number, e:any) => sum + (e.deposits || 0), 0);
    const totalVolume = filtered?.reduce((sum:number, e:any) => sum + (e.volume || 0), 0);
    const totalPL = filtered?.reduce((sum:number, e:any) => sum + (e.PL || 0), 0);
    const qualifiedUsers = filtered?.length;

    return qualifiedUsers > 0
      ? { totalCommissions, totalDeposits, totalVolume, totalPL, qualifiedUsers }
      : null;
  };

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate monthly totals for summary
  const monthlyTotals = useMemo(() => {
    return days.reduce((totals, day) => {
      const data = aggregateDataForDate(day);
      if (data) {
        totals.totalCommissions += data.totalCommissions;
        totals.totalDeposits += data.totalDeposits;
        totals.totalVolume += data.totalVolume;
        totals.totalPL += data.totalPL;
        totals.qualifiedUsers += data.qualifiedUsers;
        totals.activeDays += 1;
      }
      return totals;
    }, {
      totalCommissions: 0,
      totalDeposits: 0,
      totalVolume: 0,
      totalPL: 0,
      qualifiedUsers: 0,
      activeDays: 0
    });
  }, [days]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="flex items-center text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-700 dark:text-white mb-2">
            <MdCenterFocusStrong className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
            Journal de Actividad
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
            Visualización detallada de comisiones y actividad diaria
          </p>
        </div>

        {/* Monthly Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Comisiones Totales</p>
                <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  ${splitDecimals(monthlyTotals.totalCommissions.toFixed(0))}
                </p>
              </div>
              <MdAttachMoney className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Depósitos</p>
                <p className="text-lg sm:text-xl font-bold text-blue-600 dark:text-blue-400">
                  ${splitDecimals(monthlyTotals.totalDeposits.toFixed(0))}
                </p>
              </div>
              <MdAccountBalance className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Usuarios Calificados</p>
                <p className="text-lg sm:text-xl font-bold text-purple-600 dark:text-purple-400">
                  {monthlyTotals.qualifiedUsers}
                </p>
              </div>
              <MdTrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Días Activos</p>
                <p className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                  {monthlyTotals.activeDays}
                </p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">{monthlyTotals.activeDays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calendar Navigation */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-colors duration-200"
            >
              <MdChevronLeft className="w-5 h-5 mr-1" />
              <span className="hidden sm:inline">Anterior</span>
            </button>
            
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-700 dark:text-white text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="flex items-center px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-white transition-colors duration-200"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <MdChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
            {dayHeaders.map((day) => (
              <div key={day} className="text-center text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day: any) => {
              const data = aggregateDataForDate(day);
              const hasData = !!data;
              const isCurrentDay = isToday(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    relative rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]
                    transition-all duration-200 hover:scale-105 hover:shadow-lg
                    ${hasData 
                      ? 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border-2 border-indigo-300 dark:border-indigo-500 shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600'
                    }
                    ${isCurrentDay ? 'ring-2 ring-yellow-400 dark:ring-yellow-500' : ''}
                    ${!isCurrentMonth ? 'opacity-40' : ''}
                  `}
                >
                  {/* Date */}
                  <div className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${
                    isCurrentDay 
                      ? 'text-yellow-600 dark:text-yellow-400' 
                      : hasData 
                        ? 'text-indigo-700 dark:text-indigo-300' 
                        : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  {/* Data Content */}
                  {hasData ? (
                    <div className="space-y-1 sm:space-y-2">
                      <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm">
                        ${splitDecimals(data.totalCommissions.toFixed(0))}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        <div className="truncate">Dep: ${splitDecimals(data.totalDeposits.toFixed(0))}</div>
                        <div className="truncate">Vol: {data.totalVolume.toFixed(0)}</div>
                      </div>
                      <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {data.qualifiedUsers} users
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                      {isCurrentMonth ? 'Sin datos' : ''}
                    </div>
                  )}

                  {/* Activity Indicator */}
                  {hasData && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-700">
          <h3 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-white mb-3">Leyenda</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs sm:text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-indigo-300 dark:bg-indigo-500 rounded mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">Día con actividad</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">Sin actividad</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              <span className="text-slate-600 dark:text-slate-300">Hoy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-slate-600 dark:text-slate-300">Indicador de actividad</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}