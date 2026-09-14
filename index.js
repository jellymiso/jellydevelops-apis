module.exports = async (req, res) => {
  // Clean the path to handle simple routings
  const urlPath = req.url.split('?')[0];

  console.log(`[Router] Request path: ${urlPath}`);

  try {
    // 1. MASK THE ROOT PATH: Render a completely blank white page to the public
    if (urlPath === '/' || urlPath === '') {
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send('');
    }

    // 2. Secret background task execution path
    if (urlPath === '/cron/withyou-nudge') {
      const job = require('./cron-jobs/withyou-nudge.js');
      return await job(req, res);
    }

    // 3. Default fallback for any other unmapped secret paths
    return res.status(404).json({ error: "Route not found" });

  } catch (error) {
    console.error(`[Router Error]`, error.message);
    return res.status(500).json({ error: "Router Error", details: error.message });
  }
};
