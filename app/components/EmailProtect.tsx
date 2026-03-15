"use client";

import { useMemo } from "react";

type EmailProtectProps = {
  user: string;
  domain: string;
  tld: string;
  className?: string;
  label?: string;
};

const obfuscate = (value: string) => value.split("").reverse().join("");

export default function EmailProtect({
  user,
  domain,
  tld,
  className,
  label
}: EmailProtectProps) {
  const email = useMemo(() => `${user}@${domain}.${tld}`, [user, domain, tld]);
  const href = useMemo(() => `mailto:${email}`, [email]);
  const display = label ?? email;

  return (
    <a
      className={className}
      href={href}
      data-u={obfuscate(user)}
      data-d={obfuscate(domain)}
      data-t={obfuscate(tld)}
      aria-label="Email"
    >
      {display}
    </a>
  );
}
