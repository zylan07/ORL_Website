import { supabase } from "./supabase";

/**
 * Non-blocking utility to write administrative audit logs to Supabase.
 * Any errors during logging are captured and logged as warnings, never throwing or blocking parent execution.
 */
export async function writeAuditLog(
  action: string,
  entityType?: string,
  entityId?: string,
  details?: string
): Promise<void> {
  const logPrefix = `[Audit Log - ${action}]`;
  
  if (!supabase) {
    console.log(`${logPrefix} Running in offline mode. Details:`, { entityType, entityId, details });
    return;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userEmail = session?.user?.email || "unauthenticated";

    // Insert row asynchronously without awaiting or block
    const insertPromise = supabase
      .from("admin_audit_logs")
      .insert({
        user_email: userEmail,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details: details || ""
      });

    // Handle failure in a separate chain to prevent throwing into parent thread
    insertPromise.then(({ error }) => {
      if (error) {
        console.warn(`${logPrefix} Failed to write audit log row:`, error.message);
      } else {
        console.log(`${logPrefix} Logged action by ${userEmail}`);
      }
    }).catch(err => {
      console.warn(`${logPrefix} Network/Unexpected error logging action:`, err);
    });

  } catch (err: any) {
    console.warn(`${logPrefix} Failed to query session for audit logs:`, err?.message || err);
  }
}
