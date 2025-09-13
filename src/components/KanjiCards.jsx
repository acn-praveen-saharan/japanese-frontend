import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Button, Select } from "antd";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

function KanjiCards() {
  const [kanjiList, setKanjiList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("all");

  useEffect(() => {
    fetch(
      "https://japanese-nx-gqducnd9c8d4fjbg.canadacentral-01.azurewebsites.net/api/kanji"
    )
      .then((res) => res.json())
      .then((data) => {
        setKanjiList(data);
        setFilteredList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching kanji:", err);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (value) => {
    setFilterLevel(value);
    if (value === "all") {
      setFilteredList(kanjiList);
    } else {
      setFilteredList(kanjiList.filter((k) => `N${k.JLPT}` === value));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading Kanji..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Kanji List</Title>
        <div className="flex gap-4">
          <Select
            defaultValue="all"
            onChange={handleFilterChange}
            style={{ width: 150 }}
          >
            <Option value="all">All Levels</Option>
            <Option value="N5">JLPT N5</Option>
            <Option value="N4">JLPT N4</Option>
          </Select>
          <Button type="primary">
            <Link to="/">Home</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredList.map((k) => (
          <Card
            key={k.Id}
            hoverable
            className="shadow-md rounded-2xl"
            title={<span className="text-5xl font-bold">{k.Kanji}</span>}
          >
            <p>
              <Text strong>Meanings:</Text> {k.Meanings}
            </p>
            <p>
              <Text strong>Kun:</Text> {k.KunReadings}
            </p>
            <p>
              <Text strong>On:</Text> {k.OnReadings}
            </p>
            <div className="flex justify-between mt-2">
              <Text type="secondary">JLPT: N{k.JLPT}</Text>
              <Text type="secondary">Strokes: {k.StrokeCount}</Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default KanjiCards;
