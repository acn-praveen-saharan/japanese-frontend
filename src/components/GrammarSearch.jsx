import React, { useState } from "react";
import { Input, Button, Card, Typography, Spin, message } from "antd";

const { Title, Paragraph } = Typography;

const GrammarSearch = () => {
  const [concept, setConcept] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!concept.trim()) {
      message.warning("Please enter a concept to search.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        "https://japanese-nx-gqducnd9c8d4fjbg.canadacentral-01.azurewebsites.net/api/gemini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concept }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch grammar details");
      }

      const data = await res.json();

      // ✅ Extract only geminiData
      setResult(data.geminiData || null);
    } catch (err) {
      console.error(err);
      message.error("Error fetching grammar details.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", textAlign: "center" }}>
      <Input
        placeholder="Enter a grammar concept (e.g., Verb て-form)"
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        onPressEnter={handleSearch}
        style={{ marginBottom: 12 }}
      />
      <Button type="primary" onClick={handleSearch} loading={loading}>
        Search
      </Button>

      {loading && <Spin style={{ marginTop: 20 }} />}

      {result && !loading && (
        <Card style={{ marginTop: 24, textAlign: "left" }} hoverable>
          <Title level={4}>{result.concept}</Title>
          <Paragraph>
            <strong>Meaning:</strong> {result.meaning}
          </Paragraph>
          <Paragraph>{result.details}</Paragraph>

          {result.examples && result.examples.length > 0 && (
            <div>
              <Title level={5}>Examples:</Title>
              <ul>
                {result.examples.map((ex, idx) => (
                  <li key={idx} style={{ marginBottom: 12 }}>
                    <strong>{ex.japanese}</strong> ({ex.romaji}) <br />
                    {ex.english}
                    {ex.vocab && ex.vocab.length > 0 && (
                      <ul>
                        {ex.vocab.map((v, vIdx) => (
                          <li key={vIdx}>
                            {v.word} ({v.romaji}) - {v.meaning}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default GrammarSearch;
