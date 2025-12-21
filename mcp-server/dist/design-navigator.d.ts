/**
 * Thoughtform Design Navigator
 *
 * Implements two complementary modes for the semantic design system:
 *
 * MODE 1: MATCH (Grounded Search)
 * - Find similar existing components
 * - Get implementation guidance
 * - Practical, actionable, grounded in codebase
 *
 * MODE 2: NAVIGATE (Generative Exploration)
 * - Project references into platform-specific expressions
 * - Interpolate between design points
 * - Explore design space with semantic parameters
 */
export interface ComponentEmbedding {
    id: string;
    name: string;
    repo: string;
    platform: string;
    embeddingText: string;
    usesTokens: string[];
    usesPatterns: string[];
    relatedComponents: string[];
    semanticPosition: SemanticPosition;
    embedding: number[];
}
export interface SemanticPosition {
    terminal_organic: number;
    minimal_dense: number;
    cool_warm: number;
    static_animated: number;
}
export interface DesignSpaceAxis {
    id: string;
    name: string;
    negative: {
        label: string;
        tokens: string[];
        patterns: string[];
    };
    positive: {
        label: string;
        tokens: string[];
        patterns: string[];
    };
}
export interface PlatformDefinition {
    id: string;
    position: SemanticPosition;
    primaryTokens: string[];
}
export interface ComponentGraph {
    nodes: {
        id: string;
        platform: string;
        type: string;
    }[];
    edges: {
        source: string;
        target: string;
        relationship: string;
    }[];
}
export interface MatchResult {
    component: ComponentEmbedding;
    similarity: number;
    sharedPatterns: string[];
    sharedTokens: string[];
}
export interface ProjectionResult {
    platform: string;
    description: string;
    suggestedTokens: string[];
    suggestedPatterns: string[];
    similarComponents: string[];
    positionAdjustments: Partial<SemanticPosition>;
}
export interface InterpolationPoint {
    ratio: number;
    description: string;
    suggestedTokens: string[];
    suggestedPatterns: string[];
}
export interface ExploreResult {
    position: SemanticPosition;
    nearestPlatform: string;
    platformDistance: number;
    suggestedTokens: string[];
    suggestedPatterns: string[];
    nearbyComponents: MatchResult[];
}
declare let designSpace: {
    axes: DesignSpaceAxis[];
    platforms: PlatformDefinition[];
} | null;
declare let componentGraph: ComponentGraph | null;
export declare function initializeNavigator(config: {
    voyageKey?: string;
}): void;
/**
 * Find components similar to the given description/reference
 */
export declare function matchReference(description: string, options?: {
    platform?: string;
    limit?: number;
    threshold?: number;
}): Promise<{
    matches: MatchResult[];
    suggestedTokens: string[];
    suggestedPatterns: string[];
    implementationPath: string[];
}>;
/**
 * Search components by semantic position in design space
 */
export declare function searchByPosition(position: Partial<SemanticPosition>, options?: {
    limit?: number;
}): MatchResult[];
/**
 * Project a reference into platform-specific expressions
 */
export declare function projectReference(description: string, targetPlatforms?: string[]): Promise<ProjectionResult[]>;
/**
 * Interpolate between two components or design points
 */
export declare function interpolateDesigns(componentA: string, componentB: string, steps?: number): InterpolationPoint[];
/**
 * Explore design space by adjusting semantic parameters
 */
export declare function exploreSpace(parameters: Partial<SemanticPosition>, options?: {
    limit?: number;
}): ExploreResult;
export declare function getComponentById(id: string): ComponentEmbedding | undefined;
export declare function getAllComponents(): ComponentEmbedding[];
export declare function getDesignSpace(): typeof designSpace;
export declare function getComponentGraph(): typeof componentGraph;
export declare function getStats(): {
    componentCount: number;
    platforms: string[];
    axisCount: number;
};
export {};
