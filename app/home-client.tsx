"use client";

import Image from "next/image";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  useInView
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import EmailProtect from "./components/EmailProtect";
import { aboutCards, aboutDetails, stats } from "./site-data";
import type { Article } from "./lib/rss";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 180, damping: 18 }
  }
};

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
};

const useRevealOnView = (amount = 0.3) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount });
  const [hasRevealed, setHasRevealed] = useState(false);

  useEffect(() => {
    if (inView) setHasRevealed(true);
  }, [inView]);

  useEffect(() => {
    if (hasRevealed) return;
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setHasRevealed(true);
    }
  }, [hasRevealed]);

  return { ref, hasRevealed };
};

function HoverCard({
  children,
  className = "",
  onClick,
  ariaExpanded
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  ariaExpanded?: boolean;
}) {
  return (
    <m.button
      type="button"
      className={`card w-full cursor-pointer text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgb(var(--accent)/0.6)] ${className}`}
      variants={item}
      whileHover={{ y: -8 }}
      whileTap={{ y: 3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={ariaExpanded}
    >
      {children}
    </m.button>
  );
}

function HoverCardLink({
  href,
  children,
  className = ""
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`card block ${className}`}
      variants={item}
      whileHover={{ y: -8 }}
      whileTap={{ y: 3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      {children}
    </m.a>
  );
}

type HomeClientProps = {
  initialArticles: Article[];
};

export default function HomeClient({ initialArticles }: HomeClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [loading, setLoading] = useState(initialArticles.length === 0);
  const lastHash = useRef("");
  const lastFetchedAt = useRef(0);
  const aboutReveal = useRevealOnView(0.3);
  const articleReveal = useRevealOnView(0.3);
  const [activeAbout, setActiveAbout] = useState<number | null>(null);
  const activeAboutDetail =
    activeAbout === null ? null : aboutDetails[activeAbout] ?? null;

  useEffect(() => {
    let active = true;
    const intervalMs = 2 * 60 * 60 * 1000;

    const fetchArticles = async (force = false) => {
      const now = Date.now();
      if (!force && lastFetchedAt.current && now - lastFetchedAt.current < intervalMs) {
        return;
      }
      if (
        typeof document !== "undefined" &&
        document.visibilityState !== "visible"
      ) {
        return;
      }

      try {
        lastFetchedAt.current = now;
        const res = await fetch("/api/rss", { cache: "force-cache" });
        const data = await res.json();
        if (!active) return;
        const items = Array.isArray(data.items) ? data.items : [];
        const hash = JSON.stringify(items);
        if (hash !== lastHash.current) {
          lastHash.current = hash;
          setArticles(items);
        }
      } catch {
        if (!active) return;
        if (!lastHash.current && initialArticles.length === 0) {
          setArticles([]);
        }
      } finally {
        if (!active) return;
        setLoading(false);
      }
    };

    if (initialArticles.length === 0) {
      fetchArticles(true);
    } else if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback?: Function }).requestIdleCallback(
          () => fetchArticles(true),
          { timeout: 2000 }
        );
      } else {
        setTimeout(() => fetchArticles(true), 800);
      }
    }

    const timer = setInterval(fetchArticles, intervalMs);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchArticles();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [initialArticles]);

  useEffect(() => {
    if (activeAbout === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeAbout]);

  useEffect(() => {
    if (activeAbout === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveAbout(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAbout]);

  return (
    <LazyMotion features={domAnimation}>
      <div className="relative overflow-hidden">
        <main className="mx-auto max-w-6xl px-6">
          <section className="relative min-h-[100svh] pt-[var(--hero-gap)] pb-[var(--hero-gap-bottom)]">
            <m.div
              className="card flex w-full items-center p-8 md:p-12"
              style={{
                minHeight:
                  "calc(100svh - var(--hero-gap) - var(--hero-gap-bottom))"
              }}
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:items-center md:justify-center">
                <m.div
                  variants={item}
                  className="flex items-center justify-center"
                >
                  <div className="relative h-56 w-56 overflow-hidden rounded-full border border-[color:rgb(var(--accent)/0.5)] ring-1 ring-[color:rgb(var(--ring)/0.35)]">
                    <Image
                      src="/avatar.jpg"
                      alt="个人头像"
                      className="object-cover"
                      unoptimized
                      fill
                      sizes="224px"
                      priority
                      fetchPriority="high"
                    />
                  </div>
                </m.div>
                <m.div
                  variants={item}
                  className="space-y-6 text-center md:text-left"
                >
                  <div className="space-y-3">
                    <span className="chip">你好，我是</span>
                    <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">
                      枫落丰源
                    </h1>
                    <p className="text-base text-muted md:text-lg">
                      和你的日常，就是奇迹
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {stats.map((stat) => (
                      <m.div
                        key={stat.label}
                        variants={item}
                        className="card-muted px-4 py-3"
                      >
                        <p className="text-xs uppercase tracking-wide text-muted">
                          {stat.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-fg">
                          {stat.value}
                        </p>
                      </m.div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <a href="https://blog.feng1026.top" className="chip">
                      个人网站
                    </a>
                  </div>
                </m.div>
              </div>
            </m.div>
            <m.div
              className="pointer-events-none absolute bottom-6 inset-x-0 flex flex-col items-center justify-center gap-2 text-xs text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.8, 0.1], y: [0, 10, 0] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ willChange: "transform, opacity" }}
            >
              <svg
                className="block"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 5v14m0 0-6-6m6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </m.div>
          </section>

          <section className="space-y-8 py-10">
            <m.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-muted">
                About
              </p>
              <h2 className="font-display text-3xl font-semibold">关于我</h2>
            </m.div>
            <m.div
              className="grid gap-6 lg:grid-cols-3"
              variants={container}
              initial="hidden"
              animate={aboutReveal.hasRevealed ? "show" : "hidden"}
              ref={aboutReveal.ref}
            >
              {aboutCards.map((card, index) => (
                <HoverCard
                  key={card.title}
                  className="p-6"
                  onClick={() => setActiveAbout(index)}
                  ariaExpanded={activeAbout === index}
                >
                  <div className="space-y-4">
                    <h3 className="font-display text-xl font-semibold line-clamp-2">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted">{card.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {card.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </HoverCard>
              ))}
            </m.div>
          </section>

          <section className="space-y-8 py-10">
            <m.div
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-[0.3em] text-muted">
                Articles
              </p>
              <h2 className="font-display text-3xl font-semibold">近期文章</h2>
            </m.div>
            <m.div
              className="grid gap-6 md:grid-cols-2"
              variants={container}
              initial="hidden"
              animate={articleReveal.hasRevealed ? "show" : "hidden"}
              ref={articleReveal.ref}
            >
              {loading && articles.length === 0
                ? Array.from({ length: 4 }).map((_, index) => (
                    <m.div
                      key={`skeleton-${index}`}
                      variants={item}
                      className="card-muted p-6 min-h-[180px] animate-pulse"
                    >
                      <div className="h-3 w-20 rounded-full bg-[color:rgb(var(--ring)/0.35)]" />
                      <div className="mt-3 h-4 w-1/2 rounded-full bg-[color:rgb(var(--ring)/0.4)]" />
                      <div className="mt-4 h-3 w-full rounded-full bg-[color:rgb(var(--ring)/0.3)]" />
                      <div className="mt-2 h-3 w-4/5 rounded-full bg-[color:rgb(var(--ring)/0.25)]" />
                    </m.div>
                  ))
                : null}
              {!loading && articles.length === 0 ? (
                <m.div
                  variants={item}
                  className="card-muted p-6 min-h-[180px] text-sm text-muted"
                >
                  暂无文章内容。
                </m.div>
              ) : null}
              {articles.map((article) => (
                <HoverCardLink
                  key={article.link}
                  href={article.link}
                  className="p-6 min-h-[180px]"
                >
                  <div className="space-y-4">
                    {article.pubDate ? (
                      <p className="text-xs text-muted font-display">
                        {formatDate(article.pubDate)}
                      </p>
                    ) : null}
                    <h3 className="font-display text-xl font-semibold line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-3">
                      {article.description}
                    </p>
                  </div>
                </HoverCardLink>
              ))}
            </m.div>
          </section>

          <section className="py-16">
            <m.div
              className="card p-8 md:p-10"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <h2 className="font-display text-3xl font-semibold">感谢来访</h2>
                  <p className="text-sm text-muted">
                    这里记录我的思考与实践。如果你有想法，欢迎交流。
                  </p>
                </div>
                <EmailProtect
                  className="chip text-base"
                  user="hello"
                  domain="yourmail"
                  tld="com"
                  label="发送邮件"
                />
              </div>
            </m.div>
          </section>
        </main>

        <AnimatePresence mode="wait">
          {activeAboutDetail ? (
            <m.div
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <m.div
                className="absolute inset-0 bg-[color:rgb(var(--bg)/0.6)]"
                onClick={() => setActiveAbout(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  backdropFilter: "blur(18px)",
                  WebkitBackdropFilter: "blur(18px)",
                  willChange: "opacity"
                }}
              />
              <m.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="about-detail-title"
                onClick={(event) => event.stopPropagation()}
                className="card card-overlay relative z-10 w-full max-w-6xl p-8 md:p-12"
                style={{
                  borderColor: "rgb(var(--accent) / 0.32)",
                  boxShadow: "0 30px 80px rgba(15, 23, 42, 0.18)",
                  outline: "1px solid rgb(var(--accent) / 0.16)",
                  outlineOffset: "-1px"
                }}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-muted">
                      About
                    </p>
                    <h3
                      id="about-detail-title"
                      className="font-display text-3xl font-semibold"
                    >
                      {activeAboutDetail.title}
                    </h3>
                    <p className="text-sm text-muted">
                      {activeAboutDetail.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveAbout(null)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:rgb(var(--accent)/0.35)] bg-[color:rgb(var(--accent)/0.12)] text-[color:rgb(var(--accent))] transition hover:bg-[color:rgb(var(--accent)/0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgb(var(--accent)/0.5)]"
                    aria-label="关闭"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 6l12 12M18 6l-12 12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
                <div className="mt-6 space-y-4 text-sm text-[color:rgb(var(--fg))]">
                  {activeAboutDetail.body.map((paragraph, index) => (
                    <p key={`${activeAboutDetail.title}-${index}`}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {activeAboutDetail.highlights.map((highlight) => (
                    <span key={highlight} className="tag">
                      {highlight}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {activeAboutDetail.tags.map((tag) => (
                    <span key={tag} className="chip">
                      {tag}
                    </span>
                  ))}
                </div>
              </m.div>
            </m.div>
          ) : null}
        </AnimatePresence>
      </div>
    </LazyMotion>
  );
}
