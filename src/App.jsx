import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Tab } from "react-bootstrap";
import ResumeUpload from "./components/ResumeUpload";
import Chat from "./components/Chat";
import Interviewee from "./pages/Interviewee";
import Interviewer from "./pages/Interviewer";

function App() {
  return (
    <Router>
      <Container className="mt-4">
        <h2 className="text-center mb-4">🚀 Smart Interview Platform</h2>
        <p className="text-muted text-center mb-4">
          A seamless space where <strong>candidates</strong> upload resumes, connect with 
          <strong> interviewers</strong>, and practice in real-time.  
        </p>

        <Tab.Container defaultActiveKey="interviewee">
          <Nav variant="tabs" className="justify-content-center mb-2">
            <Nav.Item>
              <Nav.Link as={Link} to="/" eventKey="interviewee">
                🎓 Interviewee
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/interviewer" eventKey="interviewer">
                💼 Interviewer
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Routes>
            <Route path="/" element={<ResumeUpload />} />
            <Route path="/resume-upload" element={<ResumeUpload />} />
            <Route path="/chat/:candidateId" element={<Chat />} />
            <Route path="/interviewee" element={<Interviewee />} />
            <Route path="/interviewer" element={<Interviewer />} />
          </Routes>
        </Tab.Container>
      </Container>
    </Router>
  );
}

export default App;
