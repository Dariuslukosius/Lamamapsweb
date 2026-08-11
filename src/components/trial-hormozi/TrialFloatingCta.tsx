import { useTrialModal } from "./TrialModalContext";
import { COPY } from "./copy";

// The floating CTA carries the secondary action: it follows the visitor down
// the whole page, and the low-commitment ask is the one that survives being
// asked repeatedly. The primary CTA stays anchored to the sections that have
// just earned it.
const TrialFloatingCta = () => {
  const { openTrialModal } = useTrialModal();

  return (
    <button type="button" className="tp-floating-cta" onClick={() => openTrialModal("secondary")}>
      {COPY.cta.secondary}
    </button>
  );
};

export default TrialFloatingCta;
