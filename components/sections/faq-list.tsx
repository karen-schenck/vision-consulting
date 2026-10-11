"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

/** Plain accordion of questions; the FAQPage JSON-LD is emitted by the route. */
export function FaqList({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <Accordion type="single" collapsible className="border-t border-border">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`faq-${index}`} className="border-border">
          <AccordionTrigger className="py-6 text-left font-display text-[1.35rem] font-semibold leading-snug text-heading hover:text-accent hover:no-underline [&>svg]:text-accent">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="pb-6 text-base leading-relaxed text-foreground/75">
            <p className="max-w-[70ch]">{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
