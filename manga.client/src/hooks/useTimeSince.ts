import { useMemo } from 'react';

function useTimeSince(date: string): string {
  return useMemo(() => {
    const now = new Date();
    const targetDate = new Date(date);
    const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    let interval = seconds / 31536000;

    interval = seconds / 2592000;
    if (interval >= 6) {
      return "半年以上前";
    }

    if (interval >= 1) {
      return Math.floor(interval) + "ヶ月前";
    }

    interval = seconds / 86400;
    if (interval >= 1) {
      return Math.floor(interval) + "日前";
    }

    interval = seconds / 3600;
    if (interval >= 1) {
      return Math.floor(interval) + "時間前";
    }

    interval = seconds / 60;
    if (interval >= 1) {
      return Math.floor(interval) + "分前";
    }

    return Math.floor(seconds) + "秒前";
  }, [date]);
}

export default useTimeSince;
