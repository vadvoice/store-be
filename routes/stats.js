const express = require('express');
const router = express.Router();
const { StatsRepo } = require('../repository');
const geoip = require('geoip-lite');
const useragent = require('express-useragent');

const isLocalhost = function (req) {
   const ip = req.connection.remoteAddress;
   const host = req.get('host');
   return ip === "127.0.0.1" || ip === "::ffff:127.0.0.1" || ip === "::1" || host.indexOf("localhost") !== -1;
}

/**
 * POST track incoming IPs.
 */
router.post('/track', async (req, res, next) => {
   if (!isLocalhost(req)) {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const stats = geoip.lookup(ip.split(':')[0]);
      const source = req.headers['user-agent'];
      const { browser, version, os, platform } = useragent.parse(source);

      StatsRepo.collect({
         ip,
         timestamp: Date.now(),
         stats,
         userAgent: { browser, version, os, platform }
      })
   }
   res.end();
});

router.get('/stats', async (req, res, next) => {
   const stats = await StatsRepo.list();
   res.json(stats);
});

module.exports = router;
