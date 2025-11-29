/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useCallback, useMemo } from "react";
import { countryToFlag } from "@/core/utils/countryToFlag";
import { getCountryName } from "@/core/utils/getCountryName";

export function GoogleGeoChart({ data, mapHeight = "360px", mapWidth = "100%", showConversionLeaders = false }: any) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<any>(null); // Guardar el chart instanciado
  const dataTableInstance = useRef<any>(null); // Guardar los datos

  // Calculate Geographic Conversion Leaders
  const conversionLeaders = useMemo(() => {
    const MIN_DEPOSIT = 300; // Minimum deposit to qualify as CPA
    const countryStats: Record<string, { registrations: number; cpas: number }> = {};

    data?.forEach((user: any) => {
      const code = (user.country || "").trim().toUpperCase();
      if (!code || code.length !== 2) return;

      if (!countryStats[code]) {
        countryStats[code] = { registrations: 0, cpas: 0 };
      }

      countryStats[code].registrations += 1;
      
      // Check if user qualifies as CPA (has minimum deposit)
      if ((user.net_deposits || 0) >= MIN_DEPOSIT) {
        countryStats[code].cpas += 1;
      }
    });

    // Calculate conversion rates and sort by conversion rate
    return Object.entries(countryStats)
      .map(([code, stats]) => ({
        code,
        country: getCountryName(code),
        flag: countryToFlag(code),
        registrations: stats.registrations,
        cpas: stats.cpas,
        conversionRate: stats.registrations > 0 ? (stats.cpas / stats.registrations) * 100 : 0
      }))
      .filter(item => item.registrations >= 3) // Only show countries with at least 3 registrations
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 5); // Top 5 conversion leaders
  }, [data]);

  const drawRegionsMap = useCallback(() => {
    const google = (window as any).google;
    if (!google?.charts || !chartRef.current || !dataTableInstance.current) return;

    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const options = {
      colorAxis: {
        colors: showConversionLeaders ? 
          ["#e5e7eb", "#fbbf24", "#f59e0b", "#d97706", "#92400e"] : // Gold gradient for top countries
          ["#b383f7", "#7F22FE", "#7F22FE"], // Original purple gradient
        values: showConversionLeaders ? [0, 0.3, 0.6, 0.8, 1] : undefined
      },
      backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
      datalessRegionColor: isDarkMode ? "#253854" : "#e5e7eb",
      legend: { 
        textStyle: { 
          fontSize: 14, 
          color: isDarkMode ? "#ffffff" : "#000000",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" // Fix Safari blur
        },
        position: 'bottom',
        alignment: 'center'
      },
      region: 'world',
      displayMode: 'regions',
      resolution: 'countries',
      tooltip: { 
        isHtml: true,
        textStyle: {
          fontSize: 12,
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" // Fix Safari blur
        }
      },
      // Completely hide coordinate numbers
      textStyle: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: 0, // Set to 0 to hide
        color: 'transparent' // Make transparent
      },
      // Hide all text elements
      showTooltips: true,
      showInfoWindow: false,
      // Disable coordinate display
      keepAspectRatio: true,
      enableRegionInteractivity: true,
      // Additional options to hide coordinates
      magnifyingGlass: {
        enable: false
      },
      // Try to hide coordinate labels
      sizeAxis: {
        minValue: 0,
        maxValue: 100
      },
      // Force hide any coordinate display
      forceIFrame: false,
    };

    if (!chartInstance.current) {
      chartInstance.current = new google.visualization.GeoChart(chartRef.current);
    }

    chartInstance.current.draw(dataTableInstance.current, options);
    
    // Force hide coordinate numbers after chart is drawn
    setTimeout(() => {
      if (chartRef.current) {
        const svgElements = chartRef.current.querySelectorAll('svg text');
        svgElements.forEach((textElement: any) => {
          const fontSize = textElement.getAttribute('font-size');
          const textContent = textElement.textContent;
          // Hide small text elements that are likely coordinates
          if (fontSize && (parseInt(fontSize) <= 12) && 
              (textContent.includes('.') || textContent.includes(',') || 
               textContent.includes('-') || /^\d+/.test(textContent.trim()))) {
            textElement.style.opacity = '0';
            textElement.style.visibility = 'hidden';
            textElement.style.display = 'none';
          }
        });
      }
    }, 100);
  }, [showConversionLeaders]);

  useEffect(() => {
    const google = (window as any).google;

    if (!google?.charts) {
      console.error("Google Charts not found. Make sure to include the loader script.");
      return;
    }

    google.charts.load("current", {
      packages: ["geochart"],
    });

    google.charts.setOnLoadCallback(() => {
      if (!chartRef.current) return;

      const countryStats: Record<string, { depositSum: number; userCount: number; cpas: number }> = {};

      data?.forEach((user: any) => {
        const code = (user.country || "").trim().toUpperCase();
        if (!code || code.length !== 2) return;

        const deposit = user?.net_deposits || 0;
        const isCPA = deposit >= 300; // Minimum deposit to qualify as CPA
        
        if (!countryStats[code]) {
          countryStats[code] = { depositSum: 0, userCount: 0, cpas: 0 };
        }

        countryStats[code].depositSum += deposit;
        countryStats[code].userCount += 1;
        if (isCPA) {
          countryStats[code].cpas += 1;
        }
      });

      const chartData: any[] = [
        ["Country", "Net Deposits", { role: "tooltip", type: "string", p: { html: true } }]
      ];

      // Get top 3 countries for special coloring
      const topCountries = showConversionLeaders ? conversionLeaders.slice(0, 3).map(leader => leader.code) : [];
      
      Object.entries(countryStats).forEach(([code, stats]) => {
        const isTopCountry = topCountries.includes(code);
        const conversionRate = stats.userCount > 0 ? (stats.cpas / stats.userCount) * 100 : 0;
        
        const tooltipHTML = `
          <div style="padding: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <strong>${getCountryName(code)} ${countryToFlag(code)}</strong><br/>
            Users: <b>${stats.userCount}</b><br/>
            CPAs: <b>${stats.cpas}</b><br/>
            Conversion: <b>${conversionRate.toFixed(1)}%</b><br/>
            Deposits: <b>$${stats.depositSum.toLocaleString()}</b>
            ${isTopCountry ? '<br/><span style="color: #f59e0b; font-weight: bold;">🏆 Top Performer</span>' : ''}
          </div>
        `;
        
        // Give top countries special values for gold coloring
        const value = showConversionLeaders && isTopCountry ? 
          Math.max(stats.depositSum, 1000) * (1 + (topCountries.indexOf(code) + 1) * 0.5) : 
          stats.depositSum;
          
        chartData.push([code, value, tooltipHTML]);
      });

      if (chartData.length <= 1) {
        chartRef.current.innerHTML = "<p class='text-center text-gray-500'>No data available</p>";
        return;
      }

      dataTableInstance.current = google.visualization.arrayToDataTable(chartData);
      drawRegionsMap(); // Primer render
    });

    // 👉 Aquí agregamos el observador para cambios de clase (dark/light)
    const observer = new MutationObserver(() => {
      drawRegionsMap(); // Redibuja el mapa cuando cambia dark/light
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect(); // Limpiar el observer
  }, [data, drawRegionsMap, showConversionLeaders, conversionLeaders]);

  return (
    <div className="relative" style={{ width: mapWidth, height: mapHeight }}>
      <style>
        {`
          /* Hide Google Charts coordinate numbers */
          .apex-charts svg text[text-anchor="start"],
          .apex-charts svg text[text-anchor="middle"],
          .apex-charts svg text[text-anchor="end"],
          .apex-charts svg text[font-size="10px"],
          .apex-charts svg text[font-size="11px"],
          .apex-charts svg text[font-size="12px"],
          .apex-charts svg text[fill="#666"],
          .apex-charts svg text[fill="#999"],
          .apex-charts svg text[fill="#ccc"],
          .apex-charts svg text[fill="#ffffff"],
          .apex-charts svg text[fill="#000000"] {
            opacity: 0 !important;
            visibility: hidden !important;
            display: none !important;
          }
        `}
      </style>
      <div 
        ref={chartRef} 
        style={{ 
          width: mapWidth, 
          height: mapHeight,
          // Hide coordinate numbers with CSS
          overflow: 'hidden'
        }}
        className="apex-charts"
      />
      
      {/* Geographic Conversion Leaders - Only show when expanded */}
      {showConversionLeaders && conversionLeaders.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-600 p-4" style={{ marginBottom: '60px' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              🎯 Geographic Conversion Leaders
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 italic">
              Target campaigns where quality is highest
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {conversionLeaders.map((leader) => (
              <div key={leader.code} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{leader.flag}</span>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    {leader.country}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Registrations:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{leader.registrations}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">CPAs:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{leader.cpas}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400">Rate:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {leader.conversionRate.toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-2 w-full bg-slate-200 dark:bg-slate-600 rounded-full h-1.5">
                  <div 
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(leader.conversionRate, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
