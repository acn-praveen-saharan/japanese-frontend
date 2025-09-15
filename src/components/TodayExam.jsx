import React, { useEffect, useState } from "react";
import { Card, Typography, Spin, Button, Radio, Progress, Collapse } from "antd";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

function TodayExam() {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await fetch(
          "https://japanese-nx-gqducnd9c8d4fjbg.canadacentral-01.azurewebsites.net/api/exam/today"
        );
        const data = await res.json();
        setExam(data);
      } catch (err) {
        console.error("Error fetching exam:", err);
      }
      setLoading(false);
    };

    fetchExam();
  }, []);

  const handleAnswer = (qid, optionId) => {
    setAnswers((prev) => ({ ...prev, [qid]: optionId }));
  };

  const handleSubmit = () => {
    if (!exam) return;
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading Today’s Exam..." />
      </div>
    );
  }

  if (!exam) {
    return <Text type="danger">No exam available today.</Text>;
  }

  // Calculate score
  const correctCount = exam.questions.filter((q) => {
    const selected = answers[q.question_id];
    const correct = q.options.find((o) => o.is_correct);
    return selected && selected === correct?.option_id;
  }).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Exam Header */}
      <Card className="mb-6 shadow-lg rounded-xl border border-gray-200">
        <Title level={3} className="!text-blue-700">
          📘 Today’s Exam
        </Title>
        <Paragraph className="!text-gray-600">
          Batch ID: <Text strong>{exam.batch_id}</Text> <br />
          Created At: {new Date(exam.created_at).toLocaleString()}
        </Paragraph>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div>
            <Text strong className="block mb-2 text-pink-600">
              Grammar to Review:
            </Text>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              {exam.grammar_list.map((g, i) => (
                <li key={i}>{g}</li>
              ))}
            </ul>
          </div>
          <div>
            <Text strong className="block mb-2 text-green-600">
              Kanji to Review:
            </Text>
            <div className="flex flex-wrap gap-2 text-2xl">
              {exam.kanji_list.map((k, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-gray-100 rounded-lg shadow-sm"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Questions */}
      {exam.questions.map((q, idx) => {
        const selected = answers[q.question_id];
        const correctOption = q.options.find((o) => o.is_correct);

        return (
          <Card
            key={q.question_id}
            className="mb-6 shadow-md rounded-xl border border-gray-100"
          >
            <Title level={4} className="!mb-3">
              Q{idx + 1}. {q.question_type}
            </Title>
            <Paragraph className="!mb-4">{q.question_text}</Paragraph>

            <Radio.Group
              onChange={(e) => handleAnswer(q.question_id, e.target.value)}
              value={selected}
              disabled={submitted}
              className="flex flex-col gap-2"
            >
              {q.options.map((opt) => (
                <Radio key={opt.option_id} value={opt.option_id}>
                  {opt.option_text}
                </Radio>
              ))}
            </Radio.Group>

            {/* Show explanation after submit */}
            {submitted && (
              <div className="mt-4">
                {selected === correctOption.option_id ? (
                  <Text type="success">✅ Correct!</Text>
                ) : (
                  <Text type="danger">
                    ❌ Incorrect. Correct Answer: {correctOption.option_text}
                  </Text>
                )}
                <Paragraph className="!mt-2 text-gray-600">
                  💡 {q.explanation}
                </Paragraph>
              </div>
            )}
          </Card>
        );
      })}

      {/* Submit + Result */}
      {!submitted ? (
        <div className="text-center mt-8">
          <Button
            type="primary"
            size="large"
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
          >
            Submit Exam
          </Button>
        </div>
      ) : (
        <Card className="mt-8 p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-50 to-blue-50 border border-gray-200">
          <Title level={3} className="!text-center !text-blue-700">
            🎉 Exam Finished!
          </Title>
          <Paragraph className="!text-center !text-lg !mb-4">
            You got <Text strong>{correctCount}</Text> out of{" "}
            <Text strong>{exam.questions.length}</Text> correct.
          </Paragraph>

          <Progress
            percent={Math.round(
              (correctCount / exam.questions.length) * 100
            )}
            status="active"
            strokeColor={{
              from: "#108ee9",
              to: "#87d068",
            }}
          />

          <Collapse accordion className="mt-6 bg-white rounded-lg">
            {exam.questions.map((q, idx) => (
              <Panel header={`Q${idx + 1}: ${q.question_type}`} key={q.question_id}>
                <p>
                  <Text strong>Question:</Text> {q.question_text}
                </p>
                <p>
                  <Text strong>Correct Answer:</Text>{" "}
                  {q.options.find((o) => o.is_correct)?.option_text}
                </p>
                <p>
                  <Text strong>Explanation:</Text> {q.explanation}
                </p>
              </Panel>
            ))}
          </Collapse>
        </Card>
      )}
    </div>
  );
}

export default TodayExam;
