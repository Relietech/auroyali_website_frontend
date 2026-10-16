import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiMapPin, FiPhone, FiMail } from "react-icons/fi";

const explore = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Workshops", to: "/workshops" },
  { label: "Projects", to: "/projects" },
  { label: "Contact", to: "/contact" },
];

const services = [
  { label: "Architecture", to: "/services/architecture" },
  { label: "Construction", to: "/services/construction" },
  { label: "Carpentry", to: "/services/carpentry" },
  { label: "Metal Fabrication", to: "/services/metal-fabrication" },
];

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/auroyali_auroville/100072066965911/",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/auroyali_auroville/?hl=en",
    Icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/auroyali/",
    Icon: FaLinkedinIn,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" },
  }),
};

/* Woven "loom" threads: horizontal warp + vertical weft that draw in on scroll */
function LoomThreads() {
  const warp = Array.from({ length: 9 }, (_, i) => i);
  const weft = Array.from({ length: 16 }, (_, i) => i);

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1200 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {warp.map((i) => (
        <motion.line
          key={`w-${i}`}
          x1="0"
          x2="1200"
          y1={40 + i * 80}
          y2={40 + i * 80}
          stroke="#d2b48c"
          strokeOpacity="0.14"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: i * 0.08, ease: "easeInOut" }}
        />
      ))}
      {weft.map((i) => (
        <motion.line
          key={`v-${i}`}
          y1="0"
          y2="700"
          x1={40 + i * 75}
          x2={40 + i * 75}
          stroke="#b5532f"
          strokeOpacity="0.16"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.4 + i * 0.05, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-earth-900 text-earth-100">
      {/* woven background */}
      <LoomThreads />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-earth-900 via-transparent to-earth-900/90" />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 md:px-8 md:pt-14">
        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="border-b border-earth-300/20 pb-8"
        >
          <h2 className="max-w-3xl font-heading text-3xl font-semibold leading-tight md:text-5xl">
            Let&apos;s build something rooted in the earth.
          </h2>
        </motion.div>

        {/* Columns */}
        <div className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-4">
          <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h3 className="font-heading text-3xl">AuroYali</h3>
            <p className="mt-4 font-body text-sm font-light leading-relaxed text-earth-100/70">
              A unit under Auroville Universal Town. We specialise in natural
              construction techniques, from CSEB production and architectural
              design to complete construction and handover.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-earth-300/30 text-earth-100 transition hover:border-clay hover:bg-clay"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Explore & Services: 2-column grid on mobile, individual grid cells on tablet/desktop */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10 md:contents">
            <motion.nav variants={fadeUp} custom={1} initial="hidden" whileInView="show" viewport={{ once: true }} aria-label="Explore">
              <h4 className="font-body text-xs uppercase tracking-[0.25em] text-earth-300">Explore</h4>
              <ul className="mt-5 space-y-3 font-body text-sm font-light">
                {explore.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition hover:pl-1 hover:text-clay">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <motion.nav variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }} aria-label="Services">
              <h4 className="font-body text-xs uppercase tracking-[0.25em] text-earth-300">Services</h4>
              <ul className="mt-5 space-y-3 font-body text-sm font-light">
                {services.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="transition hover:pl-1 hover:text-clay">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </div>

          <motion.div variants={fadeUp} custom={3} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h4 className="font-body text-xs uppercase tracking-[0.25em] text-earth-300">Visit &amp; Contact</h4>
            <ul className="mt-5 space-y-4 font-body text-sm font-light">
              <li className="flex gap-3">
                <FiMapPin className="mt-1 shrink-0 text-clay" />
                <span>
                  International Zone, Kottakarai Village, Auroville, Tamil Nadu
                  - 605101
                </span>
              </li>
              <li className="flex gap-3">
                <FiPhone className="mt-1 shrink-0 text-clay" />
                <a href="tel:+918940000126" className="hover:text-clay">
                  +91 89400 00126
                </a>
              </li>
              <li className="flex gap-3">
                <FiMail className="mt-1 shrink-0 text-clay" />
                <a href="mailto:auroyali@auroville.org.in" className="break-all hover:text-clay">
                  auroyali@auroville.org.in
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Bleeding grand wordmark spanning full width */}
      <div className="relative -mb-2 sm:-mb-4 md:-mb-7 lg:-mb-10 select-none overflow-hidden w-full flex justify-center px-1">
        <motion.p
          initial={{ y: "40%", opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="bg-gradient-to-b from-earth-300/60 via-earth-300/30 to-transparent bg-clip-text text-center font-heading text-[17.5vw] font-bold uppercase leading-[0.82] tracking-tight text-transparent whitespace-nowrap select-none w-full"
          aria-hidden="true"
        >
          AuroYali
        </motion.p>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-earth-300/20 bg-earth-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 font-body text-xs font-light text-earth-100/60 md:flex-row md:px-8">
          <p>© {year} AuroYali. All rights reserved.</p>
          <p>Auroville Universal Town</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
