const { google, oauth2Client } = require("../config/googleConfig");

const fetchEmails = async (req, res) => {
  if (!req.session.tokens) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    oauth2Client.setCredentials(req.session.tokens);
    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    const response = await gmail.users.messages.list({
      userId: "me",
      maxResults: 15,
    });

    const messages = response.data.messages || [];
    const emails = [];

    for (const msg of messages) {
      const message = await gmail.users.messages.get({
        userId: "me",
        id: msg.id,
        format: "metadata",
        metadataHeaders: ["Subject", "From", "Date"],
      });

      const headers = message.data.payload.headers;
      const subject = headers.find((h) => h.name === "Subject")?.value || "";
      const from = headers.find((h) => h.name === "From")?.value || "";
      const date = headers.find((h) => h.name === "Date")?.value || "";

      emails.push({ subject, from, date });
    }

    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ error: "Failed to fetch emails" });
  }
};

module.exports = {fetchEmails};