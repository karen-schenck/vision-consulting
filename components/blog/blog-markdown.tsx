'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { markdownToHtml } from '@/lib/markdown';

type MarkdownSegment =
  | { type: 'markdown'; content: string }
  | { type: 'mermaid'; chart: string };

const MERMAID_FENCE_PATTERN = /^```mermaid\s*$/i;
const CLOSING_FENCE_PATTERN = /^```\s*$/;

function splitMermaidFences(markdown: string): MarkdownSegment[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const segments: MarkdownSegment[] = [];
  let markdownLines: string[] = [];
  let index = 0;

  while (index < lines.length) {
    if (!MERMAID_FENCE_PATTERN.test(lines[index].trim())) {
      markdownLines.push(lines[index]);
      index += 1;
      continue;
    }

    if (markdownLines.join('\n').trim()) {
      segments.push({ type: 'markdown', content: markdownLines.join('\n') });
    }
    markdownLines = [];
    index += 1;

    const chartLines: string[] = [];
    while (index < lines.length && !CLOSING_FENCE_PATTERN.test(lines[index].trim())) {
      chartLines.push(lines[index]);
      index += 1;
    }

    if (index < lines.length) {
      index += 1;
    }

    const chart = chartLines.join('\n').trim();
    if (chart) {
      segments.push({ type: 'mermaid', chart });
    }
  }

  if (markdownLines.join('\n').trim()) {
    segments.push({ type: 'markdown', content: markdownLines.join('\n') });
  }

  return segments;
}

function BlogMermaid({ chart }: { chart: string }) {
  const reactId = useId();
  const renderCountRef = useRef(0);
  const bindFunctionsRef = useRef<((element: Element) => void) | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const htmlElement = document.documentElement;
    const baseId = `blog-mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    async function renderChart() {
      const { default: mermaid } = await import('mermaid');
      const isDarkTheme =
        htmlElement.classList.contains('dark') ||
        htmlElement.getAttribute('data-theme') === 'dark';

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        fontFamily: 'inherit',
        theme: isDarkTheme ? 'dark' : 'default',
      });

      try {
        const renderId = `${baseId}-${renderCountRef.current}`;
        renderCountRef.current += 1;
        const { svg: renderedSvg, bindFunctions } = await mermaid.render(renderId, chart);

        if (!isCancelled) {
          bindFunctionsRef.current = bindFunctions;
          setSvg(renderedSvg);
          setError(null);
        }
      } catch (renderError) {
        if (!isCancelled) {
          bindFunctionsRef.current = undefined;
          setSvg('');
          setError(renderError instanceof Error ? renderError.message : 'Unable to render Mermaid chart.');
        }
      }
    }

    void renderChart();

    const observer = new MutationObserver(() => {
      void renderChart();
    });
    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [chart, reactId]);

  useEffect(() => {
    const container = containerRef.current;
    const svgElement = container?.firstElementChild;

    if (!container || !svgElement || !bindFunctionsRef.current) {
      return;
    }

    bindFunctionsRef.current(svgElement);
  }, [svg]);

  return (
    <figure className="my-10 overflow-x-auto rounded-xl border border-border bg-card p-4 shadow-sm">
      <div
        ref={containerRef}
        className="[&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {error && (
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-secondary p-4 text-sm leading-6 text-destructive">
          {error}
        </pre>
      )}
    </figure>
  );
}

export function BlogMarkdown({ markdown }: { markdown: string }) {
  const segments = splitMermaidFences(markdown);

  return (
    <div className="blog-prose">
      {segments.map((segment, index) =>
        segment.type === 'mermaid' ? (
          <BlogMermaid key={`${index}-mermaid`} chart={segment.chart} />
        ) : (
          <div
            key={`${index}-markdown`}
            dangerouslySetInnerHTML={{ __html: markdownToHtml(segment.content) }}
          />
        )
      )}
    </div>
  );
}
