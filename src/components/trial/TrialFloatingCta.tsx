import { useTrialModal } from "./TrialModalContext";

const TrialFloatingCta = () => {
  const { openTrialModal } = useTrialModal();

  return (
    <button type="button" className="tp-floating-cta" onClick={openTrialModal}>
      Schedule time with us
    </button>
  );
};

export default TrialFloatingCta;
