import type { WaterRecord } from "@/types/WaterRecord";
import dayjs from "dayjs";

export default function TimeProgress(water_date: WaterRecord["water_date"]) {
  const dateFrom = dayjs(Date.now());
  const dateTo = dayjs(water_date);
  const diff = dateFrom.diff(dateTo, "minutes");

  let progress: number;

  if (diff > 120) {
    progress = 0;
  } else {
    progress = 1 - diff / 120;
  }
  return { progress };
}
