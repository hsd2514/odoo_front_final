import React from 'react';

// Refined AuthCard for cleaner minimal aesthetic
const AuthCard = ({
  title,
  subtitle,
  children,
  showSocial = false,
  footer,
  dividerText = 'Or continue with',
  socialContent,
  topLeftContent,
}) => {
  return (
    <div className="min-h-screen flex items-start justify-center bg-[#f6f7f9] px-4 pt-16 pb-12 text-neutral antialiased">
      {topLeftContent && (
        <div className="fixed top-4 right-4 z-10">
          {topLeftContent}
        </div>
      )}
      <div className="w-full max-w-xl">
        <div className="text-center mb-8 space-y-2">
          <h1 className="text-[2.5rem] leading-tight font-serif font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-neutral/70 text-sm">{subtitle}</p>}
        </div>
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-2xl bg-white/95 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.05)] ring-1 ring-black/5 backdrop-blur-sm">
            <div className="p-10 pt-9 space-y-8">
              {showSocial && (
                <>
                  <div className="flex justify-center">{socialContent}</div>
                  <div className="flex items-center gap-4 text-[13px] text-neutral/60 select-none">
                    <span className="flex-1 h-px bg-neutral/20" />
                    <span>{dividerText}</span>
                    <span className="flex-1 h-px bg-neutral/20" />
                  </div>
                </>
              )}
              {children}
            </div>
          </div>
          {footer && <div className="mt-6 text-center text-xs text-neutral/60 leading-relaxed max-w-md mx-auto">{footer}</div>}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
