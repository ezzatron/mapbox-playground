import { Feature, FeatureCollection } from "geojson";
import type { NextApiRequest, NextApiResponse } from "next";
import seedrandom from "seedrandom";
import { maximumLat, maximumLng, minimumLat, minimumLng } from "src/bounds";
import { startTime } from "../../../../start-time";

export default function map(
  req: NextApiRequest,
  res: NextApiResponse<FeatureCollection>,
) {
  const { sessionId = "" } = req.query;
  const requestTime = Date.now();

  const random = seedrandom(JSON.stringify([startTime, sessionId]));
  const transactionCount =
    10 + Math.floor((Number(requestTime) - Number(startTime)) / 3000);

  const features: Feature[] = [];

  for (let i = 0; i < transactionCount; i++) {
    const lat = random() * (maximumLat - minimumLat) + minimumLat;
    const lng = random() * (maximumLng - minimumLng) + minimumLng;

    features.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      properties: {
        id: `TXN${i.toString().padStart(4, "0")}}`,
        isLatest: i === transactionCount - 1,
      },
    });
  }

  res.status(200).json({ type: "FeatureCollection", features });
}