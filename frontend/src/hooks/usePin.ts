import type { MarkerData } from "@/types/Marker";
import type { User } from "@/types/User";
import type { WaterRecord } from "@/types/WaterRecord";
import { useEffect, useState } from "react";

export default function usePin() {
  const [markerData, setMarkerData] = useState<MarkerData[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const [usersRes, waterRecordsRes] = await Promise.all([
        fetch(`http://127.0.0.1:5000/api/v1/users`),
        fetch(`http://127.0.0.1:5000/api/v1/water_records`),
      ]);
      const users: User[] = await usersRes.json();
      const waterRecords: WaterRecord[] = await waterRecordsRes.json();

      const latestRecordMap = new Map<User["user_id"], WaterRecord>();
      for (const record of waterRecords) {
        const current = latestRecordMap.get(record.user_id);
        if (
          !current ||
          new Date(record.water_date) > new Date(current.water_date)
        ) {
          latestRecordMap.set(record.user_id, record);
        }
      }
      const markers: MarkerData[] = users
        .map((user) => {
          const latest = latestRecordMap.get(user.user_id);
          if (!latest) return null;
          return {
            id: latest.user_id,
            user_id: user.user_id,
            user_name: user.user_name,
            message: latest.comment || undefined,
            iconUrl: user.photo_url || undefined,
            water_amount: latest.water_amount,
            water_datetime: latest.water_date,
            lat: latest.lat,
            lon: latest.lon,
          } as MarkerData;
        })
        .filter((marker): marker is MarkerData => marker !== null);
      setMarkerData(markers);
    };
    fetchData();
  }, []);
  return {
    markerData,
  };
}
