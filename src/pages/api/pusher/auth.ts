import { type NextApiRequest, type NextApiResponse } from "next";
import { gameEventService } from "~/server/pusher";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { socket_id, channel_name } = req.body as {
    socket_id: string;
    channel_name: string;
  };

  // Extract user ID from headers or query params
  // In a real app, you'd validate the user session here
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const authData = gameEventService.authenticateChannel(
      socket_id,
      channel_name,
      userId
    );

    res.status(200).json(authData);
  } catch (error) {
    console.error("Pusher auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
