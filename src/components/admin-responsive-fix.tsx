export function AdminResponsiveFix() {
  return (
    <style>{`
      @media (max-width: 1023px) {
        body:has(.admin-tab) aside {
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          left: auto !important;
          width: min(86vw, 320px) !important;
          max-width: calc(100vw - 24px) !important;
          height: 100dvh !important;
          margin: 0 !important;
          z-index: 60 !important;
          overflow: hidden !important;
          transform: translateX(100%) !important;
        }
        body:has(.admin-tab) aside[class*="translate-x-0"] {
          transform: translateX(0) !important;
        }
        body:has(.admin-tab) main {
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        body:has(.admin-tab) .admin-tab {
          min-height: 44px;
          flex-shrink: 0;
        }
      }

      @media (min-width: 1024px) {
        body:has(.admin-tab) > div:first-child {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr) 18rem !important;
          direction: ltr !important;
          min-height: 100vh !important;
        }
        body:has(.admin-tab) > div:first-child > aside {
          grid-column: 2 !important;
          grid-row: 1 !important;
          direction: rtl !important;
          position: relative !important;
          inset: auto !important;
          width: auto !important;
          height: 100vh !important;
          transform: none !important;
        }
        body:has(.admin-tab) > div:first-child > main {
          grid-column: 1 !important;
          grid-row: 1 !important;
          min-width: 0 !important;
          width: auto !important;
          direction: rtl !important;
        }
      }
    `}</style>
  );
}
