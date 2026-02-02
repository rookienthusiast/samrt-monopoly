
export interface PropertyLevel {
    id: number;
    level: number;
    upgrade_cost: number;
    risk_Mitigation_fraud: number;
    sdg_benefit: number;
}

export interface Property {
    id: number;
    name: string;
    slug: string;
    type: string;
    base_price: string;
    levels: PropertyLevel[];
    board_position?: number;
}

export interface TileData {
    index: number;
    type: 'START' | 'PROPERTY' | 'CHANCE' | 'JAIL' | 'FREE_PARKING' | 'GO_TO_JAIL' | 'TAX' | 'UTILITY' | 'EVENT' | 'CRISIS' | 'AUDIT' | 'ZONE';
    name: string;
    subName?: string;
    property?: Property;
    color?: string;
    textColor?: string;
}

export interface PageProps {
    properties: Property[];
}
