import { useMemo } from 'react';

function useTimeSince(date: string): string {
  return useMemo(() => {
    const now = new Date();
    const targetDate = new Date(date);
    const seconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    const sevenDaysInSeconds = 7 * 24 * 60 * 60;

    if (seconds > sevenDaysInSeconds) {
      // 7日以上前の場合、具体的な日時を表示
      return `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日 ${targetDate.getHours()}時${targetDate.getMinutes()}分`;
    }

    // 7日以内の場合、相対的な日時を表示
    let interval = seconds / 31536000;
    if (interval >= 1) {
      return Math.floor(interval) + "年前";
    }
    interval = seconds / 2592000;
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
