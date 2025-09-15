import React, { useState, useContext } from "react";
import {
  Typography,
  Spin,
  Button,
  Select,
  Card,
  Modal,
  List,
} from "antd";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";

const { Title, Text } = Typography;
const { Option } = Select;

function KanjiCards() {
  const { kanji, loading, fetchKanjiDetails, kanjiDetails } =
    useContext(GlobalContext);

  const [filteredList, setFilteredList] = useState([]);
  const [filterLevel, setFilterLevel] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKanjiId, setSelectedKanjiId] = useState(null);

  // Filter whenever kanji changes
  React.useEffect(() => {
    if (kanji && kanji.length > 0) {
      setFilteredList(kanji);
    }
  }, [kanji]);

  const handleFilterChange = (value) => {
    setFilterLevel(value);
    if (value === "all") {
      setFilteredList(kanji);
    } else {
      setFilteredList(kanji.filter((k) => `N${k.JLPT}` === value));
    }
  };

  const openModal = (id) => {
    setSelectedKanjiId(id);
    fetchKanjiDetails(id); // 🔹 fetch details from context
    setIsModalOpen(true);
  };

  if (loading && (!kanji || kanji.length === 0)) {
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

      {/* Grid of Kanji Cards */}
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
            <div className="flex justify-between mt-2 items-center">
              <Text type="secondary">JLPT: N{k.JLPT}</Text>
              <Button type="link" onClick={() => openModal(k.Id)}>
                More Details
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Kanji Details */}
      {selectedKanjiId && (
        <KanjiDetailsModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          details={kanjiDetails}
          loading={loading}
        />
      )}
    </div>
  );
}

// ================== Modal Component ==================
function KanjiDetailsModal({ visible, onClose, details, loading }) {
  return (
    <Modal
      title={details ? `Kanji: ${details.Kanji}` : "Kanji Details"}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <Spin size="large" tip="Loading details..." />
        </div>
      ) : details ? (
        <div>
          <p>
            <Text strong>Meanings:</Text> {details.Meanings}
          </p>
          <p>
            <Text strong>Additional Meaning:</Text> {details.Meaning2}
          </p>
          <p>
            <Text strong>Details:</Text> {details.Details}
          </p>

          <Title level={4} className="mt-4">
            Examples
          </Title>
          <List
            dataSource={details.examples}
            renderItem={(ex) => (
              <Card key={ex.ExampleId} className="mb-4">
                <p>
                  <Text strong>Japanese:</Text> {ex.Japanese}
                </p>
                <p>
                  <Text strong>Romaji:</Text> {ex.Romaji}
                </p>
                <p>
                  <Text strong>English:</Text> {ex.English}
                </p>
                <Title level={5}>Vocabulary</Title>
                <List
                  dataSource={ex.vocab}
                  renderItem={(v) => (
                    <List.Item key={v.VocabId}>
                      <Text strong>{v.Word}</Text> ({v.Romaji}) - {v.Meaning}
                    </List.Item>
                  )}
                />
              </Card>
            )}
          />
        </div>
      ) : (
        <Text type="secondary">No details available.</Text>
      )}
    </Modal>
  );
}

export default KanjiCards;
