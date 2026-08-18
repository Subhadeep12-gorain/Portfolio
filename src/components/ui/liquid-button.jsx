
function LiquidButton({
  children,
  className = "",
  type = "button",
  themeHue,
  ...props
}) {
  const dynamicStyles = themeHue !== undefined ? {
    '--liquid-border': `hsla(${themeHue}, 100%, 75%, 0.3)`,
    '--liquid-border-hover': `hsla(${themeHue}, 100%, 75%, 0.7)`,
    '--liquid-shadow': `0 12px 32px -14px hsla(${themeHue}, 100%, 65%, 0.8)`,
    '--liquid-shadow-hover': `0 16px 40px -12px hsla(${themeHue}, 100%, 65%, 0.95)`,
    '--liquid-grad': `linear-gradient(to bottom, hsl(${themeHue}, 90%, 65%), hsl(${themeHue}, 80%, 55%), hsl(${themeHue}, 100%, 45%))`
  } : {};

  return (
    <>
      <button
        className={`group/liquid liquid-btn-dynamic relative isolate inline-flex h-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-950 px-6 text-sm font-semibold whitespace-nowrap text-white transition-[transform,box-shadow,border-color] duration-300 outline-none select-none active:translate-y-px active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none ${className}`}
        style={dynamicStyles}
        type={type}
        {...props}
      >
        <span
          aria-hidden="true"
          className="liquid-btn-gradient absolute -inset-x-1/4 top-[96%] z-0 h-[190%] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/liquid:-translate-y-[58%] group-focus-visible/liquid:-translate-y-[58%] group-disabled/liquid:translate-y-0 motion-reduce:transition-none"
        >
          <span className="absolute top-0 left-1/2 size-[145%] -translate-x-1/2 -translate-y-1/2 [animation:liquid-button-wave_7s_linear_infinite] rounded-[43%] bg-slate-950/95 motion-reduce:animate-none" />
          <span className="absolute top-0 left-1/2 size-[135%] -translate-x-1/2 -translate-y-1/2 [animation:liquid-button-wave_5s_linear_infinite_reverse] rounded-[47%] bg-slate-950/45 motion-reduce:animate-none" />

          <span
            className="absolute bottom-4 left-[22%] size-1.5 [animation:liquid-button-bubble_1.8s_ease-in_infinite] rounded-full bg-white/70 opacity-0 group-hover/liquid:opacity-100 group-disabled/liquid:hidden motion-reduce:hidden"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="absolute bottom-2 left-[48%] size-2 [animation:liquid-button-bubble_2.2s_ease-in_infinite] rounded-full bg-white/60 opacity-0 group-hover/liquid:opacity-100 group-disabled/liquid:hidden motion-reduce:hidden"
            style={{ animationDelay: "520ms" }}
          />
          <span
            className="absolute bottom-5 left-[72%] size-1 [animation:liquid-button-bubble_1.6s_ease-in_infinite] rounded-full bg-white/80 opacity-0 group-hover/liquid:opacity-100 group-disabled/liquid:hidden motion-reduce:hidden"
            style={{ animationDelay: "860ms" }}
          />
        </span>

        <span className="relative z-10 inline-flex items-center gap-2">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-5 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
      </button>

      <style>{`
        .liquid-btn-dynamic {
          border: 1px solid var(--liquid-border, rgba(103,232,249,0.3));
          box-shadow: var(--liquid-shadow, 0 12px 32px -14px rgba(34,211,238,0.8));
        }
        .liquid-btn-dynamic:hover {
          border-color: var(--liquid-border-hover, rgba(103,232,249,0.7));
          box-shadow: var(--liquid-shadow-hover, 0 16px 40px -12px rgba(34,211,238,0.95));
        }
        .liquid-btn-dynamic:focus-visible {
          border-color: var(--liquid-border-hover, rgba(103,232,249,0.7));
        }
        .liquid-btn-gradient {
          background: var(--liquid-grad, linear-gradient(to bottom, #22d3ee, #0ea5e9, #4f46e5));
        }

        @keyframes liquid-button-wave {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes liquid-button-bubble {
          0% { opacity: 0; transform: translateY(0) scale(0.7); }
          18% { opacity: 0.75; }
          100% { opacity: 0; transform: translateY(-4.5rem) scale(1.15); }
        }
      `}</style>
    </>
  );
}

export { LiquidButton };
