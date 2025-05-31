import { Artifact } from '../../api';
import { ArtifactNode, BuildGroup, ParsedPath } from './types';
export declare const formatFileSize: (bytes: number) => string;
export declare const formatDate: (dateString: string) => string;
export declare const parsePath: (path: string, fileName: string) => ParsedPath | null;
export declare const buildArtifactTree: (artifacts: Artifact[]) => ArtifactNode;
export declare const generateBuildUrl: (build: BuildGroup) => string;
export declare const getFileIconColor: (fileName: string) => string;
export declare const getAllFiles: (node: ArtifactNode) => ArtifactNode[];
