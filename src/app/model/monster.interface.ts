export interface Monster {
    default: boolean; // Set yes if this is the default skin
    name: string;
    family: string;
    emName: string;
    currentPath: string;
    rarity: number; // 0 Bronze | 1 Silver | 2 Gold
    activeVariant: boolean; // Yes if visible, no if not
    author?: string;
    version?: string;
    contact?: string;
    website?: string;
    modNexus?: string;
    previewImg?: Array<string>; // Preview folder imgs
}
