import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Container, Button, Form, ListGroup, Badge, Spinner } from "react-bootstrap";

const ChatPage = () => {
  const location = useLocation();
  const { initialMessages = [], firstQuestion } = location.state || {};
  const [messages, setMessages] = useState(initialMessages);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const candidateId = window.location.pathname.split("/chat/")[1]; // get ID from URL

  const handleSubmit = async () => {
    if (!answer.trim()) return alert("Please type your answer.");

    const form = new FormData();
    form.append("candidate_id", candidateId);
    form.append("answer", answer);

    try {
      setLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/chat", form);
      const data = res.data;

      if (data.error) {
        alert(data.error);
        return;
      }

      setMessages(data.messages || []);
      setAnswer("");

      if (data.finished) {
        alert(`Interview completed!\nFinal Score: ${data.final_score.toFixed(2)}\nSummary: ${data.summary}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <h3 className="mb-4 text-center">📝 AI Interview</h3>
      <ListGroup className="mb-3">
        {messages.map((m, idx) => (
          <ListGroup.Item key={idx} className="mb-2 rounded-3">
            <p><strong>Q{m.question_no} ({m.difficulty})</strong>: {m.question}</p>
            <p>
              <strong>A:</strong>{" "}
              {m.answer ? m.answer : <em className="text-muted">Pending</em>}
            </p>
            <p>
              <strong>Score:</strong>{" "}
              {m.score !== null ? <Badge bg="secondary">{m.score.toFixed(2)}</Badge> : "-"}
            </p>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {!messages[messages.length - 1]?.finished && (
        <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <Form.Group className="mb-3">
            <Form.Label>Your Answer</Form.Label>
            <Form.Control
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </Form.Group>
          <div className="d-grid mb-4">
            <Button variant="primary" onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                  Submitting...
                </>
              ) : "Submit Answer"}
            </Button>
          </div>
        </Form>
      )}
    </Container>
  );
};

export default ChatPage;
