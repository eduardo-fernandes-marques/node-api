import got from "got";

export const client = (url: string) =>
  got.extend({
    prefixUrl: url,
    timeout: 30000,
    hooks: {
      beforeRequest: [
        (options) => {
          options.headers.token = "";
        },
      ],
      afterResponse: [
        (response) => {
          return response;
        },
      ],
    },
  });
