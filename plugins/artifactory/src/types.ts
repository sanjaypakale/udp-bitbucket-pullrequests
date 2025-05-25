export interface ArtifactoryArtifact {
  name: string;
  path: string;
  repo: string;
  size: number;
  created: string;
  modified: string;
  updated: string;
  createdBy: string;
  modifiedBy: string;
  updatedBy: string;
  sha1: string;
  md5: string;
}

export interface ArtifactListProps {
  artifacts: ArtifactoryArtifact[];
} 