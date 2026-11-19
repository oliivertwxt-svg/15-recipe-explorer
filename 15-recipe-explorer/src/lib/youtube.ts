const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
]);

export function getYoutubeEmbedUrl(watchUrl: string): string | null {
  try {
    const url = new URL(watchUrl);
    const videoId = url.searchParams.get("v");

    if (
      url.protocol !== "https:" ||
      !YOUTUBE_HOSTS.has(url.hostname) ||
      url.pathname !== "/watch" ||
      !videoId ||
      !/^[\w-]{11}$/.test(videoId)
    ) {
      return null;
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  } catch {
    return null;
  }
}
