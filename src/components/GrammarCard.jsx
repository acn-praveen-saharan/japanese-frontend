import React from "react";
import { Card, Typography } from "antd";

const { Title, Paragraph } = Typography;

const GrammarCard = ({ grammar }) => {
  if (!grammar) return null;

  return (
    <Card style={{ marginBottom: 24 }} hoverable>
      <Title level={4}>{grammar.concept}</Title>
      <Paragraph>
        <strong>Meaning:</strong> {grammar.meaning}
      </Paragraph>
      <Paragraph>{grammar.details}</Paragraph>

      {grammar.examples && (
        <div>
          <Title level={5}>Examples:</Title>
          <ul>
            {grammar.examples.map((ex, idx) => (
              <li key={idx} style={{ marginBottom: 12 }}>
                <p>
                  <strong>{ex.japanese}</strong> ({ex.romaji})  
                  <br /> → {ex.english}
                </p>

                {ex.vocab && ex.vocab.length > 0 && (
                  <ul style={{ marginLeft: 20 }}>
                    {ex.vocab.map((v, vIdx) => (
                      <li key={vIdx}>
                        <em>{v.word}</em> ({v.romaji}) - {v.meaning}
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
  );
};

export default GrammarCard;
