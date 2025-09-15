import React, { useState, useContext, useEffect } from "react";
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
import { ArrowLeft } from "lucide-react";

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
  useEffect(() => {
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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Spin size="large" tip="Loading Kanji..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button
              type="text"
              icon={<ArrowLeft size={18} />}
              className="!text-gray-600 hover:!text-blue-600"
            >
              Back
            </Button>
          </Link>
          <Title level={3} className="!mb-0 !text-blue-700">
            Kanji Explorer
          </Title>
        </div>

        <Select
          defaultValue="all"
          onChange={handleFilterChange}
          style={{ width: 160 }}
        >
          <Option value="all">All Levels</Option>
          <Option value="N5">JLPT N5</Option>
          <Option value="N4">JLPT N4</Option>
          <Option value="N3">JLPT N3</Option>
        </Select>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto">
        <Title level={4} className="!mb-6 !text-gray-800">
          {filterLevel === "all"
            ? "All Kanji"
            : `Kanji for JLPT ${filterLevel}`}
        </Title>

        {/* Grid of Kanji Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((k) => (
            <Card
              key={k.Id}
              hoverable
              className="shadow-md rounded-2xl transition hover:shadow-lg"
            >
              <div className="text-center mb-4">
                <span className="text-6xl font-bold text-blue-700">
                  {k.Kanji}
                </span>
              </div>
              <p>
                <Text strong>Meanings:</Text> {k.Meanings}
              </p>
              <p>
                <Text strong>Kun:</Text> {k.KunReadings}
              </p>
              <p>
                <Text strong>On:</Text> {k.OnReadings}
              </p>
              <div className="flex justify-between mt-4 items-center">
                <Text type="secondary">JLPT: N{k.JLPT}</Text>
                <Button
                  type="link"
                  className="!p-0"
                  onClick={() => openModal(k.Id)}
                >
                  More Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>

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
      title={
        details ? (
          <span className="text-xl font-semibold text-blue-700">
            {details.Kanji} – Details
          </span>
        ) : (
          "Kanji Details"
        )
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={680}
      className="rounded-xl"
      bodyStyle={{ padding: "16px 20px" }} // 🔹 reduce inner padding
    >
      {loading ? (
        <div className="flex justify-center items-center p-6">
          <Spin size="large" tip="Loading details..." />
        </div>
      ) : details ? (
        <div className="space-y-4">
          {/* Basic Info in 2-column grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <p>
              <Text strong>Meanings:</Text> {details.Meanings}
            </p>
            <p>
              <Text strong>Additional:</Text> {details.Meaning2}
            </p>
            <p className="col-span-2">
              <Text strong>Details:</Text> {details.Details}
            </p>
          </div>

          {/* Examples Section */}
          {details.examples?.length > 0 && (
            <>
              <Title level={5} className="!mt-4 !mb-2 !text-gray-700">
                Examples
              </Title>
              <List
                dataSource={details.examples}
                renderItem={(ex) => (
                  <Card
                    key={ex.ExampleId}
                    className="mb-3 rounded-lg shadow-sm border border-gray-100"
                    bodyStyle={{ padding: "12px 16px" }} // 🔹 tighter padding
                  >
                    <div className="text-sm space-y-1">
                      <p>
                        <Text strong>Japanese:</Text> {ex.Japanese}
                      </p>
                      <p>
                        <Text strong>Romaji:</Text> {ex.Romaji}
                      </p>
                      <p>
                        <Text strong>English:</Text> {ex.English}
                      </p>
                    </div>

                    {ex.vocab?.length > 0 && (
                      <div className="mt-3">
                        <Text strong className="block mb-1 text-gray-700">
                          Vocabulary
                        </Text>
                        <List
                          size="small"
                          dataSource={ex.vocab}
                          renderItem={(v) => (
                            <List.Item
                              key={v.VocabId}
                              className="!py-1 !px-0 text-sm"
                            >
                              <Text strong>{v.Word}</Text> ({v.Romaji}) –{" "}
                              {v.Meaning}
                            </List.Item>
                          )}
                        />
                      </div>
                    )}
                  </Card>
                )}
              />
            </>
          )}
        </div>
      ) : (
        <Text type="secondary">No details available.</Text>
      )}
    </Modal>
  );
}


export default KanjiCards;
