import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CalendarIcon } from "lucide-react";

const Dashboard: React.FC = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<any[]>([]);
  const transformDataToMonths = (data: any[]) => {
    const months = Array(12).fill(0); // Tạo mảng 12 tháng với giá trị ban đầu là 0
  
    data.forEach((item) => {
      const monthIndex = new Date(item.date).getMonth(); // Lấy tháng (0-11)
      months[monthIndex] += item.value; // Cộng dồn giá trị vào tháng tương ứng
    });
  
    // Chuyển đổi về dạng phù hợp cho biểu đồ
    return months.map((value, index) => ({
      month: new Date(2025, index, 1).toLocaleString("en-US", { month: "short" }),
      value: value,
    }));
  };
  const [keyX, setKeyX] = useState("month"); // Mặc định hiển thị theo tháng

const fetchStatistics = async () => {
  try {
    let url = "http://localhost:8080/dashboard";

    let isFiltered = false;
    if (startDate && endDate) {
      url += `?start=${startDate}&end=${endDate}`;
      isFiltered = true; // Có bộ lọc theo ngày
    }

    console.log("📡 Gọi API với URL:", url);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Lỗi API: ${response.status}`);
    }

    const data = await response.json();
    console.log("📊 Dữ liệu gốc:", data);

    const transformedData = isFiltered ? data : transformDataToMonths(data);
    console.log("📊 Dữ liệu đã chuyển đổi:", transformedData);

    setKeyX(isFiltered ? "date" : "month"); // Cập nhật key X
    setData(transformedData);
  } catch (error) {
    console.error("❌ Lỗi khi lấy dữ liệu thống kê:", error);
  }
};

  
  
  useEffect(() => {
    fetchStatistics();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard Thống kê</h2>
      <Card className="p-4">
        <div className="flex gap-4 mb-4 items-center">
          <div className="relative">
            <CalendarIcon className="absolute left-2 top-2.5 text-gray-500" size={20} />
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="pl-8" />
          </div>
          <div className="relative">
            <CalendarIcon className="absolute left-2 top-2.5 text-gray-500" size={20} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="pl-8" />
          </div>
          <Button onClick={fetchStatistics}>Xem thống kê</Button>
        </div>
        <CardContent>
        {data.length === 0 ? (
    <div className="text-center text-gray-500">Không có dữ liệu để hiển thị.</div>
  ) : (
          <ResponsiveContainer width="100%" height={300}>
            
            <LineChart data={data}>
              <XAxis dataKey={keyX} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
  )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
