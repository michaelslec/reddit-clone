import DataLoader from "dataloader";
import { Upper } from "../entities/Upper";

export default function createUpperLoader() {
  return new DataLoader<{ postId: number; userId: number }, Upper | null>(
    async (keys) => {
      const uppers = await Upper.findByIds(keys as any);
      const upperIdsToUpper: Record<string, Upper> = {};
      uppers.forEach((upper) => {
        upperIdsToUpper[`${upper.userId}|${upper.postId}`] = upper;
      });

      return keys.map((key) => upperIdsToUpper[`${key.userId}|${key.postId}`]);
    }
  );
}
