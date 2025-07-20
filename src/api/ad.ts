import myAxios from '@/request';

export interface Ad { 
  adId: string;
  adTypeId: string;
  adTitle: string;
  adUrl: string;
  adSort: number;
  adBegintTime: string;
  adEndTime: string;
  adAddTime: string;
  status: number;
  adType?: {
    adTypeId: string;
    adTypeTitle: string;
    adTypeTag: string;
    adTypeSort: number;
    adTypeAddTime: string;
  }
}

/**
 * 获取所有广告数据
 * 对应后端接口：GET /api/ads/all
 */
// export const getAllAds = async (): Promise<Ad[]> => {
//   try {
//     const response = await myAxios.get<Ad[]>("/api/ads/all");
//     // 后端返回格式为直接返回 List<Ad>，故直接返回 response.data
//     return response.data;
//   } catch (error) {
//     console.error("获取广告数据失败：", error);
//     throw error; // 抛出错误让调用方处理
//   }
// };
/**
 * 获取所有广告数据（可过滤状态）
 * @param status 广告状态（可选，默认获取所有状态）
 */
export const getAllAds = async (status?: number): Promise<Ad[]> => {
  try {
    const params = status !== undefined ? { status } : {};
    const response = await myAxios.get<Ad[]>("/api/ads/all", { params });
    return response.data;
  } catch (error) {
    console.error("获取广告数据失败：", error);
    throw error;
  }
};