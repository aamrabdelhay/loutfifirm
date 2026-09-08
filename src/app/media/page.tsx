import { SiteShell, getContent } from "@/components/shell";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/ui";
import { YoutubeCard } from "@/components/youtube-card";
import { listMedia } from "@/lib/content";
import { Video } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  const [content, media] = await Promise.all([getContent(), listMedia()]);

  return (
    <SiteShell>
      <PageHero
        label="وسائط ومحاضرات"
        title="شاهد الدكتور على الشاشات"
        crumb="وسائط ومحاضرات"
        description={content.pages.media}
      />
      <section className="py-16 md:py-24">
        <div className="container-x">
          {media.length === 0 ? (
            <Reveal className="py-20 text-center text-muted">
              <Video className="mx-auto mb-4 text-steel-500" size={40} />
              لا توجد وسائط منشورة حاليًا.
            </Reveal>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {media.map((m, i) => (
                <Reveal key={m.id} delay={Math.min(i * 80, 320)}>
                  <YoutubeCard url={m.url} title={m.title} source={m.source} dateLabel={m.dateLabel} large />
                  {m.description ? (
                    <p className="mt-4 text-sm leading-8 text-muted">{m.description}</p>
                  ) : null}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
