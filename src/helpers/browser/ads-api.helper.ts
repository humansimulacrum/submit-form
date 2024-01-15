import axios from "axios";
export type QueryParams = Record<string, any>;

export interface CreateAdsBrowserDto {
  name: string;
  group_id: string;
  user_proxy_config?: any;
  proxyid?: number;
}

export const adsPowerClient = axios.create({
  baseURL: "http://local.adspower.net:50325",
});

const fetchAdsDataWrapper = async (url: string, queryParams?: QueryParams) => {
  const { data: response } = await adsPowerClient.get(url, {
    params: queryParams,
  });

  if (response.code !== 0) {
    if (response.msg) {
      throw new Error(response.msg);
    }

    console.error(response);
    throw new Error("Undefined ads response");
  }

  return response;
};

const postAdsDataWrapper = async (url: string, body: any) => {
  const { data: response } = await adsPowerClient.post(url, body);

  if (response.code !== 0) {
    if (response.msg) {
      throw new Error(response.msg);
    }

    console.error(response);
    throw new Error("Undefined ads response");
  }

  return response;
};

export const getAdsGroups = async () => {
  const getGroupsResponse = await fetchAdsDataWrapper("/api/v1/group/list", {
    page_size: 2000,
  });

  const { list: groupsList } = getGroupsResponse.data;

  return [...groupsList, { group_id: "0", group_name: "Ungrouped" }];
};

export const isActiveBrowser = async (queryParams: QueryParams) => {
  const isActiveResponse = await fetchAdsDataWrapper(
    "/api/v1/browser/active",
    queryParams,
  );

  return isActiveResponse.data.status;
};

export const getAdsStatus = async () => {
  const adsStatusResponse = await fetchAdsDataWrapper("/status");
  return adsStatusResponse;
};

export const getBrowsers = async (queryParams: QueryParams) => {
  const ungroupedBrowsersResponse = await fetchAdsDataWrapper(
    "/api/v1/user/list",
    queryParams,
  );
  return ungroupedBrowsersResponse.data?.list;
};

export const getBrowserByName = async (name: string) => {
  const allBrowsers: any[] = await getBrowsers({ page_size: 100 });
  return allBrowsers.find((browser) => browser.name === name);
};

export const stopBrowser = async (queryParams: QueryParams) => {
  const stopBrowserResponse = await fetchAdsDataWrapper(
    "/api/v1/browser/stop",
    queryParams,
  );
  return stopBrowserResponse;
};

export const deleteOneOrMoreBrowsers = async (queryParams: QueryParams) => {
  const deleteBrowserResponse = await postAdsDataWrapper(
    "/api/v1/user/delete",
    queryParams,
  );

  return deleteBrowserResponse;
};

export const createBrowser = async (body: CreateAdsBrowserDto) => {
  const createBrowserResponse = await postAdsDataWrapper(
    "/api/v1/user/create",
    body,
  );
  return createBrowserResponse;
};

export const openBrowser = async (queryParams: QueryParams) => {
  const openBrowserResponse = await fetchAdsDataWrapper(
    "/api/v1/browser/start",
    queryParams,
  );
  return openBrowserResponse;
};
