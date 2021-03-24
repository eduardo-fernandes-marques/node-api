export const addUrlProtocol = ({
  url,
  protocol = "https",
}: {
  url: string;
  protocol?: string;
}) => {
  if (!url.match(/^[a-zA-Z]+:\/\//)) {
    return `${protocol}://${url}`;
  }

  const newUrl = new URL(url);

  newUrl.protocol = `${protocol}:`;
  
  return newUrl.toString();
};
