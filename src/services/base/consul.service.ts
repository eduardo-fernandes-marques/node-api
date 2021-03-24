import ConsulModule from "consul";

import { config } from "#/config/constants";
import { addUrlProtocol } from "#/utils/protocol";
import { ConsulKeysResponse } from "#/models/consul.model";

class Consul {
  private consul: ConsulModule.Consul;

  constructor() {
    const url = new URL(
      addUrlProtocol({ url: config.consulServer, protocol: "http" })
    );
    const isHttps = url.protocol === "https:";

    this.consul = ConsulModule({
      promisify: true,
      secure: isHttps,
      host: url.hostname,
      port: url.port || (isHttps ? "443" : "8500"),
      defaults: {
        token: config.consulAclToken,
      },
    });
  }

  async getTextPlain(path: string) {
    const result = await this.consul.kv.get<ConsulKeysResponse>(path);

    return result;
  }

  async getJson<T>(path: string): Promise<T> {
    const response = await this.getTextPlain(path);

    if (!response) return {} as T;

    return JSON.parse(response?.Value || "");
  }
}

export default new Consul();
