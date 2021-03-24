import ecsMeta from "~/ecs-meta.json";
import applicationDev from "~/properties/application-dev.json";

import consul from "#/services/base/consul.service";
import { VaultResponse } from "#/models/vault.model";
import { login, read } from "#/services/base/vault.service";
import {
  Consul,
  Url as ConsulUrl,
  Props as ConsulProps,
} from "#/models/consul.model";

import { config } from "./constants";

class ApplicationProperties {
  private properties: Consul = { url: {} as ConsulUrl };

  constructor() {
    this.properties.url = applicationDev.url;

    this.init();
  }

  private init = async () => {
    try {
      console.info(
        `Reading consul entry for : config/${ecsMeta.service_name}/${config.apiName}/${config.apiVersion}/data`
      );

      this.properties = await this.getConsulValues();

      console.info(
        `Entries read from consul: apis ${JSON.stringify(
          this.properties.apis
        )} constant ${JSON.stringify(this.properties.constants)} `
      );

      this.properties.vault = await this.getVaultValues(
        this.properties.vault || []
      );
    } catch (error) {
      console.error(error);
    }

    this.setEnvVars();
  };

  public getValues = () => this.properties;

  public getValue = (key: keyof Consul) => this.properties[key];

  private setEnvVars = () => {
    if (!this.properties) return;

    Object.entries(this.properties?.url || [])?.map(
      ([key, value]) => (process.env[key.toUpperCase()] = value)
    );

    this.properties?.apis?.map(
      (api) => (process.env[api.name.toUpperCase()] = api.value)
    );

    this.properties?.vault?.map(
      (vault) => (process.env[vault.name.toUpperCase()] = vault.value)
    );

    this.properties?.constants?.map(
      (constant) => (process.env[constant.name.toUpperCase()] = constant.value)
    );
  };

  private getConsulValues = async () => {
    return consul.getJson<Consul>(
      `config/${ecsMeta.service_name}/${config.apiVersion}/data`
    );
  };

  private getVaultValues = async (
    vaults: ConsulProps[]
  ): Promise<ConsulProps[]> => {
    if (!vaults || vaults.length === 0) return [];

    let result = [...vaults];

    try {
      console.info(`vault: getting values for vault!`);

      const client = await login(config.apiName);

      if (!client) return [];

      vaults.forEach(async (vault) => {
        let value: VaultResponse<any>;

        try {
          value = await read({ client, path: vault.path });

          if (typeof value === "object") {
            (Object.keys(value) as [keyof VaultResponse<any>]).forEach(
              (key) => {
                const newEntryValue = value[key];
                const newEntryName = key.toUpperCase();

                result = [
                  ...result,
                  {
                    path: key,
                    name: newEntryName,
                    value: newEntryValue,
                  },
                ];

                vault.name = `${vault.name.toUpperCase()}_ ${value.data.toUpperCase()}`;
                vault.value = value.data;
              }
            );
          } else {
            vault.value = value;
          }

          console.info(`vault: finished reading values for vault!`);

          result.forEach((value) => {
            console.info(`vault: entry called ${value.name} created!`);
          });
        } catch (error) {
          console.error(`vault: error reading path ${vault.path}`);
        }

        console.info(`vault: successfully read path ${vault.path}`);
      });
    } catch (error) {
      console.info(`vault: error in fetch vault values!`);
    }
    return result;
  };
}

export const init = new ApplicationProperties();
