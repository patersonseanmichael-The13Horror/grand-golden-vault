export type RtpProfile = {
  launchDate?: string;
  switchAfterDays?: number;
  launchRtp?: number;
  postLaunchRtp?: number;
};

export function getActiveRtp(baseRtp: number, profile?: RtpProfile): number {
  if (!profile?.launchDate || !profile?.postLaunchRtp) {
    return baseRtp;
  }

  const launchMs = Date.parse(profile.launchDate);
  if (Number.isNaN(launchMs)) {
    return baseRtp;
  }

  const switchAfterDays = profile.switchAfterDays ?? 10;
  const switchMs = launchMs + switchAfterDays * 24 * 60 * 60 * 1000;
  return Date.now() >= switchMs ? profile.postLaunchRtp : (profile.launchRtp ?? baseRtp);
}
