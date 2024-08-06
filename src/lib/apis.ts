import { BASE_URL } from "@/config";
import { PoolStatus } from "@/utils/type";
import axios, { AxiosResponse } from "axios";

// Utility function to handle API requests and errors
const postRequest = async <T>(
  url: string,
  data: object
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axios.post(url, data);
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || "An unexpected error occurred";
    console.error(`Error in POST request to ${url}:`, errorMessage);
    throw new Error(errorMessage);
  }
};

// Function to add NFTs to a pool for mining
export const poolMiner = async (
  nftAddresses: string[],
  ownerAddress: string,
  signature: string
): Promise<any> => {
  return postRequest(`${BASE_URL}/poolMiner`, {
    nftAddresses,
    ownerAddress,
    signature,
  });
};

// Function to withdraw NFTs from the mining pool
export const withdrawMinerFromPool = async (
  nftAddresses: string[],
  ownerAddress: string,
  signature: string
): Promise<any> => {
  return postRequest(`${BASE_URL}/withdrawMinerFromPool`, {
    nftAddresses,
    ownerAddress,
    signature,
  });
};

// Function to check the status of NFTs in the mining pool
export const minerPoolStatus = async (
  nftAddresses: string[]
): Promise<PoolStatus[]> => {
  return postRequest<PoolStatus[]>(`${BASE_URL}/minerPoolStatus`, {
    nftAddresses,
  });
};

// Function to claim rewards from the mining pool
export const claimPoolRewards = async (
  ownerAddress: string
): Promise<any> => {
  return postRequest(`${BASE_URL}/claimPoolRewards`, {
    ownerAddress,
  });
};
