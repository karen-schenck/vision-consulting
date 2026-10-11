/** Renders one <script type="application/ld+json"> per schema object. */
export function JsonLd({ data }: { data: unknown[] }) {
  return (
    <>
      {data.filter(Boolean).map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
