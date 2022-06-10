export type CellType = 'app' | 'data';
export interface NarrativeCell {
  metadata?: {
    kbase?: {
      attributes?: {
        title?: string;
        subtitle?: string;
      };
      type?: CellType;
      dataCell?: {
        objectInfo?: {
          typeName?: string;
          type?: string;
        };
      };
      appCell?: {
        app?: {
          id?: string;
          tag?: 'release' | 'beta' | 'dev';
        };
      };
    };
  };
  source?: string;
  cell_type?: CellType;
}

// corresponds to worspace.get_objects2 result.
// currently only use the data field but there are other fields which can be added as needed
export interface WorkspaceObject {
  data: { cells?: NarrativeCell };
}
