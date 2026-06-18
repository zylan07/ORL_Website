import { resolveAssetUrl } from "@/lib/storage-service";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  mediaType?: "image" | "video" | "none";
  mediaUrl?: string;
  mediaPosition?: "background" | "left" | "right";
  overlayOpacity?: number; // 0 to 100
  accentText?: string;
}

export function PageHero({
  title,
  subtitle,
  description,
  mediaType = "none",
  mediaUrl,
  mediaPosition = "background",
  overlayOpacity = 60,
  accentText,
}: PageHeroProps) {
  const resolvedMedia = mediaUrl ? resolveAssetUrl(mediaUrl) : "";
  const isVideo = mediaType === "video" && resolvedMedia;
  const isImage = mediaType === "image" && resolvedMedia;
  const opacityVal = overlayOpacity / 100;

  // Render Background Media Layout
  if (mediaPosition === "background") {
    return (
      <section
        className="relative overflow-hidden border-b border-border bg-[#020712] text-white py-16 px-6"
        style={isImage ? { backgroundImage: `url(${resolvedMedia})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {/* Dynamic Dark overlay matching professor's slider preference */}
        <div 
          className="absolute inset-0 bg-[#020712]" 
          style={{ opacity: opacityVal, zIndex: 1 }}
        />
        
        {isVideo && (
          <video
            src={resolvedMedia}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
        )}
        
        {/* Background gradient overlay overlaying video/image */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020712]/30 to-[#020712]/90" 
          style={{ zIndex: 1 }}
        />
        
        <div className="mx-auto max-w-5xl text-center space-y-5 relative z-10">
          {accentText && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/25">
              {accentText}
            </span>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl font-sans">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto max-w-2xl text-xs font-semibold text-sky-400 uppercase tracking-widest leading-relaxed">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="mx-auto max-w-3xl text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {description}
            </p>
          )}
        </div>
      </section>
    );
  }

  // Render Split Media Layout (Left or Right)
  const isLeft = mediaPosition === "left";
  return (
    <section className="relative overflow-hidden border-b border-border bg-[#020712] text-white py-12 md:py-16 px-6 flex flex-col md:flex-row items-center gap-8 md:gap-12 mx-auto w-full">
      <div 
        className="absolute inset-0 bg-[#020712]/40 pointer-events-none" 
        style={{ zIndex: 1 }}
      />
      
      {/* Content Col */}
      <div className={`flex-1 space-y-4 relative z-10 w-full ${isLeft ? "md:order-2" : "md:order-1"}`}>
        {accentText && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/25">
            {accentText}
          </span>
        )}
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl font-sans leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-widest leading-relaxed">
            {subtitle}
          </p>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
            {description}
          </p>
        )}
      </div>

      {/* Media Col */}
      <div className={`w-full md:w-1/2 shrink-0 relative z-10 ${isLeft ? "md:order-1" : "md:order-2"}`}>
        <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-2xl aspect-video bg-black/40 flex items-center justify-center">
          {isVideo ? (
            <video
              src={resolvedMedia}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : isImage ? (
            <img
              src={resolvedMedia}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 select-none text-slate-500">
              <span className="text-3xl mb-2">📡</span>
              <p className="text-4xs font-mono font-bold uppercase tracking-wider">Ocean Research Lab</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
