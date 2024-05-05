// AddressForm.tsx
import React, { useEffect, useState } from 'react';
import {District, Province, Ward} from "@models/address";
import {getAllDistricts, getAllProvinces, getAllWards} from "../../../../services/main/clientRequest/address-location";



interface InputAddressProps {
    onAddressComplete: (address: string) => void;
}
interface ProvinceResponse {
    data: Province[];
}

interface DistrictResponse {
    data: District[];
}

interface WardResponse {
    data: Ward[];
}
const InputAddress: React.FC<InputAddressProps> = ({ onAddressComplete }) => {

    const [streetAddress, setStreetAddress] = useState('');
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState('');
    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [selectedWardId, setSelectedWardId] = useState('');


    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                // Gọi hàm API và trực tiếp gán giá trị vào state
                setProvinces(await getAllProvinces());
            } catch (error) {
                console.error('Error fetching provinces:', error);
                setProvinces([]); // Xử lý khi có lỗi
            }
        };

        fetchProvinces();
    }, []);

    // Phần còn lại của code không thay đổi

// Hàm gọi fetch API lấy districts
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!selectedProvinceId) {
                setDistricts([]);
                setSelectedDistrictId('');
                return;
            }
            try {
                // Kết quả trả về đã được định dạng phù hợp với kiểu dữ liệu
                const fetchedDistricts = await getAllDistricts(selectedProvinceId);
                setDistricts(fetchedDistricts);
            } catch (error) {
                console.error('Error fetching districts:', error);
                setDistricts([]); // Đặt lại mảng rỗng khi có lỗi xảy ra
            }
        };

        fetchDistricts();
    }, [selectedProvinceId]);

// Hàm gọi fetch API lấy wards
    useEffect(() => {
        const fetchWards = async () => {
            if (!selectedDistrictId) {
                setWards([]);
                setSelectedWardId('');
                return;
            }
            try {
                // Kết quả trả về đã được định dạng phù hợp với kiểu dữ liệu
                const fetchedWards = await getAllWards(selectedDistrictId);
                setWards(fetchedWards);
            } catch (error) {
                console.error('Error fetching wards:', error);
                setWards([]); // Đặt lại mảng rỗng khi có lỗi xảy ra
            }
        };

        fetchWards();
    }, [selectedDistrictId]);

// Phần còn lại của code không thay đổi

    // Hàm để cập nhật địa chỉ hoàn chỉnh
    useEffect(() => {
        if (selectedProvinceId && selectedDistrictId && selectedWardId && streetAddress) {
            const selectedProvince = provinces.find(p => p.province_id === selectedProvinceId)?.province_name;
            const selectedDistrict = districts.find(d => d.district_id === selectedDistrictId)?.district_name;
            const selectedWard = wards.find(w => w.ward_id === selectedWardId)?.ward_name;
            const completeAddress = `${streetAddress}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;
            onAddressComplete(completeAddress);
            console.log('điịa chỉ :',completeAddress);
        }
    }, [streetAddress, selectedProvinceId, selectedDistrictId, selectedWardId, provinces, districts, wards]);

    return (

        <div className="space-y-6 sm:space-y-0 sm:space-x-6 mb-6 flex flex-col sm:flex-row">
            <div className="flex-grow">
                <label className="block mb-2 sm:mb-0 sm:mr-4">
                    Số nhà, Tên đường:
                    <input
                        type="text"
                        placeholder="Ví dụ: 123 Lý Thường Kiệt"
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300
                         focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                    />

                </label>
            </div>
            <div className="flex-grow">
                <label className="block mb-2 sm:mb-0 sm:mr-4">
                    Tỉnh/Thành Phố:
                    <select
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        onChange={(e) => {
                            const provinceId = e.target.value;
                            setSelectedProvinceId(provinceId); // Sử dụng giá trị string
                            setDistricts([]);
                            setWards([]);
                        }}
                    >
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        {provinces.map((province) => (
                            <option key={province.province_id} value={province.province_id}>
                                {province.province_name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>


            <div className="flex-grow">
                <label className="block mb-2 sm:mb-0 sm:mr-4">
                    Quận/Huyện:
                    <select
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        disabled={!selectedProvinceId}
                        onChange={(e) => {
                            const districtId = e.target.value;
                            setSelectedDistrictId(districtId); // Sử dụng giá trị string
                            setWards([]);
                        }}
                    >
                        <option value="">Chọn Quận/Huyện</option>
                        {districts.map((district) => (
                            <option key={district.district_id} value={district.district_id}>
                                {district.district_name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="flex-grow">
                <label className="block">
                    Phường/Xã:
                    <select
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        disabled={!selectedDistrictId}
                        onChange={(e) => setSelectedWardId(e.target.value)}
                    >
                        <option value="">Chọn Phường/Xã</option>
                        {wards.map((ward) => (
                            <option key={ward.ward_id} value={ward.ward_id}>
                                {ward.ward_name}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
};

export default InputAddress;