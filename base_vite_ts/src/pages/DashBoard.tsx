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
  const fetchStatistics = async () => {
    try {
      const response = await fetch("http://localhost:8080/dashboard");
      const contentType = response.headers.get("content-type");
  
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ API trả về HTML:", text);
        throw new Error("API không trả về JSON. Kiểm tra API!");
      }
  
      const data = await response.json();
      console.log("📊 Dữ liệu thống kê:", data);
  
      // Cập nhật state để hiển thị dữ liệu
      setData(data);
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
  <p className="text-gray-500">Không có dữ liệu để hiển thị</p>
) : (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <XAxis dataKey="date" />
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
