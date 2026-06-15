import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import SplitHeading from './split-heading';
import { MagneticButton } from './magnetic-button';
import { FireflyOverlay } from './firefly-overlay';
import { Mail } from 'lucide-react';

export const ContactSection = ({ themeHue = 220 }) => {
  const { t } = useTranslation();
  const [submitState, setSubmitState] = useState('idle'); // idle, sending, sent, error
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [focusedInputRect, setFocusedInputRect] = useState(null);

  const handleFocus = (e) => {
    setFocusedInputRect(e.target.getBoundingClientRect());
  };

  const handleBlur = () => {
    setFocusedInputRect(null);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (submitState !== 'idle') return;

    setSubmitState('sending');

    try {
      // Web3Forms implementation
      // Replace 'YOUR_ACCESS_KEY_HERE' with the actual access key received in email
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: 'New Contact Form Submission from Portfolio',
          from_name: 'Portfolio Contact Form'
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitState('sent');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitState('idle'), 3000);
      } else {
        console.error('Submission failed', result);
        setSubmitState('error');
        setTimeout(() => setSubmitState('idle'), 3000);
      }
    } catch (error) {
      console.error('Submission error', error);
      setSubmitState('error');
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  };

  return (
    <section id="contact" className="relative w-full max-w-5xl mx-auto py-12 overflow-hidden rounded-3xl min-h-[70vh] flex flex-col justify-center">
      {/* Background Glow — Bottom */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 100%, hsla(${themeHue}, 50%, 35%, 0.35) 0%, transparent 65%)`
        }}
      />
      
      {/* Background Glow — Side (Desktop) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 hidden md:block"
        style={{
          background: `radial-gradient(ellipse at 100% 50%, hsla(${themeHue}, 45%, 25%, 0.22) 0%, transparent 60%)`
        }}
      />
      
      {/* Background Glow — Center (Mobile) */}
      <div
        className="absolute inset-0 pointer-events-none z-0 md:hidden"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, hsla(${themeHue}, 45%, 25%, 0.22) 0%, transparent 60%)`
        }}
      />

      {/* Bokeh / Star Dots Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => {
          const left = `${(i * 17.3 + 7) % 100}%`;
          const top = `${(i * 23.7 + 11) % 100}%`;
          const size = (i % 2 === 0) ? '1px' : '2px';
          const pulseDuration = `${3 + (i % 3) * 1.2}s`;
          const delay = `${-(i % 5) * 0.7}s`;

          return (
            <div
              key={i}
              className="absolute rounded-full bg-white opacity-20 pointer-events-none"
              style={{
                left,
                top,
                width: size,
                height: size,
                animation: `bokeh-pulse ${pulseDuration} ease-in-out infinite`,
                animationDelay: delay
              }}
            />
          );
        })}
      </div>

      {/* Content Asymmetrical Overlap Layout */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-center px-4 md:px-8 max-w-6xl mx-auto">

        {/* LEFT COLUMN: Cinematic Text & Magnetic Links */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:pr-16 relative z-10"
        >
          {/* Section Label */}
          <motion.span
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
            }}
            className="text-[0.65rem] tracking-[0.2em] uppercase mb-4 block"
            style={{ color: `hsla(${themeHue}, 70%, 72%, 0.55)` }}
          >
            {t('contact.section_label')}
          </motion.span>

          {/* Main Heading (Staggered Lines) */}
          <h3 className="font-serif text-[2.2rem] md:text-[3.5rem] text-white font-normal tracking-wide mb-6 leading-tight">
            <motion.span
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: "easeOut" } }
              }}
              className="block"
            >
              <SplitHeading>{t('contact.title1')}</SplitHeading>
            </motion.span>
            <motion.span
              variants={{
                hidden: { opacity: 0, x: -40 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.9, delay: 0.15, ease: "easeOut" } }
              }}
              className="block"
            >
              <SplitHeading>{t('contact.title2')}</SplitHeading>
            </motion.span>
          </h3>

          {/* Horizon Line Container */}
          <div className="relative w-full py-4 mb-6 flex justify-center lg:justify-start">
            {/* Dusk Horizon Line */}
            <motion.div
              variants={{
                hidden: { scaleX: 0 },
                visible: {
                  scaleX: 1,
                  transition: { duration: 1.2, delay: 0.6, ease: "easeInOut" }
                }
              }}
              style={{
                transformOrigin: 'left',
                background: `linear-gradient(to right, hsla(${themeHue}, 75%, 72%, 0.6), hsla(${themeHue}, 70%, 65%, 0.1), transparent)`
              }}
              className="h-[1px] w-full"
            />
            {/* Soft pulsing lantern dot at the start */}
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { delay: 1.8, duration: 0.4 }
                }
              }}
              className="absolute left-0 top-[14px] w-1.5 h-1.5 rounded-full status-pulse-dot"
            />
          </div>

          {/* Subtitle */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 1.8, ease: "easeOut" } }
            }}
            className="font-sans text-base text-white/50 leading-relaxed max-w-sm mb-12"
          >
            {t('contact.p1')}
          </motion.p>

          {/* Magnetic Social Links */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 2.0, ease: "easeOut" } }
            }}
            className="flex w-full justify-center lg:justify-start"
          >
            <MagneticButton themeHue={themeHue} href="mailto:subhadeepgorain@example.com" icon={Mail}>
              Email
            </MagneticButton>
          </motion.div>

        </motion.div>

        {/* RIGHT COLUMN: Overlapping Form Container */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0, x: 60 },
            visible: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.9, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
            }
          }}
          className="lg:col-span-5 w-full relative z-20 lg:-ml-12 mt-12 lg:mt-0"
        >
          {/* Glass Card */}
          <div
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
              border: `1px solid hsla(${themeHue}, 70%, 65%, 0.18)`
            }}
            className="w-full backdrop-blur-md bg-white/[0.02] rounded-2xl p-8 md:p-10 relative overflow-hidden"
          >
            {/* The Firefly Overlay that tracks the focused input */}
            <FireflyOverlay targetRect={focusedInputRect} themeHue={themeHue} />

            {/* Inside Card Form (Staggered Fields) */}
            <motion.form
              onSubmit={handleContactSubmit}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.4
                  }
                }
              }}
              className="flex flex-col gap-6 relative z-20 pointer-events-auto"
            >
              {/* Field 1: Name */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="flex flex-col gap-2"
              >
                <label className="text-[10px] font-label-sm text-[#d6c2c4]/50 tracking-[0.25em] uppercase">
                  {t('contact.name_label')}
                </label>
                <input
                  type="text"
                  required
                  placeholder={t('contact.name_ph')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={(e) => {
                    handleFocus(e);
                    e.target.style.borderBottomColor = `hsla(${themeHue}, 75%, 72%, 0.65)`;
                  }}
                  onBlur={(e) => {
                    handleBlur();
                    e.target.style.borderBottomColor = `hsla(${themeHue}, 60%, 65%, 0.22)`;
                  }}
                  className="w-full bg-transparent border-0 border-b text-white font-body-md px-0 py-2 focus:outline-hidden focus:ring-0 transition-all duration-300 placeholder-white/20 text-base relative"
                  style={{ borderBottomColor: `hsla(${themeHue}, 60%, 65%, 0.22)` }}
                />
              </motion.div>

              {/* Field 2: Email */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="flex flex-col gap-2"
              >
                <label className="text-[10px] font-label-sm text-[#d6c2c4]/50 tracking-[0.25em] uppercase">
                  {t('contact.email_label')}
                </label>
                <input
                  type="email"
                  required
                  placeholder={t('contact.email_ph')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onFocus={(e) => {
                    handleFocus(e);
                    e.target.style.borderBottomColor = `hsla(${themeHue}, 75%, 72%, 0.65)`;
                  }}
                  onBlur={(e) => {
                    handleBlur();
                    e.target.style.borderBottomColor = `hsla(${themeHue}, 60%, 65%, 0.22)`;
                  }}
                  className="w-full bg-transparent border-0 border-b text-white font-body-md px-0 py-2 focus:outline-hidden focus:ring-0 transition-all duration-300 placeholder-white/20 text-base relative"
                  style={{ borderBottomColor: `hsla(${themeHue}, 60%, 65%, 0.22)` }}
                />
              </motion.div>

              {/* Field 3: Message */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="flex flex-col gap-2"
              >
                <label className="text-[10px] font-label-sm text-[#d6c2c4]/50 tracking-[0.25em] uppercase">
                  {t('contact.message_label')}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={t('contact.message_ph')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  onFocus={(e) => {
                    handleFocus(e);
                    e.target.style.borderBottomColor = `hsla(${themeHue}, 75%, 72%, 0.65)`;
                  }}
                  onBlur={(e) => {
                    handleBlur();
                    e.target.style.borderBottomColor = `hsla(${themeHue}, 60%, 65%, 0.22)`;
                  }}
                  className="w-full bg-transparent border-0 border-b text-white font-body-md px-0 py-2 focus:outline-hidden focus:ring-0 transition-all duration-300 placeholder-white/20 text-base resize-none relative"
                  style={{ borderBottomColor: `hsla(${themeHue}, 60%, 65%, 0.22)` }}
                />
              </motion.div>

              {/* Send Button */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="mt-2"
              >
                <button
                  type="submit"
                  disabled={submitState === 'sending'}
                  className="w-full py-3 rounded-full border transition-all duration-300 cursor-pointer font-body-md text-xs tracking-[0.25em] font-semibold text-white relative overflow-hidden"
                  style={submitState === 'sent'
                    ? { borderColor: `hsl(${themeHue}, 75%, 72%)`, background: `hsla(${themeHue}, 70%, 65%, 0.28)`, boxShadow: `0 0 20px hsla(${themeHue}, 70%, 65%, 0.28)` }
                    : submitState === 'sending'
                      ? { borderColor: `hsla(${themeHue}, 60%, 65%, 0.3)`, background: `hsla(${themeHue}, 60%, 65%, 0.05)`, opacity: 0.5, cursor: 'not-allowed' }
                      : submitState === 'error'
                        ? { borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }
                        : { borderColor: `hsla(${themeHue}, 60%, 65%, 0.32)`, background: `hsla(${themeHue}, 60%, 65%, 0.06)` }
                  }
                >
                  {submitState === 'idle' && t('contact.btn_idle')}
                  {submitState === 'sending' && t('contact.btn_sending')}
                  {submitState === 'sent' && t('contact.btn_sent')}
                  {submitState === 'error' && 'Failed - Try again'}
                </button>
              </motion.div>

            </motion.form>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
