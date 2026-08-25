import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { IndexNode } from "../../../src/model/types.js";

interface NodeSearchProps {
  nodes: IndexNode[];
  onNavigate: (nodeId: string) => void;
}

export function NodeSearch({ nodes, onNavigate }: NodeSearchProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [resultsOpen, setResultsOpen] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const listboxId = useId();
  const results = useMemo(() => findNodes(nodes, query), [nodes, query]);
  const hasQuery = normalize(query) !== "";
  const resultsVisible = resultsOpen && results.length > 0;
  const emptyVisible = resultsOpen && hasQuery && results.length === 0;

  useEffect(() => {
    function closeWhenPointerLeavesSearch(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node) || containerRef.current?.contains(target) === true) {
        return;
      }

      setResultsOpen(false);
      setActiveIndex(-1);
    }

    document.addEventListener("pointerdown", closeWhenPointerLeavesSearch);
    return () => document.removeEventListener("pointerdown", closeWhenPointerLeavesSearch);
  }, []);

  function select(node: IndexNode) {
    onNavigate(node.id);
    setQuery("");
    setActiveIndex(-1);
    setResultsOpen(false);
  }

  return (
    <section ref={containerRef} className="node-search" aria-label="Search Nodes">
      <label htmlFor={listboxId}>Search Nodes</label>
      <input
        id={listboxId}
        type="search"
        placeholder="Title or ID"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(-1);
          setResultsOpen(true);
        }}
        onFocus={() => setResultsOpen(hasQuery)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" && results.length > 0) {
            event.preventDefault();
            setResultsOpen(true);
            setActiveIndex((index) => Math.min(index + 1, results.length - 1));
          }
          if (event.key === "ArrowUp" && results.length > 0) {
            event.preventDefault();
            setResultsOpen(true);
            setActiveIndex((index) => Math.max(index - 1, 0));
          }
          if (event.key === "Enter" && resultsVisible && activeIndex >= 0) {
            event.preventDefault();
            select(results[activeIndex]!);
          }
          if (event.key === "Escape") {
            setQuery("");
            setActiveIndex(-1);
            setResultsOpen(false);
          }
        }}
        role="searchbox"
        aria-controls={`${listboxId}-results`}
        aria-expanded={resultsVisible}
        aria-activedescendant={resultsVisible && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
      />
      {resultsVisible ? (
        <ul id={`${listboxId}-results`} role="listbox" aria-label="Node results">
          {results.map((node, index) => (
            <li
              key={node.id}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => select(node)}
            >
              {node.title}
            </li>
          ))}
        </ul>
      ) : null}
      {emptyVisible ? <p className="node-search__empty" role="status">No matching nodes</p> : null}
    </section>
  );
}

function findNodes(nodes: IndexNode[], query: string): IndexNode[] {
  const normalizedQuery = normalize(query);
  if (normalizedQuery === "") {
    return [];
  }

  return nodes
    .filter((node) => normalize(node.title).includes(normalizedQuery) || normalize(node.id).includes(normalizedQuery))
    .sort((left, right) => compareNodes(left, right))
    .slice(0, 8);
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function compareNodes(left: IndexNode, right: IndexNode): number {
  const titleComparison = compareText(left.title, right.title);
  return titleComparison !== 0 ? titleComparison : compareText(left.id, right.id);
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}
