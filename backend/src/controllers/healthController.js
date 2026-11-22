export function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'rimtech-api',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}
