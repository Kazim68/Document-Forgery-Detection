import { useState, useRef, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const UseRecaptcha = () => {
  const [capchaToken, setCapchaToken] = useState('');
  const recaptchaRef = useRef(null);

  const handleRecaptcha = useCallback((token) => {
    setCapchaToken(token || '');
  }, []);

  const resetCaptcha = useCallback(() => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setCapchaToken('');
    }
  }, []);

  useEffect(() => {
    const refreshCaptcha = () => {
      if (recaptchaRef.current && capchaToken) {
        recaptchaRef.current.reset();
        setCapchaToken('');
      }
    };

    let tokenRefreshTimeout = null;

    if (capchaToken) {
      tokenRefreshTimeout = setTimeout(refreshCaptcha, 110000); // 110 seconds
    }

    return () => {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
      }
    };
  }, [capchaToken]);

  return { capchaToken, setCapchaToken, recaptchaRef, handleRecaptcha, resetCaptcha };
};

export default UseRecaptcha;
