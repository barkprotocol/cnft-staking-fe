import { Buffer } from 'buffer';

interface ApiResponse {
  success: boolean;
  data?: any;  // Replace `any` with a specific type if known
  error?: string;
}

/**
 * Sends the transaction data to the backend API for signing.
 *
 * @param txData - The transaction data to be sent, represented as a Buffer.
 * @returns The API response, containing the signed transaction or status information.
 * @throws Error if the request fails or if an error is returned from the API.
 */
export async function sendAdminTransaction(txData: Buffer): Promise<ApiResponse> {
  // Define the endpoint, ideally should come from environment variables or configuration
  const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT || "/api/sign";

  if (!endpoint) {
    throw new Error("API endpoint is not defined in environment variables.");
  }

  // Convert Buffer to Base64 string
  const base64TxData = txData.toString("base64");

  // Configure the fetch options
  const fetchOptions: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ txData: base64TxData }), // Convert Buffer to Base64 string
  };

  try {
    // Perform the fetch request
    const response = await fetch(endpoint, fetchOptions);

    // Check for HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    // Parse and validate the JSON response
    const result: ApiResponse = await response.json();

    // Check if API response indicates an error
    if (!result.success) {
      throw new Error(result.error || "Unknown API error");
    }

    return result;
  } catch (error) {
    // Log the error and rethrow for further handling
    console.error("Error sending transaction data to the API:", error);
    throw new Error(`Failed to send transaction data: ${error.message}`);
  }
}
