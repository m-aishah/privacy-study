import { Logo } from "./Logo";

/**
 * The UNBC logo sits in the top-left corner on every screen that shows it,
 * matching where a logo is conventionally placed rather than competing for
 * attention centered in the middle of the page.
 */
export function CornerLogo({ size = 32 }: { size?: number }) {
  return (
    <div className="fixed top-4 left-4 z-30">
      <Logo size={size} />
    </div>
  );
}
