import axios from "axios";

interface WebhookPayload {
  action: "create" | "update";
  collectionItem: any;
  metadata?: {
    timestamp: string;
    source: string;
    changes?: string[];
  };
}

interface WebhookConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  enabled: boolean;
}

const WEBHOOK_CONFIG: WebhookConfig = {
  baseUrl: "https://www.communityjameel.org/api/mnemo",
  timeout: 10000, // 10 seconds
  retries: 3,
  enabled: true, // Always enabled - hardcoded
};

/**
 * Send webhook notification to Community Jameel website
 */
export async function sendWebhook(
  action: "create" | "update",
  collectionItem: any,
  changes?: string[]
): Promise<boolean> {
  if (!WEBHOOK_CONFIG.enabled) {
    console.log(
      `🔕 Webhooks disabled - would have sent ${action} webhook for: ${collectionItem.slug}`
    );
    return true;
  }

  const endpoint =
    action === "create"
      ? `${WEBHOOK_CONFIG.baseUrl}/create-collection-item`
      : `${WEBHOOK_CONFIG.baseUrl}/update-collection`;

  const payload: WebhookPayload = {
    action,
    collectionItem,
    metadata: {
      timestamp: new Date().toISOString(),
      source: "mnemosyne-functions",
      ...(changes && { changes }),
    },
  };

  console.log(`📤 Sending ${action} webhook to: ${endpoint}`);
  console.log(`📋 Payload preview:`, {
    action: payload.action,
    itemId: collectionItem.id,
    itemSlug: collectionItem.slug,
    itemType: collectionItem.type,
    itemTitle: collectionItem.title,
    changes: changes || "N/A",
  });

  // 🔍 FULL PAYLOAD LOGGING for debugging
  console.log(`📦 FULL WEBHOOK PAYLOAD:`, JSON.stringify(payload, null, 2));

  let lastError: Error | null = null;

  // Retry logic
  for (let attempt = 1; attempt <= WEBHOOK_CONFIG.retries; attempt++) {
    try {
      const response = await axios.post(endpoint, payload, {
        timeout: WEBHOOK_CONFIG.timeout,
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mnemosyne-Webhook/1.0",
          // Add authentication headers if needed
          // 'Authorization': `Bearer ${process.env.WEBHOOK_API_KEY}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ Webhook ${action} successful (attempt ${attempt}):`, {
          status: response.status,
          itemSlug: collectionItem.slug,
          responseData: response.data,
        });
        return true;
      } else {
        lastError = new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
        console.warn(`⚠️ Webhook ${action} failed (attempt ${attempt}):`, {
          status: response.status,
          itemSlug: collectionItem.slug,
          response: response.data,
        });
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `⚠️ Webhook ${action} error (attempt ${attempt}/${WEBHOOK_CONFIG.retries}):`,
        {
          itemSlug: collectionItem.slug,
          error: lastError.message,
        }
      );

      // Wait before retry (exponential backoff)
      if (attempt < WEBHOOK_CONFIG.retries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Retrying webhook in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // All retries failed
  console.error(
    `❌ Webhook ${action} failed after ${WEBHOOK_CONFIG.retries} attempts:`,
    {
      itemSlug: collectionItem.slug,
      finalError: lastError?.message,
    }
  );

  // Log to a webhook failure table or service for later retry
  await logWebhookFailure(action, collectionItem, lastError);

  return false;
}

/**
 * Log webhook failures for manual retry or debugging
 */
async function logWebhookFailure(
  action: "create" | "update",
  collectionItem: any,
  error: Error | null
): Promise<void> {
  try {
    // You could save to database, send to logging service, etc.
    console.error(`📝 Logging webhook failure:`, {
      action,
      itemId: collectionItem.id,
      itemSlug: collectionItem.slug,
      itemType: collectionItem.type,
      error: error?.message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Implement persistent logging
    // Example: Save to webhook_failures table for later retry
    // await pool.query(`
    //   INSERT INTO webhook_failures (action, collection_item_id, error_message, created_at)
    //   VALUES ($1, $2, $3, NOW())
    // `, [action, collectionItem.id, error?.message]);
  } catch (logError) {
    console.error(`❌ Failed to log webhook failure:`, logError);
  }
}

/**
 * Send webhook with error handling that doesn't block main operation
 */
export async function sendWebhookSafe(
  action: "create" | "update",
  collectionItem: any,
  changes?: string[]
): Promise<void> {
  try {
    // Fire webhook asynchronously - don't block the main response
    setImmediate(async () => {
      await sendWebhook(action, collectionItem, changes);
    });
  } catch (error) {
    console.error(`❌ Webhook setup error:`, error);
  }
}
