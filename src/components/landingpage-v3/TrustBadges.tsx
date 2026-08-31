import { Check } from "lucide-react";
import { COPY } from "./copy";

/**
 * The three risk-removal badges, rendered directly under every primary CTA.
 *
 * Deliberately quiet — smaller type, muted colour, no background. They exist to
 * answer "what does clicking this cost me?" at the moment of the click, not to
 * compete with the button they sit under.
 */
const TrustBadges = ({ className = "" }: { className?: string }) => (
  <ul className={`l3h-badges ${className}`.trim()}>
    {COPY.badges.map((badge) => (
      <li key={badge} className="l3h-badge">
        <Check className="l3h-badge-icon" aria-hidden="true" />
        {badge}
      </li>
    ))}
  </ul>
);

export default TrustBadges;
