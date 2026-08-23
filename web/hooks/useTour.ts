import { useState, useEffect } from 'react';

export function useTour(tourId: string) {
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(`tour_completed_${tourId}`);
    const showTourSetting = localStorage.getItem('show_tours');

    if (!completed && showTourSetting !== 'false') {
      setShowTour(true);
    }
  }, [tourId]);

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem(`tour_completed_${tourId}`, 'true');
  };

  const resetTour = () => {
    localStorage.removeItem(`tour_completed_${tourId}`);
    setShowTour(true);
  };

  return { showTour, completeTour, resetTour };
}
