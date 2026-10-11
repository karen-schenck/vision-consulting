import { cn } from "@/lib/utils"
import { Reveal } from "@/components/shared/reveal"

/** Eyebrow + display title + optional lead, shared by every section. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "dark",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  tone?: "dark" | "light"
  className?: string
  as?: "h1" | "h2" | "h3"
}) {
  return (
    <Reveal className={cn(align === "center" && "mx-auto text-center", "max-w-[48rem]", className)}>
      {eyebrow ? <p className="section-eyebrow mb-5">{eyebrow}</p> : null}
      <Heading
        className={cn(
          "display-title text-[clamp(2rem,1.4rem+2.2vw,3.4rem)]",
          tone === "light" ? "text-primary-foreground" : "text-heading"
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p
          className={cn(
            "mt-6 text-base leading-relaxed md:text-lg",
            align === "center" && "mx-auto",
            "max-w-[60ch]",
            tone === "light" ? "text-primary-foreground/75" : "text-foreground/75"
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  )
}
