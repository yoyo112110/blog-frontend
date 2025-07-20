import myAxios from "@/request";

// 友情链接接口定义
export interface Link { 
    linkId: string;
    linkTitle: string;
    linkUrl: string;
    linkLogoUrl: string | null; // 允许为null
    linkAddTime: string;
}

// 后端接口返回的通用格式
interface ApiResponse<T> {
    code: number;
    msg: string;
    data: T; // 实际数据存储在data字段中
}

// 获取所有友情链接（解析data字段）
export const getLinkList = async (): Promise<Link[]> => {
    const response = await myAxios.get<ApiResponse<Link[]>>("/api/link");
    // 只返回data中的数组（关键修复）
    return response.data.data || [];
};

// 根据ID获取单个链接
export const getLinkById = async (id: string): Promise<Link> => {
    const response = await myAxios.get<ApiResponse<Link>>(`/api/link/${id}`);
    return response.data.data;
};

// 新增/修改链接
export const saveLink = async (link: Link): Promise<Link> => {
    const response = await myAxios.post<ApiResponse<Link>>("/api/link", link);
    return response.data.data;
};

// 删除链接
export const deleteLink = async (id: string): Promise<void> => {
    await myAxios.delete<ApiResponse<void>>(`/api/link/${id}`);
};