import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Spinner,
  Row,
  Col,
  Badge,
  ListGroup,
  Accordion,
  Card,
} from "react-bootstrap";

const Interviewer = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/candidates");
        setCandidates(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status" />
        <span className="ms-2">Loading candidates...</span>
      </div>
    );

  if (!candidates.length)
    return (
      <p className="text-muted text-center mt-5">
        ⚠️ No candidates found for review.
      </p>
    );

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">🧑‍💼 Interviewer Dashboard</h2>
      <p className="text-muted text-center mb-5">
        Review candidate details, performance scores, and interview summaries in
        one place. Track progress and identify top talent with ease.
      </p>

      <Row>
        {candidates.map((c) => (
          <Col md={6} key={c.id} className="mb-4">
            <Card className="p-3 border rounded-3 shadow-sm">
              <h4 className="mb-3">{c.resume?.name || "Unknown Candidate"}</h4>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Email:</strong> {c.resume?.email || "N/A"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Phone:</strong> {c.resume?.phone || "N/A"}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Score:</strong>{" "}
                  <Badge bg="info">
                    {typeof c.score === "number" ? c.score.toFixed(2) : "-"}
                  </Badge>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Status:</strong>{" "}
                  <Badge bg={c.finished ? "success" : "warning"}>
                    {c.finished ? "Finished" : "In Progress"}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>

              {c.finished && c.summary && (
                <div className="mt-3 p-2 border rounded-2 bg-light">
                  <h5>📑 Interview Summary</h5>
                  <p>{c.summary}</p>
                </div>
              )}

              {c.messages && c.messages.length > 0 && (
                <Accordion className="mt-3">
                  <Accordion.Item eventKey={c.id}>
                    <Accordion.Header>❓ Questions & Answers</Accordion.Header>
                    <Accordion.Body>
                      {c.messages.map((msg, idx) => (
                        <div
                          key={msg.question_no || idx}
                          className="mb-3 p-2 border rounded-2"
                        >
                          <p>
                            <strong>
                              Q{msg.question_no || idx + 1} [{msg.difficulty || "N/A"}]
                            </strong>
                            : {msg.question || "-"}
                          </p>
                          <p>
                            <strong>Answer:</strong>{" "}
                            {msg.answer || <em className="text-muted">Not answered yet</em>}
                          </p>
                          <p>
                            <strong>Score:</strong>{" "}
                            {typeof msg.score === "number" ? (
                              <Badge bg="secondary">{msg.score.toFixed(2)}</Badge>
                            ) : (
                              "-"
                            )}
                          </p>
                          {msg.time_limit && (
                            <p>
                              <strong>Time Limit:</strong>{" "}
                              <Badge bg="light" text="dark">
                                {msg.time_limit}s
                              </Badge>
                            </p>
                          )}
                        </div>
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Interviewer;
