import * as chatService from "./chat.service.js";
import * as messageService from "./message.service.js";
import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// Helper to format YYYY-MM-DD for a Date
const toYMD = (d: Date) => d.toISOString().slice(0, 10);

// Dashboard analytics service to aggregate user activity data
export const getUserAnalytics = async (userId: string, days = 7) => {
  try {
    const [totalChatSessions, totalMessagesSent, lastActiveChat] =
      await Promise.all([
        chatService.getTotalChatSessionsByUserId(userId),
        messageService.getTotalMessagesSentByUserId(userId),
        chatService.getLastActiveChatByUserId(userId),
      ]);

    // build labels for last `days` days (including today)
    const labels: string[] = [];
    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      labels.push(toYMD(d));
    }

    // Compute start date for queries
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - (days - 1));

    // Get user's chats and their ids
    const chats = await Chat.find({ userId }).select("_id createdAt");
    const chatIds = chats.map((c) => c._id);

    // Aggregate messages per day for this user's chats
    const messagesAgg = await Message.aggregate([
      {
        $match: {
          chatId: { $in: chatIds },
          isUser: true,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    const messagesMap = new Map<string, number>();
    messagesAgg.forEach((r: any) => messagesMap.set(r._id, r.count));

    // Aggregate active chat sessions per day based on message activity
    // Count distinct chatIds that had activity on each day
    const chatsAgg = await Message.aggregate([
      { $match: { chatId: { $in: chatIds }, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            chatId: "$chatId",
          },
        },
      },
      { $group: { _id: "$_id.date", count: { $sum: 1 } } },
    ]);

    const chatsMap = new Map<string, number>();
    chatsAgg.forEach((r: any) => chatsMap.set(r._id, r.count));

    // Build arrays aligned with labels
    const messages: number[] = labels.map((lab) => messagesMap.get(lab) ?? 0);
    const sessions: number[] = labels.map((lab) => chatsMap.get(lab) ?? 0);
    const avgMsgsPerSession: number[] = labels.map((lab, idx) => {
      const s = sessions[idx] || 0;
      const m = messages[idx] ?? 0;
      return s === 0 ? 0 : Math.round((m / s) * 10) / 10;
    });

    return {
      totalChatSessions,
      totalMessagesSent,
      lastActiveChat,
      timeSeries: {
        labels,
        messages,
        sessions,
        avgMsgsPerSession,
      },
    };
  } catch (error) {
    throw error;
  }
};
