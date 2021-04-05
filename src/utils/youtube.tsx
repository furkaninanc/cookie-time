interface IGetVideoId {
  (url: string): string | undefined;
}

export const getVideoId: IGetVideoId = (url) => {
  try {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w-]{10,12})\b/
    );

    if (match) return match[1];
  } catch (err) {
    return undefined;
  }

  return undefined;
};

export default {};
