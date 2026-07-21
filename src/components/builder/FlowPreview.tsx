import { useMemo } from 'react';
import type { Script } from '../../types/script';

interface FlowPreviewProps {
  script: Script;
}

interface LayoutNode {
  id: string;
  label: string;
  x: number;
  y: number;
  isOutcome: boolean;
  outcomeSentiment?: 'positive' | 'negative';
}

interface LayoutEdge {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const NODE_W = 140;
const NODE_H = 36;
const H_GAP = 40;
const V_GAP = 60;

function sentimentColor(s: string): string {
  switch (s) {
    case 'positive': return 'var(--accent-teal)';
    case 'negative': return 'var(--accent-red)';
    default: return 'var(--text-muted)';
  }
}

export function FlowPreview({ script }: FlowPreviewProps) {
  const { nodes, edges, width, height } = useMemo(() => {
    // BFS layer assignment
    const layers: string[][] = [];
    const visited = new Set<string>();
    let queue = [script.startStepId];
    visited.add(script.startStepId);

    while (queue.length > 0) {
      layers.push([...queue]);
      const nextQueue: string[] = [];
      for (const id of queue) {
        const step = script.steps[id];
        if (!step) continue;
        for (const r of step.responses) {
          if (r.nextStepId && !visited.has(r.nextStepId)) {
            visited.add(r.nextStepId);
            nextQueue.push(r.nextStepId);
          }
        }
      }
      queue = nextQueue;
    }

    // Add orphans as their own layer at the bottom
    const allIds = Object.keys(script.steps);
    const orphans = allIds.filter((id) => !visited.has(id));
    if (orphans.length > 0) {
      layers.push(orphans);
    }

    // Position nodes
    const nodeMap: Record<string, LayoutNode> = {};
    let maxX = 0;

    for (let row = 0; row < layers.length; row++) {
      const layer = layers[row];
      const totalWidth = layer.length * NODE_W + (layer.length - 1) * H_GAP;
      const startX = 0;

      for (let col = 0; col < layer.length; col++) {
        const id = layer[col];
        const step = script.steps[id];
        if (!step) continue;

        const x = startX + col * (NODE_W + H_GAP);
        const y = row * (NODE_H + V_GAP);

        nodeMap[id] = {
          id,
          label: step.label,
          x,
          y,
          isOutcome: !!step.isOutcome,
          outcomeSentiment: step.outcomeSentiment,
        };

        if (x + NODE_W > maxX) maxX = x + NODE_W;
      }
    }

    // Build edges
    const edgeList: LayoutEdge[] = [];
    for (const step of Object.values(script.steps)) {
      const from = nodeMap[step.id];
      if (!from) continue;
      for (const r of step.responses) {
        const to = nodeMap[r.nextStepId];
        if (!to) continue;
        edgeList.push({
          fromX: from.x + NODE_W / 2,
          fromY: from.y + NODE_H,
          toX: to.x + NODE_W / 2,
          toY: to.y,
          sentiment: r.sentiment,
        });
      }
    }

    return {
      nodes: Object.values(nodeMap),
      edges: edgeList,
      width: maxX + 40,
      height: layers.length * (NODE_H + V_GAP) + 40,
    };
  }, [script]);

  return (
    <div className="flow-preview">
      <h3 className="flow-preview__title">Flow Preview</h3>
      <div className="flow-preview__canvas-wrapper">
        <svg
          className="flow-preview__svg"
          width={width}
          height={height}
          viewBox={`-20 -10 ${width + 40} ${height + 20}`}
        >
          {/* Edges */}
          {edges.map((edge, i) => (
            <path
              key={i}
              d={`M${edge.fromX},${edge.fromY} C${edge.fromX},${edge.fromY + V_GAP / 2} ${edge.toX},${edge.toY - V_GAP / 2} ${edge.toX},${edge.toY}`}
              fill="none"
              stroke={sentimentColor(edge.sentiment)}
              strokeWidth={1.5}
              opacity={0.5}
            />
          ))}

          {/* Nodes */}
          {nodes.map((node) => {
            let fill = 'var(--bg-elevated)';
            let stroke = 'var(--border)';
            if (node.id === script.startStepId) {
              stroke = 'var(--accent-amber)';
            } else if (node.isOutcome) {
              stroke = node.outcomeSentiment === 'positive' ? 'var(--accent-teal)' : 'var(--accent-red)';
            }

            return (
              <g key={node.id}>
                <rect
                  x={node.x}
                  y={node.y}
                  width={NODE_W}
                  height={NODE_H}
                  rx={6}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={1.5}
                />
                <text
                  x={node.x + NODE_W / 2}
                  y={node.y + NODE_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--text-primary)"
                  fontSize={11}
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {node.label.length > 16 ? node.label.slice(0, 15) + '…' : node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
