import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Form, Spinner, Container, Row, Col } from "react-bootstrap";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [candidateId, setCandidateId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return alert("Please upload a resume (PDF/DOCX).");

    const form = new FormData();
    form.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("https://career-conversation-xckj.onrender.com/upload_resume", form);
      const data = res.data;
      setCandidateId(data.candidate_id);

      if (data.missing_fields && data.missing_fields.length > 0) {
        setMissingFields(data.missing_fields);
      } else {
        setFormData({ name: "", email: "", phone: "" });
        navigate(`/chat/${data.candidate_id}`, {
          state: { initialMessages: data.messages || [], firstQuestion: data.first_question },
        });
      }
    } catch (err) {
      console.error(err);
      alert("Resume upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleMissingInfoSubmit = async () => {
    if (!candidateId) return;

    const form = new FormData();
    form.append("candidate_id", candidateId);
    missingFields.forEach((field) => form.append(field, formData[field]?.trim() || ""));

    try {
      setLoading(true);
      const res = await axios.post("https://career-conversation-xckj.onrender.com/submit_missing_info", form);
      const data = res.data;

      if (data.missing_fields && data.missing_fields.length > 0) {
        setMissingFields(data.missing_fields);
      } else {
        setFormData({ name: "", email: "", phone: "" });
        setMissingFields([]);
        setFile(null);
        navigate(`/chat/${data.candidate_id}`, {
          state: { initialMessages: data.messages || [], firstQuestion: data.first_question },
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit missing info.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={7} lg={6}>
          <div className="p-4 rounded-4 border">
            <h2 className="text-center mb-3">📄 Upload Your Resume</h2>
            <p className="text-muted text-center mb-4">
              Kickstart your <strong>AI-powered interview</strong> by uploading 
              your resume. Our system will analyze your profile and begin with 
              the first tailored question.
            </p>

            {!missingFields.length ? (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label><strong>Select Resume (PDF/DOCX)</strong></Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.docx"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setMissingFields([]);
                      setCandidateId(null);
                    }}
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={loading}
                    size="lg"
                    style={{ borderRadius: "12px" }}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                        Uploading...
                      </>
                    ) : "🚀 Start Interview"}
                  </Button>
                </div>
              </Form>
            ) : (
              <Form>
                <h5 className="mb-3 text-center">Please provide missing information:</h5>
                {missingFields.includes("name") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </Form.Group>
                )}
                {missingFields.includes("email") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </Form.Group>
                )}
                {missingFields.includes("phone") && (
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </Form.Group>
                )}

                <div className="d-grid">
                  <Button
                    variant="success"
                    onClick={handleMissingInfoSubmit}
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />{" "}
                        Submitting...
                      </>
                    ) : "✅ Submit Info"}
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ResumeUpload;
