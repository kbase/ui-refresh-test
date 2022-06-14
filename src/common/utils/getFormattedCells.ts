import { WorkspaceObject, NarrativeCell } from '../models/WorkspaceObject';

export interface FormattedCell {
  title?: string;
  cellType?: string;
  metaName?: string;
  subtitle?: string;
  tag?: string;
}

// get formatted object cells to display within preview.tsx
export function getFormattedCells(obj: WorkspaceObject): FormattedCell[] {
  if (!obj.cells) return [];
  return obj.cells.map((cell: NarrativeCell) => {
    const metadata = cell.metadata?.kbase || {};
    const title = metadata?.attributes?.title;
    const subtitle = metadata?.attributes?.subtitle || cell.source;
    const cellType = metadata.type ? metadata.type : cell.cell_type;
    const info = metadata?.dataCell?.objectInfo || {};
    let metaName, tag;
    switch (cellType) {
      case 'app':
        metaName = metadata?.appCell?.app?.id;
        tag = metadata?.appCell?.app?.tag;
        break;
      case 'data':
        metaName = info?.typeName;
        if (!metaName) {
          metaName = info?.type;
        }
        break;
    }
    return { title, subtitle, tag, cellType, metaName };
  });
}
