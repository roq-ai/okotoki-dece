const mapping: Record<string, string> = {
  'bitcoin-infos': 'bitcoin_info',
  organizations: 'organization',
  'suggested-updates': 'suggested_updates',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
