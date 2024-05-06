

export type Province =  {
    province_id: string;
    province_name: string;
};

export type District =  {
    district_id: string;
    district_name: string;
    province_id: string;
};

export type Ward =  {
    ward_id: string;
    ward_name: string;
    district_id: string;
};