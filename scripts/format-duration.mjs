// Formats a duration in milliseconds for log lines, e.g. "1h 2m 3s".
export function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const parts = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(" ");
}

// Average of the given durations, formatted.
export function averageDuration(durations) {
  const total = durations.reduce((sum, d) => sum + d, 0);
  return formatDuration(total / durations.length);
}
