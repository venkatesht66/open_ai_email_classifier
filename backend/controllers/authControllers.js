const { oauth2Client, SCOPES } = require("../config/googleConfig");

const googleLogin = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });
  res.redirect(url);
};

const googleCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;
    console.log("Google login successful.");
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (err) {
    console.error("OAuth Error:", err);
    res.status(500).send("Authentication Failed");
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
};

module.exports = {googleLogin,googleCallback,logout}