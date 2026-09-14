module.exports = async (req, res) => {
  // Clean the path to handle simple routings
  const urlPath = req.url.split('?')[0];

  console.log('[Router] Request path: ${urlPath}');

  try {
    // Current routings
    if (urlPath === '/cron/withyou-nudge') {
      const job = require('./cron-jobs/withyou-nudge.js');
      return await job(req, res);
    }

    // Default fallback if route doesn't match
    return res.status(404).json({ error: "Route not found" });

  } catch (error) {
    return res.status(500).json({ error: "Router Error", details: error.message });
  }
};
