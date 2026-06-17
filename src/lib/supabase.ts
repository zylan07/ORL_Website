import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("Supabase credentials missing. Supabase integration is disabled; running in offline/local-first mode.");
}

/**
 * Exports settings, datasets, records, and assets registry into a downloadable JSON file.
 * Run window.exportCompleteBackup() in the console.
 */
export async function exportCompleteBackup() {
  console.log("Generating complete backup export...");
  try {
    const { exportSiteBackup } = await import("./admin-store");
    const backupData = exportSiteBackup();
    const blob = new Blob([backupData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orl_complete_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("✅ Complete backup exported and downloaded successfully.");
  } catch (e: any) {
    console.error("❌ Failed to export complete backup:", e);
  }
}

interface MigrationReport {
  migrated: number;
  failed: number;
  skipped: number;
  errors: string[];
}

/**
 * Migrates local settings, datasets, and repository records to Supabase.
 * Run window.migrateLocalDataToSupabase() in the console.
 */
export async function migrateLocalDataToSupabase(): Promise<MigrationReport> {
  const report: MigrationReport = {
    migrated: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  console.log("Starting local data migration to Supabase...");

  if (!supabase) {
    const errMsg = "Supabase client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";
    console.error(errMsg);
    report.errors.push(errMsg);
    report.failed++;
    return report;
  }

  try {
    const { getSettings, DATA_SEEDS } = await import("./admin-store");
    const { getRecords, getPageTexts, getCarouselConfig } = await import("./storage-service");

    console.log("Fetching existing metadata from Supabase to prevent overwrites...");
    
    // Existing site settings check by 'key' column
    let settingsExist = false;
    try {
      const { data: extSettings } = await supabase.from("site_settings").select("key").eq("key", "site_settings").maybeSingle();
      if (extSettings) settingsExist = true;
    } catch (e) {
      console.warn("Could not check existing settings, assuming none.", e);
    }

    // Existing datasets check
    const existingDatasetKeys = new Set<string>();
    try {
      const { data: extDatasets } = await supabase.from("datasets").select("dataset_key");
      extDatasets?.forEach((d) => existingDatasetKeys.add(d.dataset_key));
    } catch (e) {
      console.warn("Could not check existing datasets, assuming none.", e);
    }

    // Existing records check by 'record_key' column (stable record IDs)
    const existingRecordIds = new Set<string>();
    try {
      const { data: extRecords } = await supabase.from("records").select("record_key");
      extRecords?.forEach((r) => {
        if (r.record_key) {
          existingRecordIds.add(r.record_key);
        }
      });
    } catch (e) {
      console.warn("Could not check existing records, assuming none.", e);
    }

    // 1. Settings Migration
    if (settingsExist) {
      console.log("Skipping site settings: already exists in Supabase.");
      report.skipped++;
    } else {
      try {
        const settings = getSettings();
        console.log("Migrating site settings...");
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key: "site_settings", value: settings }, { onConflict: "key" });
        if (error) throw error;
        console.log("✅ Site settings migrated successfully.");
        report.migrated++;
      } catch (err: any) {
        console.error("❌ Failed to migrate settings:", err);
        report.errors.push(`Settings: ${err.message || err}`);
        report.failed++;
      }
    }

    // 2. Datasets Migration
    for (const key of Object.keys(DATA_SEEDS)) {
      if (existingDatasetKeys.has(key)) {
        console.log(`Skipping dataset ${key}: already exists in Supabase.`);
        report.skipped++;
        continue;
      }
      try {
        console.log(`Migrating dataset: ${key}...`);
        const raw = localStorage.getItem(`uwarl-db-${key}`);
        const data = raw ? JSON.parse(raw) : DATA_SEEDS[key as keyof typeof DATA_SEEDS];
        const { error } = await supabase
          .from("datasets")
          .upsert({ dataset_key: key, data }, { onConflict: "dataset_key" });
        if (error) throw error;
        console.log(`✅ Dataset ${key} migrated successfully.`);
        report.migrated++;
      } catch (err: any) {
        console.error(`❌ Failed to migrate dataset ${key}:`, err);
        report.errors.push(`Dataset ${key}: ${err.message || err}`);
        report.failed++;
      }
    }

    // 3. Records Migration
    try {
      const records = getRecords();
      console.log(`Migrating ${records.length} repository records...`);
      for (const rec of records) {
        if (existingRecordIds.has(rec.id)) {
          console.log(`Skipping record ${rec.id}: already exists in Supabase.`);
          report.skipped++;
          continue;
        }
        try {
          const { error } = await supabase
            .from("records")
            .upsert({ record_key: rec.id, data: rec }, { onConflict: "record_key" });
          if (error) throw error;
          report.migrated++;
        } catch (err: any) {
          console.error(`❌ Failed to migrate record ${rec.id}:`, err);
          report.errors.push(`Record ${rec.id}: ${err.message || err}`);
          report.failed++;
        }
      }
      console.log("✅ Repository records migration completed.");
    } catch (err: any) {
      console.error("❌ Failed to migrate records list:", err);
      report.errors.push(`Records List: ${err.message || err}`);
      report.failed++;
    }

    // 4. Carousels Migration
    if (existingDatasetKeys.has("repo-carousels")) {
      console.log("Skipping carousels: already exists in Supabase.");
      report.skipped++;
    } else {
      try {
        console.log("Migrating carousels config...");
        const config = getCarouselConfig();
        const { error } = await supabase
          .from("datasets")
          .upsert({ dataset_key: "repo-carousels", data: config }, { onConflict: "dataset_key" });
        if (error) throw error;
        console.log("✅ Carousels config migrated successfully.");
        report.migrated++;
      } catch (err: any) {
        console.error("❌ Failed to migrate carousels:", err);
        report.errors.push(`Carousels: ${err.message || err}`);
        report.failed++;
      }
    }

    // 5. Page Texts Migration
    if (existingDatasetKeys.has("repo-pagetext")) {
      console.log("Skipping page texts: already exists in Supabase.");
      report.skipped++;
    } else {
      try {
        console.log("Migrating page texts...");
        const pageTexts = getPageTexts();
        const { error } = await supabase
          .from("datasets")
          .upsert({ dataset_key: "repo-pagetext", data: pageTexts }, { onConflict: "dataset_key" });
        if (error) throw error;
        console.log("✅ Page texts migrated successfully.");
        report.migrated++;
      } catch (err: any) {
        console.error("❌ Failed to migrate page texts:", err);
        report.errors.push(`PageTexts: ${err.message || err}`);
        report.failed++;
      }
    }

  } catch (globalErr: any) {
    console.error("❌ Global error during data migration:", globalErr);
    report.errors.push(`Global: ${globalErr.message || globalErr}`);
    report.failed++;
  }

  console.log("Data migration completed. Summary:");
  console.table(report);
  return report;
}

function base64ToBlob(base64: string): { blob: Blob; mimeType: string } {
  const parts = base64.split(";base64,");
  const mimeType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return {
    blob: new Blob([uInt8Array], { type: mimeType }),
    mimeType
  };
}

/**
 * Migrates local Base64 media assets to Supabase Storage buckets, and cleans up local storage.
 * Run window.migrateAssetsToSupabase() in the console.
 */
export async function migrateAssetsToSupabase(): Promise<MigrationReport> {
  const report: MigrationReport = {
    migrated: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  console.log("Starting assets migration to Supabase...");

  if (!supabase) {
    const errMsg = "Supabase client is not initialized. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.";
    console.error(errMsg);
    report.errors.push(errMsg);
    report.failed++;
    return report;
  }

  try {
    const { getAssets, saveAssets, getSupabaseAssetsCache, saveSupabaseAssetsCache } = await import("./storage-service");
    const assets = getAssets();
    const assetIds = Object.keys(assets);

    console.log(`Found ${assetIds.length} assets in local registry.`);

    // Fetch existing assets from DB and read logical asset IDs from metadata JSONB
    const existingAssetIds = new Set<string>();
    try {
      const { data: extAssets } = await supabase.from("assets").select("metadata");
      extAssets?.forEach((a) => {
        if (a.metadata && typeof a.metadata === "object" && "id" in a.metadata) {
          existingAssetIds.add((a.metadata as any).id);
        }
      });
    } catch (e) {
      console.warn("Could not check existing assets table, assuming none.", e);
    }

    let changed = false;

    for (const id of assetIds) {
      const asset = assets[id];

      // If local asset registry already has supabaseUrl or url is remote
      if (asset.supabaseUrl || (asset.url && (asset.url.startsWith("http") || asset.url.startsWith("/images/")))) {
        console.log(`Skipping asset ${id}: already migrated in local registry.`);
        report.skipped++;
        continue;
      }

      const fileExt = asset.fileName.split(".").pop() || (asset.type === "image" ? "jpg" : "pdf");
      const filePath = `${id}.${fileExt}`;
      const bucket = asset.type === "image" ? "images" : "documents";

      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      // If it exists in Supabase table, skip upload, resolve URL, and update local registry
      if (existingAssetIds.has(id)) {
        console.log(`Asset ${id} already exists in Supabase assets table. Skipping upload, updating local registry.`);
        asset.supabaseUrl = publicUrl;
        asset.url = publicUrl; // Clean up Base64 now
        changed = true;

        // Cache it
        const cache = getSupabaseAssetsCache();
        cache[id] = { url: publicUrl };
        saveSupabaseAssetsCache(cache);

        report.skipped++;
        continue;
      }

      if (!asset.url || !asset.url.startsWith("data:")) {
        console.log(`Skipping asset ${id}: no local base64 data to migrate.`);
        report.skipped++;
        continue;
      }

      try {
        console.log(`Migrating asset ${id} (${asset.fileName})...`);
        const { blob, mimeType } = base64ToBlob(asset.url);
        
        // Upload to bucket
        const { error: uploadErr } = await supabase.storage
          .from(bucket)
          .upload(filePath, blob, {
            contentType: mimeType,
            upsert: true
          });

        if (uploadErr) throw uploadErr;

        // Write metadata row to assets table (id is generated UUID, metadata stores the stable logical asset ID)
        const { error: dbErr } = await supabase
          .from("assets")
          .insert({
            asset_type: asset.type,
            bucket_name: bucket,
            file_name: asset.fileName,
            public_url: publicUrl,
            metadata: {
              id: asset.id,
              uploaded_at: asset.uploadedAt,
              alt_text: asset.altText || "",
              category: asset.category || ""
            }
          });

        if (dbErr) throw dbErr;

        // Update local asset entry: save the Supabase URL, and clear the large Base64
        asset.supabaseUrl = publicUrl;
        asset.url = publicUrl; // Safely replace local base64 with remote public URL after absolute success
        changed = true;

        // Cache in Supabase assets cache
        const cache = getSupabaseAssetsCache();
        cache[id] = { url: publicUrl };
        saveSupabaseAssetsCache(cache);

        console.log(`✅ Asset ${id} migrated successfully to ${publicUrl}`);
        report.migrated++;
      } catch (err: any) {
        console.error(`❌ Failed to migrate asset ${id}:`, err);
        report.errors.push(`Asset ${id} (${asset.fileName}): ${err.message || err}`);
        report.failed++;
      }
    }

    if (changed) {
      saveAssets(assets);
      console.log("Local asset registry updated and saved.");
    }

  } catch (globalErr: any) {
    console.error("❌ Global error during asset migration:", globalErr);
    report.errors.push(`Global: ${globalErr.message || globalErr}`);
    report.failed++;
  }

  console.log("Asset migration completed. Summary:");
  console.table(report);
  return report;
}

let isInitializing = false;
let isInitialized = false;

/**
 * Background synchronizes all site settings, datasets, repository records,
 * and assets from Supabase to local storage caches when the application loads.
 */
export async function initializeSupabaseData() {
  if (isInitializing || isInitialized) return;
  if (!supabase) return;
  isInitializing = true;
  console.log("Background syncing database from Supabase to local cache...");
  
  try {
    // 1. Fetch site settings
    const settingsPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "site_settings")
          .maybeSingle();
        if (error) throw error;
        if (data && data.value) {
          const settings = data.value;
          localStorage.setItem("uwarl-db-settings", JSON.stringify(settings));
          const { updateSettingsCache } = await import("./admin-store");
          updateSettingsCache(settings);
          console.log("✅ Site settings synchronized from Supabase.");
        }
      } catch (err) {
        console.warn("Failed to background sync site settings:", err);
      }
    })();

    // 2. Fetch datasets
    const datasetsPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from("datasets")
          .select("dataset_key, data");
        if (error) throw error;
        if (data) {
          const { updateDatasetCache } = await import("./admin-store");
          for (const row of data) {
            if (row.dataset_key && row.data) {
              localStorage.setItem(`uwarl-db-${row.dataset_key}`, JSON.stringify(row.data));
              updateDatasetCache(row.dataset_key, row.data);
            }
          }
          console.log("✅ Datasets synchronized from Supabase.");
        }
      } catch (err) {
        console.warn("Failed to background sync datasets:", err);
      }
    })();

    // 3. Fetch records
    const recordsPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from("records")
          .select("data");
        if (error) throw error;
        if (data) {
          const records = data.map((row) => row.data);
          localStorage.setItem("uwarl-repo-records-v3", JSON.stringify(records));
          const { updateRecordsCache } = await import("./repository-data");
          updateRecordsCache(records);
          console.log(`✅ Synchronized ${records.length} repository records from Supabase.`);
        }
      } catch (err) {
        console.warn("Failed to background sync records:", err);
      }
    })();

    // 4. Fetch assets metadata
    const assetsPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from("assets")
          .select("metadata, public_url");
        if (error) throw error;
        if (data) {
          const { getAssets, saveAssets, saveSupabaseAssetsCache, getSupabaseAssetsCache } = await import("./storage-service");
          
          const localAssets = getAssets();
          const cache = getSupabaseAssetsCache();
          let localChanged = false;
          let cacheChanged = false;
          
          for (const row of data) {
            if (row.metadata && typeof row.metadata === "object" && "id" in row.metadata) {
              const assetId = (row.metadata as any).id;
              
              // Cache map update
              if (!cache[assetId] || cache[assetId].url !== row.public_url) {
                cache[assetId] = { url: row.public_url };
                cacheChanged = true;
              }
              
              // Local asset registry update
              if (!localAssets[assetId]) {
                localAssets[assetId] = {
                  id: assetId,
                  url: row.public_url,
                  type: (row.metadata as any).asset_type || (row.metadata as any).type || "image",
                  fileName: (row.metadata as any).file_name || (row.metadata as any).fileName || "",
                  uploadedAt: (row.metadata as any).uploaded_at || (row.metadata as any).uploadedAt || new Date().toISOString(),
                  altText: (row.metadata as any).alt_text || (row.metadata as any).altText || "",
                  category: (row.metadata as any).category || "",
                  supabaseUrl: row.public_url
                };
                localChanged = true;
              } else if (!localAssets[assetId].supabaseUrl) {
                localAssets[assetId].supabaseUrl = row.public_url;
                localChanged = true;
              }
            }
          }
          
          if (localChanged) saveAssets(localAssets);
          if (cacheChanged) saveSupabaseAssetsCache(cache);
          console.log("✅ Assets synchronized from Supabase.");
        }
      } catch (err) {
        console.warn("Failed to background sync assets:", err);
      }
    })();

    // Wait for all fetches concurrently
    await Promise.allSettled([settingsPromise, datasetsPromise, recordsPromise, assetsPromise]);
    isInitialized = true;
  } catch (err) {
    console.error("Critical error during Supabase synchronization:", err);
  } finally {
    isInitializing = false;
  }
}

// Bind to window object for console access
if (typeof window !== "undefined") {
  (window as any).exportCompleteBackup = exportCompleteBackup;
  (window as any).migrateLocalDataToSupabase = migrateLocalDataToSupabase;
  (window as any).migrateAssetsToSupabase = migrateAssetsToSupabase;
  (window as any).initializeSupabaseData = initializeSupabaseData;

  // Wait a short tick for other modules to load before triggering background sync
  setTimeout(() => {
    initializeSupabaseData().catch((err) => {
      console.error("Initialization sync failed:", err);
    });
  }, 100);
}
