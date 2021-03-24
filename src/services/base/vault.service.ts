import VaultAuthAws from "vault-auth-aws";
import VaultModule, { client, Option } from "node-vault";

import EcsMeta from "~/ecs-meta.json";

import { config, isProd } from "#/config/constants";
import { addUrlProtocol } from "#/utils/protocol";
import { VaultResponse, VaultUrl } from "#/models/vault.model";

export const authenticate = async ({
  url,
  role,
}: {
  role: string;
  url: VaultUrl;
}) => {
  if (!isProd()) return config.vaultAuth;

  const client = new VaultAuthAws({
    ssl: true,
    apiVersion: "v1",
    vaultAppName: role,
    sslRejectUnAuthorized: true,
    vaultLoginUrl: "auth/aws/login",
    ...url,
  });

  const vaultLogin = await client.authenticate();

  return vaultLogin.auth.client_token;
};

export const login = async (role: string) => {
  const url = new URL(addUrlProtocol({ url: config.vaultServer }));
  const isHttps = url.protocol === "https:";
  const port = Number(url.port || 8200);

  const vaultUrl: VaultUrl = {
    ssl: isHttps,
    host: url.hostname,
    port: !isNaN(port) ? port : 8200,
  };

  const client_token = await authenticate({ role, url: vaultUrl });

  return VaultModule({
    apiVersion: "v1",
    endpoint: `${vaultUrl.ssl ? "https" : "http"}://${vaultUrl.host}:${
      vaultUrl.port
    }`,
    token: client_token,
  });
};

export const read = async ({
  path,
  option,
  client,
}: {
  path: string;
  option?: Option;
  client?: client;
}): Promise<VaultResponse<any>> => {
  const { data } = await (client || (await login(EcsMeta.service_name))).read(
    path,
    option
  );

  return data as VaultResponse<any>;
};
