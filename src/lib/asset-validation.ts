import { resolveAssetUrl } from "@/lib/storage-service";
import { isValidImage } from "@/lib/utils";

/**
 * Validates whether the logo settings exist, the asset url resolves successfully,
 * and the resolved path is a valid non-fallback image asset.
 */
export function isValidLogo(logo: string | null | undefined): boolean {
  if (!isValidImage(logo)) return false;
  const resolved = resolveAssetUrl(logo);
  return isValidImage(resolved);
}
